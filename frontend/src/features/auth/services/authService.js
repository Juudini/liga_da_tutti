import { apiClient, ApiError } from "@infrastructure/api/client";
import { toSession } from "../models";

export async function login(email, password) {
  try {
    const data = await apiClient.post("/auth/login", { email, password });
    return { ok: true, session: toSession(data.user), token: data.token };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "No se pudo conectar con el servidor" };
  }
}

export async function register(email, password) {
  try {
    const data = await apiClient.post("/auth/register", { email, password });
    return { ok: true, session: toSession(data.user), token: data.token };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "No se pudo conectar con el servidor" };
  }
}

export async function fetchCurrentUser() {
  try {
    const data = await apiClient.get("/auth/me");
    return { ok: true, session: toSession(data.user) };
  } catch (error) {
    if (error instanceof ApiError) {
      return { ok: false, error: error.message };
    }
    return { ok: false, error: "No se pudo conectar con el servidor" };
  }
}
