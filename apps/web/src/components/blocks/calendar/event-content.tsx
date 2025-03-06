import { EVENT_COLORS } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function renderEventContent(eventInfo: any) {
  const colorId = eventInfo.event.extendedProps.colorId || "default";
  const style = {
    backgroundColor: EVENT_COLORS[colorId].backgroundColor,
    color: EVENT_COLORS[colorId].textColor,
    borderLeft: `4px solid ${EVENT_COLORS[colorId].borderColor}`,
  };

  return (
    <div className="custom-event-content pl-2" style={style}>
      <div className="fc-event-title">{eventInfo.event.title}</div>
      <div className="fc-event-time">{eventInfo.timeText}</div>
    </div>
  );
}
