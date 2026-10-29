"""Synthesize original SFX and a ducked music bed for each cut (no third-party audio)."""
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

# ------------------------------------------------------------------ music bed

BPM = 100
BEAT = 60 / BPM
NOTE = lambda m: 440 * 2 ** ((m - 69) / 12)
# vi - IV - I - V in A major: F#m, D, A, E (one chord per bar)
CHORDS = [[54, 57, 61], [50, 54, 57], [45, 49, 52], [52, 56, 59]]
ARP = [0, 1, 2, 1, 2, 0, 1, 2]


def music(duration, sections, voice_env):
    n = int(duration * SR)
    x = np.arange(n) / SR
    pad = np.zeros(n)
    pluck = np.zeros(n)
    bass = np.zeros(n)
    kick = np.zeros(n)
    hat = np.zeros(n)
    bars = int(duration / (4 * BEAT)) + 2
    for b in range(bars):
        ch = CHORDS[b % 4]
        s0 = b * 4 * BEAT
        i0, i1 = int(s0 * SR), min(n, int((s0 + 4 * BEAT) * SR))
        if i0 >= n:
            break
        seg = x[i0:i1] - s0
        e = np.minimum(1, seg / 0.4) * np.minimum(1, (4 * BEAT - seg) / 0.25)
        for m in ch:
            for det in (-0.08, 0.08):
                f = NOTE(m + 12) * 2 ** (det / 12)
                pad[i0:i1] += (np.sin(2 * np.pi * f * seg) + 0.3 * np.sin(4 * np.pi * f * seg)) * e * 0.12
        for k in range(8):
            ps = s0 + k * BEAT / 2
            j0 = int(ps * SR)
            if j0 >= n:
                break
            tt = np.arange(min(int(0.45 * SR), n - j0)) / SR
            f = NOTE(ch[ARP[k]] + 24)
            pluck[j0 : j0 + len(tt)] += (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(6 * np.pi * f * tt)) * np.exp(-tt * 9) * 0.3
        for k in range(4):
            ps = s0 + k * BEAT
            j0 = int(ps * SR)
            if j0 >= n:
                break
            tt = np.arange(min(int(BEAT * SR), n - j0)) / SR
            bass[j0 : j0 + len(tt)] += np.sin(2 * np.pi * NOTE(ch[0] - 12) * tt) * np.minimum(1, tt / 0.03) * np.exp(-tt * 2.5) * 0.5
            kick[j0 : j0 + len(tt)] += np.sin(2 * np.pi * (45 + 70 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 12)
            h0 = int((ps + BEAT / 2) * SR)
            if h0 < n:
                th = np.arange(min(int(0.06 * SR), n - h0)) / SR
                hat[h0 : h0 + len(th)] += rng.standard_normal(len(th)) * np.exp(-th * 80) * 0.25
    hat = hat - onepole(hat, 6000)
    pad = onepole(pad, 2200)

    def level(key):
        lv = np.zeros(n)
        for a, b, v in sections:
            lv[int(a * SR) : int(b * SR)] = v.get(key, 0)
        return onepole(lv, 3.0)  # smooth section changes

    pump = 1 - 0.35 * np.exp(-((x % BEAT) / 0.12))
    mix = pad * level("pad") + pluck * level("pluck") + bass * level("bass") * pump + kick * level("kick") * 0.6 + hat * level("hat")
    mix = reverb(mix, 0.2, 0.5)
    duck = 1 - 0.55 * voice_env
    mix *= duck
    fade = np.minimum(1, x / 0.05) * np.minimum(1, (duration - x) / 1.2)
    mix *= fade
    mix /= np.max(np.abs(mix)) + 1e-9
    return mix * 0.5


def voice_envelope(tl, duration):
    """Voice activity on the output timeline, from the clean voice track and the shot list."""
    with wave.open(os.path.join(ROOT, "voice_16k.wav")) as w:
        v = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
    vsr = 16000
    hop = vsr // 100
    rms = np.sqrt(np.convolve(v**2, np.ones(hop) / hop, "same"))[::hop]
    active = (20 * np.log10(rms + 1e-9) > -42).astype(float)
    out = np.zeros(int(duration * 100))
    for s in tl["shots"]:
        if s["name"] == "Pause":
            continue
        a = int(s["trim"] / 30 * 100)
        o = int(s["start"] / 30 * 100)
        d = int(s["dur"] / 30 * 100)
        out[o : o + d] = active[a : a + d]
    # attack fast, release slow, then resample to audio rate
    sm = np.zeros_like(out)
    acc = 0
    for i, val in enumerate(out):
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


TL = json.load(open(os.path.join(ROOT, "timeline.json")))
os.makedirs(os.path.join(PUB, "music"), exist_ok=True)
full = {"pad": 1, "pluck": 1, "bass": 1, "kick": 0, "hat": 0}
drive = {"pad": 1, "pluck": 1, "bass": 1, "kick": 1, "hat": 1}
calm = {"pad": 1, "pluck": 0.5, "bass": 0.8, "kick": 0, "hat": 0}
for cut in ("main", "short"):
    tl = TL[cut]
    dur = tl["duration"] / 30
    sp = {s["name"]: s for s in tl["shots"]}
    sec = lambda name, edge="start": (sp[name]["start"] + (sp[name]["dur"] if edge == "end" else 0)) / 30
    if cut == "main":
        sections = [
            (0, sec("Services"), full),
            (sec("Services"), sec("Differentiator"), drive),
            (sec("Differentiator"), sec("Slogan"), calm),
            (sec("Slogan"), dur, drive),
        ]
    else:
        sections = [(0, sec("Services"), full), (sec("Services"), dur, drive)]
    m = music_calm(dur, voice_envelope(tl, dur))
    write(os.path.join(PUB, "music", f"{cut}_music.wav"), m)
    print(cut, "music", round(dur, 2), "s")
print("sfx:", sorted(os.listdir(os.path.join(PUB, "sfx"))))


# v2 short: the main voice envelope cut into the same ranges, so the bed ducks under the right words
CUTS = json.load(open(os.path.join(ROOT, "v2_cuts.json")))
main_tl = TL["main"]
env_main = voice_envelope(main_tl, main_tl["duration"] / 30)
parts = [env_main[int(a / 30 * SR) : int(b / 30 * SR)] for a, b in CUTS["short"]]
env_short = np.concatenate(parts)
write(os.path.join(PUB, "music", "v2short_music.wav"), music_calm(len(env_short) / SR, env_short))
print("v2 short music", round(len(env_short) / SR, 2), "s")
