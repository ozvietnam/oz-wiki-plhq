#!/usr/bin/env node
// Công cụ rà soát và cắt chuyển trạng thái hiệu lực trong registry/van-ban/*.yaml theo mốc ngày.
// Mặc định CHỈ ĐỌC (dry-run); chỉ ghi tệp YAML khi truyền --ghi (hoặc ghi: true).
//   node tools/chuyen-hieu-luc.mjs [--ngay YYYY-MM-DD] [--ghi] [--json] [--root <dir>]
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, homNay, khoa, napSo } from './lib/registry.mjs';

const RE_NGAY = /^\d{4}-\d{2}-\d{2}$/;

function kiemTraNgayHopLe(ngay) {
  const s = String(ngay || '').trim();
  if (!RE_NGAY.test(s)) {
    throw new Error(`Ngày không hợp lệ (cần định dạng YYYY-MM-DD): "${s}"`);
  }
  const d = new Date(`${s}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s) {
    throw new Error(`Ngày lịch không tồn tại: "${s}"`);
  }
  return s;
}

function timWikiCanRaSoat(root, docsCanTheoDoi) {
  if (!docsCanTheoDoi.length) return [];
  const thuMucWiki = ['summary', 'concepts'];
  const danhSachTep = [];

  for (const dirName of thuMucWiki) {
    const dir = join(root, 'wiki', dirName);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir).filter((f) => f.endsWith('.md')).sort()) {
      danhSachTep.push(join(dir, name));
    }
  }

  const ketQua = [];
  for (const absPath of danhSachTep) {
    const raw = readFileSync(absPath, 'utf8');
    const khoaText = khoa(raw);
    const trung = [];
    for (const doc of docsCanTheoDoi) {
      const khopSoHieu = raw.includes(doc.so_hieu) || khoaText.includes(khoa(doc.so_hieu));
      const khopSlug = Boolean(doc.slug && raw.includes(`sources/${doc.slug}`));
      if (khopSoHieu || khopSlug) {
        trung.push(doc.so_hieu);
      }
    }
    if (trung.length) {
      ketQua.push({
        file: relative(root, absPath).replace(/\\/g, '/'),
        van_ban: trung.sort(),
      });
    }
  }
  return ketQua;
}

/**
 * Phân tích các văn bản cần chuyển trạng thái tại mốc ngày `ngay` (chỉ đọc, không sửa đĩa).
 */
export function phanTichChuyenHieuLuc({ root = ROOT, ngay = homNay() } = {}) {
  const baseRoot = root ? resolve(root) : ROOT;
  const mocNgay = kiemTraNgayHopLe(ngay);
  const so = napSo(baseRoot);

  const chuyenTrangThai = [];
  const canSoatTay = [];

  for (const d of so.vanBan) {
    const hieuLucTu = d.hieu_luc_tu ? String(d.hieu_luc_tu).trim() : null;
    const hetHieuLucTu = d.het_hieu_luc_tu ? String(d.het_hieu_luc_tu).trim() : null;

    if (d.tinh_trang === 'CHUA_CO_HIEU_LUC' && hieuLucTu && hieuLucTu <= mocNgay) {
      const trangThaiMoi = hetHieuLucTu && hetHieuLucTu <= mocNgay ? 'HET_HIEU_LUC' : 'CON_HIEU_LUC';
      chuyenTrangThai.push({
        so_hieu: d.so_hieu,
        slug: d._slug,
        file: d._file,
        co_quan: d.co_quan || null,
        trang_thai_cu: d.tinh_trang,
        trang_thai_moi: trangThaiMoi,
        loai_chuyen: trangThaiMoi === 'HET_HIEU_LUC' ? 'HET_HIEU_LUC' : 'CO_HIEU_LUC',
        hieu_luc_tu: hieuLucTu,
        het_hieu_luc_tu: hetHieuLucTu,
        ly_do: `hieu_luc_tu (${hieuLucTu}) <= ${mocNgay}`,
      });
    } else if (d.tinh_trang === 'CON_HIEU_LUC' && hetHieuLucTu && hetHieuLucTu <= mocNgay) {
      chuyenTrangThai.push({
        so_hieu: d.so_hieu,
        slug: d._slug,
        file: d._file,
        co_quan: d.co_quan || null,
        trang_thai_cu: d.tinh_trang,
        trang_thai_moi: 'HET_HIEU_LUC',
        loai_chuyen: 'HET_HIEU_LUC',
        hieu_luc_tu: hieuLucTu,
        het_hieu_luc_tu: hetHieuLucTu,
        ly_do: `het_hieu_luc_tu (${hetHieuLucTu}) <= ${mocNgay}`,
      });
    } else if (d.tinh_trang === 'HET_HIEU_LUC_MOT_PHAN' && hetHieuLucTu && hetHieu_luc_hop_le(hetHieuLucTu) && hetHieuLucTu <= mocNgay) {
      canSoatTay.push({
        so_hieu: d.so_hieu,
        slug: d._slug,
        file: d._file,
        tinh_trang: d.tinh_trang,
        hieu_luc_tu: hieuLucTu,
        het_hieu_luc_tu: hetHieuLucTu,
        ghi_chu: 'Hiệu lực một phần đã qua mốc het_hieu_luc_tu — cần soát tay từng điều/phụ lục để chuyển HET_HIEU_LUC toàn phần hoặc giữ HET_HIEU_LUC_MOT_PHAN và gỡ het_hieu_luc_tu.',
      });
    }
  }

  chuyenTrangThai.sort((a, b) => a.file.localeCompare(b.file));
  canSoatTay.sort((a, b) => a.file.localeCompare(b.file));

  const docsHetHan = [
    ...chuyenTrangThai.filter((x) => x.trang_thai_moi === 'HET_HIEU_LUC'),
    ...canSoatTay,
  ];
  const wikiCanRaSoat = timWikiCanRaSoat(baseRoot, docsHetHan);

  const coHieuLuc = chuyenTrangThai.filter((x) => x.trang_thai_moi === 'CON_HIEU_LUC').length;
  const hetHieuLuc = chuyenTrangThai.filter((x) => x.trang_thai_moi === 'HET_HIEU_LUC').length;

  return {
    ngay: mocNgay,
    ghi: false,
    tong_van_ban: so.vanBan.length,
    chuyen_trang_thai: chuyenTrangThai,
    can_soat_tay: canSoatTay,
    wiki_can_ra_soat: wikiCanRaSoat,
    da_ghi: [],
    thong_ke: {
      tong_tu_dong: chuyenTrangThai.length,
      co_hieu_luc: coHieuLuc,
      het_hieu_luc: hetHieuLuc,
      can_soat_tay: canSoatTay.length,
      wiki_can_ra_soat: wikiCanRaSoat.length,
    },
  };
}

function hetHieu_luc_hop_le(val) {
  return RE_NGAY.test(String(val || '').trim());
}

/**
 * Thực thi phân tích và (chỉ khi `ghi: true`) cập nhật dòng `tinh_trang:` trong từng YAML.
 */
export function apDungChuyenHieuLuc({ root = ROOT, ngay = homNay(), ghi = false } = {}) {
  const baseRoot = root ? resolve(root) : ROOT;
  const baoCao = phanTichChuyenHieuLuc({ root: baseRoot, ngay });
  baoCao.ghi = Boolean(ghi);

  if (!ghi) return baoCao;

  for (const item of baoCao.chuyen_trang_thai) {
    const absPath = join(baseRoot, item.file);
    const noiDungCu = readFileSync(absPath, 'utf8');
    const reTinhTrang = /^(tinh_trang:[ \t]*)([^\r\n#]+)(.*)$/m;
    if (!reTinhTrang.test(noiDungCu)) {
      throw new Error(`Không tìm thấy dòng top-level tinh_trang trong ${item.file}`);
    }
    const noiDungMoi = noiDungCu.replace(reTinhTrang, `$1${item.trang_thai_moi}$3`);
    writeFileSync(absPath, noiDungMoi, 'utf8');
    baoCao.da_ghi.push(item.file);
  }

  return baoCao;
}

function docThamSoCli(argv) {
  const layGiaTri = (flag) => {
    const idx = argv.indexOf(flag);
    if (idx === -1) return null;
    const val = argv[idx + 1];
    if (!val || val.startsWith('--')) return '';
    return val;
  };
  const coNgay = argv.includes('--ngay');
  const ngayVal = coNgay ? layGiaTri('--ngay') : homNay();
  const rootVal = layGiaTri('--root');
  return {
    help: argv.includes('--help') || argv.includes('-h'),
    json: argv.includes('--json'),
    ghi: argv.includes('--ghi'),
    ngay: ngayVal,
    root: rootVal || ROOT,
  };
}

function inBaoCaoVanBan(kq) {
  const cheDo = kq.ghi ? 'ĐÃ GHI VÀO ĐĨA (--ghi)' : 'CHẾ ĐỘ XEM TRƯỚC (dry-run, chưa sửa tệp)';
  console.log(`Cắt chuyển trạng thái hiệu lực tại mốc ${kq.ngay} — ${cheDo}`);
  console.log(`Đã rà ${kq.tong_van_ban} văn bản trong registry/van-ban/`);
  console.log('');

  console.log(`1. Tự động chuyển trạng thái (${kq.chuyen_trang_thai.length}): ${kq.thong_ke.het_hieu_luc} → HET_HIEU_LUC, ${kq.thong_ke.co_hieu_luc} → CON_HIEU_LUC`);
  for (const it of kq.chuyen_trang_thai) {
    console.log(`  - ${it.so_hieu} (${it.file}): ${it.trang_thai_cu} → ${it.trang_thai_moi} [${it.ly_do}]`);
  }

  console.log('');
  console.log(`2. Bảo vệ cần soát tay (${kq.can_soat_tay.length} — KHÔNG tự ghi đè HET_HIEU_LUC_MOT_PHAN):`);
  for (const it of kq.can_soat_tay) {
    console.log(`  - ${it.so_hieu} (${it.file}): giữ ${it.tinh_trang} (het_hieu_luc_tu: ${it.het_hieu_luc_tu}) — ${it.ghi_chu}`);
  }

  console.log('');
  console.log(`3. Trang wiki nghiệp vụ cần rà lại sau cắt chuyển (${kq.wiki_can_ra_soat.length}):`);
  for (const w of kq.wiki_can_ra_soat) {
    console.log(`  - ${w.file}: nhắc ${w.van_ban.join(', ')}`);
  }

  if (kq.ghi) {
    console.log('');
    console.log(`Đã cập nhật ${kq.da_ghi.length} tệp YAML. Hãy chạy "npm run kiem-tra && npm run diem-mu" để kiểm chứng lại.`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const opts = docThamSoCli(process.argv.slice(2));
  if (opts.help) {
    console.log('Cách dùng: node tools/chuyen-hieu-luc.mjs [--ngay YYYY-MM-DD] [--ghi] [--json] [--root <dir>]');
    console.log('Mặc định chạy dry-run (chỉ đọc). Truyền --ghi để cập nhật trường tinh_trang trong registry/van-ban/*.yaml.');
    process.exit(0);
  }
  try {
    const kq = apDungChuyenHieuLuc({ root: opts.root, ngay: opts.ngay, ghi: opts.ghi });
    if (opts.json) console.log(JSON.stringify(kq, null, 2));
    else inBaoCaoVanBan(kq);
  } catch (err) {
    console.error(`LỖI: ${err.message}`);
    process.exit(1);
  }
}
