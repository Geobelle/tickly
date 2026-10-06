import { Link } from "expo-router";
import { styled } from "nativewind";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import TaskCard from "../../../components/TaskCard";
import TitleText from "../../../components/TitleText";
import { HOME_TASK, HOME_USER, INSPIRATION } from "../../../constant/data";
import { icons } from "../../../constant/icons";
import images from "../../../constant/images";
import ProgressCircle from "../../../lib/utils";
const SafeAreaView = styled(RNSafeAreaView);

export default function TabsIndex() {
  return (
    <SafeAreaView className="flex-1 p-8 bg-background">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="flex flex-row justify-between items-center">
              <Text className="text-muted-foreground text-xl font-sans-boldItalic">
                Good Morning,
              </Text>
              <Image
                source={icons.settingIcon}
                style={{
                  width: 24,
                  height: 24,
                }}
                resizeMode="contain"
              />
            </View>
            <View className="mt-4 flex flex-row items-center gap-4">
              <Text className="text-primary text-5xl font-sans-bold">
                {HOME_USER.name}
              </Text>
              <Image
                source={images.sun}
                style={{
                  width: 40,
                  height: 40,
                }}
                resizeMode="contain"
              />
            </View>
            <View className="flex flex-row items-center justify-between">
              <Text className="w-2/3 text-muted-foreground text-lg font-sans">
                {INSPIRATION.text}
              </Text>
              <Image
                source={images.leaf}
                style={{
                  width: 80,
                  height: 80,
                }}
                resizeMode="contain"
              />
            </View>
            <View className="bg-cream rounded-xl  h-fit p-4 border-border border-2">
              <Text className="text-muted-foreground mb-2 text-2xl font-sans-boldItalic">
                Today progress
              </Text>
              <View className="flex flex-row items-center justify-around">
                <ProgressCircle completed={4} total={8} />
                <Text className="text-muted-foreground text-2xl w-1/3 text-center font-sans-boldItalic">
                  you are doing great
                </Text>
              </View>
            </View>
            <View className="my-4 flex flex-row justify-between items-center">
              <Text>
                <TitleText title="Today's tasks" />
              </Text>
              <Link href="/(tasks)/taskList" asChild>
                <Pressable className="">
                  <Image
                    source={icons.addIcon}
                    style={{
                      width: 40,
                      height: 40,
                    }}
                    resizeMode="contain"
                  />
                </Pressable>
              </Link>
            </View>
          </>
        )}
        data={HOME_TASK}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskCard {...item} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text>No upcoming tasks currently</Text>}
        contentContainerClassName="pb-20"
      />
    </SafeAreaView>
  );
}
