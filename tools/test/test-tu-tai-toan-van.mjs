#!/usr/bin/env node
// Unit & E2E tests (100% offline) cho tools/tu-tai-toan-van.mjs.
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { kiemTraDieuKhoan } from '../kiem-tra-dieu-khoan.mjs';
import { napSo, ROOT } from '../lib/registry.mjs';
import {
  chayTuTaiToanVan,
  dinhDangMarkdownTuTai,
  timUngVienTuTai,
} from '../tu-tai-toan-van.mjs';

let pass = 0;
let fail = 0;
const t = (name, cond, extra = '') => {
  if (cond) {
    pass += 1;
    console.log(`PASS ${name}`);
  } else {
    fail += 1;
    console.error(`FAIL ${name}${extra ? `: ${extra}` : ''}`);
  }
};

const tmpDirs = [];
function makeTmp(prefix = 'tu-tai-test-') {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), prefix)));
  tmpDirs.push(dir);
  return dir;
}

function writeMinimalRegistry(root, docs) {
  const regDir = join(root, 'registry');
  const vbDir = join(regDir, 'van-ban');
  mkdirSync(vbDir, { recursive: true });
  writeFileSync(join(regDir, 'cay-xnk.yaml'), '[]\n', 'utf8');
  writeFileSync(join(regDir, 'co-quan.yaml'), '[]\n', 'utf8');
  writeFileSync(
    join(regDir, 'nguon-uy-tin.yaml'),
    [
      'A:',
      '  - ten_mien: congbao.chinhphu.vn',
      '  - ten_mien: vanban.chinhphu.vn',
      '  - ten_mien: datafiles.chinhphu.vn',
      '  - ten_mien: chinhphu.vn',
      '  - ten_mien: vbpl.vn',
      '  - ten_mien: mof.gov.vn',
      'B:',
      '  - ten_mien: thuvienphapluat.vn',
      'C:',
      '  - ten_mien: "*"',
      '',
    ].join('\n'),
    'utf8',
  );
  for (const { slug, data } of docs) {
    writeFileSync(
      join(vbDir, `${slug}.yaml`),
      `# Sổ mẫu kiểm thử\n${yaml.dump(data, { lineWidth: -1, noRefs: true })}`,
      'utf8',
    );
  }
}

try {
  // 1. Candidate discovery (timUngVienTuTai)
  {
    const tmp = makeTmp('tu-tai-discovery-');
    mkdirSync(join(tmp, 'raw', 'download', 'mof.gov.vn'), { recursive: true });
    mkdirSync(join(tmp, 'raw', 'download', 'scan.gov.vn'), { recursive: true });
    mkdirSync(join(tmp, 'data', 'dieu-khoan-day-du'), { recursive: true });

    writeFileSync(
      join(tmp, 'raw', 'download', 'mof.gov.vn', 'tt-co-txt.txt'),
      'Điều 1. Phạm vi điều chỉnh của văn bản.\n\nĐiều 2. Hiệu lực thi hành.',
      'utf8',
    );
    writeFileSync(
      join(tmp, 'raw', 'download', 'mof.gov.vn', 'tt-da-trich.txt'),
      'Điều 1. Đã trích rồi.',
      'utf8',
    );
    writeFileSync(
      join(tmp, 'data', 'dieu-khoan-day-du', 'tt-da-trich.dieu.jsonl'),
      `${JSON.stringify({ dieu: 1, noi_dung: 'Điều 1. Đã trích rồi.', sha256_pdf: 'a'.repeat(64) })}\n`,
      'utf8',
    );

    const scanPdfPath = join(tmp, 'raw', 'download', 'scan.gov.vn', 'tt-scan.pdf');
    writeFileSync(scanPdfPath, '%PDF-1.4\n%fake-scan\n', 'utf8');
    writeFileSync(
      `${scanPdfPath}.nguon.json`,
      JSON.stringify({ loai_tep_raw: 'PDF_BAN_SCAN_CAN_OCR', co_lop_chu: false }),
      'utf8',
    );

    writeMinimalRegistry(tmp, [
      {
        slug: 'tb-tchq-1',
        data: {
          so_hieu: '1234/TB-TCHQ',
          loai: 'THONG_BAO',
          ten: 'Thông báo phân loại hàng hóa',
          tinh_trang: 'CON_HIEU_LUC',
          nguon: [{ url: 'https://congbao.chinhphu.vn/van-ban/1234.pdf' }],
        },
      },
      {
        slug: 'tb-chq-2',
        data: {
          so_hieu: '5678/TB-CHQ',
          loai: 'THONG_BAO',
          ten: 'Thông báo phân loại CHQ',
          tinh_trang: 'CON_HIEU_LUC',
          nguon: [{ url: 'https://congbao.chinhphu.vn/van-ban/5678.pdf' }],
        },
      },
      {
        slug: 'vb-chi-vbpl',
        data: {
          so_hieu: '10/2026/TT-BTC',
          loai: 'THONG_TU',
          ten: 'Chỉ có nguồn vbpl.vn',
          tinh_trang: 'CON_HIEU_LUC',
          nguon: [
            { url: 'https://vbpl.vn/TW/Pages/vbpq-toanvan.aspx?ItemID=1' },
            { url: 'https://thuvienphapluat.vn/van-ban/10-2026.aspx' },
          ],
        },
      },
      {
        slug: 'vb-can-tai',
        data: {
          so_hieu: '20/2026/TT-BTC',
          loai: 'THONG_TU',
          ten: 'Cần tải toàn văn ưu tiên PDF',
          tinh_trang: 'CON_HIEU_LUC',
          nguon: [
            { url: 'https://vbpl.vn/TW/Pages/vbpq-toanvan.aspx?ItemID=2' },
            { url: 'https://mof.gov.vn/portal/page?id=20' },
            { url: 'https://vanban.chinhphu.vn/?pageid=27160&docid=20' },
            { url: 'https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/20.pdf' },
          ],
        },
      },
      {
        slug: 'tt-co-txt',
        data: {
          so_hieu: '30/2026/TT-BTC',
          loai: 'THONG_TU',
          ten: 'Có toàn văn TXT chưa trích',
          tinh_trang: 'CON_HIEU_LUC',
          toan_van: 'raw/download/mof.gov.vn/tt-co-txt.txt',
          xac_minh: { muc: 'NGUON_A' },
        },
      },
      {
        slug: 'tt-da-trich',
        data: {
          so_hieu: '31/2026/TT-BTC',
          loai: 'THONG_TU',
          ten: 'Đã có jsonl',
          tinh_trang: 'CON_HIEU_LUC',
          toan_van: 'raw/download/mof.gov.vn/tt-da-trich.txt',
          xac_minh: { muc: 'NGUON_A' },
        },
      },
      {
        slug: 'tt-scan',
        data: {
          so_hieu: '32/2026/TT-BTC',
          loai: 'THONG_TU',
          ten: 'PDF scan cần OCR',
          tinh_trang: 'CON_HIEU_LUC',
          toan_van: 'raw/download/scan.gov.vn/tt-scan.pdf',
          xac_minh: { muc: 'NGUON_A' },
        },
      },
    ]);

    const res = timUngVienTuTai({ root: tmp, limit: 10 });
    t(
      'timUngVienTuTai: bỏ qua TB-TCHQ/TB-CHQ, vbpl.vn, PDF scan, và đã trích; chọn đúng Nhóm 1 & Nhóm 2',
      res.can_tai_toan_van.length === 1
        && res.can_tai_toan_van[0].slug === 'vb-can-tai'
        && res.can_tai_toan_van[0].url === 'https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/20.pdf'
        && res.can_trich_dieu_khoan.length === 1
        && res.can_trich_dieu_khoan[0].slug === 'tt-co-txt'
        && res.duoc_chon.length === 2,
      JSON.stringify({ g1: res.can_tai_toan_van, g2: res.can_trich_dieu_khoan }),
    );

    const slugRes = timUngVienTuTai({ root: tmp, slug: 'tt-co-txt', limit: 1 });
    t(
      'timUngVienTuTai: lọc chính xác theo --slug',
      slugRes.duoc_chon.length === 1 && slugRes.duoc_chon[0].slug === 'tt-co-txt',
    );
  }

  // 2. Rollback safety: VO_HTML, PDF_BAN_SCAN_CAN_OCR, QUA_DUNG_LUONG, HTTP_LOI, và verification fail
  {
    const tmp = makeTmp('tu-tai-rollback-');
    writeMinimalRegistry(tmp, [
      {
        slug: 'doc-vo-html',
        data: {
          so_hieu: '41/2026/TT-BCT',
          loai: 'THONG_TU',
          ten: 'Vỏ HTML không có PDF',
          tinh_trang: 'CON_HIEU_LUC',
          nguon: [{ url: 'https://congbao.chinhphu.vn/van-ban/41-2026.htm' }],
        },
      },
      {
        slug: 'doc-pdf-scan',
        data: {
          so_hieu: '42/2026/TT-BCT',
          loai: 'THONG_TU',
          ten: 'PDF bản scan',
          tinh_trang: 'CON_HIEU_LUC',
          nguon: [{ url: 'https://datafiles.chinhphu.vn/42-2026.pdf' }],
        },
      },
      {
        slug: 'doc-qua-lon',
        data: {
          so_hieu: '43/2026/TT-BCT',
          loai: 'THONG_TU',
          ten: 'PDF vượt dung lượng',
          tinh_trang: 'CON_HIEU_LUC',
          nguon: [{ url: 'https://datafiles.chinhphu.vn/43-2026.pdf' }],
        },
      },
      {
        slug: 'doc-http-loi',
        data: {
          so_hieu: '44/2026/TT-BCT',
          loai: 'THONG_TU',
          ten: 'Lỗi HTTP 404',
          tinh_trang: 'CON_HIEU_LUC',
          nguon: [{ url: 'https://datafiles.chinhphu.vn/44-2026.pdf' }],
        },
      },
    ]);

    const origBytes = {
      'doc-vo-html': readFileSync(join(tmp, 'registry/van-ban/doc-vo-html.yaml')),
      'doc-pdf-scan': readFileSync(join(tmp, 'registry/van-ban/doc-pdf-scan.yaml')),
      'doc-qua-lon': readFileSync(join(tmp, 'registry/van-ban/doc-qua-lon.yaml')),
      'doc-http-loi': readFileSync(join(tmp, 'registry/van-ban/doc-http-loi.yaml')),
    };

    const res = await chayTuTaiToanVan({
      root: tmp,
      limit: 10,
      maxFileMb: 0.01, // 10 KB để kiểm tra QUA_DUNG_LUONG không cần tạo tệp 26 MB
      _chayNap: async ({ slug, file, root }) => {
        const yamlAbs = join(root, file);
        const obj = yaml.load(readFileSync(yamlAbs, 'utf8'), { schema: yaml.CORE_SCHEMA });
        if (slug === 'doc-vo-html') {
          const d = join(root, 'raw/download/congbao.chinhphu.vn');
          mkdirSync(d, { recursive: true });
          const htmlRel = 'raw/download/congbao.chinhphu.vn/doc-vo-html.html';
          writeFileSync(join(root, htmlRel), '<html><body><div id="pdfjs"></div></body></html>', 'utf8');
          writeFileSync(join(root, `${htmlRel}.nguon.json`), '{"loai_tep_raw":"VO_HTML_PDF"}', 'utf8');
          obj.toan_van = htmlRel;
          writeFileSync(yamlAbs, yaml.dump(obj, { lineWidth: -1 }), 'utf8');
          return;
        }
        if (slug === 'doc-pdf-scan') {
          const d = join(root, 'raw/download/datafiles.chinhphu.vn');
          mkdirSync(d, { recursive: true });
          const pdfRel = 'raw/download/datafiles.chinhphu.vn/doc-pdf-scan.pdf';
          writeFileSync(join(root, pdfRel), '%PDF-1.4\nscan', 'utf8');
          writeFileSync(join(root, `${pdfRel}.nguon.json`), '{"loai_tep_raw":"PDF_BAN_SCAN_CAN_OCR"}', 'utf8');
          obj.toan_van = pdfRel;
          writeFileSync(yamlAbs, yaml.dump(obj, { lineWidth: -1 }), 'utf8');
          return;
        }
        if (slug === 'doc-qua-lon') {
          const d = join(root, 'raw/download/datafiles.chinhphu.vn');
          mkdirSync(d, { recursive: true });
          const pdfRel = 'raw/download/datafiles.chinhphu.vn/doc-qua-lon.pdf';
          writeFileSync(join(root, pdfRel), Buffer.alloc(20 * 1024, 'A'));
          obj.toan_van = pdfRel;
          writeFileSync(yamlAbs, yaml.dump(obj, { lineWidth: -1 }), 'utf8');
          return;
        }
        if (slug === 'doc-http-loi') {
          const d = join(root, 'raw/download/datafiles.chinhphu.vn');
          mkdirSync(d, { recursive: true });
          writeFileSync(join(d, 'partial.tmp'), 'partial', 'utf8');
          throw new Error('HTTP 404 Not Found');
        }
      },
      _kiemTraPdf: () => ({ trang_thai: 'PDF_BAN_SCAN_CAN_OCR', co_lop_chu: false }),
    });

    const reasons = new Map(res.bo_qua_can_thu_cong.map((x) => [x.slug, x.ly_do]));
    const yamlsUnchanged = Object.entries(origBytes).every(([slug, buf]) =>
      readFileSync(join(tmp, `registry/van-ban/${slug}.yaml`)).equals(buf),
    );
    const rawClean = !existsSync(join(tmp, 'raw/download/congbao.chinhphu.vn/doc-vo-html.html'))
      && !existsSync(join(tmp, 'raw/download/congbao.chinhphu.vn/doc-vo-html.html.nguon.json'))
      && !existsSync(join(tmp, 'raw/download/datafiles.chinhphu.vn/doc-pdf-scan.pdf'))
      && !existsSync(join(tmp, 'raw/download/datafiles.chinhphu.vn/doc-qua-lon.pdf'))
      && !existsSync(join(tmp, 'raw/download/datafiles.chinhphu.vn/partial.tmp'));

    t(
      'rollback safety: VO_HTML, PDF scan, QUA_DUNG_LUONG, HTTP_LOI đều hoàn tác YAML + xóa tệp raw mới và ghi bo_qua_can_thu_cong',
      res.da_xu_ly.length === 0
        && res.that_bai.length === 0
        && reasons.get('doc-vo-html') === 'VO_HTML_KHONG_PDF'
        && reasons.get('doc-pdf-scan') === 'PDF_BAN_SCAN_CAN_OCR'
        && reasons.get('doc-qua-lon') === 'QUA_DUNG_LUONG'
        && reasons.get('doc-http-loi') === 'HTTP_LOI'
        && yamlsUnchanged
        && rawClean,
      JSON.stringify({ reasons: [...reasons.entries()], yamlsUnchanged, rawClean }),
    );
  }

  // 3. Group 2 real extraction + Group 1->Extract end-to-end + verification failure rollback
  {
    const tmp = makeTmp('tu-tai-extract-');
    mkdirSync(join(tmp, 'raw', 'download', 'mof.gov.vn'), { recursive: true });
    const txtRel = 'raw/download/mof.gov.vn/50-2026-tt-btc.txt';
    const sampleText = [
      'Điều 1. Phạm vi điều chỉnh',
      'Thông tư này quy định chi tiết thủ tục hải quan và kiểm tra chuyên ngành đối với hàng hóa xuất khẩu, nhập khẩu qua cửa khẩu đường bộ và đường biển.',
      '',
      'Điều 2. Hiệu lực thi hành',
      'Thông tư này có hiệu lực thi hành kể từ ngày 01 tháng 01 năm 2027. Các tổ chức và cá nhân có liên quan chịu trách nhiệm thi hành Thông tư này.',
    ].join('\n');
    writeFileSync(join(tmp, txtRel), sampleText, 'utf8');

    writeMinimalRegistry(tmp, [
      {
        slug: '50-2026-tt-btc',
        data: {
          so_hieu: '50/2026/TT-BTC',
          loai: 'THONG_TU',
          ten: 'Thông tư mẫu trích Nhóm 2',
          tinh_trang: 'CON_HIEU_LUC',
          toan_van: txtRel,
          xac_minh: { muc: 'NGUON_A' },
        },
      },
      {
        slug: '51-2026-tt-btc',
        data: {
          so_hieu: '51/2026/TT-BTC',
          loai: 'THONG_TU',
          ten: 'Thông tư mẫu tải rồi trích Nhóm 1',
          tinh_trang: 'CON_HIEU_LUC',
          nguon: [{ url: 'https://mof.gov.vn/51-2026.html' }],
          xac_minh: { muc: 'NGUON_A' },
        },
      },
    ]);

    const res = await chayTuTaiToanVan({
      root: tmp,
      limit: 5,
      _chayNap: async ({ slug, file, root }) => {
        if (slug !== '51-2026-tt-btc') return;
        const d = join(root, 'raw/download/mof.gov.vn');
        const tvRel = 'raw/download/mof.gov.vn/51-2026-tt-btc.txt';
        writeFileSync(join(root, tvRel), sampleText, 'utf8');
        const yamlAbs = join(root, file);
        const obj = yaml.load(readFileSync(yamlAbs, 'utf8'), { schema: yaml.CORE_SCHEMA });
        obj.toan_van = tvRel;
        writeFileSync(yamlAbs, yaml.dump(obj, { lineWidth: -1 }), 'utf8');
      },
    });

    const jsonl50 = join(tmp, 'data/dieu-khoan-day-du/50-2026-tt-btc.dieu.jsonl');
    const jsonl51 = join(tmp, 'data/dieu-khoan-day-du/51-2026-tt-btc.dieu.jsonl');
    const kt = kiemTraDieuKhoan(napSo(tmp), { root: tmp });
    const ok50 = res.da_xu_ly.find((x) => x.slug === '50-2026-tt-btc');
    const ok51 = res.da_xu_ly.find((x) => x.slug === '51-2026-tt-btc');

    t(
      'Group 2 & Group 1->Extract: tạo .dieu.jsonl hợp lệ, đạt 0 lỗi kiemTraDieuKhoan',
      res.da_xu_ly.length === 2
        && res.that_bai.length === 0
        && ok50?.hanh_dong === 'trich_dieu_khoan'
        && ok50?.so_dieu_khoan === 2
        && ok51?.hanh_dong === 'tai_va_trich'
        && ok51?.so_dieu_khoan === 2
        && existsSync(jsonl50)
        && existsSync(jsonl51)
        && kt.loi.length === 0,
      JSON.stringify({ res: res.thong_ke, ktLoi: kt.loi }),
    );

    // Kiểm tra rollback khi kiểm chứng phát hiện lỗi
    const tmpFail = makeTmp('tu-tai-verify-fail-');
    mkdirSync(join(tmpFail, 'raw', 'download', 'mof.gov.vn'), { recursive: true });
    writeFileSync(join(tmpFail, txtRel), sampleText, 'utf8');
    writeMinimalRegistry(tmpFail, [
      {
        slug: '52-2026-tt-btc',
        data: {
          so_hieu: '52/2026/TT-BTC',
          loai: 'THONG_TU',
          ten: 'Thông tư giả lập lỗi kiểm chứng',
          tinh_trang: 'CON_HIEU_LUC',
          toan_van: txtRel,
          xac_minh: { muc: 'NGUON_A' },
        },
      },
    ]);
    const resFail = await chayTuTaiToanVan({
      root: tmpFail,
      limit: 5,
      _kiemTraDieuKhoan: ({ file }) => ({
        loi: [{ file, msg: 'Giả lập lỗi lệch nguyên văn' }],
      }),
    });
    t(
      'verification fail rollback: hoàn tác .dieu.jsonl và ghi vào that_bai[]',
      resFail.da_xu_ly.length === 0
        && resFail.that_bai.length === 1
        && resFail.that_bai[0].ly_do === 'KIEM_TRA_DIEU_KHOAN_LOI'
        && !existsSync(join(tmpFail, 'data/dieu-khoan-day-du/52-2026-tt-btc.dieu.jsonl')),
    );

    // Kiểm tra dinhDangMarkdownTuTai
    const md = dinhDangMarkdownTuTai(res);
    t(
      'dinhDangMarkdownTuTai: chứa tiêu đề, số liệu và slug đã xử lý',
      md.includes('## Tự tải toàn văn & trích điều khoản')
        && md.includes('50-2026-tt-btc')
        && md.includes('51-2026-tt-btc')
        && md.includes('Đã xử lý thành công'),
    );
  }

  // 4. Real ROOT --dry-run + CLI flags (--help, --json, --markdown)
  {
    const helpRun = spawnSync('node', [join(ROOT, 'tools/tu-tai-toan-van.mjs'), '--help'], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    t(
      'CLI --help thoát 0 và in hướng dẫn sử dụng',
      helpRun.status === 0 && helpRun.stdout.includes('--max-file-mb'),
      helpRun.stderr,
    );

    const mdTmpDir = makeTmp('tu-tai-md-');
    const mdOut = join(mdTmpDir, 'summary.md');
    const gitBefore = spawnSync('git', ['status', '--porcelain', 'registry', 'raw', 'data'], {
      cwd: ROOT,
      encoding: 'utf8',
    }).stdout;

    const dryCli = spawnSync(
      'node',
      [join(ROOT, 'tools/tu-tai-toan-van.mjs'), '--dry-run', '--limit', '5', '--json', '--markdown', mdOut],
      { cwd: ROOT, encoding: 'utf8', timeout: 30000 },
    );
    const gitAfter = spawnSync('git', ['status', '--porcelain', 'registry', 'raw', 'data'], {
      cwd: ROOT,
      encoding: 'utf8',
    }).stdout;

    let parsed = null;
    try {
      parsed = JSON.parse(dryCli.stdout);
    } catch {
      parsed = null;
    }

    t(
      'Real ROOT --dry-run --json --markdown chạy sạch không tác dụng phụ',
      dryCli.status === 0
        && parsed !== null
        && parsed.che_do === 'dry_run'
        && Array.isArray(parsed.ung_vien)
        && parsed.ung_vien.length <= 5
        && existsSync(mdOut)
        && readFileSync(mdOut, 'utf8').includes('## Tự tải toàn văn & trích điều khoản')
        && gitBefore === gitAfter,
      dryCli.stderr,
    );
  }
} finally {
  for (const d of tmpDirs) rmSync(d, { recursive: true, force: true });
}

console.log(`\nTổng: ${pass} PASS, ${fail} FAIL`);
if (fail > 0) process.exit(1);
