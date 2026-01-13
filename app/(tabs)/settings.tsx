import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { settingsIconX24 } from "@/constants";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Settings() {
  const [startDate, setStartDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (_: any, date?: Date) => {
    setShowPicker(false);
    if (date) setStartDate(date);
  };

  return (
    <SafeAreaView className="min-h-full bg-background text-foreground">
      <View className="mx-auto my-6 flex flex-row gap-2">
        <Image source={settingsIconX24} />
        <Text className="text-2xl font-inter-bold text-foreground">
          Settings
        </Text>
      </View>
      <View className="mx-auto my-6 flex flex-col gap-2">
        <Text className="text-foreground">Select the time</Text>
        <TouchableOpacity
          className="bg-foreground p-2 rounded-md"
          onPress={() => setShowPicker(true)}
        >
          <Text className="text-background">
            {startDate.toLocaleTimeString("en-GB")}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker value={startDate} mode="time" onChange={onChange} />
        )}
      </View>
    </SafeAreaView>
  );
}
