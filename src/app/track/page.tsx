import { prisma } from "@/lib/prisma";
import { formatPkr, normalizePkPhone } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ n?: string; p?: string }>;
}) {
  const sp = await searchParams;
  const n = sp.n?.trim();
  const phone = sp.p ? normalizePkPhone(sp.p) : null;

  const order =
    n && phone
      ? await prisma.order.findFirst({
          where: { orderNumber: n.toUpperCase(), phone },
          include: { items: true },
        })
      : null;

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="font-display text-4xl text-walnut">Track order</h1>
      <p className="text-sm text-muted mt-1">Use your order number and mobile</p>
      <form className="mt-6 space-y-3 card p-4">
        <div>
          <label className="label">Order number</label>
          <input name="n" className="input" defaultValue={n} placeholder="WC-XXXXXX" required />
        </div>
        <div>
          <label className="label">Phone</label>
          <input
            name="p"
            className="input"
            defaultValue={sp.p}
            placeholder="03XXXXXXXXX"
            required
          />
        </div>
        <button className="btn btn-primary w-full" type="submit">
          Track
        </button>
      </form>

      {n && phone && !order ? (
        <p className="mt-6 text-sm text-danger">No order found for that number + phone.</p>
      ) : null}

      {order ? (
        <div className="mt-6 card p-5 space-y-3">
          <div className="flex justify-between gap-3">
            <div>
              <p className="font-semibold">{order.orderNumber}</p>
              <p className="text-sm text-muted">{order.city}</p>
            </div>
            <span className="badge bg-sage/15 text-sage-deep">{order.status}</span>
          </div>
          <p className="text-sm">
            Payment {order.paymentMethod} · {order.paymentStatus}
          </p>
          <ul className="text-sm space-y-1 border-t border-border pt-3">
            {order.items.map((i) => (
              <li key={i.id} className="flex justify-between">
                <span>
                  {i.name} × {i.qty}
                </span>
                <span>{formatPkr(i.pricePkr * i.qty)}</span>
              </li>
            ))}
          </ul>
          <p className="font-semibold flex justify-between">
            <span>Total</span>
            <span>{formatPkr(order.totalPkr)}</span>
          </p>
        </div>
      ) : null}
    </div>
  );
}
