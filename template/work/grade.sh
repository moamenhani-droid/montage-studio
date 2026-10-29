#!/bin/bash
# تدرّج لوني للقطات الوجه. الاستخدام: ./work/grade.sh <preset> [input] [output]
#   presets: teal-orange | warm | cool | mono | film | punchy
# الافتراضي: master_sdr_1440.mp4 → master_<preset>.mp4، ويُربط في reel/public/footage/master.mp4
# للشخص المقصوص: ./work/matte.sh master_<preset>.mp4
set -euo pipefail
cd "$(dirname "$0")"
P=${1:?preset}; IN=${2:-master_sdr_1440.mp4}; OUT=${3:-master_$P.mp4}
case $P in
  teal-orange) F="colorbalance=rs=-0.06:gs=0.01:bs=0.10:rm=0.03:gm=0.0:bm=-0.03:rh=0.07:gh=0.02:bh=-0.07,eq=contrast=1.08:saturation=1.12:gamma=0.98" ;;
  warm)        F="colorbalance=rm=0.06:bm=-0.05:rh=0.05:bh=-0.04,eq=saturation=1.08:gamma=1.01" ;;
  cool)        F="colorbalance=rs=-0.04:bs=0.06:rm=-0.02:bm=0.04,eq=contrast=1.06:saturation=0.92" ;;
  mono)        F="hue=s=0,eq=contrast=1.22:brightness=-0.02" ;;
  film)        F="colorbalance=rs=-0.05:bs=0.08:rh=0.06:bh=-0.05,eq=contrast=1.1:saturation=0.95,curves=all='0/0.04 0.5/0.5 1/0.96',vignette=PI/5,noise=alls=6:allf=t" ;;
  punchy)      F="eq=contrast=1.12:saturation=1.22,unsharp=5:5:0.6" ;;
  *) echo "preset غير معروف: $P"; exit 1 ;;
esac
ENC=(-c:v libx264 -crf 16 -preset medium)
ffmpeg -hide_banner -encoders 2>/dev/null | grep -q h264_videotoolbox && ENC=(-c:v h264_videotoolbox -b:v 40M)
ffmpeg -v error -y -i "$IN" -vf "$F" "${ENC[@]}" -pix_fmt yuv420p -an "$OUT"
if [ "$IN" = "master_sdr_1440.mp4" ]; then
  rm -f ../reel/public/footage/master.mp4 && ln "$OUT" ../reel/public/footage/master.mp4
fi
echo "wrote work/$OUT"
