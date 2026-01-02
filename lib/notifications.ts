import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export async function initNotifications() {
  if (!Device.isDevice) return;

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.warn("Notifications not allowed");
  } else {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }
}

export async function clearAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleNotification(
  title: string,
  body: string,
  triggerDate: Date,
): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });
}
