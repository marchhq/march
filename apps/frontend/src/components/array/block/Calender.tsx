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

interface Props {
  currentDate: Date
  initialEvents: Array<{
    id: string
    title: string
    start: string | Date
    end?: string | Date
    allDay?: boolean
  }>
}

const DayCalendar: React.FC<Props> = ({ currentDate, initialEvents }) => {
  const [currentEvents, setCurrentEvents] = React.useState<EventApi[]>([])

  const handleDateSelect = (selectInfo: any): void => {
    const title = prompt("Please enter a new title for your event")
    const calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      })
    }
  }

  const handleEventClick = (clickInfo: any): void => {
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

  const renderEventContent = (eventInfo: any): React.ReactNode => {
    return (
      <span className="flex gap-1 p-1">
        <b>{eventInfo.timeText}</b>
        <span>{eventInfo.event.title}</span>
      </span>
    )
  }

  return (
    <section className="h-[500px] w-full overflow-hidden rounded-lg border border-white/10 bg-white/10 shadow-lg backdrop-blur-lg">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridDay,timeGridWeek,dayGridMonth'
        }}
        initialView="timeGridDay"
        initialDate={currentDate}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        initialEvents={initialEvents}
        select={handleDateSelect}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        eventsSet={handleEvents}
        height="100%"
      />
    </section>
  )
}

export default DayCalendar
