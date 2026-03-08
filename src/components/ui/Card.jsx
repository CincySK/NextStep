import React from "react";
import { cn } from "./utils";

export function Card({ children, className = "", hover = false, onClick }) {
  return (
    <div
      className={cn("ui-card", hover && "ui-card-hover", onClick && "ui-card-clickable", className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
