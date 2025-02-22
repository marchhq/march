"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { mockListItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./sortable-item";

export function ListItems() {
  const [items, setItems] = useState(mockListItems);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="space-y-1">
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              <div className="flex items-center w-full p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3 w-full">
                  <Checkbox
                    id={`item-${item.id}`}
                    className="h-[18px] w-[18px]"
                    checked={item.checked}
                  />
                  <label
                    htmlFor={`item-${item.id}`}
                    className={cn(
                      "text-sm cursor-pointer select-none",
                      item.checked && "text-gray-500 line-through"
                    )}
                  >
                    {item.text}
                  </label>
                </div>
              </div>
              <Separator className="last:hidden opacity-30" />
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
