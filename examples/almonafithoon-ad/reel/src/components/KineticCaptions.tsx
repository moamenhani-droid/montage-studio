import type {Caption} from '@remotion/captions';
import React, {useMemo} from 'react';
import {
  Interactive,
  useCurrentFrame,
  useVideoConfig,
  type InteractiveTransformProps,
  type InteractivitySchema,
} from 'remotion';
import {C, FONT} from '../theme';
import {enterProgress} from '../motion';

type Props = InteractiveTransformProps & {
  readonly captions: Caption[];
  readonly highlights?: string[];
  readonly maxWords?: number;
  readonly width?: number;
};

const schema = {
  ...Interactive.captionsSchema,
  maxWords: {type: 'number', min: 1, max: 6, step: 1, default: 4, description: 'Max words per caption', hiddenFromList: false},
  width: {type: 'number', min: 300, max: 1080, step: 10, default: 860, description: 'Caption width', hiddenFromList: false},
} as const satisfies InteractivitySchema;

const PUNCT = /[،,.؟?!…«»"]/g;
const MARKS = /[ً-ٰٟـ]/g;
const norm = (w: string) => w.replace(PUNCT, '').replace(MARKS, '').trim();
const BREAK_AFTER = /[،.؟?!…]$/;

type Page = {startMs: number; endMs: number; words: {c: Caption; i: number}[]};

const toPages = (captions: Caption[], maxWords: number): Page[] => {
  const pages: Page[] = [];
  let cur: Page | null = null;
  captions.forEach((c, i) => {
    const gap = cur ? c.startMs - cur.endMs : 0;
    if (!cur || cur.words.length >= maxWords || gap > 320) {
      cur = {startMs: c.startMs, endMs: c.endMs, words: []};
      pages.push(cur);
    }
    cur.words.push({c, i});
    cur.endMs = c.endMs;
    if (BREAK_AFTER.test(c.text.trim())) cur = null;
  });
  // Keep each page on screen until the next one starts (no flicker in short gaps).
  pages.forEach((p, k) => {
    const next = pages[k + 1];
    p.endMs = next ? Math.min(next.startMs, p.endMs + 600) : p.endMs + 400;
  });
  return pages;
};

const markHighlights = (captions: Caption[], phrases: string[]) => {
  const words = captions.map((c) => norm(c.text));
  const marked = new Set<number>();
  for (const phrase of phrases) {
    const target = phrase.split(/\s+/).map(norm).filter(Boolean);
    for (let i = 0; i + target.length <= words.length; i++) {
      if (target.every((t, k) => words[i + k] === t)) target.forEach((_, k) => marked.add(i + k));
    }
  }
  return marked;
};

const KineticCaptionsInner: React.FC<Props> = ({captions, highlights = [], maxWords = 4, width = 860, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pages = useMemo(() => toPages(captions, maxWords), [captions, maxWords]);
  const marked = useMemo(() => markHighlights(captions, highlights), [captions, highlights]);
  const nowMs = (frame / fps) * 1000;
  const page = pages.find((p) => nowMs >= p.startMs && nowMs < p.endMs);
  if (!page) return null;

  const pageFrame = frame - (page.startMs / 1000) * fps;
  const p = enterProgress(pageFrame, fps, 0, 5);

  return (
    <div
      style={{
        width,
        display: 'flex',
        justifyContent: 'center',
        ...style,
      }}
    >
      <div
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 64,
          lineHeight: 1.38,
          textAlign: 'center',
          textWrap: 'balance',
          color: C.white,
          padding: '14px 30px 18px',
          borderRadius: 26,
          background: 'rgba(8, 19, 31, 0.86)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 12px 40px rgba(0, 8, 20, 0.35)',
          opacity: 0.35 + p * 0.65,
          translate: `0px ${(1 - p) * 10}px`,
          scale: String(0.97 + p * 0.03),
        }}
      >
        {page.words.map(({c, i}) => {
          const spoken = nowMs >= c.startMs - 40;
          const isKey = marked.has(i);
          return (
            <span
              key={i}
              style={{
                color: isKey ? C.blueSoft : C.white,
                opacity: spoken ? 1 : 0.62,
                transition: 'none',
              }}
            >
              {c.text}
              {' '}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const KineticCaptions = Interactive.create({
  Component: KineticCaptionsInner,
  componentName: '<KineticCaptions>',
  schema,
});
