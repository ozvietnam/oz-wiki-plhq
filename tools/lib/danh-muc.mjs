// Danh mục mã HS ↔ văn bản: đọc, kiểm và dựng chỉ mục từ danh-muc/<slug>.csv.
// Lược đồ: docs/luoc-do-danh-muc-hs.md. Không gọi mạng; biểu thuế đối chiếu lấy từ nhu-cau/bieu-thue.json.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { ROOT, khoa, LUOC_DO_PHIEN_BAN } from './registry.mjs';
import { LOP_DU_LIEU, tinhVanTay, nutBieuHs } from './van-tay.mjs';

export const COT = ['ma_hs', 'mo_ta', 'nhom', 'phu_luc', 'loai_tac_dong', 'muc_rui_ro', 'dieu_kien', 'dan_chieu', 'trang'];
export const COT_CAS = ['cas', 'ten_chat', 'ma_hoa_chat', 'cong_thuc', 'phan_loai', 'phu_luc', 'muc', 'so_thu_tu', 'nguon', 'nhom', 'nguong_kg'];
export const PHU_LUC_CAS = ['I', 'II', 'III', 'IV'];
// 3 mã CAS lỗi in trong văn bản gốc Công báo số 77 (NĐ 24/2026/NĐ-CP) đã ghi nhận tại 24-2026-nd-cp-cas-quy-tac.md
export const CAS_LOI_IN_NGUON_A = new Set(['10037-74-3', '7746-08-4', '10118-77-6']);
// 3 công thức hoá học trong văn bản gốc Công báo số 77 in có 1 khoảng trắng hợp lệ (không phải nhãn mục trượt cột)
export const CONG_THUC_CO_KHOANG_TRANG_NGUON_A = new Set(['Mn (NO3)2', 'C21H22N2O2. 0.5H2SO4', 'C18H14-nCln (n=1-14)']);
const RE_CAS = /^(\d{2,7})-(\d{2})-(\d)$/;
export const LOAI_TAC_DONG = ['KIEM_TRA_ATTP', 'KIEM_TRA_CHAT_LUONG', 'KIEM_DICH_DONG_VAT', 'KIEM_DICH_THUC_VAT',
  'GIAY_PHEP', 'CAM_NHAP_KHAU', 'CAM_XUAT_KHAU', 'CONG_BO_HOP_QUY', 'DANG_KY_LUU_HANH', 'PHONG_VE_THUONG_MAI',
  // Danh mục hàng ĐƯỢC BỎ/CẮT GIẢM kiểm tra — mã có trong bảng nhưng KHÔNG phải nghĩa vụ.
  'CAT_GIAM_KIEM_TRA', 'KHAC'];
export const MUC_RUI_RO = ['CAO', 'TRUNG_BINH', 'THAP'];
const MA_HS = /^(\d{4}|\d{6}|\d{8})$/;
// Văn bản "danh mục" có khả năng kèm bảng mã HS — dùng để dò văn bản chưa trích.
const RE_DANH_MUC = /danh m[uụ]c/i;
const NHANH_CO_MA_HS = /^(kiem-tra-chuyen-nganh|quan-ly-ngoai-thuong|phong-ve-thuong-mai)/;

/** CSV theo RFC 4180 (dấu phẩy, ngoặc kép, xuống dòng trong ô). */
export function docCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let q = false;
  const s = String(text).replace(/^﻿/, '');
  for (let i = 0; i < s.length; i += 1) {
    const ch = s[i];
    if (q) {
      if (ch === '"' && s[i + 1] === '"') { cell += '"'; i += 1; } else if (ch === '"') q = false; else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && s[i + 1] === '\n') i += 1;
      row.push(cell); cell = '';
      if (row.some((c) => c !== '')) rows.push(row);
      row = [];
    } else cell += ch;
  }
  if (cell !== '' || row.length) { row.push(cell); if (row.some((c) => c !== '')) rows.push(row); }
  return rows;
}

/** Biểu thuế đối chiếu (bản chụp từ hs-code-api qua tools/nhu-cau.mjs): { ma: { '10011100': 'mô tả' } }. */
export function docBieuThue(root = ROOT) {
  const p = join(root, 'nhu-cau', 'bieu-thue.json');
  if (!existsSync(p)) return null;
  try {
    const raw = JSON.parse(readFileSync(p, 'utf8'));
    const ma = raw.ma || {};
    return { ...raw, la: new Set(Object.keys(ma)), ma };
  } catch { return null; }
}

/** Số dòng thuế 8 số bắt đầu bằng tiền tố (4/6/8 số). */
export function demLa(bt, maHs) {
  if (!bt) return null;
  if (maHs.length === 8) return bt.la.has(maHs) ? 1 : 0;
  let n = 0;
  for (const k of bt.la) if (k.startsWith(maHs)) n += 1;
  return n;
}

/** Đọc bảng ánh xạ mã AHTN cũ → EN2022 (registry/phien-ban-bieu-thue-mapping.yaml). null nếu chưa có. */
export function docAnhXaAhtn(root = ROOT) {
  const p = join(root, 'registry', 'phien-ban-bieu-thue-mapping.yaml');
  if (!existsSync(p)) return null;
  try {
    const raw = yaml.load(readFileSync(p, 'utf8'), { schema: yaml.CORE_SCHEMA });
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    const mapping = {};
    for (const [k, v] of Object.entries(raw.mapping || {})) {
      const maCu = String(k).trim();
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        mapping[maCu] = {
          ...v,
          ...(v.hs_moi != null ? { hs_moi: String(v.hs_moi).trim() } : {}),
        };
      } else {
        mapping[maCu] = v;
      }
    }
    return {
      thong_tin: raw.thong_tin && typeof raw.thong_tin === 'object' && !Array.isArray(raw.thong_tin) ? raw.thong_tin : {},
      phan_loai: raw.phan_loai && typeof raw.phan_loai === 'object' && !Array.isArray(raw.phan_loai) ? raw.phan_loai : {},
      mapping,
    };
  } catch { return null; }
}

/** Kiểm tra lược đồ ánh xạ AHTN cũ → EN2022 và (tuỳ chọn) tồn tại hs_moi trong biểu thuế đối chiếu. */
export function kiemAnhXaAhtn(anhXa, bt = null) {
  const loi = [];
  const mapping = anhXa?.mapping && typeof anhXa.mapping === 'object' && !Array.isArray(anhXa.mapping) ? anhXa.mapping : {};
  for (const [maCuRaw, info] of Object.entries(mapping)) {
    const maCu = String(maCuRaw);
    if (!MA_HS.test(maCu)) {
      loi.push(`mapping["${maCu}"] mã cũ không hợp lệ (phải là 4, 6 hoặc 8 chữ số)`);
    }
    const hsMoi = typeof info?.hs_moi === 'string' ? info.hs_moi : '';
    if (!MA_HS.test(hsMoi)) {
      loi.push(`mapping["${maCu}"] hs_moi "${info?.hs_moi ?? ''}" không hợp lệ (phải là 4, 6 hoặc 8 chữ số)`);
    } else if (bt?.la && !(demLa(bt, hsMoi) > 0)) {
      loi.push(`mapping["${maCu}"] hs_moi "${hsMoi}" không tồn tại trong biểu thuế đối chiếu`);
    }
    if (typeof info?.loai !== 'string' || !info.loai.trim()) {
      loi.push(`mapping["${maCu}"] thiếu loai (phải là chuỗi không rỗng)`);
    }
  }
  return loi;
}

/** Văn bản trông như danh mục kèm mã HS (để báo "chưa trích").
 * `so` (tuỳ chọn): sổ đăng ký — dùng để nhận phụ lục tách riêng (`phu_luc_cua`)
 * khi văn bản mẹ đã có bảng danh mục thì không coi là điểm mù.
 * Văn bản chỉ *bãi bỏ* văn bản khác (tên bắt đầu "Bãi bỏ…") không có bảng riêng — dù tên nhắc "danh mục". */
export function laVanBanDanhMuc(d, so = null) {
  if (d.phu_luc_cua && so?.theoKhoa) {
    const me = so.theoKhoa.get(khoa(d.phu_luc_cua))?.[0];
    if (me?.danh_muc_hs) return false;
  }
  // Danh mục đã bị văn bản khác thay toàn bộ (vd Phụ lục I 13/2018/TT-BTTTT ← Điều 1 TT 10/2022/TT-BTTTT):
  // văn bản thay đã có bảng thì không còn gì để trích ở văn bản cũ. Chưa có bảng → vẫn là điểm mù.
  if (d.danh_muc_thay_boi && so?.theoKhoa) {
    const moi = so.theoKhoa.get(khoa(d.danh_muc_thay_boi))?.[0];
    if (moi?.danh_muc_hs) return false;
  }
  if (d.danh_muc_hs) return true;
  // Văn bản danh mục chỉ quy định theo mô tả / mã CAS, bản gốc bậc A không gắn mã HS (vd 14/2024/TT-BNNPTNT, 28/2026/NĐ-CP, 09/2013/TT-BTTTT).
  if (typeof d.danh_muc_khong_ma_hs === 'string' && d.danh_muc_khong_ma_hs.trim() && !d.danh_muc_hs) return false;
  // Chỉ bãi bỏ (vd 4814/QĐ-BCA) — không trích bảng mã HS của chính nó.
  // Không dùng \b: "ỏ" không phải word-char ASCII nên \b sau "bỏ" luôn thất bại.
  if (/^\s*Bãi bỏ(?:\s|$)/i.test(d.ten || '')) return false;
  if (!['CON_HIEU_LUC', 'CHUA_CO_HIEU_LUC', 'HET_HIEU_LUC_MOT_PHAN', 'CHUA_XAC_MINH'].includes(d.tinh_trang)) return false;
  if (!['THONG_TU', 'THONG_TU_LIEN_TICH', 'QUYET_DINH', 'NGHI_DINH'].includes(d.loai)) return false;
  return RE_DANH_MUC.test(d.ten || '') && (d.nhanh || []).some((n) => NHANH_CO_MA_HS.test(n));
}

/**
 * Đọc mọi bảng danh mục được khai trong sổ (trường danh_muc_hs.tep).
 * → [{ vanBan, tep, dong: [{ ...cot, _dong }], loi: [msg] }]
 */
export function napDanhMuc(so, root = ROOT) {
  const out = [];
  for (const d of so.vanBan) {
    const dm = d.danh_muc_hs;
    if (!dm || typeof dm !== 'object' || !dm.tep) continue;
    const item = { vanBan: d, tep: dm.tep, dong: [], loi: [] };
    out.push(item);
    const p = join(root, dm.tep);
    if (!existsSync(p)) { item.loi.push(`không thấy tệp ${dm.tep}`); continue; }
    const rows = docCsv(readFileSync(p, 'utf8'));
    const head = (rows.shift() || []).map((h) => h.trim());
    if (head.join(',') !== COT.join(',')) { item.loi.push(`dòng tiêu đề phải đúng: ${COT.join(',')}`); continue; }
    rows.forEach((r, i) => {
      const o = Object.fromEntries(COT.map((c, j) => [c, (r[j] ?? '').trim()]));
      o._dong = i + 2;
      item.dong.push(o);
    });
  }
  return out;
}

/** Lỗi định dạng (chặn PR) của từng bảng. Không cần biểu thuế. */
export function kiemDinhDang(item) {
  const loi = [...item.loi];
  for (const o of item.dong) {
    const at = `${item.tep}:${o._dong}`;
    if (o.ma_hs && !MA_HS.test(o.ma_hs)) loi.push(`${at} ma_hs "${o.ma_hs}" phải là 4, 6 hoặc 8 chữ số, không dấu chấm`);
    if (!o.ma_hs && !o.dan_chieu) loi.push(`${at} thiếu ma_hs (hoặc ghi dan_chieu nếu phụ lục dẫn sang văn bản khác)`);
    if (!o.mo_ta) loi.push(`${at} thiếu mo_ta`);
    else {
      if (o.mo_ta.startsWith('-')) loi.push(`${at} mo_ta không được bắt đầu bằng "-" (phải ghép ngữ cảnh nhóm cha)`);
      if (/^(?:-\s*)*Loại khác\.?$/i.test(o.mo_ta)) loi.push(`${at} mo_ta "${o.mo_ta}" thiếu ngữ cảnh nhóm cha (không để "Loại khác" cộc lốc)`);
      if ((o.mo_ta.match(/\(/g) || []).length !== (o.mo_ta.match(/\)/g) || []).length) loi.push(`${at} mo_ta lệch dấu ngoặc đơn "(" và ")"`);
    }
    if (o.dan_chieu && /^QCVN\b/i.test(o.dan_chieu)) loi.push(`${at} dan_chieu "${o.dan_chieu}" không được ghi QCVN (đặt QCVN vào dieu_kien; dan_chieu chỉ ghi số hiệu văn bản)`);
    if (!LOAI_TAC_DONG.includes(o.loai_tac_dong)) loi.push(`${at} loai_tac_dong "${o.loai_tac_dong}" không hợp lệ (${LOAI_TAC_DONG.join(', ')})`);
    if (o.muc_rui_ro && !MUC_RUI_RO.includes(o.muc_rui_ro)) loi.push(`${at} muc_rui_ro "${o.muc_rui_ro}" không hợp lệ (${MUC_RUI_RO.join(', ')})`);
    if (o.trang && !/^\d+$/.test(o.trang)) loi.push(`${at} trang phải là số`);
  }
  return loi;
}

/** Kiểm lược đồ 11 cột cho các bảng danh-muc/*-cas.csv (chặn lệch header, rách cột, sai CAS, trượt mục). */
export function kiemDanhMucCas(tep, text) {
  const loi = [];
  const s = String(text);
  if (s.includes('\r\n')) loi.push(`${tep} chứa ký tự xuống dòng CRLF (\\r\\n)`);
  const rows = docCsv(s);
  if (!rows.length) {
    loi.push(`${tep} tệp CSV rỗng`);
    return loi;
  }
  const head = rows[0].map((h) => h.trim());
  if (head.join(',') !== COT_CAS.join(',')) {
    loi.push(`${tep}:1 dòng tiêu đề phải đúng 11 cột: ${COT_CAS.join(',')}`);
    return loi;
  }
  for (let i = 1; i < rows.length; i += 1) {
    const r = rows[i];
    const dong = i + 1;
    const at = `${tep}:${dong}`;
    if (r.length !== COT_CAS.length) {
      loi.push(`${at} dòng ${dong}: số cột ${r.length} khác header (${COT_CAS.length})`);
      continue;
    }
    const o = Object.fromEntries(COT_CAS.map((c, j) => [c, (r[j] ?? '').trim()]));
    if (!o.ten_chat) loi.push(`${at} thiếu ten_chat`);
    if (!o.phan_loai) loi.push(`${at} thiếu phan_loai`);
    if (!PHU_LUC_CAS.includes(o.phu_luc)) {
      loi.push(`${at} phu_luc "${o.phu_luc}" không hợp lệ (${PHU_LUC_CAS.join(', ')})`);
    } else if (o.phu_luc === 'I') {
      if (o.muc !== '' || o.nhom !== '' || !/^\d+$/.test(o.so_thu_tu)) {
        loi.push(`${at} tổ hợp (phu_luc=I, muc="${o.muc}", nhom="${o.nhom}", so_thu_tu="${o.so_thu_tu}") không hợp lệ`);
      }
    } else if (o.phu_luc === 'II') {
      if (o.muc !== '1' || o.nhom !== '' || !/^\d+$/.test(o.so_thu_tu)) {
        loi.push(`${at} tổ hợp (phu_luc=II, muc="${o.muc}", nhom="${o.nhom}", so_thu_tu="${o.so_thu_tu}") không hợp lệ`);
      }
    } else if (o.phu_luc === 'III') {
      if (!['A', 'B', 'C'].includes(o.muc) || !['1', '2'].includes(o.nhom) || o.so_thu_tu !== '') {
        loi.push(`${at} tổ hợp (phu_luc=III, muc="${o.muc}", nhom="${o.nhom}", so_thu_tu="${o.so_thu_tu}") không hợp lệ`);
      }
    } else if (o.phu_luc === 'IV') {
      if (o.muc !== 'Bảng A' || o.nhom !== '' || !/^\d+$/.test(o.so_thu_tu)) {
        loi.push(`${at} tổ hợp (phu_luc=IV, muc="${o.muc}", nhom="${o.nhom}", so_thu_tu="${o.so_thu_tu}") không hợp lệ`);
      }
    }
    if (!/^https?:\/\//.test(o.nguon)) {
      loi.push(`${at} nguon "${o.nguon}" phải bắt đầu bằng http:// hoặc https://`);
    }
    if (o.cas) {
      const m = o.cas.match(RE_CAS);
      if (!m) {
        loi.push(`${at} cas "${o.cas}" sai định dạng (^\\d{2,7}-\\d{2}-\\d$)`);
      } else {
        const chuSo = (m[1] + m[2]).split('').reverse().map(Number);
        const tong = chuSo.reduce((acc, d, idx) => acc + d * (idx + 1), 0);
        if (tong % 10 !== Number(m[3]) && !CAS_LOI_IN_NGUON_A.has(o.cas)) {
          loi.push(`${at} cas "${o.cas}" sai checksum mod-10 (kỳ vọng ${tong % 10})`);
        }
      }
    }
    if (o.cong_thuc.length > 40 || (/\s/.test(o.cong_thuc) && !CONG_THUC_CO_KHOANG_TRANG_NGUON_A.has(o.cong_thuc))) {
      loi.push(`${at} cong_thuc "${o.cong_thuc}" không hợp lệ (chứa khoảng trắng hoặc dài quá 40 ký tự)`);
    }
  }
  return loi;
}

/** Đối chiếu với biểu thuế: mã không tồn tại, dẫn chiếu tới văn bản chưa có bảng. */
export function doiChieu(item, { bt, so }) {
  const khongTonTai = [];
  const danChieu = new Map();
  let soLa = 0;
  for (const o of item.dong) {
    if (o.ma_hs) {
      const n = demLa(bt, o.ma_hs);
      if (n === 0) khongTonTai.push(o);
      else if (n) soLa += n;
    }
    if (o.dan_chieu) {
      const dc = so.theoKhoa.get(khoa(o.dan_chieu))?.[0];
      danChieu.set(o.dan_chieu, dc || null);
    }
  }
  return { khongTonTai, danChieu, soLa };
}

/** Chỉ mục cho máy (dist/hs-index.json). hs-code-api tra theo tiền tố: mã 8 số khớp mọi dòng có ma_hs là tiền tố. */
export function dungChiMuc(so, root = ROOT, today) {
  const ds = napDanhMuc(so, root);
  const bt = docBieuThue(root);
  return {
    phien_ban: today,
    luoc_do_phien_ban: LUOC_DO_PHIEN_BAN,
    lop_du_lieu: LOP_DU_LIEU.LUAT,
    giay_phep: 'CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/',
    luoc_do: 'docs/luoc-do-danh-muc-hs.md',
    bieu_thue_doi_chieu: bt ? { phien_ban: bt.phien_ban || null, nguon: bt.nguon || null } : null,
    van_ban: ds.filter((it) => !kiemDinhDang(it).length).map((it) => {
      const d = it.vanBan;
      return {
        so_hieu: d.so_hieu,
        slug: d._slug,
        ten: d.ten,
        tinh_trang: d.tinh_trang,
        hieu_luc_tu: d.hieu_luc_tu || null,
        het_hieu_luc_tu: d.het_hieu_luc_tu || null,
        hieu_luc_da_doi_chieu: d.xac_minh?.hieu_luc_da_doi_chieu === true,
        bang: { tep: it.tep, nguon: d.danh_muc_hs.nguon || null, trich_boi: d.danh_muc_hs.trich_boi || null, ngay: d.danh_muc_hs.ngay || null, da_doi_chieu: d.danh_muc_hs.da_doi_chieu === true, phien_ban_ahtn: d.danh_muc_hs.phien_ban_ahtn || null },
        dong: it.dong.map(({ _dong, ...o }) => ({
          ...Object.fromEntries(Object.entries(o).filter(([, v]) => v !== '')),
          ...(o.ma_hs ? { nut_bieu: nutBieuHs(o.ma_hs) } : {}),
          van: tinhVanTay({
            so_hieu: d.so_hieu,
            ma_hs: o.ma_hs || null,
            loai_tac_dong: o.loai_tac_dong,
            mo_ta: o.mo_ta || null,
            dieu_kien: o.dieu_kien || null,
            phu_luc: o.phu_luc || null,
            nhom: o.nhom || null,
            dan_chieu: o.dan_chieu || null,
          }),
        })),
      };
    }),
  };
}

/** Đảo chiều của dungChiMuc → dist/hs-index-theo-ma.json: nhóm mã HS (4/6/8 số) → danh sách văn bản áp.
 *  Bên tra mã 8 số lấy mọi khoá là tiền tố của mã đó (4, 6 số) cộng khoá trùng 8 số — cùng ngữ nghĩa
 *  khớp tiền tố mà hs-code-api vẫn dùng khi tra thuận chiều.
 *  Tuỳ chọn { bt, tienLe8, tienLe4, anhXaAhtn } (v2): đối chiếu nhóm mã với bản chụp biểu thuế (cảnh báo mã AHTN cũ
 *  /trích lệch đã rơi khỏi biểu thuế), nối gợi ý ánh xạ AHTN cũ → EN2022 cho các mã trong canh_bao_ma,
 *  và gắn mật độ tiền lệ TB-TCHQ theo mã 8 số + nhóm 4 số. */
export function dungChiMucTheoMa(chiMuc, { bt = null, tienLe8 = null, tienLe4 = null, anhXaAhtn = null } = {}) {
  const ma = {};
  for (const vb of chiMuc.van_ban || []) {
    for (const d of vb.dong || []) {
      if (!d.ma_hs) continue;
      const canh = {
        so_hieu: vb.so_hieu, slug: vb.slug, ten: vb.ten, tinh_trang: vb.tinh_trang,
        hieu_luc_tu: vb.hieu_luc_tu, het_hieu_luc_tu: vb.het_hieu_luc_tu, hieu_luc_da_doi_chieu: vb.hieu_luc_da_doi_chieu,
        phien_ban_ahtn: vb.bang?.phien_ban_ahtn || null,
        loai_tac_dong: d.loai_tac_dong, muc_rui_ro: d.muc_rui_ro || null, dieu_kien: d.dieu_kien || null,
        nhom: d.nhom || null, phu_luc: d.phu_luc || null,
        nut_bieu: nutBieuHs(d.ma_hs),
        van: tinhVanTay({
          ma_hs: d.ma_hs,
          so_hieu: vb.so_hieu,
          loai_tac_dong: d.loai_tac_dong,
          muc_rui_ro: d.muc_rui_ro || null,
          dieu_kien: d.dieu_kien || null,
          nhom: d.nhom || null,
          phu_luc: d.phu_luc || null,
        }),
      };
      const ds = (ma[d.ma_hs] ||= []);
      // Gộp cạnh trùng toàn bộ trường (dòng trích đôi trong cùng văn bản); khác mức rủi ro/phụ lục thì giữ.
      const chu = JSON.stringify(canh);
      if (!ds.some((x) => JSON.stringify(x) === chu)) ds.push(canh);
    }
  }
  const tongCanh = Object.values(ma).reduce((n, v) => n + v.length, 0);
  const out = {
    phien_ban: chiMuc.phien_ban,
    luoc_do_phien_ban: chiMuc.luoc_do_phien_ban,
    lop_du_lieu: LOP_DU_LIEU.LUAT,
    lop_du_lieu_khoi: {
      ma: LOP_DU_LIEU.LUAT,
      canh_bao_ma: LOP_DU_LIEU.KY_THUAT,
      anh_xa_ahtn_cu: LOP_DU_LIEU.BO_TRO,
      tien_le_tb_tchq: LOP_DU_LIEU.TIEN_LE,
    },
    giay_phep: chiMuc.giay_phep,
    luoc_do: 'docs/luoc-do-danh-muc-hs.md',
    cach_tra: 'Khoá là nhóm mã HS trong bảng (4, 6 hoặc 8 số). Tra mã 8 số: ghép mọi khoá là tiền tố của mã (độ dài 4, 6) và khoá trùng 8 số. Cạnh giữ nguyên dieu_kien — "trừ loại…" là trừ diện, không phải diện áp. canh_bao_ma = nhóm mã không có trong biểu thuế đối chiếu — tra ra các khoá này thì dừng và đối chiếu lại văn bản gốc, đừng kết luận diện áp. tien_le_tb_tchq = mật độ thông báo phân loại của Tổng cục (bậc C, tham khảo).',
    tong_nhom_ma: Object.keys(ma).length,
    tong_canh: tongCanh,
  };
  if (bt) {
    const btMa = bt.ma || {};
    const p4 = new Set(); const p6 = new Set();
    for (const c of Object.keys(btMa)) { p4.add(c.slice(0, 4)); p6.add(c.slice(0, 6)); }
    const hopLe = (k) => (k.length === 8 ? k in btMa : k.length === 6 ? p6.has(k) : k.length === 4 ? p4.has(k) : false);
    const ngoai = Object.keys(ma).filter((k) => !hopLe(k)).sort();
    out.bieu_thue_doi_chieu = {
      nguon: bt.nguon || null, phien_ban: bt.phien_ban || null, tong_ma: bt.tong ?? null,
      nhom_ngoai_bieu_thue: ngoai.length,
      ghi_chu: 'Nhóm mã không có trong bản chụp biểu thuế — thường là mã AHTN cũ (văn bản danh mục ban hành theo AHTN 2017/2022, biểu thuế đã bỏ) hoặc trích lệch. KHÔNG dùng các khoá này làm căn cứ diện áp cho người khai; đối chiếu lại văn bản gốc (ví dụ phân tích danh-muc/kiem-tra-ma-hs-2026.md).',
    };
    out.canh_bao_ma = ngoai;
    if (anhXaAhtn?.mapping && typeof anhXaAhtn.mapping === 'object' && !Array.isArray(anhXaAhtn.mapping)) {
      const anhXaMap = {};
      for (const maCu of ngoai) {
        if (!Object.hasOwn(anhXaAhtn.mapping, maCu)) continue;
        const info = anhXaAhtn.mapping[maCu];
        if (!info || typeof info !== 'object') continue;
        const hsMoi = typeof info.hs_moi === 'string' ? info.hs_moi.trim() : (info.hs_moi != null ? String(info.hs_moi).trim() : '');
        if (!MA_HS.test(hsMoi)) continue;
        const hopLeBt = hopLe(hsMoi) || (bt.la ? demLa(bt, hsMoi) > 0 : false);
        if (!hopLeBt) continue;
        anhXaMap[maCu] = {
          hs_moi: hsMoi,
          loai: typeof info.loai === 'string' && info.loai.trim() ? info.loai.trim() : (info.loai ?? null),
        };
      }
      out.anh_xa_ahtn_cu = {
        lop_du_lieu: LOP_DU_LIEU.BO_TRO,
        phien_ban_cu: anhXaAhtn.thong_tin?.phien_ban_cu || null,
        phien_ban_moi: anhXaAhtn.thong_tin?.phien_ban_moi || null,
        tong_duoc_anh_xa: Object.keys(anhXaMap).length,
        ghi_chu: 'Gợi ý đối chiếu sang mã biểu thuế EN2022 cho nhóm mã trong canh_bao_ma — chỉ tham khảo, đối chiếu văn bản gốc trước khi áp dụng.',
        mapping: anhXaMap,
      };
    }
  }
  if (tienLe8 || tienLe4) {
    out.tien_le_tb_tchq = {
      lop_du_lieu: LOP_DU_LIEU.TIEN_LE,
      ghi_chu: 'Số thông báo phân loại TB-TCHQ/TB-CHQ của Tổng cục Hải quan theo mã — văn bản cá biệt, bậc C, CHỈ tham khảo cho quan điểm phân loại, không phải căn cứ khai báo. Tra chi tiết: npm run tien-le <mã>.',
      theo_ma_8: tienLe8 || null,
      theo_nhom_4: tienLe4 || null,
    };
  }
  out.ma = ma;
  return out;
}
