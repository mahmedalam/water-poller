import { TDuration, TTime } from "@/lib/schedule";

export function timeToString(time: TTime): string {
  const h = time.hours.toString().padStart(2, "0");
  const m = time.minutes.toString().padStart(2, "0");
  const mod = time.modifier.toUpperCase();

  return `${h}:${m} ${mod}`;
}

export function durationToString(duration: TDuration): string {
  const parts: string[] = [];

  if (duration.hours > 0) {
    parts.push(`${duration.hours}h`);
  }

  if (duration.minutes > 0) {
    parts.push(`${duration.minutes}m`);
  }

  // fallback for 0 duration
  if (parts.length === 0) {
    return "0m";
  }

  return parts.join(" ");
}
