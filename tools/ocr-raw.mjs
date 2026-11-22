#!/usr/bin/env node
// OCR tệp PDF bản scan thành văn bản từng trang giữ nguyên số trang (\f) và metadata kiểm chứng.
// Sử dụng `pdftoppm -png -r 250` + `tesseract <png> stdout -l vie+eng`.
// Không bao giờ ghi đè hay chỉnh sửa PDF gốc trong `raw/download/`.
//   node tools/ocr-raw.mjs --slug 05-2017-qh14
//   node tools/ocr-raw.mjs --so-hieu "05/2017/QH14" [--dpi 250] [--lang vie+eng] [--concurrency 4] [--force]
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, isAbsolute, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import yaml from 'js-yaml';
import { homNay, khoa, napSo, ROOT, slugTuSoHieu } from './lib/registry.mjs';

export const MAC_DINH_DPI = 250;
export const MAC_DINH_LANG = 'vie+eng';
export const MAC_DINH_CONCURRENCY = 4;

function macDinhExec(bin, args, opts = {}) {
  return new Promise((resolvePromise, rejectPromise) => {
    execFile(
      bin,
      args,
      { maxBuffer: 64 * 1024 * 1024, encoding: 'utf8', ...opts },
      (err, stdout, stderr) => {
        if (err) {
          const detail = stderr?.trim() || err.message;
          rejectPromise(Object.assign(new Error(`${bin} lỗi: ${detail}`), { code: err.code, stderr }));
          return;
        }
        resolvePromise({ stdout: stdout ?? '', stderr: stderr ?? '' });
      },
    );
  });
}

function timPdfTrongThuMuc(dir, targetFileName) {
  if (!existsSync(dir)) return null;
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) {
      const hit = timPdfTrongThuMuc(p, targetFileName);
      if (hit) return hit;
    } else if (ent.isFile() && ent.name === targetFileName) {
      return p;
    }
  }
  return null;
}

/**
 * Xác định thông tin văn bản và tệp PDF gốc từ `--slug`, `--so-hieu` hoặc `--pdf`.
 * @param {string} root
 * @param {{ slug?: string, soHieu?: string, pdfPath?: string }} params
 */
export function timTepPdfChoVanBan(root = ROOT, { slug = null, soHieu = null, pdfPath = null } = {}) {
  let doc = null;
  if (existsSync(join(root, 'registry', 'cay-xnk.yaml'))) {
    const so = napSo(root);
    if (soHieu) doc = so.theoKhoa.get(khoa(soHieu))?.[0] || null;
    if (!doc && slug) doc = so.vanBan.find((x) => x._slug === slug) || null;
  } else if (slug && existsSync(join(root, 'registry', 'van-ban', `${slug}.yaml`))) {
    const d = yaml.load(readFileSync(join(root, 'registry', 'van-ban', `${slug}.yaml`), 'utf8'), { schema: yaml.CORE_SCHEMA });
    if (d && typeof d === 'object') doc = { ...d, _slug: slug };
  }

  const resolvedSlug = doc?._slug || slug || (soHieu ? slugTuSoHieu(soHieu) : null);
  if (!resolvedSlug) {
    throw new Error('Cần truyền --slug <slug> hoặc --so-hieu "<số hiệu>"');
  }

  let absPdf = null;
  if (pdfPath) {
    absPdf = isAbsolute(pdfPath) ? resolve(pdfPath) : resolve(root, pdfPath);
  } else {
    const rawTv = doc?.toan_van;
    const tvList = Array.isArray(rawTv) ? rawTv : rawTv != null ? [rawTv] : [];
    for (const entry of tvList) {
      const rel = typeof entry === 'string'
        ? entry.trim()
        : entry && typeof entry === 'object' && typeof (entry.tep || entry.path) === 'string'
          ? String(entry.tep || entry.path).trim()
          : '';
      if (!rel || extname(rel).toLowerCase() !== '.pdf') continue;
      const cand = isAbsolute(rel) ? resolve(rel) : resolve(root, rel);
      if (existsSync(cand)) {
        absPdf = cand;
        break;
      }
    }
    if (!absPdf) {
      absPdf = timPdfTrongThuMuc(join(root, 'raw', 'download'), `${resolvedSlug}.pdf`);
    }
  }

  if (!absPdf || !existsSync(absPdf)) {
    throw new Error(`Không tìm thấy tệp PDF gốc cho ${soHieu || resolvedSlug}`);
  }
  const relPdf = relative(resolve(root), absPdf).replace(/\\/g, '/');
  if (relPdf.startsWith('..')) {
    throw new Error(`Tệp PDF phải nằm trong thư mục kho (${root}): ${absPdf}`);
  }

  return {
    doc,
    slug: resolvedSlug,
    so_hieu: doc?.so_hieu || soHieu || null,
    absPdf,
    tep_pdf_goc: relPdf,
  };
}

async function chaySongSongTheoPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  const nWorkers = Math.max(1, Math.min(concurrency, items.length || 1));
  await Promise.all(
    Array.from({ length: nWorkers }, async () => {
      while (cursor < items.length) {
        const idx = cursor++;
        results[idx] = await worker(items[idx], idx);
      }
    }),
  );
  return results;
}

/**
 * Chạy OCR cho một tệp PDF scan và ghi `raw/ocr/<slug>.ocr.txt` + `raw/ocr/<slug>.ocr.json`.
 * Không bao giờ ghi đè tệp PDF gốc.
 */
export async function ocrPdf({
  root = ROOT,
  slug = null,
  soHieu = null,
  pdfPath = null,
  dpi = MAC_DINH_DPI,
  lang = MAC_DINH_LANG,
  concurrency = MAC_DINH_CONCURRENCY,
  force = false,
  today = homNay(),
  _exec = macDinhExec,
} = {}) {
  const dpiNum = Number(dpi);
  if (!Number.isInteger(dpiNum) || dpiNum < 72 || dpiNum > 600) {
    throw new Error(`DPI không hợp lệ: ${dpi} (cần số nguyên 72..600)`);
  }
  const concNum = Number(concurrency);
  if (!Number.isInteger(concNum) || concNum < 1 || concNum > 16) {
    throw new Error(`Concurrency không hợp lệ: ${concurrency} (cần số nguyên 1..16)`);
  }

  const target = timTepPdfChoVanBan(root, { slug, soHieu, pdfPath });
  const pdfBuf = readFileSync(target.absPdf);
  if (pdfBuf.length < 4 || pdfBuf.subarray(0, 4).toString('latin1') !== '%PDF') {
    throw new Error(`Tệp không phải PDF hợp lệ (%PDF): ${target.tep_pdf_goc}`);
  }
  const sha256PdfGoc = createHash('sha256').update(pdfBuf).digest('hex');

  const ocrDir = resolve(root, 'raw', 'ocr');
  const outTxt = join(ocrDir, `${target.slug}.ocr.txt`);
  const outJson = join(ocrDir, `${target.slug}.ocr.json`);
  if (resolve(outTxt) === resolve(target.absPdf) || resolve(outJson) === resolve(target.absPdf)) {
    throw new Error('Từ chối ghi đè tệp PDF gốc');
  }

  if (!force && existsSync(outTxt) && existsSync(outJson)) {
    try {
      const prevMeta = JSON.parse(readFileSync(outJson, 'utf8'));
      if (prevMeta.sha256_pdf_goc === sha256PdfGoc && prevMeta.dpi === dpiNum && prevMeta.lang === lang) {
        return {
          skipped: true,
          meta: prevMeta,
          tep_ocr_txt: `raw/ocr/${target.slug}.ocr.txt`,
          tep_ocr_json: `raw/ocr/${target.slug}.ocr.json`,
        };
      }
    } catch { /* metadata hỏng thì chạy OCR lại */ }
  }

  // Dùng realpathSync cho tmpdir để tránh lỗi Leptonica/Tesseract với symlink /tmp -> /private/tmp trên macOS.
  const realTmpBase = realpathSync(tmpdir());
  const tmpDir = realpathSync(mkdtempSync(join(realTmpBase, `oz-ocr-${target.slug}-`)));
  const prefix = join(tmpDir, 'page');

  try {
    await _exec('pdftoppm', ['-png', '-r', String(dpiNum), target.absPdf, prefix]);

    const pngFiles = readdirSync(tmpDir)
      .map((name) => {
        const m = name.match(/^page-(\d+)\.png$/);
        return m ? { name, pageNum: Number(m[1]), abs: join(tmpDir, name) } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.pageNum - b.pageNum);

    if (pngFiles.length === 0) {
      throw new Error(`pdftoppm không tạo được trang ảnh PNG nào cho ${target.tep_pdf_goc}`);
    }

    const rawPages = await chaySongSongTheoPool(pngFiles, concNum, async (pg) => {
      const res = await _exec(
        'tesseract',
        [pg.abs, 'stdout', '-l', lang],
        { env: { ...process.env, OMP_THREAD_LIMIT: '1' } },
      );
      return String(res?.stdout ?? '')
        .normalize('NFC')
        .replace(/\r\n?/g, '\n')
        .trim();
    });

    // Phân cách từng trang đúng bởi \f (\n\f\n) để `tachTrang` giữ chính xác 1-indexed `trang_pdf`
    // ngay cả khi trang cuối trống.
    const ocrText = `${rawPages.join('\n\f\n')}\n`;
    const meta = {
      so_hieu: target.so_hieu,
      slug: target.slug,
      tep_pdf_goc: target.tep_pdf_goc,
      sha256_pdf_goc: sha256PdfGoc,
      tep_ocr_txt: `raw/ocr/${target.slug}.ocr.txt`,
      engine: 'tesseract',
      lang,
      dpi: dpiNum,
      so_trang: pngFiles.length,
      ngay: today,
      ky_tu: ocrText.length,
    };

    mkdirSync(ocrDir, { recursive: true });
    writeFileSync(outTxt, ocrText, 'utf8');
    writeFileSync(outJson, `${JSON.stringify(meta, null, 2)}\n`, 'utf8');

    return {
      skipped: false,
      meta,
      tep_ocr_txt: meta.tep_ocr_txt,
      tep_ocr_json: `raw/ocr/${target.slug}.ocr.json`,
      outTxt,
      outJson,
    };
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
}

export function parseArgs(argv) {
  const out = {
    slug: null,
    soHieu: null,
    pdfPath: null,
    dpi: MAC_DINH_DPI,
    lang: MAC_DINH_LANG,
    concurrency: MAC_DINH_CONCURRENCY,
    force: false,
    json: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--slug' && argv[i + 1]) out.slug = argv[++i];
    else if (a === '--so-hieu' && argv[i + 1]) out.soHieu = argv[++i];
    else if (a === '--pdf' && argv[i + 1]) out.pdfPath = argv[++i];
    else if (a === '--dpi' && argv[i + 1]) out.dpi = Number(argv[++i]);
    else if (a === '--lang' && argv[i + 1]) out.lang = argv[++i];
    else if (a === '--concurrency' && argv[i + 1]) out.concurrency = Number(argv[++i]);
    else if (a === '--force') out.force = true;
    else if (a === '--json') out.json = true;
    else if (a === '-h' || a === '--help') out.help = true;
  }
  return out;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help || (!opts.slug && !opts.soHieu)) {
    console.error(
      'Cách dùng: node tools/ocr-raw.mjs (--slug <slug> | --so-hieu "<số hiệu>") [--pdf <path>] [--dpi 250] [--lang vie+eng] [--concurrency 4] [--force] [--json]',
    );
    process.exit(opts.help ? 0 : 2);
  }
  const kq = await ocrPdf({
    root: ROOT,
    slug: opts.slug,
    soHieu: opts.soHieu,
    pdfPath: opts.pdfPath,
    dpi: opts.dpi,
    lang: opts.lang,
    concurrency: opts.concurrency,
    force: opts.force,
  });
  if (opts.json) {
    console.log(JSON.stringify(kq.meta, null, 2));
  } else {
    const tag = kq.skipped ? 'ĐÃ CÓ' : 'ĐÃ OCR';
    console.log(
      `${tag} ${kq.meta.tep_pdf_goc} → ${kq.tep_ocr_txt} (${kq.meta.so_trang} trang, ${kq.meta.ky_tu} ký tự, dpi=${kq.meta.dpi}, lang=${kq.meta.lang})`,
    );
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((err) => {
    console.error(`LỖI OCR: ${err.message}`);
    process.exit(1);
  });
}
