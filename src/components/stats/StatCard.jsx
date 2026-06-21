import Icon from "../ui/Icon";

export default function StatCard({
  label,
  value,
  icon = "sports_soccer",
  accent = false,
}) {
  return (
    <div className="bg-surface-container-high/60 backdrop-blur-md rounded-xl p-md border-t border-l border-white/10 glass-edge flex flex-col justify-between h-36">
      <div className="flex justify-between items-start gap-sm">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
          {label}
        </h3>
        <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
          <Icon name={icon} size={18} />
        </span>
      </div>
      <span
        className={`font-score-display text-score-display ${accent ? "text-primary" : "text-on-surface"}`}>
        {value}
      </span>
    </div>
  );
}
