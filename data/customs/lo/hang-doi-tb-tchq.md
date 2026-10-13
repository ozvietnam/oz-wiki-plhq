# Hàng đợi TB-TCHQ — 103 gói × ≤20 TB (chia 2026-10-13)

Index 2304 TB · đã mở chi tiết 261 · **còn lại 2043 TB thành 103 gói**.

## Cách nhận việc (chống tranh nhau)

1. Chọn một gói CHƯA ai nhận, comment `nhận goi-NNN` ở issue theo dõi (xem tab Issues — nhãn `luong:tb-tchq`). Một agent giữ một gói tại một thời điểm.
2. Mở từng TB theo URL trong gói (delay ≥ 1s, 1 tiến trình — xem CONTRIBUTING); lưu vào `data/customs/processed/tracuuhs-detail-<ngày>-goi-NNN.json` đúng envelope hiện có.
3. `npm run dong-goi-lo -- --vao data/customs/processed/tracuuhs-detail-<ngày>-goi-NNN.json --ra data/customs/lo/tracuuhs-<ngày>-goi-NNN.json --bao-cao data/customs/lo/BAO-CAO-goi-NNN.md`
4. Kiểm bằng `validate-community.mjs` bên hs-code-api (**0 lỗi mới đi tiếp**) → gộp `merge-community.mjs` → 1 PR sang hs-code-api (lô + precedents.json + số đếm tài liệu).
5. Một PR oz-wiki thêm tệp detail + lô + báo cáo của gói. Quy trình đầy đủ: `docs/luong-tb-tchq.md`; agent dùng skill `/tb-tchq-lo`.

**Chỉ đụng tệp của gói mình** (`*-goi-NNN*`) — không sửa tệp chung, không cập nhật hàng đợi; trạng thái ghi ở issue.

> Lưu ý URL: sinh từ số hiệu in trên văn bản. Vài số hiệu có số 0 đầu (vd `08/TB-TCHQ/2020`) — nếu trang không mở, thử bỏ số 0 đầu (`tchq-8-2020`).

## goi-001 · Ch.02·03·04 · 20 TB

- 503/TB-TCHQ/2018 · nhóm 02.06 · https://www.tracuuhs.com/tin-tuc/tchq-503-2018
- 988/TB-TCHQ/2019 · nhóm 02.10 · https://www.tracuuhs.com/tin-tuc/tchq-988-2019
- 989/TB-TCHQ/2019 · nhóm 02.10 · https://www.tracuuhs.com/tin-tuc/tchq-989-2019
- 3873/TB-TCHQ/2023 · nhóm 03.04 · https://www.tracuuhs.com/tin-tuc/tchq-3873-2023
- 3874/TB-TCHQ/2023 · nhóm 03.04 · https://www.tracuuhs.com/tin-tuc/tchq-3874-2023
- 4780/TB-TCHQ/2022 · nhóm 03.05 · https://www.tracuuhs.com/tin-tuc/tchq-4780-2022
- 2907/TB-TCHQ/2023 · nhóm 04.02 · https://www.tracuuhs.com/tin-tuc/tchq-2907-2023
- 6104/TB-TCHQ/2018 · nhóm 04.02 · https://www.tracuuhs.com/tin-tuc/tchq-6104-2018
- 6105/TB-TCHQ/2018 · nhóm 04.02 · https://www.tracuuhs.com/tin-tuc/tchq-6105-2018
- 6304/TB-TCHQ/2018 · nhóm 04.02 · https://www.tracuuhs.com/tin-tuc/tchq-6304-2018
- 462/TB-TCHQ/2019 · nhóm 04.03 · https://www.tracuuhs.com/tin-tuc/tchq-462-2019
- 527/TB-TCHQ/2019 · nhóm 04.03 · https://www.tracuuhs.com/tin-tuc/tchq-527-2019
- 528/TB-TCHQ/2019 · nhóm 04.03 · https://www.tracuuhs.com/tin-tuc/tchq-528-2019
- 7293/TB-TCHQ/2018 · nhóm 04.03 · https://www.tracuuhs.com/tin-tuc/tchq-7293-2018
- 7294/TB-TCHQ/2018 · nhóm 04.03 · https://www.tracuuhs.com/tin-tuc/tchq-7294-2018
- 7295/TB-TCHQ/2018 · nhóm 04.03 · https://www.tracuuhs.com/tin-tuc/tchq-7295-2018
- 7296/TB-TCHQ/2018 · nhóm 04.03 · https://www.tracuuhs.com/tin-tuc/tchq-7296-2018
- 7297/TB-TCHQ/2018 · nhóm 04.03 · https://www.tracuuhs.com/tin-tuc/tchq-7297-2018
- 1220/TB-TCHQ/2023 · nhóm 04.04 · https://www.tracuuhs.com/tin-tuc/tchq-1220-2023
- 2101/TB-TCHQ/2024 · nhóm 04.04 · https://www.tracuuhs.com/tin-tuc/tchq-2101-2024

## goi-002 · Ch.04·08·09·11·12·13 · 20 TB

- 6411/TB-TCHQ/2018 · nhóm 04.04 · https://www.tracuuhs.com/tin-tuc/tchq-6411-2018
- 525/TB-TCHQ/2019 · nhóm 04.06 · https://www.tracuuhs.com/tin-tuc/tchq-525-2019
- 526/TB-TCHQ/2019 · nhóm 04.06 · https://www.tracuuhs.com/tin-tuc/tchq-526-2019
- 6488/TB-TCHQ/2024 · nhóm 08.13 · https://www.tracuuhs.com/tin-tuc/tchq-6488-2024
- 5193/TB-TCHQ/2024 · nhóm 09.01 · https://www.tracuuhs.com/tin-tuc/tchq-5193-2024
- 5235/TB-TCHQ/2024 · nhóm 09.01 · https://www.tracuuhs.com/tin-tuc/tchq-5235-2024
- 7392/TB-TCHQ/2018 · nhóm 09.02 · https://www.tracuuhs.com/tin-tuc/tchq-7392-2018
- 6431/TB-TCHQ/2018 · nhóm 11.04 · https://www.tracuuhs.com/tin-tuc/tchq-6431-2018
- 3581/TB-TCHQ/2022 · nhóm 11.08 · https://www.tracuuhs.com/tin-tuc/tchq-3581-2022
- 105/TB-TCHQ/2020 · nhóm 12.08 · https://www.tracuuhs.com/tin-tuc/tchq-105-2020
- 469/TB-TCHQ/2019 · nhóm 12.11 · https://www.tracuuhs.com/tin-tuc/tchq-469-2019
- 483/TB-TCHQ/2019 · nhóm 12.11 · https://www.tracuuhs.com/tin-tuc/tchq-483-2019
- 529/TB-TCHQ/2019 · nhóm 12.11 · https://www.tracuuhs.com/tin-tuc/tchq-529-2019
- 1258/TB-TCHQ/2023 · nhóm 12.11 · https://www.tracuuhs.com/tin-tuc/tchq-1258-2023
- 2232/TB-TCHQ/2023 · nhóm 12.11 · https://www.tracuuhs.com/tin-tuc/tchq-2232-2023
- 5818/TB-TCHQ/2019 · nhóm 12.11 · https://www.tracuuhs.com/tin-tuc/tchq-5818-2019
- 613/TB-TCHQ/2022 · nhóm 12.12 · https://www.tracuuhs.com/tin-tuc/tchq-613-2022
- 510/TB-TCHQ/2025 · nhóm 13.02 · https://www.tracuuhs.com/tin-tuc/tchq-510-2025
- 2966/TB-TCHQ/2022 · nhóm 13.02 · https://www.tracuuhs.com/tin-tuc/tchq-2966-2022
- 3336/TB-TCHQ/2018 · nhóm 13.02 · https://www.tracuuhs.com/tin-tuc/tchq-3336-2018

## goi-003 · Ch.13·14·15 · 20 TB

- 6336/TB-TCHQ/2018 · nhóm 13.02 · https://www.tracuuhs.com/tin-tuc/tchq-6336-2018
- 1455/TB-TCHQ/2021 · nhóm 14.04 · https://www.tracuuhs.com/tin-tuc/tchq-1455-2021
- 2037/TB-TCHQ/2020 · nhóm 14.04 · https://www.tracuuhs.com/tin-tuc/tchq-2037-2020
- 6313/TB-TCHQ/2020 · nhóm 14.04 · https://www.tracuuhs.com/tin-tuc/tchq-6313-2020
- 1798/TB-TCHQ/2018 · nhóm 15.03 · https://www.tracuuhs.com/tin-tuc/tchq-1798-2018
- 2840/TB-TCHQ/2026 · nhóm 15.03 · https://www.tracuuhs.com/tin-tuc/tchq-2840-2026
- 288/TB-TCHQ/2025 · nhóm 15.04 · https://www.tracuuhs.com/tin-tuc/tchq-288-2025
- 234/TB-TCHQ/2019 · nhóm 15.07 · https://www.tracuuhs.com/tin-tuc/tchq-234-2019
- 1148/TB-TCHQ/2019 · nhóm 15.12 · https://www.tracuuhs.com/tin-tuc/tchq-1148-2019
- 1149/TB-TCHQ/2019 · nhóm 15.12 · https://www.tracuuhs.com/tin-tuc/tchq-1149-2019
- 2836/TB-TCHQ/2018 · nhóm 15.12 · https://www.tracuuhs.com/tin-tuc/tchq-2836-2018
- 6412/TB-TCHQ/2018 · nhóm 15.12 · https://www.tracuuhs.com/tin-tuc/tchq-6412-2018
- 1991/TB-TCHQ/2019 · nhóm 15.14 · https://www.tracuuhs.com/tin-tuc/tchq-1991-2019
- 100/TB-TCHQ/2021 · nhóm 15.15 · https://www.tracuuhs.com/tin-tuc/tchq-100-2021
- 119/TB-TCHQ/2025 · nhóm 15.15 · https://www.tracuuhs.com/tin-tuc/tchq-119-2025
- 237/TB-TCHQ/2019 · nhóm 15.15 · https://www.tracuuhs.com/tin-tuc/tchq-237-2019
- 2833/TB-TCHQ/2018 · nhóm 15.15 · https://www.tracuuhs.com/tin-tuc/tchq-2833-2018
- 2834/TB-TCHQ/2018 · nhóm 15.15 · https://www.tracuuhs.com/tin-tuc/tchq-2834-2018
- 2835/TB-TCHQ/2018 · nhóm 15.15 · https://www.tracuuhs.com/tin-tuc/tchq-2835-2018
- 2837/TB-TCHQ/2018 · nhóm 15.15 · https://www.tracuuhs.com/tin-tuc/tchq-2837-2018

## goi-004 · Ch.15·16·17 · 20 TB

- 2839/TB-TCHQ/2018 · nhóm 15.15 · https://www.tracuuhs.com/tin-tuc/tchq-2839-2018
- 3593/TB-TCHQ/2023 · nhóm 15.15 · https://www.tracuuhs.com/tin-tuc/tchq-3593-2023
- 6407/TB-TCHQ/2018 · nhóm 15.15 · https://www.tracuuhs.com/tin-tuc/tchq-6407-2018
- 221/TB-TCHQ/2025 · nhóm 15.16 · https://www.tracuuhs.com/tin-tuc/tchq-221-2025
- 1025/TB-TCHQ/2019 · nhóm 15.16 · https://www.tracuuhs.com/tin-tuc/tchq-1025-2019
- 2455/TB-TCHQ/2018 · nhóm 15.16 · https://www.tracuuhs.com/tin-tuc/tchq-2455-2018
- 4124/TB-TCHQ/2021 · nhóm 15.17 · https://www.tracuuhs.com/tin-tuc/tchq-4124-2021
- 4153/TB-TCHQ/2018 · nhóm 15.17 · https://www.tracuuhs.com/tin-tuc/tchq-4153-2018
- 5192/TB-TCHQ/2024 · nhóm 15.17 · https://www.tracuuhs.com/tin-tuc/tchq-5192-2024
- 1764/TB-TCHQ/2018 · nhóm 15.18 · https://www.tracuuhs.com/tin-tuc/tchq-1764-2018
- 4847/TB-TCHQ/2018 · nhóm 15.18 · https://www.tracuuhs.com/tin-tuc/tchq-4847-2018
- 362/TB-TCHQ/2025 · nhóm 16.02 · https://www.tracuuhs.com/tin-tuc/tchq-362-2025
- 547/TB-TCHQ/2022 · nhóm 16.02 · https://www.tracuuhs.com/tin-tuc/tchq-547-2022
- 901/TB-TCHQ/2019 · nhóm 17.02 · https://www.tracuuhs.com/tin-tuc/tchq-901-2019
- 1224/TB-TCHQ/2019 · nhóm 17.02 · https://www.tracuuhs.com/tin-tuc/tchq-1224-2019
- 181/TB-TCHQ/2021 · nhóm 17.04 · https://www.tracuuhs.com/tin-tuc/tchq-181-2021
- 182/TB-TCHQ/2021 · nhóm 17.04 · https://www.tracuuhs.com/tin-tuc/tchq-182-2021
- 183/TB-TCHQ/2021 · nhóm 17.04 · https://www.tracuuhs.com/tin-tuc/tchq-183-2021
- 184/TB-TCHQ/2021 · nhóm 17.04 · https://www.tracuuhs.com/tin-tuc/tchq-184-2021
- 185/TB-TCHQ/2021 · nhóm 17.04 · https://www.tracuuhs.com/tin-tuc/tchq-185-2021

## goi-005 · Ch.17·18·19 · 20 TB

- 2415/TB-TCHQ/2022 · nhóm 17.04 · https://www.tracuuhs.com/tin-tuc/tchq-2415-2022
- 1946/TB-TCHQ/2018 · nhóm 18.06 · https://www.tracuuhs.com/tin-tuc/tchq-1946-2018
- 2090/TB-TCHQ/2020 · nhóm 18.06 · https://www.tracuuhs.com/tin-tuc/tchq-2090-2020
- 2091/TB-TCHQ/2020 · nhóm 18.06 · https://www.tracuuhs.com/tin-tuc/tchq-2091-2020
- 2092/TB-TCHQ/2020 · nhóm 18.06 · https://www.tracuuhs.com/tin-tuc/tchq-2092-2020
- 2093/TB-TCHQ/2020 · nhóm 18.06 · https://www.tracuuhs.com/tin-tuc/tchq-2093-2020
- 2094/TB-TCHQ/2020 · nhóm 18.06 · https://www.tracuuhs.com/tin-tuc/tchq-2094-2020
- 2413/TB-TCHQ/2022 · nhóm 18.06 · https://www.tracuuhs.com/tin-tuc/tchq-2413-2022
- 2414/TB-TCHQ/2022 · nhóm 18.06 · https://www.tracuuhs.com/tin-tuc/tchq-2414-2022
- 3261/TB-TCHQ/2018 · nhóm 18.06 · https://www.tracuuhs.com/tin-tuc/tchq-3261-2018
- 3649/TB-TCHQ/2023 · nhóm 18.06 · https://www.tracuuhs.com/tin-tuc/tchq-3649-2023
- 4661/TB-TCHQ/2020 · nhóm 18.06 · https://www.tracuuhs.com/tin-tuc/tchq-4661-2020
- 7393/TB-TCHQ/2018 · nhóm 18.06 · https://www.tracuuhs.com/tin-tuc/tchq-7393-2018
- 7394/TB-TCHQ/2018 · nhóm 18.06 · https://www.tracuuhs.com/tin-tuc/tchq-7394-2018
- 7395/TB-TCHQ/2018 · nhóm 18.06 · https://www.tracuuhs.com/tin-tuc/tchq-7395-2018
- 118/TB-TCHQ/2023 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-118-2023
- 200/TB-TCHQ/2021 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-200-2021
- 449/TB-TCHQ/2023 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-449-2023
- 520/TB-TCHQ/2018 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-520-2018
- 814/TB-TCHQ/2019 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-814-2019

## goi-006 · Ch.19 · 20 TB

- 815/TB-TCHQ/2019 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-815-2019
- 816/TB-TCHQ/2019 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-816-2019
- 817/TB-TCHQ/2019 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-817-2019
- 818/TB-TCHQ/2019 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-818-2019
- 819/TB-TCHQ/2019 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-819-2019
- 820/TB-TCHQ/2019 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-820-2019
- 821/TB-TCHQ/2019 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-821-2019
- 822/TB-TCHQ/2019 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-822-2019
- 823/TB-TCHQ/2019 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-823-2019
- 824/TB-TCHQ/2019 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-824-2019
- 825/TB-TCHQ/2019 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-825-2019
- 1627/TB-TCHQ/2022 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-1627-2022
- 1853/TB-TCHQ/2020 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-1853-2020
- 1854/TB-TCHQ/2020 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-1854-2020
- 1855/TB-TCHQ/2020 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-1855-2020
- 1856/TB-TCHQ/2020 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-1856-2020
- 1886/TB-TCHQ/2023 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-1886-2023
- 2223/TB-TCHQ/2024 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-2223-2024
- 2224/TB-TCHQ/2024 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-2224-2024
- 2225/TB-TCHQ/2024 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-2225-2024

## goi-007 · Ch.19 · 20 TB

- 2726/TB-TCHQ/2022 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-2726-2022
- 3659/TB-TCHQ/2019 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-3659-2019
- 3660/TB-TCHQ/2019 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-3660-2019
- 3661/TB-TCHQ/2019 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-3661-2019
- 4013/TB-TCHQ/2023 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-4013-2023
- 4817/TB-TCHQ/2024 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-4817-2024
- 4818/TB-TCHQ/2024 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-4818-2024
- 6439/TB-TCHQ/2024 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-6439-2024
- 6447/TB-TCHQ/2024 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-6447-2024
- 6448/TB-TCHQ/2024 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-6448-2024
- 6449/TB-TCHQ/2024 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-6449-2024
- 6450/TB-TCHQ/2024 · nhóm 19.01 · https://www.tracuuhs.com/tin-tuc/tchq-6450-2024
- 1762/TB-TCHQ/2018 · nhóm 19.02 · https://www.tracuuhs.com/tin-tuc/tchq-1762-2018
- 2347/TB-TCHQ/2018 · nhóm 19.02 · https://www.tracuuhs.com/tin-tuc/tchq-2347-2018
- 6313/TB-TCHQ/2024 · nhóm 19.04 · https://www.tracuuhs.com/tin-tuc/tchq-6313-2024
- 6489/TB-TCHQ/2024 · nhóm 19.04 · https://www.tracuuhs.com/tin-tuc/tchq-6489-2024
- 6490/TB-TCHQ/2024 · nhóm 19.04 · https://www.tracuuhs.com/tin-tuc/tchq-6490-2024
- 7391/TB-TCHQ/2018 · nhóm 19.04 · https://www.tracuuhs.com/tin-tuc/tchq-7391-2018
- 186/TB-TCHQ/2021 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-186-2021
- 252/TB-TCHQ/2019 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-252-2019

## goi-008 · Ch.19 · 20 TB

- 253/TB-TCHQ/2019 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-253-2019
- 254/TB-TCHQ/2019 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-254-2019
- 255/TB-TCHQ/2019 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-255-2019
- 256/TB-TCHQ/2019 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-256-2019
- 257/TB-TCHQ/2019 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-257-2019
- 258/TB-TCHQ/2019 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-258-2019
- 1257/TB-TCHQ/2023 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-1257-2023
- 3058/TB-TCHQ/2018 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-3058-2018
- 3674/TB-TCHQ/2019 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-3674-2019
- 3675/TB-TCHQ/2019 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-3675-2019
- 3676/TB-TCHQ/2019 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-3676-2019
- 3677/TB-TCHQ/2019 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-3677-2019
- 3678/TB-TCHQ/2019 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-3678-2019
- 3679/TB-TCHQ/2019 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-3679-2019
- 3681/TB-TCHQ/2019 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-3681-2019
- 3682/TB-TCHQ/2019 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-3682-2019
- 7285/TB-TCHQ/2018 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-7285-2018
- 7286/TB-TCHQ/2018 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-7286-2018
- 7287/TB-TCHQ/2018 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-7287-2018
- 7288/TB-TCHQ/2018 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-7288-2018

## goi-009 · Ch.19·20 · 20 TB

- 7300/TB-TCHQ/2018 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-7300-2018
- 7301/TB-TCHQ/2018 · nhóm 19.05 · https://www.tracuuhs.com/tin-tuc/tchq-7301-2018
- 6931/TB-TCHQ/2018 · nhóm 20.01 · https://www.tracuuhs.com/tin-tuc/tchq-6931-2018
- 6932/TB-TCHQ/2018 · nhóm 20.01 · https://www.tracuuhs.com/tin-tuc/tchq-6932-2018
- 146/TB-TCHQ/2024 · nhóm 20.07 · https://www.tracuuhs.com/tin-tuc/tchq-146-2024
- 450/TB-TCHQ/2019 · nhóm 20.08 · https://www.tracuuhs.com/tin-tuc/tchq-450-2019
- 534/TB-TCHQ/2018 · nhóm 20.08 · https://www.tracuuhs.com/tin-tuc/tchq-534-2018
- 800/TB-TCHQ/2019 · nhóm 20.08 · https://www.tracuuhs.com/tin-tuc/tchq-800-2019
- 1095/TB-TCHQ/2020 · nhóm 20.08 · https://www.tracuuhs.com/tin-tuc/tchq-1095-2020
- 1096/TB-TCHQ/2020 · nhóm 20.08 · https://www.tracuuhs.com/tin-tuc/tchq-1096-2020
- 1713/TB-TCHQ/2022 · nhóm 20.08 · https://www.tracuuhs.com/tin-tuc/tchq-1713-2022
- 1995/TB-TCHQ/2019 · nhóm 20.08 · https://www.tracuuhs.com/tin-tuc/tchq-1995-2019
- 2817/TB-TCHQ/2024 · nhóm 20.08 · https://www.tracuuhs.com/tin-tuc/tchq-2817-2024
- 3391/TB-TCHQ/2019 · nhóm 20.08 · https://www.tracuuhs.com/tin-tuc/tchq-3391-2019
- 4325/TB-TCHQ/2019 · nhóm 20.08 · https://www.tracuuhs.com/tin-tuc/tchq-4325-2019
- 4327/TB-TCHQ/2019 · nhóm 20.08 · https://www.tracuuhs.com/tin-tuc/tchq-4327-2019
- 4328/TB-TCHQ/2019 · nhóm 20.08 · https://www.tracuuhs.com/tin-tuc/tchq-4328-2019
- 5453/TB-TCHQ/2019 · nhóm 20.08 · https://www.tracuuhs.com/tin-tuc/tchq-5453-2019
- 151/TB-TCHQ/2024 · nhóm 20.09 · https://www.tracuuhs.com/tin-tuc/tchq-151-2024
- 187/TB-TCHQ/2023 · nhóm 20.09 · https://www.tracuuhs.com/tin-tuc/tchq-187-2023

## goi-010 · Ch.20·21 · 20 TB

- 1769/TB-TCHQ/2018 · nhóm 20.09 · https://www.tracuuhs.com/tin-tuc/tchq-1769-2018
- 2412/TB-TCHQ/2018 · nhóm 20.09 · https://www.tracuuhs.com/tin-tuc/tchq-2412-2018
- 3386/TB-TCHQ/2019 · nhóm 20.09 · https://www.tracuuhs.com/tin-tuc/tchq-3386-2019
- 3387/TB-TCHQ/2019 · nhóm 20.09 · https://www.tracuuhs.com/tin-tuc/tchq-3387-2019
- 3388/TB-TCHQ/2019 · nhóm 20.09 · https://www.tracuuhs.com/tin-tuc/tchq-3388-2019
- 3389/TB-TCHQ/2019 · nhóm 20.09 · https://www.tracuuhs.com/tin-tuc/tchq-3389-2019
- 3392/TB-TCHQ/2019 · nhóm 20.09 · https://www.tracuuhs.com/tin-tuc/tchq-3392-2019
- 1395/TB-TCHQ/2024 · nhóm 21.01 · https://www.tracuuhs.com/tin-tuc/tchq-1395-2024
- 1626/TB-TCHQ/2022 · nhóm 21.01 · https://www.tracuuhs.com/tin-tuc/tchq-1626-2022
- 3337/TB-TCHQ/2018 · nhóm 21.01 · https://www.tracuuhs.com/tin-tuc/tchq-3337-2018
- 3648/TB-TCHQ/2023 · nhóm 21.01 · https://www.tracuuhs.com/tin-tuc/tchq-3648-2023
- 1505/TB-TCHQ/2023 · nhóm 21.02 · https://www.tracuuhs.com/tin-tuc/tchq-1505-2023
- 2889/TB-TCHQ/2018 · nhóm 21.02 · https://www.tracuuhs.com/tin-tuc/tchq-2889-2018
- 3534/TB-TCHQ/2019 · nhóm 21.02 · https://www.tracuuhs.com/tin-tuc/tchq-3534-2019
- 4288/TB-TCHQ/2023 · nhóm 21.02 · https://www.tracuuhs.com/tin-tuc/tchq-4288-2023
- 6015/TB-TCHQ/2024 · nhóm 21.02 · https://www.tracuuhs.com/tin-tuc/tchq-6015-2024
- 6064/TB-TCHQ/2018 · nhóm 21.02 · https://www.tracuuhs.com/tin-tuc/tchq-6064-2018
- 7547/TB-TCHQ/2018 · nhóm 21.02 · https://www.tracuuhs.com/tin-tuc/tchq-7547-2018
- 238/TB-TCHQ/2019 · nhóm 21.03 · https://www.tracuuhs.com/tin-tuc/tchq-238-2019
- 446/TB-TCHQ/2019 · nhóm 21.03 · https://www.tracuuhs.com/tin-tuc/tchq-446-2019

## goi-011 · Ch.21 · 20 TB

- 474/TB-TCHQ/2019 · nhóm 21.03 · https://www.tracuuhs.com/tin-tuc/tchq-474-2019
- 475/TB-TCHQ/2019 · nhóm 21.03 · https://www.tracuuhs.com/tin-tuc/tchq-475-2019
- 476/TB-TCHQ/2019 · nhóm 21.03 · https://www.tracuuhs.com/tin-tuc/tchq-476-2019
- 477/TB-TCHQ/2019 · nhóm 21.03 · https://www.tracuuhs.com/tin-tuc/tchq-477-2019
- 565/TB-TCHQ/2019 · nhóm 21.03 · https://www.tracuuhs.com/tin-tuc/tchq-565-2019
- 813/TB-TCHQ/2018 · nhóm 21.03 · https://www.tracuuhs.com/tin-tuc/tchq-813-2018
- 1211/TB-TCHQ/2020 · nhóm 21.03 · https://www.tracuuhs.com/tin-tuc/tchq-1211-2020
- 1225/TB-TCHQ/2019 · nhóm 21.03 · https://www.tracuuhs.com/tin-tuc/tchq-1225-2019
- 1503/TB-TCHQ/2018 · nhóm 21.03 · https://www.tracuuhs.com/tin-tuc/tchq-1503-2018
- 1705/TB-TCHQ/2020 · nhóm 21.03 · https://www.tracuuhs.com/tin-tuc/tchq-1705-2020
- 3224/TB-TCHQ/2018 · nhóm 21.03 · https://www.tracuuhs.com/tin-tuc/tchq-3224-2018
- 3662/TB-TCHQ/2019 · nhóm 21.03 · https://www.tracuuhs.com/tin-tuc/tchq-3662-2019
- 3697/TB-TCHQ/2019 · nhóm 21.03 · https://www.tracuuhs.com/tin-tuc/tchq-3697-2019
- 3788/TB-TCHQ/2019 · nhóm 21.03 · https://www.tracuuhs.com/tin-tuc/tchq-3788-2019
- 3790/TB-TCHQ/2019 · nhóm 21.03 · https://www.tracuuhs.com/tin-tuc/tchq-3790-2019
- 4136/TB-TCHQ/2018 · nhóm 21.03 · https://www.tracuuhs.com/tin-tuc/tchq-4136-2018
- 4319/TB-TCHQ/2019 · nhóm 21.03 · https://www.tracuuhs.com/tin-tuc/tchq-4319-2019
- 7341/TB-TCHQ/2018 · nhóm 21.03 · https://www.tracuuhs.com/tin-tuc/tchq-7341-2018
- 7545/TB-TCHQ/2018 · nhóm 21.03 · https://www.tracuuhs.com/tin-tuc/tchq-7545-2018
- 7546/TB-TCHQ/2018 · nhóm 21.03 · https://www.tracuuhs.com/tin-tuc/tchq-7546-2018

## goi-012 · Ch.21 · 20 TB

- 812/TB-TCHQ/2018 · nhóm 21.04 · https://www.tracuuhs.com/tin-tuc/tchq-812-2018
- 817/TB-TCHQ/2018 · nhóm 21.04 · https://www.tracuuhs.com/tin-tuc/tchq-817-2018
- 3915/TB-TCHQ/2019 · nhóm 21.04 · https://www.tracuuhs.com/tin-tuc/tchq-3915-2019
- 3916/TB-TCHQ/2019 · nhóm 21.04 · https://www.tracuuhs.com/tin-tuc/tchq-3916-2019
- 3917/TB-TCHQ/2019 · nhóm 21.04 · https://www.tracuuhs.com/tin-tuc/tchq-3917-2019
- 3922/TB-TCHQ/2019 · nhóm 21.04 · https://www.tracuuhs.com/tin-tuc/tchq-3922-2019
- 4015/TB-TCHQ/2019 · nhóm 21.04 · https://www.tracuuhs.com/tin-tuc/tchq-4015-2019
- 08/TB-TCHQ/2020 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-08-2020
- 10/TB-TCHQ/2020 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-10-2020
- 11/TB-TCHQ/2020 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-11-2020
- 235/TB-TCHQ/2019 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-235-2019
- 248/TB-TCHQ/2021 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-248-2021
- 509/TB-TCHQ/2025 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-509-2025
- 512/TB-TCHQ/2025 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-512-2025
- 513/TB-TCHQ/2025 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-513-2025
- 514/TB-TCHQ/2025 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-514-2025
- 515/TB-TCHQ/2025 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-515-2025
- 516/TB-TCHQ/2025 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-516-2025
- 524/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-524-2018
- 533/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-533-2018

## goi-013 · Ch.21 · 20 TB

- 568/TB-TCHQ/2019 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-568-2019
- 569/TB-TCHQ/2019 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-569-2019
- 570/TB-TCHQ/2019 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-570-2019
- 571/TB-TCHQ/2019 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-571-2019
- 572/TB-TCHQ/2019 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-572-2019
- 574/TB-TCHQ/2019 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-574-2019
- 581/TB-TCHQ/2021 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-581-2021
- 630/TB-TCHQ/2019 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-630-2019
- 631/TB-TCHQ/2019 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-631-2019
- 638/TB-TCHQ/2025 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-638-2025
- 730/TB-TCHQ/2023 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-730-2023
- 731/TB-TCHQ/2023 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-731-2023
- 756/TB-TCHQ/2019 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-756-2019
- 1099/TB-TCHQ/2020 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-1099-2020
- 1212/TB-TCHQ/2020 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-1212-2020
- 1216/TB-TCHQ/2020 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-1216-2020
- 1217/TB-TCHQ/2020 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-1217-2020
- 1218/TB-TCHQ/2020 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-1218-2020
- 1220/TB-TCHQ/2020 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-1220-2020
- 1547/TB-TCHQ/2024 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-1547-2024

## goi-014 · Ch.21 · 20 TB

- 2026/TB-TCHQ/2020 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-2026-2020
- 2027/TB-TCHQ/2020 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-2027-2020
- 2030/TB-TCHQ/2022 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-2030-2022
- 2172/TB-TCHQ/2020 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-2172-2020
- 2194/TB-TCHQ/2023 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-2194-2023
- 2196/TB-TCHQ/2023 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-2196-2023
- 2306/TB-TCHQ/2024 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-2306-2024
- 2708/TB-TCHQ/2023 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-2708-2023
- 2709/TB-TCHQ/2023 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-2709-2023
- 2710/TB-TCHQ/2024 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-2710-2024
- 2905/TB-TCHQ/2023 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-2905-2023
- 2906/TB-TCHQ/2023 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-2906-2023
- 2969/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-2969-2018
- 3005/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-3005-2018
- 3258/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-3258-2018
- 3259/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-3259-2018
- 3260/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-3260-2018
- 3390/TB-TCHQ/2019 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-3390-2019
- 3508/TB-TCHQ/2019 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-3508-2019
- 3683/TB-TCHQ/2019 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-3683-2019

## goi-015 · Ch.21 · 20 TB

- 3684/TB-TCHQ/2019 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-3684-2019
- 3685/TB-TCHQ/2019 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-3685-2019
- 3811/TB-TCHQ/2024 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-3811-2024
- 3823/TB-TCHQ/2022 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-3823-2022
- 3825/TB-TCHQ/2022 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-3825-2022
- 3903/TB-TCHQ/2024 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-3903-2024
- 3940/TB-TCHQ/2021 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-3940-2021
- 3969/TB-TCHQ/2024 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-3969-2024
- 3979/TB-TCHQ/2019 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-3979-2019
- 4014/TB-TCHQ/2019 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-4014-2019
- 4016/TB-TCHQ/2019 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-4016-2019
- 4326/TB-TCHQ/2019 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-4326-2019
- 4611/TB-TCHQ/2024 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-4611-2024
- 4788/TB-TCHQ/2024 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-4788-2024
- 4816/TB-TCHQ/2024 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-4816-2024
- 4931/TB-TCHQ/2023 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-4931-2023
- 5388/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-5388-2018
- 5523/TB-TCHQ/2024 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-5523-2024
- 5655/TB-TCHQ/2023 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-5655-2023
- 5730/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-5730-2018

## goi-016 · Ch.21·22 · 20 TB

- 5731/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-5731-2018
- 5733/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-5733-2018
- 6157/TB-TCHQ/2024 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-6157-2024
- 6158/TB-TCHQ/2024 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-6158-2024
- 6937/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-6937-2018
- 6938/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-6938-2018
- 6939/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-6939-2018
- 6940/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-6940-2018
- 6941/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-6941-2018
- 6942/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-6942-2018
- 6943/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-6943-2018
- 6944/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-6944-2018
- 6945/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-6945-2018
- 6946/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-6946-2018
- 6947/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-6947-2018
- 7009/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-7009-2018
- 7017/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-7017-2018
- 7019/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-7019-2018
- 7390/TB-TCHQ/2018 · nhóm 21.06 · https://www.tracuuhs.com/tin-tuc/tchq-7390-2018
- 70/TB-TCHQ/2023 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-70-2023

## goi-017 · Ch.22 · 20 TB

- 71/TB-TCHQ/2023 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-71-2023
- 249/TB-TCHQ/2021 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-249-2021
- 281/TB-TCHQ/2025 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-281-2025
- 511/TB-TCHQ/2025 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-511-2025
- 1312/TB-TCHQ/2019 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-1312-2019
- 1313/TB-TCHQ/2019 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-1313-2019
- 1314/TB-TCHQ/2019 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-1314-2019
- 1315/TB-TCHQ/2019 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-1315-2019
- 1316/TB-TCHQ/2019 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-1316-2019
- 1897/TB-TCHQ/2018 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-1897-2018
- 1898/TB-TCHQ/2018 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-1898-2018
- 1900/TB-TCHQ/2018 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-1900-2018
- 1901/TB-TCHQ/2018 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-1901-2018
- 1920/TB-TCHQ/2018 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-1920-2018
- 1921/TB-TCHQ/2018 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-1921-2018
- 1922/TB-TCHQ/2018 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-1922-2018
- 2317/TB-TCHQ/2018 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-2317-2018
- 2346/TB-TCHQ/2018 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-2346-2018
- 2354/TB-TCHQ/2018 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-2354-2018
- 2355/TB-TCHQ/2018 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-2355-2018

## goi-018 · Ch.22 · 20 TB

- 2473/TB-TCHQ/2018 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-2473-2018
- 2621/TB-TCHQ/2018 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-2621-2018
- 2968/TB-TCHQ/2018 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-2968-2018
- 3074/TB-TCHQ/2018 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-3074-2018
- 3119/TB-TCHQ/2018 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-3119-2018
- 3142/TB-TCHQ/2019 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-3142-2019
- 3222/TB-TCHQ/2018 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-3222-2018
- 3223/TB-TCHQ/2018 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-3223-2018
- 3349/TB-TCHQ/2019 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-3349-2019
- 3509/TB-TCHQ/2019 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-3509-2019
- 3545/TB-TCHQ/2019 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-3545-2019
- 3672/TB-TCHQ/2019 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-3672-2019
- 3734/TB-TCHQ/2019 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-3734-2019
- 4083/TB-TCHQ/2019 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-4083-2019
- 4084/TB-TCHQ/2019 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-4084-2019
- 6257/TB-TCHQ/2020 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-6257-2020
- 6258/TB-TCHQ/2020 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-6258-2020
- 6260/TB-TCHQ/2020 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-6260-2020
- 7157/TB-TCHQ/2018 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-7157-2018
- 7158/TB-TCHQ/2018 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-7158-2018

## goi-019 · Ch.22 · 20 TB

- 7159/TB-TCHQ/2018 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-7159-2018
- 7174/TB-TCHQ/2018 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-7174-2018
- 7180/TB-TCHQ/2018 · nhóm 22.02 · https://www.tracuuhs.com/tin-tuc/tchq-7180-2018
- 456/TB-TCHQ/2019 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-456-2019
- 1421/TB-TCHQ/2022 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-1421-2022
- 1422/TB-TCHQ/2022 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-1422-2022
- 1423/TB-TCHQ/2022 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-1423-2022
- 1424/TB-TCHQ/2022 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-1424-2022
- 1425/TB-TCHQ/2022 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-1425-2022
- 1752/TB-TCHQ/2022 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-1752-2022
- 1852/TB-TCHQ/2020 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-1852-2020
- 2926/TB-TCHQ/2022 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-2926-2022
- 2927/TB-TCHQ/2022 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-2927-2022
- 2928/TB-TCHQ/2022 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-2928-2022
- 2929/TB-TCHQ/2022 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-2929-2022
- 2930/TB-TCHQ/2022 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-2930-2022
- 2931/TB-TCHQ/2022 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-2931-2022
- 3109/TB-TCHQ/2022 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-3109-2022
- 3110/TB-TCHQ/2022 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-3110-2022
- 3111/TB-TCHQ/2022 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-3111-2022

## goi-020 · Ch.22·23·25 · 20 TB

- 3112/TB-TCHQ/2022 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-3112-2022
- 3113/TB-TCHQ/2022 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-3113-2022
- 3115/TB-TCHQ/2022 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-3115-2022
- 3116/TB-TCHQ/2022 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-3116-2022
- 3117/TB-TCHQ/2022 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-3117-2022
- 3976/TB-TCHQ/2019 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-3976-2019
- 5286/TB-TCHQ/2018 · nhóm 22.08 · https://www.tracuuhs.com/tin-tuc/tchq-5286-2018
- 4287/TB-TCHQ/2023 · nhóm 22.09 · https://www.tracuuhs.com/tin-tuc/tchq-4287-2023
- 319/TB-TCHQ/2018 · nhóm 23.04 · https://www.tracuuhs.com/tin-tuc/tchq-319-2018
- 6409/TB-TCHQ/2018 · nhóm 23.06 · https://www.tracuuhs.com/tin-tuc/tchq-6409-2018
- 809/TB-TCHQ/2022 · nhóm 23.08 · https://www.tracuuhs.com/tin-tuc/tchq-809-2022
- 810/TB-TCHQ/2022 · nhóm 23.08 · https://www.tracuuhs.com/tin-tuc/tchq-810-2022
- 811/TB-TCHQ/2022 · nhóm 23.08 · https://www.tracuuhs.com/tin-tuc/tchq-811-2022
- 218/TB-TCHQ/2019 · nhóm 23.09 · https://www.tracuuhs.com/tin-tuc/tchq-218-2019
- 3978/TB-TCHQ/2019 · nhóm 23.09 · https://www.tracuuhs.com/tin-tuc/tchq-3978-2019
- 1990/TB-TCHQ/2019 · nhóm 25.01 · https://www.tracuuhs.com/tin-tuc/tchq-1990-2019
- 3536/TB-TCHQ/2019 · nhóm 25.01 · https://www.tracuuhs.com/tin-tuc/tchq-3536-2019
- 4172/TB-TCHQ/2019 · nhóm 25.01 · https://www.tracuuhs.com/tin-tuc/tchq-4172-2019
- 6705/TB-TCHQ/2018 · nhóm 25.01 · https://www.tracuuhs.com/tin-tuc/tchq-6705-2018
- 6713/TB-TCHQ/2018 · nhóm 25.01 · https://www.tracuuhs.com/tin-tuc/tchq-6713-2018

## goi-021 · Ch.25·26·27 · 20 TB

- 6410/TB-TCHQ/2018 · nhóm 25.06 · https://www.tracuuhs.com/tin-tuc/tchq-6410-2018
- 3535/TB-TCHQ/2019 · nhóm 25.14 · https://www.tracuuhs.com/tin-tuc/tchq-3535-2019
- 3546/TB-TCHQ/2019 · nhóm 25.17 · https://www.tracuuhs.com/tin-tuc/tchq-3546-2019
- 984/TB-TCHQ/2019 · nhóm 25.18 · https://www.tracuuhs.com/tin-tuc/tchq-984-2019
- 6498/TB-TCHQ/2018 · nhóm 25.19 · https://www.tracuuhs.com/tin-tuc/tchq-6498-2018
- 6024/TB-TCHQ/2018 · nhóm 25.29 · https://www.tracuuhs.com/tin-tuc/tchq-6024-2018
- 448/TB-TCHQ/2019 · nhóm 26.01 · https://www.tracuuhs.com/tin-tuc/tchq-448-2019
- 617/TB-TCHQ/2018 · nhóm 26.01 · https://www.tracuuhs.com/tin-tuc/tchq-617-2018
- 755/TB-TCHQ/2019 · nhóm 26.01 · https://www.tracuuhs.com/tin-tuc/tchq-755-2019
- 757/TB-TCHQ/2019 · nhóm 26.01 · https://www.tracuuhs.com/tin-tuc/tchq-757-2019
- 3104/TB-TCHQ/2018 · nhóm 26.01 · https://www.tracuuhs.com/tin-tuc/tchq-3104-2018
- 4005/TB-TCHQ/2018 · nhóm 26.01 · https://www.tracuuhs.com/tin-tuc/tchq-4005-2018
- 5729/TB-TCHQ/2018 · nhóm 26.01 · https://www.tracuuhs.com/tin-tuc/tchq-5729-2018
- 3422/TB-TCHQ/2018 · nhóm 26.06 · https://www.tracuuhs.com/tin-tuc/tchq-3422-2018
- 522/TB-TCHQ/2018 · nhóm 26.08 · https://www.tracuuhs.com/tin-tuc/tchq-522-2018
- 618/TB-TCHQ/2018 · nhóm 26.20 · https://www.tracuuhs.com/tin-tuc/tchq-618-2018
- 2479/TB-TCHQ/2018 · nhóm 26.21 · https://www.tracuuhs.com/tin-tuc/tchq-2479-2018
- 922/TB-TCHQ/2018 · nhóm 27.01 · https://www.tracuuhs.com/tin-tuc/tchq-922-2018
- 1373/TB-TCHQ/2018 · nhóm 27.04 · https://www.tracuuhs.com/tin-tuc/tchq-1373-2018
- 927/TB-TCHQ/2022 · nhóm 27.07 · https://www.tracuuhs.com/tin-tuc/tchq-927-2022

## goi-022 · Ch.27 · 20 TB

- 1062/TB-TCHQ/2022 · nhóm 27.07 · https://www.tracuuhs.com/tin-tuc/tchq-1062-2022
- 1672/TB-TCHQ/2023 · nhóm 27.07 · https://www.tracuuhs.com/tin-tuc/tchq-1672-2023
- 2315/TB-TCHQ/2022 · nhóm 27.07 · https://www.tracuuhs.com/tin-tuc/tchq-2315-2022
- 2348/TB-TCHQ/2018 · nhóm 27.07 · https://www.tracuuhs.com/tin-tuc/tchq-2348-2018
- 3509/TB-TCHQ/2022 · nhóm 27.07 · https://www.tracuuhs.com/tin-tuc/tchq-3509-2022
- 4960/TB-TCHQ/2022 · nhóm 27.07 · https://www.tracuuhs.com/tin-tuc/tchq-4960-2022
- 5079/TB-TCHQ/2022 · nhóm 27.07 · https://www.tracuuhs.com/tin-tuc/tchq-5079-2022
- 5227/TB-TCHQ/2023 · nhóm 27.07 · https://www.tracuuhs.com/tin-tuc/tchq-5227-2023
- 5228/TB-TCHQ/2023 · nhóm 27.07 · https://www.tracuuhs.com/tin-tuc/tchq-5228-2023
- 198/TB-TCHQ/2018 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-198-2018
- 326/TB-TCHQ/2023 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-326-2023
- 327/TB-TCHQ/2023 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-327-2023
- 557/TB-TCHQ/2019 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-557-2019
- 587/TB-TCHQ/2019 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-587-2019
- 928/TB-TCHQ/2022 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-928-2022
- 982/TB-TCHQ/2023 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-982-2023
- 985/TB-TCHQ/2019 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-985-2019
- 986/TB-TCHQ/2019 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-986-2019
- 987/TB-TCHQ/2019 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-987-2019
- 1005/TB-TCHQ/2025 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-1005-2025

## goi-023 · Ch.27 · 20 TB

- 1420/TB-TCHQ/2022 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-1420-2022
- 2790/TB-TCHQ/2023 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-2790-2023
- 3054/TB-TCHQ/2022 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-3054-2022
- 3055/TB-TCHQ/2022 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-3055-2022
- 3056/TB-TCHQ/2022 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-3056-2022
- 4001/TB-TCHQ/2018 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-4001-2018
- 4010/TB-TCHQ/2023 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-4010-2023
- 4011/TB-TCHQ/2023 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-4011-2023
- 4012/TB-TCHQ/2023 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-4012-2023
- 4021/TB-TCHQ/2023 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-4021-2023
- 4022/TB-TCHQ/2023 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-4022-2023
- 4466/TB-TCHQ/2024 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-4466-2024
- 4640/TB-TCHQ/2023 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-4640-2023
- 5340/TB-TCHQ/2023 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-5340-2023
- 5341/TB-TCHQ/2023 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-5341-2023
- 5690/TB-TCHQ/2022 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-5690-2022
- 5691/TB-TCHQ/2022 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-5691-2022
- 5811/TB-TCHQ/2018 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-5811-2018
- 5852/TB-TCHQ/2018 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-5852-2018
- 5909/TB-TCHQ/2018 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-5909-2018

## goi-024 · Ch.27·28 · 20 TB

- 6026/TB-TCHQ/2018 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-6026-2018
- 6306/TB-TCHQ/2018 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-6306-2018
- 6491/TB-TCHQ/2018 · nhóm 27.10 · https://www.tracuuhs.com/tin-tuc/tchq-6491-2018
- 189/TB-TCHQ/2023 · nhóm 27.11 · https://www.tracuuhs.com/tin-tuc/tchq-189-2023
- 190/TB-TCHQ/2023 · nhóm 27.11 · https://www.tracuuhs.com/tin-tuc/tchq-190-2023
- 566/TB-TCHQ/2019 · nhóm 27.15 · https://www.tracuuhs.com/tin-tuc/tchq-566-2019
- 6270/TB-TCHQ/2018 · nhóm 27.15 · https://www.tracuuhs.com/tin-tuc/tchq-6270-2018
- 6271/TB-TCHQ/2018 · nhóm 27.15 · https://www.tracuuhs.com/tin-tuc/tchq-6271-2018
- 6272/TB-TCHQ/2018 · nhóm 27.15 · https://www.tracuuhs.com/tin-tuc/tchq-6272-2018
- 6408/TB-TCHQ/2018 · nhóm 27.15 · https://www.tracuuhs.com/tin-tuc/tchq-6408-2018
- 798/TB-TCHQ/2019 · nhóm 28.03 · https://www.tracuuhs.com/tin-tuc/tchq-798-2019
- 799/TB-TCHQ/2019 · nhóm 28.03 · https://www.tracuuhs.com/tin-tuc/tchq-799-2019
- 1050/TB-TCHQ/2019 · nhóm 28.03 · https://www.tracuuhs.com/tin-tuc/tchq-1050-2019
- 3153/TB-TCHQ/2019 · nhóm 28.03 · https://www.tracuuhs.com/tin-tuc/tchq-3153-2019
- 3893/TB-TCHQ/2023 · nhóm 28.04 · https://www.tracuuhs.com/tin-tuc/tchq-3893-2023
- 1902/TB-TCHQ/2020 · nhóm 28.05 · https://www.tracuuhs.com/tin-tuc/tchq-1902-2020
- 4156/TB-TCHQ/2018 · nhóm 28.09 · https://www.tracuuhs.com/tin-tuc/tchq-4156-2018
- 6499/TB-TCHQ/2018 · nhóm 28.09 · https://www.tracuuhs.com/tin-tuc/tchq-6499-2018
- 1142/TB-TCHQ/2018 · nhóm 28.17 · https://www.tracuuhs.com/tin-tuc/tchq-1142-2018
- 6482/TB-TCHQ/2018 · nhóm 28.18 · https://www.tracuuhs.com/tin-tuc/tchq-6482-2018

## goi-025 · Ch.28 · 20 TB

- 6483/TB-TCHQ/2018 · nhóm 28.18 · https://www.tracuuhs.com/tin-tuc/tchq-6483-2018
- 6485/TB-TCHQ/2018 · nhóm 28.18 · https://www.tracuuhs.com/tin-tuc/tchq-6485-2018
- 6486/TB-TCHQ/2018 · nhóm 28.18 · https://www.tracuuhs.com/tin-tuc/tchq-6486-2018
- 21/TB-TCHQ/2019 · nhóm 28.22 · https://www.tracuuhs.com/tin-tuc/tchq-21-2019
- 1095/TB-TCHQ/2019 · nhóm 28.23 · https://www.tracuuhs.com/tin-tuc/tchq-1095-2019
- 3149/TB-TCHQ/2019 · nhóm 28.23 · https://www.tracuuhs.com/tin-tuc/tchq-3149-2019
- 3151/TB-TCHQ/2019 · nhóm 28.23 · https://www.tracuuhs.com/tin-tuc/tchq-3151-2019
- 1096/TB-TCHQ/2019 · nhóm 28.26 · https://www.tracuuhs.com/tin-tuc/tchq-1096-2019
- 2320/TB-TCHQ/2018 · nhóm 28.26 · https://www.tracuuhs.com/tin-tuc/tchq-2320-2018
- 3141/TB-TCHQ/2018 · nhóm 28.26 · https://www.tracuuhs.com/tin-tuc/tchq-3141-2018
- 6631/TB-TCHQ/2018 · nhóm 28.26 · https://www.tracuuhs.com/tin-tuc/tchq-6631-2018
- 108/TB-TCHQ/2020 · nhóm 28.27 · https://www.tracuuhs.com/tin-tuc/tchq-108-2020
- 2337/TB-TCHQ/2018 · nhóm 28.27 · https://www.tracuuhs.com/tin-tuc/tchq-2337-2018
- 3995/TB-TCHQ/2019 · nhóm 28.27 · https://www.tracuuhs.com/tin-tuc/tchq-3995-2019
- 4158/TB-TCHQ/2019 · nhóm 28.27 · https://www.tracuuhs.com/tin-tuc/tchq-4158-2019
- 5984/TB-TCHQ/2018 · nhóm 28.27 · https://www.tracuuhs.com/tin-tuc/tchq-5984-2018
- 1766/TB-TCHQ/2018 · nhóm 28.32 · https://www.tracuuhs.com/tin-tuc/tchq-1766-2018
- 1767/TB-TCHQ/2018 · nhóm 28.32 · https://www.tracuuhs.com/tin-tuc/tchq-1767-2018
- 2452/TB-TCHQ/2018 · nhóm 28.32 · https://www.tracuuhs.com/tin-tuc/tchq-2452-2018
- 3120/TB-TCHQ/2019 · nhóm 28.32 · https://www.tracuuhs.com/tin-tuc/tchq-3120-2019

## goi-026 · Ch.28 · 20 TB

- 2323/TB-TCHQ/2018 · nhóm 28.33 · https://www.tracuuhs.com/tin-tuc/tchq-2323-2018
- 3117/TB-TCHQ/2019 · nhóm 28.33 · https://www.tracuuhs.com/tin-tuc/tchq-3117-2019
- 3996/TB-TCHQ/2019 · nhóm 28.33 · https://www.tracuuhs.com/tin-tuc/tchq-3996-2019
- 6432/TB-TCHQ/2020 · nhóm 28.33 · https://www.tracuuhs.com/tin-tuc/tchq-6432-2020
- 2322/TB-TCHQ/2018 · nhóm 28.34 · https://www.tracuuhs.com/tin-tuc/tchq-2322-2018
- 3541/TB-TCHQ/2019 · nhóm 28.34 · https://www.tracuuhs.com/tin-tuc/tchq-3541-2019
- 4979/TB-TCHQ/2018 · nhóm 28.34 · https://www.tracuuhs.com/tin-tuc/tchq-4979-2018
- 143/TB-TCHQ/2020 · nhóm 28.35 · https://www.tracuuhs.com/tin-tuc/tchq-143-2020
- 1071/TB-TCHQ/2018 · nhóm 28.35 · https://www.tracuuhs.com/tin-tuc/tchq-1071-2018
- 3160/TB-TCHQ/2019 · nhóm 28.35 · https://www.tracuuhs.com/tin-tuc/tchq-3160-2019
- 3701/TB-TCHQ/2019 · nhóm 28.35 · https://www.tracuuhs.com/tin-tuc/tchq-3701-2019
- 6433/TB-TCHQ/2020 · nhóm 28.35 · https://www.tracuuhs.com/tin-tuc/tchq-6433-2020
- 3246/TB-TCHQ/2019 · nhóm 28.36 · https://www.tracuuhs.com/tin-tuc/tchq-3246-2019
- 5606/TB-TCHQ/2018 · nhóm 28.40 · https://www.tracuuhs.com/tin-tuc/tchq-5606-2018
- 240/TB-TCHQ/2019 · nhóm 28.42 · https://www.tracuuhs.com/tin-tuc/tchq-240-2019
- 1025/TB-TCHQ/2020 · nhóm 28.42 · https://www.tracuuhs.com/tin-tuc/tchq-1025-2020
- 1311/TB-TCHQ/2023 · nhóm 28.42 · https://www.tracuuhs.com/tin-tuc/tchq-1311-2023
- 3158/TB-TCHQ/2019 · nhóm 28.42 · https://www.tracuuhs.com/tin-tuc/tchq-3158-2019
- 4612/TB-TCHQ/2024 · nhóm 28.42 · https://www.tracuuhs.com/tin-tuc/tchq-4612-2024
- 5492/TB-TCHQ/2022 · nhóm 28.42 · https://www.tracuuhs.com/tin-tuc/tchq-5492-2022

## goi-027 · Ch.28·29 · 20 TB

- 517/TB-TCHQ/2025 · nhóm 28.43 · https://www.tracuuhs.com/tin-tuc/tchq-517-2025
- 4874/TB-TCHQ/2024 · nhóm 28.43 · https://www.tracuuhs.com/tin-tuc/tchq-4874-2024
- 6311/TB-TCHQ/2024 · nhóm 28.43 · https://www.tracuuhs.com/tin-tuc/tchq-6311-2024
- 183/TB-TCHQ/2018 · nhóm 28.46 · https://www.tracuuhs.com/tin-tuc/tchq-183-2018
- 3072/TB-TCHQ/2019 · nhóm 28.46 · https://www.tracuuhs.com/tin-tuc/tchq-3072-2019
- 325/TB-TCHQ/2018 · nhóm 29.01 · https://www.tracuuhs.com/tin-tuc/tchq-325-2018
- 3987/TB-TCHQ/2019 · nhóm 29.01 · https://www.tracuuhs.com/tin-tuc/tchq-3987-2019
- 134/TB-TCHQ/2020 · nhóm 29.02 · https://www.tracuuhs.com/tin-tuc/tchq-134-2020
- 811/TB-TCHQ/2018 · nhóm 29.02 · https://www.tracuuhs.com/tin-tuc/tchq-811-2018
- 1058/TB-TCHQ/2018 · nhóm 29.02 · https://www.tracuuhs.com/tin-tuc/tchq-1058-2018
- 1097/TB-TCHQ/2019 · nhóm 29.04 · https://www.tracuuhs.com/tin-tuc/tchq-1097-2019
- 1500/TB-TCHQ/2018 · nhóm 29.04 · https://www.tracuuhs.com/tin-tuc/tchq-1500-2018
- 2341/TB-TCHQ/2018 · nhóm 29.04 · https://www.tracuuhs.com/tin-tuc/tchq-2341-2018
- 3000/TB-TCHQ/2019 · nhóm 29.04 · https://www.tracuuhs.com/tin-tuc/tchq-3000-2019
- 3140/TB-TCHQ/2019 · nhóm 29.04 · https://www.tracuuhs.com/tin-tuc/tchq-3140-2019
- 7651/TB-TCHQ/2018 · nhóm 29.04 · https://www.tracuuhs.com/tin-tuc/tchq-7651-2018
- 241/TB-TCHQ/2019 · nhóm 29.05 · https://www.tracuuhs.com/tin-tuc/tchq-241-2019
- 517/TB-TCHQ/2018 · nhóm 29.05 · https://www.tracuuhs.com/tin-tuc/tchq-517-2018
- 779/TB-TCHQ/2018 · nhóm 29.05 · https://www.tracuuhs.com/tin-tuc/tchq-779-2018
- 1057/TB-TCHQ/2018 · nhóm 29.05 · https://www.tracuuhs.com/tin-tuc/tchq-1057-2018

## goi-028 · Ch.29 · 20 TB

- 3069/TB-TCHQ/2019 · nhóm 29.05 · https://www.tracuuhs.com/tin-tuc/tchq-3069-2019
- 4006/TB-TCHQ/2026 · nhóm 29.05 · https://www.tracuuhs.com/tin-tuc/tchq-4006-2026
- 2046/TB-TCHQ/2020 · nhóm 29.07 · https://www.tracuuhs.com/tin-tuc/tchq-2046-2020
- 3131/TB-TCHQ/2019 · nhóm 29.07 · https://www.tracuuhs.com/tin-tuc/tchq-3131-2019
- 6322/TB-TCHQ/2020 · nhóm 29.07 · https://www.tracuuhs.com/tin-tuc/tchq-6322-2020
- 1501/TB-TCHQ/2018 · nhóm 29.09 · https://www.tracuuhs.com/tin-tuc/tchq-1501-2018
- 2396/TB-TCHQ/2018 · nhóm 29.09 · https://www.tracuuhs.com/tin-tuc/tchq-2396-2018
- 4167/TB-TCHQ/2019 · nhóm 29.09 · https://www.tracuuhs.com/tin-tuc/tchq-4167-2019
- 4223/TB-TCHQ/2019 · nhóm 29.09 · https://www.tracuuhs.com/tin-tuc/tchq-4223-2019
- 100/TB-TCHQ/2020 · nhóm 29.12 · https://www.tracuuhs.com/tin-tuc/tchq-100-2020
- 637/TB-TCHQ/2018 · nhóm 29.14 · https://www.tracuuhs.com/tin-tuc/tchq-637-2018
- 1979/TB-TCHQ/2019 · nhóm 29.14 · https://www.tracuuhs.com/tin-tuc/tchq-1979-2019
- 6633/TB-TCHQ/2018 · nhóm 29.14 · https://www.tracuuhs.com/tin-tuc/tchq-6633-2018
- 1090/TB-TCHQ/2020 · nhóm 29.15 · https://www.tracuuhs.com/tin-tuc/tchq-1090-2020
- 1144/TB-TCHQ/2018 · nhóm 29.15 · https://www.tracuuhs.com/tin-tuc/tchq-1144-2018
- 1166/TB-TCHQ/2019 · nhóm 29.15 · https://www.tracuuhs.com/tin-tuc/tchq-1166-2019
- 2451/TB-TCHQ/2018 · nhóm 29.15 · https://www.tracuuhs.com/tin-tuc/tchq-2451-2018
- 579/TB-TCHQ/2018 · nhóm 29.16 · https://www.tracuuhs.com/tin-tuc/tchq-579-2018
- 1089/TB-TCHQ/2020 · nhóm 29.16 · https://www.tracuuhs.com/tin-tuc/tchq-1089-2020
- 1560/TB-TCHQ/2018 · nhóm 29.16 · https://www.tracuuhs.com/tin-tuc/tchq-1560-2018

## goi-029 · Ch.29 · 20 TB

- 2841/TB-TCHQ/2026 · nhóm 29.16 · https://www.tracuuhs.com/tin-tuc/tchq-2841-2026
- 3700/TB-TCHQ/2019 · nhóm 29.16 · https://www.tracuuhs.com/tin-tuc/tchq-3700-2019
- 3747/TB-TCHQ/2019 · nhóm 29.16 · https://www.tracuuhs.com/tin-tuc/tchq-3747-2019
- 3999/TB-TCHQ/2018 · nhóm 29.16 · https://www.tracuuhs.com/tin-tuc/tchq-3999-2018
- 4194/TB-TCHQ/2018 · nhóm 29.16 · https://www.tracuuhs.com/tin-tuc/tchq-4194-2018
- 531/TB-TCHQ/2018 · nhóm 29.17 · https://www.tracuuhs.com/tin-tuc/tchq-531-2018
- 573/TB-TCHQ/2018 · nhóm 29.17 · https://www.tracuuhs.com/tin-tuc/tchq-573-2018
- 2328/TB-TCHQ/2018 · nhóm 29.17 · https://www.tracuuhs.com/tin-tuc/tchq-2328-2018
- 3068/TB-TCHQ/2019 · nhóm 29.17 · https://www.tracuuhs.com/tin-tuc/tchq-3068-2019
- 5464/TB-TCHQ/2022 · nhóm 29.17 · https://www.tracuuhs.com/tin-tuc/tchq-5464-2022
- 6311/TB-TCHQ/2020 · nhóm 29.17 · https://www.tracuuhs.com/tin-tuc/tchq-6311-2020
- 508/TB-TCHQ/2018 · nhóm 29.18 · https://www.tracuuhs.com/tin-tuc/tchq-508-2018
- 530/TB-TCHQ/2018 · nhóm 29.18 · https://www.tracuuhs.com/tin-tuc/tchq-530-2018
- 718/TB-TCHQ/2018 · nhóm 29.18 · https://www.tracuuhs.com/tin-tuc/tchq-718-2018
- 753/TB-TCHQ/2019 · nhóm 29.18 · https://www.tracuuhs.com/tin-tuc/tchq-753-2019
- 1100/TB-TCHQ/2019 · nhóm 29.18 · https://www.tracuuhs.com/tin-tuc/tchq-1100-2019
- 1111/TB-TCHQ/2018 · nhóm 29.18 · https://www.tracuuhs.com/tin-tuc/tchq-1111-2018
- 1672/TB-TCHQ/2020 · nhóm 29.18 · https://www.tracuuhs.com/tin-tuc/tchq-1672-2020
- 3243/TB-TCHQ/2019 · nhóm 29.18 · https://www.tracuuhs.com/tin-tuc/tchq-3243-2019
- 1168/TB-TCHQ/2019 · nhóm 29.19 · https://www.tracuuhs.com/tin-tuc/tchq-1168-2019

## goi-030 · Ch.29 · 20 TB

- 14/TB-TCHQ/2021 · nhóm 29.20 · https://www.tracuuhs.com/tin-tuc/tchq-14-2021
- 665/TB-TCHQ/2018 · nhóm 29.20 · https://www.tracuuhs.com/tin-tuc/tchq-665-2018
- 1020/TB-TCHQ/2020 · nhóm 29.20 · https://www.tracuuhs.com/tin-tuc/tchq-1020-2020
- 1021/TB-TCHQ/2020 · nhóm 29.20 · https://www.tracuuhs.com/tin-tuc/tchq-1021-2020
- 1091/TB-TCHQ/2020 · nhóm 29.20 · https://www.tracuuhs.com/tin-tuc/tchq-1091-2020
- 1112/TB-TCHQ/2018 · nhóm 29.20 · https://www.tracuuhs.com/tin-tuc/tchq-1112-2018
- 1150/TB-TCHQ/2018 · nhóm 29.20 · https://www.tracuuhs.com/tin-tuc/tchq-1150-2018
- 1913/TB-TCHQ/2020 · nhóm 29.20 · https://www.tracuuhs.com/tin-tuc/tchq-1913-2020
- 2044/TB-TCHQ/2020 · nhóm 29.20 · https://www.tracuuhs.com/tin-tuc/tchq-2044-2020
- 2327/TB-TCHQ/2018 · nhóm 29.20 · https://www.tracuuhs.com/tin-tuc/tchq-2327-2018
- 3154/TB-TCHQ/2019 · nhóm 29.20 · https://www.tracuuhs.com/tin-tuc/tchq-3154-2019
- 3156/TB-TCHQ/2019 · nhóm 29.20 · https://www.tracuuhs.com/tin-tuc/tchq-3156-2019
- 3918/TB-TCHQ/2019 · nhóm 29.20 · https://www.tracuuhs.com/tin-tuc/tchq-3918-2019
- 525/TB-TCHQ/2018 · nhóm 29.21 · https://www.tracuuhs.com/tin-tuc/tchq-525-2018
- 532/TB-TCHQ/2018 · nhóm 29.21 · https://www.tracuuhs.com/tin-tuc/tchq-532-2018
- 2123/TB-TCHQ/2020 · nhóm 29.21 · https://www.tracuuhs.com/tin-tuc/tchq-2123-2020
- 2333/TB-TCHQ/2018 · nhóm 29.21 · https://www.tracuuhs.com/tin-tuc/tchq-2333-2018
- 3181/TB-TCHQ/2019 · nhóm 29.21 · https://www.tracuuhs.com/tin-tuc/tchq-3181-2019
- 3244/TB-TCHQ/2019 · nhóm 29.21 · https://www.tracuuhs.com/tin-tuc/tchq-3244-2019
- 3698/TB-TCHQ/2019 · nhóm 29.21 · https://www.tracuuhs.com/tin-tuc/tchq-3698-2019

## goi-031 · Ch.29 · 20 TB

- 4009/TB-TCHQ/2024 · nhóm 29.21 · https://www.tracuuhs.com/tin-tuc/tchq-4009-2024
- 133/TB-TCHQ/2020 · nhóm 29.22 · https://www.tracuuhs.com/tin-tuc/tchq-133-2020
- 214/TB-TCHQ/2019 · nhóm 29.22 · https://www.tracuuhs.com/tin-tuc/tchq-214-2019
- 1165/TB-TCHQ/2019 · nhóm 29.22 · https://www.tracuuhs.com/tin-tuc/tchq-1165-2019
- 1953/TB-TCHQ/2018 · nhóm 29.22 · https://www.tracuuhs.com/tin-tuc/tchq-1953-2018
- 1954/TB-TCHQ/2018 · nhóm 29.22 · https://www.tracuuhs.com/tin-tuc/tchq-1954-2018
- 2042/TB-TCHQ/2020 · nhóm 29.22 · https://www.tracuuhs.com/tin-tuc/tchq-2042-2020
- 3031/TB-TCHQ/2022 · nhóm 29.22 · https://www.tracuuhs.com/tin-tuc/tchq-3031-2022
- 3150/TB-TCHQ/2019 · nhóm 29.22 · https://www.tracuuhs.com/tin-tuc/tchq-3150-2019
- 3348/TB-TCHQ/2019 · nhóm 29.22 · https://www.tracuuhs.com/tin-tuc/tchq-3348-2019
- 3994/TB-TCHQ/2021 · nhóm 29.22 · https://www.tracuuhs.com/tin-tuc/tchq-3994-2021
- 4007/TB-TCHQ/2022 · nhóm 29.22 · https://www.tracuuhs.com/tin-tuc/tchq-4007-2022
- 4008/TB-TCHQ/2022 · nhóm 29.22 · https://www.tracuuhs.com/tin-tuc/tchq-4008-2022
- 4174/TB-TCHQ/2019 · nhóm 29.22 · https://www.tracuuhs.com/tin-tuc/tchq-4174-2019
- 526/TB-TCHQ/2018 · nhóm 29.23 · https://www.tracuuhs.com/tin-tuc/tchq-526-2018
- 1054/TB-TCHQ/2018 · nhóm 29.23 · https://www.tracuuhs.com/tin-tuc/tchq-1054-2018
- 1169/TB-TCHQ/2018 · nhóm 29.23 · https://www.tracuuhs.com/tin-tuc/tchq-1169-2018
- 2124/TB-TCHQ/2020 · nhóm 29.24 · https://www.tracuuhs.com/tin-tuc/tchq-2124-2020
- 2888/TB-TCHQ/2018 · nhóm 29.24 · https://www.tracuuhs.com/tin-tuc/tchq-2888-2018
- 3067/TB-TCHQ/2019 · nhóm 29.24 · https://www.tracuuhs.com/tin-tuc/tchq-3067-2019

## goi-032 · Ch.29 · 20 TB

- 3130/TB-TCHQ/2019 · nhóm 29.24 · https://www.tracuuhs.com/tin-tuc/tchq-3130-2019
- 3142/TB-TCHQ/2018 · nhóm 29.24 · https://www.tracuuhs.com/tin-tuc/tchq-3142-2018
- 3155/TB-TCHQ/2019 · nhóm 29.24 · https://www.tracuuhs.com/tin-tuc/tchq-3155-2019
- 3175/TB-TCHQ/2018 · nhóm 29.24 · https://www.tracuuhs.com/tin-tuc/tchq-3175-2018
- 3179/TB-TCHQ/2019 · nhóm 29.24 · https://www.tracuuhs.com/tin-tuc/tchq-3179-2019
- 3547/TB-TCHQ/2019 · nhóm 29.24 · https://www.tracuuhs.com/tin-tuc/tchq-3547-2019
- 3751/TB-TCHQ/2019 · nhóm 29.24 · https://www.tracuuhs.com/tin-tuc/tchq-3751-2019
- 3921/TB-TCHQ/2019 · nhóm 29.24 · https://www.tracuuhs.com/tin-tuc/tchq-3921-2019
- 6257/TB-TCHQ/2018 · nhóm 29.24 · https://www.tracuuhs.com/tin-tuc/tchq-6257-2018
- 6259/TB-TCHQ/2018 · nhóm 29.24 · https://www.tracuuhs.com/tin-tuc/tchq-6259-2018
- 6260/TB-TCHQ/2018 · nhóm 29.24 · https://www.tracuuhs.com/tin-tuc/tchq-6260-2018
- 7117/TB-TCHQ/2018 · nhóm 29.24 · https://www.tracuuhs.com/tin-tuc/tchq-7117-2018
- 527/TB-TCHQ/2018 · nhóm 29.25 · https://www.tracuuhs.com/tin-tuc/tchq-527-2018
- 1963/TB-TCHQ/2020 · nhóm 29.25 · https://www.tracuuhs.com/tin-tuc/tchq-1963-2020
- 1022/TB-TCHQ/2020 · nhóm 29.28 · https://www.tracuuhs.com/tin-tuc/tchq-1022-2020
- 2321/TB-TCHQ/2018 · nhóm 29.30 · https://www.tracuuhs.com/tin-tuc/tchq-2321-2018
- 4162/TB-TCHQ/2019 · nhóm 29.30 · https://www.tracuuhs.com/tin-tuc/tchq-4162-2019
- 1097/TB-TCHQ/2020 · nhóm 29.31 · https://www.tracuuhs.com/tin-tuc/tchq-1097-2020
- 3162/TB-TCHQ/2019 · nhóm 29.31 · https://www.tracuuhs.com/tin-tuc/tchq-3162-2019
- 3748/TB-TCHQ/2019 · nhóm 29.31 · https://www.tracuuhs.com/tin-tuc/tchq-3748-2019

## goi-033 · Ch.29 · 20 TB

- 4815/TB-TCHQ/2018 · nhóm 29.31 · https://www.tracuuhs.com/tin-tuc/tchq-4815-2018
- 5076/TB-TCHQ/2018 · nhóm 29.31 · https://www.tracuuhs.com/tin-tuc/tchq-5076-2018
- 6625/TB-TCHQ/2018 · nhóm 29.31 · https://www.tracuuhs.com/tin-tuc/tchq-6625-2018
- 326/TB-TCHQ/2020 · nhóm 29.32 · https://www.tracuuhs.com/tin-tuc/tchq-326-2020
- 754/TB-TCHQ/2019 · nhóm 29.32 · https://www.tracuuhs.com/tin-tuc/tchq-754-2019
- 5317/TB-TCHQ/2024 · nhóm 29.32 · https://www.tracuuhs.com/tin-tuc/tchq-5317-2024
- 103/TB-TCHQ/2020 · nhóm 29.33 · https://www.tracuuhs.com/tin-tuc/tchq-103-2020
- 600/TB-TCHQ/2018 · nhóm 29.33 · https://www.tracuuhs.com/tin-tuc/tchq-600-2018
- 705/TB-TCHQ/2019 · nhóm 29.33 · https://www.tracuuhs.com/tin-tuc/tchq-705-2019
- 1124/TB-TCHQ/2018 · nhóm 29.33 · https://www.tracuuhs.com/tin-tuc/tchq-1124-2018
- 1141/TB-TCHQ/2018 · nhóm 29.33 · https://www.tracuuhs.com/tin-tuc/tchq-1141-2018
- 1167/TB-TCHQ/2019 · nhóm 29.33 · https://www.tracuuhs.com/tin-tuc/tchq-1167-2019
- 2890/TB-TCHQ/2018 · nhóm 29.33 · https://www.tracuuhs.com/tin-tuc/tchq-2890-2018
- 3180/TB-TCHQ/2019 · nhóm 29.33 · https://www.tracuuhs.com/tin-tuc/tchq-3180-2019
- 4156/TB-TCHQ/2019 · nhóm 29.33 · https://www.tracuuhs.com/tin-tuc/tchq-4156-2019
- 4173/TB-TCHQ/2019 · nhóm 29.33 · https://www.tracuuhs.com/tin-tuc/tchq-4173-2019
- 4176/TB-TCHQ/2019 · nhóm 29.33 · https://www.tracuuhs.com/tin-tuc/tchq-4176-2019
- 4613/TB-TCHQ/2024 · nhóm 29.33 · https://www.tracuuhs.com/tin-tuc/tchq-4613-2024
- 6309/TB-TCHQ/2020 · nhóm 29.33 · https://www.tracuuhs.com/tin-tuc/tchq-6309-2020
- 6310/TB-TCHQ/2020 · nhóm 29.33 · https://www.tracuuhs.com/tin-tuc/tchq-6310-2020

## goi-034 · Ch.29 · 20 TB

- 6720/TB-TCHQ/2018 · nhóm 29.33 · https://www.tracuuhs.com/tin-tuc/tchq-6720-2018
- 601/TB-TCHQ/2018 · nhóm 29.34 · https://www.tracuuhs.com/tin-tuc/tchq-601-2018
- 1793/TB-TCHQ/2018 · nhóm 29.34 · https://www.tracuuhs.com/tin-tuc/tchq-1793-2018
- 109/TB-TCHQ/2020 · nhóm 29.35 · https://www.tracuuhs.com/tin-tuc/tchq-109-2020
- 2450/TB-TCHQ/2018 · nhóm 29.35 · https://www.tracuuhs.com/tin-tuc/tchq-2450-2018
- 3220/TB-TCHQ/2018 · nhóm 29.35 · https://www.tracuuhs.com/tin-tuc/tchq-3220-2018
- 99/TB-TCHQ/2022 · nhóm 29.36 · https://www.tracuuhs.com/tin-tuc/tchq-99-2022
- 577/TB-TCHQ/2018 · nhóm 29.36 · https://www.tracuuhs.com/tin-tuc/tchq-577-2018
- 1140/TB-TCHQ/2020 · nhóm 29.36 · https://www.tracuuhs.com/tin-tuc/tchq-1140-2020
- 1327/TB-TCHQ/2024 · nhóm 29.36 · https://www.tracuuhs.com/tin-tuc/tchq-1327-2024
- 2970/TB-TCHQ/2018 · nhóm 29.36 · https://www.tracuuhs.com/tin-tuc/tchq-2970-2018
- 3152/TB-TCHQ/2019 · nhóm 29.36 · https://www.tracuuhs.com/tin-tuc/tchq-3152-2019
- 3299/TB-TCHQ/2024 · nhóm 29.36 · https://www.tracuuhs.com/tin-tuc/tchq-3299-2024
- 3300/TB-TCHQ/2024 · nhóm 29.36 · https://www.tracuuhs.com/tin-tuc/tchq-3300-2024
- 3301/TB-TCHQ/2024 · nhóm 29.36 · https://www.tracuuhs.com/tin-tuc/tchq-3301-2024
- 3832/TB-TCHQ/2021 · nhóm 29.36 · https://www.tracuuhs.com/tin-tuc/tchq-3832-2021
- 3997/TB-TCHQ/2019 · nhóm 29.36 · https://www.tracuuhs.com/tin-tuc/tchq-3997-2019
- 4856/TB-TCHQ/2024 · nhóm 29.36 · https://www.tracuuhs.com/tin-tuc/tchq-4856-2024
- 6305/TB-TCHQ/2024 · nhóm 29.36 · https://www.tracuuhs.com/tin-tuc/tchq-6305-2024
- 535/TB-TCHQ/2018 · nhóm 29.37 · https://www.tracuuhs.com/tin-tuc/tchq-535-2018

## goi-035 · Ch.29·30 · 20 TB

- 635/TB-TCHQ/2018 · nhóm 29.37 · https://www.tracuuhs.com/tin-tuc/tchq-635-2018
- 6276/TB-TCHQ/2020 · nhóm 29.38 · https://www.tracuuhs.com/tin-tuc/tchq-6276-2020
- 3919/TB-TCHQ/2019 · nhóm 29.39 · https://www.tracuuhs.com/tin-tuc/tchq-3919-2019
- 3159/TB-TCHQ/2019 · nhóm 29.40 · https://www.tracuuhs.com/tin-tuc/tchq-3159-2019
- 3699/TB-TCHQ/2019 · nhóm 29.40 · https://www.tracuuhs.com/tin-tuc/tchq-3699-2019
- 6764/TB-TCHQ/2018 · nhóm 29.42 · https://www.tracuuhs.com/tin-tuc/tchq-6764-2018
- 1897/TB-TCHQ/2020 · nhóm 30.02 · https://www.tracuuhs.com/tin-tuc/tchq-1897-2020
- 5197/TB-TCHQ/2024 · nhóm 30.02 · https://www.tracuuhs.com/tin-tuc/tchq-5197-2024
- 197/TB-TCHQ/2018 · nhóm 30.03 · https://www.tracuuhs.com/tin-tuc/tchq-197-2018
- 504/TB-TCHQ/2018 · nhóm 30.03 · https://www.tracuuhs.com/tin-tuc/tchq-504-2018
- 507/TB-TCHQ/2018 · nhóm 30.03 · https://www.tracuuhs.com/tin-tuc/tchq-507-2018
- 3800/TB-TCHQ/2019 · nhóm 30.03 · https://www.tracuuhs.com/tin-tuc/tchq-3800-2019
- 3920/TB-TCHQ/2019 · nhóm 30.03 · https://www.tracuuhs.com/tin-tuc/tchq-3920-2019
- 143/TB-TCHQ/2024 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-143-2024
- 191/TB-TCHQ/2024 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-191-2024
- 293/TB-TCHQ/2018 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-293-2018
- 294/TB-TCHQ/2018 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-294-2018
- 313/TB-TCHQ/2024 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-313-2024
- 492/TB-TCHQ/2022 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-492-2022
- 587/TB-TCHQ/2023 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-587-2023

## goi-036 · Ch.30 · 20 TB

- 732/TB-TCHQ/2023 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-732-2023
- 1107/TB-TCHQ/2023 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-1107-2023
- 1715/TB-TCHQ/2023 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-1715-2023
- 1771/TB-TCHQ/2023 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-1771-2023
- 1800/TB-TCHQ/2023 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-1800-2023
- 1801/TB-TCHQ/2023 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-1801-2023
- 1802/TB-TCHQ/2023 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-1802-2023
- 1972/TB-TCHQ/2022 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-1972-2022
- 2036/TB-TCHQ/2020 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-2036-2020
- 2258/TB-TCHQ/2024 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-2258-2024
- 2344/TB-TCHQ/2018 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-2344-2018
- 2688/TB-TCHQ/2022 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-2688-2022
- 2719/TB-TCHQ/2018 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-2719-2018
- 3134/TB-TCHQ/2019 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-3134-2019
- 3163/TB-TCHQ/2019 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-3163-2019
- 3308/TB-TCHQ/2018 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-3308-2018
- 3664/TB-TCHQ/2024 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-3664-2024
- 3750/TB-TCHQ/2019 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-3750-2019
- 3859/TB-TCHQ/2019 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-3859-2019
- 3860/TB-TCHQ/2019 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-3860-2019

## goi-037 · Ch.30 · 20 TB

- 3861/TB-TCHQ/2019 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-3861-2019
- 3862/TB-TCHQ/2019 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-3862-2019
- 3863/TB-TCHQ/2019 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-3863-2019
- 3904/TB-TCHQ/2024 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-3904-2024
- 3913/TB-TCHQ/2019 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-3913-2019
- 4097/TB-TCHQ/2024 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-4097-2024
- 4098/TB-TCHQ/2024 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-4098-2024
- 4099/TB-TCHQ/2024 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-4099-2024
- 4100/TB-TCHQ/2024 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-4100-2024
- 4101/TB-TCHQ/2024 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-4101-2024
- 4127/TB-TCHQ/2023 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-4127-2023
- 4215/TB-TCHQ/2024 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-4215-2024
- 4323/TB-TCHQ/2019 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-4323-2019
- 4796/TB-TCHQ/2022 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-4796-2022
- 4945/TB-TCHQ/2023 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-4945-2023
- 5062/TB-TCHQ/2022 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-5062-2022
- 5283/TB-TCHQ/2024 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-5283-2024
- 5284/TB-TCHQ/2024 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-5284-2024
- 5285/TB-TCHQ/2024 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-5285-2024
- 5750/TB-TCHQ/2023 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-5750-2023

## goi-038 · Ch.30·31·32 · 20 TB

- 5757/TB-TCHQ/2022 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-5757-2022
- 5758/TB-TCHQ/2022 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-5758-2022
- 5760/TB-TCHQ/2022 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-5760-2022
- 6101/TB-TCHQ/2024 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-6101-2024
- 7170/TB-TCHQ/2018 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-7170-2018
- 7480/TB-TCHQ/2018 · nhóm 30.04 · https://www.tracuuhs.com/tin-tuc/tchq-7480-2018
- 1055/TB-TCHQ/2019 · nhóm 30.05 · https://www.tracuuhs.com/tin-tuc/tchq-1055-2019
- 4222/TB-TCHQ/2019 · nhóm 30.05 · https://www.tracuuhs.com/tin-tuc/tchq-4222-2019
- 4224/TB-TCHQ/2019 · nhóm 30.05 · https://www.tracuuhs.com/tin-tuc/tchq-4224-2019
- 4324/TB-TCHQ/2019 · nhóm 30.05 · https://www.tracuuhs.com/tin-tuc/tchq-4324-2019
- 5538/TB-TCHQ/2019 · nhóm 30.05 · https://www.tracuuhs.com/tin-tuc/tchq-5538-2019
- 6207/TB-TCHQ/2024 · nhóm 30.05 · https://www.tracuuhs.com/tin-tuc/tchq-6207-2024
- 6208/TB-TCHQ/2024 · nhóm 30.05 · https://www.tracuuhs.com/tin-tuc/tchq-6208-2024
- 619/TB-TCHQ/2025 · nhóm 30.06 · https://www.tracuuhs.com/tin-tuc/tchq-619-2025
- 4389/TB-TCHQ/2022 · nhóm 31.02 · https://www.tracuuhs.com/tin-tuc/tchq-4389-2022
- 5244/TB-TCHQ/2018 · nhóm 31.02 · https://www.tracuuhs.com/tin-tuc/tchq-5244-2018
- 2152/TB-TCHQ/2020 · nhóm 31.05 · https://www.tracuuhs.com/tin-tuc/tchq-2152-2020
- 1028/TB-TCHQ/2019 · nhóm 32.04 · https://www.tracuuhs.com/tin-tuc/tchq-1028-2019
- 1029/TB-TCHQ/2019 · nhóm 32.04 · https://www.tracuuhs.com/tin-tuc/tchq-1029-2019
- 2100/TB-TCHQ/2018 · nhóm 32.04 · https://www.tracuuhs.com/tin-tuc/tchq-2100-2018

## goi-039 · Ch.32 · 20 TB

- 3110/TB-TCHQ/2019 · nhóm 32.04 · https://www.tracuuhs.com/tin-tuc/tchq-3110-2019
- 7122/TB-TCHQ/2018 · nhóm 32.04 · https://www.tracuuhs.com/tin-tuc/tchq-7122-2018
- 4468/TB-TCHQ/2023 · nhóm 32.06 · https://www.tracuuhs.com/tin-tuc/tchq-4468-2023
- 4588/TB-TCHQ/2023 · nhóm 32.06 · https://www.tracuuhs.com/tin-tuc/tchq-4588-2023
- 5282/TB-TCHQ/2024 · nhóm 32.06 · https://www.tracuuhs.com/tin-tuc/tchq-5282-2024
- 1504/TB-TCHQ/2023 · nhóm 32.07 · https://www.tracuuhs.com/tin-tuc/tchq-1504-2023
- 1616/TB-TCHQ/2024 · nhóm 32.07 · https://www.tracuuhs.com/tin-tuc/tchq-1616-2024
- 185/TB-TCHQ/2024 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-185-2024
- 1189/TB-TCHQ/2020 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-1189-2020
- 1210/TB-TCHQ/2020 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-1210-2020
- 1811/TB-TCHQ/2020 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-1811-2020
- 1822/TB-TCHQ/2018 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-1822-2018
- 1823/TB-TCHQ/2018 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-1823-2018
- 2122/TB-TCHQ/2020 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-2122-2020
- 2174/TB-TCHQ/2020 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-2174-2020
- 2382/TB-TCHQ/2018 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-2382-2018
- 2710/TB-TCHQ/2022 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-2710-2022
- 2711/TB-TCHQ/2022 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-2711-2022
- 2712/TB-TCHQ/2022 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-2712-2022
- 2713/TB-TCHQ/2022 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-2713-2022

## goi-040 · Ch.32 · 20 TB

- 2714/TB-TCHQ/2022 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-2714-2022
- 2715/TB-TCHQ/2022 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-2715-2022
- 2716/TB-TCHQ/2022 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-2716-2022
- 2717/TB-TCHQ/2022 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-2717-2022
- 2718/TB-TCHQ/2022 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-2718-2022
- 2719/TB-TCHQ/2022 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-2719-2022
- 2720/TB-TCHQ/2022 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-2720-2022
- 2721/TB-TCHQ/2022 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-2721-2022
- 2722/TB-TCHQ/2022 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-2722-2022
- 3403/TB-TCHQ/2018 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-3403-2018
- 3836/TB-TCHQ/2022 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-3836-2022
- 3837/TB-TCHQ/2022 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-3837-2022
- 4667/TB-TCHQ/2023 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-4667-2023
- 5419/TB-TCHQ/2022 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-5419-2022
- 5437/TB-TCHQ/2022 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-5437-2022
- 5438/TB-TCHQ/2022 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-5438-2022
- 6269/TB-TCHQ/2020 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-6269-2020
- 7281/TB-TCHQ/2018 · nhóm 32.08 · https://www.tracuuhs.com/tin-tuc/tchq-7281-2018
- 1923/TB-TCHQ/2018 · nhóm 32.09 · https://www.tracuuhs.com/tin-tuc/tchq-1923-2018
- 6268/TB-TCHQ/2020 · nhóm 32.09 · https://www.tracuuhs.com/tin-tuc/tchq-6268-2020

## goi-041 · Ch.32·33 · 20 TB

- 1261/TB-TCHQ/2022 · nhóm 32.10 · https://www.tracuuhs.com/tin-tuc/tchq-1261-2022
- 130/TB-TCHQ/2021 · nhóm 32.12 · https://www.tracuuhs.com/tin-tuc/tchq-130-2021
- 132/TB-TCHQ/2021 · nhóm 32.14 · https://www.tracuuhs.com/tin-tuc/tchq-132-2021
- 1763/TB-TCHQ/2018 · nhóm 32.14 · https://www.tracuuhs.com/tin-tuc/tchq-1763-2018
- 2063/TB-TCHQ/2018 · nhóm 32.14 · https://www.tracuuhs.com/tin-tuc/tchq-2063-2018
- 2064/TB-TCHQ/2018 · nhóm 32.14 · https://www.tracuuhs.com/tin-tuc/tchq-2064-2018
- 3401/TB-TCHQ/2018 · nhóm 32.14 · https://www.tracuuhs.com/tin-tuc/tchq-3401-2018
- 3402/TB-TCHQ/2018 · nhóm 32.14 · https://www.tracuuhs.com/tin-tuc/tchq-3402-2018
- 5417/TB-TCHQ/2022 · nhóm 32.15 · https://www.tracuuhs.com/tin-tuc/tchq-5417-2022
- 5418/TB-TCHQ/2022 · nhóm 32.15 · https://www.tracuuhs.com/tin-tuc/tchq-5418-2022
- 804/TB-TCHQ/2018 · nhóm 33.01 · https://www.tracuuhs.com/tin-tuc/tchq-804-2018
- 5139/TB-TCHQ/2022 · nhóm 33.01 · https://www.tracuuhs.com/tin-tuc/tchq-5139-2022
- 33/TB-TCHQ/2018 · nhóm 33.02 · https://www.tracuuhs.com/tin-tuc/tchq-33-2018
- 920/TB-TCHQ/2023 · nhóm 33.02 · https://www.tracuuhs.com/tin-tuc/tchq-920-2023
- 924/TB-TCHQ/2023 · nhóm 33.02 · https://www.tracuuhs.com/tin-tuc/tchq-924-2023
- 1276/TB-TCHQ/2019 · nhóm 33.02 · https://www.tracuuhs.com/tin-tuc/tchq-1276-2019
- 1883/TB-TCHQ/2023 · nhóm 33.02 · https://www.tracuuhs.com/tin-tuc/tchq-1883-2023
- 12/TB-TCHQ/2021 · nhóm 33.04 · https://www.tracuuhs.com/tin-tuc/tchq-12-2021
- 13/TB-TCHQ/2021 · nhóm 33.04 · https://www.tracuuhs.com/tin-tuc/tchq-13-2021
- 15/TB-TCHQ/2021 · nhóm 33.04 · https://www.tracuuhs.com/tin-tuc/tchq-15-2021

## goi-042 · Ch.33 · 20 TB

- 174/TB-TCHQ/2022 · nhóm 33.04 · https://www.tracuuhs.com/tin-tuc/tchq-174-2022
- 480/TB-TCHQ/2019 · nhóm 33.04 · https://www.tracuuhs.com/tin-tuc/tchq-480-2019
- 493/TB-TCHQ/2022 · nhóm 33.04 · https://www.tracuuhs.com/tin-tuc/tchq-493-2022
- 963/TB-TCHQ/2022 · nhóm 33.04 · https://www.tracuuhs.com/tin-tuc/tchq-963-2022
- 1061/TB-TCHQ/2022 · nhóm 33.04 · https://www.tracuuhs.com/tin-tuc/tchq-1061-2022
- 1126/TB-TCHQ/2018 · nhóm 33.04 · https://www.tracuuhs.com/tin-tuc/tchq-1126-2018
- 1448/TB-TCHQ/2018 · nhóm 33.04 · https://www.tracuuhs.com/tin-tuc/tchq-1448-2018
- 1663/TB-TCHQ/2023 · nhóm 33.04 · https://www.tracuuhs.com/tin-tuc/tchq-1663-2023
- 1812/TB-TCHQ/2020 · nhóm 33.04 · https://www.tracuuhs.com/tin-tuc/tchq-1812-2020
- 2324/TB-TCHQ/2018 · nhóm 33.04 · https://www.tracuuhs.com/tin-tuc/tchq-2324-2018
- 2325/TB-TCHQ/2018 · nhóm 33.04 · https://www.tracuuhs.com/tin-tuc/tchq-2325-2018
- 3133/TB-TCHQ/2019 · nhóm 33.04 · https://www.tracuuhs.com/tin-tuc/tchq-3133-2019
- 3135/TB-TCHQ/2019 · nhóm 33.04 · https://www.tracuuhs.com/tin-tuc/tchq-3135-2019
- 3749/TB-TCHQ/2019 · nhóm 33.04 · https://www.tracuuhs.com/tin-tuc/tchq-3749-2019
- 4051/TB-TCHQ/2024 · nhóm 33.04 · https://www.tracuuhs.com/tin-tuc/tchq-4051-2024
- 4375/TB-TCHQ/2022 · nhóm 33.04 · https://www.tracuuhs.com/tin-tuc/tchq-4375-2022
- 6071/TB-TCHQ/2021 · nhóm 33.04 · https://www.tracuuhs.com/tin-tuc/tchq-6071-2021
- 3132/TB-TCHQ/2019 · nhóm 33.05 · https://www.tracuuhs.com/tin-tuc/tchq-3132-2019
- 3797/TB-TCHQ/2022 · nhóm 33.06 · https://www.tracuuhs.com/tin-tuc/tchq-3797-2022
- 57/TB-TCHQ/2023 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-57-2023

## goi-043 · Ch.33 · 20 TB

- 96/TB-TCHQ/2018 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-96-2018
- 144/TB-TCHQ/2024 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-144-2024
- 176/TB-TCHQ/2022 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-176-2022
- 680/TB-TCHQ/2019 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-680-2019
- 991/TB-TCHQ/2022 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-991-2022
- 1015/TB-TCHQ/2022 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-1015-2022
- 1325/TB-TCHQ/2018 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-1325-2018
- 1326/TB-TCHQ/2018 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-1326-2018
- 1548/TB-TCHQ/2024 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-1548-2024
- 1980/TB-TCHQ/2019 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-1980-2019
- 2276/TB-TCHQ/2024 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-2276-2024
- 3167/TB-TCHQ/2022 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-3167-2022
- 3196/TB-TCHQ/2023 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-3196-2023
- 4053/TB-TCHQ/2024 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-4053-2024
- 4054/TB-TCHQ/2024 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-4054-2024
- 4055/TB-TCHQ/2024 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-4055-2024
- 4238/TB-TCHQ/2021 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-4238-2021
- 4239/TB-TCHQ/2021 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-4239-2021
- 4240/TB-TCHQ/2021 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-4240-2021
- 4903/TB-TCHQ/2022 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-4903-2022

## goi-044 · Ch.33·34 · 20 TB

- 5189/TB-TCHQ/2018 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-5189-2018
- 5751/TB-TCHQ/2023 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-5751-2023
- 6504/TB-TCHQ/2018 · nhóm 33.07 · https://www.tracuuhs.com/tin-tuc/tchq-6504-2018
- 636/TB-TCHQ/2018 · nhóm 34.01 · https://www.tracuuhs.com/tin-tuc/tchq-636-2018
- 716/TB-TCHQ/2023 · nhóm 34.01 · https://www.tracuuhs.com/tin-tuc/tchq-716-2023
- 717/TB-TCHQ/2023 · nhóm 34.01 · https://www.tracuuhs.com/tin-tuc/tchq-717-2023
- 6065/TB-TCHQ/2018 · nhóm 34.01 · https://www.tracuuhs.com/tin-tuc/tchq-6065-2018
- 192/TB-TCHQ/2024 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-192-2024
- 223/TB-TCHQ/2025 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-223-2025
- 247/TB-TCHQ/2019 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-247-2019
- 248/TB-TCHQ/2019 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-248-2019
- 716/TB-TCHQ/2018 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-716-2018
- 974/TB-TCHQ/2019 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-974-2019
- 1101/TB-TCHQ/2019 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-1101-2019
- 1147/TB-TCHQ/2019 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-1147-2019
- 1183/TB-TCHQ/2018 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-1183-2018
- 1227/TB-TCHQ/2019 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-1227-2019
- 1228/TB-TCHQ/2019 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-1228-2019
- 1328/TB-TCHQ/2018 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-1328-2018
- 1405/TB-TCHQ/2018 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-1405-2018

## goi-045 · Ch.34 · 20 TB

- 1406/TB-TCHQ/2018 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-1406-2018
- 1407/TB-TCHQ/2018 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-1407-2018
- 1408/TB-TCHQ/2018 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-1408-2018
- 1755/TB-TCHQ/2020 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-1755-2020
- 1776/TB-TCHQ/2020 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-1776-2020
- 1778/TB-TCHQ/2020 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-1778-2020
- 1807/TB-TCHQ/2018 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-1807-2018
- 1850/TB-TCHQ/2020 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-1850-2020
- 1992/TB-TCHQ/2019 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-1992-2019
- 2040/TB-TCHQ/2020 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-2040-2020
- 2042/TB-TCHQ/2018 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-2042-2018
- 2308/TB-TCHQ/2023 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-2308-2023
- 2350/TB-TCHQ/2023 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-2350-2023
- 2373/TB-TCHQ/2024 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-2373-2024
- 2908/TB-TCHQ/2023 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-2908-2023
- 3115/TB-TCHQ/2019 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-3115-2019
- 3116/TB-TCHQ/2019 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-3116-2019
- 3118/TB-TCHQ/2019 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-3118-2019
- 3119/TB-TCHQ/2019 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-3119-2019
- 3141/TB-TCHQ/2019 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-3141-2019

## goi-046 · Ch.34 · 20 TB

- 3611/TB-TCHQ/2019 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-3611-2019
- 3673/TB-TCHQ/2019 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-3673-2019
- 3755/TB-TCHQ/2019 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-3755-2019
- 3756/TB-TCHQ/2019 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-3756-2019
- 3828/TB-TCHQ/2019 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-3828-2019
- 3963/TB-TCHQ/2018 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-3963-2018
- 4017/TB-TCHQ/2018 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-4017-2018
- 4213/TB-TCHQ/2019 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-4213-2019
- 4320/TB-TCHQ/2019 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-4320-2019
- 4616/TB-TCHQ/2024 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-4616-2024
- 5010/TB-TCHQ/2018 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-5010-2018
- 5011/TB-TCHQ/2018 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-5011-2018
- 5190/TB-TCHQ/2018 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-5190-2018
- 5191/TB-TCHQ/2018 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-5191-2018
- 5878/TB-TCHQ/2018 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-5878-2018
- 6305/TB-TCHQ/2018 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-6305-2018
- 6468/TB-TCHQ/2018 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-6468-2018
- 6721/TB-TCHQ/2018 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-6721-2018
- 6722/TB-TCHQ/2018 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-6722-2018
- 7102/TB-TCHQ/2018 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-7102-2018

## goi-047 · Ch.34·35 · 20 TB

- 7116/TB-TCHQ/2018 · nhóm 34.02 · https://www.tracuuhs.com/tin-tuc/tchq-7116-2018
- 528/TB-TCHQ/2018 · nhóm 34.03 · https://www.tracuuhs.com/tin-tuc/tchq-528-2018
- 632/TB-TCHQ/2018 · nhóm 34.03 · https://www.tracuuhs.com/tin-tuc/tchq-632-2018
- 1187/TB-TCHQ/2020 · nhóm 34.03 · https://www.tracuuhs.com/tin-tuc/tchq-1187-2020
- 1192/TB-TCHQ/2020 · nhóm 34.03 · https://www.tracuuhs.com/tin-tuc/tchq-1192-2020
- 3702/TB-TCHQ/2019 · nhóm 34.03 · https://www.tracuuhs.com/tin-tuc/tchq-3702-2019
- 7566/TB-TCHQ/2018 · nhóm 34.03 · https://www.tracuuhs.com/tin-tuc/tchq-7566-2018
- 4514/TB-TCHQ/2023 · nhóm 34.04 · https://www.tracuuhs.com/tin-tuc/tchq-4514-2023
- 1327/TB-TCHQ/2018 · nhóm 34.05 · https://www.tracuuhs.com/tin-tuc/tchq-1327-2018
- 5983/TB-TCHQ/2018 · nhóm 34.05 · https://www.tracuuhs.com/tin-tuc/tchq-5983-2018
- 7121/TB-TCHQ/2018 · nhóm 34.05 · https://www.tracuuhs.com/tin-tuc/tchq-7121-2018
- 2222/TB-TCHQ/2024 · nhóm 35.04 · https://www.tracuuhs.com/tin-tuc/tchq-2222-2024
- 2516/TB-TCHQ/2024 · nhóm 35.04 · https://www.tracuuhs.com/tin-tuc/tchq-2516-2024
- 2517/TB-TCHQ/2024 · nhóm 35.04 · https://www.tracuuhs.com/tin-tuc/tchq-2517-2024
- 2518/TB-TCHQ/2024 · nhóm 35.04 · https://www.tracuuhs.com/tin-tuc/tchq-2518-2024
- 2654/TB-TCHQ/2023 · nhóm 35.04 · https://www.tracuuhs.com/tin-tuc/tchq-2654-2023
- 4376/TB-TCHQ/2022 · nhóm 35.04 · https://www.tracuuhs.com/tin-tuc/tchq-4376-2022
- 4745/TB-TCHQ/2024 · nhóm 35.04 · https://www.tracuuhs.com/tin-tuc/tchq-4745-2024
- 4789/TB-TCHQ/2024 · nhóm 35.04 · https://www.tracuuhs.com/tin-tuc/tchq-4789-2024
- 4790/TB-TCHQ/2024 · nhóm 35.04 · https://www.tracuuhs.com/tin-tuc/tchq-4790-2024

## goi-048 · Ch.35·37 · 20 TB

- 4791/TB-TCHQ/2024 · nhóm 35.04 · https://www.tracuuhs.com/tin-tuc/tchq-4791-2024
- 5682/TB-TCHQ/2023 · nhóm 35.04 · https://www.tracuuhs.com/tin-tuc/tchq-5682-2023
- 6256/TB-TCHQ/2018 · nhóm 35.04 · https://www.tracuuhs.com/tin-tuc/tchq-6256-2018
- 1671/TB-TCHQ/2020 · nhóm 35.05 · https://www.tracuuhs.com/tin-tuc/tchq-1671-2020
- 1673/TB-TCHQ/2020 · nhóm 35.05 · https://www.tracuuhs.com/tin-tuc/tchq-1673-2020
- 1703/TB-TCHQ/2023 · nhóm 35.06 · https://www.tracuuhs.com/tin-tuc/tchq-1703-2023
- 1704/TB-TCHQ/2023 · nhóm 35.06 · https://www.tracuuhs.com/tin-tuc/tchq-1704-2023
- 1705/TB-TCHQ/2023 · nhóm 35.06 · https://www.tracuuhs.com/tin-tuc/tchq-1705-2023
- 1706/TB-TCHQ/2023 · nhóm 35.06 · https://www.tracuuhs.com/tin-tuc/tchq-1706-2023
- 3312/TB-TCHQ/2024 · nhóm 35.06 · https://www.tracuuhs.com/tin-tuc/tchq-3312-2024
- 3566/TB-TCHQ/2022 · nhóm 35.06 · https://www.tracuuhs.com/tin-tuc/tchq-3566-2022
- 3568/TB-TCHQ/2022 · nhóm 35.06 · https://www.tracuuhs.com/tin-tuc/tchq-3568-2022
- 3819/TB-TCHQ/2022 · nhóm 35.06 · https://www.tracuuhs.com/tin-tuc/tchq-3819-2022
- 5147/TB-TCHQ/2023 · nhóm 35.06 · https://www.tracuuhs.com/tin-tuc/tchq-5147-2023
- 5678/TB-TCHQ/2022 · nhóm 35.07 · https://www.tracuuhs.com/tin-tuc/tchq-5678-2022
- 924/TB-TCHQ/2019 · nhóm 37.01 · https://www.tracuuhs.com/tin-tuc/tchq-924-2019
- 3236/TB-TCHQ/2018 · nhóm 37.01 · https://www.tracuuhs.com/tin-tuc/tchq-3236-2018
- 4368/TB-TCHQ/2022 · nhóm 37.02 · https://www.tracuuhs.com/tin-tuc/tchq-4368-2022
- 5420/TB-TCHQ/2022 · nhóm 37.07 · https://www.tracuuhs.com/tin-tuc/tchq-5420-2022
- 5421/TB-TCHQ/2022 · nhóm 37.07 · https://www.tracuuhs.com/tin-tuc/tchq-5421-2022

## goi-049 · Ch.38 · 20 TB

- 922/TB-TCHQ/2019 · nhóm 38.01 · https://www.tracuuhs.com/tin-tuc/tchq-922-2019
- 921/TB-TCHQ/2019 · nhóm 38.06 · https://www.tracuuhs.com/tin-tuc/tchq-921-2019
- 602/TB-TCHQ/2018 · nhóm 38.08 · https://www.tracuuhs.com/tin-tuc/tchq-602-2018
- 796/TB-TCHQ/2019 · nhóm 38.08 · https://www.tracuuhs.com/tin-tuc/tchq-796-2019
- 950/TB-TCHQ/2018 · nhóm 38.08 · https://www.tracuuhs.com/tin-tuc/tchq-950-2018
- 1145/TB-TCHQ/2018 · nhóm 38.08 · https://www.tracuuhs.com/tin-tuc/tchq-1145-2018
- 1781/TB-TCHQ/2020 · nhóm 38.08 · https://www.tracuuhs.com/tin-tuc/tchq-1781-2020
- 1794/TB-TCHQ/2018 · nhóm 38.08 · https://www.tracuuhs.com/tin-tuc/tchq-1794-2018
- 2762/TB-TCHQ/2018 · nhóm 38.08 · https://www.tracuuhs.com/tin-tuc/tchq-2762-2018
- 3143/TB-TCHQ/2019 · nhóm 38.08 · https://www.tracuuhs.com/tin-tuc/tchq-3143-2019
- 1125/TB-TCHQ/2018 · nhóm 38.09 · https://www.tracuuhs.com/tin-tuc/tchq-1125-2018
- 1559/TB-TCHQ/2018 · nhóm 38.10 · https://www.tracuuhs.com/tin-tuc/tchq-1559-2018
- 2707/TB-TCHQ/2023 · nhóm 38.10 · https://www.tracuuhs.com/tin-tuc/tchq-2707-2023
- 3148/TB-TCHQ/2019 · nhóm 38.11 · https://www.tracuuhs.com/tin-tuc/tchq-3148-2019
- 1768/TB-TCHQ/2020 · nhóm 38.12 · https://www.tracuuhs.com/tin-tuc/tchq-1768-2020
- 1925/TB-TCHQ/2020 · nhóm 38.12 · https://www.tracuuhs.com/tin-tuc/tchq-1925-2020
- 1926/TB-TCHQ/2020 · nhóm 38.12 · https://www.tracuuhs.com/tin-tuc/tchq-1926-2020
- 3292/TB-TCHQ/2019 · nhóm 38.12 · https://www.tracuuhs.com/tin-tuc/tchq-3292-2019
- 6240/TB-TCHQ/2020 · nhóm 38.12 · https://www.tracuuhs.com/tin-tuc/tchq-6240-2020
- 6495/TB-TCHQ/2018 · nhóm 38.12 · https://www.tracuuhs.com/tin-tuc/tchq-6495-2018

## goi-050 · Ch.38 · 20 TB

- 7046/TB-TCHQ/2018 · nhóm 38.12 · https://www.tracuuhs.com/tin-tuc/tchq-7046-2018
- 7542/TB-TCHQ/2018 · nhóm 38.12 · https://www.tracuuhs.com/tin-tuc/tchq-7542-2018
- 7543/TB-TCHQ/2018 · nhóm 38.12 · https://www.tracuuhs.com/tin-tuc/tchq-7543-2018
- 845/TB-TCHQ/2020 · nhóm 38.14 · https://www.tracuuhs.com/tin-tuc/tchq-845-2020
- 2723/TB-TCHQ/2022 · nhóm 38.14 · https://www.tracuuhs.com/tin-tuc/tchq-2723-2022
- 2724/TB-TCHQ/2022 · nhóm 38.14 · https://www.tracuuhs.com/tin-tuc/tchq-2724-2022
- 2725/TB-TCHQ/2022 · nhóm 38.14 · https://www.tracuuhs.com/tin-tuc/tchq-2725-2022
- 1170/TB-TCHQ/2020 · nhóm 38.15 · https://www.tracuuhs.com/tin-tuc/tchq-1170-2020
- 720/TB-TCHQ/2018 · nhóm 38.22 · https://www.tracuuhs.com/tin-tuc/tchq-720-2018
- 976/TB-TCHQ/2018 · nhóm 38.22 · https://www.tracuuhs.com/tin-tuc/tchq-976-2018
- 1024/TB-TCHQ/2020 · nhóm 38.22 · https://www.tracuuhs.com/tin-tuc/tchq-1024-2020
- 26/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-26-2020
- 115/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-115-2020
- 135/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-135-2020
- 136/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-136-2020
- 137/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-137-2020
- 138/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-138-2020
- 210/TB-TCHQ/2024 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-210-2024
- 211/TB-TCHQ/2024 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-211-2024
- 236/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-236-2019

## goi-051 · Ch.38 · 20 TB

- 239/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-239-2019
- 242/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-242-2019
- 243/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-243-2019
- 244/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-244-2019
- 245/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-245-2019
- 246/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-246-2019
- 453/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-453-2019
- 454/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-454-2019
- 457/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-457-2019
- 464/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-464-2019
- 465/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-465-2019
- 466/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-466-2019
- 467/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-467-2019
- 468/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-468-2019
- 633/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-633-2019
- 675/TB-TCHQ/2022 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-675-2022
- 708/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-708-2019
- 709/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-709-2019
- 710/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-710-2019
- 711/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-711-2019

## goi-052 · Ch.38 · 20 TB

- 712/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-712-2019
- 713/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-713-2019
- 753/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-753-2018
- 865/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-865-2019
- 983/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-983-2019
- 989/TB-TCHQ/2022 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-989-2022
- 990/TB-TCHQ/2022 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-990-2022
- 1016/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1016-2020
- 1019/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1019-2020
- 1024/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1024-2019
- 1026/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1026-2019
- 1031/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1031-2019
- 1039/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1039-2020
- 1092/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1092-2020
- 1094/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1094-2020
- 1103/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1103-2019
- 1104/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1104-2019
- 1137/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1137-2020
- 1138/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1138-2020
- 1146/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1146-2018

## goi-053 · Ch.38 · 20 TB

- 1165/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1165-2020
- 1166/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1166-2020
- 1167/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1167-2020
- 1168/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1168-2020
- 1182/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1182-2018
- 1190/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1190-2020
- 1193/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1193-2020
- 1207/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1207-2020
- 1213/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1213-2020
- 1218/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1218-2019
- 1221/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1221-2020
- 1222/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1222-2019
- 1223/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1223-2019
- 1229/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1229-2019
- 1285/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1285-2019
- 1286/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1286-2019
- 1287/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1287-2019
- 1288/TB-TCHQ/2026 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1288-2026
- 1310/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1310-2019
- 1571/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1571-2018

## goi-054 · Ch.38 · 20 TB

- 1621/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1621-2020
- 1702/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1702-2020
- 1716/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1716-2020
- 1734/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1734-2020
- 1735/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1735-2020
- 1736/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1736-2020
- 1737/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1737-2020
- 1759/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1759-2020
- 1760/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1760-2020
- 1761/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1761-2020
- 1766/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1766-2020
- 1767/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1767-2020
- 1780/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1780-2020
- 1782/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1782-2020
- 1783/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1783-2020
- 1784/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1784-2020
- 1785/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1785-2020
- 1786/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1786-2020
- 1834/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1834-2020
- 1837/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1837-2020

## goi-055 · Ch.38 · 20 TB

- 1840/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1840-2020
- 1842/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1842-2020
- 1843/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1843-2020
- 1844/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1844-2020
- 1845/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1845-2020
- 1846/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1846-2020
- 1847/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1847-2020
- 1848/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1848-2020
- 1849/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1849-2020
- 1851/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1851-2020
- 1902/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1902-2018
- 1903/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1903-2018
- 1903/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1903-2020
- 1904/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1904-2020
- 1905/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1905-2020
- 1906/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1906-2020
- 1907/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1907-2020
- 1908/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1908-2020
- 1909/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1909-2020
- 1914/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1914-2020

## goi-056 · Ch.38 · 20 TB

- 1915/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1915-2020
- 1916/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1916-2020
- 1917/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1917-2020
- 1928/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1928-2020
- 1929/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1929-2020
- 1951/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1951-2020
- 1952/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1952-2020
- 1953/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1953-2020
- 1954/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1954-2020
- 1955/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1955-2020
- 1956/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1956-2020
- 1960/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1960-2020
- 1981/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1981-2019
- 1981/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1981-2020
- 1982/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1982-2019
- 1982/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1982-2020
- 1983/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1983-2019
- 1984/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1984-2019
- 1986/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1986-2019
- 1987/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1987-2019

## goi-057 · Ch.38 · 20 TB

- 1988/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1988-2019
- 1989/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1989-2019
- 1993/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-1993-2019
- 2031/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2031-2020
- 2038/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2038-2020
- 2039/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2039-2020
- 2041/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2041-2020
- 2045/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2045-2020
- 2047/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2047-2020
- 2048/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2048-2020
- 2049/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2049-2020
- 2119/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2119-2020
- 2125/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2125-2020
- 2165/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2165-2020
- 2170/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2170-2020
- 2173/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2173-2020
- 2182/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2182-2020
- 2183/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2183-2020
- 2309/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2309-2018
- 2329/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2329-2018

## goi-058 · Ch.38 · 20 TB

- 2339/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2339-2018
- 2345/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2345-2018
- 2413/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2413-2018
- 2614/TB-TCHQ/2023 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2614-2023
- 2793/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2793-2018
- 2830/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2830-2018
- 2831/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2831-2018
- 2844/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2844-2018
- 2847/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2847-2018
- 2873/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2873-2018
- 2874/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-2874-2018
- 3139/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-3139-2019
- 3145/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-3145-2019
- 3157/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-3157-2019
- 3277/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-3277-2019
- 3293/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-3293-2019
- 3310/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-3310-2018
- 3507/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-3507-2019
- 3510/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-3510-2019
- 3604/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-3604-2018

## goi-059 · Ch.38 · 20 TB

- 3612/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-3612-2019
- 3613/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-3613-2019
- 3703/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-3703-2019
- 3752/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-3752-2019
- 3753/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-3753-2019
- 3754/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-3754-2019
- 3789/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-3789-2019
- 3802/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-3802-2019
- 3803/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-3803-2019
- 3830/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-3830-2019
- 3858/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-3858-2019
- 3977/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-3977-2019
- 3998/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-3998-2018
- 4000/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-4000-2018
- 4015/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-4015-2018
- 4016/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-4016-2018
- 4082/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-4082-2019
- 4152/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-4152-2018
- 4155/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-4155-2018
- 4157/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-4157-2018

## goi-060 · Ch.38 · 20 TB

- 4158/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-4158-2018
- 4159/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-4159-2019
- 4170/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-4170-2019
- 4171/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-4171-2019
- 4192/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-4192-2018
- 4193/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-4193-2018
- 4195/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-4195-2018
- 4196/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-4196-2018
- 4216/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-4216-2019
- 4321/TB-TCHQ/2019 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-4321-2019
- 4813/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-4813-2018
- 4918/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-4918-2018
- 4962/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-4962-2018
- 4963/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-4963-2018
- 4964/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-4964-2018
- 4965/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-4965-2018
- 5323/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-5323-2018
- 5351/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-5351-2018
- 5352/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-5352-2018
- 5540/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-5540-2018

## goi-061 · Ch.38 · 20 TB

- 5541/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-5541-2018
- 5542/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-5542-2018
- 5543/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-5543-2018
- 5653/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-5653-2018
- 5654/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-5654-2018
- 5810/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-5810-2018
- 5827/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-5827-2018
- 5828/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-5828-2018
- 5853/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-5853-2018
- 5982/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-5982-2018
- 6308/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-6308-2020
- 6431/TB-TCHQ/2020 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-6431-2020
- 6487/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-6487-2018
- 6500/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-6500-2018
- 6893/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-6893-2018
- 6894/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-6894-2018
- 6933/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-6933-2018
- 6934/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-6934-2018
- 6988/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-6988-2018
- 7008/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-7008-2018

## goi-062 · Ch.38 · 20 TB

- 7047/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-7047-2018
- 7103/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-7103-2018
- 7282/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-7282-2018
- 7283/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-7283-2018
- 7289/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-7289-2018
- 7290/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-7290-2018
- 7291/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-7291-2018
- 7292/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-7292-2018
- 7298/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-7298-2018
- 7299/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-7299-2018
- 7349/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-7349-2018
- 7422/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-7422-2018
- 7423/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-7423-2018
- 7424/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-7424-2018
- 7567/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-7567-2018
- 7568/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-7568-2018
- 7569/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-7569-2018
- 7571/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-7571-2018
- 7645/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-7645-2018
- 7646/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-7646-2018

## goi-063 · Ch.38·39 · 20 TB

- 7647/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-7647-2018
- 7649/TB-TCHQ/2018 · nhóm 38.24 · https://www.tracuuhs.com/tin-tuc/tchq-7649-2018
- 180/TB-TCHQ/2021 · nhóm 39.01 · https://www.tracuuhs.com/tin-tuc/tchq-180-2021
- 3059/TB-TCHQ/2018 · nhóm 39.01 · https://www.tracuuhs.com/tin-tuc/tchq-3059-2018
- 4186/TB-TCHQ/2019 · nhóm 39.01 · https://www.tracuuhs.com/tin-tuc/tchq-4186-2019
- 879/TB-TCHQ/2023 · nhóm 39.02 · https://www.tracuuhs.com/tin-tuc/tchq-879-2023
- 1124/TB-TCHQ/2019 · nhóm 39.02 · https://www.tracuuhs.com/tin-tuc/tchq-1124-2019
- 2326/TB-TCHQ/2018 · nhóm 39.02 · https://www.tracuuhs.com/tin-tuc/tchq-2326-2018
- 4185/TB-TCHQ/2019 · nhóm 39.02 · https://www.tracuuhs.com/tin-tuc/tchq-4185-2019
- 7104/TB-TCHQ/2018 · nhóm 39.02 · https://www.tracuuhs.com/tin-tuc/tchq-7104-2018
- 7628/TB-TCHQ/2018 · nhóm 39.02 · https://www.tracuuhs.com/tin-tuc/tchq-7628-2018
- 481/TB-TCHQ/2019 · nhóm 39.03 · https://www.tracuuhs.com/tin-tuc/tchq-481-2019
- 1099/TB-TCHQ/2019 · nhóm 39.03 · https://www.tracuuhs.com/tin-tuc/tchq-1099-2019
- 4183/TB-TCHQ/2019 · nhóm 39.03 · https://www.tracuuhs.com/tin-tuc/tchq-4183-2019
- 6375/TB-TCHQ/2018 · nhóm 39.03 · https://www.tracuuhs.com/tin-tuc/tchq-6375-2018
- 6497/TB-TCHQ/2018 · nhóm 39.03 · https://www.tracuuhs.com/tin-tuc/tchq-6497-2018
- 803/TB-TCHQ/2018 · nhóm 39.04 · https://www.tracuuhs.com/tin-tuc/tchq-803-2018
- 1049/TB-TCHQ/2019 · nhóm 39.04 · https://www.tracuuhs.com/tin-tuc/tchq-1049-2019
- 3002/TB-TCHQ/2019 · nhóm 39.04 · https://www.tracuuhs.com/tin-tuc/tchq-3002-2019
- 3540/TB-TCHQ/2019 · nhóm 39.04 · https://www.tracuuhs.com/tin-tuc/tchq-3540-2019

## goi-064 · Ch.39 · 20 TB

- 1014/TB-TCHQ/2020 · nhóm 39.06 · https://www.tracuuhs.com/tin-tuc/tchq-1014-2020
- 509/TB-TCHQ/2018 · nhóm 39.07 · https://www.tracuuhs.com/tin-tuc/tchq-509-2018
- 510/TB-TCHQ/2018 · nhóm 39.07 · https://www.tracuuhs.com/tin-tuc/tchq-510-2018
- 512/TB-TCHQ/2018 · nhóm 39.07 · https://www.tracuuhs.com/tin-tuc/tchq-512-2018
- 1151/TB-TCHQ/2019 · nhóm 39.07 · https://www.tracuuhs.com/tin-tuc/tchq-1151-2019
- 1322/TB-TCHQ/2023 · nhóm 39.07 · https://www.tracuuhs.com/tin-tuc/tchq-1322-2023
- 2120/TB-TCHQ/2020 · nhóm 39.07 · https://www.tracuuhs.com/tin-tuc/tchq-2120-2020
- 2342/TB-TCHQ/2018 · nhóm 39.07 · https://www.tracuuhs.com/tin-tuc/tchq-2342-2018
- 4175/TB-TCHQ/2019 · nhóm 39.07 · https://www.tracuuhs.com/tin-tuc/tchq-4175-2019
- 4322/TB-TCHQ/2019 · nhóm 39.07 · https://www.tracuuhs.com/tin-tuc/tchq-4322-2019
- 6352/TB-TCHQ/2018 · nhóm 39.07 · https://www.tracuuhs.com/tin-tuc/tchq-6352-2018
- 1054/TB-TCHQ/2019 · nhóm 39.09 · https://www.tracuuhs.com/tin-tuc/tchq-1054-2019
- 2043/TB-TCHQ/2020 · nhóm 39.09 · https://www.tracuuhs.com/tin-tuc/tchq-2043-2020
- 4184/TB-TCHQ/2019 · nhóm 39.09 · https://www.tracuuhs.com/tin-tuc/tchq-4184-2019
- 6437/TB-TCHQ/2018 · nhóm 39.09 · https://www.tracuuhs.com/tin-tuc/tchq-6437-2018
- 1208/TB-TCHQ/2020 · nhóm 39.10 · https://www.tracuuhs.com/tin-tuc/tchq-1208-2020
- 1219/TB-TCHQ/2020 · nhóm 39.10 · https://www.tracuuhs.com/tin-tuc/tchq-1219-2020
- 1186/TB-TCHQ/2020 · nhóm 39.11 · https://www.tracuuhs.com/tin-tuc/tchq-1186-2020
- 2145/TB-TCHQ/2023 · nhóm 39.11 · https://www.tracuuhs.com/tin-tuc/tchq-2145-2023
- 2791/TB-TCHQ/2023 · nhóm 39.11 · https://www.tracuuhs.com/tin-tuc/tchq-2791-2023

## goi-065 · Ch.39 · 20 TB

- 4029/TB-TCHQ/2018 · nhóm 39.11 · https://www.tracuuhs.com/tin-tuc/tchq-4029-2018
- 4966/TB-TCHQ/2018 · nhóm 39.11 · https://www.tracuuhs.com/tin-tuc/tchq-4966-2018
- 6784/TB-TCHQ/2018 · nhóm 39.11 · https://www.tracuuhs.com/tin-tuc/tchq-6784-2018
- 1148/TB-TCHQ/2018 · nhóm 39.12 · https://www.tracuuhs.com/tin-tuc/tchq-1148-2018
- 828/TB-TCHQ/2018 · nhóm 39.13 · https://www.tracuuhs.com/tin-tuc/tchq-828-2018
- 1169/TB-TCHQ/2020 · nhóm 39.18 · https://www.tracuuhs.com/tin-tuc/tchq-1169-2020
- 1901/TB-TCHQ/2020 · nhóm 39.18 · https://www.tracuuhs.com/tin-tuc/tchq-1901-2020
- 2115/TB-TCHQ/2020 · nhóm 39.18 · https://www.tracuuhs.com/tin-tuc/tchq-2115-2020
- 2121/TB-TCHQ/2020 · nhóm 39.18 · https://www.tracuuhs.com/tin-tuc/tchq-2121-2020
- 133/TB-TCHQ/2021 · nhóm 39.19 · https://www.tracuuhs.com/tin-tuc/tchq-133-2021
- 1410/TB-TCHQ/2018 · nhóm 39.19 · https://www.tracuuhs.com/tin-tuc/tchq-1410-2018
- 2169/TB-TCHQ/2020 · nhóm 39.19 · https://www.tracuuhs.com/tin-tuc/tchq-2169-2020
- 2336/TB-TCHQ/2018 · nhóm 39.19 · https://www.tracuuhs.com/tin-tuc/tchq-2336-2018
- 4923/TB-TCHQ/2021 · nhóm 39.19 · https://www.tracuuhs.com/tin-tuc/tchq-4923-2021
- 6484/TB-TCHQ/2018 · nhóm 39.19 · https://www.tracuuhs.com/tin-tuc/tchq-6484-2018
- 134/TB-TCHQ/2021 · nhóm 39.20 · https://www.tracuuhs.com/tin-tuc/tchq-134-2021
- 157/TB-TCHQ/2021 · nhóm 39.20 · https://www.tracuuhs.com/tin-tuc/tchq-157-2021
- 159/TB-TCHQ/2021 · nhóm 39.20 · https://www.tracuuhs.com/tin-tuc/tchq-159-2021
- 176/TB-TCHQ/2021 · nhóm 39.20 · https://www.tracuuhs.com/tin-tuc/tchq-176-2021
- 1118/TB-TCHQ/2018 · nhóm 39.20 · https://www.tracuuhs.com/tin-tuc/tchq-1118-2018

## goi-066 · Ch.39 · 20 TB

- 1219/TB-TCHQ/2019 · nhóm 39.20 · https://www.tracuuhs.com/tin-tuc/tchq-1219-2019
- 2150/TB-TCHQ/2020 · nhóm 39.20 · https://www.tracuuhs.com/tin-tuc/tchq-2150-2020
- 3658/TB-TCHQ/2019 · nhóm 39.20 · https://www.tracuuhs.com/tin-tuc/tchq-3658-2019
- 4002/TB-TCHQ/2018 · nhóm 39.20 · https://www.tracuuhs.com/tin-tuc/tchq-4002-2018
- 5103/TB-TCHQ/2018 · nhóm 39.20 · https://www.tracuuhs.com/tin-tuc/tchq-5103-2018
- 136/TB-TCHQ/2021 · nhóm 39.21 · https://www.tracuuhs.com/tin-tuc/tchq-136-2021
- 1147/TB-TCHQ/2018 · nhóm 39.21 · https://www.tracuuhs.com/tin-tuc/tchq-1147-2018
- 1188/TB-TCHQ/2020 · nhóm 39.21 · https://www.tracuuhs.com/tin-tuc/tchq-1188-2020
- 2318/TB-TCHQ/2018 · nhóm 39.21 · https://www.tracuuhs.com/tin-tuc/tchq-2318-2018
- 2319/TB-TCHQ/2018 · nhóm 39.21 · https://www.tracuuhs.com/tin-tuc/tchq-2319-2018
- 2470/TB-TCHQ/2018 · nhóm 39.21 · https://www.tracuuhs.com/tin-tuc/tchq-2470-2018
- 3060/TB-TCHQ/2018 · nhóm 39.21 · https://www.tracuuhs.com/tin-tuc/tchq-3060-2018
- 4003/TB-TCHQ/2018 · nhóm 39.21 · https://www.tracuuhs.com/tin-tuc/tchq-4003-2018
- 19/TB-TCHQ/2025 · nhóm 39.26 · https://www.tracuuhs.com/tin-tuc/tchq-19-2025
- 20/TB-TCHQ/2025 · nhóm 39.26 · https://www.tracuuhs.com/tin-tuc/tchq-20-2025
- 99/TB-TCHQ/2023 · nhóm 39.26 · https://www.tracuuhs.com/tin-tuc/tchq-99-2023
- 101/TB-TCHQ/2023 · nhóm 39.26 · https://www.tracuuhs.com/tin-tuc/tchq-101-2023
- 280/TB-TCHQ/2025 · nhóm 39.26 · https://www.tracuuhs.com/tin-tuc/tchq-280-2025
- 282/TB-TCHQ/2025 · nhóm 39.26 · https://www.tracuuhs.com/tin-tuc/tchq-282-2025
- 283/TB-TCHQ/2025 · nhóm 39.26 · https://www.tracuuhs.com/tin-tuc/tchq-283-2025

## goi-067 · Ch.39·40·41·42 · 20 TB

- 284/TB-TCHQ/2025 · nhóm 39.26 · https://www.tracuuhs.com/tin-tuc/tchq-284-2025
- 285/TB-TCHQ/2025 · nhóm 39.26 · https://www.tracuuhs.com/tin-tuc/tchq-285-2025
- 286/TB-TCHQ/2025 · nhóm 39.26 · https://www.tracuuhs.com/tin-tuc/tchq-286-2025
- 287/TB-TCHQ/2025 · nhóm 39.26 · https://www.tracuuhs.com/tin-tuc/tchq-287-2025
- 289/TB-TCHQ/2025 · nhóm 39.26 · https://www.tracuuhs.com/tin-tuc/tchq-289-2025
- 301/TB-TCHQ/2025 · nhóm 39.26 · https://www.tracuuhs.com/tin-tuc/tchq-301-2025
- 302/TB-TCHQ/2025 · nhóm 39.26 · https://www.tracuuhs.com/tin-tuc/tchq-302-2025
- 776/TB-TCHQ/2018 · nhóm 39.26 · https://www.tracuuhs.com/tin-tuc/tchq-776-2018
- 777/TB-TCHQ/2018 · nhóm 39.26 · https://www.tracuuhs.com/tin-tuc/tchq-777-2018
- 1049/TB-TCHQ/2024 · nhóm 39.26 · https://www.tracuuhs.com/tin-tuc/tchq-1049-2024
- 1409/TB-TCHQ/2018 · nhóm 39.26 · https://www.tracuuhs.com/tin-tuc/tchq-1409-2018
- 2149/TB-TCHQ/2020 · nhóm 39.26 · https://www.tracuuhs.com/tin-tuc/tchq-2149-2020
- 3421/TB-TCHQ/2018 · nhóm 39.26 · https://www.tracuuhs.com/tin-tuc/tchq-3421-2018
- 5110/TB-TCHQ/2018 · nhóm 39.26 · https://www.tracuuhs.com/tin-tuc/tchq-5110-2018
- 7302/TB-TCHQ/2018 · nhóm 40.03 · https://www.tracuuhs.com/tin-tuc/tchq-7302-2018
- 3399/TB-TCHQ/2024 · nhóm 40.16 · https://www.tracuuhs.com/tin-tuc/tchq-3399-2024
- 6363/TB-TCHQ/2018 · nhóm 41.07 · https://www.tracuuhs.com/tin-tuc/tchq-6363-2018
- 6359/TB-TCHQ/2018 · nhóm 41.15 · https://www.tracuuhs.com/tin-tuc/tchq-6359-2018
- 195/TB-TCHQ/2018 · nhóm 42.02 · https://www.tracuuhs.com/tin-tuc/tchq-195-2018
- 1113/TB-TCHQ/2024 · nhóm 42.02 · https://www.tracuuhs.com/tin-tuc/tchq-1113-2024

## goi-068 · Ch.42·44·46·47·48 · 20 TB

- 3409/TB-TCHQ/2024 · nhóm 42.02 · https://www.tracuuhs.com/tin-tuc/tchq-3409-2024
- 7421/TB-TCHQ/2018 · nhóm 44.01 · https://www.tracuuhs.com/tin-tuc/tchq-7421-2018
- 7435/TB-TCHQ/2018 · nhóm 44.01 · https://www.tracuuhs.com/tin-tuc/tchq-7435-2018
- 4138/TB-TCHQ/2026 · nhóm 44.02 · https://www.tracuuhs.com/tin-tuc/tchq-4138-2026
- 7544/TB-TCHQ/2018 · nhóm 44.09 · https://www.tracuuhs.com/tin-tuc/tchq-7544-2018
- 5353/TB-TCHQ/2018 · nhóm 44.11 · https://www.tracuuhs.com/tin-tuc/tchq-5353-2018
- 5354/TB-TCHQ/2018 · nhóm 44.11 · https://www.tracuuhs.com/tin-tuc/tchq-5354-2018
- 4719/TB-TCHQ/2018 · nhóm 44.12 · https://www.tracuuhs.com/tin-tuc/tchq-4719-2018
- 7164/TB-TCHQ/2018 · nhóm 44.18 · https://www.tracuuhs.com/tin-tuc/tchq-7164-2018
- 1805/TB-TCHQ/2018 · nhóm 46.01 · https://www.tracuuhs.com/tin-tuc/tchq-1805-2018
- 1806/TB-TCHQ/2018 · nhóm 46.01 · https://www.tracuuhs.com/tin-tuc/tchq-1806-2018
- 2028/TB-TCHQ/2019 · nhóm 47.06 · https://www.tracuuhs.com/tin-tuc/tchq-2028-2019
- 923/TB-TCHQ/2019 · nhóm 47.07 · https://www.tracuuhs.com/tin-tuc/tchq-923-2019
- 92/TB-TCHQ/2018 · nhóm 48.02 · https://www.tracuuhs.com/tin-tuc/tchq-92-2018
- 864/TB-TCHQ/2019 · nhóm 48.02 · https://www.tracuuhs.com/tin-tuc/tchq-864-2019
- 1032/TB-TCHQ/2019 · nhóm 48.02 · https://www.tracuuhs.com/tin-tuc/tchq-1032-2019
- 3204/TB-TCHQ/2018 · nhóm 48.02 · https://www.tracuuhs.com/tin-tuc/tchq-3204-2018
- 3829/TB-TCHQ/2019 · nhóm 48.02 · https://www.tracuuhs.com/tin-tuc/tchq-3829-2019
- 6023/TB-TCHQ/2018 · nhóm 48.02 · https://www.tracuuhs.com/tin-tuc/tchq-6023-2018
- 1030/TB-TCHQ/2019 · nhóm 48.03 · https://www.tracuuhs.com/tin-tuc/tchq-1030-2019

## goi-069 · Ch.48·49·51 · 20 TB

- 5969/TB-TCHQ/2018 · nhóm 48.04 · https://www.tracuuhs.com/tin-tuc/tchq-5969-2018
- 1027/TB-TCHQ/2019 · nhóm 48.05 · https://www.tracuuhs.com/tin-tuc/tchq-1027-2019
- 576/TB-TCHQ/2018 · nhóm 48.10 · https://www.tracuuhs.com/tin-tuc/tchq-576-2018
- 1128/TB-TCHQ/2018 · nhóm 48.10 · https://www.tracuuhs.com/tin-tuc/tchq-1128-2018
- 862/TB-TCHQ/2019 · nhóm 48.11 · https://www.tracuuhs.com/tin-tuc/tchq-862-2019
- 1018/TB-TCHQ/2020 · nhóm 48.11 · https://www.tracuuhs.com/tin-tuc/tchq-1018-2020
- 1839/TB-TCHQ/2020 · nhóm 48.11 · https://www.tracuuhs.com/tin-tuc/tchq-1839-2020
- 2433/TB-TCHQ/2018 · nhóm 48.11 · https://www.tracuuhs.com/tin-tuc/tchq-2433-2018
- 3235/TB-TCHQ/2018 · nhóm 48.11 · https://www.tracuuhs.com/tin-tuc/tchq-3235-2018
- 3630/TB-TCHQ/2019 · nhóm 48.11 · https://www.tracuuhs.com/tin-tuc/tchq-3630-2019
- 3865/TB-TCHQ/2019 · nhóm 48.11 · https://www.tracuuhs.com/tin-tuc/tchq-3865-2019
- 715/TB-TCHQ/2018 · nhóm 48.18 · https://www.tracuuhs.com/tin-tuc/tchq-715-2018
- 547/TB-TCHQ/2023 · nhóm 48.19 · https://www.tracuuhs.com/tin-tuc/tchq-547-2023
- 6159/TB-TCHQ/2024 · nhóm 48.21 · https://www.tracuuhs.com/tin-tuc/tchq-6159-2024
- 196/TB-TCHQ/2018 · nhóm 48.23 · https://www.tracuuhs.com/tin-tuc/tchq-196-2018
- 1772/TB-TCHQ/2018 · nhóm 48.23 · https://www.tracuuhs.com/tin-tuc/tchq-1772-2018
- 3629/TB-TCHQ/2019 · nhóm 48.23 · https://www.tracuuhs.com/tin-tuc/tchq-3629-2019
- 4033/TB-TCHQ/2019 · nhóm 49.08 · https://www.tracuuhs.com/tin-tuc/tchq-4033-2019
- 821/TB-TCHQ/2020 · nhóm 49.11 · https://www.tracuuhs.com/tin-tuc/tchq-821-2020
- 714/TB-TCHQ/2018 · nhóm 51.07 · https://www.tracuuhs.com/tin-tuc/tchq-714-2018

## goi-070 · Ch.51·52 · 20 TB

- 629/TB-TCHQ/2019 · nhóm 51.11 · https://www.tracuuhs.com/tin-tuc/tchq-629-2019
- 3064/TB-TCHQ/2019 · nhóm 51.11 · https://www.tracuuhs.com/tin-tuc/tchq-3064-2019
- 3065/TB-TCHQ/2019 · nhóm 51.11 · https://www.tracuuhs.com/tin-tuc/tchq-3065-2019
- 3066/TB-TCHQ/2019 · nhóm 51.11 · https://www.tracuuhs.com/tin-tuc/tchq-3066-2019
- 3070/TB-TCHQ/2019 · nhóm 51.11 · https://www.tracuuhs.com/tin-tuc/tchq-3070-2019
- 3262/TB-TCHQ/2018 · nhóm 51.11 · https://www.tracuuhs.com/tin-tuc/tchq-3262-2018
- 3263/TB-TCHQ/2018 · nhóm 51.11 · https://www.tracuuhs.com/tin-tuc/tchq-3263-2018
- 3264/TB-TCHQ/2018 · nhóm 51.11 · https://www.tracuuhs.com/tin-tuc/tchq-3264-2018
- 3265/TB-TCHQ/2018 · nhóm 51.11 · https://www.tracuuhs.com/tin-tuc/tchq-3265-2018
- 3266/TB-TCHQ/2018 · nhóm 51.11 · https://www.tracuuhs.com/tin-tuc/tchq-3266-2018
- 3267/TB-TCHQ/2018 · nhóm 51.11 · https://www.tracuuhs.com/tin-tuc/tchq-3267-2018
- 5856/TB-TCHQ/2018 · nhóm 51.12 · https://www.tracuuhs.com/tin-tuc/tchq-5856-2018
- 230/TB-TCHQ/2021 · nhóm 52.06 · https://www.tracuuhs.com/tin-tuc/tchq-230-2021
- 458/TB-TCHQ/2019 · nhóm 52.06 · https://www.tracuuhs.com/tin-tuc/tchq-458-2019
- 200/TB-TCHQ/2018 · nhóm 52.08 · https://www.tracuuhs.com/tin-tuc/tchq-200-2018
- 7049/TB-TCHQ/2018 · nhóm 52.08 · https://www.tracuuhs.com/tin-tuc/tchq-7049-2018
- 3074/TB-TCHQ/2019 · nhóm 52.09 · https://www.tracuuhs.com/tin-tuc/tchq-3074-2019
- 3075/TB-TCHQ/2019 · nhóm 52.09 · https://www.tracuuhs.com/tin-tuc/tchq-3075-2019
- 3076/TB-TCHQ/2019 · nhóm 52.09 · https://www.tracuuhs.com/tin-tuc/tchq-3076-2019
- 515/TB-TCHQ/2018 · nhóm 52.10 · https://www.tracuuhs.com/tin-tuc/tchq-515-2018

## goi-071 · Ch.52·53·54 · 20 TB

- 516/TB-TCHQ/2018 · nhóm 52.10 · https://www.tracuuhs.com/tin-tuc/tchq-516-2018
- 813/TB-TCHQ/2019 · nhóm 52.10 · https://www.tracuuhs.com/tin-tuc/tchq-813-2019
- 3073/TB-TCHQ/2019 · nhóm 52.10 · https://www.tracuuhs.com/tin-tuc/tchq-3073-2019
- 3847/TB-TCHQ/2019 · nhóm 52.10 · https://www.tracuuhs.com/tin-tuc/tchq-3847-2019
- 3063/TB-TCHQ/2019 · nhóm 52.11 · https://www.tracuuhs.com/tin-tuc/tchq-3063-2019
- 3846/TB-TCHQ/2019 · nhóm 53.07 · https://www.tracuuhs.com/tin-tuc/tchq-3846-2019
- 3989/TB-TCHQ/2019 · nhóm 53.09 · https://www.tracuuhs.com/tin-tuc/tchq-3989-2019
- 2713/TB-TCHQ/2018 · nhóm 54.02 · https://www.tracuuhs.com/tin-tuc/tchq-2713-2018
- 3177/TB-TCHQ/2018 · nhóm 54.02 · https://www.tracuuhs.com/tin-tuc/tchq-3177-2018
- 3178/TB-TCHQ/2018 · nhóm 54.02 · https://www.tracuuhs.com/tin-tuc/tchq-3178-2018
- 4059/TB-TCHQ/2022 · nhóm 54.02 · https://www.tracuuhs.com/tin-tuc/tchq-4059-2022
- 513/TB-TCHQ/2018 · nhóm 54.04 · https://www.tracuuhs.com/tin-tuc/tchq-513-2018
- 613/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-613-2018
- 1461/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-1461-2018
- 1900/TB-TCHQ/2020 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-1900-2020
- 1952/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-1952-2018
- 2618/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-2618-2018
- 2636/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-2636-2018
- 2714/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-2714-2018
- 2795/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-2795-2018

## goi-072 · Ch.54 · 20 TB

- 2914/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-2914-2018
- 2915/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-2915-2018
- 2966/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-2966-2018
- 2967/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-2967-2018
- 2971/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-2971-2018
- 2972/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-2972-2018
- 2973/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-2973-2018
- 2974/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-2974-2018
- 2975/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-2975-2018
- 2976/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-2976-2018
- 3019/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-3019-2018
- 3020/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-3020-2018
- 3021/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-3021-2018
- 3022/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-3022-2018
- 3023/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-3023-2018
- 3024/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-3024-2018
- 3025/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-3025-2018
- 3077/TB-TCHQ/2019 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-3077-2019
- 3179/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-3179-2018
- 3180/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-3180-2018

## goi-073 · Ch.54·55 · 20 TB

- 3181/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-3181-2018
- 3182/TB-TCHQ/2018 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-3182-2018
- 3241/TB-TCHQ/2019 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-3241-2019
- 3344/TB-TCHQ/2019 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-3344-2019
- 3544/TB-TCHQ/2019 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-3544-2019
- 4166/TB-TCHQ/2019 · nhóm 54.07 · https://www.tracuuhs.com/tin-tuc/tchq-4166-2019
- 1015/TB-TCHQ/2019 · nhóm 54.08 · https://www.tracuuhs.com/tin-tuc/tchq-1015-2019
- 1799/TB-TCHQ/2018 · nhóm 54.08 · https://www.tracuuhs.com/tin-tuc/tchq-1799-2018
- 3242/TB-TCHQ/2019 · nhóm 54.08 · https://www.tracuuhs.com/tin-tuc/tchq-3242-2019
- 2698/TB-TCHQ/2022 · nhóm 55.03 · https://www.tracuuhs.com/tin-tuc/tchq-2698-2022
- 2699/TB-TCHQ/2022 · nhóm 55.03 · https://www.tracuuhs.com/tin-tuc/tchq-2699-2022
- 2808/TB-TCHQ/2018 · nhóm 55.08 · https://www.tracuuhs.com/tin-tuc/tchq-2808-2018
- 1856/TB-TCHQ/2018 · nhóm 55.09 · https://www.tracuuhs.com/tin-tuc/tchq-1856-2018
- 2500/TB-TCHQ/2018 · nhóm 55.09 · https://www.tracuuhs.com/tin-tuc/tchq-2500-2018
- 1014/TB-TCHQ/2019 · nhóm 55.10 · https://www.tracuuhs.com/tin-tuc/tchq-1014-2019
- 2501/TB-TCHQ/2018 · nhóm 55.11 · https://www.tracuuhs.com/tin-tuc/tchq-2501-2018
- 752/TB-TCHQ/2018 · nhóm 55.12 · https://www.tracuuhs.com/tin-tuc/tchq-752-2018
- 3078/TB-TCHQ/2019 · nhóm 55.13 · https://www.tracuuhs.com/tin-tuc/tchq-3078-2019
- 1283/TB-TCHQ/2018 · nhóm 55.14 · https://www.tracuuhs.com/tin-tuc/tchq-1283-2018
- 2471/TB-TCHQ/2018 · nhóm 55.14 · https://www.tracuuhs.com/tin-tuc/tchq-2471-2018

## goi-074 · Ch.55·56 · 20 TB

- 135/TB-TCHQ/2021 · nhóm 55.15 · https://www.tracuuhs.com/tin-tuc/tchq-135-2021
- 2166/TB-TCHQ/2020 · nhóm 55.15 · https://www.tracuuhs.com/tin-tuc/tchq-2166-2020
- 4115/TB-TCHQ/2018 · nhóm 55.15 · https://www.tracuuhs.com/tin-tuc/tchq-4115-2018
- 518/TB-TCHQ/2018 · nhóm 55.16 · https://www.tracuuhs.com/tin-tuc/tchq-518-2018
- 519/TB-TCHQ/2018 · nhóm 55.16 · https://www.tracuuhs.com/tin-tuc/tchq-519-2018
- 521/TB-TCHQ/2018 · nhóm 55.16 · https://www.tracuuhs.com/tin-tuc/tchq-521-2018
- 897/TB-TCHQ/2019 · nhóm 55.16 · https://www.tracuuhs.com/tin-tuc/tchq-897-2019
- 906/TB-TCHQ/2019 · nhóm 55.16 · https://www.tracuuhs.com/tin-tuc/tchq-906-2019
- 3404/TB-TCHQ/2018 · nhóm 55.16 · https://www.tracuuhs.com/tin-tuc/tchq-3404-2018
- 251/TB-TCHQ/2019 · nhóm 56.01 · https://www.tracuuhs.com/tin-tuc/tchq-251-2019
- 552/TB-TCHQ/2019 · nhóm 56.01 · https://www.tracuuhs.com/tin-tuc/tchq-552-2019
- 2957/TB-TCHQ/2018 · nhóm 56.01 · https://www.tracuuhs.com/tin-tuc/tchq-2957-2018
- 2958/TB-TCHQ/2018 · nhóm 56.01 · https://www.tracuuhs.com/tin-tuc/tchq-2958-2018
- 3990/TB-TCHQ/2019 · nhóm 56.01 · https://www.tracuuhs.com/tin-tuc/tchq-3990-2019
- 6305/TB-TCHQ/2023 · nhóm 56.01 · https://www.tracuuhs.com/tin-tuc/tchq-6305-2023
- 2153/TB-TCHQ/2020 · nhóm 56.02 · https://www.tracuuhs.com/tin-tuc/tchq-2153-2020
- 3992/TB-TCHQ/2019 · nhóm 56.02 · https://www.tracuuhs.com/tin-tuc/tchq-3992-2019
- 219/TB-TCHQ/2019 · nhóm 56.03 · https://www.tracuuhs.com/tin-tuc/tchq-219-2019
- 249/TB-TCHQ/2019 · nhóm 56.03 · https://www.tracuuhs.com/tin-tuc/tchq-249-2019
- 327/TB-TCHQ/2018 · nhóm 56.03 · https://www.tracuuhs.com/tin-tuc/tchq-327-2018

## goi-075 · Ch.56·57·58 · 20 TB

- 328/TB-TCHQ/2018 · nhóm 56.03 · https://www.tracuuhs.com/tin-tuc/tchq-328-2018
- 329/TB-TCHQ/2018 · nhóm 56.03 · https://www.tracuuhs.com/tin-tuc/tchq-329-2018
- 1713/TB-TCHQ/2020 · nhóm 56.03 · https://www.tracuuhs.com/tin-tuc/tchq-1713-2020
- 1768/TB-TCHQ/2018 · nhóm 56.03 · https://www.tracuuhs.com/tin-tuc/tchq-1768-2018
- 1803/TB-TCHQ/2023 · nhóm 56.03 · https://www.tracuuhs.com/tin-tuc/tchq-1803-2023
- 1804/TB-TCHQ/2023 · nhóm 56.03 · https://www.tracuuhs.com/tin-tuc/tchq-1804-2023
- 6025/TB-TCHQ/2018 · nhóm 56.03 · https://www.tracuuhs.com/tin-tuc/tchq-6025-2018
- 6742/TB-TCHQ/2018 · nhóm 56.03 · https://www.tracuuhs.com/tin-tuc/tchq-6742-2018
- 7650/TB-TCHQ/2018 · nhóm 56.03 · https://www.tracuuhs.com/tin-tuc/tchq-7650-2018
- 455/TB-TCHQ/2019 · nhóm 56.04 · https://www.tracuuhs.com/tin-tuc/tchq-455-2019
- 330/TB-TCHQ/2018 · nhóm 56.05 · https://www.tracuuhs.com/tin-tuc/tchq-330-2018
- 1010/TB-TCHQ/2020 · nhóm 56.07 · https://www.tracuuhs.com/tin-tuc/tchq-1010-2020
- 201/TB-TCHQ/2018 · nhóm 56.09 · https://www.tracuuhs.com/tin-tuc/tchq-201-2018
- 1171/TB-TCHQ/2020 · nhóm 57.05 · https://www.tracuuhs.com/tin-tuc/tchq-1171-2020
- 1172/TB-TCHQ/2020 · nhóm 57.05 · https://www.tracuuhs.com/tin-tuc/tchq-1172-2020
- 1173/TB-TCHQ/2020 · nhóm 57.05 · https://www.tracuuhs.com/tin-tuc/tchq-1173-2020
- 2116/TB-TCHQ/2020 · nhóm 57.05 · https://www.tracuuhs.com/tin-tuc/tchq-2116-2020
- 209/TB-TCHQ/2021 · nhóm 58.01 · https://www.tracuuhs.com/tin-tuc/tchq-209-2021
- 1258/TB-TCHQ/2018 · nhóm 58.01 · https://www.tracuuhs.com/tin-tuc/tchq-1258-2018
- 129/TB-TCHQ/2021 · nhóm 58.06 · https://www.tracuuhs.com/tin-tuc/tchq-129-2021

## goi-076 · Ch.58·59 · 20 TB

- 332/TB-TCHQ/2018 · nhóm 58.06 · https://www.tracuuhs.com/tin-tuc/tchq-332-2018
- 1142/TB-TCHQ/2020 · nhóm 58.06 · https://www.tracuuhs.com/tin-tuc/tchq-1142-2020
- 331/TB-TCHQ/2018 · nhóm 58.08 · https://www.tracuuhs.com/tin-tuc/tchq-331-2018
- 1143/TB-TCHQ/2020 · nhóm 59.01 · https://www.tracuuhs.com/tin-tuc/tchq-1143-2020
- 1759/TB-TCHQ/2018 · nhóm 59.03 · https://www.tracuuhs.com/tin-tuc/tchq-1759-2018
- 2101/TB-TCHQ/2018 · nhóm 59.03 · https://www.tracuuhs.com/tin-tuc/tchq-2101-2018
- 2876/TB-TCHQ/2018 · nhóm 59.03 · https://www.tracuuhs.com/tin-tuc/tchq-2876-2018
- 2877/TB-TCHQ/2018 · nhóm 59.03 · https://www.tracuuhs.com/tin-tuc/tchq-2877-2018
- 3237/TB-TCHQ/2018 · nhóm 59.03 · https://www.tracuuhs.com/tin-tuc/tchq-3237-2018
- 3368/TB-TCHQ/2018 · nhóm 59.03 · https://www.tracuuhs.com/tin-tuc/tchq-3368-2018
- 6028/TB-TCHQ/2018 · nhóm 59.03 · https://www.tracuuhs.com/tin-tuc/tchq-6028-2018
- 7463/TB-TCHQ/2018 · nhóm 59.03 · https://www.tracuuhs.com/tin-tuc/tchq-7463-2018
- 2811/TB-TCHQ/2018 · nhóm 59.04 · https://www.tracuuhs.com/tin-tuc/tchq-2811-2018
- 6518/TB-TCHQ/2018 · nhóm 59.06 · https://www.tracuuhs.com/tin-tuc/tchq-6518-2018
- 1345/TB-TCHQ/2019 · nhóm 59.07 · https://www.tracuuhs.com/tin-tuc/tchq-1345-2019
- 2875/TB-TCHQ/2018 · nhóm 59.07 · https://www.tracuuhs.com/tin-tuc/tchq-2875-2018
- 3696/TB-TCHQ/2019 · nhóm 59.07 · https://www.tracuuhs.com/tin-tuc/tchq-3696-2019
- 6304/TB-TCHQ/2023 · nhóm 59.07 · https://www.tracuuhs.com/tin-tuc/tchq-6304-2023
- 657/TB-TCHQ/2022 · nhóm 59.11 · https://www.tracuuhs.com/tin-tuc/tchq-657-2022
- 658/TB-TCHQ/2022 · nhóm 59.11 · https://www.tracuuhs.com/tin-tuc/tchq-658-2022

## goi-077 · Ch.59·60 · 20 TB

- 719/TB-TCHQ/2018 · nhóm 59.11 · https://www.tracuuhs.com/tin-tuc/tchq-719-2018
- 1011/TB-TCHQ/2020 · nhóm 59.11 · https://www.tracuuhs.com/tin-tuc/tchq-1011-2020
- 3369/TB-TCHQ/2018 · nhóm 59.11 · https://www.tracuuhs.com/tin-tuc/tchq-3369-2018
- 3903/TB-TCHQ/2023 · nhóm 59.11 · https://www.tracuuhs.com/tin-tuc/tchq-3903-2023
- 358/TB-TCHQ/2018 · nhóm 60.01 · https://www.tracuuhs.com/tin-tuc/tchq-358-2018
- 539/TB-TCHQ/2018 · nhóm 60.01 · https://www.tracuuhs.com/tin-tuc/tchq-539-2018
- 540/TB-TCHQ/2018 · nhóm 60.01 · https://www.tracuuhs.com/tin-tuc/tchq-540-2018
- 2519/TB-TCHQ/2018 · nhóm 60.03 · https://www.tracuuhs.com/tin-tuc/tchq-2519-2018
- 3207/TB-TCHQ/2018 · nhóm 60.04 · https://www.tracuuhs.com/tin-tuc/tchq-3207-2018
- 1855/TB-TCHQ/2018 · nhóm 60.05 · https://www.tracuuhs.com/tin-tuc/tchq-1855-2018
- 2469/TB-TCHQ/2018 · nhóm 60.05 · https://www.tracuuhs.com/tin-tuc/tchq-2469-2018
- 2472/TB-TCHQ/2018 · nhóm 60.05 · https://www.tracuuhs.com/tin-tuc/tchq-2472-2018
- 2794/TB-TCHQ/2018 · nhóm 60.05 · https://www.tracuuhs.com/tin-tuc/tchq-2794-2018
- 2849/TB-TCHQ/2018 · nhóm 60.05 · https://www.tracuuhs.com/tin-tuc/tchq-2849-2018
- 3001/TB-TCHQ/2019 · nhóm 60.05 · https://www.tracuuhs.com/tin-tuc/tchq-3001-2019
- 3026/TB-TCHQ/2018 · nhóm 60.05 · https://www.tracuuhs.com/tin-tuc/tchq-3026-2018
- 3027/TB-TCHQ/2018 · nhóm 60.05 · https://www.tracuuhs.com/tin-tuc/tchq-3027-2018
- 3221/TB-TCHQ/2018 · nhóm 60.05 · https://www.tracuuhs.com/tin-tuc/tchq-3221-2018
- 3268/TB-TCHQ/2018 · nhóm 60.05 · https://www.tracuuhs.com/tin-tuc/tchq-3268-2018
- 3405/TB-TCHQ/2018 · nhóm 60.05 · https://www.tracuuhs.com/tin-tuc/tchq-3405-2018

## goi-078 · Ch.60·61·63·68 · 20 TB

- 4137/TB-TCHQ/2018 · nhóm 60.05 · https://www.tracuuhs.com/tin-tuc/tchq-4137-2018
- 598/TB-TCHQ/2018 · nhóm 60.06 · https://www.tracuuhs.com/tin-tuc/tchq-598-2018
- 4141/TB-TCHQ/2018 · nhóm 60.06 · https://www.tracuuhs.com/tin-tuc/tchq-4141-2018
- 6740/TB-TCHQ/2018 · nhóm 60.06 · https://www.tracuuhs.com/tin-tuc/tchq-6740-2018
- 2748/TB-TCHQ/2018 · nhóm 61.15 · https://www.tracuuhs.com/tin-tuc/tchq-2748-2018
- 898/TB-TCHQ/2019 · nhóm 63.07 · https://www.tracuuhs.com/tin-tuc/tchq-898-2019
- 3326/TB-TCHQ/2018 · nhóm 63.07 · https://www.tracuuhs.com/tin-tuc/tchq-3326-2018
- 3965/TB-TCHQ/2018 · nhóm 63.07 · https://www.tracuuhs.com/tin-tuc/tchq-3965-2018
- 6469/TB-TCHQ/2018 · nhóm 63.07 · https://www.tracuuhs.com/tin-tuc/tchq-6469-2018
- 514/TB-TCHQ/2018 · nhóm 68.01 · https://www.tracuuhs.com/tin-tuc/tchq-514-2018
- 1667/TB-TCHQ/2020 · nhóm 68.02 · https://www.tracuuhs.com/tin-tuc/tchq-1667-2020
- 1668/TB-TCHQ/2020 · nhóm 68.02 · https://www.tracuuhs.com/tin-tuc/tchq-1668-2020
- 3960/TB-TCHQ/2018 · nhóm 68.02 · https://www.tracuuhs.com/tin-tuc/tchq-3960-2018
- 3961/TB-TCHQ/2018 · nhóm 68.02 · https://www.tracuuhs.com/tin-tuc/tchq-3961-2018
- 4214/TB-TCHQ/2019 · nhóm 68.02 · https://www.tracuuhs.com/tin-tuc/tchq-4214-2019
- 4215/TB-TCHQ/2019 · nhóm 68.02 · https://www.tracuuhs.com/tin-tuc/tchq-4215-2019
- 1801/TB-TCHQ/2018 · nhóm 68.03 · https://www.tracuuhs.com/tin-tuc/tchq-1801-2018
- 3195/TB-TCHQ/2019 · nhóm 68.06 · https://www.tracuuhs.com/tin-tuc/tchq-3195-2019
- 1428/TB-TCHQ/2018 · nhóm 68.07 · https://www.tracuuhs.com/tin-tuc/tchq-1428-2018
- 1429/TB-TCHQ/2018 · nhóm 68.07 · https://www.tracuuhs.com/tin-tuc/tchq-1429-2018

## goi-079 · Ch.68·69 · 20 TB

- 814/TB-TCHQ/2018 · nhóm 68.10 · https://www.tracuuhs.com/tin-tuc/tchq-814-2018
- 1770/TB-TCHQ/2018 · nhóm 68.10 · https://www.tracuuhs.com/tin-tuc/tchq-1770-2018
- 1771/TB-TCHQ/2018 · nhóm 68.10 · https://www.tracuuhs.com/tin-tuc/tchq-1771-2018
- 3844/TB-TCHQ/2019 · nhóm 68.10 · https://www.tracuuhs.com/tin-tuc/tchq-3844-2019
- 4129/TB-TCHQ/2023 · nhóm 68.10 · https://www.tracuuhs.com/tin-tuc/tchq-4129-2023
- 3937/TB-TCHQ/2019 · nhóm 68.11 · https://www.tracuuhs.com/tin-tuc/tchq-3937-2019
- 2102/TB-TCHQ/2018 · nhóm 68.12 · https://www.tracuuhs.com/tin-tuc/tchq-2102-2018
- 18/TB-TCHQ/2019 · nhóm 68.15 · https://www.tracuuhs.com/tin-tuc/tchq-18-2019
- 257/TB-TCHQ/2020 · nhóm 68.15 · https://www.tracuuhs.com/tin-tuc/tchq-257-2020
- 1145/TB-TCHQ/2020 · nhóm 68.15 · https://www.tracuuhs.com/tin-tuc/tchq-1145-2020
- 1214/TB-TCHQ/2020 · nhóm 68.15 · https://www.tracuuhs.com/tin-tuc/tchq-1214-2020
- 1215/TB-TCHQ/2020 · nhóm 68.15 · https://www.tracuuhs.com/tin-tuc/tchq-1215-2020
- 3622/TB-TCHQ/2018 · nhóm 68.15 · https://www.tracuuhs.com/tin-tuc/tchq-3622-2018
- 3623/TB-TCHQ/2018 · nhóm 68.15 · https://www.tracuuhs.com/tin-tuc/tchq-3623-2018
- 6935/TB-TCHQ/2018 · nhóm 68.15 · https://www.tracuuhs.com/tin-tuc/tchq-6935-2018
- 7173/TB-TCHQ/2018 · nhóm 68.15 · https://www.tracuuhs.com/tin-tuc/tchq-7173-2018
- 1333/TB-TCHQ/2018 · nhóm 69.02 · https://www.tracuuhs.com/tin-tuc/tchq-1333-2018
- 1796/TB-TCHQ/2018 · nhóm 69.03 · https://www.tracuuhs.com/tin-tuc/tchq-1796-2018
- 1800/TB-TCHQ/2018 · nhóm 69.03 · https://www.tracuuhs.com/tin-tuc/tchq-1800-2018
- 452/TB-TCHQ/2019 · nhóm 69.04 · https://www.tracuuhs.com/tin-tuc/tchq-452-2019

## goi-080 · Ch.69·70 · 20 TB

- 555/TB-TCHQ/2019 · nhóm 69.04 · https://www.tracuuhs.com/tin-tuc/tchq-555-2019
- 556/TB-TCHQ/2019 · nhóm 69.04 · https://www.tracuuhs.com/tin-tuc/tchq-556-2019
- 7570/TB-TCHQ/2018 · nhóm 69.04 · https://www.tracuuhs.com/tin-tuc/tchq-7570-2018
- 553/TB-TCHQ/2019 · nhóm 69.07 · https://www.tracuuhs.com/tin-tuc/tchq-553-2019
- 6635/TB-TCHQ/2018 · nhóm 69.07 · https://www.tracuuhs.com/tin-tuc/tchq-6635-2018
- 7048/TB-TCHQ/2018 · nhóm 69.07 · https://www.tracuuhs.com/tin-tuc/tchq-7048-2018
- 7050/TB-TCHQ/2018 · nhóm 69.07 · https://www.tracuuhs.com/tin-tuc/tchq-7050-2018
- 7051/TB-TCHQ/2018 · nhóm 69.07 · https://www.tracuuhs.com/tin-tuc/tchq-7051-2018
- 554/TB-TCHQ/2019 · nhóm 69.14 · https://www.tracuuhs.com/tin-tuc/tchq-554-2019
- 611/TB-TCHQ/2018 · nhóm 69.14 · https://www.tracuuhs.com/tin-tuc/tchq-611-2018
- 6936/TB-TCHQ/2018 · nhóm 70.02 · https://www.tracuuhs.com/tin-tuc/tchq-6936-2018
- 1555/TB-TCHQ/2018 · nhóm 70.05 · https://www.tracuuhs.com/tin-tuc/tchq-1555-2018
- 1556/TB-TCHQ/2018 · nhóm 70.05 · https://www.tracuuhs.com/tin-tuc/tchq-1556-2018
- 1557/TB-TCHQ/2018 · nhóm 70.05 · https://www.tracuuhs.com/tin-tuc/tchq-1557-2018
- 1558/TB-TCHQ/2018 · nhóm 70.05 · https://www.tracuuhs.com/tin-tuc/tchq-1558-2018
- 1404/TB-TCHQ/2018 · nhóm 70.08 · https://www.tracuuhs.com/tin-tuc/tchq-1404-2018
- 1760/TB-TCHQ/2018 · nhóm 70.08 · https://www.tracuuhs.com/tin-tuc/tchq-1760-2018
- 1791/TB-TCHQ/2018 · nhóm 70.08 · https://www.tracuuhs.com/tin-tuc/tchq-1791-2018
- 1792/TB-TCHQ/2018 · nhóm 70.08 · https://www.tracuuhs.com/tin-tuc/tchq-1792-2018
- 1802/TB-TCHQ/2018 · nhóm 70.08 · https://www.tracuuhs.com/tin-tuc/tchq-1802-2018

## goi-081 · Ch.70 · 20 TB

- 1803/TB-TCHQ/2018 · nhóm 70.08 · https://www.tracuuhs.com/tin-tuc/tchq-1803-2018
- 1329/TB-TCHQ/2018 · nhóm 70.09 · https://www.tracuuhs.com/tin-tuc/tchq-1329-2018
- 1330/TB-TCHQ/2018 · nhóm 70.09 · https://www.tracuuhs.com/tin-tuc/tchq-1330-2018
- 1795/TB-TCHQ/2018 · nhóm 70.09 · https://www.tracuuhs.com/tin-tuc/tchq-1795-2018
- 2065/TB-TCHQ/2018 · nhóm 70.09 · https://www.tracuuhs.com/tin-tuc/tchq-2065-2018
- 2695/TB-TCHQ/2024 · nhóm 70.10 · https://www.tracuuhs.com/tin-tuc/tchq-2695-2024
- 6854/TB-TCHQ/2018 · nhóm 70.10 · https://www.tracuuhs.com/tin-tuc/tchq-6854-2018
- 612/TB-TCHQ/2018 · nhóm 70.13 · https://www.tracuuhs.com/tin-tuc/tchq-612-2018
- 2334/TB-TCHQ/2018 · nhóm 70.13 · https://www.tracuuhs.com/tin-tuc/tchq-2334-2018
- 2335/TB-TCHQ/2018 · nhóm 70.13 · https://www.tracuuhs.com/tin-tuc/tchq-2335-2018
- 2340/TB-TCHQ/2018 · nhóm 70.13 · https://www.tracuuhs.com/tin-tuc/tchq-2340-2018
- 2343/TB-TCHQ/2018 · nhóm 70.13 · https://www.tracuuhs.com/tin-tuc/tchq-2343-2018
- 3926/TB-TCHQ/2024 · nhóm 70.13 · https://www.tracuuhs.com/tin-tuc/tchq-3926-2024
- 6872/TB-TCHQ/2018 · nhóm 70.13 · https://www.tracuuhs.com/tin-tuc/tchq-6872-2018
- 19/TB-TCHQ/2019 · nhóm 70.19 · https://www.tracuuhs.com/tin-tuc/tchq-19-2019
- 22/TB-TCHQ/2019 · nhóm 70.19 · https://www.tracuuhs.com/tin-tuc/tchq-22-2019
- 1968/TB-TCHQ/2018 · nhóm 70.19 · https://www.tracuuhs.com/tin-tuc/tchq-1968-2018
- 5608/TB-TCHQ/2018 · nhóm 70.19 · https://www.tracuuhs.com/tin-tuc/tchq-5608-2018
- 6895/TB-TCHQ/2018 · nhóm 70.19 · https://www.tracuuhs.com/tin-tuc/tchq-6895-2018
- 3938/TB-TCHQ/2019 · nhóm 70.20 · https://www.tracuuhs.com/tin-tuc/tchq-3938-2019

## goi-082 · Ch.70·71·72 · 20 TB

- 3939/TB-TCHQ/2019 · nhóm 70.20 · https://www.tracuuhs.com/tin-tuc/tchq-3939-2019
- 3940/TB-TCHQ/2019 · nhóm 70.20 · https://www.tracuuhs.com/tin-tuc/tchq-3940-2019
- 3327/TB-TCHQ/2018 · nhóm 71.03 · https://www.tracuuhs.com/tin-tuc/tchq-3327-2018
- 1499/TB-TCHQ/2018 · nhóm 71.06 · https://www.tracuuhs.com/tin-tuc/tchq-1499-2018
- 2710/TB-TCHQ/2023 · nhóm 71.06 · https://www.tracuuhs.com/tin-tuc/tchq-2710-2023
- 2711/TB-TCHQ/2023 · nhóm 71.06 · https://www.tracuuhs.com/tin-tuc/tchq-2711-2023
- 562/TB-TCHQ/2020 · nhóm 71.16 · https://www.tracuuhs.com/tin-tuc/tchq-562-2020
- 5586/TB-TCHQ/2021 · nhóm 71.16 · https://www.tracuuhs.com/tin-tuc/tchq-5586-2021
- 575/TB-TCHQ/2018 · nhóm 72.02 · https://www.tracuuhs.com/tin-tuc/tchq-575-2018
- 1149/TB-TCHQ/2018 · nhóm 72.02 · https://www.tracuuhs.com/tin-tuc/tchq-1149-2018
- 703/TB-TCHQ/2019 · nhóm 72.04 · https://www.tracuuhs.com/tin-tuc/tchq-703-2019
- 716/TB-TCHQ/2019 · nhóm 72.04 · https://www.tracuuhs.com/tin-tuc/tchq-716-2019
- 815/TB-TCHQ/2018 · nhóm 72.04 · https://www.tracuuhs.com/tin-tuc/tchq-815-2018
- 4718/TB-TCHQ/2018 · nhóm 72.04 · https://www.tracuuhs.com/tin-tuc/tchq-4718-2018
- 5324/TB-TCHQ/2018 · nhóm 72.04 · https://www.tracuuhs.com/tin-tuc/tchq-5324-2018
- 2395/TB-TCHQ/2018 · nhóm 72.07 · https://www.tracuuhs.com/tin-tuc/tchq-2395-2018
- 216/TB-TCHQ/2019 · nhóm 72.08 · https://www.tracuuhs.com/tin-tuc/tchq-216-2019
- 478/TB-TCHQ/2019 · nhóm 72.08 · https://www.tracuuhs.com/tin-tuc/tchq-478-2019
- 1139/TB-TCHQ/2020 · nhóm 72.08 · https://www.tracuuhs.com/tin-tuc/tchq-1139-2020
- 2846/TB-TCHQ/2018 · nhóm 72.08 · https://www.tracuuhs.com/tin-tuc/tchq-2846-2018

## goi-083 · Ch.72 · 20 TB

- 2870/TB-TCHQ/2018 · nhóm 72.08 · https://www.tracuuhs.com/tin-tuc/tchq-2870-2018
- 2871/TB-TCHQ/2018 · nhóm 72.08 · https://www.tracuuhs.com/tin-tuc/tchq-2871-2018
- 2872/TB-TCHQ/2018 · nhóm 72.08 · https://www.tracuuhs.com/tin-tuc/tchq-2872-2018
- 3309/TB-TCHQ/2018 · nhóm 72.08 · https://www.tracuuhs.com/tin-tuc/tchq-3309-2018
- 3343/TB-TCHQ/2019 · nhóm 72.08 · https://www.tracuuhs.com/tin-tuc/tchq-3343-2019
- 3744/TB-TCHQ/2019 · nhóm 72.08 · https://www.tracuuhs.com/tin-tuc/tchq-3744-2019
- 6063/TB-TCHQ/2018 · nhóm 72.08 · https://www.tracuuhs.com/tin-tuc/tchq-6063-2018
- 6269/TB-TCHQ/2018 · nhóm 72.08 · https://www.tracuuhs.com/tin-tuc/tchq-6269-2018
- 7284/TB-TCHQ/2018 · nhóm 72.08 · https://www.tracuuhs.com/tin-tuc/tchq-7284-2018
- 215/TB-TCHQ/2019 · nhóm 72.09 · https://www.tracuuhs.com/tin-tuc/tchq-215-2019
- 459/TB-TCHQ/2019 · nhóm 72.09 · https://www.tracuuhs.com/tin-tuc/tchq-459-2019
- 461/TB-TCHQ/2019 · nhóm 72.09 · https://www.tracuuhs.com/tin-tuc/tchq-461-2019
- 523/TB-TCHQ/2018 · nhóm 72.09 · https://www.tracuuhs.com/tin-tuc/tchq-523-2018
- 537/TB-TCHQ/2019 · nhóm 72.09 · https://www.tracuuhs.com/tin-tuc/tchq-537-2019
- 1195/TB-TCHQ/2020 · nhóm 72.09 · https://www.tracuuhs.com/tin-tuc/tchq-1195-2020
- 1209/TB-TCHQ/2020 · nhóm 72.09 · https://www.tracuuhs.com/tin-tuc/tchq-1209-2020
- 1449/TB-TCHQ/2018 · nhóm 72.09 · https://www.tracuuhs.com/tin-tuc/tchq-1449-2018
- 1754/TB-TCHQ/2020 · nhóm 72.09 · https://www.tracuuhs.com/tin-tuc/tchq-1754-2020
- 1761/TB-TCHQ/2018 · nhóm 72.09 · https://www.tracuuhs.com/tin-tuc/tchq-1761-2018
- 2127/TB-TCHQ/2020 · nhóm 72.09 · https://www.tracuuhs.com/tin-tuc/tchq-2127-2020

## goi-084 · Ch.72 · 20 TB

- 2454/TB-TCHQ/2018 · nhóm 72.09 · https://www.tracuuhs.com/tin-tuc/tchq-2454-2018
- 2842/TB-TCHQ/2018 · nhóm 72.09 · https://www.tracuuhs.com/tin-tuc/tchq-2842-2018
- 6786/TB-TCHQ/2018 · nhóm 72.09 · https://www.tracuuhs.com/tin-tuc/tchq-6786-2018
- 6787/TB-TCHQ/2018 · nhóm 72.09 · https://www.tracuuhs.com/tin-tuc/tchq-6787-2018
- 451/TB-TCHQ/2019 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-451-2019
- 1765/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-1765-2018
- 3174/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-3174-2018
- 3208/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-3208-2018
- 3209/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-3209-2018
- 3210/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-3210-2018
- 3211/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-3211-2018
- 3212/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-3212-2018
- 3213/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-3213-2018
- 3214/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-3214-2018
- 3215/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-3215-2018
- 3216/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-3216-2018
- 3217/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-3217-2018
- 3218/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-3218-2018
- 3219/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-3219-2018
- 3225/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-3225-2018

## goi-085 · Ch.72 · 20 TB

- 3234/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-3234-2018
- 3801/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-3801-2018
- 5201/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-5201-2018
- 6735/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-6735-2018
- 6736/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-6736-2018
- 6737/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-6737-2018
- 6738/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-6738-2018
- 6739/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-6739-2018
- 6766/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-6766-2018
- 6785/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-6785-2018
- 7436/TB-TCHQ/2018 · nhóm 72.10 · https://www.tracuuhs.com/tin-tuc/tchq-7436-2018
- 217/TB-TCHQ/2019 · nhóm 72.11 · https://www.tracuuhs.com/tin-tuc/tchq-217-2019
- 3176/TB-TCHQ/2018 · nhóm 72.11 · https://www.tracuuhs.com/tin-tuc/tchq-3176-2018
- 3746/TB-TCHQ/2019 · nhóm 72.11 · https://www.tracuuhs.com/tin-tuc/tchq-3746-2019
- 6021/TB-TCHQ/2018 · nhóm 72.11 · https://www.tracuuhs.com/tin-tuc/tchq-6021-2018
- 104/TB-TCHQ/2020 · nhóm 72.12 · https://www.tracuuhs.com/tin-tuc/tchq-104-2020
- 1191/TB-TCHQ/2020 · nhóm 72.12 · https://www.tracuuhs.com/tin-tuc/tchq-1191-2020
- 1196/TB-TCHQ/2020 · nhóm 72.12 · https://www.tracuuhs.com/tin-tuc/tchq-1196-2020
- 1504/TB-TCHQ/2022 · nhóm 72.12 · https://www.tracuuhs.com/tin-tuc/tchq-1504-2022
- 1762/TB-TCHQ/2020 · nhóm 72.12 · https://www.tracuuhs.com/tin-tuc/tchq-1762-2020

## goi-086 · Ch.72 · 20 TB

- 1763/TB-TCHQ/2020 · nhóm 72.12 · https://www.tracuuhs.com/tin-tuc/tchq-1763-2020
- 1838/TB-TCHQ/2020 · nhóm 72.12 · https://www.tracuuhs.com/tin-tuc/tchq-1838-2020
- 1911/TB-TCHQ/2020 · nhóm 72.12 · https://www.tracuuhs.com/tin-tuc/tchq-1911-2020
- 1912/TB-TCHQ/2020 · nhóm 72.12 · https://www.tracuuhs.com/tin-tuc/tchq-1912-2020
- 1983/TB-TCHQ/2020 · nhóm 72.12 · https://www.tracuuhs.com/tin-tuc/tchq-1983-2020
- 1984/TB-TCHQ/2020 · nhóm 72.12 · https://www.tracuuhs.com/tin-tuc/tchq-1984-2020
- 2032/TB-TCHQ/2020 · nhóm 72.12 · https://www.tracuuhs.com/tin-tuc/tchq-2032-2020
- 2033/TB-TCHQ/2020 · nhóm 72.12 · https://www.tracuuhs.com/tin-tuc/tchq-2033-2020
- 2129/TB-TCHQ/2020 · nhóm 72.12 · https://www.tracuuhs.com/tin-tuc/tchq-2129-2020
- 2131/TB-TCHQ/2020 · nhóm 72.12 · https://www.tracuuhs.com/tin-tuc/tchq-2131-2020
- 2151/TB-TCHQ/2020 · nhóm 72.12 · https://www.tracuuhs.com/tin-tuc/tchq-2151-2020
- 2848/TB-TCHQ/2018 · nhóm 72.12 · https://www.tracuuhs.com/tin-tuc/tchq-2848-2018
- 3351/TB-TCHQ/2019 · nhóm 72.12 · https://www.tracuuhs.com/tin-tuc/tchq-3351-2019
- 3627/TB-TCHQ/2019 · nhóm 72.12 · https://www.tracuuhs.com/tin-tuc/tchq-3627-2019
- 7280/TB-TCHQ/2018 · nhóm 72.12 · https://www.tracuuhs.com/tin-tuc/tchq-7280-2018
- 101/TB-TCHQ/2020 · nhóm 72.14 · https://www.tracuuhs.com/tin-tuc/tchq-101-2020
- 447/TB-TCHQ/2019 · nhóm 72.14 · https://www.tracuuhs.com/tin-tuc/tchq-447-2019
- 1144/TB-TCHQ/2020 · nhóm 72.14 · https://www.tracuuhs.com/tin-tuc/tchq-1144-2020
- 1194/TB-TCHQ/2020 · nhóm 72.14 · https://www.tracuuhs.com/tin-tuc/tchq-1194-2020
- 1703/TB-TCHQ/2020 · nhóm 72.14 · https://www.tracuuhs.com/tin-tuc/tchq-1703-2020

## goi-087 · Ch.72 · 20 TB

- 3146/TB-TCHQ/2019 · nhóm 72.14 · https://www.tracuuhs.com/tin-tuc/tchq-3146-2019
- 3147/TB-TCHQ/2019 · nhóm 72.14 · https://www.tracuuhs.com/tin-tuc/tchq-3147-2019
- 3161/TB-TCHQ/2019 · nhóm 72.14 · https://www.tracuuhs.com/tin-tuc/tchq-3161-2019
- 5877/TB-TCHQ/2018 · nhóm 72.14 · https://www.tracuuhs.com/tin-tuc/tchq-5877-2018
- 6434/TB-TCHQ/2018 · nhóm 72.14 · https://www.tracuuhs.com/tin-tuc/tchq-6434-2018
- 4065/TB-TCHQ/2018 · nhóm 72.15 · https://www.tracuuhs.com/tin-tuc/tchq-4065-2018
- 1317/TB-TCHQ/2019 · nhóm 72.16 · https://www.tracuuhs.com/tin-tuc/tchq-1317-2019
- 1753/TB-TCHQ/2020 · nhóm 72.16 · https://www.tracuuhs.com/tin-tuc/tchq-1753-2020
- 2832/TB-TCHQ/2018 · nhóm 72.16 · https://www.tracuuhs.com/tin-tuc/tchq-2832-2018
- 5036/TB-TCHQ/2018 · nhóm 72.16 · https://www.tracuuhs.com/tin-tuc/tchq-5036-2018
- 5037/TB-TCHQ/2018 · nhóm 72.16 · https://www.tracuuhs.com/tin-tuc/tchq-5037-2018
- 5038/TB-TCHQ/2018 · nhóm 72.16 · https://www.tracuuhs.com/tin-tuc/tchq-5038-2018
- 5072/TB-TCHQ/2018 · nhóm 72.16 · https://www.tracuuhs.com/tin-tuc/tchq-5072-2018
- 5073/TB-TCHQ/2018 · nhóm 72.16 · https://www.tracuuhs.com/tin-tuc/tchq-5073-2018
- 5642/TB-TCHQ/2018 · nhóm 72.16 · https://www.tracuuhs.com/tin-tuc/tchq-5642-2018
- 7088/TB-TCHQ/2018 · nhóm 72.16 · https://www.tracuuhs.com/tin-tuc/tchq-7088-2018
- 1027/TB-TCHQ/2020 · nhóm 72.17 · https://www.tracuuhs.com/tin-tuc/tchq-1027-2020
- 1028/TB-TCHQ/2020 · nhóm 72.17 · https://www.tracuuhs.com/tin-tuc/tchq-1028-2020
- 2128/TB-TCHQ/2020 · nhóm 72.17 · https://www.tracuuhs.com/tin-tuc/tchq-2128-2020
- 3537/TB-TCHQ/2019 · nhóm 72.17 · https://www.tracuuhs.com/tin-tuc/tchq-3537-2019

## goi-088 · Ch.72 · 20 TB

- 3538/TB-TCHQ/2019 · nhóm 72.17 · https://www.tracuuhs.com/tin-tuc/tchq-3538-2019
- 3539/TB-TCHQ/2019 · nhóm 72.17 · https://www.tracuuhs.com/tin-tuc/tchq-3539-2019
- 3548/TB-TCHQ/2019 · nhóm 72.17 · https://www.tracuuhs.com/tin-tuc/tchq-3548-2019
- 4034/TB-TCHQ/2019 · nhóm 72.17 · https://www.tracuuhs.com/tin-tuc/tchq-4034-2019
- 4065/TB-TCHQ/2023 · nhóm 72.18 · https://www.tracuuhs.com/tin-tuc/tchq-4065-2023
- 1026/TB-TCHQ/2020 · nhóm 72.19 · https://www.tracuuhs.com/tin-tuc/tchq-1026-2020
- 1029/TB-TCHQ/2020 · nhóm 72.19 · https://www.tracuuhs.com/tin-tuc/tchq-1029-2020
- 1927/TB-TCHQ/2020 · nhóm 72.19 · https://www.tracuuhs.com/tin-tuc/tchq-1927-2020
- 1930/TB-TCHQ/2020 · nhóm 72.19 · https://www.tracuuhs.com/tin-tuc/tchq-1930-2020
- 1980/TB-TCHQ/2020 · nhóm 72.19 · https://www.tracuuhs.com/tin-tuc/tchq-1980-2020
- 3424/TB-TCHQ/2018 · nhóm 72.19 · https://www.tracuuhs.com/tin-tuc/tchq-3424-2018
- 4111/TB-TCHQ/2023 · nhóm 72.19 · https://www.tracuuhs.com/tin-tuc/tchq-4111-2023
- 2790/TB-TCHQ/2018 · nhóm 72.20 · https://www.tracuuhs.com/tin-tuc/tchq-2790-2018
- 2788/TB-TCHQ/2018 · nhóm 72.22 · https://www.tracuuhs.com/tin-tuc/tchq-2788-2018
- 3628/TB-TCHQ/2019 · nhóm 72.22 · https://www.tracuuhs.com/tin-tuc/tchq-3628-2019
- 182/TB-TCHQ/2019 · nhóm 72.23 · https://www.tracuuhs.com/tin-tuc/tchq-182-2019
- 6101/TB-TCHQ/2018 · nhóm 72.24 · https://www.tracuuhs.com/tin-tuc/tchq-6101-2018
- 6102/TB-TCHQ/2018 · nhóm 72.24 · https://www.tracuuhs.com/tin-tuc/tchq-6102-2018
- 6103/TB-TCHQ/2018 · nhóm 72.24 · https://www.tracuuhs.com/tin-tuc/tchq-6103-2018
- 2453/TB-TCHQ/2018 · nhóm 72.25 · https://www.tracuuhs.com/tin-tuc/tchq-2453-2018

## goi-089 · Ch.72 · 20 TB

- 714/TB-TCHQ/2019 · nhóm 72.26 · https://www.tracuuhs.com/tin-tuc/tchq-714-2019
- 860/TB-TCHQ/2019 · nhóm 72.26 · https://www.tracuuhs.com/tin-tuc/tchq-860-2019
- 861/TB-TCHQ/2019 · nhóm 72.26 · https://www.tracuuhs.com/tin-tuc/tchq-861-2019
- 977/TB-TCHQ/2018 · nhóm 72.26 · https://www.tracuuhs.com/tin-tuc/tchq-977-2018
- 1462/TB-TCHQ/2018 · nhóm 72.26 · https://www.tracuuhs.com/tin-tuc/tchq-1462-2018
- 1756/TB-TCHQ/2020 · nhóm 72.26 · https://www.tracuuhs.com/tin-tuc/tchq-1756-2020
- 2787/TB-TCHQ/2018 · nhóm 72.26 · https://www.tracuuhs.com/tin-tuc/tchq-2787-2018
- 2789/TB-TCHQ/2018 · nhóm 72.26 · https://www.tracuuhs.com/tin-tuc/tchq-2789-2018
- 2792/TB-TCHQ/2018 · nhóm 72.26 · https://www.tracuuhs.com/tin-tuc/tchq-2792-2018
- 4051/TB-TCHQ/2018 · nhóm 72.26 · https://www.tracuuhs.com/tin-tuc/tchq-4051-2018
- 6626/TB-TCHQ/2018 · nhóm 72.26 · https://www.tracuuhs.com/tin-tuc/tchq-6626-2018
- 6627/TB-TCHQ/2018 · nhóm 72.26 · https://www.tracuuhs.com/tin-tuc/tchq-6627-2018
- 6628/TB-TCHQ/2018 · nhóm 72.26 · https://www.tracuuhs.com/tin-tuc/tchq-6628-2018
- 6629/TB-TCHQ/2018 · nhóm 72.26 · https://www.tracuuhs.com/tin-tuc/tchq-6629-2018
- 6630/TB-TCHQ/2018 · nhóm 72.26 · https://www.tracuuhs.com/tin-tuc/tchq-6630-2018
- 6634/TB-TCHQ/2018 · nhóm 72.26 · https://www.tracuuhs.com/tin-tuc/tchq-6634-2018
- 6637/TB-TCHQ/2018 · nhóm 72.26 · https://www.tracuuhs.com/tin-tuc/tchq-6637-2018
- 6850/TB-TCHQ/2018 · nhóm 72.26 · https://www.tracuuhs.com/tin-tuc/tchq-6850-2018
- 6851/TB-TCHQ/2018 · nhóm 72.26 · https://www.tracuuhs.com/tin-tuc/tchq-6851-2018
- 6852/TB-TCHQ/2018 · nhóm 72.26 · https://www.tracuuhs.com/tin-tuc/tchq-6852-2018

## goi-090 · Ch.72 · 20 TB

- 6853/TB-TCHQ/2018 · nhóm 72.26 · https://www.tracuuhs.com/tin-tuc/tchq-6853-2018
- 3350/TB-TCHQ/2019 · nhóm 72.27 · https://www.tracuuhs.com/tin-tuc/tchq-3350-2019
- 653/TB-TCHQ/2018 · nhóm 72.28 · https://www.tracuuhs.com/tin-tuc/tchq-653-2018
- 654/TB-TCHQ/2018 · nhóm 72.28 · https://www.tracuuhs.com/tin-tuc/tchq-654-2018
- 715/TB-TCHQ/2019 · nhóm 72.28 · https://www.tracuuhs.com/tin-tuc/tchq-715-2019
- 857/TB-TCHQ/2019 · nhóm 72.28 · https://www.tracuuhs.com/tin-tuc/tchq-857-2019
- 858/TB-TCHQ/2019 · nhóm 72.28 · https://www.tracuuhs.com/tin-tuc/tchq-858-2019
- 859/TB-TCHQ/2019 · nhóm 72.28 · https://www.tracuuhs.com/tin-tuc/tchq-859-2019
- 902/TB-TCHQ/2019 · nhóm 72.28 · https://www.tracuuhs.com/tin-tuc/tchq-902-2019
- 903/TB-TCHQ/2019 · nhóm 72.28 · https://www.tracuuhs.com/tin-tuc/tchq-903-2019
- 904/TB-TCHQ/2019 · nhóm 72.28 · https://www.tracuuhs.com/tin-tuc/tchq-904-2019
- 905/TB-TCHQ/2019 · nhóm 72.28 · https://www.tracuuhs.com/tin-tuc/tchq-905-2019
- 1133/TB-TCHQ/2022 · nhóm 72.28 · https://www.tracuuhs.com/tin-tuc/tchq-1133-2022
- 1329/TB-TCHQ/2019 · nhóm 72.28 · https://www.tracuuhs.com/tin-tuc/tchq-1329-2019
- 1502/TB-TCHQ/2018 · nhóm 72.28 · https://www.tracuuhs.com/tin-tuc/tchq-1502-2018
- 1629/TB-TCHQ/2020 · nhóm 72.28 · https://www.tracuuhs.com/tin-tuc/tchq-1629-2020
- 1836/TB-TCHQ/2020 · nhóm 72.28 · https://www.tracuuhs.com/tin-tuc/tchq-1836-2020
- 2786/TB-TCHQ/2018 · nhóm 72.28 · https://www.tracuuhs.com/tin-tuc/tchq-2786-2018
- 2791/TB-TCHQ/2018 · nhóm 72.28 · https://www.tracuuhs.com/tin-tuc/tchq-2791-2018
- 5768/TB-TCHQ/2018 · nhóm 72.28 · https://www.tracuuhs.com/tin-tuc/tchq-5768-2018

## goi-091 · Ch.72·73 · 20 TB

- 89/TB-TCHQ/2019 · nhóm 72.29 · https://www.tracuuhs.com/tin-tuc/tchq-89-2019
- 90/TB-TCHQ/2019 · nhóm 72.29 · https://www.tracuuhs.com/tin-tuc/tchq-90-2019
- 91/TB-TCHQ/2019 · nhóm 72.29 · https://www.tracuuhs.com/tin-tuc/tchq-91-2019
- 92/TB-TCHQ/2019 · nhóm 72.29 · https://www.tracuuhs.com/tin-tuc/tchq-92-2019
- 139/TB-TCHQ/2019 · nhóm 72.29 · https://www.tracuuhs.com/tin-tuc/tchq-139-2019
- 149/TB-TCHQ/2019 · nhóm 72.29 · https://www.tracuuhs.com/tin-tuc/tchq-149-2019
- 479/TB-TCHQ/2019 · nhóm 72.29 · https://www.tracuuhs.com/tin-tuc/tchq-479-2019
- 1233/TB-TCHQ/2019 · nhóm 72.29 · https://www.tracuuhs.com/tin-tuc/tchq-1233-2019
- 1234/TB-TCHQ/2019 · nhóm 72.29 · https://www.tracuuhs.com/tin-tuc/tchq-1234-2019
- 1910/TB-TCHQ/2020 · nhóm 72.29 · https://www.tracuuhs.com/tin-tuc/tchq-1910-2020
- 6022/TB-TCHQ/2018 · nhóm 72.29 · https://www.tracuuhs.com/tin-tuc/tchq-6022-2018
- 1197/TB-TCHQ/2020 · nhóm 73.04 · https://www.tracuuhs.com/tin-tuc/tchq-1197-2020
- 1835/TB-TCHQ/2020 · nhóm 73.04 · https://www.tracuuhs.com/tin-tuc/tchq-1835-2020
- 6466/TB-TCHQ/2023 · nhóm 73.05 · https://www.tracuuhs.com/tin-tuc/tchq-6466-2023
- 1841/TB-TCHQ/2020 · nhóm 73.06 · https://www.tracuuhs.com/tin-tuc/tchq-1841-2020
- 2126/TB-TCHQ/2020 · nhóm 73.06 · https://www.tracuuhs.com/tin-tuc/tchq-2126-2020
- 2130/TB-TCHQ/2020 · nhóm 73.06 · https://www.tracuuhs.com/tin-tuc/tchq-2130-2020
- 1704/TB-TCHQ/2020 · nhóm 73.08 · https://www.tracuuhs.com/tin-tuc/tchq-1704-2020
- 1971/TB-TCHQ/2018 · nhóm 73.08 · https://www.tracuuhs.com/tin-tuc/tchq-1971-2018
- 6832/TB-TCHQ/2018 · nhóm 73.08 · https://www.tracuuhs.com/tin-tuc/tchq-6832-2018

## goi-092 · Ch.73·74·75 · 20 TB

- 6833/TB-TCHQ/2018 · nhóm 73.08 · https://www.tracuuhs.com/tin-tuc/tchq-6833-2018
- 2765/TB-TCHQ/2023 · nhóm 73.10 · https://www.tracuuhs.com/tin-tuc/tchq-2765-2023
- 7279/TB-TCHQ/2018 · nhóm 73.14 · https://www.tracuuhs.com/tin-tuc/tchq-7279-2018
- 3857/TB-TCHQ/2019 · nhóm 73.18 · https://www.tracuuhs.com/tin-tuc/tchq-3857-2019
- 5194/TB-TCHQ/2024 · nhóm 73.18 · https://www.tracuuhs.com/tin-tuc/tchq-5194-2024
- 5195/TB-TCHQ/2024 · nhóm 73.18 · https://www.tracuuhs.com/tin-tuc/tchq-5195-2024
- 185/TB-TCHQ/2025 · nhóm 73.26 · https://www.tracuuhs.com/tin-tuc/tchq-185-2025
- 237/TB-TCHQ/2022 · nhóm 73.26 · https://www.tracuuhs.com/tin-tuc/tchq-237-2022
- 1797/TB-TCHQ/2018 · nhóm 73.26 · https://www.tracuuhs.com/tin-tuc/tchq-1797-2018
- 1808/TB-TCHQ/2018 · nhóm 73.26 · https://www.tracuuhs.com/tin-tuc/tchq-1808-2018
- 2014/TB-TCHQ/2023 · nhóm 73.26 · https://www.tracuuhs.com/tin-tuc/tchq-2014-2023
- 2015/TB-TCHQ/2023 · nhóm 73.26 · https://www.tracuuhs.com/tin-tuc/tchq-2015-2023
- 2016/TB-TCHQ/2023 · nhóm 73.26 · https://www.tracuuhs.com/tin-tuc/tchq-2016-2023
- 2017/TB-TCHQ/2023 · nhóm 73.26 · https://www.tracuuhs.com/tin-tuc/tchq-2017-2023
- 4142/TB-TCHQ/2023 · nhóm 73.26 · https://www.tracuuhs.com/tin-tuc/tchq-4142-2023
- 1136/TB-TCHQ/2020 · nhóm 74.07 · https://www.tracuuhs.com/tin-tuc/tchq-1136-2020
- 1757/TB-TCHQ/2020 · nhóm 74.08 · https://www.tracuuhs.com/tin-tuc/tchq-1757-2020
- 1758/TB-TCHQ/2020 · nhóm 74.08 · https://www.tracuuhs.com/tin-tuc/tchq-1758-2020
- 1777/TB-TCHQ/2020 · nhóm 74.10 · https://www.tracuuhs.com/tin-tuc/tchq-1777-2020
- 213/TB-TCHQ/2024 · nhóm 75.08 · https://www.tracuuhs.com/tin-tuc/tchq-213-2024

## goi-093 · Ch.76·80·81·82 · 20 TB

- 4361/TB-TCHQ/2023 · nhóm 76.01 · https://www.tracuuhs.com/tin-tuc/tchq-4361-2023
- 4362/TB-TCHQ/2023 · nhóm 76.01 · https://www.tracuuhs.com/tin-tuc/tchq-4362-2023
- 295/TB-TCHQ/2018 · nhóm 76.04 · https://www.tracuuhs.com/tin-tuc/tchq-295-2018
- 317/TB-TCHQ/2018 · nhóm 76.04 · https://www.tracuuhs.com/tin-tuc/tchq-317-2018
- 318/TB-TCHQ/2018 · nhóm 76.04 · https://www.tracuuhs.com/tin-tuc/tchq-318-2018
- 1669/TB-TCHQ/2020 · nhóm 76.06 · https://www.tracuuhs.com/tin-tuc/tchq-1669-2020
- 2035/TB-TCHQ/2020 · nhóm 76.06 · https://www.tracuuhs.com/tin-tuc/tchq-2035-2020
- 3269/TB-TCHQ/2018 · nhóm 76.06 · https://www.tracuuhs.com/tin-tuc/tchq-3269-2018
- 3723/TB-TCHQ/2020 · nhóm 76.06 · https://www.tracuuhs.com/tin-tuc/tchq-3723-2020
- 1898/TB-TCHQ/2020 · nhóm 76.07 · https://www.tracuuhs.com/tin-tuc/tchq-1898-2020
- 1899/TB-TCHQ/2020 · nhóm 76.07 · https://www.tracuuhs.com/tin-tuc/tchq-1899-2020
- 3745/TB-TCHQ/2019 · nhóm 76.07 · https://www.tracuuhs.com/tin-tuc/tchq-3745-2019
- 2167/TB-TCHQ/2020 · nhóm 76.10 · https://www.tracuuhs.com/tin-tuc/tchq-2167-2020
- 4258/TB-TCHQ/2023 · nhóm 76.16 · https://www.tracuuhs.com/tin-tuc/tchq-4258-2023
- 4778/TB-TCHQ/2024 · nhóm 80.03 · https://www.tracuuhs.com/tin-tuc/tchq-4778-2024
- 506/TB-TCHQ/2018 · nhóm 81.08 · https://www.tracuuhs.com/tin-tuc/tchq-506-2018
- 1884/TB-TCHQ/2023 · nhóm 82.05 · https://www.tracuuhs.com/tin-tuc/tchq-1884-2023
- 2075/TB-TCHQ/2023 · nhóm 82.05 · https://www.tracuuhs.com/tin-tuc/tchq-2075-2023
- 2524/TB-TCHQ/2023 · nhóm 82.05 · https://www.tracuuhs.com/tin-tuc/tchq-2524-2023
- 3927/TB-TCHQ/2024 · nhóm 82.07 · https://www.tracuuhs.com/tin-tuc/tchq-3927-2024

## goi-094 · Ch.82·83·84 · 20 TB

- 3928/TB-TCHQ/2024 · nhóm 82.07 · https://www.tracuuhs.com/tin-tuc/tchq-3928-2024
- 3929/TB-TCHQ/2024 · nhóm 82.07 · https://www.tracuuhs.com/tin-tuc/tchq-3929-2024
- 3930/TB-TCHQ/2024 · nhóm 82.07 · https://www.tracuuhs.com/tin-tuc/tchq-3930-2024
- 1967/TB-TCHQ/2018 · nhóm 82.09 · https://www.tracuuhs.com/tin-tuc/tchq-1967-2018
- 3964/TB-TCHQ/2024 · nhóm 83.02 · https://www.tracuuhs.com/tin-tuc/tchq-3964-2024
- 3965/TB-TCHQ/2024 · nhóm 83.02 · https://www.tracuuhs.com/tin-tuc/tchq-3965-2024
- 3966/TB-TCHQ/2024 · nhóm 83.02 · https://www.tracuuhs.com/tin-tuc/tchq-3966-2024
- 899/TB-TCHQ/2019 · nhóm 83.11 · https://www.tracuuhs.com/tin-tuc/tchq-899-2019
- 900/TB-TCHQ/2019 · nhóm 83.11 · https://www.tracuuhs.com/tin-tuc/tchq-900-2019
- 1825/TB-TCHQ/2022 · nhóm 83.11 · https://www.tracuuhs.com/tin-tuc/tchq-1825-2022
- 3743/TB-TCHQ/2019 · nhóm 83.11 · https://www.tracuuhs.com/tin-tuc/tchq-3743-2019
- 1259/TB-TCHQ/2023 · nhóm 84.08 · https://www.tracuuhs.com/tin-tuc/tchq-1259-2023
- 123/TB-TCHQ/2025 · nhóm 84.09 · https://www.tracuuhs.com/tin-tuc/tchq-123-2025
- 504/TB-TCHQ/2025 · nhóm 84.12 · https://www.tracuuhs.com/tin-tuc/tchq-504-2025
- 869/TB-TCHQ/2025 · nhóm 84.12 · https://www.tracuuhs.com/tin-tuc/tchq-869-2025
- 150/TB-TCHQ/2024 · nhóm 84.14 · https://www.tracuuhs.com/tin-tuc/tchq-150-2024
- 3432/TB-TCHQ/2022 · nhóm 84.14 · https://www.tracuuhs.com/tin-tuc/tchq-3432-2022
- 3433/TB-TCHQ/2022 · nhóm 84.14 · https://www.tracuuhs.com/tin-tuc/tchq-3433-2022
- 4785/TB-TCHQ/2024 · nhóm 84.14 · https://www.tracuuhs.com/tin-tuc/tchq-4785-2024
- 4433/TB-TCHQ/2021 · nhóm 84.19 · https://www.tracuuhs.com/tin-tuc/tchq-4433-2021

## goi-095 · Ch.84 · 20 TB

- 5922/TB-TCHQ/2024 · nhóm 84.23 · https://www.tracuuhs.com/tin-tuc/tchq-5922-2024
- 715/TB-TCHQ/2025 · nhóm 84.24 · https://www.tracuuhs.com/tin-tuc/tchq-715-2025
- 1538/TB-TCHQ/2023 · nhóm 84.28 · https://www.tracuuhs.com/tin-tuc/tchq-1538-2023
- 5950/TB-TCHQ/2024 · nhóm 84.31 · https://www.tracuuhs.com/tin-tuc/tchq-5950-2024
- 5951/TB-TCHQ/2024 · nhóm 84.31 · https://www.tracuuhs.com/tin-tuc/tchq-5951-2024
- 2106/TB-TCHQ/2023 · nhóm 84.43 · https://www.tracuuhs.com/tin-tuc/tchq-2106-2023
- 3270/TB-TCHQ/2018 · nhóm 84.56 · https://www.tracuuhs.com/tin-tuc/tchq-3270-2018
- 2580/TB-TCHQ/2023 · nhóm 84.71 · https://www.tracuuhs.com/tin-tuc/tchq-2580-2023
- 5501/TB-TCHQ/2023 · nhóm 84.71 · https://www.tracuuhs.com/tin-tuc/tchq-5501-2023
- 5666/TB-TCHQ/2022 · nhóm 84.71 · https://www.tracuuhs.com/tin-tuc/tchq-5666-2022
- 437/TB-TCHQ/2025 · nhóm 84.73 · https://www.tracuuhs.com/tin-tuc/tchq-437-2025
- 573/TB-TCHQ/2019 · nhóm 84.73 · https://www.tracuuhs.com/tin-tuc/tchq-573-2019
- 939/TB-TCHQ/2025 · nhóm 84.73 · https://www.tracuuhs.com/tin-tuc/tchq-939-2025
- 940/TB-TCHQ/2025 · nhóm 84.73 · https://www.tracuuhs.com/tin-tuc/tchq-940-2025
- 1909/TB-TCHQ/2018 · nhóm 84.79 · https://www.tracuuhs.com/tin-tuc/tchq-1909-2018
- 2470/TB-TCHQ/2022 · nhóm 84.79 · https://www.tracuuhs.com/tin-tuc/tchq-2470-2022
- 3812/TB-TCHQ/2023 · nhóm 84.79 · https://www.tracuuhs.com/tin-tuc/tchq-3812-2023
- 4708/TB-TCHQ/2024 · nhóm 84.79 · https://www.tracuuhs.com/tin-tuc/tchq-4708-2024
- 701/TB-TCHQ/2019 · nhóm 84.80 · https://www.tracuuhs.com/tin-tuc/tchq-701-2019
- 3582/TB-TCHQ/2022 · nhóm 84.81 · https://www.tracuuhs.com/tin-tuc/tchq-3582-2022

## goi-096 · Ch.84·85 · 20 TB

- 4006/TB-TCHQ/2022 · nhóm 84.81 · https://www.tracuuhs.com/tin-tuc/tchq-4006-2022
- 4164/TB-TCHQ/2024 · nhóm 84.81 · https://www.tracuuhs.com/tin-tuc/tchq-4164-2024
- 5052/TB-TCHQ/2022 · nhóm 84.81 · https://www.tracuuhs.com/tin-tuc/tchq-5052-2022
- 5182/TB-TCHQ/2024 · nhóm 84.81 · https://www.tracuuhs.com/tin-tuc/tchq-5182-2024
- 5973/TB-TCHQ/2024 · nhóm 84.81 · https://www.tracuuhs.com/tin-tuc/tchq-5973-2024
- 6058/TB-TCHQ/2024 · nhóm 84.81 · https://www.tracuuhs.com/tin-tuc/tchq-6058-2024
- 6059/TB-TCHQ/2024 · nhóm 84.81 · https://www.tracuuhs.com/tin-tuc/tchq-6059-2024
- 3024/TB-TCHQ/2022 · nhóm 84.83 · https://www.tracuuhs.com/tin-tuc/tchq-3024-2022
- 3025/TB-TCHQ/2022 · nhóm 84.83 · https://www.tracuuhs.com/tin-tuc/tchq-3025-2022
- 3026/TB-TCHQ/2022 · nhóm 84.83 · https://www.tracuuhs.com/tin-tuc/tchq-3026-2022
- 3027/TB-TCHQ/2022 · nhóm 84.83 · https://www.tracuuhs.com/tin-tuc/tchq-3027-2022
- 3028/TB-TCHQ/2022 · nhóm 84.83 · https://www.tracuuhs.com/tin-tuc/tchq-3028-2022
- 3029/TB-TCHQ/2022 · nhóm 84.83 · https://www.tracuuhs.com/tin-tuc/tchq-3029-2022
- 3030/TB-TCHQ/2022 · nhóm 84.83 · https://www.tracuuhs.com/tin-tuc/tchq-3030-2022
- 4283/TB-TCHQ/2023 · nhóm 84.83 · https://www.tracuuhs.com/tin-tuc/tchq-4283-2023
- 4284/TB-TCHQ/2023 · nhóm 84.83 · https://www.tracuuhs.com/tin-tuc/tchq-4284-2023
- 3398/TB-TCHQ/2024 · nhóm 84.84 · https://www.tracuuhs.com/tin-tuc/tchq-3398-2024
- 3609/TB-TCHQ/2024 · nhóm 85.01 · https://www.tracuuhs.com/tin-tuc/tchq-3609-2024
- 556/TB-TCHQ/2018 · nhóm 85.04 · https://www.tracuuhs.com/tin-tuc/tchq-556-2018
- 1055/TB-TCHQ/2018 · nhóm 85.04 · https://www.tracuuhs.com/tin-tuc/tchq-1055-2018

## goi-097 · Ch.85 · 20 TB

- 1056/TB-TCHQ/2018 · nhóm 85.04 · https://www.tracuuhs.com/tin-tuc/tchq-1056-2018
- 1907/TB-TCHQ/2018 · nhóm 85.04 · https://www.tracuuhs.com/tin-tuc/tchq-1907-2018
- 1908/TB-TCHQ/2018 · nhóm 85.04 · https://www.tracuuhs.com/tin-tuc/tchq-1908-2018
- 2307/TB-TCHQ/2024 · nhóm 85.04 · https://www.tracuuhs.com/tin-tuc/tchq-2307-2024
- 3219/TB-TCHQ/2023 · nhóm 85.04 · https://www.tracuuhs.com/tin-tuc/tchq-3219-2023
- 3331/TB-TCHQ/2022 · nhóm 85.04 · https://www.tracuuhs.com/tin-tuc/tchq-3331-2022
- 3333/TB-TCHQ/2022 · nhóm 85.04 · https://www.tracuuhs.com/tin-tuc/tchq-3333-2022
- 3633/TB-TCHQ/2022 · nhóm 85.04 · https://www.tracuuhs.com/tin-tuc/tchq-3633-2022
- 7626/TB-TCHQ/2018 · nhóm 85.04 · https://www.tracuuhs.com/tin-tuc/tchq-7626-2018
- 7627/TB-TCHQ/2018 · nhóm 85.04 · https://www.tracuuhs.com/tin-tuc/tchq-7627-2018
- 4143/TB-TCHQ/2018 · nhóm 85.07 · https://www.tracuuhs.com/tin-tuc/tchq-4143-2018
- 6312/TB-TCHQ/2020 · nhóm 85.09 · https://www.tracuuhs.com/tin-tuc/tchq-6312-2020
- 6211/TB-TCHQ/2018 · nhóm 85.11 · https://www.tracuuhs.com/tin-tuc/tchq-6211-2018
- 278/TB-TCHQ/2025 · nhóm 85.14 · https://www.tracuuhs.com/tin-tuc/tchq-278-2025
- 1906/TB-TCHQ/2018 · nhóm 85.14 · https://www.tracuuhs.com/tin-tuc/tchq-1906-2018
- 5341/TB-TCHQ/2022 · nhóm 85.16 · https://www.tracuuhs.com/tin-tuc/tchq-5341-2022
- 5342/TB-TCHQ/2022 · nhóm 85.16 · https://www.tracuuhs.com/tin-tuc/tchq-5342-2022
- 51/TB-TCHQ/2024 · nhóm 85.17 · https://www.tracuuhs.com/tin-tuc/tchq-51-2024
- 1915/TB-TCHQ/2022 · nhóm 85.17 · https://www.tracuuhs.com/tin-tuc/tchq-1915-2022
- 1979/TB-TCHQ/2018 · nhóm 85.17 · https://www.tracuuhs.com/tin-tuc/tchq-1979-2018

## goi-098 · Ch.85 · 20 TB

- 2395/TB-TCHQ/2022 · nhóm 85.17 · https://www.tracuuhs.com/tin-tuc/tchq-2395-2022
- 6440/TB-TCHQ/2024 · nhóm 85.17 · https://www.tracuuhs.com/tin-tuc/tchq-6440-2024
- 6441/TB-TCHQ/2024 · nhóm 85.17 · https://www.tracuuhs.com/tin-tuc/tchq-6441-2024
- 6442/TB-TCHQ/2024 · nhóm 85.17 · https://www.tracuuhs.com/tin-tuc/tchq-6442-2024
- 6443/TB-TCHQ/2024 · nhóm 85.17 · https://www.tracuuhs.com/tin-tuc/tchq-6443-2024
- 6444/TB-TCHQ/2024 · nhóm 85.17 · https://www.tracuuhs.com/tin-tuc/tchq-6444-2024
- 2491/TB-TCHQ/2022 · nhóm 85.18 · https://www.tracuuhs.com/tin-tuc/tchq-2491-2022
- 6108/TB-TCHQ/2018 · nhóm 85.23 · https://www.tracuuhs.com/tin-tuc/tchq-6108-2018
- 214/TB-TCHQ/2023 · nhóm 85.24 · https://www.tracuuhs.com/tin-tuc/tchq-214-2023
- 215/TB-TCHQ/2023 · nhóm 85.24 · https://www.tracuuhs.com/tin-tuc/tchq-215-2023
- 971/TB-TCHQ/2024 · nhóm 85.24 · https://www.tracuuhs.com/tin-tuc/tchq-971-2024
- 238/TB-TCHQ/2022 · nhóm 85.25 · https://www.tracuuhs.com/tin-tuc/tchq-238-2022
- 491/TB-TCHQ/2022 · nhóm 85.25 · https://www.tracuuhs.com/tin-tuc/tchq-491-2022
- 2978/TB-TCHQ/2018 · nhóm 85.26 · https://www.tracuuhs.com/tin-tuc/tchq-2978-2018
- 477/TB-TCHQ/2025 · nhóm 85.28 · https://www.tracuuhs.com/tin-tuc/tchq-477-2025
- 535/TB-TCHQ/2025 · nhóm 85.29 · https://www.tracuuhs.com/tin-tuc/tchq-535-2025
- 7389/TB-TCHQ/2018 · nhóm 85.31 · https://www.tracuuhs.com/tin-tuc/tchq-7389-2018
- 878/TB-TCHQ/2025 · nhóm 85.33 · https://www.tracuuhs.com/tin-tuc/tchq-878-2025
- 879/TB-TCHQ/2025 · nhóm 85.33 · https://www.tracuuhs.com/tin-tuc/tchq-879-2025
- 206/TB-TCHQ/2018 · nhóm 85.36 · https://www.tracuuhs.com/tin-tuc/tchq-206-2018

## goi-099 · Ch.85 · 20 TB

- 299/TB-TCHQ/2025 · nhóm 85.36 · https://www.tracuuhs.com/tin-tuc/tchq-299-2025
- 306/TB-TCHQ/2025 · nhóm 85.36 · https://www.tracuuhs.com/tin-tuc/tchq-306-2025
- 3055/TB-TCHQ/2018 · nhóm 85.36 · https://www.tracuuhs.com/tin-tuc/tchq-3055-2018
- 3056/TB-TCHQ/2018 · nhóm 85.36 · https://www.tracuuhs.com/tin-tuc/tchq-3056-2018
- 3057/TB-TCHQ/2018 · nhóm 85.36 · https://www.tracuuhs.com/tin-tuc/tchq-3057-2018
- 3205/TB-TCHQ/2018 · nhóm 85.36 · https://www.tracuuhs.com/tin-tuc/tchq-3205-2018
- 3206/TB-TCHQ/2018 · nhóm 85.36 · https://www.tracuuhs.com/tin-tuc/tchq-3206-2018
- 4709/TB-TCHQ/2021 · nhóm 85.36 · https://www.tracuuhs.com/tin-tuc/tchq-4709-2021
- 1159/TB-TCHQ/2022 · nhóm 85.37 · https://www.tracuuhs.com/tin-tuc/tchq-1159-2022
- 4040/TB-TCHQ/2022 · nhóm 85.37 · https://www.tracuuhs.com/tin-tuc/tchq-4040-2022
- 4800/TB-TCHQ/2021 · nhóm 85.37 · https://www.tracuuhs.com/tin-tuc/tchq-4800-2021
- 4978/TB-TCHQ/2023 · nhóm 85.37 · https://www.tracuuhs.com/tin-tuc/tchq-4978-2023
- 752/TB-TCHQ/2019 · nhóm 85.39 · https://www.tracuuhs.com/tin-tuc/tchq-752-2019
- 505/TB-TCHQ/2018 · nhóm 85.43 · https://www.tracuuhs.com/tin-tuc/tchq-505-2018
- 1127/TB-TCHQ/2024 · nhóm 85.43 · https://www.tracuuhs.com/tin-tuc/tchq-1127-2024
- 1777/TB-TCHQ/2018 · nhóm 85.43 · https://www.tracuuhs.com/tin-tuc/tchq-1777-2018
- 2392/TB-TCHQ/2024 · nhóm 85.43 · https://www.tracuuhs.com/tin-tuc/tchq-2392-2024
- 4056/TB-TCHQ/2022 · nhóm 85.43 · https://www.tracuuhs.com/tin-tuc/tchq-4056-2022
- 4205/TB-TCHQ/2018 · nhóm 85.43 · https://www.tracuuhs.com/tin-tuc/tchq-4205-2018
- 524/TB-TCHQ/2019 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-524-2019

## goi-100 · Ch.85 · 20 TB

- 551/TB-TCHQ/2019 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-551-2019
- 567/TB-TCHQ/2019 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-567-2019
- 702/TB-TCHQ/2019 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-702-2019
- 751/TB-TCHQ/2019 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-751-2019
- 953/TB-TCHQ/2024 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-953-2024
- 1376/TB-TCHQ/2018 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-1376-2018
- 1709/TB-TCHQ/2022 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-1709-2022
- 1710/TB-TCHQ/2022 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-1710-2022
- 1711/TB-TCHQ/2022 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-1711-2022
- 1985/TB-TCHQ/2019 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-1985-2019
- 2040/TB-TCHQ/2018 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-2040-2018
- 2043/TB-TCHQ/2018 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-2043-2018
- 2076/TB-TCHQ/2018 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-2076-2018
- 2485/TB-TCHQ/2018 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-2485-2018
- 2486/TB-TCHQ/2018 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-2486-2018
- 3028/TB-TCHQ/2018 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-3028-2018
- 3029/TB-TCHQ/2018 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-3029-2018
- 4033/TB-TCHQ/2023 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-4033-2023
- 5342/TB-TCHQ/2023 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-5342-2023
- 7457/TB-TCHQ/2018 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-7457-2018

## goi-101 · Ch.85·87·89·90 · 20 TB

- 7458/TB-TCHQ/2018 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-7458-2018
- 7459/TB-TCHQ/2018 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-7459-2018
- 7460/TB-TCHQ/2018 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-7460-2018
- 7461/TB-TCHQ/2018 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-7461-2018
- 7462/TB-TCHQ/2018 · nhóm 85.44 · https://www.tracuuhs.com/tin-tuc/tchq-7462-2018
- 700/TB-TCHQ/2019 · nhóm 85.45 · https://www.tracuuhs.com/tin-tuc/tchq-700-2019
- 4589/TB-TCHQ/2023 · nhóm 87.04 · https://www.tracuuhs.com/tin-tuc/tchq-4589-2023
- 4967/TB-TCHQ/2026 · nhóm 87.04 · https://www.tracuuhs.com/tin-tuc/tchq-4967-2026
- 5737/TB-TCHQ/2023 · nhóm 87.05 · https://www.tracuuhs.com/tin-tuc/tchq-5737-2023
- 1008/TB-TCHQ/2020 · nhóm 87.08 · https://www.tracuuhs.com/tin-tuc/tchq-1008-2020
- 1009/TB-TCHQ/2020 · nhóm 87.08 · https://www.tracuuhs.com/tin-tuc/tchq-1009-2020
- 3988/TB-TCHQ/2019 · nhóm 87.08 · https://www.tracuuhs.com/tin-tuc/tchq-3988-2019
- 4168/TB-TCHQ/2019 · nhóm 87.08 · https://www.tracuuhs.com/tin-tuc/tchq-4168-2019
- 4967/TB-TCHQ/2024 · nhóm 87.09 · https://www.tracuuhs.com/tin-tuc/tchq-4967-2024
- 1952/TB-TCHQ/2024 · nhóm 89.05 · https://www.tracuuhs.com/tin-tuc/tchq-1952-2024
- 1712/TB-TCHQ/2022 · nhóm 90.02 · https://www.tracuuhs.com/tin-tuc/tchq-1712-2022
- 4842/TB-TCHQ/2018 · nhóm 90.18 · https://www.tracuuhs.com/tin-tuc/tchq-4842-2018
- 7165/TB-TCHQ/2018 · nhóm 90.18 · https://www.tracuuhs.com/tin-tuc/tchq-7165-2018
- 1776/TB-TCHQ/2018 · nhóm 90.19 · https://www.tracuuhs.com/tin-tuc/tchq-1776-2018
- 3818/TB-TCHQ/2021 · nhóm 90.19 · https://www.tracuuhs.com/tin-tuc/tchq-3818-2021

## goi-102 · Ch.90·91·94·95·96 · 20 TB

- 3819/TB-TCHQ/2021 · nhóm 90.19 · https://www.tracuuhs.com/tin-tuc/tchq-3819-2021
- 4418/TB-TCHQ/2022 · nhóm 90.19 · https://www.tracuuhs.com/tin-tuc/tchq-4418-2022
- 4419/TB-TCHQ/2022 · nhóm 90.19 · https://www.tracuuhs.com/tin-tuc/tchq-4419-2022
- 4420/TB-TCHQ/2022 · nhóm 90.19 · https://www.tracuuhs.com/tin-tuc/tchq-4420-2022
- 7274/TB-TCHQ/2018 · nhóm 90.27 · https://www.tracuuhs.com/tin-tuc/tchq-7274-2018
- 681/TB-TCHQ/2024 · nhóm 90.31 · https://www.tracuuhs.com/tin-tuc/tchq-681-2024
- 4615/TB-TCHQ/2024 · nhóm 90.31 · https://www.tracuuhs.com/tin-tuc/tchq-4615-2024
- 2411/TB-TCHQ/2018 · nhóm 90.33 · https://www.tracuuhs.com/tin-tuc/tchq-2411-2018
- 4706/TB-TCHQ/2024 · nhóm 91.02 · https://www.tracuuhs.com/tin-tuc/tchq-4706-2024
- 1093/TB-TCHQ/2020 · nhóm 94.01 · https://www.tracuuhs.com/tin-tuc/tchq-1093-2020
- 3739/TB-TCHQ/2022 · nhóm 94.03 · https://www.tracuuhs.com/tin-tuc/tchq-3739-2022
- 3741/TB-TCHQ/2022 · nhóm 94.03 · https://www.tracuuhs.com/tin-tuc/tchq-3741-2022
- 5628/TB-TCHQ/2023 · nhóm 94.03 · https://www.tracuuhs.com/tin-tuc/tchq-5628-2023
- 252/TB-TCHQ/2021 · nhóm 94.05 · https://www.tracuuhs.com/tin-tuc/tchq-252-2021
- 866/TB-TCHQ/2019 · nhóm 94.05 · https://www.tracuuhs.com/tin-tuc/tchq-866-2019
- 2551/TB-TCHQ/2018 · nhóm 94.05 · https://www.tracuuhs.com/tin-tuc/tchq-2551-2018
- 6132/TB-TCHQ/2024 · nhóm 94.05 · https://www.tracuuhs.com/tin-tuc/tchq-6132-2024
- 5875/TB-TCHQ/2024 · nhóm 95.03 · https://www.tracuuhs.com/tin-tuc/tchq-5875-2024
- 954/TB-TCHQ/2019 · nhóm 96.01 · https://www.tracuuhs.com/tin-tuc/tchq-954-2019
- 3831/TB-TCHQ/2019 · nhóm 96.03 · https://www.tracuuhs.com/tin-tuc/tchq-3831-2019

## goi-103 · Ch.96 · 3 TB

- 3839/TB-TCHQ/2019 · nhóm 96.03 · https://www.tracuuhs.com/tin-tuc/tchq-3839-2019
- 4142/TB-TCHQ/2018 · nhóm 96.03 · https://www.tracuuhs.com/tin-tuc/tchq-4142-2018
- 4144/TB-TCHQ/2018 · nhóm 96.03 · https://www.tracuuhs.com/tin-tuc/tchq-4144-2018

## Xử lý tay (từ các lô đã gộp) — 15 mục

- 170/TB-TCHQ/2024 → 38249999: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "COPPER GLEAM™ HVS-202A (J); Dung dịch Copper Gleam HVS-202A (J)" _(nguồn: BAO-CAO-lot-01.md)_
- 2131/TB-TCHQ/2024 → 38249970: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Polyglycitol Syrup ESWEE 30; Phụ gia thực phẩm Polyglicitol Syrup" _(nguồn: BAO-CAO-lot-01.md)_
- 3246/TB-TCHQ/2024 → 85177999: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Khối thu phát RRU5502N (Bộ phận thiết bị trạm gốc thông tin di động UMTS/LTE FDD" _(nguồn: BAO-CAO-lot-01.md)_
- 3348/TB-TCHQ/2024 → 39076910: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Hạt nhựa PET tái sinh.; Hạt nhựa PET tái sinh." _(nguồn: BAO-CAO-lot-01.md)_
- 3349/TB-TCHQ/2024 → 38170000: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "BARREL FREEZE; Dầu máy lạnh Alkyl Benzen." _(nguồn: BAO-CAO-lot-01.md)_
- 3408/TB-TCHQ/2024 → 38170000: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "BARREL FREEZE; Dầu máy lạnh Alkyl Benzen." _(nguồn: BAO-CAO-lot-01.md)_
- 3594/TB-TCHQ/2024 → 39119000: không chọn được description đạt (dài/có tên nhóm biểu thuế) — ứng viên đầu: 1000HNX hardener; Chất làm cứng — "1000HNX hardener; Chất làm cứng" _(nguồn: BAO-CAO-lot-01.md)_
- 3818/TB-TCHQ/2022 → 39123100: không chọn được description đạt (dài/có tên nhóm biểu thuế) — ứng viên đầu: CEKOL 30000 A; CEKOL 30000 A — "CEKOL 30000 A; CEKOL 30000 A" _(nguồn: BAO-CAO-lot-01.md)_
- 4360/TB-TCHQ/2023 → 38249970: không chọn được description đạt (dài/có tên nhóm biểu thuế) — ứng viên đầu: TF-210; Phụ gia dùng trong thực phẩm — "TF-210; Phụ gia dùng trong thực phẩm" _(nguồn: BAO-CAO-lot-01.md)_
- 4467/TB-TCHQ/2023 → 38121000: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Atnen SAT-150 (tác nhân liên kết ngang cao su); Atnen SAT-150 (tác nhân liên kết" _(nguồn: BAO-CAO-lot-01.md)_
- 4475/TB-TCHQ/2024 → 85177921: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "SHIELD-RF;SM-A546,C7521,SILVER; Miếng bảo vệ bản mạch của điện thoại di động." _(nguồn: BAO-CAO-lot-01.md)_
- 4777/TB-TCHQ/2024 → 85437090: không chọn được description đạt (dài/có tên nhóm biểu thuế) — ứng viên đầu: Rô bốt dẫn đường.; Rô bốt dẫn đường. — "Rô bốt dẫn đường.; Rô bốt dẫn đường." _(nguồn: BAO-CAO-lot-01.md)_
- 5295/TB-TCHQ/2023 → 39199092: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "Hot melt adhensive film; Màng keo nóng chảy tự dính" _(nguồn: BAO-CAO-lot-01.md)_
- 5439/TB-TCHQ/2022 → 38140000: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "REDUCER E; Dung môi pha loãng mực kháng hàn và mực hồng ngoại (1 lọ = 1kg). Hàng" _(nguồn: BAO-CAO-lot-01.md)_
- 620/TB-TCHQ/2025 → 85371099: reasonVi mỏng/cụt, toàn văn cũng không rút được chuỗi kết luận — "LS Programmable Logic Controller; Thiết bị điều khiển lập trình" _(nguồn: BAO-CAO-lot-01.md)_
