"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { mockListItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import React from "react";

export function ListItems() {
  const items = mockListItems;

  return (
    <div className="space-y-1">
      {items.map((item) => (
        <React.Fragment key={item.id}>
          <div className="flex items-center w-full p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3 w-full">
              <Checkbox 
                id={`item-${item.id}`}
                className="h-[18px] w-[18px]"
                checked={item.completed}
              />
              <label 
                htmlFor={`item-${item.id}`}
                className={cn(
                  "text-sm cursor-pointer select-none",
                  item.completed && "text-gray-500 line-through"
                )}
              >
                {item.text}
              </label>
            </div>
          </div>
          <Separator className="last:hidden opacity-30" />
        </React.Fragment>
      ))}
    </div>
  );
}
