import React, { createContext, useContext, useMemo, useState } from "react";
import { cn } from "./utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "./Dialog";

const CommandContext = createContext(null);

function useCommandContext() {
  const ctx = useContext(CommandContext);
  if (!ctx) throw new Error("Command components must be used within <Command>.");
  return ctx;
}

function normalize(text) {
  return String(text ?? "").toLowerCase().trim();
}

function childrenText(children) {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(childrenText).join(" ");
  if (children && typeof children === "object" && "props" in children) return childrenText(children.props.children);
  return "";
}

function Command({ className, children, ...props }) {
  const [query, setQuery] = useState("");
  const value = useMemo(() => ({ query, setQuery }), [query]);
  return (
    <CommandContext.Provider value={value}>
      <div
        data-slot="command"
        className={cn("ui-command", className)}
        {...props}
      >
        {children}
      </div>
    </CommandContext.Provider>
  );
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  ...props
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent className="ui-command-dialog-content">
        <Command>{children}</Command>
      </DialogContent>
    </Dialog>
  );
}

function CommandInput({ className, ...props }) {
  const { query, setQuery } = useCommandContext();
  return (
    <div data-slot="command-input-wrapper" className="ui-command-input-wrap">
      <span className="ui-command-search-icon" aria-hidden="true">/</span>
      <input
        data-slot="command-input"
        className={cn("ui-command-input", className)}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        {...props}
      />
    </div>
  );
}

function CommandList({ className, ...props }) {
  return (
    <div
      data-slot="command-list"
      className={cn("ui-command-list", className)}
      {...props}
    />
  );
}

function CommandEmpty({ className, children = "No results found.", ...props }) {
  const { query } = useCommandContext();
  if (!query) return null;
  return (
    <div
      data-slot="command-empty"
      className={cn("ui-command-empty", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function CommandGroup({ className, ...props }) {
  return (
    <div
      data-slot="command-group"
      className={cn("ui-command-group", className)}
      {...props}
    />
  );
}

function CommandSeparator({ className, ...props }) {
  return (
    <div
      data-slot="command-separator"
      className={cn("ui-command-separator", className)}
      {...props}
    />
  );
}

function CommandItem({ className, value = "", keywords = "", children, ...props }) {
  const { query } = useCommandContext();
  const text = normalize(value || childrenText(children));
  const term = normalize(query);
  const keywordText = normalize(Array.isArray(keywords) ? keywords.join(" ") : keywords);
  const visible = !term || text.includes(term) || keywordText.includes(term);

  if (!visible) return null;

  return (
    <div
      data-slot="command-item"
      className={cn("ui-command-item", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function CommandShortcut({ className, ...props }) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn("ui-command-shortcut", className)}
      {...props}
    />
  );
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator
};
