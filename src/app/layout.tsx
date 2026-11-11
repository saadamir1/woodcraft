import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { getSettings } from "@/lib/settings";
import { SiteHeader } from "@/components/site-header";
import { BottomNav } from "@/components/bottom-nav";
import { CartSheet } from "@/components/cart-sheet";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { ChatWidget } from "@/components/chat-widget";
import { Providers } from "@/components/providers";
import { MetaPixel } from "@/components/meta-pixel";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
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
  const settings = await getSettings();

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
                <a href="/shop" className="block text-muted hover:text-walnut">
                  All products
                </a>
                <a href="/shop?category=kitchen" className="block text-muted hover:text-walnut">
                  Kitchen
                </a>
                <a href="/shop?category=toys" className="block text-muted hover:text-walnut">
                  Toys
                </a>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-walnut">Help</p>
                <a href="/track" className="block text-muted hover:text-walnut">
                  Track order
                </a>
                <a href="/policies/shipping" className="block text-muted hover:text-walnut">
                  Shipping
                </a>
                <a href="/policies/returns" className="block text-muted hover:text-walnut">
                  Returns
                </a>
                <a href="/admin" className="block text-muted hover:text-walnut">
                  Admin
                </a>
              </div>
            </div>
            <p className="text-center text-xs text-muted pb-6">
              © {new Date().getFullYear()} {settings.brandName}. PKR · Pakistan
            </p>
          </footer>
          <CartSheet whatsappNumber={settings.whatsappNumber} />
          <BottomNav whatsappNumber={settings.whatsappNumber} />
          <WhatsAppFab whatsappNumber={settings.whatsappNumber} />
          <ChatWidget
            enabled={settings.chatbotEnabled}
            whatsappNumber={settings.whatsappNumber}
          />
        </Providers>
      </body>
    </html>
  );
}
