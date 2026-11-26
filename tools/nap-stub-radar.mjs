#!/usr/bin/env node
// Cầu nối tự động 06:30 Radar -> 07:00 Tự tải toàn văn:
// Đọc danh sách `moi[]` từ đầu ra của `tools/radar-luat-moi.mjs`, làm giàu URL PDF bậc A
// và ngày ban hành từ trang chi tiết `.gov.vn`/`.chinhphu.vn` (best-effort), sinh stub YAML
// `CHUA_XAC_MINH` vào `registry/van-ban/<slug>.yaml` kèm cổng kiểm `kiemTra(napSo(root))` + rollback nguyên tử.
//
// Cách dùng:
//   node tools/nap-stub-radar.mjs --tu-radar <radar.json> [--limit 10] [--dry-run]
//                                 [--khong-lay-pdf-url] [--json] [--markdown <file|->] [--root <dir>]
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import yaml from 'js-yaml';
import { kiemTra } from './kiem-tra.mjs';
import { LOAI, ROOT, bacNguon, homNay, khoa, napSo, slugTuSoHieu } from './lib/registry.mjs';
import { daCoTrongSo, soHieuTuSlug, trichTatCaSoHieu, USER_AGENT } from './radar-luat-moi.mjs';
import { giaiMaHtmlEntities, laUrlVbpl, trichUrlPdfTuHtml } from './tai-pdf-tu-vo-html.mjs';

export const MAC_DINH_LIMIT_STUB = 10;
export const TIMEOUT_CHI_TIET_MS = 10000;

const ANH_XA_NHANH_KTCN_BO = {
  BCT: 'kiem-tra-chuyen-nganh/bct',
  BYT: 'kiem-tra-chuyen-nganh/byt',
  BNNMT: 'kiem-tra-chuyen-nganh/bnnmt',
  BNNPTNT: 'kiem-tra-chuyen-nganh/bnnmt',
  BTNMT: 'kiem-tra-chuyen-nganh/bnnmt',
  BKHCN: 'kiem-tra-chuyen-nganh/bkhcn',
  BTTTT: 'kiem-tra-chuyen-nganh/bkhcn',
  BXD: 'kiem-tra-chuyen-nganh/bxd',
  BGTVT: 'kiem-tra-chuyen-nganh/bxd',
  BNV: 'kiem-tra-chuyen-nganh/bnv',
  BLDTBXH: 'kiem-tra-chuyen-nganh/bnv',
  BCA: 'kiem-tra-chuyen-nganh/bca',
  BQP: 'kiem-tra-chuyen-nganh/bqp',
};

const QUY_TAC_NHANH = [
  {
    re: /chống bán phá giá|chống trợ cấp|phòng vệ thương mại|biện pháp tự vệ/iu,
    nhanh: 'phong-ve-thuong-mai/chong-ban-pha-gia',
  },
  {
    re: /trị giá hải quan/iu,
    nhanh: 'hai-quan/tri-gia',
  },
  {
    re: /thủ tục hải quan|khai hải quan|kho ngoại quan|khu phi thuế quan/iu,
    nhanh: 'hai-quan/thu-tuc',
  },
  {
    re: /kiểm tra,\s*giám sát hải quan|giám sát hải quan|kiểm soát hải quan/iu,
    nhanh: 'hai-quan/kiem-tra-giam-sat',
  },
  {
    re: /một cửa quốc gia|một cửa asean/iu,
    nhanh: 'hai-quan/mot-cua',
  },
  {
    re: /luật hải quan/iu,
    nhanh: 'hai-quan/luat-khung',
  },
  {
    re: /phân loại hàng|xác định trước mã số/iu,
    nhanh: 'phan-loai-hs/quy-trinh-phan-loai',
  },
  {
    re: /danh mục hàng h(?:óa|oá) xuất khẩu,\s*nhập khẩu|mã số hàng h(?:óa|oá)/iu,
    nhanh: 'phan-loai-hs/danh-muc',
  },
  {
    re: /miễn thuế|giảm thuế|hoàn thuế/iu,
    nhanh: 'thue/mien-giam-hoan',
  },
  {
    re: /giá trị gia tăng|tiêu thụ đặc biệt|bảo vệ môi trường/iu,
    nhanh: 'thue/thue-noi-dia-khau-nk',
  },
  {
    re: /quy tắc xuất xứ|xuất xứ hàng|chứng nhận xuất xứ|(?<![\p{L}\p{N}])c\/o(?![\p{L}\p{N}])/iu,
    nhanh: 'xuat-xu-fta/quy-tac-xuat-xu',
  },
  {
    re: /\bcptpp\b/iu,
    nhanh: 'xuat-xu-fta/hiep-dinh/cptpp',
  },
  {
    re: /\b(?:evfta|vkfta)\b/iu,
    nhanh: 'xuat-xu-fta/hiep-dinh/vcfeta',
  },
  {
    re: /thương mại biên giới|cửa khẩu phụ|lối mở/iu,
    nhanh: 'quan-ly-ngoai-thuong/bien-gioi',
  },
  {
    re: /hạn ngạch|giấy phép nhập|giấy phép xuất|tạm nhập|tái xuất/iu,
    nhanh: 'quan-ly-ngoai-thuong/giay-phep',
  },
  {
    re: /đã qua sử dụng/iu,
    nhanh: 'quan-ly-ngoai-thuong/hang-da-qua-su-dung',
  },
  {
    re: /an toàn thực phẩm/iu,
    nhanh: 'kiem-tra-chuyen-nganh/an-toan-thuc-pham',
  },
  {
    re: /kiểm dịch/iu,
    nhanh: 'kiem-tra-chuyen-nganh/kiem-dich',
  },
  {
    re: /nhãn hàng h(?:óa|oá)/iu,
    nhanh: 'kiem-tra-chuyen-nganh/nhan-hang-hoa',
  },
  {
    re: /xử phạt vi phạm hành chính/iu,
    nhanh: 'xu-phat',
  },
];

const RE_TIN_HIEU_KTCN_BO =
  /kiểm tra chuyên ngành|hợp quy|hợp chuẩn|quy chuẩn|tiêu chuẩn|h(?:óa|oá) chất|xăng dầu|mỹ phẩm|thuốc|dược|thiết bị y tế|vắc xin|vaccine|phân bón|thức ăn|gỗ|lâm sản|th(?:ủy|uỷ) sản/iu;

/** Chuẩn hoá số hiệu thành dạng chuẩn tiếng Việt (`ND-` → `NĐ-`, `QD-` → `QĐ-`, `-TTG` → `-TTg`). */
export function chuanHoaSoHieuStub(raw) {
  const s = String(raw || '')
    .normalize('NFC')
    .replace(/^\s*s[ốo]\s*:?\s*/iu, '')
    .replace(/\s*\/\s*/g, '/')
    .replace(/\s*-\s*/g, '-')
    .replace(/\s+/g, '')
    .replace(/[.,;:]+$/, '')
    .trim();
  if (!s) return null;

  // Khớp định dạng số hiệu pháp luật Việt Nam chuẩn (không chấp nhận chuỗi mơ hồ)
  if (!/^\d{1,5}\/(?:(?:19|20)\d{2}\/)?[A-ZĐ0-9-]+(?:\/(?:19|20)\d{2})?$/iu.test(s)) {
    return null;
  }

  return s
    .toUpperCase()
    .replace(/\/ND-/g, '/NĐ-')
    .replace(/\/QD-/g, '/QĐ-')
    .replace(/\/VBHN-ND-/g, '/VBHN-NĐ-')
    .replace(/\/VBHN-QD-/g, '/VBHN-QĐ-')
    .replace(/-BLDTBXH(?=\/|$)/g, '-BLĐTBXH')
    .replace(/-TTG(?=\/|$)/g, '-TTg');
}

/**
 * Kiểm tra xem số hiệu trích từ mô tả có phải chỉ là văn bản được viện dẫn
 * (vd "thực hiện Nghị quyết số 135/NQ-CP", "theo Quyết định số ...") trong tin tức không có số hiệu riêng hay không.
 */
export function laSoHieuChiVienDan(soHieu, moTa, url) {
  if (!soHieu) return true;
  if (soHieuTuSlug(url)) return false;

  const text = String(moTa || '').normalize('NFC');
  if (!text) return false;
  const ds = trichTatCaSoHieu(text);
  if (ds.length === 0) return false;

  const kTarget = khoa(soHieu);
  // Nếu tiêu đề mở đầu bằng chính loại văn bản + số hiệu này -> văn bản chính chủ
  const dauCau = text.slice(0, 120);
  const mDau = trichTatCaSoHieu(dauCau);
  const reVienDan = new RegExp(
    `(?:theo|căn cứ|thực hiện|triển khai|quy định tại|kèm theo|sửa đổi,?\\s*bổ sung(?:\\s+một\\s+số\\s+điều\\s+của)?)\\s+(?:Luật|Nghị định|Thông tư|Quyết định|Nghị quyết|Công văn|Chỉ thị|Thông báo|Văn bản)(?:\\s+số)?\\s*${soHieu.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
    'iu'
  );
  if (reVienDan.test(text)) {
    const khopKhacDau = mDau.find((x) => khoa(x) !== kTarget);
    if (!khopKhacDau) {
      // Kiểm tra xem số hiệu có xuất hiện lần nào trước cụm viện dẫn không
      const idxVienDan = text.search(reVienDan);
      const truoc = idxVienDan > 0 ? trichTatCaSoHieu(text.slice(0, idxVienDan)) : [];
      if (!truoc.some((x) => khoa(x) === kTarget)) return true;
    }
  }
  return false;
}

/**
 * Suy `loai` (thuộc `LOAI` trong `tools/lib/registry.mjs`) và `co_quan` (thuộc `registry/co-quan.yaml`)
 * từ `soHieu` và `moTa`. Trả `{ hopLe: true, loai, coQuan }` hoặc `{ hopLe: false, lyDo }`.
 */
export function suyLoaiVaCoQuan(soHieu, moTa = '', coQuanHopLe = new Set()) {
  const k = khoa(soHieu);
  if (!k) return { hopLe: false, lyDo: 'THIEU_SO_HIEU' };

  // Bỏ phần số đầu và năm ở giữa/cuối để lấy cụm ký hiệu loại + cơ quan
  const boDauSo = k.replace(/^\d+\//, '').replace(/^(?:19|20)\d{2}\//, '').replace(/\/(?:19|20)\d{2}$/, '');
  if (!boDauSo) return { hopLe: false, lyDo: 'KHONG_TACH_DUOC_KY_HIEU' };

  let loai = null;
  let coQuan = null;

  if (/^QH\d{1,2}$/.test(boDauSo)) {
    loai = /^\s*nghị\s+quyết\b/iu.test(String(moTa || '').trim()) ? 'NGHI_QUYET' : 'LUAT';
    coQuan = 'QH';
  } else if (/^UBTVQH\d*$/.test(boDauSo)) {
    loai = /^\s*pháp\s+lệnh\b/iu.test(String(moTa || '').trim()) ? 'PHAP_LENH' : 'NGHI_QUYET';
    coQuan = 'UBTVQH';
  } else if (boDauSo.startsWith('VBHN-')) {
    loai = 'VAN_BAN_HOP_NHAT';
    const phanSau = boDauSo.slice('VBHN-'.length).replace(/^(?:TTLT|TT|ND|NQ|QD|PL|CT|L)-/, '');
    coQuan = phanSau.split('-')[0] || null;
  } else if (boDauSo.startsWith('TTLT-')) {
    loai = 'THONG_TU_LIEN_TICH';
    const cacBo = boDauSo.slice('TTLT-'.length).split('-').filter(Boolean);
    coQuan = cacBo.find((c) => coQuanHopLe.size === 0 || coQuanHopLe.has(c)) || cacBo[0] || null;
  } else {
    const bangLoai = [
      ['TT-', 'THONG_TU'],
      ['ND-', 'NGHI_DINH'],
      ['QD-', 'QUYET_DINH'],
      ['NQ-', 'NGHI_QUYET'],
      ['PL-', 'PHAP_LENH'],
      ['CT-', 'CHI_THI'],
      ['TB-', 'THONG_BAO'],
      ['CV-', 'CONG_VAN'],
      ['L-', 'LENH'],
    ];
    const khop = bangLoai.find(([prefix]) => boDauSo.startsWith(prefix));
    if (khop) {
      loai = khop[1];
      const rawCq = boDauSo.slice(khop[0].length).split('-')[0] || null;
      coQuan = rawCq && /^UBTVQH\d+$/.test(rawCq) ? 'UBTVQH' : rawCq;
    } else if (/^[A-Z0-9]+-[A-Z0-9]+$/.test(boDauSo)) {
      // Dạng công văn hành chính: 10094/BCT-TTTN, 18391/CHQ-NVTHQ
      const dau = boDauSo.split('-')[0];
      if (coQuanHopLe.has(dau)) {
        loai = 'CONG_VAN';
        coQuan = dau;
      }
    }
  }

  if (!loai || !LOAI.includes(loai) || loai === 'KHAC') {
    return { hopLe: false, lyDo: 'LOAI_KHONG_HOP_LE' };
  }
  if (!coQuan) {
    return { hopLe: false, lyDo: 'KHONG_SUY_DUOC_CO_QUAN' };
  }
  if (coQuanHopLe.size > 0 && !coQuanHopLe.has(coQuan)) {
    return { hopLe: false, lyDo: `CO_QUAN_CHUA_CO_TRONG_SO:${coQuan}` };
  }
  return { hopLe: true, loai, coQuan };
}

function kiemNgayHopLe(nam, thang, ngay) {
  const y = Number(nam);
  const m = Number(thang);
  const d = Number(ngay);
  if (!Number.isInteger(y) || y < 1945 || y > 2100) return null;
  if (!Number.isInteger(m) || m < 1 || m > 12) return null;
  if (!Number.isInteger(d) || d < 1 || d > 31) return null;
  const iso = `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const dt = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(dt.getTime()) || dt.toISOString().slice(0, 10) !== iso) return null;
  return iso;
}

/** Chuẩn hoá chuỗi ngày đa định dạng (`YYYY-MM-DD`, `DD/MM/YYYY`, `DD-MM-YYYY`, `ngày D tháng M năm Y`, RFC-2822 RSS) sang `YYYY-MM-DD`. */
export function chuanHoaNgayBanHanh(raw) {
  const s = String(raw || '').trim();
  if (!s) return null;

  const mIso = s.match(/\b((?:19|20)\d{2})[/-](\d{1,2})[/-](\d{1,2})\b/);
  if (mIso) {
    const iso = kiemNgayHopLe(mIso[1], mIso[2], mIso[3]);
    if (iso) return iso;
  }

  const mVn = s.match(/\b(\d{1,2})[/-](\d{1,2})[/-]((?:19|20)\d{2})\b/);
  if (mVn) {
    const iso = kiemNgayHopLe(mVn[3], mVn[2], mVn[1]);
    if (iso) return iso;
  }

  const mChu = s.match(/ngày\s+(\d{1,2})\s+tháng\s+(\d{1,2})\s+năm\s+((?:19|20)\d{2})/iu);
  if (mChu) {
    const iso = kiemNgayHopLe(mChu[3], mChu[2], mChu[1]);
    if (iso) return iso;
  }

  // RFC-2822 / GMT pubDate từ RSS Công báo
  if (/[A-Za-z]{3}/.test(s)) {
    const parsed = new Date(s);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }
  }

  return null;
}

/** Trích ngày ban hành từ trang HTML chi tiết của cổng `.gov.vn` / `.chinhphu.vn`. */
export function trichNgayBanHanhTuHtml(htmlText) {
  const html = giaiMaHtmlEntities(String(htmlText || ''));
  if (!html) return null;

  const textGon = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

  // 1. Nhãn tường minh "Ngày ban hành" / "Ban hành ngày"
  const mNhan = textGon.match(
    /(?:Ngày\s+ban\s+hành|Ban\s+hành\s+ngày)\s*:?\s*(\d{1,2}[/-]\d{1,2}[/-](?:19|20)\d{2}|(?:19|20)\d{2}-\d{2}-\d{2})/iu
  );
  if (mNhan) {
    const iso = chuanHoaNgayBanHanh(mNhan[1]);
    if (iso) return iso;
  }

  // 2. Cụm "ngày DD tháng MM năm YYYY" trong phần đầu bài
  const mChu = textGon.slice(0, 3500).match(/ngày\s+\d{1,2}\s+tháng\s+\d{1,2}\s+năm\s+(?:19|20)\d{2}/iu);
  if (mChu) {
    const iso = chuanHoaNgayBanHanh(mChu[0]);
    if (iso) return iso;
  }

  // 3. Thẻ ngày đăng bài chi tiết (issued-date, post__info, news__info)
  const mTheNgay = html.match(
    /class=["'][^"']*(?:issued-date|issue-v2|post__info|post__date|news__info)[^"']*["'][^>]*>([\s\S]{0,200}?)<\//i
  );
  if (mTheNgay) {
    const iso = chuanHoaNgayBanHanh(mTheNgay[1].replace(/<[^>]+>/g, ' '));
    if (iso) return iso;
  }

  return null;
}

/** Kiểm tra URL có phải nguồn bậc A hợp lệ của cơ quan nhà nước Việt Nam (loại `vbpl.vn` và nguồn B/C). */
export function laUrlNguonBacAVietNam(url, nguonConfig = {}) {
  let u;
  try {
    u = new URL(url);
  } catch {
    return false;
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
  if (laUrlVbpl(url)) return false;
  const host = u.hostname.replace(/^www\./, '').toLowerCase();
  if (!host.endsWith('.vn')) return false;
  return bacNguon(url, nguonConfig) === 'A';
}

function laTrangHtmlCanLamGiauPdf(url) {
  let u;
  try {
    u = new URL(url);
  } catch {
    return false;
  }
  if (/\.pdf(?:$|[?#])/i.test(u.pathname)) return false;
  return (
    /\.html?$/i.test(u.pathname) ||
    /[?&](?:docid|id|pageId)=/i.test(u.search) ||
    /\/van-ban-phap-luat\//i.test(u.pathname)
  );
}

/**
 * Trích danh sách URL PDF bậc A trực tiếp từ vỏ HTML trang chi tiết,
 * cắt bỏ khối "Văn bản khác / Văn bản liên quan" ở cuối trang (vd `moit.gov.vn`) để không lấy nhầm PDF bài khác.
 */
export function trichPdfBacATuHtmlChiTiet(htmlText, { baseUrl = '', nguon = {} } = {}) {
  const fullHtml = String(htmlText || '');
  if (!fullHtml) return [];

  // Cắt phần danh sách văn bản khác ở cuối trang nếu phần nội dung chính phía trên đã có liên kết .pdf
  let vungChinh = fullHtml;
  const mRanhGioiPhu = fullHtml.search(
    /(?:Các văn bản khác|Văn bản khác cùng chuyên mục|Văn bản liên quan|Tin liên quan|<th\b[^>]*>\s*STT\s*<\/th>)/i
  );
  if (mRanhGioiPhu > 0) {
    const phanTren = fullHtml.slice(0, mRanhGioiPhu);
    if (/\.pdf(?:["'?\s<>]|$)/i.test(phanTren)) {
      vungChinh = phanTren;
    }
  }

  const ungVien = trichUrlPdfTuHtml(vungChinh, { baseUrl, nguon });
  return ungVien.filter((u) => laUrlNguonBacAVietNam(u, nguon));
}

/** Suy danh sách `nhanh` hợp lệ một cách bảo thủ từ `moTa`, `soHieu`, `coQuan` đối chiếu với `nutHopLe` của `cay-xnk.yaml`. */
export function suyNhanhTuMoTa(moTa, { soHieu = '', loai = '', coQuan = '', nutHopLe = new Set() } = {}) {
  void loai;
  const text = String(moTa || '').normalize('NFC');
  const ketQua = [];
  const them = (n) => {
    if (!n || ketQua.includes(n)) return;
    if (nutHopLe.size > 0 && !nutHopLe.has(n)) return;
    ketQua.push(n);
  };

  if (/TB-(?:TCHQ|CHQ)/i.test(String(soHieu || ''))) {
    them('phan-loai-hs/thong-bao-phan-loai');
  }

  if (/biểu thuế|thuế xuất khẩu|thuế nhập khẩu/iu.test(text)) {
    them(coQuan === 'BCT' ? 'thue/bieu-thue-xnk' : 'thue/bieu-thue');
  }

  for (const qt of QUY_TAC_NHANH) {
    if (qt.re.test(text)) them(qt.nhanh);
    if (ketQua.length >= 3) break;
  }

  if (ketQua.length < 3 && RE_TIN_HIEU_KTCN_BO.test(text) && ANH_XA_NHANH_KTCN_BO[coQuan]) {
    them(ANH_XA_NHANH_KTCN_BO[coQuan]);
  }

  if (ketQua.length === 0) {
    them('chua-phan-loai');
  }
  return ketQua.length ? ketQua : ['chua-phan-loai'];
}

function chuanTieuDeVanBan(moTa, soHieu) {
  const s = String(moTa || '')
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .trim();
  if (!s) return `(chưa có tiêu đề) ${soHieu}`;
  return s;
}

function chayKiemTraMacDinh(root) {
  return kiemTra(napSo(root), { root });
}

function docDanhSachUngVienRadar(tuRadarPath, items) {
  if (Array.isArray(items)) return items;
  if (!tuRadarPath) {
    throw new Error('Cần truyền --tu-radar <radar.json> hoặc mảng items');
  }
  const abs = resolve(tuRadarPath);
  if (!existsSync(abs)) {
    throw new Error(`Không tìm thấy tệp radar: ${abs}`);
  }
  const parsed = JSON.parse(readFileSync(abs, 'utf8'));
  if (Array.isArray(parsed)) return parsed;
  if (parsed && Array.isArray(parsed.moi)) return parsed.moi;
  throw new Error(`Tệp radar không có mảng moi[]: ${abs}`);
}

/**
 * Chạy luồng dựng stub YAML tự động từ danh sách văn bản mới của Radar.
 */
export async function chayNapStubRadar({
  items = null,
  tuRadarPath = null,
  root = ROOT,
  limit = MAC_DINH_LIMIT_STUB,
  dryRun = false,
  khongLayPdfUrl = false,
  fetchFn = fetch,
  kiemTraFn = chayKiemTraMacDinh,
  today = homNay(),
} = {}) {
  const ungVien = docDanhSachUngVienRadar(tuRadarPath, items);
  const maxLimit = Number.isInteger(limit) && limit > 0 ? limit : MAC_DINH_LIMIT_STUB;

  let so = napSo(root);
  const coQuanHopLe = new Set((so.coQuan || []).map((c) => c.ky_hieu));
  const nutHopLe = new Set();
  for (const n of so.nutCay || []) {
    nutHopLe.add(n.path);
    nutHopLe.add(n.id);
  }

  const loiNenSet = new Set(
    (dryRun ? [] : kiemTraFn(root).loi || []).map((e) => `${e.file}::${e.msg}`)
  );

  const da_tao = [];
  const bo_qua = [];
  const daXetKhoa = new Set();

  for (const raw of ungVien) {
    if (da_tao.length >= maxLimit) {
      bo_qua.push({
        so_hieu: raw?.soHieu || raw?.so_hieu || null,
        url: raw?.url || '',
        ly_do: 'VUOT_LIMIT',
      });
      continue;
    }

    const rawUrl = String(raw?.url || '').trim();
    const rawMoTa = String(raw?.moTa || raw?.ten || '').trim();
    const rawSoHieu = raw?.soHieu ?? raw?.so_hieu ?? null;
    const soHieu = chuanHoaSoHieuStub(rawSoHieu);

    if (!soHieu) {
      bo_qua.push({ so_hieu: rawSoHieu || null, url: rawUrl, ly_do: 'THIEU_HOAC_SAI_SO_HIEU' });
      continue;
    }

    if (laSoHieuChiVienDan(soHieu, rawMoTa, rawUrl)) {
      bo_qua.push({ so_hieu: soHieu, url: rawUrl, ly_do: 'SO_HIEU_CHI_VIEN_DAN' });
      continue;
    }

    if (!rawUrl || !laUrlNguonBacAVietNam(rawUrl, so.nguon)) {
      bo_qua.push({ so_hieu: soHieu, url: rawUrl, ly_do: 'NGUON_KHONG_PHAI_BAC_A_VN' });
      continue;
    }

    const phanLoai = suyLoaiVaCoQuan(soHieu, rawMoTa, coQuanHopLe);
    if (!phanLoai.hopLe) {
      bo_qua.push({ so_hieu: soHieu, url: rawUrl, ly_do: phanLoai.lyDo });
      continue;
    }

    const k = khoa(soHieu);
    if (daXetKhoa.has(k) || daCoTrongSo(soHieu, raw?.ngay || '', so)) {
      bo_qua.push({ so_hieu: soHieu, url: rawUrl, ly_do: 'DA_CO_TRONG_SO' });
      continue;
    }

    // Best-effort làm giàu URL PDF bậc A + ngày ban hành từ trang HTML chi tiết
    const pdfUrls = [];
    if (raw?.pdfUrl && laUrlNguonBacAVietNam(raw.pdfUrl, so.nguon)) {
      pdfUrls.push(String(raw.pdfUrl).trim());
    }
    if (/\.pdf(?:$|[?#])/i.test(rawUrl) && !pdfUrls.includes(rawUrl)) {
      pdfUrls.push(rawUrl);
    }

    let ngayTuHtml = null;
    let loiLayPdf = null;
    if (!khongLayPdfUrl && typeof fetchFn === 'function' && laTrangHtmlCanLamGiauPdf(rawUrl)) {
      try {
        const res = await fetchFn(rawUrl, {
          headers: {
            'User-Agent': USER_AGENT,
            Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
          },
          redirect: 'follow',
          signal: AbortSignal.timeout(TIMEOUT_CHI_TIET_MS),
        });
        if (res.ok) {
          const html = await res.text();
          const finalBase = res.url || rawUrl;
          ngayTuHtml = trichNgayBanHanhTuHtml(html);
          const extractedPdfs = trichPdfBacATuHtmlChiTiet(html, {
            baseUrl: finalBase,
            nguon: so.nguon,
          });
          for (const pu of extractedPdfs) {
            if (!pdfUrls.includes(pu)) pdfUrls.push(pu);
          }
        } else {
          loiLayPdf = `HTTP_${res.status}`;
        }
      } catch (err) {
        loiLayPdf = String(err?.message || err).slice(0, 120);
      }
    }

    const ngayBanHanh =
      ngayTuHtml ||
      chuanHoaNgayBanHanh(raw?.ngay || raw?.ngay_ban_hanh || '') ||
      chuanHoaNgayBanHanh(rawMoTa) ||
      null;

    if (!ngayBanHanh) {
      bo_qua.push({ so_hieu: soHieu, url: rawUrl, ly_do: 'THIEU_NGAY_BAN_HANH' });
      continue;
    }

    // Kiểm tra lại với ngày ban hành chính thức xem có trùng biến thể năm trong sổ không
    if (daCoTrongSo(soHieu, ngayBanHanh, so)) {
      bo_qua.push({ so_hieu: soHieu, url: rawUrl, ly_do: 'DA_CO_TRONG_SO' });
      continue;
    }

    const slug = slugTuSoHieu(soHieu, ngayBanHanh.slice(0, 4));
    const relFile = `registry/van-ban/${slug}.yaml`;
    const absFile = join(root, 'registry', 'van-ban', `${slug}.yaml`);
    if (existsSync(absFile)) {
      bo_qua.push({ so_hieu: soHieu, slug, url: rawUrl, ly_do: 'DA_CO_TEP_SLUG' });
      continue;
    }

    // Dựng mảng `nguon[]`: đặt URL `.pdf` bậc A lên đầu để `tu-tai-toan-van` ưu tiên tải ngay lúc 07:00
    const nguonList = [];
    const seenUrls = new Set();
    for (const u of [...pdfUrls, rawUrl]) {
      const clean = String(u || '').trim();
      if (!clean || seenUrls.has(clean)) continue;
      seenUrls.add(clean);
      nguonList.push({
        url: clean,
        bac: 'A',
        truy_cap: today,
      });
    }

    const nhanh = suyNhanhTuMoTa(rawMoTa, {
      soHieu,
      loai: phanLoai.loai,
      coQuan: phanLoai.coQuan,
      nutHopLe,
    });

    const ten = chuanTieuDeVanBan(rawMoTa, soHieu);
    const tram = raw?.tram ? `trạm: ${raw.tram}` : 'radar';
    const doc = {
      so_hieu: soHieu,
      loai: phanLoai.loai,
      ten,
      co_quan: phanLoai.coQuan,
      ngay_ban_hanh: ngayBanHanh,
      tinh_trang: 'CHUA_XAC_MINH',
      nhanh,
      nguon: nguonList,
      xac_minh: {
        muc: 'CHUA_XAC_MINH',
        hieu_luc_da_doi_chieu: false,
        ngay: today,
        boi: 'radar-auto-stub',
      },
      ghi_chu: `Stub tự động từ ${tram} — chờ tu-tai-toan-van tải PDF bậc A và đối chiếu hiệu lực.`,
    };

    if (dryRun) {
      daXetKhoa.add(k);
      da_tao.push({
        so_hieu: soHieu,
        slug,
        file: relFile,
        loai: doc.loai,
        co_quan: doc.co_quan,
        ngay_ban_hanh: ngayBanHanh,
        nhanh,
        co_pdf_bac_a: pdfUrls.length > 0,
        pdf_url: pdfUrls[0] || null,
        url_goc: rawUrl,
        dry_run: true,
        ...(loiLayPdf ? { canh_bao_lay_pdf: loiLayPdf } : {}),
      });
      continue;
    }

    mkdirSync(dirname(absFile), { recursive: true });
    const yamlText = `# Sổ đăng ký văn bản — sửa qua PR. Lược đồ: docs/luoc-do-so-dang-ky.md\n${yaml.dump(doc, {
      lineWidth: -1,
      noRefs: true,
    })}`;
    writeFileSync(absFile, yamlText, 'utf8');

    // Cổng kiểm nguyên tử sau từng stub: nếu phát sinh bất kỳ lỗi mới nào trong kiemTra -> xoá ngay stub đó!
    let kt;
    try {
      kt = kiemTraFn(root);
    } catch (err) {
      if (existsSync(absFile)) unlinkSync(absFile);
      bo_qua.push({
        so_hieu: soHieu,
        slug,
        url: rawUrl,
        ly_do: 'KIEM_TRA_SO_LOI',
        chi_tiet: [String(err?.message || err)],
      });
      continue;
    }

    const loiMoi = (kt?.loi || []).filter(
      (e) => !loiNenSet.has(`${e.file}::${e.msg}`) || e.file === relFile
    );
    if (loiMoi.length > 0) {
      if (existsSync(absFile)) unlinkSync(absFile);
      bo_qua.push({
        so_hieu: soHieu,
        slug,
        url: rawUrl,
        ly_do: 'KIEM_TRA_SO_LOI',
        chi_tiet: loiMoi.map((e) => `${e.file}: ${e.msg}`),
      });
      continue;
    }

    daXetKhoa.add(k);
    so = napSo(root);
    da_tao.push({
      so_hieu: soHieu,
      slug,
      file: relFile,
      loai: doc.loai,
      co_quan: doc.co_quan,
      ngay_ban_hanh: ngayBanHanh,
      nhanh,
      co_pdf_bac_a: pdfUrls.length > 0,
      pdf_url: pdfUrls[0] || null,
      url_goc: rawUrl,
      dry_run: false,
      ...(loiLayPdf ? { canh_bao_lay_pdf: loiLayPdf } : {}),
    });
  }

  return {
    thoi_gian: new Date().toISOString(),
    dry_run: Boolean(dryRun),
    tong_ung_vien: ungVien.length,
    thong_ke: {
      tong_ung_vien: ungVien.length,
      da_tao: da_tao.length,
      co_pdf_bac_a: da_tao.filter((x) => x.co_pdf_bac_a).length,
      bo_qua: bo_qua.length,
    },
    da_tao,
    bo_qua,
  };
}

/** Định dạng báo cáo Markdown cho PR `auto/nap-radar` và `$GITHUB_STEP_SUMMARY`. */
export function dinhDangMarkdownNapStub(kq) {
  const daTao = kq?.da_tao || [];
  const boQua = kq?.bo_qua || [];
  const ngay = (kq?.thoi_gian || new Date().toISOString()).slice(0, 10);

  const lines = [
    `## Nạp stub tự động từ Radar (${ngay})`,
    '',
    `- **Tổng ứng viên từ Radar**: ${kq?.tong_ung_vien ?? daTao.length + boQua.length}`,
    `- **Stub đã tạo${kq?.dry_run ? ' (dry-run)' : ''}**: ${daTao.length} (có sẵn link PDF bậc A: ${daTao.filter((x) => x.co_pdf_bac_a).length})`,
    `- **Bỏ qua / không đủ điều kiện**: ${boQua.length}`,
    '',
    `### Danh sách stub YAML (${daTao.length})`,
  ];

  if (!daTao.length) {
    lines.push('_Không có văn bản mới nào đủ điều kiện tạo stub tự động._');
  } else {
    for (const s of daTao) {
      const pdfNote = s.pdf_url ? ` · [PDF bậc A](${s.pdf_url})` : ' · _chưa thấy link PDF trực tiếp_';
      lines.push(
        `- **${s.so_hieu}** (\`${s.file}\`) — \`${s.loai}\` · \`${s.co_quan}\` · ban hành \`${s.ngay_ban_hanh}\` · nhánh: ${s.nhanh.map((n) => `\`${n}\``).join(', ')}${pdfNote}`
      );
    }
  }

  if (boQua.length) {
    lines.push('');
    lines.push(`### Các mục bỏ qua (${boQua.length})`);
    for (const b of boQua) {
      const chiTiet = Array.isArray(b.chi_tiet) && b.chi_tiet.length ? ` — ${b.chi_tiet.join('; ')}` : '';
      lines.push(`- **${b.so_hieu || '(không rõ số)'}**: \`${b.ly_do}\`${chiTiet}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

export function docThamSoCli(argv) {
  const opts = {
    tuRadarPath: null,
    limit: MAC_DINH_LIMIT_STUB,
    dryRun: false,
    khongLayPdfUrl: false,
    json: false,
    markdown: null,
    root: ROOT,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--khong-lay-pdf-url') opts.khongLayPdfUrl = true;
    else if (a === '--json') opts.json = true;
    else if (a === '--help' || a === '-h') opts.help = true;
    else if (a === '--tu-radar') opts.tuRadarPath = argv[++i] ?? null;
    else if (a.startsWith('--tu-radar=')) opts.tuRadarPath = a.slice('--tu-radar='.length);
    else if (a === '--limit') opts.limit = Number(argv[++i]);
    else if (a.startsWith('--limit=')) opts.limit = Number(a.slice('--limit='.length));
    else if (a === '--markdown') opts.markdown = argv[++i] ?? '-';
    else if (a.startsWith('--markdown=')) opts.markdown = a.slice('--markdown='.length);
    else if (a === '--root') opts.root = resolve(argv[++i] ?? ROOT);
    else if (a.startsWith('--root=')) opts.root = resolve(a.slice('--root='.length));
  }
  return opts;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const opts = docThamSoCli(process.argv.slice(2));
  if (opts.help) {
    console.log(
      'Cách dùng: node tools/nap-stub-radar.mjs --tu-radar <radar.json> [--limit 10] [--dry-run] [--khong-lay-pdf-url] [--json] [--markdown <file|->] [--root <dir>]'
    );
    process.exit(0);
  }

  try {
    const kq = await chayNapStubRadar({
      tuRadarPath: opts.tuRadarPath,
      root: opts.root,
      limit: opts.limit,
      dryRun: opts.dryRun,
      khongLayPdfUrl: opts.khongLayPdfUrl,
    });

    if (opts.markdown) {
      const md = dinhDangMarkdownNapStub(kq);
      if (opts.markdown === '-') {
        if (!opts.json) process.stdout.write(md);
      } else {
        mkdirSync(dirname(opts.markdown), { recursive: true });
        writeFileSync(opts.markdown, md, 'utf8');
      }
    }

    if (opts.json) {
      console.log(JSON.stringify(kq, null, 2));
    } else if (opts.markdown !== '-') {
      console.log(
        `Nạp stub Radar${kq.dry_run ? ' (dry-run)' : ''}: ứng viên ${kq.tong_ung_vien} · đã tạo ${kq.thong_ke.da_tao} (có PDF bậc A: ${kq.thong_ke.co_pdf_bac_a}) · bỏ qua ${kq.thong_ke.bo_qua}`
      );
      for (const s of kq.da_tao) {
        console.log(`[stub] ${s.so_hieu} -> ${s.file}${s.pdf_url ? ` (PDF: ${s.pdf_url})` : ''}`);
      }
    }
  } catch (err) {
    console.error(`LỖI: ${err.message}`);
    process.exit(1);
  }
}
