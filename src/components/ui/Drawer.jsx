import React, { createContext, useContext, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { cn } from "./utils";

const DrawerContext = createContext(null);

function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("Drawer components must be used within <Drawer>.");
  return ctx;
}

function Drawer({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  direction = "bottom",
  children,
  ...props
}) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (next) => {
    if (!isControlled) setInternalOpen(next);
    if (onOpenChange) onOpenChange(next);
  };

  const value = useMemo(() => ({ open, setOpen, direction }), [open, direction]);

  return (
    <DrawerContext.Provider value={value}>
      <div data-slot="drawer" data-vaul-drawer-direction={direction} {...props}>
        {children}
      </div>
    </DrawerContext.Provider>
  );
}

function DrawerTrigger({ onClick, ...props }) {
  const { setOpen } = useDrawer();
  return (
    <button
      type="button"
      data-slot="drawer-trigger"
      onClick={(event) => {
        if (onClick) onClick(event);
        if (!event.defaultPrevented) setOpen(true);
      }}
      {...props}
    />
  );
}

function DrawerPortal({ children }) {
  if (typeof document === "undefined") return null;
  return ReactDOM.createPortal(<div data-slot="drawer-portal">{children}</div>, document.body);
}

function DrawerClose({ onClick, ...props }) {
  const { setOpen } = useDrawer();
  return (
    <button
      type="button"
      data-slot="drawer-close"
      onClick={(event) => {
        if (onClick) onClick(event);
        if (!event.defaultPrevented) setOpen(false);
      }}
      {...props}
    />
  );
}

function DrawerOverlay({ className, onClick, ...props }) {
  const { setOpen } = useDrawer();
  return (
    <div
      data-slot="drawer-overlay"
      className={cn("ui-drawer-overlay", className)}
      onClick={(event) => {
        if (onClick) onClick(event);
        if (!event.defaultPrevented) setOpen(false);
      }}
      {...props}
    />
  );
}

function DrawerContent({ className, children, ...props }) {
  const { open, direction } = useDrawer();
  if (!open) return null;

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <section
        data-slot="drawer-content"
        data-vaul-drawer-direction={direction}
        className={cn(
          "ui-drawer-content",
          direction === "top" && "ui-drawer-top",
          direction === "bottom" && "ui-drawer-bottom",
          direction === "left" && "ui-drawer-left",
          direction === "right" && "ui-drawer-right",
          className
        )}
        {...props}
      >
        <div className={cn("ui-drawer-handle", direction !== "bottom" && "ui-drawer-handle-hidden")} />
        {children}
      </section>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }) {
  return <div data-slot="drawer-header" className={cn("ui-drawer-header", className)} {...props} />;
}

function DrawerFooter({ className, ...props }) {
  return <div data-slot="drawer-footer" className={cn("ui-drawer-footer", className)} {...props} />;
}

function DrawerTitle({ className, ...props }) {
  return <h2 data-slot="drawer-title" className={cn("ui-drawer-title", className)} {...props} />;
}

function DrawerDescription({ className, ...props }) {
  return <p data-slot="drawer-description" className={cn("ui-drawer-description", className)} {...props} />;
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription
};
