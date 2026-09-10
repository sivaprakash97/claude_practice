import { type RefObject, useEffect, useState } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Turns scroll position inside a tall, pinned section into a discrete
 * step index (0..stepCount-1): the section is `stepCount * 100vh` tall,
 * stays stuck to the viewport while scrolling through it, and each
 * `100vh` of scroll advances the step by one.
 */
export function useScrollStep(
  sectionRef: RefObject<HTMLElement | null>,
  stepCount: number,
) {
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
      const next = clamp(Math.floor(progress * stepCount), 0, stepCount - 1);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepCount]);

  return step;
}
