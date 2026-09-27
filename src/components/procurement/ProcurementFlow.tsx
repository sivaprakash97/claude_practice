"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { RECOMMENDED_MEMBERS } from "./data";
import HomeView from "./HomeView";
import ResearchView, { type ResearchStage } from "./ResearchView";
import Sidebar from "./Sidebar";

type Stage = "home" | ResearchStage;

type Seed = { stage: Stage; selected?: string[]; logOpen?: boolean };

const RECOMMENDED_IDS = RECOMMENDED_MEMBERS.map((m) => m.id);

// Review shortcuts: `/?start=<step>` opens the prototype part-way through the flow
// so a step can be checked without clicking through everything before it.
const START_POINTS: Record<string, Seed> = {
  questions: { stage: "questions" },
  results: { stage: "results" },
  access: { stage: "assign" },
  assigned: { stage: "assigned", selected: RECOMMENDED_IDS },
  log: { stage: "assigned", selected: RECOMMENDED_IDS, logOpen: true },
};

export default function ProcurementFlow() {
  const searchParams = useSearchParams();
  const [seed, setSeed] = useState<Seed | undefined>(() => START_POINTS[searchParams.get("start") ?? ""]);
  const [stage, setStage] = useState<Stage>(seed?.stage ?? "home");

  const goHome = () => {
    // Drop the shortcut so the next run (and a refresh) starts from the beginning.
    setSeed(undefined);
    setStage("home");
    if (searchParams.has("start")) window.history.replaceState(null, "", window.location.pathname);
  };

  return (
    <div className="flex min-h-screen min-w-[1100px]">
      <Sidebar showNewBadge={stage === "home"} onHome={goHome} />
      {stage === "home" ? (
        <HomeView onStartResearch={() => setStage("questions")} />
      ) : (
        <ResearchView
          key="research"
          stage={stage}
          onStageChange={setStage}
          onBack={goHome}
          initialSelected={seed?.selected}
          initialLogOpen={seed?.logOpen}
        />
      )}
    </div>
  );
}
