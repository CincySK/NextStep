import React, { createContext, useContext, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { cn } from "./utils";

const MenuContext = createContext(null);
const RadioGroupContext = createContext(null);
const SubContext = createContext(null);

function useMenuContext() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("ContextMenu components must be used within <ContextMenu>.");
  return ctx;
}

function ContextMenu({ children }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const value = useMemo(() => ({ open, setOpen, position, setPosition }), [open, position]);
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

function ContextMenuTrigger({ children, className, ...props }) {
  const { setOpen, setPosition } = useMenuContext();

  return (
    <div
      data-slot="context-menu-trigger"
      className={cn(className)}
      onContextMenu={(event) => {
        event.preventDefault();
        setPosition({ x: event.clientX, y: event.clientY });
        setOpen(true);
      }}
      {...props}
    >
      {children}
    </div>
  );
}

function ContextMenuPortal({ children }) {
  if (typeof document === "undefined") return null;
  return ReactDOM.createPortal(children, document.body);
}

function ContextMenuContent({ className, style, children, ...props }) {
  const { open, setOpen, position } = useMenuContext();
  if (!open) return null;

  return (
    <ContextMenuPortal>
      <div className="ui-context-menu-backdrop" onClick={() => setOpen(false)} />
      <div
        data-slot="context-menu-content"
        className={cn("ui-context-menu-content", className)}
        style={{ left: position.x, top: position.y, ...style }}
        {...props}
      >
        {children}
      </div>
    </ContextMenuPortal>
  );
}

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  onSelect,
  onClick,
  children,
  ...props
}) {
  const { setOpen } = useMenuContext();

  return (
    <button
      type="button"
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "ui-context-menu-item",
        inset && "ui-context-menu-item-inset",
        variant === "destructive" && "ui-context-menu-item-destructive",
        className
      )}
      onClick={(event) => {
        if (onClick) onClick(event);
        if (onSelect) onSelect(event);
        if (!event.defaultPrevented) setOpen(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  onCheckedChange,
  ...props
}) {
  const { setOpen } = useMenuContext();
  return (
    <button
      type="button"
      data-slot="context-menu-checkbox-item"
      className={cn("ui-context-menu-item ui-context-menu-item-inset", className)}
      onClick={() => {
        if (onCheckedChange) onCheckedChange(!checked);
        setOpen(false);
      }}
      {...props}
    >
      <span className="ui-context-menu-indicator">{checked ? "✓" : ""}</span>
      {children}
    </button>
  );
}

function ContextMenuRadioGroup({ value, onValueChange, children, ...props }) {
  const ctx = useMemo(() => ({ value, onValueChange }), [value, onValueChange]);
  return (
    <RadioGroupContext.Provider value={ctx}>
      <div data-slot="context-menu-radio-group" {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

function ContextMenuRadioItem({ className, children, value, ...props }) {
  const group = useContext(RadioGroupContext);
  const { setOpen } = useMenuContext();
  const selected = group?.value === value;

  return (
    <button
      type="button"
      data-slot="context-menu-radio-item"
      className={cn("ui-context-menu-item ui-context-menu-item-inset", className)}
      onClick={() => {
        if (group?.onValueChange) group.onValueChange(value);
        setOpen(false);
      }}
      {...props}
    >
      <span className="ui-context-menu-indicator">{selected ? "•" : ""}</span>
      {children}
    </button>
  );
}

function ContextMenuLabel({ className, inset, ...props }) {
  return (
    <div
      data-slot="context-menu-label"
      className={cn("ui-context-menu-label", inset && "ui-context-menu-item-inset", className)}
      {...props}
    />
  );
}

function ContextMenuSeparator({ className, ...props }) {
  return <div data-slot="context-menu-separator" className={cn("ui-context-menu-separator", className)} {...props} />;
}

function ContextMenuShortcut({ className, ...props }) {
  return <span data-slot="context-menu-shortcut" className={cn("ui-context-menu-shortcut", className)} {...props} />;
}

function ContextMenuGroup({ className, ...props }) {
  return <div data-slot="context-menu-group" className={cn(className)} {...props} />;
}

function ContextMenuSub({ children, ...props }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return (
    <SubContext.Provider value={value}>
      <div data-slot="context-menu-sub" className="ui-context-menu-sub" {...props}>
        {children}
      </div>
    </SubContext.Provider>
  );
}

function ContextMenuSubTrigger({ className, inset, children, ...props }) {
  const sub = useContext(SubContext);
  return (
    <button
      type="button"
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn("ui-context-menu-item", inset && "ui-context-menu-item-inset", className)}
      onMouseEnter={() => sub?.setOpen(true)}
      onMouseLeave={() => sub?.setOpen(false)}
      {...props}
    >
      {children}
      <span className="ui-context-menu-sub-arrow">{">"}</span>
    </button>
  );
}

function ContextMenuSubContent({ className, ...props }) {
  const sub = useContext(SubContext);
  if (!sub?.open) return null;
  return <div data-slot="context-menu-sub-content" className={cn("ui-context-menu-sub-content", className)} {...props} />;
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup
};
