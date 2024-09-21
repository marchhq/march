export interface Attendee {
  email: string
  organizer?: boolean
  self?: boolean
  responseStatus: string
}

export interface EntryPoint {
  entryPointType: string
  uri: string
  label?: string
  pin?: string
  regionCode?: string
}

export interface Metadata {
  status: string
  attendees: Attendee[]
  hangoutLink: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
  creator: {
    email: string
    self: boolean
  }
  conferenceData: {
    entryPoints: EntryPoint[]
    conferenceSolution: {
      key: {
        type: string
      }
      name: string
      iconUri: string
    }
    conferenceId: string
  }
}

export interface Meet {
  _id: string
  title: string
  content: string
  metadata: Metadata
  id: string
  createdAt: string
  updatedAt: string
  pages: []
  user: string
  isArchived: boolean
  isDeleted: boolean
  uuid: string
  __v: number
}

export interface GetMeetResponse {
  meetings: Meet[]
}
