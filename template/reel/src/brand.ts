// هوية المشروع: غيّر هذا الملف وحده لكل عميل (الألوان، الاسم، الشعار).
// الشعار يوضع كما هو في public/brand/ ولا يُعدَّل أبداً.
import { loadFont } from "@remotion/google-fonts/ReadexPro";

const font = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["arabic", "latin"],
});
export const FONT = font.fontFamily;

export const BRAND = {
  name: "اسم العلامة",
  handle: "@handle",
  url: "example.com",
  /** صورة الشعار بالأبيض للخلفيات الداكنة، مثل 'brand/logo-white.png'. فارغ = شعار نصي مؤقت. */
  logo: "",
  /** نسبة الارتفاع إلى العرض في ملف الشعار */
  logoRatio: 0.8,
} as const;

// الألوان: داكن متدرج + لون إبراز واحد يُستخدم للكلمات المفتاحية والحالات الفعالة فقط.
export const B = {
  bg900: "#050B14",
  bg800: "#0A1626",
  bg700: "#0E1F33",
  surface: "#16283C",
  steel: "#2E4A6B",
  text: "#FFFFFF",
  silver: "#C9D3DE",
  dim: "rgba(201, 211, 222, 0.48)",
  line: "rgba(201, 211, 222, 0.16)",
  lineStrong: "rgba(201, 211, 222, 0.38)",
  accent: "#3D8BFF",
  accentSoft: "#8BBCFF",
  glow: "rgba(61, 139, 255, 0.45)",
  // للأسلوب الورقي / اليدوي
  paper: "#F6F2EA",
  ink: "#1E2B3A",
  pencil: "#9AA3AE",
  red: "#D2483F",
  green: "#2FAE6B",
} as const;

// المنطقة الآمنة لريلز إنستغرام وتيك توك على 1080×1920
export const SAFE = { top: 220, bottom: 380, left: 72, right: 150 } as const;

// مستويات الخط الثابتة
export const TYPE = {
  display: 156,
  h1: 112,
  h2: 78,
  body: 64,
  caption: 44,
  label: 28,
} as const;
