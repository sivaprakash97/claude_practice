import { ArrowRight } from "@carbon/icons-react";
import { APPROVAL_PROCESS, EXTRA_SEATS, SEAT_PRICE } from "./data";
import { ApproverChip } from "./RequestParts";

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

function ProcessCard() {
  return (
    <div className="rounded-2xl border border-grey-200 bg-white p-6">
      <p className="border-b border-grey-300 pb-2 text-base font-bold leading-normal text-grey-700">Process (~3 weeks)</p>
      <ol className="mt-2 flex flex-col gap-8">
        {APPROVAL_PROCESS.map((step, i) => (
          <li key={step.title} className="relative flex gap-[15px]">
            {i < APPROVAL_PROCESS.length - 1 && (
              <span className="absolute -bottom-8 left-3 top-7 border-l border-grey-300" aria-hidden />
            )}
            <span className="relative flex py-1">
              <span className="flex size-6 items-center justify-center rounded-full bg-grey-200 text-sm font-semibold text-grey-700">
                {i + 1}
              </span>
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div>
                <p className="py-1 text-sm font-semibold leading-normal text-grey-700">{step.title}</p>
                <p className="text-sm font-medium leading-normal text-grey-500">{step.description}</p>
              </div>
              <p className="flex items-center gap-2 text-xs font-semibold leading-[1.4] text-grey-450">
                <ApproverChip name={step.approver} strong />
                <span>·</span>
                <span>{step.duration}</span>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ImpactCard() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-grey-200 bg-white px-[23px] py-6 text-grey-700">
      <p className="border-b border-grey-300 pb-2 text-base font-bold leading-normal">Potential Impact</p>
      <p className="flex items-center justify-between text-base font-medium leading-normal">
        Price per seat <span className="text-xl font-bold leading-[1.2]">$ {SEAT_PRICE}</span>
      </p>
      <p className="flex items-center justify-between text-base font-medium leading-normal">
        Requested number of seats <span>{EXTRA_SEATS}</span>
      </p>
      <hr className="border-dashed border-grey-300" />
      <p className="flex items-center justify-between text-base font-medium leading-normal">
        Total price <span className="text-xl font-bold leading-[1.2]">$ {EXTRA_SEATS * SEAT_PRICE}</span>
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
