"use client";

import { useEffect, useRef, useState } from "react";
import { FRAME_COLORS, FRAME_LAYOUTS, ROLES } from "./heroData";

const STEP_COUNT = ROLES.length;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);

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

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${STEP_COUNT * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-white dark:bg-black">
        {/* proof-of-work frames */}
        <div className="pointer-events-none absolute inset-0">
          {layout.map((frame, i) => (
            <div
              key={i}
              className="absolute rounded-md border-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                top: `${frame.top}%`,
                left: `${frame.left}%`,
                width: `${frame.width}%`,
                height: `${frame.height}%`,
                borderColor: color,
                opacity: frame.visible ? 0.9 : 0,
                transform: `rotate(${frame.visible ? frame.rotate : 0}deg) scale(${
                  frame.visible ? 1 : 0.85
                })`,
              }}
            />
          ))}
        </div>

        {/* hero copy */}
        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          <p className="text-lg text-zinc-500 dark:text-zinc-400 sm:text-xl">
            Hi! Sivaprakash is a
          </p>
          <div className="mt-3 flex flex-col items-center gap-1 sm:gap-2">
            {ROLES.map((role, i) => {
              const active = i === step;
              return (
                <span
                  key={role}
                  className="font-semibold tracking-tight text-black transition-all duration-500 ease-out dark:text-white"
                  style={{
                    opacity: active ? 1 : 0.28,
                    fontSize: active ? "clamp(2rem, 6vw, 4rem)" : "clamp(1.1rem, 2.5vw, 1.75rem)",
                  }}
                >
                  {role}
                </span>
              );
            })}
          </div>
        </div>

        {/* progress hint */}
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
          {ROLES.map((role, i) => (
            <span
              key={role}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === step ? "1.75rem" : "0.4rem",
                backgroundColor: i === step ? color : "rgba(120,120,120,0.35)",
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
