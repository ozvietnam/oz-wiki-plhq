#!/usr/bin/env node
/**
 * Công cụ phân loại issue `[miss]` CHỈ ĐỌC (read-only) cho oz-wiki-plhq.
 * Tuyệt đối không đóng, sửa hoặc bình luận issue trên GitHub và không ghi tệp báo cáo ra đĩa.
 *
 * Sử dụng:
 *   node tools/phan-loai-miss.mjs [--file <path> | --gh] [--json] [--limit <n>] [--all]
 */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { napSo, khoa, boDau, homNay, ROOT } from './lib/registry.mjs';

export const REPO_MAC_DINH = 'ozvietnam/oz-wiki-plhq';
export const LIMIT_MAC_DINH = 100;

export const NHOM_MISS = {
  DA_CO_TRONG_SO: 'DA_CO_TRONG_SO',
  THUOC_HS_CODE_API: 'THUOC_HS_CODE_API',
  THIEU_VAN_BAN_MOI: 'THIEU_VAN_BAN_MOI',
  THIEU_WIKI_HOAC_DIEU_KHOAN: 'THIEU_WIKI_HOAC_DIEU_KHOAN',
  KHAC_CAN_RA_SOAT: 'KHAC_CAN_RA_SOAT',
};

export const THU_TU_NHOM = [
  NHOM_MISS.DA_CO_TRONG_SO,
  NHOM_MISS.THUOC_HS_CODE_API,
  NHOM_MISS.THIEU_VAN_BAN_MOI,
  NHOM_MISS.THIEU_WIKI_HOAC_DIEU_KHOAN,
  NHOM_MISS.KHAC_CAN_RA_SOAT,
];

export const TEN_NHOM_MISS = {
  [NHOM_MISS.DA_CO_TRONG_SO]: 'Đã có trong sổ',
  [NHOM_MISS.THUOC_HS_CODE_API]: 'Thuộc hs-code-api (ngoài biên)',
  [NHOM_MISS.THIEU_VAN_BAN_MOI]: 'Thiếu văn bản mới',
  [NHOM_MISS.THIEU_WIKI_HOAC_DIEU_KHOAN]: 'Thiếu wiki hoặc điều khoản',
  [NHOM_MISS.KHAC_CAN_RA_SOAT]: 'Khác — cần rà soát thủ công',
};

const HANH_DONG_NHOM = {
  [NHOM_MISS.DA_CO_TRONG_SO]: 'Đối chiếu lại trạng thái nguồn A/hiệu lực trong sổ và xác nhận đóng issue (nếu bot sinh cũ).',
  [NHOM_MISS.THUOC_HS_CODE_API]: 'Chuyển sang kho hs-code-api (ngoài phạm vi oz-wiki-plhq).',
  [NHOM_MISS.THIEU_VAN_BAN_MOI]: 'Truy vết nguồn chính thống bậc A và nạp vào registry/van-ban/ bằng tools/them-van-ban.mjs.',
  [NHOM_MISS.THIEU_WIKI_HOAC_DIEU_KHOAN]: 'Bổ sung trang wiki/ hoặc trích xuất nguyên văn xac_minh.dieu_khoan.',
  [NHOM_MISS.KHAC_CAN_RA_SOAT]: 'Rà soát thủ công (số hiệu bị cắt cụt, mơ hồ hoặc thiếu ngữ cảnh).',
};

// Mẫu số hiệu VBQPPL / công văn rõ ràng theo chuẩn Việt Nam.
const RE_VBQPPL_CO_BAN = /(?<![\p{L}\p{N}/-])\d{1,5}\/(?:\d{4}\/)?(?:TT|NĐ|ND|QĐ|QD|NQ|TTLT|CT|QH\d*|UBTVQH\d*|CV)(?:[/-][\p{L}\p{N}]+)*(?![\p{L}\p{N}/-])/giu;
const RE_VBHN = /(?<![\p{L}\p{N}/-])\d{1,4}(?:\/\d{4})?[/-]VBHN(?:[/-][\p{L}\p{N}]+)+(?![\p{L}\p{N}/-])/giu;
const RE_CONG_VAN_CQ = /(?<![\p{L}\p{N}/-])\d{1,5}\/(?:\d{4}\/)?(?:CHQ|TCHQ|BCT|BTC|BYT|BKHCN|BNNMT|BNNPTNT|BXD|BCA|SPS|NHNN|BTP|BTNMT|BTTTT|BGTVT|VPCP|TTCP|BVHTTDL|BGDĐT|BGDDT|BLĐTBXH|BLDTBXH)(?:-[\p{L}\p{N}]+)+(?![\p{L}\p{N}/-])/giu;
const RE_THONG_BAO_HS = /(?<![\p{L}\p{N}/-])\d{1,5}\/(?:\d{4}\/)?TB-[\p{L}\p{N}]+(?:\/\d{4})?(?![\p{L}\p{N}/-])/giu;
const RE_QCVN_TCVN = /(?<![\p{L}\p{N}/-])(?:QCVN|TCVN)\s*\d+(?:[-.]\d+)*(?::\d{4})?(?:\/[\p{L}\p{N}-]+)?(?![\p{L}\p{N}/-])/giu;
const RE_URL = /https?:\/\/\S+/gi;

const RE_HS_CODE_API_LIST = [
  /(?:engine|bộ máy|mô hình)\s*(?:phân loại|tra cứu)?\s*(?:mã\s*)?hs\b/i,
  /(?:áp|tra|xác định|gắn|tìm|xin)\s*mã\s*(?:hs|hàng hóa)?\s*(?:8\s*(?:số|chữ số)|chi tiết)?/i,
  /\bmã\s*(?:hs\s*)?8\s*(?:số|chữ số)\b/i,
  /(?:biểu thuế|thuế suất)\s*(?:xnk|xuất nhập khẩu|nhập khẩu|xuất khẩu|ưu đãi(?:\s*đặc biệt)?|mfn|fta)\b/i,
  /(?:tra|tính|áp)\s*thuế\s*suất\b/i,
  /(?:quy tắc|6 quy tắc)\s*(?:tổng quát\s*)?(?:gir|gri)\b/i,
  /\bgir\s*[1-6]\b/i,
  /chú giải\s*(?:hs|wco|sen|tổng quát|chương|nhóm|phân nhóm)\b/i,
  /\bwco\b.*?\b(?:hs|chú giải)\b|\bexplanatory\s+notes\b/i,
  /tiền lệ áp mã|tiền lệ phân loại mã|kết quả phân loại mẫu hàng/i,
  /(?:chuyển|xử lý|thuộc)\s*(?:bên\s*)?hs-code-api\b/i,
];

const RE_WIKI_DIEU_KHOAN_LIST = [
  /hỏi đáp(?:\s*nghiệp vụ)?/i,
  /nghiệp vụ\s*(?:hải quan|xnk|xuất nhập khẩu)/i,
  /hướng dẫn\s*(?:thủ tục|nghiệp vụ|khai báo|thực hiện)/i,
  /thủ tục\s*(?:hải quan|nhập khẩu|xuất khẩu|tái xuất|tạm nhập|gia công|sxxk)/i,
  /kiểm tra chuyên ngành|\bktcn\b/i,
  /điều khoản(?:\s*(?:nguyên văn|văn bản|chi tiết))?|trích\s*điều|nguyên văn\s*điều/i,
  /tóm tắt\s*(?:văn bản|quy định|nội dung)/i,
  /(?:bổ sung|cập nhật|viết|thiếu)\s*(?:trang\s*)?wiki\b|\bwiki\/(?:concepts|summary|sources)\b/i,
  /văn bản đã biết/i,
  /(?:công bố hợp quy|kiểm dịch|an toàn thực phẩm|kiểm tra chất lượng|chứng nhận xuất xứ|trị giá hải quan|một cửa quốc gia)/i,
];

/** Làm sạch dấu markdown/câu bao quanh số hiệu trích xuất. */
function lamSachSoHieu(raw) {
  return String(raw || '')
    .normalize('NFC')
    .trim()
    .replace(/^[`'"([{*«“]+/, '')
    .replace(/[`'")\]}*»”.,;:!?]+$/, '');
}

/** Chuẩn hoá danh sách tên nhãn từ dữ liệu issue GitHub hoặc fixture. */
function layDanhSachNhan(issue) {
  const raw = Array.isArray(issue?.labels) ? issue.labels : [];
  return raw
    .map((l) => (typeof l === 'string' ? l : l?.name))
    .map((s) => String(s || '').trim())
    .filter(Boolean);
}

/** Kiểm tra issue có phải loại `[miss]` qua tiêu đề hoặc nhãn `miss`. */
export function laIssueMiss(issue) {
  const title = String(issue?.title || '');
  if (/\[miss\]/i.test(title)) return true;
  return layDanhSachNhan(issue).some((n) => /^miss$/i.test(n) || /\bmiss\b/i.test(n));
}

/** Trích mục tiêu chính sau thẻ `[miss]` trong tiêu đề nếu có dạng `[miss] <muc_tieu> — ...`. */
function trichMucTieuTieuDeMiss(title, theoKhoa) {
  const raw = String(title || '').normalize('NFC').trim();
  if (!/\[miss\]/i.test(raw)) return null;
  const sauThe = raw.replace(/^.*?\[miss\]\s*/i, '').trim();
  if (!sauThe) return null;
  const phanDau = lamSachSoHieu(sauThe.split(/\s+[—–]\s+|\s+-\s+/)[0]);
  if (!phanDau || phanDau.length > 64) return null;
  if (theoKhoa?.has(khoa(phanDau))) return phanDau;
  if (!/\s/.test(phanDau) && /\d/.test(phanDau) && /[/:_.-]/.test(phanDau)) return phanDau;
  if (/^(?:QCVN|TCVN)\s*\d/i.test(phanDau)) return phanDau;
  return null;
}

/** Trích các số hiệu VBQPPL/công văn/QCVN/VBHN từ văn bản, bỏ qua URL. */
export function trichXuatSoHieu(text) {
  const cleanText = String(text || '').normalize('NFC').replace(RE_URL, ' ');
  const ketQua = [];
  const daCo = new Set();
  const them = (s) => {
    const cleaned = lamSachSoHieu(s);
    const k = khoa(cleaned);
    if (!cleaned || !k || daCo.has(k)) return;
    daCo.add(k);
    ketQua.push(cleaned);
  };

  for (const re of [RE_VBQPPL_CO_BAN, RE_VBHN, RE_CONG_VAN_CQ, RE_THONG_BAO_HS, RE_QCVN_TCVN]) {
    re.lastIndex = 0;
    for (const m of cleanText.matchAll(re)) them(m[0]);
  }
  return ketQua;
}

/** Tìm thêm các token có số và ký tự phân cách trong văn bản để bắt `so_hieu_khac` dị biệt. */
function trichTokenKhopSo(text, theoKhoa) {
  const cleanText = String(text || '').normalize('NFC').replace(RE_URL, ' ');
  const out = [];
  const daCo = new Set();
  for (const raw of cleanText.split(/[\s,;()[\]{}<>"'«»“”`]+/)) {
    const tok = lamSachSoHieu(raw);
    if (!tok || !/\d/.test(tok) || !/[/:_.-]/.test(tok)) continue;
    const k = khoa(tok);
    if (!k || daCo.has(k)) continue;
    if (theoKhoa.has(k)) {
      daCo.add(k);
      out.push(tok);
    }
  }
  return out;
}

/** Dựng hoặc tái sử dụng chỉ mục `theoKhoa` từ `so.vanBan` (hỗ trợ cả mock chỉ có `vanBan[]`). */
function taoChiMucKhoa(so) {
  const vanBan = Array.isArray(so?.vanBan) ? so.vanBan : [];
  if (so?.theoKhoa instanceof Map && so.theoKhoa.size >= vanBan.length && vanBan.length > 0) {
    return so.theoKhoa;
  }
  const map = new Map();
  for (const d of vanBan) {
    if (!d) continue;
    for (const s of [d.so_hieu, ...(Array.isArray(d.so_hieu_khac) ? d.so_hieu_khac : [])]) {
      const k = khoa(s);
      if (!k) continue;
      if (!map.has(k)) map.set(k, []);
      if (!map.get(k).includes(d)) map.get(k).push(d);
    }
  }
  return map;
}

/** Chọn bản ghi đại diện ưu tiên khớp chính -> còn hiệu lực -> NGUON_A. */
function chonBanGhi(ds, k) {
  if (!Array.isArray(ds) || ds.length === 0) return null;
  if (ds.length === 1) return ds[0];
  const diem = (d) =>
    (khoa(d.so_hieu) === k ? 8 : 0) +
    (d.tinh_trang !== 'HET_HIEU_LUC' ? 4 : 0) +
    (d.xac_minh?.muc === 'NGUON_A' ? 2 : 0);
  return [...ds].sort((a, b) => {
    const hieu = diem(b) - diem(a);
    if (hieu !== 0) return hieu;
    return String(b.ngay_ban_hanh || '').localeCompare(String(a.ngay_ban_hanh || ''));
  })[0];
}

function traCuuKhoa(theoKhoa, soHieu) {
  const k = khoa(soHieu);
  if (!k) return null;
  const ds = theoKhoa.get(k);
  if (!ds || ds.length === 0) return null;
  const doc = chonBanGhi(ds, k);
  return {
    doc,
    khoaTruyVan: k,
    khopQuaSoHieuKhac: khoa(doc.so_hieu) !== k,
  };
}

/** Tìm văn bản gần khớp theo tiền tố cho các số hiệu nghi bị cắt cụt (vd `69/2018/N` -> `69/2018/NĐ-CP`). */
function timGanKhop(soHieuList, vanBan) {
  const ketQua = [];
  const daThem = new Set();
  for (const raw of soHieuList) {
    const k = khoa(raw);
    if (!k || k.length < 6 || !/\d/.test(k)) continue;
    for (const d of vanBan) {
      for (const s of [d.so_hieu, ...(Array.isArray(d.so_hieu_khac) ? d.so_hieu_khac : [])]) {
        const ks = khoa(s);
        if (ks.length > k.length && ks.startsWith(k) && !daThem.has(d.so_hieu)) {
          daThem.add(d.so_hieu);
          ketQua.push(d.so_hieu);
        }
      }
    }
  }
  return ketQua.slice(0, 5);
}

function khopMau(text, patterns) {
  const nfc = String(text || '').normalize('NFC');
  const ascii = boDau(nfc).toLowerCase();
  return patterns.some((re) => re.test(nfc) || re.test(ascii));
}

function gopKhongTrung(listA, listB) {
  const out = [];
  const seen = new Set();
  for (const item of [...listA, ...listB]) {
    const k = khoa(item);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

/**
 * Phân loại 1 issue theo thứ tự ưu tiên deterministic 5 nhóm.
 */
export function phanLoaiMotIssue(issue, so, chiMuc) {
  const vanBan = Array.isArray(so?.vanBan) ? so.vanBan : [];
  const theoKhoa = chiMuc || taoChiMucKhoa(so);
  const title = String(issue?.title ?? '');
  const body = String(issue?.body ?? '');
  const labels = layDanhSachNhan(issue);
  const laMiss = laIssueMiss(issue);

  const mucTieuTieuDe = trichMucTieuTieuDeMiss(title, theoKhoa);
  const refTieuDe = gopKhongTrung(
    mucTieuTieuDe ? [mucTieuTieuDe] : [],
    gopKhongTrung(trichXuatSoHieu(title), trichTokenKhopSo(title, theoKhoa)),
  );
  const refNoiDung = gopKhongTrung(trichXuatSoHieu(body), trichTokenKhopSo(body, theoKhoa));
  const tatCaRef = gopKhongTrung(refTieuDe, refNoiDung);

  // Kiểm tra các số hiệu ở tiêu đề trước để tránh tham chiếu phụ trong body (như NĐ 174/2025 ở #426) chiếm quyền.
  let khopSo = null;
  let soHieuTruyVan = null;
  for (const r of refTieuDe) {
    const hit = traCuuKhoa(theoKhoa, r);
    if (hit) {
      khopSo = hit;
      soHieuTruyVan = r;
      break;
    }
  }

  const tieuDeDaChiDinhSoHieuThieu = refTieuDe.length > 0 && !khopSo;

  const taoKetQua = (nhom, lyDo, extras = {}) => {
    const chuaCo = tatCaRef.filter((r) => !traCuuKhoa(theoKhoa, r));
    const ganKhop = timGanKhop(chuaCo, vanBan);
    return {
      number: issue?.number ?? null,
      title,
      url: issue?.url ?? null,
      createdAt: issue?.createdAt ?? null,
      labels,
      la_miss: laMiss,
      nhom,
      ly_do: lyDo,
      hanh_dong_de_xuat: HANH_DONG_NHOM[nhom],
      so_hieu_nhac_toi: tatCaRef,
      so_hieu_chua_co: chuaCo,
      van_ban_khop: extras.van_ban_khop ?? null,
      tinh_trang: extras.tinh_trang ?? null,
      xac_minh_muc: extras.xac_minh_muc ?? null,
      gan_khop: ganKhop,
    };
  };

  const traKetQuaDaCo = (hit, truyVan) => {
    const d = hit.doc;
    const tinhTrang = d.tinh_trang || 'CHUA_XAC_MINH';
    const muc = d.xac_minh?.muc || 'CHUA_XAC_MINH';
    const ghiChuAlias = hit.khopQuaSoHieuKhac ? ` (khớp qua so_hieu_khac của ${d.so_hieu})` : '';
    return taoKetQua(
      NHOM_MISS.DA_CO_TRONG_SO,
      `Số hiệu ${truyVan} đã có trong sổ${ghiChuAlias}: tình trạng ${tinhTrang}, mức xác minh ${muc}.`,
      {
        van_ban_khop: {
          so_hieu: d.so_hieu,
          so_hieu_truy_van: truyVan,
          khop_qua_so_hieu_khac: hit.khopQuaSoHieuKhac,
          tinh_trang: tinhTrang,
          xac_minh: {
            muc,
            hieu_luc_da_doi_chieu: Boolean(d.xac_minh?.hieu_luc_da_doi_chieu),
          },
          file: d._file || null,
        },
        tinh_trang: tinhTrang,
        xac_minh_muc: muc,
      },
    );
  };

  // 1a. Khớp ngay trong tiêu đề -> DA_CO_TRONG_SO
  if (khopSo) {
    return traKetQuaDaCo(khopSo, soHieuTruyVan);
  }

  // 1b. Nếu tiêu đề không chỉ định sẵn số hiệu thiếu, kiểm tra số hiệu ở nội dung -> DA_CO_TRONG_SO
  // (Ưu tiên nhận diện THUOC_HS_CODE_API trước nếu tiêu đề không có số hiệu và nội dung hỏi phân loại HS/thuế suất/GIR/WCO).
  const noiDungSach = `${title}\n${body.replace(RE_URL, ' ')}`;
  const thuocHsCodeApi = khopMau(noiDungSach, RE_HS_CODE_API_LIST);

  if (!tieuDeDaChiDinhSoHieuThieu && !thuocHsCodeApi) {
    for (const r of refNoiDung) {
      const hit = traCuuKhoa(theoKhoa, r);
      if (hit) {
        return traKetQuaDaCo(hit, r);
      }
    }
  }

  // 2. Thuộc phạm vi engine phân loại HS, biểu thuế/thuế suất XNK, GIR, WCO, tiền lệ áp mã
  if (thuocHsCodeApi) {
    return taoKetQua(
      NHOM_MISS.THUOC_HS_CODE_API,
      'Nội dung thuộc phạm vi engine phân loại mã HS 8 số, biểu thuế/thuế suất XNK, GIR, Chú giải WCO hoặc tiền lệ áp mã (ngoài biên oz-wiki-plhq).',
    );
  }

  // 3. Nhắc số hiệu VBQPPL/công văn/QCVN/VBHN rõ ràng mà chưa có trong so.vanBan
  const vbChinhThieu = (refTieuDe.length > 0 ? refTieuDe : tatCaRef)
    .filter((r) => trichXuatSoHieu(r).length > 0 && !traCuuKhoa(theoKhoa, r));
  const vbChuaCoHopLe = vbChinhThieu.length > 0
    ? vbChinhThieu
    : tatCaRef.filter((r) => trichXuatSoHieu(r).length > 0 && !traCuuKhoa(theoKhoa, r));

  if (vbChuaCoHopLe.length > 0) {
    const ganKhop = timGanKhop(vbChuaCoHopLe, vanBan);
    const goiY = ganKhop.length ? ` (lưu ý gần khớp trong sổ: ${ganKhop.join(', ')})` : '';
    return taoKetQua(
      NHOM_MISS.THIEU_VAN_BAN_MOI,
      `Nhắc số hiệu văn bản rõ ràng chưa có trong sổ: ${vbChuaCoHopLe.join(', ')}${goiY}.`,
    );
  }

  // 4. Hỏi đáp nghiệp vụ, hướng dẫn thủ tục, KTCN, điều khoản/tóm tắt văn bản đã biết, bổ sung wiki
  if (khopMau(noiDungSach, RE_WIKI_DIEU_KHOAN_LIST)) {
    return taoKetQua(
      NHOM_MISS.THIEU_WIKI_HOAC_DIEU_KHOAN,
      'Yêu cầu hỏi đáp nghiệp vụ, hướng dẫn thủ tục, KTCN, điều khoản/tóm tắt văn bản đã biết hoặc bổ sung wiki.',
    );
  }

  // 5. Các trường hợp còn lại cần rà soát thủ công
  const ganKhop = timGanKhop(tatCaRef, vanBan);
  const lyDoKhac = ganKhop.length
    ? `Số hiệu có thể bị cắt cụt hoặc sai định dạng (${tatCaRef.join(', ')}); gần khớp trong sổ: ${ganKhop.join(', ')}.`
    : 'Chưa đủ dấu hiệu tự động hoặc không rõ số hiệu văn bản; cần rà soát thủ công.';
  return taoKetQua(NHOM_MISS.KHAC_CAN_RA_SOAT, lyDoKhac);
}

/**
 * Phân loại danh sách issue GitHub theo sổ đăng ký văn bản.
 * @param {object[]} issues
 * @param {object} so
 * @param {object} [options]
 */
export function phanLoaiMiss(issues = [], so = napSo(), options = {}) {
  if (issues != null && !Array.isArray(issues)) {
    throw new TypeError('issues phải là mảng');
  }
  const danhSach = Array.isArray(issues) ? issues : [];
  const vanBan = Array.isArray(so?.vanBan) ? so.vanBan : [];
  const chiMuc = taoChiMucKhoa(so);

  const issueMiss = danhSach.filter(laIssueMiss);
  let tapCanPhanLoai = danhSach;
  let cheDoLoc = 'all';

  if (options.chiLocMiss === true) {
    tapCanPhanLoai = issueMiss;
    cheDoLoc = 'miss_only';
  } else if (options.chiLocMiss === false) {
    tapCanPhanLoai = danhSach;
    cheDoLoc = 'all';
  } else if (issueMiss.length > 0) {
    tapCanPhanLoai = issueMiss;
    cheDoLoc = 'miss_only';
  } else {
    tapCanPhanLoai = danhSach;
    cheDoLoc = danhSach.length === 0 ? 'empty' : 'all_fallback';
  }

  const theoNhom = {
    [NHOM_MISS.DA_CO_TRONG_SO]: [],
    [NHOM_MISS.THUOC_HS_CODE_API]: [],
    [NHOM_MISS.THIEU_VAN_BAN_MOI]: [],
    [NHOM_MISS.THIEU_WIKI_HOAC_DIEU_KHOAN]: [],
    [NHOM_MISS.KHAC_CAN_RA_SOAT]: [],
  };
  const chiTiet = [];

  for (const issue of tapCanPhanLoai) {
    const item = phanLoaiMotIssue(issue, so, chiMuc);
    chiTiet.push(item);
    theoNhom[item.nhom].push(item);
  }

  const thongKe = {};
  for (const nhom of THU_TU_NHOM) {
    thongKe[nhom] = theoNhom[nhom].length;
  }

  return {
    ngay: options.today || homNay(),
    nguon: options.nguon ?? null,
    che_do_loc: cheDoLoc,
    tong_issue_mo: danhSach.length,
    tong_issue_miss: issueMiss.length,
    tong_da_phan_loai: chiTiet.length,
    tong_van_ban_trong_so: vanBan.length,
    thong_ke: thongKe,
    theo_nhom: theoNhom,
    chi_tiet: chiTiet,
  };
}

function escapeCell(s) {
  return String(s ?? '').replace(/\|/g, '\\|').replace(/\r?\n+/g, ' ').trim();
}

function phanTram(so, tong) {
  if (!tong) return '0.0%';
  return `${((so / tong) * 100).toFixed(1)}%`;
}

/**
 * Kết xuất báo cáo phân loại issue `[miss]` dưới dạng Markdown sạch.
 * @param {object} ketQua
 * @returns {string}
 */
export function veBaoCaoMissMarkdown(ketQua) {
  const ngay = ketQua?.ngay || homNay();
  const tongMo = Number(ketQua?.tong_issue_mo ?? 0);
  const tongMiss = Number(ketQua?.tong_issue_miss ?? 0);
  const tongPhanLoai = Number(ketQua?.tong_da_phan_loai ?? 0);
  const tongVanBan = Number(ketQua?.tong_van_ban_trong_so ?? 0);
  const thongKe = ketQua?.thong_ke || {};
  const theoNhom = ketQua?.theo_nhom || {};

  const lines = [
    `# Báo cáo phân loại issue [miss] — ${ngay}`,
    '',
    `- **Chế độ**: \`read-only\` (chỉ đọc, không sửa/đóng/bình luận issue trên GitHub)`,
    ...(ketQua?.nguon ? [`- **Nguồn dữ liệu**: \`${ketQua.nguon}\``] : []),
    `- **Tổng issue mở**: ${tongMo} · **Issue \`[miss]\`**: ${tongMiss} · **Đã phân loại**: ${tongPhanLoai}`,
    `- **Quy mô sổ văn bản**: ${tongVanBan} văn bản`,
    '',
    '| Nhóm | Mã nhóm | Số lượng | Tỉ lệ | Hành động gợi ý |',
    '| --- | --- | ---: | ---: | --- |',
  ];

  for (const ma of THU_TU_NHOM) {
    const sl = Number(thongKe[ma] ?? (theoNhom[ma]?.length || 0));
    lines.push(`| ${TEN_NHOM_MISS[ma]} | \`${ma}\` | ${sl} | ${phanTram(sl, tongPhanLoai)} | ${HANH_DONG_NHOM[ma]} |`);
  }
  lines.push(`| **Tổng cộng** | — | **${tongPhanLoai}** | **${tongPhanLoai ? '100.0%' : '0.0%'}** | — |`);

  if (tongPhanLoai === 0) {
    lines.push('', '_Không có issue `[miss]` nào trong tập dữ liệu đầu vào._');
    return `${lines.join('\n')}\n`;
  }

  for (const ma of THU_TU_NHOM) {
    const items = Array.isArray(theoNhom[ma]) ? theoNhom[ma] : [];
    lines.push('', `## ${TEN_NHOM_MISS[ma]} (\`${ma}\`: ${items.length})`, '');
    if (items.length === 0) {
      lines.push('- _(Không có)_');
      continue;
    }
    for (const it of items) {
      const ref = it.number != null ? `#${it.number}` : 'issue';
      const tieuDe = escapeCell(it.title || '(không có tiêu đề)');
      const link = it.url ? `[${ref}](${it.url})` : ref;
      if (ma === NHOM_MISS.DA_CO_TRONG_SO && it.van_ban_khop) {
        const vb = it.van_ban_khop;
        const alias = vb.khop_qua_so_hieu_khac ? ` (qua \`so_hieu_khac\`: \`${vb.so_hieu_truy_van}\`)` : '';
        lines.push(
          `- ${link} **${tieuDe}** → \`${vb.so_hieu}\`${alias} · \`tinh_trang: ${vb.tinh_trang}\` · \`xac_minh.muc: ${vb.xac_minh?.muc}\``,
        );
      } else if (ma === NHOM_MISS.THIEU_VAN_BAN_MOI) {
        const gan = it.gan_khop?.length ? ` · gần khớp: ${it.gan_khop.map((x) => `\`${x}\``).join(', ')}` : '';
        lines.push(`- ${link} **${tieuDe}** — thiếu: ${it.so_hieu_chua_co?.map((x) => `\`${x}\``).join(', ') || 'chưa rõ'}${gan}`);
      } else {
        lines.push(`- ${link} **${tieuDe}** — ${escapeCell(it.ly_do)}`);
      }
    }
  }

  return `${lines.join('\n')}\n`;
}

function phanTichThamSo(argv) {
  let file = null;
  let gh = false;
  let json = false;
  let all = false;
  let help = false;
  let limit = LIMIT_MAC_DINH;

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') json = true;
    else if (a === '--gh') gh = true;
    else if (a === '--all') all = true;
    else if (a === '--help' || a === '-h') help = true;
    else if (a === '--file') {
      const val = argv[++i];
      if (!val || val.startsWith('--')) throw new Error('Thiếu đường dẫn sau --file');
      file = val;
    } else if (a === '--limit') {
      const raw = argv[++i];
      const n = Number(raw);
      if (!Number.isInteger(n) || n <= 0) throw new Error(`Giá trị --limit không hợp lệ: ${raw}`);
      limit = n;
    } else {
      throw new Error(`Tham số không hỗ trợ: ${a}`);
    }
  }

  if (file && gh) {
    throw new Error('Chỉ chọn một trong --file <path> hoặc --gh');
  }
  if (!file && !gh) gh = true;
  return { file, gh, json, all, help, limit };
}

function docIssuesTuGitHub(limit) {
  const args = [
    'issue',
    'list',
    '--repo',
    REPO_MAC_DINH,
    '--state',
    'open',
    '--limit',
    String(limit),
    '--json',
    'number,title,body,labels,url,createdAt',
  ];
  const res = spawnSync('gh', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  if (res.error) throw new Error(`Không gọi được gh CLI: ${res.error.message}`);
  if (res.status !== 0) throw new Error(`gh issue list thất bại (${res.status}): ${res.stderr?.trim() || res.stdout?.trim()}`);
  const parsed = JSON.parse(res.stdout || '[]');
  if (!Array.isArray(parsed)) throw new Error('Kết quả từ gh issue list không phải mảng JSON');
  return parsed;
}

function docIssuesTuTep(filePath) {
  const raw = filePath === '-'
    ? readFileSync(0, 'utf8')
    : readFileSync(resolve(process.cwd(), filePath), 'utf8');
  const parsed = JSON.parse(raw);
  if (Array.isArray(parsed)) return parsed;
  if (parsed && Array.isArray(parsed.issues)) return parsed.issues;
  throw new Error('Tệp JSON đầu vào phải là mảng issue hoặc { issues: [...] }');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.stdout.on('error', (err) => {
    if (err?.code === 'EPIPE') process.exit(0);
    throw err;
  });
  try {
    const opts = phanTichThamSo(process.argv.slice(2));
    if (opts.help) {
      process.stdout.write(
        'Sử dụng: node tools/phan-loai-miss.mjs [--file <path> | --gh] [--json] [--limit <n>] [--all]\n',
      );
      process.exit(0);
    }

    const issues = opts.file ? docIssuesTuTep(opts.file) : docIssuesTuGitHub(opts.limit);
    const nguon = opts.file ? `file:${opts.file}` : `gh:${REPO_MAC_DINH}`;
    const chiLocMiss = opts.all ? false : (opts.gh ? true : undefined);
    const ketQua = phanLoaiMiss(issues, napSo(ROOT), { nguon, chiLocMiss });

    if (opts.json) {
      process.stdout.write(`${JSON.stringify(ketQua, null, 2)}\n`);
    } else {
      process.stdout.write(veBaoCaoMissMarkdown(ketQua));
    }
  } catch (e) {
    process.stderr.write(`LỖI: ${e.message}\n`);
    process.exit(1);
  }
}
