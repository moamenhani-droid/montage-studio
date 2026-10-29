"""محرك القص: يحوّل قرارات edit.py (بثواني التسجيل الأصلي) إلى إطارات، ويكتب كل شيء معاً:
reel/src/data.ts، وwork/cuts.json، وdeliverables/*.srt، وdeliverables/edit_decisions.csv.

قواعد القص (مُختبرة في إعلان المنفذون):
- بداية الكلام: أول لحظة يتجاوز فيها الصوت ‑32 dB لمدة ٣٠ مللي ثانية، ويُترك قبلها ٧٠ مللي ثانية.
- كل حافة قص تنتقل إلى داخل السكتة الحقيقية: ٧٠ مللي ثانية قبل أول كلمة، و٥٠ بعد آخر كلمة.
- أصغر وحدة قص إطار واحد (٣٣ مللي ثانية).
"""
import csv
import json
import os

import numpy as np

FPS = 30
ROOT = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.join(ROOT, "..")
OUT = os.path.join(PROJ, "deliverables")
f = lambda t: int(round(t * FPS))


def _load(name, default):
    p = os.path.join(ROOT, name)
    return json.load(open(p)) if os.path.exists(p) else default


ENV = np.load(os.path.join(ROOT, "env_db.npy")) if os.path.exists(os.path.join(ROOT, "env_db.npy")) else None


def pause_near(t, win=0.7, thr=-36, minlen=0.08):
    """أطول سكتة (تحت thr) ضمن ±win من t: (بداية، نهاية) بالثواني."""
    if ENV is None:
        return None
    i0, i1 = max(0, int((t - win) * 100)), min(len(ENV), int((t + win) * 100))
    best, j = None, i0
    while j < i1:
        if ENV[j] < thr:
            k = j
            while k < i1 and ENV[k] < thr:
                k += 1
            if (k - j) / 100 >= minlen:
                score = (k - j) - abs((j + k) / 2 - t * 100) * 0.4
                if best is None or score > best[0]:
                    best = (score, j / 100, k / 100)
            j = k
        else:
            j += 1
    return best[1:] if best else None


def onset(extra_frames=0):
    """بداية الكلام الحقيقية مع هامش ٧٠ مللي ثانية (+ إطارات إضافية إن طُلب)."""
    if ENV is None:
        return 0.0
    k = next((i for i in range(len(ENV) - 3) if min(ENV[i : i + 3]) > -32), 0)
    return max(0.0, round(k / 100 - 0.07 - extra_frames / FPS, 4))


def tighten(shots, lock_end=(), head_extra=0):
    res = []
    for name, a, b in shots:
        if a == 0:
            a = onset(head_extra)
        else:
            g = pause_near(a)
            if g:
                a = round(g[1] - 0.07, 3)
        if name not in lock_end:
            g = pause_near(b)
            if g:
                b = round(g[0] + 0.05, 3)
        res.append((name, a, b))
    return res


def build(SHOTS, SCENES, FACE=None, SHORT=(), SFX=(), MUSIC=False, LOCK_END=(), HEAD_EXTRA_FRAMES=0, TAIL_FRAMES=0, TIGHTEN=True, NAME=None):
    """SHOTS: [(name, a, b)] أجزاء التسجيل المحتفَظ بها بالترتيب.
    SCENES: [(name, a, b, kind, style, props)] — kind: face | graphic، وstyle من styles/registry.ts.
    TAIL_FRAMES: إطارات إضافية بعد آخر كلمة (مثلاً لشاشة ختامية تحت آخر كلمة)."""
    shots = tighten(SHOTS, LOCK_END, HEAD_EXTRA_FRAMES) if TIGHTEN else list(SHOTS)
    lay, t = [], 0
    for name, a, b in shots:
        dur = f(b) - f(a)
        lay.append(dict(name=name, a=a, b=b, start=t, dur=dur, trim=f(a)))
        t += dur
    speech_end = t
    duration = t + TAIL_FRAMES

    def out(src):
        for s in lay:
            if s["a"] - 1e-6 <= src < s["b"] + 1e-6:
                return s["start"] + f(src) - s["trim"]
        for s in lay:  # word edges that spill a few frames past a cut
            if s["b"] < src <= s["b"] + 0.4:
                return s["start"] + s["dur"]
        for s in lay:  # inside a removed pause: snap to the next shot's first frame
            if s["a"] - 0.9 <= src < s["a"]:
                return s["start"]
        raise ValueError(f"الثانية {src} ليست ضمن أي لقطة محتفَظ بها")

    words = _load("captions_source.json", [])
    scenes = []
    for i, (name, a, b, kind, style, props) in enumerate(SCENES):
        start = out(a)
        end = duration if i == len(SCENES) - 1 else out(b)
        ws = [{"t": out(w["s"]), "text": w["text"]} for w in words if a - 0.05 <= w["s"] < b - 0.05]
        clip = next((c for c in lay if c["start"] <= start < c["start"] + c["dur"]), lay[-1])
        scenes.append({
            "name": name, "start": start, "end": end, "kind": kind, "style": style,
            "transition": props.pop("transition", "cut" if i == 0 else "fade"), "props": props,
            "words": ws, "trim": clip["trim"] + (start - clip["start"]),
        })

    face = {"mode": "master", "master": "footage/master.mp4", "person": "footage/person_alpha.webm", "room": "backgrounds/room.jpg", "scale": 1.12, "dx": 0}
    try:  # centre the body from the matte (median torso centroid)
        med = float(open(os.path.join(ROOT, "matte_log.txt")).read().split("median_cx=")[1].split()[0])
        face["dx"] = int(round(540 - med))
    except (OSError, IndexError, ValueError):
        pass
    face.update(FACE or {})

    by_name = {s["name"]: s for s in scenes}
    short, cur = [], None
    for s in scenes:
        if s["name"] in SHORT:
            if cur and cur[1] == s["start"]:
                cur[1] = s["end"]
            else:
                cur = [s["start"], s["end"]]
                short.append(cur)
        else:
            cur = None
    sfx = [{"at": max(0, by_name[sc]["start"] + off), "src": f"sfx/{snd}.wav", "volume": vol} for snd, sc, off, vol in SFX]

    data = {
        "demo": False, "fps": FPS, "duration": duration, "speechEnd": speech_end, "face": face,
        "voice": "footage/voice_clean.wav", "music": "music/main_music.wav" if MUSIC else "",
        "clips": [{"from": c["start"], "trim": c["trim"], "dur": c["dur"]} for c in lay],
        "scenes": scenes, "sfx": sfx, "short": short or [[0, duration]],
    }
    path = os.path.join(PROJ, "reel", "src", "data.ts")
    open(path, "w").write(
        "// يُولَّد تلقائياً من work/edit.py — لا تعدّله يدوياً، عدّل edit.py ثم شغّل: python3 work/edit.py\n"
        'import type {Data} from "./dataTypes";\n\n'
        "export const DATA: Data = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n"
    )
    json.dump({"duration": duration, "speech_end": speech_end, "short": data["short"], "clips": data["clips"]}, open(os.path.join(ROOT, "cuts.json"), "w"))

    os.makedirs(OUT, exist_ok=True)
    name = NAME or os.path.basename(os.path.abspath(PROJ))
    _srt(scenes, [[0, duration]], os.path.join(OUT, f"{name}_captions.srt"))
    _srt(scenes, data["short"], os.path.join(OUT, f"{name}_short_captions.srt"))
    with open(os.path.join(OUT, "edit_decisions.csv"), "w", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["shot", "src_in", "src_out", "out_start_frame", "frames"])
        for c in lay:
            w.writerow([c["name"], c["a"], c["b"], c["start"], c["dur"]])

    print(f"المدة: {duration} إطاراً ({duration / FPS:.2f} ث) · القصيرة: {sum(b - a for a, b in data['short']) / FPS:.2f} ث")
    for s in scenes:
        print(f'{s["start"]:5d}-{s["end"]:5d}  {s["kind"]:7s} {s["style"]:15s} {s["name"]}  ({len(s["words"])} كلمة)')
    return data


def _srt(scenes, ranges, path):
    words = sorted((w for s in scenes for w in s["words"]), key=lambda w: w["t"])
    remap, off = [], 0
    for a, b in ranges:
        remap.append((a, b, off))
        off += b - a
    mapped = [(w["t"] - a + o, w["text"]) for w in words for a, b, o in remap if a <= w["t"] < b]
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
            end = min(cues[i][0][0] if i < len(cues) else c[-1][0] + 24, c[-1][0] + 36)
            fh.write(f"{i}\n{tc(c[0][0])} --> {tc(end)}\n{' '.join(x for _, x in c)}\n\n")
