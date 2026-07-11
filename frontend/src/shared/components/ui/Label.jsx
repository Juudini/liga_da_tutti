import { cn } from "@shared/utils/cn";

export default function Label({ className, ...props }) {
  return (
    <label
      className={cn(
        "font-label-md text-label-md text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
