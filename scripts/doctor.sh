#!/bin/bash
# فحص سريع للجاهزية دون تنصيب أي شيء.
SKILL="$(cd "$(dirname "$0")/.." && pwd)"
c() { if eval "$2" >/dev/null 2>&1; then echo "✅ $1"; else echo "❌ $1"; BAD=1; fi; }
BAD=0
c "ffmpeg" "command -v ffmpeg"
c "ffmpeg: VP9 للفيديو الشفاف" "ffmpeg -hide_banner -encoders | grep -q libvpx-vp9"
c "whisper-cli" "command -v whisper-cli"
c "نموذج Whisper كامل (1624555275 بايت)" "[ \$(stat -f%z \$HOME/.cache/whisper/ggml-large-v3-turbo.bin) = 1624555275 ]"
c "node" "command -v node"
c "بايثون + numpy" "$SKILL/scripts/py -c 'import numpy'"
c "swiftc (قص الشخص)" "xcrun --find swiftc"
c "مهارات ريموشن" "[ -d \$HOME/.claude/skills/remotion-best-practices ]"
c "design-motion-principles" "[ -d \$HOME/.claude/skills/design-motion-principles ]"
c "حزم ريموشن المخبأة" "[ -d \$HOME/.cache/montage-studio/reel/node_modules/remotion ]"
FREE=$(df -g "$HOME" | awk 'NR==2{print $4}')
[ "$FREE" -ge 6 ] && echo "✅ المساحة: ${FREE} GB" || { echo "⚠️  المساحة: ${FREE} GB (المطلوب ٦+)"; }
[ $BAD = 0 ] && echo "جاهز." || echo "شغّل: $SKILL/scripts/install.sh"
exit $BAD
