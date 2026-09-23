import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import "../../global.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "comic-bold": require("@/assets/fonts/ComicNeue-Bold.ttf"),
    "comic-boldItalic": require("@/assets/fonts/ComicNeue-BoldItalic.ttf"),
    "comic-italic": require("@/assets/fonts/ComicNeue-Italic.ttf"),
    "comic-light": require("@/assets/fonts/ComicNeue-Light.ttf"),
    "comic-lightItalic": require("@/assets/fonts/ComicNeue-LightItalic.ttf"),
    "comic-regular": require("@/assets/fonts/ComicNeue-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
