// Graphics that sit in the headroom above the speaker (y ≈ 230–620) so the face stays clear.
import React from 'react';
import {Img, Interactive, staticFile, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';
import {C, FONT, glassCard} from '../theme';
import {enterProgress, exitProgress, lerp, reveal} from '../motion';
import {Icon, type IconName} from './Icon';

const HEAD_TOP = 250;

const text = (description: string, def: string) => ({type: 'string', default: def, description}) as const;
const num = (description: string, def: number, max = 600) =>
  ({type: 'number', min: 0, max, step: 1, default: def, description, hiddenFromList: false}) as const;

/* ---------------------------------------------------------------- Hook title */

const HookTitleInner: React.FC<{line: string; accent: string}> = ({line, accent}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const words = line.split(' ');
  const accentWords = new Set(accent.split(' '));
  return (
    <div style={{position: 'absolute', top: HEAD_TOP + 30, width: '100%', display: 'flex', justifyContent: 'center'}}>
      <div
        dir="rtl"
        lang="ar"
        style={{
          ...glassCard,
          ...reveal(frame, fps, {end: durationInFrames, frames: 10, rise: 18}),
          padding: '22px 44px 28px',
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 88,
          color: C.white,
          display: 'flex',
          gap: 22,
        }}
      >
        {words.map((w, i) => {
          const p = enterProgress(frame, fps, 3 + i * 4, 10);
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                opacity: p,
                translate: `0px ${(1 - p) * 20}px`,
                filter: `blur(${(1 - p) * 8}px)`,
                color: accentWords.has(w) ? C.blueSoft : C.white,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const HookTitle = Interactive.create({
  Component: HookTitleInner,
  componentName: '<HookTitle>',
  layout: 'absolute-fill',
  schema: {
    line: text('Title', 'عندك فكرة مشروع؟'),
    accent: text('Words shown in blue', 'فكرة مشروع؟'),
  } as const satisfies InteractivitySchema,
});

/* ------------------------------------------------- Three services → one place */

const OnePlaceInner: React.FC<{a: string; b: string; c: string; result: string; mergeAt: number}> = ({
  a,
  b,
  c,
  result,
  mergeAt,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const m = lerp(frame, [mergeAt, mergeAt + 14], [0, 1]);
  const items: {label: string; icon: IconName; x: number; y: number}[] = [
    {label: a, icon: 'code', x: 300, y: -10},
    {label: b, icon: 'pen', x: 0, y: 40},
    {label: c, icon: 'building', x: -300, y: -10},
  ];
  const out = exitProgress(frame, durationInFrames, 8);
  const r = enterProgress(frame, fps, mergeAt + 8, 12);
  return (
    <div style={{position: 'absolute', top: HEAD_TOP + 70, left: 0, right: 0, height: 260, opacity: 1 - out}}>
      {items.map((it, i) => {
        const e = enterProgress(frame, fps, i * 4, 12);
        return (
          <div
            key={i}
            dir="rtl"
            style={{
              ...glassCard,
              position: 'absolute',
              left: '50%',
              top: 40,
              translate: `calc(-50% + ${it.x * (1 - m)}px) ${it.y * (1 - m) + (1 - e) * 24}px`,
              opacity: e * (1 - m),
              scale: String(1 - m * 0.4),
              padding: '18px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 42,
              color: C.silver,
              borderRadius: 999,
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name={it.icon} size={38} color={C.blueSoft} />
            {it.label}
          </div>
        );
      })}
      <div
        dir="rtl"
        style={{
          ...glassCard,
          position: 'absolute',
          left: '50%',
          top: 30,
          translate: '-50% 0px',
          opacity: r,
          scale: String(0.9 + r * 0.1),
          filter: `blur(${(1 - r) * 8}px)`,
          padding: '22px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 58,
          color: C.white,
          borderRadius: 999,
          border: `2px solid ${C.blue}`,
          boxShadow: `0 0 60px rgba(61, 139, 255, 0.35), 0 30px 80px rgba(0, 8, 20, 0.45)`,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="check" size={48} color={C.blueSoft} stroke={2.4} />
        {result}
      </div>
    </div>
  );
};

export const OnePlace = Interactive.create({
  Component: OnePlaceInner,
  componentName: '<OnePlace>',
  layout: 'absolute-fill',
  schema: {
    a: text('First service', 'مبرمج'),
    b: text('Second service', 'مصمّم'),
    c: text('Third service', 'شركات'),
    result: text('Merged label', 'الحل بمكان واحد'),
    mergeAt: num('Merge frame', 12),
  } as const satisfies InteractivitySchema,
});

/* ------------------------------------------------------------- Logo reveal */

const LogoRevealInner: React.FC<{logo: string; logoWidth: number}> = ({logo, logoWidth: width}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const p = enterProgress(frame, fps, 0, 18);
  const wipe = lerp(frame, [0, 16], [100, 0]);
  const sweep = lerp(frame, [12, 34], [-40, 140]);
  const out = exitProgress(frame, durationInFrames, 9);
  const src = staticFile(logo);
  const height = (width * 120) / 733;
  return (
    <div style={{position: 'absolute', top: HEAD_TOP + 60, width: '100%', display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          position: 'relative',
          padding: '36px 54px',
          borderRadius: 36,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.92), rgba(226,233,241,0.86))',
          border: '1.5px solid rgba(201, 211, 222, 0.9)',
          boxShadow: `0 0 ${60 * p}px rgba(61, 139, 255, ${0.28 * p}), 0 28px 70px rgba(0, 8, 20, 0.28)`,
          opacity: p * (1 - out),
          scale: String(0.94 + p * 0.06 - out * 0.03),
          filter: `blur(${(1 - p) * 10 + out * 6}px)`,
        }}
      >
        <div style={{position: 'relative', width, height, clipPath: `inset(0 0 0 ${wipe}%)`}}>
          <Img src={src} style={{width, height, display: 'block'}} />
          {/* Silver light sweep, masked to the logo shape so the artwork itself is untouched */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(105deg, transparent ${sweep - 18}%, rgba(255,255,255,0.95) ${sweep}%, transparent ${sweep + 18}%)`,
              maskImage: `url(${src})`,
              maskSize: '100% 100%',
              WebkitMaskImage: `url(${src})`,
              WebkitMaskSize: '100% 100%',
              mixBlendMode: 'screen',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const LogoReveal = Interactive.create({
  Component: LogoRevealInner,
  componentName: '<LogoReveal>',
  layout: 'absolute-fill',
  schema: {
    logo: {type: 'asset', assetType: 'image', default: 'brand/horizontal.png', description: 'Logo file'},
    logoWidth: num('Logo width', 640, 1000),
  } as const satisfies InteractivitySchema,
});

/* ------------------------------------------------- Idea → Launch progression */

type Step = {icon: IconName; ar: string; en: string};

const StepRow: React.FC<{steps: Step[]; activateAt: readonly number[]; size?: number}> = ({steps, activateAt, size = 128}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const first = activateAt[0] ?? 0;
  const last = activateAt[activateAt.length - 1] ?? 0;
  const fill = lerp(frame, [first, last + 6], [0, 1]);
  return (
    <div dir="rtl" style={{position: 'relative', display: 'flex', justifyContent: 'space-between', width: '100%'}}>
      <div
        style={{
          position: 'absolute',
          top: size / 2 - 2,
          right: size / 2,
          left: size / 2,
          height: 4,
          background: 'rgba(201, 211, 222, 0.2)',
          borderRadius: 4,
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: 0,
            height: '100%',
            width: `${fill * 100}%`,
            background: `linear-gradient(270deg, ${C.blueSoft}, ${C.blue})`,
            borderRadius: 4,
            boxShadow: `0 0 18px ${C.blue}`,
          }}
        />
      </div>
      {steps.map((s, i) => {
        const at = activateAt[i] ?? 0;
        const e = enterProgress(frame, fps, at - 6, 10);
        const on = lerp(frame, [at, at + 6], [0, 1]);
        return (
          <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: size + 30, opacity: 0.35 + e * 0.65}}>
            <div
              style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                display: 'grid',
                placeItems: 'center',
                background: on > 0.5 ? `linear-gradient(160deg, ${C.blue}, #1F5FD0)` : 'rgba(20, 40, 64, 0.9)',
                border: `2px solid ${on > 0.5 ? C.blueSoft : 'rgba(201, 211, 222, 0.3)'}`,
                boxShadow: on > 0.5 ? `0 0 ${34 * on}px rgba(61, 139, 255, 0.55)` : 'none',
                scale: String(0.9 + on * 0.1),
                position: 'relative',
              }}
            >
              <Icon name={s.icon} size={size * 0.44} color={C.white} />
            </div>
            <div style={{fontFamily: FONT, fontWeight: 700, fontSize: size * 0.3, color: C.white, whiteSpace: 'nowrap'}}>{s.ar}</div>
            {s.en ? (
              <div style={{fontFamily: FONT, fontWeight: 500, fontSize: size * 0.13, letterSpacing: 2, color: C.silverDim}}>{s.en}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

const IdeaToLaunchInner: React.FC<{s1: string; s2: string; s3: string; s4: string; activateAt: readonly number[]}> = ({
  s1,
  s2,
  s3,
  s4,
  activateAt,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  return (
    <div style={{position: 'absolute', top: HEAD_TOP + 20, left: 60, right: 60}}>
      <div style={{...glassCard, ...reveal(frame, fps, {end: durationInFrames, frames: 10}), padding: '34px 36px 30px'}}>
        <StepRow
          activateAt={activateAt}
          size={124}
          steps={[
            {icon: 'bulb', ar: s1, en: 'IDEA'},
            {icon: 'pen', ar: s2, en: 'DESIGN'},
            {icon: 'code', ar: s3, en: 'DEVELOPMENT'},
            {icon: 'rocket', ar: s4, en: 'LAUNCH'},
          ]}
        />
      </div>
    </div>
  );
};

export const IdeaToLaunch = Interactive.create({
  Component: IdeaToLaunchInner,
  componentName: '<IdeaToLaunch>',
  layout: 'absolute-fill',
  schema: {
    s1: text('Step 1', 'فكرة'),
    s2: text('Step 2', 'تصميم'),
    s3: text('Step 3', 'تطوير'),
    s4: text('Step 4', 'إطلاق'),
    activateAt: {
      type: 'array',
      item: {type: 'number', min: 0, step: 1},
      default: [0, 10, 20, 30],
      newItemDefault: 0,
      description: 'Frame each step lights up',
    },
  } as const satisfies InteractivitySchema,
});

/* --------------------------------------------------------- Process steps */

const ProcessStepsInner: React.FC<{
  s1: string;
  s2: string;
  s3: string;
  s4: string;
  s5: string;
  s6: string;
  activateAt: readonly number[];
}> = ({s1, s2, s3, s4, s5, s6, activateAt}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  return (
    <div style={{position: 'absolute', top: HEAD_TOP + 20, left: 44, right: 44}}>
      <div style={{...glassCard, ...reveal(frame, fps, {end: durationInFrames, frames: 10}), padding: '30px 22px 26px'}}>
        <StepRow
          activateAt={activateAt}
          size={98}
          steps={[
            {icon: 'search', ar: s1, en: ''},
            {icon: 'map', ar: s2, en: ''},
            {icon: 'pen', ar: s3, en: ''},
            {icon: 'code', ar: s4, en: ''},
            {icon: 'rocket', ar: s5, en: ''},
            {icon: 'trend', ar: s6, en: ''},
          ]}
        />
      </div>
    </div>
  );
};

export const ProcessSteps = Interactive.create({
  Component: ProcessStepsInner,
  componentName: '<ProcessSteps>',
  layout: 'absolute-fill',
  schema: {
    s1: text('Step 1', 'نفهم'),
    s2: text('Step 2', 'نخطّط'),
    s3: text('Step 3', 'نصمّم'),
    s4: text('Step 4', 'نبرمج'),
    s5: text('Step 5', 'نطلق'),
    s6: text('Step 6', 'نطوّر'),
    activateAt: {
      type: 'array',
      item: {type: 'number', min: 0, step: 1},
      default: [0, 10, 20, 30, 40, 50],
      newItemDefault: 0,
      description: 'Frame each step lights up',
    },
  } as const satisfies InteractivitySchema,
});

/* ------------------------------------------------------------------ Chip */

const ChipInner: React.FC<{label: string; icon: string}> = ({label, icon}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  return (
    <div style={{position: 'absolute', top: HEAD_TOP + 70, width: '100%', display: 'flex', justifyContent: 'center'}}>
      <div
        dir="rtl"
        style={{
          ...glassCard,
          ...reveal(frame, fps, {end: durationInFrames, frames: 12}),
          padding: '22px 40px',
          borderRadius: 999,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 54,
          color: C.white,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name={icon as IconName} size={50} color={C.blueSoft} />
        {label}
      </div>
    </div>
  );
};

export const Chip = Interactive.create({
  Component: ChipInner,
  componentName: '<Chip>',
  layout: 'absolute-fill',
  schema: {
    label: text('Label', 'حلول برمجية خاصة'),
    icon: text('Icon name', 'layers'),
  } as const satisfies InteractivitySchema,
});

/* ------------------------------------------------------- All in one place */

const AllInOneInner: React.FC<{label: string; mergeAt: number}> = ({label, mergeAt}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const icons: IconName[] = ['globe', 'phone', 'bag', 'grid', 'cpu', 'palette'];
  const m = lerp(frame, [mergeAt, mergeAt + 16], [0, 1]);
  const core = enterProgress(frame, fps, mergeAt + 6, 14);
  const out = exitProgress(frame, durationInFrames, 9);
  const R = 250;
  return (
    <div style={{position: 'absolute', top: HEAD_TOP + 10, width: '100%', height: 420, opacity: 1 - out}}>
      <div style={{position: 'absolute', left: '50%', top: 175}}>
        {icons.map((name, i) => {
          const a = (i / icons.length) * Math.PI * 2 - Math.PI / 2;
          const e = enterProgress(frame, fps, i * 3, 12);
          const r = R * (1 - m) * (0.8 + e * 0.2);
          return (
            <div
              key={name}
              style={{
                ...glassCard,
                position: 'absolute',
                width: 104,
                height: 104,
                borderRadius: 30,
                display: 'grid',
                placeItems: 'center',
                translate: `${Math.cos(a) * r * 1.35 - 52}px ${Math.sin(a) * r * 0.62 - 52}px`,
                opacity: e * (1 - m * 0.95),
                scale: String(1 - m * 0.5),
              }}
            >
              <Icon name={name} size={50} color={C.blueSoft} />
            </div>
          );
        })}
        {/* The services converge into the full brand lockup (mark + name) */}
        <div
          style={{
            position: 'absolute',
            width: 520,
            height: 520,
            translate: '-260px -260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(61, 139, 255, 0.38), transparent 65%)',
            opacity: core,
          }}
        />
        <Img
          src={staticFile('brand/lockup-white.png')}
          style={{
            position: 'absolute',
            width: 340,
            height: (340 * 742) / 938,
            translate: `-170px ${-(170 * 742) / 938}px`,
            opacity: core,
            scale: String(0.8 + core * 0.2),
            filter: `blur(${(1 - core) * 10}px)`,
          }}
        />
      </div>
      {label ? (
        <div
          dir="rtl"
          style={{
            position: 'absolute',
            top: 300,
            width: '100%',
            textAlign: 'center',
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 50,
            color: C.white,
            textShadow: '0 4px 24px rgba(0, 8, 20, 0.7)',
            ...reveal(frame, fps, {delay: mergeAt + 12, frames: 12}),
          }}
        >
          <span style={{...glassCard, padding: '14px 32px', borderRadius: 999}}>{label}</span>
        </div>
      ) : null}
    </div>
  );
};

export const AllInOne = Interactive.create({
  Component: AllInOneInner,
  componentName: '<AllInOne>',
  layout: 'absolute-fill',
  schema: {
    label: text('Label', 'كل احتياجاتك التقنية بمكان واحد'),
    mergeAt: num('Merge frame', 40),
  } as const satisfies InteractivitySchema,
});

/* -------------------------------------------------------------- CTA chip */

const CtaChipInner: React.FC<{lead: string; keyword: string; sendAt: number}> = ({lead, keyword, sendAt}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const k = enterProgress(frame, fps, 10, 12);
  const send = lerp(frame, [sendAt, sendAt + 8], [0, 1]);
  const caret = Math.floor(frame / 15) % 2 === 0 && send < 0.5 ? 1 : 0;
  return (
    <div style={{position: 'absolute', top: HEAD_TOP + 30, left: 90, right: 90}}>
      <div dir="rtl" style={{...glassCard, ...reveal(frame, fps, {end: durationInFrames, frames: 12}), padding: '28px 32px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT, fontWeight: 600, fontSize: 40, color: C.silver}}>
          <Icon name="message" size={40} color={C.blueSoft} />
          {lead}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 22}}>
          <div
            style={{
              flex: 1,
              height: 104,
              borderRadius: 999,
              background: 'rgba(255, 255, 255, 0.08)',
              border: `1.5px solid ${C.glassBorder}`,
              display: 'flex',
              alignItems: 'center',
              padding: '0 36px',
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 56,
              color: C.white,
            }}
          >
            <span style={{opacity: k, filter: `blur(${(1 - k) * 6}px)`}}>{keyword}</span>
            <span style={{width: 4, height: 56, background: C.blueSoft, marginRight: 10, opacity: caret}} />
          </div>
          <div
            style={{
              width: 104,
              height: 104,
              borderRadius: 999,
              display: 'grid',
              placeItems: 'center',
              background: `linear-gradient(160deg, ${C.blue}, #1F5FD0)`,
              boxShadow: `0 0 ${20 + send * 40}px rgba(61, 139, 255, ${0.35 + send * 0.4})`,
              scale: String(1 + Math.sin(send * Math.PI) * 0.1),
            }}
          >
            <div style={{rotate: '-90deg', translate: '-3px 2px'}}>
              <Icon name="send" size={48} color={C.white} stroke={2.2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CtaChip = Interactive.create({
  Component: CtaChipInner,
  componentName: '<CtaChip>',
  layout: 'absolute-fill',
  schema: {
    lead: text('Lead text', 'راسلنا بكلمة'),
    keyword: text('Keyword', 'فكرة'),
    sendAt: num('Send button pulse frame', 40),
  } as const satisfies InteractivitySchema,
});

/* ------------------------------------------------------------- Watermark */

const WatermarkInner: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  return (
    <div
      style={{
        ...glassCard,
        position: 'absolute',
        top: 236,
        left: 56,
        width: 88,
        height: 88,
        borderRadius: 26,
        display: 'grid',
        placeItems: 'center',
        ...reveal(frame, fps, {end: durationInFrames, frames: 12, rise: 0, blur: 6}),
      }}
    >
      <Img src={staticFile('brand/mark-white.png')} style={{width: 52, height: 54}} />
    </div>
  );
};

export const Watermark = Interactive.create({
  Component: WatermarkInner,
  componentName: '<Watermark>',
  layout: 'absolute-fill',
  schema: {} as const satisfies InteractivitySchema,
});

/* ------------------------------------------------- Goal: delivery vs. a real solution */

const GoalCompareInner: React.FC<{before: string; after: string; afterAt: number}> = ({before, after, afterAt}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const strike = lerp(frame, [afterAt - 10, afterAt + 4], [0, 1]);
  const a = enterProgress(frame, fps, afterAt, 14);
  const trend = lerp(frame, [afterAt + 6, afterAt + 40], [0, 1]);
  return (
    <div style={{position: 'absolute', top: HEAD_TOP + 20, left: 90, right: 90}}>
      <div dir="rtl" style={{...glassCard, ...reveal(frame, fps, {end: durationInFrames, frames: 12}), padding: '30px 36px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT, fontWeight: 600, fontSize: 44, color: C.silverDim}}>
          <Icon name="layers" size={42} color={C.silverDim} />
          <span style={{position: 'relative'}}>
            {before}
            <span
              style={{
                position: 'absolute',
                right: 0,
                top: '55%',
                height: 3,
                width: `${strike * 100}%`,
                background: C.silverDim,
              }}
            />
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginTop: 22,
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 54,
            color: C.white,
            opacity: a,
            translate: `0px ${(1 - a) * 18}px`,
            filter: `blur(${(1 - a) * 8}px)`,
          }}
        >
          <Icon name="check" size={50} color={C.blueSoft} stroke={2.4} />
          {after}
          <svg width={120} height={60} viewBox="0 0 120 60" style={{marginRight: 'auto'}}>
            <polyline
              points="4,54 36,38 62,44 116,6"
              fill="none"
              stroke={C.blue}
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={160}
              strokeDashoffset={160 * (1 - trend)}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export const GoalCompare = Interactive.create({
  Component: GoalCompareInner,
  componentName: '<GoalCompare>',
  layout: 'absolute-fill',
  schema: {
    before: text('Crossed-out line', 'مو بس نسلّمك مشروع'),
    after: text('Highlighted line', 'حل يخدم شغلك ويتطوّر'),
    afterAt: num('Second line frame', 90),
  } as const satisfies InteractivitySchema,
});

/* ------------------------------------------------ Audience: company or new idea */

const AudienceInner: React.FC<{a: string; b: string; atA: number; atB: number}> = ({a, b, atA, atB}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const out = exitProgress(frame, durationInFrames, 8);
  const chips: {label: string; icon: IconName; at: number}[] = [
    {label: a, icon: 'building', at: atA},
    {label: b, icon: 'bulb', at: atB},
  ];
  return (
    <div dir="rtl" style={{position: 'absolute', top: HEAD_TOP + 60, left: 70, right: 70, display: 'flex', gap: 24, opacity: 1 - out}}>
      {chips.map((c, i) => (
        <div
          key={i}
          style={{
            ...glassCard,
            ...reveal(frame, fps, {delay: c.at, frames: 12}),
            flex: 1,
            padding: '26px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 44,
            color: C.white,
            whiteSpace: 'nowrap',
          }}
        >
          <Icon name={c.icon} size={46} color={C.blueSoft} />
          {c.label}
        </div>
      ))}
    </div>
  );
};

export const AudienceSplit = Interactive.create({
  Component: AudienceInner,
  componentName: '<AudienceSplit>',
  layout: 'absolute-fill',
  schema: {
    a: text('First audience', 'شركة تريد تطوّرها'),
    b: text('Second audience', 'فكرة ببدايتها'),
    atA: num('First chip frame', 20),
    atB: num('Second chip frame', 70),
  } as const satisfies InteractivitySchema,
});
