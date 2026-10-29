// كتالوج أساليب المونتاج: نماذج ثابتة (١٠٨٠×١٩٢٠) تُجمع في لوحات بعناوين عربية.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {FONT} from '../theme';
import {Canvas, Logo, T, ar} from '../v2/kit';

const OFFICE = 'backgrounds/office.png';
const PERSON = 'catalog/person.png';

const Office: React.FC<{filter?: string}> = ({filter = 'blur(3px) brightness(0.92)'}) => (
  <Img src={staticFile(OFFICE)} style={{position: 'absolute', left: -30, top: -40, width: 1140, height: 2000, objectFit: 'cover', filter}} />
);
const Person: React.FC<{scale?: number; style?: React.CSSProperties}> = ({scale = 1.12, style}) => (
  <Img
    src={staticFile(PERSON)}
    style={{position: 'absolute', inset: 0, width: 1080, height: 1920, translate: '65px 0px', transformOrigin: '50% 38%', scale: String(scale), filter: 'brightness(0.93) contrast(1.06) sepia(0.07)', ...style}}
  />
);
const Pill: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div dir="rtl" style={{fontFamily: FONT, fontWeight: 700, fontSize: 60, color: T.white, padding: '14px 32px 18px', borderRadius: 26, background: 'rgba(8,19,31,0.86)', ...style}}>
    {children}
  </div>
);

/* ------------------------------------------------- نماذج الأساليب الجديدة */

export const TextBehind: React.FC = () => (
  <AbsoluteFill style={{background: T.navy900}}>
    <Office />
    <div dir="rtl" style={{position: 'absolute', top: 470, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 300, lineHeight: 1, color: T.white, textShadow: '0 20px 60px rgba(0,0,0,0.5)'}}>
      فكرتك
    </div>
    <Person scale={1.15} />
    <div style={{position: 'absolute', top: 1340, width: '100%', display: 'flex', justifyContent: 'center'}}>
      <Pill>
        المنفذون تيك… <span style={{color: T.blueSoft}}>تنفيذنا</span>
      </Pill>
    </div>
  </AbsoluteFill>
);

export const BeforeAfter: React.FC = () => (
  <AbsoluteFill style={{background: T.navy900}}>
    <AbsoluteFill style={{clipPath: 'inset(0 50% 0 0)'}}>
      <Img src={staticFile('footage/cover_frame.png')} style={{width: 1080, height: 1920, objectFit: 'cover', scale: '1.12', transformOrigin: '50% 38%'}} />
    </AbsoluteFill>
    <AbsoluteFill style={{clipPath: 'inset(0 0 0 50%)'}}>
      <Office />
      <Person />
    </AbsoluteFill>
    <div style={{position: 'absolute', left: 538, top: 0, bottom: 0, width: 4, background: T.white, boxShadow: '0 0 30px rgba(0,0,0,0.6)'}} />
    <div style={{position: 'absolute', left: 540 - 50, top: 1100, width: 100, height: 100, borderRadius: 50, background: T.white, display: 'grid', placeItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.4)'}}>
      <svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke={T.navy900} strokeWidth={2.4} strokeLinecap="round">
        <path d="M9 6l-6 6 6 6 M15 6l6 6-6 6" />
      </svg>
    </div>
    <Pill style={{position: 'absolute', top: 260, left: 60, fontSize: 48}}>قبل</Pill>
    <Pill style={{position: 'absolute', top: 260, right: 60, fontSize: 48, background: T.blue}}>بعد</Pill>
  </AbsoluteFill>
);

export const ColorGrades: React.FC = () => {
  const grades: [string, string][] = [
    ['دافئ', 'sepia(0.35) saturate(1.2) brightness(1.02)'],
    ['بارد', 'hue-rotate(-12deg) saturate(0.9) brightness(0.95) contrast(1.1)'],
    ['سينمائي', 'grayscale(1) contrast(1.25) brightness(0.95)'],
  ];
  return (
    <AbsoluteFill style={{background: T.navy900}}>
      {grades.map(([name, filter], i) => (
        <AbsoluteFill key={name} style={{clipPath: `inset(0 ${(2 - i) * 33.34}% 0 ${i * 33.33}%)`, filter}}>
          <Office filter="blur(3px)" />
          <Person />
        </AbsoluteFill>
      ))}
      {grades.map(([name], i) => (
        <Pill key={name} style={{position: 'absolute', top: 1500, left: i * 360 + 180 - 110, width: 220, textAlign: 'center', fontSize: 46}}>
          {name}
        </Pill>
      ))}
      {[1, 2].map((k) => (
        <div key={k} style={{position: 'absolute', left: k * 360 - 1, top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,0.6)'}} />
      ))}
    </AbsoluteFill>
  );
};

export const LowerThird: React.FC = () => (
  <AbsoluteFill style={{background: T.navy900}}>
    <Office />
    <Person />
    <div dir="rtl" style={{position: 'absolute', right: 70, bottom: 470, display: 'flex', alignItems: 'stretch', boxShadow: '0 20px 60px rgba(0,0,0,0.5)'}}>
      <div style={{width: 12, background: T.blue, borderRadius: '8px 0 0 8px'}} />
      <div style={{padding: '22px 36px', background: 'rgba(8,19,31,0.92)', borderRadius: '0 0 0 0', fontFamily: FONT}}>
        <div style={{fontSize: 58, fontWeight: 700, color: T.white}}>الاسم هنا</div>
        <div style={{fontSize: 34, fontWeight: 500, color: T.blueSoft, marginTop: 4}}>المنصب · المنفذون تيك</div>
      </div>
      <div style={{width: 120, background: T.white, display: 'grid', placeItems: 'center', borderRadius: '0 8px 8px 0'}}>
        <Img src={staticFile('brand/mark.png')} style={{width: 70, height: 72}} />
      </div>
    </div>
  </AbsoluteFill>
);

export const DataViz: React.FC = () => {
  const bars = [32, 45, 41, 58, 66, 79];
  return (
    <Canvas>
      <div dir="rtl" style={{position: 'absolute', top: 280, right: 90, left: 90, fontFamily: FONT, color: T.white}}>
        <div style={{fontSize: 30, color: T.silverDim}}>بيانات توضيحية</div>
        <div style={{fontSize: 92, fontWeight: 700, marginTop: 6}}>
          نمو <span style={{color: T.blueSoft}}>{ar('+٤٧')}٪</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: 110, right: 110, top: 560, height: 520, display: 'flex', alignItems: 'flex-end', gap: 26}}>
        {bars.map((h, i) => (
          <div key={i} style={{flex: 1, height: `${h}%`, borderRadius: '18px 18px 6px 6px', background: i === bars.length - 1 ? `linear-gradient(180deg, ${T.blueSoft}, ${T.blue})` : 'rgba(139,188,255,0.22)', boxShadow: i === bars.length - 1 ? `0 0 40px ${T.glow}` : undefined}} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 110, right: 110, top: 1090, height: 2, background: T.lineStrong}} />
      <svg width={360} height={360} viewBox="0 0 36 36" style={{position: 'absolute', left: 120, top: 1170}}>
        <circle cx={18} cy={18} r={15.9} fill="none" stroke="rgba(139,188,255,0.18)" strokeWidth={3.4} />
        <circle cx={18} cy={18} r={15.9} fill="none" stroke={T.blue} strokeWidth={3.4} strokeDasharray="68 32" strokeDashoffset={25} strokeLinecap="round" />
      </svg>
      <div style={{position: 'absolute', left: 120, top: 1300, width: 360, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 80, color: T.white}}>{ar('٦٨')}٪</div>
      <div dir="rtl" style={{position: 'absolute', right: 110, top: 1220, width: 420, fontFamily: FONT, color: T.silver, fontSize: 38, lineHeight: 1.6}}>
        {['عدّادات متحركة', 'أعمدة ومنحنيات', 'دوائر نِسب'].map((t) => (
          <div key={t} style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <span style={{width: 16, height: 16, borderRadius: 4, background: T.blue}} />
            {t}
          </div>
        ))}
      </div>
    </Canvas>
  );
};

export const ChatUI: React.FC = () => {
  const msgs: [boolean, string][] = [
    [true, 'مرحبا، عندي فكرة مشروع'],
    [false, 'أهلاً! احچيلنا شنو فكرتك؟'],
    [true, 'متجر إلكتروني + تطبيق'],
    [false, 'ممتاز، نرتبلك جلسة تخطيط مجانية'],
  ];
  return (
    <Canvas>
      <div style={{position: 'absolute', left: 90, right: 90, top: 260, bottom: 340, borderRadius: 50, background: 'rgba(8,19,31,0.9)', border: `2px solid ${T.lineStrong}`, overflow: 'hidden'}}>
        <div dir="rtl" style={{display: 'flex', alignItems: 'center', gap: 20, padding: '30px 36px', borderBottom: `1px solid ${T.line}`}}>
          <div style={{width: 84, height: 84, borderRadius: 42, background: T.white, display: 'grid', placeItems: 'center'}}>
            <Img src={staticFile('brand/mark.png')} style={{width: 52, height: 54}} />
          </div>
          <div style={{fontFamily: FONT}}>
            <div style={{fontSize: 40, fontWeight: 700, color: T.white}}>المنفذون تيك</div>
            <div style={{fontSize: 26, color: T.blueSoft}}>يرد عادةً خلال دقائق</div>
          </div>
        </div>
        <div dir="rtl" style={{padding: '40px 36px', display: 'flex', flexDirection: 'column', gap: 26}}>
          {msgs.map(([me, text], i) => (
            <div key={i} style={{alignSelf: me ? 'flex-start' : 'flex-end', maxWidth: '78%', padding: '22px 30px', borderRadius: 34, background: me ? T.blue : 'rgba(201,211,222,0.12)', fontFamily: FONT, fontSize: 40, fontWeight: 500, color: T.white}}>
              {text}
            </div>
          ))}
          <div style={{alignSelf: 'flex-end', display: 'flex', gap: 10, padding: '24px 30px', borderRadius: 34, background: 'rgba(201,211,222,0.12)'}}>
            {[0, 1, 2].map((k) => (
              <span key={k} style={{width: 14, height: 14, borderRadius: 7, background: T.silver, opacity: 0.4 + k * 0.25}} />
            ))}
          </div>
        </div>
      </div>
    </Canvas>
  );
};

export const ScreenZoom: React.FC = () => (
  <Canvas>
    <div style={{position: 'absolute', left: 60, right: 60, top: 420, borderRadius: 22, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,4,12,0.6)', border: `1.5px solid ${T.lineStrong}`}}>
      <Img src={staticFile('projects/venda-desktop.webp')} style={{width: 960, height: 600, display: 'block'}} />
    </div>
    {/* magnifier on the area being explained */}
    <div style={{position: 'absolute', left: 520, top: 760, width: 380, height: 380, borderRadius: '50%', overflow: 'hidden', border: `6px solid ${T.white}`, boxShadow: `0 0 0 10px rgba(61,139,255,0.35), 0 30px 80px rgba(0,0,0,0.6)`}}>
      <Img src={staticFile('projects/venda-desktop.webp')} style={{position: 'absolute', width: 960 * 2.4, height: 600 * 2.4, left: -1180, top: -560}} />
    </div>
    <svg width={70} height={70} viewBox="0 0 24 24" style={{position: 'absolute', left: 430, top: 860}}>
      <path d="M4 3l14 7-6 2-2 6z" fill={T.white} stroke={T.navy900} strokeWidth={1.2} />
    </svg>
    <div style={{position: 'absolute', left: 405, top: 835, width: 70, height: 70, borderRadius: 35, border: `4px solid ${T.blueSoft}`, opacity: 0.8}} />
    <div style={{position: 'absolute', top: 1260, width: '100%', display: 'flex', justifyContent: 'center'}}>
      <Pill>تكبير على التفاصيل المهمة</Pill>
    </div>
  </Canvas>
);

export const PictureInPicture: React.FC = () => (
  <AbsoluteFill style={{background: T.navy900}}>
    <Canvas>
      <div style={{position: 'absolute', left: 70, right: 70, top: 300, borderRadius: 22, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,4,12,0.6)'}}>
        <Img src={staticFile('projects/inventory.svg')} style={{width: 940, height: 588, display: 'block'}} />
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, top: 920, borderRadius: 22, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,4,12,0.6)'}}>
        <Img src={staticFile('projects/pos.svg')} style={{width: 940, height: 588, display: 'block'}} />
      </div>
    </Canvas>
    <div style={{position: 'absolute', right: 70, bottom: 360, width: 360, height: 360, borderRadius: '50%', overflow: 'hidden', border: `6px solid ${T.white}`, boxShadow: `0 0 0 8px ${T.blue}, 0 30px 80px rgba(0,0,0,0.6)`}}>
      <div style={{position: 'absolute', left: -62, top: -150, width: 1080, height: 1920, scale: '0.4', transformOrigin: '0 0'}}>
        <Office />
        <Person scale={1} />
      </div>
    </div>
  </AbsoluteFill>
);

export const SketchStyle: React.FC = () => (
  <AbsoluteFill style={{background: '#F5F1E8'}}>
    <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
      <defs>
        <filter id="rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="7" />
        </filter>
      </defs>
      <g filter="url(#rough)" fill="none" stroke="#1E2B3A" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx={540} cy={560} rx={330} ry={150} />
        <path d="M 300 820 C 360 980, 420 1040, 520 1080" />
        <path d="M 500 1050 L 525 1083 L 485 1095" />
        <rect x={190} y={1130} width={300} height={220} rx={24} />
        <rect x={590} y={1130} width={300} height={220} rx={24} />
        <path d="M 490 1240 L 590 1240" />
        <path d="M 570 1222 L 592 1240 L 570 1258" />
      </g>
      <g filter="url(#rough)" fill="none" stroke={T.blue} strokeWidth={10} strokeLinecap="round">
        <path d="M 260 640 C 420 690, 660 690, 820 640" />
      </g>
    </svg>
    <div dir="rtl" style={{position: 'absolute', top: 470, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 110, color: '#1E2B3A'}}>
      فكرتك
    </div>
    <div dir="rtl" style={{position: 'absolute', left: 190, top: 1205, width: 300, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 52, color: '#1E2B3A'}}>
      تخطيط
    </div>
    <div dir="rtl" style={{position: 'absolute', left: 590, top: 1205, width: 300, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 52, color: T.blue}}>
      تنفيذ
    </div>
    <div dir="rtl" style={{position: 'absolute', top: 1460, width: '100%', textAlign: 'center', fontFamily: FONT, fontSize: 40, color: '#5E6B7A'}}>
      رسم يدوي يُرسم أمام المشاهد
    </div>
  </AbsoluteFill>
);

export const NeonTech: React.FC = () => (
  <AbsoluteFill style={{background: '#03060C', overflow: 'hidden'}}>
    <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 2px, transparent 2px 6px)'}} />
    <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
      {Array.from({length: 14}).map((_, i) => (
        <line key={i} x1={540} y1={1250} x2={-400 + i * 140} y2={1920} stroke="rgba(61,139,255,0.35)" strokeWidth={2} />
      ))}
      {Array.from({length: 8}).map((_, i) => (
        <line key={`h${i}`} x1={0} y1={1290 + i * i * 12} x2={1080} y2={1290 + i * i * 12} stroke="rgba(61,139,255,0.3)" strokeWidth={2} />
      ))}
    </svg>
    {[
      ['#FF2E88', -6],
      ['#22D3EE', 6],
      ['#FFFFFF', 0],
    ].map(([c, dx], i) => (
      <div key={i} dir="rtl" style={{position: 'absolute', top: 640, width: '100%', textAlign: 'center', translate: `${dx}px 0px`, fontFamily: FONT, fontWeight: 700, fontSize: 200, color: c as string, mixBlendMode: i < 2 ? 'screen' : 'normal', opacity: i < 2 ? 0.75 : 1, textShadow: i === 2 ? '0 0 40px #3D8BFF, 0 0 90px #3D8BFF' : undefined}}>
        تنفيذنا
      </div>
    ))}
    <div style={{position: 'absolute', top: 920, left: 0, right: 0, height: 18, background: 'rgba(34,211,238,0.5)', mixBlendMode: 'screen'}} />
    <div dir="rtl" style={{position: 'absolute', top: 1010, width: '100%', textAlign: 'center', fontFamily: FONT, fontSize: 44, color: '#8BBCFF', letterSpacing: 0}}>
      نيون · تشويش رقمي · شبكة مستقبلية
    </div>
  </AbsoluteFill>
);

export const Editorial: React.FC = () => (
  <AbsoluteFill style={{background: '#EFEAE0'}}>
    <div dir="rtl" style={{position: 'absolute', top: 260, right: 80, left: 80, fontFamily: FONT, fontWeight: 700, color: '#0E1F33', lineHeight: 0.98}}>
      <div style={{fontSize: 70, color: '#8A6C3E', fontWeight: 600}}>العدد ٠١</div>
      <div style={{fontSize: 230}}>من</div>
      <div style={{fontSize: 230, color: 'transparent', WebkitTextStroke: '4px #0E1F33'}}>الفكرة</div>
      <div style={{fontSize: 230}}>إلى</div>
      <div style={{fontSize: 230, color: '#3D8BFF'}}>التنفيذ</div>
    </div>
    <div style={{position: 'absolute', left: 80, right: 80, top: 1360, height: 3, background: '#0E1F33'}} />
    <div dir="rtl" style={{position: 'absolute', top: 1390, right: 80, left: 80, display: 'flex', justifyContent: 'space-between', fontFamily: FONT, fontSize: 34, color: '#0E1F33'}}>
      <span>طباعة تحريرية جريئة</span>
      <span>المنفذون تيك</span>
    </div>
  </AbsoluteFill>
);

export const MapPin: React.FC = () => (
  <Canvas>
    <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
      {Array.from({length: 22}).map((_, i) => (
        <path key={i} d={`M ${-100 + i * 60} 300 C ${200 + i * 30} ${700 + (i % 5) * 40}, ${300 + i * 20} ${1100 - (i % 3) * 60}, ${-50 + i * 70} 1600`} stroke="rgba(139,188,255,0.12)" strokeWidth={3} fill="none" />
      ))}
      <path d="M 80 1180 C 300 1100, 420 980, 560 940 S 860 820, 1040 700" stroke={T.blue} strokeWidth={6} fill="none" strokeDasharray="18 14" />
      {[
        [1240, 120],
        [1450, 0],
      ].map(([r, d], i) => (
        <circle key={i} cx={560} cy={940} r={r / 10 + d / 4} fill="none" stroke={T.blueSoft} strokeWidth={2} opacity={0.5 - i * 0.2} />
      ))}
    </svg>
    <div style={{position: 'absolute', left: 560 - 60, top: 940 - 150, width: 120, height: 150}}>
      <svg width={120} height={150} viewBox="0 0 24 30">
        <path d="M12 0C5.4 0 0 5.2 0 11.7 0 20 12 30 12 30s12-10 12-18.3C24 5.2 18.6 0 12 0z" fill={T.blue} />
        <circle cx={12} cy={11.5} r={4.6} fill={T.white} />
      </svg>
    </div>
    <div dir="rtl" style={{position: 'absolute', top: 1010, width: '100%', display: 'flex', justifyContent: 'center'}}>
      <div style={{padding: '22px 40px', borderRadius: 30, background: 'rgba(8,19,31,0.9)', border: `2px solid ${T.lineStrong}`, fontFamily: FONT, textAlign: 'center'}}>
        <div style={{fontSize: 64, fontWeight: 700, color: T.white}}>بغداد</div>
        <div style={{fontSize: 30, color: T.blueSoft}}>خرائط ومسارات ومواقع</div>
      </div>
    </div>
  </Canvas>
);

/* ------------------------------------------------------------ اللوحات */

type Tile = {n: number; name: string; tag: 'منفّذ في إعلانك' | 'نموذج جديد'; img?: string; C?: React.FC};

const TILES: Tile[] = [
  {n: 1, name: 'كابشن حركي على الوجه', tag: 'منفّذ في إعلانك', img: 'catalog/face_caption.png'},
  {n: 2, name: 'بطاقات وأيقونات متحركة', tag: 'منفّذ في إعلانك', img: 'catalog/problem_cards.png'},
  {n: 3, name: 'مشهد ثلاثي الأبعاد', tag: 'منفّذ في إعلانك', img: 'catalog/scatter3d.png'},
  {n: 4, name: 'لوحة هوية زجاجية', tag: 'منفّذ في إعلانك', img: 'catalog/glass_plate.png'},
  {n: 5, name: 'بناء الشعار من مخطط', tag: 'منفّذ في إعلانك', img: 'catalog/logo_build.png'},
  {n: 6, name: 'موقع داخل متصفح', tag: 'منفّذ في إعلانك', img: 'catalog/mockup_web.png'},
  {n: 7, name: 'تطبيقات داخل جوال', tag: 'منفّذ في إعلانك', img: 'catalog/mockup_apps.png'},
  {n: 8, name: 'شبكة ذكاء اصطناعي', tag: 'منفّذ في إعلانك', img: 'catalog/ai_network.png'},
  {n: 9, name: 'مسار مراحل متصل', tag: 'منفّذ في إعلانك', img: 'catalog/process_rail.png'},
  {n: 10, name: 'رسم بياني ثلاثي الأبعاد', tag: 'منفّذ في إعلانك', img: 'catalog/growth3d.png'},
  {n: 11, name: 'طباعة الشعار النصي', tag: 'منفّذ في إعلانك', img: 'catalog/slogan.png'},
  {n: 12, name: 'شاشة ختامية', tag: 'منفّذ في إعلانك', img: 'catalog/end_screen.png'},
  {n: 13, name: 'نص خلف الشخص', tag: 'نموذج جديد', C: TextBehind},
  {n: 14, name: 'تغيير الخلفية: قبل وبعد', tag: 'نموذج جديد', C: BeforeAfter},
  {n: 15, name: 'تدرّج الألوان', tag: 'نموذج جديد', C: ColorGrades},
  {n: 16, name: 'شريط الاسم', tag: 'نموذج جديد', C: LowerThird},
  {n: 17, name: 'أرقام ورسوم بيانية', tag: 'نموذج جديد', C: DataViz},
  {n: 18, name: 'محادثة ورسائل', tag: 'نموذج جديد', C: ChatUI},
  {n: 19, name: 'تسجيل شاشة مع تكبير', tag: 'نموذج جديد', C: ScreenZoom},
  {n: 20, name: 'صورة داخل صورة', tag: 'نموذج جديد', C: PictureInPicture},
  {n: 21, name: 'رسم يدوي (سبورة)', tag: 'نموذج جديد', C: SketchStyle},
  {n: 22, name: 'نيون وتقني', tag: 'نموذج جديد', C: NeonTech},
  {n: 23, name: 'طباعة تحريرية', tag: 'نموذج جديد', C: Editorial},
  {n: 24, name: 'خرائط ومواقع', tag: 'نموذج جديد', C: MapPin},
];

const TW = 300;
const TH = 533;
const GAP = 26;
export const SHEET_W = 4 * TW + 5 * GAP;
export const SHEET_H = 150 + 2 * (TH + 96) + 2 * GAP;

export const CatalogSheet: React.FC<{page: number}> = ({page}) => {
  const tiles = TILES.slice(page * 8, page * 8 + 8);
  const titles = ['أساليب منفّذة في إعلانك (١)', 'منفّذة في إعلانك (٢) · ونماذج للشخص', 'نماذج أساليب إضافية'];
  return (
    <AbsoluteFill style={{background: T.navy900, fontFamily: FONT}}>
      <div dir="rtl" style={{position: 'absolute', top: 30, right: GAP + 4, left: GAP + 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div>
          <div style={{fontSize: 24, color: T.silverDim}}>كتالوج أساليب المونتاج · {ar(page + 1)} / {ar(3)}</div>
          <div style={{fontSize: 52, fontWeight: 700, color: T.white}}>{titles[page]}</div>
        </div>
        <Logo state="solid" width={104} />
      </div>
      {tiles.map((t, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = SHEET_W - GAP - TW - col * (TW + GAP); // right-to-left order
        const y = 150 + row * (TH + 96 + GAP);
        const fresh = t.tag === 'نموذج جديد';
        return (
          <div key={t.n} style={{position: 'absolute', left: x, top: y, width: TW}}>
            <div style={{position: 'relative', width: TW, height: TH, borderRadius: 18, overflow: 'hidden', border: `1.5px solid ${fresh ? T.blue : T.lineStrong}`}}>
              {t.img ? <Img src={staticFile(t.img)} style={{width: TW, height: TH, display: 'block'}} /> : null}
              {t.C ? (
                <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, scale: String(TW / 1080), transformOrigin: '0 0'}}>
                  <t.C />
                </div>
              ) : null}
            </div>
            <div dir="rtl" style={{marginTop: 12, display: 'flex', alignItems: 'baseline', gap: 10}}>
              <span style={{fontSize: 26, fontWeight: 700, color: T.blueSoft}}>{ar(t.n)}</span>
              <span style={{fontSize: 25, fontWeight: 700, color: T.white}}>{t.name}</span>
            </div>
            <div dir="rtl" style={{fontSize: 20, color: fresh ? T.blueSoft : T.silverDim, marginTop: 2}}>{t.tag}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

