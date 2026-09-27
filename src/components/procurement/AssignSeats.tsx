"use client";

import { useState } from "react";
import { ChevronDown, Search } from "@carbon/icons-react";
import { OTHER_MEMBERS, RECOMMENDED_MEMBERS, RUNWAY_SEATS, type Member } from "./data";
import MemberAvatar from "./MemberAvatar";

const matches = (m: Member, q: string) =>
  [m.name, m.role ?? "", m.email].some((field) => field.toLowerCase().includes(q));

export default function AssignSeats({
  selected,
  onChange,
  onGiveAccess,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
  onGiveAccess: () => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState({ recommended: true, others: true });

  const q = query.trim().toLowerCase();
  const recommended = RECOMMENDED_MEMBERS.filter((m) => matches(m, q));
  const others = OTHER_MEMBERS.filter((m) => matches(m, q));
  // Over-assigning is allowed for now; its warning state is still to be designed.
  const seatsLeft = Math.max(0, RUNWAY_SEATS - selected.length);

  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-grey-200 bg-white p-4">
      <div className="flex items-center justify-between font-medium leading-normal">
        <p className="text-base text-grey-700">
          Assign Runway seats <span className="text-grey-450">({seatsLeft} seats left)</span>
        </p>
        <button
          type="button"
          onClick={() => onChange([])}
          disabled={selected.length === 0}
          className="text-sm text-[#545454] hover:text-grey-700 disabled:opacity-50"
        >
          Clear selection
        </button>
      </div>

      <label className="flex h-12 items-center gap-2 rounded border border-grey-300 bg-white px-3 focus-within:border-grey-450">
        <Search size={14} className="shrink-0 text-grey-600" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for team members"
          className="flex-1 bg-transparent text-base font-medium text-grey-600 outline-none placeholder:text-grey-400"
        />
      </label>

      <div className="flex h-[356px] flex-col overflow-hidden rounded border border-grey-300 bg-white shadow-[0_12px_16px_-4px_rgba(16,24,40,0.08),0_4px_6px_-2px_rgba(16,24,40,0.03)]">
        <div className="fx-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-2">
          {recommended.length > 0 && (
            <Group
              label="Recommended team members"
              open={open.recommended}
              onToggle={() => setOpen((o) => ({ ...o, recommended: !o.recommended }))}
            >
              <div className="flex flex-col gap-0.5">
                {recommended.map((m) => {
                  const isSelected = selected.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => toggle(m.id)}
                      className={`flex items-center gap-2 rounded border-b border-grey-200 p-2 text-left transition-colors ${
                        isSelected ? "bg-brand-tint" : "hover:bg-grey-100"
                      }`}
                    >
                      <MemberAvatar member={m} />
                      <span className="flex flex-col font-medium">
                        <span className="text-sm leading-normal text-grey-700">{m.name}</span>
                        <span className={`text-xs leading-[1.4] ${isSelected ? "text-[#658676]" : "text-grey-450"}`}>
                          {m.role}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </Group>
          )}

          {others.length > 0 && (
            <Group
              label="Others"
              open={open.others}
              onToggle={() => setOpen((o) => ({ ...o, others: !o.others }))}
              bordered
            >
              <div className="flex flex-col">
                {others.map((m) => {
                  const isSelected = selected.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => toggle(m.id)}
                      className={`flex items-center gap-1 rounded p-2 text-left text-base font-medium leading-normal transition-colors ${
                        isSelected ? "bg-brand-tint" : "hover:bg-grey-100"
                      }`}
                    >
                      <span className="text-grey-700">{m.name}</span>
                      <span className="truncate text-grey-450">{m.email}</span>
                    </button>
                  );
                })}
              </div>
            </Group>
          )}

          {recommended.length === 0 && others.length === 0 && (
            <p className="py-6 text-center text-sm font-medium text-grey-450">No team members match “{query}”</p>
          )}
        </div>

        {selected.length > 0 && (
          <div className="border-t border-grey-300 bg-white p-4">
            <button
              type="button"
              onClick={onGiveAccess}
              className="fx-fade-up w-full rounded bg-brand px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Give access ({selected.length} selected)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Group({
  label,
  open,
  onToggle,
  bordered = false,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  bordered?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className={`flex items-center gap-1 py-2 text-xs font-semibold leading-[1.4] text-grey-700 ${
          bordered ? "border-b border-grey-300" : ""
        }`}
      >
        {label}
        <ChevronDown size={14} className={`transition-transform ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && children}
    </div>
  );
}
