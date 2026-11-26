#!/usr/bin/env node
// Diễn tập cắt chuyển trạng thái hiệu lực tại ngày G (mặc định 2027-01-01) trong thư mục nháp cô lập.
// Không sửa cây thư mục làm việc thật:
//   1. Tạo sandbox tạm (mkdtempSync), sao chép registry/, wiki/, nhu-cau/ và symlink data/, danh-muc/, raw/, eval/.
//   2. Chạy apDungChuyenHieuLuc({ root: sandbox, ngay, ghi: true }) để cắt chuyển các văn bản đến hạn.
//   3. Chạy kiemTra(napSo(sandbox), { root: sandbox, today: ngay }) để kiểm toàn vẹn sổ sau cắt chuyển.
//   4. Quét toàn bộ wiki/**/*.md đối chiếu sổ sau cắt chuyển (cùng chuẩn ngữ cảnh lịch sử với eval-qa.mjs)
//      để bắt sớm mọi trang wiki dẫn văn bản mới hết hiệu lực hoặc còn gắn nhãn CHUA_CO_HIEU_LUC cho văn bản mới có hiệu lực.
//
// Cách dùng:
//   node tools/dien-tap-ngay-g.mjs [--ngay YYYY-MM-DD] [--json] [--markdown <file|->] [--root <dir>] [--no-strict]
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, dungDoThi, khoa, napSo } from './lib/registry.mjs';
import { apDungChuyenHieuLuc } from './chuyen-hieu-luc.mjs';
import { kiemTra } from './kiem-tra.mjs';

const RE_NGAY = /^\d{4}-\d{2}-\d{2}$/;
const BO_QUA_TEP_WIKI = new Set(['index.md', 'log.md', 'chuan-mau-wiki-source.md']);

// Đồng bộ 100% biểu thức kiểm ngữ cảnh với tools/eval-qa.mjs để kết quả diễn tập khớp cổng QA sau ngày G.
const RE_SO_HIEU = /\b\d{1,4}\/(?:\d{4}\/)?(?:TT|NĐ|ND|QĐ|QD|NQ|TTLT|CT)-[A-ZĐa-z]+(?:-[A-ZĐ]+)?\b|\b\d{1,3}\/\d{4}\/QH\d{2}\b/g;
const RE_NGU_CANH_LICH_SU = /(hết(?:\s|\*|_|`)*hiệu lực|hết(?:\s|\*|_|`)*hl|có hiệu lực đến|hết hạn|đã ngưng|ngưng hiệu lực|bị thay|thay(?:\s|\*|_|`)*thế|bị bãi bỏ|bãi bỏ|tiền thân|trước đây|trước đó|từng áp dụng|trước\s+\d{1,2}\/\d{1,2}\/\d{4}|lịch sử|tạm ngưng|không còn|đã hết|cũ|chuyển tiếp|đã thay|thay cho|đừng dẫn|không dẫn|hết từ|\bthay\b|HET_HIEU_LUC)/i;
const RE_DA_XAC_NHAN_HET_HL = /(hết(?:\s|\*|_|`)*hiệu lực|HET_HIEU_LUC|đã bị bãi bỏ|bị bãi bỏ)/i;
const RE_NGU_CANH_CHUA_CAP_NHAT = /(sắp thay|sắp đổi|chưa xác minh)/i;
const RE_NGU_CANH_CHUA_HIEU_LUC = /(chưa có hiệu lực|CHUA_CO_HIEU_LUC)/i;
const RE_NGU_CANH_MOT_PHAN = /(HET_HIEU_LUC_MOT_PHAN|một phần|Phụ lục\s+(?:II|III|IV|V)\b)/i;
const RE_KHANG_DINH_HIEN_HANH = /(?:—|-)\s*hiện hành\b|\bđang còn hiệu lực toàn bộ\b/i;
const RE_MUC_NGUYEN_VAN_NGUON = /^##\s*(Toàn văn|Toan van|Nguyên văn|Nguyen van|Nội dung|Noi dung|Key claims|Căn cứ pháp lý|Can cu phap ly|Điều\s+\d+|Phụ lục|Evidence)\b/i;

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

function chonBanGhi(ds, k) {
  if (!Array.isArray(ds) || ds.length === 0) return null;
  if (ds.length === 1) return ds[0];
  const score = (d) =>
    (khoa(d.so_hieu) === k ? 8 : 0) +
    (d.tinh_trang !== 'HET_HIEU_LUC' ? 4 : 0) +
    (d.xac_minh?.muc === 'NGUON_A' ? 2 : 0);
  return [...ds].sort((a, b) => {
    const diff = score(b) - score(a);
    if (diff !== 0) return diff;
    return String(b.ngay_ban_hanh || '').localeCompare(String(a.ngay_ban_hanh || ''));
  })[0];
}

function traCuuVanBan(theoKhoa, soHieu) {
  const k = khoa(soHieu);
  if (!k) return null;
  const val = theoKhoa instanceof Map ? theoKhoa.get(k) : theoKhoa?.[k];
  if (!val) return null;
  return Array.isArray(val) ? chonBanGhi(val, k) : val;
}

function tachDongThanMarkdown(noiDung) {
  const lines = noiDung.split(/\r?\n/);
  let i = 0;
  if (lines[0]?.trim() === '---') {
    i = 1;
    while (i < lines.length && lines[i].trim() !== '---') i += 1;
    if (i < lines.length) i += 1;
  }
  const ketQua = [];
  let trongCode = false;
  for (; i < lines.length; i += 1) {
    const dong = lines[i];
    if (/^\s*(?:```|~~~)/.test(dong)) {
      trongCode = !trongCode;
      ketQua.push('');
      continue;
    }
    ketQua.push(trongCode ? '' : dong);
  }
  return ketQua;
}

function trichMenhDe(dong, viTri, doDai) {
  let start = 0;
  let end = dong.length;
  for (let i = viTri - 1; i >= 0; i -= 1) {
    const ch = dong[i];
    if (ch === '|' || ch === ';') {
      start = i + 1;
      break;
    }
    if (ch === '.' && /\s/.test(dong[i + 1] || '') && !/\d/.test(dong[i - 1] || '')) {
      start = i + 1;
      break;
    }
  }
  for (let i = viTri + doDai; i < dong.length; i += 1) {
    const ch = dong[i];
    if (ch === '|' || ch === ';') {
      end = i;
      break;
    }
    if (ch === '.' && (i + 1 === dong.length || /\s/.test(dong[i + 1])) && !/\d/.test(dong[i - 1] || '')) {
      end = i + 1;
      break;
    }
  }
  return dong.slice(start, end).trim();
}

function lietKeTepWiki(root) {
  const wikiRoot = join(root, 'wiki');
  const out = [];
  const walk = (dir) => {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir).sort()) {
      if (name === 'graph' || name.startsWith('.')) continue;
      const abs = join(dir, name);
      const st = statSync(abs);
      if (st.isDirectory()) {
        walk(abs);
      } else if (st.isFile() && name.endsWith('.md') && !BO_QUA_TEP_WIKI.has(name)) {
        out.push(abs);
      }
    }
  };
  walk(wikiRoot);
  return out;
}

function timDocSoHieuCuaTrangNguon(vbSlug, docTheoSlug, theoKhoa) {
  if (!vbSlug) return null;
  if (docTheoSlug.has(vbSlug)) return docTheoSlug.get(vbSlug);
  for (const [slugKey, d] of docTheoSlug.entries()) {
    if (slugKey.startsWith(`${vbSlug}-`)) return d;
  }
  const guessKhoa = khoa(vbSlug.replace(/-/g, '/'));
  return traCuuVanBan(theoKhoa, guessKhoa);
}

/**
 * Quét một tệp wiki đối chiếu sổ văn bản sau cắt chuyển.
 */
function quetTrangWikiSauCatChuyen({ absPath, root, so, doThi, docTheoSlug, tapKhoaCatChuyen, tapKhoaCanSoatTay }) {
  const relPath = relative(root, absPath).replace(/\\/g, '/');
  const slug = relPath.replace(/^wiki\//, '').replace(/\.md$/, '');
  const parts = slug.split('/');
  const loaiTrang = parts.length > 1 ? parts[0] : 'root';
  const laTrangNguon = loaiTrang === 'sources';
  const vbSlug = laTrangNguon ? slug.slice('sources/'.length) : null;
  const ownDoc = laTrangNguon ? timDocSoHieuCuaTrangNguon(vbSlug, docTheoSlug, so.theoKhoa) : null;
  const ownKhoa = ownDoc ? khoa(ownDoc.so_hieu) : null;

  const dongThan = tachDongThanMarkdown(readFileSync(absPath, 'utf8'));
  const canhBao = [];
  const canhBaoCatChuyen = [];
  const daGhi = new Set();
  let mucHienTai = '';
  let boQuaNguyenVan = false;

  const ghiCanhBao = (msg, laVbCatChuyen) => {
    if (daGhi.has(msg)) return;
    daGhi.add(msg);
    canhBao.push(msg);
    if (laVbCatChuyen) canhBaoCatChuyen.push(msg);
  };

  for (let idx = 0; idx < dongThan.length; idx += 1) {
    const dong = dongThan[idx];
    if (!dong) continue;
    if (/^##\s+/.test(dong)) {
      mucHienTai = dong;
      boQuaNguyenVan = laTrangNguon && RE_MUC_NGUYEN_VAN_NGUON.test(dong);
      continue;
    }
    if (boQuaNguyenVan) continue;

    const regex = new RegExp(RE_SO_HIEU.source, 'g');
    const matches = [...dong.matchAll(regex)];
    if (!matches.length) continue;

    const laBangHoacMuc = /^\s*(?:\||[-*]\s)/.test(dong);
    const nguCanhRong = laBangHoacMuc
      ? `${mucHienTai} ${dong}`
      : `${mucHienTai} ${dongThan[idx - 1] || ''} ${dong}`;

    for (const m of matches) {
      const rawSo = m[0];
      const doc = traCuuVanBan(so.theoKhoa, rawSo);
      if (!doc || doc.loai === 'THONG_BAO') continue;
      const k = khoa(doc.so_hieu);
      const laVbCatChuyen = tapKhoaCatChuyen.has(k);
      // Trên trang tổng hợp/khái niệm/đọc hiểu (!laTrangNguon): kiểm toàn bộ văn bản trong sổ (đồng bộ diem-mu + eval-qa).
      // Trên trang lưu trữ nguồn gốc (wiki/sources/*.md): kiểm mọi dẫn chiếu tới các văn bản chịu tác động cắt chuyển ngày G.
      if (laTrangNguon && !laVbCatChuyen) continue;

      const menhDe = trichMenhDe(dong, m.index ?? 0, rawSo.length);
      const laLichSu = RE_NGU_CANH_LICH_SU.test(nguCanhRong);
      const nutDoThi = doThi.nguoc.get(k);
      const coVbThayThe = Boolean(nutDoThi?.bi_thay_the_boi?.length || nutDoThi?.bi_bai_bo_boi?.length);

      const capNhatCu = menhDe.match(RE_NGU_CANH_CHUA_CAP_NHAT);
      const biDanhDauChuaCapNhat =
        Boolean(capNhatCu) &&
        (/(sắp thay|sắp đổi)/i.test(capNhatCu[0]) || !RE_DA_XAC_NHAN_HET_HL.test(menhDe));

      if (doc.tinh_trang === 'HET_HIEU_LUC') {
        if (laTrangNguon && ownKhoa && k === ownKhoa) continue;
        if (!laLichSu) {
          ghiCanhBao(
            `${slug}: dòng thân ${idx + 1} dẫn ${doc.so_hieu} (HET_HIEU_LUC) không kèm ngữ cảnh lịch sử/hết hiệu lực/thay thế`,
            laVbCatChuyen,
          );
        } else if (biDanhDauChuaCapNhat && coVbThayThe) {
          ghiCanhBao(
            `${slug}: dòng thân ${idx + 1} ghi "${rawSo}" theo ngữ cảnh cũ (${capNhatCu[0]}) dù đã có văn bản thay thế/bãi bỏ`,
            laVbCatChuyen,
          );
        }
      } else if (tapKhoaCanSoatTay.has(k)) {
        if (laTrangNguon && ownKhoa && k === ownKhoa) continue;
        const coNguCanhMotPhan = laLichSu || RE_NGU_CANH_MOT_PHAN.test(nguCanhRong);
        if (!coNguCanhMotPhan || RE_KHANG_DINH_HIEN_HANH.test(menhDe)) {
          ghiCanhBao(
            `${slug}: dòng thân ${idx + 1} dẫn ${doc.so_hieu} (HET_HIEU_LUC_MOT_PHAN quá mốc ${doc.het_hieu_luc_tu}) thiếu ngữ cảnh chuyển tiếp/hết hiệu lực một phần`,
            true,
          );
        }
      } else if (doc.tinh_trang === 'CON_HIEU_LUC' && RE_NGU_CANH_CHUA_HIEU_LUC.test(menhDe)) {
        const laLichSuThoiDiem =
          laTrangNguon &&
          ownKhoa &&
          k === ownKhoa &&
          /(?:tại thời điểm|tính đến)\s+\d{1,2}\/\d{1,2}\/\d{4}/i.test(dong);
        if (!laLichSuThoiDiem) {
          ghiCanhBao(
            `${slug}: dòng thân ${idx + 1} đánh dấu ${doc.so_hieu} là chưa có hiệu lực dù sau cắt chuyển sổ ghi CON_HIEU_LUC`,
            laVbCatChuyen,
          );
        }
      }
    }
  }

  return {
    slug,
    path: relPath,
    loai_trang: loaiTrang,
    canh_bao: canhBao,
    canh_bao_cat_chuyen: canhBaoCatChuyen,
  };
}

function dungSandboxDienTap(baseRoot) {
  const sandbox = mkdtempSync(join(tmpdir(), 'oz-dien-tap-ngay-g-'));
  for (const copyDir of ['registry', 'wiki', 'nhu-cau']) {
    const src = join(baseRoot, copyDir);
    if (existsSync(src)) {
      cpSync(src, join(sandbox, copyDir), { recursive: true });
    }
  }
  for (const linkDir of ['data', 'danh-muc', 'raw', 'eval']) {
    const src = join(baseRoot, linkDir);
    if (existsSync(src)) {
      symlinkSync(src, join(sandbox, linkDir), 'dir');
    }
  }
  return sandbox;
}

/**
 * Thực thi diễn tập ngày G trong sandbox tạm, không chạm vào cây làm việc thật.
 * @param {{ root?: string, ngay?: string }} [opts]
 */
export function chayDienTapNgayG({ root = ROOT, ngay = '2027-01-01' } = {}) {
  const baseRoot = root ? resolve(root) : ROOT;
  const mocNgay = kiemTraNgayHopLe(ngay);
  const sandbox = dungSandboxDienTap(baseRoot);

  try {
    const catChuyen = apDungChuyenHieuLuc({ root: sandbox, ngay: mocNgay, ghi: true });
    const soSau = napSo(sandbox);
    const doThi = dungDoThi(soSau);
    const docTheoSlug = new Map(soSau.vanBan.map((d) => [d._slug, d]));
    const kqKiemTra = kiemTra(soSau, { root: sandbox, today: mocNgay });

    const tapKhoaCanSoatTay = new Set(catChuyen.can_soat_tay.map((x) => khoa(x.so_hieu)));
    const tapKhoaCatChuyen = new Set([
      ...catChuyen.chuyen_trang_thai.map((x) => khoa(x.so_hieu)),
      ...tapKhoaCanSoatTay,
    ]);

    const tepWiki = lietKeTepWiki(sandbox);
    const wikiLoiThoi = [];
    for (const absPath of tepWiki) {
      const kqTrang = quetTrangWikiSauCatChuyen({
        absPath,
        root: sandbox,
        so: soSau,
        doThi,
        docTheoSlug,
        tapKhoaCatChuyen,
        tapKhoaCanSoatTay,
      });
      if (kqTrang.canh_bao.length > 0) {
        wikiLoiThoi.push(kqTrang);
      }
    }

    const tongCanhBaoWiki = wikiLoiThoi.reduce((acc, w) => acc + w.canh_bao.length, 0);
    const tongCanhBaoCatChuyen = wikiLoiThoi.reduce((acc, w) => acc + w.canh_bao_cat_chuyen.length, 0);
    const dat = kqKiemTra.loi.length === 0 && wikiLoiThoi.length === 0;

    return {
      ngay: mocNgay,
      dat,
      tong_van_ban: soSau.vanBan.length,
      so_trang_wiki_da_quet: tepWiki.length,
      cat_chuyen: {
        chuyen_trang_thai: catChuyen.chuyen_trang_thai,
        can_soat_tay: catChuyen.can_soat_tay,
        wiki_can_ra_soat: catChuyen.wiki_can_ra_soat,
        da_ghi_sandbox: catChuyen.da_ghi.length,
      },
      kiem_tra_so: {
        so_loi: kqKiemTra.loi.length,
        so_canh_bao: kqKiemTra.canhBao.length,
        loi: kqKiemTra.loi,
        canh_bao: kqKiemTra.canhBao,
      },
      wiki_loi_thoi: wikiLoiThoi,
      thong_ke: {
        chuyen_tu_dong: catChuyen.chuyen_trang_thai.length,
        chuyen_het_hieu_luc: catChuyen.thong_ke.het_hieu_luc,
        chuyen_co_hieu_luc: catChuyen.thong_ke.co_hieu_luc,
        can_soat_tay: catChuyen.can_soat_tay.length,
        loi_so: kqKiemTra.loi.length,
        canh_bao_so: kqKiemTra.canhBao.length,
        so_trang_wiki_loi_thoi: wikiLoiThoi.length,
        tong_canh_bao_wiki: tongCanhBaoWiki,
        tong_canh_bao_wiki_do_cat_chuyen: tongCanhBaoCatChuyen,
      },
    };
  } finally {
    rmSync(sandbox, { recursive: true, force: true });
  }
}

/**
 * Kết xuất báo cáo diễn tập ngày G sang Markdown tiếng Việt.
 */
export function dinhDangMarkdownDienTapNgayG(kq) {
  const { ngay, dat, tong_van_ban, so_trang_wiki_da_quet, cat_chuyen, kiem_tra_so, wiki_loi_thoi, thong_ke } = kq;
  const lines = [
    `# Báo cáo diễn tập cắt chuyển hiệu lực ngày G — ${ngay}`,
    '',
    `- Kết luận diễn tập: **${dat ? 'ĐẠT (0 lỗi sổ, 0 trang wiki lỗi thời)' : 'CHƯA ĐẠT (cần xử lý lỗi trước ngày G)'}**`,
    `- Quy mô đối chiếu trong sandbox cô lập: **${tong_van_ban}** văn bản · **${so_trang_wiki_da_quet}** trang \`wiki/**/*.md\``,
    '',
    '| Chỉ số diễn tập | Kết quả |',
    '|---|---:|',
    `| Tự động chuyển trạng thái (\`--ghi\` trong sandbox) | ${thong_ke.chuyen_tu_dong} (${thong_ke.chuyen_het_hieu_luc} → \`HET_HIEU_LUC\`, ${thong_ke.chuyen_co_hieu_luc} → \`CON_HIEU_LUC\`) |`,
    `| Văn bản \`HET_HIEU_LUC_MOT_PHAN\` bảo vệ soát tay | ${thong_ke.can_soat_tay} |`,
    `| Lỗi toàn vẹn sổ đăng ký (\`kiemTra\`) sau cắt chuyển | ${thong_ke.loi_so} |`,
    `| Cảnh báo sổ đăng ký (\`kiemTra\`) | ${thong_ke.canh_bao_so} |`,
    `| Trang wiki phát sinh dẫn chiếu lỗi thời sau cắt chuyển | ${thong_ke.so_trang_wiki_loi_thoi} (${thong_ke.tong_canh_bao_wiki} dòng cảnh báo) |`,
    '',
    `## 1. Các văn bản tự động cắt chuyển tại mốc ${ngay} (${cat_chuyen.chuyen_trang_thai.length})`,
    '',
  ];

  if (cat_chuyen.chuyen_trang_thai.length) {
    for (const it of cat_chuyen.chuyen_trang_thai) {
      lines.push(`- **${it.so_hieu}** (\`${it.file}\`): \`${it.trang_thai_cu}\` → \`${it.trang_thai_moi}\` (${it.ly_do})`);
    }
  } else {
    lines.push('_Không có văn bản nào tự động chuyển trạng thái._');
  }

  lines.push('', `## 2. Văn bản \`HET_HIEU_LUC_MOT_PHAN\` cần soát tay (${cat_chuyen.can_soat_tay.length})`, '');
  if (cat_chuyen.can_soat_tay.length) {
    for (const it of cat_chuyen.can_soat_tay) {
      lines.push(`- **${it.so_hieu}** (\`${it.file}\`): giữ \`${it.tinh_trang}\` (\`het_hieu_luc_tu: ${it.het_hieu_luc_tu}\`) — ${it.ghi_chu}`);
    }
  } else {
    lines.push('_Không có văn bản hiệu lực một phần cần soát tay._');
  }

  lines.push('', `## 3. Kiểm tra toàn vẹn sổ đăng ký sau cắt chuyển (${kiem_tra_so.so_loi} lỗi)`, '');
  if (kiem_tra_so.loi.length) {
    for (const e of kiem_tra_so.loi) {
      lines.push(`- **LỖI** \`${e.file}\`: ${e.msg}`);
    }
  } else {
    lines.push('_0 lỗi toàn vẹn sổ đăng ký._');
  }

  lines.push('', `## 4. Rà soát dẫn chiếu lỗi thời trên \`wiki/**/*.md\` (${wiki_loi_thoi.length} trang)`, '');
  if (wiki_loi_thoi.length) {
    for (const w of wiki_loi_thoi) {
      for (const cb of w.canh_bao) {
        lines.push(`- \`${w.path}\`: ${cb}`);
      }
    }
  } else {
    lines.push('_0 trang wiki lỗi thời — toàn bộ dẫn chiếu sang văn bản hết hiệu lực/mới có hiệu lực đều đã gắn ngữ cảnh hợp lệ._');
  }

  return `${lines.join('\n')}\n`;
}

function docThamSoCli(argv) {
  const layGiaTri = (flag) => {
    const idx = argv.indexOf(flag);
    if (idx === -1) return null;
    const val = argv[idx + 1];
    if (!val || (val !== '-' && val.startsWith('--'))) return '';
    return val;
  };
  const coNgay = argv.includes('--ngay');
  const coMarkdown = argv.includes('--markdown');
  const coRoot = argv.includes('--root');
  return {
    help: argv.includes('--help') || argv.includes('-h'),
    json: argv.includes('--json'),
    noStrict: argv.includes('--no-strict'),
    ngay: coNgay ? layGiaTri('--ngay') : '2027-01-01',
    markdown: coMarkdown ? layGiaTri('--markdown') : null,
    root: coRoot ? layGiaTri('--root') : ROOT,
    coMarkdown,
    coRoot,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const opts = docThamSoCli(process.argv.slice(2));
  if (opts.help) {
    console.log(
      'Cách dùng: node tools/dien-tap-ngay-g.mjs [--ngay YYYY-MM-DD] [--json] [--markdown <file|->] [--root <dir>] [--no-strict]',
    );
    process.exit(0);
  }
  try {
    if (opts.coMarkdown && !opts.markdown) {
      throw new Error('Thiếu đường dẫn tệp (hoặc "-") sau cờ --markdown');
    }
    if (opts.coRoot && !opts.root) {
      throw new Error('Thiếu đường dẫn thư mục sau cờ --root');
    }
    const kq = chayDienTapNgayG({ root: opts.root, ngay: opts.ngay });
    const md = dinhDangMarkdownDienTapNgayG(kq);
    if (opts.markdown && opts.markdown !== '-') {
      const absOut = resolve(opts.markdown);
      mkdirSync(dirname(absOut), { recursive: true });
      writeFileSync(absOut, md, 'utf8');
    }
    if (opts.json) {
      process.stdout.write(`${JSON.stringify(kq, null, 2)}\n`);
    } else if (!opts.markdown || opts.markdown === '-') {
      process.stdout.write(md);
    }
    if (!opts.noStrict && !kq.dat) {
      process.exit(1);
    }
  } catch (err) {
    console.error(`LỖI: ${err.message}`);
    process.exit(1);
  }
}
