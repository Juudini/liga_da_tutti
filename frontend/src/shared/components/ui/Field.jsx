import { cn } from "@shared/utils/cn";
import Label from "./Label";

export default function Field({ label, htmlFor, error, className, children }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {error && (
        <span className="font-label-md text-label-md text-destructive">
          {error}
        </span>
      )}
    </div>
  );
}
