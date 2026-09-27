"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Checkmark, ChevronLeft } from "@carbon/icons-react";
import {
  FOLLOW_UPS,
  PRODUCTS,
  QUESTIONS,
  THINKING_SECONDS,
  THINKING_STEP_MS,
  THINKING_STEPS,
  type Product,
} from "./data";
import FluxbyMark from "./FluxbyMark";

export type Answers = Record<string, { selected: string[]; other: boolean; otherText: string }>;

export const emptyAnswers = (): Answers =>
  Object.fromEntries(QUESTIONS.map((q) => [q.id, { selected: [], other: false, otherText: "" }]));

// A rail anchor is either a whole conversation turn (scrolled flush to the top)
// or a heading inside a turn (scrolled to sit below that turn's sticky header).
export type Anchor = { id: string; label: string; turn: boolean };

export const TABS = ["Chat", "Steps", "Sources"];

export function Turn({
  id,
  title,
  tabs,
  last,
  onBack,
  children,
}: {
  id: string;
  title: string;
  tabs: string[];
  last: boolean;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  return (
    // The latest turn fills the viewport so it can scroll flush to the top.
    <section id={id} className={last ? "min-h-[calc(100vh-190px)]" : "pb-10"}>
      <div className="sticky top-0 z-10 bg-grey-50 pt-8">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-6 flex items-center gap-1 text-sm font-medium text-grey-450 transition-colors hover:text-grey-700"
          >
            <ChevronLeft size={16} />
            Back
          </button>
        )}
        <h2 className="pb-4 text-2xl font-bold leading-[1.2] text-black">{title}</h2>
        <div className="flex border-b border-grey-300">
          {tabs.map((tab, i) => (
            <span
              key={tab}
              className={`w-16 p-2 text-center text-xs leading-[1.4] ${
                i === 0 ? "border-b-4 border-brand font-bold text-grey-600" : "font-medium text-grey-500"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>
      {children}
    </section>
  );
}

export function SectionRail({
  anchors,
  scrollRef,
}: {
  anchors: Anchor[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      let current = 0;
      anchors.forEach((a, i) => {
        const target = document.getElementById(a.id);
        if (target && i > 0 && target.getBoundingClientRect().top - el.getBoundingClientRect().top < 260) {
          current = i;
        }
      });
      setActive(current);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [anchors, scrollRef]);

  const jumpTo = useCallback(
    (i: number) => {
      const el = scrollRef.current;
      const target = document.getElementById(anchors[i].id);
      if (!el || !target) return;
      const offset = anchors[i].turn ? 0 : 200;
      const top = el.scrollTop + target.getBoundingClientRect().top - el.getBoundingClientRect().top - offset;
      el.scrollTo({ top: i === 0 ? 0 : top, behavior: "smooth" });
    },
    [anchors, scrollRef],
  );

  return (
    <div className="group absolute left-4 top-[106px] z-20">
      <div className="flex flex-col gap-4 py-2">
        {anchors.map((a, i) => (
          <span
            key={a.id}
            className={`block h-[3px] rounded-full transition-all ${
              i === active ? "w-5 bg-brand" : "w-3.5 bg-grey-300"
            }`}
          />
        ))}
      </div>
      <div className="invisible absolute -top-2 left-0 w-40 rounded-lg border border-grey-200 bg-white p-4 opacity-0 shadow-[0_8px_24px_rgba(0,26,15,0.12)] transition-opacity group-hover:visible group-hover:opacity-100">
        <ul className="flex flex-col gap-3">
          {anchors.map((a, i) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => jumpTo(i)}
                className={`line-clamp-3 w-full rounded text-left text-sm leading-[1.4] ${
                  i === active ? "bg-grey-50 p-1 font-medium text-brand" : "pl-4 pr-1 text-grey-500 hover:text-grey-700"
                }`}
              >
                {a.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function OptionCheckbox({ checked }: { checked: boolean }) {
  return (
    <span className="p-1">
      <span
        className={`flex size-4 items-center justify-center rounded border ${
          checked ? "border-grey-600 bg-brand text-white" : "border-[#d0d5dd] bg-white"
        }`}
      >
        {checked && <Checkmark size={12} />}
      </span>
    </span>
  );
}

export function optionClass(checked: boolean) {
  return `flex cursor-pointer items-start gap-3 rounded border p-2 text-sm font-medium leading-normal transition-colors ${
    checked
      ? "border-brand-tint-border bg-brand-tint text-grey-700"
      : "border-grey-200 bg-white text-grey-600 hover:border-grey-300 hover:bg-grey-50"
  }`;
}

export function Questions({
  answers,
  setAnswers,
  onSubmit,
}: {
  answers: Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Answers>>;
  onSubmit: () => void;
}) {
  const hasAnswer = Object.values(answers).some((a) => a.selected.length > 0 || a.other);

  const toggle = (qid: string, option: string) =>
    setAnswers((prev) => {
      const selected = prev[qid].selected.includes(option)
        ? prev[qid].selected.filter((o) => o !== option)
        : [...prev[qid].selected, option];
      return { ...prev, [qid]: { ...prev[qid], selected } };
    });

  const update = (qid: string, patch: Partial<Answers[string]>) =>
    setAnswers((prev) => ({ ...prev, [qid]: { ...prev[qid], ...patch } }));

  return (
    <div className="flex flex-col gap-6 py-4">
      <p className="fx-fade-up text-base font-medium leading-normal text-grey-500">
        To recommend the best AI video generation tool with strong editing capabilities for your team, I’ll ask a
        series of clarifying questions.
      </p>

      {QUESTIONS.map((q, qi) => {
        const a = answers[q.id];
        return (
          <fieldset
            key={q.id}
            className="fx-fade-up flex flex-col gap-4 rounded-2xl border border-grey-200 bg-white p-6 focus-within:border-grey-300 hover:border-grey-300"
            style={{ animationDelay: `${150 + qi * 120}ms` }}
          >
            <legend className="float-left w-full text-base font-bold leading-normal text-grey-700">{q.title}</legend>
            <div className="grid grid-cols-2 gap-2">
              {q.options.map((option) => {
                const checked = a.selected.includes(option);
                return (
                  <label key={option} className={optionClass(checked)}>
                    <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggle(q.id, option)} />
                    <OptionCheckbox checked={checked} />
                    <span className="flex-1 py-px">{option}</span>
                  </label>
                );
              })}
              <div
                className={`col-span-2 flex flex-col gap-2 rounded border p-2 transition-colors ${
                  a.other ? "border-brand-tint-border bg-brand-tint" : "border-grey-200 hover:border-grey-300 hover:bg-grey-50"
                }`}
              >
                <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-grey-600">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={a.other}
                    onChange={() => update(q.id, { other: !a.other })}
                  />
                  <OptionCheckbox checked={a.other} />
                  Others
                </label>
                {a.other && (
                  <input
                    autoFocus
                    value={a.otherText}
                    onChange={(e) => update(q.id, { otherText: e.target.value })}
                    placeholder="Type your answer"
                    className="rounded border border-grey-300 bg-white p-2 text-sm font-medium text-grey-600 outline-none placeholder:text-grey-400 focus:border-grey-450"
                  />
                )}
              </div>
            </div>
          </fieldset>
        );
      })}

      {hasAnswer && (
        <button
          type="button"
          onClick={onSubmit}
          className="fx-fade-up flex w-full items-center justify-between rounded bg-brand p-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Submit answers
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}

export function Thinking({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < THINKING_STEPS.length - 1) setStep(step + 1);
      else onDone();
    }, THINKING_STEP_MS);
    return () => clearTimeout(timer);
  }, [step, onDone]);

  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <FluxbyMark size={18} className="animate-pulse" />
        <p key={step} className="fx-fade-up fx-shimmer truncate text-sm font-medium">
          {THINKING_STEPS[step]}
        </p>
      </div>
      <p className="shrink-0 text-xs font-medium text-grey-500">Estimated time: {THINKING_SECONDS} seconds</p>
    </div>
  );
}

export function WorkingStatus({ text, ms, onDone }: { text: string; ms: number; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, ms);
    return () => clearTimeout(timer);
  }, [ms, onDone]);

  return (
    <div className="flex items-center gap-3">
      <FluxbyMark size={18} className="animate-pulse" />
      <p className="fx-fade-up fx-shimmer text-sm font-medium">{text}</p>
    </div>
  );
}

export function ProductCard({ product, onGetAccess }: { product: Product; onGetAccess?: () => void }) {
  return (
    <article className="relative flex w-[267px] shrink-0 flex-col rounded-lg border border-grey-300 bg-white">
      {product.recommended && (
        <span className="absolute left-1/2 top-[-11px] -translate-x-1/2 rounded-3xl border border-[#c2e5d7] bg-[#e3f7ed] px-2 py-0.5 text-xs font-semibold leading-[1.4] text-brand">
          Recommended
        </span>
      )}
      <div className="flex items-center gap-4 px-4 py-[18px]">
        {product.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.logo} alt="" width={48} height={48} className="size-12 rounded-md" />
        ) : (
          <span
            className="flex size-12 items-center justify-center rounded-md text-lg font-bold text-white"
            style={{ background: product.tile?.bg }}
          >
            {product.tile?.label}
          </span>
        )}
        <div className="flex flex-col gap-0.5">
          <p className="text-2xl font-bold leading-[1.2] text-black">{product.name}</p>
          <p className="text-xs font-medium leading-[1.4] text-grey-450">{product.vendor}</p>
        </div>
      </div>
      <p className="px-4 pb-3 text-sm font-medium leading-normal text-grey-500">{product.description}</p>
      <p className="mt-auto flex items-center justify-center gap-2 border-y border-dashed border-grey-300 py-2 text-sm font-semibold text-grey-600">
        Enterprise license <span>·</span> 5 seats left
      </p>
      <div className="p-4">
        <button
          type="button"
          onClick={onGetAccess}
          disabled={!onGetAccess}
          className="block w-full rounded bg-brand px-4 py-2 text-center text-sm font-semibold text-white enabled:hover:opacity-90 disabled:cursor-default"
        >
          Get access
        </button>
      </div>
    </article>
  );
}

export function Carousel({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ width: 0, left: 0 });

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // The indicator runs inside the 24px side padding, like the design's scroll bar.
    const track = el.clientWidth - 48;
    const ratio = el.clientWidth / el.scrollWidth;
    const width = ratio >= 1 ? 0 : Math.max(ratio * track, 40);
    const maxScroll = el.scrollWidth - el.clientWidth;
    const left = maxScroll > 0 ? (el.scrollLeft / maxScroll) * (track - width) : 0;
    setThumb({ width, left });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-grey-200 bg-grey-100">
      <div
        ref={trackRef}
        onScroll={measure}
        className="flex gap-6 overflow-x-auto px-6 pb-6 pt-[35px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      {thumb.width > 0 && (
        <div className="pointer-events-none absolute inset-x-6 bottom-[7px] h-1.5">
          <span
            className="absolute h-full rounded-2xl bg-grey-400/50"
            style={{ width: thumb.width, left: thumb.left }}
          />
        </div>
      )}
    </div>
  );
}

export function Results({ onGetAccess }: { onGetAccess?: () => void }) {
  const reveal = (i: number) => ({ animationDelay: `${i * 180}ms` });

  return (
    <div className="flex flex-col gap-6 pt-6">
      <p className="fx-fade-up text-base font-medium leading-normal text-grey-600" style={reveal(0)}>
        Thanks for the details! I’ve explored my inventory for AI video tools for marketing, social content, and
        tutorials, offering editing flexibility and export options to After Effects and Premiere.
      </p>

      <section id="fx-catalogue" className="fx-fade-up flex flex-col gap-4" style={reveal(1)}>
        <h3 className="text-xl font-semibold leading-[1.2] text-grey-700">
          Product catalogue ({PRODUCTS.length} matches)
        </h3>
        <Carousel>
          {PRODUCTS.map((p) => (
            <ProductCard key={p.name} product={p} onGetAccess={p.recommended ? onGetAccess : undefined} />
          ))}
        </Carousel>
      </section>

      <section id="fx-recommendation" className="fx-fade-up flex flex-col gap-3 text-grey-600" style={reveal(2)}>
        <h3 className="text-xl font-semibold leading-[1.2] text-grey-700">Runway AI is your best choice</h3>
        <div className="flex flex-col gap-2 text-base font-medium leading-normal">
          <p>
            My recommendation is <b>Runway AI</b> based on the following factors:
          </p>
          <ul className="flex list-disc flex-col gap-2 pl-6">
            <li>
              Suited to <b>advanced motion graphics</b> and creative content (for product explainers)
            </li>
            <li>
              <b>Provides 30+ AI tools</b>: scene generation from text or storyboards, inpainting &amp; special effects
              (e.g. object removal, style transfer)
            </li>
            <li>
              <b>Highly flexible:</b> editors can intervene frame-by-frame and blend AI clips which is a high priority
              for your usecase.
            </li>
            <li>
              As it’s cloud-based, generated <b>clips can be downloaded for finishing in Premiere/After Effects.</b>
            </li>
          </ul>
          <p>It’s especially strong when you:</p>
          <ul className="flex list-disc flex-col gap-2 pl-12">
            <li>Need fast turnaround of social and tutorial videos</li>
            <li>Want to reduce dependency on stock footage</li>
            <li>Prefer flexible visual generation over rigid templates</li>
            <li>Work with a distributed team that needs collaborative editing and review</li>
          </ul>
        </div>
      </section>

      <section className="fx-fade-up flex flex-col gap-3" style={reveal(3)}>
        <p className="text-base font-medium leading-normal text-grey-600">How would you like to proceed?</p>
        <div className="flex flex-col gap-2">
          {FOLLOW_UPS.map((f, i) => {
            // Only "Request license for Runway" leads anywhere; the other follow-ups are static for now.
            const onClick = i === 0 ? onGetAccess : undefined;
            return (
              <button
                key={f}
                type="button"
                onClick={onClick}
                disabled={!onClick}
                className="flex items-center justify-between rounded bg-brand-tint p-2 text-left text-sm font-semibold text-brand transition-colors enabled:hover:bg-[#d6eae0] disabled:cursor-default"
              >
                {f}
                <ArrowRight size={16} />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
