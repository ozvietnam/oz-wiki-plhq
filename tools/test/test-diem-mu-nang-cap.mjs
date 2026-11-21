// Test nâng cấp diem-mu.mjs: tách tầng TB-TCHQ (D2/D3/D14), D16 WIKI_DAN_VB_HET_HIEU_LUC, D17 WIKI_CHUA_CO_VB_NEN_TANG.
import { mkdtempSync, mkdirSync, writeFileSync, cpSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { napSo, ROOT } from '../lib/registry.mjs';
import { timDiemMu, veMarkdown, laTbTchq } from '../diem-mu.mjs';

let pass = 0;
let fail = 0;
const t = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`PASS ${name}`); }
  else { fail += 1; console.log(`FAIL ${name} ${extra}`); }
};

function soGia(vanBan, { wiki = {} } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'kb-dm-'));
  mkdirSync(join(root, 'registry', 'van-ban'), { recursive: true });
  for (const f of ['cay-xnk.yaml', 'co-quan.yaml', 'nguon-uy-tin.yaml']) {
    cpSync(join(ROOT, 'registry', f), join(root, 'registry', f));
  }
  for (const [file, body] of Object.entries(vanBan)) {
    writeFileSync(join(root, 'registry', 'van-ban', file), body);
  }
  for (const [relPath, body] of Object.entries(wiki)) {
    const fp = join(root, 'wiki', relPath);
    mkdirSync(join(fp, '..'), { recursive: true });
    writeFileSync(fp, body);
  }
  return root;
}

const XM_CHUA = 'xac_minh: {muc: CHUA_XAC_MINH, hieu_luc_da_doi_chieu: false, ngay: "2026-10-01"}';
const XM_A = 'nguon: [{url: "https://customs.gov.vn/tb-1", truy_cap: "2026-10-01"}]\nxac_minh: {muc: NGUON_A, hieu_luc_da_doi_chieu: true, ngay: "2026-10-01"}';

// 1. Helper laTbTchq + Tách tầng D2 / D3 / D14
const rTang = soGia({
  '503-tb-tchq-2018.yaml': `so_hieu: 503/TB-TCHQ/2018\nloai: THONG_BAO\nten: Thông báo KQPL mẫu 1\nco_quan: TCHQ\ntinh_trang: CON_HIEU_LUC\ntrich_dan_trong_bieu_thue: 150\nnhanh: [phan-loai-hs/thong-bao-phan-loai]\n${XM_CHUA}\n`,
  '07-tb-chq-2026.yaml': `so_hieu: 07/TB-CHQ/2026\nloai: THONG_BAO\nten: Thông báo KQPL Cục Hải quan\nco_quan: CHQ\ntinh_trang: CON_HIEU_LUC\nnhanh: [phan-loai-hs/thong-bao-phan-loai]\n${XM_CHUA}\n`,
  '999-tb-tchq-2024.yaml': `so_hieu: 999/TB-TCHQ/2024\nloai: THONG_BAO\nten: TB đã có nguồn A và đối chiếu\nco_quan: TCHQ\ntinh_trang: CON_HIEU_LUC\nnhanh: [phan-loai-hs/thong-bao-phan-loai]\n${XM_A}\n`,
  '12-tb-bct.yaml': `so_hieu: 12/TB-BCT\nloai: THONG_BAO\nten: Thông báo BCT không phải TB-TCHQ\nco_quan: BCT\ntinh_trang: CON_HIEU_LUC\ntrich_dan_trong_bieu_thue: 120\nnhanh: [quan-ly-ngoai-thuong/giay-phep]\n${XM_CHUA}\n`,
  '1921-qd-tchq-2018.yaml': `so_hieu: 1921/QĐ-TCHQ\nloai: QUYET_DINH\nten: Quy trình phân loại cũ của TCHQ\nco_quan: TCHQ\ntinh_trang: CON_HIEU_LUC\ntrich_dan_trong_bieu_thue: 120\nnhanh: [phan-loai-hs/quy-trinh-phan-loai]\n${XM_CHUA}\n`,
});

try {
  t('helper laTbTchq: nhận đúng TB-TCHQ và TB-CHQ (THONG_BAO), loại trừ TB-BCT và QĐ-TCHQ',
    laTbTchq({ loai: 'THONG_BAO', so_hieu: '503/TB-TCHQ/2018' })
    && laTbTchq({ loai: 'THONG_BAO', so_hieu: '07/TB-CHQ/2026' })
    && !laTbTchq({ loai: 'THONG_BAO', so_hieu: '12/TB-BCT' })
    && !laTbTchq({ loai: 'QUYET_DINH', so_hieu: '1921/QĐ-TCHQ' })
    && !laTbTchq({ loai: 'CONG_VAN', so_hieu: '123/TB-TCHQ' }));

  const dmTang = timDiemMu(napSo(rTang), { today: '2026-11-21', root: rTang });
  const findM = (ma, mt) => dmTang.find((d) => d.ma === ma && d.muc_tieu === mt);

  t('D2 tách tầng: TB-TCHQ chưa nguồn A → TB_TCHQ_KHONG_NGUON_A (Thấp, tb-tchq), không phát KHONG_NGUON_A',
    findM('TB_TCHQ_KHONG_NGUON_A', '503/TB-TCHQ/2018')?.muc === 'Thấp'
    && findM('TB_TCHQ_KHONG_NGUON_A', '503/TB-TCHQ/2018')?.luong === 'tb-tchq'
    && !findM('KHONG_NGUON_A', '503/TB-TCHQ/2018'));

  t('D2 tách tầng: TB-CHQ chưa nguồn A → TB_TCHQ_KHONG_NGUON_A (Thấp, tb-tchq)',
    findM('TB_TCHQ_KHONG_NGUON_A', '07/TB-CHQ/2026')?.muc === 'Thấp'
    && findM('TB_TCHQ_KHONG_NGUON_A', '07/TB-CHQ/2026')?.luong === 'tb-tchq');

  t('D3 tách tầng: TB-TCHQ/TB-CHQ chưa đối chiếu → TB_TCHQ_CHUA_DOI_CHIEU (Thấp, tb-tchq), không phát HIEU_LUC_CHUA_DOI_CHIEU',
    findM('TB_TCHQ_CHUA_DOI_CHIEU', '503/TB-TCHQ/2018')?.muc === 'Thấp'
    && findM('TB_TCHQ_CHUA_DOI_CHIEU', '503/TB-TCHQ/2018')?.luong === 'tb-tchq'
    && !findM('HIEU_LUC_CHUA_DOI_CHIEU', '503/TB-TCHQ/2018')
    && findM('TB_TCHQ_CHUA_DOI_CHIEU', '07/TB-CHQ/2026')?.luong === 'tb-tchq');

  t('D2/D3 tách tầng: TB-TCHQ đã có nguồn A + hieu_luc_da_doi_chieu: true → không phát TB_TCHQ_*',
    !findM('TB_TCHQ_KHONG_NGUON_A', '999/TB-TCHQ/2024')
    && !findM('TB_TCHQ_CHUA_DOI_CHIEU', '999/TB-TCHQ/2024'));

  t('D14 tách tầng: TB-TCHQ của TCHQ (đã sáp nhập vào CHQ) → bỏ qua CO_QUAN_DA_SAP_NHAP',
    !findM('CO_QUAN_DA_SAP_NHAP', '503/TB-TCHQ/2018')
    && !findM('CO_QUAN_DA_SAP_NHAP', '999/TB-TCHQ/2024'));

  t('VBQPPL giữ nguyên: THONG_BAO khác (12/TB-BCT) và QĐ-TCHQ (1921/QĐ-TCHQ) vẫn phát KHONG_NGUON_A, HIEU_LUC_CHUA_DOI_CHIEU, CO_QUAN_DA_SAP_NHAP',
    findM('KHONG_NGUON_A', '12/TB-BCT')?.muc === 'Vừa'
    && findM('HIEU_LUC_CHUA_DOI_CHIEU', '12/TB-BCT')?.muc === 'Vừa'
    && findM('KHONG_NGUON_A', '1921/QĐ-TCHQ')?.luong === 'truy-vet-nguon'
    && findM('HIEU_LUC_CHUA_DOI_CHIEU', '1921/QĐ-TCHQ')?.luong === 'hieu-luc'
    && Boolean(findM('CO_QUAN_DA_SAP_NHAP', '1921/QĐ-TCHQ')));
} finally {
  rmSync(rTang, { recursive: true, force: true });
}

// 2. D16 — WIKI_DAN_VB_HET_HIEU_LUC
const rD16 = soGia({
  '14-2015-tt-btc.yaml': `so_hieu: 14/2015/TT-BTC\nloai: THONG_TU\nten: Phân loại hàng hóa cũ\nco_quan: BTC\ntinh_trang: HET_HIEU_LUC\nhet_hieu_luc_tu: "2026-09-15"\nnhanh: [phan-loai-hs/quy-trinh-phan-loai]\n${XM_CHUA}\n`,
  '85-2026-tt-btc.yaml': `so_hieu: 85/2026/TT-BTC\nloai: THONG_TU\nten: Phân loại hàng hóa mới\nco_quan: BTC\ntinh_trang: CON_HIEU_LUC\nhieu_luc_tu: "2026-09-15"\nnhanh: [phan-loai-hs/quy-trinh-phan-loai]\nquan_he:\n  thay_the:\n    - 14/2015/TT-BTC\n${XM_CHUA}\n`,
  '43-2017-nd-cp.yaml': `so_hieu: 43/2017/NĐ-CP\nloai: NGHI_DINH\nten: Nhãn hàng hóa cũ\nco_quan: CP\ntinh_trang: HET_HIEU_LUC\nhet_hieu_luc_tu: "2026-01-23"\nnhanh: [kiem-tra-chuyen-nganh/nhan-hang-hoa]\n${XM_CHUA}\n`,
  '37-2026-nd-cp.yaml': `so_hieu: 37/2026/NĐ-CP\nloai: NGHI_DINH\nten: Khung KTCN mới\nco_quan: CP\ntinh_trang: CON_HIEU_LUC\nhieu_luc_tu: "2026-07-01"\nnhanh: [kiem-tra-chuyen-nganh/khung-chat-luong]\nquan_he:\n  bai_bo:\n    - 43/2017/NĐ-CP\n${XM_CHUA}\n`,
  '21-2017-tt-bnnptnt.yaml': `so_hieu: 21/2017/TT-BNNPTNT\nloai: THONG_TU\nten: Văn bản hết hiệu lực chưa ghi văn bản thay\nco_quan: BNNPTNT\ntinh_trang: HET_HIEU_LUC\nhet_hieu_luc_tu: "2021-01-01"\nnhanh: [kiem-tra-chuyen-nganh/bnnmt]\n${XM_CHUA}\n`,
  '100-tb-tchq-2018.yaml': `so_hieu: 100/TB-TCHQ/2018\nloai: THONG_BAO\nten: TB hết hiệu lực\nco_quan: TCHQ\ntinh_trang: HET_HIEU_LUC\nnhanh: [phan-loai-hs/thong-bao-phan-loai]\n${XM_CHUA}\n`,
}, {
  wiki: {
    // Dương tính trong summary + kiểm tra dedupe nhiều dòng + bỏ qua frontmatter
    'summary/sum-hit.md': [
      '---',
      'id: sum-hit',
      'title: "Tổng hợp (chỉ có 85/2026/TT-BTC trong frontmatter — không tính vào body)"',
      '---',
      '',
      '## Quy định',
      '- Phân loại theo 14/2015/TT-BTC khi mở tờ khai.',
      '- Dòng lặp 14/2015/TT-BTC để kiểm dedupe.',
      '- Nhãn theo 43/2017/NĐ-CP.',
      '- Quy định thêm tại 21/2017/TT-BNNPTNT.',
    ].join('\n'),
    // Dương tính trong concepts: dòng 1 có ngữ cảnh lịch sử, dòng 2 dẫn trực tiếp không ngữ cảnh → vẫn phải báo
    'concepts/con-hit.md': [
      '---',
      'id: con-hit',
      '---',
      '',
      '- Trước đây dùng 14/2015/TT-BTC.',
      '- Nay vẫn ghi nhầm áp dụng 14/2015/TT-BTC.',
    ].join('\n'),
    // Âm tính 1: đã nêu văn bản thay thế (bi_thay_the_boi) trên cùng trang
    'summary/sum-co-thay.md': '---\nid: sum-co-thay\n---\n\nÁp dụng 85/2026/TT-BTC (trước là 14/2015/TT-BTC).\n',
    // Âm tính 2: đã nêu văn bản bãi bỏ (bi_bai_bo_boi) trên cùng trang
    'concepts/con-co-bai.md': '---\nid: con-co-bai\n---\n\nXem 43/2017/NĐ-CP và 37/2026/NĐ-CP.\n',
    // Âm tính 3: cùng dòng có từ khóa ngữ cảnh lịch sử/hết hiệu lực
    'concepts/con-lich-su.md': [
      '---',
      'id: con-lich-su',
      '---',
      '',
      '- Văn bản 14/2015/TT-BTC đã hết hiệu lực.',
      '- Văn bản 43/2017/NĐ-CP bị bãi bỏ từ 2026.',
      '- Văn bản 21/2017/TT-BNNPTNT không còn áp dụng.',
    ].join('\n'),
    // Âm tính 4: chỉ nhắc trong YAML frontmatter, body không nhắc
    'summary/sum-frontmatter-only.md': '---\nid: fm-only\ncovers: [14/2015/TT-BTC]\n---\n\nTrang không nhắc văn bản nào.\n',
    // Âm tính 5: nằm ngoài summary/concepts (sources, readings, index.md, log.md)
    'sources/14-2015-tt-btc.md': '---\nid: s14\n---\n\nNguồn gốc 14/2015/TT-BTC.\n',
    'readings/note.md': '---\nid: r1\n---\n\nGhi chú đọc 14/2015/TT-BTC.\n',
    'index.md': '# Index\n- 14/2015/TT-BTC\n',
    'log.md': '# Log\n- 2026-10-01: 14/2015/TT-BTC\n',
  },
});

try {
  const dmD16 = timDiemMu(napSo(rD16), { today: '2026-11-21', root: rD16 })
    .filter((d) => d.ma === 'WIKI_DAN_VB_HET_HIEU_LUC');

  const hitSum14 = dmD16.filter((d) => /wiki\/summary\/sum-hit\.md/.test(d.tieuDe) && d.muc_tieu === '14/2015/TT-BTC');
  const hitSum43 = dmD16.filter((d) => /wiki\/summary\/sum-hit\.md/.test(d.tieuDe) && d.muc_tieu === '43/2017/NĐ-CP');
  const hitSum21 = dmD16.filter((d) => /wiki\/summary\/sum-hit\.md/.test(d.tieuDe) && d.muc_tieu === '21/2017/TT-BNNPTNT');
  const hitCon14 = dmD16.filter((d) => /wiki\/concepts\/con-hit\.md/.test(d.tieuDe) && d.muc_tieu === '14/2015/TT-BTC');

  t('D16 dương tính + dedupe: summary/sum-hit.md phát đúng 1 lần cho 14/2015/TT-BTC (Vừa, doc-hieu) kèm 85/2026/TT-BTC',
    hitSum14.length === 1 && hitSum14[0].muc === 'Vừa' && hitSum14[0].luong === 'doc-hieu'
    && /85\/2026\/TT-BTC/.test(hitSum14[0].tieuDe + hitSum14[0].viec),
    JSON.stringify(hitSum14));

  t('D16 dương tính: summary/sum-hit.md phát 43/2017/NĐ-CP (kèm 37/2026/NĐ-CP) và 21/2017/TT-BNNPTNT (không VB thay)',
    hitSum43.length === 1 && /37\/2026\/NĐ-CP/.test(hitSum43[0].tieuDe + hitSum43[0].viec)
    && hitSum21.length === 1,
    JSON.stringify({ hitSum43, hitSum21 }));

  t('D16 dương tính trong concepts: dòng 1 có "Trước đây" bỏ qua, dòng 2 không ngữ cảnh vẫn phát',
    hitCon14.length === 1 && /dòng 2/i.test(hitCon14[0].viec),
    JSON.stringify(hitCon14));

  t('D16 âm tính: bỏ qua khi trang đã có văn bản thay/bãi, ngữ cảnh lịch sử, chỉ trong frontmatter, hoặc ngoài summary/concepts',
    dmD16.length === 4
    && !dmD16.some((d) => /sum-co-thay|con-co-bai|con-lich-su|sum-frontmatter-only|sources\/|readings\/|index\.md|log\.md/.test(d.tieuDe + d.viec)),
    JSON.stringify(dmD16));
} finally {
  rmSync(rD16, { recursive: true, force: true });
}

// 3. D17 — WIKI_CHUA_CO_VB_NEN_TANG
const rD17 = soGia({
  '54-2014-qh13.yaml': `so_hieu: 54/2014/QH13\nloai: LUAT\nten: Luật Hải quan\nco_quan: QH\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/luat-khung]\ntoan_van: raw/54.pdf\n${XM_A}\n`,
  '08-2015-nd-cp.yaml': `so_hieu: 08/2015/NĐ-CP\nloai: NGHI_DINH\nten: Nghị định đã có wiki/sources\nco_quan: CP\ntinh_trang: CON_HIEU_LUC\nnhanh: [hai-quan/luat-khung]\ntoan_van: raw/08.pdf\n${XM_A}\n`,
  '128-2020-nd-cp.yaml': `so_hieu: 128/2020/NĐ-CP\nloai: NGHI_DINH\nten: Xử phạt hành chính hải quan\nco_quan: CP\ntinh_trang: CON_HIEU_LUC\nnhanh: [xu-phat]\ntoan_van: raw/128.pdf\n${XM_A}\n`,
  '38-2015-tt-btc.yaml': `so_hieu: 38/2015/TT-BTC\nloai: THONG_TU\nten: Thông tư dẫn >=100 mã HS\nco_quan: BTC\ntinh_trang: CON_HIEU_LUC\ntrich_dan_trong_bieu_thue: 100\nnhanh: [hai-quan/thu-tuc]\ntoan_van: raw/38.pdf\n${XM_A}\n`,
  '39-2018-tt-btc.yaml': `so_hieu: 39/2018/TT-BTC\nloai: THONG_TU\nten: Thông tư dẫn 99 mã HS (dưới ngưỡng)\nco_quan: BTC\ntinh_trang: CON_HIEU_LUC\ntrich_dan_trong_bieu_thue: 99\nnhanh: [hai-quan/thu-tuc]\ntoan_van: raw/39.pdf\n${XM_A}\n`,
  '10-2020-nd-cp.yaml': `so_hieu: 10/2020/NĐ-CP\nloai: NGHI_DINH\nten: Nghị định thuộc nhánh không cốt lõi\nco_quan: CP\ntinh_trang: CON_HIEU_LUC\nnhanh: [bo-may]\ntoan_van: raw/10.pdf\n${XM_A}\n`,
  '11-2020-nd-cp.yaml': `so_hieu: 11/2020/NĐ-CP\nloai: NGHI_DINH\nten: Nghị định chưa có toàn văn\nco_quan: CP\ntinh_trang: CON_HIEU_LUC\nnhanh: [thue/luat-thue]\n${XM_A}\n`,
  '12-2016-nd-cp.yaml': `so_hieu: 12/2016/NĐ-CP\nloai: NGHI_DINH\nten: Nghị định đã hết hiệu lực\nco_quan: CP\ntinh_trang: HET_HIEU_LUC\nnhanh: [thue/luat-thue]\ntoan_van: raw/12.pdf\n${XM_A}\n`,
}, {
  wiki: {
    'sources/08-2015-nd-cp.md': '---\nid: 08-2015-nd-cp\n---\n\nĐã có trang nguồn.\n',
  },
});

try {
  const dmD17 = timDiemMu(napSo(rD17), { today: '2026-11-21', root: rD17 })
    .filter((d) => d.ma === 'WIKI_CHUA_CO_VB_NEN_TANG');

  t('D17 dương tính: phát cho LUAT/NGHI_DINH nhánh cốt lõi (54/2014/QH13, 128/2020/NĐ-CP) và THONG_TU >= 100 mã HS (38/2015/TT-BTC)',
    dmD17.some((d) => d.muc_tieu === '54/2014/QH13' && d.muc === 'Vừa' && d.luong === 'doc-hieu')
    && dmD17.some((d) => d.muc_tieu === '128/2020/NĐ-CP')
    && dmD17.some((d) => d.muc_tieu === '38/2015/TT-BTC'),
    JSON.stringify(dmD17));

  t('D17 âm tính: bỏ qua khi đã có wiki/sources, thiếu toan_van, hết hiệu lực, <100 mã HS (TT), hoặc nhánh không cốt lõi',
    dmD17.length === 3
    && !dmD17.some((d) => ['08/2015/NĐ-CP', '39/2018/TT-BTC', '10/2020/NĐ-CP', '11/2020/NĐ-CP', '12/2016/NĐ-CP'].includes(d.muc_tieu)),
    JSON.stringify(dmD17));
} finally {
  rmSync(rD17, { recursive: true, force: true });
}

// 4. Chạy timDiemMu(napSo()) trên kho thật (chỉ trong RAM, không ghi dist/ hay bao-cao/)
const soThat = napSo();
const dmThat = timDiemMu(soThat);
const mdThat = veMarkdown(dmThat);

const demTheoMa = new Map();
for (const d of dmThat) {
  const cur = demTheoMa.get(d.ma) || { ma: d.ma, muc: d.muc, luong: d.luong, n: 0 };
  cur.n += 1;
  demTheoMa.set(d.ma, cur);
}

const tbSet = new Set(soThat.vanBan.filter(laTbTchq).map((d) => d.so_hieu));
t('kho thật: CO_QUAN_DA_SAP_NHAP, KHONG_NGUON_A, HIEU_LUC_CHUA_DOI_CHIEU không còn lẫn TB-TCHQ',
  !dmThat.some((d) => ['CO_QUAN_DA_SAP_NHAP', 'KHONG_NGUON_A', 'HIEU_LUC_CHUA_DOI_CHIEU'].includes(d.ma) && tbSet.has(d.muc_tieu)));

t('kho thật: TEN_MA dịch đủ 4 mã mới sang tiếng Việt trong veMarkdown()',
  ['TB_TCHQ_KHONG_NGUON_A', 'TB_TCHQ_CHUA_DOI_CHIEU', 'WIKI_DAN_VB_HET_HIEU_LUC', 'WIKI_CHUA_CO_VB_NEN_TANG']
    .every((ma) => !mdThat.includes(`| ${ma} |`)));

console.log('\n--- Tóm tắt điểm mù trên kho thật ---');
for (const r of [...demTheoMa.values()].sort((a, b) => b.n - a.n)) {
  console.log(`  ${r.ma.padEnd(32)} | ${r.muc.padEnd(4)} | ${String(r.n).padStart(5)} | ${r.luong}`);
}
const d16That = dmThat.filter((d) => d.ma === 'WIKI_DAN_VB_HET_HIEU_LUC');
console.log(`\n--- Chi tiết WIKI_DAN_VB_HET_HIEU_LUC trên kho thật (${d16That.length}) ---`);
for (const d of d16That) {
  console.log(`  - ${d.tieuDe}`);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
