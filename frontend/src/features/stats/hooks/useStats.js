import { useEffect, useState } from "react";
import { fetchStats } from "../services/statsService";

export function useStats(tournamentId, { enabled = true } = {}) {
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setStats(null);
      setStatus("idle");
      setError(null);
      return undefined;
    }

    let cancelled = false;

    async function load() {
      setStatus("loading");
      setError(null);
      const result = await fetchStats(tournamentId);
      if (cancelled) return;

      if (result.ok) {
        setStats(result.stats);
        setStatus("success");
      } else {
        setError(result.error);
        setStatus("error");
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [tournamentId, enabled]);

  return { stats, status, error };
}
