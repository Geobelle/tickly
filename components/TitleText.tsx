import { Text, View } from "react-native";

const TitleText = ({ title }: { title: string }) => {
  return (
    <View>
      <Text className="text-primary font-sans-boldItalic text-3xl">
        {title}
      </Text>
    </View>
  );
};

export default TitleText;
