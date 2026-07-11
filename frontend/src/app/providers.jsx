import { ErrBoundary } from "@shared/components/ErrBoundary";
import { ToastProvider } from "@shared/components/ui";
import { ModalProvider } from "@shared/hooks/ModalProvider";

export function AppProviders({ children }) {
  return (
    <ErrBoundary>
      <ToastProvider>
        <ModalProvider>{children}</ModalProvider>
      </ToastProvider>
    </ErrBoundary>
  );
}
