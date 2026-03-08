import { cn } from "./utils";

export function buttonVariants({ variant = "default", size = "md", className = "" } = {}) {
  const base = "ui-btn";
  const style = variant === "outline"
    ? "ui-btn-outline"
    : variant === "ghost"
      ? "ui-button-ghost"
      : variant === "secondary"
        ? "ui-button-secondary"
        : "ui-btn-primary";
  const sizing = size === "icon"
    ? "ui-btn-icon"
    : size === "sm"
      ? "ui-button-sm"
      : size === "lg"
        ? "ui-button-lg"
        : "ui-button-md";
  return cn(base, style, sizing, className);
}

export function Button({
  variant = "default",
  size = "md",
  className = "",
  children,
  ...props
}) {
  return (
    <button className={buttonVariants({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}
