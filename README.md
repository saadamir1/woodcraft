# WoodCraft — mobile-first wood store (Pakistan)

Personal MVP: wooden kitchen + toys, COD-first checkout, Meta ads ready.

## Quick start

```bash
cd D:\MYAPPS\wood-store
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open http://localhost:3001

- Admin: `admin@woodcraft.pk` / `admin123`
- Staff: `staff@woodcraft.pk` / `staff123`
- Discount: `WELCOME10`

## Env

Copy `.env.example` → `.env`. Optional: `GROQ_API_KEY`, `NEXT_PUBLIC_META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`.

## Production notes

- Swap `DATABASE_URL` to Neon Postgres.
- Do **not** host a live store on Vercel Hobby (non-commercial). Use VPS/Coolify or Vercel Pro.
- Apply early for Safepay/PayFast merchant; Phase 1 works with COD + manual wallets.

## Git

Local commits as `saadamir1` / `saadamir070@gmail.com`. Push to personal GitHub when you choose.

## Docs

- `DECISIONS.md` — stack reasoning
- `CURSOR_BRIEF.md` — product brief
- `Milestones.md` — progress
- `terminal-trace.md` — install/run notes
