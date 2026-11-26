#!/usr/bin/env node
// Vòng lặp tự động an toàn: tìm ứng viên còn thiếu toàn văn nguồn bậc A (Nhóm 1)
// hoặc đã có toàn văn NGUON_A nhưng chưa trích điều khoản đầy đủ (Nhóm 2),
// thực thi theo từng văn bản với snapshot + rollback nguyên tử, đối chiếu qua
// `kiem-tra-dieu-khoan.mjs` trước khi giữ kết quả.
//
//   node tools/tu-tai-toan-van.mjs [--limit 5] [--slug <slug>] [--max-file-mb 25]
//                                  [--dry-run] [--json] [--markdown <file|->] [--root <dir>] [--help]
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import yaml from 'js-yaml';
import { kiemTra } from './kiem-tra.mjs';
import { kiemTraDieuKhoan } from './kiem-tra-dieu-khoan.mjs';
import { kiemTraPdfCoLopChu } from './lib/kiem-tra-raw.mjs';
import { bacNguon, boDau, khoa, napSo, ROOT } from './lib/registry.mjs';
import { laTbTchq, layDanhSachToanVan, uuTienNguonDoc } from './trich-dieu-khoan.mjs';
import { chayTrichDieuKhoanDayDu } from './trich-dieu-khoan-day-du.mjs';

export const MAC_DINH_LIMIT = 5;
export const MAC_DINH_MAX_FILE_MB = 25;
export const CHAN_BO_QUA_TU_TAI = new Set(['THIEU_PDF_A', 'CHO_CONG_BO_A', 'SO_HIEU_LECH']);
const DOC_EXTS_HOP_LE = new Set(['.pdf', '.txt', '.docx']);
const STOPWORDS_TIEU_DE = new Set([
  'cua', 've', 'so', 'quy', 'dinh', 'mot', 'dieu', 'luat', 'bo', 'nghi', 'thong', 'tu',
  'quyet', 'van', 'ban', 'chinh', 'phu', 'bo', 'truong', 'thu', 'tuong', 'ngay', 'thang', 'nam',
  'hanh', 'sua', 'doi', 'sung', 'bai', 'chi', 'tiet', 'bien', 'phap', 'thi', 'va', 'cac', 'trong',
  'linh', 'vuc', 'nuoc', 'cong', 'hoa',
]);

/** Bỏ qua các thông báo phân loại hàng hóa / TB-TCHQ / TB-CHQ (đã có pipeline riêng). */
export function laTbTchqHoacThongBaoHq(doc) {
  if (!doc) return false;
  if (laTbTchq(doc)) return true;
  return doc.loai === 'THONG_BAO' && /TB-(?:TCHQ|CHQ)/i.test(String(doc.so_hieu || ''));
}

function laUrlVbpl(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '').toLowerCase();
    return host === 'vbpl.vn' || host.endsWith('.vbpl.vn');
  } catch {
    return false;
  }
}

function xepHangUrlBacA(url) {
  let u;
  try {
    u = new URL(url);
  } catch {
    return [9, 9];
  }
  const host = u.hostname.replace(/^www\./, '').toLowerCase();
  const fileName = u.searchParams.get('file_name') || '';
  const isPdf = /\.pdf(?:$|[?#])/i.test(u.pathname) || /\.pdf$/i.test(fileName) ? 0 : 1;
  let hostRank = 2;
  if (
    host === 'datafiles.chinhphu.vn'
    || host === 'congbaocdn.chinhphu.vn'
    || host.endsWith('.cdnchinhphu.vn')
  ) {
    hostRank = 0;
  } else if (
    host === 'congbao.chinhphu.vn'
    || host === 'vanban.chinhphu.vn'
    || host === 'chinhphu.vn'
    || host.endsWith('.chinhphu.vn')
  ) {
    hostRank = 1;
  }
  return [isPdf, hostRank];
}

/** Chọn danh sách URL bậc A hợp lệ (loại `vbpl.vn`, ưu tiên `.pdf` và tên miền Chính phủ/Công báo). */
export function chonUrlBacA(doc, nguonConfig = {}) {
  const rawList = Array.isArray(doc?.nguon) ? doc.nguon : [];
  const valid = [];
  rawList.forEach((entry, idx) => {
    const url = typeof entry === 'string'
      ? entry.trim()
      : entry && typeof entry === 'object' && typeof entry.url === 'string'
        ? entry.url.trim()
        : '';
    if (!url) return;
    let u;
    try {
      u = new URL(url);
    } catch {
      return;
    }
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return;
    if (laUrlVbpl(url)) return;
    if (bacNguon(url, nguonConfig) !== 'A') return;
    const [isPdf, hostRank] = xepHangUrlBacA(url);
    valid.push({ url, isPdf, hostRank, idx });
  });

  valid.sort((a, b) => a.isPdf - b.isPdf || a.hostRank - b.hostRank || a.idx - b.idx);
  if (valid.length === 0) return null;
  return {
    bestUrl: valid[0].url,
    urls: valid.map((v) => v.url),
    uuTienPdf: valid[0].isPdf === 0,
  };
}

function tachBienTheKhoaSoHieu(doc) {
  const ds = [doc?.so_hieu, ...(Array.isArray(doc?.so_hieu_khac) ? doc.so_hieu_khac : [])]
    .filter(Boolean)
    .map((s) => String(s).trim());
  const out = new Set();
  for (const s of ds) {
    out.add(khoa(s));
    const boNam = s.replace(/^(\d+\/)\d{4}\//, '$1');
    if (boNam !== s) out.add(khoa(boNam));
    if (doc?.loai === 'VAN_BAN_HOP_NHAT') {
      const shortVbhn = s.replace(/\/\d{4}(\/VBHN-)/i, '$1');
      if (shortVbhn !== s) out.add(khoa(shortVbhn));
    }
  }
  return out;
}

/**
 * Đối chiếu nhanh phần đầu văn bản PDF/toàn văn mới tải với `so_hieu` và `ten` trong sổ,
 * tránh gắn nhầm PDF văn bản khác liệt kê trong `nguon[]` (vd VBHN thay vì QĐ gốc).
 */
export function kiemTraKhopNoiDungPdf(doc, text) {
  const raw = String(text || '').normalize('NFC').trim();
  if (raw.length < 200) return { khop: true, lyDo: 'CHU_QUA_NGAN' };
  const headText = raw.slice(0, 4000);
  const dsKhoa = tachBienTheKhoaSoHieu(doc);
  if (dsKhoa.size === 0) return { khop: true, lyDo: 'KHONG_CO_SO_HIEU' };

  // 1. Nếu phần đầu trang 1 ghi tường minh `Số: <số hiệu khác>` không thuộc văn bản mục tiêu -> lệch văn bản.
  const firstHeader = raw.slice(0, 1200).match(/(?:^|\n)\s*S[ốo]\s*:\s*([0-9]+\/(?:\d{4}\/)?[A-ZĐÂÊÔƠƯĂ0-9-]+)/im);
  if (firstHeader) {
    const headerKhoa = khoa(firstHeader[1]);
    if (headerKhoa && !dsKhoa.has(headerKhoa)) {
      return { khop: false, lyDo: `SO_HIEU_TRANG_DAU_LECH:${firstHeader[1]}` };
    }
    if (headerKhoa && dsKhoa.has(headerKhoa)) {
      return { khop: true, lyDo: 'KHOP_SO_HIEU_TRANG_DAU' };
    }
  }

  // 2. Fallback: khớp chuỗi số hiệu trong 4000 ký tự đầu hoặc tỷ lệ từ khóa tên văn bản >= 0.45.
  const headKhoa = khoa(headText);
  if ([...dsKhoa].some((k) => k && headKhoa.includes(k))) {
    return { khop: true, lyDo: 'KHOP_SO_HIEU_PHAN_DAU' };
  }

  const tenTokens = boDau(doc?.ten || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOPWORDS_TIEU_DE.has(w));
  const headTokens = new Set(
    boDau(headText)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .split(/\s+/),
  );
  const trung = tenTokens.filter((w) => headTokens.has(w)).length;
  const tiLe = tenTokens.length ? trung / tenTokens.length : 0;
  if (tiLe >= 0.45) {
    return { khop: true, lyDo: 'KHOP_TEN_VAN_BAN' };
  }
  return { khop: false, lyDo: 'LECH_SO_HIEU_VA_TEN' };
}

function trichDauPdfText(absPath, { coPdftotext = null, docPdf = null } = {}) {
  if (typeof docPdf === 'function') {
    return String(docPdf(absPath) ?? '');
  }
  if (coPdftotext === false) return '';
  try {
    return execFileSync('pdftotext', ['-f', '1', '-l', '2', '-layout', absPath, '-'], {
      encoding: 'utf8',
      timeout: 8000,
      maxBuffer: 4 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return '';
  }
}

function docLaPdfScanSan(fileInfo, { kiemTraPdf = true, coPdftotext = null, docPdf = null } = {}) {
  const metaPath = `${fileInfo.abs}.nguon.json`;
  if (existsSync(metaPath)) {
    try {
      const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
      if (meta?.loai_tep_raw === 'PDF_BAN_SCAN_CAN_OCR' || meta?.co_lop_chu === false) {
        return { scan: true, lyDo: 'PDF_BAN_SCAN_CAN_OCR' };
      }
    } catch {
      // Bỏ qua nếu .nguon.json lỗi định dạng.
    }
  }
  if (!kiemTraPdf) return { scan: false };
  if (typeof docPdf === 'function') {
    try {
      const text = String(docPdf(fileInfo.abs) ?? '').trim();
      return text.length < 200 ? { scan: true, lyDo: 'PDF_BAN_SCAN_CAN_OCR' } : { scan: false };
    } catch {
      return { scan: true, lyDo: 'LOI_DOC_PDF' };
    }
  }
  if (coPdftotext === false) return { scan: false };
  const pdfCheck = kiemTraPdfCoLopChu(readFileSync(fileInfo.abs));
  if (pdfCheck.trang_thai === 'PDF_BAN_SCAN_CAN_OCR' || pdfCheck.trang_thai === 'LOI_DOC_PDF') {
    return { scan: true, lyDo: pdfCheck.trang_thai };
  }
  return { scan: false };
}

function uuTienTinhTrang(tinhTrang) {
  if (tinhTrang === 'CON_HIEU_LUC') return 0;
  if (tinhTrang === 'HET_HIEU_LUC_MOT_PHAN') return 1;
  return 2;
}

/**
 * Tìm ứng viên cho vòng lặp tự tải toàn văn & trích điều khoản:
 * - Nhóm 1 (`can_tai_toan_van`): có URL bậc A hợp lệ (loại `vbpl.vn`) và chưa có `toan_van` dùng được trên đĩa.
 * - Nhóm 2 (`can_trich_dieu_khoan`): `NGUON_A`, có `.pdf`/`.txt`/`.ocr.txt`/`.docx` đọc được (không phải PDF scan cần OCR),
 *   và chưa có `data/dieu-khoan-day-du/<slug>.dieu.jsonl`.
 */
export function timUngVienTuTai({
  root = ROOT,
  limit = MAC_DINH_LIMIT,
  slug = null,
  so = null,
  kiemTraPdf = true,
  coPdftotext = null,
  docPdf = null,
} = {}) {
  const registry = so || napSo(root);
  const slugFilter = slug ? String(slug).trim() : null;

  const canTai = [];
  const canTrich = [];

  for (const d of registry.vanBan || []) {
    if (slugFilter && d._slug !== slugFilter) continue;
    if (laTbTchqHoacThongBaoHq(d)) continue;

    const allTv = layDanhSachToanVan(d, root).filter((f) => !f.isWiki);
    const hasExistingTv = Boolean(d.toan_van && d.toan_van !== 'chua_co' && allTv.some((f) => f.exists));

    if (!hasExistingTv) {
      if (CHAN_BO_QUA_TU_TAI.has(d.xac_minh?.chan?.ma)) continue;
      const urlInfo = chonUrlBacA(d, registry.nguon);
      if (urlInfo) {
        canTai.push({
          nhom: 'can_tai_toan_van',
          slug: d._slug,
          so_hieu: d.so_hieu || null,
          loai: d.loai || null,
          tinh_trang: d.tinh_trang || null,
          file: d._file,
          muc_xac_minh: d.xac_minh?.muc || null,
          url: urlInfo.bestUrl,
          urls_bac_a: urlInfo.urls,
          uu_tien_pdf: urlInfo.uuTienPdf,
          _doc: d,
        });
      }
      continue;
    }

    if (d.xac_minh?.muc !== 'NGUON_A') continue;
    const jsonlPath = join(root, 'data', 'dieu-khoan-day-du', `${d._slug}.dieu.jsonl`);
    if (existsSync(jsonlPath)) continue;

    const readable = allTv
      .filter((f) => f.exists && (f.isOcrTxt || DOC_EXTS_HOP_LE.has(f.ext)))
      .sort((a, b) => uuTienNguonDoc(a) - uuTienNguonDoc(b));
    if (readable.length === 0) continue;

    const nonPdf = readable.find((f) => f.ext !== '.pdf');
    if (!nonPdf) {
      const scanRes = docLaPdfScanSan(readable[0], { kiemTraPdf, coPdftotext, docPdf });
      if (scanRes.scan) continue;
    }

    const chosenSource = nonPdf || readable[0];
    canTrich.push({
      nhom: 'can_trich_dieu_khoan',
      slug: d._slug,
      so_hieu: d.so_hieu || null,
      loai: d.loai || null,
      tinh_trang: d.tinh_trang || null,
      file: d._file,
      muc_xac_minh: d.xac_minh?.muc || null,
      toan_van: chosenSource.rel,
      _doc: d,
    });
  }

  canTai.sort(
    (a, b) => (a.uu_tien_pdf === b.uu_tien_pdf ? 0 : a.uu_tien_pdf ? -1 : 1)
      || uuTienTinhTrang(a.tinh_trang) - uuTienTinhTrang(b.tinh_trang)
      || a.slug.localeCompare(b.slug),
  );
  canTrich.sort(
    (a, b) => (a.loai === 'CONG_VAN' ? 1 : 0) - (b.loai === 'CONG_VAN' ? 1 : 0)
      || uuTienTinhTrang(a.tinh_trang) - uuTienTinhTrang(b.tinh_trang)
      || a.slug.localeCompare(b.slug),
  );

  // Khử trùng theo slug: nếu `--slug` hoặc đã có sẵn toàn văn thì ưu tiên Nhóm 2; ngược lại Nhóm 1 rồi Nhóm 2.
  const ordered = slugFilter ? [...canTrich, ...canTai] : [...canTai, ...canTrich];
  const seen = new Set();
  const deduped = [];
  for (const item of ordered) {
    if (seen.has(item.slug)) continue;
    seen.add(item.slug);
    deduped.push(item);
  }

  const maxCount = Number.isInteger(limit) && limit > 0 ? limit : MAC_DINH_LIMIT;
  const duocChon = slugFilter ? deduped : deduped.slice(0, maxCount);

  return {
    tong_van_ban: (registry.vanBan || []).length,
    can_tai_toan_van: canTai,
    can_trich_dieu_khoan: canTrich,
    duoc_chon: duocChon,
    limit: maxCount,
    slug: slugFilter,
  };
}

function lietKeTepDeQuy(dir, out = new Set()) {
  if (!existsSync(dir)) return out;
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) lietKeTepDeQuy(p, out);
    else out.add(p);
  }
  return out;
}

function donThuMucRong(dir, stopDir) {
  let cur = dir;
  while (cur && cur.startsWith(stopDir) && cur !== stopDir) {
    try {
      if (readdirSync(cur).length === 0) {
        rmdirSync(cur);
        cur = dirname(cur);
      } else {
        break;
      }
    } catch {
      break;
    }
  }
}

function taoSnapshotVanBan(root, doc) {
  const yamlPath = join(root, doc._file);
  const jsonlPath = join(root, 'data', 'dieu-khoan-day-du', `${doc._slug}.dieu.jsonl`);
  const rawDownloadDir = join(root, 'raw', 'download');

  const yamlOrig = existsSync(yamlPath) ? readFileSync(yamlPath) : null;
  const jsonlOrig = existsSync(jsonlPath) ? readFileSync(jsonlPath) : null;
  const rawFilesBefore = lietKeTepDeQuy(rawDownloadDir);

  return {
    restore() {
      if (yamlOrig !== null) writeFileSync(yamlPath, yamlOrig);
      else if (existsSync(yamlPath)) unlinkSync(yamlPath);

      if (jsonlOrig !== null) writeFileSync(jsonlPath, jsonlOrig);
      else if (existsSync(jsonlPath)) unlinkSync(jsonlPath);

      const rawFilesAfter = lietKeTepDeQuy(rawDownloadDir);
      for (const fp of rawFilesAfter) {
        if (!rawFilesBefore.has(fp) && existsSync(fp)) {
          unlinkSync(fp);
          donThuMucRong(dirname(fp), rawDownloadDir);
        }
      }
    },
    newRawFiles() {
      const rawFilesAfter = lietKeTepDeQuy(rawDownloadDir);
      return [...rawFilesAfter].filter((fp) => !rawFilesBefore.has(fp));
    },
  };
}

function docYamlVanBan(absPath) {
  const raw = readFileSync(absPath, 'utf8');
  return { raw, obj: yaml.load(raw, { schema: yaml.CORE_SCHEMA }) || {} };
}

function ghiYamlGiuHeader(absPath, origRaw, obj) {
  const head = origRaw.split('\n').filter((l) => l.startsWith('#')).join('\n');
  writeFileSync(absPath, `${head ? `${head}\n` : ''}${yaml.dump(obj, { lineWidth: -1, noRefs: true })}`, 'utf8');
}

function phanLoaiLoiNap(err) {
  const msg = `${err?.message || ''}\n${err?.stderr || ''}\n${err?.stdout || ''}`;
  if (/50 MB|quá.*MB|QUA_DUNG_LUONG/i.test(msg)) return 'QUA_DUNG_LUONG';
  return 'HTTP_LOI';
}

async function macDinhChayNap({ url, soHieu, root }) {
  if (resolve(root) !== resolve(ROOT)) {
    throw new Error('Không thể chạy mặc định tools/nap.mjs trên thư mục --root khác ROOT nếu thiếu _chayNap');
  }
  const args = [join(ROOT, 'tools', 'nap.mjs'), url, '--ghi', '--theo-pdf'];
  if (soHieu) args.push('--so-hieu', soHieu);
  execFileSync('node', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: 'pipe',
    timeout: 60000,
    maxBuffer: 10 * 1024 * 1024,
  });
}

function thuGonUngVien(item) {
  const { _doc, ...rest } = item;
  void _doc;
  return rest;
}

/**
 * Chạy vòng lặp tự tải toàn văn & trích điều khoản đầy đủ an toàn theo từng văn bản.
 */
export async function chayTuTaiToanVan({
  root = ROOT,
  limit = MAC_DINH_LIMIT,
  slug = null,
  maxFileMb = MAC_DINH_MAX_FILE_MB,
  dryRun = false,
  coPdftotext = null,
  docPdf = null,
  coUnzip = null,
  docDocx = null,
  _chayNap = null,
  _trichDieuKhoan = null,
  _kiemTraDieuKhoan = null,
  _kiemTraPdf = null,
  _kiemTraRegistry = null,
} = {}) {
  const discovery = timUngVienTuTai({ root, limit, slug, coPdftotext, docPdf });
  const maxBytes = maxFileMb * 1024 * 1024;

  const da_xu_ly = [];
  const bo_qua_can_thu_cong = [];
  const that_bai = [];

  if (!dryRun) {
    const chayNap = _chayNap || macDinhChayNap;

    for (const item of discovery.duoc_chon) {
      const doc = item._doc;
      const snap = taoSnapshotVanBan(root, doc);
      const yamlPath = join(root, doc._file);
      let didDownload = false;
      let currentDoc = doc;

      try {
        // Bước 1 (Nhóm 1): Tải toàn văn từ URL bậc A
        if (item.nhom === 'can_tai_toan_van') {
          if (!doc.so_hieu) {
            snap.restore();
            bo_qua_can_thu_cong.push({
              slug: doc._slug,
              so_hieu: null,
              file: doc._file,
              url: item.url,
              ly_do: 'THIEU_SO_HIEU',
            });
            continue;
          }

          try {
            await chayNap({ url: item.url, soHieu: doc.so_hieu, slug: doc._slug, file: doc._file, root });
          } catch (err) {
            snap.restore();
            bo_qua_can_thu_cong.push({
              slug: doc._slug,
              so_hieu: doc.so_hieu,
              file: doc._file,
              url: item.url,
              ly_do: phanLoaiLoiNap(err),
              chi_tiet: String(err?.stderr || err?.message || err).trim().slice(0, 300),
            });
            continue;
          }

          const newFiles = snap.newRawFiles();
          const { raw: updatedRaw, obj: updatedObj } = docYamlVanBan(yamlPath);
          currentDoc = { ...updatedObj, _file: doc._file, _slug: doc._slug };

          // Kiểm dung lượng tệp vừa tải
          const filesToSizeCheck = new Set(newFiles);
          const tvAfterNap = layDanhSachToanVan(currentDoc, root).filter((f) => !f.isWiki);
          for (const f of tvAfterNap) {
            if (f.exists) filesToSizeCheck.add(f.abs);
          }

          let oversized = null;
          for (const fp of filesToSizeCheck) {
            if (existsSync(fp) && statSync(fp).size > maxBytes) {
              oversized = fp;
              break;
            }
          }
          if (oversized) {
            snap.restore();
            bo_qua_can_thu_cong.push({
              slug: doc._slug,
              so_hieu: doc.so_hieu,
              file: doc._file,
              url: item.url,
              ly_do: 'QUA_DUNG_LUONG',
              chi_tiet: `Vượt ${maxFileMb} MB (${oversized.slice(root.length + 1)})`,
            });
            continue;
          }

          const existingTv = tvAfterNap.filter((f) => f.exists);
          if (existingTv.length === 0) {
            snap.restore();
            bo_qua_can_thu_cong.push({
              slug: doc._slug,
              so_hieu: doc.so_hieu,
              file: doc._file,
              url: item.url,
              ly_do: 'HTTP_LOI',
              chi_tiet: 'Không tìm thấy tệp toan_van trên đĩa sau khi chạy nap.mjs',
            });
            continue;
          }

          // Nếu nap.mjs tải HTML có toàn văn và đã sinh tệp .txt kế bên -> bổ sung .txt vào toan_van
          const htmlOnly = existingTv.every((f) => f.ext === '.html' || f.ext === '.htm');
          if (htmlOnly) {
            const txtSiblings = existingTv
              .map((f) => ({ html: f, txtAbs: f.abs.replace(/\.html?$/i, '.txt') }))
              .filter((p) => existsSync(p.txtAbs));

            if (txtSiblings.length === 0) {
              snap.restore();
              bo_qua_can_thu_cong.push({
                slug: doc._slug,
                so_hieu: doc.so_hieu,
                file: doc._file,
                url: item.url,
                ly_do: 'VO_HTML_KHONG_PDF',
                chi_tiet: existingTv.map((f) => f.rel).join(', '),
              });
              continue;
            }

            const prevList = Array.isArray(updatedObj.toan_van) ? updatedObj.toan_van : [updatedObj.toan_van];
            const nextList = [...prevList];
            for (const p of txtSiblings) {
              const txtRel = p.txtAbs.slice(root.length + 1).replace(/\\/g, '/');
              if (!nextList.includes(txtRel)) nextList.push(txtRel);
            }
            updatedObj.toan_van = nextList;
            ghiYamlGiuHeader(yamlPath, updatedRaw, updatedObj);
            currentDoc = { ...updatedObj, _file: doc._file, _slug: doc._slug };
          }

          // Nếu chỉ có PDF, kiểm lớp chữ tránh giữ lại bản scan chưa OCR
          const tvFinal = layDanhSachToanVan(currentDoc, root).filter((f) => f.exists && !f.isWiki);
          const hasNonPdf = tvFinal.some((f) => f.ext !== '.pdf' && f.ext !== '.html' && f.ext !== '.htm');
          if (!hasNonPdf) {
            const pdfFile = tvFinal.find((f) => f.ext === '.pdf');
            if (!pdfFile) {
              snap.restore();
              bo_qua_can_thu_cong.push({
                slug: doc._slug,
                so_hieu: doc.so_hieu,
                file: doc._file,
                url: item.url,
                ly_do: 'VO_HTML_KHONG_PDF',
              });
              continue;
            }
            let pdfCheck;
            if (typeof _kiemTraPdf === 'function') {
              pdfCheck = await _kiemTraPdf(readFileSync(pdfFile.abs), pdfFile);
            } else if (typeof docPdf === 'function') {
              const txt = String(docPdf(pdfFile.abs) ?? '').trim();
              pdfCheck = { trang_thai: txt.length < 200 ? 'PDF_BAN_SCAN_CAN_OCR' : 'PDF_CO_TOAN_VAN' };
            } else if (coPdftotext !== false) {
              pdfCheck = kiemTraPdfCoLopChu(readFileSync(pdfFile.abs));
            } else {
              pdfCheck = { trang_thai: 'KHONG_CO_PDFTOTEXT' };
            }

            if (pdfCheck?.trang_thai === 'PDF_BAN_SCAN_CAN_OCR' || pdfCheck?.trang_thai === 'LOI_DOC_PDF') {
              snap.restore();
              bo_qua_can_thu_cong.push({
                slug: doc._slug,
                so_hieu: doc.so_hieu,
                file: doc._file,
                url: item.url,
                ly_do: pdfCheck.trang_thai,
              });
              continue;
            }

            // Kiểm khớp số hiệu/tiêu đề PDF để tránh gắn nhầm tài liệu liên quan khác (vd VBHN)
            const headText = trichDauPdfText(pdfFile.abs, { coPdftotext, docPdf });
            const khopCheck = kiemTraKhopNoiDungPdf(doc, headText);
            if (!khopCheck.khop) {
              snap.restore();
              bo_qua_can_thu_cong.push({
                slug: doc._slug,
                so_hieu: doc.so_hieu,
                file: doc._file,
                url: item.url,
                ly_do: 'PDF_KHONG_KHOP_VAN_BAN',
                chi_tiet: khopCheck.lyDo,
              });
              continue;
            }
          }

          didDownload = true;
        }

        // Bước 2: Trích điều khoản đầy đủ (với Nhóm 2, hoặc Nhóm 1 vừa tải xong & thuộc NGUON_A)
        const shouldExtract = item.nhom === 'can_trich_dieu_khoan' || currentDoc.xac_minh?.muc === 'NGUON_A';
        let soDieuKhoan = 0;

        if (shouldExtract) {
          const trichRes = typeof _trichDieuKhoan === 'function'
            ? await _trichDieuKhoan({ root, slugs: [doc._slug], write: true })
            : chayTrichDieuKhoanDayDu({
                root,
                slugs: [doc._slug],
                write: true,
                coPdftotext,
                docPdf,
                coUnzip,
                docDocx,
              });
          const trichItem = trichRes?.ket_qua?.[0];
          const st = trichItem?.status;

          if (st === 'PDF_BAN_SCAN_CAN_OCR') {
            snap.restore();
            bo_qua_can_thu_cong.push({
              slug: doc._slug,
              so_hieu: currentDoc.so_hieu || null,
              file: doc._file,
              ...(item.url ? { url: item.url } : {}),
              ly_do: 'PDF_BAN_SCAN_CAN_OCR',
            });
            continue;
          }

          if (st === 'KHONG_CO_CAU_TRUC_DIEU') {
            if (!didDownload) {
              snap.restore();
              bo_qua_can_thu_cong.push({
                slug: doc._slug,
                so_hieu: currentDoc.so_hieu || null,
                file: doc._file,
                toan_van: item.toan_van || currentDoc.toan_van || null,
                ly_do: 'KHONG_CO_CAU_TRUC_DIEU',
              });
              continue;
            }
            // Nhóm 1 vừa tải được toàn văn đọc được (VD Công văn không có Điều N) -> kiểm tra YAML rồi giữ toan_van
          } else if (st !== 'DA_GHI') {
            snap.restore();
            that_bai.push({
              slug: doc._slug,
              so_hieu: currentDoc.so_hieu || null,
              file: doc._file,
              hanh_dong: didDownload ? 'tai_va_trich' : 'trich_dieu_khoan',
              ly_do: st || 'LOI_TRICH_XUAT',
              chi_tiet: trichItem?.chi_tiet || trichItem || null,
            });
            continue;
          } else {
            soDieuKhoan = trichItem.so_dieu_khoan || 0;
          }
        }

        // Bước 3: Kiểm chứng bằng kiem-tra-dieu-khoan.mjs
        const ktRes = typeof _kiemTraDieuKhoan === 'function'
          ? await _kiemTraDieuKhoan({ root, slug: doc._slug, file: doc._file, soHieu: currentDoc.so_hieu || null })
          : kiemTraDieuKhoan(napSo(root), { root, coPdftotext, docPdf });

        const relJsonl = `data/dieu-khoan-day-du/${doc._slug}.dieu.jsonl`;
        const docErrors = (ktRes?.loi || []).filter((e) =>
          e.file === doc._file
          || e.file === relJsonl
          || (e.so_hieu && currentDoc.so_hieu && e.so_hieu === currentDoc.so_hieu)
        );

        if (docErrors.length > 0 || ktRes?.ok === false) {
          snap.restore();
          that_bai.push({
            slug: doc._slug,
            so_hieu: currentDoc.so_hieu || null,
            file: doc._file,
            hanh_dong: didDownload
              ? (soDieuKhoan > 0 ? 'tai_va_trich' : 'tai_toan_van')
              : 'trich_dieu_khoan',
            ly_do: 'KIEM_TRA_DIEU_KHOAN_LOI',
            loi: docErrors,
          });
          continue;
        }

        // Bước 4: Kiểm tra lược đồ sổ cho chính văn bản vừa sửa (tránh lọt xung đột chan/toan_van)
        const regCheck = typeof _kiemTraRegistry === 'function'
          ? await _kiemTraRegistry({ root, slug: doc._slug, file: doc._file })
          : kiemTra(napSo(root), {
              root,
              kiemChinhSachMoTa: false,
              kiemAnhXaAhtn: false,
              kiemSuaDoiDieu: false,
              kiemFta: false,
            });
        const regDocErrors = (regCheck?.loi || []).filter((e) => e.file === doc._file);
        if (regDocErrors.length > 0 || regCheck?.ok === false) {
          snap.restore();
          that_bai.push({
            slug: doc._slug,
            so_hieu: currentDoc.so_hieu || null,
            file: doc._file,
            hanh_dong: didDownload
              ? (soDieuKhoan > 0 ? 'tai_va_trich' : 'tai_toan_van')
              : 'trich_dieu_khoan',
            ly_do: 'KIEM_TRA_SO_LOI',
            loi: regDocErrors,
          });
          continue;
        }

        da_xu_ly.push({
          slug: doc._slug,
          so_hieu: currentDoc.so_hieu || null,
          file: doc._file,
          hanh_dong: didDownload
            ? (soDieuKhoan > 0 ? 'tai_va_trich' : 'tai_toan_van')
            : 'trich_dieu_khoan',
          toan_van: currentDoc.toan_van || null,
          so_dieu_khoan: soDieuKhoan,
        });
      } catch (err) {
        snap.restore();
        that_bai.push({
          slug: doc._slug,
          so_hieu: currentDoc.so_hieu || null,
          file: doc._file,
          hanh_dong: item.nhom === 'can_tai_toan_van' ? 'tai_toan_van' : 'trich_dieu_khoan',
          ly_do: 'LOI_KHONG_MONG_DOI',
          chi_tiet: err?.message || String(err),
        });
      }
    }
  }

  return {
    thoi_gian: new Date().toISOString(),
    che_do: dryRun ? 'dry_run' : 'thuc_thi',
    root,
    limit: discovery.limit,
    slug: discovery.slug,
    max_file_mb: maxFileMb,
    thong_ke: {
      tong_van_ban: discovery.tong_van_ban,
      ung_vien_tai_toan_van: discovery.can_tai_toan_van.length,
      ung_vien_trich_dieu_khoan: discovery.can_trich_dieu_khoan.length,
      du_kien_xu_ly: discovery.duoc_chon.length,
      da_xu_ly: da_xu_ly.length,
      bo_qua_can_thu_cong: bo_qua_can_thu_cong.length,
      that_bai: that_bai.length,
    },
    ung_vien: discovery.duoc_chon.map(thuGonUngVien),
    da_xu_ly,
    bo_qua_can_thu_cong,
    that_bai,
  };
}

/** Xuất báo cáo Markdown cho `$GITHUB_STEP_SUMMARY` và PR body `auto/tu-tai-toan-van`. */
export function dinhDangMarkdownTuTai(result) {
  const tk = result?.thong_ke || {};
  const ngay = (result?.thoi_gian || new Date().toISOString()).slice(0, 10);
  const cheDoLabel = result?.che_do === 'dry_run' ? 'dry-run (chỉ liệt kê, không ghi tệp)' : 'thực thi';
  const daXuLy = result?.da_xu_ly || [];
  const boQua = result?.bo_qua_can_thu_cong || [];
  const thatBai = result?.that_bai || [];
  const ungVien = result?.ung_vien || [];

  const lines = [
    `## Tự tải toàn văn & trích điều khoản (${ngay})`,
    '',
    `- **Chế độ**: ${cheDoLabel} (\`--limit ${result?.limit ?? MAC_DINH_LIMIT}\`, \`--max-file-mb ${result?.max_file_mb ?? MAC_DINH_MAX_FILE_MB}\`${result?.slug ? `, \`--slug ${result.slug}\`` : ''})`,
    `- **Ứng viên Nhóm 1 (cần tải toàn văn bậc A)**: ${tk.ung_vien_tai_toan_van ?? 0}`,
    `- **Ứng viên Nhóm 2 (cần trích điều khoản đầy đủ)**: ${tk.ung_vien_trich_dieu_khoan ?? 0}`,
    `- **Dự kiến xử lý lượt này**: ${tk.du_kien_xu_ly ?? ungVien.length}`,
  ];

  if (result?.che_do !== 'dry_run') {
    lines.push(`- **Đã xử lý thành công**: ${tk.da_xu_ly ?? daXuLy.length}`);
    lines.push(`- **Bỏ qua (cần xử lý thủ công)**: ${tk.bo_qua_can_thu_cong ?? boQua.length}`);
    lines.push(`- **Thất bại (đã hoàn tác)**: ${tk.that_bai ?? thatBai.length}`);
  }

  if (result?.che_do === 'dry_run') {
    lines.push('');
    lines.push(`### Danh sách ứng viên dự kiến (${ungVien.length})`);
    if (ungVien.length === 0) {
      lines.push('_Không có ứng viên phù hợp._');
    } else {
      for (const u of ungVien) {
        const dich = u.nhom === 'can_tai_toan_van' ? `URL: ${u.url}` : `tệp: \`${u.toan_van}\``;
        lines.push(`- \`${u.slug}\` (**${u.so_hieu || 'không rõ số'}**, \`${u.nhom}\`) — ${dich}`);
      }
    }
    return `${lines.join('\n')}\n`;
  }

  lines.push('');
  lines.push(`### Đã xử lý thành công (${daXuLy.length})`);
  if (daXuLy.length === 0) {
    lines.push('_Không có văn bản nào hoàn tất trong lượt này._');
  } else {
    for (const d of daXuLy) {
      const tv = Array.isArray(d.toan_van) ? d.toan_van.join(', ') : (d.toan_van || '—');
      lines.push(`- \`${d.slug}\` (**${d.so_hieu || 'không rõ số'}**) · \`${d.hanh_dong}\` · ${d.so_dieu_khoan} điều · \`${tv}\``);
    }
  }

  if (boQua.length > 0) {
    lines.push('');
    lines.push(`### Bỏ qua — cần xử lý thủ công (${boQua.length})`);
    for (const b of boQua) {
      const detail = b.chi_tiet || b.url || b.toan_van || '';
      lines.push(`- \`${b.slug}\` (**${b.so_hieu || 'không rõ số'}**) · \`${b.ly_do}\`${detail ? ` — ${detail}` : ''}`);
    }
  }

  if (thatBai.length > 0) {
    lines.push('');
    lines.push(`### Thất bại đã hoàn tác (${thatBai.length})`);
    for (const f of thatBai) {
      const msg = f.loi?.[0]?.msg || (typeof f.chi_tiet === 'string' ? f.chi_tiet : '');
      lines.push(`- \`${f.slug}\` (**${f.so_hieu || 'không rõ số'}**) · \`${f.ly_do}\`${msg ? ` — ${msg}` : ''}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

export function docThamSoCli(argv) {
  const opts = {
    limit: MAC_DINH_LIMIT,
    slug: null,
    maxFileMb: MAC_DINH_MAX_FILE_MB,
    dryRun: false,
    json: false,
    markdown: null,
    root: ROOT,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--limit' && argv[i + 1]) opts.limit = Number(argv[++i]);
    else if (a.startsWith('--limit=')) opts.limit = Number(a.slice('--limit='.length));
    else if (a === '--slug' && argv[i + 1]) opts.slug = argv[++i].trim() || null;
    else if (a.startsWith('--slug=')) opts.slug = a.slice('--slug='.length).trim() || null;
    else if (a === '--max-file-mb' && argv[i + 1]) opts.maxFileMb = Number(argv[++i]);
    else if (a.startsWith('--max-file-mb=')) opts.maxFileMb = Number(a.slice('--max-file-mb='.length));
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--json') opts.json = true;
    else if (a === '--markdown' && argv[i + 1]) opts.markdown = argv[++i];
    else if (a.startsWith('--markdown=')) opts.markdown = a.slice('--markdown='.length);
    else if (a === '--root' && argv[i + 1]) opts.root = resolve(argv[++i]);
    else if (a.startsWith('--root=')) opts.root = resolve(a.slice('--root='.length));
    else if (a === '-h' || a === '--help') opts.help = true;
  }
  return opts;
}

function inBaoCaoText(res) {
  const tk = res.thong_ke;
  console.log(
    `Tự tải toàn văn (${res.che_do}): ứng viên tải ${tk.ung_vien_tai_toan_van} · ứng viên trích ${tk.ung_vien_trich_dieu_khoan} · chọn ${tk.du_kien_xu_ly}`,
  );
  if (res.che_do === 'dry_run') {
    for (const u of res.ung_vien) {
      console.log(`  [dry-run] ${u.slug} (${u.nhom}) -> ${u.url || u.toan_van}`);
    }
    return;
  }
  for (const d of res.da_xu_ly) {
    console.log(`  [OK] ${d.slug}: ${d.hanh_dong} (${d.so_dieu_khoan} điều)`);
  }
  for (const b of res.bo_qua_can_thu_cong) {
    console.log(`  [BO_QUA] ${b.slug}: ${b.ly_do}`);
  }
  for (const f of res.that_bai) {
    console.error(`  [THAT_BAI] ${f.slug}: ${f.ly_do}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const opts = docThamSoCli(process.argv.slice(2));
  if (opts.help) {
    console.log(
      'Cách dùng: node tools/tu-tai-toan-van.mjs [--limit 5] [--slug <slug>] [--max-file-mb 25] [--dry-run] [--json] [--markdown <file>] [--root <dir>] [--help]',
    );
    process.exit(0);
  }
  if (!Number.isInteger(opts.limit) || opts.limit < 1) {
    console.error(`--limit không hợp lệ: ${opts.limit}`);
    process.exit(2);
  }
  if (!Number.isFinite(opts.maxFileMb) || opts.maxFileMb <= 0) {
    console.error(`--max-file-mb không hợp lệ: ${opts.maxFileMb}`);
    process.exit(2);
  }

  try {
    const res = await chayTuTaiToanVan({
      root: opts.root,
      limit: opts.limit,
      slug: opts.slug,
      maxFileMb: opts.maxFileMb,
      dryRun: opts.dryRun,
    });

    if (opts.markdown) {
      const md = dinhDangMarkdownTuTai(res);
      if (opts.markdown === '-') {
        if (!opts.json) process.stdout.write(md);
      } else {
        mkdirSync(dirname(opts.markdown), { recursive: true });
        writeFileSync(opts.markdown, md, 'utf8');
      }
    }

    if (opts.json) {
      process.stdout.write(`${JSON.stringify(res, null, 2)}\n`);
    } else if (opts.markdown !== '-') {
      inBaoCaoText(res);
    }

    process.exit(res.that_bai.length > 0 ? 1 : 0);
  } catch (err) {
    console.error(`LỖI: ${err?.message || err}`);
    process.exit(1);
  }
}
