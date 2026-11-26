// Unit & E2E tests (100% offline, 0 cần cài binary Playwright) cho tools/tram-hai-quan-headless.mjs.
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { kiemTra } from '../kiem-tra.mjs';
import { ROOT, napSo } from '../lib/registry.mjs';
import { chayNapStubRadar } from '../nap-stub-radar.mjs';
import {
  MIN_DELAY_GIUA_TRANG_MS,
  NGUON_HAI_QUAN_VB_MOI,
  chayTramHaiQuanHeadless,
  dinhDangMarkdownTramHaiQuan,
  docThamSoCli,
  gopMucHaiQuanHeadless,
  phatHienChanCaptcha,
  trichMucTuDomHaiQuan,
  trichMucTuJsonHaiQuan,
} from '../tram-hai-quan-headless.mjs';

export async function chayTestTramHaiQuanHeadless() {
  let pass = 0;
  let fail = 0;
  const t = (name, cond, extra = '') => {
    if (cond) {
      pass += 1;
      console.log(`PASS [tram-hai-quan-headless] ${name}`);
    } else {
      fail += 1;
      console.log(`FAIL [tram-hai-quan-headless] ${name} ${extra}`);
    }
  };

  const tmpDirs = [];
  const makeTmp = (prefix) => {
    const d = mkdtempSync(join(tmpdir(), prefix));
    tmpDirs.push(d);
    return d;
  };

  const taoRepoTam = () => {
    const workDir = makeTmp('oz-hq-headless-');
    const tmpRepo = join(workDir, 'repo');
    mkdirSync(join(tmpRepo, 'registry', 'van-ban'), { recursive: true });
    mkdirSync(join(tmpRepo, 'data'), { recursive: true });
    for (const cfg of ['cay-xnk.yaml', 'co-quan.yaml', 'nguon-uy-tin.yaml']) {
      cpSync(join(ROOT, 'registry', cfg), join(tmpRepo, 'registry', cfg));
    }
    cpSync(join(ROOT, 'data', 'radar-bo-qua.json'), join(tmpRepo, 'data', 'radar-bo-qua.json'));
    for (const f of ['154-2026-tt-btc.yaml']) {
      const src = join(ROOT, 'registry', 'van-ban', f);
      if (existsSync(src)) {
        cpSync(src, join(tmpRepo, 'registry', 'van-ban', f));
      }
    }
    return { workDir, tmpRepo };
  };

  try {
    // 1. phatHienChanCaptcha: nhận diện Turnstile / reCAPTCHA / hCaptcha / Verify human, không báo giả văn bản thường
    const chanTurnstile = phatHienChanCaptcha({
      html: '<html><body><div class="cf-turnstile" data-sitekey="0x4AAA"></div></body></html>',
      title: 'Hải Quan Việt Nam',
      url: NGUON_HAI_QUAN_VB_MOI,
    });
    const chanTitle = phatHienChanCaptcha({
      html: '<html><body>Checking your browser...</body></html>',
      title: 'Just a moment...',
      url: NGUON_HAI_QUAN_VB_MOI,
      status: 403,
    });
    const chanHuman = phatHienChanCaptcha({
      html: '<html><body><h1>Verify you are human</h1></body></html>',
      title: 'Security Check',
      url: NGUON_HAI_QUAN_VB_MOI,
    });
    const trangBinhThuong = phatHienChanCaptcha({
      html: '<html><body><div id="main"><table><tr><td>24500/CHQ-NVTHQ</td><td>Hướng dẫn thủ tục hải quan</td></tr></table></div></body></html>',
      title: 'Hải Quan Việt Nam',
      url: NGUON_HAI_QUAN_VB_MOI,
    });

    t(
      'phatHienChanCaptcha: phát hiện chuẩn xác Turnstile / Cloudflare / Verify human và không báo giả trang thường',
      chanTurnstile.biChan &&
        chanTurnstile.ma === 'BI_CHAN_CAPTCHA' &&
        chanTitle.biChan &&
        chanTitle.ma === 'BI_CHAN_CAPTCHA' &&
        chanHuman.biChan &&
        chanHuman.ma === 'BI_CHAN_CAPTCHA' &&
        trangBinhThuong.biChan === false
    );

    // 2. trichMucTuJsonHaiQuan & trichMucTuDomHaiQuan & gopMucHaiQuanHeadless
    const sampleXhrJson = JSON.stringify({
      data: {
        Data: [
          {
            id: 107101,
            so_hieu: '24500/CHQ-NVTHQ',
            ngay_ban_hanh: '25/11/2026',
            trich_yeu: 'V/v hướng dẫn thủ tục hải quan và thuế giá trị gia tăng hàng nhập khẩu tại chỗ',
            file_dinh_kem: '["CustomsCMS/TONG_CUC/2026/11/25/VB_24500.pdf"]',
          },
          {
            id: 105900,
            so_hieu: '154/2026/TT-BTC',
            ngay_ban_hanh: '10/10/2026',
            trich_yeu: 'Thông tư hướng dẫn biểu thuế xuất nhập khẩu đã có trong sổ',
            pdf_url_primary: 'https://files.customs.gov.vn/CustomsCMS/TONG_CUC/2026/10/10/154_TT_BTC.pdf',
          },
        ],
      },
    });

    const sampleRenderedDom = `
      <div id="main">
        <table class="dataTable">
          <thead><tr><th>STT</th><th>Số ký hiệu</th><th>Ngày ban hành</th><th>Trích yếu</th><th>Tệp</th></tr></thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>24500/CHQ-NVTHQ</td>
              <td>25/11/2026</td>
              <td><a href="/index.jsp?pageId=3&amp;id=107101&amp;cid=1294">V/v hướng dẫn thủ tục hải quan và thuế giá trị gia tăng hàng nhập khẩu tại chỗ</a></td>
              <td></td>
            </tr>
            <tr>
              <td>2</td>
              <td>3120/QĐ-CHQ</td>
              <td>24/11/2026</td>
              <td><a href="/index.jsp?pageId=3&amp;id=107099&amp;cid=1294">Ban hành quy trình kiểm tra, giám sát hải quan đối với hàng hóa quá cảnh</a></td>
              <td><a href="/CustomsCMS/TONG_CUC/2026/11/24/QD_3120.pdf">Tải về</a></td>
            </tr>
            <tr>
              <td>3</td>
              <td>901/QĐ-CHQ</td>
              <td>20/11/2026</td>
              <td><a href="/index.jsp?pageId=3&amp;id=107050&amp;cid=1294">Quyết định về việc bổ nhiệm nhân sự nội bộ và thi đua khen thưởng</a></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    const tuJson = trichMucTuJsonHaiQuan(sampleXhrJson);
    const tuDom = trichMucTuDomHaiQuan(sampleRenderedDom);
    const daGop = gopMucHaiQuanHeadless({
      jsonPayloads: [sampleXhrJson],
      domHtml: sampleRenderedDom,
    });

    t(
      'trichMucTuJsonHaiQuan & trichMucTuDomHaiQuan: giải quyết đúng CustomsCMS -> files.customs.gov.vn, ghép id -> pageId=3 và gộp khử trùng',
      tuJson.length === 2 &&
        tuJson[0].soHieu === '24500/CHQ-NVTHQ' &&
        tuJson[0].url === 'https://www.customs.gov.vn/index.jsp?pageId=3&id=107101&cid=1294' &&
        tuJson[0].pdfUrl === 'https://files.customs.gov.vn/CustomsCMS/TONG_CUC/2026/11/25/VB_24500.pdf' &&
        tuJson[0].tram === 'customs_headless' &&
        tuDom.length === 3 &&
        tuDom[1].soHieu === '3120/QĐ-CHQ' &&
        tuDom[1].pdfUrl === 'https://files.customs.gov.vn/CustomsCMS/TONG_CUC/2026/11/24/QD_3120.pdf' &&
        daGop.length === 4 &&
        daGop.find((x) => x.soHieu === '24500/CHQ-NVTHQ')?.pdfUrl ===
          'https://files.customs.gov.vn/CustomsCMS/TONG_CUC/2026/11/25/VB_24500.pdf',
      JSON.stringify({ tuJson, tuDom, daGop })
    );

    // 3. chayTramHaiQuanHeadless: dừng tức thì khi gặp CAPTCHA + đảm bảo độ trễ lịch sự >= 1500ms
    const { workDir, tmpRepo } = taoRepoTam();
    const lichSuGoi = [];
    const lichSuSleep = [];
    const kqCaptcha = await chayTramHaiQuanHeadless({
      urls: [
        'https://www.customs.gov.vn/index.jsp?pageId=8&cid=1294',
        'https://www.customs.gov.vn/index.jsp?pageId=8&cid=30',
      ],
      root: tmpRepo,
      delayMs: 200, // cố tình truyền nhỏ hơn 1500 để kiểm chứng kẹp trần dưới >= 1500ms
      sleepFn: async (ms) => {
        lichSuSleep.push(ms);
      },
      thuThapTrangFn: async (url) => {
        lichSuGoi.push(url);
        return {
          status: 403,
          url,
          title: 'Just a moment...',
          html: '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js"></script>',
          jsonPayloads: [],
        };
      },
    });

    t(
      'chayTramHaiQuanHeadless: gặp CAPTCHA dừng ngay lập tức ở trang 1 (không đi tiếp trang 2) và kẹp delay >= 1500ms',
      kqCaptcha.trang_thai === 'BI_CHAN_CAPTCHA' &&
        kqCaptcha.delay_ms === MIN_DELAY_GIUA_TRANG_MS &&
        lichSuGoi.length === 1 &&
        kqCaptcha.loi_tram.length === 1 &&
        kqCaptcha.loi_tram[0].ma === 'BI_CHAN_CAPTCHA' &&
        kqCaptcha.moi.length === 0,
      JSON.stringify(kqCaptcha)
    );

    // 4. chayTramHaiQuanHeadless với mock Playwright (1 browser, 1 context, 1 page, hứng XHR + DOM) + nối sang chayNapStubRadar
    let browserClosed = false;
    let contextClosed = false;
    let contextsCreated = 0;
    let pagesCreated = 0;

    const mockPlaywrightLoader = async () => ({
      chromium: {
        launch: async () => ({
          newContext: async () => {
            contextsCreated += 1;
            return {
              newPage: async () => {
                pagesCreated += 1;
                let responseHandler = null;
                return {
                  on: (evt, fn) => {
                    if (evt === 'response') responseHandler = fn;
                  },
                  goto: async (u) => {
                    if (responseHandler && u.includes('cid=1294')) {
                      await responseHandler({
                        url: () => 'https://www.customs.gov.vn/bridge?url=/customs/api/lay_van_ban',
                        status: () => 200,
                        headers: () => ({ 'content-type': 'application/json; charset=utf-8' }),
                        text: async () => sampleXhrJson,
                      });
                    }
                    return { status: () => 200 };
                  },
                  url: () => NGUON_HAI_QUAN_VB_MOI,
                  title: async () => 'Hải Quan Việt Nam',
                  content: async () => sampleRenderedDom,
                };
              },
              close: async () => {
                contextClosed = true;
              },
            };
          },
          close: async () => {
            browserClosed = true;
          },
        }),
      },
    });

    const sleeps2Url = [];
    const kqHeadless = await chayTramHaiQuanHeadless({
      urls: [
        NGUON_HAI_QUAN_VB_MOI,
        'https://www.customs.gov.vn/index.jsp?pageId=8&cid=30',
      ],
      root: tmpRepo,
      delayMs: 500,
      sleepFn: async (ms) => {
        sleeps2Url.push(ms);
      },
      playwrightLoader: mockPlaywrightLoader,
    });

    const mdHq = dinhDangMarkdownTramHaiQuan(kqHeadless);

    t(
      'chayTramHaiQuanHeadless (mock Playwright): dùng đúng 1 context/1 page, nghỉ >= 1500ms giữa 2 trang, lọc trùng sổ + nhân sự nội bộ',
      kqHeadless.trang_thai === 'OK' &&
        contextsCreated === 1 &&
        pagesCreated === 1 &&
        contextClosed === true &&
        browserClosed === true &&
        sleeps2Url.length === 1 &&
        sleeps2Url[0] === MIN_DELAY_GIUA_TRANG_MS &&
        kqHeadless.thong_ke.moi === 2 &&
        kqHeadless.thong_ke.bo_qua_da_co === 1 &&
        kqHeadless.thong_ke.ngoai_pham_vi === 1 &&
        kqHeadless.moi.some((x) => x.soHieu === '24500/CHQ-NVTHQ' && x.pdfUrl?.includes('VB_24500.pdf')) &&
        kqHeadless.moi.some((x) => x.soHieu === '3120/QĐ-CHQ' && x.pdfUrl?.includes('QD_3120.pdf')) &&
        mdHq.includes('## Trạm Hải quan Headless'),
      JSON.stringify(kqHeadless)
    );

    // Chạy cầu nối sang chayNapStubRadar như workflow tram-hai-quan-tuan.yml
    const radarHqFile = join(workDir, 'tram-hai-quan.json');
    writeFileSync(radarHqFile, JSON.stringify(kqHeadless, null, 2), 'utf8');
    const kqStubHq = await chayNapStubRadar({
      tuRadarPath: radarHqFile,
      root: tmpRepo,
      khongLayPdfUrl: true,
      today: '2026-11-26',
    });

    t(
      'Cầu nối tram-hai-quan-headless -> nap-stub-radar: tạo đủ 2 stub Hải quan kèm PDF bậc A files.customs.gov.vn và pass kiemTra 0 lỗi',
      kqStubHq.thong_ke.da_tao === 2 &&
        kqStubHq.thong_ke.co_pdf_bac_a === 2 &&
        existsSync(join(tmpRepo, 'registry', 'van-ban', '24500-chq-nvthq-2026.yaml')) &&
        existsSync(join(tmpRepo, 'registry', 'van-ban', '3120-qd-chq-2026.yaml')) &&
        kiemTra(napSo(tmpRepo), { root: tmpRepo }).loi.length === 0,
      JSON.stringify(kqStubHq)
    );

    // 5. Thiếu gói playwright cục bộ -> trả THIEU_PLAYWRIGHT êm ái + docThamSoCli
    const kqThieuPw = await chayTramHaiQuanHeadless({
      root: tmpRepo,
      playwrightLoader: async () => {
        const err = new Error("Cannot find package 'playwright'");
        err.code = 'ERR_MODULE_NOT_FOUND';
        throw err;
      },
    });
    const parsedCli = docThamSoCli([
      '--url',
      'https://www.customs.gov.vn/index.jsp?pageId=8&cid=1294',
      '--delay-ms=2000',
      '--bo-qua-json',
      'data/radar-bo-qua.json',
      '--bat-buoc-playwright',
      '--json',
      '--markdown',
      '/tmp/hq.md',
    ]);

    t(
      'Thiếu playwright cục bộ trả THIEU_PLAYWRIGHT không văng stack trace & docThamSoCli phân tích đúng cờ CLI',
      kqThieuPw.trang_thai === 'THIEU_PLAYWRIGHT' &&
        kqThieuPw.canh_bao_tram[0]?.ma === 'THIEU_PLAYWRIGHT' &&
        parsedCli.urls.length === 1 &&
        parsedCli.delayMs === 2000 &&
        parsedCli.batBuocPlaywright === true &&
        parsedCli.json === true &&
        parsedCli.markdown === '/tmp/hq.md'
    );
  } finally {
    for (const d of tmpDirs) {
      rmSync(d, { recursive: true, force: true });
    }
  }

  return { pass, fail };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { pass, fail } = await chayTestTramHaiQuanHeadless();
  console.log(`TONG (tram-hai-quan-headless): ${pass} PASS, ${fail} FAIL`);
  process.exit(fail > 0 ? 1 : 0);
}
