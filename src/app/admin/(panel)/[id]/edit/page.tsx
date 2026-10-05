import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await prisma.project.findUnique({ where: { id } }).catch(() => null);
  if (!p) notFound();

  return (
    <>
      <h1 className="mb-8 text-4xl font-extrabold">Edit project</h1>
      <ProjectForm
        initial={{
          id: p.id,
          title: p.title,
          category: p.category,
          summary: p.summary,
          description: p.description,
          coverImage: p.coverImage,
          images: p.images,
          tags: p.tags.join(", "),
          liveUrl: p.liveUrl ?? "",
          repoUrl: p.repoUrl ?? "",
          client: p.client ?? "",
          year: p.year ? String(p.year) : "",
          featured: p.featured,
          published: p.published,
        }}
      />
    </>
  );
}
