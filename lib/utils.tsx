import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

type ProgressCircleProps = {
  completed: number;
  total: number;
};

export default function ProgressCircle({
  completed,
  total,
}: ProgressCircleProps) {
  const size = 120;
  const strokeWidth = 10.7;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = completed / total;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View className="items-center justify-center">
      <Svg
        width={size}
        height={size}
        style={{
          transform: [{ rotate: "-90deg" }],
        }}
      >
        {/* Background */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#DCE9DC"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#78977B"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>

      {/* Text */}
      <View className="absolute items-center">
        <Text className="text-xl font-bold text-success">
          {completed}/{total}
        </Text>

        <Text className="text-sm text-foreground">tasks done</Text>
      </View>
    </View>
  );
}
