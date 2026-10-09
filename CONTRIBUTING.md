# Đóng góp cho thư viện tri thức pháp luật XNK

Cảm ơn bạn! Ai cũng góp được — không cần biết lập trình.

## Cách nhanh nhất (không cần cài gì)

- **Báo văn bản mới:** mở issue mẫu **"Văn bản mới"**, dán số hiệu + link nguồn.
- **Báo sai hiệu lực / cũ – mới:** issue mẫu **"Sai hiệu lực"**, ghi văn bản nào thay văn bản nào, điều khoản căn cứ.
- **Báo điểm mù:** issue mẫu **"Điểm mù"** — câu hỏi nghiệp vụ mà kho chưa trả lời được, mảng văn bản còn thiếu.
- **Góp ý nội dung wiki:** issue mẫu **"Góp ý nội dung"** hoặc bình luận thẳng vào dòng trong PR.
- **Sửa nhanh:** mở tệp trên GitHub → bút chì → sửa → "Propose changes" (GitHub tự tạo PR).

## Đóng góp qua PR

```bash
git clone https://github.com/ozvietnam/oz-wiki-plhq && cd oz-wiki-plhq
npm install
node tools/them-van-ban.mjs "28/2026/TT-BCT" --url "https://..."   # thêm văn bản
node tools/nap.mjs "<url toàn văn>" --so-hieu "28/2026/TT-BCT" --ghi # tải toàn văn
npm test                                                           # phải xanh
npm run diem-mu && npm run dung                                    # xem báo cáo (tuỳ chọn)
git checkout -- dist bao-cao                                       # tệp sinh tự động: bot dựng lại sau khi gộp
```

Lược đồ tệp văn bản: [docs/luoc-do-so-dang-ky.md](docs/luoc-do-so-dang-ky.md). Luồng việc:
[docs/luong-cong-viec.md](docs/luong-cong-viec.md). Dùng AI agent: [docs/huong-dan-agent.md](docs/huong-dan-agent.md).

## Năm nguyên tắc

1. **Nguồn bậc A trước khi kết luận** (Công báo, vanban.chinhphu.vn, vbpl.vn, cổng cơ quan ban hành).
2. **Không chắc thì ghi "chưa xác minh"** — không đoán.
3. **Trích điều, khoản** khi nói về nghĩa vụ, thời hạn, ngoại lệ.
4. **Không thông tin khách hàng, tờ khai, hợp đồng, giá cả** — kho công khai.
5. **Lịch sự, cụ thể.** Bất đồng về cách hiểu điều luật → ghi cả hai cách hiểu kèm nguồn, để người đọc thấy.

## Khi bị IP block: dùng Tor SOCKS5

Nếu server `files.customs.gov.vn` (hoặc Cổng TTĐT Bộ, tỉnh) trả **504 Gateway Timeout** dài hạn → IP công ty đã bị chặn. **ĐỪNG** cào tiếp bằng IP cũ — chỉ làm nặng thêm.

Hướng dẫn đầy đủ: **[docs/thu-thap/tor-fallback-khi-bi-ip-block.md](docs/thu-thap/tor-fallback-khi-bi-ip-block.md)**. Tóm tắt 5 phút:

```bash
brew install tor
mkdir -p ~/.hermes/cache/tor-data && chmod 700 ~/.hermes/cache/tor-data
cat > ~/.hermes/cache/tor/torrc << 'EOF'
SocksPort 9050
ControlPort 9051
CookieAuthentication 1
DataDirectory /Users/$(whoami)/.hermes/cache/tor-data
Log notice stdout
EOF
/opt/homebrew/opt/tor/bin/tor -f ~/.hermes/cache/tor/torrc &
/opt/homebrew/bin/python3.14 -m pip install --break-system-packages stem pysocks requests
```

Dùng với Node:
```bash
export https_proxy=socks5h://127.0.0.1:9050
node tools/nap.mjs "https://files.customs.gov.vn/..." --so-hieu "..." --ghi
```

**Quy tắc cứng** (rút ra từ sự cố 2026-10-09):
- 1 process tại 1 thời điểm, KHÔNG chạy song song
- Delay tối thiểu 1s giữa các request
- Sample 100–500 trước khi cào lớn
- Dừng nếu 10 fail liên tiếp
- KHÔNG gọi 60K+ requests/phút (kể cả qua Tor)

## Duyệt PR

Người duy trì duyệt theo: có nguồn bậc A chưa, quan hệ cũ–mới có căn cứ điều khoản chưa, `npm test`
xanh chưa. PR do agent mở được duyệt như PR của người.
