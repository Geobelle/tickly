import { useAuth } from "@clerk/expo";
import { router, useLocalSearchParams } from "expo-router";
import { styled } from "nativewind";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import { TICKLY_ICONS } from "../../../../constant/emojis";
import { icons } from "../../../../constant/icons";
import type { Habit } from "../../../../services/habits";
import { getHabitCompletions, getHabits } from "../../../../services/habits";

const SafeAreaView = styled(RNSafeAreaView);

const TaskDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [task, setTask] = useState<Habit | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !id) return;

    let cancelled = false;

    const loadTask = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const habits = await getHabits(token);
        const selectedHabit = habits.find((habit) => habit.id === id);

        if (!selectedHabit) return;

        const now = new Date();
        const today = [
          now.getFullYear(),
          String(now.getMonth() + 1).padStart(2, "0"),
          String(now.getDate()).padStart(2, "0"),
        ].join("-");

        const completions = await getHabitCompletions(token, today);
        const completion = completions.find(
          (item) => item.habitId === selectedHabit.id,
        );

        if (!cancelled) {
          setTask(selectedHabit);
          setIsCompleted(completion?.completed ?? false);
        }
      } catch (error) {
        console.error("Failed to load task details:", error);
      }
    };

    loadTask();

    return () => {
      cancelled = true;
    };
  }, [id, isLoaded, isSignedIn]);

  const taskIcon =
    TICKLY_ICONS.find((item) => item.id === task?.icon)?.icon ??
    TICKLY_ICONS[0].icon;

  const formattedRepeat = task?.repeat
    ? task.repeat.charAt(0).toUpperCase() + task.repeat.slice(1).toLowerCase()
    : "Daily";

  return (
    <SafeAreaView className="flex-1 bg-background p-8">
      <Pressable onPress={() => router.back()} className="z-50 p-2">
        <Image
          source={icons.back}
          style={{ width: 20, height: 20 }}
          resizeMode="contain"
        />
      </Pressable>

      <View className="mt-4 flex flex-col items-center justify-center gap-2">
        <View className="flex h-36 w-36 items-center justify-center rounded-full bg-[#FFE6D7]">
          <Image
            source={taskIcon}
            style={{ width: 80, height: 80 }}
            resizeMode="contain"
          />
        </View>

        <Text className="mt-2 font-sans-bold text-3xl text-primary">
          {task?.name ?? "Loading habit..."}
        </Text>

        <View className="mt-2 flex flex-row items-center justify-center gap-2">
          <Image
            source={icons.repeat}
            style={{ width: 15, height: 15 }}
            resizeMode="contain"
          />

          <Text className="font-sans text-lg text-muted-foreground">
            {formattedRepeat}
          </Text>
        </View>

        <Text className="mt-2 font-sans text-sm text-primary">
          Every little step counts. Keep going, you’re doing great! 🌱
        </Text>
      </View>

      <View className="mt-8 flex flex-col items-center justify-between rounded-xl bg-card p-4 shadow-sm">
        <View className="w-full">
          <Text className="mb-2 mt-4 font-sans-bold text-lg text-primary">
            Today
          </Text>

          <Text className="font-sans text-foreground">
            {isCompleted ? "Completed ✓" : "Not completed yet"}
          </Text>
        </View>

        <Pressable
          onPress={() => router.push("/")}
          className="mt-8 h-14 w-full flex-row items-center justify-center rounded-full bg-[#78977B] px-3 shadow-2xs"
        >
          <Text className="font-sans-bold text-xl text-white">
            Mark as Complete
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(tasks)/customTask")}
          className="mt-8 h-14 w-full flex-row items-center justify-center rounded-full border border-[#F7D9CE] bg-[#F7EBE7] px-3 shadow-2xs"
        >
          <Text className="font-sans-bold text-xl text-[#54253A]">
            Edit Task
          </Text>
        </Pressable>

        <Pressable className="mt-8 h-14 w-full flex-row items-center justify-center rounded-full border border-[#D85C5C] bg-[#F8DCE3] px-3 shadow-2xs">
          <Text className="font-sans-bold text-xl text-[#D85C5C]">
            Delete Task
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default TaskDetails;
