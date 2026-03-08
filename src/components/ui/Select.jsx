import React from "react";
import { cn } from "./utils";

export function Select({ label, options = [], className = "", ...props }) {
  return (
    <div className="ui-select-wrap">
      {label ? <label className="ui-select-label">{label}</label> : null}
      <select className={cn("ui-select", className)} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
