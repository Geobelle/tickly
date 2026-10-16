import { useState } from "react";
import { Pressable, Text, View } from "react-native";

const repeatOptions = ["Just Once", "Daily", "Weekly", "Biweekly", "Monthly"];

interface RepeatDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RepeatDropdown({
  value,
  onChange,
}: RepeatDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <View className="relative">
      <Pressable
        onPress={() => setOpen(!open)}
        className="h-14 w-full flex-row items-center justify-between rounded-3xl border border-border bg-card px-4"
      >
        <Text className="text-sm text-primary">{value}</Text>
        <Text className="text-xs text-primary">{open ? "▲" : "▼"}</Text>
      </Pressable>

      {open && (
        <View className="absolute left-0 top-12 z-50 w-full overflow-hidden rounded-3xl border border-[#EADBD7] bg-[#FFF8E7] shadow-md">
          {repeatOptions.map((option) => (
            <Pressable
              key={option}
              onPress={() => {
                onChange(option);
                setOpen(false);
              }}
              className="px-4 py-3"
            >
              <Text
                className={`text-sm ${
                  value === option
                    ? "font-semibold text-primary"
                    : "text-[#646464]"
                }`}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
