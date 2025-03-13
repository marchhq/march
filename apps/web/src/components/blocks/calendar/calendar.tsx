"use client";

import { useRef, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import { useCalendar } from "@/contexts/calendar-context";
import moment from "moment";
import { renderEventContent } from "./event-content";
import { EventClickArg } from "@fullcalendar/core";
import { EventDetails } from "./event-details";
import { useBlock } from "@/contexts/block-context";

export function CalendarBlock() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calendarRef = useRef<any>(null);
  const { events, handleDatesSet, setCalendarApi } = useCalendar();
  const [selectedEvent, setSelectedEvent] = useState<EventClickArg | null>(
    null
  );
  const [popoverAnchor, setPopoverAnchor] = useState({ x: 0, y: 0 });
  const calendarWrapperRef = useRef<HTMLDivElement>(null);
  const { handleCalendarDrop } = useBlock();

  // Set calendar API on mount
  useEffect(() => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      setCalendarApi(api);
    }
  }, [setCalendarApi]);

  // Prevent calendar scroll when popover is open
  useEffect(() => {
    if (!calendarWrapperRef.current) return;

    const calendar = calendarWrapperRef.current;
    const preventDefault = (e: Event) => {
      if (selectedEvent) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    calendar.addEventListener("wheel", preventDefault, { passive: false });
    calendar.addEventListener("touchmove", preventDefault, { passive: false });

    return () => {
      calendar.removeEventListener("wheel", preventDefault);
      calendar.removeEventListener("touchmove", preventDefault);
    };
  }, [selectedEvent]);

  // Initialize Draggable for external elements
  useEffect(() => {
    const draggableEl = document.querySelector(".draggable-container");
    if (draggableEl) {
      new Draggable(draggableEl as HTMLElement, {
        itemSelector: ".draggable-item",
        eventData: function (eventEl) {
          const itemData = eventEl.getAttribute("data-object");
          console.log("Draggable eventData:", {
            element: eventEl,
            data: itemData,
          });

          const parsedData = JSON.parse(itemData || "{}");
          return {
            title: parsedData.text || "New Event",
            duration: "01:00",
            create: true,
            extendedProps: {
              itemData: parsedData,
            },
          };
        },
      });
    }
  }, []);

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedEvent(clickInfo);

    const eventEl = clickInfo.el;
    const eventRect = eventEl.getBoundingClientRect();
    const calendarRect = calendarWrapperRef.current?.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    if (!calendarRect) return;

    // Check if there's enough space on the right side
    const spaceOnRight = viewportWidth - eventRect.right;
    const popoverWidth = 320; // w-80 = 20rem = 320px

    // If there's not enough space on the right, position it on the left
    const x =
      spaceOnRight < popoverWidth + 20
        ? eventRect.left - calendarRect.left - popoverWidth
        : eventRect.right - calendarRect.left;

    const y = eventRect.top - calendarRect.top;

    setPopoverAnchor({ x, y });
  };

  return (
    <div className="calendar-container h-full relative">
      <div ref={calendarWrapperRef} className="pt-2 px-4 h-full">
        {selectedEvent && (
          <EventDetails
            selectedEvent={selectedEvent}
            position={popoverAnchor}
            onClose={() => setSelectedEvent(null)}
          />
        )}
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
          height="calc(100vh - 140px)"
          eventContent={renderEventContent}
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
              <div className="day-header flex items-center space-x-1">
                <span className="weekday">{weekday}</span>
                <span className="day-number">{number}</span>
              </div>
            );
          }}
          eventClick={handleEventClick}
          editable={true}
          droppable={true}
          drop={(info) => {
            // Prevent default to avoid double event creation
            info.draggedEl.parentNode?.removeChild(info.draggedEl);

            console.log("Drop Event:", {
              date: info.date,
              dateStr: info.date?.toISOString(),
              allDay: info.allDay,
              draggedEl: info.draggedEl,
            });

            const draggedItem = JSON.parse(
              info.draggedEl.getAttribute("data-object") || "{}"
            );
            handleCalendarDrop(draggedItem, info.date);
          }}
        />
      </div>
    </div>
  );
}
