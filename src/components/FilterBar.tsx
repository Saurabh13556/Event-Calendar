import React from "react";
import { CalendarEvent } from "./EventForm";
import { Filter } from "../App";

interface FilterBarProps {
  events: CalendarEvent[];
  filter: Filter;
  setFilter: (filter: Filter) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ events, filter, setFilter }) => {
  const categories = Array.from(new Set(events.map(ev => ev.category).filter(Boolean)));

  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search events..."
        value={filter.search}
        onChange={e => setFilter({ ...filter, search: e.target.value })}
      />
      <select
        value={filter.category}
        onChange={e => setFilter({ ...filter, category: e.target.value })}
      >
        <option value="">All Categories</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;
export {};