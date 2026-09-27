import { Close, DocumentDownload, Edit, Share } from "@carbon/icons-react";
import { LICENSE_LOG, type Member } from "./data";
import MemberAvatar from "./MemberAvatar";

const LOG_LABEL = "License assignment log";

export const assignedTitle = (count: number) =>
  `Runway seats assigned to ${count} ${count === 1 ? "member" : "members"}`;

export function LicenseLogCard({
  count,
  active,
  onOpen,
}: {
  count: number;
  active: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`relative flex w-full flex-col gap-1 overflow-hidden rounded-2xl border bg-grey-100 p-4 pr-[144px] text-left transition-colors ${
        active ? "border-[#2aa873]" : "border-grey-300 hover:border-grey-400"
      }`}
    >
      <span className="text-xs font-medium leading-[1.4] text-grey-450">{LOG_LABEL}</span>
      <span className="text-base font-semibold leading-[1.3] text-grey-700">{assignedTitle(count)}</span>
      <span className="absolute right-[15px] top-[15px] h-[122px] w-28 rounded-lg border border-grey-300 bg-gradient-to-b from-white to-[#dfe2e0]">
        <span className="absolute left-[13px] top-[13px] h-[7px] w-14 rounded-lg bg-[#eff1f0] mix-blend-multiply" />
        {[31, 39, 47].map((top, i) => (
          <span
            key={top}
            className="absolute left-[13px] h-1 rounded-lg bg-[#eff1f0] mix-blend-multiply"
            style={{ top, width: i === 1 ? 67 : 83 }}
          />
        ))}
      </span>
    </button>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="w-[110px] shrink-0 whitespace-nowrap text-xs font-semibold leading-[1.4] text-grey-400">{label}</span>
      <span className="py-1.5 text-sm font-semibold leading-normal text-grey-700">{children}</span>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <p className="border-b border-grey-200 pb-2 text-sm font-bold leading-normal text-grey-700">{title}</p>
      {children}
    </div>
  );
}

export function LicenseLogPanel({ members, onClose }: { members: Member[]; onClose: () => void }) {
  return (
    <aside className="fx-scrollbar flex w-[calc(max(100vw,1100px)-650px)] shrink-0 flex-col overflow-y-auto border-l border-grey-200 bg-grey-100 shadow-[-16px_0_32px_-16px_rgba(0,26,15,0.16)]">
      <div className="sticky top-0 z-10 flex h-14 shrink-0 items-start justify-between bg-grey-100 px-6 py-4">
        <p className="text-base font-medium leading-normal text-grey-700">V1</p>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-6 text-sm font-medium text-grey-500">
            <span className="flex items-center gap-1">
              <Share size={14} /> Share
            </span>
            <span className="flex items-center gap-1">
              <DocumentDownload size={14} /> Download
            </span>
          </div>
          <button type="button" aria-label="Close log" onClick={onClose} className="text-grey-600 hover:text-grey-700">
            <Close size={24} />
          </button>
        </div>
      </div>

      <div className="px-6 pb-10 pt-2">
        <article className="fx-fade-up mx-auto flex max-w-[678px] flex-col gap-6 rounded-2xl border border-grey-200 bg-white p-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-0.5">
              <p className="flex gap-2 text-xs font-medium leading-[1.4] text-grey-500">
                <span>{LOG_LABEL}</span>
                <span>{LICENSE_LOG.number}</span>
              </p>
              <h2 className="max-w-[287px] text-2xl font-bold leading-[1.2] text-grey-700">
                {assignedTitle(members.length)}
              </h2>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/procurement/runway-wordmark.png" alt="Runway" width={149} height={29} />
          </div>

          <div className="flex gap-6">
            <DetailSection title="Software details">
              {LICENSE_LOG.software.map(([label, value]) => (
                <DetailRow key={label} label={label}>
                  {value}
                </DetailRow>
              ))}
            </DetailSection>
            <DetailSection title="Assigner details">
              <DetailRow label="Owner">
                <span className="flex items-center gap-1.5 px-1 text-[#026aa2]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={LICENSE_LOG.owner.photo} alt="" width={24} height={24} className="rounded-full" />
                  {LICENSE_LOG.owner.name}
                </span>
              </DetailRow>
              <DetailRow label="Department">{LICENSE_LOG.department}</DetailRow>
              <DetailRow label="Assigned date">{LICENSE_LOG.assignedDate}</DetailRow>
            </DetailSection>
          </div>

          <hr className="border-grey-200" />

          <div className="flex flex-col">
            <div className="flex items-center justify-between pb-4">
              <p className="text-sm font-bold leading-normal text-grey-700">Assigned members x {members.length}</p>
              <span className="flex items-center gap-2 text-sm font-semibold text-grey-450">
                <Edit size={14} /> Edit
              </span>
            </div>
            <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-lg border border-grey-200 text-left">
              <thead>
                <tr className="bg-grey-100 text-xs font-semibold leading-[1.4] text-grey-700">
                  <th className="w-[230px] px-3 py-2 font-semibold">User</th>
                  <th className="px-3 py-2 font-semibold">Email</th>
                  <th className="px-3 py-2 text-right font-semibold">Assigned date</th>
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
                    <td>{m.email}</td>
                    <td className="whitespace-nowrap text-right">{LICENSE_LOG.assignedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </aside>
  );
}
