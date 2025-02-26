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

  const sortedItems = [...items].reverse();

  return (
    <SortableContext
      items={sortedItems.map((item) => item._id)}
      strategy={verticalListSortingStrategy}
    >
      <div className="space-y-1">
        {sortedItems.map((item) => (
          <SortableItem
            key={item._id}
            id={item._id}
            data={{
              type: "list-item",
              text: item.title,
              checked: item.isCompleted,
            }}
          >
            <div className="flex items-center w-full py-2 px-0 rounded-md hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3 w-full">
                <div className="flex items-center justify-center" style={{ width: '18px' }}>
                  <Checkbox
                    id={`item-${item._id}`}
                    className="h-[18px] w-[18px] border-gray-300"
                    checked={item.isCompleted}
                  />
                </div>
                <label
                  htmlFor={`item-${item._id}`}
                  className={cn(
                    "text-sm cursor-pointer select-none",
                    item.isCompleted ? "text-gray-400 line-through" : "text-gray-700"
                  )}
                >
                  {item.title}
                </label>
              </div>
            </div>
            <Separator className="last:hidden opacity-20" />
          </SortableItem>
        ))}
      </div>
    </SortableContext>
  );
}
