"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface DatePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDateSelect: (date: Date | undefined) => void;
  initialDate?: Date;
}

export function DatePickerDialog({
  open,
  onOpenChange,
  onDateSelect,
  initialDate,
}: DatePickerDialogProps) {
  const [date, setDate] = useState<Date | undefined>(initialDate);

  const handleSave = () => {
    onDateSelect(date);
    onOpenChange(false);
  };

  const predefinedDates = [
    { label: "Today", value: new Date() },
    { 
      label: "Tomorrow", 
      value: new Date(new Date().setDate(new Date().getDate() + 1)) 
    },
    { 
      label: "Next week", 
      value: new Date(new Date().setDate(new Date().getDate() + 7)) 
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set due date</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex flex-col space-y-1.5">
              <div className="relative">
                <input
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  placeholder="Select a date"
                  value={date ? format(date, "PPP") : ""}
                  readOnly
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            {predefinedDates.map((predefinedDate, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-between text-left font-normal"
                onClick={() => setDate(predefinedDate.value)}
              >
                <span>{predefinedDate.label}</span>
                <span className="text-muted-foreground">
                  {format(predefinedDate.value, "EEE, MMM do")}
                </span>
              </Button>
            ))}
          </div>
          
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                setDate(undefined);
                onDateSelect(undefined);
                onOpenChange(false);
              }}
            >
              Clear
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
