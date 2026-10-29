// قواعد الحركة (مهارة design-motion-principles، بوزن «هادئ ومصقول» للإعلانات):
// الدخول: شفافية + صعود بسيط + ضبابية، بلا ارتداد. الخروج أقصر وأهدأ من الدخول.
import { Easing, interpolate, spring } from "remotion";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/** تقدّم من 0 إلى 1 بين إطارين بالمنحنى الأساسي. */
export const pr = (f: number, at: number, d = 14, easing = EASE) =>
  interpolate(f, [at, at + d], [0, 1], { ...clamp, easing });

export const lerp = (
  f: number,
  input: number[],
  output: number[],
  easing = EASE,
) => interpolate(f, input, output, { ...clamp, easing });

export const enterProgress = (
  frame: number,
  fps: number,
  delay = 0,
  frames = 14,
) =>
  spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: frames,
  });

/** نمط عنصر يدخل عند delay ويخرج عند end (إطارات محلية). */
export const reveal = (
  f: number,
  {
    delay = 0,
    end = Infinity,
    rise = 26,
    blur = 10,
    frames = 14,
  }: {
    delay?: number;
    end?: number;
    rise?: number;
    blur?: number;
    frames?: number;
  } = {},
): React.CSSProperties => {
  const p = pr(f, delay, frames);
  const x = Number.isFinite(end)
    ? interpolate(f, [end - 8, end], [0, 1], {
        ...clamp,
        easing: Easing.in(Easing.quad),
      })
    : 0;
  return {
    opacity: p * (1 - x),
    translate: `0px ${(1 - p) * rise - x * rise * 0.3}px`,
    filter: `blur(${Math.max((1 - p) * blur, x * blur * 0.5)}px)`,
  };
};

/** تتابع: العنصر i يبدأ بعد start + i*gap */
export const stagger = (f: number, i: number, start = 0, gap = 5, d = 14) =>
  pr(f, start + i * gap, d);
