import {
  ChartLine,
  ChevronDown,
  ChevronRight,
  CirclePacking,
  Dashboard,
  Document,
  Events,
  Home,
  Money,
  ReportData,
  Settings,
  SidePanelCloseFilled,
} from "@carbon/icons-react";
import type { CarbonIconType } from "@carbon/icons-react";

const NAV: { label: string; icon: CarbonIconType; expandable?: boolean }[] = [
  { label: "Home", icon: Home },
  { label: "Dashboard", icon: Dashboard },
  { label: "Report", icon: ChartLine },
  { label: "Requests", icon: ReportData },
  { label: "Financials", icon: Money, expandable: true },
  { label: "Contracts", icon: Document },
  { label: "Vendors", icon: Events },
];

const itemClass = "flex w-full items-center gap-2 rounded-lg px-2 py-3 text-sm font-medium leading-normal text-white";

export default function Sidebar({ showNewBadge, onHome }: { showNewBadge: boolean; onHome: () => void }) {
  return (
    <aside className="sticky top-0 flex h-screen w-[184px] shrink-0 flex-col bg-grey-700">
      <div className="flex h-[54px] items-center justify-between border-b border-white/20 p-4">
        <div className="flex items-center gap-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/procurement/acme-logo.png" alt="" width={17} height={17} className="rounded-full" />
          <span className="text-[17px] font-light leading-[1.4] text-white">acme</span>
        </div>
        <SidePanelCloseFilled size={14} className="text-white" />
      </div>

      <nav className="flex flex-col gap-2 px-4 pt-[26px]">
        {NAV.map(({ label, icon: Icon, expandable }, i) => (
          <button
            key={label}
            type="button"
            onClick={i === 0 ? onHome : undefined}
            className={`${itemClass} ${i === 0 ? "bg-brand" : "cursor-default"} justify-between`}
          >
            <span className="flex items-center gap-2">
              <Icon size={14} />
              {label}
            </span>
            {expandable && <ChevronRight size={14} />}
          </button>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-0.5 px-4 pb-4">
        <div className={`${itemClass} justify-between`}>
          <span className="flex items-center gap-2">
            <CirclePacking size={16} />
            Fluxby AI
          </span>
          {showNewBadge && (
            <span className="rounded-3xl bg-[#fedf89] px-2 py-0.5 text-xs font-medium leading-[1.4] text-black">New</span>
          )}
        </div>
        <div className={itemClass}>
          <Settings size={14} />
          Settings
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/20 px-6 py-[23px]">
        <span className="flex items-center gap-1.5">
          <span
            className="flex size-5 items-center justify-center rounded-full text-[10px] font-semibold text-black"
            style={{ backgroundImage: "linear-gradient(157deg, #83c4f7 10%, #b2ddff 107%)" }}
          >
            AJ
          </span>
          <span className="text-sm font-medium text-white">Amar Joshi</span>
        </span>
        <ChevronDown size={14} className="text-white" />
      </div>
    </aside>
  );
}
