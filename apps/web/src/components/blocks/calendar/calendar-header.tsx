export default function CalendarHeader() {
  return (
    <div className="calendar-header">
      <div className="header-left">
        <span className="calendar-title">Calendar</span>
        <span className="calendar-date">20, february 25</span>
        <div className="nav-buttons">
          <button className="nav-button" aria-label="Previous">
            ←
          </button>
          <button className="nav-button" aria-label="Next">
            →
          </button>
          <button className="nav-button" aria-label="Return to Present">
            ↩
          </button>
        </div>
      </div>
    </div>
  );
}
