// Unit test bộ dựng cổng web tra cứu tĩnh V2 (tools/dung-web.mjs & tools/web-template/*).
// Mọi kiểm thử chỉ ghi vào tmpdir() rồi dọn sạch qua rmSync — tuyệt đối không ghi vào site/ hay dist/.
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import vm from 'node:vm';
import { ROOT, LUOC_DO_PHIEN_BAN } from '../lib/registry.mjs';
import { COT, COT_CAS } from '../lib/danh-muc.mjs';
import { dungWeb, rutGonRegistry, rutGonHsPolicy, tinhSapHetHieuLuc } from '../dung-web.mjs';

let pass = 0;
let fail = 0;
const t = (name, cond, extra = '') => {
  if (cond) {
    pass += 1;
    console.log(`PASS ${name}`);
  } else {
    fail += 1;
    console.log(`FAIL ${name} ${extra}`);
  }
};

const tmpDirs = [];
const makeTmp = (prefix) => {
  const d = mkdtempSync(join(tmpdir(), prefix));
  tmpDirs.push(d);
  return d;
};

const RE_CDN_CAM = /https?:\/\/cdn|unpkg\.com|jsdelivr\.net|fonts\.googleapis\.com|cdnjs\.cloudflare\.com|<script\b[^>]*\bsrc=["']https?:|<link\b[^>]*\bhref=["']https?:/i;

function decodeHtmlAttr(str) {
  return String(str || '')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function parseAttrs(attrText) {
  const attrs = {};
  const re = /([a-zA-Z0-9_-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let m;
  while ((m = re.exec(attrText)) !== null) {
    const key = m[1];
    const val = m[2] ?? m[3] ?? m[4] ?? '';
    attrs[key] = decodeHtmlAttr(val);
  }
  return attrs;
}

function makeEl(initialId = '', initialTag = 'div', initialAttrs = {}, onHtmlUpdate = null) {
  let innerHtmlValue = '';
  let childNodes = [];
  const classSet = new Set(String(initialAttrs.class || '').split(/\s+/).filter(Boolean));
  const attrs = { ...initialAttrs };
  if (initialId) attrs.id = initialId;

  const el = {
    id: initialId,
    tagName: initialTag.toUpperCase(),
    textContent: '',
    value: '',
    checked: false,
    hidden: Object.prototype.hasOwnProperty.call(initialAttrs, 'hidden'),
    options: [{ value: '' }],
    attributes: attrs,
    listeners: {},
    classList: {
      add(...names) { names.forEach((n) => n && classSet.add(n)); },
      remove(...names) { names.forEach((n) => classSet.delete(n)); },
      toggle(name, force) {
        if (force === undefined) {
          if (classSet.has(name)) classSet.delete(name);
          else classSet.add(name);
          return classSet.has(name);
        }
        if (force) classSet.add(name);
        else classSet.delete(name);
        return Boolean(force);
      },
      contains(name) { return classSet.has(name); },
    },
    setAttribute(k, v) { this.attributes[k] = String(v); },
    getAttribute(k) { return this.attributes[k] ?? null; },
    addEventListener(ev, fn) { (this.listeners[ev] ||= []).push(fn); },
    appendChild(child) { this.options.push(child); },
    querySelectorAll(sel) {
      return childNodes.filter((node) => matchesSimpleSelector(node, sel));
    },
  };

  Object.defineProperty(el, 'innerHTML', {
    get() { return innerHtmlValue; },
    set(val) {
      innerHtmlValue = String(val ?? '');
      childNodes = [];
      const tagRe = /<(button|a|article|div|span)\b([^>]*)>/gi;
      let m;
      while ((m = tagRe.exec(innerHtmlValue)) !== null) {
        const tag = m[1].toLowerCase();
        const parsed = parseAttrs(m[2]);
        const child = makeEl(parsed.id || '', tag, parsed, null);
        childNodes.push(child);
        if (onHtmlUpdate && parsed.id) onHtmlUpdate(parsed.id, child);
      }
    },
  });

  return el;
}

function matchesSimpleSelector(node, sel) {
  const s = String(sel || '').trim();
  if (!s) return false;
  const tagMatch = s.match(/^([a-zA-Z0-9_-]+)/);
  if (tagMatch && node.tagName.toLowerCase() !== tagMatch[1].toLowerCase()) return false;
  const classMatches = [...s.matchAll(/\.([a-zA-Z0-9_-]+)/g)].map((m) => m[1]);
  for (const c of classMatches) {
    if (!node.classList.contains(c)) return false;
  }
  const attrMatches = [...s.matchAll(/\[([a-zA-Z0-9_-]+)(?:=["']([^"']*)["'])?\]/g)];
  for (const am of attrMatches) {
    const k = am[1];
    const v = am[2];
    if (node.attributes[k] === undefined) return false;
    if (v !== undefined && node.attributes[k] !== v) return false;
  }
  return true;
}

async function runAppInVm(siteDir, { initialHash = '' } = {}) {
  const html = readFileSync(join(siteDir, 'index.html'), 'utf8');
  const js = readFileSync(join(siteDir, 'app.js'), 'utf8');

  const elMap = new Map();
  const dynamicById = new Map();
  const onDynamic = (id, node) => dynamicById.set(id, node);

  for (const m of html.matchAll(/<([a-zA-Z0-9]+)\b([^>]*\bid="([^"]+)"[^>]*)>/g)) {
    const tag = m[1].toLowerCase();
    const parsed = parseAttrs(m[2]);
    const id = m[3];
    elMap.set(id, makeEl(id, tag, parsed, onDynamic));
  }

  const tabBtns = ['hieu-luc', 'wiki', 'dieu-khoan', 'cas', 'chinh-sach-hs'].map((tab) => {
    const existing = elMap.get(`btn-tab-${tab}`) || makeEl(`btn-tab-${tab}`, 'button', { 'data-tab': tab }, onDynamic);
    existing.setAttribute('data-tab', tab);
    return existing;
  });
  const panels = ['hieu-luc', 'wiki', 'dieu-khoan', 'cas', 'chinh-sach-hs'].map((tab) => {
    return elMap.get(`panel-${tab}`) || makeEl(`panel-${tab}`, 'section', {}, onDynamic);
  });
  const hsSampleBtns = [...html.matchAll(/<button\b([^>]*\bdata-hs-sample="([^"]+)"[^>]*)>/g)].map((m) => {
    return makeEl('', 'button', parseAttrs(m[1]), onDynamic);
  });

  const docListeners = {};
  const winListeners = {};
  const clipboardWrites = [];
  const fetchedUrls = [];
  const locationObj = {
    protocol: 'https:',
    href: `https://ozvietnam.github.io/oz-wiki-plhq/${initialHash}`,
    hash: initialHash,
  };
  const updateLocationHash = (url) => {
    const str = String(url || '');
    const idx = str.indexOf('#');
    const h = idx >= 0 ? str.slice(idx) : '';
    locationObj.hash = h;
    locationObj.href = `https://ozvietnam.github.io/oz-wiki-plhq/${h}`;
  };

  const sandbox = {
    console,
    URL,
    Number,
    String,
    Array,
    Object,
    Map,
    Set,
    Boolean,
    Promise,
    encodeURIComponent,
    decodeURIComponent,
    setTimeout: (fn, ms) => {
      const id = setTimeout(fn, ms);
      if (typeof id?.unref === 'function') id.unref();
      return id;
    },
    clearTimeout,
    navigator: {
      clipboard: {
        async writeText(text) {
          clipboardWrites.push(String(text));
        },
      },
    },
    history: {
      replaceState(_s, _t, url) { updateLocationHash(url); },
      pushState(_s, _t, url) { updateLocationHash(url); },
    },
    window: {
      location: locationObj,
      scrollTo() {},
      addEventListener(ev, fn) { (winListeners[ev] ||= []).push(fn); },
    },
    document: {
      body: makeEl('body', 'body'),
      createElement(tag) { return makeEl(tag, tag); },
      getElementById(id) { return elMap.get(id) || dynamicById.get(id) || null; },
      querySelectorAll(sel) {
        if (sel === '.tab-btn') return tabBtns;
        if (sel === '.tab-panel') return panels;
        if (sel === '[data-hs-sample]') return hsSampleBtns;
        return [];
      },
      addEventListener(ev, fn) { (docListeners[ev] ||= []).push(fn); },
    },
    fetch: async (path) => {
      fetchedUrls.push(String(path));
      const fullPath = join(siteDir, path);
      if (!existsSync(fullPath)) {
        return { ok: false, status: 404, json: async () => ({}) };
      }
      return {
        ok: true,
        status: 200,
        json: async () => JSON.parse(readFileSync(fullPath, 'utf8')),
      };
    },
  };

  vm.runInNewContext(js, sandbox);
  await docListeners.DOMContentLoaded[0]();
  const flush = () => new Promise((r) => setTimeout(r, 25));
  await flush();

  return {
    elMap,
    dynamicById,
    tabBtns,
    panels,
    hsSampleBtns,
    clipboardWrites,
    fetchedUrls,
    locationObj,
    flush,
    async triggerHashChange(newHash) {
      locationObj.hash = newHash;
      locationObj.href = `https://ozvietnam.github.io/oz-wiki-plhq/${newHash}`;
      for (const fn of winListeners.hashchange || []) {
        await fn();
      }
      await flush();
    },
    async clickTab(tabName) {
      const btn = tabBtns.find((b) => b.getAttribute('data-tab') === tabName);
      if (btn?.listeners.click?.[0]) {
        await btn.listeners.click[0]();
        await flush();
      }
    },
  };
}

try {
  // 1. Dựng từ mock distDir (kèm dữ liệu nhạy cảm/cồng kềnh & tệp ngoài ranh giới HS để kiểm lọc)
  const mockDist = makeTmp('oz-web-dist-');
  const outMock = makeTmp('oz-web-out1-');

  const mockReg = {
    phien_ban: '2026-11-21',
    luoc_do_phien_ban: LUOC_DO_PHIEN_BAN,
    giay_phep: 'CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/',
    tong: 2,
    van_ban: [
      {
        so_hieu: '85/2026/TT-BTC',
        slug: '85-2026-tt-btc',
        loai: 'THONG_TU',
        ten: 'Quy định về phân loại hàng hóa xuất nhập khẩu',
        co_quan: 'BTC',
        ngay_ban_hanh: '2026-08-01',
        hieu_luc_tu: '2026-09-15',
        het_hieu_luc_tu: null,
        tinh_trang: 'CON_HIEU_LUC',
        nhanh: ['phan-loai-hs'],
        bac_nguon_cao_nhat: 'A',
        toan_van: 'raw/download/85-2026-tt-btc.pdf',
        danh_muc_hs: { tep: 'danh-muc/85.csv' },
        xac_minh: {
          muc: 'NGUON_A',
          hieu_luc_da_doi_chieu: true,
          ngay: '2026-10-10',
          boi: 'internal-agent',
          pham_vi: 'Ghi chú nội bộ dài',
          nguon_rieng_tu: { wco_compendium: 'nội bộ hs-code-api' },
          dieu_khoan: [{ dieu: 4, noi_dung: 'Trích thử' }],
        },
        quan_he: { thay_the: [{ so_hieu: '14/2015/TT-BTC', tu_ngay: '2026-09-15' }] },
        quan_he_nguoc: {},
        nguon: [{ url: 'https://congbao.chinhphu.vn/van-ban/85-2026-tt-btc', truy_cap: '2026-10-10' }],
      },
      {
        so_hieu: '14/2015/TT-BTC',
        slug: '14-2015-tt-btc',
        loai: 'THONG_TU',
        ten: 'Hướng dẫn phân loại hàng hóa cũ',
        co_quan: 'BTC',
        tinh_trang: 'HET_HIEU_LUC',
        het_hieu_luc_tu: '2026-09-15',
        nhanh: ['phan-loai-hs'],
        xac_minh: { muc: 'NGUON_A', hieu_luc_da_doi_chieu: true, ngay: '2026-10-10' },
        quan_he: {},
        quan_he_nguoc: {
          bi_thay_the_boi: [{ tu: '85/2026/TT-BTC', quan_he: 'thay_the', so_hieu: '14/2015/TT-BTC', tu_ngay: '2026-09-15' }],
        },
        nguon: [{ url: 'https://vanban.chinhphu.vn/?docid=178999', truy_cap: '2026-10-10' }],
      },
    ],
  };

  const mockWikiIndex = {
    phien_ban: '2026-11-21',
    luoc_do_phien_ban: LUOC_DO_PHIEN_BAN,
    giay_phep: 'CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/',
    ghi_nguon_chuan: 'Nguồn: oz-wiki-plhq',
    mien_tru: 'Tham khảo.',
    tong: 1,
    trang: [
      {
        slug: 'phan-loai-hang',
        duong_dan: 'wiki/summary/phan-loai-hang.md',
        loai_trang: 'summary',
        tieu_de: 'Phân loại hàng hóa XNK',
        created: '2026-10-10',
        updated: '2026-11-21',
        tags: ['phan-loai-hs'],
        confidence: 'high',
        so_chunks: 1,
        van_ban_lien_quan: [{ so_hieu: '85/2026/TT-BTC', tinh_trang: 'CON_HIEU_LUC', bi_thay_the_boi: [], bi_bai_bo_boi: [] }],
        canh_bao_hieu_luc: false,
      },
    ],
  };

  const mockWikiChunks = {
    phien_ban: '2026-11-21',
    luoc_do_phien_ban: LUOC_DO_PHIEN_BAN,
    giay_phep: 'CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/',
    ghi_nguon_chuan: 'Nguồn: oz-wiki-plhq',
    mien_tru: 'Tham khảo.',
    tong: 1,
    chunks: [
      {
        chunk_id: 'phan-loai-hang#1',
        slug: 'phan-loai-hang',
        duong_dan: 'wiki/summary/phan-loai-hang.md',
        loai_trang: 'summary',
        tieu_de: 'Phân loại hàng hóa XNK',
        muc: 'Nguyên tắc',
        noi_dung: 'Áp dụng TT 85/2026/TT-BTC.',
        tags: ['phan-loai-hs'],
        confidence: 'high',
        van_ban_lien_quan: [{ so_hieu: '14/2015/TT-BTC', tinh_trang: 'HET_HIEU_LUC', bi_thay_the_boi: ['85/2026/TT-BTC'], bi_bai_bo_boi: [] }],
        canh_bao_hieu_luc: true,
      },
    ],
  };

  const mockDk = {
    phien_ban: '2026-11-21',
    luoc_do_phien_ban: LUOC_DO_PHIEN_BAN,
    giay_phep: 'CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/',
    mien_tru: 'Tham khảo.',
    canh_bao_tang_nhap: 'Tầng TOM_TAT_NHAP chưa đối chiếu nguyên văn.',
    thong_ke: {
      so_van_ban_nguon_a: 1,
      so_dieu_khoan_nguon_a: 1,
      so_van_ban_tom_tat_nhap: 1,
      so_dieu_khoan_tom_tat_nhap: 1,
      so_tep_doc_hieu: 1,
      so_dong_loi: 0,
    },
    nguyen_van_nguon_a: [
      {
        so_hieu: '85/2026/TT-BTC',
        slug: '85-2026-tt-btc',
        ten: 'Quy định phân loại',
        tinh_trang: 'CON_HIEU_LUC',
        hieu_luc_tu: '2026-09-15',
        het_hieu_luc_tu: null,
        hieu_luc_da_doi_chieu: true,
        nguon_a: 'https://congbao.chinhphu.vn/x',
        tang_tin_cay: 'NGUYEN_VAN_NGUON_A',
        dieu_khoan: [{ dieu: 4, khoan: 1, diem: 'a', noi_dung: 'Nguyên văn điều 4.', trang_pdf: 3, sha256_pdf: 'a'.repeat(64) }],
      },
    ],
    tom_tat_nhap: [
      {
        so_hieu: '14/2015/TT-BTC',
        slug: '14-2015-tt-btc',
        tinh_trang: 'HET_HIEU_LUC',
        nguon_a: 'https://vanban.chinhphu.vn/y',
        tang_tin_cay: 'TOM_TAT_NHAP',
        da_soat: false,
        dieu_khoan: [{ dieu: 'Điều 1', ten: 'Phạm vi', tom_tat: 'Tóm tắt nháp.', nghia_vu_xnk: ['Khai báo'], nguon_trich: 'test', da_soat: false }],
      },
    ],
  };

  const mockCas = {
    phien_ban: '2026-11-21',
    luoc_do_phien_ban: LUOC_DO_PHIEN_BAN,
    giay_phep: 'CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/',
    mien_tru: 'Tham khảo.',
    thong_ke: { so_tep: 1, so_tep_loi: 0, tong_dong: 2, so_dong_co_cas: 1, so_ma_cas_duy_nhat: 1, so_dong_khong_co_cas: 1 },
    theo_cas: {
      '106-99-0': [{
        cas: '106-99-0',
        ten_chat: '1,3-Butadien',
        ma_hoa_chat: '1,3-Butadiene',
        cong_thuc: 'C4H6',
        phan_loai: 'Hóa chất cơ bản',
        phu_luc: 'I',
        muc: null,
        so_thu_tu: '1',
        nhom: null,
        nguong_kg: null,
        nguon: 'https://congbao.chinhphu.vn/x (Công báo số 77)',
        so_hieu: '24/2026/NĐ-CP',
        slug: '24-2026-nd-cp',
        tinh_trang: 'CON_HIEU_LUC',
        nguon_a: 'https://vanban.chinhphu.vn/z',
      }],
    },
    khong_co_cas: [{
      cas: null,
      ten_chat: 'Diisocyanate (TDI, MDI, HDI…)',
      ma_hoa_chat: 'Diisocyanate (TDI, MDI, HDI…)',
      cong_thuc: null,
      phan_loai: 'Hóa chất cơ bản',
      phu_luc: 'I',
      muc: null,
      so_thu_tu: '12',
      nhom: null,
      nguong_kg: null,
      nguon: 'https://congbao.chinhphu.vn/x',
      so_hieu: '24/2026/NĐ-CP',
      slug: '24-2026-nd-cp',
      tinh_trang: 'CON_HIEU_LUC',
    }],
  };

  writeFileSync(join(mockDist, 'registry.json'), JSON.stringify(mockReg));
  writeFileSync(join(mockDist, 'wiki-index.json'), JSON.stringify(mockWikiIndex));
  writeFileSync(join(mockDist, 'wiki-chunks.json'), JSON.stringify(mockWikiChunks));
  writeFileSync(join(mockDist, 'dieu-khoan.json'), JSON.stringify(mockDk));
  writeFileSync(join(mockDist, 'cas-index.json'), JSON.stringify(mockCas));
  // Cố tình đặt tệp ngoài ranh giới HS trong mockDist và trong outMock/data để kiểm tra bị chặn & dọn sạch
  writeFileSync(join(mockDist, 'chu-giai-hs.json'), '{}');
  writeFileSync(join(mockDist, 'chu-giai-chuong.json'), '{}');
  writeFileSync(join(mockDist, 'hs-index.json'), '{}');
  mkdirSync(join(outMock, 'data'), { recursive: true });
  writeFileSync(join(outMock, 'data', 'chu-giai-hs.json'), '{}');
  writeFileSync(join(outMock, 'data', 'chu-giai-chuong.json'), '{}');

  const kq1 = dungWeb({ distDir: mockDist, outDir: outMock });

  const coreFiles = ['.nojekyll', 'index.html', 'app.js', 'style.css'];
  const dataFiles = ['registry.json', 'wiki-index.json', 'wiki-chunks.json', 'dieu-khoan.json', 'cas-index.json'];
  t('tạo đủ .nojekyll, index.html, app.js, style.css và 5 tệp JSON trong data/',
    kq1.nguonDuLieu === 'dist'
    && coreFiles.every((f) => existsSync(join(outMock, f)))
    && dataFiles.every((f) => existsSync(join(outMock, 'data', f))),
    JSON.stringify({ core: coreFiles.map((f) => existsSync(join(outMock, f))), data: dataFiles.map((f) => existsSync(join(outMock, 'data', f))) }));

  t('tuyệt đối không xuất chu-giai-hs.json, chu-giai-chuong.json, hs-index.json, hs-index-theo-ma.json',
    !existsSync(join(outMock, 'data', 'chu-giai-hs.json'))
    && !existsSync(join(outMock, 'data', 'chu-giai-chuong.json'))
    && !existsSync(join(outMock, 'data', 'hs-index.json'))
    && !existsSync(join(outMock, 'data', 'hs-index-theo-ma.json')));

  const outReg = JSON.parse(readFileSync(join(outMock, 'data', 'registry.json'), 'utf8'));
  const vb0 = outReg.van_ban[0];
  t('rutGonRegistry giữ đủ trường tìm kiếm/quan hệ và lược bỏ trường nội bộ/cồng kềnh',
    vb0.so_hieu === '85/2026/TT-BTC'
    && vb0.xac_minh?.muc === 'NGUON_A'
    && vb0.quan_he?.thay_the?.[0]?.so_hieu === '14/2015/TT-BTC'
    && outReg.van_ban[1].quan_he_nguoc?.bi_thay_the_boi?.[0]?.tu === '85/2026/TT-BTC'
    && vb0.nguon?.[0]?.url === 'https://congbao.chinhphu.vn/van-ban/85-2026-tt-btc'
    && vb0.toan_van === undefined
    && vb0.danh_muc_hs === undefined
    && vb0.xac_minh?.nguon_rieng_tu === undefined
    && vb0.xac_minh?.dieu_khoan === undefined
    && vb0.xac_minh?.boi === undefined);

  const html = readFileSync(join(outMock, 'index.html'), 'utf8');
  const js = readFileSync(join(outMock, 'app.js'), 'utf8');
  const css = readFileSync(join(outMock, 'style.css'), 'utf8');
  const combinedWeb = `${html}\n${js}\n${css}`;

  t('chèn phiên bản lược đồ & thời điểm dựng sạch sẽ (không sót placeholder {{...}})',
    html.includes(`v${LUOC_DO_PHIEN_BAN}`)
    && html.includes('2026-11-21')
    && !/\{\{(?:LUOC_DO_PHIEN_BAN|PHIEN_BAN|THOI_DIEM_DUNG)\}\}/.test(combinedWeb));

  t('không chứa link CDN ngoài (0 CDN)',
    !RE_CDN_CAM.test(combinedWeb));

  t('đủ 4 tab chức năng, phân tách 2 tầng điều khoản, footer CC BY 4.0 + miễn trừ + ranh giới hs-code-api',
    html.includes('1. Hiệu lực văn bản')
    && html.includes('2. Wiki &amp; Hỏi đáp')
    && html.includes('3. Điều khoản bậc A')
    && html.includes('4. Hóa chất CAS (24/2026)')
    && combinedWeb.includes('NGUYEN_VAN_NGUON_A')
    && combinedWeb.includes('TOM_TAT_NHAP')
    && combinedWeb.includes('Tóm tắt nháp — chưa đối chiếu nguyên văn')
    && html.includes('CC BY 4.0')
    && html.includes('Công báo')
    && html.includes('CSDLQG')
    && html.includes('hs-code-api'));

  t('app.js dùng helper escape XSS & kiểm tra cú pháp node --check đạt',
    (() => {
      execFileSync('node', ['--check', join(outMock, 'app.js')], { encoding: 'utf8' });
      return js.includes('function esc(') && js.includes('function safeUrl(');
    })());

  // 2. Kiểm in-memory fallback khi distDir chưa tồn tại nhưng root có registry/van-ban
  const fixRoot = makeTmp('oz-web-fallback-root-');
  const outFallback = makeTmp('oz-web-fallback-out-');
  mkdirSync(join(fixRoot, 'registry', 'van-ban'), { recursive: true });
  for (const f of ['cay-xnk.yaml', 'co-quan.yaml', 'nguon-uy-tin.yaml']) {
    cpSync(join(ROOT, 'registry', f), join(fixRoot, 'registry', f));
  }
  writeFileSync(
    join(fixRoot, 'registry', 'van-ban', '24-2026-nd-cp.yaml'),
    'so_hieu: 24/2026/NĐ-CP\nloai: NGHI_DINH\nten: Hóa chất\nco_quan: CP\nhieu_luc_tu: "2026-01-17"\ntinh_trang: CON_HIEU_LUC\nnhanh: [giay-phep]\nnguon:\n  - url: https://congbao.chinhphu.vn/x\n    truy_cap: "2026-11-20"\nxac_minh:\n  muc: NGUON_A\n  hieu_luc_da_doi_chieu: true\n  ngay: "2026-11-21"\n  dieu_khoan:\n    - dieu: 1\n      noi_dung: "Phạm vi điều chỉnh."\n      trang_pdf: 1\n      sha256_pdf: "' + 'b'.repeat(64) + '"\n'
  );
  mkdirSync(join(fixRoot, 'wiki', 'summary'), { recursive: true });
  writeFileSync(join(fixRoot, 'wiki', 'summary', 'hoa-chat.md'), '---\ntitle: "Hóa chất 24/2026"\ntags: [hoa-chat]\n---\n\n## Quy định\nÁp dụng 24/2026/NĐ-CP.\n');
  mkdirSync(join(fixRoot, 'data', 'doc-hieu'), { recursive: true });
  writeFileSync(join(fixRoot, 'data', 'doc-hieu', '24-2026-nd-cp.dieu.jsonl'), JSON.stringify({ dieu: 'Điều 2', ten: 'Đối tượng', tom_tat: 'Tóm tắt Đ2', nghia_vu_xnk: ['Khai báo'] }) + '\n');
  mkdirSync(join(fixRoot, 'danh-muc'), { recursive: true });
  writeFileSync(
    join(fixRoot, 'danh-muc', '24-2026-nd-cp-cas.csv'),
    `${COT_CAS.join(',')}\n106-99-0,"1,3-Butadien","1,3-Butadiene",C4H6,Hóa chất cơ bản,I,,1,https://congbao.chinhphu.vn/x,,\n,"Diisocyanate",Diisocyanate,,Hóa chất cơ bản,I,,12,https://congbao.chinhphu.vn/x,,\n`
  );

  const kqFb = dungWeb({
    distDir: join(fixRoot, 'dist-khong-ton-tai'),
    outDir: outFallback,
    root: fixRoot,
    today: '2026-11-21',
  });
  const fbCas = JSON.parse(readFileSync(join(outFallback, 'data', 'cas-index.json'), 'utf8'));
  const fbDk = JSON.parse(readFileSync(join(outFallback, 'data', 'dieu-khoan.json'), 'utf8'));
  t('in-memory fallback khi distDir chưa có tệp dựng đủ 5 JSON chuẩn từ root',
    kqFb.nguonDuLieu === 'in-memory'
    && fbCas.theo_cas['106-99-0']?.length === 1
    && fbCas.khong_co_cas?.length === 1
    && fbDk.nguyen_van_nguon_a?.length === 1
    && fbDk.tom_tat_nhap?.length === 1);

  // 3. Báo lỗi rõ khi thiếu cả distDir và root/registry/van-ban
  const emptyRoot = makeTmp('oz-web-empty-');
  let errMsg = '';
  try {
    dungWeb({ distDir: join(emptyRoot, 'dist'), outDir: join(emptyRoot, 'site'), root: emptyRoot });
  } catch (e) {
    errMsg = e.message;
  }
  t('báo lỗi rõ ràng khi cả distDir lẫn registry/van-ban đều không tồn tại',
    errMsg.includes('npm run dung'));

  // 4. Chạy CLI tools/dung-web.mjs với dist/ thật ra thư mục tạm
  const outCli = makeTmp('oz-web-cli-');
  execFileSync('node', [join(ROOT, 'tools', 'dung-web.mjs'), '--dist', join(ROOT, 'dist'), '--out', outCli, '--today', '2026-11-22'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  const cliRegSize = statSync(join(outCli, 'data', 'registry.json')).size;
  const distRegSize = statSync(join(ROOT, 'dist', 'registry.json')).size;
  const cliReg = JSON.parse(readFileSync(join(outCli, 'data', 'registry.json'), 'utf8'));
  const distRegSchema = JSON.parse(readFileSync(join(ROOT, 'dist', 'registry.json'), 'utf8')).luoc_do_phien_ban || LUOC_DO_PHIEN_BAN;
  const cliCas = JSON.parse(readFileSync(join(outCli, 'data', 'cas-index.json'), 'utf8'));
  const cliDk = JSON.parse(readFileSync(join(outCli, 'data', 'dieu-khoan.json'), 'utf8'));
  t(`CLI tools/dung-web.mjs trên dist/ thật ra tmpdir: đủ tệp, schema 1.x khớp dist/, registry.json được rút gọn rõ rệt`,
    existsSync(join(outCli, '.nojekyll'))
    && cliReg.luoc_do_phien_ban === distRegSchema
    && String(cliReg.luoc_do_phien_ban || '').startsWith(`${LUOC_DO_PHIEN_BAN.split('.')[0]}.`)
    && cliReg.van_ban.length >= 2800
    && cliRegSize < distRegSize * 0.65
    && cliCas.thong_ke.so_ma_cas_duy_nhat >= 1200
    && cliCas.khong_co_cas.length >= 10
    && cliDk.nguyen_van_nguon_a.length >= 10
    && cliDk.tom_tat_nhap.length >= 80
    && !existsSync(join(outCli, 'data', 'chu-giai-hs.json'))
    && !existsSync(join(outCli, 'data', 'chu-giai-chuong.json')),
    JSON.stringify({ cliRegSize, distRegSize, tongVb: cliReg.van_ban.length }));

  // 5. Kiểm rutGonRegistry xử lý đầu vào rỗng an toàn
  const rgEmpty = rutGonRegistry({ van_ban: [] });
  t('rutGonRegistry xử lý mảng rỗng an toàn', rgEmpty.tong === 0 && Array.isArray(rgEmpty.van_ban));

  // 6. Kiểm thực thi app.js trong VM (render đủ 4 tab, lọc & chống XSS/javascript: URL)
  const xssDist = makeTmp('oz-web-xss-dist-');
  const outXss = makeTmp('oz-web-xss-out-');
  const regXss = structuredClone(mockReg);
  regXss.van_ban[0].ten = 'Tên có <script>alert(1)</script> thử XSS';
  regXss.van_ban[0].nguon.push({ url: 'javascript:alert(1)', truy_cap: '2026-11-21' });
  writeFileSync(join(xssDist, 'registry.json'), JSON.stringify(regXss));
  writeFileSync(join(xssDist, 'wiki-index.json'), JSON.stringify(mockWikiIndex));
  writeFileSync(join(xssDist, 'wiki-chunks.json'), JSON.stringify(mockWikiChunks));
  writeFileSync(join(xssDist, 'dieu-khoan.json'), JSON.stringify(mockDk));
  writeFileSync(join(xssDist, 'cas-index.json'), JSON.stringify(mockCas));
  dungWeb({ distDir: xssDist, outDir: outXss });

  const xssHtml = readFileSync(join(outXss, 'index.html'), 'utf8');
  const xssJs = readFileSync(join(outXss, 'app.js'), 'utf8');
  const ids = [...xssHtml.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
  const makeLegacyEl = (id = '') => ({
    id,
    innerHTML: '',
    textContent: '',
    value: '',
    checked: false,
    hidden: false,
    options: [{ value: '' }],
    classList: { add() {}, remove() {}, toggle() {} },
    attributes: {},
    listeners: {},
    setAttribute(k, v) { this.attributes[k] = v; },
    getAttribute(k) { return this.attributes[k] ?? null; },
    addEventListener(ev, fn) { (this.listeners[ev] ||= []).push(fn); },
    appendChild(child) { this.options.push(child); },
    querySelectorAll() { return []; },
  });
  const elMap = new Map(ids.map((id) => [id, makeLegacyEl(id)]));
  const tabBtns = ['hieu-luc', 'wiki', 'dieu-khoan', 'cas'].map((tab) => {
    const b = makeLegacyEl(`btn-${tab}`);
    b.setAttribute('data-tab', tab);
    return b;
  });
  const panels = ['hieu-luc', 'wiki', 'dieu-khoan', 'cas'].map((tab) => makeLegacyEl(`panel-${tab}`));
  const docListeners = {};
  const sandbox = {
    console,
    URL,
    Number,
    String,
    Array,
    Object,
    Map,
    Set,
    Boolean,
    Promise,
    encodeURIComponent,
    decodeURIComponent,
    setTimeout: (fn, ms) => {
      const id = setTimeout(fn, ms);
      if (typeof id?.unref === 'function') id.unref();
      return id;
    },
    clearTimeout,
    history: { replaceState() {}, pushState() {} },
    window: { location: { protocol: 'https:', href: 'https://example.test/', hash: '' }, scrollTo() {}, addEventListener() {} },
    document: {
      createElement(tag) { return makeLegacyEl(tag); },
      getElementById(id) { return elMap.get(id) || null; },
      querySelectorAll(sel) {
        if (sel === '.tab-btn') return tabBtns;
        if (sel === '.tab-panel') return panels;
        return [];
      },
      addEventListener(ev, fn) { (docListeners[ev] ||= []).push(fn); },
    },
    fetch: async (path) => ({
      ok: true,
      status: 200,
      json: async () => JSON.parse(readFileSync(join(outXss, path), 'utf8')),
    }),
  };

  vm.runInNewContext(xssJs, sandbox);
  await docListeners.DOMContentLoaded[0]();
  await new Promise((r) => setTimeout(r, 20));
  for (const btn of tabBtns) {
    await btn.listeners.click[0]();
    await new Promise((r) => setTimeout(r, 20));
  }

  const regOutHtml = elMap.get('reg-list').innerHTML;
  const wikiOutHtml = elMap.get('wiki-list').innerHTML;
  const dkOutHtml = elMap.get('dk-list').innerHTML;
  const casOutHtml = elMap.get('cas-list').innerHTML;

  // Kiểm lọc khong_co_cas trên Tab 4
  elMap.get('cas-mode').value = 'khong_co_cas';
  await elMap.get('cas-mode').listeners.change[0]({ target: elMap.get('cas-mode') });
  const casKhongOutHtml = elMap.get('cas-list').innerHTML;

  // Kiểm tìm trong wiki-chunks trên Tab 2
  elMap.get('wiki-q').value = 'TT 85/2026';
  await elMap.get('wiki-q').listeners.input[0]({ target: elMap.get('wiki-q') });
  const wikiChunkOutHtml = elMap.get('wiki-list').innerHTML;

  t('runtime app.js: render đủ 4 tab, escape XSS/javascript: URL, hiển thị 2 tầng & khong_co_cas',
    regOutHtml.includes('&lt;script&gt;alert(1)&lt;/script&gt;')
    && !regOutHtml.includes('<script>')
    && !regOutHtml.includes('javascript:alert(1)')
    && regOutHtml.includes('Bị thay thế bởi')
    && wikiOutHtml.includes('Phân loại hàng hóa XNK')
    && wikiChunkOutHtml.includes('Cảnh báo hiệu lực')
    && dkOutHtml.includes('NGUYEN_VAN_NGUON_A')
    && dkOutHtml.includes('Tóm tắt nháp — chưa đối chiếu nguyên văn')
    && dkOutHtml.includes('Trang PDF: 3')
    && casOutHtml.includes('106-99-0')
    && casKhongOutHtml.includes('Diisocyanate')
    && !casKhongOutHtml.includes('106-99-0'));

  // ==================== BỔ SUNG TEST WEB PORTAL V2 (WAVE 7) ====================

  // 7. Kiểm tra hợp đồng data/hs-policy.json (rút gọn từ hs-index-theo-ma.json & fallback sạch khi thiếu)
  const mockHsPolicyRaw = JSON.parse(readFileSync(join(outMock, 'data', 'hs-policy.json'), 'utf8'));
  const mockSapHetRaw = JSON.parse(readFileSync(join(outMock, 'data', 'sap-het-hieu-luc.json'), 'utf8'));
  t('V2 fallback sạch khi distDir thiếu hs-index-theo-ma.json: xuất data/hs-policy.json rỗng & sap-het-hieu-luc.json hợp lệ',
    mockHsPolicyRaw.tong_nhom_ma === 0
    && Object.keys(mockHsPolicyRaw.ma || {}).length === 0
    && mockSapHetRaw.trong_so_ngay === 60
    && mockSapHetRaw.tong === 0
    && Array.isArray(mockSapHetRaw.danh_sach));

  const mockHsTheoMa = {
    phien_ban: '2026-11-22',
    luoc_do_phien_ban: LUOC_DO_PHIEN_BAN,
    bieu_thue_doi_chieu: { tong_ma: 11871 },
    canh_bao_ma: ['99999999'],
    tien_le_tb_tchq: { theo_ma_8: { '38089199': 3 } },
    ma: {
      '3808': [
        {
          so_hieu: '27/2026/TT-BNNMT',
          slug: '27-2026-tt-bnnmt',
          ten: 'Mô tả dài không nên giữ ở Web V2',
          tinh_trang: 'CON_HIEU_LUC',
          hieu_luc_tu: '2026-07-01',
          het_hieu_luc_tu: null,
          hieu_luc_da_doi_chieu: true,
          loai_tac_dong: 'CONG_BO_HOP_QUY',
          muc_rui_ro: 'TRUNG_BINH',
          dieu_kien: 'QCVN 01-188:2018/BNNPTNT',
          dan_chieu: 'Phụ lục II',
          nhom: '1.1',
          phu_luc: 'Phụ lục II',
          tien_le_tb_tchq: { so_luong: 2 },
        },
        // Mục trùng hoàn toàn sau khi rút gọn → phải được gộp
        {
          so_hieu: '27/2026/TT-BNNMT',
          slug: '27-2026-tt-bnnmt',
          ten: 'Mô tả khác nhau nhưng rút gọn giống nhau',
          tinh_trang: 'CON_HIEU_LUC',
          hieu_luc_tu: '2026-07-01',
          het_hieu_luc_tu: null,
          hieu_luc_da_doi_chieu: true,
          loai_tac_dong: 'CONG_BO_HOP_QUY',
          muc_rui_ro: 'TRUNG_BINH',
          dieu_kien: 'QCVN 01-188:2018/BNNPTNT',
          dan_chieu: 'Phụ lục II',
          nhom: '1.2',
        },
      ],
      '380891': [
        {
          so_hieu: '24/2026/NĐ-CP',
          slug: '24-2026-nd-cp',
          ten: 'Danh mục hóa chất',
          tinh_trang: 'CON_HIEU_LUC',
          hieu_luc_tu: '2026-01-17',
          het_hieu_luc_tu: null,
          hieu_luc_da_doi_chieu: true,
          loai_tac_dong: 'GIAY_PHEP',
          muc_rui_ro: 'CAO',
          dieu_kien: 'Khai báo hóa chất nhập khẩu',
          dan_chieu: 'Phụ lục II',
        },
      ],
      '38089199': [
        {
          so_hieu: '174/2025/NĐ-CP',
          slug: '174-2025-nd-cp',
          ten: 'Giảm thuế GTGT 8% năm 2026',
          tinh_trang: 'CON_HIEU_LUC',
          hieu_luc_tu: '2025-07-01',
          het_hieu_luc_tu: '2026-12-31',
          hieu_luc_da_doi_chieu: true,
          loai_tac_dong: 'KHAC',
          muc_rui_ro: null,
          dieu_kien: 'Hiệu lực đến 31/12/2026',
          dan_chieu: 'Điều 1',
        },
      ],
    },
  };
  const hsPolTest = rutGonHsPolicy(mockHsTheoMa);
  t('rutGonHsPolicy rút gọn đúng schema Web V2, lược bỏ ten & tien_le_tb_tchq, gộp cạnh trùng',
    hsPolTest.tong_nhom_ma === 3
    && hsPolTest.bieu_thue_doi_chieu === undefined
    && hsPolTest.canh_bao_ma === undefined
    && hsPolTest.tien_le_tb_tchq === undefined
    && hsPolTest.ma['3808'].length === 1
    && hsPolTest.ma['3808'][0].ten === undefined
    && hsPolTest.ma['3808'][0].tien_le_tb_tchq === undefined
    && hsPolTest.ma['3808'][0].nhom === undefined
    && hsPolTest.ma['3808'][0].phu_luc === undefined
    && hsPolTest.ma['3808'][0].dieu_kien === 'QCVN 01-188:2018/BNNPTNT'
    && hsPolTest.ma['380891'][0].muc_rui_ro === 'CAO'
    && hsPolTest.ma['38089199'][0].slug === '174-2025-nd-cp');

  // 8. Kiểm tra tinhSapHetHieuLuc: ranh giới 0..60 ngày từ today, giữ HET_HIEU_LUC_MOT_PHAN, loại HET_HIEU_LUC, sắp xếp tăng dần
  const regBoundary = {
    phien_ban: '2026-11-22',
    van_ban: [
      { so_hieu: '00/2026/TT-BTC', slug: '00-2026-tt-btc', ten: 'Hết đúng today (0 ngày)', co_quan: 'BTC', tinh_trang: 'CON_HIEU_LUC', het_hieu_luc_tu: '2026-11-22', xac_minh: { muc: 'NGUON_A' }, nguon: [{ url: 'https://congbao.chinhphu.vn/00' }] },
      { so_hieu: '60/2026/NĐ-CP', slug: '60-2026-nd-cp', ten: 'Hết đúng ngày thứ 60', co_quan: 'CP', tinh_trang: 'HET_HIEU_LUC_MOT_PHAN', het_hieu_luc_tu: '2027-01-21', xac_minh: { muc: 'NGUON_A' }, nguon: [{ url: 'https://vanban.chinhphu.vn/60' }] },
      { so_hieu: '174/2025/NĐ-CP', slug: '174-2025-nd-cp', ten: 'Hết 31/12/2026 (39 ngày)', co_quan: 'CP', tinh_trang: 'CON_HIEU_LUC', het_hieu_luc_tu: '2026-12-31', xac_minh: { muc: 'NGUON_A' }, nhanh: ['thue/gtgt'], nguon: [{ url: 'https://congbao.chinhphu.vn/174' }] },
      { so_hieu: '61/2026/NĐ-CP', slug: '61-2026-nd-cp', ten: 'Ngày thứ 61 (> 60 ngày, phải loại)', co_quan: 'CP', tinh_trang: 'CON_HIEU_LUC', het_hieu_luc_tu: '2027-01-22', xac_minh: { muc: 'NGUON_A' }, nguon: [{ url: 'https://congbao.chinhphu.vn/61' }] },
      { so_hieu: '99/2026/NĐ-CP', slug: '99-2026-nd-cp', ten: 'Đã quá hạn hôm qua (-1 ngày, phải loại)', co_quan: 'CP', tinh_trang: 'CON_HIEU_LUC', het_hieu_luc_tu: '2026-11-21', xac_minh: { muc: 'NGUON_A' }, nguon: [{ url: 'https://congbao.chinhphu.vn/99' }] },
      { so_hieu: '88/2026/TT-BCT', slug: '88-2026-tt-bct', ten: 'Đã ghi HET_HIEU_LUC (phải loại)', co_quan: 'BCT', tinh_trang: 'HET_HIEU_LUC', het_hieu_luc_tu: '2026-12-15', xac_minh: { muc: 'NGUON_A' }, nguon: [{ url: 'https://congbao.chinhphu.vn/88' }] },
    ],
  };
  const sapHet = tinhSapHetHieuLuc(regBoundary, { today: '2026-11-22' });
  t('tinhSapHetHieuLuc lọc đúng biên 0..60 ngày từ today, loại HET_HIEU_LUC, sắp tăng dần & gắn url_nguon_a',
    sapHet.ngay_dung === '2026-11-22'
    && sapHet.trong_so_ngay === 60
    && sapHet.tong === 3
    && sapHet.danh_sach.map((d) => `${d.so_hieu}:${d.so_ngay_con_lai}`).join(',') === '00/2026/TT-BTC:0,174/2025/NĐ-CP:39,60/2026/NĐ-CP:60'
    && sapHet.danh_sach[1].url_nguon_a === 'https://congbao.chinhphu.vn/174',
    JSON.stringify(sapHet.danh_sach));

  // 9. Kiểm tra in-memory fallback CÓ danh-muc/*.csv tự tạo data/hs-policy.json không rỗng
  const hsCsvRoot = makeTmp('oz-web-hs-inmem-');
  const outHsInMem = makeTmp('oz-web-hs-inmem-out-');
  mkdirSync(join(hsCsvRoot, 'registry', 'van-ban'), { recursive: true });
  for (const f of ['cay-xnk.yaml', 'co-quan.yaml', 'nguon-uy-tin.yaml']) {
    cpSync(join(ROOT, 'registry', f), join(hsCsvRoot, 'registry', f));
  }
  writeFileSync(
    join(hsCsvRoot, 'registry', 'van-ban', '27-2026-tt-bnnmt.yaml'),
    'so_hieu: 27/2026/TT-BNNMT\nloai: THONG_TU\nten: Danh mục BVTV\nco_quan: BNNMT\nhieu_luc_tu: "2026-07-01"\ntinh_trang: CON_HIEU_LUC\nnhanh: [kiem-tra-chuyen-nganh]\ndanh_muc_hs:\n  tep: danh-muc/27-2026-tt-bnnmt.csv\nnguon:\n  - url: https://congbao.chinhphu.vn/27\n    truy_cap: "2026-11-20"\nxac_minh:\n  muc: NGUON_A\n  hieu_luc_da_doi_chieu: true\n  ngay: "2026-11-21"\n'
  );
  mkdirSync(join(hsCsvRoot, 'danh-muc'), { recursive: true });
  writeFileSync(
    join(hsCsvRoot, 'danh-muc', '27-2026-tt-bnnmt.csv'),
    `${COT.join(',')}\n3808,Thuốc bảo vệ thực vật,1.1,Phụ lục II,CONG_BO_HOP_QUY,TRUNG_BINH,QCVN 01-188:2018/BNNPTNT,Điều 3,5\n`
  );
  const kqHsInMem = dungWeb({ distDir: join(hsCsvRoot, 'no-dist'), outDir: outHsInMem, root: hsCsvRoot, today: '2026-11-22' });
  const hsInMemJson = JSON.parse(readFileSync(join(outHsInMem, 'data', 'hs-policy.json'), 'utf8'));
  t('in-memory fallback với danh-muc/*.csv tạo data/hs-policy.json chuẩn và không xuất file cấm',
    kqHsInMem.nguonDuLieu === 'in-memory'
    && hsInMemJson.tong_nhom_ma === 1
    && hsInMemJson.ma['3808']?.[0]?.so_hieu === '27/2026/TT-BNNMT'
    && !existsSync(join(outHsInMem, 'data', 'hs-index.json'))
    && !existsSync(join(outHsInMem, 'data', 'hs-index-theo-ma.json'))
    && !existsSync(join(outHsInMem, 'data', 'chu-giai-hs.json'))
    && !existsSync(join(outHsInMem, 'data', 'chu-giai-chuong.json')));

  // 10. Kiểm tra giao diện HTML V2: đủ 5 tab gồm chinh-sach-hs, alert ribbon, lọc <=60 ngày, toast, 0 CDN
  t('HTML V2 có đủ 5 tab (gồm 5. Chính sách theo mã HS / chinh-sach-hs), alert ribbon, lọc ≤60 ngày & 0 CDN',
    html.includes('data-tab="chinh-sach-hs"')
    && html.includes('5. Chính sách theo mã HS')
    && html.includes('id="panel-chinh-sach-hs"')
    && html.includes('id="expiry-ribbon"')
    && html.includes('id="expiry-ribbon-btn"')
    && html.includes('id="reg-only-expiring"')
    && html.includes('Sắp hết hiệu lực (≤60 ngày)')
    && html.includes('id="hs-boundary-notice"')
    && html.includes('id="copy-toast"')
    && !RE_CDN_CAM.test(combinedWeb));

  // 11. Kiểm tra dữ liệu V2 từ dist/ thật (outCli dựng ở bước 4 với --today 2026-11-22)
  const cliHsPolicy = JSON.parse(readFileSync(join(outCli, 'data', 'hs-policy.json'), 'utf8'));
  const cliSapHet = JSON.parse(readFileSync(join(outCli, 'data', 'sap-het-hieu-luc.json'), 'utf8'));
  const sampleHsEntry = cliHsPolicy.ma['3808']?.[0] || cliHsPolicy.ma[Object.keys(cliHsPolicy.ma)[0]]?.[0];
  t('CLI tools/dung-web.mjs trên dist/ thật xuất data/hs-policy.json (5.600+ nhóm) & data/sap-het-hieu-luc.json (8 VB ≤60 ngày)',
    cliHsPolicy.tong_nhom_ma >= 5000
    && sampleHsEntry?.ten === undefined
    && sampleHsEntry?.tien_le_tb_tchq === undefined
    && cliSapHet.trong_so_ngay === 60
    && cliSapHet.tong === 8
    && cliSapHet.danh_sach.every((d) => d.so_ngay_con_lai >= 0 && d.so_ngay_con_lai <= 60)
    && cliSapHet.danh_sach.some((d) => d.so_hieu === '174/2025/NĐ-CP')
    && !existsSync(join(outCli, 'data', 'hs-index.json'))
    && !existsSync(join(outCli, 'data', 'hs-index-theo-ma.json'))
    && !existsSync(join(outCli, 'data', 'chu-giai-hs.json'))
    && !existsSync(join(outCli, 'data', 'chu-giai-chuong.json')),
    JSON.stringify({ tong_nhom_ma: cliHsPolicy.tong_nhom_ma, sapHetTong: cliSapHet.tong }));

  // 12. Kiểm tra đầy đủ runtime Web V2 trong VM trên mock V2 + XSS payload
  const v2Dist = makeTmp('oz-web-v2-dist-');
  const outV2 = makeTmp('oz-web-v2-out-');
  const sha4 = 'a'.repeat(64);
  const sha15 = 'c'.repeat(64);
  const regV2 = {
    phien_ban: '2026-11-22',
    luoc_do_phien_ban: LUOC_DO_PHIEN_BAN,
    giay_phep: 'CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/',
    tong: 4,
    van_ban: [
      mockReg.van_ban[0],
      mockReg.van_ban[1],
      {
        so_hieu: '174/2025/NĐ-CP',
        slug: '174-2025-nd-cp',
        loai: 'NGHI_DINH',
        ten: 'Quy định chính sách giảm thuế giá trị gia tăng <img src=x onerror=alert(9)>',
        co_quan: 'CP',
        ngay_ban_hanh: '2025-06-30',
        hieu_luc_tu: '2025-07-01',
        het_hieu_luc_tu: '2026-12-31',
        tinh_trang: 'CON_HIEU_LUC',
        nhanh: ['thue/thue-noi-dia-khau-nk'],
        bac_nguon_cao_nhat: 'A',
        xac_minh: { muc: 'NGUON_A', hieu_luc_da_doi_chieu: true, ngay: '2026-11-21' },
        nguon: [
          { url: 'javascript:alert(9)', truy_cap: '2026-11-22' },
          { url: 'https://congbao.chinhphu.vn/174-2025-nd-cp', truy_cap: '2026-11-22' },
        ],
      },
      {
        so_hieu: '27/2026/TT-BNNMT',
        slug: '27-2026-tt-bnnmt',
        loai: 'THONG_TU',
        ten: 'Danh mục hàng hóa rủi ro BNNMT',
        co_quan: 'BNNMT',
        ngay_ban_hanh: '2026-06-01',
        hieu_luc_tu: '2026-07-01',
        het_hieu_luc_tu: null,
        tinh_trang: 'CON_HIEU_LUC',
        nhanh: ['kiem-tra-chuyen-nganh'],
        bac_nguon_cao_nhat: 'A',
        xac_minh: { muc: 'NGUON_A', hieu_luc_da_doi_chieu: true, ngay: '2026-11-21' },
        nguon: [{ url: 'https://congbao.chinhphu.vn/27-2026-tt-bnnmt', truy_cap: '2026-11-22' }],
      },
    ],
  };
  const dkV2 = structuredClone(mockDk);
  dkV2.nguyen_van_nguon_a[0].dieu_khoan = [
    { dieu: 4, khoan: 1, noi_dung: 'Một mặt hàng chỉ có một mã số duy nhất.', trang_pdf: 3, sha256_pdf: sha4 },
    { dieu: 15, khoan: 2, diem: 'b', noi_dung: 'Hồ sơ lưu tại cơ quan hải quan.', trang_pdf: 11, sha256_pdf: sha15 },
  ];
  const hsTheoMaV2 = structuredClone(mockHsTheoMa);
  hsTheoMaV2.ma['380891'][0].dieu_kien = 'Kiểm soát XSS <script>alert(9)</script>';

  writeFileSync(join(v2Dist, 'registry.json'), JSON.stringify(regV2));
  writeFileSync(join(v2Dist, 'wiki-index.json'), JSON.stringify(mockWikiIndex));
  writeFileSync(join(v2Dist, 'wiki-chunks.json'), JSON.stringify(mockWikiChunks));
  writeFileSync(join(v2Dist, 'dieu-khoan.json'), JSON.stringify(dkV2));
  writeFileSync(join(v2Dist, 'cas-index.json'), JSON.stringify(mockCas));
  writeFileSync(join(v2Dist, 'hs-index-theo-ma.json'), JSON.stringify(hsTheoMaV2));
  dungWeb({ distDir: v2Dist, outDir: outV2, today: '2026-11-22' });

  // 12a. Kiểm alert ribbon & lọc sắp hết hiệu lực trên Tab 1
  const vm1 = await runAppInVm(outV2);
  const ribbonEl = vm1.elMap.get('expiry-ribbon');
  const ribbonBtn = vm1.elMap.get('expiry-ribbon-btn');
  const ribbonShown = !ribbonEl.hidden
    && !ribbonEl.classList.contains('hidden')
    && ribbonBtn.textContent.includes('1 văn bản sắp hết hiệu lực trong 60 ngày tới');
  await ribbonBtn.listeners.click[0]();
  await vm1.flush();
  const regAfterRibbon = vm1.elMap.get('reg-list').innerHTML;
  t('VM Web V2: hiển thị thanh cảnh báo hết hạn ≤60 ngày, bấm mở Tab 1 lọc sẵn & gắn huy hiệu đếm ngày còn lại',
    ribbonShown
    && vm1.elMap.get('reg-only-expiring').checked === true
    && regAfterRibbon.includes('174/2025/NĐ-CP')
    && regAfterRibbon.includes('Còn 39 ngày (31/12/2026)')
    && !regAfterRibbon.includes('85/2026/TT-BTC'));

  // Kiểm ribbon ẩn khi tong = 0 & Tab 5 hiển thị trạng thái rỗng sạch khi thiếu hs-index-theo-ma (outMock)
  const vmEmptyRibbon = await runAppInVm(outMock);
  await vmEmptyRibbon.clickTab('chinh-sach-hs');
  t('VM Web V2: ẩn thanh cảnh báo khi không có văn bản sắp hết hiệu lực & Tab 5 xử lý hs-policy rỗng an toàn',
    vmEmptyRibbon.elMap.get('expiry-ribbon').hidden === true
    && vmEmptyRibbon.elMap.get('expiry-ribbon').classList.contains('hidden')
    && (vmEmptyRibbon.elMap.get('hs-list').innerHTML.includes('Chưa có') || vmEmptyRibbon.elMap.get('hs-list').innerHTML.includes('chưa nạp')));

  // 12b. Kiểm Tab 5 chinh-sach-hs (nhập 3808.91.99 -> 8->6->4, tiền tố 3808, chặn mô tả, nhảy #vb=)
  await vm1.clickTab('chinh-sach-hs');
  const hsQEl = vm1.elMap.get('hs-q');
  hsQEl.value = '3808.91.99';
  await hsQEl.listeners.input[0]({ target: hsQEl });
  const hsOut8 = vm1.elMap.get('hs-list').innerHTML;
  const idx8 = hsOut8.indexOf('38089199');
  const idx6 = hsOut8.indexOf('380891<');
  const idx4 = hsOut8.indexOf('3808<');

  hsQEl.value = '3808';
  await hsQEl.listeners.input[0]({ target: hsQEl });
  const hsOut4 = vm1.elMap.get('hs-list').innerHTML;

  hsQEl.value = 'thuốc trừ sâu';
  await hsQEl.listeners.input[0]({ target: hsQEl });
  const hsOutDesc = vm1.elMap.get('hs-list').innerHTML;

  // Khôi phục 3808.91.99 để bấm nút nhảy tới #vb=174-2025-nd-cp
  hsQEl.value = '3808.91.99';
  await hsQEl.listeners.input[0]({ target: hsQEl });
  const jumpBtns = vm1.elMap.get('hs-list').querySelectorAll('[data-jump-vb]');
  const btnJump174 = jumpBtns.find((b) => b.getAttribute('data-jump-vb') === '174-2025-nd-cp');
  await btnJump174.listeners.click[0]();
  await vm1.flush();

  const boundaryHtmlBlock = html.match(/id="hs-boundary-notice"[\s\S]*?<\/div>/)?.[0] || '';
  t('VM Web V2: Tab 5 chinh-sach-hs khớp 8→6→4 cho 3808.91.99, liệt kê tiền tố 3808, chặn mô tả theo ranh giới hs-code-api & nhảy tới #vb=',
    idx8 !== -1 && idx6 !== -1 && idx4 !== -1 && idx8 < idx6 && idx6 < idx4
    && hsOut4.includes('380891')
    && hsOut4.includes('38089199')
    && hsOutDesc.includes('hs-code-api')
    && !hsOutDesc.includes('27/2026/TT-BNNMT')
    && boundaryHtmlBlock.includes('hs-code-api')
    && boundaryHtmlBlock.includes('theo mã HS đã biết')
    && vm1.locationObj.hash === '#vb=174-2025-nd-cp'
    && vm1.elMap.get('reg-list').innerHTML.includes('174/2025/NĐ-CP')
    && vm1.elMap.get('reg-list').innerHTML.includes('card-highlight'));

  // 12c. Kiểm deep-link hash router lúc tải trang (#hs=) & qua hashchange (#vb=, #dk=, #wiki=, #cas=, #tab=) + nút Sao chép liên kết
  const vmHashInit = await runAppInVm(outV2, { initialHash: '#hs=3808.91.99' });
  const initHsActive = !vmHashInit.elMap.get('panel-chinh-sach-hs').hidden
    && vmHashInit.elMap.get('hs-q').value === '3808.91.99'
    && vmHashInit.elMap.get('hs-list').innerHTML.includes('174/2025/NĐ-CP');

  await vmHashInit.triggerHashChange('#vb=27-2026-tt-bnnmt');
  const routeVbOk = !vmHashInit.elMap.get('panel-hieu-luc').hidden
    && vmHashInit.elMap.get('reg-list').innerHTML.includes('27/2026/TT-BNNMT')
    && !vmHashInit.elMap.get('reg-active-filter').hidden;

  await vmHashInit.triggerHashChange('#dk=85-2026-tt-btc:4');
  const dkFilteredHtml = vmHashInit.elMap.get('dk-list').innerHTML;
  const routeDkOk = !vmHashInit.elMap.get('panel-dieu-khoan').hidden
    && dkFilteredHtml.includes('Một mặt hàng chỉ có một mã số duy nhất.')
    && !dkFilteredHtml.includes('Hồ sơ lưu tại cơ quan hải quan.')
    && !vmHashInit.elMap.get('dk-active-filter').hidden;

  await vmHashInit.triggerHashChange('#wiki=phan-loai-hang');
  const routeWikiOk = !vmHashInit.elMap.get('panel-wiki').hidden
    && vmHashInit.elMap.get('wiki-list').innerHTML.includes('phan-loai-hang#1');

  await vmHashInit.triggerHashChange('#cas=106-99-0');
  const routeCasOk = !vmHashInit.elMap.get('panel-cas').hidden
    && vmHashInit.elMap.get('cas-q').value === '106-99-0'
    && vmHashInit.elMap.get('cas-list').innerHTML.includes('1,3-Butadien');

  await vmHashInit.triggerHashChange('#tab=chinh-sach-hs');
  const routeTabOk = !vmHashInit.elMap.get('panel-chinh-sach-hs').hidden;

  // Bấm nút Sao chép liên kết trên thẻ kết quả Tab 5
  const copyLinkBtns = vmHashInit.elMap.get('hs-list').querySelectorAll('[data-copy-link]');
  await copyLinkBtns[0].listeners.click[0]();
  const copiedLink = vmHashInit.clipboardWrites.at(-1) || '';

  t('VM Web V2: hash router (#hs=, #vb=, #dk=, #wiki=, #cas=, #tab=) lúc tải trang & hashchange + nút Sao chép liên kết',
    initHsActive && routeVbOk && routeDkOk && routeWikiOk && routeCasOk && routeTabOk
    && copiedLink.includes('#hs=38089199'),
    JSON.stringify({ initHsActive, routeVbOk, routeDkOk, routeWikiOk, routeCasOk, routeTabOk, copiedLink }));

  // 12d. Kiểm định dạng chuỗi trích dẫn chuẩn pháp lý CC BY 4.0 & chỉ xuất hiện ở tầng NGUYEN_VAN_NGUON_A
  await vmHashInit.triggerHashChange('#tab=dieu-khoan');
  await vmHashInit.elMap.get('dk-reset').listeners.click[0]();
  await vmHashInit.flush();
  const dkFullHtml = vmHashInit.elMap.get('dk-list').innerHTML;
  const citeBtns = vmHashInit.elMap.get('dk-list').querySelectorAll('[data-cite-doc]');
  await citeBtns[0].listeners.click[0]();
  const citeStr = vmHashInit.clipboardWrites.at(-1) || '';
  await citeBtns[1].listeners.click[0]();
  const citeStrDiem = vmHashInit.clipboardWrites.at(-1) || '';
  const expectedCite = `Điều 4 khoản 1 85/2026/TT-BTC (nguồn A, trang PDF 3, SHA-256 ${sha4}): "Một mặt hàng chỉ có một mã số duy nhất." — Nguồn: oz-wiki-plhq — https://github.com/ozvietnam/oz-wiki-plhq (CC BY 4.0).`;
  const expectedCiteDiem = `Điều 15 khoản 2 điểm b 85/2026/TT-BTC (nguồn A, trang PDF 11, SHA-256 ${sha15}): "Hồ sơ lưu tại cơ quan hải quan." — Nguồn: oz-wiki-plhq — https://github.com/ozvietnam/oz-wiki-plhq (CC BY 4.0).`;
  const hasCiteForDraft = citeBtns.some((b) => String(b.getAttribute('data-cite-doc') || '').startsWith('B:'));

  t('VM Web V2: nút 1-click sao chép trích dẫn chuẩn CC BY 4.0 đúng định dạng & chỉ gắn cho tầng NGUYEN_VAN_NGUON_A',
    citeBtns.length === 2
    && !hasCiteForDraft
    && dkFullHtml.includes('Tóm tắt nháp — chưa đối chiếu nguyên văn')
    && citeStr === expectedCite
    && citeStrDiem === expectedCiteDiem,
    JSON.stringify({ citeCount: citeBtns.length, hasCiteForDraft, citeStr, citeStrDiem }));

  // 12e. Kiểm thoát XSS toàn diện trên V2 (hs-policy, sap-het-hieu-luc, hash router)
  const xssHtmlAll = `${regAfterRibbon}\n${hsOut8}`;
  await vmHashInit.triggerHashChange('#vb=<script>alert(9)</script>');
  const xssVbHashHtml = vmHashInit.elMap.get('reg-list').innerHTML;
  await vmHashInit.triggerHashChange('#hs=<img src=x onerror=alert(9)>');
  const xssHsHashHtml = vmHashInit.elMap.get('hs-list').innerHTML;
  await vmHashInit.triggerHashChange('#dk=<script>alert(9)</script>:4');
  const xssDkHashHtml = vmHashInit.elMap.get('dk-list').innerHTML;
  const combinedXssCheck = `${xssHtmlAll}\n${xssVbHashHtml}\n${xssHsHashHtml}\n${xssDkHashHtml}`;

  t('VM Web V2: thoát XSS 100% ở hs-policy, sap-het-hieu-luc, javascript: URL & tham số hash router',
    !combinedXssCheck.includes('<script>')
    && !combinedXssCheck.includes('<img src=x')
    && !combinedXssCheck.includes('javascript:alert(9)')
    && hsOut8.includes('&lt;script&gt;alert(9)&lt;/script&gt;')
    && regAfterRibbon.includes('&lt;img src=x onerror=alert(9)&gt;')
    && xssVbHashHtml.includes('&lt;script&gt;alert(9)&lt;/script&gt;')
    && xssHsHashHtml.includes('&lt;img src=x onerror=alert(9)&gt;')
    && xssDkHashHtml.includes('&lt;script&gt;alert(9)&lt;/script&gt;'));

  // 12f. Kiểm E2E VM trên bộ site dựng từ dist/ thật (outCli)
  const vmReal = await runAppInVm(outCli, { initialHash: '#hs=3808.91.99' });
  const realRibbonText = vmReal.elMap.get('expiry-ribbon-btn').textContent;
  const realHsHtml = vmReal.elMap.get('hs-list').innerHTML;
  await vmReal.triggerHashChange('#dk=85-2026-tt-btc:4');
  const realCiteBtns = vmReal.elMap.get('dk-list').querySelectorAll('[data-cite-doc]');
  await realCiteBtns[0].listeners.click[0]();
  const realCiteStr = vmReal.clipboardWrites.at(-1) || '';

  t('E2E VM trên dist/ thật: ribbon 8 văn bản, #hs=3808.91.99 ra chính sách & #dk=85-2026-tt-btc:4 trích dẫn CC BY 4.0',
    realRibbonText.includes('8 văn bản sắp hết hiệu lực trong 60 ngày tới')
    && realHsHtml.includes('3808')
    && realCiteBtns.length >= 1
    && /^Điều 4\b.*85\/2026\/TT-BTC \(nguồn A, trang PDF \d+, SHA-256 [a-f0-9]{64}\): ".*" — Nguồn: oz-wiki-plhq — https:\/\/github\.com\/ozvietnam\/oz-wiki-plhq \(CC BY 4\.0\)\.$/.test(realCiteStr),
    JSON.stringify({ realRibbonText, realCiteCount: realCiteBtns.length, realCiteStr: realCiteStr.slice(0, 140) }));

  // 13. Kiểm chia mảnh dieu-khoan-index.json + data/dk/*.json & tải lười wiki-chunks.json + dieu-khoan.json (Wave 23)
  const dkIndexReal = JSON.parse(readFileSync(join(outCli, 'data', 'dieu-khoan-index.json'), 'utf8'));
  const allShardPaths = [
    ...(dkIndexReal.nguyen_van_nguon_a || []).map((d) => d.shard),
    ...(dkIndexReal.tom_tat_nhap || []).map((d) => d.shard),
  ];
  t('dieu-khoan-index.json & data/dk/<tier>-<slug>.json tạo đủ mảnh cho mọi văn bản (không chứa đường dẫn nguy hiểm)',
    allShardPaths.length > 0
    && allShardPaths.every((p) => /^dk\/[ab]-[a-z0-9._-]+\.json$/.test(p) && !p.includes('..') && existsSync(join(outCli, 'data', p))),
    JSON.stringify({ count: allShardPaths.length, sample: allShardPaths.slice(0, 3) }));

  const vmLazy = await runAppInVm(outV2);
  await vmLazy.clickTab('wiki');
  const wikiFetchedTab2Init = [...vmLazy.fetchedUrls];
  const wikiPagesRendered = vmLazy.elMap.get('wiki-list').innerHTML;

  const wikiQEl = vmLazy.elMap.get('wiki-q');
  wikiQEl.value = 'TT 85/2026';
  await wikiQEl.listeners.input[0]({ target: wikiQEl });
  await vmLazy.flush();
  const wikiChunksRendered = vmLazy.elMap.get('wiki-list').innerHTML;
  const wikiFetchedAfterSearch = [...vmLazy.fetchedUrls];

  t('VM Web V2 (Wave 23): Tab 2 wiki chỉ tải wiki-index.json khi mở trang & chỉ tải lười wiki-chunks.json khi tìm kiếm',
    wikiFetchedTab2Init.includes('data/wiki-index.json')
    && !wikiFetchedTab2Init.includes('data/wiki-chunks.json')
    && wikiPagesRendered.includes('Phân loại hàng hóa XNK')
    && wikiFetchedAfterSearch.includes('data/wiki-chunks.json')
    && wikiChunksRendered.includes('phan-loai-hang#1'),
    JSON.stringify({ wikiFetchedTab2Init, wikiFetchedAfterSearch }));

  const vmDkShard = await runAppInVm(outV2, { initialHash: '#dk=85-2026-tt-btc:4' });
  const dkFetchedSingle = [...vmDkShard.fetchedUrls];
  const dkSingleHtml = vmDkShard.elMap.get('dk-list').innerHTML;

  await vmDkShard.elMap.get('dk-reset').listeners.click[0]();
  await vmDkShard.flush();
  const dkQEl = vmDkShard.elMap.get('dk-q');
  dkQEl.value = 'hồ sơ lưu';
  await dkQEl.listeners.input[0]({ target: dkQEl });
  await vmDkShard.flush();
  const dkFetchedGlobalSearch = [...vmDkShard.fetchedUrls];
  const dkGlobalSearchHtml = vmDkShard.elMap.get('dk-list').innerHTML;

  t('VM Web V2 (Wave 23): Tab 3 #dk=<slug> chỉ tải dieu-khoan-index + đúng mảnh dk/a-...json; tìm kiếm toàn văn mới tải lười dieu-khoan.json',
    dkFetchedSingle.includes('data/dieu-khoan-index.json')
    && dkFetchedSingle.includes('data/dk/a-85-2026-tt-btc.json')
    && !dkFetchedSingle.includes('data/dieu-khoan.json')
    && dkSingleHtml.includes('Một mặt hàng chỉ có một mã số duy nhất.')
    && dkFetchedGlobalSearch.includes('data/dieu-khoan.json')
    && dkGlobalSearchHtml.includes('Hồ sơ lưu tại cơ quan hải quan.'),
    JSON.stringify({ dkFetchedSingle, dkFetchedGlobalSearch }));
} finally {
  for (const d of tmpDirs) {
    try {
      rmSync(d, { recursive: true, force: true });
    } catch { /* ignore */ }
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
