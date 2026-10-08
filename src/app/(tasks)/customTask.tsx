import { router } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";

import {
  Image,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import EmojiPicker from "../../../components/EmojiPicker";
import RepeatDropdown from "../../../components/ReapeatDropdown";
import TimeInput from "../../../components/TimeInput";
import { icons } from "../../../constant/icons";
import images from "../../../constant/images";
const SafeAreaView = styled(RNSafeAreaView);

const CustomTask = () => {
  const [text, onChangeText] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");
  const [time, setTime] = useState<Date>();
  return (
    <SafeAreaView className="flex-1 bg-background p-8">
      <View className="relative flex-row items-center">
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

        <Text className="absolute left-0 right-0 text-center font-sans-bold text-3xl text-primary">
          Add Task
        </Text>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <View className=" flex flex-row items-center justify-center">
            <Image
              source={images.achieve}
              style={{
                width: 250,
                height: 250,
              }}
              resizeMode="contain"
            />
          </View>

          <View>
            <Text className="font-sans-bold mb-2 text-lg text-primary">
              Task Name
            </Text>
            <TextInput
              onChangeText={onChangeText}
              placeholder="e.g. Drink water, Read a book, "
              value={text}
              className="w-full rounded-3xl border border-border bg-card p-4 font-sans text-base text-primary placeholder:text-muted-foreground"
            />
          </View>

          <View className="mt-4">
            <Text className="font-sans-bold mb-2 text-lg text-primary">
              Repeat
            </Text>
            <RepeatDropdown />
          </View>

          <View className="mt-4">
            <Text className="font-sans-bold  text-lg text-primary">Icon</Text>
            <EmojiPicker
              selectedIcon={selectedIcon}
              onSelect={setSelectedIcon}
            />
          </View>
          <View className="mt-4">
            <Text className="font-sans-bold text-lg mb-2 text-primary">
              Time{" "}
              <Text className="font-sans text-muted-foreground">
                (optional)
              </Text>
            </Text>
            <TimeInput value={time} onChange={setTime} />
          </View>

          <Pressable
            onPress={() => {
              router.push("/");
            }}
            className="h-14  mt-8 w-2/3 self-center flex-row items-center justify-center rounded-full bg-primary px-3"
          >
            <Text className="font-sans-bold text-xl text-white">Save Task</Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default CustomTask;
