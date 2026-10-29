// المرحلة الثالثة: المشاهد المكتملة. كل مشهد يُرسم في إحداثيات لوحته (1080×1920) ويتزامن مع كلماته.
import React from 'react';
import {Easing, Img, interpolate, staticFile} from 'remotion';
import {FONT} from '../theme';
import {Icon, type IconName} from '../components/Icon';
import {DATA} from './animaticData';
import {Goal3D} from './Goal3D';
import {Scatter3D} from './Scatter3D';
import {BuildWipe, Counter, CropMarks, Dimension, Logo, PixelCluster, Slab, T, TYPE, ar} from './kit';

type Scene = (typeof DATA.scenes)[number];
type P = {s: Scene; f: number};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
/** 0→1 from frame `at` over `d` frames, eased (no overshoot). */
const pr = (f: number, at: number, d = 12) => interpolate(f, [at, at + d], [0, 1], {...clamp, easing: ease});
const MARKS = /[ً-ّٰٟ،.؟…«»]/g;
/** Output frame where a word is spoken in this scene (first word that starts with `w`). */
export const cue = (s: Scene, w: string, nth = 0) => {
  const lines = s.lines as unknown as {words: {t: number; text: string}[]}[];
  const all = lines.flatMap((l) => l.words);
  const hits = all.filter((x) => x.text.replace(MARKS, '').startsWith(w.replace(MARKS, '')));
  return (hits[nth] ?? hits[0])?.t ?? s.start;
};
const enter = (p: number, rise = 30, blur = 10): React.CSSProperties => ({
  opacity: p,
  translate: `0px ${(1 - p) * rise}px`,
  filter: p < 1 ? `blur(${(1 - p) * blur}px)` : undefined,
});
const draw = (p: number, len = 2000) => ({strokeDasharray: len, strokeDashoffset: len * (1 - p)});

/* ---------------------------------------------------------- shared bits */

const VendorCard: React.FC<{label: string; icon: IconName; tag: string; p: number; built?: number; style?: React.CSSProperties}> = ({
  label,
  icon,
  tag,
  p,
  built = 0,
  style,
}) => (
  <div
    dir="rtl"
    style={{
      position: 'absolute',
      padding: '26px 36px 24px',
      borderRadius: 26,
      background: `rgba(14, 31, 51, ${0.75 + built * 0.2})`,
      border: `2px ${built > 0.5 ? 'solid' : 'dashed'} ${built > 0.5 ? T.blue : T.blueSoft}`,
      boxShadow: '0 30px 80px rgba(0,4,12,0.55)',
      fontFamily: FONT,
      color: T.white,
      ...enter(p),
      ...style,
    }}
  >
    <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
      <div style={{width: 88, height: 88, borderRadius: 24, display: 'grid', placeItems: 'center', background: 'rgba(61,139,255,0.14)'}}>
        <Icon name={icon} size={50} color={T.blueSoft} />
      </div>
      <div>
        <div style={{fontSize: 22, color: T.silverDim}}>{tag}</div>
        <div style={{fontSize: 62, fontWeight: 700, lineHeight: 1.1, whiteSpace: 'nowrap'}}>{label}</div>
      </div>
    </div>
  </div>
);

const Screen: React.FC<{src: string; w: number; style?: React.CSSProperties}> = ({src, w, style}) => (
  <div style={{position: 'absolute', width: w, borderRadius: 18, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,4,12,0.6)', border: `1.5px solid ${T.lineStrong}`, ...style}}>
    <Img src={staticFile(src)} style={{width: w, height: (w * 800) / 1280, display: 'block'}} />
  </div>
);

const Phone: React.FC<{src: string; w: number; style?: React.CSSProperties}> = ({src, w, style}) => (
  <div style={{position: 'absolute', width: w, padding: 10, borderRadius: w * 0.15, background: 'linear-gradient(160deg, #2A3442, #0B0F14)', boxShadow: '0 40px 90px rgba(0,4,12,0.6), inset 0 0 0 2px rgba(201,211,222,0.25)', ...style}}>
    <Img src={staticFile(src)} style={{width: w - 20, height: ((w - 20) * 812) / 375, borderRadius: w * 0.11, display: 'block', objectFit: 'cover'}} />
  </div>
);

/* ------------------------------------------------------- 1 · المشكلة */

const Problem: React.FC<P> = ({s, f}) => {
  const tA = cue(s, 'مبرمج');
  const tB = cue(s, 'مصمم');
  const tC = cue(s, 'شركات');
  const tCost = cue(s, 'وكوست');
  const tx = cue(s, 'أضعاف');
  const drift = interpolate(f, [s.start, s.end], [0, 1], clamp);
  return (
    <>
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        {[
          ['M 760 470 C 320 380, 840 700, 330 690', tB],
          ['M 330 700 C 590 640, 150 980, 640 930', tC],
          ['M 660 940 C 1000 760, 540 520, 780 470', tC + 6],
        ].map(([d, at], i) => (
          <path key={i} d={d as string} stroke={T.silverDim} strokeWidth={2.5} fill="none" strokeDasharray="10 12" opacity={pr(f, (at as number) + 2, 16) * 0.8} />
        ))}
      </svg>
      <VendorCard label="مبرمج" icon="code" tag="جهة ١" p={pr(f, tA - 2)} style={{left: 520 + drift * 20, top: 360 - drift * 14, rotate: '4deg'}} />
      <VendorCard label="مصمّم" icon="pen" tag="جهة ٢" p={pr(f, tB - 2)} style={{left: 90 - drift * 20, top: 580, rotate: '-5deg'}} />
      <VendorCard label="شركات متفرقة" icon="building" tag="جهة ٣" p={pr(f, tC - 2)} style={{left: 290, top: 810 + drift * 16, rotate: '3deg'}} />
      <div style={{position: 'absolute', left: 120, top: 1010}}>
        {[0, 1, 2].map((i) => {
          const p = pr(f, (i === 2 ? tx : tCost) + i * 4, 10);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: i * 26,
                top: -i * 30 - (1 - p) * 80,
                width: 180,
                height: 228,
                rotate: `${-6 + i * 5}deg`,
                borderRadius: 14,
                background: T.navy800,
                border: `2px solid ${i === 2 ? '#FF9C8A' : T.lineStrong}`,
                padding: 22,
                opacity: p,
              }}
            >
              {[0.9, 0.6, 0.75, 0.5].map((w, k) => (
                <div key={k} style={{height: 10, width: `${w * 100}%`, background: T.line, borderRadius: 5, marginBottom: 18}} />
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
};

/* ------------------------------------------------------- brand plate */

const LOCKUP = 'brand/lockup-white.png';

/** Glass plate holding the original lockup: halo, light sweep, ripple and a soft reflection. */
const BrandPlate: React.FC<{f: number; at: number}> = ({f, at}) => {
  const p = pr(f, at - 6, 16);
  const shine = interpolate(f, [at + 8, at + 30], [-30, 130], clamp);
  const ripple = interpolate(f, [at - 4, at + 26], [0, 1], clamp);
  const breathe = 1 + Math.sin((f - at) / 18) * 0.012;
  const W = 400;
  const H = (W * 742) / 938;
  const cx = 540;
  const cy = 700;
  const url = staticFile(LOCKUP);
  const mask = {maskImage: `url(${url})`, maskSize: '100% 100%', WebkitMaskImage: `url(${url})`, WebkitMaskSize: '100% 100%'};
  return (
    <>
      {/* ripple rings at the moment everything lands in one place */}
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        {[0, 0.18, 0.36].map((d, i) => {
          const r = interpolate(ripple, [d, 1], [0, 1], clamp);
          return <circle key={i} cx={cx} cy={cy} r={260 + r * 260} fill="none" stroke={i === 0 ? T.blueSoft : T.silver} strokeWidth={1.5} opacity={(1 - r) * 0.5 * (r > 0 ? 1 : 0)} />;
        })}
      </svg>
      <div style={{position: 'absolute', left: cx - 420, top: cy - 420, width: 840, height: 840, borderRadius: '50%', background: `radial-gradient(circle, rgba(61,139,255,0.42), rgba(61,139,255,0.08) 45%, transparent 68%)`, opacity: p}} />
      {/* the plate: gradient hairline border around a frosted panel */}
      <div style={{position: 'absolute', left: cx - 300, top: cy - 290, width: 600, height: 580, borderRadius: 52, padding: 1.5, background: `linear-gradient(150deg, rgba(201,211,222,0.75), rgba(61,139,255,0.55) 45%, rgba(201,211,222,0.12))`, opacity: p, scale: String((0.92 + p * 0.08) * breathe), filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined, boxShadow: '0 50px 120px rgba(0,4,12,0.6)'}}>
        <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 50.5, overflow: 'hidden', background: 'linear-gradient(165deg, rgba(46,74,107,0.72) 0%, rgba(14,31,51,0.92) 55%, rgba(8,19,31,0.96) 100%)', backdropFilter: 'blur(20px)'}}>
          <div style={{position: 'absolute', left: 60, right: 60, top: 0, height: 1.5, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)'}} />
          <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(70% 55% at 50% 45%, rgba(61,139,255,0.22), transparent 70%)'}} />
          <div style={{position: 'absolute', left: 300 - W / 2, top: 290 - H / 2 - 6, width: W, height: H}}>
            <Img src={url} style={{width: W, height: H, display: 'block', filter: 'drop-shadow(0 10px 30px rgba(61,139,255,0.35))'}} />
            <div style={{position: 'absolute', inset: 0, background: `linear-gradient(105deg, transparent ${shine - 14}%, rgba(255,255,255,0.95) ${shine}%, transparent ${shine + 14}%)`, mixBlendMode: 'screen', ...mask}} />
          </div>
        </div>
      </div>
      {/* reflection on the "floor" of the canvas */}
      <div style={{position: 'absolute', left: cx - W / 2, top: cy + 310, width: W, height: H, transform: 'scaleY(-1)', opacity: p * 0.16, maskImage: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent 38%)', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent 38%)', filter: 'blur(2px)'}}>
        <Img src={url} style={{width: W, height: H}} />
      </div>
      <PixelCluster x={cx + 250 + (1 - p) * 120} y={cy - 340 - (1 - p) * 60} size={86} mode="mixed" opacity={p * 0.9} />
    </>
  );
};

/* -------------------------------------------- 2 · وقت ضائع ← بمكان واحد */

const Question: React.FC<P> = ({s, f}) => (
  <>
    <Scatter3D s={s} f={f} cue={cue} />
    {/* one place: everything resolves into the brand plate */}
    <BrandPlate f={f} at={cue(s, 'بمكان')} />
  </>
);

/* ----------------------------------------------- 3 · مهما كانت فكرتك */

const AnyIdea: React.FC<P> = ({s, f}) => {
  const ideas: [IconName, number, number, number][] = [
    ['bulb', 470, 380, 140],
    ['phone', 180, 520, 110],
    ['globe', 760, 560, 120],
    ['bag', 260, 860, 100],
    ['grid', 700, 900, 110],
    ['cpu', 480, 700, 90],
  ];
  return (
    <>
      {ideas.map(([icon, x, y, size], i) => {
        const p = pr(f, s.start + i * 7, 14);
        const bob = Math.sin((f + i * 20) / 22) * 10;
        return (
          <div
            key={icon}
            style={{
              position: 'absolute',
              left: x,
              top: y + bob,
              width: size + 60,
              height: size + 60,
              borderRadius: 30,
              border: `2px dashed ${T.blueSoft}`,
              background: 'rgba(139,188,255,0.04)',
              display: 'grid',
              placeItems: 'center',
              ...enter(p),
            }}
          >
            <Icon name={icon} size={size * 0.6} color={T.blueSoft} stroke={1.4} />
          </div>
        );
      })}
    </>
  );
};

/* ------------------------------------------------------ 4 · بناء الشعار */

const LogoBuild: React.FC<P> = ({s, f}) => {
  const W = 540;
  const H = W * (742 / 938);
  const x = (1080 - W) / 2;
  const y = 470;
  const t0 = s.start;
  const outline = pr(f, t0 - 4, 14);
  const fill = interpolate(f, [t0 + 8, t0 + 40], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const dims = pr(f, t0, 12);
  const shine = interpolate(f, [t0 + 42, t0 + 62], [-30, 130], clamp);
  return (
    <>
      <div style={{position: 'absolute', left: x - 160, top: y - 160, width: W + 320, height: H + 320, background: `radial-gradient(circle, ${T.glow}, transparent 62%)`, opacity: 0.25 + fill * 0.5}} />
      <div style={{opacity: dims}}>
        <Dimension x1={x} y1={y - 50} x2={x + W} y2={y - 50} label={ar(W)} />
        <Dimension x1={x - 50} y1={y} x2={x - 50} y2={y + H} label={ar(Math.round(H))} />
        <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
          <line x1={540} y1={y - 130} x2={540} y2={y + H + 130} stroke={T.line} strokeWidth={1.5} />
          <line x1={x - 130} y1={y + H / 2} x2={x + W + 130} y2={y + H / 2} stroke={T.line} strokeWidth={1.5} />
          <circle cx={540} cy={y + H / 2} r={H * 0.62} stroke={T.line} strokeWidth={1.5} fill="none" strokeDasharray="4 10" />
        </svg>
      </div>
      <div style={{position: 'absolute', left: x, top: y}}>
        <div style={{clipPath: `inset(0 0 0 ${(1 - outline) * 100}%)`}}>
          <Logo state="outline" width={W} />
        </div>
        <div style={{position: 'absolute', inset: 0, clipPath: `inset(${(1 - fill) * 100}% 0 0 0)`}}>
          <Logo state="solid" width={W} />
        </div>
        {fill > 0 && fill < 1 ? (
          <div style={{position: 'absolute', left: -40, right: -40, top: H * (1 - fill) - 2, height: 4, background: T.blue, boxShadow: `0 0 28px 6px ${T.glow}`}} />
        ) : null}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(105deg, transparent ${shine - 16}%, rgba(255,255,255,0.85) ${shine}%, transparent ${shine + 16}%)`,
            maskImage: `url(${staticFile('brand/lockup-white.png')})`,
            maskSize: '100% 100%',
            WebkitMaskImage: `url(${staticFile('brand/lockup-white.png')})`,
            WebkitMaskSize: '100% 100%',
            mixBlendMode: 'screen',
          }}
        />
      </div>
      <PixelCluster x={x + W + 20 - (1 - pr(f, t0 + 4, 16)) * 200} y={y - 100} size={90} mode="outline" opacity={0.7 * pr(f, t0 + 4, 16)} />
      <PixelCluster x={x - 150 + (1 - pr(f, t0 + 10, 16)) * 200} y={y + H - 30} size={70} mode="solid" opacity={0.85 * pr(f, t0 + 10, 16)} />
    </>
  );
};

/* ------------------------------------------- 5 · من الفكرة إلى التنفيذ */

const IdeaToExec: React.FC<P> = ({s, f}) => {
  const steps: [IconName, string][] = [
    ['bulb', 'فكرة'],
    ['pen', 'تصميم'],
    ['code', 'تطوير'],
    ['rocket', 'إطلاق'],
  ];
  const at = [cue(s, 'من'), cue(s, 'الفكرة'), cue(s, 'إلى'), cue(s, 'التنفيذ')];
  const line = interpolate(f, [at[0], at[3] + 4], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const xs = [900, 640, 380, 120];
  return (
    <>
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        <line x1={900} y1={640} x2={120} y2={640} stroke={T.line} strokeWidth={4} />
        <line x1={900} y1={640} x2={900 - 780 * line} y2={640} stroke={T.blue} strokeWidth={5} style={{filter: `drop-shadow(0 0 10px ${T.glow})`}} />
      </svg>
      {steps.map(([icon, label], i) => {
        const on = pr(f, at[i] - 2, 8);
        return (
          <div key={label} style={{position: 'absolute', left: xs[i] - 70, top: 570, width: 140, textAlign: 'center'}}>
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: 70,
                display: 'grid',
                placeItems: 'center',
                background: on > 0.5 ? `linear-gradient(160deg, ${T.blue}, #1F5FD0)` : T.navy700,
                border: `2px ${on > 0.5 ? 'solid' : 'dashed'} ${T.blueSoft}`,
                boxShadow: on > 0.5 ? `0 0 ${40 * on}px ${T.glow}` : 'none',
                scale: String(0.85 + on * 0.15),
              }}
            >
              <Icon name={icon} size={62} color={T.white} />
            </div>
            <div dir="rtl" style={{fontFamily: FONT, fontWeight: 700, fontSize: 44, color: on > 0.5 ? T.white : T.silverDim, marginTop: 18}}>
              {label}
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 190, top: 800, ...enter(pr(f, at[3], 14))}}>
        <BuildWipe src="projects/venda-desktop.webp" w={700} h={438} at={interpolate(f, [at[3], at[3] + 30], [1, 0], clamp)} />
      </div>
    </>
  );
};

/* ---------------------------------------------------- 6 · نشتغل وياك */

const Partner: React.FC<P> = ({s, f}) => {
  const tOrder = cue(s, 'طلبك');
  const tWork = cue(s, 'نشتغل');
  const tBest = cue(s, 'الأنسب');
  const slip = pr(f, tOrder - 6, 12);
  const strike = pr(f, tWork - 8, 10);
  const board = pr(f, tWork, 16);
  const t = f - tWork;
  const curA = {x: 300 + Math.sin(t / 16) * 120, y: 820 + Math.cos(t / 20) * 80};
  const curB = {x: 720 + Math.cos(t / 18) * 110, y: 760 + Math.sin(t / 14) * 90};
  const blocks = [0, 1, 2, 3].map((i) => pr(f, tWork + 10 + i * 12, 10));
  const best = pr(f, tBest - 2, 12);
  return (
    <>
      {/* «ننفّذ طلبك» — an order slip that gets crossed out */}
      <div dir="rtl" style={{position: 'absolute', left: 330, top: 330, width: 420, padding: '24px 30px', borderRadius: 20, background: T.navy800, border: `2px solid ${T.lineStrong}`, fontFamily: FONT, ...enter(slip), opacity: slip * (1 - board * 0.6)}}>
        <div style={{fontSize: 24, color: T.silverDim}}>طلب</div>
        <div style={{fontSize: 52, fontWeight: 700, color: T.white}}>ننفّذ طلبك</div>
        <div style={{position: 'absolute', right: 20, top: '55%', height: 4, width: `${strike * 90}%`, background: '#FF9C8A', borderRadius: 2}} />
      </div>
      {/* a shared design board: two cursors placing blocks together */}
      <div style={{position: 'absolute', left: 110, top: 560, width: 860, height: 560, borderRadius: 28, border: `2px solid ${T.lineStrong}`, background: 'rgba(14,31,51,0.7)', ...enter(board)}}>
        <div style={{position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${T.line} 1px, transparent 1px), linear-gradient(90deg, ${T.line} 1px, transparent 1px)`, backgroundSize: '40px 40px', borderRadius: 28}} />
        {[
          [40, 40, 780, 70],
          [40, 140, 460, 260],
          [530, 140, 290, 120],
          [530, 280, 290, 120],
        ].map(([x, y, w, h], i) => (
          <div key={i} style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 14, background: i === 1 ? 'rgba(61,139,255,0.25)' : 'rgba(201,211,222,0.1)', border: `2px solid ${i === 1 ? T.blue : T.lineStrong}`, opacity: blocks[i], scale: String(0.9 + blocks[i] * 0.1)}} />
        ))}
        {best > 0 ? (
          <div style={{position: 'absolute', left: 400, top: 430, width: 90, height: 90, borderRadius: 45, background: T.blue, display: 'grid', placeItems: 'center', boxShadow: `0 0 40px ${T.glow}`, opacity: best, scale: String(0.7 + best * 0.3)}}>
            <Icon name="check" size={52} color={T.white} stroke={2.6} />
          </div>
        ) : null}
      </div>
      {board > 0.5 ? (
        <>
          {[
            [curA, 'أنتم', T.silver],
            [curB, 'إحنا', T.blue],
          ].map(([c, label, color], i) => {
            const pt = c as {x: number; y: number};
            return (
              <div key={i} style={{position: 'absolute', left: pt.x, top: pt.y}}>
                <svg width={40} height={40}>
                  <path d="M 4 4 L 32 18 L 18 22 L 12 36 Z" fill={color as string} stroke={T.navy900} strokeWidth={2} />
                </svg>
                <div dir="rtl" style={{marginTop: -6, marginLeft: 24, padding: '4px 12px', borderRadius: 8, background: color as string, color: T.navy900, fontFamily: FONT, fontWeight: 700, fontSize: 24}}>
                  {label as string}
                </div>
              </div>
            );
          })}
        </>
      ) : null}
    </>
  );
};

/* ------------------------------------------------------------ services */

const SvcHeader: React.FC<P & {n: number; title: string; accent?: string}> = ({s, f, n, title, accent}) => {
  const p = pr(f, s.start - 4, 12);
  return (
    <div dir="rtl" style={{position: 'absolute', top: 290, right: 110, left: 72, ...enter(p, 20, 6)}}>
      <Counter n={n} of={8} label="خدماتنا" />
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: title.length + (accent?.length ?? 0) > 14 ? 76 : TYPE.h1 - 6, color: T.white, marginTop: 8, lineHeight: 1.1, whiteSpace: 'nowrap'}}>
        {title} {accent ? <span style={{color: T.blueSoft}}>{accent}</span> : null}
      </div>
    </div>
  );
};

const Websites: React.FC<P> = (pp) => {
  const {s, f} = pp;
  const p = pr(f, s.start - 2, 14);
  return (
    <>
      <SvcHeader {...pp} n={1} title="مواقع" accent="إلكترونية" />
      <div style={{position: 'absolute', left: 70, top: 600, ...enter(p, 60)}}>
        <BuildWipe src="projects/venda-desktop.webp" w={940} h={588} at={interpolate(f, [s.start, s.end - 6], [0.95, 0], {...clamp, easing: Easing.inOut(Easing.quad)})} />
        <CropMarks x={-20} y={-20} w={980} h={628} color={T.blueSoft} size={30} />
      </div>
    </>
  );
};

const Apps: React.FC<P> = (pp) => {
  const {s, f} = pp;
  const phones: [string, number, number, number][] = [
    ['projects/alsaad-mobile.webp', 250, 7, 6],
    ['projects/venda-mobile.webp', -250, -7, 6],
    ['projects/mandi-menu-mobile.webp', 0, 0, 0],
  ];
  return (
    <>
      <SvcHeader {...pp} n={2} title="تطبيقات" accent="موبايل" />
      {phones.map(([src, x, r, d], i) => {
        const p = pr(f, s.start + d - 4, 16);
        return <Phone key={i} src={src} w={300} style={{left: 390 + x * p, top: 540 + (1 - p) * 160, rotate: `${r * p}deg`, scale: String(i === 2 ? 1 : 0.88), opacity: p}} />;
      })}
    </>
  );
};

const Stores: React.FC<P> = (pp) => {
  const {s, f} = pp;
  const p = pr(f, s.start - 2, 14);
  const ph = pr(f, s.start + 8, 14);
  const badge = pr(f, s.start + 18, 10);
  return (
    <>
      <SvcHeader {...pp} n={3} title="متاجر" accent="إلكترونية" />
      <div style={{position: 'absolute', left: 90, top: 600, ...enter(p, 60)}}>
        <BuildWipe src="projects/alsaad-desktop.webp" w={900} h={563} at={interpolate(f, [s.start, s.end - 6], [0.8, 0], clamp)} />
      </div>
      <Phone src="projects/mrayco-mobile.webp" w={190} style={{left: 50, top: 760 + (1 - ph) * 120, rotate: '-4deg', opacity: ph}} />
      <div style={{position: 'absolute', left: 880, top: 540, width: 120, height: 120, borderRadius: 60, display: 'grid', placeItems: 'center', background: `linear-gradient(160deg, ${T.blue}, #1F5FD0)`, boxShadow: `0 0 40px ${T.glow}`, opacity: badge, scale: String(0.6 + badge * 0.4)}}>
        <Icon name="bag" size={58} color={T.white} />
      </div>
    </>
  );
};

const Systems: React.FC<P> = (pp) => {
  const {s, f} = pp;
  const screens = ['projects/inventory.svg', 'projects/pos.svg', 'projects/hr-payroll-light.svg'];
  return (
    <>
      <SvcHeader {...pp} n={4} title="أنظمة" accent="متكاملة" />
      <div style={{position: 'absolute', inset: 0, perspective: 1800}}>
        {screens.map((src, i) => {
          const p = pr(f, s.start + i * 5 - 4, 16);
          return <Screen key={src} src={src} w={760} style={{left: 160 + (i - 1) * 40, top: 500 + i * 118 + (1 - p) * 120, rotate: `x ${16 - i * 3}deg`, opacity: p}} />;
        })}
      </div>
    </>
  );
};

const Ai: React.FC<P> = (pp) => {
  const {s, f} = pp;
  const cols = [190, 420, 660, 890];
  const rows = [[560, 740, 920], [480, 660, 840, 1020], [480, 660, 840, 1020], [650, 830]];
  const pts = rows.map((ys, c) => ys.map((y) => [cols[c], y] as const));
  const build = pr(f, s.start - 4, 18);
  return (
    <>
      <SvcHeader {...pp} n={5} title="ذكاء" accent="اصطناعي" />
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        {pts.slice(0, -1).flatMap((col, c) =>
          col.flatMap(([x1, y1], i) =>
            pts[c + 1].map(([x2, y2], j) => {
              const k = c * 7 + i * 3 + j;
              const t = ((f * 2.4 + k * 9) % 60) / 60;
              return (
                <g key={`${c}-${i}-${j}`} opacity={build}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(139,188,255,0.2)" strokeWidth={2} />
                  <circle cx={x1 + (x2 - x1) * t} cy={y1 + (y2 - y1) * t} r={4} fill={T.blueSoft} />
                </g>
              );
            }),
          ),
        )}
      </svg>
      {/* nodes are the logo's pixel squares */}
      {pts.flat().map(([x, y], i) => {
        const p = pr(f, s.start + i * 1.2 - 4, 8);
        return <div key={i} style={{position: 'absolute', left: x - 18, top: y - 18, width: 36, height: 36, borderRadius: 7, background: i % 3 === 0 ? 'transparent' : T.blue, border: `2px solid ${T.blueSoft}`, boxShadow: `0 0 18px ${T.glow}`, opacity: p, scale: String(0.4 + p * 0.6)}} />;
      })}
    </>
  );
};

const Automation: React.FC<P> = (pp) => {
  const {s, f} = pp;
  const nodes: [IconName, string, number][] = [
    ['message', 'رسالة', 830],
    ['zap', 'رد آلي', 540],
    ['check', 'تم', 250],
  ];
  const flow = interpolate(f, [s.start, s.start + 24], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const sc = pr(f, s.start + 4, 14);
  return (
    <>
      <SvcHeader {...pp} n={6} title="أتمتة" />
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        <line x1={830} y1={620} x2={250} y2={620} stroke={T.line} strokeWidth={4} />
        <line x1={830} y1={620} x2={830 - 580 * flow} y2={620} stroke={T.blue} strokeWidth={5} strokeDasharray="16 12" strokeDashoffset={-f * 3} />
      </svg>
      {nodes.map(([icon, label, x], i) => {
        const p = pr(f, s.start + i * 6 - 4, 10);
        return (
          <div key={label} dir="rtl" style={{position: 'absolute', left: x - 75, top: 545, width: 150, textAlign: 'center', opacity: p, scale: String(0.85 + p * 0.15)}}>
            <div style={{width: 150, height: 150, borderRadius: 42, display: 'grid', placeItems: 'center', background: T.navy700, border: `2px solid ${T.blueSoft}`}}>
              <Icon name={icon} size={68} color={T.blueSoft} />
            </div>
            <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 40, color: T.white, marginTop: 12}}>{label}</div>
          </div>
        );
      })}
      <Screen src="projects/whatsapp-bot.svg" w={660} style={{left: 210, top: 800 + (1 - sc) * 80, opacity: sc}} />
    </>
  );
};

const Custom: React.FC<P> = (pp) => {
  const {s, f} = pp;
  const cells: [string, number, number][] = [
    ['projects/clinic.svg', 70, 520],
    ['projects/schools.svg', 550, 520],
    ['projects/menu.svg', 70, 840],
    ['projects/clinic-booking-light.svg', 550, 840],
  ];
  return (
    <>
      <SvcHeader {...pp} n={7} title="حلول برمجية" accent="خاصة" />
      {cells.map(([src, x, y], i) => {
        const p = pr(f, s.start + i * 5 - 4, 14);
        return <Screen key={src} src={src} w={460} style={{left: x, top: y + (1 - p) * 60, opacity: p, scale: String(0.92 + p * 0.08)}} />;
      })}
    </>
  );
};

const Identity: React.FC<P> = (pp) => {
  const {s, f} = pp;
  const card = pr(f, s.start - 2, 16);
  const sw = [T.brand, T.steel, T.blue, T.silver, T.white];
  return (
    <>
      <SvcHeader {...pp} n={8} title="تصاميم" accent="وهويات بصرية" />
      <div style={{position: 'absolute', left: 110, right: 110, top: 520, height: 440, borderRadius: 34, background: 'linear-gradient(150deg, #FFFFFF, #E6ECF3)', display: 'grid', placeItems: 'center', boxShadow: '0 40px 90px rgba(0,4,12,0.5)', ...enter(card, 60)}}>
        <Img src={staticFile('brand/lockup.png')} style={{width: 400, height: (400 * 742) / 938}} />
      </div>
      <div style={{position: 'absolute', top: 1000, left: 110, right: 110, display: 'flex', gap: 18}}>
        {sw.map((c, i) => {
          const p = pr(f, s.start + 10 + i * 4, 12);
          return <div key={c} style={{flex: 1, height: 130, borderRadius: 24, background: c, border: `1.5px solid ${T.lineStrong}`, ...enter(p, 40, 4)}} />;
        })}
      </div>
    </>
  );
};

/* ---------------------------------------------- 7 · كل شي بمكان واحد */

const AllInOne: React.FC<P> = ({s, f}) => {
  const icons: IconName[] = ['globe', 'phone', 'bag', 'grid', 'cpu', 'zap', 'layers', 'palette'];
  const tMerge = cue(s, 'بمكان');
  const m = interpolate(f, [tMerge - 26, tMerge - 4], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const logo = pr(f, tMerge - 8, 16);
  return (
    <>
      {icons.map((name, i) => {
        const a = (i / icons.length) * Math.PI * 2 - Math.PI / 2;
        const p = pr(f, s.start + i * 3 - 6, 12);
        const r = 330 * (1 - m);
        return (
          <div
            key={name}
            style={{
              position: 'absolute',
              left: 540 + Math.cos(a) * r - 60,
              top: 720 + Math.sin(a) * r * 1.15 - 60,
              width: 120,
              height: 120,
              borderRadius: 30,
              display: 'grid',
              placeItems: 'center',
              background: T.navy700,
              border: `2px solid ${T.blueSoft}`,
              opacity: p * (1 - m * 0.95),
              scale: String(1 - m * 0.6),
            }}
          >
            <Icon name={name} size={56} color={T.blueSoft} />
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 540 - 300, top: 720 - 300, width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${T.glow}, transparent 65%)`, opacity: logo}} />
      <div style={{position: 'absolute', left: 540 - 210, top: 720 - 166, ...enter(logo, 20, 12), scale: String(0.85 + logo * 0.15)}}>
        <Logo state="solid" width={420} />
      </div>
    </>
  );
};

/* ------------------------------------------------ 8 · شنو اللي يميّزنا */

const Different: React.FC<P> = ({s, f}) => {
  const p = pr(f, s.start, 20);
  return (
    <div style={{position: 'absolute', top: 260, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 520, lineHeight: 1, color: 'transparent', WebkitTextStroke: `3px ${T.blueSoft}`, opacity: 0.35 * p, rotate: `${(1 - p) * -8}deg`}}>
      ؟
    </div>
  );
};

/* ------------------------------------------------------------ 10 · هدفنا */

// Growth points, left → right and rising (P0 is the delivered project).
const G = [
  [150, 1080],
  [400, 930],
  [660, 780],
  [950, 540],
] as const;
const GROW_PATH = `M ${G[0][0]} ${G[0][1]} C 260 1040, 320 960, ${G[1][0]} ${G[1][1]} S 560 830, ${G[2][0]} ${G[2][1]} S 860 660, ${G[3][0]} ${G[3][1]}`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Goal2D: React.FC<P> = ({s, f}) => {
  const tDeliver = cue(s, 'نسلمك');
  const tGoal2 = cue(s, 'هدفنا', 1);
  const tSol = cue(s, 'حل');
  const tServe = cue(s, 'يخدم');
  const tGrow = cue(s, 'يتطور');
  const box = pr(f, tDeliver - 8, 14);
  const flat = interpolate(f, [tDeliver, tDeliver + 22], [0, 1], {...clamp, easing: ease});
  const flatOut = pr(f, tGoal2 - 6, 14);
  // the curve reaches each milestone exactly when its word is spoken
  const grow = interpolate(f, [tGoal2 + 2, tSol + 2, tServe + 2, tGrow - 2], [0, 0.3, 0.62, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const area = pr(f, tGoal2 + 10, 30);
  const grid = pr(f, s.start, 16);
  const pins: [number, number, IconName][] = [
    [1, tSol, 'check'],
    [2, tServe, 'layers'],
    [3, tGrow, 'trend'],
  ];
  return (
    <>
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        <defs>
          <linearGradient id="goalArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={T.blue} stopOpacity={0.32} />
            <stop offset="1" stopColor={T.blue} stopOpacity={0} />
          </linearGradient>
          <clipPath id="goalReveal">
            <rect x={0} y={0} width={150 + 820 * grow} height={1920} />
          </clipPath>
        </defs>
        {/* quiet chart frame */}
        <g opacity={grid}>
          {[0, 1, 2, 3].map((k) => (
            <line key={k} x1={110} y1={1080 - k * 180} x2={980} y2={1080 - k * 180} stroke={T.line} strokeWidth={k === 0 ? 2.5 : 1.2} strokeDasharray={k === 0 ? undefined : '4 10'} />
          ))}
        </g>
        {/* «تسليم وبس»: flat, then fades */}
        <line x1={G[0][0] + 70} y1={G[0][1]} x2={G[0][0] + 70 + 760 * flat} y2={G[0][1]} stroke={T.silverDim} strokeWidth={4} strokeDasharray="12 12" opacity={(1 - flatOut * 0.8) * box} />
        <g opacity={flatOut * (1 - grow)} transform={`translate(${G[0][0] + 800} ${G[0][1]})`}>
          <path d="M -14 -14 L 14 14 M 14 -14 L -14 14" stroke="#FF9C8A" strokeWidth={4} strokeLinecap="round" />
        </g>
        {/* the solution that keeps growing */}
        <path d={`${GROW_PATH} L ${G[3][0]} 1080 L ${G[0][0]} 1080 Z`} fill="url(#goalArea)" clipPath="url(#goalReveal)" opacity={area} />
        <path d={GROW_PATH} fill="none" stroke={T.blue} strokeWidth={7} strokeLinecap="round" {...draw(grow, 1100)} style={{filter: `drop-shadow(0 0 14px ${T.glow})`}} />
        {grow > 0.98 ? (
          <path d={`M ${G[3][0] - 34} ${G[3][1] + 4} L ${G[3][0]} ${G[3][1]} L ${G[3][0] - 8} ${G[3][1] + 34}`} fill="none" stroke={T.blue} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={pr(f, tGrow - 2, 8)} />
        ) : null}
      </svg>
      {/* the delivered project, where both lines start */}
      <div style={{position: 'absolute', left: G[0][0] - 60, top: G[0][1] - 190, width: 120, ...enter(box, 30)}}>
        <Slab x={0} y={0} w={120} h={160} state="built" />
        <div style={{position: 'absolute', left: 30, top: 62, width: 60, height: 60, borderRadius: 30, background: T.blue, display: 'grid', placeItems: 'center'}}>
          <Icon name="check" size={36} color={T.white} stroke={2.6} />
        </div>
        <div dir="rtl" style={{position: 'absolute', top: 210, width: 220, left: -50, textAlign: 'center', fontFamily: FONT, fontSize: 30, color: T.silverDim}}>
          تسليم المشروع
        </div>
      </div>
      {/* milestones pop as the curve reaches them */}
      {pins.map(([k, t, icon]) => {
        const p = pr(f, t - 2, 10);
        const [x, y] = G[k];
        return (
          <div key={k} style={{position: 'absolute', left: x - 48, top: y - 48, width: 96, height: 96, borderRadius: 48, display: 'grid', placeItems: 'center', background: T.navy700, border: `3px solid ${T.blue}`, boxShadow: `0 0 ${36 * p}px ${T.glow}`, opacity: p, scale: String(0.6 + p * 0.4)}}>
            <Icon name={icon} size={46} color={T.white} stroke={2} />
          </div>
        );
      })}
      <PixelCluster x={G[3][0] - 10} y={G[3][1] - 150} size={90} mode="solid" opacity={pr(f, tGrow, 12)} />
    </>
  );
};

/* ---------------------------------------------------- 11 · شركة أو فكرة */

const Audience: React.FC<P> = ({s, f}) => {
  const tCo = cue(s, 'شركة');
  const tIdea = cue(s, 'فكرة');
  const co = pr(f, tCo - 4, 16);
  const idea = pr(f, tIdea - 4, 16);
  return (
    <>
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        <line x1={540} y1={380} x2={540} y2={1160} stroke={T.line} strokeWidth={2} strokeDasharray="6 10" opacity={co} />
      </svg>
      {/* a company: built slabs, the shape of the mark */}
      <div style={{position: 'absolute', left: 600, top: 470, ...enter(co, 60)}}>
        <Slab x={0} y={140} w={110} h={420} state="built" />
        <Slab x={130} y={0} w={130} h={560} state="built" />
        <Slab x={280} y={200} w={110} h={360} state="built" />
        <div dir="rtl" style={{position: 'absolute', top: 600, width: 390, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 44, color: T.white}}>
          شركة تريد تطوّرها
        </div>
      </div>
      {/* a new idea: still a blueprint sketch */}
      <div style={{position: 'absolute', left: 90, top: 470, width: 390, ...enter(idea, 60)}}>
        <div style={{height: 560, display: 'grid', placeItems: 'center', border: `2px dashed ${T.blueSoft}`, borderRadius: 30, background: 'rgba(139,188,255,0.04)'}}>
          <Icon name="bulb" size={240} color={T.blueSoft} stroke={1} />
        </div>
        <div dir="rtl" style={{marginTop: 40, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 44, color: T.white}}>
          فكرة ببدايتها
        </div>
      </div>
    </>
  );
};

export const SCENE_ART: Record<string, React.FC<P>> = {
  المشكلة: Problem,
  'وقت ضائع': Question,
  'مهما كانت فكرتك': AnyIdea,
  'بناء الشعار': LogoBuild,
  'من الفكرة إلى التنفيذ': IdeaToExec,
  'نشتغل وياك': Partner,
  '٠١ مواقع إلكترونية': Websites,
  '٠٢ تطبيقات موبايل': Apps,
  '٠٣ متاجر إلكترونية': Stores,
  '٠٤ أنظمة متكاملة': Systems,
  '٠٥ ذكاء اصطناعي': Ai,
  '٠٦ أتمتة': Automation,
  '٠٧ حلول برمجية خاصة': Custom,
  '٠٨ تصاميم وهويات': Identity,
  'بمكان واحد': AllInOne,
  'شنو اللي يميّزنا': Different,
  هدفنا: (pp: P) => <Goal3D {...pp} cue={cue} />,
  'شركة أو فكرة': Audience,
};
