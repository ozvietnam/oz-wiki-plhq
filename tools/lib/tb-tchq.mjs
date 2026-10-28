// Thư viện dùng chung cho 3 công cụ nạp nội dung TB-TCHQ (issue #232).
//
//   tools/tai-pdf-tb.mjs        — tải PDF gốc từ master CSV customs.gov.vn
//   tools/trich-noi-dung-tb.mjs — OCR + trích cấu trúc nội dung TB
//   tools/tb-chay-lo.mjs        — vòng chạy hàng loạt theo demand
//
// KHÔNG phụ thuộc gói npm nào: chạy được trên máy chủ Linux chỉ có node + poppler
// (pdftotext, pdftoppm) + tesseract. Không gọi LLM, không suy luận — mọi trường đều
// trích nguyên văn từ PDF.
//
// Nguyên tắc: thà thiếu còn hơn sai. Trích được thì ghi, không trích được thì
// ghi trang_thai "khong_trich_duoc" + lý do — KHÔNG bịa, KHÔNG đoán.
import { appendFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';

/** User-Agent cố định — server customs.gov.vn cần nhận diện người tải. */
export const UA = 'oz-wiki-plhq/1.0 (ozvietnam, ceo@ozfreight.vn)';
export const CSV_MAC_DINH = 'data/customs/processed/all-1990-2026.csv';
export const KET_QUA_MAC_DINH = 'data/customs/processed/tracuuhs-ket-qua-phan-loai-2026-10-10.json';
export const THU_MUC_NOI_DUNG_MAC_DINH = 'data/customs/processed/tb-noi-dung';
export const FILE_NHAT_KY_MAC_DINH = 'nap-tb.jsonl';
export const FILE_LOI_NAP_MAC_DINH = 'loi-nap.jsonl';
export const FILE_LOG_MAC_DINH = 'log-nap.jsonl';

// ---------------------------------------------------------------- CSV

/** CSV theo RFC 4180 (dấu phẩy, ngoặc kép, xuống dòng trong ô). Không phụ thuộc gói ngoài. */
export function docCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let q = false;
  const s = String(text ?? '').replace(/^﻿/, '');
  for (let i = 0; i < s.length; i += 1) {
    const ch = s[i];
    if (q) {
      if (ch === '"' && s[i + 1] === '"') { cell += '"'; i += 1; } else if (ch === '"') q = false; else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && s[i + 1] === '\n') i += 1;
      row.push(cell); cell = '';
      if (row.some((c) => c !== '')) rows.push(row);
      row = [];
    } else cell += ch;
  }
  if (cell !== '' || row.length) { row.push(cell); if (row.some((c) => c !== '')) rows.push(row); }
  return rows;
}

/** Đọc CSV thành mảng đối tượng (khoá = tên cột đã trim). */
export function docCsvObject(text) {
  const rows = docCsv(text);
  const head = (rows.shift() || []).map((h) => h.trim());
  return rows.map((r) => Object.fromEntries(head.map((h, j) => [h, (r[j] ?? '').trim()])));
}

// ---------------------------------------------------------------- số hiệu

/** Bỏ dấu tiếng Việt → ascii thường (dùng cho slug). */
export function boDau(s) {
  return String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

/**
 * Tách số hiệu TB thành phần số + năm.
 *   "503/TB-TCHQ/2018" → { so_hieu, so_base: "503", num: 503, nam: 2018 }
 *   "503/TB-TCHQ"      → { so_hieu, so_base: "503", num: 503, nam: null }
 *   "503-508/TB-TCHQ"  → { ..., nums: [503..508], num: 503, nam: null }
 * Số hiệu trong master CSV KHÔNG có năm ("1005/TB-TCHQ"); số hiệu trong danh sách
 * tracuuhs CÓ năm ("503/TB-TCHQ/2018"). Khớp phải theo CẢ SỐ LẪN NĂM — số TB-TCHQ
 * đánh số lại theo từng năm nên khớp số mà lệch năm là văn bản KHÁC.
 */
export function tachSoHieu(soHieu) {
  const goc = String(soHieu ?? '').trim();
  const clean = goc.replace(/\s+/g, ' ').replace(/\s*\/\s*/g, '/').replace(/\s*-\s*/g, '-');
  const nam = (clean.match(/\/(19|20)\d{2}\s*$/)?.[0] || '').replace(/\D/g, '') || null;
  const thanh = clean.replace(/\/(19|20)\d{2}\s*$/, '');
  const phan = thanh.split('/')[0] || '';
  const nums = [...phan.matchAll(/\d+/g)].map((m) => Number(m[0]));
  // "503-508" là dải số: mở rộng thành từng số (một dòng CSV có thể gộp nhiều TB)
  const dai = (nums.length === 2 && nums[1] > nums[0] && nums[1] - nums[0] <= 300)
    ? Array.from({ length: nums[1] - nums[0] + 1 }, (_, i) => nums[0] + i)
    : nums;
  return {
    so_hieu: goc,
    so_base: thanh,
    num: nums.length ? nums[0] : null,
    nums,
    dai,
    nam: nam ? Number(nam) : null,
  };
}

/** Slug tệp cho 1 TB: "503/TB-TCHQ/2018" → "503-tb-tchq-2018". */
export function slugTB(soHieu) {
  const { so_base: sb, nam } = tachSoHieu(soHieu);
  const s = boDau(sb).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return nam ? `${s}-${nam}` : s;
}

// ---------------------------------------------------------------- URL

/**
 * Chuẩn hoá URL PDF trong master CSV.
 * Lỗi thật gặp trong dữ liệu: tiền tố lặp ("https://files.customs.gov.vnhttps://files.customs.gov.vn/…"),
 * "//" thừa trong đường dẫn, khoảng trắng trong tên tệp. Không chuẩn hoá thì ~1/3 link chết
 * dù file có thật trên server.
 */
export function chuanHoaURL(raw) {
  let u = String(raw ?? '').trim();
  if (!u) return null;
  let truoc = '';
  do { truoc = u; u = u.replace(/^(https?:\/\/[^/]+?)(?=https?:\/\/)/i, ''); } while (u !== truoc);
  const pm = u.match(/^(https?:\/\/[^/]+)(\/.*)?$/i);
  if (!pm) return null;
  const duong = (pm[2] || '/').replace(/\/\/+/g, '/');
  try {
    const x = new URL(pm[1] + duong);
    x.hash = '';
    return x.toString();
  } catch { return null; }
}

// ---------------------------------------------------------------- chỉ mục PDF

/**
 * Dựng chỉ mục PDF từ master CSV.
 *   theoKhoa: Map("503@2018" → ô) — khớp đúng số + năm
 *   theoNum : Map(503 → [ô…]) — cùng số, mọi năm (dự phòng; KHÔNG tự tin)
 * Một dòng CSV có thể gộp nhiều TB ("503-508/TB-TCHQ") → mở rộng thành từng số.
 */
export function docChiMucPDF(rows) {
  const theoKhoa = new Map();
  const theoNum = new Map();
  for (const r of rows) {
    const sh = String(r.so_hieu || '');
    if (!/TB[-–]?TCHQ|TB[-–]?CHQ/i.test(sh)) continue;
    const nam = Number(r.nam) || null;
    const url = chuanHoaURL(r.pdf_url_primary);
    const { dai } = tachSoHieu(sh);
    if (!dai.length) continue;
    const ds = dai;
    for (const n of ds) {
      const o = { num: n, nam, so_hieu_csv: sh, url, ngay: r.ngay_ban_hanh || null, ten: r.noi_dung_tom_tat || null };
      if (nam && url) {
        const k = `${n}@${nam}`;
        if (!theoKhoa.has(k)) theoKhoa.set(k, o);
      }
      if (url) {
        if (!theoNum.has(n)) theoNum.set(n, []);
        const list = theoNum.get(n);
        if (!list.some((x) => x.url === o.url && x.nam === o.nam)) list.push(o);
      }
    }
  }
  return { theoKhoa, theoNum };
}

/**
 * Tìm ứng viên URL PDF cho 1 số hiệu TB.
 * Ưu tiên khớp đúng số + năm; nếu không có thì mới thử cùng số ở năm khác (đánh dấu
 * khop_nam_khac để người đọc biết độ tin cậy thấp hơn).
 */
export function timUNGPDF(chiMuc, soHieu) {
  const { num, nam } = tachSoHieu(soHieu);
  if (!num) return [];
  const ra = [];
  const thay = (o, doTinCay) => {
    if (!o || !o.url) return;
    if (ra.some((x) => x.url === o.url)) return;
    ra.push({ ...o, do_tin_cay: doTinCay });
  };
  if (nam) thay(chiMuc.theoKhoa.get(`${num}@${nam}`), 'khop_so_va_nam');
  for (const o of chiMuc.theoNum.get(num) || []) thay(o, o.nam === nam ? 'khop_so_va_nam' : 'khop_so_khac_nam');
  return ra;
}

// ---------------------------------------------------------------- đọc văn bản trong PDF

/**
 * Chuẩn hoá "Số: 1005 /TB-TCHQ" hoặc "Số: 503-508/TB-TCHQ" → danh sách số.
 * Dùng để đối chiếu xem PDF tải về có đúng là TB cần tìm không (OCR hay làm nhoè số).
 */
export function giaiMaSoHieuTrongVanBan(text) {
  const t = String(text ?? '');
  const out = new Set();
  for (const m of t.matchAll(/Số\s*:?\s*([0-9][0-9\s.,\-/]{0,40}?)\s*\/?\s*TB[-–]?(TCHQ|CHQ)\b/gi)) {
    const p = m[1];
    const nums = [...p.matchAll(/\d+/g)].map((x) => Number(x[0]));
    if (nums.length === 2 && nums[1] > nums[0] && nums[1] - nums[0] <= 300) {
      for (let n = nums[0]; n <= nums[1]; n += 1) out.add(n);
    } else for (const n of nums) out.add(n);
  }
  return [...out];
}

/** Số hiệu TB đọc được trong PDF (dùng để đối chiếu). */
export function docSoHieuTrongPDF(text) {
  const nums = giaiMaSoHieuTrongVanBan(text);
  return nums.length ? nums.map((n) => `${n}/TB-TCHQ`).join(', ') : null;
}

// ---------------------------------------------------------------- trích trường

/** Gộp khoảng trắng (PDF/OCR xuống dòng vụng) thành một dòng, giữ nguyên chữ. */
export function gonChu(s) {
  return String(s ?? '').replace(/[ \t ]+/g, ' ').replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

/**
 * Nhãn trong TB-TCHQ (dùng để biết đoạn lấy dừng ở đâu). Viết đúng chữ như trong văn bản gốc.
 */
const NHAN = [
  'Tên hàng theo khai báo', 'Tên thương mại', 'Tên gọi theo cấu tạo, công dụng', 'Tên gọi theo cấu tạo',
  'Ký, mã hiệu, chủng loại', 'Nhà sản xuất', 'Thành phần, cấu tạo, công thức hóa học', 'Thành phần, cấu tạo',
  'Công dụng theo thiết kế', 'Thông số kỹ thuật', 'Cơ chế hoạt động, cách thức sử dụng', 'Cơ chế hoạt động',
  'Quy trình sản xuất', 'Tóm tắt mô tả và đặc tính hàng hóa',
  'Tóm tắt mô tả hàng hóa được xác định trước mã số',
  'Đơn vị nhập khẩu', 'Đơn vị xuất khẩu', 'Đơn vị xuất khẩu/nhập khẩu', 'Số, ngày tờ khai',
  'Kết quả phân loại', 'Kết quả xác định trước mã số', 'Nơi nhận', 'Ghi chú', 'Thông tin khác',
  'thuộc nhóm', 'mã số', 'đề nghị của',
];

/**
 * Bỏ dấu + hạ chữ nhưng GIỮ NGUYÊN ĐỘ DÀI (mỗi ký tự → 1 ký tự).
 * Nhờ vậy vị trí tìm được trong chuỗi đã fold vẫn trỏ đúng vị trí trong chuỗi gốc,
 * và nhãn khớp được cả khi OCR đọc sai dấu hay dính liền chữ ("Tóm tắt" → "Tómtắt").
 */
export function fold1(s) {
  return [...String(s ?? '')].map((c) => {
    if (/\s/.test(c)) return ' ';
    const b = boDau(c).toLowerCase();
    return b.length ? b[0] : c.toLowerCase();
  }).join('');
}

const escapeRe = (c) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Regex tìm nhãn: đã bỏ dấu, cho phép thiếu/thừa khoảng trắng giữa các chữ
 * (PDF xuống dòng và OCR hay dính liền chữ). KHÔNG cho qua dòng mới — tránh khớp nhầm.
 */
export function reNhanCham(nhan) {
  const f = fold1(nhan).replace(/\s+/g, '');
  return new RegExp([...f].map((c) => `${escapeRe(c)}[ \\t]*`).join(''), 'i');
}

const RE_NHAN = new Map(NHAN.map((n) => [n, reNhanCham(n)]));

/** Vị trí các nhãn trong văn bản (dùng để biết đoạn lấy dừng ở đâu). */
export function timNhan(text) {
  const f = fold1(text);
  const ra = [];
  for (const [nhan, re] of RE_NHAN) {
    const reG = new RegExp(re.source, 'gi');
    let m;
    while ((m = reG.exec(f)) !== null) {
      ra.push({ nhan, index: m.index, len: m[0].length });
      if (m[0].length === 0) reG.lastIndex += 1;
    }
  }
  ra.sort((a, b) => a.index - b.index);
  return ra;
}

/**
 * Lấy giá trị sau một nhãn: từ sau nhãn (bỏ dấu ":") đến nhãn kế tiếp (hoặc hết bài).
 * `maxLen` chặn đoạn quá dài (bản ghi phải gọn).
 */
export function layGiaTriSauNhan(text, nhan, { maxLen = 1200, stopRe = null, minLen = 1 } = {}) {
  const t = String(text ?? '');
  const re = RE_NHAN.get(nhan) || reNhanCham(nhan);
  const f = fold1(t);
  const m = re.exec(f);
  if (!m) return null;
  const batDau = m.index + m[0].length;
  let ket = t.slice(batDau, batDau + maxLen);
  // cắt tại nhãn kế tiếp
  const nhanSau = timNhan(t.slice(batDau, batDau + maxLen)).filter((n) => n.index > 0);
  if (nhanSau.length) ket = t.slice(batDau, batDau + nhanSau[0].index);
  if (stopRe) {
    const sm = ket.match(stopRe);
    if (sm && sm.index > 0) ket = ket.slice(0, sm.index);
  }
  const val = gonChu(ket).replace(/^[:\s]+/, '').trim();
  return val && val.length >= minLen ? val : null;
}

/** Tên hàng nguyên văn: "Tên hàng theo khai báo" → "Tên thương mại" → "Tên gọi theo cấu tạo, công dụng". */
export function trichTenHang(text) {
  const x = layGiaTriSauNhan(text, 'Tên hàng theo khai báo', { maxLen: 900, minLen: 3 })
    || layGiaTriSauNhan(text, 'Tên thương mại', { maxLen: 900, minLen: 3 })
    || layGiaTriSauNhan(text, 'Tên gọi theo cấu tạo, công dụng', { maxLen: 900, minLen: 3 });
  return x ? lamSachQuyenRiengTu(x) : null;
}

/**
 * Đặc tính hàng: "Tóm tắt mô tả và đặc tính hàng hóa" → "Tóm tắt mô tả hàng hóa được xác
 * định trước mã số" → ghép "Thành phần, cấu tạo, công thức hóa học" + "Công dụng theo thiết kế".
 */
export function trichDacTinh(text) {
  const x = layGiaTriSauNhan(text, 'Tóm tắt mô tả và đặc tính hàng hóa', { maxLen: 1400, minLen: 20 })
    || layGiaTriSauNhan(text, 'Tóm tắt mô tả hàng hóa được xác định trước mã số', { maxLen: 1400, minLen: 20 });
  if (x) return lamSachQuyenRiengTu(x);
  const tp = layGiaTriSauNhan(text, 'Thành phần, cấu tạo, công thức hóa học', { maxLen: 900, minLen: 20 })
    || layGiaTriSauNhan(text, 'Thành phần, cấu tạo', { maxLen: 900, minLen: 20 });
  const cd = layGiaTriSauNhan(text, 'Công dụng theo thiết kế', { maxLen: 700, minLen: 10 });
  if (tp && cd) return lamSachQuyenRiengTu(`${tp} ${cd}`);
  if (tp) return lamSachQuyenRiengTu(tp);
  if (cd) return lamSachQuyenRiengTu(cd);
  return null;
}

/**
 * Mã kết luận 8 số: "mã số 0206.49.00" (chấp nhận cả "mã số 02064900").
 * Lấy MÃ CUỐI CÙNG trong văn bản — mã trong phần kết luận nằm sau các mã nhắc ở căn cứ.
 */
export function trichMaKetLuan8So(text) {
  // KHỚP TRÊN CHUỖI ĐÃ FOLD (bỏ dấu) — regex dựng từ nhãn cũng đã fold nên khớp được
  // cả khi OCR đọc sai dấu. fold giữ nguyên độ dài nên chỉ số vẫn đúng.
  const f = fold1(text);
  const re = new RegExp(`${reNhanCham('mã số').source}[.:]?[ \\t]*(\\d{4})[.\\s]*(\\d{2})[.\\s]*(\\d{2})`, 'gi');
  const ds = [...f.matchAll(re)];
  if (!ds.length) return null;
  const m = ds[ds.length - 1];
  return `${m[1]}${m[2]}${m[3]}`;
}

/**
 * Chuỗi lý do (nhóm → phân nhóm → mã): lấy nguyên văn từ "thuộc nhóm" tới "… Việt Nam".
 * Trả về cả mã 8 số đã bóc (tiện cho phần kiểm).
 */
export function trichLyDo(text) {
  const t = String(text ?? '');
  const re = new RegExp(`${reNhanCham('thuộc nhóm').source}[ \\t]*(\\d{2})[.\\s]*(\\d{2})`, 'gi');
  const ds = [...fold1(t).matchAll(re)];
  if (!ds.length) return null;
  const moc = ds[ds.length - 1];
  const sau = t.slice(moc.index, moc.index + 2000);
  const het = sau.search(/Việt Nam/i);
  let ket = het >= 0 ? sau.slice(0, het + 'Việt Nam'.length) : sau.slice(0, 600);
  const ma = trichMaKetLuan8So(ket);
  if (!ma) return null;
  return { ly_do: gonChu(ket).replace(/[.\s]*$/, ''), ma_ket_luan_8_so: ma };
}

/** Đơn vị đề nghị (cơ quan, không phải doanh nghiệp): "Theo đề nghị của Cục trưởng Cục Thuế XNK". */
export function trichDonViDeNghi(text) {
  const t = String(text ?? '');
  const re = new RegExp(`${reNhanCham('đề nghị của').source}[ \\t]*`, 'gi');
  const ds = [...fold1(t).matchAll(re)];
  if (!ds.length) return null;
  const m = ds[ds.length - 1];
  const phan = t.slice(m.index + m[0].length, m.index + m[0].length + 120);
  const dung = gonChu(phan).split(/[,;.]/)[0].trim();
  if (!dung || dung.length < 4) return null;
  return dung;
}

// ---------------------------------------------------------------- quyền riêng tư

/** Dấu hiệu còn sót tên doanh nghiệp / MST / số tờ khai trong chuỗi định ghi. */
export function coDauHieuCaNhan(text) {
  const t = String(text ?? '');
  if (/\bMST\b\s*[:.]?\s*\d{6,13}/i.test(t)) return 'mst';
  if (/mã\s*s\s*ố\s*th\s*u\s*ế\s*[:.]?\s*\d{6,13}/i.test(t)) return 'mst';
  if (/\b\d{10}\s*\/\s*[A-Z]\d{2}\b/.test(t)) return 'so_to_khai';
  if (/\b(?:Công\s*ty|Cty|TNHH|Doanh\s*nghiệp|Hợp\s*doanh|Liên\s*doanh)\b/i.test(t)) return 'ten_dn';
  if (/\b(?:Co\.,?\s*Ltd|Inc|GmbH|S\.?A\.?|B\.?V\.?|Corp(?:oration)?|Limited|Pte\s+Ltd)\b/i.test(t)) return 'ten_dn';
  return null;
}

/**
 * Bỏ dấu vết cá nhân khỏi chuỗi định ghi — theo luật riêng tư của kho công khai
 * (không tên doanh nghiệp, MST, số tờ khai, địa chỉ). Chỉ thay bằng khoảng trắng
 * (không bịa thêm nội dung).
 */
export function lamSachQuyenRiengTu(text) {
  let s = String(text ?? '');
  // MST / mã số thuế
  s = s.replace(/\b(MST)\s*[:.]?\s*\d{6,13}/gi, '$1: ##MST##');
  s = s.replace(/m\s*ã\s*s\s*ố\s*th\s*u\s*ế\s*[:.]?\s*\d{6,13}/gi, 'mã số thuế: ##MST##');
  // số, ngày tờ khai hải quan
  s = s.replace(/\b\d{9,13}\s*\/\s*[A-Z]\d{2}\b/g, '##TOKHAI##');
  // "Đơn vị nhập khẩu: …" / "Đơn vị xuất khẩu: …" — cả câu
  s = s.replace(/Đ\s*ơ\s*n\s*v\s*i\s*[^:]{0,20}?:[^;.\n]{0,400}/gi, ' ');
  // "Nơi nhận: …" tới hết — danh sách người nhận chứa DN/địa chỉ
  s = s.replace(/N\s*ơ\s*i\s*nh\s*ậ\s*n\s*:[\s\S]{0,900}/gi, ' ');
  // địa chỉ trong ngoặc sau tên DN: "(Đ/c: …)"
  s = s.replace(/\(\s*Đ\s*\/\s*c\s*:\s*[^)]*\)/gi, ' ');
  // tên doanh nghiệp Việt + Anh
  s = s.replace(/\b(?:Công\s*ty|Cty|TNHH|Doanh\s*nghiệp|Hợp\s*doanh|Liên\s*doanh|Công\s*ty\s*TNHH\s*\S+|Công\s*ty\s*Cổ\s*phần\s*[^,;.\n]{0,60})[^,;.\n]{0,80}/gi, '##DN##');
  s = s.replace(/\b(?:Co\.,?\s*Ltd|Inc|GmbH|S\.?A\.?|B\.?V\.?|Corp(?:oration)?|Limited|Pte\s+Ltd)\b\.?/gi, '##DN##');
  // số điện thoại / email / mã số thuế còn sót
  s = s.replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '##EMAIL##');
  s = s.replace(/(?:Điện\s*thoại|ĐT|Email|Fax)\s*[:.]?\s*[^\s,;]{4,}/gi, '$1: ##DT##');
  s = s.replace(/\s{2,}/g, ' ').trim();
  return s;
}

// ---------------------------------------------------------------- tiện ích

/** Ghi 1 dòng JSONL (tạo thư mục nếu chưa có). */
export function ghiJsonl(file, obj) {
  mkdirSync(dirname(file), { recursive: true });
  appendFileSync(file, `${JSON.stringify(obj)}\n`);
}

/** Đọc 1 tệp JSON, trả null nếu hỏng/không có. */
export function docJson(file) {
  try { return JSON.parse(readFileSync(file, 'utf8')); } catch { return null; }
}

/** Ngủ (ms) — dùng để giới hạn tần suất gọi server. */
export function nghe(ms) {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}

/**
 * Đọc tham số dòng lệnh: `--ten giá trị` | `--ten=giá trị` | `--cờ` (cờ → true).
 * Trả { gia, duong } — duong là các đối số không theo tuỳ chọn.
 */
export function docArg(argv) {
  const gia = {};
  const duong = [];
  const a = Array.isArray(argv) ? argv : [];
  for (let i = 0; i < a.length; i += 1) {
    const x = a[i];
    if (typeof x === 'string' && x.startsWith('--')) {
      const eq = x.indexOf('=');
      if (eq >= 0) gia[x.slice(2, eq)] = x.slice(eq + 1);
      else if (i + 1 < a.length && !String(a[i + 1]).startsWith('--')) { gia[x.slice(2)] = a[i + 1]; i += 1; }
      else gia[x.slice(2)] = true;
    } else duong.push(x);
  }
  return { gia, duong };
}

/** Chuỗi so khớp số hiệu bỏ ký tự thừa: "503 /TB-TCHQ" → "503/TB-TCHQ". */
export function khoaSoHieu(soHieu) {
  return String(soHieu ?? '').normalize('NFC').toUpperCase().replace(/Đ/g, 'D').replace(/\s+/g, '');
}
