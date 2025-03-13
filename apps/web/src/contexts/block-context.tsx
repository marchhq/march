"use client";

import { createContext, useContext, ReactNode } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { CalendarEvent, Event } from "@/types/calendar";
import { arrayMove } from "@dnd-kit/sortable";
import { Objects, OrderObject, SortableObject } from "@/types/objects";
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
  handleCalendarDrop: (draggedItem: SortableObject, dropDate?: Date) => void;
  handleDeleteEvent: (eventId: string) => void;
  isLoading: boolean;
  error: Error | null;
}

const BlockContext = createContext<BlockContextType | undefined>(undefined);

interface BlockProviderProps {
  children: ReactNode;
  arrayType: "inbox" | "today";
}

export function BlockProvider({ children, arrayType }: BlockProviderProps) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const query = arrayType === "inbox" ? useInboxObjects() : useTodayObjects();
  const { mutate: updateOrder } = useOrderObject();

  const { data: items = [], isLoading, error } = query;

  const today = moment().format("YYYY-MM-DD");
  const { data: events = [], addEvent, delEvent } = useEvents(today);

  const handleInternalListSort = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    // Check if both items are list items and not dragging to calendar
    const isActiveListItem = active.data.current?.type === "list-item";
    const isOverListItem = over.data.current?.type === "list-item";
    const isCalendarDrop = over.id === "calendar-drop-area";

    // Skip if this is a calendar drop
    if (isCalendarDrop) return;

    if (isActiveListItem && isOverListItem) {
      const activeId = active.id as string;
      const overId = over.id as string;

      const oldIndex = items.findIndex((item) => item._id === activeId);
      const newIndex = items.findIndex((item) => item._id === overId);

      if (oldIndex !== newIndex) {
        // Create a new array with the item moved to the new position
        const newItems = arrayMove(items, oldIndex, newIndex);

        const orderObject: OrderObject = {
          orderedItems: newItems.map((item, index) => ({
            id: item._id,
            order: index,
          })),
        };

        // Call the mutation to update the order in the backend
        updateOrder(orderObject);
      }
    }
  };

  const handleCalendarDrop = (draggedItem: SortableObject, dropDate?: Date) => {
    console.log("HandleCalendarDrop Called:", {
      draggedItem,
      dropDate,
      dropDateISO: dropDate?.toISOString(),
    });

    if (!draggedItem) return;

    // Use provided dropDate or current time as fallback
    const startDate = dropDate || new Date();
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

    console.log("Creating New Event:", {
      startDate,
      startDateISO: startDate.toISOString(),
      endDate,
      endDateISO: endDate.toISOString(),
      summary: draggedItem.text,
    });

    const newEvent: Partial<Event> = {
      summary: draggedItem.text || "New Event",
      start: {
        dateTime: startDate.toISOString(),
      },
      end: {
        dateTime: endDate.toISOString(),
      },
    };

    addEvent(newEvent);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    if (!over) return;

    // Only handle internal list sorting, ignore calendar drops completely
    handleInternalListSort(event);
  };

  const handleDeleteEvent = (eventId: string) => {
    delEvent(eventId);
  };

  const value = {
    items,
    events,
    isLoading,
    error,
    handleDragEnd,
    handleInternalListSort,
    handleCalendarDrop,
    handleDeleteEvent,
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
