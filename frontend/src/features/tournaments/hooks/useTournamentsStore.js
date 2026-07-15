import { create } from "zustand";
import * as tournamentsService from "../services/tournamentsService";

const useTournamentsStore = create((set, get) => ({
  tournaments: [],
  status: "idle", // idle | loading | success | error
  error: null,

  fetchTournaments: async () => {
    set({ status: "loading", error: null });
    const result = await tournamentsService.fetchTournaments();
    if (result.ok) {
      set({ tournaments: result.tournaments, status: "success" });
    } else {
      set({ status: "error", error: result.error });
    }
  },

  getTournamentById: (id) =>
    get().tournaments.find((t) => String(t.id) === String(id)),

  addTournament: async (data) => {
    const result = await tournamentsService.createTournament(data);
    if (result.ok) {
      set({ tournaments: [...get().tournaments, result.tournament] });
    }
    return result;
  },

  updateTournament: async (id, data) => {
    const result = await tournamentsService.updateTournament(id, data);
    if (result.ok) {
      set({
        tournaments: get().tournaments.map((t) =>
          String(t.id) === String(id) ? result.tournament : t,
        ),
      });
    }
    return result;
  },

  deleteTournament: async (id) => {
    const result = await tournamentsService.deleteTournament(id);
    if (result.ok) {
      set({
        tournaments: get().tournaments.filter(
          (t) => String(t.id) !== String(id),
        ),
      });
    }
    return result;
  },

  canModify: (tournament, user) =>
    user?.role === "admin" ||
    String(tournament?.createdBy) === String(user?.id),
}));

export default useTournamentsStore;
