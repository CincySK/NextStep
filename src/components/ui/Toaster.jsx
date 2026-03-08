import React, { useEffect, useMemo, useState } from "react";
import { cn } from "./utils";

const EVENT_NAME = "nextstep-toast";

function resolveTheme(theme) {
  if (theme && theme !== "system") return theme;
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function normalizePosition(position) {
  const value = String(position || "bottom-right").toLowerCase();
  if (
    value === "top-left" ||
    value === "top-center" ||
    value === "top-right" ||
    value === "bottom-left" ||
    value === "bottom-center" ||
    value === "bottom-right"
  ) {
    return value;
  }
  return "bottom-right";
}

function Toaster({
  theme = "system",
  className,
  position = "bottom-right",
  duration = 3200,
  ...props
}) {
  const [items, setItems] = useState([]);
  const resolvedTheme = useMemo(() => resolveTheme(theme), [theme]);
  const normalizedPosition = useMemo(() => normalizePosition(position), [position]);

  useEffect(() => {
    function onToast(event) {
      const payload = event?.detail ?? {};
      const id = payload.id || `toast_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const next = {
        id,
        title: payload.title || "",
        description: payload.description || payload.message || "",
        type: payload.type || "default",
        duration: Number.isFinite(payload.duration) ? payload.duration : duration
      };

      setItems((prev) => [...prev, next]);

      window.setTimeout(() => {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }, Math.max(800, next.duration));
    }

    window.addEventListener(EVENT_NAME, onToast);
    return () => window.removeEventListener(EVENT_NAME, onToast);
  }, [duration]);

  return (
    <div
      data-slot="toaster"
      data-theme={resolvedTheme}
      className={cn("toaster", `toaster-${normalizedPosition}`, className)}
      style={
        {
          "--normal-bg": "var(--popover, #ffffff)",
          "--normal-text": "var(--popover-foreground, #0f172a)",
          "--normal-border": "var(--border, #dbe2ea)"
        }
      }
      {...props}
    >
      {items.map((item) => (
        <article key={item.id} className={cn("toast-item", item.type !== "default" && `toast-${item.type}`)}>
          {item.title ? <h4 className="toast-title">{item.title}</h4> : null}
          {item.description ? <p className="toast-description">{item.description}</p> : null}
        </article>
      ))}
    </div>
  );
}

export { Toaster };
