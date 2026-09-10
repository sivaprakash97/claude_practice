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

// Positions traced from the original hand-drawn sketch frames (one set of
// 8 rectangles per role), not a generated/mirrored layout — sizes,
// rotation and placement follow the actual scatter that was drawn.
export const FRAME_LAYOUTS: FrameSpec[][] = [
  // Step 0 — Product Designer (green)
  [
    { top: 1, left: 2, width: 26, height: 21, rotate: -2, visible: true },
    { top: 1, left: 37, width: 15, height: 20, rotate: 1, visible: true },
    { top: 4, left: 58, width: 39, height: 24, rotate: -1, visible: true },
    { top: 35, left: 80, width: 13, height: 24, rotate: 2, visible: true },
    { top: 31, left: 3, width: 12, height: 23, rotate: 1, visible: true },
    { top: 57, left: 3, width: 30, height: 37, rotate: -2, visible: true },
    { top: 74, left: 40, width: 20, height: 19, rotate: 1, visible: true },
    { top: 71, left: 84, width: 16, height: 23, rotate: -1, visible: true },
  ],
  // Step 1 — Visual Designer (orange)
  [
    { top: 1, left: 4, width: 14, height: 18, rotate: 2, visible: true },
    { top: 2, left: 54, width: 22, height: 12, rotate: -1, visible: true },
    { top: 3, left: 90, width: 15, height: 20, rotate: 1, visible: true },
    { top: 22, left: 3, width: 11, height: 8, rotate: -1, visible: true },
    { top: 49, left: 10, width: 19, height: 28, rotate: 2, visible: true },
    { top: 70, left: 34, width: 22, height: 17, rotate: -1, visible: true },
    { top: 53, left: 75, width: 21, height: 30, rotate: 1, visible: true },
    { top: 78, left: 63, width: 20, height: 19, rotate: -2, visible: true },
  ],
  // Step 2 — Creative Director (blue)
  [
    { top: 6, left: 2, width: 16, height: 35, rotate: -1, visible: true },
    { top: 8, left: 33, width: 12, height: 17, rotate: 2, visible: true },
    { top: 6, left: 55, width: 15, height: 12, rotate: -2, visible: true },
    { top: 5, left: 80, width: 18, height: 19, rotate: 1, visible: true },
    { top: 54, left: 2, width: 7, height: 11, rotate: 1, visible: true },
    { top: 63, left: 4, width: 17, height: 18, rotate: -1, visible: true },
    { top: 64, left: 58, width: 14, height: 23, rotate: 2, visible: true },
    { top: 53, left: 80, width: 18, height: 34, rotate: -1, visible: true },
  ],
  // Step 3 — Illustrator (purple)
  [
    { top: 2, left: 3, width: 17, height: 37, rotate: 2, visible: true },
    { top: 2, left: 35, width: 13, height: 22, rotate: -2, visible: true },
    { top: 8, left: 84, width: 15, height: 21, rotate: 1, visible: true },
    { top: 53, left: 10, width: 19, height: 33, rotate: -1, visible: true },
    { top: 53, left: 59, width: 9, height: 19, rotate: 1, visible: true },
    { top: 39, left: 75, width: 18, height: 24, rotate: -2, visible: true },
    { top: 72, left: 4, width: 11, height: 14, rotate: 1, visible: true },
    { top: 73, left: 76, width: 22, height: 20, rotate: -1, visible: true },
  ],
];
