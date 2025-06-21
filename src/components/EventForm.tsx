import React, { useState, useEffect } from "react";

export interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time?: string;
  description?: string;
  recurrence?: string;
  recurrenceInterval?: number;
  recurrenceDays?: string[];
  color?: string;
  category?: string;
}

interface EventFormProps {
  date: string | null;
  event: CalendarEvent | null;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (id: number) => void;
  onClose: () => void;
  events: CalendarEvent[];
}

const recurrenceOptions = [
  { value: "none", label: "None" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "custom", label: "Custom" }
];

const defaultColor = "#1976d2";

const EventForm: React.FC<EventFormProps> = ({
  date,
  event,
  onSave,
  onDelete,
  onClose,
  events
}) => {
  const [form, setForm] = useState<Partial<CalendarEvent>>({
    title: "",
    date: date || (event ? event.date : ""),
    time: event ? event.time : "",
    description: event ? event.description : "",
    recurrence: event ? event.recurrence : "none",
    recurrenceInterval: event ? event.recurrenceInterval : 1,
    recurrenceDays: event ? event.recurrenceDays || [] : [],
    color: event ? event.color : defaultColor,
    category: event ? event.category || "" : ""
  });

  useEffect(() => {
    if (event) {
      setForm(f => ({
        ...f,
        ...event
      }));
    }
  }, [event]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (name === "recurrenceDays" && type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm({
        ...form,
        recurrenceDays: checked
          ? [...(form.recurrenceDays || []), value]
          : (form.recurrenceDays || []).filter(d => d !== value)
      });
    } else {
      setForm({
        ...form,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date) return;
    // Conflict check
    const hasConflict = events.some(ev =>
      ev.id !== (event ? event.id : undefined) &&
      ev.date === form.date &&
      ev.time === form.time
    );
    if (hasConflict) {
      alert("Event conflict: Another event exists at this date and time.");
      return;
    }
    onSave({ ...form, id: event ? event.id : Date.now() } as CalendarEvent);
  };

  return (
    <div className="modal">
      <form className="event-form" onSubmit={handleSubmit}>
        <h2>{event ? "Edit Event" : "Add Event"}</h2>
        <label>
          Title
          <input name="title" value={form.title || ""} onChange={handleChange} required />
        </label>
        <label>
          Date
          <input type="date" name="date" value={form.date || ""} onChange={handleChange} required />
        </label>
        <label>
          Time
          <input type="time" name="time" value={form.time || ""} onChange={handleChange} />
        </label>
        <label>
          Description
          <textarea name="description" value={form.description || ""} onChange={handleChange} />
        </label>
        <label>
          Category
          <input name="category" value={form.category || ""} onChange={handleChange} />
        </label>
        <label>
          Color
          <input type="color" name="color" value={form.color || defaultColor} onChange={handleChange} />
        </label>
        <label>
          Recurrence
          <select name="recurrence" value={form.recurrence || "none"} onChange={handleChange}>
            {recurrenceOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </label>
        {form.recurrence === "weekly" && (
          <div>
            <span>Repeat on:</span>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, idx) => (
              <label key={d}>
                <input
                  type="checkbox"
                  name="recurrenceDays"
                  value={idx.toString()}
                  checked={form.recurrenceDays?.includes(idx.toString())}
                  onChange={handleChange}
                />
                {d}
              </label>
            ))}
          </div>
        )}
        {form.recurrence === "custom" && (
          <label>
            Every
            <input
              type="number"
              name="recurrenceInterval"
              min="1"
              value={form.recurrenceInterval || 1}
              onChange={handleChange}
              style={{ width: 60 }}
            />
            days
          </label>
        )}
        <div className="form-actions">
          <button type="submit">{event ? "Save" : "Add"}</button>
          {onDelete && event && (
            <button type="button" onClick={() => onDelete(event.id)} className="delete-btn">
              Delete
            </button>
          )}
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
export {};