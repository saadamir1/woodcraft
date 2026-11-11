"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { formatPkr } from "@/lib/utils";
import { trackPixel } from "@/components/meta-pixel";

type Settings = {
  freeDeliveryThresholdPkr: number;
  defaultDeliveryFeePkr: number;
  jazzcashNumber: string;
  easypaisaNumber: string;
  bankDetails: string;
  codEnabled: boolean;
  manualTransferEnabled: boolean;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    city: "",
    address: "",
    note: "",
    paymentMethod: "COD" as "COD" | "JAZZCASH" | "EASYPAISA" | "BANK",
    paymentRef: "",
    discountCode: "",
    website: "",
  });

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 150);
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {});
    trackPixel("InitiateCheckout", {
      value: subtotal(),
      currency: "PKR",
      num_items: items.length,
    });
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "InitiateCheckout", path: "/checkout" }),
    }).catch(() => {});
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totals = useMemo(() => {
    const sub = items.reduce((n, i) => n + i.pricePkr * i.qty, 0);
    const threshold = settings?.freeDeliveryThresholdPkr ?? 7000;
    const feeBase = settings?.defaultDeliveryFeePkr ?? 250;
    const delivery = sub >= threshold ? 0 : feeBase;
    return { sub, delivery, total: sub + delivery };
  }, [items, settings]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!items.length) return;
    setLoading(true);
    setError("");
    const utmSource =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("utm_source") ??
          sessionStorage.getItem("utm_source") ??
          undefined
        : undefined;
    const utmCampaign =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("utm_campaign") ??
          sessionStorage.getItem("utm_campaign") ??
          undefined
        : undefined;

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
          utmSource,
          utmCampaign,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Checkout failed");
        setLoading(false);
        return;
      }
      trackPixel("Purchase", {
        value: data.order.totalPkr,
        currency: "PKR",
        order_id: data.order.orderNumber,
      });
      clear();
      router.push(
        `/order/success?n=${encodeURIComponent(data.order.orderNumber)}&p=${encodeURIComponent(data.order.phone)}`,
      );
    } catch {
      setError("Network error. Try again.");
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-muted">
        Loading cart…
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-display text-3xl text-walnut">Cart is empty</h1>
        <a href="/shop" className="btn btn-primary mt-6 inline-flex">
          Continue shopping
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
      <form onSubmit={onSubmit} className="space-y-4">
        <h1 className="font-display text-4xl text-walnut">Checkout</h1>
        <p className="text-sm text-muted">Guest checkout · no account needed</p>

        <div>
          <label className="label" htmlFor="customerName">
            Full name
          </label>
          <input
            id="customerName"
            className="input"
            required
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            autoComplete="name"
          />
        </div>
        <div>
          <label className="label" htmlFor="phone">
            Mobile (03XXXXXXXXX)
          </label>
          <input
            id="phone"
            className="input"
            required
            inputMode="tel"
            placeholder="03XXXXXXXXX"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            autoComplete="tel"
          />
        </div>
        <div>
          <label className="label" htmlFor="city">
            City
          </label>
          <input
            id="city"
            className="input"
            required
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            autoComplete="address-level2"
          />
        </div>
        <div>
          <label className="label" htmlFor="address">
            Full address
          </label>
          <textarea
            id="address"
            className="input min-h-[96px]"
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            autoComplete="street-address"
          />
        </div>
        <div>
          <label className="label">Note (optional)</label>
          <input
            className="input"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </div>

        {/* honeypot */}
        <input
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          aria-hidden
        />

        <fieldset className="card p-4 space-y-3">
          <legend className="font-semibold text-walnut px-1">Payment</legend>
          {settings?.codEnabled !== false ? (
            <label className="flex gap-2 items-start text-sm">
              <input
                type="radio"
                name="pay"
                checked={form.paymentMethod === "COD"}
                onChange={() => setForm({ ...form, paymentMethod: "COD" })}
              />
              <span>
                <strong>Cash on Delivery</strong>
                <br />
                <span className="text-muted">Pay when the parcel arrives</span>
              </span>
            </label>
          ) : null}
          {settings?.manualTransferEnabled !== false ? (
            <>
              <label className="flex gap-2 items-start text-sm">
                <input
                  type="radio"
                  name="pay"
                  checked={form.paymentMethod === "JAZZCASH"}
                  onChange={() => setForm({ ...form, paymentMethod: "JAZZCASH" })}
                />
                <span>
                  <strong>JazzCash</strong> · {settings?.jazzcashNumber}
                </span>
              </label>
              <label className="flex gap-2 items-start text-sm">
                <input
                  type="radio"
                  name="pay"
                  checked={form.paymentMethod === "EASYPAISA"}
                  onChange={() => setForm({ ...form, paymentMethod: "EASYPAISA" })}
                />
                <span>
                  <strong>Easypaisa</strong> · {settings?.easypaisaNumber}
                </span>
              </label>
              <label className="flex gap-2 items-start text-sm">
                <input
                  type="radio"
                  name="pay"
                  checked={form.paymentMethod === "BANK"}
                  onChange={() => setForm({ ...form, paymentMethod: "BANK" })}
                />
                <span>
                  <strong>Bank transfer</strong>
                  <br />
                  <span className="text-muted">{settings?.bankDetails}</span>
                </span>
              </label>
            </>
          ) : null}
          {form.paymentMethod !== "COD" ? (
            <div>
              <label className="label">TID / reference (optional now)</label>
              <input
                className="input"
                value={form.paymentRef}
                onChange={(e) => setForm({ ...form, paymentRef: e.target.value })}
                placeholder="Transaction ID"
              />
            </div>
          ) : null}
        </fieldset>

        <div>
          <label className="label">Discount code</label>
          <input
            className="input"
            value={form.discountCode}
            onChange={(e) => setForm({ ...form, discountCode: e.target.value })}
            placeholder="WELCOME10"
          />
        </div>

        {error ? <p className="text-sm text-danger">{error}</p> : null}

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Placing order…" : `Place order · ${formatPkr(totals.total)}`}
        </button>
      </form>

      <aside className="card p-5 h-fit space-y-3 sticky top-20">
        <h2 className="font-display text-2xl text-walnut">Order summary</h2>
        {items.map((i) => (
          <div key={i.productId} className="flex justify-between text-sm gap-3">
            <span className="truncate">
              {i.name} × {i.qty}
            </span>
            <span className="shrink-0">{formatPkr(i.pricePkr * i.qty)}</span>
          </div>
        ))}
        <div className="border-t border-border pt-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPkr(totals.sub)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{totals.delivery === 0 ? "Free" : formatPkr(totals.delivery)}</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-1">
            <span>Total</span>
            <span>{formatPkr(totals.total)}</span>
          </div>
          {settings ? (
            <p className="text-xs text-muted pt-2">
              Free delivery over {formatPkr(settings.freeDeliveryThresholdPkr)}
            </p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
