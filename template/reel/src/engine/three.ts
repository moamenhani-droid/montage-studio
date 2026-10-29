// محرك ثلاثي الأبعاد يدوي بلا مكتبات: إسقاط منظوري، وإخفاء الأوجه الخلفية، وترتيب بالعمق.
// الاستخدام: احسب أوجه كل صندوق بـ boxFaces، اجمعها، رتّبها بـ depthSort، وارسمها <polygon points={poly(f.pts)}>.
export type V3 = [number, number, number];
export type Cam = {
  yaw: number;
  pitch: number;
  dist: number;
  focal: number;
  cx: number;
  cy: number;
};
export type Pt = { x: number; y: number; z: number };

export const project = (c: Cam, [x, y, z]: V3): Pt => {
  const cy = Math.cos(c.yaw);
  const sy = Math.sin(c.yaw);
  const x1 = x * cy - z * sy;
  const z1 = x * sy + z * cy;
  const cp = Math.cos(c.pitch);
  const sp = Math.sin(c.pitch);
  const y2 = y * cp - z1 * sp;
  const z2 = y * sp + z1 * cp + c.dist;
  return {
    x: c.cx + (c.focal * x1) / z2,
    y: c.cy - (c.focal * y2) / z2,
    z: z2,
  };
};

export const poly = (pts: { x: number; y: number }[]) =>
  pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
const area = (pts: { x: number; y: number }[]) =>
  pts.reduce(
    (a, p, i) =>
      a +
      (p.x * pts[(i + 1) % pts.length].y - pts[(i + 1) % pts.length].x * p.y),
    0,
  );

export type Box = {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  y?: number;
  top: string;
  side: string;
  front: string;
};
export type Face = {
  pts: Pt[];
  fill: string;
  kind: "top" | "front" | "side" | "back";
  depth: number;
};

/** أوجه صندوق قائم على الأرض (أو مرفوع بمقدار y)، المرئية فقط، بإحداثيات الشاشة. */
export const boxFaces = (c: Cam, b: Box): Face[] => {
  const y0 = b.y ?? 0;
  const x0 = b.x - b.w / 2;
  const x1 = b.x + b.w / 2;
  const z0 = b.z - b.d / 2;
  const z1 = b.z + b.d / 2;
  const h = y0 + Math.max(0.5, b.h);
  const P = (x: number, y: number, z: number) => project(c, [x, y, z]);
  const faces: Omit<Face, "depth">[] = [
    {
      pts: [P(x0, h, z0), P(x1, h, z0), P(x1, h, z1), P(x0, h, z1)],
      fill: b.top,
      kind: "top",
    },
    {
      pts: [P(x0, y0, z0), P(x1, y0, z0), P(x1, h, z0), P(x0, h, z0)],
      fill: b.front,
      kind: "front",
    },
    {
      pts: [P(x1, y0, z0), P(x1, y0, z1), P(x1, h, z1), P(x1, h, z0)],
      fill: b.side,
      kind: "side",
    },
    {
      pts: [P(x0, y0, z1), P(x0, y0, z0), P(x0, h, z0), P(x0, h, z1)],
      fill: b.side,
      kind: "side",
    },
    {
      pts: [P(x1, y0, z1), P(x0, y0, z1), P(x0, h, z1), P(x1, h, z1)],
      fill: b.front,
      kind: "back",
    },
  ];
  return faces
    .filter((fc) => area(fc.pts) < 0)
    .map((fc) => ({
      ...fc,
      depth: fc.pts.reduce((a, p) => a + p.z, 0) / fc.pts.length,
    }));
};

/** الأبعد أولاً */
export const depthSort = <F extends Face>(faces: F[]) =>
  [...faces].sort((a, b) => b.depth - a.depth);
