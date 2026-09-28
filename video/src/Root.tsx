import { Composition } from "remotion";
import access from "./timelines/access.json";
import moreSeats from "./timelines/more-seats.json";
import research from "./timelines/research.json";
import type { Timeline } from "./timeline";
import { SIZE, Walkthrough } from "./Walkthrough";

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
    </>
  );
}
