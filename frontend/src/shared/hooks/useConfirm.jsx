import { useCallback } from "react";
import { Button, Dialog } from "@shared/components/ui";
import { useModal } from "./useModal";

export function useConfirm() {
  const { open } = useModal();

  return useCallback(
    ({
      title = "¿Confirmar acción?",
      description,
      confirmLabel = "Confirmar",
      cancelLabel = "Cancelar",
      variant = "default",
    } = {}) => {
      return open(({ close }) => (
        <>
          <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
          </Dialog.Header>
          {description && (
            <p className="font-body-md text-body-md text-muted-foreground">
              {description}
            </p>
          )}
          <Dialog.Footer>
            <Button variant="ghost" onClick={() => close(false)}>
              {cancelLabel}
            </Button>
            <Button
              variant={variant === "destructive" ? "destructive" : "default"}
              onClick={() => close(true)}>
              {confirmLabel}
            </Button>
          </Dialog.Footer>
        </>
      )).then((result) => result === true);
    },
    [open],
  );
}
