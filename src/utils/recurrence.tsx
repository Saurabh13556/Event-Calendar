import { addDays, addMonths, isAfter, isBefore, format, getDay } from "date-fns";
import { CalendarEvent } from "../components/EventForm";

// Expand recurring events for the next 3 months
export function getRecurringEvents(events: CalendarEvent[]): CalendarEvent[] {
  const expanded: CalendarEvent[] = [];
  const now = new Date();
  const end = addMonths(now, 3);

  for (const ev of events) {
    if (!ev.recurrence || ev.recurrence === "none") {
      expanded.push(ev);
      continue;
    }
    let current = new Date(ev.date);
    let count = 0;
    while (isBefore(current, end) && count < 100) {
      if (isAfter(current, now) || format(current, "yyyy-MM-dd") === format(now, "yyyy-MM-dd")) {
        // Weekly recurrence: only on selected days
        if (ev.recurrence === "weekly" && ev.recurrenceDays && ev.recurrenceDays.length > 0) {
          if (ev.recurrenceDays.includes(getDay(current).toString())) {
            expanded.push({ ...ev, date: format(current, "yyyy-MM-dd") });
          }
        } else if (ev.recurrence === "custom") {
          expanded.push({ ...ev, date: format(current, "yyyy-MM-dd") });
        } else {
          expanded.push({ ...ev, date: format(current, "yyyy-MM-dd") });
        }
      }
      if (ev.recurrence === "daily") current = addDays(current, 1);
      else if (ev.recurrence === "weekly") current = addDays(current, 1);
      else if (ev.recurrence === "monthly") current = addMonths(current, 1);
      else if (ev.recurrence === "custom") current = addDays(current, ev.recurrenceInterval || 1);
      count++;
    }
  }
  return expanded;
}