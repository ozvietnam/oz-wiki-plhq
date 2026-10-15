# Luồng 12 — Tiền lệ quốc tế & Made-in-China: crawl, kiểm chứng, đóng gói lô gửi hs-code-api

Kế hoạch bước 12 bên hs-code-api (`docs/backlog/12-tien-le-quoc-te-dinh-danh-hang-mic.md`, PR #299)
mở 2 nhóm nguồn mới: **tiền lệ phân loại quốc tế** (CBP Mỹ, ABF Úc, EU BTI…) và **dữ kiện sản phẩm
Made-in-China**. Luồng này là bản nối hai đầu bên wiki: crawl về, kiểm chứng nguồn, đóng gói lô đúng
chuẩn rồi gửi sang kho hs-code-api — cùng khuôn [Luồng 11](luong-tb-tchq.md).

> **Phân vai không đụng nhau:** hs-code-api giữ schema + merge + index + API; wiki giữ crawler +
> kiểm chứng nguồn + đóng gói + bảng license. **WCO OP/EN + SEN KHÔNG được crawl/re-host ở wiki**
> (bản quyền WCO đã trả phí, chỉ nằm hs-code-api — quyết định 13/10).

## Đầu vào → đầu ra

| | Ở đâu |
|---|---|
| Đầu vào | nguồn quốc tế + trang sản phẩm MiC (bảng dưới) |
| Tool đóng gói | `node tools/dong-goi-lo-quoc-te.mjs` + `node tools/dong-goi-lo-mic.mjs` (**cần dựng** — cùng khuôn `dong-goi-lo-tb-tchq.mjs`) |
| Đầu ra | `data/customs/lo-quoc-te/<nguồn>-<ngày>-lot-NN.json` + `data/customs/lo-mic/mic-<ngày>-lot-NN.json` (+ báo cáo NNN) |
| Đích | `data/community/intl-precedents/` và `data/community/mic-products/` bên hs-code-api → `merge-community.mjs` |

## Bảng nguồn & license (cập nhật mỗi lô)

| Nguồn | Loại | Giá trị pháp lý | License khi re-host | Công thức fetch (kiểm chứng 15/10) |
|---|---|---|---|---|
| CBP CROSS (Mỹ) | ruling phân loại | ràng buộc hải quan Mỹ; tham khảo mạnh | **public domain** | `GET rulings.cbp.gov/api/ruling/{ID}` (UA browser, Accept json) → `{text}` toàn văn; web là SPA đừng bóc HTML |
| ABF TCO (Úc) | tariff concession (mã do người đề xuất, ABF duyệt) | thực tiễn hành chính — **không phải phán quyết phân loại**, ghi rõ tính chất này khi hiển thị | Commonwealth copyright — **bắt buộc attribution** | `tariffconcessionorders.aspx?tcn={mã6}` qua headless server-side (WebFetch 403) |
| EU BTI | binding tariff info | ràng buộc EU 3 năm — mạnh nhất nhóm tham khảo | **rà điều khoản tái sử dụng trước khi mirror** | giao diện DDS2 chống bot — fetcher riêng, khảo sát trước |
| WCO OP/EN | ý kiến phân loại / diễn giải | cao nhất | ❌ chỉ nằm hs-code-api, wiki KHÔNG re-host | (không crawl ở wiki) |
| Made-in-China | trang cửa người bán | **dữ kiện kỹ thuật + HS 10 số người bán tự khai = tín hiệu, không phải bằng chứng** | dữ kiện số liệu không SHTT; KHÔNG sao gallery/mô tả dài | port `src/lib/capture/made-in-china.ts` từ repo **ozsource** (đã có `extractMadeInChina()` + `hsCodeHint`, thuần, test bằng fixture) |

## Luật đóng gói (mở rộng luật Luồng 11)

1. **Nguyên văn + vân tay:** mỗi bản ghi quốc tế giữ `verbatimText` (toàn văn/tóm tắt nguyên văn),
   `snapshotHash`, `retrievedAt`, `license`, `nguonUrl`. Pháp lý XNK: trích sai một chữ là sai nghĩa —
   thà thiếu còn hơn sửa.
2. **Mức kiểm chứng:** `xacMinh: NGUON_A` (đã mở lại nguồn gốc tự động) / `NGUON_B` (corroboration
   công khai, vd janronconsult.com cho WCO OP) / `CHUA` — hiển thị kèm khi hs-code-api phục vụ.
3. **MiC chỉ giữ trường dữ kiện:** `title, specs[], hsCodeHint, price, minOrderQty, skuId, shop,
   urlNguon, retrievedAt`. Không gallery, không mô tả dài. Tôn trọng robots.txt + giới hạn QPS.
4. **Tín hiệu ≠ bằng chứng:** `hsCodeHint` của MiC và mã trong TCO ghi rõ là `signal`; chỉ TB-TCHQ,
   WCO OP, BTI, phán quyết là evidence được dẫn khi chốt mã (điều kiện bất biến CEO 14/10).
5. Lô MiC **không chứa thông tin khách hàng Oz** (chỉ sản phẩm công khai của bên bán TQ).

## Các bước

1. **Chọn nguồn theo nhu cầu**: ưu tiên theo `demand-signals` bên hs-code-api (nhóm HS hay tra, dòng
   "Loại khác" nhiều) — đừng cào tràn lan như bài học 103 gói TB (97,6% trùng).
2. **Crawl đêm + lịch sự** (rate limit, robots); lưu thô vào `data/customs/raw-quoc-te/` và
   `data/customs/raw-mic/`.
3. **Đóng gói** bằng 2 tool trên; tool tự băm snapshot + gắn license theo bảng nguồn.
4. **Kiểm bằng `validate-community.mjs` của hs-code-api (0 lỗi mới đi tiếp)** — luật sắt không-merge-khi-đỏ.
5. **PR sang hs-code-api**: 1 lô ≤500 bản ghi, 1 PR; đổi số đếm mã có tiền lệ → chạy `sync-doc-counts`.

## Xong khi

- PR bên hs-code-api xanh CI và được gộp; `/api/precedents` trả được kết quả tiền lệ quốc tế theo
  truy vấn mô tả chức năng tiếng Anh (case đối chiếu: "glove box gas purification" phải ra WCO
  8421.39/1 + CBP M82907 + ABF TCO 1679759).
- Bảng license ở trên khớp thực tế từng lô đã gửi.

## Cho agent

Dùng skill `/tb-tchq-lo` làm khuôn, thay đầu vào/đầu ra theo bảng trên. Tool đóng gói chưa có —
thẻ đầu tiên của luồng này là dựng tool theo khuôn `dong-goi-lo-tb-tchq.mjs`.
