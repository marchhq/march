"use client";

import { Objects } from "@/types/objects";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Tag } from "lucide-react";

interface ObjectDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  object: Objects | null;
}

export function ObjectDetailDialog({
  open,
  onOpenChange,
  object,
}: ObjectDetailDialogProps) {
  if (!object) return null;

  const hasTags = object.labels && object.labels.length > 0;
  const hasDueDate = object.dueDate !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            <div className="flex items-center gap-3">
              <Checkbox
                id={`detail-checkbox-${object._id}`}
                className="h-[18px] w-[18px] border-gray-300"
                checked={object.isCompleted}
                // In a real app, you would handle the checkbox change
                // onCheckedChange={(checked) => handleCheckboxChange(object._id, checked)}
              />
              <span className={cn(
                object.isCompleted ? "text-gray-400 line-through" : "text-gray-900"
              )}>
                {object.title}
              </span>
            </div>
          </DialogTitle>
          {(hasDueDate || hasTags) && (
            <DialogDescription className="mt-2">
              <div className="flex flex-wrap gap-3">
                {hasDueDate && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(object.dueDate as unknown as string), "MMM d, yyyy")}
                    </span>
                  </div>
                )}
                {hasTags && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Tag className="h-4 w-4" />
                    <span>{object.labels.join(", ")}</span>
                  </div>
                )}
              </div>
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="mt-4">
          {object.description ? (
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {object.description}
            </div>
          ) : (
            <div className="text-sm text-gray-400 italic">
              No description provided
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-400">
            Created: {format(new Date(object.createdAt), "MMM d, yyyy 'at' h:mm a")}
            {object.updatedAt !== object.createdAt && (
              <> · Updated: {format(new Date(object.updatedAt), "MMM d, yyyy 'at' h:mm a")}</>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
