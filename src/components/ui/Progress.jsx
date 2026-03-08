import React from "react";
import { cn } from "./utils";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function Progress({ className, value = 0, ...props }) {
  const safeValue = clamp(Number(value) || 0, 0, 100);
  return (
    <div
      data-slot="progress"
      className={cn("ui-progress", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className="ui-progress-indicator"
        style={{ transform: `translateX(-${100 - safeValue}%)` }}
      />
    </div>
  );
}

export { Progress };
