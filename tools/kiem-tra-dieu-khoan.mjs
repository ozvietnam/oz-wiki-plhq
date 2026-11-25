#!/usr/bin/env node
// Kiểm tra đối chiếu nguyên văn xac_minh.dieu_khoan với tệp toàn văn trên đĩa (.pdf / .txt / .md)
// và băm SHA-256 tệp PDF nguồn. An toàn trên môi trường thiếu pdftotext (CI Linux).
//   node tools/kiem-tra-dieu-khoan.mjs [--json] [--no-pdf]
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { extname, isAbsolute, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { napSo, ROOT } from './lib/registry.mjs';

const RE_SHA256 = /^[0-9a-f]{64}$/i;
const RE_CONG_BAO_HEADER = /^\s*CÔNG BÁO\/Số[^\r\n]*(?:\r?\n+\s*\d{1,4}\s*(?=\r?\n|$))?/gim;
const MAX_PDFTOTEXT_BUFFER = 64 * 1024 * 1024;
const NGUONG_KY_TU_LOP_CHU = 50;

/**
 * Chuẩn hóa chuỗi để so khớp nguyên văn chịu ngắt dòng, dấu câu, ngoặc kép/cong, gạch nối, hoa/thường.
 * @param {string} text
 * @returns {string}
 */
export function chuanHoaKhopNguyenVan(text) {
  return String(text ?? '')
    .normalize('NFC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function phatHienPdftotext() {
  try {
    const r = spawnSync('pdftotext', ['-v'], { encoding: 'utf8' });
    return !r.error && (r.status === 0 || /pdftotext/i.test(`${r.stdout || ''}${r.stderr || ''}`));
  } catch {
    return false;
  }
}

function tachTrang(rawText) {
  const pages = String(rawText ?? '').split('\f');
  if (pages.length > 1 && pages[pages.length - 1] === '') pages.pop();
  return pages;
}

function boHeaderCongBaoDauTrang(pageText) {
  return String(pageText ?? '').replace(RE_CONG_BAO_HEADER, '');
}

function layDanhSachToanVan(d, root) {
  const raw = d?.toan_van;
  const list = Array.isArray(raw) ? raw : raw != null ? [raw] : [];
  const out = [];
  for (const entry of list) {
    const rel = typeof entry === 'string'
      ? entry.trim()
      : entry && typeof entry === 'object' && typeof (entry.tep || entry.path) === 'string'
        ? String(entry.tep || entry.path).trim()
        : '';
    if (!rel || rel === 'chua_co') continue;
    const abs = isAbsolute(rel) ? rel : join(root, rel);
    out.push({ rel, abs, ext: extname(rel).toLowerCase(), exists: existsSync(abs) });
  }
  return out;
}

function tinhSha256(absPath, cache) {
  if (cache.has(absPath)) return cache.get(absPath);
  const hash = createHash('sha256').update(readFileSync(absPath)).digest('hex');
  cache.set(absPath, hash);
  return hash;
}

function docTaiLieuVanBan(fileInfo, { coPdftotext, docPdf, textCache }) {
  if (textCache.has(fileInfo.abs)) return textCache.get(fileInfo.abs);
  let res;
  if (fileInfo.ext === '.txt' || fileInfo.ext === '.md') {
    try {
      const raw = readFileSync(fileInfo.abs, 'utf8');
      res = { kind: 'text', ok: true, out: raw, pages: tachTrang(raw), trimmedLen: raw.trim().length };
    } catch (e) {
      res = { kind: 'text', ok: false, err: `không đọc được ${fileInfo.rel}: ${e.message}` };
    }
  } else if (fileInfo.ext === '.pdf') {
    if (!coPdftotext) {
      res = { kind: 'pdf', ok: true, skippedMissingPdftotext: true };
    } else if (typeof docPdf === 'function') {
      try {
        const out = String(docPdf(fileInfo.abs) ?? '');
        res = { kind: 'pdf', ok: true, out, pages: tachTrang(out), trimmedLen: out.trim().length };
      } catch (e) {
        res = { kind: 'pdf', ok: false, err: `lỗi đọc PDF ${fileInfo.rel}: ${e.message}` };
      }
    } else {
      // Chế độ layout mặc định xếp chữ theo toạ độ và tùy bản poppler có thể xen
      // kẽ chữ đóng dấu phủ chồng (VD "30"/"3" đè lên chỗ "ngày ....." để trống)
      // vào câu theo thứ tự khác nhau giữa các bản poppler (OZV-2288: CI poppler
      // 26.01 khác máy chạy cục bộ 25.03). Giữ layout làm chính, còn trích thêm
      // chế độ -raw (theo thứ tự dòng nội dung, ổn định giữa các bản poppler) để
      // dùng làm phương án đối chiếu phụ khi layout không khớp.
      const r = spawnSync('pdftotext', [fileInfo.abs, '-'], {
        encoding: 'utf8',
        maxBuffer: MAX_PDFTOTEXT_BUFFER,
      });
      if (r.error || r.status !== 0) {
        const detail = r.error?.message || r.stderr?.trim() || `exit ${r.status}`;
        res = { kind: 'pdf', ok: false, err: `pdftotext lỗi với ${fileInfo.rel}: ${detail}` };
      } else {
        const out = r.stdout || '';
        res = { kind: 'pdf', ok: true, out, pages: tachTrang(out), trimmedLen: out.trim().length };
        res._trichRaw = () => {
          const rr = spawnSync('pdftotext', ['-raw', fileInfo.abs, '-'], {
            encoding: 'utf8',
            maxBuffer: MAX_PDFTOTEXT_BUFFER,
          });
          return rr.error || rr.status !== 0 ? null : (rr.stdout || '');
        };
      }
    }
  } else {
    res = { kind: 'other', ok: true, skippedUnsupported: true };
  }
  textCache.set(fileInfo.abs, res);
  return res;
}

function taoMucLoi(d, it, msg) {
  return {
    file: d._file,
    so_hieu: d.so_hieu || null,
    dieu: it?.dieu ?? null,
    trang_pdf: it?.trang_pdf ?? null,
    msg,
  };
}

function khopTrongCuaSo(normPages, cleanNormPages, start, end, normNoiDung) {
  const normSlice = normPages.slice(start, end).filter(Boolean).join(' ');
  if (normSlice.includes(normNoiDung)) return true;
  const cleanNormSlice = cleanNormPages.slice(start, end).filter(Boolean).join(' ');
  return cleanNormSlice.includes(normNoiDung);
}

function layNormPagesRaw(docRes) {
  if (typeof docRes._trichRaw !== 'function') return null;
  if (docRes._normPagesRaw == null) {
    const rawOut = docRes._trichRaw();
    if (rawOut == null) {
      docRes._normPagesRaw = false;
      return null;
    }
    const rawPages = tachTrang(rawOut);
    docRes._normPagesRaw = rawPages.map((p) => chuanHoaKhopNguyenVan(p));
    docRes._cleanNormPagesRaw = rawPages.map((p) => chuanHoaKhopNguyenVan(boHeaderCongBaoDauTrang(p)));
  }
  return docRes._normPagesRaw === false ? null : { norm: docRes._normPagesRaw, clean: docRes._cleanNormPagesRaw };
}

function kiemTraKhopTrenTaiLieu(docRes, it, normNoiDung) {
  const { pages, out } = docRes;
  if (!docRes._normPages) {
    docRes._normPages = pages.map((p) => chuanHoaKhopNguyenVan(p));
    docRes._cleanNormPages = pages.map((p) => chuanHoaKhopNguyenVan(boHeaderCongBaoDauTrang(p)));
  }
  // Phương án đối chiếu phụ bằng trích -raw (xem _trichRaw): chỉ chạy khi layout không khớp.
  if (it.trang_pdf != null) {
    const p = it.trang_pdf;
    if (p < 1 || p > pages.length) {
      return {
        ok: false,
        reason: `trang_pdf=${p} ngoài khoảng 1..${pages.length}`,
      };
    }
    const start = Math.max(0, p - 2);
    const end = Math.min(pages.length, p + 1);
    if (khopTrongCuaSo(docRes._normPages, docRes._cleanNormPages, start, end, normNoiDung)) return { ok: true };
    const raw = layNormPagesRaw(docRes);
    if (raw && khopTrongCuaSo(raw.norm, raw.clean, start, end, normNoiDung)) return { ok: true, cheDo: 'raw' };
    return {
      ok: false,
      reason: `không khớp nguyên văn tại trang_pdf=${p} (đã kiểm trang ${start + 1}..${end}, layout và -raw)`,
    };
  }
  if (docRes._normOut == null) {
    docRes._normOut = chuanHoaKhopNguyenVan(out);
    docRes._cleanNormOut = pages.length > 1
      ? docRes._cleanNormPages.filter(Boolean).join(' ')
      : docRes._normOut;
  }
  if (docRes._normOut.includes(normNoiDung)) return { ok: true };
  if (pages.length > 1 && docRes._cleanNormOut.includes(normNoiDung)) return { ok: true };
  const raw = layNormPagesRaw(docRes);
  if (raw) {
    const normRawOut = raw.norm.filter(Boolean).join(' ');
    if (normRawOut.includes(normNoiDung)) return { ok: true, cheDo: 'raw' };
    if (pages.length > 1 && raw.clean.filter(Boolean).join(' ').includes(normNoiDung)) return { ok: true, cheDo: 'raw' };
  }
  return { ok: false, reason: 'không khớp nguyên văn trong toàn bộ văn bản (layout và -raw)' };
}

/**
 * Kiểm tra toàn bộ `xac_minh.dieu_khoan` trong sổ đăng ký.
 * @param {object} so Kết quả từ `napSo(root)`
 * @param {object} [options]
 * @param {string} [options.root=ROOT]
 * @param {boolean} [options.kiemTraPdf=true]
 * @param {boolean|null} [options.coPdftotext=null] Cho phép test giả lập có/thiếu pdftotext
 * @param {(absPath: string) => string} [options.docPdf=null] Cho phép test mock đọc PDF
 * @returns {{ loi: Array, canhBao: Array, thongTin: Array, thongKe: object }}
 */
export function kiemTraDieuKhoan(
  so,
  { root = ROOT, kiemTraPdf = true, coPdftotext = null, docPdf = null } = {},
) {
  const dsVanBan = so?.vanBan || [];
  const loi = [];
  const canhBao = [];
  const thongTin = [];
  const shaCache = new Map();
  const textCache = new Map();

  const pdfToolReady = kiemTraPdf === false
    ? null
    : typeof coPdftotext === 'boolean'
      ? coPdftotext
      : phatHienPdftotext();

  const thongKe = {
    coPdftotext: pdfToolReady,
    tongVanBan: dsVanBan.length,
    soVanBanCoDieuKhoan: 0,
    soDieuKhoan: 0,
    soDieuKhoanDaDoiChieu: 0,
    soDieuKhoanKhop: 0,
    soDieuKhoanBoQuaPdfScan: 0,
    soDieuKhoanBoQuaThieuPdftotext: 0,
    soTepDieuKhoanDayDu: 0,
    soDieuKhoanDayDu: 0,
    soLoi: 0,
    soCanhBao: 0,
    soThongTin: 0,
  };

  function kiemTraDanhSachMuc(d, dkRaw, sourceLabel) {
    const toanVanList = layDanhSachToanVan(d, root);
    let daGhiThongTinThieuPdftotext = false;
    let daGhiThongTinUnsupported = false;
    let daGhiThongTinScan = false;

    for (let i = 0; i < dkRaw.length; i++) {
      const it = dkRaw[i];
      if (!it || typeof it !== 'object' || Array.isArray(it)) {
        loi.push(taoMucLoi(d, null, `${sourceLabel} [${i}]: mục dieu_khoan phải là object`));
        continue;
      }

      const label = `${sourceLabel} Điều ${it.dieu ?? '?'} (mục [${i}])`;
      let mucHopLe = true;

      if (typeof it.dieu !== 'number' || !Number.isInteger(it.dieu) || it.dieu < 1) {
        loi.push(taoMucLoi(d, it, `${label}: dieu phải là số nguyên >= 1`));
        mucHopLe = false;
      }

      const normNoiDung = typeof it.noi_dung === 'string' ? chuanHoaKhopNguyenVan(it.noi_dung) : '';
      if (typeof it.noi_dung !== 'string' || !it.noi_dung.trim() || !normNoiDung) {
        loi.push(taoMucLoi(d, it, `${label}: noi_dung không được trống`));
        mucHopLe = false;
      }

      let trangHopLeSoNguyen = true;
      if (it.trang_pdf != null && (typeof it.trang_pdf !== 'number' || !Number.isInteger(it.trang_pdf) || it.trang_pdf < 1)) {
        loi.push(taoMucLoi(d, it, `${label}: trang_pdf=${it.trang_pdf} phải là số nguyên >= 1`));
        trangHopLeSoNguyen = false;
      }

      // Kiểm SHA-256 thuần Node (chạy trên mọi môi trường kể cả khi kiemTraPdf=false)
      let matchedFiles = toanVanList;
      if (it.sha256_pdf != null) {
        const expectedSha = String(it.sha256_pdf).trim().toLowerCase();
        if (!RE_SHA256.test(expectedSha)) {
          loi.push(taoMucLoi(d, it, `${label}: sha256_pdf "${it.sha256_pdf}" sai định dạng 64 hex`));
        } else if (toanVanList.length === 0) {
          loi.push(taoMucLoi(d, it, `${label}: khai báo sha256_pdf nhưng thiếu tệp toan_van`));
        } else {
          const missing = toanVanList.filter((f) => !f.exists);
          const existing = toanVanList.filter((f) => f.exists);
          if (existing.length === 0) {
            loi.push(taoMucLoi(d, it, `${label}: thiếu tệp toan_van trên đĩa (${missing.map((f) => f.rel).join(', ')})`));
          } else {
            const khopSha = existing.filter((f) => tinhSha256(f.abs, shaCache) === expectedSha);
            if (khopSha.length === 0) {
              const actuals = existing.map((f) => `${f.rel}=${tinhSha256(f.abs, shaCache)}`).join(', ');
              loi.push(taoMucLoi(d, it, `${label}: lệch sha256_pdf (khai báo ${expectedSha}; thực tế ${actuals})`));
            } else {
              matchedFiles = khopSha;
            }
          }
        }
      }

      if (kiemTraPdf === false || !mucHopLe) continue;

      if (toanVanList.length === 0) {
        loi.push(taoMucLoi(d, it, `${label}: thiếu tệp toan_van để đối chiếu nguyên văn`));
        continue;
      }
      const existingFiles = matchedFiles.filter((f) => f.exists);
      if (existingFiles.length === 0) {
        loi.push(taoMucLoi(d, it, `${label}: không tìm thấy tệp toan_van trên đĩa (${matchedFiles.map((f) => f.rel).join(', ')})`));
        continue;
      }

      // Đọc nội dung văn bản từ các tệp toan_van hiện có
      const docResults = existingFiles.map((f) => ({
        fileInfo: f,
        res: docTaiLieuVanBan(f, { coPdftotext: pdfToolReady, docPdf, textCache }),
      }));

      for (const { res } of docResults) {
        if (!res.ok) loi.push(taoMucLoi(d, it, `${label}: ${res.err}`));
      }
      const readyDocs = docResults.filter(({ res }) => res.ok);
      if (readyDocs.length === 0) continue;

      // Trường hợp PDF bị bỏ qua vì thiếu pdftotext trên máy
      const onlyMissingPdftotext = readyDocs.every(({ res }) => res.skippedMissingPdftotext);
      if (onlyMissingPdftotext) {
        thongKe.soDieuKhoanBoQuaThieuPdftotext += 1;
        if (!daGhiThongTinThieuPdftotext) {
          thongTin.push({
            file: d._file,
            so_hieu: d.so_hieu || null,
            msg: `${d.so_hieu || d._file}: thiếu pdftotext trên máy — bỏ qua đối chiếu lớp chữ PDF`,
          });
          daGhiThongTinThieuPdftotext = true;
        }
        continue;
      }

      // Trường hợp định dạng không phải .txt/.md/.pdf
      const checkableDocs = readyDocs.filter(({ res }) => !res.skippedMissingPdftotext && !res.skippedUnsupported);
      if (checkableDocs.length === 0) {
        if (!daGhiThongTinUnsupported) {
          thongTin.push({
            file: d._file,
            so_hieu: d.so_hieu || null,
            msg: `${d.so_hieu || d._file}: định dạng toan_van chưa hỗ trợ đối chiếu lớp chữ (${existingFiles.map((f) => f.ext || f.rel).join(', ')})`,
          });
          daGhiThongTinUnsupported = true;
        }
        continue;
      }

      // Kiểm PDF scan (< 50 ký tự lớp chữ)
      const textLayerDocs = checkableDocs.filter(({ res }) => res.kind === 'text' || res.trimmedLen >= NGUONG_KY_TU_LOP_CHU);
      if (textLayerDocs.length === 0) {
        if (it.trang_pdf != null) {
          if (trangHopLeSoNguyen) {
            loi.push(taoMucLoi(d, it, `${label}: khai báo trang_pdf=${it.trang_pdf} trên PDF không có lớp chữ (< ${NGUONG_KY_TU_LOP_CHU} ký tự)`));
          }
        } else {
          thongKe.soDieuKhoanBoQuaPdfScan += 1;
          if (!daGhiThongTinScan) {
            thongTin.push({
              file: d._file,
              so_hieu: d.so_hieu || null,
              msg: `${d.so_hieu || d._file}: PDF không có lớp chữ (< ${NGUONG_KY_TU_LOP_CHU} ký tự) và không gắn trang_pdf — bỏ qua đối chiếu lớp chữ`,
            });
            daGhiThongTinScan = true;
          }
        }
        continue;
      }

      if (!trangHopLeSoNguyen) continue;

      thongKe.soDieuKhoanDaDoiChieu += 1;
      const verdicts = textLayerDocs.map(({ res }) => kiemTraKhopTrenTaiLieu(res, it, normNoiDung));
      if (verdicts.some((v) => v.ok)) {
        thongKe.soDieuKhoanKhop += 1;
      } else {
        const reasons = verdicts.map((v) => v.reason).join('; ');
        loi.push(taoMucLoi(
          d,
          it,
          `${label}${it.trang_pdf != null ? ` (trang_pdf=${it.trang_pdf})` : ''}: ${reasons}`,
        ));
      }
    }
  }

  for (const d of dsVanBan) {
    const dkRaw = d?.xac_minh?.dieu_khoan;
    if (dkRaw == null) continue;
    if (!Array.isArray(dkRaw)) {
      loi.push(taoMucLoi(d, null, `${d.so_hieu || d._file}: xac_minh.dieu_khoan phải là danh sách`));
      continue;
    }
    if (dkRaw.length === 0) continue;

    thongKe.soVanBanCoDieuKhoan += 1;
    thongKe.soDieuKhoan += dkRaw.length;
    kiemTraDanhSachMuc(d, dkRaw, d.so_hieu || d._file);
  }

  const dayDuDir = join(root, 'data', 'dieu-khoan-day-du');
  if (existsSync(dayDuDir)) {
    const bySlug = new Map(dsVanBan.filter((d) => d?._slug).map((d) => [d._slug, d]));
    const files = readdirSync(dayDuDir).filter((f) => f.endsWith('.dieu.jsonl')).sort();
    for (const f of files) {
      thongKe.soTepDieuKhoanDayDu += 1;
      const slug = f.replace(/\.dieu\.jsonl$/, '');
      const rel = `data/dieu-khoan-day-du/${f}`;
      const d = bySlug.get(slug);
      if (!d) {
        loi.push({ file: rel, so_hieu: null, dieu: null, trang_pdf: null, msg: `${rel}: tệp điều khoản đầy đủ mồ côi (không tìm thấy slug "${slug}" trong sổ)` });
        continue;
      }
      if (d.xac_minh?.muc !== 'NGUON_A' && !(Array.isArray(d.xac_minh?.dieu_khoan) && d.xac_minh.dieu_khoan.length > 0)) {
        loi.push(taoMucLoi(d, null, `${rel}: văn bản "${slug}" không thuộc NGUON_A`));
        continue;
      }
      const raw = readFileSync(join(dayDuDir, f), 'utf8');
      const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length === 0) {
        loi.push(taoMucLoi(d, null, `${rel}: tệp rỗng`));
        continue;
      }
      const items = [];
      let jsonLoi = false;
      lines.forEach((line, idx) => {
        try {
          items.push(JSON.parse(line));
        } catch (e) {
          jsonLoi = true;
          loi.push(taoMucLoi(d, null, `${rel} dòng ${idx + 1}: JSON không hợp lệ (${e.message})`));
        }
      });
      if (!jsonLoi) {
        thongKe.soDieuKhoanDayDu += items.length;
        kiemTraDanhSachMuc(d, items, rel);
      }
    }
  }

  thongKe.soLoi = loi.length;
  thongKe.soCanhBao = canhBao.length;
  thongKe.soThongTin = thongTin.length;
  return { loi, canhBao, thongTin, thongKe };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const kiemTraPdf = !process.argv.includes('--no-pdf');
  const r = kiemTraDieuKhoan(napSo(), { root: ROOT, kiemTraPdf });
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(r, null, 2));
  } else {
    for (const info of r.thongTin) console.log(`THÔNG TIN ${info.file}: ${info.msg}`);
    for (const w of r.canhBao) console.log(`CẢNH BÁO  ${w.file}: ${w.msg}`);
    for (const e of r.loi) console.log(`LỖI       ${e.file}: ${e.msg}`);
    const k = r.thongKe;
    const dayDuNote = k.soTepDieuKhoanDayDu ? ` + đầy đủ ${k.soTepDieuKhoanDayDu} tệp (${k.soDieuKhoanDayDu} mục)` : '';
    console.log(
      `\n${k.soVanBanCoDieuKhoan} văn bản có điều khoản (${k.soDieuKhoan} mục)${dayDuNote} · khớp nguyên văn ${k.soDieuKhoanKhop}/${k.soDieuKhoanDaDoiChieu} đã đối chiếu · bỏ qua scan ${k.soDieuKhoanBoQuaPdfScan} · ${k.soLoi} lỗi · ${k.soCanhBao} cảnh báo`,
    );
  }
  process.exitCode = r.loi.length ? 1 : 0;
}
