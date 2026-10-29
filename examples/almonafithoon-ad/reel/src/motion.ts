import {Easing, interpolate, spring} from 'remotion';

// Motion rules (Jakub-weighted for a premium ad):
// enters materialise with opacity + small rise + blur, critically damped (no bounce);
// exits are shorter and smaller than enters.

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const enterProgress = (frame: number, fps: number, delay = 0, frames = 14) =>
  spring({frame: frame - delay, fps, config: {damping: 200}, durationInFrames: frames});

export const exitProgress = (frame: number, end: number, frames = 8) =>
  interpolate(frame, [end - frames, end], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});

/** Style for an element that enters at `delay` and leaves at `end` (local frames). */
export const reveal = (
  frame: number,
  fps: number,
  {delay = 0, end = Infinity, rise = 26, blur = 10, frames = 14}: {
    delay?: number;
    end?: number;
    rise?: number;
    blur?: number;
    frames?: number;
  } = {},
): React.CSSProperties => {
  const p = enterProgress(frame, fps, delay, frames);
  const x = Number.isFinite(end) ? exitProgress(frame, end) : 0;
  return {
    opacity: p * (1 - x),
    translate: `0px ${(1 - p) * rise - x * rise * 0.3}px`,
    filter: `blur(${Math.max((1 - p) * blur, x * blur * 0.5)}px)`,
  };
};

export const lerp = (frame: number, input: number[], output: number[], easing = Easing.bezier(0.22, 1, 0.36, 1)) =>
  interpolate(frame, input, output, {...clamp, easing});
