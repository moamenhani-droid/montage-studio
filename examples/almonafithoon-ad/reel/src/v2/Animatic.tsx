// المرحلة الثانية: المسودة الحركية — كاميرا متصلة على لوحة واحدة، كتل بسيطة، ونص متزامن مع الصوت.
import {Audio} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../theme';
import {CtaChip, HookTitle} from '../components/Overlays';
import {Icon, type IconName} from '../components/Icon';
import {EndScreen} from '../components/Brand';
import {DATA} from './animaticData';
import {Counter, Dimension, Grain, Logo, OutlineText, PixelCluster, SAFE, T, TYPE, ar} from './kit';
import {SCENE_ART, cue} from './Scenes';
import {Paper, SketchEnd, SketchScene} from '../v3/Sketch';

type Line = {readonly words: readonly {readonly t: number; readonly text: string}[]; readonly keys: readonly number[]};
type Scene = (typeof DATA.scenes)[number];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const camEase = Easing.inOut(Easing.cubic);

const HOOK_END = DATA.face.hook.end;
const CTA_START = DATA.face.cta.start;
const PUSH = [HOOK_END - 24, HOOK_END + 16] as const; // office → canvas
const PULL = [CTA_START - 4, CTA_START + 24] as const; // canvas → office, after the slogan lands

/* ------------------------------------------------------------ camera */

const useCamera = (frame: number) => {
  const sc = DATA.scenes;
  let x: number = sc[0].cam.x;
  let y: number = sc[0].cam.y;
  let dip = 1;
  for (let i = 1; i < sc.length; i++) {
    const a = sc[i].start - 8;
    const b = sc[i].start + 13;
    if (frame >= b) {
      x = sc[i].cam.x;
      y = sc[i].cam.y;
    } else if (frame > a) {
      const p = interpolate(frame, [a, b], [0, 1], {...clamp, easing: camEase});
      x = sc[i - 1].cam.x + (sc[i].cam.x - sc[i - 1].cam.x) * p;
      y = sc[i - 1].cam.y + (sc[i].cam.y - sc[i - 1].cam.y) * p;
      dip = 1 - Math.sin(p * Math.PI) * 0.08; // pull back slightly mid-move for depth
    }
  }
  // a slow push inside every scene keeps the frame alive
  const cur = sc.find((s) => frame >= s.start && frame < s.end);
  const drift = cur ? interpolate(frame, [cur.start, cur.end], [1, 1.035], clamp) : 1;
  return {x, y, scale: dip * drift};
};

/* ------------------------------------------------------- kinetic type */

const Kinetic: React.FC<{lines: readonly Line[]; frame: number; top: number; big?: boolean; quiet?: boolean}> = ({lines, frame, top, big, quiet}) => {
  let li = -1;
  lines.forEach((l, i) => {
    if (frame >= l.words[0].t - 2) li = i;
  });
  if (li < 0) return null;
  const line = lines[li];
  const n = line.words.length;
  const size = big ? TYPE.display : quiet ? 50 : n <= 2 ? TYPE.h1 : n <= 4 ? TYPE.h2 + 8 : TYPE.h2 - 6;
  const lineIn = interpolate(frame, [line.words[0].t - 2, line.words[0].t + 4], [0, 1], {...clamp, easing: ease});
  return (
    <div style={{position: 'absolute', top, left: SAFE.left, right: SAFE.left}}>
      {li > 0 ? (
        <div dir="rtl" style={{fontFamily: FONT, fontWeight: 600, fontSize: 38, color: T.silverDim, textAlign: 'center', marginBottom: 14, opacity: 1 - lineIn * 0.5}}>
          {lines[li - 1].words.map((w) => w.text).join(' ')}
        </div>
      ) : null}
      <div
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.22,
          textAlign: 'center',
          textWrap: 'balance',
          opacity: lineIn,
          translate: `0px ${(1 - lineIn) * 16}px`,
        }}
      >
        {line.words.map((w, i) => {
          const p = interpolate(frame, [w.t - 1, w.t + 3], [0, 1], {...clamp, easing: ease});
          const key = line.keys.includes(i);
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                color: key ? T.blueSoft : T.white,
                opacity: 0.14 + p * 0.86,
                translate: `0px ${(1 - p) * 8}px`,
                filter: p > 0.2 && p < 1 ? `blur(${(1 - p) * 4}px)` : undefined,
                marginLeft: '0.28em',
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------------------- scene blocks */

const Block: React.FC<{b: Scene['blocks'][number]; frame: number}> = ({b, frame}) => {
  const p = interpolate(frame, [b.at - 2, b.at + 10], [0, 1], {...clamp, easing: ease});
  const shot = b.kind.startsWith('shot:') ? b.kind.slice(5) : null;
  return (
    <div
      style={{
        position: 'absolute',
        left: b.x,
        top: b.y,
        width: b.w,
        height: b.h,
        borderRadius: 22,
        border: `2px dashed ${T.blueSoft}`,
        background: 'rgba(139,188,255,0.05)',
        opacity: p,
        translate: `0px ${(1 - p) * 30}px`,
        overflow: 'hidden',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      {shot ? <Img src={staticFile(shot)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45, filter: 'grayscale(0.4)'}} /> : null}
      {b.kind === 'logo' ? (
        <div style={{position: 'relative'}}>
          <Logo state="outline" width={b.w - 80} />
          <div style={{position: 'absolute', inset: 0, clipPath: `inset(${(1 - interpolate(frame, [b.at + 6, b.at + 40], [0, 1], clamp)) * 100}% 0 0 0)`}}>
            <Logo state="solid" width={b.w - 80} />
          </div>
        </div>
      ) : null}
      <div
        dir="rtl"
        style={{
          position: 'absolute',
          bottom: 14,
          right: 18,
          padding: '6px 14px',
          borderRadius: 10,
          background: 'rgba(5,11,20,0.75)',
          fontFamily: FONT,
          fontSize: 24,
          color: T.silver,
        }}
      >
        {b.label}
      </div>
    </div>
  );
};

const SceneView: React.FC<{s: Scene; frame: number; final: boolean; sketch?: boolean}> = ({s, frame, final, sketch}) => {
  if (sketch) return <SketchScene s={s} f={frame} />;
  const local = frame - s.start;
  const Art = SCENE_ART[s.name];
  return (
    <AbsoluteFill>
      {!final && s.kind === 'service' ? (
        <div dir="rtl" style={{position: 'absolute', top: 300, right: SAFE.right - 40, left: SAFE.left}}>
          <Counter n={Number(ar(s.name.slice(0, 2)).replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))))} of={8} label="خدماتنا" />
          <div style={{fontFamily: FONT, fontWeight: 700, fontSize: TYPE.h1 - 10, color: T.white, marginTop: 10}}>{s.name.slice(3)}</div>
        </div>
      ) : null}
      {final && Art ? <Art s={s} f={frame} /> : null}
      {final ? null : s.blocks.map((b, i) => <Block key={i} b={b} frame={frame} />)}
      {s.kind === 'process' ? <ProcessTrack frame={frame} /> : null}
      {s.kind === 'slogan' ? <SloganBlock frame={frame} start={s.start} /> : null}
      {s.kind === 'title' || s.kind === 'slogan' ? null : <Kinetic lines={s.lines as unknown as Line[]} frame={frame} top={s.kind === 'process' ? 1330 : 1250} quiet={s.kind === 'process'} />}
      {s.kind === 'title' ? <Kinetic lines={s.lines as unknown as Line[]} frame={frame} top={760} big /> : null}
      {final ? null : (
        <div dir="rtl" style={{position: 'absolute', top: 240, left: SAFE.left, fontFamily: FONT, fontSize: 22, color: T.silverDim, opacity: local < 40 ? 1 : 0.6}}>
          مسودة · {s.name}
        </div>
      )}
    </AbsoluteFill>
  );
};

const PROCESS_ICONS: IconName[] = ['message', 'search', 'map', 'pen', 'code', 'rocket', 'trend'];
const RAIL_Y = 860;
const GAP = 330;

/**
 * One rail, seven stations. The rail only moves when a verb is spoken and settles softly;
 * every station's size, label and glow are driven by its distance from centre, so the active
 * step grows into place instead of swapping — one continuous element, no cross-fades.
 */
const ProcessTrack: React.FC<{frame: number}> = ({frame}) => {
  const steps = DATA.process;
  // rail position in "stations": eases forward on each spoken verb
  const pos = steps.slice(1).reduce((acc, st) => acc + interpolate(frame, [st.at - 3, st.at + 15], [0, 1], {...clamp, easing: ease}), 0);
  const last = steps.reduce((k, st, i) => (frame >= st.at - 3 ? i : k), 0);
  const arrive = steps[last].at - 3;
  const ripple = interpolate(frame, [arrive + 8, arrive + 32], [0, 1], clamp);
  const enterP = interpolate(frame, [steps[0].at - 14, steps[0].at + 4], [0, 1], {...clamp, easing: ease});
  return (
    <div style={{position: 'absolute', inset: 0, opacity: enterP}}>
      <div dir="rtl" style={{position: 'absolute', top: 300, right: SAFE.right - 40}}>
        <Counter n={Math.min(steps.length, Math.round(pos) + 1)} of={steps.length} label="كيف نشتغل" />
      </div>
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <defs>
          <linearGradient id="railDone" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor={T.blue} stopOpacity={0} />
            <stop offset="1" stopColor={T.blue} stopOpacity={1} />
          </linearGradient>
        </defs>
        <line x1={-40} y1={RAIL_Y} x2={1120} y2={RAIL_Y} stroke={T.line} strokeWidth={3} />
        <rect x={540} y={RAIL_Y - 2.5} width={600} height={5} fill="url(#railDone)" />
        <circle cx={540} cy={RAIL_Y} r={110 + ripple * 120} fill="none" stroke={T.blueSoft} strokeWidth={2} opacity={(1 - ripple) * 0.6} />
      </svg>
      {steps.map((st, i) => {
        const d = Math.abs(pos - i);
        if (d > 2.6) return null;
        const x = 540 + (pos - i) * GAP;
        const size = interpolate(d, [0, 1, 2], [210, 74, 54], clamp);
        const done = i < pos - 0.5;
        const active = interpolate(d, [0, 0.6], [1, 0], clamp);
        const label = interpolate(d, [0, 1], [128, 40], clamp);
        const fade = interpolate(d, [0, 1, 2.6], [1, 0.6, 0], clamp);
        return (
          <React.Fragment key={st.text}>
            <div
              style={{
                position: 'absolute',
                left: x - size / 2,
                top: RAIL_Y - size / 2,
                width: size,
                height: size,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                background: done || active > 0.05 ? `linear-gradient(160deg, ${T.blue}, #1F5FD0)` : T.navy800,
                border: `2px solid ${done || active > 0.05 ? T.blueSoft : T.lineStrong}`,
                boxShadow: `0 0 ${70 * active}px rgba(61,139,255,${0.6 * active})`,
                opacity: fade,
              }}
            >
              <div style={{opacity: interpolate(d, [0, 1.2], [1, 0.75], clamp)}}>
                <Icon name={PROCESS_ICONS[i]} size={size * 0.44} color={T.white} stroke={1.6} />
              </div>
            </div>
            <div
              dir="rtl"
              style={{
                position: 'absolute',
                left: x - 320,
                top: RAIL_Y + size / 2 + 26,
                width: 640,
                textAlign: 'center',
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: label,
                lineHeight: 1.1,
                color: active > 0.5 ? T.white : T.silver,
                opacity: fade,
                filter: active > 0.05 ? `drop-shadow(0 0 ${28 * active}px ${T.glow})` : undefined,
              }}
            >
              {st.text}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const SloganBlock: React.FC<{frame: number; start: number}> = ({frame, start}) => {
  const l = DATA.scenes[DATA.scenes.length - 1].lines;
  const tIdea = l[l.length - 1].words[0].t;
  const tExec = l[l.length - 1].words[l[l.length - 1].words.length - 1].t;
  const logo = interpolate(frame, [start + 4, start + 20], [0, 1], {...clamp, easing: ease});
  const a = interpolate(frame, [tIdea - 2, tIdea + 6], [0, 1], {...clamp, easing: ease});
  const fillP = interpolate(frame, [tExec - 2, tExec + 12], [0, 1], {...clamp, easing: ease});
  return (
    <>
      <div style={{position: 'absolute', top: 330, width: '100%', display: 'flex', justifyContent: 'center', opacity: logo}}>
        <Logo state={logo > 0.9 ? 'solid' : 'outline'} width={300} />
      </div>
      <div dir="rtl" style={{position: 'absolute', top: 780, width: '100%', textAlign: 'center', lineHeight: 1.05}}>
        <div style={{opacity: a}}>
          <OutlineText size={180} stroke={2.5}>فكرتك،</OutlineText>
        </div>
        <div style={{position: 'relative', display: 'inline-block'}}>
          <OutlineText size={180} stroke={2.5} style={{opacity: fillP > 0 ? 1 : 0}}>تنفيذنا</OutlineText>
          <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 0 0 ${(1 - fillP) * 100}%)`, fontFamily: FONT, fontWeight: 700, fontSize: 180, color: T.white, filter: `drop-shadow(0 0 40px ${T.glow})`}}>
            تنفيذنا
          </div>
        </div>
      </div>
      <Dimension x1={150} y1={790} x2={150} y2={990} label="فكرة" />
      <Dimension x1={150} y1={1010} x2={150} y2={1210} label="تنفيذ" color={T.blueSoft} />
    </>
  );
};

/* ------------------------------------------------- face shots + match cut */

const FaceCaption: React.FC<{lines: readonly Line[]; frame: number}> = ({lines, frame}) => {
  let li = -1;
  lines.forEach((l, i) => {
    if (frame >= l.words[0].t - 2) li = i;
  });
  if (li < 0) return null;
  const line = lines[li];
  return (
    <div style={{position: 'absolute', top: 1320, left: 110, width: 860, display: 'flex', justifyContent: 'center'}}>
      <div dir="rtl" style={{fontFamily: FONT, fontWeight: 700, fontSize: 62, lineHeight: 1.38, textAlign: 'center', padding: '14px 30px 18px', borderRadius: 26, background: 'rgba(8, 19, 31, 0.86)'}}>
        {line.words.map((w, i) => (
          <span key={i} style={{color: line.keys.includes(i) ? T.blueSoft : T.white, opacity: frame >= w.t - 1 ? 1 : 0.62}}>
            {w.text}{' '}
          </span>
        ))}
      </div>
    </div>
  );
};

const Office: React.FC<{zoom: number; personTrim: number; personFrom: number; personDur: number; personScale: number; out: number; cine?: boolean}> = ({
  cine = false,
  zoom,
  personTrim,
  personFrom,
  personDur,
  personScale,
  out,
}) => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <AbsoluteFill style={{scale: String(zoom), transformOrigin: '46% 33%'}}>
      <Img src={staticFile(cine ? 'backgrounds/office_cine.png' : 'backgrounds/office.png')} style={{position: 'absolute', left: -30, top: -40, width: 1140, height: 2000, objectFit: 'cover', filter: `blur(${3 + (zoom - 1) * 4}px) brightness(0.92)`}} />
    </AbsoluteFill>
    <Sequence from={personFrom} durationInFrames={personDur} layout="none">
      <OffthreadVideo
        src={staticFile(cine ? 'footage/person_cine.webm' : 'footage/person_alpha.webm')}
        transparent
        muted
        trimBefore={personTrim}
        style={{
          position: 'absolute',
          inset: 0,
          width: 1080,
          height: 1920,
          transformOrigin: '50% 38%',
          scale: String(personScale * (1 + out * 0.9)),
          translate: `${65 - out * 520}px ${out * 560}px`,
          filter: cine ? `blur(${out * 14}px)` : `brightness(0.93) contrast(1.06) sepia(0.07) blur(${out * 14}px)`,
        }}
      />
    </Sequence>
  </AbsoluteFill>
);

/* ------------------------------------------------------------- sound */

// Sparse by design: brand moments and camera moves only — never a sound per word.
const byName = (n: string) => DATA.scenes.find((x) => x.name === n)!;
const SFX: {name: string; f: number; src: string; v: number}[] = [
  {name: 'الافتتاح', f: 0, src: 'hook.wav', v: 0.5},
  {name: 'الاندفاع نحو الجدار', f: PUSH[0], src: 'whoosh.wav', v: 0.42},
  ...DATA.scenes.slice(1).map((sc) => ({
    name: `انتقال: ${sc.name}`,
    f: sc.start - 10,
    src: sc.kind === 'service' ? 'swish.wav' : 'whoosh.wav',
    v: sc.kind === 'service' ? 0.15 : 0.22,
  })),
  {name: 'التجمّع بمكان واحد', f: cue(byName('وقت ضائع'), 'بمكان') - 4, src: 'tick.wav', v: 0.35},
  {name: 'لمعة الشعار', f: byName('بناء الشعار').start + 38, src: 'shimmer.wav', v: 0.45},
  {name: 'اكتمال الشعار من الخدمات', f: cue(byName('بمكان واحد'), 'بمكان') - 8, src: 'shimmer.wav', v: 0.38},
  ...DATA.process.map((p) => ({name: `مرحلة: ${p.text}`, f: p.at, src: 'tick.wav', v: 0.13})),
  {name: 'تنفيذنا', f: cue(byName('فكرتك، تنفيذنا'), 'تنفيذنا') - 7, src: 'impact.wav', v: 0.5},
  {name: 'الرجوع إلى المكتب', f: PULL[0], src: 'whoosh.wav', v: 0.28},
  {name: 'إرسال «فكرة»', f: CTA_START + 46, src: 'pop.wav', v: 0.4},
  {name: 'الشاشة الختامية', f: DATA.speechEnd, src: 'shimmer.wav', v: 0.4},
];

/* ------------------------------------------------------------- root */

export const Animatic: React.FC<{final?: boolean; faceCaptions?: boolean; music?: boolean; sketch?: boolean}> = ({final = false, faceCaptions = true, music = true, sketch = false}) => {
  const frame = useCurrentFrame();
  const prev = useCamera(frame - 1);
  const {fps} = useVideoConfig();
  const cam = useCamera(frame);
  const vx = Math.min(22, Math.abs(cam.x - prev.x) * 0.12);
  const vy = Math.min(22, Math.abs(cam.y - prev.y) * 0.12);
  const pushP = interpolate(frame, [PUSH[0], PUSH[1]], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const pullP = interpolate(frame, [PULL[0], PULL[1]], [1, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const canvasIn = frame < CTA_START - 30 ? interpolate(frame, [PUSH[0] + 14, PUSH[1]], [0, 1], clamp) : interpolate(frame, [PULL[0], PULL[0] + 18], [1, 0], clamp);
  const hookV = DATA.voice[0];
  const ctaV = DATA.voice[DATA.voice.length - 1];
  const visible = DATA.scenes.filter((s) => frame >= s.start - 30 && frame < s.end + 30);

  return (
    <AbsoluteFill
      style={{
        background: T.navy900,
        scale: 1.009
      }}
    >
      {/* face shots: hook, then the push into the wall; CTA after the pull back */}
      {frame < PUSH[1] + 2 ? (
        <Office
          zoom={1 + pushP * 1.4}
          personFrom={0}
          personTrim={hookV.trim}
          personDur={hookV.dur + 20}
          personScale={interpolate(frame, [78, HOOK_END], [1.12, 1.18], clamp)}
          out={pushP}
          cine={sketch}
        />
      ) : null}
      {frame >= PULL[0] - 2 && frame < DATA.speechEnd ? (
        <Office zoom={1 + pullP * 1.4} personFrom={ctaV.from - 20} personTrim={ctaV.trim - 20} personDur={ctaV.dur + 20} personScale={1.24} out={pullP} cine={sketch} />
      ) : null}

      {/* the one big canvas the camera travels across */}
      {canvasIn > 0 ? (
        <AbsoluteFill style={{opacity: canvasIn}}>
          {sketch ? <Paper camX={cam.x} camY={cam.y} scale={cam.scale} /> : <AbsoluteFill style={{background: `radial-gradient(110% 75% at 50% 42%, ${T.navy700} 0%, ${T.navy800} 48%, ${T.navy900} 100%)`}} />}
          <AbsoluteFill
            style={{
              display: sketch ? 'none' : undefined,
              backgroundImage: `linear-gradient(${T.line} 1px, transparent 1px), linear-gradient(90deg, ${T.line} 1px, transparent 1px)`,
              backgroundSize: `${120 * cam.scale}px ${120 * cam.scale}px`,
              backgroundPosition: `${-cam.x * cam.scale}px ${-cam.y * cam.scale}px`,
              maskImage: 'radial-gradient(85% 65% at 50% 45%, black 30%, transparent 100%)',
            }}
          />
          {final ? (
            <svg width={0} height={0} style={{position: 'absolute'}}>
              <filter id="camBlur" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation={`${vx} ${vy}`} />
              </filter>
            </svg>
          ) : null}
          <AbsoluteFill style={{scale: String(cam.scale), transformOrigin: '50% 50%', filter: final && vx + vy > 0.5 ? 'url(#camBlur)' : undefined}}>
            <AbsoluteFill style={{translate: `${-cam.x}px ${-cam.y}px`}}>
              {visible.map((s) => (
                <div key={s.name} style={{position: 'absolute', left: s.cam.x, top: s.cam.y, width: 1080, height: 1920}}>
                  <SceneView s={s} frame={frame} final={final} sketch={sketch} />
                </div>
              ))}
            </AbsoluteFill>
          </AbsoluteFill>
          {sketch ? null : <PixelCluster x={480} y={760} size={120} mode="mixed" opacity={interpolate(frame, [PUSH[1] - 6, PUSH[1] + 10, PUSH[1] + 26], [0, 1, 0], clamp)} />}
          {sketch ? null : <AbsoluteFill style={{background: 'radial-gradient(130% 90% at 50% 45%, transparent 60%, rgba(2, 6, 12, 0.6) 100%)'}} />}
        </AbsoluteFill>
      ) : null}

      {/* face-shot captions and graphics */}
      {faceCaptions && frame < HOOK_END ? <FaceCaption lines={DATA.face.hook.lines as unknown as Line[]} frame={frame} /> : null}
      {faceCaptions && frame >= CTA_START && frame < DATA.speechEnd ? <FaceCaption lines={DATA.face.cta.lines as unknown as Line[]} frame={frame} /> : null}
      <HookTitle name="Hook title" from={6} durationInFrames={87} line="عندك فكرة مشروع؟" accent="فكرة مشروع؟" />
      <CtaChip name="CTA message" from={CTA_START} durationInFrames={DATA.speechEnd - CTA_START - 1} lead="راسلنا بكلمة" keyword="«فكرة»" sendAt={Math.round(1.54 * fps)} />
      {sketch && frame >= DATA.speechEnd ? <SketchEnd f={frame} start={DATA.speechEnd} /> : null}
      {sketch ? null : <EndScreen name="End screen" from={DATA.speechEnd} durationInFrames={DATA.duration - DATA.speechEnd} slogan="فكرتك، تنفيذنا" cta="راسلنا بكلمة «فكرة»" website="tech.monafithoon.com" />}
      {sketch ? null : <Grain />}

      {/* sound: the real voice, cut exactly like the main edit, plus the calm bed */}
      {DATA.voice.map((v, i) => (
        <Sequence key={i} from={v.from} durationInFrames={v.dur} trimBefore={v.trim} layout="none" name={`صوت ${i + 1}`}>
          <Audio src={staticFile('footage/voice_clean.wav')} />
        </Sequence>
      ))}
      <Sequence from={DATA.speechEnd} durationInFrames={4} trimBefore={ctaV.trim + ctaV.dur} layout="none" name="ذيل الكلمة الأخيرة">
        <Audio src={staticFile('footage/voice_clean.wav')} />
      </Sequence>
      {music ? <Audio src={staticFile('music/main_music.wav')} volume={0.45} /> : null}
      {final
        ? SFX.map((x, i) => (
            <Sequence key={i} from={Math.max(0, x.f)} durationInFrames={90} layout="none" name={`مؤثر: ${x.name}`}>
              <Audio src={staticFile(`sfx/${x.src}`)} volume={x.v} />
            </Sequence>
          ))
        : null}
    </AbsoluteFill>
  );
};
