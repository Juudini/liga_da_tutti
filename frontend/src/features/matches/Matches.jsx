import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@shared/components/ui";
import { cn } from "@shared/utils/cn";
import useMatchesStore from "./hooks/useMatchesStore";
import useAuthStore from "@features/auth/hooks/useAuthStore";
import useTournamentsStore from "@features/tournaments/hooks/useTournamentsStore";
import { useTournamentCards } from "@features/tournaments/hooks/useTournamentCards";
import TournamentCard from "@features/tournaments/components/TournamentCard";
import { useMatchFilters } from "./hooks/useMatchFilters";
import MatchList from "./components/MatchList";

const CHIPS = [
  { value: "todos", label: "Todos" },
  { value: "programado", label: "Programados" },
  { value: "finalizado", label: "Finalizados" },
  { value: "cancelado", label: "Cancelados" },
];

export default function Matches() {
  const matches = useMatchesStore((s) => s.matches);
  const status = useMatchesStore((s) => s.status);
  const fetchMatches = useMatchesStore((s) => s.fetchMatches);
  const tournaments = useTournamentsStore((s) => s.tournaments);
  const fetchTournaments = useTournamentsStore((s) => s.fetchTournaments);
  const user = useAuthStore((s) => s.user);
  const { filter, setFilter, onlyMine, setOnlyMine, visible } = useMatchFilters(
    matches,
    user?.id,
  );
  const {
    onlyMine: onlyMyTournaments,
    setOnlyMine: setOnlyMyTournaments,
    cards: tournamentCards,
  } = useTournamentCards(tournaments, matches, user?.id);

  useEffect(() => {
    fetchMatches();
    fetchTournaments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h1 className="font-display-lg text-display-lg text-foreground mb-xs">
            Fixture
          </h1>
          <p className="font-body-md text-body-md text-muted-foreground">
            Tus próximos encuentros y resultados.
          </p>
        </div>
        <Link
          to="/matches/new"
          className="md:hidden w-full sm:w-auto inline-flex items-center justify-center gap-sm h-11 px-6 rounded-md bg-primary text-primary-foreground font-label-md text-label-md font-bold hover:bg-primary/90 transition-colors">
          <Icon name="add" size={20} />
          Organizar Partido
        </Link>
      </section>

      <section className="flex flex-col gap-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-foreground flex items-center gap-xs">
            <Icon name="trophy" size={20} />
            Torneos
          </h2>
          <label className="flex items-center gap-xs font-label-md text-label-md text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={onlyMyTournaments}
              onChange={(e) => setOnlyMyTournaments(e.target.checked)}
              className="w-4 h-4 rounded-md accent-primary cursor-pointer"
            />
            Solo mis torneos
          </label>
        </div>

        {tournamentCards.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-lg text-center text-muted-foreground">
            <p className="font-body-md text-body-md">
              {onlyMyTournaments
                ? "No creaste ningún torneo todavía."
                : "No hay torneos registrados todavía."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-sm">
            {tournamentCards.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-wrap items-center gap-sm">
        <div className="flex flex-wrap gap-xs">
          {CHIPS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setFilter(c.value)}
              className={cn(
                "px-4 py-2 rounded-full font-label-md text-label-md transition-colors cursor-pointer",
                filter === c.value
                  ? "bg-accent text-accent-foreground font-bold"
                  : "border border-border text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}>
              {c.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-xs ml-auto font-label-md text-label-md text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={onlyMine}
            onChange={(e) => setOnlyMine(e.target.checked)}
            className="w-4 h-4 rounded-md accent-primary cursor-pointer"
          />
          Solo mis partidos
        </label>
      </section>

      {status === "loading" && matches.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-xl text-center text-muted-foreground">
          <p className="font-body-md text-body-md">Cargando partidos…</p>
        </div>
      ) : (
        <MatchList matches={visible} />
      )}
    </>
  );
}
