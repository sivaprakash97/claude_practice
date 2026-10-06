# Walkthrough videos

Square (1080×1080, 60fps) motion-graphic walkthroughs of the Fluxby prototype, each also rendered at
1700×1056 (`<flow>-frame`, the 850×528 portfolio frame at 2x) with a wider window and the captions
in a column on the left. The camera zooms in
on each click, and the videos add a smooth cursor, click ripples and captions.

| Flow | Composition | Story |
| --- | --- | --- |
| 1 | `research` | Ask Fluxby for a tool, answer its questions, get Runway recommended |
| 2 | `access` | Get access to Runway and pick the teammates who need a seat |
| 3 | `more-seats` | Only 5 seats left: Fluxby's approval process, then assign 5 now and request 5 more |

### Launch film

`launch` (1080×1080), `launch-wide` (1920×1080) and `launch-frame` (1700×1056, the 850×528 portfolio frame at 2x with a wider product screen) are the same 20-second edited film of the
whole story, cut from two takes recorded for it (`launch-a`: home screen → license log,
`launch-b`: seat upgrade request → submitted). The wide version puts the act headlines in a
column beside the product instead of above it; `LAYOUTS` in `src/launch/config.ts` holds each
format's placement.

| Time | Beat |
| --- | --- |
| 0–2.9s | The prompt types out large, then lands exactly on the real home screen's heading and input |
| 2.9–8.6s | **Find it.** A suggestion, one clarifying question, the inventory check, Runway with 5 seats left |
| 8.6–13.4s | **Get access.** Five teammates assigned, the license log slides in |
| 13.4–18s | **Get approval.** An invisible cut on the same log, then the drafted seat upgrade request is submitted |
| 18–20s | Fluxby AI lockup |

The edit lives in `src/launch/config.ts`: scenes cut each take between named marks and clicks
(logged by `scripts/launch-flows.mjs`) and stretch the cut to its slot, so re-recording keeps the
timing. Camera framings, headlines and hook timing are in the same file; easing and the camera
interpolation are in `src/launch/motion.ts`.

```bash
npm run capture -- launch-a launch-b && npm run build -- launch-a launch-b
npx remotion render src/index.ts launch out/launch.mp4
npx remotion render src/index.ts launch-wide out/launch-wide.mp4
npx remotion render src/index.ts launch-frame out/launch-frame.mp4
```

## How it works

1. **Capture** (`scripts/capture.mjs`): Playwright runs each flow in `scripts/flows.mjs` against the
   running prototype at the design's 1440×1024. It records the screen at 1.5× through the DevTools
   screencast and logs every click, scroll, caption and speed change on the same clock.
2. **Build** (`scripts/build.mjs`): applies the speed-ups and writes the screen as a steady 60fps
   clip (`public/<flow>/screen.mp4`) plus a timeline of events (`src/timelines/<flow>.json`).
3. **Render** (`src/`, Remotion): places the clip in a browser window and adds the camera, cursor
   and captions from the timeline. The window leaves out the nav sidebar, so the page keeps its
   full design width and still fits the square frame.

## Making the videos

```bash
# From the repo root: run the prototype (a production build avoids the dev overlay)
npm run build && npm start

# In another terminal
cd video
npm install
npm run capture            # all flows, or: npm run capture -- access
npm run build              # all recordings, or: npm run build -- access
npm run render             # → out/<flow>.mp4, or: npm run render -- access
npm run studio             # preview and scrub in the browser
```

`capture` uses Playwright's Chromium from `/opt/pw-browsers` by default. Set `CHROME_PATH` to use
another Chrome, or `APP_URL` to record somewhere other than `http://localhost:3000`. For `render`,
set `REMOTION_BROWSER` to a Chrome or headless shell binary, or leave it unset and Remotion will
download its own browser.

## Tweaking

- **Clicks, zoom and pacing**: edit `scripts/flows.mjs`. `click(target, { zoom, hold, travel })`
  sets how far the camera zooms (`zoom: false` stays wide) and how long it stays there.
  `focus()` zooms without clicking, `caption()` changes the caption, and `speed(2)` plays what
  follows twice as fast until the next `speed(1)`. A flow's `crop` sets how much of the page's
  left edge stays out of frame, and `ready` lets it start filming as soon as some content
  appears. Then run capture, build and render again.
- **Look**: `public/background.jpg` is the backdrop. `src/Walkthrough.tsx` holds the window frame, cursor, ripple and caption
  styles. `src/timeline.ts` holds the camera timing (glide duration, when to pan instead of
  zooming out).
