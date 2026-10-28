// Test 3 công cụ nạp nội dung TB-TCHQ (issue #232): tools/tai-pdf-tb.mjs,
// tools/trich-noi-dung-tb.mjs, tools/tb-chay-lo.mjs.
//
// Chạy offline: không gọi customs.gov.vn, không gọi LLM. Phần tải PDF được thử bằng
// một máy chủ HTTP cục bộ (tệp thật / tệp 404) nên kết quả tất định.
//
//   node tools/test/tb-noi-dung-tb.mjs
//
// Phần cần pdftotext (poppler) sẽ bị BỎ QUA nếu máy không có — để CI không đỏ vì
// thiếu công cụ hệ thống.
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  chuanHoaURL, tachSoHieu, slugTB, docCsvObject, docChiMucPDF, timUNGPDF,
  trichTenHang, trichDacTinh, trichMaKetLuan8So, trichLyDo, trichDonViDeNghi,
  lamSachQuyenRiengTu, coDauHieuCaNhan, giaiMaSoHieuTrongVanBan,
} from '../lib/tb-tchq.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Chạy lệnh và chờ xong (bất đồng bộ — máy chủ HTTP chạy trong chính tiến trình này,
 *  gọi đồng bộ sẽ chặn event loop nên tiến trình con không kết nối được). */
function chayLenh(cmd, argv) {
  return new Promise((resolve) => {
    const p = spawn(cmd, argv, { encoding: 'utf8' });
    let out = '';
    let err = '';
    p.stdout.on('data', (d) => { out += d; });
    p.stderr.on('data', (d) => { err += d; });
    p.on('close', (ma) => resolve({ ma, out, err }));
  });
}

let pass = 0;
let fail = 0;
const t = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`PASS ${name}`); } else { fail += 1; console.log(`FAIL ${name} ${extra}`); }
};
// realpath: xem tools/trich-noi-dung-tb.mjs — tesseract không đọc được /tmp/... trên macOS
const tmp = mkdtempSync(join(realpathSync(tmpdir()), 'tb-noi-dung-'));

// ------------------------------------------------------------------ fixture: PDF có lớp chữ Unicode
/**
 * Sinh PDF tối giản có lớp chữ Unicode (Type1 + ToUnicode CMap) — không cần thư viện.
 * Chữ trong PDF thật của Tổng cục Hải quan là tiếng Việt có dấu, nên fixture phải
 * giữ được dấu thì mới diễn được đúng đường trích.
 */
function taoPdf(text) {
  // xuống dòng như PDF thật (khung A4, chữ 9pt) — nếu để 1 dòng quá dài thì ảnh raster
  // hoá ra khổng lồ và tesseract không đọc nổi.
  const lines = String(text).split('\n').flatMap((l) => {
    if (l.length <= 88) return [l];
    const out = [];
    let cur = '';
    for (const w of l.split(' ')) {
      if (cur && `${cur} ${w}`.length > 88) { out.push(cur); cur = w; } else cur = cur ? `${cur} ${w}` : w;
    }
    if (cur) out.push(cur);
    return out;
  });
  const chars = [...new Set(lines.join(''))].filter((c) => c !== '\n');
  const base = Math.max(33, 250 - chars.length);
  const map = new Map();
  chars.forEach((c, i) => map.set(c, base + i));
  const bChu = (s) => [...s].map((c) => String.fromCharCode(map.get(c))).join('')
    .replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  const bf = chars
    .map((c, i) => `<${(base + i).toString(16).padStart(2, '0')}> <${c.codePointAt(0).toString(16).padStart(4, '0')}>`)
    .join('\n');
  const cmap = `/CIDInit /ProcSet findresource begin
12 dict begin
begincmap
/CMapName /A-TEST def
/CMapType 2 def
1 begincodespacerange
<00> <ff>
endcodespacerange
${chars.length} beginbfchar
${bf}
endbfchar
endcmap
CMapName currentdict /CMap defineresource pop
end
end`;
  const noiDung = lines.map((l, i) => `1 0 0 1 40 ${800 - i * 13} Tm (${bChu(l)}) Tj`).join('\n');
  const content = `BT /F1 9 Tf\n${noiDung}\nET`;
  const objs = [];
  objs[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objs[2] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
  objs[3] = '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>';
  const width = base + chars.length - 1;
  const widths = new Array(chars.length).fill(450).join(' ');
  objs[4] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /ToUnicode 6 0 R /FirstChar ${base} /LastChar ${width} /Widths [ ${widths} ] >>`;
  objs[5] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
  objs[6] = `<< /Length ${cmap.length} >>\nstream\n${cmap}\nendstream`;
  let out = '%PDF-1.4\n';
  const offsets = [];
  for (let i = 1; i < objs.length; i += 1) { offsets[i] = out.length; out += `${i} 0 obj\n${objs[i]}\nendobj\n`; }
  const xref = out.length;
  out += `xref\n0 ${objs.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < objs.length; i += 1) out += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  out += `trailer\n<< /Size ${objs.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(out, 'latin1');
}

/** Toàn văn TB-TCHQ lấy từ dữ liệu thật (tracuuhs-detail) — bỏ phần cá nhân. */
const VAN_BAN_TB = `BỘ TÀI CHÍNH TỔNG CỤC HẢI QUAN
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM

Số: 1012/TB-TCHQ

Hà Nội, ngày 21 tháng 02 năm 2019

VỀ KẾT QUẢ PHÂN LOẠI ĐỐI VỚI HÀNG HÓA XUẤT KHẨU, NHẬP KHẨU

Căn cứ Luật Hải quan số 54/2014/QH13 ngày 23 tháng 6 năm 2014;

Trên cơ sở kết quả phân tích của Chi cục Kiểm định Hải quan 2 và đề nghị của Cục trưởng Cục Thuế XNK, Tổng cục Hải quan thông báo kết quả phân loại hàng hóa như sau:

Tên hàng theo khai báo: Mục 1: Hợp chất Diphenyl Methane Diisocyanate MDI MILLIONATE MR-200. Hàng mới 100%.

Đơn vị nhập khẩu: Công ty CP Công nghệ Oval Việt Nam; Mã số thuế: 0101234567; Địa chỉ: Số 9 Lê Quang Đạo, Hà Nội.

Số, ngày tờ khai hải quan: 0101234567/A11 ngày 05/05/2018 đăng ký tại Chi cục Hải quan cảng Hải Phòng.

Tóm tắt mô tả và đặc tính hàng hóa: Poly [methylene (polyphenyl isocyanate)] nguyên sinh, dạng lỏng.

Kết quả phân loại:

Tên gọi theo cấu tạo, công dụng: Poly [methylene (polyphenyl isocyanate)] nguyên sinh, dạng lỏng.

thuộc nhóm 39.09 “Nhựa amino, nhựa phenolic và các polyurethan, dạng nguyên sinh”, phân nhóm “- Nhựa amino khác”, mã số 3909.31.00 “- - Poly(metylen phenyl isocyanat)”, tại Danh mục hàng hóa xuất khẩu, nhập khẩu Việt Nam./.

Nơi nhận:
Tổng cục trưởng (để báo cáo);
Cty Công ty CP Công nghệ Oval Việt Nam, phường Mỹ Đình 1, TP Hà Nội;
Lưu: VT, TXNK-Đ.Hằng (3b).

KT. TỔNG CỤC TRƯỞNG
`;

// ------------------------------------------------------------------ 1. URL
t('URL: sửa tiền tố lặp "https://xhttps://x/…"',
  chuanHoaURL('https://files.customs.gov.vnhttps://files.customs.gov.vn/DA_NANG/a.pdf')
  === 'https://files.customs.gov.vn/DA_NANG/a.pdf',
  chuanHoaURL('https://files.customs.gov.vnhttps://files.customs.gov.vn/DA_NANG/a.pdf'));
t('URL: gộp "//" thừa trong đường dẫn',
  chuanHoaURL('https://files.customs.gov.vn/DONG_NAI//Data/CV_TCHQ/x.pdf')
  === 'https://files.customs.gov.vn/DONG_NAI/Data/CV_TCHQ/x.pdf',
  chuanHoaURL('https://files.customs.gov.vn/DONG_NAI//Data/CV_TCHQ/x.pdf'));
t('URL: giữ khoảng trắng trong tên tệp (mã hoá %20) + bỏ rác',
  chuanHoaURL('  https://files.customs.gov.vn/DA_NANG/503 TB-TCHQ.tif  ')
  === 'https://files.customs.gov.vn/DA_NANG/503%20TB-TCHQ.tif',
  chuanHoaURL('  https://files.customs.gov.vn/DA_NANG/503 TB-TCHQ.tif  '));

// ------------------------------------------------------------------ 2. số hiệu
const soHieu = tachSoHieu('503/TB-TCHQ/2018');
t('số hiệu: tách được số + năm', soHieu.num === 503 && soHieu.nam === 2018, JSON.stringify(soHieu));
t('số hiệu: không có năm vẫn tách được số', tachSoHieu('1005/TB-TCHQ').num === 1005 && tachSoHieu('1005/TB-TCHQ').nam === null);
t('số hiệu: dải số "503-508/TB-TCHQ" mở rộng thành 6 số',
  tachSoHieu('503-508/TB-TCHQ').dai.join(',') === '503,504,505,506,507,508'
  && tachSoHieu('503-508/TB-TCHQ').nums.join(',') === '503,508');
t('slug: 503/TB-TCHQ/2018 → 503-tb-tchq-2018', slugTB('503/TB-TCHQ/2018') === '503-tb-tchq-2018', slugTB('503/TB-TCHQ/2018'));

// ------------------------------------------------------------------ 3. chỉ mục PDF
const CSV_HU = `stt,so_hieu,ngay_ban_hanh,noi_dung_tom_tat,pdf_url_primary,nam
1,1005/TB-TCHQ,27/02/2025,Xác định trước mã số,https://files.customs.gov.vn/CustomsCMS/TONG_CUC/2025/3/3/TB1005.pdf,2025
2,503-508/TB-TCHQ,26/01/2018,Kết quả phân loại,https://files.customs.gov.vn/DA_NANG/503-508.pdf,2018
3,989/TB-TCHQ,24/03/2022,Kết quả phân loại,https://files.customs.gov.vn/CustomsCMS/TONG_CUC/2022/3/29/Vanban_989.PDF,2022
`;
const chiMuc = docChiMucPDF(docCsvObject(CSV_HU));
t('chỉ mục PDF: mở rộng dải số "503-508" thành 6 số',
  chiMuc.theoKhoa.has('505@2018') && chiMuc.theoKhoa.get('505@2018').url.endsWith('503-508.pdf'));
t('chỉ mục PDF: ưu tiên khớp đúng số + năm',
  timUNGPDF(chiMuc, '505/TB-TCHQ/2018')[0].do_tin_cay === 'khop_so_va_nam'
  && timUNGPDF(chiMuc, '505/TB-TCHQ/2018')[0].url.endsWith('503-508.pdf'));
t('chỉ mục PDF: lệch năm thì đánh dấu khớp số khác năm (không tự tin)',
  timUNGPDF(chiMuc, '989/TB-TCHQ/2018')[0].do_tin_cay === 'khop_so_khac_nam',
  JSON.stringify(timUNGPDF(chiMuc, '989/TB-TCHQ/2018')));
t('chỉ mục PDF: không có số hiệu thì không đoán',
  timUNGPDF(chiMuc, 'abc/TB-TCHQ').length === 0);

// ------------------------------------------------------------------ 4. trích trường
t('trích: ten_hang lấy từ "Tên hàng theo khai báo"',
  (trichTenHang(VAN_BAN_TB) || '').includes('Diphenyl Methane Diisocyanate'),
  trichTenHang(VAN_BAN_TB));
t('trích: dac_tinh lấy từ "Tóm tắt mô tả và đặc tính hàng hóa"',
  (trichDacTinh(VAN_BAN_TB) || '').includes('Poly [methylene'),
  trichDacTinh(VAN_BAN_TB));
t('trích: ma_ket_luan_8_so = 39093100', trichMaKetLuan8So(VAN_BAN_TB) === '39093100', trichMaKetLuan8So(VAN_BAN_TB));
const lyDo = trichLyDo(VAN_BAN_TB);
t('trích: ly_do là chuỗi nhóm → phân nhóm → mã, kết bằng "Việt Nam"',
  !!lyDo && lyDo.ly_do.includes('thuộc nhóm 39.09') && lyDo.ly_do.includes('phân nhóm')
  && lyDo.ly_do.includes('mã số 3909.31.00') && lyDo.ly_do.includes('Việt Nam'),
  lyDo && lyDo.ly_do);
t('trích: ly_do mang kèm mã kết luận khớp', !!lyDo && lyDo.ma_ket_luan_8_so === '39093100');
t('trích: don_vi_de_nghi lấy sau "đề nghị của"',
  (trichDonViDeNghi(VAN_BAN_TB) || '').includes('Cục trưởng Cục Thuế'),
  trichDonViDeNghi(VAN_BAN_TB));
t('trích: văn bản không có mã số → không bịa (null)',
  trichMaKetLuan8So('Chỉ có câu văn không mã.') === null && trichLyDo('Chỉ có câu văn không mã.') === null);

// ------------------------------------------------------------------ 5. quyền riêng tư
t('riêng tư: bỏ MST',
  !coDauHieuCaNhan(lamSachQuyenRiengTu('Mã số thuế: 0101234567')) && lamSachQuyenRiengTu('Mã số thuế: 0101234567').includes('##MST##'));
t('riêng tư: bỏ tên doanh nghiệp',
  !coDauHieuCaNhan(lamSachQuyenRiengTu('Đơn vị nhập khẩu: Công ty CP Công nghệ Oval Việt Nam')),
  lamSachQuyenRiengTu('Đơn vị nhập khẩu: Công ty CP Công nghệ Oval Việt Nam'));
t('riêng tư: bỏ số tờ khai',
  !coDauHieuCaNhan(lamSachQuyenRiengTu('Số, ngày tờ khai hải quan: 0101234567/A11 ngày 05/05/2018')),
  lamSachQuyenRiengTu('Số, ngày tờ khai hải quan: 0101234567/A11 ngày 05/05/2018'));
t('riêng tư: bỏ "Nơi nhận" (có DN + địa chỉ)',
  !coDauHieuCaNhan(lamSachQuyenRiengTu('Nơi nhận:\nCty Công ty CP Công nghệ Oval Việt Nam, Số 9 Lê Quang Đạo, Hà Nội;')),
  lamSachQuyenRiengTu('Nơi nhận:\nCty Công ty CP Công nghệ Oval Việt Nam, Số 9 Lê Quang Đạo, Hà Nội;'));
t('riêng tư: phát hiện dấu vết sót lại',
  coDauHieuCaNhan('Công ty TNHH ABC') === 'ten_dn' && coDauHieuCaNhan('MST: 0101234567') === 'mst');

// ------------------------------------------------------------------ 6. đọc số hiệu trong PDF
t('PDF: đọc được số hiệu trong văn bản', giaiMaSoHieuTrongVanBan('Số: 1005 /TB-TCHQ')[0] === 1005);
t('PDF: đọc được dải số hiệu', giaiMaSoHieuTrongVanBan('Số: 503-508/TB-TCHQ').join(',') === '503,504,505,506,507,508');

// ------------------------------------------------------------------ 7. CLI: trich-noi-dung-tb.mjs
const coPdftotext = spawnSync('pdftotext', ['-v'], { encoding: 'utf8' }).status === 0
  || spawnSync('pdftotext', ['-v'], { encoding: 'utf8' }).error === undefined;
if (!coPdftotext) {
  console.log('SKIP phần cần pdftotext (máy không có poppler) — 6 test CLI bị bỏ qua');
} else {
  const thuMucPdf = join(tmp, 'pdf');
  mkdirSync(thuMucPdf, { recursive: true });
  const tepPdf = join(thuMucPdf, '1012-tb-tchq-2019.pdf');
  writeFileSync(tepPdf, taoPdf(VAN_BAN_TB));
  const thuMucJson = join(tmp, 'json');
  const r = (await chayLenh('node', [
    join(ROOT, 'tools', 'trich-noi-dung-tb.mjs'), tepPdf,
    '--out-dir', thuMucJson, '--so-hieu', '1012/TB-TCHQ/2019', '--nhom', '3909',
  ])).out;
  const tepJson = join(thuMucJson, '1012-tb-tchq-2019.json');
  t('CLI trich: ghi ra 1 tệp JSON', existsSync(tepJson), r);
  if (existsSync(tepJson)) {
    const d = JSON.parse(readFileSync(tepJson, 'utf8'));
    t('CLI trich: shape đúng (so_hieu, nhom_hs, 5 trường, trang_thai, canh_bao_ocr)',
      d.so_hieu === '1012/TB-TCHQ/2019' && d.nhom_hs === '3909'
      && 'ten_hang' in d && 'dac_tinh' in d && 'ma_ket_luan_8_so' in d && 'ly_do' in d && 'don_vi_de_nghi' in d
      && d.trang_thai === 'ok' && d.canh_bao_ocr === false, JSON.stringify(d).slice(0, 300));
    t('CLI trich: trích đúng mã kết luận + lý do', d.ma_ket_luan_8_so === '39093100' && (d.ly_do || '').includes('3909.31.00'),
      JSON.stringify({ ma: d.ma_ket_luan_8_so, ly_do: d.ly_do }));
    t('CLI trich: tên hàng không còn tên doanh nghiệp/MST',
      !coDauHieuCaNhan(d.ten_hang || '') && !coDauHieuCaNhan(d.dac_tinh || ''),
      JSON.stringify({ ten_hang: d.ten_hang, dac_tinh: d.dac_tinh }));
    t('CLI trich: có dấu vết nguồn (tệp + sha256 + số trang)',
      !!(d.nguon && d.nguon.sha256 && d.nguon.bytes > 0 && d.nguon.trang >= 1), JSON.stringify(d.nguon));
  }
  // PDF không đọc được nội dung → phải ghi "khong_trich_duoc" + lý do, KHÔNG bịa
  const tepRong = join(thuMucPdf, 'rong.pdf');
  writeFileSync(tepRong, taoPdf('Trang trắng không có nội dung TB nào cả.'));
  // trích không được → tool cố ý trả mã thoát 1; ở đây không coi là lỗi test
  await chayLenh('node', [join(ROOT, 'tools', 'trich-noi-dung-tb.mjs'), tepRong, '--out-dir', thuMucJson, '--so-hieu', '1/TB-TCHQ/2020']);
  const dRong = JSON.parse(readFileSync(join(thuMucJson, '1-tb-tchq-2020.json'), 'utf8'));
  t('CLI trich: không trích được → trang_thai "khong_trich_duoc" + lý do (không bịa)',
    dRong.trang_thai === 'khong_trich_duoc' && !!dRong.ly_do_khong_trich && !dRong.ma_ket_luan_8_so,
    JSON.stringify(dRong).slice(0, 300));
}

// ------------------------------------------------------------------ 8. CLI: tai-pdf-tb.mjs (máy chủ HTTP cục bộ)
const pdfBytes = taoPdf(VAN_BAN_TB);
const server = createServer((req, res) => {
  if (req.url === '/tb-ok.pdf') {
    res.writeHead(200, { 'Content-Type': 'application/pdf' });
    res.end(pdfBytes);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('khong co');
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const coHttp = `http://127.0.0.1:${port}`;
const csvThu = join(tmp, 'master.csv');
writeFileSync(csvThu, `stt,so_hieu,ngay_ban_hanh,noi_dung_tom_tat,pdf_url_primary,nam
1,1012/TB-TCHQ,21/02/2019,Kết quả phân loại,${coHttp}/tb-ok.pdf,2019
2,2000/TB-TCHQ,27/02/2025,Link chết,${coHttp}/tb-chet.pdf,2025
`);
const thuMucTai = join(tmp, 'tai');
await chayLenh('node', [
  join(ROOT, 'tools', 'tai-pdf-tb.mjs'), '1012/TB-TCHQ/2019', '2000/TB-TCHQ/2025',
  '--csv', csvThu, '--out', thuMucTai, '--rate-sleep-ms', '0',
]);
const tepPdfTai = join(thuMucTai, '1012-tb-tchq-2019.pdf');
t('CLI tải: lưu đúng tệp PDF', existsSync(tepPdfTai), tepPdfTai);
t('CLI tải: tệp tải về là PDF thật', existsSync(tepPdfTai) && readFileSync(tepPdfTai).subarray(0, 5).toString() === '%PDF-');
const logTai = join(thuMucTai, 'nap-tb.jsonl');
t('CLI tải: ghi nhật ký JSONL (số hiệu, url, bytes, sha256, trạng thái)',
  existsSync(logTai) && (() => {
    const d = JSON.parse(readFileSync(logTai, 'utf8').trim().split('\n')[0]);
    return d.so_hieu === '1012/TB-TCHQ/2019' && d.url === `${coHttp}/tb-ok.pdf`
      && d.bytes === pdfBytes.length && /^[0-9a-f]{64}$/.test(d.sha256) && d.trang_thai === 'ok';
  })(), existsSync(logTai) ? readFileSync(logTai, 'utf8').slice(0, 300) : 'không có log');
const loiNap = join(thuMucTai, 'loi-nap.jsonl');
t('CLI tải: link chết → ghi loi-nap.jsonl',
  existsSync(loiNap) && readFileSync(loiNap, 'utf8').includes('2000/TB-TCHQ/2025'),
  existsSync(loiNap) ? readFileSync(loiNap, 'utf8').slice(0, 300) : 'không có loi-nap');
t('CLI tải: link chết KHÔNG tạo tệp PDF rỗng', !existsSync(join(thuMucTai, '2000-tb-tchq-2025.pdf')));

// ------------------------------------------------------------------ 9. CLI: tb-chay-lo.mjs
const danhSach = join(tmp, 'ket-qua.json');
writeFileSync(danhSach, JSON.stringify([
  { so_hieu: '1012/TB-TCHQ/2019', nhom_hs: '3909', ten_nhom: 'Nhựa amino' },
  { so_hieu: '2000/TB-TCHQ/2025', nhom_hs: '3909', ten_nhom: 'Nhựa amino' },
]));
const thuMucLo = join(tmp, 'lo');
await chayLenh('node', [
  join(ROOT, 'tools', 'tb-chay-lo.mjs'),
  '--danh-sach', danhSach, '--csv', csvThu, '--out-dir', thuMucLo,
  '--pdf-dir', join(tmp, 'lo-pdf'), '--limit', '1', '--rate-sleep-ms', '0',
]);
t('CLI lô: giới hạn --limit=1 → đúng 1 tệp nội dung',
  existsSync(join(thuMucLo, '1012-tb-tchq-2019.json'))
  && !existsSync(join(thuMucLo, '2000-tb-tchq-2025.json')),
  `${existsSync(thuMucLo) ? readdirSync(thuMucLo).join(',') : 'không có'} | log: ${existsSync(join(thuMucLo, 'log-nap.jsonl')) ? readFileSync(join(thuMucLo, 'log-nap.jsonl'), 'utf8').slice(0, 400) : 'không có'} | nap: ${existsSync(join(tmp, 'lo-pdf', 'nap-tb.jsonl')) ? readFileSync(join(tmp, 'lo-pdf', 'nap-tb.jsonl'), 'utf8').slice(0, 400) : 'không có'} | loi: ${existsSync(join(tmp, 'lo-pdf', 'loi-nap.jsonl')) ? readFileSync(join(tmp, 'lo-pdf', 'loi-nap.jsonl'), 'utf8').slice(0, 400) : 'không có'}`);
t('CLI lô: ghi log nạp', existsSync(join(thuMucLo, 'log-nap.jsonl')));

server.close();
rmSync(tmp, { recursive: true, force: true });
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
