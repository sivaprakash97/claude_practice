"use client";

import { useRef } from "react";
import FrameField from "./hero/FrameField";
import ProgressDots from "./hero/ProgressDots";
import RoleSentence from "./hero/RoleSentence";
import { useScrollStep } from "./hero/useScrollStep";
import { FRAME_COLORS, FRAME_LAYOUTS, ROLES } from "./heroData";

const STEP_COUNT = ROLES.length;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const step = useScrollStep(sectionRef, STEP_COUNT);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${STEP_COUNT * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden bg-white">
        <FrameField layout={FRAME_LAYOUTS[step]} color={FRAME_COLORS[step]} />

        <div
          className="relative z-10 w-full max-w-4xl px-6 sm:px-12"
          style={{ fontFamily: "var(--font-kalam)" }}
        >
          <RoleSentence step={step} />
        </div>

        <ProgressDots step={step} color={FRAME_COLORS[step]} />
      </div>
    </section>
  );
}
