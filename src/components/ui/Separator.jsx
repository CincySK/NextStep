import React from "react";
import { cn } from "./utils";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return (
    <div
      data-slot="separator-root"
      role={decorative ? "none" : "separator"}
      aria-orientation={orientation}
      className={cn(
        "ui-separator",
        orientation === "horizontal" ? "ui-separator-horizontal" : "ui-separator-vertical",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
