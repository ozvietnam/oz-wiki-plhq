#!/usr/bin/env node
// Đánh giá chất lượng truy hồi sống của `hoiPhapLuat`:
// - Bộ câu hỏi nghiệp vụ (`--eval <path>`, mặc định `eval/cau-hoi-nghiep-vu.yaml`)
// - Bộ câu khó thực tế (viết tắt, hỏi đích danh số hiệu chưa có toàn văn)
// - Bộ câu ngoài kho (bắt buộc bật `do_tin_cay_tra_loi === 'KHONG_TIM_THAY'` và `goi_y_du_phong`)
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import yaml from 'js-yaml';
import { ROOT } from './lib/registry.mjs';
import { taoKhoTraCuu, hoiPhapLuat } from './lib/tra-cuu-plhq.mjs';

function parseArgs(argv) {
  const out = { evalPath: resolve(ROOT, 'eval', 'cau-hoi-nghiep-vu.yaml'), distDir: null, strict: true };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--eval' && argv[i + 1]) out.evalPath = resolve(argv[++i]);
    else if (argv[i] === '--dist' && argv[i + 1]) out.distDir = resolve(argv[++i]);
    else if (argv[i] === '--no-strict') out.strict = false;
  }
  return out;
}

const normSh = (s) => String(s || '').toUpperCase().replace(/\s+/g, '').replace(/Đ/g, 'D');

function extractWikiSoHieu(item) {
  const set = new Set();
  for (const sh of item.van_ban_lien_quan || []) {
    set.add(normSh(typeof sh === 'string' ? sh : sh.so_hieu));
  }
  const blob = `${item.tieu_de || ''} ${item.noi_dung || ''}`;
  for (const m of blob.match(/\d+\/\d{4}\/[A-ZĐ0-9-]+/gi) || []) {
    set.add(normSh(m));
  }
  return set;
}

const PINNED_QUERIES = [
  { cau_hoi: 'Luật Quản lý ngoại thương 05/2017/QH14 quy định biện pháp cấm xuất nhập khẩu ở điều nào?', so_hieu: '05/2017/QH14' },
  { cau_hoi: 'Biểu thuế ưu đãi đặc biệt EVFTA 116/2022/NĐ-CP', so_hieu: '116/2022/NĐ-CP' },
  { cau_hoi: 'Nhập khẩu động vật hoang dã CITES theo 06/2019/NĐ-CP cần giấy phép gì?', so_hieu: '06/2019/NĐ-CP' },
  { cau_hoi: 'Nhập khẩu thiết bị y tế loại C D cần lưu hành gì theo 98/2021/NĐ-CP?', so_hieu: '98/2021/NĐ-CP' },
  { cau_hoi: 'Quy định kiểm dịch thực vật nhập khẩu theo 15/2018/TT-BNNPTNT hoặc 33/2014/TT-BNNPTNT?', so_hieu: '33/2014/TT-BNNPTNT' },
];

const ABBR_QUERIES = [
  { cau_hoi: 'Khai sai mã HS bị phạt VPHC bao nhiêu tiền?', ky_vong: ['169/2026/NĐ-CP', '102/2021/NĐ-CP'] },
  { cau_hoi: 'Thủ tục TNTX kinh doanh tạm nhập tái xuất thực hiện theo nghị định nào?', ky_vong: ['292/2026/NĐ-CP', '48/2026/TT-BCT', '08/2023/TT-BCT'] },
  { cau_hoi: 'Thuế GTGT 8% bao giờ hết hạn?', ky_vong: ['174/2025/NĐ-CP', '204/2025/QH15'] },
  { cau_hoi: 'KTCN hàng rủi ro trung bình có phải kiểm tra khi nhập khẩu không?', ky_vong: ['37/2026/NĐ-CP', '49/2026/TT-BXD', '36/2026/TT-BKHCN'] },
  { cau_hoi: 'Bánh quy nhập khẩu kiểm tra ATTP theo văn bản nào?', ky_vong: ['15/2018/NĐ-CP', '28/2026/TT-BCT'] },
];

const OUT_OF_SCOPE_QUERIES = [
  'Thông tư 999/2099/TT-XYZ quy định về thuế vũ trụ',
  'Thủ tục nhập khẩu đũa thần phép thuật sao Hỏa',
];

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const store = await taoKhoTraCuu(args.distDir ? { distDir: args.distDir } : { root: ROOT });

  if (!existsSync(args.evalPath)) {
    console.error(`Không tìm thấy tệp eval: ${args.evalPath}`);
    process.exit(2);
  }

  const evalDoc = yaml.load(readFileSync(args.evalPath, 'utf8'));
  const questions = Array.isArray(evalDoc?.cau_hoi) ? evalDoc.cau_hoi : Array.isArray(evalDoc) ? evalDoc : [];

  let withExpected = 0;
  let hitAny = 0;
  let hitAll = 0;
  let hitTop3 = 0;
  let hitTop1 = 0;
  let expiredTop1 = 0;
  const misses = [];
  const expTop1List = [];

  for (const q of questions) {
    const expList = Array.isArray(q.van_ban_bat_buoc) ? q.van_ban_bat_buoc : [];
    const r = hoiPhapLuat(store, q.cau_hoi, { limit: 5 });
    const vbs = r.van_ban_lien_quan || [];
    if (vbs[0]?.tinh_trang === 'HET_HIEU_LUC') {
      expiredTop1 += 1;
      expTop1List.push({ id: q.id, top1: vbs[0].so_hieu });
    }
    if (expList.length === 0) continue;
    withExpected += 1;
    const expected = new Set(expList.map(normSh));
    const kq = r.ket_qua || [];
    const dkA = r.dieu_khoan_nguon_a || [];

    const foundAll = new Set([
      ...kq.flatMap((it) => [...extractWikiSoHieu(it)]),
      ...dkA.map((x) => normSh(x.so_hieu)),
      ...vbs.map((x) => normSh(x.so_hieu)),
    ]);
    const top1 = new Set([
      ...vbs.slice(0, 1).map((x) => normSh(x.so_hieu)),
      ...dkA.slice(0, 1).map((x) => normSh(x.so_hieu)),
      ...(kq[0] ? [...extractWikiSoHieu(kq[0])] : []),
    ]);
    const top3 = new Set([
      ...vbs.slice(0, 3).map((x) => normSh(x.so_hieu)),
      ...dkA.slice(0, 3).map((x) => normSh(x.so_hieu)),
      ...kq.slice(0, 3).flatMap((it) => [...extractWikiSoHieu(it)]),
    ]);

    if ([...expected].some((e) => foundAll.has(e))) hitAny += 1;
    else misses.push({ id: q.id, expected: expList, gotVb: vbs.slice(0, 3).map((x) => x.so_hieu) });
    if ([...expected].every((e) => foundAll.has(e))) hitAll += 1;
    if ([...expected].some((e) => top1.has(e))) hitTop1 += 1;
    if ([...expected].some((e) => top3.has(e))) hitTop3 += 1;
  }

  let pinOk = 0;
  const pinMiss = [];
  for (const tc of PINNED_QUERIES) {
    const r = hoiPhapLuat(store, tc.cau_hoi, { limit: 5 });
    const top = r.van_ban_lien_quan?.[0];
    if (normSh(top?.so_hieu) === normSh(tc.so_hieu)) pinOk += 1;
    else pinMiss.push({ expected: tc.so_hieu, got: top?.so_hieu || null });
  }

  let abbrOk = 0;
  const abbrMiss = [];
  for (const tc of ABBR_QUERIES) {
    const r = hoiPhapLuat(store, tc.cau_hoi, { limit: 5 });
    const got = new Set((r.van_ban_lien_quan || []).map((v) => normSh(v.so_hieu)));
    if (tc.ky_vong.some((e) => got.has(normSh(e))) && r.van_ban_lien_quan?.[0]?.tinh_trang !== 'HET_HIEU_LUC') {
      abbrOk += 1;
    } else {
      abbrMiss.push({ cau_hoi: tc.cau_hoi, got: (r.van_ban_lien_quan || []).slice(0, 3).map((v) => `${v.so_hieu}[${v.tinh_trang}]`) });
    }
  }

  let oosOk = 0;
  const oosMiss = [];
  for (const q of OUT_OF_SCOPE_QUERIES) {
    const r = hoiPhapLuat(store, q, { limit: 5 });
    if (r.do_tin_cay_tra_loi === 'KHONG_TIM_THAY' && r.goi_y_du_phong?.can_tra_nguon_truc_tiep === true) {
      oosOk += 1;
    } else {
      oosMiss.push({ cau_hoi: q, do_tin_cay: r.do_tin_cay_tra_loi, goi_y_du_phong: r.goi_y_du_phong });
    }
  }

  const pct = (a, b) => (b ? `${((100 * a) / b).toFixed(1)}%` : '0.0%');
  console.log('# Báo cáo đo truy hồi sống (eval:retrieval)');
  console.log(`- Tệp eval: ${args.evalPath} (${questions.length} câu, ${withExpected} câu có VB bắt buộc)`);
  console.log(`- hitAny (≥1 VB bắt buộc): ${hitAny}/${withExpected} (${pct(hitAny, withExpected)})`);
  console.log(`- hitAll (đủ mọi VB):     ${hitAll}/${withExpected} (${pct(hitAll, withExpected)})`);
  console.log(`- hitTop3:                ${hitTop3}/${withExpected} (${pct(hitTop3, withExpected)})`);
  console.log(`- hitTop1:                ${hitTop1}/${withExpected} (${pct(hitTop1, withExpected)})`);
  console.log(`- expiredTop1 (#1 HET_HL): ${expiredTop1}/${questions.length}`);
  console.log(`- soHieuPinRate:          ${pinOk}/${PINNED_QUERIES.length}`);
  console.log(`- abbrQueriesRate:        ${abbrOk}/${ABBR_QUERIES.length}`);
  console.log(`- outOfScopeFallbackRate: ${oosOk}/${OUT_OF_SCOPE_QUERIES.length}`);
  if (misses.length) console.log('Misses:', JSON.stringify(misses));
  if (expTop1List.length) console.log('Expired@1:', JSON.stringify(expTop1List));
  if (pinMiss.length) console.log('PinMiss:', JSON.stringify(pinMiss));
  if (abbrMiss.length) console.log('AbbrMiss:', JSON.stringify(abbrMiss));
  if (oosMiss.length) console.log('OutOfScopeMiss:', JSON.stringify(oosMiss));

  const hitRate = withExpected ? hitAny / withExpected : 1;
  const failed =
    expiredTop1 > 0 ||
    hitRate < 0.95 ||
    pinOk < PINNED_QUERIES.length ||
    abbrOk < ABBR_QUERIES.length ||
    oosOk < OUT_OF_SCOPE_QUERIES.length;
  if (args.strict && failed) {
    console.error('\nFAIL eval:retrieval không đạt ngưỡng cổng chất lượng.');
    process.exit(1);
  }
  console.log('\nPASS eval:retrieval đạt đủ mọi ngưỡng cổng chất lượng.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
