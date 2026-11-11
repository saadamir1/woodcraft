import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { HomeHeroMedia } from "@/components/home-hero-media";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, testimonials, recentCount] = await Promise.all([
    prisma.product.findMany({
      where: { visible: true, featured: true },
      take: 8,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.testimonial.findMany({ where: { visible: true }, take: 3 }),
    prisma.order.count({
      where: {
        status: { in: ["CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"] },
        createdAt: { gte: new Date(Date.now() - 14 * 86400000) },
      },
    }),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-16 grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-sage-deep font-semibold text-sm tracking-wide uppercase">
              Pakistan · COD friendly
            </p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl text-walnut leading-[1.05]">
              Wood that feels like home
            </h1>
            <p className="mt-4 text-muted text-base sm:text-lg max-w-md">
              Kitchen boards, spice boxes, trays, and gentle wooden toys — warm pieces
              for everyday living.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-primary">
                Shop collection
              </Link>
              <Link href="/about" className="btn btn-secondary">
                Our story
              </Link>
            </div>
            {recentCount > 0 ? (
              <p className="mt-5 text-sm text-muted">
                <span className="font-semibold text-sage-deep">{recentCount}</span>{" "}
                real orders confirmed in the last 2 weeks
              </p>
            ) : (
              <p className="mt-5 text-sm text-muted">
                Free delivery over Rs 7,000 · Secure COD checkout
              </p>
            )}
          </div>
          <HomeHeroMedia />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-end justify-between gap-3 mb-5">
          <h2 className="font-display text-3xl text-walnut">Featured pieces</h2>
          <Link href="/shop" className="text-sm font-semibold text-sage-deep">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="font-display text-3xl text-walnut mb-5">What customers say</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <blockquote key={t.id} className="card p-5">
              <p className="text-sm leading-relaxed">“{t.quote}”</p>
              <footer className="mt-3 text-xs font-semibold text-muted">
                {t.name} · {t.city}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
    </div>
  );
}
