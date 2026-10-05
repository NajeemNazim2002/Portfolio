import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg font-bold">{site.name}</p>
          <a href={`mailto:${site.email}`} className="text-mute hover:text-signal">
            {site.email}
          </a>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-signal">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-sm text-mute">
          &copy; {new Date().getFullYear()} {site.name}.{" "}
          <Link href="/admin" className="hover:text-ink" rel="nofollow">
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}
