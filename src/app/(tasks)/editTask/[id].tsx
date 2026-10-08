import { router, useLocalSearchParams } from "expo-router";
import { styled } from "nativewind";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import ProgressBar from "../../../../components/ProgressBar";
import { HOME_TASK } from "../../../../constant/data";
import { icons } from "../../../../constant/icons";
const SafeAreaView = styled(RNSafeAreaView);

const TaskDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const task = HOME_TASK.find((task) => task.id === id);
  return (
    <SafeAreaView className="flex-1 bg-background p-8">
      <Pressable
        onPress={() => {
          router.push("/taskList");
        }}
        className="z-50 p-2"
      >
        <Image
          source={icons.back}
          style={{
            width: 20,
            height: 20,
          }}
          resizeMode="contain"
        />
      </Pressable>
      <View className="mt-4 flex flex-col items-center justify-center gap-2">
        <View className="flex h-36 w-36 items-center justify-center rounded-full bg-[#FFE6D7]">
          <Image
            source={task?.icon}
            style={{
              width: 80,
              height: 80,
            }}
            resizeMode="contain"
          />
        </View>

        <Text className=" mt-2 font-sans-bold text-3xl text-primary">
          {task?.name}
        </Text>
        <View className="flex flex-row items-center mt-2 justify-center gap-2">
          <Image
            source={icons.repeat}
            style={{
              width: 15,
              height: 15,
            }}
            resizeMode="contain"
          />

          <Text className="  font-sans text-lg text-muted-foreground">
            Daily
          </Text>
        </View>

        <Text className=" mt-2 font-sans text-sm text-primary">
          Every little step counts. Keep going, you’re doing great! 🌱
        </Text>
      </View>

      <View className="mt-8 flex flex-col items-center justify-between bg-card rounded-xl shadow-sm p-4">
        <View className=" w-fit">
          <Text className="font-sans-bold mb-2 mt-4 text-lg text-primary">
            Today
          </Text>
          <View className="flex flex-row items-center justify-between gap-4">
            <ProgressBar
              completed={task?.numberOfCompletedTask || 0}
              total={task?.numberOfTask || 0}
            />

            <Text className="font-sans-bold text-foreground">
              {task?.numberOfCompletedTask}/{task?.numberOfTask}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => {
            router.push("/");
          }}
          className="h-14  mt-8 w-full self-center flex-row items-center shadow-2xs justify-center rounded-full bg-[#78977B] px-3"
        >
          <Text className="font-sans-bold text-xl text-white">
            Mark as Complete
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            router.push("/(tasks)/customTask");
          }}
          className="h-14  mt-8 w-full self-center flex-row items-center justify-center shadow-2xs border border-[#F7D9CE] rounded-full bg-[#F7EBE7] px-3"
        >
          <Text className="font-sans-bold text-xl text-[#54253A]">
            Edit Task
          </Text>
        </Pressable>

        <Pressable className="h-14  mt-8 w-full self-center flex-row items-center justify-center shadow-2xs border border-[#D85C5C] rounded-full bg-[#F8DCE3] px-3">
          <Text className="font-sans-bold text-xl text-[#D85C5C]">
            Delete Task
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default TaskDetails;
