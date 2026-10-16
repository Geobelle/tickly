import { useAuth } from "@clerk/expo";
import { useEffect, useState } from "react";
import { TICKLY_ICONS } from "../../../constant/emojis";
import { getHabitCompletions, getHabits } from "../../../services/habits";

import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import TaskCard from "../../../components/TaskCard";
import TitleText from "../../../components/TitleText";
import { HOME_USER, INSPIRATION } from "../../../constant/data";
import { icons } from "../../../constant/icons";
import images from "../../../constant/images";
import ProgressCircle from "../../../lib/utils";
const SafeAreaView = styled(RNSafeAreaView);

export default function TabsIndex() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    let cancelled = false;

    const loadHabits = async () => {
      try {
        if (!isSignedIn) {
          if (!cancelled) setTasks([]);
          return;
        }

        const token = await getToken();
        if (!token) return;

        const habits = await getHabits(token);
        const now = new Date();

        const today = [
          now.getFullYear(),
          String(now.getMonth() + 1).padStart(2, "0"),
          String(now.getDate()).padStart(2, "0"),
        ].join("-");

        const completions = await getHabitCompletions(token, today);

        const completionMap = new Map(
          completions.map((item) => [item.habitId, item.completed]),
        );
        const loadedTasks: Task[] = habits.map((habit) => ({
          id: habit.id,
          name: habit.name,
          icon:
            TICKLY_ICONS.find((item) => item.id === habit.icon)?.icon ??
            TICKLY_ICONS[0].icon,
          status: completionMap.get(habit.id) ? "completed" : "uncompleted",
          repeat: habit.repeat,
        }));

        if (!cancelled) setTasks(loadedTasks);
      } catch (error) {
        console.error("Failed to load home habits:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadHabits();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn]);

  return (
    <LinearGradient
      colors={["#FFF8F3", "#FFF4E9", "#F7EDE5", "#E9EDE5"]}
      locations={[0, 0.45, 0.72, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 p-8 ">
        <FlatList
          ListHeaderComponent={() => (
            <>
              <View className="flex flex-row justify-between items-center">
                <Text className="text-muted-foreground text-xl font-sans-boldItalic">
                  Good Morning,
                </Text>
                {/* <Image
                  source={icons.settingIcon}
                  style={{
                    width: 24,
                    height: 24,
                  }}
                  resizeMode="contain"
                /> */}
              </View>
              <View className="mt-4 flex flex-row items-center gap-4">
                <Text className="text-primary text-5xl font-sans-bold">
                  {HOME_USER.name}
                </Text>
                <Image
                  source={images.sun}
                  style={{
                    width: 40,
                    height: 40,
                  }}
                  resizeMode="contain"
                />
              </View>
              <View className="flex flex-row items-center justify-between">
                <Text className="w-2/3 text-muted-foreground text-lg font-sans">
                  {INSPIRATION.text}
                </Text>
                <Image
                  source={images.leaf}
                  style={{
                    width: 80,
                    height: 80,
                  }}
                  resizeMode="contain"
                />
              </View>
              <View className="bg-cream rounded-xl shadow-sm h-fit p-4 border-border border-2">
                <Text className="text-muted-foreground mb-2 text-2xl font-sans-boldItalic">
                  Today progress
                </Text>
                <View className="flex flex-row items-center justify-around">
                  <ProgressCircle
                    completed={
                      tasks.filter((task) => task.status === "completed").length
                    }
                    total={tasks.length}
                  />
                  <Text className="text-muted-foreground text-2xl w-1/3 text-center font-sans-boldItalic">
                    you are doing great
                  </Text>
                </View>
              </View>
              <View className="my-4 flex flex-row justify-between items-center">
                <Text>
                  <TitleText title="Today's tasks" />
                </Text>
                <Link href="/(tasks)/taskList" asChild>
                  <Pressable>
                    <Image
                      source={icons.addIcon}
                      style={{
                        width: 40,
                        height: 40,
                      }}
                      resizeMode="contain"
                    />
                  </Pressable>
                </Link>
              </View>
            </>
          )}
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard
              {...item}
              onStatusChange={(id, status) => {
                setTasks((currentTasks) =>
                  currentTasks.map((task) =>
                    task.id === id ? { ...task, status } : task,
                  ),
                );
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="text-muted-foreground">
              {isLoading ? "Loading tasks..." : "No upcoming tasks currently"}
            </Text>
          }
          contentContainerClassName="pb-20"
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
