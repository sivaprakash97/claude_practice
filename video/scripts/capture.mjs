// Usage: node scripts/capture.mjs [flow ...]   (defaults to all flows)
// Needs the prototype running, by default at http://localhost:3000 (override with APP_URL).
import { join } from "node:path";
import { FLOWS } from "./flows.mjs";
import { record } from "./recorder.mjs";

const base = process.env.APP_URL ?? "http://localhost:3000";
const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(FLOWS);

for (const name of names) {
  const flow = FLOWS[name];
  if (!flow) throw new Error(`Unknown flow "${name}". Flows: ${Object.keys(FLOWS).join(", ")}`);
  await record({ name, url: base + flow.path, script: flow.script, outDir: join("recordings", name) });
}
