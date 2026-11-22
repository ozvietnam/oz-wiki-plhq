#!/usr/bin/env node
// CLI tra cứu Pháp luật Hải quan (PLHQ) thuần Node (0 dependency mới).
// Subcommands:
//   hieu-luc <so_hieu>
//   dieu-khoan <so_hieu> [--dieu N] [--khoan N] [--diem X] [--tu-khoa "..."] [--nguyen-van]
//   hoi "<cau_hoi>" [--nhanh ...]
//   cas "<query>" [--phu-luc I]
//   chinh-sach <ma_hs>
//   sap-het-hieu-luc [--ngay 60]
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  GHI_NGUON_CC_BY,
  MIEN_TRU_PHAP_LY,
  taoKhoTraCuu,
  traHieuLuc,
  traDieuKhoan,
  hoiPhapLuat,
  traHoaChatCas,
  traChinhSachTheoMaHs,
  lietKeSapHetHieuLuc,
} from './lib/tra-cuu-plhq.mjs';

process.stdout.on('error', (err) => {
  if (err && err.code === 'EPIPE') process.exit(0);
  throw err;
});

function inTroGiup() {
  return [
    'Công cụ tra cứu Pháp luật Hải quan (oz-wiki-plhq)',
    '',
    'Cách dùng:',
    '  node tools/tra-cuu.mjs <lệnh> [tham_số] [cờ]',
    '',
    'Các lệnh:',
    '  hieu-luc <so_hieu>                    Tra tình trạng hiệu lực, chuỗi thay thế, nguồn bậc A',
    '  dieu-khoan [<so_hieu>] [tùy chọn]     Tra điều khoản (ưu tiên NGUYEN_VAN_NGUON_A)',
    '     --dieu <N>                         Lọc theo số điều (vd: 6)',
    '     --khoan <N>                        Lọc theo khoản (vd: 1)',
    '     --diem <X>                         Lọc theo điểm (vd: a)',
    '     --tu-khoa "<chuỗi>"                Tìm theo từ khóa trong điều khoản',
    '     --nguyen-van                       Chỉ lấy tầng NGUYEN_VAN_NGUON_A (bỏ TOM_TAT_NHAP)',
    '  hoi "<cau_hoi>" [--nhanh <id>]        Hỏi đáp PLHQ trên wiki & điều khoản bậc A',
    '  cas "<query>" [--phu-luc I..IV]       Tra hóa chất theo mã CAS, tên, mã hóa chất, công thức',
    '  chinh-sach <ma_hs>                    Tra văn bản chính sách/KTCN theo mã HS đã biết',
    '  sap-het-hieu-luc [--ngay 60]          Liệt kê văn bản sắp hết hiệu lực trong <= N ngày',
    '',
    'Cờ dùng chung:',
    '  --json                                Xuất JSON chuẩn',
    '  --limit <N>                           Giới hạn số kết quả',
    '  --dist <dir>                          Thư mục dist/ tùy chọn',
    '  --root <dir>                          Thư mục gốc kho tùy chọn',
    '  -h, --help                            Hiển thị hướng dẫn này',
    '',
    GHI_NGUON_CC_BY,
    MIEN_TRU_PHAP_LY,
  ].join('\n');
}

export function phanTichThamSoCli(argv) {
  const args = Array.isArray(argv) ? argv : [];
  const flags = {
    json: false,
    help: false,
    nguyenVan: false,
    limit: undefined,
    dieu: undefined,
    khoan: undefined,
    diem: undefined,
    tuKhoa: undefined,
    nhanh: undefined,
    phuLuc: undefined,
    ngay: undefined,
    homNay: undefined,
    soHieu: undefined,
    dist: undefined,
    root: undefined,
  };
  const positionals = [];

  const readVal = (idx, inlineVal) => {
    if (inlineVal !== undefined) return { val: inlineVal, nextIdx: idx };
    if (idx + 1 >= args.length) {
      throw new Error(`Thiếu giá trị cho tham số ${args[idx]}`);
    }
    return { val: args[idx + 1], nextIdx: idx + 1 };
  };

  for (let i = 0; i < args.length; i += 1) {
    const raw = args[i];
    if (raw === '-h' || raw === '--help') {
      flags.help = true;
      continue;
    }
    if (raw === '--json') {
      flags.json = true;
      continue;
    }
    if (raw === '--nguyen-van' || raw === '--chi-nguyen-van') {
      flags.nguyenVan = true;
      continue;
    }
    if (raw.startsWith('--')) {
      const eqIdx = raw.indexOf('=');
      const name = eqIdx === -1 ? raw : raw.slice(0, eqIdx);
      const inlineVal = eqIdx === -1 ? undefined : raw.slice(eqIdx + 1);
      const map = {
        '--limit': 'limit',
        '--dieu': 'dieu',
        '--khoan': 'khoan',
        '--diem': 'diem',
        '--tu-khoa': 'tuKhoa',
        '--nhanh': 'nhanh',
        '--phu-luc': 'phuLuc',
        '--ngay': 'ngay',
        '--trong-so-ngay': 'ngay',
        '--hom-nay': 'homNay',
        '--so-hieu': 'soHieu',
        '--dist': 'dist',
        '--root': 'root',
      };
      const key = map[name];
      if (!key) throw new Error(`Tham số không hỗ trợ: ${name}`);
      const { val, nextIdx } = readVal(i, inlineVal);
      flags[key] = val;
      i = nextIdx;
      continue;
    }
    positionals.push(raw);
  }

  const command = positionals[0] || null;
  const rest = positionals.slice(1);
  return { command, rest, flags };
}

function xuatKetQua(res, asJson, formatter) {
  if (asJson) {
    process.stdout.write(`${JSON.stringify(res, null, 2)}\n`);
  } else {
    process.stdout.write(`${formatter(res)}\n`);
  }
}

function fmtHieuLuc(res) {
  if (!res.tim_thay) {
    const lines = [`Không tìm thấy văn bản "${res.truy_van}" trong sổ đăng ký.`];
    if (res.loi) lines.push(`Lỗi: ${res.loi}`);
    if (res.goi_y?.length) {
      lines.push('Gợi ý gần đúng:');
      for (const g of res.goi_y) {
        lines.push(`  - ${g.so_hieu} [${g.tinh_trang}] — ${g.ten}`);
      }
    }
    lines.push('', res.ghi_nguon, res.mien_tru);
    return lines.join('\n');
  }

  const lines = [
    `Văn bản: ${res.so_hieu}${res.khop_qua_so_hieu_khac ? ` (khớp qua tên khác "${res.truy_van}")` : ''}`,
    `Tên: ${res.ten || '(không rõ)'}`,
    `Tình trạng: ${res.tinh_trang}`,
    `Hiệu lực từ: ${res.hieu_luc_tu || '—'} | Hết hiệu lực từ: ${res.het_hieu_luc_tu || '—'} | Ban hành: ${res.ngay_ban_hanh || '—'}`,
    `Cơ quan: ${res.co_quan || '—'}${res.co_quan_ten ? ` (${res.co_quan_ten})` : ''}`,
    `Xác minh: ${res.xac_minh.muc} | Đã đối chiếu nguồn A: ${res.xac_minh.hieu_luc_da_doi_chieu ? 'Có' : 'CHƯA'}`,
  ];
  if (res.xac_minh.canh_bao) lines.push(`CẢNH BÁO: ${res.xac_minh.canh_bao}`);
  if (res.nguon_bac_a.length) {
    lines.push('Nguồn bậc A:');
    for (const u of res.nguon_bac_a) lines.push(`  - ${u}`);
  } else {
    lines.push('Nguồn bậc A: (chưa có URL bậc A)');
  }

  const qhEntries = Object.entries(res.quan_he || {});
  if (qhEntries.length) {
    lines.push('Quan hệ chiều đi:');
    for (const [qh, arr] of qhEntries) {
      for (const e of arr) {
        lines.push(
          `  - ${qh}: ${e.so_hieu} [${e.tinh_trang || '?'}]${e.pham_vi ? ` (${e.pham_vi})` : ''}${e.tu_ngay ? ` từ ${e.tu_ngay}` : ''}`,
        );
      }
    }
  }

  const qhnEntries = Object.entries(res.quan_he_nguoc || {});
  if (qhnEntries.length) {
    lines.push('Quan hệ ngược:');
    for (const [qh, arr] of qhnEntries) {
      for (const e of arr) {
        lines.push(
          `  - ${qh}: ${e.tu} [${e.tinh_trang || '?'}]${e.pham_vi ? ` (${e.pham_vi})` : ''}${e.tu_ngay ? ` từ ${e.tu_ngay}` : ''}`,
        );
      }
    }
  }

  if (res.chuoi_quan_he?.thay_the_boi_chuoi?.length) {
    lines.push('Chuỗi thay thế/bãi bỏ hướng tới văn bản mới:');
    for (const step of res.chuoi_quan_he.thay_the_boi_chuoi) {
      lines.push(
        `  - Bước ${step.buoc}: ${step.tu} -> ${step.quan_he} -> ${step.van_ban_moi} [${step.tinh_trang || '?'}]${step.pham_vi ? ` (${step.pham_vi})` : ''}`,
      );
    }
  }
  if (res.ghi_chu) lines.push(`Ghi chú: ${res.ghi_chu}`);
  lines.push('', res.ghi_nguon, res.mien_tru);
  return lines.join('\n');
}

function fmtDieuKhoan(res) {
  const lines = [
    `Tra điều khoản — Văn bản: ${res.truy_van.so_hieu || '(tất cả)'}${res.truy_van.dieu ? ` · Điều ${res.truy_van.dieu}` : ''}${res.truy_van.khoan ? ` · Khoản ${res.truy_van.khoan}` : ''}${res.truy_van.diem ? ` · Điểm ${res.truy_van.diem}` : ''}${res.truy_van.tu_khoa ? ` · Từ khóa "${res.truy_van.tu_khoa}"` : ''}`,
    `Kết quả: ${res.tong_nguyen_van} mục NGUYEN_VAN_NGUON_A · ${res.tong_tom_tat_nhap} mục TOM_TAT_NHAP`,
  ];

  if (res.nguyen_van_nguon_a.length) {
    lines.push('', '=== TẦNG 1: NGUYÊN VĂN NGUỒN BẬC A (ĐÃ XÁC MINH) ===');
    for (const item of res.nguyen_van_nguon_a) {
      const refLoc = [
        `Điều ${item.dieu}`,
        item.khoan != null ? `khoản ${item.khoan}` : null,
        item.diem ? `điểm ${item.diem}` : null,
      ]
        .filter(Boolean)
        .join(' ');
      lines.push(
        `• ${item.so_hieu} [${item.tinh_trang || '?'}] — ${refLoc} (trang_pdf: ${item.trang_pdf ?? '—'}, sha256_pdf: ${item.sha256_pdf || '—'})`,
      );
      lines.push(`  ${item.noi_dung}`);
      if (item.nguon_a) lines.push(`  Nguồn A: ${item.nguon_a}`);
    }
  }

  if (res.tom_tat_nhap.length) {
    lines.push(
      '',
      '=== TẦNG 2: TÓM TẮT NHÁP (da_soat: false — CHỈ ĐỊNH VỊ, KHÔNG TRÍCH NGUYÊN VĂN) ===',
      `Cảnh báo: ${res.canh_bao_tang_nhap}`,
    );
    for (const item of res.tom_tat_nhap) {
      lines.push(`• ${item.so_hieu} [${item.tinh_trang || '?'}] — ${item.dieu}${item.ten ? `: ${item.ten}` : ''} (${item.luu_y})`);
      if (item.tom_tat) lines.push(`  Tóm tắt: ${item.tom_tat}`);
      if (item.nghia_vu_xnk?.length) lines.push(`  Nghĩa vụ XNK: ${item.nghia_vu_xnk.join(' | ')}`);
      if (item.nguon_a) lines.push(`  Nguồn A: ${item.nguon_a}`);
    }
  }

  if (!res.nguyen_van_nguon_a.length && !res.tom_tat_nhap.length) {
    lines.push('Không có điều khoản phù hợp.');
  }

  lines.push('', res.ghi_nguon, res.mien_tru);
  return lines.join('\n');
}

function fmtHoi(res) {
  if (res.chuyen_huong) {
    return [
      `Câu hỏi: ${res.cau_hoi}`,
      `[CHUYỂN HƯỚNG -> ${res.chuyen_huong.he_thong}]`,
      `Lý do: ${res.chuyen_huong.ly_do}`,
      'Ghi chú: Kho oz-wiki-plhq không phân loại/áp mã HS từ mô tả hàng hóa, không giải thích GIR/WCO và không tính thuế suất.',
      '',
      res.ghi_nguon,
      res.mien_tru,
    ].join('\n');
  }

  const dkNguonA = Array.isArray(res.dieu_khoan_nguon_a) ? res.dieu_khoan_nguon_a : [];
  const lines = [`Câu hỏi: ${res.cau_hoi}`, `Tìm thấy ${res.tong} kết quả wiki · ${dkNguonA.length} điều khoản nguồn A:`];
  for (const item of res.ket_qua) {
    lines.push(
      '',
      `• [WIKI ${item.loai_trang}] ${item.tieu_de}${item.muc ? ` › ${item.muc}` : ''} (${item.duong_dan}${item.chunk_id ? `#${item.chunk_id.split('#')[1]}` : ''})`,
    );
    if (item.canh_bao) lines.push(`  CẢNH BÁO: ${item.canh_bao}`);
    if (item.noi_dung) {
      const snippet = item.noi_dung.length > 500 ? `${item.noi_dung.slice(0, 497)}...` : item.noi_dung;
      lines.push(`  ${snippet.replace(/\n+/g, ' ')}`);
    }
    if (item.van_ban_lien_quan?.length) {
      lines.push(
        `  Văn bản liên quan: ${item.van_ban_lien_quan.map((v) => `${v.so_hieu} [${v.tinh_trang || '?'}]`).join(', ')}`,
      );
    }
  }
  if (dkNguonA.length) {
    lines.push('', 'Điều khoản nguyên văn nguồn A liên quan (NGUYEN_VAN_NGUON_A):');
    for (const item of dkNguonA) {
      lines.push(
        `• [NGUYEN_VAN_NGUON_A] ${item.so_hieu} [${item.tinh_trang || '?'}] — Điều ${item.dieu}${item.khoan != null ? ` khoản ${item.khoan}` : ''}${item.diem ? ` điểm ${item.diem}` : ''} (trang_pdf: ${item.trang_pdf ?? '—'})`,
        `  ${item.noi_dung}`,
      );
      if (item.nguon_a) lines.push(`  Nguồn A: ${item.nguon_a}`);
    }
  }

  if (res.canh_bao?.length) {
    lines.push('', 'Lưu ý hiệu lực:');
    for (const cb of res.canh_bao) lines.push(`  - ${cb}`);
  }
  lines.push('', res.ghi_nguon, res.mien_tru);
  return lines.join('\n');
}

function fmtCas(res) {
  const lines = [
    `Tra cứu hóa chất CAS: "${res.truy_van || ''}"${res.phu_luc ? ` (Phụ lục ${res.phu_luc})` : ''} — ${res.tong}/${res.tong_truoc_gioi_han ?? res.tong} kết quả`,
  ];
  for (const item of res.ket_qua) {
    lines.push(
      `• CAS: ${item.cas || '(không có CAS)'} | ${item.ten_chat}${item.ma_hoa_chat ? ` (${item.ma_hoa_chat})` : ''}${item.cong_thuc ? ` [${item.cong_thuc}]` : ''}`,
      `  Phụ lục ${item.phu_luc}${item.muc ? ` · Mục ${item.muc}` : ''}${item.nhom ? ` · Nhóm ${item.nhom}` : ''}${item.so_thu_tu ? ` · STT ${item.so_thu_tu}` : ''} — ${item.phan_loai}${item.nguong_kg ? ` (Ngưỡng: ${item.nguong_kg} kg)` : ''}`,
      `  Căn cứ: ${item.so_hieu || item.tep} [${item.tinh_trang || '?'}]${item.nguon_a ? ` — ${item.nguon_a}` : ''}`,
    );
  }
  if (res.luu_y) lines.push('', res.luu_y);
  lines.push('', res.ghi_nguon, res.mien_tru);
  return lines.join('\n');
}

function fmtChinhSach(res) {
  const lines = [
    `Tra chính sách theo mã HS đã biết: ${res.ma_hs || res.ma_hs_goc || '—'}`,
    `Ranh giới: ${res.ranh_gioi}`,
  ];
  if (res.loi) {
    lines.push(`Lỗi: ${res.loi}`, '', res.ghi_nguon, res.mien_tru);
    return lines.join('\n');
  }
  lines.push(`Khớp ${res.tong}/${res.tong_truoc_gioi_han} dòng chính sách trên ${res.tong_khoa_khop} khóa HS:`);
  if (res.canh_bao?.length) {
    for (const cb of res.canh_bao) lines.push(`  CẢNH BÁO: ${cb}`);
  }
  for (const item of res.ket_qua) {
    lines.push(
      `• [${item.khoa_hs} · ${item.pham_vi_khop}] ${item.so_hieu} [${item.tinh_trang}] — ${item.loai_tac_dong}${item.muc_rui_ro ? ` (Rủi ro: ${item.muc_rui_ro})` : ''}`,
      `  ${item.ten}${item.phu_luc ? ` · ${item.phu_luc}` : ''}${item.nhom ? ` · ${item.nhom}` : ''}${item.dieu_kien ? ` · Điều kiện: ${item.dieu_kien}` : ''}`,
    );
  }
  if (res.mat_do_tb_tchq_tham_khao) {
    lines.push(
      `Mật độ TB-TCHQ tham khảo (bậc C): ${JSON.stringify(res.mat_do_tb_tchq_tham_khao)}`,
    );
  }
  lines.push('', res.ghi_nguon, res.mien_tru);
  return lines.join('\n');
}

function fmtSapHetHieuLuc(res) {
  const lines = [
    `Văn bản sắp hết hiệu lực trong vòng <= ${res.trong_so_ngay} ngày tính từ ${res.hom_nay}: ${res.tong} văn bản`,
  ];
  if (res.loi) {
    lines.push(`Lỗi: ${res.loi}`, '', res.ghi_nguon, res.mien_tru);
    return lines.join('\n');
  }
  for (const item of res.ket_qua) {
    const thay = [...(item.bi_thay_the_boi || []), ...(item.bi_bai_bo_boi || [])];
    lines.push(
      `• ${item.het_hieu_luc_tu} (còn ${item.so_ngay_con_lai} ngày) | ${item.so_hieu} [${item.tinh_trang}] — ${item.ten}${thay.length ? ` -> thay/bãi bởi: ${thay.join(', ')}` : ''}`,
    );
  }
  lines.push('', res.ghi_nguon, res.mien_tru);
  return lines.join('\n');
}

export async function chayCli(argv = process.argv.slice(2)) {
  let parsed;
  try {
    parsed = phanTichThamSoCli(argv);
  } catch (err) {
    process.stderr.write(`Lỗi tham số: ${err.message}\n`);
    return 1;
  }

  const { command, rest, flags } = parsed;
  if (flags.help || !command) {
    process.stdout.write(`${inTroGiup()}\n`);
    return flags.help ? 0 : 1;
  }

  const limitNum = flags.limit !== undefined ? Number(flags.limit) : undefined;
  if (flags.limit !== undefined && (!Number.isFinite(limitNum) || limitNum <= 0)) {
    process.stderr.write(`--limit phải là số nguyên dương: "${flags.limit}"\n`);
    return 1;
  }

  const store = await taoKhoTraCuu({
    distDir: flags.dist ? resolve(process.cwd(), flags.dist) : undefined,
    root: flags.root ? resolve(process.cwd(), flags.root) : undefined,
  });

  switch (command) {
    case 'hieu-luc': {
      const soHieu = flags.soHieu || rest.join(' ').trim();
      if (!soHieu) {
        process.stderr.write('Thiếu <so_hieu> cho lệnh hieu-luc.\n');
        return 1;
      }
      xuatKetQua(traHieuLuc(store, soHieu), flags.json, fmtHieuLuc);
      return 0;
    }

    case 'dieu-khoan': {
      const soHieu = flags.soHieu || rest[0] || undefined;
      if (!soHieu && !flags.tuKhoa && !flags.dieu) {
        process.stderr.write('Cần truyền <so_hieu> hoặc --tu-khoa / --dieu cho lệnh dieu-khoan.\n');
        return 1;
      }
      const res = traDieuKhoan(store, {
        so_hieu: soHieu,
        dieu: flags.dieu,
        khoan: flags.khoan,
        diem: flags.diem,
        tu_khoa: flags.tuKhoa,
        chi_nguyen_van: flags.nguyenVan,
        limit: limitNum ?? 15,
      });
      xuatKetQua(res, flags.json, fmtDieuKhoan);
      return 0;
    }

    case 'hoi': {
      const cauHoi = rest.join(' ').trim();
      if (!cauHoi) {
        process.stderr.write('Thiếu "<cau_hoi>" cho lệnh hoi.\n');
        return 1;
      }
      const res = hoiPhapLuat(store, cauHoi, {
        nhanh: flags.nhanh,
        limit: limitNum ?? 8,
      });
      xuatKetQua(res, flags.json, fmtHoi);
      return 0;
    }

    case 'cas': {
      const query = rest.join(' ').trim();
      if (!query && !flags.phuLuc) {
        process.stderr.write('Thiếu "<query>" hoặc --phu-luc cho lệnh cas.\n');
        return 1;
      }
      const res = traHoaChatCas(store, query, {
        phu_luc: flags.phuLuc,
        limit: limitNum ?? 20,
      });
      xuatKetQua(res, flags.json, fmtCas);
      return 0;
    }

    case 'chinh-sach': {
      const maHs = rest[0] || '';
      if (!maHs) {
        process.stderr.write('Thiếu <ma_hs> cho lệnh chinh-sach.\n');
        return 1;
      }
      const res = traChinhSachTheoMaHs(store, maHs, { limit: limitNum ?? 25 });
      xuatKetQua(res, flags.json, fmtChinhSach);
      return 0;
    }

    case 'sap-het-hieu-luc': {
      const ngay = flags.ngay !== undefined ? Number(flags.ngay) : 60;
      if (!Number.isFinite(ngay) || ngay < 0) {
        process.stderr.write(`--ngay không hợp lệ: "${flags.ngay}"\n`);
        return 1;
      }
      let res = lietKeSapHetHieuLuc(store, {
        trong_so_ngay: ngay,
        hom_nay: flags.homNay,
      });
      if (limitNum !== undefined && Array.isArray(res.ket_qua)) {
        res = { ...res, ket_qua: res.ket_qua.slice(0, limitNum), tong: Math.min(res.tong, limitNum) };
      }
      xuatKetQua(res, flags.json, fmtSapHetHieuLuc);
      return 0;
    }

    default:
      process.stderr.write(`Lệnh không hợp lệ: "${command}". Chạy với --help để xem hướng dẫn.\n`);
      return 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const code = await chayCli(process.argv.slice(2));
  process.exit(code);
}
