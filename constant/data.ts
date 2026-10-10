import { TICKLY_ICONS } from "./emojis";
import { icons } from "./icons";

export const tabsDetails = [
  {
    name: "index",
    title: "Home",
    icon: {
      focused: icons.homeFilled,
      unfocused: icons.homeOutline,
    },
  },
  {
    name: "calender",
    title: "Calender",
    icon: {
      focused: icons.calenderFilled,
      unfocused: icons.calenderoutline,
    },
  },
  {
    name: "stats",
    title: "Stats",
    icon: {
      focused: icons.statsFilled,
      unfocused: icons.statsOutline,
    },
  },
  {
    name: "profile",
    title: "Profile",
    icon: {
      focused: icons.profileFilled,
      unfocused: icons.profileOutline,
    },
  },
];
export const HOME_USER = {
  name: "Gina",
};
export const INSPIRATION = {
  text: "Today is a new chance to be a little better than yesterday",
};

export const HOME_TASK: Task[] = [
  {
    id: "drink-water",
    icon: TICKLY_ICONS.find((item) => item.id === "water")!.icon,
    name: "Drink 8 glasses of water",
    numberOfTask: 8,
    numberOfCompletedTask: 8,

    status: "completed",
  },
  {
    id: "read-for-30minutes",
    icon: TICKLY_ICONS.find((item) => item.id === "reading")!.icon,
    name: "Read for 30 minutes",
    numberOfTask: 30,
    numberOfCompletedTask: 30,
    status: "completed",
  },
  {
    id: "workout",
    icon: TICKLY_ICONS.find((item) => item.id === "exercise")!.icon,
    name: "Workout",
    numberOfTask: 1,
    numberOfCompletedTask: 0,
    status: "uncompleted",
  },
  {
    id: "plan-tomorrow",
    icon: TICKLY_ICONS.find((item) => item.id === "calender")!.icon,
    name: "Plan tomorrow",
    numberOfTask: 1,
    numberOfCompletedTask: 0,
    status: "uncompleted",
  },
  {
    id: "journal",
    icon: TICKLY_ICONS.find((item) => item.id === "journal")!.icon,
    name: "Journal",
    numberOfTask: 1,
    numberOfCompletedTask: 0,
    status: "uncompleted",
  },
];

/**
 * Small, date-specific mock history for the calendar. Dates are based on the
 * device's local calendar so the examples remain recent as time passes.
 * Tasks missing from a date's list are treated as not completed that day.
 */
export function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function localDateOffset(days: number): string {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return getLocalDateKey(date);
}

export const TASK_HISTORY: Record<string, string[]> = {
  [localDateOffset(-1)]: ["drink-water", "read-for-30minutes", "journal"],
  [localDateOffset(-2)]: ["drink-water", "workout"],
};
