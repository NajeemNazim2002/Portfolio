import ProjectForm, { emptyProject } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <>
      <h1 className="mb-8 text-4xl font-extrabold">New project</h1>
      <ProjectForm initial={emptyProject} />
    </>
  );
}
