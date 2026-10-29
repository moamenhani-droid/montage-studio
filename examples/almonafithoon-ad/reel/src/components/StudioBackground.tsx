// Virtual studio set behind the cut-out speaker. Restrained: slow drift, soft key glow, brand lines.
import React from 'react';
import {AbsoluteFill, Img, Interactive, staticFile, useCurrentFrame, type InteractivitySchema} from 'remotion';

const BOKEH = [
  [140, 520, 120, 0.1],
  [930, 430, 160, 0.08],
  [860, 1180, 110, 0.07],
  [220, 1320, 150, 0.06],
  [600, 260, 90, 0.07],
  [990, 820, 70, 0.09],
  [60, 900, 80, 0.08],
] as const;

const StudioBackgroundInner: React.FC<{
  base: string;
  glow: string;
  lines: string;
  image: string;
  imageBlur: number;
}> = ({base, glow, lines, image, imageBlur}) => {
  const frame = useCurrentFrame();
  const drift = frame * 0.25;
  return (
    <>
      {image ? (
        <>
          {/* Photo set: slight defocus so the speaker separates from the room, plus a gentle vignette */}
          <Img
            src={staticFile(image)}
            style={{
              position: 'absolute',
              left: -30,
              top: -40,
              width: 1140,
              height: 2000,
              objectFit: 'cover',
              scale: String(1 + frame * 0.00004),
              filter: `blur(${imageBlur}px) brightness(0.92)`,
            }}
          />
          <AbsoluteFill style={{background: 'radial-gradient(120% 80% at 50% 40%, transparent 55%, rgba(5, 10, 18, 0.55) 100%)'}} />
        </>
      ) : (
        <AbsoluteFill style={{background: `radial-gradient(110% 70% at 50% 30%, ${glow} 0%, ${base} 55%, #050C15 100%)`}} />
      )}
      {image ? null : (
      <>
      {/* Brand pattern: thin vertical silver lines, denser at the edges */}
      <AbsoluteFill>
        {Array.from({length: 14}).map((_, i) => {
          const side = i < 7 ? i : 13 - i;
          const x = i < 7 ? 40 + side * 46 : 1040 - side * 46;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: -200 + ((drift * (0.6 + side * 0.08)) % 200),
                width: 2,
                height: 2400,
                background: `linear-gradient(180deg, transparent, ${lines} 30%, ${lines} 70%, transparent)`,
                opacity: 0.55 - side * 0.07,
              }}
            />
          );
        })}
      </AbsoluteFill>
      {/* Out-of-focus lights for depth */}
      {BOKEH.map(([x, y, r, o], i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x - r + Math.sin((frame + i * 40) / 90) * 14,
            top: y - r + Math.cos((frame + i * 30) / 110) * 10,
            width: r * 2,
            height: r * 2,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(127,178,255,0.9), rgba(127,178,255,0) 70%)',
            opacity: o,
            filter: 'blur(6px)',
          }}
        />
      ))}
      {/* Key light behind the head: separates the speaker from the set */}
      <div
        style={{
          position: 'absolute',
          left: 540 - 520,
          top: 720 - 520,
          width: 1040,
          height: 1040,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(170, 200, 240, 0.32), rgba(127,178,255,0.08) 45%, transparent 70%)',
        }}
      />
      </>
      )}
    </>
  );
};

export const StudioBackground = Interactive.create({
  Component: StudioBackgroundInner,
  componentName: '<StudioBackground>',
  layout: 'absolute-fill',
  schema: {
    base: {type: 'color', default: '#0E1F33', description: 'Base colour'},
    glow: {type: 'color', default: '#2E4A6B', description: 'Top glow colour'},
    lines: {type: 'color', default: 'rgba(201, 211, 222, 0.22)', description: 'Line colour'},
    image: {type: 'asset', assetType: 'image', default: 'backgrounds/office.png', description: 'Photo background (empty = designed studio)'},
    imageBlur: {type: 'number', min: 0, max: 40, step: 1, default: 3, description: 'Photo blur', hiddenFromList: false},
  } as const satisfies InteractivitySchema,
});
