import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { posthogLogger } from "../lib/posthog-logger";
import { updateHabitCompletion } from "../services/habits";
import CheckButton from "./CheckBtn";
type TaskCardProps = Task & {
  onStatusChange?: (id: string, status: Task["status"]) => void;
};

const TaskCard = ({
  icon,
  name,
  status,
  id,
  onStatusChange,
}: TaskCardProps) => {
  const posthog = usePostHog();
  const [taskStatus, setTaskStatus] = useState(status);

  const isCompleted = taskStatus === "completed";

  const { getToken, isSignedIn } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleCheck = async () => {
    if (isSaving || !id || !isSignedIn) return;

    const nextStatus = isCompleted ? "uncompleted" : "completed";
    const completed = nextStatus === "completed";

    setIsSaving(true);

    try {
      const token = await getToken();

      if (!token) {
        throw new Error("Unable to authenticate your request.");
      }

      const now = new Date();
      const date = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
      ].join("-");

      await updateHabitCompletion(token, id, date, completed);

      setTaskStatus(nextStatus);
      onStatusChange?.(id, nextStatus);

      posthog?.capture(completed ? "task_completed" : "task_reopened");

      posthogLogger.info("task status changed", {
        event: "task_status_changed",
        status: nextStatus,
      });
    } catch (error) {
      console.error("Failed to update habit completion:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Pressable
      className={`p-4 mb-2 rounded-3xl ${
        isCompleted
          ? "bg-[#F1F7E7] border-0 shadow-xs"
          : "bg-[#FFF4E9] border-2 border-[#EADBD7]"
      }`}
      onPress={() => {
        if (id) {
          router.push(`/(tasks)/editTask/${id}`);
        }
      }}
    >
      <View className="flex flex-row items-center gap-4">
        <CheckButton checked={isCompleted} onPress={handleCheck} />

        <View className="flex flex-row gap-2">
          <View className="bg-background rounded-full w-10 h-10 flex items-center justify-center">
            <Image
              source={icon}
              style={{ width: 25, height: 25 }}
              resizeMode="contain"
            />
          </View>

          <View className="flex gap-1">
            <Text className="font-sans-bold">{name}</Text>
            <Text className="font-sans text-muted-foreground">
              {isCompleted ? "Completed" : "Not completed"}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default TaskCard;
