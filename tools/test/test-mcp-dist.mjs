// Test bộ tạo dữ liệu máy MCP (1.5.0): wiki-dist, dieu-khoan-dist, cas-index, anh_xa_ahtn_cu, chinh-sach-mo-ta và CLI tools/dung.mjs.
// Mọi kiểm thử chỉ ghi vào tmpdir() hoặc kiểm trong RAM — không chạm WORK/dist/ hay WORK/bao-cao/.
import { mkdtempSync, mkdirSync, writeFileSync, cpSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { napSo, ROOT, LUOC_DO_PHIEN_BAN } from '../lib/registry.mjs';
import { dungJson } from '../dung.mjs';
import { kiemTra } from '../kiem-tra.mjs';
import { RE_SO_HIEU_WIKI, phanTichFrontmatter, tachChunks, dungWikiDist } from '../lib/wiki-dist.mjs';
import { chuanHoaSlugDocHieu, laDieuRac, dungDieuKhoan, dungCasIndex } from '../lib/dieu-khoan-dist.mjs';
import { COT_CAS, dungChiMuc, dungChiMucTheoMa, docBieuThue, docAnhXaAhtn, kiemAnhXaAhtn, demLa } from '../lib/danh-muc.mjs';
import { TU_DIEN_VIET_TAT_PLHQ, docChinhSachMoTa, kiemChinhSachMoTa, dungChinhSachMoTa } from '../lib/chinh-sach-mo-ta.mjs';

let pass = 0;
let fail = 0;
const t = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`PASS ${name}`); }
  else { fail += 1; console.log(`FAIL ${name} ${extra}`); }
};

const XM = 'xac_minh: {muc: NGUON_A, hieu_luc_da_doi_chieu: true, ngay: "2026-10-04"}';
const NGUON_A = 'nguon: [{url: "https://congbao.chinhphu.vn/x", truy_cap: "2026-10-04"}]';
const tmpDirs = [];
const makeTmp = (prefix) => {
  const d = mkdtempSync(join(tmpdir(), prefix));
  tmpDirs.push(d);
  return d;
};

function soGia(vanBan, { wiki = {}, docHieu = {}, danhMuc = {}, extra = {} } = {}) {
  const root = makeTmp('kb-mcp-');
  mkdirSync(join(root, 'registry', 'van-ban'), { recursive: true });
  for (const f of ['cay-xnk.yaml', 'co-quan.yaml', 'nguon-uy-tin.yaml']) {
    cpSync(join(ROOT, 'registry', f), join(root, 'registry', f));
  }
  for (const [file, body] of Object.entries(vanBan)) {
    writeFileSync(join(root, 'registry', 'van-ban', file), body);
  }
  for (const [rel, body] of Object.entries(wiki)) {
    const full = join(root, 'wiki', rel);
    mkdirSync(join(full, '..'), { recursive: true });
    writeFileSync(full, body);
  }
  for (const [file, body] of Object.entries(docHieu)) {
    mkdirSync(join(root, 'data', 'doc-hieu'), { recursive: true });
    writeFileSync(join(root, 'data', 'doc-hieu', file), body);
  }
  for (const [file, body] of Object.entries(danhMuc)) {
    mkdirSync(join(root, 'danh-muc'), { recursive: true });
    writeFileSync(join(root, 'danh-muc', file), body);
  }
  for (const [rel, body] of Object.entries(extra)) {
    const full = join(root, rel);
    mkdirSync(join(full, '..'), { recursive: true });
    writeFileSync(full, body);
  }
  return root;
}

try {
  // 1. Phiên bản lược đồ
  t(`lược đồ: LUOC_DO_PHIEN_BAN = ${LUOC_DO_PHIEN_BAN}`, LUOC_DO_PHIEN_BAN === '1.7.0');

  // 2. Regex + frontmatter + tachChunks
  const hitsRe = 'Theo 28/2026/TT-BCT, 08/2015/NĐ-CP, 1182/QĐ-BCT và 54/2014/QH13.'.match(RE_SO_HIEU_WIKI) || [];
  t('RE_SO_HIEU_WIKI bắt đủ 4 dạng số hiệu chuẩn',
    hitsRe.includes('28/2026/TT-BCT') && hitsRe.includes('08/2015/NĐ-CP')
    && hitsRe.includes('1182/QĐ-BCT') && hitsRe.includes('54/2014/QH13'),
    JSON.stringify(hitsRe));

  const fmOk = phanTichFrontmatter('---\nid: mau\ntitle: "Tiêu đề"\ncreated: 2026-10-04\ntags: [a, b]\nconfidence: high\n---\n\n## Mục 1\nNội dung');
  t('phanTichFrontmatter: parse chuẩn bằng CORE_SCHEMA (ngày giữ string)',
    fmOk.loi === null && fmOk.meta.id === 'mau' && fmOk.meta.created === '2026-10-04'
    && Array.isArray(fmOk.meta.tags) && fmOk.meta.tags.length === 2 && fmOk.body.includes('## Mục 1'));

  const fmErr = phanTichFrontmatter('---\ntitle: [lỗi chưa đóng ngoặc\n---\n\n## Mục lỗi\nVẫn lấy được body');
  t('phanTichFrontmatter: YAML lỗi không crash, vẫn trả body',
    typeof fmErr.loi === 'string' && fmErr.loi.length > 0 && fmErr.body.includes('Vẫn lấy được body'));

  const fmNone = phanTichFrontmatter('Chỉ có nội dung thường.');
  t('phanTichFrontmatter: không có frontmatter vẫn an toàn',
    fmNone.loi === null && fmNone.body === 'Chỉ có nội dung thường.');

  const bodyMau = [
    'Đoạn mở đầu trước H2.',
    '',
    '## Mục nhỏ',
    '### Con giữ nguyên',
    'Nội dung ngắn.',
    '',
    '## Mục trống',
    '',
    '## Mục lớn',
    'Giới thiệu mục lớn.',
    '### Điều 1',
    'A'.repeat(1200),
    '### Điều 2',
    'B'.repeat(1200),
    '',
    '## Mục lớn không có H3',
    'C'.repeat(2100),
  ].join('\n');
  const chunksMau = tachChunks(bodyMau);
  t('tachChunks: giữ đoạn mở đầu, bỏ mục trống, không tách ### khi ≤ 2000 ký tự',
    chunksMau[0].muc === '' && chunksMau[0].noi_dung === 'Đoạn mở đầu trước H2.'
    && chunksMau[1].muc === 'Mục nhỏ' && chunksMau[1].noi_dung.includes('### Con giữ nguyên')
    && !chunksMau.some((c) => c.muc === 'Mục trống'));
  t('tachChunks: mục > 2000 ký tự tách tiếp theo ### giữ tên mục cha',
    chunksMau.some((c) => c.muc === 'Mục lớn')
    && chunksMau.some((c) => c.muc === 'Mục lớn > Điều 1' && c.noi_dung.length === 1200)
    && chunksMau.some((c) => c.muc === 'Mục lớn > Điều 2' && c.noi_dung.length === 1200)
    && chunksMau.some((c) => c.muc === 'Mục lớn không có H3' && c.noi_dung.length === 2100),
    JSON.stringify(chunksMau.map((c) => [c.muc, c.noi_dung.length])));

  // 3. dungWikiDist trên fixture soGia
  const rWiki = soGia({
    'moi.yaml': `so_hieu: 85/2026/TT-BTC\nloai: THONG_TU\nten: Mới\nco_quan: BTC\nhieu_luc_tu: "2026-09-15"\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/thu-tuc]\nquan_he: {thay_the: [14/2015/TT-BTC]}\n${NGUON_A}\n${XM}\n`,
    'cu.yaml': `so_hieu: 14/2015/TT-BTC\nso_hieu_khac: [14/2015/TTBTC]\nloai: THONG_TU\nten: Cũ\nco_quan: BTC\nhet_hieu_luc_tu: "2026-09-15"\ntinh_trang: HET_HIEU_LUC\nnhanh: [hai-quan/thu-tuc]\n${NGUON_A}\n${XM}\n`,
    'bai.yaml': `so_hieu: 99/2026/NĐ-CP\nloai: NGHI_DINH\nten: Bãi bỏ\nco_quan: CP\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/thu-tuc]\nquan_he: {bai_bo: [43/2017/NĐ-CP]}\n${NGUON_A}\n${XM}\n`,
    'cu2.yaml': `so_hieu: 43/2017/NĐ-CP\nloai: NGHI_DINH\nten: Nhãn cũ\nco_quan: CP\nhet_hieu_luc_tu: "2026-01-23"\ntinh_trang: HET_HIEU_LUC\nnhanh: [hai-quan/thu-tuc]\n${NGUON_A}\n${XM}\n`,
    'tb.yaml': `so_hieu: 503/TB-TCHQ\nloai: THONG_BAO\nten: Thông báo phân loại cũ\nco_quan: TCHQ\ntinh_trang: HET_HIEU_LUC\nnhanh: [hai-quan/thu-tuc]\n${NGUON_A}\n${XM}\n`,
  }, {
    wiki: {
      'summary/tong-hop.md': '---\nid: tong-hop\ntitle: "Tổng hợp"\ntags: [hai-quan]\nconfidence: medium\n---\n\n## Áp dụng sai\nTheo 14/2015/TT-BTC khi phân loại.\n\n## Ngữ cảnh lịch sử\nTrước đây áp dụng 43/2017/NĐ-CP và 503/TB-TCHQ.\n',
      'concepts/da-cap-nhat.md': '---\nid: da-cap-nhat\ntitle: "Đã cập nhật"\ntags: [phan-loai]\nconfidence: high\n---\n\n## Quy trình\nTrước đây dùng 14/2015/TT-BTC.\n\n## Văn bản thay thế\nHiện áp dụng 85/2026/TT-BTC.\n',
      'concepts/nguon-thong-bao.md': '---\nid: nguon-thong-bao\ntitle: "Chỉ nhắc thông báo hết"\ntags: [tb]\nconfidence: low\n---\n\n## Tham khảo\nXem 503/TB-TCHQ để đối chiếu.\n',
      'sources/14-2015-tt-btc.md': '---\nid: 14-2015-tt-btc\ntitle: "TT 14/2015/TT-BTC"\ntags: [thong-tu]\nconfidence: high\n---\n\n## Nội dung\nÁp dụng 14/2015/TT-BTC.\n',
      'graph/bo-qua.md': '# Không quét\nTheo 14/2015/TT-BTC.\n',
      'index.md': '# Index\nTheo 14/2015/TT-BTC.\n',
      'log.md': '# Log\nTheo 14/2015/TT-BTC.\n',
      'chuan-mau-wiki-source.md': '# Mẫu\nTheo 14/2015/TT-BTC.\n',
    },
  });
  const wRes = dungWikiDist(napSo(rWiki), rWiki, '2026-11-21');
  t('wiki-dist: đủ metadata chung + bỏ qua graph/index/log/chuan-mau',
    wRes.index.phien_ban === '2026-11-21'
    && wRes.index.luoc_do_phien_ban === LUOC_DO_PHIEN_BAN
    && wRes.index.giay_phep === 'CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/'
    && wRes.index.ghi_nguon_chuan.includes('oz-wiki-plhq')
    && wRes.index.mien_tru.length > 10
    && wRes.index.tong === 4
    && wRes.chunks.tong === wRes.chunks.chunks.length
    && !wRes.index.trang.some((p) => /graph|index|log|chuan-mau/.test(p.duong_dan)),
    JSON.stringify(wRes.index.trang.map((p) => p.duong_dan)));

  const cSai = wRes.chunks.chunks.find((c) => c.slug === 'tong-hop' && c.muc === 'Áp dụng sai');
  const cLs = wRes.chunks.chunks.find((c) => c.slug === 'tong-hop' && c.muc === 'Ngữ cảnh lịch sử');
  const cDaCapNhat = wRes.chunks.chunks.find((c) => c.slug === 'da-cap-nhat' && c.muc === 'Quy trình');
  const cTb = wRes.chunks.chunks.find((c) => c.slug === 'nguon-thong-bao');
  const cSource = wRes.chunks.chunks.find((c) => c.slug === '14-2015-tt-btc');
  t('wiki-dist: gắn van_ban_lien_quan đầy đủ (tinh_trang, bi_thay_the_boi, nguon_a)',
    cSai?.van_ban_lien_quan?.[0]?.so_hieu === '14/2015/TT-BTC'
    && cSai.van_ban_lien_quan[0].tinh_trang === 'HET_HIEU_LUC'
    && cSai.van_ban_lien_quan[0].bi_thay_the_boi.includes('85/2026/TT-BTC')
    && cSai.van_ban_lien_quan[0].nguon_a === 'https://congbao.chinhphu.vn/x',
    JSON.stringify(cSai?.van_ban_lien_quan));
  t('wiki-dist: canh_bao_hieu_luc = true khi concept/summary nhắc VB hết không ngữ cảnh lịch sử & chưa nhắc VB thay',
    cSai?.canh_bao_hieu_luc === true && cSai.chunk_id === 'tong-hop#1');
  t('wiki-dist: canh_bao_hieu_luc = false khi có ngữ cảnh lịch sử, trang đã nhắc VB thay, là THONG_BAO, hoặc là sources',
    cLs?.canh_bao_hieu_luc === false
    && cDaCapNhat?.canh_bao_hieu_luc === false
    && cTb?.canh_bao_hieu_luc === false
    && cSource?.canh_bao_hieu_luc === false,
    JSON.stringify({ cLs: cLs?.canh_bao_hieu_luc, cDaCapNhat: cDaCapNhat?.canh_bao_hieu_luc, cTb: cTb?.canh_bao_hieu_luc, cSource: cSource?.canh_bao_hieu_luc }));

  // 4. dieu-khoan-dist + cas-index trên fixture soGia
  t('chuanHoaSlugDocHieu bỏ đúng các đuôi kỹ thuật lặp lại',
    chuanHoaSlugDocHieu('07-2023-tt-nhnn-body-ocr') === '07-2023-tt-nhnn'
    && chuanHoaSlugDocHieu('10-2022-tt-btttt-toanvan-tiep') === '10-2022-tt-btttt');

  const HEAD_CAS = `${COT_CAS.join(',')}\n`;
  const rDk = soGia({
    '85-2026-tt-btc.yaml': `so_hieu: 85/2026/TT-BTC\nloai: THONG_TU\nten: Phân loại HS\nco_quan: BTC\nhieu_luc_tu: "2026-09-15"\ntinh_trang: CON_HIEU_LUC\nnhanh: [phan-loai-hs/quy-trinh-phan-loai]\n${NGUON_A}\nxac_minh:\n  muc: NGUON_A\n  hieu_luc_da_doi_chieu: true\n  ngay: "2026-10-10"\n  dieu_khoan:\n    - dieu: 4\n      khoan: 1\n      noi_dung: "Một mặt hàng có một mã số duy nhất."\n`,
    '07-2023-tt-nhnn.yaml': `so_hieu: 07/2023/TT-NHNN\nloai: THONG_TU\nten: Ngân hàng\nco_quan: NHNN\nhieu_luc_tu: "2023-08-01"\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/thu-tuc]\n${NGUON_A}\n${XM}\n`,
    '24-2026-nd-cp.yaml': `so_hieu: 24/2026/NĐ-CP\nloai: NGHI_DINH\nten: Hóa chất\nco_quan: CP\nhieu_luc_tu: "2026-01-17"\ntinh_trang: CON_HIEU_LUC\nnhanh: [giay-phep]\n${NGUON_A}\n${XM}\n`,
  }, {
    docHieu: {
      '07-2023-tt-nhnn-body-ocr.dieu.jsonl': [
        JSON.stringify({ dieu: 'Điều 1', ten: 'Phạm vi', tom_tat: 'Tóm tắt Đ1', nghia_vu_xnk: ['Nghĩa vụ A', ''], nguon_trich: 'gemma-4-e4b' }),
        '{dòng JSON hỏng không crash',
        JSON.stringify({ dieu: '-', ten: 'Phụ lục gạch', tom_tat: 'Rác 1', nghia_vu_xnk: [] }),
        JSON.stringify({ dieu: 'N/A', ten: 'Không rõ', tom_tat: 'Rác 2', nghia_vu_xnk: [] }),
        JSON.stringify({ dieu: '', ten: 'Trống', tom_tat: 'Rác 3', nghia_vu_xnk: [] }),
        JSON.stringify({ dieu: 'Điều 2', ten: 'Hiệu lực', tom_tat: 'Tóm tắt Đ2', nghia_vu_xnk: [] }),
      ].join('\n') + '\n',
    },
    danhMuc: {
      '24-2026-nd-cp-cas.csv': HEAD_CAS
        + '106-99-0,"1,3-Butadien","1,3-Butadiene",C4H6,Hóa chất cơ bản,I,,1,https://congbao.chinhphu.vn/x,,\n'
        + '106-99-0,"1,3-Butadien","1,3-Butadiene",C4H6,Chất có điều kiện,II,1,97,https://congbao.chinhphu.vn/x,,\n'
        + ',"Diisocyanate",Diisocyanate,,Hóa chất cơ bản,I,,12,https://congbao.chinhphu.vn/x,,\n',
      'hong-cas.csv': 'cas,ten_chat\n106-99-0,Thiếu cột\n',
    },
  });
  const dkRes = dungDieuKhoan(napSo(rDk), rDk, '2026-11-21');
  t('dieu-khoan: tách 2 tầng NGUYEN_VAN_NGUON_A & TOM_TAT_NHAP, bỏ dòng JSON lỗi, gắn da_soat: false',
    dkRes.luoc_do_phien_ban === LUOC_DO_PHIEN_BAN
    && dkRes.canh_bao_tang_nhap.includes('TOM_TAT_NHAP')
    && dkRes.nguyen_van_nguon_a.length === 1
    && dkRes.nguyen_van_nguon_a[0].tang_tin_cay === 'NGUYEN_VAN_NGUON_A'
    && dkRes.nguyen_van_nguon_a[0].so_hieu === '85/2026/TT-BTC'
    && dkRes.tom_tat_nhap.length === 1
    && dkRes.tom_tat_nhap[0].so_hieu === '07/2023/TT-NHNN'
    && dkRes.tom_tat_nhap[0].da_soat === false
    && dkRes.tom_tat_nhap[0].dieu_khoan.length === 2
    && dkRes.tom_tat_nhap[0].dieu_khoan[0].nghia_vu_xnk.length === 1
    && dkRes.tom_tat_nhap[0].dieu_khoan[0].da_soat === false
    && dkRes.thong_ke.so_dong_loi === 1,
    JSON.stringify(dkRes.thong_ke));

  t('dieu-khoan: lọc dòng rác (dieu: "-", "N/A", rỗng) vào so_dong_rac_da_loc, giữ Điều N và NGUYEN_VAN_NGUON_A',
    dkRes.thong_ke.so_dong_rac_da_loc === 3
    && dkRes.tom_tat_nhap[0].dieu_khoan.map((x) => x.dieu).join(',') === 'Điều 1,Điều 2'
    && dkRes.nguyen_van_nguon_a[0].dieu_khoan.length === 1
    && dkRes.nguyen_van_nguon_a[0].dieu_khoan[0].dieu === 4
    && laDieuRac('-') && laDieuRac('N/A') && laDieuRac('') && laDieuRac(null)
    && !laDieuRac('Điều 1') && !laDieuRac('Điều 1a') && !laDieuRac('12'),
    JSON.stringify(dkRes.thong_ke));

  const casRes = dungCasIndex(napSo(rDk), rDk, '2026-11-21');
  t('cas-index: nối 24-2026-nd-cp-cas.csv, gộp nhiều phụ lục theo mã CAS, lọc bảng lỗi và tách khong_co_cas',
    casRes.luoc_do_phien_ban === LUOC_DO_PHIEN_BAN
    && casRes.thong_ke.so_tep === 1
    && casRes.thong_ke.so_tep_loi === 1
    && casRes.theo_cas['106-99-0']?.length === 2
    && casRes.theo_cas['106-99-0'][0].so_hieu === '24/2026/NĐ-CP'
    && casRes.khong_co_cas.length === 1
    && casRes.khong_co_cas[0].ten_chat === 'Diisocyanate',
    JSON.stringify(casRes.thong_ke));

  // 4b. Ánh xạ AHTN cũ → EN2022 (anh_xa_ahtn_cu + kiemAnhXaAhtn)
  const btGia = {
    nguon: 'test', phien_ban: '2026-11-22', tong: 2,
    ma: { '22030091': 'Bia', '30049099': 'Thuốc' },
    la: new Set(['22030091', '30049099']),
  };
  const cmGiaAx = {
    phien_ban: '2026-11-22', luoc_do_phien_ban: '1.5.0', giay_phep: 'CC BY 4.0',
    van_ban: [{
      so_hieu: '50/2026/TT-BCT', slug: '50-2026-tt-bct', ten: 'Danh mục thử', tinh_trang: 'CON_HIEU_LUC',
      hieu_luc_tu: null, het_hieu_luc_tu: null, hieu_luc_da_doi_chieu: true,
      dong: [
        { ma_hs: '22030091', loai_tac_dong: 'KIEM_TRA_ATTP' },
        { ma_hs: '30349099', loai_tac_dong: 'GIAY_PHEP' },
        { ma_hs: '99999999', loai_tac_dong: 'GIAY_PHEP' },
      ],
    }],
  };
  const axGia = {
    thong_tin: { phien_ban_cu: 'AHTN 2017', phien_ban_moi: 'EN2022' },
    phan_loai: {},
    mapping: {
      '30349099': { hs_moi: '30049099', loai: 'loi_danh_may_3034' },
      '11112222': { hs_moi: '22030091', loai: 'don_le' },
      '77778888': { hs_moi: '66665555', loai: 'don_le' },
    },
  };
  const cmMaAx = dungChiMucTheoMa(cmGiaAx, { bt: btGia, anhXaAhtn: axGia });
  t('anh_xa_ahtn_cu: dungChiMucTheoMa gắn đúng mã thuộc canh_bao_ma và loại mã ngoài bảng/ngoài biểu thuế',
    cmMaAx.canh_bao_ma.length === 2
    && cmMaAx.canh_bao_ma.includes('30349099')
    && cmMaAx.canh_bao_ma.includes('99999999')
    && cmMaAx.anh_xa_ahtn_cu?.phien_ban_cu === 'AHTN 2017'
    && cmMaAx.anh_xa_ahtn_cu?.phien_ban_moi === 'EN2022'
    && cmMaAx.anh_xa_ahtn_cu?.tong_duoc_anh_xa === 1
    && cmMaAx.anh_xa_ahtn_cu?.mapping['30349099']?.hs_moi === '30049099'
    && cmMaAx.anh_xa_ahtn_cu?.mapping['30349099']?.loai === 'loi_danh_may_3034'
    && !cmMaAx.anh_xa_ahtn_cu?.mapping['11112222']
    && !cmMaAx.anh_xa_ahtn_cu?.mapping['77778888'],
    JSON.stringify(cmMaAx.anh_xa_ahtn_cu));

  const cmMaAxRong = dungChiMucTheoMa(cmGiaAx, { bt: btGia, anhXaAhtn: { thong_tin: {}, phan_loai: {}, mapping: {} } });
  t('anh_xa_ahtn_cu: không có mã khớp trả tong_duoc_anh_xa = 0 sạch',
    cmMaAxRong.anh_xa_ahtn_cu?.tong_duoc_anh_xa === 0 && Object.keys(cmMaAxRong.anh_xa_ahtn_cu?.mapping || {}).length === 0);

  const loiAxBad = kiemAnhXaAhtn({
    mapping: {
      '123': { hs_moi: '30049099', loai: 'don_le' },
      '30349099': { hs_moi: 'abc', loai: '' },
      '22029999': { hs_moi: '88887777', loai: 'don_le' },
    },
  }, btGia);
  t('kiemAnhXaAhtn âm tính: bắt mã cũ sai, hs_moi sai định dạng/ngoài biểu thuế và thiếu loai',
    loiAxBad.some((m) => /mapping\["123"\] mã cũ không hợp lệ/.test(m))
    && loiAxBad.some((m) => /mapping\["30349099"\] hs_moi "abc" không hợp lệ/.test(m))
    && loiAxBad.some((m) => /mapping\["30349099"\] thiếu loai/.test(m))
    && loiAxBad.some((m) => /mapping\["22029999"\] hs_moi "88887777" không tồn tại trong biểu thuế/.test(m)),
    JSON.stringify(loiAxBad));

  // 4c. Tầng 2 Chính sách theo mô tả + kiemChinhSachMoTa & kiemTra
  const soCsGia = napSo(rDk);
  const quyTacMau = {
    id: 'quy-tac-mau',
    ten: 'Quy tắc mẫu',
    nhom_hang: 'Hàng mẫu',
    tu_khoa_nhan_dien: ['hang mau'],
    loai_tac_dong: 'GIAY_PHEP',
    do_tin: 'VUA_SUY_RA',
    can_cu_so_hieu: ['85/2026/TT-BTC'],
    nghia_vu_tom_tat: 'Nghĩa vụ mẫu',
    luu_y_loai_tru: 'Loại trừ mẫu',
    ranh_gioi_hs_api: 'Chỉ gợi ý theo mô tả.',
  };
  const loiCsNull = kiemChinhSachMoTa(null, soCsGia);
  const loiCsBad = kiemChinhSachMoTa({
    quy_tac: [
      quyTacMau,
      {
        ...quyTacMau,
        id: 'quy-tac-mau',
        ten: '',
        tu_khoa_nhan_dien: [],
        loai_tac_dong: 'PHAN_LOAI_HS_SAI',
        do_tin: 'NGUON_A',
        can_cu_so_hieu: ['999/2099/TT-KHONG-CO'],
      },
      { ...quyTacMau, id: 'ID Sai Dinh Dang' },
    ],
  }, soCsGia);
  t('kiemChinhSachMoTa âm tính: chặn null, trùng id, slug sai, thiếu trường, từ khóa rỗng, loai_tac_dong/do_tin sai, can_cu ngoài sổ',
    loiCsNull.length === 1
    && loiCsBad.some((m) => /trùng id/.test(m))
    && loiCsBad.some((m) => /thiếu ten/.test(m))
    && loiCsBad.some((m) => /tu_khoa_nhan_dien rỗng/.test(m))
    && loiCsBad.some((m) => /loai_tac_dong "PHAN_LOAI_HS_SAI" không hợp lệ/.test(m))
    && loiCsBad.some((m) => /do_tin phải là "VUA_SUY_RA"/.test(m))
    && loiCsBad.some((m) => /999\/2099\/TT-KHONG-CO.*không tồn tại/.test(m))
    && loiCsBad.some((m) => /phải là slug/.test(m)),
    JSON.stringify(loiCsBad));

  const rKiemPhuTroBad = soGia({
    '85-2026-tt-btc.yaml': `so_hieu: 85/2026/TT-BTC\nloai: THONG_TU\nten: Phân loại HS\nco_quan: BTC\nhieu_luc_tu: "2026-09-15"\ntinh_trang: CON_HIEU_LUC\nnhanh: [phan-loai-hs/quy-trinh-phan-loai]\n${NGUON_A}\n${XM}\n`,
  }, {
    extra: {
      'danh-muc/chinh-sach-mo-ta.yaml': 'quy_tac:\n  - id: loi-can-cu\n    ten: Test lỗi\n    nhom_hang: Test\n    tu_khoa_nhan_dien: [test]\n    loai_tac_dong: GIAY_PHEP\n    do_tin: NGUON_A\n    can_cu_so_hieu: [777/2099/TT-MAU]\n    nghia_vu_tom_tat: x\n    luu_y_loai_tru: y\n    ranh_gioi_hs_api: z\n',
      'registry/phien-ban-bieu-thue-mapping.yaml': 'mapping:\n  "30349099":\n    hs_moi: "99999999"\n    loai: ""\n',
      'nhu-cau/bieu-thue.json': JSON.stringify({ nguon: 'test', phien_ban: '2026-11-22', tong: 1, ma: { '22030091': 'Bia' } }),
    },
  });
  const kPhuTroBad = kiemTra(napSo(rKiemPhuTroBad), { root: rKiemPhuTroBad });
  const kMockKhongRoot = kiemTra(soCsGia, {});
  t('kiemTra: kiểm chinh-sach-mo-ta.yaml + mapping AHTN khi truyền root/opts, an toàn với kiemTra(mockSo, {})',
    kPhuTroBad.loi.some((e) => e.file === 'danh-muc/chinh-sach-mo-ta.yaml' && /do_tin/.test(e.msg))
    && kPhuTroBad.loi.some((e) => e.file === 'danh-muc/chinh-sach-mo-ta.yaml' && /777\/2099\/TT-MAU/.test(e.msg))
    && kPhuTroBad.loi.some((e) => e.file === 'registry/phien-ban-bieu-thue-mapping.yaml' && /99999999/.test(e.msg))
    && kPhuTroBad.loi.some((e) => e.file === 'registry/phien-ban-bieu-thue-mapping.yaml' && /thiếu loai/.test(e.msg))
    && kMockKhongRoot.loi.length === 0,
    JSON.stringify({ bad: kPhuTroBad.loi, mock: kMockKhongRoot.loi }));

  // 5. Kiểm dữ liệu thật trong RAM (không ghi ra WORK/dist/)
  const soReal = napSo(ROOT);
  const wReal = dungWikiDist(soReal, ROOT, '2026-11-21');
  const dkReal = dungDieuKhoan(soReal, ROOT, '2026-11-21');
  const casReal = dungCasIndex(soReal, ROOT, '2026-11-21');
  const btReal = docBieuThue(ROOT);
  const axReal = docAnhXaAhtn(ROOT);
  const cmReal = dungChiMuc(soReal, ROOT, '2026-11-22');
  const cmMaReal = dungChiMucTheoMa(cmReal, { bt: btReal, anhXaAhtn: axReal });
  const csDataReal = docChinhSachMoTa(ROOT);
  const csOutReal = dungChinhSachMoTa(soReal, ROOT, '2026-11-22');

  t('kho thật (RAM): wiki-index và wiki-chunks phủ >200 trang / >1500 đoạn, bỏ qua graph/index/log',
    wReal.index.tong >= 200
    && wReal.chunks.tong >= 1500
    && wReal.chunks.chunks.every((c) => /^.+#\d+$/.test(c.chunk_id) && ['summary', 'concepts', 'sources'].includes(c.loai_trang))
    && wReal.chunks.chunks.filter((c) => c.loai_trang === 'sources').every((c) => c.canh_bao_hieu_luc === false)
    && wReal.chunks.chunks.some((c) => c.slug === '85-2026-tt-btc' && c.muc.includes(' > ')),
    JSON.stringify({ trang: wReal.index.tong, chunks: wReal.chunks.tong }));

  t('kho thật (RAM): dieu-khoan có NGUYEN_VAN_NGUON_A (85/2026, 19/2026) + TOM_TAT_NHAP ≥ 80 VB, đã dọn dòng rác (≥ 0), 0 dòng lỗi',
    dkReal.nguyen_van_nguon_a.some((x) => x.so_hieu === '85/2026/TT-BTC')
    && dkReal.nguyen_van_nguon_a.some((x) => x.so_hieu === '19/2026/QH16')
    && dkReal.tom_tat_nhap.length >= 80
    && dkReal.thong_ke.so_dong_loi === 0
    && dkReal.thong_ke.so_dong_rac_da_loc >= 0
    && !dkReal.tom_tat_nhap.some((vb) => vb.dieu_khoan.some((dk) => laDieuRac(dk.dieu)))
    && dkReal.tom_tat_nhap.some((x) => x.so_hieu === '1725/QĐ-BCT')
    && dkReal.tom_tat_nhap.every((x) => x.da_soat === false && x.tang_tin_cay === 'TOM_TAT_NHAP'),
    JSON.stringify(dkReal.thong_ke));

  t('kho thật (RAM): cas-index phủ 24/2026/NĐ-CP (>1200 mã CAS, đa phụ lục cho 106-99-0, ≥10 dòng không CAS)',
    casReal.thong_ke.so_tep >= 1
    && casReal.thong_ke.so_tep_loi === 0
    && casReal.thong_ke.so_ma_cas_duy_nhat >= 1200
    && casReal.theo_cas['106-99-0']?.length >= 2
    && casReal.khong_co_cas.length >= 10,
    JSON.stringify(casReal.thong_ke));

  t('kho thật (RAM): phien-ban-bieu-thue-mapping.yaml (≥ 114 mã, 0 lỗi) + anh_xa_ahtn_cu nối vào hs-index-theo-ma',
    Object.keys(axReal?.mapping || {}).length >= 114
    && kiemAnhXaAhtn(axReal, btReal).length === 0
    && cmMaReal.anh_xa_ahtn_cu?.tong_duoc_anh_xa >= 100
    && Object.values(cmMaReal.anh_xa_ahtn_cu?.mapping || {}).every((v) => demLa(btReal, v.hs_moi) > 0),
    JSON.stringify({ tong_mapping: Object.keys(axReal?.mapping || {}).length, anh_xa: cmMaReal.anh_xa_ahtn_cu?.tong_duoc_anh_xa }));

  t('kho thật (RAM): chinh-sach-mo-ta (14 quy tắc, 25 viết tắt, đủ can_cu_chi_tiet, 0 lỗi kiểm)',
    kiemChinhSachMoTa(csDataReal, soReal).length === 0
    && csOutReal.luoc_do_phien_ban === LUOC_DO_PHIEN_BAN
    && csOutReal.tong_quy_tac === 14
    && csOutReal.quy_tac.length === 14
    && Object.keys(TU_DIEN_VIET_TAT_PLHQ).length === 25
    && Object.keys(csOutReal.tu_dien_viet_tat || {}).length === 25
    && csOutReal.canh_bao_tang_2.includes('VUA_SUY_RA')
    && csOutReal.quy_tac.every((r) => r.do_tin === 'VUA_SUY_RA'
      && r.can_cu_chi_tiet.length === r.can_cu_so_hieu.length
      && r.can_cu_chi_tiet.every((c) => Boolean(c.slug) && Boolean(c.tinh_trang))),
    JSON.stringify({ quy_tac: csOutReal.tong_quy_tac, viet_tat: Object.keys(csOutReal.tu_dien_viet_tat || {}).length }));

  // 6. Chạy CLI tools/dung.mjs ra tmpdir() + kiểm ranh giới không tạo chu-giai-hs.json / chu-giai-chuong.json
  const tmpOut = makeTmp('kb-dung-out-');
  const dungStdout = execFileSync('node', [join(ROOT, 'tools', 'dung.mjs'), '--out', tmpOut], { cwd: ROOT, encoding: 'utf8' });
  const expectedFiles = [
    'registry.json',
    'hs-index.json',
    'hs-index-theo-ma.json',
    'wiki-index.json',
    'wiki-chunks.json',
    'dieu-khoan.json',
    'cas-index.json',
    'chinh-sach-mo-ta.json',
    'xuat-xu-fta.json',
    'manifest.json',
  ];
  const allPresent = expectedFiles.every((f) => existsSync(join(tmpOut, 'dist', f)));
  const allSchemaOk = allPresent && expectedFiles.every((f) => {
    const obj = JSON.parse(readFileSync(join(tmpOut, 'dist', f), 'utf8'));
    return obj.luoc_do_phien_ban === LUOC_DO_PHIEN_BAN;
  });
  const manifestOut = allPresent ? JSON.parse(readFileSync(join(tmpOut, 'dist', 'manifest.json'), 'utf8')) : null;
  const hsTheoMaOut = allPresent ? JSON.parse(readFileSync(join(tmpOut, 'dist', 'hs-index-theo-ma.json'), 'utf8')) : null;
  const csOutFile = allPresent ? JSON.parse(readFileSync(join(tmpOut, 'dist', 'chinh-sach-mo-ta.json'), 'utf8')) : null;
  const dkOutFile = allPresent ? JSON.parse(readFileSync(join(tmpOut, 'dist', 'dieu-khoan.json'), 'utf8')) : null;
  const noBoundaryLeak = !existsSync(join(tmpOut, 'dist', 'chu-giai-hs.json'))
    && !existsSync(join(tmpOut, 'dist', 'chu-giai-chuong.json'));
  t(`CLI tools/dung.mjs --out tmpdir: xuất đủ 10 tệp dist/*.json (luoc_do_phien_ban = ${LUOC_DO_PHIEN_BAN}), không sinh chu-giai-hs/chuong`,
    allPresent && allSchemaOk && noBoundaryLeak && dungJson(napSo(rWiki)).luoc_do_phien_ban === LUOC_DO_PHIEN_BAN
    && dungStdout.includes('dist/chinh-sach-mo-ta.json')
    && dungStdout.includes('dist/xuat-xu-fta.json')
    && dungStdout.includes('dist/manifest.json')
    && manifestOut?.luoc_do_phien_ban === LUOC_DO_PHIEN_BAN
    && manifestOut?.tong_tep === 9
    && hsTheoMaOut?.anh_xa_ahtn_cu?.tong_duoc_anh_xa >= 100
    && csOutFile?.tong_quy_tac === 14
    && Object.keys(csOutFile?.tu_dien_viet_tat || {}).length === 25
    && dkOutFile?.thong_ke?.so_dong_rac_da_loc >= 0,
    JSON.stringify({ allPresent, allSchemaOk, noBoundaryLeak, anhXa: hsTheoMaOut?.anh_xa_ahtn_cu?.tong_duoc_anh_xa, cs: csOutFile?.tong_quy_tac, rac: dkOutFile?.thong_ke?.so_dong_rac_da_loc }));
} finally {
  for (const d of tmpDirs) {
    try { rmSync(d, { recursive: true, force: true }); } catch {}
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
