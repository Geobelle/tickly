import type { ImageSourcePropType } from "react-native";

declare global {
  interface TabIconProps {
    focused: boolean;
    icon: ImageSourcePropType;
  }

  interface Task {
    id: string;
    icon: ImageSourcePropType;
    name: string;
    status: "completed" | "in-progress" | "uncompleted";
    repeat: string;
  }
}

export {};
