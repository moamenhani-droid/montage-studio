// أساليب الوجه والكابشن: فوق لقطة المتحدث (overlay) أو تعيد تركيبها (full).
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { B, FONT, SAFE } from "../brand";
import {
  Canvas,
  Icon,
  type IconName,
  Logo,
  Media,
  Person,
  Pill,
  Room,
  Txt,
} from "../engine/kit";
import { clamp, EASE, pr, reveal, stagger } from "../motion";
import { spokenIndex, type StyleProps, wordsOf } from "./types";

/** مجموعة الكلمات الحالية (٢–٤ كلمات) لتظهر كسطر كابشن واحد */
const groupAt = (n: number, k: number, size = 3) => {
  const g = Math.max(0, Math.floor(Math.max(0, k) / size));
  return [g * size, Math.min(n, g * size + size)] as const;
};

export const FaceCaption: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const ws = wordsOf(p);
  const k = spokenIndex(ws, f);
  if (k < 0) return null;
  const [a, b] = groupAt(ws.length, k);
  const enter = pr(f, ws[a].t - 2, 6);
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: SAFE.bottom + 60,
      }}
    >
      <Pill
        style={{
          opacity: enter,
          scale: String(0.94 + enter * 0.06),
          maxWidth: 1080 - SAFE.left - SAFE.right,
          textAlign: "center",
        }}
      >
        {ws.slice(a, b).map((w, i) => (
          <span
            key={i}
            style={{
              color:
                a + i === k || p.keys?.includes(a + i) ? B.accentSoft : B.text,
              opacity: a + i <= k ? 1 : 0.35,
            }}
          >
            {w.text}{" "}
          </span>
        ))}
      </Pill>
    </AbsoluteFill>
  );
};

export const WordPop: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const ws = wordsOf(p);
  const k = spokenIndex(ws, f);
  if (k < 0) return null;
  const pop = interpolate(f - ws[k].t, [0, 4, 8], [0.7, 1.08, 1], clamp);
  const key = p.keys?.includes(k);
  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", top: 560 }}
    >
      <Txt
        size={key ? 150 : 128}
        color={key ? B.accentSoft : B.text}
        style={{
          scale: String(pop),
          textShadow: "0 6px 0 rgba(0,0,0,0.55), 0 14px 40px rgba(0,0,0,0.5)",
          WebkitTextStroke: "3px rgba(5,11,20,0.9)",
          paintOrder: "stroke fill",
        }}
      >
        {ws[k].text}
      </Txt>
    </AbsoluteFill>
  );
};

export const Karaoke: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const all = wordsOf(p);
  const k0 = spokenIndex(all, f);
  const [a, b] = groupAt(all.length, k0, 6); // long scenes: one 6-word line at a time
  const ws = all.slice(a, b);
  const k = k0 - a;
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: SAFE.bottom + 40,
      }}
    >
      <div
        style={{
          maxWidth: 860,
          padding: "22px 36px",
          borderRadius: 30,
          background: "rgba(8,19,31,0.78)",
          ...reveal(f, { frames: 10 }),
        }}
      >
        <Txt size={58}>
          {ws.map((w, i) => {
            const fill = i < k ? 1 : i === k ? pr(f, w.t, 8) : 0;
            return (
              <span
                key={i}
                style={{
                  backgroundImage: `linear-gradient(270deg, ${B.accentSoft} ${fill * 100}%, rgba(255,255,255,0.45) ${fill * 100}%)`,
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                {w.text}{" "}
              </span>
            );
          })}
        </Txt>
      </div>
    </AbsoluteFill>
  );
};

export const MarkerHighlight: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const ws = wordsOf(p);
  const k = spokenIndex(ws, f);
  const keys = p.keys ?? [ws.length - 1];
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: SAFE.bottom + 60,
      }}
    >
      <Txt
        size={68}
        style={{ maxWidth: 860, textShadow: "0 4px 24px rgba(0,0,0,0.7)" }}
      >
        {ws.map((w, i) => {
          const hl = keys.includes(i) ? pr(f, w.t, 8) : 0;
          return (
            <span
              key={i}
              style={{
                opacity: i <= k ? 1 : 0,
                padding: "0 8px",
                margin: "0 4px",
                display: "inline-block",
                backgroundImage: `linear-gradient(${B.accent}, ${B.accent})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 60%",
                backgroundSize: `${hl * 100}% 62%`,
                borderRadius: 10,
              }}
            >
              {w.text}
            </span>
          );
        })}
      </Txt>
    </AbsoluteFill>
  );
};

export const TextBehind: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const t = pr(f, 4, 18);
  return (
    <AbsoluteFill style={{ background: B.bg900 }}>
      <Room />
      <Txt
        size={300}
        style={{
          position: "absolute",
          top: 430,
          width: "100%",
          lineHeight: 1,
          opacity: t,
          scale: String(0.9 + t * 0.1),
          textShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {p.title}
      </Txt>
      <Person src={p.video} trim={p.trim} />
      {p.sub ? (
        <div
          style={{
            position: "absolute",
            top: 1340,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            ...reveal(f, { delay: 14 }),
          }}
        >
          <Pill>{p.sub}</Pill>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const LowerThird: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const bar = pr(f, 4, 14);
  const txt = pr(f, 10, 14);
  const out = pr(f, p.dur - 12, 10);
  return (
    <AbsoluteFill>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          right: SAFE.left,
          bottom: SAFE.bottom + 100,
          display: "flex",
          alignItems: "stretch",
          opacity: 1 - out,
          clipPath: `inset(0 0 0 ${(1 - bar) * 100}%)`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        }}
      >
        <div style={{ width: 12, background: B.accent }} />
        <div
          style={{
            padding: "22px 36px",
            background: "rgba(8,19,31,0.92)",
            fontFamily: FONT,
            translate: `${(1 - txt) * 30}px 0px`,
            opacity: txt,
          }}
        >
          <div style={{ fontSize: 58, fontWeight: 700, color: B.text }}>
            {p.title}
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 500,
              color: B.accentSoft,
              marginTop: 4,
            }}
          >
            {p.sub}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const PunchZoom: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const at = p.values?.[0] ?? Math.round(p.dur * 0.45);
  const s = f < at ? 1.08 : 1.34 + pr(f, at, 30) * 0.03;
  return (
    <AbsoluteFill style={{ background: B.bg900, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(s), transformOrigin: "52% 30%" }}>
        <Room />
        <Person src={p.video} trim={p.trim} scale={1} />
      </AbsoluteFill>
      {f >= at && p.title ? (
        <div
          style={{
            position: "absolute",
            top: SAFE.top + 60,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            ...reveal(f, { delay: at, frames: 6, rise: 10 }),
          }}
        >
          <Pill size={70}>{p.title}</Pill>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const SlowPush: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, p.dur], [1.04, 1.18], clamp);
  return (
    <AbsoluteFill style={{ background: B.bg900, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(1 + (s - 1) * 0.4) }}>
        <Room />
      </AbsoluteFill>
      <Person src={p.video} trim={p.trim} scale={s} />
    </AbsoluteFill>
  );
};

export const SplitScreen: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const t = pr(f, 0, 16);
  return (
    <AbsoluteFill style={{ background: B.bg900 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 960,
          overflow: "hidden",
          translate: `0px ${(1 - t) * -200}px`,
        }}
      >
        <Canvas>
          <Media
            src={p.image ?? "demo/screen.webp"}
            fit="cover"
            style={{
              inset: 60,
              width: 960,
              height: 840,
              borderRadius: 24,
              objectPosition: "top",
            }}
          />
        </Canvas>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 960,
          height: 960,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: -560,
            width: 1080,
            height: 1920,
          }}
        >
          <Room />
          <Person src={p.video} trim={p.trim} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 956,
          height: 8,
          background: B.accent,
          scale: `${t} 1`,
        }}
      />
    </AbsoluteFill>
  );
};

export const PipCircle: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const t = pr(f, 6, 14);
  const r = 190;
  return (
    <AbsoluteFill>
      <Canvas>
        <Media
          src={p.image ?? "demo/screen.webp"}
          style={{
            left: 60,
            top: 300,
            width: 960,
            height: 1100,
            borderRadius: 24,
            objectPosition: "top",
          }}
        />
      </Canvas>
      <div
        style={{
          position: "absolute",
          right: 70,
          bottom: SAFE.bottom,
          width: r * 2,
          height: r * 2,
          borderRadius: "50%",
          overflow: "hidden",
          border: `6px solid ${B.text}`,
          boxShadow: `0 0 0 8px ${B.accent}, 0 30px 80px rgba(0,0,0,0.6)`,
          opacity: t,
          scale: String(0.8 + t * 0.2),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: r - 590 * 0.48,
            top: r - 700 * 0.48,
            width: 1080,
            height: 1920,
            scale: "0.48",
            transformOrigin: "0 0",
          }}
        >
          <Room />
          <Person src={p.video} trim={p.trim} scale={1} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BackgroundSwap: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [8, p.dur - 10], [1080, 0], {
    ...clamp,
    easing: EASE,
  });
  return (
    <AbsoluteFill style={{ background: B.bg900 }}>
      <Media
        src={p.image ?? "demo/room.jpg"}
        style={{ filter: "saturate(0.7) brightness(0.8)" }}
      />
      <Person src={p.video} trim={p.trim} />
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${x}px)` }}>
        <Canvas />
        <Person src={p.video} trim={p.trim} />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: x - 2,
          top: 0,
          bottom: 0,
          width: 4,
          background: B.text,
          boxShadow: `0 0 30px ${B.glow}`,
        }}
      />
      <Pill size={44} style={{ position: "absolute", top: SAFE.top, left: 60 }}>
        قبل
      </Pill>
      <Pill
        size={44}
        style={{
          position: "absolute",
          top: SAFE.top,
          right: 60,
          background: B.accent,
        }}
      >
        بعد
      </Pill>
    </AbsoluteFill>
  );
};

export const IconCallout: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const icons: IconName[] = ["code", "phone", "bag", "cpu", "palette", "zap"];
  const spots = [
    [90, 520],
    [800, 600],
    [110, 900],
    [810, 980],
  ];
  return (
    <AbsoluteFill>
      {(p.items ?? []).slice(0, 4).map((t, i) => {
        const e = stagger(f, i, 4, 8, 12);
        const [x, y] = spots[i];
        return (
          <div
            key={i}
            dir="rtl"
            style={{
              position: "absolute",
              left: x,
              top: y,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              opacity: e,
              scale: String(0.6 + e * 0.4),
              translate: `0px ${Math.sin((f + i * 20) / 18) * 6}px`,
            }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 34,
                background: "rgba(8,19,31,0.85)",
                border: `2px solid ${B.lineStrong}`,
                display: "grid",
                placeItems: "center",
                boxShadow: `0 0 40px ${B.glow}`,
              }}
            >
              <Icon
                name={icons[i % icons.length]}
                size={64}
                color={B.accentSoft}
              />
            </div>
            <Pill
              size={32}
              style={{ padding: "6px 18px 10px", borderRadius: 16 }}
            >
              {t}
            </Pill>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const HookQuestion: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const ws = wordsOf(p, 2, p.dur * 0.4);
  const k = spokenIndex(ws, f);
  const line = pr(f, (ws[ws.length - 1]?.t ?? 0) + 2, 12);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: SAFE.top + 20 }}>
      <Txt
        size={104}
        style={{ maxWidth: 900, textShadow: "0 8px 40px rgba(0,0,0,0.7)" }}
      >
        {ws.map((w, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginLeft: 22,
              opacity: i <= k ? 1 : 0,
              translate: `0px ${i <= k ? (1 - pr(f, w.t, 6)) * 30 : 30}px`,
              color: p.keys?.includes(i) ? B.accentSoft : B.text,
            }}
          >
            {w.text}
          </span>
        ))}
      </Txt>
      <div
        style={{
          width: 420,
          height: 10,
          marginTop: 16,
          borderRadius: 5,
          background: B.accent,
          scale: `${line} 1`,
          transformOrigin: "right",
        }}
      />
    </AbsoluteFill>
  );
};

export const ProgressBar: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const items = p.items ?? [];
  const w = 1080 - 2 * 60;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 150,
          width: w,
          height: 10,
          borderRadius: 5,
          background: "rgba(255,255,255,0.22)",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: `${(f / p.dur) * 100}%`,
            borderRadius: 5,
            background: B.accent,
            boxShadow: `0 0 20px ${B.glow}`,
          }}
        />
        {items.map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              right: `${((i + 1) / (items.length + 1)) * 100}%`,
              top: -4,
              width: 4,
              height: 18,
              background: B.text,
            }}
          />
        ))}
      </div>
      {items.length ? (
        <Txt
          size={30}
          weight={600}
          style={{
            position: "absolute",
            top: 176,
            right: 60,
            width: "auto",
            opacity: 0.9,
          }}
        >
          {
            items[
              Math.min(items.length - 1, Math.floor((f / p.dur) * items.length))
            ]
          }
        </Txt>
      ) : null}
    </AbsoluteFill>
  );
};

export const CtaChip: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const e = pr(f, 4, 14);
  const tap = Math.max(0, Math.sin(((f - 24) / 30) * Math.PI * 2));
  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: SAFE.bottom + 40,
      }}
    >
      <div
        dir="rtl"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "26px 46px",
          borderRadius: 60,
          background: B.accent,
          boxShadow: `0 0 0 ${tap * 16}px rgba(61,139,255,${0.35 - tap * 0.2}), 0 20px 60px rgba(0,0,0,0.5)`,
          fontFamily: FONT,
          fontSize: 54,
          fontWeight: 700,
          color: B.text,
          opacity: e,
          scale: String((0.85 + e * 0.15) * (1 - tap * 0.03)),
        }}
      >
        <Icon name="send" size={50} color={B.text} />
        {p.title}
      </div>
      {p.sub ? (
        <Txt
          size={34}
          weight={500}
          color={B.silver}
          style={{ marginTop: 18, ...reveal(f, { delay: 12 }) }}
        >
          {p.sub}
        </Txt>
      ) : null}
    </AbsoluteFill>
  );
};

export const PopOut: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const e = pr(f, 0, 18);
  return (
    <Canvas>
      <div
        style={{
          position: "absolute",
          left: 110,
          right: 110,
          top: 640,
          height: 1000,
          borderRadius: 40,
          overflow: "hidden",
          border: `4px solid ${B.text}`,
          scale: String(0.9 + e * 0.1),
        }}
      >
        <Media
          src={p.image ?? "demo/room.jpg"}
          style={{ filter: "blur(2px) brightness(0.85)" }}
        />
      </div>
      {/* the person is not clipped by the card: head and shoulders break out of the frame */}
      <AbsoluteFill
        style={{
          clipPath: "inset(0 0 280px 0)",
          translate: `0px ${(1 - e) * 80}px`,
        }}
      >
        <Person src={p.video} trim={p.trim} scale={1.02} />
      </AbsoluteFill>
      {p.title ? (
        <Txt
          size={84}
          style={{
            position: "absolute",
            top: SAFE.top + 20,
            ...reveal(f, { delay: 10 }),
          }}
        >
          {p.title}
        </Txt>
      ) : null}
      <div
        style={{
          position: "absolute",
          top: 1700,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          opacity: pr(f, 16, 12),
        }}
      >
        <Logo width={260} />
      </div>
    </Canvas>
  );
};
