// شكل data.ts (يولّده work/edl.py).
export type Data = {
  demo: boolean;
  fps: number;
  duration: number;
  speechEnd: number;
  face: {mode: 'master' | 'cutout'; master: string; person: string; room: string; scale: number; dx: number};
  voice: string;
  music: string;
  /** مقاطع التسجيل المحتفَظ بها: from = إطار الخرج، trim = إطار المصدر، dur = الطول */
  clips: {from: number; trim: number; dur: number}[];
  scenes: {
    name: string;
    start: number;
    end: number;
    kind: 'face' | 'graphic';
    style: string;
    transition: string;
    props: Record<string, unknown>;
    words: {t: number; text: string}[];
    trim: number;
  }[];
  sfx: {at: number; src: string; volume: number}[];
  short: [number, number][];
};
