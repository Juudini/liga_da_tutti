import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@shared/utils/cn";

const SelectContext = createContext(null);

function useSelectContext(component) {
  const ctx = useContext(SelectContext);
  if (!ctx) {
    throw new Error(`Select.${component} debe usarse dentro de <Select>`);
  }
  return ctx;
}

function Select({
  value,
  onValueChange,
  defaultValue,
  placeholder,
  disabled,
  className,
  children,
}) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [labels, setLabels] = useState({});
  const rootRef = useRef(null);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const selectValue = useCallback(
    (nextValue) => {
      if (!isControlled) setInternalValue(nextValue);
      onValueChange?.(nextValue);
      setOpen(false);
    },
    [isControlled, onValueChange],
  );

  const registerLabel = useCallback((itemValue, label) => {
    setLabels((prev) => {
      if (prev[itemValue] === label) return prev;
      return { ...prev, [itemValue]: label };
    });
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <SelectContext.Provider
      value={{
        open,
        setOpen,
        value: currentValue,
        selectValue,
        registerLabel,
        labels,
        placeholder,
        disabled,
      }}>
      <div
        ref={rootRef}
        className={cn("relative inline-block w-full", className)}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

function SelectTrigger({ className, ...props }) {
  const { open, setOpen, value, labels, placeholder, disabled } =
    useSelectContext("Trigger");
  const label = value ? (labels[value] ?? value) : null;

  return (
    <button
      type="button"
      disabled={disabled}
      aria-haspopup="listbox"
      aria-expanded={open}
      onClick={() => setOpen((prev) => !prev)}
      className={cn(
        "flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-2 font-body-md text-body-md text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}>
      <span className={cn("truncate", !label && "text-muted-foreground")}>
        {label ?? placeholder ?? "Seleccionar..."}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={cn(
          "shrink-0 text-muted-foreground transition-transform",
          open && "rotate-180",
        )}>
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}

function SelectContent({ className, children }) {
  const { open } = useSelectContext("Content");

  return (
    <div
      role="listbox"
      hidden={!open}
      className={cn(
        "absolute left-0 top-full z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
        className,
      )}>
      {children}
    </div>
  );
}

function SelectItem({ value: itemValue, className, children, disabled }) {
  const { value, selectValue, registerLabel } = useSelectContext("Item");

  useEffect(() => {
    registerLabel(
      itemValue,
      typeof children === "string" ? children : itemValue,
    );
  }, [itemValue, children, registerLabel]);

  const isSelected = value === itemValue;

  return (
    <div
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      onClick={() => !disabled && selectValue(itemValue)}
      className={cn(
        "flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 font-body-md text-body-md text-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
        isSelected && "bg-accent text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        className,
      )}>
      {children}
    </div>
  );
}

Select.Trigger = SelectTrigger;
Select.Content = SelectContent;
Select.Item = SelectItem;

export default Select;
export { SelectTrigger, SelectContent, SelectItem };
