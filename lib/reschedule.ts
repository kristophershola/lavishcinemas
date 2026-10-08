import { prisma } from "./db";
import { addSessionMinutes } from "./policy";

// Called once a reschedule fee payment is confirmed, either from the
// Paystack webhook or the confirmation page's fallback verify check.
// Safe to call more than once for the same reference (idempotent).
export async function finalizeReschedule(reference: string) {
  const original = await prisma.booking.findFirst({
    where: { pendingRescheduleReference: reference }
  });

  if (!original) return null;

  // Already finalized on a previous call, just return the resulting booking.
  if (original.status === "RESCHEDULED") {
    return prisma.booking.findFirst({
      where: { rescheduledFromId: original.id },
      include: { hall: true, package: true }
    });
  }

  if (!original.pendingRescheduleDate || !original.pendingRescheduleStartTime) {
    return null;
  }

  const newStartTime = original.pendingRescheduleStartTime;
  const newEndTime = addSessionMinutes(newStartTime);
  const nextRescheduleCount = original.rescheduleCount + 1;

  const newBooking = await prisma.$transaction(async (tx) => {
    const created = await tx.booking.create({
      data: {
        reference: `LVH-R-${Date.now().toString(36).toUpperCase()}`,
        hallId: original.hallId,
        packageId: original.packageId,
        date: original.pendingRescheduleDate as Date,
        startTime: newStartTime,
        endTime: newEndTime,
        guestCount: original.guestCount,
        customerName: original.customerName,
        customerEmail: original.customerEmail,
        customerPhone: original.customerPhone,
        specialEventUpgrade: original.specialEventUpgrade,
        movieTitle: original.movieTitle,
        moviePosterUrl: original.moviePosterUrl,
        movieTmdbId: original.movieTmdbId,
        amount: original.amount,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        rescheduledFromId: original.id,
        // Carried forward so the two-reschedule cap applies to the booking's
        // whole lineage, not just however many times this one row was moved.
        rescheduleCount: nextRescheduleCount
      }
    });

    await tx.booking.update({
      where: { id: original.id },
      data: {
        status: "RESCHEDULED",
        rescheduleCount: nextRescheduleCount,
        pendingRescheduleDate: null,
        pendingRescheduleStartTime: null
      }
    });

    return created;
  });

  return prisma.booking.findUnique({
    where: { id: newBooking.id },
    include: { hall: true, package: true }
  });
}
