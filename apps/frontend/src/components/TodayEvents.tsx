import React from "react";

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const calculateDuration = (start: Date, end: Date): number => {
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
};

interface TodayEventsProps {
  selectedDate: Date;
}

export const TodayEvents: React.FC<TodayEventsProps> = ({
  selectedDate
}): JSX.Element => {



  return <li>todo</li>
}
