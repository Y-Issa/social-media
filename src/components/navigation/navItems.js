import {
  LuBell,
  LuBookmark,
  LuCalendar,
  LuHome,
  LuMail,
  LuUser,
  LuUsers,
} from "react-icons/lu";

// `badge: "notifications"` items show the unread count.
export function getNavItems(user) {
  return [
    { key: "home", label: "Home", to: "/", icon: LuHome, end: true },
    { key: "notifications", label: "Notifications", to: "/notifications", icon: LuBell, badge: "notifications" },
    { key: "groups", label: "Groups", to: "/groups", icon: LuUsers },
    { key: "saved", label: "Saved", to: "/saved", icon: LuBookmark },
    { key: "profile", label: "Profile", to: `/profile/${user?.userId}`, icon: LuUser },
  ];
}

// Destinations that don't exist yet: shown muted with a SOON tag.
export const soonItems = [
  { label: "Messages", icon: LuMail },
  { label: "Events", icon: LuCalendar },
];
