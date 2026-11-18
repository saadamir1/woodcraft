import Image from "next/image";
import Link from "next/link";
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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-walnut">Products</h1>
          <p className="text-sm text-muted mt-1">
            Edit stock and visibility. Import a full sheet from Daraz under Import.
          </p>
        </div>
        <Link href="/admin/import" className="btn btn-primary text-sm">
          Import Excel
        </Link>
      </div>
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
