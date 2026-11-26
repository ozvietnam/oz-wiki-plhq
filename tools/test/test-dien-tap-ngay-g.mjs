// Unit & CLI tests cho công cụ diễn tập cắt chuyển hiệu lực ngày G (tools/dien-tap-ngay-g.mjs).
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from '../lib/registry.mjs';
import { chayDienTapNgayG, dinhDangMarkdownDienTapNgayG } from '../dien-tap-ngay-g.mjs';

export function chayTestDienTapNgayG() {
  let pass = 0;
  let fail = 0;
  const t = (name, cond, extra = '') => {
    if (cond) {
      pass += 1;
      console.log(`PASS [dien-tap-ngay-g] ${name}`);
    } else {
      fail += 1;
      console.log(`FAIL [dien-tap-ngay-g] ${name} ${extra}`);
    }
  };

  const tmpDirs = [];
  const makeTmp = (prefix) => {
    const d = mkdtempSync(join(tmpdir(), prefix));
    tmpDirs.push(d);
    return d;
  };

  try {
    // 1. Sandbox giả lập: bắt đúng trang wiki lỗi thời sau cắt chuyển, bảo toàn nguyên trạng thư mục gốc
    const tmpIso = makeTmp('oz-dien-tap-iso-');
    cpSync(join(ROOT, 'registry/cay-xnk.yaml'), join(tmpIso, 'registry/cay-xnk.yaml'));
    cpSync(join(ROOT, 'registry/co-quan.yaml'), join(tmpIso, 'registry/co-quan.yaml'));
    cpSync(join(ROOT, 'registry/nguon-uy-tin.yaml'), join(tmpIso, 'registry/nguon-uy-tin.yaml'));
    mkdirSync(join(tmpIso, 'registry/van-ban'), { recursive: true });
    mkdirSync(join(tmpIso, 'wiki/concepts'), { recursive: true });

    const yamlHet = [
      'so_hieu: 100/2025/NĐ-CP',
      'loai: NGHI_DINH',
      'ten: Nghị định thử nghiệm hết hạn cuối năm 2026',
      'co_quan: CP',
      "ngay_ban_hanh: '2025-06-30'",
      "hieu_luc_tu: '2025-07-01'",
      "het_hieu_luc_tu: '2026-12-31'",
      'tinh_trang: CON_HIEU_LUC',
      'nhanh:',
      '  - thue/thue-noi-dia-khau-nk',
      'nguon:',
      '  - url: https://vanban.chinhphu.vn/?docid=1002025',
      "    truy_cap: '2026-11-26'",
      'xac_minh:',
      '  muc: NGUON_A',
      '  hieu_luc_da_doi_chieu: true',
      "  ngay: '2026-11-26'",
    ].join('\n');

    const yamlMoi = [
      'so_hieu: 200/2026/TT-BTC',
      'loai: THONG_TU',
      'ten: Thông tư thử nghiệm có hiệu lực đầu năm 2027',
      'co_quan: BTC',
      "ngay_ban_hanh: '2026-10-15'",
      "hieu_luc_tu: '2027-01-01'",
      'tinh_trang: CHUA_CO_HIEU_LUC',
      'nhanh:',
      '  - hai-quan/thu-tuc',
      'nguon:',
      '  - url: https://vanban.chinhphu.vn/?docid=2002026',
      "    truy_cap: '2026-11-26'",
      'xac_minh:',
      '  muc: NGUON_A',
      '  hieu_luc_da_doi_chieu: true',
      "  ngay: '2026-11-26'",
    ].join('\n');

    const yamlMotPhan = [
      'so_hieu: 300/2023/TT-BCT',
      'loai: THONG_TU',
      'ten: Thông tư hiệu lực một phần cần soát tay',
      'co_quan: BCT',
      "ngay_ban_hanh: '2023-05-01'",
      "hieu_luc_tu: '2023-06-01'",
      "het_hieu_luc_tu: '2026-12-31'",
      'tinh_trang: HET_HIEU_LUC_MOT_PHAN',
      'nhanh:',
      '  - quan-ly-ngoai-thuong/hang-da-qua-su-dung',
      'nguon:',
      '  - url: https://vanban.chinhphu.vn/?docid=3002023',
      "    truy_cap: '2026-11-26'",
      'xac_minh:',
      '  muc: NGUON_A',
      '  hieu_luc_da_doi_chieu: true',
      "  ngay: '2026-11-26'",
    ].join('\n');

    writeFileSync(join(tmpIso, 'registry/van-ban/100-2025-nd-cp.yaml'), yamlHet, 'utf8');
    writeFileSync(join(tmpIso, 'registry/van-ban/200-2026-tt-btc.yaml'), yamlMoi, 'utf8');
    writeFileSync(join(tmpIso, 'registry/van-ban/300-2023-tt-bct.yaml'), yamlMotPhan, 'utf8');

    const staleWikiPath = join(tmpIso, 'wiki/concepts/trang-loi-thoi.md');
    writeFileSync(
      staleWikiPath,
      [
        '---',
        'id: trang-loi-thoi',
        'title: Trang thử nghiệm lỗi thời',
        'type: concept',
        '---',
        '',
        '## Definition',
        '',
        'Doanh nghiệp áp dụng mức giảm thuế theo Nghị định 100/2025/NĐ-CP cho mọi lô hàng nhập khẩu.',
        'Ngoài ra Thông tư 200/2026/TT-BTC hiện đang ở trạng thái CHUA_CO_HIEU_LUC.',
      ].join('\n'),
      'utf8',
    );

    writeFileSync(
      join(tmpIso, 'wiki/concepts/trang-sach.md'),
      [
        '---',
        'id: trang-sach',
        'title: Trang thử nghiệm đã gắn ngữ cảnh lịch sử',
        'type: concept',
        '---',
        '',
        '## Definition',
        '',
        'Nghị định 100/2025/NĐ-CP có hiệu lực đến hết 31/12/2026 (hết hiệu lực từ 01/01/2027).',
        'Từ ngày 01/01/2027, thủ tục thực hiện theo Thông tư 200/2026/TT-BTC.',
      ].join('\n'),
      'utf8',
    );

    const kqLoi = chayDienTapNgayG({ root: tmpIso, ngay: '2027-01-01' });
    const yamlGocSauChay = readFileSync(join(tmpIso, 'registry/van-ban/100-2025-nd-cp.yaml'), 'utf8');
    t(
      'sandbox phát hiện đúng trang wiki lỗi thời (cả HET_HIEU_LUC thiếu ngữ cảnh & CON_HIEU_LUC còn ghi CHUA_CO_HIEU_LUC) và không sửa đĩa thật',
      kqLoi.dat === false
        && kqLoi.thong_ke.chuyen_tu_dong === 2
        && kqLoi.thong_ke.chuyen_het_hieu_luc === 1
        && kqLoi.thong_ke.chuyen_co_hieu_luc === 1
        && kqLoi.thong_ke.can_soat_tay === 1
        && kqLoi.kiem_tra_so.so_loi === 0
        && kqLoi.wiki_loi_thoi.length === 1
        && kqLoi.wiki_loi_thoi[0].slug === 'concepts/trang-loi-thoi'
        && kqLoi.wiki_loi_thoi[0].canh_bao.length === 2
        && yamlGocSauChay.includes('tinh_trang: CON_HIEU_LUC'),
      JSON.stringify(kqLoi.wiki_loi_thoi),
    );

    // Sửa trang lỗi thời trong tmpIso -> diễn tập phải chuyển sang ĐẠT
    writeFileSync(
      staleWikiPath,
      [
        '---',
        'id: trang-loi-thoi',
        'title: Trang thử nghiệm đã cập nhật ngữ cảnh',
        'type: concept',
        '---',
        '',
        '## Definition',
        '',
        'Doanh nghiệp áp dụng mức giảm thuế theo Nghị định 100/2025/NĐ-CP (có hiệu lực đến 31/12/2026).',
        'Thông tư 200/2026/TT-BTC có hiệu lực thi hành từ ngày 01/01/2027.',
      ].join('\n'),
      'utf8',
    );
    const kqSach = chayDienTapNgayG({ root: tmpIso, ngay: '2027-01-01' });
    const mdSach = dinhDangMarkdownDienTapNgayG(kqSach);
    t(
      'sau khi gắn ngữ cảnh hết hạn / hiệu lực cho wiki, diễn tập đạt dat === true & xuất Markdown tiếng Việt chuẩn',
      kqSach.dat === true
        && kqSach.wiki_loi_thoi.length === 0
        && mdSach.includes('# Báo cáo diễn tập cắt chuyển hiệu lực ngày G — 2027-01-01')
        && mdSach.includes('ĐẠT (0 lỗi sổ, 0 trang wiki lỗi thời)'),
      JSON.stringify(kqSach.thong_ke),
    );

    // 2. Diễn tập trực tiếp trên kho thật tại mốc 2027-01-01
    const kqRoot = chayDienTapNgayG({ root: ROOT, ngay: '2027-01-01' });
    t(
      'kho thật tại mốc 2027-01-01: 10 chuyển tự động (6 HET_HIEU_LUC + 4 CON_HIEU_LUC), 2 soát tay, 0 lỗi sổ, 0 trang wiki lỗi thời',
      kqRoot.dat === true
        && kqRoot.thong_ke.chuyen_tu_dong === 10
        && kqRoot.thong_ke.chuyen_het_hieu_luc === 6
        && kqRoot.thong_ke.chuyen_co_hieu_luc === 4
        && kqRoot.thong_ke.can_soat_tay === 2
        && kqRoot.kiem_tra_so.so_loi === 0
        && kqRoot.wiki_loi_thoi.length === 0,
      JSON.stringify({ thong_ke: kqRoot.thong_ke, wiki_loi_thoi: kqRoot.wiki_loi_thoi }),
    );

    // 3. CLI --help, --json, --markdown <file>, và chặn ngày không hợp lệ
    const tmpOut = makeTmp('oz-dien-tap-cli-');
    const mdOutPath = join(tmpOut, 'dien-tap-2027.md');
    const cliScript = join(ROOT, 'tools/dien-tap-ngay-g.mjs');

    const cliHelp = execFileSync(process.execPath, [cliScript, '--help'], { encoding: 'utf8' });
    const cliJson = JSON.parse(
      execFileSync(process.execPath, [cliScript, '--root', tmpIso, '--ngay', '2027-01-01', '--json'], { encoding: 'utf8' }),
    );
    execFileSync(process.execPath, [cliScript, '--root', tmpIso, '--ngay', '2027-01-01', '--markdown', mdOutPath], {
      encoding: 'utf8',
    });
    const mdFile = existsSync(mdOutPath) ? readFileSync(mdOutPath, 'utf8') : '';
    const cliBadDate = spawnSync(process.execPath, [cliScript, '--ngay', '2027-02-29'], { encoding: 'utf8' });

    t(
      'CLI dien-tap-ngay-g: --help, --json, --markdown <file> và bắt ngày không tồn tại',
      cliHelp.includes('--markdown <file|->')
        && cliJson.dat === true
        && cliJson.ngay === '2027-01-01'
        && mdFile.includes('# Báo cáo diễn tập cắt chuyển hiệu lực ngày G — 2027-01-01')
        && cliBadDate.status !== 0
        && cliBadDate.stderr.includes('LỖI'),
      JSON.stringify({ badStatus: cliBadDate.status, mdLen: mdFile.length }),
    );
  } finally {
    for (const d of tmpDirs) {
      try {
        rmSync(d, { recursive: true, force: true });
      } catch { /* ignore */ }
    }
  }

  return { pass, fail };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { pass, fail } = chayTestDienTapNgayG();
  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}
