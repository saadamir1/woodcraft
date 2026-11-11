"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function OrderStatusForm({
  orderId,
  status,
  paymentStatus,
}: {
  orderId: string;
  status: string;
  paymentStatus: string;
}) {
  const router = useRouter();
  const [s, setS] = useState(status);
  const [p, setP] = useState(paymentStatus);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, status: s, paymentStatus: p }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <select className="input min-h-10 py-1" value={s} onChange={(e) => setS(e.target.value)}>
        {["NEW", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "RETURNED", "CANCELLED"].map(
          (x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ),
        )}
      </select>
      <select className="input min-h-10 py-1" value={p} onChange={(e) => setP(e.target.value)}>
        {["PENDING", "AWAITING_PROOF", "PAID", "FAILED", "REFUNDED"].map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </select>
      <button type="button" className="btn btn-secondary text-sm" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
