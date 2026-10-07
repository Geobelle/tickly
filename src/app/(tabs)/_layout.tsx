import { useAuth } from "@clerk/expo";
import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, Image, View } from "react-native";
import { tabsDetails } from "../../../constant/data";
import "../../../global.css";

export default function TabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#6f2943" />
      </View>
    );
  }
  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#580016",
        tabBarInactiveTintColor: "#6F2943",

        tabBarStyle: {
          position: "absolute",
          backgroundColor: "#fff4e9",
          borderTopWidth: 0,
          boxShadow: "0px -2px 12px rgba(111, 41, 67, 0.1)",
          elevation: 0,
          padding: 0,
          paddingBottom: 0,
        },
      }}
    >
      {tabsDetails.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarLabel: tab.title,

            tabBarIcon: ({ focused }) => (
              <Image
                source={focused ? tab.icon.focused : tab.icon.unfocused}
                style={{
                  width: 24,
                  height: 24,
                }}
                resizeMode="contain"
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
