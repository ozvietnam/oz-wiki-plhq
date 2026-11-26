#!/usr/bin/env node
// Cầu nối tự động 06:30 Radar + Thẻ nhu cầu ([BỔ SUNG SỔ] / nhu-cau) -> 07:00 Tự tải toàn văn:
// Đọc danh sách `moi[]` từ đầu ra của `tools/radar-luat-moi.mjs` và/hoặc danh sách thẻ `nhu-cau` đang mở,
// làm giàu URL PDF bậc A và ngày ban hành từ trang chi tiết `.gov.vn`/`.chinhphu.vn` (best-effort),
// sinh stub YAML `CHUA_XAC_MINH` vào `registry/van-ban/<slug>.yaml` kèm cổng kiểm `kiemTra(napSo(root))` + rollback nguyên tử.
//
// Cách dùng:
//   node tools/nap-stub-radar.mjs [--tu-radar <radar.json>] [--tu-nhu-cau-json <issues.json>]
//                                 [--limit 10] [--dry-run] [--khong-lay-pdf-url] [--khong-tim-nguon-nhu-cau]
//                                 [--json] [--markdown <file|->] [--root <dir>]
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import yaml from 'js-yaml';
import { kiemTra } from './kiem-tra.mjs';
import { LOAI, ROOT, bacNguon, homNay, khoa, napSo, slugTuSoHieu } from './lib/registry.mjs';
import {
  daCoTrongSo,
  docRssCongBao,
  docTrangVanBanChinhPhu,
  sinhBienTheKhoaSoHieu,
  soHieuTuSlug,
  trichTatCaSoHieu,
  USER_AGENT,
} from './radar-luat-moi.mjs';
import { giaiMaHtmlEntities, laUrlVbpl, trichUrlPdfTuHtml } from './tai-pdf-tu-vo-html.mjs';

export const MAC_DINH_LIMIT_STUB = 10;
export const TIMEOUT_CHI_TIET_MS = 10000;
export const NGUON_TIM_VAN_BAN_CHINH_PHU = 'https://vanban.chinhphu.vn/he-thong-van-ban';
export const NGUON_TIM_CONG_BAO = 'https://congbao.chinhphu.vn/tim-kiem-van-ban.htm';

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

const RE_TIEU_DE_CHUNG_CONG =
  /^(?:hệ thống văn bản|cổng thông tin điện tử chính phủ|công báo(?:\s+nước\s+chxhcn\s+việt\s+nam)?|kết quả tìm kiếm(?:\s+văn\s+bản)?|hải quan việt nam|bộ công thương|bộ tài chính)$/iu;

let _cachedDefaultNguon = null;
function layNguonMacDinh() {
  if (!_cachedDefaultNguon) {
    try {
      _cachedDefaultNguon = yaml.load(readFileSync(join(ROOT, 'registry', 'nguon-uy-tin.yaml'), 'utf8')) || {};
    } catch {
      _cachedDefaultNguon = {};
    }
  }
  return _cachedDefaultNguon;
}

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

  // Khớp định dạng số hiệu pháp luật Việt Nam chuẩn (không chấp nhận chuỗi mơ hồ hay số hiệu bị cắt cụt như 69/2018/N)
  if (
    !/^\d{1,5}\/(?:(?:19|20)\d{2}\/)?(?:QH\d{1,2}|UBTVQH\d*|[A-ZĐ0-9]+-[A-ZĐ0-9-]+)(?:\/(?:19|20)\d{2})?$/iu.test(
      s
    )
  ) {
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
      // Dạng công văn hành chính: 10094/BCT-TTTN, 18391/CHQ-NVTHQ, 910/SPS-BNNMT
      const parts = boDauSo.split('-');
      const dau = parts[0];
      const sau = parts[1];
      if (coQuanHopLe.size === 0 || coQuanHopLe.has(dau)) {
        loai = 'CONG_VAN';
        coQuan = dau;
      } else if (sau && coQuanHopLe.has(sau)) {
        loai = 'CONG_VAN';
        coQuan = sau;
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

/** Trích tiêu đề / trích yếu văn bản từ trang HTML chi tiết bậc A (hữu ích cho thẻ `[BỔ SUNG SỔ]` chỉ có số hiệu). */
export function trichTieuDeTuHtmlChiTiet(htmlText) {
  const html = giaiMaHtmlEntities(String(htmlText || ''));
  if (!html) return '';

  const patterns = [
    /<(?:div|span|p|td)[^>]*class=["'][^"']*(?:substract|trich-yeu|trichyeu|doc-abstract|abstract|doc-summary)[^"']*["'][^>]*>([\s\S]{5,600}?)<\/(?:div|span|p|td)>/i,
    /<td[^>]*>\s*Trích\s+yếu\s*<\/td>\s*<td[^>]*>([\s\S]{5,600}?)<\/td>/iu,
    /<h1\b[^>]*>([\s\S]{5,500}?)<\/h1>/i,
    /<meta\b[^>]*property=["']og:title["'][^>]*content=["']([^"']{5,500})["']/i,
    /<title\b[^>]*>([\s\S]{5,500}?)<\/title>/i,
  ];

  for (const re of patterns) {
    const m = html.match(re);
    if (!m) continue;
    const cleaned = String(m[1] || '')
      .replace(/<[^>]+>/g, ' ')
      .normalize('NFC')
      .replace(/\s+/g, ' ')
      .replace(/\s*[|-]\s*(?:Cổng Thông tin điện tử.*|Công báo.*|Hệ thống văn bản.*)$/iu, '')
      .trim();
    if (cleaned.length >= 10 && !RE_TIEU_DE_CHUNG_CONG.test(cleaned)) {
      return cleaned;
    }
  }
  return '';
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
  const cfg = nguonConfig && Object.keys(nguonConfig).length > 0 ? nguonConfig : layNguonMacDinh();
  return bacNguon(url, cfg) === 'A';
}

/** Kiểm tra URL bậc A có trỏ tới tài liệu/trang chi tiết cụ thể (loại trang chủ rỗng và URL tìm kiếm/danh mục). */
export function laUrlTaiLieuBacACuThe(url, nguonConfig = {}) {
  if (!laUrlNguonBacAVietNam(url, nguonConfig)) return false;
  let u;
  try {
    u = new URL(url);
  } catch {
    return false;
  }
  const path = u.pathname || '/';
  const search = u.search || '';
  if ((path === '/' || path === '') && !search) return false;
  if (/[?&](?:tukhoa|keyword|q)=/i.test(search)) return false;
  if (/\/(?:tim-kiem|tim-kiem-van-ban|he-thong-van-ban|vbpq-tim-kiem)(?:\.html?)?$/i.test(path)) return false;
  if (/[?&]do=browse\b/i.test(search)) return false;
  if (/pageId=8\b/i.test(search) && !/[?&]id=\d+/i.test(search)) return false;
  return true;
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

function lamSachTokenSoHieu(raw) {
  return String(raw || '')
    .normalize('NFC')
    .trim()
    .replace(/^[`'"([{*«“]+/, '')
    .replace(/[`'")\]}*»”.,;:!?]+$/, '');
}

function trichSoHieuTuTheNhuCau(title, body) {
  const t = String(title || '').normalize('NFC').trim();
  // 1. Tiêu đề chuẩn [BỔ SUNG SỔ] <soHieu>... hoặc [miss] <soHieu>...
  const mThe = t.match(/^\s*\[(?:BỔ\s*SUNG\s*SỔ|BO\s*SUNG\s*SO|miss)\]\s*([^\n]+)$/iu);
  if (mThe) {
    const sauThe = mThe[1].trim();
    const dauCau = lamSachTokenSoHieu(sauThe.split(/\s+[—–]\s+|\s+-\s+|\s*[:(]/)[0]);
    const chuan = chuanHoaSoHieuStub(dauCau);
    if (chuan) return chuan;
    for (const sh of trichTatCaSoHieu(sauThe)) {
      const c = chuanHoaSoHieuStub(sh);
      if (c) return c;
    }
  }

  // 2. Bất kỳ số hiệu hợp lệ nào trong tiêu đề
  for (const sh of trichTatCaSoHieu(t)) {
    const c = chuanHoaSoHieuStub(sh);
    if (c) return c;
  }

  // 3. Cụm đặc trưng trong body của bo-sung-so.ts / sinh-issue-miss.mjs
  const b = String(body || '').normalize('NFC');
  const mFoundFalse = b.match(/Số\s+hiệu\s+[`*"']*([^\s`*"',;()]+)[`*"']*\s+(?:trả|vẫn)\s+found\s*:\s*false/iu);
  if (mFoundFalse) {
    const c = chuanHoaSoHieuStub(lamSachTokenSoHieu(mFoundFalse[1]));
    if (c) return c;
  }
  const mKhachTra = b.match(/Khách\s+tra(?:\s+hiệu\s+lực)?\s+\*{0,2}[`"']*([^\s`*"',;()—–]+)[`"']*\*{0,2}/iu);
  if (mKhachTra) {
    const c = chuanHoaSoHieuStub(lamSachTokenSoHieu(mKhachTra[1]));
    if (c) return c;
  }

  // 4. Fallback: số hiệu đầu tiên trong phần mô tả chính của body (trước phần "Các nguồn đã thử" / "Việc cần làm")
  const phanChinh = b.split(/^##\s+(?:Các nguồn đã thử|Việc cần làm)/im)[0] || b;
  const khongUrl = phanChinh.replace(/https?:\/\/\S+/gi, ' ');
  for (const sh of trichTatCaSoHieu(khongUrl)) {
    const c = chuanHoaSoHieuStub(sh);
    if (c) return c;
  }

  return null;
}

function trichMoTaTuIssueNhuCau(title, body, soHieu) {
  const t = String(title || '').normalize('NFC').trim();
  const phanSau = t
    .replace(/^\s*\[(?:BỔ\s*SUNG\s*SỔ|BO\s*SUNG\s*SO|miss)\]\s*/iu, '')
    .split(/\s+[—–]\s+|\s+-\s+/)
    .slice(1)
    .join(' — ')
    .trim();
  if (
    phanSau &&
    phanSau.length >= 12 &&
    !/khách\s+tra\s+\d+\s+lần|sổ\s+chưa\s+có|found\s*:\s*false|chờ\s+nguồn/iu.test(phanSau)
  ) {
    return phanSau;
  }

  const b = String(body || '').normalize('NFC');
  const mVeViec = b.match(/về\s+việc\s+([^\n.]{12,240})/iu);
  if (mVeViec) {
    const veViec = mVeViec[0].replace(/\*\*|`/g, '').replace(/\s+/g, ' ').trim();
    if (!/found\s*:\s*false|oz-wiki-plhq/iu.test(veViec)) {
      return veViec;
    }
  }

  void soHieu;
  return '';
}

function trichUrlsBacATuBodyIssue(body, nguonConfig) {
  const htmlUrls = [];
  const pdfUrls = [];
  const seen = new Set();

  const text = String(body || '').normalize('NFC');
  // Bỏ qua khối "## Các nguồn đã thử" (nơi ghi nhận các URL thử nghiệm trả 0 kết quả / 404)
  const phanHopLe = text.split(/^##\s+Các\s+nguồn\s+đã\s+thử\b/im)[0] || '';

  for (const line of phanHopLe.split(/\r?\n/)) {
    // Bỏ qua dòng ghi chú rõ là URL lỗi / 404 / 0 kết quả / vỏ SPA
    if (/\b(?:HTTP\s*4\d\d|404|0\s+kết\s+quả|chỉ\s+trả\s+vỏ\s+SPA|không\s+đạt\s+chuẩn|timeout|reset\s+kết\s+nối)\b/iu.test(line)) {
      continue;
    }
    for (const m of line.matchAll(/https?:\/\/[^\s)\]>,"'`*]+/gi)) {
      const clean = m[0].replace(/[.,;:!?'"`*)\]>]+$/, '').trim();
      if (!clean || seen.has(clean)) continue;
      if (/^https?:\/\/(?:www\.)?github\.com\//i.test(clean)) continue;
      if (!laUrlTaiLieuBacACuThe(clean, nguonConfig)) continue;
      seen.add(clean);
      if (/\.pdf(?:$|[?#])/i.test(clean)) {
        pdfUrls.push(clean);
      } else {
        htmlUrls.push(clean);
      }
    }
  }

  return { htmlUrls, pdfUrls };
}

/**
 * Trích danh sách ứng viên bổ sung sổ từ đầu ra JSON của
 * `gh issue list --repo ozvietnam/oz-wiki-plhq --label nhu-cau --state open --limit 100 --json number,title,body,url`.
 */
export function trichUngVienTuIssuesNhuCau(issues, { nguon = null } = {}) {
  const ds = Array.isArray(issues)
    ? issues
    : issues && Array.isArray(issues.issues)
      ? issues.issues
      : [];
  const nguonConfig = nguon && Object.keys(nguon).length > 0 ? nguon : layNguonMacDinh();
  const theoKhoaMap = new Map();

  for (const issue of ds) {
    if (!issue || typeof issue !== 'object') continue;
    if (issue.state && String(issue.state).toUpperCase() === 'CLOSED') continue;

    const title = String(issue.title || '');
    const body = String(issue.body || issue.description || '');
    const soHieu = trichSoHieuTuTheNhuCau(title, body);
    if (!soHieu) continue;

    const num = Number(issue.number);
    const issueNum = Number.isInteger(num) && num > 0 ? num : null;
    const issueUrl = typeof issue.url === 'string' && issue.url.trim() ? issue.url.trim() : '';

    const { htmlUrls, pdfUrls } = trichUrlsBacATuBodyIssue(body, nguonConfig);
    const primaryUrl = htmlUrls[0] || pdfUrls[0] || '';
    const primaryPdf = pdfUrls[0] || '';

    const mNgayBanHanh = body.match(
      /(?:ban\s+hành\s+ngày|ngày\s+ban\s+hành\s*:?)\s*[`*"']*(\d{1,2}[/-]\d{1,2}[/-](?:19|20)\d{2}|(?:19|20)\d{2}-\d{2}-\d{2})/iu
    );
    const ngay = mNgayBanHanh ? chuanHoaNgayBanHanh(mNgayBanHanh[1]) || '' : '';
    const moTa = trichMoTaTuIssueNhuCau(title, body, soHieu);

    const k = khoa(soHieu);
    const existing = theoKhoaMap.get(k);
    if (existing) {
      if (issueNum && !existing.issueNumbers.includes(issueNum)) {
        existing.issueNumbers.push(issueNum);
        existing.issueNumbers.sort((a, b) => a - b);
        existing.issueNumber = existing.issueNumbers[0];
      }
      if (!existing.url && primaryUrl) existing.url = primaryUrl;
      if (!existing.pdfUrl && primaryPdf) existing.pdfUrl = primaryPdf;
      if (!existing.ngay && ngay) existing.ngay = ngay;
      if (!existing.moTa && moTa) existing.moTa = moTa;
      if (!existing.issueUrl && issueUrl) existing.issueUrl = issueUrl;
      continue;
    }

    const issueNumbers = issueNum ? [issueNum] : [];
    theoKhoaMap.set(k, {
      soHieu,
      moTa,
      ngay,
      url: primaryUrl,
      ...(primaryPdf ? { pdfUrl: primaryPdf } : {}),
      nguon_ung_vien: 'nhu_cau',
      tram: 'nhu_cau',
      issueNumber: issueNumbers[0] ?? null,
      issueNumbers,
      ...(issueUrl ? { issueUrl } : {}),
    });
  }

  return [...theoKhoaMap.values()];
}

function khopSoHieuTimKiem(candSoHieu, targetSoHieu, ngay = '') {
  if (!candSoHieu || !targetSoHieu) return false;
  const kCand = khoa(candSoHieu);
  const kTarget = khoa(targetSoHieu);
  if (!kCand || !kTarget) return false;
  if (kCand === kTarget) return true;
  const bienTheTarget = sinhBienTheKhoaSoHieu(targetSoHieu, ngay);
  if (bienTheTarget.has(kCand)) return true;
  const bienTheCand = sinhBienTheKhoaSoHieu(candSoHieu, ngay);
  return bienTheCand.has(kTarget);
}

function phanTichKetQuaTimCongChinhPhu(bodyText, baseUrl) {
  const raw = String(bodyText || '').trim();
  if (!raw) return [];

  // 1. Hỗ trợ JSON (vd timkiem.chinhphu.vn hoặc mock API)
  if (raw.startsWith('{') || raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw);
      const arr = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.data)
          ? parsed.data
          : Array.isArray(parsed?.items)
            ? parsed.items
            : [];
      return arr
        .map((it) => {
          const url = String(it?.url || it?.link || '').trim();
          const moTa = String(it?.title || it?.moTa || it?.ten || it?.content || '').trim();
          const sh =
            it?.soHieu ||
            it?.so_hieu ||
            soHieuTuSlug(url) ||
            trichTatCaSoHieu(`${it?.title || ''} ${it?.content || ''}`)[0] ||
            null;
          return {
            soHieu: sh,
            moTa,
            ngay: String(it?.ngay || it?.issued_date || '').trim(),
            url,
            ...(it?.pdfUrl || it?.pdf_url ? { pdfUrl: String(it.pdfUrl || it.pdf_url).trim() } : {}),
          };
        })
        .filter((x) => x.url);
    } catch {
      /* tiếp tục thử XML/HTML */
    }
  }

  // 2. Hỗ trợ RSS XML của Công báo
  if (/<item\b/i.test(raw) && /<link\b/i.test(raw)) {
    return docRssCongBao(raw);
  }

  // 3. Hỗ trợ bảng/anchor HTML của vanban.chinhphu.vn và congbao.chinhphu.vn
  const ketQua = [...docTrangVanBanChinhPhu(raw, baseUrl)];
  const seenUrls = new Set(ketQua.map((x) => x.url));

  for (const m of raw.matchAll(/<a\b([^>]*href=["']([^"']+)["'][^>]*)>([\s\S]*?)<\/a>/gi)) {
    const attrStr = m[1] || '';
    const href = giaiMaHtmlEntities(m[2] || '').trim();
    if (!href || /^(?:#|javascript:|mailto:)/i.test(href)) continue;
    let absUrl = href;
    try {
      absUrl = new URL(href, baseUrl).href;
    } catch {
      /* giữ nguyên */
    }
    if (seenUrls.has(absUrl)) continue;
    const inner = giaiMaHtmlEntities(m[3] || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const titleAttr = giaiMaHtmlEntities((attrStr.match(/\btitle=["']([^"']+)["']/i) || [])[1] || '').trim();
    const moTa = titleAttr.length > inner.length ? titleAttr : inner;
    const sh = soHieuTuSlug(absUrl) || trichTatCaSoHieu(moTa)[0] || null;
    if (!sh) continue;
    seenUrls.add(absUrl);
    ketQua.push({
      soHieu: sh,
      moTa,
      ngay: '',
      url: absUrl,
      ...(/\.pdf(?:$|[?#])/i.test(absUrl) ? { pdfUrl: absUrl } : {}),
    });
  }

  return ketQua;
}

/**
 * Best-effort tìm trang nguồn bậc A + link PDF bậc A trên `vanban.chinhphu.vn` / `congbao.chinhphu.vn`
 * cho thẻ `nhu-cau` chỉ mới có `soHieu` (chưa đính kèm sẵn URL `.gov.vn` trong nội dung issue).
 */
export async function timNguonBacAChoNhuCau(
  soHieu,
  { ngay = '', nguon = null, fetchFn = fetch } = {}
) {
  const chuan = chuanHoaSoHieuStub(soHieu);
  if (!chuan || typeof fetchFn !== 'function') return null;

  const nguonConfig = nguon && Object.keys(nguon).length > 0 ? nguon : layNguonMacDinh();
  const probeUrls = [
    `${NGUON_TIM_VAN_BAN_CHINH_PHU}?tukhoa=${encodeURIComponent(chuan)}`,
    `${NGUON_TIM_CONG_BAO}?tukhoa=${encodeURIComponent(chuan)}`,
  ];

  for (const searchUrl of probeUrls) {
    let res;
    try {
      res = await fetchFn(searchUrl, {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9,*/*;q=0.8',
          'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(TIMEOUT_CHI_TIET_MS),
      });
    } catch {
      continue;
    }
    if (!res || !res.ok) continue;

    let bodyText = '';
    try {
      bodyText = await res.text();
    } catch {
      continue;
    }

    const baseUrl = res.url || searchUrl;
    const danhSach = phanTichKetQuaTimCongChinhPhu(bodyText, baseUrl);
    const khop = danhSach.find(
      (it) =>
        khopSoHieuTimKiem(it.soHieu, chuan, ngay || it.ngay || '') &&
        laUrlTaiLieuBacACuThe(it.url, nguonConfig)
    );
    if (!khop) continue;

    const pdfUrls = [];
    if (khop.pdfUrl && laUrlNguonBacAVietNam(khop.pdfUrl, nguonConfig)) {
      pdfUrls.push(khop.pdfUrl);
    }
    if (/\.pdf(?:$|[?#])/i.test(khop.url) && !pdfUrls.includes(khop.url)) {
      pdfUrls.push(khop.url);
    }

    let ngayTuHtml = null;
    let moTaTuHtml = '';
    if (laTrangHtmlCanLamGiauPdf(khop.url)) {
      try {
        const detailRes = await fetchFn(khop.url, {
          headers: {
            'User-Agent': USER_AGENT,
            Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
          },
          redirect: 'follow',
          signal: AbortSignal.timeout(TIMEOUT_CHI_TIET_MS),
        });
        if (detailRes && detailRes.ok) {
          const detailHtml = await detailRes.text();
          const finalDetailBase = detailRes.url || khop.url;
          ngayTuHtml = trichNgayBanHanhTuHtml(detailHtml);
          moTaTuHtml = trichTieuDeTuHtmlChiTiet(detailHtml);
          for (const pu of trichPdfBacATuHtmlChiTiet(detailHtml, {
            baseUrl: finalDetailBase,
            nguon: nguonConfig,
          })) {
            if (!pdfUrls.includes(pu)) pdfUrls.push(pu);
          }
        }
      } catch {
        /* giữ trang chi tiết bậc A ngay cả khi lượt tải phụ gặp lỗi mạng tạm */
      }
    }

    return {
      url: khop.url,
      pdfUrl: pdfUrls[0] || null,
      pdfUrls,
      ngay: ngayTuHtml || khop.ngay || '',
      moTa: moTaTuHtml || khop.moTa || '',
    };
  }

  return null;
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

function docDanhSachUngVienRadar(tuRadarPath, items, coNhuCau = false) {
  if (Array.isArray(items)) return items;
  if (!tuRadarPath) {
    if (coNhuCau) return [];
    throw new Error('Cần truyền --tu-radar <radar.json>, --tu-nhu-cau-json <issues.json> hoặc mảng items');
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

function docDanhSachIssuesNhuCau(tuNhuCauJsonPath, issuesNhuCau) {
  if (Array.isArray(issuesNhuCau)) return issuesNhuCau;
  if (!tuNhuCauJsonPath) return [];
  const abs = resolve(tuNhuCauJsonPath);
  if (!existsSync(abs)) {
    throw new Error(`Không tìm thấy tệp nhu-cau JSON: ${abs}`);
  }
  const parsed = JSON.parse(readFileSync(abs, 'utf8'));
  if (Array.isArray(parsed)) return parsed;
  if (parsed && Array.isArray(parsed.issues)) return parsed.issues;
  throw new Error(`Tệp nhu-cau JSON phải là mảng issue: ${abs}`);
}

function chuanDanhSachIssueNumbers(raw) {
  const nums = [];
  const add = (v) => {
    const n = Number(v);
    if (Number.isInteger(n) && n > 0 && !nums.includes(n)) nums.push(n);
  };
  if (Array.isArray(raw?.issueNumbers)) raw.issueNumbers.forEach(add);
  if (Array.isArray(raw?.issue_numbers)) raw.issue_numbers.forEach(add);
  if (raw?.issueNumber != null) add(raw.issueNumber);
  if (raw?.issue_number != null) add(raw.issue_number);
  nums.sort((a, b) => a - b);
  return nums;
}

function gopUngVienRadarVaNhuCau(radarList, nhuCauList) {
  const ketQua = radarList.map((r) => ({
    ...r,
    nguon_ung_vien: r?.nguon_ung_vien === 'nhu_cau' ? 'nhu_cau' : 'radar',
    issueNumbers: chuanDanhSachIssueNumbers(r),
  }));

  for (const nc of nhuCauList) {
    const shNc = chuanHoaSoHieuStub(nc?.soHieu ?? nc?.so_hieu ?? null);
    const khopRadar = shNc
      ? ketQua.find((r) => {
          const shR = chuanHoaSoHieuStub(r?.soHieu ?? r?.so_hieu ?? null);
          return shR && khopSoHieuTimKiem(shR, shNc, nc?.ngay || r?.ngay || '');
        })
      : null;

    if (khopRadar) {
      for (const num of chuanDanhSachIssueNumbers(nc)) {
        if (!khopRadar.issueNumbers.includes(num)) {
          khopRadar.issueNumbers.push(num);
        }
      }
      khopRadar.issueNumbers.sort((a, b) => a - b);
      if (!khopRadar.url && nc.url) khopRadar.url = nc.url;
      if (!khopRadar.pdfUrl && nc.pdfUrl) khopRadar.pdfUrl = nc.pdfUrl;
      if (!khopRadar.ngay && nc.ngay) khopRadar.ngay = nc.ngay;
      if (!khopRadar.moTa && nc.moTa) khopRadar.moTa = nc.moTa;
      continue;
    }

    ketQua.push({
      ...nc,
      nguon_ung_vien: 'nhu_cau',
      issueNumbers: chuanDanhSachIssueNumbers(nc),
    });
  }

  return ketQua;
}

/**
 * Chạy luồng dựng stub YAML tự động từ danh sách văn bản mới của Radar và/hoặc thẻ nhu cầu (`nhu-cau`).
 */
export async function chayNapStubRadar({
  items = null,
  tuRadarPath = null,
  issuesNhuCau = null,
  tuNhuCauJsonPath = null,
  root = ROOT,
  limit = MAC_DINH_LIMIT_STUB,
  dryRun = false,
  khongLayPdfUrl = false,
  khongTimNguonNhuCau = false,
  fetchFn = fetch,
  kiemTraFn = chayKiemTraMacDinh,
  today = homNay(),
} = {}) {
  const coTruyenNhuCau = Array.isArray(issuesNhuCau) || Boolean(tuNhuCauJsonPath);
  const ungVienRadar = docDanhSachUngVienRadar(tuRadarPath, items, coTruyenNhuCau);

  let so = napSo(root);
  const rawIssuesNhuCau = docDanhSachIssuesNhuCau(tuNhuCauJsonPath, issuesNhuCau);
  const ungVienNhuCau = rawIssuesNhuCau.length
    ? trichUngVienTuIssuesNhuCau(rawIssuesNhuCau, { nguon: so.nguon })
    : [];
  const ungVien = gopUngVienRadarVaNhuCau(ungVienRadar, ungVienNhuCau);

  const maxLimit = Number.isInteger(limit) && limit > 0 ? limit : MAC_DINH_LIMIT_STUB;
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
    const nguonUngVien = raw?.nguon_ung_vien === 'nhu_cau' ? 'nhu_cau' : 'radar';
    const issueNumbers = chuanDanhSachIssueNumbers(raw);
    const metaIssue = issueNumbers.length ? { issue_numbers: issueNumbers } : {};

    if (da_tao.length >= maxLimit) {
      bo_qua.push({
        so_hieu: raw?.soHieu || raw?.so_hieu || null,
        url: raw?.url || '',
        nguon_ung_vien: nguonUngVien,
        ...metaIssue,
        ly_do: 'VUOT_LIMIT',
      });
      continue;
    }

    let rawUrl = String(raw?.url || '').trim();
    let rawMoTa = String(raw?.moTa || raw?.ten || '').trim();
    let rawNgay = String(raw?.ngay || raw?.ngay_ban_hanh || '').trim();
    const rawSoHieu = raw?.soHieu ?? raw?.so_hieu ?? null;
    const soHieu = chuanHoaSoHieuStub(rawSoHieu);

    if (!soHieu) {
      bo_qua.push({
        so_hieu: rawSoHieu || null,
        url: rawUrl,
        nguon_ung_vien: nguonUngVien,
        ...metaIssue,
        ly_do: 'THIEU_HOAC_SAI_SO_HIEU',
      });
      continue;
    }

    if (nguonUngVien !== 'nhu_cau' && laSoHieuChiVienDan(soHieu, rawMoTa, rawUrl)) {
      bo_qua.push({
        so_hieu: soHieu,
        url: rawUrl,
        nguon_ung_vien: nguonUngVien,
        ...metaIssue,
        ly_do: 'SO_HIEU_CHI_VIEN_DAN',
      });
      continue;
    }

    const phanLoai = suyLoaiVaCoQuan(soHieu, rawMoTa, coQuanHopLe);
    if (!phanLoai.hopLe) {
      bo_qua.push({
        so_hieu: soHieu,
        url: rawUrl,
        nguon_ung_vien: nguonUngVien,
        ...metaIssue,
        ly_do: phanLoai.lyDo,
      });
      continue;
    }

    const k = khoa(soHieu);
    if (daXetKhoa.has(k) || daCoTrongSo(soHieu, rawNgay, so)) {
      bo_qua.push({
        so_hieu: soHieu,
        url: rawUrl,
        nguon_ung_vien: nguonUngVien,
        ...metaIssue,
        ly_do: 'DA_CO_TRONG_SO',
      });
      continue;
    }

    const pdfUrls = [];
    if (raw?.pdfUrl && laUrlNguonBacAVietNam(raw.pdfUrl, so.nguon)) {
      pdfUrls.push(String(raw.pdfUrl).trim());
    }

    // Nếu ứng viên nhu-cau chỉ có soHieu mà chưa có URL bậc A -> chủ động dò trên vanban.chinhphu.vn / congbao.chinhphu.vn
    let daLamGiauTuTimNguon = false;
    if (
      nguonUngVien === 'nhu_cau' &&
      (!rawUrl || !laUrlNguonBacAVietNam(rawUrl, so.nguon)) &&
      !khongTimNguonNhuCau &&
      typeof fetchFn === 'function'
    ) {
      const timThay = await timNguonBacAChoNhuCau(soHieu, {
        ngay: rawNgay,
        nguon: so.nguon,
        fetchFn,
      });
      if (timThay?.url) {
        rawUrl = timThay.url;
        if (!rawMoTa && timThay.moTa) rawMoTa = timThay.moTa;
        if (!rawNgay && timThay.ngay) rawNgay = timThay.ngay;
        for (const pu of timThay.pdfUrls || []) {
          if (!pdfUrls.includes(pu)) pdfUrls.push(pu);
        }
        daLamGiauTuTimNguon = true;
      }
    }

    if (!rawUrl || !laUrlNguonBacAVietNam(rawUrl, so.nguon)) {
      bo_qua.push({
        so_hieu: soHieu,
        url: rawUrl,
        nguon_ung_vien: nguonUngVien,
        ...metaIssue,
        ly_do:
          nguonUngVien === 'nhu_cau' && !rawUrl
            ? 'CHUA_TIM_THAY_NGUON_BAC_A'
            : 'NGUON_KHONG_PHAI_BAC_A_VN',
      });
      continue;
    }

    if (/\.pdf(?:$|[?#])/i.test(rawUrl) && !pdfUrls.includes(rawUrl)) {
      pdfUrls.push(rawUrl);
    }

    // Best-effort làm giàu URL PDF bậc A + ngày ban hành + tiêu đề từ trang HTML chi tiết
    let ngayTuHtml = null;
    let loiLayPdf = null;
    if (
      !daLamGiauTuTimNguon &&
      !khongLayPdfUrl &&
      typeof fetchFn === 'function' &&
      laTrangHtmlCanLamGiauPdf(rawUrl)
    ) {
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
          if (!rawMoTa) {
            const tieuDeHtml = trichTieuDeTuHtmlChiTiet(html);
            if (tieuDeHtml) rawMoTa = tieuDeHtml;
          }
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
      chuanHoaNgayBanHanh(rawNgay) ||
      chuanHoaNgayBanHanh(rawMoTa) ||
      null;

    if (!ngayBanHanh) {
      bo_qua.push({
        so_hieu: soHieu,
        url: rawUrl,
        nguon_ung_vien: nguonUngVien,
        ...metaIssue,
        ly_do: 'THIEU_NGAY_BAN_HANH',
      });
      continue;
    }

    // Kiểm tra lại với ngày ban hành chính thức xem có trùng biến thể năm trong sổ không
    if (daCoTrongSo(soHieu, ngayBanHanh, so)) {
      bo_qua.push({
        so_hieu: soHieu,
        url: rawUrl,
        nguon_ung_vien: nguonUngVien,
        ...metaIssue,
        ly_do: 'DA_CO_TRONG_SO',
      });
      continue;
    }

    const slug = slugTuSoHieu(soHieu, ngayBanHanh.slice(0, 4));
    const relFile = `registry/van-ban/${slug}.yaml`;
    const absFile = join(root, 'registry', 'van-ban', `${slug}.yaml`);
    if (existsSync(absFile)) {
      bo_qua.push({
        so_hieu: soHieu,
        slug,
        url: rawUrl,
        nguon_ung_vien: nguonUngVien,
        ...metaIssue,
        ly_do: 'DA_CO_TEP_SLUG',
      });
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
    const nhanNguon =
      nguonUngVien === 'nhu_cau'
        ? `thẻ nhu cầu${issueNumbers.length ? ` (${issueNumbers.map((n) => `#${n}`).join(', ')})` : ''}`
        : `${raw?.tram ? `trạm: ${raw.tram}` : 'radar'}${
            issueNumbers.length ? `, thẻ nhu cầu: ${issueNumbers.map((n) => `#${n}`).join(', ')}` : ''
          }`;

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
      ghi_chu: `Stub tự động từ ${nhanNguon} — chờ tu-tai-toan-van tải PDF bậc A và đối chiếu hiệu lực.`,
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
        nguon_ung_vien: nguonUngVien,
        ...metaIssue,
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
        nguon_ung_vien: nguonUngVien,
        ...metaIssue,
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
        nguon_ung_vien: nguonUngVien,
        ...metaIssue,
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
      nguon_ung_vien: nguonUngVien,
      ...metaIssue,
      dry_run: false,
      ...(loiLayPdf ? { canh_bao_lay_pdf: loiLayPdf } : {}),
    });
  }

  const theNhuCauLienKet = [
    ...new Set(da_tao.flatMap((x) => (Array.isArray(x.issue_numbers) ? x.issue_numbers : []))),
  ].sort((a, b) => a - b);

  return {
    thoi_gian: new Date().toISOString(),
    dry_run: Boolean(dryRun),
    tong_ung_vien: ungVien.length,
    thong_ke: {
      tong_ung_vien: ungVien.length,
      tu_radar: ungVienRadar.length,
      tu_nhu_cau: ungVienNhuCau.length,
      da_tao: da_tao.length,
      da_tao_tu_nhu_cau: da_tao.filter((x) => x.nguon_ung_vien === 'nhu_cau').length,
      co_pdf_bac_a: da_tao.filter((x) => x.co_pdf_bac_a).length,
      bo_qua: bo_qua.length,
      the_nhu_cau_lien_ket: theNhuCauLienKet,
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
  const theLienKet = [
    ...new Set(
      (kq?.thong_ke?.the_nhu_cau_lien_ket ||
        daTao.flatMap((x) => (Array.isArray(x.issue_numbers) ? x.issue_numbers : [])))
    ),
  ].sort((a, b) => a - b);

  const lines = [
    `## Nạp stub tự động từ Radar (${ngay})`,
    '',
    `- **Tổng ứng viên**: ${kq?.tong_ung_vien ?? daTao.length + boQua.length} (Radar: ${kq?.thong_ke?.tu_radar ?? 0} · Nhu cầu: ${kq?.thong_ke?.tu_nhu_cau ?? 0})`,
    `- **Stub đã tạo${kq?.dry_run ? ' (dry-run)' : ''}**: ${daTao.length} (có sẵn link PDF bậc A: ${daTao.filter((x) => x.co_pdf_bac_a).length})`,
    `- **Bỏ qua / không đủ điều kiện**: ${boQua.length}`,
  ];

  if (theLienKet.length > 0) {
    lines.push(`- Liên kết thẻ nhu cầu: ${theLienKet.map((n) => `#${n}`).join(', ')}`);
  }

  lines.push('');
  lines.push(`### Danh sách stub YAML (${daTao.length})`);

  if (!daTao.length) {
    lines.push('_Không có văn bản mới nào đủ điều kiện tạo stub tự động._');
  } else {
    for (const s of daTao) {
      const pdfNote = s.pdf_url ? ` · [PDF bậc A](${s.pdf_url})` : ' · _chưa thấy link PDF trực tiếp_';
      const nguonTag = s.nguon_ung_vien === 'nhu_cau' ? ' · nguồn: `nhu_cau`' : '';
      const issueNote =
        Array.isArray(s.issue_numbers) && s.issue_numbers.length
          ? ` · Liên kết thẻ nhu cầu: ${s.issue_numbers.map((n) => `#${n}`).join(', ')}`
          : '';
      lines.push(
        `- **${s.so_hieu}** (\`${s.file}\`) — \`${s.loai}\` · \`${s.co_quan}\` · ban hành \`${s.ngay_ban_hanh}\` · nhánh: ${s.nhanh.map((n) => `\`${n}\``).join(', ')}${nguonTag}${pdfNote}${issueNote}`
      );
    }
  }

  if (boQua.length) {
    lines.push('');
    lines.push(`### Các mục bỏ qua (${boQua.length})`);
    for (const b of boQua) {
      const issueRef =
        Array.isArray(b.issue_numbers) && b.issue_numbers.length
          ? ` (${b.issue_numbers.map((n) => `#${n}`).join(', ')})`
          : '';
      const chiTiet = Array.isArray(b.chi_tiet) && b.chi_tiet.length ? ` — ${b.chi_tiet.join('; ')}` : '';
      lines.push(`- **${b.so_hieu || '(không rõ số)'}**${issueRef}: \`${b.ly_do}\`${chiTiet}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

export function docThamSoCli(argv) {
  const opts = {
    tuRadarPath: null,
    tuNhuCauJsonPath: null,
    limit: MAC_DINH_LIMIT_STUB,
    dryRun: false,
    khongLayPdfUrl: false,
    khongTimNguonNhuCau: false,
    json: false,
    markdown: null,
    root: ROOT,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--khong-lay-pdf-url') opts.khongLayPdfUrl = true;
    else if (a === '--khong-tim-nguon-nhu-cau') opts.khongTimNguonNhuCau = true;
    else if (a === '--json') opts.json = true;
    else if (a === '--help' || a === '-h') opts.help = true;
    else if (a === '--tu-radar') opts.tuRadarPath = argv[++i] ?? null;
    else if (a.startsWith('--tu-radar=')) opts.tuRadarPath = a.slice('--tu-radar='.length);
    else if (a === '--tu-nhu-cau-json') opts.tuNhuCauJsonPath = argv[++i] ?? null;
    else if (a.startsWith('--tu-nhu-cau-json=')) opts.tuNhuCauJsonPath = a.slice('--tu-nhu-cau-json='.length);
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
      'Cách dùng: node tools/nap-stub-radar.mjs [--tu-radar <radar.json>] [--tu-nhu-cau-json <issues.json>] [--limit 10] [--dry-run] [--khong-lay-pdf-url] [--khong-tim-nguon-nhu-cau] [--json] [--markdown <file|->] [--root <dir>]'
    );
    process.exit(0);
  }

  try {
    const kq = await chayNapStubRadar({
      tuRadarPath: opts.tuRadarPath,
      tuNhuCauJsonPath: opts.tuNhuCauJsonPath,
      root: opts.root,
      limit: opts.limit,
      dryRun: opts.dryRun,
      khongLayPdfUrl: opts.khongLayPdfUrl,
      khongTimNguonNhuCau: opts.khongTimNguonNhuCau,
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
        `Nạp stub Radar${kq.dry_run ? ' (dry-run)' : ''}: ứng viên ${kq.tong_ung_vien} (radar: ${kq.thong_ke.tu_radar}, nhu-cau: ${kq.thong_ke.tu_nhu_cau}) · đã tạo ${kq.thong_ke.da_tao} (có PDF bậc A: ${kq.thong_ke.co_pdf_bac_a}) · bỏ qua ${kq.thong_ke.bo_qua}`
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
