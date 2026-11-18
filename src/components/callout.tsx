"use client";

import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "error" | "success" | "info" | "warn";

const styles: Record<Tone, string> = {
  error: "border-danger/35 bg-danger/10 text-ink",
  success: "border-success/35 bg-success/10 text-ink",
  info: "border-sage/35 bg-sage/10 text-ink",
  warn: "border-amber/40 bg-amber/10 text-ink",
};

const icons = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
  warn: AlertCircle,
};

export function Callout({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: Tone;
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const Icon = icons[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-2xl border px-4 py-3 flex gap-3 items-start",
        styles[tone],
        className,
      )}
    >
      <Icon
        className={cn(
          "size-5 shrink-0 mt-0.5",
          tone === "error" && "text-danger",
          tone === "success" && "text-success",
          tone === "warn" && "text-amber",
          tone === "info" && "text-sage-deep",
        )}
        aria-hidden
      />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-walnut">{title}</p>
        {children ? (
          <div className="mt-0.5 text-sm text-muted leading-relaxed">{children}</div>
        ) : null}
      </div>
    </div>
  );
}
