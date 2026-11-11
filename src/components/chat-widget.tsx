"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquareText, Send, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { formatPkr, waLink } from "@/lib/utils";
import { useCart } from "@/lib/cart-store";
import { SafeImage } from "@/components/safe-image";

type ChatProduct = {
  id: string;
  slug: string;
  name: string;
  pricePkr: number;
  imageUrl: string;
};

type Msg = {
  role: "user" | "assistant";
  text: string;
  products?: ChatProduct[];
};

export function ChatWidget({
  enabled,
  whatsappNumber,
}: {
  enabled: boolean;
  whatsappNumber: string;
}) {
  const pathname = usePathname();
  const add = useCart((s) => s.add);
  const cartOpen = useCart((s) => s.open);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Hi — ask about our wood kitchen pieces, toys, delivery, COD, or care tips. English or Roman Urdu is fine.",
    },
  ]);

  if (!enabled || pathname.startsWith("/admin") || cartOpen) return null;

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          text: data.reply ?? "Sorry — try WhatsApp for a quick human reply.",
          products: data.products ?? [],
        },
      ]);
    } catch {
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          text: "Chat is busy. Message us on WhatsApp instead.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed z-30 bottom-[5.25rem] left-3 md:bottom-6 md:left-6 size-11 rounded-full bg-walnut text-cream shadow-lg flex items-center justify-center"
          aria-label="Open product chatbot"
        >
          <MessageSquareText className="size-5" />
        </button>
      ) : null}
      {open ? (
        <div className="fixed z-50 inset-x-3 bottom-[5.5rem] md:inset-auto md:bottom-24 md:left-6 md:w-[360px] card overflow-hidden flex flex-col max-h-[65vh]">
          <div className="flex items-center justify-between px-3 py-3 bg-walnut text-cream">
            <div>
              <p className="font-semibold text-sm">WoodCraft helper</p>
              <p className="text-[11px] opacity-80">Products · delivery · care</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="p-1">
              <X className="size-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-cream">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-8 rounded-2xl rounded-br-md bg-walnut text-cream px-3 py-2 text-sm"
                    : "mr-6 rounded-2xl rounded-bl-md bg-card border border-border px-3 py-2 text-sm"
                }
              >
                <p className="whitespace-pre-wrap">{m.text}</p>
                {m.products?.length ? (
                  <div className="mt-2 space-y-2">
                    {m.products.map((p) => (
                      <div
                        key={p.id}
                        className="flex gap-2 items-center rounded-xl bg-cream-2 p-2"
                      >
                        <div className="relative size-12 rounded-lg overflow-hidden">
                          <SafeImage src={p.imageUrl} alt={p.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link href={`/product/${p.slug}`} className="font-medium text-xs line-clamp-1">
                            {p.name}
                          </Link>
                          <p className="text-xs text-muted">{formatPkr(p.pricePkr)}</p>
                        </div>
                        <button
                          type="button"
                          className="text-[11px] font-bold text-sage-deep"
                          onClick={() =>
                            add({
                              productId: p.id,
                              slug: p.slug,
                              name: p.name,
                              pricePkr: p.pricePkr,
                              imageUrl: p.imageUrl,
                            })
                          }
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {loading ? <p className="text-xs text-muted">Thinking…</p> : null}
          </div>
          <div className="p-2 border-t border-border flex gap-2">
            <input
              className="input flex-1 min-h-11 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about boards, toys, COD…"
            />
            <button type="button" className="btn btn-primary px-3" onClick={send}>
              <Send className="size-4" />
            </button>
          </div>
          <a
            href={waLink(whatsappNumber, "Hi — the chatbot sent me.")}
            className="text-center text-[11px] py-2 text-sage-deep border-t border-border"
            target="_blank"
            rel="noreferrer"
          >
            Prefer a human? WhatsApp us
          </a>
        </div>
      ) : null}
    </>
  );
}
