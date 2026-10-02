// The Fluxby mark redrawn as vector (the product ships it as a 28px PNG): nested green
// discs that stack toward the top, so it stays crisp at lockup size.
export function FluxbyMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id="fx-core" cx="50%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#8dfc95" />
          <stop offset="100%" stopColor="#5ef278" />
        </radialGradient>
      </defs>
      <circle cx="14" cy="14" r="13" fill="#04ad55" />
      <circle cx="14" cy="14.6" r="11.4" fill="#7ff78c" stroke="#10d469" strokeWidth="1.3" />
      <circle cx="14" cy="13.4" r="8.9" fill="#79f586" stroke="#12d86a" strokeWidth="1.3" />
      <circle cx="14" cy="12" r="6.5" fill="#74f482" stroke="#14db6b" strokeWidth="1.3" />
      <circle cx="14" cy="10" r="4.3" fill="url(#fx-core)" />
    </svg>
  );
}
