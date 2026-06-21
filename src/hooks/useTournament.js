import { useContext } from "react";
import { TournamentContext } from "../context/contexts";

export function useTournament() {
  const ctx = useContext(TournamentContext);
  if (!ctx)
    throw new Error("useTournament debe usarse dentro de <TournamentProvider>");
  return ctx;
}
