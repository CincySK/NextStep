import React from "react";
import { cn } from "./utils";

function alertVariants(variant = "default") {
  return cn(
    "ui-alert",
    variant === "destructive" ? "ui-alert-destructive" : "ui-alert-default"
  );
}

function Alert({ className, variant = "default", ...props }) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants(variant), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }) {
  return (
    <div
      data-slot="alert-title"
      className={cn("ui-alert-title", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }) {
  return (
    <div
      data-slot="alert-description"
      className={cn("ui-alert-description", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
