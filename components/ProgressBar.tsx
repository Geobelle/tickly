import { View } from "react-native";

type ProgressBarProps = {
  completed: number;
  total: number;
};

export default function ProgressBar({ completed, total }: ProgressBarProps) {
  const progress = total > 0 ? Math.min(completed / total, 1) : 0;

  return (
    <View className="w-5/6  h-[8px] bg-[#EADBD7] rounded-full overflow-hidden">
      <View
        className="h-full bg-[#78977B]"
        style={{
          width: `${progress * 100}%`,
        }}
      />
    </View>
  );
}
