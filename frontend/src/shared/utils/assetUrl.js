const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

const SERVER_ORIGIN = API_URL.replace(/\/api\/?$/, "");

// Resuelve el `logoUrl` relativo que devuelve el Backend_API
export function resolveAssetUrl(logoUrl) {
  if (!logoUrl) return null;
  if (/^https?:\/\//.test(logoUrl)) return logoUrl;
  return `${SERVER_ORIGIN}${logoUrl}`;
}
