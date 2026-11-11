import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPkr, waLink } from "@/lib/utils";
import { getSettings } from "@/lib/settings";
import { OrderStatusForm } from "@/components/order-status-form";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const settings = await getSettings();
  const orders = await prisma.order.findMany({
    where: sp.status ? { status: sp.status as never } : undefined,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { items: true },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-walnut">Orders</h1>
          <p className="text-sm text-muted">Newest first</p>
        </div>
        <form className="flex gap-2">
          <select name="status" defaultValue={sp.status ?? ""} className="input">
            <option value="">All</option>
            {["NEW", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "RETURNED", "CANCELLED"].map(
              (s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ),
            )}
          </select>
          <button className="btn btn-secondary">Filter</button>
        </form>
      </div>
      <div className="space-y-3">
        {orders.map((o) => (
          <article key={o.id} className="card p-4 space-y-3">
            <div className="flex flex-wrap justify-between gap-2">
              <div>
                <p className="font-semibold">
                  {o.orderNumber}{" "}
                  <span className="text-xs font-normal text-muted">
                    {o.createdAt.toLocaleString("en-PK")}
                  </span>
                </p>
                <p className="text-sm">
                  {o.customerName} · {o.phone} · {o.city}
                </p>
                <p className="text-sm text-muted">{o.address}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatPkr(o.totalPkr)}</p>
                <p className="text-xs text-muted">
                  {o.paymentMethod} · {o.paymentStatus}
                </p>
              </div>
            </div>
            <ul className="text-sm text-muted">
              {o.items.map((i) => (
                <li key={i.id}>
                  {i.name} × {i.qty}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 items-center">
              <OrderStatusForm orderId={o.id} status={o.status} paymentStatus={o.paymentStatus} />
              <a
                className="btn btn-sage text-sm"
                href={waLink(
                  o.phone.startsWith("0") ? `92${o.phone.slice(1)}` : o.phone,
                  `Hi ${o.customerName}, regarding WoodCraft order ${o.orderNumber}:`,
                )}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp customer
              </a>
              <Link href={`/track?n=${o.orderNumber}&p=${o.phone}`} className="btn btn-ghost text-sm">
                Tracking link
              </Link>
            </div>
          </article>
        ))}
        {!orders.length ? <p className="text-muted">No orders yet.</p> : null}
      </div>
      <p className="text-xs text-muted">Store WhatsApp: {settings.whatsappNumber}</p>
    </div>
  );
}
