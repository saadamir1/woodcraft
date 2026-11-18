"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Leaf,
  Truck,
  ShieldCheck,
  Gift,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ProductCard } from "@/components/product-card";
import { formatPkr, waLink } from "@/lib/utils";
import { SafeImage } from "@/components/safe-image";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

type Cat = { slug: string; name: string; description: string | null; count: number };
type Product = {
  id: string;
  slug: string;
  name: string;
  pricePkr: number;
  compareAt: number | null;
  imageUrl: string;
  stock: number;
  lowStockAt: number;
};
type Testimonial = { id: string; name: string; city: string; quote: string; rating: number };

const FAQS = [
  {
    q: "Do you offer Cash on Delivery?",
    a: "Yes. COD is available nationwide. We confirm on WhatsApp before dispatch.",
  },
  {
    q: "How long does delivery take?",
    a: "Usually 2 to 5 days in major cities. Remote areas may take a little longer.",
  },
  {
    q: "Can I pay with JazzCash or Easypaisa?",
    a: "Yes. Transfer to 0327 5695299 at checkout, share the TID, and we confirm quickly.",
  },
  {
    q: "How do I care for the wood?",
    a: "Hand wash, dry well, and oil occasionally with food-safe mineral oil. Care notes ship with every piece.",
  },
];

export function HomeCategories({ categories }: { categories: Cat[] }) {
  const accents = [
    "from-[#5c3d22] to-[#3d2914]",
    "from-[#8a6a3d] to-[#5c3d22]",
    "from-[#3f5a42] to-[#2a4030]",
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <Reveal>
        <p className="text-sage-deep text-sm font-semibold uppercase tracking-wide">
          Shop by use
        </p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl text-walnut">
          Kitchen, play, and gifting
        </h2>
        <p className="mt-2 text-muted max-w-xl">
          A focused catalog so every photo, size, and finish is easy to trust.
        </p>
      </Reveal>
      <div className="mt-7 grid sm:grid-cols-3 gap-3 sm:gap-4">
        {categories.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.06}>
            <Link
              href={`/shop?category=${c.slug}`}
              className={`group relative overflow-hidden rounded-2xl min-h-[140px] sm:min-h-[180px] bg-gradient-to-br ${accents[i % accents.length]} p-5 flex flex-col justify-end shadow-[var(--shadow)] transition-transform duration-300 hover:-translate-y-0.5`}
            >
              <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    "radial-gradient(circle at 80% 20%, rgba(232,184,109,0.5), transparent 55%)",
                }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative z-[1] text-[#fff8ef]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#fff8ef]/90">
                  {c.count} pieces
                </p>
                <h3 className="font-display text-2xl mt-1 text-[#fff8ef]">{c.name}</h3>
                <p className="mt-1 text-sm text-[#fff8ef]/85 line-clamp-2">
                  {c.description ?? "Explore the collection"}
                </p>
                <span className="mt-3 inline-block text-sm font-semibold text-[#fff8ef] group-hover:translate-x-1 transition-transform">
                  Browse
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function HomeTrust({ freeDeliveryThresholdPkr }: { freeDeliveryThresholdPkr: number }) {
  const items = [
    {
      icon: Truck,
      title: "COD across Pakistan",
      body: "Pay when it arrives. We confirm every order on WhatsApp first.",
    },
    {
      icon: Gift,
      title: `Free delivery over ${formatPkr(freeDeliveryThresholdPkr)}`,
      body: "Applies on cart subtotal before checkout fees.",
    },
    {
      icon: ShieldCheck,
      title: "Checked before pack",
      body: "Grain, finish, and edges reviewed so the unboxing matches the photo.",
    },
    {
      icon: Leaf,
      title: "Warm, usable wood",
      body: "Everyday kitchen tools and gentle toys, not disposable décor.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.05} className="card p-4 flex gap-3">
            <div className="size-10 rounded-xl bg-cream-2 border border-border flex items-center justify-center shrink-0">
              <it.icon className="size-5 text-sage-deep" aria-hidden />
            </div>
            <div>
              <h3 className="font-semibold text-walnut text-sm">{it.title}</h3>
              <p className="mt-1 text-xs text-muted leading-relaxed">{it.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function HomeHowToOrder() {
  const steps = [
    {
      t: "Pick a design",
      d: "Browse kitchen, toys, or gift sets with clear sizes and photos.",
    },
    {
      t: "Checkout your way",
      d: "COD, JazzCash, or Easypaisa. We confirm on WhatsApp before packing.",
    },
    {
      t: "Receive and enjoy",
      d: "Courier to your door, care note inside, ready for everyday use.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <Reveal>
        <p className="text-sage-deep text-sm font-semibold uppercase tracking-wide">
          Simple ordering
        </p>
        <h2 className="mt-2 font-display text-3xl text-walnut">Three easy steps</h2>
      </Reveal>
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {steps.map((s, i) => (
          <Reveal key={s.t} delay={i * 0.06} className="card p-5 flex gap-3 items-start">
            <div className="size-10 rounded-full bg-sage/15 text-sage-deep flex items-center justify-center shrink-0 font-display text-lg">
              {i + 1}
            </div>
            <div>
              <h3 className="font-semibold text-walnut">{s.t}</h3>
              <p className="mt-1 text-sm text-muted leading-relaxed">{s.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function HomeDealBanner({
  product,
  threshold,
}: {
  product: Product | null;
  threshold: number;
}) {
  if (!product?.compareAt || product.compareAt <= product.pricePkr) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-6">
        <Reveal>
          <div className="rounded-2xl border border-amber/30 bg-gradient-to-r from-[#fff6e8] to-[#f3ebe0] dark:from-[#2a2118] dark:to-[#221a13] px-5 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <p className="font-display text-2xl text-walnut">Free delivery threshold</p>
              <p className="text-sm text-muted mt-1">
                Carts over {formatPkr(threshold)} ship free. Mix kitchen and toys in one order.
              </p>
            </div>
            <Link href="/shop" className="btn btn-primary shrink-0">
              Build a cart
            </Link>
          </div>
        </Reveal>
      </section>
    );
  }

  const save = product.compareAt - product.pricePkr;
  const pct = Math.round((save / product.compareAt) * 100);

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <Reveal>
        <div className="rounded-2xl overflow-hidden border border-border bg-card grid md:grid-cols-[1.1fr_1fr]">
          <div className="relative aspect-[5/4] md:aspect-auto min-h-[220px] bg-cream-2">
            <SafeImage
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
            />
            <span className="badge absolute top-4 left-4 bg-amber text-white text-sm px-3 py-1">
              Save {pct}%
            </span>
          </div>
          <div className="p-6 sm:p-8 flex flex-col justify-center">
            <p className="text-sm font-semibold text-amber uppercase tracking-wide">
              Featured saving
            </p>
            <h2 className="mt-2 font-display text-3xl text-walnut">{product.name}</h2>
            <p className="mt-2 text-muted text-sm">
              Was {formatPkr(product.compareAt)}, now {formatPkr(product.pricePkr)}. You keep{" "}
              {formatPkr(save)}.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={`/product/${product.slug}`} className="btn btn-primary">
                View deal
              </Link>
              <Link href="/shop" className="btn btn-secondary">
                More offers
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function HomeCraftStory() {
  const steps = [
    { n: "01", t: "Choose your piece", d: "Browse kitchen, toys, or gift sets with honest sizes." },
    { n: "02", t: "Checkout your way", d: "COD, JazzCash, or Easypaisa. We confirm on WhatsApp." },
    { n: "03", t: "Use it every day", d: "Oil, dry, and enjoy wood that softens into the home." },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <Reveal className="max-w-2xl">
        <p className="text-sage-deep text-sm font-semibold uppercase tracking-wide">
          From Gobox
        </p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl text-walnut">
          A calmer way to shop wood online
        </h2>
        <p className="mt-3 text-muted leading-relaxed">
          WoodCraft keeps the list short so each board, bowl, and toy gets a clear photo,
          real measurements, and packaging that survives the courier. Led by Amir Rashid.
          Small team, careful hands.
        </p>
      </Reveal>
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.08} className="card p-5 relative overflow-hidden">
            <span className="font-display text-4xl text-amber/70 absolute right-3 top-2">
              {s.n}
            </span>
            <h3 className="font-semibold text-walnut relative pr-12">{s.t}</h3>
            <p className="mt-2 text-sm text-muted relative leading-relaxed">{s.d}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function HomeTestimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 py-14">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-4xl text-walnut">
            What customers say
          </h2>
          <p className="mt-2 text-sm text-walnut-soft">From real WhatsApp orders across Pakistan</p>
        </Reveal>
        <div className="mt-7 grid sm:grid-cols-3 gap-4">
          {items.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.06}>
              <blockquote className="card p-5 h-full flex flex-col">
                <div className="flex gap-0.5 text-amber" aria-label={`${t.rating} stars`}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <span key={j}>★</span>
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed flex-1">“{t.quote}”</p>
                <footer className="mt-4 text-xs font-semibold text-muted">
                  {t.name}, {t.city}
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeFaq() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <Reveal className="max-w-xl">
        <h2 className="font-display text-3xl text-walnut">Questions, answered</h2>
        <p className="mt-2 text-sm text-walnut-soft">
          Still unsure? WhatsApp us with photos, sizes, and your city.
        </p>
      </Reveal>
      <div className="mt-6 max-w-3xl space-y-3">
        {FAQS.map((f, i) => (
          <Reveal key={f.q} delay={i * 0.04}>
            <details className="card group px-5 py-4 open:pb-5">
              <summary className="cursor-pointer font-semibold text-walnut list-none flex justify-between gap-3 items-center">
                {f.q}
                <span className="text-walnut-soft text-lg group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted leading-relaxed pr-6">{f.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function HomeWhatsAppCta({ whatsappNumber }: { whatsappNumber: string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <Reveal>
        <div className="rounded-2xl bg-[#3d2914] text-[#fff8ef] px-6 py-8 sm:px-10 sm:py-10 flex flex-col md:flex-row md:items-center gap-6 justify-between overflow-hidden relative">
          <motion.div
            className="absolute -right-10 -bottom-16 size-56 rounded-full bg-amber/20 blur-2xl"
            animate={{ opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <div className="relative z-[1]">
            <p className="text-sm font-semibold text-[#f0c078] uppercase tracking-wide">
              Prefer a human?
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl max-w-lg text-[#fff8ef]">
              Message WoodCraft on WhatsApp for sizes, gifts, and custom sets
            </h2>
            <p className="mt-2 text-[#fff8ef]/80 text-sm max-w-md">
              Same number for JazzCash / Easypaisa: 0327 5695299
            </p>
          </div>
          <a
            href={waLink(
              whatsappNumber,
              "Hi WoodCraft, I have a question about your wood pieces.",
            )}
            target="_blank"
            rel="noreferrer"
            className="btn btn-on-dark relative z-[1] shrink-0"
          >
            <WhatsAppIcon className="size-5 text-[#25D366]" aria-hidden />
            Chat on WhatsApp
          </a>
        </div>
      </Reveal>
    </section>
  );
}

export function HomeFeaturedGrid({ products }: { products: Product[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-3 mb-6">
        <div>
          <p className="text-sage-deep text-sm font-semibold uppercase tracking-wide">
            Staff picks
          </p>
          <h2 className="font-display text-3xl text-walnut">Featured pieces</h2>
        </div>
        <Link href="/shop" className="text-sm font-semibold text-sage-deep hover:underline">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
