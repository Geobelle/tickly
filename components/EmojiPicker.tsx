import { useState } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";
import { TICKLY_ICONS } from "../constant/emojis";

interface EmojiPickerProps {
  selectedIcon?: string;
  onSelect: (iconId: string) => void;
}

const EmojiPicker = ({ selectedIcon, onSelect }: EmojiPickerProps) => {
  const [showAll, setShowAll] = useState(false);

  // The emojis shown directly on the form
  const featuredIcons = TICKLY_ICONS.slice(0, 4);

  const handleSelect = (iconId: string) => {
    onSelect(iconId);
    setShowAll(false);
  };

  return (
    <>
      {/* Emoji row */}
      <View className="mt-3 flex-row items-center gap-3">
        {featuredIcons.map((item) => {
          const isSelected = selectedIcon === item.id;

          return (
            <Pressable
              key={item.id}
              onPress={() => handleSelect(item.id)}
              className={`h-16 w-16 items-center justify-center rounded-full ${
                isSelected
                  ? "border-2 border-[#580016] bg-[#F2ECED]"
                  : "border border-[#EADBD7] bg-[#FFFDF9]"
              }`}
            >
              <Image
                source={item.icon}
                style={{
                  width: 34,
                  height: 34,
                }}
                resizeMode="contain"
              />
            </Pressable>
          );
        })}

        {/* More button */}
        <Pressable
          onPress={() => setShowAll(true)}
          className="h-16 w-16 items-center justify-center rounded-full border border-[#EADBD7] bg-[#FFFDF9]"
        >
          <Text className="font-sans-bold text-xl text-[#580016]">...</Text>
        </Pressable>
      </View>

      {/* All emojis modal */}
      <Modal
        visible={showAll}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAll(false)}
      >
        <View className="flex-1 justify-end bg-black/20">
          <View className="max-h-[75%] rounded-t-[32px] bg-[#FFF9F5] px-5 pb-8 pt-5">
            {/* Header */}
            <View className="mb-5 flex-row items-center justify-between">
              <Text className="font-sans-bold text-xl text-[#580016]">
                Choose an icon
              </Text>

              <Pressable
                onPress={() => setShowAll(false)}
                className="h-9 w-9 items-center justify-center rounded-full bg-[#F2ECED]"
              >
                <Text className="text-lg text-[#580016]">×</Text>
              </Pressable>
            </View>

            {/* Emoji grid */}
            <View className="flex-row flex-wrap gap-3">
              {TICKLY_ICONS.map((item) => {
                const isSelected = selectedIcon === item.id;

                return (
                  <Pressable
                    key={item.id}
                    onPress={() => handleSelect(item.id)}
                    className={`h-16 w-16 items-center justify-center rounded-full ${
                      isSelected
                        ? "border-2 border-[#580016] bg-[#F2ECED]"
                        : "border border-[#EADBD7] bg-white"
                    }`}
                  >
                    <Image
                      source={item.icon}
                      style={{
                        width: 34,
                        height: 34,
                      }}
                      resizeMode="contain"
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default EmojiPicker;
