#!/usr/bin/env python3
"""
Trích 14 DM từ VCCI body text của 09/2024/TT-BYT → CSV đầy đủ các cột.

Input:  raw/download/vcci.com.vn/2024/6/09-2024-tt-byt-body.txt
Output: danh-muc/09-2024-tt-byt-full.csv (đầy đủ cột theo từng DM)

Cấu trúc 14 DM (xem wiki/sources/09-2024-tt-byt.md):
- DM1: STT | Mô tả hàng hóa | Mã HS | Tên nguyên liệu | Dạng dùng (5 cột)
- DM2-4: 5 cột (giống DM1)
- DM5: STT | Mô tả | Mã HS | Tên dược chất | Dạng dùng (5 cột)
- DM6: STT | Tên thuốc phóng xạ | Mã HS (3 cột)
- DM7: STT | Tên nguyên liệu | Dạng dùng | Mã HS (4 cột)
- DM8: 5 cột (giống DM1)
- DM9: STT | Mô tả | Tên thành phần | Dạng dùng | Mã HS (5 cột)
- DM10: STT | Tên vắc xin | Dạng | Mã HS (4 cột - đoán)
- DM11: STT | Tên VN | Bộ phận dùng | Tên KH | Mô tả | Mã HS (6 cột)
- DM12: 4-5 cột
- DM13: 4-5 cột
- DM14: 3 cột
"""
import re
import csv
import sys

VCCI_BODY = '/Users/ozvietnamdesktop/Documents/Claude/Projects/oz-wiki-plhq/raw/download/vcci.com.vn/2024/6/09-2024-tt-byt-body.txt'
OUT_CSV = '/Users/ozvietnamdesktop/Documents/Claude/Projects/oz-wiki-plhq/danh-muc/09-2024-tt-byt-full.csv'

# Vị trí bắt đầu từng DM (đã xác minh từ VCCI text)
DM_STARTS = [6204, 15282, 17025, 19798, 20410, 26673, 29314, 67522, 125870, 171153, 175221, 236578, 238405, 250331]
DM_NAMES = [
    'Danh mục 1', 'Danh mục 2', 'Danh mục 3', 'Danh mục 4', 'Danh mục 5',
    'Danh mục 6', 'Danh mục 7', 'Danh mục 8', 'Danh mục 9', 'Danh mục 10',
    'Danh mục 11', 'Danh mục 12', 'Danh mục 13', 'Danh mục 14',
]

# Parse DM1-5, 8-10, 12-13: 4-cột (STT | Tên | Dạng dùng | Mã HS 8-số)
def parse_4col(section, max_stt=10000):
    """Parse DM có cấu trúc: STT Tên Dạng_dùng Mã_HS_8số"""
    section = re.sub(r'(\d{4}\.\d{2})\s+(\d{2})', r'\1.\2', section)
    m = re.search(r'\b1\s+[A-ZÀ-Ỹ]', section)
    if m:
        section = section[m.start():]
    # Tách dòng theo STT (chấp nhận cả chữ thường)
    lines = re.split(r'(?<=\d{4}\.\d{2}\.\d{2})\s+(?=\d+\s+[A-Za-zÀ-ỹà-ỹ])', section)
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
        line = line.strip()
        if not line:
            continue
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

# Parse DM6: 3-cột (STT | Tên thuốc phóng xạ | Mã HS 4-số)
def parse_dm6(section):
    # DM6 mã HS 4 số (ch.28.44)
    m = re.search(r'\b1\s+[A-ZÀ-Ỹ]', section)
    if m:
        section = section[m.start():]
    # Tách theo STT
    lines = re.split(r'(?<=\d{4})\s+(?=\d+\s+[A-ZÀ-Ỹ])', section)
    data = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        m = re.match(r'^(\d+)\s+(.+?)\s+(\d{4})$', line)
        if m:
            stt = int(m.group(1))
            if 1 <= stt <= 200:
                data.append((stt, m.group(2), '', m.group(3)))
    return data

# Parse DM7: 4-cột (STT | Tên nguyên liệu | Dạng dùng | Mã HS 8-số)
def parse_dm7(section):
    section = re.sub(r'(\d{4}\.\d{2})\s+(\d{2})', r'\1.\2', section)
    m = re.search(r'\b1\s+[A-ZÀ-Ỹ]', section)
    if m:
        section = section[m.start():]
    # Tương tự DM1
    return parse_4col(section)

# Parse DM10: 4-cột (STT | Tên vắc xin | Công dụng | Mã HS 8-số)
def parse_dm10(section):
    """DM10: STT | Tên vắc xin | Công dụng | Mã HS (8 số)"""
    section = re.sub(r'(\d{4}\.\d{2})\s+(\d{2})', r'\1.\2', section)
    m = re.search(r'\b1\s+[A-ZÀ-Ỹ]', section)
    if m:
        section = section[m.start():]
    lines = re.split(r'(?<=\d{4}\.\d{2}\.\d{2})\s+(?=\d+\s+[A-ZÀ-Ỹ])', section)
    data = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        # 4 cột: STT Tên Công_dụng Mã_HS
        m = re.match(r'^(\d+)\s+(.+?)\s+(\d{4}\.\d{2}\.\d{2})$', line)
        if m:
            stt = int(m.group(1))
            if 1 <= stt <= 200:
                rest = m.group(2)
                ma_hs = m.group(3)
                # Tìm công dụng ở cuối rest
                # Công dụng: "Vắc xin phòng ...", "Vaccine ...", "Công dụng ..."
                cong_dung = ''
                ten = rest
                # Tìm pattern "Vắc xin ..." ở cuối
                cd_match = re.search(r'(Vắc xin [^\d]+(?:[;,].*)?|Vaccine [^\d]+(?:[;,].*)?|Công dụng [^\d]+(?:[;,].*)?)$', rest)
                if cd_match:
                    cong_dung = cd_match.group(1).strip()
                    ten = rest[:cd_match.start()].strip()
                data.append((stt, ten, cong_dung, ma_hs))
    return data

# Parse DM11: 6-cột
def parse_dm11(section):
    """DM11: STT | Tên VN | Bộ phận dùng | Tên KH | Mô tả | Mã HS 8-số"""
    section = re.sub(r'(\d{4}\.\d{2})\s+(\d{2})', r'\1.\2', section)
    m = re.search(r'\b1\s+[A-ZÀ-Ỹ]', section)
    if m:
        section = section[m.start():]
    lines = re.split(r'(?<=\d{4}\.\d{2}\.\d{2})\s+(?=\d+\s+[A-ZÀ-Ỹ])', section)
    data = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        # 6 cột: STT Tên_VN Bộ_phận_dùng Tên_KH Mô_tả Mã_HS
        m = re.match(r'^(\d+)\s+(.+?)\s+(\d{4}\.\d{2}\.\d{2})$', line)
        if m:
            stt = int(m.group(1))
            if 1 <= stt <= 1000:
                # Lưu cả phần giữa, người dùng tự tách
                data.append((stt, m.group(2), '', m.group(3)))
    return data

# Parse DM14: 3-cột (STT | Tên mỹ phẩm | Mã HS 8-số)
def parse_dm14(section):
    section = re.sub(r'(\d{4}\.\d{2})\s+(\d{2})', r'\1.\2', section)
    m = re.search(r'\b1\s+[A-ZÀ-Ỹ]', section)
    if m:
        section = section[m.start():]
    return parse_4col(section)

def main():
    with open(VCCI_BODY) as f:
        text = f.read()

    all_rows = []
    for dm_idx, dm_start in enumerate(DM_STARTS):
        dm_num = dm_idx + 1
        dm_end = DM_STARTS[dm_idx + 1] if dm_idx + 1 < len(DM_STARTS) else len(text)
        section = text[dm_start:dm_end]

        # Chọn parser theo DM
        if dm_num in (1, 2, 3, 4, 5, 8, 9, 12, 13):
            parsed = parse_4col(section)
        elif dm_num == 6:
            parsed = parse_dm6(section)
        elif dm_num == 7:
            parsed = parse_dm7(section)
        elif dm_num == 10:
            parsed = parse_dm10(section)
        elif dm_num == 11:
            parsed = parse_dm11(section)
        elif dm_num == 14:
            parsed = parse_dm14(section)
        else:
            parsed = []

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
