#!/usr/bin/env node
/**
 * Kiểm tính toàn vẹn dist/registry.json (bản máy đã dựng).
 * Phát hiện: thiếu ngay_ban_hanh, thiếu co_quan, trùng so_hieu.
 *
 *   node scripts/kiem-tra-toan-ven-registry.mjs [--json] [đường-dẫn-registry]
 *
 * EXIT 0 = toàn vẹn; EXIT ≠ 0 = có lỗi (vẫn in báo cáo đầy đủ).
 * Số văn bản đọc từ file — không hard-code.
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const NGAY = /^\d{4}-\d{2}-\d{2}$/;

function rong(v) {
  if (v == null) return true;
  if (typeof v === 'string') return v.trim() === '';
  return false;
}

function khoaSoHieu(so) {
  return String(so || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toUpperCase()
    .replace(/\s+/g, '');
}

/**
 * @param {object} registry — object đã parse từ dist/registry.json
 * @returns {{ tong: number, tong_truong: number|null, loi: Array<{so_hieu?: string, slug?: string, loai: string, msg: string}>, ok: boolean }}
 */
export function kiemTraToanVen(registry) {
  const loi = [];
  if (!registry || typeof registry !== 'object' || Array.isArray(registry)) {
    return { tong: 0, tong_truong: null, loi: [{ loai: 'cau_truc', msg: 'registry phải là object JSON' }], ok: false };
  }
  if (!Array.isArray(registry.van_ban)) {
    return { tong: 0, tong_truong: registry.tong ?? null, loi: [{ loai: 'cau_truc', msg: 'thiếu mảng van_ban' }], ok: false };
  }

  const ds = registry.van_ban;
  const tong = ds.length;
  const tong_truong = registry.tong ?? null;
  if (tong_truong != null && Number(tong_truong) !== tong) {
    loi.push({
      loai: 'tong',
      msg: `trường tong=${tong_truong} lệch với van_ban.length=${tong}`,
    });
  }

  const theoKhoa = new Map();
  ds.forEach((vb, i) => {
    const so = vb?.so_hieu;
    const slug = vb?.slug;
    const nhan = so || slug || `#${i}`;

    if (rong(so)) {
      loi.push({ so_hieu: so, slug, loai: 'thieu_so_hieu', msg: `${nhan}: thiếu so_hieu` });
    } else {
      const k = khoaSoHieu(so);
      if (!theoKhoa.has(k)) theoKhoa.set(k, []);
      theoKhoa.get(k).push({ so_hieu: so, slug, i });
    }

    if (rong(vb?.co_quan)) {
      loi.push({ so_hieu: so, slug, loai: 'thieu_co_quan', msg: `${nhan}: thiếu co_quan` });
    }

    if (rong(vb?.ngay_ban_hanh)) {
      loi.push({ so_hieu: so, slug, loai: 'thieu_ngay_ban_hanh', msg: `${nhan}: thiếu ngay_ban_hanh` });
    } else if (!NGAY.test(String(vb.ngay_ban_hanh).trim())) {
      loi.push({
        so_hieu: so,
        slug,
        loai: 'ngay_ban_hanh_sai_dang',
        msg: `${nhan}: ngay_ban_hanh "${vb.ngay_ban_hanh}" phải dạng YYYY-MM-DD`,
      });
    }
  });

  for (const [k, nhom] of theoKhoa) {
    if (nhom.length > 1) {
      const dsSo = nhom.map((x) => x.so_hieu).join(' · ');
      loi.push({
        so_hieu: nhom[0].so_hieu,
        slug: nhom[0].slug,
        loai: 'trung_so_hieu',
        msg: `trùng so_hieu (khoá ${k}): ${dsSo} (${nhom.length} bản)`,
      });
    }
  }

  return { tong, tong_truong, loi, ok: loi.length === 0 };
}

function demTheoLoai(loi) {
  const m = {};
  for (const e of loi) m[e.loai] = (m[e.loai] || 0) + 1;
  return m;
}

function inBaoCao(ketQua, { json = false } = {}) {
  if (json) {
    console.log(JSON.stringify(ketQua, null, 2));
    return;
  }
  const { tong, tong_truong, loi, ok } = ketQua;
  const theoLoai = demTheoLoai(loi);
  console.log(`Kiểm toàn vẹn registry — ${tong} văn bản` + (tong_truong != null ? ` (tong=${tong_truong})` : ''));
  console.log(`Kết luận: ${ok ? 'TOÀN VẸN' : 'CÓ LỖI'}`);
  if (!ok) {
    console.log('Tóm tắt theo loại:');
    for (const [loai, n] of Object.entries(theoLoai).sort()) {
      console.log(`  - ${loai}: ${n}`);
    }
    console.log(`Chi tiết (${loi.length} lỗi):`);
    for (const e of loi) console.log(`  · [${e.loai}] ${e.msg}`);
  }
}

function chayTuFile(duongDan, { json = false } = {}) {
  const path = resolve(duongDan);
  if (!existsSync(path)) {
    console.error(`Không tìm thấy: ${path}`);
    process.exit(2);
  }
  let registry;
  try {
    registry = JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    console.error(`Không đọc được JSON: ${path}\n${err.message}`);
    process.exit(2);
  }
  const ketQua = kiemTraToanVen(registry);
  inBaoCao(ketQua, { json });
  process.exit(ketQua.ok ? 0 : 1);
}

function laChinh() {
  const entry = process.argv[1] ? resolve(process.argv[1]) : '';
  return entry === fileURLToPath(import.meta.url);
}

if (laChinh()) {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const pathArg = args.find((a) => a !== '--json');
  const duongDan = pathArg || join(ROOT, 'dist', 'registry.json');
  chayTuFile(duongDan, { json });
}
