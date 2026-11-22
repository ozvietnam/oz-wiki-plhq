#!/usr/bin/env node
// Tự động trích URL PDF bậc A từ các vỏ HTML (`VO_HTML_CHUA_TAI_PDF`),
// đối chiếu sơ bộ tiêu đề/số hiệu, kiểm magic `%PDF` & giới hạn dung lượng rồi nạp vào `raw/download/`.
//
//   node tools/tai-pdf-tu-vo-html.mjs [--limit 16] [--max-total-mb 45] [--max-file-mb 25] [--dry-run] [--report <json>]
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { bacNguon, boDau, homNay, khoa, napSo, ROOT, slugTuSoHieu } from './lib/registry.mjs';
import { kiemToanKhoNap, kiemTraPdfCoLopChu } from './lib/kiem-tra-raw.mjs';

const UA = 'oz-wiki-plhq/0.1 (+https://github.com/ozvietnam/oz-wiki-plhq)';
const MAC_DINH_LIMIT = 16;
const MAC_DINH_MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAC_DINH_MAX_TOTAL_BYTES = 45 * 1024 * 1024;

const RE_ATTR_URL = /(?:data-file|data-href|data-src|data-url|href|src)\s*=\s*["']([^"']+)["']/gi;
const RE_ABS_PDF = /https?:\/\/[^"'\s<>]+\.pdf(?:\?[^"'\s<>]*)?/gi;
const RE_STREAM_URL = /https?:\/\/[^"'\s<>]*\/api\/download\/stream\?[^"'\s<>]+/gi;
const RE_NON_PDF_EXT = /\.(?:docx?|xlsx?|pptx?|zip|rar|7z|html?|aspx?|php|css|js|png|jpe?g|gif|svg|webp|ico)(?:$|[?#&])/i;

const STOPWORDS_TEN = new Set([
  'cua', 've', 'so', 'quy', 'dinh', 'mot', 'dieu', 'luat', 'bo', 'nghi', 'thong', 'tu',
  'quyet', 'van', 'ban', 'hop', 'nhat', 'chinh', 'phu', 'quoc', 'hoi', 'truong', 'thu',
  'tuong', 'ngay', 'thang', 'nam', 'hanh', 'sua', 'doi', 'sung', 'bai', 'chi', 'tiet',
  'bien', 'phap', 'thi', 'va', 'cac', 'trong', 'linh', 'vuc', 'nuoc', 'cong', 'hoa',
]);

const CYRILLIC_MAP = {
  '\u0410': 'A', '\u0412': 'B', '\u0421': 'C', '\u0415': 'E', '\u041D': 'H',
  '\u041A': 'K', '\u041C': 'M', '\u041E': 'O', '\u0420': 'P', '\u0422': 'T', '\u0425': 'X',
  '\u0430': 'a', '\u0435': 'e', '\u043E': 'o', '\u0440': 'p', '\u0441': 'c', '\u0445': 'x',
};

/** Giải mã HTML entities (bao gồm `&amp;`, `&#x2B;`, `&#43;`, `&quot;`, `&#39;`). */
export function giaiMaHtmlEntities(s) {
  return String(s || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => {
      const code = Number(n);
      return Number.isInteger(code) && code >= 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '';
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => {
      const code = parseInt(h, 16);
      return Number.isInteger(code) && code >= 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '';
    });
}

function chuanKhoaSoHieu(s) {
  const fixed = String(s || '').replace(/[\u0410\u0412\u0421\u0415\u041D\u041A\u041C\u041E\u0420\u0422\u0425\u0430\u0435\u043E\u0440\u0441\u0445]/g, (c) => CYRILLIC_MAP[c] || c);
  return khoa(fixed);
}

/** Kiểm tra URL thuộc tên miền `vbpl.vn` (thường 403/404 hoặc trang rỗng — bỏ qua). */
export function laUrlVbpl(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '').toLowerCase();
    return host === 'vbpl.vn' || host.endsWith('.vbpl.vn');
  } catch {
    return false;
  }
}

/** Xếp hạng ưu tiên host PDF bậc A: `datafiles.chinhphu.vn` → `congbaocdn.chinhphu.vn` → `g7.cdnchinhphu.vn` → còn lại. */
export function uuTienHostPdf(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '').toLowerCase();
    if (host === 'datafiles.chinhphu.vn' || host.endsWith('.datafiles.chinhphu.vn')) return 0;
    if (host === 'congbaocdn.chinhphu.vn' || host.endsWith('.congbaocdn.chinhphu.vn')) return 1;
    if (host === 'g7.cdnchinhphu.vn') return 2;
    if (host === 'congbao.chinhphu.vn' || host === 'vanban.chinhphu.vn' || host === 'chinhphu.vn' || host.endsWith('.chinhphu.vn')) return 3;
    return 4;
  } catch {
    return 9;
  }
}

function bacNguonHopLe(url, nguon = {}) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '').toLowerCase();
    if (host === 'cdnchinhphu.vn' || host.endsWith('.cdnchinhphu.vn')) return 'A';
  } catch {
    return 'C';
  }
  return bacNguon(url, nguon);
}

/** Chỉ giữ URL http(s) nguồn bậc A và loại bỏ `vbpl.vn` cũng như tệp không phải PDF (.doc/.html/ảnh). */
export function laUngVienPdfHopLe(url, nguon = {}) {
  let u;
  try {
    u = new URL(url);
  } catch {
    return { hopLe: false, lyDo: 'URL_KHONG_HOP_LE' };
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') {
    return { hopLe: false, lyDo: 'KHONG_PHAI_HTTP' };
  }
  if (laUrlVbpl(url)) {
    return { hopLe: false, lyDo: 'BO_QUA_VBPL' };
  }
  const bac = bacNguonHopLe(url, nguon);
  if (bac !== 'A') {
    return { hopLe: false, lyDo: `NGUON_BAC_${bac}` };
  }
  const fileName = u.searchParams.get('file_name') || '';
  if (RE_NON_PDF_EXT.test(u.pathname) || (fileName && RE_NON_PDF_EXT.test(fileName))) {
    return { hopLe: false, lyDo: 'KHONG_PHAI_PDF' };
  }
  return { hopLe: true };
}

function trongSoChiTietUrl(url) {
  let u;
  try { u = new URL(url); } catch { return 9; }
  const text = `${u.pathname} ${u.searchParams.get('file_name') || ''}`.toLowerCase();
  const hasSigned = /signed/.test(text) ? 0 : 1;
  const hasDotPdf = /\.pdf$/i.test(u.pathname) || /\.pdf$/i.test(u.searchParams.get('file_name') || '') ? 0 : 1;
  return hasSigned * 2 + hasDotPdf;
}

function coDauHieuPdf(rawUrl) {
  let u;
  try { u = new URL(rawUrl); } catch { return false; }
  const host = u.hostname.replace(/^www\./, '').toLowerCase();
  const path = u.pathname;
  const fileName = u.searchParams.get('file_name') || '';
  if (RE_NON_PDF_EXT.test(path) || (fileName && RE_NON_PDF_EXT.test(fileName))) return false;
  if (/\.pdf$/i.test(path) || /\.pdf$/i.test(fileName)) return true;
  if (host === 'congbaocdn.chinhphu.vn' && /pdf$/i.test(path)) return true;
  return /(?:FileDownload|tai-ve|download)/i.test(rawUrl);
}

/**
 * Tách, giải mã HTML entities, lọc nguồn C/vbpl và sắp xếp các URL PDF bậc A nhúng trong vỏ HTML.
 * Trả `{ urls, biLoai }` (trong đó `urls` đã sắp theo ưu tiên `datafiles` > `congbaocdn` > `g7`).
 */
export function phanTichUngVienPdf(htmlText, { baseUrl = '', nguon = {} } = {}) {
  const html = String(htmlText || '');
  const tho = new Set();

  const thuNhan = (rawCandidate, batBuocDauHieu = false) => {
    const decoded = giaiMaHtmlEntities(rawCandidate).trim();
    if (!decoded || /^(?:#|javascript:|mailto:|data:)/i.test(decoded)) return;
    let abs = decoded;
    if (baseUrl) {
      try { abs = new URL(decoded, baseUrl).toString(); } catch { /* giữ nguyên nếu không ghép được */ }
    }
    if (!/^https?:\/\//i.test(abs)) return;
    if (batBuocDauHieu && !coDauHieuPdf(abs)) return;
    tho.add(abs);
  };

  for (const m of html.matchAll(RE_ATTR_URL)) thuNhan(m[1], true);
  for (const m of html.matchAll(RE_ABS_PDF)) thuNhan(m[0], false);
  for (const m of html.matchAll(RE_STREAM_URL)) thuNhan(m[0], true);

  const hopLe = [];
  const biLoai = [];
  for (const url of tho) {
    const k = laUngVienPdfHopLe(url, nguon);
    if (k.hopLe) hopLe.push(url);
    else biLoai.push({ url, lyDo: k.lyDo });
  }

  hopLe.sort((a, b) => (
    uuTienHostPdf(a) - uuTienHostPdf(b)
    || trongSoChiTietUrl(a) - trongSoChiTietUrl(b)
    || a.localeCompare(b)
  ));

  return { urls: hopLe, biLoai };
}

/** Trả trực tiếp danh sách URL PDF bậc A đã giải mã và xếp ưu tiên. */
export function trichUrlPdfTuHtml(htmlText, opts = {}) {
  return phanTichUngVienPdf(htmlText, opts).urls;
}

/** Trích `<title>` và heading đầu trang từ vỏ HTML đã giải mã HTML entities. */
export function trichTieuDeHtml(htmlText) {
  const html = String(htmlText || '');
  const lay = (re) => {
    const m = html.match(re);
    return m ? giaiMaHtmlEntities(m[1].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim() : '';
  };
  const title = lay(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const h1 = lay(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return [title, h1].filter(Boolean).join(' | ');
}

function tachTuNghiaTen(s) {
  return boDau(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOPWORDS_TEN.has(w));
}

function layCacSoHieuTrongChuoi(s) {
  const out = [];
  const re = /(\d+\/(?:\d{4}\/)?[A-ZĐ0-9-]+)/gi;
  for (const m of String(s || '').matchAll(re)) {
    const k = chuanKhoaSoHieu(m[1]);
    if (/[A-Z]/.test(k) && /\d/.test(k)) out.push(k);
  }
  return out;
}

/**
 * Đối chiếu sơ bộ số hiệu & tiêu đề giữa sổ đăng ký và vỏ HTML (theo `docs/huong-dan-agent.md`)
 * nhằm phát hiện vỏ HTML tải nhầm trang chủ hoặc gắn nhầm văn bản khác.
 */
export function doiChieuSoHieuTieuDe(vanBan, htmlText) {
  const tieuDeHtml = trichTieuDeHtml(htmlText);
  if (!tieuDeHtml) {
    return { khop: false, lyDo: 'THIEU_TIEU_DE_HTML', tieuDeHtml: '', soHieuKhop: false, tiLeTrungTen: 0 };
  }
  if (/^(?:trang chủ|404|not found|error)/i.test(tieuDeHtml)) {
    return { khop: false, lyDo: 'TRANG_CHU_HOAC_LOI', tieuDeHtml, soHieuKhop: false, tiLeTrungTen: 0 };
  }

  const dsSoHieu = [vanBan.so_hieu, ...(Array.isArray(vanBan.so_hieu_khac) ? vanBan.so_hieu_khac : [])]
    .filter(Boolean)
    .map((s) => chuanKhoaSoHieu(s));
  if (vanBan.loai === 'VAN_BAN_HOP_NHAT' && vanBan.so_hieu) {
    const shortVbhn = String(vanBan.so_hieu).replace(/\/\d{4}(\/VBHN-)/i, '$1');
    if (shortVbhn !== vanBan.so_hieu) dsSoHieu.push(chuanKhoaSoHieu(shortVbhn));
  }

  const kTitle = chuanKhoaSoHieu(tieuDeHtml);
  const soHieuKhop = dsSoHieu.some((k) => k && kTitle.includes(k));

  const tenTokens = tachTuNghiaTen(vanBan.ten || '');
  const htmlTokens = new Set(tachTuNghiaTen(tieuDeHtml));
  const soTrung = tenTokens.filter((w) => htmlTokens.has(w)).length;
  const tiLeTrungTen = tenTokens.length ? soTrung / tenTokens.length : 1;

  if (soHieuKhop) {
    if (tenTokens.length >= 4 && soTrung === 0) {
      return { khop: false, lyDo: 'LECH_TIEU_DE_SO_VOI_SO', tieuDeHtml, soHieuKhop, tiLeTrungTen };
    }
    return { khop: true, lyDo: 'KHOP_SO_HIEU', tieuDeHtml, soHieuKhop, tiLeTrungTen };
  }

  const cacSoTrongHtml = layCacSoHieuTrongChuoi(tieuDeHtml);
  const coSoHieuKhac = cacSoTrongHtml.some((k) => !dsSoHieu.includes(k));
  if (!coSoHieuKhac && tiLeTrungTen >= 0.5) {
    return { khop: true, lyDo: 'KHOP_TIEU_DE', tieuDeHtml, soHieuKhop, tiLeTrungTen };
  }

  return { khop: false, lyDo: 'LECH_SO_HIEU_TIEU_DE', tieuDeHtml, soHieuKhop, tiLeTrungTen };
}

/** Kiểm magic `%PDF` >= 4 bytes và giới hạn kích thước mỗi tệp. */
export function kiemTraBufferPdf(buf, { maxFileBytes = MAC_DINH_MAX_FILE_BYTES } = {}) {
  const b = Buffer.isBuffer(buf) ? buf : Buffer.from(buf || '');
  if (b.length < 4) return { ok: false, lyDo: 'TEP_QUA_NHO', bytes: b.length };
  if (b.subarray(0, 4).toString('latin1') !== '%PDF') {
    return { ok: false, lyDo: 'KHONG_PHAI_MAGIC_PDF', bytes: b.length };
  }
  if (b.length > maxFileBytes) {
    return { ok: false, lyDo: 'VUOT_GIOI_HAN_TEP', bytes: b.length };
  }
  return { ok: true, bytes: b.length };
}

async function docBodyCoGioiHan(res, { maxBytes }) {
  if (res.body && typeof res.body.getReader === 'function') {
    const reader = res.body.getReader();
    const chunks = [];
    let tong = 0;
    let daKiemMagic = false;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!value || !value.byteLength) continue;
        const chunk = Buffer.from(value.buffer, value.byteOffset, value.byteLength);
        tong += chunk.length;
        if (tong > maxBytes) {
          await reader.cancel().catch(() => {});
          return { ok: false, lyDo: 'VUOT_GIOI_HAN_TAI', bytes: tong };
        }
        chunks.push(chunk);
        if (!daKiemMagic && tong >= 4) {
          daKiemMagic = true;
          const head = Buffer.concat(chunks, Math.min(tong, 8)).subarray(0, 4).toString('latin1');
          if (head !== '%PDF') {
            await reader.cancel().catch(() => {});
            return { ok: false, lyDo: 'KHONG_PHAI_MAGIC_PDF', bytes: tong };
          }
        }
      }
      return { ok: true, buf: Buffer.concat(chunks, tong) };
    } catch (e) {
      await reader.cancel().catch(() => {});
      throw e;
    }
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > maxBytes) return { ok: false, lyDo: 'VUOT_GIOI_HAN_TAI', bytes: buf.length };
  return { ok: true, buf };
}

/**
 * Tải một URL PDF với kiểm soát redirect, HTTP status, giới hạn tệp/tổng đợt và magic `%PDF`.
 */
export async function taiUrlPdfCoGioiHan(url, {
  fetchImpl = fetch,
  maxFileBytes = MAC_DINH_MAX_FILE_BYTES,
  maxRemainingBytes = MAC_DINH_MAX_TOTAL_BYTES,
  timeoutMs = 45000,
  nguon = {},
} = {}) {
  const kiemUrl = laUngVienPdfHopLe(url, nguon);
  if (!kiemUrl.hopLe) return { ok: false, lyDo: kiemUrl.lyDo, url };

  let res;
  try {
    res = await fetchImpl(url, {
      headers: { 'user-agent': UA },
      redirect: 'follow',
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (e) {
    const msg = String(e?.cause?.code || e?.message || e).split('\n')[0];
    return { ok: false, lyDo: `LOI_MANG:${msg}`, url };
  }

  const finalUrl = res.url || url;
  const kiemFinal = laUngVienPdfHopLe(finalUrl, nguon);
  if (!kiemFinal.hopLe) {
    if (res.body?.cancel) await res.body.cancel().catch(() => {});
    return { ok: false, lyDo: `REDIRECT_${kiemFinal.lyDo}`, url, finalUrl };
  }

  if (!res.ok) {
    if (res.body?.cancel) await res.body.cancel().catch(() => {});
    return { ok: false, lyDo: `HTTP_${res.status}`, status: res.status, url, finalUrl };
  }

  const clRaw = res.headers?.get?.('content-length');
  const cl = clRaw ? Number(clRaw) : 0;
  if (Number.isFinite(cl) && cl > 0) {
    if (cl > maxFileBytes) {
      if (res.body?.cancel) await res.body.cancel().catch(() => {});
      return { ok: false, lyDo: 'VUOT_GIOI_HAN_TEP', bytes: cl, url, finalUrl };
    }
    if (cl > maxRemainingBytes) {
      if (res.body?.cancel) await res.body.cancel().catch(() => {});
      return { ok: false, lyDo: 'VUOT_NGAN_SACH_DOT', bytes: cl, url, finalUrl };
    }
  }

  const tran = Math.min(maxFileBytes, maxRemainingBytes);
  let doc;
  try {
    doc = await docBodyCoGioiHan(res, { maxBytes: tran });
  } catch (e) {
    const msg = String(e?.cause?.code || e?.message || e).split('\n')[0];
    return { ok: false, lyDo: `LOI_DOC_LUONG:${msg}`, url, finalUrl };
  }
  if (!doc.ok) {
    const lyDo = doc.lyDo === 'VUOT_GIOI_HAN_TAI'
      ? (doc.bytes > maxFileBytes ? 'VUOT_GIOI_HAN_TEP' : 'VUOT_NGAN_SACH_DOT')
      : doc.lyDo;
    return { ok: false, lyDo, bytes: doc.bytes, url, finalUrl };
  }

  const kiemPdf = kiemTraBufferPdf(doc.buf, { maxFileBytes });
  if (!kiemPdf.ok) {
    return { ok: false, lyDo: kiemPdf.lyDo, bytes: kiemPdf.bytes, url, finalUrl };
  }

  return {
    ok: true,
    buf: doc.buf,
    bytes: doc.buf.length,
    contentType: res.headers?.get?.('content-type') || 'application/pdf',
    url,
    finalUrl,
  };
}

/**
 * Lưu tệp PDF + `.nguon.json` theo quy ước `tools/nap.mjs` (không ghi đè tệp khác SHA-256)
 * và cập nhật `toan_van` + `nguon` trong `registry/van-ban/<slug>.yaml`.
 */
export function ghiPdfVaCapNhatSo({
  root = ROOT,
  vanBan,
  url,
  buf,
  contentType = 'application/pdf',
  today = homNay(),
  nguon = {},
  kiemPdfFn = kiemTraPdfCoLopChu,
}) {
  const host = new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  const nam = String(vanBan.ngay_ban_hanh || '').slice(0, 4) || null;
  const slug = vanBan._slug || slugTuSoHieu(vanBan.so_hieu, nam);
  const rel = join('raw', 'download', host, `${slug}.pdf`).replace(/\\/g, '/');
  const abs = join(root, rel);
  const sha256 = createHash('sha256').update(buf).digest('hex');

  if (existsSync(abs)) {
    const cu = createHash('sha256').update(readFileSync(abs)).digest('hex');
    if (cu !== sha256) {
      return { ok: false, lyDo: 'DA_CO_TEP_KHAC_SHA256', tep: rel };
    }
  }

  const pdfInfo = kiemPdfFn(buf);
  if (!existsSync(abs)) {
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, buf);
    const meta = {
      url,
      truy_cap: today,
      sha256,
      content_type: contentType,
      bytes: buf.length,
      bac_nguon: bacNguonHopLe(url, nguon),
      so_hieu: vanBan.so_hieu,
      co_lop_chu: pdfInfo.co_lop_chu,
      loai_tep_raw: pdfInfo.trang_thai,
    };
    writeFileSync(`${abs}.nguon.json`, `${JSON.stringify(meta, null, 2)}\n`, 'utf8');
  }

  const fp = join(root, vanBan._file);
  const rawYaml = readFileSync(fp, 'utf8');
  const lines = rawYaml.split('\n');
  const headLines = [];
  for (const l of lines) {
    if (l.startsWith('#')) headLines.push(l);
    else break;
  }
  const head = headLines.join('\n');
  const obj = yaml.load(rawYaml, { schema: yaml.CORE_SCHEMA });
  obj.toan_van = rel;
  obj.nguon = obj.nguon || [];
  if (!obj.nguon.some((n) => n?.url === url)) obj.nguon.push({ url, truy_cap: today });
  writeFileSync(fp, `${head ? `${head}\n` : ''}${yaml.dump(obj, { lineWidth: -1, noRefs: true })}`, 'utf8');

  return { ok: true, tep: rel, sha256, bytes: buf.length, trang_thai_pdf: pdfInfo.trang_thai };
}

function timBaseUrlChoVoHtml(vanBan, absHtmlPath) {
  const nguonJsonPath = `${absHtmlPath}.nguon.json`;
  if (existsSync(nguonJsonPath)) {
    try {
      const meta = JSON.parse(readFileSync(nguonJsonPath, 'utf8'));
      if (meta?.url) return meta.url;
    } catch { /* bỏ qua nếu hỏng */ }
  }
  const ds = Array.isArray(vanBan.nguon) ? vanBan.nguon : [];
  return ds.find((n) => /^https?:\/\//i.test(n?.url || ''))?.url || '';
}

function docDanhSachVoHtml(root, reportPath) {
  if (reportPath) {
    const raw = JSON.parse(readFileSync(resolve(reportPath), 'utf8'));
    if (Array.isArray(raw?.nhom?.VO_HTML_CHUA_TAI_PDF)) return raw.nhom.VO_HTML_CHUA_TAI_PDF;
    if (Array.isArray(raw?.uu_tien_tai_pdf_tu_vo_html)) return raw.uu_tien_tai_pdf_tu_vo_html;
    throw new Error(`Báo cáo không có danh sách VO_HTML_CHUA_TAI_PDF: ${reportPath}`);
  }
  return kiemToanKhoNap(root).nhom.VO_HTML_CHUA_TAI_PDF;
}

/**
 * Chạy luồng tải PDF bậc A từ các vỏ HTML thuộc nhóm `VO_HTML_CHUA_TAI_PDF`.
 */
export async function chayTaiPdfTuVoHtml({
  root = ROOT,
  reportPath = null,
  limit = MAC_DINH_LIMIT,
  maxFileBytes = MAC_DINH_MAX_FILE_BYTES,
  maxTotalBytes = MAC_DINH_MAX_TOTAL_BYTES,
  dryRun = false,
  soHieuFilter = [],
  fetchImpl = fetch,
  kiemPdfFn = kiemTraPdfCoLopChu,
  today = homNay(),
  logger = console,
} = {}) {
  const so = napSo(root);
  const bySlug = new Map(so.vanBan.map((d) => [d._slug, d]));
  let danhSach = docDanhSachVoHtml(root, reportPath);
  if (soHieuFilter.length) {
    const tap = new Set(soHieuFilter.map((s) => khoa(s)));
    danhSach = danhSach.filter((x) => tap.has(khoa(x.so_hieu)));
  }

  const daTai = [];
  const boQua = [];
  const loi = [];
  let tongBytes = 0;
  let tongXet = 0;

  for (const muc of danhSach) {
    if (limit > 0 && daTai.length >= limit) break;
    if (tongBytes >= maxTotalBytes) break;

    const vanBan = bySlug.get(muc.slug) || so.theoKhoa.get(khoa(muc.so_hieu))?.[0];
    if (!vanBan || !muc.tep_raw) {
      boQua.push({ so_hieu: muc.so_hieu, lyDo: 'KHONG_TIM_THAY_VAN_BAN_HOAC_VO_HTML' });
      continue;
    }

    const absHtml = join(root, muc.tep_raw);
    if (!existsSync(absHtml)) {
      boQua.push({ so_hieu: muc.so_hieu, lyDo: 'THIEU_TEP_VO_HTML', tep_raw: muc.tep_raw });
      continue;
    }

    tongXet += 1;
    const htmlText = readFileSync(absHtml, 'utf8');
    const doiChieu = doiChieuSoHieuTieuDe(vanBan, htmlText);
    if (!doiChieu.khop) {
      boQua.push({ so_hieu: vanBan.so_hieu, lyDo: doiChieu.lyDo, tieu_de_html: doiChieu.tieuDeHtml });
      logger.warn?.(`⏭  Bỏ qua ${vanBan.so_hieu}: ${doiChieu.lyDo} (${doiChieu.tieuDeHtml})`);
      continue;
    }

    const baseUrl = timBaseUrlChoVoHtml(vanBan, absHtml);
    const { urls, biLoai } = phanTichUngVienPdf(htmlText, { baseUrl, nguon: so.nguon });
    if (!urls.length) {
      boQua.push({ so_hieu: vanBan.so_hieu, lyDo: 'KHONG_CO_URL_PDF_BAC_A', bi_loai: biLoai });
      logger.warn?.(`⏭  Bỏ qua ${vanBan.so_hieu}: không có URL PDF bậc A (${biLoai.map((b) => b.lyDo).join(', ') || 'trống'})`);
      continue;
    }

    if (dryRun) {
      daTai.push({ so_hieu: vanBan.so_hieu, url: urls[0], tep: null, bytes: 0, dry_run: true });
      logger.log?.(`🔍 [dry-run] ${vanBan.so_hieu} → ${urls[0]}`);
      continue;
    }

    let thanhCong = null;
    const loiThu = [];
    for (const url of urls) {
      const r = await taiUrlPdfCoGioiHan(url, {
        fetchImpl,
        maxFileBytes,
        maxRemainingBytes: maxTotalBytes - tongBytes,
        nguon: so.nguon,
      });
      if (!r.ok) {
        loiThu.push({ url, lyDo: r.lyDo });
        continue;
      }
      const g = ghiPdfVaCapNhatSo({
        root,
        vanBan,
        url: r.finalUrl || url,
        buf: r.buf,
        contentType: r.contentType,
        today,
        nguon: so.nguon,
        kiemPdfFn,
      });
      if (!g.ok) {
        loiThu.push({ url, lyDo: g.lyDo });
        continue;
      }
      tongBytes += g.bytes;
      thanhCong = { so_hieu: vanBan.so_hieu, url: r.finalUrl || url, ...g };
      daTai.push(thanhCong);
      logger.log?.(`✅ ${vanBan.so_hieu} → ${g.tep} (${(g.bytes / 1024 / 1024).toFixed(2)} MB, ${g.trang_thai_pdf})`);
      break;
    }

    if (!thanhCong) {
      const chiBudget = loiThu.every((x) => x.lyDo === 'VUOT_NGAN_SACH_DOT' || x.lyDo === 'VUOT_GIOI_HAN_TEP');
      const mucLoi = { so_hieu: vanBan.so_hieu, loi: loiThu };
      if (chiBudget) boQua.push({ so_hieu: vanBan.so_hieu, lyDo: loiThu[0].lyDo, chi_tiet: loiThu });
      else loi.push(mucLoi);
      logger.warn?.(`⚠️  Thất bại ${vanBan.so_hieu}: ${loiThu.map((x) => `${x.lyDo} (${x.url})`).join('; ')}`);
    }
  }

  return {
    tong_xet: tongXet,
    da_tai: daTai,
    bo_qua: boQua,
    loi,
    tong_bytes: tongBytes,
  };
}

function phanTichCliArgs(argv) {
  const opts = {
    limit: MAC_DINH_LIMIT,
    maxFileBytes: MAC_DINH_MAX_FILE_BYTES,
    maxTotalBytes: MAC_DINH_MAX_TOTAL_BYTES,
    dryRun: false,
    json: false,
    reportPath: null,
    soHieuFilter: [],
  };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--json') opts.json = true;
    else if (a === '--limit' && argv[i + 1]) opts.limit = Number(argv[++i]);
    else if (a.startsWith('--limit=')) opts.limit = Number(a.slice('--limit='.length));
    else if (a === '--max-total-mb' && argv[i + 1]) opts.maxTotalBytes = Number(argv[++i]) * 1024 * 1024;
    else if (a.startsWith('--max-total-mb=')) opts.maxTotalBytes = Number(a.slice('--max-total-mb='.length)) * 1024 * 1024;
    else if (a === '--max-file-mb' && argv[i + 1]) opts.maxFileBytes = Number(argv[++i]) * 1024 * 1024;
    else if (a.startsWith('--max-file-mb=')) opts.maxFileBytes = Number(a.slice('--max-file-mb='.length)) * 1024 * 1024;
    else if (a === '--report' && argv[i + 1]) opts.reportPath = argv[++i];
    else if (a.startsWith('--report=')) opts.reportPath = a.slice('--report='.length);
    else if (a === '--so-hieu' && argv[i + 1]) opts.soHieuFilter.push(argv[++i]);
    else if (a.startsWith('--so-hieu=')) opts.soHieuFilter.push(a.slice('--so-hieu='.length));
  }
  return opts;
}

async function main() {
  const opts = phanTichCliArgs(process.argv.slice(2));
  const kq = await chayTaiPdfTuVoHtml(opts);
  if (opts.json) {
    process.stdout.write(`${JSON.stringify(kq, null, 2)}\n`);
  } else {
    console.log(
      `\nTổng xét: ${kq.tong_xet} · Đã tải: ${kq.da_tai.length} · Bỏ qua: ${kq.bo_qua.length} · Lỗi: ${kq.loi.length} · Dung lượng: ${(kq.tong_bytes / 1024 / 1024).toFixed(2)} MB`,
    );
  }
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  await main();
}
