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
  const [popoverSide, setPopoverSide] = useState<"left" | "right">("right");

  // Lock scroll when popover is open
  useLockScroll(isPopoverOpen);

  useEffect(() => {
    setIsPopoverOpen(true);
  }, [selectedEvent]);

  useEffect(() => {
    // Determine which side to show the popover based on position
    const viewportWidth = window.innerWidth;
    const spaceOnRight = viewportWidth - position.x;
    const popoverWidth = 320; // w-80 = 20rem = 320px

    setPopoverSide(spaceOnRight < popoverWidth + 20 ? "left" : "right");
  }, [position.x]);

  const handleOpenChange = (open: boolean) => {
    setIsPopoverOpen(open);
    if (!open) {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
      }}
      className="h-0 w-0"
    >
      <Popover open={isPopoverOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <div className="h-0 w-0" />
        </PopoverTrigger>
        <PopoverContent
          className="w-80"
          side={popoverSide}
          align="start"
          sideOffset={2}
          alignOffset={popoverSide === "left" ? 8 : -8}
          avoidCollisions
          collisionPadding={16}
          sticky="always"
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
                  {selectedEvent.event.extendedProps.meetingUrl?.includes(
                    "meet"
                  )
                    ? "Join with Meet"
                    : selectedEvent.event.extendedProps.meetingUrl?.includes(
                          "zoom"
                        )
                      ? "Join with Zoom"
                      : "Join"}
                </a>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { EventDetails };
