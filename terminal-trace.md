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
