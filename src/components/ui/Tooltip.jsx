import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { cn } from "./utils";

const TooltipProviderContext = createContext({ delayDuration: 0 });
const TooltipContext = createContext(null);

function TooltipProvider({ delayDuration = 0, children, ...props }) {
  const value = useMemo(() => ({ delayDuration }), [delayDuration]);
  return (
    <TooltipProviderContext.Provider value={value}>
      <div data-slot="tooltip-provider" {...props}>
        {children}
      </div>
    </TooltipProviderContext.Provider>
  );
}

function Tooltip({ children, ...props }) {
  const provider = useContext(TooltipProviderContext);
  const [open, setOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);
  const timerRef = useRef(null);

  const scheduleOpen = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(true), provider.delayDuration || 0);
  };

  const scheduleClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(false);
  };

  const ctx = useMemo(
    () => ({ open, setOpen, anchorRect, setAnchorRect, scheduleOpen, scheduleClose }),
    [open, anchorRect]
  );

  return (
    <TooltipContext.Provider value={ctx}>
      <div data-slot="tooltip" {...props}>
        {children}
      </div>
    </TooltipContext.Provider>
  );
}

function TooltipTrigger({ asChild = false, children, className, ...props }) {
  const ctx = useContext(TooltipContext);
  if (!ctx) return null;

  const triggerProps = {
    "data-slot": "tooltip-trigger",
    className: cn(className),
    onMouseEnter: (event) => {
      ctx.setAnchorRect(event.currentTarget.getBoundingClientRect());
      ctx.scheduleOpen();
      if (props.onMouseEnter) props.onMouseEnter(event);
    },
    onMouseLeave: (event) => {
      ctx.scheduleClose();
      if (props.onMouseLeave) props.onMouseLeave(event);
    },
    onFocus: (event) => {
      ctx.setAnchorRect(event.currentTarget.getBoundingClientRect());
      ctx.scheduleOpen();
      if (props.onFocus) props.onFocus(event);
    },
    onBlur: (event) => {
      ctx.scheduleClose();
      if (props.onBlur) props.onBlur(event);
    },
    ...props
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...triggerProps,
      className: cn(children.props?.className, triggerProps.className)
    });
  }

  return <span {...triggerProps}>{children}</span>;
}

function computePosition(rect, side = "top", sideOffset = 0) {
  if (!rect) return { left: 0, top: 0 };
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  if (side === "bottom") return { left: centerX, top: rect.bottom + 10 + sideOffset };
  if (side === "left") return { left: rect.left - 10 - sideOffset, top: centerY };
  if (side === "right") return { left: rect.right + 10 + sideOffset, top: centerY };
  return { left: centerX, top: rect.top - 10 - sideOffset };
}

function TooltipContent({
  className,
  sideOffset = 0,
  side = "top",
  children,
  ...props
}) {
  const ctx = useContext(TooltipContext);
  if (!ctx?.open || typeof document === "undefined") return null;

  const pos = computePosition(ctx.anchorRect, side, sideOffset);
  const transform = side === "left"
    ? "translate(-100%, -50%)"
    : side === "right"
      ? "translate(0, -50%)"
      : side === "bottom"
        ? "translate(-50%, 0)"
        : "translate(-50%, -100%)";

  return ReactDOM.createPortal(
    <div
      data-slot="tooltip-content"
      data-side={side}
      className={cn("ui-tooltip-content", className)}
      style={{ left: pos.left, top: pos.top, transform }}
      onMouseEnter={ctx.scheduleOpen}
      onMouseLeave={ctx.scheduleClose}
      {...props}
    >
      {children}
      <span className="ui-tooltip-arrow" />
    </div>,
    document.body
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
