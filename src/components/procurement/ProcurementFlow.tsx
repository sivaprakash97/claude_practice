"use client";

import { useState } from "react";
import HomeView from "./HomeView";
import ResearchView, { type ResearchStage } from "./ResearchView";
import Sidebar from "./Sidebar";

type Stage = "home" | ResearchStage;

export default function ProcurementFlow() {
  const [stage, setStage] = useState<Stage>("home");

  return (
    <div className="flex min-h-screen min-w-[1100px]">
      <Sidebar showNewBadge={stage === "home"} onHome={() => setStage("home")} />
      {stage === "home" ? (
        <HomeView onStartResearch={() => setStage("questions")} />
      ) : (
        <ResearchView key="research" stage={stage} onStageChange={setStage} onBack={() => setStage("home")} />
      )}
    </div>
  );
}
