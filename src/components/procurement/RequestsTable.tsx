import { ChevronSort, Filter, Search } from "@carbon/icons-react";
import {
  APPROVER_PHOTO,
  EXTRA_SEATS,
  REQUESTS,
  SEAT_PRICE,
  type Approver,
  type RequestRow,
  type RequestStatus,
  type SeatRequest,
} from "./data";

const STATUS_STYLES: Record<RequestStatus, string> = {
  "Pending Approval": "bg-[#fffaeb] border-[#fec84b] text-[#b54708]",
  Approved: "bg-[#d1e9ff] border-[#84caff] text-[#175cd3]",
  Rejected: "bg-[#fee4e2] border-[#fda29b] text-[#b42318]",
  Draft: "bg-grey-200 border-grey-400 text-grey-500",
};

const COLUMNS = [
  { label: "Request number", width: 166 },
  { label: "Name", width: 166 },
  { label: "Status", width: 153 },
  { label: "Approval progress", width: 214 },
  { label: "Current Approver", width: 180 },
  { label: "Amount", width: 137 },
  { label: "Requested date", width: 160 },
  { label: "Spend program", width: 156 },
];

const FILTERS = ["All requests", "Created by me", "Awaiting my approval"];

function Checkbox() {
  return <span className="block size-4 rounded border border-grey-450 bg-white" />;
}

function ApproverCell({ approver }: { approver: Approver }) {
  return (
    <span className="flex items-center gap-2">
      {approver.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={approver.photo} alt="" width={24} height={24} className="size-6 rounded-full object-cover" />
      ) : (
        <span
          className="flex size-6 items-center justify-center rounded-full text-xs"
          style={{ background: approver.bg, color: approver.fg }}
        >
          {approver.initials}
        </span>
      )}
      {approver.name}
    </span>
  );
}

// A submitted seat upgrade request as it appears in the table.
const toRow = (request: SeatRequest): RequestRow => ({
  number: request.number,
  name: "Runway",
  status: "Pending Approval",
  progress: 20,
  approver: { name: "Dwayne Smith", initials: "DS", photo: APPROVER_PHOTO },
  amount: `USD ${EXTRA_SEATS * SEAT_PRICE}`,
  date: "Jun 24, 2025",
  program: "Software",
});

export default function RequestsTable({
  created = [],
  onOpen,
}: {
  /** Submitted seat upgrade requests, newest first. */
  created?: SeatRequest[];
  onOpen?: (number: string) => void;
}) {
  const rows = [...created.map(toRow), ...REQUESTS];
  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-semibold leading-[1.2] text-grey-500">All requests</h2>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-grey-600" />
            {FILTERS.map((f, i) => (
              <span
                key={f}
                className={`rounded-3xl border border-grey-200 px-3 py-1 text-xs font-semibold leading-[1.4] ${
                  i === 0 ? "bg-grey-700 text-white" : "bg-grey-200 text-grey-500"
                }`}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
        <label className="flex w-[285px] items-center justify-between rounded-lg border border-grey-300 bg-white px-4 py-2">
          <input
            placeholder="Search"
            className="w-full bg-transparent text-sm font-medium text-grey-600 outline-none placeholder:text-grey-450"
          />
          <Search size={14} className="shrink-0 text-grey-600" />
        </label>
      </div>

      <div className="fx-scrollbar min-h-[240px] flex-1 overflow-auto rounded-2xl border border-grey-200 bg-white">
        <table className="w-max min-w-full border-separate border-spacing-0 text-left text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-grey-200">
              <th className="h-12 w-16 px-6">
                <Checkbox />
              </th>
              {COLUMNS.map((c) => (
                <th
                  key={c.label}
                  style={{ width: c.width }}
                  className="h-12 border-l border-grey-300 px-3 font-semibold text-grey-700"
                >
                  <span className="flex items-center justify-between gap-2.5 whitespace-nowrap">
                    {c.label}
                    <ChevronSort size={20} className="shrink-0 text-grey-450" />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-medium text-grey-700">
            {rows.map((r, i) => {
              const isCreated = i < created.length;
              return (
                <tr
                  key={r.number}
                  onClick={isCreated ? () => onOpen?.(r.number) : undefined}
                  // The newest request stays highlighted at the top until another one is created.
                  className={`[&>td]:h-11 [&>td]:border-b [&>td]:border-grey-200 [&>td]:whitespace-nowrap ${
                    isCreated ? "cursor-pointer [&>td]:transition-colors hover:[&>td]:bg-[#fef6dc]" : ""
                  } ${i === 0 && isCreated ? "fx-fade-in [&>td]:bg-[#fffaeb]" : ""}`}
                >
                  <td className="px-6">
                    <Checkbox />
                  </td>
                  <td className="pl-3 pr-6 text-[#33312e]">{r.number}</td>
                  <td className="pl-3 pr-6">{r.name}</td>
                  <td className="pl-3 pr-6">
                    <span
                      className={`inline-flex rounded-3xl border px-3 py-1 text-xs font-semibold leading-[1.4] ${STATUS_STYLES[r.status]}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6">
                    <span className="block h-5 w-full bg-grey-200">
                      <span className="block h-full bg-[#00b86b]" style={{ width: `${r.progress}%` }} />
                    </span>
                  </td>
                  <td className="pl-3 pr-6">
                    <ApproverCell approver={r.approver} />
                  </td>
                  <td className="pl-3 pr-6">{r.amount}</td>
                  <td className="pl-3 pr-6">{r.date}</td>
                  <td className="pl-3 pr-6">{r.program}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
