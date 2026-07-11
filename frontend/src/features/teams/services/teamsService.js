import { apiClient, ApiError } from "@infrastructure/api/client";

export async function fetchTeams() {
  try {
    const data = await apiClient.get("/teams");
    return { ok: true, teams: data.teams };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "No se pudo conectar con el servidor" };
  }
}

function toFormData({ name, dt, logoFile }) {
  const formData = new FormData();
  formData.append("name", name);
  if (dt) formData.append("dt", dt);
  if (logoFile) formData.append("logo", logoFile);
  return formData;
}

export async function createTeam(data) {
  try {
    const res = await apiClient.post("/teams", toFormData(data));
    return { ok: true, team: res.team };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message, errors: error.errors };
    }
    return { ok: false, error: "No se pudo conectar con el servidor" };
  }
}

export async function updateTeam(id, data) {
  try {
    const res = await apiClient.put(`/teams/${id}`, toFormData(data));
    return { ok: true, team: res.team };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message, errors: error.errors };
    }
    return { ok: false, error: "No se pudo conectar con el servidor" };
  }
}

export async function deleteTeam(id) {
  try {
    await apiClient.del(`/teams/${id}`);
    return { ok: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "No se pudo conectar con el servidor" };
  }
}
