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
  description: string
  metadata: Metadata
  id: string
  createdAt: string
  updatedAt: string
  spaces: string
  blocks: string
  user: string
  isArchived: boolean
  isDeleted: boolean
  uuid: string
  __v: number
}

export interface GetMeetResponse {
  meetings: Meet[]
}

export interface MeetsStoreType {
  /**
   * Meets array
   */
  meets: Meet[]
  /**
   * Upcoming Meets array
   */
  currentMeeting: Meet | null
  setCurrentMeeting: (meet: Meet | null) => void
  isFetched: boolean
  setIsFetched: (status: boolean) => void
  /**
   * Fetch Meets from the server
   * @param session - The session of the user
   */
  fetchMeets: (session: string) => Promise<void>
  fetchLatestMeet: (session: string) => Promise<Meet | null>
  /**
   * Fetch meeting by id
   * @param session and meet _id
   */
  fetchMeetByid: (session: string, id: string) => Promise<void>
  /**
   * Fetch meeting by id
   * @param session and meet _id
   */
  createMeet: (
    session: string,
    spaceId: string,
    blockId: string,
    meet: any
  ) => Promise<void>
  /**
   * Update a Meet in local
   * @param meet - The Meet to update
   */
  updateMeet: (session: string, meet: any, id: string) => Promise<void>
  /**
   * Save a Meet to the server
   * @param meet - The Meet to save
   * @param session - The session of the user
   */
  saveMeet: (session: string, meet: any) => Promise<void>
}
