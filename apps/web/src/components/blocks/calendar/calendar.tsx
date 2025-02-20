"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const events = [
  {
    title: "Ask landlord about rent",
    start: "2025-02-20T11:00:00",
    end: "2025-02-20T11:30:00",
    backgroundColor: "#E8F5E9",
    textColor: "#1B5E20",
    borderColor: "#E8F5E9",
  },
  {
    title: "Finish laundry",
    start: "2025-02-20T12:30:00",
    end: "2025-02-20T13:00:00",
    backgroundColor: "#FFF3E0",
    textColor: "#E65100",
    borderColor: "#FFF3E0",
  },
  {
    title: "Complete project intent form",
    start: "2025-02-20T13:00:00",
    end: "2025-02-20T13:30:00",
    backgroundColor: "#FFEBEE",
    textColor: "#B71C1C",
    borderColor: "#FFEBEE",
  },
  {
    title: "Product Club Weekly Meeting",
    start: "2025-02-20T13:30:00",
    end: "2025-02-20T14:00:00",
    backgroundColor: "#E3F2FD",
    textColor: "#0D47A1",
    borderColor: "#E3F2FD",
  },
  {
    title: "Finish research paper outline",
    start: "2025-02-20T15:00:00",
    end: "2025-02-20T16:30:00",
    backgroundColor: "#FFEBEE",
    textColor: "#B71C1C",
    borderColor: "#FFEBEE",
  },
  {
    title: "Club Fair",
    start: "2025-02-20T16:30:00",
    end: "2025-02-20T17:30:00",
    backgroundColor: "#F3F6F9",
    textColor: "#1A237E",
    borderColor: "#F3F6F9",
  },
  {
    title: "Read 20 pages",
    start: "2025-02-20T17:30:00",
    end: "2025-02-20T18:30:00",
    backgroundColor: "#E8F5E9",
    textColor: "#1B5E20",
    borderColor: "#E8F5E9",
  },
  {
    title: "Dinner with friends",
    start: "2025-02-20T19:00:00",
    end: "2025-02-20T20:00:00",
    backgroundColor: "#F3F6F9",
    textColor: "#4A148C",
    borderColor: "#F3F6F9",
  },
];

export default function CalendarBlock() {
  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="header-left">
          <span className="calendar-title">Calendar</span>
          <span className="calendar-date">20, february 25</span>
          <div className="nav-buttons">
            <button className="nav-button" aria-label="Previous">
              ←
            </button>
            <button className="nav-button" aria-label="Next">
              →
            </button>
            <button className="nav-button" aria-label="Return to Present">
              ↩
            </button>
          </div>
        </div>
      </div>
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
