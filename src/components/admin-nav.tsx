"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/abandoned", label: "Abandoned" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav({ role }: { role?: string }) {
  const pathname = usePathname();
  const filtered =
    role === "STAFF"
      ? links.filter((l) => l.href === "/admin" || l.href === "/admin/orders" || l.href === "/admin/abandoned")
      : links;

  return (
    <div className="border-b border-border bg-card/80">
      <div className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center gap-3 justify-between">
        <div className="flex flex-wrap gap-2">
          {filtered.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-semibold",
                pathname === l.href ? "bg-walnut text-cream" : "bg-cream-2 text-walnut",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <button
          type="button"
          className="text-sm text-muted"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
