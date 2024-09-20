"use client"
import * as React from "react"

import { type EventApi } from "@fullcalendar/core"
import interactionPlugin from "@fullcalendar/interaction"
import FullCalendar from "@fullcalendar/react"
import timeGridPlugin from "@fullcalendar/timegrid"

let eventGuid = 0
const createEventId = (): string => {
  return String(eventGuid++)
}

interface Props {
  currentDate: Date
  initialEvents: any[]
}

const DayCalendar: React.FC<Props> = ({ currentDate, initialEvents }) => {
  const [currentEvents, setCurrentEvents] = React.useState<EventApi[]>([])

  console.log(currentEvents)
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
    <section className="h-full overflow-hidden rounded-lg border border-white/10 bg-white/10 shadow-lg backdrop-blur-lg">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        headerToolbar={false}
        // headerToolbar={{
        //   left: "prev,next",
        //   right: "today",
        // }}
        initialView="timeGridDay"
        initialDate={currentDate}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        initialEvents={initialEvents} // alternatively, use the `events` setting to fetch from a feed
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
    <span className="flex gap-1 p-1">
      <b>{eventInfo.timeText}</b>
      <span>{eventInfo.event.title}</span>
    </span>
  )
}

export default DayCalendar
