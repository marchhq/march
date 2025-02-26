"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";
import { CalendarApi } from "@fullcalendar/core";
import type { DatesSetArg } from "@fullcalendar/core";
import { useEvents } from "@/hooks/use-events";
import moment from "moment";
import { CalendarEvent } from "@/types/calendar";

interface CalendarContextType {
  calendarApi: CalendarApi | null;
  currentDate: string;
  events: CalendarEvent[];
  isLoading: boolean;
  setCalendarApi: (api: CalendarApi) => void;
  handlePrevious: () => void;
  handleNext: () => void;
  handleToday: () => void;
  handleDatesSet: (arg: DatesSetArg) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

interface CalendarProviderProps {
  children: ReactNode;
}

export function CalendarProvider({ children }: CalendarProviderProps) {
  const [calendarApi, setCalendarApi] = useState<CalendarApi | null>(null);
  const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DD"));

  const { data: events = [], isLoading } = useEvents(currentDate);

  const handleDatesSet = useCallback((arg: DatesSetArg) => {
    const viewStart = moment(arg.start).format("YYYY-MM-DD");
    setCurrentDate(viewStart);
  }, []);

  const handlePrevious = useCallback(() => {
    calendarApi?.prev();
  }, [calendarApi]);

  const handleNext = useCallback(() => {
    calendarApi?.next();
  }, [calendarApi]);

  const handleToday = useCallback(() => {
    calendarApi?.today();
  }, [calendarApi]);

  const value = {
    calendarApi,
    currentDate,
    events,
    isLoading,
    setCalendarApi,
    handlePrevious,
    handleNext,
    handleToday,
    handleDatesSet,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within CalendarProvider");
  }
  return context;
};
