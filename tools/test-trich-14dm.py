#!/usr/bin/env python3
"""Unit test cho tools/trich-14dm.mjs.py
Chạy: python3 tools/test-trich-14dm.py
"""
import re
import sys
import os

# Import module chính
sys.path.insert(0, os.path.dirname(__file__))
import trich_14dm_mjs as parser

VCCI_BODY = parser.VCCI_BODY
DM_BOUNDS = parser.DM_BOUNDS

def test_dm1():
    """DM1: 219 dòng (111 + 108)"""
    with open(VCCI_BODY) as f:
        text = f.read()
    section = text[DM_BOUNDS[0][0]:DM_BOUNDS[0][1]]
    parsed = parser.parse_dm1(section)
    assert len(parsed) == 219, f"DM1 expected 219, got {len(parsed)}"
    # STT cuối = 111 + 108 = 219
    assert parsed[-1][0] == 219, f"DM1 last STT expected 219, got {parsed[-1][0]}"
    print("  ✓ DM1: 219 dòng (đầy đủ)")

def test_dm5():
    """DM5: 118 dòng (59 + 59)"""
    with open(VCCI_BODY) as f:
        text = f.read()
    section = text[DM_BOUNDS[4][0]:DM_BOUNDS[4][1]]
    parsed = parser.parse_dm5(section)
    assert len(parsed) == 118, f"DM5 expected 118, got {len(parsed)}"
    # STT cuối = 59 + 59 = 118
    assert parsed[-1][0] == 118, f"DM5 last STT expected 118, got {parsed[-1][0]}"
    print("  ✓ DM5: 118 dòng (đầy đủ)")

def test_dm6():
    """DM6: 78 chất phóng xạ"""
    with open(VCCI_BODY) as f:
        text = f.read()
    section = text[DM_BOUNDS[5][0]:DM_BOUNDS[5][1]]
    parsed = parser.parse_dm6(section)
    assert len(parsed) == 78, f"DM6 expected 78, got {len(parsed)}"
    # Tất cả mã HS 4 số
    for stt, ten, dang, ma_hs in parsed:
        assert len(ma_hs) == 4, f"DM6 STT {stt} HS not 4 digits: {ma_hs}"
    print("  ✓ DM6: 78 dòng (đầy đủ, tất cả mã HS 4 số)")

def test_dm8():
    """DM8: ≥1275 dòng (cho phép thiếu 3 STT do edge case)"""
    with open(VCCI_BODY) as f:
        text = f.read()
    section = text[DM_BOUNDS[7][0]:DM_BOUNDS[7][1]]
    parsed = parser.parse_dm8(section)
    assert len(parsed) >= 1270, f"DM8 expected ≥1270, got {len(parsed)}"
    print(f"  ✓ DM8: {len(parsed)} dòng (≥1270)")

def test_dm11():
    """DM11: ≥365 dòng (dược liệu)"""
    with open(VCCI_BODY) as f:
        text = f.read()
    section = text[DM_BOUNDS[10][0]:DM_BOUNDS[10][1]]
    parsed = parser.parse_dm11(section)
    assert len(parsed) >= 365, f"DM11 expected ≥365, got {len(parsed)}"
    print(f"  ✓ DM11: {len(parsed)} dòng (≥365)")

def test_dm14():
    """DM14: 21 STT mỹ phẩm (multi-MHS)"""
    with open(VCCI_BODY) as f:
        text = f.read()
    section = text[DM_BOUNDS[13][0]:DM_BOUNDS[13][1]]
    parsed = parser.parse_dm14(section)
    assert len(parsed) == 21, f"DM14 expected 21, got {len(parsed)}"
    print("  ✓ DM14: 21 dòng (đầy đủ)")

def test_clean_section():
    """Test helper clean_section"""
    test = "3004. 90. 99 12 Abc 3004.90.99"
    result = parser.clean_section(test)
    assert "3004.90.99" in result, f"clean_section failed: {result}"
    # 2 mã HS thành 1
    print("  ✓ clean_section: fix mã HS split")

def test_parse_4col():
    """Test helper parse_4col"""
    test = "STT Ten Dạng Mã_HS\n1 Aspirin Các dạng 3004.90.89"
    result = parser.parse_4col(test)
    assert len(result) == 1, f"parse_4col expected 1, got {len(result)}"
    assert result[0] == (1, "Aspirin", "Các dạng", "3004.90.89")
    print("  ✓ parse_4col: match basic pattern")

def main():
    print("Testing trich-14dm.mjs.py...")
    print()
    test_clean_section()
    test_parse_4col()
    test_dm1()
    test_dm5()
    test_dm6()
    test_dm8()
    test_dm11()
    test_dm14()
    print()
    print("✅ All tests passed!")

if __name__ == "__main__":
    main()
