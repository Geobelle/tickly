import { usePostHog } from "posthog-react-native";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import CheckButton from "./CheckBtn";

const TaskListCard = ({ icon, name }: Task) => {
  const posthog = usePostHog();

  const [checked, setChecked] = useState(false);

  return (
    <Pressable
      className={` p-4 mb-2 border-b-2 border-[#F7D9CE]  rounded-3xl  `}
    >
      <View className="flex flex-row items-center justify-between gap-4">
        <View className="flex flex-row gap-2">
          <View className="bg-[#FEF8F1] rounded-full w-10 h-10 flex items-center justify-center">
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
            <Text className="font-sans">Daily</Text>
          </View>
        </View>

        <CheckButton checked={checked} onPress={() => setChecked(!checked)} />
      </View>
    </Pressable>
  );
};

export default TaskListCard;
