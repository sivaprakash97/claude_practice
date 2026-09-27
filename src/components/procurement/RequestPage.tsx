import { ChevronLeft, NotificationNew } from "@carbon/icons-react";
import { PROGRESS_DONE, PROGRESS_PENDING, type SeatRequest } from "./data";
import { REQUEST_TITLE } from "./RequestDrawer";
import {
  Justification,
  PriceTag,
  PriorityChip,
  ProgressBar,
  ProgressTimeline,
  RequestDetails,
  StatusChip,
} from "./RequestParts";

/** Full-page view of a seat upgrade request (Desktop 75, and Desktop 76 once it's done). */
export default function RequestPage({ request, onBack }: { request: SeatRequest; onBack: () => void }) {
  const done = !!request.done;
  const steps = done ? PROGRESS_DONE : PROGRESS_PENDING;

  return (
    <div className="flex h-screen min-w-0 flex-1 flex-col">
      <header className="flex h-[54px] shrink-0 items-center justify-between border-b border-grey-200 bg-white px-8">
        <h1 className="text-base font-bold text-grey-700">Seat upgrade request</h1>
        <div className="flex items-center gap-6">
          <span className="relative">
            <NotificationNew size={24} className="text-grey-600" />
            <span className="absolute right-0.5 top-0.5 size-1.5 rounded-full bg-[#f04438]" />
          </span>
          <span className="rounded bg-grey-700 px-4 py-[5px] text-base font-semibold text-white">Request</span>
        </div>
      </header>

      <main className="fx-scrollbar min-h-0 flex-1 overflow-y-auto px-8 pb-10 pt-6">
        {/* Centered at the design's 1192px content width so wide screens don't leave it pinned left. */}
        <div className="mx-auto w-full max-w-[1192px]">
          <button
            type="button"
            onClick={onBack}
            className="mb-5 flex items-center gap-1 text-sm font-medium text-grey-450 transition-colors hover:text-grey-700"
          >
            <ChevronLeft size={16} />
            Back
          </button>

          <div className="fx-fade-up flex items-start gap-8">
            <article className="flex min-w-0 max-w-[785px] flex-1 flex-col gap-8 rounded-2xl border border-grey-200 bg-white p-8">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <p className="flex gap-4 text-xs font-medium leading-[1.4]">
                    <span className="text-black/60">{request.number}</span>
                    {done && (
                      <span className="text-black">
                        Completed July 12, 2025 <span className="text-[#d92d20]">(overdue by 1 week)</span>
                      </span>
                    )}
                  </p>
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-semibold leading-[1.2] text-grey-700">{REQUEST_TITLE}</h2>
                    <PriceTag />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusChip done={done} />
                  <PriorityChip />
                </div>
                <hr className="border-grey-200" />
                <Justification />
              </div>

              <div className="flex flex-col">
                <div className="flex border-b border-grey-300">
                  <span className="border-b-4 border-brand px-5 py-2 text-xs font-bold leading-[1.4] text-grey-600">
                    Details
                  </span>
                  <span className="flex items-center gap-2 px-5 py-2 text-xs font-medium leading-[1.4] text-grey-500">
                    Comments
                    {done && (
                      <span className="flex size-[18px] items-center justify-center rounded-full bg-[#d92d20] text-[10px] font-semibold text-white">
                        5
                      </span>
                    )}
                  </span>
                  <span className="px-5 py-2 text-xs font-medium leading-[1.4] text-grey-500">Attachments</span>
                </div>
                <div className="py-8">
                  <RequestDetails preassigned={request.preassigned} done={done} twoColumn />
                </div>
              </div>
            </article>

            <aside className="sticky top-0 flex w-[375px] shrink-0 flex-col gap-6 rounded-2xl border border-grey-200 bg-white px-6 py-4">
              <div className="flex items-center gap-12 border-b border-grey-200 pb-4">
                <p className="text-base font-bold leading-normal text-grey-700">Progress</p>
                <ProgressBar steps={steps} small />
              </div>
              <ProgressTimeline steps={steps} />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
