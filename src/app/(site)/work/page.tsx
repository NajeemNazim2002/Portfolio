import type { Metadata } from "next";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/lib/data";
import { categories, categoryFromSlug } from "@/lib/categories";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Work", description: "Graphic design and web development projects." };

export default async function WorkPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category: slug } = await searchParams;
  const active = categoryFromSlug(slug);
  const projects = await getProjects({ category: active });

  const tabs = [
    { href: "/work", label: "All work", on: !active },
    ...(Object.keys(categories) as (keyof typeof categories)[]).map((k) => ({
      href: `/work?category=${categories[k].slug}`,
      label: categories[k].label,
      on: active === k,
    })),
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-12 sm:px-8 md:pt-16">
      <h1 className="text-5xl font-extrabold sm:text-7xl">Work</h1>
      <nav aria-label="Filter projects" className="mt-8 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            aria-current={t.on ? "page" : undefined}
            className={`rounded-full border px-5 py-2.5 font-medium ${
              t.on ? "border-ink bg-ink text-white" : "border-line bg-paper hover:border-ink"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {projects.length === 0 ? (
        <p className="mt-12 rounded-lg border border-dashed border-line p-10 text-center text-mute">
          No projects in this category yet.
        </p>
      ) : (
        <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
