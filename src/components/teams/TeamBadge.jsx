export default function TeamBadge({ team, align = "left" }) {
  if (!team) return <span className="text-on-surface-variant">—</span>;
  return (
    <span
      className={`flex items-center gap-sm ${align === "right" ? "flex-row-reverse" : ""}`}>
      <span className="w-9 h-9 rounded-full bg-surface-variant border border-white/10 flex items-center justify-center text-[18px]">
        {team.logo}
      </span>
      <span className="font-label-md text-label-md text-on-surface">
        {team.name}
      </span>
    </span>
  );
}
