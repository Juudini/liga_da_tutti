import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@shared/utils/cn";
import { ToastContext } from "./toastContext";

const DEFAULT_DURATION_MS = 4000;

const VARIANT_CLASSES = {
  success: "border-primary/40 bg-primary/10 text-foreground",
  error: "border-destructive/40 bg-destructive/10 text-foreground",
  info: "border-border bg-popover text-popover-foreground",
};

let toastIdCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (message, { variant = "info", duration = DEFAULT_DURATION_MS } = {}) => {
      const id = ++toastIdCounter;
      setToasts((current) => [...current, { id, message, variant }]);
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss],
  );

  const api = useMemo(
    () => ({
      show,
      success: (message, options) =>
        show(message, { ...options, variant: "success" }),
      error: (message, options) =>
        show(message, { ...options, variant: "error" }),
      info: (message, options) =>
        show(message, { ...options, variant: "info" }),
      dismiss,
    }),
    [show, dismiss],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {createPortal(
        <div
          className="fixed bottom-4 right-4 z-[100] flex w-full max-w-[24rem] flex-col gap-sm"
          aria-live="polite">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              role="status"
              className={cn(
                "flex items-start justify-between gap-sm rounded-md border p-sm font-body-md text-body-md shadow-md",
                VARIANT_CLASSES[toast.variant],
              )}>
              <span className="flex-1">{toast.message}</span>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Cerrar notificación"
                className="text-muted-foreground transition-colors hover:text-foreground">
                ×
              </button>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
