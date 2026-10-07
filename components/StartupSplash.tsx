import { useAudioPlayer } from "expo-audio";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Animated, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../constant/images";

const splashSound = require("../assets/sounds/tickly.mp3");

export default function StartupSplash() {
  const [entrance] = useState(() => new Animated.Value(0));

  const player = useAudioPlayer(splashSound);

  useEffect(() => {
    // Play splash sound
    player.play();

    // Start splash animation
    Animated.timing(entrance, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();

    return () => {};
  }, [player, entrance]);

  const contentStyle = {
    opacity: entrance,
  };

  return (
    <LinearGradient
      colors={[
        "#fff8f3", // background
        "#fff4e9", // cream
        "#f8dce3", // blush
      ]}
      locations={[0, 0.55, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 items-center justify-center">
        <Animated.View
          style={[
            contentStyle,
            {
              transform: [
                { translateY: 160 },
                {
                  scale: entrance.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.94, 1],
                  }),
                },
              ],
            },
          ]}
          className="items-center"
        >
          <View className="rounded-full border border-border bg-cream p-3">
            <Image
              source={images.loginMascot}
              accessibilityLabel="Tickly mascot"
              style={{ width: 208, height: 208 }}
              resizeMode="contain"
            />
          </View>

          <Text className="mt-7 text-5xl font-sans-bold text-primary">
            Tickly
          </Text>

          <Text className="mt-2 text-base font-sans text-muted-foreground">
            Small steps. Big progress.
          </Text>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}
