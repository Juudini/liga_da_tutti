import { forwardRef } from "react";
import { cn } from "@shared/utils/cn";

const VARIANT_CLASSES = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border border-border bg-transparent text-foreground hover:bg-muted",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  link: "bg-transparent text-primary underline-offset-4 hover:underline h-auto p-0",
};

const SIZE_CLASSES = {
  sm: "h-8 px-3 gap-1.5 text-[13px]",
  default: "h-10 px-4 gap-2",
  lg: "h-11 px-6 gap-2",
  icon: "h-10 w-10 p-0",
};

const Button = forwardRef(function Button(
  {
    className,
    variant = "default",
    size = "default",
    type = "button",
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-label-md text-label-md font-bold whitespace-nowrap transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    />
  );
});

export default Button;
