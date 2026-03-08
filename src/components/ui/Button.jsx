import React from "react";
import { cn } from "./utils";

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) {
  const variantClass = {
    primary: "ui-button-primary",
    secondary: "ui-button-secondary",
    outline: "ui-button-outline",
    ghost: "ui-button-ghost"
  }[variant] || "ui-button-primary";

  const sizeClass = {
    sm: "ui-button-sm",
    md: "ui-button-md",
    lg: "ui-button-lg"
  }[size] || "ui-button-md";

  return (
    <button
      className={cn("ui-button", variantClass, sizeClass, className)}
      {...props}
    >
      {children}
    </button>
  );
}
