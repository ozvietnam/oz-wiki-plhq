// Unit & E2E tests (100% offline) cho tools/radar-luat-moi.mjs.
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT, napSo } from '../lib/registry.mjs';
import {
  chayRadar,
  chuanHoaDaBao,
  dinhDangMarkdownRadar,
  docRssCongBao,
  docTrangVanBanChinhPhu,
  phanTichMucRadar,
  soHieuTuSlug,
  soHieuTuTieuDe,
  thuocPhamVi,
} from '../radar-luat-moi.mjs';

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

try {
  // 1. soHieuTuSlug
  t('soHieuTuSlug: -so-116-2026-vbhn-tt-nhnn-...htm',
    soHieuTuSlug('https://congbao.chinhphu.vn/van-ban/van-ban-hop-nhat-so-116-2026-vbhn-tt-nhnn-470863.htm') === '116/2026/VBHN-TT-NHNN');
  t('soHieuTuSlug: 82-2026-tt-bxd-...htm',
    soHieuTuSlug('https://congbao.chinhphu.vn/van-ban/82-2026-tt-bxd-470111.htm') === '82/2026/TT-BXD');
  t('soHieuTuSlug: 11-2026-qh16-...htm',
    soHieuTuSlug('https://congbao.chinhphu.vn/van-ban/luat-so-11-2026-qh16-470222.htm') === '11/2026/QH16');
  t('soHieuTuSlug: 43-2026-nq-cp-...htm',
    soHieuTuSlug('https://congbao.chinhphu.vn/van-ban/43-2026-nq-cp-470333.htm') === '43/2026/NQ-CP');
  t('soHieuTuSlug: quyet-dinh-so-2220-qd-ttg-470965.htm (không có năm trong slug)',
    soHieuTuSlug('https://congbao.chinhphu.vn/van-ban/quyet-dinh-so-2220-qd-ttg-470965.htm') === '2220/QD-TTG');
  t('soHieuTuSlug: URL không phải văn bản trả về null',
    soHieuTuSlug('https://congbao.chinhphu.vn/tin-tuc/thong-bao.htm') === null);

  // 2. soHieuTuTieuDe
  t('soHieuTuTieuDe: 28/2026/TT-BCT',
    soHieuTuTieuDe('Thông tư số 28/2026/TT-BCT ngày 15/10/2026 về quy tắc xuất xứ hàng hóa') === '28/2026/TT-BCT');
  t('soHieuTuTieuDe: 11/2026/QH16',
    soHieuTuTieuDe('Luật Thuế xuất khẩu số 11/2026/QH16 của Quốc hội') === '11/2026/QH16');
  t('soHieuTuTieuDe: 72/2026/NĐ-CP',
    soHieuTuTieuDe('Nghị định số 72/2026/NĐ-CP quy định chi tiết Luật Hải quan') === '72/2026/NĐ-CP');
  t('soHieuTuTieuDe: chuẩn hoá khoảng trắng 589/TB- VPCP',
    soHieuTuTieuDe('Thông báo 589/TB- VPCP kết luận cuộc họp') === '589/TB-VPCP');
  t('soHieuTuTieuDe: không nhận nhầm ngày tháng 23/11/2026',
    soHieuTuTieuDe('Văn bản ban hành ngày 23/11/2026 về kế hoạch công tác') === null);

  // 3. thuocPhamVi
  t('thuocPhamVi: nhận diện đúng văn bản XNK, hải quan, KTCN, FTA, C/O, hoá chất, y tế, gỗ, xăng dầu',
    thuocPhamVi('28/2026/TT-BCT', 'Quy định quy tắc xuất xứ hàng hóa và cấp C/O theo FTA thế hệ mới')
    && thuocPhamVi('72/2026/NĐ-CP', 'Sửa đổi biểu thuế xuất khẩu, thuế nhập khẩu ưu đãi và thủ tục hải quan')
    && thuocPhamVi('10/2026/TT-BCT', 'Danh mục hóa chất hạn chế sản xuất, kinh doanh và xăng dầu')
    && thuocPhamVi('12/2026/TT-BYT', 'Quản lý mỹ phẩm, thuốc, thiết bị y tế và an toàn thực phẩm nhập khẩu')
    && thuocPhamVi('15/2026/TT-BNNMT', 'Kiểm dịch thực vật, động vật, phân bón và gỗ xuất khẩu')
    && thuocPhamVi('20/2026/TT-BKHCN', 'Thông tư kiểm tra chuyên ngành chất lượng hàng hoá nhập khẩu')
    && thuocPhamVi('21/2026/TT-BTC', 'Quy đi\u0323nh qua\u0309n ly\u0301 ha\u0300ng ho\u0301a xu\u00e2\u0301t nh\u00e2\u0323p kh\u00e2\u0309u (chuỗi NFD)'));

  t('thuocPhamVi: loại bỏ văn bản giáo dục, đào tạo, bổ nhiệm, nội bộ dù có từ tiêu chuẩn/công bố',
    !thuocPhamVi('01/2026/TT-BGDDT', 'Ban hành tiêu chuẩn cơ sở vật chất trường học trong lĩnh vực giáo dục đào tạo')
    && !thuocPhamVi('02/2026/QD-TTg', 'Quyết định bổ nhiệm nhân sự nội bộ và xếp lương công chức')
    && !thuocPhamVi('03/2026/TT-BVHTTDL', 'Quy chuẩn hoạt động văn hóa thể thao quần chúng')
    && !thuocPhamVi('2220/QD-TTG', 'Về việc ban hành Quy trình vận hành liên hồ chứa trên lưu vực sông Mã'));

  // 4. docRssCongBao
  const sampleRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <item>
    <title></title>
    <description><![CDATA[Sửa đổi thủ tục hải quan &amp; thuế xuất nhập khẩu hàng hóa biên giới]]></description>
    <pubDate>Thu, 26 Nov 2026 00:00:00 GMT</pubDate>
    <link>https://congbao.chinhphu.vn/van-ban/thong-tu-so-154-2026-tt-btc-470500.htm</link>
  </item>
  <item>
    <title>Thông tư 99/2026/TT-BCT</title>
    <description>Quy định mới về cấp giấy chứng nhận xuất xứ hàng hóa C/O mẫu D</description>
    <pubDate>Wed, 25 Nov 2026 00:00:00 GMT</pubDate>
    <link>https://congbao.chinhphu.vn/tin-tuc/bai-viet-khong-chua-slug.htm</link>
  </item>
</channel></rss>`;
  const rssItems = docRssCongBao(sampleRss);
  t('docRssCongBao: trích xuất đủ số hiệu từ slug và fallback tiêu đề, giải mã &amp;',
    rssItems.length === 2
    && rssItems[0].soHieu === '154/2026/TT-BTC'
    && rssItems[0].moTa.includes('&')
    && rssItems[0].tram === 'congbao'
    && rssItems[1].soHieu === '99/2026/TT-BCT'
    && rssItems[1].tram === 'congbao',
    JSON.stringify(rssItems));

  // 5. docTrangVanBanChinhPhu
  const sampleHtml = `
  <table>
    <tr>
      <td>
        <a href='/?pageid=27160&docid=220358'>
          <span class="code">99/2026/TT-BCT</span>
          <span class="issue-v2">25/11/2026</span>
        </a>
      </td>
      <td><span class="issued-date">25/11/2026</span></td>
      <td>
        <a href='/?pageid=27160&docid=220358'>
          <span class="substract">Quy định mới về cấp C/O và xuất xứ hàng hóa</span>
        </a>
      </td>
    </tr>
    <tr>
      <td>
        <a href='/?pageid=27160&docid=220359'>
          <span class="code">420/2026/NĐ-CP</span>
        </a>
      </td>
      <td><span class="issued-date">23/11/2026</span></td>
      <td>
        <a href='/?pageid=27160&docid=220359'>
          <span class="substract">Quy định chi tiết Luật Hải quan và kiểm tra chuyên ngành</span>
        </a>
      </td>
    </tr>
  </table>
  <div class="extra">
    <a href="/van-ban/88-2026-tt-btc-999111.htm">Hướng dẫn thuế nhập khẩu đối với xăng dầu</a>
  </div>`;
  const vbItems = docTrangVanBanChinhPhu(sampleHtml, 'https://vanban.chinhphu.vn/');
  t('docTrangVanBanChinhPhu: parse bảng HTML và liên kết .htm, khử trùng 2 thẻ a cùng docid',
    vbItems.length === 3
    && vbItems[0].soHieu === '99/2026/TT-BCT'
    && vbItems[0].ngay === '25/11/2026'
    && vbItems[0].url === 'https://vanban.chinhphu.vn/?pageid=27160&docid=220358'
    && vbItems[1].soHieu === '420/2026/NĐ-CP'
    && vbItems[2].soHieu === '88/2026/TT-BTC'
    && vbItems[2].url === 'https://vanban.chinhphu.vn/van-ban/88-2026-tt-btc-999111.htm'
    && vbItems.every((x) => x.tram === 'vanban_chinhphu'),
    JSON.stringify(vbItems));

  // 6. chuanHoaDaBao & phanTichMucRadar với napSo(ROOT) thật
  const soThat = napSo(ROOT);
  const daBao = chuanHoaDaBao([
    {
      title: '[radar] VB mới 2026-11-25: 1 văn bản thuộc phạm vi',
      body: '- [ ] **88/2026/TT-BTC** — Hướng dẫn thuế nhập khẩu ([nguồn](https://vanban.chinhphu.vn/van-ban/88-2026-tt-btc-999111.htm))',
    },
    'https://congbao.chinhphu.vn/van-ban/thong-tu-so-77-2026-tt-byt-470777.htm',
  ]);
  const combinedItems = [
    ...rssItems,
    ...vbItems,
    {
      soHieu: '77/2026/TT-BYT',
      moTa: 'Quy định kiểm tra thiết bị y tế và mỹ phẩm nhập khẩu',
      ngay: '24/11/2026',
      url: 'https://congbao.chinhphu.vn/van-ban/thong-tu-so-77-2026-tt-byt-470777.htm',
      tram: 'congbao',
    },
    {
      soHieu: '500/2026/QĐ-TTg',
      moTa: 'Quyết định bổ nhiệm nhân sự hội đồng trường đại học công lập',
      ngay: '24/11/2026',
      url: 'https://congbao.chinhphu.vn/van-ban/quyet-dinh-500-2026-qd-ttg-470888.htm',
      tram: 'congbao',
    },
  ];

  const kqPhanTich = phanTichMucRadar(combinedItems, { so: soThat, daBao });
  t('phanTichMucRadar: bỏ 154/2026/TT-BTC vào bo_qua_da_co (đối chiếu napSo() thật), khử trùng liên trạm 99/2026/TT-BCT',
    kqPhanTich.bo_qua_da_co.length === 1
    && kqPhanTich.bo_qua_da_co[0].soHieu === '154/2026/TT-BTC'
    && kqPhanTich.bo_qua_da_bao.length === 2
    && kqPhanTich.ngoai_pham_vi.length === 1
    && kqPhanTich.ngoai_pham_vi[0].soHieu === '500/2026/QĐ-TTg'
    && kqPhanTich.moi.length === 2
    && kqPhanTich.moi.map((x) => x.soHieu).join(',') === '99/2026/TT-BCT,420/2026/NĐ-CP',
    JSON.stringify({
      moi: kqPhanTich.moi.map((x) => x.soHieu),
      daCo: kqPhanTich.bo_qua_da_co.map((x) => x.soHieu),
      daBao: kqPhanTich.bo_qua_da_bao.map((x) => x.soHieu),
      ngoai: kqPhanTich.ngoai_pham_vi.map((x) => x.soHieu),
    }));

  // 7. dinhDangMarkdownRadar + best-effort fallback qua chayRadar
  const kqBestEffort = await chayRadar({
    root: ROOT,
    fetchFn: async (url) => {
      if (url.includes('congbao.chinhphu.vn')) {
        return { ok: true, status: 200, text: async () => sampleRss };
      }
      return { ok: false, status: 403, statusText: 'Forbidden', text: async () => '' };
    },
  });
  const md = dinhDangMarkdownRadar(kqBestEffort);
  t('chayRadar + dinhDangMarkdownRadar: trạm phụ 403 ghi loi_tram nhưng không gãy khi trạm chính chạy, Markdown có checklist',
    kqBestEffort.tram_thanh_cong.includes('congbao')
    && kqBestEffort.loi_tram.length === 1
    && kqBestEffort.loi_tram[0].tram === 'vanban_chinhphu'
    && kqBestEffort.moi.length === 1
    && md.includes('- [ ] **99/2026/TT-BCT**')
    && md.includes('Cảnh báo trạm'),
    JSON.stringify({ tram: kqBestEffort.tram_thanh_cong, loi: kqBestEffort.loi_tram }));

  // 8. E2E CLI trong tmpdir() với --offline-rss, --da-bao-json, --markdown, --json, --root
  const workDir = makeTmp('oz-radar-e2e-');
  const tmpRepo = join(workDir, 'repo');
  cpSync(join(ROOT, 'registry'), join(tmpRepo, 'registry'), { recursive: true });

  const rssFile = join(workDir, 'feed.rss');
  writeFileSync(rssFile, `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <item>
    <description><![CDATA[Thông tư sửa đổi thủ tục hải quan biên giới]]></description>
    <pubDate>Thu, 26 Nov 2026 00:00:00 GMT</pubDate>
    <link>https://congbao.chinhphu.vn/van-ban/thong-tu-so-154-2026-tt-btc-470500.htm</link>
  </item>
  <item>
    <description><![CDATA[Thông tư quy định hạn ngạch thuế quan nhập khẩu thuốc lá nguyên liệu]]></description>
    <pubDate>Thu, 26 Nov 2026 00:00:00 GMT</pubDate>
    <link>https://congbao.chinhphu.vn/van-ban/thong-tu-so-25-2026-tt-bct-470901.htm</link>
  </item>
  <item>
    <description><![CDATA[Nghị định mới về mã số hàng hóa và phân loại hàng xuất nhập khẩu]]></description>
    <pubDate>Thu, 26 Nov 2026 00:00:00 GMT</pubDate>
    <link>https://congbao.chinhphu.vn/van-ban/nghi-dinh-so-430-2026-nd-cp-470902.htm</link>
  </item>
  <item>
    <description><![CDATA[Quyết định bổ nhiệm cán bộ quản lý đào tạo]]></description>
    <pubDate>Thu, 26 Nov 2026 00:00:00 GMT</pubDate>
    <link>https://congbao.chinhphu.vn/van-ban/quyet-dinh-so-999-qd-ttg-470903.htm</link>
  </item>
</channel></rss>`, 'utf8');

  const daBaoFile = join(workDir, 'da-bao.json');
  writeFileSync(daBaoFile, JSON.stringify({ '25/2026/TT-BCT': { issue: '#100' } }), 'utf8');
  const mdFile = join(workDir, 'bao-cao', 'radar.md');

  const cli = spawnSync(
    process.execPath,
    [
      join(ROOT, 'tools/radar-luat-moi.mjs'),
      '--offline-rss',
      rssFile,
      '--da-bao-json',
      daBaoFile,
      '--markdown',
      mdFile,
      '--json',
      '--root',
      tmpRepo,
    ],
    { encoding: 'utf8' }
  );

  let parsed = null;
  try { parsed = JSON.parse(cli.stdout); } catch { /* noop */ }
  const mdContent = existsSync(mdFile) ? readFileSync(mdFile, 'utf8') : '';

  t('CLI --offline-rss --da-bao-json --markdown --json --root trong tmpdir()',
    cli.status === 0
    && parsed !== null
    && parsed.che_do === 'offline_rss'
    && parsed.thong_ke.moi === 1
    && parsed.thong_ke.bo_qua_da_co === 1
    && parsed.thong_ke.bo_qua_da_bao === 1
    && parsed.thong_ke.ngoai_pham_vi === 1
    && parsed.moi[0].soHieu === '430/2026/ND-CP'
    && mdContent.includes('- [ ] **430/2026/ND-CP**'),
    `status=${cli.status} stderr=${cli.stderr} stdout=${cli.stdout}`);
} finally {
  for (const d of tmpDirs) {
    rmSync(d, { recursive: true, force: true });
  }
}

console.log(`TONG: ${pass} PASS, ${fail} FAIL`);
process.exit(fail > 0 ? 1 : 0);
