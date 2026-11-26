#!/usr/bin/env node
// Radar dò văn bản pháp luật XNK/Hải quan mới ban hành từ 5 trạm nguồn bậc A:
//   1. Công báo điện tử Chính phủ (RSS)
//   2. Hệ thống văn bản Chính phủ (vanban.chinhphu.vn)
//   3. Cổng VBPL Bộ Công Thương (moit.gov.vn)
//   4. Cục Phòng vệ thương mại (pvtm.gov.vn)
//   5. Cổng Hải quan Việt Nam (customs.gov.vn)
// Đối chiếu với sổ đăng ký registry/van-ban/*.yaml, sổ loại trừ data/radar-bo-qua.json
// và danh sách GitHub issue đã báo.
//
// Cách dùng:
//   node tools/radar-luat-moi.mjs [--json] [--markdown <file|->] [--da-bao-json <file>]
//                                 [--bo-qua-json <file>] [--offline-rss <file>] [--khong-chan-mang] [--root <dir>]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, khoa, napSo } from './lib/registry.mjs';

export const NGUON_CONG_BAO_RSS = 'https://congbao.chinhphu.vn/cac-van-ban-moi-ban-hanh.rss';
export const NGUON_VAN_BAN_CHINH_PHU = 'https://vanban.chinhphu.vn/';
export const NGUON_MOIT_VBPL_PHAP_QUY = 'https://moit.gov.vn/van-ban-phap-luat/van-ban-phap-quy';
export const NGUON_MOIT_VBPL = 'https://moit.gov.vn/van-ban-phap-luat';
export const NGUON_PVTM = 'https://pvtm.gov.vn/?page=news&do=browse&category_id=91b07cf1-3658-4f39-b688-73b9e8ff8a05';
export const NGUON_HAI_QUAN = 'https://www.customs.gov.vn/';
export const TIMEOUT_MS = 15000;
export const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 oz-wiki-plhq-radar/2.0';

// Từ loại bỏ nếu tiêu đề dính nhóm hành chính/ngân sách/đấu thầu/nhân sự ngoài phạm vi hàng hoá XNK.
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
  'trợ giúp pháp lý',
  'dữ liệu mở',
  'dự toán thu, chi ngân sách',
  'mời thầu',
  'lựa chọn nhà thầu',
  'báo giá gói thầu',
  'quy hoạch thăm dò',
  'kiện toàn ban chỉ đạo',
  'điều hành giá bán xăng dầu',
];

// Từ khoá nhận diện văn bản chạm phạm vi XNK, hải quan, thuế XNK, KTCN, xuất xứ/FTA, PVTM và hàng hoá chuyên ngành.
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
  'chống bán phá giá',
  'chống trợ cấp',
  'biện pháp tự vệ',
  'phòng vệ thương mại',
  'trị giá hải quan',
  'mã số hàng hóa',
  'mã số hàng hoá',
  'phân loại hàng',
  'kiểm tra chuyên ngành',
  'kiểm dịch',
  'công bố hợp quy',
  'công bố hợp chuẩn',
  'tự công bố',
  'công bố sản phẩm',
  'công bố mỹ phẩm',
  'công bố lưu hành',
  'công bố tiêu chuẩn áp dụng',
  'bản công bố',
  'tiếp nhận công bố',
  'phiếu công bố',
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
const VBHN_LOAI_CON = ['TTLT', 'TT', 'ND', 'NQ', 'QD', 'PL', 'CT', 'L'];
const CO_QUAN_CONG_VAN =
  '(?:BCT|BTC|TCHQ|CHQ|BYT|BNNMT|BNNPTNT|BTNMT|BKHCN|BTTTT|BXD|BGTVT|BNV|BLDTBXH|BCA|BQP|BVHTTDL|NHNN|VPCP|BNG)';

function giaiMaThucTheXml(text) {
  return String(text || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/&acirc;/gi, 'â')
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
  const cleaned = String(raw)
    .normalize('NFC')
    .replace(/^\s*s[ốo]\s*:?\s*/iu, '')
    .replace(/\s*\/\s*/g, '/')
    .replace(/\s*-\s*/g, '-')
    .replace(/\s+/g, '')
    .replace(/[.,;:]+$/, '')
    .trim();
  return cleaned || null;
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

  // Dạng không có năm trong slug ở cuối: quyet-dinh-so-2220-qd-ttg-470965.htm
  const mKhongNam = path.match(
    /(?:^|[/-])(?:so-)?(\d{1,5})-((?:vbhn-)?(?:ttlt-[a-z0-9]+|tt|nd|nq|qd|ct|tb|cv)-[a-z0-9]+)(?:-\d{4,})?\.html?(?:[?#].*)?$/i
  );
  if (mKhongNam) {
    return `${mKhongNam[1]}/${mKhongNam[2].toUpperCase()}`;
  }

  // Dạng slug cổng Bộ Công Thương / các bộ chứa số hiệu ở đầu hoặc sau `-so-`:
  // vd: quyet-dinh-so-2991-qd-bct-ban-hanh-ke-hoach...html, van-ban-so-9846-bct-tttn-ve-viec...html
  const mGiuaSlug = path.match(
    new RegExp(
      `(?:^|[/-])so-(\\d{1,5})-(?:((?:19|20)\\d{2})-)?((?:vbhn-)?(?:ttlt|tt|nd|nq|qd|ct|tb|cv)-[a-z0-9]+|${CO_QUAN_CONG_VAN}-[a-z0-9]+)(?=-|\\.html?$)`,
      'i'
    )
  );
  if (mGiuaSlug) {
    return mGiuaSlug[2]
      ? `${mGiuaSlug[1]}/${mGiuaSlug[2]}/${mGiuaSlug[3].toUpperCase()}`
      : `${mGiuaSlug[1]}/${mGiuaSlug[3].toUpperCase()}`;
  }

  return null;
}

const RE_SO_HIEU_TIEU_DE = new RegExp(
  `(?:^|[^\\p{L}\\p{N}/-])(\\d{1,5}\\s*\\/\\s*(?:(?:19|20)\\d{2}\\s*\\/\\s*)?(?:(?:VBHN\\s*-\\s*)?(?:TTLT|TT|NĐ|ND|NQ|QĐ|QD|PL|CT|TB|CV|L)\\s*-\\s*[A-ZĐ0-9]+(?:\\s*-\\s*[A-ZĐ0-9]+)*|QH\\d{1,2}|${CO_QUAN_CONG_VAN}\\s*-\\s*[A-ZĐ0-9]+))(?=$|[^\\p{L}\\p{N}-])`,
  'giu'
);

/** Trích tất cả số hiệu văn bản Việt Nam xuất hiện trong đoạn văn bản. */
export function trichTatCaSoHieu(text) {
  const s = String(text || '').normalize('NFC');
  if (!s) return [];
  const ketQua = [];
  const daThay = new Set();
  for (const m of s.matchAll(RE_SO_HIEU_TIEU_DE)) {
    const sh = chuanHoaSoHieu(m[1]);
    if (!sh) continue;
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

function trichNamTuSoHieu(soHieu) {
  const m = String(soHieu || '').match(/\/((?:19|20)\d{2})(?:\/|$)/);
  return m ? m[1] : null;
}

function trichNamTuNgay(ngay) {
  const m = String(ngay || '').match(/(?:^|\D)((?:19|20)\d{2})(?=\D|$)/);
  return m ? m[1] : null;
}

/**
 * Sinh các biến thể khoá số hiệu tương đương (thêm/bớt năm cho QĐ/NQ/TB/VBHN
 * và chuyển đổi qua lại `VBHN-TT-<BỘ>` ↔ `VBHN-<BỘ>`) khi suy được năm 4 chữ số.
 */
export function sinhBienTheKhoaSoHieu(soHieu, ngay = '') {
  const goc = khoa(soHieu);
  const ketQua = new Set();
  if (!goc) return ketQua;

  const nam = trichNamTuSoHieu(goc) || trichNamTuNgay(ngay);
  const hatGiong = new Set([goc]);

  // Mở rộng chiều VBHN-TT-BO <-> VBHN-BO trên khoá gốc trước khi thêm/bớt năm
  for (const item of [...hatGiong]) {
    const rutGonVbhn = item.replace(/\/VBHN-(?:TTLT|TT|ND|NQ|QD|PL|CT|L)-([A-Z0-9-]+)$/, '/VBHN-$1')
      .replace(/\/VBHN-(?:TTLT|TT|ND|NQ|QD|PL|CT|L)-([A-Z0-9-]+)\/((?:19|20)\d{2})$/, '/VBHN-$1/$2');
    if (rutGonVbhn !== item) hatGiong.add(rutGonVbhn);

    const mVbhnNgan = item.match(/^(\d+(?:\/(?:19|20)\d{2})?)\/VBHN-([A-Z0-9-]+?)(\/(?:19|20)\d{2})?$/);
    if (mVbhnNgan && !/^(?:TTLT|TT|ND|NQ|QD|PL|CT|L)-/.test(mVbhnNgan[2])) {
      for (const loaiCon of VBHN_LOAI_CON) {
        hatGiong.add(`${mVbhnNgan[1]}/VBHN-${loaiCon}-${mVbhnNgan[2]}${mVbhnNgan[3] || ''}`);
      }
    }
  }

  for (const s of hatGiong) {
    ketQua.add(s);

    // Bỏ năm ở giữa: 2017/2026/QD-BTC -> 2017/QD-BTC
    const boNamGiua = s.replace(/^(\d+)\/((?:19|20)\d{2})\/(.+)$/, '$1/$3');
    if (boNamGiua !== s) ketQua.add(boNamGiua);

    // Bỏ năm ở cuối: 4138/TB-TCHQ/2026 -> 4138/TB-TCHQ
    const boNamCuoi = s.replace(/^(\d+\/[A-Z0-9-]+)\/((?:19|20)\d{2})$/, '$1');
    if (boNamCuoi !== s) ketQua.add(boNamCuoi);

    // Chèn năm nếu phần sau số thứ tự chưa có năm (lưu ý: số thứ tự đầu như 2017/QD-BTC KHÔNG phải năm!)
    const baseKhongNam = boNamGiua !== s ? boNamGiua : (boNamCuoi !== s ? boNamCuoi : s);
    if (nam && !/\/(?:19|20)\d{2}(?:\/|$)/.test(baseKhongNam)) {
      const m = baseKhongNam.match(/^(\d+)\/([A-Z0-9-]+)$/);
      if (m) {
        ketQua.add(`${m[1]}/${nam}/${m[2]}`);
        ketQua.add(`${m[1]}/${m[2]}/${nam}`);
      }
    }
  }

  return ketQua;
}

/**
 * Kiểm tra văn bản đã có trong `so` (`napSo()`) hay chưa, tính cả biến thể có/không năm
 * (`2017/QĐ-BTC` ngày `15/10/2026` ↔ `2017/2026/QĐ-BTC`) và `VBHN-TT-<BỘ>` ↔ `VBHN-<BỘ>`.
 */
export function daCoTrongSo(soHieu, ngay, so) {
  if (!soHieu || !so?.theoKhoa) return false;
  const kGoc = khoa(soHieu);
  if (!kGoc) return false;
  if (so.theoKhoa.has(kGoc)) return true;

  const namUngVien = trichNamTuSoHieu(kGoc) || trichNamTuNgay(ngay);
  const bienThe = sinhBienTheKhoaSoHieu(soHieu, ngay);
  for (const vk of bienThe) {
    if (vk === kGoc) continue;
    const ds = so.theoKhoa.get(vk);
    if (!ds || ds.length === 0) continue;

    // Nếu biến thể khớp đã mang sẵn năm sau dấu '/' (vd 2017/2026/QD-BTC) thì chắc chắn cùng năm
    if (/\/(?:19|20)\d{2}(?:\/|$)/.test(vk)) return true;

    // Nếu biến thể khớp không mang năm trong số hiệu (vd sổ lưu 2017/QĐ-BTC),
    // đối chiếu năm của ngay_ban_hanh trong sổ để tránh trùng nhầm quyết định khác năm.
    const khopNam = ds.some((doc) => {
      const namTrongSo = trichNamTuSoHieu(khoa(doc?.so_hieu || '')) || trichNamTuNgay(doc?.ngay_ban_hanh);
      return !namUngVien || !namTrongSo || namUngVien === namTrongSo;
    });
    if (khopNam) return true;
  }

  return false;
}

/** Kiểm tra văn bản có thuộc phạm vi XNK / Hải quan / KTCN / PVTM / hàng hoá chuyên ngành hay không. */
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
  if (!raw || raw.startsWith('#') || /^javascript:/i.test(raw) || /^mailto:/i.test(raw)) return '';
  try {
    return new URL(raw, baseUrl).href;
  } catch {
    return raw;
  }
}

/**
 * Phân tích trang HTML của vanban.chinhphu.vn.
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

/**
 * Phân tích trang Văn bản pháp luật của Bộ Công Thương (`moit.gov.vn/van-ban-phap-luat*`).
 * Trích cả bảng chuẩn (`STT | Tên văn bản | Số hiệu | Ngày ban hành | File đính kèm`)
 * lẫn các thẻ `<a href="/van-ban-phap-luat/...html">` (`TT-BCT`, `QĐ-BCT`, `VBHN-BCT`, `BCT-*`).
 */
export function docTrangMoit(html, baseUrl = NGUON_MOIT_VBPL) {
  const src = String(html || '');
  if (!src) return [];

  const out = [];
  const daThayUrl = new Set();

  // 1. Cấu trúc bảng văn bản trên moit.gov.vn
  const rows = src.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi) || [];
  for (const row of rows) {
    if (/<th\b/i.test(row)) continue;
    const tds = [...row.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map((m) => m[1]);
    if (tds.length < 2) continue;

    const linkMatch =
      row.match(/<a\b([^>]*href=["']([^"']*\/van-ban-phap-luat\/[^"']+\.html?(?:[?#][^"']*)?)["'][^>]*)>([\s\S]*?)<\/a>/i) ||
      row.match(/<a\b([^>]*href=["']([^"']+\.html?(?:[?#][^"']*)?)["'][^>]*)>([\s\S]*?)<\/a>/i);
    if (!linkMatch) continue;

    const attrStr = linkMatch[1] || '';
    const href = linkMatch[2] || '';
    const innerText = lamSachVanBan(linkMatch[3] || '');
    const titleAttr = lamSachVanBan((attrStr.match(/\btitle=["']([^"']+)["']/i) || [])[1] || '');
    const moTa = titleAttr.length > innerText.length ? titleAttr : innerText;
    const url = giaiQuyetUrl(href, baseUrl);
    if (!url || !moTa) continue;

    const urlKey = chuanHoaUrl(url);
    if (daThayUrl.has(urlKey)) continue;

    const pdfHref = (row.match(/<a\b[^>]*href=["']([^"']+\.pdf(?:\?[^"']*)?)["']/i) || [])[1] || '';
    const pdfUrl = pdfHref ? giaiQuyetUrl(pdfHref, baseUrl) : '';

    // Cột Số hiệu thường ở td[2], Ngày ban hành ở td[3]
    const soHieuCell = tds.length >= 3 ? lamSachVanBan(tds[2]) : '';
    const ngayCell = tds.length >= 4 ? lamSachVanBan(tds[3]) : '';
    const ngay =
      (ngayCell.match(/\b\d{1,2}[/-]\d{1,2}[/-](?:19|20)\d{2}\b/) || [])[0] ||
      (lamSachVanBan(row).match(/\b\d{1,2}[/-]\d{1,2}[/-](?:19|20)\d{2}\b/) || [])[0] ||
      '';

    const soHieu =
      soHieuTuTieuDe(soHieuCell) ||
      (soHieuCell && /\d/.test(soHieuCell) ? chuanHoaSoHieu(soHieuCell) : null) ||
      soHieuTuSlug(url) ||
      soHieuTuTieuDe(moTa) ||
      null;

    daThayUrl.add(urlKey);
    out.push({
      soHieu,
      moTa,
      ngay,
      url,
      ...(pdfUrl ? { pdfUrl } : {}),
      tram: 'moit_vbpl',
    });
  }

  // 2. Fallback: các thẻ <a href="/van-ban-phap-luat/...html"> ngoài bảng
  const anchors = src.matchAll(/<a\b([^>]*href=["']([^"']+)["'][^>]*)>([\s\S]*?)<\/a>/gi);
  for (const m of anchors) {
    const attrStr = m[1] || '';
    const href = m[2] || '';
    const url = giaiQuyetUrl(href, baseUrl);
    if (!url || !/\/van-ban-phap-luat\/.+\.html?(?:[?#].*)?$/i.test(url)) continue;

    const urlKey = chuanHoaUrl(url);
    if (daThayUrl.has(urlKey)) continue;

    const innerText = lamSachVanBan(m[3] || '');
    const titleAttr = lamSachVanBan((attrStr.match(/\btitle=["']([^"']+)["']/i) || [])[1] || '');
    const moTa = titleAttr.length > innerText.length ? titleAttr : innerText;
    if (!moTa || moTa.length < 15) continue;

    const soHieu = soHieuTuSlug(url) || soHieuTuTieuDe(moTa) || null;
    daThayUrl.add(urlKey);
    out.push({
      soHieu,
      moTa,
      ngay: '',
      url,
      tram: 'moit_vbpl',
    });
  }

  return out;
}

const RE_TU_KHOA_PVTM =
  /QĐ-BCT|QD-BCT|TT-BCT|chống bán phá giá|phòng vệ thương mại|tự vệ|chống trợ cấp|rà soát|miễn trừ/iu;

function laUrlDanhMucPvtm(url) {
  if (!url) return true;
  if (/[?&]do=browse\b/i.test(url)) return true;
  if (/[?&]page=(?:about|lead|structure|case-prosecute|case-appeal|case-dispute|procedure|newsletter|document|csdl)\b/i.test(url)) {
    return true;
  }
  if (/[?&]page=legal\b/i.test(url) && !/[?&](?:do=detail|id=)/i.test(url)) return true;
  return false;
}

/**
 * Phân tích trang Cục Phòng vệ thương mại (`pvtm.gov.vn`).
 * Hỗ trợ khối `.news__body` kèm ngày đăng `.news__info` và các liên kết `default.aspx?page=news-detail...`
 * hoặc liên kết bài chi tiết có nhắc `QĐ-BCT`, chống bán phá giá, phòng vệ thương mại, tự vệ, chống trợ cấp, rà soát, miễn trừ.
 */
export function docTrangPvtm(html, baseUrl = 'https://pvtm.gov.vn/') {
  const src = String(html || '');
  if (!src) return [];

  const out = [];
  const daThayUrl = new Set();

  // 1. Khối danh sách tin chuẩn `.news__body` (có ngày phát hành trong `.news__info`)
  const blocks = src.matchAll(
    /<div[^>]*class=["'][^"']*\bnews__body\b[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi
  );
  for (const bm of blocks) {
    const block = bm[1] || '';
    const titleLink =
      block.match(/<h[1-6][^>]*class=["'][^"']*\bnews__title\b[^"']*["'][^>]*>[\s\S]*?<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i) ||
      block.match(/<a\b[^>]*href=["']([^"']*news-detail[^"']*)["'][^>]*>([\s\S]*?)<\/a>/i);
    if (!titleLink) continue;

    const url = giaiQuyetUrl(titleLink[1], baseUrl);
    if (!url || laUrlDanhMucPvtm(url)) continue;
    const moTa = lamSachVanBan(titleLink[2]);
    if (!moTa || moTa.length < 12) continue;

    const urlKey = chuanHoaUrl(url);
    if (daThayUrl.has(urlKey)) continue;

    const dateMatch = block.match(/\b(\d{1,2}[/-]\d{1,2}[/-](?:19|20)\d{2})\b/);
    const ngay = dateMatch ? dateMatch[1] : '';
    const soHieu = soHieuTuTieuDe(moTa) || soHieuTuSlug(url) || null;

    daThayUrl.add(urlKey);
    out.push({
      soHieu,
      moTa,
      ngay,
      url,
      tram: 'pvtm',
    });
  }

  // 2. Fallback: các liên kết chi tiết `news-detail` / `do=detail` hoặc chứa từ khoá PVTM
  const anchors = src.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi);
  for (const m of anchors) {
    const rawHref = m[1] || '';
    const url = giaiQuyetUrl(rawHref, baseUrl);
    if (!url || laUrlDanhMucPvtm(url)) continue;
    if (/\.(?:css|js|png|jpe?g|gif|svg|ico|zip)(?:[?#].*)?$/i.test(url)) continue;

    const urlKey = chuanHoaUrl(url);
    if (daThayUrl.has(urlKey)) continue;

    const moTa = lamSachVanBan(m[2]);
    if (!moTa || moTa.length < 15) continue;

    const laLinkChiTiet =
      /news-detail/i.test(url) ||
      /[?&]do=detail\b/i.test(url) ||
      /\.(?:html?|pdf)(?:[?#].*)?$/i.test(url);
    const khopTuKhoaPvtm = RE_TU_KHOA_PVTM.test(moTa) || Boolean(soHieuTuTieuDe(moTa));
    if (!laLinkChiTiet || (!khopTuKhoaPvtm && !/news-detail/i.test(url))) continue;

    const soHieu = soHieuTuTieuDe(moTa) || soHieuTuSlug(url) || null;
    daThayUrl.add(urlKey);
    out.push({
      soHieu,
      moTa,
      ngay: '',
      url,
      tram: 'pvtm',
    });
  }

  return out;
}

/** Nhận diện vỏ SPA rỗng của Cổng Hải quan (`<div id="main"></div>` chưa render dữ liệu SSR). */
export function laVoSpaHaiQuan(payload) {
  if (typeof payload !== 'string') return false;
  const s = payload.trim();
  if (!s || s.startsWith('{') || s.startsWith('[')) return false;
  const coMainRong = /<div[^>]+id=["']main["'][^>]*>\s*<\/div>/i.test(s);
  const coBridgeSpa = /bridge\?url=/i.test(s) && /GetPageControl/i.test(s);
  return coMainRong || coBridgeSpa;
}

function trichDanhSachJsonHaiQuan(parsed) {
  if (Array.isArray(parsed)) return parsed;
  if (!parsed || typeof parsed !== 'object') return null;
  for (const key of ['items', 'data', 'd', 'rows', 'list', 'van_ban', 'results']) {
    if (Array.isArray(parsed[key])) return parsed[key];
    if (parsed[key] && typeof parsed[key] === 'object' && Array.isArray(parsed[key].items)) {
      return parsed[key].items;
    }
  }
  return null;
}

/**
 * Phân tích dữ liệu từ Cổng Hải quan (`customs.gov.vn`).
 * Hỗ trợ cả JSON list payload (`{ so_hieu, noi_dung_tom_tat, ngay_ban_hanh, url_chi_tiet, pdf_url_primary }`)
 * lẫn bảng/liên kết HTML SSR.
 */
export function docTrangHaiQuan(payload, baseUrl = NGUON_HAI_QUAN) {
  if (!payload) return [];

  let parsedJson = null;
  if (typeof payload === 'object') {
    parsedJson = payload;
  } else if (typeof payload === 'string') {
    const trimmed = payload.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        parsedJson = JSON.parse(trimmed);
      } catch {
        parsedJson = null;
      }
    }
  }

  const out = [];
  const daThayKey = new Set();

  const jsonArr = trichDanhSachJsonHaiQuan(parsedJson);
  if (jsonArr) {
    for (const it of jsonArr) {
      if (!it || typeof it !== 'object') continue;
      const rawSo = it.so_hieu ?? it.soHieu ?? it.so_van_ban ?? it.soVanBan ?? it.code ?? '';
      const rawMoTa =
        it.noi_dung_tom_tat ??
        it.trich_yeu ??
        it.mo_ta ??
        it.moTa ??
        it.ten ??
        it.title ??
        it.summary ??
        '';
      const rawNgay = it.ngay_ban_hanh ?? it.ngayBanHanh ?? it.ngay ?? it.issued_date ?? '';
      const rawUrl = it.url_chi_tiet ?? it.url ?? it.link ?? '';
      const rawPdf = it.pdf_url_primary ?? it.pdf_url ?? it.pdfUrl ?? it.file_url ?? '';

      const pdfUrl = rawPdf ? giaiQuyetUrl(String(rawPdf), baseUrl) : '';
      const url = giaiQuyetUrl(String(rawUrl || rawPdf || ''), baseUrl);
      const moTa = lamSachVanBan(rawMoTa);
      const soHieu =
        soHieuTuTieuDe(String(rawSo)) ||
        chuanHoaSoHieu(String(rawSo)) ||
        soHieuTuSlug(url) ||
        soHieuTuTieuDe(moTa) ||
        null;

      if (!url || (!moTa && !soHieu)) continue;
      const dedupKey = chuanHoaUrl(url) || (soHieu ? khoa(soHieu) : '');
      if (dedupKey && daThayKey.has(dedupKey)) continue;
      if (dedupKey) daThayKey.add(dedupKey);

      out.push({
        soHieu,
        moTa: moTa || soHieu,
        ngay: lamSachVanBan(rawNgay),
        url,
        ...(pdfUrl ? { pdfUrl } : {}),
        tram: 'customs',
      });
    }
    return out;
  }

  if (typeof payload !== 'string') return [];
  const src = payload;

  // 1. Dạng bảng HTML SSR nếu cổng render danh sách văn bản
  const rows = src.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi) || [];
  for (const row of rows) {
    if (/<th\b/i.test(row)) continue;
    const tds = [...row.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map((m) => m[1]);
    if (tds.length < 2) continue;

    const linkMatch = row.match(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i);
    if (!linkMatch) continue;

    const url = giaiQuyetUrl(linkMatch[1], baseUrl);
    if (!url) continue;
    const urlKey = chuanHoaUrl(url);
    if (daThayKey.has(urlKey)) continue;

    const pdfHref = (row.match(/<a\b[^>]*href=["']([^"']+\.pdf(?:\?[^"']*)?)["']/i) || [])[1] || '';
    const pdfUrl = pdfHref ? giaiQuyetUrl(pdfHref, baseUrl) : '';
    const rowText = lamSachVanBan(row);
    const anchorText = lamSachVanBan(linkMatch[2]);
    const moTa = anchorText.length >= 10 ? anchorText : rowText;
    const ngay = (rowText.match(/\b\d{1,2}[/-]\d{1,2}[/-](?:19|20)\d{2}\b/) || [])[0] || '';
    const soHieu = soHieuTuTieuDe(rowText) || soHieuTuSlug(url) || null;
    if (!soHieu && !moTa) continue;

    daThayKey.add(urlKey);
    out.push({
      soHieu,
      moTa: moTa || soHieu,
      ngay,
      url,
      ...(pdfUrl ? { pdfUrl } : {}),
      tram: 'customs',
    });
  }

  // 2. Fallback các thẻ <a> SSR có số hiệu hoặc liên kết chi tiết văn bản
  const anchors = src.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi);
  for (const m of anchors) {
    const url = giaiQuyetUrl(m[1], baseUrl);
    if (!url || /\.(?:css|js|png|jpe?g|gif|svg|ico|zip)(?:[?#].*)?$/i.test(url)) continue;
    const urlKey = chuanHoaUrl(url);
    if (daThayKey.has(urlKey)) continue;

    const moTa = lamSachVanBan(m[2]);
    if (!moTa || moTa.length < 10) continue;

    const soHieu = soHieuTuSlug(url) || soHieuTuTieuDe(moTa) || null;
    const laChiTiet = /(?:pageId=3\b|van-ban|thong-bao|\.html?(?:$|[?#])|\.pdf(?:$|[?#]))/i.test(url);
    if (!soHieu && !laChiTiet) continue;
    if (!soHieu && moTa.length < 15) continue;

    daThayKey.add(urlKey);
    out.push({
      soHieu,
      moTa,
      ngay: '',
      url,
      ...( /\.pdf(?:$|[?#])/i.test(url) ? { pdfUrl: url } : {} ),
      tram: 'customs',
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
 * Chuẩn hoá dữ liệu các văn bản đã báo cáo hoặc sổ loại trừ (`muc`, `items`, `issues`, mảng, map JSON).
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
      Array.isArray(input.muc) ||
      Array.isArray(input.soHieu) ||
      Array.isArray(input.so_hieu) ||
      Array.isArray(input.urls) ||
      Array.isArray(input.items) ||
      Array.isArray(input.issues);
    if (coContainer) {
      themTuChuoiHoacObj(input.muc, soHieuKhoa, urls);
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
      if (key === 'mo_ta' && typeof val === 'string') continue;
      themTuChuoiHoacObj(key, soHieuKhoa, urls);
      if (val && typeof val === 'object') themTuChuoiHoacObj(val, soHieuKhoa, urls);
    }
  }

  return { soHieuKhoa, urls };
}

function khopTapSoHieuHoacUrl(soHieu, ngay, url, tapNorm) {
  if (url && tapNorm.urls.has(url)) return true;
  if (!soHieu) return false;
  const k = khoa(soHieu);
  if (k && tapNorm.soHieuKhoa.has(k)) return true;
  for (const vk of sinhBienTheKhoaSoHieu(soHieu, ngay)) {
    if (tapNorm.soHieuKhoa.has(vk)) return true;
  }
  return false;
}

/**
 * Khử trùng lặp theo `khoa(soHieu)` và `url`, phân loại các mục radar thành 5 nhóm:
 * `{ moi, bo_qua_da_co, bo_qua_da_bao, bo_qua_loai_tru, ngoai_pham_vi }`.
 */
export function phanTichMucRadar(items, { so = napSo(), daBao = null, boQua = null } = {}) {
  const daBaoNorm = chuanHoaDaBao(daBao);
  const boQuaNorm = chuanHoaDaBao(boQua);
  const moi = [];
  const bo_qua_da_co = [];
  const bo_qua_da_bao = [];
  const bo_qua_loai_tru = [];
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

    if (soHieu && daCoTrongSo(soHieu, muc.ngay, so)) {
      bo_qua_da_co.push(muc);
      continue;
    }
    if (khopTapSoHieuHoacUrl(soHieu, muc.ngay, url, boQuaNorm)) {
      bo_qua_loai_tru.push(muc);
      continue;
    }
    if (!thuocPhamVi(soHieu, moTa)) {
      ngoai_pham_vi.push(muc);
      continue;
    }
    if (khopTapSoHieuHoacUrl(soHieu, muc.ngay, url, daBaoNorm)) {
      bo_qua_da_bao.push(muc);
      continue;
    }
    moi.push(muc);
  }

  return { moi, bo_qua_da_co, bo_qua_da_bao, bo_qua_loai_tru, ngoai_pham_vi };
}

/** Xuất báo cáo Markdown tiếng Việt sẵn sàng cho GitHub Issue và `$GITHUB_STEP_SUMMARY`. */
export function dinhDangMarkdownRadar(result) {
  const moi = result?.moi || [];
  const boQuaDaCo = result?.bo_qua_da_co || [];
  const boQuaDaBao = result?.bo_qua_da_bao || [];
  const boQuaLoaiTru = result?.bo_qua_loai_tru || [];
  const ngoaiPhamVi = result?.ngoai_pham_vi || [];
  const tramThanhCong = result?.tram_thanh_cong || [];
  const loiTram = result?.loi_tram || [];
  const canhBaoTram = result?.canh_bao_tram || [];
  const tongSauTrung =
    moi.length + boQuaDaCo.length + boQuaDaBao.length + boQuaLoaiTru.length + ngoaiPhamVi.length;
  const ngay = (result?.thoi_gian || new Date().toISOString()).slice(0, 10);

  const lines = [
    `## Radar văn bản pháp luật mới (${ngay})`,
    '',
    `- **Tổng mục sau khử trùng**: ${tongSauTrung}`,
    `- **Mới thuộc phạm vi**: ${moi.length}`,
    `- **Đã có trong sổ**: ${boQuaDaCo.length}`,
    `- **Đã báo trước đó**: ${boQuaDaBao.length}`,
    `- **Đã loại trừ (sổ bỏ qua)**: ${boQuaLoaiTru.length}`,
    `- **Ngoài phạm vi**: ${ngoaiPhamVi.length}`,
    `- **Trạm thành công**: ${tramThanhCong.length ? tramThanhCong.map((t) => `\`${t}\``).join(', ') : '_không có_'}`,
  ];

  const dsCanhBao = [];
  const seenCanhBao = new Set();
  for (const item of [...loiTram, ...canhBaoTram]) {
    if (!item) continue;
    const key = `${item.tram}|${item.url}|${item.loi}`;
    if (seenCanhBao.has(key)) continue;
    seenCanhBao.add(key);
    dsCanhBao.push(item);
  }

  if (dsCanhBao.length) {
    lines.push('');
    lines.push('### Cảnh báo trạm');
    for (const l of dsCanhBao) {
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
      Accept: 'application/rss+xml, application/xml, application/json, text/html;q=0.9, */*;q=0.8',
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
  boQua = undefined,
  boQuaJson = undefined,
  offlineRss = null,
  fetchFn = fetch,
} = {}) {
  const tram_thanh_cong = [];
  const loi_tram = [];
  const canh_bao_tram = [];
  const rawItems = [];

  if (offlineRss) {
    const xml = readFileSync(offlineRss, 'utf8');
    rawItems.push(...docRssCongBao(xml));
    tram_thanh_cong.push('congbao_offline');
  } else {
    // Trạm 1: Công báo Chính phủ (RSS)
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

    // Trạm 2: Hệ thống văn bản Chính phủ
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

    // Trạm 3: Cổng VBPL Bộ Công Thương (pháp quy + tổng hợp)
    {
      let moitOk = false;
      const moitErrors = [];
      for (const moitUrl of [NGUON_MOIT_VBPL_PHAP_QUY, NGUON_MOIT_VBPL]) {
        try {
          const html = await taiVanBanHttp(moitUrl, fetchFn);
          rawItems.push(...docTrangMoit(html, moitUrl));
          moitOk = true;
        } catch (err) {
          moitErrors.push({ url: moitUrl, loi: err?.message || String(err) });
        }
      }
      if (moitOk) {
        tram_thanh_cong.push('moit_vbpl');
        for (const e of moitErrors) {
          canh_bao_tram.push({ tram: 'moit_vbpl', url: e.url, loi: e.loi });
        }
      } else if (moitErrors.length) {
        loi_tram.push({
          tram: 'moit_vbpl',
          url: moitErrors[0].url,
          loi: moitErrors.map((x) => x.loi).join('; '),
        });
      }
    }

    // Trạm 4: Cục Phòng vệ thương mại (PVTM)
    try {
      const html = await taiVanBanHttp(NGUON_PVTM, fetchFn);
      rawItems.push(...docTrangPvtm(html, NGUON_PVTM));
      tram_thanh_cong.push('pvtm');
    } catch (err) {
      loi_tram.push({
        tram: 'pvtm',
        url: NGUON_PVTM,
        loi: err?.message || String(err),
      });
    }

    // Trạm 5: Cổng Hải quan Việt Nam (customs.gov.vn)
    try {
      const payload = await taiVanBanHttp(NGUON_HAI_QUAN, fetchFn);
      const itemsHq = docTrangHaiQuan(payload, NGUON_HAI_QUAN);
      if (itemsHq.length === 0 && laVoSpaHaiQuan(payload)) {
        const msgSpa =
          'Cổng Hải quan trả vỏ SPA rỗng (<div id="main"></div>), không có mục văn bản SSR (0 mục)';
        canh_bao_tram.push({
          tram: 'customs',
          url: NGUON_HAI_QUAN,
          loi: msgSpa,
        });
      } else {
        rawItems.push(...itemsHq);
        tram_thanh_cong.push('customs');
      }
    } catch (err) {
      loi_tram.push({
        tram: 'customs',
        url: NGUON_HAI_QUAN,
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

  let boQuaData = null;
  if (boQua === null || boQua === false || boQuaJson === null || boQuaJson === false) {
    boQuaData = null;
  } else if (boQua !== undefined) {
    boQuaData = boQua;
  } else if (typeof boQuaJson === 'string' && boQuaJson) {
    if (!existsSync(boQuaJson)) {
      throw new Error(`Không tìm thấy tệp --bo-qua-json: ${boQuaJson}`);
    }
    boQuaData = JSON.parse(readFileSync(boQuaJson, 'utf8'));
  } else {
    const macDinhBoQua = resolve(root, 'data/radar-bo-qua.json');
    if (existsSync(macDinhBoQua)) {
      boQuaData = JSON.parse(readFileSync(macDinhBoQua, 'utf8'));
    }
  }

  const so = napSo(root);
  const kq = phanTichMucRadar(rawItems, { so, daBao, boQua: boQuaData });
  const tongSauTrung =
    kq.moi.length +
    kq.bo_qua_da_co.length +
    kq.bo_qua_da_bao.length +
    kq.bo_qua_loai_tru.length +
    kq.ngoai_pham_vi.length;

  return {
    thoi_gian: new Date().toISOString(),
    che_do: offlineRss ? 'offline_rss' : 'truc_tiep',
    tram_thanh_cong,
    loi_tram,
    canh_bao_tram,
    tong_muc_tho: rawItems.length,
    thong_ke: {
      tong_sau_trung: tongSauTrung,
      moi: kq.moi.length,
      bo_qua_da_co: kq.bo_qua_da_co.length,
      bo_qua_da_bao: kq.bo_qua_da_bao.length,
      bo_qua_loai_tru: kq.bo_qua_loai_tru.length,
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
    boQuaJson: undefined,
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
    else if (a === '--bo-qua-json') opts.boQuaJson = argv[++i] ?? null;
    else if (a === '--offline-rss') opts.offlineRss = argv[++i] ?? null;
    else if (a === '--root') opts.root = resolve(argv[++i] ?? ROOT);
  }
  return opts;
}

function inBaoCaoVanBan(kq) {
  console.log(
    `Radar (${kq.che_do}): quét ${kq.tong_muc_tho} mục (sau khử trùng ${kq.thong_ke.tong_sau_trung}) · đã có ${kq.thong_ke.bo_qua_da_co} · đã báo ${kq.thong_ke.bo_qua_da_bao} · loại trừ ${kq.thong_ke.bo_qua_loai_tru} · ngoài phạm vi ${kq.thong_ke.ngoai_pham_vi} · MỚI ${kq.thong_ke.moi}`
  );
  for (const l of [...(kq.loi_tram || []), ...(kq.canh_bao_tram || [])]) {
    console.error(`[cảnh báo trạm ${l.tram}] ${l.loi}`);
  }
  for (const v of kq.moi) {
    console.log(`[mới] ${v.soHieu || '(không rõ số)'} — ${v.moTa.slice(0, 110)} (${v.tram})`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const opts = docThamSoCli(process.argv.slice(2));
  if (opts.help) {
    console.log(
      'Cách dùng: node tools/radar-luat-moi.mjs [--json] [--markdown <file|->] [--da-bao-json <file>] [--bo-qua-json <file>] [--offline-rss <file>] [--khong-chan-mang] [--root <dir>]'
    );
    process.exit(0);
  }

  try {
    const kq = await chayRadar({
      root: opts.root,
      daBaoJson: opts.daBaoJson,
      boQuaJson: opts.boQuaJson,
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
