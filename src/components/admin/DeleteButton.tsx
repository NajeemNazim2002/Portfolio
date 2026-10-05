"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ endpoint, confirmText }: { endpoint: string; confirmText: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        if (!window.confirm(confirmText)) return;
        setBusy(true);
        const res = await fetch(endpoint, { method: "DELETE" });
        if (!res.ok) {
          window.alert("Couldn't delete. Please try again.");
          setBusy(false);
          return;
        }
        router.refresh();
      }}
      className="rounded-md px-3 py-2 font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
    >
      {busy ? "Deleting..." : "Delete"}
    </button>
  );
}
