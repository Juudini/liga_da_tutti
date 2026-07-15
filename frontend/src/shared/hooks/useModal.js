import { useContext } from "react";
import { ModalContext } from "./modalContext";

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal debe usarse dentro de <ModalProvider>");
  }
  return ctx;
}
