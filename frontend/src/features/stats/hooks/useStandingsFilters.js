import { useMemo, useState } from "react";

export const STANDINGS_SORTABLE_COLUMNS = [
  { key: "name", label: "Equipo", align: "left" },
  { key: "played", label: "PJ" },
  { key: "won", label: "G" },
  { key: "drawn", label: "E" },
  { key: "lost", label: "P" },
  { key: "goalsFor", label: "GF", hideOnMobile: true },
  { key: "goalsAgainst", label: "GC", hideOnMobile: true },
  { key: "yellowCards", label: "TA", hideOnMobile: true },
  { key: "redCards", label: "TR", hideOnMobile: true },
  { key: "points", label: "Pts", highlight: true },
];

export const STANDINGS_DEFAULT_SORT = { key: "points", direction: "desc" };

function compareValues(a, b, key) {
  if (key === "name") return a.name.localeCompare(b.name);
  return (a[key] ?? 0) - (b[key] ?? 0);
}

export function useStandingsFilters(standings) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(STANDINGS_DEFAULT_SORT);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? standings.filter((row) => row.name.toLowerCase().includes(query))
      : standings;

    return [...filtered].sort((a, b) => {
      const comparison = compareValues(a, b, sort.key);
      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [standings, search, sort]);

  const isDefaultSort =
    sort.key === STANDINGS_DEFAULT_SORT.key &&
    sort.direction === STANDINGS_DEFAULT_SORT.direction;

  function toggleSort(key) {
    setSort((prev) => {
      if (prev.key !== key) {
        return { key, direction: key === "name" ? "asc" : "desc" };
      }
      return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
    });
  }

  return { search, setSearch, sort, toggleSort, isDefaultSort, visible };
}
