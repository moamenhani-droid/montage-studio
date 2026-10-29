import type React from "react";

/** كلمة منطوقة بإطارها المحلي داخل المشهد */
export type Word = { t: number; text: string };

/** كل أسلوب يأخذ نفس الخصائص؛ ما لا يحتاجه يتجاهله. الإطارات محلية (0 = بداية المشهد). */
export type StyleProps = {
  dur: number;
  title?: string;
  sub?: string;
  items?: string[];
  values?: number[];
  /** صورة/لقطة شاشة من public/ */
  image?: string;
  /** فيديو من public/ (footage/person_alpha.webm للشخص المقصوص، أو footage/master.mp4) */
  video?: string;
  /** إطار البداية في مصدر الفيديو */
  trim?: number;
  words?: Word[];
  /** فهارس الكلمات المفتاحية في words */
  keys?: number[];
};

export type Cat =
  | "face"
  | "type"
  | "ui"
  | "data"
  | "draw"
  | "transition"
  | "look";

export type StyleDef = {
  id: string;
  name: string;
  cat: Cat;
  /** overlay = فوق لقطة الوجه، full = يملأ الكادر */
  layer: "overlay" | "full";
  use: string;
  C: React.FC<StyleProps>;
  demo: Omit<StyleProps, "dur">;
  /** إطار اللقطة في لوحة الكتالوج (الافتراضي 70)؛ الانتقالات تُصوَّر في منتصفها */
  at?: number;
};

const MARKS = /[ً-ْٰ،.؟…«»!]/g;
export const clean = (w: string) => w.replace(MARKS, "");

/** الكلمات بتوقيتها؛ إذا لم تُعطَ، يوزَّع العنوان بالتساوي على المشهد. */
export const wordsOf = (p: StyleProps, start = 4, span?: number): Word[] => {
  if (p.words?.length) return p.words;
  const ws = (p.title ?? "").split(/\s+/).filter(Boolean);
  const total = span ?? p.dur * 0.6;
  return ws.map((text, i) => ({
    text,
    t: Math.round(start + (i * total) / Math.max(1, ws.length)),
  }));
};

/** فهرس آخر كلمة نُطقت عند الإطار f */
export const spokenIndex = (ws: Word[], f: number) => {
  let k = -1;
  ws.forEach((w, i) => {
    if (f >= w.t) k = i;
  });
  return k;
};
