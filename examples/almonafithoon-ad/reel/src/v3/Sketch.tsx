// النسخة الثالثة: الرسم اليدوي المتسلسل على الورق — محرك الرسم والمشاهد.
// كل عنصر خطوة؛ الخطوات تُرسم واحدة بعد الأخرى (ولا تبدأ قبل كلمتها)، وقلم يتبع رأس الخط.
import {getLength, getPointAtLength, scalePath, translatePath} from '@remotion/paths';
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {PATHS, type IconName} from '../components/Icon';
import {FONT} from '../theme';
import {DATA} from '../v2/animaticData';

type Scene = (typeof DATA.scenes)[number];
type Line = {words: {t: number; text: string}[]; keys: number[]};

export const INK = '#1E2B3A';
export const BLUE = '#2F6FE0';
export const PENCIL = '#9AA3AE';
export const RED = '#D2483F';
export const PAPER = '#F6F2EA';
const HL = 'rgba(61,139,255,0.22)';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const MARKS = /[ً-ّٰٟ،.؟…«»]/g;

/* ------------------------------------------------------------ hand jitter */

const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const j = (seed: number, amt = 4) => (rnd(seed) - 0.5) * 2 * amt;

export const rect = (x: number, y: number, w: number, h: number, s = 1) =>
  `M ${x + j(s, 3)} ${y + j(s + 1, 3)} L ${x + w + j(s + 2, 4)} ${y + j(s + 3, 3)} L ${x + w + j(s + 4, 3)} ${y + h + j(s + 5, 4)} L ${x + j(s + 6, 4)} ${y + h + j(s + 7, 3)} L ${x + j(s + 8, 3)} ${y - 6}`;

export const ellipse = (cx: number, cy: number, rx: number, ry: number, s = 1, turns = 1.08) => {
  const n = 40;
  let d = '';
  for (let i = 0; i <= n * turns; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const k = 1 + j(s + i, 0.025);
    d += `${i ? 'L' : 'M'} ${(cx + Math.cos(a) * rx * k).toFixed(1)} ${(cy + Math.sin(a) * ry * k).toFixed(1)} `;
  }
  return d;
};

export const arrow = (x1: number, y1: number, x2: number, y2: number, bend = 0.2, s = 1) => {
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend;
  const my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const a = Math.atan2(y2 - my, x2 - mx);
  const h = 26;
  const p1 = [x2 - h * Math.cos(a - 0.45), y2 - h * Math.sin(a - 0.45)];
  const p2 = [x2 - h * Math.cos(a + 0.45), y2 - h * Math.sin(a + 0.45)];
  return `M ${x1} ${y1} Q ${mx + j(s, 6)} ${my + j(s + 1, 6)} ${x2} ${y2} M ${p1[0]} ${p1[1]} L ${x2} ${y2} L ${p2[0]} ${p2[1]}`;
};

export const underline = (x1: number, x2: number, y: number, s = 1) =>
  `M ${x1} ${y + j(s, 3)} C ${x1 + (x2 - x1) * 0.3} ${y + 8 + j(s + 1, 3)}, ${x1 + (x2 - x1) * 0.7} ${y - 6 + j(s + 2, 3)}, ${x2} ${y + 4}`;

export const check = (x: number, y: number, sz = 60) => `M ${x} ${y} L ${x + sz * 0.38} ${y + sz * 0.4} L ${x + sz} ${y - sz * 0.45}`;
export const cross = (x: number, y: number, sz = 40) => `M ${x - sz} ${y - sz} L ${x + sz} ${y + sz} M ${x + sz} ${y - sz} L ${x - sz} ${y + sz}`;
export const hatch = (x: number, y: number, w: number, h: number, gap = 22) => {
  let d = '';
  for (let k = -h; k < w; k += gap) d += `M ${x + Math.max(0, k)} ${y + Math.max(0, -k)} L ${x + Math.min(w, k + h)} ${y + Math.min(h, w - k)} `;
  return d;
};
const bubble = (x: number, y: number, w: number, h: number, tailRight: boolean) => {
  const r = 28;
  const tx = tailRight ? x + w - 50 : x + 50;
  return `M ${x + r} ${y} L ${x + w - r} ${y} Q ${x + w} ${y} ${x + w} ${y + r} L ${x + w} ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} L ${tx + 18} ${y + h} L ${tx + (tailRight ? 24 : -24)} ${y + h + 34} L ${tx - 18} ${y + h} L ${x + r} ${y + h} Q ${x} ${y + h} ${x} ${y + h - r} L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y}`;
};

/* ------------------------------------------------------------ steps */

type Cue = string | {w: string; nth?: number} | number;
type Base = {cue?: Cue; dur?: number; gap?: number};
export type Step =
  | (Base & {k: 'path'; d: string; color?: string; w?: number; dash?: boolean})
  | (Base & {k: 'fill'; d: string; color?: string})
  | (Base & {k: 'icon'; name: IconName; x: number; y: number; size: number; color?: string})
  | (Base & {k: 'text'; text: string; x: number; y: number; size: number; color?: string; weight?: number; width?: number; dashed?: boolean})
  | (Base & {k: 'img'; src: string; x: number; y: number; w: number; h: number; rot?: number})
  | (Base & {k: 'logo'; x: number; y: number; w: number; kind?: 'lockup' | 'mark'})
  | (Base & {k: 'bubble'; x: number; y: number; w: number; h: number; text: string; me?: boolean; size?: number})
  | (Base & {k: 'bar'; x: number; base: number; w: number; h: number; color?: string; label?: string})
  | (Base & {k: 'pip'; x: number; y: number; r: number; until: number})
  | (Base & {k: 'custom'; render: (f: number, p: number) => React.ReactNode});

const wordAt = (s: Scene, w: string, nth = 0) => {
  const all = (s.lines as unknown as Line[]).flatMap((l) => l.words);
  const hits = all.filter((x) => x.text.replace(MARKS, '').startsWith(w.replace(MARKS, '')));
  return (hits[nth] ?? hits[0])?.t ?? s.start;
};

const defaultDur = (st: Step) => {
  switch (st.k) {
    case 'path':
      return Math.round(Math.min(26, Math.max(8, getLength(st.d) / 55)));
    case 'fill':
      return 10;
    case 'icon':
      return Math.round(Math.max(10, st.size / 9));
    case 'text':
      return Math.max(8, st.text.length * 1.1);
    case 'bubble':
      return 18;
    case 'bar':
      return 14;
    case 'logo':
      return 34;
    case 'img':
      return 12;
    default:
      return 10;
  }
};

type Timed = Step & {start: number; end: number};

/** Sequential schedule: each step waits for the previous one, and never starts before its word. */
const run = (s: Scene, steps: Step[], k: number): Timed[] => {
  let t = s.start - 6;
  return steps.map((st) => {
    const c = st.cue;
    const at = c === undefined ? -Infinity : typeof c === 'number' ? s.start + c : typeof c === 'string' ? wordAt(s, c) - 3 : wordAt(s, c.w, c.nth) - 3;
    const start = Math.max(t + (st.gap ?? 1) * k, at);
    const end = start + Math.max(3, (st.dur ?? defaultDur(st)) * k);
    t = end;
    return {...st, start, end} as Timed;
  });
};

/** Sequential schedule. If the drawing would outlast its scene, it is sped up until it finishes in time. */
const schedule = (s: Scene, steps: Step[]): Timed[] => {
  const limit = s.end - 4;
  let k = 1;
  let timed = run(s, steps, k);
  for (let i = 0; i < 12 && timed.length && timed[timed.length - 1].end > limit; i++) {
    const over = timed[timed.length - 1].end - limit;
    const span = timed[timed.length - 1].end - (s.start - 6);
    k *= Math.max(0.35, 1 - over / span - 0.02);
    timed = run(s, steps, k);
  }
  return timed;
};

const prog = (f: number, st: Timed) => interpolate(f, [st.start, st.end], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});

/* ------------------------------------------------------------ pen */

const Pen: React.FC<{x: number; y: number}> = ({x, y}) => (
  <div style={{position: 'absolute', left: x - 6, top: y - 150, width: 60, height: 160, rotate: '24deg', transformOrigin: '6px 150px', filter: 'drop-shadow(8px 14px 10px rgba(0,0,0,0.25))'}}>
    <svg width={60} height={160} viewBox="0 0 60 160">
      <path d="M 18 0 L 42 0 L 42 112 L 18 112 Z" fill="#2B3A4C" />
      <path d="M 18 0 L 42 0 L 42 26 L 18 26 Z" fill={BLUE} />
      <path d="M 18 112 L 42 112 L 34 140 L 26 140 Z" fill="#CBD3DC" />
      <path d="M 26 140 L 34 140 L 31 152 L 29 152 Z" fill={INK} />
    </svg>
  </div>
);

/* ------------------------------------------------------------ pip */

const VOICE = DATA.voice;
/** The speaker (cinematic grade) inside a hand-drawn circle, in sync with the main timeline. */
const PipFace: React.FC<{x: number; y: number; r: number; p: number; from: number; until: number}> = ({x, y, r, p, from, until}) => (
  <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', overflow: 'hidden', opacity: p, scale: String(0.85 + p * 0.15), background: '#2A2420'}}>
    {/* frame the head and shoulders: face centre ≈ (605, 960) in the source frame, ~760 px tall crop */}
    <div style={{position: 'absolute', left: r - 605 * ((2 * r) / 760), top: r - 960 * ((2 * r) / 760), width: 1080, height: 1920, scale: String((2 * r) / 760), transformOrigin: '0 0'}}>
      <Img src={staticFile('backgrounds/office_cine.png')} style={{position: 'absolute', left: -30, top: -40, width: 1140, height: 2000, objectFit: 'cover', filter: 'blur(4px)'}} />
      {VOICE.filter((v) => v.from < until && v.from + v.dur > from).map((v, i) => (
        <Sequence key={i} from={v.from} durationInFrames={v.dur} layout="none">
          <OffthreadVideo src={staticFile('footage/person_cine.webm')} transparent muted trimBefore={v.trim} style={{position: 'absolute', inset: 0, width: 1080, height: 1920, translate: '65px 0px'}} />
        </Sequence>
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------ renderer */

const iconD = (name: IconName, x: number, y: number, size: number) => translatePath(scalePath(PATHS[name], size / 24, size / 24), x, y);

export const SketchSteps: React.FC<{s: Scene; f: number; steps: Step[]}> = ({s, f, steps}) => {
  const timed = schedule(s, steps);
  const seed = Math.floor(f / 4) % 6; // line «boil»
  const fid = `rough-${s.start}`;
  let pen: {x: number; y: number} | null = null;
  const vec: React.ReactNode[] = [];
  const html: React.ReactNode[] = [];

  timed.forEach((st, i) => {
    if (f < st.start) return;
    const p = prog(f, st);
    const drawing = f >= st.start && f < st.end;
    switch (st.k) {
      case 'path':
      case 'icon': {
        const d = st.k === 'path' ? st.d : iconD(st.name, st.x, st.y, st.size);
        const L = getLength(d);
        vec.push(
          <path
            key={i}
            d={d}
            fill="none"
            stroke={st.color ?? INK}
            strokeWidth={st.k === 'icon' ? 5 : st.w ?? 6}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={st.k === 'path' && st.dash && p >= 1 ? '14 14' : `${L} ${L}`}
            strokeDashoffset={st.k === 'path' && st.dash && p >= 1 ? 0 : L * (1 - p)}
          />,
        );
        if (drawing) {
          const pt = getPointAtLength(d, L * p);
          if (pt) pen = {x: pt.x, y: pt.y};
        }
        break;
      }
      case 'fill':
        vec.push(<path key={i} d={st.d} fill={st.color ?? HL} stroke="none" opacity={p} />);
        break;
      case 'bar': {
        const h = st.h * p;
        const d = rect(st.x, st.base - h, st.w, h, i);
        vec.push(<path key={i} d={hatch(st.x + 6, st.base - h + 6, st.w - 12, Math.max(0, h - 12), 20)} stroke={st.color ?? BLUE} strokeWidth={4} opacity={0.55} fill="none" />);
        vec.push(<path key={`${i}o`} d={d} stroke={st.color ?? BLUE} strokeWidth={6} fill="none" strokeLinejoin="round" />);
        if (st.label) {
          html.push(
            <div key={`${i}l`} dir="rtl" style={{position: 'absolute', left: st.x - 60, width: st.w + 120, top: st.base + 18, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 40, color: INK, opacity: p}}>
              {st.label}
            </div>,
          );
        }
        if (drawing) pen = {x: st.x + st.w / 2, y: st.base - h};
        break;
      }
      case 'bubble': {
        const d = bubble(st.x, st.y, st.w, st.h, !!st.me);
        const L = getLength(d);
        const pb = Math.min(1, p * 1.6);
        vec.push(<path key={`${i}f`} d={d} fill={st.me ? 'rgba(47,111,224,0.12)' : 'rgba(255,255,255,0.6)'} opacity={pb} stroke="none" />);
        vec.push(<path key={i} d={d} fill="none" stroke={st.me ? BLUE : INK} strokeWidth={5} strokeLinejoin="round" strokeDasharray={`${L} ${L}`} strokeDashoffset={L * (1 - pb)} />);
        const pt = interpolate(p, [0.55, 1], [0, 1], clamp);
        html.push(
          <div key={`${i}t`} dir="rtl" style={{position: 'absolute', left: st.x + 26, top: st.y + 18, width: st.w - 52, height: st.h - 36, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontFamily: FONT, fontWeight: 600, fontSize: st.size ?? 44, lineHeight: 1.3, color: INK, clipPath: `inset(0 0 0 ${(1 - pt) * 100}%)`}}>
            {st.text}
          </div>,
        );
        if (drawing) pen = pb < 1 ? (() => {
          const q = getPointAtLength(d, L * pb);
          return q ? {x: q.x, y: q.y} : null;
        })() : {x: st.x + st.w - 26 - (st.w - 52) * pt, y: st.y + st.h / 2 + 14};
        break;
      }
      case 'text': {
        const width = st.width ?? st.text.length * st.size * 0.66 + st.size * 0.8;
        html.push(
          <div
            key={i}
            dir="rtl"
            style={{
              position: 'absolute',
              left: st.x - width / 2,
              top: st.y - st.size * 0.62,
              width,
              textAlign: 'center',
              fontFamily: FONT,
              fontWeight: st.weight ?? 700,
              fontSize: st.size,
              lineHeight: 1.2,
              color: st.dashed ? 'transparent' : st.color ?? INK,
              WebkitTextStroke: st.dashed ? `2.5px ${PENCIL}` : undefined,
              clipPath: `inset(-20% 0 -20% ${(1 - p) * 100}%)`,
              whiteSpace: 'nowrap',
            }}
          >
            {st.text}
          </div>,
        );
        if (drawing) pen = {x: st.x + width / 2 - width * p, y: st.y + st.size * 0.25};
        break;
      }
      case 'img': {
        const rot = st.rot ?? -2;
        html.push(
          <div key={i} style={{position: 'absolute', left: st.x, top: st.y, width: st.w, height: st.h, rotate: `${rot}deg`, opacity: p, scale: String(1.06 - p * 0.06), boxShadow: '0 12px 30px rgba(40,30,20,0.25)', background: '#fff', padding: 10}}>
            <Img src={staticFile(st.src)} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
            {[
              [-20, -14, -30],
              [st.w - 90, -14, 28],
            ].map(([tx, ty, tr], k) => (
              <div key={k} style={{position: 'absolute', left: tx, top: ty, width: 110, height: 34, rotate: `${tr}deg`, background: 'rgba(232,220,190,0.85)'}} />
            ))}
          </div>,
        );
        break;
      }
      case 'logo': {
        const kind = st.kind ?? 'lockup';
        const ratio = kind === 'lockup' ? 742 / 938 : 554 / 535;
        const h = st.w * ratio;
        const outline = interpolate(p, [0, 0.65], [0, 1], clamp);
        const fillP = interpolate(p, [0.6, 1], [0, 1], clamp);
        html.push(
          <div key={i} style={{position: 'absolute', left: st.x - st.w / 2, top: st.y, width: st.w, height: h}}>
            <Img src={staticFile(`brand/${kind}-ink.png`)} style={{position: 'absolute', inset: 0, width: st.w, height: h, clipPath: `inset(0 0 0 ${(1 - outline) * 100}%)`}} />
            <Img src={staticFile(`brand/${kind}.png`)} style={{position: 'absolute', inset: 0, width: st.w, height: h, opacity: fillP}} />
          </div>,
        );
        if (drawing && outline < 1) pen = {x: st.x + st.w / 2 - st.w * outline, y: st.y + h * (0.3 + 0.4 * Math.sin(outline * 9))};
        break;
      }
      case 'pip':
        html.push(<PipFace key={i} x={st.x} y={st.y} r={st.r} p={p} from={st.start} until={st.until} />);
        vec.push(<path key={`${i}r`} d={ellipse(st.x, st.y, st.r + 14, st.r + 14, i, 1.05)} fill="none" stroke={INK} strokeWidth={6} strokeDasharray={`${getLength(ellipse(st.x, st.y, st.r + 14, st.r + 14, i, 1.05))}`} strokeDashoffset={getLength(ellipse(st.x, st.y, st.r + 14, st.r + 14, i, 1.05)) * (1 - p)} />);
        break;
      case 'custom':
        html.push(<React.Fragment key={i}>{st.render(f, p)}</React.Fragment>);
        break;
    }
  });

  return (
    <AbsoluteFill>
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <defs>
          <filter id={fid} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed={seed} />
            <feDisplacementMap in="SourceGraphic" scale="4.5" />
          </filter>
        </defs>
        <g filter={`url(#${fid})`}>{vec}</g>
      </svg>
      {html}
      {pen ? <Pen x={(pen as {x: number; y: number}).x} y={(pen as {x: number; y: number}).y} /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ caption */

/** The spoken line, handwritten in ink at the foot of each drawing. */
export const SketchCaption: React.FC<{s: Scene; f: number; top?: number}> = ({s, f, top = 1290}) => {
  const lines = s.lines as unknown as Line[];
  let li = -1;
  lines.forEach((l, i) => {
    if (f >= l.words[0].t - 2) li = i;
  });
  if (li < 0) return null;
  const line = lines[li];
  return (
    <div dir="rtl" style={{position: 'absolute', top, left: 80, right: 80, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: line.words.length <= 3 ? 84 : 66, lineHeight: 1.3, color: INK}}>
      {line.words.map((w, i) => {
        const p = interpolate(f, [w.t - 1, w.t + 4], [0, 1], clamp);
        const key = line.keys.includes(i);
        return (
          <span key={i} style={{display: 'inline-block', marginLeft: '0.28em', color: key ? BLUE : INK, opacity: 0.12 + p * 0.88, clipPath: `inset(-30% 0 -30% ${(1 - p) * 100}%)`, borderBottom: key && p > 0.9 ? `5px solid ${BLUE}` : '5px solid transparent'}}>
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------ paper */

export const Paper: React.FC<{camX: number; camY: number; scale: number}> = ({camX, camY, scale}) => (
  <AbsoluteFill style={{background: PAPER}}>
    <AbsoluteFill
      style={{
        backgroundImage: 'radial-gradient(rgba(30,43,58,0.16) 1.6px, transparent 1.8px)',
        backgroundSize: `${48 * scale}px ${48 * scale}px`,
        backgroundPosition: `${-camX * scale}px ${-camY * scale}px`,
      }}
    />
    <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, opacity: 0.35, mixBlendMode: 'multiply'}}>
      <filter id="paperGrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0 0.32  0 0 0 0.35 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#paperGrain)" />
    </svg>
    <AbsoluteFill style={{background: 'radial-gradient(120% 85% at 50% 45%, transparent 55%, rgba(90,70,40,0.22) 100%)'}} />
  </AbsoluteFill>
);

/* ------------------------------------------------------------ scenes */

const SERVICE_TITLE = (t: string): Step[] => [
  {k: 'text', text: t, x: 540, y: 330, size: 92, cue: 0, dur: 10},
  {k: 'path', d: underline(300, 780, 395), color: BLUE, w: 8, dur: 6},
];
const browser = (x: number, y: number, w: number, h: number, src: string, s = 1): Step[] => [
  {k: 'path', d: rect(x, y, w, h, s), dur: 10},
  {k: 'path', d: `M ${x} ${y + 46} L ${x + w} ${y + 46}`, dur: 4},
  {k: 'path', d: `${ellipse(x + 30, y + 23, 8, 8, s + 3, 1)} ${ellipse(x + 58, y + 23, 8, 8, s + 4, 1)}`, dur: 4},
  {k: 'img', src, x: x + 14, y: y + 58, w: w - 28, h: h - 72, rot: 0},
];

export const sceneSteps = (s: Scene): {steps: Step[]; caption?: number | false} => {
  switch (s.name) {
    case 'المشكلة':
      return {
        steps: [
          {k: 'bubble', x: 360, y: 300, w: 640, h: 120, text: 'مبرمج: البرمجة عليّ، التصميم لا', cue: 'مبرمج', size: 38},
          {k: 'bubble', x: 80, y: 470, w: 640, h: 120, text: 'مصمّم: التصميم عليّ، البرمجة لا', cue: 'مصمم', me: true, size: 38},
          {k: 'bubble', x: 300, y: 640, w: 700, h: 120, text: 'شركة: الاستضافة والدعم بسعر ثاني', cue: 'شركات', size: 38},
          // cost chart: one place vs. many places
          {k: 'path', d: 'M 220 1180 L 860 1180 M 220 1180 L 220 840', cue: 'وكوست', dur: 8},
          {k: 'bar', x: 290, base: 1180, w: 150, h: 90, color: BLUE, label: 'جهة واحدة'},
          {k: 'bar', x: 600, base: 1180, w: 150, h: 300, color: RED, label: 'عدة جهات', cue: 'أضعاف'},
          {k: 'path', d: arrow(470, 1080, 590, 900, -0.2), color: RED, w: 6},
        ],
        caption: 1290,
      };
    case 'وقت ضائع':
      return {
        steps: [
          {k: 'path', d: rect(160, 330, 170, 150, 11), dur: 8},
          {k: 'icon', name: 'code', x: 205, y: 365, size: 80},
          {k: 'path', d: rect(750, 330, 170, 150, 12), dur: 8},
          {k: 'icon', name: 'pen', x: 795, y: 365, size: 80},
          {k: 'path', d: rect(455, 600, 170, 150, 13), dur: 8},
          {k: 'icon', name: 'building', x: 500, y: 635, size: 80},
          {k: 'path', d: `${arrow(340, 400, 740, 400, -0.15, 21)} ${arrow(800, 490, 610, 610, 0.2, 22)} ${arrow(450, 640, 280, 490, 0.2, 23)}`, color: PENCIL, w: 5, cue: 'تضيع'},
          {
            k: 'custom',
            cue: 'وقتك',
            dur: 10,
            render: (f, p) => {
              const a = f * 0.4;
              return (
                <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, opacity: p}}>
                  <circle cx={870} cy={700} r={95} fill="rgba(255,255,255,0.6)" stroke={INK} strokeWidth={6} />
                  {Array.from({length: 12}).map((_, k) => (
                    <line key={k} x1={870 + Math.cos((k / 12) * Math.PI * 2) * 78} y1={700 + Math.sin((k / 12) * Math.PI * 2) * 78} x2={870 + Math.cos((k / 12) * Math.PI * 2) * 92} y2={700 + Math.sin((k / 12) * Math.PI * 2) * 92} stroke={INK} strokeWidth={4} />
                  ))}
                  <line x1={870} y1={700} x2={870 + Math.cos(a) * 70} y2={700 + Math.sin(a) * 70} stroke={RED} strokeWidth={6} strokeLinecap="round" />
                  <line x1={870} y1={700} x2={870 + Math.cos(a / 12) * 45} y2={700 + Math.sin(a / 12) * 45} stroke={INK} strokeWidth={7} strokeLinecap="round" />
                </svg>
              );
            },
          },
          {k: 'path', d: arrow(540, 780, 540, 880, 0), color: BLUE, w: 7, cue: 'الحل'},
          {k: 'path', d: rect(300, 900, 480, 300, 31), color: BLUE, w: 7, dur: 10},
          {k: 'logo', x: 540, y: 930, w: 300, cue: 'بمكان', dur: 16},
          {k: 'path', d: check(800, 930, 70), color: BLUE, w: 9},
        ],
      };
    case 'مهما كانت فكرتك':
      return {
        steps: [
          {k: 'icon', name: 'bulb', x: 390, y: 420, size: 300, dur: 22},
          {k: 'path', d: 'M 540 360 L 540 300 M 380 420 L 330 380 M 700 420 L 750 380 M 350 560 L 290 560 M 730 560 L 790 560', color: BLUE, w: 6},
          {k: 'icon', name: 'phone', x: 140, y: 800, size: 110},
          {k: 'icon', name: 'globe', x: 330, y: 860, size: 110},
          {k: 'icon', name: 'bag', x: 640, y: 860, size: 110},
          {k: 'icon', name: 'grid', x: 830, y: 800, size: 110},
          {k: 'fill', d: ellipse(540, 570, 170, 180, 41), color: 'rgba(255,214,90,0.25)'},
        ],
      };
    case 'بناء الشعار':
      return {
        steps: [
          {k: 'path', d: 'M 230 400 L 850 400 M 230 385 L 230 415 M 850 385 L 850 415', color: PENCIL, w: 4, dur: 6},
          {k: 'logo', x: 540, y: 440, w: 560, dur: 40},
          {k: 'path', d: underline(300, 780, 940), color: BLUE, w: 9, dur: 8},
        ],
      };
    case 'من الفكرة إلى التنفيذ': {
      const st: [IconName, number, string, string][] = [
        ['bulb', 880, 'فكرة', 'من'],
        ['pen', 640, 'تصميم', 'الفكرة'],
        ['code', 400, 'تطوير', 'إلى'],
        ['rocket', 160, 'إطلاق', 'التنفيذ'],
      ];
      return {
        steps: [
          {k: 'path', d: 'M 940 560 C 800 500, 720 620, 600 560 S 380 500, 280 560 S 120 620, 90 560', color: PENCIL, w: 5, dur: 12},
          ...st.flatMap(([icon, x, label, cue], k) => [
            {k: 'path', d: ellipse(x, 560, 74, 74, 50 + k, 1.05), color: BLUE, w: 6, cue, dur: 6} as Step,
            {k: 'icon', name: icon, x: x - 36, y: 524, size: 72, dur: 6} as Step,
            {k: 'text', text: label, x, y: 700, size: 46, dur: 5} as Step,
          ]),
          ...browser(220, 790, 640, 400, 'projects/venda-desktop.webp', 61),
        ],
      };
    }
    case 'نشتغل وياك':
      return {
        steps: [
          {k: 'pip', x: 200, y: 420, r: 130, until: s.end + 10, cue: 0, dur: 12},
          {k: 'text', text: 'ننفّذ طلبك', x: 690, y: 420, size: 80, cue: 'ننفذ'},
          {k: 'path', d: 'M 520 420 C 600 400, 760 440, 860 405', color: RED, w: 8, cue: 'نشتغل'},
          {k: 'bubble', x: 80, y: 630, w: 600, h: 110, text: 'عندي فكرة، بس محتار', size: 40, cue: 'نشتغل'},
          {k: 'bubble', x: 400, y: 790, w: 600, h: 110, text: 'خلّينا نفهمها سوا', me: true, size: 40},
          {k: 'bubble', x: 80, y: 950, w: 560, h: 110, text: 'شنو الأنسب إلي؟', size: 40, cue: 'نوصل'},
          {k: 'bubble', x: 360, y: 1110, w: 640, h: 110, text: 'نقترح ونبني وياك خطوة بخطوة', me: true, size: 38, cue: 'الأنسب'},
        ],
        caption: false,
      };
    case '٠١ مواقع إلكترونية':
      return {steps: [...SERVICE_TITLE('مواقع إلكترونية'), ...browser(90, 520, 900, 590, 'projects/venda-desktop.webp', 71)]};
    case '٠٢ تطبيقات موبايل':
      return {
        steps: [
          ...SERVICE_TITLE('تطبيقات موبايل'),
          ...[
            [150, 'projects/venda-mobile.webp'],
            [410, 'projects/mandi-menu-mobile.webp'],
            [670, 'projects/alsaad-mobile.webp'],
          ].flatMap(([x, src], k) => [
            {k: 'path', d: rect((x as number) - 10, 500, 270, 560, 80 + k), dur: 5} as Step,
            {k: 'img', src: src as string, x: x as number, y: 515, w: 250, h: 530, rot: k - 1, dur: 5} as Step,
          ]),
        ],
      };
    case '٠٣ متاجر إلكترونية':
      return {
        steps: [
          ...SERVICE_TITLE('متاجر إلكترونية'),
          ...browser(70, 520, 760, 500, 'projects/alsaad-desktop.webp', 91),
          {k: 'icon', name: 'bag', x: 830, y: 880, size: 150},
        ],
      };
    case '٠٤ أنظمة متكاملة':
      return {
        steps: [
          ...SERVICE_TITLE('أنظمة متكاملة'),
          {k: 'img', src: 'projects/inventory.svg', x: 90, y: 500, w: 560, h: 350, rot: -3, dur: 6},
          {k: 'img', src: 'projects/pos.svg', x: 430, y: 760, w: 560, h: 350, rot: 2, dur: 6},
          {k: 'path', d: 'M 120 1170 L 380 1170 M 120 1170 L 120 960', dur: 5},
          {k: 'bar', x: 150, base: 1170, w: 50, h: 90},
          {k: 'bar', x: 230, base: 1170, w: 50, h: 150, dur: 6},
          {k: 'bar', x: 310, base: 1170, w: 50, h: 200, dur: 6},
        ],
      };
    case '٠٥ ذكاء اصطناعي': {
      const nodes = [
        [260, 620],
        [260, 840],
        [540, 520],
        [540, 730],
        [540, 940],
        [820, 620],
        [820, 840],
      ];
      const edges = [
        [0, 2],
        [0, 3],
        [1, 3],
        [1, 4],
        [2, 5],
        [3, 5],
        [3, 6],
        [4, 6],
      ];
      return {
        steps: [
          ...SERVICE_TITLE('ذكاء اصطناعي'),
          {k: 'path', d: edges.map(([a, b]) => `M ${nodes[a][0]} ${nodes[a][1]} L ${nodes[b][0]} ${nodes[b][1]}`).join(' '), color: PENCIL, w: 4, dur: 10},
          {k: 'path', d: nodes.map(([x, y], k) => ellipse(x, y, 34, 34, 100 + k, 1.02)).join(' '), color: BLUE, w: 6, dur: 12},
          {k: 'fill', d: nodes.map(([x, y], k) => ellipse(x, y, 30, 30, 110 + k, 1)).join(' '), color: HL},
        ],
      };
    }
    case '٠٦ أتمتة':
      return {
        steps: [
          ...SERVICE_TITLE('أتمتة'),
          {k: 'bubble', x: 380, y: 520, w: 600, h: 110, text: 'سعر الخدمة؟', size: 42, dur: 7},
          {k: 'icon', name: 'zap', x: 470, y: 690, size: 100, dur: 6},
          {k: 'bubble', x: 100, y: 840, w: 640, h: 110, text: 'رد آلي فوري بالتفاصيل', me: true, size: 40, dur: 7},
        ],
      };
    case '٠٧ حلول برمجية خاصة':
      return {
        steps: [
          ...SERVICE_TITLE('حلول برمجية خاصة'),
          {k: 'img', src: 'projects/clinic.svg', x: 80, y: 500, w: 440, h: 275, rot: -2, dur: 6},
          {k: 'img', src: 'projects/schools.svg', x: 560, y: 500, w: 440, h: 275, rot: 2, dur: 6},
          {k: 'img', src: 'projects/menu.svg', x: 80, y: 830, w: 440, h: 275, rot: 1, dur: 6},
          {k: 'img', src: 'projects/clinic-booking-light.svg', x: 560, y: 830, w: 440, h: 275, rot: -1, dur: 6},
        ],
      };
    case '٠٨ تصاميم وهويات':
      return {
        steps: [
          ...SERVICE_TITLE('تصاميم وهويات بصرية'),
          {k: 'logo', x: 540, y: 470, w: 420, dur: 26},
          ...['#16283C', '#2E4A6B', '#3D8BFF', '#C9D3DE'].flatMap((c, k) => [
            {k: 'fill', d: ellipse(240 + k * 200, 1020, 70, 70, 130 + k, 1), color: c, dur: 4} as Step,
            {k: 'path', d: ellipse(240 + k * 200, 1020, 74, 74, 140 + k, 1.05), w: 5, dur: 4} as Step,
          ]),
        ],
      };
    case 'بمكان واحد': {
      const icons: IconName[] = ['globe', 'phone', 'bag', 'grid', 'cpu', 'zap', 'layers', 'palette'];
      return {
        steps: [
          ...icons.map((name, k) => {
            const a = (k / icons.length) * Math.PI * 2 - Math.PI / 2;
            return {k: 'icon', name, x: 540 + Math.cos(a) * 380 - 45, y: 760 + Math.sin(a) * 380 - 45, size: 90, dur: 4} as Step;
          }),
          {k: 'path', d: icons.map((_, k) => {
            const a = (k / icons.length) * Math.PI * 2 - Math.PI / 2;
            return arrow(540 + Math.cos(a) * 300, 760 + Math.sin(a) * 300, 540 + Math.cos(a) * 200, 760 + Math.sin(a) * 200, 0, 150 + k);
          }).join(' '), color: PENCIL, w: 4, dur: 10},
          {k: 'path', d: ellipse(540, 760, 175, 175, 160, 1.05), color: BLUE, w: 7, cue: 'بمكان', dur: 8},
          {k: 'logo', x: 540, y: 655, w: 260, dur: 16},
        ],
      };
    }
    case 'شنو اللي يميّزنا':
      return {
        steps: [
          {k: 'pip', x: 540, y: 640, r: 230, until: s.end + 10, cue: 0, dur: 10},
          {k: 'text', text: '؟', x: 850, y: 470, size: 220, color: BLUE, dur: 8},
          {k: 'text', text: '؟', x: 230, y: 860, size: 150, color: PENCIL, dur: 6},
        ],
        caption: 1050,
      };
    case 'كيف نشتغل': {
      const pts: [number, number, IconName, string, Cue][] = [
        [900, 420, 'message', 'نسمع', 'نسمع'],
        [600, 470, 'search', 'نفهم', 'نفهم'],
        [280, 560, 'map', 'نخطّط', 'نخطط'],
        [430, 760, 'pen', 'نصمّم', 'نصمم'],
        [760, 820, 'code', 'نبرمج', 'نبرمج'],
        [640, 1030, 'rocket', 'نطلق', 'الإطلاق'],
        [300, 1080, 'trend', 'نطوّر', 'والتطوير'],
      ];
      return {
        steps: [
          {k: 'path', d: 'M 980 380 C 760 380, 700 520, 520 500 S 180 520, 260 640 S 640 700, 820 860 S 760 1000, 580 1040 S 200 1060, 140 1130', color: PENCIL, w: 5, dash: true, dur: 14},
          ...pts.flatMap(([x, y, icon, label, cue], k) => [
            {k: 'path', d: ellipse(x, y, 62, 62, 170 + k, 1.05), color: BLUE, w: 6, cue, dur: 5} as Step,
            {k: 'icon', name: icon, x: x - 30, y: y - 30, size: 60, dur: 5} as Step,
            {k: 'text', text: label, x, y: y + 105, size: 46, dur: 4} as Step,
          ]),
        ],
      };
    }
    case 'هدفنا':
      return {
        steps: [
          {k: 'path', d: 'M 120 520 L 220 470 L 320 520 L 320 640 L 220 690 L 120 640 Z M 120 520 L 220 570 L 320 520 M 220 570 L 220 690', cue: 'نسلمك', dur: 12},
          {k: 'path', d: 'M 340 640 L 900 640', color: PENCIL, w: 5, dash: true, dur: 10},
          {k: 'path', d: cross(940, 640, 26), color: RED, w: 8, dur: 5},
          {k: 'path', d: 'M 140 1180 L 960 1180 M 140 1180 L 140 760', cue: {w: 'هدفنا', nth: 1}, dur: 8},
          {k: 'bar', x: 210, base: 1180, w: 110, h: 90, label: 'إطلاق', cue: 'حل'},
          {k: 'bar', x: 470, base: 1180, w: 110, h: 200, label: 'تحسين', cue: 'يخدم'},
          {k: 'bar', x: 730, base: 1180, w: 110, h: 340, label: 'توسّع', cue: 'ويساعده'},
          {k: 'path', d: arrow(250, 1060, 900, 780, -0.08, 190), color: BLUE, w: 8, cue: 'يتطور', dur: 12},
        ],
      };
    case 'شركة أو فكرة':
      return {
        steps: [
          {k: 'icon', name: 'building', x: 620, y: 470, size: 330, cue: 'شركة', dur: 18},
          {k: 'text', text: 'شركة', x: 785, y: 880, size: 60},
          {k: 'path', d: 'M 540 600 L 540 720 M 480 660 L 600 660', color: BLUE, w: 9},
          {k: 'icon', name: 'bulb', x: 130, y: 470, size: 330, cue: 'فكرة', dur: 18},
          {k: 'text', text: 'فكرة', x: 295, y: 880, size: 60},
        ],
      };
    case 'فكرتك، تنفيذنا':
      return {
        steps: [
          {k: 'logo', x: 540, y: 320, w: 320, cue: 0, dur: 20},
          {k: 'text', text: 'فكرتك،', x: 540, y: 860, size: 190, dashed: true, cue: 'فكرتك', width: 760},
          {k: 'text', text: 'تنفيذنا', x: 540, y: 1100, size: 190, cue: 'تنفيذنا', width: 760},
          {k: 'path', d: underline(240, 840, 1200, 200), color: BLUE, w: 12, dur: 8},
        ],
        caption: false,
      };
    default:
      return {steps: []};
  }
};

export const SketchScene: React.FC<{s: Scene; f: number}> = ({s, f}) => {
  const {steps, caption} = sceneSteps(s);
  return (
    <AbsoluteFill>
      <SketchSteps s={s} f={f} steps={steps} />
      {caption === false ? null : <SketchCaption s={s} f={f} top={caption ?? 1290} />}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ end screen */

export const SketchEnd: React.FC<{f: number; start: number}> = ({f, start}) => {
  const p = (a: number, d: number) => interpolate(f, [start + a, start + a + d], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const box = bubble(240, 1160, 600, 130, true);
  const L = getLength(box);
  return (
    <AbsoluteFill>
      <Paper camX={0} camY={0} scale={1} />
      <div style={{position: 'absolute', left: 540 - 220, top: 540, width: 440, height: 440 * (742 / 938)}}>
        <Img src={staticFile('brand/lockup-ink.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', clipPath: `inset(0 0 0 ${(1 - p(0, 16)) * 100}%)`}} />
        <Img src={staticFile('brand/lockup.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: p(12, 10)}} />
      </div>
      <div dir="rtl" style={{position: 'absolute', top: 940, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 92, color: INK, clipPath: `inset(-20% 0 -20% ${(1 - p(14, 14)) * 100}%)`}}>
        فكرتك، <span style={{color: BLUE}}>تنفيذنا</span>
      </div>
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        <path d={box} fill="rgba(47,111,224,0.1)" stroke={BLUE} strokeWidth={6} strokeDasharray={`${L} ${L}`} strokeDashoffset={L * (1 - p(26, 14))} />
      </svg>
      <div dir="rtl" style={{position: 'absolute', left: 240, width: 600, top: 1190, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 56, color: INK, opacity: p(34, 8)}}>
        راسلنا بكلمة <span style={{color: BLUE}}>«فكرة»</span>
      </div>
      <div style={{position: 'absolute', top: 1360, width: '100%', textAlign: 'center', fontFamily: FONT, fontSize: 38, color: '#5E6B7A', opacity: p(42, 8)}}>tech.monafithoon.com</div>
    </AbsoluteFill>
  );
};
