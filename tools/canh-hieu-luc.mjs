#!/usr/bin/env node
// Công cụ canh hiệu lực hằng ngày: tổng hợp cắt chuyển ngày G, văn bản sắp hết / sắp có hiệu lực
// trong 30 và 60 ngày tới, và hàng đợi săn hiệu lực (HS_API). Chỉ đọc, không sửa registry/.
//   node tools/canh-hieu-luc.mjs [--ngay YYYY-MM-DD] [--json] [--markdown <file>] [--root <dir>]
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, homNay, napSo } from './lib/registry.mjs';
import { phanTichChuyenHieuLuc } from './chuyen-hieu-luc.mjs';
import { xepHangDoi } from './san-hieu-luc.mjs';
import { docNhuCau } from './diem-mu.mjs';

const RE_NGAY = /^\d{4}-\d{2}-\d{2}$/;
const MS_NGAY = 86400000;

function kiemTraNgayHopLe(ngay) {
  const s = String(ngay || '').trim();
  if (!RE_NGAY.test(s)) {
    throw new Error(`Ngày không hợp lệ (cần định dạng YYYY-MM-DD): "${s}"`);
  }
  const d = new Date(`${s}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s) {
    throw new Error(`Ngày lịch không tồn tại: "${s}"`);
  }
  return s;
}

function congNgay(ngay, soNgay) {
  const d = new Date(`${ngay}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + soNgay);
  return d.toISOString().slice(0, 10);
}

function khoangCachNgay(tuNgay, denNgay) {
  return Math.round((Date.parse(`${denNgay}T00:00:00Z`) - Date.parse(`${tuNgay}T00:00:00Z`)) / MS_NGAY);
}

function laTbTchq(d) {
  return d.loai === 'THONG_BAO' && /TB-(?:TCHQ|CHQ)/i.test(String(d.so_hieu || ''));
}

function taoMucCanh(d, ngayMoc, mocHienTai) {
  return {
    so_hieu: d.so_hieu,
    slug: d._slug,
    file: d._file,
    tinh_trang: d.tinh_trang,
    ngay_moc: ngayMoc,
    con_lai_ngay: khoangCachNgay(mocHienTai, ngayMoc),
    nhanh: Array.isArray(d.nhanh) ? d.nhanh : [],
  };
}

function sapXepMucCanh(a, b) {
  return a.ngay_moc.localeCompare(b.ngay_moc) || String(a.so_hieu).localeCompare(String(b.so_hieu));
}

/**
 * Tạo báo cáo canh hiệu lực cho mốc `ngay` (chỉ đọc).
 */
export function baoCaoCanhHieuLuc({ root = ROOT, ngay = homNay() } = {}) {
  const baseRoot = root ? resolve(root) : ROOT;
  const mocNgay = kiemTraNgayHopLe(ngay);
  const moc30 = congNgay(mocNgay, 30);
  const moc60 = congNgay(mocNgay, 60);

  const cat_chuyen = phanTichChuyenHieuLuc({ root: baseRoot, ngay: mocNgay });
  const so = napSo(baseRoot);

  const sap_het_hieu_luc_khan = [];
  const sap_het_hieu_luc_som = [];
  const sap_co_hieu_luc_khan = [];
  const sap_co_hieu_luc_som = [];

  for (const d of so.vanBan) {
    if (laTbTchq(d)) continue;

    const hieuLucTu = d.hieu_luc_tu ? String(d.hieu_luc_tu).trim() : null;
    const hetHieuLucTu = d.het_hieu_luc_tu ? String(d.het_hieu_luc_tu).trim() : null;

    if ((d.tinh_trang === 'CON_HIEU_LUC' || d.tinh_trang === 'HET_HIEU_LUC_MOT_PHAN') && hetHieuLucTu && RE_NGAY.test(hetHieuLucTu)) {
      if (hetHieuLucTu > mocNgay && hetHieuLucTu <= moc30) {
        sap_het_hieu_luc_khan.push(taoMucCanh(d, hetHieuLucTu, mocNgay));
      } else if (hetHieuLucTu > moc30 && hetHieuLucTu <= moc60) {
        sap_het_hieu_luc_som.push(taoMucCanh(d, hetHieuLucTu, mocNgay));
      }
    }

    if (d.tinh_trang === 'CHUA_CO_HIEU_LUC' && hieuLucTu && RE_NGAY.test(hieuLucTu)) {
      if (hieuLucTu > mocNgay && hieuLucTu <= moc30) {
        sap_co_hieu_luc_khan.push(taoMucCanh(d, hieuLucTu, mocNgay));
      } else if (hieuLucTu > moc30 && hieuLucTu <= moc60) {
        sap_co_hieu_luc_som.push(taoMucCanh(d, hieuLucTu, mocNgay));
      }
    }
  }

  sap_het_hieu_luc_khan.sort(sapXepMucCanh);
  sap_het_hieu_luc_som.sort(sapXepMucCanh);
  sap_co_hieu_luc_khan.sort(sapXepMucCanh);
  sap_co_hieu_luc_som.sort(sapXepMucCanh);

  const rows = xepHangDoi(so, { today: mocNgay, nhuCau: docNhuCau(baseRoot) });
  const san_hieu_luc = {
    lam_duoc: rows.filter((r) => r.nhom === 'lam-duoc'),
    chan_het_han: rows.filter((r) => r.nhom === 'chan-het-han'),
    da_chan: rows.filter((r) => r.nhom === 'chan').length,
  };

  const can_mo_pr = cat_chuyen.chuyen_trang_thai.length > 0;
  const can_canh_bao_issue =
    sap_het_hieu_luc_khan.length > 0 ||
    sap_co_hieu_luc_khan.length > 0 ||
    cat_chuyen.can_soat_tay.length > 0 ||
    san_hieu_luc.lam_duoc.length > 0 ||
    san_hieu_luc.chan_het_han.length > 0;

  return {
    ngay: mocNgay,
    tong_van_ban: so.vanBan.length,
    can_mo_pr,
    can_canh_bao_issue,
    cat_chuyen,
    sap_het_hieu_luc_khan,
    sap_het_hieu_luc_som,
    sap_co_hieu_luc_khan,
    sap_co_hieu_luc_som,
    san_hieu_luc,
    thong_ke: {
      chuyen_trang_thai: cat_chuyen.chuyen_trang_thai.length,
      can_soat_tay: cat_chuyen.can_soat_tay.length,
      wiki_can_ra_soat: cat_chuyen.wiki_can_ra_soat.length,
      sap_het_hieu_luc_khan: sap_het_hieu_luc_khan.length,
      sap_het_hieu_luc_som: sap_het_hieu_luc_som.length,
      sap_co_hieu_luc_khan: sap_co_hieu_luc_khan.length,
      sap_co_hieu_luc_som: sap_co_hieu_luc_som.length,
      san_lam_duoc: san_hieu_luc.lam_duoc.length,
      san_chan_het_han: san_hieu_luc.chan_het_han.length,
      san_da_chan: san_hieu_luc.da_chan,
    },
  };
}

function dinhDangDanhSachCanh(lines, items, nhanNgay) {
  if (!items.length) {
    lines.push('_Không có văn bản nào._');
    return;
  }
  for (const it of items) {
    const nhanhText = it.nhanh.length ? ` · nhánh: \`${it.nhanh.join(', ')}\`` : '';
    lines.push(
      `- **${it.so_hieu}** (\`${it.file}\`) — trạng thái \`${it.tinh_trang}\`, ${nhanNgay}: **${it.ngay_moc}** (còn ${it.con_lai_ngay} ngày)${nhanhText}`,
    );
  }
}

/**
 * Kết xuất báo cáo canh hiệu lực thành Markdown tiếng Việt.
 */
export function dinhDangMarkdownCanhHieuLuc(baoCao) {
  const {
    ngay,
    tong_van_ban,
    can_mo_pr,
    can_canh_bao_issue,
    cat_chuyen,
    sap_het_hieu_luc_khan,
    sap_het_hieu_luc_som,
    sap_co_hieu_luc_khan,
    sap_co_hieu_luc_som,
    san_hieu_luc,
  } = baoCao;

  const lines = [
    `# Báo cáo canh hiệu lực — ${ngay}`,
    '',
    `Đã rà **${tong_van_ban}** văn bản trong \`registry/van-ban/\` (bỏ qua TB-TCHQ/TB-CHQ cá biệt).`,
    `- Cờ mở PR cắt chuyển: **${can_mo_pr ? 'CÓ' : 'KHÔNG'}**`,
    `- Cờ cảnh báo issue: **${can_canh_bao_issue ? 'CÓ' : 'KHÔNG'}**`,
    '',
    '| Nhóm theo dõi | Số lượng |',
    '|---|---:|',
    `| Cắt chuyển tự động ngày ${ngay} | ${cat_chuyen.chuyen_trang_thai.length} |`,
    `| Bảo vệ cần soát tay (\`HET_HIEU_LUC_MOT_PHAN\`) | ${cat_chuyen.can_soat_tay.length} |`,
    `| Trang wiki cần rà soát | ${cat_chuyen.wiki_can_ra_soat.length} |`,
    `| Sắp hết hiệu lực khẩn (≤30 ngày) | ${sap_het_hieu_luc_khan.length} |`,
    `| Sắp hết hiệu lực sớm (31–60 ngày) | ${sap_het_hieu_luc_som.length} |`,
    `| Sắp có hiệu lực khẩn (≤30 ngày) | ${sap_co_hieu_luc_khan.length} |`,
    `| Sắp có hiệu lực sớm (31–60 ngày) | ${sap_co_hieu_luc_som.length} |`,
    `| Hàng đợi săn hiệu lực — làm được ngay | ${san_hieu_luc.lam_duoc.length} |`,
    `| Hàng đợi săn hiệu lực — hết hạn chặn (>14 ngày) | ${san_hieu_luc.chan_het_han.length} |`,
    `| Hàng đợi săn hiệu lực — đang tạm chặn | ${san_hieu_luc.da_chan} |`,
    '',
    `## 1. Bắt buộc xử lý ngày ${ngay}`,
    '',
    `### Tự động chuyển trạng thái (${cat_chuyen.chuyen_trang_thai.length})`,
  ];

  if (cat_chuyen.chuyen_trang_thai.length) {
    for (const it of cat_chuyen.chuyen_trang_thai) {
      lines.push(`- **${it.so_hieu}** (\`${it.file}\`): \`${it.trang_thai_cu}\` → \`${it.trang_thai_moi}\` — ${it.ly_do}`);
    }
  } else {
    lines.push('_Không có văn bản đến hạn chuyển trạng thái trong ngày._');
  }

  lines.push('', `### Cần soát tay HET_HIEU_LUC_MOT_PHAN (${cat_chuyen.can_soat_tay.length})`);
  if (cat_chuyen.can_soat_tay.length) {
    for (const it of cat_chuyen.can_soat_tay) {
      lines.push(`- **${it.so_hieu}** (\`${it.file}\`): giữ \`${it.tinh_trang}\` (mốc \`${it.het_hieu_luc_tu}\`) — ${it.ghi_chu}`);
    }
  } else {
    lines.push('_Không có văn bản hiệu lực một phần vượt mốc hết hiệu lực._');
  }

  lines.push('', `### Trang wiki nghiệp vụ cần rà soát (${cat_chuyen.wiki_can_ra_soat.length})`);
  if (cat_chuyen.wiki_can_ra_soat.length) {
    for (const w of cat_chuyen.wiki_can_ra_soat) {
      lines.push(`- \`${w.file}\`: nhắc ${w.van_ban.join(', ')}`);
    }
  } else {
    lines.push('_Không có trang wiki nào cần rà soát theo đợt cắt chuyển này._');
  }

  lines.push('', '## 2. Sắp hết hiệu lực', '', `### Khẩn (≤30 ngày): ${sap_het_hieu_luc_khan.length}`);
  dinhDangDanhSachCanh(lines, sap_het_hieu_luc_khan, 'hết hiệu lực từ');
  lines.push('', `### Sớm (31–60 ngày): ${sap_het_hieu_luc_som.length}`);
  dinhDangDanhSachCanh(lines, sap_het_hieu_luc_som, 'hết hiệu lực từ');

  lines.push('', '## 3. Sắp có hiệu lực', '', `### Khẩn (≤30 ngày): ${sap_co_hieu_luc_khan.length}`);
  dinhDangDanhSachCanh(lines, sap_co_hieu_luc_khan, 'có hiệu lực từ');
  lines.push('', `### Sớm (31–60 ngày): ${sap_co_hieu_luc_som.length}`);
  dinhDangDanhSachCanh(lines, sap_co_hieu_luc_som, 'có hiệu lực từ');

  lines.push('', '## 4. Hàng đợi săn hiệu lực (HS_API)', '');
  lines.push(`### Làm được ngay (${san_hieu_luc.lam_duoc.length})`);
  if (san_hieu_luc.lam_duoc.length) {
    for (const r of san_hieu_luc.lam_duoc) {
      lines.push(`- **${r.so_hieu}** (${r.soMaHs} mã HS) — ${r.lyDo}`);
    }
  } else {
    lines.push('_Không còn mục làm được ngay._');
  }

  lines.push('', `### Hết hạn chặn quá 14 ngày (${san_hieu_luc.chan_het_han.length})`);
  if (san_hieu_luc.chan_het_han.length) {
    for (const r of san_hieu_luc.chan_het_han) {
      lines.push(`- **${r.so_hieu}** (${r.soMaHs} mã HS) — ${r.lyDo}${r.viecTiep ? ` → ${r.viecTiep}` : ''}`);
    }
  } else {
    lines.push('_Không có mục chặn quá 14 ngày._');
  }

  lines.push('', `Đang tạm chặn (trong hạn 14 ngày): **${san_hieu_luc.da_chan}** mục.`);

  return lines.join('\n') + '\n';
}

function docThamSoCli(argv) {
  const layGiaTri = (flag) => {
    const idx = argv.indexOf(flag);
    if (idx === -1) return null;
    const val = argv[idx + 1];
    if (!val || val.startsWith('--')) return '';
    return val;
  };
  const coNgay = argv.includes('--ngay');
  const coMarkdown = argv.includes('--markdown');
  const coRoot = argv.includes('--root');
  return {
    help: argv.includes('--help') || argv.includes('-h'),
    json: argv.includes('--json'),
    ngay: coNgay ? layGiaTri('--ngay') : homNay(),
    markdown: coMarkdown ? layGiaTri('--markdown') : null,
    root: coRoot ? layGiaTri('--root') : ROOT,
    coMarkdown,
    coRoot,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const opts = docThamSoCli(process.argv.slice(2));
  if (opts.help) {
    console.log('Cách dùng: node tools/canh-hieu-luc.mjs [--ngay YYYY-MM-DD] [--json] [--markdown <file>] [--root <dir>]');
    process.exit(0);
  }
  try {
    if (opts.coMarkdown && !opts.markdown) {
      throw new Error('Thiếu đường dẫn tệp sau cờ --markdown');
    }
    if (opts.coRoot && !opts.root) {
      throw new Error('Thiếu đường dẫn thư mục sau cờ --root');
    }
    const baoCao = baoCaoCanhHieuLuc({ root: opts.root, ngay: opts.ngay });
    if (opts.markdown) {
      const absOut = resolve(opts.markdown);
      mkdirSync(dirname(absOut), { recursive: true });
      writeFileSync(absOut, dinhDangMarkdownCanhHieuLuc(baoCao), 'utf8');
    }
    if (opts.json) {
      console.log(JSON.stringify(baoCao, null, 2));
    } else if (!opts.markdown) {
      process.stdout.write(dinhDangMarkdownCanhHieuLuc(baoCao));
    }
  } catch (err) {
    console.error(`LỖI: ${err.message}`);
    process.exit(1);
  }
}
