// Shapes of the files written by scripts/build.mjs, and the maths that turns their
// clicks into a camera move and a cursor path. All times are in seconds of video.

export type Point = { x: number; y: number };

export type TimelineEvent =
  | { kind: "caption"; t: number; text: string }
  | { kind: "focus"; t: number; x: number; y: number; zoom: number; hold: number }
  | {
      kind: "click";
      t: number;
      x: number;
      y: number;
      from: Point;
      moveStart: number;
      moveEnd: number;
      zoom: number | false;
      hold: number;
      out?: boolean;
    };

export type ClickEvent = Extract<TimelineEvent, { kind: "click" }>;

export type Timeline = {
  name: string;
  fps: number;
  durationInFrames: number;
  viewport: { width: number; height: number };
  cursor: Point;
  events: TimelineEvent[];
};

export type Camera = { scale: number; x: number; y: number };

export const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const clamp01 = (k: number) => Math.min(1, Math.max(0, k));

// Camera timing.
const ZOOM_IN = 0.75; // Seconds to glide in to a target.
const ZOOM_OUT = 0.75; // Seconds to pull back out to the full window.
const STAY_GAP = 1.4; // Targets closer together than this pan across instead of zooming out between them.
const FOCUS_ARRIVE = 0.8; // A focus point without a click is reached this long after it's logged.

type Key = Camera & { t: number };
type Target = { arrive: number; until: number; zoom: number; p: Point; out?: boolean };

/**
 * Keyframes for the camera: wide by default, gliding in to each click or focus point,
 * holding, and either panning to the next one or pulling back out.
 * `toCanvas` maps page coordinates to the canvas; `clampView` keeps a zoomed view inside the window.
 */
export function cameraKeys(
  events: TimelineEvent[],
  wide: Camera,
  toCanvas: (p: Point) => Point,
  clampView: (c: Camera) => Camera,
): Key[] {
  const targets = events
    .flatMap((e): Target[] => {
      if (e.kind === "click" && e.zoom) return [{ arrive: e.t - 0.12, until: e.t + e.hold, zoom: e.zoom, p: e, out: e.out }];
      if (e.kind === "focus") {
        const arrive = e.t + FOCUS_ARRIVE;
        return [{ arrive, until: arrive + e.hold, zoom: e.zoom, p: e }];
      }
      return [];
    })
    .sort((a, b) => a.arrive - b.arrive);

  const keys: Key[] = [{ t: 0, ...wide }];
  let prev: Target | undefined;
  let prevCam: Camera | undefined;
  for (const target of targets) {
    const c = toCanvas(target.p);
    const cam = clampView({ scale: target.zoom, x: c.x, y: c.y });
    const last = keys[keys.length - 1];
    const glideStart = Math.max(target.arrive - ZOOM_IN, last.t);
    if (prev && prevCam && !prev.out && glideStart < prev.until + STAY_GAP) {
      // Stay zoomed: hold the previous target, then pan across.
      const panStart = Math.min(Math.max(glideStart, prev.until), target.arrive - 0.3);
      if (panStart > last.t) keys.push({ t: panStart, ...prevCam });
      keys.push({ t: Math.max(target.arrive, keys[keys.length - 1].t + 0.3), ...cam });
    } else {
      if (prev && prevCam) {
        keys.push({ t: prev.until, ...prevCam });
        keys.push({ t: prev.until + ZOOM_OUT, ...wide });
      }
      const start = Math.max(glideStart, keys[keys.length - 1].t);
      keys.push({ t: start, ...wide });
      keys.push({ t: Math.max(target.arrive, start + 0.4), ...cam });
    }
    prev = target;
    prevCam = cam;
  }
  if (prev && prevCam) {
    keys.push({ t: prev.until, ...prevCam });
    keys.push({ t: prev.until + ZOOM_OUT, ...wide });
  }
  return keys;
}

export function cameraAt(keys: Key[], t: number): Camera {
  if (t <= keys[0].t) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (t <= b.t) {
      const k = easeInOut(clamp01((t - a.t) / Math.max(b.t - a.t, 1e-6)));
      return {
        // Zoom in log space so it feels even at every scale.
        scale: Math.exp(Math.log(a.scale) + (Math.log(b.scale) - Math.log(a.scale)) * k),
        x: a.x + (b.x - a.x) * k,
        y: a.y + (b.y - a.y) * k,
      };
    }
  }
  return keys[keys.length - 1];
}

/** Where the cursor is (in page coordinates) and how pressed it is (0–1). */
export function cursorAt(clicks: ClickEvent[], start: Point, t: number): Point & { press: number } {
  let pos = start;
  for (const c of clicks) {
    if (t < c.moveStart) break;
    if (t < c.moveEnd) {
      const k = easeInOut(clamp01((t - c.moveStart) / (c.moveEnd - c.moveStart)));
      pos = arc(c.from, c, k);
      break;
    }
    pos = c;
  }
  const press = clicks.reduce((p, c) => {
    const d = t - c.t;
    if (d < -0.08 || d > 0.22) return p;
    return Math.max(p, d < 0 ? (d + 0.08) / 0.08 : 1 - d / 0.22);
  }, 0);
  return { ...pos, press };
}

/** A gentle arc between two points rather than a ruler-straight line. */
function arc(a: Point, b: Point, k: number): Point {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const bend = 0.12;
  const cx = mx - dy * bend;
  const cy = my + dx * bend;
  const u = 1 - k;
  return { x: u * u * a.x + 2 * u * k * cx + k * k * b.x, y: u * u * a.y + 2 * u * k * cy + k * k * b.y };
}
