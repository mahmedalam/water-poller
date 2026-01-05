import { timeToString } from "@/lib/utils";
import { clearAllNotifications, scheduleNotification } from "./notifications";
import { createDateTime, TSchedule } from "./schedule";

export async function scheduleWaterNotifications(
  upcomingSchedules: TSchedule[],
) {
  const now = new Date();

  // 🔥 important: remove old ones first
  await clearAllNotifications();

  for (const day of upcomingSchedules) {
    for (const supply of day.supplies) {
      const notifyAt = createDateTime(day.date, supply.time);

      if (notifyAt <= now) continue;

      await scheduleNotification(
        "💧 Water Poller",
        `${supply.name} at ${timeToString(supply.time)} • ${supply.area}`,
        notifyAt,
      );
    }
  }
}
