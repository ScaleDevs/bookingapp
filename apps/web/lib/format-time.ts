/** Converts a 24-hour time string ("HH:mm:ss" or "HH:mm") to 12-hour format with AM/PM. */
export function formatTime12Hour(time: string): string {
  const [h, m] = time.split(":").map(Number)
  if (isNaN(h) || isNaN(m)) return time
  const hour12 = h % 12 === 0 ? 12 : h % 12
  const ampm = h < 12 ? "AM" : "PM"
  return `${hour12.toString().padStart(2, "0")}:${m
    .toString()
    .padStart(2, "0")} ${ampm}`
}
