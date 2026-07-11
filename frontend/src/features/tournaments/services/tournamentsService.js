import { apiClient, ApiError } from "@infrastructure/api/client";

export async function fetchTournaments() {
  try {
    const data = await apiClient.get("/tournaments");
    return { ok: true, tournaments: data.tournaments };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "No se pudo conectar con el servidor" };
  }
}

export async function createTournament(data) {
  try {
    const res = await apiClient.post("/tournaments", data);
    return { ok: true, tournament: res.tournament };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message, errors: error.errors };
    }
    return { ok: false, error: "No se pudo conectar con el servidor" };
  }
}

export async function updateTournament(id, data) {
  try {
    const res = await apiClient.put(`/tournaments/${id}`, data);
    return { ok: true, tournament: res.tournament };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message, errors: error.errors };
    }
    return { ok: false, error: "No se pudo conectar con el servidor" };
  }
}

export async function deleteTournament(id) {
  try {
    await apiClient.del(`/tournaments/${id}`);
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "No se pudo conectar con el servidor" };
  }
}
