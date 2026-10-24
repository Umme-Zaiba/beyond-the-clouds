export function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface RidgeOptions {
  seed: number;
  /** y of the ridge's resting line in a 900-high viewbox */
  base: number;
  /** tallest spire height */
  height: number;
  /** how many ink-wash spires to scatter */
  spires: number;
  /** narrower values give sharper, more vertical peaks */
  sharpness: number;
}

const X0 = -240;
const X1 = 1840;

/** A closed SVG path for one misty ridge: gentle swells with Gaussian spires, like ink-wash peaks. */
export function ridgePath({ seed, base, height, spires, sharpness }: RidgeOptions): string {
  const rand = mulberry32(seed);
  const phase = [rand() * 6.28, rand() * 6.28, rand() * 6.28];
  const peaks = Array.from({ length: spires }, () => ({
    c: X0 + rand() * (X1 - X0),
    w: (60 + rand() * 90) * sharpness,
    h: height * (0.35 + rand() * 0.65),
  }));

  const pts: Array<[number, number]> = [];
  for (let x = X0; x <= X1; x += 16) {
    const t = (x - X0) / (X1 - X0);
    let lift = 0.12 * height * (1 + Math.sin(t * 6 + phase[0]) * 0.6 + Math.sin(t * 14 + phase[1]) * 0.3 + Math.sin(t * 31 + phase[2]) * 0.1);
    for (const p of peaks) lift = Math.max(lift, p.h * Math.exp(-(((x - p.c) / p.w) ** 2)));
    pts.push([x, base - lift]);
  }

  let d = `M${X0} 900 L${pts[0][0]} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    d += ` Q${x0} ${y0.toFixed(1)} ${((x0 + x1) / 2).toFixed(1)} ${((y0 + y1) / 2).toFixed(1)}`;
  }
  return `${d} L${X1} 900 Z`;
}
