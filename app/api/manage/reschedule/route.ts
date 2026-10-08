import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";
import { isSlotStillAvailable } from "@/lib/availability";
import {
  RESCHEDULE_FEE,
  MAX_RESCHEDULES_PER_BOOKING,
  addSessionMinutes,
  isWithinRescheduleWindow
} from "@/lib/policy";
import { initializeTransaction } from "@/lib/paystack";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const bookingId = body?.bookingId;
  const email = body?.email?.trim().toLowerCase();
  const newDateStr = body?.newDate;
  const newStartTime = body?.newStartTime;

  if (!bookingId || !email || !newDateStr || !newStartTime) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

  if (!booking || booking.customerEmail.toLowerCase() !== email) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (booking.status !== "CONFIRMED" || booking.paymentStatus !== "PAID") {
    return NextResponse.json(
      { error: "Only a confirmed, paid booking can be rescheduled." },
      { status: 400 }
    );
  }

  if (booking.rescheduleCount >= MAX_RESCHEDULES_PER_BOOKING) {
    return NextResponse.json(
      {
        error: `This booking has already been rescheduled ${MAX_RESCHEDULES_PER_BOOKING} times, the maximum allowed. Please contact us directly.`
      },
      { status: 400 }
    );
  }

  const newDate = new Date(newDateStr);
  if (Number.isNaN(newDate.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  if (!isWithinRescheduleWindow(booking.date, newDate)) {
    return NextResponse.json(
      { error: "New date must fall within 2 weeks of your original booking date." },
      { status: 400 }
    );
  }

  const stillAvailable = await isSlotStillAvailable(booking.hallId, newDate, newStartTime);
  if (!stillAvailable) {
    return NextResponse.json(
      { error: "That time is no longer available. Please pick another." },
      { status: 409 }
    );
  }

  const reference = `RESCH-${randomUUID().split("-")[0].toUpperCase()}`;

  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      pendingRescheduleDate: newDate,
      pendingRescheduleStartTime: newStartTime,
      pendingRescheduleReference: reference
    }
  });

  const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/manage/confirmation?reference=${reference}`;

  try {
    const payment = await initializeTransaction({
      email: booking.customerEmail,
      amountKobo: RESCHEDULE_FEE,
      reference,
      callbackUrl,
      metadata: {
        bookingId: booking.id,
        type: "reschedule",
        newDate: newDateStr,
        newStartTime,
        newEndTime: addSessionMinutes(newStartTime)
      }
    });

    return NextResponse.json({
      reference,
      authorizationUrl: payment.data.authorization_url
    });
  } catch (err) {
    // Clear the pending fields so a failed payment init doesn't lock the booking
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        pendingRescheduleDate: null,
        pendingRescheduleStartTime: null,
        pendingRescheduleReference: null
      }
    });
    console.error(err);
    return NextResponse.json(
      { error: "Could not start payment. Please try again." },
      { status: 502 }
    );
  }
}
