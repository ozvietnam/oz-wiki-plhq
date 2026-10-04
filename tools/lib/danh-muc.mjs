// Danh mục mã HS ↔ văn bản: đọc, kiểm và dựng chỉ mục từ danh-muc/<slug>.csv.
// Lược đồ: docs/luoc-do-danh-muc-hs.md. Không gọi mạng; biểu thuế đối chiếu lấy từ nhu-cau/bieu-thue.json.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, khoa } from './registry.mjs';

export const COT = ['ma_hs', 'mo_ta', 'nhom', 'phu_luc', 'loai_tac_dong', 'muc_rui_ro', 'dieu_kien', 'dan_chieu', 'trang'];
export const LOAI_TAC_DONG = ['KIEM_TRA_ATTP', 'KIEM_TRA_CHAT_LUONG', 'KIEM_DICH_DONG_VAT', 'KIEM_DICH_THUC_VAT',
  'GIAY_PHEP', 'CAM_NHAP_KHAU', 'CAM_XUAT_KHAU', 'CONG_BO_HOP_QUY', 'DANG_KY_LUU_HANH', 'PHONG_VE_THUONG_MAI', 'KHAC'];
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

/** Văn bản trông như danh mục kèm mã HS (để báo "chưa trích"). */
export function laVanBanDanhMuc(d) {
  if (d.danh_muc_hs) return true;
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
    if (!LOAI_TAC_DONG.includes(o.loai_tac_dong)) loi.push(`${at} loai_tac_dong "${o.loai_tac_dong}" không hợp lệ (${LOAI_TAC_DONG.join(', ')})`);
    if (o.muc_rui_ro && !MUC_RUI_RO.includes(o.muc_rui_ro)) loi.push(`${at} muc_rui_ro "${o.muc_rui_ro}" không hợp lệ (${MUC_RUI_RO.join(', ')})`);
    if (o.trang && !/^\d+$/.test(o.trang)) loi.push(`${at} trang phải là số`);
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
        bang: { tep: it.tep, nguon: d.danh_muc_hs.nguon || null, trich_boi: d.danh_muc_hs.trich_boi || null, ngay: d.danh_muc_hs.ngay || null, da_doi_chieu: d.danh_muc_hs.da_doi_chieu === true },
        dong: it.dong.map(({ _dong, ...o }) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== ''))),
      };
    }),
  };
}
