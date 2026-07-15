import { useEffect, useState } from "react";
import { Icon, Select } from "@shared/components/ui";
import { useToast } from "@shared/hooks/useToast";
import { useStats } from "./hooks/useStats";
import useTournamentsStore from "@features/tournaments/hooks/useTournamentsStore";
import StatCard from "./components/StatCard";
import StandingsTable from "./components/StandingsTable";

export default function Stats() {
  const [tournamentId, setTournamentId] = useState("");
  const { stats, status, error } = useStats(tournamentId || undefined);
  const tournaments = useTournamentsStore((s) => s.tournaments);
  const fetchTournaments = useTournamentsStore((s) => s.fetchTournaments);
  const toast = useToast();

  useEffect(() => {
    fetchTournaments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === "error" && error) {
      toast.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, error]);

  const leaderName = stats?.standings?.[0]?.name ?? "—";

  return (
    <>
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-sm">
        <div>
          <h1 className="font-display-lg text-display-lg text-foreground mb-xs">
            Panel de Control
          </h1>
          <p className="font-body-lg text-body-lg text-muted-foreground">
            Resumen estadístico de la liga · solo lectura.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <Select
            value={tournamentId}
            onValueChange={setTournamentId}
            placeholder="Todos los torneos">
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="">Todos los torneos</Select.Item>
              {tournaments.map((t) => (
                <Select.Item key={t.id} value={String(t.id)}>
                  {t.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
      </header>

      {!stats ? (
        <div className="bg-card border border-border rounded-lg p-xl text-center text-muted-foreground">
          <p className="font-body-md text-body-md">
            {status === "error"
              ? "No se pudieron cargar las estadísticas."
              : "Cargando estadísticas…"}
          </p>
        </div>
      ) : stats.totalMatches === 0 ? (
        <div className="bg-card border border-border rounded-lg p-xl flex flex-col items-center gap-sm text-center text-muted-foreground">
          <Icon name="leaderboard" size={32} />
          <p className="font-body-md text-body-md">
            No hay suficientes datos para calcular estadísticas de este torneo
            todavía.
          </p>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-sm">
            <StatCard
              compact
              label="Total Partidos"
              value={stats.totalMatches}
              icon="list"
            />
            <StatCard
              compact
              label="Finalizados"
              value={stats.finishedCount}
              icon="check_circle"
            />
            <StatCard
              compact
              label="Programados"
              value={stats.scheduledCount}
              icon="schedule"
            />
            <StatCard
              compact
              label="Cancelados"
              value={stats.cancelledCount}
              icon="cancel"
            />
            <StatCard
              compact
              label="Goles Totales"
              value={stats.totalGoals}
              icon="sports_soccer"
              accent
            />
            <StatCard
              compact
              label="Promedio Goles"
              value={stats.avgGoals}
              icon="leaderboard"
              accent
            />
            <StatCard
              compact
              label="Tarjetas Amarillas"
              value={stats.totalYellowCards}
              icon="crop_portrait"
            />
            <StatCard
              compact
              label="Tarjetas Rojas"
              value={stats.totalRedCards}
              icon="crop_portrait"
            />
            <StatCard
              compact
              label="Total Torneos"
              value={stats.totalTournaments}
              icon="trophy"
            />
            <StatCard
              compact
              label="Equipo Líder"
              value={leaderName}
              valueClassName="text-headline-md break-words"
              icon="leaderboard"
              accent
            />
          </section>

          <section className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-md border-b border-border flex items-center gap-sm">
              <span className="text-primary">
                <Icon name="format_list_numbered" size={24} />
              </span>
              <h2 className="font-headline-md text-headline-md text-foreground">
                Tabla de Posiciones
              </h2>
            </div>
            <StandingsTable standings={stats.standings} />
          </section>
        </>
      )}
    </>
  );
}
