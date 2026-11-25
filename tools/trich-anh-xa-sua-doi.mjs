#!/usr/bin/env node
// Trích xuất ánh xạ sửa đổi / bổ sung / bãi bỏ / tạm ngưng cấp Điều khoản từ toàn văn Nguồn bậc A
// (ưu tiên data/dieu-khoan-day-du/*.dieu.jsonl, dự phòng xac_minh.dieu_khoan) ra data/sua-doi-dieu/<slug-nguon>.json.
//   node tools/trich-anh-xa-sua-doi.mjs [--dry-run]
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { boDau, chuanCanh, khoa, napSo, ROOT } from './lib/registry.mjs';
import { docDieuKhoanDayDu } from './lib/dieu-khoan-dist.mjs';
import { chuanHoaMaDieu } from './lib/sua-doi-dieu.mjs';

function chuanLead(text) {
  return boDau(String(text || '').normalize('NFC'))
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Chuẩn hóa nhẹ lỗi OCR tiếng Việt phổ biến ở phần mở đầu điều khoản sửa đổi.
 */
function suaOcrPhoBien(asciiLower) {
  return asciiLower
    .replace(/\bsua\s+d[oaei][il]\b/g, 'sua doi')
    .replace(/\bb[doy]\s+sung\b/g, 'bo sung')
    .replace(/\bbai\s+b[oae]\b/g, 'bai bo')
    .replace(/\bkho[ae]n\b/g, 'khoan')
    .replace(/\bd[il]eu\b/g, 'dieu')
    .replace(/\b(dieu|khoan)\s+_(\d)/g, '$1 $2')
    .replace(/(\b\d{1,4}\/\d{4}\/[a-z]+)-\s+([a-z0-9]+)/g, '$1-$2')
    .replace(/(\b\d{1,4}\/\d{4}\/)(tt|nd|qh|qd)([a-z0-9-]*)/g, '$1$2-$3')
    .replace(/--+/g, '-');
}

function layPhanMoDau(noiDung) {
  const nfc = String(noiDung || '').normalize('NFC').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  const sample = nfc.slice(0, 600);
  const sampleAscii = boDau(sample).toLowerCase();

  let cut = sample.length;
  const nhuSauMatch = sampleAscii.match(/\bnhu\s+sau\s*:?/);
  if (nhuSauMatch) {
    cut = Math.min(cut, nhuSauMatch.index + nhuSauMatch[0].length);
  }
  const quoteIdx = sample.search(/[“"]\s*(?:[0-9]|dieu\b|điều\b|[a-zđ]\))/i);
  if (quoteIdx > 15) {
    cut = Math.min(cut, quoteIdx);
  }
  if (!nhuSauMatch && cut > 260) {
    const dotMatch = sample.slice(20).match(/\.\s+(?=[A-ZĐ0-9“"])/);
    if (dotMatch) cut = Math.min(cut, 20 + dotMatch.index + 1);
  }
  const rawLead = sample.slice(0, cut).trim();
  const asciiLead = chuanLead(rawLead).toLowerCase();
  return { rawLead, asciiLead, fullNfc: nfc };
}

function timMucTieuTrongVanBan(asciiNorm, targets) {
  if (!targets || targets.length === 0) return null;

  // 1) Khớp số hiệu trực tiếp (kể cả OCR viết dính hoặc thiếu gạch)
  const rawUpper = asciiNorm.toUpperCase();
  for (const m of rawUpper.matchAll(/\b\d{1,4}\/(?:\d{4}\/)?[A-Z0-9-]{2,}\b/g)) {
    const k = khoa(m[0]);
    const hit = targets.find((t) => t.khoa === k);
    if (hit) return hit;
  }

  // 2) Khớp tên Luật / Nghị định / Thông tư trong tiêu đề
  for (const t of targets) {
    const tenNorm = chuanLead(t.ten).toLowerCase();
    const docTitleMatch = tenNorm.match(/^((?:luat|nghi dinh|thong tu|phap lenh)\s+[a-z0-9 ,-]+?)(?:\s+so\b|\s+nam\b|\s+quy dinh\b|\s+huong dan\b|$)/);
    if (docTitleMatch && docTitleMatch[1].length >= 11 && asciiNorm.includes(docTitleMatch[1].trim())) {
      return t;
    }
    if (tenNorm.length >= 20 && asciiNorm.includes(tenNorm.slice(0, 32))) {
      return t;
    }
  }
  return null;
}

/**
 * Chỉ dùng cho văn bản sửa nhiều Luật/văn bản cùng lúc: kiểm tra xem tiêu đề Điều
 * có chỉ đích danh một văn bản KHÁC không nằm trong `targets` hay không.
 */
function coTieuDeThuocVanBanKhac(asciiNorm, targets, allowExclusion) {
  if (!allowExclusion) return false;
  if (timMucTieuTrongVanBan(asciiNorm, targets) !== null) return false;
  if (/mot\s+so\s+dieu\s+cua\s+(?:luat|phap\s+lenh|nghi\s+dinh|thong\s+tu)\b/.test(asciiNorm)) {
    return true;
  }
  // Trong luật sửa nhiều luật (35/2018/QH14): nếu Điều N không nhắc tới tên văn bản mục tiêu nào → bỏ qua
  return /^dieu\s+\d+[a-z]?\.\s+/.test(asciiNorm);
}

function boMenhDePhu(ascii) {
  return ascii
    .replace(/\bda\s+duoc\s+sua\s+doi[^.]*?(?:\b(?:boi|tai)\b[^]*?)(?=\bnhu\s+sau\b|\.|;|$)/g, ' ')
    .replace(/\bduoc\s+sua\s+doi,\s*bo\s+sung\s+(?:tai|boi)\b[^]*?(?=\bnhu\s+sau\b|\.|;|$)/g, ' ')
    .replace(/\b(?:sau|truoc)\s+dieu\s+\d+[a-z]?\b/g, ' ');
}

function laMucThuTucCuoi(ascii) {
  return /^(?:hieu\s+luc\s+thi\s+hanh|dieu\s+khoan\s+thi\s+hanh|trach\s+nhiem\s+thi\s+hanh|to\s+chuc\s+thuc\s+hien|quy\s+dinh\s+chuyen\s+tiep)\b/.test(ascii);
}

function nhanDienLoaiTacDong(asciiSeg) {
  if (/\btam\s+ngung\b/.test(asciiSeg)) return 'TAM_NGUNG';
  if (/\bthay\s+the\s+(?:cac\s+)?cum\s+tu\b/.test(asciiSeg) || (/\bcum\s+tu\b/.test(asciiSeg) && /\bbang\s+cum\s+tu\b/.test(asciiSeg))) {
    return 'THAY_THE_CUM_TU';
  }
  const coBaiBo = /\bbai\s+bo\b/.test(asciiSeg);
  const coSuaDoi = /\bsua\s+doi\b|\bthay\s+the\b/.test(asciiSeg);
  const coBoSung = /\bbo\s+sung\b/.test(asciiSeg);
  if (coBaiBo && !coSuaDoi && !coBoSung) return 'BAI_BO';
  if (coBoSung && !coSuaDoi && !coBaiBo) return 'BO_SUNG';
  if (coSuaDoi) return 'SUA_DOI';
  if (coBaiBo) return 'BAI_BO';
  if (coBoSung) return 'BO_SUNG';
  return null;
}

function tachDieuVaKhoan(asciiSeg, selfDieu, hasKhoan) {
  let body = asciiSeg.replace(/\b(?:thong\s+tu|nghi\s+dinh|quyet\s+dinh|luat|phap\s+lenh)\s+nay\b.*$/i, (m) => (
    /\b\d{1,4}\/\d{4}\//.test(m) ? m : ''
  ));
  // Chỉ bỏ "Điều N." ở đầu câu khi chính bản ghi là cấp Điều (khoan == null) và dấu chấm nằm ngay sau số Điều
  if (!hasKhoan) {
    body = body.replace(new RegExp(`^\\s*dieu\\s+${selfDieu}[a-z]?\\.\\s+`, 'i'), ' ');
  }

  const out = [];
  const dieuMatches = [...body.matchAll(/\bdieu\s+(\d+[a-z]?)\b/g)];
  if (dieuMatches.length === 0) return out;

  let prevEnd = 0;
  for (const dm of dieuMatches) {
    const dieuCode = chuanHoaMaDieu(dm[1]);
    if (!dieuCode) continue;
    const beforeSlice = body.slice(prevEnd, dm.index);
    prevEnd = dm.index + dm[0].length;

    const khoanNums = [];
    const khoanBlock = beforeSlice.match(/(?:cac\s+)?khoan\s+[0-9,\sva]+$/i);
    if (khoanBlock) {
      for (const km of khoanBlock[0].matchAll(/\b(\d+[a-z]?)\b/g)) {
        if (!khoanNums.includes(km[1])) khoanNums.push(km[1]);
      }
    } else {
      for (const km of beforeSlice.matchAll(/\bkhoan\s+(\d+[a-z]?)\b/g)) {
        if (!khoanNums.includes(km[1])) khoanNums.push(km[1]);
      }
    }
    out.push({
      dieu_dich: dieuCode,
      khoan_dich: khoanNums.length > 0 ? khoanNums.join(', ') : null,
    });
  }
  return out;
}

/**
 * Khi 1 mục dạng `"Sửa đổi một số điều của Luật X như sau: a) ... b) ..."` hoặc `"Bãi bỏ một phần các văn bản sau: a) ... b) ..."`
 * hay 1 Điều gộp nhiều khoản `1. ... 2. ...` trên 1 dòng JSONL: tách thành các tiểu mục con để đọc từng Điều đích.
 */
function moRongTieuMuc(clauses, targets) {
  const expanded = [];
  for (const rec of clauses) {
    const { asciiLead } = layPhanMoDau(rec.noi_dung);
    const parentTarget = timMucTieuTrongVanBan(boMenhDePhu(suaOcrPhoBien(asciiLead)), targets);
    expanded.push({ rec, rawSlice: rec.noi_dung, subMode: false, inheritedTarget: parentTarget });

    const nfc = String(rec.noi_dung || '').normalize('NFC').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
    const ascii = suaOcrPhoBien(chuanLead(nfc).toLowerCase());

    // Case A: Cấp Điều (khoan null) nhưng chứa các khoản `1. ... 2. ...` sửa đổi trực tiếp (vd 35/2018 Điều 24)
    if (rec.khoan == null && /\bmot\s+so\s+dieu\s+cua\b/.test(ascii.slice(0, 220)) && /\s1\.\s+/.test(nfc)) {
      const parts = nfc.split(/(?=\b\d{1,2}\.\s+(?:Sửa|Bổ|Bãi|Thay|Điều|Khoản|Điểm))/);
      for (const p of parts.slice(1)) {
        expanded.push({ rec, rawSlice: p.trim(), subMode: true, inheritedTarget: parentTarget });
      }
    }

    // Case B: Chứa liệt kê điểm sửa đổi `a) ... b) ...` (vd 07/2022 Điều 2 khoản 1, 86/2026 Điều 43)
    if (/\b(?:mot\s+so\s+dieu\s+cua|bai\s+bo\s+mot\s+phan(?:\s+cac\s+van\s+ban)?\s+sau)\b/.test(ascii.slice(0, 600))) {
      const idxStart = Math.max(0, ascii.search(/\bnhu\s+sau\s*:|\bbai\s+bo\s+mot\s+phan\b/));
      const tail = nfc.slice(idxStart);
      const subParts = tail.split(/(?=(?:^|[;\s])[a-zđ]\)\s+(?:Điều|Khoản|Điểm|Sửa|Bổ|Bãi|Thay|khoản|điểm|Bãi bỏ))/i);
      for (const sp of subParts) {
        const cleanSp = sp.trim().replace(/^[a-zđ]\)\s+/i, '');
        if (cleanSp.length >= 12) {
          expanded.push({ rec, rawSlice: cleanSp, subMode: true, inheritedTarget: parentTarget });
        }
      }
    }
  }
  return expanded;
}

/**
 * Trích danh sách tác động từ toàn bộ các bản ghi điều khoản Nguồn bậc A của 1 văn bản sửa đổi.
 */
export function trichTacDongVanBan(docNguon, clauses, targets) {
  const tacDong = [];
  const seen = new Set();
  const dieuContext = new Map(); // dieu_nguon -> target | '__SKIP_OTHER__'
  const suaDoiTargets = targets.filter((t) => t.loai_qh === 'sua_doi');
  const titleTarget = timMucTieuTrongVanBan(boDau(docNguon.ten || '').toLowerCase(), targets);
  const allowExclusion = suaDoiTargets.length > 1
    || /\b(?:\d+\s+luat|cac\s+luat|nhieu\s+luat)\b/i.test(boDau(docNguon.ten || ''));

  // Pass 1: Xác định ngữ cảnh target ở cấp Điều cha (từ bất kỳ mục nào của Điều N có nêu rõ số hiệu mục tiêu trong phần mở đầu)
  for (const rec of clauses) {
    const { asciiLead } = layPhanMoDau(rec.noi_dung);
    const norm = suaOcrPhoBien(asciiLead);
    const t = timMucTieuTrongVanBan(boMenhDePhu(norm), targets);
    if (t && !dieuContext.has(String(rec.dieu))) {
      dieuContext.set(String(rec.dieu), t);
    } else if ((rec.khoan == null || rec.khoan === undefined) && coTieuDeThuocVanBanKhac(norm, targets, allowExclusion)) {
      dieuContext.set(String(rec.dieu), '__SKIP_OTHER__');
    }
  }

  const workItems = moRongTieuMuc(clauses, targets);

  for (const { rec, rawSlice, subMode, inheritedTarget } of workItems) {
    const { rawLead, asciiLead } = layPhanMoDau(rawSlice);
    if (!asciiLead) continue;

    const cleanStart = suaOcrPhoBien(asciiLead).replace(/^\s*\d+[a-z]?[.:]\s*/, '');
    if (!subMode && laMucThuTucCuoi(cleanStart) && !/\bbai\s+bo\b.*\bdieu\s+\d+/.test(cleanStart)) {
      continue;
    }

    const stripped = boMenhDePhu(cleanStart);
    const parentCtx = dieuContext.get(String(rec.dieu));
    let clauseTarget = timMucTieuTrongVanBan(stripped, targets) || inheritedTarget;
    if (!clauseTarget) {
      if (parentCtx === '__SKIP_OTHER__') continue;
      if (coTieuDeThuocVanBanKhac(stripped, targets, allowExclusion)) continue;
      if (allowExclusion && !parentCtx) continue;
      const fallbackSuaDoi = suaDoiTargets.length === 1 ? suaDoiTargets[0] : titleTarget;
      clauseTarget = parentCtx || (targets.length === 1 ? targets[0] : fallbackSuaDoi);
    }
    if (!clauseTarget) continue;

    // Với Case B (`86/2026 Điều 43 khoản 3`: `"a) Điều 104, ... Thông tư số 38/2015/TT-BTC;"`), điểm không lặp lại chữ "Bãi bỏ"
    const implicitBaiBo = subMode && /\bbai\s+bo\s+mot\s+phan\b/.test(suaOcrPhoBien(chuanLead(rec.noi_dung).toLowerCase()).slice(0, 600));

    const segments = /\b(?:sua\s+doi|bo\s+sung)\b/.test(stripped) && /\b(?:va|;)\s*bai\s+bo\b/.test(stripped)
      ? stripped.split(/(?=(?:\bva|;)\s*bai\s+bo\b)/)
      : [stripped];

    for (const seg of segments) {
      const loai = nhanDienLoaiTacDong(seg) || (implicitBaiBo ? 'BAI_BO' : null);
      if (!loai) continue;
      const dichList = tachDieuVaKhoan(seg, rec.dieu, rec.khoan != null || subMode);
      if (dichList.length === 0) continue;

      for (const item of dichList) {
        if (rec.khoan == null && !subMode && item.dieu_dich === chuanHoaMaDieu(rec.dieu) && item.khoan_dich == null && targets.length > 1) {
          continue;
        }
        const canCu = rec.khoan != null
          ? `Điều ${rec.dieu} khoản ${rec.khoan} ${docNguon.so_hieu}`
          : `Điều ${rec.dieu} ${docNguon.so_hieu}`;
        const dupKey = `${clauseTarget.khoa}::${item.dieu_dich}::${item.khoan_dich ?? ''}::${loai}::${rec.dieu}::${rec.khoan ?? ''}`;
        if (seen.has(dupKey)) continue;
        seen.add(dupKey);

        tacDong.push({
          van_ban_dich: clauseTarget.so_hieu,
          dieu_dich: /^\d+$/.test(item.dieu_dich) ? Number(item.dieu_dich) : item.dieu_dich,
          khoan_dich: item.khoan_dich,
          phu_luc_dich: null,
          loai,
          dieu_nguon: rec.dieu,
          khoan_nguon: rec.khoan ?? null,
          tu_ngay: clauseTarget.tu_ngay || docNguon.hieu_luc_tu || null,
          trang_pdf: rec.trang_pdf ?? null,
          can_cu: canCu,
          trich_yeu: rawLead.slice(0, 180),
        });
      }
    }
  }

  return tacDong;
}

export function chayTrichAnhXaSuaDoi(root = ROOT, { dryRun = false } = {}) {
  const so = napSo(root);
  const { fullBySlug } = docDieuKhoanDayDu(root);
  const outDir = join(root, 'data', 'sua-doi-dieu');
  if (!dryRun) mkdirSync(outDir, { recursive: true });

  let soTepDaGhi = 0;
  let soTacDong = 0;
  const chiTiet = [];

  for (const d of so.vanBan) {
    const targets = [];
    const seenTargetKhoa = new Set();
    for (const nhom of ['sua_doi', 'bai_bo', 'tam_ngung']) {
      for (const raw of d.quan_he?.[nhom] || []) {
        const c = chuanCanh(raw);
        if (!c) continue;
        const k = khoa(c.so_hieu);
        const hit = so.theoKhoa.get(k)?.[0];
        if (!hit || seenTargetKhoa.has(khoa(hit.so_hieu))) continue;
        seenTargetKhoa.add(khoa(hit.so_hieu));
        targets.push({
          so_hieu: hit.so_hieu,
          khoa: khoa(hit.so_hieu),
          ten: hit.ten || '',
          loai_qh: nhom,
          tu_ngay: c.tu_ngay || d.hieu_luc_tu || null,
        });
      }
    }
    if (targets.length === 0) continue;

    // Ưu tiên toàn văn JSONL đầy đủ (giữ nguyên câu mở đầu `"1. Sửa đổi Điều X..."` thay vì bị YAML trích đoạn trong ngoặc che mất)
    const fullClauses = fullBySlug.get(d._slug) || [];
    const yamlClauses = Array.isArray(d.xac_minh?.dieu_khoan) ? d.xac_minh.dieu_khoan : [];
    const clauses = fullClauses.length > 0 ? fullClauses : yamlClauses;
    if (clauses.length === 0) continue;

    const tacDong = trichTacDongVanBan(d, clauses, targets);
    if (tacDong.length === 0) continue;

    soTepDaGhi += 1;
    soTacDong += tacDong.length;
    chiTiet.push({ so_hieu: d.so_hieu, slug: d._slug, so_tac_dong: tacDong.length });

    if (!dryRun) {
      const payload = {
        van_ban_nguon: d.so_hieu,
        slug_nguon: d._slug,
        hieu_luc_tu: d.hieu_luc_tu || null,
        tac_dong: tacDong,
      };
      writeFileSync(join(outDir, `${d._slug}.json`), `${JSON.stringify(payload, null, 2)}\n`);
    }
  }

  return { soTepDaGhi, soTacDong, chiTiet };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const dryRun = process.argv.includes('--dry-run');
  const res = chayTrichAnhXaSuaDoi(ROOT, { dryRun });
  console.log(`${dryRun ? '[DRY-RUN] ' : ''}Đã trích ${res.soTacDong} tác động cấp Điều khoản trên ${res.soTepDaGhi} văn bản sửa đổi.`);
}
