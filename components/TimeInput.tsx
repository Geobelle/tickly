import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

interface TimeInputProps {
  value?: Date;
  onChange?: (date: Date) => void;
}

export default function TimeInput({ value, onChange }: TimeInputProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [time, setTime] = useState(value ?? new Date());

  const handleChange = (event: any, selectedTime?: Date) => {
    setShowPicker(false);

    if (selectedTime) {
      setTime(selectedTime);
      onChange?.(selectedTime);
    }
  };

  const formattedTime = time.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <View>
      <Pressable
        onPress={() => setShowPicker(true)}
        className=" h-14 rounded-3xl border border-[#EADBD7] bg-card px-4 py-4"
      >
        <Text className="text-base text-primary">{formattedTime}</Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
        />
      )}
    </View>
  );
}
