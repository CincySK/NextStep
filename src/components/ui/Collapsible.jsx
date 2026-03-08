import React, { createContext, useContext, useMemo, useState } from "react";

const CollapsibleContext = createContext(null);

function Collapsible({ open, defaultOpen = false, onOpenChange, children, ...props }) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = (next) => {
    if (!isControlled) setInternalOpen(next);
    if (onOpenChange) onOpenChange(next);
  };

  const value = useMemo(() => ({ isOpen, setOpen }), [isOpen]);

  return (
    <CollapsibleContext.Provider value={value}>
      <div data-slot="collapsible" data-state={isOpen ? "open" : "closed"} {...props}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}

function CollapsibleTrigger({ onClick, ...props }) {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) return null;

  return (
    <button
      type="button"
      data-slot="collapsible-trigger"
      data-state={ctx.isOpen ? "open" : "closed"}
      onClick={(event) => {
        if (onClick) onClick(event);
        if (!event.defaultPrevented) ctx.setOpen(!ctx.isOpen);
      }}
      {...props}
    />
  );
}

function CollapsibleContent({ ...props }) {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) return null;

  return (
    <div
      data-slot="collapsible-content"
      data-state={ctx.isOpen ? "open" : "closed"}
      hidden={!ctx.isOpen}
      {...props}
    />
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
