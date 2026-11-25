# Cổng MCP & CLI tra cứu pháp luật hải quan (`oz-wiki-plhq`)

Kho **`oz-wiki-plhq`** cung cấp sẵn hai đường tra cứu tại máy (**0 dependency ngoài mới**, thuần Node.js `>= 20`, dùng trực tiếp gói dữ liệu máy lược đồ `1.6.0` trong `dist/` hoặc tự dựng in-memory từ `registry/`, `wiki/`, `danh-muc/`, `data/sua-doi-dieu/`, `data/doc-hieu/` khi chưa có `dist/`):

1. **MCP Stdio Server (`npm run mcp:server`):** máy chủ [Model Context Protocol](https://modelcontextprotocol.io/) chạy giao thức JSON-RPC 2.0 qua `stdin`/`stdout` cho **Claude Desktop**, **Antigravity**, **Cursor**, **Cổng MCP `ozplugin`** và các agent tương thích.
2. **CLI tra cứu (`npm run tra-cuu`):** công cụ dòng lệnh cho người làm xuất nhập khẩu, kỹ sư và script tự động.

> **Kiến trúc & lược đồ dữ liệu:** Xem [docs/SO-DO-HE-THONG.md](SO-DO-HE-THONG.md) và [docs/tich-hop.md](tich-hop.md) để nắm chi tiết gói **8 tệp** `dist/*.json` (`1.6.0`) và hợp đồng trường ổn định *(engine `tools/lib/tra-cuu-plhq.mjs` nạp 6 tệp cốt lõi phục vụ tra cứu: `registry.json`, `hs-index-theo-ma.json`, `wiki-index.json`, `wiki-chunks.json`, `dieu-khoan.json`, `cas-index.json`, hoặc tự dựng in-memory khi thiếu `dist/`)*.

---

## Ranh giới 0% trùng lặp với `hs-code-api`

Cả MCP server và CLI đều khóa cứng ranh giới giữa hai hệ thống:

| Miền | `oz-wiki-plhq` (MCP & CLI này phụ trách) | `hs-code-api` (ngoài phạm vi — chuyển hướng) |
|---|---|---|
| **Hiệu lực & quan hệ VBQPPL** | Tra `tinh_trang`, ngày hiệu lực/hết hiệu lực, quan hệ cũ–mới, nguồn bậc A (`registry/`) | Tiêu thụ bản chụp `dist/registry.json` |
| **Điều khoản pháp lý** | Điều khoản nguyên văn bậc A (`NGUYEN_VAN_NGUON_A`) và tóm tắt định vị (`TOM_TAT_NHAP`) | Kiểm tra đối chiếu căn cứ pháp lý trong API |
| **Wiki nghiệp vụ PLHQ** | Tóm tắt thủ tục, KTCN, quản lý chuyên ngành có gắn cờ cảnh báo hiệu lực | Không lưu wiki nghiệp vụ |
| **Hóa chất CAS & chính sách theo HS đã biết** | Tra mã CAS NĐ `24/2026/NĐ-CP` và liệt kê văn bản chính sách theo tiền tố mã HS **đã biết** | Không tự sinh hay đoán mã HS mới |
| **Phân loại mã HS, GIR, thuế suất, tiền lệ** | **KHÔNG làm.** Bộ lọc `laYeuCauThuocHsCodeApi` tự động phát hiện và trả chỉ dẫn chuyển sang `hs-code-api` *(vẫn trả lời bình thường các câu hỏi về thủ tục hành chính như xác định trước mã số hay khung văn bản `85/2026/TT-BTC`)* | Phân loại mã HS theo 6 quy tắc GIR, chú giải HS WCO / AHTN SEN, tính thuế suất biểu thuế (`/api/tax`) và tiền lệ phân loại (`/api/precedents`) |

---

## Yêu cầu chuẩn bị tại máy

```bash
git clone https://github.com/ozvietnam/oz-wiki-plhq.git
cd oz-wiki-plhq
npm install
```

- **Node.js `>= 20`** (`package.json` khai báo `"engines": { "node": ">=20" }`).
- Kho có sẵn dữ liệu trong `registry/`, `wiki/`, `danh-muc/`, `data/sua-doi-dieu/`, `data/doc-hieu/`. Để tốc độ nạp nhanh nhất trên MCP server và CLI, nên dựng sẵn gói `dist/` (`1.6.0`):

```bash
npm run dung
```

*(Nếu thư mục `dist/` chưa tồn tại hoặc chưa đủ tệp, cả `mcp-server.mjs` và `tra-cuu.mjs` vẫn hoạt động bình thường nhờ cơ chế tự nạp `registry/` và dựng chỉ mục trong RAM.)*

---

## Đường 1 — MCP Stdio Server (`npm run mcp:server`)

Tệp thực thi: [`tools/mcp-server.mjs`](../tools/mcp-server.mjs) (chạy trực tiếp bằng `node tools/mcp-server.mjs` hoặc `npm run mcp:server`).

- **Giao thức:** JSON-RPC 2.0 trên `stdio`, tương thích chuẩn MCP (`2024-11-05` / `2025-03-26`), hỗ trợ `initialize`, `notifications/initialized`, `ping`, `tools/list`, `tools/call`, `resources/list`, `resources/read`.
- **Đóng khung vận chuyển (stdio framing):** tự nhận diện và trả lời đúng theo định dạng client gửi — hỗ trợ cả **newline-delimited JSON** (`{...}\n`, chuẩn MCP stdio hiện hành) lẫn **`Content-Length: N\r\n\r\n<body>`** (chuẩn header LSP/MCP).
- **Chế độ an toàn:** toàn bộ 6 tool đều gắn `readOnlyHint: true`, chỉ đọc dữ liệu cục bộ, không sửa tệp và không gọi mạng ra ngoài.
- **Tùy chọn CLI của server:** hỗ trợ `--dist <thư_mục>` và `--root <thư_mục>` nếu cần trỏ tới bản chụp `dist/` hoặc bản sao kho ở vị trí khác.

### Bảng 6 MCP Tools

| Tên tool | Tham số | Chức năng & quy tắc đầu ra |
|---|---|---|
| `plhq_tra_hieu_luc` | `so_hieu` *(bắt buộc)*, `tai_ngay?` *(YYYY-MM-DD)* | Tra cứu tình trạng hiệu lực hiện tại (và tại ngày `tai_ngay` qua `tinh_trang_tai_ngay`, `do_chinh_xac_ngay`), ngày ban hành/hiệu lực/hết hiệu lực, `quan_he` chiều đi & `quan_he_nguoc`, URL nguồn bậc A (`nguon_bac_a`) và cờ `xac_minh.hieu_luc_da_doi_chieu`. |
| `plhq_tra_dieu_khoan` | `so_hieu?`, `dieu?`, `khoan?`, `diem?`, `tu_khoa?`, `chi_nguyen_van?`, `tai_ngay?`, `limit?` | Tra điều khoản tách tuyệt đối **2 tầng** (`NGUYEN_VAN_NGUON_A` vs `TOM_TAT_NHAP`), kèm `trang_thai_dieu`, `lich_su_tac_dong[]`, `canh_bao_sua_doi` và `dieu_khoan_sua_doi_lien_quan` (lọc đúng theo mốc `tai_ngay` nếu truyền). |
| `plhq_hoi_phap_luat` | `cau_hoi` *(bắt buộc)*, `nhanh?`, `tai_ngay?`, `limit?` | Xếp hạng lai ghép (BM25 thuần Node + viết tắt + ưu tiên văn bản thay thế lên trên `HET_HIEU_LUC`), tách 2 tuyến `ket_qua` (hiện hành) vs `sap_co_hieu_luc` (`CHUA_CO_HIEU_LUC`), có cổng ngoài phạm vi (`ngoai_pham_vi: true` + `do_tin_cay_tra_loi: "KHONG_TIM_THAY"`) và tự động chuyển hướng `hs-code-api` cho bài toán áp mã HS/GIR/thuế suất. |
| `plhq_tra_cas` | `query` *(bắt buộc)*, `phu_luc?`, `limit?` | Tra hóa chất trong danh mục NĐ `24/2026/NĐ-CP` (`cas-index.json`) theo mã CAS, tên chất (`ten_chat`), tên khoa học/mã hóa chất (`ma_hoa_chat`) hoặc công thức (`cong_thuc`), lọc tùy chọn `phu_luc` (`I`..`IV`), tìm cả mục `khong_co_cas`, trả đủ mọi phụ lục mà chất thuộc về kèm ngưỡng `nguong_kg` (nếu có). |
| `plhq_chinh_sach_theo_hs` | `ma_hs` *(bắt buộc)*, `tai_ngay?`, `limit?` | Tra cứu theo tiền tố mã HS 4/6/8 số **đã biết** trên `hs-index-theo-ma.json` để liệt kê văn bản KTCN/cấm/giấy phép/PVTM (lọc/đánh giá hiệu lực tại `tai_ngay` nếu truyền) kèm cảnh báo `canh_bao_ma` & `anh_xa_ahtn_cu`. Không dùng để áp mã HS mới (việc của `hs-code-api`). |
| `plhq_sap_het_hieu_luc` | `trong_so_ngay?`, `hom_nay?` | Liệt kê các văn bản có `het_hieu_luc_tu` trong vòng `<= trong_so_ngay` ngày (mặc định `60` ngày) tính từ `hom_nay` (mặc định theo ngày `phien_ban` dữ liệu hoặc ngày hiện tại), sắp tăng dần theo ngày hết hiệu lực. |

Mỗi lời gọi `tools/call` đều trả đồng thời:
- `content`: văn bản tiếng Việt có cấu trúc, kèm sẵn chuỗi ghi nguồn CC BY 4.0 và câu miễn trừ pháp lý.
- `structuredContent`: đối tượng JSON có cấu trúc để agent/ứng dụng đọc lập trình chính xác.

### Bảng 3 MCP Resources

| URI resource | MIME type | Nội dung trả về |
|---|---|---|
| `plhq://meta/luoc-do` | `application/json` | Metadata phiên bản lược đồ (`1.6.0`), ngày `phien_ban`, thống kê 2 tầng điều khoản, `thong_ke.sua_doi_cap_dieu`, cờ năng lực `tinh_nang_ozplugin` (`ho_tro_tai_ngay`, `hai_tuyen_sap_co_hieu_luc`, `do_thi_sua_doi_cap_dieu`, `cong_ngoai_pham_vi`), CC BY 4.0 và ranh giới `hs-code-api`. |
| `plhq://bao-cao/sap-het-hieu-luc` | `application/json` | Danh sách JSON các văn bản sắp hết hiệu lực trong vòng `<= 60` ngày để client chủ động rà soát trước khi áp dụng. |
| `plhq://huong-dan/quy-trinh-agent` | `text/markdown` | Quy trình thao tác chuẩn cho AI Agent & `ozplugin`: dùng `tai_ngay`, quy trình 2 bước `NGUYEN_VAN_NGUON_A`, xử lý `trang_thai_dieu`, 2 tuyến `sap_co_hieu_luc`, cổng OOS và ranh giới `hs-code-api`. |

### Cấu hình JSON mẫu (copy-paste cho Claude Desktop / Cursor / Antigravity)

Thay `/duong/dan/toi/oz-wiki-plhq` bằng đường dẫn tuyệt đối tới thư mục kho trên máy của bạn:

```json
{
  "mcpServers": {
    "oz-wiki-plhq": {
      "command": "node",
      "args": ["/duong/dan/toi/oz-wiki-plhq/tools/mcp-server.mjs"]
    }
  }
}
```

Gợi ý vị trí đặt cấu hình theo từng công cụ:
- **Claude Desktop:** thêm mục `"oz-wiki-plhq"` vào khóa `"mcpServers"` trong tệp `claude_desktop_config.json`.
- **Cursor:** thêm vào `.cursor/mcp.json` trong project hoặc cấu hình MCP toàn cục của Cursor.
- **Antigravity / `ozplugin`:** khai báo mục `"oz-wiki-plhq"` trong cấu hình MCP server của workspace hoặc `mcp_config.json` (có thể thêm `"--dist", "/duong/dan/khac"` vào `args` nếu dùng bản chụp `dist/` đặt riêng).

> Sau khi lưu cấu hình và tải lại MCP client, hỏi thử agent: *"Kiểm tra giúp tôi Thông tư 38/2015/TT-BTC còn hiệu lực không và hóa chất CAS 106-99-0 thuộc phụ lục nào của NĐ 24/2026/NĐ-CP?"*

---

## Đường 2 — CLI tra cứu nhanh (`npm run tra-cuu`)

Tệp thực thi: [`tools/tra-cuu.mjs`](../tools/tra-cuu.mjs). Có thể gọi trực tiếp bằng `node tools/tra-cuu.mjs ...` hoặc qua npm (`npm run tra-cuu -- ...`).

### Các lệnh con & cờ tùy chọn

| Lệnh con | Tham số & cờ | Mục đích |
|---|---|---|
| `hieu-luc <so_hieu>` | `--so-hieu <so_hieu>`, `--tai-ngay <YYYY-MM-DD>`, `--json` | Tra tình trạng hiệu lực hiện tại hoặc tại ngày `tai_ngay`, quan hệ cũ–mới và link nguồn bậc A |
| `dieu-khoan [<so_hieu>]` | `--so-hieu <so_hieu>`, `--dieu <N>`, `--khoan <N>`, `--diem <ký_tự>`, `--tu-khoa "<từ>"`, `--nguyen-van`, `--tai-ngay <YYYY-MM-DD>`, `--limit <N>`, `--json` | Tra điều khoản pháp luật (ưu tiên `NGUYEN_VAN_NGUON_A`, gắn `trang_thai_dieu` & `lich_su_tac_dong` lọc theo `--tai-ngay`) |
| `hoi "<cau_hoi>"` | `--nhanh <nhánh>`, `--tai-ngay <YYYY-MM-DD>`, `--limit <N>`, `--json` | Hỏi đáp nghiệp vụ PLHQ trên wiki + điều khoản bậc A (BM25 + 2 tuyến + cổng OOS, tự chuyển hướng khi hỏi áp mã HS/thuế suất) |
| `cas "<query>"` | `--phu-luc <I\|II\|III\|IV>`, `--limit <N>`, `--json` | Tra hóa chất NĐ `24/2026/NĐ-CP` theo mã CAS, tên chất hoặc công thức (có thể lọc riêng `--phu-luc`) |
| `chinh-sach <ma_hs>` | `--tai-ngay <YYYY-MM-DD>`, `--limit <N>`, `--json` | Tra văn bản KTCN / giấy phép / cấm theo mã HS đã biết (lọc hiệu lực theo `--tai-ngay`) |
| `sap-het-hieu-luc` | `--ngay <số_ngày>` *(hoặc `--trong-so-ngay`)*, `--hom-nay <YYYY-MM-DD>`, `--limit <N>`, `--json` | Liệt kê văn bản sắp hết hiệu lực trong `N` ngày tới (mặc định `60`) |

Cờ dùng chung cho mọi lệnh con: `--tai-ngay <YYYY-MM-DD>`, `--json`, `--limit <N>`, `--dist <thư_mục>`, `--root <thư_mục>`, `-h` / `--help`.

### Ví dụ chạy trực tiếp bằng `node tools/tra-cuu.mjs`

```bash
# 1. Tra hiệu lực văn bản và chuỗi sửa đổi/thay thế
node tools/tra-cuu.mjs hieu-luc "38/2015/TT-BTC"

# 2. Tra nguyên văn điều khoản bậc A (lọc Điều 6 của Thông tư 85/2026/TT-BTC)
node tools/tra-cuu.mjs dieu-khoan "85/2026/TT-BTC" --dieu 6 --nguyen-van

# 3. Hỏi đáp nghiệp vụ PLHQ (tự cảnh báo khi trang wiki nhắc văn bản hết hiệu lực)
node tools/tra-cuu.mjs hoi "nhãn phụ tiếng Việt"

# 4. Kiểm tra ranh giới 0% trùng lặp với hs-code-api (tự động từ chối áp mã HS)
node tools/tra-cuu.mjs hoi "áp mã HS máy nén khí"

# 5. Tra cứu hóa chất theo mã CAS (1,3-Butadien trong Phụ lục I, II, IV NĐ 24/2026/NĐ-CP)
node tools/tra-cuu.mjs cas "106-99-0"

# 6. Tra văn bản chính sách / KTCN cho mã HS đã biết (nhóm 3808)
node tools/tra-cuu.mjs chinh-sach "3808"

# 7. Liệt kê văn bản sắp hết hiệu lực trong 60 ngày tới dưới dạng JSON
node tools/tra-cuu.mjs sap-het-hieu-luc --ngay 60 --json
```

Nếu gọi qua `npm run tra-cuu`, luôn thêm `--` trước lệnh con và cờ để `npm` chuyển nguyên tham số sang Node:

```bash
npm run tra-cuu -- hieu-luc "38/2015/TT-BTC"
npm run tra-cuu -- cas "106-99-0" --phu-luc IV
```

---

## Quy tắc bắt buộc khi dùng & hiển thị kết quả

Mọi tích hợp MCP client, trợ lý AI hoặc ứng dụng dựng trên `oz-wiki-plhq` phải tuân thủ 4 nguyên tắc sau:

1. **Phân tách tuyệt đối 2 tầng điều khoản (`NGUYEN_VAN_NGUON_A` vs `TOM_TAT_NHAP`):**
   - **`NGUYEN_VAN_NGUON_A`:** trích từ `xac_minh.dieu_khoan` của văn bản đã đối chiếu PDF/OCR nguồn bậc A (qua `tools/trich-dieu-khoan.mjs` hoặc soát tay) và kiểm tự động bằng `npm run kiem-tra:dieu-khoan` (kiểm khớp chữ theo `trang_pdf` và băm `sha256_pdf`). **Được phép trích dẫn trực tiếp làm căn cứ pháp lý**, kèm số hiệu văn bản và URL `nguon_a`.
   - **`TOM_TAT_NHAP`:** trích tự động từ `data/doc-hieu/*.dieu.jsonl`, luôn mang `da_soat: false`. **CHỈ dùng để định vị điều luật hoặc nghĩa vụ liên quan; TUYỆT ĐỐI KHÔNG trích nguyên văn hay khẳng định là căn cứ pháp lý.** Khi kết quả thuộc tầng này, bắt buộc hiển thị cảnh báo `"Tóm tắt nháp — chưa đối chiếu nguyên văn PDF bậc A"` và dẫn link `nguon_a` để người dùng mở bản gốc.
2. **Tôn trọng hiệu lực & cảnh báo wiki (`canh_bao_hieu_luc`, `hieu_luc_da_doi_chieu`):**
   - Đọc nguyên giá trị `tinh_trang`, không tự suy luận văn bản còn/hết hiệu lực chỉ từ ngày tháng.
   - Nếu `xac_minh.hieu_luc_da_doi_chieu !== true` → hiển thị cảnh báo chưa đối chiếu nguồn bậc A.
   - Nếu chunk wiki có `canh_bao_hieu_luc: true` → không lấy đoạn đó làm kết luận quy định hiện hành; đối chiếu trường `van_ban_lien_quan[]` (`bi_thay_the_boi` / `bi_bai_bo_boi`) và `nguon_a`.
3. **Ghi nguồn CC BY 4.0 bắt buộc:** giữ nguyên chuỗi ghi nguồn chuẩn trong mọi sản phẩm/câu trả lời dùng dữ liệu kho (xem [LICENSE.md](../LICENSE.md) và [docs/tich-hop.md](tich-hop.md)):
   > `Nguồn: oz-wiki-plhq — https://github.com/ozvietnam/oz-wiki-plhq (CC BY 4.0)` *(kèm ngày `phien_ban` bản dữ liệu đang dùng; nếu rút gọn hoặc đổi nhãn hiển thị thì ghi thêm `Đã rút gọn và đổi nhãn hiển thị`).*
4. **Miễn trừ pháp lý bắt buộc:** luôn hiển thị rõ cho người dùng cuối:
   > `Tham khảo, không phải tư vấn pháp lý. Xem văn bản gốc nguồn bậc A trước khi áp dụng.`

---

## Cơ chế dự phòng 3 tầng

Cổng `oz-wiki-plhq` sử dụng cơ chế 3 tầng để không bao giờ bịa điều luật hay trả lời rỗng im lặng khi tích hợp với `ozplugin`:
- **Tầng 1 (Kho PLHQ nội bộ):** `plhq_hoi_phap_luat` trả `do_tin_cay_tra_loi` (`CAO` | `TRUNG_BINH` | `THAP` | `KHONG_TIM_THAY`), tách riêng `dieu_khoan_nguon_a` và `dieu_khoan_tom_tat_nhap` (`da_soat: false`).
- **Tầng 2 (Fallback trực tiếp nguồn A):** Khi độ tin cậy `THAP` / `KHONG_TIM_THAY` hoặc văn bản gắn cờ `chua_co_toan_van_trong_kho: true`, trường `goi_y_du_phong` trả sẵn `cong_cu_de_xuat: "tim_van_ban_lop_2"` cùng tối đa 5 URL bậc A (`url_nguon_bac_a_goi_y`) để `ozplugin` tra trực tiếp `.gov.vn` / `vbpl.vn` / `chinhphu.vn`.
- **Tầng 3 (Tự học bù kho):** Cờ `can_mo_the_bo_sung_so: true` báo hiệu mở thẻ `[BỔ SUNG SỔ]` nạp bổ sung vào `oz-wiki-plhq`.

## Kiểm tra hoạt động tại máy

```bash
node tools/test/test-mcp-server.mjs
node tools/test/test-tra-cuu-plhq.mjs
npm run eval:qa
npm run eval:retrieval
```

- `npm run eval:qa`: đo độ phủ nguồn A, trang wiki và điều khoản trên **60 câu** nghiệp vụ ([`eval/cau-hoi-nghiep-vu.yaml`](../eval/cau-hoi-nghiep-vu.yaml)).
- `npm run eval:retrieval`: cổng đo truy hồi sống của `hoiPhapLuat` trên bộ **60 câu** nghiệp vụ + 5 câu ghim số hiệu + 5 câu viết tắt + 2 câu ngoài kho (ngưỡng đạt: `expiredTop1 = 0`, `hitAny >= 95%`, `soHieuPinRate = 5/5`, `abbrQueriesRate = 5/5`, `outOfScopeFallbackRate = 2/2`).

Xem thêm bảng đầy đủ các lệnh kiểm tra toàn kho tại [README.md](../README.md) và [docs/SO-DO-HE-THONG.md](SO-DO-HE-THONG.md).
