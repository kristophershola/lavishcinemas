import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { finalizeReschedule } from "@/lib/reschedule";

// Paystack calls this after every transaction event. Verifying the
// signature stops anyone from faking a "successful payment" call.
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!secret) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const expected = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  if (signature !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const reference = event.data.reference as string;

    const bookingUpdate = await prisma.booking.updateMany({
      where: { reference },
      data: { status: "CONFIRMED", paymentStatus: "PAID" }
    });

    // Not a new booking reference, so check if it's a reschedule fee instead.
    if (bookingUpdate.count === 0) {
      await finalizeReschedule(reference);
    }
  }

  return NextResponse.json({ received: true });
}
