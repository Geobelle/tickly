import addIcon from "@/assets/icons/Add.png";
import homeFilled from "@/assets/icons/HomeFilled.png";
import homeOutline from "@/assets/icons/HomeOutline.png";
import settingIcon from "@/assets/icons/Settings.png";
import back from "@/assets/icons/back.png";
import book from "@/assets/icons/book.png";
import calenderFilled from "@/assets/icons/calenderFilled.png";
import calenderoutline from "@/assets/icons/calenderOutline.png";
import pen from "@/assets/icons/pen.png";
import profileFilled from "@/assets/icons/profileFilled.png";
import profileOutline from "@/assets/icons/profileOutline.png";
import smallCalender from "@/assets/icons/smallCalender.png";
import statsFilled from "@/assets/icons/statsFilled.png";
import statsOutline from "@/assets/icons/statsOutline.png";
import water from "@/assets/icons/water.png";
import workout from "@/assets/icons/workout.png";

export const icons = {
  homeFilled,
  calenderoutline,
  statsOutline,
  profileOutline,
  homeOutline,
  calenderFilled,
  statsFilled,
  profileFilled,
  settingIcon,
  addIcon,
  book,
  pen,
  water,
  workout,
  smallCalender,
  back,
} as const;

export type IconKey = keyof typeof icons;
