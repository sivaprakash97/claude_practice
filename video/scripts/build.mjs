// Usage: node scripts/build.mjs [flow ...]   (defaults to every recording)
// Turns a recording into what the Remotion scene plays:
//   public/<flow>/screen.mp4     the screen at a steady 60fps, with speed-ups applied
//   src/timelines/<flow>.json    clicks, focus points and captions on the video's clock
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const FPS = 60;
const names = process.argv.slice(2).length ? process.argv.slice(2) : await readdir("recordings");

for (const name of names) {
  const dir = join("recordings", name);
  const rec = JSON.parse(await readFile(join(dir, "recording.json"), "utf8"));
  const start = rec.events.find((e) => e.kind === "start").t;
  const end = rec.events.find((e) => e.kind === "end").t;

  // Speed changes split the recording into pieces played at different rates.
  const pieces = [];
  let rate = 1;
  let from = start;
  for (const e of rec.events.filter((e) => e.kind === "speed")) {
    pieces.push({ from, to: e.t, rate });
    from = e.t;
    rate = e.rate;
  }
  pieces.push({ from, to: end, rate });
  let out = 0;
  for (const p of pieces) {
    p.out = out;
    out += (p.to - p.from) / p.rate;
  }
  const duration = out;

  // Recording time → video time, and back.
  const toVideo = (t) => {
    const p = pieces.find((p) => t <= p.to) ?? pieces.at(-1);
    return p.out + (Math.max(t, p.from) - p.from) / p.rate;
  };
  const toRecording = (o) => {
    const p = [...pieces].reverse().find((p) => o >= p.out) ?? pieces[0];
    return p.from + (o - p.out) * p.rate;
  };

  // One symlink per output frame, pointing at the newest captured frame at that moment.
  const seq = join(dir, "seq");
  await rm(seq, { recursive: true, force: true });
  await mkdir(seq);
  const total = Math.round(duration * FPS);
  let f = 0;
  for (let i = 0; i < total; i++) {
    const t = toRecording(i / FPS);
    while (f + 1 < rec.frames.length && rec.frames[f + 1].t <= t) f++;
    await symlink(resolve(dir, "frames", rec.frames[f].file), join(seq, `${String(i).padStart(6, "0")}.jpg`));
  }

  await mkdir(join("public", name), { recursive: true });
  const video = join("public", name, "screen.mp4");
  const ffmpeg = spawnSync(
    "npx",
    [
      "remotion", "ffmpeg", "-y", "-loglevel", "error",
      "-framerate", String(FPS), "-i", join(seq, "%06d.jpg"),
      "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
      video,
    ],
    { stdio: "inherit" },
  );
  if (ffmpeg.status !== 0) throw new Error(`ffmpeg failed for ${name}`);
  if (!existsSync(video)) throw new Error(`No video written for ${name}`);

  const events = rec.events
    .filter((e) => ["click", "focus", "caption"].includes(e.kind))
    .map((e) => {
      const ev = { ...e, t: toVideo(e.t) };
      if (e.moveStart !== undefined) ev.moveStart = toVideo(e.moveStart);
      if (e.moveEnd !== undefined) ev.moveEnd = toVideo(e.moveEnd);
      return ev;
    });
  await mkdir(join("src", "timelines"), { recursive: true });
  await writeFile(
    join("src", "timelines", `${name}.json`),
    JSON.stringify(
      {
        name,
        fps: FPS,
        durationInFrames: total,
        viewport: rec.viewport,
        crop: rec.crop ?? { x: 0 },
        cursor: rec.events.find((e) => e.kind === "start").cursor,
        events,
      },
      null,
      1,
    ) + "\n",
  );
  console.log(`${name}: ${duration.toFixed(1)}s, ${total} frames → ${video}`);
}
