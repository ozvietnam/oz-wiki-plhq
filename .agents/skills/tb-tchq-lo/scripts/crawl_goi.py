"""Crawl một gói TB-TCHQ từ tracuuhs.com qua Chrome CDP.

Usage:
    python crawl_goi.py <goi_id> [--port 9226] [--date 2026-10-15]

Workflow:
1. Mở Chrome: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome \
   --headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage \
   --user-data-dir=/tmp/chrome-tho-cao-<port> --remote-debugging-port=<port> about:blank
2. Chạy script này với cùng port.

Mỗi URL: navigate → đợi 8s → lấy body.innerText → lưu cache → parse 3 loại.
Sleep 1.5s giữa các URL. Có 3 loại TB: KET_QUA_PHAN_LOAI, XAC_DINH_TRUOC, DINH_CHINH.
Che PII trước khi ghi file: ##MST##, ##DN##, ##DC##, ##TK##, ##SDT##, ##EMAIL##.

Output:
- /tmp/tb-text-cache-goi-NNN/<so_hieu>.txt  (raw text, dùng để spot-check)
- data/customs/processed/tracuuhs-detail-<date>-goi-NNN.json
"""
import argparse
import json
import os
import re
import sys
import time

import requests
import websocket


def get_tab(cdp_url):
    r = requests.get(f"{cdp_url}/json", timeout=10)
    tabs = r.json()
    for t in tabs:
        if t.get("type") == "page":
            return t
    return None


def navigate_and_get_text(ws, url, load_wait=8):
    """Navigate, đợi load, lấy body.innerText qua Runtime.evaluate."""
    msg_id = [0]

    def send(method, params=None):
        msg_id[0] += 1
        ws.send(json.dumps({"id": msg_id[0], "method": method, "params": params or {}}))
        return msg_id[0]

    send("Page.navigate", {"url": url})
    time.sleep(load_wait)
    target = send("Runtime.evaluate", {
        "expression": "document.body ? document.body.innerText : ''",
        "returnByValue": True,
    })
    ws.settimeout(15)
    while True:
        try:
            resp = ws.recv()
        except Exception:
            return ""
        data = json.loads(resp)
        if data.get("id") == target:
            return data.get("result", {}).get("result", {}).get("value", "")


# --- PII scrubbing (CONTRIBUTING + privacy) ---------------------------------
def che_pii(text):
    if not text:
        return text
    text = re.sub(r"[\w\.-]+\s*@\s*[\w\.-]+\s*\.\s*\w+", "##EMAIL##", text)
    text = re.sub(r"MST\s*[:.]?\s*\d{2}[\s\.]?\d{2,3}[\s\.]?\d{2,3}[\s\.]?\d{2,3}\b", "MST:##MST##", text, flags=re.IGNORECASE)
    text = re.sub(r"\b\d{10,13}\b", "##MST##", text)
    text = re.sub(r"\b\d{8,15}/A\d{1,2}\b", "##TK##", text)
    text = re.sub(r"\b0\d{2}[\s\.]?\d{3}[\s\.]?\d{3,4}\b", "##SDT##", text)
    text = re.sub(r"Công\s*ty\s+(?:TNHH|CP|MTV|TM|SX|TMDV|XNK|ĐT|Đầu\s*tư)\s+[A-ZĐ][^\(\),;\n\.]{2,80}", "Công ty ##DN##", text, flags=re.IGNORECASE)
    text = re.sub(r"(?:Tổng\s+)?Công\s*ty\s+[A-ZĐ][^\(\),;\n\.]{2,80}?(?=\s*[\(\),;\n\.]|$)", "##DN##", text, flags=re.IGNORECASE)
    text = re.sub(r"Đ/c\s*[:.]\s*[^;\n\.]+", "Đ/c:##DC##", text, flags=re.IGNORECASE)
    text = re.sub(r"Địa\s*chỉ\s*[:.]\s*[^;\n\.]+", "Địa chỉ:##DC##", text, flags=re.IGNORECASE)
    text = re.sub(r"\(Đ/c\s*[:.][^)]+\)", "(Đ/c:##DC##)", text, flags=re.IGNORECASE)
    text = re.sub(r"HSTC\s+là\s+công\s*cụ[^.]*\.\s*Truy\s*cập[^.]*\.", "", text, flags=re.IGNORECASE)
    return text


# --- Body extraction ---------------------------------------------------------
def get_body(text):
    # Heading IN HOA là anchor chính — không dùng "kết quả..." (xuất hiện 3-5 lần trong footer)
    m = re.search(r"VỀ\s+KẾT\s+QUẢ\s+(?:PHÂN\s+LOẠI|XÁC\s+ĐỊNH\s+TRƯỚC|SỬA\s+ĐỔI)", text, re.IGNORECASE)
    if not m:
        return text
    body = text[m.start():]
    m_end = re.search(r"Nơi\s*nhận|Thông\s*báo\s*này\s+có\s+hiệu\s+lực|HSTC\s+là", body)
    if m_end:
        body = body[:m_end.start()]
    return body


# --- 3 loại parse ------------------------------------------------------------
def parse_ket_qua_phan_loai(body, m_ma_so):
    """Anchor: 'Kết quả phân loại:' → tách tại 'thuộc nhóm X.YY'."""
    m = re.search(r"Kết\s*quả\s*phân\s*loại\s*:\s*(.+?)(?:Thông\s*báo\s*này\s+có\s+hiệu\s+lực|\.\s*/\.\s*$|$)", body, re.IGNORECASE | re.DOTALL)
    if not m:
        return None, None
    full = m.group(1).strip()
    parts = re.split(r"\.?\s*thuộc\s+nhóm\s+", full, maxsplit=1, flags=re.IGNORECASE)
    if len(parts) == 2:
        desc = re.sub(r"^Tên\s*gọi\s*theo\s*cấu\s*tạo[^:]*:\s*", "", parts[0].strip(), flags=re.IGNORECASE)
        return desc, "thuộc nhóm " + parts[1].strip()
    return None, full


def parse_xac_dinh_truoc(body):
    """Lấy Tên thương mại + Tên gọi theo cấu tạo CUỐI CÙNG (sau 'Kết quả xác định trước mã số:')."""
    m_kq = re.search(r"Kết\s*quả\s*xác\s*định\s*trước\s*mã\s*số\s*:\s*(.+?)(?:Thông\s*báo\s*này|Nơi\s*nhận|$)", body, re.IGNORECASE | re.DOTALL)
    if not m_kq:
        return None, None
    after = m_kq.group(1)
    ten_tm = list(re.finditer(r"Tên\s*thương\s*mại\s*:\s*([^\n]+)", after, re.IGNORECASE))
    ten_goi = list(re.finditer(r"Tên\s*gọi\s*theo\s*cấu\s*tạo[^:]*:\s*([^\n]+)", after, re.IGNORECASE))
    parts = []
    if ten_tm:
        parts.append(f"TM: {ten_tm[-1].group(1).strip()[:100]}")
    if ten_goi:
        parts.append(f"Tên gọi: {ten_goi[-1].group(1).strip()[:200]}")
    desc = " | ".join(parts) if parts else None

    m_thuoc = re.search(r"thuộc\s+nhóm\s+\d{2}\.\d{2}.+?(?:Việt\s*Nam|$)", body, re.IGNORECASE | re.DOTALL)
    reason = m_thuoc.group(0).strip() if m_thuoc else None
    return desc, reason


def parse_tb(text, so_hieu):
    body = get_body(text)
    if re.search(r"VỀ\s+KẾT\s+QUẢ\s+PHÂN\s+LOẠI", body, re.IGNORECASE):
        loai = "KET_QUA_PHAN_LOAI"
        desc, reason = parse_ket_qua_phan_loai(body, None)
    elif re.search(r"VỀ\s+KẾT\s+QUẢ\s+XÁC\s+ĐỊNH\s+TRƯỚC", body, re.IGNORECASE):
        loai = "XAC_DINH_TRUOC"
        desc, reason = parse_xac_dinh_truoc(body)
    elif re.search(r"VỀ\s+SỬA\s+ĐỔI", body, re.IGNORECASE):
        # DINH_CHINH — caller must set confusedWith manually
        return {"so_hieu": so_hieu, "loai": "DINH_CHINH", "needs_confusedWith": True}
    else:
        return None

    m_nhom = re.search(r"thuộc\s+nhóm\s+(\d{2}\.\d{2})", body, re.IGNORECASE)
    m_ma = re.search(r"mã[,\s]*số\s+(\d{4}\.\d{2}\.\d{2})", body, re.IGNORECASE)
    if desc:
        desc = che_pii(desc).strip()
        if not desc.endswith("."):
            desc += "."
    if reason:
        reason = che_pii(reason).strip()
    return {
        "so_hieu": so_hieu,
        "loai": loai,
        "ma_hs": m_ma.group(1).replace(".", "") if m_ma else None,
        "nhom_hs": m_nhom.group(1) if m_nhom else None,
        "description": desc,
        "reason_vi": reason,
        "loai_vb": loai,
    }


def main():
    p = argparse.ArgumentParser()
    p.add_argument("goi_id", help="vd: goi-101")
    p.add_argument("--port", type=int, default=9226)
    p.add_argument("--date", default=time.strftime("%Y-%m-%d"))
    p.add_argument("--load-wait", type=float, default=8.0, help="giây đợi mỗi trang load")
    p.add_argument("--delay", type=float, default=1.5)
    p.add_argument("--oz", default=os.path.expanduser("~/Projects/oz-wiki"))
    args = p.parse_args()

    manifest_path = f"{args.oz}/data/customs/lo/hang-doi-tb-tchq.json"
    output_path = f"{args.oz}/data/customs/processed/tracuuhs-detail-{args.date}-{args.goi_id}.json"
    cache_dir = f"/tmp/tb-text-cache-{args.goi_id}"

    os.makedirs(cache_dir, exist_ok=True)
    with open(manifest_path) as f:
        manifest = json.load(f)

    goi = next((g for g in manifest["goi"] if g["id"] == args.goi_id), None)
    if not goi:
        sys.exit(f"Không tìm thấy {args.goi_id} trong manifest")

    cdp = f"http://localhost:{args.port}"
    tab = get_tab(cdp)
    if not tab:
        sys.exit(f"Không có Chrome ở {cdp} — start Chrome trước với --remote-debugging-port={args.port}")
    print(f"Tab: {tab['url']}")

    ws = websocket.create_connection(tab["webSocketDebuggerUrl"], suppress_origin=True, timeout=30)
    records = []
    for i, tb in enumerate(goi["tb"]):
        url, sh = tb["url"], tb["so_hieu"]
        print(f"\n[{i+1}/{len(goi['tb'])}] {sh} → {url}")
        try:
            text = navigate_and_get_text(ws, url, load_wait=args.load_wait)
            if not text:
                print("  ⚠️ Empty text")
                continue
            cache_file = f"{cache_dir}/{sh.replace('/', '_')}.txt"
            with open(cache_file, "w") as f:
                f.write(text)
            print(f"  ✓ Cache: {cache_file} ({len(text)} chars)")
            rec = parse_tb(text, sh)
            if rec:
                rec["url"] = url
                rec["text_cache"] = cache_file
                records.append(rec)
                loai = rec.get("loai")
                if loai == "DINH_CHINH":
                    print(f"  ⚠️ DINH_CHINH — caller must set confusedWith + new so_hieu manually")
                else:
                    print(f"  ✓ {loai}, HS: {rec.get('ma_hs')}, Desc: {(rec.get('description') or '')[:80]}")
        except Exception as e:
            print(f"  ❌ Error: {e}")
        time.sleep(args.delay)
    ws.close()

    out = {
        "kind": "detail",
        "contributor": {"name": f"thợ-Cào", "github": "ozvietnam"},
        "license": "CC-BY-SA-4.0",
        "submittedAt": args.date,
        "note": f"{args.goi_id} - {len(records)}/{len(goi['tb'])} TB crawl thủ công qua Chrome CDP",
        "records": records,
    }
    with open(output_path, "w") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f"\nSaved: {output_path}")
    print(f"Records: {len(records)}")


if __name__ == "__main__":
    main()
