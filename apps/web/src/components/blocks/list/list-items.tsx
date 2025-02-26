"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./sortable-item";
import { useBlock } from "@/contexts/block-context";
import { ObjectDetailDialog } from "@/components/dialogs/object-detail/object-detail-dialog";
import { DatePickerDialog } from "@/components/dialogs/date-picker/date-picker-dialog";
import { Objects } from "@/types/objects";
import { ListItemButton } from "@/components/ui/list-item-button";
import { Calendar } from "lucide-react";

export function ListItems() {
  const { items } = useBlock();
  const [selectedObject, setSelectedObject] = useState<Objects | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [itemForDatePicker, setItemForDatePicker] = useState<Objects | null>(null);

  const sortedItems = [...items].reverse();

  const handleItemClick = (item: Objects) => {
    setSelectedObject(item);
    setDetailDialogOpen(true);
  };

  const handleScheduleClick = (e: React.MouseEvent, item: Objects) => {
    e.stopPropagation();
    setItemForDatePicker(item);
    setDatePickerOpen(true);
  };

  const handleDateSelect = (date: Date | undefined) => {
    // Here you would update the item with the new due date
    console.log("Setting due date for item", itemForDatePicker?._id, "to", date);
    // In a real implementation, you would call an API or update the state
  };

  return (
    <>
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
              <div className="group relative">
                <ListItemButton onClick={() => handleItemClick(item)}>
                  <div className="flex items-center w-full py-2 rounded-md hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex items-center justify-center ml-3" style={{ width: '18px' }}>
                        <Checkbox
                          id={`item-${item._id}`}
                          className="h-[18px] w-[18px] border-gray-300"
                          checked={item.isCompleted}
                          // Stop propagation to prevent the button click when checking the checkbox
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor={`item-${item._id}`}
                          className={cn(
                            "text-sm cursor-pointer select-none",
                            item.isCompleted ? "text-gray-400 line-through" : "text-gray-700"
                          )}
                          // Stop propagation to prevent the button click when clicking the label
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.title}
                        </label>
                        {item.tags && item.tags.length > 0 && (
                          <div className="mt-1 text-xs text-gray-400">
                            {item.tags.join(' ')}
                          </div>
                        )}
                        {item.dueDate && (
                          <div className="mt-1 text-xs text-blue-500">
                            Due: {new Date(item.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </ListItemButton>
                
                {/* Floating schedule icon */}
                <div 
                  className="absolute right-3 top-1/2 -translate-y-1/2 hidden group-hover:block"
                  style={{ zIndex: 10 }}
                >
                  <button 
                    className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200"
                    onClick={(e) => handleScheduleClick(e, item)}
                    aria-label="Set due date"
                  >
                    <Calendar className="h-4 w-4 text-gray-700" />
                  </button>
                </div>
              </div>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
      
      <ObjectDetailDialog 
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        object={selectedObject}
      />

      <DatePickerDialog
        open={datePickerOpen}
        onOpenChange={setDatePickerOpen}
        onDateSelect={handleDateSelect}
        initialDate={itemForDatePicker?.dueDate ? new Date(itemForDatePicker.dueDate) : undefined}
      />
    </>
  );
}
