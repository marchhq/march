"use client"
import * as React from "react"

import { type EventApi, formatDate } from "@fullcalendar/core"
import interactionPlugin from "@fullcalendar/interaction"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"

let eventGuid = 0
const createEventId = (): string => {
  return String(eventGuid++)
}

const todayStr = new Date().toISOString().replace(/T.*$/, "") // YYYY-MM-DD of today
const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: "All-day event",
    start: todayStr,
  },
  {
    id: createEventId(),
    title: "Timed event",
    start: todayStr + "T12:00:00",
  },
]

interface Props {
  currentDate: Date
}

const DayCalendar: React.FC<Props> = ({ currentDate }) => {
  const [currentEvents, setCurrentEvents] = React.useState<EventApi[]>([])

  const handleDateSelect = (selectInfo): void => {
    const title = prompt("Please enter a new title for your event")
    const calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title !== null) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      })
    }
  }

  const handleEventClick = (clickInfo): void => {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove()
    }
  }

  const handleEvents = (events: EventApi[]): void => {
    setCurrentEvents(events)
  }

  return (
    <section className="h-full rounded-lg border border-white/10 bg-white/10 px-6 py-5 shadow-lg backdrop-blur-lg">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next",
          right: "today",
        }}
        initialView="timeGridDay"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
        select={handleDateSelect}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        eventsSet={handleEvents} // called after events are initialized/added/changed/removed
        /* you can update a remote database when these fire:
          eventAdd={function(){}}
          eventChange={function(){}}
          eventRemove={function(){}}
          */
      />
    </section>
  )
}

const renderEventContent = (eventInfo): React.ReactNode => {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <span>{eventInfo.event.title}</span>
    </>
  )
}

export default DayCalendar
