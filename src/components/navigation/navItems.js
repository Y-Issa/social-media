import {
  LuBell,
  LuBookmark,
  LuCalendar,
  LuHome,
  LuMail,
  LuUser,
  LuUsers,
} from "react-icons/lu";

export function getNavItems(user) {
  return [
    { label: "Home", to: "/", icon: LuHome, end: true },
    { label: "Groups", to: "/groups", icon: LuUsers },
    { label: "Saved", to: "/saved", icon: LuBookmark },
    { label: "Profile", to: `/profile/${user?.userId}`, icon: LuUser },
  ];
}

// Destinations that don't exist yet: shown muted with a SOON tag.
export const soonItems = [
  { label: "Messages", icon: LuMail },
  { label: "Notifications", icon: LuBell },
  { label: "Events", icon: LuCalendar },
];
