#!/usr/bin/env python3
"""Crawl goi-NNN từ tracuuhs.com (Supabase backend) - ghi detail theo envelope hiện có."""
import urllib.request, ssl, re, json, sys
from datetime import date

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def get_jwt():
    url_js = "https://www.tracuuhs.com/assets/index-Eg2yKW7A.js"
    req = urllib.request.Request(url_js, headers={'User-Agent': 'Mozilla/5.0'})
    resp = urllib.request.urlopen(req, timeout=30, context=ctx)
    js = resp.read().decode('utf-8', errors='ignore')
    jwts = re.findall(r'eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}', js)
    return jwts[0]

def crawl_slugs(slugs, jwt):
    slugs_in = ",".join(f'"{s}"' for s in slugs)
    url = f"https://xigctceoqxvxfubkgluy.supabase.co/rest/v1/articles?select=id,slug,content&slug=in.({slugs_in})"
    headers = {
        'apikey': jwt,
        'Authorization': f'Bearer {jwt}',
        'User-Agent': 'Mozilla/5.0',
    }
    req2 = urllib.request.Request(url, headers=headers)
    resp2 = urllib.request.urlopen(req2, timeout=30, context=ctx)
    return json.loads(resp2.read().decode('utf-8'))

# Parsers
def parse_loai_vb(content):
    m = re.search(r'\|\s*Loại văn bản\s*\|\s*([^\n|]+?)\s*\|', content)
    if m:
        v = m.group(1).strip()
        if 'Xác định' in v:
            return 'Xác định trước mã số'
        return v
    return 'Phân loại hàng hóa'

def parse_ma_hs_header(content):
    m = re.search(r'\|\s*Mã HS\s*\|\s*([0-9.xX ]+?)\s*\|', content)
    if m:
        v = m.group(1).strip()
        v = re.sub(r'\.+$', '', v)
        # Bỏ tất cả dấu chấm
        v = v.replace('.', '')
        if re.search(r'\d', v):
            return v
    return None

def parse_noi_dung(content):
    m = re.search(r'##\s*Nội dung phân loại\s*\n+(.*?)\n+---\s*\n+HSTC', content, re.DOTALL)
    return m.group(1).strip() if m else content

def parse_ten_hang(noi_dung, loai_vb):
    """Tìm tên hàng - linh hoạt xuống dòng."""
    # Pattern 1: "Tên thương mại: X" (XĐTMS thường)
    m = re.search(r'Tên thương mại\s*[:.]\s*([^\n]+)', noi_dung)
    if m:
        text = m.group(1).strip()
        text = re.split(r'\n\s*Tên gọi theo cấu tạo', text)[0]
        text = re.sub(r'^Mục\s+\d+\s*[:.]\s*', '', text, flags=re.IGNORECASE)
        return re.sub(r'\s+', ' ', text).strip()

    # Pattern 2: "1. Tên hàng theo khai báo: X" (Phân loại)
    m = re.search(r'1\.\s*Tên\s*\n?\s*hàng[^:\n]*[:.]\s*([^\n]+)', noi_dung)
    if m:
        text = m.group(1).strip()
        # Bỏ phần "Tên gọi theo cấu tạo" nếu lẫn vào
        text = re.split(r'\n\s*Tên gọi theo cấu tạo', text)[0]
        return re.sub(r'\s+', ' ', text).strip()

    return None

def parse_don_vi_xnk(noi_dung):
    """Tìm '2. Đơn vị' - dừng trước '3. Số' hoặc '3. Tóm tắt' """
    # Tìm "2. Đơn vị" ở đầu dòng
    m = re.search(r'(?:^|\n)\s*2\.\s*Đơn\s*\n?\s*vị[\s\S]+?(?=[\n]\s*3\.\s+(?:Số|Tóm tắt|Đơn vị|To))', noi_dung)
    if m:
        text = m.group(0)
        # Bỏ header
        text = re.sub(r'^\s*2\.\s*Đơn\s*\n?\s*vị[^\n]*:\s*', '', text)
        # Che MST/CCCD
        text = re.sub(r'(mã số thuế|MST)\s*[:]\s*\d+', r'\1: ##MST##', text, flags=re.IGNORECASE)
        text = re.sub(r'(số\s*CMND/CCCD|CCCD/CMND)\s*[:]\s*[\d\-\s]+', r'\1: ##MST##', text, flags=re.IGNORECASE)
        # Bỏ phần "3. Số" còn sót (nếu có)
        text = re.split(r'[\n]\s*3\.\s+Số', text)[0]
        return re.sub(r'\s+', ' ', text).strip()
    return None

def parse_mo_ta(noi_dung):
    """Tìm 'Tóm tắt mô tả' - dừng trước '5. Kết quả' hoặc '4. Kết quả' """
    m = re.search(r'(?:^|\n)\s*\d\.\s*Tóm tắt\s*\n?\s*mô tả[\s\S]+?(?=\n\s*\d\.\s+(?:Kết quả|Căn cứ|Thông số))', noi_dung)
    if m:
        text = m.group(0)
        # Bỏ phần header "X. Tóm tắt mô tả hàng hóa được xác định trước mã số: "
        text = re.sub(r'^\s*\d\.\s*Tóm tắt\s*\n?\s*mô tả[^:\n]*:\s*', '', text)
        return re.sub(r'\s+', ' ', text).strip()
    return None

def parse_reason_vi(noi_dung):
    """Tìm 'thuộc nhóm' / 'Thuộc nhóm' đến 'tại Danh mục' hoặc 'Thông báo này'"""
    m = re.search(r'[Tt]huộc\s*nhóm\s+[\d.]+[\s\S]*?(?:tại Danh mục[\s\S]*?\.|Thông báo này[\s\S]*?\.)', noi_dung)
    if m:
        text = m.group(0)
        return re.sub(r'\s+', ' ', text).strip()
    return None

def parse_ma_hs_from_reason(reason):
    if not reason:
        return None
    m = re.search(r'mã số\s+([0-9]{4}\.[0-9]{2}\.[0-9]{2})', reason)
    return m.group(1).replace('.', '') if m else None

def main(goi_id, tb_list):
    jwt = get_jwt()
    slugs = []
    for tb in tb_list:
        num = tb['so_hieu'].split('/')[0]
        slug = f"tchq-{num}-{tb['nam']}"
        slugs.append(slug)

    data = crawl_slugs(slugs, jwt)
    found = {d['slug']: d for d in data}

    records = []
    for tb in tb_list:
        num = tb['so_hieu'].split('/')[0]
        slug = f"tchq-{num}-{tb['nam']}"

        if slug not in found:
            print(f"  ✗ {tb['so_hieu']} NOT FOUND", file=sys.stderr)
            records.append({
                "so_hieu": tb['so_hieu'],
                "nam": tb['nam'],
                "loai_vb": None,
                "nhom_hs": tb['nhom_hs'],
                "noi_dung": None,
                "ma_hs": None,
                "ten_hang": None,
                "don_vi_xnk": None,
                "mo_ta": None,
                "reasonVi": None,
                "_err": "NOT_FOUND",
            })
            continue

        content = found[slug]['content']
        noi_dung = parse_noi_dung(content)
        loai_vb = parse_loai_vb(content)
        reason = parse_reason_vi(noi_dung)
        ma_hs_from_reason = parse_ma_hs_from_reason(reason)
        ma_hs_header = parse_ma_hs_header(content)
        if ma_hs_from_reason:
            ma_hs = ma_hs_from_reason
        else:
            ma_hs = ma_hs_header
        ten_hang = parse_ten_hang(noi_dung, loai_vb)
        don_vi = parse_don_vi_xnk(noi_dung)
        mo_ta = parse_mo_ta(noi_dung)

        if ma_hs and ma_hs[:2].isdigit() and len(ma_hs) >= 4:
            nhom_hs = f"{ma_hs[:2]}.{ma_hs[2:4]}"
        elif ma_hs and ma_hs[:2].isdigit():
            nhom_hs = ma_hs[:2]
        else:
            nhom_hs = tb['nhom_hs']

        # reasonVi: lấy mã đầy đủ có dấu chấm (hiển thị) dù nội bộ ma_hs là 8 số
        reason_display = reason
        if reason and ma_hs and len(ma_hs) == 8:
            # Thay thế mã 8 số bằng dạng có dấu chấm
            reason_display = re.sub(r'\b' + ma_hs + r'\b', f"{ma_hs[:4]}.{ma_hs[4:6]}.{ma_hs[6:8]}", reason)

        records.append({
            "so_hieu": tb['so_hieu'],
            "nam": tb['nam'],
            "loai_vb": loai_vb,
            "nhom_hs": nhom_hs,
            "noi_dung": noi_dung,
            "ma_hs": ma_hs,
            "ten_hang": ten_hang,
            "don_vi_xnk": don_vi,
            "mo_ta": mo_ta,
            "reasonVi": reason_display,
        })
        print(f"  ✓ {tb['so_hieu']}: {ma_hs} - {(ten_hang or '')[:50]}")

    envelope = {
        "kind": "tracuuhs.tb-tchq.detail",
        "contributor": {"name": "legal-customs", "github": "ozvietnam"},
        "license": "CC-BY-4.0",
        "note": f"Crawl từ tracuuhs.com (Supabase backend) - goi {goi_id}",
        "submittedAt": date.today().isoformat() + "T00:00:00Z",
        "records": records,
    }
    return envelope

if __name__ == "__main__":
    goi_id = sys.argv[1]
    out_path = sys.argv[2]
    tb_list_path = sys.argv[3]

    with open(tb_list_path) as f:
        tb_list = json.load(f)

    result = main(goi_id, tb_list)
    with open(out_path, "w") as f:
        json.dump(result, f, ensure_ascii=False, indent=1)
    print(f"\n✓ Saved {len(result['records'])} records to {out_path}")
    errs = sum(1 for r in result['records'] if r.get('_err'))
    if errs:
        print(f"⚠ {errs} records NOT FOUND")
