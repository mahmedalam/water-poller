export type TTime = {
  hours: number;
  minutes: number;
  modifier: "am" | "pm";
};

export type TDuration = {
  hours: number;
  minutes: number;
};

export type TAllSchedules = {
  date: string;
  area: TArea;
  schedules: TSchedule[];
};

export type TArea = {
  areaName: string;
  onDays: number;
  offDays: number;
  startDate: string;
  admin: string;
};

export type TSchedule = {
  name: string;
  time: TTime;
  duration: TDuration;
  area: string;
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
  schedules: TSchedule[],
  totalDays = 30,
): TAllSchedules[] {
  const newSchedules = [];
  const cycle = area.onDays + area.offDays;

  const startDate = new Date(area.startDate);

  for (let day = 0; day < totalDays; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);

    const dayInCycle = day % cycle;

    if (dayInCycle < area.onDays) {
      newSchedules.push({
        date: currentDate.toDateString(),
        hasWater: true,
        area: area,
        schedules: schedules,
      });
    }
  }

  return newSchedules;
}

const area: TArea = {
  areaName: "16A Buffer Zone",
  onDays: 2,
  offDays: 4,
  startDate: "2025-12-23",
  admin: "Arshad Shakoor",
};

const schedules: TSchedule[] = [
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

export function getUpcomingSchedule(scheduleData: TAllSchedules[]) {
  const now = new Date();

  return (
    scheduleData
      // remove past days
      .filter((day) => {
        const dayDate = new Date(day.date);
        return dayDate >= new Date(now.toDateString());
      })
      // remove past times in today
      .map((day) => {
        const filteredSchedules = day.schedules.filter((item) => {
          const fullDateTime = createDateTime(day.date, item.time);
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

// console.log(getUpcomingSchedule(createSchedule(area, schedules)));
// Note: Run a cron job after every 30days on appwrite functions or a specific cron job service provider!

export function flattenSupplies(upcomingSchedules: TAllSchedules[]) {
  const result: {
    date: string;
    time: TTime;
    name: string;
    area: string;
  }[] = [];

  for (const day of upcomingSchedules) {
    for (const s of day.schedules) {
      result.push({
        date: day.date,
        time: s.time,
        name: s.name,
        area: s.area,
      });
    }
  }

  return result;
}
