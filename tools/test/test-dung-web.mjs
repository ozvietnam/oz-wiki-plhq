// Unit test bộ dựng cổng web tra cứu tĩnh (tools/dung-web.mjs & tools/web-template/*).
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
import { COT_CAS } from '../lib/danh-muc.mjs';
import { dungWeb, rutGonRegistry } from '../dung-web.mjs';

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

try {
  // 1. Dựng từ mock distDir (kèm dữ liệu nhạy cảm/cồng kềnh & tệp ngoài ranh giới HS để kiểm lọc)
  const mockDist = makeTmp('oz-web-dist-');
  const outMock = makeTmp('oz-web-out1-');

  const mockReg = {
    phien_ban: '2026-11-21',
    luoc_do_phien_ban: '1.5.0',
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
    luoc_do_phien_ban: '1.5.0',
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
    luoc_do_phien_ban: '1.5.0',
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
    luoc_do_phien_ban: '1.5.0',
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
    luoc_do_phien_ban: '1.5.0',
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
    html.includes('v1.5.0')
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
  execFileSync('node', [join(ROOT, 'tools', 'dung-web.mjs'), '--dist', join(ROOT, 'dist'), '--out', outCli], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  const cliRegSize = statSync(join(outCli, 'data', 'registry.json')).size;
  const distRegSize = statSync(join(ROOT, 'dist', 'registry.json')).size;
  const cliReg = JSON.parse(readFileSync(join(outCli, 'data', 'registry.json'), 'utf8'));
  const cliCas = JSON.parse(readFileSync(join(outCli, 'data', 'cas-index.json'), 'utf8'));
  const cliDk = JSON.parse(readFileSync(join(outCli, 'data', 'dieu-khoan.json'), 'utf8'));
  t('CLI tools/dung-web.mjs trên dist/ thật ra tmpdir: đủ tệp, schema 1.5.0, registry.json được rút gọn rõ rệt',
    existsSync(join(outCli, '.nojekyll'))
    && cliReg.luoc_do_phien_ban === LUOC_DO_PHIEN_BAN
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
  const makeEl = (id = '') => ({
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
  const elMap = new Map(ids.map((id) => [id, makeEl(id)]));
  const tabBtns = ['hieu-luc', 'wiki', 'dieu-khoan', 'cas'].map((tab) => {
    const b = makeEl(`btn-${tab}`);
    b.setAttribute('data-tab', tab);
    return b;
  });
  const panels = ['hieu-luc', 'wiki', 'dieu-khoan', 'cas'].map((tab) => makeEl(`panel-${tab}`));
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
    history: { replaceState() {} },
    window: { location: { protocol: 'https:', hash: '' }, scrollTo() {}, addEventListener() {} },
    document: {
      createElement(tag) { return makeEl(tag); },
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
} finally {
  for (const d of tmpDirs) {
    try {
      rmSync(d, { recursive: true, force: true });
    } catch { /* ignore */ }
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
