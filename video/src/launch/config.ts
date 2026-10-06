// The launch film's edit: every scene, camera move, headline and beat lives here.
// Times are seconds of film (20s at 60fps). Scenes cut the two recorded takes by the
// marks and clicks named in scripts/launch-flows.mjs, then stretch each cut to its slot,
// so a fresh capture keeps the same timing.
import takeA from "../timelines/launch-a.json";
import takeB from "../timelines/launch-b.json";
import type { Timeline } from "../timeline";
import { EASE, type CameraKey } from "./motion";

export const FPS = 60;
export const DURATION = 20;

export const TAKES = { A: takeA as Timeline, B: takeB as Timeline };
export type TakeId = keyof typeof TAKES;

type Named = { kind: string; name?: string; t: number };
const find = (take: TakeId, kind: string, name: string) => {
  const e = (TAKES[take].events as Named[]).find((ev) => ev.kind === kind && ev.name === name);
  if (!e) throw new Error(`No ${kind} "${name}" in take ${take}`);
  return e as Named & { box?: { x: number; y: number; w: number; h: number }; moveStart?: number };
};
export const mark = (take: TakeId, name: string) => find(take, "mark", name);
export const click = (take: TakeId, name: string) => find(take, "click", name);

// ── Page and stage geometry ─────────────────────────────────────────────────
// Takes are 1440×1024 pages. The stage is a window onto them in the product screen's own
// proportions (1040×800): the nav sidebar is cropped off the left and the sliver of page
// that does not fit the window (top and bottom) is left out.
export const PAGE = { width: 1440, height: 1024, cropLeft: 184 };
export const STAGE_ASPECT = 1040 / 800;
const visibleWidth = PAGE.width - PAGE.cropLeft;
/** Page pixels visible at zoom 1. */
export const visibleHeight = visibleWidth / STAGE_ASPECT;
const stageHeight = (width: number) => width / STAGE_ASPECT;

// ── Formats ─────────────────────────────────────────────────────────────────
// The edit is shared; each format only places the stage, the type and the lockup.
export type Layout = {
  width: number;
  height: number;
  stage: { x: number; y: number; width: number; height: number; radius: number };
  /** Act headlines: above the stage (square) or in a column beside it (wide). */
  headline: { left: number; top: number; width: number; title: number; line: number };
  /** Opening type, before it lands on the UI. */
  hook: { eyebrowTop: number; promptTop: number; heading: number; mark: number; prompt: number };
  lockup: { mark: number; word: number; beats: number };
  /** Shade over the backdrop so white type reads (see SCRIM). */
  scrim: string;
};

/**
 * Shade over the jade backdrop. Pure white type needs 7:1 (WCAG AAA, normal text) against
 * the brightest pixel of the image, a white vein at luminance ~0.98. Blending rgb(0,22,14)
 * at 75% brings that pixel to ~8.6:1 and the typical jade to ~13:1, wherever the type sits.
 */
export const SCRIM = "rgba(0,22,14,0.75)";

export const LAYOUTS: Record<"square" | "wide" | "frame", Layout> = {
  square: {
    width: 1080,
    height: 1080,
    stage: { x: 40, y: 252, width: 1000, height: stageHeight(1000), radius: 20 },
    headline: { left: 48, top: 66, width: 984, title: 58, line: 23 },
    hook: { eyebrowTop: 436, promptTop: 498, heading: 32, mark: 40, prompt: 46 },
    lockup: { mark: 84, word: 82, beats: 30 },
    scrim: SCRIM,
  },
  wide: {
    width: 1920,
    height: 1080,
    stage: { x: 740, y: (1080 - stageHeight(1120)) / 2, width: 1120, height: stageHeight(1120), radius: 22 },
    headline: { left: 100, top: 436, width: 580, title: 72, line: 28 },
    hook: { eyebrowTop: 420, promptTop: 498, heading: 44, mark: 54, prompt: 66 },
    lockup: { mark: 112, word: 110, beats: 40 },
    scrim: SCRIM,
  },
  // 1700×1056: the 850×528 portfolio frame at 2x, with a wider product screen.
  frame: {
    width: 1700,
    height: 1056,
    stage: { x: 480, y: (1056 - stageHeight(1180)) / 2, width: 1180, height: stageHeight(1180), radius: 22 },
    headline: { left: 72, top: 420, width: 380, title: 60, line: 25 },
    hook: { eyebrowTop: 408, promptTop: 486, heading: 44, mark: 54, prompt: 66 },
    lockup: { mark: 112, word: 110, beats: 40 },
    scrim: SCRIM,
  },
};

/** Canvas pixels per page pixel at zoom 1. */
export const baseScale = (layout: Layout) => layout.stage.width / visibleWidth;

/** Keep a framing inside the visible page so the stage never shows past its edges. */
export function frame(x: number, y: number, zoom: number) {
  const halfW = visibleWidth / zoom / 2;
  const halfH = visibleHeight / zoom / 2;
  return {
    x: Math.min(PAGE.width - halfW, Math.max(PAGE.cropLeft + halfW, x)),
    y: Math.min(PAGE.height - halfH, Math.max(halfH, y)),
    zoom,
  };
}

// ── Scenes ──────────────────────────────────────────────────────────────────
export type Scene = { id: string; take: TakeId; from: number; to: number; start: number; end: number };

const scene = (id: string, take: TakeId, from: number, to: number, start: number, end: number): Scene => ({
  id,
  take,
  from,
  to,
  start,
  end,
});

export const HOOK_END = 2.9;
export const CLOSE_START = 17.6;

// Only the moments that carry the story: the suggestion, the catalogue with its
// recommendation, the seat picker and log, the drafted request and its confirmation.
export const SCENES: Scene[] = [
  // Find it
  scene("suggest", "A", mark("A", "prompt").t, click("A", "suggestion").t + 0.35, HOOK_END, 4.4),
  // Only the inventory steps: "Checking the inventory…", "…already uses the tool…".
  scene("thinking", "A", click("A", "submit").t + 1.02, mark("A", "results").t - 0.06, 4.4, 5.0),
  scene("results", "A", mark("A", "results").t - 0.06, click("A", "getAccess").t + 0.12, 5.0, 7.5),
  // Get access
  scene("assign", "A", click("A", "getAccess").t + 0.12, click("A", "giveAccess").t + 0.12, 7.5, 10.4),
  scene("assigning", "A", click("A", "giveAccess").t + 0.12, mark("A", "assigned").t, 10.4, 10.9),
  scene("log", "A", mark("A", "assigned").t, mark("A", "logMembers").t + 1.4, 10.9, 12.4),
  // Get approval: take B opens on the same log, so the cut is invisible
  scene("ask", "B", 0.05, click("B", "proceed").t + 0.12, 12.4, 13.6),
  scene("creating", "B", click("B", "proceed").t + 0.12, mark("B", "doc").t + 0.05, 13.6, 14.2),
  scene("request", "B", mark("B", "doc").t + 0.05, mark("B", "submitArea").t, 14.2, 15.9),
  scene("submit", "B", mark("B", "submitArea").t, mark("B", "modal").t - 0.1, 15.9, 16.6),
  scene("submitted", "B", mark("B", "modal").t - 0.1, mark("B", "modal").t + 1.6, 16.6, CLOSE_START + 0.6),
];

export const sceneRate = (s: Scene) => (s.to - s.from) / (s.end - s.start);
/** Film time of a moment in a scene's take. */
export const filmTime = (id: string, takeTime: number) => {
  const s = SCENES.find((sc) => sc.id === id)!;
  return s.start + (takeTime - s.from) / sceneRate(s);
};

// ── Hook ────────────────────────────────────────────────────────────────────
// Large type lands on the real home screen: the heading and the prompt in the input.
export const HOOK = {
  eyebrowIn: 0.15,
  typeStart: 0.55,
  typeEnd: 1.75,
  stageIn: 1.85,
  stageInDuration: 0.95,
  morphStart: 2.0,
  morphEnd: 2.82,
  /** Frame of take A shown while the stage rises: the empty home screen. */
  freezeAt: click("A", "input").t - 0.12,
  prompt: "I’m looking for an AI Video generation tool",
  heading: "Ask Fluxby AI anything",
  // Where those sit in the page (measured from the prototype at 1440×1024).
  promptAt: { x: 229, y: 153, size: 16, lineHeight: 24, color: "#1f2e26" },
  headingAt: { x: 252, y: 91.6, size: 24, lineHeight: 28.8, color: "#000000" },
  markAt: { x: 216, y: 92, size: 28 },
  /** Text widths at the UI sizes (for centring the large versions). */
  promptWidth: 306.8,
  headingWidth: 262,
};

// ── Camera ──────────────────────────────────────────────────────────────────
// Framings are page coordinates and zoom (1 = the whole cropped page).
const at = (x: number, y: number, zoom: number, t: number, move = 0.7, ease = EASE.inOut): CameraKey => ({
  ...frame(x, y, zoom),
  t,
  move,
  ease,
});
const cut = (x: number, y: number, zoom: number, t: number) => at(x, y, zoom, t, 0);

export const HOOK_CAMERA = frame(557, 301, 1.7);

const suggestionClick = filmTime("suggest", click("A", "suggestion").t);
const docAppears = filmTime("request", mark("B", "doc").t + 0.05);

// A few slow moves: the whole product screen (page centre x 812, y 541: the greeting bar
// above the window is cropped, the page's bottom edge is kept) is the default framing and
// the camera only leans in where the eye is meant to go, always on a clean panel edge.
const WHOLE = { x: 812, y: 541 };
export const CAMERA: CameraKey[] = [
  cut(HOOK_CAMERA.x, HOOK_CAMERA.y, HOOK_CAMERA.zoom, 0),
  // Ease back from the landed home screen to the whole product screen.
  at(WHOLE.x, WHOLE.y, 1.0, suggestionClick + 1.3, 1.1),
  // Results: a slow lean onto the catalogue column and its recommendation.
  at(855, 600, 1.35, 7.2, 2.0),
  // Seat picker and the log: the whole screen, so the chat and the panel stay in frame.
  at(WHOLE.x, WHOLE.y, 1.0, 8.5, 1.0),
  // The drafted request replaces the log: lean onto the document panel (it starts at page
  // x≈614), then follow the page down to the submit button.
  at(1027, 520, 1.52, docAppears + 1.1, 1.2),
  at(1027, 700, 1.52, 16.2, 1.0),
  // The confirmation lands in the middle of the screen.
  at(WHOLE.x, WHOLE.y, 1.0, 17.2, 0.9),
];

// ── Typography ──────────────────────────────────────────────────────────────
export type Act = { title: string; line: string; start: number; end: number };
export const ACTS: Act[] = [
  {
    title: "Find it.",
    line: "Fluxby researches the options and checks what your team already has.",
    start: 3.05,
    end: 7.35,
  },
  { title: "Get access.", line: "Assign open seats in a few clicks, logged automatically.", start: 7.55, end: 12.25 },
  { title: "Get approval.", line: "Need more seats? Fluxby drafts the request for you.", start: 12.45, end: 17.45 },
];

export const CLOSE = { stageOut: CLOSE_START, lockupIn: CLOSE_START + 0.4, beats: ["Find it.", "Get access.", "Get approval."] };

/** The cursor is on screen from the first interaction to the submit. */
export const CURSOR = { in: HOOK_END + 0.05, out: 16.95 };
