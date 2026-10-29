"""Map the corrected script words onto whisper word timings.

Each sentence lists corrected words; "word|n" consumes n whisper tokens.
Whisper tokens listed in SKIP (the abandoned retake) are dropped.
Output: work/captions_source.json (source-time ms, one entry per word).
"""
import json

W = json.load(open("words_clean.json"))

SENTENCES = [
    "عندك فكرة مشروع… بس كل ما تريد تنفذها، تحتار منين تبدأ وويا منو تشتغل؟",
    "مبرمج، مصمّم، شركات متفرقة، وكوست أضعاف الطبيعي.",
    "ليش تضيّع وقتك بين أكثر من جهة، إذا تگدر تحصل الحل بمكان واحد؟",
    "مهما كانت فكرتك أو احتياجات مشروعك التقنية، المنفذون تيك تقدر توفرلك|2 الحل… من الفكرة إلى التنفيذ.",
    "إحنا مو بس ننفّذ طلبك… إحنا نشتغل وياك حتى نوصل للحل الأنسب لمشروعك.",
    "مواقع إلكترونية، تطبيقات موبايل، متاجر إلكترونية، أنظمة متكاملة…",
    "ذكاء اصطناعي وأتمتة، وحلول برمجية خاصة حسب شغلك.",
    "وحتى التصاميم الاحترافية والهويات البصرية…",
    "كل احتياجات مشروعك التقنية بمكان واحد.",
    "بس شنو اللي يميّزنا؟",
    "إحنا نسمع فكرتك، نفهم احتياجاتك، نخطّط، نصمّم، نبرمج، ونوصل وياك لمرحلة الإطلاق والتطوير.",
    "لأن هدفنا مو بس نسلّمك مشروع…",
    "هدفنا نقدّملك|2 حل يخدم شغلك ويساعده يتطوّر.",
    "سواء عندك شركة تريد تطوّرها، أو فكرة مشروع بعدها ببدايتها…",
    "المنفذون تيك… فكرتك، تنفيذنا.",
    "راسلنا هسه بكلمة «فكرة»، وخلّينا نبدأ أول خطوة بمشروعك.",
]

# The abandoned take "المنفذون تك تقدر" (70.16s - 73.62s)
SKIP = {i for i, w in enumerate(W) if 70.0 <= w["s"] < 73.6}

tokens = [i for i in range(len(W)) if i not in SKIP]
out, k = [], 0
for si, sent in enumerate(SENTENCES):
    for raw in sent.split(" "):
        text, n = (raw.split("|") + ["1"])[:2]
        n = int(n)
        idx = tokens[k : k + n]
        k += n
        s, e = W[idx[0]]["s"], W[idx[-1]]["e"]
        out.append({"text": text, "s": s, "e": e, "sent": si, "heard": " ".join(W[i]["w"] for i in idx)})

assert k == len(tokens), f"used {k} of {len(tokens)} tokens"
json.dump(out, open("captions_source.json", "w"), ensure_ascii=False, indent=1)
for o in out:
    if o["text"].strip("،.؟…«»") != o["heard"].strip("،.؟"):
        print(f'{o["s"]:6.2f}  {o["heard"]:<18} -> {o["text"]}')
print("words:", len(out))
