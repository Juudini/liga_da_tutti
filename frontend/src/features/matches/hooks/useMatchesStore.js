import { create } from "zustand";
import * as matchesService from "../services/matchesService";

const useMatchesStore = create((set, get) => ({
  matches: [],
  status: "idle", // idle | loading | success | error
  error: null,

  fetchMatches: async () => {
    set({ status: "loading", error: null });
    const result = await matchesService.fetchMatches();
    if (result.ok) {
      set({ matches: result.matches, status: "success" });
    } else {
      set({ status: "error", error: result.error });
    }
  },

  getMatchById: (id) => get().matches.find((m) => String(m.id) === String(id)),

  addMatch: async (data) => {
    const result = await matchesService.createMatch(data);
    if (result.ok) {
      set({ matches: [...get().matches, result.match] });
    }
    return result;
  },

  updateMatch: async (id, data) => {
    const result = await matchesService.updateMatch(id, data);
    if (result.ok) {
      set({
        matches: get().matches.map((m) =>
          String(m.id) === String(id) ? result.match : m,
        ),
      });
    }
    return result;
  },

  deleteMatch: async (id) => {
    const result = await matchesService.deleteMatch(id);
    if (result.ok) {
      set({
        matches: get().matches.filter((m) => String(m.id) !== String(id)),
      });
    }
    return result;
  },

  cancelMatch: async (id) => {
    const match = get().getMatchById(id);
    if (!match) return { ok: false, error: "Partido no encontrado" };
    return get().updateMatch(id, {
      localTeam: match.localTeam?.id ?? match.localTeam,
      visitorTeam: match.visitorTeam?.id ?? match.visitorTeam,
      date: match.date,
      stadium: match.stadium,
      status: "cancelado",
      localGoals: null,
      visitorGoals: null,
    });
  },

  canModify: (match, user) =>
    user?.role === "common" &&
    String(match?.createdBy?.id ?? match?.createdBy) === String(user?.id),
}));

export default useMatchesStore;
