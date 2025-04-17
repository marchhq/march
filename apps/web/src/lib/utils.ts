import { CalendarEvent, Event } from "@/types/calendar";
import { Objects, OrderObject } from "@/types/objects";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractMessageData = (response: any) => {
  if (response?.data?.data) {
    return response.data.data;
  }
  return null;
};

interface ColorScheme {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
}

export const EVENT_COLORS: { [key: string]: ColorScheme } = {
  "1": {
    backgroundColor: "#F4C7C3",
    textColor: "#B91B1B",
    borderColor: "#E35D5B"
  },
  "2": {
    backgroundColor: "#FCE8B2",
    textColor: "#92400E",
    borderColor: "#F0B429"
  },
  "3": {
    backgroundColor: "#B3E1F7",
    textColor: "#075985",
    borderColor: "#0EA5E9"
  },
  "4": {
    backgroundColor: "#C2E0C6",
    textColor: "#166534",
    borderColor: "#22C55E"
  },
  "5": {
    backgroundColor: "#E4C6ED",
    textColor: "#7E22CE",
    borderColor: "#A855F7"
  },
  "6": {
    backgroundColor: "#FFD6C3",
    textColor: "#C2410C",
    borderColor: "#FB923C"
  },
  "7": {
    backgroundColor: "#C6D8FF",
    textColor: "#1E40AF",
    borderColor: "#3B82F6"
  },
  "8": {
    backgroundColor: "#E3E3E3",
    textColor: "#44403C",
    borderColor: "#78716C"
  },
  "9": {
    backgroundColor: "#F4BFDB",
    textColor: "#BE185D",
    borderColor: "#EC4899"
  },
  "10": {
    backgroundColor: "#CCD0F1",
    textColor: "#3730A3",
    borderColor: "#6366F1"
  },
  "11": {
    backgroundColor: "#BEE3E3",
    textColor: "#0F766E",
    borderColor: "#14B8A6"
  },
  // Default color if no colorId is provided
  "default": {
    backgroundColor: "#E3F2FD",
    textColor: "#0D47A1",
    borderColor: "#2196F3"
  }
};

export function transformGoogleEventToCalendarEvent(event: Event): CalendarEvent {
  const colorId = event.colorId?.toString() || "default";
  const colorScheme = EVENT_COLORS[colorId];
  
  return {
    id: event.id,
    title: event.summary,
    start: event.start.dateTime,
    end: event.end.dateTime,
    backgroundColor: colorScheme.backgroundColor,
    textColor: colorScheme.textColor,
    borderColor: colorScheme.borderColor,
    allDay: !event.start.dateTime,
    meetingUrl: event.hangoutLink || event.conferenceData?.entryPoints?.[0]?.uri || event.htmlLink,
    meetingIconUrl: event.conferenceData?.conferenceSolution?.iconUri,
    extendedProps: {
      colorId: colorId,
      meetingUrl: event.hangoutLink || event.conferenceData?.entryPoints?.[0]?.uri || event.htmlLink,
      meetingIconUrl: event.conferenceData?.conferenceSolution?.iconUri,
    }
  }
}

export function updateOrderInArray(items: Objects[], newOrder: OrderObject): Objects[] {
  const updatedItems = [...items];
  newOrder.orderedItems.forEach(({ id, order }) => {
    const itemIndex = updatedItems.findIndex(item => item._id === id);
    if (itemIndex !== -1) {
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        order
      };
    }
  });
  return updatedItems;
}