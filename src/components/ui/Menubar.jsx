import React, { createContext, useContext, useMemo, useState } from "react";
import { cn } from "./utils";

const MenubarContext = createContext(null);
const MenubarRadioContext = createContext(null);
const MenubarSubContext = createContext(null);

function useMenubar() {
  const ctx = useContext(MenubarContext);
  if (!ctx) throw new Error("Menubar components must be used within <Menubar>.");
  return ctx;
}

function Menubar({ className, children, ...props }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const value = useMemo(() => ({ openMenuId, setOpenMenuId }), [openMenuId]);

  return (
    <MenubarContext.Provider value={value}>
      <div
        data-slot="menubar"
        className={cn("ui-menubar", className)}
        {...props}
      >
        {children}
      </div>
    </MenubarContext.Provider>
  );
}

function MenubarPortal({ children }) {
  return <>{children}</>;
}

function MenubarMenu({ value, children, ...props }) {
  return (
    <div data-slot="menubar-menu" data-menu-id={value} className="ui-menubar-menu" {...props}>
      {children}
    </div>
  );
}

function MenubarTrigger({ className, children, onClick, ...props }) {
  const { openMenuId, setOpenMenuId } = useMenubar();
  const menuId = props["data-menu-id"] || props["data-menu"] || props.id || childrenText(children);
  const isOpen = openMenuId === menuId;

  return (
    <button
      type="button"
      data-slot="menubar-trigger"
      data-state={isOpen ? "open" : "closed"}
      className={cn("ui-menubar-trigger", className)}
      onClick={(event) => {
        if (onClick) onClick(event);
        if (!event.defaultPrevented) setOpenMenuId(isOpen ? null : menuId);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function MenubarContent({ className, children, ...props }) {
  const { openMenuId, setOpenMenuId } = useMenubar();
  const menuId = props["data-menu-id"] || props["data-menu"] || props.id || inferIdFromChildren(children);
  const open = openMenuId === menuId;
  if (!open) return null;

  return (
    <div className="ui-menubar-overlay" onClick={() => setOpenMenuId(null)}>
      <div
        data-slot="menubar-content"
        className={cn("ui-menubar-content", className)}
        onClick={(event) => event.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

function MenubarGroup({ ...props }) {
  return <div data-slot="menubar-group" {...props} />;
}

function MenubarItem({ className, inset, variant = "default", onClick, children, ...props }) {
  const { setOpenMenuId } = useMenubar();
  return (
    <button
      type="button"
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "ui-menubar-item",
        inset && "ui-menubar-item-inset",
        variant === "destructive" && "ui-menubar-item-destructive",
        className
      )}
      onClick={(event) => {
        if (onClick) onClick(event);
        if (!event.defaultPrevented) setOpenMenuId(null);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function MenubarCheckboxItem({ className, children, checked, onCheckedChange, ...props }) {
  const { setOpenMenuId } = useMenubar();
  return (
    <button
      type="button"
      data-slot="menubar-checkbox-item"
      className={cn("ui-menubar-item ui-menubar-item-inset", className)}
      onClick={() => {
        if (onCheckedChange) onCheckedChange(!checked);
        setOpenMenuId(null);
      }}
      {...props}
    >
      <span className="ui-menubar-indicator">{checked ? "✓" : ""}</span>
      {children}
    </button>
  );
}

function MenubarRadioGroup({ value, onValueChange, children, ...props }) {
  const ctx = useMemo(() => ({ value, onValueChange }), [value, onValueChange]);
  return (
    <MenubarRadioContext.Provider value={ctx}>
      <div data-slot="menubar-radio-group" {...props}>
        {children}
      </div>
    </MenubarRadioContext.Provider>
  );
}

function MenubarRadioItem({ className, children, value, ...props }) {
  const group = useContext(MenubarRadioContext);
  const { setOpenMenuId } = useMenubar();
  const checked = group?.value === value;
  return (
    <button
      type="button"
      data-slot="menubar-radio-item"
      className={cn("ui-menubar-item ui-menubar-item-inset", className)}
      onClick={() => {
        if (group?.onValueChange) group.onValueChange(value);
        setOpenMenuId(null);
      }}
      {...props}
    >
      <span className="ui-menubar-indicator">{checked ? "•" : ""}</span>
      {children}
    </button>
  );
}

function MenubarLabel({ className, inset, ...props }) {
  return (
    <div
      data-slot="menubar-label"
      data-inset={inset}
      className={cn("ui-menubar-label", inset && "ui-menubar-item-inset", className)}
      {...props}
    />
  );
}

function MenubarSeparator({ className, ...props }) {
  return <div data-slot="menubar-separator" className={cn("ui-menubar-separator", className)} {...props} />;
}

function MenubarShortcut({ className, ...props }) {
  return <span data-slot="menubar-shortcut" className={cn("ui-menubar-shortcut", className)} {...props} />;
}

function MenubarSub({ children, ...props }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return (
    <MenubarSubContext.Provider value={value}>
      <div data-slot="menubar-sub" className="ui-menubar-sub" {...props}>
        {children}
      </div>
    </MenubarSubContext.Provider>
  );
}

function MenubarSubTrigger({ className, inset, children, ...props }) {
  const sub = useContext(MenubarSubContext);
  return (
    <button
      type="button"
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn("ui-menubar-item", inset && "ui-menubar-item-inset", className)}
      onMouseEnter={() => sub?.setOpen(true)}
      onMouseLeave={() => sub?.setOpen(false)}
      {...props}
    >
      {children}
      <span className="ui-menubar-sub-arrow">{">"}</span>
    </button>
  );
}

function MenubarSubContent({ className, ...props }) {
  const sub = useContext(MenubarSubContext);
  if (!sub?.open) return null;
  return <div data-slot="menubar-sub-content" className={cn("ui-menubar-sub-content", className)} {...props} />;
}

function childrenText(children) {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(childrenText).join(" ");
  if (children && typeof children === "object" && "props" in children) return childrenText(children.props.children);
  return "menu";
}

function inferIdFromChildren(children) {
  const text = childrenText(children).trim();
  return text ? `menu-${text.slice(0, 20).toLowerCase()}` : "menu-default";
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent
};
