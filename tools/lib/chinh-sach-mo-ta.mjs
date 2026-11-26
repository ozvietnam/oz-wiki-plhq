// Tầng 2 — Chính sách quản lý chuyên ngành theo mô tả hàng hoá (không cố định mã HS) & Từ điển viết tắt PLHQ.
// Ranh giới tuyệt đối 0% trùng lặp với hs-code-api: không phân loại mã HS, không chạy GIR, không tính thuế suất.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { ROOT, khoa, bacNguon, homNay, LUOC_DO_PHIEN_BAN } from './registry.mjs';
import { LOAI_TAC_DONG } from './danh-muc.mjs';
import { LOP_DU_LIEU } from './van-tay.mjs';

export const GIAY_PHEP = 'CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/';
export const MIEN_TRU = 'Tham khảo, không phải tư vấn pháp lý. Xem và đối chiếu văn bản gốc nguồn bậc A trước khi áp dụng.';
export const CANH_BAO_TANG_2 =
  'Tầng 2 suy ra theo mô tả hàng hóa (VUA_SUY_RA) — chỉ tham khảo kiểm tra chuyên ngành, không phân loại mã HS; luôn đối chiếu văn bản gốc nguồn bậc A.';

const SLUG_RE = /^[a-z0-9-]+$/;

/** 25 thuật ngữ viết tắt chuẩn XNK / pháp luật hải quan (đồng bộ với hs-code-api VIET_TAT_TEN). */
export const TU_DIEN_VIET_TAT_PLHQ = Object.freeze({
  gtgt: 'giá trị gia tăng',
  ktcn: 'kiểm tra chuyên ngành',
  attp: 'an toàn thực phẩm',
  cbpg: 'chống bán phá giá',
  pvtm: 'phòng vệ thương mại',
  co: 'xuất xứ hàng hóa',
  xnk: 'xuất nhập khẩu',
  hq: 'hải quan',
  ttdb: 'tiêu thụ đặc biệt',
  bvmt: 'bảo vệ môi trường',
  tntx: 'tạm nhập tái xuất',
  dncx: 'doanh nghiệp chế xuất',
  qlrr: 'quản lý rủi ro',
  kstq: 'kiểm tra sau thông quan',
  gcn: 'giấy chứng nhận',
  qcvn: 'quy chuẩn kỹ thuật quốc gia',
  tcvn: 'tiêu chuẩn quốc gia',
  vbhn: 'văn bản hợp nhất',
  vphc: 'vi phạm hành chính',
  mfn: 'thuế suất ưu đãi',
  acfta: 'ASEAN Trung Quốc',
  evfta: 'Việt Nam Liên minh Châu Âu',
  rcep: 'Đối tác Kinh tế Toàn diện Khu vực',
  kd: 'kiểm dịch',
  ktcl: 'kiểm tra chất lượng',
});

export function ghiNguonChuan(today = homNay()) {
  return `Nguồn: oz-wiki-plhq — https://github.com/ozvietnam/oz-wiki-plhq (CC BY 4.0, bản ${today}).`;
}

/** Đọc tệp danh-muc/chinh-sach-mo-ta.yaml bằng js-yaml CORE_SCHEMA; trả null nếu không tồn tại. */
export function docChinhSachMoTa(root = ROOT) {
  const tep = join(root, 'danh-muc', 'chinh-sach-mo-ta.yaml');
  if (!existsSync(tep)) return null;
  const parsed = yaml.load(readFileSync(tep, 'utf8'), { schema: yaml.CORE_SCHEMA });
  return parsed ?? null;
}

/** Kiểm chuẩn danh mục Tầng 2 so với LOAI_TAC_DONG và sổ đăng ký `so`. Trả mảng chuỗi lỗi (`[]` nếu sạch). */
export function kiemChinhSachMoTa(data, so) {
  const loi = [];
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return ['chinh-sach-mo-ta.yaml phải là object hợp lệ'];
  }
  if (!Array.isArray(data.quy_tac) || !data.quy_tac.length) {
    loi.push('thiếu quy_tac[] (phải là danh sách không rỗng)');
    return loi;
  }

  const seenIds = new Set();
  data.quy_tac.forEach((rule, idx) => {
    const idStr = typeof rule?.id === 'string' ? rule.id.trim() : '';
    const at = idStr ? `quy_tac[${idx}] (${idStr})` : `quy_tac[${idx}]`;
    if (!rule || typeof rule !== 'object' || Array.isArray(rule)) {
      loi.push(`${at} phải là object`);
      return;
    }

    if (!idStr) {
      loi.push(`${at} thiếu id`);
    } else {
      if (!SLUG_RE.test(idStr)) loi.push(`${at} id "${idStr}" phải là slug (a-z, 0-9, -)`);
      if (seenIds.has(idStr)) loi.push(`${at} trùng id "${idStr}"`);
      seenIds.add(idStr);
    }

    for (const truong of ['ten', 'nhom_hang', 'nghia_vu_tom_tat', 'luu_y_loai_tru', 'ranh_gioi_hs_api']) {
      if (typeof rule[truong] !== 'string' || !rule[truong].trim()) {
        loi.push(`${at} thiếu ${truong}`);
      }
    }

    if (!Array.isArray(rule.tu_khoa_nhan_dien) || !rule.tu_khoa_nhan_dien.length) {
      loi.push(`${at} tu_khoa_nhan_dien rỗng`);
    } else if (rule.tu_khoa_nhan_dien.some((kw) => typeof kw !== 'string' || !kw.trim())) {
      loi.push(`${at} tu_khoa_nhan_dien chứa phần tử rỗng`);
    }

    if (!LOAI_TAC_DONG.includes(rule.loai_tac_dong)) {
      loi.push(`${at} loai_tac_dong "${rule.loai_tac_dong}" không hợp lệ (${LOAI_TAC_DONG.join(', ')})`);
    }

    if (rule.do_tin !== 'VUA_SUY_RA') {
      loi.push(`${at} do_tin phải là "VUA_SUY_RA" (nhận "${rule.do_tin}")`);
    }

    if (!Array.isArray(rule.can_cu_so_hieu) || !rule.can_cu_so_hieu.length) {
      loi.push(`${at} thiếu can_cu_so_hieu[]`);
    } else {
      for (const sh of rule.can_cu_so_hieu) {
        if (typeof sh !== 'string' || !sh.trim()) {
          loi.push(`${at} can_cu_so_hieu chứa phần tử rỗng`);
          continue;
        }
        if (!so?.theoKhoa?.has(khoa(sh))) {
          loi.push(`${at} can_cu_so_hieu "${sh}" không tồn tại trong so.theoKhoa`);
        }
      }
    }
  });

  return loi;
}

function chiTietCanCu(sh, so) {
  const d = so?.theoKhoa?.get(khoa(sh))?.[0] || null;
  const bacList = (d?.nguon || []).map((n) => bacNguon(n.url, so?.nguon || {})).sort();
  const urlNguonA = (d?.nguon || []).find((n) => bacNguon(n.url, so?.nguon || {}) === 'A')?.url || null;
  return {
    so_hieu: d?.so_hieu || sh,
    slug: d?._slug || null,
    tinh_trang: d?.tinh_trang || null,
    hieu_luc_tu: d?.hieu_luc_tu || null,
    het_hieu_luc_tu: d?.het_hieu_luc_tu || null,
    bac_nguon_cao_nhat: bacList[0] || null,
    url_nguon_a: urlNguonA,
  };
}

/** Dựng object JSON `dist/chinh-sach-mo-ta.json` (lược đồ 1.5.0, Tầng 2 VUA_SUY_RA + 25 viết tắt PLHQ). */
export function dungChinhSachMoTa(so, root = ROOT, today = homNay()) {
  const data = docChinhSachMoTa(root);
  const rawRules = Array.isArray(data?.quy_tac) ? data.quy_tac : [];
  const quyTac = rawRules.map((rule) => {
    const canCu = Array.isArray(rule.can_cu_so_hieu) ? rule.can_cu_so_hieu : [];
    return {
      id: rule.id,
      ten: rule.ten,
      nhom_hang: rule.nhom_hang,
      tu_khoa_nhan_dien: Array.isArray(rule.tu_khoa_nhan_dien) ? rule.tu_khoa_nhan_dien : [],
      loai_tac_dong: rule.loai_tac_dong,
      do_tin: rule.do_tin,
      can_cu_so_hieu: canCu,
      can_cu_chi_tiet: canCu.map((sh) => chiTietCanCu(sh, so)),
      nghia_vu_tom_tat: rule.nghia_vu_tom_tat,
      luu_y_loai_tru: rule.luu_y_loai_tru,
      ranh_gioi_hs_api: rule.ranh_gioi_hs_api,
    };
  });

  return {
    phien_ban: today,
    luoc_do_phien_ban: LUOC_DO_PHIEN_BAN,
    lop_du_lieu: LOP_DU_LIEU.BO_TRO,
    giay_phep: GIAY_PHEP,
    ghi_nguon_chuan: ghiNguonChuan(today),
    mien_tru: MIEN_TRU,
    canh_bao_tang_2: CANH_BAO_TANG_2,
    tong_quy_tac: quyTac.length,
    tu_dien_viet_tat: { ...TU_DIEN_VIET_TAT_PLHQ },
    quy_tac: quyTac,
  };
}
