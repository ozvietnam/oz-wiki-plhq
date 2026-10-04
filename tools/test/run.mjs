// Test công cụ trên sổ giả lập (thư mục tạm) — không đụng registry/ thật, không cần mạng.
import { mkdtempSync, mkdirSync, writeFileSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { napSo, khoa, slugTuSoHieu, bacNguon, ROOT } from '../lib/registry.mjs';
import { kiemTra } from '../kiem-tra.mjs';
import { timDiemMu } from '../diem-mu.mjs';
import { dungJson, veQuanHe } from '../dung.mjs';
import { lamSachHtml } from '../nap.mjs';
import { rutGonNhuCau } from '../nhu-cau.mjs';

let pass = 0;
let fail = 0;
const t = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`PASS ${name}`); } else { fail += 1; console.log(`FAIL ${name} ${extra}`); }
};

function soGia(vanBan, { wiki = {} } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'kb-'));
  mkdirSync(join(root, 'registry', 'van-ban'), { recursive: true });
  for (const f of ['cay-xnk.yaml', 'co-quan.yaml', 'nguon-uy-tin.yaml']) cpSync(join(ROOT, 'registry', f), join(root, 'registry', f));
  for (const [file, body] of Object.entries(vanBan)) writeFileSync(join(root, 'registry', 'van-ban', file), body);
  for (const [file, body] of Object.entries(wiki)) {
    mkdirSync(join(root, 'wiki', 'concepts'), { recursive: true });
    writeFileSync(join(root, 'wiki', file), body);
  }
  return root;
}
const XM = 'xac_minh: {muc: CHUA_XAC_MINH, hieu_luc_da_doi_chieu: false, ngay: "2026-10-01"}';

// 1. Chuẩn hoá số hiệu
t('khoa: QĐ = QD, hoa, bỏ khoảng trắng', khoa('1182/qđ-BCT ') === '1182/QD-BCT');
t('slug: NĐ → nd, thêm năm cho QĐ không năm', slugTuSoHieu('08/2015/NĐ-CP') === '08-2015-nd-cp' && slugTuSoHieu('1182/QĐ-BCT', 2021) === '1182-qd-bct-2021');
t('slug: Luật không thêm năm thừa', slugTuSoHieu('54/2014/QH13', 2014) === '54-2014-qh13');

// 2. Bậc nguồn
const so0 = napSo();
t('bậc nguồn: vanban.chinhphu.vn = A', bacNguon('https://vanban.chinhphu.vn/?docid=1', so0.nguon) === 'A');
t('bậc nguồn: thuvienphapluat = B', bacNguon('https://thuvienphapluat.vn/van-ban/x', so0.nguon) === 'B');
t('bậc nguồn: blog = C', bacNguon('https://blog.example.com/x', so0.nguon) === 'C');

// 3. Kiểm sổ bắt lỗi
const r1 = soGia({
  'a.yaml': `so_hieu: 1/2026/TT-BTC\nloai: THONG_TU\nten: A\nco_quan: BTC\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/khong-co]\n${XM}\n`,
  'b.yaml': `so_hieu: 2/2026/TT-BTC\nloai: SAI\nten: B\nco_quan: XYZ\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/thu-tuc]\nxac_minh: {muc: NGUON_A}\nnguon: [{url: "https://blog.example.com/b"}]\n`,
  'c.yaml': `so_hieu: 3/2026/TT-BTC\nloai: THONG_TU\nten: C\nco_quan: BTC\ntinh_trang: CON_HIEU_LUC\nhet_hieu_luc_tu: "2020-01-01"\nnhanh: [hai-quan/thu-tuc]\nquan_he: {thay_the: [4/2026/TT-BTC]}\n${XM}\n`,
  'd.yaml': `so_hieu: 4/2026/TT-BTC\nloai: THONG_TU\nten: D\nco_quan: BTC\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/thu-tuc]\nquan_he: {thay_the: [3/2026/TT-BTC]}\n${XM}\n`,
  'e.yaml': `so_hieu: 1/2026/TT-BTC\nloai: THONG_TU\nten: E trùng\nco_quan: BTC\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/thu-tuc]\n${XM}\n`,
});
const k1 = kiemTra(napSo(r1), { today: '2026-10-04' });
const has = (re) => k1.loi.some((e) => re.test(e.msg));
t('lỗi: nhánh không có trong cây', has(/nhanh "hai-quan\/khong-co"/));
t('lỗi: loại sai + cơ quan lạ', has(/loai "SAI"/) && has(/co_quan "XYZ"/));
t('lỗi: NGUON_A mà không có nguồn A', has(/NGUON_A nhưng không có nguồn bậc A/));
t('lỗi: còn hiệu lực nhưng ngày hết hiệu lực đã qua', has(/het_hieu_luc_tu 2020-01-01 đã qua/));
t('lỗi: chu trình thay thế', has(/chu trình thay thế/));
t('lỗi: trùng số hiệu', has(/trùng số hiệu.*1\/2026\/TT-BTC/));
const r3 = soGia({
  'x.yaml': `so_hieu: 12/2018/TT-BCT\nso_hieu_khac: [12/2018/TT-BTC]\nloai: THONG_TU\nten: X\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [quan-ly-ngoai-thuong/luat-khung]\n${XM}\n`,
  'y.yaml': `so_hieu: 5/2026/TT-BCT\nloai: THONG_TU\nten: Y\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [quan-ly-ngoai-thuong/luat-khung]\nquan_he: {sua_doi: [12/2018/TT-BTC]}\n${XM}\n`,
});
const so3 = napSo(r3);
t('so_hieu_khac: tra được bằng cách viết sai', so3.theoKhoa.get(khoa('12/2018/TT-BTC'))?.[0]?.so_hieu === '12/2018/TT-BCT');
t('so_hieu_khac: quan hệ trỏ vào cách viết khác không bị báo thiếu văn bản', !timDiemMu(so3, { today: '2026-10-04', root: r3 }).some((d) => d.ma === 'THIEU_VAN_BAN'));
t('sổ thật không có lỗi', kiemTra(napSo(), {}).loi.length === 0, JSON.stringify(kiemTra(napSo(), {}).loi.slice(0, 3)));

// 4. Điểm mù
const r2 = soGia({
  'moi.yaml': `so_hieu: 10/2026/TT-BCT\nloai: THONG_TU\nten: Mới\nco_quan: BCT\nhieu_luc_tu: "2026-07-01"\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\nquan_he: {thay_the: [9/2020/TT-BCT, 8/2019/TT-BCT], huong_dan: [99/2008/NĐ-CP]}\n${XM}\n`,
  'cu.yaml': `so_hieu: 9/2020/TT-BCT\nloai: THONG_TU\nten: Cũ vẫn ghi còn hiệu lực\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\n${XM}\n`,
  'goc.yaml': `so_hieu: 99/2008/NĐ-CP\nloai: NGHI_DINH\nten: Gốc đã hết\nco_quan: CP\ntinh_trang: HET_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/khung-chat-luong]\n${XM}\n`,
  'tam.yaml': `so_hieu: 11/2026/NĐ-CP\nloai: NGHI_DINH\nten: Bị tạm ngưng\nco_quan: CP\ntinh_trang: TAM_NGUNG_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/an-toan-thuc-pham]\nquan_he: {thay_the: [12/2018/NĐ-CP]}\n${XM}\n`,
  'ok.yaml': `so_hieu: 12/2018/NĐ-CP\nloai: NGHI_DINH\nten: Vẫn áp dụng\nco_quan: CP\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/an-toan-thuc-pham]\n${XM}\n`,
  'sap.yaml': `so_hieu: 13/2019/NĐ-CP\nloai: NGHI_DINH\nten: Sắp hết\nco_quan: CP\ntinh_trang: CON_HIEU_LUC\nhet_hieu_luc_tu: "2026-10-15"\nnhanh: [hai-quan/mot-cua]\n${XM}\n`,
}, { wiki: { 'concepts/x.md': 'Theo Thông tư 77/2026/TT-BYT và 10/2026/TT-BCT.' } });
const dm = timDiemMu(napSo(r2), { today: '2026-10-04', root: r2 });
const co = (ma, muc) => dm.some((d) => d.ma === ma && (!muc || d.muc_tieu === muc));
t('điểm mù: văn bản được nhắc nhưng chưa đăng ký', co('THIEU_VAN_BAN', '8/2019/TT-BCT'));
t('điểm mù: mâu thuẫn — bị thay mà còn ghi hiệu lực', co('MAU_THUAN_HIEU_LUC', '9/2020/TT-BCT'));
t('không báo mâu thuẫn khi văn bản thay đang TẠM NGƯNG', !co('MAU_THUAN_HIEU_LUC', '12/2018/NĐ-CP'));
t('điểm mù: hướng dẫn mất gốc', co('HUONG_DAN_MO_COI', '10/2026/TT-BCT'));
t('điểm mù: sắp hết hiệu lực', co('SAP_HET_HIEU_LUC', '13/2019/NĐ-CP'));
t('điểm mù: wiki nhắc văn bản chưa đăng ký (77/2026/TT-BYT), không báo văn bản đã có', co('WIKI_NHAC_CHUA_DANG_KY', '77/2026/TT-BYT') && !co('WIKI_NHAC_CHUA_DANG_KY', '10/2026/TT-BCT'));
t('điểm mù: nhánh cây trống', co('NUT_CAY_TRONG', 'thue/bieu-thue'));
t('điểm mù: nhánh thiếu LUAT bắt buộc', dm.some((d) => d.ma === 'NUT_THIEU_LOAI' && d.muc_tieu === 'hai-quan/luat-khung'));

// 5. Dựng
const j = dungJson(napSo(r2), '2026-10-04');
const cu = j.van_ban.find((d) => d.so_hieu === '9/2020/TT-BCT');
t('registry.json có cạnh ngược bi_thay_the_boi', cu?.quan_he_nguoc?.bi_thay_the_boi?.[0]?.tu === '10/2026/TT-BCT');
t('đồ thị Mermaid có mũi tên thay thế', /-->\|thay thế\|/.test(veQuanHe(napSo(r2), '2026-10-04')));

// 6. Làm sạch HTML
// 5. Nhu cầu từ hs-code-api → điểm mù xếp theo số mã HS
const nhuCau = rutGonNhuCau({
  ngay: '2026-10-04', registryVersion: 'x', maHs: { coChinhSach: 10 },
  theoVanBan: [
    { soHieu: '12/2018/NĐ-CP', found: true, soMaHs: 120 },
    { soHieu: '9/2020/TT-BCT', found: true, soMaHs: 7 },
    { soHieu: '55/2099/TT-BXX', found: false, soMaHs: 3 },
  ],
  thuVienLechSo: { lech: [
    { code: '99/2008/ND-CP', thuVien: 'ACTIVE', so: 'HET_HIEU_LUC', soHieu: '99/2008/NĐ-CP' },
    { code: '99/2008/ND-CP-PL1', thuVien: 'ACTIVE', so: 'HET_HIEU_LUC', soHieu: '99/2008/NĐ-CP' },
    { code: '12/2018/NĐ-CP', thuVien: 'EXPIRED', so: 'TAM_NGUNG_HIEU_LUC', soHieu: '12/2018/NĐ-CP' },
  ] },
});
const dh = timDiemMu(napSo(r2), { today: '2026-10-04', root: r2, nhuCau }).filter((d) => d.ma.startsWith('HS_API_'));
const uu = dh.filter((d) => d.ma === 'HS_API_UU_TIEN_DOI_CHIEU');
t('nhu cầu: văn bản biểu thuế dẫn chưa có trong sổ', dh.some((d) => d.ma === 'HS_API_CHUA_CO' && d.muc_tieu === '55/2099/TT-BXX'));
t('nhu cầu: ưu tiên đối chiếu — ≥50 mã là Cao, kèm trọng số', uu.find((d) => d.muc_tieu === '12/2018/NĐ-CP')?.muc === 'Cao' && uu.find((d) => d.muc_tieu === '9/2020/TT-BCT')?.trongSo === 7);
const lechTv = dh.filter((d) => d.ma === 'HS_API_LECH_THU_VIEN');
t('nhu cầu: lệch thư viện gộp theo số hiệu, bỏ dòng sổ đã đổi tình trạng', lechTv.length === 1 && lechTv[0].muc_tieu === '99/2008/NĐ-CP', JSON.stringify(lechTv));
t('không có nhu-cau → không sinh việc HS_API', !timDiemMu(napSo(r2), { today: '2026-10-04', root: r2 }).some((d) => d.ma.startsWith('HS_API_')));
const sach = lamSachHtml('<html><script>x()</script><nav>menu</nav><p>Điều 1.&nbsp;Phạm vi</p><p>Điều 2</p></html>');
t('làm sạch HTML: bỏ script/menu, giữ đoạn', sach === 'Điều 1. Phạm vi\nĐiều 2', JSON.stringify(sach));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
