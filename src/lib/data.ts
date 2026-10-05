import { prisma } from "./prisma";
import type { CategoryKey } from "./categories";

// Public pages use these helpers. If the database isn't connected yet,
// the site still renders (empty) instead of crashing.
export async function getProjects(opts: { category?: CategoryKey; take?: number; featuredFirst?: boolean } = {}) {
  try {
    return await prisma.project.findMany({
      where: { published: true, ...(opts.category ? { category: opts.category } : {}) },
      orderBy: opts.featuredFirst ? [{ featured: "desc" }, { createdAt: "desc" }] : [{ createdAt: "desc" }],
      take: opts.take,
    });
  } catch (e) {
    console.error("getProjects failed:", e);
    return [];
  }
}

export async function getProject(slug: string) {
  try {
    return await prisma.project.findFirst({ where: { slug, published: true } });
  } catch (e) {
    console.error("getProject failed:", e);
    return null;
  }
}
