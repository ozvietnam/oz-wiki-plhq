// Unit & E2E tests cho công cụ cắt chuyển trạng thái hiệu lực theo ngày (tools/chuyen-hieu-luc.mjs).
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { ROOT, napSo } from '../lib/registry.mjs';
import { kiemTra } from '../kiem-tra.mjs';
import { apDungChuyenHieuLuc, phanTichChuyenHieuLuc } from '../chuyen-hieu-luc.mjs';

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

const tmpDirs = [];
const makeTmp = (prefix) => {
  const d = mkdtempSync(join(tmpdir(), prefix));
  tmpDirs.push(d);
  return d;
};

try {
  // 1. Dry-run trên kho thật tại mốc 2027-01-01
  const kq2027 = phanTichChuyenHieuLuc({ root: ROOT, ngay: '2027-01-01' });
  const sangHet = kq2027.chuyen_trang_thai
    .filter((x) => x.trang_thai_moi === 'HET_HIEU_LUC')
    .map((x) => x.so_hieu)
    .sort();
  const sangCon = kq2027.chuyen_trang_thai
    .filter((x) => x.trang_thai_moi === 'CON_HIEU_LUC')
    .map((x) => x.so_hieu)
    .sort();
  const soatTay = kq2027.can_soat_tay.map((x) => x.so_hieu).sort();

  t('dry-run 2027-01-01: nhận diện đúng 6 VB CON_HIEU_LUC → HET_HIEU_LUC',
    sangHet.length === 6
    && sangHet.includes('11/2018/TT-BTTTT')
    && sangHet.includes('173/2018/TT-BQP')
    && sangHet.includes('174/2025/NĐ-CP')
    && sangHet.includes('204/2025/QH15')
    && sangHet.includes('43/2026/NQ-CP')
    && sangHet.includes('72/2026/NĐ-CP'),
    JSON.stringify(sangHet));

  t('dry-run 2027-01-01: nhận diện đúng 3 VB CHUA_CO_HIEU_LUC → CON_HIEU_LUC và không chạm nhóm 2027-03-01',
    sangCon.length === 3
    && sangCon.includes('154/2026/TT-BTC')
    && sangCon.includes('372/2026/NĐ-CP')
    && sangCon.includes('63/2026/TT-BKHCN')
    && !sangCon.includes('417/2026/NĐ-CP')
    && !sangCon.includes('11/2026/QH16'),
    JSON.stringify(sangCon));

  t('dry-run 2027-01-01: bảo vệ 2 VB HET_HIEU_LUC_MOT_PHAN vào can_soat_tay & cảnh báo trang wiki cần rà',
    soatTay.length === 2
    && soatTay.includes('08/2023/TT-BCT')
    && soatTay.includes('12/2018/TT-BCT')
    && kq2027.da_ghi.length === 0
    && kq2027.wiki_can_ra_soat.some((w) => w.file === 'wiki/summary/van-ban-sap-het-hieu-luc-2026-2027.md'),
    JSON.stringify({ soatTay, wikiCount: kq2027.wiki_can_ra_soat.length }));

  // Kiểm thêm mốc 2027-03-01 phủ 417/2026/NĐ-CP & 11/2026/QH16
  const kqThang3 = phanTichChuyenHieuLuc({ root: ROOT, ngay: '2027-03-01' });
  const sangConThang3 = kqThang3.chuyen_trang_thai
    .filter((x) => x.trang_thai_moi === 'CON_HIEU_LUC')
    .map((x) => x.so_hieu);
  t('dry-run 2027-03-01: chuyển thêm 417/2026/NĐ-CP và 11/2026/QH16 sang CON_HIEU_LUC',
    sangConThang3.includes('417/2026/NĐ-CP') && sangConThang3.includes('11/2026/QH16'),
    JSON.stringify(sangConThang3));

  // 2. Test --ghi trong thư mục cô lập tmpdir() + kiểm chứng bằng tools/kiem-tra.mjs với today = 2027-01-01
  const tmpRepo = makeTmp('oz-chuyen-hl-');
  cpSync(join(ROOT, 'registry'), join(tmpRepo, 'registry'), { recursive: true });
  mkdirSync(join(tmpRepo, 'danh-muc'), { recursive: true });

  const applied = apDungChuyenHieuLuc({ root: tmpRepo, ngay: '2027-01-01', ghi: true });
  const tt174 = yaml.load(readFileSync(join(tmpRepo, 'registry/van-ban/174-2025-nd-cp.yaml'), 'utf8'), { schema: yaml.CORE_SCHEMA });
  const tt154 = yaml.load(readFileSync(join(tmpRepo, 'registry/van-ban/154-2026-tt-btc.yaml'), 'utf8'), { schema: yaml.CORE_SCHEMA });
  const tt08 = yaml.load(readFileSync(join(tmpRepo, 'registry/van-ban/08-2023-tt-bct.yaml'), 'utf8'), { schema: yaml.CORE_SCHEMA });
  const tt12 = yaml.load(readFileSync(join(tmpRepo, 'registry/van-ban/12-2018-tt-bct.yaml'), 'utf8'), { schema: yaml.CORE_SCHEMA });

  const ktSauChuyen = kiemTra(napSo(tmpRepo), {
    today: '2027-01-01',
    root: ROOT,
    kiemChinhSachMoTa: false,
    kiemAnhXaAhtn: false,
  });
  const lapLai = phanTichChuyenHieuLuc({ root: tmpRepo, ngay: '2027-01-01' });

  t('--ghi trên tmpdir(): cập nhật đúng 9 YAML, giữ nguyên HET_HIEU_LUC_MOT_PHAN, kiemTra(2027-01-01) đạt 0 lỗi 0 cảnh báo & idempotent',
    applied.ghi === true
    && applied.da_ghi.length === 9
    && tt174.tinh_trang === 'HET_HIEU_LUC'
    && tt154.tinh_trang === 'CON_HIEU_LUC'
    && tt08.tinh_trang === 'HET_HIEU_LUC_MOT_PHAN'
    && tt12.tinh_trang === 'HET_HIEU_LUC_MOT_PHAN'
    && ktSauChuyen.loi.length === 0
    && ktSauChuyen.canhBao.length === 0
    && lapLai.chuyen_trang_thai.length === 0,
    JSON.stringify({
      daGhi: applied.da_ghi.length,
      loi: ktSauChuyen.loi,
      canhBao: ktSauChuyen.canhBao,
      lapLai: lapLai.chuyen_trang_thai.length,
    }));

  // 3. Test thêm edge case CHUA_CO_HIEU_LUC vừa chạm hieu_luc_tu vừa chạm het_hieu_luc_tu -> thẳng HET_HIEU_LUC
  const tmpEdge = makeTmp('oz-chuyen-hl-edge-');
  cpSync(join(ROOT, 'registry/cay-xnk.yaml'), join(tmpEdge, 'registry/cay-xnk.yaml'));
  cpSync(join(ROOT, 'registry/co-quan.yaml'), join(tmpEdge, 'registry/co-quan.yaml'));
  cpSync(join(ROOT, 'registry/nguon-uy-tin.yaml'), join(tmpEdge, 'registry/nguon-uy-tin.yaml'));
  mkdirSync(join(tmpEdge, 'registry/van-ban'), { recursive: true });
  writeFileSync(join(tmpEdge, 'registry/van-ban/999-2026-nd-cp.yaml'), [
    'so_hieu: 999/2026/NĐ-CP',
    'loai: NGHI_DINH',
    'ten: Văn bản thử nghiệm hết hạn đồng thời',
    'co_quan: CP',
    "ngay_ban_hanh: '2026-11-01'",
    "hieu_luc_tu: '2026-12-01'",
    "het_hieu_luc_tu: '2026-12-31'",
    'tinh_trang: CHUA_CO_HIEU_LUC',
    'nhanh:',
    '  - hai-quan/thu-tuc',
  ].join('\n'));
  const edgeRes = phanTichChuyenHieuLuc({ root: tmpEdge, ngay: '2027-01-01' });
  t('edge case: CHUA_CO_HIEU_LUC có cả hieu_luc_tu & het_hieu_luc_tu <= ngay chuyển thẳng HET_HIEU_LUC',
    edgeRes.chuyen_trang_thai.length === 1 && edgeRes.chuyen_trang_thai[0].trang_thai_moi === 'HET_HIEU_LUC');

  // 4. Test CLI --help, --json và ngày sai định dạng
  const cliHelp = execFileSync(process.execPath, [join(ROOT, 'tools/chuyen-hieu-luc.mjs'), '--help'], { encoding: 'utf8' });
  const cliJson = JSON.parse(execFileSync(process.execPath, [join(ROOT, 'tools/chuyen-hieu-luc.mjs'), '--ngay', '2027-01-01', '--json'], { encoding: 'utf8' }));
  const cliBadDate = spawnSync(process.execPath, [join(ROOT, 'tools/chuyen-hieu-luc.mjs'), '--ngay', '2027-13-45'], { encoding: 'utf8' });

  t('CLI: --help (exit 0), --json xuất cấu trúc hợp lệ & chặn ngày không hợp lệ (exit != 0)',
    cliHelp.includes('--ngay YYYY-MM-DD')
    && cliJson.ghi === false
    && cliJson.thong_ke?.tong_tu_dong === 9
    && cliBadDate.status !== 0
    && cliBadDate.stderr.includes('LỖI'),
    JSON.stringify({ status: cliBadDate.status, tongTuDong: cliJson.thong_ke?.tong_tu_dong }));
} finally {
  for (const d of tmpDirs) {
    try {
      rmSync(d, { recursive: true, force: true });
    } catch { /* ignore */ }
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
