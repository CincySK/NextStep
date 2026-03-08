import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { cn } from "./utils";
import { Button } from "./Button";
import { Input } from "./Input";
import { Separator } from "./Separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "./Sheet";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

const SidebarContext = createContext(null);

function useIsMobileLocal() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return isMobile;
}

function asChildRender(asChild, children, props) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      className: cn(children.props?.className, props.className)
    });
  }
  return null;
}

function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
  return context;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) {
  const isMobile = useIsMobileLocal();
  const [openMobile, setOpenMobile] = useState(false);
  const [_open, _setOpen] = useState(defaultOpen);
  const open = openProp ?? _open;

  const setOpen = (value) => {
    const next = typeof value === "function" ? value(open) : value;
    if (setOpenProp) setOpenProp(next);
    else _setOpen(next);

    if (typeof document !== "undefined") {
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${next}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    }
  };

  const toggleSidebar = () => {
    if (isMobile) setOpenMobile((v) => !v);
    else setOpen((v) => !v);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const state = open ? "expanded" : "collapsed";

  const contextValue = useMemo(
    () => ({
      state,
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar
    }),
    [state, open, openMobile, isMobile]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        style={{
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          ...style
        }}
        className={cn("ui-sidebar-wrapper", className)}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <div data-slot="sidebar" className={cn("ui-sidebar-fixed", className)} {...props}>
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          side={side}
          className="ui-sidebar-mobile"
          style={{ "--sidebar-width": SIDEBAR_WIDTH_MOBILE }}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="ui-sidebar-mobile-inner">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={cn("ui-sidebar-shell", className)}
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
      {...props}
    >
      <div data-slot="sidebar-gap" className="ui-sidebar-gap" />
      <div data-slot="sidebar-container" className={cn("ui-sidebar-container", side === "right" && "ui-sidebar-right")}>
        <div data-sidebar="sidebar" data-slot="sidebar-inner" className="ui-sidebar-inner">
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarTrigger({ className, onClick, ...props }) {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("ui-sidebar-trigger", className)}
      onClick={(event) => {
        if (onClick) onClick(event);
        toggleSidebar();
      }}
      {...props}
    >
      <span aria-hidden="true">||</span>
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

function SidebarRail({ className, ...props }) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn("ui-sidebar-rail", className)}
      {...props}
    />
  );
}

function SidebarInset({ className, ...props }) {
  return <main data-slot="sidebar-inset" className={cn("ui-sidebar-inset", className)} {...props} />;
}

function SidebarInput({ className, ...props }) {
  return <Input data-slot="sidebar-input" data-sidebar="input" className={cn("ui-sidebar-input", className)} {...props} />;
}

function SidebarHeader({ className, ...props }) {
  return <div data-slot="sidebar-header" data-sidebar="header" className={cn("ui-sidebar-header", className)} {...props} />;
}

function SidebarFooter({ className, ...props }) {
  return <div data-slot="sidebar-footer" data-sidebar="footer" className={cn("ui-sidebar-footer", className)} {...props} />;
}

function SidebarSeparator({ className, ...props }) {
  return <Separator data-slot="sidebar-separator" data-sidebar="separator" className={cn("ui-sidebar-separator", className)} {...props} />;
}

function SidebarContent({ className, ...props }) {
  return <div data-slot="sidebar-content" data-sidebar="content" className={cn("ui-sidebar-content", className)} {...props} />;
}

function SidebarGroup({ className, ...props }) {
  return <div data-slot="sidebar-group" data-sidebar="group" className={cn("ui-sidebar-group", className)} {...props} />;
}

function SidebarGroupLabel({ className, asChild = false, children, ...props }) {
  const rendered = asChildRender(asChild, children, {
    "data-slot": "sidebar-group-label",
    "data-sidebar": "group-label",
    className: cn("ui-sidebar-group-label", className),
    ...props
  });
  if (rendered) return rendered;
  return (
    <div data-slot="sidebar-group-label" data-sidebar="group-label" className={cn("ui-sidebar-group-label", className)} {...props}>
      {children}
    </div>
  );
}

function SidebarGroupAction({ className, asChild = false, children, ...props }) {
  const rendered = asChildRender(asChild, children, {
    "data-slot": "sidebar-group-action",
    "data-sidebar": "group-action",
    className: cn("ui-sidebar-group-action", className),
    ...props
  });
  if (rendered) return rendered;
  return (
    <button data-slot="sidebar-group-action" data-sidebar="group-action" className={cn("ui-sidebar-group-action", className)} {...props}>
      {children}
    </button>
  );
}

function SidebarGroupContent({ className, ...props }) {
  return <div data-slot="sidebar-group-content" data-sidebar="group-content" className={cn("ui-sidebar-group-content", className)} {...props} />;
}

function SidebarMenu({ className, ...props }) {
  return <ul data-slot="sidebar-menu" data-sidebar="menu" className={cn("ui-sidebar-menu", className)} {...props} />;
}

function SidebarMenuItem({ className, ...props }) {
  return <li data-slot="sidebar-menu-item" data-sidebar="menu-item" className={cn("ui-sidebar-menu-item", className)} {...props} />;
}

function sidebarMenuButtonVariants({ variant = "default", size = "default" } = {}) {
  return cn(
    "ui-sidebar-menu-button",
    variant === "outline" && "ui-sidebar-menu-button-outline",
    size === "sm" && "ui-sidebar-menu-button-sm",
    size === "lg" && "ui-sidebar-menu-button-lg"
  );
}

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  children,
  ...props
}) {
  const { isMobile, state } = useSidebar();

  const merged = cn(
    sidebarMenuButtonVariants({ variant, size }),
    isActive && "ui-sidebar-menu-button-active",
    className
  );

  const title = typeof tooltip === "string" && state === "collapsed" && !isMobile ? tooltip : undefined;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      title,
      "data-slot": "sidebar-menu-button",
      "data-sidebar": "menu-button",
      "data-size": size,
      "data-active": isActive,
      className: cn(children.props?.className, merged)
    });
  }

  return (
    <button
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={merged}
      title={title}
      {...props}
    >
      {children}
    </button>
  );
}

function SidebarMenuAction({ className, asChild = false, children, ...props }) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      "data-slot": "sidebar-menu-action",
      "data-sidebar": "menu-action",
      className: cn(children.props?.className, "ui-sidebar-menu-action", className)
    });
  }
  return (
    <button data-slot="sidebar-menu-action" data-sidebar="menu-action" className={cn("ui-sidebar-menu-action", className)} {...props}>
      {children}
    </button>
  );
}

function SidebarMenuBadge({ className, ...props }) {
  return <div data-slot="sidebar-menu-badge" data-sidebar="menu-badge" className={cn("ui-sidebar-menu-badge", className)} {...props} />;
}

function SidebarMenuSkeleton({ className, showIcon = false, ...props }) {
  const width = useMemo(() => `${Math.floor(Math.random() * 40) + 50}%`, []);
  return (
    <div data-slot="sidebar-menu-skeleton" data-sidebar="menu-skeleton" className={cn("ui-sidebar-menu-skeleton", className)} {...props}>
      {showIcon ? <div className="ui-skeleton ui-sidebar-skeleton-icon" /> : null}
      <div className="ui-skeleton ui-sidebar-skeleton-text" style={{ width }} />
    </div>
  );
}

function SidebarMenuSub({ className, ...props }) {
  return <ul data-slot="sidebar-menu-sub" data-sidebar="menu-sub" className={cn("ui-sidebar-menu-sub", className)} {...props} />;
}

function SidebarMenuSubItem({ className, ...props }) {
  return <li data-slot="sidebar-menu-sub-item" data-sidebar="menu-sub-item" className={cn("ui-sidebar-menu-sub-item", className)} {...props} />;
}

function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  children,
  ...props
}) {
  const merged = cn(
    "ui-sidebar-menu-sub-button",
    size === "sm" && "ui-sidebar-menu-sub-button-sm",
    isActive && "ui-sidebar-menu-sub-button-active",
    className
  );

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      "data-slot": "sidebar-menu-sub-button",
      "data-sidebar": "menu-sub-button",
      "data-size": size,
      "data-active": isActive,
      className: cn(children.props?.className, merged)
    });
  }

  return (
    <a
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={merged}
      {...props}
    >
      {children}
    </a>
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
  sidebarMenuButtonVariants
};
