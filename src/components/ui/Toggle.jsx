import React, { useState } from "react";
import { cn } from "./utils";
import { toggleVariants } from "./toggle";

function Toggle({
  className,
  variant = "default",
  size = "default",
  pressed: controlledPressed,
  defaultPressed = false,
  onPressedChange,
  onClick,
  ...props
}) {
  const isControlled = controlledPressed !== undefined;
  const [internalPressed, setInternalPressed] = useState(Boolean(defaultPressed));
  const pressed = isControlled ? Boolean(controlledPressed) : internalPressed;

  function handleToggle(event) {
    if (onClick) onClick(event);
    if (event.defaultPrevented) return;
    const next = !pressed;
    if (!isControlled) setInternalPressed(next);
    if (onPressedChange) onPressedChange(next);
  }

  return (
    <button
      type="button"
      data-slot="toggle"
      data-state={pressed ? "on" : "off"}
      aria-pressed={pressed}
      className={cn(toggleVariants({ variant, size }), className)}
      onClick={handleToggle}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
