import { Button, Icon } from "@shared/components/ui";

export default function ErrorFallback({ error, onReset }) {
  const message =
    (error && (error.message || error.statusText)) ||
    (typeof error === "string" ? error : null) ||
    "Error desconocido";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-md text-center p-margin-mobile bg-background text-foreground">
      <span className="text-destructive">
        <Icon name="cancel" size={64} />
      </span>
      <h1 className="font-headline-md text-headline-md text-foreground">
        Algo salió mal
      </h1>
      <p className="font-body-md text-body-md text-muted-foreground max-w-[28rem]">
        Hemos registrado este error y nuestro equipo lo revisará.
      </p>
      <details className="max-w-[28rem] w-full text-left">
        <summary className="cursor-pointer font-label-md text-label-md text-primary">
          Detalles del error
        </summary>
        <pre className="mt-sm rounded-md border border-border bg-card p-sm text-left text-[12px] text-muted-foreground overflow-auto whitespace-pre-wrap">
          {message}
        </pre>
      </details>
      <Button type="button" size="lg" onClick={onReset}>
        Volver al inicio
      </Button>
    </div>
  );
}
