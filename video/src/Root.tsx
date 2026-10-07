import { Composition } from "remotion";
import access from "./timelines/access.json";
import moreSeats from "./timelines/more-seats.json";
import request from "./timelines/request.json";
import research from "./timelines/research.json";
import accessFrame from "./timelines/access-frame.json";
import moreSeatsFrame from "./timelines/more-seats-frame.json";
import requestFrame from "./timelines/request-frame.json";
import researchFrame from "./timelines/research-frame.json";
import type { Timeline } from "./timeline";
import { FLOW_LAYOUTS, Walkthrough } from "./Walkthrough";
import { DURATION, FPS, LAYOUTS } from "./launch/config";
import { Launch } from "./launch/Launch";

// One square video per flow. Re-run the capture and build scripts to refresh a timeline.
const TIMELINES = [research, access, moreSeats, request] as Timeline[];

export function Root() {
  return (
    <>
      {TIMELINES.map((timeline) => (
        <Composition
          key={timeline.name}
          id={timeline.name}
          component={Walkthrough}
          width={FLOW_LAYOUTS.square.width}
          height={FLOW_LAYOUTS.square.height}
          fps={timeline.fps}
          durationInFrames={timeline.durationInFrames}
          defaultProps={{ timeline, layout: FLOW_LAYOUTS.square }}
        />
      ))}
      {/* Flows recorded in the frame format's shorter browser window (scripts/flows.mjs `framed`). */}
      {([researchFrame, accessFrame, moreSeatsFrame, requestFrame] as Timeline[]).map((timeline) => (
        <Composition
          key={timeline.name}
          id={timeline.name}
          component={Walkthrough}
          width={FLOW_LAYOUTS.frame.width}
          height={FLOW_LAYOUTS.frame.height}
          fps={timeline.fps}
          durationInFrames={timeline.durationInFrames}
          defaultProps={{ timeline, layout: FLOW_LAYOUTS.frame }}
        />
      ))}
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
