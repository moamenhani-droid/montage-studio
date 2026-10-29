// مشهد «هدفنا» ثلاثي الأبعاد: إسقاط منظوري يدوي (بلا مكتبات) — صندوق التسليم ومسار مسطح،
// ثم أعمدة نمو تصعد من اليسار إلى اليمين على كلماتها، بكاميرا تدور ببطء.
import React from 'react';
import {Easing, interpolate} from 'remotion';
import {Icon, type IconName} from '../components/Icon';
import {FONT} from '../theme';
import {DATA} from './animaticData';
import {PixelCluster, T} from './kit';

type Scene = (typeof DATA.scenes)[number];
export type V3 = [number, number, number];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const pr = (f: number, at: number, d = 14) => interpolate(f, [at, at + d], [0, 1], {...clamp, easing: ease});

/* ---------------------------------------------------------- camera */

export type Cam = {yaw: number; pitch: number; dist: number; focal: number; cx: number; cy: number};

export const project = (c: Cam, [x, y, z]: V3) => {
  const cy = Math.cos(c.yaw);
  const sy = Math.sin(c.yaw);
  const x1 = x * cy - z * sy;
  const z1 = x * sy + z * cy;
  const cp = Math.cos(c.pitch);
  const sp = Math.sin(c.pitch);
  const y2 = y * cp - z1 * sp;
  const z2 = y * sp + z1 * cp + c.dist;
  return {x: c.cx + (c.focal * x1) / z2, y: c.cy - (c.focal * y2) / z2, z: z2};
};

export const poly = (pts: {x: number; y: number}[]) => pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
const area = (pts: {x: number; y: number}[]) => pts.reduce((a, p, i) => a + (p.x * pts[(i + 1) % pts.length].y - pts[(i + 1) % pts.length].x * p.y), 0);

/* ------------------------------------------------------------ boxes */

export type Box = {x: number; z: number; w: number; d: number; h: number; top: string; side: string; front: string; edge: string; glow?: number; key: string};

/** Faces of an axis-aligned box standing on the floor, back-face culled, in screen space. */
export const boxFaces = (c: Cam, b: Box) => {
  const x0 = b.x - b.w / 2;
  const x1 = b.x + b.w / 2;
  const z0 = b.z - b.d / 2;
  const z1 = b.z + b.d / 2;
  const h = Math.max(0.5, b.h);
  const P = (x: number, y: number, z: number) => project(c, [x, y, z]);
  const faces: {pts: {x: number; y: number; z: number}[]; fill: string; kind: string}[] = [
    {pts: [P(x0, h, z0), P(x1, h, z0), P(x1, h, z1), P(x0, h, z1)], fill: b.top, kind: 'top'},
    {pts: [P(x0, 0, z0), P(x1, 0, z0), P(x1, h, z0), P(x0, h, z0)], fill: b.front, kind: 'front'},
    {pts: [P(x1, 0, z0), P(x1, 0, z1), P(x1, h, z1), P(x1, h, z0)], fill: b.side, kind: 'side'},
    {pts: [P(x0, 0, z1), P(x0, 0, z0), P(x0, h, z0), P(x0, h, z1)], fill: b.side, kind: 'side'},
    {pts: [P(x1, 0, z1), P(x0, 0, z1), P(x0, h, z1), P(x1, h, z1)], fill: b.front, kind: 'back'},
  ];
  // keep faces whose winding faces the camera (screen y is flipped, so the sign is inverted)
  return faces.filter((fc) => area(fc.pts) < 0);
};

/* ------------------------------------------------------------ scene */

const BARS: {x: number; h: number; icon: IconName; word: string}[] = [
  {x: -250, h: 110, icon: 'check', word: 'حل'},
  {x: -40, h: 210, icon: 'layers', word: 'يخدم'},
  {x: 170, h: 330, icon: 'grid', word: 'شغلك'},
  {x: 380, h: 470, icon: 'trend', word: 'يتطور'},
];

export const Goal3D: React.FC<{s: Scene; f: number; cue: (s: Scene, w: string, nth?: number) => number}> = ({s, f, cue}) => {
  const tDeliver = cue(s, 'نسلمك');
  const tGoal2 = cue(s, 'هدفنا', 1);
  const t = (f - s.start) / Math.max(1, s.end - s.start);
  const cam: Cam = {
    yaw: interpolate(t, [0, 1], [-0.5, -0.32], {...clamp, easing: Easing.inOut(Easing.sin)}),
    pitch: 0.46,
    dist: interpolate(t, [0, 1], [1640, 1540], {...clamp, easing: Easing.inOut(Easing.sin)}),
    focal: 1280,
    cx: 560,
    cy: 990,
  };

  const grid = pr(f, s.start - 6, 18);
  const pkg = pr(f, tDeliver - 10, 16);
  const flat = interpolate(f, [tDeliver, tDeliver + 24], [0, 1], {...clamp, easing: ease});
  const flatOut = pr(f, tGoal2 - 6, 14);
  const foot = pr(f, tGoal2 - 4, 16);
  const rise = BARS.map((b) => pr(f, cue(s, b.word) - 4, 16));

  /* floor grid */
  const lines: React.ReactNode[] = [];
  for (let i = -6; i <= 8; i++) {
    const a = project(cam, [i * 100, 0, -500]);
    const b = project(cam, [i * 100, 0, 500]);
    lines.push(<line key={`x${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={T.line} strokeWidth={1.2} />);
  }
  for (let k = -5; k <= 5; k++) {
    const a = project(cam, [-600, 0, k * 100]);
    const b = project(cam, [800, 0, k * 100]);
    lines.push(<line key={`z${k}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={T.line} strokeWidth={1.2} />);
  }

  /* the delivered package and the bars, painted back to front */
  const boxes: Box[] = [
    {
      key: 'pkg',
      x: -500,
      z: 0,
      w: 150,
      d: 150,
      h: 150 * pkg,
      top: 'url(#gTopPkg)',
      side: 'rgba(30, 52, 80, 0.98)',
      front: 'rgba(22, 40, 62, 0.98)',
      edge: 'rgba(201,211,222,0.45)',
    },
    ...BARS.map((b, i) => ({
      key: `bar${i}`,
      x: b.x,
      z: 0,
      w: 120,
      d: 120,
      h: b.h * rise[i],
      top: 'url(#gTopBar)',
      side: 'rgba(31, 95, 208, 0.92)',
      front: 'rgba(23, 68, 160, 0.95)',
      edge: 'rgba(139,188,255,0.7)',
      glow: i === BARS.length - 1 ? rise[i] : 0,
    })),
  ];
  const drawn = boxes
    .filter((b) => b.h > 0.6)
    .map((b) => ({b, depth: project(cam, [b.x, b.h / 2, b.z]).z}))
    .sort((a, b) => b.depth - a.depth);

  /* growth line across the bar tops */
  // the line always heads for each bar's final top, so it only ever climbs
  const finalTops = BARS.map((b) => project(cam, [b.x, b.h + 2, 0]));
  const reached = rise.reduce((n, r) => n + r, 0);
  const pathPts: {x: number; y: number}[] = [project(cam, [-500, 152 * pkg, 0])];
  rise.forEach((r, i) => {
    if (r <= 0) return;
    const prev = pathPts[pathPts.length - 1];
    pathPts.push({x: prev.x + (finalTops[i].x - prev.x) * r, y: prev.y + (finalTops[i].y - prev.y) * r});
  });

  /* flat «delivery only» path on the floor */
  const fa = project(cam, [-410, 0, 0]);
  const fb = project(cam, [-410 + 1000 * flat, 0, 0]);
  const fx = project(cam, [590, 0, 0]);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <defs>
          <linearGradient id="gTopBar" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9CC7FF" />
            <stop offset="1" stopColor={T.blue} />
          </linearGradient>
          <linearGradient id="gTopPkg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5E7794" />
            <stop offset="1" stopColor="#2E4A6B" />
          </linearGradient>
          <radialGradient id="gFloor" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#000" stopOpacity={0.55} />
            <stop offset="1" stopColor="#000" stopOpacity={0} />
          </radialGradient>
          <filter id="gSoft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id="gGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <mask id="gFloorFade">
            <radialGradient id="gFade" cx="0.5" cy="0.55" r="0.55">
              <stop offset="0.4" stopColor="#fff" />
              <stop offset="1" stopColor="#000" />
            </radialGradient>
            <rect x={0} y={300} width={1080} height={1200} fill="url(#gFade)" />
          </mask>
        </defs>

        <g opacity={grid} mask="url(#gFloorFade)">
          {lines}
        </g>

        {/* footprints: where each bar will rise, drawn as blueprint tiles */}
        {BARS.map((b, i) => {
          const c = [
            [b.x - 60, -60],
            [b.x + 60, -60],
            [b.x + 60, 60],
            [b.x - 60, 60],
          ].map(([x, z]) => project(cam, [x, 0, z]));
          return <polygon key={i} points={poly(c)} fill="rgba(139,188,255,0.06)" stroke={T.blueSoft} strokeWidth={1.6} strokeDasharray="7 7" opacity={foot * (1 - rise[i] * 0.6)} />;
        })}

        {/* «delivery only»: flat, dashed, going nowhere */}
        <line x1={fa.x} y1={fa.y} x2={fb.x} y2={fb.y} stroke={T.silverDim} strokeWidth={5} strokeDasharray="14 12" strokeLinecap="round" opacity={pkg * (1 - flatOut * 0.85)} />
        <g transform={`translate(${fx.x} ${fx.y})`} opacity={flatOut * (1 - rise[0] * 0.7)}>
          <path d="M -16 -16 L 16 16 M 16 -16 L -16 16" stroke="#FF9C8A" strokeWidth={5} strokeLinecap="round" />
        </g>

        {/* soft contact shadows */}
        {boxes
          .filter((b) => b.h > 0.6)
          .map((b) => {
            const c = [
              [b.x - b.w * 0.75, -b.d * 0.4],
              [b.x + b.w * 0.95, -b.d * 0.4],
              [b.x + b.w * 0.95, b.d * 0.9],
              [b.x - b.w * 0.75, b.d * 0.9],
            ].map(([x, z]) => project(cam, [x, 0, z]));
            return <polygon key={`sh-${b.key}`} points={poly(c)} fill="#000" opacity={0.35 * Math.min(1, b.h / 120)} filter="url(#gSoft)" />;
          })}

        {/* boxes */}
        {drawn.map(({b}) => (
          <g key={b.key} filter={b.glow ? 'url(#gGlow)' : undefined}>
            {boxFaces(cam, b).map((fc, i) => (
              <polygon key={i} points={poly(fc.pts)} fill={fc.fill} stroke={b.edge} strokeWidth={1.4} strokeLinejoin="round" />
            ))}
          </g>
        ))}

        {/* tape across the package lid */}
        {pkg > 0.95
          ? (() => {
              const h = 150 * pkg;
              const a = project(cam, [-500, h, -75]);
              const b = project(cam, [-500, h, 75]);
              return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(201,211,222,0.7)" strokeWidth={6} />;
            })()
          : null}

        {/* the growth line over the tops */}
        {reached > 0.05 ? (
          <polyline points={poly(pathPts)} fill="none" stroke="#BFDBFF" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" filter="url(#gGlow)" opacity={Math.min(1, reached)} />
        ) : null}
      </svg>

      {/* floating markers (always facing the camera) */}
      {pkg > 0.5 ? (
        (() => {
          const p = project(cam, [-500, 0, -110]);
          return (
            <div style={{position: 'absolute', left: Math.max(30, p.x - 120), top: p.y + 18, width: 240, textAlign: 'center', opacity: pkg * (1 - flatOut * 0.4)}}>
              <div dir="rtl" style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 18px', borderRadius: 999, background: 'rgba(8,19,31,0.8)', border: `1.5px solid ${T.lineStrong}`, fontFamily: FONT, fontSize: 28, color: T.silver}}>
                <Icon name="check" size={26} color={T.blueSoft} stroke={2.4} />
                تسليم المشروع
              </div>
            </div>
          );
        })()
      ) : null}
      {BARS.map((b, i) => {
        if (rise[i] < 0.3) return null;
        const p = project(cam, [b.x, b.h * rise[i] + 90, 0]);
        const a = pr(f, cue(s, b.word) + 6, 10);
        const last = i === BARS.length - 1;
        return (
          <div key={i} style={{position: 'absolute', left: p.x - 46, top: p.y - 46 - (1 - a) * 20, width: 92, height: 92, borderRadius: 46, display: 'grid', placeItems: 'center', background: last ? `linear-gradient(160deg, ${T.blue}, #1F5FD0)` : 'rgba(8,19,31,0.85)', border: `2.5px solid ${T.blueSoft}`, boxShadow: `0 0 ${last ? 50 : 24}px ${T.glow}`, opacity: a}}>
            <Icon name={b.icon} size={44} color={T.white} stroke={2} />
          </div>
        );
      })}
      {rise[3] > 0.9
        ? (() => {
            const p = project(cam, [380, 470 + 210, 0]);
            return <PixelCluster x={p.x + 30} y={p.y - 40} size={80} mode="solid" opacity={pr(f, cue(s, 'يتطور') + 10, 12)} />;
          })()
        : null}
    </div>
  );
};
