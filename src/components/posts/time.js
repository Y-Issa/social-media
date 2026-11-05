import { format } from "date-fns";

function toDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

// Compact relative time for post and comment metadata:
// "now", "12m", "3h", "2d", then "Mar 4" (this year) or "Mar 4, 2024".
export function shortTime(value, now = Date.now()) {
  const date = toDate(value);
  if (!date) return "";
  const seconds = Math.max(0, Math.round((now - date.getTime()) / 1000));
  if (seconds < 60) return "now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const sameYear = date.getFullYear() === new Date(now).getFullYear();
  return format(date, sameYear ? "MMM d" : "MMM d, yyyy");
}

// Full date for tooltips: "Mar 4, 2026 at 3:12 PM".
export function fullTime(value) {
  const date = toDate(value);
  return date ? format(date, "MMM d, yyyy 'at' h:mm a") : "";
}

export function isoTime(value) {
  return toDate(value)?.toISOString();
}
