// Brand moments: the slogan reveal, the end screen and the standalone logo sting.
import React from 'react';
import {AbsoluteFill, Img, Interactive, staticFile, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';
import {C, FONT, brollBackground, glassCard} from '../theme';
import {enterProgress, exitProgress, lerp, reveal} from '../motion';
import {Icon} from './Icon';

const text = (description: string, def: string) => ({type: 'string', default: def, description}) as const;
const num = (description: string, def: number) => ({type: 'number', min: 0, max: 600, step: 1, default: def, description, hiddenFromList: false}) as const;

const LOCKUP_RATIO = 742 / 938;

/** Original logo with a silver sweep masked to its own alpha. */
const ShinyLogo: React.FC<{src: string; width: number; ratio: number; sweepFrom: number}> = ({src, width, ratio, sweepFrom}) => {
  const frame = useCurrentFrame();
  const sweep = lerp(frame, [sweepFrom, sweepFrom + 26], [-40, 140]);
  const url = staticFile(src);
  return (
    <div style={{position: 'relative', width, height: width * ratio}}>
      <Img src={url} style={{width, height: width * ratio, display: 'block'}} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(105deg, transparent ${sweep - 16}%, rgba(255,255,255,0.9) ${sweep}%, transparent ${sweep + 16}%)`,
          maskImage: `url(${url})`,
          maskSize: '100% 100%',
          WebkitMaskImage: `url(${url})`,
          WebkitMaskSize: '100% 100%',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------ Slogan reveal */

const SloganInner: React.FC<{first: string; second: string; sloganAt: number}> = ({first, second, sloganAt}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const bg = lerp(frame, [0, 8], [0, 1]);
  const out = exitProgress(frame, durationInFrames, 8);
  const logo = enterProgress(frame, fps, 2, 18);
  const w1 = enterProgress(frame, fps, sloganAt, 12);
  const w2 = enterProgress(frame, fps, sloganAt + 14, 12);
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <AbsoluteFill
        style={{
          top: -8,
          left: -8,
          width: 'calc(100% + 16px)',
          height: 'calc(100% + 16px)',
          background: 'radial-gradient(90% 60% at 50% 40%, rgba(14,31,51,0.82), rgba(8,19,31,0.94))',
          backdropFilter: `blur(${bg * 18}px)`,
          opacity: bg,
        }}
      />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 260}}>
        <div style={{opacity: logo, scale: String(0.9 + logo * 0.1), filter: `blur(${(1 - logo) * 12}px)`}}>
          <div
            style={{
              position: 'absolute',
              inset: -120,
              background: 'radial-gradient(circle, rgba(61,139,255,0.35), transparent 65%)',
              opacity: logo,
            }}
          />
          <ShinyLogo src="brand/lockup-white.png" width={560} ratio={LOCKUP_RATIO} sweepFrom={10} />
        </div>
        <div dir="rtl" style={{display: 'flex', gap: 26, marginTop: 70, fontFamily: FONT, fontWeight: 700, fontSize: 104}}>
          <span style={{color: C.white, opacity: w1, translate: `0px ${(1 - w1) * 24}px`, filter: `blur(${(1 - w1) * 10}px)`}}>{first}</span>
          <span style={{color: C.blueSoft, opacity: w2, translate: `0px ${(1 - w2) * 24}px`, filter: `blur(${(1 - w2) * 10}px)`}}>{second}</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const SloganReveal = Interactive.create({
  Component: SloganInner,
  componentName: '<SloganReveal>',
  layout: 'absolute-fill',
  schema: {
    first: text('Slogan part 1', 'فكرتك،'),
    second: text('Slogan part 2', 'تنفيذنا'),
    sloganAt: num('Slogan frame', 23),
  } as const satisfies InteractivitySchema,
});

/* --------------------------------------------------------------- End screen */

const EndInner: React.FC<{slogan: string; cta: string; website: string}> = ({slogan, cta, website}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logo = enterProgress(frame, fps, 0, 16);
  return (
    <AbsoluteFill style={{...brollBackground, top: -8, left: -8, width: 'calc(100% + 16px)', height: 'calc(100% + 16px)', alignItems: 'center', justifyContent: 'center', paddingBottom: 140}}>
      <div style={{opacity: logo, scale: String(0.94 + logo * 0.06), filter: `blur(${(1 - logo) * 10}px)`}}>
        <ShinyLogo src="brand/lockup-white.png" width={520} ratio={LOCKUP_RATIO} sweepFrom={6} />
      </div>
      <div dir="rtl" style={{marginTop: 60, fontFamily: FONT, fontWeight: 700, fontSize: 78, color: C.white, ...reveal(frame, fps, {delay: 8, frames: 12})}}>
        {slogan}
      </div>
      <div
        dir="rtl"
        style={{
          ...glassCard,
          ...reveal(frame, fps, {delay: 16, frames: 12}),
          marginTop: 56,
          padding: '22px 44px',
          borderRadius: 999,
          border: `2px solid ${C.blue}`,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 52,
          color: C.white,
        }}
      >
        <Icon name="message" size={48} color={C.blueSoft} />
        {cta}
      </div>
      <div style={{marginTop: 40, fontFamily: FONT, fontWeight: 500, fontSize: 38, letterSpacing: 1, color: C.silverDim, ...reveal(frame, fps, {delay: 22, frames: 12})}}>
        {website}
      </div>
    </AbsoluteFill>
  );
};

export const EndScreen = Interactive.create({
  Component: EndInner,
  componentName: '<EndScreen>',
  layout: 'absolute-fill',
  schema: {
    slogan: text('Slogan', 'فكرتك، تنفيذنا'),
    cta: text('Call to action', 'راسلنا بكلمة «فكرة»'),
    website: text('Website', 'tech.monafithoon.com'),
  } as const satisfies InteractivitySchema,
});

/* ------------------------------------------------- Standalone logo animation */

export const LogoSting: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = enterProgress(frame, fps, 4, 20);
  return (
    <AbsoluteFill style={{...brollBackground, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', width: 900, height: 900, background: 'radial-gradient(circle, rgba(61,139,255,0.3), transparent 65%)', opacity: p}} />
      <div style={{opacity: p, scale: String(0.9 + p * 0.1), filter: `blur(${(1 - p) * 14}px)`}}>
        <ShinyLogo src="brand/lockup-white.png" width={620} ratio={LOCKUP_RATIO} sweepFrom={18} />
      </div>
    </AbsoluteFill>
  );
};
