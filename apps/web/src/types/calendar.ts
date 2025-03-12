export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO string format
  end: string; // ISO string format
  className?: string
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  allDay?: boolean;
  meetingUrl?: string;
  meetingIconUrl?: string;
  extendedProps?: {
    colorId: string;
    meetingUrl?: string;
    meetingIconUrl?: string;
  };
}

export interface EventResponse {
  events: Event[];
}

export interface CreateEventResponse {
  newEvent: Event
}

// Main event interface
export interface Event {
  kind: string;
  etag: string;
  id: string;
  status: string;
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  colorId: string
  creator: EventPerson;
  organizer: EventPerson;
  start: EventDateTime;
  end: EventDateTime;
  recurringEventId: string;
  originalStartTime: EventDateTime;
  iCalUID: string;
  sequence: number;
  attendees: EventAttendee[];
  hangoutLink: string;
  conferenceData: ConferenceData;
  reminders: EventReminders;
  eventType: string;
}

// Person (creator/organizer) interface
export interface EventPerson {
  email: string;
}

// DateTime interface with timezone
export interface EventDateTime {
  dateTime: string;
  timeZone?: string;
}

// Attendee interface
export interface EventAttendee {
  email: string;
  self?: boolean;
  organizer?: boolean;
  responseStatus: string;
}

// Conference data interfaces
export interface ConferenceData {
  entryPoints: ConferenceEntryPoint[];
  conferenceSolution: ConferenceSolution;
  conferenceId: string;
}

export interface ConferenceEntryPoint {
  entryPointType: string;
  uri: string;
  label?: string;
  pin?: string;
  regionCode?: string;
}

export interface ConferenceSolution {
  key: {
    type: string;
  };
  name: string;
  iconUri: string;
}

// Reminders interface
export interface EventReminders {
  useDefault: boolean;
}
