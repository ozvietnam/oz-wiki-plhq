#!/usr/bin/env node
// Tải PDF gốc của TB-TCHQ từ customs.gov.vn theo master CSV (data/customs/processed/all-1990-2026.csv,
// cột pdf_url_primary) — nền của việc nạp tầng nội dung TB (issue #232).
//
//   node tools/tai-pdf-tb.mjs <so-hieu> [<so-hieu> ...] [tuỳ chọn]
//   node tools/tai-pdf-tb.mjs --nhom=3909 --limit=50
//
// Tuỳ chọn:
//   --csv=<tệp>          master CSV (mặc định data/customs/processed/all-1990-2026.csv)
//   --danh-sach=<tệp>    danh sách TB (JSON) để tra nhóm (mặc định tracuuhs-ket-qua-phan-loai-*.json)
//   --nhom=<hs4>         lấy mọi TB của nhóm HS 4 số trong danh sách
//   --out=<thư mục>      nơi lưu PDF (mặc định /opt/oz-wiki-data/tb-pdf)
//   --log=<tệp>          nhật ký JSONL (mặc định <out>/nap-tb.jsonl)
//   --loi-nap=<tệp>      danh sách lỗi (mặc định <out>/loi-nap.jsonl)
//   --limit=<n>          chỉ xử lý n TB đầu
//   --rate-sleep-ms=<ms> nghỉ giữa 2 lần tải (mặc định 1100 — tức ~1 req/s)
//   --retry=<n>          thử lại mỗi URL n lần (mặc định 2)
//   --khong-ghi-loi-nap  không ghi loi-nap.jsonl (chỉ ghi log)
//
// Luật: KHÔNG đoán. Số hiệu phải khớp số + NĂM (số TB-TCHQ đánh số lại theo từng năm;
// khớp số mà lệch năm là văn bản KHÁC). Link chết / file không phải PDF → ghi loi-nap.jsonl
// để đêm sau thử lại, bỏ qua.
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import {
  UA, CSV_MAC_DINH, KET_QUA_MAC_DINH, FILE_LOI_NAP_MAC_DINH, FILE_NHAT_KY_MAC_DINH,
  docArg, docChiMucPDF, docCsvObject, ghiJsonl, nghe, timUNGPDF, slugTB,
} from './lib/tb-tchq.mjs';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');

/** Đọc danh sách TB (tracuuhs-ket-qua) → [{ so_hieu, nhom_hs }]. */
export function docDanhSachTB(file) {
  let raw;
  try { raw = JSON.parse(readFileSync(file, 'utf8')); } catch { return []; }
  const ds = Array.isArray(raw) ? raw : (raw.records || raw.data || []);
  return ds
    .map((r) => ({ so_hieu: String(r.so_hieu || '').trim(), nhom_hs: String(r.nhom_hs || '').trim() }))
    .filter((r) => r.so_hieu);
}

/** Chuẩn hoá nhóm HS 4 số: "38.24" / "3824" → "3824". */
export function chuanHoaNhom(nhom) {
  return String(nhom || '').replace(/\D/g, '');
}

/**
 * Tải 1 URL, thử lại tối đa `retry` lần. Trả { ok, bytes?, loi? }.
 * Retry khi lỗi mạng hoặc HTTP 5xx (lỗi 4xx là link chết — không thử lại).
 */
async function tai(url, { retry = 2, rateSleepMs = 1100, truoc = false } = {}) {
  let loi = null;
  for (let lan = 0; lan <= retry; lan += 1) {
    if (lan > 0 || !truoc) await nghe(rateSleepMs);
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(120000) });
      if (!res.ok) {
        loi = `HTTP ${res.status}`;
        if (res.status < 500) break;             // 404/403 = link chết, không thử lại
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      return { ok: true, buf, url: res.url || url };
    } catch (e) {
      loi = `lỗi mạng: ${String(e.message || e).split('\n')[0]}`;
    }
  }
  return { ok: false, loi };
}

/**
 * Tải PDF của 1 TB và ghi log + loi-nap.
 * @returns {Promise<{trang_thai: string, tep?: string}>}
 */
export async function taiMotTB(soHieu, { chiMuc, out, log, loiNap, rateSleepMs = 1100, retry = 2, ghiLoiNap = true }) {
  const slug = slugTB(soHieu);
  const ungVien = timUNGPDF(chiMuc, soHieu);
  const luc = new Date().toISOString();
  if (!ungVien.length) {
    const dong = { so_hieu: soHieu, url: null, bytes: null, sha256: null, trang_thai: 'khong_tim_thay_pdf', luc };
    ghiJsonl(log, dong);
    if (ghiLoiNap) ghiJsonl(loiNap, { so_hieu: soHieu, url: null, loi: 'không có pdf_url_primary trong master CSV', luc });
    return { trang_thai: 'khong_tim_thay_pdf' };
  }
  let loiCuoi = null;
  for (const ung of ungVien) {
    const r = await tai(ung.url, { retry, rateSleepMs });
    if (!r.ok) { loiCuoi = `${ung.url} — ${r.loi}`; continue; }
    // Không phải PDF (vd .tif) → thử ứng viên tiếp theo
    if (r.buf.subarray(0, 5).toString('latin1') !== '%PDF-') {
      loiCuoi = `${ung.url} — tệp không phải PDF (${r.buf.subarray(0, 5).toString('latin1').replace(/[^\x20-\x7e]/g, '.')})`;
      continue;
    }
    mkdirSync(out, { recursive: true });
    const tep = join(out, `${slug}.pdf`);
    writeFileSync(tep, r.buf);
    const sha256 = createHash('sha256').update(r.buf).digest('hex');
    const dong = {
      so_hieu: soHieu, url: ung.url, bytes: r.buf.length, sha256,
      trang_thai: 'ok', tep: `${slug}.pdf`, do_tin_cay: ung.do_tin_cay, so_hieu_csv: ung.so_hieu_csv, luc,
    };
    ghiJsonl(log, dong);
    return { trang_thai: 'ok', tep };
  }
  const dong = { so_hieu: soHieu, url: ungVien[0]?.url || null, bytes: null, sha256: null, trang_thai: 'loi', luc };
  ghiJsonl(log, dong);
  if (ghiLoiNap) ghiJsonl(loiNap, { so_hieu: soHieu, url: ungVien[0]?.url || null, loi: loiCuoi || 'tải thất bại', luc });
  return { trang_thai: 'loi' };
}

export async function taiPdf(options) {
  const {
    soHieu = [], csv = join(ROOT, CSV_MAC_DINH), danhSach = null, nhom = null,
    out = '/opt/oz-wiki-data/tb-pdf', log = null, loiNap = null,
    limit = 0, rateSleepMs = 1100, retry = 2, ghiLoiNap = true,
  } = options || {};
  const tepLog = log || join(out, FILE_NHAT_KY_MAC_DINH);
  const tepLoi = loiNap || join(out, FILE_LOI_NAP_MAC_DINH);
  const rows = docCsvObject(readFileSync(csv, 'utf8'));
  const chiMuc = docChiMucPDF(rows);
  let danhSachTB = [];
  if (nhom) {
    const n = chuanHoaNhom(nhom);
    const ds = docDanhSachTB(danhSach || join(ROOT, KET_QUA_MAC_DINH));
    danhSachTB = ds.filter((r) => chuanHoaNhom(r.nhom_hs).startsWith(n));
  }
  let muc = [...soHieu, ...danhSachTB.map((r) => r.so_hieu)];
  muc = [...new Set(muc.map((s) => String(s).trim()).filter(Boolean))];
  if (limit > 0) muc = muc.slice(0, limit);
  const tong = muc.length;
  let ok = 0;
  const ket = [];
  for (const [i, sh] of muc.entries()) {
    const r = await taiMotTB(sh, { chiMuc, out, log: tepLog, loiNap: tepLoi, rateSleepMs, retry, ghiLoiNap });
    if (r.trang_thai === 'ok') ok += 1;
    ket.push({ so_hieu: sh, ...r });
    if ((i + 1) % 10 === 0 || i + 1 === tong) console.log(`  ${i + 1}/${tong} · ${ok} tải được`);
  }
  return { tong, ok, ket, log: tepLog, loiNap: tepLoi };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { gia, duong } = docArg(process.argv.slice(2));
  const r = await taiPdf({
    soHieu: duong,
    csv: resolve(gia.csv || join(ROOT, CSV_MAC_DINH)),
    danhSach: gia['danh-sach'] ? resolve(gia['danh-sach']) : null,
    nhom: gia.nhom || null,
    out: resolve(gia.out || '/opt/oz-wiki-data/tb-pdf'),
    log: gia.log ? resolve(gia.log) : null,
    loiNap: gia['loi-nap'] ? resolve(gia['loi-nap']) : null,
    limit: Number(gia.limit || 0) || 0,
    rateSleepMs: Number(gia['rate-sleep-ms'] ?? 1100),
    retry: Number(gia.retry ?? 2),
    ghiLoiNap: !gia['khong-ghi-loi-nap'],
  });
  console.log(`Tải được ${r.ok}/${r.tong} PDF · nhật ký: ${r.log}${r.loiNap ? ` · lỗi: ${r.loiNap}` : ''}`);
  process.exit(r.ok > 0 || r.tong === 0 ? 0 : 1);
}
