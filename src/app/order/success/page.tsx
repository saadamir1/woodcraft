import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPkr } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ n?: string; p?: string }>;
}) {
  const sp = await searchParams;
  const order = sp.n
    ? await prisma.order.findFirst({
        where: {
          orderNumber: sp.n,
          ...(sp.p ? { phone: sp.p } : {}),
        },
        include: { items: true },
      })
    : null;

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="mx-auto size-16 rounded-full bg-success/15 text-success flex items-center justify-center text-3xl mb-4">
        ✓
      </div>
      <h1 className="font-display text-4xl text-walnut">Order placed</h1>
      {order ? (
        <>
          <p className="mt-3 text-muted">
            Order <strong className="text-ink">{order.orderNumber}</strong> ·{" "}
            {formatPkr(order.totalPkr)}
          </p>
          <p className="mt-2 text-sm text-muted">
            Payment: {order.paymentMethod} · {order.paymentStatus}
          </p>
          <p className="mt-4 text-sm">
            We&apos;ll confirm on WhatsApp / call soon. Keep your phone handy for COD.
          </p>
          <Link
            href={`/track?n=${encodeURIComponent(order.orderNumber)}&p=${encodeURIComponent(order.phone)}`}
            className="btn btn-primary mt-6 inline-flex"
          >
            Track this order
          </Link>
        </>
      ) : (
        <p className="mt-3 text-muted">Thanks — you can track with your order number and phone.</p>
      )}
      <div className="mt-4">
        <Link href="/shop" className="text-sm font-semibold text-sage-deep">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
