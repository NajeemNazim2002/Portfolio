import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-5 py-3 sm:px-8">
          <nav aria-label="Admin" className="flex flex-wrap items-center gap-1">
            <Link href="/admin" className="rounded-md px-3 py-2 font-medium hover:bg-line/60">
              Projects
            </Link>
            <Link href="/admin/new" className="rounded-md px-3 py-2 font-medium hover:bg-line/60">
              New project
            </Link>
            <Link href="/admin/messages" className="rounded-md px-3 py-2 font-medium hover:bg-line/60">
              Messages
            </Link>
            <Link href="/" target="_blank" className="rounded-md px-3 py-2 font-medium text-mute hover:bg-line/60">
              View site
            </Link>
          </nav>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">{children}</main>
    </>
  );
}
