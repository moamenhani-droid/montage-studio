#!/bin/bash
# قص الشخص من الخلفية بـ Apple Vision (مدمج في macOS، بلا نماذج مُنزَّلة).
# الاستخدام: ./work/matte.sh   → reel/public/footage/person_alpha.webm + work/matte_log.txt (مركز الجسم للتوسيط)
# بعده: ضع خلفية في reel/public/backgrounds/room.jpg واجعل FACE["mode"]="cutout" في edit.py
set -euo pipefail
cd "$(dirname "$0")"
[ -x matte ] || swiftc -O matte.swift -o matte
mkdir -p ../reel/public/footage
./matte master_sdr_1440.mp4 1080 1920 2> matte_log.txt \
  | ffmpeg -v error -y -f rawvideo -pix_fmt gray -s 1080x1920 -r 30 -i - -vf "tmix=frames=3:weights='1 2 1',gblur=sigma=1.2" -c:v libx264 -crf 14 -pix_fmt yuv420p alpha_gray.mp4
# tighten the edge 2 px and soften it: no halo around hair and shoulders
ffmpeg -v error -y -i alpha_gray.mp4 -vf "erosion,erosion,gblur=sigma=1.6,curves=all='0/0 0.18/0 0.6/0.75 1/1'" -c:v libx264 -crf 14 -pix_fmt yuv420p alpha_tight.mp4
SRC=${1:-master_sdr_1440.mp4}  # pass a graded master (grade.sh) to cut out the graded person
ffmpeg -v error -y -i "$SRC" -i alpha_tight.mp4 -filter_complex "[0:v]scale=1080:1920,format=rgba[c];[1:v]format=gray[a];[c][a]alphamerge,format=yuva420p" \
  -c:v libvpx-vp9 -b:v 10M -row-mt 1 -auto-alt-ref 0 ../reel/public/footage/person_alpha.webm
tail -1 matte_log.txt
echo "wrote reel/public/footage/person_alpha.webm"
