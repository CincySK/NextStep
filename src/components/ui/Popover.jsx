import React, { createContext, useContext, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { cn } from "./utils";

const PopoverContext = createContext(null);

function usePopover() {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("Popover components must be used within <Popover>.");
  return ctx;
}

function Popover({ open: controlledOpen, defaultOpen = false, onOpenChange, children }) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [anchorRect, setAnchorRect] = useState(null);
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (next) => {
    if (!isControlled) setInternalOpen(next);
    if (onOpenChange) onOpenChange(next);
  };

  const value = useMemo(
    () => ({ open, setOpen, anchorRect, setAnchorRect }),
    [open, anchorRect]
  );

  return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>;
}

function PopoverTrigger({ onClick, children, ...props }) {
  const { open, setOpen, setAnchorRect } = usePopover();

  return (
    <button
      type="button"
      data-slot="popover-trigger"
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setAnchorRect(rect);
        if (onClick) onClick(event);
        if (!event.defaultPrevented) setOpen(!open);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function PopoverAnchor({ ...props }) {
  return <span data-slot="popover-anchor" {...props} />;
}

function computePosition(rect, align = "center", sideOffset = 4) {
  if (!rect) return { left: 0, top: 0, transform: "none" };
  const top = rect.bottom + sideOffset;

  if (align === "start") {
    return { left: rect.left, top, transform: "none" };
  }
  if (align === "end") {
    return { left: rect.right, top, transform: "translateX(-100%)" };
  }
  return { left: rect.left + rect.width / 2, top, transform: "translateX(-50%)" };
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  style,
  children,
  ...props
}) {
  const { open, setOpen, anchorRect } = usePopover();
  if (!open || typeof document === "undefined") return null;

  const pos = computePosition(anchorRect, align, sideOffset);

  return ReactDOM.createPortal(
    <>
      <div className="ui-popover-backdrop" onClick={() => setOpen(false)} />
      <div
        data-slot="popover-content"
        className={cn("ui-popover-content", className)}
        style={{ left: pos.left, top: pos.top, transform: pos.transform, ...style }}
        {...props}
      >
        {children}
      </div>
    </>,
    document.body
  );
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
