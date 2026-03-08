import React, { createContext, useContext, useMemo, useState } from "react";
import { cn } from "./utils";

const AccordionContext = createContext(null);

export function Accordion({
  children,
  type = "single",
  collapsible = true,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  className,
  ...props
}) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? controlledValue : internalValue;

  const api = useMemo(
    () => ({
      type,
      collapsible,
      value: currentValue,
      setValue: (nextValue) => {
        if (!isControlled) setInternalValue(nextValue);
        if (onValueChange) onValueChange(nextValue);
      }
    }),
    [type, collapsible, currentValue, isControlled, onValueChange]
  );

  return (
    <AccordionContext.Provider value={api}>
      <div data-slot="accordion" className={cn("accordion-root", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

const ItemContext = createContext(null);

export function AccordionItem({ className, value, children, ...props }) {
  const root = useContext(AccordionContext);
  const isOpen = root?.type === "single" ? root.value === value : false;

  return (
    <ItemContext.Provider value={{ value, isOpen }}>
      <section
        data-slot="accordion-item"
        data-state={isOpen ? "open" : "closed"}
        className={cn("accordion-item", className)}
        {...props}
      >
        {children}
      </section>
    </ItemContext.Provider>
  );
}

export function AccordionTrigger({ className, children, ...props }) {
  const root = useContext(AccordionContext);
  const item = useContext(ItemContext);

  if (!root || !item) return null;

  function toggle() {
    if (item.isOpen && root.collapsible) {
      root.setValue("");
      return;
    }
    root.setValue(item.value);
  }

  return (
    <h3 className="accordion-header">
      <button
        type="button"
        data-slot="accordion-trigger"
        data-state={item.isOpen ? "open" : "closed"}
        className={cn("accordion-trigger", className)}
        onClick={toggle}
        {...props}
      >
        <span>{children}</span>
        <span className={cn("accordion-chevron", item.isOpen && "accordion-chevron-open")}>v</span>
      </button>
    </h3>
  );
}

export function AccordionContent({ className, children, ...props }) {
  const item = useContext(ItemContext);
  if (!item) return null;

  return (
    <div
      data-slot="accordion-content"
      data-state={item.isOpen ? "open" : "closed"}
      className={cn("accordion-content", className)}
      hidden={!item.isOpen}
      {...props}
    >
      <div className="accordion-content-inner">{children}</div>
    </div>
  );
}
