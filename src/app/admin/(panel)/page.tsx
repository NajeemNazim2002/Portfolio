import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";
import { prisma } from "@/lib/prisma";
import { categories } from "@/lib/categories";
import { cld } from "@/lib/image";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let projects: Awaited<ReturnType<typeof prisma.project.findMany>> = [];
  let dbError = false;
  try {
    projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  } catch (e) {
    console.error(e);
    dbError = true;
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-extrabold">Projects</h1>
        <Link href="/admin/new" className="rounded-full bg-ink px-6 py-3 font-medium text-white hover:bg-signal">
          Add project
        </Link>
      </div>

      {dbError && (
        <p role="alert" className="mb-6 rounded-md bg-red-100 px-4 py-3 text-red-900">
          Can't reach the database. Check DATABASE_URL and run <code>npm run db:push</code>.
        </p>
      )}

      {!dbError && projects.length === 0 && (
        <p className="rounded-lg border border-dashed border-line p-10 text-center text-mute">
          No projects yet. Choose "Add project" to upload your first one.
        </p>
      )}

      <ul className="divide-y divide-line rounded-lg border border-line bg-paper">
        {projects.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-4 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cld(p.coverImage, 200)} alt="" className="h-16 w-20 rounded-md bg-line object-cover" />
            <div className="min-w-0 flex-1 basis-48">
              <p className="truncate font-semibold">{p.title}</p>
              <p className="flex flex-wrap items-center gap-x-3 text-sm text-mute">
                <span className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${categories[p.category].dot}`} />
                  {categories[p.category].label}
                </span>
                {!p.published && <span className="font-medium text-red-700">Draft</span>}
                {p.featured && <span className="font-medium text-signal">Featured</span>}
              </p>
            </div>
            <div className="flex items-center">
              <Link href={`/work/${p.slug}`} target="_blank" className="rounded-md px-3 py-2 font-medium hover:bg-line/60">
                View
              </Link>
              <Link href={`/admin/${p.id}/edit`} className="rounded-md px-3 py-2 font-medium hover:bg-line/60">
                Edit
              </Link>
              <DeleteButton endpoint={`/api/admin/projects/${p.id}`} confirmText={`Delete "${p.title}"? This can't be undone.`} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
