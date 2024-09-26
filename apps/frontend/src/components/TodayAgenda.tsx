import React from "react";
import { useMeetings } from "../hooks/useMeetings";
import { Link } from "../lib/icons/Link";

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

export const TodayAgenda = (): JSX.Element => {
  const meetings = useMeetings();
  const today = new Date();

  const todayMeetings = meetings?.meetings.filter((meeting) =>
    isSameDay(new Date(meeting.start.dateTime), today)
  );

  const agendaItems = todayMeetings?.map((meeting) => {
    const startTime = new Date(meeting.start.dateTime);
    const endTime = new Date(meeting.end.dateTime);
    return {
      title: meeting.summary,
      link: meeting.hangoutLink,
      time: `${formatTime(startTime)} - ${formatTime(endTime)}`,
      duration: calculateDuration(startTime, endTime),
    };
  }) || [];

  return (
    <ol>
      {agendaItems.length === 0 ? (
        <li className="text-[#DCDCDD]/80 text-lg font-medium">No meetings scheduled for today</li>
      ) : (
        agendaItems.map((item, index) => (
          <React.Fragment key={index}>
            <li className="text-[#DCDCDD]/80 text-lg font-medium">{item.title}</li>
            <p>{item.time}, {item.duration} min</p>
            <a href={item.link} className="text-[#DCDCDD] mt-4 flex justify-start items-center gap-2">
              Join Meeting
              <span>
                <Link />
              </span>
            </a>
          </React.Fragment>
        ))
      )}
    </ol>
  );
};
