"use client";

import { useEffect, useState } from "react";
import { Close, Maximize, OverflowMenuHorizontal } from "@carbon/icons-react";
import { PROGRESS_DONE, PROGRESS_PENDING, type SeatRequest } from "./data";
import {
  Justification,
  PriceTag,
  PriorityChip,
  ProgressBar,
  ProgressTimeline,
  RequestDetails,
  StatusChip,
} from "./RequestParts";

export const REQUEST_TITLE = "Request for 5 extra Runway seats";
const TABS = ["Progress", "Details", "Comments", "Attachments"] as const;
const CLOSE_MS = 450;

/** Floating panel over the home screen with a submitted request's progress and details. */
export default function RequestDrawer({
  request,
  onClose,
  onExpand,
}: {
  request: SeatRequest;
  onClose: () => void;
  onExpand: () => void;
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Progress");
  const [expandedText, setExpandedText] = useState(false);
  const [closing, setClosing] = useState(false);
  const steps = request.done ? PROGRESS_DONE : PROGRESS_PENDING;

  const close = () => {
    setClosing(true);
    setTimeout(onClose, CLOSE_MS);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <aside
      role="dialog"
      aria-label={`${request.number} ${REQUEST_TITLE}`}
      className={`fx-slide-in-right fixed bottom-4 right-4 top-4 z-40 flex w-[507px] flex-col overflow-hidden rounded-2xl border border-grey-200 bg-white shadow-[0_12px_16px_-4px_rgba(16,24,40,0.08),0_4px_6px_-2px_rgba(16,24,40,0.03),0_24px_48px_-12px_rgba(16,24,40,0.18)] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${
        closing ? "translate-x-[calc(100%+24px)]" : ""
      }`}
    >
      <div className="flex shrink-0 flex-col gap-4">
        <div className="relative flex flex-col gap-6 px-8 pt-16">
          <div className="absolute inset-x-4 top-4 flex items-center justify-between text-grey-600">
            <button type="button" aria-label="Open full page" onClick={onExpand} className="hover:text-grey-700">
              <Maximize size={20} />
            </button>
            <div className="flex items-center gap-6">
              <OverflowMenuHorizontal size={24} />
              <button type="button" aria-label="Close request" onClick={close} className="hover:text-grey-700">
                <Close size={24} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium leading-[1.4] text-brand">{request.number}</p>
            <div className="flex items-center justify-between gap-4">
              <h2 className="max-w-[282px] text-2xl font-bold leading-[1.2] text-grey-700">{REQUEST_TITLE}</h2>
              <PriceTag />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusChip done={!!request.done} />
            <PriorityChip />
          </div>
          <Justification clamp={!expandedText} onMore={() => setExpandedText(true)} />
        </div>

        <div className="flex justify-between border-b border-grey-300 px-8">
          {TABS.map((t) => {
            const enabled = t === "Progress" || t === "Details";
            return (
              <button
                key={t}
                type="button"
                disabled={!enabled}
                onClick={() => setTab(t)}
                className={`py-2 pr-6 text-xs leading-[1.4] disabled:cursor-default ${
                  tab === t ? "border-b-4 border-brand font-bold text-grey-600" : "font-medium text-grey-500"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div className="fx-scrollbar min-h-0 flex-1 overflow-y-auto p-8">
        {tab === "Progress" ? (
          <div key="progress" className="fx-fade-in flex flex-col gap-[25px]">
            <ProgressBar steps={steps} />
            <ProgressTimeline steps={steps} />
          </div>
        ) : (
          <div key="details" className="fx-fade-in">
            <RequestDetails preassigned={request.preassigned} done={request.done} />
          </div>
        )}
      </div>
    </aside>
  );
}
