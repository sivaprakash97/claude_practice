"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "@carbon/icons-react";
import { APPROVAL_PROCESS, EXTRA_SEATS, SEAT_PRICE } from "./data";
import { ApproverChip } from "./RequestParts";

/** True once the element has scrolled into view, so reveals play when they can actually be seen. */
function useInView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, threshold]);
  return [ref, inView] as const;
}

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

/** Fades and lifts children in once `show` turns true, after `delay` ms. */
function reveal(show: boolean, delay: number, distance = 8): React.CSSProperties {
  return {
    opacity: show ? 1 : 0,
    transform: show ? "none" : `translateY(${distance}px)`,
    transition: `opacity 450ms ${EASE} ${delay}ms, transform 450ms ${EASE} ${delay}ms`,
  };
}

const DIGIT_LOOPS = 3;

/**
 * Cash-counter style number: every digit spins through 0–9 before landing on its value,
 * the rightmost digits spinning a little longer, like a cash counter settling.
 */
function RollingNumber({ value, start }: { value: number; start: boolean }) {
  const digits = String(value).split("");
  return (
    <span className="inline-flex tabular-nums" aria-label={String(value)}>
      {digits.map((d, i) => {
        const target = (DIGIT_LOOPS - 1) * 10 + Number(d);
        const fromRight = digits.length - 1 - i;
        const duration = 450 + fromRight * 120;
        return (
          <span key={i} aria-hidden className="relative inline-block h-[1.2em] overflow-hidden leading-[1.2]">
            <span
              className="flex flex-col motion-reduce:!transition-none"
              style={{
                transform: `translateY(-${start ? target * 1.2 : 0}em)`,
                transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 30}ms`,
              }}
            >
              {Array.from({ length: DIGIT_LOOPS * 10 }, (_, n) => (
                <span key={n} className="h-[1.2em]">
                  {n % 10}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}

function Citation({ n }: { n: number }) {
  return (
    <span className="mx-1 inline-flex h-4 w-6 translate-y-[-1px] items-center justify-center rounded-lg bg-grey-300 align-middle text-[10px] font-medium text-black">
      {n}
    </span>
  );
}

/**
 * Suggested replies. Once one is picked the list locks and keeps the choice highlighted;
 * options without a handler stay static.
 */
export function OptionList({
  options,
  enabled,
  chosen,
  onPick,
}: {
  options: string[];
  /** Indexes of the options that lead somewhere. */
  enabled: number[];
  chosen?: number;
  onPick: (index: number) => void;
}) {
  const locked = chosen !== undefined;
  return (
    <div className="flex flex-col gap-2">
      {options.map((option, i) => {
        const active = !locked && enabled.includes(i);
        const picked = chosen === i;
        return (
          <button
            key={option}
            type="button"
            disabled={!active}
            onClick={() => onPick(i)}
            className={`flex items-center justify-between gap-4 rounded p-2 text-left text-sm font-semibold leading-normal transition-colors disabled:cursor-default ${
              picked ? "bg-[#d6eae0] text-brand" : "bg-grey-200 text-grey-600"
            } ${active ? "hover:bg-[#d6eae0] hover:text-brand" : ""} ${locked && !picked ? "opacity-60" : ""}`}
          >
            {option}
            <ArrowRight size={16} className="shrink-0" />
          </button>
        );
      })}
    </div>
  );
}

// Each approval step lands in turn; its approver chip pops in just after.
const STEP_GAP_MS = 380;

function ProcessCard() {
  const [ref, inView] = useInView<HTMLDivElement>(0.2);
  return (
    <div ref={ref} className="rounded-2xl border border-grey-200 bg-white p-6">
      <p className="border-b border-grey-300 pb-2 text-base font-bold leading-normal text-grey-700">Process (~3 weeks)</p>
      <ol className="mt-2 flex flex-col gap-8">
        {APPROVAL_PROCESS.map((step, i) => {
          const at = i * STEP_GAP_MS;
          return (
            <li key={step.title} className="relative flex gap-[15px]">
              {i < APPROVAL_PROCESS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -bottom-8 left-3 top-7 origin-top border-l border-grey-300"
                  style={{
                    transform: inView ? "scaleY(1)" : "scaleY(0)",
                    transition: `transform ${STEP_GAP_MS}ms ease-in-out ${at + 200}ms`,
                  }}
                />
              )}
              <span className="relative flex py-1" style={reveal(inView, at, 0)}>
                <span className="flex size-6 items-center justify-center rounded-full bg-grey-200 text-sm font-semibold text-grey-700">
                  {i + 1}
                </span>
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div style={reveal(inView, at)}>
                  <p className="py-1 text-sm font-semibold leading-normal text-grey-700">{step.title}</p>
                  <p className="text-sm font-medium leading-normal text-grey-500">{step.description}</p>
                </div>
                <p
                  className="flex items-center gap-2 text-xs font-semibold leading-[1.4] text-grey-450"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "none" : "scale(0.85) translateX(-6px)",
                    transformOrigin: "left center",
                    transition: `opacity 350ms ${EASE} ${at + 180}ms, transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1) ${at + 180}ms`,
                  }}
                >
                  <ApproverChip name={step.approver} strong />
                  <span>·</span>
                  <span>{step.duration}</span>
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ImpactCard() {
  const [ref, inView] = useInView<HTMLDivElement>(0.5);
  return (
    <div
      ref={ref}
      className="flex flex-col gap-4 rounded-2xl border border-grey-200 bg-white px-[23px] py-6 text-grey-700"
    >
      <p className="border-b border-grey-300 pb-2 text-base font-bold leading-normal">Potential Impact</p>
      <p className="flex items-center justify-between text-base font-medium leading-normal">
        Price per seat
        <span className="text-xl font-bold leading-[1.2]">
          $ <RollingNumber value={SEAT_PRICE} start={inView} />
        </span>
      </p>
      <p className="flex items-center justify-between text-base font-medium leading-normal">
        Requested number of seats <RollingNumber value={EXTRA_SEATS} start={inView} />
      </p>
      <hr className="border-dashed border-grey-300" />
      <p className="flex items-center justify-between text-base font-medium leading-normal">
        Total price
        <span className="text-xl font-bold leading-[1.2]">
          $ <RollingNumber value={EXTRA_SEATS * SEAT_PRICE} start={inView} />
        </span>
      </p>
    </div>
  );
}

/** Desktop 57: why only 5 seats are left, what getting more involves, and how to proceed. */
export function MoreSeatsAnswer({ options }: { options: React.ReactNode }) {
  const reveal = (i: number) => ({ animationDelay: `${i * 160}ms` });
  return (
    <div className="flex flex-col gap-6 py-4 text-base font-medium leading-normal text-grey-600">
      <p className="fx-fade-up" style={reveal(0)}>
        Correct, only 5 seats remain for Runway. The license was{" "}
        <b className="text-grey-700">initially bought for 10 seats on 15th Jan 2025</b> out of which 5 seats were given
        access to the marketing team on 16th Jan 2025.
        <Citation n={3} />
      </p>

      <section className="fx-fade-up flex flex-col gap-3" style={reveal(1)}>
        <h3 className="text-xl font-semibold leading-[1.2] text-grey-700">Process for getting 5 extra seats</h3>
        <p>
          I can process 5 extra seats for your team. This will be treated as a seat upgrade request, which will trigger
          an approval process.
        </p>
        <ProcessCard />
        <ImpactCard />
      </section>

      <div className="fx-fade-up flex flex-col gap-4" style={reveal(2)}>
        <p className="font-bold">
          This request may incur an estimated additional cost of $750/month from your team’s budget.
          <Citation n={2} />
        </p>
        <p>
          Approval may take up approximately between 2 to 4 weeks based on urgency. But If you request 5 or fewer for
          now, you’ll get access instantly.
        </p>
      </div>

      <section className="fx-fade-up flex flex-col gap-4" style={reveal(3)}>
        <h3 className="text-xl font-semibold leading-[1.2] text-grey-700">How would you like to proceed?</h3>
        {options}
      </section>
    </div>
  );
}
