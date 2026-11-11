import { createHash } from "crypto";

function sha256(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/** Meta Conversions API — server-side Purchase with event_id for dedup vs Pixel. */
export async function sendCapiPurchase(input: {
  orderNumber: string;
  totalPkr: number;
  phone: string;
  eventId: string;
}) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !token) return { skipped: true };

  const phone = input.phone.replace(/\D/g, "");
  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: "website",
        user_data: {
          ph: [sha256(phone.startsWith("0") ? `92${phone.slice(1)}` : phone)],
        },
        custom_data: {
          currency: "PKR",
          value: input.totalPkr,
          order_id: input.orderNumber,
        },
      },
    ],
  };

  const url = `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${token}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return { ok: res.ok, status: res.status };
}
