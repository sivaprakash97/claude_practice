export default function FluxbyMark({ size, className = "" }: { size: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/procurement/fluxby.png" alt="" width={size} height={size} className={`shrink-0 ${className}`} />
  );
}
