import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = String(body.name ?? "").slice(0, 40);
  if (!name) return NextResponse.json({ ok: false }, { status: 400 });

  await prisma.analyticsEvent.create({
    data: {
      name,
      path: body.path ? String(body.path).slice(0, 200) : null,
      productId: body.productId ? String(body.productId) : null,
      orderId: body.orderId ? String(body.orderId) : null,
      sessionId: body.sessionId ? String(body.sessionId).slice(0, 80) : null,
      utmSource: body.utmSource ? String(body.utmSource).slice(0, 80) : null,
      utmCampaign: body.utmCampaign ? String(body.utmCampaign).slice(0, 80) : null,
      meta: body.meta ? JSON.stringify(body.meta).slice(0, 2000) : null,
    },
  });

  return NextResponse.json({ ok: true });
}
