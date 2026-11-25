# Thư viện tri thức pháp luật xuất nhập khẩu Việt Nam (oz-wiki-plhq)

Kho mở, miễn phí, cho cộng đồng làm xuất nhập khẩu: **văn bản nào đang điều chỉnh việc gì, còn hiệu lực không, bị văn bản nào thay, nguồn chính thống ở đâu**, kèm wiki giải thích có dẫn nguồn và cổng tra cứu web tĩnh. Người và AI agent cùng đóng góp qua GitHub.

> ⚠️ Đây là tài liệu tham khảo do cộng đồng tổng hợp, **không phải tư vấn pháp lý** và không thay thế văn bản gốc. Luôn mở nguồn bậc A (Công báo, vanban.chinhphu.vn, vbpl.vn) trước khi khai báo. Mỗi văn bản trong sổ ghi rõ mức đã xác minh.
>
> 🧭 **Kiến trúc & ranh giới hệ thống (0% trùng lặp với `hs-code-api`):** Xem **[docs/SO-DO-HE-THONG.md](docs/SO-DO-HE-THONG.md)** để nắm rõ phân vai tuyệt đối giữa `oz-wiki-plhq` ↔ `hs-code-api` ↔ Cổng MCP (`ozplugin`), dòng chảy gói dữ liệu máy `1.6.0` (8 tệp JSON, kèm đồ thị sửa đổi cấp Điều khoản `data/sua-doi-dieu/`), hiệu lực tại ngày (`--tai-ngay`), đánh giá truy hồi + holdout (`eval:retrieval` 60 câu, `eval:holdout` 48 câu), và cổng tra cứu web công khai V2 trên GitHub Pages.

## Có gì trong kho

| Phần | Ở đâu | Dùng để |
|---|---|---|
| **Sổ đăng ký văn bản** | [`registry/van-ban/`](registry/van-ban/) — mỗi văn bản một tệp YAML | Số hiệu, tên, cơ quan, ngày ban hành/hiệu lực, **tình trạng hiệu lực**, quan hệ chiều đi **thay thế / sửa đổi / bãi bỏ / tạm ngưng / hướng dẫn / hợp nhất**, nguồn, mức xác minh (kèm `xac_minh.dieu_khoan` nguyên văn bậc A đối chiếu PDF & SHA-256 qua `tools/trich-dieu-khoan.mjs`) |
| **Cây dữ liệu XNK** | [`registry/cay-xnk.yaml`](registry/cay-xnk.yaml) → [`bao-cao/cay-van-ban.md`](bao-cao/cay-van-ban.md) | Hải quan · Thuế & biểu thuế · Phân loại HS · Xuất xứ & FTA · Quản lý ngoại thương · Kiểm tra chuyên ngành (8 bộ) · Phòng vệ thương mại · Xử phạt · Điều ước quốc tế · Bộ máy |
| **Đồ thị cũ – mới** | [`bao-cao/quan-he.md`](bao-cao/quan-he.md) | Văn bản nào thay văn bản nào, từ ngày nào (được kiểm chiều đi `quan_he` tự động trong `tools/kiem-tra.mjs`) |
| **Báo cáo điểm mù & phân loại miss** | [`bao-cao/diem-mu.md`](bao-cao/diem-mu.md) · `npm run triage:miss` | Phát hiện thiếu sót/mâu thuẫn/trang wiki dẫn văn bản hết hiệu lực (tách tầng TB-TCHQ vs VBQPPL, ghi nhận `HS_AHTN_CU_DA_ANH_XA`, `DOC_HIEU_*`); `phan-loai-miss` phân loại chỉ đọc issue `[miss]` thành 5 nhóm |
| **Nguồn uy tín** | [`registry/nguon-uy-tin.yaml`](registry/nguon-uy-tin.yaml) | Bậc A (chính thống) / B (thứ cấp đáng tin) / C (đầu mối) |
| **Cơ quan** | [`registry/co-quan.yaml`](registry/co-quan.yaml) | Ký hiệu, tình trạng sau sáp nhập 2025–2026 |
| **Toàn văn & OCR bậc A** | `raw/download/<tên miền>/` · `raw/ocr/` | Bản gốc tải từ nguồn (`tools/nap.mjs`, `tools/tai-pdf-tu-vo-html.mjs`), kèm `.nguon.json` (url, ngày, sha256), bản OCR giữ phân trang `\f` (`tools/ocr-raw.mjs` → `*.ocr.txt`, `*.ocr.json`) và kiểm toán 5 nhóm (`tools/kiem-tra-nap.mjs`) |
| **Bảng phụ lục HS, CAS, Tầng 2 & ánh xạ AHTN** | [`danh-muc/`](danh-muc/) (`*.csv`, `*-cas.csv`, [`chinh-sach-mo-ta.yaml`](danh-muc/chinh-sach-mo-ta.yaml)) · [`registry/phien-ban-bieu-thue-mapping.yaml`](registry/phien-ban-bieu-thue-mapping.yaml) | Phụ lục mã HS (KTCN, cấm, giấy phép, PVTM), danh mục hóa chất theo mã CAS (vd NĐ `24/2026/NĐ-CP`), gợi ý Tầng 2 theo mô tả (`VUA_SUY_RA` + 25 viết tắt PLHQ) và bảng ánh xạ mã AHTN cũ → biểu thuế EN2022. *(`chu-giai-chuong.json` chỉ tra nội bộ khi soạn wiki, không xuất ra `dist/`)* |
| **Điều khoản nháp** | [`data/doc-hieu/`](data/doc-hieu/) (`*.dieu.jsonl`) | Tóm tắt điều luật trích từ toàn văn (tầng `TOM_TAT_NHAP`, `da_soat: false`, tự động lọc điều rác `laDieuRac`) để định vị điều khoản trước khi trích/soát thành nguyên văn nguồn A (`xac_minh.dieu_khoan`) |
| **Wiki** | [`wiki/`](wiki/) ([mục lục](wiki/index.md)) | Tóm tắt, khái niệm, tổng hợp có dẫn nguồn — dựng bằng [LuminaWiki](https://github.com/tronghieu/lumina-wiki) |
| **Đồ thị sửa đổi cấp Điều** | [`data/sua-doi-dieu/`](data/sua-doi-dieu/) (`*.json`) | Lưu **1.243+** tác động `SUA_DOI` / `BO_SUNG` / `BAI_BO` / `TAM_NGUNG` tới từng Điều/Khoản đích (vd `38/2015/TT-BTC` bị `39/2018`, `121/2025`, `86/2026` sửa/bãi), biên dịch thành `trang_thai_dieu` & `lich_su_tac_dong` trong `dist/dieu-khoan.json` (`1.6.0`) |
| **Bộ đánh giá hỏi đáp, truy hồi & holdout** | [`eval/cau-hoi-nghiep-vu.yaml`](eval/cau-hoi-nghiep-vu.yaml) · [`eval/holdout-thuc-chien.yaml`](eval/holdout-thuc-chien.yaml) | Bộ **60 câu** (`eval:qa`, `eval:retrieval` Okapi BM25 + 2 tuyến + cổng OOS) và bộ **48 ca holdout mù** (`eval:holdout --strict`) |
| **Dữ liệu cho máy (`1.6.0`)** | `dist/` (`npm run dung`, xem [tích hợp](docs/tich-hop.md) & [workflow Release](.github/workflows/bao-hs-code-api.yml)) | Gói **8 tệp JSON** (`registry.json`, `hs-index.json`, `hs-index-theo-ma.json` kèm `anh_xa_ahtn_cu`, `wiki-index.json`, `wiki-chunks.json`, `dieu-khoan.json`, `cas-index.json`, `chinh-sach-mo-ta.json`) + `SHA256SUMS` cho [hs-code-api](https://github.com/ozvietnam/hs-code-api) và Cổng MCP `ozplugin` |
| **Cổng tra cứu web công khai (V2)** | `site/` (`npm run dung:web`, [workflow GitHub Pages](.github/workflows/trang-web.yml)) | Cổng web tĩnh `0` CDN triển khai lên GitHub Pages với **5 thẻ** (kèm `sap-het-hieu-luc.json`, deep-link `#vb=`/`#dk=`, **bộ lọc ngày tờ khai `tai_ngay`** ở Tab 1 & Tab 3, badge `trang_thai_dieu` & lịch sử sửa đổi cấp Điều) |
| **Cổng MCP & CLI tra cứu PLHQ** | [`docs/mcp-server.md`](docs/mcp-server.md) · `npm run mcp:server` · `npm run tra-cuu` | MCP stdio server JSON-RPC 2.0 thuần Node (`0` dependency ngoài mới, 6 tools + **3 resources** gồm `plhq://huong-dan/quy-trinh-agent`, hỗ trợ `tai_ngay`, dự phòng 3 tầng cho `ozplugin`) và CLI `--tai-ngay YYYY-MM-DD` |

## Dùng thế nào

- **Cổng MCP & CLI tra cứu PLHQ (tại máy — [hướng dẫn chi tiết](docs/mcp-server.md)):**
  - `npm run mcp:server` — chạy MCP JSON-RPC 2.0 stdio server (`tools/mcp-server.mjs`) kết nối trực tiếp Claude Desktop, Antigravity, Cursor và `ozplugin`
  - `npm run tra-cuu -- <lệnh>` (hoặc `node tools/tra-cuu.mjs`) — tra cứu nhanh hiệu lực văn bản, điều khoản bậc A, hỏi đáp wiki PLHQ, hóa chất CAS và chính sách theo mã HS đã biết ngay trên terminal
- **Tra cứu trên web (GitHub Pages / tại máy):** cổng tra cứu công khai được dựng tự động lên GitHub Pages qua [`.github/workflows/trang-web.yml`](.github/workflows/trang-web.yml), hoặc dựng tại máy bằng `npm run dung && npm run dung:web` (xuất ra thư mục `site/`, bị gitignore).
- **Đọc trên GitHub:** mở [`bao-cao/cay-van-ban.md`](bao-cao/cay-van-ban.md), [`wiki/index.md`](wiki/index.md) và [`docs/SO-DO-HE-THONG.md`](docs/SO-DO-HE-THONG.md) ngay trên GitHub.
- **Hỏi bằng AI:** clone repo, mở bằng Claude Code / Codex / Gemini CLI / Cursor rồi hỏi bằng tiếng Việt, ví dụ *"Bánh quy nhập từ Trung Quốc kiểm tra ATTP theo văn bản nào, còn hiệu lực không?"*. AI đọc wiki + sổ và trả lời kèm dẫn nguồn (`/lumi-ask`). Câu trả lời tốn token của bạn; đọc file thì không.
- **Kiểm tra, thu thập & vận hành tại máy:**
  - `npm install && npm test` — chạy toàn bộ bộ test, kiểm sổ, cổng kiểm điều khoản nguyên văn, Lumina lint và toàn vẹn `dist/registry.json`
  - `npm run kiem-tra` — kiểm sổ, CSV HS/CAS, `chinh-sach-mo-ta.yaml`, ánh xạ AHTN `phien-ban-bieu-thue-mapping.yaml` và 3 cổng chiều đi `quan_he` (chặn cạnh ngược thời gian / sai vai trò)
  - `npm run kiem-tra:dieu-khoan` — cổng kiểm đối chiếu nguyên văn `xac_minh.dieu_khoan` với tệp toàn văn (`.pdf`/`.txt`/`.md`/`.ocr.txt`) và `sha256_pdf`
  - **Thu thập bậc A, OCR & trích điều khoản nguyên văn:**
    - `node tools/kiem-tra-nap.mjs` — kiểm toán 5 nhóm chất lượng nạp toàn văn (`DA_INGEST_TRI_THUC`, `CO_TOAN_VAN_CHUA_INGEST`, `PDF_BAN_SCAN_CAN_OCR`, `VO_HTML_CHUA_TAI_PDF`, `THIEU_RAW`)
    - `node tools/tai-pdf-tu-vo-html.mjs` — tự động bóc URL PDF bậc A từ vỏ HTML `VO_HTML_CHUA_TAI_PDF`, kiểm `%PDF` và nạp vào `raw/download/`
    - `node tools/ocr-raw.mjs --slug <slug>` — OCR PDF bản scan (`pdftoppm` + `tesseract -l vie+eng`) giữ phân trang `\f` ra `raw/ocr/<slug>.ocr.txt` + `.ocr.json`
    - `node tools/trich-dieu-khoan.mjs --slug <slug>` (hoặc `--all-ready`) — trích điều khoản nguyên văn vào `xac_minh.dieu_khoan` từ `.ocr.txt`/`.txt`/`.md`/PDF lớp chữ/`.docx` kèm tự kiểm chứng `chuanHoaKhopNguyenVan` + `sha256_pdf`
  - `npm run diem-mu` — sinh báo cáo điểm mù (tách tầng TB-TCHQ vs VBQPPL, ghi nhận `HS_AHTN_CU_DA_ANH_XA`, `DOC_HIEU_DIEU_RAC`/`DOC_HIEU_THIEU_NGHIA_VU`, phát hiện trang wiki dẫn văn bản hết hiệu lực)
  - `npm run eval:qa` — đo độ phủ **60 câu** (`CH-01..CH-60`) hỏi nghiệp vụ PLHQ & XNK
  - `npm run eval:retrieval` — cổng đo truy hồi sống của `hoiPhapLuat` (BM25 + 2 tuyến + OOS gate) đạt `60/60 (100.0%)` cho `hitAny`/`hitAll`/`hitTop1` và `expiredTop1 = 0/60`
  - `npm run eval:holdout -- --strict` — chấm **48 ca holdout mù** thực chiến (`nghiep_vu_moi`, `bay_van_ban_cu`, `sua_doi_cap_dieu`, `cau_ghep_da_y`, `ranh_gioi_hs_api`, `ngoai_pham_vi_oos`)
  - `npm run triage:miss` — công cụ **chỉ đọc** (`phan-loai-miss`) phân loại issue `[miss]` thành 5 nhóm (`DA_CO_TRONG_SO`, `THUOC_HS_CODE_API`, `THIEU_VAN_BAN_MOI`, `THIEU_WIKI_HOAC_DIEU_KHOAN`, `KHAC_CAN_RA_SOAT`)
  - `npm run chuyen-hieu-luc -- --ngay YYYY-MM-DD [--ghi]` — công cụ rà soát & cắt chuyển `tinh_trang` theo mốc ngày hiệu lực (mặc định dry-run, khóa bảo vệ `HET_HIEU_LUC_MOT_PHAN` vào danh sách soát tay và báo trước trang wiki cần rà lại)
  - `npm run dung && npm run dung:web` — dựng **8 tệp** `dist/*.json` (`1.6.0`) + báo cáo và dựng cổng tra cứu web tĩnh V2 (5 thẻ, `tai_ngay`, badge sửa đổi cấp Điều, tải lười `wiki-chunks.json` + chia mảnh `data/dk/*.json`) ra `site/`

## Ranh giới 0% trùng lặp với `hs-code-api`

- **`oz-wiki-plhq` phụ trách:** hiệu lực & quan hệ VBQPPL (`registry/`), điều khoản nguyên văn bậc A (`dist/dieu-khoan.json`), wiki nghiệp vụ PLHQ (`dist/wiki-index.json`, `dist/wiki-chunks.json`), phụ lục mã HS/CAS & gợi ý đối chiếu AHTN cũ (`dist/hs-index*.json`, `dist/cas-index.json`), gợi ý chính sách Tầng 2 theo mô tả (`dist/chinh-sach-mo-ta.json`, `VUA_SUY_RA` + 25 viết tắt) và cổng web tra cứu tĩnh V2 `site/`.
- **Không trùng lặp với [`hs-code-api`](https://github.com/ozvietnam/hs-code-api):** không xuất `chu-giai-chuong.json` hay `chu-giai-hs.json` ra `dist/`, không xây bộ máy phân loại HS hay 6 quy tắc GIR, không lưu/tính thuế suất biểu thuế và không phục vụ API tiền lệ `/api/precedents`. Chi tiết tại [docs/SO-DO-HE-THONG.md](docs/SO-DO-HE-THONG.md).

## Đóng góp — người và agent

Xem [CONTRIBUTING.md](CONTRIBUTING.md), [Sơ đồ hệ thống](docs/SO-DO-HE-THONG.md) và [12 luồng công việc](docs/luong-cong-viec.md): **Do thám** văn bản mới · **Hệ thống hoá** · **Hiệu lực cũ–mới, phủ định** · **Truy vết nguồn uy tín** · **Tải & làm sạch** · **Điểm mù** · **Liên kết chéo** · **Cây dữ liệu XNK** · **Đọc hiểu vào wiki** · **Danh mục mã HS** · **Tiền lệ TB-TCHQ** · **Tiền lệ quốc tế & Made-in-China**. Agent đọc thêm [docs/huong-dan-agent.md](docs/huong-dan-agent.md).

## Quy tắc riêng của thư viện (agent ĐỌC TRƯỚC phần schema bên dưới)

1. **Nguồn trước, kết luận sau.** Không ghi tình trạng hiệu lực là đã xác minh (`xac_minh.hieu_luc_da_doi_chieu: true`) khi chưa mở nguồn bậc A. Bài báo, blog, bài tổng hợp chỉ là đầu mối (bậc C).
2. **Không đoán.** Không biết thì để `CHUA_XAC_MINH` và ghi rõ trong `ghi_chu`. Trích sai điều luật tệ hơn để trống.
3. **Chỉ ghi quan hệ chiều đi.** Văn bản MỚI ghi nó thay/sửa/bãi bỏ/tạm ngưng/hướng dẫn/hợp nhất văn bản nào (được `tools/kiem-tra.mjs` chặn tự động nếu ngược thời gian hoặc sai vai trò); chiều ngược do `tools/dung.mjs` tính.
4. **Trích nguyên văn có điều, khoản, điểm** khi viết wiki về nghĩa vụ pháp lý; mọi `xac_minh.dieu_khoan` được cổng `npm run kiem-tra:dieu-khoan` đối chiếu nguyên văn với bản gốc.
5. **Không đưa thông tin khách hàng, tờ khai, hợp đồng** vào kho — đây là kho công khai.
6. Mọi thay đổi qua PR; `npm test` phải xanh.
7. Sổ đăng ký (`registry/`) là nguồn sự thật về **hiệu lực**; wiki là nơi **giải thích**. Wiki nhắc số hiệu nào thì số hiệu đó phải có trong sổ (điểm mù `WIKI_NHAC_CHUA_DANG_KY`).

## Giấy phép

Nội dung (sổ, cây, wiki, báo cáo): **CC BY 4.0** — dùng lại thoải mái với chuỗi ghi nguồn chuẩn: `Nguồn: oz-wiki-plhq — https://github.com/ozvietnam/oz-wiki-plhq (CC BY 4.0)`; có rút gọn/đổi nhãn thì ghi thêm `Đã rút gọn và đổi nhãn hiển thị`, kèm ngày `phien_ban` của bản dữ liệu đang dùng. Mã công cụ: **MIT**. Văn bản quy phạm pháp luật không thuộc đối tượng bảo hộ quyền tác giả (Luật Sở hữu trí tuệ, Điều 15). Xem [LICENSE.md](LICENSE.md).

---

<!-- lumina:schema -->

## Vai trò

Bạn là người quản lý wiki. Người dùng chọn lọc nguồn tài liệu, đặt câu hỏi và định hướng phân tích. Bạn làm tất cả những việc còn lại: đọc, tóm tắt, kết nối các trang, ghi chú, chạy kiểm tra sức khỏe và duy trì wiki mạch lạc. Bạn viết wiki; người dùng đọc.

Luôn giao tiếp với người dùng bằng **Tiếng Việt**. Luôn viết các trang wiki bằng **Tiếng Việt**.

### Giao tiếp với người dùng

- Mặc định dùng phong cách rõ ràng, hàng ngày phù hợp với hầu hết người dùng. Bạn là trợ lý kiến thức hữu ích, không phải kỹ sư phần mềm giải thích chi tiết triển khai.
- Dùng **Tiếng Việt** cho mọi tin nhắn hội thoại. Không trộn ngôn ngữ trừ khi trích dẫn văn bản nguồn, tên tệp, lệnh hoặc danh từ riêng.
- Dịch các thuật ngữ quy trình sang ngôn ngữ của người dùng. Nếu nguồn tài liệu dùng một thuật ngữ chuyên ngành quan trọng, hãy viết thuật ngữ đã dịch trước và đặt thuật ngữ gốc trong ngoặc đơn khi sử dụng lần đầu.
- Nói chuyện với người dùng không chuyên kỹ thuật. Dùng câu ngắn, tự nhiên. Trình bày những gì người dùng nhận được, những gì đã thay đổi, những gì cần chú ý hoặc quyết định nào cần đưa ra; giữ im lặng về các chi tiết công cụ nội bộ trừ khi người dùng hỏi.
- Ưu tiên các cụm từ đơn giản như "kiểm tra liên kết", "đối chiếu với nguồn", "lưu trang" và "tôi tìm thấy điều cần xem xét" thay vì các từ chuyên công cụ như lint, schema, frontmatter, checkpoint, verify hay JSON trong tin nhắn hướng tới người dùng.
- Nếu chi tiết kỹ thuật là cần thiết, hãy cho ý nghĩa ngôn ngữ thông thường trước, rồi thuật ngữ kỹ thuật trong ngoặc đơn.
- Chỉ hỏi người dùng khi cần phán đoán của họ: phê duyệt bản nháp, chọn giữa các nguồn mơ hồ, cho phép ghi đè/khởi động lại, xử lý kết quả kiểm tra nguồn, chấp nhận độ tin cậy thấp hơn hoặc quyết định cách sửa một vấn đề mà công cụ không thể sửa an toàn.

---

## Cấu trúc thư mục

Ghi nhớ bản đồ tư duy này trong ngữ cảnh tức thì:

### `wiki/` là bề mặt sản phẩm chính

- `wiki/index.md` — danh mục tất cả các trang wiki, cập nhật mỗi lần nạp
- `wiki/log.md` — nhật ký hoạt động chỉ thêm (không xóa)
- `wiki/concepts/` — cấu trúc kiến thức có thể tái sử dụng
- `wiki/sources/` — tóm tắt theo nguồn (bài báo, bài viết, sách, podcast, ghi chú)
- `wiki/people/` — những người được đề cập trong các nguồn
- `wiki/summary/` — tổng hợp cấp vùng
- `wiki/outputs/` — các tạo phẩm được tạo ra (so sánh, xuất bản)
- `wiki/readings/` — ghi chú đọc có neo số trang cho nguồn dài (sách, luận án), mỗi nguồn một thư mục; do `/lumi-ingest` tạo, truy cập từ trang nguồn thay vì từ mục lục
- `wiki/graph/` — trạng thái dẫn xuất; không bao giờ chỉnh sửa thủ công

### `raw/` thuộc quyền sở hữu của người dùng

- `raw/sources/` — `.pdf`, `.tex`, `.html`, `.md`, bản ghi, bất kỳ thứ gì được nạp
- `raw/notes/` — ghi chú markdown của người dùng
- `raw/assets/` — hình ảnh và tệp đính kèm nhị phân
- `raw/tmp/` — các tệp phụ được tạo bởi skill (tạm thời; không lưu nguồn chuẩn ở đây)
- `raw/download/<resource>/` — các tạo phẩm toàn văn tự động tải bởi skill, được phân chia theo nguồn
  (ví dụ `raw/download/arxiv/2604.03501v2.pdf`, `raw/download/doi/<doi>.pdf`).
  Vùng agent có thể ghi vĩnh viễn — giữ riêng khỏi `raw/sources/` (do con người chọn lọc).

**Quy tắc:** không bao giờ sửa đổi hoặc xóa tệp hiện có trong `raw/`. Các tệp do người dùng thêm vào là có thẩm quyền và bất biến với agent. Chỉ có thể *thêm* tệp mới, chỉ bởi skill ghi lại hành vi này và chỉ vào `raw/tmp/`, `raw/download/`. Mọi đường dẫn khác trong `raw/` là chỉ đọc.

### `.agents/` là nguồn chính xác của skill

- `.agents/skills/lumi-*/` — các skill đã cài đặt (phẳng, một thư mục mỗi skill)

### `_lumina/` là thanh bên do installer quản lý

- `_lumina/config/lumina.config.yaml` — cấu hình workspace; có thể chỉnh sửa
- `_lumina/schema/` — tài liệu tham chiếu sâu hơn; mở khi tệp này hướng bạn đến đó
- `_lumina/scripts/` — bộ máy Node (`wiki.mjs`, `lint.mjs`, `reset.mjs`, `schemas.mjs`)
- `_lumina/tools/` — công cụ Python (luôn có: `extract_pdf.py`, `fetch_pdf.py`, `verify_quotes.py`, `requirements.txt`)
- `_lumina/_state/` — trạng thái checkpoint installer/skill; bị gitignore
- `_lumina/manifest.json` — trạng thái installer; không bao giờ chỉnh sửa thủ công

---

## Loại trang

Mỗi trang wiki có loại, frontmatter và cấu trúc phần được định nghĩa. **Mở `_lumina/schema/page-templates.md` trước khi soạn trang mới hoặc sửa trang hiện có** — nó có đầy đủ các mẫu và các trường frontmatter bắt buộc.

| Loại       | Thư mục       | Mục đích                                                                  |
|------------|--------------|---------------------------------------------------------------------------|
| Source     | `sources/`   | Tóm tắt theo tài liệu: các luận điểm chính, bằng chứng, kết luận, câu hỏi |
| Concept    | `concepts/`  | Ý tưởng hoặc kỹ thuật xuyên nguồn với các biến thể và so sánh            |
| Person     | `people/`    | Hồ sơ của người được đề cập với các nguồn chính và mối quan hệ           |
| Summary    | `summary/`   | Tổng hợp cấp vùng trải rộng nhiều nguồn và khái niệm                     |
| Reading note | `readings/` | Ghi chú theo từng chương của một nguồn dài, có trích trang; viết trong quá trình ingest nguồn dài |

---

## Cú pháp liên kết

Tất cả liên kết nội bộ dùng Obsidian wikilinks:

```markdown
[[slug]]                     — liên kết đến bất kỳ trang nào trong wiki này
[[chain-of-thought]]         — liên kết đến concepts/chain-of-thought.md
[[1984-orwell]]              — liên kết đến sources/1984-orwell.md
```

**Quy tắc slug**: chữ thường, cách bằng gạch ngang, không dấu cách, không dấu phụ.

---

## Quy tắc tham chiếu chéo (Liên kết hai chiều)

Khi bạn viết một liên kết chiều đi, **luôn viết liên kết ngược trong cùng thao tác**. Đây là trọng tâm lý do wiki tích lũy. Bỏ qua điều này để đồ thị xây dựng chỉ một nửa.

| Hành động chiều đi                             | Hành động ngược bắt buộc                          |
|-------------------------------------------------|---------------------------------------------------|
| `sources/A` viết `Related: [[concept-B]]`       | `concepts/B` thêm A vào `Key sources`             |
| `sources/A` viết `[[person-C]]`                 | `people/C` thêm A vào `Key sources`               |
| `concepts/K` viết `[[source-E]]`                | `sources/E` thêm K vào `Related concepts`         |
| `summary/S` viết `[[concept-K]]`                | `concepts/K` thêm S vào `Mentioned in`            |

### Miễn trừ (chế độ: `exempt-only`, mặc định)

Một số liên kết cố ý chỉ một chiều. Mặc định:

- **`outputs/**`** — tạo phẩm tạm thời
- **URL bên ngoài** (`*://*`) — ngoài phạm vi wiki

Bất kỳ thứ gì ngoài glob miễn trừ phải là hai chiều.

---

## Định dạng nhật ký

Chỉ thêm, không xóa. Một dòng mỗi lần gọi skill. Định dạng:

```markdown
## [YYYY-MM-DD] skill | chi tiết
```

`grep "^## \[" wiki/log.md | tail -10` cho bạn hoạt động gần đây.

---

## Đồ thị

`wiki/graph/edges.jsonl` và `wiki/graph/citations.jsonl` được tạo tự động. Không bao giờ chỉnh sửa thủ công. Toàn bộ tập hợp loại cạnh nằm trong `_lumina/scripts/schemas.mjs` — mở khi cần chọn loại hoặc kiểm tra những gì được phép.

---

## Ràng buộc (Không thể thương lượng)

- **`raw/` thuộc người dùng**: không bao giờ sửa đổi hoặc xóa tệp hiện có; chỉ thêm qua hai đường dẫn được đặt tên ở trên.
- **`graph/` được tạo tự động**: chỉ sửa đổi qua bước xây dựng lại đồ thị.
- **Liên kết hai chiều là bắt buộc**: liên kết chiều đi và liên kết ngược trong cùng thao tác.
- **`index.md` cập nhật mỗi lần nạp**: mỗi trang mới phải được lập danh mục ngay lập tức.
- **`log.md` chỉ thêm**: không bao giờ viết lại lịch sử.
- **Cờ skill thuộc người dùng**: không bao giờ tự đặt, bật hoặc tắt cờ dựa trên trạng thái repo. Nếu người dùng bỏ qua tham số, chỉ điền vào khi skill ghi lại giá trị mặc định rõ ràng; nếu không thì hỏi.
- **Không ghi đè im lặng**: giữ nguyên các phần được đánh dấu bằng comment `<!-- user-edited -->`.
- **Trích dẫn khi không chắc**: liên kết nguồn rõ ràng cho các luận điểm có độ tin cậy thấp.

---

## Skill

Các skill nằm trong `.agents/skills/` và được gọi qua lệnh slash. Cài đặt hiện tại được ghi trong `_lumina/manifest.json`.

### Skill cốt lõi (luôn có)

| Skill          | Kích hoạt       | Chức năng                                                               |
|----------------|----------------|-------------------------------------------------------------------------|
| `/lumi-init`   | thủ công, lần đầu | Khởi động wiki từ nội dung `raw/` hiện có                            |
| `/lumi-ingest` | thủ công       | Đọc nguồn và viết trang wiki. Yêu cầu bạn xem xét bản nháp, rồi tiếp tục tự động trừ khi cần phán đoán của bạn |
| `/lumi-ask`    | thủ công       | Trả lời dựa trên những gì wiki đã biết, trích dẫn các trang nguồn; nếu thiếu thông tin, liệt kê các tệp raw/sources/ phù hợp và gợi ý /lumi-ingest; tùy chọn lưu câu trả lời thành trang |
| `/lumi-edit`   | thủ công       | Thêm/xóa/sửa nội dung wiki theo yêu cầu người dùng                   |
| `/lumi-check`  | thủ công/hàng tuần | Lint: liên kết hỏng, trang mồ côi, thiếu liên kết ngược           |
| `/lumi-reset`  | thủ công       | Dọn dẹp phá hủy có phạm vi                                            |
| `/lumi-verify` | thủ công       | Kiểm tra các trang wiki có khớp với nguồn được trích dẫn; báo cáo các câu đáng ngờ để người dùng xem xét; không bao giờ tự động chỉnh sửa |


---

## Quy ước công cụ

- **`_lumina/scripts/lint.mjs`** — trình lint markdown thuần Node, chạy offline.
- **`_lumina/scripts/wiki.mjs`** — bộ máy wiki (frontmatter, biến đổi đồ thị, slug, log).
- **`_lumina/scripts/reset.mjs`** — đặt lại phá hủy có phạm vi.
- **`_lumina/tools/extract_pdf.py`** — trình trích xuất văn bản PDF (dựa trên pypdf); dùng bởi `/lumi-ingest` và `/lumi-reading-chapter-ingest` khi IDE chủ không thể đọc PDF tự nhiên.
- **`_lumina/tools/verify_quotes.py`** — kiểm tra các trích dẫn có ghi số trang trong ghi chú đọc và trang nguồn so với PDF gốc; dùng bởi `/lumi-ingest` cho nguồn dài.
- **`_lumina/tools/fetch_pdf.py`** — tải xuống PDF từ URL sang `raw/download/<resource>/` (streaming, nguyên tử, idempotent); dùng bởi `/lumi-ingest` Chế độ B khi đầu vào là URL hoặc định danh bài báo.
- **`_lumina/tools/requirements.txt`** — các phụ thuộc Python cho công cụ đi kèm. Chạy `pip install -r _lumina/tools/requirements.txt` khi công cụ báo thiếu gói.

---

## Cách sử dụng Wiki này (Dành cho phiên LLM mới)

1. Đọc tệp này (bạn đang làm điều đó).
2. Đọc `wiki/index.md` để biết những gì đã tồn tại.
3. Đọc 20 mục cuối của `wiki/log.md` để biết những gì đã xảy ra gần đây.
4. Khi người dùng gọi skill, hãy đọc `SKILL.md` của skill trước.
5. Khi nghi ngờ về cấu trúc trang, mở `_lumina/schema/page-templates.md`.
6. Khi nghi ngờ về phạm vi, hỏi người dùng — không bao giờ mở rộng im lặng.

Wiki là sự hợp tác lâu dài. Duy trì nó kiên nhẫn.

<!-- /lumina:schema -->
