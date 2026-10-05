import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";

// Best-effort rate limit (per server instance): 5 messages per 10 minutes per IP.
const hits = new Map<string, number[]>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= 5) {
    return NextResponse.json({ error: "Too many messages. Please try again in a few minutes." }, { status: 429 });
  }

  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check the form and try again." }, { status: 400 });
  }
  if (parsed.data.website) return NextResponse.json({ ok: true }); // bots fill the hidden field

  hits.set(ip, [...recent, now]);
  try {
    await prisma.message.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject || null,
        body: parsed.data.message,
      },
    });
  } catch (e) {
    console.error("contact failed:", e);
    return NextResponse.json({ error: "Couldn't send your message. Please email me directly." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
