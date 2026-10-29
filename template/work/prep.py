"""المرحلة ١: تحليل الفيديو الأصلي وتجهيزه. الاستخدام: python3 work/prep.py <الفيديو>

يكتب (دون لمس الأصل):
  work/master_sdr_1440.mp4      نسخة رئيسية SDR بدقة 1440×2560 (تسمح بالتكبير حتى ×1.3)
  work/voice_clean.wav          الصوت منظفاً (‑16 LUFS)، و voice_16k.wav للنسخ الصوتي
  work/env_db.npy               مستوى الصوت كل ١٠ مللي ثانية (لقرارات القص)
  work/contact.jpg              لوحة لقطات كل ٥ ثوانٍ لفهم الكادر
  work/probe.json               ملخص الفحص
  reel/public/footage/master.mp4 و voice_clean.wav   للمعاينة في ريموشن
"""
import json
import os
import shutil
import subprocess
import sys
import wave

import numpy as np

ROOT = os.path.dirname(os.path.abspath(__file__))
FOOT = os.path.join(ROOT, "..", "reel", "public", "footage")
os.makedirs(FOOT, exist_ok=True)
W = lambda name: os.path.join(ROOT, name)


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"فشل الأمر:\n{' '.join(cmd)}\n{r.stderr[-2000:]}")
    return r


src = os.path.abspath(sys.argv[1])
info = json.loads(run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", src]).stdout)
v = next(s for s in info["streams"] if s["codec_type"] == "video")
audios = [s for s in info["streams"] if s["codec_type"] == "audio"]
# iPhone spatial audio (APAC) cannot be decoded by ffmpeg: take the first ordinary track
audio = next((a for a in audios if a.get("codec_name") not in ("apac", None)), None)
if audio is None:
    sys.exit("لا يوجد مسار صوت قابل للقراءة في الفيديو.")
hdr = v.get("color_transfer") in ("arib-std-b67", "smpte2084")
num, den = map(int, v["r_frame_rate"].split("/"))
dur = float(info["format"]["duration"])

# ---------------------------------------------------------------- video master
vf = []
if hdr:  # HLG/PQ from iPhone looks washed out unless converted (this ffmpeg build has no zscale)
    vf.append("colorspace=all=bt709:iall=bt2020:itrc=bt2020-10:fast=0:format=yuv420p")
vf.append("scale=1440:2560:force_original_aspect_ratio=increase:flags=lanczos,crop=1440:2560")
encoders = run(["ffmpeg", "-hide_banner", "-encoders"]).stdout
enc = ["-c:v", "h264_videotoolbox", "-b:v", "40M"] if "h264_videotoolbox" in encoders else ["-c:v", "libx264", "-crf", "16", "-preset", "medium"]
run(["ffmpeg", "-v", "error", "-y", "-i", src, "-map", "0:v:0", "-vf", ",".join(vf), "-r", "30", *enc, "-pix_fmt", "yuv420p", "-an", W("master_sdr_1440.mp4")])

# ---------------------------------------------------------------- voice
chain = ("pan=mono|c0=0.5*c0+0.5*c1,highpass=f=80,afftdn=nf=-50:nr=10:tn=1,deesser=i=0.25,"
         "acompressor=threshold=-24dB:ratio=2.5:attack=8:release=140:makeup=2,"
         "equalizer=f=3200:t=q:w=1.2:g=1.5,loudnorm=I=-16:TP=-1.5:LRA=7")
if audio.get("channels", 2) == 1:
    chain = chain.replace("pan=mono|c0=0.5*c0+0.5*c1,", "")
run(["ffmpeg", "-v", "error", "-y", "-i", src, "-map", f"0:{audio['index']}", "-af", chain, "-ar", "48000", "-ac", "2", W("voice_clean.wav")])
run(["ffmpeg", "-v", "error", "-y", "-i", W("voice_clean.wav"), "-ar", "16000", "-ac", "1", W("voice_16k.wav")])

with wave.open(W("voice_16k.wav")) as w:
    x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
hop = 160  # 10 ms
n = len(x) // hop
rms = np.sqrt((x[: n * hop].reshape(n, hop) ** 2).mean(1))
env = 20 * np.log10(rms + 1e-9)
np.save(W("env_db.npy"), env)
noise = float(np.percentile(env, 10))
onset = next((i for i in range(len(env) - 3) if min(env[i : i + 3]) > -32), 0) / 100

# ---------------------------------------------------------------- contact sheet
run(["ffmpeg", "-v", "error", "-y", "-i", W("master_sdr_1440.mp4"), "-vf", "fps=1/5,scale=240:-1,tile=6x4:padding=6:color=black", "-frames:v", "1", W("contact.jpg")])

for a, b in (("master_sdr_1440.mp4", "master.mp4"), ("voice_clean.wav", "voice_clean.wav")):
    dst = os.path.join(FOOT, b)
    if os.path.exists(dst):
        os.remove(dst)
    try:
        os.link(W(a), dst)  # hard link: no extra disk space
    except OSError:
        shutil.copy(W(a), dst)

summary = {
    "source": src, "duration": round(dur, 2), "size": f"{v['width']}x{v['height']}", "fps": round(num / den, 3),
    "hdr": hdr, "transfer": v.get("color_transfer"), "audio_stream": audio["index"], "audio_codec": audio.get("codec_name"),
    "audio_tracks": [a.get("codec_name") for a in audios], "noise_floor_db": round(noise, 1), "speech_onset_s": onset,
}
json.dump(summary, open(W("probe.json"), "w"), ensure_ascii=False, indent=1)
print(f"""المدة: {summary['duration']} ث · الأبعاد: {summary['size']} · {summary['fps']} إطاراً/ث
HDR: {'نعم (' + str(summary['transfer']) + ') ← حُوِّل إلى SDR' if hdr else 'لا'}
الصوت: المسار {audio['index']} ({audio.get('codec_name')}) من {summary['audio_tracks']}
ضوضاء الغرفة بعد التنظيف ≈ {summary['noise_floor_db']} dB · بداية الكلام الحقيقية: {onset:.2f} ث
الملفات: work/master_sdr_1440.mp4، work/voice_clean.wav، work/contact.jpg""")
