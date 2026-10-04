#!/usr/bin/env node
// Nhu cầu từ ứng dụng đang dùng sổ: hs-code-api công bố bản đo `data/plhq-bench-latest.json` (repo công khai):
// văn bản nào biểu thuế đang dẫn (kèm số mã HS chịu ảnh hưởng), văn bản nào sổ chưa có, văn bản nào thư viện
// riêng của hs-code-api ghi tình trạng khác sổ. Công cụ này chụp phần cần dùng vào nhu-cau/hs-code-api.json
// để tools/diem-mu.mjs xếp việc theo mức ảnh hưởng thật — chạy offline, không cần mạng khi dò điểm mù.
//   node tools/nhu-cau.mjs               → tải bản đo mới nhất (nhánh main của hs-code-api)
//   node tools/nhu-cau.mjs --from <tệp>  → đọc tệp cục bộ
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './lib/registry.mjs';

export const URL_BENCH = 'https://raw.githubusercontent.com/ozvietnam/hs-code-api/main/data/plhq-bench-latest.json';
export const TEP_NHU_CAU = join('nhu-cau', 'hs-code-api.json');

/** Giữ đúng phần kho cần: không chép số liệu nội bộ khác của ứng dụng. */
export function rutGonNhuCau(bench, nguon = URL_BENCH) {
  if (!bench || !Array.isArray(bench.theoVanBan)) throw new Error('bản đo không có theoVanBan[]');
  return {
    _comment: 'Chụp từ hs-code-api (scripts/bench-plhq.mjs) bằng node tools/nhu-cau.mjs — KHÔNG sửa tay. tools/diem-mu.mjs đọc tệp này.',
    nguon,
    ngayDo: bench.ngay || null,
    registryVersionKhiDo: bench.registryVersion || null,
    maHsCoChinhSach: bench.maHs?.coChinhSach ?? null,
    vanBanDuocDan: bench.theoVanBan.map((v) => ({ soHieu: v.soHieu, found: !!v.found, soMaHs: v.soMaHs || 0 })),
    thuVienLech: (bench.thuVienLechSo?.lech || []).map((x) => ({ code: x.code, thuVien: x.thuVien, so: x.so, soHieu: x.soHieu })),
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const i = process.argv.indexOf('--from');
  const from = i >= 0 ? process.argv[i + 1] : null;
  let bench;
  if (from) bench = JSON.parse(readFileSync(from, 'utf8'));
  else {
    const res = await fetch(URL_BENCH);
    if (!res.ok) throw new Error(`HTTP ${res.status} khi tải ${URL_BENCH}`);
    bench = await res.json();
  }
  const out = rutGonNhuCau(bench, from || URL_BENCH);
  mkdirSync(join(ROOT, 'nhu-cau'), { recursive: true });
  writeFileSync(join(ROOT, TEP_NHU_CAU), JSON.stringify(out, null, 1) + '\n');
  console.log(`${out.vanBanDuocDan.length} văn bản biểu thuế dẫn · ${out.thuVienLech.length} lệch thư viện → ${TEP_NHU_CAU}`);
}
