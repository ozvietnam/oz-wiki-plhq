#!/usr/bin/env node
// Vòng chạy hàng loạt: nạp nội dung cấu trúc cho TB-TCHQ chưa có (issue #232).
//
//   node tools/tb-chay-lo.mjs [--limit=50] [--nhom=3909] [--offset=0]
//
// Việc:
//   1. đọc danh sách TB (data/customs/processed/tracuuhs-ket-qua-phan-loai-*.json) — nhóm theo HS 4 số;
//   2. bỏ qua TB đã có nội dung trong <out-dir>;
//   3. xếp thứ tự theo NHU CẦU thật (nhu-cau/hang-that.json — chụp từ /api/demand của hs-code-api):
//      nhóm nào hay được tra trước; nhóm không có dữ liệu nhu cầu thì xếp theo SỐ TB trong nhóm
//      (nhiều TB = nhóm quan trọng);
//   4. gọi tuần tự: tải PDF (tools/tai-pdf-tb.mjs) → trích nội dung (tools/trich-noi-dung-tb.mjs);
//   5. ghi log nạp vào <out-dir>/log-nap.jsonl; tiến trình in mỗi 10 TB.
//
// Ctrl-C: dừng sau khi hoàn tất TB đang chạy (không bỏ dở 1 tệp), ghi log rồi thoát.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import {
  CSV_MAC_DINH, KET_QUA_MAC_DINH, THU_MUC_NOI_DUNG_MAC_DINH, docArg, docJson, ghiJsonl, slugTB,
} from './lib/tb-tchq.mjs';
import { taiMotTB } from './tai-pdf-tb.mjs';
import { trichNoiDung } from './trich-noi-dung-tb.mjs';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const FILE_DEMAND = join('nhu-cau', 'hang-that.json');
const FILE_LOG_NAP = 'log-nap.jsonl';

/** Chuẩn hoá nhóm HS 4 số: "38.24" → "3824". */
export function chuanHoaNhom(nhom) {
  return String(nhom || '').replace(/\D/g, '');
}

/** Bậc ưu tiên theo nhu cầu: Cao=1, Vừa=2, Thấp=3. */
const BAC_UU_TIEN = { Cao: 1, 'Vừa': 2, Thấp: 3 };

/**
 * Bảng ưu tiên nhu cầu theo nhóm HS 4 số, từ bản chụp /api/demand (nhu-cau/hang-that.json).
 * Nhóm nào có mã HS hàng thật được tra với mức ưu tiên cao nhất thì lấy mức đó.
 */
export function docUuTienNhuCau(file) {
  const d = docJson(file);
  const bang = new Map();
  const ds = d && Array.isArray(d.maHs) ? d.maHs : [];
  for (const x of ds) {
    const hs = String(x.hs || '');
    if (!/^\d{8}$/.test(hs)) continue;
    const bac = BAC_UU_TIEN[x.uuTien];
    if (!bac) continue;
    const nhom = hs.slice(0, 4);
    if (!bang.has(nhom) || bang.get(nhom) > bac) bang.set(nhom, bac);
  }
  return bang;
}

/**
 * Xếp thứ tự nhóm: có nhu cầu trước (Cao → Vừa → Thấp), không có nhu cầu thì theo số TB giảm dần.
 * @returns {Array<{nhom: string, so_tb: number, bac: number|null}>}
 */
export function xepNhom(nhomTheoSo, uuTien = new Map()) {
  const ds = [...nhomTheoSo.entries()].map(([nhom, gt]) => ({
    nhom,
    so_tb: Array.isArray(gt) ? gt.length : Number(gt) || 0,
    bac: uuTien.get(nhom) ?? null,
  }));
  ds.sort((a, b) => {
    if (a.bac !== b.bac) {
      if (a.bac === null) return 1;
      if (b.bac === null) return -1;
      return a.bac - b.bac;
    }
    return b.so_tb - a.so_tb;
  });
  return ds;
}

/** Đọc danh sách TB từ tệp JSON (mảng hoặc { records: [] }). */
export function docDanhSachTB(file) {
  const d = docJson(file);
  const ds = Array.isArray(d) ? d : (d && (d.records || d.data)) || [];
  return ds
    .map((r) => ({ so_hieu: String(r.so_hieu || '').trim(), nhom_hs: chuanHoaNhom(r.nhom_hs) }))
    .filter((r) => r.so_hieu);
}

let dung = false;
process.on('SIGINT', () => {
  if (dung) { console.log('\nĐã yêu cầu dừng lần 2 — thoát ngay.'); process.exit(130); }
  dung = true;
  console.log('\n⏹ Sẽ dừng sau khi xong TB đang chạy (Ctrl-C lần nữa để thoát ngay).');
});

export async function chayLo(options = {}) {
  const {
    danhSach = join(ROOT, KET_QUA_MAC_DINH), csv = join(ROOT, CSV_MAC_DINH),
    outDir = join(ROOT, THU_MUC_NOI_DUNG_MAC_DINH), pdfDir = '/opt/oz-wiki-data/tb-pdf',
    demand = join(ROOT, FILE_DEMAND), nhom = null, limit = 0, offset = 0,
    rateSleepMs = 1100, retry = 2, lamMoi = false, logNap = null,
  } = options;
  const ds = docDanhSachTB(danhSach);
  const theoNhom = new Map();
  for (const r of ds) {
    if (!theoNhom.has(r.nhom_hs)) theoNhom.set(r.nhom_hs, []);
    theoNhom.get(r.nhom_hs).push(r);
  }
  const uuTien = docUuTienNhuCau(demand);
  const thuTu = xepNhom(theoNhom, uuTien).filter((x) => !nhom || x.nhom.startsWith(chuanHoaNhom(nhom)));
  // Danh sách TB theo thứ tự nhóm; bỏ TB đã có nội dung (trừ khi --lam-moi)
  const muc = [];
  for (const nhomItem of thuTu) {
    for (const r of theoNhom.get(nhomItem.nhom)) {
      const slug = slugTB(r.so_hieu);
      const co = existsSync(join(outDir, `${slug}.json`));
      if (co && !lamMoi) continue;
      muc.push({ ...r, slug, da_co: co });
    }
  }
  const batDau = offset > 0 ? muc.slice(offset) : muc;
  const gioiHan = limit > 0 ? batDau.slice(0, limit) : batDau;
  console.log(`Danh sách: ${ds.length} TB · nhóm: ${thuTu.length} · còn nạp: ${muc.length} · lần này: ${gioiHan.length}`);
  console.log(`Ưu tiên nhu cầu: ${uuTien.size} nhóm HS 4 số có dữ liệu từ ${FILE_DEMAND}`);
  if (gioiHan.length) {
    console.log(`Nhóm đầu: ${thuTu.slice(0, 8).map((x) => `${x.nhom}(${x.so_tb}${x.bac ? `,bac${x.bac}` : ''})`).join(' ')}`);
  }
  const tepLog = logNap || join(outDir, FILE_LOG_NAP);
  const { docChiMucPDF, docCsvObject } = await import('./lib/tb-tchq.mjs');
  const chiMuc = docChiMucPDF(docCsvObject(readFileSync(csv, 'utf8')));
  const ket = { tong: gioiHan.length, ok: 0, loi: 0, dung: false };
  for (const [i, tb] of gioiHan.entries()) {
    if (dung) { ket.dung = true; break; }
    const tepPdf = join(pdfDir, `${tb.slug}.pdf`);
    let trang_thai = 'ok';
    let canh_bao_ocr = false;
    let ly_do = null;
    try {
      const tai = await taiMotTB(tb.so_hieu, {
        chiMuc, out: pdfDir, log: join(pdfDir, 'nap-tb.jsonl'), loiNap: join(pdfDir, 'loi-nap.jsonl'),
        rateSleepMs, retry,
      });
      if (tai.trang_thai !== 'ok') {
        trang_thai = tai.trang_thai === 'khong_tim_thay_pdf' ? 'khong_tim_thay_pdf' : 'loi_tai_pdf';
        ly_do = tai.trang_thai === 'khong_tim_thay_pdf' ? 'không có pdf_url_primary trong master CSV' : 'tải PDF thất bại (xem loi-nap.jsonl)';
      } else {
        const r = trichNoiDung(tepPdf, { outDir, soHieu: tb.so_hieu, nhomHs: tb.nhom_hs });
        trang_thai = r.trang_thai;
        canh_bao_ocr = r.canh_bao_ocr;
        ly_do = r.ly_do_khong_trich;
      }
    } catch (e) {
      trang_thai = 'loi';
      ly_do = String(e.message || e).split('\n')[0];
    }
    if (trang_thai === 'ok') ket.ok += 1; else ket.loi += 1;
    ghiJsonl(tepLog, {
      so_hieu: tb.so_hieu, nhom_hs: tb.nhom_hs, trang_thai, canh_bao_ocr, ly_do,
      tep_pdf: trang_thai === 'ok' || existsSync(tepPdf) ? tepPdf : null, luc: new Date().toISOString(),
    });
    if ((i + 1) % 10 === 0 || i + 1 === gioiHan.length) {
      console.log(`  ${i + 1}/${gioiHan.length} · ok ${ket.ok} · lỗi ${ket.loi}`);
    }
  }
  console.log(`Xong: ok ${ket.ok} · lỗi ${ket.loi}${ket.dung ? ' · ĐÃ DỪNG (Ctrl-C)' : ''} · log: ${tepLog}`);
  return ket;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { gia } = docArg(process.argv.slice(2));
  const ket = await chayLo({
    danhSach: resolve(gia['danh-sach'] || join(ROOT, KET_QUA_MAC_DINH)),
    csv: resolve(gia.csv || join(ROOT, CSV_MAC_DINH)),
    outDir: resolve(gia['out-dir'] || join(ROOT, THU_MUC_NOI_DUNG_MAC_DINH)),
    pdfDir: resolve(gia['pdf-dir'] || '/opt/oz-wiki-data/tb-pdf'),
    demand: resolve(gia.demand || join(ROOT, FILE_DEMAND)),
    nhom: gia.nhom || null,
    limit: Number(gia.limit || 0) || 0,
    offset: Number(gia.offset || 0) || 0,
    rateSleepMs: Number(gia['rate-sleep-ms'] ?? 1100),
    retry: Number(gia.retry ?? 2),
    lamMoi: !!gia['lam-moi'],
    logNap: gia.log ? resolve(gia.log) : null,
  });
  process.exit(ket.dung ? 130 : 0);
}
