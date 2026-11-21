// Test 3 cổng kiểm quan_he chiều đi & vai trò trong tools/kiem-tra.mjs + kiểm sổ thật 0 lỗi.
import { mkdtempSync, mkdirSync, writeFileSync, cpSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { napSo, khoa, dungDoThi, ROOT } from '../lib/registry.mjs';
import { kiemTra } from '../kiem-tra.mjs';

let pass = 0;
let fail = 0;
const t = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`PASS ${name}`); }
  else { fail += 1; console.log(`FAIL ${name} ${extra}`); }
};

const XM = 'xac_minh: {muc: CHUA_XAC_MINH, hieu_luc_da_doi_chieu: false, ngay: "2026-10-01"}';
const tmpDirs = [];

function soGia(vanBan) {
  const root = mkdtempSync(join(tmpdir(), 'kb-qh-'));
  tmpDirs.push(root);
  mkdirSync(join(root, 'registry', 'van-ban'), { recursive: true });
  for (const f of ['cay-xnk.yaml', 'co-quan.yaml', 'nguon-uy-tin.yaml']) {
    cpSync(join(ROOT, 'registry', f), join(root, 'registry', f));
  }
  for (const [file, body] of Object.entries(vanBan)) {
    writeFileSync(join(root, 'registry', 'van-ban', file), body);
  }
  return root;
}

try {
  // 1. Cổng (a): Cạnh ngược chiều thời gian trên cả 6 loại quan_he (thay_the, sua_doi, bai_bo, tam_ngung, huong_dan, hop_nhat)
  const rTime = soGia({
    'target-new.yaml': `so_hieu: 90/2026/TT-BTC\nso_hieu_khac: [90/2026/TT-BCT]\nloai: THONG_TU\nten: Văn bản mới 2026\nco_quan: BTC\nngay_ban_hanh: "2026-06-01"\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/thu-tuc]\n${XM}\n`,
    'target-luat-new.yaml': `so_hieu: 91/2025/QH15\nloai: LUAT\nten: Luật mới 2025\nco_quan: QH\nngay_ban_hanh: "2025-06-18"\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/luat-khung]\n${XM}\n`,
    'old-thay.yaml': `so_hieu: 10/2018/TT-BTC\nloai: THONG_TU\nten: Cũ thay_the ngược\nco_quan: BTC\nngay_ban_hanh: "2018-01-01"\ntinh_trang: HET_HIEU_LUC\nnhanh: [hai-quan/thu-tuc]\nquan_he: {thay_the: [90/2026/TT-BTC]}\n${XM}\n`,
    'old-sua.yaml': `so_hieu: 11/2018/TT-BTC\nloai: THONG_TU\nten: Cũ sua_doi ngược qua so_hieu_khac\nco_quan: BTC\nngay_ban_hanh: "2018-02-01"\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/thu-tuc]\nquan_he: {sua_doi: [{so_hieu: 90/2026/TT-BCT, can_cu: test}]}\n${XM}\n`,
    'old-bai.yaml': `so_hieu: 12/2018/TT-BTC\nloai: THONG_TU\nten: Cũ bai_bo ngược\nco_quan: BTC\nngay_ban_hanh: "2018-03-01"\ntinh_trang: HET_HIEU_LUC\nnhanh: [hai-quan/thu-tuc]\nquan_he: {bai_bo: [90/2026/TT-BTC]}\n${XM}\n`,
    'old-tam.yaml': `so_hieu: 13/2024/TT-BTC\nloai: THONG_TU\nten: Cũ tam_ngung ngược\nco_quan: BTC\nngay_ban_hanh: "2024-04-01"\ntinh_trang: TAM_NGUNG_HIEU_LUC\nnhanh: [hai-quan/thu-tuc]\nquan_he: {tam_ngung: [90/2026/TT-BTC]}\n${XM}\n`,
    'old-hd.yaml': `so_hieu: 14/2018/NĐ-CP\nloai: NGHI_DINH\nten: Cũ huong_dan ngược\nco_quan: CP\nngay_ban_hanh: "2018-05-01"\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/luat-khung]\nquan_he: {huong_dan: [91/2025/QH15]}\n${XM}\n`,
    'old-hn.yaml': `so_hieu: 15-VBHN/BTC\nloai: VAN_BAN_HOP_NHAT\nten: VBHN cũ hop_nhat văn bản mới hơn\nco_quan: BTC\nngay_ban_hanh: "2020-01-01"\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/thu-tuc]\nquan_he: {hop_nhat: [90/2026/TT-BTC]}\n${XM}\n`,
  });
  const kTime = kiemTra(napSo(rTime), { today: '2026-11-21', root: rTime });
  const coLoiTime = (file, qh) => kTime.loi.some((e) => e.file.endsWith(file) && new RegExp(`quan_he\\.${qh} đi ngược chiều thời gian`).test(e.msg));
  t('cổng (a): bắt đủ 6 loại quan_he đi ngược chiều thời gian',
    coLoiTime('old-thay.yaml', 'thay_the')
    && coLoiTime('old-sua.yaml', 'sua_doi')
    && coLoiTime('old-bai.yaml', 'bai_bo')
    && coLoiTime('old-tam.yaml', 'tam_ngung')
    && coLoiTime('old-hd.yaml', 'huong_dan')
    && coLoiTime('old-hn.yaml', 'hop_nhat')
    && kTime.loi.length === 6,
    JSON.stringify(kTime.loi));

  // 2. Cổng (b): quan_he.huong_dan xuất phát từ HIEN_PHAP, LUAT, NGHI_QUYET
  const rRoleHd = soGia({
    'nd-cu.yaml': `so_hieu: 10/2015/NĐ-CP\nloai: NGHI_DINH\nten: NĐ cũ\nco_quan: CP\nngay_ban_hanh: "2015-01-01"\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/luat-khung]\n${XM}\n`,
    'hp.yaml': `so_hieu: 01/2013/HP\nloai: HIEN_PHAP\nten: Hiến pháp thử\nco_quan: QH\nngay_ban_hanh: "2016-01-01"\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/luat-khung]\nquan_he: {huong_dan: [10/2015/NĐ-CP]}\n${XM}\n`,
    'luat.yaml': `so_hieu: 20/2020/QH14\nloai: LUAT\nten: Luật thử hướng dẫn NĐ\nco_quan: QH\nngay_ban_hanh: "2020-06-01"\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/luat-khung]\nquan_he: {huong_dan: [10/2015/NĐ-CP]}\n${XM}\n`,
    'nq.yaml': `so_hieu: 30/2026/QH15\nloai: NGHI_QUYET\nten: Nghị quyết thử hướng dẫn NĐ\nco_quan: QH\nngay_ban_hanh: "2026-01-01"\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/luat-khung]\nquan_he: {huong_dan: [999/2020/NĐ-CP]}\n${XM}\n`,
    'luat-rong.yaml': `so_hieu: 21/2020/QH14\nloai: LUAT\nten: Luật có huong_dan rỗng\nco_quan: QH\nngay_ban_hanh: "2020-06-01"\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/luat-khung]\nquan_he: {huong_dan: []}\n${XM}\n`,
  });
  const kRoleHd = kiemTra(napSo(rRoleHd), { today: '2026-11-21', root: rRoleHd });
  const coLoiHd = (file, loai) => kRoleHd.loi.some((e) => e.file.endsWith(file) && new RegExp(`quan_he\\.huong_dan.*${loai}`).test(e.msg));
  t('cổng (b): chặn quan_he.huong_dan từ HIEN_PHAP, LUAT, NGHI_QUYET và bỏ qua mảng rỗng',
    coLoiHd('hp.yaml', 'HIEN_PHAP')
    && coLoiHd('luat.yaml', 'LUAT')
    && coLoiHd('nq.yaml', 'NGHI_QUYET')
    && !kRoleHd.loi.some((e) => e.file.endsWith('luat-rong.yaml'))
    && kRoleHd.loi.length === 3,
    JSON.stringify(kRoleHd.loi));

  // 3. Cổng (c): quan_he.hop_nhat xuất phát từ văn bản không phải VAN_BAN_HOP_NHAT
  const rRoleHn = soGia({
    'luat-goc.yaml': `so_hieu: 105/2016/QH13\nloai: LUAT\nten: Luật gốc\nco_quan: QH\nngay_ban_hanh: "2016-04-06"\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/luat-khung]\nquan_he: {hop_nhat: []}\n${XM}\n`,
    'luat-hn.yaml': `so_hieu: 106/2026/QH15\nloai: LUAT\nten: Luật ghi nhầm hop_nhat\nco_quan: QH\nngay_ban_hanh: "2026-04-06"\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/luat-khung]\nquan_he: {hop_nhat: [105/2016/QH13]}\n${XM}\n`,
    'nd-hn.yaml': `so_hieu: 54/2026/NĐ-CP\nloai: NGHI_DINH\nten: NĐ ghi nhầm hop_nhat\nco_quan: CP\nngay_ban_hanh: "2026-05-01"\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/luat-khung]\nquan_he: {hop_nhat: [105/2016/QH13]}\n${XM}\n`,
    'tt-hn.yaml': `so_hieu: 12/2026/TT-BTC\nloai: THONG_TU\nten: TT ghi nhầm hop_nhat\nco_quan: BTC\nngay_ban_hanh: "2026-05-01"\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/thu-tuc]\nquan_he: {hop_nhat: [105/2016/QH13]}\n${XM}\n`,
  });
  const kRoleHn = kiemTra(napSo(rRoleHn), { today: '2026-11-21', root: rRoleHn });
  const coLoiHn = (file) => kRoleHn.loi.some((e) => e.file.endsWith(file) && /quan_he\.hop_nhat chỉ hợp lệ cho VAN_BAN_HOP_NHAT/.test(e.msg));
  t('cổng (c): chặn quan_he.hop_nhat từ LUAT, NGHI_DINH, THONG_TU và bỏ qua mảng rỗng',
    coLoiHn('luat-hn.yaml')
    && coLoiHn('nd-hn.yaml')
    && coLoiHn('tt-hn.yaml')
    && !kRoleHn.loi.some((e) => e.file.endsWith('luat-goc.yaml'))
    && kRoleHn.loi.length === 3,
    JSON.stringify(kRoleHn.loi));

  // 4. Các trường hợp hợp lệ + tương thích thiếu ngay_ban_hanh
  const rOk = soGia({
    'luat.yaml': `so_hieu: 105/2016/QH13\nloai: LUAT\nten: Luật Dược\nco_quan: QH\nngay_ban_hanh: "2016-04-06"\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/byt]\nquan_he: {huong_dan: [], hop_nhat: []}\n${XM}\n`,
    'vbhn.yaml': `so_hieu: 76-VBHN/VPQH\nloai: VAN_BAN_HOP_NHAT\nten: Hợp nhất Luật Dược\nco_quan: VPQH\nngay_ban_hanh: "2026-03-25"\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/luat-khung]\nquan_he: {hop_nhat: [105/2016/QH13]}\n${XM}\n`,
    'tt.yaml': `so_hieu: 38/2015/TT-BTC\nloai: THONG_TU\nten: Thủ tục hải quan\nco_quan: BTC\nngay_ban_hanh: "2015-03-25"\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/thu-tuc]\n${XM}\n`,
    'qd.yaml': `so_hieu: 1966/QĐ-TCHQ\nloai: QUYET_DINH\nten: Quy trình thủ tục hải quan\nco_quan: TCHQ\nngay_ban_hanh: "2015-07-10"\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/so-tay-nghiep-vu]\nquan_he: {huong_dan: [38/2015/TT-BTC]}\n${XM}\n`,
    'nd-cung-ngay.yaml': `so_hieu: 26/2026/NĐ-CP\nloai: NGHI_DINH\nten: Nghị định cùng ngày\nco_quan: CP\nngay_ban_hanh: "2026-01-17"\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\n${XM}\n`,
    'tt-cung-ngay.yaml': `so_hieu: 01/2026/TT-BCT\nloai: THONG_TU\nten: Thông tư cùng ngày hướng dẫn NĐ\nco_quan: BCT\nngay_ban_hanh: "2026-01-17"\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\nquan_he: {huong_dan: [26/2026/NĐ-CP]}\n${XM}\n`,
    'no-date-a.yaml': `so_hieu: 1/2026/TT-BCT\nloai: THONG_TU\nten: Văn bản giả không có ngay_ban_hanh\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/thu-tuc]\nquan_he: {sua_doi: [38/2015/TT-BTC]}\n${XM}\n`,
  });
  const kOk = kiemTra(napSo(rOk), { today: '2026-11-21', root: rOk });
  t('hợp lệ: QUYET_DINH -> huong_dan -> THONG_TU, VAN_BAN_HOP_NHAT -> hop_nhat -> LUAT, cùng ngày và thiếu ngay_ban_hanh → 0 lỗi',
    kOk.loi.length === 0,
    JSON.stringify(kOk.loi));

  // 5. Sổ thật: kiemTra(napSo(), {}) = 0 lỗi và đồ thị giữ đủ chiều đi hợp lệ
  const soThat = napSo();
  const kThat = kiemTra(soThat, {});
  t('sổ thật: kiemTra(napSo(), {}) = 0 lỗi',
    kThat.loi.length === 0,
    JSON.stringify(kThat.loi.slice(0, 5)));

  const { nguoc } = dungDoThi(soThat);
  const coChieuNguoc = (targetSo, field, sourceSo) => (nguoc.get(khoa(targetSo))?.[field] || [])
    .some((e) => khoa(e.tu) === khoa(sourceSo));
  t('sổ thật: 3 cạnh chiều đi bổ sung + các cạnh hợp lệ giữ nguyên trong đồ thị',
    coChieuNguoc('105/2016/QH13', 'bi_sua_doi_boi', '28/2018/QH14')
    && coChieuNguoc('98/2021/NĐ-CP', 'bi_sua_doi_boi', '07/2023/NĐ-CP')
    && coChieuNguoc('1975/QĐ-BCT', 'bi_thay_the_boi', '915/QĐ-BCT')
    && coChieuNguoc('38/2015/TT-BTC', 'duoc_huong_dan_boi', '1966/QĐ-TCHQ')
    && coChieuNguoc('105/2016/QH13', 'duoc_hop_nhat_boi', '76-VBHN/VPQH'));
} finally {
  for (const d of tmpDirs) rmSync(d, { recursive: true, force: true });
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
