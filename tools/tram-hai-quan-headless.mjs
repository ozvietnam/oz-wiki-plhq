#!/usr/bin/env node
// Trạm thu thập văn bản pháp luật Hải quan bằng trình duyệt headless (`customs.gov.vn` SPA):
// Cổng `customs.gov.vn` trả vỏ rỗng `<div id="main"></div>` qua HTTP fetch thường nên cần Chromium headless
// để hứng phản hồi XHR/fetch JSON (`bridge?url=...`, `CustomsCMS`) VÀ trích DOM sau khi render.
//
// Quy tắc tuân thủ nghiêm ngặt (`CONTRIBUTING.md` & Anti-Bot):
//   - Duy nhất 1 trình duyệt / 1 context / 1 tab tuần tự, KHÔNG chạy song song.
//   - Độ trễ tối thiểu >= 1500ms giữa các lần điều hướng trang.
//   - Dừng ngay nếu gặp 10 lỗi liên tiếp.
//   - TUYỆT ĐỐI KHÔNG vượt/bấm qua CAPTCHA, Cloudflare Turnstile, reCAPTCHA, hCaptcha hay cổng xác minh người thật:
//     phát hiện trang thử thách -> dừng ngay lập tức và báo `BI_CHAN_CAPTCHA`.
//
// Cách dùng:
//   node tools/tram-hai-quan-headless.mjs [--url <url>] [--bo-qua-json <file>] [--da-bao-json <file>]
//                                         [--delay-ms 1500] [--json] [--markdown <file|->]
//                                         [--bat-buoc-playwright] [--khong-chan-mang] [--root <dir>]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, khoa, napSo } from './lib/registry.mjs';
import {
  TU_LOAI,
  USER_AGENT,
  chuanHoaDaBao,
  daCoTrongSo,
  sinhBienTheKhoaSoHieu,
  soHieuTuSlug,
  soHieuTuTieuDe,
  thuocPhamVi,
} from './radar-luat-moi.mjs';
import { giaiMaHtmlEntities } from './tai-pdf-tu-vo-html.mjs';

export const NGUON_HAI_QUAN_VB_MOI = 'https://www.customs.gov.vn/index.jsp?pageId=8&cid=1294';
export const BASE_HAI_QUAN = 'https://www.customs.gov.vn/';
export const FILES_HAI_QUAN = 'https://files.customs.gov.vn/';
export const MIN_DELAY_GIUA_TRANG_MS = 1500;
export const TIMEOUT_HEADLESS_MS = 30000;
export const MAX_LOI_LIEN_TIEP = 10;

const RE_CAPTCHA_HTML = [
  /challenges\.cloudflare\.com\/turnstile/i,
  /\bcf-turnstile\b/i,
  /\bcf-challenge-running\b/i,
  /\bg-recaptcha\b/i,
  /\bh-captcha\b|\bhcaptcha\.com\/1\/api\.js\b/i,
  /verify\s+you\s+are\s+human/i,
  /xác\s+minh\s+bạn\s+là\s+con\s+người/iu,
  /vui\s+lòng\s+xác\s+thực\s+captcha/iu,
  /<(?:div|iframe|input|form)\b[^>]*(?:id|class|name|src)=["'][^"']*(?:turnstile|recaptcha|hcaptcha|captcha)[^"']*["']/i,
];

const RE_CAPTCHA_TITLE =
  /just\s+a\s+moment|attention\s+required.*cloudflare|security\s+check|verify\s+you\s+are\s+human|xác\s+minh\s+trình\s+duyệt/iu;

function lamSachChuoi(raw) {
  return giaiMaHtmlEntities(String(raw || ''))
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

function giaiQuyetUrlHaiQuan(rawHref, { baseUrl = BASE_HAI_QUAN, filesBaseUrl = FILES_HAI_QUAN } = {}) {
  const clean = giaiMaHtmlEntities(String(rawHref || '')).trim();
  if (!clean || /^(?:#|javascript:|mailto:|data:)/i.test(clean)) return '';
  if (/^https?:\/\//i.test(clean)) return clean;

  // Đường dẫn tệp đính kèm của CustomsCMS nằm trên files.customs.gov.vn
  if (/^\/?(?:CustomsCMS|van_ban_phap_luat)\//i.test(clean)) {
    const rel = clean.replace(/^\/+/, '');
    try {
      return new URL(rel, filesBaseUrl).href;
    } catch {
      return `${filesBaseUrl.replace(/\/+$/, '')}/${rel}`;
    }
  }

  try {
    return new URL(clean, baseUrl).href;
  } catch {
    return clean;
  }
}

function trichUrlPdfDauTien(rawVal, urlOpts) {
  if (!rawVal) return '';
  if (Array.isArray(rawVal)) {
    for (const elem of rawVal) {
      const found = trichUrlPdfDauTien(elem, urlOpts);
      if (found) return found;
    }
    return '';
  }
  if (typeof rawVal === 'object') {
    for (const k of ['url', 'file_url', 'duong_dan', 'path', 'href', 'fileName', 'file_name']) {
      if (rawVal[k]) {
        const found = trichUrlPdfDauTien(rawVal[k], urlOpts);
        if (found) return found;
      }
    }
    return '';
  }

  const s = String(rawVal).trim();
  if (!s || s === 'null' || s === '[]') return '';
  if (s.startsWith('[') || s.startsWith('{')) {
    try {
      return trichUrlPdfDauTien(JSON.parse(s), urlOpts);
    } catch {
      /* xử lý như chuỗi thường */
    }
  }

  const resolved = giaiQuyetUrlHaiQuan(s, urlOpts);
  return /\.pdf(?:$|[?#])/i.test(resolved) ? resolved : '';
}

function chuanSoHieuHaiQuan(raw) {
  const s = lamSachChuoi(raw)
    .replace(/^\s*s[ốo]\s*:?\s*/iu, '')
    .replace(/\s*\/\s*/g, '/')
    .replace(/\s*-\s*/g, '-')
    .replace(/\s+/g, '')
    .replace(/[.,;:]+$/, '');
  if (!s || !/\d/.test(s) || !/\//.test(s)) return null;
  return soHieuTuTieuDe(s) || s;
}

/**
 * Phát hiện cổng thử thách chống bot / CAPTCHA / Cloudflare Turnstile.
 * Tuân thủ tuyệt đối nguyên tắc không vượt CAPTCHA: trả `{ biChan: true, ma: 'BI_CHAN_CAPTCHA', chiTiet }` để dừng ngay.
 */
export function phatHienChanCaptcha({ html = '', title = '', url = '', status = 200 } = {}) {
  const rawHtml = String(html || '');
  const rawTitle = String(title || '').trim();
  const rawUrl = String(url || '');

  if (RE_CAPTCHA_TITLE.test(rawTitle)) {
    return {
      biChan: true,
      ma: 'BI_CHAN_CAPTCHA',
      chiTiet: `Tiêu đề trang thử thách chống bot (${status}): "${rawTitle}"`,
    };
  }

  if (/(?:challenges\.cloudflare\.com|\/cdn-cgi\/challenge-platform\/)/i.test(rawUrl)) {
    return {
      biChan: true,
      ma: 'BI_CHAN_CAPTCHA',
      chiTiet: `URL chuyển hướng sang cổng thử thách (${rawUrl})`,
    };
  }

  for (const re of RE_CAPTCHA_HTML) {
    if (re.test(rawHtml)) {
      return {
        biChan: true,
        ma: 'BI_CHAN_CAPTCHA',
        chiTiet: `Phát hiện thành phần thử thách CAPTCHA/Turnstile trên trang (${re.source})`,
      };
    }
  }

  return { biChan: false, ma: null, chiTiet: null };
}

function timMangBanGhiTrongJson(node, depth = 0) {
  if (depth > 5 || !node) return [];
  if (Array.isArray(node)) {
    if (
      node.some(
        (x) =>
          x &&
          typeof x === 'object' &&
          ('so_hieu' in x ||
            'soHieu' in x ||
            'so_van_ban' in x ||
            'soVanBan' in x ||
            'ky_hieu' in x ||
            'trich_yeu' in x ||
            'noi_dung_tom_tat' in x ||
            'ten_van_ban' in x ||
            'url_chi_tiet' in x)
      )
    ) {
      return node;
    }
    return node.flatMap((x) => timMangBanGhiTrongJson(x, depth + 1));
  }

  if (typeof node === 'object') {
    if (typeof node.d === 'string' && (node.d.trim().startsWith('{') || node.d.trim().startsWith('['))) {
      try {
        const inner = JSON.parse(node.d);
        const foundInner = timMangBanGhiTrongJson(inner, depth + 1);
        if (foundInner.length) return foundInner;
      } catch {
        /* noop */
      }
    }
    for (const key of [
      'items',
      'data',
      'Data',
      'd',
      'rows',
      'list',
      'van_ban',
      'danh_sach',
      'results',
      'records',
      'result',
    ]) {
      if (key in node) {
        const found = timMangBanGhiTrongJson(node[key], depth + 1);
        if (found.length) return found;
      }
    }
  }

  return [];
}

/**
 * Trích danh sách văn bản từ payload JSON XHR/fetch của `customs.gov.vn` (`bridge?url=...`, Kendo/DataTables, `CustomsCMS`).
 */
export function trichMucTuJsonHaiQuan(
  payload,
  { baseUrl = BASE_HAI_QUAN, filesBaseUrl = FILES_HAI_QUAN, defaultCid = '1294' } = {}
) {
  if (!payload) return [];
  let parsed = payload;
  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return [];
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      return [];
    }
  }

  const records = timMangBanGhiTrongJson(parsed);
  if (!records.length) return [];

  const urlOpts = { baseUrl, filesBaseUrl };
  const out = [];
  const seen = new Set();

  for (const it of records) {
    if (!it || typeof it !== 'object') continue;
    const rawSo =
      it.so_hieu ?? it.soHieu ?? it.so_van_ban ?? it.soVanBan ?? it.ky_hieu ?? it.so_ky_hieu ?? it.code ?? '';
    const rawMoTa =
      it.trich_yeu ??
      it.noi_dung_tom_tat ??
      it.ten_van_ban ??
      it.tieu_de ??
      it.mo_ta ??
      it.moTa ??
      it.ten ??
      it.title ??
      it.summary ??
      '';
    const rawNgay =
      it.ngay_ban_hanh ??
      it.ngayBanHanh ??
      it.ngay_ky ??
      it.ngay_phat_hanh ??
      it.ngay ??
      it.issued_date ??
      '';
    const rawUrl = it.url_chi_tiet ?? it.url ?? it.link ?? it.detail_url ?? '';
    const rawId = it.id ?? it.van_ban_id ?? it.doc_id ?? it.ID ?? null;
    const cid = it.cid ?? it.category_id ?? defaultCid;

    const pdfUrl =
      trichUrlPdfDauTien(
        it.pdf_url_primary ??
          it.pdf_url ??
          it.pdfUrl ??
          it.file_dinh_kem ??
          it.duong_dan_file ??
          it.tep_dinh_kem ??
          it.file_url ??
          it.attach_file ??
          it.files,
        urlOpts
      ) || '';

    let url = rawUrl ? giaiQuyetUrlHaiQuan(rawUrl, urlOpts) : '';
    if (!url && rawId != null && /^\d+$/.test(String(rawId))) {
      url = giaiQuyetUrlHaiQuan(`index.jsp?pageId=3&id=${rawId}&cid=${cid}`, urlOpts);
    }
    if (!url && pdfUrl) {
      url = pdfUrl;
    }

    const moTa = lamSachChuoi(rawMoTa);
    const soHieu =
      chuanSoHieuHaiQuan(rawSo) ||
      soHieuTuSlug(url) ||
      soHieuTuTieuDe(moTa) ||
      soHieuTuSlug(pdfUrl) ||
      null;
    const ngay = lamSachChuoi(rawNgay);

    if (!url || (!soHieu && !moTa)) continue;
    const dedupKey = `${soHieu ? khoa(soHieu) : ''}|${chuanHoaUrl(url)}`;
    if (seen.has(dedupKey)) continue;
    seen.add(dedupKey);

    out.push({
      soHieu,
      moTa: moTa || soHieu,
      ngay,
      url,
      ...(pdfUrl ? { pdfUrl } : {}),
      tram: 'customs_headless',
    });
  }

  return out;
}

/**
 * Trích danh sách văn bản từ cây HTML đã được trình duyệt render sau `networkidle` trên `customs.gov.vn`.
 */
export function trichMucTuDomHaiQuan(
  renderedHtml,
  { baseUrl = BASE_HAI_QUAN, filesBaseUrl = FILES_HAI_QUAN } = {}
) {
  const src = String(renderedHtml || '');
  if (!src) return [];

  const urlOpts = { baseUrl, filesBaseUrl };
  const out = [];
  const seenUrl = new Set();

  // 1. Các hàng bảng DataTables / Kendo Grid (`<tr>`)
  const rows = src.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi) || [];
  for (const row of rows) {
    if (/<th\b/i.test(row)) continue;
    const tds = [...row.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map((m) => m[1]);
    if (tds.length < 2) continue;

    const anchors = [...row.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
    let detailHref = '';
    let detailText = '';
    let pdfUrl = '';

    for (const a of anchors) {
      const resolved = giaiQuyetUrlHaiQuan(a[1], urlOpts);
      if (!resolved) continue;
      if (/\.pdf(?:$|[?#])/i.test(resolved)) {
        if (!pdfUrl) pdfUrl = resolved;
      } else if (!detailHref) {
        detailHref = resolved;
        detailText = lamSachChuoi(a[2]);
      } else if (lamSachChuoi(a[2]).length > detailText.length) {
        detailHref = resolved;
        detailText = lamSachChuoi(a[2]);
      }
    }

    const url = detailHref || pdfUrl;
    if (!url) continue;
    const urlKey = chuanHoaUrl(url);
    if (seenUrl.has(urlKey)) continue;

    const cellTexts = tds.map((c) => lamSachChuoi(c)).filter(Boolean);
    const rowText = cellTexts.join(' ');
    const ngay = (rowText.match(/\b\d{1,2}[/-]\d{1,2}[/-](?:19|20)\d{2}\b/) || [])[0] || '';

    let soHieu = null;
    for (const c of cellTexts) {
      if (c.length <= 40) {
        const sh = chuanSoHieuHaiQuan(c);
        if (sh) {
          soHieu = sh;
          break;
        }
      }
    }
    if (!soHieu) {
      soHieu = soHieuTuTieuDe(rowText) || soHieuTuSlug(url) || soHieuTuSlug(pdfUrl) || null;
    }

    // Chọn ô văn bản dài nhất làm mô tả trích yếu (tránh lấy nhầm cột STT hoặc cột Số hiệu ngắn)
    const longestCell = [...cellTexts]
      .filter((c) => !soHieu || khoa(c) !== khoa(soHieu))
      .sort((a, b) => b.length - a.length)[0] || '';
    const moTa = detailText.length >= 15 ? detailText : longestCell || detailText || rowText;
    if (!soHieu && (!moTa || moTa.length < 10)) continue;

    seenUrl.add(urlKey);
    out.push({
      soHieu,
      moTa: moTa || soHieu,
      ngay,
      url,
      ...(pdfUrl ? { pdfUrl } : {}),
      tram: 'customs_headless',
    });
  }

  // 2. Các khối thẻ / liên kết chi tiết ngoài bảng (`pageId=3&id=...`, `.pdf` trên `files.customs.gov.vn`)
  for (const m of src.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const resolved = giaiQuyetUrlHaiQuan(m[1], urlOpts);
    if (!resolved || /\.(?:css|js|png|jpe?g|gif|svg|ico|zip)(?:[?#].*)?$/i.test(resolved)) continue;
    if (/pageId=8\b/i.test(resolved) && !/[?&]id=\d+/i.test(resolved)) continue;

    const urlKey = chuanHoaUrl(resolved);
    if (seenUrl.has(urlKey)) continue;

    const text = lamSachChuoi(m[2]);
    const isPdf = /\.pdf(?:$|[?#])/i.test(resolved);
    const laChiTiet = /(?:[?&]pageId=3\b|[?&]id=\d+|van-ban|thong-bao|\.html?(?:$|[?#]))/i.test(resolved) || isPdf;
    const soHieu = soHieuTuSlug(resolved) || soHieuTuTieuDe(text) || null;

    if (!laChiTiet && !soHieu) continue;
    if (!soHieu && text.length < 15) continue;

    seenUrl.add(urlKey);
    out.push({
      soHieu,
      moTa: text || soHieu,
      ngay: (text.match(/\b\d{1,2}[/-]\d{1,2}[/-](?:19|20)\d{2}\b/) || [])[0] || '',
      url: resolved,
      ...(isPdf ? { pdfUrl: resolved } : {}),
      tram: 'customs_headless',
    });
  }

  return out;
}

/** Gộp kết quả từ XHR JSON và DOM đã render, ưu tiên làm giàu `pdfUrl`, `ngay`, `moTa` đầy đủ nhất cho từng văn bản. */
export function gopMucHaiQuanHeadless({
  jsonPayloads = [],
  domHtml = '',
  baseUrl = BASE_HAI_QUAN,
  filesBaseUrl = FILES_HAI_QUAN,
} = {}) {
  const tho = [];
  for (const p of jsonPayloads || []) {
    tho.push(...trichMucTuJsonHaiQuan(p, { baseUrl, filesBaseUrl }));
  }
  if (domHtml) {
    tho.push(...trichMucTuDomHaiQuan(domHtml, { baseUrl, filesBaseUrl }));
  }

  const gopMap = new Map();
  const thuTu = [];

  for (const item of tho) {
    const k = item.soHieu ? `K:${khoa(item.soHieu)}` : `U:${chuanHoaUrl(item.url)}`;
    const cu = gopMap.get(k);
    if (!cu) {
      const banSao = { ...item, tram: 'customs_headless' };
      gopMap.set(k, banSao);
      thuTu.push(banSao);
      continue;
    }
    if (!cu.pdfUrl && item.pdfUrl) cu.pdfUrl = item.pdfUrl;
    if (!cu.ngay && item.ngay) cu.ngay = item.ngay;
    if (item.moTa && (!cu.moTa || (cu.soHieu && cu.moTa === cu.soHieu) || item.moTa.length > cu.moTa.length)) {
      cu.moTa = item.moTa;
    }
    if (/\.pdf(?:$|[?#])/i.test(cu.url) && item.url && !/\.pdf(?:$|[?#])/i.test(item.url)) {
      cu.url = item.url;
    }
  }

  return thuTu;
}

function thuocPhamViHaiQuan(soHieu, moTa) {
  const t = String(moTa || '').normalize('NFC').toLowerCase();
  if (t && TU_LOAI.some((k) => t.includes(k.normalize('NFC').toLowerCase()))) {
    return false;
  }
  if (thuocPhamVi(soHieu, moTa)) return true;
  // Văn bản mang ký hiệu chính thức của Tổng cục Hải quan / Cục Hải quan không dính từ khoá nội bộ/nhân sự
  if (soHieu && /(?:^|\/|-)(?:TCHQ|CHQ)(?:-|$|\/)/i.test(String(soHieu))) {
    return true;
  }
  return false;
}

function khopTapSoHieuHoacUrl(soHieu, ngay, url, tapNorm) {
  if (url && tapNorm.urls.has(chuanHoaUrl(url))) return true;
  if (!soHieu) return false;
  const k = khoa(soHieu);
  if (k && tapNorm.soHieuKhoa.has(k)) return true;
  for (const vk of sinhBienTheKhoaSoHieu(soHieu, ngay)) {
    if (tapNorm.soHieuKhoa.has(vk)) return true;
  }
  return false;
}

/** Đối chiếu các mục thu thập từ Cổng Hải quan với `napSo(root)`, `data/radar-bo-qua.json` và danh sách issue đã báo. */
export function phanTichMucHaiQuan(items, { so = napSo(), daBao = null, boQua = null } = {}) {
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
      soHieu,
      moTa,
      ngay: String(raw.ngay || '').trim(),
      url,
      ...(raw.pdfUrl ? { pdfUrl: String(raw.pdfUrl).trim() } : {}),
      tram: 'customs_headless',
    };

    if (soHieu && daCoTrongSo(soHieu, muc.ngay, so)) {
      bo_qua_da_co.push(muc);
      continue;
    }
    if (khopTapSoHieuHoacUrl(soHieu, muc.ngay, url, boQuaNorm)) {
      bo_qua_loai_tru.push(muc);
      continue;
    }
    if (!thuocPhamViHaiQuan(soHieu, moTa)) {
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

function laLoiThieuPlaywright(err) {
  const code = err?.code || '';
  const msg = String(err?.message || err || '');
  return (
    code === 'ERR_MODULE_NOT_FOUND' ||
    code === 'MODULE_NOT_FOUND' ||
    /Cannot find package ['"]playwright['"]|Cannot find module ['"]playwright['"]/i.test(msg) ||
    /Executable doesn't exist|browserType\.launch/i.test(msg)
  );
}

async function thuThapVoiPlaywright(
  urls,
  { playwrightMod, delayMs, timeoutMs, sleepFn }
) {
  const chromium = playwrightMod?.chromium || playwrightMod?.default?.chromium;
  if (!chromium || typeof chromium.launch !== 'function') {
    throw new Error('Gói playwright không cung cấp chromium.launch');
  }

  const ketQuaTrang = [];
  // Duy nhất 1 trình duyệt, 1 context, 1 page tuần tự (CONTRIBUTING.md)
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      userAgent: USER_AGENT,
      locale: 'vi-VN',
    });
    try {
      const page = await context.newPage();
      let currentJsonPayloads = [];

      page.on('response', async (res) => {
        try {
          const rUrl = res.url();
          const ct = (res.headers()['content-type'] || '').toLowerCase();
          const laJsonApi =
            ct.includes('json') ||
            /bridge\?url=|lay_van_ban|GetDanhSach|VanBan/i.test(rUrl);
          if (!laJsonApi || res.status() < 200 || res.status() >= 300) return;
          const text = await res.text();
          if (text && (text.trim().startsWith('{') || text.trim().startsWith('['))) {
            currentJsonPayloads.push(text);
          }
        } catch {
          /* bỏ qua response phụ đã đóng khi chuyển trang */
        }
      });

      let loiLienTiep = 0;
      for (let idx = 0; idx < urls.length; idx += 1) {
        if (idx > 0) {
          await sleepFn(delayMs);
        }
        currentJsonPayloads = [];
        const targetUrl = urls[idx];
        try {
          let navRes = null;
          try {
            navRes = await page.goto(targetUrl, {
              waitUntil: 'networkidle',
              timeout: timeoutMs,
            });
          } catch (navErr) {
            // Nếu trang giữ long-polling làm quá hạn networkidle nhưng DOM đã sẵn sàng, đọc tiếp an toàn
            if (!/Timeout/i.test(String(navErr?.message || ''))) throw navErr;
          }

          const status = navRes ? navRes.status() : 200;
          const finalUrl = page.url() || targetUrl;
          const title = await page.title().catch(() => '');
          const html = await page.content();

          const ktCaptcha = phatHienChanCaptcha({ html, title, url: finalUrl, status });
          if (ktCaptcha.biChan) {
            ketQuaTrang.push({
              url: targetUrl,
              finalUrl,
              status,
              title,
              html,
              jsonPayloads: [],
              biChanCaptcha: ktCaptcha,
            });
            // TUYỆT ĐỐI DỪNG NGAY khi gặp CAPTCHA / Turnstile
            break;
          }

          loiLienTiep = 0;
          ketQuaTrang.push({
            url: targetUrl,
            finalUrl,
            status,
            title,
            html,
            jsonPayloads: [...currentJsonPayloads],
          });
        } catch (err) {
          loiLienTiep += 1;
          ketQuaTrang.push({
            url: targetUrl,
            loi: String(err?.message || err),
          });
          if (loiLienTiep >= MAX_LOI_LIEN_TIEP) {
            break;
          }
        }
      }
    } finally {
      await context.close().catch(() => {});
    }
  } finally {
    await browser.close().catch(() => {});
  }

  return ketQuaTrang;
}

/**
 * Chạy trạm thu thập văn bản Hải quan headless, kiểm thử được 100% offline qua `thuThapTrangFn` hoặc `playwrightLoader`.
 */
export async function chayTramHaiQuanHeadless({
  urls = [NGUON_HAI_QUAN_VB_MOI],
  root = ROOT,
  daBaoJson = null,
  boQua = undefined,
  boQuaJson = undefined,
  delayMs = MIN_DELAY_GIUA_TRANG_MS,
  timeoutMs = TIMEOUT_HEADLESS_MS,
  thuThapTrangFn = null,
  playwrightLoader = () => import('playwright'),
  sleepFn = (ms) => new Promise((r) => setTimeout(r, ms)),
} = {}) {
  const dsUrl = (Array.isArray(urls) && urls.length ? urls : [NGUON_HAI_QUAN_VB_MOI])
    .map((u) => String(u || '').trim())
    .filter(Boolean);
  const effectiveDelayMs = Math.max(MIN_DELAY_GIUA_TRANG_MS, Number(delayMs) || MIN_DELAY_GIUA_TRANG_MS);

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

  let ketQuaTrang = [];
  if (typeof thuThapTrangFn === 'function') {
    let loiLienTiep = 0;
    for (let idx = 0; idx < dsUrl.length; idx += 1) {
      if (idx > 0) {
        await sleepFn(effectiveDelayMs);
      }
      const targetUrl = dsUrl[idx];
      try {
        const res = await thuThapTrangFn(targetUrl, { index: idx, delayMs: effectiveDelayMs });
        const status = res?.status ?? 200;
        const finalUrl = res?.finalUrl || res?.url || targetUrl;
        const title = res?.title || '';
        const html = res?.html || '';
        const ktCaptcha = phatHienChanCaptcha({ html, title, url: finalUrl, status });
        if (ktCaptcha.biChan) {
          ketQuaTrang.push({
            url: targetUrl,
            finalUrl,
            status,
            title,
            html,
            jsonPayloads: [],
            biChanCaptcha: ktCaptcha,
          });
          break;
        }
        loiLienTiep = 0;
        ketQuaTrang.push({
          url: targetUrl,
          finalUrl,
          status,
          title,
          html,
          jsonPayloads: Array.isArray(res?.jsonPayloads) ? res.jsonPayloads : [],
        });
      } catch (err) {
        loiLienTiep += 1;
        ketQuaTrang.push({ url: targetUrl, loi: String(err?.message || err) });
        if (loiLienTiep >= MAX_LOI_LIEN_TIEP) break;
      }
    }
  } else {
    let pwMod;
    try {
      pwMod = await playwrightLoader();
      ketQuaTrang = await thuThapVoiPlaywright(dsUrl, {
        playwrightMod: pwMod,
        delayMs: effectiveDelayMs,
        timeoutMs,
        sleepFn,
      });
    } catch (err) {
      if (laLoiThieuPlaywright(err)) {
        const msg =
          'Chưa cài đặt gói `playwright` hoặc trình duyệt Chromium cục bộ (chạy `npm install --no-save playwright && npx playwright install chromium` khi cần quét trực tiếp).';
        return {
          thoi_gian: new Date().toISOString(),
          trang_thai: 'THIEU_PLAYWRIGHT',
          tram: 'customs_headless',
          delay_ms: effectiveDelayMs,
          urls_da_quet: [],
          tram_thanh_cong: [],
          loi_tram: [],
          canh_bao_tram: [{ tram: 'customs_headless', url: dsUrl[0], ma: 'THIEU_PLAYWRIGHT', loi: msg }],
          tong_muc_tho: 0,
          thong_ke: {
            tong_sau_trung: 0,
            moi: 0,
            bo_qua_da_co: 0,
            bo_qua_da_bao: 0,
            bo_qua_loai_tru: 0,
            ngoai_pham_vi: 0,
          },
          moi: [],
          bo_qua_da_co: [],
          bo_qua_da_bao: [],
          bo_qua_loai_tru: [],
          ngoai_pham_vi: [],
        };
      }
      throw err;
    }
  }

  const tram_thanh_cong = [];
  const loi_tram = [];
  const canh_bao_tram = [];
  const rawItems = [];
  const urls_da_quet = [];
  let biChanCaptcha = false;

  for (const trang of ketQuaTrang) {
    urls_da_quet.push(trang.url);
    if (trang.biChanCaptcha?.biChan) {
      biChanCaptcha = true;
      loi_tram.push({
        tram: 'customs_headless',
        url: trang.finalUrl || trang.url,
        ma: 'BI_CHAN_CAPTCHA',
        loi: `BI_CHAN_CAPTCHA: ${trang.biChanCaptcha.chiTiet}`,
      });
      break;
    }
    if (trang.loi) {
      loi_tram.push({
        tram: 'customs_headless',
        url: trang.url,
        ma: 'LOI_DIEU_HUONG',
        loi: trang.loi,
      });
      continue;
    }

    const mucTrang = gopMucHaiQuanHeadless({
      jsonPayloads: trang.jsonPayloads,
      domHtml: trang.html,
      baseUrl: trang.finalUrl || trang.url || BASE_HAI_QUAN,
      filesBaseUrl: FILES_HAI_QUAN,
    });

    if (mucTrang.length === 0) {
      canh_bao_tram.push({
        tram: 'customs_headless',
        url: trang.url,
        ma: 'KHONG_CO_MUC_VAN_BAN',
        loi: 'Trang Hải quan đã tải nhưng không trích xuất được mục văn bản nào từ XHR JSON hoặc DOM',
      });
    } else {
      rawItems.push(...mucTrang);
      if (!tram_thanh_cong.includes('customs_headless')) {
        tram_thanh_cong.push('customs_headless');
      }
    }
  }

  const so = napSo(root);
  const kq = phanTichMucHaiQuan(rawItems, { so, daBao, boQua: boQuaData });
  const tongSauTrung =
    kq.moi.length +
    kq.bo_qua_da_co.length +
    kq.bo_qua_da_bao.length +
    kq.bo_qua_loai_tru.length +
    kq.ngoai_pham_vi.length;

  const trang_thai = biChanCaptcha
    ? 'BI_CHAN_CAPTCHA'
    : tram_thanh_cong.length > 0
      ? 'OK'
      : loi_tram.length > 0
        ? 'LOI_TRAM'
        : 'KHONG_CO_DU_LIEU';

  return {
    thoi_gian: new Date().toISOString(),
    trang_thai,
    tram: 'customs_headless',
    delay_ms: effectiveDelayMs,
    urls_da_quet,
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

/** Định dạng báo cáo Markdown cho trạm Hải quan headless (`auto/nap-hai-quan` & `$GITHUB_STEP_SUMMARY`). */
export function dinhDangMarkdownTramHaiQuan(kq) {
  const moi = kq?.moi || [];
  const ngay = (kq?.thoi_gian || new Date().toISOString()).slice(0, 10);
  const dsCanhBao = [...(kq?.loi_tram || []), ...(kq?.canh_bao_tram || [])];

  const lines = [
    `## Trạm Hải quan Headless (\`customs.gov.vn\`) — ${ngay}`,
    '',
    `- **Trạng thái trạm**: \`${kq?.trang_thai || 'UNKNOWN'}\``,
    `- **Tổng mục sau khử trùng**: ${kq?.thong_ke?.tong_sau_trung ?? 0}`,
    `- **Mới thuộc phạm vi**: ${moi.length}`,
    `- **Đã có trong sổ**: ${kq?.thong_ke?.bo_qua_da_co ?? 0}`,
    `- **Đã báo trước đó**: ${kq?.thong_ke?.bo_qua_da_bao ?? 0}`,
    `- **Đã loại trừ (sổ bỏ qua)**: ${kq?.thong_ke?.bo_qua_loai_tru ?? 0}`,
    `- **Ngoài phạm vi**: ${kq?.thong_ke?.ngoai_pham_vi ?? 0}`,
  ];

  if (dsCanhBao.length) {
    lines.push('');
    lines.push('### Cảnh báo / Trạng thái bảo vệ');
    for (const c of dsCanhBao) {
      lines.push(`- \`${c.ma || c.tram}\` (${c.url}): ${c.loi}`);
    }
  }

  lines.push('');
  lines.push(`### Danh sách văn bản Hải quan mới (${moi.length})`);
  if (!moi.length) {
    lines.push('_Không phát hiện văn bản Hải quan mới nào chưa có trong sổ._');
  } else {
    for (const v of moi) {
      const sh = v.soHieu || '(không rõ số)';
      const pdfNote = v.pdfUrl ? ` · [PDF](${v.pdfUrl})` : '';
      const meta = [v.ngay || null, v.url ? `[chi tiết](${v.url})` : null].filter(Boolean).join(' · ');
      lines.push(`- [ ] **${sh}** — ${v.moTa}${meta ? ` (${meta})` : ''}${pdfNote}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

export function docThamSoCli(argv) {
  const opts = {
    urls: [],
    boQuaJson: undefined,
    daBaoJson: null,
    delayMs: MIN_DELAY_GIUA_TRANG_MS,
    timeoutMs: TIMEOUT_HEADLESS_MS,
    json: false,
    markdown: null,
    batBuocPlaywright: false,
    khongChanMang: false,
    root: ROOT,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--json') opts.json = true;
    else if (a === '--bat-buoc-playwright') opts.batBuocPlaywright = true;
    else if (a === '--khong-chan-mang') opts.khongChanMang = true;
    else if (a === '--help' || a === '-h') opts.help = true;
    else if (a === '--url') {
      const u = argv[++i];
      if (u) opts.urls.push(u);
    } else if (a.startsWith('--url=')) {
      const u = a.slice('--url='.length);
      if (u) opts.urls.push(u);
    } else if (a === '--markdown') opts.markdown = argv[++i] ?? '-';
    else if (a.startsWith('--markdown=')) opts.markdown = a.slice('--markdown='.length);
    else if (a === '--bo-qua-json') opts.boQuaJson = argv[++i] ?? null;
    else if (a.startsWith('--bo-qua-json=')) opts.boQuaJson = a.slice('--bo-qua-json='.length);
    else if (a === '--da-bao-json') opts.daBaoJson = argv[++i] ?? null;
    else if (a.startsWith('--da-bao-json=')) opts.daBaoJson = a.slice('--da-bao-json='.length);
    else if (a === '--delay-ms') opts.delayMs = Number(argv[++i]);
    else if (a.startsWith('--delay-ms=')) opts.delayMs = Number(a.slice('--delay-ms='.length));
    else if (a === '--timeout-ms') opts.timeoutMs = Number(argv[++i]);
    else if (a.startsWith('--timeout-ms=')) opts.timeoutMs = Number(a.slice('--timeout-ms='.length));
    else if (a === '--root') opts.root = resolve(argv[++i] ?? ROOT);
    else if (a.startsWith('--root=')) opts.root = resolve(a.slice('--root='.length));
  }

  if (opts.urls.length === 0) {
    opts.urls.push(NGUON_HAI_QUAN_VB_MOI);
  }
  return opts;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const opts = docThamSoCli(process.argv.slice(2));
  if (opts.help) {
    console.log(
      'Cách dùng: node tools/tram-hai-quan-headless.mjs [--url <url>] [--bo-qua-json <file>] [--da-bao-json <file>] [--delay-ms 1500] [--json] [--markdown <file|->] [--bat-buoc-playwright] [--khong-chan-mang] [--root <dir>]'
    );
    process.exit(0);
  }

  try {
    const kq = await chayTramHaiQuanHeadless({
      urls: opts.urls,
      root: opts.root,
      daBaoJson: opts.daBaoJson,
      boQuaJson: opts.boQuaJson,
      delayMs: opts.delayMs,
      timeoutMs: opts.timeoutMs,
    });

    if (kq.trang_thai === 'THIEU_PLAYWRIGHT') {
      console.error(`[tram-hai-quan-headless] ${kq.canh_bao_tram[0]?.loi || 'Thiếu gói playwright'}`);
    } else if (kq.trang_thai === 'BI_CHAN_CAPTCHA') {
      console.error(`[tram-hai-quan-headless] ${kq.loi_tram[0]?.loi || 'Bị chặn bởi CAPTCHA — dừng ngay'}`);
    }

    if (opts.markdown) {
      const md = dinhDangMarkdownTramHaiQuan(kq);
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
        `Trạm Hải quan headless (${kq.trang_thai}): quét ${kq.tong_muc_tho} mục · đã có ${kq.thong_ke.bo_qua_da_co} · loại trừ ${kq.thong_ke.bo_qua_loai_tru} · ngoài phạm vi ${kq.thong_ke.ngoai_pham_vi} · MỚI ${kq.thong_ke.moi}`
      );
      for (const v of kq.moi) {
        console.log(`[mới] ${v.soHieu || '(không rõ số)'} — ${v.moTa.slice(0, 110)}`);
      }
    }

    if (kq.trang_thai === 'THIEU_PLAYWRIGHT' && opts.batBuocPlaywright) {
      process.exit(2);
    }
    if (kq.trang_thai === 'LOI_TRAM' && !opts.khongChanMang) {
      process.exit(1);
    }
  } catch (err) {
    console.error(`LỖI: ${err.message}`);
    process.exit(1);
  }
}
