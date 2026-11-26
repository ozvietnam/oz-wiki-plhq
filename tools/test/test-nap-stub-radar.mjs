// Unit & E2E tests (100% offline) cho tools/nap-stub-radar.mjs (kể cả vòng lặp thẻ nhu-cau / [BỔ SUNG SỔ])
// và chuỗi kiểm thử tools/test/test-tram-hai-quan-headless.mjs.
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import yaml from 'js-yaml';
import { kiemTra } from '../kiem-tra.mjs';
import { ROOT, napSo } from '../lib/registry.mjs';
import {
  chayNapStubRadar,
  chuanHoaNgayBanHanh,
  chuanHoaSoHieuStub,
  dinhDangMarkdownNapStub,
  laSoHieuChiVienDan,
  laUrlNguonBacAVietNam,
  suyLoaiVaCoQuan,
  suyNhanhTuMoTa,
  timNguonBacAChoNhuCau,
  trichNgayBanHanhTuHtml,
  trichPdfBacATuHtmlChiTiet,
  trichUngVienTuIssuesNhuCau,
} from '../nap-stub-radar.mjs';
import { timUngVienTuTai } from '../tu-tai-toan-van.mjs';
import { chayTestTramHaiQuanHeadless } from './test-tram-hai-quan-headless.mjs';

export async function chayTestNapStubRadar() {
  let pass = 0;
  let fail = 0;
  const t = (name, cond, extra = '') => {
    if (cond) {
      pass += 1;
      console.log(`PASS [nap-stub-radar] ${name}`);
    } else {
      fail += 1;
      console.log(`FAIL [nap-stub-radar] ${name} ${extra}`);
    }
  };

  const tmpDirs = [];
  const makeTmp = (prefix) => {
    const d = mkdtempSync(join(tmpdir(), prefix));
    tmpDirs.push(d);
    return d;
  };

  const taoRepoTam = () => {
    const workDir = makeTmp('oz-nap-stub-');
    const tmpRepo = join(workDir, 'repo');
    mkdirSync(join(tmpRepo, 'registry', 'van-ban'), { recursive: true });
    for (const cfg of ['cay-xnk.yaml', 'co-quan.yaml', 'nguon-uy-tin.yaml']) {
      cpSync(join(ROOT, 'registry', cfg), join(tmpRepo, 'registry', cfg));
    }
    // Chép 2 văn bản thật để đối chiếu trùng số hiệu & biến thể năm
    for (const f of ['154-2026-tt-btc.yaml', '01-2018-tt-bct.yaml']) {
      const src = join(ROOT, 'registry', 'van-ban', f);
      if (existsSync(src)) {
        cpSync(src, join(tmpRepo, 'registry', 'van-ban', f));
      }
    }
    return { workDir, tmpRepo };
  };

  try {
    const soThat = napSo(ROOT);
    const coQuanSet = new Set(soThat.coQuan.map((c) => c.ky_hieu));
    const nutSet = new Set(soThat.nutCay.flatMap((n) => [n.path, n.id]));

    // 1. chuanHoaSoHieuStub & suyLoaiVaCoQuan
    t(
      'chuanHoaSoHieuStub: chuẩn hoá ND- -> NĐ-, QD- -> QĐ-, -TTG -> -TTg và loại chuỗi mơ hồ',
      chuanHoaSoHieuStub('430/2026/ND-CP') === '430/2026/NĐ-CP' &&
        chuanHoaSoHieuStub('2220/QD-TTG') === '2220/QĐ-TTg' &&
        chuanHoaSoHieuStub('Số: 10094/BCT-TTTN') === '10094/BCT-TTTN' &&
        chuanHoaSoHieuStub('không rõ số') === null &&
        chuanHoaSoHieuStub('') === null
    );

    const kqLuat = suyLoaiVaCoQuan('11/2026/QH16', 'Luật Hải quan sửa đổi', coQuanSet);
    const kqNd = suyLoaiVaCoQuan('430/2026/NĐ-CP', 'Nghị định biểu thuế', coQuanSet);
    const kqTt = suyLoaiVaCoQuan('99/2026/TT-BCT', 'Thông tư quy tắc xuất xứ', coQuanSet);
    const kqQd = suyLoaiVaCoQuan('2927/QĐ-BCT', 'Quyết định chống bán phá giá', coQuanSet);
    const kqVbhn = suyLoaiVaCoQuan('116/2026/VBHN-TT-BNNMT', 'Văn bản hợp nhất kiểm dịch', coQuanSet);
    const kqCv = suyLoaiVaCoQuan('10094/BCT-TTTN', 'Công văn điều hành xăng dầu', coQuanSet);
    const kqBtp = suyLoaiVaCoQuan('2531/QĐ-BTP', 'Quyết định dữ liệu mở Bộ Tư pháp', coQuanSet);

    t(
      'suyLoaiVaCoQuan: suy đúng LOAI + co_quan hợp lệ và từ chối cơ quan ngoài sổ (BTP)',
      kqLuat.hopLe && kqLuat.loai === 'LUAT' && kqLuat.coQuan === 'QH' &&
        kqNd.hopLe && kqNd.loai === 'NGHI_DINH' && kqNd.coQuan === 'CP' &&
        kqTt.hopLe && kqTt.loai === 'THONG_TU' && kqTt.coQuan === 'BCT' &&
        kqQd.hopLe && kqQd.loai === 'QUYET_DINH' && kqQd.coQuan === 'BCT' &&
        kqVbhn.hopLe && kqVbhn.loai === 'VAN_BAN_HOP_NHAT' && kqVbhn.coQuan === 'BNNMT' &&
        kqCv.hopLe && kqCv.loai === 'CONG_VAN' && kqCv.coQuan === 'BCT' &&
        !kqBtp.hopLe && kqBtp.lyDo.startsWith('CO_QUAN_CHUA_CO_TRONG_SO')
    );

    // 2. laSoHieuChiVienDan
    t(
      'laSoHieuChiVienDan: chặn tin tức chỉ viện dẫn "theo Nghị quyết số 135/NQ-CP" nhưng giữ "Bộ Công Thương ban hành Quyết định số 2927/QĐ-BCT"',
      laSoHieuChiVienDan(
        '135/NQ-CP',
        'Quyết định công bố dự toán thực hiện tiết kiệm theo Nghị quyết số 135/NQ-CP của Chính phủ',
        'https://pvtm.gov.vn/default.aspx?page=news-detail&do=detail&id=abc'
      ) === true &&
        laSoHieuChiVienDan(
          '2927/QĐ-BCT',
          'Bộ Công Thương ban hành Quyết định số 2927/QĐ-BCT về kết quả rà soát biện pháp chống bán phá giá',
          'https://pvtm.gov.vn/default.aspx?page=news-detail&do=detail&id=def'
        ) === false
    );

    // 3. chuanHoaNgayBanHanh & trichNgayBanHanhTuHtml
    t(
      'chuanHoaNgayBanHanh & trichNgayBanHanhTuHtml: parse đa định dạng ngày VN, ISO, RSS pubDate và HTML chi tiết',
      chuanHoaNgayBanHanh('25/11/2026') === '2026-11-25' &&
        chuanHoaNgayBanHanh('4-8-2026') === '2026-08-04' &&
        chuanHoaNgayBanHanh('Thu, 26 Nov 2026 00:00:00 GMT') === '2026-11-26' &&
        trichNgayBanHanhTuHtml('<tr><td class="col1">Ngày ban hành</td><td>23-11-2026</td></tr>') === '2026-11-23' &&
        trichNgayBanHanhTuHtml('<p>Ban hành ngày 04 tháng 11 năm 2026 tại Hà Nội</p>') === '2026-11-04'
    );

    // 4. trichPdfBacATuHtmlChiTiet (cắt bảng "Các văn bản khác" ở cuối trang MOIT)
    const sampleMoitDetail = `
      <div class="detail-doc">
        <h1>Thông tư 68/2026/TT-BCT</h1>
        <p>Tải tệp đính kèm: <a href="/upload/2005517/20261103/TT_68_2026_BCT.pdf">Tải về</a></p>
      </div>
      <h3>Các văn bản khác</h3>
      <table>
        <thead><tr><th>STT</th><th>Tên văn bản</th></tr></thead>
        <tbody>
          <tr><td>1</td><td><a href="/upload/2005517/20261101/00_van_ban_khac.pdf">Khác</a></td></tr>
        </tbody>
      </table>
    `;
    const moitPdfs = trichPdfBacATuHtmlChiTiet(sampleMoitDetail, {
      baseUrl: 'https://moit.gov.vn/van-ban-phap-luat/thong-tu-68.html',
      nguon: soThat.nguon,
    });
    t(
      'trichPdfBacATuHtmlChiTiet: lấy đúng PDF chính trên moit.gov.vn và cắt bỏ PDF của bảng Các văn bản khác',
      moitPdfs.length === 1 && moitPdfs[0] === 'https://moit.gov.vn/upload/2005517/20261103/TT_68_2026_BCT.pdf',
      JSON.stringify(moitPdfs)
    );

    // 5. laUrlNguonBacAVietNam & suyNhanhTuMoTa
    t(
      'laUrlNguonBacAVietNam: chấp nhận congbao/vanban/datafiles/moit/pvtm/customs và chặn vbpl.vn / thuvienphapluat.vn',
      laUrlNguonBacAVietNam('https://congbao.chinhphu.vn/van-ban/a.htm', soThat.nguon) &&
        laUrlNguonBacAVietNam('https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/11/99.signed.pdf', soThat.nguon) &&
        laUrlNguonBacAVietNam('https://moit.gov.vn/van-ban-phap-luat/a.html', soThat.nguon) &&
        laUrlNguonBacAVietNam('https://pvtm.gov.vn/default.aspx?page=news-detail&id=1', soThat.nguon) &&
        laUrlNguonBacAVietNam('https://www.customs.gov.vn/index.jsp?pageId=3&id=1', soThat.nguon) &&
        !laUrlNguonBacAVietNam('https://vbpl.vn/tw/Pages/vbpq-toanvan.aspx?ItemID=1', soThat.nguon) &&
        !laUrlNguonBacAVietNam('https://thuvienphapluat.vn/van-ban/XNK/a.aspx', soThat.nguon)
    );

    const nhanhCbpg = suyNhanhTuMoTa(
      'Quyết định áp dụng thuế chống bán phá giá đối với thép cán nguội',
      { soHieu: '2927/QĐ-BCT', loai: 'QUYET_DINH', coQuan: 'BCT', nutHopLe: nutSet }
    );
    const nhanhCo = suyNhanhTuMoTa(
      'Quy định quy tắc xuất xứ hàng hóa trong Hiệp định CPTPP',
      { soHieu: '99/2026/TT-BCT', loai: 'THONG_TU', coQuan: 'BCT', nutHopLe: nutSet }
    );
    t(
      'suyNhanhTuMoTa: chỉ sinh nút hợp lệ trong cay-xnk.yaml',
      nhanhCbpg.includes('phong-ve-thuong-mai/chong-ban-pha-gia') &&
        nhanhCo.includes('xuat-xu-fta/quy-tac-xuat-xu') &&
        nhanhCo.includes('xuat-xu-fta/hiep-dinh/cptpp') &&
        [...nhanhCbpg, ...nhanhCo].every((n) => nutSet.has(n))
    );

    // 6. E2E chayNapStubRadar: làm giàu HTML -> PDF bậc A + ngày ban hành, kiemTra pass, khớp tu-tai-toan-van
    const { workDir, tmpRepo } = taoRepoTam();
    writeFileSync(
      join(tmpRepo, 'registry', 'van-ban', '2017-2026-qd-btc.yaml'),
      `# Stub test\nso_hieu: 2017/2026/QĐ-BTC\nloai: QUYET_DINH\nten: Quyết định thử nghiệm biến thể năm\nco_quan: BTC\nngay_ban_hanh: '2026-10-15'\ntinh_trang: CHUA_XAC_MINH\nnhanh:\n  - hai-quan/thu-tuc\nnguon:\n  - url: https://vanban.chinhphu.vn/?pageid=27160&docid=999001\n    truy_cap: '2026-10-16'\nxac_minh:\n  muc: CHUA_XAC_MINH\n  hieu_luc_da_doi_chieu: false\n  ngay: '2026-10-16'\n  boi: test\n`,
      'utf8'
    );

    const radarCandidates = [
      {
        soHieu: '99/2026/TT-BCT',
        moTa: 'Quy định mới về cấp giấy chứng nhận xuất xứ hàng hóa C/O',
        ngay: '',
        url: 'https://vanban.chinhphu.vn/?pageid=27160&docid=220999',
        tram: 'vanban_chinhphu',
      },
      {
        soHieu: '2927/QĐ-BCT',
        moTa: 'Bộ Công Thương ban hành Quyết định số 2927/QĐ-BCT về kết quả rà soát biện pháp chống bán phá giá đối với cáp thép',
        ngay: '04/11/2026',
        url: 'https://pvtm.gov.vn/default.aspx?page=news-detail&do=detail&id=41933671',
        tram: 'pvtm',
      },
      {
        soHieu: '2017/QĐ-BTC',
        moTa: 'Quyết định về thủ tục hải quan điện tử',
        ngay: '15/10/2026',
        url: 'https://vanban.chinhphu.vn/?pageid=27160&docid=999001',
        tram: 'vanban_chinhphu',
      },
      {
        soHieu: '101/2026/TT-BTC',
        moTa: 'Thông tư biểu thuế nhập khẩu',
        ngay: '20/11/2026',
        url: 'https://thuvienphapluat.vn/van-ban/Thue/101-2026-TT-BTC.aspx',
        tram: 'khac',
      },
      {
        soHieu: null,
        moTa: 'Thông báo tiếp nhận hồ sơ rà soát chống bán phá giá',
        ngay: '20/11/2026',
        url: 'https://pvtm.gov.vn/default.aspx?page=news-detail&do=detail&id=no-code',
        tram: 'pvtm',
      },
      {
        soHieu: '2531/QĐ-BTP',
        moTa: 'Quyết định dữ liệu mở',
        ngay: '23/11/2026',
        url: 'https://vanban.chinhphu.vn/?pageid=27160&docid=220345',
        tram: 'vanban_chinhphu',
      },
    ];

    const mockFetch = async (url) => {
      if (url.includes('docid=220999')) {
        return {
          ok: true,
          status: 200,
          url,
          text: async () => `
            <html><body>
              <table><tr><td class="col1">Ngày ban hành</td><td>25-11-2026</td></tr></table>
              <a href="https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/11/99-bct.signed.pdf">Tải PDF ký số</a>
            </body></html>`,
        };
      }
      if (url.includes('id=41933671')) {
        return {
          ok: true,
          status: 200,
          url,
          text: async () => `
            <html><body>
              <article class="post">
                <p>Tải Quyết định 2927/QĐ-BCT <a href="/data/files/QD2927_AR01.pdf">tại đây</a></p>
              </article>
            </body></html>`,
        };
      }
      return { ok: false, status: 404, url, text: async () => '' };
    };

    const kqNap = await chayNapStubRadar({
      items: radarCandidates,
      root: tmpRepo,
      fetchFn: mockFetch,
      today: '2026-11-26',
    });

    const stub99Path = join(tmpRepo, 'registry', 'van-ban', '99-2026-tt-bct.yaml');
    const stub2927Path = join(tmpRepo, 'registry', 'van-ban', '2927-qd-bct-2026.yaml');
    const stub99 = existsSync(stub99Path) ? yaml.load(readFileSync(stub99Path, 'utf8')) : null;
    const stub2927 = existsSync(stub2927Path) ? yaml.load(readFileSync(stub2927Path, 'utf8')) : null;
    const ktSauNap = kiemTra(napSo(tmpRepo), { root: tmpRepo });
    const ungVienTuTai = timUngVienTuTai({ root: tmpRepo, limit: 10, kiemTraPdf: false, coPdftotext: false });

    t(
      'chayNapStubRadar: tạo đúng 2 stub hợp lệ, gắn PDF bậc A lên đầu nguon[], điền ngay_ban_hanh từ HTML, pass kiemTra 0 lỗi',
      kqNap.thong_ke.da_tao === 2 &&
        kqNap.thong_ke.co_pdf_bac_a === 2 &&
        kqNap.thong_ke.bo_qua === 4 &&
        kqNap.da_tao.every((x) => x.nguon_ung_vien === 'radar') &&
        stub99 !== null &&
        stub99.tinh_trang === 'CHUA_XAC_MINH' &&
        stub99.ngay_ban_hanh === '2026-11-25' &&
        stub99.xac_minh.muc === 'CHUA_XAC_MINH' &&
        stub99.xac_minh.hieu_luc_da_doi_chieu === false &&
        stub99.nguon[0].url === 'https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/11/99-bct.signed.pdf' &&
        stub99.nguon[0].bac === 'A' &&
        stub99.nguon[1].url === 'https://vanban.chinhphu.vn/?pageid=27160&docid=220999' &&
        stub2927 !== null &&
        stub2927.nguon[0].url === 'https://pvtm.gov.vn/data/files/QD2927_AR01.pdf' &&
        ktSauNap.loi.length === 0,
      JSON.stringify({ kqNap, loi: ktSauNap.loi })
    );

    t(
      'Cầu nối sang tu-tai-toan-van: cả 2 stub mới đều lọt thẳng Nhóm 1 can_tai_toan_van với uu_tien_pdf = true',
      ungVienTuTai.can_tai_toan_van.some((u) => u.slug === '99-2026-tt-bct' && u.uu_tien_pdf === true) &&
        ungVienTuTai.can_tai_toan_van.some((u) => u.slug === '2927-qd-bct-2026' && u.uu_tien_pdf === true),
      JSON.stringify(ungVienTuTai.can_tai_toan_van)
    );

    // 7. Cổng kiểm kiemTra + rollback nguyên tử khi phát sinh lỗi
    const kqRollback = await chayNapStubRadar({
      items: [
        {
          soHieu: '77/2026/TT-BYT',
          moTa: 'Thông tư quản lý mỹ phẩm nhập khẩu bị giả lập lỗi kiemTra',
          ngay: '24/11/2026',
          url: 'https://congbao.chinhphu.vn/van-ban/thong-tu-so-77-2026-tt-byt-470777.htm',
          tram: 'congbao',
        },
        {
          soHieu: '78/2026/TT-BYT',
          moTa: 'Thông tư kiểm tra an toàn thực phẩm nhập khẩu hợp lệ',
          ngay: '25/11/2026',
          url: 'https://congbao.chinhphu.vn/van-ban/thong-tu-so-78-2026-tt-byt-470778.htm',
          tram: 'congbao',
        },
      ],
      root: tmpRepo,
      khongLayPdfUrl: true,
      kiemTraFn: (r) => {
        const real = kiemTra(napSo(r), { root: r });
        if (existsSync(join(r, 'registry', 'van-ban', '77-2026-tt-byt.yaml'))) {
          return {
            ...real,
            loi: [...real.loi, { file: 'registry/van-ban/77-2026-tt-byt.yaml', msg: 'lỗi giả lập kiểm cổng' }],
          };
        }
        return real;
      },
      today: '2026-11-26',
    });

    t(
      'Rollback nguyên tử: xoá ngay tệp YAML gây lỗi KIEM_TRA_SO_LOI nhưng vẫn tạo tiếp stub hợp lệ kế sau',
      !existsSync(join(tmpRepo, 'registry', 'van-ban', '77-2026-tt-byt.yaml')) &&
        existsSync(join(tmpRepo, 'registry', 'van-ban', '78-2026-tt-byt.yaml')) &&
        kqRollback.da_tao.length === 1 &&
        kqRollback.da_tao[0].so_hieu === '78/2026/TT-BYT' &&
        kqRollback.bo_qua.length === 1 &&
        kqRollback.bo_qua[0].ly_do === 'KIEM_TRA_SO_LOI',
      JSON.stringify(kqRollback)
    );

    // 8. Vòng lặp nhu cầu: trichUngVienTuIssuesNhuCau + timNguonBacAChoNhuCau + chayNapStubRadar (--tu-nhu-cau-json)
    const sampleNhuCauIssues = [
      // (a) Thẻ chuẩn từ ozplugin PR #571 (apps/gateway/src/bo-sung-so.ts): chỉ có số hiệu, chưa có URL nguồn
      {
        number: 512,
        title: '[BỔ SUNG SỔ] 88/2026/TT-BTC',
        body: 'Số hiệu 88/2026/TT-BTC trả found:false từ công cụ tra_hieu_luc_van_ban (registry legal_status của oz-wiki-plhq) lúc 2026-11-26T01:20:00.000Z. Yêu cầu: bổ sung hiệu lực văn bản này vào sổ. Thẻ do máy chủ Cổng tự tạo (OZV-1587) — không chứa mô tả hàng của khách.',
        url: 'https://github.com/ozvietnam/oz-wiki-plhq/issues/512',
      },
      // (b) Thẻ trùng cùng số hiệu 88/2026/TT-BTC (kiểm tra gộp issueNumbers [512, 515])
      {
        number: 515,
        title: '[miss] 88/2026/TT-BTC — khách tra 2 lần, sổ chưa có',
        body: 'Khách tra hiệu lực **88/2026/TT-BTC** qua `/api/dataset?resource=legal_status`.',
        url: 'https://github.com/ozvietnam/oz-wiki-plhq/issues/515',
      },
      // (c) Thẻ nhu cầu có đính sẵn link nguồn bậc A + PDF trong body
      {
        number: 520,
        title: '[BỔ SUNG SỔ] 64/2026/TT-BCT — Quy định hạn ngạch thuế quan nhập khẩu muối',
        body: 'Đề nghị bổ sung Thông tư 64/2026/TT-BCT ban hành ngày 18/11/2026.\nNguồn Công báo: https://congbao.chinhphu.vn/van-ban/thong-tu-so-64-2026-tt-bct-470640.htm\nBản ký số: https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/11/64-bct.signed.pdf',
        url: 'https://github.com/ozvietnam/oz-wiki-plhq/issues/520',
      },
      // (d) Thẻ kiểu issue #426 chứa danh sách URL thử nghiệm lỗi 404 / 0 kết quả dưới "## Các nguồn đã thử" -> KHÔNG lấy nhầm URL 404!
      {
        number: 426,
        title: '[miss] 23999/2026/CHQ-NVTHQ — sổ chưa có (chờ nguồn chính thống bậc A)',
        body: '## Nhu cầu\nVăn bản **23999/2026/CHQ-NVTHQ** ban hành ngày `03/11/2026` chưa có URL nguồn bậc A.\n\n## Các nguồn đã thử (ngày 2026-11-12)\n1. `https://vanban.chinhphu.vn/he-thong-van-ban?tukhoa=23999` — 0 kết quả.\n2. `https://files.customs.gov.vn/CustomsCMS/TONG_CUC/2026/11/3/23999.pdf` — HTTP 404.',
        url: 'https://github.com/ozvietnam/oz-wiki-plhq/issues/426',
      },
      // (e) Số hiệu cắt cụt mơ hồ (69/2018/N) & issue đã CLOSED -> loại ngay khi trích ứng viên
      {
        number: 420,
        title: '[miss] 69/2018/N — khách tra 1 lần, sổ chưa có',
        body: 'Khách tra **69/2018/N**.',
        url: 'https://github.com/ozvietnam/oz-wiki-plhq/issues/420',
      },
      {
        number: 401,
        state: 'CLOSED',
        title: '[BỔ SUNG SỔ] 12/2026/TT-BTC',
        body: 'Đã đóng.',
        url: 'https://github.com/ozvietnam/oz-wiki-plhq/issues/401',
      },
    ];

    const trichNc = trichUngVienTuIssuesNhuCau(sampleNhuCauIssues, { nguon: soThat.nguon });
    const uv88 = trichNc.find((x) => x.soHieu === '88/2026/TT-BTC');
    const uv64 = trichNc.find((x) => x.soHieu === '64/2026/TT-BCT');
    const uv23999 = trichNc.find((x) => x.soHieu === '23999/2026/CHQ-NVTHQ');

    t(
      'trichUngVienTuIssuesNhuCau: trích chuẩn [BỔ SUNG SỔ] & [miss], gộp thẻ trùng, lọc CLOSED/số cụt và không bốc nhầm URL 404',
      trichNc.length === 3 &&
        uv88 !== undefined &&
        uv88.url === '' &&
        JSON.stringify(uv88.issueNumbers) === JSON.stringify([512, 515]) &&
        uv64 !== undefined &&
        uv64.url === 'https://congbao.chinhphu.vn/van-ban/thong-tu-so-64-2026-tt-bct-470640.htm' &&
        uv64.pdfUrl === 'https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/11/64-bct.signed.pdf' &&
        uv64.ngay === '2026-11-18' &&
        uv23999 !== undefined &&
        uv23999.url === '',
      JSON.stringify(trichNc)
    );

    const mockFetchNhuCau = async (url) => {
      if (url.includes('vanban.chinhphu.vn/he-thong-van-ban') && url.includes('88%2F2026%2FTT-BTC')) {
        return {
          ok: true,
          status: 200,
          url,
          text: async () => `
            <table>
              <tr>
                <td><a href="/?pageid=27160&docid=220888"><span class="code">88/2026/TT-BTC</span></a></td>
                <td><span class="issued-date">21/11/2026</span></td>
                <td><a href="/?pageid=27160&docid=220888"><span class="substract">Quy định mức thu phí hải quan và lệ phí hàng hóa quá cảnh</span></a></td>
              </tr>
            </table>`,
        };
      }
      if (url.includes('docid=220888')) {
        return {
          ok: true,
          status: 200,
          url,
          text: async () => `
            <html><body>
              <table><tr><td>Ngày ban hành</td><td>21-11-2026</td></tr></table>
              <div class="substract">Quy định mức thu phí hải quan và lệ phí hàng hóa quá cảnh</div>
              <a href="https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/11/88-btc.signed.pdf">Tải PDF ký số</a>
            </body></html>`,
        };
      }
      return { ok: false, status: 404, url, text: async () => '' };
    };

    const tim88 = await timNguonBacAChoNhuCau('88/2026/TT-BTC', {
      nguon: soThat.nguon,
      fetchFn: mockFetchNhuCau,
    });
    t(
      'timNguonBacAChoNhuCau: dò vanban.chinhphu.vn tìm đúng trang chi tiết + link PDF ký số + ngày ban hành + trích yếu',
      tim88 !== null &&
        tim88.url === 'https://vanban.chinhphu.vn/?pageid=27160&docid=220888' &&
        tim88.pdfUrl === 'https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/11/88-btc.signed.pdf' &&
        tim88.ngay === '2026-11-21' &&
        tim88.moTa.includes('phí hải quan'),
      JSON.stringify(tim88)
    );

    // Chạy chayNapStubRadar khi Radar có 0 mục mới nhưng có thẻ nhu-cau mở
    const kqNhuCau = await chayNapStubRadar({
      items: [],
      issuesNhuCau: sampleNhuCauIssues,
      root: tmpRepo,
      khongLayPdfUrl: true,
      fetchFn: mockFetchNhuCau,
      today: '2026-11-26',
    });

    const mdNhuCau = dinhDangMarkdownNapStub(kqNhuCau);
    const stub88Path = join(tmpRepo, 'registry', 'van-ban', '88-2026-tt-btc.yaml');
    const stub64Path = join(tmpRepo, 'registry', 'van-ban', '64-2026-tt-bct.yaml');
    const stub88 = existsSync(stub88Path) ? yaml.load(readFileSync(stub88Path, 'utf8')) : null;
    const stub64 = existsSync(stub64Path) ? yaml.load(readFileSync(stub64Path, 'utf8')) : null;

    t(
      'chayNapStubRadar (0 radar + nhu-cau): tự dựng stub cho #512/#515 và #520, ghi nguon_ung_vien=nhu_cau, gắn Liên kết thẻ nhu cầu: #...',
      kqNhuCau.thong_ke.da_tao === 2 &&
        kqNhuCau.thong_ke.da_tao_tu_nhu_cau === 2 &&
        kqNhuCau.thong_ke.co_pdf_bac_a === 2 &&
        kqNhuCau.bo_qua.some(
          (b) => b.so_hieu === '23999/2026/CHQ-NVTHQ' && b.ly_do === 'CHUA_TIM_THAY_NGUON_BAC_A'
        ) &&
        stub88 !== null &&
        stub88.nguon[0].url === 'https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/11/88-btc.signed.pdf' &&
        stub88.ten.includes('phí hải quan') &&
        stub64 !== null &&
        stub64.nguon[0].url === 'https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/11/64-bct.signed.pdf' &&
        mdNhuCau.includes('Liên kết thẻ nhu cầu: #512, #515, #520') &&
        kiemTra(napSo(tmpRepo), { root: tmpRepo }).loi.length === 0,
      JSON.stringify({ kqNhuCau, mdNhuCau })
    );

    // 9. CLI --tu-radar + --tu-nhu-cau-json --khong-tim-nguon-nhu-cau + chỉ --tu-nhu-cau-json độc lập
    const radarJsonFile = join(workDir, 'radar.json');
    const nhuCauJsonFile = join(workDir, 'nhu-cau.json');
    const mdOutFile = join(workDir, 'nap-radar.md');
    writeFileSync(
      radarJsonFile,
      JSON.stringify({
        moi: [
          {
            soHieu: '430/2026/ND-CP',
            moTa: 'Nghị định sửa đổi biểu thuế xuất khẩu, thuế nhập khẩu ưu đãi',
            ngay: 'Thu, 26 Nov 2026 00:00:00 GMT',
            url: 'https://congbao.chinhphu.vn/van-ban/nghi-dinh-so-430-2026-nd-cp-470902.htm',
            tram: 'congbao',
          },
        ],
      }),
      'utf8'
    );
    writeFileSync(
      nhuCauJsonFile,
      JSON.stringify([
        {
          number: 601,
          title: '[BỔ SUNG SỔ] 430/2026/NĐ-CP',
          body: 'Số hiệu 430/2026/NĐ-CP trả found:false từ công cụ tra_hieu_luc_van_ban.',
          url: 'https://github.com/ozvietnam/oz-wiki-plhq/issues/601',
        },
        {
          number: 602,
          title: '[BỔ SUNG SỔ] 92/2026/TT-BTC — Miễn thuế hàng nhập khẩu phục vụ nghiên cứu khoa học',
          body: 'Thông tư 92/2026/TT-BTC ban hành ngày 22/11/2026: https://congbao.chinhphu.vn/van-ban/thong-tu-so-92-2026-tt-btc-470920.htm',
          url: 'https://github.com/ozvietnam/oz-wiki-plhq/issues/602',
        },
      ]),
      'utf8'
    );

    const cli = spawnSync(
      process.execPath,
      [
        join(ROOT, 'tools/nap-stub-radar.mjs'),
        '--tu-radar',
        radarJsonFile,
        '--tu-nhu-cau-json',
        nhuCauJsonFile,
        '--khong-lay-pdf-url',
        '--khong-tim-nguon-nhu-cau',
        '--markdown',
        mdOutFile,
        '--json',
        '--root',
        tmpRepo,
      ],
      { encoding: 'utf8' }
    );

    let cliJson = null;
    try {
      cliJson = JSON.parse(cli.stdout);
    } catch {
      /* noop */
    }
    const mdText = existsSync(mdOutFile) ? readFileSync(mdOutFile, 'utf8') : dinhDangMarkdownNapStub(cliJson);

    // Kiểm tra chạy CLI chỉ với --tu-nhu-cau-json (không truyền --tu-radar)
    const nhuCauOnlyFile = join(workDir, 'nhu-cau-only.json');
    writeFileSync(
      nhuCauOnlyFile,
      JSON.stringify([
        {
          number: 603,
          title: '[BỔ SUNG SỔ] 95/2026/TT-BCT — Quy tắc xuất xứ hàng hóa mới',
          body: 'Ban hành ngày 24/11/2026: https://moit.gov.vn/van-ban-phap-luat/thong-tu-95-2026-tt-bct.html',
          url: 'https://github.com/ozvietnam/oz-wiki-plhq/issues/603',
        },
      ]),
      'utf8'
    );
    const cliOnlyNc = spawnSync(
      process.execPath,
      [
        join(ROOT, 'tools/nap-stub-radar.mjs'),
        '--tu-nhu-cau-json',
        nhuCauOnlyFile,
        '--khong-lay-pdf-url',
        '--khong-tim-nguon-nhu-cau',
        '--json',
        '--root',
        tmpRepo,
      ],
      { encoding: 'utf8' }
    );
    let cliOnlyNcJson = null;
    try {
      cliOnlyNcJson = JSON.parse(cliOnlyNc.stdout);
    } catch {
      /* noop */
    }

    t(
      'CLI nap-stub-radar.mjs hỗ trợ cả --tu-radar + --tu-nhu-cau-json lẫn --tu-nhu-cau-json độc lập, xuất Markdown kèm Liên kết thẻ nhu cầu',
      cli.status === 0 &&
        cliJson !== null &&
        cliJson.thong_ke.da_tao === 2 &&
        existsSync(join(tmpRepo, 'registry', 'van-ban', '430-2026-nd-cp.yaml')) &&
        existsSync(join(tmpRepo, 'registry', 'van-ban', '92-2026-tt-btc.yaml')) &&
        mdText.includes('## Nạp stub tự động từ Radar') &&
        mdText.includes('Liên kết thẻ nhu cầu: #601, #602') &&
        cliOnlyNc.status === 0 &&
        cliOnlyNcJson !== null &&
        cliOnlyNcJson.thong_ke.da_tao === 1 &&
        cliOnlyNcJson.da_tao[0].nguon_ung_vien === 'nhu_cau' &&
        existsSync(join(tmpRepo, 'registry', 'van-ban', '95-2026-tt-bct.yaml')) &&
        kiemTra(napSo(tmpRepo), { root: tmpRepo }).loi.length === 0,
      `status=${cli.status} stderr=${cli.stderr} onlyNcStatus=${cliOnlyNc.status} onlyNcStderr=${cliOnlyNc.stderr}`
    );
  } finally {
    for (const d of tmpDirs) {
      rmSync(d, { recursive: true, force: true });
    }
  }

  // Chuỗi sang bộ kiểm thử trạm Hải quan headless để `npm test` tự động thực thi mà không đụng package.json
  const kqHq = await chayTestTramHaiQuanHeadless();
  pass += kqHq.pass;
  fail += kqHq.fail;

  return { pass, fail };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { pass, fail } = await chayTestNapStubRadar();
  console.log(`TONG (nap-stub-radar + tram-hai-quan-headless): ${pass} PASS, ${fail} FAIL`);
  process.exit(fail > 0 ? 1 : 0);
}
