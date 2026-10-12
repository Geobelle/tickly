import { styled } from "nativewind";
import { Image, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import CompletionRate from "../../../components/CompletionRate";
import StatsBar from "../../../components/StatsBar";
import { TICKLY_ICONS } from "../../../constant/emojis";
import images from "../../../constant/images";
const SafeAreaView = styled(RNSafeAreaView);

export default function Stats() {
  return (
    <SafeAreaView className="bg-background flex-1 p-5 ">
      <Text className="text-xl font-bold mb-3 text-foreground">Stats</Text>
      <StatsBar />
      <View className="mt-8">
        <CompletionRate
          percentage={50}
          completed={10}
          total={20}
          period="This week"
        />
      </View>

      <View className="bg-card mt-4 p-2 shadow-xs rounded-2xl">
        <View className="flex flex-row mb-2 justify-between">
          <Text className="font-sans-bold text-[#54253A] text-lg">
            Most Completed
          </Text>
          <Image
            source={images.crown}
            style={{
              width: 24,
              height: 24,
            }}
            resizeMode="contain"
          />
        </View>
        <View className="flex gap-4 flex-row">
          <Image
            source={TICKLY_ICONS.find((item) => item.id === "water")!.icon}
            style={{
              width: 32,
              height: 32,
            }}
            resizeMode="contain"
          />

          <View className="flex gap-1">
            <Text className="font-sans-bold text-[#54253A]">Drink Water</Text>
            <Text className="font-sans text-[#54253A]">7 Days</Text>
          </View>
        </View>
      </View>

      <View className="bg-card mt-4 p-4 items-center shadow-xs rounded-2xl flex flex-row gap-6">
        <View className="flex gap-2">
          <Image
            source={images.fire}
            style={{
              width: 24,
              height: 24,
            }}
            resizeMode="contain"
          />
          <Image
            source={images.star}
            style={{
              width: 15,
              height: 15,
            }}
            resizeMode="contain"
          />
        </View>
        <View>
          <Text className="font-sans-bold text-[#54253A] text-lg">Streak</Text>

          <Text className="font-sans-bold text-2xl text-[#54253A]">3 Days</Text>
          <Text className="font-sans text-[#54253A]">Keep it up</Text>
        </View>
      </View>
      <View className="mt-auto mb-20">
        <Image
          source={images.consistentMascot}
          style={{
            width: 375,
            height: 150,
          }}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}
