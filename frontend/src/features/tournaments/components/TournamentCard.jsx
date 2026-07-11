import { Link } from "react-router-dom";
import { Icon } from "@shared/components/ui";

export default function TournamentCard({ tournament }) {
  return (
    <article className="bg-card border border-border rounded-lg p-md flex flex-col gap-sm">
      <div className="flex items-center gap-sm">
        <span className="w-10 h-10 rounded-full bg-primary/10 border border-border flex items-center justify-center shrink-0 text-primary">
          <Icon name="trophy" size={20} />
        </span>
        <div className="flex flex-col min-w-0">
          <span className="font-headline-md text-headline-md text-foreground truncate">
            {tournament.name}
          </span>
          <span className="font-label-md text-label-md text-muted-foreground">
            {tournament.matchCount}{" "}
            {tournament.matchCount === 1 ? "partido" : "partidos"}
          </span>
        </div>
      </div>

      <Link
        to={`/tournaments/${tournament.id}/matches`}
        className="mt-auto inline-flex items-center justify-center gap-xs h-10 rounded-md border border-border text-foreground font-label-md text-label-md font-bold hover:bg-muted transition-colors">
        <Icon name="visibility" size={16} />
        Ver detalle
      </Link>
    </article>
  );
}
