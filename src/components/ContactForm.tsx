"use client";

import { useState } from "react";

const field =
  "w-full rounded-md border border-line bg-paper px-4 py-3 text-base outline-none focus:border-signal focus:ring-2 focus:ring-signal/30";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Couldn't send your message.");
      form.reset();
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send your message.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div role="status" className="rounded-lg border-2 border-signal bg-paper p-6">
        <p className="font-display text-2xl font-semibold">Message sent</p>
        <p className="mt-1 text-mute">Thanks for reaching out. I'll reply by email soon.</p>
        <button type="button" onClick={() => setState("idle")} className="mt-4 font-medium text-signal underline underline-offset-4">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Your name</span>
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Email</span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Subject (optional)</span>
        <input name="subject" className={field} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">How can I help?</span>
        <textarea name="message" required rows={6} className={field} />
      </label>
      {/* Honeypot: hidden from people, bots fill it in */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      {state === "error" && (
        <p role="alert" className="rounded-md bg-red-100 px-4 py-3 text-red-900">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="rounded-full bg-ink px-8 py-3.5 font-medium text-white transition-colors hover:bg-signal disabled:opacity-60"
      >
        {state === "sending" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
