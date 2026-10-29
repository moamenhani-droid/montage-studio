// أساليب الطباعة الحركية: النص هو التصميم.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { B, BRAND, FONT, TYPE } from "../brand";
import { ar, Canvas, KineticLine, Logo, Txt } from "../engine/kit";
import { clamp, pr, reveal, stagger } from "../motion";
import { spokenIndex, type StyleProps, wordsOf } from "./types";

export const Kinetic: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const all = wordsOf(p);
  // long scenes are shown one chunk (≤ 10 words, broken at punctuation) at a time
  const chunks: number[] = [0];
  all.forEach((w, i) => {
    const len = i + 1 - chunks[chunks.length - 1];
    if (
      i < all.length - 1 &&
      (len >= 10 || (len >= 5 && /[،.؟…]$/.test(w.text)))
    )
      chunks.push(i + 1);
  });
  const k0 = spokenIndex(all, f);
  const c = chunks.filter((x) => x <= Math.max(0, k0)).length - 1;
  const ws = all.slice(chunks[c], chunks[c + 1] ?? all.length);
  const drift = interpolate(f, [0, p.dur], [1, 1.04], clamp);
  return (
    <Canvas>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          padding: "0 90px",
          scale: String(drift),
        }}
      >
        <KineticLine
          words={ws.map((w) => w.text)}
          upTo={spokenIndex(ws, f)}
          keys={(p.keys ?? []).map((x) => x - chunks[c])}
          size={TYPE.h1}
        />
      </AbsoluteFill>
    </Canvas>
  );
};

export const BigNumber: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const target = p.values?.[0] ?? 100;
  const n = Math.round(
    interpolate(f, [6, p.dur * 0.6], [0, target], {
      ...clamp,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    }),
  );
  return (
    <Canvas>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Txt size={34} weight={500} color={B.dim} style={reveal(f)}>
          {p.sub}
        </Txt>
        <div
          dir="rtl"
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 330,
            lineHeight: 1,
            color: B.text,
            fontVariantNumeric: "tabular-nums",
            textShadow: `0 0 80px ${B.glow}`,
          }}
        >
          {ar(n)}
          <span style={{ color: B.accentSoft, fontSize: 200 }}>
            {p.items?.[0] ?? ""}
          </span>
        </div>
        <Txt size={TYPE.h2} style={reveal(f, { delay: 10 })}>
          {p.title}
        </Txt>
      </AbsoluteFill>
    </Canvas>
  );
};

export const OutlineFill: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const fill = pr(f, 10, Math.max(20, p.dur * 0.5));
  const text = p.title ?? "";
  const base: React.CSSProperties = {
    position: "absolute",
    top: 760,
    width: "100%",
    textAlign: "center",
    fontFamily: FONT,
    fontWeight: 700,
    fontSize: 210,
    lineHeight: 1,
  };
  return (
    <Canvas>
      <div
        dir="rtl"
        style={{
          ...base,
          color: "transparent",
          WebkitTextStroke: `3px ${B.silver}`,
          ...reveal(f, { frames: 12 }),
        }}
      >
        {text}
      </div>
      <div
        dir="rtl"
        style={{
          ...base,
          color: B.text,
          clipPath: `inset(0 0 0 ${(1 - fill) * 100}%)`,
          textShadow: `0 0 50px ${B.glow}`,
        }}
      >
        {text}
      </div>
      <Txt
        size={44}
        weight={500}
        color={B.accentSoft}
        style={{ position: "absolute", top: 1040, ...reveal(f, { delay: 24 }) }}
      >
        {p.sub}
      </Txt>
    </Canvas>
  );
};

export const Editorial: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const lines = p.items ?? [];
  return (
    <AbsoluteFill style={{ background: "#EFEAE0" }}>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          top: 260,
          right: 80,
          left: 80,
          fontFamily: FONT,
          fontWeight: 700,
          color: "#0E1F33",
          lineHeight: 1,
        }}
      >
        <div
          style={{
            fontSize: 56,
            color: "#8A6C3E",
            fontWeight: 600,
            ...reveal(f),
          }}
        >
          {p.sub}
        </div>
        {lines.map((l, i) => {
          const e = stagger(f, i, 6, 6, 14);
          return (
            <div key={i} style={{ overflow: "hidden", paddingBottom: 12 }}>
              <div
                style={{
                  fontSize: 200,
                  translate: `0px ${(1 - e) * 210}px`,
                  color:
                    i % 3 === 1
                      ? "transparent"
                      : i === lines.length - 1
                        ? B.accent
                        : "#0E1F33",
                  WebkitTextStroke: i % 3 === 1 ? "4px #0E1F33" : undefined,
                }}
              >
                {l}
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1440,
          height: 3,
          background: "#0E1F33",
          scale: `${pr(f, 20, 20)} 1`,
          transformOrigin: "right",
        }}
      />
      <div
        dir="rtl"
        style={{
          position: "absolute",
          top: 1470,
          right: 80,
          left: 80,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: FONT,
          fontSize: 34,
          color: "#0E1F33",
          opacity: pr(f, 28, 12),
        }}
      >
        <span>{p.title}</span>
        <span>{BRAND.name}</span>
      </div>
    </AbsoluteFill>
  );
};

export const Typewriter: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const text = p.title ?? "";
  const n = Math.floor(
    interpolate(f, [4, 4 + text.length * 2.2], [0, text.length], clamp),
  );
  const caret = Math.floor(f / 8) % 2 === 0;
  return (
    <Canvas>
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 100px" }}>
        <div
          dir="rtl"
          style={{
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 96,
            color: B.text,
            lineHeight: 1.3,
            textAlign: "right",
          }}
        >
          {text.slice(0, n)}
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 100,
              marginRight: 8,
              verticalAlign: "middle",
              background: B.accent,
              opacity: caret || n < text.length ? 1 : 0,
            }}
          />
        </div>
        <Txt
          size={40}
          weight={500}
          color={B.dim}
          center={false}
          style={{
            marginTop: 30,
            opacity: n >= text.length ? pr(f, 4 + text.length * 2.2, 10) : 0,
          }}
        >
          {p.sub}
        </Txt>
      </AbsoluteFill>
    </Canvas>
  );
};

export const MaskReveal: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const ws = wordsOf(p, 4, p.dur * 0.4);
  return (
    <Canvas>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 80px",
        }}
      >
        <div
          dir="rtl"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 28px",
          }}
        >
          {ws.map((w, i) => {
            const e = pr(f, w.t, 12);
            return (
              <div key={i} style={{ overflow: "hidden", paddingBottom: 14 }}>
                <div
                  style={{
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: 140,
                    lineHeight: 1.1,
                    color: p.keys?.includes(i) ? B.accentSoft : B.text,
                    translate: `0px ${(1 - e) * 160}px`,
                    rotate: `${(1 - e) * 6}deg`,
                  }}
                >
                  {w.text}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Canvas>
  );
};

export const WordWall: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const word = p.title ?? "";
  const rows = 9;
  return (
    <AbsoluteFill
      style={{
        background: B.bg900,
        overflow: "hidden",
        justifyContent: "center",
      }}
    >
      {Array.from({ length: rows }).map((_, r) => {
        const mid = r === Math.floor(rows / 2);
        const dir = r % 2 ? 1 : -1;
        return (
          <div
            key={r}
            dir="rtl"
            style={{
              display: "flex",
              justifyContent: "center",
              whiteSpace: "nowrap",
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 170,
              lineHeight: 1.12,
              translate: `${mid ? f * 0.6 : dir * (f * 3 + r * 140)}px 0px`,
              color: mid ? B.accentSoft : "transparent",
              WebkitTextStroke: mid
                ? undefined
                : `2px rgba(201,211,222,${0.5 - Math.abs(r - rows / 2) * 0.08})`,
              textShadow: mid ? `0 0 60px ${B.glow}` : undefined,
            }}
          >
            <span>{mid ? word : `${word} · `.repeat(7)}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const StrikeReplace: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const [from = "", to = ""] = p.items ?? [];
  const strike = pr(f, 14, 10);
  const next = pr(f, 28, 14);
  return (
    <Canvas>
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", gap: 40 }}
      >
        <Txt size={46} weight={500} color={B.dim} style={reveal(f)}>
          {p.title}
        </Txt>
        <div style={{ position: "relative" }}>
          <Txt size={120} color={B.silver} style={{ opacity: 1 - next * 0.6 }}>
            {from}
          </Txt>
          <div
            style={{
              position: "absolute",
              right: -20,
              left: -20,
              top: "54%",
              height: 12,
              borderRadius: 6,
              background: B.red,
              scale: `${strike} 1`,
              transformOrigin: "right",
              rotate: "-3deg",
            }}
          />
        </div>
        <Txt
          size={140}
          color={B.accentSoft}
          style={{
            opacity: next,
            scale: String(0.9 + next * 0.1),
            textShadow: `0 0 60px ${B.glow}`,
          }}
        >
          {to}
        </Txt>
      </AbsoluteFill>
    </Canvas>
  );
};

export const GlitchNeon: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const burst = f % 24 < 4 || (f > 10 && f < 14);
  const j = burst ? ((f * 37) % 13) - 6 : 0;
  return (
    <AbsoluteFill style={{ background: "#03060C", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 2px, transparent 2px 6px)",
        }}
      />
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        {Array.from({ length: 14 }).map((_, i) => (
          <line
            key={i}
            x1={540}
            y1={1250}
            x2={-400 + i * 140}
            y2={1920}
            stroke="rgba(61,139,255,0.35)"
            strokeWidth={2}
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => {
          const y = 1290 + ((i * i * 12 + f * 2) % 640);
          return (
            <line
              key={`h${i}`}
              x1={0}
              y1={y}
              x2={1080}
              y2={y}
              stroke="rgba(61,139,255,0.3)"
              strokeWidth={2}
            />
          );
        })}
      </svg>
      {(
        [
          ["#FF2E88", -6 - j],
          ["#22D3EE", 6 + j],
          ["#FFFFFF", 0],
        ] as const
      ).map(([c, dx], i) => (
        <div
          key={i}
          dir="rtl"
          style={{
            position: "absolute",
            top: 640,
            width: "100%",
            textAlign: "center",
            translate: `${dx}px 0px`,
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 200,
            color: c,
            mixBlendMode: i < 2 ? "screen" : "normal",
            opacity: i < 2 ? 0.75 : 1,
            textShadow:
              i === 2
                ? `0 0 40px ${B.accent}, 0 0 90px ${B.accent}`
                : undefined,
          }}
        >
          {p.title}
        </div>
      ))}
      {burst ? (
        <div
          style={{
            position: "absolute",
            top: 700 + j * 20,
            left: 0,
            right: 0,
            height: 18,
            background: "rgba(34,211,238,0.5)",
            mixBlendMode: "screen",
          }}
        />
      ) : null}
      <Txt
        size={44}
        weight={500}
        color={B.accentSoft}
        style={{ position: "absolute", top: 1010 }}
      >
        {p.sub}
      </Txt>
    </AbsoluteFill>
  );
};

export const SloganLockup: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const parts = (p.title ?? "").split("،");
  return (
    <Canvas focus={[50, 46]}>
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", gap: 60 }}
      >
        <div
          style={{
            opacity: pr(f, 0, 16),
            scale: String(0.92 + pr(f, 0, 20) * 0.08),
          }}
        >
          <Logo width={360} />
        </div>
        <div
          dir="rtl"
          style={{
            display: "flex",
            gap: 30,
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 120,
          }}
        >
          {parts.map((t, i) => (
            <span
              key={i}
              style={{
                color: i === parts.length - 1 ? B.accentSoft : B.text,
                ...reveal(f, { delay: 14 + i * 10, rise: 40 }),
              }}
            >
              {t.trim()}
              {i < parts.length - 1 ? "،" : ""}
            </span>
          ))}
        </div>
        <div
          style={{
            width: 120,
            height: 4,
            background: B.accent,
            scale: `${pr(f, 34, 14)} 1`,
          }}
        />
      </AbsoluteFill>
    </Canvas>
  );
};
