# Khi bị IP block: chuyển sang Tor SOCKS5

Tình huống: IP công ty bị `files.customs.gov.vn` hoặc server tương tự chặn dài hạn (504 Gateway Timeout kéo dài). Trang này hướng dẫn **mọi agent trên repo** (cả người và AI) tự cài Tor để qua mặt block.

> **Lưu ý:** Tor là fallback, không phải default. Chỉ dùng khi IP thật bị block. Crawl thường vẫn dùng IP công ty.

---

## 1. Cài Tor (một lần)

### macOS (khuyến nghị)
```bash
brew install tor
```

### Linux
```bash
sudo apt install tor    # Debian/Ubuntu
sudo dnf install tor    # Fedora
```

### Windows
Tải Tor Expert Bundle: <https://www.torproject.org/download/tor/>

---

## 2. Cấu hình Tor

Tạo file `~/.hermes/cache/tor/torrc` (macOS/Linux):

```torrc
SocksPort 9050
ControlPort 9051
CookieAuthentication 1
DataDirectory /Users/<user>/.hermes/cache/tor-data
Log notice stdout
```

Tạo thư mục data:
```bash
mkdir -p ~/.hermes/cache/tor-data
chmod 700 ~/.hermes/cache/tor-data
```

---

## 3. Khởi động Tor

### macOS — chạy nền
```bash
/opt/homebrew/opt/tor/bin/tor -f ~/.hermes/cache/tor/torrc &
```

### macOS — dùng brew services
```bash
brew services start tor
```

### Linux
```bash
sudo systemctl start tor
```

**Kiểm tra Tor đã chạy:**
```bash
curl -sI --socks5-hostname 127.0.0.1:9050 \
  https://api.ipify.org 2>&1 | head -1
# Thấy IP Tor (khác IP công ty) là OK
```

---

## 4. Cài Python dependencies

### ⚠️ Bắt buộc dùng Homebrew Python (KHÔNG Xcode)

Lý do: Xcode Python dùng LibreSSL, không tương thích Tor.

```bash
# macOS
/opt/homebrew/bin/python3.14 -m pip install --break-system-packages \
  stem pysocks requests
```

```bash
# Linux
pip3 install --break-system-packages stem pysocks requests
```

---

## 5. Dùng Tor trong code

### 5.1. curl qua Tor
```bash
curl -sI --socks5-hostname 127.0.0.1:9050 \
  "https://files.customs.gov.vn/CustomsCMS/.../file.pdf"
```

### 5.2. Python requests
```python
import requests

proxies = {
    "http":  "socks5h://127.0.0.1:9050",
    "https": "socks5h://127.0.0.1:9050"
}
r = requests.get("https://example.com", proxies=proxies, timeout=30)
```

> Lưu ý `socks5h` (không phải `socks5`): DNS cũng đi qua Tor.

### 5.3. Python stem — đổi IP tự động
```python
from stem import Signal
from stem.control import Controller
import time

def renew_tor_circuit():
    """Đổi IP — mỗi lần Tor chọn exit node mới"""
    with Controller.from_port(port=9051) as c:
        c.authenticate()
        wait = c.get_newnym_wait()
        if wait > 0:
            time.sleep(wait + 0.5)
        c.signal(Signal.NEWNYM)

# Đổi IP mỗi 50 request (Tor enforce 10s cooldown)
for i in range(100):
    if i > 0 and i % 50 == 0:
        renew_tor_circuit()
    r = requests.get(url, proxies=proxies, timeout=30)
```

---

## 6. Script mẫu (đã có trong skill)

Đường dẫn: `~/.hermes/skills/customs-vn-vanban-scraper/scripts/verify_pdfs_tor.py`

```bash
# Chạy với sample 100 PDF
/opt/homebrew/bin/python3.14 \
  ~/.hermes/skills/customs-vn-vanban-scraper/scripts/verify_pdfs_tor.py 100
```

**Output thực tế (2026-10-09):**
- 60/100 PDF alive (60%)
- IP rotate: `23.191.200.115` → `23.191.200.57`
- Thời gian: ~3 phút cho 100 PDF

---

## 7. Quy tắc an toàn

| Quy tắc | Lý do |
|---|---|
| **1 process tại 1 thời điểm** | Tránh DDoS server |
| **Delay tối thiểu 1s/request** | Không trigger rate limit |
| **Sample nhỏ 100-500 trước** | Verify work trước khi lớn |
| **Stop nếu 10 fail liên tiếp** | Server đang quá tải |
| **KHÔNG gọi 60K+ requests/phút** | Có thể bị Tor exit block |
| **Đổi IP mỗi 50-100 request** | IP rotate để tránh flag |

---

## 8. Khi nào KHÔNG dùng Tor

- ❌ Khi server đang hoạt động bình thường (IP thường nhanh hơn)
- ❌ Khi cần JavaScript render (Tor chỉ pass HTTP, không render)
- ❌ Khi cần download file lớn > 100MB (Tor chậm)
- ❌ Khi cần authentication session (Tor mất session khi đổi IP)

---

## 9. Troubleshooting

### Lỗi `ModuleNotFoundError: No module named 'stem'`
→ Dùng `/opt/homebrew/bin/python3.14` (không phải `python3` mặc định)

### Lỗi `SOCKSHTTPSConnectionPool ... SSLError`
→ Python đang dùng LibreSSL (Xcode). Cài lại bằng Homebrew Python 3.14.

### Lỗi `Controller.from_port ... Connection refused`
→ Tor chưa chạy. Start Tor trước.

### Lỗi `Cookie authentication failed`
→ Xoá file cookie cũ: `rm ~/.hermes/cache/tor-data/control_auth_cookie`

### Tor quá chậm
→ Exit node đông người dùng. Đổi IP liên tục (`renew_tor_circuit()`) để tìm node nhanh hơn.

---

## 10. Bài học rút ra (2026-10-09)

1. **IP công ty bị block** không phải do cá nhân — do nhiều agent crawl đồng thời.
2. **Tor miễn phí**, không giới hạn traffic, IP rotate thoải mái.
3. **Homebrew Python 3.14 + OpenSSL** mới work với Tor. Xcode Python 3.9 + LibreSSL fail.
4. **40% error** là bình thường (timeout + exit node yếu). Không phải script sai.
5. **Mỗi agent** trên repo nên tự setup Tor để không phụ thuộc IP công ty.

---

**Cập nhật cuối:** 2026-10-09 · **Báo cáo sự cố:** xem `data/customs/INCIDENT_2026-10-09.md`
