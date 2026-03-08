import React, { createContext, useContext, useMemo, useRef } from "react";
import { cn } from "./utils";

const ResizableContext = createContext(null);

function ResizablePanelGroup({ className, direction = "horizontal", children, ...props }) {
  const rootRef = useRef(null);
  const value = useMemo(() => ({ direction, rootRef }), [direction]);

  return (
    <ResizableContext.Provider value={value}>
      <div
        ref={rootRef}
        data-slot="resizable-panel-group"
        data-panel-group-direction={direction}
        className={cn("ui-resizable-group", direction === "vertical" && "ui-resizable-group-vertical", className)}
        {...props}
      >
        {children}
      </div>
    </ResizableContext.Provider>
  );
}

function ResizablePanel({ className, style, defaultSize, ...props }) {
  const basis = typeof defaultSize === "number" ? `${defaultSize}%` : undefined;
  return (
    <div
      data-slot="resizable-panel"
      className={cn("ui-resizable-panel", className)}
      style={{ flexBasis: basis, ...style }}
      {...props}
    />
  );
}

function ResizableHandle({ withHandle, className, onMouseDown, ...props }) {
  const ctx = useContext(ResizableContext);
  const isVertical = ctx?.direction === "vertical";

  function beginResize(event) {
    if (onMouseDown) onMouseDown(event);
    if (event.defaultPrevented || !ctx?.rootRef?.current) return;

    const handle = event.currentTarget;
    const prev = handle.previousElementSibling;
    const next = handle.nextElementSibling;
    if (!prev || !next) return;

    const prevRect = prev.getBoundingClientRect();
    const nextRect = next.getBoundingClientRect();
    const start = isVertical ? event.clientY : event.clientX;
    const prevStart = isVertical ? prevRect.height : prevRect.width;
    const nextStart = isVertical ? nextRect.height : nextRect.width;
    const minSize = 80;

    prev.style.flexGrow = "0";
    next.style.flexGrow = "0";

    function onMove(moveEvent) {
      const point = isVertical ? moveEvent.clientY : moveEvent.clientX;
      const delta = point - start;
      const prevSize = Math.max(minSize, prevStart + delta);
      const nextSize = Math.max(minSize, nextStart - delta);

      prev.style.flexBasis = `${prevSize}px`;
      next.style.flexBasis = `${nextSize}px`;
    }

    function onUp() {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.classList.remove("ui-resize-active");
    }

    document.body.classList.add("ui-resize-active");
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  return (
    <div
      data-slot="resizable-handle"
      data-panel-group-direction={ctx?.direction || "horizontal"}
      className={cn(
        "ui-resizable-handle",
        isVertical && "ui-resizable-handle-vertical",
        className
      )}
      onMouseDown={beginResize}
      {...props}
    >
      {withHandle ? (
        <div className="ui-resizable-handle-grip">
          <span className="ui-resizable-grip-icon">:</span>
        </div>
      ) : null}
    </div>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
