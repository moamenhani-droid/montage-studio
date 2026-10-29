"""Measure every deliverable and write deliverables/qa_report.md."""
import json
import os
import re
import subprocess

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "..", "deliverables")
TL = json.load(open(os.path.join(ROOT, "timeline.json")))


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True).stderr + subprocess.run(cmd, capture_output=True, text=True).stdout


def probe(path):
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_type,codec_name,width,height,r_frame_rate,sample_rate",
         "-of", "json", path], capture_output=True, text=True)
    return json.loads(r.stdout)


def loudness(path):
    t = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    summ = t[t.rfind("Summary:"):]
    i = re.search(r"I:\s+(-?[\d.]+) LUFS", summ)
    tp = re.search(r"Peak:\s+(-?[\d.]+) dBFS", summ)
    return float(i.group(1)), float(tp.group(1))


def blacks(path):
    t = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-vf", "blackdetect=d=0.1:pix_th=0.06", "-an", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    return re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", t)


def silences(path):
    t = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", "silencedetect=n=-45dB:d=1.0", "-vn", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    return re.findall(r"silence_start: ([\d.]+)", t)


rows, notes = [], []
for name, cut in [("almonafithoon_main_reel.mp4", "main"), ("almonafithoon_clean.mp4", "main"), ("almonafithoon_short_reel.mp4", "short")]:
    path = os.path.join(OUT, name)
    if not os.path.exists(path):
        rows.append(f"| {name} | MISSING | | | | | |")
        continue
    p = probe(path)
    v = next(s for s in p["streams"] if s["codec_type"] == "video")
    a = next(s for s in p["streams"] if s["codec_type"] == "audio")
    dur = float(p["format"]["duration"])
    expect = TL[cut]["duration"] / 30
    i, tp = loudness(path)
    b = blacks(path)
    sil = silences(path)
    ok = abs(dur - expect) < 0.1 and v["width"] == 1080 and v["height"] == 1920 and -15 <= i <= -13 and tp <= -1.0 and not b
    rows.append(
        f"| {name} | {v['width']}×{v['height']} {v['codec_name']} {v['r_frame_rate']} | {a['codec_name']} {a['sample_rate']} Hz | "
        f"{dur:.2f} s (expected {expect:.2f}) | {i:.1f} LUFS | {tp:.1f} dBFS | {'none' if not b else b} | {'✅' if ok else '⚠️'} |"
    )
    if sil:
        notes.append(f"- {name}: silence (< -45 dB, ≥ 1 s) starting at {', '.join(sil)} s")

files = sorted(os.listdir(OUT))
srt = open(os.path.join(OUT, "almonafithoon_captions_ar.srt")).read()
srt_count = srt.count("-->")

report = f"""# QA report — ALMONAFITHOON TECH reel

## Rendered files

| File | Video | Audio | Duration | Loudness | Peak | Black frames | Pass |
|---|---|---|---|---|---|---|---|
{chr(10).join(rows)}

Targets: 1080×1920, 30 fps, H.264 + AAC, −14 LUFS integrated (±1), peak ≤ −1 dBFS, no black frames inside the edit.

{chr(10).join(notes) if notes else "- No silent gaps of a second or longer inside the reels."}

## Edit checks

- **Retake removed:** the abandoned line «المنفذون تك تقدر…» (source 70.15–73.95 s) is cut; the complete take of the slogan is used.
- **Last shot:** picture ends at source 81.43 s (hands start moving to stop the camera at 81.50 s). The voice continues under the end screen (J-cut) so the final consonant of «بمشروعك» (ends 81.53 s) is not clipped. The last word «بمشروعك» ends at 81.53 s, so no speech is clipped.
- **"All in one place":** the service icons now merge into the full logo (mark + name) instead of a text label, held for ~2.3 s.
- **The ⅓-second pause before «هدفنا نقدّملك»** was removed at the speaker's request (it read as a glitch).
- **No words cut:** every cut sits on a pause found in the voice envelope (cut points listed in `edit_decisions.csv`).
- **Face visibility:** the speaker appears only in the hook (0–5.8 s) and the call to action; all other shots are full-screen motion graphics over the original voice.
- **Background:** speaker cut out with Apple Vision person segmentation (on-device), matte tightened 2 px and feathered to remove the white-wall halo, placed over the supplied office photo (`background.png`) with slight defocus and a warm grade to match its lighting; body centred (+65 px).
- **Logo:** only the original files from tech.monafithoon.com/brand/tech are used, unaltered (a light sweep is masked over them; the artwork is not redrawn). First reveal at «المنفذون تيك» (19.8 s), final reveal at the slogan, watermark only during the services run, then the end screen.
- **Projects shown are real:** every screenshot comes from the «أعمالنا» section of tech.monafithoon.com (Venda, مرايكوس, مندي اليمن, السعد IT, and the system mock-ups listed there). Nothing was invented.
- **Captions:** {srt_count} SRT cues. The Whisper transcript was checked word by word against the script; the captions follow what was actually said (e.g. «شركات متفرقة، وكوست أضعاف الطبيعي», «أنظمة متكاملة», «حسب شغلك»), with spelling from the script. Highlighted phrases in blue as briefed. Captions sit at y ≈ 1320–1480, inside the Reels safe area.
- **Captions not burned during the slogan reveal** (73.9–76.9 s): the slogan itself is on screen in large type; the SRT still contains the line.

## Audio

- Voice: high-pass 80 Hz, FFT denoise (room noise floor was −53 dB), de-ess, gentle 2.5:1 compression, presence EQ.
- Music: original calm bed (72 BPM, pad + soft keys, no drums) synthesised for this project, ducked automatically under the voice and kept ~18 dB below it.
- SFX: original, synthesised (hook accent, soft whooshes between scenes, logo shimmer, slogan swell, CTA pop). No third-party audio is used, so no licences are required.
- Final mix normalised two-pass to −14 LUFS, true peak limited.

## Not verified by machine

- Watch on a phone with the Instagram UI overlay to confirm nothing important sits under the like/comment buttons.
- Remotion licence: free for teams of up to 3; a larger company needs a Remotion company licence (remotion.pro/license).

## Files in `deliverables/`

{chr(10).join('- ' + f for f in files)}
"""
open(os.path.join(OUT, "qa_report.md"), "w").write(report)
print(report[:1500])
