"""Generate the editable Remotion timelines (MainReel.tsx, ShortReel.tsx) from the edit decisions.

This runs once to create the first cut. After that the .tsx files are the source of truth:
edits made in Remotion Studio write straight back into them.
Also writes edit_decisions.csv, the SRT files and timeline.json (for music ducking / SFX / QA).
"""
import csv
import json
import os

FPS = 30
ROOT = os.path.dirname(os.path.abspath(__file__))
REEL = os.path.join(ROOT, "..", "reel")
OUT = os.path.join(ROOT, "..", "deliverables")
os.makedirs(OUT, exist_ok=True)

f = lambda t: int(round(t * FPS))
WORDS = json.load(open(os.path.join(ROOT, "captions_source.json")))
for w in WORDS:  # whisper put the restart of the slogan too early; the envelope shows onset at 74.30s
    if 73.5 < w["s"] < 74.3 and w["text"].startswith("المنفذون"):
        w["s"] = 74.30
W = lambda s: next(w for w in WORDS if abs(w["s"] - s) < 0.02)["s"]

# name, src in, src out, scale at start, scale at end, push window (src secs) or None, note
SHOTS_MAIN = [
    ("Hook", 0.00, 5.81, 1.12, 1.18, (2.6, 5.81), "Close-up, push-in on the question"),
    ("Problem", 5.81, 10.52, 1.00, 1.00, None, "Medium — covered by problem B-roll"),
    ("Question", 10.52, 16.14, 1.06, 1.06, None, "Medium-close for the main question"),
    ("Solution", 16.14, 24.30, 1.00, 1.08, (16.14, 19.90), "Push-in into the brand name"),
    ("Partnership", 24.30, 30.50, 1.12, 1.14, (24.30, 30.50), "Close"),
    ("Services", 30.50, 44.62, 1.00, 1.00, None, "Mostly covered by service B-roll"),
    ("All in one place", 44.62, 48.42, 1.08, 1.10, (44.62, 48.42), "Medium-close"),
    ("Differentiator", 48.42, 50.43, 1.16, 1.16, None, "Punch-in on the question"),
    ("Process", 50.43, 58.40, 1.02, 1.04, (50.43, 58.40), "Medium"),
    ("Goal A", 58.40, 61.16, 1.06, 1.08, (58.40, 61.16), "Medium"),
    ("Goal B", 61.16, 65.32, 1.13, 1.16, (61.16, 65.32), "Close for emphasis"),
    ("Audience", 65.32, 70.15, 1.00, 1.03, (65.32, 70.15), "Medium"),
    ("Slogan", 73.95, 76.90, 1.04, 1.12, (73.95, 76.90), "Retake removed before; push-in"),
    ("CTA", 76.90, 81.4333, 1.06, 1.06, None, "Medium-close; ends before the hand reaches for the camera"),
]

SHOTS_SHORT = [
    ("Hook", 0.00, 5.81, 1.12, 1.18, (2.6, 5.81), ""),
    ("Question", 10.52, 16.14, 1.04, 1.08, (10.52, 16.14), ""),
    ("Solution", 16.14, 24.30, 1.00, 1.08, (16.14, 19.90), ""),
    ("Services", 30.50, 38.04, 1.00, 1.00, None, ""),
    ("Slogan", 73.95, 76.90, 1.04, 1.12, (73.95, 76.90), ""),
    ("CTA", 76.90, 81.4333, 1.06, 1.06, None, ""),
]

END_FRAMES = 75

try:
    _med = float(open(os.path.join(ROOT, "matte_log.txt")).read().split("median_cx=")[1].split()[0])
    DX = int(round(540 - _med))
except (OSError, IndexError):
    DX = 0


import numpy as np

ENV = np.load(os.path.join(ROOT, "env_db.npy"))  # voice level per 10 ms (dB)


def pause_near(t, win=0.7, thr=-36, minlen=0.08):
    """Longest stretch of near-silence within ±win of t: (start, end) in seconds."""
    i0, i1 = max(0, int((t - win) * 100)), int((t + win) * 100)
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


KEEP_LOCKED_END = {"CTA"}
HOOK_EXTRA_FRAMES = 2  # user asked for ~50 ms more lead-in before the first word (2 frames = 66 ms)  # the user set this end by hand (before the hand moves)


def tighten(shots):
    """Drop the silence at the head of every shot (and the dead air at its tail): each edge moves
    into the real pause, keeping 70 ms before the first word and 50 ms after the last one."""
    res = []
    for name, a, b, s0, s1, push, note in shots:
        if a == 0:
            # first real speech: level above -32 dB for 30 ms (room noise sits at -40..-46 here)
            k = next(i for i in range(len(ENV) - 3) if min(ENV[i : i + 3]) > -32)
            a = max(0.0, round(k / 100 - 0.07 - HOOK_EXTRA_FRAMES / FPS, 4))
        else:
            g = pause_near(a)
            if g:
                a = round(g[1] - 0.07, 2)
        if name not in KEEP_LOCKED_END:
            g = pause_near(b)
            if g:
                b = round(g[0] + 0.05, 2)
        if push:
            push = (max(push[0], a), min(push[1], b))
        res.append((name, a, b, s0, s1, push, note))
    return res


def layout(shots):
    """Output frame ranges; the pause shot plays a single source frame."""
    t, res = 0, []
    for name, a, b, s0, s1, push, note in shots:
        if name == "Pause":
            dur, trim = 10, f(a) - 1
        else:
            dur, trim = f(b) - f(a), f(a)
        res.append(dict(name=name, a=a, b=b, s0=s0, s1=s1, push=push, note=note, start=t, dur=dur, trim=trim))
        t += dur
    return res, t


def to_out(lay, src):
    for s in lay:
        if s["name"] != "Pause" and s["a"] - 1e-6 <= src < s["b"] + 1e-6:
            return s["start"] + f(src) - s["trim"]
    for s in lay:  # word edges that spill a few frames past a cut
        if s["name"] != "Pause" and s["b"] < src <= s["b"] + 0.4:
            return s["start"] + s["dur"]
    for s in lay:  # inside a removed pause: snap to the next shot's first frame
        if s["name"] != "Pause" and s["a"] - 0.9 <= src < s["a"]:
            return s["start"]
    raise ValueError(f"source time {src} is not in the edit")


def captions_for(s):
    if s["name"] in ("Pause", "Slogan"):
        return []
    return [w for w in WORDS if s["a"] - 0.05 <= w["s"] < s["b"] - 0.05]


def ts_caption(w):
    ms = lambda x: int(round(x * 1000))
    return (
        f'{{text: {json.dumps(w["text"], ensure_ascii=False)}, startMs: {ms(w["s"])}, '
        f'endMs: {ms(w["e"])}, timestampMs: {ms((w["s"] + w["e"]) / 2)}, confidence: null}}'
    )


HIGHLIGHTS = [
    "عندك فكرة مشروع",
    "الحل بمكان واحد",
    "من الفكرة إلى التنفيذ",
    "ذكاء اصطناعي",
    "كل احتياجات مشروعك التقنية",
    "فكرتك، تنفيذنا",
    "راسلنا هسه بكلمة «فكرة»",
]


# Only these shots show the speaker; every other shot is covered by motion graphics and keeps just the voice.
FACE_SHOTS = {"Hook", "CTA"}


def shot_jsx(s):
    i = "        "
    if s["push"]:
        p0, p1 = s["start"] + f(s["push"][0]) - s["trim"], s["start"] + f(s["push"][1]) - s["trim"]
        scale = (
            f"interpolate(frame, [{p0}, {p1}], [{s['s0']}, {s['s1']}], "
            "{easing: Easing.inOut(Easing.quad), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})"
        )
    else:
        scale = f"{s['s0']}"
    rate = "\n" + i + "  playbackRate={0.1}" if s["name"] == "Pause" else ""
    video = f"""{i}  {{background === 'original' ? (
{i}    <Video
{i}      name="{s['name']} footage"
{i}      src={{staticFile('footage/master_sdr_1440.mp4')}}
{i}      muted
{i}      objectFit="cover"
{i}      style={{{{
{i}        width: '100%',
{i}        height: '100%',
{i}        transformOrigin: '50% 38%',
{i}        scale: {scale},
{i}        filter: 'contrast(1.04) saturate(1.04) brightness(1.01)',
{i}      }}}}
{i}    />
{i}  ) : (
{i}    <OffthreadVideo
{i}      name="{s['name']} cut-out"
{i}      src={{staticFile('footage/person_alpha.webm')}}
{i}      transparent
{i}      muted
{i}      style={{{{
{i}        width: '100%',
{i}        height: '100%',
{i}        objectFit: 'cover',
{i}        translate: '{DX}px 0px',
{i}        transformOrigin: '50% 38%',
{i}        scale: {scale},
{i}        filter: 'brightness(0.93) contrast(1.06) saturate(1.04) sepia(0.07)',
{i}      }}}}
{i}    />
{i}  )}}
""" if s["name"] in FACE_SHOTS else ""
    voice = (
        ""
        if s["name"] == "Pause"
        else f"""
{i}  <Audio name="{s['name']} voice" src={{staticFile('footage/voice_clean.wav')}} />"""
    )
    return f"""{i}<TransitionSeries.Sequence
{i}  name="{s['name']}"
{i}  trimBefore={{{s['trim']}}}
{i}  durationInFrames={{{s['dur']}}}{rate}
{i}>
{video}{i}{voice}
{i}</TransitionSeries.Sequence>"""


def captions_jsx(s):
    caps = captions_for(s)
    if not caps:
        return ""
    i = "        "
    rows = (",\n" + i + "    ").join(ts_caption(w) for w in caps)
    hl = ", ".join(json.dumps(h, ensure_ascii=False) for h in HIGHLIGHTS)
    return f"""{i}<KineticCaptions
{i}  name="{s['name']} captions"
{i}  from={{{s['start']}}}
{i}  durationInFrames={{{s['dur']}}}
{i}  trimBefore={{{s['trim']}}}
{i}  width={{860}}
{i}  maxWords={{4}}
{i}  highlights={{[{hl}]}}
{i}  style={{{{position: 'absolute', top: 1320, translate: '110px 0px'}}}}
{i}  captions={{[
{i}    {rows},
{i}  ]}}
{i}/>"""


def item(tag, name, start, dur, props=""):
    i = "        "
    extra = "".join(f"\n{i}  {p}" for p in props.split("\n") if p) if props else ""
    return f"""{i}<{tag}
{i}  name="{name}"
{i}  from={{{start}}}
{i}  durationInFrames={{{dur}}}{extra}
{i}/>"""


def build(component, shots, graphics, broll, brand, sfx, out_name):
    lay, total = layout(shots)
    o = lambda src: to_out(lay, src)
    shots_jsx = "\n".join(shot_jsx(s) for s in lay)
    caps_jsx = "\n".join(c for c in (captions_jsx(s) for s in lay) if c)
    g = lambda specs: "\n".join(
        item(t, n, o(a), o(b) - o(a), p(o(a), o) if callable(p) else p) for t, n, a, b, p in specs
    )
    end_start = total
    duration = total + END_FRAMES
    sfx_tracks = {}
    for track, name, src_or_frame, file, vol in sfx:
        if src_or_frame == "END":
            start = end_start
        else:
            try:
                start = o(src_or_frame)
            except ValueError:  # lead-in sound placed just before a cut
                start = o(round(src_or_frame + 0.1, 2)) - 3
        sfx_tracks.setdefault(track, []).append((name, max(0, start), file, vol))
    sfx_jsx = ""
    for track, items in sfx_tracks.items():
        rows = "\n".join(
            f"""        <Audio name="{n}" src={{staticFile('sfx/{file}')}} from={{{st}}} volume={{{vol}}} />"""
            for n, st, file, vol in items
        )
        sfx_jsx += f"""
      <Track name="{track}">
{rows}
      </Track>"""
    used = {t for t, *_ in graphics + broll + brand} | {"EndScreen", "GraphicsBackdrop"}
    imp = lambda names: ", ".join(n for n in names if n in used)
    tsx = f"""// Generated first cut ({out_name}). Safe to edit here or in Remotion Studio.
import {{Audio, Video}} from '@remotion/media';
import {{TransitionSeries}} from '@remotion/transitions';
import {{AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, Track, useCurrentFrame}} from 'remotion';
import {{StudioBackground}} from './components/StudioBackground';
import {{KineticCaptions}} from './components/KineticCaptions';
import {{{imp(['AllInOne', 'AudienceSplit', 'Chip', 'CtaChip', 'GoalCompare', 'HookTitle', 'IdeaToLaunch', 'LogoReveal', 'OnePlace', 'ProcessSteps', 'Watermark'])}}} from './components/Overlays';
import {{{imp(['AiBroll', 'AppsBroll', 'AutomationBroll', 'CustomBroll', 'GraphicsBackdrop', 'IdentityBroll', 'ProblemBroll', 'StoresBroll', 'SystemsBroll', 'WebsitesBroll'])}}} from './components/Broll';
import {{EndScreen, SloganReveal}} from './components/Brand';

export const {component}: React.FC<{{showCaptions: boolean; background: 'studio' | 'original'}}> = ({{showCaptions, background}}) => {{
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{{{backgroundColor: '#08131F'}}}}>
      {{background === 'studio' ? (
        <StudioBackground
          name="Studio background"
          durationInFrames={{{duration}}}
          base="#0E1F33"
          glow="#2E4A6B"
          lines="rgba(201, 211, 222, 0.22)"
          image="backgrounds/office.png"
          imageBlur={{3}}
        />
      ) : null}}
      <TransitionSeries name="A-roll">
{shots_jsx}
      </TransitionSeries>
      <AbsoluteFill
        style={{{{
          background: 'radial-gradient(120% 75% at 50% 42%, transparent 55%, rgba(4, 12, 22, 0.42) 100%)',
          pointerEvents: 'none',
        }}}}
      />
      <Track name="Backdrop">
        <GraphicsBackdrop name="Graphics backdrop" from={{{o(5.81)}}} durationInFrames={{{o(76.90) - o(5.81)}}} fadeIn={{true}} fadeOut={{true}} />
      </Track>
      <Track name="Voice tail">
        <Audio name="Last word tail" src={{staticFile('footage/voice_clean.wav')}} from={{{end_start}}} trimBefore={{{lay[-1]['trim'] + lay[-1]['dur']}}} durationInFrames={{4}} />
      </Track>
      <Track name="B-roll">
{g(broll)}
        <EndScreen
          name="End screen"
          from={{{end_start}}}
          durationInFrames={{{END_FRAMES}}}
          slogan="فكرتك، تنفيذنا"
          cta="راسلنا بكلمة «فكرة»"
          website="tech.monafithoon.com"
        />
      </Track>
      <Track name="Graphics">
{g(graphics)}
      </Track>
      <Track name="Brand">
{g(brand)}
      </Track>
      {{showCaptions ? (
        <Track name="Captions">
{caps_jsx}
        </Track>
      ) : null}}{sfx_jsx}
      <Track name="Music">
        <Audio name="Music bed" src={{staticFile('music/{out_name}_music.wav')}} volume={{0.45}} />
      </Track>
    </AbsoluteFill>
  );
}};
"""
    path = os.path.join(REEL, "src", f"{component}.tsx")
    open(path, "w").write(tsx)
    return lay, total, duration, o


# ------------------------------------------------------------ props with frame cues


# per-overlay scale and the content's vertical centre in its headroom layout (local px)
CENTRE = {
    "title": (1.4, 345),
    "oneplace": (1.15, 450),
    "logo": (1.25, 400),
    "idea": (1.0, 415),
    "goal": (1.12, 375),
    "allinone": (1.2, 450),
    "process": (1.0, 390),
    "audience": (1.08, 365),
}


def centre(kind, target=780):
    """Move a headroom overlay into the middle of a full-screen graphics shot and size it up.
    CSS applies translate then scale about the frame centre (540, 960)."""
    sc, c = CENTRE[kind]
    ty = int(round(target - 960 - sc * (c - 960)))
    return "\nstyle={{translate: '0px %dpx', scale: %s}}" % (ty, sc)


def cue(fmt, *srcs):
    """Props whose frame values are relative to the item's own start."""
    return lambda start, o: fmt.format(*[o(x) - start for x in srcs])


PROBLEM = cue('a="مبرمج"\nb="مصمّم"\nc="شركات متفرقة"\ncost="كوست أضعاف الطبيعي"\n' "atA={{{}}}\natB={{{}}}\natC={{{}}}\natCost={{{}}}", 5.81, 6.44, 7.05, 8.50)
ONE_PLACE = cue('a="مبرمج"\nb="مصمّم"\nc="شركات"\nresult="الحل بمكان واحد"\nmergeAt={{{}}}', 14.70)
IDEA = cue('s1="فكرة"\ns2="تصميم"\ns3="تطوير"\ns4="إطلاق"\nactivateAt={{[{}, {}, {}, {}]}}', 22.54, 22.84, 23.14, 23.50)
ALL_IN_ONE = cue('label=""\nmergeAt={{{}}}', 45.90)
PROCESS = cue(
    's1="نفهم"\ns2="نخطّط"\ns3="نصمّم"\ns4="نبرمج"\ns5="نطلق"\ns6="نطوّر"\nactivateAt={{[{}, {}, {}, {}, {}, {}]}}',
    51.97, 53.56, 54.09, 54.68, 56.96, 57.60,
)
SLOGAN = cue('first="فكرتك،"\nsecond="تنفيذنا"\nsloganAt={{{}}}', 75.06)
PARTNER = lambda start, o: cue('before="مو بس ننفّذ طلبك"\nafter="نشتغل وياك للحل الأنسب"\nafterAt={{{}}}', 26.08)(start, o) + centre("goal")
ONE_PLACE_C = lambda start, o: ONE_PLACE(start, o) + centre("oneplace")
IDEA_C = lambda start, o: IDEA(start, o) + centre("idea")
ALL_IN_ONE_C = lambda start, o: ALL_IN_ONE(start, o) + centre("allinone")
PROCESS_C = lambda start, o: PROCESS(start, o) + centre("process")
GOAL = lambda start, o: cue('before="مو بس نسلّمك مشروع"\nafter="حل يخدم شغلك ويتطوّر"\nafterAt={{{}}}', 61.30)(start, o) + centre("goal")
AUDIENCE = lambda start, o: cue('a="شركة تريد تطوّرها"\nb="فكرة ببدايتها"\natA={{{}}}\natB={{{}}}', 66.12, 67.77)(start, o) + centre("audience")
CTA = cue('lead="راسلنا بكلمة"\nkeyword="«فكرة»"\nsendAt={{{}}}', 78.44)

SERVICES = [
    ("WebsitesBroll", "Websites", 30.50, 32.03, 'title="مواقع إلكترونية"\nfront="projects/venda-desktop.webp"\nback="projects/mandi-menu-desktop.webp"\nfadeIn={true}\nfadeOut={false}'),
    ("AppsBroll", "Mobile apps", 32.03, 33.29, 'title="تطبيقات موبايل"\nleft="projects/venda-mobile.webp"\ncenter="projects/mandi-menu-mobile.webp"\nright="projects/alsaad-mobile.webp"\nfadeIn={false}\nfadeOut={false}'),
    ("StoresBroll", "E-commerce", 33.29, 34.82, 'title="متاجر إلكترونية"\ndesktop="projects/alsaad-desktop.webp"\nmobile="projects/mrayco-mobile.webp"\nfadeIn={false}\nfadeOut={false}'),
    ("SystemsBroll", "Management systems", 34.82, 36.14, 'title="أنظمة متكاملة"\na="projects/inventory.svg"\nb="projects/pos.svg"\nc="projects/hr-payroll-light.svg"\nfadeIn={false}\nfadeOut={false}'),
    ("AiBroll", "AI", 36.14, 37.38, 'title="ذكاء اصطناعي"\nscreen="projects/hr-ai.svg"\nfadeIn={false}\nfadeOut={false}'),
]
AUTOMATION = 'title="أتمتة"\nscreen="projects/whatsapp-bot.svg"\nn1="رسالة"\nn2="رد آلي"\nn3="تم"'
AUTOMATION_MID = AUTOMATION + "\nfadeIn={false}\nfadeOut={false}"
AUTOMATION_END = AUTOMATION + "\nfadeIn={false}\nfadeOut={true}"
CUSTOM = 'title="حلول برمجية خاصة"\na="projects/clinic.svg"\nb="projects/schools.svg"\nc="projects/menu.svg"\nd="projects/clinic-booking-light.svg"\nfadeIn={false}\nfadeOut={false}'

# track, name, source time (float) or "END", file, volume
SFX_MAIN = [
    ("SFX accents", "Hook accent", 0.0, "hook.wav", 0.55),
    ("SFX transitions", "Whoosh problem", 5.70, "whoosh.wav", 0.35),
    ("SFX accents", "Merge tick", 15.10, "tick.wav", 0.4),
    ("SFX accents", "Logo shimmer", 19.80, "shimmer.wav", 0.5),
    ("SFX transitions", "Whoosh websites", 30.40, "whoosh.wav", 0.32),
    ("SFX transitions", "Whoosh apps", 31.95, "swish.wav", 0.28),
    ("SFX transitions", "Whoosh stores", 33.21, "whoosh.wav", 0.28),
    ("SFX transitions", "Whoosh systems", 34.74, "swish.wav", 0.28),
    ("SFX transitions", "Whoosh AI", 36.06, "whoosh.wav", 0.28),
    ("SFX transitions", "Whoosh automation", 37.30, "swish.wav", 0.26),
    ("SFX transitions", "Swish custom", 38.48, "swish.wav", 0.24),
    ("SFX transitions", "Swish identity", 40.80, "swish.wav", 0.26),
    ("SFX accents", "All-in-one tick", 46.10, "tick.wav", 0.4),
    ("SFX accents", "Slogan riser", 74.05, "impact.wav", 0.55),
    ("SFX accents", "CTA send", 78.44, "pop.wav", 0.45),
    ("SFX transitions", "End chime", "END", "shimmer.wav", 0.45),
]

lay, total, duration, o = build(
    "MainReel",
    tighten(SHOTS_MAIN),
    graphics=[
        ("HookTitle", "Hook title", 0.20, 3.10, 'line="عندك فكرة مشروع؟"\naccent="فكرة مشروع؟"'),
        ("OnePlace", "One place", 10.52, 16.10, ONE_PLACE_C),
        ("HookTitle", "Any idea", 16.14, 19.75, 'line="مهما كانت فكرتك"\naccent="فكرتك"' + centre("title")),
        ("LogoReveal", "First logo reveal", 19.80, 22.25, 'logo="brand/horizontal.png"\nlogoWidth={680}' + centre("logo")),
        ("IdeaToLaunch", "Idea to launch", 22.30, 24.28, IDEA_C),
        ("GoalCompare", "We work with you", 24.30, 30.45, PARTNER),
        ("AllInOne", "All in one place", 44.62, 48.36, ALL_IN_ONE_C),
        ("HookTitle", "What sets us apart", 48.42, 50.40, 'line="شنو اللي يميّزنا؟"\naccent="يميّزنا؟"' + centre("title")),
        ("ProcessSteps", "Our process", 50.43, 58.36, PROCESS_C),
        ("GoalCompare", "Our goal", 58.40, 65.28, GOAL),
        ("AudienceSplit", "Who it is for", 65.32, 70.10, AUDIENCE),
        ("CtaChip", "CTA message", 76.90, 81.41, CTA),
    ],
    broll=[("ProblemBroll", "Problem B-roll", 5.81, 10.50, PROBLEM)]
    + SERVICES
    + [
        ("AutomationBroll", "Automation", 37.38, 38.56, AUTOMATION_MID),
        ("CustomBroll", "Custom software", 38.56, 40.88, CUSTOM),
        ("IdentityBroll", "Brand identity", 40.88, 44.62, 'title="تصاميم وهويات بصرية"\nlogo="brand/lockup.png"\nfadeIn={false}\nfadeOut={true}'),
        ("SloganReveal", "Slogan reveal", 73.95, 76.88, SLOGAN),
    ],
    brand=[("Watermark", "Logo watermark", 30.50, 48.40, None)],
    sfx=SFX_MAIN,
    out_name="main",
)

slay, stotal, sduration, so = build(
    "ShortReel",
    tighten(SHOTS_SHORT),
    graphics=[
        ("HookTitle", "Hook title", 0.20, 3.10, 'line="عندك فكرة مشروع؟"\naccent="فكرة مشروع؟"'),
        ("OnePlace", "One place", 10.52, 16.10, ONE_PLACE_C),
        ("HookTitle", "Any idea", 16.14, 19.75, 'line="مهما كانت فكرتك"\naccent="فكرتك"' + centre("title")),
        ("LogoReveal", "First logo reveal", 19.80, 22.25, 'logo="brand/horizontal.png"\nlogoWidth={680}' + centre("logo")),
        ("IdeaToLaunch", "Idea to launch", 22.30, 24.28, IDEA_C),
        ("CtaChip", "CTA message", 76.90, 81.41, CTA),
    ],
    broll=SERVICES
    + [
        ("AutomationBroll", "Automation", 37.38, 38.02, AUTOMATION_END),
        ("SloganReveal", "Slogan reveal", 73.95, 76.88, SLOGAN),
    ],
    brand=[("Watermark", "Logo watermark", 30.50, 38.02, None)],
    sfx=[s for s in SFX_MAIN if s[2] == "END" or not (5.0 < s[2] < 10.6 or 38.1 < s[2] < 74.0)],
    out_name="short",
)

# ------------------------------------------------------------ timeline.json, EDL, SRT


def srt_time(fr):
    ms = int(round(fr / FPS * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def write_srt(lay, o, path):
    words = [w for s in lay if s["name"] != "Pause" for w in WORDS if s["a"] - 0.05 <= w["s"] < s["b"] - 0.05]
    lines, cur = [], []
    for w in words:
        cur.append(w)
        if len(cur) >= 5 or w["text"][-1] in "،.؟…" :
            lines.append(cur)
            cur = []
    if cur:
        lines.append(cur)
    with open(path, "w") as fh:
        for k, ln in enumerate(lines, 1):
            a, b = o(ln[0]["s"]), max(o(ln[-1]["s"]) + 6, o(min(ln[-1]["e"], ln[-1]["s"] + 1.2)))
            fh.write(f"{k}\n{srt_time(a)} --> {srt_time(b)}\n{' '.join(w['text'] for w in ln)}\n\n")


write_srt(lay, o, os.path.join(OUT, "almonafithoon_captions_ar.srt"))
write_srt(slay, so, os.path.join(OUT, "almonafithoon_short_captions_ar.srt"))

with open(os.path.join(OUT, "edit_decisions.csv"), "w", newline="") as fh:
    wr = csv.writer(fh)
    wr.writerow(["#", "shot", "source_in", "source_out", "final_in", "final_out", "duration_s", "framing_scale", "note"])
    for k, s in enumerate(lay, 1):
        tc = lambda fr: f"{fr / FPS:.2f}"
        src_out = s["a"] if s["name"] == "Pause" else s["b"]
        wr.writerow([k, s["name"], f'{s["a"]:.2f}', f"{src_out:.2f}", tc(s["start"]), tc(s["start"] + s["dur"]), tc(s["dur"]),
                     f'{s["s0"]}→{s["s1"]}' if s["s0"] != s["s1"] else s["s0"], s["note"]])
    wr.writerow([])
    wr.writerow(["removed", "Abandoned retake «المنفذون تك تقدر…»", "70.15", "73.95", "", "", "3.80", "", "Speaker restarted the slogan line"])
    wr.writerow(["removed", "Tail after last word", "81.43", "82.60", "", "", "1.17", "", "Picture cut at 81.43 (hands move from 81.5 s); voice runs 4 frames under the end screen so «بمشروعك» is not clipped"])

json.dump(
    {
        "fps": FPS,
        "main": {"duration": duration, "speech_frames": total, "shots": lay},
        "short": {"duration": sduration, "speech_frames": stotal, "shots": slay},
    },
    open(os.path.join(ROOT, "timeline.json"), "w"),
    ensure_ascii=False,
    indent=1,
)
import re as _re

_root = os.path.join(REEL, "src", "Root.tsx")
_src = open(_root).read()
for _id, _dur in (("MainReel", duration), ("CleanReel", duration), ("ShortReel", sduration)):
    _src = _re.sub(r'(id="%s"[\s\S]*?durationInFrames=\{)\d+(\})' % _id, r"\g<1>%d\2" % _dur, _src, count=1)
open(_root, "w").write(_src)
print("main", duration, "frames =", duration / FPS, "s | short", sduration, "=", sduration / FPS, "s")
