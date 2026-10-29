// «ليش تضيّع وقتك بين أكثر من جهة…» — ثلاثة أبراج متباعدة، مسار تنقّل لا ينتهي، وساعة على الأرض،
// ثم تنزلق الأبراج إلى المركز وتندمج قبل ظهور لوحة الهوية.
import React from 'react';
import {Easing, interpolate} from 'remotion';
import {Icon, type IconName} from '../components/Icon';
import {DATA} from './animaticData';
import {T} from './kit';
import {boxFaces, poly, project, type Box, type Cam, type V3} from './Goal3D';

type Scene = (typeof DATA.scenes)[number];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const pr = (f: number, at: number, d = 14) => interpolate(f, [at, at + d], [0, 1], {...clamp, easing: ease});

const TOWERS: {x: number; z: number; h: number; icon: IconName}[] = [
  {x: -330, z: -140, h: 240, icon: 'code'},
  {x: 300, z: -260, h: 300, icon: 'pen'},
  {x: 250, z: 330, h: 190, icon: 'building'},
];

export const Scatter3D: React.FC<{s: Scene; f: number; cue: (s: Scene, w: string, nth?: number) => number}> = ({s, f, cue}) => {
  const tTime = cue(s, 'وقتك');
  const tMore = cue(s, 'أكثر');
  const tIf = cue(s, 'إذا');
  const tOne = cue(s, 'بمكان');
  const t = (f - s.start) / Math.max(1, tOne - s.start);
  const cam: Cam = {
    yaw: interpolate(t, [0, 1], [0.55, 0.12], {...clamp, easing: Easing.inOut(Easing.sin)}),
    pitch: 0.36,
    dist: interpolate(t, [0, 1], [1650, 1450], {...clamp, easing: Easing.inOut(Easing.sin)}),
    focal: 1650,
    cx: 540,
    cy: 1010,
  };
  const scene = 1 - pr(f, tOne - 6, 10); // the 3D set dissolves as the brand plate lands
  const merge = interpolate(f, [tIf, tOne - 2], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const route = pr(f, s.start + 4, 20);
  const clock = pr(f, tTime - 4, 14);
  const grid = pr(f, s.start - 8, 16);

  const towers = TOWERS.map((tw, i) => {
    const up = pr(f, s.start + i * 5 - 6, 16);
    return {...tw, x: tw.x * (1 - merge), z: tw.z * (1 - merge), h: tw.h * up * (1 - merge * 0.75), up};
  });
  const P = (v: V3) => project(cam, v);

  /* floor grid */
  const lines: React.ReactNode[] = [];
  for (let i = -7; i <= 7; i++) {
    const a = P([i * 100, 0, -600]);
    const b = P([i * 100, 0, 600]);
    lines.push(<line key={`x${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={T.line} strokeWidth={1.2} />);
    const c = P([-700, 0, i * 100]);
    const d = P([700, 0, i * 100]);
    lines.push(<line key={`z${i}`} x1={c.x} y1={c.y} x2={d.x} y2={d.y} stroke={T.line} strokeWidth={1.2} />);
  }

  /* the endless back-and-forth between vendors: a closed loop on the floor */
  const loop: V3[] = [...towers, towers[0]].map((tw) => [tw.x, 0, tw.z]);
  const pts: V3[] = [];
  for (let k = 0; k < loop.length - 1; k++) {
    for (let j = 0; j < 24; j++) {
      const u = j / 24;
      const a = loop[k];
      const b = loop[k + 1];
      // a slight arc so the route reads as a journey, not a triangle
      const bow = Math.sin(u * Math.PI) * 60;
      pts.push([a[0] + (b[0] - a[0]) * u + bow * 0.3, 0, a[2] + (b[2] - a[2]) * u - bow]);
    }
  }
  pts.push(loop[loop.length - 1]);
  const routePts = pts.map(P);
  const shown = routePts.slice(0, Math.max(2, Math.round(routePts.length * route)));
  const speed = interpolate(f, [s.start, tMore, tIf], [70, 40, 26], clamp); // gets more frantic
  const u = ((f - s.start) % speed) / speed;
  const tok = routePts[Math.floor(u * (routePts.length - 1))];

  /* clock on the floor */
  const ring = (r: number) =>
    Array.from({length: 49}, (_, k) => {
      const a = (k / 48) * Math.PI * 2;
      return P([Math.cos(a) * r, 0, Math.sin(a) * r]);
    });
  const hand = (f - s.start) * 0.35;
  const handEnd = P([Math.cos(hand) * 150, 0, Math.sin(hand) * 150]);
  const center = P([0, 0, 0]);

  const boxes: Box[] = towers.map((tw, i) => ({
    key: `t${i}`,
    x: tw.x,
    z: tw.z,
    w: 130,
    d: 130,
    h: tw.h,
    top: 'url(#sTop)',
    side: 'rgba(30, 52, 80, 0.97)',
    front: 'rgba(22, 40, 62, 0.97)',
    edge: 'rgba(201,211,222,0.5)',
  }));
  const drawn = boxes
    .filter((b) => b.h > 0.6)
    .map((b) => ({b, depth: project(cam, [b.x, b.h / 2, b.z]).z}))
    .sort((a, b) => b.depth - a.depth);

  return (
    <div style={{position: 'absolute', inset: 0, opacity: scene}}>
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <defs>
          <linearGradient id="sTop" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7F95B0" />
            <stop offset="1" stopColor="#2E4A6B" />
          </linearGradient>
          <filter id="sSoft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id="sGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <mask id="sFade">
            <radialGradient id="sFadeG" cx="0.5" cy="0.5" r="0.55">
              <stop offset="0.35" stopColor="#fff" />
              <stop offset="1" stopColor="#000" />
            </radialGradient>
            <rect x={0} y={300} width={1080} height={1100} fill="url(#sFadeG)" />
          </mask>
        </defs>
        <g opacity={grid} mask="url(#sFade)">
          {lines}
        </g>

        {/* the clock of wasted time, lying on the floor */}
        <g opacity={clock * (1 - merge)}>
          <polygon points={poly(ring(190))} fill="rgba(139,188,255,0.05)" stroke={T.blueSoft} strokeWidth={2} />
          {Array.from({length: 12}, (_, k) => {
            const a = (k / 12) * Math.PI * 2;
            const p1 = P([Math.cos(a) * 168, 0, Math.sin(a) * 168]);
            const p2 = P([Math.cos(a) * 190, 0, Math.sin(a) * 190]);
            return <line key={k} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={T.blueSoft} strokeWidth={k % 3 === 0 ? 4 : 2} />;
          })}
          <line x1={center.x} y1={center.y} x2={handEnd.x} y2={handEnd.y} stroke={T.white} strokeWidth={5} strokeLinecap="round" />
          <circle cx={center.x} cy={center.y} r={7} fill={T.white} />
        </g>

        {/* route between vendors */}
        <polyline points={poly(shown)} fill="none" stroke={T.silverDim} strokeWidth={3.5} strokeDasharray="12 10" strokeDashoffset={-f * 2} opacity={1 - merge} />

        {/* contact shadows */}
        {boxes
          .filter((b) => b.h > 0.6)
          .map((b) => {
            const c = [
              [b.x - 90, -50],
              [b.x + 120, -50],
              [b.x + 120, 120],
              [b.x - 90, 120],
            ].map(([x, dz]) => P([x, 0, b.z + dz]));
            return <polygon key={`sh${b.key}`} points={poly(c)} fill="#000" opacity={0.4 * Math.min(1, b.h / 100)} filter="url(#sSoft)" />;
          })}

        {drawn.map(({b}) => (
          <g key={b.key}>
            {boxFaces(cam, b).map((fc, i) => (
              <polygon key={i} points={poly(fc.pts)} fill={fc.fill} stroke={b.edge} strokeWidth={1.4} strokeLinejoin="round" />
            ))}
          </g>
        ))}

        {/* you, running between them */}
        {tok && route > 0.95 && merge < 0.6 ? (
          <g filter="url(#sGlow)" opacity={1 - merge}>
            <circle cx={tok.x} cy={tok.y} r={13} fill={T.blue} />
            <circle cx={tok.x} cy={tok.y} r={5} fill={T.white} />
          </g>
        ) : null}
      </svg>

      {/* vendor icons floating above each tower */}
      {towers.map((tw, i) => {
        const p = P([tw.x, tw.h + 85, tw.z]);
        const a = tw.up * (1 - merge);
        return (
          <div key={i} style={{position: 'absolute', left: p.x - 50, top: p.y - 50, width: 100, height: 100, borderRadius: 30, display: 'grid', placeItems: 'center', background: 'rgba(8,19,31,0.85)', border: `2px solid ${T.lineStrong}`, boxShadow: '0 20px 40px rgba(0,4,12,0.5)', opacity: a}}>
            <Icon name={tw.icon} size={50} color={T.blueSoft} />
          </div>
        );
      })}
    </div>
  );
};
