#!/usr/bin/env node
// Khu vực tải dữ liệu + làm sạch: tải toàn văn một văn bản từ URL vào raw/download/<tên miền>/,
// kèm tệp nguồn gốc (.nguon.json: url, ngày tải, sha256, bậc nguồn) và bản chữ sạch (.txt) nếu là HTML.
// Không bao giờ ghi đè tệp đã có (raw/ là bất biến — xem README).
//   node tools/nap.mjs <url> [--so-hieu "28/2026/TT-BCT"] [--ghi]
//   --ghi: thêm đường dẫn toàn văn + nguồn vào registry/van-ban/<văn bản>.yaml
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { createHash } from 'node:crypto';
import yaml from 'js-yaml';
import { napSo, khoa, bacNguon, slugTuSoHieu, homNay, ROOT } from './lib/registry.mjs';
import { kiemTraPdfCoLopChu, lamSachHtmlDeKiem, phanTichHtmlRaw } from './lib/kiem-tra-raw.mjs';

const GIOI_HAN = 50 * 1024 * 1024;

/** HTML → chữ sạch: bỏ script/style/menu, giữ xuống dòng theo khối, gộp khoảng trắng. */
export function lamSachHtml(html) {
  return lamSachHtmlDeKiem(html);
}

function tenTep(url, soHieu, ext) {
  if (soHieu) return `${slugTuSoHieu(soHieu)}${ext}`;
  const b = basename(new URL(url).pathname) || 'tai-lieu';
  return b.includes('.') ? b : `${b}${ext}`;
}

async function taiVaLuu({ url, soHieu, ghi, so, choPhepTheoPdf = false }) {
  const bac = bacNguon(url, so.nguon);
  if (bac !== 'A') console.warn(`⚠️  Nguồn bậc ${bac} (${new URL(url).hostname}). Toàn văn nên lấy từ nguồn bậc A — xem registry/nguon-uy-tin.yaml.`);

  const res = await fetch(url, { headers: { 'user-agent': 'oz-wiki-plhq/0.1 (+https://github.com/ozvietnam/oz-wiki-plhq)' }, redirect: 'follow' });
  if (!res.ok) { console.error(`HTTP ${res.status} khi tải ${url}`); process.exit(1); }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > GIOI_HAN) { console.error('Tệp quá 50 MB — bỏ qua.'); process.exit(1); }
  const ct = res.headers.get('content-type') || '';
  const cd = res.headers.get('content-disposition') || '';
  const magicPdf = buf.length >= 4 && buf.subarray(0, 4).toString('latin1') === '%PDF';
  const ext = (/pdf/i.test(ct) || /\.pdf["']?\s*$/i.test(cd) || /filename[^;]*=[^;]*\.pdf/i.test(cd) || magicPdf)
    ? '.pdf'
    : /html/.test(ct) ? '.html'
    : /msword|officedocument/.test(ct) ? '.docx'
    : (extname(new URL(url).pathname) || '.bin');
  const host = new URL(url).hostname.replace(/^www\./, '');
  const dir = join(ROOT, 'raw', 'download', host);
  mkdirSync(dir, { recursive: true });
  const file = join(dir, tenTep(url, soHieu, ext));
  const rel = file.slice(ROOT.length + 1);
  const sha256 = createHash('sha256').update(buf).digest('hex');

  const meta = { url, truy_cap: homNay(), sha256, content_type: ct, bytes: buf.length, bac_nguon: bac, so_hieu: soHieu };
  let htmlInfo = null;
  let pdfInfo = null;
  if (ext === '.html' || ext === '.htm') {
    htmlInfo = phanTichHtmlRaw(buf.toString('utf8'), url);
    meta.co_toan_van = htmlInfo.co_toan_van;
    meta.loai_tep_raw = htmlInfo.loai_tep_raw;
    if (htmlInfo.pdf_nhung.length) meta.pdf_nhung = htmlInfo.pdf_nhung;
  } else if (ext === '.pdf') {
    pdfInfo = kiemTraPdfCoLopChu(buf);
    meta.co_lop_chu = pdfInfo.co_lop_chu;
    meta.loai_tep_raw = pdfInfo.trang_thai;
  }

  if (existsSync(file)) {
    const cu = createHash('sha256').update(readFileSync(file)).digest('hex');
    if (cu === sha256) { console.log(`Đã có, không đổi: ${rel}`); }
    else { console.error(`Đã có ${rel} với nội dung KHÁC (raw/ bất biến). Văn bản có thể đã được sửa ở nguồn — mở issue "hiệu lực".`); process.exit(1); }
  } else {
    writeFileSync(file, buf);
    writeFileSync(`${file}.nguon.json`, JSON.stringify(meta, null, 2) + '\n');
    if (ext === '.html' && htmlInfo?.co_toan_van) {
      writeFileSync(file.replace(/\.html$/, '.txt'), htmlInfo.chu_sach + '\n');
    } else if (ext === '.html') {
      console.warn(`⚠️  ${rel} là ${htmlInfo.loai_tep_raw} (không có Điều N) — không ghi tệp .txt giả toàn văn.`);
    } else if (pdfInfo?.trang_thai === 'PDF_BAN_SCAN_CAN_OCR') {
      console.warn(`⚠️  ${rel} là PDF bản scan (<200 ký tự lớp chữ) — cần OCR trước khi ingest.`);
    }
    console.log(`Đã tải ${rel} (${buf.length} byte, sha256 ${sha256.slice(0, 12)}…, nguồn bậc ${bac})`);
  }

  let savedRel = rel;
  if ((ext === '.html' || ext === '.htm') && htmlInfo?.pdf_nhung.length) {
    const firstPdfA = htmlInfo.pdf_nhung.find((p) => bacNguon(p, so.nguon) === 'A') || htmlInfo.pdf_nhung[0];
    if (choPhepTheoPdf && !htmlInfo.co_toan_van && firstPdfA) {
      console.log(`--theo-pdf: tự động tải tệp PDF toàn văn ${firstPdfA}`);
      const pdfRel = await taiVaLuu({ url: firstPdfA, soHieu, ghi: false, so, choPhepTheoPdf: false });
      savedRel = pdfRel;
    } else {
      console.log(`Trang này có tệp PDF toàn văn — nên tải thêm:\n${htmlInfo.pdf_nhung.slice(0, 5).map((p) => `  node tools/nap.mjs "${p}"${soHieu ? ` --so-hieu "${soHieu}" --ghi` : ''}`).join('\n')}`);
    }
  }

  if (ghi && soHieu) {
    const d = so.theoKhoa.get(khoa(soHieu))?.[0];
    if (!d) { console.error(`Chưa có ${soHieu} trong sổ — tạo trước bằng node tools/them-van-ban.mjs`); process.exit(1); }
    const fp = join(ROOT, d._file);
    const raw = readFileSync(fp, 'utf8');
    const head = raw.split('\n').filter((l) => l.startsWith('#')).join('\n');
    const obj = yaml.load(raw, { schema: yaml.CORE_SCHEMA });
    obj.toan_van = savedRel;
    obj.nguon = obj.nguon || [];
    if (!obj.nguon.some((n) => n.url === url)) obj.nguon.push({ url, truy_cap: homNay() });
    writeFileSync(fp, `${head ? `${head}\n` : ''}${yaml.dump(obj, { lineWidth: -1, noRefs: true })}`);
    console.log(`Đã ghi toan_van + nguon vào ${d._file}`);
  }
  return savedRel;
}

async function main() {
  const args = process.argv.slice(2);
  const url = args.find((a) => /^https?:\/\//.test(a));
  const i = args.indexOf('--so-hieu');
  const soHieu = i >= 0 ? args[i + 1] : null;
  const ghi = args.includes('--ghi');
  const theoPdf = args.includes('--theo-pdf');
  if (!url) {
    console.error('Cách dùng: node tools/nap.mjs <url> [--so-hieu "..."] [--ghi] [--theo-pdf]');
    process.exit(2);
  }
  const so = napSo();
  await taiVaLuu({ url, soHieu, ghi, so, choPhepTheoPdf: theoPdf });
  console.log('Bước tiếp: mở phiên AI trong repo và gõ /lumi-ingest với tệp vừa tải để tóm tắt vào wiki.');
}

if (import.meta.url === `file://${process.argv[1]}`) main();
