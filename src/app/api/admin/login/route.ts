import { NextResponse } from "next/server";
import { safeEqual } from "@/lib/admin";
import { COOKIE, SESSION_SECONDS, createSession } from "@/lib/session";

export async function POST(req: Request) {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_SECRET } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !AUTH_SECRET) {
    return NextResponse.json(
      { error: "Admin login isn't set up. Add ADMIN_EMAIL, ADMIN_PASSWORD and AUTH_SECRET to your environment." },
      { status: 500 }
    );
  }
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  const okEmail = safeEqual(email, ADMIN_EMAIL.trim().toLowerCase());
  const okPass = safeEqual(password, ADMIN_PASSWORD);
  if (!(okEmail && okPass)) {
    await new Promise((r) => setTimeout(r, 700)); // slows down password guessing
    return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await createSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return res;
}
