"use client";

import { useEffect, useRef, useState } from "react";
import { FRAME_COLORS, FRAME_LAYOUTS, ROLES } from "./heroData";

const STEP_COUNT = ROLES.length;
const STAGGER_MS = 70;
const FADE_MS = 280;
// Distance (in rem) from the active line to its nearest dimmed neighbor —
// large enough to clear the active role's much bigger font — then a
// smaller, even step for every row beyond that.
const REEL_CLEARANCE_REM = 3.1;
const REEL_STEP_REM = 1.9;

function reelOffsetRem(offset: number) {
  if (offset === 0) return 0;
  const sign = offset > 0 ? 1 : -1;
  return sign * (REEL_CLEARANCE_REM + (Math.abs(offset) - 1) * REEL_STEP_REM);
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // triggers the staggered entrance fade on first paint
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const progress = scrollable > 0 ? clamp(scrolled / scrollable, 0, 1) : 0;
      const next = clamp(Math.floor(progress * STEP_COUNT), 0, STEP_COUNT - 1);
      setStep(next);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const layout = FRAME_LAYOUTS[step];
  const color = FRAME_COLORS[step];
  const active = ROLES[step];
  const article = /^[aeiou]/i.test(active) ? "an" : "a";

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${STEP_COUNT * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden bg-white">
        {/* proof-of-work frames */}
        <div className="pointer-events-none absolute inset-0">
          {layout.map((frame, i) => (
            <div
              key={i}
              className="absolute rounded-md border-2 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                top: `${frame.top}%`,
                left: `${frame.left}%`,
                width: `${frame.width}%`,
                height: `${frame.height}%`,
                borderColor: color,
                opacity: mounted && frame.visible ? 0.85 : 0,
                transitionProperty:
                  "top, left, width, height, transform, border-color, opacity",
                transitionDuration: `700ms, 700ms, 700ms, 700ms, 700ms, 500ms, ${FADE_MS}ms`,
                transitionDelay: `0ms, 0ms, 0ms, 0ms, 0ms, 0ms, ${i * STAGGER_MS}ms`,
                transform: `rotate(${frame.visible ? frame.rotate : 0}deg) scale(${
                  frame.visible ? 1 : 0.85
                })`,
              }}
            />
          ))}
        </div>

        {/* hero copy — "Hi! Sivaprakash is a" plus the active role is plain,
            in-flow content, so nothing else on the page can ever move it.
            The other roles live on an absolutely-positioned reel anchored
            to the active role's own position, sliding past it as you
            scroll without affecting the sentence's layout at all. */}
        <div
          className="relative z-10 w-full max-w-4xl px-6 sm:px-12"
          style={{ fontFamily: "var(--font-kalam)" }}
        >
          <p
            className="flex items-baseline whitespace-nowrap font-bold leading-tight text-black"
            style={{ fontSize: "clamp(1.1rem, 4vw, 3.25rem)" }}
          >
            <span>Hi! Sivaprakash is {article}&nbsp;</span>
            <span className="relative inline-block">
              {/* visible text — this is the only thing that sets the
                  sentence's size; everything below is absolutely
                  positioned and cannot affect it */}
              {active}

              {ROLES.map((role, i) => {
                const offset = i - step;
                return (
                  <span
                    key={role}
                    aria-hidden={offset === 0}
                    className="pointer-events-none absolute left-0 top-0 whitespace-nowrap font-normal text-black/30 transition-all duration-500 ease-out"
                    style={{
                      fontSize: "clamp(1.1rem, 2.5vw, 1.75rem)",
                      transform: `translateY(${reelOffsetRem(offset)}rem)`,
                      opacity: offset === 0 ? 0 : 1,
                    }}
                  >
                    {role}
                  </span>
                );
              })}
            </span>
          </p>
        </div>

        {/* progress hint */}
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
          {ROLES.map((role, i) => (
            <span
              key={role}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === step ? "1.75rem" : "0.4rem",
                backgroundColor: i === step ? color : "rgba(0,0,0,0.15)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
