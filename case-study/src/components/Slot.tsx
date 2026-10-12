// Stand-in for artwork that has not been exported from Figma yet.
export default function Slot({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`slot ${className}`} role="img" aria-label={label}>
      <span>{label}</span>
    </div>
  );
}
