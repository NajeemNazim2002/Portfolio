import { NextResponse } from "next/server";
import { isAdmin, unauthorized } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/lib/slug";
import { projectSchema, toDb } from "@/lib/validation";

export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();
  const parsed = projectSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please fix the fields marked below.", fields: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const slug = await uniqueSlug(parsed.data.title);
  const project = await prisma.project.create({ data: { slug, ...toDb(parsed.data) } });
  return NextResponse.json({ ok: true, id: project.id, slug: project.slug }, { status: 201 });
}
