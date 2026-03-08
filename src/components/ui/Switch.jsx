import React, { useState } from "react";
import { cn } from "./utils";

function Switch({
  className,
  checked: controlledChecked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  ...props
}) {
  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = useState(Boolean(defaultChecked));
  const checked = isControlled ? Boolean(controlledChecked) : internalChecked;

  function toggle() {
    if (disabled) return;
    const next = !checked;
    if (!isControlled) setInternalChecked(next);
    if (onCheckedChange) onCheckedChange(next);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-slot="switch"
      data-state={checked ? "checked" : "unchecked"}
      disabled={disabled}
      className={cn("ui-switch", checked ? "ui-switch-checked" : "ui-switch-unchecked", className)}
      onClick={toggle}
      {...props}
    >
      <span
        data-slot="switch-thumb"
        data-state={checked ? "checked" : "unchecked"}
        className={cn("ui-switch-thumb", checked && "ui-switch-thumb-checked")}
      />
    </button>
  );
}

export { Switch };
