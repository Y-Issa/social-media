import { format, isSameDay } from "date-fns";

function toDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

// "SAT, NOV 8" — section header for a day of events.
export function dayHeader(value) {
  const date = toDate(value);
  return date ? format(date, "EEE, MMM d").toUpperCase() : "";
}

// Local calendar day, used to group events: "2026-11-08".
export function dayKey(value) {
  const date = toDate(value);
  return date ? format(date, "yyyy-MM-dd") : "";
}

// Date block parts: { day: "8", month: "NOV" }.
export function dateBlock(value) {
  const date = toDate(value);
  return date ? { day: format(date, "d"), month: format(date, "MMM").toUpperCase() } : { day: "", month: "" };
}

function clock(date) {
  return format(date, date.getMinutes() ? "h:mm a" : "h a");
}

// "4 PM – 6 PM", "7:30 PM", or "Nov 8, 4 PM – Nov 9, 1 AM" across days.
export function timeRange(startsAt, endsAt) {
  const start = toDate(startsAt);
  if (!start) return "";
  const end = endsAt ? toDate(endsAt) : null;
  if (!end) return clock(start);
  if (isSameDay(start, end)) return `${clock(start)} – ${clock(end)}`;
  return `${format(start, "MMM d")}, ${clock(start)} – ${format(end, "MMM d")}, ${clock(end)}`;
}

// "Saturday, November 8, 2026" for the detail page.
export function longDate(value) {
  const date = toDate(value);
  return date ? format(date, "EEEE, MMMM d, yyyy") : "";
}

// <input type="datetime-local"> value for a date ("2026-11-08T16:00").
export function toLocalInput(value) {
  const date = toDate(value);
  return date ? format(date, "yyyy-MM-dd'T'HH:mm") : "";
}

// datetime-local value -> ISO string (interpreted in the viewer's timezone).
export function fromLocalInput(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function rsvpSummary(event) {
  return `${event.goingCount} going · ${event.interestedCount} interested`;
}

// Groups a sorted list of events into [{ key, label, events }] by local day.
export function groupByDay(events) {
  const days = [];
  for (const event of events) {
    const key = dayKey(event.startsAt);
    const last = days[days.length - 1];
    if (last?.key === key) last.events.push(event);
    else days.push({ key, label: dayHeader(event.startsAt), events: [event] });
  }
  return days;
}
