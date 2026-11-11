# Project Brief: Mobile-First Wood Products Store (Pakistan)

## 0. How to work (read first)
- You are a senior engineer + product designer. Use your own best judgment. My suggestions below are defaults, not orders: if you find a better option, say why in `DECISIONS.md` and go with it.
- **Before writing code:** research current best practices (use web search / latest docs) for: mobile e-commerce UX, checkout conversion, Core Web Vitals, motion/animation, accessibility, Pakistani payment gateways, Meta Pixel + Conversions API, free LLM APIs. Verify library versions and free-tier limits today; don't rely on memory.
- Write `DECISIONS.md` (stack, DB, hosting, roles, payment, chatbot, analytics, with 1-2 lines of reasoning each + rejected alternatives). Then build in the phases below. After each phase: run it, test it, fix it, summarize what works.
- Keep everything **simple to manage**. Small team (2 people), low traffic at start. No microservices, no over-engineering.

## 1. Business context
- Selling wooden products (kitchen items first: cutting boards, spice boxes, trays; plus a small wooden toys line). ~15-20 products at launch.
- Market: Pakistan. Currency PKR. **Cash on Delivery (COD) is the main payment method.**
- Traffic: almost entirely **mobile users from Meta (Facebook/Instagram) ads**. Start from zero audience, few visitors, few buyers. Design for conversion and cheap running cost, not scale.
- Brand feel: warm, natural, premium-but-friendly, trustworthy.

## 2. Non-negotiable goals
1. **Mobile-first**, thumb-friendly, fast on mid-range Android over 4G. Target: LCP < 2.5s, CLS ~0, small JS bundle, optimized images (WebP/AVIF, lazy load).
2. **Simple UI, modern and sleek.** Few elements per screen, clear hierarchy, big tap targets, one primary action per screen.
3. **Smooth motion**, never heavy: page transitions, micro-interactions, skeleton loaders, bottom-sheet cart, sticky add-to-cart bar. Respect `prefers-reduced-motion`.
4. **A little 3D, used sparingly**: e.g. subtle card tilt/parallax and an optional lazy-loaded 3D/360 viewer on 1-2 hero products. Must never hurt load speed; fallback to image.
5. **Complete, working flow** from landing to order placed to order tracking. Everything tested end to end.

## 3. Suggested stack (override if you can justify it)
- **Single full-stack app: Next.js (App Router) + TypeScript.** No separate backend; use server actions/route handlers.
- **UI:** Tailwind CSS + shadcn/ui (Radix) + Motion (Framer Motion). Lucide icons.
- **DB:** PostgreSQL (Neon or Supabase free tier) with Prisma or Drizzle.
- **Images:** Cloudinary free tier or similar (auto-optimization).
- **Auth:** Admin-only login (Auth.js or similar). **Customers check out as guests, no accounts.**
- **Hosting:** pick the cheapest reliable option. Check commercial-use terms of free tiers (many "hobby" plans forbid commercial use). Consider Vercel Pro vs a small VPS with Docker/Coolify.
- **Monitoring:** Sentry (free) + basic uptime check. Daily DB backup.

## 4. Users and roles
- **Customer** (guest, no login): browse, cart, checkout, track order.
- **Admin** (owner): everything.
- **Staff** (optional, simple): view/update orders only.
Keep role logic minimal (a `role` field + middleware).

## 5. Pages (customer)
Home, Shop/Collection (filter + sort, simple), Product detail, Cart (drawer/bottom sheet), Checkout (single page), Order success, Order tracking (order # + phone), About/Our story, Contact, Policies (shipping, returns, privacy, terms), 404.
- Product page: image gallery with swipe, price, short description, material/size/care, delivery estimate, reviews/testimonials, related products, sticky "Add to cart" + "Order on WhatsApp".
- Checkout: name, phone (validate Pakistani format 03XX-XXXXXXX), city, full address, optional note, delivery fee by city/rule, free-delivery threshold, order summary, payment choice, clear total. Minimize fields and taps.
- Guard against fake/duplicate orders (honeypot, rate limit per phone/IP, optional phone confirmation flag).

## 6. Admin panel (simple, mobile-friendly)
Login, Dashboard (see analytics), Products CRUD (images, variants, stock, price, visibility), Orders (list, filter, status flow: new, confirmed, packed, shipped, delivered, returned, cancelled; notes; print/copy shipping details; WhatsApp-the-customer button), Customers (from orders), Discount codes (simple), Settings (WhatsApp number, delivery fees, free-ship threshold, payment toggles, announcement bar, chatbot on/off).

## 7. Payments
- **Phase 1:** COD (default) + **manual wallet/bank transfer** (show JazzCash/Easypaisa/bank details, customer submits TID/screenshot, admin marks as paid). Works on day one, no merchant approval needed.
- **Phase 2:** online gateway for cards + JazzCash + Easypaisa through an aggregator (research Safepay, PayFast, XPay, or direct JazzCash/Easypaisa merchant APIs; compare fees, approval requirements, docs quality, webhooks). Build a **payment provider abstraction** now so a gateway plugs in later. Verify payments via signed webhooks, never trust the client redirect.
- Merchant account approval takes time and needs business documents: list exactly what is required in `DECISIONS.md`.

## 8. WhatsApp
- Floating WhatsApp button (all pages) with prefilled message including the product name/link.
- "Order on WhatsApp" on product pages and in the cart (prefilled order summary).
- New-order notification path for the owner (start simple: admin dashboard + wa.me links; research WhatsApp Business API cost/approval and recommend if/when worth it).

## 9. AI chatbot
- Small chat widget (bottom corner, lazy-loaded, not blocking page speed).
- Uses a **free LLM API** (research current free tiers e.g. Google Gemini, Groq, OpenRouter; verify limits and terms today). Call it **server-side only**, API key never exposed.
- **Has access to the product catalog**: retrieve relevant products from the DB (simple keyword / Postgres full-text search is enough, no vector DB needed) and return **product cards** in the chat (image, price, link, add-to-cart).
- Answers only about our products, delivery, returns, payment, care; politely refuses unrelated topics. Never invents prices/stock; reads from the DB. Rate limit + abuse protection. Fallback: "Chat with us on WhatsApp".
- Understands English + Roman Urdu (and ideally Urdu).

## 10. Analytics and stats
- **Meta Pixel + Conversions API** (server-side, with event deduplication): PageView, ViewContent, AddToCart, InitiateCheckout, Purchase. This is critical for our Meta ads.
- **Own lightweight events table** + admin dashboard: visitors, sessions, traffic source/UTM (utm_source/campaign), product views, add-to-cart, checkout started, orders, conversion funnel, revenue, AOV, top products, orders by city, COD vs transfer, returns rate.
- Optionally GA4. Cookie/consent kept minimal but compliant.
- Capture abandoned checkouts (phone entered but no order) and list them in admin for WhatsApp follow-up.

## 11. UI / design direction
- Theme: natural wood. Suggested palette: warm off-white/cream background, deep walnut brown for text/primary, sage or forest green accent, small warm amber highlight. High contrast, accessible. (Refine with your own judgment.)
- Fonts: one elegant display/serif for headings + one clean sans for body (research and pick; self-host via `next/font`).
- Layout: large product photography, generous spacing, rounded cards, bottom-anchored primary actions, simple top bar, optional slim bottom nav on mobile (Home, Shop, Cart, WhatsApp).
- Motion: subtle and purposeful. Ease-out transitions (150-300ms), shared-element-style image transitions to product page, staggered list reveals, animated cart badge, success checkmark. No janky or long animations.
- Include dark mode only if trivial; otherwise skip.
- Study best-in-class mobile commerce UX (Apple, Aesop, Allbirds-style stores, top Shopify mobile themes) and local references (Sillanwali Handicrafts, ToyCompany.pk, The Wood Value, Hamza Store) and borrow the best patterns.

## 12. Also include (what I may have missed, add anything else you judge important)
SEO basics (metadata, Open Graph previews that look great when shared on WhatsApp/Facebook, sitemap, robots, product JSON-LD), image alt text, PKR formatting, low-stock badge, "recently ordered" trust cues (real data only), testimonials, delivery/return policy pages, 404/error states, empty states, form validation messages in plain language, loading and failure states for every async action, security basics (input validation, rate limiting, CSRF, secure headers, secrets in env), seed data script with ~15 sample products, `.env.example`, README with setup/deploy steps, and optional later items (courier APIs like PostEx/Leopards/TCS, SMS/WhatsApp order confirmation, Urdu language toggle).

## 13. Build phases
1. **Research + DECISIONS.md + project setup** (design tokens, layout, components).
2. **Catalog:** DB schema, seed data, Home, Shop, Product pages.
3. **Cart + Checkout + Order success + COD + manual transfer**, order saved in DB.
4. **Admin:** auth, products, orders, settings.
5. **Analytics:** Pixel/CAPI, events, dashboard.
6. **WhatsApp + order tracking + chatbot.**
7. **Polish:** motion, 3D touches, performance pass (Lighthouse mobile 90+), accessibility, SEO.
8. **Payment gateway (Phase 2)** once merchant account is approved.
9. **Testing:** automated e2e test for the full purchase flow (Playwright, mobile viewport) + manual checklist. Everything must work smoothly before launch.

## 14. Definition of done
- A visitor on a phone can land, browse, add to cart, check out with COD, see confirmation, and track the order, with no errors.
- Admin can add a product, see the order, update its status.
- Pixel/CAPI events fire correctly (verify in Meta Events Manager test tool).
- Lighthouse mobile performance 90+, no console errors, works on small Android screens.
