"use client";

import { CalendarBlock } from "@/components/blocks/calendar/calendar";
import { CalendarProvider } from "@/contexts/calendar-context";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateObject, useTodayObjects } from "@/hooks/use-objects";
import { CreateObject } from "@/types/objects";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Agenda() {
  const { data: objects, isLoading } = useTodayObjects();
  const { mutate: createObject } = useCreateObject();
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem("todo") as HTMLInputElement;

    if (!input.value.trim()) return;
    
    const today = new Date().toISOString();
    createObject({ title: input.value.trim(), dueDate: today });
    form.reset();
    setIsFocused(false);
  };

  return (
    <section className="w-full h-full flex flex-col">
      <div className="w-full h-full bg-white flex flex-col">
        <div className="grid grid-cols-2 w-full h-full">
          <div className="h-full overflow-auto flex flex-col">
            <div className="px-4 pt-4 h-full">
              <form onSubmit={handleSubmit} className="relative mb-4">
                <div className={cn(
                  "flex items-center gap-3 py-2 rounded-md",
                  isFocused ? "bg-gray-50" : "",
                  "hover:bg-gray-50 transition-colors"
                )}>
                  <div className="flex items-center justify-center ml-3" style={{ width: '18px' }}>
                    <Checkbox className="h-[18px] w-[18px] border-gray-300" />
                  </div>
                  <Input
                    name="todo"
                    placeholder="Add object"
                    className={cn(
                      "border-none shadow-none p-0 h-auto",
                      "focus-visible:ring-0 focus:outline-none",
                      "bg-transparent text-sm placeholder:text-gray-400"
                    )}
                    onFocus={() => setIsFocused(true)}
                    onBlur={(e) => {
                      if (e.relatedTarget?.tagName !== 'BUTTON') {
                        setIsFocused(false);
                      }
                    }}
                  />
                </div>
              </form>
              
              {!isLoading && objects && (
                <div className="space-y-1 overflow-auto">
                  {[...objects].reverse().map((item) => (
                    <div key={item._id} className="flex items-center w-full py-2 rounded-md hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex items-center justify-center ml-3" style={{ width: '18px' }}>
                          <Checkbox
                            id={`item-${item._id}`}
                            className="h-[18px] w-[18px] border-gray-300"
                            checked={item.isCompleted}
                          />
                        </div>
                        <div className="flex-1">
                          <label
                            htmlFor={`item-${item._id}`}
                            className={cn(
                              "text-sm cursor-pointer select-none",
                              item.isCompleted ? "text-gray-400 line-through" : "text-gray-700"
                            )}
                          >
                            {item.title}
                          </label>
                          {item.tags && item.tags.length > 0 && (
                            <div className="mt-1 text-xs text-gray-400">
                              {item.tags.join(' ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="h-full overflow-auto">
            <CalendarProvider>
              <CalendarBlock />
            </CalendarProvider>
          </div>
        </div>
      </div>
    </section>
  );
}
