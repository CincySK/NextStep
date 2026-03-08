import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { cn } from "./utils";

const HoverCardContext = createContext(null);

function useHoverCard() {
  const ctx = useContext(HoverCardContext);
  if (!ctx) throw new Error("HoverCard components must be used within <HoverCard>.");
  return ctx;
}

function HoverCard({ openDelay = 80, closeDelay = 120, children }) {
  const [open, setOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);
  const openTimer = useRef(null);
  const closeTimer = useRef(null);

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const scheduleOpen = () => {
    clearTimers();
    openTimer.current = setTimeout(() => setOpen(true), openDelay);
  };

  const scheduleClose = () => {
    clearTimers();
    closeTimer.current = setTimeout(() => setOpen(false), closeDelay);
  };

  const value = useMemo(
    () => ({ open, setOpen, anchorRect, setAnchorRect, scheduleOpen, scheduleClose }),
    [open, anchorRect]
  );

  return <HoverCardContext.Provider value={value}>{children}</HoverCardContext.Provider>;
}

function HoverCardTrigger({ children, className, ...props }) {
  const { setAnchorRect, scheduleOpen, scheduleClose } = useHoverCard();

  return (
    <span
      data-slot="hover-card-trigger"
      className={cn(className)}
      onMouseEnter={(event) => {
        setAnchorRect(event.currentTarget.getBoundingClientRect());
        scheduleOpen();
      }}
      onMouseLeave={scheduleClose}
      onFocus={(event) => {
        setAnchorRect(event.currentTarget.getBoundingClientRect());
        scheduleOpen();
      }}
      onBlur={scheduleClose}
      {...props}
    >
      {children}
    </span>
  );
}

function placePosition(anchorRect, align = "center", sideOffset = 4) {
  if (!anchorRect) return { left: 0, top: 0 };
  let left = anchorRect.left + anchorRect.width / 2;
  if (align === "start") left = anchorRect.left;
  if (align === "end") left = anchorRect.right;
  const top = anchorRect.bottom + sideOffset;
  return { left, top };
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  style,
  children,
  ...props
}) {
  const { open, anchorRect, scheduleOpen, scheduleClose } = useHoverCard();
  if (!open || typeof document === "undefined") return null;

  const pos = placePosition(anchorRect, align, sideOffset);

  return ReactDOM.createPortal(
    <div
      data-slot="hover-card-content"
      className={cn("ui-hover-card-content", className)}
      style={{
        left: pos.left,
        top: pos.top,
        transform: align === "center" ? "translateX(-50%)" : align === "end" ? "translateX(-100%)" : "none",
        ...style
      }}
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
      {...props}
    >
      {children}
    </div>,
    document.body
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
