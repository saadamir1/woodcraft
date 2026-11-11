import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPkr } from "@/lib/utils";
import { ProductVisibilityToggle } from "@/components/product-visibility-toggle";
import { ProductStockForm } from "@/components/product-stock-form";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-walnut">Products</h1>
      <p className="text-sm text-muted">
        Seeded catalog — edit stock / visibility here. Full image upload can use Cloudinary later.
      </p>
      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="card p-3 flex flex-wrap gap-3 items-center">
            <div className="relative size-16 rounded-xl overflow-hidden bg-cream-2">
              <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold truncate">{p.name}</p>
              <p className="text-xs text-muted">
                {p.category.name} · {formatPkr(p.pricePkr)} · /{p.slug}
              </p>
            </div>
            <ProductStockForm productId={p.id} stock={p.stock} pricePkr={p.pricePkr} />
            <ProductVisibilityToggle productId={p.id} visible={p.visible} />
          </div>
        ))}
      </div>
    </div>
  );
}
