// النسخة القصيرة (~٣٧ ثانية): مقاطع من النسخة الرئيسية تُقطع عند حدود المشاهد، مع موسيقى خاصة بها.
import {Audio} from '@remotion/media';
import React from 'react';
import {AbsoluteFill, Sequence, Series, staticFile} from 'remotion';
import {Animatic} from './Animatic';
import {DATA} from './animaticData';

export const SHORT_FRAMES = DATA.short.reduce((n, [a, b]) => n + b - a, 0);

export const V2Short: React.FC = () => (
  <AbsoluteFill>
    <Series>
      {DATA.short.map(([a, b], i) => (
        <Series.Sequence key={i} durationInFrames={b - a} name={`مقطع ${i + 1}`}>
          <Sequence from={-a} layout="none">
            <Animatic final music={false} />
          </Sequence>
        </Series.Sequence>
      ))}
    </Series>
    <Audio src={staticFile('music/v2short_music.wav')} volume={0.45} />
  </AbsoluteFill>
);
