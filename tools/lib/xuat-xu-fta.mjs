// Sổ đăng ký & dựng gói dist/xuat-xu-fta.json (chuan_fta: fta-psr@1, lop_du_lieu: LUAT).
// Ranh giới tuyệt đối: chỉ giữ sự thật pháp lý (mã FTA, mẫu C/O, tự chứng nhận, văn bản gốc) — không chứa thuế suất FTA.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { ROOT, khoa, bacNguon, homNay, LUOC_DO_PHIEN_BAN } from './registry.mjs';
import { LOP_DU_LIEU, tinhVanTay } from './van-tay.mjs';
import { chuanHoaTaiNgay, tinhTinhTrangTaiNgay } from './hieu-luc-theo-ngay.mjs';

export const CHUAN_FTA = 'fta-psr@1';
export const GIAY_PHEP = 'CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/';
export const MIEN_TRU = 'Tham khảo, không phải tư vấn pháp lý. Xem và đối chiếu văn bản gốc nguồn bậc A trước khi áp dụng.';

export const VAI_TRO_VAN_BAN_FTA = Object.freeze([
  'QUY_TAC_XUAT_XU',
  'BIEU_THUE_UU_DAI',
  'HIEP_DINH',
  'DAU_MOI',
  'THU_TUC',
]);

const VAI_TRO_SET = new Set(VAI_TRO_VAN_BAN_FTA);
const RE_NGAY = /^(\d{4})-(\d{2})-(\d{2})$/;
const RE_MA_FTA = /^[A-Z0-9-]+$/;
const TRUONG_CAM_THUE = new Set(['thue_suat', 'bieu_thue_chi_tiet', 'ma_hs_thue', 'muc_thue']);

function laNgayHopLe(v) {
  if (typeof v !== 'string') return false;
  const m = v.trim().match(RE_NGAY);
  if (!m) return false;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
}

function kiemDanhSachVanBan(list, prefix, so, loi) {
  if (!Array.isArray(list) || !list.length) {
    loi.push(`${prefix} phải là danh sách không rỗng`);
    return;
  }
  const seenSo = new Set();
  list.forEach((vb, j) => {
    const at = `${prefix}[${j}]`;
    if (!vb || typeof vb !== 'object' || Array.isArray(vb)) {
      loi.push(`${at} phải là object {so_hieu, vai_tro}`);
      return;
    }
    const sh = typeof vb.so_hieu === 'string' ? vb.so_hieu.trim() : '';
    if (!sh) {
      loi.push(`${at} thiếu so_hieu`);
      return;
    }
    const k = khoa(sh);
    if (seenSo.has(k)) loi.push(`${at} trùng so_hieu "${sh}"`);
    seenSo.add(k);

    if (!VAI_TRO_SET.has(vb.vai_tro)) {
      loi.push(`${at} (${sh}) vai_tro "${vb.vai_tro}" không hợp lệ (${VAI_TRO_VAN_BAN_FTA.join(', ')})`);
    }
    const docs = so?.theoKhoa?.get(k);
    if (!docs || !docs.length) {
      loi.push(`${at} so_hieu "${sh}" không tồn tại trong so.theoKhoa`);
      return;
    }
    const d = docs[0];
    if (d.tinh_trang === 'HET_HIEU_LUC' && vb.lich_su !== true) {
      loi.push(`${at} dẫn văn bản HET_HIEU_LUC "${sh}" mà không đánh dấu lich_su: true (ưu tiên văn bản CON_HIEU_LUC)`);
    }
  });
}

/** Đọc tệp registry/xuat-xu-fta.yaml; trả null nếu không tồn tại. */
export function docXuatXuFta(root = ROOT) {
  const tep = join(root, 'registry', 'xuat-xu-fta.yaml');
  if (!existsSync(tep)) return null;
  const parsed = yaml.load(readFileSync(tep, 'utf8'), { schema: yaml.CORE_SCHEMA });
  return parsed ?? null;
}

/**
 * Kiểm chuẩn dữ liệu xuất xứ FTA đối với sổ đăng ký `so`.
 * Trả mảng chuỗi lỗi (`[]` nếu sạch).
 */
export function kiemTraXuatXuFta(ftaDoc, so) {
  const loi = [];
  if (!ftaDoc || typeof ftaDoc !== 'object' || Array.isArray(ftaDoc)) {
    return ['xuat-xu-fta.yaml phải là object hợp lệ'];
  }
  if (ftaDoc.chuan_fta !== CHUAN_FTA) {
    loi.push(`chuan_fta phải là "${CHUAN_FTA}" (nhận "${ftaDoc.chuan_fta}")`);
  }
  if (ftaDoc.van_ban_khung_chung != null) {
    kiemDanhSachVanBan(ftaDoc.van_ban_khung_chung, 'van_ban_khung_chung', so, loi);
  }
  if (!Array.isArray(ftaDoc.hiep_dinh) || !ftaDoc.hiep_dinh.length) {
    loi.push('thiếu hiep_dinh[] (phải là danh sách không rỗng)');
    return loi;
  }

  const seenMa = new Set();
  ftaDoc.hiep_dinh.forEach((fta, idx) => {
    const rawMa = typeof fta?.ma_fta === 'string' ? fta.ma_fta.trim() : '';
    const at = rawMa ? `hiep_dinh[${idx}] (${rawMa})` : `hiep_dinh[${idx}]`;
    if (!fta || typeof fta !== 'object' || Array.isArray(fta)) {
      loi.push(`${at} phải là object`);
      return;
    }
    for (const k of Object.keys(fta)) {
      if (TRUONG_CAM_THUE.has(k)) {
        loi.push(`${at} vi phạm ranh giới hs-code-api: không được chứa trường thuế suất "${k}"`);
      }
    }
    if (!rawMa) {
      loi.push(`${at} thiếu ma_fta`);
    } else {
      if (!RE_MA_FTA.test(rawMa)) {
        loi.push(`${at} ma_fta "${rawMa}" chỉ được dùng chữ hoa A-Z, số 0-9 và gạch ngang`);
      }
      const keyMa = rawMa.toUpperCase();
      if (seenMa.has(keyMa)) loi.push(`${at} trùng ma_fta "${rawMa}"`);
      seenMa.add(keyMa);
    }

    if (typeof fta.ten_hiep_dinh !== 'string' || !fta.ten_hiep_dinh.trim()) {
      loi.push(`${at} thiếu ten_hiep_dinh`);
    }
    if (!Array.isArray(fta.doi_tac) || !fta.doi_tac.length || fta.doi_tac.some((x) => typeof x !== 'string' || !x.trim())) {
      loi.push(`${at} doi_tac phải là mảng chuỗi không rỗng`);
    }
    if (!Array.isArray(fta.mau_co) || !fta.mau_co.length || fta.mau_co.some((x) => typeof x !== 'string' || !x.trim())) {
      loi.push(`${at} mau_co phải là mảng chuỗi không rỗng`);
    }
    if (typeof fta.tu_chung_nhan !== 'boolean') {
      loi.push(`${at} tu_chung_nhan phải là boolean`);
    }
    if (
      fta.de_minimis_mac_dinh !== null
      && fta.de_minimis_mac_dinh !== undefined
      && (typeof fta.de_minimis_mac_dinh !== 'string' || !fta.de_minimis_mac_dinh.trim())
    ) {
      loi.push(`${at} de_minimis_mac_dinh phải là chuỗi không rỗng hoặc null`);
    }
    if (!laNgayHopLe(fta.hieu_luc_tu)) {
      loi.push(`${at} hieu_luc_tu "${fta.hieu_luc_tu}" phải đúng định dạng lịch YYYY-MM-DD`);
    }
    if (fta.het_hieu_luc_tu != null && !laNgayHopLe(fta.het_hieu_luc_tu)) {
      loi.push(`${at} het_hieu_luc_tu "${fta.het_hieu_luc_tu}" phải đúng định dạng lịch YYYY-MM-DD`);
    }
    if (fta.het_hieu_luc_tu && laNgayHopLe(fta.hieu_luc_tu) && laNgayHopLe(fta.het_hieu_luc_tu) && fta.het_hieu_luc_tu < fta.hieu_luc_tu) {
      loi.push(`${at} het_hieu_luc_tu (${fta.het_hieu_luc_tu}) trước hieu_luc_tu (${fta.hieu_luc_tu})`);
    }
    if (fta.ghi_chu_phap_ly != null && (typeof fta.ghi_chu_phap_ly !== 'string' || !fta.ghi_chu_phap_ly.trim())) {
      loi.push(`${at} ghi_chu_phap_ly nếu khai phải là chuỗi không rỗng`);
    }

    kiemDanhSachVanBan(fta.van_ban_xuat_xu, `${at}.van_ban_xuat_xu`, so, loi);
  });

  return loi;
}

function giaiQuyetVanBan(item, so) {
  const k = khoa(item.so_hieu);
  const d = so?.theoKhoa?.get(k)?.[0] || null;
  const nguonA = (d?.nguon || []).find((n) => bacNguon(n.url, so?.nguon || {}) === 'A')?.url || null;
  return {
    id: d?._slug ? `vb:${d._slug}` : null,
    so_hieu: d?.so_hieu || item.so_hieu,
    slug: d?._slug || null,
    tinh_trang: d?.tinh_trang || null,
    hieu_luc_tu: d?.hieu_luc_tu || null,
    het_hieu_luc_tu: d?.het_hieu_luc_tu || null,
    nguon_a: nguonA,
    vai_tro: item.vai_tro,
    ...(item.lich_su === true ? { lich_su: true } : {}),
  };
}

/** Dựng object JSON `dist/xuat-xu-fta.json` (`chuan_fta: fta-psr@1`, `lop_du_lieu: LUAT`). */
export function dungXuatXuFta(so, root = ROOT, today = homNay()) {
  const ftaDoc = docXuatXuFta(root);
  const rawKhung = Array.isArray(ftaDoc?.van_ban_khung_chung) ? ftaDoc.van_ban_khung_chung : [];
  const rawFtas = Array.isArray(ftaDoc?.hiep_dinh) ? ftaDoc.hiep_dinh : [];

  const vanBanKhung = rawKhung.map((item) => giaiQuyetVanBan(item, so));
  const hiepDinh = rawFtas.map((fta) => {
    const id = `fta:${String(fta.ma_fta || '').trim().toLowerCase()}`;
    const vanBan = (Array.isArray(fta.van_ban_xuat_xu) ? fta.van_ban_xuat_xu : []).map((v) => giaiQuyetVanBan(v, so));
    const core = {
      id,
      ma_fta: fta.ma_fta,
      ten_hiep_dinh: fta.ten_hiep_dinh,
      doi_tac: Array.isArray(fta.doi_tac) ? fta.doi_tac : [],
      mau_co: Array.isArray(fta.mau_co) ? fta.mau_co : [],
      tu_chung_nhan: Boolean(fta.tu_chung_nhan),
      de_minimis_mac_dinh: fta.de_minimis_mac_dinh ?? null,
      hieu_luc_tu: fta.hieu_luc_tu || null,
      ...(fta.het_hieu_luc_tu ? { het_hieu_luc_tu: fta.het_hieu_luc_tu } : {}),
      ...(fta.ghi_chu_phap_ly ? { ghi_chu_phap_ly: fta.ghi_chu_phap_ly } : {}),
      van_ban: vanBan,
    };
    return {
      ...core,
      van: tinhVanTay(core),
    };
  });

  return {
    phien_ban: today,
    luoc_do_phien_ban: LUOC_DO_PHIEN_BAN,
    chuan_fta: CHUAN_FTA,
    lop_du_lieu: LOP_DU_LIEU.LUAT,
    giay_phep: GIAY_PHEP,
    ghi_nguon_chuan: `Nguồn: oz-wiki-plhq — https://github.com/ozvietnam/oz-wiki-plhq (CC BY 4.0, bản ${today}).`,
    mien_tru: MIEN_TRU,
    tong: hiepDinh.length,
    ...(vanBanKhung.length ? { van_ban_khung_chung: vanBanKhung } : {}),
    hiep_dinh: hiepDinh,
  };
}

/**
 * Lọc danh sách FTA & tính trạng thái văn bản liên kết tại ngày `taiNgay` (`YYYY-MM-DD`).
 * @param {object} ftaDist — kết quả từ `dungXuatXuFta` hoặc `dist/xuat-xu-fta.json`
 * @param {string|null|undefined} taiNgay
 * @param {object|null} [store] — store có `byKhoa` (tuỳ chọn) để kiểm quan hệ thay thế tại ngày
 */
export function locXuatXuFtaTaiNgay(ftaDist, taiNgay, store = null) {
  const chuan = chuanHoaTaiNgay(taiNgay);
  if (!chuan.hopLe) throw new Error(chuan.loi);
  if (!chuan.giaTri) return ftaDist;

  const dNgay = chuan.giaTri;
  const resolveList = (arr) => (arr || []).map((vb) => {
    const k = khoa(vb.so_hieu);
    const list = store?.byKhoa instanceof Map ? store.byKhoa.get(k) : null;
    const doc = (Array.isArray(list) ? list[0] : list) || vb;
    const tt = tinhTinhTrangTaiNgay(doc, dNgay, store);
    return {
      ...vb,
      tinh_trang_tai_ngay: tt.tinh_trang_tai_ngay,
      do_chinh_xac_ngay: tt.do_chinh_xac_ngay,
    };
  });

  const hiepDinh = (ftaDist?.hiep_dinh || [])
    .filter((f) => (!f.hieu_luc_tu || f.hieu_luc_tu <= dNgay) && (!f.het_hieu_luc_tu || dNgay < f.het_hieu_luc_tu))
    .map((f) => ({
      ...f,
      van_ban: resolveList(f.van_ban),
    }));

  return {
    ...ftaDist,
    tai_ngay: dNgay,
    tong: hiepDinh.length,
    ...(ftaDist.van_ban_khung_chung ? { van_ban_khung_chung: resolveList(ftaDist.van_ban_khung_chung) } : {}),
    hiep_dinh: hiepDinh,
  };
}
