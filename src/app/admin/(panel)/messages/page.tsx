import DeleteButton from "@/components/admin/DeleteButton";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } }).catch(() => []);

  return (
    <>
      <h1 className="mb-8 text-4xl font-extrabold">Messages</h1>
      {messages.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line p-10 text-center text-mute">No messages yet.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((m) => (
            <li key={m.id} className="rounded-lg border border-line bg-paper p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{m.name}</p>
                  <a href={`mailto:${m.email}`} className="text-signal underline underline-offset-4">
                    {m.email}
                  </a>
                </div>
                <time className="text-sm text-mute" dateTime={m.createdAt.toISOString()}>
                  {m.createdAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
                </time>
              </div>
              {m.subject && <p className="mt-3 font-medium">{m.subject}</p>}
              <p className="mt-2 whitespace-pre-line">{m.body}</p>
              <div className="mt-3 -ml-3">
                <DeleteButton endpoint={`/api/admin/messages/${m.id}`} confirmText="Delete this message?" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
