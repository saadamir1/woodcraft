# Terminal trace — WoodCraft

- npm cache / TEMP preferred on `D:\temp`
- `npx create-next-app@latest wood-store` in `D:\MYAPPS`
- Installed: prisma@6, next-auth@beta, motion, zustand, zod, bcryptjs, lucide-react, dotenv
- App port: **3001** (`npm run dev -- -p 3001`) so Innovo API can keep 3000
- DB: `prisma/dev.db` via `DATABASE_URL=file:./dev.db`
- Seed: `npm run db:seed`
- Admin: admin@woodcraft.pk / admin123
- Smoke checkout OK: `node scripts/smoke-checkout.mjs` → order WC-*
- Playwright: `npx playwright test` (Chromium) — catalog + COD purchase passed
- Dev server: http://localhost:3001 (keep Innovo API on 3000)
- Images: JPGs under `public/products/*.jpg`; local reseed 2026-11-11
- Neon :5432 blocked from this PC → schema push/seed only on Vercel build
- Vercel project `woodcraft` → https://woodcraft-phi.vercel.app (Hobby; PC can be off)
- Prod env: DATABASE_URL (Neon pooler), AUTH_SECRET, NEXTAUTH_URL, NEXT_PUBLIC_SITE_URL
- Build: `prepare-prod-schema.mjs` + `prisma db push` + seed (skip if products exist)
