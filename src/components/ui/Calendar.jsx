import React, { useMemo, useState } from "react";
import { cn } from "./utils";

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function isSameDay(a, b) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
  );
}

function toDate(value) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function buildCalendarDays(monthDate, showOutsideDays) {
  const first = startOfMonth(monthDate);
  const last = endOfMonth(monthDate);
  const daysInMonth = last.getDate();
  const firstWeekday = first.getDay();

  const cells = [];

  if (showOutsideDays) {
    const prevMonthLast = endOfMonth(addMonths(monthDate, -1)).getDate();
    for (let i = firstWeekday - 1; i >= 0; i -= 1) {
      cells.push({
        date: new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, prevMonthLast - i),
        outside: true
      });
    }
  } else {
    for (let i = 0; i < firstWeekday; i += 1) {
      cells.push(null);
    }
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      date: new Date(monthDate.getFullYear(), monthDate.getMonth(), day),
      outside: false
    });
  }

  const remainder = cells.length % 7;
  if (remainder !== 0) {
    const needed = 7 - remainder;
    if (showOutsideDays) {
      for (let i = 1; i <= needed; i += 1) {
        cells.push({
          date: new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, i),
          outside: true
        });
      }
    } else {
      for (let i = 0; i < needed; i += 1) {
        cells.push(null);
      }
    }
  }

  return cells;
}

function isInRange(date, range) {
  if (!date || !range?.from || !range?.to) return false;
  const t = date.getTime();
  const from = toDate(range.from)?.getTime();
  const to = toDate(range.to)?.getTime();
  if (!from || !to) return false;
  return t >= Math.min(from, to) && t <= Math.max(from, to);
}

function dayIsSelected(date, selected, mode) {
  if (!date || !selected) return false;
  if (mode === "range") {
    return isInRange(date, selected);
  }
  return isSameDay(date, toDate(selected));
}

function monthLabel(date) {
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export function Calendar({
  className,
  classNames = {},
  showOutsideDays = true,
  selected,
  onSelect,
  defaultMonth,
  mode = "single"
}) {
  const [month, setMonth] = useState(startOfMonth(toDate(defaultMonth) || new Date()));
  const days = useMemo(() => buildCalendarDays(month, showOutsideDays), [month, showOutsideDays]);
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className={cn("ui-calendar", className)}>
      <div className={cn("ui-calendar-caption", classNames.caption)}>
        <button
          type="button"
          className={cn("ui-calendar-nav-btn", classNames.nav_button, classNames.nav_button_previous)}
          onClick={() => setMonth((prev) => addMonths(prev, -1))}
          aria-label="Previous month"
        >
          {"<"}
        </button>
        <div className={cn("ui-calendar-caption-label", classNames.caption_label)}>{monthLabel(month)}</div>
        <button
          type="button"
          className={cn("ui-calendar-nav-btn", classNames.nav_button, classNames.nav_button_next)}
          onClick={() => setMonth((prev) => addMonths(prev, 1))}
          aria-label="Next month"
        >
          {">"}
        </button>
      </div>

      <div className={cn("ui-calendar-weekdays", classNames.head_row)}>
        {weekDays.map((item) => (
          <div key={item} className={cn("ui-calendar-head-cell", classNames.head_cell)}>
            {item}
          </div>
        ))}
      </div>

      <div className={cn("ui-calendar-grid", classNames.table)}>
        {days.map((item, idx) => {
          if (!item) {
            return <div key={`empty-${idx}`} className="ui-calendar-cell ui-calendar-cell-empty" />;
          }

          const picked = dayIsSelected(item.date, selected, mode);
          const today = isSameDay(item.date, new Date());
          return (
            <div key={`${item.date.toISOString()}-${idx}`} className={cn("ui-calendar-cell", classNames.cell)}>
              <button
                type="button"
                className={cn(
                  "ui-calendar-day",
                  item.outside && "ui-calendar-day-outside",
                  today && "ui-calendar-day-today",
                  picked && "ui-calendar-day-selected",
                  classNames.day
                )}
                onClick={() => onSelect?.(item.date)}
              >
                {item.date.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
