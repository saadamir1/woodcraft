"use client";

import { useRouter } from "next/navigation";

export function MarkFollowedUp({ id }: { id: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className="btn btn-secondary text-sm"
      onClick={async () => {
        await fetch("/api/admin/abandoned", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        router.refresh();
      }}
    >
      Mark done
    </button>
  );
}
