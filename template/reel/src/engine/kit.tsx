// العناصر المشتركة لكل الأساليب: الخلفية، والنص، والشخص، والشعار، والأيقونات.
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile } from "remotion";
import { B, BRAND, FONT, TYPE } from "../brand";
import { DATA } from "../data";

const AR = "٠١٢٣٤٥٦٧٨٩";
/** أرقام عربية مشرقية */
export const ar = (n: number | string) =>
  String(n).replace(/[0-9]/g, (d) => AR[Number(d)]);

// أيقونات خطية على شبكة 24 (هندسة Lucide). أضف ما تحتاجه بنفس الصيغة.
export const PATHS = {
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  pen: "M12 19l7-7 3 3-7 7-3-3z M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z M2 2l7.6 7.6 M9 11a2 2 0 1 0 4 0a2 2 0 1 0-4 0",
  building:
    "M3 21h18 M5 21V7l8-4v18 M19 21V11l-6-4 M9 9v.01 M9 12v.01 M9 15v.01 M9 18v.01",
  globe:
    "M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  phone:
    "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M12 18h.01",
  bag: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0",
  grid: "M3 3h7v9H3z M14 3h7v5h-7z M14 12h7v9h-7z M3 16h7v5H3z",
  cpu: "M4 4h16v16H4z M9 9h6v6H9z M9 1v3 M15 1v3 M9 20v3 M15 20v3 M20 9h3 M20 14h3 M1 9h3 M1 14h3",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  palette:
    "M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4A5.6 5.6 0 0 0 22 9.8C22 5.5 17.5 2 12 2z M7.5 10.5h.01 M10.5 7.5h.01 M14.5 7.5h.01 M17 11h.01",
  message: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  send: "M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z",
  bulb: "M9 18h6 M10 22h4 M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z",
  rocket:
    "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0 M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",
  search: "M11 3a8 8 0 1 0 0 16a8 8 0 1 0 0-16z M21 21l-4.35-4.35",
  map: "M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z M9 4v14 M15 6v14",
  trend: "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
  coin: "M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  check: "M20 6L9 17l-5-5",
  layers: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8a4 4 0 1 0 0-8z",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z",
  star: "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9 M13.7 21a2 2 0 0 1-3.4 0",
  clock: "M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20z M12 6v6l4 2",
  x: "M18 6L6 18 M6 6l12 12",
  play: "M5 3l14 9-14 9z",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M22 6l-10 7L2 6",
  pin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6a3 3 0 1 0 0-6z",
  cart: "M9 21a1 1 0 1 0 0-2a1 1 0 1 0 0 2z M20 21a1 1 0 1 0 0-2a1 1 0 1 0 0 2z M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6",
} as const;

export type IconName = keyof typeof PATHS;

export const Icon: React.FC<{
  name: IconName;
  size?: number;
  color?: string;
  stroke?: number;
  style?: React.CSSProperties;
}> = ({ name, size = 48, color = "currentColor", stroke = 1.8, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    <path d={PATHS[name]} />
  </svg>
);

/* ------------------------------------------------------------ خلفيات */

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => (
  <svg
    width="1080"
    height="1920"
    style={{
      position: "absolute",
      inset: 0,
      opacity,
      mixBlendMode: "overlay",
      pointerEvents: "none",
    }}
  >
    <filter id="grain">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.9"
        numOctaves="2"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain)" />
  </svg>
);

export const Vignette: React.FC<{ strength?: number }> = ({
  strength = 0.6,
}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(130% 90% at 50% 45%, transparent 58%, rgba(2,6,12,${strength}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

/** لوحة التصميم الداكنة بشبكة مخطط خفيفة — أرضية كل مشاهد الموشن. */
export const Canvas: React.FC<{
  children?: React.ReactNode;
  grid?: number;
  focus?: [number, number];
  style?: React.CSSProperties;
}> = ({ children, grid = 1, focus = [50, 42], style }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(110% 75% at ${focus[0]}% ${focus[1]}%, ${B.bg700} 0%, ${B.bg800} 48%, ${B.bg900} 100%)`,
      overflow: "hidden",
      ...style,
    }}
  >
    <AbsoluteFill
      style={{
        opacity: grid,
        backgroundImage: `linear-gradient(${B.line} 1px, transparent 1px), linear-gradient(90deg, ${B.line} 1px, transparent 1px)`,
        backgroundSize: "120px 120px",
        maskImage: `radial-gradient(85% 65% at ${focus[0]}% ${focus[1]}%, black 30%, transparent 100%)`,
      }}
    />
    {children}
    <Vignette />
    <Grain />
  </AbsoluteFill>
);

export const Paper: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <AbsoluteFill style={{ background: B.paper, overflow: "hidden" }}>
    <AbsoluteFill
      style={{
        backgroundImage:
          "radial-gradient(rgba(30,43,58,0.07) 1.5px, transparent 1.5px)",
        backgroundSize: "36px 36px",
      }}
    />
    {children}
    <Grain opacity={0.08} />
  </AbsoluteFill>
);

/* ------------------------------------------------------------ نص */

export const Txt: React.FC<{
  children: React.ReactNode;
  size?: number;
  weight?: number;
  color?: string;
  style?: React.CSSProperties;
  center?: boolean;
}> = ({
  children,
  size = TYPE.body,
  weight = 700,
  color = B.text,
  style,
  center = true,
}) => (
  <div
    dir="rtl"
    lang="ar"
    style={{
      fontFamily: FONT,
      fontSize: size,
      fontWeight: weight,
      color,
      lineHeight: 1.25,
      textAlign: center ? "center" : "right",
      textWrap: "balance",
      // absolutely placed text spans the frame unless a width or side is given
      ...(style?.position === "absolute" &&
      style.left === undefined &&
      style.right === undefined &&
      style.width === undefined
        ? { left: 0, right: 0 }
        : {}),
      ...style,
    }}
  >
    {children}
  </div>
);

/** صندوق كابشن داكن (٨٦٪) — للكتابة فوق الفيديو. */
export const Pill: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  size?: number;
}> = ({ children, style, size = 60 }) => (
  <div
    dir="rtl"
    style={{
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: size,
      color: B.text,
      padding: "14px 34px 18px",
      borderRadius: 26,
      background: "rgba(8,19,31,0.86)",
      lineHeight: 1.3,
      ...style,
    }}
  >
    {children}
  </div>
);

/** السطر المنطوق كتصميم: الكلمات حتى upTo ظاهرة، والقادمة باهتة، والمفتاحية بلون الإبراز. */
export const KineticLine: React.FC<{
  words: string[];
  upTo: number;
  keys?: number[];
  size?: number;
  style?: React.CSSProperties;
}> = ({ words, upTo, keys = [], size = TYPE.h2, style }) => (
  <Txt size={size} style={style}>
    {words.map((w, i) => (
      <span
        key={i}
        style={{
          color: keys.includes(i) ? B.accentSoft : B.text,
          opacity: i <= upTo ? 1 : 0.14,
          filter: i === upTo ? `drop-shadow(0 0 18px ${B.glow})` : undefined,
        }}
      >
        {w}{" "}
      </span>
    ))}
  </Txt>
);

/* ------------------------------------------------------------ الشخص والوسائط */

/** صورة أو فيديو (webm شفاف للشخص المقصوص، أو mp4). trim = إطار البداية في المصدر. */
export const Media: React.FC<{
  src: string;
  trim?: number;
  style?: React.CSSProperties;
  fit?: "cover" | "contain";
}> = ({ src, trim = 0, style, fit = "cover" }) => {
  const s: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: fit,
    ...style,
  };
  if (/\.(webm|mp4|mov)$/i.test(src)) {
    return (
      <OffthreadVideo
        src={staticFile(src)}
        muted
        transparent={src.endsWith(".webm")}
        trimBefore={trim}
        style={s}
      />
    );
  }
  return <Img src={staticFile(src)} style={s} />;
};

/** خلفية مكان (غرفة/مكتب) مضببة قليلاً خلف الشخص المقصوص. */
/** المعرض والوضع التجريبي يستخدمان الصور التجريبية بدل لقطات المشروع. */
export const DemoMedia = createContext(false);
const useDemo = () => useContext(DemoMedia) || DATA.demo;

export const Room: React.FC<{
  src?: string;
  blur?: number;
  filter?: string;
}> = ({ src, blur = 3, filter = "" }) => {
  const demo = useDemo();
  return (
    <Media
      src={src ?? (demo ? "demo/room.jpg" : DATA.face.room)}
      style={{
        inset: -40,
        width: 1160,
        height: 2000,
        filter: `blur(${blur}px) brightness(0.92) ${filter}`,
      }}
    />
  );
};

/** الشخص: في وضع التجربة صورة مقصوصة؛ في المشروع: footage/person_alpha.webm أو master.mp4 (data.ts). */
export const Person: React.FC<{
  src?: string;
  trim?: number;
  scale?: number;
  dx?: number;
  style?: React.CSSProperties;
}> = ({ src, trim, scale, dx, style }) => {
  const demo = useDemo();
  const file =
    src ??
    (demo
      ? "demo/person.png"
      : DATA.face.mode === "cutout"
        ? DATA.face.person
        : DATA.face.master);
  return (
    <Media
      src={file}
      trim={trim}
      style={{
        translate: `${dx ?? (demo ? 65 : DATA.face.dx)}px 0px`,
        transformOrigin: "50% 38%",
        scale: String(scale ?? DATA.face.scale),
        ...style,
      }}
    />
  );
};

/** الشعار الأصلي كما هو. إذا لم يُحدَّد ملف، يظهر اسم العلامة نصاً. */
export const Logo: React.FC<{
  width: number;
  style?: React.CSSProperties;
  color?: string;
}> = ({ width, style, color = B.text }) =>
  BRAND.logo ? (
    <Img
      src={staticFile(BRAND.logo)}
      style={{
        width,
        height: width * BRAND.logoRatio,
        objectFit: "contain",
        display: "block",
        ...style,
      }}
    />
  ) : (
    <div
      dir="rtl"
      style={{
        width,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: width / 5,
        color,
        textAlign: "center",
        lineHeight: 1.1,
        ...style,
      }}
    >
      {BRAND.name}
    </div>
  );

/** إطار جهاز/متصفح بسيط حول لقطة شاشة */
export const Browser: React.FC<{
  src: string;
  w: number;
  h: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ src, w, h, style, children }) => (
  <div
    style={{
      position: "absolute",
      width: w,
      borderRadius: 22,
      overflow: "hidden",
      background: B.bg800,
      border: `1.5px solid ${B.lineStrong}`,
      boxShadow: "0 40px 100px rgba(0,4,12,0.6)",
      ...style,
    }}
  >
    <div
      style={{
        height: 46,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 20px",
        borderBottom: `1px solid ${B.line}`,
      }}
    >
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
        <span
          key={c}
          style={{ width: 14, height: 14, borderRadius: 7, background: c }}
        />
      ))}
      <div
        style={{
          flex: 1,
          height: 24,
          marginLeft: 20,
          borderRadius: 12,
          background: "rgba(255,255,255,0.06)",
        }}
      />
    </div>
    <div
      style={{
        position: "relative",
        width: w,
        height: h - 46,
        overflow: "hidden",
      }}
    >
      <Media src={src} style={{ objectPosition: "top" }} />
      {children}
    </div>
  </div>
);

export const Phone: React.FC<{
  src: string;
  w: number;
  style?: React.CSSProperties;
  scroll?: number;
}> = ({ src, w, style, scroll = 0 }) => (
  <div
    style={{
      position: "absolute",
      width: w,
      height: w * 2.05,
      borderRadius: w * 0.14,
      padding: w * 0.035,
      background: "#0B0F14",
      boxShadow: `0 0 0 2px ${B.lineStrong}, 0 40px 100px rgba(0,4,12,0.6)`,
      ...style,
    }}
  >
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: w * 0.11,
        overflow: "hidden",
        background: B.bg800,
      }}
    >
      <Media
        src={src}
        style={{
          height: "auto",
          bottom: "auto",
          translate: `0px ${-scroll}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: w * 0.03,
          left: "50%",
          translate: "-50% 0",
          width: w * 0.3,
          height: w * 0.075,
          borderRadius: w,
          background: "#0B0F14",
        }}
      />
    </div>
  </div>
);
