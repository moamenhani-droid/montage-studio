// أساليب الواجهات والعناصر: بطاقات، محادثات، أجهزة، مراحل، هوية، وشاشة ختامية.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { B, BRAND, FONT, SAFE } from "../brand";
import {
  ar,
  Browser,
  Canvas,
  Icon,
  type IconName,
  Logo,
  Media,
  Phone,
  Pill,
  Txt,
} from "../engine/kit";
import { clamp, EASE, pr, reveal, stagger } from "../motion";
import type { StyleProps } from "./types";

const ICONS: IconName[] = [
  "code",
  "phone",
  "bag",
  "grid",
  "cpu",
  "zap",
  "palette",
  "layers",
];

export const IconCards: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const items = p.items ?? [];
  return (
    <Canvas>
      <Txt
        size={70}
        style={{
          position: "absolute",
          top: SAFE.top + 40,
          padding: "0 80px",
          ...reveal(f),
        }}
      >
        {p.title}
      </Txt>
      {items.map((t, i) => {
        const e = stagger(f, i, 8, 7, 16);
        return (
          <div
            key={i}
            dir="rtl"
            style={{
              position: "absolute",
              left: 120 + (i % 2) * 40,
              right: 160 - (i % 2) * 40,
              top: 560 + i * 230,
              height: 190,
              display: "flex",
              alignItems: "center",
              gap: 34,
              padding: "0 40px",
              borderRadius: 34,
              background: "rgba(10,24,40,0.82)",
              border: `1.5px solid ${B.lineStrong}`,
              boxShadow: "0 30px 80px rgba(0,8,20,0.45)",
              opacity: e,
              translate: `${(1 - e) * 120}px 0px`,
              rotate: `${(1 - e) * -3}deg`,
            }}
          >
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: 28,
                display: "grid",
                placeItems: "center",
                background: "rgba(61,139,255,0.14)",
              }}
            >
              <Icon
                name={ICONS[i % ICONS.length]}
                size={60}
                color={B.accentSoft}
              />
            </div>
            <span
              style={{
                fontFamily: FONT,
                fontSize: 56,
                fontWeight: 700,
                color: B.text,
              }}
            >
              {t}
            </span>
          </div>
        );
      })}
    </Canvas>
  );
};

export const ChatMessages: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const msgs = p.items ?? [];
  const gap = Math.max(
    12,
    Math.floor((p.dur * 0.75) / Math.max(1, msgs.length)),
  );
  return (
    <Canvas>
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 260,
          bottom: 340,
          borderRadius: 50,
          background: "rgba(8,19,31,0.9)",
          border: `2px solid ${B.lineStrong}`,
          overflow: "hidden",
          ...reveal(f, { frames: 12 }),
        }}
      >
        <div
          dir="rtl"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "30px 36px",
            borderBottom: `1px solid ${B.line}`,
          }}
        >
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 42,
              background: B.surface,
              display: "grid",
              placeItems: "center",
            }}
          >
            <Logo width={60} style={{ fontSize: 14 }} />
          </div>
          <div style={{ fontFamily: FONT }}>
            <div style={{ fontSize: 40, fontWeight: 700, color: B.text }}>
              {p.title ?? BRAND.name}
            </div>
            <div style={{ fontSize: 26, color: B.accentSoft }}>
              {p.sub ?? "متصل الآن"}
            </div>
          </div>
        </div>
        <div
          dir="rtl"
          style={{
            padding: "40px 36px",
            display: "flex",
            flexDirection: "column",
            gap: 26,
          }}
        >
          {msgs.map((text, i) => {
            const me = i % 2 === 0;
            const at = 8 + i * gap;
            if (f < at - (me ? 0 : 10)) return null;
            if (!me && f < at) {
              return (
                <div
                  key={i}
                  style={{
                    alignSelf: "flex-end",
                    display: "flex",
                    gap: 10,
                    padding: "24px 30px",
                    borderRadius: 34,
                    background: "rgba(201,211,222,0.12)",
                  }}
                >
                  {[0, 1, 2].map((k) => (
                    <span
                      key={k}
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        background: B.silver,
                        opacity:
                          0.3 + 0.7 * Math.max(0, Math.sin((f - k * 3) / 3)),
                      }}
                    />
                  ))}
                </div>
              );
            }
            const e = pr(f, at, 10);
            return (
              <div
                key={i}
                style={{
                  alignSelf: me ? "flex-start" : "flex-end",
                  maxWidth: "78%",
                  padding: "22px 30px",
                  borderRadius: 34,
                  background: me ? B.accent : "rgba(201,211,222,0.12)",
                  fontFamily: FONT,
                  fontSize: 40,
                  fontWeight: 500,
                  color: B.text,
                  opacity: e,
                  scale: String(0.9 + e * 0.1),
                  transformOrigin: me ? "left bottom" : "right bottom",
                }}
              >
                {text}
              </div>
            );
          })}
        </div>
      </div>
    </Canvas>
  );
};

export const Notifications: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const items = p.items ?? [];
  return (
    <AbsoluteFill>
      <Media
        src={p.image ?? "demo/room.jpg"}
        style={{ filter: "blur(14px) brightness(0.55)" }}
      />
      <Txt
        size={150}
        weight={600}
        style={{ position: "absolute", top: 280, opacity: 0.95 }}
      >
        {ar("٩:٤١")}
      </Txt>
      {items.map((t, i) => {
        const e = stagger(f, i, 6, 9, 14);
        const pushed = items
          .slice(i + 1)
          .reduce((a, _, k) => a + pr(f, 6 + (i + 1 + k) * 9, 14), 0);
        return (
          <div
            key={i}
            dir="rtl"
            style={{
              position: "absolute",
              left: 60,
              right: 60,
              top: 560 + pushed * 175,
              height: 150,
              display: "flex",
              alignItems: "center",
              gap: 24,
              padding: "0 30px",
              borderRadius: 36,
              background: "rgba(240,244,248,0.82)",
              backdropFilter: "blur(20px)",
              opacity: e,
              translate: `0px ${(1 - e) * -140}px`,
              scale: String(1 - pushed * 0.02),
            }}
          >
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: 20,
                background: B.accent,
                display: "grid",
                placeItems: "center",
              }}
            >
              <Icon name="bell" size={46} color="#fff" />
            </div>
            <div style={{ fontFamily: FONT, flex: 1 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#0B1A2A" }}>
                {p.title ?? BRAND.name}
              </div>
              <div style={{ fontSize: 34, fontWeight: 500, color: "#24364A" }}>
                {t}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const BrowserBuild: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const at = interpolate(f, [8, p.dur * 0.7], [1, 0], {
    ...clamp,
    easing: EASE,
  });
  const w = 960;
  const h = 640;
  return (
    <Canvas>
      <Browser
        src={p.image ?? "demo/screen.webp"}
        w={w}
        h={h}
        style={{ left: 60, top: 560, ...reveal(f, { frames: 12, rise: 60 }) }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: w * at,
            background: B.bg800,
            backgroundImage: `linear-gradient(${B.line} 1px, transparent 1px), linear-gradient(90deg, ${B.line} 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        >
          <Media
            src={p.image ?? "demo/screen.webp"}
            style={{
              width: w,
              opacity: 0.22,
              filter: "grayscale(1) contrast(1.6) brightness(1.3)",
              mixBlendMode: "screen",
              objectPosition: "top",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: w * at - 2,
            width: 4,
            background: B.accent,
            boxShadow: `0 0 30px 6px ${B.glow}`,
            opacity: at > 0.01 ? 1 : 0,
          }}
        />
      </Browser>
      <Txt
        size={64}
        style={{
          position: "absolute",
          top: SAFE.top + 60,
          ...reveal(f, { delay: 6 }),
        }}
      >
        {p.title}
      </Txt>
    </Canvas>
  );
};

export const PhoneMockup: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const e = pr(f, 0, 18);
  const scroll = interpolate(f, [24, p.dur], [0, 160], {
    ...clamp,
    easing: EASE,
  });
  return (
    <Canvas>
      <Phone
        src={p.image ?? "demo/phone.webp"}
        w={440}
        scroll={scroll}
        style={{
          left: 320,
          top: 480,
          rotate: `${(1 - e) * 8 - 4}deg`,
          translate: `0px ${(1 - e) * 300}px`,
          opacity: e,
        }}
      />
      <Txt
        size={64}
        style={{
          position: "absolute",
          top: SAFE.top + 20,
          ...reveal(f, { delay: 8 }),
        }}
      >
        {p.title}
      </Txt>
    </Canvas>
  );
};

export const ScreenZoom: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const z = pr(f, 18, 16);
  const src = p.image ?? "demo/screen.webp";
  const [fx, fy] = [p.values?.[0] ?? 0.62, p.values?.[1] ?? 0.4]; // focus point (0..1) on the screenshot
  return (
    <Canvas>
      <Browser src={src} w={960} h={640} style={{ left: 60, top: 420 }} />
      <div
        style={{
          position: "absolute",
          left: 60 + 960 * fx - 190,
          top: 466 + 594 * fy - 190,
          width: 380,
          height: 380,
          borderRadius: "50%",
          overflow: "hidden",
          border: `6px solid ${B.text}`,
          boxShadow: `0 0 0 10px rgba(61,139,255,0.35), 0 30px 80px rgba(0,0,0,0.6)`,
          opacity: z,
          scale: String(0.4 + z * 0.6),
        }}
      >
        <Media
          src={src}
          style={{
            width: 960 * 2.4,
            height: "auto",
            bottom: "auto",
            right: "auto",
            left: -(960 * 2.4 * fx - 190),
            top: -(594 * 2.4 * fy - 190) + 40,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1260,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          ...reveal(f, { delay: 26 }),
        }}
      >
        <Pill>{p.title}</Pill>
      </div>
    </Canvas>
  );
};

export const ProcessRail: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const items = p.items ?? [];
  const top = 460;
  const step = Math.min(170, 1000 / Math.max(1, items.length - 1));
  const at = (i: number) => 8 + (i * (p.dur * 0.7)) / Math.max(1, items.length);
  const done = items.filter((_, i) => f >= at(i)).length;
  const fill = interpolate(
    f,
    [at(0), at(items.length - 1) + 10],
    [0, (items.length - 1) * step],
    { ...clamp, easing: EASE },
  );
  return (
    <Canvas>
      <div
        style={{
          position: "absolute",
          right: 300,
          top,
          width: 6,
          height: (items.length - 1) * step,
          borderRadius: 3,
          background: B.line,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 300,
          top,
          width: 6,
          height: fill,
          borderRadius: 3,
          background: B.accent,
          boxShadow: `0 0 24px ${B.glow}`,
        }}
      />
      {items.map((t, i) => {
        const on = f >= at(i);
        const e = pr(f, at(i), 10);
        return (
          <div
            key={i}
            dir="rtl"
            style={{
              position: "absolute",
              right: 300 - 27,
              top: top + i * step - 30,
              display: "flex",
              alignItems: "center",
              gap: 34,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                display: "grid",
                placeItems: "center",
                background: on ? B.accent : B.bg800,
                border: `3px solid ${on ? B.accent : B.lineStrong}`,
                scale: String(1 + (i === done - 1 ? 0.15 * e : 0)),
                fontFamily: FONT,
                fontSize: 26,
                fontWeight: 700,
                color: B.text,
              }}
            >
              {ar(i + 1)}
            </div>
            <span
              style={{
                fontFamily: FONT,
                fontSize: 64,
                fontWeight: 700,
                color: on ? B.text : B.dim,
                opacity: 0.35 + e * 0.65,
              }}
            >
              {t}
            </span>
          </div>
        );
      })}
    </Canvas>
  );
};

export const Checklist: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const items = p.items ?? [];
  return (
    <Canvas>
      <Txt
        size={78}
        style={{ position: "absolute", top: SAFE.top + 60, ...reveal(f) }}
      >
        {p.title}
      </Txt>
      {items.map((t, i) => {
        const e = stagger(f, i, 12, 10, 12);
        const c = pr(f, 18 + i * 10, 8);
        return (
          <div
            key={i}
            dir="rtl"
            style={{
              position: "absolute",
              right: 130,
              top: 600 + i * 150,
              display: "flex",
              alignItems: "center",
              gap: 34,
              opacity: e,
              translate: `${(1 - e) * 40}px 0px`,
            }}
          >
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: 22,
                border: `4px solid ${c > 0.5 ? B.green : B.lineStrong}`,
                background: c > 0.5 ? "rgba(47,174,107,0.18)" : "transparent",
                display: "grid",
                placeItems: "center",
              }}
            >
              <svg width={56} height={56} viewBox="0 0 24 24">
                <path
                  d="M20 6L9 17l-5-5"
                  fill="none"
                  stroke={B.green}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeDasharray={24}
                  strokeDashoffset={24 * (1 - c)}
                />
              </svg>
            </div>
            <span
              style={{
                fontFamily: FONT,
                fontSize: 58,
                fontWeight: 600,
                color: B.text,
              }}
            >
              {t}
            </span>
          </div>
        );
      })}
    </Canvas>
  );
};

export const CompareVs: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const items = p.items ?? [];
  const bad = items
    .filter((t) => t.startsWith("-"))
    .map((t) => t.slice(1).trim());
  const good = items
    .filter((t) => t.startsWith("+"))
    .map((t) => t.slice(1).trim());
  const col = (
    list: string[],
    ok: boolean,
    side: "left" | "right",
    delay: number,
  ) => (
    <div
      dir="rtl"
      style={{
        position: "absolute",
        [side]: 60,
        top: 560,
        width: 450,
        display: "flex",
        flexDirection: "column",
        gap: 26,
      }}
    >
      <Txt
        size={52}
        color={ok ? B.accentSoft : B.dim}
        style={reveal(f, { delay })}
      >
        {ok ? p.sub : p.title}
      </Txt>
      {list.map((t, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "24px 26px",
            borderRadius: 26,
            background: ok ? "rgba(61,139,255,0.14)" : "rgba(255,255,255,0.05)",
            border: `1.5px solid ${ok ? B.accent : B.line}`,
            ...reveal(f, { delay: delay + 6 + i * 6 }),
          }}
        >
          <Icon
            name={ok ? "check" : "x"}
            size={44}
            color={ok ? B.green : B.red}
            stroke={2.6}
          />
          <span
            style={{
              fontFamily: FONT,
              fontSize: 40,
              fontWeight: 600,
              color: ok ? B.text : B.silver,
              textDecoration: ok ? undefined : "line-through",
              textDecorationColor: "rgba(210,72,63,0.6)",
            }}
          >
            {t}
          </span>
        </div>
      ))}
    </div>
  );
  return (
    <Canvas>
      {col(bad, false, "right", 0)}
      {col(good, true, "left", 14)}
      <div
        style={{
          position: "absolute",
          left: 539,
          top: 560,
          width: 2,
          height: 900,
          background: B.line,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 540 - 50,
          top: 450,
          width: 100,
          height: 100,
          borderRadius: 50,
          background: B.accent,
          display: "grid",
          placeItems: "center",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 40,
          color: B.text,
          scale: String(pr(f, 8, 12)),
        }}
      >
        VS
      </div>
    </Canvas>
  );
};

export const SearchBar: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const q = p.title ?? "";
  const n = Math.floor(
    interpolate(f, [8, 8 + q.length * 2], [0, q.length], clamp),
  );
  const typed = n >= q.length;
  const t0 = 8 + q.length * 2 + 6;
  return (
    <Canvas>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 600,
          height: 130,
          borderRadius: 65,
          background: B.text,
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "0 40px",
          boxShadow: `0 0 0 ${typed ? 8 : 0}px rgba(61,139,255,0.35), 0 30px 80px rgba(0,0,0,0.5)`,
          ...reveal(f, { frames: 10 }),
        }}
      >
        <Icon name="search" size={56} color="#5B6878" stroke={2.4} />
        <span
          style={{
            fontFamily: FONT,
            fontSize: 50,
            fontWeight: 500,
            color: "#0B1A2A",
          }}
        >
          {q.slice(0, n)}
        </span>
        <span
          style={{
            width: 4,
            height: 60,
            background: B.accent,
            opacity: Math.floor(f / 8) % 2 ? 0 : 1,
          }}
        />
      </div>
      {(p.items ?? []).map((t, i) => (
        <div
          key={i}
          dir="rtl"
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 790 + i * 140,
            height: 120,
            borderRadius: 26,
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "0 34px",
            background:
              i === 0 ? "rgba(61,139,255,0.16)" : "rgba(255,255,255,0.05)",
            border: `1.5px solid ${i === 0 ? B.accent : B.line}`,
            ...reveal(f, { delay: t0 + i * 5, frames: 10 }),
          }}
        >
          <Icon
            name={i === 0 ? "star" : "globe"}
            size={44}
            color={i === 0 ? B.accentSoft : B.dim}
          />
          <span
            style={{
              fontFamily: FONT,
              fontSize: 42,
              fontWeight: i === 0 ? 700 : 500,
              color: B.text,
            }}
          >
            {t}
          </span>
        </div>
      ))}
    </Canvas>
  );
};

export const OfferCard: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const e = pr(f, 0, 18);
  const shine = interpolate(f, [16, 40], [-40, 140], clamp);
  return (
    <Canvas>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          top: 520,
          padding: "70px 60px",
          borderRadius: 50,
          background: `linear-gradient(160deg, ${B.steel}, ${B.surface} 55%, ${B.bg800})`,
          border: `2px solid ${B.lineStrong}`,
          overflow: "hidden",
          boxShadow: `0 40px 120px rgba(0,4,12,0.6), 0 0 80px ${B.glow}`,
          opacity: e,
          scale: String(0.9 + e * 0.1),
          rotate: `${(1 - e) * -4}deg`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(105deg, transparent ${shine - 20}%, rgba(255,255,255,0.18) ${shine}%, transparent ${shine + 20}%)`,
          }}
        />
        <div
          style={{
            display: "inline-block",
            padding: "10px 26px",
            borderRadius: 30,
            background: B.accent,
            fontFamily: FONT,
            fontSize: 32,
            fontWeight: 700,
            color: B.text,
          }}
        >
          {p.sub}
        </div>
        <Txt size={96} center={false} style={{ marginTop: 30 }}>
          {p.title}
        </Txt>
        {(p.items ?? []).map((t, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 22,
              ...reveal(f, { delay: 14 + i * 5 }),
            }}
          >
            <Icon name="check" size={40} color={B.accentSoft} stroke={2.6} />
            <span style={{ fontFamily: FONT, fontSize: 40, color: B.silver }}>
              {t}
            </span>
          </div>
        ))}
      </div>
    </Canvas>
  );
};

export const MapPin: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const route = pr(f, 4, 30);
  const drop = pr(f, 26, 12);
  const ring = (f - 36) / 30;
  return (
    <Canvas>
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        {Array.from({ length: 22 }).map((_, i) => (
          <path
            key={i}
            d={`M ${-100 + i * 60} 300 C ${200 + i * 30} ${700 + (i % 5) * 40}, ${300 + i * 20} ${1100 - (i % 3) * 60}, ${-50 + i * 70} 1600`}
            stroke="rgba(139,188,255,0.12)"
            strokeWidth={3}
            fill="none"
          />
        ))}
        <path
          d="M 80 1180 C 300 1100, 420 980, 560 940"
          stroke={B.accent}
          strokeWidth={6}
          fill="none"
          strokeDasharray="18 14"
          pathLength={1000}
          style={{ strokeDasharray: `${route * 1000} 1000` }}
        />
        {ring > 0
          ? [0, 0.5].map((o) => (
              <circle
                key={o}
                cx={560}
                cy={940}
                r={((ring + o) % 1) * 160}
                fill="none"
                stroke={B.accentSoft}
                strokeWidth={3}
                opacity={1 - ((ring + o) % 1)}
              />
            ))
          : null}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 500,
          top: 790,
          width: 120,
          height: 150,
          translate: `0px ${(1 - drop) * -300}px`,
          opacity: drop,
        }}
      >
        <svg width={120} height={150} viewBox="0 0 24 30">
          <path
            d="M12 0C5.4 0 0 5.2 0 11.7 0 20 12 30 12 30s12-10 12-18.3C24 5.2 18.6 0 12 0z"
            fill={B.accent}
          />
          <circle cx={12} cy={11.5} r={4.6} fill={B.text} />
        </svg>
      </div>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          top: 1010,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          ...reveal(f, { delay: 36 }),
        }}
      >
        <div
          style={{
            padding: "22px 40px",
            borderRadius: 30,
            background: "rgba(8,19,31,0.9)",
            border: `2px solid ${B.lineStrong}`,
            fontFamily: FONT,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 64, fontWeight: 700, color: B.text }}>
            {p.title}
          </div>
          <div style={{ fontSize: 30, color: B.accentSoft }}>{p.sub}</div>
        </div>
      </div>
    </Canvas>
  );
};

export const AiNetwork: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const layers = [3, 5, 5, 2];
  const nodes = layers.flatMap((n, l) =>
    Array.from({ length: n }, (_, i) => ({
      l,
      x: 200 + l * 230,
      y: 960 + (i - (n - 1) / 2) * 150,
    })),
  );
  const edges: [number, number][] = [];
  nodes.forEach((a, i) =>
    nodes.forEach((b, j) => b.l === a.l + 1 && edges.push([i, j])),
  );
  return (
    <Canvas>
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        {edges.map(([i, j], k) => {
          const a = nodes[i];
          const b = nodes[j];
          const e = pr(f, 4 + a.l * 8, 14);
          const pulse = ((f * 2 + k * 7) % 60) / 60;
          return (
            <g key={k}>
              <line
                x1={a.x}
                y1={a.y}
                x2={a.x + (b.x - a.x) * e}
                y2={a.y + (b.y - a.y) * e}
                stroke={B.line}
                strokeWidth={2}
              />
              {e >= 1 ? (
                <circle
                  cx={a.x + (b.x - a.x) * pulse}
                  cy={a.y + (b.y - a.y) * pulse}
                  r={4}
                  fill={B.accentSoft}
                  opacity={0.8}
                />
              ) : null}
            </g>
          );
        })}
        {nodes.map((n, i) => {
          const e = pr(f, n.l * 8, 10);
          return (
            <circle
              key={i}
              cx={n.x}
              cy={n.y}
              r={22 * e}
              fill={n.l === layers.length - 1 ? B.accent : B.bg700}
              stroke={B.accentSoft}
              strokeWidth={3}
              style={{ filter: `drop-shadow(0 0 12px ${B.glow})` }}
            />
          );
        })}
      </svg>
      <Txt
        size={78}
        style={{
          position: "absolute",
          top: SAFE.top + 60,
          ...reveal(f, { delay: 6 }),
        }}
      >
        {p.title}
      </Txt>
    </Canvas>
  );
};

export const LogoBuild: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const draw = pr(f, 2, 22);
  const solid = pr(f, 24, 18);
  const [x, y, w, h] = [290, 640, 500, 500];
  return (
    <Canvas>
      <svg
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={20}
          fill="none"
          stroke={B.accentSoft}
          strokeWidth={2}
          strokeDasharray="10 8"
          pathLength={1000}
          style={{ strokeDasharray: `${draw * 1000} 1000` }}
          opacity={1 - solid * 0.7}
        />
        {[
          [x, y],
          [x + w, y],
          [x, y + h],
          [x + w, y + h],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={8}
            fill={B.accent}
            opacity={draw}
          />
        ))}
        <line
          x1={x}
          y1={y + h + 50}
          x2={x + w * draw}
          y2={y + h + 50}
          stroke={B.dim}
          strokeWidth={1.5}
          strokeDasharray="6 6"
        />
        <line
          x1={x - 50}
          y1={y}
          x2={x - 50}
          y2={y + h * draw}
          stroke={B.dim}
          strokeWidth={1.5}
          strokeDasharray="6 6"
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: x + 40,
          top: y + 40,
          width: w - 80,
          height: h - 80,
          display: "grid",
          placeItems: "center",
          opacity: solid,
          scale: String(0.94 + solid * 0.06),
          filter: `blur(${(1 - solid) * 8}px) drop-shadow(0 0 40px ${B.glow})`,
        }}
      >
        <Logo width={w - 100} />
      </div>
      <Txt
        size={56}
        weight={600}
        color={B.silver}
        style={{
          position: "absolute",
          top: y + h + 120,
          ...reveal(f, { delay: 36 }),
        }}
      >
        {p.title}
      </Txt>
    </Canvas>
  );
};

export const GlassPlate: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const e = pr(f, 0, 20);
  const sheen = interpolate(f, [14, 44], [-30, 130], clamp);
  return (
    <Canvas focus={[50, 46]}>
      {[0, 1, 2].map((i) => {
        const r = ((f / 50 + i / 3) % 1) * 520 + 300;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 - r,
              top: 900 - r,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              border: `2px solid rgba(139,188,255,${0.25 * (1 - (r - 300) / 520)})`,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 190,
          top: 560,
          width: 700,
          height: 680,
          borderRadius: 60,
          overflow: "hidden",
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(24px)",
          border: "1.5px solid rgba(255,255,255,0.22)",
          boxShadow: `0 40px 120px rgba(0,4,12,0.6), 0 0 120px ${B.glow}`,
          display: "grid",
          placeItems: "center",
          opacity: e,
          scale: String(0.92 + e * 0.08),
        }}
      >
        <Logo width={460} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(115deg, transparent ${sheen - 15}%, rgba(255,255,255,0.22) ${sheen}%, transparent ${sheen + 15}%)`,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 190,
          top: 1250,
          width: 700,
          height: 200,
          borderRadius: 60,
          background: "linear-gradient(rgba(255,255,255,0.06), transparent)",
          opacity: e * 0.6,
          scale: "1 -1",
          filter: "blur(6px)",
        }}
      />
      <Txt
        size={52}
        weight={600}
        color={B.silver}
        style={{ position: "absolute", top: 1340, ...reveal(f, { delay: 20 }) }}
      >
        {p.title}
      </Txt>
    </Canvas>
  );
};

export const EndScreen: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  return (
    <Canvas focus={[50, 40]}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 50,
          paddingBottom: 120,
        }}
      >
        <div style={{ ...reveal(f, { frames: 18, rise: 40 }) }}>
          <Logo width={420} />
        </div>
        <Txt size={84} style={reveal(f, { delay: 10 })}>
          {p.title}
        </Txt>
        <div
          dir="rtl"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "22px 44px",
            borderRadius: 50,
            background: B.accent,
            fontFamily: FONT,
            fontSize: 46,
            fontWeight: 700,
            color: B.text,
            ...reveal(f, { delay: 18 }),
          }}
        >
          <Icon name="send" size={44} color={B.text} />
          {p.sub}
        </div>
        <Txt
          size={36}
          weight={500}
          color={B.dim}
          style={reveal(f, { delay: 26 })}
        >
          {BRAND.url}
        </Txt>
      </AbsoluteFill>
    </Canvas>
  );
};

export const ContactCard: React.FC<StyleProps> = (p) => {
  const f = useCurrentFrame();
  const icons: IconName[] = ["message", "globe", "pin", "mail"];
  return (
    <Canvas>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          left: 110,
          right: 110,
          top: 520,
          padding: 60,
          borderRadius: 50,
          background: "rgba(10,24,40,0.85)",
          border: `1.5px solid ${B.lineStrong}`,
          ...reveal(f, { frames: 16, rise: 50 }),
        }}
      >
        <Logo width={240} style={{ margin: "0 auto 30px" }} />
        <Txt size={60}>{p.title}</Txt>
        {(p.items ?? []).map((t, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginTop: 34,
              ...reveal(f, { delay: 12 + i * 6 }),
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                background: "rgba(61,139,255,0.16)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Icon
                name={icons[i % icons.length]}
                size={44}
                color={B.accentSoft}
              />
            </div>
            <span
              dir="auto"
              style={{
                fontFamily: FONT,
                fontSize: 44,
                fontWeight: 600,
                color: B.text,
              }}
            >
              {t}
            </span>
          </div>
        ))}
      </div>
    </Canvas>
  );
};
