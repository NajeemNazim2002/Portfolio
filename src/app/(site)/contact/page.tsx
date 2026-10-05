import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact", description: "Send a message about your project." };

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-8 pt-12 sm:px-8 md:grid-cols-12 md:pt-16">
      <div className="md:col-span-5">
        <h1 className="text-5xl font-extrabold sm:text-7xl">Contact</h1>
        <p className="mt-6 max-w-sm text-lg text-mute">
          Describe your project, your deadline and your budget. I'll reply with next steps.
        </p>
        <a href={`mailto:${site.email}`} className="mt-6 inline-block text-lg font-medium underline decoration-2 underline-offset-4 hover:text-signal">
          {site.email}
        </a>
      </div>
      <div className="md:col-span-7">
        <ContactForm />
      </div>
    </div>
  );
}
