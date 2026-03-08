import React from "react";
import { cn } from "./utils";

function ScrollArea({ className, children, ...props }) {
  return (
    <div
      data-slot="scroll-area"
      className={cn("ui-scroll-area", className)}
      {...props}
    >
      <div
        data-slot="scroll-area-viewport"
        className="ui-scroll-area-viewport"
      >
        {children}
      </div>
      <ScrollBar />
    </div>
  );
}

function ScrollBar({ className, orientation = "vertical", ...props }) {
  return (
    <div
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      className={cn(
        "ui-scrollbar",
        orientation === "vertical" ? "ui-scrollbar-vertical" : "ui-scrollbar-horizontal",
        className
      )}
      {...props}
    >
      <div data-slot="scroll-area-thumb" className="ui-scrollbar-thumb" />
    </div>
  );
}

export { ScrollArea, ScrollBar };
