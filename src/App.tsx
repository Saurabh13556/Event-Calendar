import React, { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import EventForm, { CalendarEvent } from "./components/EventForm";
import FilterBar from "./components/FilterBar";
import { getRecurringEvents } from "./utils/recurrence";

export interface Filter {
  search: string;
  category: string;
}

const LOCAL_STORAGE_KEY = "event-calendar-events";

const App: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [filter, setFilter] = useState<Filter>({ search: "", category: "" });

  // Demo seed for first load
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) {
      setEvents([
        {
          id: 1,
          title: "Team Meeting",
          date: "2025-06-25",
          time: "10:00",
          description: "Weekly sync-up",
          recurrence: "weekly",
          recurrenceDays: ["3"], // Wednesday
          color: "#43cea2",
          category: "Work"
        },
        {
          id: 2,
          title: "Yoga Class",
          date: "2025-06-26",
          time: "07:00",
          description: "Morning yoga",
          recurrence: "daily",
          color: "#f7971e",
          category: "Health"
        },
        {
          id: 3,
          title: "Project Deadline",
          date: "2025-06-30",
          time: "23:59",
          description: "Submit final report",
          recurrence: "none",
          color: "#e53935",
          category: "Work"
        }
      ]);
    } else {
      setEvents(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const handleAddEvent = (event: CalendarEvent) => {
    setEvents([...events, { ...event, id: Date.now() }]);
    setSelectedDate(null);
  };

  const handleEditEvent = (updatedEvent: CalendarEvent) => {
    setEvents(events.map(ev => (ev.id === updatedEvent.id ? updatedEvent : ev)));
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(ev => ev.id !== id));
    setEditingEvent(null);
  };

  const handleReschedule = (eventId: number, newDate: string) => {
    setEvents(events.map(ev =>
      ev.id === eventId ? { ...ev, date: newDate } : ev
    ));
  };

  // Expand recurring events for display
  const allEvents = getRecurringEvents(events);

  // Filtering
  const filteredEvents = allEvents.filter((ev: CalendarEvent) => {
    const matchesSearch =
      filter.search === "" ||
      ev.title.toLowerCase().includes(filter.search.toLowerCase()) ||
      (ev.description && ev.description.toLowerCase().includes(filter.search.toLowerCase()));
    const matchesCategory =
      filter.category === "" || (ev.category && ev.category === filter.category);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container">
      <h1>Event Calendar</h1>
      <FilterBar events={allEvents} filter={filter} setFilter={setFilter} />
      <Calendar
        events={filteredEvents}
        onDayClick={setSelectedDate}
        onEventClick={setEditingEvent}
        onReschedule={handleReschedule}
      />
      {(selectedDate || editingEvent) && (
        <EventForm
          date={selectedDate}
          event={editingEvent}
          onSave={editingEvent ? handleEditEvent : handleAddEvent}
          onDelete={editingEvent ? handleDeleteEvent : undefined}
          onClose={() => {
            setSelectedDate(null);
            setEditingEvent(null);
          }}
          events={events}
        />
      )}
    </div>
  );
};

export default App;
export {};