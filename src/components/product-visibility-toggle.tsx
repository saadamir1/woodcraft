"use client";

import { useRouter } from "next/navigation";

export function ProductVisibilityToggle({
  productId,
  visible,
}: {
  productId: string;
  visible: boolean;
}) {
  const router = useRouter();
  async function toggle() {
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: productId, visible: !visible }),
    });
    router.refresh();
  }
  return (
    <button type="button" className="btn btn-ghost text-sm" onClick={toggle}>
      {visible ? "Visible" : "Hidden"}
    </button>
  );
}
