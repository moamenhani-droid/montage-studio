"""Scene data for the v2 animatic: every scene, its words at output frames, its blocks and camera spot.

Writes reel/src/v2/animaticData.ts. Times are given in SOURCE seconds and mapped onto the
current main edit (timeline.json), so the animatic always follows the real voice.
"""
import json
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(os.path.join(ROOT, "timeline.json")))["main"]
WORDS = json.load(open(os.path.join(ROOT, "captions_source.json")))
for w in WORDS:
    if 73.5 < w["s"] < 74.3 and w["text"].startswith("المنفذون"):
        w["s"] = 74.30
SHOTS = [s for s in TL["shots"] if s["name"] != "Pause"]


def out(src):
    for s in SHOTS:
        if s["a"] - 1e-6 <= src < s["b"] + 1e-6:
            return s["start"] + round(src * 30) - s["trim"]
    for s in SHOTS:
        if s["b"] < src <= s["b"] + 0.4:
            return s["start"] + s["dur"]
    for s in SHOTS:  # inside a removed pause: snap to the next shot's first frame
        if s["a"] - 0.9 <= src < s["a"]:
            return s["start"]
    raise ValueError(src)


KEY_PHRASES = [
    "عندك فكرة مشروع", "الحل بمكان واحد", "بمكان واحد", "من الفكرة إلى التنفيذ", "ذكاء اصطناعي",
    "كل احتياجات مشروعك التقنية", "فكرتك، تنفيذنا", "أضعاف", "المنفذون تيك", "يميّزنا؟",
]
norm = lambda t: t.strip("،.؟…«»").replace("ّ", "")


def words_between(a, b):
    return [w for w in WORDS if a - 0.05 <= w["s"] < b - 0.05]


def lines_of(ws):
    """Break a scene's words into display lines at punctuation (max 5 words)."""
    lines, cur = [], []
    for w in ws:
        cur.append(w)
        if w["text"][-1] in "،.؟…" or len(cur) >= 5:
            lines.append(cur)
            cur = []
    if cur:
        lines.append(cur)
    res = []
    for ln in lines:
        texts = [norm(w["text"]) for w in ln]
        keys = set()
        for ph in KEY_PHRASES:
            p = [norm(x) for x in ph.split()]
            for i in range(len(texts) - len(p) + 1):
                if texts[i : i + len(p)] == p:
                    keys.update(range(i, i + len(p)))
        res.append({"words": [{"t": out(w["s"]), "text": w["text"]} for w in ln], "keys": sorted(keys)})
    return res


def B(label, src, x, y, w, h, kind="box"):
    return {"label": label, "at": out(src), "x": x, "y": y, "w": w, "h": h, "kind": kind}


# name, source start, source end, kind, blocks
S = [
    ("المشكلة", 5.81, 10.52, "graphic", [
        B("بطاقة: مبرمج", 5.81, 520, 360, 420, 160), B("بطاقة: مصمّم", 6.44, 120, 560, 420, 160),
        B("بطاقة: شركات متفرقة", 7.05, 300, 790, 520, 160), B("فواتير تتراكم", 8.50, 120, 1010, 220, 250, "stack")]),
    ("وقت ضائع", 10.52, 16.14, "graphic", [
        B("خطوط متشابكة بين الجهات", 10.52, 140, 420, 800, 420, "tangle"),
        B("تستقيم وتتجمع في كتلة واحدة", 14.43, 330, 470, 420, 330, "slab")]),
    ("مهما كانت فكرتك", 16.14, 19.80, "graphic", [
        B("رسومات أفكار تطفو", 16.14, 160, 430, 760, 380, "float")]),
    ("بناء الشعار", 19.80, 22.41, "graphic", [B("الشعار: من المخطط إلى البناء", 19.80, 280, 430, 520, 410, "logo")]),
    ("من الفكرة إلى التنفيذ", 22.41, 24.30, "graphic", [B("خط من رسم الفكرة إلى واجهة منفذة", 22.41, 90, 520, 900, 260, "track4")]),
    ("نشتغل وياك", 24.30, 30.50, "graphic", [
        B("«ننفّذ طلبك» تُشطب", 25.12, 200, 430, 680, 120, "strike"),
        B("لوحة تصميم مشتركة ومؤشران", 26.44, 140, 600, 800, 430, "cursors")]),
    ("٠١ مواقع إلكترونية", 30.50, 32.03, "service", [B("موقع Venda يُبنى", 30.50, 70, 600, 940, 590, "shot:projects/venda-desktop.webp")]),
    ("٠٢ تطبيقات موبايل", 32.03, 33.29, "service", [B("ثلاث شاشات جوال", 32.03, 170, 520, 740, 700, "shot:projects/mandi-menu-mobile.webp")]),
    ("٠٣ متاجر إلكترونية", 33.29, 34.82, "service", [B("متجر السعد IT", 33.29, 70, 600, 940, 590, "shot:projects/alsaad-desktop.webp")]),
    ("٠٤ أنظمة متكاملة", 34.82, 36.14, "service", [B("لوحات أنظمة متتالية", 34.82, 70, 600, 940, 590, "shot:projects/inventory.svg")]),
    ("٠٥ ذكاء اصطناعي", 36.14, 37.38, "service", [B("شبكة عصبية من مربعات الشعار", 36.14, 120, 560, 840, 560, "neural")]),
    ("٠٦ أتمتة", 37.38, 38.56, "service", [B("مسار رسالة ← رد آلي", 37.38, 70, 600, 940, 590, "shot:projects/whatsapp-bot.svg")]),
    ("٠٧ حلول برمجية خاصة", 38.56, 40.88, "service", [B("أنظمة مصممة حسب الشغل", 38.56, 70, 600, 940, 590, "shot:projects/clinic.svg")]),
    ("٠٨ تصاميم وهويات", 40.88, 44.62, "service", [B("هوية المنفذون: ألوان وخط وشعار", 40.88, 120, 560, 840, 560, "identity")]),
    ("بمكان واحد", 44.62, 48.42, "graphic", [B("بطاقات الخدمات تشكّل الشعار", 44.62, 200, 430, 680, 520, "mosaic")]),
    ("شنو اللي يميّزنا", 48.42, 50.43, "title", []),
    ("كيف نشتغل", 50.43, 58.40, "process", []),
    ("هدفنا", 58.40, 65.32, "graphic", [
        B("طرد يُسلَّم ثم يُشطب", 58.40, 300, 430, 480, 330, "parcel"),
        B("خط نمو يمتد", 61.16, 140, 820, 800, 300, "growth")]),
    ("شركة أو فكرة", 65.32, 70.15, "graphic", [
        B("مبنى شركة", 66.12, 560, 470, 400, 420, "half"), B("رسم فكرة", 67.77, 120, 470, 400, 420, "half")]),
    ("فكرتك، تنفيذنا", 73.95, 76.90, "slogan", []),
]

PROCESS_STEPS = [("نسمع", 50.85), ("نفهم", 51.97), ("نخطّط", 53.56), ("نصمّم", 54.09), ("نبرمج", 54.68), ("نطلق", 56.96), ("نطوّر", 57.60)]

scenes = []
for i, (name, a, b, kind, blocks) in enumerate(S):
    scenes.append({
        "name": name,
        "start": out(a),
        "end": out(b),
        "kind": kind,
        "lines": lines_of(words_between(a, b)),
        "blocks": blocks,
        # world position on the big canvas: right-to-left, alternating height, services on one wall
        "cam": {"x": -i * 1240, "y": (0 if kind == "service" else (i % 2) * 340)},
    })

face = {
    "hook": {"start": 0, "end": out(5.81), "lines": lines_of(words_between(0, 5.81))},
    "cta": {"start": out(76.90), "end": TL["speech_frames"], "lines": lines_of(words_between(76.90, 81.43))},
}
voice = [{"from": s["start"], "trim": s["trim"], "dur": s["dur"]} for s in SHOTS]
data = {
    "duration": TL["duration"],
    "speechEnd": TL["speech_frames"],
    "scenes": scenes,
    "face": face,
    "voice": voice,
    "process": [{"text": t, "at": out(s)} for t, s in PROCESS_STEPS],
}
# Short cut (~37 s): hook→problem→question, logo→idea-to-execution, services 01–06, slogan→CTA→end.
st = {sc["name"]: sc["start"] for sc in scenes}
data["short"] = [
    [0, st["مهما كانت فكرتك"]],
    [st["بناء الشعار"], st["نشتغل وياك"]],
    [st["٠١ مواقع إلكترونية"], st["٠٧ حلول برمجية خاصة"]],
    [st["فكرتك، تنفيذنا"], data["duration"]],
]


def srt(ranges, path):
    """Cues from the word timings, remapped onto a cut made of output ranges."""
    words = [w for sc in scenes for l in sc["lines"] for w in l["words"]]
    words += [w for k in ("hook", "cta") for l in face[k]["lines"] for w in l["words"]]
    words.sort(key=lambda w: w["t"])
    remap, off = [], 0
    for a, b in ranges:
        remap.append((a, b, off))
        off += b - a
    mapped = []
    for w in words:
        for a, b, o in remap:
            if a <= w["t"] < b:
                mapped.append((w["t"] - a + o, w["text"]))
    cues, cur = [], []
    for t, text in mapped:
        cur.append((t, text))
        if len(cur) >= 5 or text[-1] in "،.؟…":
            cues.append(cur)
            cur = []
    if cur:
        cues.append(cur)
    tc = lambda fr: "%02d:%02d:%02d,%03d" % (fr // 108000, fr // 1800 % 60, fr // 30 % 60, round(fr % 30 / 30 * 1000))
    with open(path, "w") as fh:
        for i, c in enumerate(cues, 1):
            end = cues[i][0][0] if i < len(cues) else c[-1][0] + 24
            end = min(end, c[-1][0] + 36)
            fh.write(f"{i}\n{tc(c[0][0])} --> {tc(end)}\n{' '.join(x for _, x in c)}\n\n")


OUTD = os.path.join(ROOT, "..", "deliverables")
srt([[0, data["duration"]]], os.path.join(OUTD, "almonafithoon_v2_captions_ar.srt"))
srt(data["short"], os.path.join(OUTD, "almonafithoon_v2_short_captions_ar.srt"))
json.dump({"main": data["duration"], "short": data["short"]}, open(os.path.join(ROOT, "v2_cuts.json"), "w"))

path = os.path.join(ROOT, "..", "reel", "src", "v2", "animaticData.ts")
open(path, "w").write(
    "// Generated by work/build_v2.py — scene timing for the v2 animatic (output frames, 30 fps).\n"
    "export const DATA = " + json.dumps(data, ensure_ascii=False, indent=1) + " as const;\n"
)
print(len(scenes), "scenes;", "duration", data["duration"], "frames")
for s in scenes:
    print(f'{s["start"]:5d}-{s["end"]:5d}  {s["kind"]:8s} {s["name"]}  lines={len(s["lines"])}')

import re

root = os.path.join(ROOT, "..", "reel", "src", "Root.tsx")
src = open(root).read()
for cid in ("V2-Animatic", "V2-Main", "V2-Clean", "V3-Sketch"):
    src = re.sub(r'(id="%s"[^/]*?durationInFrames=\{)\d+(\})' % cid, r"\g<1>%d\2" % data["duration"], src)
src = re.sub(r'(id="V2-Short"[^/]*?durationInFrames=\{)\d+(\})', r"\g<1>%d\2" % sum(b - a for a, b in data["short"]), src)
open(root, "w").write(src)
