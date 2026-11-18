import Link from "next/link";
import { formatPkr } from "@/lib/utils";
import { HomeHero3D } from "@/components/home-hero-3d";
import {
  HomeCategories,
  HomeCraftStory,
  HomeDealBanner,
  HomeFaq,
  HomeFeaturedGrid,
  HomeHowToOrder,
  HomeTestimonials,
  HomeTrust,
  HomeWhatsAppCta,
} from "@/components/home-enrichment";
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
    <div className="page-shell">
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-4 pt-6 pb-10 sm:py-14 lg:py-20 grid lg:grid-cols-2 gap-6 sm:gap-10 items-center">
          {/* Mobile-first: photo first, then copy */}
          <div className="order-1 lg:order-2">
            <HomeHero3D />
          </div>
          <div className="order-2 lg:order-1">
            <p className="text-sage-deep font-semibold text-sm tracking-wide uppercase">
              Pakistan · COD · Gobox
            </p>
            <h1 className="mt-2 sm:mt-3 font-display text-3xl sm:text-5xl lg:text-6xl text-walnut leading-[1.08]">
              Wood that feels like home
            </h1>
            <p className="mt-3 sm:mt-4 text-muted text-sm sm:text-lg max-w-md leading-relaxed">
              Kitchen boards, spice boxes, trays, and gentle wooden toys for everyday
              living. Order with COD or WhatsApp.
            </p>
            <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <Link href="/shop" className="btn btn-primary w-full sm:w-auto">
                Shop collection
              </Link>
              <Link href="/about" className="btn btn-secondary w-full sm:w-auto">
                Our story
              </Link>
            </div>
            {/* Banner already shows this on mobile — keep once on small screens */}
            <div className="mt-4 sm:mt-6 hidden sm:flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              <span>Free delivery over {formatPkr(settings.freeDeliveryThresholdPkr)}</span>
              <span>JazzCash / Easypaisa · WhatsApp 0327 5695299</span>
            </div>
          </div>
        </div>
      </section>

      <HomeTrust freeDeliveryThresholdPkr={settings.freeDeliveryThresholdPkr} />
      <HomeHowToOrder />
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
