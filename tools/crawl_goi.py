#!/usr/bin/env python3
"""
crawl_goi.py — Generic tool crawl N TB-TCHQ từ 1 gói bất kỳ trong hang-doi-tb-tchq.json.

Usage:
  python3 tools/crawl_goi.py <goi_id> [date]
  python3 tools/crawl_goi.py goi-083
  python3 tools/crawl_goi.py goi-083 2026-10-14

Theo hướng dẫn CONTRIBUTING.md:
- 1 tiến trình, delay >= 1s giữa các URL
- Che thông tin khách hàng (##DN##, ##MST##)
- Bài học từ goi-058: tracuuhs.com = SPA, dùng Playwright
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
DELAY_MS = 1500  # 1.5s giữa các request (CONTRIBUTING yêu cầu >= 1s)


def che_thong_tin_khach_hang(text: str) -> str:
    """Che DN, MST, số tờ khai, địa chỉ cụ thể."""
    if not text:
        return text
    text = re.sub(
        r"(?:Công ty|Cty|C\.ty|Tập đoàn|Tập đoàn CP)\s+[A-ZÀ-Ỹ][^,.\n]{2,80}(?:\s+(?:CP|Cổ phần|TNHH|Một thành viên|MTV))?",
        "##DN##", text
    )
    text = re.sub(r"\b\d{10}(?:-\d{3})?\b", "##MST##", text)
    text = re.sub(r"\b\d{13}\b", "##MST##", text)
    text = re.sub(r"\b\d{6,8}/[A-Z]\d{1,3}\b", "##MST##/TK", text)
    return text


def parse_so_hieu(so_hieu: str) -> dict:
    m = re.match(r"(\d+)/TB-TCHQ/(\d{4})", so_hieu)
    if m:
        return {"so_hieu": so_hieu, "nam": int(m.group(2))}
    return {"so_hieu": so_hieu, "nam": None}


def extract_loai_vb(text: str) -> str:
    t = text.lower()
    if "đính chính" in t:
        return "DINH_CHINH"
    if "xác định trước" in t:
        return "XAC_DINH_TRUOC"
    if "kết quả phân loại" in t or "kết quả xác định" in t:
        return "KET_QUA_PHAN_LOAI"
    return "KET_QUA_PHAN_LOAI"


async def crawl_one(page, url, so_hieu, nhom_hs):
    try:
        await page.goto(url, wait_until="networkidle", timeout=25000)
        await asyncio.sleep(0.3)

        body_text = await page.inner_text("body")
        if not body_text or "không tìm thấy" in body_text.lower()[:200]:
            return {"so_hieu": so_hieu, "url": url, "loi": "404 hoặc không có nội dung"}

        title = await page.title()
        loai_vb = extract_loai_vb(body_text)

        # Mã HS: ưu tiên dotted 4.2.2, fallback 8 số, cuối cùng 6 số
        ma_hs = None
        m = re.search(r"\b(\d{4}\.\d{2}\.\d{2})\b", body_text)
        if m:
            ma_hs = m.group(1).replace(".", "")
        if not ma_hs:
            m = re.search(r"\b(\d{8})\b", body_text)
            if m:
                ma_hs = m.group(1)
        if not ma_hs:
            m = re.search(r"\b(\d{4}\.\d{2})\b", body_text)
            if m:
                ma_hs = m.group(1).replace(".", "")

        noi_dung = che_thong_tin_khach_hang(body_text)

        ten_hang = None
        m = re.search(r"Tên hàng theo khai báo[:\s]+(.{10,500}?)(?:\n\n|;|;)", noi_dung, re.DOTALL)
        if m:
            ten_hang = m.group(1).strip()
        else:
            ten_hang = title.replace(" - HSTC", "").strip()

        don_vi = None
        m = re.search(r"Đơn vị[^:]*:\s*(.{10,300}?)(?:\n\n|Số, ngày)", noi_dung, re.DOTALL)
        if m:
            don_vi = m.group(1).strip()

        mo_ta = None
        m = re.search(r"Tóm tắt mô tả[^:]*:\s*(.{10,300}?)(?:\n\n|Kết quả)", noi_dung, re.DOTALL)
        if m:
            mo_ta = m.group(1).strip()

        reason = None
        m = re.search(r"Kết quả phân loại[:\s]+(.{20,800}?)(?:\n\n|Thông báo này)", noi_dung, re.DOTALL)
        if m:
            reason = m.group(1).strip()

        return {
            "so_hieu": so_hieu,
            "nam": parse_so_hieu(so_hieu)["nam"],
            "loai_vb": loai_vb,
            "nhom_hs": nhom_hs,
            "noi_dung": noi_dung[:5000],
            "ma_hs": ma_hs,
            "ten_hang": ten_hang[:500] if ten_hang else None,
            "don_vi_xnk": don_vi[:500] if don_vi else None,
            "mo_ta": mo_ta[:500] if mo_ta else None,
            "reasonVi": reason[:800] if reason else None,
        }
    except Exception as e:
        return {"so_hieu": so_hieu, "url": url, "loi": str(e)[:200]}


async def main():
    if len(sys.argv) < 2:
        print("Usage: python3 tools/crawl_goi.py <goi_id> [date]")
        print("  vd:   python3 tools/crawl_goi.py goi-083 2026-10-14")
        sys.exit(1)

    goi_id = sys.argv[1]
    date = sys.argv[2] if len(sys.argv) > 2 else datetime.now().strftime("%Y-%m-%d")

    # Load gói
    with open(GOI_FILE) as f:
        data = json.load(f)

    goi = None
    for item in data["goi"]:
        if item["id"] == goi_id:
            goi = item
            break

    if not goi:
        print(f"❌ Không tìm thấy {goi_id}")
        sys.exit(1)

    # Output files
    out_detail = REPO / f"data/customs/processed/tracuuhs-detail-{date}-{goi_id}.json"
    out_lo = REPO / f"data/customs/lo/tracuuhs-{date}-{goi_id}.json"
    out_bao_cao = REPO / f"data/customs/lo/BAO-CAO-{goi_id}.md"

    with open(ENVELOPE_MAU) as f:
        mau = json.load(f)

    print(f"📦 {goi['id']} · {goi['tieu_de']} · {goi['so_luong']} TB · {date}")
    print(f"⏱️  delay {DELAY_MS}ms giữa các request")
    print(f"📁 Detail: {out_detail.relative_to(REPO)}")
    print(f"📁 Lô:     {out_lo.relative_to(REPO)}")
    print(f"📁 Báo cáo: {out_bao_cao.relative_to(REPO)}")
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

        total = len(goi["tb"])
        for i, tb in enumerate(goi["tb"], 1):
            so_hieu = tb["so_hieu"]
            url = tb["url"]
            nhom_hs = tb["nhom_hs"]
            print(f"  [{i:2d}/{total}] {so_hieu} ({nhom_hs}) ...", end=" ", flush=True)
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
            if i < total:
                await asyncio.sleep(DELAY_MS / 1000)

        await browser.close()

    # Build envelope DETAIL
    envelope_detail = {
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
    out_detail.parent.mkdir(parents=True, exist_ok=True)
    with open(out_detail, "w") as f:
        json.dump(envelope_detail, f, ensure_ascii=False, indent=2)

    print()
    print(f"✅ Xong crawl: {len(records)}/{total} bản ghi, {fail} fail")
    print(f"📁 Detail saved: {out_detail.relative_to(REPO)}")
    print(f"📊 Size: {out_detail.stat().st_size:,} bytes")

    from collections import Counter
    loai_count = Counter(r.get("loai_vb") for r in records)
    print(f"📈 Loai VB: {dict(loai_count)}")
    print()
    print("👉 Tiếp: chạy tool đóng gói (xem wrapper process_goi.sh)")

    return goi_id, len(records), total


if __name__ == "__main__":
    asyncio.run(main())
