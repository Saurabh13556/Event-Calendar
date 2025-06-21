import React from "react";
import { format } from "date-fns";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrev: () => void;
  onNext: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentMonth, onPrev, onNext }) => (
  <div className="calendar-header">
    <button onClick={onPrev}>&lt;</button>
    <span>{format(currentMonth, "MMMM yyyy")}</span>
    <button onClick={onNext}>&gt;</button>
  </div>
);

export default CalendarHeader;