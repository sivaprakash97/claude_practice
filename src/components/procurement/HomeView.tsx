"use client";

import { useRef, useState } from "react";
import {
  ArrowRight,
  Attachment,
  CurrencyDollar,
  DocumentMultiple_01,
  Idea,
  License,
  NotificationNew,
  Pen,
  Search,
  Time,
} from "@carbon/icons-react";
import type { CarbonIconType } from "@carbon/icons-react";
import { BASE_PROMPT, FLOW_PROMPT, SUGGESTIONS, type SeatRequest } from "./data";
import FluxbyMark from "./FluxbyMark";
import RequestsTable from "./RequestsTable";

const QUICK_ACTIONS: { label: string; icon: CarbonIconType }[] = [
  { label: "Track My Approvals", icon: Search },
  { label: "View Budget Summary", icon: CurrencyDollar },
  { label: "Submit Expense Reports", icon: DocumentMultiple_01 },
  { label: "Manage my Licenses", icon: License },
];

const MODES: { label: string; icon: CarbonIconType }[] = [
  { label: "Ask", icon: Idea },
  { label: "Research", icon: Search },
  { label: "Create", icon: Pen },
];

const normalize = (s: string) => s.replace(/[’‘]/g, "'").replace(/\s+/g, " ").trim().toLowerCase();

export default function HomeView({
  onStartResearch,
  requests,
  onOpenRequest,
}: {
  onStartResearch: () => void;
  requests: SeatRequest[];
  onOpenRequest: (number: string) => void;
}) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const showSuggestions = open && text.trim().length > 0;

  const choose = (index: number) => {
    if (SUGGESTIONS[index].hasFlow) {
      onStartResearch();
      return;
    }
    // Only the first suggestion has a designed flow; the others just fill the box.
    setText(`${BASE_PROMPT} ${SUGGESTIONS[index].suffix}`);
    setOpen(false);
    inputRef.current?.focus();
  };

  const submit = () => {
    if (normalize(text) === normalize(FLOW_PROMPT)) {
      onStartResearch();
    } else if (text.trim()) {
      setOpen(true);
      inputRef.current?.focus();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions && e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % SUGGESTIONS.length);
    } else if (showSuggestions && e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + SUGGESTIONS.length) % SUGGESTIONS.length);
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (showSuggestions) choose(highlight);
      else submit();
    }
  };

  return (
    <div className="flex h-screen min-w-0 flex-1 flex-col">
      <header className="flex h-[54px] shrink-0 items-center justify-between border-b border-grey-200 bg-white px-8">
        <p className="text-base font-bold text-grey-700">Good evening, Amar!</p>
        <div className="flex items-center gap-6">
          <span className="relative">
            <NotificationNew size={24} className="text-grey-600" />
            <span className="absolute right-0.5 top-0.5 size-1.5 rounded-full bg-[#f04438]" />
          </span>
          <span className="rounded bg-grey-700 px-4 py-[5px] text-base font-semibold text-white">Request</span>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col gap-[42px] px-8 pb-5 pt-[34px]">
        <div className="flex items-start gap-16">
          <section className="flex min-w-0 flex-[682] flex-col gap-4">
            <div className="flex items-center gap-2">
              <FluxbyMark size={28} />
              <h1 className="flex-1 text-2xl font-semibold leading-[1.2] text-black">Ask Fluxby AI anything</h1>
              <span className="flex items-center gap-2 p-2 text-sm font-medium text-grey-500">
                <Time size={16} />
                Chat History
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="relative">
                <div
                  className="flex cursor-text flex-col gap-[30px] rounded-lg border border-grey-300 bg-white p-3 focus-within:border-grey-450"
                  onClick={() => inputRef.current?.focus()}
                >
                  <textarea
                    ref={inputRef}
                    rows={2}
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value);
                      setOpen(true);
                      setHighlight(0);
                    }}
                    onFocus={() => {
                    // For the demo, clicking the empty box types the start of the designed question.
                    if (!text) setText(BASE_PROMPT);
                    setOpen(true);
                  }}
                    onBlur={() => setOpen(false)}
                    onKeyDown={onKeyDown}
                    placeholder="Research any tool or service, and get a thorough report .."
                    className="w-full resize-none bg-transparent text-base font-medium leading-normal text-grey-600 outline-none placeholder:text-grey-400"
                  />
                  <div className="flex items-end justify-between">
                    <div className="flex items-center gap-1 rounded bg-[#edecee] p-1">
                      {MODES.map(({ label, icon: Icon }) => (
                        <span
                          key={label}
                          className={`flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-xs font-medium leading-[1.4] ${
                            label === "Research" ? "bg-white text-grey-600" : "text-grey-450"
                          }`}
                        >
                          <Icon size={12} />
                          {label}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex size-8 items-center justify-center text-grey-500">
                        <Attachment size={16} />
                      </span>
                      <button
                        type="button"
                        aria-label="Send"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={submit}
                        className="rounded bg-brand p-2 text-white transition-opacity hover:opacity-90"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {showSuggestions && (
                  <ul className="absolute inset-x-0 top-[calc(100%+6px)] z-20 flex flex-col gap-1 rounded-lg border border-grey-200 bg-white p-2 shadow-[0_8px_24px_rgba(0,26,15,0.12)]">
                    {SUGGESTIONS.map((s, i) => (
                      <li key={s.suffix}>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onMouseEnter={() => setHighlight(i)}
                          onClick={() => choose(i)}
                          className={`w-full rounded px-2 py-1.5 text-left text-base text-grey-600 ${
                            highlight === i ? "bg-grey-100" : ""
                          }`}
                        >
                          {BASE_PROMPT} <span className="font-bold text-grey-700">{s.suffix}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <p className="text-xs font-medium leading-[1.4] text-grey-600 opacity-60">
                For research, you’ll be asked some follow-up questions to get the best results
              </p>
            </div>
          </section>

          <section className="flex min-w-0 flex-[446] flex-col gap-4">
            <h2 className="h-9 text-xl font-semibold leading-[1.2] text-grey-500">Quick actions</h2>
            <div className="grid h-[140px] grid-cols-2 gap-2">
              {QUICK_ACTIONS.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex flex-col justify-center gap-2 rounded-lg bg-grey-200 px-4 py-2 text-sm font-medium text-black"
                >
                  <Icon size={14} />
                  {label}
                </div>
              ))}
            </div>
          </section>
        </div>

        <RequestsTable created={requests} onOpen={onOpenRequest} />
      </main>
    </div>
  );
}
