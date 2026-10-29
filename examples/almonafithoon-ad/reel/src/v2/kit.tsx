// «من المخطط إلى البناء» — design system tokens and building blocks for the v2 graphics.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {FONT} from '../theme';

export const T = {
  navy900: '#050B14',
  navy800: '#0A1626',
  navy700: '#0E1F33',
  brand: '#16283C',
  steel: '#2E4A6B',
  silver: '#C9D3DE',
  silverDim: 'rgba(201, 211, 222, 0.42)',
  line: 'rgba(201, 211, 222, 0.16)',
  lineStrong: 'rgba(201, 211, 222, 0.38)',
  white: '#FFFFFF',
  blue: '#3D8BFF',
  blueSoft: '#8BBCFF',
  glow: 'rgba(61, 139, 255, 0.45)',
} as const;

// Type scale (px) — Readex Pro only
export const TYPE = {display: 156, h1: 112, h2: 78, body: 64, caption: 40, label: 26} as const;

export const SAFE = {top: 220, bottom: 380, left: 72, right: 150} as const;

const AR = '٠١٢٣٤٥٦٧٨٩';
export const ar = (n: number | string) => String(n).replace(/[0-9]/g, (d) => AR[Number(d)]);

/* --------------------------------------------------------------- Canvas */

export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.06}) => (
  <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, opacity, mixBlendMode: 'overlay'}}>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain)" />
  </svg>
);

/** The blueprint canvas every graphics shot lives on. */
export const Canvas: React.FC<{children?: React.ReactNode; grid?: number; focus?: [number, number]}> = ({
  children,
  grid = 1,
  focus = [50, 42],
}) => (
  <AbsoluteFill style={{background: `radial-gradient(110% 75% at ${focus[0]}% ${focus[1]}%, ${T.navy700} 0%, ${T.navy800} 48%, ${T.navy900} 100%)`, overflow: 'hidden'}}>
    <AbsoluteFill
      style={{
        opacity: grid,
        backgroundImage: `linear-gradient(${T.line} 1px, transparent 1px), linear-gradient(90deg, ${T.line} 1px, transparent 1px),
          linear-gradient(rgba(201,211,222,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,211,222,0.05) 1px, transparent 1px)`,
        backgroundSize: '120px 120px, 120px 120px, 24px 24px, 24px 24px',
        backgroundPosition: '0 0, 0 0, 0 0, 0 0',
        maskImage: `radial-gradient(85% 65% at ${focus[0]}% ${focus[1]}%, black 30%, transparent 100%)`,
      }}
    />
    {children}
    <AbsoluteFill style={{background: 'radial-gradient(130% 90% at 50% 45%, transparent 60%, rgba(2, 6, 12, 0.6) 100%)', pointerEvents: 'none'}} />
    <Grain />
  </AbsoluteFill>
);

/* ---------------------------------------------------- Blueprint marks */

export const CropMarks: React.FC<{x: number; y: number; w: number; h: number; color?: string; size?: number}> = ({
  x,
  y,
  w,
  h,
  color = T.lineStrong,
  size = 26,
}) => {
  const c = [
    [x, y, 1, 1],
    [x + w, y, -1, 1],
    [x, y + h, 1, -1],
    [x + w, y + h, -1, -1],
  ];
  return (
    <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      {c.map(([cx, cy, sx, sy], i) => (
        <path key={i} d={`M ${cx} ${cy + sy * size} L ${cx} ${cy} L ${cx + sx * size} ${cy}`} stroke={color} strokeWidth={2} fill="none" />
      ))}
    </svg>
  );
};

export const Dimension: React.FC<{x1: number; y1: number; x2: number; y2: number; label?: string; color?: string}> = ({
  x1,
  y1,
  x2,
  y2,
  label,
  color = T.silverDim,
}) => {
  const vertical = x1 === x2;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.5} strokeDasharray="6 6" />
      {vertical ? (
        <>
          <line x1={x1 - 10} y1={y1} x2={x1 + 10} y2={y1} stroke={color} strokeWidth={2} />
          <line x1={x2 - 10} y1={y2} x2={x2 + 10} y2={y2} stroke={color} strokeWidth={2} />
        </>
      ) : (
        <>
          <line x1={x1} y1={y1 - 10} x2={x1} y2={y1 + 10} stroke={color} strokeWidth={2} />
          <line x1={x2} y1={y2 - 10} x2={x2} y2={y2 + 10} stroke={color} strokeWidth={2} />
        </>
      )}
      {label ? (
        <text
          x={vertical ? mx + 16 : mx}
          y={vertical ? my : my - 14}
          fill={color}
          fontFamily={FONT}
          fontSize={22}
          textAnchor={vertical ? 'start' : 'middle'}
          dominantBaseline="middle"
        >
          {label}
        </text>
      ) : null}
    </svg>
  );
};

/* ------------------------------------------- Pixel squares (from the logo) */

// Relative positions of the five squares in the mark, normalised to the mark's square cluster.
const PIXELS = [
  [0.78, 0.0, 0.22],
  [0.0, 0.2, 0.38],
  [0.6, 0.52, 0.26],
  [0.12, 0.72, 0.3],
] as const;

export const PixelCluster: React.FC<{x: number; y: number; size: number; mode?: 'solid' | 'outline' | 'mixed'; opacity?: number}> = ({
  x,
  y,
  size,
  mode = 'solid',
  opacity = 1,
}) => (
  <div style={{position: 'absolute', left: x, top: y, width: size, height: size, opacity}}>
    {PIXELS.map(([px, py, s], i) => {
      const solid = mode === 'solid' || (mode === 'mixed' && i % 2 === 0);
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: px * size,
            top: py * size,
            width: s * size,
            height: s * size,
            borderRadius: s * size * 0.12,
            background: solid ? T.blue : 'transparent',
            border: solid ? 'none' : `2px solid ${T.blueSoft}`,
            boxShadow: solid ? `0 0 ${size * 0.15}px ${T.glow}` : 'none',
          }}
        />
      );
    })}
  </div>
);

/* ------------------------------------------------------ Slab container */

// Slanted top edge, taken from the building slabs in the mark.
export const SLAB_CLIP = 'polygon(0 14%, 100% 0, 100% 100%, 0 100%)';

export const Slab: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  state?: 'blueprint' | 'built';
  rotate?: number;
  children?: React.ReactNode;
}> = ({x, y, w, h, state = 'built', rotate = 0, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, rotate: `${rotate}deg`}}>
    {state === 'blueprint' ? (
      <svg width={w} height={h} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <polygon points={`0,${h * 0.14} ${w},0 ${w},${h} 0,${h}`} fill="rgba(139,188,255,0.04)" stroke={T.blueSoft} strokeWidth={2} strokeDasharray="10 8" />
      </svg>
    ) : (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: SLAB_CLIP,
          background: `linear-gradient(160deg, ${T.steel} 0%, ${T.brand} 55%, ${T.navy800} 100%)`,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
        }}
      />
    )}
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 34px 30px'}}>{children}</div>
  </div>
);

/* ----------------------------------------------------- Kinetic type */

/**
 * The spoken line itself, laid out as design type. `upTo` = index of the word being spoken:
 * earlier words are fully shown, later ones are ghosted (they will appear in sync with the voice).
 */
export const KineticLine: React.FC<{
  words: string[];
  upTo: number;
  keys?: number[];
  size?: number;
  weight?: number;
  style?: React.CSSProperties;
  align?: 'center' | 'right';
}> = ({words, upTo, keys = [], size = TYPE.h2, weight = 700, style, align = 'center'}) => (
  <div
    dir="rtl"
    lang="ar"
    style={{
      fontFamily: FONT,
      fontWeight: weight,
      fontSize: size,
      lineHeight: 1.25,
      textAlign: align,
      textWrap: 'balance',
      color: T.white,
      ...style,
    }}
  >
    {words.map((w, i) => (
      <span
        key={i}
        style={{
          color: keys.includes(i) ? T.blueSoft : T.white,
          opacity: i <= upTo ? 1 : 0.14,
          filter: i === upTo ? `drop-shadow(0 0 18px ${T.glow})` : undefined,
        }}
      >
        {w}{' '}
      </span>
    ))}
  </div>
);

export const OutlineText: React.FC<{children: React.ReactNode; size: number; color?: string; stroke?: number; style?: React.CSSProperties}> = ({
  children,
  size,
  color = T.silver,
  stroke = 2,
  style,
}) => (
  <span
    style={{
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: size,
      color: 'transparent',
      WebkitTextStroke: `${stroke}px ${color}`,
      ...style,
    }}
  >
    {children}
  </span>
);

export const Counter: React.FC<{n: number; of: number; label?: string; style?: React.CSSProperties}> = ({n, of, label, style}) => (
  <div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT, fontWeight: 600, fontSize: TYPE.label + 4, color: T.blueSoft, ...style}}>
    <span>{ar(String(n).padStart(2, '0'))}</span>
    <span style={{width: 60, height: 2, background: T.lineStrong}} />
    <span style={{color: T.silverDim}}>{ar(String(of).padStart(2, '0'))}</span>
    {label ? <span style={{color: T.silverDim, marginRight: 8}}>{label}</span> : null}
  </div>
);

/** A real screenshot mid-«build»: the left part is still a wireframe, a scan line, then the finished UI. */
export const BuildWipe: React.FC<{src: string; w: number; h: number; at: number; radius?: number}> = ({src, w, h, at, radius = 18}) => (
  <div style={{position: 'relative', width: w, height: h, borderRadius: radius, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,4,12,0.6)'}}>
    <Img src={staticFile(src)} style={{position: 'absolute', inset: 0, width: w, height: h, objectFit: 'cover'}} />
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: w * at,
        background: T.navy800,
        backgroundImage: `linear-gradient(${T.line} 1px, transparent 1px), linear-gradient(90deg, ${T.line} 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }}
    >
      <Img
        src={staticFile(src)}
        style={{width: w, height: h, objectFit: 'cover', opacity: 0.22, filter: 'grayscale(1) contrast(1.6) brightness(1.3)', mixBlendMode: 'screen'}}
      />
    </div>
    <div style={{position: 'absolute', top: 0, bottom: 0, left: w * at - 2, width: 4, background: T.blue, boxShadow: `0 0 30px 6px ${T.glow}`}} />
    <div style={{position: 'absolute', inset: 0, borderRadius: radius, border: `1.5px solid ${T.lineStrong}`}} />
  </div>
);

export const Logo: React.FC<{state: 'outline' | 'solid'; width: number; kind?: 'lockup' | 'mark'; style?: React.CSSProperties}> = ({
  state,
  width,
  kind = 'lockup',
  style,
}) => {
  const ratio = kind === 'lockup' ? 742 / 938 : 554 / 535;
  const src = state === 'outline' ? `brand/${kind}-outline.png` : `brand/${kind}-white.png`;
  return <Img src={staticFile(src)} style={{width, height: width * ratio, display: 'block', ...style}} />;
};
