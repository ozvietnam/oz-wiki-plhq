#!/usr/bin/env node
// Phát hiện điểm mù của thư viện: thứ đang thiếu, đang mâu thuẫn, đang dựa vào nguồn yếu.
// Không gọi AI, không cần mạng. Kết quả là danh sách việc cụ thể cho người và agent.
//   node tools/diem-mu.mjs            → ghi bao-cao/diem-mu.md + bao-cao/diem-mu.json
//   node tools/diem-mu.mjs --stdout   → in markdown ra màn hình (dùng làm nội dung issue)
// Có nhu-cau/hs-code-api.json (tools/nhu-cau.mjs) thì xếp thêm việc theo số mã HS chịu ảnh hưởng.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { napSo, khoa, bacNguon, chuanCanh, dungDoThi, homNay, ROOT, QUAN_HE_LAM_MAT_HIEU_LUC } from './lib/registry.mjs';
import { napDanhMuc, kiemDinhDang, doiChieu, docBieuThue, laVanBanDanhMuc } from './lib/danh-muc.mjs';

const MUC = { CAO: 'Cao', VUA: 'Vừa', THAP: 'Thấp' };
// Số hiệu văn bản trong chữ: 28/2026/TT-BCT, 08/2015/NĐ-CP, 1182/QĐ-BCT, 54/2014/QH13
const RE_SO_HIEU = /\b\d{1,4}\/(?:\d{4}\/)?(?:TT|NĐ|ND|QĐ|QD|NQ|TTLT|CT)-[A-ZĐa-z]+(?:-[A-ZĐ]+)?\b|\b\d{1,3}\/\d{4}\/QH\d{2}\b/g;

function cong(ngay, soNgay) {
  const d = new Date(`${ngay}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + soNgay);
  return d.toISOString().slice(0, 10);
}

function quetWiki(root) {
  const dir = join(root, 'wiki');
  const out = [];
  const walk = (p) => {
    if (!existsSync(p)) return;
    for (const f of readdirSync(p)) {
      const fp = join(p, f);
      if (statSync(fp).isDirectory()) { if (f !== 'graph') walk(fp); } else if (f.endsWith('.md')) out.push(fp);
    }
  };
  walk(dir);
  return out;
}

/** Đọc nhu cầu của ứng dụng đang dùng sổ (null nếu chưa có). */
export function docNhuCau(root = ROOT) {
  const p = join(root, 'nhu-cau', 'hs-code-api.json');
  if (!existsSync(p)) return null;
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch { return null; }
}

export function timDiemMu(so, { today = homNay(), root = ROOT, nhuCau = docNhuCau(root), bieuThue = docBieuThue(root) } = {}) {
  const ds = [];
  // trongSo: xếp trong cùng nhóm (vd số mã HS chịu ảnh hưởng) — lớn trước.
  const add = (ma, muc, tieuDe, muc_tieu, viec, luong, trongSo = 0) => ds.push({ ma, muc, tieuDe, muc_tieu, viec, luong, trongSo });
  const { nguoc, thieu } = dungDoThi(so);
  const theoKhoa = (s) => so.theoKhoa.get(khoa(s))?.[0];

  // D1 — văn bản được nhắc trong quan hệ nhưng chưa có trong sổ
  for (const t of thieu.values()) {
    add('THIEU_VAN_BAN', MUC.CAO, `Chưa có trong sổ: ${t.so_hieu}`, t.so_hieu,
      `Tạo registry/van-ban/ cho ${t.so_hieu} (được nhắc bởi ${t.nhacBoi.join(', ')}). Dùng: node tools/them-van-ban.mjs "${t.so_hieu}"`, 'he-thong-hoa');
  }

  for (const d of so.vanBan) {
    const nguon = d.nguon || [];
    const coA = nguon.some((n) => bacNguon(n.url, so.nguon) === 'A');
    const ng = nguoc.get(khoa(d.so_hieu)) || {};

    // D4 — mâu thuẫn hiệu lực: còn ghi CON_HIEU_LUC nhưng đã bị thay/bãi bỏ toàn bộ bởi văn bản đang có hiệu lực
    if (d.tinh_trang === 'CON_HIEU_LUC') {
      for (const ten of ['bi_thay_the_boi', 'bi_bai_bo_boi']) {
        for (const e of ng[ten] || []) {
          if (e.pham_vi) continue;
          const src = theoKhoa(e.tu);
          if (!src || !['CON_HIEU_LUC', 'HET_HIEU_LUC_MOT_PHAN'].includes(src.tinh_trang)) continue;
          const tu = e.tu_ngay || src.hieu_luc_tu;
          if (tu && tu > today) continue;
          add('MAU_THUAN_HIEU_LUC', MUC.CAO, `${d.so_hieu} còn ghi "còn hiệu lực" nhưng ${ten === 'bi_thay_the_boi' ? 'đã bị thay bởi' : 'đã bị bãi bỏ bởi'} ${e.tu}`, d.so_hieu,
            `Đối chiếu nguồn A rồi sửa tinh_trang/het_hieu_luc_tu trong ${d._file}, hoặc sửa quan hệ ở văn bản ${e.tu} nếu sai.`, 'hieu-luc');
        }
      }
    }

    // D5 — sắp hết / sắp có hiệu lực (60 ngày)
    if (d.het_hieu_luc_tu && d.het_hieu_luc_tu > today && d.het_hieu_luc_tu <= cong(today, 60)) {
      add('SAP_HET_HIEU_LUC', MUC.CAO, `${d.so_hieu} hết hiệu lực ngày ${d.het_hieu_luc_tu}`, d.so_hieu,
        `Tới ngày thì chuyển tinh_trang; rà mọi trang wiki và văn bản đang dẫn chiếu ${d.so_hieu}.`, 'hieu-luc');
    }
    if (d.tinh_trang === 'CHUA_CO_HIEU_LUC' && d.hieu_luc_tu && d.hieu_luc_tu <= cong(today, 60)) {
      add('SAP_CO_HIEU_LUC', MUC.VUA, `${d.so_hieu} có hiệu lực ngày ${d.hieu_luc_tu}`, d.so_hieu,
        `Tới ngày thì chuyển CON_HIEU_LUC; nạp toàn văn và tóm tắt vào wiki trước ngày hiệu lực.`, 'doc-hieu');
    }
    if (d.tinh_trang === 'CHUA_CO_HIEU_LUC' && d.hieu_luc_tu && d.hieu_luc_tu <= today) {
      add('MAU_THUAN_HIEU_LUC', MUC.CAO, `${d.so_hieu} ghi "chưa có hiệu lực" nhưng ngày hiệu lực ${d.hieu_luc_tu} đã qua`, d.so_hieu,
        `Chuyển tinh_trang sang CON_HIEU_LUC sau khi đối chiếu.`, 'hieu-luc');
    }

    // D6 — hướng dẫn mồ côi: văn bản còn hiệu lực nhưng mọi văn bản nó hướng dẫn đã hết hiệu lực
    const hd = (d.quan_he?.huong_dan || []).map(chuanCanh).filter(Boolean);
    if (d.tinh_trang === 'CON_HIEU_LUC' && hd.length) {
      const goc = hd.map((c) => theoKhoa(c.so_hieu)).filter(Boolean);
      if (goc.length === hd.length && goc.every((g) => g.tinh_trang === 'HET_HIEU_LUC')) {
        add('HUONG_DAN_MO_COI', MUC.CAO, `${d.so_hieu} hướng dẫn văn bản đã hết hiệu lực (${hd.map((c) => c.so_hieu).join(', ')})`, d.so_hieu,
          'Kiểm tra văn bản này còn được áp dụng không (thường hết hiệu lực theo văn bản gốc), hoặc đã có văn bản hướng dẫn mới.', 'hieu-luc');
      }
    }

    // D2 — không có nguồn bậc A (ưu tiên văn bản được biểu thuế dẫn nhiều)
    if (!coA) {
      const nang = (d.trich_dan_trong_bieu_thue || 0) >= 50 || d.tinh_trang === 'CON_HIEU_LUC';
      add('KHONG_NGUON_A', nang ? MUC.VUA : MUC.THAP, `${d.so_hieu}: chưa có nguồn chính thống${d.xac_minh?.muc === 'NGUON_THU_CAP' ? ' (đang dựa vào nguồn thứ cấp)' : ''}`, d.so_hieu,
        'Tìm trang văn bản trên congbao.chinhphu.vn / vanban.chinhphu.vn / vbpl.vn, thêm vào nguon, ghi truy_cap.', 'truy-vet-nguon');
    }
    // D13 — cảnh báo nguồn
    if (d.xac_minh?.canh_bao) add('CANH_BAO_NGUON', MUC.CAO, `${d.so_hieu}: ${d.xac_minh.canh_bao}`, d.so_hieu, 'Xác minh với cơ quan ban hành hoặc Công báo.', 'truy-vet-nguon');

    // D3 — hiệu lực chưa đối chiếu nguồn A
    if (!d.xac_minh?.hieu_luc_da_doi_chieu) {
      add('HIEU_LUC_CHUA_DOI_CHIEU', (d.trich_dan_trong_bieu_thue || 0) >= 100 ? MUC.VUA : MUC.THAP,
        `${d.so_hieu}: tình trạng "${d.tinh_trang}" chưa đối chiếu nguồn A`, d.so_hieu,
        'Mở trang văn bản nguồn A, xem lược đồ hiệu lực, đặt xac_minh.hieu_luc_da_doi_chieu: true + ngay + boi.', 'hieu-luc');
    }
    // D12 — xác minh cũ
    if (d.xac_minh?.ngay && d.xac_minh.ngay < cong(today, -180) && d.tinh_trang === 'CON_HIEU_LUC') {
      add('XAC_MINH_CU', MUC.THAP, `${d.so_hieu}: lần đối chiếu cuối ${d.xac_minh.ngay}`, d.so_hieu, 'Đối chiếu lại hiệu lực.', 'hieu-luc');
    }
    // D9 — chưa có toàn văn
    if (!d.toan_van && d.tinh_trang !== 'HET_HIEU_LUC') {
      add('KHONG_TOAN_VAN', (d.trich_dan_trong_bieu_thue || 0) >= 100 || d.loai === 'LUAT' ? MUC.VUA : MUC.THAP,
        `${d.so_hieu}: chưa có toàn văn trong raw/`, d.so_hieu, `node tools/nap.mjs <url PDF/HTML nguồn A> --so-hieu "${d.so_hieu}" --ghi`, 'nap-lam-sach');
    }
    // D10 — văn bản khung
    if (/^\(chưa có tiêu đề\)/.test(d.ten || '')) add('VAN_BAN_KHUNG', MUC.VUA, `${d.so_hieu}: chưa có tiêu đề, ngày, nguồn`, d.so_hieu, 'Bổ sung ten, ngay_ban_hanh, hieu_luc_tu, nguon.', 'he-thong-hoa');
    // D8 — chưa xếp vào cây
    if ((d.nhanh || []).includes('chua-phan-loai')) add('CHUA_PHAN_LOAI', MUC.THAP, `${d.so_hieu}: chưa xếp vào cây`, d.so_hieu, 'Chọn nút phù hợp trong registry/cay-xnk.yaml; thiếu nút thì đề xuất nút mới.', 'cay-du-lieu');
    // D14 — cơ quan đã sáp nhập nhưng văn bản còn hiệu lực
    const cq = so.coQuan.find((c) => c.ky_hieu === d.co_quan);
    if (cq?.sap_nhap_vao && d.tinh_trang === 'CON_HIEU_LUC') {
      add('CO_QUAN_DA_SAP_NHAP', MUC.THAP, `${d.so_hieu} (${cq.ten}) còn ghi hiệu lực — cơ quan đã sáp nhập vào ${cq.sap_nhap_vao}`, d.so_hieu,
        `Kiểm tra ${cq.sap_nhap_vao} đã ban hành văn bản thay thế chưa.`, 'do-tham');
    }
  }

  // D7 — nút cây trống / thiếu loại văn bản cần có
  const theoNut = new Map();
  for (const d of so.vanBan) for (const n of d.nhanh || []) {
    for (const p of so.nutCay.filter((x) => n === x.path || n.startsWith(`${x.path}/`))) {
      if (!theoNut.has(p.path)) theoNut.set(p.path, []);
      theoNut.get(p.path).push(d);
    }
  }
  for (const n of so.nutCay) {
    if (n.id === 'chua-phan-loai') continue;
    const docs = (theoNut.get(n.path) || []).filter((d) => d.tinh_trang !== 'HET_HIEU_LUC');
    if (!docs.length) add('NUT_CAY_TRONG', n.soCon ? MUC.VUA : MUC.CAO, `Nhánh "${n.ten}" (${n.path}) chưa có văn bản còn hiệu lực`, n.path,
      'Do thám và thêm các văn bản thuộc nhánh này.', 'do-tham');
    for (const loai of n.can_co || []) {
      if (!docs.some((d) => d.loai === loai)) add('NUT_THIEU_LOAI', MUC.CAO, `Nhánh "${n.ten}" thiếu ${loai} còn hiệu lực`, n.path, `Tìm ${loai} đang điều chỉnh nhánh này.`, 'do-tham');
    }
  }

  // D11 — số hiệu nhắc trong wiki chưa có trong sổ
  const daDangKy = new Set(so.vanBan.map((d) => khoa(d.so_hieu)));
  const nhacWiki = new Map();
  for (const f of quetWiki(root)) {
    const txt = readFileSync(f, 'utf8');
    for (const m of txt.match(RE_SO_HIEU) || []) {
      const k = khoa(m);
      if (daDangKy.has(k)) continue;
      if (!nhacWiki.has(k)) nhacWiki.set(k, { so_hieu: m, files: new Set() });
      nhacWiki.get(k).files.add(relative(root, f));
    }
  }
  for (const v of nhacWiki.values()) {
    add('WIKI_NHAC_CHUA_DANG_KY', MUC.VUA, `Wiki nhắc ${v.so_hieu} nhưng sổ chưa có`, v.so_hieu,
      `Thêm vào sổ (${[...v.files].join(', ')}).`, 'lien-ket-cheo');
  }

  // D-DM — lớp mã HS ↔ văn bản (docs/luoc-do-danh-muc-hs.md)
  const bangDm = napDanhMuc(so, root);
  const daCoBang = new Set(bangDm.map((it) => khoa(it.vanBan.so_hieu)));
  const soMaDan = new Map((nhuCau?.vanBanDuocDan || []).map((v) => [khoa(v.soHieu), v.soMaHs]));
  for (const d of so.vanBan) {
    if (daCoBang.has(khoa(d.so_hieu)) || !laVanBanDanhMuc(d)) continue;
    const dan = soMaDan.get(khoa(d.so_hieu)) || d.trich_dan_trong_bieu_thue || 0;
    const ktcn2026 = (d.nhanh || []).some((n) => n.startsWith('kiem-tra-chuyen-nganh')) && String(d.hieu_luc_tu || '') >= '2026-07-01';
    add('DANH_MUC_CHUA_TRICH', ktcn2026 || dan >= 50 ? MUC.CAO : MUC.VUA, `Chưa trích bảng mã HS: ${d.so_hieu}`, d.so_hieu,
      `Văn bản danh mục chưa có danh-muc/${d._slug}.csv. Tìm bản có phụ lục (ưu tiên Công báo có lớp chữ), trích theo docs/luoc-do-danh-muc-hs.md, kiểm bằng npm test.${dan ? ` Biểu thuế đang dẫn ${dan} mã.` : ''}`, 'danh-muc-hs', ktcn2026 ? 10000 + dan : dan);
  }
  for (const it of bangDm) {
    if (kiemDinhDang(it).length) continue;
    const { khongTonTai, danChieu } = doiChieu(it, { bt: bieuThue, so });
    for (const o of khongTonTai) {
      add('HS_KHONG_TON_TAI', MUC.VUA, `${it.vanBan.so_hieu}: mã ${o.ma_hs} không có trong biểu thuế`, it.vanBan.so_hieu,
        `${it.tep} dòng ${o._dong} ("${o.mo_ta.slice(0, 60)}"). Kiểm lại bản gốc: lỗi trích, mã của biểu thuế cũ, hay biểu thuế đối chiếu chưa cập nhật.`, 'danh-muc-hs');
    }
    for (const [sh, dc] of danChieu) {
      if (dc && daCoBang.has(khoa(dc.so_hieu))) continue;
      add('DAN_CHIEU_CHUA_CO_BANG', MUC.VUA, `${it.vanBan.so_hieu} dẫn mã HS sang ${sh} — ${dc ? 'văn bản đó chưa có bảng' : 'chưa có trong sổ'}`, sh,
        `${it.tep} có dòng không ghi mã mà dẫn chiếu ${sh}. ${dc ? `Trích danh-muc/${dc._slug}.csv` : `Thêm ${sh} vào sổ rồi trích bảng`} để mã HS của các dòng này tra được.`, 'danh-muc-hs');
    }
  }

  // D-HS — nhu cầu thật từ hs-code-api: văn bản biểu thuế đang dẫn, xếp theo số mã HS chịu ảnh hưởng.
  // Đối chiếu với sổ HIỆN TẠI (bản đo có thể cũ hơn sổ): việc đã làm xong thì tự biến mất.
  if (nhuCau) {
    const tenApp = 'hs-code-api';
    for (const v of nhuCau.vanBanDuocDan || []) {
      const d = theoKhoa(v.soHieu);
      if (!d) {
        add('HS_API_CHUA_CO', MUC.CAO, `Biểu thuế dẫn nhưng sổ chưa có: ${v.soHieu} (${v.soMaHs} mã HS)`, v.soHieu,
          `${v.soMaHs} mã HS trong ${tenApp} dẫn văn bản này ở cột chính sách. Thêm vào sổ: node tools/them-van-ban.mjs "${v.soHieu}"`, 'he-thong-hoa', v.soMaHs);
      } else if (!d.xac_minh?.hieu_luc_da_doi_chieu) {
        add('HS_API_UU_TIEN_DOI_CHIEU', v.soMaHs >= 50 ? MUC.CAO : MUC.VUA, `Đối chiếu hiệu lực ${d.so_hieu} — ${v.soMaHs} mã HS đang dẫn`, d.so_hieu,
          `Sổ ghi ${d.tinh_trang} nhưng chưa đối chiếu nguồn A; ${v.soMaHs} mã HS của ${tenApp} dựa vào dòng này để báo căn cứ còn/hết hiệu lực. Mở điều khoản hiệu lực, ghi hieu_luc_da_doi_chieu: true kèm nguồn.`, 'hieu-luc', v.soMaHs);
      }
    }
    const lech = new Map();
    for (const x of nhuCau.thuVienLech || []) {
      const k = khoa(x.soHieu || x.code);
      if (!lech.has(k)) lech.set(k, { ...x, cachViet: new Set() });
      lech.get(k).cachViet.add(x.code);
    }
    for (const x of lech.values()) {
      const d = theoKhoa(x.soHieu || x.code);
      if (!d || d.tinh_trang !== x.so) continue; // sổ đã đổi từ lúc đo → chờ lần đo sau
      add('HS_API_LECH_THU_VIEN', MUC.VUA, `${d.so_hieu}: ${tenApp} ghi ${x.thuVien}, sổ ghi ${x.so}`, d.so_hieu,
        `Thư viện /api/legal-docs của ${tenApp} (${[...x.cachViet].join(', ')}) ghi khác sổ. Đối chiếu nguồn A: sổ sai thì sửa sổ; sổ đúng thì ghi hieu_luc_da_doi_chieu: true và mở issue bên ${tenApp}.`, 'hieu-luc');
    }
  }
  return ds;
}

const THU_TU = { Cao: 0, 'Vừa': 1, 'Thấp': 2 };
const TEN_MA = {
  MAU_THUAN_HIEU_LUC: 'Mâu thuẫn hiệu lực', SAP_HET_HIEU_LUC: 'Sắp hết hiệu lực (≤60 ngày)', SAP_CO_HIEU_LUC: 'Sắp có hiệu lực (≤60 ngày)',
  HUONG_DAN_MO_COI: 'Văn bản hướng dẫn mất gốc', THIEU_VAN_BAN: 'Được nhắc nhưng chưa có trong sổ', CANH_BAO_NGUON: 'Cảnh báo nguồn',
  NUT_CAY_TRONG: 'Nhánh cây chưa có văn bản', NUT_THIEU_LOAI: 'Nhánh cây thiếu loại văn bản bắt buộc', VAN_BAN_KHUNG: 'Văn bản khung thiếu thông tin',
  WIKI_NHAC_CHUA_DANG_KY: 'Wiki nhắc văn bản chưa đăng ký', KHONG_NGUON_A: 'Chưa có nguồn chính thống', KHONG_TOAN_VAN: 'Chưa có toàn văn',
  HIEU_LUC_CHUA_DOI_CHIEU: 'Hiệu lực chưa đối chiếu nguồn A', XAC_MINH_CU: 'Đối chiếu đã cũ', CHUA_PHAN_LOAI: 'Chưa xếp vào cây', CO_QUAN_DA_SAP_NHAP: 'Văn bản của cơ quan đã sáp nhập',
  HS_API_CHUA_CO: 'Biểu thuế (hs-code-api) dẫn nhưng sổ chưa có', HS_API_UU_TIEN_DOI_CHIEU: 'Ưu tiên đối chiếu — theo số mã HS đang dẫn (hs-code-api)',
  HS_API_LECH_THU_VIEN: 'Thư viện hs-code-api ghi khác sổ',
  DANH_MUC_CHUA_TRICH: 'Văn bản danh mục chưa trích bảng mã HS', HS_KHONG_TON_TAI: 'Mã HS trong bảng không có trong biểu thuế',
  DAN_CHIEU_CHUA_CO_BANG: 'Bảng dẫn chiếu mã HS sang văn bản chưa có bảng',
};

export function veMarkdown(ds, { today = homNay(), gioiHan = 40 } = {}) {
  const nhom = new Map();
  for (const d of ds) {
    if (!nhom.has(d.ma)) nhom.set(d.ma, []);
    nhom.get(d.ma).push(d);
  }
  const dem = { Cao: 0, 'Vừa': 0, 'Thấp': 0 };
  for (const d of ds) dem[d.muc] += 1;
  const lines = [
    `# Báo cáo điểm mù — ${today}`,
    '',
    `Tổng ${ds.length} điểm: **${dem.Cao} cao**, ${dem['Vừa']} vừa, ${dem['Thấp']} thấp. Sinh bởi \`node tools/diem-mu.mjs\` (không dùng AI).`,
    '',
    'Nhận một dòng: mở issue theo mẫu "Điểm mù" hoặc PR ghi mã điểm mù trong mô tả.',
    '',
    '| Nhóm | Mức | Số điểm | Luồng việc |',
    '|---|---|---|---|',
  ];
  const ma = [...nhom.keys()].sort((a, b) => THU_TU[nhom.get(a)[0].muc] - THU_TU[nhom.get(b)[0].muc] || nhom.get(b).length - nhom.get(a).length);
  for (const m of ma) lines.push(`| ${TEN_MA[m] || m} | ${nhom.get(m)[0].muc} | ${nhom.get(m).length} | \`${nhom.get(m)[0].luong}\` |`);
  for (const m of ma) {
    const items = nhom.get(m).sort((a, b) => THU_TU[a.muc] - THU_TU[b.muc] || (b.trongSo || 0) - (a.trongSo || 0));
    lines.push('', `## ${TEN_MA[m] || m} (${items.length})`, '');
    for (const d of items.slice(0, gioiHan)) lines.push(`- [ ] **${d.tieuDe}** — ${d.viec}`);
    if (items.length > gioiHan) lines.push(`- … và ${items.length - gioiHan} điểm khác (xem bao-cao/diem-mu.json)`);
  }
  return lines.join('\n') + '\n';
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const today = homNay();
  const ds = timDiemMu(napSo(), { today });
  const md = veMarkdown(ds, { today });
  if (process.argv.includes('--stdout')) process.stdout.write(md);
  else {
    mkdirSync(join(ROOT, 'bao-cao'), { recursive: true });
    writeFileSync(join(ROOT, 'bao-cao', 'diem-mu.md'), md);
    writeFileSync(join(ROOT, 'bao-cao', 'diem-mu.json'), JSON.stringify({ ngay: today, tong: ds.length, diem: ds }, null, 2) + '\n');
    console.log(`${ds.length} điểm mù → bao-cao/diem-mu.md`);
  }
}
