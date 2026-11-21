// Test bộ kiểm đối chiếu nguyên văn điều khoản: tools/kiem-tra-dieu-khoan.mjs.
// Chạy được trên mọi môi trường kể cả CI Linux thiếu pdftotext (dùng .txt/.md, mock PDF và kiểm kho thật).
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { napSo, ROOT } from '../lib/registry.mjs';
import { chuanHoaKhopNguyenVan, kiemTraDieuKhoan } from '../kiem-tra-dieu-khoan.mjs';

let pass = 0;
let fail = 0;
const t = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`PASS ${name}`); }
  else { fail += 1; console.log(`FAIL ${name} ${extra}`); }
};

const tmpDirs = [];
const makeTmp = (prefix = 'kb-dk-') => {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tmpDirs.push(dir);
  return dir;
};

const sha256Buf = (bufOrStr) => createHash('sha256').update(bufOrStr).digest('hex');

/** Sinh tệp PDF tối giản 1 trang rỗng (0 ký tự lớp chữ) thuần Node. */
function taoPdfRong() {
  const objs = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] >>\nendobj\n',
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const o of objs) {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += o;
  }
  const xrefOffset = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(pdf, 'utf8');
}

function taoDoc(overrides = {}) {
  return {
    _file: 'registry/van-ban/mau.yaml',
    _slug: 'mau',
    so_hieu: '99/2026/TT-BTC',
    toan_van: 'raw/mau.txt',
    xac_minh: { muc: 'NGUON_A', dieu_khoan: [] },
    ...overrides,
  };
}

try {
  // 0. Chuẩn hóa chuanHoaKhopNguyenVan: NFC/NFD, hoa/thường, xuống dòng, ngoặc cong/thẳng, gạch nối
  const nfd = 'ĐIỀU 1.\n  “Hàng hoá” – xuất khẩu,\r\nnhập-khẩu!'.normalize('NFD');
  const normA = chuanHoaKhopNguyenVan(nfd);
  const normB = chuanHoaKhopNguyenVan('điều 1 "hàng hoá" - xuất khẩu nhập khẩu');
  t('(0) chuanHoaKhopNguyenVan chuẩn hóa NFC, hoa/thường, ngắt dòng, ngoặc cong/thẳng, gạch nối',
    normA === 'điều 1 hàng hoá xuất khẩu nhập khẩu' && normA === normB,
    JSON.stringify({ normA, normB }));

  // 1. Khớp nguyên văn qua ngắt dòng, dấu ngoặc cong/thẳng, viết hoa/thường, nối trang ±1 và toan_van mảng
  const r1 = makeTmp();
  mkdirSync(join(r1, 'raw'), { recursive: true });
  const textPage1 = 'ĐIỀU 1. PHẠM VI\n“Hàng hóa\r\nxuất-khẩu”, nhập khẩu theo quy định tại\nLuật Hải quan số';
  const textPage2 = 'CÔNG BÁO/Số 409/Ngày 18-07-2026\n\n33\n\n54/2014/QH13 và Nghị định hướng dẫn.';
  const textPage3 = 'Điều 2. Hiệu lực thi hành từ ngày 01 tháng 01 năm 2026.';
  const fullTxt = `${textPage1}\f${textPage2}\f${textPage3}`;
  writeFileSync(join(r1, 'raw', 'phu-luc.md'), '# Không liên quan\n', 'utf8');
  writeFileSync(join(r1, 'raw', 'van-ban.txt'), fullTxt, 'utf8');
  const shaTxt = sha256Buf(fullTxt);

  const k1 = kiemTraDieuKhoan({
    vanBan: [taoDoc({
      toan_van: ['raw/phu-luc.md', 'raw/van-ban.txt'],
      xac_minh: {
        muc: 'NGUON_A',
        dieu_khoan: [
          {
            dieu: 1,
            noi_dung: '"Hàng hóa xuất khẩu", nhập khẩu theo quy định tại Luật Hải quan số 54/2014/QH13 và Nghị định hướng dẫn.',
            trang_pdf: 1,
            sha256_pdf: shaTxt,
          },
          {
            dieu: 2,
            noi_dung: 'Hiệu lực thi hành từ ngày 01 tháng 01 năm 2026.',
            trang_pdf: 3,
            sha256_pdf: shaTxt,
          },
        ],
      },
    })],
  }, { root: r1, coPdftotext: false });
  t('(1) khớp nguyên văn qua ngắt dòng, ngoặc cong/thẳng, hoa/thường, nối trang ±1 & toan_van mảng',
    k1.loi.length === 0 && k1.thongKe.soDieuKhoanKhop === 2,
    JSON.stringify(k1));

  // 2. Sửa chữ / bịa nội dung → LỖI kèm so_hieu, dieu, trang_pdf
  const k2 = kiemTraDieuKhoan({
    vanBan: [taoDoc({
      so_hieu: '88/2026/TT-BTC',
      toan_van: 'raw/van-ban.txt',
      xac_minh: {
        muc: 'NGUON_A',
        dieu_khoan: [
          {
            dieu: 2,
            noi_dung: 'Hiệu lực thi hành từ ngày 15 tháng 09 năm 2026.', // bịa ngày khác văn bản thật
            trang_pdf: 3,
          },
        ],
      },
    })],
  }, { root: r1, coPdftotext: false });
  t('(2) sửa chữ / bịa nội dung → LỖI kèm so_hieu, dieu, trang_pdf',
    k2.loi.length === 1
    && k2.loi[0].so_hieu === '88/2026/TT-BTC'
    && k2.loi[0].dieu === 2
    && k2.loi[0].trang_pdf === 3
    && /88\/2026\/TT-BTC/.test(k2.loi[0].msg),
    JSON.stringify(k2.loi));

  // 3. Sai sha256_pdf (kể cả khi kiemTraPdf=false) / sai định dạng 64 hex / thiếu tệp → LỖI
  const badSha = '0'.repeat(64);
  const k3 = kiemTraDieuKhoan({
    vanBan: [
      taoDoc({
        _file: 'registry/van-ban/sha-lech.yaml',
        toan_van: 'raw/van-ban.txt',
        xac_minh: {
          muc: 'NGUON_A',
          dieu_khoan: [
            { dieu: 1, noi_dung: 'Điều 1. Phạm vi', sha256_pdf: badSha },
            { dieu: 2, noi_dung: 'Điều 2.', sha256_pdf: 'khong-phai-64-hex' },
          ],
        },
      }),
      taoDoc({
        _file: 'registry/van-ban/sha-thieu-tep.yaml',
        toan_van: 'raw/khong-ton-tai.pdf',
        xac_minh: {
          muc: 'NGUON_A',
          dieu_khoan: [
            { dieu: 1, noi_dung: 'Điều 1.', sha256_pdf: shaTxt },
          ],
        },
      }),
    ],
  }, { root: r1, kiemTraPdf: false });
  t('(3) sai sha256_pdf, sai định dạng 64 hex hoặc thiếu tệp → LỖI ngay cả khi kiemTraPdf=false',
    k3.loi.length === 3
    && k3.loi.some((e) => /lệch sha256_pdf/.test(e.msg))
    && k3.loi.some((e) => /64 hex/.test(e.msg))
    && k3.loi.some((e) => /thiếu tệp/.test(e.msg)),
    JSON.stringify(k3.loi));

  // 4. Sai trang_pdf trên tài liệu nhiều trang (mock PDF có lớp chữ) + trang_pdf trên PDF giả 0 chữ → LỖI
  const r4 = makeTmp();
  mkdirSync(join(r4, 'raw'), { recursive: true });
  const pdfTextMockPath = join(r4, 'raw', 'nhieu-trang.pdf');
  const pdfScanPath = join(r4, 'raw', 'scan-0-chu.pdf');
  writeFileSync(pdfTextMockPath, '%PDF-1.4\n% mock\n');
  writeFileSync(pdfScanPath, taoPdfRong());
  const mockPages = [
    'Điều 1. Quy định chung về thủ tục hải quan điện tử và kiểm tra hồ sơ.',
    'Điều 2. Đối tượng áp dụng tại các chi cục hải quan cửa khẩu.',
    'Điều 3. Kiểm tra thực tế hàng hóa xuất khẩu, nhập khẩu.',
    'Điều 4. Hiệu lực thi hành kể từ ngày ký ban hành quyết định này.',
  ].join('\f') + '\f';

  const k4 = kiemTraDieuKhoan({
    vanBan: [
      taoDoc({
        _file: 'registry/van-ban/sai-trang.yaml',
        so_hieu: '10/2026/TT-BTC',
        toan_van: 'raw/nhieu-trang.pdf',
        xac_minh: {
          muc: 'NGUON_A',
          dieu_khoan: [
            { dieu: 4, noi_dung: 'Hiệu lực thi hành kể từ ngày ký ban hành quyết định này.', trang_pdf: 1 }, // trang 4 nhưng khai 1
            { dieu: 4, noi_dung: 'Hiệu lực thi hành kể từ ngày ký ban hành quyết định này.', trang_pdf: 5 }, // ngoài 1..4
          ],
        },
      }),
      taoDoc({
        _file: 'registry/van-ban/scan-co-trang.yaml',
        so_hieu: '11/2026/QH16',
        toan_van: 'raw/scan-0-chu.pdf',
        xac_minh: {
          muc: 'NGUON_A',
          dieu_khoan: [
            { dieu: 1, noi_dung: 'Nội dung tóm tắt trên bản scan.', trang_pdf: 1 },
          ],
        },
      }),
    ],
  }, {
    root: r4,
    coPdftotext: true,
    docPdf: (abs) => (abs === pdfScanPath ? '\f' : mockPages),
  });
  t('(4) sai trang_pdf trên tài liệu nhiều trang hoặc gắn trang_pdf trên PDF 0 chữ → LỖI',
    k4.loi.length === 3
    && k4.loi.some((e) => e.dieu === 4 && e.trang_pdf === 1 && /không khớp nguyên văn/.test(e.msg))
    && k4.loi.some((e) => e.dieu === 4 && e.trang_pdf === 5 && /ngoài khoảng 1\.\.4/.test(e.msg))
    && k4.loi.some((e) => e.so_hieu === '11/2026/QH16' && /không có lớp chữ/.test(e.msg)),
    JSON.stringify(k4.loi));

  // 5. PDF 0 chữ không gắn trang_pdf / sha256_pdf → bỏ qua an toàn, 0 lỗi (kể cả khi thiếu pdftotext)
  const k5Mock = kiemTraDieuKhoan({
    vanBan: [taoDoc({
      _file: 'registry/van-ban/scan-an-toan.yaml',
      so_hieu: '19/2026/QH16',
      toan_van: 'raw/scan-0-chu.pdf',
      xac_minh: {
        muc: 'NGUON_A',
        dieu_khoan: [
          { dieu: 1, noi_dung: 'Thuế bảo vệ môi trường là 0 đồng/lít.' },
        ],
      },
    })],
  }, {
    root: r4,
    coPdftotext: true,
    docPdf: () => '   \f  \f',
  });
  const k5NoTool = kiemTraDieuKhoan({
    vanBan: [taoDoc({
      _file: 'registry/van-ban/thieu-pdftotext.yaml',
      so_hieu: '10/2026/TT-BTC',
      toan_van: 'raw/nhieu-trang.pdf',
      xac_minh: {
        muc: 'NGUON_A',
        dieu_khoan: [
          {
            dieu: 4,
            noi_dung: 'Hiệu lực thi hành kể từ ngày ký ban hành quyết định này.',
            trang_pdf: 4,
            sha256_pdf: sha256Buf(Buffer.from('%PDF-1.4\n% mock\n')),
          },
        ],
      },
    })],
  }, { root: r4, coPdftotext: false });
  t('(5) PDF 0 chữ không gắn trang_pdf/sha256_pdf và môi trường thiếu pdftotext → bỏ qua an toàn, 0 lỗi',
    k5Mock.loi.length === 0
    && k5Mock.thongKe.soDieuKhoanBoQuaPdfScan === 1
    && k5Mock.thongTin.length === 1
    && k5NoTool.loi.length === 0
    && k5NoTool.thongKe.soDieuKhoanBoQuaThieuPdftotext === 1
    && k5NoTool.thongTin.length === 1,
    JSON.stringify({ k5Mock, k5NoTool }));

  // 5b. Kiểm tra hành vi thật khi không có pdftotext trong PATH qua subprocess
  const nodeDir = dirname(process.execPath);
  const pdftotextDir = spawnSync('which', ['pdftotext'], { encoding: 'utf8' }).stdout.trim();
  if (!pdftotextDir || dirname(pdftotextDir) !== nodeDir) {
    const cliNoPdfPath = spawnSync(
      process.execPath,
      [join(ROOT, 'tools', 'kiem-tra-dieu-khoan.mjs'), '--json'],
      { cwd: ROOT, env: { ...process.env, PATH: nodeDir }, encoding: 'utf8' },
    );
    const parsed = JSON.parse(cliNoPdfPath.stdout || '{}');
    t('(5b) CLI với PATH không có pdftotext vẫn exit 0 và bỏ qua đối chiếu lớp chữ PDF an toàn',
      cliNoPdfPath.status === 0 && parsed.loi?.length === 0 && parsed.thongKe?.coPdftotext === false,
      JSON.stringify({ status: cliNoPdfPath.status, thongKe: parsed.thongKe, err: cliNoPdfPath.stderr }));
  }

  // 6. Chạy thật kiemTraDieuKhoan(napSo(), {}) → 0 lỗi, và xác nhận 85/2026/TT-BTC (21 điều khoản)
  const soThat = napSo(ROOT);
  const k6 = kiemTraDieuKhoan(soThat, {});
  const vb85 = soThat.vanBan.find((d) => d.so_hieu === '85/2026/TT-BTC');
  const soMuc85 = vb85?.xac_minh?.dieu_khoan?.length || 0;
  const loi85 = k6.loi.filter((e) => e.so_hieu === '85/2026/TT-BTC');
  t('(6) kho thật: kiemTraDieuKhoan(napSo(), {}) = 0 lỗi và 85/2026/TT-BTC (21 điều khoản) khớp 100% nguyên văn',
    k6.loi.length === 0 && (!k6.thongKe.coPdftotext || (soMuc85 === 21 && loi85.length === 0)),
    `tongLoi=${k6.loi.length}; soMuc85=${soMuc85}; loi85=${JSON.stringify(loi85.slice(0, 3))}`);
} finally {
  for (const d of tmpDirs) rmSync(d, { recursive: true, force: true });
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
