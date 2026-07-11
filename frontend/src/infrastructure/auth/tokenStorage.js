const TOKEN_KEY = "ligadatutti:token";

export const tokenStorage = {
  save(token) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {}
  },
  read() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
  },
};
