import React, { createContext, useContext, useMemo } from "react";
import { cn } from "./utils";

const NavigationMenuContext = createContext(null);
const NavigationMenuItemContext = createContext(null);

function navigationMenuTriggerStyle(className = "") {
  return cn("ui-nav-trigger", className);
}

function NavigationMenu({
  className,
  children,
  viewport = true,
  value,
  onValueChange
}) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState("");
  const openValue = isControlled ? value : internalValue;

  const setOpenValue = (next) => {
    if (!isControlled) setInternalValue(next);
    if (onValueChange) onValueChange(next);
  };

  const ctx = useMemo(
    () => ({ openValue, setOpenValue, viewport }),
    [openValue, viewport]
  );

  return (
    <NavigationMenuContext.Provider value={ctx}>
      <nav
        data-slot="navigation-menu"
        data-viewport={viewport}
        className={cn("ui-nav-root", className)}
      >
        {children}
        {viewport && <NavigationMenuViewport />}
      </nav>
    </NavigationMenuContext.Provider>
  );
}

function NavigationMenuList({ className, ...props }) {
  return <ul data-slot="navigation-menu-list" className={cn("ui-nav-list", className)} {...props} />;
}

function NavigationMenuItem({ className, value, ...props }) {
  const fallbackId = React.useId();
  const itemValue = value || fallbackId;

  return (
    <NavigationMenuItemContext.Provider value={{ itemValue }}>
      <li data-slot="navigation-menu-item" className={cn("ui-nav-item", className)} {...props} />
    </NavigationMenuItemContext.Provider>
  );
}

function NavigationMenuTrigger({ className, children, ...props }) {
  const menu = useContext(NavigationMenuContext);
  const item = useContext(NavigationMenuItemContext);
  if (!menu || !item) return null;

  const isOpen = menu.openValue === item.itemValue;
  return (
    <button
      type="button"
      data-slot="navigation-menu-trigger"
      data-state={isOpen ? "open" : "closed"}
      className={cn(navigationMenuTriggerStyle(), className)}
      onClick={() => menu.setOpenValue(isOpen ? "" : item.itemValue)}
      {...props}
    >
      {children}
      <span className={cn("ui-nav-chevron", isOpen && "ui-nav-chevron-open")}>v</span>
    </button>
  );
}

function NavigationMenuContent({ className, ...props }) {
  const menu = useContext(NavigationMenuContext);
  const item = useContext(NavigationMenuItemContext);
  if (!menu || !item) return null;
  const isOpen = menu.openValue === item.itemValue;
  if (!isOpen) return null;

  return (
    <div data-slot="navigation-menu-content" className={cn("ui-nav-content", className)} {...props} />
  );
}

function NavigationMenuViewport({ className, ...props }) {
  return <div data-slot="navigation-menu-viewport" className={cn("ui-nav-viewport", className)} {...props} />;
}

function NavigationMenuLink({ className, ...props }) {
  return <a data-slot="navigation-menu-link" className={cn("ui-nav-link", className)} {...props} />;
}

function NavigationMenuIndicator({ className, ...props }) {
  const menu = useContext(NavigationMenuContext);
  const visible = Boolean(menu?.openValue);
  if (!visible) return null;
  return (
    <div data-slot="navigation-menu-indicator" className={cn("ui-nav-indicator", className)} {...props}>
      <span className="ui-nav-indicator-dot" />
    </div>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle
};
