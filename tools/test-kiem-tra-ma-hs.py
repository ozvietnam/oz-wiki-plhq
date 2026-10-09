#!/usr/bin/env python3
"""Unit test cho tools/kiem-tra-ma-hs-2026.py
Chạy: python3 tools/test-kiem-tra-ma-hs.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

import kiem_tra_ma_hs_2026 as checker

def test_normalize_hs():
    """Test helper normalize_hs"""
    assert checker.normalize_hs("3004.90.89") == "30049089"
    assert checker.normalize_hs("3004.50.10/91") == "30045010"
    assert checker.normalize_hs("  2844  ") == "2844"
    assert checker.normalize_hs("3001.90.00") == "30019000"
    print("  ✓ normalize_hs: bỏ dấu chấm + xử lý multi-MHS")

def test_load_csv():
    """Test load CSV"""
    rows = checker.load_csv()
    assert len(rows) > 3000, f"CSV expected >3000 rows, got {len(rows)}"
    # Check cấu trúc
    assert 'nhom' in rows[0]
    assert 'ma_hs' in rows[0]
    print(f"  ✓ load_csv: {len(rows)} dòng")

def test_load_tax():
    """Test load tax.json"""
    tax = checker.load_tax()
    assert len(tax) > 10000, f"tax.json expected >10000 mã, got {len(tax)}"
    # Check cấu trúc
    first_key = list(tax.keys())[0]
    assert 'hs' in tax[first_key]
    assert 'vn' in tax[first_key]
    print(f"  ✓ load_tax: {len(tax)} mã HS")

def test_analyze():
    """Test hàm analyze chính"""
    result = checker.analyze()
    assert 'match_full' in result
    assert 'match_6' in result
    assert 'match_4' in result
    assert 'not_found' in result
    total = len(result['match_full']) + len(result['match_6']) + len(result['match_4']) + len(result['not_found'])
    assert total == len(result['all_hs']), f"Tổng không khớp: {total} vs {len(result['all_hs'])}"
    print(f"  ✓ analyze: {len(result['all_hs'])} mã, {len(result['match_full'])} khớp 8s, {len(result['not_found'])} không khớp")

def test_render():
    """Test render markdown"""
    result = checker.analyze()
    md = checker.render_markdown(result)
    assert "# Kiểm tra mã HS 14 DM" in md
    assert "## Tóm tắt" in md
    assert "Top 20 mã HS" in md
    assert len(md) > 1000
    print(f"  ✓ render_markdown: {len(md)} chars")

def test_specific_hs():
    """Test các mã HS cụ thể"""
    result = checker.analyze()
    # Mã 3004.90.89 (Betamethasone) phải có trong biểu thuế
    assert "30049089" in result['match_full'], "3004.90.89 phải khớp 8 số"
    # Mã 2844 (chất phóng xạ DM6) - 4 số
    assert "2844" in result['match_4'] or "2844" in result['not_found'], "2844 có trong DM6"
    print("  ✓ specific_hs: 3004.90.89 + 2844")

def main():
    print("Testing kiem-tra-ma-hs-2026.py...")
    print()
    test_normalize_hs()
    test_load_csv()
    test_load_tax()
    test_analyze()
    test_render()
    test_specific_hs()
    print()
    print("✅ All tests passed!")

if __name__ == "__main__":
    main()
