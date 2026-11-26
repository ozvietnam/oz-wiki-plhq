// Sổ đăng ký & dựng gói dist/pvtm.json (chuan_pvtm: pvtm@1, lop_du_lieu: LUAT).
// Ranh giới tuyệt đối với hs-code-api: chỉ giữ sự thật pháp lý các vụ việc Phòng vệ thương mại
// (mã vụ việc, loại biện pháp, xuất xứ bị áp, danh sách mã HS nêu trong QĐ-BCT nguồn bậc A,
// dải thuế suất pháp định tối thiểu-tối đa, cơ chế miễn trừ, chuỗi quyết định) — không phân loại HS, không tính thuế MFN/FTA.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { ROOT, khoa, bacNguon, homNay, LUOC_DO_PHIEN_BAN } from './registry.mjs';
import { LOP_DU_LIEU, tinhVanTay, nutBieuHs } from './van-tay.mjs';
import { chuanHoaTaiNgay } from './hieu-luc-theo-ngay.mjs';

export const CHUAN_PVTM = 'pvtm@1';
export const GIAY_PHEP = 'CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/';
export const MIEN_TRU = 'Tham khảo, không phải tư vấn pháp lý. Xem và đối chiếu văn bản gốc nguồn bậc A (Bộ Công Thương / Cục Phòng vệ thương mại) trước khi áp dụng.';

export const LOAI_BIEN_PHAP_PVTM = Object.freeze([
  'CHONG_BAN_PHA_GIA',
  'CHONG_TRO_CAP',
  'TU_VE',
  'CHONG_LAN_TRANH',
]);

export const TRANG_THAI_PVTM = Object.freeze([
  'DANG_AP_DUNG',
  'DANG_DIEU_TRA',
  'TAM_THOI',
  'HET_HIEU_LUC',
]);

export const VAI_TRO_QUYET_DINH_PVTM = Object.freeze([
  'CHINH_THUC',
  'RA_SOAT_HANG_NAM',
  'RA_SOAT_CUOI_KY',
  'GIA_HAN',
  'KHOI_XUONG',
  'HUONG_DAN',
]);

const LOAI_BIEN_PHAP_SET = new Set(LOAI_BIEN_PHAP_PVTM);
const TRANG_THAI_SET = new Set(TRANG_THAI_PVTM);
const VAI_TRO_SET = new Set(VAI_TRO_QUYET_DINH_PVTM);

const RE_NGAY = /^(\d{4})-(\d{2})-(\d{2})$/;
const RE_MA_VU_VIEC = /^[A-Z0-9._-]+$/;
const RE_ISO2 = /^[A-Z]{2}$/;
const RE_MA_HS = /^(\d{4}|\d{6}|\d{8})$/;
const TRUONG_CAM_HS_API = new Set(['bieu_thue_chi_tiet', 'thue_mfn', 'thue_fta', 'phan_loai_gir', 'bang_thue_cong_ty']);

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

function chonNguonBacA(d, so) {
  const ds = (d?.nguon || []).filter((n) => n?.url && bacNguon(n.url, so?.nguon || {}) === 'A');
  if (!ds.length) return null;
  const uuTienPdf = ds.find((n) => /\.pdf(?:$|\?)/i.test(n.url) || /\/file\//i.test(n.url));
  return (uuTienPdf || ds[0]).url;
}

/** Đọc tệp registry/phong-ve-thuong-mai.yaml; trả null nếu không tồn tại. */
export function docPhongVeThuongMai(root = ROOT) {
  const tep = join(root, 'registry', 'phong-ve-thuong-mai.yaml');
  if (!existsSync(tep)) return null;
  const parsed = yaml.load(readFileSync(tep, 'utf8'), { schema: yaml.CORE_SCHEMA });
  return parsed ?? null;
}

/**
 * Kiểm chuẩn dữ liệu phòng vệ thương mại đối với sổ đăng ký `so`.
 * Trả mảng chuỗi lỗi (`[]` nếu sạch).
 */
export function kiemTraPhongVeThuongMai(pvtmDoc, so) {
  const loi = [];
  if (!pvtmDoc || typeof pvtmDoc !== 'object' || Array.isArray(pvtmDoc)) {
    return ['phong-ve-thuong-mai.yaml phải là object hợp lệ'];
  }
  if (pvtmDoc.chuan_pvtm !== CHUAN_PVTM) {
    loi.push(`chuan_pvtm phải là "${CHUAN_PVTM}" (nhận "${pvtmDoc.chuan_pvtm}")`);
  }
  if (!Array.isArray(pvtmDoc.vu_viec) || !pvtmDoc.vu_viec.length) {
    loi.push('thiếu vu_viec[] (phải là danh sách không rỗng)');
    return loi;
  }

  const seenMa = new Set();
  pvtmDoc.vu_viec.forEach((v, idx) => {
    const rawMa = typeof v?.ma_vu_viec === 'string' ? v.ma_vu_viec.trim() : '';
    const at = rawMa ? `vu_viec[${idx}] (${rawMa})` : `vu_viec[${idx}]`;
    if (!v || typeof v !== 'object' || Array.isArray(v)) {
      loi.push(`${at} phải là object`);
      return;
    }

    for (const k of Object.keys(v)) {
      if (TRUONG_CAM_HS_API.has(k)) {
        loi.push(`${at} vi phạm ranh giới hs-code-api: không được chứa trường "${k}"`);
      }
    }

    if (!rawMa) {
      loi.push(`${at} thiếu ma_vu_viec`);
    } else {
      if (!RE_MA_VU_VIEC.test(rawMa)) {
        loi.push(`${at} ma_vu_viec "${rawMa}" chỉ được dùng chữ hoa A-Z, số 0-9 và ký tự ._-`);
      }
      const keyMa = rawMa.toUpperCase();
      if (seenMa.has(keyMa)) loi.push(`${at} trùng ma_vu_viec "${rawMa}"`);
      seenMa.add(keyMa);
    }

    if (!LOAI_BIEN_PHAP_SET.has(v.loai_bien_phap)) {
      loi.push(`${at} loai_bien_phap "${v.loai_bien_phap}" không hợp lệ (${LOAI_BIEN_PHAP_PVTM.join(', ')})`);
    }
    if (typeof v.ten_mat_hang !== 'string' || !v.ten_mat_hang.trim()) {
      loi.push(`${at} thiếu ten_mat_hang`);
    }
    if (!TRANG_THAI_SET.has(v.trang_thai)) {
      loi.push(`${at} trang_thai "${v.trang_thai}" không hợp lệ (${TRANG_THAI_PVTM.join(', ')})`);
    }

    // Xuất xứ bị áp (ISO-2): bắt buộc mảng; các vụ CBPG/CTC phải có ít nhất 1 mã ISO-2;
    // biện pháp tự vệ toàn cầu (TU_VE hoặc phạm vi tự vệ toàn cầu) được phép để [] kèm ghi chú loại trừ nước đang phát triển.
    if (!Array.isArray(v.xuat_xu_bi_ap)) {
      loi.push(`${at} xuat_xu_bi_ap phải là mảng mã quốc gia/vùng lãnh thổ ISO-2`);
    } else {
      const seenIso = new Set();
      for (const iso of v.xuat_xu_bi_ap) {
        if (typeof iso !== 'string' || !RE_ISO2.test(iso)) {
          loi.push(`${at} xuat_xu_bi_ap chứa mã "${iso}" không đúng chuẩn ISO-2 (2 chữ cái in hoa, vd CN, TH)`);
        } else if (seenIso.has(iso)) {
          loi.push(`${at} xuat_xu_bi_ap trùng mã "${iso}"`);
        } else {
          seenIso.add(iso);
        }
      }
      const choPhepRongToanCau = v.loai_bien_phap === 'TU_VE'
        || (v.loai_bien_phap === 'CHONG_LAN_TRANH' && v.pham_vi_toan_cau === true);
      if (v.xuat_xu_bi_ap.length === 0 && !choPhepRongToanCau) {
        loi.push(`${at} xuat_xu_bi_ap không được rỗng đối với biện pháp ${v.loai_bien_phap}`);
      }
    }

    // Danh sách mã HS 4/6/8 chữ số
    if (!Array.isArray(v.ma_hs) || !v.ma_hs.length) {
      loi.push(`${at} ma_hs phải là mảng không rỗng các mã HS 4/6/8 chữ số`);
    } else {
      const seenHs = new Set();
      for (const h of v.ma_hs) {
        if (typeof h !== 'string' || !RE_MA_HS.test(h)) {
          loi.push(`${at} ma_hs "${h}" không hợp lệ (phải là chuỗi 4, 6 hoặc 8 chữ số, không dấu chấm)`);
        } else if (seenHs.has(h)) {
          loi.push(`${at} ma_hs trùng "${h}"`);
        } else {
          seenHs.add(h);
        }
      }
    }

    // Dải thuế suất phần trăm
    const dai = v.dai_thue_suat_phan_tram;
    if (!dai || typeof dai !== 'object' || Array.isArray(dai)) {
      loi.push(`${at} dai_thue_suat_phan_tram phải là object {toi_thieu, toi_da, ghi_chu}`);
    } else {
      const minOk = dai.toi_thieu === null || (typeof dai.toi_thieu === 'number' && Number.isFinite(dai.toi_thieu) && dai.toi_thieu >= 0);
      const maxOk = dai.toi_da === null || (typeof dai.toi_da === 'number' && Number.isFinite(dai.toi_da) && dai.toi_da >= 0);
      if (!minOk) loi.push(`${at} dai_thue_suat_phan_tram.toi_thieu phải là số >= 0 hoặc null`);
      if (!maxOk) loi.push(`${at} dai_thue_suat_phan_tram.toi_da phải là số >= 0 hoặc null`);
      if ((dai.toi_thieu === null) !== (dai.toi_da === null)) {
        loi.push(`${at} dai_thue_suat_phan_tram.toi_thieu và toi_da phải cùng là số hoặc cùng là null`);
      } else if (typeof dai.toi_thieu === 'number' && typeof dai.toi_da === 'number' && dai.toi_thieu > dai.toi_da) {
        loi.push(`${at} dai_thue_suat_phan_tram.toi_thieu (${dai.toi_thieu}) > toi_da (${dai.toi_da})`);
      }
      if (typeof dai.ghi_chu !== 'string' || !dai.ghi_chu.trim()) {
        loi.push(`${at} dai_thue_suat_phan_tram.ghi_chu phải là chuỗi không rỗng`);
      }
    }

    // Ngày hiệu lực / hết hiệu lực
    if (!laNgayHopLe(v.hieu_luc_tu)) {
      loi.push(`${at} hieu_luc_tu "${v.hieu_luc_tu}" phải đúng định dạng lịch YYYY-MM-DD`);
    }
    if (v.het_hieu_luc_tu !== null && v.het_hieu_luc_tu !== undefined && !laNgayHopLe(v.het_hieu_luc_tu)) {
      loi.push(`${at} het_hieu_luc_tu "${v.het_hieu_luc_tu}" phải đúng định dạng lịch YYYY-MM-DD hoặc null`);
    }
    if (v.trang_thai === 'HET_HIEU_LUC' && !laNgayHopLe(v.het_hieu_luc_tu)) {
      loi.push(`${at} trang_thai = HET_HIEU_LUC bắt buộc phải có het_hieu_luc_tu hợp lệ (YYYY-MM-DD)`);
    }
    if (v.het_hieu_luc_tu && laNgayHopLe(v.hieu_luc_tu) && laNgayHopLe(v.het_hieu_luc_tu) && v.het_hieu_luc_tu < v.hieu_luc_tu) {
      loi.push(`${at} het_hieu_luc_tu (${v.het_hieu_luc_tu}) trước hieu_luc_tu (${v.hieu_luc_tu})`);
    }

    if (typeof v.mien_tru_co_ban !== 'boolean') {
      loi.push(`${at} mien_tru_co_ban phải là boolean`);
    }
    if (typeof v.ghi_chu_phap_ly !== 'string' || !v.ghi_chu_phap_ly.trim()) {
      loi.push(`${at} ghi_chu_phap_ly phải là chuỗi không rỗng`);
    }

    // Chuỗi quyết định
    if (!Array.isArray(v.chuoi_quyet_dinh) || !v.chuoi_quyet_dinh.length) {
      loi.push(`${at}.chuoi_quyet_dinh phải là danh sách không rỗng`);
    } else {
      const seenQd = new Set();
      let coConHieuLuc = false;
      v.chuoi_quyet_dinh.forEach((qd, j) => {
        const qdAt = `${at}.chuoi_quyet_dinh[${j}]`;
        if (!qd || typeof qd !== 'object' || Array.isArray(qd)) {
          loi.push(`${qdAt} phải là object {so_hieu, vai_tro, ...}`);
          return;
        }
        const sh = typeof qd.so_hieu === 'string' ? qd.so_hieu.trim() : '';
        if (!sh) {
          loi.push(`${qdAt} thiếu so_hieu`);
          return;
        }
        const k = khoa(sh);
        if (seenQd.has(k)) loi.push(`${qdAt} trùng so_hieu "${sh}"`);
        seenQd.add(k);

        if (!VAI_TRO_SET.has(qd.vai_tro)) {
          loi.push(`${qdAt} (${sh}) vai_tro "${qd.vai_tro}" không hợp lệ (${VAI_TRO_QUYET_DINH_PVTM.join(', ')})`);
        }
        if (qd.hieu_luc_tu != null && !laNgayHopLe(qd.hieu_luc_tu)) {
          loi.push(`${qdAt} (${sh}) hieu_luc_tu "${qd.hieu_luc_tu}" phải dạng YYYY-MM-DD`);
        }
        if (qd.het_hieu_luc_tu != null && !laNgayHopLe(qd.het_hieu_luc_tu)) {
          loi.push(`${qdAt} (${sh}) het_hieu_luc_tu "${qd.het_hieu_luc_tu}" phải dạng YYYY-MM-DD hoặc null`);
        }

        const docs = so?.theoKhoa?.get(k);
        if (!docs || !docs.length) {
          loi.push(`${qdAt} so_hieu "${sh}" không tồn tại trong so.theoKhoa`);
          return;
        }
        if (docs[0].tinh_trang === 'CON_HIEU_LUC') {
          coConHieuLuc = true;
        }
      });

      if (['DANG_AP_DUNG', 'DANG_DIEU_TRA', 'TAM_THOI'].includes(v.trang_thai) && !coConHieuLuc) {
        loi.push(`${at} có trang_thai="${v.trang_thai}" nhưng không có quyết định nào CON_HIEU_LUC trong chuoi_quyet_dinh`);
      }
    }
  });

  return loi;
}

function giaiQuyetQuyetDinh(item, so) {
  const k = khoa(item.so_hieu);
  const d = so?.theoKhoa?.get(k)?.[0] || null;
  const nguonA = item.nguon_a || chonNguonBacA(d, so);
  return {
    id: d?._slug ? `vb:${d._slug}` : null,
    so_hieu: d?.so_hieu || item.so_hieu,
    slug: d?._slug || item.slug || null,
    tinh_trang: d?.tinh_trang || null,
    vai_tro: item.vai_tro,
    hieu_luc_tu: item.hieu_luc_tu ?? d?.hieu_luc_tu ?? null,
    het_hieu_luc_tu: item.het_hieu_luc_tu !== undefined ? item.het_hieu_luc_tu : (d?.het_hieu_luc_tu ?? null),
    nguon_a: nguonA,
  };
}

/** Dựng object JSON `dist/pvtm.json` (`chuan_pvtm: pvtm@1`, `lop_du_lieu: LUAT`). */
export function dungPhongVeThuongMai(so, root = ROOT, today = homNay()) {
  const pvtmDoc = docPhongVeThuongMai(root);
  const rawCases = Array.isArray(pvtmDoc?.vu_viec) ? pvtmDoc.vu_viec : [];

  const vuViec = rawCases.map((v) => {
    const id = `pvtm:${String(v.ma_vu_viec || '').trim().toLowerCase()}`;
    const maHs = Array.isArray(v.ma_hs) ? v.ma_hs.map((h) => String(h).trim()) : [];
    const nutBieu = maHs.map((h) => nutBieuHs(h));
    const dai = v.dai_thue_suat_phan_tram || {};
    const chuoiQuyetDinh = (Array.isArray(v.chuoi_quyet_dinh) ? v.chuoi_quyet_dinh : []).map((q) => giaiQuyetQuyetDinh(q, so));

    const core = {
      id,
      ma_vu_viec: v.ma_vu_viec,
      loai_bien_phap: v.loai_bien_phap,
      ten_mat_hang: v.ten_mat_hang,
      trang_thai: v.trang_thai,
      xuat_xu_bi_ap: Array.isArray(v.xuat_xu_bi_ap) ? [...v.xuat_xu_bi_ap] : [],
      ma_hs: maHs,
      nut_bieu: nutBieu,
      dai_thue_suat_phan_tram: {
        toi_thieu: dai.toi_thieu ?? null,
        toi_da: dai.toi_da ?? null,
        ghi_chu: dai.ghi_chu || '',
      },
      hieu_luc_tu: v.hieu_luc_tu || null,
      het_hieu_luc_tu: v.het_hieu_luc_tu ?? null,
      mien_tru_co_ban: Boolean(v.mien_tru_co_ban),
      chuoi_quyet_dinh: chuoiQuyetDinh,
      ghi_chu_phap_ly: v.ghi_chu_phap_ly || '',
    };

    const van = tinhVanTay(core);
    return {
      id: core.id,
      van,
      ma_vu_viec: core.ma_vu_viec,
      loai_bien_phap: core.loai_bien_phap,
      ten_mat_hang: core.ten_mat_hang,
      trang_thai: core.trang_thai,
      xuat_xu_bi_ap: core.xuat_xu_bi_ap,
      ma_hs: core.ma_hs,
      nut_bieu: core.nut_bieu,
      dai_thue_suat_phan_tram: core.dai_thue_suat_phan_tram,
      hieu_luc_tu: core.hieu_luc_tu,
      het_hieu_luc_tu: core.het_hieu_luc_tu,
      mien_tru_co_ban: core.mien_tru_co_ban,
      chuoi_quyet_dinh: core.chuoi_quyet_dinh,
      ghi_chu_phap_ly: core.ghi_chu_phap_ly,
    };
  });

  return {
    luoc_do_phien_ban: LUOC_DO_PHIEN_BAN,
    chuan_pvtm: CHUAN_PVTM,
    lop_du_lieu: LOP_DU_LIEU.LUAT,
    phien_ban: today,
    giay_phep: GIAY_PHEP,
    ghi_nguon_chuan: `Nguồn: oz-wiki-plhq — https://github.com/ozvietnam/oz-wiki-plhq (CC BY 4.0, bản ${today}).`,
    mien_tru: MIEN_TRU,
    tong_vu_viec: vuViec.length,
    vu_viec: vuViec,
  };
}

/**
 * Lọc các vụ việc PVTM khớp mã HS 4/6/8 chữ số (khớp chính xác 8 số hoặc tiền tố 4/6 số)
 * và đang có hiệu lực/điều tra tại ngày `taiNgay` (`YYYY-MM-DD`, hoặc hiện hành nếu bỏ trống).
 */
export function locPvtmTheoHsVaNgay(pvtmDist, maHs, taiNgay = null) {
  const chuanNgay = chuanHoaTaiNgay(taiNgay);
  if (!chuanNgay.hopLe) throw new Error(chuanNgay.loi);

  const maChuan = String(maHs ?? '').replace(/[\s.]/g, '');
  if (!RE_MA_HS.test(maChuan)) return [];

  const ds = Array.isArray(pvtmDist)
    ? pvtmDist
    : (Array.isArray(pvtmDist?.vu_viec) ? pvtmDist.vu_viec : []);
  if (!ds.length) return [];

  const dNgay = chuanNgay.giaTri;
  const ketQua = [];

  for (const v of ds) {
    const hsList = Array.isArray(v?.ma_hs) ? v.ma_hs : [];
    const maHsKhop = hsList.filter((h) => h === maChuan || maChuan.startsWith(h) || h.startsWith(maChuan));
    if (!maHsKhop.length) continue;

    if (dNgay) {
      const tuOk = !v.hieu_luc_tu || v.hieu_luc_tu <= dNgay;
      const denOk = !v.het_hieu_luc_tu || dNgay < v.het_hieu_luc_tu;
      if (!tuOk || !denOk) continue;
    } else if (v.trang_thai === 'HET_HIEU_LUC') {
      continue;
    }

    ketQua.push({
      ...v,
      ma_hs_khop: maHsKhop,
      ...(dNgay ? { tai_ngay: dNgay } : {}),
    });
  }

  return ketQua;
}
