import { useMemo, useState } from "react";

export function useTournamentFilters(tournaments) {
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return tournaments;
    return tournaments.filter((tournament) =>
      tournament.name.toLowerCase().includes(query),
    );
  }, [tournaments, search]);

  return { search, setSearch, visible };
}
