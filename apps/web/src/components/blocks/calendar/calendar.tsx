"use client";

import { useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useDroppable } from "@dnd-kit/core";
import { useCalendar } from "@/contexts/calendar-context";
import CalendarHeader from "./calendar-header";
import moment from "moment";

export function CalendarBlock() {
  const calendarRef = useRef<any>(null);
  const { events, handleDatesSet, setCalendarApi } = useCalendar();

  const { setNodeRef, isOver } = useDroppable({
    id: "calendar-drop-area",
    data: { type: "calendar" },
  });

  // Set calendar API on mount
  useEffect(() => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      setCalendarApi(api);
    }
  }, []);

  return (
    <div
      ref={setNodeRef}
      className={`calendar-container ${isOver ? "bg-gray-100" : ""}`}
    >
      <CalendarHeader />
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridDay"
        headerToolbar={false}
        allDaySlot={false}
        dayHeaderFormat={{ weekday: "short", day: "numeric" }}
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
        expandRows={true}
        height="calc(100vh - 48px)"
        events={events}
        datesSet={handleDatesSet}
        nowIndicator={true}
        scrollTime={`${moment().format("HH:mm:ss")}`}
        eventDisplay="block"
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          omitZeroMinute: true,
          meridiem: "short",
        }}
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          omitZeroMinute: true,
          meridiem: "short",
        }}
        dayHeaderContent={({ date }) => {
          const weekday = date
            .toLocaleDateString("en-US", { weekday: "short" })
            .toUpperCase();
          const number = date.getDate();
          return (
            <div className="day-header">
              <span className="weekday">{weekday}</span>
              <span className="day-number">{number}</span>
            </div>
          );
        }}
      />
    </div>
  );
}
