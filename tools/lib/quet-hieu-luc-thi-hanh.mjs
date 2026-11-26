// Bộ quét tất định (0% LLM) phát hiện tác động dây chuyền về hiệu lực thi hành,
// thay thế/bãi bỏ văn bản cũ, sửa đổi bổ sung cấp Điều và tín hiệu phụ lục (HS, CAS, FTA)
// ngay sau khi tải toàn văn nguồn bậc A hoặc trích xuất điều khoản đầy đủ.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { boDau, chuanCanh, khoa, napSo, ROOT, slugTuSoHieu } from './registry.mjs';

const RE_NGAY_ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

// Khớp số hiệu VBQPPL Việt Nam (hỗ trợ cả lỗi OCR dính chữ như 1182/QĐBCT, 25/2016/TTBNNPTNT hoặc thừa khoảng trắng 12/2018/TT- BCT).
const RE_SO_HIEU_VB = /\b(\d{1,5}\/(?:(?:19|20)\d{2}\/)?(?:(?:QH|UBTVQH)\d{1,2}|(?:NĐ|ND|TTLT|VBHN|TT|QĐ|QD|NQ|CT|PL|TB)(?:\s*-\s*|(?!\d))(?:TTg|[A-ZĐ]{2,12}\d{0,2})(?:\s*-\s*(?:TTg|[A-ZĐ]{2,12}\d{0,2}))*))\b/g;

const RE_HS_CHAM = /\b\d{4}\.\d{2}(?:\.\d{2})?\b/g;
const RE_CAS_NUMBER = /\b\d{2,7}-\d{2}-\d\b/g;

const MA_FTA_PHO_BIEN = [
  'ATIGA', 'ACFTA', 'AKFTA', 'AJCEP', 'VJEPA', 'AANZFTA', 'AIFTA',
  'VCFTA', 'VKFTA', 'VN-EAEU', 'EAEU', 'CPTPP', 'AHKFTA', 'VN-CUBA',
  'EVFTA', 'UKVFTA', 'RCEP', 'VN-LAO', 'VN-CAMPUCHIA', 'CEPA', 'VIFTA',
];
const RE_MA_FTA = new RegExp(`\\b(${MA_FTA_PHO_BIEN.join('|')})\\b`, 'i');

export function laNgayLichHopLe(nam, thang, ngay) {
  const y = Number(nam);
  const m = Number(thang);
  const d = Number(ngay);
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return null;
  if (y < 1945 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function laNgayIsoHopLe(s) {
  if (typeof s !== 'string') return null;
  const m = s.trim().match(RE_NGAY_ISO);
  if (!m) return null;
  return laNgayLichHopLe(m[1], m[2], m[3]);
}

function chuanAscii(s) {
  return boDau(String(s || '').normalize('NFC'))
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Chuẩn hoá hiển thị số hiệu bắt từ toàn văn (khôi phục dấu gạch nối bị dính OCR, chuẩn NĐ/QĐ/TTg). */
export function chuanHoaSoHieuTrich(raw) {
  let s = String(raw || '').normalize('NFC').replace(/\s+/g, '');
  s = s.replace(/\/(TTLT|VBHN|NĐ|ND|TT|QĐ|QD|NQ|CT|PL|TB)(?=(?:TTg|[A-ZĐ]{2,}\d{0,2})$)/u, '/$1-');
  s = s.replace(/\/ND-/g, '/NĐ-').replace(/\/QD-/g, '/QĐ-').replace(/-TTG\b/gi, '-TTg');
  return s;
}

/** Xếp bậc thẩm quyền văn bản để chặn dương tính giả khi Thông tư/Quyết định viện dẫn Luật/Nghị định cấp trên. */
function capBacPhapLy({ loai = null, so_hieu = null } = {}) {
  const l = String(loai || '').toUpperCase();
  const sh = khoa(so_hieu || '');
  if (l === 'HIEN_PHAP' || l === 'LUAT' || l === 'PHAP_LENH' || /\/(?:QH|UBTVQH)\d+\b|\/PL-/.test(sh)) {
    return 4;
  }
  if (l === 'NGHI_QUYET' && /\/NQ-QH/.test(sh)) return 4;
  if (l === 'NGHI_DINH' || /\/ND-CP\b|\/NQ-CP\b/.test(sh)) return 3;
  if (/\/(?:QD|CT)-TTG\b/.test(sh)) return 2;
  if (
    l === 'THONG_TU'
    || l === 'THONG_TU_LIEN_TICH'
    || l === 'QUYET_DINH'
    || l === 'CHI_THI'
    || l === 'THONG_BAO'
    || l === 'CONG_VAN'
    || l === 'VAN_BAN_HOP_NHAT'
    || /\/(?:TT|TTLT|QD|CT|VBHN|TB)-/.test(sh)
  ) {
    return 1;
  }
  return null;
}

function tapKhoaBanThan(vanBan) {
  const out = new Set();
  const list = [vanBan?.so_hieu, ...(Array.isArray(vanBan?.so_hieu_khac) ? vanBan.so_hieu_khac : [])]
    .filter(Boolean)
    .map((x) => String(x).trim());
  for (const s of list) {
    out.add(khoa(s));
    const boNam = s.replace(/^(\d+\/)\d{4}\//, '$1');
    if (boNam !== s) out.add(khoa(boNam));
  }
  return out;
}

function tapQuanHeDaKhai(vanBan, nhomList) {
  const out = new Set();
  for (const nhom of nhomList) {
    for (const raw of vanBan?.quan_he?.[nhom] || []) {
      const c = chuanCanh(raw);
      if (c?.so_hieu) out.add(khoa(c.so_hieu));
    }
  }
  return out;
}

/** Trích mọi số hiệu VBQPPL trong một đoạn văn bản (loại trừ chính `selfKhoaSet`). */
export function trichSoHieuVbqppl(text, selfKhoaSet = new Set()) {
  const nfc = String(text || '').normalize('NFC').replace(/\u00a0/g, ' ');
  const seen = new Set();
  const out = [];
  for (const m of nfc.matchAll(RE_SO_HIEU_VB)) {
    const sh = chuanHoaSoHieuTrich(m[1]);
    const k = khoa(sh);
    if (!k || selfKhoaSet.has(k) || seen.has(k)) continue;
    seen.add(k);
    out.push({ so_hieu: sh, khoa: k });
  }
  return out;
}

/** Tìm ngày hiệu lực thi hành từ một đoạn chữ đã chuẩn hoá ASCII thường. */
function timNgayHieuLucTrongDoanAscii(ascii, ngayBanHanhIso) {
  // Ưu tiên câu có chủ ngữ "<Loại văn bản> này có hiệu lực..." trước, sau đó mới quét câu chung "có hiệu lực..."
  const patterns = [
    {
      loai: 'dmy_chu',
      re: /\b(?:luat|phap\s+lenh|nghi\s+quyet|nghi\s+dinh|quyet\s+dinh|thong\s+tu(?:\s+lien\s+tich)?|chi\s+thi|van\s+ban)\s+nay\s+co\s+hieu\s+luc(?:\s+thi\s+hanh)?(?:\s+ke)?\s+tu\s+ngay\s+(\d{1,2})\s+thang\s+(\d{1,2})\s+nam\s+((?:19|20)\d{2})\b/,
    },
    {
      loai: 'dmy_so',
      re: /\b(?:luat|phap\s+lenh|nghi\s+quyet|nghi\s+dinh|quyet\s+dinh|thong\s+tu(?:\s+lien\s+tich)?|chi\s+thi|van\s+ban)\s+nay\s+co\s+hieu\s+luc(?:\s+thi\s+hanh)?(?:\s+ke)?\s+tu\s+ngay\s+(\d{1,2})[/-](\d{1,2})[/-]((?:19|20)\d{2})\b/,
    },
    {
      loai: 'ngay_ky',
      re: /\b(?:luat|phap\s+lenh|nghi\s+quyet|nghi\s+dinh|quyet\s+dinh|thong\s+tu(?:\s+lien\s+tich)?|chi\s+thi|van\s+ban)\s+nay\s+co\s+hieu\s+luc(?:\s+thi\s+hanh)?(?:\s+ke)?\s+tu\s+ngay\s+ky(?:\s+ban\s+hanh)?\b/,
    },
    {
      loai: 'dmy_chu',
      re: /(?<!\b(?:khong|chua|het|ngung)\s)\bco\s+hieu\s+luc(?:\s+thi\s+hanh)?(?:\s+ke)?\s+tu\s+ngay\s+(\d{1,2})\s+thang\s+(\d{1,2})\s+nam\s+((?:19|20)\d{2})\b/,
    },
    {
      loai: 'dmy_so',
      re: /(?<!\b(?:khong|chua|het|ngung)\s)\bco\s+hieu\s+luc(?:\s+thi\s+hanh)?(?:\s+ke)?\s+tu\s+ngay\s+(\d{1,2})[/-](\d{1,2})[/-]((?:19|20)\d{2})\b/,
    },
    {
      loai: 'ngay_ky',
      re: /(?<!\b(?:khong|chua|het|ngung)\s)\bco\s+hieu\s+luc(?:\s+thi\s+hanh)?(?:\s+ke)?\s+tu\s+ngay\s+ky(?:\s+ban\s+hanh)?\b/,
    },
  ];

  for (const p of patterns) {
    const m = ascii.match(p.re);
    if (!m) continue;
    if (p.loai === 'ngay_ky') {
      if (ngayBanHanhIso) return ngayBanHanhIso;
      continue;
    }
    const iso = laNgayLichHopLe(m[3], m[2], m[1]);
    if (iso) return iso;
  }
  return null;
}

/**
 * Trích ngày hiệu lực thi hành gợi ý (`YYYY-MM-DD`) từ danh sách điều khoản và/hoặc toàn văn thô.
 */
export function trichNgayHieuLucThiHanh({ vanBan = {}, dieuKhoanList = [], rawText = '' } = {}) {
  const ngayBanHanhIso = laNgayIsoHopLe(vanBan?.ngay_ban_hanh);
  const clauses = Array.isArray(dieuKhoanList) ? dieuKhoanList.filter((c) => c?.noi_dung) : [];

  // 1. Ưu tiên các điều có tiêu đề "Hiệu lực thi hành" / "Điều khoản thi hành"
  const dieuThiHanh = [];
  const dieuCuoi = [];
  const dieuConLai = [];

  clauses.forEach((c, idx) => {
    const head = chuanAscii(String(c.noi_dung || '').slice(0, 140));
    if (/\b(?:hieu\s+luc\s+thi\s+hanh|dieu\s+khoan\s+thi\s+hanh)\b/.test(head)) {
      dieuThiHanh.push(c);
    } else if (idx >= Math.max(0, clauses.length - 3)) {
      dieuCuoi.push(c);
    } else {
      dieuConLai.push(c);
    }
  });

  for (const group of [dieuThiHanh, [...dieuCuoi].reverse(), [...dieuConLai].reverse()]) {
    for (const c of group) {
      const found = timNgayHieuLucTrongDoanAscii(chuanAscii(c.noi_dung), ngayBanHanhIso);
      if (found) return found;
    }
  }

  if (rawText) {
    const rawAscii = chuanAscii(rawText);
    // Ưu tiên phần cuối văn bản (nơi đặt điều khoản thi hành hoặc câu kết Công văn/Quyết định)
    const tailSlice = rawAscii.length > 5000 ? rawAscii.slice(-5000) : rawAscii;
    const fromTail = timNgayHieuLucTrongDoanAscii(tailSlice, ngayBanHanhIso);
    if (fromTail) return fromTail;
    return timNgayHieuLucTrongDoanAscii(rawAscii, ngayBanHanhIso);
  }

  return null;
}

function tachDonViCau(noiDung) {
  const nfc = String(noiDung || '').normalize('NFC').replace(/\u00a0/g, ' ').trim();
  if (!nfc) return [];
  // Tách theo xuống dòng, đầu khoản đánh số `1. `, `2. `, vế `; bãi bỏ/tạm ngưng...`, hoặc dấu chấm kết câu
  const normalized = nfc
    .replace(/\s+(?=\d{1,2}\.\s+[A-ZĐ“"])/g, '\n')
    .replace(/;\s+(?=(?:bãi\s+bỏ|thay\s+thế|tạm\s+ngưng|ngưng\s+hiệu\s+lực)\b)/giu, '\n');
  const lines = normalized.split(/\n+/);
  const units = [];
  for (const line of lines) {
    const parts = line.split(/(?<!\b(?:Điều|Khoản|Mục)\s+\d+[a-z]?)(?<=[.!?])\s+(?=[A-ZĐ0-9“"(])/u);
    for (const p of parts) {
      const trimmed = p.trim();
      if (trimmed) units.push(trimmed);
    }
  }
  return units;
}

function laCauDanChieuChuyenTiepChung(ascii) {
  if (/^\s*(?:dieu\s+\d+[a-z]?\.\s*)?can\s+cu\b/.test(ascii)) return true;
  if (/\btruong\s+hop\s+(?:cac\s+)?van\s+ban[^.;]*?\bduoc\s+(?:sua\s+doi|bo\s+sung|thay\s+the)\b/.test(ascii)) {
    return true;
  }
  return false;
}

function xacDinhLoaiBaiBo(ascii) {
  // Bỏ cụm "thay thế cụm từ / từ" vì đây là sửa đổi câu chữ cấp khoản, không phải thay thế văn bản
  const cleaned = ascii.replace(/\bthay\s+the\s+(?:cac\s+)?(?:cum\s+tu|tu)\b/g, ' ');
  if (/\b(?:tam\s+)?ngung\s+hieu\s+luc\b/.test(cleaned)) return 'ngung_hieu_luc';
  if (/\bbai\s+bo\b/.test(cleaned)) return 'bai_bo';
  if (/\bthay\s+the\b/.test(cleaned)) return 'thay_the';
  if (/\bhet\s+hieu\s+luc\b/.test(cleaned)) return 'het_hieu_luc';
  return null;
}

function xacDinhPhamViBaiBo(ascii) {
  if (
    /\b(?:bai\s+bo|het\s+hieu\s+luc|ngung\s+hieu\s+luc)\s+mot\s+phan\b/.test(ascii)
    || /\b(?:bai\s+bo|thay\s+the)\s+(?:cac\s+)?(?:(?:dieu|khoan)\s+\d+|diem\s+[a-z]\b|phu\s+luc\b)/.test(ascii)
    || /\b(?:(?:dieu|khoan)\s+\d+[a-z]?|phu\s+luc\s+(?:\d+|[ivxlcdm]+)\b)[^.;]*?\bhet\s+hieu\s+luc\b/.test(ascii)
  ) {
    return 'mot_phan';
  }
  return 'toan_bo';
}

/**
 * Loại bỏ đuôi tên trích dẫn của văn bản bị bãi bỏ (vd: "Thông tư A ngày ... của ... sửa đổi, bổ sung một số điều của Thông tư B")
 * để không bắt nhầm văn bản B nằm trong tên gọi của văn bản A.
 */
function catDuoiTenVanBanTrongCauBaiBo(unitNfc) {
  const coLietKeDiem = /[;:]\s*[a-zđ]\)\s+/iu.test(unitNfc);
  if (coLietKeDiem) {
    return unitNfc
      .split(/(?=;\s*[a-zđ]\)\s+)/iu)
      .map((seg) => seg.replace(
        /(\b\d{1,5}\/(?:(?:19|20)\d{2}\/)?[^\s,;.]+\s+ng[àa]y\b[^;.]*?\bc[ủu]a\b[^;.]*?)\b(?:s[ửu]a\s+đ[ổo]i,?\s*b[ổo]\s+sung|h[ưưu][ớơ]ng\s+d[ẫa]n|quy\s+đ[ịi]nh\s+chi\s+ti[ếe]t)\b[^;.]*/giu,
        '$1',
      ))
      .join(' ');
  }
  return unitNfc.replace(
    /(\b\d{1,5}\/(?:(?:19|20)\d{2}\/)?[^\s,;.]+\s+ng[àa]y\b[^;.]*?\bc[ủu]a\b[^;.]*?)\bs[ửu]a\s+đ[ổo]i,?\s*b[ổo]\s+sung(?:\s+m[ộo]t\s+s[ốo]\s+đi[ềe]u)?\s+c[ủu]a\b[^;.]*?(?=\bv[àa]\s+(?:Th[ôo]ng\s+t[ưư]|Ngh[ịi]\s+đ[ịi]nh|Quy[ếe]t\s+đ[ịi]nh|Lu[ậa]t)\s+s[ốo]\b|\bh[ếe]t\s+hi[ệe]u\s+l[ựự]c\b|[.;]|$)/giu,
    '$1 ',
  );
}

/** Loại bỏ mệnh đề phụ bị động ("đã được sửa đổi, bổ sung tại/bởi...") khi quét văn bản đích bị sửa đổi. */
function catMenhDeSuaDoiBiDong(nfc) {
  return nfc.replace(
    /\(?(?:đã\s+)?được\s+sửa\s+đổi,?\s*bổ\s+sung[^.;:)]*?\b(?:tại|bởi|theo)\b[^.;:)]*\)?/giu,
    ' ',
  );
}

function traCuuTrongSo(so, shObj) {
  const ds = so?.theoKhoa?.get(shObj.khoa);
  const hit = Array.isArray(ds) && ds.length > 0 ? ds[0] : null;
  return {
    so_hieu: hit?.so_hieu || shObj.so_hieu,
    khoa: shObj.khoa,
    co_trong_so: Boolean(hit),
    slug_dich: hit?._slug || null,
    tinh_trang_hien_tai: hit?.tinh_trang || null,
    het_hieu_luc_tu_hien_tai: hit?.het_hieu_luc_tu ? String(hit.het_hieu_luc_tu).trim() : null,
    loai_dich: hit?.loai || null,
  };
}

/**
 * Quét tất định tác động dây chuyền của văn bản vừa tải toàn văn / trích điều khoản.
 *
 * @param {object} params
 * @param {object} params.vanBan - Bản ghi sổ của văn bản (`so_hieu`, `slug`/`_slug`, `ten`, `ngay_ban_hanh`, `hieu_luc_tu`, `tinh_trang`, `quan_he`...)
 * @param {Array<object>} [params.dieuKhoanList] - Mảng điều khoản từ `data/dieu-khoan-day-du/<slug>.dieu.jsonl`
 * @param {string} [params.rawText] - Toàn văn thô dự phòng (vd PDF text khi `so_dieu === 0` hoặc tệp `.txt`/`.ocr.txt`)
 * @param {object|null} [params.so] - Sổ đăng ký từ `napSo(root)`
 * @param {string} [params.root] - Thư mục gốc của kho
 */
export function quetHieuLucThiHanh({
  vanBan = {},
  dieuKhoanList = [],
  rawText = '',
  so = null,
  root = ROOT,
} = {}) {
  const registry = so || napSo(root);
  const slug = String(vanBan?.slug || vanBan?._slug || '').trim()
    || (vanBan?.so_hieu ? slugTuSoHieu(vanBan.so_hieu, String(vanBan?.ngay_ban_hanh || '').slice(0, 4)) : '');
  const selfKhoaSet = tapKhoaBanThan(vanBan);
  const rankNguon = capBacPhapLy(vanBan);

  // 1. Gợi ý ngày hiệu lực thi hành (`hieu_luc_tu_goi_y`)
  const hieu_luc_tu_goi_y = trichNgayHieuLucThiHanh({ vanBan, dieuKhoanList, rawText });
  const hieuLucHienTai = vanBan?.hieu_luc_tu ? String(vanBan.hieu_luc_tu).trim() : null;
  const can_cap_nhat_hieu_luc_tu = Boolean(hieu_luc_tu_goi_y && hieuLucHienTai !== hieu_luc_tu_goi_y);

  // Chuẩn bị nguồn câu để quét thay thế/bãi bỏ và sửa đổi/bổ sung
  const clauses = Array.isArray(dieuKhoanList) ? dieuKhoanList.filter((c) => c?.noi_dung) : [];
  const blockList = clauses.length > 0
    ? clauses.map((c) => ({
        can_cu: c.khoan != null ? `Điều ${c.dieu} khoản ${c.khoan}` : `Điều ${c.dieu}`,
        text: String(c.noi_dung || ''),
      }))
    : (rawText ? [{ can_cu: 'toàn văn', text: String(rawText) }] : []);

  // 2. Quét văn bản bị thay thế / bãi bỏ / hết hiệu lực / ngưng hiệu lực
  const daKhaiMatHl = tapQuanHeDaKhai(vanBan, ['thay_the', 'bai_bo', 'tam_ngung']);
  const mapThayTheBaiBo = new Map();

  for (const blk of blockList) {
    for (const unit of tachDonViCau(blk.text)) {
      const ascii = chuanAscii(unit);
      if (laCauDanChieuChuyenTiepChung(ascii)) continue;
      // Tránh bắt câu tường thuật lịch sử "đã bị bãi bỏ bởi..." không phải mệnh lệnh của văn bản hiện tại
      if (/\bda\s+(?:bi\s+)?(?:bai\s+bo|thay\s+the|het\s+hieu\s+luc)\s+(?:tai|boi|theo)\b/.test(ascii)) {
        continue;
      }
      const loaiTacDong = xacDinhLoaiBaiBo(ascii);
      if (!loaiTacDong) continue;

      const phamVi = xacDinhPhamViBaiBo(ascii);
      const cleanedNfc = catDuoiTenVanBanTrongCauBaiBo(unit);
      const dsSoHieu = trichSoHieuVbqppl(cleanedNfc, selfKhoaSet);

      for (const shObj of dsSoHieu) {
        const info = traCuuTrongSo(registry, shObj);
        const rankDich = capBacPhapLy({ loai: info.loai_dich, so_hieu: info.so_hieu });
        if (rankNguon !== null && rankDich !== null && rankDich > rankNguon) {
          continue;
        }
        const existing = mapThayTheBaiBo.get(info.khoa);
        if (existing) {
          if (existing.pham_vi === 'mot_phan' && phamVi === 'toan_bo') {
            existing.pham_vi = 'toan_bo';
            existing.loai_tac_dong = loaiTacDong;
          }
          continue;
        }
        mapThayTheBaiBo.set(info.khoa, {
          so_hieu: info.so_hieu,
          loai_tac_dong: loaiTacDong,
          pham_vi: phamVi,
          co_trong_so: info.co_trong_so,
          slug_dich: info.slug_dich,
          tinh_trang_hien_tai: info.tinh_trang_hien_tai,
          het_hieu_luc_tu_hien_tai: info.het_hieu_luc_tu_hien_tai,
          can_cat_hieu_luc: Boolean(
            info.co_trong_so
            && info.tinh_trang_hien_tai === 'CON_HIEU_LUC'
            && !info.het_hieu_luc_tu_hien_tai,
          ),
          da_khai_quan_he: daKhaiMatHl.has(info.khoa),
          can_cu: blk.can_cu,
        });
      }
    }
  }
  const thay_the_bai_bo = [...mapThayTheBaiBo.values()];

  // 3. Quét văn bản bị sửa đổi, bổ sung cấp Điều (`sua_doi_bo_sung[]`)
  const suaDoiJsonRel = slug ? `data/sua-doi-dieu/${slug}.json` : null;
  const daCoDoThiSuaDoi = Boolean(suaDoiJsonRel && existsSync(join(root, suaDoiJsonRel)));
  const daKhaiSuaDoi = tapQuanHeDaKhai(vanBan, ['sua_doi']);
  const mapSuaDoi = new Map();

  const ghiNhanSuaDoi = (shObj, canCu) => {
    const info = traCuuTrongSo(registry, shObj);
    const rankDich = capBacPhapLy({ loai: info.loai_dich, so_hieu: info.so_hieu });
    if (rankNguon !== null && rankDich !== null && rankDich > rankNguon) return;
    if (mapSuaDoi.has(info.khoa)) return;
    mapSuaDoi.set(info.khoa, {
      so_hieu: info.so_hieu,
      co_trong_so: info.co_trong_so,
      slug_dich: info.slug_dich,
      tinh_trang_hien_tai: info.tinh_trang_hien_tai,
      tep_sua_doi_dieu: suaDoiJsonRel,
      chua_co_do_thi_sua_doi: !daCoDoThiSuaDoi,
      da_khai_quan_he: daKhaiSuaDoi.has(info.khoa),
      can_cu: canCu,
    });
  };

  // 3a. Quét tiêu đề văn bản (`vanBan.ten`) nếu không phải văn bản thuần bãi bỏ
  const tenNfc = String(vanBan?.ten || '').normalize('NFC').trim();
  const tenAscii = chuanAscii(tenNfc);
  if (
    tenAscii
    && !/^bai\s+bo\b/.test(tenAscii)
    && /\b(?:sua\s+doi,?\s*bo\s+sung|(?:sua\s+doi|bo\s+sung)\s+(?:mot\s+so\s+dieu|dieu|khoan|diem|phu\s+luc))\b/.test(tenAscii)
  ) {
    const cleanedTen = catMenhDeSuaDoiBiDong(tenNfc);
    for (const shObj of trichSoHieuVbqppl(cleanedTen, selfKhoaSet)) {
      ghiNhanSuaDoi(shObj, 'tiêu đề');
    }
  }

  // 3b. Quét các điều khoản sửa đổi, bổ sung
  for (const blk of blockList) {
    for (const unit of tachDonViCau(blk.text)) {
      const cleanedNfc = catMenhDeSuaDoiBiDong(unit);
      const ascii = chuanAscii(cleanedNfc);
      if (laCauDanChieuChuyenTiepChung(ascii)) continue;
      // Bỏ câu kết thủ tục "phản ánh về Bộ ... để xem xét, sửa đổi, bổ sung"
      if (/\b(?:phan\s+anh|bao\s+cao|gui\s+y\s+kien)\b[^.;]*?\b(?:xem\s+xet,?\s*)?(?:sua\s+doi|bo\s+sung)\b/.test(ascii)) {
        continue;
      }
      // Bỏ câu bãi bỏ/hết hiệu lực toàn văn có nhắc lại tên thông tư sửa đổi cũ
      if (/\b(?:thay\s+the\s+cac|het\s+hieu\s+luc)\b/.test(ascii) && !/^(?:dieu\s+\d+[a-z]?\.\s*)?(?:\d+\.\s*)?(?:sua\s+doi|bo\s+sung)\b/.test(ascii)) {
        continue;
      }

      const laCauSuaDoi =
        /\bsua\s+doi,?\s*bo\s+sung\s+(?:mot\s+so\s+(?:dieu|quy\s+dinh)|(?:cac\s+)?(?:dieu|khoan|diem|muc|chuong|phu\s+luc))\b/.test(ascii)
        || /\b(?:sua\s+doi|bo\s+sung)\s+(?:mot\s+so\s+dieu|(?:cac\s+)?(?:dieu|khoan|diem)\s+\d+)\b[^.;]*?\bcua\b/.test(ascii)
        || /\bthay\s+the\s+(?:cac\s+)?cum\s+tu\b[^.;]*?\btai\b/.test(ascii);

      if (!laCauSuaDoi) continue;
      for (const shObj of trichSoHieuVbqppl(cleanedNfc, selfKhoaSet)) {
        ghiNhanSuaDoi(shObj, blk.can_cu);
      }
    }
  }
  const sua_doi_bo_sung = [...mapSuaDoi.values()];

  // 4. Tín hiệu phụ lục & trích xuất chuyên ngành (`tin_hieu_phu_luc[]`)
  const fullNfc = [
    vanBan?.ten || '',
    ...clauses.map((c) => c.noi_dung || ''),
    rawText || '',
  ].join('\n').normalize('NFC');
  const fullAscii = chuanAscii(fullNfc);

  const tin_hieu_phu_luc = [];

  // 4a. DANH_MUC_HS: nhắc Phụ lục / Danh mục kèm mã HS / mã số HS / mã số hàng hóa / mã 4-8 số chấm, khi chưa có danh-muc/<slug>.csv
  const hsCsvRel = slug ? `danh-muc/${slug}.csv` : null;
  const daCoHsCsv = Boolean(hsCsvRel && existsSync(join(root, hsCsvRel)));
  if (!daCoHsCsv) {
    const coPhuLucHoacDanhMuc = /\b(?:phu\s+luc|danh\s+muc)\b/.test(fullAscii);
    const coTuKhoaMaHs = /\bma\s+(?:so\s+)?(?:hs|hang\s+hoa)\b/.test(fullAscii);
    const mauMaHs = [...new Set(fullNfc.match(RE_HS_CHAM) || [])];
    if (coPhuLucHoacDanhMuc && (coTuKhoaMaHs || mauMaHs.length > 0)) {
      const bangChung = [];
      if (coTuKhoaMaHs) bangChung.push('mã số HS / mã số hàng hóa');
      if (mauMaHs.length > 0) bangChung.push(`mã HS (${mauMaHs.slice(0, 3).join(', ')})`);
      tin_hieu_phu_luc.push({
        loai: 'DANH_MUC_HS',
        tep_goi_y: hsCsvRel || 'danh-muc/<slug>.csv',
        bang_chung: bangChung,
      });
    }
  }

  // 4b. HOA_CHAT_CAS: nhắc số CAS / mã CAS hoặc khớp số CAS (\b\d{2,7}-\d{2}-\d\b)
  const coTuKhoaCas = /\b(?:so|ma(?:\s+so)?)\s+cas\b/.test(fullAscii);
  const mauSoCas = [...new Set(fullNfc.match(RE_CAS_NUMBER) || [])];
  if (coTuKhoaCas || mauSoCas.length > 0) {
    const bangChung = [];
    if (coTuKhoaCas) bangChung.push('số CAS / mã CAS');
    if (mauSoCas.length > 0) bangChung.push(`CAS (${mauSoCas.slice(0, 3).join(', ')})`);
    tin_hieu_phu_luc.push({
      loai: 'HOA_CHAT_CAS',
      tep_goi_y: slug ? `danh-muc/${slug}-cas.csv` : 'danh-muc/<slug>-cas.csv',
      bang_chung: bangChung,
    });
  }

  // 4c. XUAT_XU_FTA: nhắc quy tắc xuất xứ / C/O Mẫu / chứng nhận xuất xứ + mã/tên FTA
  const coTuKhoaXuatXu = /\b(?:quy\s+tac\s+xuat\s+xu|c\s*\/\s*o\s+mau|(?:giay\s+|tu\s+|chung\s+tu\s+)?chung\s+nhan\s+xuat\s+xu)\b/.test(fullAscii);
  if (coTuKhoaXuatXu) {
    const ftaCodeMatch = fullNfc.match(RE_MA_FTA);
    const coFormMatch = fullAscii.match(/\bc\s*\/\s*o\s+mau\s+(d|e|ak|aj|vj|jv|aanz|ai|vc|vk|kv|eav|cptpp|ahk|eur\.?1|rcep|s|x|uae(?:-vn)?|vn-[a-z]+)\b/);
    const tenHiepDinhMatch = /\bhiep\s+dinh\s+(?:thuong\s+mai\s+(?:tu\s+do|hang\s+hoa)|doi\s+tac\s+(?:kinh\s+te|toan\s+dien))\b/.test(fullAscii);
    if (ftaCodeMatch || coFormMatch || tenHiepDinhMatch) {
      const bangChung = [];
      if (ftaCodeMatch) bangChung.push(ftaCodeMatch[1].toUpperCase());
      if (coFormMatch) bangChung.push(`C/O Mẫu ${coFormMatch[1].toUpperCase()}`);
      if (!ftaCodeMatch && !coFormMatch && tenHiepDinhMatch) bangChung.push('Hiệp định FTA');
      tin_hieu_phu_luc.push({
        loai: 'XUAT_XU_FTA',
        tep_goi_y: 'registry/xuat-xu-fta.yaml',
        bang_chung: bangChung,
      });
    }
  }

  const wikiSourceRel = slug ? `wiki/sources/${slug}.md` : null;
  const chua_co_wiki_source = Boolean(wikiSourceRel && !existsSync(join(root, wikiSourceRel)));

  const co_canh_bao = Boolean(
    can_cap_nhat_hieu_luc_tu
    || thay_the_bai_bo.length > 0
    || sua_doi_bo_sung.some((x) => x.chua_co_do_thi_sua_doi)
    || tin_hieu_phu_luc.length > 0,
  );

  return {
    co_canh_bao,
    hieu_luc_tu_goi_y,
    can_cap_nhat_hieu_luc_tu,
    thay_the_bai_bo,
    sua_doi_bo_sung,
    tin_hieu_phu_luc,
    chua_co_wiki_source,
  };
}
