import { apiClient, ApiError } from "@infrastructure/api/client";

export async function fetchMatches() {
  try {
    const data = await apiClient.get("/matches");
    return { ok: true, matches: data.matches };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "No se pudo conectar con el servidor" };
  }
}

export async function fetchMatchById(id) {
  try {
    const data = await apiClient.get(`/matches/${id}`);
    return { ok: true, match: data.match };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "No se pudo conectar con el servidor" };
  }
}

export async function createMatch(data) {
  try {
    const res = await apiClient.post("/matches", data);
    return { ok: true, match: res.match };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message, errors: error.errors };
    }
    return { ok: false, error: "No se pudo conectar con el servidor" };
  }
}

export async function updateMatch(id, data) {
  try {
    const res = await apiClient.put(`/matches/${id}`, data);
    return { ok: true, match: res.match };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message, errors: error.errors };
    }
    return { ok: false, error: "No se pudo conectar con el servidor" };
  }
}

export async function deleteMatch(id) {
  try {
    await apiClient.del(`/matches/${id}`);
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "No se pudo conectar con el servidor" };
  }
}
