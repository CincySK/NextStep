import React, { createContext, useContext, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { cn } from "./utils";
import { buttonVariants } from "./button";

const AlertDialogContext = createContext(null);

function useAlertDialog() {
  const ctx = useContext(AlertDialogContext);
  if (!ctx) throw new Error("AlertDialog components must be used inside <AlertDialog>.");
  return ctx;
}

function AlertDialog({ open: controlledOpen, defaultOpen = false, onOpenChange, children }) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (next) => {
    if (!isControlled) setInternalOpen(next);
    if (onOpenChange) onOpenChange(next);
  };

  const value = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <AlertDialogContext.Provider value={value}>
      <div data-slot="alert-dialog">{children}</div>
    </AlertDialogContext.Provider>
  );
}

function AlertDialogTrigger({ className, onClick, ...props }) {
  const { setOpen } = useAlertDialog();
  return (
    <button
      type="button"
      data-slot="alert-dialog-trigger"
      className={cn(className)}
      onClick={(event) => {
        if (onClick) onClick(event);
        if (!event.defaultPrevented) setOpen(true);
      }}
      {...props}
    />
  );
}

function AlertDialogPortal({ children }) {
  if (typeof document === "undefined") return null;
  return ReactDOM.createPortal(
    <div data-slot="alert-dialog-portal">{children}</div>,
    document.body
  );
}

function AlertDialogOverlay({ className, onClick, ...props }) {
  const { setOpen } = useAlertDialog();
  return (
    <div
      data-slot="alert-dialog-overlay"
      className={cn("alert-dialog-overlay", className)}
      onClick={(event) => {
        if (onClick) onClick(event);
        if (!event.defaultPrevented) setOpen(false);
      }}
      {...props}
    />
  );
}

function AlertDialogContent({ className, children, ...props }) {
  const { open } = useAlertDialog();
  if (!open) return null;

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <section
        role="alertdialog"
        aria-modal="true"
        data-slot="alert-dialog-content"
        className={cn("alert-dialog-content", className)}
        {...props}
      >
        {children}
      </section>
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }) {
  return <div data-slot="alert-dialog-header" className={cn("alert-dialog-header", className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }) {
  return <div data-slot="alert-dialog-footer" className={cn("alert-dialog-footer", className)} {...props} />;
}

function AlertDialogTitle({ className, ...props }) {
  return <h2 data-slot="alert-dialog-title" className={cn("alert-dialog-title", className)} {...props} />;
}

function AlertDialogDescription({ className, ...props }) {
  return <p data-slot="alert-dialog-description" className={cn("alert-dialog-description", className)} {...props} />;
}

function AlertDialogAction({ className, onClick, ...props }) {
  const { setOpen } = useAlertDialog();
  return (
    <button
      type="button"
      className={cn(buttonVariants(), className)}
      onClick={(event) => {
        if (onClick) onClick(event);
        if (!event.defaultPrevented) setOpen(false);
      }}
      {...props}
    />
  );
}

function AlertDialogCancel({ className, onClick, ...props }) {
  const { setOpen } = useAlertDialog();
  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant: "outline" }), className)}
      onClick={(event) => {
        if (onClick) onClick(event);
        if (!event.defaultPrevented) setOpen(false);
      }}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel
};
