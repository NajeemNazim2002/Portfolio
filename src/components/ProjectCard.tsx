import Link from "next/link";
import type { Project } from "@prisma/client";
import { categories } from "@/lib/categories";
import { cld, srcSet } from "@/lib/image";

export default function ProjectCard({ project }: { project: Project }) {
  const c = categories[project.category];
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <div className="aspect-[4/3] overflow-hidden rounded-lg bg-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cld(project.coverImage, 800)}
          srcSet={srcSet(project.coverImage)}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          alt={`${project.title} cover`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 text-sm text-mute">
        <span className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} aria-hidden="true" />
          {c.label}
        </span>
        {project.year && <span>{project.year}</span>}
      </div>
      <h3 className="mt-1 text-2xl font-semibold group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
        {project.title}
      </h3>
      <p className="mt-1 line-clamp-2 text-mute">{project.summary}</p>
    </Link>
  );
}
