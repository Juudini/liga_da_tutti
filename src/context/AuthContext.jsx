import { useState } from "react";
import users from "../data/users.json";
import { storage } from "../utils/storage";
import { AuthContext } from "./contexts";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.get("session"));

  function login(email, password) {
    const normalized = email.trim().toLowerCase();
    const found = users.find(
      (u) => u.email.toLowerCase() === normalized && u.password === password,
    );
    if (!found) {
      return { ok: false, error: "Email o contraseña incorrectos" };
    }

    const session = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
    };

    setUser(session);
    storage.set("session", session);
    return { ok: true, role: found.role };
  }

  function logout() {
    setUser(null);
    storage.remove("session");
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    isCommon: user?.role === "common",
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
