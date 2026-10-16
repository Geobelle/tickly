import { Image, Pressable, Text, View } from "react-native";
import CheckButton from "./CheckBtn";

type TaskListCardProps = {
  icon: any;
  name: string;
  repeat: string;
  selected: boolean;
  onPress: () => void;
};

const TaskListCard = ({
  icon,
  name,
  repeat,
  selected,
  onPress,
}: TaskListCardProps) => {
  const formattedRepeat =
    repeat.charAt(0).toUpperCase() + repeat.slice(1).toLowerCase();

  return (
    <Pressable
      onPress={onPress}
      className="mb-2 rounded-3xl border-b-2 border-[#F7D9CE] p-4"
    >
      <View className="flex flex-row items-center justify-between gap-4">
        <View className="flex flex-row gap-2">
          <View className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FEF8F1]">
            <Image
              source={icon}
              style={{ width: 25, height: 25 }}
              resizeMode="contain"
            />
          </View>

          <View className="flex gap-1">
            <Text className="font-sans-bold">{name}</Text>
            <Text className="font-sans">{formattedRepeat}</Text>
          </View>
        </View>

        <CheckButton checked={selected} onPress={onPress} />
      </View>
    </Pressable>
  );
};

export default TaskListCard;
