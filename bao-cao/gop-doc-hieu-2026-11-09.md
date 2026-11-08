# Báo cáo gộp kết quả trích điều khoản (Gemma) vào `data/doc-hieu`

Ngày: 2026-11-08 · Người làm: Giám đốc (z.ai GLM) theo đề bài `gop-doc-hieu-0911`.

## Kết quả gộp

- **32 văn bản** trong `gemma-ra-dk` (187 tệp đoạn `-cNN`), gộp thành **27 tệp** `data/doc-hieu/<slug>.dieu.jsonl`: **25 tệp mới**, **2 tệp có sẵn được bổ sung** (01-2026-tt-bnnmt +1 điều, 27-2026-tt-byt +1 điều). 36/2024/QH15 gộp 2 phần `-body` + `-tiep` thành một; 5 văn bản không có số điều hợp lệ nên không ra tệp — xem dưới.
- **537 điều** được ghi kèm dấu hiệu nguồn `nguon_trich: gemma-4-e4b`. Không xoá bất kỳ điều cũ nào.
- Công cụ: `tools/gop-doc-hieu.py` (chỉ thư viện chuẩn, chạy lại cho cùng kết quả — đã chạy lần 2 ngay sau lần 1, thêm 0 điều). Lưu ý kỹ thuật: nhiều tệp Gemma ghi **nhiều object JSON dính liền một dòng**, và một số tệp ghi số điều trần (`"dieu": "5"`, không chữ "Điều") — công cụ đọc bằng `raw_decode` tuần tự để xử lý cả hai.
- 4 văn bản không ra tệp vì không có số điều đọc được: `755-tchq-gsql-2020-ban-dich-tieng-anh` (bản dịch, ghi "Không có số điều"), `49-pl2-2026-tt-bxd` (phụ lục, "N/A"), `28-2026-nd-cp-dieu3` (trích đoạn không đủ bối cảnh), `37-2026-nd-cp` (đã đủ điều trong tệp có sẵn).

## Kiểm chứng điều bịa (dựa theo đề bài)

- **455 điều bị loại** vì chữ `Điều N` không có trong văn bản nguồn của đoạn — tức bịa. Ví dụ tiêu biểu: 09/2024/TT-BYT bị "trích" thêm Điều 73–75 mà văn bản gốc không có.
- **~2.500 dòng lỗi/không phải điều** bị bỏ: phần lớn là các dòng Gemma trích từ **danh mục, phụ lục** (`dieu: "-"`, `""`, `"N/A"`, mã HS kiểu `1211.90.18`) — đây là hàng mục, không phải điều luật, việc bỏ là đúng.

## Chấm chất lượng 30 mẫu ngẫu nhiên (seed 911)

Đối chiếu từng điều với trích đoạn nguồn quanh chữ `Điều N`:

| Điểm | Số mẫu | Ghi chú |
|---|---|---|
| Đúng rõ | **27** | Tên điều, tóm tắt khớp nguyên văn nguồn |
| Đúng đại ý | 2 | Nội dung đúng nhưng diễn đạt vụng (mẫu 328-qd-ttg Điều 4, 128-2020 Điều 35) |
| Không chắc | 1 | 155-2026 Điều 8 — trích đoạn nguồn rơi vào danh sách sửa đổi, không đối chiếu trực tiếp được |

- Tỉ lệ đúng (đúng rõ + đúng đại ý): **29/30 ≈ 97%**.
- **Không phát hiện điều bịa** trong 30 mẫu (kiểm chứng presence ở bước gộp đã lọc hết loại này).
- Kiểu lỗi hay gặp: (1) tóm tắt đôi khi diễn đạt lại bằng từ dễ hiểu nhầm ("thủ tướng của các cơ quan", "sửa đổi sau này thay thế văn bản mới"); (2) trường `nghia_vu_xnk` **thiếu** ở những điều có ý nghĩa XNK nhẹ (ví dụ Điều 1 TT 39/2015 về phạm vi điều chỉnh để trống); (3) văn bản nguồn OCR sai chính tả ("tríc", "khâu" thay "khẩu") được chép nguyên vào tóm tắt — lỗi của nguồn, không phải của Gemma.

## Kết quả lệnh kiểm tra repo

`node tools/kiem-tra.mjs`: **2430 văn bản · 0 lỗi · 1 cảnh báo** (cảnh báo cũ `cong-uoc-vien-1980.yaml` nên đổi tên thành `-cisg` — có từ trước, không phải do lần gộp này).

## Khuyến nghị

1. **Gemma 4 E4B đủ dùng làm bản nháp** cho khâu doc-hieu, với điều kiện giữ bước kiểm chứng "Điều N phải có trong nguồn" — bước này bắt được 455 điều bịa (~14% số dòng đọc), không bỏ được.
2. **Nên soát tay** các điều mà `nghia_vu_xnk` rỗng nhưng nội dung có ý nghĩa XNK (ước ~vài trăm điều) — đây là thiếu sót chính, không phải bịa.
3. **Nên đổi prompt chỗ đọc danh mục/phụ lục**: hiện Gemma trích cả hàng mục thành record riêng (`dieu: "-"`, mã HS) gây ~2.500 dòng rác; chỉ dẫn "chỉ trích khi có số điều" sẽ gọn dữ liệu đầu vào cho khâu gộp.
4. OCR nguồn sai chính tả xuyên suốt (54/2014/QH13, 39/2018/TT-BTC là nặng nhất) — nên soát tóm tắt các văn bản `-ocr` kỹ hơn các văn bản có text layer sạch.
