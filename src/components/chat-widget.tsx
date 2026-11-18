"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageSquareText, Send, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { formatPkr, waLink } from "@/lib/utils";
import { useCart } from "@/lib/cart-store";
import { SafeImage } from "@/components/safe-image";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

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

const QUICK = [
  { label: "COD hai?", text: "COD hai kya?" },
  { label: "Delivery", text: "Delivery kitne din mein hoti hai?" },
  { label: "Kitchen", text: "Kitchen boards dikhao" },
  { label: "Toys", text: "Wooden toys dikhao" },
  { label: "Gift set", text: "Gift set chahiye" },
  { label: "JazzCash", text: "JazzCash number kya hai?" },
];

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
  const [pulse, setPulse] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Assalam o alaikum! Kitchen wood, toys, COD ya delivery pooch sakte hain. English ya Roman Urdu, dono theek hain.",
    },
  ]);

  useEffect(() => {
    const t = window.setTimeout(() => setPulse(false), 8000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open, loading]);

  if (!enabled || pathname.startsWith("/admin") || cartOpen) return null;

  async function send(textIn?: string) {
    const text = (textIn ?? input).trim();
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
          text: data.reply ?? "WhatsApp pe likh dein, jaldi jawab mil jayega.",
          products: data.products ?? [],
        },
      ]);
    } catch {
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          text: "Connection weak hai. WhatsApp use kar lein.",
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
          onClick={() => {
            setOpen(true);
            setPulse(false);
          }}
          className="chat-fab fixed z-30 bottom-[5.25rem] left-3 md:bottom-6 md:left-6 flex items-center gap-2 rounded-full bg-walnut text-[var(--on-dark)] shadow-lg pl-3 pr-3.5 sm:pr-4 h-12 border border-border/40"
          aria-label="Open shop chat"
        >
          <span className="relative flex size-8 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--on-dark)_14%,transparent)]">
            <MessageSquareText className="size-4" />
            {pulse ? (
              <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-amber ring-2 ring-walnut" />
            ) : null}
          </span>
          <span className="text-sm font-semibold">Ask us</span>
        </button>
      ) : null}

      {open ? (
        <div className="chat-panel fixed z-50 inset-x-3 bottom-[5.5rem] md:inset-auto md:bottom-24 md:left-6 md:w-[380px] card overflow-hidden flex flex-col max-h-[min(72vh,560px)] shadow-2xl">
          <div className="flex items-center justify-between px-3.5 py-3 bg-walnut text-[var(--on-dark)]">
            <div className="min-w-0">
              <p className="font-semibold text-sm">WoodCraft</p>
              <p className="text-[11px] opacity-80 truncate">
                Products · COD · delivery · Roman Urdu OK
              </p>
            </div>
            <div className="flex items-center gap-1">
              <a
                href={waLink(whatsappNumber, "Hi WoodCraft, chat se aaya hun.")}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full hover:bg-white/10"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <WhatsAppIcon className="size-4 text-[#25D366]" />
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-white/10"
                aria-label="Close chat"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-cream">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-8 rounded-2xl rounded-br-md bg-walnut text-[var(--on-dark)] px-3 py-2 text-sm"
                    : "mr-4 rounded-2xl rounded-bl-md bg-card border border-border px-3 py-2 text-sm"
                }
              >
                <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                {m.products?.length ? (
                  <div className="mt-2 space-y-2">
                    {m.products.map((p) => (
                      <div
                        key={p.id}
                        className="flex gap-2 items-center rounded-xl bg-cream-2 p-2 border border-border/60"
                      >
                        <div className="relative size-12 rounded-lg overflow-hidden shrink-0">
                          <SafeImage
                            src={p.imageUrl}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/product/${p.slug}`}
                            className="font-medium text-xs line-clamp-1 hover:text-sage-deep"
                            onClick={() => setOpen(false)}
                          >
                            {p.name}
                          </Link>
                          <p className="text-xs text-muted">{formatPkr(p.pricePkr)}</p>
                        </div>
                        <button
                          type="button"
                          className="text-[11px] font-bold text-sage-deep px-2 py-1 rounded-lg hover:bg-card"
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
            {loading ? (
              <p className="text-xs text-muted px-1">Ek second…</p>
            ) : null}
          </div>

          <div className="px-2.5 pt-2 pb-1 border-t border-border bg-card flex gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK.map((q) => (
              <button
                key={q.label}
                type="button"
                disabled={loading}
                onClick={() => send(q.text)}
                className="shrink-0 rounded-full border border-border bg-cream-2 px-2.5 py-1 text-[11px] font-semibold text-walnut hover:border-sage"
              >
                {q.label}
              </button>
            ))}
          </div>

          <div className="p-2.5 border-t border-border flex gap-2 bg-card">
            <input
              className="input flex-1 min-h-11 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Masalan: spice box, COD…"
              aria-label="Chat message"
            />
            <button
              type="button"
              className="btn btn-primary px-3"
              onClick={() => send()}
              disabled={loading}
              aria-label="Send"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
