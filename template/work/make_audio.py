"""مؤثرات صوتية وموسيقى خلفية مولَّدة بالكامل (بلا أي صوت يحتاج ترخيصاً).
الاستخدام: python3 work/make_audio.py   (بعد work/edit.py، لأنه يقرأ work/cuts.json)
يكتب reel/public/sfx/*.wav و reel/public/music/main_music.wav
الموسيقى: هادئة 72 BPM بلا طبول، تنخفض تلقائياً تحت الصوت (ducking).
"""
import json
import os
import wave

import numpy as np

SR = 48000
ROOT = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.join(ROOT, "..", "reel", "public")
rng = np.random.default_rng(7)


def write(path, x):
    x = np.atleast_2d(x)
    if x.shape[0] == 1:
        x = np.vstack([x, x])
    peak = np.max(np.abs(x)) or 1
    x = x / max(peak, 1.0)
    data = (np.clip(x.T, -1, 1) * 32767).astype("<i2").tobytes()
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data)


def t(sec):
    return np.arange(int(sec * SR)) / SR


def onepole(x, cutoff):
    """Lowpass with per-sample cutoff (Hz)."""
    cutoff = np.broadcast_to(cutoff, x.shape)
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def reverb(x, mix=0.25, decay=0.5):
    out = x.copy()
    for d, g in [(0.029, 0.7), (0.037, 0.6), (0.041, 0.55), (0.053, 0.5)]:
        n = int(d * SR)
        buf = np.zeros(len(x) + n * 40)
        buf[: len(x)] += x
        for k in range(1, 40):
            amp = (g * decay) ** k
            if amp < 1e-3:
                break
            buf[k * n : k * n + len(x)] += x * amp
        out = out + mix * buf[: len(x)] / 4
    return out


def env(n, a, d):
    e = np.ones(n)
    na, nd = int(a * SR), int(d * SR)
    e[:na] = np.linspace(0, 1, na) ** 2 if na else 1
    e[-nd:] *= np.linspace(1, 0, nd) ** 2
    return e


def whoosh(sec=0.6, lo=300, hi=4500, peak=0.55):
    n = len(t(sec))
    noise = rng.standard_normal(n)
    pos = np.linspace(0, 1, n)
    cut = lo + (hi - lo) * np.sin(np.pi * np.clip(pos / (peak * 2), 0, 1)) ** 2
    y = onepole(noise, cut) - onepole(noise, cut * 0.25)
    e = np.where(pos < peak, (pos / peak) ** 2, ((1 - pos) / (1 - peak)) ** 1.5)
    y *= e
    pan = np.linspace(-0.6, 0.6, n)
    return np.vstack([y * (1 - pan) / 2, y * (1 + pan) / 2])


def tick(freq=1900):
    x = t(0.16)
    y = (np.sin(2 * np.pi * freq * x) + 0.4 * np.sin(2 * np.pi * freq * 2.01 * x)) * np.exp(-x * 45)
    return reverb(y, 0.3)


def shimmer(sec=1.8):
    x = t(sec)
    y = np.zeros_like(x)
    for k, f in enumerate([659.3, 987.8, 1318.5, 1661.2, 1975.5]):
        y += np.sin(2 * np.pi * f * x + k) * np.exp(-x * (2.2 + k * 0.5)) * (0.9 ** k)
        y += 0.5 * np.sin(2 * np.pi * f * 1.003 * x) * np.exp(-x * (2.6 + k * 0.5)) * (0.9 ** k)
    y *= np.minimum(1, x / 0.015)
    sweep = onepole(rng.standard_normal(len(x)), 6000) * np.exp(-((x - 0.15) ** 2) / 0.01) * 0.25
    return reverb(y + sweep, 0.45, 0.7)


def impact(sec=2.2, hit=0.24):
    x = t(sec)
    swell = onepole(rng.standard_normal(len(x)), 900 + 5000 * np.clip(x / hit, 0, 1)) * np.clip(x / hit, 0, 1) ** 3 * (x < hit) * 0.6
    tt = np.clip(x - hit, 0, None)
    sub = np.sin(2 * np.pi * (48 + 40 * np.exp(-tt * 18)) * tt) * np.exp(-tt * 3.2) * (x >= hit)
    air = onepole(rng.standard_normal(len(x)), 3000) * np.exp(-tt * 4) * (x >= hit) * 0.18
    return reverb(swell + sub * 1.1 + air, 0.3, 0.6)


def pop():
    x = t(0.25)
    f = 950 * np.exp(-x * 9) + 380
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 22)
    return reverb(y, 0.25)


def hook():
    x = t(1.4)
    sub = np.sin(2 * np.pi * (52 + 30 * np.exp(-x * 20)) * x) * np.exp(-x * 4.5)
    ping = (np.sin(2 * np.pi * 1568 * x) + 0.5 * np.sin(2 * np.pi * 2349 * x)) * np.exp(-x * 7) * 0.45
    air = onepole(rng.standard_normal(len(x)), 5000) * np.exp(-x * 6) * 0.12
    return reverb(sub + ping + air, 0.35, 0.65)


os.makedirs(os.path.join(PUB, "sfx"), exist_ok=True)
for name, sig in {
    "whoosh": whoosh(),
    "swish": whoosh(0.4, 900, 7000, 0.5),
    "tick": tick(),
    "shimmer": shimmer(),
    "impact": impact(),
    "pop": pop(),
    "hook": hook(),
}.items():
    write(os.path.join(PUB, "sfx", f"{name}.wav"), np.asarray(sig) * 0.9)

NOTE = lambda m: 440 * 2 ** ((m - 69) / 12)


def voice_envelope(clips, duration):
    """نشاط الصوت على الخط الزمني النهائي، من الصوت النظيف وقائمة المقاطع."""
    with wave.open(os.path.join(ROOT, "voice_16k.wav")) as w:
        v = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
    hop = 160
    rms = np.sqrt(np.convolve(v**2, np.ones(hop) / hop, "same"))[::hop]
    active = (20 * np.log10(rms + 1e-9) > -42).astype(float)
    out = np.zeros(int(duration * 100))
    for c in clips:
        a, o, d = int(c["trim"] / 30 * 100), int(c["from"] / 30 * 100), int(c["dur"] / 30 * 100)
        seg = active[a : a + d]
        out[o : o + len(seg)] = seg[: max(0, len(out) - o)]
    sm = np.zeros_like(out)
    acc = 0
    for i, val in enumerate(out):  # attack fast, release slow
        acc = acc + (val - acc) * (0.5 if val > acc else 0.04)
        sm[i] = acc
    return np.interp(np.arange(int(duration * SR)) / SR, np.arange(len(sm)) / 100, sm)


# Calm bed: 72 BPM, Dmaj7 - Bm7 - Gmaj7 - A, warm pad + sparse soft piano, no drums.
CALM_BPM = 72
CALM_CHORDS = [[50, 54, 57, 61], [47, 50, 54, 57], [43, 47, 50, 54], [45, 49, 52, 57]]
CALM_MELODY = [[0, 2, 3, 2], [1, 3, 2, 1], [0, 2, 3, 1], [1, 2, 3, 2]]


def piano(f, sec):
    tt = np.arange(int(sec * SR)) / SR
    tone = sum(np.sin(2 * np.pi * f * k * tt) * a for k, a in ((1, 1), (2, 0.35), (3, 0.12), (4, 0.05)))
    return tone * np.minimum(1, tt / 0.008) * np.exp(-tt * 1.6)


def music_calm(duration, voice_env):
    n = int(duration * SR)
    x = np.arange(n) / SR
    beat = 60 / CALM_BPM
    bar = 4 * beat
    pad = np.zeros(n)
    keys = np.zeros(n)
    bass = np.zeros(n)
    for b in range(int(duration / bar) + 2):
        ch = CALM_CHORDS[b % 4]
        s0 = b * bar
        i0, i1 = int(s0 * SR), min(n, int((s0 + bar + 0.6) * SR))
        if i0 >= n:
            break
        seg = x[i0:i1] - s0
        e = np.minimum(1, seg / 1.2) * np.clip((bar + 0.6 - seg) / 1.0, 0, 1)
        for m in ch:
            for det in (-0.06, 0.06):
                pad[i0:i1] += np.sin(2 * np.pi * NOTE(m + 12) * 2 ** (det / 12) * seg) * e * 0.1
        bass[i0:i1] += np.sin(2 * np.pi * NOTE(ch[0] - 12) * seg) * e * 0.28
        for k, idx in enumerate(CALM_MELODY[b % 4]):
            j0 = int((s0 + k * beat) * SR)
            if j0 >= n:
                break
            note = piano(NOTE(ch[idx] + 24), min(beat * 2.5, (n - j0) / SR))
            keys[j0 : j0 + len(note)] += note * (0.22 if k % 2 == 0 else 0.15)
    mix = onepole(pad, 1400) + onepole(keys, 3200) + bass
    mix = reverb(mix, 0.4, 0.75)
    env_n = np.pad(voice_env[:n], (0, max(0, n - len(voice_env))), mode="edge")  # rounding can differ by a sample
    mix *= 1 - 0.7 * env_n
    mix *= np.minimum(1, x / 1.5) * np.minimum(1, (duration - x) / 2.0)
    mix /= np.max(np.abs(mix)) + 1e-9
    return mix * 0.32


CUTS = json.load(open(os.path.join(ROOT, "cuts.json")))
os.makedirs(os.path.join(PUB, "music"), exist_ok=True)
dur = CUTS["duration"] / 30
write(os.path.join(PUB, "music", "main_music.wav"), music_calm(dur, voice_envelope(CUTS["clips"], dur)))
print("music", round(dur, 2), "s · sfx:", sorted(os.listdir(os.path.join(PUB, "sfx"))))
