"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

export default function CalendarBlock() {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin]}
      initialView="timeGridDay"
      headerToolbar={false}
      allDayText="All day"
      aspectRatio={1}
      slotLabelFormat={{
        hour: "numeric",
        minute: "2-digit",
        omitZeroMinute: true,
        meridiem: true,
      }}
      eventTimeFormat={{
        hour: "numeric",
        minute: "2-digit",
        omitZeroMinute: true,
        meridiem: true,
      }}
      height={"100%"}
    />
  );
}
