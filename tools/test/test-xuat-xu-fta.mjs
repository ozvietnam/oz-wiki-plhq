// Kiểm thử đơn vị & tích hợp cho Wave 35 — Sổ đăng ký Xuất xứ hàng hóa & FTA (fta-psr@1).
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT, napSo, LUOC_DO_PHIEN_BAN } from '../lib/registry.mjs';
import { kiemTra } from '../kiem-tra.mjs';
import {
  CHUAN_FTA,
  VAI_TRO_VAN_BAN_FTA,
  docXuatXuFta,
  kiemTraXuatXuFta,
  dungXuatXuFta,
  locXuatXuFtaTaiNgay,
} from '../lib/xuat-xu-fta.mjs';

let pass = 0;
let fail = 0;
const t = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`PASS ${name}`); }
  else { fail += 1; console.log(`FAIL ${name} ${extra}`); }
};

const HEX64 = /^[0-9a-f]{64}$/;
const tmpDirs = [];

try {
  const so = napSo(ROOT);
  const ftaDoc = docXuatXuFta(ROOT);

  // 1. Đọc & kiểm chuẩn dữ liệu thật từ registry/xuat-xu-fta.yaml
  t('docXuatXuFta: đọc registry/xuat-xu-fta.yaml hợp lệ với chuan_fta = fta-psr@1',
    Boolean(ftaDoc) && ftaDoc.chuan_fta === CHUAN_FTA && Array.isArray(ftaDoc.hiep_dinh) && ftaDoc.hiep_dinh.length >= 15);

  const realErrs = kiemTraXuatXuFta(ftaDoc, so);
  t('kiemTraXuatXuFta: dữ liệu thật đạt 0 lỗi, mọi so_hieu tồn tại trong so.theoKhoa',
    realErrs.length === 0,
    JSON.stringify(realErrs));

  // 2. Kiểm tra bộ lọc lỗi đơn vị
  const baseSample = {
    chuan_fta: 'fta-psr@1',
    hiep_dinh: [
      {
        ma_fta: 'ATIGA',
        ten_hiep_dinh: 'Hiệp định ATIGA',
        doi_tac: ['Brunei'],
        mau_co: ['Form D'],
        tu_chung_nhan: true,
        de_minimis_mac_dinh: null,
        hieu_luc_tu: '2010-05-17',
        van_ban_xuat_xu: [{ so_hieu: '126/2022/NĐ-CP', vai_tro: 'BIEU_THUE_UU_DAI' }],
      },
    ],
  };

  t('kiemTraXuatXuFta: phát hiện sai chuan_fta, trùng ma_fta, vai_tro lạ, ngày sai, so_hieu thiếu',
    kiemTraXuatXuFta({ ...baseSample, chuan_fta: 'wrong@1' }, so).some((e) => e.includes('chuan_fta'))
    && kiemTraXuatXuFta({
      ...baseSample,
      hiep_dinh: [baseSample.hiep_dinh[0], baseSample.hiep_dinh[0]],
    }, so).some((e) => e.includes('trùng ma_fta'))
    && kiemTraXuatXuFta({
      ...baseSample,
      hiep_dinh: [{
        ...baseSample.hiep_dinh[0],
        van_ban_xuat_xu: [{ so_hieu: '126/2022/NĐ-CP', vai_tro: 'INVALID_ROLE' }],
      }],
    }, so).some((e) => e.includes('vai_tro'))
    && kiemTraXuatXuFta({
      ...baseSample,
      hiep_dinh: [{ ...baseSample.hiep_dinh[0], hieu_luc_tu: '2022-02-30' }],
    }, so).some((e) => e.includes('hieu_luc_tu'))
    && kiemTraXuatXuFta({
      ...baseSample,
      hiep_dinh: [{
        ...baseSample.hiep_dinh[0],
        van_ban_xuat_xu: [{ so_hieu: '999/2099/TT-XYZ', vai_tro: 'QUY_TAC_XUAT_XU' }],
      }],
    }, so).some((e) => e.includes('không tồn tại trong so.theoKhoa')));

  t('kiemTraXuatXuFta: chặn dẫn HET_HIEU_LUC nếu thiếu lich_su: true, cho phép khi có lich_su: true',
    kiemTraXuatXuFta({
      ...baseSample,
      hiep_dinh: [{
        ...baseSample.hiep_dinh[0],
        van_ban_xuat_xu: [{ so_hieu: '156/2017/NĐ-CP', vai_tro: 'BIEU_THUE_UU_DAI' }],
      }],
    }, so).some((e) => e.includes('HET_HIEU_LUC'))
    && kiemTraXuatXuFta({
      ...baseSample,
      hiep_dinh: [{
        ...baseSample.hiep_dinh[0],
        van_ban_xuat_xu: [{ so_hieu: '156/2017/NĐ-CP', vai_tro: 'BIEU_THUE_UU_DAI', lich_su: true }],
      }],
    }, so).length === 0);

  t('kiemTraXuatXuFta: chặn trường thuế suất (ranh giới 0% hs-code-api)',
    kiemTraXuatXuFta({
      ...baseSample,
      hiep_dinh: [{ ...baseSample.hiep_dinh[0], thue_suat: '0%' }],
    }, so).some((e) => e.includes('ranh giới hs-code-api')));

  // 3. Tích hợp kiemTra(mockSo, {}) vs kiemTra(so, { root: ROOT, kiemFta: true })
  const mockSo = {
    vanBan: [], loiDoc: [], cay: [], nutCay: [], coQuan: [], nguon: {}, theoKhoa: new Map(),
  };
  const mockRes = kiemTra(mockSo, {});
  const realRes = kiemTra(so, { root: ROOT, kiemFta: true, kiemChinhSachMoTa: false, kiemAnhXaAhtn: false, kiemSuaDoiDieu: false });
  t('kiemTra: bỏ qua mockSo khi không truyền root, chạy chuẩn khi truyền root + kiemFta',
    mockRes.loi.length === 0 && realRes.loi.length === 0);

  // 4. Dựng gói dist/xuat-xu-fta.json & lọc tai_ngay
  const built = dungXuatXuFta(so, ROOT, '2026-11-26');
  const allValidItems = built.hiep_dinh.every((h) =>
    h.id === `fta:${h.ma_fta.toLowerCase()}`
    && HEX64.test(h.van)
    && Array.isArray(h.van_ban)
    && h.van_ban.length > 0
    && h.van_ban.every((v) =>
      typeof v.id === 'string'
      && v.id.startsWith('vb:')
      && v.slug
      && v.tinh_trang
      && VAI_TRO_VAN_BAN_FTA.includes(v.vai_tro)));
  t('dungXuatXuFta: schema fta-psr@1, lop_du_lieu LUAT, id chuẩn, van SHA-256 & van_ban đầy đủ',
    built.chuan_fta === 'fta-psr@1'
    && built.lop_du_lieu === 'LUAT'
    && built.luoc_do_phien_ban === LUOC_DO_PHIEN_BAN
    && built.tong === built.hiep_dinh.length
    && allValidItems);

  const asOf2020 = locXuatXuFtaTaiNgay(built, '2020-01-01');
  const ma2020 = new Set(asOf2020.hiep_dinh.map((h) => h.ma_fta));
  let badDateThrew = false;
  try { locXuatXuFtaTaiNgay(built, '2026-13-40'); } catch { badDateThrew = true; }
  t('locXuatXuFtaTaiNgay: lọc đúng FTA hiệu lực tại 2020-01-01 và chặn ngày sai',
    ma2020.has('ATIGA') && ma2020.has('CPTPP') && !ma2020.has('EVFTA') && !ma2020.has('RCEP') && !ma2020.has('CEPA-UAE')
    && asOf2020.tai_ngay === '2020-01-01'
    && asOf2020.hiep_dinh.every((h) => h.van_ban.every((v) => 'tinh_trang_tai_ngay' in v && 'do_chinh_xac_ngay' in v))
    && badDateThrew);

  // 5. Tích hợp CLI: node tools/dung.mjs --out <tmp>
  const tmpOut = mkdtempSync(join(tmpdir(), 'kb-w35-'));
  tmpDirs.push(tmpOut);
  execFileSync('node', [join(ROOT, 'tools', 'dung.mjs'), '--out', tmpOut], { cwd: ROOT, encoding: 'utf8' });
  const distDir = join(tmpOut, 'dist');
  const ftaBuf = readFileSync(join(distDir, 'xuat-xu-fta.json'));
  const ftaJson = JSON.parse(ftaBuf.toString('utf8'));
  const manifest = JSON.parse(readFileSync(join(distDir, 'manifest.json'), 'utf8'));
  const ftaSha = createHash('sha256').update(ftaBuf).digest('hex');

  t('CLI tools/dung.mjs --out: ghi dist/xuat-xu-fta.json và manifest.json (9 tệp) khớp SHA-256',
    ftaJson.chuan_fta === 'fta-psr@1'
    && manifest.tong_tep === 9
    && manifest.tep['xuat-xu-fta.json']?.lop_du_lieu === 'LUAT'
    && manifest.tep['xuat-xu-fta.json']?.sha256 === ftaSha
    && manifest.tep['xuat-xu-fta.json']?.bytes === ftaBuf.length);
} finally {
  for (const d of tmpDirs) {
    try { rmSync(d, { recursive: true, force: true }); } catch {}
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
