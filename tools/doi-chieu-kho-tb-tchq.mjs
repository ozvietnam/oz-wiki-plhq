#!/usr/bin/env node
// Đối chiếu hàng đợi TB-TCHQ VỚI KHO TIỀN LỆ trước khi cho agent nhận gói (luật CEO 14/10/2026:
// "trước khi cào phải xem kho với sổ đã ghi chú chứ").
//
//   node tools/doi-chieu-kho-tb-tchq.mjs [--hang-doi <json>] [--kho <file|url>] [--ra <json>]
//
// Đầu vào:
//   --hang-doi  data/customs/lo/hang-doi-tb-tchq.json   (manifest 103 gói)
//   --kho       file cục bộ HOẶC url; mặc định tải precedents.json của hs-code-api (repo công khai).
// Đầu ra:
//   data/customs/lo/hang-doi-uu-tien.json — mỗi gói kèm số TB chưa có / đã có trong kho, xếp hạng
//   theo số TB CHƯA CÓ giảm dần; in bảng tóm tắt ra stdout.
//
// Quy tắc khớp: số hiệu chuẩn hoá (bỏ năm, bỏ số 0 đầu phần số, bỏ khoảng trắng — cùng kiểu nha
// `nref` bên hs-code-api). Kho lưu số hiệu không năm ("1005/TB-TCHQ"), manifest có năm ("1005/TB-TCHQ/2025").
import { readFileSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const arg = (ten, mac) => { const i = args.indexOf(ten); return i >= 0 ? args[i + 1] : mac; };
const HÀNG_ĐỢI = arg('--hang-doi', 'data/customs/lo/hang-doi-tb-tchq.json');
const KHO = arg('--kho', 'https://raw.githubusercontent.com/ozvietnam/hs-code-api/main/data/precedents.json');
const RA = arg('--ra', 'data/customs/lo/hang-doi-uu-tien.json');

// Chuẩn hoá số hiệu: "1005/TB-TCHQ/2025" → "1005/TB-TCHQ"; "08/TB-TCHQ" → "8/TB-TCHQ"
export function chuanSoHieu(x) {
  let s = String(x || '').toUpperCase().replace(/\s+/g, '').replace(/\/\d{4}$/, '');
  s = s.replace(/^0+(\d)/, '$1');
  return s;
}

// bản đồ số hiệu → độ dài lý do dài nhất trong kho (để phát hiện "đã có nhưng bản mỏng")
export const NGUONG_MONG = 150;
export function banDoKho(kho) {
  const map = new Map();
  for (const arr of Object.values(kho || {})) {
    for (const p of arr || []) {
      if (!p?.tbTchqNumber) continue;
      const k = chuanSoHieu(p.tbTchqNumber);
      const dài = String(p.technicalSpec || '').length;
      map.set(k, Math.max(map.get(k) || 0, dài));
    }
  }
  return map;
}
export function refsTrongKho(kho) { return new Set(banDoKho(kho).keys()); }

export function xepHangGoi(hangDoi, khoRefs) {
  const banDo = khoRefs instanceof Map ? khoRefs : null;
  const goi = (hangDoi.goi || []).map((g) => {
    const chua = []; const da = []; let mong = 0;
    for (const tb of g.tb || []) {
      const k = chuanSoHieu(tb.so_hieu);
      const trongKho = banDo ? banDo.has(k) : khoRefs.has(k);
      if (trongKho) { da.push(tb.so_hieu); if (banDo && (banDo.get(k) || 0) < NGUONG_MONG) mong += 1; }
      else chua.push(tb.so_hieu);
    }
    return { id: g.id, tieu_de: g.tieu_de, so_luong: g.so_luong, chua_co: chua.length, da_co: da.length, mong_co: mong, tb_chua_co: chua };
  });
  goi.sort((a, b) => b.chua_co - a.chua_co || b.mong_co - a.mong_co || String(a.id).localeCompare(String(b.id)));
  return goi;
}

async function main() {
  const hangDoi = JSON.parse(readFileSync(HÀNG_ĐỢI, 'utf8'));
  const kho = /^https?:\/\//.test(KHO)
    ? await (await fetch(KHO, { headers: { 'user-agent': 'oz-wiki-plhq/0.1' } })).json()
    : JSON.parse(readFileSync(KHO, 'utf8'));
  const banDo = banDoKho(kho);
  const xep = xepHangGoi(hangDoi, banDo);
  const tổng = xep.reduce((n, g) => n + g.chua_co, 0);
  const tổngĐã = xep.reduce((n, g) => n + g.da_co, 0);
  const tổngMỏng = xep.reduce((n, g) => n + g.mong_co, 0);
  const ra = {
    _comment: 'Xếp hạng gói hàng đợi TB-TCHQ theo số TB CHƯA CÓ trong kho tiền lệ hs-code-api — agent nhận gói TỪ TRÊN XUỐNG để tỉ lệ giá trị mới cao. Sinh bằng tools/doi-chieu-kho-tb-tchq.mjs; chạy lại khi kho đổi.',
    ngay: new Date().toISOString().slice(0, 10),
    nguon_kho: KHO,
    tong_tb_chua_co: tổng,
    tong_tb_da_co: tổngĐã,
    goi: xep,
  };
  writeFileSync(RA, JSON.stringify(ra, null, 1) + '\n');
  console.log(`Đối chiếu ${xep.length} gói với kho (${banDo.size} số hiệu): TỔNG ${tổng} TB chưa có · ${tổngĐã} đã có (${tổngMỏng} bản mỏng — giá trị nâng cấp)`);
  console.log('Top 15 gói nên nhận trước (chưa có nhiều nhất, rồi nhiều bản mỏng):');
  for (const g of xep.slice(0, 15)) console.log(`  ${g.id} · ${g.tieu_de} · chưa có ${g.chua_co}/${g.so_luong} · bản mỏng ${g.mong_co} · đã có ${g.da_co}`);
  console.log(`→ ${RA}`);
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  await main();
}
