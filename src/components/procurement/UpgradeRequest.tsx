"use client";

import { CheckmarkFilled } from "@carbon/icons-react";
import { EXTRA_MEMBERS, EXTRA_SEATS, LICENSE_LOG, SEAT_PRICE, type Member } from "./data";
import AssignSeats from "./AssignSeats";
import { EditLink, Justification, MembersTable, PriorityChip } from "./RequestParts";

export const UPGRADE_LABEL = "Seat upgrade request";
export const UPGRADE_DOC_TITLE = `${EXTRA_SEATS} extra Runway seats`;

const DETAIL_COLUMNS: [string, string, boolean?][] = [
  ["Tool name", "Runway", true],
  ["License type", "Enterprise"],
  ["Renewal period", "Monthly"],
  ["Seats required", String(EXTRA_SEATS)],
  ["Rate per seat", `$${SEAT_PRICE}`],
  ["Amount", `$${EXTRA_SEATS * SEAT_PRICE}/month`, true],
];

function SectionTitle({ children, edit = true }: { children: React.ReactNode; edit?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 items-center gap-2">{children}</div>
      {edit && <EditLink />}
    </div>
  );
}

export function UpgradeRequestDoc({
  number,
  pool,
  preassigned,
  onPreassign,
  submitted,
  onSubmit,
}: {
  number: string;
  /** Teammates who can still be pre-assigned one of the requested seats. */
  pool: Member[];
  preassigned: string[];
  onPreassign: (ids: string[]) => void;
  submitted: boolean;
  onSubmit: () => void;
}) {
  const chosen = pool.filter((m) => preassigned.includes(m.id));
  const recommended = pool.filter((m) => EXTRA_MEMBERS.some((e) => e.id === m.id));
  const others = pool.filter((m) => !recommended.includes(m));

  return (
    <article className="fx-fade-up mx-auto flex max-w-[742px] flex-col items-end gap-6 rounded-2xl border border-grey-200 bg-white p-8">
      <div className="flex w-full flex-col gap-6">
        <div className="flex items-center justify-between gap-6">
          <div className="flex flex-col gap-0.5">
            <p className="flex gap-2 text-xs font-medium leading-[1.4] text-grey-500">
              <span>Seat Upgrade Request</span>
              <span>{number}</span>
            </p>
            <h2 className="text-2xl font-bold leading-[1.2] text-grey-700">{UPGRADE_DOC_TITLE}</h2>
          </div>
          {submitted && (
            <span className="fx-fade-up rounded-3xl border border-[#fedf89] bg-[#fffaeb] px-3 py-1 text-base font-medium leading-normal text-[#b54708]">
              Pending Approval · 0/2
            </span>
          )}
        </div>

        <hr className="border-grey-200" />

        <section className="flex flex-col gap-3.5">
          <SectionTitle>
            <h3 className="text-xl font-bold leading-[1.2] text-grey-700">Seat upgrade details</h3>
          </SectionTitle>
          <div className="grid grid-cols-6 overflow-hidden rounded-lg border border-grey-200">
            {DETAIL_COLUMNS.map(([label, value, bold], i) => (
              <div key={label} className={`flex flex-col ${i < DETAIL_COLUMNS.length - 1 ? "border-r border-grey-200" : ""}`}>
                <span className="bg-grey-50 p-2 text-xs font-medium leading-[1.4] text-grey-500">{label}</span>
                <span className={`px-2 py-3 text-sm leading-normal text-grey-700 ${bold ? "font-bold" : "font-medium"}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-grey-200" />

        <section className="flex flex-wrap items-start justify-between gap-4">
          <Field label="Requester name">
            <span className="inline-flex items-center gap-1.5 rounded-3xl border border-[#b9e6fe] bg-[#f0f9ff] py-1.5 pl-1.5 pr-3 text-base font-semibold leading-normal text-[#065986]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LICENSE_LOG.owner.photo} alt="" width={24} height={24} className="rounded-full" />
              {LICENSE_LOG.owner.name}
            </span>
          </Field>
          <Field label="Requester dept">
            <span className="py-1.5 text-base font-bold leading-normal text-grey-700">{LICENSE_LOG.department}</span>
          </Field>
          <Field label="Request date">
            <span className="py-1.5 text-base font-bold leading-normal text-grey-700">{LICENSE_LOG.assignedDate}</span>
          </Field>
          <Field label="Priority">
            <PriorityChip large />
          </Field>
        </section>

        <hr className="border-grey-200" />

        <section className="flex flex-col gap-3.5">
          <SectionTitle>
            <h3 className="text-xl font-bold leading-[1.2] text-grey-700">Justification</h3>
          </SectionTitle>
          <Justification />
        </section>

        <hr className="border-grey-200" />

        <section className="flex flex-col gap-4">
          <SectionTitle edit={false}>
            <h3 className="text-xl font-bold leading-[1.2] text-grey-700">Pre-assign seats</h3>
            <span className="text-base font-medium leading-normal text-grey-400">(optional)</span>
            {!submitted && (
              <span className="ml-auto text-sm font-medium text-grey-450">
                {EXTRA_SEATS - chosen.length} of {EXTRA_SEATS} seats open
              </span>
            )}
          </SectionTitle>
          {!submitted && (
            <AssignSeats
              bare
              selected={preassigned}
              onChange={onPreassign}
              limit={EXTRA_SEATS}
              recommended={recommended}
              others={others}
            />
          )}
          <MembersTable
            members={chosen}
            emptyText={
              submitted
                ? "No team members were pre-assigned to these seats."
                : "Choose who should get these seats automatically once the request is approved."
            }
          />
        </section>

        <hr className="border-grey-200" />
      </div>

      {!submitted && (
        <button
          type="button"
          onClick={onSubmit}
          className="rounded bg-brand px-10 py-3 text-base font-bold leading-normal text-white transition-opacity hover:opacity-90"
        >
          Submit request
        </button>
      )}
    </article>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <span className="text-xs font-semibold leading-[1.4] text-grey-500">{label}</span>
      {children}
    </div>
  );
}

export function SubmittedModal({
  number,
  onHome,
  onStay,
}: {
  number: string;
  onHome: () => void;
  onStay: () => void;
}) {
  return (
    <div className="fx-fade-in fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-[6px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="fx-submitted-title"
        className="fx-pop-in flex w-[404px] flex-col items-center gap-6 rounded-2xl bg-white p-6 shadow-[0_12px_8px_rgba(16,24,40,0.08),0_4px_3px_rgba(16,24,40,0.03),0_24px_48px_-12px_rgba(16,24,40,0.18)]"
      >
        <div className="flex items-center gap-2">
          <CheckmarkFilled size={24} className="text-brand" />
          <h2 id="fx-submitted-title" className="text-xl font-semibold leading-[1.2] text-[#33312e]">
            Request submitted successfully
          </h2>
        </div>
        <p className="text-base font-medium leading-normal text-[#33312e]">
          Your Seat Upgrade Request <span className="text-brand">{number}</span> has been successfully created and sent
          for approval.
        </p>
        <div className="flex w-full flex-col gap-2">
          <button
            type="button"
            onClick={onHome}
            className="w-full rounded bg-brand px-10 py-3 text-base font-medium leading-normal text-white transition-opacity hover:opacity-90"
          >
            Back to home
          </button>
          <button
            type="button"
            onClick={onStay}
            className="w-full rounded bg-grey-200 px-4 py-3 text-base font-medium leading-normal text-grey-700 transition-colors hover:bg-grey-300"
          >
            Stay on this page
          </button>
        </div>
      </div>
    </div>
  );
}
