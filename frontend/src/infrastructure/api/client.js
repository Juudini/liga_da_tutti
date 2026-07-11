import { tokenStorage } from "@infrastructure/auth/tokenStorage";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

let unauthorizedHandler = () => {};

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

async function parseJsonSafe(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function request(method, path, body) {
  const headers = { Accept: "application/json" };
  const token = tokenStorage.read();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const init = { method, headers };
  if (body !== undefined) {
    if (body instanceof FormData) {
      init.body = body;
    } else {
      headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(body);
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, init);
  const data = await parseJsonSafe(res);

  if (!res.ok) {
    const message = data?.message ?? "Error al comunicarse con el servidor";
    const error = new ApiError(res.status, message, data?.errors);

    if (res.status === 401 && token) {
      unauthorizedHandler();
    }

    throw error;
  }

  return data;
}

export const apiClient = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  del: (path) => request("DELETE", path),
};
