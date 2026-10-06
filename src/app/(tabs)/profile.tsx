import { styled } from "nativewind";
import { useClerk, useUser } from "@clerk/expo";
import { useState } from "react";
import { usePostHog } from "posthog-react-native";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { posthogLogger } from "../../../lib/posthog-logger";
const SafeAreaView = styled(RNSafeAreaView);

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const posthog = usePostHog();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignOut = async () => {
    setBusy(true);
    setMessage("");
    try {
      await signOut();
      posthog?.capture("sign_out_completed");
      posthogLogger.info("sign out completed", {
        event: "sign_out_completed",
      });
      posthog?.reset();
    } catch {
      setMessage("We couldn’t sign you out. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-3xl font-sans-bold text-primary">Your profile</Text>
      <View className="mt-6 rounded-3xl border border-border bg-card p-5">
        <Text className="text-xl font-sans-bold text-foreground">
          {user?.fullName || "Your Tickly account"}
        </Text>
        <Text className="mt-1 font-sans text-muted-foreground">
          {user?.primaryEmailAddress?.emailAddress ?? ""}
        </Text>
      </View>
      {message ? <Text accessibilityRole="alert" className="mt-4 font-sans text-destructive">{message}</Text> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: busy, busy }}
        disabled={busy}
        onPress={handleSignOut}
        className={`mt-6 h-14 flex-row items-center justify-center rounded-full border border-primary ${busy ? "opacity-60" : "active:bg-blush"}`}
      >
        {busy ? <ActivityIndicator color="#6f2943" /> : <Text className="font-sans-bold text-primary">Sign out</Text>}
      </Pressable>
    </SafeAreaView>
  );
}
