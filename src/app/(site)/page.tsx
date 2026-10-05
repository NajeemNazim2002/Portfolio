import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/lib/data";
import { site } from "@/lib/site";
import { categories } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await getProjects({ take: 6, featuredFirst: true });

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-12 sm:px-8 md:grid-cols-12 md:pt-20">
        <div className="md:col-span-7">
          <p className="mb-5 text-lg text-mute">{site.role}</p>
          <h1 className="text-[clamp(3.25rem,10vw,8rem)] font-extrabold">
            I design it.
            <br />
            I build it.
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg text-mute">{site.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/work?category=${categories.GRAPHIC_DESIGN.slug}`}
              className={`rounded-full px-6 py-3.5 font-medium ${categories.GRAPHIC_DESIGN.fill} hover:brightness-95`}
            >
              See graphic design
            </Link>
            <Link
              href={`/work?category=${categories.WEB_DEVELOPMENT.slug}`}
              className={`rounded-full px-6 py-3.5 font-medium ${categories.WEB_DEVELOPMENT.fill} hover:brightness-110`}
            >
              See web projects
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm md:col-span-5 md:max-w-none">
          <div className="block-bloom absolute -left-4 -top-4 h-3/5 w-3/5 rounded-lg bg-bloom sm:-left-6 sm:-top-6" aria-hidden="true" />
          <div className="block-signal absolute -bottom-4 -right-4 h-3/5 w-3/5 rounded-lg bg-signal sm:-bottom-6 sm:-right-6" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/profile.png"
            alt={`Portrait of ${site.name}`}
            width={1000}
            height={1500}
            fetchPriority="high"
            className="relative aspect-[3/4] w-full rounded-lg object-cover"
          />
        </div>
      </section>

      {/* Selected work */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8" aria-labelledby="work-heading">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 id="work-heading" className="text-4xl font-bold sm:text-5xl">
            Selected work
          </h2>
          <Link href="/work" className="font-medium underline decoration-2 underline-offset-4 hover:text-signal">
            View all projects
          </Link>
        </div>
        {projects.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line p-10 text-center text-mute">
            No projects yet. Sign in at /admin to add your first one.
          </p>
        ) : (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </section>

      {/* What I do */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8" aria-labelledby="services-heading">
        <h2 id="services-heading" className="mb-10 text-4xl font-bold sm:text-5xl">
          What I do
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {(Object.keys(categories) as (keyof typeof categories)[]).map((key) => (
            <div key={key} className={`rounded-lg border-t-8 bg-paper p-7 ${categories[key].bar}`}>
              <h3 className="text-3xl font-bold">{categories[key].label}</h3>
              <ul className="mt-4 space-y-2 text-lg text-mute">
                {site.services[key].map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Contact call */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="rounded-2xl bg-ink px-6 py-14 text-center text-white sm:px-12">
          <h2 className="mx-auto max-w-2xl text-4xl font-bold sm:text-5xl">Have a project in mind?</h2>
          <p className="mx-auto mt-4 max-w-lg text-white/75">
            Tell me what you need and I'll reply with a plan and a timeline.
          </p>
          <Link href="/contact" className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 font-medium text-ink hover:bg-bloom">
            Contact me
          </Link>
        </div>
      </section>
    </>
  );
}
