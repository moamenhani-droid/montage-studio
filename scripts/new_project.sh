#!/bin/bash
# مشروع مونتاج جديد من القالب. الاستخدام:
#   new_project.sh <الفيديو> [مجلد المشروع] [--prep]
# الافتراضي: المجلد الذي فيه الفيديو (الفيديو الأصلي لا يُلمس ولا يُنقل).
# --prep يشغّل التحليل والتجهيز (المرحلة ١) مباشرة.
set -euo pipefail
SKILL="$(cd "$(dirname "$0")/.." && pwd)"
PREP=0; ARGS=()
for a in "$@"; do [ "$a" = "--prep" ] && PREP=1 || ARGS+=("$a"); done
VIDEO="$(cd "$(dirname "${ARGS[0]:?الفيديو مطلوب}")" && pwd)/$(basename "${ARGS[0]}")"
[ -f "$VIDEO" ] || { echo "الفيديو غير موجود: $VIDEO"; exit 1; }
DIR="${ARGS[1]:-$(dirname "$VIDEO")}"
mkdir -p "$DIR"; DIR="$(cd "$DIR" && pwd)"
[ -d "$DIR/reel" ] && { echo "يوجد مشروع في $DIR/reel — اختر مجلداً آخر"; exit 1; }

cp -R "$SKILL/template/reel" "$SKILL/template/work" "$SKILL/template/.claude" "$DIR/"
mkdir -p "$DIR/deliverables" "$DIR/assets" "$DIR/reel/public/backgrounds"
echo "$VIDEO" > "$DIR/work/source.txt"

CACHE="$HOME/.cache/montage-studio/reel/node_modules"
if [ -d "$CACHE" ]; then
  cp -cR "$CACHE" "$DIR/reel/node_modules" 2>/dev/null || cp -R "$CACHE" "$DIR/reel/node_modules"  # APFS clone: no extra space
  echo "✅ node_modules (نسخة مستنسخة)"
else
  (cd "$DIR/reel" && npm install --no-audit --no-fund --loglevel=error)
fi

echo "✅ المشروع: $DIR"
if [ $PREP = 1 ]; then
  (cd "$DIR" && "$SKILL/scripts/py" work/prep.py "$VIDEO")
fi
cat <<MSG

الخطوات التالية:
  1) $SKILL/scripts/py work/prep.py "$VIDEO"        (إن لم تستخدم --prep)
  2) $SKILL/scripts/py work/transcribe.py ar
  3) اكتب work/script.txt ثم: $SKILL/scripts/py work/align.py
  4) عدّل work/edit.py ثم: $SKILL/scripts/py work/edit.py && $SKILL/scripts/py work/make_audio.py
  5) المعاينة: preview_start باسم remotion-studio (http://localhost:3000)
MSG
