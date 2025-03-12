import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import moment from "moment";
import { EventClickArg } from "@fullcalendar/core";
import { useLockScroll } from "@/hooks/use-lock-scroll";

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

  console.log("selected event: ", selectedEvent);

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
        <div className="space-y-2">
          <h3 className="font-medium">{selectedEvent.event.title}</h3>
          <p className="text-sm text-gray-500">
            {moment(selectedEvent.event.start).format("LT")} -
            {selectedEvent.event.end
              ? moment(selectedEvent.event.end).format("LT")
              : "No end time"}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export { EventDetails };
