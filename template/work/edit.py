"""قرارات المونتاج لهذا الفيديو — الملف الوحيد الذي يتغير من مشروع لآخر.
كل التوقيتات بثواني التسجيل الأصلي (من captions_source.json أو work/contact.jpg).
بعد أي تعديل: python3 work/edit.py   (ثم python3 work/make_audio.py إذا تغيّرت المدة)
"""
from edl import build

# أجزاء التسجيل المحتفَظ بها، بالترتيب: (اسم، من، إلى). الحواف تنتقل تلقائياً إلى داخل السكتات.
SHOTS = [
    ("Hook", 0.0, 5.0),
    ("Body", 5.0, 20.0),
    ("CTA", 20.0, 25.0),
]

# المشاهد: (اسم، من، إلى، face|graphic، معرّف الأسلوب، خصائص). الأساليب: references/styles.md
#   face    = لقطة المتحدث + أسلوب فوقها (face-caption، lower-third، cta-chip…)
#   graphic = موشن كرافيك بملء الشاشة (kinetic، chat، bar-chart، sketch…)
# خصائص شائعة: title، sub، items، values، image، keys (فهارس الكلمات المفتاحية)، transition: cut|fade
SCENES = [
    ("الهوك", 0.0, 5.0, "face", "hook-question", {"keys": [1]}),
    ("الفكرة", 5.0, 12.0, "graphic", "kinetic", {}),
    ("الخطوات", 12.0, 20.0, "graphic", "process-rail", {"items": ["نسمع", "نخطّط", "ننفّذ", "نطلق"]}),
    ("الدعوة", 20.0, 25.0, "face", "face-caption", {}),
]

# وضع الوجه: master = الفيديو كما هو، cutout = الشخص المقصوص (work/matte.sh) فوق خلفية room
FACE = {"mode": "master", "scale": 1.12, "room": "backgrounds/room.jpg"}

SHORT = ["الهوك", "الفكرة", "الدعوة"]  # مشاهد النسخة القصيرة
SFX = [("whoosh", "الفكرة", -6, 0.5), ("tick", "الخطوات", 0, 0.4), ("shimmer", "الدعوة", 0, 0.35)]  # (صوت، مشهد، إزاحة بالإطارات، حجم)

build(SHOTS, SCENES, FACE, SHORT, SFX, MUSIC=True, LOCK_END={"CTA"}, TAIL_FRAMES=0)
