import { useMemo, useState } from "react";

export function useMatchFilters(matches, userId) {
  const [filter, setFilter] = useState("todos");
  const [onlyMine, setOnlyMine] = useState(false);

  const visible = useMemo(
    () =>
      matches
        .filter((m) => (filter === "todos" ? true : m.status === filter))
        .filter((m) =>
          onlyMine
            ? String(m.createdBy?.id ?? m.createdBy) === String(userId)
            : true,
        )
        .slice()
        .sort((a, b) => new Date(a.date) - new Date(b.date)),
    [matches, filter, onlyMine, userId],
  );

  return { filter, setFilter, onlyMine, setOnlyMine, visible };
}
