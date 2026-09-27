import { ArrowUpRight, CheckmarkFilled, Edit, InProgress, Notification } from "@carbon/icons-react";
import {
  APPROVER_PHOTO,
  EXTRA_SEATS,
  JUSTIFICATION,
  LICENSE_LOG,
  SEAT_PRICE,
  type ProcessApprover,
  type Member,
  type ProgressStep,
} from "./data";
import MemberAvatar from "./MemberAvatar";

const APPROVER_STYLES: Record<ProcessApprover, { soft: string; strong: string }> = {
  "Dwayne Smith": { soft: "bg-[#f4f3ff] border-[#d9d6fe] text-[#5925dc]", strong: "bg-[#ebe9fe] border-[#d9d6fe] text-[#5925dc]" },
  "Nina Plath": { soft: "bg-[#fff6ed] border-[#fddcab] text-[#c4320a]", strong: "bg-[#ffead5] border-[#fddcab] text-[#c4320a]" },
};

export function ApproverChip({ name, strong = false }: { name: ProcessApprover; strong?: boolean }) {
  const styles = APPROVER_STYLES[name];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[32px] border px-1.5 text-xs font-semibold leading-[1.4] ${
        strong ? `py-[3px] ${styles.strong}` : `py-1 ${styles.soft}`
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={APPROVER_PHOTO} alt="" width={16} height={16} className="size-[15px] rounded-full" />
      {name}
    </span>
  );
}

export function MediumIcon({ size = 16 }: { size?: number }) {
  // Signal bars: two of three lit for "Medium".
  const bar = (h: number, lit: boolean) => (
    <span className={`w-[3px] rounded-sm ${lit ? "bg-[#fd853a]" : "bg-[#fddcab]"}`} style={{ height: h }} />
  );
  return (
    <span className="flex items-end justify-center gap-[2px]" style={{ width: size, height: size }}>
      {bar(size * 0.35, true)}
      {bar(size * 0.6, true)}
      {bar(size * 0.85, false)}
    </span>
  );
}

export function PriorityChip({ large = false }: { large?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-3xl border border-[#fedf89] bg-[#fffaeb] px-3 py-1.5 font-semibold text-[#b54708] ${
        large ? "text-base font-bold leading-normal" : "text-xs leading-[1.4]"
      }`}
    >
      <MediumIcon size={large ? 20 : 14} />
      Medium
    </span>
  );
}

export function StatusChip({ done }: { done: boolean }) {
  return done ? (
    <span className="inline-flex rounded-3xl border border-[#84caff] bg-[#d1e9ff] px-3 py-1.5 text-xs font-semibold leading-[1.4] text-[#175cd3]">
      Implemented
    </span>
  ) : (
    <span className="inline-flex rounded-3xl border border-[#fedf89] bg-[#fef0c7] px-3 py-1.5 text-xs font-semibold leading-[1.4] text-[#b54708]">
      Pending Approval
    </span>
  );
}

export function PriceTag({ amount = EXTRA_SEATS * SEAT_PRICE }: { amount?: number }) {
  return (
    <span
      className="inline-flex h-[42px] shrink-0 items-center bg-grey-100 pl-3 pr-7 text-2xl font-bold leading-[1.2] text-brand"
      style={{ clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)", borderRadius: 6 }}
    >
      ${amount}
    </span>
  );
}

export function Justification({ clamp = false, onMore }: { clamp?: boolean; onMore?: () => void }) {
  return (
    <p className="text-base font-medium leading-normal text-grey-700">
      {JUSTIFICATION.before}
      <b>{JUSTIFICATION.bold}</b>
      {clamp ? (
        <>
          {" This powerful tool will be.. "}
          <button type="button" onClick={onMore} className="font-bold text-brand hover:underline">
            see more
          </button>
        </>
      ) : (
        JUSTIFICATION.after
      )}
    </p>
  );
}

export function EditLink() {
  return (
    <span className="flex items-center gap-2 text-xs font-medium leading-[1.4] text-grey-400">
      <Edit size={14} /> Edit
    </span>
  );
}

export function ProgressBar({ steps, small = false }: { steps: ProgressStep[]; small?: boolean }) {
  const pct = Math.round((steps.filter((s) => s.status === "done").length / steps.length) * 100);
  const shown = pct === 20 ? 25 : pct; // the design rounds one finished step of five up to 25%
  return (
    <div
      className={`relative flex flex-1 items-center justify-end overflow-hidden rounded-3xl border border-grey-200 bg-grey-50 px-2 ${
        small ? "py-0.5" : "py-1"
      }`}
    >
      <span className="absolute inset-y-0 left-0 bg-[#039855] transition-[width] duration-700" style={{ width: `${shown}%` }} />
      <span
        className={`relative font-semibold leading-[1.4] ${small ? "text-[10px]" : "text-xs"} ${
          shown === 100 ? "text-white" : "text-brand"
        }`}
      >
        {shown}% complete
      </span>
    </div>
  );
}

export function ProgressTimeline({ steps }: { steps: ProgressStep[] }) {
  return (
    <ol className="flex flex-col gap-6">
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={step.title} className="relative flex gap-6">
            {!last && (
              <span
                className={`absolute left-[11px] top-8 -bottom-6 border-l-2 ${
                  step.status === "done" ? "border-[#039855]" : "border-dashed border-grey-300"
                }`}
              />
            )}
            <span className="relative flex py-1">
              {step.status === "done" && <CheckmarkFilled size={24} className="text-[#039855]" />}
              {step.status === "active" && <InProgress size={24} className="text-[#039855]" />}
              {step.status === "todo" && <span className="size-6 rounded-full border-2 border-grey-300 bg-grey-50" />}
            </span>
            <div className={`flex min-w-0 flex-1 flex-col gap-3 ${step.status === "todo" ? "opacity-30" : ""}`}>
              <div className="flex flex-col">
                <div className="flex items-center justify-between py-1">
                  <p className="text-base font-bold leading-normal text-grey-700">{step.title}</p>
                  {step.followUp && (
                    <span className="flex items-center gap-2 text-xs font-semibold leading-[1.4] text-brand">
                      <Notification size={14} /> Follow up
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium leading-[1.4] text-grey-500">{step.note}</p>
              </div>
              <div className="flex items-center gap-2">
                <ApproverChip name={step.approver} />
                {step.duration && <span className="text-xs font-semibold leading-[1.4] text-grey-450">{step.duration}</span>}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Section({ title, children, edit = true }: { title: string; children: React.ReactNode; edit?: boolean }) {
  return (
    <section className="flex min-w-0 flex-1 flex-col gap-2">
      <div className="flex items-center justify-between border-b border-grey-300 pb-2">
        <p className="text-sm font-bold leading-normal text-grey-700">{title}</p>
        {edit && <EditLink />}
      </div>
      {children}
    </section>
  );
}

function Row({ label, children, alignEnd = false }: { label: string; children: React.ReactNode; alignEnd?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="w-[124px] shrink-0 text-xs font-medium leading-[1.4] text-grey-450">{label}</span>
      <span className={`flex min-w-0 flex-1 px-1 py-1.5 text-base leading-normal text-grey-700 ${alignEnd ? "justify-end" : ""}`}>
        {children}
      </span>
    </div>
  );
}

export function MembersTable({ members, emptyText }: { members: Member[]; emptyText?: string }) {
  if (members.length === 0) {
    return emptyText ? (
      <p className="rounded-lg border border-dashed border-grey-300 px-4 py-5 text-center text-sm font-medium text-grey-450">
        {emptyText}
      </p>
    ) : null;
  }
  return (
    <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-lg border border-grey-200 bg-white text-left">
      <thead>
        <tr className="bg-grey-100 text-xs font-semibold leading-[1.4] text-grey-700">
          <th className="w-1/2 px-3 py-2 font-semibold">User</th>
          <th className="px-3 py-2 font-semibold">Email</th>
        </tr>
      </thead>
      <tbody className="text-sm font-medium leading-normal text-grey-700">
        {members.map((m) => (
          <tr key={m.id} className="[&>td]:border-b [&>td]:border-grey-100 [&>td]:p-3 last:[&>td]:border-b-0">
            <td>
              <span className="flex items-center gap-2">
                <MemberAvatar member={m} />
                <span className="flex flex-col">
                  <span>{m.name}</span>
                  {m.role && <span className="text-xs leading-[1.4] text-grey-450">{m.role}</span>}
                </span>
              </span>
            </td>
            <td className="break-all">{m.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Requester, tool, price and pre-assigned seats: shared by the home drawer and the full request page. */
export function RequestDetails({
  preassigned,
  done = false,
  twoColumn = false,
}: {
  preassigned: Member[];
  done?: boolean;
  twoColumn?: boolean;
}) {
  const perMonth = done ? "/month" : "";
  return (
    <div className="flex flex-col gap-6">
      <div className={twoColumn ? "flex gap-6" : "flex flex-col gap-6"}>
        <Section title="Requester details">
          <Row label="Requester name">
            <span className="flex items-center gap-1.5 font-semibold text-[#026aa2]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LICENSE_LOG.owner.photo} alt="" width={24} height={24} className="rounded-full" />
              {LICENSE_LOG.owner.name}
            </span>
          </Row>
          <Row label="Department">{LICENSE_LOG.department}</Row>
          <Row label="Request date">{LICENSE_LOG.assignedDate}</Row>
          <Row label="Expected Access">July 6, 2025</Row>
        </Section>
        <Section title="Tool details">
          <Row label="Vendor">
            <span className="flex items-center gap-2 font-bold text-brand">
              Runway <ArrowUpRight size={16} />
            </span>
          </Row>
          <Row label="License type">Enterprise</Row>
          <Row label="Renewal period">Monthly</Row>
        </Section>
      </div>
      <Section title="Price details">
        <Row label="Price per seat" alignEnd>
          ${SEAT_PRICE}
          {perMonth}
        </Row>
        <Row label="Seats requested" alignEnd>
          {EXTRA_SEATS}
        </Row>
        <hr className="border-dashed border-grey-300" />
        <Row label="Total price" alignEnd>
          <b>
            ${EXTRA_SEATS * SEAT_PRICE}
            {perMonth}
          </b>
        </Row>
      </Section>
      <Section title="Pre-assign seats to" edit={!done}>
        <MembersTable members={preassigned} emptyText="No team members were pre-assigned to these seats." />
      </Section>
    </div>
  );
}
