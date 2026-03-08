import React, { createContext, useContext, useMemo, useState } from "react";
import { cn } from "./utils";

const TabsContext = createContext(null);

function Tabs({
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
    <TabsContext.Provider value={ctx}>
      <div data-slot="tabs" className={cn("ui-tabs", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, ...props }) {
  return <div data-slot="tabs-list" className={cn("ui-tabs-list", className)} role="tablist" {...props} />;
}

function TabsTrigger({ className, value, onClick, ...props }) {
  const ctx = useContext(TabsContext);
  const active = ctx?.value === value;

  return (
    <button
      type="button"
      data-slot="tabs-trigger"
      role="tab"
      aria-selected={active}
      data-state={active ? "active" : "inactive"}
      className={cn("ui-tabs-trigger", active && "ui-tabs-trigger-active", className)}
      onClick={(event) => {
        if (onClick) onClick(event);
        if (!event.defaultPrevented && ctx?.setValue) ctx.setValue(value);
      }}
      {...props}
    />
  );
}

function TabsContent({ className, value, ...props }) {
  const ctx = useContext(TabsContext);
  const active = ctx?.value === value;
  if (!active) return null;

  return (
    <div
      data-slot="tabs-content"
      role="tabpanel"
      className={cn("ui-tabs-content", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
