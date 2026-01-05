export type TTime = {
  hours: number;
  minutes: number;
  modifier: "am" | "pm";
};

export type TDuration = {
  hours: number;
  minutes: number;
};

export type TSchedule = {
  date: string;
  area: TArea;
  supplies: TDay[];
};

export type TArea = {
  areaName: string;
  onDays: number;
  offDays: number;
  startDate: string;
  admin: string;
};

export type TDay = {
  name: string;
  time: TTime;
  duration: TDuration;
  area: string;
  isActive?: boolean;
};

export function createDateTime(dateStr: string, timeObject: TTime): Date {
  let hours = timeObject.hours;
  if (timeObject.modifier.toLowerCase() === "pm" && hours < 12) hours += 12;
  if (timeObject.modifier.toLowerCase() === "am" && hours === 12) hours = 0;

  const date = new Date(dateStr);
  date.setHours(hours, timeObject.minutes, 0, 0);
  return date;
}

export function createSchedule(
  area: TArea,
  supplies: TDay[],
  totalDays = 30,
): TSchedule[] {
  const newSchedule = [];
  const cycle = area.onDays + area.offDays;

  const startDate = new Date(area.startDate);

  for (let day = 0; day < totalDays; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);

    const dayInCycle = day % cycle;

    if (dayInCycle < area.onDays) {
      newSchedule.push({
        date: currentDate.toDateString(),
        hasWater: true,
        area: area,
        supplies: supplies,
      });
    }
  }

  return newSchedule;
}

export const area: TArea = {
  areaName: "16A Buffer Zone",
  onDays: 2,
  offDays: 4,
  startDate: "2025-12-23",
  admin: "Arshad Shakoor",
};

export const supplies: TDay[] = [
  {
    name: "Morning Supply",
    time: { hours: 9, minutes: 30, modifier: "am" },
    duration: { hours: 1, minutes: 30 },
    area: "Ali Masjid",
  },
  {
    name: "Evening Supply",
    time: { hours: 5, minutes: 0, modifier: "pm" },
    duration: { hours: 2, minutes: 0 },
    area: "Ali Masjid",
  },
];

export function getUpcomingSchedule(
  scheduleData: TSchedule[],
  nowDate: number,
) {
  const now = new Date(nowDate);

  return (
    scheduleData
      // remove past days
      .filter((day) => {
        const dayDate = new Date(day.date);
        return dayDate >= new Date(now.toDateString());
      })
      // remove past times in today
      .map((day) => {
        const filteredSchedules = day.supplies.filter((supply) => {
          const fullDateTime = createDateTime(day.date, supply.time);
          fullDateTime.setHours(
            fullDateTime.getHours() + supply.duration.hours,
            fullDateTime.getMinutes() + supply.duration.minutes,
          );
          return fullDateTime > now;
        });

        return {
          ...day,
          schedules: filteredSchedules,
        };
      })
      .filter((day) => day.schedules.length > 0)
  );
}

// console.log(getUpcomingSchedule(createSchedule(area, supplies)));
// Note: Run a cron job after every 30days on appwrite functions or a specific cron job service provider!

export function flattenSupplies(upcomingSchedule: TSchedule[]) {
  const result: {
    date: string;
    time: TTime;
    name: string;
    area: string;
  }[] = [];

  for (const day of upcomingSchedule) {
    for (const supply of day.supplies) {
      result.push({
        date: day.date,
        time: supply.time,
        name: supply.name,
        area: supply.area,
      });
    }
  }

  return result;
}
