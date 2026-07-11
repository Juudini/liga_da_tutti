import { useNavigate } from "react-router-dom";
import { Button, Icon } from "@shared/components/ui";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-md text-center p-margin-mobile bg-background text-foreground">
      <span className="text-primary">
        <Icon name="sentiment_dissatisfied" size={64} />
      </span>
      <h1 className="font-display-lg text-display-lg text-primary">404</h1>
      <h2 className="font-headline-md text-headline-md text-foreground">
        Página no encontrada
      </h2>
      <Button type="button" size="lg" onClick={() => navigate("/")}>
        Ir al inicio
      </Button>
    </div>
  );
}
