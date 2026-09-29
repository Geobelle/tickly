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
    icon: icons.water,
    name: "Drink 8 glasses of water",
    numberOfTask: 8,
    numberOfCompletedTask: 8,

    status: "completed",
  },
  {
    id: "read-for-30minutes",
    icon: icons.book,
    name: "Read for 30 minutes",
    numberOfTask: 30,
    numberOfCompletedTask: 30,
    status: "completed",
  },
  {
    id: "workout",
    icon: icons.workout,
    name: "Workout",
    numberOfTask: 1,
    numberOfCompletedTask: 0,
    status: "uncompleted",
  },
  {
    id: "plan-tomorrow",
    icon: icons.smallCalender,
    name: "Plan tomorrow",
    numberOfTask: 1,
    numberOfCompletedTask: 0,
    status: "uncompleted",
  },
  {
    id: "journal",
    icon: icons.pen,
    name: "Journal",
    numberOfTask: 1,
    numberOfCompletedTask: 0,
    status: "uncompleted",
  },
];
