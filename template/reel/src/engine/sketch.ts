// أدوات الرسم اليدوي: مسارات مهتزة قليلاً كيد بشرية، تُرسم بـ strokeDashoffset.
// للرسم المتسلسل الكامل بخطوات وقلم يتبع الخط، راجع examples/almonafithoon-ad/reel/src/v3/Sketch.tsx.
import { getLength } from "@remotion/paths";

const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export const jit = (seed: number, amt = 4) => (rnd(seed) - 0.5) * 2 * amt;

export const rect = (x: number, y: number, w: number, h: number, s = 1) =>
  `M ${x + jit(s, 3)} ${y + jit(s + 1, 3)} L ${x + w + jit(s + 2, 4)} ${y + jit(s + 3, 3)} L ${x + w + jit(s + 4, 3)} ${y + h + jit(s + 5, 4)} L ${x + jit(s + 6, 4)} ${y + h + jit(s + 7, 3)} L ${x + jit(s + 8, 3)} ${y - 6}`;

export const ellipse = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  s = 1,
  turns = 1.08,
) => {
  const n = 40;
  let d = "";
  for (let i = 0; i <= n * turns; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const k = 1 + jit(s + i, 0.025);
    d += `${i ? "L" : "M"} ${(cx + Math.cos(a) * rx * k).toFixed(1)} ${(cy + Math.sin(a) * ry * k).toFixed(1)} `;
  }
  return d;
};

export const arrow = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  bend = 0.2,
  s = 1,
) => {
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend;
  const my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const a = Math.atan2(y2 - my, x2 - mx);
  const h = 26;
  const p1 = [x2 - h * Math.cos(a - 0.45), y2 - h * Math.sin(a - 0.45)];
  const p2 = [x2 - h * Math.cos(a + 0.45), y2 - h * Math.sin(a + 0.45)];
  return `M ${x1} ${y1} Q ${mx + jit(s, 6)} ${my + jit(s + 1, 6)} ${x2} ${y2} M ${p1[0]} ${p1[1]} L ${x2} ${y2} L ${p2[0]} ${p2[1]}`;
};

export const underline = (x1: number, x2: number, y: number, s = 1) =>
  `M ${x1} ${y + jit(s, 3)} C ${x1 + (x2 - x1) * 0.3} ${y + 8 + jit(s + 1, 3)}, ${x1 + (x2 - x1) * 0.7} ${y - 6 + jit(s + 2, 3)}, ${x2} ${y + 4}`;

export const check = (x: number, y: number, sz = 60) =>
  `M ${x} ${y} L ${x + sz * 0.38} ${y + sz * 0.4} L ${x + sz} ${y - sz * 0.45}`;
export const cross = (x: number, y: number, sz = 40) =>
  `M ${x - sz} ${y - sz} L ${x + sz} ${y + sz} M ${x + sz} ${y - sz} L ${x - sz} ${y + sz}`;

/** خصائص SVG لرسم مسار بنسبة p (0..1) */
export const drawn = (d: string, p: number) => {
  const L = getLength(d);
  return { d, strokeDasharray: `${L} ${L}`, strokeDashoffset: L * (1 - p) };
};
