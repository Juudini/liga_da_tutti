import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Card, Icon } from "@shared/components/ui";
import useAuthStore from "./hooks/useAuthStore";
import RegisterForm from "./components/RegisterForm";

export default function Register() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const registerUser = useAuthStore((s) => s.register);
  const navigate = useNavigate();
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/stats" : "/fixture"} replace />;
  }

  async function handleSubmit({ email, password }) {
    setAuthError("");
    setIsSubmitting(true);
    const result = await registerUser(email, password);
    setIsSubmitting(false);
    if (!result.ok) {
      setAuthError(result.error);
      return;
    }
    navigate("/fixture", { replace: true });
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
              Creá tu cuenta para sumarte
            </p>
          </div>

          <RegisterForm
            onSubmit={handleSubmit}
            authError={authError}
            isSubmitting={isSubmitting}
          />

          <p className="font-body-md text-body-md text-muted-foreground text-center mt-md">
            ¿Ya tenés cuenta?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium">
              Iniciá sesión
            </Link>
          </p>
        </Card>
      </main>
    </div>
  );
}
