import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyTransaction } from "@/lib/paystack";

// Fallback check the confirmation page calls in case the webhook hasn't
// landed yet. Safe to call repeatedly, it just re-reads Paystack's record.
export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ error: "reference is required" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { reference },
    include: { hall: true }
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (booking.paymentStatus === "PAID") {
    return NextResponse.json({ booking });
  }

  const result = await verifyTransaction(reference);

  if (result.data.status === "success") {
    const updated = await prisma.booking.update({
      where: { reference },
      data: { status: "CONFIRMED", paymentStatus: "PAID" },
      include: { hall: true }
    });
    return NextResponse.json({ booking: updated });
  }

  if (result.data.status === "failed" || result.data.status === "abandoned") {
    await prisma.booking.update({
      where: { reference },
      data: { paymentStatus: "FAILED" }
    });
  }

  return NextResponse.json({ booking });
}
