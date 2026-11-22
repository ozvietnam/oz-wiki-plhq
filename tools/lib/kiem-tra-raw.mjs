// Kiểm toán chất lượng tệp thô trong raw/ và tách vỏ HTML Công báo khỏi toàn văn thật.
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, basename } from 'node:path';
import { ROOT, napSo } from './registry.mjs';

const RE_DIEU_START = /(?:^|\n)\s*Điều\s+\d+[a-z]?\s*[.:–-]/im;
const RE_DIEU_ANY = /Điều\s+\d+\s*[.:]/g;

function decodeHtmlEntities(s) {
  return String(s || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => {
      const code = Number(n);
      return Number.isFinite(code) ? String.fromCodePoint(code) : '';
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => {
      const code = parseInt(h, 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : '';
    });
}

/** HTML → chữ sạch để kiểm tra toàn văn. */
export function lamSachHtmlDeKiem(html) {
  return decodeHtmlEntities(html)
    .replace(/<(script|style|noscript|nav|header|footer|form)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|tr|h[1-6]|table|section|article)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[ \t\f\v]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .normalize('NFC')
    .trim();
}

function uuTienNguonPdf(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '').toLowerCase();
    if (host.endsWith('congbao.chinhphu.vn') || host.endsWith('congbaocdn.chinhphu.vn')) return 0;
    if (host.endsWith('datafiles.chinhphu.vn') || host.endsWith('vanban.chinhphu.vn')) return 1;
    if (host.endsWith('vbpl.vn') || host.endsWith('customs.gov.vn') || host.endsWith('.gov.vn')) return 2;
    return 5;
  } catch {
    return 9;
  }
}

/**
 * Phân tích HTML tải về: phân biệt HTML chứa toàn văn `Điều N` với vỏ HTML Công báo / pdf.js,
 * đồng thời bóc mọi URL PDF ký nhúng trong `data-file`, `data-href`, `href`, `FileDownload`.
 */
export function phanTichHtmlRaw(htmlText, baseUrl = '') {
  const raw = String(htmlText || '');
  const text = lamSachHtmlDeKiem(raw);
  const matches = text.match(RE_DIEU_ANY) || [];
  const coToanVan = RE_DIEU_START.test(text) || matches.length >= 2;

  const pdfCandidates = new Set();
  const addUrl = (u) => {
    const trimmed = String(u || '').trim().replace(/&amp;/g, '&');
    if (!trimmed || trimmed.startsWith('javascript:')) return;
    try {
      const abs = baseUrl ? new URL(trimmed, baseUrl).toString() : trimmed;
      if (/^https?:\/\//i.test(abs)) pdfCandidates.add(abs);
    } catch {
      if (/^https?:\/\//i.test(trimmed)) pdfCandidates.add(trimmed);
    }
  };

  for (const m of raw.matchAll(/https?:\/\/[^"'\s<>]+\.pdf(?:\?[^"'\s<>]*)?/gi)) {
    addUrl(m[0]);
  }
  for (const m of raw.matchAll(/(?:data-file|data-href|data-src|data-url|href|src)\s*=\s*["']([^"']+\.pdf(?:\?[^"']*)?)["']/gi)) {
    addUrl(m[1]);
  }
  for (const m of raw.matchAll(/(?:data-file|data-href|href)\s*=\s*["']([^"']*(?:FileDownload|tai-ve|download)[^"']*)["']/gi)) {
    addUrl(m[1]);
  }

  const pdfUrls = [...pdfCandidates].sort((a, b) => uuTienNguonPdf(a) - uuTienNguonPdf(b) || a.localeCompare(b));
  const laVoHtmlPdf = !coToanVan && (/pdfjs|data-file|data-href|congbao\.chinhphu\.vn|FileDownload/i.test(raw) || pdfUrls.length > 0);
  const loaiTepRaw = coToanVan ? 'HTML_CO_TOAN_VAN' : laVoHtmlPdf ? 'VO_HTML_PDF' : 'HTML_KHONG_TOAN_VAN';

  return {
    co_toan_van: coToanVan,
    la_vo_html_pdf: laVoHtmlPdf,
    loai_tep_raw: loaiTepRaw,
    so_dieu_phat_hien: matches.length,
    do_dai_chu: text.length,
    pdf_nhung: pdfUrls.slice(0, 10),
    chu_sach: text,
  };
}

/**
 * Kiểm tra PDF có lớp chữ bằng `pdftotext -layout - -`.
 * Luôn xử lý an toàn nếu máy chưa cài `pdftotext` (`KHONG_CO_PDFTOTEXT`).
 */
export function kiemTraPdfCoLopChu(pdfBuffer, { pdftotextBin = 'pdftotext', _spawnSync = spawnSync } = {}) {
  const buf = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer || '');
  if (buf.length < 4) {
    return { trang_thai: 'LOI_DOC_PDF', co_lop_chu: false, co_dieu_khoan: false, so_ky_tu: 0 };
  }
  const res = _spawnSync(pdftotextBin, ['-layout', '-', '-'], {
    input: buf,
    maxBuffer: 25 * 1024 * 1024,
    timeout: 8000,
  });
  if (res.error) {
    if (res.error.code === 'ENOENT') {
      return { trang_thai: 'KHONG_CO_PDFTOTEXT', co_lop_chu: null, co_dieu_khoan: null, so_ky_tu: 0 };
    }
    return { trang_thai: 'LOI_DOC_PDF', co_lop_chu: false, co_dieu_khoan: false, so_ky_tu: 0 };
  }
  if (res.status !== null && res.status !== 0) {
    return { trang_thai: 'LOI_DOC_PDF', co_lop_chu: false, co_dieu_khoan: false, so_ky_tu: 0 };
  }
  const chu = (res.stdout || Buffer.alloc(0)).toString('utf8').normalize('NFC').trim();
  const soKyTu = chu.length;
  if (soKyTu < 200) {
    return { trang_thai: 'PDF_BAN_SCAN_CAN_OCR', co_lop_chu: false, co_dieu_khoan: false, so_ky_tu: soKyTu };
  }
  const matches = chu.match(RE_DIEU_ANY) || [];
  const coDieu = RE_DIEU_START.test(chu) || matches.length >= 2;
  return {
    trang_thai: coDieu ? 'PDF_CO_TOAN_VAN' : 'PDF_CO_CHU_KHONG_DIEU',
    co_lop_chu: true,
    co_dieu_khoan: coDieu,
    so_ky_tu: soKyTu,
    so_dieu_phat_hien: matches.length,
  };
}

function lietKeTep(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) lietKeTep(p, out);
    else out.push(p);
  }
  return out;
}

/**
 * Kiểm toán toàn bộ VBQPPL hiện hành (`CON_HIEU_LUC`, `HET_HIEU_LUC_MOT_PHAN`, bỏ qua `TB_TCHQ`)
 * thành 5 nhóm rõ ràng, kèm danh sách ưu tiên OCR / tải PDF / nạp tri thức.
 */
export function kiemToanKhoNap(root = ROOT, { kiemPdf = true } = {}) {
  const so = napSo(root);
  const wikiSrc = new Set(
    existsSync(join(root, 'wiki', 'sources'))
      ? readdirSync(join(root, 'wiki', 'sources')).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))
      : [],
  );
  const dhFiles = existsSync(join(root, 'data', 'doc-hieu'))
    ? readdirSync(join(root, 'data', 'doc-hieu')).filter((f) => f.endsWith('.dieu.jsonl'))
    : [];
  const rawAll = lietKeTep(join(root, 'raw')).map((p) => p.slice(root.length + 1)).filter((p) => !p.includes('tb-tchq'));
  const rawByStem = new Map();
  for (const rf of rawAll) {
    const stem = basename(rf).replace(/\.[^.]+$/, '');
    if (!rawByStem.has(stem)) rawByStem.set(stem, []);
    rawByStem.get(stem).push(rf);
  }

  // Đếm mức độ tham chiếu trong các văn bản khác (ưu tiên văn bản nền được dẫn nhiều)
  const citedCount = new Map();
  for (const d of so.vanBan) {
    for (const ds of Object.values(d.quan_he || {})) {
      for (const edge of ds || []) {
        const target = typeof edge === 'string' ? edge : edge?.van_ban;
        if (target) citedCount.set(target, (citedCount.get(target) || 0) + 1);
      }
    }
  }

  const nhom = {
    DA_INGEST_TRI_THUC: [],
    CO_TOAN_VAN_CHUA_INGEST: [],
    PDF_BAN_SCAN_CAN_OCR: [],
    VO_HTML_CHUA_TAI_PDF: [],
    THIEU_RAW: [],
  };

  let coPdftotext = true;
  for (const d of so.vanBan) {
    if (d.loai === 'TB_TCHQ' || String(d.so_hieu).includes('TB-TCHQ') || String(d.so_hieu).includes('TB-CHQ')) continue;
    if (!['CON_HIEU_LUC', 'HET_HIEU_LUC_MOT_PHAN'].includes(d.tinh_trang)) continue;

    const slug = d._slug;
    const coWiki = wikiSrc.has(slug);
    const coDka = Array.isArray(d.xac_minh?.dieu_khoan) && d.xac_minh.dieu_khoan.length > 0;
    const coDh = dhFiles.some((f) => f.includes(slug));
    const refsCount = citedCount.get(d.so_hieu) || 0;
    const itemBase = { so_hieu: d.so_hieu, loai: d.loai, slug, tinh_trang: d.tinh_trang, tham_chieu: refsCount };

    if (coWiki || coDka || coDh) {
      nhom.DA_INGEST_TRI_THUC.push({ ...itemBase, co_wiki: coWiki, co_dka: coDka, co_doc_hieu: coDh });
      continue;
    }

    const candidates = [];
    if (typeof d.toan_van === 'string' && existsSync(join(root, d.toan_van))) candidates.push(d.toan_van);
    for (const r of rawByStem.get(slug) || []) if (!candidates.includes(r)) candidates.push(r);

    let phanLoai = 'THIEU_RAW';
    let bestFile = candidates[0] || null;
    let pdfLinks = [];

    for (const rel of candidates) {
      const abs = join(root, rel);
      const ext = extname(rel).toLowerCase();
      if (ext === '.pdf') {
        if (!kiemPdf) {
          phanLoai = 'CO_TOAN_VAN_CHUA_INGEST';
          bestFile = rel;
          break;
        }
        const pdfRes = kiemTraPdfCoLopChu(readFileSync(abs));
        if (pdfRes.trang_thai === 'KHONG_CO_PDFTOTEXT') {
          coPdftotext = false;
          phanLoai = 'CO_TOAN_VAN_CHUA_INGEST';
          bestFile = rel;
          break;
        }
        if (pdfRes.co_lop_chu) {
          phanLoai = 'CO_TOAN_VAN_CHUA_INGEST';
          bestFile = rel;
          break;
        }
        if (phanLoai === 'THIEU_RAW') {
          phanLoai = 'PDF_BAN_SCAN_CAN_OCR';
          bestFile = rel;
        }
      } else if (ext === '.html' || ext === '.htm') {
        const info = phanTichHtmlRaw(readFileSync(abs, 'utf8'));
        if (info.co_toan_van) {
          phanLoai = 'CO_TOAN_VAN_CHUA_INGEST';
          bestFile = rel;
          break;
        }
        if (info.la_vo_html_pdf && phanLoai === 'THIEU_RAW') {
          phanLoai = 'VO_HTML_CHUA_TAI_PDF';
          bestFile = rel;
          pdfLinks = info.pdf_nhung;
        }
      } else if (ext === '.txt') {
        const txt = readFileSync(abs, 'utf8');
        if (RE_DIEU_START.test(txt) || (txt.match(RE_DIEU_ANY) || []).length >= 2) {
          phanLoai = 'CO_TOAN_VAN_CHUA_INGEST';
          bestFile = rel;
          break;
        }
      } else if (ext === '.docx' || ext === '.doc' || ext === '.md') {
        if (statSync(abs).size > 500) {
          phanLoai = 'CO_TOAN_VAN_CHUA_INGEST';
          bestFile = rel;
          break;
        }
      }
    }

    nhom[phanLoai].push({
      ...itemBase,
      tep_raw: bestFile,
      ...(pdfLinks.length ? { pdf_nhung: pdfLinks.slice(0, 3) } : {}),
    });
  }

  const byUuTien = (a, b) => {
    const loaiScore = (x) => (x === 'LUAT' ? 3 : x === 'NGHI_DINH' ? 2 : x === 'THONG_TU' ? 1 : 0);
    return b.tham_chieu - a.tham_chieu || loaiScore(b.loai) - loaiScore(a.loai) || a.so_hieu.localeCompare(b.so_hieu);
  };
  for (const arr of Object.values(nhom)) arr.sort(byUuTien);

  const tong = Object.values(nhom).reduce((n, arr) => n + arr.length, 0);
  return {
    tong_vb_hien_hanh: tong,
    co_pdftotext: coPdftotext,
    thong_ke: {
      DA_INGEST_TRI_THUC: nhom.DA_INGEST_TRI_THUC.length,
      CO_TOAN_VAN_CHUA_INGEST: nhom.CO_TOAN_VAN_CHUA_INGEST.length,
      PDF_BAN_SCAN_CAN_OCR: nhom.PDF_BAN_SCAN_CAN_OCR.length,
      VO_HTML_CHUA_TAI_PDF: nhom.VO_HTML_CHUA_TAI_PDF.length,
      THIEU_RAW: nhom.THIEU_RAW.length,
    },
    uu_tien_ocr: nhom.PDF_BAN_SCAN_CAN_OCR.slice(0, 30),
    uu_tien_tai_pdf_tu_vo_html: nhom.VO_HTML_CHUA_TAI_PDF.slice(0, 30),
    uu_tien_ingest_toan_van: nhom.CO_TOAN_VAN_CHUA_INGEST.slice(0, 30),
    uu_tien_thieu_raw: nhom.THIEU_RAW.slice(0, 30),
    nhom,
  };
}
