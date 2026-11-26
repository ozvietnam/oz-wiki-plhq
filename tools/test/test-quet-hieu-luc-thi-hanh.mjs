#!/usr/bin/env node
// Unit tests (100% offline) cho tools/lib/quet-hieu-luc-thi-hanh.mjs.
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import yaml from 'js-yaml';
import {
  chuanHoaSoHieuTrich,
  laNgayLichHopLe,
  quetHieuLucThiHanh,
  trichNgayHieuLucThiHanh,
  trichSoHieuVbqppl,
} from '../lib/quet-hieu-luc-thi-hanh.mjs';
import { napSo } from '../lib/registry.mjs';

function taoSoTam(root, docs = []) {
  const regDir = join(root, 'registry');
  const vbDir = join(regDir, 'van-ban');
  mkdirSync(vbDir, { recursive: true });
  writeFileSync(join(regDir, 'cay-xnk.yaml'), '- id: chua-phan-loai\n  ten: Chưa phân loại\n', 'utf8');
  writeFileSync(
    join(regDir, 'co-quan.yaml'),
    [
      '- ky_hieu: CP',
      '  ten: Chính phủ',
      '  tinh_trang: HOAT_DONG',
      '- ky_hieu: BTC',
      '  ten: Bộ Tài chính',
      '  tinh_trang: HOAT_DONG',
      '- ky_hieu: BCT',
      '  ten: Bộ Công Thương',
      '  tinh_trang: HOAT_DONG',
      '- ky_hieu: BYT',
      '  ten: Bộ Y tế',
      '  tinh_trang: HOAT_DONG',
      '',
    ].join('\n'),
    'utf8',
  );
  writeFileSync(
    join(regDir, 'nguon-uy-tin.yaml'),
    'A:\n  - ten_mien: congbao.chinhphu.vn\nB:\n  - ten_mien: thuvienphapluat.vn\nC:\n  - ten_mien: "*"\n',
    'utf8',
  );
  for (const { slug, data } of docs) {
    writeFileSync(join(vbDir, `${slug}.yaml`), yaml.dump(data, { lineWidth: -1, noRefs: true }), 'utf8');
  }
  return napSo(root);
}

export async function chayTestQuetHieuLucThiHanh() {
  let pass = 0;
  let fail = 0;
  const t = (name, cond, extra = '') => {
    if (cond) {
      pass += 1;
      console.log(`PASS [quet-hieu-luc] ${name}`);
    } else {
      fail += 1;
      console.error(`FAIL [quet-hieu-luc] ${name}${extra ? `: ${extra}` : ''}`);
    }
  };

  const tmpDirs = [];
  const makeTmp = (prefix = 'quet-hl-test-') => {
    const d = realpathSync(mkdtempSync(join(tmpdir(), prefix)));
    tmpDirs.push(d);
    return d;
  };

  try {
    // 1. Helper laNgayLichHopLe + chuanHoaSoHieuTrich + trichSoHieuVbqppl
    {
      t(
        'laNgayLichHopLe: chuẩn hóa YYYY-MM-DD và bác bỏ ngày lịch không tồn tại',
        laNgayLichHopLe(2026, 7, 5) === '2026-07-05'
          && laNgayLichHopLe(2024, 2, 29) === '2024-02-29'
          && laNgayLichHopLe(2026, 2, 31) === null,
      );

      const dsSh = trichSoHieuVbqppl(
        'Bãi bỏ Quyết định số 1182/QĐBCT ngày 06/4/2021, Thông tư 12/2018/TT- BCT, TTLT 01/2020/TTLT-BYT-BTC và Quyết định 31/2026/QD-TTG.',
      ).map((x) => x.so_hieu);
      t(
        'trichSoHieuVbqppl & chuanHoaSoHieuTrich: khôi phục gạch nối OCR, bỏ khoảng trắng thừa, bỏ qua ngày tháng',
        chuanHoaSoHieuTrich('25/2016/TTBNNPTNT') === '25/2016/TT-BNNPTNT'
          && dsSh.includes('1182/QĐ-BCT')
          && dsSh.includes('12/2018/TT-BCT')
          && dsSh.includes('01/2020/TTLT-BYT-BTC')
          && dsSh.includes('31/2026/QĐ-TTg')
          && dsSh.length === 4,
        JSON.stringify(dsSh),
      );
    }

    // 2. Phát hiện ngày hiệu lực thi hành (DD tháng MM năm YYYY, DD/MM/YYYY, DD-MM-YYYY, kể từ ngày ký)
    {
      const tmp = makeTmp('quet-hl-date-');
      const so = taoSoTam(tmp);

      const r1 = quetHieuLucThiHanh({
        vanBan: { so_hieu: '10/2026/TT-BTC', slug: '10-2026-tt-btc', hieu_luc_tu: null },
        dieuKhoanList: [
          { dieu: 1, noi_dung: 'Điều 1. Giấy phép cũ cấp từ ngày 01 tháng 02 năm 2020 tiếp tục dùng.' },
          { dieu: 2, noi_dung: 'Điều 2. Hiệu lực thi hành\n1. Thông tư này có hiệu lực thi hành kể từ ngày 15 tháng 8 năm 2026.' },
        ],
        so,
        root: tmp,
      });
      t(
        'hieu_luc_tu_goi_y: ưu tiên Điều Hiệu lực thi hành (DD tháng MM năm YYYY) và bật can_cap_nhat_hieu_luc_tu khi thiếu',
        r1.hieu_luc_tu_goi_y === '2026-08-15'
          && r1.can_cap_nhat_hieu_luc_tu === true
          && r1.co_canh_bao === true,
        JSON.stringify(r1),
      );

      const r2 = quetHieuLucThiHanh({
        vanBan: { so_hieu: '11/2026/TT-BTC', slug: '11-2026-tt-btc', hieu_luc_tu: '2026-08-01' },
        dieuKhoanList: [
          { dieu: 4, noi_dung: 'Điều 4. Điều khoản thi hành\nThông tư này có hiệu lực từ ngày 05/09/2026.' },
        ],
        so,
        root: tmp,
      });
      t(
        'hieu_luc_tu_goi_y: bắt định dạng DD/MM/YYYY và cảnh báo khi lệch hieu_luc_tu trong YAML',
        r2.hieu_luc_tu_goi_y === '2026-09-05' && r2.can_cap_nhat_hieu_luc_tu === true,
      );

      const r3 = trichNgayHieuLucThiHanh({
        vanBan: { so_hieu: '24/2026/NĐ-CP', ngay_ban_hanh: '2026-03-18' },
        dieuKhoanList: [
          { dieu: 4, noi_dung: 'Điều 4. Hiệu lực thi hành Nghị định này có hiệu lực thi hành kể từ ngày ký ban hành.' },
        ],
      });
      const r4 = trichNgayHieuLucThiHanh({
        vanBan: { so_hieu: '25/2026/NĐ-CP' },
        rawText: 'Quyết định này có hiệu lực kể từ ngày 01-11-2026.',
      });
      t(
        'hieu_luc_tu_goi_y: hỗ trợ "kể từ ngày ký (ban hành)" theo ngay_ban_hanh và DD-MM-YYYY trên rawText',
        r3 === '2026-03-18' && r4 === '2026-11-01',
        JSON.stringify({ r3, r4 }),
      );
    }

    // 3. Quét thay thế / bãi bỏ / hết hiệu lực / ngưng hiệu lực & cờ can_cat_hieu_luc
    {
      const tmp = makeTmp('quet-hl-repeal-');
      const so = taoSoTam(tmp, [
        {
          slug: '32-2017-tt-bct',
          data: {
            so_hieu: '32/2017/TT-BCT',
            loai: 'THONG_TU',
            ten: 'Thông tư hướng dẫn Luật Hóa chất',
            tinh_trang: 'CON_HIEU_LUC',
          },
        },
        {
          slug: '17-2022-tt-bct',
          data: {
            so_hieu: '17/2022/TT-BCT',
            loai: 'THONG_TU',
            ten: 'Thông tư sửa đổi 32/2017/TT-BCT',
            tinh_trang: 'CON_HIEU_LUC',
            het_hieu_luc_tu: '2026-07-01',
          },
        },
        {
          slug: '10-2015-tt-bct',
          data: {
            so_hieu: '10/2015/TT-BCT',
            loai: 'THONG_TU',
            ten: 'Thông tư cũ đã hết hiệu lực',
            tinh_trang: 'HET_HIEU_LUC',
            het_hieu_luc_tu: '2020-01-01',
          },
        },
        {
          slug: '113-2017-nd-cp',
          data: {
            so_hieu: '113/2017/NĐ-CP',
            loai: 'NGHI_DINH',
            ten: 'Nghị định hướng dẫn Luật Hóa chất',
            tinh_trang: 'CON_HIEU_LUC',
          },
        },
      ]);

      const res = quetHieuLucThiHanh({
        vanBan: {
          so_hieu: '01/2026/TT-BCT',
          loai: 'THONG_TU',
          slug: '01-2026-tt-bct',
          hieu_luc_tu: '2026-07-01',
        },
        dieuKhoanList: [
          {
            dieu: 2,
            noi_dung:
              'Điều 2. Áp dụng Nghị định số 113/2017/NĐ-CP. Trong trường hợp các văn bản quy phạm pháp luật viện dẫn trong Thông tư này được sửa đổi, bổ sung hoặc thay thế thì thực hiện theo văn bản mới.',
          },
          {
            dieu: 12,
            noi_dung: [
              'Điều 12. Hiệu lực thi hành',
              '1. Thông tư này có hiệu lực thi hành kể từ ngày 01 tháng 7 năm 2026.',
              '2. Thông tư số 32/2017/TT-BCT ngày 28 tháng 12 năm 2017 của Bộ trưởng Bộ Công Thương hướng dẫn Nghị định số 113/2017/NĐ-CP và Thông tư số 17/2022/TT-BCT ngày 27 tháng 10 năm 2022 của Bộ trưởng Bộ Công Thương sửa đổi, bổ sung một số điều của Thông tư số 32/2017/TT-BCT hết hiệu lực kể từ ngày Thông tư này có hiệu lực thi hành.',
              '3. Bãi bỏ Thông tư số 10/2015/TT-BCT và Quyết định số 999/QĐ-BCT; tạm ngưng hiệu lực Thông tư số 88/2024/TT-BCT.',
              '4. Tự nhắc lại Thông tư số 01/2026/TT-BCT không được tự bắt chính mình.',
            ].join('\n'),
          },
        ],
        so,
        root: tmp,
      });

      const bySh = new Map(res.thay_the_bai_bo.map((x) => [x.so_hieu, x]));
      t(
        'thay_the_bai_bo: bắt đúng VB bị thay/bãi/ngưng, loại trừ bản thân & VB cấp trên (NĐ-CP) & câu dẫn chiếu chung',
        bySh.size === 5
          && !bySh.has('01/2026/TT-BCT')
          && !bySh.has('113/2017/NĐ-CP')
          && bySh.get('32/2017/TT-BCT')?.can_cat_hieu_luc === true
          && bySh.get('32/2017/TT-BCT')?.pham_vi === 'toan_bo'
          && bySh.get('32/2017/TT-BCT')?.slug_dich === '32-2017-tt-bct'
          && bySh.get('17/2022/TT-BCT')?.can_cat_hieu_luc === false
          && bySh.get('10/2015/TT-BCT')?.loai_tac_dong === 'bai_bo'
          && bySh.get('10/2015/TT-BCT')?.can_cat_hieu_luc === false
          && bySh.get('999/QĐ-BCT')?.co_trong_so === false
          && bySh.get('88/2024/TT-BCT')?.loai_tac_dong === 'ngung_hieu_luc',
        JSON.stringify(res.thay_the_bai_bo),
      );
    }

    // 4. Quét sửa đổi, bổ sung cấp Điều & kiểm tra tồn tại data/sua-doi-dieu/<slug>.json
    {
      const tmp = makeTmp('quet-hl-amend-');
      const so = taoSoTam(tmp, [
        {
          slug: '38-2015-tt-btc',
          data: {
            so_hieu: '38/2015/TT-BTC',
            loai: 'THONG_TU',
            ten: 'Thông tư thủ tục hải quan',
            tinh_trang: 'CON_HIEU_LUC',
          },
        },
        {
          slug: '39-2018-tt-btc',
          data: {
            so_hieu: '39/2018/TT-BTC',
            loai: 'THONG_TU',
            ten: 'Thông tư sửa đổi 38/2015',
            tinh_trang: 'CON_HIEU_LUC',
          },
        },
      ]);

      const vbSuaDoi = {
        so_hieu: '86/2026/TT-BTC',
        loai: 'THONG_TU',
        slug: '86-2026-tt-btc',
        ten: 'Thông tư sửa đổi, bổ sung một số điều của Thông tư số 38/2015/TT-BTC',
        hieu_luc_tu: '2026-10-01',
      };
      const clauses = [
        {
          dieu: 1,
          noi_dung:
            'Điều 1. Sửa đổi, bổ sung Điều 16 của Thông tư số 38/2015/TT-BTC (đã được sửa đổi, bổ sung một số điều tại Thông tư số 39/2018/TT-BTC) như sau: ...',
        },
        {
          dieu: 2,
          noi_dung:
            'Điều 2. Thay thế cụm từ “Chi cục Hải quan” tại khoản 2 Điều 20 Thông tư số 38/2015/TT-BTC bằng cụm từ “Hải quan cửa khẩu”.',
        },
        {
          dieu: 3,
          noi_dung: 'Điều 3. Hiệu lực thi hành kể từ ngày 01 tháng 10 năm 2026.',
        },
      ];

      const beforeJson = quetHieuLucThiHanh({ vanBan: vbSuaDoi, dieuKhoanList: clauses, so, root: tmp });
      t(
        'sua_doi_bo_sung: phát hiện đúng đích 38/2015/TT-BTC, bỏ mệnh đề bị động (39/2018), báo chua_co_do_thi_sua_doi=true và không đưa "thay thế cụm từ" vào thay_the_bai_bo',
        beforeJson.sua_doi_bo_sung.length === 1
          && beforeJson.sua_doi_bo_sung[0].so_hieu === '38/2015/TT-BTC'
          && beforeJson.sua_doi_bo_sung[0].chua_co_do_thi_sua_doi === true
          && beforeJson.thay_the_bai_bo.length === 0
          && beforeJson.co_canh_bao === true,
        JSON.stringify(beforeJson),
      );

      mkdirSync(join(tmp, 'data', 'sua-doi-dieu'), { recursive: true });
      writeFileSync(join(tmp, 'data', 'sua-doi-dieu', '86-2026-tt-btc.json'), '{"tac_dong":[]}\n', 'utf8');
      const afterJson = quetHieuLucThiHanh({ vanBan: vbSuaDoi, dieuKhoanList: clauses, so, root: tmp });
      t(
        'sua_doi_bo_sung: khi data/sua-doi-dieu/<slug>.json đã có trên đĩa -> chua_co_do_thi_sua_doi=false và tắt co_canh_bao',
        afterJson.sua_doi_bo_sung.length === 1
          && afterJson.sua_doi_bo_sung[0].chua_co_do_thi_sua_doi === false
          && afterJson.co_canh_bao === false,
        JSON.stringify(afterJson),
      );
    }

    // 5. Tín hiệu phụ lục chuyên ngành: DANH_MUC_HS, HOA_CHAT_CAS, XUAT_XU_FTA
    {
      const tmp = makeTmp('quet-hl-appendix-');
      const so = taoSoTam(tmp);

      const resAll = quetHieuLucThiHanh({
        vanBan: {
          so_hieu: '77/2026/TT-BCT',
          loai: 'THONG_TU',
          slug: '77-2026-tt-bct',
          ten: 'Quy định quy tắc xuất xứ hàng hóa trong Hiệp định EVFTA và danh mục hóa chất kèm mã số HS',
          hieu_luc_tu: '2026-12-01',
        },
        dieuKhoanList: [
          {
            dieu: 1,
            noi_dung:
              'Điều 1. Ban hành Phụ lục I Danh mục hàng hóa (mã HS 2807.00.00, số CAS 7664-93-9) áp dụng C/O Mẫu EUR.1 theo Hiệp định EVFTA.',
          },
          {
            dieu: 2,
            noi_dung: 'Điều 2. Hiệu lực thi hành kể từ ngày 01 tháng 12 năm 2026.',
          },
        ],
        so,
        root: tmp,
      });

      const loaiSet = new Set(resAll.tin_hieu_phu_luc.map((x) => x.loai));
      t(
        'tin_hieu_phu_luc: phát hiện đồng thời DANH_MUC_HS, HOA_CHAT_CAS và XUAT_XU_FTA',
        loaiSet.has('DANH_MUC_HS')
          && loaiSet.has('HOA_CHAT_CAS')
          && loaiSet.has('XUAT_XU_FTA')
          && resAll.co_canh_bao === true,
        JSON.stringify(resAll.tin_hieu_phu_luc),
      );

      // Khi danh-muc/<slug>.csv đã tồn tại thì không báo lặp DANH_MUC_HS
      mkdirSync(join(tmp, 'danh-muc'), { recursive: true });
      writeFileSync(join(tmp, 'danh-muc', '77-2026-tt-bct.csv'), 'ma_hs,ten_hang\n28070000,Axit sunfuric\n', 'utf8');
      const resWithCsv = quetHieuLucThiHanh({
        vanBan: {
          so_hieu: '77/2026/TT-BCT',
          loai: 'THONG_TU',
          slug: '77-2026-tt-bct',
          ten: 'Danh mục hàng hóa kèm mã số HS',
          hieu_luc_tu: '2026-12-01',
        },
        dieuKhoanList: [
          { dieu: 1, noi_dung: 'Điều 1. Ban hành Phụ lục Danh mục mã số hàng hóa 8471.30.20.' },
        ],
        so,
        root: tmp,
      });
      t(
        'tin_hieu_phu_luc: ẩn cảnh báo DANH_MUC_HS khi danh-muc/<slug>.csv đã có trên đĩa',
        !resWithCsv.tin_hieu_phu_luc.some((x) => x.loai === 'DANH_MUC_HS')
          && resWithCsv.co_canh_bao === false,
        JSON.stringify(resWithCsv),
      );
    }
  } finally {
    for (const d of tmpDirs) rmSync(d, { recursive: true, force: true });
  }

  console.log(`Tổng (quet-hieu-luc-thi-hanh): ${pass} PASS, ${fail} FAIL`);
  return { pass, fail };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { fail } = await chayTestQuetHieuLucThiHanh();
  if (fail > 0) process.exit(1);
}
