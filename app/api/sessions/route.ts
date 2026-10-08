import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/availability";

// GET /api/sessions?hallId=xxx&date=2026-08-20
export async function GET(req: NextRequest) {
  const hallId = req.nextUrl.searchParams.get("hallId");
  const dateStr = req.nextUrl.searchParams.get("date");

  if (!hallId || !dateStr) {
    return NextResponse.json(
      { error: "hallId and date are required" },
      { status: 400 }
    );
  }

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const slots = await getAvailableSlots(hallId, date);
  return NextResponse.json({ slots });
}
