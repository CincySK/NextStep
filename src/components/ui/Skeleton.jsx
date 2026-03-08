import React from "react";
import { cn } from "./utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("ui-skeleton", className)}
      {...props}
    />
  );
}

export { Skeleton };
