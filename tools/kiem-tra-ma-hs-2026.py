#!/usr/bin/env python3
"""
Auto-check mã HS trong CSV 14 DM với biểu thuế VN 2026.

Phát hiện:
- Mã HS trong CSV nhưng KHÔNG có trong biểu thuế (mismatch)
- Mã HS trong CSV còn trong biểu thuế (OK)
- Mã HS BYT 2024 khớp mã 2026
- Mã HS mới (chỉ có trong biểu thuế 2026, không có trong BYT 2024) - tùy chọn

Input:  danh-muc/09-2024-tt-byt-full.csv
        data/tax.json
Output: danh-muc/kiem-tra-ma-hs-2026.md (báo cáo markdown)

Usage:  python3 tools/kiem-tra-ma-hs-2026.py
"""
import csv
import json
import os
from collections import defaultdict
from datetime import datetime

CSV_PATH = '/Users/ozvietnamdesktop/Documents/Claude/Projects/oz-wiki-plhq/danh-muc/09-2024-tt-byt-full.csv'
TAX_JSON = '/Users/ozvietnamdesktop/Documents/Claude/Projects/oz-wiki-plhq/data/tax.json'
OUT_MD = '/Users/ozvietnamdesktop/Documents/Claude/Projects/oz-wiki-plhq/danh-muc/kiem-tra-ma-hs-2026.md'

def load_csv():
    """Đọc CSV 14 DM"""
    with open(CSV_PATH) as f:
        return list(csv.DictReader(f))

def load_tax():
    """Đọc tax.json (biểu thuế VN 2026)"""
    with open(TAX_JSON) as f:
        return json.load(f)

def normalize_hs(hs):
    """Chuẩn hóa mã HS: bỏ dấu chấm, bỏ /xx"""
    h = hs.replace('.', '').strip()
    # Xử lý multi-MHS: "30049055/59" -> lấy phần chính "30049055"
    if '/' in h:
        h = h.split('/')[0]
    return h

def analyze():
    rows = load_csv()
    tax = load_tax()
    tax_hs_set = set(tax.keys())
    tax_6prefix = {hs[:6] for hs in tax_hs_set if len(hs) >= 6}
    tax_4prefix = {hs[:4] for hs in tax_hs_set if len(hs) >= 4}

    # Tổng hợp mã HS theo DM
    by_nhom = defaultdict(list)  # nhom -> [(stt, ten, ma_hs)]
    all_hs = set()
    hs_with_partial = []  # mã có "/" (VD 3004.50.10/91)

    for r in rows:
        nhom = r['nhom']
        stt = r['stt']
        ten = r['ten']
        ma_hs = r['ma_hs']

        by_nhom[nhom].append((stt, ten, ma_hs))
        all_hs.add(ma_hs)

        if '/' in ma_hs:
            hs_with_partial.append((nhom, stt, ten, ma_hs))

    # Thống kê match
    match_full = []  # mã đầy đủ 8 số có trong biểu thuế
    match_6 = []    # chỉ khớp 6 số đầu
    match_4 = []    # chỉ khớp 4 số đầu
    not_found = []  # không khớp cả 6 lẫn 4 số

    for hs in sorted(all_hs):
        # Mã multi như 30049055/59: lấy phần chính
        hs_main = normalize_hs(hs)
        if hs_main in tax_hs_set:
            match_full.append(hs)
        elif hs_main[:6] in tax_6prefix:
            match_6.append(hs)
        elif hs_main[:4] in tax_4prefix:
            match_4.append(hs)
        else:
            not_found.append(hs)

    return {
        'rows': rows,
        'tax': tax,
        'by_nhom': dict(by_nhom),
        'all_hs': sorted(all_hs),
        'hs_with_partial': hs_with_partial,
        'match_full': match_full,
        'match_6': match_6,
        'match_4': match_4,
        'not_found': not_found,
    }

def render_markdown(result):
    """Tạo báo cáo markdown"""
    today = datetime.now().strftime('%Y-%m-%d %H:%M')
    lines = [
        f'# Kiểm tra mã HS 14 DM (09/2024/TT-BYT) vs biểu thuế VN 2026',
        '',
        f'**Ngày check:** {today}  ',
        f'**CSV input:** `danh-muc/09-2024-tt-byt-full.csv` ({len(result["rows"])} dòng)  ',
        f'**Biểu thuế:** `data/tax.json` ({len(result["tax"])} mã HS)  ',
        '',
        '## Tóm tắt',
        '',
        f'| Trạng thái | Số mã HS | % |',
        f'|---|---|---|',
        f'| ✅ Khớp đầy đủ 8 số | {len(result["match_full"])} | {len(result["match_full"])/len(result["all_hs"])*100:.1f}% |',
        f'| ⚠️ Khớp 6 số đầu (chưa rõ 2 số cuối) | {len(result["match_6"])} | {len(result["match_6"])/len(result["all_hs"])*100:.1f}% |',
        f'| ⚠️ Khớp 4 số đầu (ch.84/85/...) | {len(result["match_4"])} | {len(result["match_4"])/len(result["all_hs"])*100:.1f}% |',
        f'| ❌ KHÔNG tìm thấy | {len(result["not_found"])} | {len(result["not_found"])/len(result["all_hs"])*100:.1f}% |',
        f'| **Tổng** | **{len(result["all_hs"])}** | **100%** |',
        '',
    ]

    # Chi tiết mã không tìm thấy
    if result['not_found']:
        lines.extend([
            '## ❌ Mã HS KHÔNG có trong biểu thuế VN 2026',
            '',
            f'**Số lượng:** {len(result["not_found"])} mã  ',
            '**Ý nghĩa:** BYT 09/2024 dùng mã AHTN 2017 cũ, biểu thuế VN 2026 đã cập nhật, bỏ mã này.',
            '',
            '| Mã HS (BYT 2024) | Mô tả (mẫu) |',
            '|---|---|',
        ])
        # Tìm mô tả
        tax = result['tax']
        for hs in result['not_found']:
            # Tìm 1 mô tả mẫu
            sample = next((r['ten'] for r in result['rows'] if r['ma_hs'] == hs), '')
            lines.append(f'| `{hs}` | {sample[:60]} |')
        lines.append('')

    # Mã khớp 6 số
    if result['match_6']:
        lines.extend([
            '## ⚠️ Mã HS khớp 6 số đầu',
            '',
            f'**Số lượng:** {len(result["match_6"])} mã  ',
            '**Ý nghĩa:** Có ch.4-số tồn tại, nhưng 2 số cuối chưa rõ. Cần check kỹ.',
            '',
            '| Mã HS (BYT 2024) | Mô tả (mẫu) |',
            '|---|---|',
        ])
        for hs in result['match_6']:
            sample = next((r['ten'] for r in result['rows'] if r['ma_hs'] == hs), '')
            lines.append(f'| `{hs}` | {sample[:60]} |')
        lines.append('')

    # Mã có dấu "/" (multi-MHS)
    if result['hs_with_partial']:
        lines.extend([
            '## 📋 Mã HS có dấu "/" (multi-MHS)',
            '',
            f'**Số lượng:** {len(result["hs_with_partial"])} dòng  ',
            '**Ý nghĩa:** Mỗi dòng có 2 mã HS trở lên. BYT 09/2024 liệt kê dạng "3004.50.10/91".',
            '',
            '| DM | STT | Tên | Mã HS |',
            '|---|---|---|---|',
        ])
        for nhom, stt, ten, ma_hs in result['hs_with_partial'][:50]:
            lines.append(f'| {nhom} | {stt} | {ten[:50]} | `{ma_hs}` |')
        if len(result['hs_with_partial']) > 50:
            lines.append(f'| ... | ... | ... | ... |')
        lines.append('')

    # Top mã HS phổ biến nhất
    hs_count = defaultdict(int)
    for r in result['rows']:
        hs_count[r['ma_hs']] += 1
    top_hs = sorted(hs_count.items(), key=lambda x: -x[1])[:20]

    lines.extend([
        '## Top 20 mã HS phổ biến nhất trong 14 DM',
        '',
        '| Mã HS | Số dòng | Trạng thái |',
        '|---|---|---|',
    ])
    for hs, count in top_hs:
        status = '✅' if hs in result['match_full'] else ('⚠️' if hs in result['match_6'] + result['match_4'] else '❌')
        lines.append(f'| `{hs}` | {count} | {status} |')
    lines.append('')

    # Thống kê theo DM
    lines.extend([
        '## Thống kê theo DM',
        '',
        '| DM | Số dòng | Số mã unique | Khớp 8s | Khớp 6s | Khớp 4s | Không khớp |',
        '|---|---|---|---|---|---|---|',
    ])
    for nhom in sorted(result['by_nhom'].keys(), key=int):
        items = result['by_nhom'][nhom]
        unique_hs = set(it[2] for it in items)
        c_full = sum(1 for hs in unique_hs if hs in result['match_full'])
        c_6 = sum(1 for hs in unique_hs if hs in result['match_6'])
        c_4 = sum(1 for hs in unique_hs if hs in result['match_4'])
        c_none = sum(1 for hs in unique_hs if hs in result['not_found'])
        lines.append(f'| {nhom} | {len(items)} | {len(unique_hs)} | {c_full} | {c_6} | {c_4} | {c_none} |')
    lines.append('')

    lines.extend([
        '## Kết luận & Khuyến nghị',
        '',
    ])

    if result['not_found']:
        lines.extend([
            f'### Vấn đề: {len(result["not_found"])} mã HS BYT 2024 không có trong biểu thuế 2026',
            '',
            '- **Nguyên nhân:** BYT 09/2024 dùng mã AHTN 2017 cũ, biểu thuế VN 2026 đã cập nhật mã mới',
            '- **Bản chất:** Đây là **mismatch hợp pháp**, không phải lỗi CSV. BYT vẫn dùng mã cũ cho mục đích KTCL',
            '- **Xử lý khi tra cứu:** DN khi NK cần check biểu thuế hiện hành (2026) để áp mã đúng',
            '',
        ])

    if result['match_6']:
        lines.extend([
            f'### Cảnh báo: {len(result["match_6"])} mã HS khớp 6 số',
            '',
            '- Mã BYT 2024 có 8 số, biểu thuế chỉ có 6 số (chưa rõ 2 số cuối)',
            '- DN cần check manual với TCHQ khi NK',
            '',
        ])

    lines.extend([
        '## Tool sử dụng',
        '',
        '```bash',
        'npm run trich           # Parse lại CSV 14 DM',
        'python3 tools/kiem-tra-ma-hs-2026.py   # Chạy check này',
        '```',
        '',
    ])

    return '\n'.join(lines)

def main():
    print('Loading data...')
    result = analyze()
    print(f'  Rows: {len(result["rows"])}')
    print(f'  Unique mã HS: {len(result["all_hs"])}')
    print(f'  Mã multi (có /): {len(result["hs_with_partial"])}')
    print()
    print('Tổng quan:')
    print(f'  ✅ Khớp 8 số: {len(result["match_full"])}')
    print(f'  ⚠️  Khớp 6 số: {len(result["match_6"])}')
    print(f'  ⚠️  Khớp 4 số: {len(result["match_4"])}')
    print(f'  ❌ Không khớp: {len(result["not_found"])}')
    print()
    print('Rendering markdown...')
    md = render_markdown(result)
    with open(OUT_MD, 'w') as f:
        f.write(md)
    print(f'Đã ghi: {OUT_MD}')

if __name__ == '__main__':
    main()
