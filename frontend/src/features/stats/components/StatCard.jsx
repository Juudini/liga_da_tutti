import { Icon } from "@shared/components/ui";
import { cn } from "@shared/utils/cn";

export default function StatCard({
  label,
  value,
  icon = "sports_soccer",
  accent = false,
  compact = false,
  valueClassName,
}) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg flex flex-col justify-between",
        compact ? "h-28 p-sm" : "h-36 p-md",
      )}>
      <div className="flex justify-between items-start gap-sm">
        <h3 className="font-label-md text-label-md text-muted-foreground uppercase tracking-wider">
          {label}
        </h3>
        <span
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
            accent
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground",
          )}>
          <Icon name={icon} size={18} />
        </span>
      </div>
      <span
        className={cn(
          "font-score-display text-score-display",
          accent ? "text-primary" : "text-foreground",
          valueClassName,
        )}>
        {value}
      </span>
    </div>
  );
}
