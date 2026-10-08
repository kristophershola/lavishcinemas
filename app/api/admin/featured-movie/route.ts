import { NextRequest, NextResponse } from "next/server";
import { setFeaturedMovieTmdbId } from "@/lib/settings";

// This route sits under /api/admin/*, already protected by middleware.ts
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const tmdbId = body?.tmdbId;

  if (tmdbId !== null && typeof tmdbId !== "number") {
    return NextResponse.json({ error: "tmdbId must be a number or null" }, { status: 400 });
  }

  await setFeaturedMovieTmdbId(tmdbId);
  return NextResponse.json({ ok: true });
}
