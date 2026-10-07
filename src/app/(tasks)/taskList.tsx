import { Link, router } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import TaskListCard from "../../../components/TaskListCard";
import { HOME_TASK } from "../../../constant/data";
import { icons } from "../../../constant/icons";

const SafeAreaView = styled(RNSafeAreaView);

const TaskList = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-background  p-8">
      <View className="flex flex-row items-center gap-30">
        <Link href="/(tabs)" asChild>
          <Pressable>
            <Image
              source={icons.back}
              style={{
                width: 20,
                height: 20,
              }}
              resizeMode="contain"
            />
          </Pressable>
        </Link>

        <Text className="font-sans-bold text-3xl text-primary">Task List</Text>
      </View>

      <FlatList
        className="my-8 rounded-3xl bg-[#FCFAF6] shadow-md"
        data={HOME_TASK}
        style={{ flexGrow: 0 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskListCard
            {...item}
            selected={selectedId === item.id}
            onPress={() =>
              setSelectedId(selectedId === item.id ? null : item.id)
            }
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text>No upcoming tasks currently</Text>}
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
