export interface Event {
  kind: string
  etag: string
  id: string
  status: string
  htmlLink: string
  created: string
  updated: string
  summary: string
  description: string
  creator: {
    email: string
  }
  organizer: {
    email: string
  }
  start: {
    dateTime: string
    timeZone?: string
  }
  end: {
    dateTime: string
    timeZone?: string
  }
  recurringEventId?: string
  originalStartTime?: {
    dateTime: string
    timeZone: string
  }
  iCalUID: string
  sequence: number
  attendees?: Array<{
    email: string
    self?: boolean
    organizer?: boolean
    responseStatus: "accepted" | "needsAction" | "declined" | "tentative"
  }>
  location?: string
  hangoutLink?: string
  conferenceData?: {
    entryPoints: Array<{
      entryPointType: "video" | "more" | "phone"
      uri: string
      label?: string
      pin?: string
    }>
    conferenceSolution: {
      key: {
        type: string
      }
      name: string
      iconUri: string
    }
    conferenceId: string
  }
  guestsCanModify: boolean
  reminders: {
    useDefault: boolean
  }
  eventType: string
}

export interface Events {
  events: Event[]
}

export interface CalendarEvent {
  id: number
  title: string
  start: string
  end: string
}

export interface EventFormData {
  title: string
  date: string
  location: string
  "start-time": string
  "end-time": string
  description: string
}

export interface EventPayload {
  summary: string
  location?: string
  description?: string
  start: {
    dateTime: string
  }
  end: {
    dateTime: string
  }
}
