// Kiểm thử Wave 32: phien_ban_ahtn trong kiem-tra, danh-muc, diem-mu và 43/43 YAML danh_muc_hs thật.
import { mkdtempSync, mkdirSync, writeFileSync, cpSync, rmSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { napSo, ROOT } from '../lib/registry.mjs';
import { kiemTra, PHIEN_BAN_AHTN } from '../kiem-tra.mjs';
import { dungChiMuc, dungChiMucTheoMa } from '../lib/danh-muc.mjs';
import { timDiemMu } from '../diem-mu.mjs';

let pass = 0;
let fail = 0;
const t = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`PASS ${name}`); }
  else { fail += 1; console.log(`FAIL ${name} ${extra}`); }
};

function soGia(vanBan, { danhMuc = {}, extra = {} } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'kb-ahtn-'));
  mkdirSync(join(root, 'registry', 'van-ban'), { recursive: true });
  for (const f of ['cay-xnk.yaml', 'co-quan.yaml', 'nguon-uy-tin.yaml']) {
    cpSync(join(ROOT, 'registry', f), join(root, 'registry', f));
  }
  for (const [file, body] of Object.entries(vanBan)) {
    writeFileSync(join(root, 'registry', 'van-ban', file), body);
  }
  for (const [file, body] of Object.entries(danhMuc)) {
    mkdirSync(join(root, 'danh-muc'), { recursive: true });
    writeFileSync(join(root, 'danh-muc', file), body);
  }
  for (const [relPath, body] of Object.entries(extra)) {
    const fp = join(root, relPath);
    mkdirSync(join(fp, '..'), { recursive: true });
    writeFileSync(fp, body);
  }
  return root;
}

const HEAD_DM = 'ma_hs,mo_ta,nhom,phu_luc,loai_tac_dong,muc_rui_ro,dieu_kien,dan_chieu,trang\n';
const CSV_OK = HEAD_DM + '22030091,Bia từ lúa mạch,1,PL1,KIEM_TRA_ATTP,,,,1\n';
const CSV_DRIFT = HEAD_DM + '22030091,Bia từ lúa mạch,1,PL1,KIEM_TRA_ATTP,,,,1\n99998888,Mã mới HS 2028 chưa có trong biểu thuế,2,PL1,KIEM_TRA_ATTP,,,,2\n';
const XM_A = 'nguon: [{url: "https://congbao.chinhphu.vn/x", truy_cap: "2026-10-01"}]\nxac_minh: {muc: NGUON_A, hieu_luc_da_doi_chieu: true, ngay: "2026-10-01"}';

// 1. kiemTra: chấp nhận AHTN_2017, AHTN_2022, AHTN_2028 và chặn giá trị sai (vd AHTN_9999, số nguyên)
const rVal = soGia({
  '10-2021-tt-bct.yaml': `so_hieu: 10/2021/TT-BCT\nloai: THONG_TU\nten: Danh mục mẫu 2017\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\ndanh_muc_hs: {tep: danh-muc/a17.csv, phien_ban_ahtn: AHTN_2017, nguon: "https://congbao.chinhphu.vn/a17", ngay: "2026-10-04"}\n${XM_A}\n`,
  '20-2024-tt-bct.yaml': `so_hieu: 20/2024/TT-BCT\nloai: THONG_TU\nten: Danh mục mẫu 2022\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\ndanh_muc_hs: {tep: danh-muc/a22.csv, phien_ban_ahtn: AHTN_2022, nguon: "https://congbao.chinhphu.vn/a22", ngay: "2026-10-04"}\n${XM_A}\n`,
  '30-2028-tt-bct.yaml': `so_hieu: 30/2028/TT-BCT\nloai: THONG_TU\nten: Danh mục mẫu 2028\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\ndanh_muc_hs: {tep: danh-muc/a28.csv, phien_ban_ahtn: AHTN_2028, nguon: "https://congbao.chinhphu.vn/a28", ngay: "2028-01-01"}\n${XM_A}\n`,
  '40-2026-tt-bct.yaml': `so_hieu: 40/2026/TT-BCT\nloai: THONG_TU\nten: Danh mục sai phiên bản AHTN\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\ndanh_muc_hs: {tep: danh-muc/a99.csv, phien_ban_ahtn: AHTN_9999, nguon: "https://congbao.chinhphu.vn/a99", ngay: "2026-10-04"}\n${XM_A}\n`,
}, {
  danhMuc: { 'a17.csv': CSV_OK, 'a22.csv': CSV_OK, 'a28.csv': CSV_OK, 'a99.csv': CSV_OK },
});

try {
  const kq = kiemTra(napSo(rVal), { today: '2026-11-26', root: rVal });
  const loiPb = kq.loi.filter((e) => /phien_ban_ahtn/.test(e.msg));
  t('kiemTra: chấp nhận AHTN_2017, AHTN_2022, AHTN_2028 và chặn AHTN_9999',
    PHIEN_BAN_AHTN.has('AHTN_2017') && PHIEN_BAN_AHTN.has('AHTN_2022') && PHIEN_BAN_AHTN.has('AHTN_2028')
    && loiPb.length === 1
    && loiPb[0].file === 'registry/van-ban/40-2026-tt-bct.yaml'
    && loiPb[0].msg.includes('AHTN_9999'),
    JSON.stringify(kq.loi));
} finally {
  rmSync(rVal, { recursive: true, force: true });
}

// 2. dungChiMuc + dungChiMucTheoMa: truyền phien_ban_ahtn vào bang và canh (vẫn gộp cạnh trùng kể cả khi thiếu bang)
const rIdx = soGia({
  '10-2021-tt-bct.yaml': `so_hieu: 10/2021/TT-BCT\nloai: THONG_TU\nten: Danh mục 2017\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\ndanh_muc_hs: {tep: danh-muc/a17.csv, phien_ban_ahtn: AHTN_2017, nguon: "https://congbao.chinhphu.vn/a17", ngay: "2026-10-04"}\n${XM_A}\n`,
  '20-2024-tt-bct.yaml': `so_hieu: 20/2024/TT-BCT\nloai: THONG_TU\nten: Danh mục thiếu phiên bản\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\ndanh_muc_hs: {tep: danh-muc/no-ver.csv, nguon: "https://congbao.chinhphu.vn/nv", ngay: "2026-10-04"}\n${XM_A}\n`,
}, {
  danhMuc: { 'a17.csv': CSV_OK, 'no-ver.csv': CSV_DRIFT },
  extra: {
    'nhu-cau/bieu-thue.json': JSON.stringify({
      nguon: 'test',
      phien_ban: '2026-11-22',
      tong: 1,
      ma: { '22030091': 'Bia' },
    }),
  },
});

try {
  const soIdx = napSo(rIdx);
  const cm = dungChiMuc(soIdx, rIdx, '2026-11-26');
  const vb17 = cm.van_ban.find((v) => v.so_hieu === '10/2021/TT-BCT');
  const vbNoVer = cm.van_ban.find((v) => v.so_hieu === '20/2024/TT-BCT');
  const cmMa = dungChiMucTheoMa(cm);
  const canh17 = cmMa.ma['22030091'].find((c) => c.so_hieu === '10/2021/TT-BCT');
  const canhNoVer = cmMa.ma['22030091'].find((c) => c.so_hieu === '20/2024/TT-BCT');

  t('dungChiMuc + dungChiMucTheoMa: gắn đúng phien_ban_ahtn (và null khi thiếu)',
    vb17?.bang?.phien_ban_ahtn === 'AHTN_2017'
    && vbNoVer?.bang?.phien_ban_ahtn === null
    && canh17?.phien_ban_ahtn === 'AHTN_2017'
    && canhNoVer?.phien_ban_ahtn === null,
    JSON.stringify({ vb17: vb17?.bang, vbNoVer: vbNoVer?.bang, canh17, canhNoVer }));

  // 3. timDiemMu: phát DANH_MUC_THIEU_PHIEN_BAN_AHTN khi thiếu, không phát khi có; HS_KHONG_TON_TAI kèm ngữ cảnh phien_ban_ahtn
  const dm = timDiemMu(soIdx, { today: '2026-11-26', root: rIdx, nhuCau: null, hangThat: null, vanBanBieuThue: null });
  const thieuPb = dm.filter((d) => d.ma === 'DANH_MUC_THIEU_PHIEN_BAN_AHTN');
  t('timDiemMu: phát DANH_MUC_THIEU_PHIEN_BAN_AHTN (Thấp, danh-muc-hs) khi thiếu và 0 khi đã gắn',
    thieuPb.length === 1
    && thieuPb[0].muc === 'Thấp'
    && thieuPb[0].luong === 'danh-muc-hs'
    && thieuPb[0].muc_tieu === '20/2024/TT-BCT'
    && !thieuPb.some((d) => d.muc_tieu === '10/2021/TT-BCT'),
    JSON.stringify(thieuPb));

  const rDrift = soGia({
    '21-2024-tt-bct.yaml': `so_hieu: 21/2024/TT-BCT\nloai: THONG_TU\nten: Danh mục 2022 trôi HS 2028\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\ndanh_muc_hs: {tep: danh-muc/drift.csv, phien_ban_ahtn: AHTN_2022, nguon: "https://congbao.chinhphu.vn/d", ngay: "2026-10-04"}\n${XM_A}\n`,
  }, {
    danhMuc: { 'drift.csv': CSV_DRIFT },
    extra: {
      'nhu-cau/bieu-thue.json': JSON.stringify({
        nguon: 'test',
        phien_ban: 'HS_2028_TEST',
        tong: 1,
        ma: { '22030091': 'Bia' },
      }),
    },
  });
  try {
    const dmDrift = timDiemMu(napSo(rDrift), { today: '2026-11-26', root: rDrift, nhuCau: null, hangThat: null, vanBanBieuThue: null });
    const ktt = dmDrift.filter((d) => d.ma === 'HS_KHONG_TON_TAI');
    t('timDiemMu: HS_KHONG_TON_TAI nêu rõ phien_ban_ahtn và phiên bản biểu thuế khi lệch',
      ktt.length === 1
      && ktt[0].tieuDe.includes('AHTN_2022')
      && ktt[0].tieuDe.includes('HS_2028_TEST')
      && ktt[0].viec.includes('AHTN_2022'),
      JSON.stringify(ktt));
  } finally {
    rmSync(rDrift, { recursive: true, force: true });
  }
} finally {
  rmSync(rIdx, { recursive: true, force: true });
}

// 4. Kho thật: 43/43 tệp có danh_muc_hs trong registry/van-ban/*.yaml đều khai báo phien_ban_ahtn hợp lệ, 0 điểm mù DANH_MUC_THIEU_PHIEN_BAN_AHTN
const vbFiles = readdirSync(join(ROOT, 'registry', 'van-ban')).filter((f) => f.endsWith('.yaml')).sort();
const dmDocs = [];
for (const f of vbFiles) {
  const obj = yaml.load(readFileSync(join(ROOT, 'registry', 'van-ban', f), 'utf8'), { schema: yaml.CORE_SCHEMA });
  if (obj?.danh_muc_hs) dmDocs.push({ f, pb: obj.danh_muc_hs.phien_ban_ahtn });
}
const dmReal = timDiemMu(napSo(ROOT), { root: ROOT });
const thieuReal = dmReal.filter((d) => d.ma === 'DANH_MUC_THIEU_PHIEN_BAN_AHTN');

t('kho thật: 43/43 tệp danh_muc_hs khai báo phien_ban_ahtn hợp lệ và 0 điểm mù DANH_MUC_THIEU_PHIEN_BAN_AHTN',
  dmDocs.length === 43
  && dmDocs.every((x) => typeof x.pb === 'string' && PHIEN_BAN_AHTN.has(x.pb))
  && thieuReal.length === 0,
  JSON.stringify({ tong: dmDocs.length, sai: dmDocs.filter((x) => !PHIEN_BAN_AHTN.has(x.pb)), thieuReal }));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
