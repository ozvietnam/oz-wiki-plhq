#!/usr/bin/env node
// Dựng cổng web tra cứu tĩnh (0 CDN, 0 npm mới) từ dist/ (hoặc in-memory fallback khi distDir chưa có tệp):
//   <outDir>/.nojekyll
//   <outDir>/index.html, app.js, style.css
//   <outDir>/data/{registry,wiki-index,wiki-chunks,dieu-khoan,cas-index}.json
// Tuyệt đối KHÔNG xuất chu-giai-hs.json, chu-giai-chuong.json, hs-index*.json (ranh giới oz-wiki-plhq ↔ hs-code-api).
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import yaml from 'js-yaml';
import { ROOT, homNay, LUOC_DO_PHIEN_BAN, napSo } from './lib/registry.mjs';
import { dungJson } from './dung.mjs';
import { dungWikiDist } from './lib/wiki-dist.mjs';
import { dungDieuKhoan, dungCasIndex } from './lib/dieu-khoan-dist.mjs';

const TEP_DU_LIEU = [
  'registry.json',
  'wiki-index.json',
  'wiki-chunks.json',
  'dieu-khoan.json',
  'cas-index.json',
];

const TEP_CAM_RANH_GIOI = [
  'chu-giai-hs.json',
  'chu-giai-chuong.json',
  'hs-index.json',
  'hs-index-theo-ma.json',
];

function docJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function taiTuDienNhan(baseRoot) {
  const coQuanTen = {};
  const nhanhTen = {};
  const regDir = existsSync(join(baseRoot, 'registry', 'co-quan.yaml'))
    ? join(baseRoot, 'registry')
    : join(ROOT, 'registry');

  try {
    const cq = yaml.load(readFileSync(join(regDir, 'co-quan.yaml'), 'utf8'), { schema: yaml.CORE_SCHEMA });
    if (Array.isArray(cq)) {
      for (const item of cq) {
        if (item?.ky_hieu && item?.ten) coQuanTen[String(item.ky_hieu)] = String(item.ten);
      }
    }
  } catch { /* bỏ qua nếu thiếu tệp tùy chọn */ }

  try {
    const cay = yaml.load(readFileSync(join(regDir, 'cay-xnk.yaml'), 'utf8'), { schema: yaml.CORE_SCHEMA });
    const duyet = (nodes, chaPath = '', chaTen = '') => {
      for (const n of nodes || []) {
        if (!n?.id) continue;
        const p = chaPath ? `${chaPath}/${n.id}` : String(n.id);
        const t = n.ten ? (chaTen ? `${chaTen} › ${n.ten}` : String(n.ten)) : p;
        nhanhTen[p] = t;
        duyet(n.con, p, t);
      }
    };
    if (Array.isArray(cay)) duyet(cay);
  } catch { /* bỏ qua nếu thiếu tệp tùy chọn */ }

  return { coQuanTen, nhanhTen };
}

/** Rút gọn dist/registry.json cho trình duyệt: bỏ trường nội bộ/cồng kềnh, giữ đủ trường tra cứu & quan hệ. */
export function rutGonRegistry(reg, { coQuanTen = {}, nhanhTen = {} } = {}) {
  const vanBan = (reg?.van_ban || []).map((d) => {
    const out = {
      so_hieu: d.so_hieu,
      slug: d.slug || null,
      loai: d.loai || null,
      ten: d.ten || '',
      co_quan: d.co_quan || null,
      ngay_ban_hanh: d.ngay_ban_hanh || null,
      hieu_luc_tu: d.hieu_luc_tu || null,
      het_hieu_luc_tu: d.het_hieu_luc_tu || null,
      tinh_trang: d.tinh_trang || 'CHUA_XAC_MINH',
      nhanh: Array.isArray(d.nhanh) ? d.nhanh : [],
      bac_nguon_cao_nhat: d.bac_nguon_cao_nhat || null,
      xac_minh: d.xac_minh ? {
        muc: d.xac_minh.muc || 'CHUA_XAC_MINH',
        hieu_luc_da_doi_chieu: d.xac_minh.hieu_luc_da_doi_chieu === true,
        ngay: d.xac_minh.ngay || null,
        ...(d.xac_minh.chan ? { chan: d.xac_minh.chan } : {}),
      } : { muc: 'CHUA_XAC_MINH', hieu_luc_da_doi_chieu: false, ngay: null },
      nguon: Array.isArray(d.nguon)
        ? d.nguon.filter((n) => n?.url).map((n) => ({
            url: String(n.url),
            ...(n.truy_cap ? { truy_cap: String(n.truy_cap) } : {}),
          }))
        : [],
    };
    if (Array.isArray(d.so_hieu_khac) && d.so_hieu_khac.length) out.so_hieu_khac = d.so_hieu_khac;
    if (Array.isArray(d.tu_khoa) && d.tu_khoa.length) out.tu_khoa = d.tu_khoa;
    if (d.quan_he && Object.keys(d.quan_he).length) out.quan_he = d.quan_he;
    if (d.quan_he_nguoc && Object.keys(d.quan_he_nguoc).length) out.quan_he_nguoc = d.quan_he_nguoc;
    if (typeof d.ghi_chu === 'string' && d.ghi_chu.trim()) {
      const gc = d.ghi_chu.trim();
      out.ghi_chu = gc.length > 320 ? `${gc.slice(0, 317)}...` : gc;
    }
    return out;
  });

  const ketQua = {
    phien_ban: reg?.phien_ban || homNay(),
    luoc_do_phien_ban: reg?.luoc_do_phien_ban || LUOC_DO_PHIEN_BAN,
    giay_phep: reg?.giay_phep || 'CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/',
    tong: vanBan.length,
    van_ban: vanBan,
  };
  if (Object.keys(coQuanTen).length) ketQua.co_quan_ten = coQuanTen;
  if (Object.keys(nhanhTen).length) ketQua.nhanh_ten = nhanhTen;
  return ketQua;
}

function chenThongTinDung(noiDung, meta) {
  return String(noiDung)
    .replaceAll('{{LUOC_DO_PHIEN_BAN}}', meta.luoc_do_phien_ban)
    .replaceAll('{{PHIEN_BAN}}', meta.phien_ban)
    .replaceAll('{{THOI_DIEM_DUNG}}', meta.thoi_diem_dung);
}

/**
 * Dựng cổng tra cứu tĩnh hoàn chỉnh vào `outDir`.
 * Đọc trực tiếp từ `distDir` nếu đủ 5 tệp JSON; nếu `distDir` chưa có tệp thì tự chạy fallback in-memory từ `root`.
 */
export function dungWeb({
  distDir,
  templateDir,
  outDir,
  root,
  today,
} = {}) {
  const baseRoot = root ? resolve(root) : ROOT;
  const inDist = distDir ? resolve(distDir) : join(baseRoot, 'dist');
  const inTpl = templateDir
    ? resolve(templateDir)
    : (existsSync(join(baseRoot, 'tools', 'web-template'))
      ? join(baseRoot, 'tools', 'web-template')
      : join(ROOT, 'tools', 'web-template'));
  const targetOut = outDir ? resolve(outDir) : join(baseRoot, 'site');
  const ngayDung = today || homNay();
  const thoiDiemDung = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

  if (!existsSync(inTpl)) {
    throw new Error(`Không tìm thấy thư mục giao diện mẫu: ${inTpl}`);
  }

  let datasets;
  let nguonDuLieu = 'dist';
  const du5TepDist = existsSync(inDist) && TEP_DU_LIEU.every((f) => existsSync(join(inDist, f)));

  if (du5TepDist) {
    datasets = {
      'registry.json': docJson(join(inDist, 'registry.json')),
      'wiki-index.json': docJson(join(inDist, 'wiki-index.json')),
      'wiki-chunks.json': docJson(join(inDist, 'wiki-chunks.json')),
      'dieu-khoan.json': docJson(join(inDist, 'dieu-khoan.json')),
      'cas-index.json': docJson(join(inDist, 'cas-index.json')),
    };
  } else if (existsSync(join(baseRoot, 'registry', 'van-ban'))) {
    nguonDuLieu = 'in-memory';
    const so = napSo(baseRoot);
    const reg = dungJson(so, ngayDung);
    const { index: wikiIndex, chunks: wikiChunks } = dungWikiDist(so, baseRoot, ngayDung);
    const dieuKhoan = dungDieuKhoan(so, baseRoot, ngayDung);
    const casIndex = dungCasIndex(so, baseRoot, ngayDung);
    datasets = {
      'registry.json': reg,
      'wiki-index.json': wikiIndex,
      'wiki-chunks.json': wikiChunks,
      'dieu-khoan.json': dieuKhoan,
      'cas-index.json': casIndex,
    };
  } else {
    const thieu = TEP_DU_LIEU.filter((f) => !existsSync(join(inDist, f)));
    throw new Error(
      `Thư mục dist không đầy đủ (${inDist}; thiếu: ${thieu.join(', ')}) và không có registry/van-ban tại ${baseRoot}. Hãy chạy "npm run dung" trước.`
    );
  }

  const nhan = taiTuDienNhan(baseRoot);
  const regGon = rutGonRegistry(datasets['registry.json'], nhan);
  const outDatasets = {
    'registry.json': regGon,
    'wiki-index.json': datasets['wiki-index.json'],
    'wiki-chunks.json': datasets['wiki-chunks.json'],
    'dieu-khoan.json': datasets['dieu-khoan.json'],
    'cas-index.json': datasets['cas-index.json'],
  };

  const meta = {
    luoc_do_phien_ban: String(regGon.luoc_do_phien_ban || LUOC_DO_PHIEN_BAN),
    phien_ban: String(regGon.phien_ban || ngayDung),
    thoi_diem_dung: thoiDiemDung,
  };

  const dataOutDir = join(targetOut, 'data');
  mkdirSync(dataOutDir, { recursive: true });
  // Bảo đảm không sót tệp ngoài ranh giới HS hoặc tệp cũ trong <outDir>/data/
  for (const forbidden of TEP_CAM_RANH_GIOI) {
    rmSync(join(dataOutDir, forbidden), { force: true });
  }

  writeFileSync(join(targetOut, '.nojekyll'), '');
  for (const tplFile of ['index.html', 'app.js', 'style.css']) {
    const src = readFileSync(join(inTpl, tplFile), 'utf8');
    writeFileSync(join(targetOut, tplFile), chenThongTinDung(src, meta));
  }

  const dataStats = [];
  let tongBytesData = 0;
  for (const [name, payload] of Object.entries(outDatasets)) {
    const jsonText = JSON.stringify(payload);
    const dest = join(dataOutDir, name);
    writeFileSync(dest, jsonText);
    const bytes = Buffer.byteLength(jsonText, 'utf8');
    tongBytesData += bytes;
    dataStats.push({ name, bytes });
  }

  return {
    outDir: targetOut,
    distDir: inDist,
    nguonDuLieu,
    ...meta,
    dataFiles: dataStats,
    tongBytesData,
  };
}

function docThamSoCli(argv) {
  const layGiaTri = (flag) => {
    const idx = argv.indexOf(flag);
    return idx !== -1 && argv[idx + 1] && !argv[idx + 1].startsWith('--')
      ? resolve(argv[idx + 1])
      : null;
  };
  return {
    help: argv.includes('--help') || argv.includes('-h'),
    outDir: layGiaTri('--out') || join(ROOT, 'site'),
    distDir: layGiaTri('--dist') || join(ROOT, 'dist'),
    templateDir: layGiaTri('--template') || undefined,
    root: layGiaTri('--root') || ROOT,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const opts = docThamSoCli(process.argv.slice(2));
  if (opts.help) {
    console.log('Cách dùng: node tools/dung-web.mjs [--out <dir>] [--dist <dir>] [--template <dir>] [--root <dir>]');
    process.exit(0);
  }
  const kq = dungWeb(opts);
  const mb = (n) => `${(n / (1024 * 1024)).toFixed(2)} MB (${(n / 1024).toFixed(1)} KB)`;
  console.log(`Đã dựng cổng web tại ${kq.outDir} [nguồn: ${kq.nguonDuLieu}, lược đồ ${kq.luoc_do_phien_ban}, bản ${kq.phien_ban}]`);
  for (const f of kq.dataFiles) {
    console.log(`  - data/${f.name}: ${(f.bytes / 1024).toFixed(1)} KB (${f.bytes} B)`);
  }
  console.log(`Tổng data/: ${mb(kq.tongBytesData)}`);
}
