import { ROLES } from "../heroData";

type ProgressDotsProps = {
  step: number;
  color: string;
};

export default function ProgressDots({ step, color }: ProgressDotsProps) {
  return (
    <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
      {ROLES.map((role, i) => (
        <span
          key={role}
          className="hero-animated h-1.5 rounded-full transition-all duration-500"
          style={{
            width: i === step ? "1.75rem" : "0.4rem",
            backgroundColor: i === step ? color : "rgba(0,0,0,0.15)",
          }}
        />
      ))}
    </div>
  );
}
