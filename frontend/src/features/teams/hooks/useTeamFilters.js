import { useMemo, useState } from "react";

export function useTeamFilters(teams) {
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return teams;
    return teams.filter((team) => team.name.toLowerCase().includes(query));
  }, [teams, search]);

  return { search, setSearch, visible };
}
