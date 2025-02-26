"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ListItemButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const ListItemButton = React.forwardRef<HTMLButtonElement, ListItemButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "w-full text-left bg-transparent border-none cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ListItemButton.displayName = "ListItemButton";

export { ListItemButton };
