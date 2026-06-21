import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { validateLogin } from "../utils/validators";
import Icon from "../components/ui/Icon";

const INPUT_CLASS =
  "w-full bg-surface-container-lowest/80 border border-outline-variant rounded-full py-sm pl-[44px] pr-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body-md text-body-md transition-all duration-200";

export default function LoginPage() {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState("");

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/stats" : "/fixture"} replace />;
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setAuthError("");
    const result = validateLogin(form);
    setErrors(result.errors);
    if (!result.valid) return;
    const res = login(form.email, form.password);
    if (!res.ok) {
      setAuthError(res.error);
      return;
    }
    navigate(res.role === "admin" ? "/stats" : "/fixture", { replace: true });
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-margin-mobile md:p-margin-desktop overflow-hidden bg-surface">
      <div className="absolute inset-0 z-0 pointer-events-none login-bg"></div>

      <main className="w-full max-w-[28rem] z-10 relative">
        <div className="bg-surface-container-high/60 backdrop-blur-xl border-t border-l border-white/10 rounded-xl p-md md:p-lg shadow-2xl flex flex-col">
          <div className="text-center mb-xl flex flex-col items-center">
            <span className="text-primary mb-sm">
              <Icon name="sports_soccer" size={48} />
            </span>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight uppercase">
              Liga da Tutti
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
              Bienvenido al terreno de juego
            </p>
          </div>

          <form
            className="flex flex-col gap-md"
            onSubmit={handleSubmit}
            noValidate>
            <div className="flex flex-col gap-xs">
              <label
                htmlFor="email"
                className="font-label-md text-label-md text-on-surface-variant ml-sm">
                Correo electrónico
              </label>
              <div className="relative">
                <span className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  <Icon name="mail" size={20} />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jugador@equipo.com"
                  autoComplete="username"
                  className={INPUT_CLASS}
                />
              </div>
              {errors.email && (
                <span className="font-label-md text-label-md text-error ml-sm">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-xs">
              <label
                htmlFor="password"
                className="font-label-md text-label-md text-on-surface-variant ml-sm">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
                  <Icon name="lock" size={20} />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={INPUT_CLASS}
                />
              </div>
              {errors.password && (
                <span className="font-label-md text-label-md text-error ml-sm">
                  {errors.password}
                </span>
              )}
            </div>

            {authError && (
              <p className="font-body-md text-body-md text-error bg-error-container/20 border border-error/30 rounded-md px-sm py-xs text-center">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="mt-sm bg-primary-container text-on-primary-container font-label-md text-label-md rounded-full py-[14px] px-md w-full uppercase tracking-widest glow-primary hover:bg-primary transition-all duration-300 flex items-center justify-center gap-xs font-bold cursor-pointer">
              Ingresar
              <Icon name="arrow_forward" size={18} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
