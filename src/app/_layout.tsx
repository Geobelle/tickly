import { ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { PostHogProvider } from "posthog-react-native";
import { useEffect, useState } from "react";
import { posthog } from "../../lib/posthog";
import StartupSplash from "../../components/StartupSplash";
import "../../global.css";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

if (!publishableKey) {
  throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add your key to .env.\nRun: 1) clerk auth login  2) clerk link  3) clerk env pull — then restart the dev server.");
}

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

  const app = (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <PostHogIdentity />
      <StartupGate />
    </ClerkProvider>
  );

  return posthog ? <PostHogProvider client={posthog}>{app}</PostHogProvider> : app;
}

function StartupGate() {
  const { isLoaded } = useAuth();
  const [minimumTimeElapsed, setMinimumTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinimumTimeElapsed(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!minimumTimeElapsed || !isLoaded) return <StartupSplash />;

  return <Stack screenOptions={{ headerShown: false }} />;
}

function PostHogIdentity() {
  const { isLoaded, user } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    posthog?.identify(user.id, {
      $set: {
        ...(user.primaryEmailAddress?.emailAddress
          ? { email: user.primaryEmailAddress.emailAddress }
          : {}),
        ...(user.fullName ? { name: user.fullName } : {}),
      },
    });
  }, [isLoaded, user]);

  return null;
}
