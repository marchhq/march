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
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import ExpandedView from "@/components/object/expanded-view";

export function ListItems() {
  const { items } = useBlock();
  const { mutate: updateObject } = useUpdateObject();

  // Sort items by order property
  const sortedItems = [...items].sort((a, b) => a.order - b.order);

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
                <div
                  className="flex items-center justify-center"
                  style={{ width: "18px" }}
                >
                  <Checkbox
                    id={`item-${item._id}`}
                    className="h-[18px] w-[18px] border-gray-300"
                    checked={item.isCompleted}
                    onCheckedChange={() => {
                      updateObject({
                        _id: item._id,
                        isCompleted: !item.isCompleted,
                      });
                    }}
                  />
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <div
                      className={cn(
                        "text-sm cursor-pointer select-none",
                        item.isCompleted
                          ? "text-gray-400 line-through"
                          : "text-gray-700"
                      )}
                    >
                      {item.title}
                    </div>
                  </SheetTrigger>
                  <ExpandedView item={item} />
                </Sheet>
              </div>
            </div>
            <Separator className="last:hidden opacity-20" />
          </SortableItem>
        ))}
      </div>
    </SortableContext>
  );
}
