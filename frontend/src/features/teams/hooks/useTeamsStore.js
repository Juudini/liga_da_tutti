import { create } from "zustand";
import * as teamsService from "../services/teamsService";

const useTeamsStore = create((set, get) => ({
  teams: [],
  status: "idle", // idle | loading | success | error
  error: null,

  fetchTeams: async () => {
    set({ status: "loading", error: null });
    const result = await teamsService.fetchTeams();
    if (result.ok) {
      set({ teams: result.teams, status: "success" });
    } else {
      set({ status: "error", error: result.error });
    }
  },

  getTeamById: (id) => get().teams.find((t) => String(t.id) === String(id)),

  addTeam: async (data) => {
    const result = await teamsService.createTeam(data);
    if (result.ok) {
      set({ teams: [...get().teams, result.team] });
    }
    return result;
  },

  updateTeam: async (id, data) => {
    const result = await teamsService.updateTeam(id, data);
    if (result.ok) {
      set({
        teams: get().teams.map((t) =>
          String(t.id) === String(id) ? result.team : t,
        ),
      });
    }
    return result;
  },

  deleteTeam: async (id) => {
    const result = await teamsService.deleteTeam(id);
    if (result.ok) {
      set({ teams: get().teams.filter((t) => String(t.id) !== String(id)) });
    }
    return result;
  },

  canModify: (team, user) =>
    user?.role === "admin" || String(team?.createdBy) === String(user?.id),
}));

export default useTeamsStore;
