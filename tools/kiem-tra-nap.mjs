#!/usr/bin/env node
// Kiểm toán chất lượng nạp tệp gốc raw/ & mức phủ tri thức toàn kho:
//   node tools/kiem-tra-nap.mjs [--json] [--ghi-bao-cao]
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, homNay } from './lib/registry.mjs';
import { kiemToanKhoNap } from './lib/kiem-tra-raw.mjs';

function dinhDangMarkdown(kq, today = homNay()) {
  const pct = (n) => (kq.tong_vb_hien_hanh ? `${((100 * n) / kq.tong_vb_hien_hanh).toFixed(1)}%` : '0.0%');
  const lines = [
    `# Báo cáo kiểm toán nạp & toàn văn PLHQ — ${today}`,
    '',
    `- Tổng VBQPPL hiện hành (trừ TB-TCHQ): **${kq.tong_vb_hien_hanh}**`,
    `- Công cụ \`pdftotext\`: ${kq.co_pdftotext ? 'có' : 'không có (kiểm PDF bản scan bỏ qua)'}`,
    '',
    '## Phân loại 5 nhóm',
    '',
    '| Nhóm | Số lượng | Tỉ lệ | Ý nghĩa |',
    '|---|---:|---:|---|',
    `| \`DA_INGEST_TRI_THUC\` | ${kq.thong_ke.DA_INGEST_TRI_THUC} | ${pct(kq.thong_ke.DA_INGEST_TRI_THUC)} | Đã có wiki/sources hoặc điều khoản |`,
    `| \`CO_TOAN_VAN_CHUA_INGEST\` | ${kq.thong_ke.CO_TOAN_VAN_CHUA_INGEST} | ${pct(kq.thong_ke.CO_TOAN_VAN_CHUA_INGEST)} | Raw có chữ/Điều N nhưng chưa bóc vào wiki/điều khoản |`,
    `| \`PDF_BAN_SCAN_CAN_OCR\` | ${kq.thong_ke.PDF_BAN_SCAN_CAN_OCR} | ${pct(kq.thong_ke.PDF_BAN_SCAN_CAN_OCR)} | PDF không lớp chữ — cần OCR tesseract vie |`,
    `| \`VO_HTML_CHUA_TAI_PDF\` | ${kq.thong_ke.VO_HTML_CHUA_TAI_PDF} | ${pct(kq.thong_ke.VO_HTML_CHUA_TAI_PDF)} | Vỏ HTML giới thiệu/pdf.js, chưa tải PDF toàn văn |`,
    `| \`THIEU_RAW\` | ${kq.thong_ke.THIEU_RAW} | ${pct(kq.thong_ke.THIEU_RAW)} | Chưa có tệp toàn văn khớp slug |`,
    '',
    '## Top 15 ưu tiên OCR (`PDF_BAN_SCAN_CAN_OCR`)',
    ...kq.uu_tien_ocr.slice(0, 15).map((x) => `- **${x.so_hieu}** (${x.loai}, tham chiếu: ${x.tham_chieu}) — \`${x.tep_raw}\``),
    '',
    '## Top 15 có toàn văn lớp chữ chưa ingest (`CO_TOAN_VAN_CHUA_INGEST`)',
    ...kq.uu_tien_ingest_toan_van.slice(0, 15).map((x) => `- **${x.so_hieu}** (${x.loai}, tham chiếu: ${x.tham_chieu}) — \`${x.tep_raw}\``),
  ];
  return `${lines.join('\n')}\n`;
}

function main() {
  const args = process.argv.slice(2);
  const asJson = args.includes('--json');
  const writeReport = args.includes('--ghi-bao-cao');
  const kq = kiemToanKhoNap(ROOT);

  if (writeReport) {
    mkdirSync(join(ROOT, 'bao-cao'), { recursive: true });
    writeFileSync(join(ROOT, 'bao-cao', 'kiem-tra-nap.md'), dinhDangMarkdown(kq), 'utf8');
  }

  if (asJson) {
    const { nhom: _bo, ...tomTat } = kq;
    process.stdout.write(`${JSON.stringify(tomTat, null, 2)}\n`);
  } else {
    process.stdout.write(dinhDangMarkdown(kq));
  }
}

if (import.meta.url === `file://${process.argv[1]}`) main();
