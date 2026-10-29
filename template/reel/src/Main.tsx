// المونتاج الرئيسي: يُركَّب بالكامل من data.ts (المولَّد من work/edit.py).
// كل مشهد = أسلوب من styles/registry.ts بخصائصه وكلماته المنطوقة.
import { Audio } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { B } from "./brand";
import { DATA } from "./data";
import { Person, Room } from "./engine/kit";
import { clamp } from "./motion";
import { byId } from "./styles/registry";
import type { StyleProps, Word } from "./styles/types";

type Scene = (typeof DATA.scenes)[number];
type Clip = { from: number; trim: number; dur: number };

/** تداخل المشاهد: الجديد يدخل قبل ٥ إطارات من خروج القديم، فلا يظهر إطار فارغ. */
const LEAD = 5;
const CLIPS = DATA.clips as readonly Clip[];

/** لقطة الوجه: كل مقطع صوتي يقابله نفس المقطع من الفيديو، فتبقى الشفاه متزامنة بعد القص. */
const FaceLayer: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const face = DATA.face;
  const clips = CLIPS.filter((c) => c.from < to && c.from + c.dur > from);
  if (DATA.demo) {
    return (
      <AbsoluteFill>
        <Room />
        <Person />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: B.bg900, overflow: "hidden" }}>
      {face.mode === "cutout" ? <Room src={face.room} /> : null}
      {clips.map((c, i) => (
        <Sequence
          key={i}
          from={c.from - from}
          durationInFrames={c.dur}
          layout="none"
        >
          {face.mode === "cutout" ? (
            <Person
              src={face.person}
              trim={c.trim}
              scale={face.scale}
              dx={face.dx}
            />
          ) : (
            <OffthreadVideo
              src={staticFile(face.master)}
              muted
              trimBefore={c.trim}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                scale: String(face.scale),
                transformOrigin: "50% 38%",
              }}
            />
          )}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const SceneView: React.FC<{ s: Scene; captions: boolean; len: number }> = ({
  s,
  captions,
  len,
}) => {
  const f = useCurrentFrame();
  const style = byId(s.style);
  const fadeIn =
    s.transition === "fade" ? interpolate(f, [0, LEAD + 3], [0, 1], clamp) : 1;
  const props: StyleProps = {
    ...(s.props as Partial<StyleProps>),
    dur: s.end - s.start,
    trim: s.trim,
    words: (s.words as readonly Word[]).map((w) => ({
      t: w.t - s.start,
      text: w.text,
    })),
  };
  if (
    !props.video &&
    style.layer === "full" &&
    s.kind === "face" &&
    !DATA.demo
  ) {
    props.video =
      DATA.face.mode === "cutout" ? DATA.face.person : DATA.face.master;
  }
  const isCaption = ["face-caption", "word-pop", "karaoke", "marker"].includes(
    style.id,
  );
  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      {s.kind === "face" && style.layer === "overlay" ? (
        <FaceLayer from={s.start} to={s.start + len} />
      ) : null}
      {captions || !isCaption ? <style.C {...props} /> : null}
    </AbsoluteFill>
  );
};

export const Main: React.FC<{ captions?: boolean }> = ({ captions = true }) => {
  const scenes = DATA.scenes as readonly Scene[];
  return (
    <AbsoluteFill style={{ background: B.bg900 }}>
      {scenes.map((s, i) => {
        const len = s.end - s.start + (i < scenes.length - 1 ? LEAD : 0);
        return (
          <Sequence
            key={i}
            name={`${s.name} · ${s.style}`}
            from={s.start}
            durationInFrames={len}
          >
            <SceneView s={s} captions={captions} len={len} />
          </Sequence>
        );
      })}
      {DATA.demo
        ? null
        : CLIPS.map((c, i) => (
            <Sequence
              key={`v${i}`}
              name="صوت"
              from={c.from}
              durationInFrames={c.dur}
              layout="none"
            >
              <Audio src={staticFile(DATA.voice)} trimBefore={c.trim} />
            </Sequence>
          ))}
      {DATA.music ? <Audio src={staticFile(DATA.music)} name="موسيقى" /> : null}
      {(DATA.sfx as readonly { at: number; src: string; volume: number }[]).map(
        (x, i) => (
          <Sequence
            key={`s${i}`}
            name={`مؤثر ${x.src}`}
            from={x.at}
            durationInFrames={90}
            layout="none"
          >
            <Audio src={staticFile(x.src)} volume={x.volume} />
          </Sequence>
        ),
      )}
    </AbsoluteFill>
  );
};

/** النسخة القصيرة: مقاطع من الرئيسية متتالية (data.short). */
export const Short: React.FC = () => {
  let off = 0;
  return (
    <AbsoluteFill>
      {(DATA.short as readonly (readonly [number, number])[]).map(
        ([a, b], i) => {
          const el = (
            <Sequence key={i} from={off} durationInFrames={b - a}>
              <Sequence from={-a}>
                <Main />
              </Sequence>
            </Sequence>
          );
          off += b - a;
          return el;
        },
      )}
    </AbsoluteFill>
  );
};

export const shortDuration = (
  DATA.short as readonly (readonly [number, number])[]
).reduce((t, [a, b]) => t + b - a, 0);
