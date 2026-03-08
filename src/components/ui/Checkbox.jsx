import React from "react";
import { cn } from "./utils";

function Checkbox({
  className,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  ...props
}) {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = React.useState(Boolean(defaultChecked));
  const currentChecked = isControlled ? Boolean(checked) : internalChecked;

  function handleChange(event) {
    const next = event.target.checked;
    if (!isControlled) setInternalChecked(next);
    if (onCheckedChange) onCheckedChange(next);
  }

  return (
    <label className={cn("ui-checkbox-wrap", disabled && "ui-checkbox-disabled")}>
      <input
        type="checkbox"
        className="ui-checkbox-input"
        checked={currentChecked}
        onChange={handleChange}
        disabled={disabled}
        {...props}
      />
      <span
        data-slot="checkbox"
        className={cn("ui-checkbox-box", currentChecked && "ui-checkbox-box-checked", className)}
        aria-hidden="true"
      >
        <span data-slot="checkbox-indicator" className="ui-checkbox-indicator">
          {currentChecked ? "✓" : ""}
        </span>
      </span>
    </label>
  );
}

export { Checkbox };
