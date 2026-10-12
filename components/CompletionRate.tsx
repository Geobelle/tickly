import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

type CompletionRateProps = {
  percentage: number;
  completed: number;
  total: number;
  period?: string;
};

const CompletionRate = ({
  percentage,
  completed,
  total,
  period = "This week",
}: CompletionRateProps) => {
  const size = 80;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = Math.min(100, Math.max(0, percentage));

  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View className="bg-card border border-[#EADBD7] rounded-3xl p-5 w-full">
      <Text className="text-foreground font-sans-bold text-xl mb-5">
        Completion rate
      </Text>

      <View className="flex-row items-center gap-6">
        {/* Circular progress */}
        <View
          style={{
            width: size,
            height: size,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Svg width={size} height={size}>
            {/* Background track */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#DCE9DC"
              strokeWidth={strokeWidth}
              fill="none"
            />

            {/* Progress arc */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#78977B"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              rotation={-90}
              origin={`${size / 2}, ${size / 2}`}
            />
          </Svg>

          {/* Percentage in the center */}
          <View className="absolute items-center justify-center">
            <Text className="text-foreground font-sans-bold text-3xl">
              {progress}%
            </Text>
          </View>
        </View>

        {/* Completion details */}
        <View className="flex-1 gap-2">
          <Text className="text-foreground font-sans-bold text-xl">
            {period}
          </Text>

          <Text className="text-muted-foreground text-lg">
            {completed}/{total} tasks
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CompletionRate;
