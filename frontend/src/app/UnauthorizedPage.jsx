import { useNavigate } from "react-router-dom";
import useAuthStore from "@features/auth/hooks/useAuthStore";
import { Button, Icon } from "@shared/components/ui";

export default function UnauthorizedPage() {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-md text-center">
      <span className="text-destructive">
        <Icon name="block" size={64} />
      </span>
      <h1 className="font-display-lg text-display-lg text-destructive">403</h1>
      <h2 className="font-headline-md text-headline-md text-foreground">
        Acceso denegado
      </h2>
      <p className="font-body-md text-body-md text-muted-foreground max-w-[28rem]">
        Tu rol actual no tiene permiso para acceder a esta sección.
      </p>
      <Button
        type="button"
        size="lg"
        onClick={() => navigate(isAdmin ? "/stats" : "/fixture")}>
        Volver al inicio
      </Button>
    </div>
  );
}
