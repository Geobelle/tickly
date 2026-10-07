import { Link, useLocalSearchParams } from "expo-router";

import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const TaskDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView className="flex-1 bg-background p-8">
      <Text>{id}</Text>
      <Link href={"/(tasks)/taskList"}> go back</Link>
    </SafeAreaView>
  );
};

export default TaskDetails;
