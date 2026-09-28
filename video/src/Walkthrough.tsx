import { loadFont } from "@remotion/fonts";
import manropeUrl from "@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2";
import { useMemo } from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { cameraAt, cameraKeys, cursorAt, type Camera, type ClickEvent, type Point, type Timeline } from "./timeline";

loadFont({ family: "Manrope", url: manropeUrl, weight: "200 800" });

export const SIZE = 1080;

// The browser window on the canvas.
const WINDOW_WIDTH = 1000;
const BAR = 36;
const WINDOW_TOP = 64;
const RADIUS = 14;
const URL = "claude-practice-one.vercel.app";
const CAPTION_SPACE = 130; // Height the caption takes up at the bottom of the frame.

// Clean and neutral.
const BG = "#f2f2f3";
const INK = "#1d1d20";

export function Walkthrough({ timeline }: { timeline: Timeline }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const k = WINDOW_WIDTH / timeline.viewport.width;
  const screenHeight = timeline.viewport.height * k;
  const win = {
    left: (SIZE - WINDOW_WIDTH) / 2,
    top: WINDOW_TOP,
    width: WINDOW_WIDTH,
    height: BAR + screenHeight,
  };
  const toCanvas = (p: Point): Point => ({ x: win.left + p.x * k, y: win.top + BAR + p.y * k });

  const { keys, clicks } = useMemo(() => {
    const wide: Camera = { scale: 1, x: SIZE / 2, y: SIZE / 2 };
    // A zoomed view stays within the window, except that it can rise far enough for the
    // bottom of the window to clear the caption.
    const clampView = (c: Camera): Camera => {
      const half = SIZE / 2 / c.scale;
      const fit = (v: number, lo: number, hi: number) => (hi - lo < 2 * half ? (lo + hi) / 2 : Math.min(hi - half, Math.max(lo + half, v)));
      return {
        scale: c.scale,
        x: fit(c.x, win.left, win.left + win.width),
        y: fit(c.y, win.top, win.top + win.height + CAPTION_SPACE / c.scale),
      };
    };
    return {
      keys: cameraKeys(timeline.events, wide, toCanvas, clampView),
      clicks: timeline.events.filter((e): e is ClickEvent => e.kind === "click"),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeline]);

  const cam = cameraAt(keys, t);
  const cursor = cursorAt(clicks, timeline.cursor, t);
  const cursorPos = toCanvas(cursor);

  // Opening: the window settles in.
  const intro = interpolate(frame, [0, 0.6 * fps], [0, 1], { extrapolateRight: "clamp", easing: (x) => 1 - Math.pow(1 - x, 3) });

  // The cursor and ripples keep a steady on-screen size rather than growing fully with the zoom.
  const counter = Math.pow(cam.scale, -0.45);

  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 90% at 50% 35%, #fafafa 0%, ${BG} 60%, #e9e9eb 100%)` }}>
      <AbsoluteFill
        style={{
          transformOrigin: "0 0",
          transform: `translate(${SIZE / 2}px, ${SIZE / 2}px) scale(${cam.scale}) translate(${-cam.x}px, ${-cam.y}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: win.left,
            top: win.top,
            width: win.width,
            height: win.height,
            borderRadius: RADIUS,
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 40px 90px -20px rgba(20,20,30,0.28), 0 12px 28px -8px rgba(20,20,30,0.12), 0 0 0 1px rgba(20,20,30,0.07)",
            opacity: intro,
            transform: `translateY(${(1 - intro) * 24}px) scale(${0.97 + 0.03 * intro})`,
          }}
        >
          <WindowBar />
          <OffthreadVideo
            src={staticFile(`${timeline.name}/screen.mp4`)}
            muted
            style={{ position: "absolute", left: 0, top: BAR, width: win.width, height: screenHeight }}
          />
        </div>

        {clicks.map((c) => (
          <Ripple key={c.t} at={toCanvas(c)} age={t - c.t} size={counter} />
        ))}
        <Cursor at={cursorPos} press={cursor.press} size={counter} opacity={intro} />
      </AbsoluteFill>

      <Captions timeline={timeline} t={t} />
    </AbsoluteFill>
  );
}

function WindowBar() {
  return (
    <div
      style={{
        position: "absolute",
        inset: "0 0 auto 0",
        height: BAR,
        display: "flex",
        alignItems: "center",
        padding: "0 14px",
        background: "#fbfbfb",
        borderBottom: "1px solid #ececee",
      }}
    >
      <div style={{ display: "flex", gap: 7 }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 11, height: 11, borderRadius: 99, background: "#dcdcdf" }} />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          width: 360,
          height: 22,
          borderRadius: 7,
          background: "#f0f0f2",
          color: "#8b8b92",
          fontFamily: "Manrope",
          fontSize: 12,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {URL}
      </div>
    </div>
  );
}

function Cursor({ at, press, size, opacity }: { at: Point; press: number; size: number; opacity: number }) {
  const s = size * (1 - 0.18 * press);
  return (
    <svg
      width={28}
      height={28}
      viewBox="0 0 28 28"
      style={{
        position: "absolute",
        left: at.x,
        top: at.y,
        // The arrow's tip is the click point.
        transform: `translate(-5px, -3px) scale(${s})`,
        transformOrigin: "5px 3px",
        overflow: "visible",
        opacity,
        filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.28))",
      }}
    >
      <path
        d="M5 3 L5 22.5 L10 17.8 L13.4 25.2 L16.9 23.6 L13.6 16.4 L20.4 16.2 Z"
        fill={INK}
        stroke="#fff"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Ripple({ at, age, size }: { at: Point; age: number; size: number }) {
  const LIFE = 0.55;
  if (age < 0 || age > LIFE) return null;
  const k = age / LIFE;
  const grow = 1 - Math.pow(1 - k, 3);
  const r = (8 + 26 * grow) * size;
  return (
    <div
      style={{
        position: "absolute",
        left: at.x - r,
        top: at.y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        background: `rgba(29,29,32,${0.14 * (1 - k)})`,
        boxShadow: `0 0 0 ${1.5 * size}px rgba(29,29,32,${0.35 * (1 - k)})`,
      }}
    />
  );
}

function Captions({ timeline, t }: { timeline: Timeline; t: number }) {
  const captions = timeline.events.filter((e) => e.kind === "caption");
  const FADE = 0.35;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {captions.map((c, i) => {
        const next = captions[i + 1]?.t ?? Infinity;
        const shownFrom = c.t + 0.15;
        if (t < shownFrom || t > next + FADE) return null;
        const inK = Math.min(1, (t - shownFrom) / FADE);
        const outK = t > next ? Math.min(1, (t - next) / FADE) : 0;
        const ease = (x: number) => 1 - Math.pow(1 - x, 3);
        const opacity = ease(inK) * (1 - ease(outK));
        const y = (1 - ease(inK)) * 14 - ease(outK) * 10;
        return (
          <div
            key={c.t}
            style={{
              position: "absolute",
              left: "50%",
              bottom: 42,
              transform: `translate(-50%, ${y}px)`,
              opacity,
              whiteSpace: "nowrap",
              padding: "14px 26px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.94)",
              color: INK,
              fontFamily: "Manrope",
              fontSize: 27,
              fontWeight: 650,
              letterSpacing: -0.2,
              boxShadow: "0 10px 30px -6px rgba(20,20,30,0.18), 0 0 0 1px rgba(20,20,30,0.06)",
            }}
          >
            {c.kind === "caption" ? c.text : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
}
