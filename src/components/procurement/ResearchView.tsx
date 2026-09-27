"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Attachment, Checkmark, Renew, StopFilledAlt } from "@carbon/icons-react";
import {
  ACCESS_TITLE,
  AFTER_ASSIGN_OPTIONS,
  ALL_MEMBERS,
  ASSIGNED_TITLE,
  ASSIGNING_MS,
  CREATING_MS,
  EXTRA_MEMBERS,
  EXTRA_SEATS,
  FLOW_PROMPT,
  FLOW_TITLE,
  MORE_SEATS_PROMPT,
  PROCEED_OPTIONS,
  RECOMMENDED_MEMBERS,
  UPGRADE_TITLE,
  type SeatRequest,
} from "./data";
import AssignSeats from "./AssignSeats";
import FluxbyMark from "./FluxbyMark";
import { DocCard, DocPanel, LicenseLogCard, LicenseLogPanel } from "./LicenseLog";
import {
  Questions,
  Results,
  SectionRail,
  TABS,
  Thinking,
  Turn,
  emptyAnswers,
  type Anchor,
  type Answers,
} from "./ResearchParts";
import { MoreSeatsAnswer, OptionList } from "./SeatTurns";
import { SubmittedModal, UPGRADE_DOC_TITLE, UPGRADE_LABEL, UpgradeRequestDoc } from "./UpgradeRequest";

type FirstStage = "questions" | "thinking" | "results";

/**
 * Everything after the results is a list of conversation turns:
 * - access:    pick people for the available seats (flow 2, or "I'll have 5 seats for now")
 * - assigned:  success turn that follows an access turn
 * - moreSeats: the answer to "I want 5 more seats" (flow 3)
 * - assignNow: assign the 5 available seats, then offer the seat upgrade request
 * - upgrade:   create the seat upgrade request document
 * - later:     "I'll do it later"
 */
type TurnKind = "access" | "assigned" | "moreSeats" | "assignNow" | "upgrade" | "later";
type Phase = "pick" | "working" | "done";

type ChatTurn = {
  id: string;
  kind: TurnKind;
  title: string;
  phase?: Phase;
  selected?: string[];
  limit?: number;
  chosen?: number;
  sourceId?: string;
};

type Panel = { kind: "log" | "upgrade"; turnId: string };

export type ResearchSeed = "questions" | "results" | "access" | "assigned" | "log" | "more-seats" | "upgrade";

const RECOMMENDED_IDS = RECOMMENDED_MEMBERS.map((m) => m.id);

const makeTurn = (kind: TurnKind, index: number, fields: Omit<ChatTurn, "id" | "kind">): ChatTurn => ({
  id: `fx-${kind}-${index}`,
  kind,
  ...fields,
});

function initialState(seed?: ResearchSeed): { stage: FirstStage; turns: ChatTurn[]; panel: Panel | null } {
  if (!seed || seed === "questions") return { stage: "questions", turns: [], panel: null };
  const access = makeTurn("access", 0, { title: ACCESS_TITLE, phase: "pick", selected: [] });
  switch (seed) {
    case "results":
      return { stage: "results", turns: [], panel: null };
    case "access":
      return { stage: "results", turns: [access], panel: null };
    case "assigned":
    case "log": {
      const done: ChatTurn = { ...access, phase: "done", selected: RECOMMENDED_IDS };
      const assigned = makeTurn("assigned", 1, { title: ASSIGNED_TITLE, sourceId: done.id });
      return {
        stage: "results",
        turns: [done, assigned],
        // The log opens alongside the success message by default.
        panel: { kind: "log", turnId: assigned.id },
      };
    }
    case "more-seats":
      return { stage: "results", turns: [makeTurn("moreSeats", 0, { title: MORE_SEATS_PROMPT })], panel: null };
    case "upgrade": {
      const upgrade = makeTurn("upgrade", 2, { title: UPGRADE_TITLE, phase: "done" });
      return {
        stage: "results",
        turns: [
          makeTurn("moreSeats", 0, { title: MORE_SEATS_PROMPT, chosen: 2 }),
          makeTurn("assignNow", 1, { title: PROCEED_OPTIONS[2], phase: "done", selected: RECOMMENDED_IDS, chosen: 0 }),
          upgrade,
        ],
        panel: { kind: "upgrade", turnId: upgrade.id },
      };
    }
  }
}

const RESULT_ANCHORS: Anchor[] = [
  { id: "fx-prompt", label: FLOW_PROMPT, turn: true },
  { id: "fx-catalogue", label: "Product catalogue (4 matches)", turn: false },
  { id: "fx-recommendation", label: "Runway AI is your best choice", turn: false },
];

// Shared motion for the document drawer: the chat column narrows while the panel slides in.
const DRAWER_MS = 500;
const DRAWER_MOTION = "duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none";

const membersFor = (ids: string[] = []) => ALL_MEMBERS.filter((m) => ids.includes(m.id));
const plural = (n: number) => `${n} ${n === 1 ? "member" : "members"}`;

export default function ResearchView({
  seed,
  requestNumber,
  onBack,
  onSubmitRequest,
  onGoHome,
}: {
  seed?: ResearchSeed;
  /** Number the next seat upgrade request will get. */
  requestNumber: string;
  onBack: () => void;
  onSubmitRequest: (request: SeatRequest) => void;
  onGoHome: () => void;
}) {
  const [initial] = useState(() => initialState(seed));
  const [stage, setStage] = useState<FirstStage>(initial.stage);
  const [turns, setTurns] = useState<ChatTurn[]>(initial.turns);
  const last = turns[turns.length - 1];
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [draft, setDraft] = useState("");

  // Document drawer: `panel` stays set while it slides out; `panelOpen` drives the animation.
  const [panel, setPanel] = useState<Panel | null>(initial.panel);
  const [panelOpen, setPanelOpen] = useState(initial.panel !== null);

  // Seat upgrade request document.
  const [number] = useState(requestNumber);
  const [preassigned, setPreassigned] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  // Stable so the thinking timer isn't reset by unrelated re-renders.
  const showResults = useCallback(() => setStage("results"), []);

  const scrollToTurn = useCallback((id: string, smooth: boolean) => {
    const el = scrollRef.current;
    const target = document.getElementById(id);
    if (!el || !target) return;
    const top = el.scrollTop + target.getBoundingClientRect().top - el.getBoundingClientRect().top;
    el.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
  }, []);

  // The first turn's own stages start from the top.
  useEffect(() => {
    if (turns.length === 0) scrollRef.current?.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // New turns scroll into view (instantly when the page opens part-way through the flow).
  const turnCount = useRef(0);
  useEffect(() => {
    const newest = turns[turns.length - 1];
    if (newest && turns.length !== turnCount.current) scrollToTurn(newest.id, turnCount.current > 0);
    turnCount.current = turns.length;
  }, [turns, scrollToTurn]);

  // When the latest turn moves on (e.g. the seat list closes into the success message), bring its heading back up.
  const phaseKey = last ? `${last.id}:${last.phase ?? ""}` : "";
  const prevPhaseKey = useRef(phaseKey);
  useEffect(() => {
    const prev = prevPhaseKey.current;
    prevPhaseKey.current = phaseKey;
    if (last && prev !== phaseKey && prev.startsWith(`${last.id}:`)) scrollToTurn(last.id, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseKey]);

  // The chat column reflows while the drawer animates, so hold the turn with the open card in view.
  const anchorId = panel?.turnId;
  useEffect(() => {
    const el = scrollRef.current;
    const target = anchorId && document.getElementById(anchorId);
    if (!el || !target) return;
    const end = performance.now() + DRAWER_MS + 50;
    let frame = 0;
    const hold = () => {
      el.scrollTop += target.getBoundingClientRect().top - el.getBoundingClientRect().top;
      if (performance.now() < end) frame = requestAnimationFrame(hold);
    };
    hold();
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelOpen]);

  const panelOpenRef = useRef(panelOpen);
  useEffect(() => {
    panelOpenRef.current = panelOpen;
  }, [panelOpen]);
  const openPanel = useCallback((next: Panel) => {
    setPanel(next);
    // Mount at zero width first so the drawer can slide in.
    if (!panelOpenRef.current) requestAnimationFrame(() => requestAnimationFrame(() => setPanelOpen(true)));
  }, []);

  const update = useCallback(
    (id: string, patch: Partial<ChatTurn>) => setTurns((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t))),
    [],
  );
  const append = useCallback(
    (kind: TurnKind, fields: Omit<ChatTurn, "id" | "kind">) =>
      setTurns((ts) => [...ts, makeTurn(kind, ts.length, fields)]),
    [],
  );

  // Read by timers that finish working steps, so they see the latest turns.
  const turnsRef = useRef(turns);
  useEffect(() => {
    turnsRef.current = turns;
  }, [turns]);

  const finishAssigning = useCallback(
    (id: string) => {
      const current = turnsRef.current;
      const done = current.map((t) => (t.id === id ? { ...t, phase: "done" as Phase } : t));
      // Flow 2 follows the assignment with its own success turn; flow 3 shows success in the same turn.
      const successTurn =
        done.find((t) => t.id === id)?.kind === "access"
          ? makeTurn("assigned", done.length, { title: ASSIGNED_TITLE, sourceId: id })
          : undefined;
      setTurns(successTurn ? [...done, successTurn] : done);
      // Open the license assignment log by default, once the success message has started to appear.
      setTimeout(() => openPanel({ kind: "log", turnId: successTurn?.id ?? id }), 600);
    },
    [openPanel],
  );

  const finishCreating = useCallback(
    (id: string) => {
      update(id, { phase: "done" });
      openPanel({ kind: "upgrade", turnId: id });
    },
    [update, openPanel],
  );

  const canBranch = stage === "results" && turns.length === 0;
  const working = stage === "thinking" || last?.phase === "working";

  const stop = () => {
    if (stage === "thinking") return setStage("questions");
    if (!last || last.phase !== "working") return;
    if (last.kind === "upgrade") {
      // Cancel creating the request and let the previous choice be made again.
      setTurns((ts) => ts.slice(0, -1).map((t, i, arr) => (i === arr.length - 1 ? { ...t, chosen: undefined } : t)));
    } else {
      update(last.id, { phase: "pick" });
    }
  };

  const send = () => {
    if (!canBranch || !draft.trim()) return;
    append("moreSeats", { title: MORE_SEATS_PROMPT });
    setDraft("");
  };

  const anchors = useMemo(() => {
    const base = stage === "results" ? RESULT_ANCHORS : RESULT_ANCHORS.slice(0, 1);
    return [...base, ...turns.map((t) => ({ id: t.id, label: t.title, turn: true }))];
  }, [stage, turns]);

  // People who already have a seat can't be pre-assigned one of the requested seats.
  const assignedNow = turns.find((t) => t.kind === "assignNow")?.selected ?? [];
  const upgradePool = [...EXTRA_MEMBERS, ...ALL_MEMBERS.filter((m) => !assignedNow.includes(m.id))];

  const submit = () => {
    setSubmitted(true);
    setShowModal(true);
    onSubmitRequest({ number, preassigned: upgradePool.filter((m) => preassigned.includes(m.id)) });
  };

  const renderTurn = (t: ChatTurn) => {
    const selected = t.selected ?? [];
    const logActive = panelOpen && panel?.kind === "log" && panel.turnId === t.id;
    switch (t.kind) {
      case "access":
      case "assignNow": {
        const isNow = t.kind === "assignNow";
        return (
          <div className="flex flex-col gap-4 pt-6 text-base font-medium leading-normal text-grey-600">
            {t.phase === "pick" && (
              <>
                <p className="fx-fade-up">
                  {isNow
                    ? "Sure thing, let’s help you assign the available 5 Runway seats to your team members for now."
                    : "Sure thing, let’s help you assign Runway seats to your team members."}
                </p>
                <AssignSeats
                  selected={selected}
                  onChange={(ids) => update(t.id, { selected: ids })}
                  onGiveAccess={() => update(t.id, { phase: "working" })}
                  limit={isNow ? EXTRA_SEATS : t.limit}
                />
              </>
            )}
            {t.phase === "working" && (
              <Working
                id={t.id}
                text="Assigning seats to the selected members..."
                ms={ASSIGNING_MS}
                onDone={finishAssigning}
              />
            )}
            {t.phase === "done" && !isNow && (
              <p className="flex items-center gap-3 text-sm text-grey-500">
                <span className="flex size-[18px] items-center justify-center rounded-full bg-brand text-white">
                  <Checkmark size={12} />
                </span>
                Assigned Runway seats to {plural(selected.length)}
              </p>
            )}
            {t.phase === "done" && isNow && (
              <>
                <p className="fx-fade-up">
                  I’ve now given access to your team members, Amar. They will receive an email with access details
                  shortly.
                </p>
                <div className="fx-fade-up" style={{ animationDelay: "150ms" }}>
                  <LicenseLogCard
                    count={selected.length}
                    active={logActive}
                    onOpen={() => openPanel({ kind: "log", turnId: t.id })}
                  />
                </div>
                <p className="fx-fade-up" style={{ animationDelay: "300ms" }}>
                  Here’s the log documenting the license assignment.
                </p>
                <div className="fx-fade-up flex flex-col gap-4" style={{ animationDelay: "450ms" }}>
                  <h3 className="text-xl font-semibold leading-[1.2] text-grey-700">
                    Let me know if I can proceed with requesting 5 extra seats for you.
                  </h3>
                  <OptionList
                    options={AFTER_ASSIGN_OPTIONS}
                    enabled={[0, 1]}
                    chosen={t.chosen}
                    onPick={(i) => {
                      update(t.id, { chosen: i });
                      if (i === 0) append("upgrade", { title: UPGRADE_TITLE, phase: "working" });
                      else append("later", { title: AFTER_ASSIGN_OPTIONS[1] });
                    }}
                  />
                </div>
              </>
            )}
          </div>
        );
      }
      case "assigned": {
        const source = turns.find((s) => s.id === t.sourceId);
        return (
          <div className="flex flex-col gap-4 pt-6 text-base font-medium leading-normal text-grey-600">
            <p className="fx-fade-up">
              I’ve now given access to your team members, Amar. They will receive an email with access details shortly.
            </p>
            <div className="fx-fade-up" style={{ animationDelay: "150ms" }}>
              <LicenseLogCard
                count={source?.selected?.length ?? 0}
                active={logActive}
                onOpen={() => openPanel({ kind: "log", turnId: t.id })}
              />
            </div>
            <p className="fx-fade-up" style={{ animationDelay: "300ms" }}>
              Here’s the log documenting the license assignment.
            </p>
            <p className="fx-fade-up" style={{ animationDelay: "450ms" }}>
              Is there anything else I can help with?
            </p>
          </div>
        );
      }
      case "moreSeats":
        return (
          <MoreSeatsAnswer
            options={
              <OptionList
                options={PROCEED_OPTIONS}
                enabled={[0, 2]}
                chosen={t.chosen}
                onPick={(i) => {
                  update(t.id, { chosen: i });
                  if (i === 0) {
                    append("access", { title: PROCEED_OPTIONS[0], phase: "pick", selected: [], limit: EXTRA_SEATS });
                  } else {
                    append("assignNow", { title: PROCEED_OPTIONS[2], phase: "pick", selected: [] });
                  }
                }}
              />
            }
          />
        );
      case "later":
        return (
          <p className="fx-fade-up pt-6 text-base font-medium leading-normal text-grey-600">
            No problem. You can ask me anytime.
          </p>
        );
      case "upgrade":
        return (
          <div className="flex flex-col gap-4 pt-6 text-base font-medium leading-normal text-grey-600">
            <p className="fx-fade-up">Sure, I’ll initiate a seat upgrade request.</p>
            {t.phase === "working" && (
              <Working id={t.id} text="Creating a seat upgrade request..." ms={CREATING_MS} onDone={finishCreating} />
            )}
            {t.phase === "done" && (
              <>
                <div className="fx-fade-up">
                  <DocCard
                    label={UPGRADE_LABEL}
                    title={UPGRADE_DOC_TITLE}
                    active={panelOpen && panel?.kind === "upgrade"}
                    onOpen={() => openPanel({ kind: "upgrade", turnId: t.id })}
                  />
                </div>
                <p className="fx-fade-up" style={{ animationDelay: "150ms" }}>
                  I’ve created a Seat upgrade request for you and filled in the appropriate details wherever relevant.
                </p>
                <p className="fx-fade-up" style={{ animationDelay: "300ms" }}>
                  You can pre-assign seats to team members in the request for automatic access upon approval.
                </p>
              </>
            )}
          </div>
        );
    }
  };

  const tabsFor = (t: ChatTurn) => (t.kind === "assigned" || t.kind === "upgrade" ? [...TABS, "Assets"] : TABS);

  const logTurn = panel?.kind === "log" ? turns.find((t) => t.id === panel.turnId) : undefined;
  const logSource = logTurn?.kind === "assigned" ? turns.find((t) => t.id === logTurn.sourceId) : logTurn;

  return (
    <div className="flex h-screen min-w-0 flex-1 flex-col">
      <header className="flex h-[54px] shrink-0 items-center gap-2 border-b border-grey-200 bg-white px-8">
        <span className="flex items-center gap-1 rounded-full bg-grey-100 px-3 py-1 text-xs font-medium text-grey-600">
          <Renew size={14} />
          Research
        </span>
        <h1 className="text-base font-semibold text-grey-700">{FLOW_TITLE}</h1>
      </header>

      <div className="flex min-h-0 flex-1">
        <div
          className={`flex min-w-0 shrink-0 flex-col transition-[width] ${DRAWER_MOTION}`}
          style={{ width: panelOpen ? 466 : "100%" }}
          onTransitionEnd={(e) => {
            if (e.target === e.currentTarget && !panelOpen) setPanel(null);
          }}
        >
          <div className="relative min-h-0 flex-1">
            <SectionRail anchors={anchors} scrollRef={scrollRef} />

            <div ref={scrollRef} className="fx-scrollbar h-full overflow-y-auto">
              <div className={`pb-16 transition-[padding] ${DRAWER_MOTION} ${panelOpen ? "pl-14 pr-12" : "px-12"}`}>
                <div
                  className={`mx-auto transition-[max-width] ${DRAWER_MOTION} ${
                    panelOpen ? "max-w-[362px]" : "max-w-[580px]"
                  }`}
                >
                  <Turn
                    id="fx-prompt"
                    title={FLOW_PROMPT}
                    tabs={stage === "results" ? TABS : []}
                    last={turns.length === 0}
                    onBack={onBack}
                  >
                    {stage === "questions" && (
                      <Questions answers={answers} setAnswers={setAnswers} onSubmit={() => setStage("thinking")} />
                    )}
                    {stage === "thinking" && <Thinking onDone={showResults} />}
                    {stage === "results" && (
                      <Results
                        onGetAccess={
                          canBranch
                            ? () => append("access", { title: ACCESS_TITLE, phase: "pick", selected: [] })
                            : undefined
                        }
                      />
                    )}
                  </Turn>

                  {turns.map((t, i) => (
                    <Turn key={t.id} id={t.id} title={t.title} tabs={tabsFor(t)} last={i === turns.length - 1}>
                      {renderTurn(t)}
                    </Turn>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <footer className="flex shrink-0 justify-center border-t border-grey-300 bg-grey-50 p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex w-[641px] max-w-full items-center justify-between gap-2 rounded-lg border border-grey-300 bg-white p-3 focus-within:border-grey-450"
            >
              <textarea
                rows={draft ? 2 : 1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                // On the results screen, clicking the box types the designed question for the demo.
                onFocus={() => {
                  if (canBranch && !draft) setDraft(MORE_SEATS_PROMPT);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask Fluxby AI"
                className="min-w-0 flex-1 resize-none bg-transparent text-base font-medium leading-normal text-grey-600 outline-none placeholder:text-grey-450"
              />
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center text-grey-450">
                  <Attachment size={16} />
                </span>
                {working ? (
                  <button type="button" aria-label="Stop" onClick={stop} className="rounded bg-grey-700 p-2 text-white">
                    <StopFilledAlt size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    aria-label="Send"
                    disabled={!canBranch || !draft.trim()}
                    className="rounded bg-brand p-2 text-white transition-colors enabled:hover:opacity-90 disabled:bg-grey-300"
                  >
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </form>
          </footer>
        </div>

        {panel && (
          // The panel keeps its final width and is revealed from the right as the chat column narrows,
          // so it slides in rather than squeezing.
          <div className="flex min-w-0 flex-1 justify-end overflow-hidden">
            {panel.kind === "log" ? (
              <LicenseLogPanel members={membersFor(logSource?.selected)} onClose={() => setPanelOpen(false)} />
            ) : (
              <DocPanel closeLabel="Close request" onClose={() => setPanelOpen(false)}>
                <UpgradeRequestDoc
                  number={number}
                  pool={upgradePool}
                  preassigned={preassigned}
                  onPreassign={setPreassigned}
                  submitted={submitted}
                  onSubmit={submit}
                />
              </DocPanel>
            )}
          </div>
        )}
      </div>

      {showModal && <SubmittedModal number={number} onHome={onGoHome} onStay={() => setShowModal(false)} />}
    </div>
  );
}

/** A timed working step that reports back with its turn id. */
function Working({ id, text, ms, onDone }: { id: string; text: string; ms: number; onDone: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDone(id), ms);
    return () => clearTimeout(timer);
  }, [id, ms, onDone]);

  return (
    <div className="flex items-center gap-3">
      <FluxbyMark size={18} className="animate-pulse" />
      <p className="fx-fade-up fx-shimmer text-sm font-medium">{text}</p>
    </div>
  );
}
