"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const keys = [
  "brandName",
  "whatsappNumber",
  "announcement",
  "freeDeliveryThresholdPkr",
  "defaultDeliveryFeePkr",
  "jazzcashNumber",
  "easypaisaNumber",
  "bankDetails",
  "chatbotEnabled",
  "codEnabled",
  "manualTransferEnabled",
  "gatewayEnabled",
] as const;

export function SettingsForm({ initial }: { initial: Record<string, string> }) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>(() => {
    const o: Record<string, string> = {};
    for (const k of keys) o[k] = initial[k] ?? "";
    return o;
  });
  const [msg, setMsg] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setMsg(res.ok ? "Saved" : "Failed");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="card p-4 space-y-3">
      {keys.map((k) => (
        <div key={k}>
          <label className="label">{k}</label>
          <input
            className="input"
            value={form[k]}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
          />
        </div>
      ))}
      <button className="btn btn-primary">Save settings</button>
      {msg ? <p className="text-sm text-sage-deep">{msg}</p> : null}
    </form>
  );
}
