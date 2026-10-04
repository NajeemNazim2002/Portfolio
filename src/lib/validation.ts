import { z } from "zod";

// A full link (Cloudinary) or an image stored on this site via Netlify Blobs.
const imageUrl = (message?: string) =>
  z.string().refine((v) => /^\/api\/images\/[\w.-]+$/.test(v) || z.string().url().safeParse(v).success, message);

const optionalUrl = z.string().trim().url("Enter a full link, starting with https://").or(z.literal("")).optional();

export const projectSchema = z.object({
  title: z.string().trim().min(2, "Add a title").max(120, "Keep the title under 120 characters"),
  category: z.enum(["GRAPHIC_DESIGN", "WEB_DEVELOPMENT"], { message: "Choose a category" }),
  summary: z.string().trim().min(10, "Write at least 10 characters").max(220, "Keep the summary under 220 characters"),
  description: z.string().trim().min(30, "Describe the project in at least 30 characters").max(10000),
  coverImage: imageUrl("Upload a cover image"),
  images: z.array(imageUrl()).max(20, "Up to 20 extra images").default([]),
  tags: z.array(z.string().trim().min(1).max(30)).max(15, "Up to 15 tags").default([]),
  liveUrl: optionalUrl,
  repoUrl: optionalUrl,
  client: z.string().trim().max(120).optional(),
  year: z.number().int().min(2000).max(2100).nullable().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export function toDb(d: ProjectInput) {
  return {
    title: d.title,
    category: d.category,
    summary: d.summary,
    description: d.description,
    coverImage: d.coverImage,
    images: d.images,
    tags: d.tags,
    liveUrl: d.liveUrl || null,
    repoUrl: d.repoUrl || null,
    client: d.client || null,
    year: d.year ?? null,
    featured: d.featured,
    published: d.published,
  };
}

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().email("Enter a valid email address").max(120),
  subject: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10, "Write at least 10 characters").max(4000),
  website: z.string().optional(), // honeypot
});
