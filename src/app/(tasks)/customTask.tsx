import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import { TICKLY_ICONS } from "../../../constant/emojis";
import { createHabit } from "../../../services/habits";

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

import { icons } from "../../../constant/icons";
import images from "../../../constant/images";
const SafeAreaView = styled(RNSafeAreaView);

const CustomTask = () => {
  const [text, onChangeText] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");
  const { getToken, isSignedIn } = useAuth();

  const [repeat, setRepeat] = useState("Daily");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");

    if (!text.trim()) {
      setError("Please enter a task name.");
      return;
    }

    const iconId = TICKLY_ICONS.find((item) => item.id === selectedIcon)?.id;

    if (!iconId) {
      setError("Please select an icon.");
      return;
    }

    if (!isSignedIn) {
      setError("Please sign in before saving a task.");
      return;
    }

    setIsSaving(true);

    try {
      const token = await getToken();

      if (!token) {
        throw new Error("Unable to verify your session. Please sign in again.");
      }

      await createHabit(token, {
        name: text.trim(),
        icon: iconId,
        repeat: repeat.toLowerCase(),
      });

      router.replace("/taskList");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save your task.",
      );
    } finally {
      setIsSaving(false);
    }
  };

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
            <RepeatDropdown value={repeat} onChange={setRepeat} />
          </View>

          <View className="mt-4">
            <Text className="font-sans-bold  text-lg text-primary">Icon</Text>
            <EmojiPicker
              selectedIcon={selectedIcon}
              onSelect={setSelectedIcon}
            />
          </View>

          {error ? (
            <Text className="mt-3 text-center text-red-600">{error}</Text>
          ) : null}

          <Pressable
            onPress={handleSave}
            disabled={isSaving}
            className="mt-8 h-14 w-2/3 self-center flex-row items-center justify-center rounded-full bg-primary px-3"
          >
            <Text className="font-sans-bold text-xl text-white">
              {isSaving ? "Saving..." : "Save Task"}
            </Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default CustomTask;
