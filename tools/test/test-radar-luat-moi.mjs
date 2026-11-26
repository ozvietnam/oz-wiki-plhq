// Unit & E2E tests (100% offline) cho tools/radar-luat-moi.mjs (Radar v2: 5 trạm, lọc nhiễu, sổ bỏ qua)
// và chạy kèm bộ kiểm thử tools/test/test-nap-stub-radar.mjs.
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT, khoa, napSo } from '../lib/registry.mjs';
import {
  chayRadar,
  chuanHoaDaBao,
  daCoTrongSo,
  dinhDangMarkdownRadar,
  docRssCongBao,
  docTrangHaiQuan,
  docTrangMoit,
  docTrangPvtm,
  docTrangVanBanChinhPhu,
  laVoSpaHaiQuan,
  phanTichMucRadar,
  soHieuTuSlug,
  soHieuTuTieuDe,
  thuocPhamVi,
} from '../radar-luat-moi.mjs';
import { chayTestNapStubRadar } from './test-nap-stub-radar.mjs';

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
  t('soHieuTuSlug: slug cổng MOIT chứa số hiệu ở giữa (quyet-dinh-so-2991-qd-bct-...html, van-ban-so-9846-bct-tttn-...html)',
    soHieuTuSlug('https://moit.gov.vn/van-ban-phap-luat/quyet-dinh-so-2991-qd-bct-ban-hanh-ke-hoach.html') === '2991/QD-BCT'
    && soHieuTuSlug('https://moit.gov.vn/van-ban-phap-luat/van-ban-dieu-hanh/van-ban-so-9846-bct-tttn-ve-viec-thong-bao.html') === '9846/BCT-TTTN');
  t('soHieuTuSlug: URL không phải văn bản trả về null',
    soHieuTuSlug('https://congbao.chinhphu.vn/tin-tuc/thong-bao.htm') === null);

  // 2. soHieuTuTieuDe
  t('soHieuTuTieuDe: 28/2026/TT-BCT',
    soHieuTuTieuDe('Thông tư số 28/2026/TT-BCT ngày 15/10/2026 về quy tắc xuất xứ hàng hóa') === '28/2026/TT-BCT');
  t('soHieuTuTieuDe: 11/2026/QH16',
    soHieuTuTieuDe('Luật Thuế xuất khẩu số 11/2026/QH16 của Quốc hội') === '11/2026/QH16');
  t('soHieuTuTieuDe: 72/2026/NĐ-CP',
    soHieuTuTieuDe('Nghị định số 72/2026/NĐ-CP quy định chi tiết Luật Hải quan') === '72/2026/NĐ-CP');
  t('soHieuTuTieuDe: chuẩn hoá khoảng trắng 589/TB- VPCP & công văn 10094/BCT-TTTN',
    soHieuTuTieuDe('Thông báo 589/TB- VPCP kết luận cuộc họp') === '589/TB-VPCP'
    && soHieuTuTieuDe('Văn bản số 10094/BCT-TTTN về điều hành xăng dầu') === '10094/BCT-TTTN');
  t('soHieuTuTieuDe: không nhận nhầm ngày tháng 23/11/2026',
    soHieuTuTieuDe('Văn bản ban hành ngày 23/11/2026 về kế hoạch công tác') === null);

  // 3. thuocPhamVi (gồm khóa siết 'công bố' cụ thể & TU_LOAI mới)
  t('thuocPhamVi: nhận diện đúng văn bản XNK, hải quan, KTCN, công bố hợp quy/sản phẩm/mỹ phẩm, PVTM, FTA, C/O',
    thuocPhamVi('28/2026/TT-BCT', 'Quy định quy tắc xuất xứ hàng hóa và cấp C/O theo FTA thế hệ mới')
    && thuocPhamVi('72/2026/NĐ-CP', 'Sửa đổi biểu thuế xuất khẩu, thuế nhập khẩu ưu đãi và thủ tục hải quan')
    && thuocPhamVi('10/2026/TT-BCT', 'Danh mục hóa chất hạn chế sản xuất, kinh doanh và xăng dầu')
    && thuocPhamVi('12/2026/TT-BYT', 'Quản lý mỹ phẩm, thuốc, thiết bị y tế và an toàn thực phẩm nhập khẩu')
    && thuocPhamVi('15/2026/TT-BNNMT', 'Kiểm dịch thực vật, động vật, phân bón và gỗ xuất khẩu')
    && thuocPhamVi('20/2026/TT-BKHCN', 'Hướng dẫn công bố hợp quy, công bố hợp chuẩn và tự công bố sản phẩm')
    && thuocPhamVi('22/2026/TT-BYT', 'Quy định phiếu công bố mỹ phẩm và công bố lưu hành')
    && thuocPhamVi('2927/QĐ-BCT', 'Áp dụng biện pháp chống bán phá giá và chống trợ cấp')
    && thuocPhamVi('21/2026/TT-BTC', 'Quy đi\u0323nh qua\u0309n ly\u0301 ha\u0300ng ho\u0301a xu\u00e2\u0301t nh\u00e2\u0323p kh\u00e2\u0309u (chuỗi NFD)'));

  t('thuocPhamVi: chặn false-positive 2531/QĐ-BTP ("công bố" đơn lẻ / trợ giúp pháp lý / dữ liệu mở) và nhiễu mời thầu / ngân sách / quy hoạch thăm dò / kiện toàn BCĐ',
    !thuocPhamVi('2531/QĐ-BTP', 'Về việc công bố danh mục dữ liệu mở, dữ liệu giao dịch và ban hành Hướng dẫn kết nối, chia sẻ, khai thác sử dụng dữ liệu của Hệ thống thông tin trợ giúp pháp lý')
    && !thuocPhamVi('100/QĐ-BTP', 'Về việc công bố danh mục thủ tục hành chính lĩnh vực hộ tịch')
    && !thuocPhamVi('01/2026/TT-BGDDT', 'Ban hành tiêu chuẩn cơ sở vật chất trường học trong lĩnh vực giáo dục đào tạo')
    && !thuocPhamVi('02/2026/QD-TTg', 'Quyết định bổ nhiệm nhân sự nội bộ và xếp lương công chức')
    && !thuocPhamVi('03/2026/TT-BVHTTDL', 'Quy chuẩn hoạt động văn hóa thể thao quần chúng')
    && !thuocPhamVi('2220/QD-TTG', 'Về việc ban hành Quy trình vận hành liên hồ chứa trên lưu vực sông Mã')
    && !thuocPhamVi('501/QĐ-PVTM', 'Cục Phòng vệ thương mại công khai mời thầu nhằm lựa chọn nhà thầu tư vấn trong các vụ việc phòng vệ thương mại')
    && !thuocPhamVi('502/QĐ-BCT', 'Quyết định công bố công khai điều chỉnh dự toán thu, chi ngân sách nhà nước năm 2026')
    && !thuocPhamVi('2957/QĐ-BCT', 'Quyết định phê duyệt điều chỉnh Quy hoạch thăm dò, khai thác khoáng sản làm vật liệu xây dựng')
    && !thuocPhamVi('3060/QĐ-BCT', 'Quyết định về việc kiện toàn Ban Chỉ đạo chống buôn lậu, gian lận thương mại và hàng giả'));

  // 4. daCoTrongSo: khử trùng thông minh biến thể năm & VBHN
  const mockSoBienThe = {
    theoKhoa: new Map([
      [khoa('2017/2026/QĐ-BTC'), [{ so_hieu: '2017/2026/QĐ-BTC', ngay_ban_hanh: '2026-10-15' }]],
      [khoa('888/QĐ-BCT'), [{ so_hieu: '888/QĐ-BCT', ngay_ban_hanh: '2026-09-01' }]],
      [khoa('777/QĐ-BCT'), [{ so_hieu: '777/QĐ-BCT', ngay_ban_hanh: '2020-05-01' }]],
      [khoa('116/VBHN-BNNMT'), [{ so_hieu: '116/VBHN-BNNMT', ngay_ban_hanh: '2026-11-20' }]],
      [khoa('205/2026/VBHN-TT-BTC'), [{ so_hieu: '205/2026/VBHN-TT-BTC', ngay_ban_hanh: '2026-11-10' }]],
    ]),
  };
  t('daCoTrongSo: khớp hai chiều biến thể năm (2017/QĐ-BTC <-> 2017/2026/QĐ-BTC) và VBHN-TT-<BỘ> <-> VBHN-<BỘ>, không trùng nhầm khác năm',
    daCoTrongSo('2017/QĐ-BTC', '15/10/2026', mockSoBienThe) === true
    && daCoTrongSo('2017/QĐ-BTC', '15/10/2021', mockSoBienThe) === false
    && daCoTrongSo('888/2026/QĐ-BCT', '01/09/2026', mockSoBienThe) === true
    && daCoTrongSo('777/2026/QĐ-BCT', '01/05/2026', mockSoBienThe) === false
    && daCoTrongSo('116/2026/VBHN-TT-BNNMT', '20/11/2026', mockSoBienThe) === true
    && daCoTrongSo('205/VBHN-BTC', '10/11/2026', mockSoBienThe) === true);

  // 5. docRssCongBao & docTrangVanBanChinhPhu
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

  // 6. Trạm 3 (docTrangMoit), Trạm 4 (docTrangPvtm), Trạm 5 (docTrangHaiQuan + laVoSpaHaiQuan)
  const sampleMoitHtml = `
    <nav><a href="/van-ban-phap-luat/van-ban-phap-quy">Văn bản pháp quy</a></nav>
    <table>
      <tr><th>STT</th><th>Tên văn bản</th><th>Số hiệu</th><th>Ngày ban hành</th><th>File đính kèm</th></tr>
      <tr>
        <td>1</td>
        <td><a href="/van-ban-phap-luat/thong-tu-68-2026-tt-bct.html" title="Thông tư quy định tỷ lệ hao hụt xăng dầu trong hoạt động kinh doanh và nhập khẩu xăng dầu">Thông tư quy định tỷ lệ hao hụt xăng dầu...</a></td>
        <td>68/2026/TT-BCT</td>
        <td>30/10/2026</td>
        <td><a href="/upload/2005517/20261103/1_TT_2026_68.pdf"><span class="fa fa-download"></span></a></td>
      </tr>
      <tr>
        <td>2</td>
        <td><a href="/van-ban-phap-luat/thong-bao-gia-xang-dau.html">Văn bản số 10094/BCT-TTTN điều hành xăng dầu</a></td>
        <td>Số: 10094/BCT-TTTN</td>
        <td>26/11/2026</td>
        <td></td>
      </tr>
    </table>`;
  const moitItems = docTrangMoit(sampleMoitHtml, 'https://moit.gov.vn/van-ban-phap-luat');
  t('docTrangMoit: trích xuất bảng VBPL Bộ Công Thương (TT-BCT, BCT-*, ngày, pdfUrl, title đầy đủ) và bỏ link menu',
    moitItems.length === 2
    && moitItems[0].soHieu === '68/2026/TT-BCT'
    && moitItems[0].ngay === '30/10/2026'
    && moitItems[0].pdfUrl === 'https://moit.gov.vn/upload/2005517/20261103/1_TT_2026_68.pdf'
    && moitItems[0].moTa.includes('nhập khẩu xăng dầu')
    && moitItems[1].soHieu === '10094/BCT-TTTN'
    && moitItems.every((x) => x.tram === 'moit_vbpl'),
    JSON.stringify(moitItems));

  const samplePvtmHtml = `
    <nav>
      <a href="?page=news&do=browse&category_id=ba011a30">Quyết định miễn trừ</a>
      <a href="?page=legal&category_id=7c13fdf9">Quyết định miễn trừ</a>
    </nav>
    <div class="card">
      <div class="news__body">
        <h3 class="news__title">
          <a href="./default.aspx?page=news-detail&do=detail&id=41933671">Bộ Công Thương ban hành Quyết định số 2927/QĐ-BCT về kết quả rà soát biện pháp chống bán phá giá đối với cáp thép</a>
        </h3>
        <div class="news__info">04/11/2026</div>
      </div>
    </div>`;
  const pvtmItems = docTrangPvtm(samplePvtmHtml, 'https://pvtm.gov.vn/');
  t('docTrangPvtm: trích xuất bài chi tiết QĐ-BCT kèm ngày phát hành, bỏ qua menu danh mục do=browse',
    pvtmItems.length === 1
    && pvtmItems[0].soHieu === '2927/QĐ-BCT'
    && pvtmItems[0].ngay === '04/11/2026'
    && pvtmItems[0].url === 'https://pvtm.gov.vn/default.aspx?page=news-detail&do=detail&id=41933671'
    && pvtmItems[0].tram === 'pvtm',
    JSON.stringify(pvtmItems));

  const sampleCustomsJson = JSON.stringify({
    items: [
      {
        so_hieu: '18391/CHQ-NVTHQ',
        noi_dung_tom_tat: 'Hướng dẫn phân loại hàng hóa và thủ tục hải quan nhập khẩu linh kiện',
        ngay_ban_hanh: '2026-11-20',
        url_chi_tiet: '/index.jsp?pageId=3&id=9988',
        pdf_url_primary: 'https://files.customs.gov.vn/2026/11/18391-chq.pdf',
      },
    ],
  });
  const hqJsonItems = docTrangHaiQuan(sampleCustomsJson, 'https://www.customs.gov.vn/');
  const sampleCustomsSpa = '<!DOCTYPE html><html><head><script>var b="bridge?url=/customs";</script></head><body><div id="main"></div></body></html>';
  t('docTrangHaiQuan & laVoSpaHaiQuan: parse JSON payload Hải quan và nhận diện chính xác vỏ SPA rỗng (<div id="main"></div>)',
    hqJsonItems.length === 1
    && hqJsonItems[0].soHieu === '18391/CHQ-NVTHQ'
    && hqJsonItems[0].pdfUrl === 'https://files.customs.gov.vn/2026/11/18391-chq.pdf'
    && hqJsonItems[0].tram === 'customs'
    && docTrangHaiQuan(sampleCustomsSpa).length === 0
    && laVoSpaHaiQuan(sampleCustomsSpa) === true,
    JSON.stringify(hqJsonItems));

  // 7. chuanHoaDaBao, boQua (sổ loại trừ vĩnh viễn) & phanTichMucRadar với napSo(ROOT) thật
  const soThat = napSo(ROOT);
  const daBao = chuanHoaDaBao([
    {
      title: '[radar] VB mới 2026-11-25: 1 văn bản thuộc phạm vi',
      body: '- [ ] **88/2026/TT-BTC** — Hướng dẫn thuế nhập khẩu ([nguồn](https://vanban.chinhphu.vn/van-ban/88-2026-tt-btc-999111.htm))',
    },
    'https://congbao.chinhphu.vn/van-ban/thong-tu-so-77-2026-tt-byt-470777.htm',
  ]);
  const boQuaLedger = JSON.parse(readFileSync(join(ROOT, 'data/radar-bo-qua.json'), 'utf8'));
  const combinedItems = [
    ...rssItems,
    ...vbItems,
    {
      soHieu: '2531/QĐ-BTP',
      moTa: 'Về việc công bố danh mục dữ liệu mở của Hệ thống thông tin trợ giúp pháp lý',
      ngay: '23/11/2026',
      url: 'https://vanban.chinhphu.vn/?pageid=27160&docid=220345',
      tram: 'vanban_chinhphu',
    },
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

  const kqPhanTich = phanTichMucRadar(combinedItems, { so: soThat, daBao, boQua: boQuaLedger });
  t('phanTichMucRadar: đối chiếu napSo(), sổ loại trừ bo_qua_loai_tru (2531/QĐ-BTP) và khử trùng liên trạm',
    kqPhanTich.bo_qua_da_co.length === 1
    && kqPhanTich.bo_qua_da_co[0].soHieu === '154/2026/TT-BTC'
    && kqPhanTich.bo_qua_loai_tru.length === 1
    && kqPhanTich.bo_qua_loai_tru[0].soHieu === '2531/QĐ-BTP'
    && kqPhanTich.bo_qua_da_bao.length === 2
    && kqPhanTich.ngoai_pham_vi.length === 1
    && kqPhanTich.ngoai_pham_vi[0].soHieu === '500/2026/QĐ-TTg'
    && kqPhanTich.moi.length === 2
    && kqPhanTich.moi.map((x) => x.soHieu).join(',') === '99/2026/TT-BCT,420/2026/NĐ-CP',
    JSON.stringify({
      moi: kqPhanTich.moi.map((x) => x.soHieu),
      daCo: kqPhanTich.bo_qua_da_co.map((x) => x.soHieu),
      loaiTru: kqPhanTich.bo_qua_loai_tru.map((x) => x.soHieu),
      daBao: kqPhanTich.bo_qua_da_bao.map((x) => x.soHieu),
      ngoai: kqPhanTich.ngoai_pham_vi.map((x) => x.soHieu),
    }));

  // 8. chayRadar 5 trạm: trạm phụ lỗi / customs trả SPA rỗng đều ghi cảnh báo mà không gãy
  const kqBestEffort = await chayRadar({
    root: ROOT,
    boQua: null,
    fetchFn: async (url) => {
      if (url.includes('congbao.chinhphu.vn')) {
        return { ok: true, status: 200, text: async () => sampleRss };
      }
      if (url.includes('customs.gov.vn')) {
        return { ok: true, status: 200, text: async () => sampleCustomsSpa };
      }
      return { ok: false, status: 403, statusText: 'Forbidden', text: async () => '' };
    },
  });
  const md = dinhDangMarkdownRadar(kqBestEffort);
  t('chayRadar 5 trạm + dinhDangMarkdownRadar: trạm 403 vào loi_tram, customs SPA rỗng vào canh_bao_tram, Markdown hiển thị đầy đủ',
    kqBestEffort.tram_thanh_cong.includes('congbao')
    && kqBestEffort.loi_tram.length === 3
    && kqBestEffort.canh_bao_tram.length === 1
    && kqBestEffort.canh_bao_tram[0].tram === 'customs'
    && kqBestEffort.moi.length === 1
    && md.includes('- **Đã loại trừ (sổ bỏ qua)**: 0')
    && md.includes('- [ ] **99/2026/TT-BCT**')
    && md.includes('Cảnh báo trạm')
    && md.includes('SPA rỗng'),
    JSON.stringify({ tram: kqBestEffort.tram_thanh_cong, loi: kqBestEffort.loi_tram, cb: kqBestEffort.canh_bao_tram }));

  // 9. E2E CLI trong tmpdir() với --offline-rss, --da-bao-json, --bo-qua-json, --markdown, --json, --root
  const workDir = makeTmp('oz-radar-e2e-');
  const tmpRepo = join(workDir, 'repo');
  cpSync(join(ROOT, 'registry'), join(tmpRepo, 'registry'), { recursive: true });
  cpSync(join(ROOT, 'data/radar-bo-qua.json'), join(tmpRepo, 'data/radar-bo-qua.json'));

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
    <title>Quyết định 2531/QĐ-BTP</title>
    <description><![CDATA[Về việc công bố danh mục dữ liệu mở của Hệ thống thông tin trợ giúp pháp lý]]></description>
    <pubDate>Thu, 26 Nov 2026 00:00:00 GMT</pubDate>
    <link>https://vanban.chinhphu.vn/?pageid=27160&amp;docid=220345</link>
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
      '--bo-qua-json',
      join(tmpRepo, 'data/radar-bo-qua.json'),
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

  t('CLI --offline-rss --da-bao-json --bo-qua-json --markdown --json --root trong tmpdir()',
    cli.status === 0
    && parsed !== null
    && parsed.che_do === 'offline_rss'
    && parsed.thong_ke.moi === 1
    && parsed.thong_ke.bo_qua_da_co === 1
    && parsed.thong_ke.bo_qua_da_bao === 1
    && parsed.thong_ke.bo_qua_loai_tru === 1
    && parsed.thong_ke.ngoai_pham_vi === 1
    && parsed.moi[0].soHieu === '430/2026/ND-CP'
    && mdContent.includes('- [ ] **430/2026/ND-CP**'),
    `status=${cli.status} stderr=${cli.stderr} stdout=${cli.stdout}`);
} finally {
  for (const d of tmpDirs) {
    rmSync(d, { recursive: true, force: true });
  }
}

// 10. Chạy tiếp toàn bộ kiểm thử của tools/test/test-nap-stub-radar.mjs để npm test tự bao phủ mà không sửa package.json
const kqNapStub = await chayTestNapStubRadar();
pass += kqNapStub.pass;
fail += kqNapStub.fail;

console.log(`TONG: ${pass} PASS, ${fail} FAIL`);
process.exit(fail > 0 ? 1 : 0);
