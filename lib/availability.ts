import { prisma } from "./db";
import { addSessionMinutes } from "./policy";
import { getSheetTakenTimes } from "./googleSheetsAvailability";

// Fixed daily start times, doors open at each of these.
export const DAILY_START_TIMES = [
  "09:30", "12:00", "14:30", "17:00", "19:30", "22:00"
];

export async function getAvailableSlots(hallId: string, date: Date) {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const hall = await prisma.hall.findUnique({
    where: { id: hallId },
    select: { name: true }
  });

  const [existing, sheetTaken] = await Promise.all([
    prisma.booking.findMany({
      where: {
        hallId,
        date: { gte: dayStart, lt: dayEnd },
        status: { in: ["PENDING", "CONFIRMED"] }
      },
      select: { startTime: true }
    }),
    // The hall's name doubles as its tab name in the calendar sheet
    // ("Hall 1", "Hall 2"), staff use it to record walk-in/phone bookings
    // that never touch our database.
    hall ? getSheetTakenTimes(hall.name, dayStart) : Promise.resolve(new Set<string>())
  ]);

  const takenTimes = new Set(existing.map((b) => b.startTime));

  return DAILY_START_TIMES.map((startTime) => ({
    startTime,
    endTime: addSessionMinutes(startTime),
    available: !takenTimes.has(startTime) && !sheetTaken.has(startTime)
  }));
}

export async function isSlotStillAvailable(hallId: string, date: Date, startTime: string) {
  const slots = await getAvailableSlots(hallId, date);
  const slot = slots.find((s) => s.startTime === startTime);
  return Boolean(slot?.available);
}
