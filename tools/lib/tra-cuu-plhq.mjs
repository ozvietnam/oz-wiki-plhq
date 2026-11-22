// Thư viện tra cứu Pháp luật Hải quan (PLHQ) thuần Node (0 dependency mới).
// Đọc gói dist/ 1.5.0 (6 tệp JSON) hoặc fallback in-memory từ registry/ + wiki/ + danh-muc/ + data/doc-hieu/.
// Giữ ranh giới 0% trùng lặp với hs-code-api (không áp mã HS từ mô tả, không GIR/WCO, không tính thuế suất, không tiền lệ).
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import yaml from 'js-yaml';
import {
  ROOT,
  LUOC_DO_PHIEN_BAN,
  QUAN_HE,
  napSo,
  khoa,
  boDau,
  chuanCanh,
  bacNguon,
  homNay,
} from './registry.mjs';
import { dungJson } from '../dung.mjs';
import { dungChiMuc, dungChiMucTheoMa, docBieuThue } from './danh-muc.mjs';
import { dungWikiDist, RE_SO_HIEU_WIKI } from './wiki-dist.mjs';
import { dungDieuKhoan, dungCasIndex } from './dieu-khoan-dist.mjs';

export const GHI_NGUON_CC_BY = 'Nguồn: oz-wiki-plhq — https://github.com/ozvietnam/oz-wiki-plhq (CC BY 4.0).';
export const MIEN_TRU_PHAP_LY = 'Tham khảo, không phải tư vấn pháp lý. Xem văn bản gốc nguồn bậc A trước khi áp dụng.';
export const CANH_BAO_TOM_TAT_NHAP = 'Tóm tắt nháp — chưa đối chiếu nguyên văn PDF bậc A';
export const RANH_GIOI_HS_DA_BIET =
  'Chỉ tra cứu văn bản quản lý chuyên ngành/chính sách theo mã HS đã biết; không phân loại HS hay tính thuế suất (thuộc hs-code-api).';

const TEP_DIST_BAT_BUOC = [
  'registry.json',
  'hs-index-theo-ma.json',
  'wiki-index.json',
  'wiki-chunks.json',
  'dieu-khoan.json',
  'cas-index.json',
];

const NGUON_A_MAC_DINH = {
  A: [
    'congbao.chinhphu.vn',
    'vanban.chinhphu.vn',
    'chinhphu.vn',
    'datafiles.chinhphu.vn',
    'vbpl.vn',
    'customs.gov.vn',
    'mof.gov.vn',
    'bocongan.gov.vn',
    'vanban.bocongan.gov.vn',
    'moit.gov.vn',
    'pvtm.gov.vn',
    'trav.gov.vn',
    'moh.gov.vn',
    'mae.gov.vn',
    'most.gov.vn',
    'mst.gov.vn',
    'moc.gov.vn',
    'quochoi.vn',
    'wcoomd.org',
  ].map((ten_mien) => ({ ten_mien })),
  B: [
    { ten_mien: 'thuvienphapluat.vn' },
    { ten_mien: 'luatvietnam.vn' },
    { ten_mien: 'vbpl.ts24.com.vn' },
  ],
};

const STOP_WORDS_ASCII = new Set([
  'la', 'gi', 'nao', 'sao', 'the', 'ra', 'nhu', 'cua', 'cho', 've', 'va', 'voi',
  'co', 'khong', 'duoc', 'bi', 'theo', 'tu', 'den', 'khi', 'trong', 'ngoai',
  'nhung', 'cac', 'mot', 'nay', 'do', 'phai', 'can', 'dang', 'da', 'se', 'thi',
  'ma', 'o', 'tai', 'tren', 'duoi', 'hay', 'hoac', 'neu', 'de', 'doi',
  'van', 'ban', 'quy', 'dinh', 'hien', 'hanh', 'hoi', 'xin', 'biet', 'bao', 'nhieu',
]);

// Từ phổ thông trong gần như mọi văn bản XNK/hải quan — giảm nhiễu khi chấm điểm đoạn dài / NGUYEN_VAN_NGUON_A.
const GENERIC_CUSTOMS_TOKENS = new Set([
  'hang', 'hoa', 'nhap', 'khau', 'xuat', 'hai', 'quan', 'ngay', 'thang', 'nam',
  'dieu', 'khoan', 'diem', 'kiem', 'tra', 'thu', 'tuc', 'truong', 'hop',
  'thuc', 'hien', 'sau', 'moi', 'cap', 'loai',
  'nuoc', 'viet', 'luat', 'nghi', 'thong', 'tu', 'nd', 'tt', 'qd', 'lam', 'viec',
  'muc', 'ap', 'dung', 'lien', 'co', 'the', 'can', 'chu', 'chinh', 'phu',
  'quoc', 'gia', 'bo', 'quan', 'doi', 'tuong', 'pham', 'vi',
  'khac', 'nhau', 'gom', 'cu', 'duoi', 'tren', 'rieng', 'chung',
  'i', 'ii', 'iii', 'iv', 'v', 'vi',
]);

// Từ điển viết tắt và đồng nghĩa nghiệp vụ PLHQ phổ quát dùng để mở rộng truy vấn hỏi đáp (giữ token gốc để ưu tiên khớp chính xác).
export const VIET_TAT_PLHQ = new Map([
  ['c/o', ['chung nhan xuat xu', 'xuat xu']],
  ['form e', ['acfta', 'form-e']],
  ['mau e', ['acfta', 'form-e']],
  ['form d', ['atiga', 'form-d']],
  ['mau d', ['atiga', 'form-d']],
  ['form ak', ['akfta', 'form-ak']],
  ['mau ak', ['akfta', 'form-ak']],
  ['form vk', ['vkfta']],
  ['form vj', ['vjepa']],
  ['eur.1', ['evfta']],
  ['eur 1', ['evfta']],
  ['attp', ['an toan thuc pham']],
  ['ktcn', ['kiem tra chuyen nganh', 'kiem tra chat luong']],
  ['ktcl', ['kiem tra chat luong', 'kiem tra chuyen nganh']],
  ['vphc', ['vi pham hanh chinh', 'xu phat']],
  ['tntx', ['tam nhap tai xuat']],
  ['tam nhap tai xuat', ['tntx']],
  ['gtgt', ['gia tri gia tang', 'vat']],
  ['vat', ['gia tri gia tang', 'gtgt']],
  ['dncx', ['doanh nghiep che xuat']],
  ['doanh nghiep che xuat', ['dncx']],
  ['sxxk', ['san xuat xuat khau', 'san xuat hang hoa xuat khau', 'san xuat hang xuat khau']],
  ['san xuat hang hoa xuat khau', ['sxxk', 'san xuat xuat khau']],
  ['san xuat hang xuat khau', ['sxxk', 'san xuat xuat khau']],
  ['san xuat xuat khau', ['sxxk', 'san xuat hang hoa xuat khau']],
  ['cbpg', ['chong ban pha gia']],
  ['pvtm', ['phong ve thuong mai']],
  ['evfta', ['hiep dinh thuong mai tu do viet nam eu']],
  ['cptpp', ['doi tac toan dien va tien bo xuyen thai binh duong']],
  ['rcep', ['doi tac kinh te toan dien khu vuc']],
  ['ktstq', ['kiem tra sau thong quan']],
  ['kiem tra sau thong quan', ['ktstq']],
  ['shtt', ['so huu tri tue']],
  ['tbyt', ['thiet bi y te', 'trang thiet bi y te']],
  ['kddv', ['kiem dich dong vat']],
  ['kdtv', ['kiem dich thuc vat']],
  ['bvtv', ['bao ve thuc vat', 'thuoc bao ve thuc vat']],
  ['ttdb', ['tieu thu dac biet']],
  ['cites', ['dong vat hoang da', 'thuc vat hoang da']],
  ['qcvn', ['quy chuan ky thuat quoc gia', 'hop quy']],
  ['vnaccs', ['thong quan tu dong', 'hai quan dien tu']],
  ['tscd', ['tai san co dinh']],
  ['gcn', ['giay chung nhan']],
  ['ptpl', ['phan tich phan loai']],
  ['xdt', ['xac dinh truoc']],
  ['xk', ['xuat khau']],
  ['nk', ['nhap khau']],
  ['xnk', ['xuat nhap khau']],
  ['o to', ['xe co gioi', 'phuong tien giao thong']],
  ['cua khau nhap', ['cua khau']],
]);

const RE_SO_HIEU_BO_SUNG =
  /(?<![\p{L}\p{N}/-])\d{1,5}\/(?:\d{4}\/)?(?:TT|NĐ|ND|QĐ|QD|NQ|TTLT|CT|QH\d*|UBTVQH\d*|VBHN|CHQ|TCHQ|BCT|BTC|BYT|BKHCN|BNNMT|BNNPTNT|BXD|BCA|BGTVT|BVHTTDL|BLĐTBXH|NHNN|BTTTT|BNV|VPQH|TT-?[A-Z]+)(?:[/-][\p{L}\p{N}]+)*(?![\p{L}\p{N}/-])/giu;

export const PHAM_VI_DU_LIEU_PLHQ =
  'Dữ liệu PLHQ tổng hợp từ sổ đăng ký oz-wiki-plhq (ưu tiên nguồn bậc A và điều khoản đã đối chiếu SHA-256). Nếu độ tin cậy thấp hoặc chưa có toàn văn, chuyển sang tra trực tiếp nguồn bậc A thay vì suy diễn.';

function chuanHoaVanBan(s) {
  return boDau(String(s || '').normalize('NFC'))
    .toLowerCase()
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const RE_NAM_4_SO = /^(?:19|20)\d{2}$/;

function taoBienTheNgay(dayNum, monthNum, yearNum) {
  if (!Number.isInteger(dayNum) || !Number.isInteger(monthNum) || !Number.isInteger(yearNum)) return null;
  if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900 || yearNum > 2099) return null;
  const d = String(dayNum);
  const dd = d.padStart(2, '0');
  const m = String(monthNum);
  const mm = m.padStart(2, '0');
  const yyyy = String(yearNum);
  const key = `${yyyy}-${mm}-${dd}`;
  const variants = [...new Set([
    `${d}/${m}/${yyyy}`,
    `${dd}/${m}/${yyyy}`,
    `${d}/${mm}/${yyyy}`,
    `${dd}/${mm}/${yyyy}`,
    `${yyyy}-${mm}-${dd}`,
    `${dd}-${mm}-${yyyy}`,
    `${d}-${m}-${yyyy}`,
  ])];
  const regex = new RegExp(`(?<!\\d)(?:${variants.map((v) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?!\\d)`);
  return { key, year: yyyy, variants, regex };
}

function tachNgayChuanHoa(norm) {
  const byKey = new Map();
  let normKhongNgay = norm;
  const reNgay = /\b(\d{1,2})\/(\d{1,2})\/((?:19|20)\d{2})\b|\b((?:19|20)\d{2})-(\d{1,2})-(\d{1,2})\b/g;
  normKhongNgay = norm.replace(reNgay, (full, d1, m1, y1, y2, m2, d2) => {
    const dayNum = Number(d1 ?? d2);
    const monthNum = Number(m1 ?? m2);
    const yearNum = Number(y1 ?? y2);
    const group = taoBienTheNgay(dayNum, monthNum, yearNum);
    if (!group) return full;
    if (!byKey.has(group.key)) byKey.set(group.key, group);
    return ' ';
  });
  return { exactDateGroups: [...byKey.values()], normKhongNgay };
}

function moRongVietTat(normText) {
  const expandedPhrases = [];
  const expandedGroups = [];
  const seenPhrase = new Set();
  const matchedEntries = [];
  for (const [abbr, targets] of VIET_TAT_PLHQ.entries()) {
    const escaped = abbr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`, 'i');
    if (re.test(normText)) {
      const groupPhrases = [];
      const addGroupPhrase = (p) => {
        if (!groupPhrases.includes(p)) groupPhrases.push(p);
        if (!seenPhrase.has(p)) {
          seenPhrase.add(p);
          expandedPhrases.push(p);
        }
      };
      if (abbr === 'c/o') {
        addGroupPhrase('c/o');
      } else if (abbr.includes(' ')) {
        addGroupPhrase(abbr);
      }
      for (const target of targets) {
        addGroupPhrase(target);
      }
      const makePhraseRe = (ph) => {
        const phVariants = ph === 'c/o' ? ['c/o'] : [ph, ph.replace(/\s+/g, '-')];
        return new RegExp(
          phVariants
            .map((v) => `(?<![a-z0-9])${v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-z0-9])`)
            .join('|'),
        );
      };
      const hasSingleLetterWord = abbr.includes(' ') && abbr.split(/\s+/).some((w) => w.length === 1 && !/^\d+$/.test(w));
      matchedEntries.push({ abbr, re, hasSingleLetterWord, groupMatchers: groupPhrases.map(makePhraseRe) });
      expandedGroups.push({
        abbr,
        hasSingleLetterWord,
        matchers: groupPhrases.map(makePhraseRe),
      });
    }
  }
  const expandedPhraseMatchers = expandedPhrases.map((ph) => {
    const phVariants = ph === 'c/o' ? ['c/o'] : [ph, ph.replace(/\s+/g, '-')];
    return new RegExp(
      phVariants
        .map((v) => `(?<![a-z0-9])${v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-z0-9])`)
        .join('|'),
    );
  });
  const expandedTokens = [];
  const seenTok = new Set();
  for (const ph of expandedPhrases) {
    for (const t of ph.split(/[^a-z0-9-]+/).filter((x) => x.length >= 2)) {
      if (!STOP_WORDS_ASCII.has(t) && !GENERIC_CUSTOMS_TOKENS.has(t) && !seenTok.has(t)) {
        seenTok.add(t);
        expandedTokens.push(t);
      }
    }
  }
  return { expandedPhrases, expandedPhraseMatchers, expandedGroups, matchedEntries, expandedTokens };
}

function tachTuKhoa(s) {
  const nfc = String(s || '').normalize('NFC').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  const norm = chuanHoaVanBan(nfc);
  if (!norm) {
    return {
      norm: '',
      nfcLower: '',
      hasDiacritics: false,
      allTokens: [],
      coreTokens: [],
      specificTokens: [],
      accentedCoreTokens: [],
      accentedSpecificTokens: [],
      expandedPhrases: [],
      expandedPhraseMatchers: [],
      expandedGroups: [],
      compoundSpecGroups: [],
      expandedTokens: [],
      exactNumericTags: [],
      exactDateGroups: [],
      standaloneYears: new Set(),
    };
  }
  const nfcLower = nfc.toLowerCase();
  const hasDiacritics = nfcLower !== norm;
  const rawWords = nfcLower.split(/[^\p{L}\p{N}]+/u).filter((t) => t.length >= 2 || /^\d+$/.test(t));
  const allTokens = [...new Set(norm.split(/[^a-z0-9]+/).filter((t) => t.length >= 2 || /^\d+$/.test(t)))];
  const filtered = allTokens.filter((t) => !STOP_WORDS_ASCII.has(t));
  const coreTokens = filtered.length ? filtered : allTokens;
  const { expandedPhrases, expandedPhraseMatchers, expandedGroups, matchedEntries, expandedTokens } = moRongVietTat(norm);
  // Loại năm 4 chữ số thuần túy khỏi specificTokens/accentedSpecificTokens để năm hiện tại (vd 2026) không lấn át chủ đề.
  let specificTokens = coreTokens.filter(
    (t) => !GENERIC_CUSTOMS_TOKENS.has(t) && !/^\d{1,2}$/.test(t) && !RE_NAM_4_SO.test(t),
  );
  // Ngăn token ngắn 2 ký tự vốn chỉ là phần đuôi của cụm chứa từ 1 chữ cái (vd "to" trong "o to") khớp nhầm "tổ chức"/"tô chức",
  // và ghi nhận cụm mở rộng không có token nào trong specificTokens (vd "cua khau nhap") vào compoundSpecGroups.
  const orphanTokensToDrop = new Set();
  const compoundSpecGroups = [];
  for (const entry of matchedEntries) {
    const parts = entry.abbr.split(/\s+/);
    let droppedAny = false;
    if (entry.hasSingleLetterWord) {
      const strippedNorm = norm.replace(new RegExp(entry.re.source, 'gi'), ' ');
      for (const part of parts) {
        if (part.length === 2 && specificTokens.includes(part)) {
          const stillOutside = new RegExp(`(?<![a-z0-9])${part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-z0-9])`, 'i').test(strippedNorm);
          if (!stillOutside) {
            orphanTokensToDrop.add(part);
            droppedAny = true;
          }
        }
      }
    }
    const allFilteredOut = entry.abbr.includes(' ') && parts.every((p) => !specificTokens.includes(p));
    if (droppedAny || allFilteredOut) {
      compoundSpecGroups.push({ abbr: entry.abbr, matchers: entry.groupMatchers });
    }
  }
  if (orphanTokensToDrop.size > 0) {
    specificTokens = specificTokens.filter((t) => !orphanTokensToDrop.has(t));
  }
  const { exactDateGroups, normKhongNgay } = tachNgayChuanHoa(norm);
  const exactNumericTags = [
    ...new Set((normKhongNgay.match(/\b\d+\s*%|\b\d{4}\b/g) || []).map((x) => x.replace(/\s+/g, ''))),
  ];
  const standaloneYears = new Set(norm.match(/(?<![/\d])(?:19|20)\d{2}(?![/\d])/g) || []);
  const coreSet = new Set(coreTokens);
  const specSet = new Set(specificTokens);
  const accentedCoreTokens = [
    ...new Set(rawWords.filter((w) => coreSet.has(chuanHoaVanBan(w)))),
  ];
  const accentedSpecificTokens = [
    ...new Set(rawWords.filter((w) => specSet.has(chuanHoaVanBan(w)))),
  ];
  // Giữ nguyên trình tự chưa bỏ stop-word để tránh ghép nhầm bigram bắc cầu qua stop-word (vd "thuật [sao] hỏa" -> "thuật hỏa").
  const rawSeq = rawWords;
  const normSeq = rawWords.map((w) => chuanHoaVanBan(w));
  return {
    norm,
    nfcLower,
    hasDiacritics,
    allTokens,
    coreTokens,
    specificTokens,
    accentedCoreTokens,
    accentedSpecificTokens,
    rawSeq,
    normSeq,
    expandedPhrases,
    expandedPhraseMatchers,
    expandedGroups,
    compoundSpecGroups,
    expandedTokens,
    exactNumericTags,
    exactDateGroups,
    standaloneYears,
  };
}

function docJsonAnToan(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function kiemMajorLuocDo(tenTep, data) {
  const ver = data?.luoc_do_phien_ban;
  if (!ver) return;
  const expectedMajor = String(LUOC_DO_PHIEN_BAN).split('.')[0];
  const actualMajor = String(ver).split('.')[0];
  if (actualMajor !== expectedMajor) {
    throw new Error(
      `Lệch phiên bản lược đồ (major) ở ${tenTep}: nhận "${ver}", kỳ vọng major "${expectedMajor}.x.x".`,
    );
  }
}

function napNguonUyTin(baseRoot) {
  const candidates = [
    join(baseRoot, 'registry', 'nguon-uy-tin.yaml'),
    join(ROOT, 'registry', 'nguon-uy-tin.yaml'),
  ];
  for (const p of candidates) {
    if (!existsSync(p)) continue;
    try {
      const parsed = yaml.load(readFileSync(p, 'utf8'), { schema: yaml.CORE_SCHEMA });
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.A)) return parsed;
    } catch { /* fallback mặc định */ }
  }
  return NGUON_A_MAC_DINH;
}

function napTuDienCoQuanVaNhanh(baseRoot) {
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
  } catch { /* bỏ qua nếu vắng */ }

  try {
    const cay = yaml.load(readFileSync(join(regDir, 'cay-xnk.yaml'), 'utf8'), { schema: yaml.CORE_SCHEMA });
    const duyet = (nodes, chaPath = '', chaTen = '') => {
      for (const n of nodes || []) {
        if (!n?.id) continue;
        const path = chaPath ? `${chaPath}/${n.id}` : String(n.id);
        const ten = n.ten ? (chaTen ? `${chaTen} › ${n.ten}` : String(n.ten)) : path;
        nhanhTen[path] = ten;
        duyet(n.con, path, ten);
      }
    };
    if (Array.isArray(cay)) duyet(cay);
  } catch { /* bỏ qua nếu vắng */ }

  return { coQuanTen, nhanhTen };
}

function docDuLieuInMemory(baseRoot, today) {
  const so = napSo(baseRoot);
  const registry = dungJson(so, today);
  const cm = dungChiMuc(so, baseRoot, today);

  const tienLe8 = (() => {
    try {
      const dong = readFileSync(join(baseRoot, 'danh-muc', 'tb-tchq-hs-lookup.csv'), 'utf8').trim().split('\n');
      const m = {};
      for (let i = 1; i < dong.length; i += 1) {
        const [hs, dem, mau, ngay] = dong[i].split(',');
        if (!hs) continue;
        m[hs.replace(/\./g, '')] = { so_luong: Number(dem) || 0, mau: mau || null, ngay: ngay || null };
      }
      return Object.keys(m).length ? m : null;
    } catch { return null; }
  })();

  const tienLe4 = (() => {
    try {
      const dir = join(baseRoot, 'data', 'customs', 'processed');
      const f = readdirSync(dir).filter((x) => /^tracuuhs-ket-qua-phan-loai-.*\.json$/.test(x)).sort().pop();
      if (!f) return null;
      const ds = JSON.parse(readFileSync(join(dir, f), 'utf8'));
      const m = {};
      for (const x of ds) {
        const k = String(x.nhom_hs || '').replace(/\./g, '');
        if (k.length === 4) m[k] = (m[k] || 0) + 1;
      }
      return Object.keys(m).length ? m : null;
    } catch { return null; }
  })();

  const hsIndexTheoMa = dungChiMucTheoMa(cm, { bt: docBieuThue(baseRoot), tienLe8, tienLe4 });
  const { index: wikiIndex, chunks: wikiChunks } = dungWikiDist(so, baseRoot, today);
  const dieuKhoan = dungDieuKhoan(so, baseRoot, today);
  const casIndex = dungCasIndex(so, baseRoot, today);

  return { registry, hsIndexTheoMa, wikiIndex, wikiChunks, dieuKhoan, casIndex };
}

function chonBanGhi(ds, k) {
  if (!Array.isArray(ds) || ds.length === 0) return null;
  if (ds.length === 1) return ds[0];
  const diem = (d) =>
    (khoa(d.so_hieu) === k ? 8 : 0) +
    (d.tinh_trang !== 'HET_HIEU_LUC' ? 4 : 0) +
    (d.xac_minh?.muc === 'NGUON_A' ? 2 : 0);
  return [...ds].sort((a, b) => {
    const diff = diem(b) - diem(a);
    if (diff !== 0) return diff;
    return String(b.ngay_ban_hanh || '').localeCompare(String(a.ngay_ban_hanh || ''));
  })[0];
}

function locNguonBacA(doc, nguonUyTin) {
  const list = Array.isArray(doc?.nguon) ? doc.nguon : [];
  const tierDomains = (nguonUyTin?.A || []).map((x) => String(x.ten_mien || '').replace(/^www\./, ''));
  const rankDomain = (url) => {
    let host = '';
    try { host = new URL(url).hostname.replace(/^www\./, ''); } catch { return 9999; }
    const idx = tierDomains.findIndex((m) => host === m || host.endsWith(`.${m}`));
    return idx === -1 ? 9999 : idx;
  };
  const aItems = list
    .filter((n) => n?.url && bacNguon(n.url, nguonUyTin) === 'A')
    .map((n, i) => ({ url: String(n.url), rank: rankDomain(n.url), idx: i }))
    .sort((a, b) => a.rank - b.rank || a.idx - b.idx);

  const seen = new Set();
  const urls = [];
  for (const item of aItems) {
    if (seen.has(item.url)) continue;
    seen.add(item.url);
    urls.push(item.url);
  }
  return urls;
}

function chiTietNguon(doc, nguonUyTin) {
  return (Array.isArray(doc?.nguon) ? doc.nguon : [])
    .filter((n) => n?.url)
    .map((n) => ({
      url: String(n.url),
      truy_cap: n.truy_cap ? String(n.truy_cap) : null,
      bac: bacNguon(n.url, nguonUyTin),
    }));
}

function dinhKemChiMucKho(store) {
  const byKhoa = new Map();
  const bySlug = new Map();
  for (const d of store.registry?.van_ban || []) {
    if (d.slug) bySlug.set(d.slug, d);
    for (const s of [d.so_hieu, ...(Array.isArray(d.so_hieu_khac) ? d.so_hieu_khac : [])]) {
      const k = khoa(s);
      if (!k) continue;
      if (!byKhoa.has(k)) byKhoa.set(k, []);
      if (!byKhoa.get(k).includes(d)) byKhoa.get(k).push(d);
    }
  }

  const wikiTrangBySlug = new Map();
  for (const p of store.wikiIndex?.trang || []) {
    if (p.slug) wikiTrangBySlug.set(p.slug, p);
  }

  const dkNguonAByKhoa = new Map();
  for (const vb of store.dieuKhoan?.nguyen_van_nguon_a || []) {
    const k = khoa(vb.so_hieu);
    if (k) dkNguonAByKhoa.set(k, vb);
  }

  const dkTomTatByKhoa = new Map();
  for (const vb of store.dieuKhoan?.tom_tat_nhap || []) {
    const k = khoa(vb.so_hieu);
    if (k) dkTomTatByKhoa.set(k, vb);
  }

  const canhBaoMaSet = new Set(store.hsIndexTheoMa?.canh_bao_ma || []);
  const allCasEntries = [
    ...Object.values(store.casIndex?.theo_cas || {}).flat(),
    ...(store.casIndex?.khong_co_cas || []),
  ];

  store.byKhoa = byKhoa;
  store.bySlug = bySlug;
  store.wikiTrangBySlug = wikiTrangBySlug;
  store.dkNguonAByKhoa = dkNguonAByKhoa;
  store.dkTomTatByKhoa = dkTomTatByKhoa;
  store.canhBaoMaSet = canhBaoMaSet;
  store.allCasEntries = allCasEntries;
  return store;
}

/**
 * Khởi tạo kho tra cứu từ `distDir` (đủ 6 tệp JSON lược đồ 1.5.0) hoặc fallback in-memory từ `napSo(root)`.
 * @param {{ distDir?: string, root?: string }} [options]
 */
export async function taoKhoTraCuu({ distDir, root = ROOT } = {}) {
  const baseRoot = root ? resolve(root) : ROOT;
  const inDist = distDir ? resolve(distDir) : join(baseRoot, 'dist');
  const du6Tep = TEP_DIST_BAT_BUOC.every((f) => existsSync(join(inDist, f)));
  const nguonUyTin = napNguonUyTin(baseRoot);
  const { coQuanTen, nhanhTen } = napTuDienCoQuanVaNhanh(baseRoot);

  let data;
  let nguonDuLieu;

  if (du6Tep) {
    const loaded = {};
    for (const f of TEP_DIST_BAT_BUOC) {
      const obj = docJsonAnToan(join(inDist, f));
      kiemMajorLuocDo(f, obj);
      loaded[f] = obj;
    }
    data = {
      registry: loaded['registry.json'],
      hsIndexTheoMa: loaded['hs-index-theo-ma.json'],
      wikiIndex: loaded['wiki-index.json'],
      wikiChunks: loaded['wiki-chunks.json'],
      dieuKhoan: loaded['dieu-khoan.json'],
      casIndex: loaded['cas-index.json'],
    };
    nguonDuLieu = 'dist';
  } else {
    data = docDuLieuInMemory(baseRoot, homNay());
    nguonDuLieu = 'in_memory';
  }

  const store = {
    luoc_do_phien_ban: data.registry?.luoc_do_phien_ban || LUOC_DO_PHIEN_BAN,
    phien_ban: data.registry?.phien_ban || homNay(),
    nguon_du_lieu: nguonDuLieu,
    dist_dir: nguonDuLieu === 'dist' ? inDist : null,
    root: baseRoot,
    giay_phep: data.registry?.giay_phep || 'CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/',
    ghi_nguon: GHI_NGUON_CC_BY,
    mien_tru: MIEN_TRU_PHAP_LY,
    nguonUyTin,
    coQuanTen,
    nhanhTen,
    ...data,
  };

  return dinhKemChiMucKho(store);
}

/**
 * Bộ lọc deterministic nhận diện yêu cầu thuộc phạm vi `hs-code-api`
 * (áp mã HS từ mô tả hàng hóa, 6 quy tắc GIR, chú giải WCO/AHTN SEN, tính thuế suất NK/ƯĐ/FTA, tiền lệ phân loại).
 * KHÔNG chặn thủ tục xác định trước mã số hay khung văn bản pháp lý như 85/2026/TT-BTC.
 * @param {string} cauHoi
 * @returns {{ thuoc_hs_code_api: boolean, ly_do: string | null }}
 */
export function laYeuCauThuocHsCodeApi(cauHoi) {
  const raw = String(cauHoi || '').normalize('NFC').trim();
  if (!raw) return { thuoc_hs_code_api: false, ly_do: null };

  const ascii = chuanHoaVanBan(raw);

  // Loại bỏ cụm "xác định trước mã số / mã HS" để không bắt nhầm câu hỏi thủ tục theo Đ28 Luật HQ & Đ7 TT 38/2015.
  const asciiKhongXdt = ascii.replace(
    /\bxac\s+dinh\s+truoc\s+(?:ma\s+so(?:\s+hang\s+hoa)?|ma\s+hs|ma\s+hang(?:\s+hoa)?|hs)\b/g,
    ' [thu_tuc_xdt] ',
  );

  // 1. 6 quy tắc tổng quát GIR / GRI
  const laHoiKhungLuatGir =
    /\b(?:van\s+ban|thong\s+tu|nghi\s+dinh|dieu|khoan)\s+(?:nao|may|bao\s+nhieu)\b/.test(ascii) &&
    !/\bgir\s*[1-6]|\b(?:ap\s+dung|giai\s+thich|phan\s+tich)\b/.test(ascii);
  if (
    !laHoiKhungLuatGir &&
    (/\b(?:6|sau)\s+quy\s+tac\s+(?:tong\s+quat\s+)?(?:gir|gri)\b/.test(ascii) ||
      /\b(?:quy\s+tac\s+(?:tong\s+quat\s+)?(?:gir|gri)|(?:gir|gri)\s*[1-6](?:\s*[ab])?)\b/.test(ascii) ||
      /\b(?:gir|gri)\b/.test(ascii))
  ) {
    return {
      thuoc_hs_code_api: true,
      ly_do: 'Câu hỏi liên quan đến 6 quy tắc tổng quát GIR phân loại hàng hóa (thuộc động cơ hs-code-api).',
    };
  }

  // 2. Chú giải HS WCO / AHTN SEN / Chú giải chương-nhóm HS
  if (
    /\b(?:wco\s+explanatory\s+notes|explanatory\s+notes|ahtn\s+sen|wco\s+compendium)\b/.test(ascii) ||
    /\bchu\s+giai\s+(?:bo\s+sung\s+)?(?:hs|wco|ahtn|sen|tong\s+quat\s+hs|chuong\s+\d+|nhom\s+\d+|phan\s+nhom\s+\d+)\b/.test(
      ascii,
    ) ||
    (/\b(?:wco|ahtn)\b/.test(ascii) && /\b(?:chu\s+giai|sen)\b/.test(ascii))
  ) {
    return {
      thuoc_hs_code_api: true,
      ly_do: 'Câu hỏi về chú giải HS WCO / AHTN SEN / chú giải chương nhóm HS (thuộc hs-code-api).',
    };
  }

  // 3. Tính thuế suất biểu thuế NK / ƯĐ / FTA (không chặn thuế GTGT 8%/10%, thuế CBPG, miễn/hoàn thuế)
  const laChinhSachThuePhapLy =
    /\b(?:hoan\s+thue|mien\s+thue|chong\s+ban\s+pha\s+gia|tu\s+ve|chong\s+tro\s+cap|khai\s+sai|xu\s+phat|bi\s+phat|nghi\s+dinh\s+nao|van\s+ban\s+nao)\b/.test(
      ascii,
    );
  if (
    !laChinhSachThuePhapLy &&
    (/\b(?:tinh|tra(?:\s+cuu)?|ap|xem|hoi)\s+(?:muc\s+)?thue\s+suat\b/.test(ascii) ||
      /\bthue\s+suat\s+(?:nk|xk|xnk|nhap\s+khau|xuat\s*khau|uu\s*dai(?:\s+dac\s+biet)?|thong\s+thuong|mfn|fta|acfta|atiga|evfta|cptpp|rcep|vkfta|akfta|ajcep|vjepa|aifta|aanzfta|ahkfta|vcfta)\b/.test(
        ascii,
      ) ||
      /\b(?:tra(?:\s+cuu)?|tinh|xem)\s+bieu\s+thue\b/.test(ascii) ||
      (/\btinh\s+thue\b/.test(ascii) && /\b(?:nhap\s+khau|xuat\s+khau|nk|xk|xnk|fta|uu\s+dai|mfn|ma\s+hs)\b/.test(ascii)))
  ) {
    return {
      thuoc_hs_code_api: true,
      ly_do: 'Câu hỏi tính hoặc tra cứu thuế suất biểu thuế NK/ƯĐ/FTA (thuộc động cơ biểu thuế hs-code-api).',
    };
  }

  // 4. Tra cứu / hợp nhất tiền lệ phân loại (không chặn khiếu nại/giám định thông báo KQPTPL theo TT 85/2026)
  const laThuTucKhieuNaiPtpl =
    /\b(?:khieu\s+nai|trung\s+cau\s+giam\s+dinh|luu\s+mau|thoi\s+han|thu\s+tuc|quy\s+trinh)\b/.test(ascii) &&
    !/\btien\s+le\b/.test(ascii);
  if (
    !laThuTucKhieuNaiPtpl &&
    (/\b(?:tra(?:\s+cuu)?|tim|xem|hop\s+nhat|tong\s*hop)\s+tien\s+le\b/.test(ascii) ||
      /\btien\s+le\s+(?:phan\s+loai|ap\s+ma|tb-?tchq|tb-?chq|hai\s+quan)\b/.test(ascii) ||
      /\b(?:\/api\/precedents|precedents\.json)\b/.test(ascii) ||
      (/\b(?:thong\s+bao|ket\s+qua)\s+phan\s+loai\b/.test(ascii) &&
        /\b(?:ap\s+ma|ma\s+hs\s+nao|hang\s+hoa|mau\s+hang)\b/.test(ascii)))
  ) {
    return {
      thuoc_hs_code_api: true,
      ly_do: 'Câu hỏi tra cứu hoặc hợp nhất tiền lệ phân loại mã HS (thuộc hs-code-api /api/precedents).',
    };
  }

  // 5. Phân loại / áp mã HS từ mô tả hàng hóa
  const coMaHsCuTheVaChinhSach =
    /\b\d{4}(?:\.\d{2})?(?:\.\d{2})?\b/.test(ascii) &&
    /\b(?:kiem\s+tra\s+chuyen\s+nganh|ktcn|chinh\s+sach|giay\s+phep|cam\s+nhap|hop\s+quy|kiem\s+dich|an\s+toan\s+thuc\s+pham|dieu\s+kien|van\s+ban\s+ap)\b/.test(
      ascii,
    );
  const coKhungPhapLyPhanLoai =
    /\b(?:85\/2026\/tt-btc|38\/2015\/tt-btc|121\/2025\/tt-btc|31\/2022\/tt-btc|169\/2026\/nd-cp|danh\s+muc\s+tru\s+lui|khai\s+sai\s+ma\s+hs|bi\s+phat|xu\s+phat|khieu\s+nai|giam\s+dinh|thu\s+tuc|ho\s+so)\b/.test(
      asciiKhongXdt,
    ) && !/\b(?:ap\s+ma\s+hs|ma\s+hs\s+(?:la\s+gi|nao|bao\s+nhieu|8\s+so)|phan\s+loai\s+.*?\s+vao\s+ma\s+hs)\b/.test(asciiKhongXdt);

  if (!coMaHsCuTheVaChinhSach && !coKhungPhapLyPhanLoai) {
    if (
      /\b(?:ap|gan|xin|goi\s+y|tim|hoi)\s+(?:ho\s+|giup\s+)?ma\s+(?:hs|hang\s+hoa)\b/.test(asciiKhongXdt) ||
      /\b(?:tra(?:\s+cuu)?)\s+ma\s+hs\s+(?:cho|cua|hang|mat\s+hang)\b/.test(asciiKhongXdt) ||
      /\bma\s+(?:hs|hang\s+hoa)\s+(?:cua\s+.+?\s+)?(?:la\s+gi|nao|bao\s+nhieu|8\s+(?:chu\s+)?so)\b/.test(
        asciiKhongXdt,
      ) ||
      /\b(?:thuoc|vao|ap)\s+ma\s+hs\s+(?:nao|gi|8\s+so)\b/.test(asciiKhongXdt) ||
      /\bphan\s+loai\s+(?:ma\s+hs|hang\s+hoa\s+.+?\s+vao\s+ma|mat\s+hang)\b/.test(asciiKhongXdt) ||
      /\b(?:xac\s+dinh\s+ma\s+hs|ma\s+hs\s+8\s+(?:chu\s+)?so\s+cua)\b/.test(asciiKhongXdt) ||
      /\b(?:engine|bo\s+may|api)\s+(?:phan\s+loai|ap\s+ma)\s+hs\b/.test(asciiKhongXdt)
    ) {
      return {
        thuoc_hs_code_api: true,
        ly_do: 'Câu hỏi đề nghị phân loại / áp mã HS từ mô tả hàng hóa (thuộc động cơ hs-code-api, ngoài biên oz-wiki-plhq).',
      };
    }
  }

  return { thuoc_hs_code_api: false, ly_do: null };
}

function dinhDangCanhDi(raw, store) {
  const c = chuanCanh(raw);
  if (!c) return null;
  const hit = chonBanGhi(store.byKhoa.get(khoa(c.so_hieu)), khoa(c.so_hieu));
  return {
    ...c,
    ten: hit?.ten || null,
    tinh_trang: hit?.tinh_trang || null,
    hieu_luc_tu: hit?.hieu_luc_tu || null,
    het_hieu_luc_tu: hit?.het_hieu_luc_tu || null,
  };
}

function dinhDangCanhNguoc(raw, store) {
  if (!raw || typeof raw !== 'object') return null;
  const hit = chonBanGhi(store.byKhoa.get(khoa(raw.tu)), khoa(raw.tu));
  return {
    ...raw,
    ten: hit?.ten || null,
    tinh_trang: hit?.tinh_trang || null,
    hieu_luc_tu: hit?.hieu_luc_tu || null,
    het_hieu_luc_tu: hit?.het_hieu_luc_tu || null,
  };
}

function truyVetChuoiThayThe(doc, store, maxDepth = 10) {
  const chuoiTien = []; // hướng tới văn bản mới thay thế/bãi bỏ
  const daThamTien = new Set([khoa(doc.so_hieu)]);
  const hangDoi = [{ node: doc, buoc: 0 }];
  while (hangDoi.length) {
    const { node, buoc } = hangDoi.shift();
    if (buoc >= maxDepth) continue;
    const ng = node.quan_he_nguoc || {};
    for (const qh of ['bi_thay_the_boi', 'bi_bai_bo_boi']) {
      for (const e of ng[qh] || []) {
        const k = khoa(e.tu);
        if (!k) continue;
        const nextDoc = chonBanGhi(store.byKhoa.get(k), k);
        chuoiTien.push({
          buoc: buoc + 1,
          tu: node.so_hieu,
          quan_he: qh,
          van_ban_moi: nextDoc?.so_hieu || e.tu,
          tinh_trang: nextDoc?.tinh_trang || null,
          pham_vi: e.pham_vi || null,
          tu_ngay: e.tu_ngay || null,
          can_cu: e.can_cu || null,
        });
        if (nextDoc && !daThamTien.has(k)) {
          daThamTien.add(k);
          hangDoi.push({ node: nextDoc, buoc: buoc + 1 });
        }
      }
    }
  }

  const chuoiLui = []; // hướng về các văn bản cũ mà văn bản này thay thế/bãi bỏ
  const daThamLui = new Set([khoa(doc.so_hieu)]);
  const hangDoiLui = [{ node: doc, buoc: 0 }];
  while (hangDoiLui.length) {
    const { node, buoc } = hangDoiLui.shift();
    if (buoc >= maxDepth) continue;
    const qhDi = node.quan_he || {};
    for (const qh of ['thay_the', 'bai_bo']) {
      for (const raw of qhDi[qh] || []) {
        const c = chuanCanh(raw);
        if (!c) continue;
        const k = khoa(c.so_hieu);
        const prevDoc = chonBanGhi(store.byKhoa.get(k), k);
        chuoiLui.push({
          buoc: buoc + 1,
          tu: node.so_hieu,
          quan_he: qh,
          van_ban_cu: prevDoc?.so_hieu || c.so_hieu,
          tinh_trang: prevDoc?.tinh_trang || null,
          pham_vi: c.pham_vi || null,
          tu_ngay: c.tu_ngay || null,
          can_cu: c.can_cu || null,
        });
        if (prevDoc && !daThamLui.has(k)) {
          daThamLui.add(k);
          hangDoiLui.push({ node: prevDoc, buoc: buoc + 1 });
        }
      }
    }
  }

  return { thay_the_boi_chuoi: chuoiTien, thay_the_cho_chuoi: chuoiLui };
}

function goiYSoHieu(store, soHieu, max = 8) {
  const raw = String(soHieu || '').trim();
  const k = khoa(raw);
  if (!k) return [];
  const kBoTienTo = khoa(raw.replace(/^(?:TT|NĐ|ND|QĐ|QD|NQ|TTLT|CT|LUẬT|LUAT|CV)\s+/i, ''));
  const kBoDauGach = kBoTienTo.replace(/[-/.]/g, '');
  const soPhanTu = kBoTienTo.split(/[^A-Z0-9]+/).filter((x) => /\d/.test(x));

  const scored = [];
  for (const d of store.registry?.van_ban || []) {
    let best = 0;
    const allNames = [d.so_hieu, ...(Array.isArray(d.so_hieu_khac) ? d.so_hieu_khac : [])];
    for (const s of allNames) {
      const ks = khoa(s);
      const ksNoPunct = ks.replace(/[-/.]/g, '');
      if (ks === kBoTienTo) best = Math.max(best, 100);
      else if (kBoDauGach && ksNoPunct === kBoDauGach) best = Math.max(best, 95);
      else if (ks.startsWith(kBoTienTo) || kBoTienTo.startsWith(ks)) best = Math.max(best, 80);
      else if (ks.includes(kBoTienTo)) best = Math.max(best, 70);
      else if (kBoDauGach.length >= 5 && ksNoPunct.includes(kBoDauGach)) best = Math.max(best, 60);
      else if (soPhanTu.length >= 2 && soPhanTu.every((p) => ks.includes(p))) best = Math.max(best, 50);
    }
    if (best === 0 && raw.length >= 4) {
      const normTen = chuanHoaVanBan(d.ten);
      const normRaw = chuanHoaVanBan(raw);
      if (normTen.includes(normRaw)) best = 30;
    }
    if (best > 0) {
      scored.push({
        score: best,
        so_hieu: d.so_hieu,
        ten: d.ten,
        tinh_trang: d.tinh_trang,
        hieu_luc_tu: d.hieu_luc_tu || null,
        het_hieu_luc_tu: d.het_hieu_luc_tu || null,
      });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score || a.so_hieu.localeCompare(b.so_hieu))
    .slice(0, max)
    .map(({ score: _s, ...rest }) => rest);
}

/**
 * Tra cứu hiệu lực văn bản theo số hiệu (khớp chính xác `khoa()` trên `so_hieu` và `so_hieu_khac`, kèm gợi ý gần đúng).
 * @param {object} store
 * @param {string} soHieu
 */
export function traHieuLuc(store, soHieu) {
  const truyVan = String(soHieu || '').trim();
  const k = khoa(truyVan);
  if (!k) {
    return {
      tim_thay: false,
      truy_van: soHieu ?? null,
      loi: 'Thiếu số hiệu văn bản cần tra cứu.',
      goi_y: [],
      ghi_nguon: GHI_NGUON_CC_BY,
      mien_tru: MIEN_TRU_PHAP_LY,
    };
  }

  const hits = store.byKhoa.get(k);
  const doc = chonBanGhi(hits, k);
  if (!doc) {
    return {
      tim_thay: false,
      truy_van: truyVan,
      goi_y: goiYSoHieu(store, truyVan),
      ghi_nguon: GHI_NGUON_CC_BY,
      mien_tru: MIEN_TRU_PHAP_LY,
    };
  }

  const quanHe = {};
  for (const [qh] of Object.entries(QUAN_HE)) {
    const arr = (doc.quan_he?.[qh] || []).map((raw) => dinhDangCanhDi(raw, store)).filter(Boolean);
    if (arr.length) quanHe[qh] = arr;
  }

  const quanHeNguoc = {};
  for (const [, tenNguoc] of Object.entries(QUAN_HE)) {
    const arr = (doc.quan_he_nguoc?.[tenNguoc] || []).map((raw) => dinhDangCanhNguoc(raw, store)).filter(Boolean);
    if (arr.length) quanHeNguoc[tenNguoc] = arr;
  }

  const daDoiChieu = doc.xac_minh?.hieu_luc_da_doi_chieu === true;
  const nguonBacA = locNguonBacA(doc, store.nguonUyTin);
  const chuoiQuanHe = truyVetChuoiThayThe(doc, store);

  return {
    tim_thay: true,
    truy_van: truyVan,
    khop_qua_so_hieu_khac: khoa(doc.so_hieu) !== k,
    so_hieu: doc.so_hieu,
    so_hieu_khac: Array.isArray(doc.so_hieu_khac) ? doc.so_hieu_khac : [],
    slug: doc.slug || null,
    loai: doc.loai || null,
    ten: doc.ten || null,
    co_quan: doc.co_quan || null,
    co_quan_ten: (doc.co_quan && store.coQuanTen?.[doc.co_quan]) || null,
    ngay_ban_hanh: doc.ngay_ban_hanh || null,
    hieu_luc_tu: doc.hieu_luc_tu || null,
    het_hieu_luc_tu: doc.het_hieu_luc_tu || null,
    tinh_trang: doc.tinh_trang || 'CHUA_XAC_MINH',
    nhanh: Array.isArray(doc.nhanh) ? doc.nhanh : [],
    quan_he: quanHe,
    quan_he_nguoc: quanHeNguoc,
    chuoi_quan_he: chuoiQuanHe,
    nguon_bac_a: nguonBacA,
    nguon: chiTietNguon(doc, store.nguonUyTin),
    bac_nguon_cao_nhat: doc.bac_nguon_cao_nhat || null,
    xac_minh: {
      muc: doc.xac_minh?.muc || 'CHUA_XAC_MINH',
      hieu_luc_da_doi_chieu: daDoiChieu,
      ngay: doc.xac_minh?.ngay || null,
      pham_vi: doc.xac_minh?.pham_vi || null,
      so_dieu_khoan_nguon_a: Array.isArray(doc.xac_minh?.dieu_khoan) ? doc.xac_minh.dieu_khoan.length : 0,
      canh_bao: daDoiChieu
        ? null
        : 'Cảnh báo: Hiệu lực chưa được đối chiếu văn bản gốc nguồn bậc A (hieu_luc_da_doi_chieu !== true). Cần mở nguồn bậc A kiểm tra lại trước khi áp dụng.',
    },
    ghi_chu: doc.ghi_chu || null,
    ghi_nguon: GHI_NGUON_CC_BY,
    mien_tru: MIEN_TRU_PHAP_LY,
  };
}

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function chuanHoaDieu(val) {
  if (val === undefined || val === null || val === '') return null;
  return String(val)
    .normalize('NFC')
    .trim()
    .replace(/^điều\s+/i, '')
    .replace(/[.)]+$/, '')
    .toLowerCase();
}

function chuanHoaKhoan(val) {
  if (val === undefined || val === null || val === '') return null;
  return String(val)
    .normalize('NFC')
    .trim()
    .replace(/^khoản\s+/i, '')
    .replace(/[.)]+$/, '')
    .toLowerCase();
}

function chuanHoaDiem(val) {
  if (val === undefined || val === null || val === '') return null;
  return String(val)
    .normalize('NFC')
    .trim()
    .replace(/^điểm\s+/i, '')
    .replace(/[.)]+$/, '')
    .toLowerCase();
}

function diemKhopTuKhoa(text, kwInfo) {
  if (!kwInfo.norm) return 1;
  const hay = chuanHoaVanBan(text);
  if (!hay) return 0;
  const hayWords = new Set(hay.split(/[^a-z0-9]+/).filter(Boolean));
  let score = 0;
  if (hay.includes(kwInfo.norm)) score += 50;
  if (kwInfo.hasDiacritics) {
    const rawLower = String(text || '').normalize('NFC').toLowerCase();
    if (rawLower.includes(kwInfo.nfcLower)) score += 30;
  }
  const tokens = kwInfo.coreTokens;
  if (!tokens.length) return score;
  let matched = 0;
  for (const t of tokens) {
    if (hayWords.has(t) || (t.length >= 5 && hay.includes(t))) matched += 1;
  }
  if (matched === 0) return 0;
  if (tokens.length >= 2 && matched < Math.ceil(tokens.length * 0.6) && score === 0) return 0;
  score += Math.round((matched / tokens.length) * 30);
  return score;
}

/**
 * Tra cứu điều khoản 2 tầng: ưu tiên tuyệt đối `NGUYEN_VAN_NGUON_A`,
 * chỉ tìm mở rộng sang `TOM_TAT_NHAP` khi `chi_nguyen_van !== true` và cần mở rộng.
 */
export function traDieuKhoan(
  store,
  { so_hieu, dieu, khoan, diem, tu_khoa, chi_nguyen_van = false, limit = 15 } = {},
) {
  const maxItems = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 15;
  const dieuNorm = chuanHoaDieu(dieu);
  const khoanNorm = chuanHoaKhoan(khoan);
  const diemNorm = chuanHoaDiem(diem);
  const kwInfo = tachTuKhoa(tu_khoa);

  let targetKhoa = null;
  let canonicalSoHieu = null;
  if (so_hieu) {
    const k = khoa(so_hieu);
    const doc = chonBanGhi(store.byKhoa.get(k), k);
    targetKhoa = doc ? khoa(doc.so_hieu) : k;
    canonicalSoHieu = doc ? doc.so_hieu : String(so_hieu).trim();
  }

  const hitsA = [];
  for (const vb of store.dieuKhoan?.nguyen_van_nguon_a || []) {
    if (targetKhoa && khoa(vb.so_hieu) !== targetKhoa) continue;
    for (const dk of vb.dieu_khoan || []) {
      if (dieuNorm !== null && chuanHoaDieu(dk.dieu) !== dieuNorm) continue;
      if (khoanNorm !== null && chuanHoaKhoan(dk.khoan) !== khoanNorm) continue;
      if (diemNorm !== null && chuanHoaDiem(dk.diem) !== diemNorm) continue;
      const kwScore = diemKhopTuKhoa(
        `${vb.so_hieu} Điều ${dk.dieu} ${dk.noi_dung || ''}`,
        kwInfo,
      );
      if (kwInfo.norm && kwScore === 0) continue;
      hitsA.push({
        _score: kwScore,
        tang_tin_cay: 'NGUYEN_VAN_NGUON_A',
        nguyen_van_da_xac_minh: true,
        so_hieu: vb.so_hieu,
        slug: vb.slug,
        ten_van_ban: vb.ten || null,
        tinh_trang: vb.tinh_trang || null,
        hieu_luc_tu: vb.hieu_luc_tu || null,
        het_hieu_luc_tu: vb.het_hieu_luc_tu || null,
        hieu_luc_da_doi_chieu: vb.hieu_luc_da_doi_chieu === true,
        nguon_a: vb.nguon_a || null,
        dieu: dk.dieu,
        khoan: dk.khoan ?? null,
        diem: dk.diem ?? null,
        noi_dung: dk.noi_dung,
        trang_pdf: dk.trang_pdf ?? null,
        sha256_pdf: dk.sha256_pdf ?? null,
      });
    }
  }

  if (kwInfo.norm) {
    hitsA.sort((a, b) => b._score - a._score);
  }
  const nguyenVan = hitsA.slice(0, maxItems).map(({ _score, ...rest }) => rest);

  // Chỉ mở rộng sang TOM_TAT_NHAP khi:
  // 1) chi_nguyen_van !== true
  // 2) chưa đủ limit từ NGUYEN_VAN_NGUON_A
  // 3) và không phải trường hợp đã khớp đúng cặp (so_hieu + dieu) ở NGUYEN_VAN_NGUON_A
  const daKhopDieuCuTheNguonA = Boolean(targetKhoa && dieuNorm !== null && nguyenVan.length > 0);
  const canTimMoRong = chi_nguyen_van !== true && nguyenVan.length < maxItems && !daKhopDieuCuTheNguonA;

  const hitsT = [];
  if (canTimMoRong) {
    const daCoTrongA = new Set(
      nguyenVan.map((x) => `${khoa(x.so_hieu)}::${chuanHoaDieu(x.dieu)}`),
    );
    const remaining = maxItems - nguyenVan.length;

    for (const vb of store.dieuKhoan?.tom_tat_nhap || []) {
      const kVb = khoa(vb.so_hieu);
      if (targetKhoa && kVb !== targetKhoa) continue;
      const docMeta = chonBanGhi(store.byKhoa.get(kVb), kVb);
      for (const dk of vb.dieu_khoan || []) {
        const dkDieuNorm = chuanHoaDieu(dk.dieu);
        if (dieuNorm !== null && dkDieuNorm !== dieuNorm) continue;
        // Bỏ qua cặp (so_hieu, dieu) đã có bản nguyên văn nguồn A trong kết quả nếu không lọc theo khoản/điểm riêng
        if (daCoTrongA.has(`${kVb}::${dkDieuNorm}`) && khoanNorm === null && diemNorm === null) continue;
        // TOM_TAT_NHAP không có cấu trúc trường khoan/diem tách riêng; kiểm trong nội dung nếu user lọc khoản/điểm
        const fullText = [
          vb.so_hieu,
          dk.dieu,
          dk.ten,
          dk.tom_tat,
          ...(Array.isArray(dk.nghia_vu_xnk) ? dk.nghia_vu_xnk : []),
        ]
          .filter(Boolean)
          .join(' ');
        if (khoanNorm !== null && !new RegExp(`\\bkhoan\\s+${escapeRegExp(boDau(khoanNorm))}\\b`).test(chuanHoaVanBan(fullText))) {
          continue;
        }
        if (diemNorm !== null && !new RegExp(`\\bdiem\\s+${escapeRegExp(boDau(diemNorm))}\\b`).test(chuanHoaVanBan(fullText))) {
          continue;
        }
        const kwScore = diemKhopTuKhoa(fullText, kwInfo);
        if (kwInfo.norm && kwScore === 0) continue;

        hitsT.push({
          _score: kwScore,
          tang_tin_cay: 'TOM_TAT_NHAP',
          da_soat: false,
          luu_y: CANH_BAO_TOM_TAT_NHAP,
          so_hieu: vb.so_hieu || docMeta?.so_hieu || null,
          slug: vb.slug,
          ten_van_ban: docMeta?.ten || null,
          tinh_trang: vb.tinh_trang || docMeta?.tinh_trang || null,
          hieu_luc_tu: vb.hieu_luc_tu || docMeta?.hieu_luc_tu || null,
          het_hieu_luc_tu: vb.het_hieu_luc_tu || docMeta?.het_hieu_luc_tu || null,
          nguon_a: vb.nguon_a || null,
          dieu: dk.dieu ?? null,
          ten: dk.ten ?? null,
          tom_tat: dk.tom_tat ?? null,
          nghia_vu_xnk: Array.isArray(dk.nghia_vu_xnk) ? dk.nghia_vu_xnk : [],
          nguon_trich: dk.nguon_trich ?? null,
        });
      }
    }
    if (kwInfo.norm) {
      hitsT.sort((a, b) => b._score - a._score);
    }
    hitsT.splice(remaining);
  }

  const tomTatNhap = hitsT.map(({ _score, ...rest }) => rest);

  return {
    truy_van: {
      so_hieu: canonicalSoHieu || so_hieu || null,
      dieu: dieu ?? null,
      khoan: khoan ?? null,
      diem: diem ?? null,
      tu_khoa: tu_khoa ?? null,
      chi_nguyen_van: Boolean(chi_nguyen_van),
    },
    tong_nguyen_van: nguyenVan.length,
    tong_tom_tat_nhap: tomTatNhap.length,
    nguyen_van_nguon_a: nguyenVan,
    tom_tat_nhap: tomTatNhap,
    canh_bao_tang_nhap: tomTatNhap.length > 0 ? store.dieuKhoan?.canh_bao_tang_nhap || CANH_BAO_TOM_TAT_NHAP : null,
    ghi_nguon: GHI_NGUON_CC_BY,
    mien_tru: MIEN_TRU_PHAP_LY,
  };
}

function trichSoHieuTrongCauHoi(cauHoi, byKhoa) {
  const nfc = String(cauHoi || '').normalize('NFC');
  const found = [];
  const missing = [];
  const seen = new Set();
  const seenMissing = new Set();
  const add = (raw) => {
    const clean = String(raw || '').trim().replace(/[.,;:!?)]+$/, '');
    const k = khoa(clean);
    if (!k) return;
    if (byKhoa.has(k)) {
      if (!seen.has(k)) {
        seen.add(k);
        found.push(k);
      }
    } else if (/^\d{1,5}\/(?:\d{4}\/)?[A-ZĐ]{2,}/.test(k) && !seenMissing.has(k)) {
      seenMissing.add(k);
      missing.push(clean);
    }
  };
  for (const re of [RE_SO_HIEU_WIKI, RE_SO_HIEU_BO_SUNG]) {
    const r = new RegExp(re.source, re.flags);
    for (const m of nfc.matchAll(r)) add(m[0]);
  }
  for (const tok of nfc.split(/[\s,;()[\]{}"'«»“”`]+/)) {
    if (/\d/.test(tok) && /[/-]/.test(tok)) add(tok);
  }
  return { found, missing };
}

function kiemVanBanChuaCoToanVan(doc, store) {
  if (!doc) return true;
  const k = khoa(doc.so_hieu);
  const coWiki = Boolean(doc.slug && store.wikiTrangBySlug.has(doc.slug));
  const coDka = Boolean(k && store.dkNguonAByKhoa.has(k));
  const coDh = Boolean(k && store.dkTomTatByKhoa.has(k));
  return !coWiki && !coDka && !coDh;
}

function laTbTchq(doc) {
  return doc?.loai === 'TB_TCHQ' || String(doc?.so_hieu || '').includes('TB-TCHQ') || String(doc?.so_hieu || '').includes('TB-CHQ');
}

function lamMoiVanBanLienQuan(refs, store, opts = {}) {
  const { pinnedSet = new Set(), relevanceMap = null, includeReplacements = true } = opts;
  const out = [];
  const seen = new Set();

  const pushDoc = (k, rawRef = {}, meta = {}) => {
    if (!k || seen.has(k)) return;
    seen.add(k);
    const doc = chonBanGhi(store.byKhoa.get(k), k);
    const ng = doc?.quan_he_nguoc || {};
    const biThayTheBoi =
      doc
        ? [...new Set((ng.bi_thay_the_boi || []).map((e) => e.tu))]
        : (rawRef.bi_thay_the_boi || []);
    const biBaiBoBoi =
      doc
        ? [...new Set((ng.bi_bai_bo_boi || []).map((e) => e.tu))]
        : (rawRef.bi_bai_bo_boi || []);
    const nguonBacA = doc ? locNguonBacA(doc, store.nguonUyTin) : rawRef.nguon_a ? [rawRef.nguon_a] : [];
    const tinhTrang = doc?.tinh_trang || rawRef.tinh_trang || null;
    const daDoiChieu = doc ? doc.xac_minh?.hieu_luc_da_doi_chieu === true : Boolean(rawRef.hieu_luc_da_doi_chieu);
    const khopTrucTiep = pinnedSet.has(k) || Boolean(meta.khopTrucTiep);
    const chuaToanVan = doc ? kiemVanBanChuaCoToanVan(doc, store) : false;

    out.push({
      so_hieu: doc?.so_hieu || rawRef.so_hieu,
      ten: doc?.ten || null,
      loai: doc?.loai || null,
      tinh_trang: tinhTrang,
      hieu_luc_tu: doc?.hieu_luc_tu ?? rawRef.hieu_luc_tu ?? null,
      het_hieu_luc_tu: doc?.het_hieu_luc_tu ?? rawRef.het_hieu_luc_tu ?? null,
      hieu_luc_da_doi_chieu: daDoiChieu,
      bi_thay_the_boi: biThayTheBoi,
      bi_bai_bo_boi: biBaiBoBoi,
      nguon_a: nguonBacA[0] || rawRef.nguon_a || null,
      nguon_bac_a: nguonBacA,
      ...(khopTrucTiep ? { khop_so_hieu_truc_tiep: true } : {}),
      ...(meta.thayTheCho ? { thay_the_cho: meta.thayTheCho } : {}),
      ...(chuaToanVan ? { chua_co_toan_van_trong_kho: true } : {}),
      _priority:
        khopTrucTiep
          ? 3
          : tinhTrang === 'CON_HIEU_LUC' || tinhTrang === 'HET_HIEU_LUC_MOT_PHAN'
            ? 2
            : tinhTrang === 'HET_HIEU_LUC'
              ? 0
              : 1,
      _rel: (relevanceMap?.get(k) || 0) + (meta.bonus || 0),
      _ngay: doc?.ngay_ban_hanh || '',
      canh_bao:
        tinhTrang === 'HET_HIEU_LUC'
          ? `Văn bản ${doc?.so_hieu || rawRef.so_hieu} đã HET_HIEU_LUC${
              biThayTheBoi.length
                ? ` (bị thay thế bởi ${biThayTheBoi.join(', ')})`
                : biBaiBoBoi.length
                  ? ` (bị bãi bỏ bởi ${biBaiBoBoi.join(', ')})`
                  : ''
            }.`
          : !daDoiChieu
            ? `Văn bản ${doc?.so_hieu || rawRef.so_hieu} chưa đối chiếu hiệu lực nguồn bậc A.`
            : null,
    });

    if (includeReplacements && tinhTrang === 'HET_HIEU_LUC') {
      for (const rep of biThayTheBoi) {
        const repK = khoa(rep);
        if (!repK || seen.has(repK)) continue;
        const repDoc = chonBanGhi(store.byKhoa.get(repK), repK);
        if (repDoc && repDoc.tinh_trang !== 'HET_HIEU_LUC') {
          pushDoc(repK, { so_hieu: repDoc.so_hieu }, { thayTheCho: doc?.so_hieu || rawRef.so_hieu, bonus: 15 });
        }
      }
    }
  };

  for (const r of refs || []) {
    if (!r?.so_hieu) continue;
    pushDoc(khoa(r.so_hieu), r, r._meta || {});
  }

  out.sort(
    (a, b) =>
      b._priority - a._priority ||
      b._rel - a._rel ||
      b._ngay.localeCompare(a._ngay) ||
      String(a.so_hieu || '').localeCompare(String(b.so_hieu || '')),
  );
  return out.map(({ _priority, _rel, _ngay, ...rest }) => rest);
}

function khopNhanh(nhanhFilter, refs, tags, store) {
  if (!nhanhFilter) return true;
  const f = String(nhanhFilter).trim().toLowerCase();
  if (!f) return true;
  for (const r of refs || []) {
    const doc = chonBanGhi(store.byKhoa.get(khoa(r.so_hieu)), khoa(r.so_hieu));
    for (const n of doc?.nhanh || []) {
      const nl = String(n).toLowerCase();
      if (nl === f || nl.startsWith(`${f}/`) || f.startsWith(`${nl}/`)) return true;
    }
  }
  const parts = f.split('/');
  for (const tg of tags || []) {
    const tgl = chuanHoaVanBan(tg);
    if (parts.some((p) => tgl === p || tgl.includes(p))) return true;
  }
  return false;
}

function chamDiemKhoi({ tieuDe, muc, noiDung, tags, refs, soHieuHits, preferredActiveSet, canhBaoHieuLuc, loaiTrang, confidence, laStub }, qInfo) {
  const normTitle = chuanHoaVanBan(tieuDe);
  const normMuc = chuanHoaVanBan(muc);
  const normBody = chuanHoaVanBan(noiDung);
  const normTags = (tags || []).map(chuanHoaVanBan).join(' ');
  const titleNorm = `${normTitle} ${normMuc} ${normTags}`;
  const fullNorm = `${titleNorm} ${normBody}`;
  const fullWords = new Set(fullNorm.split(/[^a-z0-9]+/).filter(Boolean));
  const titleWords = new Set(titleNorm.split(/[^a-z0-9]+/).filter(Boolean));

  const rawFullLower = `${tieuDe || ''} ${muc || ''} ${(tags || []).join(' ')} ${noiDung || ''}`
    .normalize('NFC')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();
  const rawWords = new Set(rawFullLower.split(/[^\p{L}\p{N}]+/u).filter(Boolean));

  let score = 0;

  if (qInfo.norm.length >= 3) {
    if (normTitle.includes(qInfo.norm)) score += 60;
    if (normMuc.includes(qInfo.norm)) score += 35;
    if (normBody.includes(qInfo.norm)) score += 45;
  }
  if (qInfo.hasDiacritics && qInfo.nfcLower.length >= 3) {
    if (rawFullLower.includes(qInfo.nfcLower)) score += 35;
  }

  const tokens = qInfo.coreTokens;
  const specTokens = qInfo.specificTokens || [];
  let matched = 0;
  let titleMatched = 0;
  let specMatched = 0;
  let specTitleMatched = 0;
  for (const t of tokens) {
    const isSpec = specTokens.includes(t);
    const inBody = fullWords.has(t) || (t.length >= 5 && fullNorm.includes(t));
    if (inBody) {
      matched += 1;
      if (isSpec) specMatched += 1;
    }
    if (titleWords.has(t) || (t.length >= 5 && titleNorm.includes(t))) {
      titleMatched += 1;
      if (isSpec) specTitleMatched += 1;
    }
  }

  // Khớp cụm mở rộng viết tắt (dùng ranh giới từ để tránh khớp nhầm chuỗi con, vd "so to khai" chứa "o to").
  let expandedPhraseHits = 0;
  let expandedTitleHits = 0;
  const matchers = qInfo.expandedPhraseMatchers || [];
  if (matchers.length) {
    for (const re of matchers) {
      const hitTitle = re.test(titleNorm);
      const hitFull = hitTitle || re.test(fullNorm);
      if (hitTitle) expandedTitleHits += 1;
      if (hitFull) expandedPhraseHits += 1;
    }
  } else {
    for (const ph of qInfo.expandedPhrases || []) {
      const phVariants = ph === 'c/o' ? ['c/o'] : [ph, ph.replace(/\s+/g, '-')];
      const hitTitle = phVariants.some((v) => titleNorm.includes(v));
      const hitFull = hitTitle || phVariants.some((v) => fullNorm.includes(v));
      if (hitTitle) expandedTitleHits += 1;
      if (hitFull) expandedPhraseHits += 1;
    }
  }

  // Cụm chủ đề chứa từ 1 chữ cái (vd "ô tô") tính vào độ phủ specificTokens như một khái niệm nguyên vẹn.
  let compoundSpecMatched = 0;
  let compoundSpecTitleMatched = 0;
  const compoundGroups = qInfo.compoundSpecGroups || [];
  for (const cg of compoundGroups) {
    let hitTitle = false;
    let hitFull = false;
    for (const re of cg.matchers) {
      if (re.test(titleNorm)) {
        hitTitle = true;
        hitFull = true;
        break;
      }
      if (re.test(fullNorm)) hitFull = true;
    }
    if (hitTitle) compoundSpecTitleMatched += 1;
    if (hitFull) compoundSpecMatched += 1;
  }

  let exactNumHits = 0;
  for (const nt of qInfo.exactNumericTags || []) {
    if (fullNorm.replace(/\s+/g, '').includes(nt)) exactNumHits += 1;
  }

  let exactDateHits = 0;
  let exactDateTitleHits = 0;
  for (const dg of qInfo.exactDateGroups || []) {
    if (dg.regex.test(titleNorm)) {
      exactDateHits += 1;
      exactDateTitleHits += 1;
    } else if (dg.regex.test(fullNorm)) {
      exactDateHits += 1;
    }
  }

  let accentedMatched = 0;
  let accentedSpecMatched = 0;
  let accentedSpecTitleMatched = 0;
  let accentedSpecBigramHits = 0;
  let accentedSpecBigramTitleHits = 0;
  if (qInfo.hasDiacritics) {
    const rawTitleLower = `${tieuDe || ''} ${muc || ''}`.normalize('NFC').replace(/\s+/g, ' ').toLowerCase();
    const rawTitleWords = new Set(rawTitleLower.split(/[^\p{L}\p{N}]+/u).filter(Boolean));
    for (const aw of qInfo.accentedCoreTokens) {
      if (rawWords.has(aw) || (aw.length >= 5 && rawFullLower.includes(aw))) accentedMatched += 1;
    }
    const accSpecSet = new Set(qInfo.accentedSpecificTokens || []);
    for (const asw of qInfo.accentedSpecificTokens || []) {
      if (rawWords.has(asw) || (asw.length >= 5 && rawFullLower.includes(asw))) accentedSpecMatched += 1;
      if (rawTitleWords.has(asw) || (asw.length >= 5 && rawTitleLower.includes(asw))) accentedSpecTitleMatched += 1;
    }
    const aseq = qInfo.rawSeq || [];
    for (let i = 0; i < aseq.length - 1; i += 1) {
      if (!accSpecSet.has(aseq[i]) && !accSpecSet.has(aseq[i + 1])) continue;
      if (STOP_WORDS_ASCII.has(chuanHoaVanBan(aseq[i])) || STOP_WORDS_ASCII.has(chuanHoaVanBan(aseq[i + 1]))) continue;
      const abg = `${aseq[i]} ${aseq[i + 1]}`;
      if (rawFullLower.includes(abg)) accentedSpecBigramHits += 1;
      if (rawTitleLower.includes(abg)) accentedSpecBigramTitleHits += 1;
    }
  }

  // Bigrams liền kề thực (chỉ xét cặp từ liên tiếp không bắc cầu qua stop-word)
  const specSet = new Set(specTokens);
  const nseq = qInfo.normSeq || tokens;
  let specBigramHits = 0;
  let specBigramTitleHits = 0;
  let genBigramHits = 0;
  for (let i = 0; i < nseq.length - 1; i += 1) {
    const t1 = nseq[i];
    const t2 = nseq[i + 1];
    if (STOP_WORDS_ASCII.has(t1) || STOP_WORDS_ASCII.has(t2)) continue;
    const bg = `${t1} ${t2}`;
    const isSpecBg = specSet.has(t1) || specSet.has(t2);
    if (isSpecBg) {
      if (titleNorm.includes(bg)) specBigramTitleHits += 1;
      if (fullNorm.includes(bg)) specBigramHits += 1;
    } else if (fullNorm.includes(bg)) {
      genBigramHits += 1;
    }
  }

  const refSet = new Set((refs || []).map((r) => khoa(r.so_hieu)));
  let refHits = 0;
  if (soHieuHits.length) {
    for (const sk of soHieuHits) {
      if (refSet.has(sk)) refHits += 1;
      else if (fullNorm.includes(chuanHoaVanBan(sk))) refHits += 0.6;
    }
  }

  let preferredRefHits = 0;
  if (preferredActiveSet && preferredActiveSet.size > 0) {
    for (const rk of refSet) {
      if (preferredActiveSet.has(rk)) {
        preferredRefHits += 1;
        break;
      }
    }
  }

  const totalSpecCount = specTokens.length + compoundGroups.length;
  const totalSpecMatched = specMatched + compoundSpecMatched;
  const totalSpecTitleMatched = specTitleMatched + compoundSpecTitleMatched;

  if (matched === 0 && refHits === 0 && expandedPhraseHits === 0 && exactDateHits === 0) return 0;

  if (loaiTrang === 'NGUYEN_VAN_NGUON_A') {
    if (refHits === 0) {
      const hasStrongDomainMatch =
        totalSpecMatched >= 2 ||
        (totalSpecCount <= 1 && totalSpecMatched === totalSpecCount && (matched >= 2 || expandedPhraseHits >= 1 || exactNumHits >= 1 || exactDateHits >= 1)) ||
        specBigramHits >= 1 ||
        expandedPhraseHits >= 1;
      if (!hasStrongDomainMatch) return 0;
      if (qInfo.hasDiacritics && (qInfo.accentedSpecificTokens?.length || 0) >= 4
        && accentedSpecMatched < Math.max(2, Math.ceil(qInfo.accentedSpecificTokens.length * 0.4))
        && accentedSpecBigramHits === 0
        && expandedPhraseHits === 0) {
        return 0;
      }
      if ((qInfo.accentedSpecificTokens?.length || totalSpecCount) >= 4
        && specBigramHits === 0
        && accentedSpecBigramHits === 0
        && expandedPhraseHits === 0) {
        return 0;
      }
      if (tokens.length >= 3 && matched < Math.ceil(tokens.length * 0.45) && specBigramHits === 0 && expandedPhraseHits === 0) {
        return 0;
      }
      if (qInfo.hasDiacritics && accentedMatched === 0 && expandedPhraseHits === 0) return 0;
    }
  } else {
    if (tokens.length >= 3 && matched < Math.ceil(tokens.length * 0.4) && refHits === 0 && specBigramHits === 0 && expandedPhraseHits === 0) {
      return 0;
    }
    if (totalSpecCount >= 2 && totalSpecMatched === 0 && expandedPhraseHits === 0 && refHits === 0) {
      return 0;
    }
    if (totalSpecCount >= 4 && totalSpecMatched < 2 && expandedPhraseHits === 0 && refHits === 0) {
      return 0;
    }
    if ((qInfo.accentedSpecificTokens?.length || totalSpecCount) >= 4
      && specBigramHits === 0
      && accentedSpecBigramHits === 0
      && expandedPhraseHits === 0
      && refHits === 0) {
      return 0;
    }
    if (qInfo.hasDiacritics && (qInfo.accentedSpecificTokens?.length || 0) >= 4
      && accentedSpecMatched < Math.max(2, Math.ceil(qInfo.accentedSpecificTokens.length * 0.4))
      && accentedSpecBigramHits === 0
      && expandedPhraseHits === 0
      && refHits === 0) {
      return 0;
    }
  }

  score += tokens.length ? Math.round((matched / tokens.length) * 24) : 0;
  score += totalSpecCount ? Math.round((totalSpecMatched / totalSpecCount) * 32) : 0;
  score += tokens.length ? Math.round((titleMatched / tokens.length) * 18) : 0;
  score += totalSpecCount ? Math.round((totalSpecTitleMatched / totalSpecCount) * 28) : 0;
  score += qInfo.accentedCoreTokens.length ? Math.round((accentedMatched / qInfo.accentedCoreTokens.length) * 16) : 0;
  score += (qInfo.accentedSpecificTokens?.length || 0)
    ? Math.round((accentedSpecMatched / qInfo.accentedSpecificTokens.length) * 36)
      + Math.round((accentedSpecTitleMatched / qInfo.accentedSpecificTokens.length) * 30)
    : 0;
  score += Math.min(specBigramHits, 6) * 12 + Math.min(specBigramTitleHits, 4) * 10 + Math.min(genBigramHits, 3) * 3;
  score += Math.min(accentedSpecBigramHits, 5) * 18 + Math.min(accentedSpecBigramTitleHits, 3) * 16;

  // Cân bằng độ phủ specificTokens với thưởng ngày & cụm mở rộng để tránh khối khớp lệch chủ đề vượt khối chuyên đề.
  let expandedBonus = Math.min(expandedPhraseHits, 4) * 18 + Math.min(expandedTitleHits, 4) * 16;
  const allowDateTitleBonus = totalSpecCount < 3 || totalSpecMatched === totalSpecCount;
  let exactDateBonus = exactDateHits * 30 + (allowDateTitleBonus ? exactDateTitleHits * 12 : 0);
  if (totalSpecCount >= 3) {
    if (totalSpecMatched < Math.ceil(totalSpecCount * 0.5)) {
      expandedBonus = Math.round(expandedBonus * 0.5);
      exactDateBonus = Math.round(exactDateBonus * 0.5);
    } else if (totalSpecMatched >= Math.ceil(totalSpecCount * 0.75) && (compoundGroups.length === 0 || compoundSpecMatched === compoundGroups.length)) {
      score += totalSpecMatched === totalSpecCount ? 34 : 4;
    }
  }
  score += expandedBonus;
  score += exactNumHits * 10;
  score += exactDateBonus;
  score += refHits * 60;
  score += preferredRefHits * 28;
  if (compoundGroups.length > 0 && compoundSpecMatched === 0 && refHits === 0) {
    score = Math.round(score * 0.6);
  }

  // Ưu tiên đoạn an toàn hiệu lực và tài liệu tổng hợp/khái niệm
  if (canhBaoHieuLuc === true) score -= 28;
  else score += 10;

  if (laStub) score -= 8;

  if (loaiTrang === 'concepts') score += 20;
  else if (loaiTrang === 'summary') score += 16;
  else if (loaiTrang === 'NGUYEN_VAN_NGUON_A') score += 6;

  if (confidence === 'high') score += 3;
  else if (confidence === 'medium') score += 1;

  return Math.max(0, score);
}

function canHaUuTienChuaCoHieuLuc(tinhTrang, hieuLucTu, soHieuKhoa, pinnedSet, qInfo, storeYear) {
  if (tinhTrang !== 'CHUA_CO_HIEU_LUC') return false;
  if (soHieuKhoa && pinnedSet.has(soHieuKhoa)) return false;
  const effStr = String(hieuLucTu || '').trim();
  const m = effStr.match(/^(\d{4})(?:-(\d{2})-(\d{2}))?/);
  if (!m) return true;
  const effYear = m[1];
  if (qInfo?.standaloneYears?.has(effYear)) return false;
  if (
    (qInfo?.exactDateGroups || []).some((g) => {
      if (g.year !== effYear) return false;
      if (storeYear && Number(effYear) > Number(storeYear)) return true;
      return m[2] ? g.key >= effStr.slice(0, 10) : true;
    })
  ) {
    return false;
  }
  return true;
}

function haDiemChuaCoHieuLuc(score) {
  return score > 0 ? Math.max(1, Math.round(score * 0.6) - 30) : 0;
}

function canHaUuTienTrangWiki(ownDoc, refs, store, pinnedSet, qInfo, storeYear) {
  if (ownDoc) {
    return canHaUuTienChuaCoHieuLuc(
      ownDoc.tinh_trang,
      ownDoc.hieu_luc_tu,
      khoa(ownDoc.so_hieu),
      pinnedSet,
      qInfo,
      storeYear,
    );
  }
  const resolved = (refs || [])
    .map((r) => chonBanGhi(store.byKhoa.get(khoa(r.so_hieu)), khoa(r.so_hieu)))
    .filter(Boolean);
  if (!resolved.length) return false;
  return resolved.every((d) =>
    canHaUuTienChuaCoHieuLuc(d.tinh_trang, d.hieu_luc_tu, khoa(d.so_hieu), pinnedSet, qInfo, storeYear),
  );
}

function timTrongRegistry(store, qInfo, soHieuHits, { nhanh, limit = 5, storeYear = null } = {}) {
  const results = [];
  const pinSet = new Set(soHieuHits);
  for (const doc of store.registry?.van_ban || []) {
    if (!doc?.so_hieu || laTbTchq(doc)) continue;
    if (nhanh && !khopNhanh(nhanh, [{ so_hieu: doc.so_hieu }], doc.nhanh || [], store)) continue;
    const k = khoa(doc.so_hieu);
    const isPinned = pinSet.has(k);
    let score = chamDiemKhoi(
      {
        tieuDe: `${doc.so_hieu} ${doc.ten || ''}`,
        muc: (doc.nhanh || []).join(' '),
        noiDung: doc.ghi_chu || '',
        tags: doc.nhanh || [],
        refs: [{ so_hieu: doc.so_hieu }],
        soHieuHits,
        canhBaoHieuLuc: doc.tinh_trang === 'HET_HIEU_LUC',
        loaiTrang: 'registry',
        confidence: doc.xac_minh?.muc === 'NGUON_A' ? 'high' : 'medium',
      },
      qInfo,
    );
    if (canHaUuTienChuaCoHieuLuc(doc.tinh_trang, doc.hieu_luc_tu, k, pinSet, qInfo, storeYear)) {
      score = haDiemChuaCoHieuLuc(score);
    }
    if (isPinned) score = Math.max(score, 120);
    if (score === 0) continue;
    if (!isPinned && score < 55) continue;
    results.push({ doc, k, score, isPinned });
  }
  results.sort((a, b) => Number(b.isPinned) - Number(a.isPinned) || b.score - a.score);
  return results.slice(0, limit);
}

/**
 * Hỏi đáp pháp luật hải quan trên `wiki-chunks`, `wiki-index`, `dieu-khoan.json` và `registry`.
 * Luôn kiểm `laYeuCauThuocHsCodeApi(cauHoi)` trước để chặn ranh giới `hs-code-api`.
 */
export function hoiPhapLuat(store, cauHoi, { nhanh, limit = 8 } = {}) {
  const hsCheck = laYeuCauThuocHsCodeApi(cauHoi);
  if (hsCheck.thuoc_hs_code_api) {
    return {
      cau_hoi: String(cauHoi || ''),
      nhanh: nhanh || null,
      chuyen_huong: {
        he_thong: 'hs-code-api',
        ly_do: hsCheck.ly_do,
      },
      ket_qua: [],
      trang_wiki_lien_quan: [],
      dieu_khoan_nguon_a: [],
      dieu_khoan_tom_tat_nhap: [],
      van_ban_lien_quan: [],
      canh_bao: [],
      do_tin_cay_tra_loi: 'CHUYEN_HUONG_HS_CODE_API',
      pham_vi_du_lieu: PHAM_VI_DU_LIEU_PLHQ,
      goi_y_du_phong: null,
      ghi_nguon: GHI_NGUON_CC_BY,
      mien_tru: MIEN_TRU_PHAP_LY,
    };
  }

  const maxItems = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 8;
  const qInfo = tachTuKhoa(cauHoi);
  const { found: soHieuHits, missing: soHieuThieuTrongSo } = trichSoHieuTrongCauHoi(cauHoi, store.byKhoa);
  const pinnedSet = new Set(soHieuHits);

  if (!qInfo.norm && soHieuHits.length === 0) {
    return {
      cau_hoi: String(cauHoi || ''),
      nhanh: nhanh || null,
      chuyen_huong: null,
      ket_qua: [],
      trang_wiki_lien_quan: [],
      dieu_khoan_nguon_a: [],
      dieu_khoan_tom_tat_nhap: [],
      van_ban_lien_quan: [],
      canh_bao: [],
      do_tin_cay_tra_loi: 'KHONG_TIM_THAY',
      pham_vi_du_lieu: PHAM_VI_DU_LIEU_PLHQ,
      goi_y_du_phong: {
        can_tra_nguon_truc_tiep: true,
        cong_cu_de_xuat: 'tim_van_ban_lop_2',
        can_mo_the_bo_sung_so: false,
        url_nguon_bac_a_goi_y: [],
        ly_do: 'Câu hỏi rỗng hoặc chưa có từ khóa/số hiệu hợp lệ để tra cứu.',
      },
      ghi_nguon: GHI_NGUON_CC_BY,
      mien_tru: MIEN_TRU_PHAP_LY,
    };
  }

  const storeYear = String(store.phien_ban || homNay()).slice(0, 4);

  // Helper gán ref sở hữu của chính trang wiki (ví dụ sources/107-2016-qh13.md -> 107/2016/QH13)
  const ownDocForSlug = (slug) =>
    store.bySlug.get(slug) || store.bySlug.get(String(slug || '').replace(/^sources\//, '')) || null;
  const ownSoHieuForSlug = (slug) => {
    const doc = ownDocForSlug(slug);
    return doc?.so_hieu ? [{ so_hieu: doc.so_hieu }] : [];
  };

  // 1. Tìm trên wiki-index (trang)
  const pageMatches = [];
  for (const trang of store.wikiIndex?.trang || []) {
    const ownDoc = ownDocForSlug(trang.slug);
    const ownRefs = ownDoc?.so_hieu ? [{ so_hieu: ownDoc.so_hieu }] : [];
    const mergedPageRefs = [...(trang.van_ban_lien_quan || []), ...ownRefs];
    if (!khopNhanh(nhanh, mergedPageRefs, trang.tags, store)) continue;
    const ownHetUnpinned = Boolean(ownDoc?.tinh_trang === 'HET_HIEU_LUC' && !pinnedSet.has(khoa(ownDoc.so_hieu)));
    let score = chamDiemKhoi(
      {
        tieuDe: trang.tieu_de,
        muc: trang.slug,
        noiDung: mergedPageRefs.map((v) => v.so_hieu).join(' '),
        tags: trang.tags,
        refs: mergedPageRefs,
        soHieuHits,
        canhBaoHieuLuc: Boolean(trang.canh_bao_hieu_luc) || ownHetUnpinned,
        loaiTrang: trang.loai_trang,
        confidence: trang.confidence,
        laStub: (trang.tags || []).includes('stub'),
      },
      qInfo,
    );
    if (score > 0 && canHaUuTienTrangWiki(ownDoc, mergedPageRefs, store, pinnedSet, qInfo, storeYear)) {
      score = haDiemChuaCoHieuLuc(score);
    }
    if (score > 0) {
      pageMatches.push({ trang, score });
    }
  }
  pageMatches.sort((a, b) => b.score - a.score);
  const pageScoreMap = new Map(pageMatches.map((m) => [m.trang.slug, m.score]));

  // 2. Tìm trên wiki-chunks
  const chunkCandidates = [];
  for (const chunk of store.wikiChunks?.chunks || []) {
    const parent = store.wikiTrangBySlug.get(chunk.slug);
    const ownDoc = ownDocForSlug(chunk.slug);
    const ownRefs = ownDoc?.so_hieu ? [{ so_hieu: ownDoc.so_hieu }] : [];
    const effectiveRefs = [
      ...(Array.isArray(chunk.van_ban_lien_quan) && chunk.van_ban_lien_quan.length
        ? chunk.van_ban_lien_quan
        : parent?.van_ban_lien_quan || []),
      ...ownRefs,
    ];
    if (!khopNhanh(nhanh, effectiveRefs, chunk.tags, store)) continue;

    const ownHetUnpinned = Boolean(ownDoc?.tinh_trang === 'HET_HIEU_LUC' && !pinnedSet.has(khoa(ownDoc.so_hieu)));
    let score = chamDiemKhoi(
      {
        tieuDe: chunk.tieu_de,
        muc: chunk.muc,
        noiDung: chunk.noi_dung,
        tags: chunk.tags,
        refs: effectiveRefs,
        soHieuHits,
        canhBaoHieuLuc: Boolean(chunk.canh_bao_hieu_luc) || ownHetUnpinned,
        loaiTrang: chunk.loai_trang,
        confidence: chunk.confidence,
        laStub: (chunk.tags || []).includes('stub'),
      },
      qInfo,
    );
    if (score === 0) continue;
    const pageBonus = pageScoreMap.get(chunk.slug) ? Math.min(28, Math.round(pageScoreMap.get(chunk.slug) * 0.28)) : 0;
    score += pageBonus;
    if (canHaUuTienTrangWiki(ownDoc, effectiveRefs, store, pinnedSet, qInfo, storeYear)) {
      score = haDiemChuaCoHieuLuc(score);
    }

    const refreshedRefs = lamMoiVanBanLienQuan(effectiveRefs, store, {
      pinnedSet,
      includeReplacements: true,
    });
    const vbHet = refreshedRefs.filter((v) => v.tinh_trang === 'HET_HIEU_LUC');
    let canhBao = null;
    if (chunk.canh_bao_hieu_luc) {
      canhBao = `Cảnh báo hiệu lực: đoạn này dẫn văn bản hết hiệu lực (${vbHet.map((v) => v.so_hieu).join(', ') || 'kiểm tra sổ'}) mà chưa kèm ngữ cảnh lịch sử/thay thế; không dùng làm kết luận quy định hiện hành.`;
    } else if (vbHet.length > 0) {
      canhBao = `Lưu ý: đoạn có nhắc văn bản hết hiệu lực (${vbHet.map((v) => v.so_hieu).join(', ')}) trong ngữ cảnh lịch sử/thay thế; kiểm tra văn bản thay thế hoặc nguồn bậc A.`;
    }

    chunkCandidates.push({
      diem_phu_hop: score,
      loai: 'wiki_chunk',
      chunk_id: chunk.chunk_id,
      slug: chunk.slug,
      duong_dan: chunk.duong_dan,
      loai_trang: chunk.loai_trang,
      tieu_de: chunk.tieu_de,
      muc: chunk.muc,
      noi_dung: chunk.noi_dung,
      tags: chunk.tags || [],
      confidence: chunk.confidence || null,
      canh_bao_hieu_luc: Boolean(chunk.canh_bao_hieu_luc),
      canh_bao: canhBao,
      van_ban_lien_quan: refreshedRefs,
    });
  }

  chunkCandidates.sort((a, b) => b.diem_phu_hop - a.diem_phu_hop);

  // Đa dạng hóa: ưu tiên tối đa 2 chunks cho mỗi trang wiki trước khi lấy tiếp chunk thứ 3 của cùng trang
  const demTheoSlug = new Map();
  const wikiSelected = [];
  const wikiDuPhong = [];
  for (const item of chunkCandidates) {
    const cnt = demTheoSlug.get(item.slug) || 0;
    if (cnt < 2) {
      demTheoSlug.set(item.slug, cnt + 1);
      wikiSelected.push(item);
    } else {
      wikiDuPhong.push(item);
    }
  }
  const topWikiChunks = [...wikiSelected, ...wikiDuPhong].slice(0, maxItems);

  // Nếu có trang wiki-index khớp tiêu đề/tag mà chưa có chunk nào trong wikiSelected (vd trang có 0 chunks), đưa vào danh sách dự phòng
  const matchedChunkSlugs = new Set(chunkCandidates.map((c) => c.slug));
  for (const { trang, score } of pageMatches) {
    if (matchedChunkSlugs.has(trang.slug) || trang.so_chunks > 0) continue;
    const mergedRefs = [...(trang.van_ban_lien_quan || []), ...ownSoHieuForSlug(trang.slug)];
    const refreshedRefs = lamMoiVanBanLienQuan(mergedRefs, store, { pinnedSet, includeReplacements: true });
    topWikiChunks.push({
      diem_phu_hop: score,
      loai: 'wiki_index',
      chunk_id: null,
      slug: trang.slug,
      duong_dan: trang.duong_dan,
      loai_trang: trang.loai_trang,
      tieu_de: trang.tieu_de,
      muc: null,
      noi_dung: null,
      tags: trang.tags || [],
      confidence: trang.confidence || null,
      canh_bao_hieu_luc: Boolean(trang.canh_bao_hieu_luc),
      canh_bao: trang.canh_bao_hieu_luc
        ? 'Cảnh báo hiệu lực: trang wiki dẫn văn bản đã hết hiệu lực.'
        : null,
      van_ban_lien_quan: refreshedRefs,
    });
  }

  // Tập văn bản hiện hành ưu tiên từ top wiki + registry để dẫn hướng chọn điều khoản nguồn A chính xác
  const wikiPoolAll = [...wikiSelected, ...wikiDuPhong];
  const wikiKetQua = topWikiChunks.slice(0, maxItems);
  const registryPoolLimit = Math.max(12, maxItems * 2);
  const registryHits = timTrongRegistry(store, qInfo, soHieuHits, { nhanh, limit: registryPoolLimit, storeYear });

  const relevanceMap = new Map();
  const addRel = (soHieu, delta) => {
    const k = khoa(soHieu);
    if (!k) return;
    relevanceMap.set(k, (relevanceMap.get(k) || 0) + delta);
  };
  for (const sk of soHieuHits) addRel(sk, 500);
  const maxWikiInitScore = wikiKetQua[0]?.diem_phu_hop || 0;
  for (let i = 0; i < Math.min(5, wikiKetQua.length); i += 1) {
    const item = wikiKetQua[i];
    const scoreRatio = maxWikiInitScore > 0 ? Math.min(1, item.diem_phu_hop / maxWikiInitScore) : 1;
    const scale = scoreRatio < 0.7 ? scoreRatio * scoreRatio : scoreRatio;
    const baseWeight = Math.max(10, 45 - i * 8);
    const weight = Math.max(4, Math.round(baseWeight * scale));
    const ownDoc = ownDocForSlug(item.slug);
    const ownK = ownDoc?.so_hieu ? khoa(ownDoc.so_hieu) : null;
    if (ownK) addRel(ownDoc.so_hieu, weight + Math.round(25 * scale));
    const otherRefs = (item.van_ban_lien_quan || []).filter((ref) => khoa(ref.so_hieu) !== ownK);
    const focalConceptBonus = !ownK && otherRefs.length <= 2 ? Math.round(15 * scale) : 0;
    const refWeight = otherRefs.length > 6
      ? Math.max(4, Math.round(weight * Math.min(1, 6 / otherRefs.length)))
      : weight;
    for (const ref of otherRefs) addRel(ref.so_hieu, refWeight + focalConceptBonus);
  }
  const topRegistryHits = registryHits.slice(0, 6);
  const extraRegistryHits = registryHits.slice(6);
  for (const rh of topRegistryHits) addRel(rh.doc.so_hieu, Math.min(24, Math.round(rh.score * 0.1)));
  for (const rh of extraRegistryHits) addRel(rh.doc.so_hieu, Math.min(12, Math.round(rh.score * 0.05)));

  const preferredActiveSet = new Set(soHieuHits);
  for (const [k] of [...relevanceMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)) {
    const doc = chonBanGhi(store.byKhoa.get(k), k);
    if (
      doc &&
      doc.tinh_trang !== 'HET_HIEU_LUC' &&
      !canHaUuTienChuaCoHieuLuc(doc.tinh_trang, doc.hieu_luc_tu, k, pinnedSet, qInfo, storeYear)
    ) {
      preferredActiveSet.add(k);
    }
  }

  // 3. Tìm trên điều khoản NGUYEN_VAN_NGUON_A (đã lọc nhiễu)
  const dkCandidates = [];
  for (const vb of store.dieuKhoan?.nguyen_van_nguon_a || []) {
    const kVb = khoa(vb.so_hieu);
    const docMeta = chonBanGhi(store.byKhoa.get(kVb), kVb);
    if (nhanh && !khopNhanh(nhanh, [{ so_hieu: vb.so_hieu }], docMeta?.nhanh || [], store)) continue;
    const vbTinhTrang = vb.tinh_trang || docMeta?.tinh_trang || null;
    const vbHieuLuc = vb.hieu_luc_tu || docMeta?.hieu_luc_tu || null;
    const haFuture = canHaUuTienChuaCoHieuLuc(vbTinhTrang, vbHieuLuc, kVb, pinnedSet, qInfo, storeYear);
    for (const dk of vb.dieu_khoan || []) {
      const firstLine = String(dk.noi_dung || '').split(/\r?\n/)[0].slice(0, 140);
      let score = chamDiemKhoi(
        {
          tieuDe: `${vb.so_hieu} ${vb.ten || ''}`,
          muc: `Điều ${dk.dieu}${dk.khoan ? ` khoản ${dk.khoan}` : ''}${dk.diem ? ` điểm ${dk.diem}` : ''} ${firstLine}`,
          noiDung: dk.noi_dung,
          tags: docMeta?.nhanh || [],
          refs: [{ so_hieu: vb.so_hieu }],
          soHieuHits,
          preferredActiveSet,
          canhBaoHieuLuc: vbTinhTrang === 'HET_HIEU_LUC',
          loaiTrang: 'NGUYEN_VAN_NGUON_A',
          confidence: 'high',
        },
        qInfo,
      );
      if (score === 0) continue;
      if (haFuture) score = haDiemChuaCoHieuLuc(score);
      dkCandidates.push({
        diem_phu_hop: score,
        loai: 'dieu_khoan_nguon_a',
        tang_tin_cay: 'NGUYEN_VAN_NGUON_A',
        nguyen_van_da_xac_minh: true,
        so_hieu: vb.so_hieu,
        ten_van_ban: vb.ten || null,
        tinh_trang: vb.tinh_trang || null,
        hieu_luc_tu: vb.hieu_luc_tu || null,
        het_hieu_luc_tu: vb.het_hieu_luc_tu || null,
        nguon_a: vb.nguon_a || null,
        dieu: dk.dieu,
        khoan: dk.khoan ?? null,
        diem: dk.diem ?? null,
        noi_dung: dk.noi_dung,
        trang_pdf: dk.trang_pdf ?? null,
        sha256_pdf: dk.sha256_pdf ?? null,
        canh_bao:
          vb.tinh_trang === 'HET_HIEU_LUC'
            ? `Lưu ý: điều khoản thuộc văn bản ${vb.so_hieu} đã HET_HIEU_LUC.`
            : null,
      });
    }
  }
  dkCandidates.sort((a, b) => b.diem_phu_hop - a.diem_phu_hop);
  // Đa dạng hóa tối đa 2 điều khoản cho mỗi văn bản trước khi lấy thêm từ cùng văn bản
  const demDkTheoVb = new Map();
  const dkSelected = [];
  const dkDuPhong = [];
  for (const item of dkCandidates) {
    const k = khoa(item.so_hieu);
    const cnt = demDkTheoVb.get(k) || 0;
    if (cnt < 2) {
      demDkTheoVb.set(k, cnt + 1);
      dkSelected.push(item);
    } else {
      dkDuPhong.push(item);
    }
  }
  const topDieuKhoan = [...dkSelected, ...dkDuPhong].slice(0, Math.min(5, maxItems));

  // 4. Tìm mở rộng tầng TOM_TAT_NHAP khi NGUYEN_VAN_NGUON_A ít hoặc thiếu cho văn bản đích danh (tách mảng riêng!)
  const dkTomTatCandidates = [];
  const pinMissingDka = soHieuHits.some((sk) => !store.dkNguonAByKhoa.has(sk) && store.dkTomTatByKhoa.has(sk));
  if (topDieuKhoan.length < 3 || pinMissingDka) {
    for (const vb of store.dieuKhoan?.tom_tat_nhap || []) {
      const kVb = khoa(vb.so_hieu);
      if (!kVb) continue;
      const docMeta = chonBanGhi(store.byKhoa.get(kVb), kVb);
      if (nhanh && !khopNhanh(nhanh, [{ so_hieu: vb.so_hieu }], docMeta?.nhanh || [], store)) continue;
      const vbTinhTrang = vb.tinh_trang || docMeta?.tinh_trang || null;
      const vbHieuLuc = vb.hieu_luc_tu || docMeta?.hieu_luc_tu || null;
      const haFuture = canHaUuTienChuaCoHieuLuc(vbTinhTrang, vbHieuLuc, kVb, pinnedSet, qInfo, storeYear);
      for (const dk of vb.dieu_khoan || []) {
        const text = `${dk.dieu || ''} ${dk.ten || ''} ${dk.tom_tat || ''} ${(dk.nghia_vu_xnk || []).join(' ')}`;
        let score = chamDiemKhoi(
          {
            tieuDe: `${vb.so_hieu || vb.slug} ${docMeta?.ten || ''}`,
            muc: `${dk.dieu || ''} ${dk.ten || ''}`,
            noiDung: text,
            tags: docMeta?.nhanh || [],
            refs: vb.so_hieu ? [{ so_hieu: vb.so_hieu }] : [],
            soHieuHits,
            preferredActiveSet,
            canhBaoHieuLuc: vbTinhTrang === 'HET_HIEU_LUC',
            loaiTrang: 'NGUYEN_VAN_NGUON_A',
            confidence: 'medium',
          },
          qInfo,
        );
        if (score === 0) continue;
        if (haFuture) score = haDiemChuaCoHieuLuc(score);
        dkTomTatCandidates.push({
          diem_phu_hop: score,
          loai: 'dieu_khoan_tom_tat_nhap',
          tang_tin_cay: 'TOM_TAT_NHAP',
          da_soat: false,
          so_hieu: vb.so_hieu || null,
          slug: vb.slug || null,
          tinh_trang: vb.tinh_trang || docMeta?.tinh_trang || null,
          nguon_a: vb.nguon_a || null,
          dieu: dk.dieu ?? null,
          ten: dk.ten ?? null,
          tom_tat: dk.tom_tat ?? null,
          nghia_vu_xnk: Array.isArray(dk.nghia_vu_xnk) ? dk.nghia_vu_xnk : [],
          canh_bao: CANH_BAO_TOM_TAT_NHAP,
        });
      }
    }
    dkTomTatCandidates.sort((a, b) => b.diem_phu_hop - a.diem_phu_hop);
  }
  const topDieuKhoanNhap = dkTomTatCandidates.slice(0, Math.min(3, maxItems));

  // Gom văn bản liên quan: ghim số hiệu hỏi đích danh -> wiki chunks -> điều khoản nguồn A -> registry hits
  const maxWikiScore = wikiKetQua[0]?.diem_phu_hop || 0;
  const maxDkScore = topDieuKhoan[0]?.diem_phu_hop || 0;
  const rawRefs = [];
  for (const sk of soHieuHits) {
    const doc = chonBanGhi(store.byKhoa.get(sk), sk);
    if (doc) rawRefs.push({ so_hieu: doc.so_hieu, _meta: { khopTrucTiep: true, bonus: 300 } });
  }
  for (const item of wikiKetQua) {
    const ownDoc = ownDocForSlug(item.slug);
    if (ownDoc?.so_hieu && !laTbTchq(ownDoc)) rawRefs.push({ so_hieu: ownDoc.so_hieu });
    if (Array.isArray(item.van_ban_lien_quan)) rawRefs.push(...item.van_ban_lien_quan);
  }
  // Bổ sung tham chiếu từ các chunk wiki đạt ngưỡng cao (tránh rơi VB khi limit=5 cắt bớt ket_qua)
  const wikiExtraLimit = Math.max(maxItems, 12);
  const wikiExtraMinScore = Math.max(85, Math.round(maxWikiScore * 0.5));
  for (let i = wikiKetQua.length; i < Math.min(wikiPoolAll.length, wikiExtraLimit); i += 1) {
    const item = wikiPoolAll[i];
    if (item.diem_phu_hop < wikiExtraMinScore) break;
    const ownDoc = ownDocForSlug(item.slug);
    const ownK = ownDoc?.so_hieu ? khoa(ownDoc.so_hieu) : null;
    if (ownDoc?.so_hieu && !laTbTchq(ownDoc)) {
      rawRefs.push({ so_hieu: ownDoc.so_hieu });
      addRel(ownDoc.so_hieu, 14);
    }
    const otherRefs = (item.van_ban_lien_quan || []).filter((ref) => khoa(ref.so_hieu) !== ownK);
    const refWeight = otherRefs.length > 6
      ? Math.max(3, Math.round(6 * Math.min(1, 6 / otherRefs.length)))
      : 6;
    for (const ref of otherRefs) {
      rawRefs.push(ref);
      addRel(ref.so_hieu, refWeight);
    }
  }
  const dkRelDenom = Math.max(240, Math.round(maxWikiScore * 0.75));
  for (let i = 0; i < topDieuKhoan.length; i += 1) {
    const dk = topDieuKhoan[i];
    if (dk.so_hieu) rawRefs.push({ so_hieu: dk.so_hieu });
    const baseDkWeight = Math.max(25, 65 - i * 8) + (dk.diem_phu_hop >= maxDkScore * 0.85 && dk.diem_phu_hop >= 240 ? 10 : 0);
    const ratio = Math.min(1, dk.diem_phu_hop / dkRelDenom);
    const dkWeight = Math.max(12, Math.round(baseDkWeight * (ratio < 1 ? ratio * ratio : 1)));
    addRel(dk.so_hieu, dkWeight);
  }
  // Bổ sung VB có điều khoản NGUYEN_VAN_NGUON_A đạt ngưỡng cao ngoài top 5
  const dkExtraMinScore = Math.max(90, Math.round(maxDkScore * 0.6));
  const seenDkExtra = new Set(topDieuKhoan.map((d) => khoa(d.so_hieu)));
  for (let i = 0; i < Math.min(dkSelected.length, 16); i += 1) {
    const dk = dkSelected[i];
    if (dk.diem_phu_hop < dkExtraMinScore) break;
    const kDk = khoa(dk.so_hieu);
    if (!kDk || seenDkExtra.has(kDk)) continue;
    seenDkExtra.add(kDk);
    rawRefs.push({ so_hieu: dk.so_hieu });
    addRel(dk.so_hieu, dk.diem_phu_hop >= maxDkScore * 0.85 ? 20 : 14);
  }
  for (const rh of registryHits) {
    rawRefs.push({ so_hieu: rh.doc.so_hieu });
  }

  // Liên kết chuỗi sửa đổi/hướng dẫn còn hiệu lực từ các văn bản top CON_HIEU_LUC có điểm liên quan cao nhất (tối đa 3 bước cho cạnh sửa đổi)
  const topActiveSeeds = [...relevanceMap.entries()]
    .map(([k, rel]) => ({ k, rel, doc: chonBanGhi(store.byKhoa.get(k), k) }))
    .filter((x) => x.doc && (x.doc.tinh_trang === 'CON_HIEU_LUC' || x.doc.tinh_trang === 'HET_HIEU_LUC_MOT_PHAN'))
    .sort((a, b) => b.rel - a.rel)
    .slice(0, 9);
  const maxTopRel = topActiveSeeds[0]?.rel || 0;
  if (maxTopRel > 1) {
    const queryMatchTerms = [...new Set([...(qInfo.specificTokens || []), ...(qInfo.expandedTokens || [])])];
    const bfsQueue = topActiveSeeds.map((s) => ({ ...s, depth: 0 }));
    const visitedSeeds = new Set(topActiveSeeds.map((s) => s.k));
    while (bfsQueue.length > 0) {
      const seed = bfsQueue.shift();
      const seedMainBranches = new Set(
        (seed.doc.nhanh || []).map((n) => String(n).split('/')[0]).filter(Boolean),
      );
      const qhn = seed.doc.quan_he_nguoc || {};
      const qh = seed.doc.quan_he || {};
      const relCandidates = [
        ...(qhn.bi_sua_doi_boi || []).map((e) => ({ so: e?.tu, kind: 'sua_doi' })),
        ...(qh.sua_doi || []).map((e) => ({ so: chuanCanh(e)?.so_hieu, kind: 'sua_doi' })),
        ...(qhn.duoc_huong_dan_boi || []).map((e) => ({ so: e?.tu, kind: 'huong_dan_in' })),
        ...(qh.huong_dan || []).map((e) => ({ so: chuanCanh(e)?.so_hieu, kind: 'huong_dan_out' })),
        // Liên kết bãi bỏ một phần còn hiệu lực (chỉ giữ target CON_HIEU_LUC / HET_HIEU_LUC_MOT_PHAN cùng phạm vi)
        ...(qh.bai_bo || [])
          .map((e) => chuanCanh(e))
          .filter((c) => c?.pham_vi)
          .map((c) => ({ so: c.so_hieu, kind: 'bai_bo_phan' })),
      ];
      // Bổ sung nghị định/văn bản hướng dẫn thi hành trực tiếp văn bản gốc trong cùng nhánh chính (khi YAML thiếu cạnh hướng dẫn)
      if (seed.depth === 0 && (seed.doc.loai === 'LUAT' || seed.doc.loai === 'NGHI_DINH')) {
        const seedTenNorm = chuanHoaVanBan(seed.doc.ten);
        if (seedTenNorm.length >= 10) {
          for (const d of store.registry?.van_ban || []) {
            if (!d?.so_hieu || laTbTchq(d)) continue;
            if (d.tinh_trang !== 'CON_HIEU_LUC' && d.tinh_trang !== 'HET_HIEU_LUC_MOT_PHAN') continue;
            const dTenNorm = chuanHoaVanBan(d.ten);
            if (!dTenNorm.includes(seedTenNorm)) continue;
            if (!/(?:huong dan thi hanh|quy dinh chi tiet)/.test(dTenNorm)) continue;
            if ((d.nhanh || []).some((n) => (seed.doc.nhanh || []).includes(n))) {
              relCandidates.push({ so: d.so_hieu, kind: 'huong_dan_in' });
            }
          }
        }
      }
      for (const { so, kind } of relCandidates) {
        const relK = khoa(so);
        if (!relK) continue;
        const relDoc = chonBanGhi(store.byKhoa.get(relK), relK);
        if (!relDoc) continue;
        if (relDoc.tinh_trang !== 'CON_HIEU_LUC' && relDoc.tinh_trang !== 'HET_HIEU_LUC_MOT_PHAN') continue;
        if (nhanh && !khopNhanh(nhanh, [{ so_hieu: relDoc.so_hieu }], relDoc.nhanh || [], store)) continue;
        const relHay = chuanHoaVanBan(
          `${relDoc.so_hieu} ${relDoc.ten || ''} ${(relDoc.nhanh || []).join(' ')} ${relDoc.ghi_chu || ''}`,
        );
        const relWords = new Set(relHay.split(/[^a-z0-9]+/).filter(Boolean));
        const matchesSpec = queryMatchTerms.some(
          (t) => relWords.has(t) || (t.length >= 5 && relHay.includes(t)),
        );
        const sameMainBranch = (relDoc.nhanh || []).some((n) =>
          seedMainBranches.has(String(n).split('/')[0]),
        );
        const sameExactBranch = (relDoc.nhanh || []).some((n) => (seed.doc.nhanh || []).includes(n));
        let okRel = false;
        if (seed.depth === 0) {
          if (kind === 'sua_doi' || kind === 'huong_dan_out') {
            okRel = matchesSpec || sameMainBranch;
          } else if (kind === 'bai_bo_phan') {
            okRel = sameExactBranch || (sameMainBranch && matchesSpec);
          } else {
            okRel = matchesSpec || (sameMainBranch && sameExactBranch);
          }
        } else if (seed.depth === 1) {
          okRel =
            kind === 'sua_doi' || kind === 'huong_dan_out'
              ? sameMainBranch
              : (sameMainBranch && sameExactBranch);
        } else {
          // Bước 3 chỉ theo cạnh sửa đổi trực tiếp trong cùng nhánh chính (vd 121/2025 -> 38/2015 -> 08/2015 -> 167/2025)
          okRel = kind === 'sua_doi' && sameMainBranch;
        }
        if (!okRel) continue;
        rawRefs.push({ so_hieu: relDoc.so_hieu });
        const existingRel = relevanceMap.get(relK) || 0;
        const decay = seed.depth === 0 ? 0.38 : seed.depth === 1 ? 0.55 : 0.6;
        const cap = Math.max(1, maxTopRel - 1 - seed.depth);
        const linkedBonus = Math.min(Math.max(6, Math.round(seed.rel * decay)), cap);
        if (existingRel < linkedBonus) {
          relevanceMap.set(relK, linkedBonus);
        }
        if (seed.depth < 2 && !visitedSeeds.has(relK)) {
          visitedSeeds.add(relK);
          bfsQueue.push({ k: relK, rel: Math.max(existingRel, linkedBonus), doc: relDoc, depth: seed.depth + 1 });
        }
      }
    }
  }

  const vanBanLienQuan = lamMoiVanBanLienQuan(rawRefs, store, {
    pinnedSet,
    relevanceMap,
    includeReplacements: true,
  });

  const canhBaoList = [];
  for (const item of [...wikiKetQua, ...topDieuKhoan]) {
    if (item.canh_bao && !canhBaoList.includes(item.canh_bao)) canhBaoList.push(item.canh_bao);
  }
  for (const vb of vanBanLienQuan) {
    if (vb.tinh_trang === 'HET_HIEU_LUC' && vb.canh_bao && !canhBaoList.includes(vb.canh_bao)) {
      canhBaoList.push(vb.canh_bao);
    }
    if (vb.khop_so_hieu_truc_tiep && vb.chua_co_toan_van_trong_kho) {
      const msg = `Văn bản ${vb.so_hieu} đã có trong sổ đăng ký nhưng chưa được ingest wiki/điều khoản chi tiết trong kho; cần đối chiếu hoặc tải trực tiếp nguồn bậc A.`;
      if (!canhBaoList.includes(msg)) canhBaoList.push(msg);
    }
  }
  if (soHieuThieuTrongSo.length > 0) {
    canhBaoList.push(`Chưa có số hiệu ${soHieuThieuTrongSo.join(', ')} trong sổ đăng ký oz-wiki-plhq.`);
  }

  // Đánh giá độ tin cậy & hợp đồng gợi ý dự phòng chống trả lời rỗng / chống bịa luật
  const coPinnedThieuToanVan = vanBanLienQuan.some((v) => v.khop_so_hieu_truc_tiep && v.chua_co_toan_van_trong_kho);
  const coPinnedCoTriThuc = soHieuHits.some((sk) => {
    const d = chonBanGhi(store.byKhoa.get(sk), sk);
    return d && !kiemVanBanChuaCoToanVan(d, store);
  });
  const coHieuLucHienHanh = vanBanLienQuan.some((v) => v.tinh_trang !== 'HET_HIEU_LUC');

  let doTinCay = 'KHONG_TIM_THAY';
  if (soHieuThieuTrongSo.length > 0 && soHieuHits.length === 0) {
    doTinCay = 'KHONG_TIM_THAY';
  } else if (coPinnedThieuToanVan && !coPinnedCoTriThuc) {
    doTinCay = (wikiKetQua.length > 0 || topDieuKhoan.length > 0 || topDieuKhoanNhap.length > 0) ? 'TRUNG_BINH' : 'THAP';
  } else if (maxWikiScore >= 110 || maxDkScore >= 100 || (coPinnedCoTriThuc && (wikiKetQua.length > 0 || topDieuKhoan.length > 0))) {
    doTinCay = 'CAO';
  } else if (wikiKetQua.length > 0 || topDieuKhoan.length > 0 || topDieuKhoanNhap.length > 0 || coHieuLucHienHanh) {
    doTinCay = 'TRUNG_BINH';
  } else if (vanBanLienQuan.length > 0) {
    doTinCay = 'THAP';
  }

  const urlsBacAGoiY = [];
  for (const v of vanBanLienQuan) {
    for (const u of v.nguon_bac_a || []) {
      if (!urlsBacAGoiY.includes(u)) urlsBacAGoiY.push(u);
      if (urlsBacAGoiY.length >= 5) break;
    }
    if (urlsBacAGoiY.length >= 5) break;
  }

  const canDuPhong = doTinCay === 'THAP' || doTinCay === 'KHONG_TIM_THAY' || coPinnedThieuToanVan;
  const goiYDuPhong = canDuPhong
    ? {
        can_tra_nguon_truc_tiep: true,
        cong_cu_de_xuat: 'tim_van_ban_lop_2',
        can_mo_the_bo_sung_so: doTinCay === 'KHONG_TIM_THAY' || soHieuThieuTrongSo.length > 0 || coPinnedThieuToanVan,
        url_nguon_bac_a_goi_y: urlsBacAGoiY,
        ly_do:
          doTinCay === 'KHONG_TIM_THAY'
            ? 'Không tìm thấy văn bản/điều khoản khớp trong kho oz-wiki-plhq — chuyển sang tim_van_ban lớp (ii) tìm nguồn .gov.vn và mở thẻ [BỔ SUNG SỔ], tuyệt đối không suy diễn.'
            : 'Văn bản đã nhận diện trong sổ nhưng chưa đủ điều khoản/wiki chi tiết (hoặc độ khớp thấp) — cần tra trực tiếp URL nguồn bậc A qua tim_van_ban lớp (ii).',
      }
    : null;

  return {
    cau_hoi: String(cauHoi || ''),
    nhanh: nhanh || null,
    chuyen_huong: null,
    tong: wikiKetQua.length,
    ket_qua: wikiKetQua,
    trang_wiki_lien_quan: pageMatches.slice(0, maxItems).map(({ trang, score }) => ({
      slug: trang.slug,
      duong_dan: trang.duong_dan,
      loai_trang: trang.loai_trang,
      tieu_de: trang.tieu_de,
      confidence: trang.confidence || null,
      canh_bao_hieu_luc: Boolean(trang.canh_bao_hieu_luc),
      diem_phu_hop: score,
    })),
    dieu_khoan_nguon_a: topDieuKhoan,
    dieu_khoan_tom_tat_nhap: topDieuKhoanNhap,
    van_ban_lien_quan: vanBanLienQuan,
    canh_bao: canhBaoList,
    do_tin_cay_tra_loi: doTinCay,
    pham_vi_du_lieu: PHAM_VI_DU_LIEU_PLHQ,
    goi_y_du_phong: goiYDuPhong,
    ghi_nguon: GHI_NGUON_CC_BY,
    mien_tru: MIEN_TRU_PHAP_LY,
  };
}

function chuanHoaPhuLucCas(phuLuc) {
  if (!phuLuc) return null;
  const s = String(phuLuc).trim().toUpperCase().replace(/^PHỤ\s*LỤC\s+/i, '').replace(/^PHU\s*LUC\s+/i, '');
  const mapSo = { '1': 'I', '2': 'II', '3': 'III', '4': 'IV' };
  return mapSo[s] || s;
}

/**
 * Tra cứu danh mục hóa chất theo mã CAS, tên chất, mã hóa chất, công thức (gồm cả `khong_co_cas` NĐ 24/2026/NĐ-CP).
 */
export function traHoaChatCas(store, query, { phu_luc, limit = 20 } = {}) {
  const maxItems = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 20;
  const qRaw = String(query || '').trim();
  const plFilter = chuanHoaPhuLucCas(phu_luc);

  if (!qRaw && !plFilter) {
    return {
      truy_van: query ?? null,
      phu_luc: null,
      tong: 0,
      ket_qua: [],
      luu_y: 'Cần cung cấp mã CAS, tên chất, mã hóa chất, công thức hoặc bộ lọc Phụ lục (I..IV).',
      ghi_nguon: GHI_NGUON_CC_BY,
      mien_tru: MIEN_TRU_PHAP_LY,
    };
  }

  const THU_TU_PL = { I: 1, II: 2, III: 3, IV: 4 };
  const qNorm = chuanHoaVanBan(qRaw);
  const qCompact = qNorm.replace(/\s+/g, '');
  const qTokens = tachTuKhoa(qRaw).allTokens;

  // Khớp chính xác mã CAS trước nếu query là khóa trực tiếp trong theo_cas
  const theoCas = store.casIndex?.theo_cas || {};
  const exactCasHits = qRaw && Array.isArray(theoCas[qRaw]) ? theoCas[qRaw] : null;

  let scored = [];
  if (exactCasHits) {
    scored = exactCasHits
      .filter((item) => !plFilter || item.phu_luc === plFilter)
      .map((item) => ({ ...item, _score: 200 }));
  } else {
    for (const item of store.allCasEntries || []) {
      if (plFilter && item.phu_luc !== plFilter) continue;
      if (!qNorm) {
        scored.push({ ...item, _score: 10 });
        continue;
      }

      const casStr = String(item.cas || '').trim().toLowerCase();
      const tenNorm = chuanHoaVanBan(item.ten_chat);
      const maNorm = chuanHoaVanBan(item.ma_hoa_chat);
      const congThucNorm = chuanHoaVanBan(item.cong_thuc).replace(/\s+/g, '');

      let score = 0;
      if (casStr) {
        if (casStr === qNorm) score = Math.max(score, 200);
        else if (casStr.startsWith(qNorm)) score = Math.max(score, 140);
        else if (casStr.includes(qNorm)) score = Math.max(score, 100);
      }
      if (congThucNorm) {
        if (congThucNorm === qCompact) score = Math.max(score, 160);
        else if (congThucNorm.includes(qCompact) && qCompact.length >= 2) score = Math.max(score, 90);
      }
      if (tenNorm === qNorm || maNorm === qNorm) score = Math.max(score, 150);
      else if (tenNorm.includes(qNorm) || maNorm.includes(qNorm)) score = Math.max(score, 110);
      else if (qTokens.length > 0) {
        const hay = `${casStr} ${tenNorm} ${maNorm} ${congThucNorm}`;
        if (qTokens.every((t) => hay.includes(t))) score = Math.max(score, 70);
      }

      if (score > 0) {
        // Bù nhẹ cho kết quả không có CAS khi khớp tên nhóm chất (Diisocyanate, Amalgam...)
        if (!item.cas) score += 1;
        scored.push({ ...item, _score: score });
      }
    }
  }

  scored.sort(
    (a, b) =>
      b._score - a._score ||
      (THU_TU_PL[a.phu_luc] || 9) - (THU_TU_PL[b.phu_luc] || 9) ||
      String(a.ten_chat || '').localeCompare(String(b.ten_chat || '')),
  );

  const tongTruocGioiHan = scored.length;
  const ketQua = scored.slice(0, maxItems).map(({ _score, ...rest }) => rest);

  return {
    truy_van: qRaw || null,
    phu_luc: plFilter,
    tong: ketQua.length,
    tong_truoc_gioi_han: tongTruocGioiHan,
    ket_qua: ketQua,
    luu_y:
      ketQua.length > 0
        ? 'Một mã CAS có thể đồng thời nằm ở nhiều Phụ lục (I–IV). Kiểm tra quy tắc ngưỡng/hỗn hợp trong văn bản gốc nguồn bậc A trước khi áp dụng.'
        : null,
    ghi_nguon: GHI_NGUON_CC_BY,
    mien_tru: MIEN_TRU_PHAP_LY,
  };
}

/**
 * Tra văn bản chính sách / KTCN / giấy phép theo mã HS ĐÃ BIẾT trên `hs-index-theo-ma.json`.
 * Không phân loại HS hay tính thuế suất (thuộc hs-code-api).
 */
export function traChinhSachTheoMaHs(store, maHs, { limit = 25 } = {}) {
  const maxItems = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 25;
  const maChuan = String(maHs || '').replace(/[.\s-]/g, '').trim();

  if (!/^\d{4,8}$/.test(maChuan)) {
    return {
      ma_hs: maChuan || null,
      ma_hs_goc: maHs ?? null,
      ranh_gioi: RANH_GIOI_HS_DA_BIET,
      loi: 'Mã HS tra cứu chính sách phải là 4 đến 8 chữ số (mã HS đã biết, bỏ dấu chấm). Nếu chưa có mã HS, hãy chuyển sang hs-code-api để phân loại.',
      tong: 0,
      ket_qua: [],
      ghi_nguon: GHI_NGUON_CC_BY,
      mien_tru: MIEN_TRU_PHAP_LY,
    };
  }

  const maMap = store.hsIndexTheoMa?.ma || {};
  const matchedKeys = [];

  for (const k of Object.keys(maMap)) {
    if (k === maChuan) {
      matchedKeys.push({ khoa_hs: k, pham_vi_khop: 'TRUNG_KHOP', uu_tien: 1 });
    } else if (maChuan.startsWith(k)) {
      matchedKeys.push({ khoa_hs: k, pham_vi_khop: 'TIEN_TO_CHA', uu_tien: 2 });
    } else if (k.startsWith(maChuan)) {
      matchedKeys.push({ khoa_hs: k, pham_vi_khop: 'MA_CON', uu_tien: 3 });
    }
  }

  matchedKeys.sort((a, b) => {
    if (a.uu_tien !== b.uu_tien) return a.uu_tien - b.uu_tien;
    if (a.uu_tien === 2) return b.khoa_hs.length - a.khoa_hs.length || a.khoa_hs.localeCompare(b.khoa_hs);
    return a.khoa_hs.length - b.khoa_hs.length || a.khoa_hs.localeCompare(b.khoa_hs);
  });

  const items = [];
  const ngoaiBieuThue = [];
  for (const { khoa_hs, pham_vi_khop } of matchedKeys) {
    const laNgoaiBieuThue = store.canhBaoMaSet.has(khoa_hs);
    if (laNgoaiBieuThue) ngoaiBieuThue.push(khoa_hs);

    for (const edge of maMap[khoa_hs] || []) {
      const doc = chonBanGhi(store.byKhoa.get(khoa(edge.so_hieu)), khoa(edge.so_hieu));
      const nguonBacA = doc ? locNguonBacA(doc, store.nguonUyTin) : [];
      items.push({
        khoa_hs,
        ma_nhom: khoa_hs,
        pham_vi_khop,
        ngoai_bieu_thue: laNgoaiBieuThue,
        so_hieu: edge.so_hieu,
        slug: edge.slug,
        ten: edge.ten,
        tinh_trang: doc?.tinh_trang || edge.tinh_trang,
        hieu_luc_tu: doc?.hieu_luc_tu ?? edge.hieu_luc_tu ?? null,
        het_hieu_luc_tu: doc?.het_hieu_luc_tu ?? edge.het_hieu_luc_tu ?? null,
        hieu_luc_da_doi_chieu: doc ? doc.xac_minh?.hieu_luc_da_doi_chieu === true : Boolean(edge.hieu_luc_da_doi_chieu),
        loai_tac_dong: edge.loai_tac_dong,
        muc_rui_ro: edge.muc_rui_ro || null,
        dieu_kien: edge.dieu_kien || null,
        nhom: edge.nhom || null,
        phu_luc: edge.phu_luc || null,
        nguon_bac_a: nguonBacA,
      });
    }
  }

  const ketQua = items.slice(0, maxItems);
  const canhBao = [];
  if (ngoaiBieuThue.length > 0) {
    canhBao.push(
      `Cảnh báo canh_bao_ma: khóa ${ngoaiBieuThue.join(', ')} không có trong biểu thuế đối chiếu (có thể là mã AHTN cũ hoặc trích lệch) — dừng và đối chiếu lại văn bản gốc.`,
    );
  }
  if (items.some((x) => x.tinh_trang === 'HET_HIEU_LUC')) {
    canhBao.push('Có văn bản đã HET_HIEU_LUC trong kết quả — kiểm tra văn bản thay thế trước khi áp dụng.');
  }
  if (items.some((x) => !x.hieu_luc_da_doi_chieu)) {
    canhBao.push('Có văn bản chưa đối chiếu hiệu lực nguồn bậc A (hieu_luc_da_doi_chieu: false).');
  }

  const tl8 = store.hsIndexTheoMa?.tien_le_tb_tchq?.theo_ma_8?.[maChuan] || null;
  const tl4 = maChuan.length >= 4 ? store.hsIndexTheoMa?.tien_le_tb_tchq?.theo_nhom_4?.[maChuan.slice(0, 4)] || null : null;

  return {
    ma_hs: maChuan,
    ranh_gioi: RANH_GIOI_HS_DA_BIET,
    tong_khoa_khop: matchedKeys.length,
    tong_truoc_gioi_han: items.length,
    tong: ketQua.length,
    canh_bao_ma: ngoaiBieuThue,
    canh_bao_ngoai_bieu_thue: ngoaiBieuThue,
    canh_bao: canhBao,
    mat_do_tb_tchq_tham_khao: tl8 || tl4
      ? {
          ma_8: tl8,
          nhom_4: tl4,
          ghi_chu: 'Chỉ số mật độ tham khảo bậc C; tra cứu chi tiết tiền lệ thuộc hs-code-api.',
        }
      : null,
    ket_qua: ketQua,
    ghi_nguon: GHI_NGUON_CC_BY,
    mien_tru: MIEN_TRU_PHAP_LY,
  };
}

function parseNgayUtcMs(ymd) {
  const m = String(ymd || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const ms = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isFinite(ms) ? ms : null;
}

/**
 * Liệt kê văn bản có `het_hieu_luc_tu` trong vòng `<= trong_so_ngay` ngày tính từ `hom_nay`,
 * sắp tăng dần theo ngày hết hiệu lực.
 */
export function lietKeSapHetHieuLuc(store, { trong_so_ngay = 60, hom_nay } = {}) {
  const ngayMoc = String(hom_nay || store.phien_ban || homNay()).trim();
  const mocMs = parseNgayUtcMs(ngayMoc);
  const soNgay = Number.isFinite(Number(trong_so_ngay)) ? Math.max(0, Number(trong_so_ngay)) : 60;

  if (mocMs === null) {
    return {
      hom_nay: ngayMoc,
      trong_so_ngay: soNgay,
      loi: `Ngày mốc không hợp lệ (cần YYYY-MM-DD): "${ngayMoc}".`,
      tong: 0,
      ket_qua: [],
      ghi_nguon: GHI_NGUON_CC_BY,
      mien_tru: MIEN_TRU_PHAP_LY,
    };
  }

  const ds = [];
  for (const doc of store.registry?.van_ban || []) {
    if (!doc.het_hieu_luc_tu) continue;
    const expMs = parseNgayUtcMs(doc.het_hieu_luc_tu);
    if (expMs === null) continue;
    const conLai = Math.round((expMs - mocMs) / 86400000);
    if (conLai < 0 || conLai > soNgay) continue;

    const ng = doc.quan_he_nguoc || {};
    ds.push({
      so_hieu: doc.so_hieu,
      loai: doc.loai || null,
      ten: doc.ten || null,
      co_quan: doc.co_quan || null,
      tinh_trang: doc.tinh_trang || 'CHUA_XAC_MINH',
      hieu_luc_tu: doc.hieu_luc_tu || null,
      het_hieu_luc_tu: doc.het_hieu_luc_tu,
      so_ngay_con_lai: conLai,
      con_lai_ngay: conLai,
      hieu_luc_da_doi_chieu: doc.xac_minh?.hieu_luc_da_doi_chieu === true,
      bi_thay_the_boi: [...new Set((ng.bi_thay_the_boi || []).map((e) => e.tu))],
      bi_bai_bo_boi: [...new Set((ng.bi_bai_bo_boi || []).map((e) => e.tu))],
      nguon_bac_a: locNguonBacA(doc, store.nguonUyTin),
      ghi_chu: doc.ghi_chu || null,
    });
  }

  ds.sort((a, b) => a.het_hieu_luc_tu.localeCompare(b.het_hieu_luc_tu) || a.so_hieu.localeCompare(b.so_hieu));

  return {
    hom_nay: ngayMoc,
    trong_so_ngay: soNgay,
    tong: ds.length,
    ket_qua: ds,
    ghi_nguon: GHI_NGUON_CC_BY,
    mien_tru: MIEN_TRU_PHAP_LY,
  };
}
