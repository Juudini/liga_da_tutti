import { useMemo } from "react";
import { useTournament } from "../hooks/useTournament";
import { computeStats } from "../utils/statistics";
import StatCard from "../components/stats/StatCard";
import Icon from "../components/ui/Icon";

export default function StatsPage() {
  const { matches, teams } = useTournament();
  const stats = useMemo(() => computeStats(matches, teams), [matches, teams]);

  return (
    <>
      <header>
        <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">
          Panel de Control
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Resumen estadístico global de la liga · solo lectura.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-md">
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
          label="Programados"
          value={stats.scheduledCount}
          icon="schedule"
        />
        <StatCard
          label="Cancelados"
          value={stats.cancelledCount}
          icon="cancel"
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
      </section>

      <section className="bg-surface-container/60 backdrop-blur-xl rounded-xl border-t border-l border-white/10 glass-edge overflow-hidden">
        <div className="p-md border-b border-surface-variant/50 bg-surface-container-low/40 flex items-center gap-sm">
          <span className="text-primary">
            <Icon name="format_list_numbered" size={24} />
          </span>
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Tabla de Posiciones
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-highest/30 border-b border-surface-variant/50">
                <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant text-center w-16">
                  Pos
                </th>
                <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant">
                  Equipo
                </th>
                <th className="py-sm px-sm font-label-md text-label-md text-on-surface-variant text-center">
                  PJ
                </th>
                <th className="py-sm px-sm font-label-md text-label-md text-on-surface-variant text-center">
                  G
                </th>
                <th className="py-sm px-sm font-label-md text-label-md text-on-surface-variant text-center">
                  E
                </th>
                <th className="py-sm px-sm font-label-md text-label-md text-on-surface-variant text-center">
                  P
                </th>
                <th className="py-sm px-sm font-label-md text-label-md text-on-surface-variant text-center hidden sm:table-cell">
                  GF
                </th>
                <th className="py-sm px-sm font-label-md text-label-md text-on-surface-variant text-center hidden sm:table-cell">
                  GC
                </th>
                <th className="py-sm px-md font-label-md text-label-md text-primary font-bold text-center w-16">
                  Pts
                </th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md">
              {stats.standings.map((row, index) => {
                const isLeader = index === 0 && row.played > 0;
                return (
                  <tr
                    key={row.teamId}
                    className={`border-b border-surface-variant/30 hover:bg-surface-variant/20 transition-colors ${isLeader ? "bg-primary/5" : ""}`}>
                    <td className="py-sm px-md text-center">
                      {isLeader ? (
                        <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center mx-auto text-[12px]">
                          1
                        </span>
                      ) : (
                        <span className="text-on-surface-variant">
                          {index + 1}
                        </span>
                      )}
                    </td>
                    <td
                      className={`py-sm px-md flex items-center gap-sm font-bold ${isLeader ? "text-primary" : "text-on-surface"}`}>
                      <span className="w-8 h-8 rounded-full bg-surface-variant border border-white/10 flex items-center justify-center text-[16px] shrink-0">
                        {row.logo}
                      </span>
                      {row.name}
                    </td>
                    <td className="py-sm px-sm text-center text-on-surface">
                      {row.played}
                    </td>
                    <td className="py-sm px-sm text-center text-on-surface">
                      {row.won}
                    </td>
                    <td className="py-sm px-sm text-center text-on-surface">
                      {row.drawn}
                    </td>
                    <td className="py-sm px-sm text-center text-on-surface">
                      {row.lost}
                    </td>
                    <td className="py-sm px-sm text-center text-on-surface-variant hidden sm:table-cell">
                      {row.goalsFor}
                    </td>
                    <td className="py-sm px-sm text-center text-on-surface-variant hidden sm:table-cell">
                      {row.goalsAgainst}
                    </td>
                    <td
                      className={`py-sm px-md text-center font-bold text-[18px] ${isLeader ? "text-primary" : "text-on-surface"}`}>
                      {row.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
