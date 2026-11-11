import { prisma } from "@/lib/prisma";
import { formatPkr } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const since = new Date(Date.now() - 30 * 86400000);
  const [orders, revenue, events, topProducts, byCity, abandoned] = await Promise.all([
    prisma.order.count({ where: { createdAt: { gte: since } } }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: since },
        status: { not: "CANCELLED" },
      },
      _sum: { totalPkr: true },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["name"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
    }),
    prisma.orderItem.groupBy({
      by: ["name"],
      _sum: { qty: true },
      orderBy: { _sum: { qty: "desc" } },
      take: 5,
    }),
    prisma.order.groupBy({
      by: ["city"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { city: "desc" } },
      take: 5,
    }),
    prisma.abandonedCheckout.count({ where: { followedUp: false } }),
  ]);

  const eventMap = Object.fromEntries(events.map((e) => [e.name, e._count._all]));
  const views = eventMap.ViewContent ?? 0;
  const atc = eventMap.AddToCart ?? 0;
  const checkout = eventMap.InitiateCheckout ?? 0;
  const purchases = eventMap.Purchase ?? orders;
  const aov = orders ? Math.round((revenue._sum.totalPkr ?? 0) / orders) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-walnut">Dashboard</h1>
        <p className="text-sm text-muted">Last 30 days · Hi {session.user.name}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Orders", value: String(orders) },
          { label: "Revenue", value: formatPkr(revenue._sum.totalPkr ?? 0) },
          { label: "AOV", value: formatPkr(aov) },
          { label: "Abandoned", value: String(abandoned) },
        ].map((k) => (
          <div key={k.label} className="card p-4">
            <p className="text-xs font-semibold uppercase text-muted">{k.label}</p>
            <p className="mt-1 text-xl font-semibold text-walnut">{k.value}</p>
          </div>
        ))}
      </div>
      <div className="card p-4">
        <h2 className="font-semibold text-walnut">Funnel</h2>
        <p className="mt-2 text-sm text-muted">
          Views {views} → Add to cart {atc} → Checkout {checkout} → Purchases {purchases}
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <h2 className="font-semibold text-walnut mb-2">Top products</h2>
          <ul className="text-sm space-y-1">
            {topProducts.map((p) => (
              <li key={p.name} className="flex justify-between">
                <span className="truncate">{p.name}</span>
                <span>{p._sum.qty ?? 0}</span>
              </li>
            ))}
            {!topProducts.length ? <li className="text-muted">No sales yet</li> : null}
          </ul>
        </div>
        <div className="card p-4">
          <h2 className="font-semibold text-walnut mb-2">Orders by city</h2>
          <ul className="text-sm space-y-1">
            {byCity.map((c) => (
              <li key={c.city} className="flex justify-between">
                <span>{c.city}</span>
                <span>{c._count._all}</span>
              </li>
            ))}
            {!byCity.length ? <li className="text-muted">No orders yet</li> : null}
          </ul>
        </div>
      </div>
    </div>
  );
}
