import { Link } from "expo-router";
import { styled } from "nativewind";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import TaskListCard from "../../../components/TaskListCard";
import { HOME_TASK } from "../../../constant/data";
import { icons } from "../../../constant/icons";
const SafeAreaView = styled(RNSafeAreaView);

const taskList = () => {
  return (
    <SafeAreaView className="flex-1 p-8 bg-background">
      <View className="flex flex-row items-center gap-30">
        <Link href="/(tabs)" asChild>
          <Pressable className="">
            <Image
              source={icons.back}
              style={{
                width: 20,
                height: 20,
              }}
              resizeMode="contain"
            />
          </Pressable>
        </Link>

        <Text className="font-sans-bold text-3xl text-primary">Task List</Text>
      </View>
      <FlatList
        className="mt-4 rounded-3xl bg-[#FCFAF6] shadow-md"
        data={HOME_TASK}
        style={{ flexGrow: 0 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskListCard {...item} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text>No upcoming tasks currently</Text>}
        contentContainerClassName="pb-20"
      />
    </SafeAreaView>
  );
};

export default taskList;
