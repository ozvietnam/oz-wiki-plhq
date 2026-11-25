// Bộ kiểm thử toàn diện cho MCP Stdio Server (tools/mcp-server.mjs):
// - In-process: initialize (2024-11-05 & 2025-03-26), notifications/initialized, ping,
//   tools/list, cả 6 tools/call (kèm ranh giới hs-code-api, tách tầng NGUYEN_VAN_NGUON_A vs TOM_TAT_NHAP, isError),
//   resources/list + resources/read, lỗi JSON-RPC -32700 / -32600 / -32601 / -32602, và fallback in_memory.
// - E2E child process thật (`node tools/mcp-server.mjs`) cho CẢ HAI framing: Newline-delimited JSON và Content-Length.
import { spawn } from 'node:child_process';
import { cpSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT, LUOC_DO_PHIEN_BAN, khoa } from '../lib/registry.mjs';
import { GHI_NGUON_CC_BY, MIEN_TRU_PHAP_LY, taoKhoTraCuu } from '../lib/tra-cuu-plhq.mjs';
import {
  LOI_PARSE,
  LOI_PHUONG_THUC,
  LOI_THAM_SO,
  LOI_YEU_CAU,
  TAO_DANH_SACH_CONG_CU,
  TAO_DANH_SACH_TAI_NGUYEN,
  dongGoiThongDiep,
  taoBoPhanTichKhung,
  taoMayChuMcp,
} from '../mcp-server.mjs';

let pass = 0;
let fail = 0;
const t = (name, cond, extra = '') => {
  if (cond) {
    pass += 1;
    console.log(`PASS ${name}`);
  } else {
    fail += 1;
    console.log(`FAIL ${name} ${extra}`);
  }
};

const tmpDirs = [];
const makeTmp = (prefix) => {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  tmpDirs.push(dir);
  return dir;
};

/** Chạy tiến trình con `node tools/mcp-server.mjs` với timeout an toàn và thu trọn stdout/stderr. */
function chayTienTrinhMcp(args, rawChunks, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [join(ROOT, 'tools', 'mcp-server.mjs'), ...args], {
      cwd: ROOT,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const stdoutChunks = [];
    const stderrChunks = [];
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      try { child.kill('SIGKILL'); } catch {}
      reject(new Error(`MCP child process timeout sau ${timeoutMs}ms`));
    }, timeoutMs);

    child.stdout.on('data', (c) => stdoutChunks.push(c));
    child.stderr.on('data', (c) => stderrChunks.push(c));
    child.on('error', (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(err);
    });
    child.on('close', (code, signal) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({
        code,
        signal,
        stdout: Buffer.concat(stdoutChunks),
        stderr: Buffer.concat(stderrChunks).toString('utf8'),
      });
    });

    for (const chunk of rawChunks) {
      child.stdin.write(chunk);
    }
    child.stdin.end();
  });
}

function giaiMaPhanHoiContentLength(buf) {
  const messages = [];
  let offset = 0;
  while (offset < buf.length) {
    const rest = buf.subarray(offset);
    const sepIdx = rest.indexOf('\r\n\r\n');
    if (sepIdx === -1) throw new Error(`Thiếu \\r\\n\\r\\n trong phản hồi Content-Length tại offset ${offset}`);
    const header = rest.subarray(0, sepIdx).toString('ascii');
    const m = header.match(/^Content-Length:\s*(\d+)$/im);
    if (!m) throw new Error(`Header Content-Length không hợp lệ: ${header}`);
    const len = Number(m[1]);
    const bodyStart = sepIdx + 4;
    const bodyEnd = bodyStart + len;
    if (rest.length < bodyEnd) throw new Error(`Body bị cắt cụt: cần ${len}, có ${rest.length - bodyStart}`);
    const bodyText = rest.subarray(bodyStart, bodyEnd).toString('utf8');
    messages.push({ len, json: JSON.parse(bodyText), bodyBytes: rest.subarray(bodyStart, bodyEnd).length });
    offset += bodyEnd;
  }
  return messages;
}

try {
  // 1. Metadata công cụ & tài nguyên
  const toolsList = TAO_DANH_SACH_CONG_CU();
  const expectedTools = [
    'plhq_tra_hieu_luc',
    'plhq_tra_dieu_khoan',
    'plhq_hoi_phap_luat',
    'plhq_tra_cas',
    'plhq_chinh_sach_theo_hs',
    'plhq_sap_het_hieu_luc',
  ];
  t(
    'TAO_DANH_SACH_CONG_CU: đủ 6 công cụ với readOnlyHint=true',
    toolsList.length === 6
      && expectedTools.every((name) => toolsList.some((x) => x.name === name))
      && toolsList.every((x) => x.annotations?.readOnlyHint === true && x.inputSchema?.type === 'object'),
    JSON.stringify(toolsList.map((x) => x.name)),
  );

  const resList = TAO_DANH_SACH_TAI_NGUYEN();
  t(
    'TAO_DANH_SACH_TAI_NGUYEN: đủ 2 resource chuẩn',
    resList.length === 2
      && resList.some((r) => r.uri === 'plhq://meta/luoc-do' && r.mimeType === 'application/json')
      && resList.some((r) => r.uri === 'plhq://bao-cao/sap-het-hieu-luc' && r.mimeType === 'application/json'),
  );

  // 2. Giao thức in-process (initialize, notifications, ping, list)
  const server = taoMayChuMcp({ root: ROOT });

  const init24 = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: { protocolVersion: '2024-11-05', clientInfo: { name: 'test-client', version: '1.0' } },
  });
  t(
    'initialize (2024-11-05): trả đúng protocolVersion, capabilities, serverInfo 1.5.0',
    init24?.result?.protocolVersion === '2024-11-05'
      && init24.result.serverInfo?.name === 'oz-wiki-plhq'
      && init24.result.serverInfo?.version === LUOC_DO_PHIEN_BAN
      && Boolean(init24.result.capabilities?.tools)
      && Boolean(init24.result.capabilities?.resources),
    JSON.stringify(init24),
  );

  const init25 = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 2,
    method: 'initialize',
    params: { protocolVersion: '2025-03-26' },
  });
  t(
    'initialize (2025-03-26): tương thích cả 2025-03-26',
    init25?.result?.protocolVersion === '2025-03-26',
  );

  const notifInitialized = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    method: 'notifications/initialized',
  });
  t(
    'notifications/initialized (không có id): không trả phản hồi (null)',
    notifInitialized === null,
    JSON.stringify(notifInitialized),
  );

  const pingRes = await server.xuLyYeuCau({ jsonrpc: '2.0', id: 'p-1', method: 'ping' });
  t('ping: trả {} với đúng id', pingRes?.id === 'p-1' && JSON.stringify(pingRes?.result) === '{}');

  const toolsRpc = await server.xuLyYeuCau({ jsonrpc: '2.0', id: 3, method: 'tools/list' });
  t('tools/list: trả đúng 6 công cụ', toolsRpc?.result?.tools?.length === 6);

  const resRpc = await server.xuLyYeuCau({ jsonrpc: '2.0', id: 4, method: 'resources/list' });
  t('resources/list: trả đúng 2 tài nguyên', resRpc?.result?.resources?.length === 2);

  // 3. Cả 6 tools/call trên kho dữ liệu thật
  // 3a. plhq_tra_hieu_luc (chính xác + so_hieu_khac + không thấy + thiếu tham số)
  const hl38 = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 10,
    method: 'tools/call',
    params: { name: 'plhq_tra_hieu_luc', arguments: { so_hieu: '38/2015/TT-BTC' } },
  });
  const hl38Text = hl38?.result?.content?.[0]?.text || '';
  const hl38Sc = hl38?.result?.structuredContent;
  t(
    'tools/call plhq_tra_hieu_luc (38/2015/TT-BTC): CON_HIEU_LUC, nguồn A, CC BY 4.0 & miễn trừ',
    !hl38?.result?.isError
      && hl38Sc?.tim_thay === true
      && hl38Sc.tinh_trang === 'CON_HIEU_LUC'
      && Array.isArray(hl38Sc.nguon_bac_a) && hl38Sc.nguon_bac_a.length > 0
      && hl38Text.includes(GHI_NGUON_CC_BY)
      && hl38Text.includes(MIEN_TRU_PHAP_LY),
    JSON.stringify({ tinh_trang: hl38Sc?.tinh_trang, isError: hl38?.result?.isError }),
  );

  const hlKhac = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 11,
    method: 'tools/call',
    params: { name: 'plhq_tra_hieu_luc', arguments: { so_hieu: '01/2022/TT-BNNPTNN' } },
  });
  t(
    'tools/call plhq_tra_hieu_luc: khớp qua so_hieu_khac -> 01/2022/TT-BNNPTNT',
    hlKhac?.result?.structuredContent?.tim_thay === true
      && hlKhac.result.structuredContent.khop_qua_so_hieu_khac === true
      && hlKhac.result.structuredContent.so_hieu === '01/2022/TT-BNNPTNT',
  );

  const hlErr = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 12,
    method: 'tools/call',
    params: { name: 'plhq_tra_hieu_luc', arguments: {} },
  });
  t(
    'tools/call plhq_tra_hieu_luc: thiếu so_hieu trả isError=true + structuredContent + CC BY',
    hlErr?.result?.isError === true
      && hlErr.result.structuredContent?.ok === false
      && hlErr.result.content?.[0]?.text?.includes(GHI_NGUON_CC_BY),
  );

  // 3b. plhq_tra_dieu_khoan (tách tầng NGUYEN_VAN_NGUON_A vs TOM_TAT_NHAP)
  const dk85 = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 13,
    method: 'tools/call',
    params: { name: 'plhq_tra_dieu_khoan', arguments: { so_hieu: '85/2026/TT-BTC', dieu: 6 } },
  });
  const dk85Sc = dk85?.result?.structuredContent;
  const dk85Text = dk85?.result?.content?.[0]?.text || '';
  t(
    'tools/call plhq_tra_dieu_khoan (85/2026/TT-BTC Điều 6): trả NGUYEN_VAN_NGUON_A, kèm trang_pdf & sha256_pdf',
    !dk85?.result?.isError
      && dk85Sc?.tong_nguyen_van > 0
      && dk85Sc.tong_tom_tat_nhap === 0
      && dk85Sc.nguyen_van_nguon_a.every(
        (x) => x.tang_tin_cay === 'NGUYEN_VAN_NGUON_A' && x.nguyen_van_da_xac_minh === true && x.sha256_pdf,
      )
      && dk85Text.includes('NGUYEN_VAN_NGUON_A')
      && dk85Text.includes(GHI_NGUON_CC_BY),
  );

  const khoTest = await taoKhoTraCuu({ root: ROOT });
  const vbChiTomTat = (khoTest.dieuKhoan?.tom_tat_nhap || []).find(
    (x) => x.so_hieu
      && Array.isArray(x.dieu_khoan)
      && x.dieu_khoan.length > 0
      && !khoTest.dkNguonAByKhoa.has(khoa(x.so_hieu)),
  );
  const soHieuChiTomTat = vbChiTomTat?.so_hieu || '';

  const dkNhap = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 14,
    method: 'tools/call',
    params: { name: 'plhq_tra_dieu_khoan', arguments: { so_hieu: soHieuChiTomTat, limit: 4 } },
  });
  const dkNhapSc = dkNhap?.result?.structuredContent;
  const dkNhapText = dkNhap?.result?.content?.[0]?.text || '';
  t(
    `tools/call plhq_tra_dieu_khoan (${soHieuChiTomTat || 'chỉ TOM_TAT_NHAP'}): phân tách rõ TOM_TAT_NHAP (da_soat=false) và cảnh báo`,
    Boolean(soHieuChiTomTat)
      && dkNhapSc?.tong_nguyen_van === 0
      && dkNhapSc.tong_tom_tat_nhap > 0
      && dkNhapSc.tom_tat_nhap.every((x) => x.tang_tin_cay === 'TOM_TAT_NHAP' && x.da_soat === false)
      && Boolean(dkNhapSc.canh_bao_tang_nhap)
      && dkNhapText.includes('TOM_TAT_NHAP')
      && dkNhapText.includes('da_soat: false'),
  );

  const dkChiA = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 15,
    method: 'tools/call',
    params: { name: 'plhq_tra_dieu_khoan', arguments: { so_hieu: soHieuChiTomTat, chi_nguyen_van: true } },
  });
  t(
    'tools/call plhq_tra_dieu_khoan (chi_nguyen_van=true): không lẫn TOM_TAT_NHAP',
    Boolean(soHieuChiTomTat)
      && dkChiA?.result?.structuredContent?.tong_tom_tat_nhap === 0
      && dkChiA.result.structuredContent.tom_tat_nhap.length === 0,
  );

  // 3c. plhq_hoi_phap_luat (hỏi đáp bình thường + chuyển hướng hs-code-api + không chặn nhầm xác định trước)
  const hoiThuTuc = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 16,
    method: 'tools/call',
    params: { name: 'plhq_hoi_phap_luat', arguments: { cau_hoi: 'nhãn phụ tiếng Việt' } },
  });
  const hoiThuTucSc = hoiThuTuc?.result?.structuredContent;
  t(
    'tools/call plhq_hoi_phap_luat ("nhãn phụ tiếng Việt"): trả kết quả wiki + cảnh báo hiệu lực + CC BY',
    !hoiThuTuc?.result?.isError
      && hoiThuTucSc?.chuyen_huong === null
      && hoiThuTucSc.ket_qua.length > 0
      && hoiThuTuc.result.content[0].text.includes(GHI_NGUON_CC_BY)
      && hoiThuTuc.result.content[0].text.includes(MIEN_TRU_PHAP_LY),
  );

  const hoiHs = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 17,
    method: 'tools/call',
    params: { name: 'plhq_hoi_phap_luat', arguments: { cau_hoi: 'áp mã HS máy nén khí và giải thích quy tắc GIR' } },
  });
  const hoiHsSc = hoiHs?.result?.structuredContent;
  t(
    'tools/call plhq_hoi_phap_luat: câu hỏi áp mã HS/GIR chuyển hướng sang hs-code-api, ket_qua rỗng',
    !hoiHs?.result?.isError
      && hoiHsSc?.chuyen_huong?.he_thong === 'hs-code-api'
      && hoiHsSc.ket_qua.length === 0
      && hoiHs.result.content[0].text.includes('hs-code-api'),
  );

  const hoiXdt = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 18,
    method: 'tools/call',
    params: { name: 'plhq_hoi_phap_luat', arguments: { cau_hoi: 'thủ tục xác định trước mã số theo 85/2026/TT-BTC' } },
  });
  t(
    'tools/call plhq_hoi_phap_luat: không chặn nhầm thủ tục xác định trước mã số',
    hoiXdt?.result?.structuredContent?.chuyen_huong === null
      && (hoiXdt.result.structuredContent.ket_qua.length > 0 || hoiXdt.result.structuredContent.dieu_khoan_nguon_a.length > 0),
  );

  const hoiErr = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 19,
    method: 'tools/call',
    params: { name: 'plhq_hoi_phap_luat', arguments: { cau_hoi: '' } },
  });
  t('tools/call plhq_hoi_phap_luat: thiếu cau_hoi trả isError=true', hoiErr?.result?.isError === true);

  // 3c-bis. Nâng cấp truy hồi Wave 5+: viết tắt, ghim so_hieu, HET_HIEU_LUC không đứng #1, lọc nhiễu NGUYEN_VAN_NGUON_A, gợi ý dự phòng
  const hoiVietTatCo = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 191,
    method: 'tools/call',
    params: { name: 'plhq_hoi_phap_luat', arguments: { cau_hoi: 'C/O form E nộp bản giấy hay điện tử?', limit: 5 } },
  });
  const hoiCoSc = hoiVietTatCo?.result?.structuredContent;
  t(
    'tools/call plhq_hoi_phap_luat: mở rộng viết tắt C/O form E tìm trúng ACFTA / 12/2019/TT-BCT',
    !hoiVietTatCo?.result?.isError
      && (hoiCoSc?.van_ban_lien_quan || []).some((v) => v.so_hieu === '12/2019/TT-BCT')
      && hoiCoSc?.van_ban_lien_quan?.[0]?.tinh_trang !== 'HET_HIEU_LUC',
    JSON.stringify((hoiCoSc?.van_ban_lien_quan || []).slice(0, 3).map((v) => v.so_hieu)),
  );

  const hoiPinBlind = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 192,
    method: 'tools/call',
    params: { name: 'plhq_hoi_phap_luat', arguments: { cau_hoi: 'Quy trình thủ tục hải quan 2538/QĐ-TCHQ quy định gì?', limit: 5 } },
  });
  const hoiPinSc = hoiPinBlind?.result?.structuredContent;
  t(
    'tools/call plhq_hoi_phap_luat: ghim 2538/QĐ-TCHQ lên #1 kèm chua_co_toan_van_trong_kho & goi_y_du_phong sang lớp 2',
    !hoiPinBlind?.result?.isError
      && hoiPinSc?.van_ban_lien_quan?.[0]?.so_hieu === '2538/QĐ-TCHQ'
      && hoiPinSc?.van_ban_lien_quan?.[0]?.khop_so_hieu_truc_tiep === true
      && hoiPinSc?.van_ban_lien_quan?.[0]?.chua_co_toan_van_trong_kho === true
      && hoiPinSc?.do_tin_cay_tra_loi !== 'CAO'
      && hoiPinSc?.goi_y_du_phong?.can_tra_nguon_truc_tiep === true
      && hoiPinSc?.goi_y_du_phong?.cong_cu_de_xuat === 'tim_van_ban_lop_2',
    JSON.stringify({ top: hoiPinSc?.van_ban_lien_quan?.[0], dtc: hoiPinSc?.do_tin_cay_tra_loi }),
  );

  const hoiGtgt = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 193,
    method: 'tools/call',
    params: { name: 'plhq_hoi_phap_luat', arguments: { cau_hoi: 'Thuế GTGT 8% bao giờ hết hạn?', limit: 5 } },
  });
  const hoiGtgtSc = hoiGtgt?.result?.structuredContent;
  t(
    'tools/call plhq_hoi_phap_luat: lọc nhiễu NGUYEN_VAN_NGUON_A (không lọt 137/2020 pháo hoa) & hiện hành đứng #1',
    !hoiGtgt?.result?.isError
      && hoiGtgtSc?.van_ban_lien_quan?.[0]?.tinh_trang !== 'HET_HIEU_LUC'
      && (hoiGtgtSc?.van_ban_lien_quan || []).some((v) => v.so_hieu === '174/2025/NĐ-CP')
      && !(hoiGtgtSc?.dieu_khoan_nguon_a || []).some((d) => d.so_hieu === '137/2020/NĐ-CP' || d.so_hieu === '34/2024/NĐ-CP'),
    JSON.stringify({ topVb: hoiGtgtSc?.van_ban_lien_quan?.slice(0, 2).map((v) => v.so_hieu), dk: hoiGtgtSc?.dieu_khoan_nguon_a?.map((d) => d.so_hieu) }),
  );

  const hoiVphc = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 194,
    method: 'tools/call',
    params: { name: 'plhq_hoi_phap_luat', arguments: { cau_hoi: 'Khai sai mã HS bị phạt VPHC bao nhiêu tiền?', limit: 5 } },
  });
  const hoiVphcSc = hoiVphc?.result?.structuredContent;
  t(
    'tools/call plhq_hoi_phap_luat: HET_HIEU_LUC (128/2020) không đứng #1 trước văn bản hiện hành',
    !hoiVphc?.result?.isError
      && hoiVphcSc?.van_ban_lien_quan?.[0]?.tinh_trang !== 'HET_HIEU_LUC'
      && (hoiVphcSc?.van_ban_lien_quan || []).some((v) => v.so_hieu === '169/2026/NĐ-CP'),
    JSON.stringify((hoiVphcSc?.van_ban_lien_quan || []).slice(0, 3).map((v) => `${v.so_hieu}[${v.tinh_trang}]`)),
  );

  const hoiOos = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 195,
    method: 'tools/call',
    params: { name: 'plhq_hoi_phap_luat', arguments: { cau_hoi: 'Thông tư 999/2099/TT-XYZ quy định về thuế vũ trụ' } },
  });
  const hoiOosSc = hoiOos?.result?.structuredContent;
  t(
    'tools/call plhq_hoi_phap_luat: câu ngoài kho bật KHONG_TIM_THAY + goi_y_du_phong sang lớp 2 & [BỔ SUNG SỔ]',
    !hoiOos?.result?.isError
      && hoiOosSc?.do_tin_cay_tra_loi === 'KHONG_TIM_THAY'
      && hoiOosSc?.goi_y_du_phong?.can_tra_nguon_truc_tiep === true
      && hoiOosSc?.goi_y_du_phong?.cong_cu_de_xuat === 'tim_van_ban_lop_2'
      && hoiOosSc?.goi_y_du_phong?.can_mo_the_bo_sung_so === true
      && hoiOos.result.content[0].text.includes('KHONG_TIM_THAY'),
    JSON.stringify({ dtc: hoiOosSc?.do_tin_cay_tra_loi, dp: hoiOosSc?.goi_y_du_phong }),
  );

  // 3d. plhq_tra_cas
  const casButadien = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 20,
    method: 'tools/call',
    params: { name: 'plhq_tra_cas', arguments: { query: '106-99-0' } },
  });
  t(
    'tools/call plhq_tra_cas ("106-99-0"): tìm đúng 1,3-Butadien nhiều phụ lục',
    !casButadien?.result?.isError
      && casButadien?.result?.structuredContent?.ket_qua?.length >= 2
      && casButadien.result.structuredContent.ket_qua.every((x) => x.cas === '106-99-0'),
  );

  const casKhongCas = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 21,
    method: 'tools/call',
    params: { name: 'plhq_tra_cas', arguments: { query: 'Diisocyanate' } },
  });
  t(
    'tools/call plhq_tra_cas ("Diisocyanate"): tìm được cả dòng khong_co_cas',
    !casKhongCas?.result?.isError && casKhongCas?.result?.structuredContent?.ket_qua?.length >= 1,
  );

  const casPhuLucI = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 211,
    method: 'tools/call',
    params: { name: 'plhq_tra_cas', arguments: { query: '106-99-0', phu_luc: 'I' } },
  });
  t(
    'tools/call plhq_tra_cas (phu_luc="I"): lọc đúng Phụ lục I',
    !casPhuLucI?.result?.isError
      && casPhuLucI?.result?.structuredContent?.ket_qua?.length === 1
      && casPhuLucI.result.structuredContent.ket_qua[0].phu_luc === 'I',
  );

  const casErr = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 212,
    method: 'tools/call',
    params: { name: 'plhq_tra_cas', arguments: {} },
  });
  t('tools/call plhq_tra_cas: thiếu query trả isError=true', casErr?.result?.isError === true);

  // 3e. plhq_chinh_sach_theo_hs
  const cs3808 = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 22,
    method: 'tools/call',
    params: { name: 'plhq_chinh_sach_theo_hs', arguments: { ma_hs: '3808', limit: 10 } },
  });
  const cs3808Sc = cs3808?.result?.structuredContent;
  t(
    'tools/call plhq_chinh_sach_theo_hs ("3808"): trả văn bản chính sách + ranh_gioi hs-code-api',
    !cs3808?.result?.isError
      && cs3808Sc?.ket_qua?.length > 0
      && cs3808Sc.ket_qua.length <= 10
      && String(cs3808Sc.ranh_gioi || '').includes('hs-code-api')
      && cs3808.result.content[0].text.includes('hs-code-api'),
  );

  const csCanhBao = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 221,
    method: 'tools/call',
    params: { name: 'plhq_chinh_sach_theo_hs', arguments: { ma_hs: '28389000' } },
  });
  t(
    'tools/call plhq_chinh_sach_theo_hs ("28389000"): đính canh_bao_ma ngoài biểu thuế',
    !csCanhBao?.result?.isError
      && csCanhBao?.result?.structuredContent?.canh_bao_ma?.includes('28389000')
      && csCanhBao.result.content[0].text.includes('28389000'),
  );

  const csEmpty = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 222,
    method: 'tools/call',
    params: { name: 'plhq_chinh_sach_theo_hs', arguments: {} },
  });
  t('tools/call plhq_chinh_sach_theo_hs: thiếu ma_hs trả isError=true', csEmpty?.result?.isError === true);

  const csBad = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 23,
    method: 'tools/call',
    params: { name: 'plhq_chinh_sach_theo_hs', arguments: { ma_hs: 'khong-hop-le' } },
  });
  t('tools/call plhq_chinh_sach_theo_hs: mã HS sai định dạng trả isError=true', csBad?.result?.isError === true);

  // 3f. plhq_sap_het_hieu_luc
  const sapHet = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 24,
    method: 'tools/call',
    params: { name: 'plhq_sap_het_hieu_luc', arguments: { trong_so_ngay: 60, hom_nay: '2026-11-22' } },
  });
  const sapHetSc = sapHet?.result?.structuredContent;
  t(
    'tools/call plhq_sap_het_hieu_luc: trả văn bản <= 60 ngày sắp tăng dần theo ngày hết hiệu lực',
    !sapHet?.result?.isError
      && sapHetSc?.trong_so_ngay === 60
      && Array.isArray(sapHetSc.ket_qua)
      && sapHetSc.ket_qua.every((x) => x.so_ngay_con_lai >= 0 && x.so_ngay_con_lai <= 60)
      && sapHetSc.ket_qua.every(
        (x, i, a) => i === 0 || a[i - 1].het_hieu_luc_tu <= x.het_hieu_luc_tu,
      ),
  );

  const sapHetErr = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 25,
    method: 'tools/call',
    params: { name: 'plhq_sap_het_hieu_luc', arguments: { trong_so_ngay: -1 } },
  });
  t('tools/call plhq_sap_het_hieu_luc: trong_so_ngay âm trả isError=true', sapHetErr?.result?.isError === true);

  // 4. resources/read (2 tài nguyên)
  const rMeta = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 30,
    method: 'resources/read',
    params: { uri: 'plhq://meta/luoc-do' },
  });
  const metaJson = JSON.parse(rMeta?.result?.contents?.[0]?.text || '{}');
  t(
    'resources/read plhq://meta/luoc-do: đủ metadata 1.5.0, thống kê 2 tầng, CC BY & ranh giới hs-code-api',
    rMeta?.result?.contents?.[0]?.mimeType === 'application/json'
      && metaJson.luoc_do_phien_ban === LUOC_DO_PHIEN_BAN
      && metaJson.thong_ke?.so_van_ban > 2000
      && metaJson.thong_ke?.dieu_khoan_2_tang?.nguyen_van_nguon_a?.so_van_ban > 0
      && metaJson.thong_ke?.dieu_khoan_2_tang?.tom_tat_nhap?.da_soat === false
      && metaJson.ghi_nguon === GHI_NGUON_CC_BY
      && String(metaJson.ranh_gioi_hs_code_api || '').includes('hs-code-api'),
  );

  const rSapHet = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 31,
    method: 'resources/read',
    params: { uri: 'plhq://bao-cao/sap-het-hieu-luc' },
  });
  const sapHetResJson = JSON.parse(rSapHet?.result?.contents?.[0]?.text || '{}');
  t(
    'resources/read plhq://bao-cao/sap-het-hieu-luc: trả JSON danh sách <= 60 ngày + CC BY',
    rSapHet?.result?.contents?.[0]?.mimeType === 'application/json'
      && sapHetResJson.trong_so_ngay === 60
      && Array.isArray(sapHetResJson.ket_qua)
      && sapHetResJson.ghi_nguon === GHI_NGUON_CC_BY,
  );

  // 5. Lỗi JSON-RPC chuẩn: -32600, -32601, -32602, -32700
  const errBadReq = await server.xuLyYeuCau({ jsonrpc: '1.0', id: 40, method: 'ping' });
  t('JSON-RPC -32600: jsonrpc != "2.0" trả Invalid Request', errBadReq?.error?.code === LOI_YEU_CAU);

  const errMethod = await server.xuLyYeuCau({ jsonrpc: '2.0', id: 41, method: 'prompts/khong_co' });
  t('JSON-RPC -32601: method lạ trả Method not found', errMethod?.error?.code === LOI_PHUONG_THUC);

  const errUnknownTool = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 42,
    method: 'tools/call',
    params: { name: 'plhq_khong_ton_tai', arguments: {} },
  });
  t('JSON-RPC -32602: tên công cụ không tồn tại trả Invalid params', errUnknownTool?.error?.code === LOI_THAM_SO);

  const errBadArgsType = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 43,
    method: 'tools/call',
    params: { name: 'plhq_tra_hieu_luc', arguments: ['khong-phai-object'] },
  });
  t('JSON-RPC -32602: params.arguments không phải object trả Invalid params', errBadArgsType?.error?.code === LOI_THAM_SO);

  const errUnknownUri = await server.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 44,
    method: 'resources/read',
    params: { uri: 'plhq://khong/ton-tai' },
  });
  t('JSON-RPC -32602: resource URI lạ trả Invalid params', errUnknownUri?.error?.code === LOI_THAM_SO);

  let parseErrCaught = null;
  const parserCheck = taoBoPhanTichKhung({
    onPayload() {},
    onParseError(err, framing) {
      parseErrCaught = { err, framing };
    },
  });
  parserCheck.push('{json-loi\n');
  parserCheck.end();
  t('Parser framing: bắt JSON lỗi để phát -32700 đúng framing', Boolean(parseErrCaught) && parseErrCaught.framing === 'newline');

  // Batch JSON-RPC và khởi tạo trực tiếp với { store }
  const prebuiltStore = await taoKhoTraCuu({ root: ROOT });
  const directStoreServer = taoMayChuMcp({ store: prebuiltStore });
  const batchRes = await directStoreServer.xuLyYeuCau([
    { jsonrpc: '2.0', id: 'b1', method: 'ping' },
    { jsonrpc: '2.0', method: 'notifications/initialized' },
    { jsonrpc: '2.0', id: 'b2', method: 'tools/list' },
  ]);
  t(
    'taoMayChuMcp({ store }) + JSON-RPC batch: bỏ notification và trả 2 phản hồi',
    Array.isArray(batchRes) && batchRes.length === 2 && batchRes[0].id === 'b1' && batchRes[1].result?.tools?.length === 6,
  );

  // 6. Fallback in_memory trên mock root (không có dist/)
  const mockRoot = makeTmp('oz-mcp-inmem-');
  mkdirSync(join(mockRoot, 'registry', 'van-ban'), { recursive: true });
  for (const f of ['cay-xnk.yaml', 'co-quan.yaml', 'nguon-uy-tin.yaml']) {
    cpSync(join(ROOT, 'registry', f), join(mockRoot, 'registry', f));
  }
  writeFileSync(
    join(mockRoot, 'registry', 'van-ban', '99-2026-tt-btc.yaml'),
    [
      'so_hieu: 99/2026/TT-BTC',
      'loai: THONG_TU',
      'ten: Văn bản kiểm thử fallback in_memory',
      'co_quan: BTC',
      'ngay_ban_hanh: "2026-10-01"',
      'hieu_luc_tu: "2026-10-15"',
      'tinh_trang: CON_HIEU_LUC',
      'nhanh: [hai-quan/thu-tuc]',
      'nguon: [{ url: "https://congbao.chinhphu.vn/x", truy_cap: "2026-10-16" }]',
      'xac_minh: { muc: NGUON_A, hieu_luc_da_doi_chieu: true, ngay: "2026-10-16" }',
    ].join('\n'),
  );
  const inMemServer = taoMayChuMcp({ root: mockRoot, distDir: join(mockRoot, 'khong-ton-tai') });
  const inMemMeta = await inMemServer.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 50,
    method: 'resources/read',
    params: { uri: 'plhq://meta/luoc-do' },
  });
  const inMemMetaJson = JSON.parse(inMemMeta?.result?.contents?.[0]?.text || '{}');
  const inMemLookup = await inMemServer.xuLyYeuCau({
    jsonrpc: '2.0',
    id: 51,
    method: 'tools/call',
    params: { name: 'plhq_tra_hieu_luc', arguments: { so_hieu: '99/2026/TT-BTC' } },
  });
  t(
    'Fallback in_memory: đọc trực tiếp registry/ khi thiếu distDir',
    inMemMetaJson.nguon_du_lieu === 'in_memory'
      && inMemMetaJson.thong_ke?.so_van_ban === 1
      && inMemLookup?.result?.structuredContent?.tim_thay === true
      && inMemLookup.result.structuredContent.tinh_trang === 'CON_HIEU_LUC',
  );

  // 7. E2E spawn thật tiến trình con `node tools/mcp-server.mjs` — FRAMING 1: Newline-delimited JSON
  const newlineInput = [
    JSON.stringify({ jsonrpc: '2.0', id: 101, method: 'initialize', params: { protocolVersion: '2024-11-05' } }),
    JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }), // notification -> không trả dòng nào
    JSON.stringify({ jsonrpc: '2.0', id: 102, method: 'tools/list' }),
    JSON.stringify({
      jsonrpc: '2.0',
      id: 103,
      method: 'tools/call',
      params: { name: 'plhq_tra_hieu_luc', arguments: { so_hieu: '38/2015/TT-BTC' } },
    }),
    JSON.stringify({
      jsonrpc: '2.0',
      id: 104,
      method: 'tools/call',
      params: { name: 'plhq_hoi_phap_luat', arguments: { cau_hoi: 'áp mã HS máy nén khí' } },
    }),
    JSON.stringify({ jsonrpc: '2.0', id: 105, method: 'resources/read', params: { uri: 'plhq://meta/luoc-do' } }),
    JSON.stringify({ jsonrpc: '2.0', id: 106, method: 'method/khong-ton-tai' }),
    '{json-hong-cu-phap',
  ].join('\n') + '\n';

  const nlRes = await chayTienTrinhMcp([], [Buffer.from(newlineInput, 'utf8')]);
  const nlOutStr = nlRes.stdout.toString('utf8');
  const nlLines = nlOutStr.trim().split('\n').filter(Boolean);
  const nlMsgs = nlLines.map((line) => JSON.parse(line));
  t(
    'E2E Newline JSON framing: exit=0, stderr rỗng, phản hồi đủ 7 message (bỏ qua notification) theo từng dòng JSON',
    nlRes.code === 0
      && nlRes.stderr === ''
      && !nlOutStr.includes('Content-Length:')
      && nlMsgs.length === 7
      && nlMsgs[0].id === 101 && nlMsgs[0].result?.protocolVersion === '2024-11-05'
      && nlMsgs[1].id === 102 && nlMsgs[1].result?.tools?.length === 6
      && nlMsgs[2].id === 103 && nlMsgs[2].result?.structuredContent?.tinh_trang === 'CON_HIEU_LUC'
      && nlMsgs[3].id === 104 && nlMsgs[3].result?.structuredContent?.chuyen_huong?.he_thong === 'hs-code-api'
      && nlMsgs[4].id === 105 && nlMsgs[4].result?.contents?.[0]?.uri === 'plhq://meta/luoc-do'
      && nlMsgs[5].id === 106 && nlMsgs[5].error?.code === LOI_PHUONG_THUC
      && nlMsgs[6].id === null && nlMsgs[6].error?.code === LOI_PARSE,
    JSON.stringify({ code: nlRes.code, stderr: nlRes.stderr, count: nlMsgs.length }),
  );

  // 8. E2E spawn thật tiến trình con `node tools/mcp-server.mjs --dist ... --root ...` — FRAMING 2: Content-Length
  const clPayloads = [
    { jsonrpc: '2.0', id: 201, method: 'initialize', params: { protocolVersion: '2025-03-26' } },
    { jsonrpc: '2.0', method: 'notifications/initialized' }, // notification -> không trả frame
    { jsonrpc: '2.0', id: 202, method: 'ping' },
    {
      jsonrpc: '2.0',
      id: 203,
      method: 'tools/call',
      params: { name: 'plhq_tra_dieu_khoan', arguments: { so_hieu: '85/2026/TT-BTC', dieu: 6 } },
    },
    {
      jsonrpc: '2.0',
      id: 204,
      method: 'tools/call',
      params: { name: 'plhq_tra_cas', arguments: { query: '106-99-0' } },
    },
    {
      jsonrpc: '2.0',
      id: 205,
      method: 'tools/call',
      params: { name: 'plhq_chinh_sach_theo_hs', arguments: { ma_hs: '3808', limit: 5 } },
    },
    {
      jsonrpc: '2.0',
      id: 206,
      method: 'resources/read',
      params: { uri: 'plhq://bao-cao/sap-het-hieu-luc' },
    },
    {
      jsonrpc: '2.0',
      id: 207,
      method: 'tools/call',
      params: { name: 'plhq_khong_hop_le', arguments: {} },
    },
  ];
  const clFrames = clPayloads.map((p) => dongGoiThongDiep(p, 'content-length'));
  // Thêm 1 frame Content-Length lỗi cú pháp JSON (tính theo byte length)
  const badBody = Buffer.from('{"jsonrpc":"2.0",', 'utf8');
  clFrames.push(Buffer.concat([Buffer.from(`Content-Length: ${badBody.length}\r\n\r\n`, 'ascii'), badBody]));

  // Chia nhỏ thành nhiều mảnh ngẫu nhiên (cắt ngang header và UTF-8 đa byte) để kiểm stream parser
  const joinedCl = Buffer.concat(clFrames);
  const splitChunks = [];
  for (let i = 0; i < joinedCl.length; i += 29) {
    splitChunks.push(joinedCl.subarray(i, Math.min(i + 29, joinedCl.length)));
  }

  const clRes = await chayTienTrinhMcp(
    ['--dist', join(ROOT, 'dist'), '--root', ROOT],
    splitChunks,
  );
  const clMsgs = giaiMaPhanHoiContentLength(clRes.stdout);
  t(
    'E2E Content-Length framing (UTF-8 chunked + --dist/--root): exit=0, stderr rỗng, đủ 8 frame chuẩn byte-length',
    clRes.code === 0
      && clRes.stderr === ''
      && clMsgs.length === 8
      && clMsgs.every((m) => m.len === m.bodyBytes)
      && clMsgs[0].json.id === 201 && clMsgs[0].json.result?.protocolVersion === '2025-03-26'
      && clMsgs[1].json.id === 202 && JSON.stringify(clMsgs[1].json.result) === '{}'
      && clMsgs[2].json.id === 203 && clMsgs[2].json.result?.structuredContent?.tong_nguyen_van > 0
      && clMsgs[3].json.id === 204 && clMsgs[3].json.result?.structuredContent?.ket_qua?.length >= 2
      && clMsgs[4].json.id === 205 && clMsgs[4].json.result?.structuredContent?.ket_qua?.length === 5
      && clMsgs[5].json.id === 206 && clMsgs[5].json.result?.contents?.[0]?.uri === 'plhq://bao-cao/sap-het-hieu-luc'
      && clMsgs[6].json.id === 207 && clMsgs[6].json.error?.code === LOI_THAM_SO
      && clMsgs[7].json.id === null && clMsgs[7].json.error?.code === LOI_PARSE,
    JSON.stringify({ code: clRes.code, stderr: clRes.stderr, count: clMsgs.length }),
  );

  // 9. E2E tương tác giữ stdin mở giữa các lượt (kiểm không bị nghẽn buffer trước EOF + Content-Type header)
  const interactiveOk = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [join(ROOT, 'tools', 'mcp-server.mjs')], {
      cwd: ROOT,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const timer = setTimeout(() => {
      try { child.kill('SIGKILL'); } catch {}
      reject(new Error('Interactive MCP child timeout'));
    }, 15000);

    let step = 0;
    let outBuf = Buffer.alloc(0);
    let errText = '';
    const replies = [];
    child.stderr.on('data', (c) => { errText += c.toString('utf8'); });
    child.on('error', (err) => { clearTimeout(timer); reject(err); });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code, errText, replies });
    });

    child.stdout.on('data', (chunk) => {
      outBuf = Buffer.concat([outBuf, chunk]);
      try {
        while (outBuf.length > 0) {
          const sep = outBuf.indexOf('\r\n\r\n');
          if (sep === -1) break;
          const hdr = outBuf.subarray(0, sep).toString('ascii');
          const m = hdr.match(/Content-Length:\s*(\d+)/i);
          if (!m) break;
          const n = Number(m[1]);
          if (outBuf.length < sep + 4 + n) break;
          const msg = JSON.parse(outBuf.subarray(sep + 4, sep + 4 + n).toString('utf8'));
          outBuf = outBuf.subarray(sep + 4 + n);
          replies.push(msg);

          if (step === 0 && msg.id === 301) {
            step = 1;
            const notif = Buffer.from(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }), 'utf8');
            const req2 = Buffer.from(
              JSON.stringify({ jsonrpc: '2.0', id: 302, method: 'tools/call', params: { name: 'plhq_sap_het_hieu_luc', arguments: { hom_nay: '2026-11-22' } } }),
              'utf8',
            );
            child.stdin.write(Buffer.concat([
              Buffer.from(`Content-Type: application/vscode-jsonrpc; charset=utf-8\r\nContent-Length: ${notif.length}\r\n\r\n`, 'ascii'),
              notif,
              Buffer.from(`Content-Length: ${req2.length}\r\n\r\n`, 'ascii'),
              req2,
            ]));
          } else if (step === 1 && msg.id === 302) {
            child.stdin.end();
          }
        }
      } catch (e) {
        clearTimeout(timer);
        try { child.kill('SIGKILL'); } catch {}
        reject(e);
      }
    });

    const req1 = Buffer.from(JSON.stringify({ jsonrpc: '2.0', id: 301, method: 'initialize', params: { protocolVersion: '2025-03-26' } }), 'utf8');
    child.stdin.write(Buffer.concat([
      Buffer.from(`Content-Type: application/vscode-jsonrpc; charset=utf-8\r\nContent-Length: ${req1.length}\r\n\r\n`, 'ascii'),
      req1,
    ]));
  });
  t(
    'E2E tương tác giữ stdin mở (Content-Type + Content-Length): trả từng lượt không treo, exit=0',
    interactiveOk.code === 0
      && interactiveOk.errText === ''
      && interactiveOk.replies.length === 2
      && interactiveOk.replies[0].id === 301
      && interactiveOk.replies[1].id === 302
      && Array.isArray(interactiveOk.replies[1].result?.structuredContent?.ket_qua),
    JSON.stringify({ code: interactiveOk.code, replies: interactiveOk.replies.length }),
  );
} finally {
  for (const d of tmpDirs) {
    try { rmSync(d, { recursive: true, force: true }); } catch {}
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
