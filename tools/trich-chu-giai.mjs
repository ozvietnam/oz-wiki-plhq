#!/usr/bin/env node
// Trích Chú giải chương / Chú giải phân nhóm của Danh mục hàng hóa XK-NK Việt Nam (TT 31/2022/TT-BTC)
// từ bản chữ đã tách (-raw) của 18 phần Công báo trong raw/download/congbaocdn.chinhphu.vn/.
// Xuất danh-muc/chu-giai-chuong.json — nguồn dữ liệu cho tools/chu-giai.mjs.
// Chạy lại khi bổ sung phần Công báo mới: node tools/trich-chu-giai.mjs
// Lưu ý layout: mỗi trang Công báo là bảng in xoay 2-up; bản tách bằng `pdftotext -raw` giữ
// thứ tự đọc từng đoạn (VN rồi EN ngay sau). Parser lọc giữ dòng tiếng Việt, bỏ bản dịch EN,
// bỏ văn phòng (số trang, dòng chữ ký số, tiêu đề công báo).
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = join('raw', 'download', 'congbaocdn.chinhphu.vn');
const RA = join('danh-muc', 'chu-giai-chuong.json');

const VĂN_PHÒNG = [
  /^\d{1,3}$/, /^\d{1,3} CÔNG BÁO\/Số/, /^CÔNG BÁO\/Số/,
  /^Người ký:/, /^Email:/, /^Cơ quan:/, /^Thời gian ký:/, /^Ký bởi:/,
  /^VĂN BẢN QUY PHẠM PHÁP LUẬT$/, /^BỘ TÀI CHÍNH$/, /^Thông tư số 31\/2022\/TT-BTC/,
  /^\(Tiếp theo Công báo số/, /^Phụ lục I$/, /^DANH MỤC HÀNG HÓA XUẤT KHẨU, NHẬP KHẨU VIỆT NAM$/,
  /^\(Ban hành kèm theo Thông tư số 31\/2022\/TT-BTC/,
  /^[-_=]{3,}$/,
];
const RÁC_EN = /^(Notes|Subheading Note|Code|Description|Unit of|quantity|Chapter \d+|Mã hàng Mô tả hàng hóa|Mã hàng$|Mô tả hàng hóa$|Đơn vị$|tính$)/;

// Ghép đôi dòng tiêu đề song ngữ "Chương 87 Chapter 87" / "Chú giải Notes" / "Chú giải phân nhóm Subheading Note"
function táchVN(l) {
  return l
    .replace(/ Chapter \d+$/, '').replace(/ Subheading Notes?$/, '').replace(/ Notes?$/, '').replace(/ Title$/, '')
    .replace(/ RULE \d+( \([a-z]\))?$/, '').replace(/ EXPLANATORY NOTES?$/, '').trim();
}
// Cắt đuôi tiếng Anh dính cùng dòng với tiếng Việt (vd "1. Chương này không bao gồm: 1. This Chapter does not cover:")
function cắtĐuôiEN(l) {
  const gốc = l;
  for (const m of [...l.matchAll(/(?<=[\s:])(?=\d+\.\s+[A-Z])|(?<=\s)(?=[A-Z][a-z])/g)]) {
    const i = m.index;
    const trái = l.slice(0, i).trimEnd();
    const phải = l.slice(i).trim();
    if (!trái || !phải) continue;
    if (!/\d/.test(phải) && (phải.match(/[A-Za-z]{2,}/g) || []).length < 3) continue;
    const phảiToànAscii = /^[\x20-\x7E]+$/.test(phải);
    const cóChữ = (phải.match(/[A-Za-z]{2,}/g) || []).length >= 2;
    if (phảiToànAscii && cóChữ) return dọnNhãnThừa(trái);
  }
  return gốc;
}
const cóDấu = (l) => /[àáảãạăâđêôơưÀ-ỹýỳỷỹỵ]/i.test(l);
const làBảng = (l) => /^Mã hàng/.test(l) || /^\d{2}\.\d{2}(\s|$)/.test(l) || /^- /i.test(l) && /^\d/.test(l);
// "…không hợp kim (a)" sau khi cắt EN "(a) Nickel…" → bỏ nhãn (x) lặp ở cuối
function dọnNhãnThừa(l) {
  return l.replace(/\s*\(([a-z])\)$/, (m, c) => (l.includes('(' + c + ')') ? '' : m)).trimEnd();
}
// Tiêu đề còn đuôi EN một từ (vd "Tơ tằm Silk") → bỏ từ ASCII viết hoa cuối khi phần trước có dấu tiếng Việt
function dọnTiêuĐề(l) {
  return l.replace(/\s+[A-Z][a-z]{3,}$/, (m) => (cóDấu(l.slice(0, l.length - m.length)) ? '' : m)).trimEnd();
}

function làVN(l) {
  if (!l.trim()) return false;
  if (VĂN_PHÒNG.some((r) => r.test(l))) return false;
  const t = táchVN(l);
  if (!t) return false;
  if (RÁC_EN.test(t)) return false;
  // Dòng tiếng Anh: không có dấu tiếng Việt và có ≥2 từ chữ cái ASCII
  if (!cóDấu(t) && (t.match(/[A-Za-z]{2,}/g) || []).length >= 2) return false;
  // Mảnh đuôi EN ngắn (1 từ): bỏ khi chứa từ tiếng Anh phổ biến, trừ nhãn mục "(a)", "C."
  if (!cóDấu(t) && /\b(heading|chapter|section|note|notes|or|and|the|of|to|for|with|other|not|are|is|be|by|from|standard|weight|water|than)\b/i.test(t)
      && !/^\(?[a-z]\)?[.,;:]?$/i.test(t)) return false;
  return true;
}

const files = readdirSync(DIR).filter((f) => /^tt-31-2022-cb-.*\.txt$/.test(f)).sort();
if (!files.length) { console.error('Không thấy bản chữ tt-31-2022-cb-*.txt trong ' + DIR); process.exit(1); }

// Gộp toàn bộ trang theo thứ tự file, đánh dấu trang \f
const trang = []; // { file, so }
for (const f of files) {
  const noiDung = readFileSync(join(DIR, f), 'utf8');
  const phan = noiDung.split('\f');
  for (let i = 0; i < phan.length; i++) trang.push({ file: f, so: i + 1, dong: phan[i].split('\n') });
}

// Quét tuần tự tìm khối chương thật (heading + 'Chú giải' kề sau)
const chuong = {};
const gir = { quy_tac: null, nguon: null };
let p = 0;
const dòngPhẳng = [];
for (let t = 0; t < trang.length; t++) for (const l of trang[t].dong) dòngPhẳng.push({ l, t });

for (let i = 0; i < dòngPhẳng.length; i++) {
  const l = dòngPhẳng[i].l.trim();
  const m = l.match(/^Chương (\d{1,2})(?: Chapter \d+)?$/);
  if (!m) continue;
  const so = String(Number(m[1])).padStart(2, '0');
  if (chuong[so]) continue;// đã có khối thật
  // khối thật: trong 30 dòng kế có 'Chú giải' (thuần hoặc ghép Notes)
  const win = dòngPhẳng.slice(i, i + 30).map((x) => táchVN(x.l));
  const cóMốc = win.some((x) => x === 'Chú giải') || win.some((x) => x === 'Chú giải phân nhóm');
  if (!cóMốc) continue;

  const t0 = dòngPhẳng[i].t;
  const ra = { ten: [], chu_giai: [], chu_giai_phan_nhom: [], nguon_file: trang[t0].file, nguon_trang: trang[t0].so };
  let pha = 'ten';
  let xong = false;
  for (let j = i + 1; j < dòngPhẳng.length && !xong; j++) {
    const t1 = dòngPhẳng[j].t;
    if (t1 - t0 > 6) break; // an toàn: khối chú giải không trải quá 6 trang
    const raw = dòngPhẳng[j].l.trim();
    if (!isNaN(Number(raw)) && raw.length <= 3) continue;
    if (/^\d{1,3} CÔNG BÁO/.test(raw)) continue;
    const t2 = táchVN(raw);
    if (t2 === 'Chú giải') { pha = 'chu_giai'; continue; }
    if (t2 === 'Chú giải phân nhóm') { pha = 'phan_nhom'; continue; }
    if (/^Chương \d{1,2} Chapter/.test(raw) || /^Chương \d{1,2}$/.test(raw)) { xong = true; break; } // chương kế
    if (làBảng(raw)) { xong = true; break; } // bảng bắt đầu
    if (!làVN(raw)) continue;
    const lọc = cắtĐuôiEN(t2);
    if (pha === 'ten') { if (ra.ten.length < 6) ra.ten.push(dọnTiêuĐề(lọc)); continue; }
    if (pha === 'chu_giai') { ra.chu_giai.push(lọc); continue; }
    if (pha === 'phan_nhom') { ra.chu_giai_phan_nhom.push(lọc); continue; }
  }
  const gọn = (a) => a.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  chuong[so] = { ten: gọn(ra.ten), chu_giai: gọn(ra.chu_giai), chu_giai_phan_nhom: gọn(ra.chu_giai_phan_nhom), nguon_file: ra.nguon_file, nguon_trang: ra.nguon_trang };
}

// Fallback: chương không có bất kỳ mốc chú giải nào (vd 50-55, 58 — nguồn không in note) → chỉ lấy tên.
// Chọn lần xuất hiện có dòng kề sau là TIÊU ĐỀ (chữ, không phải bảng), loại dòng header chạy trang bảng.
for (let i = 0; i < dòngPhẳng.length; i++) {
  const l = dòngPhẳng[i].l.trim();
  const m = l.match(/^Chương (\d{1,2})(?: Chapter \d+)?$/);
  if (!m) continue;
  const so = String(Number(m[1])).padStart(2, '0');
  if (chuong[so]) continue;
  const t0 = dòngPhẳng[i].t;
  const kề = [];
  for (let j = i + 1; j < dòngPhẳng.length && j < i + 8; j++) {
    const raw = dòngPhẳng[j].l.trim();
    if (!raw) continue;
    const t2 = táchVN(raw);
    if (t2 === 'Chú giải' || t2 === 'Chú giải phân nhóm') break;
    if (/^Mã hàng/.test(t2)) break; // bảng ngay sau tiêu đề = chương không có note
    if (/^\d{2}\.\d{2}/.test(t2)) { kề.length = 0; break; } // mã hàng đứng trước = header chạy trang bảng
    if (!làVN(raw)) continue;
    kề.push(dọnTiêuĐề(cắtĐuôiEN(t2)));
    if (kề.length >= 3) break;
  }
  if (!kề.length) continue;
  const nối = kề.join(' ');
  // tiêu đề thật: có chữ cái, không bắt đầu bằng gạch/mã; ưu tiên dòng có dấu tiếng Việt
  if (/^[-\d]/.test(nối)) continue;
  chuong[so] = { ten: kề.join('\n').replace(/\n{3,}/g, '\n\n').trim(), chu_giai: '', chu_giai_phan_nhom: '', nguon_file: trang[t0].file, nguon_trang: trang[t0].so };
}

// GIR: khối "SÁU QUY TẮC TỔNG QUÁT" trong phần cuối
for (let i = 0; i < dòngPhẳng.length; i++) {
  if (/^SÁU QUY TẮC TỔNG QUÁT/.test(dòngPhẳng[i].l.trim())) {
    const g = [];
    for (let j = i; j < dòngPhẳng.length && j < i + 1200; j++) {
      const raw = dòngPhẳng[j].l.trim();
      if (/^PHỤ LỤC|^Phụ lục III/.test(raw)) break;
      if (!isNaN(Number(raw)) && raw.length <= 3) continue;
      if (/CÔNG BÁO|Người ký:|Email:|Cơ quan:|Thời gian ký:/.test(raw)) continue;
      if (/^RULE \d+$/.test(raw) || /^principles:$/i.test(raw) || /^ngày \d{2} tháng \d{1,2} năm \d{4} của Bộ trưởng/.test(raw)) continue;
      const t2 = táchVN(raw);
      if (!làVN(raw)) continue;
      if (/^[-_=]{3,}$/.test(t2)) continue;
      g.push(cắtĐuôiEN(t2));
    }
    gir.quy_tac = g.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    gir.nguon = 'Phụ lục II TT 31/2022/TT-BTC, ' + trang[dòngPhẳng[i].t].file;
    break;
  }
}

const ra = {
  _comment: 'Chú giải chương + chú giải phân nhóm (bản tiếng Việt) của Danh mục hàng hóa XK-NK Việt Nam — trích từ Công báo gốc TT 31/2022/TT-BTC bằng tools/trich-chu-giai.mjs (pdftotext -raw, bỏ bản dịch EN). Bản gốc có giá trị pháp lý; tệp này là bản tra cứu.',
  nguon: 'TT 31/2022/TT-BTC — Công báo số 523-558, 18 phần, tại raw/download/congbaocdn.chinhphu.vn/tt-31-2022-cb-*.pdf',
  ngay_trich: new Date().toISOString().slice(0, 10),
  quy_tac_tong_quat: gir.quy_tac,
  quy_tac_nguon: gir.nguon,
  tong_chuong: Object.keys(chuong).length,
  chuong,
};
writeFileSync(RA, JSON.stringify(ra, null, 1) + '\n');
const coChuGiai = Object.values(chuong).filter((c) => c.chu_giai).length;
const coPhanNhom = Object.values(chuong).filter((c) => c.chu_giai_phan_nhom).length;
console.log(`danh-muc/chu-giai-chuong.json — ${ra.tong_chuong} chương (${coChuGiai} có chú giải, ${coPhanNhom} có chú giải phân nhóm), GIR ${gir.quy_tac ? 'OK' : 'THIẾU'}`);
