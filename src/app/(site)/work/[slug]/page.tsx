import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/data";
import { categories } from "@/lib/categories";
import { cld, srcSet } from "@/lib/image";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return { title: "Project not found" };
  return {
    title: p.title,
    description: p.summary,
    openGraph: { title: p.title, description: p.summary, images: [cld(p.coverImage, 1200)] },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) notFound();
  const c = categories[p.category];

  return (
    <article className="mx-auto max-w-5xl px-5 pb-8 pt-10 sm:px-8 md:pt-14">
      <Link href="/work" className="font-medium text-mute hover:text-ink">
        &larr; All work
      </Link>

      <header className="mt-6">
        <p className="flex items-center gap-2 text-mute">
          <span className={`h-3 w-3 rounded-full ${c.dot}`} aria-hidden="true" />
          {c.label}
        </p>
        <h1 className="mt-2 text-5xl font-extrabold sm:text-7xl">{p.title}</h1>
        <p className="mt-5 max-w-2xl text-xl text-mute">{p.summary}</p>

        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-y border-line py-5">
          {p.client && (
            <div>
              <dt className="text-sm text-mute">Client</dt>
              <dd className="font-medium">{p.client}</dd>
            </div>
          )}
          {p.year && (
            <div>
              <dt className="text-sm text-mute">Year</dt>
              <dd className="font-medium">{p.year}</dd>
            </div>
          )}
          {p.tags.length > 0 && (
            <div>
              <dt className="text-sm text-mute">Tools and skills</dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full bg-paper px-3 py-1 text-sm font-medium">
                    {t}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>

        {(p.liveUrl || p.repoUrl) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {p.liveUrl && (
              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className={`rounded-full px-6 py-3 font-medium ${c.fill}`}>
                Visit live site
              </a>
            )}
            {p.repoUrl && (
              <a
                href={p.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-ink px-6 py-3 font-medium hover:bg-ink hover:text-white"
              >
                View source code
              </a>
            )}
          </div>
        )}
      </header>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cld(p.coverImage, 1600)}
        srcSet={srcSet(p.coverImage)}
        sizes="(min-width: 1024px) 960px, 100vw"
        alt={`${p.title} cover`}
        className="mt-10 w-full rounded-lg"
      />

      <section className="mt-12 max-w-2xl" aria-label="About this project">
        <h2 className="mb-4 text-3xl font-bold">About this project</h2>
        <div className="space-y-4 whitespace-pre-line text-lg leading-relaxed">{p.description}</div>
      </section>

      {p.images.length > 0 && (
        <section className="mt-14 space-y-6" aria-label="Project gallery">
          {p.images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={cld(src, 1600)}
              srcSet={srcSet(src)}
              sizes="(min-width: 1024px) 960px, 100vw"
              alt={`${p.title} image ${i + 1}`}
              loading="lazy"
              className="w-full rounded-lg"
            />
          ))}
        </section>
      )}
    </article>
  );
}
