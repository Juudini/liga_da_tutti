import { useMemo, useState } from "react";

export function useTournamentCards(tournaments, matches, userId) {
  const [onlyMine, setOnlyMine] = useState(false);

  const cards = useMemo(() => {
    const scoped = onlyMine
      ? tournaments.filter((t) => String(t.createdBy) === String(userId))
      : tournaments;

    return scoped.map((tournament) => ({
      ...tournament,
      matchCount: matches.filter(
        (m) => String(m.tournament?.id) === String(tournament.id),
      ).length,
    }));
  }, [tournaments, matches, onlyMine, userId]);

  return { onlyMine, setOnlyMine, cards };
}
