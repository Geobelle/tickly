import { usePostHog } from "posthog-react-native";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { posthogLogger } from "../lib/posthog-logger";
import CheckButton from "./CheckBtn";

const TaskCard = ({
  icon,
  name,
  numberOfTask,
  numberOfCompletedTask,
  status,
}: Task) => {
  const posthog = usePostHog();
  const [taskStatus, setTaskStatus] = useState(status);

  const isCompleted = taskStatus === "completed";

  const handleCheck = () => {
    const nextStatus = isCompleted ? "incomplete" : "completed";
    posthog?.capture(isCompleted ? "task_reopened" : "task_completed");
    posthogLogger.info("task status changed", {
      event: "task_status_changed",
      status: nextStatus,
    });
    setTaskStatus(nextStatus);
  };
  return (
    <Pressable
      className={` p-4 mb-2  rounded-3xl  ${isCompleted ? "bg-[#F1F7E7] border-0 shadow-xs " : "bg-[#FFF4E9] border-2 border-[#EADBD7]"}`}
    >
      <View className="flex flex-row items-center gap-4">
        <CheckButton checked={isCompleted} onPress={handleCheck} />

        <View className="flex flex-row gap-2">
          <View className="bg-background rounded-full w-10 h-10 flex items-center justify-center">
            <Image
              source={icon}
              style={{
                width: 25,
                height: 25,
              }}
              resizeMode="contain"
            />
          </View>

          <View className="flex gap-1">
            <Text className="font-sans-bold">{name}</Text>
            <Text className="font-sans">
              {numberOfCompletedTask}/{numberOfTask}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default TaskCard;
