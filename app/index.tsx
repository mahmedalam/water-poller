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
import { Fragment, useEffect, useMemo, useState } from "react";
import {
  createDateTime,
  flattenSupplies,
  getUpcomingSchedule,
  TSchedule,
} from "@/lib/schedule";
import { initNotifications } from "@/lib/notifications";
import { scheduleWaterNotifications } from "@/lib/notificationScheduler";
import { durationToString, timeToString } from "@/lib/utils";

export default function Index() {
  const [now, setNow] = useState(Date.now());
  const upcomingSchedules = useMemo(() => {
    return getUpcomingSchedule(sampleSchedule, now);
  }, [now]);
  const supplies = useMemo(
    () => flattenSupplies(upcomingSchedules),
    [upcomingSchedules],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSupply = supplies[currentIndex];

  const targetDate = createDateTime(currentSupply.date, currentSupply.time);
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  useEffect(() => {
    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
      setCurrentIndex((prev) => (prev + 1 < supplies.length ? prev + 1 : prev));
    }
  }, [days, hours, minutes, seconds, supplies.length]);

  useEffect(() => {
    initNotifications();
    scheduleWaterNotifications(upcomingSchedules);
  }, [upcomingSchedules]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function isSupplyActive(dayDate: string, supply: TSchedule) {
    const current = new Date(now);
    const start = createDateTime(dayDate, supply.time);
    const end = new Date(start);
    end.setHours(
      end.getHours() + supply.duration.hours,
      end.getMinutes() + supply.duration.minutes,
    );

    return current >= start && current < end;
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background">
      {/*List of Schedules*/}
      <FlatList
        className="w-full"
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
            <View className="mx-auto my-6 flex flex-row gap-2">
              <Image source={waterIconX24} />
              <Text className="text-2xl font-inter-bold text-foreground">
                Upcoming Supplies
              </Text>
            </View>
          </Fragment>
        )}
        data={upcomingSchedules}
        extraData={now}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="px-4">
            {item.schedules.map((schedule, index) => {
              const active = isSupplyActive(item.date, schedule);

              return (
                <Pressable
                  className={`w-full p-4 flex gap-3 border rounded-2xl mb-3
                ${
                  active
                    ? "bg-green-500/10 border-green-500"
                    : "bg-primary/10 border-primary/10"
                }
                `}
                  key={index}
                >
                  <View className="flex flex-row justify-between items-center">
                    <Text className="text-xl font-inter-bold text-foreground">
                      {schedule.name}
                    </Text>
                    {active ? (
                      <Text className="px-1.5 py-1 rounded-full bg-green-500/10 text-green-500">
                        ACTIVE
                      </Text>
                    ) : (
                      <Text className="px-1.5 py-1 rounded-full bg-primary/10 text-primary">
                        {item.date.slice(0, -5)}
                      </Text>
                    )}
                  </View>
                  <View className="flex gap-2 opacity-75">
                    <View className="flex flex-row items-center gap-2 opacity-75">
                      <Image source={clockIconX16} />
                      <Text className="text-foreground">
                        {timeToString(schedule.time)} •{" "}
                        {durationToString(schedule.duration)}
                      </Text>
                    </View>
                    <View className="flex flex-row items-center gap-2 opacity-75">
                      <Image source={locationIconX16} />
                      <Text className="text-foreground">{schedule.area}</Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      />
    </SafeAreaView>
  );
}
