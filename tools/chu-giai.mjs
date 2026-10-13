#!/usr/bin/env node
// Tra Chú giải chương / Chú giải phân nhóm — Danh mục hàng hóa XK-NK Việt Nam (TT 31/2022/TT-BTC).
//   node tools/chu-giai.mjs 87         — chú giải chương 87 + chú giải phân nhóm
//   node tools/chu-giai.mjs 8708.22    — dẫn về chương 87, in chú giải, đánh dấu dòng nhắc mã
//   node tools/chu-giai.mjs --quy-tac  — Sáu quy tắc tổng quát (GIR) + chú giải
// Dữ liệu: danh-muc/chu-giai-chuong.json (trích từ Công báo gốc bằng tools/trich-chu-giai.mjs).
// Lưu ý pháp lý: bản gốc Công báo có giá trị áp dụng; tệp này là bản tra cứu do kho trích lại.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const d = JSON.parse(readFileSync(join(ROOT, 'danh-muc', 'chu-giai-chuong.json'), 'utf8'));
const arg = process.argv[2];

if (!arg || arg === '-h' || arg === '--help') {
  console.log('Dùng: node tools/chu-giai.mjs <số chương hoặc mã HS> | --quy-tac');
  console.log('Vd:   node tools/chu-giai.mjs 87   ·   node tools/chu-giai.mjs 8708.22');
  process.exit(0);
}

if (arg === '--quy-tac' || arg === '--gir') {
  console.log('# SÁU QUY TẮC TỔNG QUÁT (GIR) — ' + (d.quy_tac_nguon || ''));
  console.log(d.quy_tac_tong_quat);
  process.exit(0);
}

const sạch = arg.replace(/[^\d]/g, '');
if (!sạch || sạch.length < 1) { console.error('Cần số chương (1-97) hoặc mã HS.'); process.exit(2); }
const soChuong = sạch.length <= 2 ? String(Number(sạch)).padStart(2, '0') : sạch.slice(0, 2);
const c = d.chuong[soChuong];
if (!c) { console.error(`Không có chương ${soChuong} trong tệp (1-97).`); process.exit(2); }

const mãTra = sạch.length > 2 ? sạch : null;
console.log(`# Chương ${soChuong} — ${c.ten.replace(/\n/g, ' ')}`);
console.log(`# Nguồn: TT 31/2022/TT-BTC — ${c.nguon_file}, trang ${c.nguon_trang}`);
if (mãTra) {
  const khớp = (dòng) => {
    const gọnDòng = dòng.replace(/\./g, '');
    const gọnMã = mãTra;
    // so khớp mã hoặc nhóm 4 số đầu của mã
    return gọnDòng.includes(gọnMã) || (gọnMã.length >= 6 && gọnDòng.includes(gọnMã.slice(0, 4)));
  };
  const nhắc = [...(c.chu_giai + '\n' + c.chu_giai_phan_nhom).split('\n')].filter(khớp);
  if (nhắc.length) {
    console.log(`\n## Dòng chú giải nhắc tới ${arg}`);
    nhắc.forEach((l) => console.log('  · ' + l.trim()));
  } else {
    console.log(`\n## Chú giải chương không nhắc trực tiếp ${arg} (tra thêm GIR bằng --quy-tac)`);
  }
}
console.log('\n## Chú giải chương');
console.log(c.chu_giai ? c.chu_giai : '(chương này không có chú giải chương — nguồn không in note)');
if (c.chu_giai_phan_nhom) {
  console.log('\n## Chú giải phân nhóm');
  console.log(c.chu_giai_phan_nhom);
}
console.log('\n(Ghi chú: bản này trích bản tiếng Việt in trong Công báo; bản gốc có giá trị pháp lý. Thứ tự ưu tiên tra cứu theo TT 85/2026/TT-BTC Điều 6.1.)');
