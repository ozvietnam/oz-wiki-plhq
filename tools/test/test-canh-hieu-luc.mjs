// Unit & CLI tests cho công cụ canh hiệu lực hằng ngày (tools/canh-hieu-luc.mjs).
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT } from '../lib/registry.mjs';
import { baoCaoCanhHieuLuc, dinhDangMarkdownCanhHieuLuc } from '../canh-hieu-luc.mjs';

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
  // 1. Mốc 2026-11-26: chưa đến ngày cắt chuyển, nhóm 2026-12-31 / 2027-01-01 rơi vào cảnh báo sớm (35–36 ngày)
  const kqNov26 = baoCaoCanhHieuLuc({ root: ROOT, ngay: '2026-11-26' });
  const hetSomNov26 = kqNov26.sap_het_hieu_luc_som.map((x) => x.so_hieu);
  const coSomNov26 = kqNov26.sap_co_hieu_luc_som.map((x) => x.so_hieu);

  t('2026-11-26: can_mo_pr === false và nhóm khẩn (<=30d) chưa kích hoạt cho lô cuối năm',
    kqNov26.can_mo_pr === false
    && kqNov26.cat_chuyen.chuyen_trang_thai.length === 0
    && kqNov26.cat_chuyen.can_soat_tay.length === 0
    && kqNov26.sap_het_hieu_luc_khan.length === 0
    && kqNov26.sap_co_hieu_luc_khan.length === 0,
    JSON.stringify(kqNov26.thong_ke));

  t('2026-11-26: sap_het_hieu_luc_som & sap_co_hieu_luc_som bắt được lô 2026-12-31 / 2027-01-01 (35-36 ngày)',
    hetSomNov26.includes('174/2025/NĐ-CP')
    && hetSomNov26.includes('08/2023/TT-BCT')
    && hetSomNov26.includes('12/2018/TT-BCT')
    && coSomNov26.includes('154/2026/TT-BTC')
    && coSomNov26.includes('372/2026/NĐ-CP')
    && kqNov26.sap_het_hieu_luc_som.every((x) => x.con_lai_ngay > 30 && x.con_lai_ngay <= 60)
    && kqNov26.sap_co_hieu_luc_som.every((x) => x.con_lai_ngay > 30 && x.con_lai_ngay <= 60)
    && kqNov26.sap_het_hieu_luc_som.find((x) => x.so_hieu === '174/2025/NĐ-CP')?.con_lai_ngay === 35
    && kqNov26.sap_co_hieu_luc_som.find((x) => x.so_hieu === '154/2026/TT-BTC')?.con_lai_ngay === 36,
    JSON.stringify({ hetSomNov26, coSomNov26 }));

  // 2. Mốc 2026-12-05: các VB mốc 2026-12-31 (26 ngày) và 2027-01-01 (27 ngày) lọt vào nhóm khẩn <=30d
  const kqDec05 = baoCaoCanhHieuLuc({ root: ROOT, ngay: '2026-12-05' });
  const hetKhanDec05 = kqDec05.sap_het_hieu_luc_khan.map((x) => x.so_hieu);
  const coKhanDec05 = kqDec05.sap_co_hieu_luc_khan.map((x) => x.so_hieu);

  t('2026-12-05: sap_het_hieu_luc_khan & sap_co_hieu_luc_khan khác rỗng và bật can_canh_bao_issue === true',
    kqDec05.can_mo_pr === false
    && kqDec05.can_canh_bao_issue === true
    && hetKhanDec05.length > 0
    && coKhanDec05.length > 0
    && hetKhanDec05.includes('174/2025/NĐ-CP')
    && hetKhanDec05.includes('08/2023/TT-BCT')
    && coKhanDec05.includes('154/2026/TT-BTC')
    && kqDec05.sap_het_hieu_luc_khan.every((x) => x.con_lai_ngay > 0 && x.con_lai_ngay <= 30)
    && kqDec05.sap_co_hieu_luc_khan.every((x) => x.con_lai_ngay > 0 && x.con_lai_ngay <= 30),
    JSON.stringify({ hetKhanDec05, coKhanDec05, flag: kqDec05.can_canh_bao_issue }));

  // 3. Mốc 2027-01-01: ngày cắt chuyển G
  const kqJan01 = baoCaoCanhHieuLuc({ root: ROOT, ngay: '2027-01-01' });
  t('2027-01-01: can_mo_pr === true, 10 chuyển trạng thái, 2 soát tay, >= 4 wiki cần rà',
    kqJan01.can_mo_pr === true
    && kqJan01.can_canh_bao_issue === true
    && kqJan01.cat_chuyen.chuyen_trang_thai.length === 10
    && kqJan01.cat_chuyen.can_soat_tay.length === 2
    && kqJan01.cat_chuyen.wiki_can_ra_soat.length >= 4,
    JSON.stringify(kqJan01.thong_ke));

  // 4. Kiểm tra loại trừ TB-TCHQ/TB-CHQ, đầy đủ trường mỗi mục, và kết xuất Markdown
  const tmpIso = makeTmp('oz-canh-hl-iso-');
  cpSync(join(ROOT, 'registry/cay-xnk.yaml'), join(tmpIso, 'registry/cay-xnk.yaml'));
  cpSync(join(ROOT, 'registry/co-quan.yaml'), join(tmpIso, 'registry/co-quan.yaml'));
  cpSync(join(ROOT, 'registry/nguon-uy-tin.yaml'), join(tmpIso, 'registry/nguon-uy-tin.yaml'));
  mkdirSync(join(tmpIso, 'registry/van-ban'), { recursive: true });
  writeFileSync(join(tmpIso, 'registry/van-ban/9999-tb-tchq.yaml'), [
    'so_hieu: 9999/TB-TCHQ',
    'loai: THONG_BAO',
    'ten: Thông báo cá biệt thử nghiệm',
    'co_quan: TCHQ',
    "ngay_ban_hanh: '2025-01-01'",
    "hieu_luc_tu: '2025-01-01'",
    "het_hieu_luc_tu: '2026-12-15'",
    'tinh_trang: CON_HIEU_LUC',
    'nhanh:',
    '  - hai-quan/thu-tuc',
  ].join('\n'));
  writeFileSync(join(tmpIso, 'registry/van-ban/888-2026-nd-cp.yaml'), [
    'so_hieu: 888/2026/NĐ-CP',
    'loai: NGHI_DINH',
    'ten: Nghị định thử nghiệm sắp hết hạn',
    'co_quan: CP',
    "ngay_ban_hanh: '2026-01-01'",
    "hieu_luc_tu: '2026-02-01'",
    "het_hieu_luc_tu: '2026-12-15'",
    'tinh_trang: CON_HIEU_LUC',
    'nhanh:',
    '  - hai-quan/thu-tuc',
  ].join('\n'));

  const isoRes = baoCaoCanhHieuLuc({ root: tmpIso, ngay: '2026-12-01' });
  const itemIso = isoRes.sap_het_hieu_luc_khan[0];
  const mdIso = dinhDangMarkdownCanhHieuLuc(isoRes);

  t('loại trừ TB-TCHQ khỏi danh sách sắp hết/có hiệu lực, giữ đủ trường & xuất markdown hợp lệ',
    isoRes.sap_het_hieu_luc_khan.length === 1
    && itemIso.so_hieu === '888/2026/NĐ-CP'
    && itemIso.slug === '888-2026-nd-cp'
    && itemIso.file === 'registry/van-ban/888-2026-nd-cp.yaml'
    && itemIso.tinh_trang === 'CON_HIEU_LUC'
    && itemIso.ngay_moc === '2026-12-15'
    && itemIso.con_lai_ngay === 14
    && Array.isArray(itemIso.nhanh)
    && itemIso.nhanh.includes('hai-quan/thu-tuc')
    && mdIso.includes('# Báo cáo canh hiệu lực — 2026-12-01')
    && mdIso.includes('888/2026/NĐ-CP')
    && !mdIso.includes('9999/TB-TCHQ'),
    JSON.stringify(isoRes.sap_het_hieu_luc_khan));

  // 5. CLI --json, --markdown <tmp>, --help và ngày sai định dạng
  const tmpOutDir = makeTmp('oz-canh-hl-cli-');
  const mdOutPath = join(tmpOutDir, 'bao-cao-canh.md');
  const cliScript = join(ROOT, 'tools/canh-hieu-luc.mjs');

  const cliHelp = execFileSync(process.execPath, [cliScript, '--help'], { encoding: 'utf8' });
  const cliJson = JSON.parse(execFileSync(process.execPath, [cliScript, '--ngay', '2027-01-01', '--json'], { encoding: 'utf8' }));
  execFileSync(process.execPath, [cliScript, '--ngay', '2026-12-05', '--markdown', mdOutPath], { encoding: 'utf8' });
  const mdFileContent = existsSync(mdOutPath) ? readFileSync(mdOutPath, 'utf8') : '';
  const cliBadDate = spawnSync(process.execPath, [cliScript, '--ngay', '2026-02-30'], { encoding: 'utf8' });

  t('CLI: --help, --json, --markdown <tmp> và chặn ngày không hợp lệ',
    cliHelp.includes('--markdown <file>')
    && cliJson.ngay === '2027-01-01'
    && cliJson.can_mo_pr === true
    && cliJson.cat_chuyen?.chuyen_trang_thai?.length === 10
    && mdFileContent.includes('# Báo cáo canh hiệu lực — 2026-12-05')
    && mdFileContent.includes('174/2025/NĐ-CP')
    && cliBadDate.status !== 0
    && cliBadDate.stderr.includes('LỖI'),
    JSON.stringify({ badStatus: cliBadDate.status, mdLen: mdFileContent.length }));
} finally {
  for (const d of tmpDirs) {
    try {
      rmSync(d, { recursive: true, force: true });
    } catch { /* ignore */ }
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
