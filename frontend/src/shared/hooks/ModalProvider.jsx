import { useCallback, useMemo, useState } from "react";
import { Dialog } from "@shared/components/ui";
import { ModalContext } from "./modalContext";

export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null); // { render, resolve }

  const close = useCallback((value) => {
    setModal((current) => {
      current?.resolve?.(value);
      return null;
    });
  }, []);

  const open = useCallback((render) => {
    return new Promise((resolve) => {
      setModal((current) => {
        // Si ya había un modal abierto, se cancela antes de abrir el nuevo.
        current?.resolve?.(undefined);
        return { render, resolve };
      });
    });
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen) => {
      if (!nextOpen) close(undefined);
    },
    [close],
  );

  const api = useMemo(() => ({ open, close }), [open, close]);

  return (
    <ModalContext.Provider value={api}>
      {children}
      <Dialog open={modal !== null} onOpenChange={handleOpenChange}>
        <Dialog.Content>
          {modal ? modal.render({ close }) : null}
        </Dialog.Content>
      </Dialog>
    </ModalContext.Provider>
  );
}
