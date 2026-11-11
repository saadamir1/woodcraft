import { customAlphabet } from "nanoid";
import type { PaymentMethod, PaymentStatus } from "@prisma/client";
import { prisma } from "./prisma";
import { checkoutSchema, type CheckoutInput } from "./validations";
import { normalizePkPhone } from "./utils";
import { deliveryFeeFor, getSettings } from "./settings";
import { getPaymentProvider } from "./payments";

const orderNano = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 6);

const recentOrders = new Map<string, number>();

export async function placeOrder(raw: unknown) {
  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Invalid checkout",
    };
  }
  const data: CheckoutInput = parsed.data;
  if (data.website) {
    return { ok: false as const, error: "Unable to place order." };
  }

  const phone = normalizePkPhone(data.phone);
  if (!phone) {
    return {
      ok: false as const,
      error: "Use a valid Pakistani mobile like 03XXXXXXXXX",
    };
  }

  const now = Date.now();
  const last = recentOrders.get(phone) ?? 0;
  if (now - last < 60_000) {
    return {
      ok: false as const,
      error: "Please wait a minute before placing another order.",
    };
  }

  const settings = await getSettings();
  if (data.paymentMethod === "COD" && !settings.codEnabled) {
    return { ok: false as const, error: "COD is temporarily unavailable." };
  }
  if (
    data.paymentMethod !== "COD" &&
    !settings.manualTransferEnabled
  ) {
    return {
      ok: false as const,
      error: "Wallet / bank transfer is temporarily unavailable.",
    };
  }

  const ids = data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: ids }, visible: true },
  });
  if (products.length !== ids.length) {
    return { ok: false as const, error: "Some products are unavailable." };
  }

  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  let subtotal = 0;
  const lines = data.items.map((i) => {
    const p = byId[i.productId];
    if (p.stock < i.qty) {
      throw new Error(`Only ${p.stock} left of ${p.name}`);
    }
    subtotal += p.pricePkr * i.qty;
    return {
      productId: p.id,
      name: p.name,
      pricePkr: p.pricePkr,
      qty: i.qty,
    };
  });

  let discountPkr = 0;
  let discountCodeId: string | undefined;
  if (data.discountCode?.trim()) {
    const code = await prisma.discountCode.findFirst({
      where: {
        code: data.discountCode.trim().toUpperCase(),
        active: true,
      },
    });
    if (code) {
      discountCodeId = code.id;
      if (code.percentOff) discountPkr = Math.round((subtotal * code.percentOff) / 100);
      if (code.amountOffPkr) discountPkr = Math.max(discountPkr, code.amountOffPkr);
    }
  }

  const deliveryFeePkr = deliveryFeeFor(subtotal - discountPkr, settings);
  const totalPkr = Math.max(0, subtotal - discountPkr + deliveryFeePkr);
  const orderNumber = `WC-${orderNano()}`;

  let paymentStatus: PaymentStatus =
    data.paymentMethod === "COD" ? "PENDING" : "AWAITING_PROOF";
  const provider = getPaymentProvider(data.paymentMethod);
  const pay = await provider.createPayment({
    orderId: "pending",
    orderNumber,
    amountPkr: totalPkr,
    method: data.paymentMethod,
    customerPhone: phone,
  });
  paymentStatus = pay.status as PaymentStatus;

  try {
    const order = await prisma.$transaction(async (tx) => {
      for (const line of lines) {
        const updated = await tx.product.updateMany({
          where: { id: line.productId, stock: { gte: line.qty } },
          data: { stock: { decrement: line.qty } },
        });
        if (updated.count === 0) {
          throw new Error(`Stock changed for ${line.name}. Refresh and try again.`);
        }
      }

      return tx.order.create({
        data: {
          orderNumber,
          customerName: data.customerName.trim(),
          phone,
          city: data.city.trim(),
          address: data.address.trim(),
          note: data.note?.trim() || null,
          paymentMethod: data.paymentMethod as PaymentMethod,
          paymentStatus,
          paymentRef: data.paymentRef?.trim() || null,
          subtotalPkr: subtotal,
          deliveryFeePkr,
          discountPkr,
          totalPkr,
          discountCodeId,
          utmSource: data.utmSource || null,
          utmCampaign: data.utmCampaign || null,
          items: { create: lines },
        },
        include: { items: true },
      });
    });

    recentOrders.set(phone, now);

    await prisma.analyticsEvent.create({
      data: {
        name: "Purchase",
        orderId: order.id,
        path: "/checkout",
        utmSource: data.utmSource || null,
        utmCampaign: data.utmCampaign || null,
        meta: JSON.stringify({ totalPkr, paymentMethod: data.paymentMethod }),
      },
    });

    return {
      ok: true as const,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalPkr: order.totalPkr,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        phone: order.phone,
      },
      instructions: pay.instructions,
    };
  } catch (e) {
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "Could not place order",
    };
  }
}
