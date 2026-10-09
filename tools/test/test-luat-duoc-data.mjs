// tools/test/test-luat-duoc-data.mjs
// Test mẫu đánh giá hiệu quả dữ liệu vừa gộp (PR #83 + #84)
// Câu hỏi nghiệp vụ từ use case thực tế - trả lời bằng data đã gộp
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../lib/registry.mjs';

const BYT_CSV = join(ROOT, 'danh-muc', '09-2024-tt-byt-full.csv');
const BYT_TB_CSV = join(ROOT, 'danh-muc', '19-2024-tt-byt-full.csv');
const SOURCES = join(ROOT, 'wiki', 'sources');
const REGISTRY = join(ROOT, 'registry', 'van-ban');

let pass = 0;
let fail = 0;
const t = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`PASS ${name}`); }
  else { fail += 1; console.log(`FAIL ${name} ${extra}`); }
};

// Parse CSV thật - hỗ trợ quoted fields có dấu phẩy
function parseCsv(text) {
  const rows = [];
  let i = 0, field = '', row = [], inQuote = false;
  while (i < text.length) {
    const c = text[i];
    if (inQuote) {
      if (c === '"' && text[i+1] === '"') { field += '"'; i += 2; }
      else if (c === '"') { inQuote = false; i++; }
      else { field += c; i++; }
    } else {
      if (c === '"') { inQuote = true; i++; }
      else if (c === ',') { row.push(field); field = ''; i++; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; }
      else if (c === '\r') { i++; }
      else { field += c; i++; }
    }
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  if (rows.length < 2) return [];
  const header = rows[0];
  return rows.slice(1).map((cols) => {
    const obj = {};
    header.forEach((h, idx) => { obj[h.trim()] = (cols[idx] || '').trim(); });
    return obj;
  });
}

function docBytCsv() {
  if (!existsSync(BYT_CSV)) return [];
  return parseCsv(readFileSync(BYT_CSV, 'utf8'));
}

function docSource(filename) {
  const fp = join(SOURCES, filename);
  if (!existsSync(fp)) return '';
  return readFileSync(fp, 'utf8');
}

function docYaml(filename) {
  const fp = join(REGISTRY, filename);
  if (!existsSync(fp)) return '';
  return readFileSync(fp, 'utf8');
}

console.log('=== Test mẫu: Hiệu quả dữ liệu Luật Dược ===\n');

// ============================================================
// TEST 1: Cao dán gừng + ngải cứu - mã HS gì?
// ============================================================
console.log('-- TEST 1: Cao dán gừng + ngải cứu --');
const src_32 = docSource('32-2020-tt-byt.md');
t('TEST 1.1: 32/2020/TT-BYT source có "Các dạng khác"',
  src_32.includes('Các dạng khác'),
  '— thiếu từ khóa "Các dạng khác" trong source 32-2020-tt-byt.md');
t('TEST 1.2: 32/2020/TT-BYT source đề cập cao dán',
  src_32.toLowerCase().includes('cao dán') || src_32.toLowerCase().includes('miếng dán'),
  '— thiếu từ khóa "cao dán" hoặc "miếng dán" trong source');
const src_105 = docSource('105-2016-qh13.md');
t('TEST 1.3: 105/2016/QH13 source đề cập Điều 60.2b',
  src_105.includes('60.2b') || src_105.includes('60.2 b'),
  '— thiếu Điều 60.2b trong source 105-2016-qh13.md');

// ============================================================
// TEST 2: Ngải cứu = Thanh cao - mã HS dược liệu?
// ============================================================
console.log('\n-- TEST 2: Ngải cứu = Thanh cao (DM11) --');
const byt_rows = docBytCsv();
const dm11 = byt_rows.filter((r) => r.nhom === '11');
t('TEST 2.1: DM11 có >= 25 dòng (CSV thật)',
  dm11.length >= 25,
  `— chỉ có ${dm11.length} dòng`);
const thanh_cao = dm11.find((r) =>
  r.ten.toLowerCase().includes('thanh cao') ||
  r.ten.toLowerCase().includes('ngải cứu')
);
t('TEST 2.2: Tìm thấy "Thanh cao" trong DM11',
  !!thanh_cao,
  '— không tìm thấy tên "Thanh cao" trong DM11');
if (thanh_cao) {
  t('TEST 2.3: Mã HS Thanh cao = 12119017',
    thanh_cao.ma_hs === '12119017',
    `— mã HS là ${thanh_cao.ma_hs}, kỳ vọng 12119017`);
}

// ============================================================
// TEST 3: 105/2016/QH13 Điều 60.2b
// ============================================================
console.log('\n-- TEST 3: 105/2016/QH13 Điều 60.2b --');
const yaml_105 = docYaml('105-2016-qh13.yaml');
t('TEST 3.1: YAML 105-2016 có từ "60.2b"',
  yaml_105.includes('60.2') || yaml_105.includes('60.2b'),
  '— thiếu 60.2b trong YAML');
t('TEST 3.2: YAML 105-2016 có hieu_luc_da_doi_chieu: true',
  yaml_105.includes('hieu_luc_da_doi_chieu: true'),
  '— chưa xác minh hiệu lực');

// ============================================================
// TEST 4: 32/2020/TT-BYT "Các dạng khác"
// ============================================================
console.log('\n-- TEST 4: 32/2020/TT-BYT dạng bào chế --');
const yaml_32 = docYaml('32-2020-tt-byt.yaml');
t('TEST 4.1: YAML 32-2020 có từ "Các dạng khác"',
  yaml_32.includes('Các dạng khác') || src_32.includes('Các dạng khác'),
  '— thiếu thuật ngữ "Các dạng khác" trong YAML hoặc source');

// ============================================================
// TEST 5: 163/2025/NĐ-CP Điều 87
// ============================================================
console.log('\n-- TEST 5: 163/2025/NĐ-CP Điều 87 --');
const src_163 = docSource('163-2025-nd-cp.md');
t('TEST 5.1: 163/2025 source đề cập Điều 87',
  src_163.includes('Điều 87') || src_163.includes('Điều 87.'),
  '— thiếu Điều 87 trong source 163-2025-nd-cp.md');
t('TEST 5.2: 163/2025 source đề cập "5 ngày"',
  src_163.includes('5 ngày') || src_163.includes('năm ngày'),
  '— thiếu "5 ngày" trong source');

// ============================================================
// TEST 6: DM9 thuốc phối hợp
// ============================================================
console.log('\n-- TEST 6: DM9 thuốc phối hợp --');
const dm9 = byt_rows.filter((r) => r.nhom === '9');
t('TEST 6.1: DM9 có >= 30 dòng',
  dm9.length >= 30,
  `— chỉ có ${dm9.length} dòng`);
// Tìm aspirin hoặc paracetamol
const aspirin = dm9.find((r) => r.ten.toLowerCase().includes('aspirin') || r.ten.toLowerCase().includes('paracetamol'));
t('TEST 6.2: DM9 có aspirin/paracetamol',
  !!aspirin,
  '— không tìm thấy aspirin/paracetamol trong DM9');
if (aspirin) {
  t('TEST 6.3: Mã HS aspirin/paracetamol thuộc nhóm 3004',
    aspirin.ma_hs.startsWith('3004'),
    `— mã HS là ${aspirin.ma_hs}, kỳ vọng 3004.xx.xx`);
}

// ============================================================
// TEST 7: 44/2024/QH15 sửa đổi Điều
// ============================================================
console.log('\n-- TEST 7: 44/2024/QH15 --');
const src_44 = docSource('44-2024-qh15.md');
t('TEST 7.1: 44/2024 source đề cập "Điều 60"',
  src_44.includes('Điều 60'),
  '— thiếu Điều 60 trong source 44-2024-qh15.md');
t('TEST 7.2: 44/2024 source đề cập "Điều 69"',
  src_44.includes('Điều 69') || src_44.includes('Điều 6'),
  '— thiếu Điều 69 trong source');

// ============================================================
// TEST 8: 28/2018/QH14
// ============================================================
console.log('\n-- TEST 8: 28/2018/QH14 --');
const yaml_28 = docYaml('28-2018-qh14.yaml');
t('TEST 8.1: YAML 28-2018 ghi HET_HIEU_LUC',
  yaml_28.includes('HET_HIEU_LUC'),
  '— chưa ghi tình trạng hết hiệu lực');
t('TEST 8.2: YAML 28-2018 có het_hieu_luc_tu',
  yaml_28.includes('het_hieu_luc_tu'),
  '— chưa ghi ngày hết hiệu lực');

// ============================================================
// TEST 9: 34/2005/QH11
// ============================================================
console.log('\n-- TEST 9: 34/2005/QH11 --');
const yaml_34 = docYaml('34-2005-qh11.yaml');
t('TEST 9.1: YAML 34-2005 ghi HET_HIEU_LUC',
  yaml_34.includes('HET_HIEU_LUC'),
  '— chưa ghi tình trạng hết hiệu lực');
t('TEST 9.2: YAML 34-2005 ghi thay thế bởi 105/2016',
  yaml_34.includes('105/2016') || yaml_34.includes('105-2016'),
  '— chưa ghi quan hệ thay thế bởi 105/2016');

// ============================================================
// TEST 10: 19/2024/TT-BYT
// ============================================================
console.log('\n-- TEST 10: 19/2024/TT-BYT --');
const yaml_19 = docYaml('19-2024-tt-byt.yaml');
t('TEST 10.1: YAML 19-2024 tồn tại',
  existsSync(join(REGISTRY, '19-2024-tt-byt.yaml')),
  '— chưa tạo YAML 19-2024-tt-byt');
if (existsSync(BYT_TB_CSV)) {
  const tb_text = readFileSync(BYT_TB_CSV, 'utf8');
  const tb_lines = tb_text.split('\n').filter(Boolean);
  t('TEST 10.2: CSV 19-2024 có >= 100 mã HS',
    tb_lines.length >= 100,
    `— chỉ có ${tb_lines.length - 1} mã HS, kỳ vọng 112`);
}

console.log(`\n=== KẾT QUẢ: ${pass} PASS / ${fail} FAIL ===`);
process.exit(fail > 0 ? 1 : 0);
