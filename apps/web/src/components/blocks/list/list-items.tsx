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
import { useUpdateObject } from "@/hooks/use-objects";

export function ListItems() {
  const { items } = useBlock();
  const { mutate: updateObject } = useUpdateObject();

  // Sort items by order property
  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  if (sortedItems.length === 0) {
    return (
      <div className="py-4 text-center text-gray-500 text-sm">
        No items yet. Add one above.
      </div>
    );
  }

  return (
    <SortableContext
      items={sortedItems.map((item) => item._id)}
      strategy={verticalListSortingStrategy}
    >
      <div className="space-y-0.5">
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
            <div className="flex items-center w-full py-2 px-1 rounded-md hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-2 w-full">
                <div
                  className="flex items-center justify-center"
                  style={{ width: '18px' }}
                >
                  <Checkbox
                    id={`item-${item._id}`}
                    className={cn(
                      "h-[18px] w-[18px] border-gray-300",
                      "transition-all duration-200",
                      item.isCompleted ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                    )}
                    checked={item.isCompleted}
                    onCheckedChange={() => {
                      updateObject({
                        _id: item._id,
                        isCompleted: !item.isCompleted,
                      });
                    }}
                  />
                </div>
                <label
                  htmlFor={`item-${item._id}`}
                  className={cn(
                    "text-sm cursor-pointer select-none",
                    item.isCompleted
                      ? "text-gray-400 line-through"
                      : "text-gray-700"
                  )}
                >
                  {item.title}
                </label>
              </div>
            </div>
            <Separator className="last:hidden opacity-20 my-0" />
          </SortableItem>
        ))}
      </div>
    </SortableContext>
  );
}
