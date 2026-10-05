import { NextResponse } from "next/server";
import { isAdmin, unauthorized } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;
  await prisma.message.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
