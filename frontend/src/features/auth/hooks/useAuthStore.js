import { create } from "zustand";
import { storage } from "@shared/utils/storage";
import { tokenStorage } from "@infrastructure/auth/tokenStorage";
import { setUnauthorizedHandler } from "@infrastructure/api/client";
import {
  login as loginRequest,
  register as registerRequest,
} from "../services/authService";

function deriveAuthFlags(user) {
  return {
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    isCommon: user?.role === "common",
  };
}

function readPersistedSession() {
  const token = tokenStorage.read();
  const user = storage.get("session");
  if (!token || !user) {
    return { user: null, token: null };
  }
  return { user, token };
}

const useAuthStore = create((set, get) => {
  const initial = readPersistedSession();

  const store = {
    user: initial.user,
    token: initial.token,
    status: initial.user ? "authenticated" : "idle", // idle | loading | authenticated | error
    error: null,
    ...deriveAuthFlags(initial.user),

    login: async (email, password) => {
      set({ status: "loading", error: null });
      const result = await loginRequest(email, password);

      if (!result.ok) {
        set({ status: "error", error: result.error });
        return { ok: false, error: result.error };
      }

      tokenStorage.save(result.token);
      storage.set("session", result.session);
      set({
        user: result.session,
        token: result.token,
        status: "authenticated",
        error: null,
        ...deriveAuthFlags(result.session),
      });
      return { ok: true, role: result.session.role };
    },

    register: async (email, password) => {
      set({ status: "loading", error: null });
      const result = await registerRequest(email, password);

      if (!result.ok) {
        set({ status: "error", error: result.error });
        return { ok: false, error: result.error };
      }

      tokenStorage.save(result.token);
      storage.set("session", result.session);
      set({
        user: result.session,
        token: result.token,
        status: "authenticated",
        error: null,
        ...deriveAuthFlags(result.session),
      });
      return { ok: true, role: result.session.role };
    },

    logout: () => {
      tokenStorage.clear();
      storage.remove("session");
      set({
        user: null,
        token: null,
        status: "idle",
        error: null,
        ...deriveAuthFlags(null),
      });
    },

    hydrateFromStorage: () => {
      const { user, token } = readPersistedSession();
      set({
        user,
        token,
        status: user ? "authenticated" : "idle",
        ...deriveAuthFlags(user),
      });
    },
  };

  setUnauthorizedHandler(() => get().logout());

  return store;
});

export default useAuthStore;
