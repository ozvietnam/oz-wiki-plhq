#!/usr/bin/env node
// Soát chéo mapping HS↔TB của tracuuhs crawl với precedents store (hs-code-api) — 2 nguồn độc lập.
// Phân loại: (A) sai mã HS = bug nghiêm trọng; (B) đúng mã nhưng mô tả khác hàng = bug join;
//            (C) đúng mã, mô tả khác độ sâu (generic vs specific) = KHÔNG sai.
//   node tools/soat-chieu-mapping-tb.mjs             — quét toàn bộ
//   node tools/soat-chieu-mapping-tb.mjs --sample 50 — 50 mẫu ngẫu nhiên
//   node tools/soat-chieu-mapping-tb.mjs --fix       — sửa mô tả sai từ precedents
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const THU_MUC = 'data/customs/processed';
const PRECEDENTS_URL = 'https://raw.githubusercontent.com/ozvietnam/hs-code-api/main/data/precedents.json';
const args = process.argv.slice(2);
const FIX = args.includes('--fix');
const SAMPLE = args.includes('--sample') ? parseInt(args[args.indexOf('--sample') + 1] || '50', 10) : null;

// 1) Nạp crawl
const crawlFile = readdirSync(THU_MUC).filter((x) => /^tracuuhs-ket-qua-phan-loai-.*\.json$/.test(x)).sort().pop();
const crawl = JSON.parse(readFileSync(join(THU_MUC, crawlFile), 'utf8'));

// 2) Nạp precedents
const cachePath = '/tmp/precedents-cache.json';
if (!existsSync(cachePath)) execSync(`curl -sL -m 30 -o ${cachePath} '${PRECEDENTS_URL}'`, { stdio: 'pipe' });
const precedents = JSON.parse(readFileSync(cachePath, 'utf8'));

// Map: số TB (bỏ năm) → [{hs, productName, technicalSpec}]
const precMap = new Map();
for (const [hs, list] of Object.entries(precedents)) {
  for (const p of (Array.isArray(list) ? list : [])) {
    const num = String(p.tbTchqNumber || '').replace(/\/TB-TCHQ.*$/, '').replace(/\/20\d\d$/, '');
    if (!num) continue;
    if (!precMap.has(num)) precMap.set(num, []);
    precMap.get(num).push({ hs: String(hs), productName: p.productName || '', technicalSpec: p.technicalSpec || '' });
  }
}

// 3) So sánh
const digits = (s) => String(s || '').replace(/\D/g, '');
const hs4 = (s) => digits(s).slice(0, 4);
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')
  .replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const toks = (s) => norm(s).split(' ').filter((t) => t.length >= 3);
const overlap = (a, b) => {
  const ta = new Set(toks(a)); const tb = new Set(toks(b));
  if (!ta.size || !tb.size) return -1; // một bên rỗng → không so được
  let hit = 0; for (const t of ta) if (tb.has(t)) hit++;
  return hit / Math.min(ta.size, tb.size);
};

let danhSach = crawl;
if (SAMPLE) {
  const có = crawl.filter((x) => {
    const p = precMap.get(String(x.so_hieu).split('/')[0]);
    return p && p.length && p[0].productName;
  });
  danhSach = [...có].sort(() => Math.random() - 0.5).slice(0, SAMPLE);
}

const kq = { đúng: 0, saiMã: [], saiJoin: [], khácĐộSâu: 0, khôngThamChiếu: 0, môTảTrống: 0 };
for (const x of danhSach) {
  const num = String(x.so_hieu).split('/')[0];
  const plist = precMap.get(num);
  if (!plist?.length) { kq.khôngThamChiếu++; continue; }

  const crawlHs4 = hs4(x.nhom_hs);
  const crawlDesc = x.ten_hang_rieng || x.mo_ta_chung || '';
  // tìm precedent cùng mã 4 số
  const cùngMã = plist.filter((p) => hs4(p.hs) === crawlHs4);
  const precCóTên = plist.filter((p) => p.productName && p.productName.length > 10);

  if (!cùngMã.length && crawlHs4 && plist.some((p) => p.hs.length >= 4)) {
    // (A) không có precedent nào cùng mã 4 → sai mã HS
    kq.saiMã.push({ so_hieu: x.so_hieu, crawl_hs: x.nhom_hs, prec_hs: plist.map((p) => p.hs).slice(0, 3).join(', '),
      crawl_mo_ta: crawlDesc.slice(0, 60), prec_ten: (plist[0]?.productName || '').slice(0, 60) });
    if (FIX) x._soat_chieu_sai_ma = { ngay: new Date().toISOString().split('T')[0], prec_hs: plist.map((p) => p.hs).slice(0, 3) };
    continue;
  }

  if (precCóTên.length) {
    let best = 0; let bestPrec = null;
    for (const p of precCóTên) {
      const o = overlap(crawlDesc, p.productName);
      if (o > best) { best = o; bestPrec = p; }
    }
    if (best >= 0 && best < 0.15) {
      // (B) mô tả khác hẳn hàng → sai join
      kq.saiJoin.push({ so_hieu: x.so_hieu, crawl_hs: x.nhom_hs, prec_hs: bestPrec?.hs,
        crawl_mo_ta: crawlDesc.slice(0, 70), prec_ten: String(bestPrec?.productName || '').slice(0, 70), overlap: Math.round(best * 100) });
      if (FIX && bestPrec && bestPrec.productName && bestPrec.productName.length > 10) {
        x.ten_hang_rieng = bestPrec.productName;
        x._soat_chieu_sua = { ngay: new Date().toISOString().split('T')[0], nguon: 'precedents-store', overlap_cu: Math.round(best * 100) };
      }
    } else if (best === -1) {
      kq.môTảTrống++;
    } else {
      kq.đúng++;
    }
  } else {
    kq.môTảTrống++;
  }
}

// 4) Báo cáo
const soĐược = kq.đúng + kq.saiMã.length + kq.saiJoin.length + kq.khácĐộSâu;
const phầnTrămSạch = soĐược > 0 ? Math.round(((kq.đúng + kq.khácĐộSâu) / soĐược) * 100) : 0;
console.log(`\n═ SOÁT CHÉO MAPPING HS↔TB (${SAMPLE ? 'mẫu ' + SAMPLE : 'toàn bộ'} — ${soĐược} so được)`);
console.log(`  ✅ Đúng/khác độ sâu (không sai): ${kq.đúng + kq.khácĐộSâu} (${phầnTrămSạch}%)`);
console.log(`  🔴 (A) SAI MÃ HS: ${kq.saiMã.length}`);
console.log(`  🟠 (B) SAI JOIN mô tả: ${kq.saiJoin.length}`);
console.log(`  ⚪ Mô tả trống/không so được: ${kq.môTảTrống} | Không có trong precedents: ${kq.khôngThamChiếu}`);

if (kq.saiMã.length) {
  console.log(`\n═ (A) SAI MÃ HS — ${kq.saiMã.length} mục:`);
  for (const x of kq.saiMã.slice(0, 15)) {
    console.log(`  🔴 ${x.so_hieu} | crawl: ${x.crawl_hs} → prec: ${x.prec_hs}`);
    console.log(`     "${x.crawl_mo_ta}" vs "${x.prec_ten}"`);
  }
}
if (kq.saiJoin.length) {
  console.log(`\n═ (B) SAI JOIN MÔ TẢ — ${kq.saiJoin.length} mục:`);
  for (const x of kq.saiJoin.slice(0, 15)) {
    console.log(`  🟠 ${x.so_hieu} | HS ${x.crawl_hs} (đúng mã) nhưng hàng khác:`);
    console.log(`     crawl: "${x.crawl_mo_ta}"`);
    console.log(`     prec:  "${x.prec_ten}" (${x.overlap}%)`);
  }
}

if (FIX && (kq.saiJoin.length || kq.saiMã.length)) {
  writeFileSync(join(THU_MUC, crawlFile), JSON.stringify(crawl, null, 2) + '\n');
  console.log(`\n✅ Đã sửa ${kq.saiJoin.length} mô tả + đánh dấu ${kq.saiMã.length} sai mã → ${crawlFile}`);
}

writeFileSync('/tmp/soat-chieu-mapping-bao-cao.json', JSON.stringify(kq, null, 2));
console.log(`\nBáo cáo: /tmp/soat-chieu-mapping-bao-cao.json`);
