import { ROLES } from "../heroData";

// Distance (in rem) from the active line to its nearest dimmed neighbor —
// large enough to clear the active role's much bigger font — then a
// smaller, even step for every row beyond that.
const REEL_CLEARANCE_REM = 3.1;
const REEL_STEP_REM = 1.9;

function reelOffsetRem(offset: number) {
  if (offset === 0) return 0;
  const sign = offset > 0 ? 1 : -1;
  return sign * (REEL_CLEARANCE_REM + (Math.abs(offset) - 1) * REEL_STEP_REM);
}

function article(role: string) {
  return /^[aeiou]/i.test(role) ? "an" : "a";
}

type RoleSentenceProps = {
  step: number;
};

/**
 * "Hi! Sivaprakash is a {role}" — plain, in-flow text that nothing else on
 * the page can move. The other roles live on a reel of always-mounted,
 * absolutely-positioned spans anchored to the active role's own position:
 * each one's offset is just its index minus the current step, so on every
 * step change all four slide by exactly one row together. The active
 * role's own instance is invisible (offset 0) since its text is already
 * shown inline in the sentence.
 */
export default function RoleSentence({ step }: RoleSentenceProps) {
  const active = ROLES[step];

  return (
    <p
      className="flex items-baseline whitespace-nowrap font-bold leading-tight text-black"
      style={{ fontSize: "clamp(1.1rem, 4vw, 3.25rem)" }}
    >
      <span>Hi! Sivaprakash is {article(active)}&nbsp;</span>
      <span className="relative inline-block">
        {active}

        {ROLES.map((role, i) => {
          const offset = i - step;
          return (
            <span
              key={role}
              aria-hidden={offset === 0}
              className="hero-animated pointer-events-none absolute left-0 top-0 whitespace-nowrap font-normal text-black/30 transition-all duration-500 ease-out"
              style={{
                fontSize: "clamp(1.1rem, 2.5vw, 1.75rem)",
                transform: `translateY(${reelOffsetRem(offset)}rem)`,
                opacity: offset === 0 ? 0 : 1,
              }}
            >
              {role}
            </span>
          );
        })}
      </span>
    </p>
  );
}
