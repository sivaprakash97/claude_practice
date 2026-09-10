"use client";

import { useEffect, useState } from "react";
import type { FrameSpec } from "../heroData";

const STAGGER_MS = 70;
const FADE_MS = 280;

type FrameFieldProps = {
  layout: FrameSpec[];
  color: string;
};

/**
 * The scattered proof-of-work rectangles behind the hero copy. Fades every
 * frame in, one by one, on first paint, then crossfades position/color as
 * `layout`/`color` change between steps.
 */
export default function FrameField({ layout, color }: FrameFieldProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0">
      {layout.map((frame, i) => (
        <div
          key={i}
          className="hero-animated absolute rounded-md border-2 ease-[cubic-bezier(0.16,1,0.3,1)]"
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
  );
}
