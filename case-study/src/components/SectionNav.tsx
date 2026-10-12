"use client";

import { useEffect, useState } from "react";

const ITEMS = ["overview", "people", "problem", "process", "validation"] as const;

export default function SectionNav() {
  const [active, setActive] = useState<string>(ITEMS[0]);

  useEffect(() => {
    const onScroll = () => {
      const line = window.innerHeight * 0.35;
      let current: string = ITEMS[0];
      for (const id of ITEMS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="section-nav" aria-label="Sections">
      <div className="section-nav__pill">
        {ITEMS.map((id) => (
          <a key={id} href={`#${id}`} className="section-nav__link" data-active={active === id}>
            {id}
          </a>
        ))}
      </div>
    </nav>
  );
}
