// Kiểm thử thuần node:assert/strict cho luồng tools/tai-pdf-tu-vo-html.mjs (không chạm mạng).
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { ROOT, napSo } from '../lib/registry.mjs';
import { kiemToanKhoNap } from '../lib/kiem-tra-raw.mjs';
import { kiemTra } from '../kiem-tra.mjs';
import {
  chayTaiPdfTuVoHtml,
  doiChieuSoHieuTieuDe,
  giaiMaHtmlEntities,
  kiemTraBufferPdf,
  phanTichUngVienPdf,
  taiUrlPdfCoGioiHan,
  trichUrlPdfTuHtml,
} from '../tai-pdf-tu-vo-html.mjs';

const nguonChuan = napSo().nguon;
const tests = [];
const it = (ten, fn) => tests.push({ ten, fn });

function taoStreamResponse(chunks, { status = 200, url = '', contentType = 'application/pdf', contentLength = null } = {}) {
  const bufs = chunks.map((c) => (Buffer.isBuffer(c) ? c : Buffer.from(c)));
  let idx = 0;
  let cancelled = false;
  const headers = new Headers();
  if (contentType) headers.set('content-type', contentType);
  if (contentLength != null) headers.set('content-length', String(contentLength));
  return {
    ok: status >= 200 && status < 300,
    status,
    url,
    headers,
    body: {
      getReader() {
        return {
          async read() {
            if (cancelled || idx >= bufs.length) return { done: true, value: undefined };
            const value = new Uint8Array(bufs[idx++]);
            return { done: false, value };
          },
          async cancel() {
            cancelled = true;
          },
        };
      },
      async cancel() {
        cancelled = true;
      },
      get _cancelled() {
        return cancelled;
      },
    },
    _wasCancelled: () => cancelled,
  };
}

it('giaiMaHtmlEntities: giải mã đúng &amp;, &#x2B;, &#43;, &quot;, &#39;', () => {
  const raw = 'https://g7.cdnchinhphu.vn/api/download/stream?Url=abc&amp;file_name=2014_225&#x2B;%2b&#43;226.pdf&amp;q=&quot;x&#39;y&quot;';
  const decoded = giaiMaHtmlEntities(raw);
  assert.equal(
    decoded,
    'https://g7.cdnchinhphu.vn/api/download/stream?Url=abc&file_name=2014_225+%2b+226.pdf&q="x\'y"',
  );
});

it('trichUrlPdfTuHtml: bóc URL nhúng (HTML escape, -cppdf, đường dẫn tương đối) & xếp ưu tiên datafiles > congbaocdn > g7', () => {
  const html = `
    <html><body>
      <a href="https://g7.cdnchinhphu.vn/api/download/stream?Url=xyz&amp;file_name=2014_225&#x2B;%2b&#x2B;226-195_2013_N%c4%90-CP.pdf">Stream</a>
      <a href="https://g7.cdnchinhphu.vn/api/download/stream?Url=doc&amp;file_name=2014.doc">Bản doc bỏ qua</a>
      <a data-href="https://congbaocdn.chinhphu.vn/CongBaoCP/VanBan/2013/11/4253/2687-1-2014225-226-1952013nd-cppdf">Công báo</a>
      <a href="/cpp/files/vbpq/2025/7/69qh.pdf">Bản chưa ký</a>
      <a href="https://datafiles.chinhphu.vn/cpp/files/vbpq/2025/7/69qh.signed.pdf">Bản ký số</a>
    </body></html>
  `;
  const urls = trichUrlPdfTuHtml(html, {
    baseUrl: 'https://datafiles.chinhphu.vn/van-ban/69',
    nguon: nguonChuan,
  });
  assert.equal(urls.length, 4);
  assert.equal(urls[0], 'https://datafiles.chinhphu.vn/cpp/files/vbpq/2025/7/69qh.signed.pdf');
  assert.equal(urls[1], 'https://datafiles.chinhphu.vn/cpp/files/vbpq/2025/7/69qh.pdf');
  assert.equal(urls[2], 'https://congbaocdn.chinhphu.vn/CongBaoCP/VanBan/2013/11/4253/2687-1-2014225-226-1952013nd-cppdf');
  assert.equal(
    urls[3],
    'https://g7.cdnchinhphu.vn/api/download/stream?Url=xyz&file_name=2014_225+%2b+226-195_2013_N%c4%90-CP.pdf',
  );
  assert.ok(!urls.some((u) => u.includes('2014.doc')));
});

it('phanTichUngVienPdf: lọc bỏ hoàn toàn nguồn C, nguồn B và vbpl.vn', () => {
  const html = `
    <html><body>
      <a href="https://vbpl.vn/FileData/TW/Lists/vbpq/Attachments/123/test.pdf">VBPL</a>
      <a href="https://www.vbpl.vn/pages/download.pdf">WWW VBPL</a>
      <a href="https://mic.mediacdn.vn/document/2026/vbhn25.pdf">Nguồn C CDN ngoài</a>
      <a href="https://blog.example.com/file.pdf">Nguồn C blog</a>
      <a href="https://thuvienphapluat.vn/files/mau.pdf">Nguồn B</a>
      <a href="javascript:downloadPdf()">JS giả</a>
      <a href="https://congbaocdn.chinhphu.vn/CongBaoCP/VanBan/2026/x.pdf">Hợp lệ A</a>
    </body></html>
  `;
  const { urls, biLoai } = phanTichUngVienPdf(html, { nguon: nguonChuan });
  assert.deepEqual(urls, ['https://congbaocdn.chinhphu.vn/CongBaoCP/VanBan/2026/x.pdf']);
  assert.ok(biLoai.some((x) => x.url.includes('vbpl.vn') && x.lyDo === 'BO_QUA_VBPL'));
  assert.ok(biLoai.some((x) => x.url.includes('mic.mediacdn.vn') && x.lyDo === 'NGUON_BAC_C'));
  assert.ok(biLoai.some((x) => x.url.includes('thuvienphapluat.vn') && x.lyDo === 'NGUON_BAC_B'));
});

it('doiChieuSoHieuTieuDe: khớp chuẩn, hỗ trợ VBHN/Cyrillic và chặn vỏ HTML sai văn bản hoặc trang chủ', () => {
  const ok1 = doiChieuSoHieuTieuDe(
    { so_hieu: '69/2025/QH15', loai: 'LUAT', ten: 'Luật Hóa chất' },
    '<html><head><title>Luật số 69/2025/QH15 của Quốc hội: Luật Hóa chất</title></head></html>',
  );
  assert.equal(ok1.khop, true);

  const okCyrillic = doiChieuSoHieuTieuDe(
    { so_hieu: '365/2026/NĐ-CP', loai: 'NGHI_DINH', ten: 'Về kinh doanh xuất, nhập khẩu gạo' },
    '<html><head><title>Nghị định số 365/2026/NĐ-\u0421\u0420 của Chính phủ: Về kinh doanh xuất, nhập khẩu gạo</title></head></html>',
  );
  assert.equal(okCyrillic.khop, true);

  const okVbhn = doiChieuSoHieuTieuDe(
    { so_hieu: '08/2026/VBHN-BYT', loai: 'VAN_BAN_HOP_NHAT', ten: 'Về quản lý thiết bị y tế' },
    '<html><head><title>Văn bản hợp nhất số 08/VBHN-BYT của Bộ Y tế: Về quản lý thiết bị y tế</title></head></html>',
  );
  assert.equal(okVbhn.khop, true);

  const saiVanBan = doiChieuSoHieuTieuDe(
    { so_hieu: '1536/QĐ-BYT', loai: 'QUYET_DINH', ten: 'Công bố danh mục trang thiết bị y tế' },
    '<html><head><title>Thông tư số 47/2025/TT-BYT của Bộ Y tế: Bãi bỏ một số văn bản</title></head></html>',
  );
  assert.equal(saiVanBan.khop, false);
  assert.equal(saiVanBan.lyDo, 'LECH_SO_HIEU_TIEU_DE');

  const trangChu = doiChieuSoHieuTieuDe(
    { so_hieu: '72/2018/QH14', loai: 'LUAT', ten: 'Luật An ninh mạng' },
    '<html><head><title>Trang chủ | CSDL quốc gia về pháp luật</title></head></html>',
  );
  assert.equal(trangChu.khop, false);
  assert.equal(trangChu.lyDo, 'TRANG_CHU_HOAC_LOI');
});

it('kiemTraBufferPdf & taiUrlPdfCoGioiHan: xử lý lỗi HTTP 404/500, PDF giả (HTML), tệp <4 byte, redirect bẩn và vượt dung lượng', async () => {
  assert.equal(kiemTraBufferPdf(Buffer.from('%PD')).lyDo, 'TEP_QUA_NHO');
  assert.equal(kiemTraBufferPdf(Buffer.from('<html>error</html>')).lyDo, 'KHONG_PHAI_MAGIC_PDF');
  assert.equal(kiemTraBufferPdf(Buffer.from('%PDF-1.4\nabc'), { maxFileBytes: 5 }).lyDo, 'VUOT_GIOI_HAN_TEP');
  assert.equal(kiemTraBufferPdf(Buffer.from('%PDF-1.4\nabc'), { maxFileBytes: 100 }).ok, true);

  const urlA = 'https://datafiles.chinhphu.vn/cpp/files/vbpq/2025/7/test.pdf';

  const r404 = await taiUrlPdfCoGioiHan(urlA, {
    nguon: nguonChuan,
    fetchImpl: async () => taoStreamResponse([], { status: 404, url: urlA }),
  });
  assert.equal(r404.ok, false);
  assert.equal(r404.lyDo, 'HTTP_404');

  const r500 = await taiUrlPdfCoGioiHan(urlA, {
    nguon: nguonChuan,
    fetchImpl: async () => taoStreamResponse([], { status: 500, url: urlA }),
  });
  assert.equal(r500.ok, false);
  assert.equal(r500.lyDo, 'HTTP_500');

  const resFakePdf = taoStreamResponse(['<html><body>Not a PDF</body></html>', 'more-body'], {
    status: 200,
    url: urlA,
    contentType: 'application/pdf',
  });
  const rFake = await taiUrlPdfCoGioiHan(urlA, {
    nguon: nguonChuan,
    fetchImpl: async () => resFakePdf,
  });
  assert.equal(rFake.ok, false);
  assert.equal(rFake.lyDo, 'KHONG_PHAI_MAGIC_PDF');
  assert.equal(resFakePdf._wasCancelled(), true);

  const rRedirectVbpl = await taiUrlPdfCoGioiHan(urlA, {
    nguon: nguonChuan,
    fetchImpl: async () => taoStreamResponse(['%PDF-1.4\n'], {
      status: 200,
      url: 'https://vbpl.vn/FileData/redirected.pdf',
    }),
  });
  assert.equal(rRedirectVbpl.ok, false);
  assert.equal(rRedirectVbpl.lyDo, 'REDIRECT_BO_QUA_VBPL');

  const rTooBigHeader = await taiUrlPdfCoGioiHan(urlA, {
    nguon: nguonChuan,
    maxFileBytes: 1000,
    fetchImpl: async () => taoStreamResponse(['%PDF-1.4\n'], {
      status: 200,
      url: urlA,
      contentLength: 2000,
    }),
  });
  assert.equal(rTooBigHeader.ok, false);
  assert.equal(rTooBigHeader.lyDo, 'VUOT_GIOI_HAN_TEP');

  const rBudgetStream = await taiUrlPdfCoGioiHan(urlA, {
    nguon: nguonChuan,
    maxFileBytes: 5000,
    maxRemainingBytes: 20,
    fetchImpl: async () => taoStreamResponse(['%PDF-1.4\n', 'x'.repeat(30)], {
      status: 200,
      url: urlA,
    }),
  });
  assert.equal(rBudgetStream.ok, false);
  assert.equal(rBudgetStream.lyDo, 'VUOT_NGAN_SACH_DOT');

  const rRedirectOk = await taiUrlPdfCoGioiHan(urlA, {
    nguon: nguonChuan,
    fetchImpl: async () => taoStreamResponse(['%PDF-1.7\n%redirected'], {
      status: 200,
      url: 'https://congbaocdn.chinhphu.vn/CongBaoCP/redirected.pdf',
    }),
  });
  assert.equal(rRedirectOk.ok, true);
  assert.equal(rRedirectOk.finalUrl, 'https://congbaocdn.chinhphu.vn/CongBaoCP/redirected.pdf');

  const rNetErr = await taiUrlPdfCoGioiHan(urlA, {
    nguon: nguonChuan,
    fetchImpl: async () => { throw new Error('ECONNRESET'); },
  });
  assert.equal(rNetErr.ok, false);
  assert.match(rNetErr.lyDo, /^LOI_MANG:/);
});

it('chayTaiPdfTuVoHtml: đọc từ file --report JSON và bảo vệ raw bất biến nếu đã có PDF khác SHA-256', async () => {
  const mockRoot = mkdtempSync(join(tmpdir(), 'oz-tai-immut-'));
  try {
    mkdirSync(join(mockRoot, 'registry', 'van-ban'), { recursive: true });
    mkdirSync(join(mockRoot, 'raw', 'download', 'vanban.chinhphu.vn'), { recursive: true });
    mkdirSync(join(mockRoot, 'raw', 'download', 'datafiles.chinhphu.vn'), { recursive: true });
    for (const f of ['cay-xnk.yaml', 'co-quan.yaml', 'nguon-uy-tin.yaml']) {
      cpSync(join(ROOT, 'registry', f), join(mockRoot, 'registry', f));
    }
    writeFileSync(
      join(mockRoot, 'registry', 'van-ban', '10-2026-nd-cp.yaml'),
      [
        'so_hieu: 10/2026/NĐ-CP',
        'loai: NGHI_DINH',
        'ten: Nghị định bảo vệ bất biến',
        'co_quan: CP',
        'ngay_ban_hanh: "2026-01-01"',
        'tinh_trang: CON_HIEU_LUC',
        'nhanh: [hai-quan/thu-tuc]',
        'nguon: [{ url: "https://vanban.chinhphu.vn/?docid=10", truy_cap: "2026-10-01" }]',
        'xac_minh: { muc: NGUON_A, hieu_luc_da_doi_chieu: true, ngay: "2026-10-01" }',
        'toan_van: raw/download/vanban.chinhphu.vn/10-2026-nd-cp.html',
      ].join('\n') + '\n',
    );
    writeFileSync(
      join(mockRoot, 'raw', 'download', 'vanban.chinhphu.vn', '10-2026-nd-cp.html'),
      '<html><head><title>Nghị định số 10/2026/NĐ-CP: Nghị định bảo vệ bất biến</title></head><body><a href="https://datafiles.chinhphu.vn/10.pdf">PDF</a></body></html>',
    );
    const pdfCuPath = join(mockRoot, 'raw', 'download', 'datafiles.chinhphu.vn', '10-2026-nd-cp.pdf');
    writeFileSync(pdfCuPath, '%PDF-1.4\nOLD_CONTENT');
    const reportPath = join(mockRoot, 'nap-report.json');
    writeFileSync(reportPath, JSON.stringify({
      uu_tien_tai_pdf_tu_vo_html: [
        { so_hieu: '10/2026/NĐ-CP', slug: '10-2026-nd-cp', tep_raw: 'raw/download/vanban.chinhphu.vn/10-2026-nd-cp.html' },
      ],
    }));

    const kq = await chayTaiPdfTuVoHtml({
      root: mockRoot,
      reportPath,
      logger: { log() {}, warn() {} },
      fetchImpl: async (u) => taoStreamResponse(['%PDF-1.4\nNEW_DIFFERENT_CONTENT'], { status: 200, url: u }),
    });
    assert.equal(kq.da_tai.length, 0);
    assert.equal(kq.loi.length, 1);
    assert.equal(kq.loi[0].loi[0].lyDo, 'DA_CO_TEP_KHAC_SHA256');
    assert.equal(readFileSync(pdfCuPath, 'utf8'), '%PDF-1.4\nOLD_CONTENT');
  } finally {
    rmSync(mockRoot, { recursive: true, force: true });
  }
});

it('chayTaiPdfTuVoHtml: nạp từ fixture không cần mạng, giữ nguyên HTML cũ, giảm đúng VO_HTML_CHUA_TAI_PDF', async () => {
  const mockRoot = mkdtempSync(join(tmpdir(), 'oz-tai-vo-html-'));
  try {
    mkdirSync(join(mockRoot, 'registry', 'van-ban'), { recursive: true });
    mkdirSync(join(mockRoot, 'raw', 'download', 'vanban.chinhphu.vn'), { recursive: true });
    mkdirSync(join(mockRoot, 'raw', 'download', 'vbpl.vn'), { recursive: true });
    for (const f of ['cay-xnk.yaml', 'co-quan.yaml', 'nguon-uy-tin.yaml']) {
      cpSync(join(ROOT, 'registry', f), join(mockRoot, 'registry', f));
    }

    const mkYaml = (so, ten, toanVan, urlNguon) => [
      '# Sổ kiểm thử',
      `so_hieu: ${so}`,
      'loai: NGHI_DINH',
      `ten: ${ten}`,
      'co_quan: CP',
      'ngay_ban_hanh: "2026-01-01"',
      'hieu_luc_tu: "2026-02-01"',
      'tinh_trang: CON_HIEU_LUC',
      'nhanh: [hai-quan/thu-tuc]',
      'nguon:',
      `  - url: "${urlNguon}"`,
      '    truy_cap: "2026-10-01"',
      'xac_minh:',
      '  muc: NGUON_A',
      '  hieu_luc_da_doi_chieu: true',
      '  ngay: "2026-10-01"',
      `toan_van: ${toanVan}`,
    ].join('\n') + '\n';

    writeFileSync(
      join(mockRoot, 'registry', 'van-ban', '01-2026-nd-cp.yaml'),
      mkYaml('01/2026/NĐ-CP', 'Nghị định thử fallback', 'raw/download/vanban.chinhphu.vn/01-2026-nd-cp.html', 'https://vanban.chinhphu.vn/?docid=1'),
    );
    writeFileSync(
      join(mockRoot, 'raw', 'download', 'vanban.chinhphu.vn', '01-2026-nd-cp.html'),
      `<html><head><title>Nghị định số 01/2026/NĐ-CP: Nghị định thử fallback</title></head><body>
        <a href="https://datafiles.chinhphu.vn/cpp/files/01-fake.pdf">Fake</a>
        <a data-href="https://congbaocdn.chinhphu.vn/CongBaoCP/01-2026-nd-cp.pdf">Real</a>
      </body></html>`,
    );

    writeFileSync(
      join(mockRoot, 'registry', 'van-ban', '02-2026-nd-cp.yaml'),
      mkYaml('02/2026/NĐ-CP', 'Nghị định chỉ có nguồn C/vbpl', 'raw/download/vbpl.vn/02-2026-nd-cp.html', 'https://vanban.chinhphu.vn/?docid=2'),
    );
    writeFileSync(
      join(mockRoot, 'raw', 'download', 'vbpl.vn', '02-2026-nd-cp.html'),
      `<html><head><title>Nghị định số 02/2026/NĐ-CP: Nghị định chỉ có nguồn C/vbpl</title></head><body>
        <a href="https://vbpl.vn/FileData/02.pdf">VBPL</a>
        <a href="https://cdn.example.com/02.pdf">C</a>
      </body></html>`,
    );

    writeFileSync(
      join(mockRoot, 'registry', 'van-ban', '03-2026-nd-cp.yaml'),
      mkYaml('03/2026/NĐ-CP', 'Nghị định vỏ HTML lệch số hiệu', 'raw/download/vanban.chinhphu.vn/03-2026-nd-cp.html', 'https://vanban.chinhphu.vn/?docid=3'),
    );
    writeFileSync(
      join(mockRoot, 'raw', 'download', 'vanban.chinhphu.vn', '03-2026-nd-cp.html'),
      `<html><head><title>Thông tư số 99/2025/TT-BTC: Văn bản khác</title></head><body>
        <a href="https://datafiles.chinhphu.vn/cpp/files/99-2025.pdf">Wrong</a>
      </body></html>`,
    );

    const before = kiemToanKhoNap(mockRoot, { kiemPdf: false });
    assert.equal(before.thong_ke.VO_HTML_CHUA_TAI_PDF, 3);

    const kq = await chayTaiPdfTuVoHtml({
      root: mockRoot,
      limit: 10,
      maxFileBytes: 1024 * 1024,
      maxTotalBytes: 2 * 1024 * 1024,
      today: '2026-11-22',
      logger: { log() {}, warn() {} },
      kiemPdfFn: () => ({ trang_thai: 'PDF_CO_TOAN_VAN', co_lop_chu: true, co_dieu_khoan: true, so_ky_tu: 500 }),
      fetchImpl: async (u) => {
        if (u.includes('01-fake.pdf')) {
          return taoStreamResponse(['<html>not pdf</html>'], { status: 200, url: u, contentType: 'text/html' });
        }
        if (u.includes('01-2026-nd-cp.pdf')) {
          return taoStreamResponse(['%PDF-1.4\n%MockPDFContent\n'], { status: 200, url: u });
        }
        throw new Error(`Unexpected fetch: ${u}`);
      },
    });

    assert.equal(kq.da_tai.length, 1);
    assert.equal(kq.da_tai[0].so_hieu, '01/2026/NĐ-CP');
    assert.equal(kq.da_tai[0].tep, 'raw/download/congbaocdn.chinhphu.vn/01-2026-nd-cp.pdf');
    assert.equal(kq.bo_qua.length, 2);
    assert.equal(kq.loi.length, 0);

    // Tệp HTML cũ giữ nguyên (raw bất biến), PDF mới + .nguon.json tồn tại, YAML cập nhật chuẩn
    assert.equal(existsSync(join(mockRoot, 'raw', 'download', 'vanban.chinhphu.vn', '01-2026-nd-cp.html')), true);
    assert.equal(existsSync(join(mockRoot, 'raw', 'download', 'congbaocdn.chinhphu.vn', '01-2026-nd-cp.pdf')), true);
    assert.equal(existsSync(join(mockRoot, 'raw', 'download', 'congbaocdn.chinhphu.vn', '01-2026-nd-cp.pdf.nguon.json')), true);

    const yamlObj = yaml.load(readFileSync(join(mockRoot, 'registry', 'van-ban', '01-2026-nd-cp.yaml'), 'utf8'), { schema: yaml.CORE_SCHEMA });
    assert.equal(yamlObj.toan_van, 'raw/download/congbaocdn.chinhphu.vn/01-2026-nd-cp.pdf');
    assert.ok(yamlObj.nguon.some((n) => n.url === 'https://congbaocdn.chinhphu.vn/CongBaoCP/01-2026-nd-cp.pdf'));

    const after = kiemToanKhoNap(mockRoot, { kiemPdf: false });
    assert.equal(after.thong_ke.VO_HTML_CHUA_TAI_PDF, before.thong_ke.VO_HTML_CHUA_TAI_PDF - 1);
    assert.equal(after.thong_ke.CO_TOAN_VAN_CHUA_INGEST, 1);

    const kTra = kiemTra(napSo(mockRoot), { today: '2026-11-22', root: mockRoot });
    assert.equal(kTra.loi.length, 0, JSON.stringify(kTra.loi));
  } finally {
    rmSync(mockRoot, { recursive: true, force: true });
  }
});

let pass = 0;
let fail = 0;
for (const tc of tests) {
  try {
    await tc.fn();
    pass += 1;
    console.log(`PASS ${tc.ten}`);
  } catch (err) {
    fail += 1;
    console.error(`FAIL ${tc.ten}: ${err?.stack || err}`);
  }
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
