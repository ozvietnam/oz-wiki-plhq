# Lược đồ bảng danh mục mã HS (`danh-muc/*.csv`)

Lớp thứ hai của thư viện, sau "văn bản còn hiệu lực không": **mã HS nào chịu văn bản nào**.

Nhiều văn bản quản lý hàng hoá có phụ lục liệt kê mã HS. Ví dụ là danh mục kiểm tra chuyên ngành 2026 của
các bộ, danh mục cấm, danh mục giấy phép và quyết định phòng vệ thương mại. Trích đúng bảng phụ lục ra là
có ngay quan hệ mã ↔ văn bản cho hàng nghìn mã. Không cần dò từng mã trong biểu thuế.

## Ba tầng ảnh hưởng

| Tầng | Văn bản | Lưu ở đâu | Độ tin |
|---|---|---|---|
| 1. Trực tiếp có mã HS | Danh mục kèm mã HS (KTCN, cấm, giấy phép, phòng vệ thương mại, biểu thuế) | `danh-muc/<slug>.csv` (tài liệu này) | Cao: trích nguyên văn phụ lục |
| 2. Theo mô tả, không ghi mã | "hàng đã qua sử dụng", "pin lithium", "tiền chất Danh mục IV"… | [`danh-muc/chinh-sach-mo-ta.yaml`](../danh-muc/chinh-sach-mo-ta.yaml) (`tools/lib/chinh-sach-mo-ta.mjs` → `dist/chinh-sach-mo-ta.json`) | Vừa (`VUA_SUY_RA`): suy ra theo mô tả, phải ghi rõ & đối chiếu nguồn bậc A |
| 3. Đề cập, hướng dẫn | Thông báo phân loại, công văn | Chưa làm | Tham khảo |

## Tệp bảng

Mỗi văn bản có một tệp `danh-muc/<slug>.csv`, với `<slug>` trùng tên tệp YAML trong `registry/van-ban/`.
Tệp mã hoá UTF-8, có dòng tiêu đề, dùng dấu phẩy và ngoặc kép theo RFC 4180. Các cột theo đúng thứ tự:

| Cột | Bắt buộc | Nội dung |
|---|---|---|
| `ma_hs` | có, trừ dòng dẫn chiếu | 4, 6 hoặc 8 chữ số, **không dấu chấm**. Ô in nhiều mã thì tách mỗi mã một dòng, giữ nguyên `mo_ta` |
| `mo_ta` | có | Mô tả hàng **nguyên văn** trong phụ lục (gom khoảng trắng, tối đa ~300 ký tự). Bắt buộc không rỗng; **không được bắt đầu bằng dấu `-`** (dòng con phải ghép ngữ cảnh nhóm cha bằng dấu `: `); **không để `"Loại khác"` cộc lốc** thiếu ngữ cảnh nhóm cha; **số dấu ngoặc đơn mở `(` và đóng `)` phải cân bằng** (`kiemDinhDang` chặn PR nếu vi phạm) |
| `nhom` | | Số thứ tự hoặc nhóm như in trong phụ lục (`I.2`, `3`, `Chương 22`) |
| `phu_luc` | | `Phụ lục I`, `Phụ lục II`…; phụ lục không đánh số thì ghi `Phụ lục` |
| `loai_tac_dong` | có | `KIEM_TRA_ATTP`, `KIEM_TRA_CHAT_LUONG`, `KIEM_DICH_DONG_VAT`, `KIEM_DICH_THUC_VAT`, `GIAY_PHEP`, `CAM_NHAP_KHAU`, `CAM_XUAT_KHAU`, `CONG_BO_HOP_QUY`, `DANG_KY_LUU_HANH`, `PHONG_VE_THUONG_MAI`, `CAT_GIAM_KIEM_TRA` (danh mục hàng **được bỏ** kiểm tra — không phải nghĩa vụ), `KHAC` |
| `muc_rui_ro` | | `CAO`, `TRUNG_BINH`, `THAP`, nếu phụ lục ghi (khung NĐ 37/2026) |
| `dieu_kien` | | Giới hạn phạm vi in kèm dòng, ví dụ "trừ loại…", "chỉ áp dụng với…", ký hiệu "ex". Để trống nghĩa là **toàn bộ** mã |
| `dan_chieu` | | Số hiệu văn bản khác chứa mã HS khi dòng **không ghi mã** mà dẫn sang. Ví dụ: 27/2026/TT-BYT ghi "Mã HS: theo 15/2024/TT-BYT". **Không được ghi mã quy chuẩn `QCVN...` vào `dan_chieu`** (QCVN phải đặt ở `dieu_kien`; `dan_chieu` chỉ ghi số hiệu văn bản pháp luật để tránh sinh điểm mù giả `DAN_CHIEU_CHUA_CO_BANG`) |
| `trang` | | Số trang (bắt đầu từ 1) trong bản PDF ghi ở `danh_muc_hs.nguon` |

**Đọc kỹ tên văn bản trước khi chọn `loai_tac_dong`:** danh mục "đã qua sử dụng cấm nhập khẩu" thì mọi dòng phải có
`dieu_kien` "chỉ hàng đã qua sử dụng"; danh mục "đã được cắt giảm kiểm tra" là `CAT_GIAM_KIEM_TRA`, không phải `KIEM_TRA_*`;
danh mục chỉ để đối chiếu mã HS (không đặt nghĩa vụ) là `KHAC` kèm `dieu_kien` giải thích. Ghi sai loại thì ứng dụng báo
nghĩa vụ ngược với văn bản.

Mã 4 hoặc 6 số áp cho mọi dòng thuế 8 số bắt đầu bằng mã đó, trừ khi `dieu_kien` thu hẹp lại.
**Không tự bung ra 8 số.** Ứng dụng tự khớp theo tiền tố, và phải hiện `dieu_kien` cho người khai.

## Khai trong sổ

Thêm trường `danh_muc_hs` vào YAML của văn bản:

```yaml
danh_muc_hs:
  tep: danh-muc/28-2026-tt-bct.csv
  nguon: https://congbaocdn.chinhphu.vn/...pdf   # bản CÓ phụ lục đã dùng để trích (ưu tiên Công báo có lớp chữ)
  trich_boi: cursor-agent@ozvietnam
  ngay: '2026-10-04'
  da_doi_chieu: false   # true khi người/agent thứ hai đã soát từng dòng với bản gốc
  ghi_chu: phụ lục từ trang 5; 3 ô gộp đã tách
```

## Cách làm một bảng

1. **Tìm bản có phụ lục.** Bản trên datafiles.chinhphu.vn thường chỉ có phần chính, hoặc là ảnh quét.
   Bản Công báo thì có cả phụ lục và có lớp chữ:
   - trang Công báo tra theo số ID: `https://congbao.chinhphu.vn/van-ban/x-<id>.htm` tự chuyển tới trang thật;
   - PDF nằm trên `congbaocdn.chinhphu.vn`.
2. **Trích bảng bằng máy** từ lớp chữ. Không gõ lại, không đoán mã. Bản chỉ có ảnh quét thì ghi vào
   `ghi_chu` và để lại cho người hoặc agent có OCR.
3. **Kiểm:**
   - `npm test` kiểm định dạng; sai thì chặn PR.
   - `npm run diem-mu` đối chiếu từng mã với biểu thuế trong `nhu-cau/bieu-thue.json`, là bản chụp từ
     hs-code-api. Mã không tồn tại sẽ hiện thành điểm mù `HS_KHONG_TON_TAI`.
4. **Ghi vào PR:**
   - URL bản đã dùng và trang bắt đầu phụ lục;
   - số dòng và số mã;
   - 10 dòng mẫu đặt cạnh nguyên văn trích ra;
   - các ô gộp hoặc chú thích đã xử lý thế nào.

## Điểm mù liên quan (`tools/diem-mu.mjs`)

| Mã | Ý nghĩa |
|---|---|
| `DANH_MUC_CHUA_TRICH` | Văn bản danh mục (tên có "danh mục", thuộc nhánh KTCN, ngoại thương hoặc phòng vệ thương mại) chưa có bảng. Mức Cao nếu là danh mục KTCN có hiệu lực từ 01/7/2026 trở đi, hoặc được biểu thuế dẫn từ 50 mã. **Không** áp dụng cho văn bản chỉ bãi bỏ (tên bắt đầu "Bãi bỏ…", vd 4814/QĐ-BCA), phụ lục tách riêng đã khai `phu_luc_cua` trỏ mẹ đã có CSV, văn bản có phụ lục danh mục đã bị văn bản khác thay toàn bộ (`danh_muc_thay_boi` trỏ văn bản đã có `danh_muc_hs`, vd 13/2018/TT-BTTTT ← 10/2022/TT-BTTTT), hoặc văn bản danh mục mà bản gốc bậc A chỉ quy định theo mô tả / mã CAS không gắn mã HS (`danh_muc_khong_ma_hs`, bắt buộc `xac_minh.muc: NGUON_A`, vd 14/2024/TT-BNNPTNT, 28/2026/NĐ-CP, 09/2013/TT-BTTTT) |
| `HS_KHONG_TON_TAI` | Mã trong bảng không có trong biểu thuế: lỗi trích, mã của biểu thuế cũ, hoặc bản chụp biểu thuế chưa cập nhật |
| `DAN_CHIEU_CHUA_CO_BANG` | Bảng dẫn mã sang văn bản chưa có bảng, hoặc văn bản chưa có trong sổ |

## Quy tắc nội suy mã khi Phụ lục dẫn chiếu (học từ TT 27/2026/TT-BYT, 10/2026)

Từ 01/7/2026 các bộ ban hành danh mục rủi ro theo NĐ 37/2026/NĐ-CP. Nhiều Phụ lục
**không in mã HS** mà ghi cột "Mã HS — theo quy định tại TT \<cũ của bộ\> và
31/2022/TT-BTC". Nạp kiểu dán nguyên phụ lục với `ma_hs` trống làm **cả lớp văn bản
chết** — không dòng chính sách nào hiện với bất kỳ mã nào (ca thật: TT 27/2026/TT-BYT
từ khi nạp đến 30/10 chưa từng đỏ mã nào).

Quy trình khi gặp danh mục dẫn chiếu:

1. **Đọc nguyên văn toàn Phụ lục** (bản text/OCR), liệt kê đủ số nhóm + QCVN gắn
   từng nhóm + yêu cầu quản lý (đăng ký lưu hành / công bố hợp quy / tự công bố).
2. **Lần theo từng nhánh dẫn chiếu**: mã có trong bảng của TT cũ cùng bộ → chép
   nguyên dòng; không có (vd nhóm dinhdưỡng trẻ em, nước đóng chai không nằm trong
   15/2024) → lấy theo **danh mục hàng hóa XNK 31/2022/TT-BTC** bằng cách đối chiếu
   tên lá biểu thuế, ghi `dan_chieu` đúng nguồn từng dòng.
3. **Ghi phủ định đích danh**: nhóm KHÔNG thuộc danh mục ghi rõ vào `ghi_chu` bản
   ghi kèm dẫn chứng đã đọc nguyên văn (vd: thủy tinh/gốm sứ tráng men QCVN 12-4
   KHÔNG thuộc rủi ro trung bình BYT từ 01/7/2026) — để không ai "bổ sung cho đủ"
   theo luật cũ về sau.
4. **Đánh dấu phần chưa giải được xong** (`da_doi_chieu` phản ánh đúng phạm vi đã
   làm) và theo dõi nốt bằng lần sau — không để TODO mờ trong CSV.

Case lưu vẹn: PR #281 + #282 (19 mã, 8/8 nhóm TT 27/2026; đính chính thủy tinh).

## Tầng 2: Chính sách quản lý theo mô tả (`danh-muc/chinh-sach-mo-ta.yaml`)

Lớp bổ trợ cho những nhóm hàng mà văn bản không liệt kê đầy đủ mã HS hoặc nghĩa vụ phụ thuộc tình trạng/loại hình lô hàng ("đã qua sử dụng", "pin lithium", "hóa chất & tiền chất Danh mục IV", "bao bì tiếp xúc trực tiếp thực phẩm", "12 nhóm làm thủ tục tại cửa khẩu nhập", "ghi nhãn hàng hóa", "gia công / SXXK / miễn thuế"…).

- **Ranh giới tuyệt đối 0% trùng lặp với `hs-code-api`:** Tầng 2 **chỉ gợi ý chính sách quản lý chuyên ngành theo mô tả; không áp mã HS, không chạy 6 quy tắc GIR, không tính thuế suất**. Kho **không** xuất `chu-giai-hs.json` hay `chu-giai-chuong.json` ra `dist/`.
- **Tệp nguồn:** [`danh-muc/chinh-sach-mo-ta.yaml`](../danh-muc/chinh-sach-mo-ta.yaml), đọc và kiểm chuẩn bằng [`tools/lib/chinh-sach-mo-ta.mjs`](../tools/lib/chinh-sach-mo-ta.mjs) (`docChinhSachMoTa()`, `kiemChinhSachMoTa()`, `dungChinhSachMoTa()`).
- **Lược đồ mỗi quy tắc trong `quy_tac[]`:**
  - `id` (slug duy nhất), `ten`, `nhom_hang`, `tu_khoa_nhan_dien[]` (≥ 3 từ khóa tiếng Việt không rỗng);
  - `loai_tac_dong` (thuộc 12 giá trị `LOAI_TAC_DONG` trong `tools/lib/danh-muc.mjs`);
  - `do_tin: VUA_SUY_RA` (bắt buộc — mọi suy luận Tầng 2 chỉ để tham khảo, không thay thế đối chiếu văn bản gốc);
  - `can_cu_so_hieu[]` (mọi số hiệu bắt buộc tồn tại trong `registry/van-ban/`, kiểm qua `so.theoKhoa`);
  - `nghia_vu_tom_tat`, `luu_y_loai_tru` (nêu rõ trường hợp loại trừ và trạng thái thực tế của văn bản hết/tạm ngưng hiệu lực như `43/2017/NĐ-CP`, `111/2021/NĐ-CP`), `ranh_gioi_hs_api`.
- **Từ điển viết tắt PLHQ (`TU_DIEN_VIET_TAT_PLHQ`):** 25 thuật ngữ viết tắt chuẩn XNK/PLHQ (`gtgt`, `ktcn`, `attp`, `cbpg`, `pvtm`, `co`, `xnk`, `hq`, `ttdb`, `bvmt`, `tntx`, `dncx`, `qlrr`, `kstq`, `gcn`, `qcvn`, `tcvn`, `vbhn`, `vphc`, `mfn`, `acfta`, `evfta`, `rcep`, `kd`, `ktcl`) xuất kèm trong tệp máy thứ 8 `dist/chinh-sach-mo-ta.json`.

## Dùng ở đâu

`npm run dung` xuất `dist/hs-index.json` và `dist/hs-index-theo-ma.json`, gồm mỗi văn bản kèm tình trạng hiệu lực và các dòng bảng.
[hs-code-api](https://github.com/ozvietnam/hs-code-api) đồng bộ dữ liệu kho này, và `/api/tax?hs=…` trả về danh sách
văn bản danh mục chứa mã đó, kèm `dieu_kien` và mức khớp: đúng 8 số hay theo nhóm 4 hoặc 6 số.
Từ Wave 8 (`1.5.0` cộng thêm), `dungChiMucTheoMa` hỗ trợ trường tuỳ chọn `anh_xa_ahtn_cu` (nối từ [`registry/phien-ban-bieu-thue-mapping.yaml`](../registry/phien-ban-bieu-thue-mapping.yaml) sang mã EN2022 trong `bieu-thue.json` cho các mã nằm trong `canh_bao_ma` — chỉ để tham khảo đối chiếu lại văn bản gốc), và `dungChinhSachMoTa` dựng đối tượng cho tệp thứ 8 `dist/chinh-sach-mo-ta.json`.

Giấy phép **CC BY 4.0** — chuỗi ghi nguồn chuẩn thống nhất theo W4 ([`docs/tich-hop.md`](tich-hop.md)):

> Nguồn: oz-wiki-plhq — https://github.com/ozvietnam/oz-wiki-plhq (CC BY 4.0, bản `phien_ban`). Đã rút gọn và đổi nhãn hiển thị.

## Lịch sử lược đồ (tệp máy)

`dist/hs-index.json`, `dist/hs-index-theo-ma.json` và tệp thứ 8 `dist/chinh-sach-mo-ta.json` mang `luoc_do_phien_ban` (semver, chung một hằng số `LUOC_DO_PHIEN_BAN` với `dist/registry.json` trong
`tools/lib/registry.mjs`). Quy ước tăng phiên bản như [lược đồ sổ đăng ký](luoc-do-so-dang-ky.md#lịch-sử-lược-đồ-tệp-máy):
phá vỡ → major, thêm trường/giá trị liệt kê không phá bên đọc → minor. Bên ánh xạ `loai_tac_dong` sang nhãn
tiếng Việt kiểm dòng dưới đây trước khi cập nhật nhãn.

| Phiên bản | Ngày | Đổi gì |
|---|---|---|
| 1.0.0 | 2026-10-13 | Phiên bản đầu: cấu trúc như hiện tại; thêm `luoc_do_phien_ban` (yêu cầu tích hợp [docs/yeu-cau/ozplugin.md](yeu-cau/ozplugin.md) W1) |
| 1.1.0 | 2026-10-13 | Thêm tệp mới `dist/hs-index-theo-ma.json` (nhóm mã HS → văn bản, đảo chiều của `hs-index.json`); cấu trúc hai tệp cũ không đổi — minor theo quy ước W1 |
| 1.2.0 | 2026-10-13 | `hs-index-theo-ma.json`: thêm `bieu_thue_doi_chieu` + `canh_bao_ma` (nhóm mã ngoài biểu thuế), `tien_le_tb_tchq` (mật độ TB-TCHQ theo mã 8 số / nhóm 4 số), `tong_canh`; gộp cạnh trùng toàn trường (13.543 → 9.900) |
| 1.3.0 | 2026-10-14 | Không đổi cấu trúc chỉ mục HS; số semver chung tăng theo sổ (thêm `loai_phan_loai*` tuỳ chọn trên TB-TCHQ) |
| 1.4.0 | 2026-11-14 | Thêm trường `phu_luc_cua` trên sổ để không báo điểm mù trùng bảng CSV với văn bản mẹ; cấu trúc tệp chỉ mục HS không đổi — minor |
| 1.5.0 | 2026-11-21 | Mở rộng gói `1.5.0` cho Cổng MCP (`wiki-index.json`, `wiki-chunks.json`, `dieu-khoan.json`, `cas-index.json`). Cộng thêm Wave 8 (không phá major `1.x`, giữ `LUOC_DO_PHIEN_BAN = '1.5.0'`, không thêm `chu-giai-hs`/`chu-giai-chuong`): thêm trường tuỳ chọn `anh_xa_ahtn_cu` trong `dist/hs-index-theo-ma.json` và lược đồ tệp thứ 8 `dist/chinh-sach-mo-ta.json` (`danh-muc/chinh-sach-mo-ta.yaml`, `TU_DIEN_VIET_TAT_PLHQ` 25 viết tắt) |
