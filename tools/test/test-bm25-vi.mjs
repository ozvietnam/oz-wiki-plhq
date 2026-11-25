// Kiểm thử đơn vị + tích hợp bộ xếp hạng Okapi BM25, 2-lane hiệu lực, ưu tiên thay thế & cổng OOS (Wave 27).
import assert from 'node:assert/strict';
import { ROOT } from '../lib/registry.mjs';
import {
  tachTokenBm25,
  taoChiMucBm25,
  chuanBiTruyVanBm25,
  truyVanBm25,
} from '../lib/bm25-vi.mjs';
import { taoKhoTraCuu, hoiPhapLuat } from '../lib/tra-cuu-plhq.mjs';

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

// 1. tachTokenBm25 lọc stopword/năm 2026 nhưng giữ thuật ngữ và mã 4 số không phải năm
const tok = tachTokenBm25('Thủ tục năm 2026 đối với gia công mã 3808 và ngày 14/08/2026');
check(
  'tachTokenBm25 giữ unigram/bigram nghĩa, giữ mã 3808, bỏ 2026 & số 1-2 chữ số',
  tok.unigrams.includes('gia')
  && tok.unigrams.includes('cong')
  && tok.unigrams.includes('3808')
  && !tok.unigrams.includes('2026')
  && !tok.unigrams.includes('14')
  && tok.bigrams.includes('bg:gia_cong')
  && tok.accBigrams.includes('abg:thủ_tục'),
  JSON.stringify(tok),
);

// 2. Okapi BM25 phân biệt trọng số trường, IDF hiếm và bigram có dấu ("gia công" vs "giá công")
const mockDocs = [
  { id: 'd1', tieuDe: 'Hợp đồng gia công xuất khẩu', muc: 'Định mức', noiDung: 'Nguyên liệu nhập khẩu để gia công hàng xuất khẩu được miễn thuế.' },
  { id: 'd2', tieuDe: 'Xác định trị giá công trình', muc: 'Trị giá', noiDung: 'Tính giá công lắp đặt phần mềm và dịch vụ sau bán hàng.' },
  { id: 'd3', tieuDe: 'Văn bản chung', muc: 'Chung', noiDung: Array(30).fill('quy định xuất khẩu nhập khẩu chung').join(' ') },
];
const idx = taoChiMucBm25(mockDocs);
const qSpecGc = chuanBiTruyVanBm25(idx, 'nguyên liệu nhập khẩu gia công xuất khẩu');
const resGc = truyVanBm25(idx, qSpecGc);
check(
  'BM25 xếp tài liệu khớp đúng ngữ nghĩa + tiêu đề ("gia công") cao hơn ("giá công" & tài liệu dài)',
  (resGc.get(0)?.score || 0) > (resGc.get(1)?.score || 0)
  && (resGc.get(0)?.score || 0) > (resGc.get(2)?.score || 0)
  && resGc.get(0)?.idfCov === 1,
  JSON.stringify([resGc.get(0)?.score, resGc.get(1)?.score, resGc.get(2)?.score]),
);

// 3. Tích hợp kho thật: OOS Gate + Replacement Ranking + 2-lane
const store = await taoKhoTraCuu({ root: ROOT });

const rOos1 = hoiPhapLuat(store, 'Thủ tục ly hôn đơn phương và chia tài sản chung vợ chồng theo luật hiện hành', { limit: 5 });
const rOos2 = hoiPhapLuat(store, 'Thủ tục nhập khẩu đũa thần phép thuật sao Hỏa', { limit: 5 });
check(
  'OOS Gate: từ chối câu hỏi ngoài phạm vi XNK (KHONG_TIM_THAY, ngoai_pham_vi=true, không mở thẻ bổ sung sổ)',
  rOos1.do_tin_cay_tra_loi === 'KHONG_TIM_THAY'
  && rOos1.ngoai_pham_vi === true
  && rOos1.ket_qua.length === 0
  && rOos1.goi_y_du_phong?.can_mo_the_bo_sung_so === false
  && rOos2.do_tin_cay_tra_loi === 'KHONG_TIM_THAY'
  && rOos2.ngoai_pham_vi === true,
  JSON.stringify({ rOos1: rOos1.do_tin_cay_tra_loi, rOos2: rOos2.do_tin_cay_tra_loi }),
);

const rOld = hoiPhapLuat(store, 'Phân loại hàng hóa xuất nhập khẩu theo Thông tư 14/2015/TT-BTC hiện áp dụng thế nào?', { limit: 5 });
check(
  'Bẫy văn bản cũ: đẩy văn bản thay thế CON_HIEU_LUC lên #1 và không báo thiếu toàn văn cho VB đã bị thay thế',
  rOld.van_ban_lien_quan?.[0]?.tinh_trang !== 'HET_HIEU_LUC'
  && rOld.van_ban_lien_quan?.[0]?.so_hieu !== '14/2015/TT-BTC'
  && rOld.van_ban_lien_quan.some((v) => v.so_hieu === '85/2026/TT-BTC')
  && rOld.goi_y_du_phong?.can_mo_the_bo_sung_so !== true,
  JSON.stringify({ top1: rOld.van_ban_lien_quan?.[0], goi_y: rOld.goi_y_du_phong }),
);

const r2Lane = hoiPhapLuat(store, 'Thủ tục kiểm tra, giám sát hải quan đối với hàng hóa xuất nhập khẩu tại cửa khẩu', { limit: 5 });
check(
  '2-Lane: trả về đồng thời mảng ket_qua (hiện hành) và mảng sap_co_hieu_luc (CHUA_CO_HIEU_LUC tách riêng)',
  Array.isArray(r2Lane.ket_qua)
  && r2Lane.ket_qua.length > 0
  && Array.isArray(r2Lane.sap_co_hieu_luc)
  && r2Lane.van_ban_lien_quan?.[0]?.tinh_trang !== 'HET_HIEU_LUC',
  JSON.stringify({ kq: r2Lane.ket_qua.length, sap: r2Lane.sap_co_hieu_luc?.length }),
);

assert.equal(fail, 0, `Có ${fail} kiểm thử thất bại`);
console.log(`\nHoàn tất test-bm25-vi: ${pass} đạt, ${fail} lỗi.`);
