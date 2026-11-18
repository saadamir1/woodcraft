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

/** Expand Roman Urdu / casual PK search terms into English catalog words. */
function expandTerms(message: string): string[] {
  const raw = message.toLowerCase();
  const parts = raw
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1)
    .slice(0, 8);

  const syn: Record<string, string[]> = {
    board: ["board", "cutting"],
    cutting: ["cutting", "board"],
    chopping: ["cutting", "board"],
    takhta: ["board", "cutting"],
    masala: ["spice"],
    spice: ["spice"],
    dabba: ["box", "spice"],
    box: ["box"],
    tray: ["tray"],
    thaal: ["tray"],
    bowl: ["bowl"],
    khilona: ["toy"],
    toy: ["toy"],
    toys: ["toy"],
    bachay: ["toy"],
    baby: ["toy", "rattle"],
    gift: ["gift"],
    tohfa: ["gift"],
    set: ["set", "gift"],
    kitchen: ["kitchen"],
    rasoi: ["kitchen"],
    rolling: ["rolling", "pin"],
    belan: ["rolling"],
    salt: ["salt"],
    namak: ["salt"],
    shelf: ["shelf"],
  };

  const out = new Set<string>();
  for (const p of parts) {
    out.add(p);
    for (const [k, vals] of Object.entries(syn)) {
      if (p.includes(k) || k.includes(p)) vals.forEach((v) => out.add(v));
    }
  }
  return [...out].slice(0, 10);
}

type FaqHit = { reply: string; search?: string };

function localFaq(message: string): FaqHit | null {
  const m = message.toLowerCase();

  if (/\b(cod|cash on delivery|delivery pe paisa|pehle paisa|advance)\b/.test(m) ||
      m.includes("cod hai") ||
      m.includes("cash on")) {
    return {
      reply:
        "Haan, Cash on Delivery milta hai Pakistan bhar. Order confirm hone ke baad hum WhatsApp pe message karte hain, phir parcel pack hota hai. Aap JazzCash ya Easypaisa bhi use kar sakte hain (0327 5695299).",
    };
  }

  if (
    /\b(delivery|courier|kitne din|kitna time|shipping|kab milega|arrive)\b/.test(m) ||
    m.includes("delivery")
  ) {
    return {
      reply:
        "Badi cities mein usually 2 se 5 din. Door ke ilaqon mein thora zyada lag sakta hai. Free delivery Rs 7,000 se upar ke cart pe. Exact ETA order ke baad WhatsApp pe bata dete hain.",
    };
  }

  if (/\b(jazzcash|easypaisa|easy paisa|wallet|transfer|tid)\b/.test(m)) {
    return {
      reply:
        "JazzCash aur Easypaisa dono 0327 5695299 pe hain. Checkout pe transfer karke TID likh dein, hum confirm karke order forward kar denge.",
    };
  }

  if (/\b(return|wapis|exchange|galat|damaged|toota)\b/.test(m)) {
    return {
      reply:
        "Agar parcel kharab ya galat mile to WhatsApp pe photo bhej dein. Hum replace ya return guide kar denge. Care note har parcel ke sath jati hai.",
    };
  }

  if (/\b(care|safai|wash|oil|saaf|maintain)\b/.test(m)) {
    return {
      reply:
        "Hath se dhoyen, achi tarah sukhayein, kabhi kabhi food-safe mineral oil laga dein. Dishwasher avoid karein taake wood crack na ho.",
    };
  }

  if (/\b(size|size kya|kitna bada|dimensions|nap)\b/.test(m)) {
    return {
      reply:
        "Har product page pe size / material likha hota hai. Agar specific piece poochna hai, naam likh dein ya WhatsApp pe photo bhej dein.",
      search: message,
    };
  }

  if (/\b(gift|tohfa|eid|shaadi|wedding|set)\b/.test(m)) {
    return {
      reply:
        "Gift sets kitchen ke liye ready hain. Neeche matching pieces dekh sakte hain, ya WhatsApp pe budget bata dein hum suggest kar denge.",
      search: "gift",
    };
  }

  if (/\b(toy|toys|khilona|bachay|baby)\b/.test(m)) {
    return { reply: "Wooden toys ke soft edges hain. Yeh kuch options hain:", search: "toy" };
  }

  if (/\b(kitchen|board|cutting|spice|tray|bowl|masala|rasoi)\b/.test(m)) {
    return {
      reply: "Kitchen collection se yeh pieces milte hain:",
      search: message,
    };
  }

  if (/\b(price|kitne ka|rate|mehnga|sasta)\b/.test(m)) {
    return {
      reply:
        "Prices product cards pe PKR mein hain. Koi item bataein, main uska rate nikal ke dikhata hun.",
      search: message,
    };
  }

  if (/\b(hello|hi|salam|assalam|aoa|hey)\b/.test(m) && m.length < 24) {
    return {
      reply:
        "Assalam o alaikum! WoodCraft se bol raha hun. Kitchen wood, toys, COD, ya delivery ke bare mein pooch sakte hain. English ya Roman Urdu, dono theek hain.",
    };
  }

  return null;
}

export async function POST(req: Request) {
  const settings = await getSettings();
  if (!settings.chatbotEnabled) {
    return NextResponse.json({
      reply: "Chat abhi band hai. WhatsApp pe message kar dein: 0327 5695299.",
      products: [],
    });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) {
    return NextResponse.json(
      { reply: "Thora wait karein, ya seedha WhatsApp use karein.", products: [] },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const message = String(body.message ?? "").slice(0, 500).trim();
  if (!message) {
    return NextResponse.json({
      reply: "Kitchen boards, toys, COD, ya delivery ke bare mein pooch sakte hain.",
      products: [],
    });
  }

  const faq = localFaq(message);
  const wantProducts = !faq || Boolean(faq.search);
  const terms = expandTerms(faq?.search ?? message);

  const products = wantProducts
    ? await prisma.product.findMany({
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
        orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
        select: {
          id: true,
          slug: true,
          name: true,
          pricePkr: true,
          imageUrl: true,
          stock: true,
          description: true,
        },
      })
    : [];

  const productPayload = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    pricePkr: p.pricePkr,
    imageUrl: p.imageUrl,
  }));

  // Instant FAQ for COD / delivery / wallets (no random product cards)
  if (faq && !faq.search) {
    return NextResponse.json({ reply: faq.reply, products: [] });
  }

  const catalog = products
    .map(
      (p) =>
        `${p.name} | Rs ${p.pricePkr} | stock ${p.stock} | /product/${p.slug} | ${p.description.slice(0, 100)}`,
    )
    .join("\n");

  const system = `You are the WoodCraft shop assistant for a small Pakistani wood goods store (Gobox / Amir Rashid).
Help with products, COD, JazzCash/Easypaisa (0327 5695299), delivery in Pakistan, returns, and wood care.
Never invent prices or stock. Use only the catalog lines below.
Reply in the customer's language (English or Roman Urdu). Keep it short and natural (2-4 sentences). No markdown lists of dashes. Do not say you are an AI.
Catalog:
${catalog || "(no match — invite them to open /shop or WhatsApp)"}`;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    if (faq) {
      return NextResponse.json({ reply: faq.reply, products: productPayload });
    }
    const fallback =
      products.length > 0
        ? `Yeh ${products.length} pieces milay. Card pe tap karke detail dekhein, cart mein add kar sakte hain. Insaan se baat ke liye WhatsApp use karein.`
        : "Kitchen boards, spice boxes, wooden toys, COD aur delivery ke bare mein pooch sakte hain. Product ka naam likhein, ya WhatsApp pe aa jayein.";
    return NextResponse.json({ reply: fallback, products: productPayload });
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
        temperature: 0.35,
        max_tokens: 220,
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: faq?.reply
              ? `Customer asked: ${message}\nUse this store fact if relevant: ${faq.reply}`
              : message,
          },
        ],
      }),
    });
    if (!res.ok) throw new Error(`Groq ${res.status}`);
    const data = await res.json();
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      faq?.reply ||
      "Dobara try karein, ya WhatsApp pe message kar dein.";
    return NextResponse.json({ reply, products: productPayload });
  } catch {
    return NextResponse.json({
      reply:
        faq?.reply ||
        "Chat abhi slow hai. Shop browse karein ya WhatsApp pe 0327 5695299 pe likhein.",
      products: productPayload,
    });
  }
}
