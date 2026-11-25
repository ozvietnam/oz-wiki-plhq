#!/usr/bin/env node
// Kiểm thử trích xuất điều khoản đầy đủ (100% Điều N), gộp tầng NGUON_A, kiểm khớp & tra cứu O(1).
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { kiemTraDieuKhoan } from '../kiem-tra-dieu-khoan.mjs';
import { dungDieuKhoan, gopDieuKhoanNguonA } from '../lib/dieu-khoan-dist.mjs';
import { khoa, napSo, ROOT } from '../lib/registry.mjs';
import { taoKhoTraCuu, traDieuKhoan } from '../lib/tra-cuu-plhq.mjs';
import {
  chayTrichDieuKhoanDayDu,
  duDieuKienTrichDayDu,
} from '../trich-dieu-khoan-day-du.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..');

const tmpDirs = [];
function makeTmp() {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), 'dk-day-du-test-')));
  tmpDirs.push(dir);
  return dir;
}

function writeMinimalRegistry(root, docs) {
  const regDir = join(root, 'registry');
  const vbDir = join(regDir, 'van-ban');
  mkdirSync(vbDir, { recursive: true });
  writeFileSync(join(regDir, 'cay-xnk.yaml'), '[]\n', 'utf8');
  writeFileSync(join(regDir, 'co-quan.yaml'), '[]\n', 'utf8');
  writeFileSync(join(regDir, 'nguon-uy-tin.yaml'), 'A:\n  - vbpl.vn\nB: []\n', 'utf8');
  for (const { slug, data } of docs) {
    writeFileSync(join(vbDir, `${slug}.yaml`), yaml.dump(data, { lineWidth: -1, noRefs: true }), 'utf8');
  }
}

let passed = 0;
async function test(name, fn) {
  try {
    await fn();
    passed += 1;
    console.log(`PASS: ${name}`);
  } catch (err) {
    console.error(`FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

try {
  // 1. gopDieuKhoanNguonA
  await test('gopDieuKhoanNguonA bảo toàn mục phân khoản YAML, nâng cấp điều ngắn, bổ sung điều mới', () => {
    const yamlClauses = [
      { dieu: 4, khoan: 1, noi_dung: 'Khoản 1 tuyển chọn', trang_pdf: 3, sha256_pdf: 'a'.repeat(64) },
      { dieu: 4, khoan: 2, noi_dung: 'Khoản 2 tuyển chọn', trang_pdf: 3, sha256_pdf: 'a'.repeat(64) },
      { dieu: 6, noi_dung: 'Điều 6 ngắn từ YAML.', trang_pdf: 4, sha256_pdf: 'a'.repeat(64) },
      { dieu: 10, noi_dung: 'Điều 10 rất chi tiết đầy đủ đã biên tập kỹ từ YAML dài hơn bản cắt.', trang_pdf: 6, sha256_pdf: 'a'.repeat(64) },
    ];
    const fullClauses = [
      { dieu: 4, noi_dung: 'Điều 4 bản gộp chung không nên đè 2 khoản tuyển chọn.', trang_pdf: 3, sha256_pdf: 'a'.repeat(64) },
      { dieu: 5, noi_dung: 'Điều 5 mới trích thêm từ toàn văn.', trang_pdf: 4, sha256_pdf: 'a'.repeat(64) },
      { dieu: 6, noi_dung: 'Điều 6 đầy đủ nguyên văn dài hơn rất nhiều từ bản trích đầy đủ.', trang_pdf: 4, sha256_pdf: 'a'.repeat(64) },
      { dieu: 10, noi_dung: 'Điều 10 ngắn hơn.', trang_pdf: 6, sha256_pdf: 'a'.repeat(64) },
    ];
    const merged = gopDieuKhoanNguonA(yamlClauses, fullClauses);
    assert.equal(merged.length, 5);
    assert.deepEqual(
      merged.map((x) => `${x.dieu}.${x.khoan ?? ''}`),
      ['4.1', '4.2', '5.', '6.', '10.'],
    );
    assert.equal(merged[3].noi_dung, fullClauses[2].noi_dung);
    assert.equal(merged[4].noi_dung, yamlClauses[3].noi_dung);
  });

  // 2. duDieuKienTrichDayDu & chayTrichDieuKhoanDayDu (trích >10 điều + kiểm khớp)
  await test('chayTrichDieuKhoanDayDu trích >10 điều, không giới hạn 10 điều, đạt 0 lỗi kiemTraDieuKhoan', () => {
    const tmp = makeTmp();
    mkdirSync(join(tmp, 'raw'), { recursive: true });

    const articles = [];
    for (let i = 1; i <= 16; i += 1) {
      articles.push(`Điều ${i}. Quy định chi tiết nội dung thứ ${i} về thủ tục kiểm tra hải quan đối với hàng hóa xuất khẩu nhập khẩu số ${i}.`);
    }
    const page1 = articles.slice(0, 8).join('\n\n');
    const page2 = articles.slice(8).join('\n\n');
    const rawTxt = `${page1}\f${page2}`;
    writeFileSync(join(tmp, 'raw', 'luat-mau.txt'), rawTxt, 'utf8');

    writeMinimalRegistry(tmp, [
      {
        slug: 'luat-mau',
        data: {
          so_hieu: '99/2026/QH16',
          loai: 'LUAT',
          ten: 'Luật mẫu kiểm thử',
          co_quan: 'QH',
          ngay_ban_hanh: '2026-01-01',
          tinh_trang: 'CON_HIEU_LUC',
          nguon: [{ url: 'https://vbpl.vn/luat-mau', truy_cap: '2026-01-01' }],
          toan_van: 'raw/luat-mau.txt',
          xac_minh: { muc: 'NGUON_A', hieu_luc_da_doi_chieu: true, ngay: '2026-01-01' },
        },
      },
      {
        slug: '1234-tb-tchq-2026',
        data: {
          so_hieu: '1234/TB-TCHQ',
          loai: 'TB_TCHQ',
          ten: 'Thông báo mẫu',
          co_quan: 'TCHQ',
          ngay_ban_hanh: '2026-01-01',
          tinh_trang: 'CON_HIEU_LUC',
          nguon: [{ url: 'https://vbpl.vn/tb', truy_cap: '2026-01-01' }],
          toan_van: 'raw/luat-mau.txt',
          xac_minh: { muc: 'NGUON_A', hieu_luc_da_doi_chieu: true, ngay: '2026-01-01' },
        },
      },
    ]);

    const res = chayTrichDieuKhoanDayDu({ root: tmp, write: true, coPdftotext: false });
    assert.equal(res.da_trich, 1);
    assert.equal(res.tong_dieu_khoan, 16);
    assert.equal(duDieuKienTrichDayDu({ loai: 'TB_TCHQ', so_hieu: '1234/TB-TCHQ', xac_minh: { muc: 'NGUON_A' } }), false);

    const soTmp = napSo(tmp);
    const ver = kiemTraDieuKhoan(soTmp, { root: tmp, coPdftotext: false });
    assert.equal(ver.loi.length, 0, JSON.stringify(ver.loi));
    assert.equal(ver.thongKe.soTepDieuKhoanDayDu, 1);
    assert.equal(ver.thongKe.soDieuKhoanDayDu, 16);

    const dkDist = dungDieuKhoan(soTmp, tmp, '2026-11-25');
    assert.equal(dkDist.thong_ke.so_van_ban_nguon_a, 1);
    assert.equal(dkDist.thong_ke.so_dieu_khoan_nguon_a, 16);
    assert.equal(dkDist.thong_ke.so_tep_dieu_khoan_day_du, 1);
  });

  // 3. dungDieuKhoan khóa ranh giới NGUON_A + kiemTraDieuKhoan bắt lỗi giả mạo & mồ côi
  await test('kiemTraDieuKhoan bắt lỗi giả mạo nội dung, sai SHA-256 và tệp mồ côi trong dieu-khoan-day-du', () => {
    const tmp = makeTmp();
    mkdirSync(join(tmp, 'raw'), { recursive: true });
    mkdirSync(join(tmp, 'data', 'dieu-khoan-day-du'), { recursive: true });

    const rawTxt = 'Điều 1. Quy định gốc hợp lệ về thủ tục hải quan điện tử tại cửa khẩu quốc tế.';
    writeFileSync(join(tmp, 'raw', 'mau-a.txt'), rawTxt, 'utf8');
    const realSha = createHash('sha256').update(rawTxt).digest('hex');

    writeMinimalRegistry(tmp, [
      {
        slug: 'mau-a',
        data: {
          so_hieu: '11/2026/TT-BTC',
          loai: 'THONG_TU',
          ten: 'Thông tư A',
          co_quan: 'BTC',
          ngay_ban_hanh: '2026-01-01',
          tinh_trang: 'CON_HIEU_LUC',
          nguon: [{ url: 'https://vbpl.vn/a', truy_cap: '2026-01-01' }],
          toan_van: 'raw/mau-a.txt',
          xac_minh: { muc: 'NGUON_A', hieu_luc_da_doi_chieu: true, ngay: '2026-01-01' },
        },
      },
      {
        slug: 'mau-b',
        data: {
          so_hieu: '12/2026/TT-BTC',
          loai: 'THONG_TU',
          ten: 'Thông tư B',
          co_quan: 'BTC',
          ngay_ban_hanh: '2026-01-01',
          tinh_trang: 'CON_HIEU_LUC',
          toan_van: 'raw/mau-a.txt',
          xac_minh: { muc: 'NGUON_B', ngay: '2026-01-01' },
        },
      },
    ]);

    // Ghi 1 tệp bịa nội dung + sai SHA, 1 tệp không thuộc NGUON_A, 1 tệp mồ côi
    writeFileSync(
      join(tmp, 'data', 'dieu-khoan-day-du', 'mau-a.dieu.jsonl'),
      `${JSON.stringify({ dieu: 1, noi_dung: 'Nội dung bịa không có trong toàn văn', sha256_pdf: '0'.repeat(64) })}\n`,
      'utf8',
    );
    writeFileSync(
      join(tmp, 'data', 'dieu-khoan-day-du', 'mau-b.dieu.jsonl'),
      `${JSON.stringify({ dieu: 1, noi_dung: rawTxt, sha256_pdf: realSha })}\n`,
      'utf8',
    );
    writeFileSync(
      join(tmp, 'data', 'dieu-khoan-day-du', 'mo-coi.dieu.jsonl'),
      `${JSON.stringify({ dieu: 1, noi_dung: rawTxt })}\n`,
      'utf8',
    );

    const soTmp = napSo(tmp);
    const dkDist = dungDieuKhoan(soTmp, tmp, '2026-11-25');
    // mau-b không thuộc NGUON_A nên không được đưa vào nguyen_van_nguon_a
    assert.equal(dkDist.nguyen_van_nguon_a.some((x) => x.slug === 'mau-b'), false);

    const ver = kiemTraDieuKhoan(soTmp, { root: tmp, coPdftotext: false });
    assert.ok(ver.loi.some((e) => e.msg.includes('lệch sha256_pdf')));
    assert.ok(ver.loi.some((e) => e.msg.includes('không thuộc NGUON_A')));
    assert.ok(ver.loi.some((e) => e.msg.includes('mồ côi')));
  });

  // 4. Kho thật: kiểm tra các điều giữa văn bản vốn trước đây bị cắt ở giới hạn 10 điều
  await test('kho thật: dungDieuKhoan + traDieuKhoan trả NGUYEN_VAN_NGUON_A cho các điều giữa (54/2014/QH13 Đ50, 08/2015/NĐ-CP Đ47, 38/2015/TT-BTC Đ16)', async () => {
    const so = napSo(REPO_ROOT);
    const dk = dungDieuKhoan(so, REPO_ROOT, '2026-11-25');
    assert.ok(dk.thong_ke.so_dieu_khoan_nguon_a >= 8000, `Quá ít điều khoản: ${dk.thong_ke.so_dieu_khoan_nguon_a}`);
    assert.ok(dk.thong_ke.so_tep_dieu_khoan_day_du >= 400, `Quá ít tệp đầy đủ: ${dk.thong_ke.so_tep_dieu_khoan_day_du}`);

    // Kiểm 85/2026/TT-BTC giữ đủ 21 mục tuyển chọn từ YAML
    const vb85 = dk.nguyen_van_nguon_a.find((x) => x.so_hieu === '85/2026/TT-BTC');
    assert.ok(vb85 && vb85.dieu_khoan.length >= 21);

    const store = await taoKhoTraCuu({ root: REPO_ROOT });
    store.dieuKhoan = dk;
    store.dkNguonAByKhoa = new Map(dk.nguyen_van_nguon_a.map((vb) => [khoa(vb.so_hieu), vb]));

    const checks = [
      ['54/2014/QH13', 50],
      ['08/2015/NĐ-CP', 47],
      ['38/2015/TT-BTC', 16],
    ];
    for (const [soHieu, dieu] of checks) {
      const r = traDieuKhoan(store, { so_hieu: soHieu, dieu, chi_nguyen_van: true });
      assert.ok(r.nguyen_van_nguon_a.length >= 1, `Thiếu ${soHieu} Điều ${dieu}`);
      assert.equal(r.nguyen_van_nguon_a[0].tang_tin_cay, 'NGUYEN_VAN_NGUON_A');
      assert.ok(r.nguyen_van_nguon_a[0].sha256_pdf, `Thiếu sha256_pdf ở ${soHieu} Điều ${dieu}`);
    }
  });

  console.log(`\n${passed}/4 test điều khoản đầy đủ đạt.`);
} finally {
  for (const d of tmpDirs) {
    rmSync(d, { recursive: true, force: true });
  }
}
