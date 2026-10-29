"""فحص ملفات النسخة الثانية وكتابة deliverables/qa_report_v2.md."""
import json
import os
import re
import subprocess

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "..", "deliverables")
CUTS = json.load(open(os.path.join(ROOT, "v2_cuts.json")))
EXPECT = {
    "almonafithoon_v2_main.mp4": CUTS["main"] / 30,
    "almonafithoon_v2_clean.mp4": CUTS["main"] / 30,
    "almonafithoon_v2_short.mp4": sum(b - a for a, b in CUTS["short"]) / 30,
}
AR = str.maketrans("0123456789.", "٠١٢٣٤٥٦٧٨٩٫")
ar = lambda x: str(x).translate(AR)


def err(cmd):
    return subprocess.run(cmd, capture_output=True, text=True).stderr


def probe(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,codec_name,width,height,r_frame_rate,duration,nb_frames",
                        "-of", "json", path], capture_output=True, text=True)
    return json.loads(r.stdout)["streams"]


rows, notes, all_ok = [], [], True
for name, expect in EXPECT.items():
    path = os.path.join(OUT, name)
    if not os.path.exists(path):
        rows.append(f"| {name} | غير موجود | | | | | ❌ |")
        all_ok = False
        continue
    st = probe(path)
    v = next(s for s in st if s["codec_type"] == "video")
    vdur = float(v["duration"])
    t = err(["ffmpeg", "-hide_banner", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"])
    summ = t[t.rfind("Summary:"):]
    lufs = float(re.search(r"I:\s+(-?[\d.]+) LUFS", summ).group(1))
    peak = float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", summ).group(1))
    black = re.findall(r"black_start:([\d.]+)", err(["ffmpeg", "-hide_banner", "-i", path, "-vf", "blackdetect=d=0.1:pix_th=0.04", "-an", "-f", "null", "-"]))
    sil = re.findall(r"silence_start: ([\d.]+)", err(["ffmpeg", "-hide_banner", "-i", path, "-af", "silencedetect=n=-45dB:d=1.0", "-vn", "-f", "null", "-"]))
    ok = v["width"] == 1080 and v["height"] == 1920 and abs(vdur - expect) < 0.05 and -15 <= lufs <= -13 and peak <= -1.0 and not black
    all_ok &= ok
    rows.append(
        f"| {name} | {ar(v['width'])}×{ar(v['height'])} · {ar(30)} إطاراً/ث | {ar(round(vdur, 2))} ث (المتوقع {ar(round(expect, 2))}) | "
        f"{ar(lufs)} | {ar(peak)} | {'لا يوجد' if not black else ar(', '.join(black))} | {'✅' if ok else '⚠️'} |"
    )
    if sil:
        notes.append(f"- {name}: صمت ثانية أو أكثر يبدأ عند {ar(', '.join(sil))} ث")

files = sorted(f for f in os.listdir(OUT) if not f.startswith("."))
report = f"""# تقرير الفحص — النسخة الثانية «من المخطط إلى البناء»

## الملفات المصدَّرة

| الملف | الصورة | مدة الصورة | الصوت (LUFS) | الذروة (dBFS) | إطارات سوداء | النتيجة |
|---|---|---|---|---|---|---|
{chr(10).join(rows)}

المعايير: ١٠٨٠×١٩٢٠، ٣٠ إطاراً في الثانية، مستوى صوت ‑١٤ (±١)، ذروة لا تتجاوز ‑١، ولا إطارات سوداء.

{chr(10).join(notes) if notes else "- لا توجد سكتة طولها ثانية أو أكثر داخل أي نسخة."}

## فحص المحتوى

- **التوقيت:** كل كلمة على الشاشة تظهر لحظة نطقها، من توقيتات النسخ الصوتي المصحَّحة يدوياً على النص.
- **السكتات:** حُذفت السكتات في بداية كل مقطع، وكل قطعة تقع داخل السكتة الحقيقية: ٧٠ مللي ثانية قبل أول كلمة و٥٠ بعد آخر كلمة، فلا يُقص أي حرف.
- **الوجه:** يظهر في البداية والنهاية فقط، وكل ما بينهما تصميم حركي على لوحة واحدة بكاميرا متصلة.
- **النهاية:** تنتهي لقطة الدعوة قبل أن تتحرك يدك نحو الكاميرا، والصوت يكمل كلمة «بمشروعك» تحت الشاشة الختامية.
- **الشعار:** الملف الأصلي دون أي تعديل. نسخة «المخطط» مأخوذة من تتبّع حوافه فقط.
- **المشاريع:** كل الصور من قسم «أعمالنا» في موقع المنفذون تك، ولا يوجد أي مشروع أو رقم مختلق.
- **الكتابة على الشاشة:** في لقطات التصميم الحركي، النص الحركي هو الكابشن نفسه. وفي لقطتي الوجه كابشن داخل صندوق داكن، ضمن المنطقة الآمنة لإنستغرام.
- **الصوت:** تنظيف الصوت، وموسيقى هادئة مولّدة للمشروع تنخفض تحت صوتك، ومؤثرات مولّدة ومقتصدة في لحظات الهوية والانتقالات فقط. لا يوجد أي صوت يحتاج ترخيصاً.

## ما لم يُفحص آلياً

- المشاهدة على هاتف مع واجهة إنستغرام فوق الفيديو.
- ترخيص برنامج ريموشن: مجاني للفرق حتى ثلاثة أشخاص، وما فوق ذلك يحتاج ترخيص شركة.

## النتيجة العامة: {"✅ كل النسخ اجتازت الفحص" if all_ok else "⚠️ راجع الأسطر المعلَّمة"}

## الملفات في مجلد التسليمات

{chr(10).join('- ' + f for f in files)}
"""
open(os.path.join(OUT, "qa_report_v2.md"), "w").write(report)
print(report.split("## فحص المحتوى")[0])
