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
import { docCsv, napDanhMuc, kiemDinhDang, dungChiMuc, dungChiMucTheoMa, demLa, docBieuThue } from '../lib/danh-muc.mjs';

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
});
const dmVbhn = timDiemMu(napSo(rVbhn), { today: '2026-10-04', root: rVbhn });
const vbhn = (ma, muc_tieu) => dmVbhn.find((d) => d.ma === ma && d.muc_tieu === muc_tieu);
t('điểm mù: bị sửa 3 lần chưa VBHN → báo Vừa', vbhn('THIEU_VBHN', '20/2026/TT-BCT')?.muc === 'Vừa');
t('điểm mù: bị sửa 5 lần chưa VBHN → báo Cao', vbhn('THIEU_VBHN', '50/2026/TT-BCT')?.muc === 'Cao');
t('điểm mù: bị sửa 3 lần có VBHN → không báo', !vbhn('THIEU_VBHN', '60/2026/TT-BCT'));
t('điểm mù: bị sửa 1 lần → không báo', !vbhn('THIEU_VBHN', '70/2026/TT-BCT'));


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
const kChanBad = kiemTra(napSo(soGia({
  'bad.yaml': `so_hieu: 1/2026/TT-BCT\nloai: THONG_TU\nten: Chan sai\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh/bct]\nxac_minh: {muc: CHUA_XAC_MINH, hieu_luc_da_doi_chieu: false, ngay: "2026-10-04", chan: {ma: SAI_MA, ngay: "2026-10-04", viec_tiep: "x"}}\n`,
})), { today: '2026-10-04' });
t('chan: ma không hợp lệ → lỗi kiểm', kChanBad.loi.some((e) => /chan\.ma/.test(e.msg)));
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
const bt6 = docBieuThue(r6);
t('danh mục: đếm lá theo tiền tố 4 số', demLa(bt6, '1901') === 1200 && demLa(bt6, '190100') === 100 && demLa(bt6, '22030091') === 1 && demLa(bt6, '22029999') === 0);
const dmu6 = timDiemMu(so6, { today: '2026-10-04', root: r6, nhuCau: null });
t('điểm mù: văn bản danh mục chưa trích (KTCN 2026 → Cao)', dmu6.some((d) => d.ma === 'DANH_MUC_CHUA_TRICH' && d.muc_tieu === '51/2026/TT-BYT' && d.muc === 'Cao'));
t('điểm mù: mã HS không có trong biểu thuế', dmu6.some((d) => d.ma === 'HS_KHONG_TON_TAI' && /22029999/.test(d.tieuDe)) && !dmu6.some((d) => d.ma === 'HS_KHONG_TON_TAI' && /mã 1901 /.test(d.tieuDe)));
t('điểm mù: dẫn chiếu sang văn bản chưa có trong sổ', dmu6.some((d) => d.ma === 'DAN_CHIEU_CHUA_CO_BANG' && d.muc_tieu === '15/2024/TT-BYT'));
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

// 8b. Chú giải chương TT 31/2022 (danh-muc/chu-giai-chuong.json) — trích từ Công báo gốc.
const cg = JSON.parse(readFileSync(join(ROOT, 'danh-muc', 'chu-giai-chuong.json'), 'utf8'));
t('chú giải: đủ 97 chương + GIR có cả 6 quy tắc',
  cg.tong_chuong === 97 && Object.keys(cg.chuong).length === 97
  && ['QUY TẮC 1', 'QUY TẮC 6'].every((x) => cg.quy_tac_tong_quat.includes(x)) && cg.quy_tac_tong_quat.includes('SÁU QUY TẮC TỔNG QUÁT'));
t('chú giải ch.87: note khung gầm + phân nhóm 8708.22 (nguồn Công báo 553+554)',
  cg.chuong['87'].chu_giai.includes('Khung gầm có động cơ') && cg.chuong['87'].chu_giai_phan_nhom.includes('8708.22')
  && cg.chuong['87'].nguon_file.includes('553-554'));
t('chú giải ch.50: chương không note vẫn có tên, chu_giai rỗng', cg.chuong['50'].ten.includes('Tơ tằm') && cg.chuong['50'].chu_giai === '');
const cgOut = execSyncNode('node tools/chu-giai.mjs 8708.22');
t('chu-giai.mjs: tra mã 8708.22 → chương 87 + dòng nhắc phân nhóm', /Chương 87/.test(cgOut) && /Dòng chú giải nhắc tới 8708\.22/.test(cgOut) && /Khung gầm/.test(cgOut));

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
