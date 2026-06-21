import MatchCard from "./MatchCard";
import { useTournament } from "../../hooks/useTournament";
import { useAuth } from "../../hooks/useAuth";
import Icon from "../ui/Icon";

export default function MatchList({ matches }) {
  const { getTeamById, canModify, cancelMatch } = useTournament();
  const { user } = useAuth();

  if (!matches.length) {
    return (
      <div className="bg-surface-container/40 border border-white/5 rounded-xl p-xl text-center text-on-surface-variant flex flex-col items-center gap-sm">
        <span className="text-surface-variant">
          <Icon name="sports_soccer" size={40} />
        </span>
        <p className="font-body-md text-body-md">
          No hay partidos para mostrar.
        </p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-md">
      {matches.map((m) => (
        <MatchCard
          key={m.id}
          match={m}
          localTeam={getTeamById(m.localTeamId)}
          visitorTeam={getTeamById(m.visitorTeamId)}
          canEdit={canModify(m, user)}
          onCancel={() => cancelMatch(m.id)}
        />
      ))}
    </section>
  );
}
