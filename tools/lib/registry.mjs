// Đọc sổ đăng ký văn bản (registry/), chuẩn hoá số hiệu, dựng chỉ mục và cạnh ngược.
// Chỉ lưu cạnh CHIỀU ĐI trong từng văn bản (văn bản mới ghi nó thay/sửa/bãi bỏ văn bản nào);
// cạnh ngược (bị thay bởi, bị sửa bởi...) luôn tính ra ở đây — không ai phải ghi hai nơi.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export const LOAI = ['HIEN_PHAP', 'LUAT', 'NGHI_QUYET', 'PHAP_LENH', 'NGHI_DINH', 'QUYET_DINH', 'THONG_TU',
  'THONG_TU_LIEN_TICH', 'CHI_THI', 'CONG_VAN', 'THONG_BAO', 'VAN_BAN_HOP_NHAT', 'DIEU_UOC', 'TIEU_CHUAN', 'KHAC'];
export const TINH_TRANG = ['CON_HIEU_LUC', 'HET_HIEU_LUC', 'HET_HIEU_LUC_MOT_PHAN', 'TAM_NGUNG_HIEU_LUC',
  'CHUA_CO_HIEU_LUC', 'CHUA_XAC_MINH'];
export const MUC_XAC_MINH = ['NGUON_A', 'NGUON_B', 'NGUON_THU_CAP', 'CHUA_XAC_MINH'];
/** Lý do tạm dừng săn đối chiếu hiệu lực — xem docs/huong-dan-agent.md (HS_API đã cạn nguồn A). */
export const CHAN_HIEU_LUC = [
  'THIEU_PDF_A',           // chưa có toàn văn bậc A của chính văn bản
  'THIEU_DIEU_THI_HANH_A', // đã biết tình trạng hiện tại từ A nhưng thiếu điều khoản thi hành trên A
  'THIEU_BAI_TUONG_MINH',  // có PDF A nhưng không có điều khoản bãi/thay tường minh để chốt còn/hết
  'SO_HIEU_LECH',          // số hiệu biểu thuế dẫn có vẻ sai / không tồn tại trên nguồn A
  'CHO_CONG_BO_A',         // kết quả/văn bản đã biết số hiệu nhưng cổng A chưa đăng PDF
];
// Quan hệ chiều đi → tên chiều ngược (tính tự động).
export const QUAN_HE = {
  thay_the: 'bi_thay_the_boi',
  sua_doi: 'bi_sua_doi_boi',
  bai_bo: 'bi_bai_bo_boi',
  tam_ngung: 'bi_tam_ngung_boi',
  huong_dan: 'duoc_huong_dan_boi',
  hop_nhat: 'duoc_hop_nhat_boi',
};
// Quan hệ làm văn bản đích mất hiệu lực (toàn bộ hoặc một phần).
export const QUAN_HE_LAM_MAT_HIEU_LUC = ['thay_the', 'bai_bo'];

/** Khoá so khớp số hiệu: hoa, Đ→D, bỏ khoảng trắng, "QĐ"→"QD". */
export function khoa(soHieu) {
  return String(soHieu || '')
    .normalize('NFC')
    .toUpperCase()
    .replace(/Đ/g, 'D')
    .replace(/\s+/g, '')
    .replace(/[.,;:]$/, '');
}

/** Bỏ dấu tiếng Việt → ascii thường. */
export function boDau(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

/** Slug tên file từ số hiệu: 08/2015/NĐ-CP → 08-2015-nd-cp. Số hiệu không có năm → thêm năm ban hành. */
export function slugTuSoHieu(soHieu, nam) {
  let s = boDau(soHieu).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!/(^|-)(19|20)\d{2}(-|$)/.test(s) && nam) s = `${s}-${nam}`;
  return s;
}

function docYaml(file) {
  return yaml.load(readFileSync(file, 'utf8'), { schema: yaml.CORE_SCHEMA });
}

function phangCay(nodes, cha = '') {
  const out = [];
  for (const n of nodes || []) {
    const path = cha ? `${cha}/${n.id}` : n.id;
    out.push({ ...n, path, cha: cha || null, con: undefined, soCon: (n.con || []).length });
    out.push(...phangCay(n.con, path));
  }
  return out;
}

/** Cạnh trong quan_he: chuỗi số hiệu hoặc {so_hieu, pham_vi, tu_ngay, can_cu}. */
export function chuanCanh(c) {
  if (typeof c === 'string') return { so_hieu: c };
  if (c && typeof c === 'object' && c.so_hieu) return { ...c, so_hieu: String(c.so_hieu) };
  return null;
}

export function napSo(root = ROOT) {
  const dir = join(root, 'registry', 'van-ban');
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.yaml')).sort() : [];
  const vanBan = [];
  const loiDoc = [];
  for (const f of files) {
    try {
      const d = docYaml(join(dir, f));
      vanBan.push({ ...d, _file: `registry/van-ban/${f}`, _slug: basename(f, '.yaml') });
    } catch (e) {
      loiDoc.push({ file: `registry/van-ban/${f}`, message: e.message.split('\n')[0] });
    }
  }
  const cay = docYaml(join(root, 'registry', 'cay-xnk.yaml')) || [];
  const nutCay = phangCay(cay);
  const coQuan = docYaml(join(root, 'registry', 'co-quan.yaml')) || [];
  const nguon = docYaml(join(root, 'registry', 'nguon-uy-tin.yaml')) || {};

  // Chỉ mục theo số hiệu + số hiệu khác (cách viết sai/biến thể hay gặp, vd lỗi gõ trong biểu thuế).
  const theoKhoa = new Map();
  for (const d of vanBan) {
    for (const s of [d.so_hieu, ...(Array.isArray(d.so_hieu_khac) ? d.so_hieu_khac : [])]) {
      const k = khoa(s);
      if (!theoKhoa.has(k)) theoKhoa.set(k, []);
      if (!theoKhoa.get(k).includes(d)) theoKhoa.get(k).push(d);
    }
  }
  return { vanBan, loiDoc, cay, nutCay, coQuan, nguon, theoKhoa };
}

/** Bậc tin cậy của một URL theo registry/nguon-uy-tin.yaml (A/B/C). */
export function bacNguon(url, nguon) {
  let host = '';
  try { host = new URL(url).hostname.replace(/^www\./, ''); } catch { return 'C'; }
  for (const bac of ['A', 'B']) {
    for (const n of nguon[bac] || []) {
      const m = String(n.ten_mien).replace(/^www\./, '');
      if (host === m || host.endsWith(`.${m}`)) return bac;
    }
  }
  return 'C';
}

/** Cạnh ngược + cạnh trỏ tới số hiệu chưa có trong sổ. */
export function dungDoThi(so) {
  const nguoc = new Map(); // khoa đích → { bi_thay_the_boi: [{tu, ...canh}] }
  const thieu = new Map(); // khoa → { so_hieu, nhacBoi: [] }
  for (const d of so.vanBan) {
    for (const [qh, ten] of Object.entries(QUAN_HE)) {
      for (const raw of d.quan_he?.[qh] || []) {
        const c = chuanCanh(raw);
        if (!c) continue;
        const k = khoa(c.so_hieu);
        if (!nguoc.has(k)) nguoc.set(k, {});
        const bucket = nguoc.get(k);
        (bucket[ten] ||= []).push({ tu: d.so_hieu, quan_he: qh, ...c });
        if (!so.theoKhoa.has(k)) {
          if (!thieu.has(k)) thieu.set(k, { so_hieu: c.so_hieu, nhacBoi: [] });
          thieu.get(k).nhacBoi.push(`${d.so_hieu} (${qh})`);
        }
      }
    }
  }
  return { nguoc, thieu };
}

export function homNay() {
  return new Date().toISOString().slice(0, 10);
}
