// Kiểm thử Wave 28: Tra cứu hiệu lực & lịch sử sửa đổi tại một ngày cụ thể (--tai-ngay YYYY-MM-DD).
import { ROOT } from '../lib/registry.mjs';
import {
  chuanHoaTaiNgay,
  tinhTinhTrangTaiNgay,
  locLichSuDieuTaiNgay,
} from '../lib/hieu-luc-theo-ngay.mjs';
import {
  taoKhoTraCuu,
  traHieuLuc,
  traDieuKhoan,
  hoiPhapLuat,
  traChinhSachTheoMaHs,
} from '../lib/tra-cuu-plhq.mjs';
import { taoMayChuMcp } from '../mcp-server.mjs';
import { chayCli } from '../tra-cuu.mjs';

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

// 1. Unit: chuanHoaTaiNgay
check(
  'chuanHoaTaiNgay chấp nhận rỗng / hợp lệ và chặn ngày lịch không tồn tại',
  chuanHoaTaiNgay(undefined).hopLe && chuanHoaTaiNgay(undefined).giaTri === null
  && chuanHoaTaiNgay('').giaTri === null
  && chuanHoaTaiNgay('2026-11-25').giaTri === '2026-11-25'
  && !chuanHoaTaiNgay('25/11/2026').hopLe
  && !chuanHoaTaiNgay('2026-02-30').hopLe
  && !chuanHoaTaiNgay('2026-13-01').hopLe,
);

// 2. Unit: locLichSuDieuTaiNgay
const sampleLichSu = [
  { loai: 'SUA_DOI', tu_van_ban: '39/2018/TT-BTC', tu_ngay: '2018-06-05' },
  { loai: 'SUA_DOI', tu_van_ban: '121/2025/TT-BTC', tu_ngay: '2026-02-01' },
  { loai: 'BAI_BO', tu_van_ban: '86/2026/TT-BTC', tu_ngay: '2026-07-01', khoan_dich: null },
];
const ls2024 = locLichSuDieuTaiNgay(sampleLichSu, '2024-06-01');
const ls2026Feb = locLichSuDieuTaiNgay(sampleLichSu, '2026-02-15');
const ls2026Nov = locLichSuDieuTaiNgay(sampleLichSu, '2026-11-25');
check(
  'locLichSuDieuTaiNgay lọc đúng theo mốc 2024 / 2026-02 / 2026-11',
  ls2024.lich_su_tac_dong.length === 1 && ls2024.trang_thai_dieu === 'DA_SUA_DOI'
  && ls2026Feb.lich_su_tac_dong.length === 2 && ls2026Feb.trang_thai_dieu === 'DA_SUA_DOI'
  && ls2026Nov.lich_su_tac_dong.length === 3 && ls2026Nov.trang_thai_dieu === 'DA_BAI_BO',
  JSON.stringify({ ls2024, ls2026Feb, ls2026Nov }),
);

// 3. Unit: tinhTinhTrangTaiNgay cho TAM_NGUNG_HIEU_LUC & THIEU_NGAY_HIEU_LUC
const docMissingEnd = { so_hieu: 'TEST/MISSING', tinh_trang: 'HET_HIEU_LUC', hieu_luc_tu: '2010-01-01', het_hieu_luc_tu: null };
const docTamNgung = {
  so_hieu: 'TEST/PAUSE',
  tinh_trang: 'TAM_NGUNG_HIEU_LUC',
  hieu_luc_tu: '2024-01-01',
  quan_he_nguoc: { bi_tam_ngung_boi: [{ tu: 'X', tu_ngay: '2026-06-01' }] },
};
check(
  'tinhTinhTrangTaiNgay trung thực khi thiếu het_hieu_luc_tu và xử lý đúng ngày tạm ngưng',
  tinhTinhTrangTaiNgay(docMissingEnd, '2015-01-01').do_chinh_xac_ngay === 'THIEU_NGAY_HIEU_LUC'
  && tinhTinhTrangTaiNgay(docTamNgung, '2026-05-01').tinh_trang_tai_ngay === 'CON_HIEU_LUC'
  && tinhTinhTrangTaiNgay(docTamNgung, '2026-06-01').tinh_trang_tai_ngay === 'TAM_NGUNG_HIEU_LUC',
);

// 4. Integration trên kho thật
const store = await taoKhoTraCuu({ root: ROOT });

// 4a. 14/2015/TT-BTC vs 85/2026/TT-BTC
const hl14_2024 = traHieuLuc(store, '14/2015/TT-BTC', { tai_ngay: '2024-06-01' });
const hl14_2026 = traHieuLuc(store, '14/2015/TT-BTC', { tai_ngay: '2026-11-25' });
const hl85_2024 = traHieuLuc(store, '85/2026/TT-BTC', { tai_ngay: '2024-06-01' });
const hl85_2026 = traHieuLuc(store, '85/2026/TT-BTC', { tai_ngay: '2026-11-25' });
check(
  'traHieuLuc phân biệt 14/2015/TT-BTC & 85/2026/TT-BTC giữa 2024-06-01 và 2026-11-25',
  hl14_2024.tim_thay && hl14_2024.tinh_trang_tai_ngay === 'CON_HIEU_LUC'
  && hl14_2026.tim_thay && hl14_2026.tinh_trang_tai_ngay === 'HET_HIEU_LUC'
  && hl85_2024.tim_thay && hl85_2024.tinh_trang_tai_ngay === 'CHUA_CO_HIEU_LUC'
  && hl85_2026.tim_thay && hl85_2026.tinh_trang_tai_ngay === 'CON_HIEU_LUC',
  JSON.stringify({
    hl14_2024: hl14_2024.tinh_trang_tai_ngay,
    hl14_2026: hl14_2026.tinh_trang_tai_ngay,
    hl85_2024: hl85_2024.tinh_trang_tai_ngay,
    hl85_2026: hl85_2026.tinh_trang_tai_ngay,
  }),
);

// 4b. Luật Hải quan 54/2014/QH13 vs 11/2026/QH16 (hiệu lực từ 2027-03-01)
const hl11_2027Jan = traHieuLuc(store, '11/2026/QH16', { tai_ngay: '2027-01-02' });
const hl11_2027Mar = traHieuLuc(store, '11/2026/QH16', { tai_ngay: '2027-03-05' });
check(
  'traHieuLuc 11/2026/QH16 chuyển từ CHUA_CO_HIEU_LUC (2027-01-02) sang CON_HIEU_LUC (2027-03-05)',
  hl11_2027Jan.tinh_trang_tai_ngay === 'CHUA_CO_HIEU_LUC'
  && hl11_2027Mar.tinh_trang_tai_ngay === 'CON_HIEU_LUC',
  JSON.stringify({ jan: hl11_2027Jan.tinh_trang_tai_ngay, mar: hl11_2027Mar.tinh_trang_tai_ngay }),
);

// 4c. 02/2010/QĐ-TTg thiếu het_hieu_luc_tu phải báo THIEU_NGAY_HIEU_LUC
const hl02 = traHieuLuc(store, '02/2010/QĐ-TTg', { tai_ngay: '2024-06-01' });
check(
  'traHieuLuc 02/2010/QĐ-TTg báo THIEU_NGAY_HIEU_LUC khi thiếu het_hieu_luc_tu',
  hl02.tim_thay && hl02.do_chinh_xac_ngay === 'THIEU_NGAY_HIEU_LUC',
  JSON.stringify({ tinh_trang: hl02.tinh_trang_tai_ngay, acc: hl02.do_chinh_xac_ngay }),
);

// 4d. 38/2015/TT-BTC Điều 22 & Điều 104 theo tai_ngay
const dk22_2024 = traDieuKhoan(store, { so_hieu: '38/2015/TT-BTC', dieu: 22, chi_nguyen_van: true, tai_ngay: '2024-06-01' });
const dk22_2026 = traDieuKhoan(store, { so_hieu: '38/2015/TT-BTC', dieu: 22, chi_nguyen_van: true, tai_ngay: '2026-11-25' });
const ls22_2024 = dk22_2024.nguyen_van_nguon_a[0]?.lich_su_tac_dong || [];
const ls22_2026 = dk22_2026.nguyen_van_nguon_a[0]?.lich_su_tac_dong || [];
check(
  'traDieuKhoan 38/2015/TT-BTC Điều 22 lọc lịch sử sửa đổi đúng theo tai_ngay',
  dk22_2024.tai_ngay === '2024-06-01'
  && ls22_2024.some((e) => e.van_ban_nguon === '39/2018/TT-BTC')
  && !ls22_2024.some((e) => e.van_ban_nguon === '121/2025/TT-BTC')
  && ls22_2026.some((e) => e.van_ban_nguon === '39/2018/TT-BTC')
  && ls22_2026.some((e) => e.van_ban_nguon === '121/2025/TT-BTC'),
  JSON.stringify({ n2024: ls22_2024.map((x) => x.van_ban_nguon), n2026: ls22_2026.map((x) => x.van_ban_nguon) }),
);

const dk104_2024 = traDieuKhoan(store, { so_hieu: '38/2015/TT-BTC', dieu: 104, chi_nguyen_van: true, tai_ngay: '2024-06-01' });
const dk104_2026 = traDieuKhoan(store, { so_hieu: '38/2015/TT-BTC', dieu: 104, chi_nguyen_van: true, tai_ngay: '2026-11-25' });
check(
  'traDieuKhoan 38/2015/TT-BTC Điều 104 chưa bị bãi bỏ tại 2024-06-01 và DA_BAI_BO tại 2026-11-25',
  dk104_2024.nguyen_van_nguon_a[0]?.trang_thai_dieu !== 'DA_BAI_BO'
  && dk104_2026.nguyen_van_nguon_a[0]?.trang_thai_dieu === 'DA_BAI_BO',
  JSON.stringify({ s2024: dk104_2024.nguyen_van_nguon_a[0]?.trang_thai_dieu, s2026: dk104_2026.nguyen_van_nguon_a[0]?.trang_thai_dieu }),
);

// 4e. traDieuKhoan 08/2023/TT-BCT tại 2026-11-25 vs 2027-01-02 (het_hieu_luc_tu 2026-12-31)
const hl08_2026 = traHieuLuc(store, '08/2023/TT-BCT', { tai_ngay: '2026-11-25' });
const hl08_2027 = traHieuLuc(store, '08/2023/TT-BCT', { tai_ngay: '2027-01-02' });
check(
  'traHieuLuc 08/2023/TT-BCT chuyển sang HET_HIEU_LUC từ 2027-01-02',
  hl08_2026.tinh_trang_tai_ngay !== 'HET_HIEU_LUC' && hl08_2027.tinh_trang_tai_ngay === 'HET_HIEU_LUC',
  JSON.stringify({ d2026: hl08_2026.tinh_trang_tai_ngay, d2027: hl08_2027.tinh_trang_tai_ngay }),
);

// 4f. hoiPhapLuat & traChinhSachTheoMaHs với tai_ngay
const hoi2024 = hoiPhapLuat(store, 'phân loại hàng hóa xuất nhập khẩu', { tai_ngay: '2024-06-01', limit: 5 });
const ref14_2024 = hoi2024.van_ban_lien_quan.find((v) => v.so_hieu === '14/2015/TT-BTC');
const ref85_2024 = hoi2024.van_ban_lien_quan.find((v) => v.so_hieu === '85/2026/TT-BTC');
check(
  'hoiPhapLuat với tai_ngay=2024-06-01 gắn đúng tình trạng 14/2015 & 85/2026',
  hoi2024.tai_ngay === '2024-06-01'
  && (!ref14_2024 || ref14_2024.tinh_trang === 'CON_HIEU_LUC')
  && (!ref85_2024 || ref85_2024.tinh_trang === 'CHUA_CO_HIEU_LUC'),
  JSON.stringify({ ref14_2024, ref85_2024 }),
);

const cs2024 = traChinhSachTheoMaHs(store, '3808', { tai_ngay: '2024-06-01', limit: 10 });
const csBad = traChinhSachTheoMaHs(store, '3808', { tai_ngay: '2026-02-30' });
check(
  'traChinhSachTheoMaHs hỗ trợ tai_ngay và chặn ngày lịch không hợp lệ',
  cs2024.tai_ngay === '2024-06-01'
  && cs2024.ket_qua.every((item) => Boolean(item.tinh_trang_tai_ngay))
  && Boolean(csBad.loi),
  JSON.stringify({ tai_ngay: cs2024.tai_ngay, first: cs2024.ket_qua[0]?.tinh_trang_tai_ngay, loi: csBad.loi }),
);

// 5. MCP server hỗ trợ tai_ngay & từ chối ngày sai
const srv = taoMayChuMcp({ store });
const toolsResp = await srv.xuLyYeuCau({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} });
const toolMap = new Map((toolsResp.result?.tools || []).map((t) => [t.name, t]));
check(
  'MCP tools schema công bố tham số tai_ngay cho 4 công cụ',
  ['plhq_tra_hieu_luc', 'plhq_tra_dieu_khoan', 'plhq_hoi_phap_luat', 'plhq_chinh_sach_theo_hs']
    .every((n) => Boolean(toolMap.get(n)?.inputSchema?.properties?.tai_ngay)),
);

const mcpOk = await srv.xuLyYeuCau({
  jsonrpc: '2.0',
  id: 2,
  method: 'tools/call',
  params: { name: 'plhq_tra_hieu_luc', arguments: { so_hieu: '14/2015/TT-BTC', tai_ngay: '2024-06-01' } },
});
const mcpBad = await srv.xuLyYeuCau({
  jsonrpc: '2.0',
  id: 3,
  method: 'tools/call',
  params: { name: 'plhq_tra_hieu_luc', arguments: { so_hieu: '14/2015/TT-BTC', tai_ngay: '2026-02-30' } },
});
check(
  'MCP plhq_tra_hieu_luc xử lý tai_ngay hợp lệ và trả isError cho ngày sai',
  !mcpOk.result?.isError
  && mcpOk.result?.structuredContent?.tinh_trang_tai_ngay === 'CON_HIEU_LUC'
  && mcpBad.result?.isError === true,
);

// 6. CLI --tai-ngay
let stdoutBuf = '';
const origWrite = process.stdout.write.bind(process.stdout);
process.stdout.write = (chunk) => {
  stdoutBuf += String(chunk);
  return true;
};
let cliCodeOk = -1;
let cliCodeBad = -1;
try {
  cliCodeOk = await chayCli(['hieu-luc', '14/2015/TT-BTC', '--tai-ngay', '2024-06-01', '--json', '--root', ROOT]);
  cliCodeBad = await chayCli(['hieu-luc', '14/2015/TT-BTC', '--tai-ngay', '2026-02-30', '--json', '--root', ROOT]);
} finally {
  process.stdout.write = origWrite;
}
check(
  'CLI --tai-ngay chạy đúng với ngày hợp lệ và trả mã lỗi 1 với ngày sai',
  cliCodeOk === 0 && stdoutBuf.includes('"tinh_trang_tai_ngay": "CON_HIEU_LUC"') && cliCodeBad === 1,
  JSON.stringify({ cliCodeOk, cliCodeBad }),
);

console.log(`\nKết quả test-hieu-luc-theo-ngay: PASS=${pass}, FAIL=${fail}`);
if (fail > 0) process.exit(1);
