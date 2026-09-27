import type { Member } from "./data";

export default function MemberAvatar({ member }: { member: Member }) {
  if (member.photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={member.photo}
        alt=""
        width={32}
        height={32}
        className="size-8 shrink-0 rounded-full border border-white/70 object-cover"
      />
    );
  }
  return (
    <span
      className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
      style={{ background: member.bg, color: member.fg }}
    >
      {member.initials}
    </span>
  );
}
