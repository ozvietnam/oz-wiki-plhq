// Unit test cho công cụ phân loại issue [miss]: tools/phan-loai-miss.mjs.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { napSo, ROOT } from '../lib/registry.mjs';
import { NHOM_MISS, phanLoaiMiss, veBaoCaoMissMarkdown } from '../phan-loai-miss.mjs';

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
const makeTmp = (prefix = 'kb-miss-') => {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tmpDirs.push(dir);
  return dir;
};

const soGia = {
  vanBan: [
    {
      _file: 'registry/van-ban/80-2023-nd-cp.yaml',
      so_hieu: '80/2023/NĐ-CP',
      tinh_trang: 'CON_HIEU_LUC',
      xac_minh: { muc: 'NGUON_A', hieu_luc_da_doi_chieu: true },
    },
    {
      _file: 'registry/van-ban/53-2020-nd-cp.yaml',
      so_hieu: '53/2020/NĐ-CP',
      tinh_trang: 'HET_HIEU_LUC',
      xac_minh: { muc: 'NGUON_A', hieu_luc_da_doi_chieu: true },
    },
    {
      _file: 'registry/van-ban/174-2025-nd-cp.yaml',
      so_hieu: '174/2025/NĐ-CP',
      tinh_trang: 'CON_HIEU_LUC',
      xac_minh: { muc: 'NGUON_A', hieu_luc_da_doi_chieu: true },
    },
    {
      _file: 'registry/van-ban/69-2018-nd-cp.yaml',
      so_hieu: '69/2018/NĐ-CP',
      tinh_trang: 'HET_HIEU_LUC',
      xac_minh: { muc: 'NGUON_A', hieu_luc_da_doi_chieu: true },
    },
    {
      _file: 'registry/van-ban/01-2022-tt-bnnptnt.yaml',
      so_hieu: '01/2022/TT-BNNPTNT',
      so_hieu_khac: ['01/2022/TT-BNNPTNN', 'TT-01-2022-BNNPTNT'],
      tinh_trang: 'CON_HIEU_LUC',
      xac_minh: { muc: 'NGUON_B', hieu_luc_da_doi_chieu: false },
    },
    {
      _file: 'registry/van-ban/67-2026-vbhn-bnnmt.yaml',
      so_hieu: '67/2026/VBHN-BNNMT',
      so_hieu_khac: ['67/VBHN-BNNMT'],
      tinh_trang: 'CON_HIEU_LUC',
      xac_minh: { muc: 'NGUON_A', hieu_luc_da_doi_chieu: true },
    },
  ],
};

try {
  // 1. Kiểm tra cả 5 nhóm + so_hieu_khac + lọc [miss] và nhãn miss
  const issuesMau = [
    {
      number: 101,
      title: '[miss] 80/2023/ND-CP — khách tra 1 lần, sổ chưa có',
      body: 'Nguồn log: `hs-code-api/data/legal-status-miss.jsonl` (RUNTIME_LOG)',
      labels: [{ name: 'nhu-cau' }],
      url: 'https://github.com/ozvietnam/oz-wiki-plhq/issues/101',
    },
    {
      number: 102,
      title: '[miss] 53/2020/NĐ-CP — khách tra 2 lần, sổ chưa có',
      body: 'Khách tra hiệu lực **53/2020/NĐ-CP** qua `/api/dataset?resource=legal_status`.',
      labels: ['nhu-cau'],
    },
    {
      number: 103,
      title: 'Khách tra biến thể số hiệu trong biểu thuế',
      body: 'Biểu thuế nhắc `01/2022/TT-BNNPTNN` và `67/VBHN-BNNMT`.',
      labels: [{ name: 'miss' }],
    },
    {
      number: 104,
      title: '[miss] Nhờ áp mã HS 8 số cho máy nén khí trục vít theo quy tắc GIR 1',
      body: 'Cần tra Chú giải HS WCO, biểu thuế XNK, thuế suất nhập khẩu và tiền lệ áp mã của hs-code-api.',
      labels: [{ name: 'nhu-cau' }],
    },
    {
      number: 105,
      title: '[miss] 72/2018/TT-BTC — khách tra 1 lần, sổ chưa có',
      body: 'Khách tra hiệu lực **72/2018/TT-BTC** nhưng chưa có. Nguồn log: `hs-code-api/data/legal-status-miss.jsonl`.',
      labels: [{ name: 'nhu-cau' }],
    },
    {
      number: 106,
      title: '[miss] 23808/2026/CHQ-NVTHQ — sổ chưa có (chờ nguồn chính thống bậc A)',
      body: 'Công văn **23808/2026/CHQ-NVTHQ** hướng dẫn giảm thuế GTGT theo **Nghị định 174/2025/NĐ-CP**.',
      labels: [{ name: 'luong:truy-vet-nguon' }],
    },
    {
      number: 107,
      title: '[miss] Cần bổ sung wiki và tóm tắt điều khoản KTCN mỹ phẩm nhập khẩu',
      body: 'Yêu cầu hỏi đáp nghiệp vụ về hướng dẫn thủ tục kiểm tra chuyên ngành và bổ sung tóm tắt văn bản đã biết.',
      labels: [{ name: 'nhu-cau' }],
    },
    {
      number: 108,
      title: '[miss] 69/2018/N — khách tra 1 lần, sổ chưa có',
      body: 'Khách tra **69/2018/N** (chuỗi bị cắt cụt).',
      labels: [{ name: 'nhu-cau' }],
    },
    {
      number: 109,
      title: '[miss] Phản hồi không rõ yêu cầu',
      body: 'Khách nhắn tin kiểm tra lại giúp kết quả hôm qua.',
      labels: [{ name: 'nhu-cau' }],
    },
    {
      number: 110,
      title: '[radar] VB mới 2026-11-20: 1 văn bản thuộc phạm vi',
      body: '- [ ] **82/2026/TT-BXD**',
      labels: [{ name: 'radar' }],
    },
  ];

  const kq = phanLoaiMiss(issuesMau, soGia, { today: '2026-11-21', nguon: 'fixture' });
  const tim = (num) => kq.chi_tiet.find((x) => x.number === num);

  t('(1) lọc đúng 9 issue [miss]/nhãn miss từ 10 issue mở (loại [radar])',
    kq.tong_issue_mo === 10 && kq.tong_issue_miss === 9 && kq.tong_da_phan_loai === 9 && !tim(110),
    JSON.stringify({ mo: kq.tong_issue_mo, miss: kq.tong_issue_miss, pl: kq.tong_da_phan_loai }));

  t('(2) DA_CO_TRONG_SO: khớp qua khoa() không phân biệt Đ/D và giữ đủ tinh_trang & xac_minh.muc',
    tim(101)?.nhom === NHOM_MISS.DA_CO_TRONG_SO
    && tim(101)?.tinh_trang === 'CON_HIEU_LUC'
    && tim(101)?.xac_minh_muc === 'NGUON_A'
    && tim(102)?.nhom === NHOM_MISS.DA_CO_TRONG_SO
    && tim(102)?.tinh_trang === 'HET_HIEU_LUC'
    && tim(102)?.van_ban_khop?.xac_minh?.muc === 'NGUON_A',
    JSON.stringify({ i101: tim(101), i102: tim(102) }));

  t('(3) DA_CO_TRONG_SO qua so_hieu_khac (nhãn miss, số hiệu trong body)',
    tim(103)?.nhom === NHOM_MISS.DA_CO_TRONG_SO
    && tim(103)?.van_ban_khop?.so_hieu === '01/2022/TT-BNNPTNT'
    && tim(103)?.van_ban_khop?.khop_qua_so_hieu_khac === true
    && tim(103)?.tinh_trang === 'CON_HIEU_LUC'
    && tim(103)?.xac_minh_muc === 'NGUON_B',
    JSON.stringify(tim(103)));

  t('(4) THUOC_HS_CODE_API: phân loại HS 8 số / biểu thuế / GIR / WCO / tiền lệ áp mã',
    tim(104)?.nhom === NHOM_MISS.THUOC_HS_CODE_API,
    JSON.stringify(tim(104)));

  t('(5) THIEU_VAN_BAN_MOI: VBQPPL thiếu và không bị chân trang hs-code-api đánh nhầm; công văn thiếu không bị trích dẫn nền trong body cướp nhóm',
    tim(105)?.nhom === NHOM_MISS.THIEU_VAN_BAN_MOI
    && tim(105)?.so_hieu_chua_co?.includes('72/2018/TT-BTC')
    && tim(106)?.nhom === NHOM_MISS.THIEU_VAN_BAN_MOI
    && tim(106)?.so_hieu_chua_co?.includes('23808/2026/CHQ-NVTHQ'),
    JSON.stringify({ i105: tim(105), i106: tim(106) }));

  t('(6) THIEU_WIKI_HOAC_DIEU_KHOAN: hỏi đáp, thủ tục, KTCN, tóm tắt điều khoản, bổ sung wiki',
    tim(107)?.nhom === NHOM_MISS.THIEU_WIKI_HOAC_DIEU_KHOAN,
    JSON.stringify(tim(107)));

  t('(7) KHAC_CAN_RA_SOAT: số hiệu cắt cụt (kèm gợi ý gan_khop) và case mơ hồ',
    tim(108)?.nhom === NHOM_MISS.KHAC_CAN_RA_SOAT
    && tim(108)?.gan_khop?.includes('69/2018/NĐ-CP')
    && tim(109)?.nhom === NHOM_MISS.KHAC_CAN_RA_SOAT,
    JSON.stringify({ i108: tim(108), i109: tim(109) }));

  // 2. Fixture không có [miss] ở tiêu đề/nhãn -> vẫn phân loại hợp lý hoặc theo chiLocMiss
  const fixtureKhongNhan = [
    { number: 201, title: 'Cần bổ sung trang wiki quy trình KTCN', body: 'Hướng dẫn thủ tục một cửa.' },
    { number: 202, title: 'Áp mã HS 8 số cho van công nghiệp', body: 'Theo Chú giải HS WCO và GIR.' },
  ];
  const kqFallback = phanLoaiMiss(fixtureKhongNhan, soGia, { today: '2026-11-21' });
  const kqStrict = phanLoaiMiss(fixtureKhongNhan, soGia, { today: '2026-11-21', chiLocMiss: true });
  t('(8) xử lý fixture không gắn thẻ [miss] & chế độ lọc strict chiLocMiss: true',
    kqFallback.che_do_loc === 'all_fallback'
    && kqFallback.tong_issue_mo === 2
    && kqFallback.tong_issue_miss === 0
    && kqFallback.tong_da_phan_loai === 2
    && kqFallback.thong_ke.THIEU_WIKI_HOAC_DIEU_KHOAN === 1
    && kqFallback.thong_ke.THUOC_HS_CODE_API === 1
    && kqStrict.tong_da_phan_loai === 0,
    JSON.stringify({ kqFallback: kqFallback.thong_ke, kqStrict: kqStrict.tong_da_phan_loai }));

  // 3. Danh sách rỗng
  const kqRong = phanLoaiMiss([], soGia, { today: '2026-11-21' });
  const mdRong = veBaoCaoMissMarkdown(kqRong);
  t('(9) danh sách rỗng: thống kê đều 0, Markdown sạch không NaN',
    kqRong.tong_issue_mo === 0
    && kqRong.tong_issue_miss === 0
    && kqRong.tong_da_phan_loai === 0
    && Object.values(kqRong.thong_ke).every((v) => v === 0)
    && !mdRong.includes('NaN')
    && mdRong.includes('Không có issue `[miss]` nào'),
    mdRong);

  // 4. Đầu ra Markdown
  const md = veBaoCaoMissMarkdown(kq);
  t('(10) veBaoCaoMissMarkdown xuất đủ 5 nhóm, so_hieu_khac, tinh_trang và xac_minh.muc',
    md.includes('# Báo cáo phân loại issue [miss] — 2026-11-21')
    && md.includes('`DA_CO_TRONG_SO`')
    && md.includes('`THUOC_HS_CODE_API`')
    && md.includes('`THIEU_VAN_BAN_MOI`')
    && md.includes('`THIEU_WIKI_HOAC_DIEU_KHOAN`')
    && md.includes('`KHAC_CAN_RA_SOAT`')
    && md.includes('tinh_trang: CON_HIEU_LUC')
    && md.includes('xac_minh.muc: NGUON_A')
    && md.includes('so_hieu_khac'),
    md);

  // 5. CLI --file <path> (Markdown & --json) và kiểm chứng trên sổ thật napSo(ROOT)
  const tmpDir = makeTmp();
  const fixturePath = join(tmpDir, 'issues.json');
  const issuesCli = issuesMau.map((it) => {
    if (it.number === 105) {
      return {
        ...it,
        title: '[miss] 999/2099/TT-BTC — khách tra 1 lần, sổ chưa có',
        body: 'Khách tra hiệu lực **999/2099/TT-BTC** nhưng chưa có. Nguồn log: `hs-code-api/data/legal-status-miss.jsonl`.',
      };
    }
    if (it.number === 106) {
      return {
        ...it,
        title: '[miss] 99999/2099/CHQ-NVTHQ — sổ chưa có (chờ nguồn chính thống bậc A)',
        body: 'Công văn **99999/2099/CHQ-NVTHQ** hướng dẫn giảm thuế GTGT theo **Nghị định 174/2025/NĐ-CP**.',
      };
    }
    return it;
  });
  writeFileSync(fixturePath, JSON.stringify(issuesCli, null, 2));

  const cliJson = spawnSync(
    process.execPath,
    [join(ROOT, 'tools', 'phan-loai-miss.mjs'), '--file', fixturePath, '--json'],
    { cwd: ROOT, encoding: 'utf8' },
  );
  const cliMd = spawnSync(
    process.execPath,
    [join(ROOT, 'tools', 'phan-loai-miss.mjs'), '--file', fixturePath],
    { cwd: ROOT, encoding: 'utf8' },
  );
  const parsedCli = JSON.parse(cliJson.stdout || '{}');
  t('(11) CLI --file hoạt động đúng với cả JSON (--json) và Markdown trên sổ thật',
    cliJson.status === 0
    && cliMd.status === 0
    && parsedCli.tong_da_phan_loai === 9
    && parsedCli.tong_van_ban_trong_so > 2000
    && parsedCli.thong_ke?.DA_CO_TRONG_SO === 3
    && cliMd.stdout.includes('| Đã có trong sổ | `DA_CO_TRONG_SO` | 3 |'),
    JSON.stringify({ s1: cliJson.status, s2: cliMd.status, tk: parsedCli.thong_ke, err: cliJson.stderr }));

  // 6. Khớp so_hieu_khac trực tiếp trên sổ thật napSo(ROOT)
  const soThat = napSo(ROOT);
  const kqSoThat = phanLoaiMiss([
    { number: 901, title: '[miss] 01/2022/TT-BNNPTNN — khách tra 1 lần, sổ chưa có', body: '' },
    { number: 902, title: '[miss] 67/VBHN-BNNMT — khách tra 1 lần, sổ chưa có', body: '' },
  ], soThat, { today: '2026-11-21' });
  t('(12) sổ thật: khớp đúng so_hieu_khac (01/2022/TT-BNNPTNN và 67/VBHN-BNNMT) kèm tinh_trang & xac_minh.muc',
    kqSoThat.thong_ke.DA_CO_TRONG_SO === 2
    && kqSoThat.chi_tiet[0].van_ban_khop?.so_hieu === '01/2022/TT-BNNPTNT'
    && kqSoThat.chi_tiet[0].van_ban_khop?.khop_qua_so_hieu_khac === true
    && kqSoThat.chi_tiet[1].van_ban_khop?.so_hieu === '67/2026/VBHN-BNNMT'
    && kqSoThat.chi_tiet[1].xac_minh_muc === 'NGUON_A',
    JSON.stringify(kqSoThat.chi_tiet));
} finally {
  for (const d of tmpDirs) rmSync(d, { recursive: true, force: true });
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
