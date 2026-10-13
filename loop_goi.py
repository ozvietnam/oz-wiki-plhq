#!/usr/bin/env python3
"""Loop đóng gói + validate + merge gói TB-TCHQ từ oz-wiki sang hs-code-api.

Workflow:
1. Copy file từ oz-wiki/data/customs/lo/ sang hs-code-api/data/community/tb-tchq/
2. Validate bằng validate-community.mjs (0 lỗi)
3. merge-community.mjs → sync-doc-counts.mjs → test
4. Commit + push
5. Tạo PR
"""
import subprocess
import os
import shutil
import sys
import time

OZ = "/Users/ozvietnamdesktop/Projects/oz-wiki"
HS = "/Users/ozvietnamdesktop/Documents/Claude/Projects/hs-code-api"


def run(cmd, cwd=None, timeout=120):
    """Run command and return (returncode, stdout, stderr)."""
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=timeout)
    return r.returncode, r.stdout, r.stderr


def dong_goi(goi_num):
    """Đóng gói 1 gói (chạy tool). Skip nếu file lô đã tồn tại."""
    src_detail = f"{OZ}/data/customs/processed/tracuuhs-detail-2026-10-13-goi-{goi_num:03d}.json"
    out_lo = f"{OZ}/data/customs/lo/tracuuhs-2026-10-13-goi-{goi_num:03d}.json"
    out_bao_cao = f"{OZ}/data/customs/lo/BAO-CAO-goi-{goi_num:03d}.md"

    if not os.path.exists(src_detail):
        return False, f"NOT FOUND: {src_detail}"

    if os.path.exists(out_lo) and os.path.getsize(out_lo) > 1000:
        return True, f"SKIP (already exists): {out_lo}"

    rc, out, err = run([
        "node", "tools/dong-goi-lo-tb-tchq.mjs",
        "--vao", src_detail,
        "--ra", out_lo,
        "--bao-cao", out_bao_cao,
    ], cwd=OZ)
    if rc != 0:
        return False, f"Tool failed: {err[:500]}"
    return True, out.strip()[:200]


def validate(goi_num):
    """Copy lô file sang hs-code-api và validate."""
    src_lo = f"{OZ}/data/customs/lo/tracuuhs-2026-10-13-goi-{goi_num:03d}.json"
    dst = f"{HS}/data/community/tb-tchq/tracuuhs-2026-10-13-goi-{goi_num:03d}.json"

    if not os.path.exists(src_lo):
        return False, 0, f"Source not found: {src_lo}"

    shutil.copy(src_lo, dst)

    rc, out, err = run(["node", "scripts/validate-community.mjs"], cwd=HS, timeout=120)
    return rc == 0, rc, out + err


def cleanup(goi_num):
    """Xóa file test sau khi validate."""
    dst = f"{HS}/data/community/tb-tchq/tracuuhs-2026-10-13-goi-{goi_num:03d}.json"
    if os.path.exists(dst):
        os.remove(dst)


def add_to_hs(goi_num):
    """Add file lô vào hs-code-api git (sau khi validate OK)."""
    src = f"{OZ}/data/customs/lo/tracuuhs-2026-10-13-goi-{goi_num:03d}.json"
    dst = f"{HS}/data/community/tb-tchq/tracuuhs-2026-10-13-goi-{goi_num:03d}.json"
    shutil.copy(src, dst)
    rc, out, err = run(["git", "add", dst], cwd=HS)
    return rc == 0


def commit_batch(goi_nums, msg):
    """Commit batch các gói."""
    files = [f"data/community/tb-chq/tracuuhs-2026-10-13-goi-{n:03d}.json" for n in goi_nums]
    files = [f.replace("tb-chq", "tb-tchq") for f in files]
    # Add các file modified
    rc, out, err = run(["git", "add", "-A"], cwd=HS)
    rc, out, err = run(["git", "commit", "-m", msg], cwd=HS)
    return rc == 0, out, err


def merge(goi_nums):
    """Merge community vào precedents.json."""
    rc, out, err = run(["node", "scripts/merge-community.mjs"], cwd=HS, timeout=120)
    return rc == 0, out[:500], err[:500]


def sync():
    """Sync doc counts."""
    rc, out, err = run(["node", "scripts/sync-doc-counts.mjs"], cwd=HS, timeout=120)
    return rc == 0, out[:500], err[:500]


def test():
    """Run tests."""
    rc, out, err = run(["npm", "test"], cwd=HS, timeout=300)
    return rc == 0, out[-2000:], err[:500]


def push():
    """Push current branch."""
    rc, out, err = run(["git", "push"], cwd=HS, timeout=60)
    return rc == 0, out, err


def process_goi(goi_num):
    """Xử lý 1 gói: đóng gói → validate → add."""
    print(f"\n--- GÓI {goi_num:03d} ---")

    # Step 1: Đóng gói
    ok, msg = dong_goi(goi_num)
    if not ok:
        print(f"❌ Đóng gói: {msg}")
        return False
    print(f"✓ Đóng gói: {msg}")

    # Step 2: Validate
    ok, rc, vmsg = validate(goi_num)
    if not ok:
        print(f"❌ Validate (rc={rc}): {vmsg[-1000:]}")
        cleanup(goi_num)
        return False
    print(f"✓ Validate pass")

    # Step 3: Cleanup (sẽ copy lại khi commit batch)
    cleanup(goi_num)
    return True


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: loop_goi.py <goi_num> [<goi_num> ...]")
        sys.exit(1)

    goi_nums = [int(x) for x in sys.argv[1:]]
    print(f"Sẽ xử lý {len(goi_nums)} gói: {goi_nums}")

    results = []
    for n in goi_nums:
        ok = process_goi(n)
        results.append((n, ok))

    print("\n=== KẾT QUẢ ===")
    for n, ok in results:
        print(f"  GÓI {n:03d}: {'✓' if ok else '❌'}")
