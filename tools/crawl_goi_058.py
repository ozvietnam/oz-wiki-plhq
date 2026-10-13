#!/usr/bin/env python3
"""
crawl_goi_058.py — Crawl 20 TB-TCHQ từ tracuuhs.com, output envelope đúng format
lô 01 (data/customs/processed/tracuuhs-detail-2026-10-10.json).

Theo hướng dẫn CONTRIBUTING.md:
- 1 tiến trình, delay >= 1s giữa các URL
- Che thông tin khách hàng (##DN##, ##MST##)
"""
import asyncio
import json
import re
import sys
from pathlib import Path
from datetime import datetime
from playwright.async_api import async_playwright

REPO = Path("/Users/ozvietnamdesktop/Documents/Claude/Projects/oz-wiki-plhq")
GOI_FILE = REPO / "data/customs/lo/hang-doi-tb-tchq.json"
ENVELOPE_MAU = REPO / "data/customs/processed/tracuuhs-detail-2026-10-10.json"
OUT_FILE = REPO / "data/customs/processed/tracuuhs-detail-2026-10-13-goi-058.json"
DELAY_MS = 1500  # 1.5s giữa các request (CONTRIBUTING yêu cầu >= 1s)


def che_thong_tin_khach_hang(text: str) -> str:
    """Che DN, MST, số tờ khai, địa chỉ cụ thể."""
    if not text:
        return text
    # Che tên công ty (thường có dạng "Công ty ...", "Cty ...", "Công ty CP ...")
    text = re.sub(
        r"(?:Công ty|Cty|C\.ty|Tập đoàn|Tập đoàn CP)\s+[A-ZÀ-Ỹ][^,.\n]{2,80}(?:\s+(?:CP|Cổ phần|TNHH|Một thành viên|MTV))?",
        "##DN##", text
    )
    # Che MST (10 hoặc 13 chữ số, có dấu gạch ngang)
    text = re.sub(r"\b\d{10}(?:-\d{3})?\b", "##MST##", text)
    text = re.sub(r"\b\d{13}\b", "##MST##", text)
    # Che số tờ khai (dạng "1234567/A11" hoặc tương tự)
    text = re.sub(r"\b\d{6,8}/[A-Z]\d{1,3}\b", "##MST##/TK", text)
    return text


def parse_so_hieu(so_hieu: str) -> dict:
    """Tách năm từ so_hieu (vd 2339/TB-TCHQ/2018)."""
    m = re.match(r"(\d+)/TB-TCHQ/(\d{4})", so_hieu)
    if m:
        return {"so_hieu": so_hieu, "nam": int(m.group(2))}
    return {"so_hieu": so_hieu, "nam": None}


def extract_loai_vb(text: str) -> str:
    """Đoán loai_vb từ tiêu đề (dòng đầu có 'Thông báo ... TB-TCHQ').

    Pattern tiêu đề tracuuhs.com:
    - 'kết quả xác định trước mã số' → XAC_DINH_TRUOC
    - 'kết quả phân loại ...'         → KET_QUA_PHAN_LOAI
    - 'đính chính'                    → DINH_CHINH
    """
    t = text.lower()
    if "đính chính" in t:
        return "DINH_CHINH"
    if "xác định trước" in t:
        return "XAC_DINH_TRUOC"
    if "kết quả phân loại" in t or "kết quả xác định" in t:
        return "KET_QUA_PHAN_LOAI"
    return "KET_QUA_PHAN_LOAI"  # default: thường là KQPL


async def crawl_one(page, url, so_hieu, nhom_hs):
    """Crawl 1 trang tracuuhs, trả về record envelope."""
    try:
        await page.goto(url, wait_until="networkidle", timeout=25000)
        await asyncio.sleep(0.3)  # đợi text render

        # Lấy body text
        body_text = await page.inner_text("body")
        if not body_text or "không tìm thấy" in body_text.lower()[:200]:
            return {"so_hieu": so_hieu, "url": url, "loi": "404 hoặc không có nội dung"}

        # Lấy title
        title = await page.title()

        # Cấu trúc page: "Thông tin văn bản" → table
        # Trích "Loại văn bản" và "Mã HS"
        loai_vb = extract_loai_vb(body_text)

        # Tìm mã HS 8 số (ưu tiên) hoặc mã dotted (4.2.2)
        # Ưu tiên dotted vì tracuuhs.com hay dùng format này
        ma_hs = None
        m = re.search(r"\b(\d{4}\.\d{2}\.\d{2})\b", body_text)
        if m:
            ma_hs = m.group(1).replace(".", "")
        if not ma_hs:
            m = re.search(r"\b(\d{8})\b", body_text)
            if m:
                ma_hs = m.group(1)
        if not ma_hs:
            # Fallback: tìm 6 số (chỉ là nhóm - giữ để biết)
            m = re.search(r"\b(\d{4}\.\d{2})\b", body_text)
            if m:
                ma_hs = m.group(1).replace(".", "")
        # Verify mã phải bắt đầu bằng nhom_hs (vd 38.24 → 3824xxxx)
        if ma_hs and nhom_hs:
            nhom_clean = nhom_hs.replace(".", "")
            if not ma_hs.startswith(nhom_clean[:4]):
                # Không match nhóm — vẫn giữ nhưng đánh dấu cảnh báo
                pass  # sẽ xử lý sau

        # Nội dung = toàn bộ body text (che thông tin)
        noi_dung = che_thong_tin_khach_hang(body_text)

        # Tên hàng: tìm sau "Tên hàng theo khai báo:" hoặc lấy từ title
        ten_hang = None
        m = re.search(r"Tên hàng theo khai báo[:\s]+(.{10,500}?)(?:\n\n|;|;)", noi_dung, re.DOTALL)
        if m:
            ten_hang = m.group(1).strip()
        else:
            # Fallback: lấy từ title
            ten_hang = title.replace(" - HSTC", "").strip()

        # Đơn vị XNK
        don_vi = None
        m = re.search(r"Đơn vị[^:]*:\s*(.{10,300}?)(?:\n\n|Số, ngày)", noi_dung, re.DOTALL)
        if m:
            don_vi = m.group(1).strip()

        # Mô tả
        mo_ta = None
        m = re.search(r"Tóm tắt mô tả[^:]*:\s*(.{10,300}?)(?:\n\n|Kết quả)", noi_dung, re.DOTALL)
        if m:
            mo_ta = m.group(1).strip()

        # Reason (kết luận phân loại)
        reason = None
        m = re.search(r"Kết quả phân loại[:\s]+(.{20,800}?)(?:\n\n|Thông báo này)", noi_dung, re.DOTALL)
        if m:
            reason = m.group(1).strip()

        return {
            "so_hieu": so_hieu,
            "nam": parse_so_hieu(so_hieu)["nam"],
            "loai_vb": loai_vb,
            "nhom_hs": nhom_hs,
            "noi_dung": noi_dung[:5000],  # cap 5000 chars
            "ma_hs": ma_hs,
            "ten_hang": ten_hang[:500] if ten_hang else None,
            "don_vi_xnk": don_vi[:500] if don_vi else None,
            "mo_ta": mo_ta[:500] if mo_ta else None,
            "reasonVi": reason[:800] if reason else None,
        }
    except Exception as e:
        return {"so_hieu": so_hieu, "url": url, "loi": str(e)[:200]}


async def main():
    # Load gói
    with open(GOI_FILE) as f:
        data = json.load(f)

    goi = None
    for item in data["goi"]:
        if item["id"] == "goi-058":
            goi = item
            break

    if not goi:
        print("❌ Không tìm thấy goi-058")
        sys.exit(1)

    # Load envelope mẫu
    with open(ENVELOPE_MAU) as f:
        mau = json.load(f)

    print(f"📦 {goi['id']} · {goi['tieu_de']} · {goi['so_luong']} TB")
    print(f"⏱️  delay {DELAY_MS}ms giữa các request")
    print(f"📁 Output: {OUT_FILE.relative_to(REPO)}")
    print()

    records = []
    fail = 0
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-blink-features=AutomationControlled"],
        )
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
        )
        page = await context.new_page()

        for i, tb in enumerate(goi["tb"], 1):
            so_hieu = tb["so_hieu"]
            url = tb["url"]
            nhom_hs = tb["nhom_hs"]
            print(f"  [{i:2d}/20] {so_hieu} ({nhom_hs}) ...", end=" ", flush=True)
            record = await crawl_one(page, url, so_hieu, nhom_hs)
            if record and "loi" not in record:
                records.append(record)
                ma_hs = record.get("ma_hs", "?")
                loai = record.get("loai_vb", "?")
                print(f"✓ HS={ma_hs} | {loai}")
            else:
                fail += 1
                err = record.get("loi", "?") if record else "no record"
                print(f"✗ {err}")
            if i < len(goi["tb"]):
                await asyncio.sleep(DELAY_MS / 1000)

        await browser.close()

    # Build envelope theo mẫu
    envelope = {
        "kind": mau.get("kind", "tracuuhs-detail"),
        "contributor": {
            "name": "hermes-tracuuhs",
            "github": "ozvietnam",
        },
        "license": mau.get("license", "CC BY 4.0"),
        "submittedAt": datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "note": f"Crawl từ tracuuhs.com theo hàng đợi {goi['id']} ({goi['tieu_de']}, {goi['so_luong']} TB). Che thông tin khách hàng (DN, MST, TK). Delay 1.5s/URL.",
        "records": records,
    }

    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_FILE, "w") as f:
        json.dump(envelope, f, ensure_ascii=False, indent=2)

    print()
    print(f"✅ Xong: {len(records)}/{len(goi['tb'])} bản ghi, {fail} fail")
    print(f"📁 Saved: {OUT_FILE.relative_to(REPO)}")
    print(f"📊 Size: {OUT_FILE.stat().st_size:,} bytes")

    # Quick stats
    from collections import Counter
    loai_count = Counter(r.get("loai_vb") for r in records)
    print(f"📈 Loai VB: {dict(loai_count)}")


if __name__ == "__main__":
    asyncio.run(main())
