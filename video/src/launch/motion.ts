// Motion primitives for the launch film: designed easing curves, keyframe tracks and
// clamped interpolation. Everything works in seconds of film time.

/** CSS-style cubic-bezier easing, solved numerically. */
export function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const x = (t: number) => ((ax * t + bx) * t + cx) * t;
  const y = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (p: number) => {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    let t = p;
    for (let i = 0; i < 8; i++) {
      const d = dx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= (x(t) - p) / d;
    }
    t = Math.min(1, Math.max(0, t));
    return y(t);
  };
}

export const EASE = {
  /** Camera moves and morphs: unhurried start, decisive middle, soft landing. */
  inOut: bezier(0.65, 0, 0.35, 1),
  /** Things arriving: fast out of the gate, long settle. */
  out: bezier(0.16, 1, 0.3, 1),
  /** Things leaving. */
  in: bezier(0.55, 0, 0.75, 0.2),
  /** Arrivals with a hint of overshoot. */
  settle: bezier(0.34, 1.32, 0.64, 1),
};

export type Ease = (p: number) => number;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** 0→1 progress of `t` through [start, start + duration], eased. */
export const progress = (t: number, start: number, duration: number, ease: Ease = EASE.inOut) =>
  ease(clamp01((t - start) / duration));

export const mix = (a: number, b: number, k: number) => a + (b - a) * k;

/** Interpolate between two hex colours. */
export function mixColor(a: string, b: string, k: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(mix(v, pb[i], k))).join(",")})`;
}

export type CameraKey = {
  /** Film time the camera arrives here (or, for a cut, jumps here). */
  t: number;
  x: number;
  y: number;
  zoom: number;
  /** Seconds spent travelling into this key; 0 makes it a hard cut. */
  move?: number;
  ease?: Ease;
};

export type CameraState = { x: number; y: number; zoom: number };

/**
 * Camera between keys: holds still at each key until the next one's travel begins,
 * then moves there. Zoom interpolates in log space so pushes feel even.
 */
export function cameraAt(keys: CameraKey[], t: number): CameraState {
  let state: CameraState = keys[0];
  for (let i = 1; i < keys.length; i++) {
    const key = keys[i];
    const move = key.move ?? 0.7;
    const start = key.t - move;
    if (t < start) break;
    if (move <= 0 || t >= key.t) {
      state = key;
      continue;
    }
    const k = (key.ease ?? EASE.inOut)((t - start) / move);
    state = {
      x: mix(state.x, key.x, k),
      y: mix(state.y, key.y, k),
      zoom: Math.exp(mix(Math.log(state.zoom), Math.log(key.zoom), k)),
    };
    break;
  }
  return state;
}
