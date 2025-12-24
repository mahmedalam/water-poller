import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-black">
      <Text className="text-4xl text-center text-blue-500 font-inter-bold">
        Welcome to my React Native Application!
      </Text>
    </SafeAreaView>
  );
}
