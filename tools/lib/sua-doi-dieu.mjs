// Đọc, chuẩn hóa, tính trạng thái và kiểm tra đồ thị sửa đổi / bãi bỏ cấp Điều khoản (data/sua-doi-dieu/*.json).
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { boDau, chuanCanh, khoa, ROOT } from './registry.mjs';

export const LOAI_TAC_DONG_DIEU = ['SUA_DOI', 'BO_SUNG', 'BAI_BO', 'THAY_THE_CUM_TU', 'TAM_NGUNG'];
export const TRANG_THAI_DIEU = ['NGUYEN_BAN', 'DA_SUA_DOI', 'DA_BAI_BO', 'DA_BO_SUNG', 'TAM_NGUNG'];

const RE_NGAY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Chuẩn hóa mã Điều về khóa so khớp gọn (vd: "Điều 16a" | 16 → "16a" | "16").
 * @param {string|number|null|undefined} d
 * @returns {string|null}
 */
export function chuanHoaMaDieu(d) {
  if (d === undefined || d === null || d === '') return null;
  const s = boDau(String(d).normalize('NFC'))
    .trim()
    .toLowerCase()
    .replace(/^(?:dieu|d\.)\s*/i, '')
    .replace(/[.:;,)]+$/, '')
    .replace(/\s+/g, '');
  return s || null;
}

/**
 * Tạo khóa tra cứu duy nhất cho một Điều của một văn bản đích.
 * @param {string} soHieuDich
 * @param {string|number} dieuDich
 */
export function khoaDieuDich(soHieuDich, dieuDich) {
  const kVb = khoa(soHieuDich);
  const kD = chuanHoaMaDieu(dieuDich);
  if (!kVb || !kD) return null;
  return `${kVb}::${kD}`;
}

function soSanhTacDong(a, b) {
  return String(a.tu_ngay || '').localeCompare(String(b.tu_ngay || ''))
    || String(a.van_ban_nguon || '').localeCompare(String(b.van_ban_nguon || ''))
    || (Number(a.dieu_nguon) || 0) - (Number(b.dieu_nguon) || 0)
    || (a.khoan_nguon == null ? -1 : Number(a.khoan_nguon) || 0) - (b.khoan_nguon == null ? -1 : Number(b.khoan_nguon) || 0)
    || String(a.khoan_dich || '').localeCompare(String(b.khoan_dich || ''));
}

/**
 * Nạp toàn bộ tệp JSON trong `data/sua-doi-dieu/*.json` và dựng chỉ mục ngược theo (văn bản đích, điều đích).
 * @param {string} [root]
 */
export function napSuaDoiDieu(root = ROOT) {
  const dir = join(root, 'data', 'sua-doi-dieu');
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.json')).sort() : [];
  const loiDoc = [];
  const banGhi = [];
  const theoDich = new Map();
  const theoNguon = new Map();

  for (const file of files) {
    const rel = `data/sua-doi-dieu/${file}`;
    let rec;
    try {
      rec = JSON.parse(readFileSync(join(dir, file), 'utf8'));
    } catch (e) {
      loiDoc.push({ file: rel, msg: `JSON hỏng: ${e.message}` });
      continue;
    }
    if (!rec || typeof rec !== 'object' || Array.isArray(rec)) {
      loiDoc.push({ file: rel, msg: 'tệp không phải JSON object hợp lệ' });
      continue;
    }
    const item = { ...rec, _file: rel, _filename: file };
    banGhi.push(item);
    const kNguon = khoa(rec.van_ban_nguon);
    if (kNguon) theoNguon.set(kNguon, item);

    for (const t of Array.isArray(rec.tac_dong) ? rec.tac_dong : []) {
      if (!t || typeof t !== 'object') continue;
      if (t.dieu_dich == null) continue;
      const kd = khoaDieuDich(t.van_ban_dich, t.dieu_dich);
      if (!kd) continue;
      const entry = {
        loai: t.loai,
        van_ban_nguon: rec.van_ban_nguon,
        slug_nguon: rec.slug_nguon,
        dieu_nguon: t.dieu_nguon,
        khoan_nguon: t.khoan_nguon ?? null,
        khoan_dich: t.khoan_dich ?? null,
        phu_luc_dich: t.phu_luc_dich ?? null,
        tu_ngay: t.tu_ngay ?? rec.hieu_luc_tu ?? null,
        trang_pdf: t.trang_pdf ?? null,
        can_cu: t.can_cu || '',
        trich_yeu: t.trich_yeu || '',
      };
      if (!theoDich.has(kd)) theoDich.set(kd, []);
      theoDich.get(kd).push(entry);
    }
  }

  for (const list of theoDich.values()) {
    list.sort(soSanhTacDong);
  }

  return {
    tep: files.length,
    loiDoc,
    banGhi,
    theoDich,
    theoNguon,
  };
}

/**
 * Suy luận trạng thái cấp Điều (`NGUYEN_BAN` | `DA_SUA_DOI` | `DA_BAI_BO` | `DA_BO_SUNG` | `TAM_NGUNG`).
 * @param {Array<object>} lichSu
 * @param {{ taiNgay?: string }} [opts]
 * @returns {'NGUYEN_BAN'|'DA_SUA_DOI'|'DA_BAI_BO'|'DA_BO_SUNG'|'TAM_NGUNG'}
 */
export function tinhTrangThaiDieu(lichSu, opts = {}) {
  const { taiNgay = null } = opts || {};
  let list = Array.isArray(lichSu) ? lichSu.filter(Boolean) : [];
  if (taiNgay) {
    list = list.filter((e) => !e.tu_ngay || String(e.tu_ngay) <= taiNgay);
  }
  if (list.length === 0) return 'NGUYEN_BAN';

  const sorted = [...list].sort(soSanhTacDong);

  // Bãi bỏ toàn Điều (khoan_dich null/rỗng) → DA_BAI_BO, trừ khi có sửa đổi/bổ sung muộn hơn hẳn.
  const baiBoToanDieu = sorted.filter(
    (e) => e.loai === 'BAI_BO' && (e.khoan_dich === undefined || e.khoan_dich === null || String(e.khoan_dich).trim() === ''),
  );
  if (baiBoToanDieu.length > 0) {
    const lanCuoiBaiBo = baiBoToanDieu[baiBoToanDieu.length - 1];
    const coKhoiPhucMuonHon = sorted.some(
      (e) => (e.loai === 'SUA_DOI' || e.loai === 'BO_SUNG')
        && e.tu_ngay
        && lanCuoiBaiBo.tu_ngay
        && String(e.tu_ngay) > String(lanCuoiBaiBo.tu_ngay),
    );
    if (!coKhoiPhucMuonHon) return 'DA_BAI_BO';
  }

  // Tạm ngưng hiệu lực đang là tác động mới nhất
  const lanCuoi = sorted[sorted.length - 1];
  if (lanCuoi.loai === 'TAM_NGUNG') {
    const cungNgay = sorted.filter((e) => (e.tu_ngay || '') === (lanCuoi.tu_ngay || ''));
    if (cungNgay.every((e) => e.loai === 'TAM_NGUNG')) return 'TAM_NGUNG';
  }

  // Chỉ bổ sung (thêm điều/khoản) mà chưa sửa/bãi bỏ nội dung cũ
  if (sorted.every((e) => e.loai === 'BO_SUNG')) return 'DA_BO_SUNG';

  return 'DA_SUA_DOI';
}

/**
 * Kiểm tra toàn vẹn toàn bộ `data/sua-doi-dieu/*.json` đối chiếu với `registry`.
 * @param {ReturnType<import('./registry.mjs').napSo>} so
 * @param {string} [root]
 */
export function kiemTraSuaDoiDieu(so, root = ROOT) {
  const nap = napSuaDoiDieu(root);
  const loi = [...nap.loiDoc];
  const canhBao = [];

  const canhHopLeTheoNguon = new Map();
  for (const d of so.vanBan) {
    const s = new Set();
    for (const nhom of ['sua_doi', 'bai_bo', 'tam_ngung']) {
      for (const raw of d.quan_he?.[nhom] || []) {
        const c = chuanCanh(raw);
        if (c) s.add(khoa(c.so_hieu));
      }
    }
    canhHopLeTheoNguon.set(khoa(d.so_hieu), s);
  }

  let soTacDong = 0;

  for (const rec of nap.banGhi) {
    const f = rec._file;
    const expectedSlug = rec._filename.replace(/\.json$/, '');
    if (rec.slug_nguon !== expectedSlug) {
      loi.push({ file: f, msg: `slug_nguon "${rec.slug_nguon}" không khớp tên tệp "${expectedSlug}"` });
    }
    const kNguon = khoa(rec.van_ban_nguon);
    const dsNguon = kNguon ? so.theoKhoa.get(kNguon) : null;
    if (!dsNguon || dsNguon.length === 0) {
      loi.push({ file: f, msg: `van_ban_nguon "${rec.van_ban_nguon}" không tồn tại trong registry/` });
      continue;
    }
    const docNguon = dsNguon[0];
    if (docNguon._slug !== rec.slug_nguon) {
      loi.push({ file: f, msg: `slug_nguon "${rec.slug_nguon}" khác _slug trong registry ("${docNguon._slug}")` });
    }
    if (rec.hieu_luc_tu != null && !RE_NGAY.test(String(rec.hieu_luc_tu))) {
      loi.push({ file: f, msg: `hieu_luc_tu "${rec.hieu_luc_tu}" phải là YYYY-MM-DD hoặc null` });
    }
    if (!Array.isArray(rec.tac_dong)) {
      loi.push({ file: f, msg: 'tac_dong phải là mảng' });
      continue;
    }

    const canhHopLe = canhHopLeTheoNguon.get(khoa(docNguon.so_hieu)) || new Set();
    const seenKeys = new Set();

    rec.tac_dong.forEach((t, idx) => {
      soTacDong += 1;
      const prefix = `tac_dong[${idx}]`;
      if (!t || typeof t !== 'object' || Array.isArray(t)) {
        loi.push({ file: f, msg: `${prefix} không phải object` });
        return;
      }
      const kDich = khoa(t.van_ban_dich);
      if (!kDich || !so.theoKhoa.has(kDich)) {
        loi.push({ file: f, msg: `${prefix}: van_ban_dich "${t.van_ban_dich}" không tồn tại trong registry/` });
      } else if (!canhHopLe.has(kDich)) {
        loi.push({ file: f, msg: `${prefix}: ${rec.van_ban_nguon} chưa khai báo quan_he (sua_doi/bai_bo/tam_ngung) tới ${t.van_ban_dich} trong registry/` });
      }
      if (!LOAI_TAC_DONG_DIEU.includes(t.loai)) {
        loi.push({ file: f, msg: `${prefix}: loai "${t.loai}" không hợp lệ` });
      }
      if (t.dieu_dich == null && !String(t.phu_luc_dich || '').trim()) {
        loi.push({ file: f, msg: `${prefix}: thiếu cả dieu_dich lẫn phu_luc_dich` });
      }
      if (t.dieu_dich != null && !chuanHoaMaDieu(t.dieu_dich)) {
        loi.push({ file: f, msg: `${prefix}: dieu_dich "${t.dieu_dich}" không hợp lệ` });
      }
      if (t.tu_ngay != null && !RE_NGAY.test(String(t.tu_ngay))) {
        loi.push({ file: f, msg: `${prefix}: tu_ngay "${t.tu_ngay}" phải là YYYY-MM-DD hoặc null` });
      }
      if (t.dieu_nguon === undefined || t.dieu_nguon === null || String(t.dieu_nguon).trim() === '') {
        loi.push({ file: f, msg: `${prefix}: thiếu dieu_nguon` });
      }
      if (typeof t.can_cu !== 'string' || !t.can_cu.trim()) {
        loi.push({ file: f, msg: `${prefix}: can_cu phải là chuỗi không rỗng` });
      }

      const dupKey = `${kDich || ''}::${chuanHoaMaDieu(t.dieu_dich) || ''}::${t.khoan_dich ?? ''}::${t.phu_luc_dich ?? ''}::${t.loai || ''}::${t.dieu_nguon ?? ''}::${t.khoan_nguon ?? ''}`;
      if (seenKeys.has(dupKey)) {
        loi.push({ file: f, msg: `${prefix}: trùng bản ghi tác động (${dupKey})` });
      }
      seenKeys.add(dupKey);
    });
  }

  return {
    loi,
    canhBao,
    soTep: nap.tep,
    soTacDong,
  };
}
