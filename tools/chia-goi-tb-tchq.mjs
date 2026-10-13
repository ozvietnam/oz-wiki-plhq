#!/usr/bin/env node
// Chia hàng đợi TB-TCHQ (tracuuhs) thành từng gói nhỏ để nhiều agent nhận việc mà không tranh nhau.
//   node tools/chia-goi-tb-tchq.mjs [--cuc-bo 20] [--json <ra.json>] [--md <ra.md>]
// Đầu vào:  data/customs/processed/tracuuhs-ket-qua-phan-loai-*.json  (index 2.304 TB)
//           data/customs/processed/tracuuhs-detail-*.json             (đã mở chi tiết — loại khỏi hàng đợi)
//           data/customs/lo/BAO-CAO-lot-*.md                          (danh sách "cần xử tay" của các lô)
// Đầu ra:   data/customs/lo/hang-doi-tb-tchq.json + .md
//
// Quy tắc chia (cố định — chạy lại cho ĐỢT SAU, không đè đợt đang mở):
//   - Sort theo nhóm HS rồi số hiệu → gói cụm cùng chương (agent học ngữ cảnh 1 chương).
//   - Cắt 20 TB/gói theo thứ tự; ID goi-001.. theo đúng thứ tự đó.
//   - Số hiệu đã mở chi tiết (mọi tệp tracuuhs-detail-*) bị loại khỏi hàng đợi.
//   - Mỗi gói liệt kê sẵn: số hiệu, nhóm HS, URL trang chi tiết — agent không phải tự suy.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const arg = (ten, mac) => { const i = args.indexOf(ten); return i >= 0 ? args[i + 1] : mac; };
const CO_GOI = Number(arg('--cuc-bo', '20'));
const RA_JSON = arg('--json', 'data/customs/lo/hang-doi-tb-tchq.json');
const RA_MD = arg('--md', 'data/customs/lo/hang-doi-tb-tchq.md');

const DIR = join('data', 'customs', 'processed');
const tệpTheo = (re) => readdirSync(DIR).filter((f) => re.test(f)).sort();

// 1. Index + đã-làm
const tệpIndex = tệpTheo(/^tracuuhs-ket-qua-phan-loai-.*\.json$/).pop();
const index = JSON.parse(readFileSync(join(DIR, tệpIndex), 'utf8'));
const tệpDetail = tệpTheo(/^tracuuhs-detail-.*\.json$/);
const đãXong = new Set();
for (const f of tệpDetail) {
  for (const r of JSON.parse(readFileSync(join(DIR, f), 'utf8')).records || []) đãXong.add(r.so_hieu);
}

// 2. Hàng đợi còn lại, sort theo nhóm HS (cụm chương) rồi số hiệu
const tách = (soHieu) => {
  const m = String(soHieu).match(/^(\d+)\/([A-Z-]+)\/(\d{4})$/);
  return m ? { num: m[1], numSố: Number(m[1]), loai: m[2], nam: Number(m[3]) } : null;
};
const còn = index
  .filter((x) => !đãXong.has(x.so_hieu) && tách(x.so_hieu))
  .map((x) => {
    const t = tách(x.so_hieu);
    const nhomGọn = String(x.nhom_hs).replace('.', '').padEnd(6, '0');
    return {
      so_hieu: x.so_hieu,
      nhom_hs: x.nhom_hs,
      url: `https://www.tracuuhs.com/tin-tuc/tchq-${t.num}-${t.nam}`,
      _k: `${nhomGọn}|${String(t.numSố).padStart(6, '0')}|${t.nam}`,
    };
  })
  .sort((a, b) => (a._k < b._k ? -1 : a._k > b._k ? 1 : 0))
  .map(({ _k, ...x }) => x);

// 3. Cắt gói
const gói = [];
for (let i = 0; i < còn.length; i += CO_GOI) {
  const tb = còn.slice(i, i + CO_GOI);
  const chương = [...new Set(tb.map((x) => String(x.nhom_hs).slice(0, 2)))].sort();
  gói.push({
    id: `goi-${String(gói.length + 1).padStart(3, '0')}`,
    tieu_de: `Ch.${chương.join('·')}`,
    so_luong: tb.length,
    tb,
  });
}

// 4. "Cần xử tay" từ các báo cáo lô (mục ## Cần xử tay)
const xửTay = [];
for (const f of readdirSync(join('data', 'customs', 'lo')).filter((x) => /^BAO-CAO-lot-.*\.md$/.test(x)).sort()) {
  const dòng = readFileSync(join('data', 'customs', 'lo', f), 'utf8').split('\n');
  let trong = false;
  for (const l of dòng) {
    if (/^## Cần xử tay/.test(l)) { trong = true; continue; }
    if (trong && /^## /.test(l)) break;
    if (trong && /^- /.test(l)) xửTay.push({ nguon: f, muc: l.replace(/^- /, '').trim() });
  }
}

// 5. Ghi JSON + MD
const TỔNG = index.length;
const ngay = new Date().toISOString().slice(0, 10);
const json = {
  _comment: 'Hàng đợi TB-TCHQ (tracuuhs) chia gói cố định để agent nhận việc không tranh nhau. Sinh bằng tools/chia-goi-tb-tchq.mjs. Trạng thái nhận/gói xong ghi ở issue theo dõi (comment "nhận goi-NNN"), KHÔNG sửa tệp này.',
  ngay_chia: ngay,
  nguon: { index: join(DIR, tệpIndex), detail_da_mo: tệpDetail.map((f) => join(DIR, f)), xlt: 'data/customs/lo/BAO-CAO-lot-*.md' },
  thong_ke: { index: TỔNG, da_xong: đãXong.size, con_lai: còn.length, so_goi: gói.length, muc_xu_ly_tay: xửTay.length },
  goi: gói,
  xu_ly_tay: xửTay,
};
writeFileSync(RA_JSON, JSON.stringify(json, null, 1) + '\n');

const md = [
  `# Hàng đợi TB-TCHQ — ${gói.length} gói × ≤${CO_GOI} TB (chia ${ngay})`,
  '',
  `Index ${TỔNG} TB · đã mở chi tiết ${đãXong.size} · **còn lại ${còn.length} TB thành ${gói.length} gói**.`,
  '',
  '## Cách nhận việc (chống tranh nhau)',
  '',
  '1. Chọn một gói CHƯA ai nhận, comment `nhận goi-NNN` ở issue theo dõi (xem tab Issues — nhãn `luong:tb-tchq`). Một agent giữ một gói tại một thời điểm.',
  '2. Mở từng TB theo URL trong gói (delay ≥ 1s, 1 tiến trình — xem CONTRIBUTING); lưu vào `data/customs/processed/tracuuhs-detail-<ngày>-goi-NNN.json` đúng envelope hiện có.',
  '3. `npm run dong-goi-lo -- --vao data/customs/processed/tracuuhs-detail-<ngày>-goi-NNN.json --ra data/customs/lo/tracuuhs-<ngày>-goi-NNN.json --bao-cao data/customs/lo/BAO-CAO-goi-NNN.md`',
  '4. Kiểm bằng `validate-community.mjs` bên hs-code-api (**0 lỗi mới đi tiếp**) → gộp `merge-community.mjs` → 1 PR sang hs-code-api (lô + precedents.json + số đếm tài liệu).',
  '5. Một PR oz-wiki thêm tệp detail + lô + báo cáo của gói. Quy trình đầy đủ: `docs/luong-tb-tchq.md`; agent dùng skill `/tb-tchq-lo`.',
  '',
  '**Chỉ đụng tệp của gói mình** (`*-goi-NNN*`) — không sửa tệp chung, không cập nhật hàng đợi; trạng thái ghi ở issue.',
  '',
  '> Lưu ý URL: sinh từ số hiệu in trên văn bản. Vài số hiệu có số 0 đầu (vd `08/TB-TCHQ/2020`) — nếu trang không mở, thử bỏ số 0 đầu (`tchq-8-2020`).',
  '',
];
for (const g of gói) {
  md.push(`## ${g.id} · ${g.tieu_de} · ${g.so_luong} TB`, '');
  md.push(...g.tb.map((x) => `- ${x.so_hieu} · nhóm ${x.nhom_hs} · ${x.url}`));
  md.push('');
}
if (xửTay.length) {
  md.push(`## Xử lý tay (từ các lô đã gộp) — ${xửTay.length} mục`, '');
  md.push(...xửTay.map((x) => `- ${x.muc} _(nguồn: ${x.nguon})_`));
  md.push('');
}
writeFileSync(RA_MD, md.join('\n'));

console.log(`Hàng đợi: ${còn.length} TB → ${gói.length} gói (≤${CO_GOI}/gói) + ${xửTay.length} mục xử tay`);
console.log(`→ ${RA_JSON}`);
console.log(`→ ${RA_MD}`);
