import { NextResponse } from "next/server";
import { isAdmin, unauthorized } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { projectSchema, toDb } from "@/lib/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;
  const parsed = projectSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please fix the fields marked below.", fields: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const exists = await prisma.project.findUnique({ where: { id }, select: { id: true } });
  if (!exists) return NextResponse.json({ error: "Project not found." }, { status: 404 });
  await prisma.project.update({ where: { id }, data: toDb(parsed.data) });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return unauthorized();
  const { id } = await params;
  await prisma.project.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
