import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { isAdmin, unauthorized } from "@/lib/admin";

// Gives the browser a signed, short-lived permission to upload straight to Cloudinary.
export async function POST() {
  if (!(await isAdmin())) return unauthorized();
  const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: secret } = process.env;
  if (!cloudName || !apiKey || !secret) {
    return NextResponse.json({ error: "Cloudinary isn't configured." }, { status: 500 });
  }
  const timestamp = Math.round(Date.now() / 1000);
  const folder = "portfolio";
  const signature = createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${secret}`).digest("hex");
  return NextResponse.json({ cloudName, apiKey, timestamp, folder, signature });
}
