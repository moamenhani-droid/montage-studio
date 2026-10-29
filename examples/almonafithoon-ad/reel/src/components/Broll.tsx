// Full-screen B-roll scenes. They cover the speaker while the voice keeps playing underneath.
import React from 'react';
import {AbsoluteFill, Img, Interactive, staticFile, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';
import {C, FONT, brollBackground, glassCard} from '../theme';
import {enterProgress, exitProgress, lerp, reveal} from '../motion';
import {Icon, type IconName} from './Icon';

const text = (description: string, def: string) => ({type: 'string', default: def, description}) as const;
const num = (description: string, def: number) => ({type: 'number', min: 0, max: 600, step: 1, default: def, description, hiddenFromList: false}) as const;
const BLEED: React.CSSProperties = {top: -8, left: -8, width: 'calc(100% + 16px)', height: 'calc(100% + 16px)'};

// Content starts a few frames "early" so it overlaps the outgoing scene: a crossfade, never an empty frame.
const LEAD = 5;
const fade = (description: string) => ({type: 'boolean', default: true, description}) as const;
const image = (description: string, def: string) => ({type: 'asset', assetType: 'image', default: def, description}) as const;

/* ------------------------------------------------------------ Shared shell */

// fadeIn / fadeOut: whether the backdrop itself fades. Inside the services run only the first and
// last scene fade, so the backdrop stays continuous and only the content changes between scenes.
const Shell: React.FC<{title?: string; icon?: IconName; fadeIn?: boolean; fadeOut?: boolean; children: React.ReactNode}> = ({
  title,
  icon,
  fadeIn = true,
  fadeOut = true,
  children,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const inP = fadeIn ? lerp(frame, [0, 6], [0, 1]) : 1;
  const out = fadeOut ? exitProgress(frame, durationInFrames, 5) : 0;
  // content always hands over: rises, blurs and fades in the last 6 frames
  const hand = exitProgress(frame, durationInFrames, 6);
  return (
    // 8px bleed on every side so no anti-aliased edge of the footage below can show through
    <AbsoluteFill style={{...brollBackground, ...BLEED, opacity: inP * (1 - out), scale: String(fadeIn ? 1.04 - inP * 0.04 : 1)}}>
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(rgba(201,211,222,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,211,222,0.06) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          backgroundPosition: '0px 0px',
          maskImage: 'radial-gradient(80% 60% at 50% 45%, black, transparent)',
        }}
      />
      <AbsoluteFill style={{opacity: 1 - hand, translate: `0px ${-hand * 40}px`, filter: `blur(${hand * 8}px)`}}>
        {title ? (
          <div style={{position: 'absolute', top: 266, left: 160, right: 160, display: 'flex', justifyContent: 'center'}}>
            <div
              dir="rtl"
              style={{
                ...reveal(frame + LEAD, fps, {delay: 2, frames: 10, rise: 20}),
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 64,
                whiteSpace: 'nowrap',
                color: C.white,
              }}
            >
              {icon ? <Icon name={icon} size={64} color={C.blueSoft} /> : null}
              {title}
            </div>
          </div>
        ) : null}
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Browser: React.FC<{src: string; width: number; style?: React.CSSProperties}> = ({src, width, style}) => (
  <div
    style={{
      width,
      borderRadius: 22,
      overflow: 'hidden',
      background: '#F4F6F9',
      boxShadow: '0 40px 90px rgba(0, 6, 16, 0.55), 0 0 0 1.5px rgba(201,211,222,0.35)',
      ...style,
    }}
  >
    <div style={{height: 46, display: 'flex', alignItems: 'center', gap: 9, padding: '0 18px', background: '#E3E8EF'}}>
      {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
        <div key={c} style={{width: 13, height: 13, borderRadius: 9, background: c}} />
      ))}
      <div style={{flex: 1, height: 26, marginInline: 40, borderRadius: 13, background: '#F8FAFC'}} />
    </div>
    <Img src={staticFile(src)} style={{width, height: (width * 900) / 1440, display: 'block', objectFit: 'cover'}} />
  </div>
);

const Phone: React.FC<{src: string; width: number; style?: React.CSSProperties}> = ({src, width, style}) => (
  <div
    style={{
      width,
      height: (width * 812) / 375 + 24,
      padding: 12,
      borderRadius: width * 0.16,
      background: 'linear-gradient(160deg, #2A3442, #0B0F14)',
      boxShadow: '0 40px 90px rgba(0, 6, 16, 0.6), inset 0 0 0 2px rgba(201,211,222,0.25)',
      ...style,
    }}
  >
    <Img
      src={staticFile(src)}
      style={{width: width - 24, height: ((width - 24) * 812) / 375, borderRadius: width * 0.12, display: 'block', objectFit: 'cover'}}
    />
  </div>
);

const Screen: React.FC<{src: string; width: number; style?: React.CSSProperties}> = ({src, width, style}) => (
  <div
    style={{
      width,
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0 40px 90px rgba(0, 6, 16, 0.55), 0 0 0 1.5px rgba(201,211,222,0.3)',
      ...style,
    }}
  >
    <Img src={staticFile(src)} style={{width, height: (width * 800) / 1280, display: 'block'}} />
  </div>
);

/* ---------------------------------------------------------------- Problem */

const ProblemInner: React.FC<{a: string; b: string; c: string; cost: string; atA: number; atB: number; atC: number; atCost: number}> = ({
  a,
  b,
  c,
  cost,
  atA,
  atB,
  atC,
  atCost,
}) => {
  const frame = useCurrentFrame() + LEAD;
  const {fps, durationInFrames} = useVideoConfig();
  const spread = lerp(frame, [0, durationInFrames], [0, 1]);
  const cards: {label: string; icon: IconName; at: number; x: number; y: number; r: number}[] = [
    {label: a, icon: 'code', at: atA, x: 210, y: -360, r: 4},
    {label: b, icon: 'pen', at: atB, x: -220, y: -150, r: -5},
    {label: c, icon: 'building', at: atC, x: 160, y: 70, r: 3},
  ];
  return (
    <Shell>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {cards.slice(0, 2).map((card, i) => {
          const next = cards[i + 1];
          const show = lerp(frame, [next.at + 4, next.at + 14], [0, 1]);
          return (
            <line
              key={i}
              x1={540 + card.x}
              y1={860 + card.y}
              x2={540 + next.x}
              y2={860 + next.y}
              stroke={C.silverDim}
              strokeWidth={3}
              strokeDasharray="10 22"
              opacity={show * 0.6}
            />
          );
        })}
      </svg>
      {cards.map((card, i) => {
        const e = enterProgress(frame, fps, card.at, 12);
        return (
          <div
            key={i}
            dir="rtl"
            style={{
              ...glassCard,
              position: 'absolute',
              left: 540 + card.x * (1 + spread * 0.08),
              top: 860 + card.y * (1 + spread * 0.08),
              translate: `-50% calc(-50% + ${(1 - e) * 30}px)`,
              rotate: `${card.r}deg`,
              opacity: e,
              filter: `blur(${(1 - e) * 10}px)`,
              padding: '30px 44px',
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 64,
              color: C.white,
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{width: 92, height: 92, borderRadius: 26, display: 'grid', placeItems: 'center', background: 'rgba(61,139,255,0.14)'}}>
              <Icon name={card.icon} size={54} color={C.blueSoft} />
            </div>
            {card.label}
          </div>
        );
      })}
      <div style={{position: 'absolute', top: 1180, width: '100%', display: 'flex', justifyContent: 'center'}}>
      <div
        dir="rtl"
        style={{
          ...reveal(frame, fps, {delay: atCost, frames: 12}),
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '20px 36px',
          borderRadius: 999,
          border: '2px solid rgba(255, 140, 120, 0.55)',
          background: 'rgba(120, 30, 30, 0.25)',
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 52,
          color: '#FFD9D2',
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="trend" size={48} color="#FFB4A6" stroke={2.2} />
        {cost}
      </div>
      </div>
    </Shell>
  );
};

export const ProblemBroll = Interactive.create({
  Component: ProblemInner,
  componentName: '<ProblemBroll>',
  layout: 'absolute-fill',
  schema: {
    a: text('Card 1', 'مبرمج'),
    b: text('Card 2', 'مصمّم'),
    c: text('Card 3', 'شركات متفرقة'),
    cost: text('Cost label', 'كوست أضعاف الطبيعي'),
    atA: num('Card 1 frame', 0),
    atB: num('Card 2 frame', 19),
    atC: num('Card 3 frame', 37),
    atCost: num('Cost frame', 81),
  } as const satisfies InteractivitySchema,
});

/* --------------------------------------------------------------- Websites */

const WebsitesInner: React.FC<{title: string; front: string; back: string; fadeIn: boolean; fadeOut: boolean}> = ({title, front, back, fadeIn, fadeOut}) => {
  const frame = useCurrentFrame() + LEAD;
  const {fps, durationInFrames} = useVideoConfig();
  const e1 = enterProgress(frame, fps, 2, 16);
  const e2 = enterProgress(frame, fps, 8, 16);
  const push = lerp(frame, [0, durationInFrames], [1, 1.05]);
  return (
    <Shell title={title} icon="globe" fadeIn={fadeIn} fadeOut={fadeOut}>
      <div style={{position: 'absolute', inset: 0, scale: String(push)}}>
        <Browser
          src={back}
          width={820}
          style={{position: 'absolute', left: 50, top: 520, rotate: '-4deg', opacity: e2 * 0.75, translate: `${(1 - e2) * -80}px 0px`}}
        />
        <Browser
          src={front}
          width={880}
          style={{position: 'absolute', left: 100, top: 700, opacity: e1, translate: `0px ${(1 - e1) * 120}px`, rotate: '1.5deg'}}
        />
      </div>
    </Shell>
  );
};

export const WebsitesBroll = Interactive.create({
  Component: WebsitesInner,
  componentName: '<WebsitesBroll>',
  layout: 'absolute-fill',
  schema: {
    fadeIn: fade('Backdrop fades in'),
    fadeOut: fade('Backdrop fades out'),
    title: text('Title', 'مواقع إلكترونية'),
    front: image('Front screenshot', 'projects/venda-desktop.webp'),
    back: image('Back screenshot', 'projects/mandi-menu-desktop.webp'),
  } as const satisfies InteractivitySchema,
});

/* ------------------------------------------------------------------- Apps */

const AppsInner: React.FC<{title: string; left: string; center: string; right: string; fadeIn: boolean; fadeOut: boolean}> = ({title, left, center, right, fadeIn, fadeOut}) => {
  const frame = useCurrentFrame() + LEAD;
  const {fps} = useVideoConfig();
  const phones = [
    {src: right, x: 250, r: 7, d: 6, s: 0.88},
    {src: left, x: -250, r: -7, d: 6, s: 0.88},
    {src: center, x: 0, r: 0, d: 0, s: 1},
  ];
  return (
    <Shell title={title} icon="phone" fadeIn={fadeIn} fadeOut={fadeOut}>
      {phones.map((p, i) => {
        const e = enterProgress(frame, fps, p.d, 16);
        return (
          <Phone
            key={i}
            src={p.src}
            width={330}
            style={{
              position: 'absolute',
              left: 540 - 165 + p.x * e,
              top: 470,
              rotate: `${p.r * e}deg`,
              scale: String(p.s),
              opacity: e,
              translate: `0px ${(1 - e) * 140}px`,
            }}
          />
        );
      })}
    </Shell>
  );
};

export const AppsBroll = Interactive.create({
  Component: AppsInner,
  componentName: '<AppsBroll>',
  layout: 'absolute-fill',
  schema: {
    fadeIn: fade('Backdrop fades in'),
    fadeOut: fade('Backdrop fades out'),
    title: text('Title', 'تطبيقات موبايل'),
    left: image('Left phone', 'projects/venda-mobile.webp'),
    center: image('Center phone', 'projects/mandi-menu-mobile.webp'),
    right: image('Right phone', 'projects/alsaad-mobile.webp'),
  } as const satisfies InteractivitySchema,
});

/* ----------------------------------------------------------------- Stores */

const StoresInner: React.FC<{title: string; desktop: string; mobile: string; fadeIn: boolean; fadeOut: boolean}> = ({title, desktop, mobile, fadeIn, fadeOut}) => {
  const frame = useCurrentFrame() + LEAD;
  const {fps} = useVideoConfig();
  const e1 = enterProgress(frame, fps, 0, 16);
  const e2 = enterProgress(frame, fps, 8, 16);
  const badge = enterProgress(frame, fps, 18, 10);
  return (
    <Shell title={title} icon="bag" fadeIn={fadeIn} fadeOut={fadeOut}>
      <Browser src={desktop} width={900} style={{position: 'absolute', left: 90, top: 560, opacity: e1, translate: `${(1 - e1) * 80}px 0px`}} />
      <Phone
        src={mobile}
        width={250}
        style={{position: 'absolute', left: 60, top: 820, opacity: e2, translate: `0px ${(1 - e2) * 120}px`, rotate: '-4deg'}}
      />
      <div
        style={{
          position: 'absolute',
          left: 860,
          top: 510,
          width: 120,
          height: 120,
          borderRadius: 999,
          display: 'grid',
          placeItems: 'center',
          background: `linear-gradient(160deg, ${C.blue}, #1F5FD0)`,
          boxShadow: '0 0 40px rgba(61,139,255,0.5)',
          opacity: badge,
          scale: String(0.6 + badge * 0.4),
        }}
      >
        <Icon name="bag" size={58} color={C.white} />
      </div>
    </Shell>
  );
};

export const StoresBroll = Interactive.create({
  Component: StoresInner,
  componentName: '<StoresBroll>',
  layout: 'absolute-fill',
  schema: {
    fadeIn: fade('Backdrop fades in'),
    fadeOut: fade('Backdrop fades out'),
    title: text('Title', 'متاجر إلكترونية'),
    desktop: image('Store screenshot', 'projects/alsaad-desktop.webp'),
    mobile: image('Store mobile', 'projects/mrayco-mobile.webp'),
  } as const satisfies InteractivitySchema,
});

/* ---------------------------------------------------------------- Systems */

const SystemsInner: React.FC<{title: string; a: string; b: string; c: string; fadeIn: boolean; fadeOut: boolean}> = ({title, a, b, c, fadeIn, fadeOut}) => {
  const frame = useCurrentFrame() + LEAD;
  const {fps} = useVideoConfig();
  const screens = [a, b, c];
  return (
    <Shell title={title} icon="grid" fadeIn={fadeIn} fadeOut={fadeOut}>
      <div style={{position: 'absolute', inset: 0, perspective: 1800}}>
        {screens.map((src, i) => {
          const e = enterProgress(frame, fps, i * 5, 16);
          return (
            <Screen
              key={i}
              src={src}
              width={840}
              style={{
                position: 'absolute',
                left: 120 + (i - 1) * 40,
                top: 470 + i * 170,
                opacity: e,
                rotate: `x ${18 - i * 3}deg`,
                translate: `0px ${(1 - e) * 140}px`,
              }}
            />
          );
        })}
      </div>
    </Shell>
  );
};

export const SystemsBroll = Interactive.create({
  Component: SystemsInner,
  componentName: '<SystemsBroll>',
  layout: 'absolute-fill',
  schema: {
    fadeIn: fade('Backdrop fades in'),
    fadeOut: fade('Backdrop fades out'),
    title: text('Title', 'أنظمة متكاملة'),
    a: image('Back screen', 'projects/inventory.svg'),
    b: image('Middle screen', 'projects/pos.svg'),
    c: image('Front screen', 'projects/hr-payroll-light.svg'),
  } as const satisfies InteractivitySchema,
});

/* --------------------------------------------------------------------- AI */

// Deterministic node layout for the neural graphic.
const NODES = [
  [3, [380, 560, 740]],
  [4, [300, 480, 660, 840]],
  [4, [300, 480, 660, 840]],
  [2, [470, 650]],
] as const;

const AiInner: React.FC<{title: string; screen: string; fadeIn: boolean; fadeOut: boolean}> = ({title, screen, fadeIn, fadeOut}) => {
  const frame = useCurrentFrame() + LEAD;
  const {fps} = useVideoConfig();
  const cols = [190, 420, 660, 890];
  const pts = NODES.map(([, ys], c) => ys.map((y) => [cols[c], y + 120] as const));
  const lines: {x1: number; y1: number; x2: number; y2: number; k: number}[] = [];
  pts.slice(0, -1).forEach((col, c) =>
    col.forEach(([x1, y1], i) => pts[c + 1].forEach(([x2, y2], j) => lines.push({x1, y1, x2, y2, k: c * 7 + i * 3 + j}))),
  );
  const e = enterProgress(frame, fps, 0, 14);
  const sc = enterProgress(frame, fps, 10, 14);
  return (
    <Shell title={title} icon="cpu" fadeIn={fadeIn} fadeOut={fadeOut}>
      <svg width={1080} height={1200} style={{position: 'absolute', top: 280, opacity: e}}>
        {lines.map((l, i) => {
          const t = ((frame * 2.2 + l.k * 9) % 60) / 60;
          return (
            <g key={i}>
              <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="rgba(127,178,255,0.18)" strokeWidth={2} />
              <circle cx={l.x1 + (l.x2 - l.x1) * t} cy={l.y1 + (l.y2 - l.y1) * t} r={4} fill={C.blueSoft} opacity={0.85} />
            </g>
          );
        })}
        {pts.flat().map(([x, y], i) => {
          const pulse = 0.6 + 0.4 * Math.sin(frame / 6 + i);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={30} fill="rgba(61,139,255,0.12)" />
              <circle cx={x} cy={y} r={14} fill={C.blue} opacity={pulse} />
            </g>
          );
        })}
      </svg>
      <Screen src={screen} width={640} style={{position: 'absolute', left: 220, top: 1080, opacity: sc, translate: `0px ${(1 - sc) * 80}px`}} />
    </Shell>
  );
};

export const AiBroll = Interactive.create({
  Component: AiInner,
  componentName: '<AiBroll>',
  layout: 'absolute-fill',
  schema: {
    fadeIn: fade('Backdrop fades in'),
    fadeOut: fade('Backdrop fades out'),
    title: text('Title', 'ذكاء اصطناعي'),
    screen: image('AI system screen', 'projects/hr-ai.svg'),
  } as const satisfies InteractivitySchema,
});

/* ------------------------------------------------------------- Automation */

const AutomationInner: React.FC<{title: string; screen: string; n1: string; n2: string; n3: string; fadeIn: boolean; fadeOut: boolean}> = ({title, screen, n1, n2, n3, fadeIn, fadeOut}) => {
  const frame = useCurrentFrame() + LEAD;
  const {fps} = useVideoConfig();
  const nodes: {label: string; icon: IconName; x: number}[] = [
    {label: n1, icon: 'message', x: 830},
    {label: n2, icon: 'zap', x: 540},
    {label: n3, icon: 'check', x: 250},
  ];
  const flow = lerp(frame, [4, 22], [0, 1]);
  const sc = enterProgress(frame, fps, 6, 14);
  return (
    <Shell title={title} icon="zap" fadeIn={fadeIn} fadeOut={fadeOut}>
      <svg width={1080} height={400} style={{position: 'absolute', top: 470}}>
        <line x1={830} y1={140} x2={250} y2={140} stroke="rgba(127,178,255,0.25)" strokeWidth={4} />
        <line x1={830} y1={140} x2={830 - 580 * flow} y2={140} stroke={C.blue} strokeWidth={5} strokeDasharray="16 12" strokeDashoffset={-frame * 3} />
      </svg>
      {nodes.map((n, i) => {
        const e = enterProgress(frame, fps, i * 6, 12);
        return (
          <div
            key={i}
            dir="rtl"
            style={{
              position: 'absolute',
              left: n.x,
              top: 540,
              translate: '-50% 0px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
              opacity: e,
              scale: String(0.85 + e * 0.15),
            }}
          >
            <div style={{...glassCard, width: 140, height: 140, borderRadius: 40, display: 'grid', placeItems: 'center', border: `2px solid ${C.blueSoft}`}}>
              <Icon name={n.icon} size={64} color={C.blueSoft} />
            </div>
            <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 40, color: C.white, whiteSpace: 'nowrap'}}>{n.label}</div>
          </div>
        );
      })}
      <Screen src={screen} width={760} style={{position: 'absolute', left: 160, top: 860, opacity: sc, translate: `0px ${(1 - sc) * 80}px`}} />
    </Shell>
  );
};

export const AutomationBroll = Interactive.create({
  Component: AutomationInner,
  componentName: '<AutomationBroll>',
  layout: 'absolute-fill',
  schema: {
    fadeIn: fade('Backdrop fades in'),
    fadeOut: fade('Backdrop fades out'),
    title: text('Title', 'أتمتة'),
    screen: image('Automation screen', 'projects/whatsapp-bot.svg'),
    n1: text('Node 1', 'رسالة'),
    n2: text('Node 2', 'رد آلي'),
    n3: text('Node 3', 'تم'),
  } as const satisfies InteractivitySchema,
});

/* ---------------------------------------------------------- Custom software */

const CustomInner: React.FC<{title: string; a: string; b: string; c: string; d: string; fadeIn: boolean; fadeOut: boolean}> = ({
  title,
  a,
  b,
  c,
  d,
  fadeIn,
  fadeOut,
}) => {
  const frame = useCurrentFrame() + LEAD;
  const {fps, durationInFrames} = useVideoConfig();
  const drift = lerp(frame, [0, durationInFrames], [0, -30]);
  const cells = [
    {src: a, x: 70, y: 480},
    {src: b, x: 550, y: 480},
    {src: c, x: 70, y: 820},
    {src: d, x: 550, y: 820},
  ];
  return (
    <Shell title={title} icon="layers" fadeIn={fadeIn} fadeOut={fadeOut}>
      <div style={{position: 'absolute', inset: 0, translate: `0px ${drift}px`}}>
        {cells.map((cell, i) => {
          const e = enterProgress(frame, fps, 2 + i * 5, 14);
          return (
            <Screen
              key={i}
              src={cell.src}
              width={460}
              style={{position: 'absolute', left: cell.x, top: cell.y, opacity: e, scale: String(0.92 + e * 0.08), translate: `0px ${(1 - e) * 60}px`}}
            />
          );
        })}
      </div>
    </Shell>
  );
};

export const CustomBroll = Interactive.create({
  Component: CustomInner,
  componentName: '<CustomBroll>',
  layout: 'absolute-fill',
  schema: {
    fadeIn: fade('Backdrop fades in'),
    fadeOut: fade('Backdrop fades out'),
    title: text('Title', 'حلول برمجية خاصة'),
    a: image('Screen 1', 'projects/clinic.svg'),
    b: image('Screen 2', 'projects/schools.svg'),
    c: image('Screen 3', 'projects/menu.svg'),
    d: image('Screen 4', 'projects/clinic-booking-light.svg'),
  } as const satisfies InteractivitySchema,
});

/* --------------------------------------------------------------- Identity */

const IdentityInner: React.FC<{title: string; logo: string; fadeIn: boolean; fadeOut: boolean}> = ({title, logo, fadeIn, fadeOut}) => {
  const frame = useCurrentFrame() + LEAD;
  const {fps} = useVideoConfig();
  const swatches = [C.navyBrand, C.navy600, C.logoBlue, C.silver, '#FFFFFF'];
  const card = enterProgress(frame, fps, 0, 16);
  return (
    <Shell title={title} icon="palette" fadeIn={fadeIn} fadeOut={fadeOut}>
      <div
        style={{
          position: 'absolute',
          left: 110,
          right: 110,
          top: 480,
          height: 440,
          borderRadius: 36,
          background: 'linear-gradient(150deg, #FFFFFF, #E6ECF3)',
          display: 'grid',
          placeItems: 'center',
          opacity: card,
          translate: `0px ${(1 - card) * 80}px`,
          boxShadow: '0 40px 90px rgba(0, 6, 16, 0.5)',
        }}
      >
        <Img src={staticFile(logo)} style={{width: 420, height: (420 * 742) / 938}} />
      </div>
      <div style={{position: 'absolute', top: 980, left: 110, right: 110, display: 'flex', gap: 18}}>
        {swatches.map((s, i) => {
          const e = enterProgress(frame, fps, 10 + i * 4, 12);
          return (
            <div
              key={s}
              style={{
                flex: 1,
                height: 150,
                borderRadius: 26,
                background: s,
                border: '1.5px solid rgba(201,211,222,0.35)',
                opacity: e,
                translate: `0px ${(1 - e) * 40}px`,
              }}
            />
          );
        })}
      </div>
      <div
        dir="rtl"
        style={{
          position: 'absolute',
          top: 1170,
          width: '100%',
          textAlign: 'center',
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 54,
          color: C.silver,
          ...reveal(frame, fps, {delay: 30, frames: 12}),
        }}
      >
        Readex Pro · أبجد هوز
      </div>
    </Shell>
  );
};

export const IdentityBroll = Interactive.create({
  Component: IdentityInner,
  componentName: '<IdentityBroll>',
  layout: 'absolute-fill',
  schema: {
    fadeIn: fade('Backdrop fades in'),
    fadeOut: fade('Backdrop fades out'),
    title: text('Title', 'تصاميم وهويات بصرية'),
    logo: image('Identity logo', 'brand/lockup.png'),
  } as const satisfies InteractivitySchema,
});

/* --------------------------------------------- Continuous backdrop for graphics */

const BackdropInner: React.FC<{fadeIn: boolean; fadeOut: boolean}> = ({fadeIn, fadeOut}) => (
  <Shell fadeIn={fadeIn} fadeOut={fadeOut}>
    {null}
  </Shell>
);

export const GraphicsBackdrop = Interactive.create({
  Component: BackdropInner,
  componentName: '<GraphicsBackdrop>',
  layout: 'absolute-fill',
  schema: {
    fadeIn: fade('Fades in'),
    fadeOut: fade('Fades out'),
  } as const satisfies InteractivitySchema,
});
