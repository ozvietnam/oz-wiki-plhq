// Tính toán hiệu lực văn bản & trạng thái điều khoản tại một ngày cụ thể (Point-in-Time / As-of-Date Law).
import { chuanCanh, khoa } from './registry.mjs';
import { tinhTrangThaiDieu } from './sua-doi-dieu.mjs';

const RE_NGAY_ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Kiểm tra và chuẩn hóa chuỗi ngày `tai_ngay` theo chuẩn ISO `YYYY-MM-DD`.
 * @param {string|null|undefined} taiNgay
 * @returns {{ hopLe: boolean, giaTri: string|null, loi: string|null }}
 */
export function chuanHoaTaiNgay(taiNgay) {
  if (taiNgay === undefined || taiNgay === null || String(taiNgay).trim() === '') {
    return { hopLe: true, giaTri: null, loi: null };
  }
  const s = String(taiNgay).trim();
  const m = s.match(RE_NGAY_ISO);
  if (!m) {
    return { hopLe: false, giaTri: null, loi: `Tham số tai_ngay "${s}" không hợp lệ (cần định dạng YYYY-MM-DD).` };
  }
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) {
    return { hopLe: false, giaTri: null, loi: `Ngày lịch "${s}" không tồn tại (YYYY-MM-DD).` };
  }
  return { hopLe: true, giaTri: s, loi: null };
}

function ngayHieuLucCanh(edge, store) {
  if (edge?.tu_ngay && RE_NGAY_ISO.test(String(edge.tu_ngay))) return String(edge.tu_ngay);
  if (store?.byKhoa instanceof Map && edge?.tu) {
    const k = khoa(edge.tu);
    const list = store.byKhoa.get(k);
    const srcDoc = Array.isArray(list) ? list[0] : list;
    if (srcDoc?.hieu_luc_tu && RE_NGAY_ISO.test(String(srcDoc.hieu_luc_tu))) {
      return String(srcDoc.hieu_luc_tu);
    }
  }
  return null;
}

/**
 * Xác định tình trạng hiệu lực của 1 văn bản tại `taiNgay` (`YYYY-MM-DD`).
 * Không suy đoán khi thiếu dữ liệu ngày (`do_chinh_xac_ngay: 'THIEU_NGAY_HIEU_LUC'`).
 * @param {object|null} doc
 * @param {string} taiNgay
 * @param {object|null} [store]
 */
export function tinhTinhTrangTaiNgay(doc, taiNgay, store = null) {
  if (!doc) {
    return {
      tinh_trang_tai_ngay: null,
      do_chinh_xac_ngay: 'THIEU_NGAY_HIEU_LUC',
      ly_do_tai_ngay: 'Không có thông tin văn bản trong sổ đăng ký.',
      van_ban_thay_the_tai_ngay: [],
    };
  }

  const ng = doc.quan_he_nguoc || {};
  const thayThe = [];
  for (const qh of ['bi_thay_the_boi', 'bi_bai_bo_boi']) {
    for (const e of ng[qh] || []) {
      const repK = khoa(e?.tu);
      const repList = repK && store?.byKhoa instanceof Map ? store.byKhoa.get(repK) : null;
      const repDoc = Array.isArray(repList) ? repList[0] : repList;
      const repTuNgay = ngayHieuLucCanh(e, store);
      if (!repTuNgay || repTuNgay <= taiNgay) {
        thayThe.push({
          so_hieu: repDoc?.so_hieu || e.tu,
          quan_he: qh,
          tu_ngay: repTuNgay,
          pham_vi: e.pham_vi || null,
        });
      }
    }
  }

  if (doc.hieu_luc_tu && taiNgay < doc.hieu_luc_tu) {
    return {
      tinh_trang_tai_ngay: 'CHUA_CO_HIEU_LUC',
      do_chinh_xac_ngay: 'DAY_DU',
      ly_do_tai_ngay: `Tại ngày ${taiNgay}, văn bản chưa đến ngày có hiệu lực (${doc.hieu_luc_tu}).`,
      van_ban_thay_the_tai_ngay: [],
    };
  }

  if (doc.het_hieu_luc_tu && taiNgay >= doc.het_hieu_luc_tu) {
    return {
      tinh_trang_tai_ngay: 'HET_HIEU_LUC',
      do_chinh_xac_ngay: 'DAY_DU',
      ly_do_tai_ngay: `Văn bản đã hết hiệu lực từ ${doc.het_hieu_luc_tu} (≤ ${taiNgay}).`,
      van_ban_thay_the_tai_ngay: thayThe,
    };
  }

  if (doc.tinh_trang === 'HET_HIEU_LUC' && !doc.het_hieu_luc_tu) {
    return {
      tinh_trang_tai_ngay: 'HET_HIEU_LUC',
      do_chinh_xac_ngay: 'THIEU_NGAY_HIEU_LUC',
      ly_do_tai_ngay: 'Văn bản hiện ở trạng thái HET_HIEU_LUC nhưng thiếu het_hieu_luc_tu để xác định mốc quá khứ.',
      van_ban_thay_the_tai_ngay: thayThe,
    };
  }

  if (!doc.hieu_luc_tu) {
    return {
      tinh_trang_tai_ngay: doc.tinh_trang || 'CHUA_XAC_MINH',
      do_chinh_xac_ngay: 'THIEU_NGAY_HIEU_LUC',
      ly_do_tai_ngay: 'Văn bản thiếu hieu_luc_tu trong sổ đăng ký — giữ nguyên tình trạng hiện có.',
      van_ban_thay_the_tai_ngay: thayThe,
    };
  }

  if (doc.tinh_trang === 'TAM_NGUNG_HIEU_LUC') {
    const tamNgungList = ng.bi_tam_ngung_boi || [];
    const dated = tamNgungList.map((e) => ngayHieuLucCanh(e, store)).filter(Boolean);
    if (dated.length > 0 && dated.every((d) => d > taiNgay)) {
      return {
        tinh_trang_tai_ngay: 'CON_HIEU_LUC',
        do_chinh_xac_ngay: 'DAY_DU',
        ly_do_tai_ngay: `Tại ngày ${taiNgay}, văn bản chưa bị tạm ngưng (hiệu lực tạm ngưng từ ${dated.sort()[0]}).`,
        van_ban_thay_the_tai_ngay: [],
      };
    }
    return {
      tinh_trang_tai_ngay: 'TAM_NGUNG_HIEU_LUC',
      do_chinh_xac_ngay: dated.length > 0 ? 'DAY_DU' : 'THIEU_NGAY_HIEU_LUC',
      ly_do_tai_ngay: `Tại ngày ${taiNgay}, văn bản đang bị tạm ngưng hiệu lực.`,
      van_ban_thay_the_tai_ngay: thayThe,
    };
  }

  // Kiểm tra các bãi bỏ một phần theo mốc thời gian
  const partialRepeals = ng.bi_bai_bo_boi || [];
  if (partialRepeals.length > 0 || doc.tinh_trang === 'HET_HIEU_LUC_MOT_PHAN') {
    const dates = partialRepeals.map((e) => ngayHieuLucCanh(e, store));
    const hasActivePartial = dates.some((d) => d !== null && d <= taiNgay);
    const allKnown = dates.length > 0 && dates.every((d) => d !== null);
    if (hasActivePartial) {
      return {
        tinh_trang_tai_ngay: 'HET_HIEU_LUC_MOT_PHAN',
        do_chinh_xac_ngay: 'DAY_DU',
        ly_do_tai_ngay: `Tại ngày ${taiNgay}, văn bản đã bị bãi bỏ một phần.`,
        van_ban_thay_the_tai_ngay: thayThe,
      };
    }
    if (allKnown && dates.every((d) => d > taiNgay)) {
      return {
        tinh_trang_tai_ngay: 'CON_HIEU_LUC',
        do_chinh_xac_ngay: 'DAY_DU',
        ly_do_tai_ngay: `Tại ngày ${taiNgay}, các phần bị bãi bỏ sau này (${dates.sort()[0]}) chưa phát sinh hiệu lực.`,
        van_ban_thay_the_tai_ngay: [],
      };
    }
    if (doc.tinh_trang === 'HET_HIEU_LUC_MOT_PHAN') {
      return {
        tinh_trang_tai_ngay: 'HET_HIEU_LUC_MOT_PHAN',
        do_chinh_xac_ngay: 'THIEU_NGAY_HIEU_LUC',
        ly_do_tai_ngay: 'Văn bản bị bãi bỏ một phần nhưng thiếu ngày hiệu lực chi tiết cho phần bãi bỏ.',
        van_ban_thay_the_tai_ngay: thayThe,
      };
    }
  }

  // Nếu có quan_he thay thế chiều đi từ văn bản mới hơn chưa nằm trong bi_thay_the_boi đã biết
  return {
    tinh_trang_tai_ngay: 'CON_HIEU_LUC',
    do_chinh_xac_ngay: 'DAY_DU',
    ly_do_tai_ngay: `Văn bản còn hiệu lực tại ngày ${taiNgay} (hieu_luc_tu ${doc.hieu_luc_tu}${doc.het_hieu_luc_tu ? `, het_hieu_luc_tu ${doc.het_hieu_luc_tu}` : ''}).`,
    van_ban_thay_the_tai_ngay: [],
  };
}

/**
 * Lọc `lich_su_tac_dong` của một Điều khoản theo `taiNgay` (`tu_ngay <= taiNgay`)
 * và tính lại `trang_thai_dieu` tại đúng ngày đó.
 */
export function locLichSuDieuTaiNgay(lichSu, taiNgay) {
  const raw = Array.isArray(lichSu) ? lichSu.filter(Boolean) : [];
  if (!taiNgay) {
    return {
      lich_su_tac_dong: raw,
      trang_thai_dieu: tinhTrangThaiDieu(raw),
      co_moc_thieu_ngay: raw.some((e) => !e.tu_ngay),
    };
  }
  const filtered = raw.filter((e) => !e.tu_ngay || String(e.tu_ngay) <= taiNgay);
  return {
    lich_su_tac_dong: filtered,
    trang_thai_dieu: tinhTrangThaiDieu(filtered, { taiNgay }),
    co_moc_thieu_ngay: filtered.some((e) => !e.tu_ngay),
  };
}

export function laCanhCoTuNgayHopLe(raw) {
  const c = chuanCanh(raw);
  return Boolean(c?.tu_ngay && RE_NGAY_ISO.test(String(c.tu_ngay)));
}
