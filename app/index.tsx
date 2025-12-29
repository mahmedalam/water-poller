import { sampleSchedule } from "@/sample_data";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCountdown } from "@/hooks/use-count";
import {
  clockIconX16,
  heroImage,
  locationIconX16,
  settingsIconX32,
  waterIconX24,
} from "@/constants";
import { Fragment } from "react";
import { createDateTime } from "@/lib/utils";
import { getUpcomingSchedule } from "@/lib/schedule";

export default function Index() {
  const upcomingSchedules = getUpcomingSchedule(sampleSchedule);
  const targetDate = createDateTime(
    upcomingSchedules[0].date,
    upcomingSchedules[0].schedules[0].time,
  );
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background">
      {/*List of Schedules*/}
      <FlatList
        className="w-full px-4"
        ListHeaderComponent={() => (
          <Fragment>
            {/*Hero*/}
            <View className="w-full aspect-[1440/1040]">
              <TouchableOpacity
                onPress={() =>
                  Alert.alert("Settings will available in next update")
                }
                className="absolute top-3 right-3 z-10"
              >
                <Image
                  source={settingsIconX32}
                  className="size-8 bg-primary/15 rounded-full"
                />
              </TouchableOpacity>
              <Image
                source={heroImage}
                className="size-full"
                resizeMode="contain"
              />
            </View>
            {/*Timer*/}
            <View className="w-full p-4 bg-primary/15 flex flex-row justify-between">
              <Text className="text-base font-inter-regular text-foreground">
                Next Supply
              </Text>
              <Text className="text-base font-inter-regular text-foreground">
                {days}d {hours}h {minutes}m {seconds}s
              </Text>
            </View>
            {/*H2*/}
            <View className="mx-4 my-6 flex flex-row gap-2">
              <Image source={waterIconX24} />
              <Text className="text-2xl font-inter-bold text-foreground">
                Upcoming Supplies
              </Text>
            </View>
          </Fragment>
        )}
        data={upcomingSchedules}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <Fragment>
            {item.schedule?.map((schedule, index) => (
              <Pressable
                className="w-full bg-primary/10 p-4 flex gap-3 border border-primary/10 rounded-2xl mb-3"
                key={index}
              >
                <View className="flex flex-row justify-between items-center">
                  <Text className="text-xl font-inter-bold text-foreground">
                    {schedule.name}
                  </Text>
                  <Text className="px-1.5 py-1 rounded-full bg-primary/10 text-primary">
                    {item.date.slice(0, -5)}
                  </Text>
                </View>
                <View className="flex gap-2 opacity-75">
                  <View className="flex flex-row items-center gap-2 opacity-75">
                    <Image source={clockIconX16} />
                    <Text className="text-foreground">
                      {schedule.time} • {schedule.duration}
                    </Text>
                  </View>
                  <View className="flex flex-row items-center gap-2 opacity-75">
                    <Image source={locationIconX16} />
                    <Text className="text-foreground">{schedule.area}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </Fragment>
        )}
      />
    </SafeAreaView>
  );
}
