import { getStore } from "@netlify/blobs";

// Serves images uploaded to Netlify Blobs. Keys are random and never overwritten, so cache forever.
export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const blob = await getStore("project-images").getWithMetadata(key, { type: "arrayBuffer" });
  if (!blob) return new Response("Not found", { status: 404 });
  const type = (blob.metadata.contentType as string) || "application/octet-stream";
  return new Response(blob.data, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      ...(type === "image/svg+xml" ? { "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'" } : {}),
    },
  });
}
