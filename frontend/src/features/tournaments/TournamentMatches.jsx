import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Icon } from "@shared/components/ui";
import useMatchesStore from "@features/matches/hooks/useMatchesStore";
import useTournamentsStore from "./hooks/useTournamentsStore";
import useAuthStore from "@features/auth/hooks/useAuthStore";
import { useStats } from "@features/stats/hooks/useStats";
import StatCard from "@features/stats/components/StatCard";
import StandingsTable from "@features/stats/components/StandingsTable";
import MatchList from "@features/matches/components/MatchList";

export default function TournamentMatches() {
  const { id } = useParams();
  const matches = useMatchesStore((s) => s.matches);
  const status = useMatchesStore((s) => s.status);
  const fetchMatches = useMatchesStore((s) => s.fetchMatches);
  const tournaments = useTournamentsStore((s) => s.tournaments);
  const fetchTournaments = useTournamentsStore((s) => s.fetchTournaments);
  const canModifyTournament = useTournamentsStore((s) => s.canModify);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    fetchMatches();
    fetchTournaments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tournament = tournaments.find((t) => String(t.id) === String(id));
  const tournamentMatches = matches.filter(
    (m) => String(m.tournament?.id) === String(id),
  );
  const canViewStats =
    Boolean(tournament) && canModifyTournament(tournament, user);

  const { stats } = useStats(id, { enabled: canViewStats });

  return (
    <>
      <Link
        to="/fixture"
        className="flex items-center gap-xs font-label-md text-label-md text-muted-foreground hover:text-primary transition-colors w-fit">
        <Icon name="arrow_back" size={18} />
        Volver al fixture
      </Link>

      <header className="flex items-center gap-sm">
        <span className="w-11 h-11 rounded-full bg-primary/10 border border-border flex items-center justify-center shrink-0 text-primary">
          <Icon name="trophy" size={22} />
        </span>
        <div>
          <h1 className="font-display-lg text-display-lg text-foreground">
            {tournament?.name ?? "Torneo"}
          </h1>
          <p className="font-body-md text-body-md text-muted-foreground">
            {tournamentMatches.length}{" "}
            {tournamentMatches.length === 1 ? "partido" : "partidos"} en este
            torneo.
          </p>
        </div>
      </header>

      {canViewStats && stats && (
        <section className="flex flex-col gap-sm">
          <h2 className="font-headline-md text-headline-md text-foreground flex items-center gap-xs">
            <Icon name="leaderboard" size={20} />
            Estadísticas del torneo
          </h2>

          {stats.totalMatches === 0 ? (
            <div className="bg-card border border-border rounded-lg p-xl flex flex-col items-center gap-sm text-center text-muted-foreground">
              <Icon name="leaderboard" size={32} />
              <p className="font-body-md text-body-md">
                No hay suficientes datos para calcular estadísticas de este
                torneo todavía.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-sm">
                <StatCard
                  label="Total Partidos"
                  value={stats.totalMatches}
                  icon="list"
                />
                <StatCard
                  label="Finalizados"
                  value={stats.finishedCount}
                  icon="check_circle"
                />
                <StatCard
                  label="Goles Totales"
                  value={stats.totalGoals}
                  icon="sports_soccer"
                  accent
                />
                <StatCard
                  label="Promedio Goles"
                  value={stats.avgGoals}
                  icon="leaderboard"
                  accent
                />
              </div>

              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <StandingsTable standings={stats.standings} />
              </div>
            </>
          )}
        </section>
      )}

      {status === "loading" && matches.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-xl text-center text-muted-foreground">
          <p className="font-body-md text-body-md">Cargando partidos…</p>
        </div>
      ) : (
        <MatchList matches={tournamentMatches} />
      )}
    </>
  );
}
