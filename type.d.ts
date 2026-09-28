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
    numberOfTask: number;
    numberOfCompletedTask: number;
    color?: string;
    status: string;
  }
}

export {};
