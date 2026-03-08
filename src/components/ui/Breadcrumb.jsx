import React from "react";
import { cn } from "./utils";

function Breadcrumb(props) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn("ui-breadcrumb-list", className)}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("ui-breadcrumb-item", className)}
      {...props}
    />
  );
}

function BreadcrumbLink({ asChild, className, children, ...props }) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      className: cn("ui-breadcrumb-link", children.props?.className, className),
      "data-slot": "breadcrumb-link"
    });
  }

  return (
    <a
      data-slot="breadcrumb-link"
      className={cn("ui-breadcrumb-link", className)}
      {...props}
    >
      {children}
    </a>
  );
}

function BreadcrumbPage({ className, ...props }) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("ui-breadcrumb-page", className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({ children, className, ...props }) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("ui-breadcrumb-separator", className)}
      {...props}
    >
      {children ?? ">"}
    </li>
  );
}

function BreadcrumbEllipsis({ className, ...props }) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("ui-breadcrumb-ellipsis", className)}
      {...props}
    >
      ...
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis
};
