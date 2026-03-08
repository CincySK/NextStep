import React, { createContext, useContext, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { cn } from "./utils";

const SheetContext = createContext(null);

function useSheet() {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("Sheet components must be used within <Sheet>.");
  return ctx;
}

function Sheet({ open: controlledOpen, defaultOpen = false, onOpenChange, children }) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (next) => {
    if (!isControlled) setInternalOpen(next);
    if (onOpenChange) onOpenChange(next);
  };

  const value = useMemo(() => ({ open, setOpen }), [open]);
  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>;
}

function SheetTrigger({ onClick, ...props }) {
  const { setOpen } = useSheet();
  return (
    <button
      type="button"
      data-slot="sheet-trigger"
      onClick={(event) => {
        if (onClick) onClick(event);
        if (!event.defaultPrevented) setOpen(true);
      }}
      {...props}
    />
  );
}

function SheetClose({ onClick, ...props }) {
  const { setOpen } = useSheet();
  return (
    <button
      type="button"
      data-slot="sheet-close"
      onClick={(event) => {
        if (onClick) onClick(event);
        if (!event.defaultPrevented) setOpen(false);
      }}
      {...props}
    />
  );
}

function SheetPortal({ children }) {
  if (typeof document === "undefined") return null;
  return ReactDOM.createPortal(<div data-slot="sheet-portal">{children}</div>, document.body);
}

function SheetOverlay({ className, onClick, ...props }) {
  const { setOpen } = useSheet();
  return (
    <div
      data-slot="sheet-overlay"
      className={cn("ui-sheet-overlay", className)}
      onClick={(event) => {
        if (onClick) onClick(event);
        if (!event.defaultPrevented) setOpen(false);
      }}
      {...props}
    />
  );
}

function SheetContent({ className, children, side = "right", ...props }) {
  const { open, setOpen } = useSheet();
  if (!open) return null;

  return (
    <SheetPortal>
      <SheetOverlay />
      <section
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "ui-sheet-content",
          side === "right" && "ui-sheet-right",
          side === "left" && "ui-sheet-left",
          side === "top" && "ui-sheet-top",
          side === "bottom" && "ui-sheet-bottom",
          className
        )}
        {...props}
      >
        {children}
        <button
          type="button"
          className="ui-sheet-close-btn"
          onClick={() => setOpen(false)}
          aria-label="Close"
        >
          x
          <span className="sr-only">Close</span>
        </button>
      </section>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }) {
  return <div data-slot="sheet-header" className={cn("ui-sheet-header", className)} {...props} />;
}

function SheetFooter({ className, ...props }) {
  return <div data-slot="sheet-footer" className={cn("ui-sheet-footer", className)} {...props} />;
}

function SheetTitle({ className, ...props }) {
  return <h2 data-slot="sheet-title" className={cn("ui-sheet-title", className)} {...props} />;
}

function SheetDescription({ className, ...props }) {
  return <p data-slot="sheet-description" className={cn("ui-sheet-description", className)} {...props} />;
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription
};
