import Link from "next/link";
import { formatPkr } from "@/lib/utils";
import { HomeHeroMedia } from "@/components/home-hero-media";
import {
  HomeCategories,
  HomeCraftStory,
  HomeDealBanner,
  HomeFaq,
  HomeFeaturedGrid,
  HomeTestimonials,
  HomeTrust,
  HomeWhatsAppCta,
} from "@/components/home-enrichment";
import { Reveal } from "@/components/reveal";
import {
  getCachedCategories,
  getCachedDealProduct,
  getCachedFeaturedProducts,
  getCachedSettings,
  getCachedTestimonials,
} from "@/lib/cache";

/** ISR — catalog pages served from cache, refresh every minute. */
export const revalidate = 60;

export default async function HomePage() {
  const [settings, featured, testimonials, categories, saleProduct] =
    await Promise.all([
      getCachedSettings(),
      getCachedFeaturedProducts(),
      getCachedTestimonials(),
      getCachedCategories(),
      getCachedDealProduct(),
    ]);

  const catCards = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    count: c._count.products,
  }));

  const deal =
    saleProduct &&
    saleProduct.compareAt &&
    saleProduct.compareAt > saleProduct.pricePkr
      ? saleProduct
      : null;

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-24 -left-16 size-72 rounded-full bg-amber/15 blur-3xl" />
          <div className="absolute top-20 right-0 size-80 rounded-full bg-sage/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
          {/* LCP text + image stay outside motion so first paint is not delayed */}
          <div>
            <p className="text-sage-deep font-semibold text-sm tracking-wide uppercase">
              Pakistan · COD friendly · Gobox
            </p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl text-walnut leading-[1.05]">
              Wood that feels like home
            </h1>
            <p className="mt-4 text-muted text-base sm:text-lg max-w-md leading-relaxed">
              Kitchen boards, spice boxes, trays, and gentle wooden toys — warm pieces for
              everyday living, with COD and WhatsApp support.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-primary">
                Shop collection
              </Link>
              <Link href="/about" className="btn btn-secondary">
                Our story
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              <span>Free delivery over {formatPkr(settings.freeDeliveryThresholdPkr)}</span>
              <span className="hidden sm:inline text-border">·</span>
              <span>JazzCash / Easypaisa</span>
              <span className="hidden sm:inline text-border">·</span>
              <span>WhatsApp 0327 5695299</span>
            </div>
          </div>
          <HomeHeroMedia />
        </div>
      </section>

      <HomeTrust freeDeliveryThresholdPkr={settings.freeDeliveryThresholdPkr} />
      <HomeDealBanner
        product={deal}
        threshold={settings.freeDeliveryThresholdPkr}
      />
      <HomeCategories categories={catCards} />
      <HomeFeaturedGrid products={featured} />
      <HomeCraftStory />
      <HomeTestimonials items={testimonials} />
      <HomeFaq />
      <HomeWhatsAppCta whatsappNumber={settings.whatsappNumber} />
    </div>
  );
}
