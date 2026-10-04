#!/usr/bin/env node
// Kiểm sổ đăng ký văn bản. LỖI → chặn PR (exit 1). CẢNH BÁO → in ra, không chặn.
//   node tools/kiem-tra.mjs [--json]
import { napSo, khoa, slugTuSoHieu, bacNguon, chuanCanh, dungDoThi, homNay, ROOT,
  LOAI, TINH_TRANG, MUC_XAC_MINH, CHAN_HIEU_LUC, QUAN_HE } from './lib/registry.mjs';
import { napDanhMuc, kiemDinhDang } from './lib/danh-muc.mjs';

const NGAY = /^\d{4}-\d{2}-\d{2}$/;
const TRUONG = new Set(['so_hieu', 'loai', 'ten', 'co_quan', 'ngay_ban_hanh', 'hieu_luc_tu', 'het_hieu_luc_tu',
  'tinh_trang', 'nhanh', 'quan_he', 'nguon', 'toan_van', 'trich_dan_trong_bieu_thue', 'xac_minh', 'ghi_chu', 'tu_khoa', 'so_hieu_khac', 'danh_muc_hs']);

export function kiemTra(so, { today = homNay(), root = ROOT } = {}) {
  const loi = [];
  const canhBao = [];
  const L = (file, msg) => loi.push({ file, msg });
  const W = (file, msg) => canhBao.push({ file, msg });

  for (const e of so.loiDoc) L(e.file, `YAML hỏng: ${e.message}`);
  const nut = new Set(so.nutCay.map((n) => n.path));
  const coQuan = new Set(so.coQuan.map((c) => c.ky_hieu));
  const idCay = new Map();
  for (const n of so.nutCay) {
    if (!/^[a-z0-9-]+$/.test(n.id)) L('registry/cay-xnk.yaml', `id nút "${n.id}" phải là chữ thường không dấu, gạch ngang`);
    if (idCay.has(n.path)) L('registry/cay-xnk.yaml', `trùng nút ${n.path}`);
    idCay.set(n.path, true);
  }

  for (const [k, ds] of so.theoKhoa) {
    if (ds.length > 1) L(ds.map((d) => d._file).join(', '), `trùng số hiệu (khoá ${k}) giữa ${ds.map((d) => d.so_hieu).join(' và ')} — gộp lại, sửa so_hieu_khac, hoặc ghi rõ năm nếu là hai quyết định khác năm`);
  }

  for (const d of so.vanBan) {
    const f = d._file;
    if (!d || typeof d !== 'object') { L(f, 'không phải object'); continue; }
    for (const k of Object.keys(d)) if (!k.startsWith('_') && !TRUONG.has(k)) W(f, `trường lạ "${k}"`);
    if (!d.so_hieu) L(f, 'thiếu so_hieu');
    if (d.so_hieu_khac != null && !Array.isArray(d.so_hieu_khac)) L(f, 'so_hieu_khac phải là danh sách');
    if (!d.ten) L(f, 'thiếu ten');
    if (!LOAI.includes(d.loai)) L(f, `loai "${d.loai}" không hợp lệ (${LOAI.join(', ')})`);
    if (!TINH_TRANG.includes(d.tinh_trang)) L(f, `tinh_trang "${d.tinh_trang}" không hợp lệ (${TINH_TRANG.join(', ')})`);
    if (d.co_quan && !coQuan.has(d.co_quan)) L(f, `co_quan "${d.co_quan}" chưa có trong registry/co-quan.yaml`);
    for (const k of ['ngay_ban_hanh', 'hieu_luc_tu', 'het_hieu_luc_tu']) {
      if (d[k] != null && !NGAY.test(String(d[k]))) L(f, `${k} phải dạng YYYY-MM-DD`);
    }
    if (d.ngay_ban_hanh && d.hieu_luc_tu && d.hieu_luc_tu < d.ngay_ban_hanh) L(f, 'hieu_luc_tu trước ngay_ban_hanh');
    if (d.so_hieu) {
      const nam = String(d.ngay_ban_hanh || '').slice(0, 4) || null;
      const ky = slugTuSoHieu(d.so_hieu, nam);
      if (d._slug !== ky && !d._slug.startsWith(ky.replace(/-\d{4}$/, ''))) W(f, `tên file nên là ${ky}.yaml`);
    }
    if (!Array.isArray(d.nhanh) || !d.nhanh.length) L(f, 'thiếu nhanh (gắn ít nhất một nút cây, chưa biết thì "chua-phan-loai")');
    for (const n of d.nhanh || []) if (!nut.has(n)) L(f, `nhanh "${n}" không có trong registry/cay-xnk.yaml`);

    // Tình trạng ↔ ngày
    if (d.tinh_trang === 'CHUA_CO_HIEU_LUC' && d.hieu_luc_tu && d.hieu_luc_tu <= today) W(f, `ghi CHUA_CO_HIEU_LUC nhưng hieu_luc_tu ${d.hieu_luc_tu} đã qua`);
    if (d.tinh_trang === 'CON_HIEU_LUC' && d.het_hieu_luc_tu && d.het_hieu_luc_tu <= today) L(f, `ghi CON_HIEU_LUC nhưng het_hieu_luc_tu ${d.het_hieu_luc_tu} đã qua`);
    if (d.tinh_trang === 'HET_HIEU_LUC' && d.het_hieu_luc_tu && d.het_hieu_luc_tu > today) L(f, `ghi HET_HIEU_LUC nhưng het_hieu_luc_tu ${d.het_hieu_luc_tu} chưa tới`);

    // Quan hệ
    for (const [qh, arr] of Object.entries(d.quan_he || {})) {
      if (!QUAN_HE[qh]) { L(f, `quan_he "${qh}" không hợp lệ (${Object.keys(QUAN_HE).join(', ')})`); continue; }
      if (!Array.isArray(arr)) { L(f, `quan_he.${qh} phải là danh sách`); continue; }
      for (const raw of arr) {
        const c = chuanCanh(raw);
        if (!c) { L(f, `quan_he.${qh}: phần tử phải là số hiệu hoặc {so_hieu, pham_vi, tu_ngay, can_cu}`); continue; }
        if (khoa(c.so_hieu) === khoa(d.so_hieu)) L(f, `quan_he.${qh} trỏ vào chính nó`);
        if (c.tu_ngay && !NGAY.test(String(c.tu_ngay))) L(f, `quan_he.${qh}.tu_ngay phải dạng YYYY-MM-DD`);
      }
    }

    // Nguồn + xác minh
    const nguon = d.nguon || [];
    for (const n of nguon) {
      if (!n?.url || !/^https?:\/\//.test(n.url)) L(f, 'nguon: mỗi mục cần url http(s)');
      if (n?.truy_cap && !NGAY.test(String(n.truy_cap))) L(f, 'nguon.truy_cap phải dạng YYYY-MM-DD');
    }
    const xm = d.xac_minh || {};
    if (!MUC_XAC_MINH.includes(xm.muc)) L(f, `xac_minh.muc "${xm.muc}" không hợp lệ (${MUC_XAC_MINH.join(', ')})`);
    if (xm.muc === 'NGUON_A' && !nguon.some((n) => bacNguon(n.url, so.nguon) === 'A')) L(f, 'xac_minh.muc = NGUON_A nhưng không có nguồn bậc A (registry/nguon-uy-tin.yaml)');
    if (xm.hieu_luc_da_doi_chieu === true && !nguon.some((n) => bacNguon(n.url, so.nguon) === 'A')) L(f, 'hieu_luc_da_doi_chieu = true cần ít nhất một nguồn bậc A');
    if (xm.chan != null) {
      if (typeof xm.chan !== 'object' || Array.isArray(xm.chan)) L(f, 'xac_minh.chan phải là object {ma, ngay, viec_tiep}');
      else {
        if (!CHAN_HIEU_LUC.includes(xm.chan.ma)) L(f, `xac_minh.chan.ma "${xm.chan.ma}" không hợp lệ (${CHAN_HIEU_LUC.join(', ')})`);
        if (!xm.chan.ngay || !NGAY.test(String(xm.chan.ngay))) L(f, 'xac_minh.chan.ngay phải dạng YYYY-MM-DD');
        if (!xm.chan.viec_tiep || !String(xm.chan.viec_tiep).trim()) L(f, 'xac_minh.chan.viec_tiep không được trống');
        if (xm.hieu_luc_da_doi_chieu === true) L(f, 'không vừa hieu_luc_da_doi_chieu: true vừa có xac_minh.chan — xóa chan khi đã đối chiếu xong');
      }
    }
  }

  // Bảng danh mục mã HS (docs/luoc-do-danh-muc-hs.md)
  for (const d of so.vanBan) {
    const dm = d.danh_muc_hs;
    if (dm == null) continue;
    if (typeof dm !== 'object' || Array.isArray(dm)) { L(d._file, 'danh_muc_hs phải là object {tep, nguon, trich_boi, ngay}'); continue; }
    if (!/^danh-muc\/[a-z0-9-]+\.csv$/.test(String(dm.tep || ''))) L(d._file, 'danh_muc_hs.tep phải dạng danh-muc/<slug>.csv');
    if (dm.nguon != null && !/^https?:\/\//.test(String(dm.nguon))) L(d._file, 'danh_muc_hs.nguon phải là URL http(s) của bản có phụ lục');
    if (dm.ngay != null && !NGAY.test(String(dm.ngay))) L(d._file, 'danh_muc_hs.ngay phải dạng YYYY-MM-DD');
    if (dm.da_doi_chieu === true && !dm.nguon) L(d._file, 'danh_muc_hs.da_doi_chieu = true cần nguon (bản có phụ lục đã mở)');
  }
  for (const it of napDanhMuc(so, root)) for (const msg of kiemDinhDang(it)) L(it.vanBan._file, msg);

  // Chu trình thay thế (A thay B, B thay A)
  const { nguoc } = dungDoThi(so);
  for (const d of so.vanBan) {
    for (const raw of d.quan_he?.thay_the || []) {
      const c = chuanCanh(raw);
      const back = nguoc.get(khoa(d.so_hieu))?.bi_thay_the_boi || [];
      if (c && back.some((b) => khoa(b.tu) === khoa(c.so_hieu))) L(d._file, `chu trình thay thế với ${c.so_hieu}`);
    }
  }
  return { loi, canhBao, soVanBan: so.vanBan.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = kiemTra(napSo());
  if (process.argv.includes('--json')) console.log(JSON.stringify(r, null, 2));
  else {
    for (const w of r.canhBao) console.log(`CẢNH BÁO ${w.file}: ${w.msg}`);
    for (const e of r.loi) console.log(`LỖI     ${e.file}: ${e.msg}`);
    console.log(`\n${r.soVanBan} văn bản · ${r.loi.length} lỗi · ${r.canhBao.length} cảnh báo`);
  }
  process.exit(r.loi.length ? 1 : 0);
}
