#!/usr/bin/env node
// Radar dò văn bản pháp luật XNK/Hải quan mới ban hành từ Công báo điện tử Chính phủ (RSS)
// và cổng Hệ thống văn bản Chính phủ (best-effort), đối chiếu với sổ đăng ký registry/van-ban/*.yaml.
//
// Cách dùng:
//   node tools/radar-luat-moi.mjs [--json] [--markdown <file|->] [--da-bao-json <file>]
//                                 [--offline-rss <file>] [--khong-chan-mang] [--root <dir>]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, khoa, napSo } from './lib/registry.mjs';

export const NGUON_CONG_BAO_RSS = 'https://congbao.chinhphu.vn/cac-van-ban-moi-ban-hanh.rss';
export const NGUON_VAN_BAN_CHINH_PHU = 'https://vanban.chinhphu.vn/';
export const TIMEOUT_MS = 15000;
export const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 oz-wiki-plhq-radar/1.0';

// Từ loại bỏ nếu tiêu đề dính nhóm hành chính/nội bộ/giáo dục/nhân sự ngoài phạm vi hàng hoá XNK.
export const TU_LOAI = [
  'giáo dục',
  'đào tạo',
  'nhân sự',
  'xếp lương',
  'chế độ làm việc',
  'bổ nhiệm',
  'văn hóa',
  'văn hoá',
  'thể thao',
  'nội bộ',
  'tổ chức lại',
  'tổ chức bộ máy',
  'phương tiện thủy nội địa',
  'phương tiện thuỷ nội địa',
  'phân cấp và đóng',
  'hương ước',
  'quy ước',
  'công chứng',
  'biên chế',
  'thi đua',
  'khen thưởng',
  'quy trình vận hành liên hồ chứa',
];

// Từ khoá nhận diện văn bản chạm phạm vi XNK, hải quan, thuế XNK, KTCN, xuất xứ/FTA và hàng hoá chuyên ngành.
export const TU_KHOA = [
  'xuất nhập khẩu',
  'xuất, nhập khẩu',
  'xuất khẩu',
  'nhập khẩu',
  'hải quan',
  'thuế xuất khẩu',
  'thuế nhập khẩu',
  'biểu thuế',
  'thuế chống bán phá giá',
  'phòng vệ thương mại',
  'trị giá hải quan',
  'mã số hàng hóa',
  'mã số hàng hoá',
  'phân loại hàng',
  'kiểm tra chuyên ngành',
  'kiểm dịch',
  'công bố',
  'tiêu chuẩn',
  'quy chuẩn',
  'giấy phép nhập',
  'giấy phép xuất',
  'tạm nhập',
  'tái xuất',
  'quá cảnh',
  'giao thẳng',
  'uỷ thác',
  'ủy thác',
  'xuất xứ',
  'c/o',
  'fta',
  'hàng hóa',
  'hàng hoá',
  'mỹ phẩm',
  'thuốc',
  'dược',
  'thực vật',
  'động vật',
  'gỗ',
  'lâm sản',
  'thủy sản',
  'thuỷ sản',
  'xăng dầu',
  'hoá chất',
  'hóa chất',
  'phân bón',
  'thức ăn',
  'vaccine',
  'vắc xin',
  'thiết bị y tế',
  'an toàn thực phẩm',
  'thương mại biên giới',
  'kho ngoại quan',
  'khu phi thuế quan',
  'cửa khẩu',
];

const TU_KHOA_ASCII_RANH_GIOI = new Set(['fta', 'c/o']);

function giaiMaThucTheXml(text) {
  return String(text || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)));
}

function lamSachVanBan(text) {
  return giaiMaThucTheXml(text)
    .replace(/<[^>]+>/g, ' ')
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .trim();
}

function chuanHoaUrl(url) {
  const s = String(url || '').trim();
  if (!s) return '';
  return s.replace(/\/+$/, '');
}

function chuanHoaSoHieu(raw) {
  if (!raw) return null;
  return String(raw)
    .normalize('NFC')
    .replace(/\s*\/\s*/g, '/')
    .replace(/\s*-\s*/g, '-')
    .replace(/\s+/g, '')
    .replace(/[.,;:]+$/, '')
    .trim();
}

/** Trích số hiệu từ slug URL Công báo / cổng văn bản (.htm/.html). */
export function soHieuTuSlug(url) {
  const raw = String(url || '').trim();
  if (!raw) return null;

  let path = raw;
  try {
    if (/^https?:\/\//i.test(raw)) path = new URL(raw).pathname;
  } catch {
    // Giữ nguyên chuỗi nếu không phải URL đầy đủ.
  }

  // Dạng chuẩn có năm: -so-116-2026-vbhn-tt-nhnn-470863.htm, 82-2026-tt-bxd-470111.htm, 11-2026-qh16-470222.htm, 43-2026-nq-cp-470333.htm
  const mNam = path.match(
    /(?:^|[/-])(?:so-)?(\d{1,5})-((?:19|20)\d{2})-((?:vbhn-)?(?:ttlt|tt|nd|nq|qd|qh\d*|pl|ct|tb|cv|l)(?:-[a-z0-9]+)*?)(?:-\d{4,})?\.html?(?:[?#].*)?$/i
  );
  if (mNam) {
    return `${mNam[1]}/${mNam[2]}/${mNam[3].toUpperCase()}`;
  }

  // Dạng VBHN năm ở cuối: 04-vbhn-bnnmt-2026-470111.htm
  const mVbhnCuoi = path.match(
    /(?:^|[/-])(?:so-)?(\d{1,5})-(vbhn-[a-z0-9-]+?)-((?:19|20)\d{2})(?:-\d{4,})?\.html?(?:[?#].*)?$/i
  );
  if (mVbhnCuoi) {
    return `${mVbhnCuoi[1]}/${mVbhnCuoi[2].toUpperCase()}/${mVbhnCuoi[3]}`;
  }

  // Dạng không có năm trong slug: quyet-dinh-so-2220-qd-ttg-470965.htm
  const mKhongNam = path.match(
    /(?:^|[/-])(?:so-)?(\d{1,5})-((?:vbhn-)?(?:ttlt|tt|nd|nq|qd|ct|tb|cv)-[a-z0-9-]+?)(?:-\d{4,})?\.html?(?:[?#].*)?$/i
  );
  if (mKhongNam) {
    return `${mKhongNam[1]}/${mKhongNam[2].toUpperCase()}`;
  }

  return null;
}

const RE_SO_HIEU_TIEU_DE =
  /(?:^|[^\p{L}\p{N}/-])(\d{1,5}\s*\/\s*(?:(?:19|20)\d{2}\s*\/\s*)?(?:(?:VBHN\s*-\s*)?(?:TTLT|TT|NĐ|ND|NQ|QĐ|QD|PL|CT|TB|CV|L)\s*-\s*[A-ZĐ0-9]+(?:\s*-\s*[A-ZĐ0-9]+)*|QH\d{1,2}))(?=$|[^\p{L}\p{N}-])/giu;

/** Trích tất cả số hiệu văn bản Việt Nam xuất hiện trong đoạn văn bản. */
export function trichTatCaSoHieu(text) {
  const s = String(text || '').normalize('NFC');
  if (!s) return [];
  const ketQua = [];
  const daThay = new Set();
  for (const m of s.matchAll(RE_SO_HIEU_TIEU_DE)) {
    const sh = chuanHoaSoHieu(m[1]);
    if (!sh) continue;
    // Bỏ khớp giả kiểu thường hoàn toàn không viết hoa loại văn bản (vd 12/2026/tt-abc nếu không hợp lệ? Chấp nhận cả hoa/thường nhưng loại trùng).
    const k = khoa(sh);
    if (!daThay.has(k)) {
      daThay.add(k);
      ketQua.push(sh);
    }
  }
  return ketQua;
}

/** Trích số hiệu văn bản từ tiêu đề/mô tả (fallback khi URL không chứa slug số hiệu). */
export function soHieuTuTieuDe(text) {
  const ds = trichTatCaSoHieu(text);
  return ds[0] || null;
}

/** Kiểm tra văn bản có thuộc phạm vi XNK / Hải quan / KTCN / hàng hoá chuyên ngành hay không. */
export function thuocPhamVi(soHieu, moTa) {
  void soHieu;
  const t = String(moTa || '').normalize('NFC').toLowerCase();
  if (!t) return false;
  if (TU_LOAI.some((k) => t.includes(k.normalize('NFC').toLowerCase()))) return false;
  return TU_KHOA.some((k) => {
    const kw = k.normalize('NFC').toLowerCase();
    if (TU_KHOA_ASCII_RANH_GIOI.has(kw)) {
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'u').test(t);
    }
    return t.includes(kw);
  });
}

/** Phân tích RSS của Công báo điện tử Chính phủ thành danh sách mục chuẩn. */
export function docRssCongBao(xml) {
  const out = [];
  const items = String(xml || '').match(/<item\b[^>]*>[\s\S]*?<\/item>/gi) || [];
  for (const it of items) {
    const titleRaw = (it.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '';
    const descRaw = (it.match(/<description\b[^>]*>([\s\S]*?)<\/description>/i) || [])[1] || '';
    const pubRaw = (it.match(/<pubDate\b[^>]*>([\s\S]*?)<\/pubDate>/i) || [])[1] || '';
    const linkRaw = (it.match(/<link\b[^>]*>([\s\S]*?)<\/link>/i) || [])[1] || '';

    const title = lamSachVanBan(titleRaw);
    const desc = lamSachVanBan(descRaw);
    const moTa = desc || title;
    const ngay = lamSachVanBan(pubRaw);
    const url = giaiMaThucTheXml(linkRaw).trim();
    if (!moTa || !url) continue;

    const soHieu = soHieuTuSlug(url) || soHieuTuTieuDe(title) || soHieuTuTieuDe(moTa);
    out.push({
      soHieu,
      moTa,
      ngay,
      url,
      tram: 'congbao',
    });
  }
  return out;
}

function giaiQuyetUrl(href, baseUrl) {
  const raw = giaiMaThucTheXml(href).trim();
  if (!raw || raw.startsWith('#') || /^javascript:/i.test(raw)) return '';
  try {
    return new URL(raw, baseUrl).href;
  } catch {
    return raw;
  }
}

/**
 * Phân tích trang HTML của vanban.chinhphu.vn (trạm phụ best-effort).
 * Hỗ trợ cả cấu trúc bảng chuẩn (`span.code`, `span.issued-date`, `span.substract`, `docid=...`)
 * lẫn các thẻ `<a href="...htm">` hoặc liên kết có số hiệu văn bản.
 */
export function docTrangVanBanChinhPhu(html, baseUrl = NGUON_VAN_BAN_CHINH_PHU) {
  const src = String(html || '');
  if (!src) return [];

  const out = [];
  const daThayUrl = new Set();

  // 1. Cấu trúc bảng văn bản mới trên vanban.chinhphu.vn
  const rows = src.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi) || [];
  for (const row of rows) {
    const codeMatch = row.match(/<span[^>]*class=["'][^"']*\bcode\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);
    const subMatch = row.match(/<span[^>]*class=["'][^"']*\bsubstract\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);
    if (!codeMatch && !subMatch) continue;

    const dateMatch =
      row.match(/<span[^>]*class=["'][^"']*\bissued-date\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i) ||
      row.match(/<span[^>]*class=["'][^"']*\bissue-v2\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);
    const linkMatch =
      row.match(/<a[^>]+href=["']([^"']*docid=[^"']*)["'][^>]*>/i) ||
      row.match(/<a[^>]+href=["']([^"']*\.html?(?:[?#][^"']*)?)["'][^>]*>/i) ||
      row.match(/<a[^>]+href=["']([^"']+)["'][^>]*>/i);

    const url = linkMatch ? giaiQuyetUrl(linkMatch[1], baseUrl) : '';
    const moTa = lamSachVanBan(subMatch?.[1] || '');
    const codeText = lamSachVanBan(codeMatch?.[1] || '');
    const soHieu = soHieuTuTieuDe(codeText) || chuanHoaSoHieu(codeText) || soHieuTuSlug(url) || soHieuTuTieuDe(moTa);
    const ngay = lamSachVanBan(dateMatch?.[1] || '');

    if (!url || (!moTa && !soHieu)) continue;
    const urlKey = chuanHoaUrl(url);
    if (daThayUrl.has(urlKey)) continue;
    daThayUrl.add(urlKey);

    out.push({
      soHieu: soHieu || null,
      moTa: moTa || soHieu,
      ngay,
      url,
      tram: 'vanban_chinhphu',
    });
  }

  // 2. Fallback: các thẻ <a href="..."> trỏ tới .htm hoặc chứa số hiệu văn bản trong tiêu đề
  const anchors = src.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi);
  for (const m of anchors) {
    const url = giaiQuyetUrl(m[1], baseUrl);
    if (!url || /\.(?:pdf|css|js|png|jpe?g|gif|svg|ico|zip)(?:[?#].*)?$/i.test(url)) continue;
    const urlKey = chuanHoaUrl(url);
    if (daThayUrl.has(urlKey)) continue;

    const text = lamSachVanBan(m[2]);
    if (!text || text.length < 5) continue;

    const soTuSlug = soHieuTuSlug(url);
    const soTuText = soHieuTuTieuDe(text);
    const laLinkHtm = /\.html?(?:[?#].*)?$/i.test(url) || /[?&]docid=\d+/i.test(url);

    if (!soTuSlug && !soTuText && !laLinkHtm) continue;
    if (laLinkHtm && !soTuSlug && !soTuText && text.length < 15) continue;

    daThayUrl.add(urlKey);
    out.push({
      soHieu: soTuSlug || soTuText || null,
      moTa: text,
      ngay: '',
      url,
      tram: 'vanban_chinhphu',
    });
  }

  return out;
}

function themUrlTuVanBan(text, urlSet) {
  const matches = String(text || '').matchAll(/https?:\/\/[^\s)\]>,"']+/gi);
  for (const m of matches) {
    const u = chuanHoaUrl(m[0].replace(/[.,;]+$/, ''));
    if (u) urlSet.add(u);
  }
}

function themTuChuoiHoacObj(val, soHieuKhoa, urls) {
  if (!val) return;
  if (typeof val === 'string') {
    const s = val.trim();
    if (!s) return;
    if (/^https?:\/\//i.test(s)) {
      urls.add(chuanHoaUrl(s));
      const slugSo = soHieuTuSlug(s);
      if (slugSo) soHieuKhoa.add(khoa(slugSo));
      return;
    }
    const found = trichTatCaSoHieu(s);
    if (found.length) {
      for (const sh of found) soHieuKhoa.add(khoa(sh));
    } else if (!/\s/.test(s) && /\d/.test(s)) {
      soHieuKhoa.add(khoa(s));
    }
    themUrlTuVanBan(s, urls);
    return;
  }

  if (Array.isArray(val)) {
    for (const item of val) themTuChuoiHoacObj(item, soHieuKhoa, urls);
    return;
  }

  if (typeof val === 'object') {
    for (const field of ['soHieu', 'so_hieu', 'key']) {
      if (typeof val[field] === 'string' && val[field].trim()) {
        if (/^https?:\/\//i.test(val[field].trim())) urls.add(chuanHoaUrl(val[field]));
        else soHieuKhoa.add(khoa(val[field]));
      }
    }
    for (const field of ['url', 'link']) {
      if (typeof val[field] === 'string' && val[field].trim()) {
        urls.add(chuanHoaUrl(val[field]));
        const slugSo = soHieuTuSlug(val[field]);
        if (slugSo) soHieuKhoa.add(khoa(slugSo));
      }
    }
    // Hỗ trợ định dạng GitHub issue { title, body, html_url } (không nhét html_url của issue vào urls văn bản)
    for (const textField of ['title', 'body']) {
      if (typeof val[textField] === 'string' && val[textField]) {
        for (const sh of trichTatCaSoHieu(val[textField])) soHieuKhoa.add(khoa(sh));
        themUrlTuVanBan(val[textField], urls);
      }
    }
  }
}

/**
 * Chuẩn hoá dữ liệu các văn bản đã báo cáo trước đó (mảng số hiệu/URL, map JSON, hoặc danh sách GitHub issue).
 * Trả về `{ soHieuKhoa: Set<string>, urls: Set<string> }`.
 */
export function chuanHoaDaBao(input) {
  const soHieuKhoa = new Set();
  const urls = new Set();
  if (!input) return { soHieuKhoa, urls };

  if (input.soHieuKhoa instanceof Set && input.urls instanceof Set) {
    for (const k of input.soHieuKhoa) soHieuKhoa.add(k);
    for (const u of input.urls) urls.add(chuanHoaUrl(u));
    return { soHieuKhoa, urls };
  }

  if (Array.isArray(input) || typeof input === 'string') {
    themTuChuoiHoacObj(input, soHieuKhoa, urls);
    return { soHieuKhoa, urls };
  }

  if (typeof input === 'object') {
    const coContainer =
      Array.isArray(input.soHieu) ||
      Array.isArray(input.so_hieu) ||
      Array.isArray(input.urls) ||
      Array.isArray(input.items) ||
      Array.isArray(input.issues);
    if (coContainer) {
      themTuChuoiHoacObj(input.soHieu, soHieuKhoa, urls);
      themTuChuoiHoacObj(input.so_hieu, soHieuKhoa, urls);
      themTuChuoiHoacObj(input.urls, soHieuKhoa, urls);
      themTuChuoiHoacObj(input.items, soHieuKhoa, urls);
      themTuChuoiHoacObj(input.issues, soHieuKhoa, urls);
      return { soHieuKhoa, urls };
    }

    // Định dạng object đơn lẻ có trường soHieu/title/body hoặc map { "28/2026/TT-BCT": { ... } }
    if ('title' in input || 'body' in input || 'soHieu' in input || 'so_hieu' in input) {
      themTuChuoiHoacObj(input, soHieuKhoa, urls);
      return { soHieuKhoa, urls };
    }

    for (const [key, val] of Object.entries(input)) {
      themTuChuoiHoacObj(key, soHieuKhoa, urls);
      if (val && typeof val === 'object') themTuChuoiHoacObj(val, soHieuKhoa, urls);
    }
  }

  return { soHieuKhoa, urls };
}

/**
 * Khử trùng lặp theo `khoa(soHieu)` và `url`, phân loại các mục radar thành 4 nhóm:
 * `{ moi, bo_qua_da_co, bo_qua_da_bao, ngoai_pham_vi }`.
 */
export function phanTichMucRadar(items, { so = napSo(), daBao = null } = {}) {
  const daBaoNorm = chuanHoaDaBao(daBao);
  const moi = [];
  const bo_qua_da_co = [];
  const bo_qua_da_bao = [];
  const ngoai_pham_vi = [];

  const daThayKhoa = new Set();
  const daThayUrl = new Set();

  for (const raw of items || []) {
    if (!raw) continue;
    const url = chuanHoaUrl(raw.url);
    const moTa = String(raw.moTa || '').normalize('NFC').trim();
    const soHieu = raw.soHieu || soHieuTuSlug(url) || soHieuTuTieuDe(moTa) || null;
    const k = soHieu ? khoa(soHieu) : null;

    if ((k && daThayKhoa.has(k)) || (url && daThayUrl.has(url))) continue;
    if (k) daThayKhoa.add(k);
    if (url) daThayUrl.add(url);

    const muc = {
      ...raw,
      soHieu,
      khoa: k,
      moTa,
      url,
    };

    if (k && so?.theoKhoa?.has(k)) {
      bo_qua_da_co.push(muc);
      continue;
    }
    if (!thuocPhamVi(soHieu, moTa)) {
      ngoai_pham_vi.push(muc);
      continue;
    }
    if ((k && daBaoNorm.soHieuKhoa.has(k)) || (url && daBaoNorm.urls.has(url))) {
      bo_qua_da_bao.push(muc);
      continue;
    }
    moi.push(muc);
  }

  return { moi, bo_qua_da_co, bo_qua_da_bao, ngoai_pham_vi };
}

/** Xuất báo cáo Markdown tiếng Việt sẵn sàng cho GitHub Issue và `$GITHUB_STEP_SUMMARY`. */
export function dinhDangMarkdownRadar(result) {
  const moi = result?.moi || [];
  const boQuaDaCo = result?.bo_qua_da_co || [];
  const boQuaDaBao = result?.bo_qua_da_bao || [];
  const ngoaiPhamVi = result?.ngoai_pham_vi || [];
  const tramThanhCong = result?.tram_thanh_cong || [];
  const loiTram = result?.loi_tram || [];
  const tongSauTrung = moi.length + boQuaDaCo.length + boQuaDaBao.length + ngoaiPhamVi.length;
  const ngay = (result?.thoi_gian || new Date().toISOString()).slice(0, 10);

  const lines = [
    `## Radar văn bản pháp luật mới (${ngay})`,
    '',
    `- **Tổng mục sau khử trùng**: ${tongSauTrung}`,
    `- **Mới thuộc phạm vi**: ${moi.length}`,
    `- **Đã có trong sổ**: ${boQuaDaCo.length}`,
    `- **Đã báo trước đó**: ${boQuaDaBao.length}`,
    `- **Ngoài phạm vi**: ${ngoaiPhamVi.length}`,
    `- **Trạm thành công**: ${tramThanhCong.length ? tramThanhCong.map((t) => `\`${t}\``).join(', ') : '_không có_'}`,
  ];

  if (loiTram.length) {
    lines.push('');
    lines.push('### Cảnh báo trạm');
    for (const l of loiTram) {
      lines.push(`- \`${l.tram}\` (${l.url}): ${l.loi}`);
    }
  }

  lines.push('');
  lines.push(`### Danh sách văn bản mới thuộc phạm vi (${moi.length})`);
  if (!moi.length) {
    lines.push('_Không phát hiện văn bản mới nào thuộc phạm vi chưa có trong sổ._');
  } else {
    for (const v of moi) {
      const sh = v.soHieu || 'không rõ số';
      const moTa = (v.moTa || '').replace(/\r?\n/g, ' ').trim();
      const meta = [v.ngay || null, v.url ? `[nguồn](${v.url})` : null, v.tram ? `trạm: \`${v.tram}\`` : null]
        .filter(Boolean)
        .join(' · ');
      lines.push(`- [ ] **${sh}** — ${moTa}${meta ? ` (${meta})` : ''}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

async function taiVanBanHttp(url, fetchFn = fetch) {
  const res = await fetchFn(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/rss+xml, application/xml, text/html;q=0.9, */*;q=0.8',
      'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText || ''}`.trim());
  }
  return await res.text();
}

export async function chayRadar({
  root = ROOT,
  daBaoJson = null,
  offlineRss = null,
  fetchFn = fetch,
} = {}) {
  const tram_thanh_cong = [];
  const loi_tram = [];
  const rawItems = [];

  if (offlineRss) {
    const xml = readFileSync(offlineRss, 'utf8');
    rawItems.push(...docRssCongBao(xml));
    tram_thanh_cong.push('congbao_offline');
  } else {
    try {
      const xml = await taiVanBanHttp(NGUON_CONG_BAO_RSS, fetchFn);
      rawItems.push(...docRssCongBao(xml));
      tram_thanh_cong.push('congbao');
    } catch (err) {
      loi_tram.push({
        tram: 'congbao',
        url: NGUON_CONG_BAO_RSS,
        loi: err?.message || String(err),
      });
    }

    try {
      const html = await taiVanBanHttp(NGUON_VAN_BAN_CHINH_PHU, fetchFn);
      rawItems.push(...docTrangVanBanChinhPhu(html, NGUON_VAN_BAN_CHINH_PHU));
      tram_thanh_cong.push('vanban_chinhphu');
    } catch (err) {
      loi_tram.push({
        tram: 'vanban_chinhphu',
        url: NGUON_VAN_BAN_CHINH_PHU,
        loi: err?.message || String(err),
      });
    }
  }

  let daBao = null;
  if (daBaoJson) {
    if (!existsSync(daBaoJson)) {
      throw new Error(`Không tìm thấy tệp --da-bao-json: ${daBaoJson}`);
    }
    daBao = JSON.parse(readFileSync(daBaoJson, 'utf8'));
  }

  const so = napSo(root);
  const kq = phanTichMucRadar(rawItems, { so, daBao });
  const tongSauTrung =
    kq.moi.length + kq.bo_qua_da_co.length + kq.bo_qua_da_bao.length + kq.ngoai_pham_vi.length;

  return {
    thoi_gian: new Date().toISOString(),
    che_do: offlineRss ? 'offline_rss' : 'truc_tiep',
    tram_thanh_cong,
    loi_tram,
    tong_muc_tho: rawItems.length,
    thong_ke: {
      tong_sau_trung: tongSauTrung,
      moi: kq.moi.length,
      bo_qua_da_co: kq.bo_qua_da_co.length,
      bo_qua_da_bao: kq.bo_qua_da_bao.length,
      ngoai_pham_vi: kq.ngoai_pham_vi.length,
    },
    ...kq,
  };
}

export function docThamSoCli(argv) {
  const opts = {
    json: false,
    markdown: null,
    daBaoJson: null,
    offlineRss: null,
    khongChanMang: false,
    root: ROOT,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--json') opts.json = true;
    else if (a === '--khong-chan-mang') opts.khongChanMang = true;
    else if (a === '--help' || a === '-h') opts.help = true;
    else if (a === '--markdown') opts.markdown = argv[++i] ?? '-';
    else if (a === '--da-bao-json') opts.daBaoJson = argv[++i] ?? null;
    else if (a === '--offline-rss') opts.offlineRss = argv[++i] ?? null;
    else if (a === '--root') opts.root = resolve(argv[++i] ?? ROOT);
  }
  return opts;
}

function inBaoCaoVanBan(kq) {
  console.log(
    `Radar (${kq.che_do}): quét ${kq.tong_muc_tho} mục (sau khử trùng ${kq.thong_ke.tong_sau_trung}) · đã có ${kq.thong_ke.bo_qua_da_co} · đã báo ${kq.thong_ke.bo_qua_da_bao} · ngoài phạm vi ${kq.thong_ke.ngoai_pham_vi} · MỚI ${kq.thong_ke.moi}`
  );
  if (kq.loi_tram.length) {
    for (const l of kq.loi_tram) {
      console.error(`[cảnh báo trạm ${l.tram}] ${l.loi}`);
    }
  }
  for (const v of kq.moi) {
    console.log(`[mới] ${v.soHieu || '(không rõ số)'} — ${v.moTa.slice(0, 110)} (${v.tram})`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const opts = docThamSoCli(process.argv.slice(2));
  if (opts.help) {
    console.log(
      'Cách dùng: node tools/radar-luat-moi.mjs [--json] [--markdown <file|->] [--da-bao-json <file>] [--offline-rss <file>] [--khong-chan-mang] [--root <dir>]'
    );
    process.exit(0);
  }

  try {
    const kq = await chayRadar({
      root: opts.root,
      daBaoJson: opts.daBaoJson,
      offlineRss: opts.offlineRss,
    });

    if (opts.markdown) {
      const md = dinhDangMarkdownRadar(kq);
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
      inBaoCaoVanBan(kq);
    }

    const toanBoTramLoi = !opts.offlineRss && kq.tram_thanh_cong.length === 0 && kq.loi_tram.length > 0;
    if (toanBoTramLoi && !opts.khongChanMang) {
      process.exit(1);
    }
  } catch (err) {
    console.error(`LỖI: ${err.message}`);
    process.exit(1);
  }
}
