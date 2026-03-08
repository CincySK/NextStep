import React from "react";
import { cn } from "./utils";

export function Badge({ children, variant = "primary", className = "" }) {
  const variants = {
    primary: "ui-badge-primary",
    secondary: "ui-badge-secondary",
    success: "ui-badge-success",
    warning: "ui-badge-warning",
    danger: "ui-badge-danger"
  };

  return (
    <span className={cn("ui-badge", variants[variant] || variants.primary, className)}>
      {children}
    </span>
  );
}
