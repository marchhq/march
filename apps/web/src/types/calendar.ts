export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO string format
  end: string; // ISO string format
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  allDay?: boolean;
}
