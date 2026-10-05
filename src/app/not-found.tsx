import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-start justify-center gap-4 px-6">
      <h1 className="text-5xl font-bold">Page not found</h1>
      <p className="text-mute">The page you're looking for has moved or doesn't exist.</p>
      <Link href="/" className="rounded-full bg-ink px-6 py-3 font-medium text-white">
        Back to home
      </Link>
    </main>
  );
}
