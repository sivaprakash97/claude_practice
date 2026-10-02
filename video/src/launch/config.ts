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
export const SIZE = 1080;

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
// Takes are 1440×1024 pages; the stage shows them without the nav sidebar.
export const PAGE = { width: 1440, height: 1024, cropLeft: 184 };
const visibleWidth = PAGE.width - PAGE.cropLeft;
export const STAGE = { x: 40, y: 225, width: 1000, height: (PAGE.height * 1000) / visibleWidth, radius: 20 };
/** Canvas pixels per page pixel at zoom 1. */
export const BASE_SCALE = STAGE.width / visibleWidth;

/** Keep a framing inside the visible page so the stage never shows past its edges. */
export function frame(x: number, y: number, zoom: number) {
  const halfW = visibleWidth / zoom / 2;
  const halfH = PAGE.height / zoom / 2;
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
export const CLOSE_START = 18.05;

export const SCENES: Scene[] = [
  // Find it
  scene("suggest", "A", mark("A", "prompt").t, mark("A", "questions").t + 0.06, HOOK_END, 4.4),
  scene("questions", "A", mark("A", "questions").t + 0.06, click("A", "q2").t + 0.05, 4.4, 5.75),
  // Only the inventory steps: "Checking the inventory…", "…already uses the tool…".
  scene("thinking", "A", click("A", "submit").t + 1.02, mark("A", "results").t - 0.06, 5.75, 6.55),
  scene("results", "A", mark("A", "results").t - 0.06, click("A", "getAccess").t + 0.12, 6.55, 8.6),
  // Get access
  scene("assign", "A", click("A", "getAccess").t + 0.12, click("A", "giveAccess").t + 0.12, 8.6, 11.4),
  scene("assigning", "A", click("A", "giveAccess").t + 0.12, mark("A", "assigned").t, 11.4, 11.9),
  scene("log", "A", mark("A", "assigned").t, mark("A", "logMembers").t + 1.4, 11.9, 13.4),
  // Get approval: take B opens on the same log, so the cut is invisible
  scene("ask", "B", 0.05, click("B", "proceed").t + 0.12, 13.4, 14.5),
  scene("creating", "B", click("B", "proceed").t + 0.12, mark("B", "doc").t + 0.05, 14.5, 15.0),
  scene("request", "B", mark("B", "doc").t + 0.05, mark("B", "submitArea").t, 15.0, 16.5),
  scene("submit", "B", mark("B", "submitArea").t, mark("B", "modal").t - 0.1, 16.5, 17.1),
  scene("submitted", "B", mark("B", "modal").t - 0.1, mark("B", "modal").t + 0.85, 17.1, CLOSE_START + 0.6),
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
const getAccess = filmTime("results", click("A", "getAccess").t);
const panelOpens = filmTime("log", mark("A", "assigned").t + 0.55);
const proceed = filmTime("ask", click("B", "proceed").t);
const docAppears = filmTime("request", mark("B", "doc").t + 0.05);

export const CAMERA: CameraKey[] = [
  cut(HOOK_CAMERA.x, HOOK_CAMERA.y, HOOK_CAMERA.zoom, 0),
  // The chosen prompt becomes the thread title: follow it into the research view.
  at(812, 360, 1.6, suggestionClick + 0.62, 0.55),
  // Thinking: hold on Fluxby's working steps.
  cut(812, 256, 1.95, 5.75),
  at(790, 250, 2.15, 6.5, 0.75),
  // Results: open wide on the catalogue, then push into the recommendation.
  cut(812, 470, 1.3, 6.55),
  at(690, 560, 1.95, 7.75, 1.0),
  // Get access: settle on the seat picker as the new turn arrives.
  at(812, 470, 1.55, getAccess + 0.75, 0.6),
  // Assigning: pull out so the log can slide in.
  at(812, 512, 1.0, 12.05, 0.65),
  // The log slides in; track with it and let it fill the frame.
  at(1021, 450, 1.5, panelOpens + 0.85, 0.85),
  // (cut to take B on the same framing) then pan to Fluxby's offer.
  at(600, 545, 1.6, 14.2, 0.6),
  at(600, 380, 1.6, proceed + 0.5, 0.45),
  // The drafted request replaces the log: move onto it, then a slow push.
  at(1045, 330, 1.6, docAppears + 0.6, 0.6),
  at(1045, 320, 1.72, 16.45, 0.85),
  at(1048, 704, 1.6, 16.95, 0.42),
  at(720, 515, 1.45, 17.55, 0.5),
];

// ── Typography ──────────────────────────────────────────────────────────────
export type Act = { title: string; line: string; start: number; end: number };
export const ACTS: Act[] = [
  {
    title: "Find it.",
    line: "Fluxby researches the options and checks what your team already has.",
    start: 3.05,
    end: 8.45,
  },
  { title: "Get access.", line: "Assign open seats in a few clicks, logged automatically.", start: 8.65, end: 13.3 },
  { title: "Get approval.", line: "Need more seats? Fluxby drafts the request for you.", start: 13.5, end: 17.95 },
];

export const CLOSE = { stageOut: CLOSE_START, lockupIn: CLOSE_START + 0.4, beats: ["Find it.", "Get access.", "Get approval."] };

/** The cursor is on screen from the first interaction to the submit. */
export const CURSOR = { in: HOOK_END + 0.05, out: 17.3 };
