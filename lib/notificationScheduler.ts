import { clearAllNotifications, scheduleNotification } from "./notifications";
import { createDateTime, TAllSchedules } from "./schedule";
import { timeToString } from "@/lib/utils";

export async function scheduleWaterNotifications(
  upcomingSchedules: TAllSchedules[],
) {
  const now = new Date();

  // 🔥 important: remove old ones first
  await clearAllNotifications();

  for (const day of upcomingSchedules) {
    for (const supply of day.schedules) {
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
