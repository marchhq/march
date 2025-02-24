"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CalendarHeader from "./calendar-header";
import { useDroppable } from "@dnd-kit/core";
import { useBlock } from "@/contexts/block-context";
import moment from "moment";

export default function CalendarBlock() {
  const { events } = useBlock();

  const { setNodeRef, isOver } = useDroppable({
    id: "calendar-drop-area",
    data: {
      type: "calendar",
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`calendar-container ${isOver ? "bg-gray-100" : ""}`}
    >
      <CalendarHeader />
      <FullCalendar
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
