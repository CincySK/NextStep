import React, { createContext, useContext, useMemo, useState } from "react";
import { cn } from "./utils";
import { toggleVariants } from "./toggle";

const ToggleGroupContext = createContext({
  size: "default",
  variant: "default",
  type: "single"
});

function ToggleGroup({
  className,
  variant = "default",
  size = "default",
  type = "single",
  value: controlledValue,
  defaultValue,
  onValueChange,
  children,
  ...props
}) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? (type === "multiple" ? [] : "")
  );

  const value = isControlled ? controlledValue : internalValue;

  function setValue(next) {
    if (!isControlled) setInternalValue(next);
    if (onValueChange) onValueChange(next);
  }

  const contextValue = useMemo(
    () => ({ variant, size, type, value, setValue }),
    [variant, size, type, value]
  );

  return (
    <ToggleGroupContext.Provider value={contextValue}>
      <div
        data-slot="toggle-group"
        data-variant={variant}
        data-size={size}
        className={cn("ui-toggle-group", variant === "outline" && "ui-toggle-group-outline", className)}
        {...props}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

function isItemActive(group, itemValue) {
  if (group.type === "multiple") {
    return Array.isArray(group.value) && group.value.includes(itemValue);
  }
  return group.value === itemValue;
}

function computeNext(group, itemValue, active) {
  if (group.type === "multiple") {
    const current = Array.isArray(group.value) ? group.value : [];
    if (active) return current.filter((v) => v !== itemValue);
    return [...current, itemValue];
  }
  return active ? "" : itemValue;
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  value,
  onClick,
  ...props
}) {
  const group = useContext(ToggleGroupContext);
  const resolvedVariant = group.variant || variant;
  const resolvedSize = group.size || size;
  const active = isItemActive(group, value);

  return (
    <button
      type="button"
      data-slot="toggle-group-item"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      data-state={active ? "on" : "off"}
      className={cn(
        toggleVariants({ variant: resolvedVariant, size: resolvedSize }),
        "ui-toggle-group-item",
        active && "ui-toggle-group-item-active",
        className
      )}
      onClick={(event) => {
        if (onClick) onClick(event);
        if (!event.defaultPrevented) {
          const next = computeNext(group, value, active);
          group.setValue(next);
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export { ToggleGroup, ToggleGroupItem };
