#!/usr/bin/env python3
"""
Trích 14 DM từ VCCI body text của 09/2024/TT-BYT → CSV đầy đủ các cột.

Input:  raw/download/vcci.com.vn/2024/6/09-2024-tt-byt-body.txt
Output: danh-muc/09-2024-tt-byt-full.csv (đầy đủ cột theo từng DM)

Cấu trúc 14 DM:
- DM1-5, 7-10, 12-13: 4-cột (STT | Tên | Dạng/Công dụng | Mã HS 8-số)
- DM6: 3-cột (STT | Tên thuốc phóng xạ | Mã HS 4-số)
- DM11: 6-cột (STT | Tên VN | Bộ phận | Tên KH | Mô tả | Mã HS 8-số)
- DM14: 1 STT có nhiều MHS con (1-21 STT, 51 mã HS)
"""
import re
import csv

VCCI_BODY = '/Users/ozvietnamdesktop/Documents/Claude/Projects/oz-wiki-plhq/raw/download/vcci.com.vn/2024/6/09-2024-tt-byt-body.txt'
OUT_CSV = '/Users/ozvietnamdesktop/Documents/Claude/Projects/oz-wiki-plhq/danh-muc/09-2024-tt-byt-full.csv'

# Vị trí bắt đầu/kết thúc từng DM (đã verify)
# DM14 kết thúc tại "Văn bản liên quan" (pos 254019)
DM_BOUNDS = [
    (6204, 15282),    # DM1
    (15282, 17025),   # DM2
    (17025, 19798),   # DM3
    (19798, 20410),   # DM4
    (20410, 26673),   # DM5
    (26673, 29314),   # DM6
    (29314, 67522),   # DM7
    (67522, 125870),  # DM8
    (125870, 171153), # DM9
    (171153, 175221), # DM10
    (175221, 236578), # DM11
    (236578, 238405), # DM12
    (238405, 250331), # DM13
    (250331, 254019), # DM14 - kết thúc tại "Văn bản liên quan"
]

DM_NAMES = [
    'Danh mục 1', 'Danh mục 2', 'Danh mục 3', 'Danh mục 4', 'Danh mục 5',
    'Danh mục 6', 'Danh mục 7', 'Danh mục 8', 'Danh mục 9', 'Danh mục 10',
    'Danh mục 11', 'Danh mục 12', 'Danh mục 13', 'Danh mục 14',
]

# ============== PARSERS ==============

def clean_section(section):
    """Bỏ space trong mã HS + bỏ header (tìm STT=1 đứng 1 mình)"""
    section = re.sub(r'(\d{4}\.\d{2})\s+(\d{2})', r'\1.\2', section)
    # Tìm số "1" đứng 1 mình (sau space, theo sau là optional số khác + chữ HOA)
    m = re.search(r'(?:^|\s)1\s+(?:\d+\s+)?[A-ZÀ-Ỹ]', section)
    if m:
        section = section[m.start():]
    return section

def split_stt_lines(section, end_pattern):
    """Tách section thành các dòng theo STT, kết thúc bằng end_pattern (regex)"""
    lines = re.split(end_pattern, section)
    return [l.strip() for l in lines if l.strip()]

def parse_dm5(section):
    """DM5 có 2 phần: I. dược chất (1-59) + II. thuốc (1-65) = 124 dòng"""
    pos_ii = section.find('II. Danh mục')
    if pos_ii < 0:
        return parse_4col(section)
    sub1 = section[:pos_ii]
    sub2 = section[pos_ii:]
    m1 = parse_4col(sub1, 100)
    m2 = parse_4col(sub2, 100)
    return m1 + [(s + 59, t, d, h) for (s, t, d, h) in m2]

def parse_dm1(section):
    """DM1 có 2 phần: I. nguyên liệu độc (1-111) + II. thuốc độc (1-108) = 219 dòng
    Cả 2 phần cùng cấu trúc 4-cột nhưng STT độc lập."""
    pos_ii = section.find('II. Thuốc độc')
    if pos_ii < 0:
        return parse_4col(section)
    sub1 = section[:pos_ii]
    sub2 = section[pos_ii:]
    m1 = parse_4col(sub1, 200)
    m2 = parse_4col(sub2, 200)
    # Tránh trùng STT: cộng offset 111 cho phần 2
    return m1 + [(s + 111, t, d, h) for (s, t, d, h) in m2]

# Parse DM1-5, 7-10, 12-13: 4-cột
def parse_4col(section, max_stt=10000):
    section = clean_section(section)
    lines = split_stt_lines(section, r'(?<=\d{4}\.\d{2}\.\d{2})\s+(?=\d+\s+[A-Za-zÀ-ỹà-ỹ])')
    dangs = sorted([
        'Uống: các dạng Tiêm: các dạng',
        'Tiêm: các dạng Uống: các dạng',
        'Các dạng',
        'Dạng uống', 'Dạng tiêm', 'Dạng bôi', 'Dạng khác',
        'Dạng đặt', 'Dạng hít', 'Dạng xông', 'Dạng ngoài da',
        'Dạng phun', 'Dạng cấy', 'Dạng dán', 'Dạng ngậm', 'Dạng nhai',
        'Khí hoá lỏng', 'Khí hóa lỏng',
        'Tiêm: Các dạng', 'Tiêm: các dạng', 'Uống: các dạng',
    ], key=len, reverse=True)
    data = []
    for line in lines:
        m = re.match(r'^(\d+)\s+(.+?)\s+(\d{4}\.\d{2}\.\d{2})$', line)
        if m:
            stt = int(m.group(1))
            if 1 <= stt <= max_stt:
                rest = m.group(2)
                ma_hs = m.group(3)
                dang = ''
                ten = rest
                for d in dangs:
                    if rest.endswith(' ' + d):
                        dang = d
                        ten = rest[:-len(d)].strip()
                        break
                data.append((stt, ten, dang, ma_hs))
    return data

# Parse DM6: 3-cột, mã HS 4-số
def parse_dm6(section):
    section = clean_section(section)
    lines = split_stt_lines(section, r'(?<=\d{4})\s+(?=\d+\s+[A-ZÀ-Ỹ])')
    data = []
    for line in lines:
        m = re.match(r'^(\d+)\s+(.+?)\s+(\d{4})$', line)
        if m:
            stt = int(m.group(1))
            if 1 <= stt <= 200:
                data.append((stt, m.group(2), '', m.group(3)))
    return data

# Parse DM10: 4-cột với Công dụng
def parse_dm10(section):
    section = clean_section(section)
    lines = split_stt_lines(section, r'(?<=\d{4}\.\d{2}\.\d{2})\s+(?=\d+\s+[A-ZÀ-Ỹ])')
    data = []
    for line in lines:
        m = re.match(r'^(\d+)\s+(.+?)\s+(\d{4}\.\d{2}\.\d{2})$', line)
        if m:
            stt = int(m.group(1))
            if 1 <= stt <= 200:
                rest = m.group(2)
                ma_hs = m.group(3)
                cong_dung = ''
                ten = rest
                cd_match = re.search(r'(Vắc xin [^\d]+(?:[;,].*)?|Vaccine [^\d]+(?:[;,].*)?|Công dụng [^\d]+(?:[;,].*)?)$', rest)
                if cd_match:
                    cong_dung = cd_match.group(1).strip()
                    ten = rest[:cd_match.start()].strip()
                data.append((stt, ten, cong_dung, ma_hs))
    return data

# Parse DM11: 6-cột (STT | Tên VN | Bộ phận | Tên KH | Mô tả | Mã HS)
# Mỗi STT có thể có nhiều mã HS (multi-line)
def parse_dm11(section):
    """DM11: STT | Tên VN | Bộ phận | Tên KH Latin | Mô tả | Mã HS (8 số, có thể multi)"""
    section = re.sub(r'(\d{4}\.\d{2})\s+(\d{2})', r'\1.\2', section)
    m = re.search(r'(?:^|\s)1\s+[A-ZÀ-Ỹ]', section)
    if m:
        section = section[m.start():]
    data = []
    parts = re.split(r'(?:^|\s)(?=\d+\s+[A-ZÀ-Ỹ])', section)
    for part in parts:
        part = part.strip()
        if not part:
            continue
        m = re.match(r'^(\d+)\s+(.+)$', part, re.DOTALL)
        if not m:
            continue
        stt = int(m.group(1))
        if not (1 <= stt <= 500):
            continue
        body = m.group(2).strip()
        ma_hs_list = re.findall(r'\d{4}\.\d{2}\.\d{2}', body)
        if not ma_hs_list:
            continue
        first_ma_hs = ma_hs_list[0]
        first_pos = body.find(first_ma_hs)
        before_first = body[:first_pos].strip()
        ten_vn = before_first[:50]
        data.append((stt, ten_vn, before_first, first_ma_hs))
    return data

# Parse DM14: multi-MHS, mỗi STT có nhiều mã HS con
def parse_dm14(section):
    section = clean_section(section)
    # Cấu trúc: STT Mô tả chính - sub1: Mô tả con + MHS - sub2: ... - subN: Mô tả con + MHS
    # Cắt theo STT
    parts = re.split(r'(?<=[\d)])\s+(?=\d+\s+[A-ZÀ-Ỹ])', section)
    data = []
    for part in parts:
        part = part.strip()
        if not part:
            continue
        # Lấy STT
        m = re.match(r'^(\d+)\s+(.+)$', part, re.DOTALL)
        if not m:
            continue
        stt = int(m.group(1))
        if not (1 <= stt <= 30):
            continue
        body = m.group(2)
        # Trong body, tìm các dòng "Mô tả con - Mã_HS"
        # Mỗi entry = 1 mã HS, mô tả là phần trước mã HS
        # Nếu nhiều mã HS trong cùng STT → tách theo "- " hoặc " - "
        # Tìm tất cả mã HS
        ma_hs_list = re.findall(r'\d{4}\.\d{2}\.\d{2}', body)
        if not ma_hs_list:
            continue
        # Lấy mô tả chính = phần trước mã HS đầu tiên
        first_ma_hs = ma_hs_list[0]
        first_pos = body.find(first_ma_hs)
        mo_ta_chinh = body[:first_pos].strip()
        # Bỏ "-" ở đầu nếu có
        mo_ta_chinh = re.sub(r'^[-\s]+', '', mo_ta_chinh)
        data.append((stt, mo_ta_chinh, 'multi-MHS', first_ma_hs))
    return data

# ============== MAIN ==============

# Parse DM8: nhiều STT có 2 dạng dùng (Dạng A MHS1 + Dạng B MHS2) hoặc mã HS có dấu "/"
def parse_dm8(section):
    """DM8: thuốc 1 thành phần - mỗi STT có thể có 1-2 dòng mã HS"""
    # Fix mã HS bị split: "3004. 90. 99" -> "3004.90.99"
    section = re.sub(r'(\d{4})\.\s+(\d{2})\.\s+(\d{2})', r'\1.\2.\3', section)
    section = re.sub(r'(\d{4}\.\d{2})\s+(\d{2})', r'\1.\2', section)
    # DM8 STT 1 bắt đầu bằng "1 2, 4 Dichlorobenzyl" - pattern đặc biệt
    m = re.search(r'\b1\s+[\d, ]+\s*[A-ZÀ-Ỹ]', section)
    if m:
        section = section[m.start():]
        # Bỏ số "1" đầu tiên trong STT
        section = re.sub(r'^1\s+', '', section)
    data = []
    # Tách theo STT - thay placeholder rồi split (look-behind cần fixed-width)
    section_marker = section.replace(' \n', ' \u0001 ')
    # Match: 4 số . 2 số [/số]? (có thể .2 số) + space + số 1-4 + space + chữ HOA
    # Dùng lambda để chèn ký tự phân cách
    SEP = ''
    def replacer(m):
        return m.group(1) + SEP + m.group(2)
    section_marker = re.sub(
        r'(\d{4}\.\d{2}(?:\.\d{2})?(?:/\d{2,4})?)\s+(\d{1,4}\s+[A-ZÀ-Ỹ])',
        replacer,
        section_marker
    )
    parts = section_marker.split(SEP)
    dangs = sorted([
        'Uống: các dạng Tiêm: các dạng', 'Tiêm: các dạng Uống: các dạng',
        'Các dạng', 'Dạng uống', 'Dạng tiêm', 'Dạng bôi', 'Dạng khác',
        'Dạng đặt', 'Dạng hít', 'Dạng xông', 'Dạng ngoài da',
        'Dạng phun', 'Dạng cấy', 'Dạng dán', 'Dạng ngậm', 'Dạng nhai',
        'Khí hoá lỏng', 'Khí hóa lỏng',
        'Tiêm: Các dạng', 'Tiêm: các dạng', 'Uống: các dạng',
        'Dạng uống hoặc dạng mỡ', 'Dạng khác',
    ], key=len, reverse=True)
    for part in parts:
        part = part.strip()
        if not part:
            continue
        m = re.match(r'^(\d+)\s+(.+)$', part, re.DOTALL)
        if not m:
            continue
        stt = int(m.group(1))
        if not (1 <= stt <= 1500):
            continue
        body = m.group(2).strip()
        # Mã HS có thể có dấu "/" (VD 3004.90.55/59) hoặc nhiều mã cách nhau
        # Lấy mã HS đầu tiên
        ma_hs_match = re.search(r'(\d{4}\.\d{2}(?:\.\d{2})?(?:/\d{2,4})?)', body)
        if not ma_hs_match:
            continue
        ma_hs = ma_hs_match.group(1)
        # Phần trước mã HS = tên + dạng
        before = body[:ma_hs_match.start()].strip()
        # Tìm dạng dùng ở cuối
        dang = ''
        ten = before
        for d in dangs:
            if before.endswith(' ' + d):
                dang = d
                ten = before[:-len(d)].strip()
                break
        data.append((stt, ten, dang, ma_hs))
    return data

def main():
    with open(VCCI_BODY) as f:
        text = f.read()

    all_rows = []
    for dm_idx, (start, end) in enumerate(DM_BOUNDS):
        dm_num = dm_idx + 1
        section = text[start:end]

        if dm_num == 1:
            parsed = parse_dm1(section)
        elif dm_num == 5:
            parsed = parse_dm5(section)
        elif dm_num == 6:
            parsed = parse_dm6(section)
        elif dm_num == 10:
            parsed = parse_dm10(section)
        elif dm_num == 11:
            parsed = parse_dm11(section)
        elif dm_num == 14:
            parsed = parse_dm14(section)
        elif dm_num == 7:
            parsed = parse_4col(section)  # DM7 = 4-col
        elif dm_num == 8:
            parsed = parse_dm8(section)  # DM8: multi-MHS
        else:
            # DM2-4, 9, 12-13
            parsed = parse_4col(section)

        print(f'DM{dm_num}: {len(parsed)} entries')
        for stt, ten, dang, ma_hs in parsed:
            all_rows.append({
                'nhom': str(dm_num),
                'stt': str(stt),
                'ten': ten,
                'dang_dung': dang,
                'ma_hs': ma_hs.replace('.', ''),
                'dm': DM_NAMES[dm_idx],
            })

    # Ghi CSV
    with open(OUT_CSV, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['nhom', 'stt', 'ten', 'dang_dung', 'ma_hs', 'dm'])
        writer.writeheader()
        writer.writerows(all_rows)

    print(f'\nTổng: {len(all_rows)} dòng → {OUT_CSV}')

if __name__ == '__main__':
    main()
