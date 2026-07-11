import { cn } from "@shared/utils/cn";

const VARIANT_CLASSES = {
  default: "bg-primary/15 text-primary border-transparent",
  secondary: "bg-muted text-muted-foreground border-transparent",
  outline: "bg-transparent text-foreground border-border",
  destructive: "bg-destructive/15 text-destructive border-transparent",
};

export default function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-label-md text-[11px] font-bold uppercase tracking-wide",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  );
}
