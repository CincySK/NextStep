import { cn } from "./utils";

export function toggleVariants({ variant = "default", size = "default", className = "" } = {}) {
  const variantClass = variant === "outline" ? "ui-toggle-outline" : "ui-toggle-default";
  const sizeClass = size === "sm" ? "ui-toggle-sm" : size === "lg" ? "ui-toggle-lg" : "ui-toggle-md";
  return cn("ui-toggle", variantClass, sizeClass, className);
}
