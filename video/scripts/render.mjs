// Usage: node scripts/render.mjs [flow ...]   (defaults to all three) → out/<flow>.mp4
import { spawnSync } from "node:child_process";

const flows = process.argv.slice(2).length ? process.argv.slice(2) : ["research", "access", "more-seats"];
for (const flow of flows) {
  const r = spawnSync("npx", ["remotion", "render", "src/index.ts", flow, `out/${flow}.mp4`, "--log=error"], {
    stdio: "inherit",
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
  console.log(`Rendered out/${flow}.mp4`);
}
