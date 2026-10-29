#!/bin/bash
# تنصيب كل ما يحتاجه سير عمل المونتاج — آمن للتكرار: يتخطى ما هو منصّب ويكمل الناقص.
# الاستخدام: ~/.claude/skills/montage-studio/scripts/install.sh
set -uo pipefail
SKILL="$(cd "$(dirname "$0")/.." && pwd)"
ok() { echo "✅ $1"; }
warn() { echo "⚠️  $1"; }
step() { echo; echo "── $1"; }
FAIL=0

step "النظام"
[ "$(uname)" = "Darwin" ] || { warn "هذا السير مبني لـ macOS (قص الشخص يعتمد Apple Vision)"; }
if ! command -v brew >/dev/null; then
  warn "Homebrew غير منصّب. نصّبه بنفسك (يحتاج كلمة سر الجهاز):"
  echo '   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
  exit 1
fi
ok "Homebrew"

step "الأدوات (ffmpeg، whisper.cpp، node، python)"
for pkg in ffmpeg whisper-cpp node python@3.12 git; do
  if brew list --versions "$pkg" >/dev/null 2>&1; then ok "$pkg"; else echo "تنصيب $pkg…"; brew install "$pkg" || { warn "فشل تنصيب $pkg"; FAIL=1; }; fi
done
FILTERS=$(ffmpeg -hide_banner -filters 2>/dev/null); ENCODERS=$(ffmpeg -hide_banner -encoders 2>/dev/null)  # no grep -q on a live pipe: SIGPIPE + pipefail
grep -q " colorspace " <<<"$FILTERS" && ok "فلتر colorspace (تحويل HDR)" || warn "ffmpeg بلا فلتر colorspace"
grep -q libvpx-vp9 <<<"$ENCODERS" && ok "VP9 (فيديو شفاف)" || { warn "ffmpeg بلا libvpx-vp9"; FAIL=1; }
command -v whisper-cli >/dev/null && ok "whisper-cli" || { warn "whisper-cli غير موجود"; FAIL=1; }
if xcrun --find swiftc >/dev/null 2>&1; then ok "swiftc (لقص الشخص)"; else warn "أدوات Xcode غير منصّبة — شغّل بنفسك: xcode-select --install"; fi

step "بايثون + numpy"
if "$SKILL/scripts/py" -c "import numpy" 2>/dev/null; then
  ok "numpy ($("$SKILL/scripts/py" -c 'import sys;print(sys.executable)'))"
else
  python3.12 -m venv "$HOME/.venvs/montage-studio" 2>/dev/null || python3 -m venv "$HOME/.venvs/montage-studio"
  "$HOME/.venvs/montage-studio/bin/pip" install -q numpy && ok "بيئة ~/.venvs/montage-studio" || { warn "فشل تنصيب numpy"; FAIL=1; }
fi

step "نموذج Whisper large-v3-turbo (‏1.6 GB)"
MODEL="$HOME/.cache/whisper/ggml-large-v3-turbo.bin"
SIZE=1624555275
mkdir -p "$(dirname "$MODEL")"
for try in 1 2 3 4 5; do
  have=$(stat -f%z "$MODEL" 2>/dev/null || echo 0)
  [ "$have" = "$SIZE" ] && break
  echo "تنزيل/استئناف ($have من $SIZE بايت)…"
  curl -L -C - --retry 5 -o "$MODEL" https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3-turbo.bin || true
done
[ "$(stat -f%z "$MODEL" 2>/dev/null || echo 0)" = "$SIZE" ] && ok "النموذج كامل" || { warn "النموذج ناقص — أعد تشغيل السكربت"; FAIL=1; }

step "مهارات Claude"
if [ -d "$HOME/.claude/skills/remotion-best-practices" ]; then ok "مهارات ريموشن"; else npx -y skills@latest add remotion-dev/skills -g -y && ok "مهارات ريموشن" || { warn "فشل تنصيب مهارات ريموشن"; FAIL=1; }; fi
if [ -d "$HOME/.claude/skills/design-motion-principles" ]; then ok "design-motion-principles"; elif [ ! -d "$SKILL/vendor/design-motion-principles" ]; then warn "مهارة design-motion-principles غير منصّبة (اختيارية؛ قواعد الحركة الأساسية موجودة في references/rules.md)"; else cp -R "$SKILL/vendor/design-motion-principles" "$HOME/.claude/skills/" && mv "$HOME/.claude/skills/design-motion-principles/SKILL.vendor.md" "$HOME/.claude/skills/design-motion-principles/SKILL.md" && ok "design-motion-principles (من نسخة السكل)"; fi
if command -v claude >/dev/null; then
  if claude plugin list 2>/dev/null | grep -q "remotion@remotion"; then ok "إضافة remotion@remotion"; else
    claude plugin marketplace add remotion-dev/claude-code-plugin >/dev/null 2>&1 || true
    # no SSH key for GitHub on many machines: force HTTPS for this one command
    GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0='url.https://github.com/.insteadOf' GIT_CONFIG_VALUE_0='git@github.com:' claude plugin install remotion@remotion \
      && ok "إضافة remotion@remotion" || warn "لم تُنصَّب إضافة ريموشن (اختيارية، المهارات تكفي)"
  fi
else
  warn "أمر claude غير موجود في الطرفية — تخطيت إضافة ريموشن (اختيارية)"
fi

step "حزم ريموشن (مرة واحدة، وتُستنسخ لكل مشروع بلا مساحة إضافية)"
CACHE="$HOME/.cache/montage-studio/reel"
mkdir -p "$CACHE"
cp "$SKILL/template/reel/package.json" "$CACHE/"
if [ -d "$CACHE/node_modules/remotion" ] && [ "$(node -p "require('$CACHE/node_modules/remotion/package.json').version")" = "$(node -p "require('$CACHE/package.json').dependencies.remotion")" ]; then
  ok "node_modules جاهزة في $CACHE"
else
  (cd "$CACHE" && npm install --no-audit --no-fund --loglevel=error) && ok "node_modules" || { warn "فشل npm install"; FAIL=1; }
fi

step "المساحة"
FREE=$(df -g "$HOME" | awk 'NR==2{print $4}')
[ "$FREE" -ge 6 ] && ok "${FREE} GB حرة" || warn "${FREE} GB فقط — المطلوب ٦ على الأقل (كل تجميع لريموشن ينسخ public/)"

echo
[ $FAIL = 0 ] && echo "🎬 كل شيء جاهز. ابدأ مشروعاً: $SKILL/scripts/new_project.sh <الفيديو>" || echo "بعض البنود فشلت — راجع ⚠️ أعلاه."
exit $FAIL
