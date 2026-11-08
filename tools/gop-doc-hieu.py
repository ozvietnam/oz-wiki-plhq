#!/usr/bin/env python3
"""Gộp kết quả trích điều khoản (Gemma) vào data/doc-hieu của oz-wiki-plhq.

Chức năng (chạy nhiều lần cho cùng kết quả — idempotent):
  1. Gom các đoạn ``-cNN`` của cùng một văn bản theo thứ tự đoạn.
  2. Bỏ trùng theo số điều, giữ bản đầy đủ nhất.
  3. Kiểm chứng: chỉ giữ điều nào mà chữ ``Điều N`` thật sự có trong văn bản
     nguồn (``gemma-chunk-dk/<slug>-cNN.txt``) của đoạn đó. Điều bịa thì bỏ.
  4. Ghi/bổ sung ``data/doc-hieu/<slug>.dieu.jsonl`` đúng khuôn các tệp có sẵn,
     kèm trường ``nguon_trich`` cho biết model trích. Tệp đã có thì chỉ bổ sung
     điều còn thiếu, không xoá điều cũ.

Chỉ dùng thư viện chuẩn. Không sửa gì ngoài data/doc-hieu/.
"""

import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data" / "doc-hieu"
# Đề bài đặt dữ liệu ngoài repo: <gốc repo>/../gemma-ra-dk và ../gemma-chunk-dk
RA_DIR = ROOT.parent / "gemma-ra-dk"
CHUNK_DIR = ROOT.parent / "gemma-chunk-dk"

MODEL_TRICH = "gemma-4-e4b"

# Đuôi cần bỏ để đưa slug về tên văn bản chuẩn (không đụng phần giữa).
SUFFIXES = ("-body-ocr", "-ocr-body", "-toanvan", "-body", "-ocr", "-tiep")

# Số điều: "Điều 5" hoặc ghi trần "5" / "5." / "5)" (một số tệp Gemma ghi vậy)
DIEU_RE = re.compile(r"^(?:Điều\s+(\d+)|(\d+)[.)]?)\s*$")


def norm_slug(slug: str) -> str:
    """Bỏ đuôi kỹ thuật (-body, -ocr, -tiep, -toanvan...) để về tên văn bản."""
    changed = True
    while changed:
        changed = False
        for suf in SUFFIXES:
            if slug.endswith(suf) and len(slug) > len(suf) + 1:
                slug = slug[: -len(suf)]
                changed = True
                break
    return slug


def do_du(rec: dict) -> int:
    """Điểm 'đầy đủ': bản nào nhiều chữ hơn thì giữ bản đó."""
    return len(json.dumps(rec, ensure_ascii=False))


def kiem_chung(dieu_number: int, piece: str, cnn: str) -> bool:
    """``Điều N`` thật sự có trong văn bản nguồn của đoạn hay không."""
    chunk_file = CHUNK_DIR / f"{piece}-{cnn}.txt"
    if not chunk_file.exists():
        return False
    text = chunk_file.read_text(encoding="utf-8", errors="replace")
    return re.search(rf"Điều\s*{dieu_number}\b", text) is not None


def doc_text_dong(text: str):
    """Đọc tuần tự mọi object JSON trong một tệp .jsonl.

    Model nhỏ đôi khi ghi nhiều object dính liền một dòng hoặc chèn chữ rác
    giữa hai object — ``raw_decode`` đọc được cả hai trường hợp.
    Trả về (danh sách object, số đoạn lỗi).
    """
    dec = json.JSONDecoder()
    recs, loi, pos = [], 0, 0
    n = len(text)
    while pos < n:
        while pos < n and text[pos] in " \t\r\n":
            pos += 1
        if pos >= n:
            break
        try:
            obj, pos = dec.raw_decode(text, pos)
            if isinstance(obj, dict):
                recs.append(obj)
            else:
                loi += 1
        except json.JSONDecodeError:
            loi += 1
            nxt = text.find("{", pos + 1)
            if nxt == -1:
                break
            pos = nxt
    return recs, loi


def doc_du_lieu():
    """Đọc mọi tệp gemma-ra-dk/<piece>-cNN.jsonl, kiểm chứng từng điều.

    Trả về {doc_slug: {so_dieu: rec}} và bộ đếm báo cáo.
    """
    by_doc = defaultdict(dict)  # slug chuẩn hoá -> {số điều: bản đầy đủ nhất}
    stats = defaultdict(lambda: {"doc": 0, "ghi": 0, "bia": 0, "loi": 0,
                                 "trung_noi_bo": 0})
    for ra_file in sorted(RA_DIR.glob("*.jsonl")):
        m = re.match(r"^(.*)-c(\d+)\.jsonl$", ra_file.name)
        if not m:
            continue
        piece, cnn = m.group(1), f"c{int(m.group(2)):02d}"
        slug = norm_slug(piece)
        stats[slug]["doc"] = 1
        recs, loi = doc_text_dong(ra_file.read_text(encoding="utf-8"))
        stats[slug]["loi"] += loi
        for rec in recs:
            stats[slug]["ghi"] += 1
            mm = DIEU_RE.match(str(rec.get("dieu", "")).strip())
            if not mm:
                stats[slug]["loi"] += 1
                continue
            so = int(mm.group(1) or mm.group(2))
            if not kiem_chung(so, piece, cnn):
                # Điều bịa: chữ "Điều N" không có trong nguồn của đoạn
                stats[slug]["bia"] += 1
                continue
            cu = by_doc[slug].get(so)
            if cu is None:
                by_doc[slug][so] = rec
            elif do_du(rec) > do_du(cu):
                stats[slug]["trung_noi_bo"] += 1
                by_doc[slug][so] = rec
            else:
                stats[slug]["trung_noi_bo"] += 1
    return by_doc, stats


def ghep_file(slug: str, recs: dict):
    """Ghi/bổ sung data/doc-hieu/<slug>.dieu.jsonl. Trả về (đã có, thêm mới)."""
    out = DATA_DIR / f"{slug}.dieu.jsonl"
    da_co = set()
    dong_cu = []
    if out.exists():
        for line in out.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line:
                continue
            dong_cu.append(line)
            try:
                mm = DIEU_RE.match(str(json.loads(line).get("dieu", "")).strip())
                if mm:
                    da_co.add(int(mm.group(1) or mm.group(2)))
            except json.JSONDecodeError:
                pass
    them = []
    for so in sorted(recs):
        if so in da_co:
            continue
        rec = recs[so]
        # thứ tự khoá theo khuôn sẵn có, trường nguồn đặt cuối
        line_rec = {"dieu": rec.get("dieu"), "ten": rec.get("ten"),
                    "tom_tat": rec.get("tom_tat"),
                    "nghia_vu_xnk": rec.get("nghia_vu_xnk"),
                    "nguon_trich": MODEL_TRICH}
        them.append(json.dumps(line_rec, ensure_ascii=False))
    if them:
        with out.open("a", encoding="utf-8") as f:
            for line in them:
                f.write(line + "\n")
    return len(da_co), len(them)


def main():
    if not RA_DIR.exists():
        print(f"KHÔNG thấy {RA_DIR}", file=sys.stderr)
        return 1
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    by_doc, stats = doc_du_lieu()
    tong_them = 0
    print(f"{'văn bản':44s} {'ghi':>5s} {'bia':>4s} {'loi':>4s} "
          f"{'trung':>5s} {'cu':>4s} {'them':>5s}")
    for slug in sorted(by_doc):
        st = stats[slug]
        da_co, them = ghep_file(slug, by_doc[slug])
        tong_them += them
        print(f"{slug:44s} {st['ghi']:5d} {st['bia']:4d} {st['loi']:4d} "
              f"{st['trung_noi_bo']:5d} {da_co:4d} {them:5d}")
    so_vb = len(by_doc)
    tong_bia = sum(s["bia"] for s in stats.values())
    tong_loi = sum(s["loi"] for s in stats.values())
    tong_ghi = sum(s["ghi"] for s in stats.values())
    print(f"\nTỔNG: {so_vb} văn bản | {tong_ghi} dòng đọc | "
          f"{tong_bia} điều bịa (bỏ) | {tong_loi} dòng lỗi | "
          f"{tong_them} điều thêm mới")
    return 0


if __name__ == "__main__":
    sys.exit(main())
