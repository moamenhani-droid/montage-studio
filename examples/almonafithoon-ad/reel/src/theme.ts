import {loadFont} from '@remotion/google-fonts/ReadexPro';

const readex = loadFont('normal', {
  weights: ['400', '500', '600', '700'],
  subsets: ['arabic', 'latin'],
});

export const FONT = readex.fontFamily;

// Premium tech palette: deep navy, silver, white, restrained electric blue.
export const C = {
  navyDeep: '#08131F',
  navy: '#0E1F33',
  navyBrand: '#16283C',
  navy600: '#2E4A6B',
  silver: '#C9D3DE',
  silverDim: 'rgba(201, 211, 222, 0.55)',
  white: '#FFFFFF',
  blue: '#3D8BFF',
  blueSoft: '#7FB2FF',
  logoBlue: '#4A86C5',
  glass: 'rgba(10, 24, 40, 0.74)',
  glassBorder: 'rgba(201, 211, 222, 0.22)',
} as const;

// Instagram Reels safe area on a 1080x1920 canvas.
export const SAFE = {
  top: 220,
  bottom: 380,
  left: 64,
  right: 150,
} as const;

export const glassCard: React.CSSProperties = {
  background: C.glass,
  backdropFilter: 'blur(22px) saturate(1.2)',
  border: `1.5px solid ${C.glassBorder}`,
  borderRadius: 34,
  boxShadow: '0 30px 80px rgba(0, 8, 20, 0.45)',
};

export const brollBackground: React.CSSProperties = {
  background: `radial-gradient(120% 80% at 50% 0%, ${C.navy600} 0%, ${C.navy} 45%, ${C.navyDeep} 100%)`,
};
