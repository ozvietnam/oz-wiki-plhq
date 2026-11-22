// Bộ kiểm thử kiểm toán nạp & nhận diện vỏ HTML / PDF bản scan (Wave 9).
import { cpSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT } from '../lib/registry.mjs';
import { kiemToanKhoNap, kiemTraPdfCoLopChu, phanTichHtmlRaw } from '../lib/kiem-tra-raw.mjs';

let pass = 0;
let fail = 0;
const t = (name, cond, extra = '') => {
  if (cond) {
    pass += 1;
    console.log(`PASS ${name}`);
  } else {
    fail += 1;
    console.log(`FAIL ${name} ${extra}`);
  }
};

// 1. Vỏ HTML Công báo + bóc link PDF theo ưu tiên nguồn bậc A
const htmlVo = `
<html><body>
  <p>Nghị định số 24/2026/NĐ-CP của Chính phủ</p>
  <a href="https://example.com/copy.pdf">Bản sao</a>
  <div id="pdf-view" data-file="/files/2026/nd-24-signed.pdf" data-href="https://congbaocdn.chinhphu.vn/2026/nd24.pdf"></div>
</body></html>`;
const kqVo = phanTichHtmlRaw(htmlVo, 'https://congbao.chinhphu.vn/nd-24');
t(
  'phanTichHtmlRaw: nhận diện VO_HTML_PDF và bóc PDF ưu tiên nguồn bậc A lên trước',
  kqVo.co_toan_van === false
    && kqVo.la_vo_html_pdf === true
    && kqVo.loai_tep_raw === 'VO_HTML_PDF'
    && /^https:\/\/congbao(?:cdn)?\.chinhphu\.vn\//.test(kqVo.pdf_nhung[0] || '')
    && kqVo.pdf_nhung.includes('https://congbaocdn.chinhphu.vn/2026/nd24.pdf')
    && kqVo.pdf_nhung.includes('https://congbao.chinhphu.vn/files/2026/nd-24-signed.pdf')
    && kqVo.pdf_nhung[kqVo.pdf_nhung.length - 1] === 'https://example.com/copy.pdf',
  JSON.stringify(kqVo),
);

// 2. HTML có toàn văn thật (vbpl / vanban.chinhphu.vn)
const htmlToanVan = `
<html><body>
  <div>Điều 1. Phạm vi điều chỉnh. Quy định về kiểm tra hải quan.</div>
  <div>Điều 2. Đối tượng áp dụng. Tổ chức, cá nhân XNK hàng hóa.</div>
  <div>Điều 3. Hiệu lực thi hành. Có hiệu lực từ 01/01/2026.</div>
</body></html>`;
const kqTv = phanTichHtmlRaw(htmlToanVan, 'https://vanban.chinhphu.vn/x');
t(
  'phanTichHtmlRaw: nhận diện HTML_CO_TOAN_VAN với đủ Điều N',
  kqTv.co_toan_van === true && kqTv.la_vo_html_pdf === false && kqTv.loai_tep_raw === 'HTML_CO_TOAN_VAN' && kqTv.so_dieu_phat_hien >= 3,
);

// 3. Kiểm lớp chữ PDF (mock spawnSync) + môi trường thiếu pdftotext
const mockScan = kiemTraPdfCoLopChu(Buffer.from('%PDF-1.4\n...'), {
  _spawnSync: () => ({ status: 0, stdout: Buffer.from('  \n  '), error: null }),
});
t('kiemTraPdfCoLopChu: PDF rỗng chữ <200 ký tự → PDF_BAN_SCAN_CAN_OCR', mockScan.trang_thai === 'PDF_BAN_SCAN_CAN_OCR' && mockScan.co_lop_chu === false);

const mockText = kiemTraPdfCoLopChu(Buffer.from('%PDF-1.4\n...'), {
  _spawnSync: () => ({
    status: 0,
    stdout: Buffer.from(`${'Nội dung văn bản pháp luật hải quan dài hơn hai trăm ký tự '.repeat(6)}\nĐiều 1. Phạm vi\nĐiều 2. Đối tượng\n`),
    error: null,
  }),
});
t('kiemTraPdfCoLopChu: PDF có chữ >=200 ký tự + Điều N → PDF_CO_TOAN_VAN', mockText.trang_thai === 'PDF_CO_TOAN_VAN' && mockText.co_lop_chu === true && mockText.co_dieu_khoan === true);

const mockMissingBin = kiemTraPdfCoLopChu(Buffer.from('%PDF-1.4\n...'), {
  _spawnSync: () => ({ error: Object.assign(new Error('not found'), { code: 'ENOENT' }) }),
});
t('kiemTraPdfCoLopChu: thiếu pdftotext → KHONG_CO_PDFTOTEXT an toàn', mockMissingBin.trang_thai === 'KHONG_CO_PDFTOTEXT' && mockMissingBin.co_lop_chu === null);

// 4. Fixture kiemToanKhoNap phân đúng cả 5 nhóm
const mockRoot = mkdtempSync(join(tmpdir(), 'oz-kiem-nap-'));
try {
  mkdirSync(join(mockRoot, 'registry', 'van-ban'), { recursive: true });
  mkdirSync(join(mockRoot, 'wiki', 'sources'), { recursive: true });
  mkdirSync(join(mockRoot, 'raw', 'download', 'congbao.chinhphu.vn'), { recursive: true });
  for (const f of ['cay-xnk.yaml', 'co-quan.yaml', 'nguon-uy-tin.yaml']) {
    cpSync(join(ROOT, 'registry', f), join(mockRoot, 'registry', f));
  }
  const mkYaml = (so, loai = 'NGHI_DINH') => [
    `so_hieu: ${so}`,
    `loai: ${loai}`,
    `ten: Văn bản kiểm thử ${so}`,
    'co_quan: CP',
    'ngay_ban_hanh: "2026-01-01"',
    'hieu_luc_tu: "2026-02-01"',
    'tinh_trang: CON_HIEU_LUC',
    'nhanh: [hai-quan/thu-tuc]',
  ].join('\n');

  writeFileSync(join(mockRoot, 'registry', 'van-ban', '01-2026-nd-cp.yaml'), mkYaml('01/2026/NĐ-CP'));
  writeFileSync(join(mockRoot, 'wiki', 'sources', '01-2026-nd-cp.md'), '# 01/2026\n');

  writeFileSync(join(mockRoot, 'registry', 'van-ban', '02-2026-nd-cp.yaml'), mkYaml('02/2026/NĐ-CP'));
  writeFileSync(join(mockRoot, 'raw', 'download', 'congbao.chinhphu.vn', '02-2026-nd-cp.txt'), 'Điều 1. A.\nĐiều 2. B.\n');

  writeFileSync(join(mockRoot, 'registry', 'van-ban', '03-2026-nd-cp.yaml'), mkYaml('03/2026/NĐ-CP'));
  writeFileSync(join(mockRoot, 'raw', 'download', 'congbao.chinhphu.vn', '03-2026-nd-cp.html'), htmlVo);

  writeFileSync(join(mockRoot, 'registry', 'van-ban', '04-2026-nd-cp.yaml'), mkYaml('04/2026/NĐ-CP'));

  const mockAudit = kiemToanKhoNap(mockRoot);
  t(
    'kiemToanKhoNap trên fixture: đếm đúng đủ các nhóm DA_INGEST, CO_TOAN_VAN, VO_HTML, THIEU_RAW',
    mockAudit.tong_vb_hien_hanh === 4
      && mockAudit.thong_ke.DA_INGEST_TRI_THUC === 1
      && mockAudit.thong_ke.CO_TOAN_VAN_CHUA_INGEST === 1
      && mockAudit.thong_ke.VO_HTML_CHUA_TAI_PDF === 1
      && mockAudit.thong_ke.THIEU_RAW === 1,
    JSON.stringify(mockAudit.thong_ke),
  );
} finally {
  rmSync(mockRoot, { recursive: true, force: true });
}

// 5. Kho thật (tắt PDF scan để chạy nhanh trong test unit; CLI thật chạy đầy đủ với pdftotext)
const realFast = kiemToanKhoNap(ROOT, { kiemPdf: false });
t(
  'kiemToanKhoNap kho thật: tổng VB hiện hành > 400 và cộng đúng bằng tổng 5 nhóm',
  realFast.tong_vb_hien_hanh > 400
    && Object.values(realFast.thong_ke).reduce((a, b) => a + b, 0) === realFast.tong_vb_hien_hanh,
  JSON.stringify(realFast.thong_ke),
);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
