import React from "react";

function AspectRatio({ ratio = 16 / 9, children, style, ...props }) {
  const safeRatio = Number.isFinite(Number(ratio)) && Number(ratio) > 0 ? Number(ratio) : 16 / 9;
  const paddingTop = `${100 / safeRatio}%`;

  return (
    <div
      data-slot="aspect-ratio"
      className="ui-aspect-ratio"
      style={{ position: "relative", width: "100%", paddingTop, ...style }}
      {...props}
    >
      <div className="ui-aspect-ratio-content">
        {children}
      </div>
    </div>
  );
}

export { AspectRatio };
