import React, { useState } from 'react';
import { LeftChevron, RightChevron } from "@/src/lib/icons/Navigation";

const formatDate = (date: Date) => {
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.toLocaleDateString("en-US", { year: "2-digit" });
  return `${weekday}, ${day} ${month} ${year}`;
};

interface DateCycleProps {
  onDateChange: (date: Date) => void;
}

export const DateCycle: React.FC<DateCycleProps> = ({ onDateChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToPreviousDay = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 1);
      onDateChange(newDate);
      return newDate;
    });
  };

  const goToNextDay = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 1);
      onDateChange(newDate);
      return newDate;
    });
  };

  const isToday = currentDate.toDateString() === new Date().toDateString();

  return (
    <div className="flex items-center justify-between">
      <div className="w-48">
        <h1 className="text-xl font-medium text-white">
          {isToday ? "Today" : formatDate(currentDate)}
        </h1>
        {isToday && <p className="text-sm">{formatDate(currentDate)}</p>}
      </div>
      <div className="flex items-center justify-between gap-4">
        <button onClick={goToPreviousDay} className="p-2">
          <LeftChevron />
        </button>
        <button onClick={goToNextDay} className="p-2">
          <RightChevron />
        </button>
      </div>
    </div>
  );
};
