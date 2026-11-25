// Test công cụ trên sổ giả lập (thư mục tạm) — không đụng registry/ thật, không cần mạng.
import { mkdtempSync, mkdirSync, writeFileSync, cpSync, readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { napSo, khoa, slugTuSoHieu, bacNguon, ROOT, LUOC_DO_PHIEN_BAN } from '../lib/registry.mjs';
import { phanLoaiTbTchq, tuLoaiTB } from '../lib/loai-phan-loai-tb-tchq.mjs';
import { kiemTra } from '../kiem-tra.mjs';
import { timDiemMu } from '../diem-mu.mjs';
import { dungJson, veQuanHe } from '../dung.mjs';
import { lamSachHtml } from '../nap.mjs';
import { rutGonNhuCau, rutGonBieuThue, rutGonHangThat, rutGonVanBanBieuThue } from '../nhu-cau.mjs';
import { docCsv, napDanhMuc, kiemDinhDang, kiemDanhMucCas, COT_CAS, CAS_LOI_IN_NGUON_A, dungChiMuc, dungChiMucTheoMa, demLa, docBieuThue } from '../lib/danh-muc.mjs';

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
// 4b. Điểm mù: THIEU_VBHN
const rVbhn = soGia({
  'sua3.yaml': `so_hieu: 20/2026/TT-BCT\nloai: THONG_TU\nten: Bi sua 3 lan\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\n${XM}\n`,
  'a.yaml': `so_hieu: 30/2026/TT-BCT\nloai: THONG_TU\nten: Sua 1\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\nquan_he: {sua_doi: [20/2026/TT-BCT]}\n${XM}\n`,
  'b.yaml': `so_hieu: 31/2026/TT-BCT\nloai: THONG_TU\nten: Sua 2\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\nquan_he: {sua_doi: [20/2026/TT-BCT]}\n${XM}\n`,
  'c.yaml': `so_hieu: 32/2026/TT-BCT\nloai: THONG_TU\nten: Sua 3\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\nquan_he: {sua_doi: [20/2026/TT-BCT]}\n${XM}\n`,
  'sua5.yaml': `so_hieu: 50/2026/TT-BCT\nloai: THONG_TU\nten: Bi sua 5 lan\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\n${XM}\n`,
  'd1.yaml': `so_hieu: 51/2026/TT-BCT\nloai: THONG_TU\nten: Sua 50 lan 1\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\nquan_he: {sua_doi: [50/2026/TT-BCT]}\n${XM}\n`,
  'd2.yaml': `so_hieu: 52/2026/TT-BCT\nloai: THONG_TU\nten: Sua 50 lan 2\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\nquan_he: {sua_doi: [50/2026/TT-BCT]}\n${XM}\n`,
  'd3.yaml': `so_hieu: 53/2026/TT-BCT\nloai: THONG_TU\nten: Sua 50 lan 3\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\nquan_he: {sua_doi: [50/2026/TT-BCT]}\n${XM}\n`,
  'd4.yaml': `so_hieu: 54/2026/TT-BCT\nloai: THONG_TU\nten: Sua 50 lan 4\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\nquan_he: {sua_doi: [50/2026/TT-BCT]}\n${XM}\n`,
  'd5.yaml': `so_hieu: 55/2026/TT-BCT\nloai: THONG_TU\nten: Sua 50 lan 5\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\nquan_he: {sua_doi: [50/2026/TT-BCT]}\n${XM}\n`,
  'co_vbhn.yaml': `so_hieu: 60/2026/TT-BCT\nloai: THONG_TU\nten: Bi sua 3 lan co VBHN\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\n${XM}\n`,
  'e1.yaml': `so_hieu: 61/2026/TT-BCT\nloai: THONG_TU\nten: Sua 60 lan 1\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\nquan_he: {sua_doi: [60/2026/TT-BCT]}\n${XM}\n`,
  'e2.yaml': `so_hieu: 62/2026/TT-BCT\nloai: THONG_TU\nten: Sua 60 lan 2\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\nquan_he: {sua_doi: [60/2026/TT-BCT]}\n${XM}\n`,
  'e3.yaml': `so_hieu: 63/2026/TT-BCT\nloai: THONG_TU\nten: Sua 60 lan 3\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\nquan_he: {sua_doi: [60/2026/TT-BCT]}\n${XM}\n`,
  'vbhn_60.yaml': `so_hieu: 60/2026/TT-BCT-VBHN\nloai: THONG_TU\nten: Van ban hop nhat 60/2026/TT-BCT\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\n${XM}\n`,
  'sua1.yaml': `so_hieu: 70/2026/TT-BCT\nloai: THONG_TU\nten: Bi sua 1 lan (duoi nguong)\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\n${XM}\n`,
  'f1.yaml': `so_hieu: 71/2026/TT-BCT\nloai: THONG_TU\nten: Sua 70 lan 1\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\nquan_he: {sua_doi: [70/2026/TT-BCT]}\n${XM}\n`,
  'qd_hanh_chinh.yaml': `so_hieu: 2711/QĐ-BKHCN\nloai: QUYET_DINH\nten: Quyet dinh hanh chinh khong nam bi sua 3 lan\nco_quan: BKHCN\ntinh_trang: HET_HIEU_LUC_MOT_PHAN\nnhanh: [kiem-tra-chuyen-nganh/bkhcn]\n${XM}\n`,
  'qdhc1.yaml': `so_hieu: 366/QĐ-BKHCN\nloai: QUYET_DINH\nten: Sua QDHC 1\nco_quan: BKHCN\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bkhcn]\nquan_he: {sua_doi: [2711/QĐ-BKHCN]}\n${XM}\n`,
  'qdhc2.yaml': `so_hieu: 367/QĐ-BKHCN\nloai: QUYET_DINH\nten: Sua QDHC 2\nco_quan: BKHCN\ntinh_trang: HET_HIEU_LUC_MOT_PHAN\nnhanh: [kiem-tra-chuyen-nganh/bkhcn]\nquan_he: {sua_doi: [2711/QĐ-BKHCN]}\n${XM}\n`,
  'qdhc3.yaml': `so_hieu: 3830/QĐ-BKHCN\nloai: QUYET_DINH\nten: Sua QDHC 3\nco_quan: BKHCN\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bkhcn]\nquan_he: {sua_doi: [2711/QĐ-BKHCN]}\n${XM}\n`,
  'qd_qppl.yaml': `so_hieu: 23/2019/QĐ-TTg\nloai: QUYET_DINH\nten: Quyet dinh QPPL co nam bi sua 3 lan\nco_quan: TTG\ntinh_trang: HET_HIEU_LUC_MOT_PHAN\nnhanh: [hai-quan/thu-tuc]\n${XM}\n`,
  'qdqp1.yaml': `so_hieu: 1/2020/QĐ-TTg\nloai: QUYET_DINH\nten: Sua QDQP 1\nco_quan: TTG\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/thu-tuc]\nquan_he: {sua_doi: [23/2019/QĐ-TTg]}\n${XM}\n`,
  'qdqp2.yaml': `so_hieu: 2/2021/QĐ-TTg\nloai: QUYET_DINH\nten: Sua QDQP 2\nco_quan: TTG\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/thu-tuc]\nquan_he: {sua_doi: [23/2019/QĐ-TTg]}\n${XM}\n`,
  'qdqp3.yaml': `so_hieu: 3/2022/QĐ-TTg\nloai: QUYET_DINH\nten: Sua QDQP 3\nco_quan: TTG\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/thu-tuc]\nquan_he: {sua_doi: [23/2019/QĐ-TTg]}\n${XM}\n`,
});
const dmVbhn = timDiemMu(napSo(rVbhn), { today: '2026-10-04', root: rVbhn });
const vbhn = (ma, muc_tieu) => dmVbhn.find((d) => d.ma === ma && d.muc_tieu === muc_tieu);
t('điểm mù: bị sửa 3 lần chưa VBHN → báo Vừa', vbhn('THIEU_VBHN', '20/2026/TT-BCT')?.muc === 'Vừa');
t('điểm mù: bị sửa 5 lần chưa VBHN → báo Cao', vbhn('THIEU_VBHN', '50/2026/TT-BCT')?.muc === 'Cao');
t('điểm mù: bị sửa 3 lần có VBHN → không báo', !vbhn('THIEU_VBHN', '60/2026/TT-BCT'));
t('điểm mù: bị sửa 1 lần → không báo', !vbhn('THIEU_VBHN', '70/2026/TT-BCT'));
t('điểm mù: QĐ hành chính không năm (2711/QĐ-BKHCN) bị sửa 3 lần → không báo THIEU_VBHN', !vbhn('THIEU_VBHN', '2711/QĐ-BKHCN'));
t('điểm mù: QĐ QPPL có năm (23/2019/QĐ-TTg) bị sửa 3 lần chưa VBHN → vẫn báo THIEU_VBHN mức Vừa', vbhn('THIEU_VBHN', '23/2019/QĐ-TTg')?.muc === 'Vừa');


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
// 5b. xac_minh.chan → HS_API_CHO_MO_CHAN (không giữ UU_TIEN)
const rChan = soGia({
  'chan.yaml': `so_hieu: 12/2018/NĐ-CP\nloai: NGHI_DINH\nten: Đã chặn săn\nco_quan: CP\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/an-toan-thuc-pham]\nxac_minh: {muc: NGUON_A, hieu_luc_da_doi_chieu: false, ngay: "2026-10-04", chan: {ma: THIEU_BAI_TUONG_MINH, ngay: "2026-10-04", viec_tiep: "Chờ TT mới"}}\nnguon: [{url: "https://vanban.chinhphu.vn/?docid=1", truy_cap: "2026-10-04"}]\n`,
  'ok2.yaml': `so_hieu: 9/2020/TT-BCT\nloai: THONG_TU\nten: Chưa chặn\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\n${XM}\n`,
});
const dhChan = timDiemMu(napSo(rChan), { today: '2026-10-04', root: rChan, nhuCau }).filter((d) => d.ma.startsWith('HS_API_'));
t('chan: sinh HS_API_CHO_MO_CHAN mức Thấp', dhChan.some((d) => d.ma === 'HS_API_CHO_MO_CHAN' && d.muc_tieu === '12/2018/NĐ-CP' && d.muc === 'Thấp'));
t('chan: không còn UU_TIEN cho cùng số hiệu', !dhChan.some((d) => d.ma === 'HS_API_UU_TIEN_DOI_CHIEU' && d.muc_tieu === '12/2018/NĐ-CP'));
t('chan: mục chưa chan vẫn UU_TIEN', dhChan.some((d) => d.ma === 'HS_API_UU_TIEN_DOI_CHIEU' && d.muc_tieu === '9/2020/TT-BCT'));
const rChanDongBo = soGia({
  'chan-dm.yaml': `so_hieu: 6266/QĐ-BCA\nloai: QUYET_DINH\nten: Ban hành Danh mục sản phẩm hàng hóa kiểm tra chuyên ngành\nco_quan: BCA\nhieu_luc_tu: "2026-07-01"\ntinh_trang: CON_HIEU_LUC\ntrich_dan_trong_bieu_thue: 150\nnhanh: [kiem-tra-chuyen-nganh/bca]\nxac_minh: {muc: NGUON_THU_CAP, hieu_luc_da_doi_chieu: false, ngay: "2026-10-04", chan: {ma: THIEU_PDF_A, ngay: "2026-10-04", viec_tiep: "Chờ BCA công bố PDF"}}\n`,
  'chan-khung.yaml': `so_hieu: 45/2024/TT-BCT\nloai: THONG_TU\nten: "(chưa có tiêu đề — số hiệu lệch trong biểu thuế)"\nco_quan: BCT\ntinh_trang: CHUA_XAC_MINH\nnhanh: [kiem-tra-chuyen-nganh/bct]\nxac_minh: {muc: CHUA_XAC_MINH, hieu_luc_da_doi_chieu: false, ngay: "2026-10-04", chan: {ma: SO_HIEU_LECH, ngay: "2026-10-04", viec_tiep: "Báo hs-code-api sửa số hiệu"}}\n`,
});
const dmChanDongBo = timDiemMu(napSo(rChanDongBo), { today: '2026-10-04', root: rChanDongBo, nhuCau: null });
t('chan: không sinh KHONG_TOAN_VAN, VAN_BAN_KHUNG, DANH_MUC_CHUA_TRICH khi đã có xac_minh.chan.ma',
  !dmChanDongBo.some((d) => ['KHONG_TOAN_VAN', 'VAN_BAN_KHUNG', 'DANH_MUC_CHUA_TRICH'].includes(d.ma)),
  JSON.stringify(dmChanDongBo.filter((d) => ['KHONG_TOAN_VAN', 'VAN_BAN_KHUNG', 'DANH_MUC_CHUA_TRICH'].includes(d.ma))));
t('chan: giữ mức Thấp cho KHONG_NGUON_A và HIEU_LUC_CHUA_DOI_CHIEU khi đã có xac_minh.chan.ma',
  dmChanDongBo.find((d) => d.ma === 'KHONG_NGUON_A' && d.muc_tieu === '6266/QĐ-BCA')?.muc === 'Thấp'
  && dmChanDongBo.find((d) => d.ma === 'HIEU_LUC_CHUA_DOI_CHIEU' && d.muc_tieu === '6266/QĐ-BCA')?.muc === 'Thấp',
  JSON.stringify(dmChanDongBo.filter((d) => d.muc_tieu === '6266/QĐ-BCA')));
const kChanBad = kiemTra(napSo(soGia({
  'bad.yaml': `so_hieu: 1/2026/TT-BCT\nloai: THONG_TU\nten: Chan sai\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\nxac_minh: {muc: CHUA_XAC_MINH, hieu_luc_da_doi_chieu: false, ngay: "2026-10-04", chan: {ma: SAI_MA, ngay: "2026-10-04", viec_tiep: "x"}}\n`,
})), { today: '2026-10-04' });
t('chan: ma không hợp lệ → lỗi kiểm', kChanBad.loi.some((e) => /chan\.ma/.test(e.msg)));
const rChanDaDoiChieu = soGia({
  'ok-thieu-pdf.yaml': `so_hieu: 09/2014/NĐ-CP\nloai: NGHI_DINH\nten: Quy định cơ cấu tổ chức Ban Cơ yếu Chính phủ\nco_quan: CP\ntinh_trang: CON_HIEU_LUC\nnhanh: [bo-may]\nnguon: [{url: "https://vanban.chinhphu.vn/?docid=219388", truy_cap: "2026-11-15"}]\nxac_minh: {muc: NGUON_A, hieu_luc_da_doi_chieu: true, ngay: "2026-11-15", chan: {ma: THIEU_PDF_A, ngay: "2026-11-21", viec_tiep: "Cổng chính thống không phát hành tệp toàn văn công khai"}}\n`,
});
const soChanDaDoiChieu = napSo(rChanDaDoiChieu);
const kChanDaDoiChieu = kiemTra(soChanDaDoiChieu, { today: '2026-11-21' });
const dmChanDaDoiChieu = timDiemMu(soChanDaDoiChieu, { today: '2026-11-21', root: rChanDaDoiChieu, nhuCau: null });
t('chan: hieu_luc_da_doi_chieu=true kèm THIEU_PDF_A khi chưa có toan_van → hợp lệ và đóng KHONG_TOAN_VAN',
  kChanDaDoiChieu.loi.length === 0
  && !dmChanDaDoiChieu.some((d) => ['KHONG_TOAN_VAN', 'HIEU_LUC_CHUA_DOI_CHIEU'].includes(d.ma)),
  JSON.stringify({ loi: kChanDaDoiChieu.loi, dm: dmChanDaDoiChieu.filter((d) => d.muc_tieu === '09/2014/NĐ-CP') }));
const kChanDaDoiChieuConflict = kiemTra(napSo(soGia({
  'conflict-ma.yaml': `so_hieu: 2/2026/TT-BCT\nloai: THONG_TU\nten: Chan xung đột\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\nnguon: [{url: "https://vanban.chinhphu.vn/?docid=1", truy_cap: "2026-10-04"}]\nxac_minh: {muc: NGUON_A, hieu_luc_da_doi_chieu: true, ngay: "2026-10-04", chan: {ma: THIEU_BAI_TUONG_MINH, ngay: "2026-10-04", viec_tiep: "x"}}\n`,
  'conflict-tv.yaml': `so_hieu: 3/2026/TT-BCT\nloai: THONG_TU\nten: Đã có toàn văn vẫn giữ THIEU_PDF_A\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\ntoan_van: raw/download/x.pdf\nnguon: [{url: "https://vanban.chinhphu.vn/?docid=1", truy_cap: "2026-10-04"}]\nxac_minh: {muc: NGUON_A, hieu_luc_da_doi_chieu: true, ngay: "2026-10-04", chan: {ma: THIEU_PDF_A, ngay: "2026-10-04", viec_tiep: "x"}}\n`,
})), { today: '2026-10-04' });
t('chan: hieu_luc_da_doi_chieu=true kèm mã chan khác THIEU_PDF_A hoặc đã có toan_van → lỗi kiểm',
  kChanDaDoiChieuConflict.loi.filter((e) => /không vừa hieu_luc_da_doi_chieu: true vừa có xac_minh\.chan/.test(e.msg)).length === 2,
  JSON.stringify(kChanDaDoiChieuConflict.loi));
// 6. Bảng danh mục mã HS
t('CSV: ngoặc kép, dấu phẩy và xuống dòng trong ô', JSON.stringify(docCsv('a,b\n"x, ""y""","dòng 1\ndòng 2"\n')) === JSON.stringify([['a', 'b'], ['x, "y"', 'dòng 1\ndòng 2']]));
const HEAD = 'ma_hs,mo_ta,nhom,phu_luc,loai_tac_dong,muc_rui_ro,dieu_kien,dan_chieu,trang\n';
const r6 = soGia({
  'dm.yaml': `so_hieu: 50/2026/TT-BCT\nloai: THONG_TU\nten: Ban hành Danh mục mặt hàng kiểm tra ATTP\nco_quan: BCT\nhieu_luc_tu: "2026-07-17"\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\ndanh_muc_hs: {tep: danh-muc/dm.csv, nguon: "https://congbao.chinhphu.vn/x", ngay: "2026-10-04"}\n${XM}\n`,
  'chua.yaml': `so_hieu: 51/2026/TT-BYT\nloai: THONG_TU\nten: Ban hành Danh mục thực phẩm rủi ro trung bình\nco_quan: BYT\nhieu_luc_tu: "2026-07-01"\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/byt]\n${XM}\n`,
  'hong.yaml': `so_hieu: 52/2026/TT-BCT\nloai: THONG_TU\nten: Danh mục hỏng\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\ndanh_muc_hs: {tep: danh-muc/hong.csv}\n${XM}\n`,
});
mkdirSync(join(r6, 'danh-muc'), { recursive: true });
mkdirSync(join(r6, 'nhu-cau'), { recursive: true });
writeFileSync(join(r6, 'danh-muc', 'dm.csv'), HEAD
  + '22030091,Bia đóng chai,1,Phụ lục,KIEM_TRA_ATTP,,,,5\n'
  + '1901,"Chế phẩm thực phẩm từ bột, tinh bột",2,Phụ lục,KIEM_TRA_ATTP,,"trừ loại dùng cho trẻ em",,5\n'
  + '22029999,Mã không có,3,Phụ lục,KIEM_TRA_ATTP,,,,6\n'
  + ',Thực phẩm dinh dưỡng,4,Phụ lục,KIEM_TRA_ATTP,TRUNG_BINH,,15/2024/TT-BYT,6\n');
writeFileSync(join(r6, 'danh-muc', 'hong.csv'), HEAD + '2203.00.91,Bia,1,Phụ lục,KIEM_ATTP,,,,1\n');
const taxGia = Object.fromEntries(Array.from({ length: 1200 }, (_, i) => [String(19010000 + i), { hs: String(19010000 + i), vn: 'x' }]));
taxGia['22030091'] = { hs: '22030091', vn: '- - Bia' };
writeFileSync(join(r6, 'nhu-cau', 'bieu-thue.json'), JSON.stringify(rutGonBieuThue(taxGia, 'test', '2026-10-04')));
const so6 = napSo(r6);
const dm6 = napDanhMuc(so6, r6);
const hong = dm6.find((x) => x.tep === 'danh-muc/hong.csv');
t('danh mục: lỗi định dạng mã có dấu chấm + loại tác động sai', kiemDinhDang(hong).some((m) => /2203\.00\.91/.test(m)) && kiemDinhDang(hong).some((m) => /KIEM_ATTP/.test(m)));
t('danh mục: kiem-tra chặn bảng hỏng', kiemTra(so6, { root: r6 }).loi.some((e) => /hong\.csv/.test(e.msg)));
// Lệch số cột trong danh-muc/*.csv phải chặn PR (kèm tên tệp + số dòng)
const rLech = soGia({
  'lech-vb.yaml': `so_hieu: 99/2026/TT-BCT\nloai: THONG_TU\nten: Fixture lệch cột\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [chua-phan-loai]\n${XM}\n`,
});
mkdirSync(join(rLech, 'danh-muc'), { recursive: true });
writeFileSync(join(rLech, 'danh-muc', 'lech.csv'), HEAD + '22030091,Bia,1,Phụ lục,KIEM_TRA_ATTP,,,5\n'); // 8 ô, thiếu 1 so với header 9
const kLech = kiemTra(napSo(rLech), { root: rLech });
t('danh mục: lệch số cột CSV → lỗi kèm tên tệp + số dòng', kLech.loi.some((e) => e.file === 'danh-muc/lech.csv' && /dòng 2/.test(e.msg) && /cột/.test(e.msg)));

// 6a. Khóa 4 bất biến chất lượng mo_ta & dan_chieu trong kiemDinhDang (OZV-1709)
const dmOk6 = dm6.find((x) => x.tep === 'danh-muc/dm.csv');
t('danh mục (OZV-1709): bảng hợp lệ không vi phạm mo_ta/dan_chieu → 0 lỗi', kiemDinhDang(dmOk6).length === 0, JSON.stringify(kiemDinhDang(dmOk6)));
const rMoTaBad = soGia({
  'mota-bad.yaml': `so_hieu: 98/2026/TT-BCT\nloai: THONG_TU\nten: Fixture 4 lỗi mo_ta và dan_chieu\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\ndanh_muc_hs: {tep: danh-muc/mota-bad.csv}\n${XM}\n`,
});
mkdirSync(join(rMoTaBad, 'danh-muc'), { recursive: true });
writeFileSync(join(rMoTaBad, 'danh-muc', 'mota-bad.csv'), HEAD
  + '22030091,- Bia đóng chai,1,Phụ lục,KIEM_TRA_ATTP,,,,1\n'
  + '22030099,Loại khác,2,Phụ lục,KIEM_TRA_ATTP,,,,1\n'
  + '19019099,"Chế phẩm thực phẩm (chưa đóng gói",3,Phụ lục,KIEM_TRA_ATTP,,,,1\n'
  + '85444299,Dây cáp điện hạ thế,4,Phụ lục,KIEM_TRA_CHAT_LUONG,,QCVN 4:2009/BKHCN,QCVN 4:2009/BKHCN,2\n');
const soMoTaBad = napSo(rMoTaBad);
const itemMoTaBad = napDanhMuc(soMoTaBad, rMoTaBad)[0];
const loiMoTaBad = kiemDinhDang(itemMoTaBad);
const kMoTaBad = kiemTra(soMoTaBad, { root: rMoTaBad });
t('danh mục (OZV-1709): kiemDinhDang và kiemTra chặn đủ 4 lỗi (mo_ta bắt đầu bằng "-", cộc lốc "Loại khác", lệch ngoặc đơn, dan_chieu ghi QCVN)',
  loiMoTaBad.some((m) => /mota-bad\.csv:2 mo_ta không được bắt đầu bằng "-"/.test(m))
  && loiMoTaBad.some((m) => /mota-bad\.csv:3 mo_ta "Loại khác" thiếu ngữ cảnh nhóm cha/.test(m))
  && loiMoTaBad.some((m) => /mota-bad\.csv:4 mo_ta lệch dấu ngoặc đơn/.test(m))
  && loiMoTaBad.some((m) => /mota-bad\.csv:5 dan_chieu "QCVN 4:2009\/BKHCN" không được ghi QCVN/.test(m))
  && kMoTaBad.loi.filter((e) => /mota-bad\.csv/.test(e.msg)).length === 4,
  JSON.stringify(loiMoTaBad));

// 6a'. Lược đồ 11 cột danh-muc/*-cas.csv (OZV-1700)
const HEAD_CAS = `${COT_CAS.join(',')}\n`;
const rCasOk = soGia({
  'cas-vb.yaml': `so_hieu: 24/2026/NĐ-CP\nloai: NGHI_DINH\nten: Danh mục hóa chất\nco_quan: CP\ntinh_trang: CON_HIEU_LUC\nnhanh: [chua-phan-loai]\n${XM}\n`,
});
mkdirSync(join(rCasOk, 'danh-muc'), { recursive: true });
const csvCasOk = HEAD_CAS
  + '106-99-0,"1,3-Butadien","1,3-Butadiene",C4H6,Hóa chất cơ bản,I,,1,https://congbao.chinhphu.vn/x,,\n'
  + ',"Diisocyanate (TDI, MDI)","Diisocyanate",,Hóa chất cơ bản,I,,12,https://congbao.chinhphu.vn/x,,\n'
  + '10037-74-3,Canxi clorat,Calcium chlorate,Ca(ClO3)2,Chất SXKD có điều kiện,II,1,135,https://congbao.chinhphu.vn/x,,\n'
  + '103-79-7,Phenylacetone,1-Phenyl-2-propanone,C9H10O,Hóa chất kiểm soát đặc biệt,III,A,,https://congbao.chinhphu.vn/x,1,\n'
  + '10118-77-6,1-Propen-2-clo-1-3-diol diacetat,2-Chloro-1-3-propanediol diacetate,C7H11ClO4,Phòng ngừa sự cố,IV,Bảng A,207,https://congbao.chinhphu.vn/x,,5000\n';
writeFileSync(join(rCasOk, 'danh-muc', '24-2026-nd-cp-cas.csv'), csvCasOk);
const kCasOk = kiemTra(napSo(rCasOk), { root: rCasOk });
t('danh-muc *-cas.csv (1): bảng hợp lệ (gồm dòng không-CAS, 4 PL I–IV và mã trong CAS_LOI_IN_NGUON_A) → 0 lỗi',
  CAS_LOI_IN_NGUON_A.has('10037-74-3') && kiemDanhMucCas('danh-muc/24-2026-nd-cp-cas.csv', csvCasOk).length === 0 && kCasOk.loi.length === 0,
  JSON.stringify(kCasOk.loi));

const rCasHeadBad = soGia({ 'cas-vb.yaml': `so_hieu: 24/2026/NĐ-CP\nloai: NGHI_DINH\nten: Danh mục hóa chất\nco_quan: CP\ntinh_trang: CON_HIEU_LUC\nnhanh: [chua-phan-loai]\n${XM}\n` });
mkdirSync(join(rCasHeadBad, 'danh-muc'), { recursive: true });
writeFileSync(join(rCasHeadBad, 'danh-muc', 'sai-head-cas.csv'), 'cas,ten_chat,cong_thuc\n106-99-0,Butadien,C4H6\n');
const kCasHeadBad = kiemTra(napSo(rCasHeadBad), { root: rCasHeadBad });
t('danh-muc *-cas.csv (2): sai header 11 cột → lỗi kiểm',
  kCasHeadBad.loi.some((e) => e.file === 'danh-muc/sai-head-cas.csv' && /dòng tiêu đề phải đúng 11 cột/.test(e.msg)),
  JSON.stringify(kCasHeadBad.loi));

const rCasModBad = soGia({ 'cas-vb.yaml': `so_hieu: 24/2026/NĐ-CP\nloai: NGHI_DINH\nten: Danh mục hóa chất\nco_quan: CP\ntinh_trang: CON_HIEU_LUC\nnhanh: [chua-phan-loai]\n${XM}\n` });
mkdirSync(join(rCasModBad, 'danh-muc'), { recursive: true });
writeFileSync(join(rCasModBad, 'danh-muc', 'sai-cas.csv'), HEAD_CAS
  + '50-00-00,Formaldehit,Formaldehyde,CH2O,Hóa chất cơ bản,I,,1,https://congbao.chinhphu.vn/x,,\n'
  + '106-99-9,Butadien sai checksum,1-3-Butadiene,C4H6,Hóa chất cơ bản,I,,2,https://congbao.chinhphu.vn/x,,\n');
const kCasModBad = kiemTra(napSo(rCasModBad), { root: rCasModBad });
t('danh-muc *-cas.csv (3): mã CAS sai định dạng hoặc sai checksum mod-10 ngoài danh sách lỗi in nguồn A → lỗi kiểm',
  kCasModBad.loi.some((e) => e.file === 'danh-muc/sai-cas.csv' && /50-00-00.*sai định dạng/.test(e.msg))
  && kCasModBad.loi.some((e) => e.file === 'danh-muc/sai-cas.csv' && /106-99-9.*sai checksum mod-10/.test(e.msg)),
  JSON.stringify(kCasModBad.loi));

const rCasToHopBad = soGia({ 'cas-vb.yaml': `so_hieu: 24/2026/NĐ-CP\nloai: NGHI_DINH\nten: Danh mục hóa chất\nco_quan: CP\ntinh_trang: CON_HIEU_LUC\nnhanh: [chua-phan-loai]\n${XM}\n` });
mkdirSync(join(rCasToHopBad, 'danh-muc'), { recursive: true });
writeFileSync(join(rCasToHopBad, 'danh-muc', 'sai-to-hop-cas.csv'), HEAD_CAS
  + '106-99-0,,1-3-Butadiene,Mục A bị trượt vào công thức,,III,1,99,ftp://sai-nguon,3,\r\n');
const kCasToHopBad = kiemTra(napSo(rCasToHopBad), { root: rCasToHopBad });
t('danh-muc *-cas.csv (4): trượt tổ hợp (phu_luc, muc, nhom), thiếu ten_chat/phan_loai/nguon, CRLF hoặc trượt cong_thuc → lỗi kiểm',
  kCasToHopBad.loi.some((e) => /thiếu ten_chat/.test(e.msg))
  && kCasToHopBad.loi.some((e) => /thiếu phan_loai/.test(e.msg))
  && kCasToHopBad.loi.some((e) => /tổ hợp \(phu_luc=III/.test(e.msg))
  && kCasToHopBad.loi.some((e) => /nguon.*http/.test(e.msg))
  && kCasToHopBad.loi.some((e) => /CRLF/.test(e.msg))
  && kCasToHopBad.loi.some((e) => /cong_thuc/.test(e.msg)),
  JSON.stringify(kCasToHopBad.loi));
const bt6 = docBieuThue(r6);
t('danh mục: đếm lá theo tiền tố 4 số', demLa(bt6, '1901') === 1200 && demLa(bt6, '190100') === 100 && demLa(bt6, '22030091') === 1 && demLa(bt6, '22029999') === 0);
const dmu6 = timDiemMu(so6, { today: '2026-10-04', root: r6, nhuCau: null });
t('điểm mù: văn bản danh mục chưa trích (KTCN 2026 → Cao)', dmu6.some((d) => d.ma === 'DANH_MUC_CHUA_TRICH' && d.muc_tieu === '51/2026/TT-BYT' && d.muc === 'Cao'));
t('điểm mù: mã HS không có trong biểu thuế', dmu6.some((d) => d.ma === 'HS_KHONG_TON_TAI' && /22029999/.test(d.tieuDe)) && !dmu6.some((d) => d.ma === 'HS_KHONG_TON_TAI' && /mã 1901 /.test(d.tieuDe)));
t('điểm mù: dẫn chiếu sang văn bản chưa có trong sổ', dmu6.some((d) => d.ma === 'DAN_CHIEU_CHUA_CO_BANG' && d.muc_tieu === '15/2024/TT-BYT'));
// 6b. phu_luc_cua — phụ lục tách riêng không tạo điểm mù giả khi mẹ đã có CSV (OZV-789)
const rPl = soGia({
  'me.yaml': `so_hieu: 60/2026/TT-BXD\nloai: THONG_TU\nten: Ban hành Danh mục sản phẩm rủi ro cao\nco_quan: BXD\nhieu_luc_tu: "2026-07-01"\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bxd]\ndanh_muc_hs: {tep: danh-muc/me.csv, nguon: "https://congbao.chinhphu.vn/x", ngay: "2026-10-04"}\n${XM}\n`,
  'pl.yaml': `so_hieu: 60-PL1/2026/TT-BXD\nloai: THONG_TU\nten: Phụ lục I — Danh mục sản phẩm rủi ro cao\nco_quan: BXD\nhieu_luc_tu: "2026-07-01"\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bxd]\nphu_luc_cua: 60/2026/TT-BXD\n${XM}\n`,
});
mkdirSync(join(rPl, 'danh-muc'), { recursive: true });
writeFileSync(join(rPl, 'danh-muc', 'me.csv'), HEAD + '87032119,Ô tô,1,Phụ lục I,KIEM_TRA_CHAT_LUONG,CAO,,,1\n');
const dmuPl = timDiemMu(napSo(rPl), { today: '2026-10-04', root: rPl, nhuCau: null });
t('phu_luc_cua: phụ lục trỏ mẹ đã có CSV → không sinh DANH_MUC_CHUA_TRICH',
  !dmuPl.some((d) => d.ma === 'DANH_MUC_CHUA_TRICH' && d.muc_tieu === '60-PL1/2026/TT-BXD'),
  JSON.stringify(dmuPl.filter((d) => d.ma === 'DANH_MUC_CHUA_TRICH')));
const rPlBad = soGia({
  'pl-bad.yaml': `so_hieu: 61-PL1/2026/TT-BXD\nloai: THONG_TU\nten: Phụ lục I — Danh mục\nco_quan: BXD\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bxd]\nphu_luc_cua: 61/2026/TT-BXD\n${XM}\n`,
});
const kPlBad = kiemTra(napSo(rPlBad), { root: rPlBad, today: '2026-10-04' });
t('phu_luc_cua: số hiệu mẹ không tồn tại → LỖI kiểm',
  kPlBad.loi.some((e) => /phu_luc_cua/.test(e.msg) && /61\/2026\/TT-BXD/.test(e.msg)),
  JSON.stringify(kPlBad.loi));
// 6b'. danh_muc_thay_boi — danh mục đã bị văn bản khác thay toàn bộ (OZV-1391, ca 13/2018/TT-BTTTT)
const rThay = soGia({
  'cu.yaml': `so_hieu: 62/2018/TT-BXD\nloai: THONG_TU\nten: Quy định Danh mục sản phẩm nhập khẩu theo giấy phép\nco_quan: BXD\nhieu_luc_tu: "2018-12-01"\ntinh_trang: HET_HIEU_LUC_MOT_PHAN\nnhanh: [kiem-tra-chuyen-nganh/bxd]\ndanh_muc_thay_boi: 62/2022/TT-BXD\n${XM}\n`,
  'moi.yaml': `so_hieu: 62/2022/TT-BXD\nloai: THONG_TU\nten: Sửa đổi Thông tư 62/2018/TT-BXD\nco_quan: BXD\nhieu_luc_tu: "2022-09-15"\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bxd]\ndanh_muc_hs: {tep: danh-muc/moi.csv, nguon: "https://congbao.chinhphu.vn/x", ngay: "2026-10-04"}\n${XM}\n`,
  'cu2.yaml': `so_hieu: 63/2018/TT-BXD\nloai: THONG_TU\nten: Quy định Danh mục sản phẩm nhập khẩu theo giấy phép\nco_quan: BXD\nhieu_luc_tu: "2018-12-01"\ntinh_trang: HET_HIEU_LUC_MOT_PHAN\nnhanh: [kiem-tra-chuyen-nganh/bxd]\ndanh_muc_thay_boi: 63/2022/TT-BXD\n${XM}\n`,
  'moi2.yaml': `so_hieu: 63/2022/TT-BXD\nloai: THONG_TU\nten: Sửa đổi Thông tư 63/2018/TT-BXD\nco_quan: BXD\nhieu_luc_tu: "2022-09-15"\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bxd]\n${XM}\n`,
});
mkdirSync(join(rThay, 'danh-muc'), { recursive: true });
writeFileSync(join(rThay, 'danh-muc', 'moi.csv'), HEAD + '87032119,Ô tô,1,Phụ lục I,KIEM_TRA_CHAT_LUONG,CAO,,,1\n');
const soThay = napSo(rThay);
const dmuThay = timDiemMu(soThay, { today: '2026-10-04', root: rThay, nhuCau: null });
t('danh_muc_thay_boi: văn bản thay ĐÃ có bảng → không sinh DANH_MUC_CHUA_TRICH',
  !dmuThay.some((d) => d.ma === 'DANH_MUC_CHUA_TRICH' && d.muc_tieu === '62/2018/TT-BXD'),
  JSON.stringify(dmuThay.filter((d) => d.ma === 'DANH_MUC_CHUA_TRICH')));
t('danh_muc_thay_boi: văn bản thay CHƯA có bảng → vẫn sinh DANH_MUC_CHUA_TRICH',
  dmuThay.some((d) => d.ma === 'DANH_MUC_CHUA_TRICH' && d.muc_tieu === '63/2018/TT-BXD'),
  JSON.stringify(dmuThay.filter((d) => d.ma === 'DANH_MUC_CHUA_TRICH')));
const kThay = kiemTra(soThay, { root: rThay, today: '2026-10-04' });
t('danh_muc_thay_boi: trường hợp lệ → không LỖI kiểm, cảnh báo khi văn bản thay chưa có bảng',
  !kThay.loi.some((e) => /danh_muc_thay_boi/.test(e.msg))
    && kThay.canhBao.some((e) => /danh_muc_thay_boi/.test(e.msg) && /63\/2022\/TT-BXD/.test(e.msg)),
  JSON.stringify({ loi: kThay.loi, canhBao: kThay.canhBao.filter((e) => /danh_muc_thay_boi/.test(e.msg)) }));
const rThayBad = soGia({
  'cu-bad.yaml': `so_hieu: 64/2018/TT-BXD\nloai: THONG_TU\nten: Quy định Danh mục sản phẩm\nco_quan: BXD\ntinh_trang: HET_HIEU_LUC_MOT_PHAN\nnhanh: [kiem-tra-chuyen-nganh/bxd]\ndanh_muc_thay_boi: 64/2022/TT-BXD\n${XM}\n`,
});
const kThayBad = kiemTra(napSo(rThayBad), { root: rThayBad, today: '2026-10-04' });
t('danh_muc_thay_boi: số hiệu văn bản thay không có trong sổ → LỖI kiểm',
  kThayBad.loi.some((e) => /danh_muc_thay_boi/.test(e.msg) && /64\/2022\/TT-BXD/.test(e.msg)),
  JSON.stringify(kThayBad.loi));
// 6b''. danh_muc_khong_ma_hs — văn bản danh mục không gắn mã HS trong bản gốc bậc A (OZV-1405)
const rKhongHs = soGia({
  'ok.yaml': `so_hieu: 28/2026/NĐ-CP\nloai: NGHI_DINH\nten: Quy định các danh mục chất ma túy và tiền chất\nco_quan: CP\nhieu_luc_tu: "2026-01-19"\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\ndanh_muc_khong_ma_hs: "Phụ lục Danh mục I–IV chỉ có cột STT, Tên chất, Tên khoa học, Mã CAS — không gắn mã HS."\nnguon: [{url: "https://vanban.chinhphu.vn/?docid=216717", truy_cap: "2026-10-20"}]\nxac_minh: {muc: NGUON_A, hieu_luc_da_doi_chieu: true, ngay: "2026-10-20"}\n`,
});
const soKhongHs = napSo(rKhongHs);
const dmuKhongHs = timDiemMu(soKhongHs, { today: '2026-10-20', root: rKhongHs, nhuCau: null });
const kKhongHs = kiemTra(soKhongHs, { root: rKhongHs, today: '2026-10-20' });
t('danh_muc_khong_ma_hs: hợp lệ NGUON_A → không sinh DANH_MUC_CHUA_TRICH và không lỗi kiểm',
  !dmuKhongHs.some((d) => d.ma === 'DANH_MUC_CHUA_TRICH' && d.muc_tieu === '28/2026/NĐ-CP')
    && kKhongHs.loi.length === 0,
  JSON.stringify({ dm: dmuKhongHs.filter((d) => d.ma === 'DANH_MUC_CHUA_TRICH'), loi: kKhongHs.loi }));
const kKhongHsChuaA = kiemTra(napSo(soGia({
  'chua-a.yaml': `so_hieu: 6266/QĐ-BCA\nloai: QUYET_DINH\nten: Ban hành Danh mục sản phẩm\nco_quan: BCA\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bca]\ndanh_muc_khong_ma_hs: "Chưa có nguồn A nhưng gắn thử"\n${XM}\n`,
})), { today: '2026-10-20' });
t('danh_muc_khong_ma_hs: khai khi chưa NGUON_A → LỖI kiểm',
  kKhongHsChuaA.loi.some((e) => /danh_muc_khong_ma_hs/.test(e.msg) && /NGUON_A/.test(e.msg)),
  JSON.stringify(kKhongHsChuaA.loi));
const rKhongHsKep = soGia({
  'kep.yaml': `so_hieu: 65/2026/TT-BXD\nloai: THONG_TU\nten: Ban hành Danh mục sản phẩm\nco_quan: BXD\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bxd]\ndanh_muc_hs: {tep: danh-muc/kep.csv, nguon: "https://congbao.chinhphu.vn/x", ngay: "2026-10-04"}\ndanh_muc_khong_ma_hs: "Khai đồng thời cả hai"\nnguon: [{url: "https://vanban.chinhphu.vn/?docid=1", truy_cap: "2026-10-20"}]\nxac_minh: {muc: NGUON_A, hieu_luc_da_doi_chieu: true, ngay: "2026-10-20"}\n`,
});
mkdirSync(join(rKhongHsKep, 'danh-muc'), { recursive: true });
writeFileSync(join(rKhongHsKep, 'danh-muc', 'kep.csv'), HEAD + '87032119,Ô tô,1,Phụ lục I,KIEM_TRA_CHAT_LUONG,CAO,,,1\n');
const kKhongHsKep = kiemTra(napSo(rKhongHsKep), { root: rKhongHsKep, today: '2026-10-20' });
t('danh_muc_khong_ma_hs: khai đồng thời với danh_muc_hs → LỖI kiểm',
  kKhongHsKep.loi.some((e) => /danh_muc_khong_ma_hs/.test(e.msg) && /danh_muc_hs/.test(e.msg)),
  JSON.stringify(kKhongHsKep.loi));
const kKhongHsRong = kiemTra(napSo(soGia({
  'rong.yaml': `so_hieu: 66/2026/TT-BXD\nloai: THONG_TU\nten: Ban hành Danh mục sản phẩm\nco_quan: BXD\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bxd]\ndanh_muc_khong_ma_hs: "   "\nnguon: [{url: "https://vanban.chinhphu.vn/?docid=1", truy_cap: "2026-10-20"}]\nxac_minh: {muc: NGUON_A, hieu_luc_da_doi_chieu: true, ngay: "2026-10-20"}\n`,
})), { today: '2026-10-20' });
t('danh_muc_khong_ma_hs: chuỗi rỗng → LỖI kiểm',
  kKhongHsRong.loi.some((e) => /danh_muc_khong_ma_hs/.test(e.msg) && /chuỗi không rỗng/.test(e.msg)),
  JSON.stringify(kKhongHsRong.loi));

// 6c. Văn bản chỉ bãi bỏ — tên có "danh mục" nhưng không có bảng riêng để trích (OZV-790)
const rBaiBo = soGia({
  'bb.yaml': `so_hieu: 4814/QĐ-BCA\nloai: QUYET_DINH\nten: Bãi bỏ Quyết định 8378/QĐ-BCA ngày 14/10/2025 về danh mục sản phẩm, hàng hóa có khả năng gây mất an toàn\nco_quan: BCA\nhieu_luc_tu: "2026-07-28"\ntinh_trang: CHUA_XAC_MINH\nnhanh: [kiem-tra-chuyen-nganh/bca]\nquan_he:\n  bai_bo:\n    - so_hieu: 8378/QĐ-BCA\n      tu_ngay: '2026-07-28'\n      can_cu: Điều 1\n${XM}\n`,
  'ban.yaml': `so_hieu: 1182/QĐ-BCT\nloai: QUYET_DINH\nten: Ban hành Danh mục hàng hóa xuất khẩu, nhập khẩu theo giấy phép\nco_quan: BCT\nhieu_luc_tu: "2021-06-01"\ntinh_trang: CON_HIEU_LUC\nnhanh: [quan-ly-ngoai-thuong/bct]\n${XM}\n`,
});
const dmuBaiBo = timDiemMu(napSo(rBaiBo), { today: '2026-10-04', root: rBaiBo, nhuCau: null });
t('điểm mù: văn bản chỉ bãi bỏ (tên có danh mục) → không sinh DANH_MUC_CHUA_TRICH',
  !dmuBaiBo.some((d) => d.ma === 'DANH_MUC_CHUA_TRICH' && d.muc_tieu === '4814/QĐ-BCA'),
  JSON.stringify(dmuBaiBo.filter((d) => d.ma === 'DANH_MUC_CHUA_TRICH')));
t('điểm mù: văn bản ban hành danh mục thật → vẫn sinh DANH_MUC_CHUA_TRICH',
  dmuBaiBo.some((d) => d.ma === 'DANH_MUC_CHUA_TRICH' && d.muc_tieu === '1182/QĐ-BCT'),
  JSON.stringify(dmuBaiBo.filter((d) => d.ma === 'DANH_MUC_CHUA_TRICH')));

const cm6 = dungChiMuc(so6, r6, '2026-10-04');
const v6 = cm6.van_ban.find((v) => v.so_hieu === '50/2026/TT-BCT');
t('hs-index: chỉ xuất bảng hợp lệ, giữ dieu_kien + dan_chieu, bỏ ô trống', cm6.van_ban.length === 1 && v6.dong.length === 4
  && v6.dong[1].dieu_kien === 'trừ loại dùng cho trẻ em' && v6.dong[3].dan_chieu === '15/2024/TT-BYT' && !('muc_rui_ro' in v6.dong[0]) && v6.tinh_trang === 'CON_HIEU_LUC');

// 7. Hàng thật (hs-code-api /api/demand): mã chưa bảng KTCN 2026 nào phủ → điểm mù; đã phủ → không
const ht = rutGonHangThat({ generatedAt: '2026-10-05T00:00:00Z', since: '2026-07-07', ktcn2026: [
  { hs: '85366932', priority: 'Cao', policyLevel: 'INFO', docs: ['42/2019/TT-BCT'], lastSeen: '2026-10-05' },
  { hs: '22030091', priority: 'Vừa', docs: [], lastSeen: '2026-10-04' },
  { hs: '8536', priority: 'Cao' }, // không đủ 8 số → bỏ
  { hs: '19012000', priority: 'X' }, // mức lạ → bỏ
] });
t('hàng thật: rút gọn giữ mã 8 số + mức hợp lệ', ht.maHs.length === 2 && ht.maHs[0].vanBanDangDan[0] === '42/2019/TT-BCT');
const dht = timDiemMu(so6, { today: '2026-10-05', root: r6, nhuCau: null, hangThat: ht }).filter((d) => d.ma === 'HANG_THAT_CHUA_DOI_CHIEU_KTCN');
t('hàng thật: mã chưa phủ → điểm mù mức Cao, hướng dẫn ghi kết luận để tự đóng', dht.some((d) => d.muc_tieu === '85366932' && d.muc === 'Cao' && /doi-chieu\/hang-that\.csv/.test(d.viec)), JSON.stringify(dht));
const ht2 = { ...ht, maHs: [...ht.maHs, { hs: '22030099', uuTien: 'Thấp', vanBanDangDan: [], gapGanNhat: '2026-10-05' }] };
const dht2 = timDiemMu(so6, { today: '2026-10-05', root: r6, nhuCau: null, hangThat: ht2, ketLuan: new Map() }).filter((d) => d.ma === 'HANG_THAT_CHUA_DOI_CHIEU_KTCN');
t('hàng thật: bảng KTCN 2026 có dòng cùng nhóm 4 số → gợi đúng bảng đó (nghi trích sót)', dht2.some((d) => d.muc_tieu === '22030099' && /50\/2026\/TT-BCT/.test(d.viec)), JSON.stringify(dht2.map((d) => d.viec)));
const dht3 = timDiemMu(so6, { today: '2026-10-05', root: r6, nhuCau: null, hangThat: ht, ketLuan: new Map([['85366932', 'KHONG_THUOC_DIEN']]) }).filter((d) => d.ma === 'HANG_THAT_CHUA_DOI_CHIEU_KTCN');
t('hàng thật: đã ghi kết luận đối chiếu → việc tự đóng', !dht3.some((d) => d.muc_tieu === '85366932'));
const htCu = timDiemMu(so6, { today: '2026-11-30', root: r6, nhuCau: null, hangThat: ht, ketLuan: new Map() });
t('hàng thật: bản chụp >14 ngày → báo cũ', htCu.some((d) => d.ma === 'HANG_THAT_CU'));
t('hàng thật: mã đã có trong bảng KTCN 2026 (22030091) → không báo', !dht.some((d) => d.muc_tieu === '22030091'));
t('không có hàng thật → không sinh việc', !timDiemMu(so6, { today: '2026-10-05', root: r6, nhuCau: null, hangThat: null }).some((d) => d.ma === 'HANG_THAT_CHUA_DOI_CHIEU_KTCN'));

// Văn bản biểu thuế XNK Tổng cục nêu (hs-code-api data/bieu-thue/van-ban-bieu-thue.json)
const rBt = soGia({
  '99-2020-nd-cp.yaml': `so_hieu: 99/2020/NĐ-CP\nloai: NĐ-CP\nten: Biểu thuế thử (cũ)\nco_quan: Chính phủ\ntinh_trang: HET_HIEU_LUC\nnhanh: [bieu-thue-xnk]\n${XM}\n`,
  '98-2026-nd-cp.yaml': `so_hieu: 98/2026/NĐ-CP\nloai: NĐ-CP\nten: Biểu thuế thử (mới)\nco_quan: Chính phủ\ntinh_trang: CON_HIEU_LUC\nnhanh: [bieu-thue-xnk]\nquan_he:\n  thay_the:\n    - so_hieu: 99/2020/NĐ-CP\n      tu_ngay: '2026-07-01'\n      can_cu: Điều 9\n  bai_bo:\n    - so_hieu: 96/2021/TT-BCT\n      tu_ngay: '2026-07-01'\n      can_cu: Điều 6 khoản 3 điểm b\n${XM}\n`,
  '96-2021-tt-bct.yaml': `so_hieu: 96/2021/TT-BCT\nloai: TT-BCT\nten: Thông tư thử (sổ ghi hết, bị bãi bỏ tường minh, đã đối chiếu nguồn A)\nco_quan: Bộ Công Thương\ntinh_trang: HET_HIEU_LUC\nhet_hieu_luc_tu: '2026-07-01'\nnhanh: [bieu-thue-xnk]\nquan_he: {}\nxac_minh: {muc: NGUON_A, hieu_luc_da_doi_chieu: true, ngay: "2026-10-01"}\n`,
  '93-2018-tt-bct.yaml': `so_hieu: 93/2018/TT-BCT\nloai: TT-BCT\nten: Thông tư thử (hết theo thời hạn biện pháp, không có văn bản thay, đã đối chiếu)\nco_quan: Bộ Công Thương\ntinh_trang: HET_HIEU_LUC\nhet_hieu_luc_tu: '2022-09-07'\nnhanh: [bieu-thue-xnk]\nquan_he: {}\nxac_minh: {muc: NGUON_A, hieu_luc_da_doi_chieu: true, ngay: "2026-10-01"}\n`,
  '97-2019-tt-bct.yaml': `so_hieu: 97/2019/TT-BCT\nloai: TT-BCT\nten: Thông tư thử (hiện hành nhưng sổ ghi hết, chưa có văn bản thay)\nco_quan: Bộ Công Thương\ntinh_trang: HET_HIEU_LUC\nnhanh: [bieu-thue-xnk]\n${XM}\n`,
});
const vbBt = rutGonVanBanBieuThue({ nguon: 'bieu-thue@2026.04.05', ngay: '2026-10-12', vanBan: [
  { soHieu: '96/2022/NĐ-CP', vaiTro: ['HIEN_HANH'], noiDung: ['Biểu thuế FTA thử'], soMaHs: 0, trongSo: false },
  { soHieu: '95/2017/NĐ-CP', vaiTro: ['BI_THAY_THE'], noiDung: ['Biểu thuế FTA thử'], soMaHs: 0 },
  { soHieu: '94/2025/NĐ-CP', vaiTro: ['CHINH_SACH_MA_HS'], noiDung: [], soMaHs: 332 },
  { soHieu: '99/2020/NĐ-CP', vaiTro: ['HIEN_HANH', 'CHINH_SACH_MA_HS'], noiDung: ['Biểu thuế thử'], soMaHs: 120 },
  { soHieu: '97/2019/TT-BCT', vaiTro: ['HIEN_HANH'], noiDung: ['Quy tắc thử'], soMaHs: 3 },
  { soHieu: '93/2018/TT-BCT', vaiTro: ['HIEN_HANH'], noiDung: ['Quy tắc thử'], soMaHs: 5 },
  { soHieu: '96/2021/TT-BCT', vaiTro: ['HIEN_HANH'], noiDung: ['Quy tắc thử'], soMaHs: 60 },
  { soHieu: '98/2026/NĐ-CP', vaiTro: ['HIEN_HANH'], noiDung: ['Biểu thuế thử'], soMaHs: 0 },
] }, 'test');
t('rutGonVanBanBieuThue: giữ số hiệu/vai trò/tên/số mã HS, bỏ tình trạng do hs-code-api đối chiếu', vbBt.vanBan.length === 8 && vbBt.bieuThue === 'bieu-thue@2026.04.05' && !('trongSo' in vbBt.vanBan[0]) && vbBt.vanBan[3].soMaHs === 120, JSON.stringify(vbBt.vanBan[0]));
const dbt = timDiemMu(napSo(rBt), { today: '2026-10-12', root: rBt, nhuCau: null, hangThat: null, vanBanBieuThue: vbBt });
const chuaCo = dbt.filter((d) => d.ma === 'BIEU_THUE_CHUA_CO');
t('biểu thuế: văn bản hiện hành sổ chưa có → BIEU_THUE_CHUA_CO mức Cao', chuaCo.some((d) => d.muc_tieu === '96/2022/NĐ-CP' && d.muc === 'Cao'), JSON.stringify(chuaCo));
t('biểu thuế: văn bản bị thay sổ chưa có → mức Vừa', chuaCo.some((d) => d.muc_tieu === '95/2017/NĐ-CP' && d.muc === 'Vừa'));
t('biểu thuế: văn bản chỉ ở cột chính sách → không lặp (đã có HS_API_CHUA_CO)', !chuaCo.some((d) => d.muc_tieu === '94/2025/NĐ-CP'));
const daHet = dbt.filter((d) => d.ma === 'BIEU_THUE_HIEN_HANH_DA_HET');
t('biểu thuế: hiện hành nhưng sổ ghi hết, đã có văn bản thay → việc nêu văn bản thay, mức Cao vì ≥50 mã HS', daHet.some((d) => d.muc_tieu === '99/2020/NĐ-CP' && d.muc === 'Cao' && /98\/2026\/NĐ-CP/.test(d.viec)), JSON.stringify(daHet));
t('biểu thuế: hiện hành nhưng sổ ghi hết, CHƯA có văn bản thay → việc ghi quan hệ thay_the', daHet.some((d) => d.muc_tieu === '97/2019/TT-BCT' && /CHƯA ghi văn bản thay/.test(d.viec)));
t('biểu thuế: bị bãi bỏ tường minh + đã đối chiếu → nêu văn bản bãi, hạ Thấp (sổ đã xong, còn lệch bên biểu)', daHet.some((d) => d.muc_tieu === '96/2021/TT-BCT' && d.muc === 'Thấp' && /bãi bỏ bởi 98\/2026\/NĐ-CP/.test(d.viec)), JSON.stringify(daHet));
t('biểu thuế: hết theo thời hạn, đã đối chiếu, không có văn bản thay → hạ Thấp, không bắt đi tìm văn bản thay', daHet.some((d) => d.muc_tieu === '93/2018/TT-BCT' && d.muc === 'Thấp' && /không có văn bản thay\/bãi trong sổ/.test(d.viec)), JSON.stringify(daHet));
t('biểu thuế: văn bản còn hiệu lực → không sinh việc BIEU_THUE', !dbt.some((d) => d.ma.startsWith('BIEU_THUE_') && d.muc_tieu === '98/2026/NĐ-CP'));
t('không có danh sách văn bản biểu thuế → không sinh việc BIEU_THUE', !timDiemMu(napSo(rBt), { today: '2026-10-12', root: rBt, nhuCau: null, hangThat: null, vanBanBieuThue: null }).some((d) => d.ma.startsWith('BIEU_THUE_')));

const sach = lamSachHtml('<html><script>x()</script><nav>menu</nav><p>Điều 1.&nbsp;Phạm vi</p><p>Điều 2</p></html>');
t('làm sạch HTML: bỏ script/menu, giữ đoạn', sach === 'Điều 1. Phạm vi\nĐiều 2', JSON.stringify(sach));

// 8. Bản chụp biểu thuế (issue #133: data/tax.json trùng byte với hs-code-api — đã chuyển sang
// nhu-cau/bieu-thue.json chụp tự động). Đảm bảo luôn có nguồn + phiên bản + đủ dòng mã HS.
const taxSnap = JSON.parse(readFileSyncSafe('nhu-cau/bieu-thue.json'));
t('bản chụp biểu thuế: tồn tại + có _comment + nguon + phien_ban + tong + ma',
  taxSnap && taxSnap.nguon && taxSnap.nguon.startsWith('https://raw.githubusercontent.com/ozvietnam/hs-code-api/')
  && typeof taxSnap.tong === 'number' && taxSnap.tong >= 10000
  && taxSnap.ma && Object.keys(taxSnap.ma).length >= 10000,
  JSON.stringify({ nguon: taxSnap?.nguon, tong: taxSnap?.tong, soMa: Object.keys(taxSnap?.ma || {}).length }));
t('bản chụp biểu thuế: không phải file cũ data/tax.json 5.7MB', !existsSyncSafe('data/tax.json'));

// 10. Tiền lệ TB-TCHQ (docs/tien-le-tb-tchq.md): tra theo mã HS và số hiệu từ dữ liệu crawl đã commit.
const tienLe8708 = execSyncNode('node tools/tien-le.mjs 8708');
t('tiền lệ: tra 8708 trả nhóm 87.08 kèm ngày từ customs.gov.vn', /Tiền lệ TB-TCHQ khớp "8708": [1-9]/.test(tienLe8708) && /87\.08/.test(tienLe8708) && /\(ngày /.test(tienLe8708), tienLe8708.slice(0, 200));
const tienLeSo = execSyncNode('node tools/tien-le.mjs 503/TB-TCHQ');
t('tiền lệ: tra theo đầu số hiệu 503/TB-TCHQ', /503\/TB-TCHQ\/2018/.test(tienLeSo));
const tienLeRong = execSyncNode('node tools/tien-le.mjs 99999999');
t('tiền lệ: mã không khớp → báo rõ không có kết quả', /Không có tiền lệ nào khớp "99999999"/.test(tienLeRong));

// 8b. Chú giải Phần + chương TT 31/2022 (danh-muc/chu-giai-chuong.json) — trích từ Công báo gốc.
const cg = JSON.parse(readFileSync(join(ROOT, 'danh-muc', 'chu-giai-chuong.json'), 'utf8'));
t('chú giải: đủ 97 chương + GIR có cả 6 quy tắc',
  cg.tong_chuong === 97 && Object.keys(cg.chuong).length === 97
  && ['QUY TẮC 1', 'QUY TẮC 6'].every((x) => cg.quy_tac_tong_quat.includes(x)) && cg.quy_tac_tong_quat.includes('SÁU QUY TẮC TỔNG QUÁT'));
t('chú giải Phần: đủ 21 Phần (I..XXI), 9 Phần có chú giải, đủ nguồn file + trang + khoảng chương',
  cg.tong_phan === 21 && cg.phan && Object.keys(cg.phan).length === 21
  && Object.values(cg.phan).every((p) => p.ten && typeof p.co_chu_giai === 'boolean' && Boolean(p.chu_giai) === p.co_chu_giai && p.chuong_tu && p.chuong_den && p.nguon_file && p.nguon_trang > 0)
  && Object.values(cg.phan).filter((p) => p.co_chu_giai).length === 9
  && cg.phan.VII.co_chu_giai && cg.phan.VII.chuong_tu === '39' && cg.phan.VII.chuong_den === '40'
  && cg.phan.VII.chu_giai.includes('xếp thành bộ') && cg.phan.VII.chu_giai.includes('Chương 49')
  && !cg.phan.III.co_chu_giai && cg.phan.III.chu_giai === '');
t('chú giải ch.87: note khung gầm + phân nhóm 8708.22 (nguồn Công báo 553+554)',
  cg.chuong['87'].chu_giai.includes('Khung gầm có động cơ') && cg.chuong['87'].chu_giai_phan_nhom.includes('8708.22')
  && cg.chuong['87'].nguon_file.includes('553-554'));
t('chú giải ch.50: chương không note vẫn có tên, chu_giai rỗng', cg.chuong['50'].ten.includes('Tơ tằm') && cg.chuong['50'].chu_giai === '');
const cgOut = execSyncNode('node tools/chu-giai.mjs 8708.22');
t('chu-giai.mjs: tra mã 8708.22 → chương 87 + dòng nhắc phân nhóm', /Chương 87/.test(cgOut) && /Dòng chú giải nhắc tới 8708\.22/.test(cgOut) && /Khung gầm/.test(cgOut));
const cg39 = execSyncNode('node tools/chu-giai.mjs 39');
const cg28 = execSyncNode('node tools/chu-giai.mjs 28');
t('chu-giai.mjs: tra ch.39 in chú giải Phần VII (2 mục) + tra ch.28 in chú giải Phần VI',
  /Chú giải Phần VII \(Chương 39–40\)/.test(cg39) && /1\. Các mặt hàng xếp thành bộ/.test(cg39) && /2\. Trừ những mặt hàng trong nhóm 39\.18/.test(cg39)
  && /Chú giải Phần VI \(Chương 28–38\)/.test(cg28) && /nhóm 28\.44 hoặc 28\.45/.test(cg28) && /nhóm 38\.27/.test(cg28));

// 8c. Đóng gói lô TB-TCHQ → format community hs-code-api (tools/dong-goi-lo-tb-tchq.mjs)
const tmpLo = mkdtempSync(join(tmpdir(), 'kb-lo-'));
const vaoLo = join(tmpLo, 'vao.json');
const raLo = join(tmpLo, 'ra.json');
const bcLo = join(tmpLo, 'bc.md');
writeFileSync(vaoLo, JSON.stringify({
  kind: 'precedent', contributor: { name: 'test', github: 'ozvietnam' }, license: 'CC-BY-SA-4.0',
  submittedAt: '2026-10-10T00:00:00Z', note: 'fixture',
  records: [
    { so_hieu: '9999/TB-TCHQ/2020', nam: 2020, ma_hs: '85366932',
      ten_hang: 'Đầu nối điện thoại Connector 12P dùng cho bo mạch điện thoại di động, hàng mới 100%', mo_ta: '',
      reasonVi: 'thuộc nhóm 85.36 “Thiết bị điện để đóng ngắt mạch điện”, mã số 8536.69.32 “- - Loại khác” tại Danh mục hàng hóa xuất khẩu, nhập khẩu Việt Nam.',
      noi_dung: 'BỘ TÀI CHÍNH\nSố: 9999/TB-TCHQ\nHà Nội, ngày 15 tháng 5 năm 2020\nVỀ KẾT QUẢ PHÂN LOẠI\nKết quả phân loại: thuộc nhóm 85.36, mã số 8536.69.32 ./.' },
    { so_hieu: '8888/TB-TCHQ/2021', nam: 2021, ma_hs: '39269099',
      ten_hang: 'Sản phẩm nhựa kỹ thuật dùng trong máy công nghiệp, kích thước 100x200mm', mo_ta: '',
      reasonVi: 'thuộc nhóm 39.26 “Sản phẩm khác bằng plastic”, mã số 3926.90.99 “- - Loại khác” tại Danh mục hàng hóa xuất khẩu, nhập khẩu Việt Nam.',
      noi_dung: 'Số: 8888/TB-TCHQ\nVĂN BẢN KHÔNG GHI NGÀY KÝ.' },
    { so_hieu: '7777/TB-TCHQ/2019', nam: 2019, ma_hs: '39269099',
      ten_hang: 'Tấm nhựa kỹ thuật dùng trong máy công nghiệp, kích thước 100x200mm', mo_ta: '',
      reasonVi: 'thuộc nhóm 39.26',
      noi_dung: 'Số: 7777/TB-TCHQ\nHà Nội, ngày 10 tháng 3 năm 2019\n(không có câu kết luận rõ trong toàn văn).' },
    { so_hieu: '6666/TB-TCHQ/2019', nam: 2019, ma_hs: '38249999',
      ten_hang: '', mo_ta: '',
      reasonVi: 'thuộc nhóm 38.24 “Chất gắn đã điều chỉnh dùng cho các loại khuôn đúc hoặc lõi đúc; các sản phẩm và chế phẩm hóa học của ngành công nghiệp hóa chất hoặc các ngành công nghiệp có liên quan”, mã số 3824.99.99 “- - - - Loại khác” tại Danh mục hàng hóa xuất khẩu, nhập khẩu Việt Nam.',
      noi_dung: 'Số: 6666/TB-TCHQ\nHà Nội, ngày 15 tháng 3 năm 2019\nĐÍNH CHÍNH THÔNG BÁO KẾT QUẢ PHÂN LOẠI\nNội dung đã ban hành | Nội dung đính chính\nThông báo số 1234/TB-TCHQ ngày 06/03/2019\nthuộc nhóm 34.02 “Chất gắn đã điều chỉnh dùng cho các loại khuôn đúc hoặc lõi đúc; các sản phẩm và chế phẩm hóa học của ngành công nghiệp hóa chất hoặc các ngành công nghiệp có liên quan (kể cả các sản phẩm và chế phẩm chứa hỗn hợp các sản phẩm tự nhiên).”\nthuộc nhóm 38.24 “Chất gắn đã điều chỉnh dùng cho các loại khuôn đúc hoặc lõi đúc”, mã số 3824.99.99 tại Danh mục hàng hóa xuất khẩu, nhập khẩu Việt Nam.' },
    { so_hieu: '5555/TB-TCHQ/2024', nam: 2024, ma_hs: '39119000',
      ten_hang: '1000HNX hardener; Chất làm cứng', mo_ta: '',
      reasonVi: 'thuộc nhóm 39.11 “Polymere acrylique, dạng sơ cấp”, phân nhóm 3911.90 “- Loại khác”, mã số 3911.90.00 “- - Loại khác” tại Danh mục hàng hóa xuất khẩu, nhập khẩu Việt Nam.',
      noi_dung: 'Số: 5555/TB-TCHQ\nHà Nội, ngày 15 tháng 3 năm 2024\nVỀ KẾT QUẢ XÁC ĐỊNH TRƯỚC MÃ SỐ\nTổng cục Hải quan thông báo:\nHàng hóa đề nghị xác định trước mã số do tổ chức cung cấp:\nTên thương mại: 1000HNX hardener\nTên gọi theo cấu tạo, công dụng: Chất làm cứng\nTóm tắt mô tả hàng hóa: Thành phần, cấu tạo, công thức hóa học, hàm lượng tính trên trọng lượng: Hexamethylene diisocyanate homopolymer: 96% - 100%\nCông dụng theo thiết kế:\nPha trực tiếp vào mực in để giúp mực in bám chắc hơn trên quần áo, nhãn mác, vải vóc\nKết quả xác định trước mã số: thuộc nhóm 39.11 ... mã số 3911.90.00 tại Danh mục hàng hóa xuất khẩu, nhập khẩu Việt Nam.' },
  ],
}), 'utf8');
execSyncNode(`node tools/dong-goi-lo-tb-tchq.mjs --vao "${vaoLo}" --ra "${raLo}" --bao-cao "${bcLo}"`);
const lo = JSON.parse(readFileSync(raLo, 'utf8'));
t('lô TB-TCHQ: gói đúng envelope + 3 bản ghi đạt (evidence + bieuThue + loaiTB + url + description sạch)',
  lo.kind === 'precedent' && lo.contributor.name === 'test' && lo.license === 'CC-BY-SA-4.0' && lo.records.length === 3
  && lo.records[0].hsCode === '85366932' && lo.records[0].evidence.soHieu === '9999/TB-TCHQ'
  && lo.records[0].evidence.ketLuan.includes('8536.69.32') && lo.records[0].attributes.bieuThue === '2017'
  && lo.records[0].attributes.loaiTB === 'KET_QUA_PHAN_LOAI'
  && /tracuuhs\.com\/tin-tuc\/tchq-9999-2020/.test(lo.records[0].source.url)
  && lo.records[0].description.startsWith('Đầu nối điện thoại'), JSON.stringify(lo.records[0]).slice(0, 240));
const đc = lo.records.find((x) => x.hsCode === '38249999');
t('lô TB-TCHQ: đính chính → loaiTB DINH_CHINH + mã cũ vào confusedWith + mô tả từ văn bản',
  đc && đc.attributes.loaiTB === 'DINH_CHINH' && (đc.confusedWith || []).includes('3402')
  && !(đc.confusedWith || []).includes('38249999') && /Đính chính Thông báo 1234\/TB-TCHQ/.test(đc.description),
  JSON.stringify(đc && { loaiTB: đc.attributes.loaiTB, cw: đc.confusedWith, desc: đc.description.slice(0, 60) }));
const fg = lo.records.find((x) => x.hsCode === '39119000');
t('lô TB-TCHQ: mô tả từ "Công dụng theo thiết kế" khi tên hàng < 40 ký tự và có "công thức hóa học" trong Tóm tắt',
  fg && /Pha trực tiếp vào mực in/.test(fg.description),
  JSON.stringify(fg && { desc: fg.description.slice(0, 60) }));
const bcLoNd = readFileSync(bcLo, 'utf8');
t('lô TB-TCHQ: thiếu ngày ký / lý do mỏng vào "cần xử tay", KHÔNG nhồi lô',
  lo.records.length === 3 && /8888\/TB-TCHQ/.test(bcLoNd) && /7777\/TB-TCHQ/.test(bcLoNd) && /ngày ký/.test(bcLoNd) && /mỏng/.test(bcLoNd));

// 8c2. Phân loại nghiệp vụ TB-TCHQ (sổ loai_phan_loai)
t('loai_phan_loai: xác định trước từ tiêu đề',
  phanLoaiTbTchq('Số: 1/TB-TCHQ\nVỀ KẾT QUẢ XÁC ĐỊNH TRƯỚC MÃ SỐ\nCăn cứ', '').ma === 'XAC_DINH_TRUOC');
t('loai_phan_loai: kết quả phân loại → KIEM_TRA_XAC_DINH_LAI (proxy) + can_cu trung thực',
  (() => { const r = phanLoaiTbTchq('Số: 2/TB-TCHQ\nVỀ KẾT QUẢ PHÂN LOẠI ĐỐI VỚI HÀNG HÓA XUẤT KHẨU, NHẬP KHẨU\nCăn cứ', 'Phân loại hàng hóa'); return r.ma === 'KIEM_TRA_XAC_DINH_LAI' && r.can_cu === 'proxy_ket_qua_phan_loai_title'; })());
t('loai_phan_loai: đính chính từ tiêu đề',
  phanLoaiTbTchq('Số: 3/TB-TCHQ\nĐÍNH CHÍNH THÔNG BÁO KẾT QUẢ PHÂN LOẠI\nNội dung', '').ma === 'DINH_CHINH');
t('loai_phan_loai: thiếu toàn văn → CHUA_XAC_DINH',
  phanLoaiTbTchq('', '').ma === 'CHUA_XAC_DINH' && phanLoaiTbTchq('', '').can_cu === 'chua_co_toan_van');
t('loai_phan_loai: tuLoaiTB map KET_QUA_PHAN_LOAI → KIEM_TRA_XAC_DINH_LAI',
  tuLoaiTB('KET_QUA_PHAN_LOAI') === 'KIEM_TRA_XAC_DINH_LAI');

// 8d. Hàng đợi chia gói TB-TCHQ (tools/chia-goi-tb-tchq.mjs → data/customs/lo/hang-doi-tb-tchq.json)
const hd = JSON.parse(readFileSync(join(ROOT, 'data/customs/lo/hang-doi-tb-tchq.json'), 'utf8'));
const detDone = new Set(JSON.parse(readFileSync(join(ROOT, 'data/customs/processed/tracuuhs-detail-2026-10-10.json'), 'utf8')).records.map((r) => r.so_hieu));
const tbGoi = hd.goi.flatMap((g) => g.tb.map((x) => x.so_hieu));
t('hàng đợi TB-TCHQ: 2043 TB / 103 gói — không trùng đã-xong, không trùng lẫn nhau',
  hd.thong_ke.con_lai === 2043 && hd.goi.length === 103 && tbGoi.length === 2043
  && new Set(tbGoi).size === 2043 && !tbGoi.some((x) => detDone.has(x)),
  JSON.stringify({ con_lai: hd.thong_ke.con_lai, so_goi: hd.goi.length, tb: tbGoi.length }));
t('hàng đợi TB-TCHQ: mỗi gói 1..20 TB, id goi-NNN, url đúng theo số hiệu',
  hd.goi.every((g) => g.so_luong === g.tb.length && g.tb.length >= 1 && g.tb.length <= 20 && /^goi-\d{3}$/.test(g.id))
  && hd.goi.every((g) => g.tb.every((x) => {
    const m = String(x.so_hieu).match(/^(\d+)\/TB-TCHQ\/(\d{4})$/);
    return m && x.url === `https://www.tracuuhs.com/tin-tuc/tchq-${m[1]}-${m[2]}`;
  })));
t('hàng đợi TB-TCHQ: 15 mục xử lý tay kèm nguồn',
  hd.xu_ly_tay.length === 15 && hd.xu_ly_tay.every((x) => x.nguon && x.muc), `n=${hd.xu_ly_tay.length}`);

// 8e. Đối chiếu hàng đợi TB-TCHQ với kho tiền lệ (luật CEO 14/10: xem kho trước khi cào)
const { chuanSoHieu, banDoKho, xepHangGoi } = await import('../doi-chieu-kho-tb-tchq.mjs');
t('đối chiếu kho: chuẩn hoá số hiệu bỏ năm + số 0 đầu',
  chuanSoHieu('1005/TB-TCHQ/2025') === '1005/TB-TCHQ' && chuanSoHieu('08/TB-TCHQ') === '8/TB-TCHQ' && chuanSoHieu('16238/TB-CHQ') === '16238/TB-CHQ');
const khoGia = { '14049099': [
  { tbTchqNumber: '503/TB-TCHQ', technicalSpec: 'x'.repeat(200) },
  { tbTchqNumber: '1005/TB-TCHQ', technicalSpec: 'ngắn' },
] };
const hdGia = { goi: [
  { id: 'goi-001', tieu_de: 'Ch.02', so_luong: 2, tb: [{ so_hieu: '503/TB-TCHQ/2018' }, { so_hieu: '1005/TB-TCHQ/2025' }] },
  { id: 'goi-002', tieu_de: 'Ch.03', so_luong: 2, tb: [{ so_hieu: '999/TB-TCHQ/2019' }, { so_hieu: '08/TB-TCHQ/2020' }] },
  { id: 'goi-003', tieu_de: 'Ch.04', so_luong: 1, tb: [{ so_hieu: '777/TB-TCHQ/2021' }] },
] };
const xpGia = xepHangGoi(hdGia, banDoKho(khoGia));
t('đối chiếu kho: xếp gói theo chưa-có giảm dần, đếm đúng bản mỏng',
  xpGia[0].id === 'goi-002' && xpGia[0].chua_co === 2 && xpGia[1].id === 'goi-003' && xpGia[2].chua_co === 0 && xpGia[2].mong_co === 1,
  JSON.stringify(xpGia.map((g) => ({ id: g.id, chua: g.chua_co, mong: g.mong_co }))));
const uuTien = JSON.parse(readFileSync(join(ROOT, 'data/customs/lo/hang-doi-uu-tien.json'), 'utf8'));
t('đối chiếu kho: bảng ưu tiên đã commit — tổng khớp và xếp giảm dần',
  uuTien.goi.length === 103
  && uuTien.goi.every((g) => g.chua_co + g.da_co === g.so_luong)
  && uuTien.goi.every((g, i, a) => i === 0 || a[i - 1].chua_co >= g.chua_co)
  && uuTien.tong_tb_chua_co === uuTien.goi.reduce((n, g) => n + g.chua_co, 0),
  JSON.stringify({ n: uuTien.goi.length, tong: uuTien.tong_tb_chua_co }));

// 9. Phiên bản lược đồ (docs/yeu-cau/ozplugin.md W1): hai tệp dist đều có luoc_do_phien_ban, khớp semver, bằng nhau.
const semverOk = (s) => /^\d+\.\d+\.\d+$/.test(s);
t('lược đồ: dungJson + dungChiMuc gắn luoc_do_phien_ban từ một hằng số chung',
  dungJson(napSo(r6)).luoc_do_phien_ban === LUOC_DO_PHIEN_BAN && dungChiMuc(napSo(r6), r6, '2026-10-13').luoc_do_phien_ban === LUOC_DO_PHIEN_BAN);
const tmpDist = mkdtempSync(join(tmpdir(), 'kb-dist-'));
writeFileSync(join(tmpDist, 'registry.json'), JSON.stringify(dungJson(napSo(r6))));
writeFileSync(join(tmpDist, 'hs-index.json'), JSON.stringify(dungChiMuc(napSo(r6), r6, '2026-10-13')));
const regDist = JSON.parse(readFileSync(join(tmpDist, 'registry.json'), 'utf8'));
const hsDist = JSON.parse(readFileSync(join(tmpDist, 'hs-index.json'), 'utf8'));
const cmTheoMa = dungChiMucTheoMa(cm6);
const traMa = Object.entries(cmTheoMa.ma).filter(([k]) => '22030091'.startsWith(k) || k === '22030091').flatMap(([, v]) => v);
t('hs-index-theo-ma: đảo chiều — mã 22030091 tra ra 50/2026/TT-BCT kèm KIEM_TRA_ATTP',
  cmTheoMa.ma['22030091']?.[0]?.so_hieu === '50/2026/TT-BCT' && cmTheoMa.ma['22030091']?.[0]?.loai_tac_dong === 'KIEM_TRA_ATTP' && traMa.length >= 1 && cmTheoMa.cach_tra.includes('tiền tố'), JSON.stringify(Object.keys(cmTheoMa.ma)));
t('hs-index-theo-ma: cạnh không mang trường mã (chỉ ở khoá) — không trùng lặp',
  !('ma_hs' in (cmTheoMa.ma['22030091']?.[0] || {})) && cmTheoMa.tong_nhom_ma >= 1);
const cmMaV2 = dungChiMucTheoMa(cm6, {
  bt: docBieuThue(r6),
  tienLe8: { '22030091': { so_luong: 2, mau: '1/TB-TCHQ/2026', ngay: '2026-01-01' } },
  tienLe4: { '1901': 3 },
});
t('hs-index-theo-ma v2: cảnh báo đúng nhóm ngoài biểu thuế (22029999), không cảnh báo mã còn',
  cmMaV2.canh_bao_ma.includes('22029999') && !cmMaV2.canh_bao_ma.includes('22030091') && cmMaV2.bieu_thue_doi_chieu.nhom_ngoai_bieu_thue >= 1,
  JSON.stringify(cmMaV2.canh_bao_ma));
t('hs-index-theo-ma v2: gắn mật độ tiền lệ TB-TCHQ theo mã 8 số và nhóm 4 số',
  cmMaV2.tien_le_tb_tchq.theo_ma_8['22030091'].so_luong === 2 && cmMaV2.tien_le_tb_tchq.theo_nhom_4['1901'] === 3);
const cmTrung = { phien_ban: '2026-10-13', luoc_do_phien_ban: LUOC_DO_PHIEN_BAN, giay_phep: 'x', van_ban: [{ so_hieu: 'X/2026/TT-T', slug: 'x', ten: 't', tinh_trang: 'CON_HIEU_LUC', hieu_luc_tu: null, het_hieu_luc_tu: null, hieu_luc_da_doi_chieu: false, dong: [{ ma_hs: '1111', loai_tac_dong: 'GIAY_PHEP' }, { ma_hs: '1111', loai_tac_dong: 'GIAY_PHEP' }, { ma_hs: '1111', loai_tac_dong: 'GIAY_PHEP', muc_rui_ro: 'CAO' }] }] };
const cmTrungMa = dungChiMucTheoMa(cmTrung);
t('hs-index-theo-ma v2: gộp cạnh trùng toàn trường, giữ cạnh khác mức rủi ro',
  cmTrungMa.ma['1111'].length === 2 && cmTrungMa.tong_canh === 2, JSON.stringify(cmTrungMa.ma['1111'].length));
t('lược đồ: hai tệp máy có luoc_do_phien_ban khớp semver và bằng nhau',
  semverOk(regDist.luoc_do_phien_ban) && semverOk(hsDist.luoc_do_phien_ban) && regDist.luoc_do_phien_ban === hsDist.luoc_do_phien_ban,
  JSON.stringify({ reg: regDist.luoc_do_phien_ban, hs: hsDist.luoc_do_phien_ban }));

function readFileSyncSafe(p) { try { return readFileSync(join(ROOT, p), 'utf8'); } catch { return null; } }
function execSyncNode(cmd) { return execSync(cmd, { cwd: ROOT, encoding: 'utf8' }); }
function existsSyncSafe(p) { try { return existsSync(join(ROOT, p)); } catch { return false; } }

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
