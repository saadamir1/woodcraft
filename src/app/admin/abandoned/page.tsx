import { prisma } from "@/lib/prisma";
import { waLink } from "@/lib/utils";
import { MarkFollowedUp } from "@/components/mark-followed-up";

export const dynamic = "force-dynamic";

export default async function AbandonedPage() {
  const rows = await prisma.abandonedCheckout.findMany({
    orderBy: { createdAt: "desc" },
    take: 40,
  });

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-walnut">Abandoned checkouts</h1>
      <p className="text-sm text-muted">Phone entered but order not completed — follow up on WhatsApp</p>
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.id} className="card p-4 flex flex-wrap gap-3 justify-between items-center">
            <div>
              <p className="font-semibold">
                {r.name || "Guest"} · {r.phone}
              </p>
              <p className="text-xs text-muted">
                {r.city || "—"} · {r.createdAt.toLocaleString("en-PK")}
                {r.followedUp ? " · followed up" : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <a
                className="btn btn-sage text-sm"
                href={waLink(
                  r.phone.startsWith("0") ? `92${r.phone.slice(1)}` : r.phone,
                  `Hi${r.name ? ` ${r.name}` : ""} — you left items in your WoodCraft cart. Need help finishing the order?`,
                )}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
              {!r.followedUp ? <MarkFollowedUp id={r.id} /> : null}
            </div>
          </div>
        ))}
        {!rows.length ? <p className="text-muted">None yet.</p> : null}
      </div>
    </div>
  );
}
