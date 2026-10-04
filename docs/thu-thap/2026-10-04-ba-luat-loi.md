# Thu thập và bàn giao ba luật lõi — 04/10/2026

Nhận việc: [issue #6](https://github.com/ozvietnam/oz-wiki-plhq/issues/6#issuecomment-5978098830). Agent: Codex · Người vận hành: ozvietnam.

## Kết quả

| Luật | Số trang PDF | Trạng thái trong repo |
|---|---:|---|
| 54/2014/QH13 — Hải quan | 54 | Agent khác đã lưu PDF trên main; giữ nguyên |
| 107/2016/QH13 — Thuế xuất khẩu, thuế nhập khẩu | 29 | Bổ sung URL PDF; chưa nạp nhị phân |
| 05/2017/QH14 — Quản lý ngoại thương | 52 | Bổ sung URL PDF; chưa nạp nhị phân |

Các PDF đã tải về máy, kiểm tra đầu tệp PDF, kích thước và SHA-256; kiểm tra hình ảnh trang đầu/cuối. Với 107/2016/QH13 đã xem thêm trang 14 (cuối nội dung luật); trang 15–29 là phụ lục khung thuế suất, cần giữ khi OCR. PDF đều là bản quét ảnh, chưa có lớp chữ toàn văn.

[Danh mục tải và SHA-256](2026-10-04-ba-luat-loi.json) chứa URL chính thức, số byte, số trang và đường dẫn dự kiến. Thông tin nguồn thuộc Cổng Chính phủ; chưa kiểm chứng chữ ký số bằng công cụ mật mã, chưa đối chiếu hiệu lực hiện tại và các luật sửa đổi.

## Việc còn lại và trả phạm vi

Phần tải PDF lên GitHub chưa hoàn tất: Git tại máy không có thông tin đăng nhập; gọi tải blob PDF qua kết nối bị treo. PR này chỉ chứa các URL, danh mục kiểm tra và bàn giao; không đặt đường dẫn toàn văn cho tệp chưa có trong repo.

Trả việc nạp hai PDF 107/2016/QH13 và 05/2017/QH14 cho luồng tải & làm sạch tại issue #6. Agent nhận tiếp bình luận rõ hai số hiệu trước khi làm. Chạy từ gốc repo:

```bash
node tools/nap.mjs 'https://datafiles.chinhphu.vn/cpp/files/vbpq/2016/05/107.signed.pdf' --so-hieu '107/2016/QH13' --ghi
node tools/nap.mjs 'https://datafiles.chinhphu.vn/cpp/files/vbpq/2017/07/05.signed.pdf' --so-hieu '05/2017/QH14' --ghi
npm test
```

Đối chiếu SHA-256 với danh mục trước khi commit; nếu khác, ghi nhận nguồn thay đổi để đối chiếu, không ghi đè raw đã có. OCR + kiểm tra từng điều khoản thuộc luồng đọc hiểu (#10); xác minh hiệu lực hiện tại thuộc luồng hiệu lực (#4).
