import { forwardRef } from "react";
import { cn } from "@shared/utils/cn";

/**
 * Input base. Estilo shadcn: borde sutil, plano, foco con ring.
 * Se usa junto a React Hook Form via `register` (ref + onChange/onBlur/name).
 */
const Input = forwardRef(function Input(
  { className, type = "text", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 font-body-md text-body-md text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-cancel-button]:appearance-none",
        className,
      )}
      {...props}
    />
  );
});

export default Input;
