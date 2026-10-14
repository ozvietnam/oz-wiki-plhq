#!/usr/bin/env node
// Gắn loai_phan_loai (+ can_cu) cho TB-TCHQ trên sổ / detail / index / hàng đợi.
//   node tools/backfill-loai-phan-loai-tb-tchq.mjs [--dry]
// Không bịa: thiếu toàn văn → CHUA_XAC_DINH + can_cu chua_co_toan_van.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './lib/registry.mjs';
import { phanLoaiTbTchq } from './lib/loai-phan-loai-tb-tchq.mjs';

const dry = process.argv.includes('--dry');
const TODAY = '2026-10-14';

function loadJson(p) { return JSON.parse(readFileSync(p, 'utf8')); }
function saveJson(p, data) {
  if (dry) return;
  writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`);
}

// ----- 1) Bản đồ so_hieu → phân loại từ detail (ưu tiên goi mới hơn legacy) -----
const detailDir = join(ROOT, 'data/customs/processed');
const detailFiles = readdirSync(detailDir).filter((f) => f.startsWith('tracuuhs-detail-') && f.endsWith('.json'));
const bySo = new Map(); // so_hieu → { ma, can_cu, src, loai_vb }

for (const f of detailFiles) {
  const mGoi = f.match(/(\d{4}-\d{2}-\d{2})-goi-(\d+)/);
  const rank = mGoi ? `goi-${mGoi[1]}` : 'legacy';
  const data = loadJson(join(detailDir, f));
  for (const r of data.records || []) {
    const so = r.so_hieu;
    if (!so) continue;
    const prev = bySo.get(so);
    // goi dated files win over legacy; later date wins within goi
    if (prev && prev.rank.startsWith('goi-') && rank === 'legacy') continue;
    if (prev && prev.rank.startsWith('goi-') && rank.startsWith('goi-') && prev.rank >= rank) continue;
    const pl = phanLoaiTbTchq(r.noi_dung, r.loai_vb);
    bySo.set(so, { ...pl, rank, loai_vb: r.loai_vb || null, file: f });
  }
}

// ----- 2) Cập nhật từng detail record -----
let detailUpdated = 0;
for (const f of detailFiles) {
  const path = join(detailDir, f);
  const data = loadJson(path);
  let changed = false;
  for (const r of data.records || []) {
    const pl = phanLoaiTbTchq(r.noi_dung, r.loai_vb);
    if (r.loai_phan_loai !== pl.ma || r.loai_phan_loai_can_cu !== pl.can_cu) {
      r.loai_phan_loai = pl.ma;
      r.loai_phan_loai_can_cu = pl.can_cu;
      changed = true;
      detailUpdated += 1;
    }
  }
  if (changed) saveJson(path, data);
}

// ----- 3) Registry YAML TB-TCHQ -----
const vanBanDir = join(ROOT, 'registry/van-ban');
const yamlFiles = readdirSync(vanBanDir).filter((f) => /-tb-tchq-\d{4}\.yaml$/.test(f));
const regStats = { typed: 0, chua: 0, by: Object.create(null) };

function upsertYamlFields(text, fields) {
  // Remove existing loai_phan_loai* lines (top-level only)
  let lines = text.split('\n').filter((l) => !/^loai_phan_loai(_can_cu|_ngay)?:/.test(l));
  const loaiIdx = lines.findIndex((l) => /^loai:\s/.test(l));
  const insertAt = loaiIdx >= 0 ? loaiIdx + 1 : 1;
  const block = [
    `loai_phan_loai: ${fields.ma}`,
    `loai_phan_loai_can_cu: ${fields.can_cu}`,
    `loai_phan_loai_ngay: '${TODAY}'`,
  ];
  lines.splice(insertAt, 0, ...block);
  return lines.join('\n');
}

function soHieuFromYaml(text) {
  const m = text.match(/^so_hieu:\s*(.+)$/m);
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
}

for (const f of yamlFiles) {
  const path = join(vanBanDir, f);
  const text = readFileSync(path, 'utf8');
  const so = soHieuFromYaml(text);
  const known = so && bySo.get(so);
  const pl = known
    ? { ma: known.ma, can_cu: known.can_cu }
    : { ma: 'CHUA_XAC_DINH', can_cu: 'chua_co_toan_van' };
  regStats.by[pl.ma] = (regStats.by[pl.ma] || 0) + 1;
  if (pl.ma === 'CHUA_XAC_DINH') regStats.chua += 1;
  else regStats.typed += 1;
  if (!dry) writeFileSync(path, upsertYamlFields(text, pl));
}

// ----- 4) Index -----
const indexPath = join(ROOT, 'data/customs/processed/tracuuhs-ket-qua-phan-loai-2026-10-10.json');
const index = loadJson(indexPath);
let indexTyped = 0;
let indexChua = 0;
const indexBy = Object.create(null);
for (const row of index) {
  const known = bySo.get(row.so_hieu);
  const pl = known
    ? { ma: known.ma, can_cu: known.can_cu }
    : { ma: 'CHUA_XAC_DINH', can_cu: 'chua_co_toan_van' };
  row.loai_phan_loai = pl.ma;
  row.loai_phan_loai_can_cu = pl.can_cu;
  indexBy[pl.ma] = (indexBy[pl.ma] || 0) + 1;
  if (pl.ma === 'CHUA_XAC_DINH') indexChua += 1;
  else indexTyped += 1;
}
saveJson(indexPath, index);

// ----- 5) Hàng đợi -----
const hqPath = join(ROOT, 'data/customs/lo/hang-doi-tb-tchq.json');
const hq = loadJson(hqPath);
let hqTyped = 0;
let hqChua = 0;
const hqBy = Object.create(null);
for (const g of hq.goi || []) {
  for (const tb of g.tb || []) {
    const known = bySo.get(tb.so_hieu);
    const pl = known
      ? { ma: known.ma, can_cu: known.can_cu }
      : { ma: 'CHUA_XAC_DINH', can_cu: 'chua_co_toan_van' };
    tb.loai_phan_loai = pl.ma;
    tb.loai_phan_loai_can_cu = pl.can_cu;
    hqBy[pl.ma] = (hqBy[pl.ma] || 0) + 1;
    if (pl.ma === 'CHUA_XAC_DINH') hqChua += 1;
    else hqTyped += 1;
  }
}
if (!hq.thong_ke) hq.thong_ke = {};
hq.thong_ke.loai_phan_loai = { ...hqBy, typed: hqTyped, chua_xac_dinh: hqChua, ngay: TODAY };
saveJson(hqPath, hq);

// ----- 6) Bảng tra cứu bền (một tệp) -----
const lookup = {
  kind: 'tracuuhs.tb-tchq.loai-phan-loai',
  ngay: TODAY,
  quy_uoc: {
    XAC_DINH_TRUOC: 'Xin xác nhận trước / xác định trước mã số',
    KIEM_TRA_XAC_DINH_LAI: 'Kiểm tra và xác định lại mã số (trong kho thường = tiêu đề Kết quả phân loại — xem can_cu)',
    DINH_CHINH: 'Đính chính kết quả',
    CHUA_XAC_DINH: 'Chưa đủ toàn văn / tín hiệu để phân loại',
  },
  tu_detail: Object.fromEntries([...bySo.entries()].map(([so, v]) => [so, { ma: v.ma, can_cu: v.can_cu }])),
  thong_ke_detail: [...bySo.values()].reduce((a, v) => { a[v.ma] = (a[v.ma] || 0) + 1; return a; }, {}),
  thong_ke_registry: regStats,
  thong_ke_index: { typed: indexTyped, chua_xac_dinh: indexChua, by: indexBy },
  thong_ke_hang_doi: { typed: hqTyped, chua_xac_dinh: hqChua, by: hqBy },
};
saveJson(join(ROOT, 'data/customs/lo/tb-tchq-loai-phan-loai.json'), lookup);

const summary = {
  dry,
  detail_unique: bySo.size,
  detail_records_touched: detailUpdated,
  registry: regStats,
  index: { typed: indexTyped, chua: indexChua, by: indexBy, n: index.length },
  hang_doi: { typed: hqTyped, chua: hqChua, by: hqBy },
  detail_by: lookup.thong_ke_detail,
};
console.log(JSON.stringify(summary, null, 2));
if (dry) console.log('(dry-run — no files written)');
