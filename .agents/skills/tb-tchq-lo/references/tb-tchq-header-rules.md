# Phân loại TB-TCHQ theo HEADER văn bản

**Quy tắc cứng**: Đọc HEADER từng văn bản TB-TCHQ, KHÔNG tin tool auto-set `loai_vb`.

## 3 loại TB-TCHQ (theo TT 14/2015 + 17/2021)

| Loại | Tên đầy đủ | Mục đích | Căn cứ pháp lý |
|------|------------|----------|-----------------|
| XĐTMS | Xác định trước mã số (advance ruling) | DN **TỰ GỬI ĐƠN** xin TCHQ phân loại **TRƯỚC khi nhập hàng** | TT 14/2015 Điều 3-5 |
| KQPL | Kết quả phân loại (classification result) | DN **ĐÃ KHAI BÁO + MANG HÀNG ĐI PHÂN TÍCH** tại Chi cục Kiểm định Hải quan | TT 14/2015 + 65/2017 |
| Đính chính | Amendment | Đính chính lại phân loại trước đó | Quy trình nội bộ TCHQ |

## Dấu hiệu nhận biết trong HEADER văn bản

| Loại | Cụm từ trong văn bản | Có "Đơn đề nghị"? | Có "Số, ngày tờ khai"? |
|------|----------------------|---------------------|------------------------|
| XĐTMS | "VỀ KẾT QUẢ XÁC ĐỊNH TRƯỚC MÃ SỐ" | ✅ | ❌ |
| KQPL | "VỀ KẾT QUẢ PHÂN LOẠI ĐỐI VỚI HÀNG HÓA XUẤT KHẨU, NHẬP KHẨU" | ❌ | ✅ |
| Đính chính | Tùy | Tùy | Tùy |
| | + "đính chính Thông báo số [X/TB-KĐ...]" | | |

## Script sửa tự động (chạy SAU crawl, TRƯỚC đóng gói)

```python
import re, json

def sua_loai_vb(nd):
    """Trả về loai_vb đúng dựa trên header văn bản"""
    # 1. Đính chính: có "thông báo đính chính"
    if "đính chính" in nd.lower() and "thông báo đính chính" in nd.lower():
        return "DINH_CHINH"
    # 2. XĐTMS: "VỀ KẾT QUẢ XÁC ĐỊNH TRƯỚC MÃ SỐ" + "Đơn đề nghị"
    if "XÁC ĐỊNH TRƯỚC MÃ SỐ" in nd and "Đơn đề nghị" in nd:
        return "XAC_DINH_TRUOC"
    # 3. KQPL: "KẾT QUẢ PHÂN LOẠI" + có tờ khai
    if "KẾT QUẢ PHÂN LOẠI" in nd and re.search(r"[Ss]ố,?\s*ngày tờ khai", nd):
        return "KET_QUA_PHAN_LOAI"
    # 4. KQPL: có "kết quả phân tích" + tờ khai
    if re.search(r"[Ss]ố,?\s*ngày tờ khai", nd) and "kết quả phân tích" in nd.lower():
        return "KET_QUA_PHAN_LOAI"
    return None  # Để tool tự quyết

# Áp dụng cho từng TB trong file detail
with open("data/customs/processed/tracuuhs-detail-XXX.json") as f:
    detail = json.load(f)

for r in detail["records"]:
    nd = r.get("noi_dung", "")
    new_loai = sua_loai_vb(nd)
    if new_loai:
        if r.get("loai_vb") != new_loai:
            r["_loai_vb_old"] = r.get("loai_vb")
            r["loai_vb"] = new_loai

with open("data/customs/processed/tracuuhs-detail-XXX.json", "w") as f:
    json.dump(detail, f, ensure_ascii=False, indent=2)

print(f"Đã sửa loai_vb cho {sum(1 for r in detail['records'] if '_loai_vb_old' in r)} TB")
```

## Tại sao tool `dong-goi-lo-tb-tchq.mjs` sai

Tool dùng heuristic đơn giản: nếu tìm thấy "đính chính" → DINH_CHINH, ngược lại → XAC_DINH_TRUOC mặc định.

**Sai** vì: cả XĐTMS và KQPL đều có header "VỀ KẾT QUẢ..." → tool không phân biệt được. Trong thực tế, ~80% TB có số tờ khai = KQPL, nhưng tool gán XAC_DINH_TRUOC.

**Sửa tool** (optional): thêm logic "Có Số, ngày tờ khai + 'kết quả phân tích' → KQPL". Nhưng cách nhanh nhất là sửa tay SAU crawl.

## Khi KHÔNG chắc chắn

Để `loai_vb = None`, không sửa, đưa vào BAO-CAO "cần xử tay" để agent khác xử lý.
