#!/bin/bash
# تسريع/إبطاء ملف نهائي مع الحفاظ على طبقة الصوت. الاستخدام: ./work/speed.sh <in.mp4> <factor> [out.mp4]
# مثال: ./work/speed.sh ../deliverables/x_main.mp4 1.05   (أسرع ٥٪). الترجمة: اقسم التوقيتات على نفس المعامل.
set -euo pipefail
IN=$1; K=$2; OUT=${3:-${IN%.mp4}_x$K.mp4}
ffmpeg -v error -y -i "$IN" -filter_complex "[0:v]setpts=PTS/$K,fps=30[v];[0:a]atempo=$K[a]" -map "[v]" -map "[a]" \
  -c:v libx264 -crf 17 -pix_fmt yuv420p -c:a aac -b:a 320k -movflags +faststart "$OUT"
echo "wrote $OUT"
