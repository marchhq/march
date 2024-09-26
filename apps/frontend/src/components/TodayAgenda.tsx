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

export const TodayAgenda = (): JSX.Element => {
  /* const meetings = useMeetings();
   const today = new Date();
 
   const todayMeetings = meetings?.meetings.filter((meeting) =>
     isSameDay(new Date(meeting.start.dateTime), today)
   );
 
   const agendaItems = todayMeetings?.map((meeting) => ({
     title: meeting.summary,
     link: meeting.hangoutLink,
     time: `${new Date(meeting.start.dateTime).toLocaleTimeString()} - ${new Date(meeting.end.dateTime).toLocaleTimeString()}`,
   })) || []; */

  return (
    <ol>
      <React.Fragment>
        <li className="text-[#DCDCDD]/80 text-lg font-medium">march stand up</li>
        <p>5:00 - 5:30PM, 15 min</p>
        <a href="#" className="text-[#DCDCDD] mt-4 flex justify-start items-center gap-2">
          Join Meeting
          <span>
            <Link />
          </span>
        </a>
      </React.Fragment>
    </ol>
  );
};
