// Server-only admin helpers.
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { COOKIE, verifySession } from "./session";

export async function isAdmin() {
  const jar = await cookies();
  return verifySession(jar.get(COOKIE)?.value);
}

export function unauthorized() {
  return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
}

export function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}
