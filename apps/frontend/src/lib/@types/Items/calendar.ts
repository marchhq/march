export interface Meeting {
  kind: string
  etag: string
  id: string
  status: string
  htmlLink: string
  created: string
  updated: string
  summary: string
  creator: {
    email: string
  }
  organizer: {
    email: string
  }
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  recurringEventId: string
  originalStartTime: {
    dateTime: string
    timeZone: string
  }
  iCalUID: string
  sequence: number
  attendees: Array<{
    email: string
    self?: boolean
    organizer?: boolean
    responseStatus: "accepted" | "needsAction" | "declined" | "tentative"
  }>
  location: string
  hangoutLink: string
  conferenceData: {
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

export interface Meetings {
  events: Meeting[]
}
