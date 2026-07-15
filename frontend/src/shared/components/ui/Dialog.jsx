import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@shared/utils/cn";

const DialogContext = createContext(null);

function useDialogContext(component) {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error(`Dialog.${component} debe usarse dentro de <Dialog>`);
  }
  return ctx;
}

function Dialog({
  open: openProp,
  onOpenChange,
  defaultOpen = false,
  children,
}) {
  const [openState, setOpenState] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : openState;

  const setOpen = useCallback(
    (next) => {
      if (!isControlled) setOpenState(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

function DialogTrigger({ children }) {
  const { setOpen } = useDialogContext("Trigger");

  if (!isValidElement(children)) return children ?? null;

  return cloneElement(children, {
    onClick: (event) => {
      children.props.onClick?.(event);
      setOpen(true);
    },
  });
}

function DialogContent({ className, children }) {
  const { open, setOpen } = useDialogContext("Content");
  const contentRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    previouslyFocusedRef.current = document.activeElement;
    const frame = requestAnimationFrame(() => {
      contentRef.current?.focus();
    });

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.stopPropagation();
        setOpen(false);
      }
    }

    const { overflow: previousOverflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (
        previouslyFocusedRef.current instanceof HTMLElement &&
        document.contains(previouslyFocusedRef.current)
      ) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [open, setOpen]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md">
      <div
        className="fixed inset-0 bg-black/60"
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "relative z-10 flex w-full max-w-[28rem] flex-col gap-md rounded-lg border border-border bg-card p-md text-card-foreground shadow-lg focus:outline-none",
          className,
        )}>
        {children}
      </div>
    </div>,
    document.body,
  );
}

function DialogHeader({ className, ...props }) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

function DialogTitle({ className, ...props }) {
  return (
    <h2
      className={cn(
        "font-headline-md text-headline-md text-card-foreground",
        className,
      )}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex items-center justify-end gap-sm", className)}
      {...props}
    />
  );
}

Dialog.Trigger = DialogTrigger;
Dialog.Content = DialogContent;
Dialog.Header = DialogHeader;
Dialog.Title = DialogTitle;
Dialog.Footer = DialogFooter;

export default Dialog;
export {
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
};
