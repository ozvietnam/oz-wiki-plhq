// Bộ kiểm thử cho tools/ocr-raw.mjs (mock exec: kiểm format \f, metadata .ocr.json, dọn PNG tạm, không ghi đè PDF gốc).
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { ROOT } from '../lib/registry.mjs';
import { kiemTraDieuKhoan } from '../kiem-tra-dieu-khoan.mjs';
import { ocrPdf, parseArgs, timTepPdfChoVanBan } from '../ocr-raw.mjs';

let pass = 0;
let fail = 0;
async function test(name, fn) {
  try {
    await fn();
    pass += 1;
    console.log(`PASS ${name}`);
  } catch (err) {
    fail += 1;
    console.log(`FAIL ${name}: ${err?.stack || err}`);
  }
}

const tmpDirs = [];
const makeTmp = (prefix = 'oz-test-ocr-') => {
  const dir = realpathSync(mkdtempSync(join(realpathSync(tmpdir()), prefix)));
  tmpDirs.push(dir);
  return dir;
};

function setupMockRepo(slug = '05-2017-qh14', soHieu = '05/2017/QH14', toanVanYaml = null) {
  const root = makeTmp();
  mkdirSync(join(root, 'registry', 'van-ban'), { recursive: true });
  mkdirSync(join(root, 'raw', 'download', 'datafiles.chinhphu.vn'), { recursive: true });
  for (const f of ['cay-xnk.yaml', 'co-quan.yaml', 'nguon-uy-tin.yaml']) {
    cpSync(join(ROOT, 'registry', f), join(root, 'registry', f));
  }
  const pdfRel = `raw/download/datafiles.chinhphu.vn/${slug}.pdf`;
  const pdfAbs = join(root, pdfRel);
  const pdfBuf = Buffer.from(`%PDF-1.4\n% fake-scan-pdf-${slug}\n%%EOF\n`, 'utf8');
  writeFileSync(pdfAbs, pdfBuf);

  const tvValue = toanVanYaml || pdfRel;
  const tvBlock = Array.isArray(tvValue)
    ? `toan_van:\n${tvValue.map((x) => `  - ${x}`).join('\n')}`
    : `toan_van: ${tvValue}`;

  writeFileSync(
    join(root, 'registry', 'van-ban', `${slug}.yaml`),
    [
      `so_hieu: ${soHieu}`,
      'loai: LUAT',
      `ten: Văn bản kiểm thử OCR ${soHieu}`,
      'co_quan: QH',
      'ngay_ban_hanh: "2017-06-12"',
      'hieu_luc_tu: "2018-01-01"',
      'tinh_trang: CON_HIEU_LUC',
      'nhanh: [quan-ly-ngoai-thuong/luat-khung]',
      tvBlock,
    ].join('\n') + '\n',
    'utf8',
  );

  return {
    root,
    pdfRel,
    pdfAbs,
    pdfBuf,
    pdfSha256: createHash('sha256').update(pdfBuf).digest('hex'),
  };
}

try {
  await test('parseArgs đọc đúng --slug, --so-hieu, --dpi, --lang, --concurrency, --force', () => {
    const a = parseArgs(['--so-hieu', '05/2017/QH14', '--dpi', '300', '--lang', 'vie', '--concurrency', '2', '--force']);
    assert.equal(a.soHieu, '05/2017/QH14');
    assert.equal(a.dpi, 300);
    assert.equal(a.lang, 'vie');
    assert.equal(a.concurrency, 2);
    assert.equal(a.force, true);
    const b = parseArgs(['--slug', '93-2025-qh15']);
    assert.equal(b.slug, '93-2025-qh15');
    assert.equal(b.dpi, 250);
    assert.equal(b.lang, 'vie+eng');
  });

  await test('ocrPdf gọi pdftoppm -png -r 250 + tesseract stdout -l vie+eng, giữ đúng trang \\f và trang trống cuối', async () => {
    const { root, pdfRel, pdfAbs, pdfBuf, pdfSha256 } = setupMockRepo();
    const calls = [];
    const createdPngDirs = new Set();

    const pageTexts = {
      1: 'LUẬT QUẢN LÝ NGOẠI THƯƠNG\r\nĐiều 1. Phạm vi điều chỉnh'.normalize('NFD'),
      2: 'Điều 3. Giải thích từ ngữ\n1. Ngoại thương là hoạt động mua bán hàng hóa.',
      3: 'Trang 3 nội dung.',
      4: 'Trang 4 nội dung.',
      5: 'Trang 5 nội dung.',
      6: 'Trang 6 nội dung.',
      7: 'Trang 7 nội dung.',
      8: 'Trang 8 nội dung.',
      9: 'Trang 9 nội dung.',
      10: 'Điều 113. Hiệu lực thi hành\nLuật này có hiệu lực thi hành từ ngày 01 tháng 01 năm 2018.',
      11: '',
    };

    const mockExec = async (bin, args) => {
      calls.push({ bin, args: [...args] });
      if (bin === 'pdftoppm') {
        assert.deepEqual(args.slice(0, 4), ['-png', '-r', '250', pdfAbs]);
        const prefix = args[4];
        const tmpDir = dirname(prefix);
        createdPngDirs.add(tmpDir);
        for (let p = 1; p <= 11; p++) {
          writeFileSync(join(tmpDir, `page-${p}.png`), `fake-png-${p}`);
        }
        return { stdout: '', stderr: '' };
      }
      if (bin === 'tesseract') {
        const pngPath = args[0];
        assert.equal(args[1], 'stdout');
        assert.equal(args[2], '-l');
        assert.equal(args[3], 'vie+eng');
        const m = basename(pngPath).match(/^page-(\d+)\.png$/);
        assert.ok(m, `Tên PNG không hợp lệ: ${pngPath}`);
        return { stdout: `${pageTexts[Number(m[1])]}\n`, stderr: '' };
      }
      throw new Error(`Lệnh không mong đợi: ${bin}`);
    };

    const res = await ocrPdf({
      root,
      soHieu: '05/2017/QH14',
      today: '2026-11-22',
      _exec: mockExec,
    });

    assert.equal(res.skipped, false);
    assert.equal(calls.filter((c) => c.bin === 'pdftoppm').length, 1);
    assert.equal(calls.filter((c) => c.bin === 'tesseract').length, 11);

    // Kiểm tra tệp .ocr.txt phân cách bởi \f (giữ nguyên đủ 11 trang kể cả trang 11 trống và thứ tự số 10 sau 9)
    const outTxtAbs = join(root, 'raw', 'ocr', '05-2017-qh14.ocr.txt');
    const txt = readFileSync(outTxtAbs, 'utf8');
    const pages = txt.split('\f');
    assert.equal(pages.length, 11);
    assert.ok(pages[0].includes('Điều 1. Phạm vi điều chỉnh'.normalize('NFC')));
    assert.ok(pages[1].includes('Điều 3. Giải thích từ ngữ'));
    assert.ok(pages[9].includes('Điều 113. Hiệu lực thi hành'));
    assert.equal(pages[10].trim(), '');

    // Kiểm tra đối chiếu trực tiếp với kiemTraDieuKhoan (không gắn sha256_pdf)
    const dkCheck = kiemTraDieuKhoan(
      {
        vanBan: [
          {
            _file: 'registry/van-ban/05-2017-qh14.yaml',
            _slug: '05-2017-qh14',
            so_hieu: '05/2017/QH14',
            toan_van: [pdfRel, 'raw/ocr/05-2017-qh14.ocr.txt'],
            xac_minh: {
              muc: 'NGUON_A',
              dieu_khoan: [
                { dieu: 3, noi_dung: 'Ngoại thương là hoạt động mua bán hàng hóa.', trang_pdf: 2 },
                { dieu: 113, noi_dung: 'Luật này có hiệu lực thi hành từ ngày 01 tháng 01 năm 2018.', trang_pdf: 10 },
              ],
            },
          },
        ],
      },
      { root, coPdftotext: false },
    );
    assert.equal(dkCheck.loi.length, 0);
    assert.equal(dkCheck.thongKe.soDieuKhoanKhop, 2);

    // Kiểm tra metadata .ocr.json
    const meta = JSON.parse(readFileSync(join(root, 'raw', 'ocr', '05-2017-qh14.ocr.json'), 'utf8'));
    assert.equal(meta.sha256_pdf_goc, pdfSha256);
    assert.equal(meta.tep_pdf_goc, pdfRel);
    assert.equal(meta.engine, 'tesseract');
    assert.equal(meta.lang, 'vie+eng');
    assert.equal(meta.dpi, 250);
    assert.equal(meta.so_trang, 11);
    assert.equal(meta.ngay, '2026-11-22');
    assert.equal(meta.ky_tu, txt.length);

    // Kiểm tra đã dọn sạch ảnh PNG tạm và PDF gốc không bị ghi đè
    for (const d of createdPngDirs) assert.equal(existsSync(d), false);
    assert.deepEqual(readFileSync(pdfAbs), pdfBuf);
  });

  await test('ocrPdf hỗ trợ --slug khi toan_van là mảng và bỏ qua nếu đã OCR trùng sha256 (trừ khi --force)', async () => {
    const { root, pdfRel } = setupMockRepo('93-2025-qh15', '93/2025/QH15', [
      'raw/download/datafiles.chinhphu.vn/93-2025-qh15.pdf',
      'raw/ocr/93-2025-qh15.ocr.txt',
    ]);
    let execCount = 0;
    const mockExec = async (bin, args) => {
      execCount += 1;
      if (bin === 'pdftoppm') {
        writeFileSync(join(dirname(args[4]), 'page-1.png'), 'png');
        return { stdout: '', stderr: '' };
      }
      return { stdout: 'Điều 1. Phạm vi điều chỉnh', stderr: '' };
    };

    const r1 = await ocrPdf({ root, slug: '93-2025-qh15', _exec: mockExec });
    assert.equal(r1.skipped, false);
    assert.equal(r1.meta.tep_pdf_goc, pdfRel);
    assert.equal(execCount, 2);

    const r2 = await ocrPdf({ root, slug: '93-2025-qh15', _exec: mockExec });
    assert.equal(r2.skipped, true);
    assert.equal(execCount, 2);

    const r3 = await ocrPdf({ root, slug: '93-2025-qh15', force: true, _exec: mockExec });
    assert.equal(r3.skipped, false);
    assert.equal(execCount, 4);
  });

  await test('dọn sạch PNG tạm khi tesseract lỗi và từ chối tệp không phải %PDF', async () => {
    const { root, pdfAbs, pdfBuf } = setupMockRepo('117-2025-qh15', '117/2025/QH15');
    let tmpDirSeen = null;
    await assert.rejects(
      () => ocrPdf({
        root,
        slug: '117-2025-qh15',
        _exec: async (bin, args) => {
          if (bin === 'pdftoppm') {
            tmpDirSeen = dirname(args[4]);
            writeFileSync(join(tmpDirSeen, 'page-1.png'), 'png');
            return { stdout: '', stderr: '' };
          }
          throw new Error('tesseract mô phỏng lỗi');
        },
      }),
      /tesseract mô phỏng lỗi/,
    );
    assert.ok(tmpDirSeen && !existsSync(tmpDirSeen), 'Thư mục PNG tạm phải bị xóa sau lỗi');
    assert.equal(existsSync(join(root, 'raw', 'ocr', '117-2025-qh15.ocr.txt')), false);
    assert.deepEqual(readFileSync(pdfAbs), pdfBuf);

    // Từ chối file không có magic %PDF
    writeFileSync(pdfAbs, '<html>Not a PDF</html>');
    await assert.rejects(() => ocrPdf({ root, slug: '117-2025-qh15' }), /%PDF/);

    // timTepPdfChoVanBan báo lỗi rõ khi thiếu tham số
    assert.throws(() => timTepPdfChoVanBan(root, {}), /--slug|--so-hieu/);
  });

  await test('CLI tools/ocr-raw.mjs thiếu --slug/--so-hieu thoát mã 2 an toàn', () => {
    const r = spawnSync(process.execPath, [join(ROOT, 'tools', 'ocr-raw.mjs')], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    assert.equal(r.status, 2);
    assert.match(r.stderr, /--slug/);
  });
} finally {
  for (const d of tmpDirs) rmSync(d, { recursive: true, force: true });
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
