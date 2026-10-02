// The 20-second launch film. Layers, back to front: backdrop, act headlines, the product
// stage (recorded takes behind a designed camera, with cursor and click ripples), the
// opening type that lands on the product, and the closing lockup.
import { AbsoluteFill, Freeze, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { cursorAt, type ClickEvent, type Point } from "../timeline";
import { Backdrop, Cursor, Ripple } from "../Walkthrough";
import {
  ACTS,
  CAMERA,
  CLOSE,
  CLOSE_START,
  CURSOR,
  DURATION,
  FPS,
  HOOK,
  HOOK_CAMERA,
  HOOK_END,
  PAGE,
  SCENES,
  TAKES,
  baseScale,
  sceneRate,
  type Act,
  type Layout,
  type Scene,
} from "./config";
import { EASE, cameraAt, clamp01, mix, mixColor, progress, type CameraState } from "./motion";
import { FluxbyMark } from "./FluxbyMark";

const WHITE = "#ffffff";
const FONT = "Manrope";

/** Page-to-stage transform for a camera framing. */
function view(cam: CameraState, layout: Layout) {
  const { stage } = layout;
  const scale = baseScale(layout) * cam.zoom;
  const left = cam.x - (PAGE.width - PAGE.cropLeft) / cam.zoom / 2;
  const top = cam.y - PAGE.height / cam.zoom / 2;
  return {
    scale,
    left,
    top,
    toCanvas: (p: Point): Point => ({ x: stage.x + (p.x - left) * scale, y: stage.y + (p.y - top) * scale }),
  };
}

export function Launch({ layout }: { layout: Layout }) {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = cameraAt(CAMERA, t);
  const v = view(cam, layout);

  return (
    <AbsoluteFill style={{ background: "#0b6b45", fontFamily: FONT }}>
      <Backdrop progress={t / DURATION} />
      {/* Deepen the marble a touch and give the type a calm field to sit on. */}
      <AbsoluteFill style={{ background: layout.scrim }} />

      {ACTS.map((act) => (
        <Headline key={act.title} act={act} t={t} layout={layout} />
      ))}

      <Stage t={t} v={v} layout={layout} />
      <Hook t={t} layout={layout} />
      <Lockup t={t} layout={layout} />
    </AbsoluteFill>
  );
}

// ── Stage ───────────────────────────────────────────────────────────────────

function Stage({ t, v, layout }: { t: number; v: ReturnType<typeof view>; layout: Layout }) {
  const { stage } = layout;
  if (t < HOOK.stageIn || t > CLOSE_START + 0.45) return null;
  const enter = progress(t, HOOK.stageIn, HOOK.stageInDuration, EASE.out);
  const exit = progress(t, CLOSE_START, 0.42, EASE.inOut);
  const opacity = clamp01(enter * 1.8) * (1 - exit);
  const y = (1 - enter) * 90 + exit * 18;
  const scale = mix(0.93, 1, enter) * mix(1, 0.9, exit);

  return (
    <div
      style={{
        position: "absolute",
        left: stage.x,
        top: stage.y,
        width: stage.width,
        height: stage.height,
        borderRadius: stage.radius,
        overflow: "hidden",
        background: "#fafafa",
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        boxShadow: "0 50px 100px -30px rgba(0,25,14,0.55), 0 18px 36px -12px rgba(0,25,14,0.35), 0 0 0 1px rgba(255,255,255,0.18)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: PAGE.width,
          height: PAGE.height,
          transformOrigin: "0 0",
          transform: `translate(${-v.left * v.scale}px, ${-v.top * v.scale}px) scale(${v.scale})`,
        }}
      >
        <Footage />
        {t < HOOK_END && <HookMasks />}
        <Pointer t={t} counter={Math.pow(v.scale, -0.45)} />
      </div>
    </div>
  );
}

const video = (take: "A" | "B") => staticFile(`${TAKES[take].name}/screen.mp4`);
const pageVideoStyle = { position: "absolute", left: 0, top: 0, width: PAGE.width, height: PAGE.height } as const;

function Footage() {
  return (
    <>
      {/* While the stage rises: the empty home screen, held. */}
      <Sequence from={0} durationInFrames={Math.round(HOOK_END * FPS)} layout="none">
        <Freeze frame={Math.round(HOOK.freezeAt * FPS)}>
          <OffthreadVideo src={video("A")} muted style={pageVideoStyle} />
        </Freeze>
      </Sequence>
      {SCENES.map((s) => (
        <Sequence
          key={s.id}
          from={Math.round(s.start * FPS)}
          durationInFrames={Math.round((s.end - s.start) * FPS)}
          layout="none"
        >
          <OffthreadVideo
            src={video(s.take)}
            muted
            trimBefore={Math.round(s.from * FPS)}
            playbackRate={sceneRate(s)}
            style={pageVideoStyle}
          />
        </Sequence>
      ))}
    </>
  );
}

/** Hide the heading and the input's placeholder while the opening type flies onto them. */
function HookMasks() {
  return (
    <>
      <div style={{ position: "absolute", left: 210, top: 86, width: 560, height: 40, background: "#fafafa" }} />
      <div style={{ position: "absolute", left: 226, top: 150, width: 662, height: 30, background: "#ffffff" }} />
    </>
  );
}

function sceneAt(t: number): Scene | undefined {
  return SCENES.find((s) => t >= s.start && t < s.end);
}

function Pointer({ t, counter }: { t: number; counter: number }) {
  const s = sceneAt(t);
  if (!s) return null;
  const opacity = progress(t, CURSOR.in, 0.25, EASE.out) * (1 - progress(t, CURSOR.out, 0.3, EASE.in));
  if (opacity <= 0) return null;
  const take = TAKES[s.take];
  const rate = sceneRate(s);
  const tt = s.from + (t - s.start) * rate;
  const clicks = take.events.filter((e): e is ClickEvent => e.kind === "click");
  const c = cursorAt(clicks, take.cursor, tt);
  return (
    <>
      {clicks
        .filter((k) => k.t >= s.from && k.t <= s.to)
        .map((k) => (
          <Ripple key={k.t} at={k} age={(tt - k.t) / rate} size={counter} />
        ))}
      <Cursor at={c} press={c.press} size={counter} opacity={opacity} />
    </>
  );
}

// ── Hook: large type that lands on the real UI ──────────────────────────────

function Hook({ t, layout }: { t: number; layout: Layout }) {
  if (t > HOOK_END + 0.15) return null;
  const land = view(HOOK_CAMERA, layout);
  const { hook } = layout;
  const center = layout.width / 2;
  const m = progress(t, HOOK.morphStart, HOOK.morphEnd - HOOK.morphStart, EASE.inOut);
  // Colour turns from white to the UI's ink only once the stage is behind the type.
  const ink = Math.pow(m, 2.2);
  const fadeOut = 1 - progress(t, HOOK_END - 0.02, 0.12, EASE.out);

  // Eyebrow: Fluxby mark + "Ask Fluxby AI anything" → the home screen's heading.
  const eyebrowIn = progress(t, HOOK.eyebrowIn, 0.6, EASE.out);
  const headStartSize = hook.heading;
  const markStartSize = hook.mark;
  const gap = hook.mark * 0.35;
  const headStartW = (HOOK.headingWidth * headStartSize) / HOOK.headingAt.size;
  const rowLeft = center - (markStartSize + gap + headStartW) / 2;
  const rowTop = hook.eyebrowTop;
  const markEnd = land.toCanvas(HOOK.markAt);
  const headEnd = land.toCanvas(HOOK.headingAt);
  const markSize = mix(markStartSize, HOOK.markAt.size * land.scale, m);
  const markX = mix(rowLeft, markEnd.x, m);
  const markY = mix(rowTop + (headStartSize * 1.2 - markStartSize) / 2, markEnd.y, m);
  const headSize = mix(headStartSize, HOOK.headingAt.size * land.scale, m);
  const headX = mix(rowLeft + markStartSize + gap, headEnd.x, m);
  const headY = mix(rowTop, headEnd.y, m);

  // Prompt: typed large, then settles into the input as its text.
  const typed = progress(t, HOOK.typeStart, HOOK.typeEnd - HOOK.typeStart, (p) => p);
  const chars = Math.round(typed * HOOK.prompt.length);
  const promptStartSize = hook.prompt;
  const promptStartW = (HOOK.promptWidth * promptStartSize) / HOOK.promptAt.size;
  const promptEnd = land.toCanvas(HOOK.promptAt);
  const promptSize = mix(promptStartSize, HOOK.promptAt.size * land.scale, m);
  const promptX = mix(center - promptStartW / 2, promptEnd.x, m);
  const promptY = mix(hook.promptTop, promptEnd.y, m);
  const caretOn = t >= HOOK.typeStart - 0.2 && t < HOOK.morphStart && Math.floor(t * 2.4) % 2 === 0;
  const caretSolid = t >= HOOK.typeStart && t <= HOOK.typeEnd;

  return (
    <AbsoluteFill style={{ opacity: fadeOut, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: markX,
          top: markY + (1 - eyebrowIn) * 14,
          width: markSize,
          height: markSize,
          opacity: eyebrowIn,
        }}
      >
        <Img src={staticFile("fluxby.png")} style={{ width: "100%", height: "100%" }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: headX,
          top: headY + (1 - eyebrowIn) * 14,
          fontSize: headSize,
          lineHeight: 1.2,
          fontWeight: 600,
          whiteSpace: "nowrap",
          color: mixColor(WHITE, HOOK.headingAt.color, ink),
          opacity: eyebrowIn * mix(0.86, 1, m),
        }}
      >
        {HOOK.heading}
      </div>
      <div
        style={{
          position: "absolute",
          left: promptX,
          top: promptY,
          fontSize: promptSize,
          lineHeight: 1.5,
          fontWeight: 500,
          whiteSpace: "nowrap",
          color: mixColor(WHITE, HOOK.promptAt.color, ink),
        }}
      >
        {HOOK.prompt.slice(0, chars)}
        <span
          style={{
            display: "inline-block",
            width: 3,
            height: "1.05em",
            marginLeft: 3,
            verticalAlign: "-0.16em",
            background: WHITE,
            opacity: caretOn || caretSolid ? 0.9 : 0,
          }}
        />
      </div>
    </AbsoluteFill>
  );
}

// ── Act headlines ───────────────────────────────────────────────────────────

function Headline({ act, t, layout }: { act: Act; t: number; layout: Layout }) {
  const { headline } = layout;
  if (t < act.start - 0.05 || t > act.end + 0.05) return null;
  const words = act.title.split(" ");
  const out = progress(t, act.end - 0.32, 0.32, EASE.in);
  const line = progress(t, act.start + 0.22, 0.6, EASE.out);
  return (
    <div
      style={{
        position: "absolute",
        left: headline.left,
        top: headline.top,
        width: headline.width,
        opacity: 1 - out,
        transform: `translateY(${-out * 16}px)`,
        color: WHITE,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "0.26em",
          fontSize: headline.title,
          fontWeight: 700,
          letterSpacing: -headline.title * 0.028,
          lineHeight: 1.1,
        }}
      >
        {words.map((w, i) => {
          const k = progress(t, act.start + i * 0.08, 0.62, EASE.out);
          return (
            <span key={w} style={{ display: "inline-block", overflow: "hidden", paddingBottom: 6 }}>
              <span style={{ display: "inline-block", transform: `translateY(${(1 - k) * 105}%)` }}>{w}</span>
            </span>
          );
        })}
      </div>
      <div
        style={{
          marginTop: headline.line * 0.45,
          fontSize: headline.line,
          fontWeight: 500,
          lineHeight: 1.35,
          color: "rgba(255,255,255,0.84)",
          opacity: line,
          transform: `translateY(${(1 - line) * 10}px)`,
        }}
      >
        {act.line}
      </div>
    </div>
  );
}

// ── Closing lockup ──────────────────────────────────────────────────────────

function Lockup({ t, layout }: { t: number; layout: Layout }) {
  if (t < CLOSE.lockupIn) return null;
  const { lockup } = layout;
  const k = progress(t, CLOSE.lockupIn, 0.75, EASE.out);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", color: WHITE }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: lockup.mark * 0.26,
          opacity: k,
          transform: `translateY(${(1 - k) * 26 - 30}px) scale(${mix(0.96, 1, k)})`,
        }}
      >
        <FluxbyMark size={lockup.mark} />
        <span style={{ fontSize: lockup.word, fontWeight: 700, letterSpacing: -lockup.word * 0.03 }}>Fluxby AI</span>
      </div>
      <div
        style={{
          display: "flex",
          gap: lockup.beats * 0.53,
          marginTop: lockup.beats * 0.2,
          fontSize: lockup.beats,
          fontWeight: 600,
          transform: "translateY(-6px)",
        }}
      >
        {CLOSE.beats.map((b, i) => {
          const bk = progress(t, CLOSE.lockupIn + 0.45 + i * 0.16, 0.55, EASE.out);
          return (
            <span
              key={b}
              style={{ opacity: bk * 0.9, transform: `translateY(${(1 - bk) * 12}px)`, display: "inline-block" }}
            >
              {b}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
