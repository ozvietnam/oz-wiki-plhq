#!/usr/bin/env node
// Trích nội dung cấu trúc của 1 TB-TCHQ từ file PDF (nền của việc nạp tầng nội dung TB — issue #232).
//
//   node tools/trich-noi-dung-tb.mjs <file.pdf> [--out-dir=<thư mục>] [--so-hieu=<số hiệu>] [--nhom=<hs4>]
//
// Cách làm:
//   1. thử `pdftotext -layout` — PDF có lớp chữ thì lấy thẳng;
//   2. không có lớp chữ (đa số TB-TCHQ là ảnh scan) → `pdftoppm -r 150 -png` + `tesseract -l vie --psm 4` từng trang;
//   3. rút 5 trường: ten_hang, dac_tinh, ma_ket_luan_8_so, ly_do (nhóm→phân nhóm→mã), don_vi_de_nghi;
//   4. bỏ tên doanh nghiệp / MST / số tờ khai (luật riêng tư của kho công khai);
//   5. ghi 1 tệp JSON/TB vào --out-dir. Nếu đã qua OCR → canh_bao_ocr: true.
//
// KHÔNG bịa: không trích được thì ghi trang_thai "khong_trich_duoc" + lý do cụ thể.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import {
  docArg, giaiMaSoHieuTrongVanBan, slugTB,
  tachSoHieu, trichDacTinh, trichDonViDeNghi, trichLyDo, trichMaKetLuan8So, trichTenHang,
} from './lib/tb-tchq.mjs';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');

/** Chạy lệnh hệ thống; null = không có lệnh trên máy. */
function chay(cmd, argv, { maxBuffer = 64 * 1024 * 1024 } = {}) {
  try {
    return execFileSync(cmd, argv, { encoding: 'utf8', maxBuffer });
  } catch (e) {
    if (e && e.code === 'ENOENT') return null;
    return e.stdout || '';
  }
}

/** Số trang của PDF (pdfinfo nếu có, không có thì đếm "Trang N/M"). */
export function demTrang(tep) {
  const info = chay('pdfinfo', [tep]);
  if (info) {
    const m = info.match(/^Pages:\s+(\d+)/m);
    if (m) return Number(m[1]);
  }
  const txt = chay('pdftotext', ['-layout', tep, '-']);
  if (!txt) return 0;
  const ds = [...txt.matchAll(/\bTrang\s+\d+\s*\/\s*(\d+)/gi)].map((m) => Number(m[1]));
  return ds.length ? Math.max(...ds) : 0;
}

/** Lấy chữ trong PDF: lớp chữ trước, không có thì OCR từng trang. */
export function layChuTrongPDF(tep, { minChu = 200, dpi = 150, lang = 'vie', psm = 4 } = {}) {
  const txt = chay('pdftotext', ['-layout', tep, '-']);
  if (txt === null) {
    return { chu: '', cach: 'khong_co_pdftotext', trang: 0, canh_bao_ocr: false, loi: 'máy không có pdftotext (poppler)' };
  }
  if (txt.replace(/\s/g, '').length >= minChu) {
    return { chu: txt, cach: 'pdftotext', trang: demTrang(tep), canh_bao_ocr: false };
  }
  // realpath: trên macOS /tmp là symlink → /private/tmp; leptonica (tesseract) đọc
  // đường dẫn bắt đầu bằng "/tmp/" thì không mở được tệp ảnh.
  const thuMuc = mkdtempSync(join(realpathSync(tmpdir()), 'tb-ocr-'));
  try {
    const tien = join(thuMuc, 'trang');
    const kq = chay('pdftoppm', ['-r', String(dpi), '-png', tep, tien]);
    if (kq === null) {
      return { chu: '', cach: 'khong_co_pdftoppm', trang: 0, canh_bao_ocr: false, loi: 'máy không có pdftoppm (poppler)' };
    }
    const anhs = readdirSync(thuMuc)
      .filter((f) => f.endsWith('.png'))
      .sort((a, b) => Number(a.match(/(\d+)\.png$/)?.[1] || 0) - Number(b.match(/(\d+)\.png$/)?.[1] || 0));
    if (!anhs.length) {
      return { chu: '', cach: 'khong_co_anh', trang: 0, canh_bao_ocr: false, loi: 'pdftoppm không sinh được ảnh trang nào' };
    }
    const trang = [];
    let loi = null;
    for (const anh of anhs) {
      const t = chay('tesseract', [join(thuMuc, anh), 'stdout', '-l', lang, '--psm', String(psm)]);
      if (t === null) { loi = 'máy không có tesseract'; break; }
      trang.push(t);
    }
    return { chu: trang.join('\n'), cach: 'ocr', trang: anhs.length, canh_bao_ocr: true, loi };
  } finally {
    rmSync(thuMuc, { recursive: true, force: true });
  }
}

/** Số hiệu TB đọc được trong PDF (danh sách số) + năm ký. */
export function docSoHieuPDF(chu) {
  const nums = giaiMaSoHieuTrongVanBan(chu);
  const nam = (String(chu).match(/ngày\s+(\d{1,2})\s*tháng\s*(\d{1,2})\s*năm\s*(\d{4})/i) || [])[3];
  return { nums, nam: nam ? Number(nam) : null };
}

/** Số hiệu trong PDF có khớp số hiệu yêu cầu không (chấp nhận nhoè 1–2 số của OCR). */
export function soHieuKhop(numYeuCau, numsTrongPDF) {
  if (!numYeuCau) return null;
  if (!numsTrongPDF || !numsTrongPDF.length) return null;
  if (numsTrongPDF.includes(numYeuCau)) return true;
  const a = String(numYeuCau);
  return numsTrongPDF.some((n) => {
    const b = String(n);
    if (a.length !== b.length) return false;
    let lech = 0;
    for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) lech += 1;
    return lech <= 1;   // sai 1 chữ số: nhiễu OCR hợp lý; sai từ 2: văn bản khác
  });
}

/** Rút 5 trường + tự kiểm "không bịa": thiếu gì thì nói rõ, không đoán bừa. */
export function trichTruong(chu) {
  const tenHang = trichTenHang(chu);
  const dacTinh = trichDacTinh(chu);
  const ma = trichMaKetLuan8So(chu);
  const lyDo = trichLyDo(chu);
  const donVi = trichDonViDeNghi(chu);
  const thieu = [];
  if (!ma) thieu.push('không tìm thấy mã kết luận 8 số');
  if (!lyDo) thieu.push('không tìm thấy chuỗi kết luận "thuộc nhóm … mã số …"');
  if (!tenHang && !dacTinh) thieu.push('không tìm thấy tên hàng lẫn đặc tính hàng hóa');
  return {
    ten_hang: tenHang,
    dac_tinh: dacTinh,
    ma_ket_luan_8_so: ma,
    ly_do: lyDo ? lyDo.ly_do : null,
    don_vi_de_nghi: donVi,
    trang_thai: thieu.length ? 'khong_trich_duoc' : 'ok',
    ly_do_khong_trich: thieu.length ? thieu.join('; ') : null,
  };
}

/** Trích 1 TB từ 1 tệp PDF; ghi JSON nếu ghi=true. */
export function trichNoiDung(tep, options = {}) {
  const {
    outDir = join(ROOT, 'data/customs/processed/tb-noi-dung'), soHieu = null, nhomHs = null,
    minChu = 200, dpi = 150, lang = 'vie', psm = 4, ghi = true,
  } = options;
  if (!existsSync(tep)) throw new Error(`không thấy tệp PDF: ${tep}`);
  const bytes = statSync(tep).size;
  const sha256 = createHash('sha256').update(readFileSync(tep)).digest('hex');
  const { chu, cach, trang, canh_bao_ocr, loi } = layChuTrongPDF(tep, { minChu, dpi, lang, psm });
  const trong = docSoHieuPDF(chu);
  const req = tachSoHieu(soHieu);
  const khop = soHieuKhop(req.num, trong.nums);
  let soHieuDung = soHieu;
  if (!soHieuDung && trong.nums.length) {
    soHieuDung = `${trong.nums[0]}/TB-TCHQ${trong.nam ? `/${trong.nam}` : ''}`;
  }
  const slug = soHieuDung ? slugTB(soHieuDung) : basename(tep).replace(/\.pdf$/i, '');
  const du = trichTruong(chu);
  let trang_thai = du.trang_thai;
  let ly_do_khong_trich = du.ly_do_khong_trich;
  if (khop === false) {
    trang_thai = 'khong_trich_duoc';
    ly_do_khong_trich = `PDF không chứa số hiệu đã yêu cầu (${req.num}; trong PDF đọc được: ${trong.nums.join(', ') || 'không đọc được'})`;
  } else if (req.nam && trong.nam && req.nam !== trong.nam) {
    trang_thai = 'khong_trich_duoc';
    ly_do_khong_trich = `năm trong PDF (${trong.nam}) khác năm của số hiệu yêu cầu (${req.nam})`;
  }
  const ket = {
    so_hieu: soHieuDung,
    nhom_hs: nhomHs || null,
    ten_hang: du.ten_hang,
    dac_tinh: du.dac_tinh,
    ma_ket_luan_8_so: du.ma_ket_luan_8_so,
    ly_do: du.ly_do,
    don_vi_de_nghi: du.don_vi_de_nghi,
    trang_thai,
    ly_do_khong_trich,
    canh_bao_ocr: !!canh_bao_ocr,
    nguon: {
      tep,
      sha256,
      bytes,
      trang,
      cach_lay_chu: cach,
      so_hieu_trong_pdf: trong.nums.length ? trong.nums.join(', ') : null,
      so_hieu_khop: khop,
      loi_he_thong: loi || null,
    },
    trich_xuat_luc: new Date().toISOString(),
  };
  let tepJson = null;
  if (ghi) {
    mkdirSync(outDir, { recursive: true });
    tepJson = join(outDir, `${slug}.json`);
    writeFileSync(tepJson, `${JSON.stringify(ket, null, 2)}\n`);
  }
  return { ...ket, slug, tepJson };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { gia, duong } = docArg(process.argv.slice(2));
  if (!duong.length) {
    console.error('Cách dùng: node tools/trich-noi-dung-tb.mjs <file.pdf> [--out-dir <dir>] [--so-hieu <số hiệu>] [--nhom <hs4>]');
    process.exit(2);
  }
  const kq = trichNoiDung(resolve(duong[0]), {
    outDir: resolve(gia['out-dir'] || join(ROOT, 'data/customs/processed/tb-noi-dung')),
    soHieu: gia['so-hieu'] || null,
    nhomHs: gia.nhom || null,
    minChu: Number(gia['min-chu'] || 200),
    dpi: Number(gia.dpi || 150),
    lang: gia.lang || 'vie',
    psm: Number(gia.psm || 4),
  });
  console.log(`${kq.so_hieu || basename(duong[0])} → ${kq.trang_thai}${kq.canh_bao_ocr ? ' (OCR)' : ''} · ${kq.tepJson}`);
  if (kq.trang_thai !== 'ok') console.log(`  lý do: ${kq.ly_do_khong_trich}`);
  process.exit(kq.trang_thai === 'ok' ? 0 : 1);
}
