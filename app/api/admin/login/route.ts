import { NextRequest, NextResponse } from "next/server";
import {
  checkPassword,
  getExpectedSessionValue,
  COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS
} from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const password = body?.password ?? "";

  const valid = await checkPassword(password);
  if (!valid) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const sessionValue = await getExpectedSessionValue();
  if (!sessionValue) {
    return NextResponse.json(
      { error: "Server is not configured with ADMIN_PASSWORD" },
      { status: 500 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS
  });
  return res;
}
