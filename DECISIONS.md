# DECISIONS — WoodCraft

Researched Nov 2026. Defaults may change with better evidence.

## Stack
- **Next.js App Router + TypeScript** — one app, server actions/route handlers; easiest for 2-person low traffic. Rejected: separate Nest API (overkill at start).
- **Tailwind + custom CSS tokens + Motion** — sleek mobile UI without shadcn install friction on day one; Radix/shadcn can be added later if needed.
- **SQLite (local Prisma `file:./dev.db`)** for zero-cost local/commercial-safe MVP. **Neon Postgres** for production (`DATABASE_URL` swap). Rejected Supabase free: pauses after ~7 days idle.
- **Prisma 6** — simple CRUD. Rejected Drizzle: slightly more setup for this team size.
- **Auth.js (next-auth v5)** credentials for Admin/Staff only. Guests checkout without accounts.
- **Zustand cart** — client cart persist; no customer accounts.

## Hosting
- **Dev:** `localhost:3001` (avoid clash with Innovo API on 3000).
- **Prod:** not Vercel Hobby (non-commercial). Prefer small VPS + Docker/Coolify, or Vercel Pro when revenue justifies. Documented in README.

## Payments
- **Phase 1:** COD + manual JazzCash / Easypaisa / bank TID. Abstraction in `src/lib/payments`.
- **Phase 2:** Safepay or PayFast aggregator (cards + wallets). Safepay published ~2.9%+Rs30 cards / 1.5% wallets. Merchant docs needed (CNIC, NTN, bank letter — confirm with provider).

## Chatbot
- **Groq free** first (server-side). Falls back to catalog keyword search if no `GROQ_API_KEY`. WhatsApp fallback always. Rejected Gemini free as default: free tier may train on prompts.

## Analytics
- Own `AnalyticsEvent` table + admin dashboard.
- Meta Pixel + CAPI when env vars set (`event_id` = order id for dedup).

## UI
- Warm wood palette; Cormorant Garamond + DM Sans; sticky ATC; bottom nav; bottom-sheet cart.
- 3D deferred to polish — optional `hero3d` flag on products; no heavy WebGL in MVP path.

## Roles
- Guest · Admin · Staff (orders/abandoned only via middleware).
