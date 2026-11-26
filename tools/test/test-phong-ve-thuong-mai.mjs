// Kiểm thử đơn vị & tích hợp cho Wave 37 — Lá chắn Phòng vệ thương mại (pvtm@1).
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT, napSo, LUOC_DO_PHIEN_BAN } from '../lib/registry.mjs';
import { docBieuThue } from '../lib/danh-muc.mjs';
import { kiemTra } from '../kiem-tra.mjs';
import { taoMayChuMcp } from '../mcp-server.mjs';
import {
  CHUAN_PVTM,
  LOAI_BIEN_PHAP_PVTM,
  TRANG_THAI_PVTM,
  VAI_TRO_QUYET_DINH_PVTM,
  docPhongVeThuongMai,
  kiemTraPhongVeThuongMai,
  dungPhongVeThuongMai,
  locPvtmTheoHsVaNgay,
} from '../lib/phong-ve-thuong-mai.mjs';

let pass = 0;
let fail = 0;
const t = (name, cond, extra = '') => {
  if (cond) { pass += 1; console.log(`PASS ${name}`); }
  else { fail += 1; console.log(`FAIL ${name} ${extra}`); }
};

const HEX64 = /^[0-9a-f]{64}$/;
const tmpDirs = [];

await (async () => {
  try {
    const so = napSo(ROOT);
    const bt = docBieuThue(ROOT);
    const pvtmDoc = docPhongVeThuongMai(ROOT);

    // 1. Đọc & kiểm chuẩn dữ liệu thật từ registry/phong-ve-thuong-mai.yaml
    t('docPhongVeThuongMai: đọc registry/phong-ve-thuong-mai.yaml hợp lệ (chuan_pvtm = pvtm@1, >= 20 vụ việc)',
      Boolean(pvtmDoc)
      && pvtmDoc.chuan_pvtm === CHUAN_PVTM
      && Array.isArray(pvtmDoc.vu_viec)
      && pvtmDoc.vu_viec.length >= 20
      && Object.isFrozen(LOAI_BIEN_PHAP_PVTM)
      && Object.isFrozen(TRANG_THAI_PVTM)
      && Object.isFrozen(VAI_TRO_QUYET_DINH_PVTM));

    const realErrs = kiemTraPhongVeThuongMai(pvtmDoc, so);
    t('kiemTraPhongVeThuongMai: dữ liệu thật đạt 0 lỗi, mọi so_hieu tồn tại trong so.theoKhoa',
      realErrs.length === 0,
      JSON.stringify(realErrs));

    // Đối chiếu 100% mã HS 8 số trong pvtm.yaml nằm trong nhu-cau/bieu-thue.json
    const allPvtmHs = pvtmDoc.vu_viec.flatMap((v) => v.ma_hs);
    const missingInBt = allPvtmHs.filter((h) => !bt.la.has(h));
    t('Đối chiếu biểu thuế: 100% mã HS trong registry/phong-ve-thuong-mai.yaml tồn tại trong nhu-cau/bieu-thue.json',
      allPvtmHs.length >= 180 && missingInBt.length === 0,
      JSON.stringify(missingInBt));

    // Kiểm tra vụ việc AD17 đã tích hợp quyết định rà soát mới 2927/QĐ-BCT (AR01.AD17 -> min 4.47%)
    const ad17 = pvtmDoc.vu_viec.find((v) => v.ma_vu_viec === 'AD17');
    t('Vụ việc AD17: gắn kết 143/QĐ-BCT + 2927/QĐ-BCT (AR01.AD17), dải thuế suất 4.47%–28%',
      Boolean(ad17)
      && ad17.dai_thue_suat_phan_tram.toi_thieu === 4.47
      && ad17.dai_thue_suat_phan_tram.toi_da === 28
      && ad17.chuoi_quyet_dinh.some((q) => q.so_hieu === '143/QĐ-BCT')
      && ad17.chuoi_quyet_dinh.some((q) => q.so_hieu === '2927/QĐ-BCT'));

    // 2. Kiểm tra bộ lọc lỗi đơn vị (negative cases)
    const sampleOk = {
      chuan_pvtm: 'pvtm@1',
      vu_viec: [
        {
          ma_vu_viec: 'AD17',
          loai_bien_phap: 'CHONG_BAN_PHA_GIA',
          ten_mat_hang: 'Cáp thép dự ứng lực',
          trang_thai: 'DANG_AP_DUNG',
          xuat_xu_bi_ap: ['MY', 'TH', 'CN'],
          ma_hs: ['73121091', '73121099'],
          dai_thue_suat_phan_tram: { toi_thieu: 4.47, toi_da: 28, ghi_chu: 'MY, TH, CN' },
          hieu_luc_tu: '2025-01-29',
          het_hieu_luc_tu: '2030-01-29',
          mien_tru_co_ban: true,
          chuoi_quyet_dinh: [{ so_hieu: '143/QĐ-BCT', vai_tro: 'CHINH_THUC' }],
          ghi_chu_phap_ly: 'Đang áp dụng theo QĐ 143/QĐ-BCT.',
        },
      ],
    };

    t('kiemTraPhongVeThuongMai: bắt lỗi sai chuan_pvtm, trùng ma_vu_viec, ISO-2 sai, ma_hs sai, toi_thieu > toi_da',
      kiemTraPhongVeThuongMai({ ...sampleOk, chuan_pvtm: 'sai@1' }, so).some((e) => e.includes('chuan_pvtm'))
      && kiemTraPhongVeThuongMai({ ...sampleOk, vu_viec: [sampleOk.vu_viec[0], sampleOk.vu_viec[0]] }, so).some((e) => e.includes('trùng ma_vu_viec'))
      && kiemTraPhongVeThuongMai({
        ...sampleOk,
        vu_viec: [{ ...sampleOk.vu_viec[0], xuat_xu_bi_ap: ['CHN'] }],
      }, so).some((e) => e.includes('ISO-2'))
      && kiemTraPhongVeThuongMai({
        ...sampleOk,
        vu_viec: [{ ...sampleOk.vu_viec[0], ma_hs: ['7312.10.91'] }],
      }, so).some((e) => e.includes('ma_hs'))
      && kiemTraPhongVeThuongMai({
        ...sampleOk,
        vu_viec: [{
          ...sampleOk.vu_viec[0],
          dai_thue_suat_phan_tram: { toi_thieu: 30, toi_da: 10, ghi_chu: 'ngược' },
        }],
      }, so).some((e) => e.includes('toi_thieu (30) > toi_da (10)')));

    t('kiemTraPhongVeThuongMai: bắt lỗi DANG_AP_DUNG chỉ gắn văn bản HET_HIEU_LUC, so_hieu lạ và lấn ranh giới hs-code-api',
      kiemTraPhongVeThuongMai({
        ...sampleOk,
        vu_viec: [{
          ...sampleOk.vu_viec[0],
          chuoi_quyet_dinh: [{ so_hieu: '691/QĐ-BCT', vai_tro: 'GIA_HAN' }],
        }],
      }, so).some((e) => e.includes('CON_HIEU_LUC'))
      && kiemTraPhongVeThuongMai({
        ...sampleOk,
        vu_viec: [{
          ...sampleOk.vu_viec[0],
          chuoi_quyet_dinh: [{ so_hieu: '99999/QĐ-BCT', vai_tro: 'CHINH_THUC' }],
        }],
      }, so).some((e) => e.includes('không tồn tại trong so.theoKhoa'))
      && kiemTraPhongVeThuongMai({
        ...sampleOk,
        vu_viec: [{ ...sampleOk.vu_viec[0], thue_mfn: 5 }],
      }, so).some((e) => e.includes('ranh giới hs-code-api')));

    // 3. Tích hợp kiemTra(mockSo, {}) vs kiemTra(so, { root: ROOT, kiemPvtm: true })
    const mockSo = {
      vanBan: [], loiDoc: [], cay: [], nutCay: [], coQuan: [], nguon: {}, theoKhoa: new Map(),
    };
    const mockRes = kiemTra(mockSo, {});
    const realRes = kiemTra(so, {
      root: ROOT,
      kiemPvtm: true,
      kiemFta: true,
      kiemChinhSachMoTa: false,
      kiemAnhXaAhtn: false,
      kiemSuaDoiDieu: false,
    });
    t('kiemTra: bỏ qua mockSo khi không truyền root, đạt 0 lỗi trên kho thật với 16 CSV PVTM + pvtm.yaml',
      mockRes.loi.length === 0 && realRes.loi.length === 0,
      JSON.stringify(realRes.loi));

    // 4. Kiểm hợp đồng đầu ra dungPhongVeThuongMai & locPvtmTheoHsVaNgay
    const built = dungPhongVeThuongMai(so, ROOT, '2026-11-26');
    const loaiCovered = new Set(built.vu_viec.map((v) => v.loai_bien_phap));
    const schemaItemsOk = built.vu_viec.every((v) =>
      v.id === `pvtm:${v.ma_vu_viec.toLowerCase()}`
      && HEX64.test(v.van)
      && LOAI_BIEN_PHAP_PVTM.includes(v.loai_bien_phap)
      && TRANG_THAI_PVTM.includes(v.trang_thai)
      && Array.isArray(v.xuat_xu_bi_ap)
      && v.xuat_xu_bi_ap.every((c) => /^[A-Z]{2}$/.test(c))
      && Array.isArray(v.ma_hs) && v.ma_hs.length > 0
      && Array.isArray(v.nut_bieu) && v.nut_bieu.length === v.ma_hs.length
      && v.nut_bieu.every((nb, i) => nb === `bieu:${v.ma_hs[i]}`)
      && typeof v.mien_tru_co_ban === 'boolean'
      && Array.isArray(v.chuoi_quyet_dinh) && v.chuoi_quyet_dinh.length > 0
      && v.chuoi_quyet_dinh.every((q) => Boolean(q.slug) && Boolean(q.nguon_a)));

    t('dungPhongVeThuongMai: khớp tuyệt đối lược đồ pvtm@1, đủ 4 loại biện pháp PVTM & nguồn bậc A',
      built.luoc_do_phien_ban === LUOC_DO_PHIEN_BAN
      && built.chuan_pvtm === 'pvtm@1'
      && built.lop_du_lieu === 'LUAT'
      && built.phien_ban === '2026-11-26'
      && built.tong_vu_viec === built.vu_viec.length
      && loaiCovered.size === 4
      && schemaItemsOk);

    // locPvtmTheoHsVaNgay: khớp chính xác 8 số, tiền tố 4/6 số và đối chiếu lịch sử theo tai_ngay
    const hitMdf8 = locPvtmTheoHsVaNgay(built, '44111200');
    const hitSugar4 = locPvtmTheoHsVaNgay(built, '1701');
    const hitHrc8 = locPvtmTheoHsVaNgay(built, '72082500');
    const hitHBeamNow = locPvtmTheoHsVaNgay(built, '72163311');
    const hitHBeam2025 = locPvtmTheoHsVaNgay(built, '72163311', '2025-06-01');
    const hitHBeamAfter = locPvtmTheoHsVaNgay(built, '72163311', '2026-05-01');
    let badDateThrew = false;
    try { locPvtmTheoHsVaNgay(built, '44111200', '2026-99-99'); } catch { badDateThrew = true; }

    t('locPvtmTheoHsVaNgay: khớp 8 số (44111200), tiền tố 4 số đường mía (3 vụ việc), thép cán nóng (AD20 + AC03.AD20) & lịch sử tai_ngay',
      hitMdf8.length === 1 && hitMdf8[0].ma_vu_viec === 'AD21'
      && hitSugar4.length === 3
      && hitHrc8.length === 2
      && hitHBeamNow.length === 0
      && hitHBeam2025.length === 1 && hitHBeam2025[0].ma_vu_viec === 'ER01.AD12'
      && hitHBeamAfter.length === 0
      && badDateThrew);

    // 5. Tích hợp CLI dung.mjs --out <tmp> + MCP server plhq_chinh_sach_theo_hs
    const tmpOut = mkdtempSync(join(tmpdir(), 'kb-w37-pvtm-'));
    tmpDirs.push(tmpOut);
    execFileSync('node', [join(ROOT, 'tools', 'dung.mjs'), '--out', tmpOut], { cwd: ROOT, encoding: 'utf8' });

    const distDir = join(tmpOut, 'dist');
    const pvtmBuf = readFileSync(join(distDir, 'pvtm.json'));
    const pvtmJson = JSON.parse(pvtmBuf.toString('utf8'));
    const manifest = JSON.parse(readFileSync(join(distDir, 'manifest.json'), 'utf8'));
    const pvtmSha = createHash('sha256').update(pvtmBuf).digest('hex');

    t('CLI tools/dung.mjs --out: xuất dist/pvtm.json và đăng ký vào manifest.json (10 tệp, lop_du_lieu LUAT)',
      pvtmJson.chuan_pvtm === 'pvtm@1'
      && manifest.tong_tep === 10
      && manifest.tep['pvtm.json']?.lop_du_lieu === 'LUAT'
      && manifest.tep['pvtm.json']?.sha256 === pvtmSha
      && manifest.tep['pvtm.json']?.bytes === pvtmBuf.length);

    const mcp = taoMayChuMcp({ distDir, root: ROOT });
    const mcpRes = await mcp.xuLyYeuCau({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'plhq_chinh_sach_theo_hs',
        arguments: { ma_hs: '73121091', tai_ngay: '2026-11-26' },
      },
    });
    const sc = mcpRes?.result?.structuredContent;
    const txt = mcpRes?.result?.content?.[0]?.text || '';

    t('MCP plhq_chinh_sach_theo_hs ("73121091"): đính phong_ve_thuong_mai (AD17, 4.47%–28%) + khối cảnh báo văn bản',
      !mcpRes?.result?.isError
      && Array.isArray(sc?.phong_ve_thuong_mai)
      && sc.phong_ve_thuong_mai.length === 1
      && sc.phong_ve_thuong_mai[0].ma_vu_viec === 'AD17'
      && sc.phong_ve_thuong_mai[0].dai_thue_suat_phan_tram.toi_thieu === 4.47
      && sc.ket_qua.some((k) => k.so_hieu === '143/QĐ-BCT' && k.loai_tac_dong === 'PHONG_VE_THUONG_MAI')
      && txt.includes('Cảnh báo Phòng vệ thương mại')
      && txt.includes('AD17')
      && txt.includes('4.47% – 28%'));
  } finally {
    for (const d of tmpDirs) {
      try { rmSync(d, { recursive: true, force: true }); } catch {}
    }
  }

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
