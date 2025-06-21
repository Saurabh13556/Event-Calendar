import React from "react";
import { format } from "date-fns";
import { Draggable } from "@hello-pangea/dnd";
import { CalendarEvent } from "./EventForm";

interface DayCellProps {
  day: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const DayCell: React.FC<DayCellProps> = ({ day, events, onEventClick }) => (
  <div className="day-cell-content">
    <div className="day-number">{format(day, "d")}</div>
    <div className="events-list">
      {events.map((ev, idx) => (
        <Draggable draggableId={ev.id.toString()} index={idx} key={ev.id}>
          {(provided) => (
            <div
              className="event"
              style={{ background: ev.color || "#1976d2" }}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              onClick={e => {
                e.stopPropagation();
                onEventClick(ev);
              }}
            >
              {ev.title}
            </div>
          )}
        </Draggable>
      ))}
    </div>
  </div>
);

export default DayCell;
export {};