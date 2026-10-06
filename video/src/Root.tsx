import { Composition } from "remotion";
import access from "./timelines/access.json";
import moreSeats from "./timelines/more-seats.json";
import research from "./timelines/research.json";
import type { Timeline } from "./timeline";
import { FLOW_LAYOUTS, Walkthrough } from "./Walkthrough";
import { DURATION, FPS, LAYOUTS } from "./launch/config";
import { Launch } from "./launch/Launch";

// One video per flow, square and in the portfolio frame's ratio. Re-run the capture and build scripts to refresh a timeline.
const TIMELINES = [research, access, moreSeats] as Timeline[];

export function Root() {
  return (
    <>
      {TIMELINES.flatMap((timeline) =>
        (["square", "frame"] as const).map((format) => (
          <Composition
            key={`${timeline.name}-${format}`}
            id={format === "square" ? timeline.name : `${timeline.name}-frame`}
            component={Walkthrough}
            width={FLOW_LAYOUTS[format].width}
            height={FLOW_LAYOUTS[format].height}
            fps={timeline.fps}
            durationInFrames={timeline.durationInFrames}
            defaultProps={{ timeline, layout: FLOW_LAYOUTS[format] }}
          />
        )),
      )}
      {/* The 20-second launch film cut from the launch-a and launch-b takes. */}
      {(["square", "wide", "frame"] as const).map((format) => (
        <Composition
          key={format}
          id={format === "square" ? "launch" : format === "wide" ? "launch-wide" : "launch-frame"}
          component={Launch}
          width={LAYOUTS[format].width}
          height={LAYOUTS[format].height}
          fps={FPS}
          durationInFrames={DURATION * FPS}
          defaultProps={{ layout: LAYOUTS[format] }}
        />
      ))}
    </>
  );
}
