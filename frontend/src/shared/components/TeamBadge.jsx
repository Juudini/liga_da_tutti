import { Icon } from "@shared/components/ui";
import { resolveAssetUrl } from "@shared/utils/assetUrl";

export default function TeamBadge({ team, align = "left" }) {
  if (!team) return <span className="text-muted-foreground">—</span>;
  const logoUrl = resolveAssetUrl(team.logoUrl);
  return (
    <span
      className={`flex items-center gap-sm ${align === "right" ? "flex-row-reverse" : ""}`}>
      <span className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
        {logoUrl ? (
          <img src={logoUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <Icon
            name="sports_soccer"
            size={18}
            className="text-muted-foreground"
          />
        )}
      </span>
      <span className="font-label-md text-label-md text-foreground">
        {team.name}
      </span>
    </span>
  );
}
