import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";
import { isSlotStillAvailable } from "@/lib/availability";
import {
  MIN_GUESTS,
  MAX_GUESTS,
  SPECIAL_EVENT_UPGRADE_FEE,
  addSessionMinutes
} from "@/lib/policy";
import { initializeTransaction } from "@/lib/paystack";

const bookingSchema = z.object({
  hallId: z.string().min(1),
  packageId: z.string().min(1),
  date: z.string(), // ISO date
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  guestCount: z.number().int().min(MIN_GUESTS).max(MAX_GUESTS),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(7),
  specialEventUpgrade: z.boolean().default(false),
  movieTitle: z.string().nullable().optional(),
  moviePosterUrl: z.string().nullable().optional(),
  movieTmdbId: z.number().nullable().optional()
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid booking details", issues: parsed.data },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const date = new Date(data.date);

  const hall = await prisma.hall.findUnique({ where: { id: data.hallId } });
  if (!hall || !hall.isActive) {
    return NextResponse.json({ error: "Hall not found" }, { status: 404 });
  }

  const pkg = await prisma.package.findUnique({ where: { id: data.packageId } });
  if (!pkg || !pkg.isActive) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  const stillAvailable = await isSlotStillAvailable(data.hallId, date, data.startTime);
  if (!stillAvailable) {
    return NextResponse.json(
      { error: "That time slot was just taken. Please pick another." },
      { status: 409 }
    );
  }

  const amount = pkg.price + (data.specialEventUpgrade ? SPECIAL_EVENT_UPGRADE_FEE : 0);

  const reference = `LVH-${randomUUID().split("-")[0].toUpperCase()}`;

  const booking = await prisma.booking.create({
    data: {
      reference,
      hallId: hall.id,
      packageId: pkg.id,
      date,
      startTime: data.startTime,
      endTime: addSessionMinutes(data.startTime),
      guestCount: data.guestCount,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      specialEventUpgrade: data.specialEventUpgrade,
      movieTitle: data.movieTitle || null,
      moviePosterUrl: data.moviePosterUrl || null,
      movieTmdbId: data.movieTmdbId || null,
      amount,
      status: "PENDING",
      paymentStatus: "UNPAID"
    }
  });

  const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/book/confirmation?reference=${reference}`;

  try {
    const payment = await initializeTransaction({
      email: data.customerEmail,
      amountKobo: amount,
      reference,
      callbackUrl,
      metadata: { bookingId: booking.id, hallName: hall.name, packageName: pkg.name }
    });

    return NextResponse.json({
      bookingId: booking.id,
      reference,
      authorizationUrl: payment.data.authorization_url
    });
  } catch (err) {
    // Roll back the pending booking if Paystack init fails, so the slot
    // isn't held against a payment that never started.
    await prisma.booking.delete({ where: { id: booking.id } });
    console.error(err);
    return NextResponse.json(
      { error: "Could not start payment. Please try again." },
      { status: 502 }
    );
  }
}
