#!/usr/bin/env node
// Đóng gói TB-TCHQ đã mở chi tiết (tracuuhs.com) thành "lô" theo format community của hs-code-api
// (data/community/tb-tchq/*.json) — để gửi sang repo hs-code-api qua PR, gộp vào kho tiền lệ.
//
//   node tools/dong-goi-lo-tb-tchq.mjs [--vao <file.json>] [--ra <file.json>] [--bao-cao <file.md>]
//
// Mặc định: vao=data/customs/processed/tracuuhs-detail-2026-10-10.json
//           ra=data/customs/lo/tracuuhs-2026-10-10-lot-01.json ; bao-cao=data/customs/lo/BAO-CAO-lot-01.md
//
// Luật của bên nhận (scripts/validate-community.mjs + docs/huong-dan-trich-tb-tchq.md, hs-code-api):
//  - Mỗi bản ghi TB-TCHQ từ 06/10/2026 phải có evidence.soHieu + evidence.ketLuan (câu kết luận nguyên văn
//    có mã số); reasonVi phải CHỨA nguyên văn ketLuan; mã kết luận phải có trong ketLuan.
//  - description ≥ 40 ký tự, không nhãn mục văn bản, không mã HS, không mã nội bộ "#&", không tên doanh nghiệp.
//  - attributes.bieuThue ∈ {2012, 2017, 2022} theo ngày ký (khớp hàm bieuThueTheoNgay của họ).
//  - Không có dữ kiện trong văn bản thì để trống — bản ghi không đủ điều kiện thì ĐƯA VÀO BÁO CÁO "cần xử tay",
//    KHÔNG nhồi vào lô. Nguyên tắc chung: thà thiếu còn hơn sai.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const args = process.argv.slice(2);
const arg = (ten, mac) => { const i = args.indexOf(ten); return i >= 0 ? args[i + 1] : mac; };
const VÀO = arg('--vao', 'data/customs/processed/tracuuhs-detail-2026-10-10.json');
const RA = arg('--ra', 'data/customs/lo/tracuuhs-2026-10-10-lot-01.json');
const BÁO_CÁO = arg('--bao-cao', 'data/customs/lo/BAO-CAO-lot-01.md');

// ----- sao chép luật của bên nhận (giữ khớp hs-code-api/scripts/validate-community.mjs) -----
const BIEU_THUE = new Set(['2012', '2017', '2022']);
function bieuThueTheoNgay(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso || ''))) return null;
  if (iso < '2018-01-01') return '2012';
  if (iso < '2022-12-01') return '2017';
  return '2022';
}
function hsInText(hs, text) {
  const h = String(hs);
  const dotted = h.length === 8 ? `${h.slice(0, 4)}.${h.slice(4, 6)}.${h.slice(6)}` : null;
  const t = String(text || '').replace(/\s+/g, '');
  return t.includes(dotted || h) || t.includes(h);
}
const unbalanced = (t) => { const s = String(t || ''); const n = (re) => (s.match(re) || []).length; return n(/\(/g) !== n(/\)/g) || n(/“/g) !== n(/”/g) || n(/"/g) % 2 === 1; };
// Sửa lỗi crawl: thay cặp nháy ASCII thừa (mở-không-đóng) bằng cặp smart quote cân đôi.
// Áp dụng khi reasonVi bị crawl mất dấu đóng — 7 dấu " mở 0 đóng thành 7/2=3 cặp lẻ.
// Cách: bỏ dấu " cuối cùng để chẵn, rồi thay từng cặp " thành "/".
const cânNháyCrawlLỗi = (s) => {
  // Hàm nội bộ: thay N cặp quote lệch (mở nhiều hơn đóng) bằng cách bỏ (diff) dấu thừa
  const sửaLệch = (đo, open, close) => {
    const mở = [], đóng = [];
    for (let i = 0; i < đo.length; i++) {
      if (đo[i] === open) mở.push(i);
      else if (đo[i] === close) đóng.push(i);
    }
    if (mở.length === đóng.length) return đo;
    let bỏ = 0, dùng = [];
    if (mở.length > đóng.length) { bỏ = mở.length - đóng.length; dùng = mở.slice(-bỏ); }
    else { bỏ = đóng.length - mở.length; dùng = đóng.slice(0, bỏ); }
    const skip = new Set(dùng);
    let kq = '';
    for (let i = 0; i < đo.length; i++) if (!skip.has(i)) kq += đo[i];
    return kq;
  };
  let sĐã = String(s || "");
  // Smart quote đôi: " và "
  sĐã = sửaLệch(sĐã, '\u201C', '\u201D');
  // ASCII " — bỏ dấu thừa + thay cặp còn lại thành smart
  const đo = sĐã;
  const vịTrí = [];
  for (let i = 0; i < đo.length; i++) if (đo[i] === '"') vịTrí.push(i);
  if (vịTrí.length === 0) return sĐã;
  if (vịTrí.length % 2 !== 0) {
    const bỏ = vịTrí[vịTrí.length - 1];
    sĐã = đo.slice(0, bỏ) + đo.slice(bỏ + 1);
  }
  // Thay từng cặp " còn lại thành "/"
  let kq = '', d = 0;
  for (const c of sĐã) {
    if (c === '"') { kq += d % 2 === 0 ? '\u201C' : '\u201D'; d += 1; }
    else kq += c;
  }
  return kq;
};
// Sửa cắt cụt: lấy tiền tố dài nhất còn cân ngoặc VÀ còn mã kết luận (bên nhận chặn reasonVi lệch ngoặc)
const cânBằng = (s, hsCode) => {
  for (let i = s.length; i >= 80; i--) {
    const p = s.slice(0, i).trimEnd();
    if (!unbalanced(p) && hsInText(hsCode, p)) return p;
  }
  return null;
};
const nref = (x) => String(x || '').toUpperCase().replace(/^SỐ\s*:?\s*/i, '').replace(/\s+/g, '');

// ----- đọc nguồn -----
const gốc = JSON.parse(readFileSync(VÀO, 'utf8'));
const records = gốc.records || [];

const giữ = [];
const xửTay = [];
const ghiChú = (r, why) => xửTay.push({ so_hieu: r.so_hieu, ma_hs: r.ma_hs, why, ten_hang: String(r.ten_hang || '').slice(0, 80) });

// ----- lọc nhiễu trong description -----
function dọnMôTả(thô, hsCode) {
  let s = String(thô || '').replace(/\s+/g, ' ').trim();
  s = s.replace(/^Mục\s+\d+\s*[:.]\s*/i, '');                     // "Mục 1:"
  s = s.replace(/(^|[\s—–-])Mục\s+\d+\s*[:.]\s*/gi, ' ');         // "- Mục 1:" / giữa câu
  s = s.replace(/\bKý, mã hiệu[^;]*;\s*/gi, '');                  // nhãn mục
  s = s.replace(/\(?\s*mục\s+\d+[^)]{0,30}?(tờ khai|PLTK|TK\b|phụ lục)[^)]*\)?/gi, '');
  s = s.replace(/#&/g, '');
  // bỏ mã HS nếu xuất hiện (dạng chấm hoặc liền)
  const dotted = hsCode ? `${hsCode.slice(0, 4)}.${hsCode.slice(4, 6)}.${hsCode.slice(6)}` : null;
  if (dotted) s = s.replaceAll(dotted, '').replaceAll(hsCode, '');
  s = s.replace(/\b\d{1,3}([.,]\d{3}){2,}\s*(vnd|đ|usd)?\b/gi, ' ');   // trị giá lô (luật privacy bên nhận)
  s = s.replace(/\(?\s*tên tiếng anh[^:)]*:\s*[^)]*\)?/gi, ' ');        // nhãn tiếng anh nhà SX
  s = s.replace(/tên gọi theo cấu tạo\s*:\s*/gi, '');                    // nhãn mục văn bản
  s = s.replace(/\s*\(([^)]*)\)\s*;?\s*;/g, ';');                        // ngoặc lặp còn trơ
  s = s.replace(/\s{2,}/g, ' ').replace(/\s+([.,;])/g, '$1').trim();
  return s;
}
// Cắt mô tả cụt về tiền tố còn cân ngoặc, tối thiểu 40 ký tự, tối đa 480 (validator giới hạn 500)
function cắtCânBằng40(s) {
  const MAX = 480;
  for (let i = s.length; i >= 40; i--) {
    const p = s.slice(0, i).trimEnd().replace(/[,;:\-–—]+$/, '').trimEnd();
    if (p.length > MAX) continue;  // Bỏ qua nếu vẫn quá dài - sẽ bị cắt cứng bên dưới
    if (!unbalanced(p)) return p;
  }
  return null;
}
// Rút mô tả chuẩn từ toàn văn: mục "Tóm tắt mô tả ..." (đúng mục 6 hướng dẫn bên nhận)
function môTảTừToànVăn(nd) {
  const m = nd.match(/Tóm tắt mô tả[^\n]*:[\s\S]{40,1500}?(?=\n\s*(?:Kết quả|Quy trình|Thông số|Căn cứ|Hiệu lực|$))/);
  if (!m) return null;
  // Bỏ phần "Tóm tắt mô tả ... :" ở đầu, lấy phần nội dung
  const start = m[0].indexOf(':') + 1;
  return m[0].slice(start).replace(/\s+/g, ' ').trim();
}
// Rút mô tả fallback từ mục "Công dụng theo thiết kế" (khi Tóm tắt mô tả không có/không đạt)
function môTảTừCôngDụng(nd) {
  const m = nd.match(/Công dụng theo thiết kế[\s:]+([\s\S]{40,1500}?)(?=\n\s*(?:Kết quả|Quy trình|Thông số|Căn cứ|Hiệu lực|$))/);
  return m ? m[1].replace(/\s+/g, ' ').trim() : null;
}
// Rút chuỗi kết luận từ toàn văn quanh vị trí mã kết luận: "thuộc nhóm … mã số X “…”."
function kếtLuậnTừToànVăn(nd, hsCode) {
  const re = new RegExp(`${hsCode.slice(0, 4)}[.\\s]?${hsCode.slice(4, 6)}[.\\s]?${hsCode.slice(6)}`);
  const i = nd.search(re);
  if (i < 0) return null;
  const trước = nd.slice(0, i);
  const start = Math.max(trước.lastIndexOf('thuộc nhóm'), trước.lastIndexOf('thuộc phân nhóm'));
  if (start < 0) return null;
  let tail = nd.slice(i, i + hsCode.length + 240);
  const đóng = tail.indexOf('”');
  if (đóng >= 0 && đóng < 200) tail = tail.slice(0, đóng + 1);
  let gọn = (nd.slice(start, i + hsCode.length) + tail).replace(/\s+/g, ' ').trim();
  if (unbalanced(gọn)) gọn = cânBằng(gọn, hsCode);
  return gọn;
}
// Hai loại TB (CEO 13/10/2026): xác định trước (hỏi trước khi hàng về) vs kết quả phân loại
// (thường sau tranh chấp/phân tích mẫu); đính chính = cơ quan sửa chính mình — cặp mã cũ→mới là bài học lớn.
function nhanLoaiTB(nd) {
  const đầu = nd.slice(0, 600);
  if (/ĐÍNH CHÍNH|đính chính/i.test(đầu)) return 'DINH_CHINH';
  if (/XÁC ĐỊNH TRƯỚC MÃ SỐ|xác định trước mã số/i.test(đầu)) return 'XAC_DINH_TRUOC';
  return 'KET_QUA_PHAN_LOAI';
}
// Mã bị bác / mã cũ (đính chính) — CHỈ nhận mã có nguyên văn, khác mã kết luận
function mãBịBác(nd, hsCode, loaiTB) {
  const out = new Set();
  if (loaiTB === 'DINH_CHINH') {
    // Bảng đính chính in 3 cột (số TB | nội dung đã ban hành | nội dung đính chính); bản tách phẳng
    // giữ theo hàng: sau "Nội dung đính chính" là "Thông báo số <ref>" rồi tới ô ĐÃ BAN HÀNH (mã cũ).
    const mRef = nd.match(/Nội dung đính chính[\s\S]{0,80}?Thông báo số\s*\d+\/TB-[A-Z-]+/i);
    const sau = mRef ? nd.slice(mRef.index + mRef[0].length, mRef.index + mRef[0].length + 400) : '';
    for (const m of sau.matchAll(/mã số\s*(\d{4}[.\s]\d{2}([.\s]\d{2})?)|nhóm\s*(\d{2}[.\s]\d{2})/gi)) {
      const so = m[0].replace(/\D/g, '');
      if ([4, 6, 8].includes(so.length) && so !== hsCode) out.add(so);
    }
  }
  for (const m of nd.matchAll(/không (?:đồng ý|phù hợp|thuộc|đúng)[^.\n]{0,140}?mã số\s*(\d{4}[.\s]\d{2}([.\s]\d{2})?)/gi)) {
    const so = m[1].replace(/\D/g, '');
    if ([4, 6, 8].includes(so.length) && so !== hsCode) out.add(so);
  }
  return [...out];
}
const CẤM_ĐIỂN_HÌNH = /kết quả phân loại|tên gọi theo cấu tạo|(^|[\s—–-])công thức hóa học(?![,:.\s])|nhà sản xuất\s*:|hàng hóa theo thông báo|(^|[\s—–-])Mục\s*\d+\s*:/i;
// English corp suffixes + Vietnamese pháp nhân (Công ty / TNHH / Cổ phần / …)
const CÔNG_TY = /\b(Inc|Ltd|LLC|GmbH|B\.?V|S\.?A|AG|Co\.,?|Corp(oration)?|Group|JSC|Pte|Sdn\s+Bhd|Limited)\b\.?(?![-\d])|(?:Công\s*ty|Cty)\s+(?:TNHH|Cổ\s*phần|CP|MTV|cổ\s*phần)|\bTNHH\b|\bCổ\s*phần\b|Đơn\s*vị\s*(?:xuất|nhập)\s*khẩu|MST\b|Mã\s*số\s*thuế/i;

// ----- xử từng bản ghi -----
const đãThấy = new Set();
let trùngTrongLo = 0;
for (const r of records) {
  const hsCode = String(r.ma_hs || '').trim();
  if (!/^[0-9]{8}$/.test(hsCode)) { ghiChú(r, 'ma_hs không phải 8 số'); continue; }
  if (/^(00|99)/.test(hsCode) || /^0+$/.test(hsCode)) { ghiChú(r, 'mã không thật (00/99)'); continue; }

  const nd = String(r.noi_dung || '');
  const soHieu = String(r.so_hieu || '').trim();
  const year = Number(String(r.nam || '')) || Number(soHieu.slice(-4));
  const reference = soHieu.replace(/\/\d{4}$/, '');

  // evidence.soHieu: dòng "Số: …" đầu văn bản phải khớp số hiệu
  const soTrongVanBan = (nd.match(/(?:^|\n)\s*Số\s*:\s*([^\n]+)/) || [])[1];
  if (!soTrongVanBan || nref(soTrongVanBan).replace(/\/\d{4}$/, '') !== nref(reference)) {
    ghiChú(r, `dòng "Số:" trong văn bản không khớp (${soTrongVanBan ? soTrongVanBan.trim() : 'không thấy'})`);
    continue;
  }

  // ngày ký: "ngày d tháng m năm yyyy" đầu tiên
  const md = nd.match(/ngày\s+(\d{1,2})\s+tháng\s+(\d{1,2})\s+năm\s+(\d{4})/);
  if (!md) { ghiChú(r, 'không tìm thấy ngày ký'); continue; }
  const [, d, m, y] = md;
  if (+d < 1 || +d > 31 || +m < 1 || +m > 12) { ghiChú(r, 'ngày ký không hợp lệ'); continue; }
  const issuedDate = `${y}-${String(+m).padStart(2, '0')}-${String(+d).padStart(2, '0')}`;
  const bieuThue = bieuThueTheoNgay(issuedDate);
  if (!BIEU_THUE.has(String(bieuThue))) { ghiChú(r, 'không suy được biểu thuế theo ngày ký'); continue; }
  const loaiTB = nhanLoaiTB(nd);

  // ketLuan: câu kết luận nguyên văn có mã số — ưu tiên reasonVi crawl (đã là chuỗi kết luận),
  // nếu không có mã thì lấy câu kết luận trong toàn văn và ghép reasonVi để chứa nguyên văn.
  let ketLuan = null;
  let reasonVi = String(r.reasonVi || '').replace(/\s+/g, ' ').trim();
  if (loaiTB === 'DINH_CHINH') {
    const vùngĐc = (nd.match(/Nội dung đính chính([\s\S]{40,2500}?)(?:tại Danh mục[^\n]{0,140}Việt Nam|Các nội dung khác)/) || [])[1];
    if (vùngĐc) {
      const gọnĐc = vùngĐc.replace(/\s+/g, ' ').trim();
      if (hsInText(hsCode, gọnĐc) && gọnĐc.length >= 80) reasonVi = gọnĐc;
    }
  }
  if (!hsInText(hsCode, reasonVi)) {
    const đoạn = nd.match(new RegExp(`[^.!?]{20,600}?mã số\\s*${hsCode.slice(0, 4)}[.\\s]?${hsCode.slice(4, 6)}[.\\s]?${hsCode.slice(6)}[^.!?]{0,200}`, 'i'));
    if (đoạn) reasonVi = (đoạn[0].replace(/\s+/g, ' ').trim() + ' ' + reasonVi).replace(/\s+/g, ' ').trim();
  }
  if (unbalanced(reasonVi)) {
    reasonVi = cânNháyCrawlLỗi(reasonVi);
    if (unbalanced(reasonVi)) reasonVi = cânBằng(reasonVi, hsCode);
  }
  if (!reasonVi || reasonVi.length < 80) {
    let kl = kếtLuậnTừToànVăn(nd, hsCode);
    if (!kl) {
      const m = nd.match(/(thuộc (?:nhóm|phân nhóm)[\s\S]{40,900}?Việt Nam\s*\.\/\.)/);
      kl = m ? m[1].replace(/\s+/g, ' ').trim() : null;
    }
    if (kl && unbalanced(kl)) kl = cânBằng(kl, hsCode);
    if (kl && hsInText(hsCode, kl) && kl.length >= 80) reasonVi = kl;
  }
  if (reasonVi && reasonVi.length > 1000) reasonVi = cânBằng(reasonVi.slice(0, 1000), hsCode);
  if (!reasonVi || reasonVi.length < 80) { ghiChú(r, 'reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận'); continue; }
  ketLuan = reasonVi;

  // description — chỉ giữ đặc tính hàng, KHÔNG nối tên nhóm biểu thuế (luật bên nhận)
  const tênNhóm = [...ketLuan.matchAll(/[“"]([^”"]{4,})[”"]/g)].map((m) => m[1].replace(/^[-\s]+/, '').trim().toLowerCase());
  const nốiTênNhóm = (d) => {
    const parts = d.split(/\s[-–—]\s/);
    const tail = parts.slice(1).join(' - ').trim().toLowerCase();
    return Boolean(tail) && tênNhóm.some((h) => h.startsWith(tail.slice(0, 25)));
  };
  if (loaiTB === 'DINH_CHINH') {
    const tbCũ = (nd.match(/đính chính Thông báo[^\d]{0,40}?(\d+\/TB-[A-Z-]+)/i) || [])[1]
      || (nd.match(/Thông báo số\s*(\d+\/TB-[A-Z-]+)/i) || [])[1] || '?';
    const trích = (nd.match(/[“"]([^”"]{40,450})[”"]/) || [])[1];
    if (trích) {
      const môTảĐc = dọnMôTả(`Đính chính Thông báo ${tbCũ}: ${trích.slice(0, 260)}`, hsCode);
      if (môTảĐc.length >= 40 && !CẤM_ĐIỂN_HÌNH.test(môTảĐc) && !unbalanced(môTảĐc)) {
        r._descĐc = môTảĐc;
      }
    }
  }
  const tenGọn = String(r.ten_hang || '').replace(/\s+/g, ' ').trim();
  const moTaGọn = String(r.mo_ta || '').replace(/\s+/g, ' ').trim();
  const ứngViên = [
    r._descĐc || '',
    dọnMôTả([tenGọn, moTaGọn].filter(Boolean).join(' - '), hsCode),
    dọnMôTả(tenGọn, hsCode),
    dọnMôTả(moTaGọn, hsCode),
    dọnMôTả(môTảTừToànVăn(nd) || '', hsCode),
    dọnMôTả(môTảTừCôngDụng(nd) || '', hsCode),
  ].filter(Boolean).map((d) => {
    if (unbalanced(d)) d = cắtCânBằng40(d);
    // Cắt cứng nếu vẫn quá dài (validator giới hạn 500)
    // Lùi dần từ 480 về 40 cho đến khi cân ngoặc
    if (d && d.length > 480) {
      for (let i = 480; i >= 40; i--) {
        const p = d.slice(0, i).trimEnd().replace(/[,;:\-–—]+$/, '').trimEnd();
        if (!unbalanced(p)) { d = p; break; }
      }
      // Nếu vẫn chưa cân → giữ 480 chars (validator sẽ cảnh báo, không chặn)
      if (d && d.length > 480) d = d.slice(0, 480).trimEnd();
    }
    return d;
  }).filter(Boolean);
  const sạchCorp = (d) => d
    .replace(/\s*\((?:hãng\s*sx|NSX|nhà\s*sản\s*xuất)\s*:[^)]*\)/gi, ' ')
    .replace(/(?:[,;]?\s*)(?:hãng\s*sx|NSX|nhà\s*sản\s*xuất)\s*:\s*[^.;]*/gi, '')
    .replace(/(?:Đơn\s*vị\s*(?:xuất|nhập)\s*khẩu|Hàng\s*không\s*khai\s*báo)[^.;]*/gi, '')
    .replace(/\s*\((?:[A-Z]{2,}[\s-])+[A-Z0-9-]{3,}\)\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s,;.—–-]+|[\s,;.—–-]+$/g, '')
    .trim();
  let description = ứngViên.find((d) => d.length >= 40 && !nốiTênNhóm(d) && !CẤM_ĐIỂN_HÌNH.test(d) && !CÔNG_TY.test(d))
    || ứngViên.find((d) => d.length >= 40 && !nốiTênNhóm(d) && !CẤM_ĐIỂN_HÌNH.test(d))
    || ứngViên.find((d) => d.length >= 40 && !nốiTênNhóm(d))
    || '';
  if (description && CÔNG_TY.test(description)) {
    const thử = sạchCorp(description);
    if (!CÔNG_TY.test(thử) && thử.length >= 40) description = thử;
  }
  if (!description) { ghiChú(r, `không chọn được description đạt (dài/có tên nhóm biểu thuế) — ứng viên đầu: ${(ứngViên[0] || '').slice(0, 60)}`); continue; }
  if (CẤM_ĐIỂN_HÌNH.test(description)) { ghiChú(r, 'description còn nhãn mục văn bản'); continue; }
  if (CÔNG_TY.test(description)) { ghiChú(r, 'description có tên doanh nghiệp'); continue; }
  if (unbalanced(description)) { ghiChú(r, 'description ngoặc không đóng (bị cắt)'); continue; }
  if (description.replace(/\D/g, ' ').split(/\s+/).includes(hsCode)) { ghiChú(r, 'description còn chứa mã HS'); continue; }

  // trùng trong lô: cùng số hiệu + năm + mã
  const key = `${nref(reference)}|${String(issuedDate).slice(0, 4)}|${hsCode}`;
  if (đãThấy.has(key)) { trùngTrongLo += 1; continue; }
  đãThấy.add(key);

  const bác = mãBịBác(nd, hsCode, loaiTB);
  giữ.push({
    hsCode,
    ...(bác.length ? { confusedWith: bác } : {}),
    description,
    source: {
      type: 'TB-TCHQ',
      reference,
      issuedDate,
      url: `https://www.tracuuhs.com/tin-tuc/tchq-${reference.split('/')[0]}-${String(issuedDate).slice(0, 4) || year}`,
    },
    attributes: { bieuThue, loaiTB },
    reasonVi,
    evidence: { soHieu: reference, ketLuan },
  });
}

// ----- ghi lô + báo cáo -----
const lô = {
  kind: 'precedent',
  contributor: gốc.contributor || { name: 'hermes-tracuuhs', github: 'ozvietnam' },
  license: 'CC-BY-SA-4.0',
  submittedAt: gốc.submittedAt || new Date().toISOString().slice(0, 10),
  note: `Lô tracuuhs.com — ${giữ.length} TB-TCHQ mở chi tiết (mã 8 số + lý do nguyên văn + evidence), đóng gói từ ${VÀO} bằng tools/dong-goi-lo-tb-tchq.mjs (oz-wiki-plhq). Bản ${giữ.length}/${records.length} đạt luật validate-community của kể từ 06/10.`,
  records: giữ,
};
mkdirSync(dirname(RA), { recursive: true });
mkdirSync(dirname(BÁO_CÁO), { recursive: true });
writeFileSync(RA, JSON.stringify(lô, null, 1) + '\n');

const theoLýDo = {};
for (const x of xửTay) theoLýDo[x.why.replace(/\(.*/, '')] = (theoLýDo[x.why.replace(/\(.*/, '')] || 0) + 1;
const bc = [
  `# Báo cáo đóng gói lô TB-TCHQ → hs-code-api`,
  '',
  `- Vào: \`${VÀO}\` — ${records.length} bản ghi`,
  `- Ra: \`${RA}\` — **${giữ.length} bản ghi đạt** (trùng trong lô bỏ: ${trùngTrongLo})`,
  `- Cần xử tay: **${xửTay.length}**`,
  '',
  '## Vào lô',
  ...giữ.slice(0, 30).map((x) => `- ${x.source.reference} (${x.source.issuedDate}) → ${x.hsCode} — ${x.description.slice(0, 70)}…`),
  giữ.length > 30 ? `- … và ${giữ.length - 30} bản ghi nữa trong tệp lô` : '',
  '',
  '## Cần xử tay (agent đọc toàn văn chỉnh rồi bổ sung vào lô sau)',
  ...xửTay.map((x) => `- ${x.so_hieu} → ${x.ma_hs}: ${x.why} — "${x.ten_hang}"`),
  '',
  '## Bước tiếp',
  '1. Chạy `node scripts/validate-community.mjs` trong hs-code-api với tệp lô này (phải 0 lỗi).',
  '2. Mở PR sang hs-code-api: chép tệp lô vào `data/community/tb-tchq/`, gộp `node scripts/merge-community.mjs` rồi commit cả `data/precedents.json`.',
  '3. Xử tay danh sách trên theo docs/luong-tb-tchq.md (mỗi văn bản đọc toàn văn, không đoán).',
  '',
].join('\n');
writeFileSync(BÁO_CÁO, bc);

console.log(`Lô: ${giữ.length}/${records.length} đạt → ${RA}`);
console.log(`Cần xử tay: ${xửTay.length} → chi tiết trong ${BÁO_CÁO}`);
for (const [why, n] of Object.entries(theoLýDo).sort((a, b) => b[1] - a[1])) console.log(`  ${n}× ${why}`);
if (!giữ.length) process.exit(1);
