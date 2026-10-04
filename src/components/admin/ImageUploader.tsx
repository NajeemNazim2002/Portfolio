"use client";

import { useRef, useState } from "react";
import { cld } from "@/lib/image";

type Props = {
  label: string;
  hint?: string;
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  error?: string;
};

const MAX_MB = 10; // Cloudinary's free plan limit per image
const BLOBS_MAX_MB = 5; // limit when storing on Netlify Blobs (no Cloudinary)

async function uploadOne(file: File): Promise<string> {
  const sigRes = await fetch("/api/admin/upload-signature", { method: "POST" });
  if (!sigRes.ok) throw new Error(sigRes.status === 401 ? "Please sign in again." : "Couldn't start the upload.");
  const sig = await sigRes.json();

  if (sig.provider === "blobs") {
    if (file.size > BLOBS_MAX_MB * 1024 * 1024) throw new Error(`${file.name} is over ${BLOBS_MAX_MB} MB.`);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || `Upload failed for ${file.name}.`);
    return json.url as string;
  }

  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", sig.apiKey);
  fd.append("timestamp", String(sig.timestamp));
  fd.append("signature", sig.signature);
  fd.append("folder", sig.folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: "POST", body: fd });
  if (!res.ok) throw new Error(`Upload failed for ${file.name}.`);
  const json = await res.json();
  return json.secure_url as string;
}

export default function ImageUploader({ label, hint, value, onChange, multiple = false, error }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setMsg("");
    setBusy(true);
    const added: string[] = [];
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) throw new Error(`${file.name} isn't an image.`);
        if (file.size > MAX_MB * 1024 * 1024) throw new Error(`${file.name} is over ${MAX_MB} MB.`);
        added.push(await uploadOne(file));
      }
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Upload failed.");
    }
    if (added.length) onChange(multiple ? [...value, ...added] : [added[0]]);
    setBusy(false);
    if (input.current) input.current.value = "";
  }

  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium">{label}</legend>
      {hint && <p className="mb-2 text-sm text-mute">{hint}</p>}

      {value.length > 0 && (
        <ul className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {value.map((url) => (
            <li key={url} className="relative overflow-hidden rounded-md bg-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cld(url, 400)} alt="" className="aspect-square w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(value.filter((u) => u !== url))}
                className="absolute right-1.5 top-1.5 rounded-full bg-ink/85 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700"
                aria-label="Remove image"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => onFiles(e.target.files)}
        className="sr-only"
        id={`up-${label}`}
      />
      <label
        htmlFor={`up-${label}`}
        className={`inline-block cursor-pointer rounded-full border border-ink px-5 py-2.5 font-medium hover:bg-ink hover:text-white ${
          busy ? "pointer-events-none opacity-60" : ""
        }`}
      >
        {busy ? "Uploading..." : value.length && !multiple ? "Replace image" : multiple ? "Add images" : "Choose image"}
      </label>
      {(msg || error) && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {msg || error}
        </p>
      )}
    </fieldset>
  );
}
