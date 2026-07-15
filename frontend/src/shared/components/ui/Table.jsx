import { cn } from "@shared/utils/cn";

function Table({ className, ...props }) {
  return (
    <div className="w-full overflow-auto">
      <table
        className={cn(
          "w-full border-collapse font-body-md text-body-md text-foreground",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }) {
  return (
    <thead className={cn("border-b border-border", className)} {...props} />
  );
}

function TableBody({ className, ...props }) {
  return (
    <tbody className={cn("divide-y divide-border", className)} {...props} />
  );
}

function TableRow({ className, ...props }) {
  return (
    <tr
      className={cn("transition-colors hover:bg-muted/50", className)}
      {...props}
    />
  );
}

function TableCell({ className, head = false, ...props }) {
  const Component = head ? "th" : "td";
  return (
    <Component
      scope={head ? "col" : undefined}
      className={cn(
        "px-3 py-2 text-left align-middle",
        head
          ? "font-label-md text-label-md text-muted-foreground uppercase tracking-wide"
          : "font-body-md text-body-md text-foreground",
        className,
      )}
      {...props}
    />
  );
}

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;

export default Table;
export { TableHeader, TableBody, TableRow, TableCell };
