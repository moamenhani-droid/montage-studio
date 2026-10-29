#!/bin/bash
# التصدير النهائي بدقة كاملة، مع ضبط مستوى الصوت إلى ‑14 LUFS وذروة ‑1.5.
# الاستخدام: ./scripts/render.sh                       → Main وClean وShort والغلاف
#           ./scripts/render.sh "Main:اسم.mp4"          → نسخة واحدة
#           ./scripts/render.sh cover:120               → الغلاف من الإطار 120
set -euo pipefail
cd "$(dirname "$0")/.."
NAME=$(basename "$(cd .. && pwd)")
OUT=../deliverables
RAW=../work/renders
mkdir -p "$OUT" "$RAW"
FREE=$(df -g . | awk 'NR==2{print $4}')
[ "$FREE" -lt 4 ] && { echo "المساحة الحرة ${FREE}GB فقط — نظّف قبل التصدير"; exit 1; }
COMMON=(--codec=h264 --crf=17 --pixel-format=yuv420p --audio-codec=aac --audio-bitrate=320k --port=3128 --log=error)

normalise() { # raw file, final name
  local stats mi mtp mlra mth off
  stats=$(ffmpeg -hide_banner -i "$RAW/$1" -af loudnorm=I=-14:TP=-1.5:LRA=9:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
  mi=$(echo "$stats" | grep input_i | grep -oE '[-0-9.]+')
  mtp=$(echo "$stats" | grep input_tp | grep -oE '[-0-9.]+')
  mlra=$(echo "$stats" | grep input_lra | grep -oE '[-0-9.]+')
  mth=$(echo "$stats" | grep input_thresh | grep -oE '[-0-9.]+')
  off=$(echo "$stats" | grep target_offset | grep -oE '[-0-9.]+')
  ffmpeg -v error -y -i "$RAW/$1" -c:v copy \
    -af "loudnorm=I=-14:TP=-1.5:LRA=9:measured_I=$mi:measured_TP=$mtp:measured_LRA=$mlra:measured_thresh=$mth:offset=$off:linear=true,alimiter=limit=0.89:level=false" \
    -ar 48000 -c:a aac -b:a 320k -movflags +faststart "$OUT/$2"
  rm -f "$RAW/$1"
  echo "wrote $OUT/$2"
}

PAIRS=("$@")
[ ${#PAIRS[@]} -eq 0 ] && PAIRS=("Main:${NAME}_main.mp4" "Clean:${NAME}_clean.mp4" "Short:${NAME}_short.mp4" "cover:0")
for pair in "${PAIRS[@]}"; do
  if [[ "$pair" == cover* ]]; then
    frame=${pair#cover}; frame=${frame#:}; frame=${frame:-0}
    npx remotion still Main "$OUT/${NAME}_cover.png" --frame="$frame" --port=3128 --log=error
    echo "wrote $OUT/${NAME}_cover.png"
    continue
  fi
  id=${pair%%:*}; name=${pair##*:}
  echo "rendering $id"
  npx remotion render "$id" "$RAW/$id.mp4" "${COMMON[@]}"
  normalise "$id.mp4" "$name"
done
pgrep -f "remotion render" >/dev/null || rm -rf "${TMPDIR:-/tmp}"/remotion-webpack-bundle-* 2>/dev/null || true
echo "ALL DONE"
