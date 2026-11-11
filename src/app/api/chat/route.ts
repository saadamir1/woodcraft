import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";

const rate = new Map<string, { n: number; t: number }>();

function limited(ip: string) {
  const now = Date.now();
  const row = rate.get(ip) ?? { n: 0, t: now };
  if (now - row.t > 60_000) {
    rate.set(ip, { n: 1, t: now });
    return false;
  }
  row.n += 1;
  rate.set(ip, row);
  return row.n > 20;
}

export async function POST(req: Request) {
  const settings = await getSettings();
  if (!settings.chatbotEnabled) {
    return NextResponse.json({
      reply: "Chat is off right now. Please use WhatsApp.",
      products: [],
    });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) {
    return NextResponse.json(
      { reply: "Too many messages. Try WhatsApp.", products: [] },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const message = String(body.message ?? "").slice(0, 500).trim();
  if (!message) {
    return NextResponse.json({ reply: "Ask me anything about our products.", products: [] });
  }

  const terms = message
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2)
    .slice(0, 6);

  const products = await prisma.product.findMany({
    where: {
      visible: true,
      OR:
        terms.length === 0
          ? undefined
          : terms.flatMap((t) => [
              { name: { contains: t } },
              { description: { contains: t } },
              { material: { contains: t } },
              { category: { name: { contains: t } } },
            ]),
    },
    take: 4,
    orderBy: { featured: "desc" },
    select: {
      id: true,
      slug: true,
      name: true,
      pricePkr: true,
      imageUrl: true,
      stock: true,
      description: true,
    },
  });

  const catalog = products
    .map(
      (p) =>
        `- ${p.name} | Rs ${p.pricePkr} | stock ${p.stock} | /product/${p.slug} | ${p.description.slice(0, 120)}`,
    )
    .join("\n");

  const system = `You are WoodCraft's helpful store assistant for a Pakistani wooden products shop.
Answer only about our products, delivery in Pakistan, COD, JazzCash/Easypaisa/bank transfer, returns, and wood care.
Never invent prices or stock — use the catalog facts below. If unsure, say so and suggest WhatsApp.
Keep replies short (2-5 sentences). English or Roman Urdu OK.
Catalog:
${catalog || "(no matching products — suggest browsing /shop)"}`;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    const fallback =
      products.length > 0
        ? `I found ${products.length} matching piece(s). Tap a card below, or ask about COD / delivery. For a human, use WhatsApp.`
        : "I can help with kitchen boards, spice boxes, wooden toys, COD, and delivery. Try naming a product, or WhatsApp us.";
    return NextResponse.json({
      reply: fallback,
      products: products.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        pricePkr: p.pricePkr,
        imageUrl: p.imageUrl,
      })),
    });
  }

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? "openai/gpt-oss-20b",
        temperature: 0.3,
        max_tokens: 280,
        messages: [
          { role: "system", content: system },
          { role: "user", content: message },
        ],
      }),
    });
    if (!res.ok) throw new Error(`Groq ${res.status}`);
    const data = await res.json();
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "Please try again or WhatsApp us.";
    return NextResponse.json({
      reply,
      products: products.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        pricePkr: p.pricePkr,
        imageUrl: p.imageUrl,
      })),
    });
  } catch {
    return NextResponse.json({
      reply:
        "AI chat is temporarily unavailable. Browse the shop or message us on WhatsApp.",
      products: products.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        pricePkr: p.pricePkr,
        imageUrl: p.imageUrl,
      })),
    });
  }
}
