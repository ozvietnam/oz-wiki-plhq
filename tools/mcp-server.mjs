#!/usr/bin/env node
// Cổng MCP (Model Context Protocol) qua stdio — thuần Node.js (0 dependency mới).
// Hỗ trợ JSON-RPC 2.0 chuẩn MCP 2024-11-05 / 2025-03-26 và cả 2 framing stdio:
//   1. Newline-delimited JSON ({...}\n)
//   2. Content-Length: N\r\n\r\n<body>
import { realpathSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { LUOC_DO_PHIEN_BAN } from './lib/registry.mjs';
import { chuanHoaTaiNgay } from './lib/hieu-luc-theo-ngay.mjs';
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

export const CAC_PHIEN_BAN_GIAO_THUC = ['2025-03-26', '2024-11-05'];
export const PHIEN_BAN_MAC_DINH = '2025-03-26';

export const LOI_PARSE = -32700;
export const LOI_YEU_CAU = -32600;
export const LOI_PHUONG_THUC = -32601;
export const LOI_THAM_SO = -32602;
export const LOI_NOI_BO = -32603;

const CHI_DAN_RANH_GIOI_HS =
  'Ranh giới 0% trùng lặp với hs-code-api: oz-wiki-plhq chỉ cung cấp hiệu lực & quan hệ VBQPPL, điều khoản pháp lý 2 tầng, wiki nghiệp vụ PLHQ, phụ lục HS đã biết và danh mục hóa chất CAS; không phân loại/áp mã HS, không giải thích 6 quy tắc GIR hay chú giải HS WCO/AHTN, không tính thuế suất và không tra tiền lệ phân loại.';

const CHAN_TRANG_CHUAN = `---\n${GHI_NGUON_CC_BY}\n${MIEN_TRU_PHAP_LY}`;

function laObjectThuong(val) {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

function laChuoiKhongRong(val) {
  return typeof val === 'string' && val.trim().length > 0;
}

function chuanSoNguyenDuong(val, tenTruong, { choPhepKhong = false } = {}) {
  if (val === undefined || val === null || val === '') return { hopLe: true, giaTri: undefined };
  const n = typeof val === 'number' ? val : Number(val);
  const min = choPhepKhong ? 0 : 1;
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < min) {
    return {
      hopLe: false,
      loi: `Tham số "${tenTruong}" phải là số nguyên ${choPhepKhong ? '>= 0' : '>= 1'}.`,
    };
  }
  return { hopLe: true, giaTri: n };
}

function taoKetQuaJsonRpc(id, result) {
  return { jsonrpc: '2.0', id, result };
}

function taoLoiJsonRpc(id, code, message, data) {
  return {
    jsonrpc: '2.0',
    id: id === undefined ? null : id,
    error: {
      code,
      message,
      ...(data !== undefined ? { data } : {}),
    },
  };
}

function taoPhanHoiCongCu(text, structuredContent, isError = false) {
  const payload = laObjectThuong(structuredContent)
    ? {
        ...structuredContent,
        ghi_nguon: structuredContent.ghi_nguon || GHI_NGUON_CC_BY,
        mien_tru: structuredContent.mien_tru || MIEN_TRU_PHAP_LY,
      }
    : {
        ket_qua: structuredContent,
        ghi_nguon: GHI_NGUON_CC_BY,
        mien_tru: MIEN_TRU_PHAP_LY,
      };
  const body = String(text || '').trim();
  const fullText = body.includes(GHI_NGUON_CC_BY) ? body : `${body}\n\n${CHAN_TRANG_CHUAN}`;
  return {
    content: [{ type: 'text', text: fullText }],
    structuredContent: payload,
    ...(isError ? { isError: true } : {}),
  };
}

function taoLoiCongCu(toolName, reason) {
  return taoPhanHoiCongCu(
    `Lỗi tham số công cụ \`${toolName}\`: ${reason}`,
    { ok: false, cong_cu: toolName, loi: reason },
    true,
  );
}

/** Danh sách 6 công cụ MCP chỉ đọc phục vụ tra cứu PLHQ. */
export function TAO_DANH_SACH_CONG_CU() {
  const ro = {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  };
  return [
    {
      name: 'plhq_tra_hieu_luc',
      description:
        'Tra cứu tình trạng hiệu lực hiện tại, ngày ban hành/hiệu lực/hết hiệu lực, chuỗi quan hệ thay thế/sửa đổi/bãi bỏ/hướng dẫn, mức xác minh và nguồn bậc A của văn bản pháp luật XNK theo số hiệu.',
      inputSchema: {
        type: 'object',
        properties: {
          so_hieu: {
            type: 'string',
            description: 'Số hiệu văn bản cần tra (ví dụ: "38/2015/TT-BTC", "85/2026/TT-BTC", "24/2026/NĐ-CP").',
          },
          tai_ngay: {
            type: 'string',
            pattern: '^\\d{4}-\\d{2}-\\d{2}$',
            description: 'Ngày đối chiếu hiệu lực YYYY-MM-DD (ví dụ ngày đăng ký tờ khai). Bỏ trống để tra theo hiện hành.',
          },
        },
        required: ['so_hieu'],
      },
      annotations: { ...ro },
    },
    {
      name: 'plhq_tra_dieu_khoan',
      description:
        'Tra cứu điều khoản pháp luật tách tuyệt đối 2 tầng: NGUYEN_VAN_NGUON_A (đã đối chiếu PDF & SHA-256, dùng làm căn cứ trích dẫn) và TOM_TAT_NHAP (chỉ dùng định vị điều luật, da_soat: false).',
      inputSchema: {
        type: 'object',
        properties: {
          so_hieu: {
            type: 'string',
            description: 'Số hiệu văn bản (ví dụ: "85/2026/TT-BTC").',
          },
          dieu: {
            type: ['string', 'number'],
            description: 'Số điều cần lọc (ví dụ: 6 hoặc "6").',
          },
          khoan: {
            type: ['string', 'number'],
            description: 'Số khoản cần lọc (ví dụ: 1 hoặc "1").',
          },
          diem: {
            type: 'string',
            description: 'Điểm cần lọc (ví dụ: "a", "b").',
          },
          tu_khoa: {
            type: 'string',
            description: 'Từ khóa tìm trong điều khoản (hỗ trợ tìm không dấu).',
          },
          chi_nguyen_van: {
            type: 'boolean',
            description: 'Nếu true, chỉ trả kết quả thuộc tầng NGUYEN_VAN_NGUON_A.',
          },
          tai_ngay: {
            type: 'string',
            pattern: '^\\d{4}-\\d{2}-\\d{2}$',
            description: 'Ngày đối chiếu hiệu lực YYYY-MM-DD để lọc lịch sử sửa đổi/bãi bỏ cấp điều tại ngày đó.',
          },
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            description: 'Số kết quả tối đa (mặc định 15).',
          },
        },
        required: [],
      },
      annotations: { ...ro },
    },
    {
      name: 'plhq_hoi_phap_luat',
      description:
        'Hỏi đáp nghiệp vụ pháp luật hải quan & XNK trên wiki và điều khoản NGUYEN_VAN_NGUON_A kèm cảnh báo hiệu lực văn bản liên quan. Tự động chuyển hướng sang hs-code-api nếu câu hỏi về phân loại/áp mã HS, 6 quy tắc GIR, chú giải HS hoặc thuế suất.',
      inputSchema: {
        type: 'object',
        properties: {
          cau_hoi: {
            type: 'string',
            description: 'Câu hỏi pháp luật hải quan / XNK cần tra cứu.',
          },
          nhanh: {
            type: 'string',
            description: 'Lọc theo nhánh cây XNK (ví dụ: "hai-quan/thu-tuc").',
          },
          tai_ngay: {
            type: 'string',
            pattern: '^\\d{4}-\\d{2}-\\d{2}$',
            description: 'Ngày đối chiếu hiệu lực YYYY-MM-DD (ví dụ ngày đăng ký tờ khai) để phân hạng văn bản theo hiệu lực tại ngày đó.',
          },
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 50,
            description: 'Số kết quả tối đa (mặc định 8).',
          },
        },
        required: ['cau_hoi'],
      },
      annotations: { ...ro },
    },
    {
      name: 'plhq_tra_cas',
      description:
        'Tra cứu danh mục hóa chất theo mã CAS, tên hóa chất hoặc công thức hóa học (ví dụ Nghị định 24/2026/NĐ-CP), gồm cả danh mục không có mã CAS cố định.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Mã CAS (ví dụ: "106-99-0"), tên chất hoặc công thức hóa học.',
          },
          phu_luc: {
            type: 'string',
            description: 'Lọc theo phụ lục ("I", "II", "III", "IV").',
          },
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            description: 'Số kết quả tối đa (mặc định 20).',
          },
        },
        required: ['query'],
      },
      annotations: { ...ro },
    },
    {
      name: 'plhq_chinh_sach_theo_hs',
      description:
        'Tra cứu văn bản quản lý chuyên ngành, kiểm tra chất lượng, giấy phép, cấm XNK cho mã HS 4/6/8 số ĐÃ BIẾT. Không thực hiện phân loại mã HS hay tính thuế suất (thuộc hs-code-api).',
      inputSchema: {
        type: 'object',
        properties: {
          ma_hs: {
            type: 'string',
            description: 'Mã HS đã biết (4, 6 hoặc 8 chữ số, ví dụ: "3808", "84148099").',
          },
          tai_ngay: {
            type: 'string',
            pattern: '^\\d{4}-\\d{2}-\\d{2}$',
            description: 'Ngày đối chiếu hiệu lực YYYY-MM-DD (ví dụ ngày đăng ký tờ khai) cho các văn bản quản lý chuyên ngành.',
          },
          limit: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            description: 'Số kết quả tối đa (mặc định 25).',
          },
        },
        required: ['ma_hs'],
      },
      annotations: { ...ro },
    },
    {
      name: 'plhq_sap_het_hieu_luc',
      description:
        'Liệt kê các văn bản pháp luật XNK có ngày hết hiệu lực (het_hieu_luc_tu) trong N ngày tới, sắp xếp tăng dần theo ngày hết hiệu lực.',
      inputSchema: {
        type: 'object',
        properties: {
          trong_so_ngay: {
            type: 'integer',
            minimum: 0,
            maximum: 3650,
            description: 'Số ngày tới cần kiểm tra (mặc định 60).',
          },
          hom_nay: {
            type: 'string',
            description: 'Ngày mốc YYYY-MM-DD (mặc định theo ngày phiên bản kho hoặc hôm nay).',
          },
        },
        required: [],
      },
      annotations: { ...ro },
    },
  ];
}

/** Danh sách 2 tài nguyên MCP chỉ đọc. */
export function TAO_DANH_SACH_TAI_NGUYEN() {
  return [
    {
      uri: 'plhq://meta/luoc-do',
      name: 'Metadata lược đồ & thống kê kho oz-wiki-plhq',
      description:
        'Phiên bản lược đồ dữ liệu, số lượng văn bản, thống kê 2 tầng điều khoản (NGUYEN_VAN_NGUON_A vs TOM_TAT_NHAP), giấy phép CC BY 4.0 và ranh giới với hs-code-api.',
      mimeType: 'application/json',
    },
    {
      uri: 'plhq://bao-cao/sap-het-hieu-luc',
      name: 'Văn bản sắp hết hiệu lực trong 60 ngày tới',
      description:
        'Danh sách văn bản có ngày hết hiệu lực trong vòng <= 60 ngày, phục vụ rà soát kịp thời văn bản thay thế.',
      mimeType: 'application/json',
    },
    {
      uri: 'plhq://huong-dan/quy-trinh-agent',
      name: 'Quy trình chuẩn cho Agent & ozplugin (2 bước xác minh hiệu lực + trích dẫn nguồn A)',
      description:
        'Hướng dẫn thao tác chuẩn cho ozplugin và AI Agent: tham số tai_ngay, quy trình 2 bước nguồn bậc A, đồ thị sửa đổi cấp Điều, 2 tuyến hiệu lực, cổng OOS và ranh giới 0% hs-code-api.',
      mimeType: 'text/markdown',
    },
  ];
}

function dinhDangQuanHe(label, ds) {
  if (!Array.isArray(ds) || !ds.length) return null;
  const items = ds.map((x) => {
    if (typeof x === 'string') return x;
    const so = x.tu || x.so_hieu || '?';
    const extra = [x.pham_vi ? `phạm vi: ${x.pham_vi}` : '', x.tu_ngay ? `từ ${x.tu_ngay}` : '', x.can_cu || '']
      .filter(Boolean)
      .join('; ');
    return extra ? `${so} (${extra})` : so;
  });
  return `- ${label}: ${items.join(', ')}`;
}

function dinhDangTraHieuLuc(res) {
  if (!res || res.tim_thay === false || (!res.van_ban && !res.so_hieu)) {
    const goiY = Array.isArray(res?.goi_y) && res.goi_y.length
      ? `\nGợi ý gần khớp: ${res.goi_y.map((g) => (typeof g === 'string' ? g : `${g.so_hieu}${g.tinh_trang ? ` (${g.tinh_trang})` : ''}`)).join(', ')}`
      : '';
    return `Không tìm thấy văn bản khớp chính xác trong sổ đăng ký.${goiY}`;
  }
  const vb = res.van_ban || res;
  const lines = [
    `## Hiệu lực văn bản: ${vb.so_hieu || res.so_hieu || '?'}`,
    res.khop_qua_so_hieu_khac ? `- Khớp qua \`so_hieu_khac\`: ${res.truy_van} → ${vb.so_hieu}` : '',
    vb.ten ? `- Tên: ${vb.ten}` : '',
    vb.co_quan ? `- Cơ quan ban hành: ${vb.co_quan}${vb.co_quan_ten ? ` (${vb.co_quan_ten})` : ''}` : '',
    `- Tình trạng: **${vb.tinh_trang || 'CHUA_XAC_MINH'}**`,
    res.tai_ngay
      ? `- Hiệu lực tại ngày **${res.tai_ngay}**: **${res.tinh_trang_tai_ngay}**${res.do_chinh_xac_ngay ? ` (${res.do_chinh_xac_ngay})` : ''}`
      : '',
    vb.ngay_ban_hanh ? `- Ngày ban hành: ${vb.ngay_ban_hanh}` : '',
    vb.hieu_luc_tu ? `- Hiệu lực từ: ${vb.hieu_luc_tu}` : '',
    vb.het_hieu_luc_tu ? `- Hết hiệu lực từ: ${vb.het_hieu_luc_tu}` : '',
  ].filter(Boolean);

  const daDoiChieu = res.xac_minh?.hieu_luc_da_doi_chieu ?? vb.xac_minh?.hieu_luc_da_doi_chieu;
  const muc = res.xac_minh?.muc ?? vb.xac_minh?.muc;
  lines.push(`- Mức xác minh: ${muc || 'CHUA_XAC_MINH'} (đã đối chiếu nguồn A: ${daDoiChieu === true ? 'có' : 'chưa'})`);
  const canhBaoXacMinh = res.xac_minh?.canh_bao || res.canh_bao;
  if (canhBaoXacMinh) {
    lines.push(`- Cảnh báo: ${canhBaoXacMinh}`);
  } else if (daDoiChieu !== true) {
    lines.push('- Cảnh báo xác minh: Tình trạng hiệu lực chưa được đối chiếu nguồn bậc A — cần kiểm tra lại văn bản gốc.');
  }

  const nguonA = Array.isArray(res.nguon_bac_a) ? res.nguon_bac_a : (res.nguon_a ? [res.nguon_a] : []);
  if (nguonA.length) {
    lines.push(`- Nguồn bậc A: ${nguonA.map((n) => (typeof n === 'string' ? n : n.url)).filter(Boolean).join(' | ')}`);
  }

  const qh = res.quan_he || vb.quan_he || {};
  const qhn = res.quan_he_nguoc || vb.quan_he_nguoc || {};
  for (const [k, label] of [
    ['thay_the', 'Thay thế'],
    ['sua_doi', 'Sửa đổi'],
    ['bai_bo', 'Bãi bỏ'],
    ['tam_ngung', 'Tạm ngưng'],
    ['huong_dan', 'Hướng dẫn'],
    ['hop_nhat', 'Hợp nhất'],
  ]) {
    const line = dinhDangQuanHe(label, qh[k]);
    if (line) lines.push(line);
  }
  for (const [k, label] of [
    ['bi_thay_the_boi', 'Bị thay thế bởi'],
    ['bi_sua_doi_boi', 'Bị sửa đổi bởi'],
    ['bi_bai_bo_boi', 'Bị bãi bỏ bởi'],
    ['bi_tam_ngung_boi', 'Bị tạm ngưng bởi'],
    ['duoc_huong_dan_boi', 'Được hướng dẫn bởi'],
    ['duoc_hop_nhat_boi', 'Được hợp nhất bởi'],
  ]) {
    const line = dinhDangQuanHe(label, qhn[k]);
    if (line) lines.push(line);
  }
  const chuoiTien = res.chuoi_quan_he?.thay_the_boi_chuoi || [];
  if (chuoiTien.length) {
    lines.push(
      `- Chuỗi thay thế/bãi bỏ tiến: ${chuoiTien.map((c) => `${c.tu} -> ${c.van_ban_moi} (${c.tinh_trang || '?'})`).join(' ; ')}`,
    );
  }
  return lines.join('\n');
}

function dinhDangTraDieuKhoan(res) {
  const dsA = Array.isArray(res?.nguyen_van_nguon_a) ? res.nguyen_van_nguon_a : [];
  const dsNhap = Array.isArray(res?.tom_tat_nhap) ? res.tom_tat_nhap : [];
  const lines = ['## Kết quả tra cứu điều khoản (tách 2 tầng tin cậy)'];
  if (res?.tai_ngay) lines.push(`- Ngày đối chiếu hiệu lực: **${res.tai_ngay}**`);

  if (dsA.length) {
    lines.push('', `### Tầng 1 — NGUYEN_VAN_NGUON_A (${dsA.length} mục, dùng làm căn cứ trích dẫn)`);
    for (const item of dsA) {
      const viTri = [
        item.dieu !== undefined && item.dieu !== null ? `Điều ${item.dieu}` : '',
        item.khoan !== undefined && item.khoan !== null ? `Khoản ${item.khoan}` : '',
        item.diem ? `Điểm ${item.diem}` : '',
      ].filter(Boolean).join(', ');
      const refPdf = [
        item.trang_pdf ? `trang PDF ${item.trang_pdf}` : '',
        item.sha256_pdf ? `sha256: ${String(item.sha256_pdf).slice(0, 12)}…` : '',
      ].filter(Boolean).join(', ');
      const trangThaiTag = item.trang_thai_dieu && item.trang_thai_dieu !== 'NGUYEN_BAN'
        ? ` [${item.trang_thai_dieu}]`
        : '';
      lines.push(
        `- **[${item.so_hieu || '?'}]** ${viTri || 'Mục'}${item.tinh_trang ? ` (${item.tinh_trang})` : ''}${trangThaiTag}${refPdf ? ` [${refPdf}]` : ''}: ${item.noi_dung || ''}`,
      );
      if (item.canh_bao_sua_doi) lines.push(`  Cảnh báo sửa đổi: ${item.canh_bao_sua_doi}`);
      if (item.nguon_a) lines.push(`  Nguồn A: ${item.nguon_a}`);
    }
  } else {
    lines.push('', '### Tầng 1 — NGUYEN_VAN_NGUON_A: Không có mục khớp');
  }

  if (dsNhap.length) {
    lines.push(
      '',
      `### Tầng 2 — TOM_TAT_NHAP (${dsNhap.length} mục, da_soat: false — CHỈ dùng định vị điều luật, KHÔNG trích làm căn cứ pháp lý)`,
    );
    if (res.canh_bao_tang_nhap) lines.push(`> Cảnh báo: ${res.canh_bao_tang_nhap}`);
    for (const item of dsNhap) {
      const tenMuc = [item.dieu, item.ten].filter(Boolean).join(' — ');
      lines.push(
        `- **[${item.so_hieu || item.slug || '?'}]** ${tenMuc || 'Điều khoản'}${item.tinh_trang ? ` (${item.tinh_trang})` : ''} [da_soat: false]: ${item.tom_tat || ''}`,
      );
      if (Array.isArray(item.nghia_vu_xnk) && item.nghia_vu_xnk.length) {
        lines.push(`  Nghĩa vụ XNK (nháp): ${item.nghia_vu_xnk.join('; ')}`);
      }
      if (item.luu_y) lines.push(`  Lưu ý: ${item.luu_y}`);
      if (item.nguon_a) lines.push(`  Đối chiếu nguồn A: ${item.nguon_a}`);
    }
  }

  if (!dsA.length && !dsNhap.length) {
    lines.push('', 'Không tìm thấy điều khoản phù hợp với tiêu chí tra cứu.');
  }
  return lines.join('\n');
}

function dinhDangHoiPhapLuat(res) {
  if (res?.chuyen_huong) {
    return [
      '## Chuyển hướng sang hệ thống chuyên trách (`hs-code-api`)',
      `- Lý do: ${res.chuyen_huong.ly_do || 'Câu hỏi thuộc phạm vi phân loại mã HS / GIR / biểu thuế.'}`,
      `- Hệ thống tiếp nhận: **${res.chuyen_huong.he_thong || 'hs-code-api'}**`,
      '- Ranh giới: `oz-wiki-plhq` không phân loại mã HS, không giải thích quy tắc GIR và không tính thuế suất.',
    ].join('\n');
  }

  const ketQua = Array.isArray(res?.ket_qua) ? res.ket_qua : [];
  const dieuKhoanA = Array.isArray(res?.dieu_khoan_nguon_a) ? res.dieu_khoan_nguon_a : [];
  const dieuKhoanNhap = Array.isArray(res?.dieu_khoan_tom_tat_nhap) ? res.dieu_khoan_tom_tat_nhap : [];
  const lines = [`## Kết quả hỏi đáp pháp luật PLHQ (${ketQua.length} đoạn wiki, ${dieuKhoanA.length} điều khoản nguồn A)`];
  if (res?.tai_ngay) {
    lines.push(`- Ngày đối chiếu hiệu lực: **${res.tai_ngay}**`);
  }
  if (res?.do_tin_cay_tra_loi) {
    lines.push(`- Độ tin cậy trả lời: **${res.do_tin_cay_tra_loi}**`);
  }
  if (res?.ngoai_pham_vi) {
    lines.push('- ⚠️ Ngoài phạm vi PLHQ (`ngoai_pham_vi: true`) — không suy diễn ngoài kho.');
  }

  if (res?.goi_y_du_phong) {
    const dp = res.goi_y_du_phong;
    lines.push('', '### Gợi ý dự phòng (khi thiếu toàn văn / không tìm thấy)');
    if (dp.ly_do) lines.push(`- ${dp.ly_do}`);
    if (dp.cong_cu_de_xuat) lines.push(`- Công cụ đề xuất: \`${dp.cong_cu_de_xuat}\``);
    if (dp.can_mo_the_bo_sung_so) lines.push('- Nên ghi nhận yêu cầu `[BỔ SUNG SỔ]` để nạp toàn văn nguồn A.');
    if (Array.isArray(dp.url_nguon_bac_a_goi_y) && dp.url_nguon_bac_a_goi_y.length) {
      lines.push(`- Nguồn bậc A gợi ý: ${dp.url_nguon_bac_a_goi_y.join(' | ')}`);
    }
  }

  if (Array.isArray(res?.canh_bao) && res.canh_bao.length) {
    lines.push('', '### Cảnh báo hiệu lực');
    for (const cb of res.canh_bao) lines.push(`- ⚠️ ${cb}`);
  }

  if (ketQua.length) {
    lines.push('', '### Tài liệu Wiki nghiệp vụ');
    for (const kq of ketQua) {
      lines.push(`- **${kq.tieu_de || kq.slug}** (${kq.muc || kq.duong_dan || ''})`);
      if (kq.canh_bao_hieu_luc) {
        lines.push('  ⚠️ Cảnh báo hiệu lực: Đoạn này nhắc văn bản đã hết hiệu lực mà chưa có ngữ cảnh thay thế/lịch sử — cần kiểm tra văn bản thay thế.');
      }
      if (kq.noi_dung) {
        const snippet = String(kq.noi_dung).replace(/\s+/g, ' ').slice(0, 320);
        lines.push(`  ${snippet}${kq.noi_dung.length > 320 ? '…' : ''}`);
      }
      if (Array.isArray(kq.van_ban_lien_quan) && kq.van_ban_lien_quan.length) {
        const vbStr = kq.van_ban_lien_quan
          .map((v) => `${v.so_hieu} [${v.tinh_trang || '?'}${v.hieu_luc_da_doi_chieu === false ? ', chưa đối chiếu A' : ''}]`)
          .join('; ');
        lines.push(`  Văn bản liên quan: ${vbStr}`);
      }
    }
  }

  if (dieuKhoanA.length) {
    lines.push('', '### Điều khoản nguyên văn nguồn A (`NGUYEN_VAN_NGUON_A`)');
    for (const dk of dieuKhoanA) {
      const ttBadge = dk.trang_thai_dieu && dk.trang_thai_dieu !== 'NGUYEN_BAN' ? ` [${dk.trang_thai_dieu}]` : '';
      lines.push(`- **[${dk.so_hieu}]** Điều ${dk.dieu ?? '?'}${dk.khoan ? ` Khoản ${dk.khoan}` : ''}${ttBadge}: ${dk.noi_dung || ''}`);
      if (dk.canh_bao_sua_doi) lines.push(`  ⚠️ ${dk.canh_bao_sua_doi}`);
    }
  }

  if (dieuKhoanNhap.length) {
    lines.push('', '### Tóm tắt nháp định vị điều khoản (`TOM_TAT_NHAP`, da_soat: false — chỉ tham khảo định vị, không trích nguyên văn)');
    for (const dk of dieuKhoanNhap) {
      lines.push(`- **[${dk.so_hieu || dk.slug || '?'}]** ${dk.dieu || ''} ${dk.ten || ''}: ${dk.tom_tat || ''}`);
    }
  }

  const sapCoHieuLuc = Array.isArray(res?.sap_co_hieu_luc) ? res.sap_co_hieu_luc : [];
  if (sapCoHieuLuc.length) {
    lines.push('', '### Tuyến 2 — Văn bản sắp có hiệu lực (`CHUA_CO_HIEU_LUC` — chỉ tham khảo chuẩn bị)');
    for (const sc of sapCoHieuLuc) {
      const nhan = sc.so_hieu || sc.tieu_de || sc.slug || '?';
      lines.push(
        `- **[${nhan}]**${sc.hieu_luc_tu ? ` (hiệu lực từ ${sc.hieu_luc_tu})` : ''}: ${sc.canh_bao || sc.noi_dung?.slice(0, 200) || ''}`,
      );
    }
  }

  if (!ketQua.length && !dieuKhoanA.length && !dieuKhoanNhap.length && !sapCoHieuLuc.length) {
    lines.push('', 'Không tìm thấy nội dung phù hợp trong kho wiki và điều khoản nguồn A.');
  }
  return lines.join('\n');
}

function dinhDangTraCas(res) {
  const ds = Array.isArray(res?.ket_qua) ? res.ket_qua : [];
  const tongTruoc = res?.tong_truoc_gioi_han;
  const header =
    typeof tongTruoc === 'number' && tongTruoc > ds.length
      ? `## Kết quả tra cứu hóa chất CAS (${ds.length}/${tongTruoc} mục)`
      : `## Kết quả tra cứu hóa chất CAS (${ds.length} mục)`;
  const lines = [header];
  if (!ds.length) {
    lines.push(res?.luu_y || 'Không tìm thấy hóa chất phù hợp trong danh mục CAS.');
    return lines.join('\n');
  }
  for (const item of ds) {
    lines.push(
      `- **${item.ten_chat || '?'}** | CAS: \`${item.cas || 'không có CAS'}\` | Công thức: ${item.cong_thuc || '—'} | Phụ lục ${item.phu_luc || '?'} (${item.phan_loai || ''})`,
    );
    lines.push(
      `  Văn bản: ${item.so_hieu || '?'} (${item.tinh_trang || '?'})${item.nguong_kg ? ` | Ngưỡng: ${item.nguong_kg} kg` : ''}`,
    );
  }
  if (res?.luu_y) lines.push(`- Lưu ý: ${res.luu_y}`);
  return lines.join('\n');
}

function dinhDangChinhSachHs(res) {
  if (res?.loi) {
    return `Lỗi tra cứu chính sách theo mã HS: ${res.loi}\n- Ranh giới: ${res.ranh_gioi || CHI_DAN_RANH_GIOI_HS}`;
  }
  const ds = Array.isArray(res?.ket_qua) ? res.ket_qua : [];
  const tongTruoc = res?.tong_truoc_gioi_han;
  const demStr = typeof tongTruoc === 'number' && tongTruoc > ds.length ? `${ds.length}/${tongTruoc}` : `${ds.length}`;
  const lines = [`## Văn bản chính sách / KTCN theo mã HS đã biết \`${res?.ma_hs || ''}\` (${demStr} mục)`];
  if (res?.nut_bieu) {
    lines.push(`- Nút biểu: \`${res.nut_bieu}\``);
  }
  if (res?.nhom_theo_trang_thai) {
    const g = res.nhom_theo_trang_thai;
    const nDang = Array.isArray(g.dang_ap_dung) ? g.dang_ap_dung.length : 0;
    const nCat = Array.isArray(g.cat_giam) ? g.cat_giam.length : 0;
    const nHet = Array.isArray(g.het_hieu_luc_hoac_sap_co_hieu_luc) ? g.het_hieu_luc_hoac_sap_co_hieu_luc.length : 0;
    lines.push(`- Nhóm trạng thái (thuần dữ liệu): Đang áp dụng: ${nDang} | Cắt giảm: ${nCat} | Hết hiệu lực / Sắp có hiệu lực: ${nHet}`);
  }
  if (res?.tai_ngay) {
    lines.push(`- Ngày đối chiếu hiệu lực: **${res.tai_ngay}**`);
  }
  if (res?.can_kiem_cas) {
    lines.push(`- 🧪 Cần kiểm tra mã CAS (\`plhq_tra_cas\`): ${res.ly_do_kiem_cas || 'Hàng hóa thuộc chương hóa chất / văn bản kiểm soát CAS.'}`);
  }
  if (res?.canh_bao_ma?.length) {
    lines.push(`- ⚠️ Cảnh báo mã ngoài biểu thuế đối chiếu: ${res.canh_bao_ma.join(', ')} — cần đối chiếu lại văn bản gốc, không tự kết luận diện áp.`);
  }
  if (Array.isArray(res?.canh_bao)) {
    for (const cb of res.canh_bao) lines.push(`- ⚠️ ${cb}`);
  }
  if (!ds.length) {
    lines.push('Không có văn bản chính sách/KTCN khớp tiền tố mã HS này trong danh mục.');
  } else {
    for (const item of ds) {
      lines.push(
        `- **[${item.so_hieu || '?'}]** (${item.tinh_trang || '?'}) | Mã áp: \`${item.ma_nhom || item.khoa_hs || '?'}\` | Tác động: ${item.loai_tac_dong || '?'}${item.muc_rui_ro ? ` | Rủi ro: ${item.muc_rui_ro}` : ''}`,
      );
      if (item.dieu_kien) lines.push(`  Điều kiện: ${item.dieu_kien}`);
      if (Array.isArray(item.dieu_khoan_ids) && item.dieu_khoan_ids.length > 0) {
        lines.push(`  Điều khoản gắn kết: ${item.dieu_khoan_ids.map((id) => `\`${id}\``).join(', ')}`);
      }
    }
  }
  if (Array.isArray(res?.dieu_khoan_lien_quan) && res.dieu_khoan_lien_quan.length > 0) {
    lines.push('### Điều khoản liên quan (NGUYEN_VAN_NGUON_A)');
    for (const dk of res.dieu_khoan_lien_quan) {
      const vanShort = dk.van ? String(dk.van).slice(0, 12) : '—';
      lines.push(`- \`${dk.id}\` (${dk.so_hieu || '?'} Điều ${dk.dieu}) | Trạng thái: ${dk.trang_thai_dieu || '?'} | van: \`${vanShort}\``);
    }
  }
  if (res?.ranh_gioi) lines.push(`- Lưu ý ranh giới: ${res.ranh_gioi}`);
  return lines.join('\n');
}

function dinhDangSapHetHieuLuc(res) {
  if (res?.loi) return `Lỗi tra cứu văn bản sắp hết hiệu lực: ${res.loi}`;
  const ds = Array.isArray(res?.ket_qua) ? res.ket_qua : (Array.isArray(res?.van_ban) ? res.van_ban : []);
  const ngay = res?.trong_so_ngay ?? 60;
  const moc = res?.hom_nay || '';
  const lines = [`## Văn bản sắp hết hiệu lực trong <= ${ngay} ngày${moc ? ` (tính từ ${moc})` : ''}: ${ds.length} văn bản`];
  if (!ds.length) {
    lines.push('Không có văn bản nào sắp hết hiệu lực trong khoảng thời gian này.');
    return lines.join('\n');
  }
  for (const vb of ds) {
    const thay = Array.isArray(vb.bi_thay_the_boi) && vb.bi_thay_the_boi.length
      ? ` | Thay thế bởi: ${vb.bi_thay_the_boi.join(', ')}`
      : '';
    const conNgay = vb.so_ngay_con_lai ?? vb.con_lai_ngay ?? '?';
    lines.push(`- **${vb.het_hieu_luc_tu || '?'}** (còn ${conNgay} ngày): **${vb.so_hieu}** — ${vb.ten || ''} [${vb.tinh_trang || '?'}]${thay}`);
  }
  return lines.join('\n');
}

function taoThongTinLuocDo(store) {
  const regCount = store?.registry?.van_ban?.length ?? store?.vanBan?.length ?? store?.tong_van_ban ?? 0;
  const dkStats = store?.dieuKhoan?.thong_ke || {};
  const wikiStats = {
    so_trang: store?.wikiIndex?.trang?.length ?? store?.wikiIndex?.tong ?? 0,
    so_chunks: store?.wikiChunks?.chunks?.length ?? store?.wikiChunks?.tong ?? 0,
  };
  const casStats = store?.casIndex?.thong_ke || {};
  const hsStats = {
    tong_nhom_ma: store?.hsIndexTheoMa?.tong_nhom_ma ?? Object.keys(store?.hsIndexTheoMa?.ma || {}).length,
    tong_canh: store?.hsIndexTheoMa?.tong_canh ?? 0,
  };
  return {
    ten_he_thong: 'oz-wiki-plhq',
    luoc_do_phien_ban: store?.luoc_do_phien_ban || LUOC_DO_PHIEN_BAN,
    phien_ban: store?.phien_ban || null,
    nguon_du_lieu: store?.nguon_du_lieu || null,
    giay_phep: 'CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/',
    ghi_nguon: GHI_NGUON_CC_BY,
    mien_tru: MIEN_TRU_PHAP_LY,
    thong_ke: {
      so_van_ban: regCount,
      dieu_khoan_2_tang: {
        nguyen_van_nguon_a: {
          so_van_ban: dkStats.so_van_ban_nguon_a ?? store?.dieuKhoan?.nguyen_van_nguon_a?.length ?? 0,
          so_dieu_khoan: dkStats.so_dieu_khoan_nguon_a ?? 0,
          quy_tac: 'Đã đối chiếu nguyên văn PDF bậc A & SHA-256 — dùng làm căn cứ trích dẫn pháp lý.',
        },
        tom_tat_nhap: {
          so_van_ban: dkStats.so_van_ban_tom_tat_nhap ?? store?.dieuKhoan?.tom_tat_nhap?.length ?? 0,
          so_dieu_khoan: dkStats.so_dieu_khoan_tom_tat_nhap ?? 0,
          da_soat: false,
          quy_tac: 'Tóm tắt nháp trích tự động (da_soat: false) — CHỈ dùng định vị điều luật, KHÔNG trích làm nguyên văn.',
        },
      },
      sua_doi_cap_dieu: {
        so_tep: dkStats.so_tep_sua_doi_dieu ?? 0,
        so_tac_dong: dkStats.so_tac_dong_dieu ?? 0,
        so_dieu_co_lich_su: dkStats.so_dieu_co_lich_su_sua_doi ?? 0,
      },
      wiki: wikiStats,
      cas: {
        so_ma_cas_duy_nhat: casStats.so_ma_cas_duy_nhat ?? Object.keys(store?.casIndex?.theo_cas || {}).length,
        so_dong_khong_co_cas: casStats.so_dong_khong_co_cas ?? store?.casIndex?.khong_co_cas?.length ?? 0,
      },
      hs_theo_ma: hsStats,
    },
    tinh_nang_ozplugin: {
      ho_tro_tai_ngay: true,
      hai_tuyen_sap_co_hieu_luc: true,
      do_thi_sua_doi_cap_dieu: true,
      cong_ngoai_pham_vi: true,
      van_tay_sha256: true,
      chuan_lop_du_lieu: 'lop-kho@1',
      manifest: 'dist/manifest.json',
      nhom_chinh_sach_thuan_du_lieu: true,
      can_kiem_cas: true,
      giao_thuc_he_sinh_thai: 'hs-code-api (ho-so-ma@1) <-> oz-wiki-plhq (1.7.0) <-> ozplugin',
      tai_nguyen_quy_trinh: 'plhq://huong-dan/quy-trinh-agent',
    },
    ranh_gioi_hs_code_api: CHI_DAN_RANH_GIOI_HS,
  };
}

/** Khởi tạo máy chủ MCP in-process (gồm hàm async xuLyYeuCau(msg) để gọi trực tiếp hoặc qua stdio). */
export function taoMayChuMcp({ store: initialStore, distDir, root } = {}) {
  let storePromise = initialStore ? Promise.resolve(initialStore) : null;
  const layKho = () => {
    if (!storePromise) {
      const opts = {};
      if (distDir !== undefined) opts.distDir = distDir;
      if (root !== undefined) opts.root = root;
      storePromise = Promise.resolve(taoKhoTraCuu(opts));
    }
    return storePromise;
  };

  async function goiCongCu(name, args) {
    const store = await layKho();
    const kiemTraTaiNgay = () => {
      if (args.tai_ngay === undefined || args.tai_ngay === null || args.tai_ngay === '') {
        return { hopLe: true, giaTri: null };
      }
      if (typeof args.tai_ngay !== 'string') {
        return { hopLe: false, loi: 'Tham số "tai_ngay" phải là chuỗi YYYY-MM-DD.' };
      }
      return chuanHoaTaiNgay(args.tai_ngay);
    };
    switch (name) {
      case 'plhq_tra_hieu_luc': {
        if (!laChuoiKhongRong(args.so_hieu)) {
          return taoLoiCongCu(name, 'Thiếu tham số bắt buộc "so_hieu" (chuỗi số hiệu văn bản).');
        }
        const tn = kiemTraTaiNgay();
        if (!tn.hopLe) return taoLoiCongCu(name, tn.loi);
        const res = traHieuLuc(store, args.so_hieu.trim(), {
          ...(tn.giaTri ? { tai_ngay: tn.giaTri } : {}),
        });
        return taoPhanHoiCongCu(dinhDangTraHieuLuc(res), res);
      }

      case 'plhq_tra_dieu_khoan': {
        if (args.so_hieu !== undefined && typeof args.so_hieu !== 'string') {
          return taoLoiCongCu(name, 'Tham số "so_hieu" phải là chuỗi.');
        }
        const tn = kiemTraTaiNgay();
        if (!tn.hopLe) return taoLoiCongCu(name, tn.loi);
        const lim = chuanSoNguyenDuong(args.limit, 'limit');
        if (!lim.hopLe) return taoLoiCongCu(name, lim.loi);
        if (args.chi_nguyen_van !== undefined && typeof args.chi_nguyen_van !== 'boolean') {
          return taoLoiCongCu(name, 'Tham số "chi_nguyen_van" phải là boolean.');
        }
        const opts = {
          ...(laChuoiKhongRong(args.so_hieu) ? { so_hieu: args.so_hieu.trim() } : {}),
          ...(args.dieu !== undefined && args.dieu !== null && String(args.dieu).trim() !== ''
            ? { dieu: args.dieu }
            : {}),
          ...(args.khoan !== undefined && args.khoan !== null && String(args.khoan).trim() !== ''
            ? { khoan: args.khoan }
            : {}),
          ...(laChuoiKhongRong(args.diem) ? { diem: args.diem.trim() } : {}),
          ...(laChuoiKhongRong(args.tu_khoa) ? { tu_khoa: args.tu_khoa.trim() } : {}),
          ...(args.chi_nguyen_van !== undefined ? { chi_nguyen_van: args.chi_nguyen_van } : {}),
          ...(tn.giaTri ? { tai_ngay: tn.giaTri } : {}),
          ...(lim.giaTri !== undefined ? { limit: lim.giaTri } : {}),
        };
        const res = traDieuKhoan(store, opts);
        return taoPhanHoiCongCu(dinhDangTraDieuKhoan(res), res);
      }

      case 'plhq_hoi_phap_luat': {
        if (!laChuoiKhongRong(args.cau_hoi)) {
          return taoLoiCongCu(name, 'Thiếu tham số bắt buộc "cau_hoi".');
        }
        const tn = kiemTraTaiNgay();
        if (!tn.hopLe) return taoLoiCongCu(name, tn.loi);
        const lim = chuanSoNguyenDuong(args.limit, 'limit');
        if (!lim.hopLe) return taoLoiCongCu(name, lim.loi);
        const opts = {
          ...(laChuoiKhongRong(args.nhanh) ? { nhanh: args.nhanh.trim() } : {}),
          ...(tn.giaTri ? { tai_ngay: tn.giaTri } : {}),
          ...(lim.giaTri !== undefined ? { limit: lim.giaTri } : {}),
        };
        const res = hoiPhapLuat(store, args.cau_hoi.trim(), opts);
        return taoPhanHoiCongCu(dinhDangHoiPhapLuat(res), res);
      }

      case 'plhq_tra_cas': {
        if (!laChuoiKhongRong(args.query)) {
          return taoLoiCongCu(name, 'Thiếu tham số bắt buộc "query" (mã CAS, tên chất hoặc công thức).');
        }
        const lim = chuanSoNguyenDuong(args.limit, 'limit');
        if (!lim.hopLe) return taoLoiCongCu(name, lim.loi);
        const opts = {
          ...(laChuoiKhongRong(args.phu_luc) ? { phu_luc: args.phu_luc.trim() } : {}),
          ...(lim.giaTri !== undefined ? { limit: lim.giaTri } : {}),
        };
        const res = traHoaChatCas(store, args.query.trim(), opts);
        return taoPhanHoiCongCu(dinhDangTraCas(res), res);
      }

      case 'plhq_chinh_sach_theo_hs': {
        if (!laChuoiKhongRong(args.ma_hs)) {
          return taoLoiCongCu(name, 'Thiếu tham số bắt buộc "ma_hs" (mã HS 4, 6 hoặc 8 số đã biết).');
        }
        const tn = kiemTraTaiNgay();
        if (!tn.hopLe) return taoLoiCongCu(name, tn.loi);
        const lim = chuanSoNguyenDuong(args.limit, 'limit');
        if (!lim.hopLe) return taoLoiCongCu(name, lim.loi);
        const opts = {
          ...(tn.giaTri ? { tai_ngay: tn.giaTri } : {}),
          ...(lim.giaTri !== undefined ? { limit: lim.giaTri } : {}),
        };
        const res = traChinhSachTheoMaHs(store, args.ma_hs.trim(), opts);
        return taoPhanHoiCongCu(dinhDangChinhSachHs(res), res, Boolean(res?.loi));
      }

      case 'plhq_sap_het_hieu_luc': {
        const ngay = chuanSoNguyenDuong(args.trong_so_ngay, 'trong_so_ngay', { choPhepKhong: true });
        if (!ngay.hopLe) return taoLoiCongCu(name, ngay.loi);
        if (args.hom_nay !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(String(args.hom_nay))) {
          return taoLoiCongCu(name, 'Tham số "hom_nay" phải có định dạng YYYY-MM-DD.');
        }
        const opts = {
          ...(ngay.giaTri !== undefined ? { trong_so_ngay: ngay.giaTri } : {}),
          ...(args.hom_nay ? { hom_nay: String(args.hom_nay) } : {}),
        };
        const res = lietKeSapHetHieuLuc(store, opts);
        return taoPhanHoiCongCu(dinhDangSapHetHieuLuc(res), res, Boolean(res?.loi));
      }

      default:
        return null;
    }
  }

  async function docTaiNguyen(uri) {
    const store = await layKho();
    if (uri === 'plhq://meta/luoc-do') {
      const meta = taoThongTinLuocDo(store);
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(meta, null, 2),
          },
        ],
      };
    }
    if (uri === 'plhq://bao-cao/sap-het-hieu-luc') {
      const ds = lietKeSapHetHieuLuc(store, { trong_so_ngay: 60 });
      const payload = {
        ...ds,
        ghi_nguon: ds?.ghi_nguon || GHI_NGUON_CC_BY,
        mien_tru: ds?.mien_tru || MIEN_TRU_PHAP_LY,
      };
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(payload, null, 2),
          },
        ],
      };
    }
    if (uri === 'plhq://huong-dan/quy-trinh-agent') {
      const md = [
        '# Quy trình chuẩn cho AI Agent & ozplugin (`oz-wiki-plhq`)',
        '',
        '1. **Đối chiếu hiệu lực theo ngày tờ khai (`tai_ngay`):**',
        '   - Khi kiểm tra hồ sơ/tờ khai quá khứ hoặc tương lai, luôn truyền `tai_ngay` (`YYYY-MM-DD`, vd ngày đăng ký tờ khai) vào `plhq_hoi_phap_luat`, `plhq_tra_hieu_luc`, `plhq_tra_dieu_khoan` và `plhq_chinh_sach_theo_hs`.',
        '   - Nếu kết quả trả `do_chinh_xac_ngay: "THIEU_NGAY_HIEU_LUC"`, không tự suy đoán trạng thái ngày quá khứ mà báo rõ cần đối chiếu nguồn bậc A.',
        '',
        '2. **Quy trình 2 bước xác minh & trích dẫn nguồn A:**',
        '   - **Bước 1:** Gọi `plhq_hoi_phap_luat` để định vị văn bản hiện hành, wiki nghiệp vụ và danh sách điều khoản liên quan.',
        '   - **Bước 2:** Xác nhận hiệu lực bằng `plhq_tra_hieu_luc` và lấy nguyên văn bằng `plhq_tra_dieu_khoan` (`chi_nguyen_van: true`).',
        '   - Tuyệt đối chỉ trích dẫn `NGUYEN_VAN_NGUON_A` làm căn cứ pháp lý; `TOM_TAT_NHAP` (`da_soat: false`) chỉ dùng định vị điều luật.',
        '',
        '3. **Xử lý đồ thị sửa đổi cấp Điều (`trang_thai_dieu`):**',
        '   - Nếu điều khoản có `trang_thai_dieu` là `DA_SUA_DOI`, `DA_BAI_BO`, `DA_BO_SUNG` hoặc `TAM_NGUNG`, bắt buộc đọc `lich_su_tac_dong[]` và `canh_bao_sua_doi` để lần sang `dieu_khoan_sua_doi_lien_quan` (văn bản sửa đổi mới hơn) trước khi kết luận.',
        '',
        '4. **Quy tắc 2 tuyến (`ket_qua` vs `sap_co_hieu_luc`):**',
        '   - `ket_qua` chứa văn bản đang có hiệu lực theo mốc ngày; `sap_co_hieu_luc` chứa văn bản `CHUA_CO_HIEU_LUC` để tham khảo chuẩn bị trước thời điểm hiệu lực.',
        '',
        '5. **Cổng ngoài phạm vi (OOS) & dự phòng 3 tầng:**',
        '   - Khi `ngoai_pham_vi: true` hoặc `do_tin_cay_tra_loi: "KHONG_TIM_THAY"`, tuyệt đối không suy diễn điều luật ngoài kho; thực hiện đúng `goi_y_du_phong` (`tim_van_ban_lop_2` + mở thẻ `[BỔ SUNG SỔ]` nếu thiếu).',
        '',
        '6. **Ranh giới 0% trùng lặp với `hs-code-api`:**',
        '   - Phân loại/áp mã HS từ mô tả hàng hóa, 6 quy tắc GIR, chú giải HS WCO/AHTN, thuế suất và tiền lệ phân loại thuộc **`hs-code-api`** (`chuyen_huong.he_thong === "hs-code-api"`).',
        '',
        '7. **Giao thức liên thông 3 bước `hs-code-api` ↔ `oz-wiki-plhq` ↔ `ozplugin`:**',
        '   - **Bước 1 (`hs-code-api`):** Xác định mã HS 8 số, mô tả biểu thuế, thuế suất ưu đãi/FTA và hồ sơ mã chuẩn (`ho-so-ma@1`).',
        '   - **Bước 2 (`oz-wiki-plhq`):** Truyền `ma_hs` đã chốt và `tai_ngay` vào `plhq_chinh_sach_theo_hs(ma_hs, tai_ngay)` → đọc nhóm thuần dữ liệu `nhom_theo_trang_thai` (`dang_ap_dung`, `cat_giam`, `het_hieu_luc_hoac_sap_co_hieu_luc`), kiểm tra `canh_bao_ma` và `can_kiem_cas` → nếu `can_kiem_cas: true` thì gọi `plhq_tra_cas`; gọi `plhq_tra_dieu_khoan` (`chi_nguyen_van: true`) hoặc lần theo `dieu_khoan_lien_quan` để lấy nguyên văn `NGUYEN_VAN_NGUON_A`.',
        '   - **Bước 3 (LLM / `ozplugin`):** Tổng hợp câu trả lời thuần dữ liệu từ 2 nguồn (0% suy diễn điều luật ngoài kho), trích dẫn bắt buộc kèm `id` điều khoản/nút biểu, `nguon_bac_a` và vân tay `van` (SHA-256).',
        '',
        `> ${GHI_NGUON_CC_BY}`,
        `> ${MIEN_TRU_PHAP_LY}`,
      ].join('\n');
      return {
        contents: [
          {
            uri,
            mimeType: 'text/markdown',
            text: md,
          },
        ],
      };
    }
    return null;
  }

  const tenCongCuHopLe = new Set(TAO_DANH_SACH_CONG_CU().map((c) => c.name));

  async function xuLyMotYeuCau(msg) {
    if (!laObjectThuong(msg)) {
      return taoLoiJsonRpc(null, LOI_YEU_CAU, 'Yêu cầu JSON-RPC 2.0 phải là object.');
    }
    const coId = Object.prototype.hasOwnProperty.call(msg, 'id') && msg.id !== undefined;
    if (msg.jsonrpc !== '2.0' || !laChuoiKhongRong(msg.method)) {
      return taoLoiJsonRpc(coId ? msg.id : null, LOI_YEU_CAU, 'Thiếu jsonrpc="2.0" hoặc method hợp lệ.');
    }

    // Notification không có id: theo JSON-RPC 2.0 tuyệt đối không trả phản hồi.
    if (!coId) {
      return null;
    }

    const { id, method, params } = msg;

    try {
      switch (method) {
        case 'initialize': {
          if (params !== undefined && !laObjectThuong(params)) {
            return taoLoiJsonRpc(id, LOI_THAM_SO, 'Tham số initialize phải là object.');
          }
          const reqVer = params?.protocolVersion;
          const protocolVersion =
            typeof reqVer === 'string' && CAC_PHIEN_BAN_GIAO_THUC.includes(reqVer)
              ? reqVer
              : PHIEN_BAN_MAC_DINH;
          return taoKetQuaJsonRpc(id, {
            protocolVersion,
            capabilities: {
              tools: { listChanged: false },
              resources: { subscribe: false, listChanged: false },
            },
            serverInfo: {
              name: 'oz-wiki-plhq',
              version: LUOC_DO_PHIEN_BAN,
            },
            instructions: [
              'Cổng MCP tra cứu pháp luật hải quan Việt Nam (oz-wiki-plhq, chỉ đọc).',
              CHI_DAN_RANH_GIOI_HS,
              GHI_NGUON_CC_BY,
              MIEN_TRU_PHAP_LY,
            ].join('\n'),
          });
        }

        case 'notifications/initialized':
          return taoKetQuaJsonRpc(id, {});

        case 'ping':
          return taoKetQuaJsonRpc(id, {});

        case 'tools/list':
          if (params !== undefined && !laObjectThuong(params)) {
            return taoLoiJsonRpc(id, LOI_THAM_SO, 'Tham số tools/list phải là object.');
          }
          return taoKetQuaJsonRpc(id, { tools: TAO_DANH_SACH_CONG_CU() });

        case 'tools/call': {
          if (!laObjectThuong(params) || !laChuoiKhongRong(params.name)) {
            return taoLoiJsonRpc(id, LOI_THAM_SO, 'Thiếu params.name hợp lệ cho tools/call.');
          }
          const toolName = params.name.trim();
          if (!tenCongCuHopLe.has(toolName)) {
            return taoLoiJsonRpc(id, LOI_THAM_SO, `Công cụ không tồn tại: ${toolName}`);
          }
          if (params.arguments !== undefined && !laObjectThuong(params.arguments)) {
            return taoLoiJsonRpc(id, LOI_THAM_SO, 'params.arguments phải là object.');
          }
          const args = params.arguments || {};
          const res = await goiCongCu(toolName, args);
          return taoKetQuaJsonRpc(id, res);
        }

        case 'resources/list':
          if (params !== undefined && !laObjectThuong(params)) {
            return taoLoiJsonRpc(id, LOI_THAM_SO, 'Tham số resources/list phải là object.');
          }
          return taoKetQuaJsonRpc(id, { resources: TAO_DANH_SACH_TAI_NGUYEN() });

        case 'resources/read': {
          if (!laObjectThuong(params) || !laChuoiKhongRong(params.uri)) {
            return taoLoiJsonRpc(id, LOI_THAM_SO, 'Thiếu params.uri hợp lệ cho resources/read.');
          }
          const uri = params.uri.trim();
          const res = await docTaiNguyen(uri);
          if (!res) {
            return taoLoiJsonRpc(id, LOI_THAM_SO, `Tài nguyên không tồn tại: ${uri}`);
          }
          return taoKetQuaJsonRpc(id, res);
        }

        default:
          return taoLoiJsonRpc(id, LOI_PHUONG_THUC, `Phương thức không được hỗ trợ: ${method}`);
      }
    } catch (err) {
      return taoLoiJsonRpc(id, LOI_NOI_BO, err?.message ? String(err.message) : 'Lỗi nội bộ máy chủ MCP.');
    }
  }

  async function xuLyYeuCau(msg) {
    if (Array.isArray(msg)) {
      if (msg.length === 0) {
        return taoLoiJsonRpc(null, LOI_YEU_CAU, 'Mảng batch JSON-RPC rỗng không hợp lệ.');
      }
      const out = [];
      for (const item of msg) {
        const res = await xuLyMotYeuCau(item);
        if (res !== null) out.push(res);
      }
      return out.length > 0 ? out : null;
    }
    return xuLyMotYeuCau(msg);
  }

  return { xuLyYeuCau, layKho };
}

/** Đóng gói 1 phản hồi JSON-RPC 2.0 theo đúng framing ('newline' hoặc 'content-length'). */
export function dongGoiThongDiep(payload, framing = 'newline') {
  const json = JSON.stringify(payload);
  if (framing === 'content-length') {
    const body = Buffer.from(json, 'utf8');
    const header = Buffer.from(`Content-Length: ${body.length}\r\n\r\n`, 'ascii');
    return Buffer.concat([header, body]);
  }
  return Buffer.from(`${json}\n`, 'utf8');
}

const MAX_HEADER_BYTES = 64 * 1024;

function timViTriKhongPhaiKhoangTrang(buf) {
  for (let i = 0; i < buf.length; i++) {
    const b = buf[i];
    if (b !== 0x20 && b !== 0x09 && b !== 0x0d && b !== 0x0a) return i;
  }
  return buf.length;
}

function timKetThucHeader(buf) {
  const idxCrlf = buf.indexOf('\r\n\r\n');
  const idxLf = buf.indexOf('\n\n');
  if (idxCrlf === -1 && idxLf === -1) return { end: -1, sepLen: 0 };
  if (idxCrlf === -1) return { end: idxLf, sepLen: 2 };
  if (idxLf === -1) return { end: idxCrlf, sepLen: 4 };
  return idxCrlf < idxLf ? { end: idxCrlf, sepLen: 4 } : { end: idxLf, sepLen: 2 };
}

/** Bộ phân tích stream hỗn hợp hỗ trợ cả Content-Length và Newline-delimited JSON. */
export function taoBoPhanTichKhung({ onPayload, onParseError }) {
  let buffer = Buffer.alloc(0);
  let framingGanNhat = 'newline';

  function xuLyChuoiJson(rawText, framing) {
    framingGanNhat = framing;
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      onParseError(err, framing);
      return;
    }
    onPayload(parsed, framing);
  }

  function rut(isEof) {
    while (buffer.length > 0) {
      const ws = timViTriKhongPhaiKhoangTrang(buffer);
      if (ws > 0) buffer = buffer.subarray(ws);
      if (buffer.length === 0) break;

      const firstByte = buffer[0];
      // 1. Newline-delimited JSON bắt đầu bằng '{' hoặc '['
      if (firstByte === 0x7b || firstByte === 0x5b) {
        const nl = buffer.indexOf(0x0a);
        if (nl === -1) {
          if (!isEof) break;
          const line = buffer.toString('utf8').trim();
          buffer = Buffer.alloc(0);
          if (line) xuLyChuoiJson(line, 'newline');
          break;
        }
        const line = buffer.subarray(0, nl).toString('utf8').trim();
        buffer = buffer.subarray(nl + 1);
        if (line) xuLyChuoiJson(line, 'newline');
        continue;
      }

      // 2. Header Content-Length / Content-Type
      const probeLen = Math.min(buffer.length, 64);
      const probeLower = buffer.subarray(0, probeLen).toString('ascii').toLowerCase();
      const nlIdx = buffer.indexOf(0x0a);
      const coTheLaHeader =
        /^content-(?:length|type)\s*:/.test(probeLower)
        || (nlIdx === -1 && ('content-length:'.startsWith(probeLower) || 'content-type:'.startsWith(probeLower)));

      if (coTheLaHeader) {
        const { end: headerEnd, sepLen } = timKetThucHeader(buffer);
        if (headerEnd === -1) {
          if (buffer.length > MAX_HEADER_BYTES) {
            buffer = Buffer.alloc(0);
            onParseError(new Error('Header Content-Length quá dài.'), 'content-length');
            break;
          }
          if (!isEof) break;
          buffer = Buffer.alloc(0);
          onParseError(new Error('Header Content-Length chưa hoàn chỉnh trước EOF.'), 'content-length');
          break;
        }

        const headerText = buffer.subarray(0, headerEnd).toString('ascii');
        let contentLength = null;
        for (const line of headerText.split(/\r?\n/)) {
          const m = line.match(/^content-length\s*:\s*(\d+)\s*$/i);
          if (m) {
            contentLength = Number(m[1]);
            break;
          }
        }
        if (contentLength === null || !Number.isFinite(contentLength) || contentLength < 0) {
          buffer = buffer.subarray(headerEnd + sepLen);
          onParseError(new Error('Thiếu hoặc sai giá trị header Content-Length.'), 'content-length');
          continue;
        }

        const totalNeeded = headerEnd + sepLen + contentLength;
        if (buffer.length < totalNeeded) {
          if (!isEof) break;
          buffer = Buffer.alloc(0);
          onParseError(new Error('Thiếu dữ liệu body theo Content-Length trước EOF.'), 'content-length');
          break;
        }

        const bodyText = buffer.subarray(headerEnd + sepLen, totalNeeded).toString('utf8');
        buffer = buffer.subarray(totalNeeded);
        xuLyChuoiJson(bodyText, 'content-length');
        continue;
      }

      // 3. Dòng văn bản lỗi không phải JSON cũng không phải header Content-Length
      if (nlIdx === -1) {
        if (!isEof) break;
        const raw = buffer.toString('utf8').trim();
        buffer = Buffer.alloc(0);
        if (raw) onParseError(new Error('Dữ liệu đầu vào không phải JSON hợp lệ.'), framingGanNhat);
        break;
      }
      const rawLine = buffer.subarray(0, nlIdx).toString('utf8').trim();
      buffer = buffer.subarray(nlIdx + 1);
      if (rawLine) onParseError(new Error('Dữ liệu đầu vào không phải JSON hợp lệ.'), framingGanNhat);
    }
  }

  return {
    push(chunk) {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), 'utf8');
      buffer = buffer.length ? Buffer.concat([buffer, buf]) : buf;
      rut(false);
    },
    end() {
      rut(true);
    },
  };
}

/** Chạy vòng lặp stdio (mặc định process.stdin / process.stdout) cho đến khi stdin đóng gọn. */
export function chayStdio({
  store,
  distDir,
  root,
  input = process.stdin,
  output = process.stdout,
} = {}) {
  const server = taoMayChuMcp({ store, distDir, root });
  let chain = Promise.resolve();
  let pipeBroken = false;

  const ghiPhanHoi = (payload, framing) => {
    if (pipeBroken || output.destroyed || output.writableEnded) return;
    try {
      output.write(dongGoiThongDiep(payload, framing));
    } catch (err) {
      if (err?.code === 'EPIPE') pipeBroken = true;
    }
  };

  const onOutputError = (err) => {
    if (err?.code === 'EPIPE') pipeBroken = true;
  };
  output.on('error', onOutputError);

  const parser = taoBoPhanTichKhung({
    onPayload(msg, framing) {
      chain = chain.then(async () => {
        const res = await server.xuLyYeuCau(msg);
        if (res !== null) ghiPhanHoi(res, framing);
      });
    },
    onParseError(err, framing) {
      chain = chain.then(() => {
        ghiPhanHoi(
          taoLoiJsonRpc(null, LOI_PARSE, `JSON không hợp lệ: ${err?.message || 'Parse error'}`),
          framing,
        );
      });
    },
  });

  return new Promise((resolveDone) => {
    let ended = false;
    const ketThuc = () => {
      if (ended) return;
      ended = true;
      parser.end();
      chain.finally(() => {
        output.removeListener('error', onOutputError);
        resolveDone();
      });
    };

    input.on('data', (chunk) => parser.push(chunk));
    input.on('end', ketThuc);
    input.on('close', ketThuc);
  });
}

function phanTichThamSoCli(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') {
      opts.help = true;
    } else if (a === '--dist' && argv[i + 1]) {
      opts.distDir = resolve(argv[++i]);
    } else if (a.startsWith('--dist=')) {
      opts.distDir = resolve(a.slice('--dist='.length));
    } else if (a === '--root' && argv[i + 1]) {
      opts.root = resolve(argv[++i]);
    } else if (a.startsWith('--root=')) {
      opts.root = resolve(a.slice('--root='.length));
    }
  }
  return opts;
}

function laChayTrucTiep() {
  if (!process.argv[1]) return false;
  try {
    if (import.meta.url === pathToFileURL(resolve(process.argv[1])).href) return true;
    return import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href;
  } catch {
    return false;
  }
}

if (laChayTrucTiep()) {
  const opts = phanTichThamSoCli(process.argv.slice(2));
  if (opts.help) {
    process.stderr.write(
      'Cách dùng: node tools/mcp-server.mjs [--dist <thư mục dist>] [--root <thư mục kho>]\n'
        + 'Chạy MCP JSON-RPC 2.0 server qua stdin/stdout (hỗ trợ cả newline JSON và Content-Length).\n',
    );
    process.exit(0);
  }
  chayStdio(opts).catch((err) => {
    process.stderr.write(`[oz-wiki-plhq-mcp] Lỗi khởi chạy: ${err?.stack || err}\n`);
    process.exit(1);
  });
}
