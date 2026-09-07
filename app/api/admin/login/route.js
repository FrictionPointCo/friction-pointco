import { NextResponse } from "next/server";
import { checkPassword, createSessionToken, ADMIN_COOKIE_NAME, ADMIN_SESSION_MAX_AGE } from "@/lib/auth";

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!password || !checkPassword(password)) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    const token = await createSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE,
    });
    return response;
  } catch (err) {
    return NextResponse.json({ error: "Something went wrong. Check that ADMIN_PASSWORD and ADMIN_SESSION_SECRET are set." }, { status: 500 });
  }
}
