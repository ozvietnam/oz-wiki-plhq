#!/usr/bin/env node
// Dựng sản phẩm từ sổ đăng ký (không sửa registry/):
//   dist/registry.json      — toàn bộ văn bản + cạnh ngược tính sẵn, cho máy khác dùng (vd hs-code-api)
//   bao-cao/cay-van-ban.md  — cây dữ liệu XNK kèm văn bản và tình trạng
//   bao-cao/quan-he.md      — đồ thị cũ–mới (thay thế, sửa đổi, bãi bỏ, tạm ngưng) theo nhánh, dạng Mermaid
//   dist/hs-index.json      — bảng mã HS ↔ văn bản từ danh-muc/*.csv (docs/luoc-do-danh-muc-hs.md)
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { napSo, khoa, chuanCanh, dungDoThi, homNay, bacNguon, ROOT, QUAN_HE } from './lib/registry.mjs';
import { dungChiMuc } from './lib/danh-muc.mjs';

const BIEU_TUONG = {
  CON_HIEU_LUC: '🟢', HET_HIEU_LUC: '⚫', HET_HIEU_LUC_MOT_PHAN: '🟡', TAM_NGUNG_HIEU_LUC: '⏸️',
  CHUA_CO_HIEU_LUC: '🔵', CHUA_XAC_MINH: '❔',
};
const TEN_TT = {
  CON_HIEU_LUC: 'còn hiệu lực', HET_HIEU_LUC: 'hết hiệu lực', HET_HIEU_LUC_MOT_PHAN: 'hết hiệu lực một phần',
  TAM_NGUNG_HIEU_LUC: 'tạm ngưng', CHUA_CO_HIEU_LUC: 'chưa có hiệu lực', CHUA_XAC_MINH: 'chưa xác minh',
};

export function dungJson(so, today = homNay()) {
  const { nguoc } = dungDoThi(so);
  const strip = (d) => Object.fromEntries(Object.entries(d).filter(([k]) => !k.startsWith('_')));
  return {
    phien_ban: today,
    giay_phep: 'CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/',
    tong: so.vanBan.length,
    van_ban: so.vanBan.map((d) => ({
      ...strip(d),
      slug: d._slug,
      bac_nguon_cao_nhat: (d.nguon || []).map((n) => bacNguon(n.url, so.nguon)).sort()[0] || null,
      quan_he_nguoc: nguoc.get(khoa(d.so_hieu)) || {},
    })),
  };
}

function link(d) {
  return `[${d.so_hieu}](../${d._file})`;
}

export function veCay(so, today = homNay()) {
  const theoNut = new Map();
  for (const d of so.vanBan) for (const n of d.nhanh || []) {
    if (!theoNut.has(n)) theoNut.set(n, []);
    theoNut.get(n).push(d);
  }
  const lines = [
    `# Cây văn bản pháp luật XNK — ${today}`,
    '',
    `${so.vanBan.length} văn bản. ${Object.entries(BIEU_TUONG).map(([k, v]) => `${v} ${TEN_TT[k]}`).join(' · ')}`,
    '',
    'Sinh tự động từ `registry/` bằng `node tools/dung.mjs`. Đừng sửa tay file này — sửa `registry/` rồi chạy lại.',
    '',
  ];
  const ve = (nodes, depth, cha) => {
    for (const n of nodes || []) {
      const path = cha ? `${cha}/${n.id}` : n.id;
      const docs = (theoNut.get(path) || []).sort((a, b) => String(b.ngay_ban_hanh || '').localeCompare(String(a.ngay_ban_hanh || '')));
      const con = docs.filter((d) => d.tinh_trang !== 'HET_HIEU_LUC').length;
      lines.push(`${'#'.repeat(Math.min(depth + 2, 6))} ${n.ten} \`${path}\``, '');
      if (n.mo_ta) lines.push(`_${n.mo_ta}_`, '');
      if (docs.length) {
        lines.push(`${docs.length} văn bản, ${con} chưa hết hiệu lực.`, '');
        for (const d of docs) lines.push(`- ${BIEU_TUONG[d.tinh_trang] || '❔'} ${link(d)} — ${d.ten}${d.het_hieu_luc_tu ? ` _(hết hiệu lực ${d.het_hieu_luc_tu})_` : ''}`);
        lines.push('');
      } else if (!(n.con || []).length) {
        lines.push('_Chưa có văn bản — điểm mù, xem bao-cao/diem-mu.md._', '');
      }
      ve(n.con, depth + 1, path);
    }
  };
  ve(so.cay, 0, '');
  return lines.join('\n');
}

function idMermaid(s) {
  return `n_${String(s).replace(/[^A-Za-z0-9]/g, '_')}`;
}

export function veQuanHe(so, today = homNay()) {
  const TEN_CANH = { thay_the: 'thay thế', sua_doi: 'sửa đổi', bai_bo: 'bãi bỏ', tam_ngung: 'tạm ngưng', huong_dan: 'hướng dẫn', hop_nhat: 'hợp nhất' };
  const theoGoc = new Map();
  for (const d of so.vanBan) {
    const goc = (d.nhanh || ['chua-phan-loai'])[0].split('/')[0];
    for (const [qh] of Object.entries(QUAN_HE)) {
      if (qh === 'huong_dan') continue; // đồ thị cũ–mới: chỉ quan hệ làm đổi hiệu lực
      for (const raw of d.quan_he?.[qh] || []) {
        const c = chuanCanh(raw);
        if (!c) continue;
        if (!theoGoc.has(goc)) theoGoc.set(goc, []);
        theoGoc.get(goc).push({ tu: d.so_hieu, den: c.so_hieu, qh, pham_vi: c.pham_vi, tu_ngay: c.tu_ngay });
      }
    }
  }
  const ttCua = (s) => so.theoKhoa.get(khoa(s))?.[0]?.tinh_trang;
  const lines = [`# Quan hệ cũ – mới giữa các văn bản — ${today}`, '',
    'Mũi tên đi từ văn bản MỚI tới văn bản bị tác động. Sinh tự động bằng `node tools/dung.mjs`.', ''];
  const tenNhanh = Object.fromEntries(so.cay.map((n) => [n.id, n.ten]));
  for (const [goc, edges] of [...theoGoc.entries()].sort()) {
    lines.push(`## ${tenNhanh[goc] || goc}`, '', '```mermaid', 'flowchart LR');
    const nodes = new Set();
    for (const e of edges) { nodes.add(e.tu); nodes.add(e.den); }
    for (const n of nodes) lines.push(`  ${idMermaid(n)}["${n}<br/>${TEN_TT[ttCua(n)] || 'chưa có trong sổ'}"]`);
    for (const e of edges) lines.push(`  ${idMermaid(e.tu)} -->|${TEN_CANH[e.qh]}${e.pham_vi ? ` ${e.pham_vi}` : ''}${e.tu_ngay ? ` từ ${e.tu_ngay}` : ''}| ${idMermaid(e.den)}`);
    lines.push('```', '');
  }
  return lines.join('\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const today = homNay();
  const so = napSo();
  mkdirSync(join(ROOT, 'dist'), { recursive: true });
  mkdirSync(join(ROOT, 'bao-cao'), { recursive: true });
  writeFileSync(join(ROOT, 'dist', 'registry.json'), JSON.stringify(dungJson(so, today), null, 2) + '\n');
  writeFileSync(join(ROOT, 'bao-cao', 'cay-van-ban.md'), veCay(so, today) + '\n');
  writeFileSync(join(ROOT, 'bao-cao', 'quan-he.md'), veQuanHe(so, today) + '\n');
  const cm = dungChiMuc(so, ROOT, today);
  writeFileSync(join(ROOT, 'dist', 'hs-index.json'), JSON.stringify(cm, null, 1) + '\n');
  console.log(`dist/hs-index.json (${cm.van_ban.length} bảng, ${cm.van_ban.reduce((n, v) => n + v.dong.length, 0)} dòng)`);
  console.log(`dist/registry.json · bao-cao/cay-van-ban.md · bao-cao/quan-he.md (${so.vanBan.length} văn bản)`);
}
