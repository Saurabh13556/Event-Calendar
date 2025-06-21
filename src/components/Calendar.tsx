import React, { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import CalendarHeader from "./CalendarHeader";
import DayCell from "./DayCell";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { CalendarEvent } from "./EventForm";

interface CalendarProps {
  events: CalendarEvent[];
  onDayClick: (date: string) => void;
  onEventClick: (event: CalendarEvent) => void;
  onReschedule: (eventId: number, newDate: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  onDayClick,
  onEventClick,
  onReschedule,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, "yyyy-MM-dd");
      days.push({
        date: day,
        formatted: formattedDate,
        isCurrentMonth: isSameMonth(day, monthStart),
        isToday: isSameDay(day, new Date()),
        events: events.filter(
          (ev) => format(new Date(ev.date), "yyyy-MM-dd") === formattedDate
        ),
      });
      day = addDays(day, 1);
    }
    rows.push(days);
    days = [];
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const eventId = parseInt(result.draggableId, 10);
    const destDate = result.destination.droppableId;
    onReschedule(eventId, destDate);
  };

  return (
    <div>
      <CalendarHeader
        currentMonth={currentMonth}
        onPrev={() => setCurrentMonth(subMonths(currentMonth, 1))}
        onNext={() => setCurrentMonth(addMonths(currentMonth, 1))}
      />
      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="calendar-header-cell">
            {d}
          </div>
        ))}
        <DragDropContext onDragEnd={onDragEnd}>
          {rows.flat().map((cell, idx) => (
            <Droppable droppableId={cell.formatted} key={cell.formatted}>
              {(provided) => (
                <div
                  className={`calendar-cell${cell.isToday ? " today" : ""}${
                    cell.isCurrentMonth ? "" : " not-current-month"
                  }`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  onClick={() => onDayClick(cell.formatted)}
                >
                  <DayCell
                    day={cell.date}
                    events={cell.events}
                    onEventClick={onEventClick}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
};

export default Calendar;
export {};