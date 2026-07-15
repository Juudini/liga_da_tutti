import MatchCard from "./MatchCard";
import { Icon } from "@shared/components/ui";

export default function MatchList({ matches }) {
  if (!matches.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-xl text-center text-muted-foreground flex flex-col items-center gap-sm">
        <Icon name="sports_soccer" size={40} />
        <p className="font-body-md text-body-md">
          No hay partidos para mostrar.
        </p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-md">
      {matches.map((m) => (
        <MatchCard key={m.id} match={m} />
      ))}
    </section>
  );
}
