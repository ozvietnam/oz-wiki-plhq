// Dựng chỉ mục điều khoản (nguyên văn nguồn A + tóm tắt nháp doc-hieu) và chỉ mục hóa chất theo mã CAS.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, bacNguon, homNay, LUOC_DO_PHIEN_BAN } from './registry.mjs';
import { docCsv, kiemDanhMucCas, COT_CAS } from './danh-muc.mjs';

export const GIAY_PHEP = 'CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/';
export const MIEN_TRU = 'Tham khảo, không phải tư vấn pháp lý. Xem và đối chiếu văn bản gốc nguồn bậc A trước khi áp dụng.';
export const CANH_BAO_TANG_NHAP =
  'Tầng TOM_TAT_NHAP được trích tự động bởi LLM (da_soat: false) — CHỈ dùng để định vị điều khoản, KHÔNG trích dẫn nguyên văn hay làm căn cứ pháp lý; chỉ dùng NGUYEN_VAN_NGUON_A để trích dẫn căn cứ.';

const SUFFIXES = ['-body-ocr', '-ocr-body', '-toanvan', '-body', '-ocr', '-tiep'];
const RE_DIEU_SO = /^(?:Điều\s+(\d+)|(\d+)[.)]?)\s*$/i;

function nguonADauTien(d, nguonMap) {
  return (d?.nguon || []).find((n) => bacNguon(n.url, nguonMap) === 'A')?.url || null;
}

/** Bỏ đuôi kỹ thuật (-body, -ocr, -tiep, -toanvan...) tương tự norm_slug trong gop-doc-hieu.py. */
export function chuanHoaSlugDocHieu(slug) {
  let s = String(slug || '');
  let changed = true;
  while (changed) {
    changed = false;
    for (const suf of SUFFIXES) {
      if (s.endsWith(suf) && s.length > suf.length + 1) {
        s = s.slice(0, -suf.length);
        changed = true;
        break;
      }
    }
  }
  return s;
}

function timVanBanTheoSlug(rawSlug, so, bySlug) {
  let ns = chuanHoaSlugDocHieu(rawSlug);
  if (bySlug.has(ns)) return { d: bySlug.get(ns), slug: ns };
  if (ns.endsWith('ocr') && !ns.endsWith('-ocr') && bySlug.has(ns.slice(0, -3))) {
    const trimmed = ns.slice(0, -3);
    return { d: bySlug.get(trimmed), slug: trimmed };
  }
  const yrMatches = so.vanBan.filter(
    (d) => d._slug.startsWith(`${ns}-`) && /^\d{4}$/.test(d._slug.slice(ns.length + 1)),
  );
  if (yrMatches.length === 1) return { d: yrMatches[0], slug: yrMatches[0]._slug };
  return { d: null, slug: ns };
}

function chuanBanGhiDieuKhoan(rec) {
  return {
    dieu: rec.dieu ?? null,
    ten: rec.ten ?? null,
    tom_tat: rec.tom_tat ?? null,
    nghia_vu_xnk: Array.isArray(rec.nghia_vu_xnk)
      ? rec.nghia_vu_xnk.map(String).filter((x) => x.trim())
      : [],
    nguon_trich: rec.nguon_trich ?? null,
    da_soat: false,
  };
}

function gopDieuKhoanNhieuTep(existing, incoming) {
  // Khi nhiều tệp .dieu.jsonl trỏ về cùng 1 văn bản (vd *-body + bản gộp), ưu tiên bản đầy đủ hơn cho Điều N trùng.
  const out = [...existing];
  const byDieuSo = new Map();
  const exactSeen = new Set();
  out.forEach((item, idx) => {
    const mm = String(item.dieu || '').trim().match(RE_DIEU_SO);
    if (mm) byDieuSo.set(mm[1] || mm[2], idx);
    exactSeen.add(`${item.dieu ?? ''}\0${item.ten ?? ''}`);
  });
  for (const item of incoming) {
    const mm = String(item.dieu || '').trim().match(RE_DIEU_SO);
    const key = `${item.dieu ?? ''}\0${item.ten ?? ''}`;
    if (mm) {
      const n = mm[1] || mm[2];
      if (byDieuSo.has(n)) {
        const prevIdx = byDieuSo.get(n);
        if (JSON.stringify(item).length > JSON.stringify(out[prevIdx]).length) {
          out[prevIdx] = item;
        }
        continue;
      }
      byDieuSo.set(n, out.length);
    } else if (exactSeen.has(key)) {
      continue;
    }
    exactSeen.add(key);
    out.push(item);
  }
  return out;
}

export function dungDieuKhoan(so, root = ROOT, today = homNay()) {
  const nguyen_van_nguon_a = so.vanBan
    .filter((d) => Array.isArray(d.xac_minh?.dieu_khoan) && d.xac_minh.dieu_khoan.length)
    .map((d) => ({
      so_hieu: d.so_hieu,
      slug: d._slug,
      ten: d.ten,
      tinh_trang: d.tinh_trang,
      hieu_luc_tu: d.hieu_luc_tu || null,
      het_hieu_luc_tu: d.het_hieu_luc_tu || null,
      hieu_luc_da_doi_chieu: d.xac_minh?.hieu_luc_da_doi_chieu === true,
      nguon_a: nguonADauTien(d, so.nguon),
      tang_tin_cay: 'NGUYEN_VAN_NGUON_A',
      dieu_khoan: d.xac_minh.dieu_khoan,
    }));

  const bySlug = new Map(so.vanBan.map((d) => [d._slug, d]));
  const dhDir = join(root, 'data', 'doc-hieu');
  const nhom = new Map();
  let soTepDocHieu = 0;
  let soDongLoi = 0;

  if (existsSync(dhDir)) {
    const files = readdirSync(dhDir).filter((f) => f.endsWith('.dieu.jsonl')).sort();
    // Đọc tệp chuẩn trước tệp có hậu tố kỹ thuật (-body, -ocr...) để thứ tự ổn định.
    files.sort((a, b) => {
      const sa = chuanHoaSlugDocHieu(a.replace(/\.dieu\.jsonl$/, ''));
      const sb = chuanHoaSlugDocHieu(b.replace(/\.dieu\.jsonl$/, ''));
      if (sa !== sb) return sa.localeCompare(sb);
      return a.length - b.length || a.localeCompare(b);
    });

    for (const f of files) {
      soTepDocHieu += 1;
      const rawSlug = f.replace(/\.dieu\.jsonl$/, '');
      const { d, slug } = timVanBanTheoSlug(rawSlug, so, bySlug);
      const raw = readFileSync(join(dhDir, f), 'utf8');
      const items = [];
      for (const line of raw.split(/\r?\n/)) {
        const s = line.trim();
        if (!s) continue;
        try {
          const rec = JSON.parse(s);
          if (!rec || typeof rec !== 'object' || Array.isArray(rec)) {
            soDongLoi += 1;
            continue;
          }
          items.push(chuanBanGhiDieuKhoan(rec));
        } catch {
          soDongLoi += 1;
        }
      }
      if (!nhom.has(slug)) {
        nhom.set(slug, {
          so_hieu: d?.so_hieu || null,
          slug,
          tinh_trang: d?.tinh_trang || null,
          hieu_luc_tu: d?.hieu_luc_tu || null,
          het_hieu_luc_tu: d?.het_hieu_luc_tu || null,
          nguon_a: nguonADauTien(d, so.nguon),
          tang_tin_cay: 'TOM_TAT_NHAP',
          da_soat: false,
          dieu_khoan: items,
        });
      } else {
        const cur = nhom.get(slug);
        cur.dieu_khoan = gopDieuKhoanNhieuTep(cur.dieu_khoan, items);
      }
    }
  }

  const tom_tat_nhap = [...nhom.values()];
  const soDieuKhoanNguonA = nguyen_van_nguon_a.reduce((n, x) => n + x.dieu_khoan.length, 0);
  const soDieuKhoanTomTat = tom_tat_nhap.reduce((n, x) => n + x.dieu_khoan.length, 0);

  return {
    phien_ban: today,
    luoc_do_phien_ban: LUOC_DO_PHIEN_BAN,
    giay_phep: GIAY_PHEP,
    mien_tru: MIEN_TRU,
    canh_bao_tang_nhap: CANH_BAO_TANG_NHAP,
    thong_ke: {
      so_van_ban_nguon_a: nguyen_van_nguon_a.length,
      so_dieu_khoan_nguon_a: soDieuKhoanNguonA,
      so_van_ban_tom_tat_nhap: tom_tat_nhap.length,
      so_dieu_khoan_tom_tat_nhap: soDieuKhoanTomTat,
      so_tep_doc_hieu: soTepDocHieu,
      so_dong_loi: soDongLoi,
    },
    nguyen_van_nguon_a,
    tom_tat_nhap,
  };
}

export function dungCasIndex(so, root = ROOT, today = homNay()) {
  const bySlug = new Map(so.vanBan.map((d) => [d._slug, d]));
  const dmDir = join(root, 'danh-muc');
  const theo_cas = {};
  const khong_co_cas = [];
  let soTep = 0;
  let soTepLoi = 0;
  let tongDong = 0;
  let soDongCoCas = 0;

  if (existsSync(dmDir)) {
    const files = readdirSync(dmDir).filter((f) => f.endsWith('-cas.csv')).sort();
    for (const f of files) {
      const tep = `danh-muc/${f}`;
      const raw = readFileSync(join(dmDir, f), 'utf8');
      if (kiemDanhMucCas(tep, raw).length) {
        soTepLoi += 1;
        continue;
      }
      soTep += 1;
      const docSlug = f.replace(/-cas\.csv$/, '');
      const d = bySlug.get(docSlug) || null;
      const vbMeta = {
        so_hieu: d?.so_hieu || null,
        slug: d ? d._slug : docSlug,
        tinh_trang: d?.tinh_trang || null,
        hieu_luc_tu: d?.hieu_luc_tu || null,
        het_hieu_luc_tu: d?.het_hieu_luc_tu || null,
        hieu_luc_da_doi_chieu: d?.xac_minh?.hieu_luc_da_doi_chieu === true,
        nguon_a: nguonADauTien(d, so.nguon),
        tep,
      };

      const rows = docCsv(raw);
      rows.shift(); // bỏ header đã kiểm qua kiemDanhMucCas
      for (const r of rows) {
        tongDong += 1;
        const o = Object.fromEntries(COT_CAS.map((c, j) => [c, (r[j] ?? '').trim()]));
        const entry = {
          cas: o.cas || null,
          ten_chat: o.ten_chat,
          ma_hoa_chat: o.ma_hoa_chat || null,
          cong_thuc: o.cong_thuc || null,
          phan_loai: o.phan_loai,
          phu_luc: o.phu_luc,
          muc: o.muc || null,
          so_thu_tu: o.so_thu_tu || null,
          nhom: o.nhom || null,
          nguong_kg: o.nguong_kg || null,
          nguon: o.nguon,
          ...vbMeta,
        };
        if (o.cas) {
          soDongCoCas += 1;
          (theo_cas[o.cas] ||= []).push(entry);
        } else {
          khong_co_cas.push(entry);
        }
      }
    }
  }

  return {
    phien_ban: today,
    luoc_do_phien_ban: LUOC_DO_PHIEN_BAN,
    giay_phep: GIAY_PHEP,
    mien_tru: MIEN_TRU,
    thong_ke: {
      so_tep: soTep,
      so_tep_loi: soTepLoi,
      tong_dong: tongDong,
      so_dong_co_cas: soDongCoCas,
      so_ma_cas_duy_nhat: Object.keys(theo_cas).length,
      so_dong_khong_co_cas: khong_co_cas.length,
    },
    theo_cas,
    khong_co_cas,
  };
}
