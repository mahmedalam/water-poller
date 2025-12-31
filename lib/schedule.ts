function createDateTime(dateStr: string, timeStr: string): Date {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier.toLowerCase() === "pm" && hours < 12) hours += 12;
  if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;

  const date = new Date(dateStr);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

type TAllSchedules = {
  date: string;
  hasWater: boolean;
  area: TArea;
  schedules: TSchedule[];
};

type TArea = {
  areaName: string;
  onDays: number;
  offDays: number;
  startDate: string;
  admin: string;
};

type TSchedule = {
  name: string;
  time: string;
  duration: string;
  area: string;
};

function createSchedule(
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
    time: "09:00 am",
    duration: "3hrs",
    area: "Ali Masjid",
  },
  {
    name: "Evening Supply",
    time: "05:00 pm",
    duration: "1.5hrs",
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
  );
}
