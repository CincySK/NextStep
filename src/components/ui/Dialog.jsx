import React, { createContext, useContext, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { cn } from "./utils";

const DialogContext = createContext(null);

function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("Dialog components must be used within <Dialog>.");
  return ctx;
}

function Dialog({ open: controlledOpen, defaultOpen = false, onOpenChange, children }) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (next) => {
    if (!isControlled) setInternalOpen(next);
    if (onOpenChange) onOpenChange(next);
  };

  const value = useMemo(() => ({ open, setOpen }), [open]);
  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

function DialogTrigger({ className, onClick, ...props }) {
  const { setOpen } = useDialog();
  return (
    <button
      type="button"
      data-slot="dialog-trigger"
      className={cn(className)}
      onClick={(event) => {
        if (onClick) onClick(event);
        if (!event.defaultPrevented) setOpen(true);
      }}
      {...props}
    />
  );
}

function DialogPortal({ children }) {
  if (typeof document === "undefined") return null;
  return ReactDOM.createPortal(children, document.body);
}

function DialogOverlay({ className, onClick, ...props }) {
  const { setOpen } = useDialog();
  return (
    <div
      data-slot="dialog-overlay"
      className={cn("ui-dialog-overlay", className)}
      onClick={(event) => {
        if (onClick) onClick(event);
        if (!event.defaultPrevented) setOpen(false);
      }}
      {...props}
    />
  );
}

function DialogContent({ className, children, ...props }) {
  const { open } = useDialog();
  if (!open) return null;

  return (
    <DialogPortal>
      <DialogOverlay />
      <section data-slot="dialog-content" className={cn("ui-dialog-content", className)} {...props}>
        {children}
      </section>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }) {
  return <div data-slot="dialog-header" className={cn("ui-dialog-header", className)} {...props} />;
}

function DialogFooter({ className, ...props }) {
  return <div data-slot="dialog-footer" className={cn("ui-dialog-footer", className)} {...props} />;
}

function DialogTitle({ className, ...props }) {
  return <h2 data-slot="dialog-title" className={cn("ui-dialog-title", className)} {...props} />;
}

function DialogDescription({ className, ...props }) {
  return <p data-slot="dialog-description" className={cn("ui-dialog-description", className)} {...props} />;
}

function DialogClose({ className, onClick, ...props }) {
  const { setOpen } = useDialog();
  return (
    <button
      type="button"
      data-slot="dialog-close"
      className={cn(className)}
      onClick={(event) => {
        if (onClick) onClick(event);
        if (!event.defaultPrevented) setOpen(false);
      }}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose
};
