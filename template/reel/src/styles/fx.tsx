// الرسم اليدوي، والانتقالات، والمظهر اللوني.
// الانتقالات هنا عروض توضيحية مستقلة؛ في المونتاج تُطبَّق بين مشهدين في Main.tsx (انظر transition في data.ts).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { B, FONT, SAFE } from "../brand";
import {
  Browser,
  Canvas,
  Grain,
  Logo,
  Media,
  Paper,
  Person,
  Pill,
  Room,
  Txt,
  Vignette,
} from "../engine/kit";
import { arrow, drawn, ellipse, rect, underline } from "../engine/sketch";
import { clamp, EASE, pr, reveal } from "../motion";
import type { StyleProps } from "./types";

/* ------------------------------------------------------------ رسم يدوي */

const Ink: React.FC<{ d: string; p: number; color?: string; w?: number }> = ({
  d,
  p,
  color = B.ink,
  w = 6,
}) =>
  p > 0 ? (
    <path
      {...drawn(d, p)}
      fill="none"
      stroke={color}
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ) : null;

/** يُضاف لمجموعة SVG ليعطي الخط «غليان» الرسم اليدوي (يتغير كل ٤ إطارات) */
const Boil: React.FC<{ id: string; f: number }> = ({ id, f }) => (
  <filter id={id}>
    <feTurbulence
      type="fractalNoise"
      baseFrequency="0.03"
      numOctaves="2"
      seed={Math.floor(f / 4) % 6}
    />
    <feDisplacementMap in="SourceGraphic" scale="5" />
  </filter>
);

export const SketchDraw: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const [a = "", b = ""] = p.items ?? [];
  return (
    <Paper>
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <Boil id="boil-a" f={f} />
        <g filter="url(#boil-a)">
          <Ink d={ellipse(540, 600, 360, 160, 3)} p={pr(f, 4, 20)} />
          <Ink
            d={underline(330, 750, 690, 2)}
            p={pr(f, 24, 10)}
            color={B.accent}
            w={10}
          />
          <Ink d={arrow(400, 820, 330, 1080, 0.15, 5)} p={pr(f, 34, 10)} />
          <Ink d={arrow(680, 820, 750, 1080, -0.15, 6)} p={pr(f, 38, 10)} />
          <Ink d={rect(160, 1110, 340, 230, 7)} p={pr(f, 46, 14)} />
          <Ink
            d={rect(580, 1110, 340, 230, 9)}
            p={pr(f, 52, 14)}
            color={B.accent}
          />
        </g>
      </svg>
      <Txt
        size={116}
        color={B.ink}
        style={{ position: "absolute", top: 530, opacity: pr(f, 10, 10) }}
      >
        {p.title}
      </Txt>
      <Txt
        size={56}
        weight={600}
        color={B.ink}
        style={{
          position: "absolute",
          left: 160,
          top: 1190,
          width: 340,
          opacity: pr(f, 58, 8),
        }}
      >
        {a}
      </Txt>
      <Txt
        size={56}
        weight={600}
        color={B.accent}
        style={{
          position: "absolute",
          left: 580,
          top: 1190,
          width: 340,
          opacity: pr(f, 64, 8),
        }}
      >
        {b}
      </Txt>
    </Paper>
  );
};

export const SketchOver: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  return (
    <Canvas>
      <Browser
        src={p.image ?? "demo/screen.webp"}
        w={960}
        h={640}
        style={{ left: 60, top: 560 }}
      />
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <Boil id="boil-b" f={f} />
        <g filter="url(#boil-b)">
          <Ink
            d={ellipse(700, 860, 220, 110, 4)}
            p={pr(f, 10, 18)}
            color="#FFD84D"
            w={9}
          />
          <Ink
            d={arrow(420, 1400, 600, 990, 0.25, 8)}
            p={pr(f, 30, 12)}
            color="#FFD84D"
            w={9}
          />
        </g>
      </svg>
      <Txt
        size={64}
        color="#FFD84D"
        style={{
          position: "absolute",
          top: 1420,
          rotate: "-3deg",
          opacity: pr(f, 40, 8),
          fontStyle: "italic",
        }}
      >
        {p.title}
      </Txt>
    </Canvas>
  );
};

export const PaperCutout: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const step = Math.floor(f / 3); // stop-motion: the picture changes every 3 frames
  const jig = (i: number, a = 3) => Math.sin(step * 12.9898 + i * 78.233) * a;
  const colors = ["#E8B04A", B.accent, "#E46A55", "#5AB58C"];
  return (
    <AbsoluteFill style={{ background: "#E9DFCC" }}>
      <Grain opacity={0.12} />
      {(p.items ?? []).map((t, i) => {
        const e = pr(Math.floor(f / 3) * 3, 4 + i * 8, 9);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 140 + (i % 2) * 330,
              top: 520 + Math.floor(i / 2) * 400,
              width: 300,
              height: 320,
              borderRadius: 18,
              background: colors[i % colors.length],
              boxShadow: "6px 10px 0 rgba(60,40,20,0.25)",
              rotate: `${jig(i, 4) + (i % 2 ? 3 : -3)}deg`,
              translate: `${jig(i + 5)}px ${(1 - e) * 900 + jig(i + 9)}px`,
              display: "grid",
              placeItems: "center",
              padding: 20,
            }}
          >
            <Txt size={50} color="#1E2B3A">
              {t}
            </Txt>
          </div>
        );
      })}
      <Txt
        size={92}
        color="#1E2B3A"
        style={{
          position: "absolute",
          top: SAFE.top + 40,
          rotate: `${jig(20, 1.5)}deg`,
        }}
      >
        {p.title}
      </Txt>
    </AbsoluteFill>
  );
};

export const Blueprint: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const blocks = [
    [140, 520, 800, 160],
    [140, 720, 380, 420],
    [560, 720, 380, 200],
    [560, 940, 380, 200],
    [140, 1180, 800, 120],
  ];
  const fill = pr(f, p.dur * 0.55, 16);
  return (
    <AbsoluteFill style={{ background: "#0B2A4A" }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        {blocks.map(([x, y, w, h], i) => {
          const e = pr(f, 4 + i * 6, 16);
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx={14}
                fill={`rgba(139,188,255,${0.25 * fill})`}
                stroke="#CFE3FF"
                strokeWidth={2}
                strokeDasharray="10 8"
                pathLength={1000}
                style={{ strokeDasharray: `${e * 1000} 1000` }}
              />
              <text
                x={x + 16}
                y={y + 34}
                fill="#CFE3FF"
                fontFamily={FONT}
                fontSize={22}
                opacity={e}
              >
                {`${w}×${h}`}
              </text>
            </g>
          );
        })}
        <line
          x1={140}
          y1={470}
          x2={140 + 800 * pr(f, 10, 20)}
          y2={470}
          stroke="#CFE3FF"
          strokeWidth={1.5}
        />
        <line
          x1={100}
          y1={520}
          x2={100}
          y2={520 + 780 * pr(f, 14, 20)}
          stroke="#CFE3FF"
          strokeWidth={1.5}
        />
      </svg>
      <Txt
        size={70}
        color="#FFFFFF"
        style={{ position: "absolute", top: 1370, ...reveal(f, { delay: 20 }) }}
      >
        {p.title}
      </Txt>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ انتقالات */

const SceneA: React.FC<{ text?: string }> = ({ text }) => (
  <Canvas>
    <Txt size={110} style={{ position: "absolute", top: 820 }}>
      {text}
    </Txt>
  </Canvas>
);
const SceneB: React.FC<{ text?: string }> = ({ text }) => (
  <AbsoluteFill
    style={{ background: `linear-gradient(160deg, ${B.accent}, #123C7A)` }}
  >
    <Txt size={110} style={{ position: "absolute", top: 820 }}>
      {text}
    </Txt>
  </AbsoluteFill>
);

export const WhipPan: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const mid = p.dur / 2;
  const t = interpolate(f, [mid - 6, mid + 6], [0, 1], {
    ...clamp,
    easing: (x) => x * x * (3 - 2 * x),
  });
  const blur = Math.sin(t * Math.PI) * 40;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <svg width={0} height={0}>
        <filter id="whip">
          <feGaussianBlur stdDeviation={`${blur} 0`} />
        </filter>
      </svg>
      <AbsoluteFill style={{ filter: "url(#whip)" }}>
        <AbsoluteFill style={{ translate: `${t * 1080}px 0px` }}>
          <SceneA text={p.items?.[0]} />
        </AbsoluteFill>
        <AbsoluteFill style={{ translate: `${(t - 1) * 1080}px 0px` }}>
          <SceneB text={p.items?.[1]} />
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ZoomThrough: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const mid = p.dur / 2;
  const z = interpolate(f, [mid - 14, mid + 4], [1, 26], {
    ...clamp,
    easing: (x) => x * x * x,
  });
  const inB = pr(f, mid, 14);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: B.bg900 }}>
      {f < mid + 4 ? (
        <Canvas>
          <div
            style={{
              position: "absolute",
              left: 540 - 120,
              top: 900 - 120,
              width: 240,
              height: 240,
              borderRadius: "50%",
              border: `10px solid ${B.accent}`,
              scale: String(z),
              opacity: 1,
            }}
          />
          <Txt
            size={100}
            style={{
              position: "absolute",
              top: 1160,
              opacity: 1 - (z - 1) / 4,
            }}
          >
            {p.items?.[0]}
          </Txt>
        </Canvas>
      ) : null}
      <AbsoluteFill style={{ opacity: inB, scale: String(1.2 - inB * 0.2) }}>
        <SceneB text={p.items?.[1]} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const CanvasCamera: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const items = p.items ?? [];
  const seg = p.dur / Math.max(1, items.length);
  // the camera moves 21 frames from panel to panel, with a slight pull-back and directional blur
  let x = 0;
  let pull = 0;
  for (let i = 1; i < items.length; i++) {
    const m = interpolate(f, [i * seg - 10, i * seg + 11], [0, 1], {
      ...clamp,
      easing: EASE,
    });
    x += m;
    pull = Math.max(pull, Math.sin(m * Math.PI));
  }
  return (
    <Canvas grid={0}>
      <svg width={0} height={0}>
        <filter id="cam">
          <feGaussianBlur stdDeviation={`${pull * 14} 0`} />
        </filter>
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: "url(#cam)",
          scale: String(1 - pull * 0.08),
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            height: 1920,
            width: 1240 * items.length,
            right: 0,
            translate: `${x * 1240}px 0px`,
            backgroundImage: `linear-gradient(${B.line} 1px, transparent 1px), linear-gradient(90deg, ${B.line} 1px, transparent 1px)`,
            backgroundSize: "120px 120px",
          }}
        >
          {items.map((t, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                right: i * 1240 + 140,
                top: 640,
                width: 800,
                height: 640,
                borderRadius: 40,
                background: "rgba(10,24,40,0.85)",
                border: `1.5px solid ${B.lineStrong}`,
                display: "grid",
                placeItems: "center",
              }}
            >
              <Txt size={96}>{t}</Txt>
            </div>
          ))}
        </div>
      </div>
    </Canvas>
  );
};

export const ShapeWipe: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const mid = p.dur / 2;
  const r = interpolate(f, [mid - 10, mid + 8], [0, 1200], {
    ...clamp,
    easing: EASE,
  });
  const r2 = interpolate(f, [mid - 4, mid + 14], [0, 1200], {
    ...clamp,
    easing: EASE,
  });
  return (
    <AbsoluteFill>
      <SceneA text={p.items?.[0]} />
      <AbsoluteFill
        style={{
          background: B.accentSoft,
          clipPath: `circle(${r}px at 50% 50%)`,
        }}
      />
      <AbsoluteFill style={{ clipPath: `circle(${r2}px at 50% 50%)` }}>
        <SceneB text={p.items?.[1]} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const LightLeak: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const mid = p.dur / 2;
  const a = interpolate(f, [mid - 12, mid, mid + 14], [0, 1, 0], clamp);
  const sweep = interpolate(f, [mid - 14, mid + 16], [-40, 120], clamp);
  return (
    <AbsoluteFill>
      {f < mid ? (
        <SceneA text={p.items?.[0]} />
      ) : (
        <SceneB text={p.items?.[1]} />
      )}
      <AbsoluteFill
        style={{
          mixBlendMode: "screen",
          opacity: a,
          background: `radial-gradient(60% 45% at ${sweep}% 40%, rgba(255,180,90,0.95), rgba(255,90,60,0.5) 40%, transparent 75%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: "#FFF6E8",
          opacity: interpolate(f, [mid - 2, mid, mid + 3], [0, 0.85, 0], clamp),
        }}
      />
    </AbsoluteFill>
  );
};

export const SplitSlide: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const mid = p.dur / 2;
  const strips = 6;
  return (
    <AbsoluteFill>
      <SceneA text={p.items?.[0]} />
      {Array.from({ length: strips }).map((_, i) => {
        const e = pr(f, mid - 10 + i * 2, 14);
        return (
          <AbsoluteFill
            key={i}
            style={{
              clipPath: `inset(0 ${((strips - 1 - i) * 100) / strips}% 0 ${(i * 100) / strips}%)`,
              translate: `0px ${(1 - e) * (i % 2 ? 1920 : -1920)}px`,
            }}
          >
            <SceneB text={p.items?.[1]} />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ المظهر اللوني */

// نفس الدرجات تُطبَّق على الفيديو الحقيقي عبر work/grade.sh (ffmpeg)، وهذه معاينة بـ CSS.
export const GRADES: [string, string][] = [
  [
    "تيل وبرتقالي",
    "sepia(0.18) saturate(1.25) hue-rotate(-8deg) contrast(1.1)",
  ],
  ["دافئ", "sepia(0.35) saturate(1.2) brightness(1.02)"],
  ["بارد", "hue-rotate(12deg) saturate(0.9) brightness(0.95) contrast(1.1)"],
  ["أبيض وأسود", "grayscale(1) contrast(1.25) brightness(0.95)"],
];

export const ColorGrades: React.FC<StyleProps> = (p) => (
  <AbsoluteFill style={{ background: B.bg900 }}>
    {GRADES.map(([name, filter], i) => (
      <AbsoluteFill
        key={name}
        style={{ clipPath: `inset(0 ${(3 - i) * 25}% 0 ${i * 25}%)`, filter }}
      >
        <Room blur={2} />
        <Person src={p.video} trim={p.trim} />
      </AbsoluteFill>
    ))}
    {GRADES.map(([name], i) => (
      <Pill
        key={name}
        size={34}
        style={{
          position: "absolute",
          top: 1520,
          left: i * 270 + 135,
          translate: "-50% 0",
          whiteSpace: "nowrap",
          padding: "10px 20px 14px",
        }}
      >
        {name}
      </Pill>
    ))}
    {[1, 2, 3].map((k) => (
      <div
        key={k}
        style={{
          position: "absolute",
          left: k * 270 - 1,
          top: 0,
          bottom: 0,
          width: 2,
          background: "rgba(255,255,255,0.6)",
        }}
      />
    ))}
  </AbsoluteFill>
);

export const FilmLook: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const bars = pr(f, 0, 16) * 230;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill
        style={{
          filter:
            "sepia(0.18) saturate(1.2) hue-rotate(-8deg) contrast(1.12) brightness(0.95)",
          scale: String(interpolate(f, [0, p.dur], [1.02, 1.08], clamp)),
        }}
      >
        <Room blur={2} />
        <Person src={p.video} trim={p.trim} />
      </AbsoluteFill>
      <Vignette strength={0.75} />
      <Grain opacity={0.18} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: bars,
          background: "#000",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: bars,
          background: "#000",
        }}
      />
      <Txt
        size={50}
        weight={500}
        color="#F2E6D0"
        style={{
          position: "absolute",
          bottom: bars + 60,
          letterSpacing: 2,
          opacity: pr(f, 18, 14),
        }}
      >
        {p.title}
      </Txt>
    </AbsoluteFill>
  );
};

export const Duotone: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: B.bg900 }}>
      <svg width={0} height={0}>
        <filter id="duo">
          <feColorMatrix
            type="matrix"
            values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0"
          />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.02 0.55" />
            <feFuncG type="table" tableValues="0.06 0.74" />
            <feFuncB type="table" tableValues="0.16 1" />
          </feComponentTransfer>
        </filter>
      </svg>
      <AbsoluteFill style={{ filter: "url(#duo)" }}>
        <Room blur={2} />
        <Person src={p.video} trim={p.trim} />
      </AbsoluteFill>
      <Txt
        size={130}
        style={{
          position: "absolute",
          top: SAFE.top + 40,
          mixBlendMode: "overlay",
          ...reveal(f),
        }}
      >
        {p.title}
      </Txt>
      <div
        style={{
          position: "absolute",
          bottom: SAFE.bottom,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          opacity: pr(f, 14, 12),
        }}
      >
        <Logo width={240} />
      </div>
    </AbsoluteFill>
  );
};

export const VideoFrame: React.FC<StyleProps> = (p) => (
  <AbsoluteFill style={{ background: B.bg900 }}>
    <Media src={p.video ?? p.image ?? "demo/room.jpg"} trim={p.trim} />
  </AbsoluteFill>
);
