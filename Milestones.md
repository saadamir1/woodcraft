# Milestones — WoodCraft

## 1. 2026-11-11 — Plan locked
- Personal isolated app on `D:\MYAPPS\wood-store`
- Brand placeholder: WoodCraft
- COD-first, Meta mobile traffic, Nest-free stack

## 2. 2026-11-11 — Scaffold + decisions
- Next.js + Prisma SQLite + auth + design tokens
- `DECISIONS.md`, `CURSOR_BRIEF.md`, Discussion/

## 3. 2026-11-11 — Catalog MVP
- Categories + ~16 seed products
- Home / Shop / Product pages

## 4. 2026-11-11 — Checkout path
- Cart sheet, COD + manual wallets, order success + track

## 5. 2026-11-11 — Admin + analytics + WhatsApp + chat
- Admin dashboard, orders, products, settings, abandoned
- Events + Pixel/CAPI hooks, chatbot API, WhatsApp CTAs

## 6. 2026-11-11 — Real photos + free host (PC off OK)
- Product JPGs in `public/products` (Pexels); seed uses `.jpg`
- Local SQLite reseeded; images OK on `:3001`
- Neon Postgres project + Vercel Hobby prod: https://woodcraft-phi.vercel.app
- Build runs `db push` + seed on Vercel (this PC blocks Neon :5432)

## 7. 2026-11-11 — Business contact + wallets
- WhatsApp / JazzCash / Easypaisa: **0327 5695299** (Amir Rashid · Gobox)
- Live Neon settings updated; COD + manual wallets both on
- Auto payment gateway still off (needs merchant approval later)

## 8. 2026-11-11 — Personal GitHub + auto-deploy
- Repo: https://github.com/saadamir1/woodcraft (personal only)
- Vercel project `woodcraft` connected → push to `master` redeploys
- Git identity local: saadamir1 / saadamir070@gmail.com

## 9. 2026-11-11 — Home + PDP e-com depth
- Rotating promo banner, trust strip, categories, deal band
- Craft story, FAQ, WhatsApp CTA; PDP specs / promises / sale badges
- Motion reveals — wood palette kept (no loud template look)

## 10. 2026-11-18 — Page speed pass
- Before: home ~2.7s TTFB (force-dynamic + cold Neon)
- After: home ~0.5–1.2s; about ~170ms; ISR 60s + query cache
- Lazy cart/chat/WA; AVIF/WebP; LCP hero server Image

## 11. 2026-11-18 — UI polish + dark mode
- Banded “divider” lines were a bug (section bg cutting cards) — removed
- Blank WhatsApp CTA = cream text on cream button — fixed
- Stronger muted/contrast; moon/sun dark mode toggle

## 12. 2026-11-18 — Launch polish + Excel import
- Storefront: how-to-order strip, shop chips, card hover, page fade, natural copy
- Chat: Roman Urdu FAQ chips, smarter local answers, cleaner FAB panel
- Admin `/admin/import`: flexible Excel/CSV column map for Daraz-style sheets
- WhatsApp product links use live Vercel URL (not woodcraft.pk)

## 13. 2026-11-18 — Dark soften + 3D + pro errors
- Dark mode lifted (less pitch-black)
- Home hero 3D float/tilt; product image pointer tilt
- Callout errors (track/checkout/admin/import) + add-to-cart toast
- Solid WhatsApp FAB mark

## 14. 2026-11-18 — Mobile-first hero + motion
- Hero photo first on phones; full scene via object-contain (no legs-only crop)
- Auto 3D sway on hero + product cards (works without mouse)
- Scroll reveals fire earlier on mobile; full-width CTAs
- Dropped duplicate JazzCash line under hero on small screens

## 15. 2026-11-18 — Dark chip contrast
- Shop category tabs: cream fill + dark text in dark mode (was invisible)
- Same pill fix for admin nav; promo + low-stock badges use wc-surface-walnut
- Stopped `a { color: inherit }` from killing link text colors

## 16. Next (you)
- Meta Pixel IDs + Groq key
- Custom domain / commercial plan if selling
- Optional WhatsApp Business app on same number
- Gateway merchant application
- Daraz sheet import (upload export file in Admin → Import)
- Replace dark spice-box photo if needed
- Rotate Neon DB password (was shown in CLI earlier)
