#!/usr/bin/env node
// Tạo khung một văn bản mới trong sổ (dành cho luồng Do thám). Mọi trường chưa biết để trống —
// điểm mù sẽ tự liệt kê phần còn thiếu.
//   node tools/them-van-ban.mjs "28/2026/TT-BCT" [--ten "..."] [--nhanh kiem-tra-chuyen-nganh/bct]
//        [--ngay 2026-06-01] [--hieu-luc 2026-07-17] [--url https://...] [--thay "11/2022/TT-BCT"]
import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { napSo, khoa, slugTuSoHieu, homNay, ROOT } from './lib/registry.mjs';

const LOAI_THEO_KY_HIEU = [
  [/\/QH\d+$/, 'LUAT'], [/NĐ-|ND-/, 'NGHI_DINH'], [/TTLT-/, 'THONG_TU_LIEN_TICH'], [/TT-/, 'THONG_TU'],
  [/QĐ-|QD-/, 'QUYET_DINH'], [/NQ-/, 'NGHI_QUYET'], [/CT-/, 'CHI_THI'], [/VBHN/, 'VAN_BAN_HOP_NHAT'],
];

const args = process.argv.slice(2);
const soHieu = args[0];
const opt = (k) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
if (!soHieu || soHieu.startsWith('--')) {
  console.error('Cách dùng: node tools/them-van-ban.mjs "<số hiệu>" [--ten ...] [--nhanh ...] [--ngay YYYY-MM-DD] [--hieu-luc YYYY-MM-DD] [--url ...] [--thay "<số hiệu cũ>"]');
  process.exit(2);
}
const so = napSo();
if (so.theoKhoa.has(khoa(soHieu))) {
  console.error(`Đã có ${soHieu}: ${so.theoKhoa.get(khoa(soHieu))[0]._file}`);
  process.exit(1);
}
const ngay = opt('ngay');
const coQuan = (soHieu.match(/-([A-ZĐa-z]+)$/) || [])[1]?.replace('Đ', 'D').toUpperCase().replace('TTG', 'TTG') || (/\/QH\d+$/.test(soHieu) ? 'QH' : undefined);
const doc = {
  so_hieu: soHieu,
  loai: (LOAI_THEO_KY_HIEU.find(([re]) => re.test(soHieu)) || [null, 'KHAC'])[1],
  ten: opt('ten') || `(chưa có tiêu đề) ${soHieu}`,
  co_quan: coQuan,
  ngay_ban_hanh: ngay,
  hieu_luc_tu: opt('hieu-luc'),
  tinh_trang: 'CHUA_XAC_MINH',
  nhanh: [opt('nhanh') || 'chua-phan-loai'],
  quan_he: opt('thay') ? { thay_the: [opt('thay')] } : undefined,
  nguon: opt('url') ? [{ url: opt('url'), truy_cap: homNay() }] : undefined,
  xac_minh: { muc: 'CHUA_XAC_MINH', hieu_luc_da_doi_chieu: false, ngay: homNay(), boi: process.env.KB_TAC_GIA || 'do-tham' },
};
for (const k of Object.keys(doc)) if (doc[k] === undefined) delete doc[k];
const file = join(ROOT, 'registry', 'van-ban', `${slugTuSoHieu(soHieu, ngay?.slice(0, 4))}.yaml`);
if (existsSync(file)) { console.error(`Đã có tệp ${file}`); process.exit(1); }
writeFileSync(file, `# Sổ đăng ký văn bản — sửa qua PR. Lược đồ: docs/luoc-do-so-dang-ky.md\n${yaml.dump(doc, { lineWidth: -1 })}`);
console.log(`Đã tạo ${file.slice(ROOT.length + 1)} — chạy node tools/kiem-tra.mjs rồi mở PR.`);
