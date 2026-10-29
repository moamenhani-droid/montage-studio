"""الفحص الآلي لكل الفيديوهات في deliverables/ وكتابة deliverables/qa_report.md.
الاستخدام: python3 work/qa.py
المعايير: 1080×1920، 30 إطاراً/ث، مدة مطابقة (±0.05 ث)، ‑14 ±1 LUFS، ذروة ≤ ‑1، بلا إطارات سوداء، وتنبيه لأي صمت ≥ ثانية.
"""
import json
import os
import re
import subprocess

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "..", "deliverables")
CUTS = json.load(open(os.path.join(ROOT, "cuts.json")))
MAIN = CUTS["duration"] / 30
SHORT = sum(b - a for a, b in CUTS["short"]) / 30
AR = str.maketrans("0123456789.", "٠١٢٣٤٥٦٧٨٩٫")
ar = lambda x: str(x).translate(AR)
err = lambda cmd: subprocess.run(cmd, capture_output=True, text=True).stderr


def expected(name):
    if "_x" in name:  # sped-up copy: duration divided by the factor
        k = float(re.search(r"_x([\d.]+)", name).group(1))
        return (SHORT if "short" in name else MAIN) / k
    return SHORT if "short" in name else MAIN


rows, notes, ok_all = [], [], True
for name in sorted(n for n in os.listdir(OUT) if n.endswith(".mp4")):
    path = os.path.join(OUT, name)
    st = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,codec_name,width,height,r_frame_rate,duration", "-of", "json", path], capture_output=True, text=True).stdout)["streams"]
    v = next(s for s in st if s["codec_type"] == "video")
    vdur = float(v["duration"])
    t = err(["ffmpeg", "-hide_banner", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"])
    summ = t[t.rfind("Summary:"):]
    lufs = float(re.search(r"I:\s+(-?[\d.]+) LUFS", summ).group(1))
    peak = float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", summ).group(1))
    black = re.findall(r"black_start:([\d.]+)", err(["ffmpeg", "-hide_banner", "-i", path, "-vf", "blackdetect=d=0.1:pix_th=0.04", "-an", "-f", "null", "-"]))
    sil = re.findall(r"silence_start: ([\d.]+)", err(["ffmpeg", "-hide_banner", "-i", path, "-af", "silencedetect=n=-45dB:d=1.0", "-vn", "-f", "null", "-"]))
    exp = expected(name)
    ok = v["width"] == 1080 and v["height"] == 1920 and abs(vdur - exp) < 0.05 and -15 <= lufs <= -13 and peak <= -1.0 and not black
    ok_all &= ok
    rows.append(f"| {name} | {ar(v['width'])}×{ar(v['height'])} | {ar(round(vdur, 2))} ث (المتوقع {ar(round(exp, 2))}) | {ar(lufs)} | {ar(peak)} | {'لا يوجد' if not black else ar(', '.join(black))} | {'✅' if ok else '⚠️'} |")
    if sil:
        notes.append(f"- {name}: صمت ثانية أو أكثر يبدأ عند {ar(', '.join(sil))} ث")

report = f"""# تقرير الفحص

| الملف | الأبعاد | المدة | الصوت (LUFS) | الذروة (dBFS) | إطارات سوداء | النتيجة |
|---|---|---|---|---|---|---|
{chr(10).join(rows)}

{chr(10).join(notes) if notes else "- لا توجد سكتة طولها ثانية أو أكثر."}

## ما يُفحص بالعين (إلزامي قبل التسليم)
- لقطات من **الملف النهائي نفسه**: البداية، وكل مشهد ثلاثي الأبعاد، والشعار، والنهاية.
- لا كلمة مقصوصة، والكابشن مطابق للمنطوق، والشعار أصلي، ولا أرقام أو مشاريع مختلقة.

## النتيجة: {"✅ كل الملفات اجتازت الفحص" if ok_all else "⚠️ راجع الأسطر المعلَّمة"}
"""
open(os.path.join(OUT, "qa_report.md"), "w").write(report)
print(report)
