import React from "react";
import { cn } from "./utils";

export function Input({ label, className = "", ...props }) {
  return (
    <div className="ui-input-wrap">
      {label ? <label className="ui-input-label">{label}</label> : null}
      <input className={cn("ui-input", className)} {...props} />
    </div>
  );
}
