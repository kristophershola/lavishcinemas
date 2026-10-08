import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const reference = body?.reference?.trim();
  const email = body?.email?.trim().toLowerCase();

  if (!reference || !email) {
    return NextResponse.json(
      { error: "Reference and email are required" },
      { status: 400 }
    );
  }

  const booking = await prisma.booking.findFirst({
    where: {
      reference: { equals: reference, mode: "insensitive" },
      customerEmail: { equals: email, mode: "insensitive" }
    },
    include: { hall: true, package: true }
  });

  if (!booking) {
    return NextResponse.json(
      { error: "No booking found with that reference and email." },
      { status: 404 }
    );
  }

  return NextResponse.json({ booking });
}
