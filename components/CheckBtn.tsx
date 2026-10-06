import { Pressable, Text } from "react-native";

type CheckButtonProps = {
  checked: boolean;
  onPress: () => void;
};

export default function CheckButton({ checked, onPress }: CheckButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`w-6 h-6 rounded-full items-center justify-center ${
        checked ? "bg-[#78977B]" : "border-2 border-[#F7D9CE]"
      }`}
    >
      {checked && <Text className="text-[#FFFDF9] font-bold text-lg">✓</Text>}
    </Pressable>
  );
}
