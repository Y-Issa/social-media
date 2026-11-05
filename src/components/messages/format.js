import { format, isSameDay, isToday, isYesterday } from "date-fns";

// Consecutive messages from one sender within this window share a group.
const GROUP_WINDOW_MS = 5 * 60 * 1000;

export function clockTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : format(date, "h:mm a");
}

// "Today", "Yesterday", "Mon, Nov 3", "Nov 3, 2025". Shown uppercase.
export function dayLabel(value, now = new Date()) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, date.getFullYear() === now.getFullYear() ? "EEE, MMM d" : "MMM d, yyyy");
}

// Annotates each message with { newDay, groupStart, groupEnd } for rendering.
export function layoutMessages(messages) {
  return messages.map((m, i) => {
    const prev = messages[i - 1];
    const next = messages[i + 1];
    const at = new Date(m.createdAt);
    const continues = (a, b) =>
      a &&
      b &&
      a.senderId === b.senderId &&
      isSameDay(new Date(a.createdAt), new Date(b.createdAt)) &&
      Math.abs(new Date(b.createdAt) - new Date(a.createdAt)) < GROUP_WINDOW_MS &&
      // A failed or sending bubble always closes its group so its status shows.
      !a.status;
    return {
      ...m,
      newDay: !prev || !isSameDay(new Date(prev.createdAt), at),
      groupStart: !continues(prev, m),
      groupEnd: !continues(m, next),
    };
  });
}
