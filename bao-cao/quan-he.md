# Quan hệ cũ – mới giữa các văn bản — 2026-10-04

Mũi tên đi từ văn bản MỚI tới văn bản bị tác động. Sinh tự động bằng `node tools/dung.mjs`.

## Chưa phân loại — chờ luồng Hệ thống hoá xếp vào cây

```mermaid
flowchart LR
  n_07_2023_TT_NHNN["07/2023/TT-NHNN<br/>còn hiệu lực"]
  n_38_2018_TT_NHNN["38/2018/TT-NHNN<br/>chưa xác minh"]
  n_11_2024_TT_BTTTT["11/2024/TT-BTTTT<br/>còn hiệu lực"]
  n_22_2018_TT_BTTTT["22/2018/TT-BTTTT<br/>còn hiệu lực"]
  n_07_2023_TT_NHNN -->|sửa đổi| n_38_2018_TT_NHNN
  n_11_2024_TT_BTTTT -->|sửa đổi| n_22_2018_TT_BTTTT
```

## Hải quan — luật, thủ tục, kiểm tra giám sát

```mermaid
flowchart LR
  n_336_2026_N__CP["336/2026/NĐ-CP<br/>chưa có hiệu lực"]
  n_85_2019_N__CP["85/2019/NĐ-CP<br/>còn hiệu lực"]
  n_39_2018_TT_BTC["39/2018/TT-BTC<br/>còn hiệu lực"]
  n_38_2015_TT_BTC["38/2015/TT-BTC<br/>còn hiệu lực"]
  n_59_2018_N__CP["59/2018/NĐ-CP<br/>còn hiệu lực"]
  n_08_2015_N__CP["08/2015/NĐ-CP<br/>còn hiệu lực"]
  n_60_2019_TT_BTC["60/2019/TT-BTC<br/>còn hiệu lực"]
  n_39_2015_TT_BTC["39/2015/TT-BTC<br/>còn hiệu lực"]
  n_336_2026_N__CP -->|thay thế từ 2026-10-15| n_85_2019_N__CP
  n_39_2018_TT_BTC -->|sửa đổi| n_38_2015_TT_BTC
  n_59_2018_N__CP -->|sửa đổi| n_08_2015_N__CP
  n_60_2019_TT_BTC -->|sửa đổi| n_39_2015_TT_BTC
```

## Kiểm tra chuyên ngành (chất lượng, ATTP, kiểm dịch)

```mermaid
flowchart LR
  n_01_2021_TT_BL_TBXH["01/2021/TT-BLĐTBXH<br/>chưa xác minh"]
  n_22_2018_TT_BL_TBXH["22/2018/TT-BLĐTBXH<br/>hết hiệu lực"]
  n_09_2026_NQ_CP["09/2026/NQ-CP<br/>còn hiệu lực"]
  n_46_2026_N__CP["46/2026/NĐ-CP<br/>tạm ngưng"]
  n_111_2021_N__CP["111/2021/NĐ-CP<br/>hết hiệu lực"]
  n_43_2017_N__CP["43/2017/NĐ-CP<br/>hết hiệu lực"]
  n_113_2017_N__CP["113/2017/NĐ-CP<br/>hết hiệu lực"]
  n_108_2008_N__CP["108/2008/NĐ-CP<br/>hết hiệu lực"]
  n_26_2011_N__CP["26/2011/NĐ-CP<br/>hết hiệu lực"]
  n_15_2026_NQ_CP["15/2026/NQ-CP<br/>còn hiệu lực"]
  n_17_2023_TT_BNNPTNT["17/2023/TT-BNNPTNT<br/>còn hiệu lực"]
  n_924_Q__BNN_TCLN["924/QĐ-BNN-TCLN<br/>hết hiệu lực"]
  n_24_2026_TT_BYT["24/2026/TT-BYT<br/>còn hiệu lực"]
  n_05_2022_TT_BYT["05/2022/TT-BYT<br/>còn hiệu lực"]
  n_26_2026_N__CP["26/2026/NĐ-CP<br/>còn hiệu lực"]
  n_82_2022_N__CP["82/2022/NĐ-CP<br/>hết hiệu lực"]
  n_28_2026_TT_BCT["28/2026/TT-BCT<br/>còn hiệu lực"]
  n_11_2022_TT_BCT["11/2022/TT-BCT<br/>chưa xác minh"]
  n_1182_Q__BCT["1182/QĐ-BCT<br/>hết hiệu lực"]
  n_29_2025_TT_BKHCN["29/2025/TT-BKHCN<br/>chưa xác minh"]
  n_2711_Q__BKHCN["2711/QĐ-BKHCN<br/>chưa xác minh"]
  n_33_2026_TT_BCT["33/2026/TT-BCT<br/>còn hiệu lực"]
  n_41_2023_TT_BCT["41/2023/TT-BCT<br/>hết hiệu lực"]
  n_36_2026_TT_BKHCN["36/2026/TT-BKHCN<br/>còn hiệu lực"]
  n_10_2024_TT_BKHCN["10/2024/TT-BKHCN<br/>hết hiệu lực"]
  n_01_2009_TT_BKHCN["01/2009/TT-BKHCN<br/>hết hiệu lực"]
  n_366_Q__BKHCN["366/QĐ-BKHCN<br/>chưa xác minh"]
  n_367_Q__BKHCN["367/QĐ-BKHCN<br/>chưa xác minh"]
  n_37_2026_N__CP["37/2026/NĐ-CP<br/>còn hiệu lực"]
  n_132_2008_N__CP["132/2008/NĐ-CP<br/>hết hiệu lực"]
  n_74_2018_N__CP["74/2018/NĐ-CP<br/>hết hiệu lực"]
  n_154_2018_N__CP["154/2018/NĐ-CP<br/>hết hiệu lực một phần"]
  n_13_2022_N__CP["13/2022/NĐ-CP<br/>hết hiệu lực"]
  n_41_2026_TT_BXD["41/2026/TT-BXD<br/>còn hiệu lực"]
  n_10_2024_TT_BXD["10/2024/TT-BXD<br/>hết hiệu lực"]
  n_15_2018_N__CP["15/2018/NĐ-CP<br/>còn hiệu lực"]
  n_49_2026_TT_BXD["49/2026/TT-BXD<br/>còn hiệu lực"]
  n_12_2022_TT_BGTVT["12/2022/TT-BGTVT<br/>hết hiệu lực"]
  n_62_2024_TT_BGTVT["62/2024/TT-BGTVT<br/>hết hiệu lực"]
  n_78_2025_QH15["78/2025/QH15<br/>còn hiệu lực"]
  n_05_2007_QH12["05/2007/QH12<br/>còn hiệu lực"]
  n_01_2021_TT_BL_TBXH -->|thay thế từ 2021-07-18| n_22_2018_TT_BL_TBXH
  n_09_2026_NQ_CP -->|tạm ngưng| n_46_2026_N__CP
  n_111_2021_N__CP -->|sửa đổi| n_43_2017_N__CP
  n_113_2017_N__CP -->|thay thế từ 2017-11-25| n_108_2008_N__CP
  n_113_2017_N__CP -->|thay thế từ 2017-11-25| n_26_2011_N__CP
  n_15_2026_NQ_CP -->|tạm ngưng| n_46_2026_N__CP
  n_17_2023_TT_BNNPTNT -->|bãi bỏ từ 2024-01-30| n_924_Q__BNN_TCLN
  n_24_2026_TT_BYT -->|sửa đổi| n_05_2022_TT_BYT
  n_26_2026_N__CP -->|thay thế từ 2026-01-17| n_113_2017_N__CP
  n_26_2026_N__CP -->|thay thế từ 2026-01-17| n_82_2022_N__CP
  n_28_2026_TT_BCT -->|thay thế| n_11_2022_TT_BCT
  n_28_2026_TT_BCT -->|bãi bỏ từ 2026-07-17| n_1182_Q__BCT
  n_29_2025_TT_BKHCN -->|thay thế phần sản phẩm CNTT – viễn thông| n_2711_Q__BKHCN
  n_33_2026_TT_BCT -->|thay thế| n_41_2023_TT_BCT
  n_36_2026_TT_BKHCN -->|thay thế| n_10_2024_TT_BKHCN
  n_36_2026_TT_BKHCN -->|bãi bỏ| n_01_2009_TT_BKHCN
  n_366_Q__BKHCN -->|sửa đổi| n_2711_Q__BKHCN
  n_367_Q__BKHCN -->|sửa đổi| n_2711_Q__BKHCN
  n_37_2026_N__CP -->|bãi bỏ từ 2026-07-01| n_132_2008_N__CP
  n_37_2026_N__CP -->|bãi bỏ từ 2026-07-01| n_74_2018_N__CP
  n_37_2026_N__CP -->|bãi bỏ Điều 4 từ 2026-07-01| n_154_2018_N__CP
  n_37_2026_N__CP -->|bãi bỏ từ 2026-07-01| n_13_2022_N__CP
  n_37_2026_N__CP -->|bãi bỏ từ 2026-01-23| n_43_2017_N__CP
  n_37_2026_N__CP -->|bãi bỏ từ 2026-01-23| n_111_2021_N__CP
  n_41_2026_TT_BXD -->|thay thế| n_10_2024_TT_BXD
  n_46_2026_N__CP -->|thay thế| n_15_2018_N__CP
  n_49_2026_TT_BXD -->|thay thế| n_12_2022_TT_BGTVT
  n_49_2026_TT_BXD -->|thay thế| n_62_2024_TT_BGTVT
  n_62_2024_TT_BGTVT -->|sửa đổi| n_12_2022_TT_BGTVT
  n_78_2025_QH15 -->|sửa đổi| n_05_2007_QH12
  n_82_2022_N__CP -->|sửa đổi| n_113_2017_N__CP
```

## Phân loại hàng hoá (mã HS)

```mermaid
flowchart LR
  n_17_2021_TT_BTC["17/2021/TT-BTC<br/>còn hiệu lực"]
  n_14_2015_TT_BTC["14/2015/TT-BTC<br/>còn hiệu lực"]
  n_17_2021_TT_BTC -->|sửa đổi| n_14_2015_TT_BTC
```

## Phòng vệ thương mại (chống bán phá giá, chống trợ cấp, tự vệ)

```mermaid
flowchart LR
  n_121_Q__BCT["121/QĐ-BCT<br/>chưa xác minh"]
  n_2491_Q__BCT["2491/QĐ-BCT<br/>hết hiệu lực"]
  n_1400_Q__BCT["1400/QĐ-BCT<br/>chưa xác minh"]
  n_2093_Q__BCT["2093/QĐ-BCT<br/>hết hiệu lực"]
  n_2174_Q__BCT["2174/QĐ-BCT<br/>chưa xác minh"]
  n_2333_Q__BCT["2333/QĐ-BCT<br/>hết hiệu lực"]
  n_915_Q__BCT["915/QĐ-BCT<br/>chưa xác minh"]
  n_1978_Q__BCT["1978/QĐ-BCT<br/>hết hiệu lực"]
  n_121_Q__BCT -->|thay thế| n_2491_Q__BCT
  n_1400_Q__BCT -->|thay thế| n_2093_Q__BCT
  n_2174_Q__BCT -->|thay thế| n_2333_Q__BCT
  n_915_Q__BCT -->|thay thế| n_1978_Q__BCT
```

## Quản lý ngoại thương

```mermaid
flowchart LR
  n_07_2026_TT_BCT["07/2026/TT-BCT<br/>còn hiệu lực"]
  n_37_2013_TT_BCT["37/2013/TT-BCT<br/>còn hiệu lực"]
  n_11_2018_TT_BTTTT["11/2018/TT-BTTTT<br/>còn hiệu lực"]
  n_31_2015_TT_BTTTT["31/2015/TT-BTTTT<br/>chưa xác minh"]
  n_11_2026_TT_BXD["11/2026/TT-BXD<br/>chưa xác minh"]
  n_04_2021_TT_BXD["04/2021/TT-BXD<br/>hết hiệu lực"]
  n_12_2018_TT_BCT["12/2018/TT-BCT<br/>hết hiệu lực một phần"]
  n_04_2014_TT_BCT["04/2014/TT-BCT<br/>hết hiệu lực"]
  n_11_2017_TT_BCT["11/2017/TT-BCT<br/>hết hiệu lực"]
  n_49_2015_TT_BCT["49/2015/TT-BCT<br/>hết hiệu lực"]
  n_48_2026_TT_BCT["48/2026/TT-BCT<br/>còn hiệu lực"]
  n_08_2023_TT_BCT["08/2023/TT-BCT<br/>còn hiệu lực"]
  n_41_2019_TT_BCT["41/2019/TT-BCT<br/>còn hiệu lực"]
  n_42_2019_TT_BCT["42/2019/TT-BCT<br/>còn hiệu lực"]
  n_07_2026_TT_BCT -->|sửa đổi| n_37_2013_TT_BCT
  n_11_2018_TT_BTTTT -->|sửa đổi Điều 3 và Phụ lục số 01 từ 2018-11-30| n_31_2015_TT_BTTTT
  n_11_2026_TT_BXD -->|thay thế từ 2026-06-01| n_04_2021_TT_BXD
  n_12_2018_TT_BCT -->|bãi bỏ từ 2018-06-15| n_04_2014_TT_BCT
  n_12_2018_TT_BCT -->|bãi bỏ từ 2018-06-15| n_11_2017_TT_BCT
  n_12_2018_TT_BCT -->|bãi bỏ từ 2018-06-15| n_49_2015_TT_BCT
  n_48_2026_TT_BCT -->|bãi bỏ từ 2026-09-05| n_12_2018_TT_BCT
  n_48_2026_TT_BCT -->|bãi bỏ khoản 1 Điều 1 và Phụ lục I (Phụ lục I còn thực hiện chuyển tiếp đến 31-12-2026 — Điều 21 khoản 3) từ 2026-09-05| n_08_2023_TT_BCT
  n_48_2026_TT_BCT -->|bãi bỏ Điều 3 và Phụ lục III từ 2026-09-05| n_41_2019_TT_BCT
  n_48_2026_TT_BCT -->|bãi bỏ Điều 25 từ 2026-09-05| n_42_2019_TT_BCT
```

## Thuế xuất khẩu, nhập khẩu và các thuế khác khâu nhập khẩu

```mermaid
flowchart LR
  n_18_2021_N__CP["18/2021/NĐ-CP<br/>còn hiệu lực"]
  n_134_2016_N__CP["134/2016/NĐ-CP<br/>còn hiệu lực"]
  n_182_2025_N__CP["182/2025/NĐ-CP<br/>còn hiệu lực"]
  n_18_2021_N__CP -->|sửa đổi| n_134_2016_N__CP
  n_182_2025_N__CP -->|sửa đổi| n_134_2016_N__CP
```

## Xuất xứ hàng hoá và các hiệp định thương mại tự do

```mermaid
flowchart LR
  n_126_Q__TTg["126/QĐ-TTg<br/>còn hiệu lực"]
  n_1175_Q__TTg["1175/QĐ-TTg<br/>hết hiệu lực"]
  n_127_Q__TTg["127/QĐ-TTg<br/>còn hiệu lực"]
  n_734_Q__TTg["734/QĐ-TTg<br/>hết hiệu lực"]
  n_126_Q__TTg -->|thay thế từ 2026-01-16| n_1175_Q__TTg
  n_127_Q__TTg -->|thay thế từ 2026-01-16| n_734_Q__TTg
```

