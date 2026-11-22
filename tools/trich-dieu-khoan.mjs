#!/usr/bin/env node
// Tự động trích xuất điều khoản nguyên văn (xac_minh.dieu_khoan) từ tệp toàn văn trên đĩa
// (.ocr.txt / .txt / .md, PDF lớp chữ qua `pdftotext`, hoặc .docx qua `unzip -p`)
// và tự kiểm chứng 100% bằng `chuanHoaKhopNguyenVan` trước khi ghi YAML.
//
//   node tools/trich-dieu-khoan.mjs (--slugs a,b,c | --slug <slug> | --all-ready) [--max-clauses 10] [--force] [--dry-run] [--json]
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, isAbsolute, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import yaml from 'js-yaml';
import { chuanHoaKhopNguyenVan } from './kiem-tra-dieu-khoan.mjs';
import { napSo, ROOT } from './lib/registry.mjs';

export const MAC_DINH_MAX_CLAUSES = 10;
const GIOI_HAN_GIU_DU = 12;
const MIN_DOAN_KY_TU = 100;
const MAX_DOAN_KY_TU = 450;
const MIN_KHOI_KY_TU = 40;
const NGUONG_KY_TU_LOP_CHU = 50;
const MAX_BUFFER = 64 * 1024 * 1024;

const RE_CONG_BAO_HEADER_DAU = /^\s*CÔNG BÁO\/Số[^\r\n]*(?:\r?\n+\s*\d{1,4}\s*(?=\r?\n|$))?/i;
const RE_CONG_BAO_HEADER_LINE = /^\s*CÔNG BÁO\/Số[^\r\n]*(?:\r?\n+\s*\d{1,4}\s*(?=\r?\n|$))?/gim;
const RE_DIEU_LINE = /^\s*Điều\s+(\d+)([a-zđ])?\s*[.:–-](?=\s|$|\p{L})/iu;
const RE_MUC_LUC_DOTS = /(?:\.{3,}|…+|(?:\.\s+){3,})\s*\d+\s*$/;
const RE_CUOI_VAN_BAN = /^\s*(?:N[oơ]i nhận\s*:|TM\.\s*(?:CH[IÍ]NH PH[UỦ]|ỦY BAN|QUỐC HỘI)(?![\p{L}\p{N}_])|KT\.\s*(?:THỦ TƯỚNG|BỘ TRƯỞNG|CHỦ TỊCH)(?![\p{L}\p{N}_])|TL\.\s*BỘ TRƯỞNG(?![\p{L}\p{N}_])|PHỤ LỤC(?:\s+[IVXLCD\d]+)?\s*$)/iu;
const RE_THAM_CHIEU_NOI_TIEP = /\b(?:tại|theo|của|trong|với|và|hoặc|các|như|khoản\s+\d+|điểm\s+[a-zđ])\s*$/iu;
const RE_MO_TRICH_DAN = /như sau\s*:\s*$/iu;

function phatHienCongCu(bin, args = ['-v']) {
  try {
    const r = spawnSync(bin, args, { encoding: 'utf8' });
    return !r.error && (r.status === 0 || r.status === 1 || String(`${r.stdout || ''}${r.stderr || ''}`).length > 0);
  } catch {
    return false;
  }
}

export function tachTrang(rawText) {
  const pages = String(rawText ?? '').split('\f');
  if (pages.length > 1 && pages[pages.length - 1] === '') pages.pop();
  return pages;
}

export function boHeaderCongBao(text) {
  return String(text ?? '')
    .replace(RE_CONG_BAO_HEADER_DAU, '')
    .replace(RE_CONG_BAO_HEADER_LINE, '');
}

function giaiMaXmlEntities(s) {
  return String(s ?? '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => {
      const code = Number(n);
      return Number.isInteger(code) && code >= 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '';
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => {
      const code = parseInt(h, 16);
      return Number.isInteger(code) && code >= 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '';
    })
    .replace(/&amp;/g, '&');
}

export function trichDoanTuDocxXml(xml) {
  const paragraphs = [];
  for (const m of String(xml ?? '').matchAll(/<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>/g)) {
    const inner = m[1]
      .replace(/<w:tab\b[^>]*\/>/g, ' ')
      .replace(/<w:(?:br|cr)\b[^>]*\/>/g, '\n')
      .replace(/<[^>]+>/g, '');
    const cleaned = giaiMaXmlEntities(inner).replace(/[ \t]+/g, ' ').trim();
    if (cleaned) paragraphs.push(cleaned);
  }
  return paragraphs.join('\n');
}

export function layDanhSachToanVan(d, root = ROOT) {
  const raw = d?.toan_van;
  const list = Array.isArray(raw) ? raw : raw != null ? [raw] : [];
  const out = [];
  for (const entry of list) {
    const rel = typeof entry === 'string'
      ? entry.trim()
      : entry && typeof entry === 'object' && typeof (entry.tep || entry.path) === 'string'
        ? String(entry.tep || entry.path).trim()
        : '';
    if (!rel || rel === 'chua_co') continue;
    const abs = isAbsolute(rel) ? rel : join(root, rel);
    const normRel = rel.replace(/\\/g, '/').replace(/^\.\//, '');
    out.push({
      rel: normRel,
      abs,
      ext: extname(normRel).toLowerCase(),
      isOcrTxt: /\.ocr\.txt$/i.test(normRel),
      isWiki: /^wiki\/(?:sources|concepts|summary)\//i.test(normRel),
      exists: existsSync(abs),
    });
  }
  return out;
}

function uuTienNguonDoc(fileInfo) {
  if (fileInfo.isOcrTxt) return 0;
  if (fileInfo.ext === '.txt') return 1;
  if (fileInfo.ext === '.md' && !fileInfo.isWiki) return 2;
  if (fileInfo.ext === '.pdf') return 3;
  if (fileInfo.ext === '.docx') return 4;
  return 9;
}

function tinhSha256(absPath) {
  return createHash('sha256').update(readFileSync(absPath)).digest('hex');
}

function laPdfBanScan(out, pages) {
  const trimmed = String(out ?? '').trim();
  if (trimmed.length < NGUONG_KY_TU_LOP_CHU) return true;
  if (trimmed.length < 500 && /(?:Ký bởi:|Ngày ký:|Thời gian ký:|SAO Y;)/i.test(trimmed)) {
    const nonEmptyPages = pages.filter((p) => p.trim().length > 0).length;
    if (nonEmptyPages <= 1) return true;
  }
  return false;
}

function docMotTep(fileInfo, { coPdftotext, docPdf, coUnzip, docDocx }) {
  if (fileInfo.ext === '.txt' || fileInfo.ext === '.md') {
    const raw = readFileSync(fileInfo.abs, 'utf8');
    const pages = tachTrang(raw);
    return { ok: true, kind: fileInfo.isOcrTxt ? 'ocr_txt' : 'text', fileInfo, raw, pages };
  }
  if (fileInfo.ext === '.pdf') {
    if (!coPdftotext) {
      return { ok: false, code: 'THIEU_PDFTOTEXT', err: `thiếu pdftotext để đọc ${fileInfo.rel}` };
    }
    let out = '';
    if (typeof docPdf === 'function') {
      out = String(docPdf(fileInfo.abs) ?? '');
    } else {
      const r = spawnSync('pdftotext', [fileInfo.abs, '-'], {
        encoding: 'utf8',
        maxBuffer: MAX_BUFFER,
      });
      if (r.error || r.status !== 0) {
        const detail = r.error?.message || r.stderr?.trim() || `exit ${r.status}`;
        return { ok: false, code: 'LOI_DOC_PDF', err: `pdftotext lỗi với ${fileInfo.rel}: ${detail}` };
      }
      out = r.stdout || '';
    }
    const pages = tachTrang(out);
    if (laPdfBanScan(out, pages)) {
      return { ok: false, code: 'PDF_BAN_SCAN_CAN_OCR', err: `${fileInfo.rel} là PDF bản scan cần OCR` };
    }
    return { ok: true, kind: 'pdf', fileInfo, raw: out, pages, sha256: tinhSha256(fileInfo.abs) };
  }
  if (fileInfo.ext === '.docx') {
    if (typeof docDocx === 'function') {
      const text = String(docDocx(fileInfo.abs) ?? '');
      return { ok: true, kind: 'docx', fileInfo, raw: text, pages: [text] };
    }
    if (!coUnzip) {
      return { ok: false, code: 'THIEU_UNZIP', err: `thiếu unzip để đọc ${fileInfo.rel}` };
    }
    const r = spawnSync('unzip', ['-p', fileInfo.abs, 'word/document.xml'], {
      encoding: 'utf8',
      maxBuffer: MAX_BUFFER,
    });
    if (r.error || r.status !== 0) {
      const detail = r.error?.message || r.stderr?.trim() || `exit ${r.status}`;
      return { ok: false, code: 'LOI_DOC_DOCX', err: `unzip lỗi với ${fileInfo.rel}: ${detail}` };
    }
    const text = trichDoanTuDocxXml(r.stdout || '');
    return { ok: true, kind: 'docx', fileInfo, raw: text, pages: [text] };
  }
  return { ok: false, code: 'DINH_DANG_CHUA_HO_TRO', err: `định dạng ${fileInfo.ext || fileInfo.rel} chưa hỗ trợ` };
}

function timRanhGioiKetThucCau(text, maxLen) {
  const slice = text.slice(0, maxLen);
  let best = -1;
  for (let i = 0; i < slice.length; i += 1) {
    const ch = slice[i];
    if (ch !== '.' && ch !== '!' && ch !== '?') continue;
    const next = slice[i + 1];
    if (next !== undefined && !/\s/.test(next)) continue;
    const before = slice.slice(Math.max(0, i - 20), i);
    if (/\b(?:Điều|Khoản|Mục|Chương|Điểm)\s*\d+[a-zđ]?$/iu.test(before)) continue;
    if (/(?:^|[.;:\s])\d{1,2}$/.test(before)) continue;
    if (i + 1 >= MIN_DOAN_KY_TU) best = i + 1;
  }
  if (best >= MIN_DOAN_KY_TU) return best;

  for (let i = slice.length - 1; i >= MIN_DOAN_KY_TU - 1; i -= 1) {
    if (slice[i] === ';' && (slice[i + 1] === undefined || /\s/.test(slice[i + 1]))) {
      return i + 1;
    }
  }

  for (let i = slice.length - 1; i >= MIN_DOAN_KY_TU; i -= 1) {
    if (/\s/.test(slice[i])) return i;
  }
  return maxLen;
}

/**
 * Làm sạch khoảng trắng từ nguyên văn 1 trang và cắt gọn tại cuối câu/đoạn trong [100..450] ký tự.
 * Không xóa/thay thế chữ hay dấu giữa câu để bảo đảm khớp 100% `chuanHoaKhopNguyenVan`.
 */
export function catDoanNguyenVan(rawSegment, minLen = MIN_DOAN_KY_TU, maxLen = MAX_DOAN_KY_TU) {
  const paras = String(rawSegment ?? '')
    .normalize('NFC')
    .replace(/\r\n?/g, '\n')
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  if (paras.length === 0) return '';

  const full = paras.join(' ');
  if (full.length <= maxLen) return full;

  // Ưu tiên chọn ranh giới đoạn (\n\n) gần nhất nằm trong [minLen..maxLen].
  let acc = '';
  let bestParaEnd = '';
  for (const p of paras) {
    const cand = acc ? `${acc} ${p}` : p;
    if (cand.length > maxLen) break;
    acc = cand;
    if (cand.length >= minLen) bestParaEnd = cand;
  }
  if (bestParaEnd.length >= minLen) return bestParaEnd;

  const cutIdx = timRanhGioiKetThucCau(full, maxLen);
  let trimmed = full.slice(0, cutIdx).trim();
  const withoutDanglingMarker = trimmed.replace(/\s+(?:\d{1,2}\.|[a-zđ]\))$/iu, '').trim();
  if (withoutDanglingMarker.length >= minLen) trimmed = withoutDanglingMarker;
  return trimmed;
}

/**
 * Bóc các khối `Điều <N>[.:–-]` theo từng trang, loại header Công báo, dòng mục lục, tham chiếu < 40 ký tự
 * và bỏ qua điều có hậu tố chữ cái (vd `Điều 31a`).
 */
export function phanTichCacKhoiDieu(pages) {
  const blocks = [];
  let cur = null;
  let daKetThucPhanQuyPham = false;
  let maxDieuSeen = 0;
  let quoteDepth = 0;

  const capNhatQuote = (text) => {
    for (const ch of text) {
      if (ch === '“') quoteDepth += 1;
      else if (ch === '”' && quoteDepth > 0) quoteDepth -= 1;
    }
  };

  const dongKhoi = () => {
    if (!cur) return;
    const totalLen = cur.segments
      .map((s) => s.lines.join(' ').replace(/\s+/g, ' ').trim())
      .join(' ')
      .trim().length;
    if (!cur.skip && totalLen >= MIN_KHOI_KY_TU) {
      blocks.push({
        dieu: cur.dieu,
        segments: cur.segments
          .map((s) => ({ pageNum: s.pageNum, text: s.lines.join('\n').trim() }))
          .filter((s) => s.text.length > 0),
      });
      if (cur.dieu > maxDieuSeen) maxDieuSeen = cur.dieu;
    }
    cur = null;
  };

  for (let pIdx = 0; pIdx < pages.length; pIdx += 1) {
    const pageNum = pIdx + 1;
    const cleanedPage = boHeaderCongBao(pages[pIdx]);
    const lines = cleanedPage.replace(/\r\n?/g, '\n').split('\n');
    let prevNonEmptyLine = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        if (cur && !cur.skip) {
          const seg = cur.segments[cur.segments.length - 1];
          if (seg && seg.pageNum === pageNum && seg.lines[seg.lines.length - 1] !== '') {
            seg.lines.push('');
          }
        }
        continue;
      }

      if (blocks.length >= 1 && RE_CUOI_VAN_BAN.test(trimmed)) {
        dongKhoi();
        daKetThucPhanQuyPham = true;
        break;
      }

      const m = line.match(RE_DIEU_LINE);
      if (m) {
        const dieuNum = Number(m[1]);
        const suffix = m[2] || '';
        const isToc = RE_MUC_LUC_DOTS.test(trimmed);
        const isWrappedCitation = RE_THAM_CHIEU_NOI_TIEP.test(prevNonEmptyLine);
        const currentActiveDieu = Math.max(maxDieuSeen, cur && !cur.skip ? cur.dieu : 0);
        const isQuotedBlock = RE_MO_TRICH_DAN.test(prevNonEmptyLine) || (quoteDepth > 0 && dieuNum !== currentActiveDieu + 1);
        const isBackwardDieu = currentActiveDieu > 0 && (suffix ? dieuNum < currentActiveDieu : dieuNum <= currentActiveDieu);

        if (
          !isToc
          && !isWrappedCitation
          && !isQuotedBlock
          && !isBackwardDieu
          && Number.isInteger(dieuNum)
          && dieuNum >= 1
        ) {
          if (quoteDepth > 0 && dieuNum === currentActiveDieu + 1) quoteDepth = 0;
          dongKhoi();
          cur = {
            dieu: dieuNum,
            skip: Boolean(suffix),
            segments: [{ pageNum, lines: [trimmed] }],
          };
          capNhatQuote(trimmed);
          prevNonEmptyLine = trimmed;
          continue;
        }
      }

      if (cur && !cur.skip) {
        let seg = cur.segments[cur.segments.length - 1];
        if (!seg || seg.pageNum !== pageNum) {
          seg = { pageNum, lines: [] };
          cur.segments.push(seg);
        }
        seg.lines.push(trimmed);
      }
      capNhatQuote(trimmed);
      prevNonEmptyLine = trimmed;
    }

    if (daKetThucPhanQuyPham) break;
  }
  dongKhoi();

  // Loại trùng lặp (nếu có) và bảo đảm mỗi khối >= 40 ký tự.
  const seen = new Set();
  const out = [];
  for (const b of blocks) {
    const flat = b.segments.map((s) => s.text).join(' ').replace(/\s+/g, ' ').trim();
    if (flat.length < MIN_KHOI_KY_TU) continue;
    if (seen.has(b.dieu)) continue;
    seen.add(b.dieu);
    out.push(b);
  }
  return out;
}

function kiemKhopCuaSoTrang(pages, trangPdf, normNoiDung) {
  if (trangPdf == null) {
    const full = pages.join('\n');
    if (chuanHoaKhopNguyenVan(full).includes(normNoiDung)) return true;
    const cleanFull = pages.map(boHeaderCongBao).join('\n');
    return chuanHoaKhopNguyenVan(cleanFull).includes(normNoiDung);
  }
  const p = trangPdf;
  if (p < 1 || p > pages.length) return false;
  const start = Math.max(0, p - 2);
  const end = Math.min(pages.length, p + 1);
  const slice = pages.slice(start, end).join('\n');
  if (chuanHoaKhopNguyenVan(slice).includes(normNoiDung)) return true;
  const cleanSlice = pages.slice(start, end).map(boHeaderCongBao).join('\n');
  return chuanHoaKhopNguyenVan(cleanSlice).includes(normNoiDung);
}

function trichDoanTuKhoi(block, docData) {
  const { pages, kind } = docData;
  const candidates = [];
  for (const seg of block.segments) {
    const excerpt = catDoanNguyenVan(seg.text);
    if (!excerpt) continue;
    const norm = chuanHoaKhopNguyenVan(excerpt);
    if (!norm) continue;
    const pageOk = kind === 'docx'
      ? kiemKhopCuaSoTrang(pages, null, norm)
      : kiemKhopCuaSoTrang(pages, seg.pageNum, norm);
    if (!pageOk) continue;
    candidates.push({
      dieu: block.dieu,
      noi_dung: excerpt,
      ...(kind === 'docx' ? {} : { trang_pdf: seg.pageNum }),
      _len: excerpt.length,
    });
  }
  if (candidates.length === 0) return null;

  const first = candidates[0];
  const preferred = (first._len >= 70 && /^\s*Điều\s+\d+/iu.test(first.noi_dung) && /[.;!?]\s*$/.test(first.noi_dung))
    ? first
    : candidates.find((c) => c._len >= MIN_DOAN_KY_TU);
  if (preferred) {
    const { _len: _l, ...clean } = preferred;
    return clean;
  }
  candidates.sort((a, b) => b._len - a._len);
  const best = candidates[0];
  if (best._len < MIN_KHOI_KY_TU) return null;
  const { _len: _l, ...clean } = best;
  return clean;
}

/**
 * Chọn tối đa `maxClauses` (mặc định 10, giữ đủ nếu <= 12 điều):
 * ưu tiên Điều 1–3, các điều giữa phân bổ đều, và điều hiệu lực cuối.
 */
export function chonLocDieuKhoan(items, maxClauses = MAC_DINH_MAX_CLAUSES) {
  const n = items.length;
  if (n === 0) return [];
  const effectiveMax = maxClauses === MAC_DINH_MAX_CLAUSES && n <= GIOI_HAN_GIU_DU ? n : maxClauses;
  if (n <= effectiveMax) return items;
  if (effectiveMax <= 1) return [items[0]];

  // Tìm điều hiệu lực cuối trong 4 điều cuối cùng (ưu tiên tiêu đề/nội dung nhắc hiệu lực thi hành).
  let tailIdx = n - 1;
  const scanStart = Math.max(1, n - 4);
  for (let i = n - 1; i >= scanStart; i -= 1) {
    if (/hiệu lực/i.test(items[i].noi_dung)) {
      tailIdx = i;
      break;
    }
  }

  const chosen = new Set();
  chosen.add(tailIdx);

  // Ưu tiên Điều 1–3 (hoặc tối đa 3 điều đầu trước tailIdx).
  const headLimit = Math.min(3, effectiveMax - 1);
  let headCount = 0;
  for (let i = 0; i < tailIdx && headCount < headLimit; i += 1) {
    if (items[i].dieu <= 3 || headCount < headLimit) {
      if (items[i].dieu > 3 && headCount > 0) break;
      chosen.add(i);
      headCount += 1;
    }
  }

  const lastHeadIdx = Math.max(...[...chosen].filter((idx) => idx < tailIdx), -1);
  const midIndices = [];
  for (let i = lastHeadIdx + 1; i < tailIdx; i += 1) {
    if (!chosen.has(i)) midIndices.push(i);
  }

  const need = effectiveMax - chosen.size;
  if (need > 0 && midIndices.length > 0) {
    if (midIndices.length <= need) {
      for (const idx of midIndices) chosen.add(idx);
    } else if (need === 1) {
      chosen.add(midIndices[Math.floor((midIndices.length - 1) / 2)]);
    } else {
      for (let j = 0; j < need; j += 1) {
        const pos = Math.round(((j + 1) * (midIndices.length - 1)) / (need + 1));
        chosen.add(midIndices[pos]);
      }
      // Bổ sung nếu làm tròn gây trùng chỉ số.
      for (const idx of midIndices) {
        if (chosen.size >= effectiveMax) break;
        chosen.add(idx);
      }
    }
  }

  // Nếu vẫn thiếu slot (vd tailIdx nằm trước điều cuối), lấy tiếp từ phần còn lại.
  for (let i = 0; i < n && chosen.size < effectiveMax; i += 1) {
    chosen.add(i);
  }

  return [...chosen].sort((a, b) => a - b).map((idx) => items[idx]);
}

function ganShaPdfNeuKhop(items, docData, pdfFiles, pdfReadOpts) {
  if (docData.kind === 'docx') return items;
  if (docData.kind === 'pdf') {
    return items.map((it) => ({ ...it, sha256_pdf: docData.sha256 }));
  }
  if (!pdfFiles.length) return items;

  // Đối chiếu xem .pdf trong toan_van có lớp chữ khớp từng mục tại trang_pdf hay không.
  // Nếu .pdf là bản scan (như cặp .pdf + .ocr.txt), KHÔNG gắn sha256_pdf của PDF scan vì
  // `kiem-tra-dieu-khoan.mjs` lọc matchedFiles theo sha256_pdf sẽ bỏ qua .ocr.txt và báo lỗi.
  const readablePdfs = pdfFiles
    .map((f) => docMotTep(f, pdfReadOpts))
    .filter((r) => r.ok && r.kind === 'pdf');
  if (readablePdfs.length === 0) return items;

  return items.map((it) => {
    const norm = chuanHoaKhopNguyenVan(it.noi_dung);
    const hitPdf = readablePdfs.find((pdfDoc) => kiemKhopCuaSoTrang(pdfDoc.pages, it.trang_pdf, norm));
    return hitPdf ? { ...it, sha256_pdf: hitPdf.sha256 } : it;
  });
}

function ghiDieuKhoanVaoYaml(absYamlPath, dieuKhoan) {
  const rawYaml = readFileSync(absYamlPath, 'utf8');
  const lines = rawYaml.split('\n');
  const headLines = [];
  for (const l of lines) {
    if (l.startsWith('#')) headLines.push(l);
    else break;
  }
  const head = headLines.join('\n');
  const obj = yaml.load(rawYaml, { schema: yaml.CORE_SCHEMA });
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new Error(`YAML không hợp lệ: ${absYamlPath}`);
  }
  obj.xac_minh = obj.xac_minh && typeof obj.xac_minh === 'object' && !Array.isArray(obj.xac_minh)
    ? { ...obj.xac_minh }
    : {};
  obj.xac_minh.dieu_khoan = dieuKhoan;
  const dumped = yaml.dump(obj, { lineWidth: -1, noRefs: true });
  writeFileSync(absYamlPath, `${head ? `${head}\n` : ''}${dumped}`, 'utf8');
}

/**
 * Trích xuất & tự kiểm chứng điều khoản cho một văn bản trong sổ đăng ký.
 */
export function trichDieuKhoanChoVanBan(
  doc,
  {
    root = ROOT,
    maxClauses = MAC_DINH_MAX_CLAUSES,
    force = false,
    dryRun = false,
    coPdftotext = null,
    docPdf = null,
    coUnzip = null,
    docDocx = null,
  } = {},
) {
  const base = { slug: doc._slug, so_hieu: doc.so_hieu || null, file: doc._file };
  if (!force && Array.isArray(doc.xac_minh?.dieu_khoan) && doc.xac_minh.dieu_khoan.length > 0) {
    return {
      ...base,
      status: 'DA_CO_DIEU_KHOAN',
      so_dieu_khoan: doc.xac_minh.dieu_khoan.length,
    };
  }

  const allTv = layDanhSachToanVan(doc, root);
  const candidates = allTv
    .filter((f) => f.exists && !f.isWiki && uuTienNguonDoc(f) < 9)
    .sort((a, b) => uuTienNguonDoc(a) - uuTienNguonDoc(b));

  if (candidates.length === 0) {
    return { ...base, status: 'THIEU_TOAN_VAN' };
  }

  const pdfToolReady = typeof coPdftotext === 'boolean' ? coPdftotext : phatHienCongCu('pdftotext', ['-v']);
  const unzipReady = typeof coUnzip === 'boolean' ? coUnzip : phatHienCongCu('unzip', ['-v']);
  const readOpts = { coPdftotext: pdfToolReady, docPdf, coUnzip: unzipReady, docDocx };

  const pdfFiles = candidates.filter((f) => f.ext === '.pdf');
  const docFailures = [];
  let chosenResult = null;

  for (const fileInfo of candidates) {
    const readRes = docMotTep(fileInfo, readOpts);
    if (!readRes.ok) {
      docFailures.push(readRes);
      continue;
    }
    const blocks = phanTichCacKhoiDieu(readRes.pages);
    const verified = blocks.map((b) => trichDoanTuKhoi(b, readRes)).filter(Boolean);
    if (verified.length > 0) {
      chosenResult = { readRes, verified };
      break;
    }
    docFailures.push({ ok: false, code: 'KHONG_CO_CAU_TRUC_DIEU', file: fileInfo.rel });
  }

  if (!chosenResult) {
    if (docFailures.some((f) => f.code === 'KHONG_CO_CAU_TRUC_DIEU')) {
      return {
        ...base,
        status: 'KHONG_CO_CAU_TRUC_DIEU',
        code: 'KHONG_CO_CAU_TRUC_DIEU',
        chi_tiet: docFailures,
      };
    }
    if (docFailures.some((f) => f.code === 'PDF_BAN_SCAN_CAN_OCR')) {
      return { ...base, status: 'PDF_BAN_SCAN_CAN_OCR', chi_tiet: docFailures };
    }
    if (docFailures.some((f) => f.code === 'THIEU_PDFTOTEXT')) {
      return { ...base, status: 'THIEU_PDFTOTEXT', chi_tiet: docFailures };
    }
    return { ...base, status: 'LOI', chi_tiet: docFailures };
  }

  const selected = chonLocDieuKhoan(chosenResult.verified, maxClauses);
  const finalClauses = ganShaPdfNeuKhop(selected, chosenResult.readRes, pdfFiles, readOpts);

  if (!dryRun) {
    ghiDieuKhoanVaoYaml(join(root, doc._file), finalClauses);
  }

  return {
    ...base,
    status: dryRun ? 'DU_KIEN_TRICH' : 'DA_TRICH',
    nguon_trich: chosenResult.readRes.fileInfo.rel,
    loai_nguon: chosenResult.readRes.kind,
    tong_dieu_phat_hien: chosenResult.verified.length,
    so_dieu_khoan: finalClauses.length,
    dieu_khoan: finalClauses,
  };
}

function laTbTchq(doc) {
  return doc?.loai === 'TB_TCHQ'
    || /TB-T?CHQ/i.test(String(doc?.so_hieu || ''))
    || String(doc?._slug || '').includes('tb-tchq')
    || String(doc?._slug || '').includes('tb-chq');
}

function coTheReady(doc, root, force) {
  if (laTbTchq(doc)) return false;
  if (doc.tinh_trang === 'HET_HIEU_LUC') return false;
  if (!force && Array.isArray(doc.xac_minh?.dieu_khoan) && doc.xac_minh.dieu_khoan.length > 0) return false;
  const tv = layDanhSachToanVan(doc, root);
  return tv.some((f) => f.exists && !f.isWiki && uuTienNguonDoc(f) < 9);
}

/**
 * Chạy trích xuất hàng loạt theo `--slug`, `--slugs`, hoặc `--all-ready`.
 */
export function chayTrichDieuKhoan({
  root = ROOT,
  slugs = [],
  allReady = false,
  maxClauses = MAC_DINH_MAX_CLAUSES,
  force = false,
  dryRun = false,
  coPdftotext = null,
  docPdf = null,
  coUnzip = null,
  docDocx = null,
} = {}) {
  const so = napSo(root);
  const bySlug = new Map(so.vanBan.map((d) => [d._slug, d]));

  const pdfToolReady = typeof coPdftotext === 'boolean' ? coPdftotext : phatHienCongCu('pdftotext', ['-v']);
  const unzipReady = typeof coUnzip === 'boolean' ? coUnzip : phatHienCongCu('unzip', ['-v']);

  let targets = [];
  const missingSlugs = [];

  if (slugs.length > 0) {
    for (const s of [...new Set(slugs)]) {
      const d = bySlug.get(s);
      if (!d) missingSlugs.push(s);
      else targets.push(d);
    }
  } else if (allReady) {
    targets = so.vanBan.filter((d) => coTheReady(d, root, force));
  }

  const ketQua = [];
  for (const ms of missingSlugs) {
    ketQua.push({ slug: ms, so_hieu: null, file: null, status: 'KHONG_TIM_THAY_VAN_BAN' });
  }

  for (const d of targets) {
    ketQua.push(
      trichDieuKhoanChoVanBan(d, {
        root,
        maxClauses,
        force,
        dryRun,
        coPdftotext: pdfToolReady,
        docPdf,
        coUnzip: unzipReady,
        docDocx,
      }),
    );
  }

  const dem = (st) => ketQua.filter((r) => r.status === st).length;
  return {
    tong_xet: ketQua.length,
    da_trich: dem('DA_TRICH') + dem('DU_KIEN_TRICH'),
    bo_qua: dem('DA_CO_DIEU_KHOAN'),
    khong_co_cau_truc_dieu: dem('KHONG_CO_CAU_TRUC_DIEU'),
    can_ocr: dem('PDF_BAN_SCAN_CAN_OCR'),
    thieu_toan_van: dem('THIEU_TOAN_VAN'),
    loi: dem('LOI') + dem('KHONG_TIM_THAY_VAN_BAN') + dem('THIEU_PDFTOTEXT'),
    dry_run: dryRun,
    ket_qua: ketQua,
  };
}

export function parseArgs(argv) {
  const out = {
    slugs: [],
    allReady: false,
    maxClauses: MAC_DINH_MAX_CLAUSES,
    force: false,
    dryRun: false,
    json: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--slug' && argv[i + 1]) out.slugs.push(argv[++i].trim());
    else if (a.startsWith('--slug=')) out.slugs.push(a.slice('--slug='.length).trim());
    else if (a === '--slugs' && argv[i + 1]) {
      out.slugs.push(...argv[++i].split(',').map((x) => x.trim()).filter(Boolean));
    } else if (a.startsWith('--slugs=')) {
      out.slugs.push(...a.slice('--slugs='.length).split(',').map((x) => x.trim()).filter(Boolean));
    } else if (a === '--all-ready') out.allReady = true;
    else if (a === '--max-clauses' && argv[i + 1]) out.maxClauses = Number(argv[++i]);
    else if (a.startsWith('--max-clauses=')) out.maxClauses = Number(a.slice('--max-clauses='.length));
    else if (a === '--force') out.force = true;
    else if (a === '--dry-run') out.dryRun = true;
    else if (a === '--json') out.json = true;
    else if (a === '-h' || a === '--help') out.help = true;
  }
  out.slugs = out.slugs.filter(Boolean);
  return out;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help || (opts.slugs.length === 0 && !opts.allReady)) {
    console.error(
      'Cách dùng: node tools/trich-dieu-khoan.mjs (--slugs a,b,c | --slug <slug> | --all-ready) [--max-clauses 10] [--force] [--dry-run] [--json]',
    );
    process.exit(opts.help ? 0 : 2);
  }
  if (!Number.isInteger(opts.maxClauses) || opts.maxClauses < 1) {
    console.error(`--max-clauses không hợp lệ: ${opts.maxClauses}`);
    process.exit(2);
  }
  const res = chayTrichDieuKhoan({
    root: ROOT,
    slugs: opts.slugs,
    allReady: opts.allReady,
    maxClauses: opts.maxClauses,
    force: opts.force,
    dryRun: opts.dryRun,
  });

  if (opts.json) {
    process.stdout.write(`${JSON.stringify(res, null, 2)}\n`);
  } else {
    for (const item of res.ket_qua) {
      if (item.status === 'DA_TRICH' || item.status === 'DU_KIEN_TRICH') {
        const tag = item.status === 'DU_KIEN_TRICH' ? '[dry-run]' : 'OK';
        console.log(`${tag} ${item.slug}: ${item.so_dieu_khoan}/${item.tong_dieu_phat_hien} điều (${item.nguon_trich})`);
      } else {
        console.log(`${item.status} ${item.slug}`);
      }
    }
    console.log(
      `\nTổng xét: ${res.tong_xet} · Đã trích: ${res.da_trich} · Bỏ qua: ${res.bo_qua} · Không có Điều N: ${res.khong_co_cau_truc_dieu} · Cần OCR: ${res.can_ocr} · Lỗi: ${res.loi}`,
    );
  }

  const coLoiSlug = res.ket_qua.some((r) => r.status === 'KHONG_TIM_THAY_VAN_BAN' || r.status === 'LOI');
  process.exit(coLoiSlug ? 1 : 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main();
}
