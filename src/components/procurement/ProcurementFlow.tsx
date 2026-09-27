"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { EXTRA_MEMBERS, nextRequestNumber, type SeatRequest } from "./data";
import HomeView from "./HomeView";
import RequestDrawer from "./RequestDrawer";
import RequestPage from "./RequestPage";
import ResearchView, { type ResearchSeed } from "./ResearchView";
import Sidebar, { type SidebarItem } from "./Sidebar";

type View = "home" | "research" | "request";

type Start = {
  view: View;
  research?: ResearchSeed;
  requests?: SeatRequest[];
  drawer?: string;
  page?: string;
};

// The request as designed, for shortcuts that open after it was submitted.
const DESIGNED_REQUEST: SeatRequest = { number: nextRequestNumber(0), preassigned: EXTRA_MEMBERS };

// Review shortcuts: `/?start=<step>` opens the prototype part-way through a flow
// so a step can be checked without clicking through everything before it.
const START_POINTS: Record<string, Start> = {
  questions: { view: "research", research: "questions" },
  results: { view: "research", research: "results" },
  access: { view: "research", research: "access" },
  assigned: { view: "research", research: "assigned" },
  log: { view: "research", research: "log" },
  "more-seats": { view: "research", research: "more-seats" },
  upgrade: { view: "research", research: "upgrade" },
  requests: { view: "home", requests: [DESIGNED_REQUEST] },
  request: { view: "home", requests: [DESIGNED_REQUEST], drawer: DESIGNED_REQUEST.number },
  "request-page": { view: "request", requests: [DESIGNED_REQUEST], page: DESIGNED_REQUEST.number },
  "request-done": {
    view: "request",
    requests: [{ ...DESIGNED_REQUEST, done: true }],
    page: DESIGNED_REQUEST.number,
  },
};

const SIDEBAR: Record<View, SidebarItem> = { home: "home", research: "fluxby", request: "requests" };

export default function ProcurementFlow() {
  const searchParams = useSearchParams();
  const [start] = useState<Start | undefined>(() => START_POINTS[searchParams.get("start") ?? ""]);

  const [view, setView] = useState<View>(start?.view ?? "home");
  const [researchSeed, setResearchSeed] = useState<ResearchSeed | undefined>(start?.research);
  const [researchRun, setResearchRun] = useState(0);
  // Submitted seat upgrade requests, newest first. They stay until the page is refreshed.
  const [requests, setRequests] = useState<SeatRequest[]>(start?.requests ?? []);
  const [drawer, setDrawer] = useState<string | null>(start?.drawer ?? null);
  const [page, setPage] = useState<string | null>(start?.page ?? null);

  const clearShortcut = () => {
    if (searchParams.has("start")) window.history.replaceState(null, "", window.location.pathname);
  };

  const goHome = () => {
    // Drop the shortcut so the next run (and a refresh) starts from the beginning.
    setResearchSeed(undefined);
    setDrawer(null);
    setPage(null);
    setView("home");
    clearShortcut();
  };

  const startResearch = () => {
    setResearchSeed(undefined);
    setResearchRun((n) => n + 1);
    setDrawer(null);
    setView("research");
  };

  const pageRequest = requests.find((r) => r.number === page);
  const drawerRequest = view === "home" ? requests.find((r) => r.number === drawer) : undefined;

  return (
    <div className="flex min-h-screen min-w-[1100px]">
      <Sidebar active={SIDEBAR[view]} showNewBadge={view === "home"} onHome={goHome} />

      {view === "home" && <HomeView onStartResearch={startResearch} requests={requests} onOpenRequest={setDrawer} />}

      {view === "research" && (
        <ResearchView
          key={researchRun}
          seed={researchSeed}
          requestNumber={nextRequestNumber(requests.length)}
          onBack={goHome}
          onSubmitRequest={(request) => setRequests((rs) => [request, ...rs])}
          onGoHome={goHome}
        />
      )}

      {view === "request" && pageRequest && (
        <RequestPage
          request={pageRequest}
          onBack={() => {
            // Back returns to where the page was opened from: the request's drawer on the home screen.
            setDrawer(pageRequest.number);
            setPage(null);
            setView("home");
            clearShortcut();
          }}
        />
      )}

      {drawerRequest && (
        <RequestDrawer
          key={drawerRequest.number}
          request={drawerRequest}
          onClose={() => setDrawer(null)}
          onExpand={() => {
            setPage(drawerRequest.number);
            setDrawer(null);
            setView("request");
          }}
        />
      )}
    </div>
  );
}
