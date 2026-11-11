import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { formatPkr } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { AddToCartSticky } from "@/components/add-to-cart-sticky";
import { ProductViewTracker } from "@/components/product-view-tracker";
import { ProductHeroImage } from "@/components/product-hero-image";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
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
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product || !product.visible) notFound();

  const settings = await getSettings();
  const related = await prisma.product.findMany({
    where: {
      visible: true,
      categoryId: product.categoryId,
      NOT: { id: product.id },
    },
    take: 4,
  });

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
    <div className="mx-auto max-w-6xl px-4 py-8">
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
      <div className="grid lg:grid-cols-2 gap-8">
        <ProductHeroImage
          src={product.imageUrl}
          alt={product.name}
          tilt={product.hero3d}
        />
        <div>
          <p className="text-sm font-semibold text-sage-deep">
            <Link href={`/shop?category=${product.category.slug}`}>
              {product.category.name}
            </Link>
          </p>
          <h1 className="mt-2 font-display text-4xl text-walnut">{product.name}</h1>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl font-semibold">{formatPkr(product.pricePkr)}</span>
            {product.compareAt ? (
              <span className="text-muted line-through">
                {formatPkr(product.compareAt)}
              </span>
            ) : null}
          </div>
          <p className="mt-4 text-muted leading-relaxed">{product.description}</p>
          <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {product.material ? (
              <div className="card p-3">
                <dt className="text-muted text-xs">Material</dt>
                <dd className="font-medium">{product.material}</dd>
              </div>
            ) : null}
            {product.size ? (
              <div className="card p-3">
                <dt className="text-muted text-xs">Size</dt>
                <dd className="font-medium">{product.size}</dd>
              </div>
            ) : null}
            {product.care ? (
              <div className="card p-3 sm:col-span-2">
                <dt className="text-muted text-xs">Care</dt>
                <dd className="font-medium">{product.care}</dd>
              </div>
            ) : null}
          </dl>
          <p className="mt-4 text-sm text-muted">
            Delivery usually 2–5 days in major cities · COD available
          </p>
          <div className="mt-5">
            <AddToCartSticky product={product} whatsappNumber={settings.whatsappNumber} />
          </div>
        </div>
      </div>
      {related.length ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl text-walnut mb-4">You may also like</h2>
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
