import React, { createContext, useContext, useMemo, useState } from "react";
import { cn } from "./utils";

const AvatarContext = createContext(null);

function Avatar({ className, children, ...props }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const contextValue = useMemo(
    () => ({
      imageLoaded,
      imageError,
      setImageLoaded,
      setImageError
    }),
    [imageLoaded, imageError]
  );

  return (
    <AvatarContext.Provider value={contextValue}>
      <span
        data-slot="avatar"
        className={cn("ui-avatar", className)}
        {...props}
      >
        {children}
      </span>
    </AvatarContext.Provider>
  );
}

function AvatarImage({ className, onLoad, onError, ...props }) {
  const ctx = useContext(AvatarContext);
  if (!ctx) return null;

  return (
    <img
      data-slot="avatar-image"
      className={cn("ui-avatar-image", className)}
      onLoad={(event) => {
        ctx.setImageLoaded(true);
        ctx.setImageError(false);
        if (onLoad) onLoad(event);
      }}
      onError={(event) => {
        ctx.setImageLoaded(false);
        ctx.setImageError(true);
        if (onError) onError(event);
      }}
      {...props}
    />
  );
}

function AvatarFallback({ className, children, ...props }) {
  const ctx = useContext(AvatarContext);
  if (!ctx) return null;

  if (ctx.imageLoaded && !ctx.imageError) return null;

  return (
    <span
      data-slot="avatar-fallback"
      className={cn("ui-avatar-fallback", className)}
      {...props}
    >
      {children}
    </span>
  );
}

export { Avatar, AvatarImage, AvatarFallback };
