/* eslint-disable @typescript-eslint/no-explicit-any */
export function renderEventContent(eventInfo: any) {
  return (
    <div className="custom-event-content pl-2">
      <div className="fc-event-title">{eventInfo.event.title}</div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
    </div>
  );
}
