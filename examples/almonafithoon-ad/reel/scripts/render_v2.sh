#!/bin/bash
# Final v2 deliverables at full resolution, loudness-normalised to -14 LUFS / -1.5 dBTP.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=../deliverables
RAW=../work/renders
mkdir -p "$OUT" "$RAW"
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
  echo "wrote $2"
}

# pass "ID:file.mp4" pairs to render a subset; default renders all three
PAIRS=("$@")
[ ${#PAIRS[@]} -eq 0 ] && PAIRS=("V2-Main:almonafithoon_v2_main.mp4" "V2-Clean:almonafithoon_v2_clean.mp4" "V2-Short:almonafithoon_v2_short.mp4" "cover")
for pair in "${PAIRS[@]}"; do
  if [ "$pair" = "cover" ]; then
    npx remotion still V2-Main "$OUT/almonafithoon_v2_cover.png" --frame=2028 --port=3128 --log=error
    continue
  fi
  id=${pair%%:*}; name=${pair##*:}
  echo "rendering $id"
  npx remotion render "$id" "$RAW/$id.mp4" "${COMMON[@]}"
  normalise "$id.mp4" "$name"
done
echo "ALL DONE"
