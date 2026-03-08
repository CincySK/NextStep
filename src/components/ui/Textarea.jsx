import React from "react";
import { cn } from "./utils";

function Textarea({ label, className, ...props }) {
  if (label) {
    return (
      <div className="ui-input-wrap">
        <label className="ui-input-label">{label}</label>
        <textarea
          data-slot="textarea"
          className={cn("ui-textarea", className)}
          {...props}
        />
      </div>
    );
  }

  return (
    <textarea
      data-slot="textarea"
      className={cn("ui-textarea", className)}
      {...props}
    />
  );
}

export { Textarea };
