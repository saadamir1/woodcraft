import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { getCachedSettings } from "@/lib/cache";
import { SiteHeader } from "@/components/site-header";
import { BottomNav } from "@/components/bottom-nav";
import {
  LazyCartSheet,
  LazyChatWidget,
  LazyWhatsAppFab,
} from "@/components/lazy-chrome";
import { Providers } from "@/components/providers";
import { MetaPixel } from "@/components/meta-pixel";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"),
  title: {
    default: "WoodCraft — Wooden kitchen & toys in Pakistan",
    template: "%s · WoodCraft",
  },
  description:
    "Warm wooden kitchenware and toys. COD across Pakistan. Crafted pieces for home and little hands.",
  openGraph: {
    title: "WoodCraft",
    description: "Wooden kitchen items & toys · COD · Pakistan",
    type: "website",
    locale: "en_PK",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getCachedSettings();

  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <Providers>
          <MetaPixel />
          <SiteHeader
            brandName={settings.brandName}
            announcement={settings.announcement}
          />
          <main className="flex-1 pb-nav">{children}</main>
          <footer className="border-t border-border bg-card/70">
            <div className="mx-auto max-w-6xl px-4 py-10 grid gap-6 sm:grid-cols-3 text-sm">
              <div>
                <p className="font-display text-2xl text-walnut">{settings.brandName}</p>
                <p className="mt-2 text-muted max-w-xs">
                  Natural wood for kitchens and kids. Sourced with care, shipped with COD.
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-walnut">Shop</p>
                <Link href="/shop" className="block text-muted hover:text-walnut">
                  All products
                </Link>
                <Link
                  href="/shop?category=kitchen"
                  className="block text-muted hover:text-walnut"
                >
                  Kitchen
                </Link>
                <Link
                  href="/shop?category=toys"
                  className="block text-muted hover:text-walnut"
                >
                  Toys
                </Link>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-walnut">Help</p>
                <Link href="/track" className="block text-muted hover:text-walnut">
                  Track order
                </Link>
                <Link
                  href="/policies/shipping"
                  className="block text-muted hover:text-walnut"
                >
                  Shipping
                </Link>
                <Link
                  href="/policies/returns"
                  className="block text-muted hover:text-walnut"
                >
                  Returns
                </Link>
                <Link href="/contact" className="block text-muted hover:text-walnut">
                  Contact
                </Link>
              </div>
            </div>
            <p className="text-center text-xs text-muted pb-6">
              © {new Date().getFullYear()} {settings.brandName}. PKR · Pakistan
            </p>
          </footer>
          <LazyCartSheet whatsappNumber={settings.whatsappNumber} />
          <BottomNav whatsappNumber={settings.whatsappNumber} />
          <LazyWhatsAppFab whatsappNumber={settings.whatsappNumber} />
          <LazyChatWidget
            enabled={settings.chatbotEnabled}
            whatsappNumber={settings.whatsappNumber}
          />
        </Providers>
      </body>
    </html>
  );
}
