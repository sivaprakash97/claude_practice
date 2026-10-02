import { Composition } from "remotion";
import access from "./timelines/access.json";
import moreSeats from "./timelines/more-seats.json";
import research from "./timelines/research.json";
import type { Timeline } from "./timeline";
import { SIZE, Walkthrough } from "./Walkthrough";
import { DURATION, FPS } from "./launch/config";
import { Launch } from "./launch/Launch";

// One square video per flow. Re-run the capture and build scripts to refresh a timeline.
const TIMELINES = [research, access, moreSeats] as Timeline[];

export function Root() {
  return (
    <>
      {TIMELINES.map((timeline) => (
        <Composition
          key={timeline.name}
          id={timeline.name}
          component={Walkthrough}
          width={SIZE}
          height={SIZE}
          fps={timeline.fps}
          durationInFrames={timeline.durationInFrames}
          defaultProps={{ timeline }}
        />
      ))}
      {/* The 20-second launch film cut from the launch-a and launch-b takes. */}
      <Composition id="launch" component={Launch} width={SIZE} height={SIZE} fps={FPS} durationInFrames={DURATION * FPS} />
    </>
  );
}
