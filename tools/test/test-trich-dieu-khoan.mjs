#!/usr/bin/env node
// Unit test cho `tools/trich-dieu-khoan.mjs`.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { kiemTraDieuKhoan, chuanHoaKhopNguyenVan } from '../kiem-tra-dieu-khoan.mjs';
import { napSo } from '../lib/registry.mjs';
import {
  MAC_DINH_MAX_CLAUSES,
  boHeaderCongBao,
  catDoanNguyenVan,
  chayTrichDieuKhoan,
  chonLocDieuKhoan,
  layDanhSachToanVan,
  parseArgs,
  phanTichCacKhoiDieu,
  tachTrang,
  trichDieuKhoanChoVanBan,
  trichDoanTuDocxXml,
} from '../trich-dieu-khoan.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');

function makeTmp() {
  return realpathSync(mkdtempSync(join(tmpdir(), 'trich-dk-test-')));
}

function writeDocYaml(root, slug, bodyObj, headerComment = '# Tệp thử nghiệm UTF-8\n# Bảo toàn nhận xét đầu tệp\n') {
  const regDir = join(root, 'registry');
  const dir = join(regDir, 'van-ban');
  mkdirSync(dir, { recursive: true });
  if (!readFileMaybe(join(regDir, 'cay-xnk.yaml'))) {
    writeFileSync(join(regDir, 'cay-xnk.yaml'), '[]\n', 'utf8');
    writeFileSync(join(regDir, 'co-quan.yaml'), '[]\n', 'utf8');
    writeFileSync(join(regDir, 'nguon-uy-tin.yaml'), 'A: []\nB: []\n', 'utf8');
  }
  const abs = join(dir, `${slug}.yaml`);
  const dumped = yaml.dump(bodyObj, { lineWidth: -1, noRefs: true });
  writeFileSync(abs, `${headerComment}${dumped}`, 'utf8');
  return abs;
}

function readFileMaybe(p) {
  try {
    return readFileSync(p, 'utf8');
  } catch {
    return null;
  }
}

function makeZipDocx(absDocxPath, xmlContent) {
  mkdirSync(dirname(absDocxPath), { recursive: true });
  const py = `
import sys, zipfile
out_path, xml = sys.argv[1], sys.argv[2]
with zipfile.ZipFile(out_path, 'w') as zf:
    zf.writestr('[Content_Types].xml', '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"></Types>')
    zf.writestr('word/document.xml', xml)
`;
  const r = spawnSync('python3', ['-c', py, absDocxPath, xmlContent], { encoding: 'utf8' });
  if (r.error || r.status !== 0) {
    throw new Error(`Không tạo được docx giả lập: ${r.error?.message || r.stderr}`);
  }
}

let total = 0;
let passed = 0;
function test(name, fn) {
  total += 1;
  try {
    fn();
    passed += 1;
    console.log(`PASS: ${name}`);
  } catch (err) {
    console.error(`FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

// 1. parseArgs
test('parseArgs phân tích đầy đủ các cờ CLI', () => {
  const p1 = parseArgs(['--slug', '134-2016-nd-cp', '--max-clauses', '8', '--force', '--dry-run', '--json']);
  assert.deepEqual(p1.slugs, ['134-2016-nd-cp']);
  assert.equal(p1.allReady, false);
  assert.equal(p1.maxClauses, 8);
  assert.equal(p1.force, true);
  assert.equal(p1.dryRun, true);
  assert.equal(p1.json, true);

  const p2 = parseArgs(['--slugs=a,b,c', '--all-ready', '--max-clauses=12']);
  assert.deepEqual(p2.slugs, ['a', 'b', 'c']);
  assert.equal(p2.allReady, true);
  assert.equal(p2.maxClauses, 12);

  const p3 = parseArgs([]);
  assert.equal(p3.maxClauses, MAC_DINH_MAX_CLAUSES);
  assert.equal(p3.force, false);
  assert.equal(p3.dryRun, false);
});

// 2. tachTrang + boHeaderCongBao + catDoanNguyenVan
test('tachTrang và boHeaderCongBao loại tiêu đề Công báo chuẩn xác', () => {
  const pages = tachTrang('Trang 1 nội dung\fCÔNG BÁO/Số 123+124/Ngày 01-02-2024\n\n12\nTrang 2 nội dung\f');
  assert.equal(pages.length, 2);
  const cleaned = boHeaderCongBao(pages[1]).trim();
  assert.equal(cleaned, 'Trang 2 nội dung');
});

test('catDoanNguyenVan cắt cuối câu trong 100–450 ký tự, không cắt giữa Điều X.', () => {
  const text = 'Điều 14. Miễn thuế hàng hóa nhập khẩu tạo tài sản cố định của dự án ưu đãi đầu tư theo quy định tại Điều 16 Luật Thuế xuất khẩu, thuế nhập khẩu. '
    + 'Hàng hóa nhập khẩu tạo tài sản cố định được miễn thuế bao gồm máy móc, thiết bị chuyên dùng trong dây chuyền công nghệ trực tiếp phục vụ sản xuất. '
    + 'Trường hợp phương tiện vận tải chuyên dùng đưa đón công nhân viên thì căn cứ theo tiêu chuẩn của Bộ Khoa học và Công nghệ ban hành từng thời kỳ.';
  const excerpt = catDoanNguyenVan(text);
  assert.ok(excerpt.length >= 100 && excerpt.length <= 450, `độ dài hợp lệ: ${excerpt.length}`);
  assert.ok(excerpt.endsWith('.'), `phải cắt gọn cuối câu: "${excerpt}"`);
  assert.ok(chuanHoaKhopNguyenVan(text).includes(chuanHoaKhopNguyenVan(excerpt)));
});

// 3. phanTichCacKhoiDieu: bỏ mục lục, tham chiếu ngắn, Điều 31a, trích dẫn lồng, phụ lục
test('phanTichCacKhoiDieu loại mục lục, tham chiếu < 40 ký tự, Điều 31a và đoạn trích dẫn', () => {
  const page1 = [
    'MỤC LỤC',
    'Điều 1. Phạm vi điều chỉnh .... 1',
    'Điều 2. Đối tượng áp dụng… 2',
    'CÔNG BÁO/Số 99/Ngày 01-09-2016',
    '3',
    'Điều 1. Phạm vi điều chỉnh',
    'Nghị định này quy định chi tiết một số điều và biện pháp thi hành Luật Thuế xuất khẩu, thuế nhập khẩu về miễn thuế, giảm thuế, hoàn thuế.',
    'Điều 2. (Đã bãi bỏ).',
  ].join('\n');

  const page2 = [
    'CÔNG BÁO/Số 99/Ngày 01-09-2016',
    '4',
    'Điều 3. Đối tượng chịu thuế và người nộp thuế',
    'Hàng hóa xuất khẩu, nhập khẩu qua cửa khẩu, biên giới Việt Nam phải chịu thuế theo quy định của pháp luật hải quan và pháp luật về thuế hiện hành.',
    'Sửa đổi khoản 1 như sau:',
    '“Điều 14. Miễn thuế trong văn bản trích dẫn lồng ghép không phải điều gốc của nghị định sửa đổi này vì độ dài đủ tiêu chuẩn.”',
    'Điều 31a. Thông báo tình hình sử dụng hàng hóa miễn thuế nhập khẩu định kỳ hằng năm theo Mẫu số 07 ban hành kèm theo Nghị định này.',
    'Nội dung quy định tại',
    'Điều 3. Của văn bản khác chỉ là tham chiếu xuống dòng không phải tiêu đề điều mới.',
    'Điều 4. Hiệu lực thi hành',
    'Nghị định này có hiệu lực thi hành kể từ ngày 01 tháng 09 năm 2016 và thay thế các quy định trái với Nghị định này.',
    'TM. CHÍNH PHỦ',
    'Điều 99. Văn bản giả trong phần chữ ký phải dừng trước đây.',
  ].join('\n');

  const blocks = phanTichCacKhoiDieu([page1, page2]);
  assert.deepEqual(
    blocks.map((b) => b.dieu),
    [1, 3, 4],
    'Phải giữ Điều 1, 3, 4; bỏ mục lục, Điều 2 (<40 ký tự), trích dẫn Điều 14, Điều 31a, tham chiếu wrapped và chữ ký cuối',
  );
});

// 4. chonLocDieuKhoan: <= 12 giữ đủ, > 12 chọn tối đa 10 ưu tiên Điều 1–3, giữa phân bổ đều, điều hiệu lực cuối
test('chonLocDieuKhoan giữ đủ khi <= 12 và chọn lọc chuẩn xác khi > 12', () => {
  const mkItems = (count) => Array.from({ length: count }, (_, idx) => ({
    dieu: idx + 1,
    noi_dung: idx === count - 1
      ? `Điều ${idx + 1}. Hiệu lực thi hành văn bản quy phạm pháp luật kể từ ngày ký ban hành áp dụng thống nhất toàn quốc.`
      : `Điều ${idx + 1}. Quy định chi tiết nội dung quản lý nhà nước về thủ tục hải quan và chính sách thuế đối với hàng hóa xuất nhập khẩu.`,
    trang_pdf: idx + 1,
  }));

  const twelve = chonLocDieuKhoan(mkItems(12));
  assert.equal(twelve.length, 12, 'Mặc định giữ đủ khi tổng số điều <= 12');

  const twenty = chonLocDieuKhoan(mkItems(20));
  assert.equal(twenty.length, 10, 'Chọn đúng tối đa 10 điều khi > 12');
  assert.equal(twenty[0].dieu, 1);
  assert.equal(twenty[1].dieu, 2);
  assert.equal(twenty[2].dieu, 3);
  assert.equal(twenty[twenty.length - 1].dieu, 20, 'Giữ điều hiệu lực cuối');
  for (let i = 1; i < twenty.length; i += 1) {
    assert.ok(twenty[i].dieu > twenty[i - 1].dieu, 'Thứ tự điều phải tăng dần');
  }
});

// 5. Ưu tiên nguồn đọc: .ocr.txt > .txt > .md (không wiki) > .pdf > .docx + kiểm chứng chéo kiemTraDieuKhoan
test('Ưu tiên nguồn .ocr.txt trước PDF scan, không gắn sha256_pdf cho PDF scan và khớp kiemTraDieuKhoan 0 lỗi', () => {
  const tmp = makeTmp();
  try {
    const slug = '100-2024-nd-cp';
    const pdfRel = `raw/download/${slug}.pdf`;
    const ocrRel = `raw/ocr/${slug}.ocr.txt`;
    const wikiRel = `wiki/sources/${slug}.md`;
    mkdirSync(join(tmp, 'raw', 'download'), { recursive: true });
    mkdirSync(join(tmp, 'raw', 'ocr'), { recursive: true });
    mkdirSync(join(tmp, 'wiki', 'sources'), { recursive: true });

    writeFileSync(join(tmp, pdfRel), '%PDF-1.4 scan placeholder', 'utf8');
    writeFileSync(join(tmp, wikiRel), '# Stub wiki', 'utf8');
    writeFileSync(
      join(tmp, ocrRel),
      [
        'Điều 1. Phạm vi điều chỉnh của Nghị định quy định chi tiết thủ tục miễn thuế, giảm thuế, hoàn thuế xuất khẩu, thuế nhập khẩu trong thương mại điện tử.',
        '\fCÔNG BÁO/Số 50/Ngày 10-05-2024\n5\nĐiều 2. Hiệu lực thi hành Nghị định này có hiệu lực từ ngày 01 tháng 07 năm 2024 áp dụng thống nhất trên phạm vi cả nước.',
      ].join('\n'),
      'utf8',
    );

    const yamlAbs = writeDocYaml(tmp, slug, {
      so_hieu: '100/2024/NĐ-CP',
      loai: 'NGHI_DINH',
      tinh_trang: 'CON_HIEU_LUC',
      toan_van: [wikiRel, pdfRel, ocrRel],
      xac_minh: {
        pham_vi: 'Ghi chú giữ nguyên',
      },
    });

    const mockPdf = () => 'Ký bởi: Văn phòng Chính phủ\nNgày ký: 01/05/2024'; // PDF scan
    const so = napSo(tmp);
    const res = trichDieuKhoanChoVanBan(so.vanBan[0], {
      root: tmp,
      coPdftotext: true,
      docPdf: mockPdf,
    });

    assert.equal(res.status, 'DA_TRICH');
    assert.equal(res.nguon_trich, ocrRel);
    assert.equal(res.so_dieu_khoan, 2);
    assert.equal(res.dieu_khoan[0].trang_pdf, 1);
    assert.equal(res.dieu_khoan[1].trang_pdf, 2);
    assert.equal(res.dieu_khoan[0].sha256_pdf, undefined, 'Không gắn sha256_pdf của PDF scan khi trích từ .ocr.txt');

    // Giữ nguyên comment đầu tệp và trường sẵn có
    const writtenRaw = readFileSync(yamlAbs, 'utf8');
    assert.ok(writtenRaw.startsWith('# Tệp thử nghiệm UTF-8\n# Bảo toàn nhận xét đầu tệp\n'));
    const writtenObj = yaml.load(writtenRaw, { schema: yaml.CORE_SCHEMA });
    assert.equal(writtenObj.xac_minh.pham_vi, 'Ghi chú giữ nguyên');
    assert.equal(writtenObj.xac_minh.dieu_khoan.length, 2);

    // Tự đối chiếu bằng kiemTraDieuKhoan
    const kt = kiemTraDieuKhoan(napSo(tmp), { root: tmp, docPdf: mockPdf });
    assert.equal(kt.loi.length, 0, `kiemTraDieuKhoan phải 0 lỗi: ${JSON.stringify(kt.loi)}`);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

// 6. PDF lớp chữ -> tách \f, gắn trang_pdf và sha256_pdf khớp PDF gốc
test('Đọc PDF lớp chữ qua docPdf/pdftotext và gắn đúng trang_pdf + sha256_pdf', () => {
  const tmp = makeTmp();
  try {
    const slug = '101-2024-tt-btc';
    const pdfRel = `raw/download/${slug}.pdf`;
    mkdirSync(join(tmp, 'raw', 'download'), { recursive: true });
    const pdfBytes = Buffer.from('%PDF-1.4 text layer binary test content');
    writeFileSync(join(tmp, pdfRel), pdfBytes);
    const expectedSha = createHash('sha256').update(pdfBytes).digest('hex');

    writeDocYaml(tmp, slug, {
      so_hieu: '101/2024/TT-BTC',
      loai: 'THONG_TU',
      tinh_trang: 'CON_HIEU_LUC',
      toan_van: pdfRel,
    });

    const pdfText = [
      'CÔNG BÁO/Số 12/Ngày 05-01-2024\n1\nĐiều 1. Phạm vi điều chỉnh Thông tư này hướng dẫn việc khai hải quan điện tử và kiểm tra sau thông quan tại trụ sở người khai hải quan.',
      'Điều 2. Đối tượng áp dụng bao gồm cơ quan hải quan các cấp, công chức hải quan, người khai hải quan và tổ chức cá nhân liên quan.',
    ].join('\f');
    const mockPdf = () => pdfText;

    const so = napSo(tmp);
    const tvList = layDanhSachToanVan(so.vanBan[0], tmp);
    assert.equal(tvList.length, 1);

    const res = trichDieuKhoanChoVanBan(so.vanBan[0], {
      root: tmp,
      coPdftotext: true,
      docPdf: mockPdf,
    });
    assert.equal(res.status, 'DA_TRICH');
    assert.equal(res.loai_nguon, 'pdf');
    assert.equal(res.dieu_khoan[0].trang_pdf, 1);
    assert.equal(res.dieu_khoan[1].trang_pdf, 2);
    assert.equal(res.dieu_khoan[0].sha256_pdf, expectedSha);

    const kt = kiemTraDieuKhoan(napSo(tmp), { root: tmp, docPdf: mockPdf });
    assert.equal(kt.loi.length, 0, `kiemTraDieuKhoan cho PDF phải 0 lỗi: ${JSON.stringify(kt.loi)}`);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

// 7. DOCX qua unzip word/document.xml -> KHÔNG gắn trang_pdf và KHÔNG gắn sha256_pdf
test('Đọc DOCX thật qua unzip word/document.xml và không gắn trang_pdf/sha256_pdf', () => {
  const xmlSample = '<w:document><w:body><w:p><w:r><w:t>Điều 1. &amp; Điều chỉnh &lt;mẫu&gt;</w:t></w:r></w:p></w:body></w:document>';
  assert.equal(trichDoanTuDocxXml(xmlSample), 'Điều 1. & Điều chỉnh <mẫu>');

  const tmp = makeTmp();
  try {
    const slug = '102-2024-qd-ttg';
    const docxRel = `raw/download/${slug}.docx`;
    const xml = [
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
      '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>',
      '<w:p><w:r><w:t>Điều 1. Phạm vi áp dụng Quyết định quy định cơ chế phối hợp kiểm tra chuyên ngành tại cửa khẩu đối với hàng hóa xuất khẩu, nhập khẩu.</w:t></w:r></w:p>',
      '<w:p><w:r><w:t>Điều 2. Hiệu lực thi hành Quyết định này có hiệu lực từ ngày ký ban hành và thay thế các quy định trước đây trái với Quyết định này.</w:t></w:r></w:p>',
      '</w:body></w:document>',
    ].join('');
    makeZipDocx(join(tmp, docxRel), xml);

    writeDocYaml(tmp, slug, {
      so_hieu: '102/2024/QĐ-TTg',
      loai: 'QUYET_DINH',
      tinh_trang: 'CON_HIEU_LUC',
      toan_van: docxRel,
    });

    const so = napSo(tmp);
    const res = trichDieuKhoanChoVanBan(so.vanBan[0], { root: tmp });
    assert.equal(res.status, 'DA_TRICH');
    assert.equal(res.loai_nguon, 'docx');
    assert.equal(res.so_dieu_khoan, 2);
    assert.equal(res.dieu_khoan[0].trang_pdf, undefined);
    assert.equal(res.dieu_khoan[0].sha256_pdf, undefined);

    const kt = kiemTraDieuKhoan(napSo(tmp), { root: tmp });
    assert.equal(kt.loi.length, 0);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

// 8. Văn bản không có cấu trúc Điều N (QCVN/Công văn) -> KHONG_CO_CAU_TRUC_DIEU, không sửa YAML
test('QCVN hoặc Công văn không có cấu trúc Điều N trả KHONG_CO_CAU_TRUC_DIEU và không bịa dữ liệu', () => {
  const tmp = makeTmp();
  try {
    const slug = '1234-tchq-txnk';
    const txtRel = `raw/ocr/${slug}.ocr.txt`;
    mkdirSync(join(tmp, 'raw', 'ocr'), { recursive: true });
    writeFileSync(
      join(tmp, txtRel),
      'TỔNG CỤC HẢI QUAN\nSố: 1234/TCHQ-TXNK\nV/v hướng dẫn phân loại hàng hóa theo Danh mục AHTN.\nKính gửi: Cục Hải quan các tỉnh, thành phố.\n1. Về mã số HS đề nghị căn cứ Thông tư 31/2022/TT-BTC.',
      'utf8',
    );
    const yamlAbs = writeDocYaml(tmp, slug, {
      so_hieu: '1234/TCHQ-TXNK',
      loai: 'CONG_VAN',
      tinh_trang: 'CON_HIEU_LUC',
      toan_van: txtRel,
    });
    const before = readFileSync(yamlAbs, 'utf8');

    const so = napSo(tmp);
    const res = trichDieuKhoanChoVanBan(so.vanBan[0], { root: tmp });
    assert.equal(res.status, 'KHONG_CO_CAU_TRUC_DIEU');
    assert.equal(res.code, 'KHONG_CO_CAU_TRUC_DIEU');
    assert.equal(readFileSync(yamlAbs, 'utf8'), before, 'YAML không được sửa khi không có cấu trúc Điều N');
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

// 9. --dry-run, --force, và --all-ready lọc đúng HET_HIEU_LUC / TB_TCHQ / PDF scan
test('chayTrichDieuKhoan hỗ trợ --dry-run, --force và lọc --all-ready đúng phạm vi', () => {
  const tmp = makeTmp();
  try {
    mkdirSync(join(tmp, 'raw', 'ocr'), { recursive: true });
    mkdirSync(join(tmp, 'raw', 'download'), { recursive: true });

    writeFileSync(
      join(tmp, 'raw', 'ocr', 'ready-1.ocr.txt'),
      'Điều 1. Phạm vi điều chỉnh của văn bản pháp quy quy định trách nhiệm kiểm tra và giải quyết thủ tục thông quan điện tử hàng hóa xuất khẩu.',
      'utf8',
    );
    writeFileSync(
      join(tmp, 'raw', 'ocr', 'ready-existing.ocr.txt'),
      'Điều 1. Phạm vi mới cập nhật quy định chi tiết chế độ kiểm tra sau thông quan tại trụ sở doanh nghiệp chế xuất khu phi thuế quan.',
      'utf8',
    );
    writeFileSync(
      join(tmp, 'raw', 'ocr', 'expired-1.ocr.txt'),
      'Điều 1. Quy định hết hiệu lực đã bị thay thế.',
      'utf8',
    );
    writeFileSync(join(tmp, 'raw', 'download', 'scan-only.pdf'), '%PDF-1.4 scan only', 'utf8');

    const yamlReady1 = writeDocYaml(tmp, 'ready-1', {
      so_hieu: '01/2025/TT-BTC',
      loai: 'THONG_TU',
      tinh_trang: 'CON_HIEU_LUC',
      toan_van: 'raw/ocr/ready-1.ocr.txt',
    });
    const beforeReady1 = readFileSync(yamlReady1, 'utf8');

    writeDocYaml(tmp, 'ready-existing', {
      so_hieu: '02/2025/TT-BTC',
      loai: 'THONG_TU',
      tinh_trang: 'CON_HIEU_LUC',
      toan_van: 'raw/ocr/ready-existing.ocr.txt',
      xac_minh: {
        dieu_khoan: [{ dieu: 1, noi_dung: 'Điều cũ giữ nguyên nếu không có --force.' }],
      },
    });
    writeDocYaml(tmp, 'expired-1', {
      so_hieu: '03/2010/TT-BTC',
      loai: 'THONG_TU',
      tinh_trang: 'HET_HIEU_LUC',
      toan_van: 'raw/ocr/expired-1.ocr.txt',
    });
    writeDocYaml(tmp, 'scan-only', {
      so_hieu: '04/2025/TT-BTC',
      loai: 'THONG_TU',
      tinh_trang: 'CON_HIEU_LUC',
      toan_van: 'raw/download/scan-only.pdf',
    });

    const mockPdf = () => 'Ký bởi: Bộ Tài chính';

    const dryRes = chayTrichDieuKhoan({
      root: tmp,
      allReady: true,
      dryRun: true,
      coPdftotext: true,
      docPdf: mockPdf,
    });
    assert.equal(dryRes.tong_xet, 2, 'Chỉ xét ready-1 và scan-only (bỏ qua expired-1 và ready-existing)');
    assert.equal(dryRes.da_trich, 1);
    assert.equal(dryRes.can_ocr, 1);
    assert.equal(readFileSync(yamlReady1, 'utf8'), beforeReady1, '--dry-run không được ghi đĩa');

    const runRes = chayTrichDieuKhoan({
      root: tmp,
      slugs: ['ready-existing', 'missing-slug'],
      force: true,
      coPdftotext: true,
      docPdf: mockPdf,
    });
    assert.equal(runRes.da_trich, 1);
    assert.equal(runRes.loi, 1);
    assert.equal(runRes.ket_qua.find((r) => r.slug === 'missing-slug').status, 'KHONG_TIM_THAY_VAN_BAN');
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

// 10. Kiểm tra CLI --help chạy sạch
test('CLI --help trả mã 0 và hiển thị cú pháp đầy đủ', () => {
  const cli = spawnSync(process.execPath, ['tools/trich-dieu-khoan.mjs', '--help'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  assert.equal(cli.status, 0);
  assert.ok(cli.stderr.includes('--all-ready') && cli.stderr.includes('--max-clauses'));
});

console.log(`\nHoàn tất: ${passed}/${total} bài kiểm thử tools/trich-dieu-khoan.mjs PASS.`);
