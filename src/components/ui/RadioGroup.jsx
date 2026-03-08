import React, { createContext, useContext, useMemo, useState } from "react";
import { cn } from "./utils";

const RadioGroupContext = createContext(null);

function RadioGroup({
  className,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  children,
  ...props
}) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : internalValue;

  const setValue = (next) => {
    if (!isControlled) setInternalValue(next);
    if (onValueChange) onValueChange(next);
  };

  const ctx = useMemo(() => ({ value, setValue }), [value]);

  return (
    <RadioGroupContext.Provider value={ctx}>
      <div data-slot="radio-group" className={cn("ui-radio-group", className)} role="radiogroup" {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

function RadioGroupItem({ className, value, disabled, ...props }) {
  const group = useContext(RadioGroupContext);
  const checked = group?.value === value;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      data-slot="radio-group-item"
      data-state={checked ? "checked" : "unchecked"}
      disabled={disabled}
      className={cn("ui-radio-item", checked && "ui-radio-item-checked", className)}
      onClick={() => {
        if (!disabled && group?.setValue) group.setValue(value);
      }}
      {...props}
    >
      <span data-slot="radio-group-indicator" className={cn("ui-radio-indicator", checked && "ui-radio-indicator-visible")} />
    </button>
  );
}

export { RadioGroup, RadioGroupItem };
