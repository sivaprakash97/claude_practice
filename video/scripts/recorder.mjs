// Drives the prototype in Chromium and records it with the DevTools screencast.
// Every frame is saved with the time it was drawn, and every click, scroll, caption
// and speed change is logged on the same clock, so the video can be rebuilt later
// with the camera, cursor and captions laid over it.
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright-core";

export const VIEWPORT = { width: 1200, height: 1000 };
const SCALE = 2; // Device pixel ratio: frames are 2400×2000 so zooms stay sharp.
const CHROME = process.env.CHROME_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const now = () => Date.now() / 1000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Same curve the video draws the cursor along (src/timeline.ts), so hover states line up.
const arc = (a, b, k) => {
  const cx = (a.x + b.x) / 2 - (b.y - a.y) * 0.12;
  const cy = (a.y + b.y) / 2 + (b.x - a.x) * 0.12;
  const u = 1 - k;
  return { x: u * u * a.x + 2 * u * k * cx + k * k * b.x, y: u * u * a.y + 2 * u * k * cy + k * k * b.y };
};
const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

export async function record({ name, url, script, outDir }) {
  const frameDir = join(outDir, "frames");
  await rm(outDir, { recursive: true, force: true });
  await mkdir(frameDir, { recursive: true });

  const browser = await chromium.launch({ executablePath: CHROME, args: [`--force-device-scale-factor=${SCALE}`] });
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: SCALE });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  // No text caret or focus rings: the video draws its own cursor.
  await page.addStyleTag({ content: "*{caret-color:transparent!important}" });
  await page.waitForTimeout(600);

  const frames = [];
  const writes = [];
  const cdp = await context.newCDPSession(page);
  cdp.on("Page.screencastFrame", ({ data, metadata, sessionId }) => {
    cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
    const file = `${String(frames.length).padStart(6, "0")}.jpg`;
    frames.push({ file, t: metadata.timestamp });
    writes.push(writeFile(join(frameDir, file), Buffer.from(data, "base64")));
  });
  await cdp.send("Page.startScreencast", {
    format: "jpeg",
    quality: 92,
    maxWidth: VIEWPORT.width * SCALE,
    maxHeight: VIEWPORT.height * SCALE,
    everyNthFrame: 1,
  });

  const events = [];
  const log = (kind, fields = {}) => events.push({ kind, t: now(), ...fields });
  let mouse = { x: VIEWPORT.width * 0.62, y: VIEWPORT.height * 0.78 };
  await page.mouse.move(mouse.x, mouse.y);

  // Screencast only sends frames when something changes: a hidden ticking element keeps
  // frames coming during still moments, so the first frame is exactly at the start.
  await page.evaluate(() => {
    const tick = document.createElement("div");
    tick.style.cssText = "position:fixed;left:0;top:0;width:1px;height:1px;opacity:0.01;pointer-events:none";
    document.body.appendChild(tick);
    const loop = (t) => {
      tick.style.background = Math.floor(t / 16) % 2 ? "#fff" : "#fefefe";
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });
  await sleep(300);
  log("start", { cursor: mouse });

  const box = async (target) => {
    const b = await target.boundingBox();
    if (!b) throw new Error(`Not visible: ${target}`);
    return b;
  };

  /** Smoothly scroll the target's scroll container so the target sits at `block`. */
  const scrollTo = async (target, { block = "center", offset = 0, ms = 900 } = {}) => {
    log("scroll", { ms });
    await target.evaluate(
      async (el, { block, offset, ms }) => {
        let sc = el.parentElement;
        while (sc && !(/(auto|scroll)/.test(getComputedStyle(sc).overflowY) && sc.scrollHeight > sc.clientHeight))
          sc = sc.parentElement;
        sc = sc ?? document.scrollingElement;
        const r = el.getBoundingClientRect();
        const s = sc.getBoundingClientRect();
        const delta =
          (block === "start" ? r.top - s.top : block === "end" ? r.bottom - s.bottom : r.top + r.height / 2 - (s.top + s.height / 2)) +
          offset;
        const from = sc.scrollTop;
        const to = Math.max(0, Math.min(sc.scrollHeight - sc.clientHeight, from + delta));
        const t0 = performance.now();
        const easeIO = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
        await new Promise((done) => {
          const step = () => {
            const k = Math.min(1, (performance.now() - t0) / ms);
            sc.scrollTop = from + (to - from) * easeIO(k);
            if (k < 1) requestAnimationFrame(step);
            else done();
          };
          requestAnimationFrame(step);
        });
      },
      { block, offset, ms },
    );
  };

  /** Scroll the target into view if it isn't comfortably visible already. */
  const reveal = async (target) => {
    const b = await box(target);
    const margin = 90;
    const visibleBottom = VIEWPORT.height - 110; // Above the chat box.
    if (b.y < margin || b.y + b.height > visibleBottom) await scrollTo(target);
  };

  /**
   * Move to the target and click it.
   * zoom: camera scale while clicking (false keeps the wide shot); hold: seconds to stay zoomed after.
   * out: pull back to the full window afterwards instead of panning on (for clicks that change the page).
   * at: [x, y] fractions inside the element for where the cursor lands (default centre).
   */
  const click = async (target, { zoom = 1.8, hold = 0.9, travel = 700, pause = 250, at = [0.5, 0.5], out = false } = {}) => {
    await target.waitFor({ state: "visible" });
    await reveal(target);
    const b = await box(target);
    const to = { x: b.x + b.width * at[0], y: b.y + b.height * at[1] };
    const from = mouse;
    const moveStart = now();
    const steps = 14;
    for (let i = 1; i <= steps; i++) {
      const p = arc(from, to, ease(i / steps));
      await page.mouse.move(p.x, p.y);
      await sleep(travel / steps);
    }
    const moveEnd = now();
    await sleep(pause);
    mouse = to;
    log("click", { x: to.x, y: to.y, from, moveStart, moveEnd, zoom, hold, out });
    await page.mouse.down();
    await sleep(70);
    await page.mouse.up();
  };

  /** Point the camera at an element without clicking. */
  const focus = async (target, { zoom = 1.6, hold = 1.2, at = [0.5, 0.5] } = {}) => {
    const b = await box(target);
    log("focus", { x: b.x + b.width * at[0], y: b.y + b.height * at[1], zoom, hold });
  };

  const api = {
    page,
    click,
    focus,
    scrollTo,
    wait: (ms) => sleep(ms),
    caption: (text) => log("caption", { text }),
    /** Playback speed from here on (2 = twice as fast in the video). */
    speed: (rate) => log("speed", { rate }),
  };

  await script(api);
  log("end");
  await sleep(200);
  await cdp.send("Page.stopScreencast");
  await Promise.all(writes);
  await browser.close();

  await writeFile(
    join(outDir, "recording.json"),
    JSON.stringify({ name, viewport: VIEWPORT, scale: SCALE, frames, events }, null, 1),
  );
  console.log(`${name}: ${frames.length} frames, ${(events.at(-1).t - events[0].t).toFixed(1)}s`);
}
