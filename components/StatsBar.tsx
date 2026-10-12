import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const StatsBar = () => {
  const [selectTime, setSelectTime] = useState("Weekly");

  const options = ["Weekly", "Monthly", "All Time"];

  return (
    <View className="w-full">
      <View className="flex-row bg-[#F7D9CE] w-full rounded-4xl h-10 items-center justify-between ">
        {options.map((option) => {
          const isSelected = selectTime === option;

          return (
            <Pressable
              key={option}
              onPress={() => setSelectTime(option)}
              className={`rounded-3xl items-center justify-center w-1/3 h-full ${
                isSelected ? "bg-foreground" : "bg-transparent"
              }`}
            >
              <Text
                className={`font-sans-bold ${
                  isSelected ? "text-cream" : "text-black"
                }`}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default StatsBar;
