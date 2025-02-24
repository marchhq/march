"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { CalendarEvent } from "@/types/calendar";
import { arrayMove } from "@dnd-kit/sortable";
import { mockEvents, mockListItems } from "@/lib/mock-data";

interface BlockContextType {
  items: any[];
  events: CalendarEvent[];
  handleDragEnd: (event: DragEndEvent) => void;
  handleInternalListSort: (event: DragEndEvent) => void;
  handleCalendarDrop: (draggedItem: any) => void;
}

const BlockContext = createContext<BlockContextType | undefined>(undefined);

interface BlockProviderProps {
  children: ReactNode;
  blockId: string;
}

export function BlockProvider({ children, blockId }: BlockProviderProps) {
  const [items, setItems] = useState(mockListItems);
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);

  const handleInternalListSort = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (
      active.data.current?.type === "list-item" &&
      over.data.current?.type === "list-item"
    ) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleCalendarDrop = (draggedItem: any) => {
    const dropDate = new Date();
    const endDate = new Date(dropDate.getTime() + 60 * 60 * 1000);

    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: draggedItem.text,
      start: dropDate.toISOString(),
      end: endDate.toISOString(),
      backgroundColor: "#E3F2FD",
      textColor: "#0D47A1",
      borderColor: "#E3F2FD",
    };

    setEvents((prev) => [...prev, newEvent]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (over.id === "calendar-drop-area") {
      handleCalendarDrop(active.data.current);
    } else {
      handleInternalListSort(event);
    }
  };

  const value = {
    items,
    events,
    handleDragEnd,
    handleInternalListSort,
    handleCalendarDrop,
  };

  return (
    <BlockContext.Provider value={value}>{children}</BlockContext.Provider>
  );
}

export const useBlock = () => {
  const context = useContext(BlockContext);
  if (context === undefined) {
    throw new Error("useBlock must be used within an BlockProvider");
  }
  return context;
};
