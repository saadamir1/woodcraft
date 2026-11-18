import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";
import { getSettings as getSettingsUncached, type StoreSettings } from "./settings";

/** Shared store settings — short TTL so admin edits show up soon without blocking every request. */
export const getCachedSettings = unstable_cache(
  async (): Promise<StoreSettings> => getSettingsUncached(),
  ["woodcraft-settings"],
  { revalidate: 60, tags: ["settings"] },
);

export const getCachedFeaturedProducts = unstable_cache(
  async () =>
    prisma.product.findMany({
      where: { visible: true, featured: true },
      take: 8,
      orderBy: { updatedAt: "desc" },
    }),
  ["woodcraft-featured"],
  { revalidate: 60, tags: ["catalog"] },
);

export const getCachedCategories = unstable_cache(
  async () =>
    prisma.category.findMany({
      include: {
        _count: { select: { products: { where: { visible: true } } } },
      },
      orderBy: { name: "asc" },
    }),
  ["woodcraft-categories"],
  { revalidate: 60, tags: ["catalog"] },
);

export const getCachedTestimonials = unstable_cache(
  async () =>
    prisma.testimonial.findMany({ where: { visible: true }, take: 3 }),
  ["woodcraft-testimonials"],
  { revalidate: 120, tags: ["catalog"] },
);

export const getCachedDealProduct = unstable_cache(
  async () =>
    prisma.product.findFirst({
      where: { visible: true, NOT: { compareAt: null } },
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
    }),
  ["woodcraft-deal"],
  { revalidate: 60, tags: ["catalog"] },
);

export function getCachedProductBySlug(slug: string) {
  return unstable_cache(
    async () =>
      prisma.product.findUnique({
        where: { slug },
        include: { category: true },
      }),
    ["woodcraft-product", slug],
    { revalidate: 60, tags: ["catalog", `product-${slug}`] },
  )();
}

export function getCachedRelated(categoryId: string, productId: string) {
  return unstable_cache(
    async () =>
      prisma.product.findMany({
        where: {
          visible: true,
          categoryId,
          NOT: { id: productId },
        },
        take: 4,
      }),
    ["woodcraft-related", categoryId, productId],
    { revalidate: 60, tags: ["catalog"] },
  )();
}
