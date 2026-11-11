"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Leaf,
  Truck,
  ShieldCheck,
  MessageCircle,
  Gift,
  Sparkles,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ProductCard } from "@/components/product-card";
import { formatPkr, waLink } from "@/lib/utils";
import { SafeImage } from "@/components/safe-image";

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
    a: "Yes — COD is available nationwide. We confirm on WhatsApp before dispatch.",
  },
  {
    q: "How long does delivery take?",
    a: "Usually 2–5 days in major cities. Remote areas may take a little longer.",
  },
  {
    q: "Can I pay with JazzCash or Easypaisa?",
    a: "Yes. Transfer to our wallet number at checkout, share the TID, and we confirm quickly.",
  },
  {
    q: "How do I care for the wood?",
    a: "Hand wash, dry well, and oil occasionally with food-safe mineral oil. Care notes ship with every piece.",
  },
];

export function HomeCategories({ categories }: { categories: Cat[] }) {
  const accents = ["from-[#5c3d22] to-[#3d2914]", "from-[#8a6a3d] to-[#5c3d22]", "from-[#3f5a42] to-[#2a4030]"];
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
          Small catalog on purpose — clearer photos, better finish, easier choices.
        </p>
      </Reveal>
      <div className="mt-7 grid sm:grid-cols-3 gap-3 sm:gap-4">
        {categories.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.06}>
            <Link
              href={`/shop?category=${c.slug}`}
              className={`group relative overflow-hidden rounded-2xl min-h-[140px] sm:min-h-[180px] bg-gradient-to-br ${accents[i % accents.length]} text-cream p-5 flex flex-col justify-end shadow-[var(--shadow)]`}
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
              <div className="relative z-[1]">
                <p className="text-xs font-semibold uppercase tracking-wider opacity-80">
                  {c.count} pieces
                </p>
                <h3 className="font-display text-2xl mt-1">{c.name}</h3>
                <p className="mt-1 text-sm text-cream/80 line-clamp-2">
                  {c.description ?? "Explore the collection"}
                </p>
                <span className="mt-3 inline-block text-sm font-semibold group-hover:translate-x-1 transition-transform">
                  Browse →
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
      body: "Threshold applies on cart subtotal before checkout fees.",
    },
    {
      icon: ShieldCheck,
      title: "Checked before pack",
      body: "Grain, finish, and edges reviewed so what you unbox matches the photo.",
    },
    {
      icon: Leaf,
      title: "Warm, usable wood",
      body: "Everyday kitchen tools and gentle toys — not disposable décor.",
    },
  ];
  return (
    <section className="border-y border-border bg-card/60">
      <div className="mx-auto max-w-6xl px-4 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.05} className="flex gap-3">
            <div className="size-10 rounded-xl bg-cream-2 border border-border flex items-center justify-center shrink-0">
              <it.icon className="size-5 text-sage-deep" />
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
          <div className="rounded-2xl border border-amber/30 bg-gradient-to-r from-[#fff6e8] to-[#f3ebe0] px-5 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex gap-3 items-start">
              <Sparkles className="size-6 text-amber shrink-0 mt-0.5" />
              <div>
                <p className="font-display text-2xl text-walnut">Warm welcome offer</p>
                <p className="text-sm text-muted mt-1">
                  Free delivery when your cart hits {formatPkr(threshold)}. Mix kitchen + toys
                  freely.
                </p>
              </div>
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
              Was {formatPkr(product.compareAt)} · now {formatPkr(product.pricePkr)} — you keep{" "}
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
    { n: "02", t: "Checkout your way", d: "COD, JazzCash, or Easypaisa — we confirm on WhatsApp." },
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
          real measurements, and packaging that survives the courier. Led by Amir Rashid —
          small team, careful hands.
        </p>
      </Reveal>
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.08} className="card p-5 relative overflow-hidden">
            <span className="font-display text-4xl text-amber/40 absolute -right-1 -top-1">
              {s.n}
            </span>
            <h3 className="font-semibold text-walnut relative">{s.t}</h3>
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
    <section className="bg-[linear-gradient(180deg,transparent,rgba(95,122,97,0.06),transparent)]">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-4xl text-walnut">
            What customers say
          </h2>
          <p className="mt-2 text-muted text-sm">Real homes · real WhatsApp threads</p>
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
                  {t.name} · {t.city}
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
        <p className="mt-2 text-muted text-sm">
          Still unsure? WhatsApp us — we reply with photos, sizes, and ETA.
        </p>
      </Reveal>
      <div className="mt-6 max-w-3xl space-y-3">
        {FAQS.map((f, i) => (
          <Reveal key={f.q} delay={i * 0.04}>
            <details className="card group px-4 py-3 open:pb-4">
              <summary className="cursor-pointer font-semibold text-walnut list-none flex justify-between gap-3 items-center">
                {f.q}
                <span className="text-muted text-lg group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm text-muted leading-relaxed pr-6">{f.a}</p>
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
        <div className="rounded-2xl bg-walnut text-cream px-6 py-8 sm:px-10 sm:py-10 flex flex-col md:flex-row md:items-center gap-6 justify-between overflow-hidden relative">
          <motion.div
            className="absolute -right-10 -bottom-16 size-56 rounded-full bg-amber/20 blur-2xl"
            animate={{ opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <div className="relative">
            <p className="text-sm font-semibold text-amber-soft uppercase tracking-wide">
              Prefer a human?
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl max-w-lg">
              Message WoodCraft on WhatsApp for sizes, gifts, and custom sets
            </h2>
            <p className="mt-2 text-cream/75 text-sm max-w-md">
              Same number for JazzCash / Easypaisa — 0327 5695299
            </p>
          </div>
          <a
            href={waLink(whatsappNumber, "Hi WoodCraft — I have a question about your wood pieces.")}
            target="_blank"
            rel="noreferrer"
            className="btn relative bg-cream text-walnut hover:bg-cream-2 shrink-0"
          >
            <MessageCircle className="size-5" />
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
            Picked for you
          </p>
          <h2 className="font-display text-3xl text-walnut">Featured pieces</h2>
        </div>
        <Link href="/shop" className="text-sm font-semibold text-sage-deep">
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
