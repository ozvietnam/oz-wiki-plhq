# Bảng tra CAS — NĐ 24/2026/NĐ-CP (Phụ lục I, II) — quy tắc & trạng thái nạp

Kèm theo [`24-2026-nd-cp-cas.csv`](24-2026-nd-cp-cas.csv) — mỗi dòng: `cas · ten_chat · ma_hoa_chat · cong_thuc · phan_loai · phu_luc · muc · so_thu_tu · nguon`.

**Văn bản:** Nghị định 24/2026/NĐ-CP ngày 17/01/2026 — Quy định các danh mục hoá chất thuộc phạm vi điều chỉnh của Luật Hoá chất 69/2025/QH15.
**Nguồn bậc A (toàn văn PDF bản ký, 88 trang):** <https://datafiles.chinhphu.vn/cpp/files/vbpq/2026/4/24-ndcp.signed.pdf> (truy cập 2026-11-20); trang giới thiệu: <https://vanban.chinhphu.vn/?pageid=27160&docid=216671>.

## Cách trích xuất (PDF scan, không lớp chữ)

- Quy trình: render trang PDF ở độ phân giải cao (pdfjs-dist, scale 8 ≈ 4820×6776 px) → **đọc mắt từng dòng từ ảnh gốc** → ghi CSV → **kiểm checksum CAS bằng máy cho từng dòng** (`node /tmp/nd24/cascheck.js` cục bộ; quy tắc: chữ số kiểm = (Σ chữ số × vị trí từ phải sang, bắt đầu 1) **mod 10**). Hiện **31/31 dòng trong CSV đạt checksum**.
- **CẢNH BÁO công cụ:** mô hình thị giác GLM (analyze_image) **bịa hàng loạt** trên bảng scan dày này (trả về cả số TT lẫn tên hoá chất không có trên trang, đã đối chứng ở trang 15–16) — **không dùng GLM làm nguồn**, chỉ dùng đọc mắt + checksum + tính liên tục số TT (≈24 dòng/trang PL II).

## Quy tắc hỗn hợp

### Phụ lục I — hoá chất cơ bản theo ngành (trang 13–14)

KHÔNG có quy tắc hỗn hợp trong văn bản — PL I liệt kê hoá chất cơ bản theo ngành (cột "Phân loại"), không điều chỉnh hỗn hợp. *(Đối chiếu lại nguyên văn khi soát tổng thể.)*

### Phụ lục II — hoá chất sản xuất, kinh doanh CÓ ĐIỀU KIỆN (8 mục, trang 15–88)

**CHƯA TÌM ĐƯỢC nguyên văn** quy tắc hỗn hợp — cần đọc kỹ phần đầu PL II / thân NĐ (trang 1–12). Giả thuyết đang kiểm: hỗn hợp chứa thành phần thuộc danh mục với hàm lượng trên 5% khối lượng thì quản lý như hoá chất có điều kiện. Sẽ chép **nguyên văn điều khoản + trang** vào đây ngay khi tìm được.

## Bản đồ tài liệu (đã dò bằng ảnh, độ phân giải cao)

| Phần | Trang PDF | Trạng thái |
|---|---|---|
| Thân Nghị định | 1–12 | chưa đọc (nơi khả dĩ chứa quy tắc hỗn hợp) |
| PHỤ LỤC I (băng rôn + 1 bảng) | 13–14 | **HOÀN TẤT 10/10 dòng** |
| PHỤ LỤC II băng rôn + TT 1–24 | 15 | đã nạp 12 dòng |
| PL II tiếp (≈24 dòng/trang) | 16–88 | đã nạp 9 dòng (trang 16); còn lại ~1.700 dòng |
| Băng rôn con 8 mục PL II (chưa xác minh) | ~26, 30, 56, 64, 71, 79, 85 | cần đọc để tách mục |

## Trạng thái nạp dữ liệu

- PL I: **10/10 dòng — HOÀN TẤT** (trang 14; bảng in PL I không có cột CAS, số CAS tra từ cơ sở dữ liệu CAS công khai, đã checksum — xem ghi chú lượt 1 trong lịch sử git).
- PL II: **21/~1.750 dòng** (trang 15–16; ước tính 24 dòng/trang × 73 trang + 1). Cột `muc` tạm ghi 1 cho mọi dòng PL II — **chưa xác minh ranh giới 8 mục** (băng rôn con chưa đọc); sẽ soát lại khi nạp sâu hơn.
- **Dòng biết còn thiếu ngay trong trang 15–16** (tên/CAS chưa đọc rõ, KHÔNG bịa): STT 6, 7, 8, 14, 15, 16, 17, 18, 21, 22 (trang 15); STT 29, 32, 34 trở đi (trang 16).
- Số dòng chỉ hoàn tất khi README này ghi "HOÀN TẤT" và đủ cả 2 phụ lục.

## Kết quả tra thử cho ca OZV-1575

**Bột nhôm — PL II, STT 20, CAS 7429-90-5, công thức Al** (đọc trực tiếp trang 15, checksum đạt). Hai mã tra thử còn lại (64742-94-5 solvent naphtha, 1330-20-7 xylene) nằm sâu hơn trong bảng — chưa tra được ở phạm vi đã nạp; ghi tạm: **chưa thấy trong phần đã nạp (STT 1–33)**.
