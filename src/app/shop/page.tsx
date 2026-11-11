import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const category = sp.category;
  const sort = sp.sort ?? "featured";
  const q = sp.q?.trim();

  const products = await prisma.product.findMany({
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
  });

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-4xl text-walnut">Shop</h1>
      <p className="text-muted mt-1 text-sm">
        Filter by use · kitchen, toys, gifting
      </p>

      <form className="mt-5 flex flex-col sm:flex-row gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search boards, toys…"
          className="input"
        />
        <select name="category" defaultValue={category ?? ""} className="input sm:max-w-[180px]">
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select name="sort" defaultValue={sort} className="input sm:max-w-[180px]">
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
        </select>
        <button type="submit" className="btn btn-primary">
          Apply
        </button>
      </form>

      <p className="mt-4 text-sm text-muted">{products.length} products</p>
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
      {products.length === 0 ? (
        <p className="py-16 text-center text-muted">No products match. Try another filter.</p>
      ) : null}
    </div>
  );
}
