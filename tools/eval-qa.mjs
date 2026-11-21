#!/usr/bin/env node
/**
 * Đánh giá độ phủ tri thức & chất lượng câu hỏi nghiệp vụ hải quan - XNK.
 *
 * Chấm 3 tiêu chí trên bộ câu hỏi `eval/cau-hoi-nghiep-vu.yaml`:
 *   (a) Toàn bộ `van_ban_bat_buoc` có trong sổ, `tinh_trang !== 'HET_HIEU_LUC'`,
 *       `xac_minh.muc === 'NGUON_A'` và `xac_minh.hieu_luc_da_doi_chieu === true`.
 *   (b) Có ít nhất 1 `trang_wiki` tồn tại trong `wiki/` và không bị đánh dấu lỗi thời.
 *   (c) Có ít nhất 1 văn bản bắt buộc đã có `xac_minh.dieu_khoan` hoặc `data/doc-hieu/<slug>*.dieu.jsonl`.
 *
 * Sử dụng:
 *   node tools/eval-qa.mjs
 *   node tools/eval-qa.mjs --json
 *   node tools/eval-qa.mjs --eval eval/cau-hoi-nghiep-vu.yaml
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import yaml from 'js-yaml';
import { napSo, khoa, dungDoThi, homNay, ROOT } from './lib/registry.mjs';

const RE_SO_HIEU = /\b\d{1,4}\/(?:\d{4}\/)?(?:TT|NĐ|ND|QĐ|QD|NQ|TTLT|CT)-[A-ZĐa-z]+(?:-[A-ZĐ]+)?\b|\b\d{1,3}\/\d{4}\/QH\d{2}\b/g;
const RE_NGU_CANH_LICH_SU = /(hết(?:\s|\*|_|`)*hiệu lực|hết(?:\s|\*|_|`)*hl|có hiệu lực đến|hết hạn|đã ngưng|ngưng hiệu lực|bị thay|thay(?:\s|\*|_|`)*thế|bị bãi bỏ|bãi bỏ|tiền thân|trước đây|trước đó|từng áp dụng|trước\s+\d{1,2}\/\d{1,2}\/\d{4}|lịch sử|tạm ngưng|không còn|đã hết|cũ|chuyển tiếp|đã thay|thay cho|đừng dẫn|không dẫn|hết từ|\bthay\b|HET_HIEU_LUC)/i;
const RE_DA_XAC_NHAN_HET_HL = /(hết(?:\s|\*|_|`)*hiệu lực|HET_HIEU_LUC|đã bị bãi bỏ|bị bãi bỏ)/i;
const RE_NGU_CANH_CHUA_CAP_NHAT = /(sắp thay|sắp đổi|chưa xác minh)/i;
const RE_NGU_CANH_CHUA_HIEU_LUC = /(chưa có hiệu lực|CHUA_CO_HIEU_LUC)/i;
const RE_MUC_NGUYEN_VAN_NGUON = /^##\s*(Toàn văn|Toan van|Nguyên văn|Nguyen van|Nội dung|Noi dung|Key claims|Căn cứ pháp lý|Can cu phap ly|Điều\s+\d+|Phụ lục|Evidence)\b/i;
const HAU_TO_DOC_HIEU = ['-body-ocr', '-ocr-body', '-toanvan', '-body', '-ocr', '-tiep'];

/**
 * Chuẩn hóa tên tệp `.dieu.jsonl` về `_slug` của văn bản trong registry.
 * @param {string} tenTep
 * @returns {string}
 */
function chuanHoaSlugDocHieu(tenTep) {
  let slug = tenTep.replace(/\.dieu\.jsonl$/i, '');
  let daDoi = true;
  while (daDoi) {
    daDoi = false;
    for (const hauTo of HAU_TO_DOC_HIEU) {
      if (slug.endsWith(hauTo)) {
        slug = slug.slice(0, -hauTo.length);
        daDoi = true;
        break;
      }
    }
  }
  if (slug.endsWith('ocr') && !slug.endsWith('-ocr')) {
    slug = slug.slice(0, -3);
  }
  return slug;
}

/**
 * Quét thư mục `data/doc-hieu` và trả về tập `_slug` đã bóc tách điều khoản.
 * @param {string} root
 * @returns {Map<string, string[]>}
 */
function napChiMucDocHieu(root) {
  const dir = join(root, 'data', 'doc-hieu');
  const map = new Map();
  if (!existsSync(dir)) return map;
  for (const name of readdirSync(dir)) {
    if (!name.endsWith('.dieu.jsonl')) continue;
    const slug = chuanHoaSlugDocHieu(name);
    if (!map.has(slug)) map.set(slug, []);
    map.get(slug).push(name);
  }
  return map;
}

/**
 * Chọn bản ghi đại diện khi một khóa `theoKhoa` trỏ tới nhiều văn bản.
 * @param {object[]} ds
 * @param {string} k
 * @returns {object|null}
 */
function chonBanGhi(ds, k) {
  if (!Array.isArray(ds) || ds.length === 0) return null;
  if (ds.length === 1) return ds[0];
  const score = (d) =>
    (khoa(d.so_hieu) === k ? 8 : 0) +
    (d.tinh_trang !== 'HET_HIEU_LUC' ? 4 : 0) +
    (d.xac_minh?.muc === 'NGUON_A' ? 2 : 0);
  return [...ds].sort((a, b) => {
    const diff = score(b) - score(a);
    if (diff !== 0) return diff;
    return String(b.ngay_ban_hanh || '').localeCompare(String(a.ngay_ban_hanh || ''));
  })[0];
}

/**
 * Tra cứu văn bản trong sổ từ `theoKhoa` (mỗi khóa lưu mảng văn bản).
 * @param {Map<string, object[]>|Record<string, object[]>} theoKhoa
 * @param {string} soHieu
 * @returns {object|null}
 */
function traCuuVanBan(theoKhoa, soHieu) {
  const k = khoa(soHieu);
  if (!k) return null;
  const val = theoKhoa instanceof Map ? theoKhoa.get(k) : theoKhoa?.[k];
  if (!val) return null;
  return Array.isArray(val) ? chonBanGhi(val, k) : val;
}

/**
 * Xây dựng tập đường dẫn nhánh hợp lệ từ `so.nutCay`.
 * @param {Array<{ path?: string }>|Map|Set|Record<string, unknown>} nutCay
 * @returns {Set<string>}
 */
function taoTapNhanh(nutCay) {
  if (Array.isArray(nutCay)) return new Set(nutCay.map((n) => n?.path).filter(Boolean));
  if (nutCay instanceof Map || nutCay instanceof Set) return new Set(nutCay.keys());
  if (nutCay && typeof nutCay === 'object') return new Set(Object.keys(nutCay));
  return new Set();
}

/**
 * Đọc tệp YAML bộ câu hỏi nghiệp vụ.
 * @param {string} duongDan
 * @returns {{ phien_ban: string, tong_so_cau: number, cau_hoi: object[] }}
 */
export function docBoCauHoi(duongDan) {
  const raw = readFileSync(duongDan, 'utf8');
  const data = yaml.load(raw);
  if (!data || !Array.isArray(data.cau_hoi)) {
    throw new Error(`Tệp câu hỏi không hợp lệ hoặc thiếu mảng 'cau_hoi': ${duongDan}`);
  }
  return data;
}

/**
 * Tách nội dung thân Markdown (bỏ YAML frontmatter và fenced code blocks) thành từng dòng.
 * @param {string} noiDung
 * @returns {string[]}
 */
function tachDongThanMarkdown(noiDung) {
  const lines = noiDung.split(/\r?\n/);
  let i = 0;
  if (lines[0]?.trim() === '---') {
    i = 1;
    while (i < lines.length && lines[i].trim() !== '---') i++;
    if (i < lines.length) i++;
  }
  const ketQua = [];
  let trongCode = false;
  for (; i < lines.length; i++) {
    const dong = lines[i];
    if (/^\s*```/.test(dong)) {
      trongCode = !trongCode;
      ketQua.push('');
      continue;
    }
    ketQua.push(trongCode ? '' : dong);
  }
  return ketQua;
}

/**
 * Trích mệnh đề chứa vị trí `[viTri, viTri + doDai]` trong một dòng văn bản.
 * Tách theo `|`, `;` hoặc ranh giới câu `. ` (tránh cắt tại số thập phân như `34.2`).
 * @param {string} dong
 * @param {number} viTri
 * @param {number} doDai
 * @returns {string}
 */
function trichMenhDe(dong, viTri, doDai) {
  let start = 0;
  let end = dong.length;
  for (let i = viTri - 1; i >= 0; i--) {
    const ch = dong[i];
    if (ch === '|' || ch === ';') {
      start = i + 1;
      break;
    }
    if (ch === '.' && /\s/.test(dong[i + 1] || '') && !/\d/.test(dong[i - 1] || '')) {
      start = i + 1;
      break;
    }
  }
  for (let i = viTri + doDai; i < dong.length; i++) {
    const ch = dong[i];
    if (ch === '|' || ch === ';') {
      end = i;
      break;
    }
    if (ch === '.' && (i + 1 === dong.length || /\s/.test(dong[i + 1])) && !/\d/.test(dong[i - 1] || '')) {
      end = i + 1;
      break;
    }
  }
  return dong.slice(start, end).trim();
}

/**
 * Kiểm tra một trang wiki có tồn tại và có dấu hiệu lỗi thời hay không.
 * @param {object} ctx
 * @returns {object}
 */
function kiemTraTrangWiki({ root, slug, so, doThi, docTheoSlug, tapCanTranh }) {
  const relPath = `wiki/${slug}.md`;
  const absPath = join(root, relPath);
  if (!existsSync(absPath)) {
    return {
      slug,
      path: relPath,
      ton_tai: false,
      loi_thoi: false,
      dan_vb_can_tranh: false,
      canh_bao: ['KHONG_TON_TAI'],
    };
  }

  const canhBao = [];
  let danVbCanTranh = false;
  const laTrangNguon = slug.startsWith('sources/');

  if (laTrangNguon) {
    const vbSlug = slug.slice('sources/'.length);
    const docNguon = docTheoSlug.get(vbSlug);
    if (docNguon && docNguon.tinh_trang === 'HET_HIEU_LUC') {
      canhBao.push(`NGUON_HET_HIEU_LUC: ${docNguon.so_hieu} đã HET_HIEU_LUC`);
    }
  }

  const dongThan = tachDongThanMarkdown(readFileSync(absPath, 'utf8'));
  const daGhi = new Set();
  let mucHienTai = '';
  let boQuaNguyenVan = false;

  for (let idx = 0; idx < dongThan.length; idx++) {
    const dong = dongThan[idx];
    if (!dong) continue;
    if (/^##\s+/.test(dong)) {
      mucHienTai = dong;
      boQuaNguyenVan = laTrangNguon && RE_MUC_NGUYEN_VAN_NGUON.test(dong);
      continue;
    }
    if (boQuaNguyenVan) continue;

    const regex = new RegExp(RE_SO_HIEU.source, 'g');
    const matches = [...dong.matchAll(regex)];
    if (!matches.length) continue;

    const laBangHoacMuc = /^\s*(?:\||[-*]\s)/.test(dong);
    const nguCanhRong = laBangHoacMuc
      ? `${mucHienTai} ${dong}`
      : `${mucHienTai} ${dongThan[idx - 1] || ''} ${dong}`;

    for (const m of matches) {
      const rawSo = m[0];
      const k = khoa(rawSo);
      const doc = traCuuVanBan(so.theoKhoa, rawSo);
      if (!doc || doc.loai === 'THONG_BAO') continue;

      const menhDe = trichMenhDe(dong, m.index ?? 0, rawSo.length);
      const laCanTranh = tapCanTranh.has(k);
      const laLichSu = RE_NGU_CANH_LICH_SU.test(nguCanhRong);
      const nutDoThi = doThi.nguoc.get(k);
      const coVbThayThe = Boolean(nutDoThi?.bi_thay_the_boi?.length || nutDoThi?.bi_bai_bo_boi?.length);

      const capNhatCu = menhDe.match(RE_NGU_CANH_CHUA_CAP_NHAT);
      const biDanhDauChuaCapNhat =
        Boolean(capNhatCu) &&
        (/(sắp thay|sắp đổi)/i.test(capNhatCu[0]) || !RE_DA_XAC_NHAN_HET_HL.test(menhDe));

      if (doc.tinh_trang === 'HET_HIEU_LUC') {
        if (!laLichSu) {
          const msg = `${slug}: dòng ${idx + 1} dẫn ${doc.so_hieu} (HET_HIEU_LUC) không kèm ngữ cảnh lịch sử/thay thế`;
          if (!daGhi.has(msg)) {
            canhBao.push(msg);
            daGhi.add(msg);
          }
          if (laCanTranh) danVbCanTranh = true;
        } else if (biDanhDauChuaCapNhat && coVbThayThe) {
          const msg = `${slug}: dòng ${idx + 1} ghi "${rawSo}" theo ngữ cảnh cũ (${capNhatCu[0]}) dù đã có văn bản thay thế/bãi bỏ`;
          if (!daGhi.has(msg)) {
            canhBao.push(msg);
            daGhi.add(msg);
          }
          if (laCanTranh) danVbCanTranh = true;
        }
      } else if (doc.tinh_trang === 'CON_HIEU_LUC' && RE_NGU_CANH_CHUA_HIEU_LUC.test(menhDe)) {
        const msg = `${slug}: dòng ${idx + 1} đánh dấu ${doc.so_hieu} là chưa có hiệu lực dù sổ ghi CON_HIEU_LUC`;
        if (!daGhi.has(msg)) {
          canhBao.push(msg);
          daGhi.add(msg);
        }
      }
    }
  }

  return {
    slug,
    path: relPath,
    ton_tai: true,
    loi_thoi: canhBao.length > 0,
    dan_vb_can_tranh: danVbCanTranh,
    canh_bao: canhBao,
  };
}

/**
 * Chấm điểm 1 câu hỏi theo 3 tiêu chí (a), (b), (c).
 * @param {object} cauHoi
 * @param {object} ctx
 * @returns {object}
 */
export function chamCauHoi(cauHoi, ctx) {
  const { root, so, doThi, docHieuMap, docTheoSlug } = ctx;
  const batBuoc = Array.isArray(cauHoi.van_ban_bat_buoc) ? cauHoi.van_ban_bat_buoc : [];
  const canTranh = Array.isArray(cauHoi.van_ban_het_hieu_luc_can_tranh) ? cauHoi.van_ban_het_hieu_luc_can_tranh : [];
  const trangWiki = Array.isArray(cauHoi.trang_wiki) ? cauHoi.trang_wiki : [];

  const chiTietVb = batBuoc.map((soHieu) => {
    const doc = traCuuVanBan(so.theoKhoa, soHieu);
    if (!doc) {
      return {
        so_hieu: soHieu,
        ton_tai: false,
        tinh_trang: null,
        muc: null,
        hieu_luc_da_doi_chieu: false,
        dat_a: false,
        co_dieu_khoan: false,
        co_doc_hieu: false,
        dat_c: false,
      };
    }
    const coDieuKhoan = Array.isArray(doc.xac_minh?.dieu_khoan) && doc.xac_minh.dieu_khoan.length > 0;
    const tepDocHieu = docHieuMap.get(doc._slug) || [];
    const coDocHieu = tepDocHieu.length > 0;
    const hieuLucDoiChieu = doc.xac_minh?.hieu_luc_da_doi_chieu === true;
    const muc = doc.xac_minh?.muc || null;
    const tinhTrang = doc.tinh_trang || null;
    const datA = tinhTrang !== 'HET_HIEU_LUC' && muc === 'NGUON_A' && hieuLucDoiChieu;

    return {
      so_hieu: doc.so_hieu,
      slug: doc._slug,
      ton_tai: true,
      tinh_trang: tinhTrang,
      muc,
      hieu_luc_da_doi_chieu: hieuLucDoiChieu,
      dat_a: datA,
      co_dieu_khoan: coDieuKhoan,
      so_dieu_xac_minh: coDieuKhoan ? doc.xac_minh.dieu_khoan.length : 0,
      co_doc_hieu: coDocHieu,
      tep_doc_hieu: tepDocHieu,
      dat_c: coDieuKhoan || coDocHieu,
    };
  });

  const vbCanTranhThieu = canTranh
    .map((s) => ({ so_hieu: s, doc: traCuuVanBan(so.theoKhoa, s) }))
    .filter((x) => !x.doc)
    .map((x) => x.so_hieu);

  const tapCanTranh = new Set(canTranh.map((s) => khoa(s)));
  const chiTietWiki = trangWiki.map((slug) =>
    kiemTraTrangWiki({ root, slug, so, doThi, docTheoSlug, tapCanTranh }),
  );

  const tieuChiA = batBuoc.length > 0 && chiTietVb.every((v) => v.dat_a);
  const wikiTonTai = chiTietWiki.filter((w) => w.ton_tai);
  const wikiSach = wikiTonTai.filter((w) => !w.loi_thoi);
  const coDanVbCanTranh = wikiTonTai.some((w) => w.dan_vb_can_tranh);
  const tieuChiB = wikiTonTai.length > 0 && wikiSach.length > 0 && !coDanVbCanTranh;
  const tieuChiC = batBuoc.length > 0 && chiTietVb.some((v) => v.dat_c);

  const vbConHieuLucTrongSo = chiTietVb.filter(
    (v) => v.ton_tai && v.tinh_trang !== 'HET_HIEU_LUC',
  ).length;

  let trangThai;
  if (tieuChiA && tieuChiB && tieuChiC) {
    trangThai = 'DAT_NGUON_A';
  } else if (
    batBuoc.length === 0 ||
    (!tieuChiA && !tieuChiB && !tieuChiC && vbConHieuLucTrongSo === 0)
  ) {
    trangThai = 'CHUA_PHU';
  } else {
    trangThai = 'MOT_PHAN';
  }

  const canhBaoWiki = chiTietWiki.flatMap((w) => w.canh_bao.filter((c) => c !== 'KHONG_TON_TAI'));

  return {
    id: cauHoi.id,
    nhanh: cauHoi.nhanh,
    nhanh_hop_le: ctx.tapNhanh.has(cauHoi.nhanh),
    cau_hoi: cauHoi.cau_hoi,
    nguon_can_cu_ky_vong: cauHoi.nguon_can_cu_ky_vong || '',
    tieu_chi_a: tieuChiA,
    tieu_chi_b: tieuChiB,
    tieu_chi_c: tieuChiC,
    trang_thai: trangThai,
    chi_tiet_vb: chiTietVb,
    chi_tiet_wiki: chiTietWiki,
    canh_bao_wiki: canhBaoWiki,
    vb_can_tranh_khong_co_trong_so: vbCanTranhThieu,
  };
}

/**
 * Tính % làm tròn 1 chữ số thập phân.
 * @param {number} tu
 * @param {number} mau
 * @returns {number}
 */
function phanTram(tu, mau) {
  if (!mau) return 0;
  return Math.round((tu / mau) * 1000) / 10;
}

/**
 * Chạy đánh giá toàn bộ bộ câu hỏi trên sổ và wiki hiện tại.
 * @param {{ root?: string, evalPath?: string }} [opts]
 * @returns {object}
 */
export function danhGiaBoCauHoi(opts = {}) {
  const root = opts.root || ROOT;
  const evalPath = opts.evalPath || join(root, 'eval', 'cau-hoi-nghiep-vu.yaml');
  const boCauHoi = docBoCauHoi(evalPath);
  const so = napSo(root);
  const doThi = dungDoThi(so);
  const docHieuMap = napChiMucDocHieu(root);
  const docTheoSlug = new Map(so.vanBan.map((d) => [d._slug, d]));
  const tapNhanh = taoTapNhanh(so.nutCay);

  const ctx = { root, so, doThi, docHieuMap, docTheoSlug, tapNhanh };
  const ketQua = boCauHoi.cau_hoi.map((c) => chamCauHoi(c, ctx));

  const tongSoCau = ketQua.length;
  const datNguonA = ketQua.filter((r) => r.trang_thai === 'DAT_NGUON_A').length;
  const motPhan = ketQua.filter((r) => r.trang_thai === 'MOT_PHAN').length;
  const chuaPhu = ketQua.filter((r) => r.trang_thai === 'CHUA_PHU').length;
  const soDatA = ketQua.filter((r) => r.tieu_chi_a).length;
  const soDatB = ketQua.filter((r) => r.tieu_chi_b).length;
  const soDatC = ketQua.filter((r) => r.tieu_chi_c).length;
  const nhanhKhongHopLe = ketQua.filter((r) => !r.nhanh_hop_le).map((r) => `${r.id}:${r.nhanh}`);

  return {
    ngay_danh_gia: homNay(),
    phien_ban_bo_cau_hoi: String(boCauHoi.phien_ban || ''),
    tep_cau_hoi: evalPath,
    tong_so_cau: tongSoCau,
    tong_van_ban_trong_so: so.vanBan.length,
    tong_ket: {
      DAT_NGUON_A: datNguonA,
      MOT_PHAN: motPhan,
      CHUA_PHU: chuaPhu,
      ti_le_dat_nguon_a_pct: phanTram(datNguonA, tongSoCau),
      ti_le_phu_toi_thieu_pct: phanTram(datNguonA + motPhan, tongSoCau),
      ti_le_chua_phu_pct: phanTram(chuaPhu, tongSoCau),
      tieu_chi_a: { dat: soDatA, ti_le_pct: phanTram(soDatA, tongSoCau) },
      tieu_chi_b: { dat: soDatB, ti_le_pct: phanTram(soDatB, tongSoCau) },
      tieu_chi_c: { dat: soDatC, ti_le_pct: phanTram(soDatC, tongSoCau) },
      nhanh_khong_hop_le: nhanhKhongHopLe,
    },
    chi_tiet: ketQua,
  };
}

/**
 * Mô tả ngắn gọn lý do chưa đạt cho bảng Markdown.
 * @param {object} r
 * @returns {string}
 */
function tomTatGhiChu(r) {
  const ghiChu = [];
  if (!r.nhanh_hop_le) ghiChu.push(`Nhánh không khớp cây: ${r.nhanh}`);
  const vbThieu = r.chi_tiet_vb.filter((v) => !v.ton_tai).map((v) => v.so_hieu);
  if (vbThieu.length) ghiChu.push(`Thiếu sổ: ${vbThieu.join(', ')}`);
  const vbHet = r.chi_tiet_vb.filter((v) => v.tinh_trang === 'HET_HIEU_LUC').map((v) => v.so_hieu);
  if (vbHet.length) ghiChu.push(`Hết HL: ${vbHet.join(', ')}`);
  const vbChuaA = r.chi_tiet_vb
    .filter((v) => v.ton_tai && v.tinh_trang !== 'HET_HIEU_LUC' && !v.dat_a)
    .map((v) => `${v.so_hieu} (${v.muc || '?'})`);
  if (vbChuaA.length) ghiChu.push(`Chưa NGUON_A: ${vbChuaA.join(', ')}`);
  if (r.chi_tiet_vb.length === 0) ghiChu.push('Chưa có VB bắt buộc');
  if (!r.tieu_chi_b) {
    if (r.chi_tiet_wiki.length === 0) ghiChu.push('Chưa có trang_wiki');
    else if (r.chi_tiet_wiki.every((w) => !w.ton_tai)) ghiChu.push('Trang wiki chưa tồn tại');
    else if (r.canh_bao_wiki.length) ghiChu.push(`Wiki lỗi thời (${r.canh_bao_wiki.length})`);
  } else if (r.canh_bao_wiki.length) {
    ghiChu.push(`Lưu ý wiki phụ lỗi thời (${r.canh_bao_wiki.length})`);
  }
  if (r.chi_tiet_vb.length > 0 && !r.tieu_chi_c) ghiChu.push('Thiếu điều khoản & doc-hieu');
  return ghiChu.join('; ') || 'Đạt đủ 3 tiêu chí';
}

/**
 * Định dạng kết quả đánh giá thành báo cáo bảng Markdown.
 * @param {object} kq
 * @returns {string}
 */
export function dinhDangMarkdown(kq) {
  const tk = kq.tong_ket;
  const lines = [
    `# Báo cáo đánh giá Q&A nghiệp vụ Hải quan - XNK (${kq.ngay_danh_gia})`,
    '',
    `- **Bộ câu hỏi**: \`${kq.tep_cau_hoi}\` (phiên bản \`${kq.phien_ban_bo_cau_hoi}\`, ${kq.tong_so_cau} câu)`,
    `- **Quy mô sổ văn bản**: ${kq.tong_van_ban_trong_so} văn bản`,
    '',
    '## Tổng hợp độ phủ',
    '',
    '| Chỉ số | Số lượng | Tỉ lệ (%) |',
    '| --- | ---: | ---: |',
    `| \`DAT_NGUON_A\` (đạt cả a + b + c) | ${tk.DAT_NGUON_A}/${kq.tong_so_cau} | ${tk.ti_le_dat_nguon_a_pct}% |`,
    `| \`MOT_PHAN\` | ${tk.MOT_PHAN}/${kq.tong_so_cau} | ${phanTram(tk.MOT_PHAN, kq.tong_so_cau)}% |`,
    `| \`CHUA_PHU\` | ${tk.CHUA_PHU}/${kq.tong_so_cau} | ${tk.ti_le_chua_phu_pct}% |`,
    `| **Tổng đã phủ tối thiểu (\`DAT_NGUON_A\` + \`MOT_PHAN\`)** | **${tk.DAT_NGUON_A + tk.MOT_PHAN}/${kq.tong_so_cau}** | **${tk.ti_le_phu_toi_thieu_pct}%** |`,
    `| Tiêu chí (a): VB bắt buộc \`CON_HIEU_LUC\` + \`NGUON_A\` | ${tk.tieu_chi_a.dat}/${kq.tong_so_cau} | ${tk.tieu_chi_a.ti_le_pct}% |`,
    `| Tiêu chí (b): Trang wiki tồn tại & không lỗi thời | ${tk.tieu_chi_b.dat}/${kq.tong_so_cau} | ${tk.tieu_chi_b.ti_le_pct}% |`,
    `| Tiêu chí (c): Có \`dieu_khoan\` hoặc \`data/doc-hieu\` | ${tk.tieu_chi_c.dat}/${kq.tong_so_cau} | ${tk.tieu_chi_c.ti_le_pct}% |`,
    '',
  ];

  if (tk.nhanh_khong_hop_le.length) {
    lines.push(`> **Cảnh báo nhánh không khớp \`cay-xnk.yaml\`**: ${tk.nhanh_khong_hop_le.join(', ')}`, '');
  }

  lines.push(
    '## Chi tiết từng câu hỏi',
    '',
    '| ID | Nhánh | (a) Sổ A | (b) Wiki | (c) Điều khoản | Trạng thái | Ghi chú |',
    '| --- | --- | :---: | :---: | :---: | --- | --- |',
  );

  for (const r of kq.chi_tiet) {
    const dau = (ok) => (ok ? 'Đạt' : 'Chưa');
    lines.push(
      `| ${r.id} | \`${r.nhanh}\` | ${dau(r.tieu_chi_a)} | ${dau(r.tieu_chi_b)} | ${dau(r.tieu_chi_c)} | \`${r.trang_thai}\` | ${tomTatGhiChu(r)} |`,
    );
  }

  const dsCanhBao = kq.chi_tiet.filter((r) => r.canh_bao_wiki.length > 0);
  if (dsCanhBao.length) {
    lines.push('', '## Cảnh báo trang wiki có dấu hiệu lỗi thời', '');
    for (const r of dsCanhBao) {
      for (const cb of r.canh_bao_wiki) {
        lines.push(`- **${r.id}**: ${cb}`);
      }
    }
  }

  return `${lines.join('\n')}\n`;
}

function phanTichThamSo(argv) {
  const json = argv.includes('--json');
  const idx = argv.indexOf('--eval');
  const evalPath = idx !== -1 && argv[idx + 1] ? resolve(process.cwd(), argv[idx + 1]) : undefined;
  return { json, evalPath };
}

const { json, evalPath } = phanTichThamSo(process.argv.slice(2));
const ketQua = danhGiaBoCauHoi({ root: ROOT, evalPath });

if (json) {
  process.stdout.write(`${JSON.stringify(ketQua, null, 2)}\n`);
} else {
  process.stdout.write(dinhDangMarkdown(ketQua));
}
