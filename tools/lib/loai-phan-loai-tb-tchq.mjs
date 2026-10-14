// Phân loại TB-TCHQ theo 3 nhóm nghiệp vụ (research / sổ đăng ký).
// Không bịa: thiếu toàn văn → CHUA_XAC_DINH.
//
// Mã bền:
//   XAC_DINH_TRUOC          — xin xác nhận / xác định trước mã số
//   KIEM_TRA_XAC_DINH_LAI   — kiểm tra và xác định lại (trong kho: thường là
//                             tiêu đề “Kết quả phân loại…” — ghi rõ ở can_cu)
//   DINH_CHINH              — đính chính kết quả
//   CHUA_XAC_DINH           — chưa đủ tín hiệu (chưa có noi_dung / bot-wall)
//
// can_cu: chuỗi ngắn giải thích căn cứ (title_… / proxy_… / loai_vb_… / chua_co_toan_van).
//
// Lưu ý: attributes.loaiTB bên lô hs-code-api vẫn dùng KET_QUA_PHAN_LOAI
// (= cùng họ với KIEM_TRA_XAC_DINH_LAI ở đây).

export const LOAI_PHAN_LOAI = [
  'XAC_DINH_TRUOC',
  'KIEM_TRA_XAC_DINH_LAI',
  'DINH_CHINH',
  'CHUA_XAC_DINH',
];

/** @param {string|null|undefined} noiDung @param {string|null|undefined} loaiVb */
export function phanLoaiTbTchq(noiDung, loaiVb = '') {
  const nd = String(noiDung || '');
  const head = nd.slice(0, 1200);
  const loai = String(loaiVb || '').trim();
  const bot = /Vercel Security Checkpoint|We.?re verifying your browser/i.test(nd.slice(0, 500));
  const empty = !nd.trim();

  const dcTitle = /(?:VỀ\s+VIỆC\s+)?ĐÍNH\s*CHÍNH|THÔNG\s*BÁO\s+ĐÍNH\s*CHÍNH|ĐÍNH\s*CHÍNH\s+THÔNG\s*BÁO/i.test(head);
  const dcLoai = /đính\s*chính|DINH_CHINH/i.test(loai);
  const xdTitle = /VỀ\s+KẾT\s*QUẢ\s+XÁC\s*ĐỊNH\s*TRƯỚC|XÁC\s*ĐỊNH\s*TRƯỚC\s*MÃ\s*SỐ|XÁC\s*NHẬN\s*TRƯỚC\s*MÃ\s*SỐ/i.test(head);
  const xdLoai = /xác\s*định\s*trước|XAC_DINH_TRUOC/i.test(loai);
  const ktExact = /KIỂM\s*TRA\s+VÀ\s+XÁC\s*ĐỊNH\s*LẠI(?:\s+MÃ\s*SỐ)?/i.test(head);
  const kqTitle = /VỀ\s+KẾT\s*QUẢ\s+PHÂN\s*LOẠI|KẾT\s*QUẢ\s+PHÂN\s*LOẠI\s+ĐỐI\s+VỚI/i.test(head);
  const kqLoai = loai === 'Phân loại hàng hóa' || loai === 'KET_QUA_PHAN_LOAI'
    || /^phân loại|^kết quả phân loại/i.test(loai);

  if (bot || empty) {
    if (dcLoai) return { ma: 'DINH_CHINH', can_cu: 'loai_vb_dinh_chinh_body_blocked' };
    if (xdLoai) return { ma: 'XAC_DINH_TRUOC', can_cu: 'loai_vb_xac_dinh_truoc_body_blocked' };
    if (kqLoai) return { ma: 'KIEM_TRA_XAC_DINH_LAI', can_cu: 'proxy_loai_vb_phan_loai_body_blocked' };
    return { ma: 'CHUA_XAC_DINH', can_cu: empty ? 'chua_co_toan_van' : 'bot_wall' };
  }

  if (dcTitle) return { ma: 'DINH_CHINH', can_cu: 'title_dinh_chinh' };
  if (dcLoai && !xdTitle && !kqTitle) return { ma: 'DINH_CHINH', can_cu: 'loai_vb_dinh_chinh' };

  if (ktExact) return { ma: 'KIEM_TRA_XAC_DINH_LAI', can_cu: 'exact_kiem_tra_xac_dinh_lai' };

  if (xdTitle) return { ma: 'XAC_DINH_TRUOC', can_cu: /XÁC\s*NHẬN\s*TRƯỚC/i.test(head) ? 'title_xac_nhan_truoc' : 'title_xac_dinh_truoc' };
  if (xdLoai && !kqTitle) return { ma: 'XAC_DINH_TRUOC', can_cu: 'loai_vb_xac_dinh_truoc' };

  if (kqTitle) return { ma: 'KIEM_TRA_XAC_DINH_LAI', can_cu: 'proxy_ket_qua_phan_loai_title' };
  if (kqLoai) return { ma: 'KIEM_TRA_XAC_DINH_LAI', can_cu: 'proxy_loai_vb_phan_loai_hang_hoa' };

  return { ma: 'CHUA_XAC_DINH', can_cu: 'khong_khop_tin_hieu' };
}

/** Map packer loaiTB → mã sổ (research). */
export function tuLoaiTB(loaiTB) {
  if (loaiTB === 'XAC_DINH_TRUOC') return 'XAC_DINH_TRUOC';
  if (loaiTB === 'DINH_CHINH') return 'DINH_CHINH';
  if (loaiTB === 'KET_QUA_PHAN_LOAI') return 'KIEM_TRA_XAC_DINH_LAI';
  return 'CHUA_XAC_DINH';
}
