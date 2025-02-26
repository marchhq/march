"use client";

import { useState, useEffect } from "react";
import { useCalendar } from "@/contexts/calendar-context";
import CalendarHeader from "./calendar-header";
import { useDroppable } from "@dnd-kit/core";
import { format, differenceInMinutes } from "date-fns";
import { cn } from "@/lib/utils";

export function CalendarBlock() {
  const { events } = useCalendar();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const { setNodeRef, isOver } = useDroppable({
    id: "calendar-drop-area",
    data: { type: "calendar" },
  });

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Create dummy events if no events exist
  const dummyEvents = [
    {
      id: "1",
      title: "lunch and walk",
      start: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 13, 0).toISOString(),
      end: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 14, 0).toISOString(),
      backgroundColor: "#f0f9ff",
      textColor: "#000",
      borderColor: "#3b82f6",
    },
    {
      id: "2",
      title: "Buffer_walk",
      start: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 16, 30).toISOString(),
      end: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 17, 0).toISOString(),
      backgroundColor: "#f0f9ff",
      textColor: "#000",
      borderColor: "#3b82f6",
    },
    {
      id: "3",
      title: "tea",
      start: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 17, 0).toISOString(),
      end: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 17, 30).toISOString(),
      backgroundColor: "#f0f9ff",
      textColor: "#000",
      borderColor: "#3b82f6",
    },
    {
      id: "4",
      title: "dinner & walk",
      start: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 21, 30).toISOString(),
      end: new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 22, 15).toISOString(),
      backgroundColor: "#f0f9ff",
      textColor: "#000",
      borderColor: "#3b82f6",
    }
  ];

  // Use dummy events for now
  const displayEvents = dummyEvents;
  
  // Calculate time remaining until next event
  const getTimeUntilNextEvent = (currentTime, events) => {
    const sortedEvents = [...events].sort((a, b) => 
      new Date(a.start).getTime() - new Date(b.start).getTime()
    );
    
    const nextEvent = sortedEvents.find(event => 
      new Date(event.start).getTime() > currentTime.getTime()
    );
    
    if (!nextEvent) return null;
    
    const startTime = new Date(nextEvent.start);
    const diffMinutes = differenceInMinutes(startTime, currentTime);
    
    if (diffMinutes < 60) {
      return `${diffMinutes} minutes left`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes > 0 ? ` ${minutes} minutes` : ''} left`;
    }
  };
  
  // Calculate time between events
  const getTimeBetweenEvents = (event1, event2) => {
    const end1 = new Date(event1.end);
    const start2 = new Date(event2.start);
    const diffMinutes = differenceInMinutes(start2, end1);
    
    if (diffMinutes < 60) {
      return `${diffMinutes} minutes`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes > 0 ? ` ${minutes} minutes` : ''}`;
    }
  };
  
  // Get event duration in a readable format
  const getEventDuration = (event) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const diffMinutes = differenceInMinutes(end, start);
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h${minutes > 0 ? `${minutes}m` : ''}`;
    }
  };

  // Sort events by start time
  const sortedEvents = [...displayEvents].sort((a, b) => 
    new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  return (
    <div
      ref={setNodeRef}
      className={`calendar-container h-full overflow-auto ${isOver ? "bg-gray-100" : ""} pt-4`}
    >
      <CalendarHeader />
      
      <div className="timeline-view px-6">
        {/* Events timeline */}
        <div className="events-timeline">
          {sortedEvents.map((event, index) => {
            const prevEvent = index > 0 ? sortedEvents[index - 1] : null;
            const nextEvent = index < sortedEvents.length - 1 ? sortedEvents[index + 1] : null;
            
            return (
              <div key={event.id} className="event-container">
                {/* Time between events */}
                {prevEvent && (
                  <div className="time-between py-3 text-center text-xs text-gray-400">
                    {getTimeBetweenEvents(prevEvent, event)}
                  </div>
                )}
                
                {/* Time label and event card */}
                <div className="flex items-start mb-2">
                  <div className="time-label w-12 text-gray-400 text-sm">
                    {format(new Date(event.start), 'HH:mm')}
                  </div>
                  
                  {/* Event card */}
                  <div className="flex-1 ml-4">
                    <div className="flex items-center w-full py-2 rounded-md hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3 w-full">
                        <div className="event-indicator w-1 h-5 rounded-full" style={{ backgroundColor: "#3b82f6" }}></div>
                        <div className="flex-1">
                          <div className={cn("text-sm", "text-gray-700")}>
                            {event.title}
                          </div>
                          <div className="mt-1 text-xs text-gray-400">
                            {getEventDuration(event)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Time between events */}
                {!nextEvent && (
                  <div className="time-after py-3 text-center text-xs text-gray-400">
                    4 hours
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
