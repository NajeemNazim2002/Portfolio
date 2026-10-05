"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ImageUploader from "./ImageUploader";

export type ProjectFormValues = {
  id?: string;
  title: string;
  category: "GRAPHIC_DESIGN" | "WEB_DEVELOPMENT" | "";
  summary: string;
  description: string;
  coverImage: string;
  images: string[];
  tags: string;
  liveUrl: string;
  repoUrl: string;
  client: string;
  year: string;
  featured: boolean;
  published: boolean;
};

export const emptyProject: ProjectFormValues = {
  title: "",
  category: "",
  summary: "",
  description: "",
  coverImage: "",
  images: [],
  tags: "",
  liveUrl: "",
  repoUrl: "",
  client: "",
  year: String(new Date().getFullYear()),
  featured: false,
  published: true,
};

const field =
  "w-full rounded-md border border-line bg-paper px-4 py-3 text-base outline-none focus:border-signal focus:ring-2 focus:ring-signal/30";

export default function ProjectForm({ initial }: { initial: ProjectFormValues }) {
  const router = useRouter();
  const [v, setV] = useState<ProjectFormValues>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const editing = Boolean(initial.id);

  const set = <K extends keyof ProjectFormValues>(k: K, val: ProjectFormValues[K]) => setV((s) => ({ ...s, [k]: val }));
  const err = (k: string) => errors[k]?.[0];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setErrors({});

    const payload = {
      title: v.title,
      category: v.category || undefined,
      summary: v.summary,
      description: v.description,
      coverImage: v.coverImage,
      images: v.images,
      tags: v.tags.split(",").map((t) => t.trim()).filter(Boolean),
      liveUrl: v.liveUrl.trim(),
      repoUrl: v.repoUrl.trim(),
      client: v.client.trim(),
      year: v.year.trim() ? Number(v.year) : null,
      featured: v.featured,
      published: v.published,
    };

    try {
      const res = await fetch(editing ? `/api/admin/projects/${initial.id}` : "/api/admin/projects", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "Couldn't save the project.");
        setErrors(json.fields ?? {});
        setBusy(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-7" noValidate>
      {error && (
        <p role="alert" className="rounded-md bg-red-100 px-4 py-3 text-red-900">
          {error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium">Title</span>
          <input value={v.title} onChange={(e) => set("title", e.target.value)} className={field} />
          {err("title") && <span className="mt-1 block text-sm text-red-700">{err("title")}</span>}
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Category</span>
          <select value={v.category} onChange={(e) => set("category", e.target.value as ProjectFormValues["category"])} className={field}>
            <option value="">Choose a category</option>
            <option value="GRAPHIC_DESIGN">Graphic design</option>
            <option value="WEB_DEVELOPMENT">Web development</option>
          </select>
          {err("category") && <span className="mt-1 block text-sm text-red-700">{err("category")}</span>}
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Year</span>
          <input inputMode="numeric" value={v.year} onChange={(e) => set("year", e.target.value)} className={field} />
          {err("year") && <span className="mt-1 block text-sm text-red-700">{err("year")}</span>}
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium">Short summary</span>
          <span className="mb-1.5 block text-sm text-mute">One or two sentences shown on project cards ({v.summary.length}/220).</span>
          <input value={v.summary} onChange={(e) => set("summary", e.target.value)} maxLength={220} className={field} />
          {err("summary") && <span className="mt-1 block text-sm text-red-700">{err("summary")}</span>}
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium">Full description</span>
          <span className="mb-1.5 block text-sm text-mute">
            Explain the goal, what you did, the tools you used and the result. Blank lines make new paragraphs.
          </span>
          <textarea value={v.description} onChange={(e) => set("description", e.target.value)} rows={10} className={field} />
          {err("description") && <span className="mt-1 block text-sm text-red-700">{err("description")}</span>}
        </label>
      </div>

      <ImageUploader
        label="Cover image"
        hint="Shown on cards and at the top of the project page."
        value={v.coverImage ? [v.coverImage] : []}
        onChange={(urls) => set("coverImage", urls[0] ?? "")}
        error={err("coverImage")}
      />

      <ImageUploader
        label="Gallery images"
        hint="Optional. Shown in order below the description."
        value={v.images}
        onChange={(urls) => set("images", urls)}
        multiple
        error={err("images")}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium">Tools and skills</span>
          <span className="mb-1.5 block text-sm text-mute">Separate with commas, for example: Next.js, Tailwind CSS, Figma.</span>
          <input value={v.tags} onChange={(e) => set("tags", e.target.value)} className={field} />
          {err("tags") && <span className="mt-1 block text-sm text-red-700">{err("tags")}</span>}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Live link (optional)</span>
          <input type="url" value={v.liveUrl} onChange={(e) => set("liveUrl", e.target.value)} placeholder="https://" className={field} />
          {err("liveUrl") && <span className="mt-1 block text-sm text-red-700">{err("liveUrl")}</span>}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Source code link (optional)</span>
          <input type="url" value={v.repoUrl} onChange={(e) => set("repoUrl", e.target.value)} placeholder="https://" className={field} />
          {err("repoUrl") && <span className="mt-1 block text-sm text-red-700">{err("repoUrl")}</span>}
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-sm font-medium">Client (optional)</span>
          <input value={v.client} onChange={(e) => set("client", e.target.value)} className={field} />
        </label>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={v.published} onChange={(e) => set("published", e.target.checked)} className="h-5 w-5 accent-signal" />
          <span>Published (visible on the website)</span>
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={v.featured} onChange={(e) => set("featured", e.target.checked)} className="h-5 w-5 accent-signal" />
          <span>Featured (shown first on the home page)</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={busy}
        className="rounded-full bg-ink px-8 py-3.5 font-medium text-white hover:bg-signal disabled:opacity-60"
      >
        {busy ? "Saving..." : editing ? "Save changes" : "Publish project"}
      </button>
    </form>
  );
}
