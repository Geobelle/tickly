import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Onboarding() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-xl font-semibold text-success">welcome Gee</Text>
      <Link href="/(tabs)"> fae is an ass</Link>
    </View>
  );
}
