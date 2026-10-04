import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getStore } from "@netlify/blobs";
import { isAdmin, unauthorized } from "@/lib/admin";

const MAX_BYTES = 5 * 1024 * 1024; // stays under Netlify's function request size limit

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

// Stores an uploaded image in Netlify Blobs. Used when Cloudinary isn't configured.
export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file received." }, { status: 400 });
  const ext = EXT[file.type];
  if (!ext) return NextResponse.json({ error: `${file.name} isn't a supported image type.` }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: `${file.name} is over 5 MB.` }, { status: 413 });

  const key = `${randomUUID()}.${ext}`;
  await getStore("project-images").set(key, await file.arrayBuffer(), { metadata: { contentType: file.type } });
  return NextResponse.json({ url: `/api/images/${key}` });
}
