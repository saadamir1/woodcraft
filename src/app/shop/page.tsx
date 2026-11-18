import Link from "next/link";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { getCachedCategories } from "@/lib/cache";
import { cn } from "@/lib/utils";

export const revalidate = 60;

async function getShopProducts(category?: string, sort?: string, q?: string) {
  const key = ["woodcraft-shop", category ?? "", sort ?? "featured", q ?? ""];
  return unstable_cache(
    async () =>
      prisma.product.findMany({
        where: {
          visible: true,
          ...(category ? { category: { slug: category } } : {}),
          ...(q
            ? {
                OR: [
                  { name: { contains: q } },
                  { description: { contains: q } },
                ],
              }
            : {}),
        },
        orderBy:
          sort === "price-asc"
            ? { pricePkr: "asc" }
            : sort === "price-desc"
              ? { pricePkr: "desc" }
              : sort === "newest"
                ? { createdAt: "desc" }
                : [{ featured: "desc" }, { updatedAt: "desc" }],
      }),
    key,
    { revalidate: 60, tags: ["catalog"] },
  )();
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const category = sp.category;
  const sort = sp.sort ?? "featured";
  const q = sp.q?.trim();

  const [products, categories] = await Promise.all([
    getShopProducts(category, sort, q),
    getCachedCategories(),
  ]);

  function hrefFor(next: { category?: string; sort?: string; q?: string }) {
    const p = new URLSearchParams();
    const c = next.category ?? category;
    const s = next.sort ?? sort;
    const query = next.q ?? q;
    if (c) p.set("category", c);
    if (s && s !== "featured") p.set("sort", s);
    if (query) p.set("q", query);
    const qs = p.toString();
    return qs ? `/shop?${qs}` : "/shop";
  }

  return (
    <div className="page-shell mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-4xl text-walnut">Shop</h1>
      <p className="text-muted mt-1 text-sm">
        Kitchen wood, toys, and gift sets. Filter and search below.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={hrefFor({ category: "" })}
          className={cn("wc-chip", !category && "wc-chip-active")}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={hrefFor({ category: c.slug })}
            className={cn("wc-chip", category === c.slug && "wc-chip-active")}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <form className="mt-5 flex flex-col sm:flex-row gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search boards, toys, gifts…"
          className="input"
        />
        {category ? <input type="hidden" name="category" value={category} /> : null}
        <select name="sort" defaultValue={sort} className="input sm:max-w-[180px]">
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price low to high</option>
          <option value="price-desc">Price high to low</option>
        </select>
        <button type="submit" className="btn btn-primary">
          Apply
        </button>
      </form>

      <p className="mt-4 text-sm text-muted">
        {products.length} {products.length === 1 ? "product" : "products"}
        {q ? ` for “${q}”` : ""}
      </p>
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
      {products.length === 0 ? (
        <div className="py-16 text-center card px-6">
          <p className="font-display text-2xl text-walnut">No matches</p>
          <p className="mt-2 text-muted text-sm">
            Try another word, or browse the full collection.
          </p>
          <Link href="/shop" className="btn btn-primary mt-5 inline-flex">
            Clear filters
          </Link>
        </div>
      ) : null}
    </div>
  );
}
