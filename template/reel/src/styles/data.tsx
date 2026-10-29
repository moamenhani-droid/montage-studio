// أساليب الأرقام والرسوم البيانية، ومنها ثلاثية الأبعاد بالمحرك اليدوي.
// قاعدة: الرسوم تصعد دائماً من اليسار إلى اليمين، والأرقام حقيقية فقط (لا أرقام مختلقة).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { B, FONT, SAFE } from "../brand";
import { ar, Canvas, Txt } from "../engine/kit";
import { boxFaces, type Cam, depthSort, poly, project } from "../engine/three";
import { clamp, EASE, pr, reveal, stagger } from "../motion";
import type { StyleProps } from "./types";

const DEMO = [32, 45, 41, 58, 66, 79];

export const BarChart: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const vals = p.values ?? DEMO;
  const max = Math.max(...vals);
  return (
    <Canvas>
      <Txt
        size={78}
        style={{ position: "absolute", top: SAFE.top + 50, ...reveal(f) }}
      >
        {p.title}
      </Txt>
      <div
        style={{
          position: "absolute",
          left: 100,
          right: 100,
          top: 600,
          height: 640,
          display: "flex",
          alignItems: "flex-end",
          gap: 24,
        }}
      >
        {vals.map((v, i) => {
          const e = stagger(f, i, 8, 5, 18);
          const last = i === vals.length - 1;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 34,
                  fontWeight: 700,
                  color: last ? B.accentSoft : B.silver,
                  opacity: e,
                }}
              >
                {ar(Math.round(v * e))}
              </span>
              <div
                style={{
                  width: "100%",
                  height: `${(v / max) * 86 * e}%`,
                  borderRadius: "18px 18px 6px 6px",
                  background: last
                    ? `linear-gradient(180deg, ${B.accentSoft}, ${B.accent})`
                    : "rgba(139,188,255,0.22)",
                  boxShadow: last ? `0 0 40px ${B.glow}` : undefined,
                }}
              />
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 100,
          right: 100,
          top: 1250,
          height: 2,
          background: B.lineStrong,
        }}
      />
      <div
        dir="ltr"
        style={{
          position: "absolute",
          left: 100,
          right: 100,
          top: 1270,
          display: "flex",
          gap: 24,
        }}
      >
        {(p.items ?? []).map((t, i) => (
          <span
            key={i}
            style={{
              flex: 1,
              textAlign: "center",
              fontFamily: FONT,
              fontSize: 28,
              color: B.dim,
            }}
          >
            {t}
          </span>
        ))}
      </div>
      <Txt
        size={32}
        weight={500}
        color={B.dim}
        style={{ position: "absolute", top: 1380, opacity: pr(f, 30, 10) }}
      >
        {p.sub}
      </Txt>
    </Canvas>
  );
};

export const LineGrowth: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const vals = p.values ?? DEMO;
  const max = Math.max(...vals);
  const min = Math.min(...vals) * 0.7;
  const [x0, x1, y0, y1] = [110, 970, 1260, 640];
  const pts = vals.map((v, i) => [
    x0 + ((x1 - x0) * i) / (vals.length - 1),
    y0 - ((v - min) / (max - min)) * (y0 - y1),
  ]);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
  const e = pr(f, 6, p.dur * 0.55, EASE);
  const head = Math.min(pts.length - 1, e * (pts.length - 1));
  const k = Math.floor(head);
  const t = head - k;
  const hx =
    pts[k][0] + (pts[Math.min(k + 1, pts.length - 1)][0] - pts[k][0]) * t;
  const hy =
    pts[k][1] + (pts[Math.min(k + 1, pts.length - 1)][1] - pts[k][1]) * t;
  return (
    <Canvas>
      <Txt
        size={78}
        style={{ position: "absolute", top: SAFE.top + 50, ...reveal(f) }}
      >
        {p.title}
      </Txt>
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={B.accent} stopOpacity={0.35} />
            <stop offset="100%" stopColor={B.accent} stopOpacity={0} />
          </linearGradient>
          <clipPath id="grow">
            <rect x={0} y={0} width={hx} height={1920} />
          </clipPath>
        </defs>
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={x0}
            x2={x1}
            y1={y1 + ((y0 - y1) * i) / 3}
            y2={y1 + ((y0 - y1) * i) / 3}
            stroke={B.line}
            strokeWidth={1.5}
          />
        ))}
        <g clipPath="url(#grow)">
          <path d={`${d} L ${x1} ${y0} L ${x0} ${y0} Z`} fill="url(#area)" />
          <path
            d={d}
            fill="none"
            stroke={B.accent}
            strokeWidth={8}
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 14px ${B.glow})` }}
          />
        </g>
        <circle
          cx={hx}
          cy={hy}
          r={16}
          fill={B.text}
          stroke={B.accent}
          strokeWidth={6}
        />
      </svg>
      <Txt
        size={140}
        color={B.accentSoft}
        style={{
          position: "absolute",
          top: 1340,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {p.sub ?? ""}
      </Txt>
    </Canvas>
  );
};

export const Donut: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const pct = p.values?.[0] ?? 68;
  const e = pr(f, 6, p.dur * 0.5);
  const C = 2 * Math.PI * 300;
  return (
    <Canvas>
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <circle
          cx={540}
          cy={900}
          r={300}
          fill="none"
          stroke="rgba(139,188,255,0.14)"
          strokeWidth={60}
        />
        <circle
          cx={540}
          cy={900}
          r={300}
          fill="none"
          stroke={B.accent}
          strokeWidth={60}
          strokeLinecap="round"
          strokeDasharray={`${(C * pct * e) / 100} ${C}`}
          transform="rotate(-90 540 900)"
          style={{ filter: `drop-shadow(0 0 24px ${B.glow})` }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 780,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 200,
          lineHeight: 1,
          color: B.text,
        }}
      >
        {ar(Math.round(pct * e))}
        <span style={{ fontSize: 110, color: B.accentSoft }}>٪</span>
      </div>
      <Txt
        size={64}
        style={{
          position: "absolute",
          top: 1300,
          padding: "0 100px",
          ...reveal(f, { delay: 14 }),
        }}
      >
        {p.title}
      </Txt>
    </Canvas>
  );
};

export const Bars3D: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const vals = p.values ?? [110, 210, 330, 470];
  const t = f / Math.max(1, p.dur);
  const cam: Cam = {
    yaw: interpolate(t, [0, 1], [-0.55, -0.3], clamp),
    pitch: 0.46,
    dist: interpolate(t, [0, 1], [1700, 1560], clamp),
    focal: 1280,
    cx: 560,
    cy: 1050,
  };
  const n = vals.length;
  const faces = depthSort(
    vals.flatMap((h, i) => {
      const e = pr(f, 6 + i * 6, 18);
      const last = i === n - 1;
      return boxFaces(cam, {
        x: (i - (n - 1) / 2) * 210,
        z: 0,
        w: 130,
        d: 130,
        h: h * e,
        top: last ? B.accentSoft : "#5C7EA6",
        front: last ? B.accent : B.steel,
        side: last ? "#2A66C8" : B.surface,
      });
    }),
  );
  const grid: React.ReactNode[] = [];
  for (let i = -5; i <= 5; i++) {
    const a = project(cam, [i * 120, 0, -600]);
    const b = project(cam, [i * 120, 0, 600]);
    const c = project(cam, [-600, 0, i * 120]);
    const d = project(cam, [600, 0, i * 120]);
    grid.push(
      <line
        key={`a${i}`}
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke={B.line}
        strokeWidth={1.5}
      />,
      <line
        key={`b${i}`}
        x1={c.x}
        y1={c.y}
        x2={d.x}
        y2={d.y}
        stroke={B.line}
        strokeWidth={1.5}
      />,
    );
  }
  return (
    <Canvas grid={0}>
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <g opacity={pr(f, 0, 14)}>{grid}</g>
        {faces.map((fc, i) => (
          <polygon
            key={i}
            points={poly(fc.pts)}
            fill={fc.fill}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={1}
          />
        ))}
      </svg>
      <Txt
        size={78}
        style={{ position: "absolute", top: SAFE.top + 50, ...reveal(f) }}
      >
        {p.title}
      </Txt>
    </Canvas>
  );
};

export const Cubes3D: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const cam: Cam = {
    yaw: -0.7 + f * 0.004,
    pitch: 0.6,
    dist: 1900,
    focal: 1300,
    cx: 540,
    cy: 1020,
  };
  const cells = Array.from({ length: 9 }, (_, i) => ({
    x: (i % 3) - 1,
    z: Math.floor(i / 3) - 1,
    i,
  }));
  // painter's order per box (boxes on a grid never interpenetrate), then each box's visible faces
  const faces = cells
    .map((c) => ({ c, depth: project(cam, [c.x * 230, 80, c.z * 230]).z }))
    .sort((a, b) => b.depth - a.depth)
    .flatMap(({ c }) => {
      const e = pr(f, 4 + c.i * 3, 16);
      const hero = c.i === 4;
      return boxFaces(cam, {
        x: c.x * 230,
        z: c.z * 230,
        y: (1 - e) * 500,
        w: 170,
        d: 170,
        h: hero ? 170 + pr(f, 40, 16) * 150 : 170,
        top: hero ? B.accentSoft : "#8EA3BC",
        front: hero ? B.accent : B.steel,
        side: hero ? "#2A66C8" : B.surface,
      }).map((fc) => ({ ...fc, op: e }));
    });
  return (
    <Canvas grid={0.5}>
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        {faces.map((fc, i) => (
          <polygon
            key={i}
            points={poly(fc.pts)}
            fill={fc.fill}
            opacity={fc.op}
            stroke="rgba(255,255,255,0.14)"
            strokeWidth={1}
          />
        ))}
      </svg>
      <Txt
        size={78}
        style={{
          position: "absolute",
          top: SAFE.top + 50,
          ...reveal(f, { delay: 10 }),
        }}
      >
        {p.title}
      </Txt>
    </Canvas>
  );
};

export const StatGrid: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const vals = p.values ?? [];
  const labels = p.items ?? [];
  return (
    <Canvas>
      <Txt
        size={72}
        style={{ position: "absolute", top: SAFE.top + 50, ...reveal(f) }}
      >
        {p.title}
      </Txt>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 560,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 30,
        }}
      >
        {vals.map((v, i) => {
          const e = stagger(f, i, 6, 6, 16);
          const n = Math.round(
            interpolate(f, [8 + i * 6, 8 + i * 6 + 30], [0, v], {
              ...clamp,
              easing: EASE,
            }),
          );
          return (
            <div
              key={i}
              style={{
                height: 330,
                borderRadius: 40,
                padding: 40,
                background:
                  i === 0
                    ? `linear-gradient(160deg, ${B.accent}, #1F5FC8)`
                    : "rgba(10,24,40,0.85)",
                border: `1.5px solid ${B.lineStrong}`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                opacity: e,
                scale: String(0.9 + e * 0.1),
              }}
            >
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 120,
                  fontWeight: 700,
                  color: B.text,
                  lineHeight: 1,
                }}
              >
                {ar(n)}
              </span>
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 38,
                  fontWeight: 500,
                  color: i === 0 ? B.text : B.silver,
                }}
              >
                {labels[i]}
              </span>
            </div>
          );
        })}
      </div>
    </Canvas>
  );
};
