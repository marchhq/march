import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import moment from "moment";
import { EventClickArg } from "@fullcalendar/core";
import { useLockScroll } from "@/hooks/use-lock-scroll";
import { Dot, Link } from "lucide-react";
import Image from "next/image";

interface EventDetailsProps {
  selectedEvent: EventClickArg;
  position: { x: number; y: number };
  onClose: () => void;
}

const EventDetails = ({
  selectedEvent,
  position,
  onClose,
}: EventDetailsProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Lock scroll when popover is open
  useLockScroll(isPopoverOpen);

  useEffect(() => {
    setIsPopoverOpen(true);
  }, [selectedEvent]);

  const handleOpenChange = (open: boolean) => {
    setIsPopoverOpen(open);
    if (!open) {
      onClose();
    }
  };

  const isGoogleMeet =
    selectedEvent.event.extendedProps?.meetingUrl?.includes("meet");
  const isZoom =
    selectedEvent.event.extendedProps?.meetingUrl?.includes("zoom");

  return (
    <Popover open={isPopoverOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div
          style={{
            position: "fixed",
            left: position.x,
            top: position.y,
            width: "1px",
            height: "1px",
            padding: 0,
            margin: 0,
            opacity: 0,
          }}
        />
      </PopoverTrigger>
      <PopoverContent
        className="w-80"
        side="right"
        align="start"
        sideOffset={5}
      >
        <div>
          <div>
            <h3 className="font-medium">{selectedEvent.event.title}</h3>
            <p className="flex items-center text-xs text-gray-500">
              {moment(selectedEvent.event.start).format("dddd, MMMM D ")}
              <span>
                <Dot />
              </span>
              {moment(selectedEvent.event.start).format("h:mm")} -
              {selectedEvent.event.end
                ? moment(selectedEvent.event.end).format("h:mma")
                : ""}
            </p>
          </div>
          <div className="mt-2">
            {selectedEvent.event.extendedProps?.meetingUrl && (
              <a
                href={selectedEvent.event.extendedProps.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-gray-400 hover:underline"
              >
                {selectedEvent.event.extendedProps.meetingIconUrl ? (
                  <Image
                    src={selectedEvent.event.extendedProps.meetingIconUrl}
                    alt="Meeting platform icon"
                    width={16}
                    height={16}
                  />
                ) : (
                  <Link className="size-4" />
                )}
                {isGoogleMeet
                  ? "Join with Meet"
                  : isZoom
                    ? "Join with Zoom"
                    : "Join"}
              </a>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { EventDetails };
