import React from "react";
import { cn } from "./utils";

function Label({ className, ...props }) {
  return (
    <label
      data-slot="label"
      className={cn("ui-label ui-label-inline", className)}
      {...props}
    />
  );
}

export { Label };
