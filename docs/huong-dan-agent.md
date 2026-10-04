# Hướng dẫn cho AI agent đóng góp

Kho này nhận đóng góp từ agent (Claude Code, Codex, Gemini CLI, Cursor, agent tự chạy theo lịch...).
Agent phải làm việc như một người đóng góp cẩn thận: có nguồn, có dấu vết, nhỏ, kiểm được.

## Trước khi làm

1. Đọc `README.md` (phần "Quy tắc riêng của thư viện" + schema LuminaWiki), tệp này, và
   [luồng công việc](luong-cong-viec.md) của việc mình nhận.
2. Lấy việc từ: issue có nhãn `luong:*` chưa ai nhận, hoặc [bao-cao/diem-mu.md](../bao-cao/diem-mu.md)
   (chạy `npm run diem-mu` để có bản mới nhất).
3. Ghi một bình luận "nhận" vào issue (ghi rõ là agent và người vận hành) để không trùng việc.

## Khi làm

- **Một PR một việc nhỏ:** một văn bản, một nhóm văn bản cùng ngày, hoặc một trang wiki. PR lớn khó duyệt.
- **Mỗi khẳng định phải có nguồn.** Tình trạng hiệu lực chỉ được đánh `hieu_luc_da_doi_chieu: true` khi
  đã mở nguồn bậc A; ghi `xac_minh.boi: <tên-agent>@<người-vận-hành>` và `ngay`.
- **Không suy ra quan hệ thay thế từ tên văn bản.** Phải thấy điều khoản hiệu lực / điều khoản thi hành
  (thường là điều cuối) nói "thay thế", "bãi bỏ", "hết hiệu lực". Ghi `can_cu` (điều, khoản, điểm).
- **Không sửa `raw/` đã có.** Chỉ thêm tệp mới qua `tools/nap.mjs` hoặc skill LuminaWiki.
- **Không xoá văn bản khỏi sổ.** Văn bản hết hiệu lực vẫn giữ — người khai cần biết vì sao không dùng nữa.
- **Không đưa thông tin khách hàng, tờ khai, hợp đồng, giá** vào kho.
- Chạy `npm test` trước khi mở PR. Đỏ thì sửa, không bỏ qua test.

## Mở PR

- Tiêu đề: `<luồng>: <việc>` — ví dụ `hieu-luc: 28/2026/TT-BCT thay 11/2022/TT-BCT`.
- Mô tả theo mẫu PR: nguồn đã mở (URL bậc A), điều khoản căn cứ, điểm mù đã xử lý (mã), phần chưa chắc.
- Ghi ở cuối: `Agent: <tên> · Người vận hành: <github>`.

## Gợi ý lịch cho agent chạy tự động

| Luồng | Nhịp | Việc |
|---|---|---|
| Do thám | hằng ngày | Quét nguồn A + cổng 8 bộ; tạo văn bản mới |
| Hiệu lực | hằng tuần | Xử lý `SAP_HET_HIEU_LUC`, `SAP_CO_HIEU_LUC`, `MAU_THUAN_HIEU_LUC` |
| Truy vết nguồn | liên tục | 5–10 văn bản `KHONG_NGUON_A` mỗi lượt, ưu tiên `trich_dan_trong_bieu_thue` cao |
| Tải & làm sạch | liên tục | Văn bản đã có nguồn A nhưng chưa có `toan_van` |
| Đọc hiểu | theo đợt | Văn bản có toàn văn mà chưa có trang wiki |
| Điểm mù | hằng tuần (tự động bằng Actions) | Đề xuất luật phát hiện mới khi thấy kiểu lỗi lặp lại |
