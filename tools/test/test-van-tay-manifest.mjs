// Kiểm thử đơn vị & tích hợp cho Wave 30 (lược đồ 1.7.0):
// id chuẩn, vân tay SHA-256, lớp dữ liệu lop-kho@1 và dist/manifest.json.
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT, LUOC_DO_PHIEN_BAN } from '../lib/registry.mjs';
import { LOP_DU_LIEU, tinhVanTay, idDieuKhoan, nutBieuHs, idCas } from '../lib/van-tay.mjs';

let pass = 0;
let fail = 0;
const t = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`PASS ${name}`); }
  else { fail += 1; console.log(`FAIL ${name} ${extra}`); }
};

const HEX64 = /^[0-9a-f]{64}$/;
const tmpDirs = [];

try {
  // 1. Đơn vị: LOP_DU_LIEU (lop-kho@1)
  t('LOP_DU_LIEU khớp 5 lớp chuẩn lop-kho@1 và bị đóng băng',
    Object.isFrozen(LOP_DU_LIEU)
    && LOP_DU_LIEU.LUAT === 'LUAT'
    && LOP_DU_LIEU.RUT_TU_LUAT === 'RUT_TU_LUAT'
    && LOP_DU_LIEU.BO_TRO === 'BO_TRO'
    && LOP_DU_LIEU.TIEN_LE === 'TIEN_LE'
    && LOP_DU_LIEU.KY_THUAT === 'KY_THUAT');

  // 2. Đơn vị: tinhVanTay
  const hStr1 = tinhVanTay('  Điều 1.\r\nNội dung  ');
  const hStr2 = tinhVanTay('Điều 1.\nNội dung');
  t('tinhVanTay: chuẩn hoá chuỗi CRLF/trim và ra 64 ký tự hex thường',
    HEX64.test(hStr1) && hStr1 === hStr2);

  const hObj1 = tinhVanTay({ b: 2, a: { y: 1, x: [3, 1] }, z: undefined });
  const hObj2 = tinhVanTay({ a: { x: [3, 1], y: 1 }, b: 2 });
  const hObjArrDiff = tinhVanTay({ a: { x: [1, 3], y: 1 }, b: 2 });
  t('tinhVanTay: object sắp xếp khoá đệ quy, giữ nguyên thứ tự mảng',
    HEX64.test(hObj1) && hObj1 === hObj2 && hObj1 !== hObjArrDiff);

  // 3. Đơn vị: idDieuKhoan, nutBieuHs, idCas
  t('idDieuKhoan: tạo đủ 3 mức Điều / Khoản / Điểm và trim khoảng trắng',
    idDieuKhoan(' 85-2026-tt-btc ', ' 5 ') === 'vb:85-2026-tt-btc:d:5'
    && idDieuKhoan('85-2026-tt-btc', 5, '2') === 'vb:85-2026-tt-btc:d:5:k:2'
    && idDieuKhoan('85-2026-tt-btc', 5, 2, 'a') === 'vb:85-2026-tt-btc:d:5:k:2:dm:a');

  t('nutBieuHs & idCas: định dạng chuẩn + xử lý rỗng',
    nutBieuHs(' 22030091 ') === 'bieu:22030091'
    && nutBieuHs('') === null
    && nutBieuHs(null) === null
    && idCas('106-99-0', '24-2026-nd-cp', 3) === 'cas:106-99-0:24-2026-nd-cp:3'
    && idCas('', '24-2026-nd-cp', 0) === 'cas:khong-ma:24-2026-nd-cp:0');

  // 4. Tích hợp CLI: node tools/dung.mjs --out <tmp>
  const tmpOut = mkdtempSync(join(tmpdir(), 'kb-w30-'));
  tmpDirs.push(tmpOut);
  execFileSync('node', [join(ROOT, 'tools', 'dung.mjs'), '--out', tmpOut], { cwd: ROOT, encoding: 'utf8' });

  const distDir = join(tmpOut, 'dist');
  const manifestPath = join(distDir, 'manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  const expectedTen = [
    'registry.json',
    'hs-index.json',
    'hs-index-theo-ma.json',
    'wiki-index.json',
    'wiki-chunks.json',
    'dieu-khoan.json',
    'cas-index.json',
    'chinh-sach-mo-ta.json',
    'xuat-xu-fta.json',
    'pvtm.json',
  ];

  let shaMatchAll = true;
  for (const name of expectedTen) {
    const meta = manifest.tep?.[name];
    const buf = readFileSync(join(distDir, name));
    const actualSha = createHash('sha256').update(buf).digest('hex');
    if (!meta || meta.sha256 !== actualSha || meta.bytes !== buf.length) {
      shaMatchAll = false;
      break;
    }
  }

  t('manifest.json: chuan_lop_du_lieu = lop-kho@1, đủ 10 tệp khớp SHA-256 + bytes thật trên đĩa',
    manifest.luoc_do_phien_ban === LUOC_DO_PHIEN_BAN
    && manifest.chuan_lop_du_lieu === 'lop-kho@1'
    && manifest.tong_tep === 10
    && Object.keys(manifest.tep || {}).length === 10
    && shaMatchAll
    && manifest.tep['hs-index-theo-ma.json']?.truong_lan?.tien_le_tb_tchq === 'TIEN_LE'
    && manifest.tep['dieu-khoan.json']?.truong_lan?.tom_tat_nhap === 'BO_TRO'
    && manifest.tep['xuat-xu-fta.json']?.lop_du_lieu === 'LUAT'
    && manifest.tep['pvtm.json']?.lop_du_lieu === 'LUAT');

  const fta = JSON.parse(readFileSync(join(distDir, 'xuat-xu-fta.json'), 'utf8'));
  t('xuat-xu-fta.json: chuan_fta = fta-psr@1, lop_du_lieu = LUAT, id fta:<ma> + van SHA-256',
    fta.chuan_fta === 'fta-psr@1'
    && fta.lop_du_lieu === 'LUAT'
    && fta.tong > 0
    && fta.hiep_dinh.length === fta.tong
    && fta.hiep_dinh.every((h) => h.id === `fta:${h.ma_fta.toLowerCase()}` && HEX64.test(h.van)));

  const pvtm = JSON.parse(readFileSync(join(distDir, 'pvtm.json'), 'utf8'));
  t('pvtm.json: chuan_pvtm = pvtm@1, lop_du_lieu = LUAT, id pvtm:<ma> + van SHA-256',
    pvtm.chuan_pvtm === 'pvtm@1'
    && pvtm.lop_du_lieu === 'LUAT'
    && pvtm.tong_vu_viec > 0
    && pvtm.vu_viec.length === pvtm.tong_vu_viec
    && pvtm.vu_viec.every((v) => v.id === `pvtm:${v.ma_vu_viec.toLowerCase()}` && HEX64.test(v.van)));

  const reg = JSON.parse(readFileSync(join(distDir, 'registry.json'), 'utf8'));
  t('registry.json: lop_du_lieu = LUAT, mỗi văn bản có id vb:<slug> + van SHA-256',
    reg.lop_du_lieu === 'LUAT'
    && reg.van_ban.length > 0
    && reg.van_ban.every((v) => v.id === `vb:${v.slug}` && HEX64.test(v.van)));

  const dk = JSON.parse(readFileSync(join(distDir, 'dieu-khoan.json'), 'utf8'));
  const dkNguonAOk = dk.nguyen_van_nguon_a.length > 0 && dk.nguyen_van_nguon_a.every((vb) =>
    vb.lop_du_lieu === 'LUAT'
    && vb.dieu_khoan.every((c) => typeof c.id === 'string' && c.id.startsWith(`vb:${vb.slug}:d:`) && HEX64.test(c.van)));
  t('dieu-khoan.json: mỗi điều khoản NGUYEN_VAN_NGUON_A có id + van 64-hex, tom_tat_nhap có lop_du_lieu BO_TRO',
    dk.lop_du_lieu === 'LUAT'
    && dk.lop_du_lieu_khoi?.nguyen_van_nguon_a === 'LUAT'
    && dk.lop_du_lieu_khoi?.tom_tat_nhap === 'BO_TRO'
    && dkNguonAOk
    && dk.tom_tat_nhap.every((vb) => vb.lop_du_lieu === 'BO_TRO'));

  const hsMa = JSON.parse(readFileSync(join(distDir, 'hs-index-theo-ma.json'), 'utf8'));
  const maKeys = Object.keys(hsMa.ma || {});
  const edgesOk = maKeys.length > 0 && maKeys.every((k) =>
    hsMa.ma[k].every((e) => e.nut_bieu === `bieu:${k}` && HEX64.test(e.van) && !('ma_hs' in e)));
  t('hs-index-theo-ma.json: cạnh có nut_bieu + van, không có ma_hs, tien_le_tb_tchq có lop_du_lieu TIEN_LE',
    hsMa.lop_du_lieu === 'LUAT'
    && hsMa.lop_du_lieu_khoi?.tien_le_tb_tchq === 'TIEN_LE'
    && edgesOk
    && (!hsMa.tien_le_tb_tchq || hsMa.tien_le_tb_tchq.lop_du_lieu === 'TIEN_LE')
    && (!hsMa.anh_xa_ahtn_cu || hsMa.anh_xa_ahtn_cu.lop_du_lieu === 'BO_TRO'));

  const hsIdx = JSON.parse(readFileSync(join(distDir, 'hs-index.json'), 'utf8'));
  const hsRowsOk = hsIdx.van_ban.length > 0 && hsIdx.van_ban.every((vb) =>
    vb.dong.every((r) => HEX64.test(r.van) && (!r.ma_hs || r.nut_bieu === `bieu:${r.ma_hs}`)));
  t('hs-index.json: lop_du_lieu LUAT, mỗi dòng có van và nut_bieu khi có ma_hs',
    hsIdx.lop_du_lieu === 'LUAT' && hsRowsOk);

  const cas = JSON.parse(readFileSync(join(distDir, 'cas-index.json'), 'utf8'));
  const casSample = Object.values(cas.theo_cas || {}).flat();
  const casIds = new Set([...casSample, ...(cas.khong_co_cas || [])].map((x) => x.id));
  t('cas-index.json: lop_du_lieu LUAT, mỗi dòng có id duy nhất + van 64-hex',
    cas.lop_du_lieu === 'LUAT'
    && casSample.length > 0
    && casIds.size === casSample.length + cas.khong_co_cas.length
    && casSample.every((x) => typeof x.id === 'string' && x.id.startsWith(`cas:${x.cas}:`) && HEX64.test(x.van))
    && cas.khong_co_cas.every((x) => typeof x.id === 'string' && x.id.startsWith('cas:khong-ma:') && HEX64.test(x.van)));

  const wIdx = JSON.parse(readFileSync(join(distDir, 'wiki-index.json'), 'utf8'));
  const wChk = JSON.parse(readFileSync(join(distDir, 'wiki-chunks.json'), 'utf8'));
  const cs = JSON.parse(readFileSync(join(distDir, 'chinh-sach-mo-ta.json'), 'utf8'));
  t('wiki & chinh-sach-mo-ta: lop_du_lieu BO_TRO và không rò chu-giai-hs/chuong',
    wIdx.lop_du_lieu === 'BO_TRO'
    && wChk.lop_du_lieu === 'BO_TRO'
    && cs.lop_du_lieu === 'BO_TRO'
    && !existsSync(join(distDir, 'chu-giai-hs.json'))
    && !existsSync(join(distDir, 'chu-giai-chuong.json')));
} finally {
  for (const d of tmpDirs) {
    try { rmSync(d, { recursive: true, force: true }); } catch {}
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
