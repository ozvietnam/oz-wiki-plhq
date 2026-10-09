# AHTN 2022 (ASEAN Harmonized Tariff Nomenclature) — Sources

**Mục đích:** Theo TT 85/2026/TT-BTC Điều 6.1(c), Chú giải bổ sung Danh mục AHTN (SEN) là nguồn ưu tiên thứ 3 khi không xác định được mã HS.

## Trạng thái: ❌ CHƯA CÓ FILE

AHTN 2022 là tài liệu **bản quyền của ASEAN Secretariat** và **Philippines Tariff Commission** (là thành viên ASEAN, sử dụng AHTN chính thức).

## Nguồn chính thức để tải (cần đăng ký tài khoản)

| Nguồn | URL | Trạng thái | Ghi chú |
|---|---|---|---|
| ASEAN Trade Repository (ATR) | https://atr.asean.org/ | 🔒 Cần đăng ký ASEAN Member State account | Chính thức, đầy đủ nhất. Chặn bot — phải dùng session browser |
| Philippines Tariff Commission | https://tariffcommission.gov.ph/tariff-book-2022 | 🔒 Không có link PDF trực tiếp (chỉ hiển thị online) | Cùng dùng AHTN 2022 của Philippines |
| Indonesia (DJBC BTKI 2022) | https://jdih.kemenkeu.go.id/ | 🔒 Cần truy cập trực tiếp | PMK 26/2022 implement AHTN 2022 |
| Singapore (Singapore Customs) | https://www.customs.gov.sg/ | 🔒 TradeXchange API | API trả phí |
| Vietnam (Tổng cục Hải quan) | https://www.customs.gov.vn/ | 🔒 Cần tài khoản | Tra cứu trực tuyến |

## Cấu trúc AHTN 2022

- **17 sections** + **98 chapters** + **~5.300 subheading 8 số** (so với WCO 6 số ~1.969 subheading)
- 6 số đầu = **giống hệt WCO HS Nomenclature 2022** (bắt buộc theo Công ước HS)
- 2 số cuối (số 7, 8) = **ASEAN tự định nghĩa** (mỗi nước có thể thêm số 9, 10 cho riêng)
- Việt Nam: 8 số chuẩn AHTN + 2 số phụ quốc gia (tổng 10 số)

## Mapping với HS code Việt Nam

| WCO 6 số | AHTN 8 số | VN 8 số |
|---|---|---|
| 9004.90 | 9004.90.10 (Kính thuốc) | 9004.90.10 (Kính thuốc) |

**VN dùng CÙNG 8 số với AHTN 2022 cho đa số mã** (theo cam kết ASEAN).

## Hướng tải (chờ Sếp chỉ định)

1. **Cách 1 (nhanh):** Mua bản PDF chính thức từ ASEAN — không thực tế cho dự án open-source
2. **Cách 2 (khả thi):** Screenshot/PDF từ Philippines Tariff Commission (công khai) — bằng session browser
3. **Cách 3 (thực tế nhất):** **Build từ data hiện có** trong `hs-code-api/data/tax.json` (11.871 mã VN = AHTN 8 số) + WCO HS Nomenclature 2022 (`hs-code-api/data/wco-hs-international.csv`) → tự sinh bảng mapping
4. **Cách 4:** Chờ Sếp có tài khoản ATR rồi dùng skill `customs-vn-vanban-scraper` + session browser để crawl

## Tạm thời: dùng nguồn thay thế đã có

| Cần thông tin | Tạm dùng file |
|---|---|
| Mã 6 số WCO | `hs-code-api/data/wco-hs-international.csv` (đã có ~5.000 subheading) |
| Mã 8 số VN (= AHTN) | `hs-code-api/data/tax.json` (đã có 11.871 mã) |
| GIR 6 quy tắc | `hs-code-api/lib/gir.js` (đã đủ 9 rule, xem audit 2026-10-08) |
| Tuyển tập ý kiến WCO | ❌ Chưa có — cần mua bản PDF chính thức (~500€) |

## File cần tạo

- ❌ `raw/download/asean.org/ahtn-2022.pdf` (chưa tải được)
- ❌ `raw/download/wco.org/compendium-classification-opinions.pdf` (trả phí)
- ✅ `raw/download/asean.org/SOURCES.md` (file này)
