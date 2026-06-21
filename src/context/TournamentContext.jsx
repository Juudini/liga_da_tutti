import { useEffect, useState } from "react";
import seedTeams from "../data/teams.json";
import seedMatches from "../data/matches.json";
import { storage } from "../utils/storage";
import { TournamentContext } from "./contexts";

export function TournamentProvider({ children }) {
  const [teams] = useState(() => storage.get("teams") ?? seedTeams);
  const [matches, setMatches] = useState(
    () => storage.get("matches") ?? seedMatches,
  );

  useEffect(() => {
    storage.set("matches", matches);
  }, [matches]);

  const getTeamById = (id) => teams.find((t) => t.id === Number(id));
  const getMatchById = (id) => matches.find((m) => m.id === Number(id));

  function addMatch(data, currentUserEmail) {
    const finished = data.status === "finalizado";
    const newMatch = {
      id: Date.now(),
      localTeamId: Number(data.localTeamId),
      visitorTeamId: Number(data.visitorTeamId),
      date: data.date,
      stadium: data.stadium.trim(),
      status: data.status || "programado",
      localGoals: finished ? Number(data.localGoals) : null,
      visitorGoals: finished ? Number(data.visitorGoals) : null,
      createdBy: currentUserEmail,
    };
    setMatches((prev) => [...prev, newMatch]);
    return newMatch;
  }

  function updateMatch(id, data) {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== Number(id)) return m;
        const status = data.status ?? m.status;
        const finished = status === "finalizado";
        return {
          ...m,
          localTeamId:
            data.localTeamId != null ? Number(data.localTeamId) : m.localTeamId,
          visitorTeamId:
            data.visitorTeamId != null
              ? Number(data.visitorTeamId)
              : m.visitorTeamId,
          date: data.date ?? m.date,
          stadium: data.stadium != null ? data.stadium.trim() : m.stadium,
          status,
          localGoals: finished ? Number(data.localGoals) : null,
          visitorGoals: finished ? Number(data.visitorGoals) : null,
        };
      }),
    );
  }

  function deleteMatch(id) {
    setMatches((prev) => prev.filter((m) => m.id !== Number(id)));
  }

  function cancelMatch(id) {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === Number(id)
          ? { ...m, status: "cancelado", localGoals: null, visitorGoals: null }
          : m,
      ),
    );
  }

  function canModify(match, user) {
    return user?.role === "common" && match?.createdBy === user?.email;
  }

  const value = {
    teams,
    matches,
    getTeamById,
    getMatchById,
    addMatch,
    updateMatch,
    deleteMatch,
    cancelMatch,
    canModify,
  };

  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
}
