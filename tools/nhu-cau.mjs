#!/usr/bin/env node
// Nhu cầu từ ứng dụng đang dùng sổ: hs-code-api công bố bản đo `data/plhq-bench-latest.json` (repo công khai):
// văn bản nào biểu thuế đang dẫn (kèm số mã HS chịu ảnh hưởng), văn bản nào sổ chưa có, văn bản nào thư viện
// riêng của hs-code-api ghi tình trạng khác sổ. Công cụ này chụp phần cần dùng vào nhu-cau/hs-code-api.json
// để tools/diem-mu.mjs xếp việc theo mức ảnh hưởng thật — chạy offline, không cần mạng khi dò điểm mù.
// Kèm bản chụp gọn biểu thuế (mã 8 số → mô tả) vào nhu-cau/bieu-thue.json để tools/danh-muc kiểm mã HS
// trong bảng danh mục có tồn tại không (docs/luoc-do-danh-muc-hs.md).
//   node tools/nhu-cau.mjs                                  → tải bản đo + biểu thuế mới nhất (nhánh main của hs-code-api)
//   node tools/nhu-cau.mjs --from <tệp> [--bieu-thue <tệp>]  → đọc tệp cục bộ (tax.json của hs-code-api)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './lib/registry.mjs';

export const URL_BENCH = 'https://raw.githubusercontent.com/ozvietnam/hs-code-api/main/data/plhq-bench-latest.json';
export const TEP_NHU_CAU = join('nhu-cau', 'hs-code-api.json');
export const URL_BIEU_THUE = 'https://raw.githubusercontent.com/ozvietnam/hs-code-api/main/data/tax.json';
export const TEP_BIEU_THUE = join('nhu-cau', 'bieu-thue.json');
// Nhu cầu từ HÀNG THẬT (hs-code-api GET /api/demand — CEO OZ 05/10/2026): mã HS của các món hàng thật
// đi qua phiếu hồ sơ khai báo mà chưa có dòng nào trong bảng danh mục KTCN 2026. Chỉ có mức ưu tiên
// Cao/Vừa/Thấp, không số lượng / tên hàng / khách.
export const URL_HANG_THAT = 'https://hs-kb.uythacnhapkhau.com/api/demand';
export const TEP_HANG_THAT = join('nhu-cau', 'hang-that.json');

/** Giữ phần kho cần từ /api/demand: mã HS hàng thật chờ đối chiếu KTCN 2026. */
export function rutGonHangThat(d, nguon = URL_HANG_THAT) {
  if (!d || !Array.isArray(d.ktcn2026)) throw new Error('nhu cầu hàng thật không có ktcn2026[]');
  const MUC = new Set(['Cao', 'Vừa', 'Thấp']);
  return {
    _comment: 'Chụp từ hs-code-api GET /api/demand bằng node tools/nhu-cau.mjs — KHÔNG sửa tay. tools/diem-mu.mjs đọc tệp này.',
    nguon,
    ngay: String(d.generatedAt || '').slice(0, 10) || null,
    tuNgay: d.since || null,
    maHs: d.ktcn2026
      .filter((x) => /^\d{8}$/.test(String(x.hs || '')) && MUC.has(x.priority))
      .map((x) => ({ hs: x.hs, uuTien: x.priority, mucChinhSach: x.policyLevel || null, vanBanDangDan: (x.docs || []).slice(0, 8), gapGanNhat: x.lastSeen || null })),
  };
}

/** Bản chụp gọn biểu thuế: chỉ mã 8 số + mô tả dòng (cắt 120 ký tự). Không chép thuế suất. */
export function rutGonBieuThue(tax, nguon = URL_BIEU_THUE, ngay = null) {
  const ma = {};
  for (const r of Object.values(tax || {})) {
    const hs = String(r?.hs || '').replace(/\D/g, '');
    if (hs.length === 8) ma[hs] = String(r.vn || '').replace(/\s+/g, ' ').trim().slice(0, 120);
  }
  if (Object.keys(ma).length < 1000) throw new Error('biểu thuế quá ít dòng — tệp nguồn sai?');
  return { _comment: 'Chụp từ hs-code-api data/tax.json bằng node tools/nhu-cau.mjs — KHÔNG sửa tay. Chỉ dùng để kiểm mã HS trong danh-muc/.', nguon, phien_ban: ngay, tong: Object.keys(ma).length, ma: Object.fromEntries(Object.entries(ma).sort()) };
}

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
  const layJson = async (url) => {
    const res = await fetch(url, { signal: AbortSignal.timeout(60000) });
    if (!res.ok) throw new Error(`HTTP ${res.status} khi tải ${url}`);
    return res.json();
  };
  mkdirSync(join(ROOT, 'nhu-cau'), { recursive: true });

  // Hàng thật chạy TRƯỚC và độc lập: bước khác lỗi mạng không kéo theo (review 05/10/2026).
  if (!from) {
    try {
      const ht = rutGonHangThat(await layJson(URL_HANG_THAT));
      writeFileSync(join(ROOT, TEP_HANG_THAT), JSON.stringify(ht, null, 1) + '\n');
      console.log(`${ht.maHs.length} mã HS hàng thật chờ đối chiếu KTCN 2026 → ${TEP_HANG_THAT}`);
    } catch (e) {
      console.warn(`::warning::Không tải được ${URL_HANG_THAT} (${e.message}) — giữ ${TEP_HANG_THAT} cũ`);
    }
  }

  let bench = null;
  try {
    bench = from ? JSON.parse(readFileSync(from, 'utf8')) : await layJson(URL_BENCH);
    const out = rutGonNhuCau(bench, from || URL_BENCH);
    writeFileSync(join(ROOT, TEP_NHU_CAU), JSON.stringify(out, null, 1) + '\n');
    console.log(`${out.vanBanDuocDan.length} văn bản biểu thuế dẫn · ${out.thuVienLech.length} lệch thư viện → ${TEP_NHU_CAU}`);
  } catch (e) {
    console.warn(`::warning::Không cập nhật được bản đo (${e.message}) — giữ ${TEP_NHU_CAU} cũ`);
  }

  const j = process.argv.indexOf('--bieu-thue');
  const fromBt = j >= 0 ? process.argv[j + 1] : null;
  try {
    const tax = fromBt ? JSON.parse(readFileSync(fromBt, 'utf8')) : (!from ? await layJson(URL_BIEU_THUE) : null);
    if (tax) {
      const bt = rutGonBieuThue(tax, fromBt || URL_BIEU_THUE, bench?.ngay || null);
      writeFileSync(join(ROOT, TEP_BIEU_THUE), JSON.stringify(bt) + '\n');
      console.log(`${bt.tong} dòng thuế 8 số → ${TEP_BIEU_THUE}`);
    }
  } catch (e) {
    console.warn(`::warning::Không cập nhật được biểu thuế (${e.message}) — giữ ${TEP_BIEU_THUE} cũ`);
  }
}
