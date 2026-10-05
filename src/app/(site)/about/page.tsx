import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About", description: site.bio[0] };

export default function AboutPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-8 pt-12 sm:px-8 md:grid-cols-12 md:pt-16">
      <div className="md:col-span-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/profile.png"
          alt={`Portrait of ${site.name}`}
          width={1000}
          height={1500}
          className="aspect-[3/4] w-full max-w-md rounded-lg object-cover"
        />
      </div>
      <div className="md:col-span-7">
        <h1 className="text-5xl font-extrabold sm:text-7xl">About me</h1>
        <div className="mt-8 max-w-xl space-y-5 text-lg">
          {site.bio.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="mb-3 border-t-4 border-bloom pt-3 text-2xl font-bold">Design tools</h2>
            <ul className="space-y-1 text-mute">
              {site.tools.design.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 border-t-4 border-signal pt-3 text-2xl font-bold">Development stack</h2>
            <ul className="space-y-1 text-mute">
              {site.tools.development.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 border-t-4 border-bloom pt-3 text-2xl font-bold">Additional skills</h2>
            <ul className="space-y-1 text-mute">
              {site.tools.additional.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/contact" className="inline-block rounded-full bg-ink px-8 py-3.5 font-medium text-white hover:bg-signal">
            Work with me
          </Link>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-full border border-ink px-8 py-3.5 font-medium text-ink hover:bg-ink hover:text-white"
          >
            View my resume
          </a>
        </div>
      </div>
    </div>
  );
}
