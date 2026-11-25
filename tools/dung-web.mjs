#!/usr/bin/env node
// Dựng cổng web tra cứu tĩnh (0 CDN, 0 npm mới) từ dist/ (hoặc in-memory fallback khi distDir chưa có tệp):
//   <outDir>/.nojekyll
//   <outDir>/index.html, app.js, style.css
//   <outDir>/data/{registry,wiki-index,wiki-chunks,dieu-khoan,cas-index,hs-policy,sap-het-hieu-luc}.json
// Tuyệt đối KHÔNG xuất chu-giai-hs.json, chu-giai-chuong.json, hs-index.json, hs-index-theo-ma.json (ranh giới oz-wiki-plhq ↔ hs-code-api).
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
import { ROOT, homNay, LUOC_DO_PHIEN_BAN, napSo, bacNguon } from './lib/registry.mjs';
import { dungJson } from './dung.mjs';
import { dungChiMuc, dungChiMucTheoMa } from './lib/danh-muc.mjs';
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

const MS_PER_DAY = 86_400_000;
const RE_ISO_NGAY = /^\d{4}-\d{2}-\d{2}$/;
let cachedNguonUyTin = null;

function taiNguonUyTin(baseRoot = ROOT) {
  const custom = join(baseRoot, 'registry', 'nguon-uy-tin.yaml');
  if (baseRoot !== ROOT && existsSync(custom)) {
    try {
      const data = yaml.load(readFileSync(custom, 'utf8'), { schema: yaml.CORE_SCHEMA });
      if (data && typeof data === 'object') return data;
    } catch { /* fallback sang ROOT */ }
  }
  if (!cachedNguonUyTin) {
    try {
      const data = yaml.load(readFileSync(join(ROOT, 'registry', 'nguon-uy-tin.yaml'), 'utf8'), { schema: yaml.CORE_SCHEMA });
      cachedNguonUyTin = data && typeof data === 'object' ? data : {};
    } catch {
      cachedNguonUyTin = {};
    }
  }
  return cachedNguonUyTin;
}

function parseUtcDayMs(dateStr) {
  if (typeof dateStr !== 'string' || !RE_ISO_NGAY.test(dateStr)) return NaN;
  const ms = Date.parse(`${dateStr}T00:00:00Z`);
  if (!Number.isFinite(ms)) return NaN;
  return new Date(ms).toISOString().slice(0, 10) === dateStr ? ms : NaN;
}

/** Rút gọn dist/hs-index-theo-ma.json cho trình duyệt (chỉ giữ chính sách theo mã HS đã biết; bỏ ten & tien_le_tb_tchq). */
export function rutGonHsPolicy(hsIndexTheoMa, { phien_ban, luoc_do_phien_ban } = {}) {
  const pb = hsIndexTheoMa?.phien_ban || phien_ban || homNay();
  const ldpb = hsIndexTheoMa?.luoc_do_phien_ban || luoc_do_phien_ban || LUOC_DO_PHIEN_BAN;
  const srcMa = hsIndexTheoMa?.ma && typeof hsIndexTheoMa.ma === 'object' ? hsIndexTheoMa.ma : {};
  const ma = {};

  for (const code of Object.keys(srcMa).sort()) {
    const list = srcMa[code];
    if (!Array.isArray(list) || !list.length) continue;
    const seen = new Set();
    const entries = [];
    for (const e of list) {
      if (!e?.so_hieu) continue;
      const item = {
        so_hieu: String(e.so_hieu),
        slug: e.slug || null,
        tinh_trang: e.tinh_trang || 'CHUA_XAC_MINH',
        hieu_luc_tu: e.hieu_luc_tu || null,
        het_hieu_luc_tu: e.het_hieu_luc_tu || null,
        hieu_luc_da_doi_chieu: e.hieu_luc_da_doi_chieu === true,
        loai_tac_dong: e.loai_tac_dong || null,
        muc_rui_ro: e.muc_rui_ro || null,
        dieu_kien: e.dieu_kien || null,
        dan_chieu: e.dan_chieu || null,
      };
      const sig = JSON.stringify(item);
      if (!seen.has(sig)) {
        seen.add(sig);
        entries.push(item);
      }
    }
    if (entries.length) ma[code] = entries;
  }

  return {
    phien_ban: pb,
    luoc_do_phien_ban: ldpb,
    tong_nhom_ma: Object.keys(ma).length,
    ma,
  };
}

/** Lọc văn bản chưa HET_HIEU_LUC có het_hieu_luc_tu từ `today` đến `today + trong_so_ngay` (mặc định 60 ngày), sắp tăng dần. */
export function tinhSapHetHieuLuc(reg, { today, trongSoNgay = 60, trong_so_ngay, nguonUyTin } = {}) {
  const rawWindow = trong_so_ngay ?? trongSoNgay;
  const cuaSo = Number.isFinite(Number(rawWindow)) ? Math.max(0, Math.floor(Number(rawWindow))) : 60;
  const phienBan = reg?.phien_ban || today || homNay();
  const ngayDung = today || reg?.phien_ban || homNay();
  const todayMs = parseUtcDayMs(ngayDung);
  if (!Number.isFinite(todayMs)) {
    return {
      phien_ban: phienBan,
      ngay_dung: ngayDung,
      trong_so_ngay: cuaSo,
      tong: 0,
      danh_sach: [],
    };
  }

  const uyTin = nguonUyTin || taiNguonUyTin(ROOT);
  const danhSach = [];
  for (const d of reg?.van_ban || []) {
    if (!d || d.tinh_trang === 'HET_HIEU_LUC') continue;
    const hetMs = parseUtcDayMs(d.het_hieu_luc_tu);
    if (!Number.isFinite(hetMs)) continue;
    const soNgayConLai = Math.round((hetMs - todayMs) / MS_PER_DAY);
    if (soNgayConLai < 0 || soNgayConLai > cuaSo) continue;
    const urlNguonA = Array.isArray(d.nguon)
      ? (d.nguon.find((n) => n?.url && bacNguon(String(n.url), uyTin) === 'A')?.url || null)
      : null;
    danhSach.push({
      so_hieu: d.so_hieu,
      slug: d.slug || null,
      ten: d.ten || '',
      co_quan: d.co_quan || null,
      tinh_trang: d.tinh_trang || 'CHUA_XAC_MINH',
      het_hieu_luc_tu: d.het_hieu_luc_tu,
      so_ngay_con_lai: soNgayConLai,
      xac_minh_muc: d.xac_minh?.muc || 'CHUA_XAC_MINH',
      nhanh: Array.isArray(d.nhanh) ? d.nhanh : [],
      url_nguon_a: urlNguonA ? String(urlNguonA) : null,
    });
  }

  danhSach.sort((a, b) =>
    a.het_hieu_luc_tu.localeCompare(b.het_hieu_luc_tu)
    || String(a.so_hieu || '').localeCompare(String(b.so_hieu || ''), 'vi')
  );

  return {
    phien_ban: phienBan,
    ngay_dung: ngayDung,
    trong_so_ngay: cuaSo,
    tong: danhSach.length,
    danh_sach: danhSach,
  };
}

function chenThongTinDung(noiDung, meta) {
  return String(noiDung)
    .replaceAll('{{LUOC_DO_PHIEN_BAN}}', meta.luoc_do_phien_ban)
    .replaceAll('{{PHIEN_BAN}}', meta.phien_ban)
    .replaceAll('{{THOI_DIEM_DUNG}}', meta.thoi_diem_dung);
}

function taoTenManhAnToan(rawSlug, idx, usedSet) {
  const base = String(rawSlug || `doc-${idx}`)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^\.+/, '')
    .replace(/^-+|-+$/g, '') || `doc-${idx}`;
  let candidate = base;
  let n = 2;
  while (usedSet.has(candidate)) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  usedSet.add(candidate);
  return candidate;
}

export function chiaManhDieuKhoan(dieuKhoanData = {}) {
  const usedA = new Set();
  const usedB = new Set();
  const shards = {};

  const mapDoc = (doc, idx, prefix, tierName, usedSet) => {
    const safeSlug = taoTenManhAnToan(doc.slug || doc.so_hieu, idx, usedSet);
    const shardPath = `dk/${prefix}-${safeSlug}.json`;
    const clauses = Array.isArray(doc.dieu_khoan) ? doc.dieu_khoan : [];
    shards[shardPath] = {
      _tier: tierName,
      so_hieu: doc.so_hieu ?? null,
      slug: doc.slug ?? safeSlug,
      ten: doc.ten ?? null,
      tinh_trang: doc.tinh_trang ?? null,
      hieu_luc_tu: doc.hieu_luc_tu ?? null,
      het_hieu_luc_tu: doc.het_hieu_luc_tu ?? null,
      nguon_a: doc.nguon_a ?? null,
      dieu_khoan: clauses,
    };
    return {
      so_hieu: doc.so_hieu ?? null,
      slug: doc.slug ?? safeSlug,
      ten: doc.ten ?? null,
      tinh_trang: doc.tinh_trang ?? null,
      hieu_luc_tu: doc.hieu_luc_tu ?? null,
      het_hieu_luc_tu: doc.het_hieu_luc_tu ?? null,
      nguon_a: doc.nguon_a ?? null,
      so_dieu: clauses.length,
      shard: shardPath,
    };
  };

  const nguyenVan = (dieuKhoanData.nguyen_van_nguon_a || []).map(
    (doc, idx) => mapDoc(doc, idx, 'a', 'NGUYEN_VAN_NGUON_A', usedA)
  );
  const tomTat = (dieuKhoanData.tom_tat_nhap || []).map(
    (doc, idx) => mapDoc(doc, idx, 'b', 'TOM_TAT_NHAP', usedB)
  );

  return {
    index: {
      phien_ban: dieuKhoanData.phien_ban,
      luoc_do_phien_ban: dieuKhoanData.luoc_do_phien_ban,
      canh_bao_tang_nhap: dieuKhoanData.canh_bao_tang_nhap,
      thong_ke: dieuKhoanData.thong_ke,
      nguyen_van_nguon_a: nguyenVan,
      tom_tat_nhap: tomTat,
    },
    shards,
  };
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
  let hsTheoMa = null;
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
    const hsTheoMaPath = join(inDist, 'hs-index-theo-ma.json');
    if (existsSync(hsTheoMaPath)) {
      hsTheoMa = docJson(hsTheoMaPath);
    }
  } else if (existsSync(join(baseRoot, 'registry', 'van-ban'))) {
    nguonDuLieu = 'in-memory';
    const so = napSo(baseRoot);
    const reg = dungJson(so, ngayDung);
    const { index: wikiIndex, chunks: wikiChunks } = dungWikiDist(so, baseRoot, ngayDung);
    const dieuKhoan = dungDieuKhoan(so, baseRoot, ngayDung);
    const casIndex = dungCasIndex(so, baseRoot, ngayDung);
    const chiMuc = dungChiMuc(so, baseRoot, ngayDung);
    if (chiMuc.van_ban.length) {
      hsTheoMa = dungChiMucTheoMa(chiMuc);
    }
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
  const meta = {
    luoc_do_phien_ban: String(regGon.luoc_do_phien_ban || LUOC_DO_PHIEN_BAN),
    phien_ban: String(regGon.phien_ban || ngayDung),
    thoi_diem_dung: thoiDiemDung,
  };
  const hsPolicy = rutGonHsPolicy(hsTheoMa, meta);
  const sapHetHieuLuc = tinhSapHetHieuLuc(regGon, {
    today: today || regGon.phien_ban || ngayDung,
    nguonUyTin: taiNguonUyTin(baseRoot),
  });

  const { index: dieuKhoanIndex, shards: dieuKhoanShards } = chiaManhDieuKhoan(datasets['dieu-khoan.json']);

  const outDatasets = {
    'registry.json': regGon,
    'wiki-index.json': datasets['wiki-index.json'],
    'wiki-chunks.json': datasets['wiki-chunks.json'],
    'dieu-khoan.json': datasets['dieu-khoan.json'],
    'dieu-khoan-index.json': dieuKhoanIndex,
    'cas-index.json': datasets['cas-index.json'],
    'hs-policy.json': hsPolicy,
    'sap-het-hieu-luc.json': sapHetHieuLuc,
  };

  const dataOutDir = join(targetOut, 'data');
  const dkShardDir = join(dataOutDir, 'dk');
  mkdirSync(dataOutDir, { recursive: true });
  rmSync(dkShardDir, { recursive: true, force: true });
  mkdirSync(dkShardDir, { recursive: true });
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

  let tongBytesManhDieuKhoan = 0;
  const shardEntries = Object.entries(dieuKhoanShards);
  for (const [relPath, shardPayload] of shardEntries) {
    const jsonText = JSON.stringify(shardPayload);
    writeFileSync(join(dataOutDir, relPath), jsonText);
    tongBytesManhDieuKhoan += Buffer.byteLength(jsonText, 'utf8');
  }

  return {
    outDir: targetOut,
    distDir: inDist,
    nguonDuLieu,
    ...meta,
    dataFiles: dataStats,
    tongBytesData,
    soManhDieuKhoan: shardEntries.length,
    tongBytesManhDieuKhoan,
  };
}

function docThamSoCli(argv) {
  const layGiaTri = (flag, resolvePath = true) => {
    const idx = argv.indexOf(flag);
    if (idx === -1 || !argv[idx + 1] || argv[idx + 1].startsWith('--')) return null;
    return resolvePath ? resolve(argv[idx + 1]) : argv[idx + 1];
  };
  return {
    help: argv.includes('--help') || argv.includes('-h'),
    outDir: layGiaTri('--out') || join(ROOT, 'site'),
    distDir: layGiaTri('--dist') || join(ROOT, 'dist'),
    templateDir: layGiaTri('--template') || undefined,
    root: layGiaTri('--root') || ROOT,
    today: layGiaTri('--today', false) || undefined,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const opts = docThamSoCli(process.argv.slice(2));
  if (opts.help) {
    console.log('Cách dùng: node tools/dung-web.mjs [--out <dir>] [--dist <dir>] [--template <dir>] [--root <dir>] [--today YYYY-MM-DD]');
    process.exit(0);
  }
  const kq = dungWeb(opts);
  const mb = (n) => `${(n / (1024 * 1024)).toFixed(2)} MB (${(n / 1024).toFixed(1)} KB)`;
  console.log(`Đã dựng cổng web tại ${kq.outDir} [nguồn: ${kq.nguonDuLieu}, lược đồ ${kq.luoc_do_phien_ban}, bản ${kq.phien_ban}]`);
  for (const f of kq.dataFiles) {
    console.log(`  - data/${f.name}: ${(f.bytes / 1024).toFixed(1)} KB (${f.bytes} B)`);
  }
  console.log(`  - data/dk/*.json (${kq.soManhDieuKhoan} mảnh): ${(kq.tongBytesManhDieuKhoan / 1024).toFixed(1)} KB (${kq.tongBytesManhDieuKhoan} B)`);
  console.log(`Tổng data/*.json: ${mb(kq.tongBytesData)}`);
}
