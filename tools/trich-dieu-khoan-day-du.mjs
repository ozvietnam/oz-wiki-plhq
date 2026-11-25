#!/usr/bin/env node
// Trích xuất 100% các Điều N nguyên văn (không giới hạn 10 điều/văn bản) vào
// `data/dieu-khoan-day-du/<slug>.dieu.jsonl` cho mọi văn bản thuộc tầng NGUON_A
// (trừ TB_TCHQ) có tệp toàn văn đọc được trên đĩa (.pdf lớp chữ / .ocr.txt / .txt / .docx).
//
//   node tools/trich-dieu-khoan-day-du.mjs [--write | --dry-run] [--slug <slug>] [--max-len 1800] [--json]
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chuanHoaKhopNguyenVan } from './kiem-tra-dieu-khoan.mjs';
import { napSo, ROOT } from './lib/registry.mjs';
import {
  catDoanNguyenVan,
  docMotTep,
  ganShaPdfNeuKhop,
  kiemKhopCuaSoTrang,
  laTbTchq,
  layDanhSachToanVan,
  phanTichCacKhoiDieu,
  phatHienCongCu,
  trichDoanTuKhoi,
  uuTienNguonDoc,
} from './trich-dieu-khoan.mjs';

export const MAC_DINH_MAX_LEN = 1800;
const MIN_DOAN_DAY_DU_KY_TU = 80;

const RE_KHOAN_SUA_DOI = /^\s*(\d{1,3})\s*[.)]\s+(?=.*?(?:s[uửư][aảe]|b[oổỗd]\s*sung|b[aã]i\s*b[oỏ]|thay\s*th[eế]|[đd]i[eềê]u\s+\d+|kho[aả]n\s+\d+|ph[uụ]\s*l[uụ]c|b[oỏ]\s+c[uụ]m))/iu;
const RE_KHOAN_DAU_MUC_SUA_DOI = /^\s*(\d{1,3})\s*[.)]\s+(?:(?:kho[aả]n|đi[eể]m|[đd]i[eềê]u|m[uụ]c|ch[uươ]{1,2}ng|ph[uụ]\s*l[uụ]c)(?=$|[\s,.;:])[^\n]{0,140}?(?:đ[uư][oợ]c\s+)?(?:s[uửư][aảe]|b[oổỗd]\s*sung|b[aã]i\s*b[oỏ]|thay\s*th[eế])|(?:s[uửư][aảe]|b[oổỗd]\s*sung|b[aã]i\s*b[oỏ]|thay\s*th[eế]|[đd]ổi\s*tên|b[oỏ]\s+c[uụ]m)(?=$|[\s,.;:]))/iu;

export function laVanBanSuaDoiGop(doc) {
  return Boolean((doc?.quan_he?.sua_doi?.length || 0) > 0 || (doc?.quan_he?.bai_bo?.length || 0) > 0);
}

/**
 * Tách các khoản sửa đổi đánh số `1. ... 2. ...` bên trong một Điều gộp dài hơn `maxLen`
 * (thường gặp ở Điều 1 của các Thông tư/Nghị định sửa đổi bổ sung).
 * Mỗi khoản được kiểm chứng 100% qua `kiemKhopCuaSoTrang` trước khi nhận.
 */
export function trichKhoanSuaDoiTuKhoi(block, docData, maxLen = MAC_DINH_MAX_LEN, { allowWithoutRelation = false } = {}) {
  const { pages, kind } = docData;
  const totalTextLen = (block.segments || []).reduce((s, seg) => s + String(seg.text || '').length, 0);
  if (totalTextLen <= maxLen) return [];

  const subBlocks = [];
  let cur = null;
  let prevKhoan = 0;

  for (const seg of block.segments || []) {
    const lines = String(seg.text || '').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        if (cur) {
          const last = cur.segments[cur.segments.length - 1];
          if (last && last.pageNum === seg.pageNum && last.lines[last.lines.length - 1] !== '') {
            last.lines.push('');
          }
        }
        continue;
      }

      const m = trimmed.match(RE_KHOAN_DAU_MUC_SUA_DOI) || (allowWithoutRelation ? trimmed.match(RE_KHOAN_SUA_DOI) : null);
      if (m) {
        const kNum = Number(m[1]);
        if (Number.isInteger(kNum) && kNum > prevKhoan && kNum <= prevKhoan + 8) {
          if (cur) subBlocks.push(cur);
          cur = {
            dieu: block.dieu,
            khoan: kNum,
            segments: [{ pageNum: seg.pageNum, lines: [trimmed] }],
          };
          prevKhoan = kNum;
          continue;
        }
      }

      if (cur) {
        let targetSeg = cur.segments[cur.segments.length - 1];
        if (!targetSeg || targetSeg.pageNum !== seg.pageNum) {
          targetSeg = { pageNum: seg.pageNum, lines: [] };
          cur.segments.push(targetSeg);
        }
        targetSeg.lines.push(trimmed);
      }
    }
  }
  if (cur) subBlocks.push(cur);

  if (subBlocks.length < 2) return [];

  const verified = [];
  for (const sb of subBlocks) {
    const firstSeg = sb.segments[0];
    if (!firstSeg) continue;
    const p0 = firstSeg.pageNum;
    const checkPage = kind === 'docx' ? null : p0;
    const inWindow = kind === 'docx'
      ? sb.segments
      : sb.segments.filter((s) => s.pageNum >= p0 && s.pageNum <= p0 + 1);
    const candTexts = [];
    if (inWindow.length > 1) {
      candTexts.push(inWindow.map((s) => s.lines.join('\n').trim()).join('\n\n'));
    }
    candTexts.push(firstSeg.lines.join('\n').trim());

    let matched = null;
    for (const rawSeg of candTexts) {
      const excerpt = catDoanNguyenVan(rawSeg, 30, maxLen);
      if (!excerpt) continue;
      const norm = chuanHoaKhopNguyenVan(excerpt);
      if (!norm) continue;
      if (kiemKhopCuaSoTrang(pages, checkPage, norm)) {
        matched = {
          dieu: sb.dieu,
          khoan: sb.khoan,
          noi_dung: excerpt,
          ...(kind === 'docx' ? {} : { trang_pdf: p0 }),
        };
        break;
      }
    }
    if (matched) verified.push(matched);
  }

  return verified.length >= 2 ? verified : [];
}

function tinhSha256Tep(absPath) {
  return createHash('sha256').update(readFileSync(absPath)).digest('hex');
}

export function duDieuKienTrichDayDu(doc) {
  if (!doc || laTbTchq(doc)) return false;
  if (doc.xac_minh?.muc === 'NGUON_A') return true;
  return Array.isArray(doc.xac_minh?.dieu_khoan) && doc.xac_minh.dieu_khoan.length > 0;
}

/**
 * Trích tối đa `maxLen` ký tự cho 1 khối Điều N trong cửa sổ 2 trang [p0, p0 + 1],
 * bảo đảm luôn khớp nguyên văn với `kiemKhopCuaSoTrang(pages, p0, ...)`.
 */
export function trichKhoiDayDu(block, docData, maxLen = MAC_DINH_MAX_LEN) {
  const { pages, kind } = docData;
  const firstSeg = block.segments[0];
  if (!firstSeg) return null;

  const p0 = firstSeg.pageNum;
  const checkPage = kind === 'docx' ? null : p0;
  const inWindow = kind === 'docx'
    ? block.segments
    : block.segments.filter((s) => s.pageNum >= p0 && s.pageNum <= p0 + 1);

  const candidatesText = [];
  if (inWindow.length > 1) {
    candidatesText.push(inWindow.map((s) => s.text).join('\n\n'));
  }
  candidatesText.push(firstSeg.text);

  for (const rawSeg of candidatesText) {
    const excerpt = catDoanNguyenVan(rawSeg, MIN_DOAN_DAY_DU_KY_TU, maxLen);
    if (!excerpt) continue;
    const norm = chuanHoaKhopNguyenVan(excerpt);
    if (!norm) continue;
    if (kiemKhopCuaSoTrang(pages, checkPage, norm)) {
      return {
        dieu: block.dieu,
        noi_dung: excerpt,
        ...(kind === 'docx' ? {} : { trang_pdf: p0 }),
      };
    }
  }

  return trichDoanTuKhoi(block, docData);
}

function dinhDangMucJsonl(item, readRes) {
  const isPdfSource = readRes.kind === 'pdf';
  const hasMatchedPdfSha = Boolean(item.sha256_pdf);
  const sha = hasMatchedPdfSha ? item.sha256_pdf : tinhSha256Tep(readRes.fileInfo.abs);
  const out = {
    dieu: item.dieu,
    ...(item.khoan != null ? { khoan: item.khoan } : {}),
    noi_dung: item.noi_dung,
  };
  // Chỉ giữ trang_pdf khi trích trực tiếp từ PDF hoặc khớp chính xác lớp chữ của PDF kèm trong toan_van.
  if (isPdfSource || hasMatchedPdfSha) {
    if (item.trang_pdf != null) out.trang_pdf = item.trang_pdf;
  }
  out.sha256_pdf = sha;
  return out;
}

export function trichDieuKhoanDayDuChoVanBan(
  doc,
  {
    root = ROOT,
    maxLen = MAC_DINH_MAX_LEN,
    write = false,
    coPdftotext = null,
    docPdf = null,
    coUnzip = null,
    docDocx = null,
  } = {},
) {
  const base = { slug: doc._slug, so_hieu: doc.so_hieu || null, file: doc._file };
  if (!duDieuKienTrichDayDu(doc)) {
    return { ...base, status: 'KHONG_DU_DIEU_KIEN' };
  }

  const allTv = layDanhSachToanVan(doc, root);
  const candidates = allTv
    .filter((f) => f.exists && !f.isWiki && uuTienNguonDoc(f) < 9)
    .sort((a, b) => uuTienNguonDoc(a) - uuTienNguonDoc(b));

  const outDir = join(root, 'data', 'dieu-khoan-day-du');
  const outPath = join(outDir, `${doc._slug}.dieu.jsonl`);

  if (candidates.length === 0) {
    return { ...base, status: 'THIEU_TOAN_VAN' };
  }

  const pdfToolReady = typeof coPdftotext === 'boolean' ? coPdftotext : phatHienCongCu('pdftotext', ['-v']);
  const unzipReady = typeof coUnzip === 'boolean' ? coUnzip : phatHienCongCu('unzip', ['-v']);
  const readOpts = { coPdftotext: pdfToolReady, docPdf, coUnzip: unzipReady, docDocx };
  const pdfFiles = candidates.filter((f) => f.ext === '.pdf');

  const docFailures = [];
  let chosenResult = null;

  for (const fileInfo of candidates) {
    const readRes = docMotTep(fileInfo, readOpts);
    if (!readRes.ok) {
      docFailures.push(readRes);
      continue;
    }
    const blocks = phanTichCacKhoiDieu(readRes.pages);
    const laSuaDoiGop = laVanBanSuaDoiGop(doc);
    const verified = [];
    for (const b of blocks) {
      if (laSuaDoiGop || b.dieu <= 3) {
        const subItems = trichKhoanSuaDoiTuKhoi(b, readRes, maxLen, { allowWithoutRelation: false });
        if (subItems.length >= 2) {
          verified.push(...subItems);
          continue;
        }
      }
      const single = trichKhoiDayDu(b, readRes, maxLen);
      if (single) verified.push(single);
    }
    if (verified.length > 0) {
      chosenResult = { readRes, verified };
      break;
    }
    docFailures.push({ ok: false, code: 'KHONG_CO_CAU_TRUC_DIEU', file: fileInfo.rel });
  }

  if (!chosenResult) {
    if (write && existsSync(outPath)) unlinkSync(outPath);
    if (docFailures.some((f) => f.code === 'KHONG_CO_CAU_TRUC_DIEU')) {
      return { ...base, status: 'KHONG_CO_CAU_TRUC_DIEU', chi_tiet: docFailures };
    }
    if (docFailures.some((f) => f.code === 'PDF_BAN_SCAN_CAN_OCR')) {
      return { ...base, status: 'PDF_BAN_SCAN_CAN_OCR', chi_tiet: docFailures };
    }
    if (docFailures.some((f) => f.code === 'THIEU_PDFTOTEXT')) {
      return { ...base, status: 'THIEU_PDFTOTEXT', chi_tiet: docFailures };
    }
    return { ...base, status: 'LOI', chi_tiet: docFailures };
  }

  const withSha = ganShaPdfNeuKhop(chosenResult.verified, chosenResult.readRes, pdfFiles, readOpts)
    .sort((a, b) => a.dieu - b.dieu || (a.khoan ?? -1) - (b.khoan ?? -1))
    .map((it) => dinhDangMucJsonl(it, chosenResult.readRes));

  if (write) {
    mkdirSync(outDir, { recursive: true });
    const content = `${withSha.map((it) => JSON.stringify(it)).join('\n')}\n`;
    writeFileSync(outPath, content, 'utf8');
  }

  return {
    ...base,
    status: write ? 'DA_GHI' : 'DU_KIEN_TRICH',
    nguon_trich: chosenResult.readRes.fileInfo.rel,
    loai_nguon: chosenResult.readRes.kind,
    so_dieu_khoan: withSha.length,
    tep_xuat: `data/dieu-khoan-day-du/${doc._slug}.dieu.jsonl`,
  };
}

export function chayTrichDieuKhoanDayDu({
  root = ROOT,
  slugs = [],
  maxLen = MAC_DINH_MAX_LEN,
  write = false,
  coPdftotext = null,
  docPdf = null,
  coUnzip = null,
  docDocx = null,
} = {}) {
  const so = napSo(root);
  const bySlug = new Map(so.vanBan.map((d) => [d._slug, d]));
  const pdfToolReady = typeof coPdftotext === 'boolean' ? coPdftotext : phatHienCongCu('pdftotext', ['-v']);
  const unzipReady = typeof coUnzip === 'boolean' ? coUnzip : phatHienCongCu('unzip', ['-v']);

  let targets = [];
  const missingSlugs = [];
  if (slugs.length > 0) {
    for (const s of [...new Set(slugs)]) {
      const d = bySlug.get(s);
      if (!d) missingSlugs.push(s);
      else targets.push(d);
    }
  } else {
    targets = so.vanBan.filter(duDieuKienTrichDayDu);
  }

  const ketQua = [];
  for (const ms of missingSlugs) {
    ketQua.push({ slug: ms, so_hieu: null, file: null, status: 'KHONG_TIM_THAY_VAN_BAN' });
  }
  for (const d of targets) {
    ketQua.push(
      trichDieuKhoanDayDuChoVanBan(d, {
        root,
        maxLen,
        write,
        coPdftotext: pdfToolReady,
        docPdf,
        coUnzip: unzipReady,
        docDocx,
      }),
    );
  }

  const tongDieu = ketQua
    .filter((r) => r.status === 'DA_GHI' || r.status === 'DU_KIEN_TRICH')
    .reduce((n, r) => n + (r.so_dieu_khoan || 0), 0);
  const dem = (st) => ketQua.filter((r) => r.status === st).length;

  return {
    tong_xet: ketQua.length,
    da_trich: dem('DA_GHI') + dem('DU_KIEN_TRICH'),
    tong_dieu_khoan: tongDieu,
    khong_co_cau_truc_dieu: dem('KHONG_CO_CAU_TRUC_DIEU'),
    can_ocr: dem('PDF_BAN_SCAN_CAN_OCR'),
    thieu_toan_van: dem('THIEU_TOAN_VAN'),
    khong_du_dieu_kien: dem('KHONG_DU_DIEU_KIEN'),
    loi: dem('LOI') + dem('KHONG_TIM_THAY_VAN_BAN') + dem('THIEU_PDFTOTEXT'),
    write,
    max_len: maxLen,
    ket_qua: ketQua,
  };
}

export function parseArgs(argv) {
  const out = {
    slugs: [],
    write: false,
    dryRun: false,
    maxLen: MAC_DINH_MAX_LEN,
    json: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--slug' && argv[i + 1]) out.slugs.push(argv[++i].trim());
    else if (a.startsWith('--slug=')) out.slugs.push(a.slice('--slug='.length).trim());
    else if (a === '--slugs' && argv[i + 1]) {
      out.slugs.push(...argv[++i].split(',').map((x) => x.trim()).filter(Boolean));
    } else if (a.startsWith('--slugs=')) {
      out.slugs.push(...a.slice('--slugs='.length).split(',').map((x) => x.trim()).filter(Boolean));
    } else if (a === '--write') out.write = true;
    else if (a === '--dry-run') out.dryRun = true;
    else if (a === '--max-len' && argv[i + 1]) out.maxLen = Number(argv[++i]);
    else if (a.startsWith('--max-len=')) out.maxLen = Number(a.slice('--max-len='.length));
    else if (a === '--json') out.json = true;
    else if (a === '-h' || a === '--help') out.help = true;
  }
  if (out.dryRun) out.write = false;
  out.slugs = out.slugs.filter(Boolean);
  return out;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    console.error(
      'Cách dùng: node tools/trich-dieu-khoan-day-du.mjs [--write | --dry-run] [--slug <slug>] [--max-len 1800] [--json]',
    );
    process.exit(0);
  }
  if (!Number.isInteger(opts.maxLen) || opts.maxLen < 200) {
    console.error(`--max-len không hợp lệ: ${opts.maxLen}`);
    process.exit(2);
  }

  const res = chayTrichDieuKhoanDayDu({
    root: ROOT,
    slugs: opts.slugs,
    maxLen: opts.maxLen,
    write: opts.write,
  });

  if (opts.json) {
    process.stdout.write(`${JSON.stringify(res, null, 2)}\n`);
  } else {
    for (const item of res.ket_qua) {
      if (item.status === 'DA_GHI' || item.status === 'DU_KIEN_TRICH') {
        const tag = item.status === 'DU_KIEN_TRICH' ? '[dry-run]' : 'OK';
        console.log(`${tag} ${item.slug}: ${item.so_dieu_khoan} điều (${item.nguon_trich})`);
      }
    }
    console.log(
      `\nTổng xét: ${res.tong_xet} · Đã trích: ${res.da_trich} (${res.tong_dieu_khoan} điều) · Không có Điều N: ${res.khong_co_cau_truc_dieu} · Cần OCR: ${res.can_ocr} · Thiếu toàn văn: ${res.thieu_toan_van} · Lỗi: ${res.loi}`,
    );
  }

  const coLoiSlug = res.ket_qua.some((r) => r.status === 'KHONG_TIM_THAY_VAN_BAN' || r.status === 'LOI');
  process.exit(coLoiSlug ? 1 : 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main();
}
