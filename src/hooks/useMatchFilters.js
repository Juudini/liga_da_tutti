import { useMemo, useState } from "react";

export function useMatchFilters(matches, userEmail) {
  const [filter, setFilter] = useState("todos");
  const [onlyMine, setOnlyMine] = useState(false);

  const visible = useMemo(
    () =>
      matches
        .filter((m) => (filter === "todos" ? true : m.status === filter))
        .filter((m) => (onlyMine ? m.createdBy === userEmail : true))
        .slice()
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [matches, filter, onlyMine, userEmail],
  );

  return { filter, setFilter, onlyMine, setOnlyMine, visible };
}
