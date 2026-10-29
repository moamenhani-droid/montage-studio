#!/bin/bash
# Render every deliverable, then loudness-normalise the reels to -14 LUFS / -1 dBTP.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=../deliverables
RAW=../work/renders
mkdir -p "$OUT" "$RAW"
COMMON=(--codec=h264 --crf=17 --pixel-format=yuv420p --audio-codec=aac --audio-bitrate=320k --port=3124 --log=error)

render() { # composition, raw file
  echo "rendering $1"
  npx remotion render "$1" "$RAW/$2" "${COMMON[@]}"
}

normalise() { # raw file, final name
  local stats
  stats=$(ffmpeg -hide_banner -i "$RAW/$1" -af loudnorm=I=-14:TP=-1.5:LRA=9:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
  local mi mtp mlra mth off
  mi=$(echo "$stats" | grep input_i | grep -oE '[-0-9.]+')
  mtp=$(echo "$stats" | grep input_tp | grep -oE '[-0-9.]+')
  mlra=$(echo "$stats" | grep input_lra | grep -oE '[-0-9.]+')
  mth=$(echo "$stats" | grep input_thresh | grep -oE '[-0-9.]+')
  off=$(echo "$stats" | grep target_offset | grep -oE '[-0-9.]+')
  ffmpeg -v error -y -i "$RAW/$1" -c:v copy \
    -af "loudnorm=I=-14:TP=-1.5:LRA=9:measured_I=$mi:measured_TP=$mtp:measured_LRA=$mlra:measured_thresh=$mth:offset=$off:linear=true,alimiter=limit=0.89:level=false" \
    -ar 48000 -c:a aac -b:a 320k -movflags +faststart "$OUT/$2"
  echo "wrote $2"
}

render MainReel main_raw.mp4 && normalise main_raw.mp4 almonafithoon_main_reel.mp4
render CleanReel clean_raw.mp4 && normalise clean_raw.mp4 almonafithoon_clean.mp4
render ShortReel short_raw.mp4 && normalise short_raw.mp4 almonafithoon_short_reel.mp4
npx remotion render LogoAnimation "$OUT/almonafithoon_logo_animation.mp4" --codec=h264 --crf=16 --port=3124 --log=error
npx remotion still Cover "$OUT/almonafithoon_cover.png" --port=3124 --log=error
echo "ALL DONE"
