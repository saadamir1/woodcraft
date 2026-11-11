import { NextResponse } from "next/server";
import { placeOrder } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { sendCapiPurchase } from "@/lib/meta-capi";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });

  // Capture abandoned checkout if phone present but we may fail later
  if (body.phone && body.items?.length && body._abandonOnly) {
    await prisma.abandonedCheckout.create({
      data: {
        phone: String(body.phone).slice(0, 20),
        name: body.customerName ? String(body.customerName).slice(0, 80) : null,
        city: body.city ? String(body.city).slice(0, 60) : null,
        cartJson: JSON.stringify(body.items).slice(0, 4000),
      },
    });
    return NextResponse.json({ ok: true });
  }

  const result = await placeOrder(body);
  if (!result.ok) {
    if (body.phone && body.items?.length) {
      await prisma.abandonedCheckout
        .create({
          data: {
            phone: String(body.phone).slice(0, 20),
            name: body.customerName ? String(body.customerName).slice(0, 80) : null,
            city: body.city ? String(body.city).slice(0, 60) : null,
            cartJson: JSON.stringify(body.items).slice(0, 4000),
          },
        })
        .catch(() => {});
    }
    return NextResponse.json(result, { status: 400 });
  }

  await sendCapiPurchase({
    orderNumber: result.order.orderNumber,
    totalPkr: result.order.totalPkr,
    phone: result.order.phone,
    eventId: result.order.id,
  }).catch(() => {});

  return NextResponse.json(result);
}
