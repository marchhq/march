import { useCalendar } from "@/contexts/calendar-context";
import moment from "moment";

export default function CalendarHeader() {
  const { handlePrevious, handleNext, handleToday, currentDate } =
    useCalendar();

  const formattedDate = moment(currentDate).format("DD, MMMM YY");

  return (
    <div className="calendar-header">
      <div className="header-left">
        <span className="calendar-title">Calendar</span>
        <span className="calendar-date">{formattedDate}</span>
        <div className="nav-buttons">
          <button
            className="nav-button"
            aria-label="Previous"
            onClick={handlePrevious}
          >
            ←
          </button>
          <button className="nav-button" aria-label="Next" onClick={handleNext}>
            →
          </button>
          <button
            className="nav-button"
            aria-label="Return to Present"
            onClick={handleToday}
          >
            ↩
          </button>
        </div>
      </div>
    </div>
  );
}
