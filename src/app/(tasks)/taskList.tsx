import { useAuth } from "@clerk/expo";
import { Link, router } from "expo-router";
import { styled } from "nativewind";
import { useEffect, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import TaskListCard from "../../../components/TaskListCard";
import { TICKLY_ICONS } from "../../../constant/emojis";
import { icons } from "../../../constant/icons";
import { getHabits } from "../../../services/habits";

const SafeAreaView = styled(RNSafeAreaView);

const TaskList = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoaded) return;

    let cancelled = false;

    const loadHabits = async () => {
      setIsLoading(true);
      setError("");

      try {
        if (!isSignedIn) {
          throw new Error("Please sign in to view your tasks.");
        }

        const token = await getToken();

        if (!token) {
          throw new Error(
            "Unable to verify your session. Please sign in again.",
          );
        }

        const habits = await getHabits(token);

        const loadedTasks: (Task & { repeat: string })[] = habits.map(
          (habit) => ({
            id: habit.id,
            name: habit.name,
            icon:
              TICKLY_ICONS.find((item) => item.id === habit.icon)?.icon ??
              TICKLY_ICONS[0].icon,
            status: "uncompleted",
            repeat: habit.repeat,
          }),
        );
        if (!cancelled) {
          setTasks(loadedTasks);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load your tasks.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadHabits();

    return () => {
      cancelled = true;
    };
  }, [getToken, isLoaded, isSignedIn]);

  return (
    <SafeAreaView className="flex-1 bg-background p-8">
      <View className="flex flex-row items-center gap-30">
        <Link href="/(tabs)" asChild>
          <Pressable>
            <Image
              source={icons.back}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </Pressable>
        </Link>

        <Text className="font-sans-bold text-3xl text-primary">Task List</Text>
      </View>

      {error ? (
        <Text className="mt-4 text-center text-red-600">{error}</Text>
      ) : null}

      <FlatList
        className="my-8 rounded-3xl bg-[#FCFAF6] shadow-md"
        data={tasks}
        style={{ flexGrow: 0 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskListCard
            icon={item.icon}
            name={item.name}
            repeat={item.repeat}
            selected={selectedId === item.id}
            onPress={() =>
              setSelectedId(selectedId === item.id ? null : item.id)
            }
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="p-4 text-center text-muted-foreground">
            {isLoading ? "Loading tasks..." : "No upcoming tasks currently"}
          </Text>
        }
        contentContainerClassName="pb-20"
      />

      <Pressable
        className="h-14 w-2/3 self-center flex-row items-center justify-center rounded-full bg-primary px-3"
        onPress={() => {
          if (selectedId) {
            router.push(`/(tasks)/editTask/${selectedId}`);
          } else {
            router.push("/(tasks)/customTask");
          }
        }}
      >
        <Text className="font-sans-bold text-xl text-white">
          {selectedId ? "Edit Task" : "Add Task"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default TaskList;
