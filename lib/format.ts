import type { City, SkyTarget } from "@/types/sky";

export function localDateToUtc(dateString: string, timeString: string, utcOffset: number) {
  const [year, month, day] = dateString.split("-").map(Number);
  const [hours, minutes] = timeString.split(":").map(Number);
  return new Date(Date.UTC(year, month - 1, day, hours - utcOffset, minutes));
}

export function formatDate(dateString: string, options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" }) {
  return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(new Date(`${dateString}T12:00:00Z`));
}

export function formatTime(timeString: string) {
  const [hour, minute] = timeString.split(":").map(Number);
  const date = new Date(Date.UTC(2020, 0, 1, hour, minute));
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(date);
}

export function formatAzimuth(azimuth: number) {
  const labels = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return labels[Math.round(normalizeAngle(azimuth) / 45) % 8];
}

export function normalizeAngle(angle: number) {
  return ((angle % 360) + 360) % 360;
}

export function signedAngle(angle: number) {
  const normalized = normalizeAngle(angle);
  return normalized > 180 ? normalized - 360 : normalized;
}

export function currentLocalDateTime(city: City) {
  const now = new Date();
  const local = new Date(now.getTime() + city.utcOffset * 60 * 60 * 1000);
  const date = `${local.getUTCFullYear()}-${String(local.getUTCMonth() + 1).padStart(2, "0")}-${String(local.getUTCDate()).padStart(2, "0")}`;
  const time = `${String(local.getUTCHours()).padStart(2, "0")}:${String(local.getUTCMinutes()).padStart(2, "0")}`;
  return { date, time };
}

export function visibilityText(target?: SkyTarget | null) {
  if (!target) return "Not selected";
  if ("visibility" in target) {
    if (target.visibility > 0.65) return "Visible tonight";
    if (target.visibility > 0) return "Partly visible";
    return "Below the horizon";
  }
  if (target.altitude > 15) return "Excellent visibility";
  if (target.altitude > 5) return "Good visibility";
  if (target.altitude > 0) return "Low in the sky";
  return "Below the horizon";
}

export function targetDirection(target: SkyTarget) {
  if ("visibility" in target) return formatAzimuth(target.averageAzimuth);
  return formatAzimuth(target.azimuth);
}
