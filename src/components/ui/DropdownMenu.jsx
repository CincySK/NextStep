import React, { createContext, useContext, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { cn } from "./utils";

const DropdownContext = createContext(null);
const DropdownRadioContext = createContext(null);
const DropdownSubContext = createContext(null);

function useDropdown() {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error("Dropdown components must be used within <DropdownMenu>.");
  return ctx;
}

function DropdownMenu({ children, open: controlledOpen, onOpenChange, defaultOpen = false }) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (next) => {
    if (!isControlled) setInternalOpen(next);
    if (onOpenChange) onOpenChange(next);
  };

  const value = useMemo(() => ({ open, setOpen, anchor, setAnchor }), [open, anchor]);
  return <DropdownContext.Provider value={value}>{children}</DropdownContext.Provider>;
}

function DropdownMenuPortal({ children }) {
  if (typeof document === "undefined") return null;
  return ReactDOM.createPortal(<div data-slot="dropdown-menu-portal">{children}</div>, document.body);
}

function DropdownMenuTrigger({ children, className, onClick, ...props }) {
  const { open, setOpen, setAnchor } = useDropdown();
  return (
    <button
      type="button"
      data-slot="dropdown-menu-trigger"
      className={cn(className)}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setAnchor({ x: rect.left, y: rect.bottom + 4 });
        if (onClick) onClick(event);
        if (!event.defaultPrevented) setOpen(!open);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function DropdownMenuContent({ className, sideOffset = 4, style, children, ...props }) {
  const { open, setOpen, anchor } = useDropdown();
  if (!open) return null;

  return (
    <DropdownMenuPortal>
      <div className="ui-dropdown-backdrop" onClick={() => setOpen(false)} />
      <div
        data-slot="dropdown-menu-content"
        className={cn("ui-dropdown-content", className)}
        style={{ left: anchor.x, top: anchor.y + sideOffset, ...style }}
        {...props}
      >
        {children}
      </div>
    </DropdownMenuPortal>
  );
}

function DropdownMenuGroup({ ...props }) {
  return <div data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  onClick,
  children,
  ...props
}) {
  const { setOpen } = useDropdown();
  return (
    <button
      type="button"
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "ui-dropdown-item",
        inset && "ui-dropdown-item-inset",
        variant === "destructive" && "ui-dropdown-item-destructive",
        className
      )}
      onClick={(event) => {
        if (onClick) onClick(event);
        if (!event.defaultPrevented) setOpen(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  onCheckedChange,
  ...props
}) {
  const { setOpen } = useDropdown();
  return (
    <button
      type="button"
      data-slot="dropdown-menu-checkbox-item"
      className={cn("ui-dropdown-item ui-dropdown-item-inset", className)}
      onClick={() => {
        if (onCheckedChange) onCheckedChange(!checked);
        setOpen(false);
      }}
      {...props}
    >
      <span className="ui-dropdown-indicator">{checked ? "✓" : ""}</span>
      {children}
    </button>
  );
}

function DropdownMenuRadioGroup({ value, onValueChange, children, ...props }) {
  const ctx = useMemo(() => ({ value, onValueChange }), [value, onValueChange]);
  return (
    <DropdownRadioContext.Provider value={ctx}>
      <div data-slot="dropdown-menu-radio-group" {...props}>
        {children}
      </div>
    </DropdownRadioContext.Provider>
  );
}

function DropdownMenuRadioItem({ className, children, value, ...props }) {
  const group = useContext(DropdownRadioContext);
  const { setOpen } = useDropdown();
  const checked = group?.value === value;

  return (
    <button
      type="button"
      data-slot="dropdown-menu-radio-item"
      className={cn("ui-dropdown-item ui-dropdown-item-inset", className)}
      onClick={() => {
        if (group?.onValueChange) group.onValueChange(value);
        setOpen(false);
      }}
      {...props}
    >
      <span className="ui-dropdown-indicator">{checked ? "•" : ""}</span>
      {children}
    </button>
  );
}

function DropdownMenuLabel({ className, inset, ...props }) {
  return (
    <div
      data-slot="dropdown-menu-label"
      className={cn("ui-dropdown-label", inset && "ui-dropdown-item-inset", className)}
      {...props}
    />
  );
}

function DropdownMenuSeparator({ className, ...props }) {
  return <div data-slot="dropdown-menu-separator" className={cn("ui-dropdown-separator", className)} {...props} />;
}

function DropdownMenuShortcut({ className, ...props }) {
  return <span data-slot="dropdown-menu-shortcut" className={cn("ui-dropdown-shortcut", className)} {...props} />;
}

function DropdownMenuSub({ children, ...props }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return (
    <DropdownSubContext.Provider value={value}>
      <div data-slot="dropdown-menu-sub" className="ui-dropdown-sub" {...props}>
        {children}
      </div>
    </DropdownSubContext.Provider>
  );
}

function DropdownMenuSubTrigger({ className, inset, children, ...props }) {
  const sub = useContext(DropdownSubContext);
  return (
    <button
      type="button"
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn("ui-dropdown-item", inset && "ui-dropdown-item-inset", className)}
      onMouseEnter={() => sub?.setOpen(true)}
      onMouseLeave={() => sub?.setOpen(false)}
      {...props}
    >
      {children}
      <span className="ui-dropdown-sub-arrow">{">"}</span>
    </button>
  );
}

function DropdownMenuSubContent({ className, ...props }) {
  const sub = useContext(DropdownSubContext);
  if (!sub?.open) return null;
  return <div data-slot="dropdown-menu-sub-content" className={cn("ui-dropdown-sub-content", className)} {...props} />;
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
};
