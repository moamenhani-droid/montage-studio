"""المرحلة ٢ب: مطابقة النص المنطوق فعلاً على توقيتات Whisper.

اكتب work/script.txt: جملة في كل سطر، **كما نُطقت** وبإملاء السكربت الصحيح.
  - "كلمة|2" تعني أن الكلمة الصحيحة تقابل كلمتين من Whisper (مثل: توفرلك|2).
  - "كلمة~كلمة" تعني كلمتين صحيحتين سمعهما Whisper كلمة واحدة (مثل: وويا~منو ← «ويعمل»)، ويُقسم وقتها بينهما.
الاستخدام: python3 work/align.py [--skip 70.0-73.6 ...]   (--skip يحذف إعادة تسجيل أو محاولة ناقصة)
يكتب work/captions_source.json ويطبع جدول الفروقات لمراجعته يدوياً.
بدون script.txt: تُستخدم كلمات Whisper كما هي (مع تنبيه).
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
W = json.load(open(os.path.join(ROOT, "words_clean.json")))
skips = [tuple(map(float, a.split("-"))) for a in sys.argv[sys.argv.index("--skip") + 1 :]] if "--skip" in sys.argv else []
SKIP = {i for i, w in enumerate(W) if any(a <= w["s"] < b for a, b in skips)}
tokens = [i for i in range(len(W)) if i not in SKIP]
path = os.path.join(ROOT, "script.txt")

out = []
if not os.path.exists(path):
    print("⚠️ لا يوجد script.txt — استُخدمت كلمات Whisper كما هي. راجعها قبل الكابشن.")
    out = [{"text": W[i]["w"], "s": W[i]["s"], "e": W[i]["e"], "sent": 0, "heard": W[i]["w"]} for i in tokens]
else:
    sentences = [l.strip() for l in open(path) if l.strip()]
    k = 0
    for si, sent in enumerate(sentences):
        for raw in sent.split():
            text, n = (raw.split("|") + ["1"])[:2]
            idx = tokens[k : k + int(n)]
            if not idx:
                last = out[-6:]
                sys.exit(f"السكربت أطول من المنطوق عند «{text}» (الجملة {si + 1}). آخر المطابقات:\n"
                         + "\n".join(f'  {o["heard"]:<18} ← {o["text"]}' for o in last)
                         + "\nابحث عن كلمتين سمعهما Whisper كلمة واحدة واكتبهما بـ ~ ، أو أضف |n للعكس.")
            k += int(n)
            s0, e0 = W[idx[0]]["s"], W[idx[-1]]["e"]
            parts = text.split("~")
            for j, part in enumerate(parts):  # several script words heard as one token share its time
                a = s0 + (e0 - s0) * j / len(parts)
                b = s0 + (e0 - s0) * (j + 1) / len(parts)
                out.append({"text": part, "s": round(a, 3), "e": round(b, 3), "sent": si, "heard": " ".join(W[i]["w"] for i in idx)})
    if k != len(tokens):
        print(f"⚠️ استُخدمت {k} من {len(tokens)} كلمة منطوقة — راجع الجدول، قد ينقص السكربت كلمات أو يحتاج |n")
    strip = lambda t: t.strip("،.؟…«»!?,")
    for o in out:
        if strip(o["text"]) != strip(o["heard"]).replace(" ", ""):
            print(f'{o["s"]:7.2f}  {o["heard"]:<20} ← {o["text"]}')
json.dump(out, open(os.path.join(ROOT, "captions_source.json"), "w"), ensure_ascii=False, indent=1)
print("كلمات:", len(out))
