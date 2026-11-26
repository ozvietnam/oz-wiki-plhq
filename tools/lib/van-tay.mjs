// Tiện ích định danh chuẩn, vân tay nội dung SHA-256, phân lớp dữ liệu (lop-kho@1) và dựng dist/manifest.json.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Lớp kho dữ liệu chuẩn — đồng bộ với hs-code-api (`lop-kho@1`). */
export const LOP_DU_LIEU = Object.freeze({
  LUAT: 'LUAT',
  RUT_TU_LUAT: 'RUT_TU_LUAT',
  BO_TRO: 'BO_TRO',
  TIEN_LE: 'TIEN_LE',
  KY_THUAT: 'KY_THUAT',
});

function chuanHoaJson(val) {
  if (val === null || typeof val !== 'object') return val;
  if (Array.isArray(val)) return val.map(chuanHoaJson);
  const out = {};
  for (const k of Object.keys(val).sort()) {
    if (val[k] !== undefined) out[k] = chuanHoaJson(val[k]);
  }
  return out;
}

/**
 * Tính vân tay SHA-256 (64 ký tự hex thường).
 * Chuỗi được chuẩn hoá `\r\n` → `\n` và trim; object/array được chuẩn hoá JSON sắp xếp khoá đệ quy.
 */
export function tinhVanTay(input) {
  let payload;
  if (typeof input === 'string') {
    payload = input.replace(/\r\n/g, '\n').trim();
  } else if (input !== null && typeof input === 'object') {
    payload = JSON.stringify(chuanHoaJson(input));
  } else {
    payload = input == null ? '' : String(input);
  }
  return createHash('sha256').update(payload, 'utf8').digest('hex');
}

/** ID chuẩn cho một điều/khoản/điểm trong văn bản: `vb:<slug>:d:<dieu>[:k:<khoan>][:dm:<diem>]`. */
export function idDieuKhoan(slug, dieu, khoan = null, diem = null) {
  const s = String(slug).trim();
  const d = String(dieu).trim();
  const k = khoan != null ? String(khoan).trim() : '';
  const dm = diem != null ? String(diem).trim() : '';
  return `vb:${s}:d:${d}${k ? `:k:${k}` : ''}${dm ? `:dm:${dm}` : ''}`;
}

/** Nút biểu thuế chuẩn từ mã HS: `bieu:<maHs>` hoặc `null`. */
export function nutBieuHs(maHs) {
  const s = maHs != null ? String(maHs).trim() : '';
  return s ? `bieu:${s}` : null;
}

/** ID chuẩn cho một dòng hóa chất trong `cas-index.json`. */
export function idCas(maCas, slug, idx) {
  const c = maCas != null ? String(maCas).trim() : '';
  return c ? `cas:${c}:${slug}:${idx}` : `cas:khong-ma:${slug}:${idx}`;
}

/** Dựng đối tượng `dist/manifest.json` kèm SHA-256, kích thước bytes và phân lớp dữ liệu từng tệp. */
export function dungManifest({
  distDir,
  files,
  phienBan,
  luocDoPhienBan,
  bieuThueDoiChieu = null,
  giayPhep,
}) {
  const tep = {};
  for (const { ten, lop_du_lieu, truong_lan } of files) {
    const buf = readFileSync(join(distDir, ten));
    const sha256 = createHash('sha256').update(buf).digest('hex');
    tep[ten] = {
      sha256,
      bytes: buf.length,
      lop_du_lieu,
      ...(truong_lan ? { truong_lan } : {}),
    };
  }
  return {
    phien_ban: phienBan,
    luoc_do_phien_ban: luocDoPhienBan,
    chuan_lop_du_lieu: 'lop-kho@1',
    giay_phep: giayPhep,
    bieu_thue_doi_chieu: bieuThueDoiChieu,
    tong_tep: Object.keys(tep).length,
    tep,
  };
}
