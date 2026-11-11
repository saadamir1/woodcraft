import { NextResponse } from "next/server";

/**
 * Phase 2 payment webhook stub.
 * Plug Safepay / PayFast here: verify signature, mark order PAID.
 * Never trust client redirects alone.
 */
export async function POST(req: Request) {
  const enabled = process.env.PAYMENT_GATEWAY_ENABLED === "true";
  if (!enabled) {
    return NextResponse.json(
      {
        ok: false,
        message: "Gateway not enabled. Use COD or manual transfer for now.",
      },
      { status: 501 },
    );
  }

  const raw = await req.text();
  const signature = req.headers.get("x-signature") ?? "";
  // Provider.verifyWebhook(raw, signature) — implement when merchant approved
  void raw;
  void signature;

  return NextResponse.json({
    ok: false,
    message: "Gateway provider not configured yet.",
  });
}
