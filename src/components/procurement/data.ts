export const BASE_PROMPT = "I’m looking for an AI Video generation tool";

export const SUGGESTIONS = [
  { suffix: "with flexible editing capabilities", hasFlow: true },
  { suffix: "with text-to-voice feature", hasFlow: false },
  { suffix: "with voiceover support", hasFlow: false },
] as const;

export const FLOW_PROMPT = `${BASE_PROMPT} ${SUGGESTIONS[0].suffix}`;
export const FLOW_TITLE = "Inquiry for an AI Video Generation tool";

export type Question = { id: string; title: string; options: string[] };

export const QUESTIONS: Question[] = [
  {
    id: "types",
    title: "What types of videos are you currently creating?",
    options: ["Product explainers", "Social media ads", "Tutorial videos", "For internal comms"],
  },
  {
    id: "editing",
    title: "What level of editing flexibility are you looking for?",
    options: [
      "Timeline control",
      "Keyframe animation",
      "Export feature to After Effects/Premier Pro",
      "Batch processing for multiple variations",
    ],
  },
  {
    id: "features",
    title: "What other features would you like to have?",
    options: [
      "Text-to-video from scripts",
      "Storyboard-based generation",
      "Avatar-driven videos",
      "Different style presets",
    ],
  },
];

export const THINKING_STEPS = [
  "Understanding the context...",
  "Researching how marketing teams use AI video tools...",
  "Checking the inventory...",
  "Checking if your team already uses the tool or has something similar...",
];

export const THINKING_STEP_MS = 1750;
export const THINKING_SECONDS = Math.round((THINKING_STEPS.length * THINKING_STEP_MS) / 1000);

export type Product = {
  name: string;
  vendor: string;
  description: string;
  logo?: string;
  tile?: { bg: string; label: string };
  recommended?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    name: "Runway",
    vendor: "Runway AI, Inc",
    description: "AI video editor with generative tools for scenes, effects, and cleanup",
    logo: "/procurement/logo-runway.png",
    recommended: true,
  },
  {
    name: "Synthesia",
    vendor: "Synthesia",
    description: "Create videos with AI avatars from scripts in multiple languages",
    logo: "/procurement/logo-synthesia.png",
  },
  {
    name: "Lumen5",
    vendor: "Lumen5",
    description: "Turn blog posts and scripts into social-ready videos with templates",
    tile: { bg: "#5645f5", label: "L5" },
  },
  {
    name: "Firefly",
    vendor: "Adobe",
    description: "Generative video and effects that plug into Premiere Pro workflows",
    tile: { bg: "#fb0f01", label: "Ff" },
  },
];

export const FOLLOW_UPS = [
  "Get access for Runway",
  "Give me a comparison between those 4 tools",
  "Show me other alternatives",
];

export type RequestStatus = "Pending Approval" | "Approved" | "Rejected" | "Draft";

export type Approver = {
  name: string;
  initials: string;
  photo?: string;
  bg?: string;
  fg?: string;
};

export type RequestRow = {
  number: string;
  name: string;
  status: RequestStatus;
  progress: number;
  approver: Approver;
  amount: string;
  date: string;
  program: string;
};

export const REQUESTS: RequestRow[] = [
  { number: "PR# 1229", name: "Nexus", status: "Pending Approval", progress: 55, approver: { name: "Liam Carter", initials: "LC", bg: "#ebe9fe", fg: "#1849a9" }, amount: "USD 5,500", date: "May 25, 2025", program: "Software" },
  { number: "SUR# 1030", name: "Quantum UX Agency", status: "Approved", progress: 100, approver: { name: "Emma Johnson", initials: "EJ", bg: "#d1e9ff", fg: "#1849a9" }, amount: "USD 8,200", date: "Jan 15, 2025", program: "Software" },
  { number: "PR# 1230", name: "Orion", status: "Rejected", progress: 30, approver: { name: "Noah Smith", initials: "NS", bg: "#fce7f6", fg: "#9e165f" }, amount: "USD 4,750", date: "Feb 28, 2025", program: "Services" },
  { number: "SUR# 1031", name: "Notion", status: "Pending Approval", progress: 54, approver: { name: "Olivia Brown", initials: "OB", bg: "#ffead5", fg: "#c4320a" }, amount: "USD 9,100", date: "Mar 12, 2025", program: "Software" },
  { number: "PR# 1231", name: "Lee Advertising", status: "Approved", progress: 100, approver: { name: "Ava Davis", initials: "AD", photo: "/procurement/avatar-ava.png" }, amount: "USD 6,300", date: "Apr 22, 2025", program: "Software" },
  { number: "SUR# 1032", name: "V0", status: "Pending Approval", progress: 84, approver: { name: "Ethan Wilson", initials: "EW", photo: "/procurement/avatar-ethan.png" }, amount: "USD 3,900", date: "May 5, 2025", program: "Services" },
  { number: "PR# 1232", name: "Figma", status: "Approved", progress: 100, approver: { name: "Isabella Martinez", initials: "IM", bg: "#d1e9ff", fg: "#1849a9" }, amount: "USD 10,000", date: "Jan 7, 2025", program: "Software" },
  { number: "SUR# 1033", name: "Lovable", status: "Approved", progress: 100, approver: { name: "Mason Garcia", initials: "MG", photo: "/procurement/avatar-mason.png" }, amount: "USD 2,400", date: "Feb 14, 2025", program: "Software" },
  { number: "SUR# 13", name: "Intercom", status: "Pending Approval", progress: 31, approver: { name: "Sophia Rodriguez", initials: "SR", bg: "#ffe4e8", fg: "#c01048" }, amount: "USD 11,600", date: "Mar 30, 2025", program: "Software" },
  { number: "SUR# 102", name: "Dropbox", status: "Draft", progress: 0, approver: { name: "James Lee", initials: "JL", bg: "#ebe9fe", fg: "#5925dc" }, amount: "USD 7,800", date: "Apr 18, 2025", program: "Software" },
];

// ── Get access flow ─────────────────────────────────────────────

export const ACCESS_TITLE = "Get access for Runway license";
export const ASSIGNED_TITLE = "Runway seats successfully assigned";
export const RUNWAY_SEATS = 5;
export const ASSIGNING_MS = 3000;

export type Member = {
  id: string;
  name: string;
  email: string;
  role?: string;
  photo?: string;
  initials: string;
  bg?: string;
  fg?: string;
};

export const RECOMMENDED_MEMBERS: Member[] = [
  { id: "ashley", name: "Ashley Simmons", role: "Video editor", email: "ashley.simmons@acme.com", photo: "/procurement/member-ashley.png", initials: "AS" },
  { id: "riley", name: "Riley White", role: "Video editor", email: "riley.white@acme.com", photo: "/procurement/member-riley.png", initials: "RW" },
  { id: "mellisa", name: "Mellisa Berrera", role: "Video editor", email: "mellisa.berrera@acme.com", photo: "/procurement/member-mellisa.png", initials: "MB" },
  { id: "nikita", name: "Nikita Skye", role: "Motion Graphics Designer", email: "nikita.skye@acme.com", photo: "/procurement/member-nikita.png", initials: "NS" },
  { id: "liam", name: "Liam O'Reilly", role: "3D Animator", email: "liam0reilly@acme.com", photo: "/procurement/member-liam.png", initials: "LO" },
];

export const OTHER_MEMBERS: Member[] = [
  { id: "aswin", name: "Aswin Kumar", email: "aswinkumar@acme.com", initials: "AK", bg: "#d1e9ff", fg: "#1849a9" },
  { id: "maria", name: "Maria Johnson", email: "mariajohnson@acme.com", initials: "MJ", bg: "#fce7f6", fg: "#9e165f" },
  { id: "david", name: "David Lee", email: "davidlee@acme.com", initials: "DL", bg: "#ffead5", fg: "#c4320a" },
  { id: "sophia", name: "Sophia Patel", email: "sophiapatel@acme.com", initials: "SP", bg: "#ebe9fe", fg: "#5925dc" },
];

export const ALL_MEMBERS = [...RECOMMENDED_MEMBERS, ...OTHER_MEMBERS];

export const LICENSE_LOG = {
  number: "LA# 1029",
  software: [
    ["Software", "Runway"],
    ["License type", "Enterprise"],
    ["Renewal period", "Monthly"],
    ["Next Renewal date", "Jul 15, 2025"],
  ],
  owner: { name: "Amar Joshi", photo: "/procurement/avatar-amar.png" },
  department: "Marketing Design",
  assignedDate: "June 24, 2025",
} as const;
