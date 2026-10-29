"""المرحلة ٢أ: نسخ صوتي بتوقيت كل كلمة (whisper.cpp large-v3-turbo).
الاستخدام: python3 work/transcribe.py [ar]   → work/words.json (خام) و work/words_clean.json [{s,e,w}]
"""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
MODEL = os.path.expanduser("~/.cache/whisper/ggml-large-v3-turbo.bin")
lang = sys.argv[1] if len(sys.argv) > 1 else "ar"
if not os.path.exists(MODEL) or os.path.getsize(MODEL) < 1_600_000_000:
    sys.exit("نموذج Whisper غير موجود أو ناقص — شغّل scripts/install.sh من السكل.")
subprocess.run(["whisper-cli", "-m", MODEL, "-f", os.path.join(ROOT, "voice_16k.wav"), "-l", lang, "-ml", "1", "-sow", "-oj",
                "-of", os.path.join(ROOT, "words")], check=True, capture_output=True)
raw = json.load(open(os.path.join(ROOT, "words.json")))["transcription"]
words = []
for seg in raw:
    t = seg["text"].strip()
    if not t or all(c in "،.؟?!,…-" for c in t):
        if words and t:
            words[-1]["w"] += t  # punctuation sticks to the previous word
        continue
    words.append({"s": seg["offsets"]["from"] / 1000, "e": seg["offsets"]["to"] / 1000, "w": t})
json.dump(words, open(os.path.join(ROOT, "words_clean.json"), "w"), ensure_ascii=False)
print(len(words), "كلمة")
print(" ".join(w["w"] for w in words))
