import { apiClient, ApiError } from "@infrastructure/api/client";

export async function fetchStats(tournamentId) {
  try {
    const query = tournamentId
      ? `?tournamentId=${encodeURIComponent(tournamentId)}`
      : "";
    const data = await apiClient.get(`/stats${query}`);
    return { ok: true, stats: data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "No se pudo conectar con el servidor" };
  }
}
