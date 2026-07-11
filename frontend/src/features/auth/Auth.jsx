import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Card, Icon } from "@shared/components/ui";
import useAuthStore from "./hooks/useAuthStore";
import LoginForm from "./components/LoginForm";

export default function Auth() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/stats" : "/fixture"} replace />;
  }

  async function handleSubmit({ email, password }) {
    setAuthError("");
    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);
    if (!result.ok) {
      setAuthError(result.error);
      return;
    }
    navigate(result.role === "admin" ? "/stats" : "/fixture", {
      replace: true,
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-margin-mobile md:p-margin-desktop bg-background">
      <main className="w-full max-w-[28rem]">
        <Card className="p-md md:p-lg">
          <div className="text-center mb-xl flex flex-col items-center">
            <span className="text-primary mb-sm">
              <Icon name="sports_soccer" size={48} />
            </span>
            <h1 className="font-headline-lg text-headline-lg text-foreground tracking-tight uppercase">
              Liga da Tutti
            </h1>
            <p className="font-body-md text-body-md text-muted-foreground mt-xs">
              Bienvenido al terreno de juego
            </p>
          </div>

          <LoginForm
            onSubmit={handleSubmit}
            authError={authError}
            isSubmitting={isSubmitting}
          />

          <p className="font-body-md text-body-md text-muted-foreground text-center mt-md">
            ¿No tenés cuenta?{" "}
            <Link
              to="/register"
              className="text-primary hover:underline font-medium">
              Registrate
            </Link>
          </p>
        </Card>
      </main>
    </div>
  );
}
