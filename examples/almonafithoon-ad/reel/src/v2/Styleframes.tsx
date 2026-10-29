// المرحلة الأولى: لوحة نظام التصميم وستة إطارات تصميمية ثابتة باتجاه «من المخطط إلى البناء».
import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile} from 'remotion';
import {FONT} from '../theme';
import {Icon, type IconName} from '../components/Icon';
import {
  BuildWipe,
  Canvas,
  Counter,
  CropMarks,
  Dimension,
  KineticLine,
  Logo,
  OutlineText,
  PixelCluster,
  SAFE,
  Slab,
  T,
  TYPE,
  ar,
} from './kit';

const Label: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div dir="rtl" style={{fontFamily: FONT, fontWeight: 500, fontSize: TYPE.label, color: T.silverDim, ...style}}>
    {children}
  </div>
);

/* ------------------------------------------------- 0 · لوحة نظام التصميم */

export const DesignSystem: React.FC = () => {
  const swatches: [string, string][] = [
    ['كحلي عميق', T.navy900],
    ['كحلي الهوية', T.brand],
    ['فولاذي', T.steel],
    ['فضي', T.silver],
    ['أبيض', T.white],
    ['أزرق كهربائي', T.blue],
  ];
  const curves: [string, string, string][] = [
    ['دخول العناصر', '٤٠٠ مللي ثانية', 'M0 100 C 22 0, 36 0, 100 0'],
    ['خروج العناصر', '٢٥٠ مللي ثانية', 'M0 100 C 55 100, 80 60, 100 0'],
    ['ظهور الكلمات', '١٣٠ مللي ثانية', 'M0 100 C 10 10, 30 0, 100 0'],
    ['حركة الكاميرا', '٧٠٠ مللي ثانية', 'M0 100 C 45 100, 55 0, 100 0'],
  ];
  return (
    <Canvas grid={0.7}>
      <div dir="rtl" style={{position: 'absolute', top: 120, right: 72, left: 72, fontFamily: FONT, color: T.white}}>
        <Counter n={0} of={6} label="نظام التصميم" />
        <div style={{fontSize: 92, fontWeight: 700, marginTop: 18, lineHeight: 1.15}}>
          من <OutlineText size={92}>المخطط</OutlineText> إلى <span style={{color: T.blueSoft}}>البناء</span>
        </div>

        <Label style={{marginTop: 64}}>الألوان — الأزرق للكلمات المفتاحية والحالات الفعّالة فقط</Label>
        <div style={{display: 'flex', gap: 16, marginTop: 20}}>
          {swatches.map(([name, c]) => (
            <div key={name} style={{flex: 1}}>
              <div style={{height: 130, borderRadius: 18, background: c, border: `1.5px solid ${T.lineStrong}`}} />
              <div style={{fontSize: 22, color: T.silver, marginTop: 10, textAlign: 'center'}}>{name}</div>
            </div>
          ))}
        </div>

        <Label style={{marginTop: 64}}>الخط — ريدكس برو بثلاثة مستويات</Label>
        <div style={{marginTop: 14, borderTop: `1px solid ${T.line}`}}>
          {[
            ['عنوان رئيسي', TYPE.display, 700, 'بمكان واحد'],
            ['نص حركي', TYPE.body, 600, 'نشتغل وياك حتى نوصل'],
            ['تسمية', TYPE.label + 6, 500, 'المرحلة الرابعة — التصميم'],
          ].map(([name, size, weight, sample]) => (
            <div key={name as string} style={{display: 'flex', alignItems: 'baseline', gap: 30, padding: '14px 0', borderBottom: `1px solid ${T.line}`}}>
              <div style={{width: 170, fontSize: 22, color: T.silverDim}}>
                {name} · {ar(size as number)}
              </div>
              <div style={{fontSize: size as number, fontWeight: weight as number, lineHeight: 1.1}}>{sample}</div>
            </div>
          ))}
        </div>

        <Label style={{marginTop: 56}}>المفردات البصرية — مستمدة من الشعار</Label>
        <div style={{display: 'flex', gap: 22, marginTop: 20, height: 250}}>
          <div style={{flex: 1, position: 'relative', border: `1px solid ${T.line}`, borderRadius: 20}}>
            <PixelCluster x={70} y={40} size={130} mode="mixed" />
            <div style={{position: 'absolute', bottom: 14, width: '100%', textAlign: 'center', fontSize: 22, color: T.silver}}>مربعات الانتقال</div>
          </div>
          <div style={{flex: 1, position: 'relative', border: `1px solid ${T.line}`, borderRadius: 20}}>
            <Slab x={40} y={36} w={90} h={150} state="blueprint" />
            <Slab x={150} y={36} w={90} h={150} state="built" />
            <div style={{position: 'absolute', bottom: 14, width: '100%', textAlign: 'center', fontSize: 22, color: T.silver}}>كتل البناء</div>
          </div>
          <div style={{flex: 1, position: 'relative', border: `1px solid ${T.line}`, borderRadius: 20, display: 'grid', placeItems: 'center'}}>
            <div style={{display: 'flex', gap: 18, alignItems: 'center', marginBottom: 30}}>
              <OutlineText size={110}>ف</OutlineText>
              <Icon name="trend" size={34} color={T.blueSoft} />
              <span style={{fontSize: 110, fontWeight: 700}}>ف</span>
            </div>
            <div style={{position: 'absolute', bottom: 14, width: '100%', textAlign: 'center', fontSize: 22, color: T.silver}}>من الخط إلى التعبئة</div>
          </div>
        </div>

        <Label style={{marginTop: 56}}>الحركة — منحنيات ناعمة بلا ارتداد، والخروج أهدأ من الدخول</Label>
        <div style={{display: 'flex', gap: 18, marginTop: 20}}>
          {curves.map(([name, ms, d]) => (
            <div key={name} style={{flex: 1, border: `1px solid ${T.line}`, borderRadius: 18, padding: 18}}>
              <svg viewBox="-6 -6 112 112" width="100%" height={120}>
                <rect x={0} y={0} width={100} height={100} fill="none" stroke={T.line} />
                <path d={d} fill="none" stroke={T.blue} strokeWidth={3.5} />
              </svg>
              <div style={{fontSize: 22, color: T.white, marginTop: 10}}>{name}</div>
              <div style={{fontSize: 20, color: T.silverDim}}>{ms}</div>
            </div>
          ))}
        </div>
      </div>
    </Canvas>
  );
};

/* ------------------------------------- 1 · الانتقال بالتطابق (الكاميرا تندفع للجدار) */

export const Frame1MatchCut: React.FC = () => (
  <AbsoluteFill style={{background: T.navy900, overflow: 'hidden'}}>
    {/* the office mid push-in toward the navy wall; stacked scales fake the zoom streaks */}
    {[1.62, 1.54, 1.46].map((sc, i) => (
      <Img
        key={sc}
        src={staticFile('backgrounds/office.png')}
        style={{
          position: 'absolute',
          inset: 0,
          width: 1080,
          height: 1920,
          objectFit: 'cover',
          scale: String(sc),
          transformOrigin: '46% 33%',
          filter: `blur(${2 + i * 3}px) brightness(0.9)`,
          opacity: i === 0 ? 1 : 0.35,
        }}
      />
    ))}
    {/* the wall becomes the blueprint canvas, starting at its centre */}
    <AbsoluteFill
      style={{
        background: `radial-gradient(34% 22% at 46% 36%, ${T.navy700} 0%, rgba(14,31,51,0.6) 60%, transparent 100%)`,
      }}
    />
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${T.lineStrong} 1px, transparent 1px), linear-gradient(90deg, ${T.lineStrong} 1px, transparent 1px)`,
        backgroundSize: '96px 96px',
        backgroundPosition: '6px 18px',
        maskImage: 'radial-gradient(30% 19% at 46% 36%, black 10%, transparent 100%)',
      }}
    />
    <PixelCluster x={440} y={560} size={130} mode="mixed" />
    <CropMarks x={270} y={460} w={460} h={430} color={T.blueSoft} />
    {/* the speaker, close to the lens, sliding out of frame as the camera passes him */}
    <OffthreadVideo
      src={staticFile('footage/person_alpha.webm')}
      transparent
      muted
      trimBefore={165}
      style={{position: 'absolute', inset: 0, width: 1080, height: 1920, scale: '1.75', translate: '-470px 470px', filter: 'blur(12px) brightness(0.8)'}}
    />
    <div style={{position: 'absolute', top: 1000, left: 240, right: 60}}>
      <KineticLine words={['مبرمج،']} upTo={0} size={TYPE.h1} />
    </div>
    <AbsoluteFill style={{background: 'radial-gradient(120% 80% at 46% 38%, transparent 50%, rgba(2,6,12,0.7) 100%)'}} />
  </AbsoluteFill>
);

/* --------------------------------------------------------- 2 · المشكلة */

export const Frame2Problem: React.FC = () => {
  const cards: {label: string; icon: IconName; x: number; y: number; r: number; tag: string}[] = [
    {label: 'مبرمج', icon: 'code', x: 520, y: 330, r: 4, tag: 'جهة ١'},
    {label: 'مصمّم', icon: 'pen', x: 110, y: 560, r: -5, tag: 'جهة ٢'},
    {label: 'شركات متفرقة', icon: 'building', x: 300, y: 820, r: 3, tag: 'جهة ٣'},
  ];
  return (
    <Canvas focus={[50, 38]}>
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        {[
          'M 720 480 C 300 380, 820 700, 300 690',
          'M 300 700 C 560 640, 120 980, 620 950',
          'M 640 960 C 980 760, 520 520, 760 470',
          'M 290 720 C 700 900, 260 400, 700 500',
        ].map((d, i) => (
          <path key={i} d={d} stroke={T.silverDim} strokeWidth={2} strokeDasharray="8 10" fill="none" opacity={0.7} />
        ))}
      </svg>
      {cards.map((c) => (
        <div
          key={c.label}
          dir="rtl"
          style={{
            position: 'absolute',
            left: c.x,
            top: c.y,
            rotate: `${c.r}deg`,
            padding: '30px 40px 28px',
            borderRadius: 26,
            background: 'rgba(14, 31, 51, 0.82)',
            border: `2px dashed ${T.blueSoft}`,
            boxShadow: '0 30px 80px rgba(0,4,12,0.55)',
            fontFamily: FONT,
            color: T.white,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
            <div style={{width: 96, height: 96, borderRadius: 26, display: 'grid', placeItems: 'center', background: 'rgba(61,139,255,0.14)'}}>
              <Icon name={c.icon} size={56} color={T.blueSoft} />
            </div>
            <div>
              <div style={{fontSize: 24, color: T.silverDim}}>{c.tag}</div>
              <div style={{fontSize: 70, fontWeight: 700, lineHeight: 1.1, whiteSpace: 'nowrap'}}>{c.label}</div>
            </div>
          </div>
        </div>
      ))}
      {/* invoices piling up — no figures, only the idea of repeated cost */}
      <div style={{position: 'absolute', left: 120, top: 1000}}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: i * 26,
              top: -i * 30,
              width: 190,
              height: 240,
              rotate: `${-6 + i * 5}deg`,
              borderRadius: 14,
              background: T.navy800,
              border: `2px solid ${i === 2 ? '#FF9C8A' : T.lineStrong}`,
              padding: 22,
            }}
          >
            {[0.9, 0.6, 0.75, 0.5].map((w, k) => (
              <div key={k} style={{height: 10, width: `${w * 100}%`, background: T.line, borderRadius: 5, marginBottom: 18}} />
            ))}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', top: 1290, left: SAFE.left, right: SAFE.left}}>
        <KineticLine words={['وكوست', 'أضعاف', 'الطبيعي']} upTo={1} keys={[1]} size={TYPE.h1} />
      </div>
    </Canvas>
  );
};

/* ------------------------------------------------------ 3 · بناء الشعار */

export const Frame3LogoBuild: React.FC = () => {
  const W = 520;
  const H = W * (742 / 938);
  const x = (1080 - W) / 2;
  const y = 560;
  const fill = 0.56; // how much of the logo is already «built» (from the bottom)
  return (
    <Canvas focus={[50, 40]}>
      <div style={{position: 'absolute', top: 300, left: SAFE.left, right: SAFE.left}}>
        <KineticLine words={['مهما', 'كانت', 'فكرتك', 'أو', 'احتياجات', 'مشروعك', 'التقنية،']} upTo={6} size={44} weight={600} style={{opacity: 0.38}} />
      </div>
      <div style={{position: 'absolute', left: x - 140, top: y - 140, width: W + 280, height: H + 280, background: `radial-gradient(circle, ${T.glow}, transparent 62%)`, opacity: 0.55}} />
      <Dimension x1={x} y1={y - 50} x2={x + W} y2={y - 50} label={ar(W)} />
      <Dimension x1={x - 50} y1={y} x2={x - 50} y2={y + H} label={ar(Math.round(H))} />
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        <line x1={540} y1={y - 120} x2={540} y2={y + H + 120} stroke={T.line} strokeWidth={1.5} />
        <line x1={x - 120} y1={y + H / 2} x2={x + W + 120} y2={y + H / 2} stroke={T.line} strokeWidth={1.5} />
        <circle cx={540} cy={y + H / 2} r={H * 0.62} stroke={T.line} strokeWidth={1.5} fill="none" strokeDasharray="4 10" />
      </svg>
      <div style={{position: 'absolute', left: x, top: y}}>
        <Logo state="outline" width={W} style={{opacity: 0.9}} />
        <div style={{position: 'absolute', inset: 0, clipPath: `inset(${(1 - fill) * 100}% 0 0 0)`}}>
          <Logo state="solid" width={W} />
        </div>
        <div style={{position: 'absolute', left: -40, right: -40, top: H * (1 - fill) - 2, height: 4, background: T.blue, boxShadow: `0 0 28px 6px ${T.glow}`}} />
      </div>
      <PixelCluster x={x + W + 10} y={y - 110} size={90} mode="outline" opacity={0.7} />
      <PixelCluster x={x - 150} y={y + H - 30} size={70} mode="solid" opacity={0.85} />
      <div style={{position: 'absolute', top: y + H + 110, left: SAFE.left, right: SAFE.left}}>
        <KineticLine words={['المنفذون', 'تيك']} upTo={1} size={TYPE.display} />
        <KineticLine words={['تقدر', 'توفرلك', 'الحل…']} upTo={-1} size={TYPE.h2} weight={600} style={{marginTop: 6}} />
      </div>
    </Canvas>
  );
};

/* -------------------------------------------------------- 4 · الخدمات */

export const Frame4Services: React.FC = () => {
  const next: {label: string; icon: IconName}[] = [
    {label: 'تطبيقات موبايل', icon: 'phone'},
    {label: 'متاجر إلكترونية', icon: 'bag'},
    {label: 'أنظمة متكاملة', icon: 'grid'},
  ];
  return (
    <Canvas focus={[50, 45]}>
      <div dir="rtl" style={{position: 'absolute', top: 290, right: SAFE.right - 40, left: SAFE.left}}>
        <Counter n={1} of={8} label="خدماتنا" />
        <div style={{fontFamily: FONT, fontWeight: 700, fontSize: TYPE.h1, color: T.white, marginTop: 10, lineHeight: 1.1}}>
          مواقع <span style={{color: T.blueSoft}}>إلكترونية</span>
        </div>
      </div>
      <div style={{position: 'absolute', top: 640, left: 70}}>
        <BuildWipe src="projects/venda-desktop.webp" w={940} h={588} at={0.38} />
        <CropMarks x={-20} y={-20} w={980} h={628} color={T.blueSoft} size={30} />
      </div>
      <Label style={{position: 'absolute', top: 1255, right: SAFE.right - 40}}>من مشاريعنا المنشورة — Venda</Label>
      {/* the camera keeps travelling along the wall of work */}
      <div dir="rtl" style={{position: 'absolute', top: 1330, right: -40, display: 'flex', gap: 22, opacity: 0.55}}>
        {next.map((n, i) => (
          <div
            key={n.label}
            style={{
              width: 330,
              height: 150,
              borderRadius: 22,
              border: `1.5px dashed ${T.lineStrong}`,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '0 26px',
              fontFamily: FONT,
              fontSize: 34,
              fontWeight: 600,
              color: T.silver,
              opacity: 1 - i * 0.25,
            }}
          >
            <Icon name={n.icon} size={44} color={T.blueSoft} />
            {n.label}
          </div>
        ))}
      </div>
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        <line x1={0} y1={1530} x2={1080} y2={1530} stroke={T.line} strokeWidth={2} />
        {[880, 600, 320, 40].map((cx, i) => (
          <circle key={cx} cx={cx} cy={1530} r={i === 0 ? 9 : 6} fill={i === 0 ? T.blue : T.lineStrong} />
        ))}
      </svg>
    </Canvas>
  );
};

/* ----------------------------------------------------- 5 · مراحل العمل */

export const Frame5Process: React.FC = () => {
  const steps = ['نسمع', 'نفهم', 'نخطّط', 'نصمّم', 'نبرمج', 'نطلق', 'نطوّر'];
  const current = 3;
  const gap = 300;
  return (
    <Canvas focus={[50, 46]}>
      <div dir="rtl" style={{position: 'absolute', top: 300, right: SAFE.right - 40}}>
        <Counter n={current + 1} of={steps.length} label="كيف نشتغل" />
      </div>
      {/* the track the camera travels along; right-to-left like the reading direction */}
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        <line x1={0} y1={980} x2={1080} y2={980} stroke={T.line} strokeWidth={3} />
        <line x1={540} y1={980} x2={1080} y2={980} stroke={T.blue} strokeWidth={4} />
        {steps.map((_, i) => {
          const cx = 540 + (current - i) * gap;
          return <circle key={i} cx={cx} cy={980} r={i === current ? 16 : 9} fill={i <= current ? T.blue : T.navy700} stroke={i <= current ? T.blueSoft : T.lineStrong} strokeWidth={2} />;
        })}
      </svg>
      {steps.map((s, i) => {
        if (i === current) return null;
        const cx = 540 + (current - i) * gap;
        if (cx < -100 || cx > 1180) return null;
        return (
          <div key={s} dir="rtl" style={{position: 'absolute', top: 1020, left: cx - 150, width: 300, textAlign: 'center', fontFamily: FONT, fontSize: 48, fontWeight: 600, color: i < current ? T.silver : T.silverDim, opacity: i < current ? 0.6 : 0.3}}>
            {s}
          </div>
        );
      })}
      {/* current verb: huge type + its artefact (a wireframe being drawn) */}
      <div style={{position: 'absolute', top: 470, left: 290, width: 500, height: 380}}>
        <svg width={500} height={380} style={{overflow: 'visible'}}>
          <rect x={0} y={0} width={500} height={380} rx={24} fill="rgba(139,188,255,0.04)" stroke={T.blueSoft} strokeWidth={2} strokeDasharray="10 8" />
          <rect x={30} y={30} width={440} height={50} rx={10} fill="none" stroke={T.blueSoft} strokeWidth={2} />
          <rect x={30} y={105} width={260} height={150} rx={14} fill="rgba(61,139,255,0.18)" stroke={T.blue} strokeWidth={2} />
          <rect x={310} y={105} width={160} height={70} rx={10} fill="none" stroke={T.lineStrong} strokeWidth={2} />
          <rect x={310} y={190} width={160} height={65} rx={10} fill="none" stroke={T.lineStrong} strokeWidth={2} />
          <rect x={30} y={280} width={440} height={16} rx={8} fill={T.line} />
          <rect x={30} y={312} width={300} height={16} rx={8} fill={T.line} />
          <circle cx={250} cy={180} r={8} fill={T.white} />
          <path d="M 250 180 L 290 230 L 270 232 L 282 258" stroke={T.white} strokeWidth={3} fill="none" />
        </svg>
      </div>
      <div style={{position: 'absolute', top: 1100, left: 0, right: 0, textAlign: 'center'}}>
        <span style={{fontFamily: FONT, fontWeight: 700, fontSize: TYPE.display, color: T.white, filter: `drop-shadow(0 0 30px ${T.glow})`}}>{steps[current]}</span>
      </div>
      <div style={{position: 'absolute', top: 1320, left: SAFE.left, right: SAFE.left}}>
        <KineticLine words={['نخطّط،', 'نصمّم،', 'نبرمج،', 'ونوصل', 'وياك…']} upTo={1} size={46} weight={600} style={{opacity: 0.7}} />
      </div>
    </Canvas>
  );
};

/* ------------------------------------------------------ 6 · الشعار النصي */

export const Frame6Slogan: React.FC = () => (
  <Canvas focus={[50, 46]}>
    <div style={{position: 'absolute', top: 330, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <Logo state="solid" width={300} />
    </div>
    <Label style={{position: 'absolute', top: 600, width: '100%', textAlign: 'center', fontSize: 32, color: T.silver}}>المنفذون تيك</Label>
    <div dir="rtl" style={{position: 'absolute', top: 760, left: 0, right: 0, textAlign: 'center', lineHeight: 1.05}}>
      <div>
        <OutlineText size={190} stroke={2.5}>فكرتك،</OutlineText>
      </div>
      <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 190, color: T.white, filter: `drop-shadow(0 0 40px ${T.glow})`}}>
        تنفيذ<span style={{color: T.blueSoft}}>نا</span>
      </div>
    </div>
    <Dimension x1={160} y1={760} x2={160} y2={980} label="فكرة" />
    <Dimension x1={160} y1={1000} x2={160} y2={1210} label="تنفيذ" color={T.blueSoft} />
    <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
      <path d="M 900 900 C 980 960, 980 1040, 900 1100" stroke={T.blue} strokeWidth={3} fill="none" />
      <path d="M 912 1084 L 900 1100 L 920 1104" stroke={T.blue} strokeWidth={3} fill="none" />
    </svg>
    <PixelCluster x={150} y={1330} size={110} mode="solid" opacity={0.9} />
    <PixelCluster x={820} y={500} size={80} mode="outline" opacity={0.6} />
  </Canvas>
);
