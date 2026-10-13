#!/usr/bin/env node
// Tra tiền lệ phân loại hàng hoá của Tổng cục Hải quan (TB-TCHQ) từ dữ liệu đã crawl — không gọi mạng.
//   node tools/tien-le.mjs 8708            — mọi thông báo có nhóm HS khớp tiền tố 4/6/8 số
//   node tools/tien-le.mjs 02.06           — chấp nhận cả mã có dấu chấm
//   node tools/tien-le.mjs 503/TB-TCHQ     — tra theo đầu số hiệu thông báo
// Nguồn dữ liệu (bậc C — đầu mối; TB-TCHQ tự nó là văn bản cá biệt của cơ quan hải quan):
//   data/customs/processed/tracuuhs-ket-qua-phan-loai-*.json  — tracuuhs.com/ket-qua-phan-loai (nhóm HS ↔ TB)
//   data/customs/processed/all-1990-2026.csv                  — customs.gov.vn: số hiệu, ngày, link PDF
// Kết quả của TB-TCHQ chỉ mang tính tham khảo cho từng lô hàng — không thay thế phân loại theo TT 85/2026/TT-BTC.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const THU_MUC = 'data/customs/processed';
const chuanHoa = (s) => String(s || '').replace(/\./g, '').toUpperCase().trim();

function napTienLe() {
  const f = readdirSync(THU_MUC).filter((x) => /^tracuuhs-ket-qua-phan-loai-.*\.json$/.test(x)).sort().pop();
  if (!f) throw new Error(`Không tìm thấy tracuuhs-ket-qua-phan-loai-*.json trong ${THU_MUC}/ — chạy crawler trước.`);
  return JSON.parse(readFileSync(join(THU_MUC, f), 'utf8'));
}

// Tách dòng CSV có ô chứa dấu phẩy bọc trong ngoặc kép.
function tachCsv(dong) {
  const o = [];
  let cur = ''; let trongNgoac = false;
  for (let i = 0; i < dong.length; i++) {
    const c = dong[i];
    if (trongNgoac) {
      if (c === '"' && dong[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') trongNgoac = false; else cur += c;
    } else if (c === '"') trongNgoac = true;
    else if (c === ',') { o.push(cur); cur = ''; } else cur += c;
  }
  o.push(cur);
  return o;
}

function napMaster() {
  const f = join(THU_MUC, 'all-1990-2026.csv');
  const dong = readFileSync(f, 'utf8').split('\n');
  const dau = tachCsv(dong[0]).map((x) => x.trim());
  const iSo = dau.indexOf('so_hieu'); const iNgay = dau.indexOf('ngay_ban_hanh'); const iPdf = dau.indexOf('pdf_url_primary');
  const map = new Map();
  const ghi = (k, v) => { if (k && !map.has(k)) map.set(k, v); };
  for (let i = 1; i < dong.length; i++) {
    const o = tachCsv(dong[i]);
    if (!o[iSo]) continue;
    const v = {
      ngay: o[iNgay] || null,
      // Dữ liệu crawl đôi khi lặp tiền tố host ("https://files.customs.gov.vnhttps://…") — bỏ bản lặp.
      pdf: (/^https?:\/\//.test(o[iPdf] || '') ? o[iPdf] : null)?.replace(/^(https?:\/\/[^/]+)?(https?:\/\/.{6,})$/, '$2') || null,
    };
    ghi(o[iSo], v);
    // customs.gov.vn ghi không kèm năm ("4168/TB-TCHQ") còn tracuuhs kèm ("4168/TB-TCHQ/2019") — đánh chỉ mục cả hai dạng.
    ghi(String(o[iSo]).replace(/\/20\d\d$/, ''), v);
  }
  return map;
}

const args = process.argv.slice(2);
if (!args.length) {
  console.log('Dùng: node tools/tien-le.mjs <mã HS 4/6/8 số hoặc đầu số hiệu TB> — vd: 8708, 02.06, 503/TB-TCHQ');
  process.exit(0);
}
const q = args[0];
const tienLe = napTienLe();
const master = napMaster();

const ketQua = q.includes('/') || /TB/i.test(q)
  ? tienLe.filter((x) => x.so_hieu.toUpperCase().includes(q.toUpperCase()))
  : tienLe.filter((x) => {
    const ma = chuanHoa(x.nhom_hs);
    const m = chuanHoa(q);
    return ma === m || ma.startsWith(m);
  }).sort((a, b) => String(b.so_hieu).localeCompare(String(a.so_hieu)));

if (!ketQua.length) { console.log(`Không có tiền lệ nào khớp "${q}" trong ${tienLe.length} thông báo đã crawl.`); process.exit(0); }

console.log(`Tiền lệ TB-TCHQ khớp "${q}": ${ketQua.length}/${tienLe.length} (nguồn tracuuhs.com, crawl trong ${THU_MUC}/ — bậc C, tham khảo)`);
for (const x of ketQua.slice(0, 30)) {
  const m = master.get(x.so_hieu) || master.get(String(x.so_hieu).replace(/\/20\d\d$/, ''));
  console.log(`\n- ${x.so_hieu}${m?.ngay ? ` (ngày ${m.ngay})` : ''} — nhóm HS ${x.nhom_hs}`);
  if (x.ten_hang_rieng) console.log(`  Hàng: ${String(x.ten_hang_rieng).slice(0, 140)}`);
  if (m?.pdf) console.log(`  PDF: ${m.pdf}`);
}
if (ketQua.length > 30) console.log(`\n… và ${ketQua.length - 30} mục nữa — thu hẹp bằng mã dài hơn hoặc số hiệu.`);
