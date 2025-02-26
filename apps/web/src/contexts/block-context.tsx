"use client";

import { createContext, useContext, ReactNode } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { CalendarEvent } from "@/types/calendar";
import { arrayMove } from "@dnd-kit/sortable";
import { Objects } from "@/types/objects";
import {
  useInboxObjects,
  useOrderObject,
  useTodayObjects,
} from "@/hooks/use-objects";
import { useEvents } from "@/hooks/use-events";
import moment from "moment";

interface BlockContextType {
  items: Objects[];
  events: CalendarEvent[];
  handleDragEnd: (event: DragEndEvent) => void;
  handleInternalListSort: (event: DragEndEvent) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleCalendarDrop: (draggedItem: any) => void;
  isLoading: boolean;
  error: Error | null;
}

const BlockContext = createContext<BlockContextType | undefined>(undefined);

interface BlockProviderProps {
  children: ReactNode;
  arrayType: "inbox" | "today";
  blockId: string;
}

export function BlockProvider({ children, arrayType }: BlockProviderProps) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const query = arrayType === "inbox" ? useInboxObjects() : useTodayObjects();
  const { mutate: updateOrder } = useOrderObject();

  const { data: items = [], isLoading, error } = query;

  const today = moment().format("YYYY-MM-DD");
  const { data: events = [] } = useEvents(today);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleInternalListSort = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    // Check if both items are list items
    const isActiveListItem = active.data.current?.type === "list-item";
    const isOverListItem = over.data.current?.type === "list-item";

    if (isActiveListItem && isOverListItem) {
      const activeId = active.id as string;
      const overId = over.id as string;

      const oldIndex = items.findIndex((item) => item._id === activeId);
      const newIndex = items.findIndex((item) => item._id === overId);

      if (oldIndex !== newIndex) {
        // Create a new array with the item moved to the new position
        const newItems = arrayMove(items, oldIndex, newIndex);

        const orderedItems = newItems.map((item, index) => ({
          id: item._id,
          order: index,
        }));

        // Call the mutation to update the order in the backend
        updateOrder({
          orderedItems: orderedItems,
        });
      }
    } else {
      console.log("Items are not both list items, skipping sort");
    }
  };

  const handleCalendarDrop = (draggedItem: any) => {
    /* const dropDate = new Date();
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

    setEvents((prev) => [...prev, newEvent]); */
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    // Skip calendar drop check for now and directly handle internal sorting
    handleInternalListSort(event);
  };

  const value = {
    items,
    events,
    isLoading,
    error,
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
