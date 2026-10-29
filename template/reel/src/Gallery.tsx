// معرض الأساليب: كل أسلوب كمعاينة حية منفردة، ولوحات حية (١٢ أسلوباً في اللوحة) تُصوَّر عند الإطار GALLERY_FRAME.
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { B, FONT } from "./brand";
import { ar, DemoMedia, Logo, Person, Room } from "./engine/kit";
import { CATS, STYLES } from "./styles/registry";
import type { StyleDef } from "./styles/types";

export const DEMO_DUR = 90;
export const GALLERY_FRAME = 70;

/** أسلوب واحد بخصائصه التجريبية؛ أساليب overlay تُعرض فوق لقطة شخص تجريبية. */
export const StylePreview: React.FC<{ id: string }> = ({ id }) => {
  const s = STYLES.find((x) => x.id === id) as StyleDef;
  return (
    <DemoMedia.Provider value>
      <AbsoluteFill style={{ background: B.bg900 }}>
        {s.layer === "overlay" ? (
          <>
            <Room />
            <Person />
          </>
        ) : null}
        <s.C dur={DEMO_DUR} {...s.demo} />
      </AbsoluteFill>
    </DemoMedia.Provider>
  );
};

const TW = 300;
const TH = 533;
const GAP = 26;
export const PER_PAGE = 12;
export const SHEET_W = 4 * TW + 5 * GAP;
export const SHEET_H = 150 + 3 * (TH + 96 + GAP);
export const PAGES = Math.ceil(STYLES.length / PER_PAGE);

export const GallerySheet: React.FC<{ page: number }> = ({ page }) => {
  const tiles = STYLES.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  return (
    <AbsoluteFill style={{ background: B.bg900, fontFamily: FONT }}>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          top: 30,
          right: GAP + 4,
          left: GAP + 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: 24, color: B.dim }}>
            كتالوج أساليب المونتاج · {ar(page + 1)} / {ar(PAGES)}
          </div>
          <div style={{ fontSize: 52, fontWeight: 700, color: B.text }}>
            {[...new Set(tiles.map((t) => CATS[t.cat]))]
              .slice(0, 2)
              .join(" · ")}
          </div>
        </div>
        <Logo width={110} />
      </div>
      {tiles.map((t, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = SHEET_W - GAP - TW - col * (TW + GAP); // right-to-left
        const y = 150 + row * (TH + 96 + GAP);
        const n = page * PER_PAGE + i + 1;
        return (
          <div
            key={t.id}
            style={{ position: "absolute", left: x, top: y, width: TW }}
          >
            <div
              style={{
                position: "relative",
                width: TW,
                height: TH,
                borderRadius: 18,
                overflow: "hidden",
                border: `1.5px solid ${B.lineStrong}`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 1080,
                  height: 1920,
                  scale: String(TW / 1080),
                  transformOrigin: "0 0",
                }}
              >
                <Sequence from={GALLERY_FRAME - (t.at ?? GALLERY_FRAME)}>
                  <StylePreview id={t.id} />
                </Sequence>
              </div>
            </div>
            <div
              dir="rtl"
              style={{
                marginTop: 12,
                display: "flex",
                alignItems: "baseline",
                gap: 10,
              }}
            >
              <span
                style={{ fontSize: 26, fontWeight: 700, color: B.accentSoft }}
              >
                {ar(n)}
              </span>
              <span style={{ fontSize: 25, fontWeight: 700, color: B.text }}>
                {t.name}
              </span>
            </div>
            <div
              dir="ltr"
              style={{
                fontSize: 19,
                color: B.dim,
                marginTop: 2,
                textAlign: "right",
              }}
            >
              {t.id}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
