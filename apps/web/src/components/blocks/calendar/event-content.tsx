import { EVENT_COLORS } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function renderEventContent(eventInfo: any) {
  const colorId = eventInfo.event._def.extendedProps.colorId || "default";
  const style = {
    backgroundColor: EVENT_COLORS[colorId].backgroundColor,
    color: EVENT_COLORS[colorId].textColor,
    borderLeft: `4px solid ${EVENT_COLORS[colorId].borderColor}`,
  };

  // Calculate event duration in minutes
  const start = eventInfo.event.start;
  const end = eventInfo.event.end;
  const durationInMinutes = end
    ? (end.getTime() - start.getTime()) / (1000 * 60)
    : 0;

  const startText = eventInfo.timeText.split(" - ")[0];

  if (durationInMinutes <= 30) {
    return (
      <div className="custom-event-content pl-2" style={style}>
        <div className="flex items-center gap-2">
          <span className="fc-event-title">{eventInfo.event.title}</span>
          <span className="fc-event-time text-sm">{startText}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-event-content pl-2" style={style}>
      <div className="fc-event-title">{eventInfo.event.title}</div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
    </div>
  );
}
