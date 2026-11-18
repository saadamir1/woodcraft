import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPkr } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { AddToCartSticky } from "@/components/add-to-cart-sticky";
import { ProductViewTracker } from "@/components/product-view-tracker";
import { ProductHeroImage } from "@/components/product-hero-image";
import {
  ProductBreadcrumb,
  ProductLongCopy,
  ProductPromiseStrip,
  ProductSaleBadge,
} from "@/components/product-detail-enrichment";
import { Reveal } from "@/components/reveal";
import {
  getCachedProductBySlug,
  getCachedRelated,
  getCachedSettings,
} from "@/lib/cache";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      where: { visible: true },
      select: { slug: true },
      take: 50,
    });
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getCachedProductBySlug(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description.slice(0, 150),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 150),
      images: [product.imageUrl],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getCachedProductBySlug(slug);
  if (!product || !product.visible) notFound();

  const [settings, related] = await Promise.all([
    getCachedSettings(),
    getCachedRelated(product.categoryId, product.id),
  ]);

  const low = product.stock > 0 && product.stock <= product.lowStockAt;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [product.imageUrl],
    description: product.description,
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: product.pricePkr,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="page-shell mx-auto max-w-6xl px-4 py-8 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductViewTracker
        productId={product.id}
        name={product.name}
        pricePkr={product.pricePkr}
        slug={product.slug}
      />
      <ProductBreadcrumb
        categorySlug={product.category.slug}
        categoryName={product.category.name}
        name={product.name}
      />

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative">
          <ProductHeroImage
            src={product.imageUrl}
            alt={product.name}
            tilt={product.hero3d}
          />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-[2]">
            <ProductSaleBadge
              pricePkr={product.pricePkr}
              compareAt={product.compareAt}
            />
            {low ? (
              <span className="badge wc-surface-walnut">
                Only {product.stock} left
              </span>
            ) : null}
            <span className="badge bg-card/95 text-walnut border border-border">
              COD
            </span>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-sage-deep">
            <Link href={`/shop?category=${product.category.slug}`}>
              {product.category.name}
            </Link>
          </p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl text-walnut leading-tight">
            {product.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-semibold text-ink">
              {formatPkr(product.pricePkr)}
            </span>
            {product.compareAt ? (
              <>
                <span className="text-lg text-muted line-through">
                  {formatPkr(product.compareAt)}
                </span>
                <span className="text-sm font-semibold text-amber">
                  You save {formatPkr(product.compareAt - product.pricePkr)}
                </span>
              </>
            ) : null}
          </div>
          <p className="mt-5 text-muted leading-relaxed text-base">
            {product.description}
          </p>
          <ul className="mt-5 space-y-2 text-sm text-walnut-soft">
            <li className="flex gap-2">
              <span className="text-sage-deep">✓</span> WhatsApp order support on 0327
              5695299
            </li>
            <li className="flex gap-2">
              <span className="text-sage-deep">✓</span> JazzCash & Easypaisa on the same
              number
            </li>
            <li className="flex gap-2">
              <span className="text-sage-deep">✓</span> Packaged for courier · care note
              included
            </li>
          </ul>
          <p className="mt-5 text-sm text-muted">
            Delivery usually 2–5 days in major cities · Free over{" "}
            {formatPkr(settings.freeDeliveryThresholdPkr)}
          </p>
          <div className="mt-6">
            <AddToCartSticky product={product} whatsappNumber={settings.whatsappNumber} />
          </div>
        </div>
      </div>

      <ProductPromiseStrip
        freeDeliveryThresholdPkr={settings.freeDeliveryThresholdPkr}
      />

      <ProductLongCopy
        name={product.name}
        material={product.material}
        size={product.size}
        care={product.care}
        description={product.description}
      />

      {related.length ? (
        <section className="mt-14">
          <Reveal>
            <div className="flex items-end justify-between gap-3 mb-5">
              <div>
                <p className="text-sm font-semibold text-sage-deep uppercase tracking-wide">
                  Keep exploring
                </p>
                <h2 className="font-display text-3xl text-walnut">You may also like</h2>
              </div>
              <Link
                href={`/shop?category=${product.category.slug}`}
                className="text-sm font-semibold text-sage-deep"
              >
                More in {product.category.name}
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
