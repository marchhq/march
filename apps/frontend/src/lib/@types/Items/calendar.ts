export interface Meeting {
  summary: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  location: string
  hangoutLink: string
}

export interface Meetings {
  meetings: Meeting[]
}
