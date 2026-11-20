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

### Phụ lục III — băng rôn tại trang 85 (nhóm 1–2), Phụ lục IV — băng rôn tại trang 87 (chưa chắc)

**CHƯA TÌM ĐƯỢC nguyên văn** quy tắc hỗn hợp. Chỗ khả dĩ: dòng ghi chú ngay dưới băng rôn p85 (đã dựng ảnh `/tmp/nd24/pl85-n1.png`, `pl85-notes.png` — chưa phiên dịch xong) và thân NĐ trang 1–12. Sẽ chép **nguyên văn + trang** ngay khi đọc được.

## Bản đồ tài liệu (đã dò bằng ảnh, độ phân giải cao)

| Phần | Trang PDF | Trạng thái |
|---|---|---|
| Thân Nghị định | 1–12 | chưa đọc (nơi khả dĩ chứa quy tắc hỗn hợp) |
| PHỤ LỤC I (băng rôn + 1 bảng) | 13–14 | **HOÀN TẤT 10/10 dòng** |
| Bảng TT 1–33 (thuốc BVTV?) | 15–16 | đã nạp 21 dòng |
| Bảng TT 34 trở đi (lặp alphabet từ B) | 17 | đã nạp 4 dòng (TT 34–37) |
| Khối băng rôn lớn (chưa đọc được chữ) | 18 | ranh giới phụ lục — XEM CẢNH BÁO dưới |
| Băng rôn con của PL II (chưa xác minh) | ~26, 30, 56, 64, 71, 79 | cần đọc để tách mục |
| **PHỤ LỤC III — băng rôn đọc được chữ "PHỤ LỤC III"** | **85** trở đi | ✅ xác nhận lượt OZV-1584: PL II kết thúc ≤ trang 84; nhóm 1/2 chưa tách, chưa nạp dòng |
| Băng rôn chữ "PHỤ LỤC" + số La Mã (khả năng IV, **chưa chắc**) | 87 | cần soát lại ở zoom cao trước khi ghi nhận |
| Đoạn cuối | 88 | chưa đọc |

**Ghi chú kỹ thuật lượt OZV-1584 (đọc scan):** dò dòng bằng row-darkness bị dính khối vì **viền dọc của bảng** làm mọi hàng đều "tối" — phải **loại cột viền dọc** (cột tối ở >50% chiều cao vùng xét) trước khi dò hàng; sau đó cắt từng dòng theo bbox mực, **chia đoạn 700 px** (≈ đọc ở ~4,85× zoom gốc PDF), **xếp dọc + đệm trắng** (cao ≥ 2,95× rộng) thì công cụ đọc ảnh mới hiển thị (ảnh tỉ lệ ngang/vuông không hiển thị). Script tái dùng: `/tmp/nd24/strip.js` (đã vá vcol) + render sẵn `/tmp/nd24/hi85/p85–p88.png` (scale 5). Lưu ý `/tmp` có thể bị xoá giữa các lượt — render lại bằng `/tmp/nd24/render.js`.

## CẢNH BÁO cấu trúc (lượt 3/3, cần quyết trước khi nạp tiếp)

1. **Đứt thứ tự alphabet ở TT 33→34:** trang 16 kết thúc ở STT 33 (Chlormequat, chữ *Ch*), trang 17 bắt đầu TT 34 = **Benomyl** (chữ *Be*) — thứ tự alphabet lặp lại từ "B". Cả 4 dòng TT 34–37 đều là thuốc BVTV thật, đúng thứ tự alphabet trong nội bộ (Benomyl → Bromadiolone → Bromoxynil → Bromoxynil octanoat), CAS đạt checksum và trùng số CAS công khai. → Bảng p15–17 **không phải một danh sách alphabet duy nhất**: có thể xếp theo nhóm chất, hoặc TT 34+ mở đầu một danh sách con mới.
2. **Trang 18 có khối băng rôn lớn** (bố cục khác hẳn trang bảng thường) — lượt 1 từng kết luận "PL I = p13–17, PL II = p18–88", lượt 2 đổi thành "PL I = p13–14, PL II = p15–88". **Chưa đọc được nguyên văn chữ băng rôn p15/p18** (ảnh scan mờ ở khối tiêu đề) nên CHƯA chốt được: khối TT 1–37+ (p15–17) thuộc PHỤ LỤC I hay II. Nhãn `phu_luc` của 25 dòng p15–17 hiện ghi `II` là **tạm theo giả thuyết lượt 2** — có thể phải đổi cả cột `phu_luc`/`muc` khi chốt được băng rôn.
3. Hệ quả: trước khi nạp tiếp hàng nghìn dòng, cần (a) đọc được băng rôn p18 (thử render lại vùng tiêu đề ở scale cao hơn / đổi ngưỡng ảnh), hoặc (b) giám đốc quyết định cách ghi tạm.

## Trạng thái nạp dữ liệu

- **PL III (trang 85 trở đi) + PL IV (trang 87 trở đi, chưa chắc):** lượt OZV-1584 mới **xác nhận được băng rôn "PHỤ LỤC III" ở trang 85** (đọc trực tiếp chữ in, không suy đoán); **chưa nạp dòng nào** — bảng bắt đầu ~y1350 trang 85 trở xuống, cần đọc tiếp theo kỹ thuật strip 700 px ở trên. Khi nạp: thêm cột `nhom` (PL III nhóm 1/2) vào cuối header, để trống cho các dòng cũ.
- PL I: **10/10 dòng — HOÀN TẤT** (trang 14; bảng in PL I không có cột CAS, số CAS tra từ cơ sở dữ liệu CAS công khai, đã checksum — xem ghi chú lượt 1 trong lịch sử git).
- Khối p15–17 (tạm ghi `phu_luc=II, muc=1`): **25 dòng** (21 dòng lượt 2 + 4 dòng TT 34–37 lượt 3). Cột `muc` tạm ghi 1 cho mọi dòng — **chưa xác minh ranh giới mục**; xem CẢNH BÁO cấu trúc trên.
- **Dòng biết còn thiếu ngay trong phần đã quét** (tên/CAS chưa đọc rõ, KHÔNG bịa): STT 6, 7, 8, 14, 15, 16, 17, 18, 21, 22 (trang 15); STT 29, 32 (trang 16); STT 38 trở đi (trang 17).
- Số dòng chỉ hoàn tất khi README này ghi "HOÀN TẤT" và đủ cả 2 phụ lục.

## Kết quả tra thử cho ca OZV-1575

**Bột nhôm — STT 20 (tạm PL II), CAS 7429-90-5, công thức Al** (đọc trực tiếp trang 15, checksum đạt). Hai mã tra thử còn lại (64742-94-5 solvent naphtha, 1330-20-7 xylene) nằm sâu hơn trong bảng — chưa tra được ở phạm vi đã nạp; ghi tạm: **chưa thấy trong phần đã nạp (STT 1–37)**.
