"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./sortable-item";
import { useBlock } from "@/contexts/block-context";

export function ListItems() {
  const { items } = useBlock();

  return (
    <SortableContext
      items={items.map((item) => item._id)}
      strategy={verticalListSortingStrategy}
    >
      <div className="space-y-1">
        {items.map((item) => (
          <SortableItem
            key={item._id}
            id={item._id}
            data={{
              type: "list-item",
              text: item.title,
              checked: item.isCompleted,
            }}
          >
            <div className="flex items-center w-full p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3 w-full">
                <Checkbox
                  id={`item-${item._id}`}
                  className="h-[18px] w-[18px]"
                  checked={item.isCompleted}
                />
                <label
                  htmlFor={`item-${item._id}`}
                  className={cn(
                    "text-sm cursor-pointer select-none",
                    item.isCompleted && "text-gray-500 line-through"
                  )}
                >
                  {item.title}
                </label>
              </div>
            </div>
            <Separator className="last:hidden opacity-30" />
          </SortableItem>
        ))}
      </div>
    </SortableContext>
  );
}
