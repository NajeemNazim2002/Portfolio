// Edge-safe session helpers (used by middleware and server code).
import { SignJWT, jwtVerify } from "jose";

export const COOKIE = "admin_session";
export const SESSION_SECONDS = 60 * 60 * 24 * 7;

const key = () => new TextEncoder().encode(process.env.AUTH_SECRET ?? "");

export async function createSession() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_SECONDS}s`)
    .sign(key());
}

export async function verifySession(token?: string) {
  if (!token || !process.env.AUTH_SECRET) return false;
  try {
    await jwtVerify(token, key());
    return true;
  } catch {
    return false;
  }
}
