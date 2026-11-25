#!/usr/bin/env node
// Đánh giá bộ Holdout mù thực chiến (`eval/holdout-thuc-chien.yaml`) — tuyệt đối KHÔNG vá theo từng câu.
//   node tools/eval-holdout.mjs [--json] [--strict] [--eval <path>]
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import yaml from 'js-yaml';
import { ROOT, khoa } from './lib/registry.mjs';
import { taoKhoTraCuu, hoiPhapLuat } from './lib/tra-cuu-plhq.mjs';

function parseArgs(argv) {
  const out = {
    evalPath: resolve(ROOT, 'eval', 'holdout-thuc-chien.yaml'),
    distDir: null,
    json: argv.includes('--json'),
    strict: argv.includes('--strict'),
  };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--eval' && argv[i + 1]) out.evalPath = resolve(argv[++i]);
    else if (argv[i] === '--dist' && argv[i + 1]) out.distDir = resolve(argv[++i]);
  }
  return out;
}

const normSh = (s) => khoa(s);

function layTapSoHieu(r, { topN = null, includeUpcoming = true } = {}) {
  const set = new Set();
  const limit = (arr) => (topN == null ? arr : arr.slice(0, topN));
  for (const v of limit(r.van_ban_lien_quan || [])) set.add(normSh(v.so_hieu));
  for (const d of limit(r.dieu_khoan_nguon_a || [])) set.add(normSh(d.so_hieu));
  for (const c of limit(r.ket_qua || [])) {
    for (const v of c.van_ban_lien_quan || []) set.add(normSh(typeof v === 'string' ? v : v.so_hieu));
    const blob = `${c.tieu_de || ''} ${c.noi_dung || ''}`;
    for (const m of blob.match(/\d+\/\d{4}\/[A-ZĐ0-9-]+/gi) || []) set.add(normSh(m));
  }
  if (includeUpcoming) {
    for (const c of limit(r.sap_co_hieu_luc || [])) {
      for (const v of c.van_ban_lien_quan || []) set.add(normSh(typeof v === 'string' ? v : v.so_hieu));
      const blob = `${c.tieu_de || ''} ${c.noi_dung || ''}`;
      for (const m of blob.match(/\d+\/\d{4}\/[A-ZĐ0-9-]+/gi) || []) set.add(normSh(m));
    }
  }
  return set;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!existsSync(args.evalPath)) {
    console.error(`Không tìm thấy tệp holdout: ${args.evalPath}`);
    process.exit(2);
  }
  const store = await taoKhoTraCuu(args.distDir ? { distDir: args.distDir } : { root: ROOT });
  const doc = yaml.load(readFileSync(args.evalPath, 'utf8'));
  const questions = Array.isArray(doc?.cau_hoi) ? doc.cau_hoi : [];

  const groupStats = {};
  const details = [];
  let totalPass = 0;

  for (const q of questions) {
    const nhom = q.nhom || 'khac';
    const gs = (groupStats[nhom] ||= { tong: 0, dat: 0, truot: [] });
    gs.tong += 1;

    const r = hoiPhapLuat(store, q.cau_hoi, { limit: 5 });
    const allRefs = layTapSoHieu(r, { includeUpcoming: true });
    const top1Vb = normSh(r.van_ban_lien_quan?.[0]?.so_hieu);
    let passed = false;
    let reason = '';

    if (nhom === 'ranh_gioi_hs_api') {
      passed = r.chuyen_huong?.he_thong === 'hs-code-api';
      if (!passed) reason = `chuyen_huong=${r.chuyen_huong?.he_thong || 'null'}, do_tin_cay=${r.do_tin_cay_tra_loi}`;
    } else if (nhom === 'ngoai_pham_vi_oos') {
      passed = r.do_tin_cay_tra_loi === 'KHONG_TIM_THAY';
      if (!passed) reason = `lot_oos do_tin_cay=${r.do_tin_cay_tra_loi}, top=${r.ket_qua?.[0]?.slug || r.van_ban_lien_quan?.[0]?.so_hieu || 'none'}`;
    } else if (nhom === 'cau_ghep_da_y') {
      const req = (q.van_ban_bat_buoc_du || []).map(normSh);
      const missing = req.filter((e) => !allRefs.has(e));
      passed = missing.length === 0 && r.van_ban_lien_quan?.[0]?.tinh_trang !== 'HET_HIEU_LUC';
      if (!passed) reason = `missing=${missing.join(',') || 'expiredTop1'}`;
    } else if (nhom === 'bay_van_ban_cu') {
      const repl = (q.van_ban_thay_the_ky_vong || []).map(normSh);
      const avoid = normSh(q.van_ban_cu_can_tranh_nham || '');
      const hasRepl = repl.some((e) => allRefs.has(e));
      const noExpiredTop1 = top1Vb !== avoid && r.van_ban_lien_quan?.[0]?.tinh_trang !== 'HET_HIEU_LUC';
      const noFalseMissingFlag = r.goi_y_du_phong?.can_mo_the_bo_sung_so !== true;
      passed = hasRepl && noExpiredTop1 && noFalseMissingFlag;
      if (!passed) reason = JSON.stringify({ hasRepl, noExpiredTop1, noFalseMissingFlag, top1: r.van_ban_lien_quan?.[0]?.so_hieu });
    } else {
      const req = (q.van_ban_ky_vong || []).map(normSh);
      const hit = req.some((e) => allRefs.has(e));
      passed = hit && r.van_ban_lien_quan?.[0]?.tinh_trang !== 'HET_HIEU_LUC';
      if (!passed) reason = `hit=${hit}, got=${(r.van_ban_lien_quan || []).slice(0, 3).map((v) => v.so_hieu).join(',')}`;
    }

    if (passed) {
      totalPass += 1;
      gs.dat += 1;
    } else {
      gs.truot.push({ id: q.id, reason });
    }
    details.push({ id: q.id, nhom, passed, reason: reason || null });
  }

  const pct = (a, b) => (b ? Number(((100 * a) / b).toFixed(1)) : 0);
  const summary = {
    tong: questions.length,
    dat: totalPass,
    ty_le: pct(totalPass, questions.length),
    theo_nhom: Object.fromEntries(
      Object.entries(groupStats).map(([k, v]) => [k, { dat: v.dat, tong: v.tong, ty_le: pct(v.dat, v.tong), truot: v.truot }]),
    ),
    chi_tiet: details,
  };

  if (args.json) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    console.log('# Báo cáo bộ Holdout thực chiến (eval:holdout)');
    console.log(`- Tổng đạt: ${summary.dat}/${summary.tong} (${summary.ty_le}%)`);
    for (const [k, v] of Object.entries(summary.theo_nhom)) {
      console.log(`  • ${k}: ${v.dat}/${v.tong} (${v.ty_le}%)${v.truot.length ? ` — trượt: ${v.truot.map((x) => `${x.id}(${x.reason})`).join('; ')}` : ''}`);
    }
  }

  if (args.strict && summary.ty_le < 85) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
