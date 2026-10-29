import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, FONT, glassCard} from './theme';

// Reel cover: a real frame of the speaker (hook framing) with the hook line.
export const Cover: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: C.navyDeep}}>
      <Img
        src={staticFile('footage/cover_frame.png')}
        style={{width: '100%', height: '100%', objectFit: 'cover', transformOrigin: '50% 38%', scale: '1.12'}}
      />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(8,19,31,0.0) 45%, rgba(8,19,31,0.92) 100%)'}} />
      <div style={{position: 'absolute', top: 236, left: 56, ...glassCard, width: 96, height: 96, borderRadius: 28, display: 'grid', placeItems: 'center'}}>
        <Img src={staticFile('brand/mark-white.png')} style={{width: 58, height: 60}} />
      </div>
      <div dir="rtl" style={{position: 'absolute', bottom: 430, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 112, lineHeight: 1.25, color: C.white}}>
        عندك <span style={{color: C.blueSoft}}>فكرة مشروع؟</span>
      </div>
      <div dir="rtl" style={{position: 'absolute', bottom: 330, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 500, fontSize: 50, color: C.silver}}>
        من الفكرة إلى التنفيذ — بمكان واحد
      </div>
    </AbsoluteFill>
  );
};
