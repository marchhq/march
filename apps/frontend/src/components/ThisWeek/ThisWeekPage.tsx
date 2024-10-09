"use client";

import React, { useState } from "react";
import { ThisWeekArrows } from "./ThisWeekArrows";
import { ThisWeekSection } from "./ThisWeekSection";
import { addWeeks, startOfMonth } from "date-fns";
import { getCurrentWeek, getWeeksInMonth } from "@/src/utils/datetime";

export const ThisWeekPage: React.FC = () => {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(today);

  const weekNumber = getCurrentWeek(currentDate);
  const totalWeeks = getWeeksInMonth(currentDate);

  const handleWeekChange = (direction: "left" | "right") => {
    setCurrentDate((prevDate) => {
      const newDate = addWeeks(prevDate, direction === "left" ? -1 : 1);
      const newWeekNumber = getCurrentWeek(newDate);

      if (newWeekNumber < 1 || newWeekNumber > totalWeeks) {
        return prevDate;
      }

      return newDate;
    });
  };

  return (
    <div className="w-9/12 flex flex-col gap-8">
      <div className="flex items-center gap-8 text-sm">
        <h1 className="text-foreground text-2xl">Week {weekNumber}</h1>
        <div className="flex gap-4">
          <p>0/6 completed</p>
          <p>0%</p>
          <p>aug 19th - aug 26th</p>
        </div>
        <ThisWeekArrows onChangeWeek={handleWeekChange} />
      </div>
      <div className="flex w-full max-w-screen-xl gap-8">
        <ThisWeekSection icon="material-symbols:circle-outline" title="to do" />
        <ThisWeekSection icon="carbon:circle-dash" title="in progress" />
        <ThisWeekSection icon="material-symbols:circle" title="done" />
      </div>
    </div>
  );
};
