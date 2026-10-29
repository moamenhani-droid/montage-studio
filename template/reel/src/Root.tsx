import { Composition, Folder } from "remotion";
import { DATA } from "./data";
import {
  DEMO_DUR,
  GallerySheet,
  PAGES,
  SHEET_H,
  SHEET_W,
  StylePreview,
} from "./Gallery";
import { Main, Short, shortDuration } from "./Main";
import { CATS, STYLES } from "./styles/registry";

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Final">
      <Composition
        id="Main"
        component={Main}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={DATA.duration}
        defaultProps={{ captions: true }}
      />
      <Composition
        id="Clean"
        component={Main}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={DATA.duration}
        defaultProps={{ captions: false }}
      />
      <Composition
        id="Short"
        component={Short}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={Math.max(1, shortDuration)}
      />
    </Folder>
    <Folder name="Gallery">
      {Array.from({ length: PAGES }, (_, i) => (
        <Composition
          key={i}
          id={`Gallery-${i + 1}`}
          component={GallerySheet}
          width={SHEET_W}
          height={SHEET_H}
          fps={30}
          durationInFrames={DEMO_DUR}
          defaultProps={{ page: i }}
        />
      ))}
    </Folder>
    {(Object.keys(CATS) as (keyof typeof CATS)[]).map((cat) => (
      <Folder key={cat} name={`Styles-${cat}`}>
        {STYLES.filter((s) => s.cat === cat).map((s) => (
          <Composition
            key={s.id}
            id={`style-${s.id}`}
            component={StylePreview}
            width={1080}
            height={1920}
            fps={30}
            durationInFrames={DEMO_DUR}
            defaultProps={{ id: s.id }}
          />
        ))}
      </Folder>
    ))}
  </>
);
