#!/bin/bash
# process_goi.sh — End-to-end xử lý 1 gói TB-TCHQ: crawl → đóng gói → validate → fix envelope → commit
#
# Usage: bash tools/process_goi.sh <goi_id> [date]
#   vd:   bash tools/process_goi.sh goi-083 2026-10-14
#
# Bài học từ goi-058 (2026-10-13):
#   - tool đóng gói ghi contributor dạng string → cần fix thành object
#   - luôn có 1-3 bản trùng với kho → cần loại
#   - workflow: 5 bước (crawl → đóng gói → validate → merge → PR)
set -e

REPO="/Users/ozvietnamdesktop/Documents/Claude/Projects/oz-wiki-plhq"
HS_API="/Users/ozvietnamdesktop/Documents/Claude/Projects/hs-code-api"
GOI_ID="${1:-}"
DATE="${2:-$(date +%Y-%m-%d)}"

if [ -z "$GOI_ID" ]; then
  echo "Usage: bash tools/process_goi.sh <goi_id> [date]"
  exit 1
fi

echo "=========================================="
echo "📦 Process $GOI_ID ($DATE)"
echo "=========================================="

# === Bước 1: Comment "nhận" trên issue 185 ===
echo ""
echo "=== Bước 1: Comment 'nhận' trên issue 185 ==="
cd "$REPO"
gh issue comment 185 --repo ozvietnam/oz-wiki-plhq --body "nhận $GOI_ID — Agent: Hermes (Sonnet 4.5)" 2>&1 | tail -2

# === Bước 2: Crawl ===
echo ""
echo "=== Bước 2: Crawl ==="
cd "$REPO"
python3 tools/crawl_goi.py "$GOI_ID" "$DATE" 2>&1 | tail -10

# === Bước 3: Đóng gói lô ===
echo ""
echo "=== Bước 3: Đóng gói lô (npm run dong-goi-lo) ==="
cd "$REPO"
npm run dong-goi-lo -- --vao "data/customs/processed/tracuuhs-detail-${DATE}-${GOI_ID}.json" \
  --ra "data/customs/lo/tracuuhs-${DATE}-${GOI_ID}.json" \
  --bao-cao "data/customs/lo/BAO-CAO-${GOI_ID}.md" 2>&1 | tail -5

# === Bước 4: Fix envelope (contributor object) ===
echo ""
echo "=== Bước 4: Fix envelope (contributor object) ==="
python3 << PYEOF
import json
import re
from pathlib import Path

REPO = Path("$REPO")
lo_file = REPO / "data/customs/lo/tracuuhs-${DATE}-${GOI_ID}.json"
detail_file = REPO / "data/customs/processed/tracuuhs-detail-${DATE}-${GOI_ID}.json"

# Đọc envelope DETAIL để lấy danh sách TB
with open(detail_file) as f:
    detail = json.load(f)
all_refs = {r.get('source', {}).get('reference', '').strip() for r in detail.get('records', [])}

# Đọc envelope LÔ do tool tạo
with open(lo_file) as f:
    lo = json.load(f)

# Fix 1: contributor thành object
lo['contributor'] = {'name': 'hermes-tracuuhs', 'github': 'ozvietnam'}

# Fix 2: loại bản trùng với kho bên hs-code-api
print("  Check trùng với kho hs-code-api...")
import subprocess
result = subprocess.run(['ls', str(Path("$HS_API") / 'data/community/tb-tchq/')], capture_output=True, text=True)
existing_refs = set()
for fname in result.stdout.split():
    f_path = Path("$HS_API") / 'data/community/tb-tchq' / fname
    try:
        with open(f_path) as f:
            d = json.load(f)
        for r in d.get('records', []):
            ref = r.get('source', {}).get('reference', '').strip()
            if ref:
                existing_refs.add(ref)
    except (FileNotFoundError, json.JSONDecodeError):
        pass

before = len(lo['records'])
dup_refs = []
for r in lo['records']:
    ref = r.get('source', {}).get('reference', '').strip()
    if ref in existing_refs:
        dup_refs.append(ref)

lo['records'] = [r for r in lo['records'] if r.get('source', {}).get('reference', '').strip() not in dup_refs]
removed = before - len(lo['records'])

# Lưu
with open(lo_file, 'w') as f:
    json.dump(lo, f, ensure_ascii=False, indent=2)

print(f"  ✓ Fixed envelope: contributor = {{name, github}}")
print(f"  ✓ Loại {removed} bản trùng kho (giữ {len(lo['records'])}/{before})")
PYEOF

# === Bước 5: Validate bên hs-code-api ===
echo ""
echo "=== Bước 5: Validate bên hs-code-api ==="
cp "$REPO/data/customs/lo/tracuuhs-${DATE}-${GOI_ID}.json" \
   "$HS_API/data/community/tb-tchq/"
cd "$HS_API"
node scripts/validate-community.mjs 2>&1 | grep -E "($GOI_ID|0 lỗi|❌)" | head -10

# === Bước 6: Merge + test + sync ===
echo ""
echo "=== Bước 6: Merge + test + sync ==="
cd "$HS_API"
node scripts/merge-community.mjs 2>&1 | tail -15
node scripts/test-merge-community.mjs 2>&1 | tail -3
node scripts/sync-doc-counts.mjs 2>&1 | tail -2

echo ""
echo "=========================================="
echo "✅ Xong $GOI_ID"
echo "=========================================="
echo "Các bước tiếp (thủ công):"
echo "  1. cd $REPO && git checkout -b feat/${GOI_ID}"
echo "  2. git add tools/crawl_goi.py data/customs/.../tracuuhs-*.json BAO-CAO-${GOI_ID}.md"
echo "  3. git commit -m 'feat(tb-tchq): ${GOI_ID} ...'"
echo "  4. git push -u origin HEAD"
echo "  5. gh pr create ..."
echo "  6. cd $HS_API && git checkout -b tracuuhs/${GOI_ID}"
echo "  7. git commit -m 'feat(tb-tchq): ...'"
echo "  8. gh pr create ..."
echo "  9. gh issue comment 185 --body 'xong ${GOI_ID} ...'"
