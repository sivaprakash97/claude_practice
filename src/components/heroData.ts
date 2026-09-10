export const ROLES = [
  "Product Designer",
  "Visual Designer",
  "Creative Director",
  "Illustrator",
] as const;

export type FrameSpec = {
  top: number; // percentage of hero height
  left: number; // percentage of hero width
  width: number; // percentage of hero width
  height: number; // percentage of hero height
  rotate: number; // degrees
  visible: boolean;
};

const COLORS = ["#4ade80", "#fb923c", "#60a5fa", "#c084fc"] as const;

export const FRAME_COLORS: readonly string[] = COLORS;

// 8 fixed "slots" that get repositioned/resized/hidden per role step,
// so each rectangle animates smoothly between layouts instead of
// disappearing and reappearing.
export const FRAME_LAYOUTS: FrameSpec[][] = [
  // Step 0 — Product Designer
  [
    { top: 4, left: 3, width: 22, height: 20, rotate: -2, visible: true },
    { top: 6, left: 29, width: 11, height: 14, rotate: 1, visible: true },
    { top: 3, left: 44, width: 18, height: 16, rotate: -1, visible: true },
    { top: 6, left: 84, width: 13, height: 20, rotate: 2, visible: true },
    { top: 30, left: 3, width: 12, height: 16, rotate: 1, visible: true },
    { top: 66, left: 5, width: 20, height: 22, rotate: -2, visible: true },
    { top: 62, left: 83, width: 14, height: 16, rotate: 1, visible: true },
    { top: 78, left: 60, width: 16, height: 14, rotate: -1, visible: false },
  ],
  // Step 1 — Visual Designer
  [
    { top: 5, left: 5, width: 13, height: 24, rotate: 2, visible: true },
    { top: 8, left: 32, width: 16, height: 11, rotate: -1, visible: true },
    { top: 4, left: 55, width: 20, height: 18, rotate: 1, visible: true },
    { top: 6, left: 86, width: 12, height: 16, rotate: -2, visible: true },
    { top: 34, left: 4, width: 15, height: 12, rotate: -1, visible: true },
    { top: 60, left: 4, width: 17, height: 20, rotate: 1, visible: false },
    { top: 58, left: 80, width: 17, height: 24, rotate: 2, visible: true },
    { top: 82, left: 55, width: 18, height: 13, rotate: -1, visible: true },
  ],
  // Step 2 — Creative Director
  [
    { top: 6, left: 4, width: 15, height: 30, rotate: -1, visible: true },
    { top: 10, left: 33, width: 14, height: 12, rotate: 2, visible: true },
    { top: 4, left: 52, width: 17, height: 10, rotate: -2, visible: true },
    { top: 5, left: 85, width: 13, height: 20, rotate: 1, visible: true },
    { top: 40, left: 3, width: 10, height: 14, rotate: 1, visible: true },
    { top: 65, left: 3, width: 18, height: 18, rotate: -1, visible: true },
    { top: 55, left: 82, width: 15, height: 30, rotate: 2, visible: true },
    { top: 84, left: 52, width: 20, height: 12, rotate: -1, visible: false },
  ],
  // Step 3 — Illustrator
  [
    { top: 3, left: 3, width: 15, height: 26, rotate: 2, visible: true },
    { top: 8, left: 30, width: 13, height: 20, rotate: -2, visible: true },
    { top: 3, left: 53, width: 10, height: 12, rotate: 1, visible: true },
    { top: 8, left: 86, width: 12, height: 14, rotate: -1, visible: true },
    { top: 44, left: 5, width: 13, height: 18, rotate: -1, visible: true },
    { top: 68, left: 5, width: 15, height: 13, rotate: 1, visible: true },
    { top: 58, left: 84, width: 13, height: 16, rotate: -2, visible: true },
    { top: 78, left: 60, width: 18, height: 15, rotate: 1, visible: true },
  ],
];
