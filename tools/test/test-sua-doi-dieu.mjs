// Kiểm thử đơn vị + tích hợp đồ thị sửa đổi / bãi bỏ cấp Điều khoản (Wave 26 — schema 1.6.0).
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { LUOC_DO_PHIEN_BAN, ROOT, napSo } from '../lib/registry.mjs';
import {
  chuanHoaMaDieu,
  khoaDieuDich,
  napSuaDoiDieu,
  tinhTrangThaiDieu,
  kiemTraSuaDoiDieu,
} from '../lib/sua-doi-dieu.mjs';
import { dungDieuKhoan } from '../lib/dieu-khoan-dist.mjs';
import { taoKhoTraCuu, traDieuKhoan } from '../lib/tra-cuu-plhq.mjs';

let pass = 0;
let fail = 0;
function check(name, cond, detail = '') {
  if (cond) {
    pass += 1;
    console.log(`PASS ${name}`);
  } else {
    fail += 1;
    console.log(`FAIL ${name} ${detail}`);
  }
}

// 1. Chuẩn hóa mã Điều + khóa
check(
  'chuanHoaMaDieu chuẩn hóa Điều 16a, 22, "Điều 22." đồng nhất',
  chuanHoaMaDieu('Điều 16a') === '16a'
  && chuanHoaMaDieu(22) === '22'
  && chuanHoaMaDieu('Điều 22.') === '22'
  && khoaDieuDich('38/2015/TT-BTC', 'Điều 22') === '38/2015/TT-BTC::22',
);

// 2. Suy luận tinhTrangThaiDieu
check(
  'tinhTrangThaiDieu: NGUYEN_BAN / DA_SUA_DOI / DA_BO_SUNG / DA_BAI_BO / TAM_NGUNG (và lọc theo taiNgay)',
  tinhTrangThaiDieu([]) === 'NGUYEN_BAN'
  && tinhTrangThaiDieu([{ loai: 'BO_SUNG', tu_ngay: '2025-01-01' }]) === 'DA_BO_SUNG'
  && tinhTrangThaiDieu([{ loai: 'SUA_DOI', tu_ngay: '2025-01-01' }]) === 'DA_SUA_DOI'
  && tinhTrangThaiDieu([{ loai: 'BAI_BO', khoan_dich: null, tu_ngay: '2026-07-01' }]) === 'DA_BAI_BO'
  && tinhTrangThaiDieu([{ loai: 'BAI_BO', khoan_dich: '2', tu_ngay: '2026-07-01' }]) === 'DA_SUA_DOI'
  && tinhTrangThaiDieu([{ loai: 'SUA_DOI', tu_ngay: '2020-01-01' }, { loai: 'TAM_NGUNG', tu_ngay: '2026-05-01' }]) === 'TAM_NGUNG'
  && tinhTrangThaiDieu([{ loai: 'SUA_DOI', tu_ngay: '2026-02-01' }], { taiNgay: '2025-12-31' }) === 'NGUYEN_BAN'
  && tinhTrangThaiDieu([{ loai: 'SUA_DOI', tu_ngay: '2026-02-01' }], { taiNgay: '2026-02-01' }) === 'DA_SUA_DOI',
);

// 3. Kiểm tra dữ liệu thật data/sua-doi-dieu/*.json đối chiếu với registry
const soReal = napSo(ROOT);
const ktReal = kiemTraSuaDoiDieu(soReal, ROOT);
const napReal = napSuaDoiDieu(ROOT);
check(
  'kho thật: kiemTraSuaDoiDieu 0 lỗi & có >= 50 tệp, >= 1000 tác động',
  ktReal.loi.length === 0 && napReal.tep >= 50 && ktReal.soTacDong >= 1000,
  JSON.stringify({ loi: ktReal.loi.slice(0, 3), tep: napReal.tep, soTacDong: ktReal.soTacDong }),
);

// 4. Phát hiện lỗi orphan & trùng trên mock
const tmp = mkdtempSync(join(tmpdir(), 'kb-sdd-'));
try {
  mkdirSync(join(tmp, 'data', 'sua-doi-dieu'), { recursive: true });
  const mockSo = {
    vanBan: [
      { so_hieu: '01/2026/TT-BTC', _slug: '01-2026-tt-btc', quan_he: { sua_doi: ['38/2015/TT-BTC'] } },
      { so_hieu: '38/2015/TT-BTC', _slug: '38-2015-tt-btc', quan_he: {} },
      { so_hieu: '99/2020/NĐ-CP', _slug: '99-2020-nd-cp', quan_he: {} },
    ],
    theoKhoa: new Map([
      ['01/2026/TT-BTC', [{ so_hieu: '01/2026/TT-BTC', _slug: '01-2026-tt-btc', quan_he: { sua_doi: ['38/2015/TT-BTC'] } }]],
      ['38/2015/TT-BTC', [{ so_hieu: '38/2015/TT-BTC', _slug: '38-2015-tt-btc', quan_he: {} }]],
      ['99/2020/ND-CP', [{ so_hieu: '99/2020/NĐ-CP', _slug: '99-2020-nd-cp', quan_he: {} }]],
    ]),
  };
  writeFileSync(join(tmp, 'data', 'sua-doi-dieu', '01-2026-tt-btc.json'), JSON.stringify({
    van_ban_nguon: '01/2026/TT-BTC',
    slug_nguon: '01-2026-tt-btc',
    hieu_luc_tu: '2026-02-01',
    tac_dong: [
      { van_ban_dich: '99/2020/NĐ-CP', dieu_dich: 5, khoan_dich: null, loai: 'SUA_DOI', dieu_nguon: 1, khoan_nguon: 1, tu_ngay: '2026-02-01', can_cu: 'Điều 1' },
      { van_ban_dich: '38/2015/TT-BTC', dieu_dich: 22, khoan_dich: null, loai: 'SUA_DOI', dieu_nguon: 1, khoan_nguon: 2, tu_ngay: '2026-02-01', can_cu: 'Điều 1' },
      { van_ban_dich: '38/2015/TT-BTC', dieu_dich: 22, khoan_dich: null, loai: 'SUA_DOI', dieu_nguon: 1, khoan_nguon: 2, tu_ngay: '2026-02-01', can_cu: 'Điều 1' },
    ],
  }));
  const ktBad = kiemTraSuaDoiDieu(mockSo, tmp);
  check(
    'kiemTraSuaDoiDieu phát hiện thiếu quan_he đích và bản ghi trùng',
    ktBad.loi.some((x) => x.msg.includes('chưa khai báo quan_he'))
    && ktBad.loi.some((x) => x.msg.includes('trùng bản ghi')),
    JSON.stringify(ktBad.loi),
  );
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

// 5. Compile dist/dieu-khoan.json (in RAM) + traDieuKhoan gắn trang_thai_dieu & lich_su_tac_dong
const dkCompiled = dungDieuKhoan(soReal, ROOT, '2026-11-25');
check(
  'dungDieuKhoan gắn lược đồ 1.6.0 & thống kê sửa đổi điều khoản',
  dkCompiled.luoc_do_phien_ban === LUOC_DO_PHIEN_BAN
  && dkCompiled.thong_ke.so_tep_sua_doi_dieu >= 50
  && dkCompiled.thong_ke.so_dieu_co_lich_su_sua_doi >= 200,
  JSON.stringify(dkCompiled.thong_ke),
);

const store = await taoKhoTraCuu({ distDir: '__nonexistent_force_ram__', root: ROOT });
const resD22 = traDieuKhoan(store, { so_hieu: '38/2015/TT-BTC', dieu: 22, chi_nguyen_van: true });
const d22Item = resD22.nguyen_van_nguon_a[0];
const sourcesD22 = (d22Item?.lich_su_tac_dong || []).map((e) => e.van_ban_nguon);
check(
  'traDieuKhoan 38/2015/TT-BTC Điều 22 trả về DA_SUA_DOI kèm 39/2018/TT-BTC & 121/2025/TT-BTC + canh_bao_sua_doi',
  d22Item?.trang_thai_dieu === 'DA_SUA_DOI'
  && sourcesD22.includes('39/2018/TT-BTC')
  && sourcesD22.includes('121/2025/TT-BTC')
  && typeof d22Item?.canh_bao_sua_doi === 'string'
  && d22Item.canh_bao_sua_doi.includes('121/2025/TT-BTC')
  && (d22Item.dieu_khoan_sua_doi_lien_quan || []).length >= 1,
  JSON.stringify({ trang_thai: d22Item?.trang_thai_dieu, sources: sourcesD22 }),
);

const resD104 = traDieuKhoan(store, { so_hieu: '38/2015/TT-BTC', dieu: 104, chi_nguyen_van: true });
check(
  'traDieuKhoan 38/2015/TT-BTC Điều 104 trả về DA_BAI_BO (86/2026/TT-BTC)',
  resD104.nguyen_van_nguon_a[0]?.trang_thai_dieu === 'DA_BAI_BO'
  && resD104.nguyen_van_nguon_a[0]?.lich_su_tac_dong?.some((e) => e.van_ban_nguon === '86/2026/TT-BTC'),
  JSON.stringify(resD104.nguyen_van_nguon_a[0]?.trang_thai_dieu),
);

assert.equal(fail, 0, `Có ${fail} kiểm thử thất bại`);
console.log(`\nHoàn tất test-sua-doi-dieu: ${pass} đạt, ${fail} lỗi.`);
