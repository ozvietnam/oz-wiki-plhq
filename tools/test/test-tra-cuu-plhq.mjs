#!/usr/bin/env node
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { VIET_TAT_PLHQ, hoiPhapLuat, taoKhoTraCuu, traChinhSachTheoMaHs } from '../lib/tra-cuu-plhq.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');

let pass = 0;
let fail = 0;

function t(name, ok, extra = '') {
  if (ok) {
    pass += 1;
    console.log(`PASS ${name}`);
  } else {
    fail += 1;
    console.error(`FAIL ${name}${extra ? ` -> ${extra}` : ''}`);
  }
}

function soGia({ vanBan = [], wikiSources = [], wikiConcepts = [] } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'plhq-w15-'));
  mkdirSync(join(root, 'registry', 'van-ban'), { recursive: true });
  mkdirSync(join(root, 'wiki', 'summary'), { recursive: true });
  mkdirSync(join(root, 'wiki', 'concepts'), { recursive: true });
  mkdirSync(join(root, 'wiki', 'sources'), { recursive: true });
  mkdirSync(join(root, 'danh-muc'), { recursive: true });

  for (const f of ['cay-xnk.yaml', 'co-quan.yaml', 'nguon-uy-tin.yaml']) {
    cpSync(join(ROOT, 'registry', f), join(root, 'registry', f));
  }

  for (const doc of vanBan) {
    const fileSlug = doc.slug;
    writeFileSync(join(root, 'registry', 'van-ban', `${fileSlug}.yaml`), yaml.dump(doc, { lineWidth: 120 }), 'utf8');
  }

  for (const page of wikiSources) {
    const { body, ...fm } = page;
    const md = `---\n${yaml.dump(fm, { lineWidth: 120 })}---\n\n${body}\n`;
    writeFileSync(join(root, 'wiki', 'sources', `${page.slug}.md`), md, 'utf8');
  }

  for (const page of wikiConcepts) {
    const { body, ...fm } = page;
    const md = `---\n${yaml.dump(fm, { lineWidth: 120 })}---\n\n${body}\n`;
    writeFileSync(join(root, 'wiki', 'concepts', `${page.slug}.md`), md, 'utf8');
  }

  return root;
}

function docMau(overrides) {
  return {
    loai: 'NGHI_DINH',
    co_quan: 'Chính phủ',
    ngay_ban_hanh: '2026-01-15',
    nhanh: ['thu-tuc-hai-quan/khai-hai-quan'],
    tinh_trang: 'CON_HIEU_LUC',
    hieu_luc_tu: '2026-03-01',
    nguon: [{ url: 'https://vanban.chinhphu.vn/fake-doc', truy_cap: '2026-03-01' }],
    xac_minh: {
      muc: 'NGUON_A',
      ngay_xac_minh: '2026-03-01',
    },
    ...overrides,
  };
}

// --- Test 1: Chuẩn hóa ngày zero-padding (d/m/yyyy, dd/mm/yyyy, yyyy-mm-dd) & không tính trùng bonus ---
{
  const root = soGia({
    vanBan: [
      docMau({
        so_hieu: '10/2026/NĐ-CP',
        slug: '10-2026-nd-cp',
        ten: 'Nghị định về thủ tục khai bổ sung hồ sơ hải quan',
      }),
      docMau({
        so_hieu: '11/2026/NĐ-CP',
        slug: '11-2026-nd-cp',
        ten: 'Nghị định về thủ tục khai bổ sung hồ sơ hải quan theo năm',
      }),
      docMau({
        so_hieu: '12/2026/NĐ-CP',
        slug: '12-2026-nd-cp',
        ten: 'Nghị định về thủ tục khai bổ sung áp dụng mốc ISO',
      }),
    ],
    wikiSources: [
      {
        so_hieu: '10/2026/NĐ-CP',
        slug: '10-2026-nd-cp',
        tieu_de: '10/2026/NĐ-CP thủ tục khai bổ sung',
        confidence: 'high',
        van_ban_lien_quan: [{ so_hieu: '10/2026/NĐ-CP', tinh_trang: 'CON_HIEU_LUC' }],
        body: '## Hiệu lực thi hành\n\nQuy định thủ tục khai bổ sung hồ sơ hải quan có hiệu lực từ ngày 14/08/2026 trên toàn quốc.',
      },
      {
        so_hieu: '11/2026/NĐ-CP',
        slug: '11-2026-nd-cp',
        tieu_de: '11/2026/NĐ-CP thủ tục khai bổ sung',
        confidence: 'high',
        van_ban_lien_quan: [{ so_hieu: '11/2026/NĐ-CP', tinh_trang: 'CON_HIEU_LUC' }],
        body: '## Hiệu lực thi hành\n\nQuy định thủ tục khai bổ sung hồ sơ hải quan ban hành trong năm 2026 trên toàn quốc.',
      },
      {
        so_hieu: '12/2026/NĐ-CP',
        slug: '12-2026-nd-cp',
        tieu_de: '12/2026/NĐ-CP thủ tục khai bổ sung',
        confidence: 'high',
        van_ban_lien_quan: [{ so_hieu: '12/2026/NĐ-CP', tinh_trang: 'CON_HIEU_LUC' }],
        body: '## Hiệu lực thi hành\n\nQuy định thủ tục khai bổ sung hồ sơ hải quan áp dụng mốc 14/08/2026 và 2026-08-14 cùng mốc 2026-07-01.',
      },
    ],
  });

  try {
    const store = await taoKhoTraCuu({ root });
    const res1 = hoiPhapLuat(store, 'thủ tục khai bổ sung hồ sơ hải quan áp dụng ngày 14/8/2026', { limit: 5 });
    const kq10 = res1.ket_qua.find((x) => x.slug === '10-2026-nd-cp');
    const kq11 = res1.ket_qua.find((x) => x.slug === '11-2026-nd-cp');
    const kq12 = res1.ket_qua.find((x) => x.slug === '12-2026-nd-cp');
    t(
      '(1a) Ngày không đệm 14/8/2026 khớp 14/08/2026 và thắng mốc chỉ có năm 2026',
      Boolean(kq10 && kq11 && kq10.diem_phu_hop > kq11.diem_phu_hop),
      JSON.stringify({ kq10: kq10?.diem_phu_hop, kq11: kq11?.diem_phu_hop }),
    );

    const resIso = hoiPhapLuat(store, 'thủ tục khai bổ sung áp dụng mốc 1/7/2026', { limit: 5 });
    t(
      '(1b) Ngày không đệm 1/7/2026 khớp chuẩn ISO 2026-07-01 lên #1',
      resIso.ket_qua[0]?.slug === '12-2026-nd-cp',
      JSON.stringify(resIso.ket_qua.map((x) => [x.slug, x.diem_phu_hop])),
    );

    const resDup = hoiPhapLuat(store, 'thủ tục khai bổ sung hồ sơ hải quan 14/8/2026', { limit: 5 });
    const dup10 = resDup.ket_qua.find((x) => x.slug === '10-2026-nd-cp');
    const dup12 = resDup.ket_qua.find((x) => x.slug === '12-2026-nd-cp');
    t(
      '(1c) Cùng một ngày 14/8/2026 xuất hiện cả dd/mm/yyyy lẫn yyyy-mm-dd không bị cộng điểm thưởng hai lần',
      Boolean(dup10 && dup12 && kq12 && dup10.diem_phu_hop === dup12.diem_phu_hop),
      JSON.stringify({ dup10: dup10?.diem_phu_hop, dup12: dup12?.diem_phu_hop }),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// --- Test 2: Năm 4 chữ số thuần túy (2026) không lấn át specificTokens/accentedSpecificTokens ---
{
  const root = soGia({
    vanBan: [
      docMau({
        so_hieu: '20/2026/TT-BTC',
        slug: '20-2026-tt-btc',
        loai: 'THONG_TU',
        co_quan: 'Bộ Tài chính',
        ten: 'Thông tư quy định giấy phép nhập khẩu tiền chất công nghiệp',
      }),
      docMau({
        so_hieu: '21/2026/TT-BTC',
        slug: '21-2026-tt-btc',
        loai: 'THONG_TU',
        co_quan: 'Bộ Tài chính',
        ten: 'Thông tư hướng dẫn nhập khẩu chung năm 2026',
      }),
    ],
    wikiSources: [
      {
        so_hieu: '20/2026/TT-BTC',
        slug: '20-2026-tt-btc',
        tieu_de: 'Thông tư về giấy phép nhập khẩu tiền chất công nghiệp',
        confidence: 'high',
        van_ban_lien_quan: [{ so_hieu: '20/2026/TT-BTC', tinh_trang: 'CON_HIEU_LUC' }],
        body: '## Nội dung chính\n\nTổ chức xin giấy phép nhập khẩu tiền chất công nghiệp nộp bộ hồ sơ điện tử qua cổng một cửa.',
      },
      {
        so_hieu: '21/2026/TT-BTC',
        slug: '21-2026-tt-btc',
        tieu_de: 'Quy định nhập khẩu năm 2026',
        confidence: 'high',
        van_ban_lien_quan: [{ so_hieu: '21/2026/TT-BTC', tinh_trang: 'CON_HIEU_LUC' }],
        body: '## Phạm vi năm 2026\n\nQuy định chung về hoạt động nhập khẩu hàng hóa áp dụng năm 2026 theo lộ trình cải cách năm 2026.',
      },
    ],
  });

  try {
    const store = await taoKhoTraCuu({ root });
    const res = hoiPhapLuat(store, 'quy định năm 2026 về giấy phép nhập khẩu tiền chất công nghiệp', { limit: 5 });
    t(
      '(2) Năm 4 chữ số 2026 không đẩy văn bản nhiễu năm 2026 vượt lên văn bản đúng chủ đề',
      res.ket_qua[0]?.slug === '20-2026-tt-btc' && res.van_ban_lien_quan[0]?.so_hieu === '20/2026/TT-BTC',
      JSON.stringify({ kq: res.ket_qua.map((x) => [x.slug, x.diem_phu_hop]), vb: res.van_ban_lien_quan.map((x) => x.so_hieu) }),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// --- Test 3: Hạ ưu tiên CHUA_CO_HIEU_LUC trên wiki chunks & điều khoản nguồn A trừ khi ghim số hiệu hoặc hỏi năm hiệu lực tương lai ---
{
  const root = soGia({
    vanBan: [
      docMau({
        so_hieu: '31/2021/NĐ-CP',
        slug: '31-2021-nd-cp',
        ngay_ban_hanh: '2021-03-10',
        tinh_trang: 'CON_HIEU_LUC',
        hieu_luc_tu: '2021-05-01',
        nhanh: ['kiem-tra-chuyen-nganh/chat-luong-hang-hoa'],
        ten: 'Nghị định quản lý chất lượng thiết bị đo nhập khẩu',
        xac_minh: {
          muc: 'NGUON_A',
          ngay_xac_minh: '2026-03-01',
          dieu_khoan: [
            {
              dieu: 8,
              ten: 'Kiểm tra chất lượng thiết bị đo nhập khẩu',
              toan_van: 'Doanh nghiệp nhập khẩu thiết bị đo phải thực hiện kiểm tra chất lượng trước khi thông quan.',
              nghia_vu_xnk: ['Nộp kết quả kiểm tra chất lượng thiết bị đo'],
            },
          ],
        },
      }),
      docMau({
        so_hieu: '30/2026/TT-BKHCN',
        slug: '30-2026-tt-bkhcn',
        loai: 'THONG_TU',
        co_quan: 'Bộ Khoa học và Công nghệ',
        ngay_ban_hanh: '2026-06-01',
        tinh_trang: 'CHUA_CO_HIEU_LUC',
        hieu_luc_tu: '2027-01-01',
        nhanh: ['kiem-tra-chuyen-nganh/chat-luong-hang-hoa'],
        ten: 'Thông tư mới về kiểm tra chất lượng thiết bị đo hiệu lực từ 01/01/2027',
        xac_minh: {
          muc: 'NGUON_A',
          ngay_xac_minh: '2026-06-05',
          dieu_khoan: [
            {
              dieu: 5,
              ten: 'Kiểm tra chất lượng thiết bị đo từ 2027',
              toan_van: 'Quy định kiểm tra chất lượng thiết bị đo nhập khẩu có hiệu lực thi hành từ ngày 01/01/2027.',
              nghia_vu_xnk: ['Đăng ký kiểm tra chất lượng thiết bị đo theo quy định mới'],
            },
          ],
        },
      }),
    ],
    wikiSources: [
      {
        so_hieu: '31/2021/NĐ-CP',
        slug: '31-2021-nd-cp',
        tieu_de: 'Kiểm tra chất lượng thiết bị đo',
        confidence: 'high',
        van_ban_lien_quan: [{ so_hieu: '31/2021/NĐ-CP', tinh_trang: 'CON_HIEU_LUC' }],
        body: '## Quy định hiện hành\n\nKiểm tra chất lượng thiết bị đo áp dụng cho hàng nhập khẩu thuộc diện quản lý chuyên ngành.',
      },
      {
        so_hieu: '30/2026/TT-BKHCN',
        slug: '30-2026-tt-bkhcn',
        tieu_de: 'Quy định kiểm tra chất lượng thiết bị đo năm 2027',
        confidence: 'high',
        van_ban_lien_quan: [{ so_hieu: '30/2026/TT-BKHCN', tinh_trang: 'CHUA_CO_HIEU_LUC' }],
        body: '## Hiệu lực từ 01/01/2027\n\nQuy định kiểm tra chất lượng thiết bị đo nhập khẩu sẽ có hiệu lực từ ngày 01/01/2027.',
      },
    ],
  });

  try {
    const store = await taoKhoTraCuu({ root });

    const resCurrent = hoiPhapLuat(store, 'quy định kiểm tra chất lượng thiết bị đo nhập khẩu', { limit: 5 });
    t(
      '(3a) Câu hỏi hiện hành ưu tiên CON_HIEU_LUC (31/2021/NĐ-CP) lên #1 thay vì CHUA_CO_HIEU_LUC (30/2026/TT-BKHCN)',
      resCurrent.ket_qua[0]?.slug === '31-2021-nd-cp'
        && resCurrent.dieu_khoan_nguon_a[0]?.so_hieu === '31/2021/NĐ-CP'
        && resCurrent.van_ban_lien_quan[0]?.so_hieu === '31/2021/NĐ-CP',
      JSON.stringify({
        kq: resCurrent.ket_qua.map((x) => [x.slug, x.diem_phu_hop]),
        dk: resCurrent.dieu_khoan_nguon_a.map((x) => [x.so_hieu, x.diem_phu_hop]),
        vb: resCurrent.van_ban_lien_quan.map((x) => x.so_hieu),
      }),
    );

    const resFutureYear = hoiPhapLuat(store, 'quy định kiểm tra chất lượng thiết bị đo áp dụng từ 01/01/2027', { limit: 5 });
    t(
      '(3b) Câu hỏi nêu mốc 01/01/2027 không hạ ưu tiên văn bản CHUA_CO_HIEU_LUC có hiệu lực tương ứng',
      resFutureYear.ket_qua[0]?.slug === '30-2026-tt-bkhcn'
        && resFutureYear.dieu_khoan_nguon_a[0]?.so_hieu === '30/2026/TT-BKHCN',
      JSON.stringify({
        kq: resFutureYear.ket_qua.map((x) => [x.slug, x.diem_phu_hop]),
        dk: resFutureYear.dieu_khoan_nguon_a.map((x) => [x.so_hieu, x.diem_phu_hop]),
      }),
    );

    const resFutureYearOnly = hoiPhapLuat(store, 'quy định kiểm tra chất lượng thiết bị đo năm 2027', { limit: 5 });
    t(
      '(3c) Câu hỏi nêu năm hiệu lực tương lai 2027 không hạ ưu tiên văn bản hiệu lực 2027',
      resFutureYearOnly.ket_qua[0]?.slug === '30-2026-tt-bkhcn'
        && resFutureYearOnly.dieu_khoan_nguon_a[0]?.so_hieu === '30/2026/TT-BKHCN',
      JSON.stringify({
        kq: resFutureYearOnly.ket_qua.map((x) => [x.slug, x.diem_phu_hop]),
        dk: resFutureYearOnly.dieu_khoan_nguon_a.map((x) => [x.so_hieu, x.diem_phu_hop]),
      }),
    );

    const resPinned = hoiPhapLuat(store, '30/2026/TT-BKHCN về kiểm tra chất lượng thiết bị đo', { limit: 5 });
    t(
      '(3d) Câu hỏi ghim đích danh số hiệu CHUA_CO_HIEU_LUC giữ nguyên văn bản được ghim ở #1',
      resPinned.van_ban_lien_quan[0]?.so_hieu === '30/2026/TT-BKHCN'
        && resPinned.van_ban_lien_quan[0]?.khop_so_hieu_truc_tiep === true,
      JSON.stringify(resPinned.van_ban_lien_quan.slice(0, 2)),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// --- Test 4: Mở rộng VIET_TAT_PLHQ đồng nghĩa nghiệp vụ phổ quát & ranh giới từ an toàn ---
{
  const hasAllKeys = ['o to', 'cua khau nhap', 'ktstq', 'dncx', 'sxxk', 'tntx'].every((k) => VIET_TAT_PLHQ.has(k));
  const root = soGia({
    vanBan: [
      docMau({
        so_hieu: '40/2026/NĐ-CP',
        slug: '40-2026-nd-cp',
        ten: 'Nghị định thủ tục nhập khẩu xe cơ giới và phương tiện giao thông qua cửa khẩu',
      }),
      docMau({
        so_hieu: '41/2026/NĐ-CP',
        slug: '41-2026-nd-cp',
        ten: 'Nghị định quy định số tờ khai và cơ tổ chức thực hiện thủ tục nhập khẩu',
      }),
      docMau({
        so_hieu: '42/2026/TT-BTC',
        slug: '42-2026-tt-btc',
        loai: 'THONG_TU',
        co_quan: 'Bộ Tài chính',
        ten: 'Thông tư về kiểm tra sau thông quan đối với doanh nghiệp chế xuất, sản xuất xuất khẩu và tạm nhập tái xuất',
      }),
    ],
    wikiSources: [
      {
        so_hieu: '40/2026/NĐ-CP',
        slug: '40-2026-nd-cp',
        tieu_de: 'Nhập khẩu xe cơ giới qua cửa khẩu',
        confidence: 'high',
        van_ban_lien_quan: [{ so_hieu: '40/2026/NĐ-CP', tinh_trang: 'CON_HIEU_LUC' }],
        body: '## Thủ tục\n\nNhập khẩu xe cơ giới và phương tiện giao thông thực hiện tại cửa khẩu theo quy định kiểm tra an toàn kỹ thuật.',
      },
      {
        so_hieu: '41/2026/NĐ-CP',
        slug: '41-2026-nd-cp',
        tieu_de: 'Quy định số tờ khai và cơ tổ chức nhập khẩu',
        confidence: 'high',
        van_ban_lien_quan: [{ so_hieu: '41/2026/NĐ-CP', tinh_trang: 'CON_HIEU_LUC' }],
        body: '## Khai báo\n\nNgười khai ghi số tờ khai và thông tin cơ tổ chức tiếp nhận hồ sơ khi làm thủ tục nhập khẩu.',
      },
      {
        so_hieu: '42/2026/TT-BTC',
        slug: '42-2026-tt-btc',
        tieu_de: 'Kiểm tra sau thông quan, doanh nghiệp chế xuất, sản xuất xuất khẩu, tạm nhập tái xuất',
        confidence: 'high',
        van_ban_lien_quan: [{ so_hieu: '42/2026/TT-BTC', tinh_trang: 'CON_HIEU_LUC' }],
        body: '## Phạm vi\n\nKiểm tra sau thông quan áp dụng với doanh nghiệp chế xuất, loại hình sản xuất hàng hóa xuất khẩu và hàng tạm nhập tái xuất.',
      },
    ],
  });

  try {
    const store = await taoKhoTraCuu({ root });
    const resOto = hoiPhapLuat(store, 'thủ tục nhập khẩu ô tô qua cửa khẩu nhập', { limit: 5 });
    const d40 = resOto.ket_qua.find((x) => x.slug === '40-2026-nd-cp');
    const d41 = resOto.ket_qua.find((x) => x.slug === '41-2026-nd-cp');
    t(
      '(4a) Đồng nghĩa VIET_TAT_PLHQ mở rộng ô tô/cửa khẩu nhập và không khớp nhầm chuỗi con "số tờ khai"',
      hasAllKeys && resOto.ket_qua[0]?.slug === '40-2026-nd-cp' && (!d41 || d40.diem_phu_hop > d41.diem_phu_hop),
      JSON.stringify({ hasAllKeys, kq: resOto.ket_qua.map((x) => [x.slug, x.diem_phu_hop]) }),
    );

    const resAbbr = hoiPhapLuat(store, 'quy trình ktstq đối với dncx, sxxk và tntx', { limit: 5 });
    t(
      '(4b) Mở rộng ktstq, dncx, sxxk, tntx truy hồi trúng văn bản tương ứng ở #1',
      resAbbr.ket_qua[0]?.slug === '42-2026-tt-btc' && resAbbr.van_ban_lien_quan[0]?.so_hieu === '42/2026/TT-BTC',
      JSON.stringify({ kq: resAbbr.ket_qua.map((x) => [x.slug, x.diem_phu_hop]) }),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// --- Test 5: Liên kết chuỗi sửa đổi/hướng dẫn còn hiệu lực trong hoiPhapLuat ---
{
  const root = soGia({
    vanBan: [
      docMau({
        so_hieu: '50/2020/NĐ-CP',
        slug: '50-2020-nd-cp',
        ngay_ban_hanh: '2020-04-01',
        tinh_trang: 'HET_HIEU_LUC_MOT_PHAN',
        hieu_luc_tu: '2020-05-15',
        nhanh: ['thu-tuc-hai-quan/gia-cong-sxxk'],
        ten: 'Nghị định về miễn thuế nguyên liệu nhập khẩu hàng gia công xuất khẩu',
      }),
      docMau({
        so_hieu: '51/2024/NĐ-CP',
        slug: '51-2024-nd-cp',
        ngay_ban_hanh: '2024-04-01',
        tinh_trang: 'CON_HIEU_LUC',
        hieu_luc_tu: '2024-05-01',
        nhanh: ['thu-tuc-hai-quan/gia-cong-sxxk'],
        ten: 'Nghị định sửa đổi, bổ sung một số điều về hàng gia công',
        quan_he: {
          sua_doi: [{ so_hieu: '50/2020/NĐ-CP', tu_ngay: '2024-05-01' }],
        },
      }),
      docMau({
        so_hieu: '52/2024/TT-BTC',
        slug: '52-2024-tt-btc',
        loai: 'THONG_TU',
        co_quan: 'Bộ Tài chính',
        ngay_ban_hanh: '2024-05-10',
        tinh_trang: 'CON_HIEU_LUC',
        hieu_luc_tu: '2024-06-01',
        nhanh: ['thu-tuc-hai-quan/gia-cong-sxxk'],
        ten: 'Thông tư hướng dẫn thủ tục hải quan đối với hàng gia công',
        quan_he: {
          huong_dan: [{ so_hieu: '50/2020/NĐ-CP', tu_ngay: '2024-06-01' }],
        },
      }),
      docMau({
        so_hieu: '53/2015/TT-BTC',
        slug: '53-2015-tt-btc',
        loai: 'THONG_TU',
        co_quan: 'Bộ Tài chính',
        ngay_ban_hanh: '2015-03-01',
        tinh_trang: 'HET_HIEU_LUC',
        hieu_luc_tu: '2015-04-01',
        het_hieu_luc_tu: '2020-05-15',
        nhanh: ['thu-tuc-hai-quan/gia-cong-sxxk'],
        ten: 'Thông tư cũ đã hết hiệu lực sửa đổi về hàng gia công',
        quan_he: {
          sua_doi: [{ so_hieu: '50/2020/NĐ-CP', tu_ngay: '2015-04-01' }],
        },
      }),
    ],
    wikiSources: [
      {
        so_hieu: '50/2020/NĐ-CP',
        slug: '50-2020-nd-cp',
        tieu_de: 'Miễn thuế nguyên liệu nhập khẩu hàng gia công xuất khẩu',
        confidence: 'high',
        van_ban_lien_quan: [{ so_hieu: '50/2020/NĐ-CP', tinh_trang: 'HET_HIEU_LUC_MOT_PHAN' }],
        body: '## Miễn thuế gia công\n\nNguyên liệu nhập khẩu để gia công sản phẩm xuất khẩu được miễn thuế nhập khẩu nếu đáp ứng định mức thực tế và thông báo cơ sở sản xuất.',
      },
    ],
  });

  try {
    const store = await taoKhoTraCuu({ root });
    const res = hoiPhapLuat(store, 'miễn thuế nguyên liệu nhập khẩu hàng gia công xuất khẩu', { limit: 5 });
    const vbList = res.van_ban_lien_quan.map((v) => v.so_hieu);
    t(
      '(5a) Liên kết chuỗi bi_sua_doi_boi và duoc_huong_dan_boi còn hiệu lực vào van_ban_lien_quan mà không cướp #1 và không kéo HET_HIEU_LUC',
      vbList[0] === '50/2020/NĐ-CP'
        && vbList.includes('51/2024/NĐ-CP')
        && vbList.includes('52/2024/TT-BTC')
        && !vbList.includes('53/2015/TT-BTC'),
      JSON.stringify(vbList),
    );

    const resSuaDoi = hoiPhapLuat(store, '51/2024/NĐ-CP sửa đổi hàng gia công', { limit: 5 });
    const vbSuaDoi = resSuaDoi.van_ban_lien_quan.map((v) => v.so_hieu);
    t(
      '(5b) Truy vấn văn bản sửa đổi kéo kèm văn bản gốc còn hiệu lực một phần qua quan_he.sua_doi',
      vbSuaDoi[0] === '51/2024/NĐ-CP' && vbSuaDoi.includes('50/2020/NĐ-CP'),
      JSON.stringify(vbSuaDoi),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// --- Test 6: Văn bản HET_HIEU_LUC trên wiki/sources không được vượt lên #1 ---
{
  const root = soGia({
    vanBan: [
      docMau({
        so_hieu: '60/2012/NĐ-CP',
        slug: '60-2012-nd-cp',
        ngay_ban_hanh: '2012-06-01',
        tinh_trang: 'HET_HIEU_LUC',
        hieu_luc_tu: '2012-07-15',
        het_hieu_luc_tu: '2020-01-01',
        ten: 'Nghị định cũ hết hiệu lực về xác định trị giá hải quan hàng nhập khẩu',
      }),
      docMau({
        so_hieu: '61/2025/NĐ-CP',
        slug: '61-2025-nd-cp',
        ngay_ban_hanh: '2025-02-01',
        tinh_trang: 'CON_HIEU_LUC',
        hieu_luc_tu: '2025-03-15',
        ten: 'Nghị định hiện hành về xác định trị giá hải quan hàng nhập khẩu',
      }),
    ],
    wikiSources: [
      {
        so_hieu: '60/2012/NĐ-CP',
        slug: '60-2012-nd-cp',
        tieu_de: 'Xác định trị giá hải quan hàng nhập khẩu',
        confidence: 'high',
        van_ban_lien_quan: [{ so_hieu: '60/2012/NĐ-CP', tinh_trang: 'HET_HIEU_LUC' }],
        body: '## Trị giá hải quan\n\nPhương pháp xác định trị giá hải quan đối với hàng hóa nhập khẩu theo trị giá giao dịch.',
      },
      {
        so_hieu: '61/2025/NĐ-CP',
        slug: '61-2025-nd-cp',
        tieu_de: 'Xác định trị giá hải quan hàng nhập khẩu hiện hành',
        confidence: 'high',
        van_ban_lien_quan: [{ so_hieu: '61/2025/NĐ-CP', tinh_trang: 'CON_HIEU_LUC' }],
        body: '## Trị giá hải quan\n\nPhương pháp xác định trị giá hải quan đối với hàng hóa nhập khẩu hiện hành.',
      },
    ],
  });

  try {
    const store = await taoKhoTraCuu({ root });
    const res = hoiPhapLuat(store, 'xác định trị giá hải quan hàng nhập khẩu', { limit: 5 });
    t(
      '(6) Văn bản HET_HIEU_LUC trên wiki/sources bị gắn cảnh báo hiệu lực và không xếp #1',
      res.ket_qua[0]?.slug === '61-2025-nd-cp' && res.van_ban_lien_quan[0]?.so_hieu === '61/2025/NĐ-CP',
      JSON.stringify({ kq: res.ket_qua.map((x) => [x.slug, x.diem_phu_hop]), vb: res.van_ban_lien_quan.map((x) => [x.so_hieu, x.tinh_trang]) }),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// --- Test 7: Độ phủ specificTokens thắng trùng ngày + đồng nghĩa rời rạc và tránh khớp nhầm "ô tô" -> "tô chức" ---
{
  const root = soGia({
    vanBan: [
      docMau({
        so_hieu: '70/2026/TT-BXD',
        slug: '70-2026-tt-bxd',
        loai: 'THONG_TU',
        co_quan: 'Bộ Xây dựng',
        ten: 'Thông tư ban hành danh mục kiểm tra chất lượng phương tiện giao thông',
      }),
      docMau({
        so_hieu: '71/2026/QH15',
        slug: '71-2026-qh15',
        loai: 'LUAT',
        co_quan: 'Quốc hội',
        ten: 'Luật sửa đổi thẩm quyền kiểm tra chất lượng xe cơ giới hiệu lực 01/07/2026',
      }),
      docMau({
        so_hieu: '72/2026/TT-BTC',
        slug: '72-2026-tt-btc',
        loai: 'THONG_TU',
        co_quan: 'Bộ Tài chính',
        ten: 'Thông tư về danh mục chất lượng khoáng sản tổ chức thực hiện',
        xac_minh: {
          muc: 'NGUON_A',
          ngay_xac_minh: '2026-06-01',
          dieu_khoan: [
            {
              dieu: 6,
              ten: 'Tô chức kiểm tra chất lượng danh mục khoáng sản',
              toan_van: 'Các tô chức thực hiện kiểm tra chất lượng theo danh mục khoáng sản xuất khẩu.',
              nghia_vu_xnk: ['Tô chức thực hiện kiểm tra danh mục khoáng sản'],
            },
          ],
        },
      }),
    ],
    wikiConcepts: [
      {
        slug: 'kiem-tra-o-to-nhap-khau',
        tieu_de: 'Phương tiện giao thông vận tải',
        tags: ['xe-co-gioi', 'oto'],
        confidence: 'high',
        van_ban_lien_quan: [{ so_hieu: '70/2026/TT-BXD', tinh_trang: 'CON_HIEU_LUC' }],
        body: '## Playbook kiểm tra\n\nÔ tô nhập khẩu phải kiểm tra chất lượng theo danh mục quy định từ ngày 01/7/2026 theo 70/2026/TT-BXD.',
      },
    ],
    wikiSources: [
      {
        so_hieu: '71/2026/QH15',
        slug: '71-2026-qh15',
        tieu_de: 'Luật 71/2026/QH15 sửa đổi kiểm tra chất lượng xe cơ giới (hiệu lực 01/07/2026)',
        tags: ['phuong-tien-giao-thong'],
        confidence: 'high',
        van_ban_lien_quan: [{ so_hieu: '71/2026/QH15', tinh_trang: 'CON_HIEU_LUC' }],
        body: '## Chuyển thẩm quyền kiểm tra chất lượng xe cơ giới từ 01/07/2026\n\nXe ô tô nhập khẩu chịu kiểm tra chất lượng từ ngày 01/07/2026.',
      },
      {
        so_hieu: '72/2026/TT-BTC',
        slug: '72-2026-tt-btc',
        tieu_de: 'Danh mục chất lượng khoáng sản hiệu lực 01/07/2026',
        confidence: 'high',
        van_ban_lien_quan: [{ so_hieu: '72/2026/TT-BTC', tinh_trang: 'CON_HIEU_LUC' }],
        body: '## Danh mục\n\nCác tô chức kiểm tra chất lượng theo danh mục khoáng sản áp dụng từ 01/07/2026.',
      },
    ],
  });

  try {
    const store = await taoKhoTraCuu({ root });
    const res = hoiPhapLuat(store, 'Ô tô nhập khẩu phải kiểm tra chất lượng theo danh mục nào từ 01/7/2026?', { limit: 5 });
    const cConcept = res.ket_qua.find((x) => x.slug === 'kiem-tra-o-to-nhap-khau');
    const cPartial = res.ket_qua.find((x) => x.slug === '71-2026-qh15');
    const cFakeTo = res.ket_qua.find((x) => x.slug === '72-2026-tt-btc');
    t(
      '(7) Độ phủ đủ specificTokens thắng khối chỉ trùng ngày/đồng nghĩa rời rạc và không khớp nhầm "tô chức" cho "ô tô"',
      res.ket_qua[0]?.slug === 'kiem-tra-o-to-nhap-khau'
        && Boolean(cConcept && cPartial && cConcept.diem_phu_hop > cPartial.diem_phu_hop)
        && (!cFakeTo || cConcept.diem_phu_hop > cFakeTo.diem_phu_hop)
        && res.van_ban_lien_quan[0]?.so_hieu === '70/2026/TT-BXD',
      JSON.stringify({
        kq: res.ket_qua.map((x) => [x.slug, x.diem_phu_hop]),
        vb: res.van_ban_lien_quan.map((x) => x.so_hieu),
      }),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// --- Test 8: Top NGUYEN_VAN_NGUON_A không bị đẩy xuống bởi danh sách ref dài trong wiki chunk ---
{
  const manyRefs = Array.from({ length: 12 }, (_, idx) =>
    docMau({
      so_hieu: `${81 + idx}/2026/TT-BCT`,
      slug: `${81 + idx}-2026-tt-bct`,
      loai: 'THONG_TU',
      co_quan: 'Bộ Công Thương',
      ten: `Văn bản tham chiếu phụ số ${81 + idx}`,
    }),
  );
  const refTagsText = manyRefs.map((d) => d.so_hieu).join(', ');
  const root = soGia({
    vanBan: [
      docMau({
        so_hieu: '80/2026/TT-BTC',
        slug: '80-2026-tt-btc',
        loai: 'THONG_TU',
        co_quan: 'Bộ Tài chính',
        ten: 'Thông tư quy định hoàn thuế bảo lãnh chứng từ điện tử đặc thù',
        xac_minh: {
          muc: 'NGUON_A',
          hieu_luc_da_doi_chieu: true,
          ngay_xac_minh: '2026-06-01',
          dieu_khoan: [
            {
              dieu: 15,
              ten: 'Hồ sơ hoàn thuế bảo lãnh chứng từ điện tử đặc thù',
              noi_dung: 'Điều 15. Hồ sơ hoàn thuế bảo lãnh chứng từ điện tử đặc thù gồm đơn đề nghị hoàn thuế bảo lãnh và chứng từ nộp ngân sách điện tử.',
              toan_van: 'Điều 15. Hồ sơ hoàn thuế bảo lãnh chứng từ điện tử đặc thù gồm đơn đề nghị hoàn thuế bảo lãnh và chứng từ nộp ngân sách điện tử.',
              nghia_vu_xnk: ['Nộp hồ sơ hoàn thuế bảo lãnh chứng từ điện tử đặc thù'],
            },
          ],
        },
      }),
      ...manyRefs,
    ],
    wikiConcepts: [
      {
        slug: 'tong-hop-nhieu-van-ban',
        tieu_de: 'Tổng hợp hồ sơ hoàn thuế bảo lãnh chứng từ điện tử đặc thù',
        confidence: 'high',
        van_ban_lien_quan: manyRefs.map((d) => ({ so_hieu: d.so_hieu, tinh_trang: 'CON_HIEU_LUC' })),
        body: [
          '## Bối cảnh hồ sơ hoàn thuế bảo lãnh chứng từ điện tử đặc thù',
          '',
          `Các quy định liên quan rải rác gồm ${refTagsText} áp dụng cho hồ sơ hoàn thuế bảo lãnh chứng từ điện tử đặc thù.`,
          '',
          '## Quy trình phối hợp chứng từ điện tử đặc thù',
          '',
          `Khi xử lý hoàn thuế bảo lãnh chứng từ điện tử đặc thù cần đối chiếu ${refTagsText}.`,
        ].join('\n'),
      },
    ],
  });

  try {
    const store = await taoKhoTraCuu({ root });
    const res = hoiPhapLuat(store, 'hồ sơ hoàn thuế bảo lãnh chứng từ điện tử đặc thù gồm những gì?', { limit: 5 });
    t(
      '(8) Top NGUYEN_VAN_NGUON_A giữ vị trí #1 trong van_ban_lien_quan dù wiki chunk có 12 ref phụ',
      res.dieu_khoan_nguon_a[0]?.so_hieu === '80/2026/TT-BTC'
        && res.van_ban_lien_quan[0]?.so_hieu === '80/2026/TT-BTC',
      JSON.stringify({
        dk0: res.dieu_khoan_nguon_a[0]?.so_hieu,
        vb: res.van_ban_lien_quan.slice(0, 5).map((v) => v.so_hieu),
      }),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// --- Test 9: Giữ nguyên expiredTop1 = 0 và fallback OOS (KHONG_TIM_THAY + goi_y_du_phong) ---
{
  const root = soGia({
    vanBan: [
      docMau({
        so_hieu: '90/2015/NĐ-CP',
        slug: '90-2015-nd-cp',
        ngay_ban_hanh: '2015-05-01',
        tinh_trang: 'HET_HIEU_LUC',
        hieu_luc_tu: '2015-07-01',
        het_hieu_luc_tu: '2026-07-01',
        ten: 'Nghị định cũ hết hiệu lực về ký quỹ bảo đảm phế liệu nhập khẩu',
        xac_minh: {
          muc: 'NGUON_A',
          hieu_luc_da_doi_chieu: true,
          ngay_xac_minh: '2026-07-05',
          dieu_khoan: [
            {
              dieu: 9,
              noi_dung: 'Điều 9. Ký quỹ bảo đảm phế liệu nhập khẩu thực hiện trước khi thông quan lô hàng phế liệu.',
            },
          ],
        },
      }),
      docMau({
        so_hieu: '91/2026/NĐ-CP',
        slug: '91-2026-nd-cp',
        ngay_ban_hanh: '2026-06-15',
        tinh_trang: 'CON_HIEU_LUC',
        hieu_luc_tu: '2026-07-01',
        ten: 'Nghị định hiện hành về ký quỹ bảo đảm phế liệu nhập khẩu',
        quan_he: {
          thay_the: [{ so_hieu: '90/2015/NĐ-CP', tu_ngay: '2026-07-01' }],
        },
      }),
    ],
    wikiSources: [
      {
        so_hieu: '90/2015/NĐ-CP',
        slug: '90-2015-nd-cp',
        tieu_de: 'Ký quỹ bảo đảm phế liệu nhập khẩu theo 90/2015/NĐ-CP',
        confidence: 'high',
        van_ban_lien_quan: [{ so_hieu: '90/2015/NĐ-CP', tinh_trang: 'HET_HIEU_LUC' }],
        body: '## Quy định ký quỹ\n\nKý quỹ bảo đảm phế liệu nhập khẩu trước thông quan.',
      },
      {
        so_hieu: '91/2026/NĐ-CP',
        slug: '91-2026-nd-cp',
        tieu_de: 'Quy định hiện hành ký quỹ bảo đảm phế liệu nhập khẩu',
        confidence: 'high',
        van_ban_lien_quan: [{ so_hieu: '91/2026/NĐ-CP', tinh_trang: 'CON_HIEU_LUC' }],
        body: '## Quy định hiện hành\n\nKý quỹ bảo đảm phế liệu nhập khẩu thay thế 90/2015/NĐ-CP từ 01/07/2026.',
      },
    ],
  });

  try {
    const store = await taoKhoTraCuu({ root });
    const resActive = hoiPhapLuat(store, 'ký quỹ bảo đảm phế liệu nhập khẩu thực hiện thế nào?', { limit: 5 });
    const resOosCode = hoiPhapLuat(store, 'Thông tư 999/2099/TT-XYZ quy định về thuế vũ trụ', { limit: 5 });
    const resOosTopic = hoiPhapLuat(store, 'Thủ tục nhập khẩu đũa thần phép thuật sao Hỏa', { limit: 5 });
    t(
      '(9) Giữ expiredTop1 = 0 và bật KHONG_TIM_THAY + goi_y_du_phong cho truy vấn OOS',
      resActive.van_ban_lien_quan[0]?.tinh_trang !== 'HET_HIEU_LUC'
        && resActive.van_ban_lien_quan[0]?.so_hieu === '91/2026/NĐ-CP'
        && resOosCode.do_tin_cay_tra_loi === 'KHONG_TIM_THAY'
        && resOosCode.goi_y_du_phong?.can_tra_nguon_truc_tiep === true
        && resOosCode.goi_y_du_phong?.can_mo_the_bo_sung_so === true
        && resOosTopic.do_tin_cay_tra_loi === 'KHONG_TIM_THAY'
        && resOosTopic.goi_y_du_phong?.can_tra_nguon_truc_tiep === true,
      JSON.stringify({
        vb0: resActive.van_ban_lien_quan[0],
        oos1: resOosCode.do_tin_cay_tra_loi,
        oos2: resOosTopic.do_tin_cay_tra_loi,
      }),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// --- Test 10: Phá hòa điểm điều khoản ưu tiên CON_HIEU_LUC và ngày ban hành mới hơn ---
{
  const tenChung = 'Quy định hồ sơ mẫu giấy nghiệp vụ kiểm dịch thực vật';
  const noiDungChung = 'Điều 4. Quy cách mẫu giấy nghiệp vụ kiểm dịch thực vật áp dụng thống nhất.';
  const root = soGia({
    vanBan: [
      docMau({
        so_hieu: '20/2021/TT-TEST',
        slug: '20-2021-tt-test',
        loai: 'THONG_TU',
        ngay_ban_hanh: '2021-12-28',
        tinh_trang: 'HET_HIEU_LUC_MOT_PHAN',
        hieu_luc_tu: '2022-02-11',
        ten: tenChung,
        xac_minh: {
          muc: 'NGUON_A',
          ngay_xac_minh: '2026-03-01',
          dieu_khoan: [{ dieu: 4, noi_dung: noiDungChung }],
        },
      }),
      docMau({
        so_hieu: '99/2026/VBHN-TEST',
        slug: '99-2026-vbhn-test',
        loai: 'VAN_BAN_HOP_NHAT',
        ngay_ban_hanh: '2026-10-20',
        tinh_trang: 'CON_HIEU_LUC',
        hieu_luc_tu: null,
        ten: tenChung,
        quan_he: {
          hop_nhat: [{ so_hieu: '20/2021/TT-TEST' }],
        },
        xac_minh: {
          muc: 'NGUON_A',
          ngay_xac_minh: '2026-10-20',
          dieu_khoan: [{ dieu: 4, noi_dung: noiDungChung }],
        },
      }),
    ],
  });

  try {
    const store = await taoKhoTraCuu({ root });
    const res = hoiPhapLuat(store, 'quy cách mẫu giấy nghiệp vụ kiểm dịch thực vật', { limit: 5 });
    t(
      '(10) Phá hòa điểm điều khoản ưu tiên CON_HIEU_LUC và ngày ban hành mới hơn, không rò rỉ _ngay',
      res.dieu_khoan_nguon_a[0]?.so_hieu === '99/2026/VBHN-TEST'
        && res.van_ban_lien_quan[0]?.so_hieu === '99/2026/VBHN-TEST'
        && !('_ngay' in (res.dieu_khoan_nguon_a[0] || {})),
      JSON.stringify({
        dk0: res.dieu_khoan_nguon_a[0],
        vb0: res.van_ban_lien_quan[0],
      }),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// --- Test 11: Wave 31 traChinhSachTheoMaHs thuần dữ liệu (nut_bieu, nhom_theo_trang_thai, can_kiem_cas, dieu_khoan_lien_quan) ---
{
  const fakeStore = {
    byKhoa: new Map(),
    nguonUyTin: { A: [] },
    canhBaoMaSet: new Set(),
    hsIndexTheoMa: {
      ma: {
        '2902': [
          {
            so_hieu: '10/2025/NĐ-CP',
            slug: '10-2025-nd-cp',
            ten: 'Kiểm tra chất lượng hóa chất',
            tinh_trang: 'CON_HIEU_LUC',
            hieu_luc_tu: '2025-01-01',
            hieu_luc_da_doi_chieu: true,
            loai_tac_dong: 'KIEM_TRA_CHAT_LUONG',
            dieu_kien: 'Thực hiện theo Điều 6 và Điều 12a.',
            phu_luc: 'Phụ lục I',
            nut_bieu: 'bieu:2902',
            van: 'a'.repeat(64),
          },
          {
            so_hieu: '11/2025/NĐ-CP',
            slug: '11-2025-nd-cp',
            ten: 'Cắt giảm kiểm tra chuyên ngành',
            tinh_trang: 'HET_HIEU_LUC_MOT_PHAN',
            hieu_luc_tu: '2025-02-01',
            hieu_luc_da_doi_chieu: true,
            loai_tac_dong: 'CAT_GIAM_KIEM_TRA',
            dieu_kien: 'Miễn kiểm tra theo Điều 3.',
            phu_luc: null,
          },
          {
            so_hieu: '12/2020/NĐ-CP',
            slug: '12-2020-nd-cp',
            ten: 'Văn bản hết hiệu lực',
            tinh_trang: 'HET_HIEU_LUC',
            hieu_luc_tu: '2020-01-01',
            het_hieu_luc_tu: '2025-01-01',
            hieu_luc_da_doi_chieu: true,
            loai_tac_dong: 'GIAY_PHEP',
            dieu_kien: 'Điều 6 không còn áp dụng.',
            phu_luc: null,
          },
          {
            so_hieu: '13/2026/NĐ-CP',
            slug: '13-2026-nd-cp',
            ten: 'Văn bản sắp có hiệu lực',
            tinh_trang: 'CHUA_CO_HIEU_LUC',
            hieu_luc_tu: '2027-01-01',
            hieu_luc_da_doi_chieu: true,
            loai_tac_dong: 'CAM_NHAP_KHAU',
            dieu_kien: null,
            phu_luc: 'Theo Điều 2 Phụ lục II',
          },
        ],
        '8517': [
          {
            so_hieu: '99/2025/TT-BTTTT',
            slug: '99-2025-tt-btttt',
            ten: 'Thiết bị viễn thông',
            tinh_trang: 'CON_HIEU_LUC',
            hieu_luc_tu: '2025-03-01',
            hieu_luc_da_doi_chieu: true,
            loai_tac_dong: 'CONG_BO_HOP_QUY',
            dieu_kien: 'Không nhắc điều luật.',
            phu_luc: null,
          },
        ],
        '7001': [
          {
            so_hieu: '24/2026/NĐ-CP',
            slug: '24-2026-nd-cp',
            ten: 'Danh mục có gắn văn bản CAS',
            tinh_trang: 'CON_HIEU_LUC',
            hieu_luc_tu: '2026-01-17',
            hieu_luc_da_doi_chieu: true,
            loai_tac_dong: 'GIAY_PHEP',
            dieu_kien: null,
            phu_luc: null,
          },
        ],
      },
    },
    dieuKhoan: {
      nguyen_van_nguon_a: [
        {
          so_hieu: '10/2025/NĐ-CP',
          slug: '10-2025-nd-cp',
          dieu_khoan: [
            { id: 'vb:10-2025-nd-cp:d:6', dieu: 6, trang_thai_dieu: 'NGUYEN_BAN', van: 'b'.repeat(64) },
            { dieu: '12a', trang_thai_dieu: 'DA_SUA_DOI', van: 'c'.repeat(64) },
          ],
        },
        {
          so_hieu: '13/2026/NĐ-CP',
          slug: '13-2026-nd-cp',
          dieu_khoan: [
            { id: 'vb:13-2026-nd-cp:d:2', dieu: 2, van: 'd'.repeat(64) },
          ],
        },
      ],
    },
    casIndex: {
      theo_cas: {
        '106-99-0': [{ id: 'cas:106-99-0:24-2026-nd-cp:0', cas: '106-99-0', so_hieu: '24/2026/NĐ-CP', slug: '24-2026-nd-cp' }],
      },
      khong_co_cas: [],
    },
  };

  const rChem = traChinhSachTheoMaHs(fakeStore, '29022000', { limit: 10 });
  const nhomChem = rChem.nhom_theo_trang_thai;
  const tongNhomChem = nhomChem.dang_ap_dung.length + nhomChem.cat_giam.length + nhomChem.het_hieu_luc_hoac_sap_co_hieu_luc.length;
  t(
    '(11a) traChinhSachTheoMaHs: nut_bieu, phân hoạch nhom_theo_trang_thai khớp 100% ket_qua & bảo toàn trường gốc',
    rChem.nut_bieu === 'bieu:29022000'
      && rChem.ket_qua.length === 4
      && tongNhomChem === rChem.ket_qua.length
      && nhomChem.dang_ap_dung.length === 1 && nhomChem.dang_ap_dung[0].so_hieu === '10/2025/NĐ-CP'
      && nhomChem.cat_giam.length === 1 && nhomChem.cat_giam[0].so_hieu === '11/2025/NĐ-CP'
      && nhomChem.het_hieu_luc_hoac_sap_co_hieu_luc.length === 2
      && rChem.ket_qua[0].nut_bieu === 'bieu:2902'
      && rChem.ket_qua[0].van === 'a'.repeat(64)
      && rChem.ket_qua[1].nut_bieu === 'bieu:2902'
      && rChem.ket_qua[1].van === null
      && rChem.ket_qua[0].dieu_kien === 'Thực hiện theo Điều 6 và Điều 12a.',
    JSON.stringify({ nut_bieu: rChem.nut_bieu, nhom: [nhomChem.dang_ap_dung.length, nhomChem.cat_giam.length, nhomChem.het_hieu_luc_hoac_sap_co_hieu_luc.length] }),
  );

  t(
    '(11b) traChinhSachTheoMaHs: liên kết tất định dieu_khoan_lien_quan[] & item.dieu_khoan_ids từ NGUYEN_VAN_NGUON_A',
    rChem.dieu_khoan_lien_quan.length === 3
      && rChem.ket_qua[0].dieu_khoan_ids.join(',') === 'vb:10-2025-nd-cp:d:6,vb:10-2025-nd-cp:d:12a'
      && rChem.ket_qua[2].dieu_khoan_ids.length === 0
      && rChem.ket_qua[3].dieu_khoan_ids.join(',') === 'vb:13-2026-nd-cp:d:2'
      && rChem.dieu_khoan_lien_quan.find((d) => d.id === 'vb:13-2026-nd-cp:d:2')?.trang_thai_dieu === 'HIEU_LUC',
    JSON.stringify({ ids0: rChem.ket_qua[0].dieu_khoan_ids, dk: rChem.dieu_khoan_lien_quan }),
  );

  const rNonChem = traChinhSachTheoMaHs(fakeStore, '8517', { limit: 10 });
  const rCasSlug = traChinhSachTheoMaHs(fakeStore, '7001', { limit: 10 });
  t(
    '(11c) traChinhSachTheoMaHs: can_kiem_cas đúng cho chương 29, slug casIndex (24-2026-nd-cp), và false cho 8517',
    rChem.can_kiem_cas === true && Boolean(rChem.ly_do_kiem_cas)
      && rCasSlug.can_kiem_cas === true && String(rCasSlug.ly_do_kiem_cas || '').includes('24/2026/NĐ-CP')
      && rNonChem.can_kiem_cas === false && rNonChem.ly_do_kiem_cas === null,
    JSON.stringify({ chem: rChem.can_kiem_cas, casSlug: rCasSlug.can_kiem_cas, nonChem: rNonChem.can_kiem_cas }),
  );

  const liveStore = await taoKhoTraCuu({ root: ROOT });
  const live2504 = traChinhSachTheoMaHs(liveStore, '2504', { limit: 10 });
  const live2804 = traChinhSachTheoMaHs(liveStore, '28041000', { limit: 10 });
  const live8517 = traChinhSachTheoMaHs(liveStore, '8517', { limit: 10 });
  t(
    '(11d) traChinhSachTheoMaHs trên kho thật: 2504 khớp Điều 5 NGUYEN_VAN_NGUON_A, 28041000 bật can_kiem_cas, 8517 đủ phân hoạch',
    live2504.nut_bieu === 'bieu:2504'
      && live2504.dieu_khoan_lien_quan.some((d) => d.id === 'vb:41-2019-tt-bct:d:5')
      && live2504.ket_qua.some((x) => Array.isArray(x.dieu_khoan_ids) && x.dieu_khoan_ids.includes('vb:41-2019-tt-bct:d:5'))
      && live2804.can_kiem_cas === true && live2804.nut_bieu === 'bieu:28041000'
      && live8517.can_kiem_cas === false
      && (live8517.nhom_theo_trang_thai.dang_ap_dung.length
        + live8517.nhom_theo_trang_thai.cat_giam.length
        + live8517.nhom_theo_trang_thai.het_hieu_luc_hoac_sap_co_hieu_luc.length) === live8517.ket_qua.length,
    JSON.stringify({ dk2504: live2504.dieu_khoan_lien_quan, cas2804: live2804.can_kiem_cas, cas8517: live8517.can_kiem_cas }),
  );

  // --- Test 12: Wave 36A OOS biên lao động nội địa ("trợ cấp thôi việc" != "chống trợ cấp") & suy thay thế từ ghi_chu khi thiếu quan_he_nguoc ---
  const oosLabor = hoiPhapLuat(
    liveStore,
    'Quy định chấm dứt hợp đồng lao động và tính trợ cấp thất nghiệp theo Bộ luật Lao động?',
    { limit: 5 },
  );
  const inScopeCvd = hoiPhapLuat(
    liveStore,
    'Điều kiện áp dụng biện pháp chống trợ cấp đối với hàng hóa nhập khẩu vào Việt Nam?',
    { limit: 5 },
  );
  t(
    '(12a) OOS: tranh chấp/trợ cấp lao động nội địa không khớp nhầm neo "chống trợ cấp", nhưng câu hỏi chống trợ cấp XNK vẫn trong phạm vi',
    oosLabor.ngoai_pham_vi === true
      && oosLabor.do_tin_cay_tra_loi === 'KHONG_TIM_THAY'
      && inScopeCvd.ngoai_pham_vi === false
      && inScopeCvd.do_tin_cay_tra_loi !== 'KHONG_TIM_THAY',
    JSON.stringify({ oosLabor: oosLabor.do_tin_cay_tra_loi, inScopeCvd: inScopeCvd.do_tin_cay_tra_loi }),
  );

  const rep29 = hoiPhapLuat(
    liveStore,
    'Thông tư 29/2014/TT-BTC về xác định trị giá hải quan còn áp dụng không hay đã chuyển sang văn bản nào?',
    { limit: 5 },
  );
  t(
    '(12b) Bẫy văn bản cũ: VB HET_HIEU_LUC ghi thay thế trong ghi_chu (29/2014/TT-BTC -> 39/2015/TT-BTC) tự động đẩy VB mới lên #1 & tắt báo thiếu sổ giả',
    rep29.van_ban_lien_quan[0]?.so_hieu === '39/2015/TT-BTC'
      && rep29.van_ban_lien_quan[0]?.tinh_trang === 'CON_HIEU_LUC'
      && rep29.goi_y_du_phong?.can_mo_the_bo_sung_so !== true,
    JSON.stringify({ top2: rep29.van_ban_lien_quan.slice(0, 2).map((v) => [v.so_hieu, v.tinh_trang]), goiY: rep29.goi_y_du_phong }),
  );
}

console.log(`\nKết quả test-tra-cuu-plhq: ${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
