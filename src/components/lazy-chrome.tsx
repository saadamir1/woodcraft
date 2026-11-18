"use client";

import dynamic from "next/dynamic";

/** Heavy interactive chrome — load after first paint so LCP/INP stay clean. */
export const LazyCartSheet = dynamic(
  () => import("@/components/cart-sheet").then((m) => m.CartSheet),
  { ssr: false },
);

export const LazyWhatsAppFab = dynamic(
  () => import("@/components/whatsapp-fab").then((m) => m.WhatsAppFab),
  { ssr: false },
);

export const LazyChatWidget = dynamic(
  () => import("@/components/chat-widget").then((m) => m.ChatWidget),
  { ssr: false },
);
