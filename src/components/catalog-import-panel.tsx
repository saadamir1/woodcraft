"use client";

import { useMemo, useState } from "react";
import {
  applyColumnMap,
  type ColumnMap,
  type ImportField,
} from "@/lib/catalog-import";
import { formatPkr } from "@/lib/utils";
import { Callout } from "@/components/callout";

const FIELD_OPTIONS: { value: ImportField; label: string }[] = [
  { value: "skip", label: "Ignore column" },
  { value: "name", label: "Product name" },
  { value: "price", label: "Price (PKR)" },
  { value: "compareAt", label: "Compare / MRP" },
  { value: "stock", label: "Stock qty" },
  { value: "description", label: "Description" },
  { value: "category", label: "Category" },
  { value: "image", label: "Image URL" },
  { value: "sku", label: "SKU / Seller SKU" },
  { value: "material", label: "Material" },
  { value: "size", label: "Size" },
];

type ParseResult = {
  headers: string[];
  rows: Record<string, string>[];
  suggestedMap: ColumnMap;
  sheetName: string;
  preview: Record<string, string>[];
};

export function CatalogImportPanel() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [parsed, setParsed] = useState<ParseResult | null>(null);
  const [map, setMap] = useState<ColumnMap>({});
  const [mode, setMode] = useState<"create" | "update">("create");

  const previewMapped = useMemo(() => {
    if (!parsed) return null;
    return applyColumnMap(parsed.rows.slice(0, 5), map);
  }, [parsed, map]);

  async function onFile(file: File | null) {
    if (!file) return;
    setError("");
    setResult("");
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/import/parse", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Parse failed");
      setParsed(data);
      setMap(data.suggestedMap);
    } catch (e) {
      setParsed(null);
      setError(e instanceof Error ? e.message : "Could not read file");
    } finally {
      setBusy(false);
    }
  }

  async function commit() {
    if (!parsed) return;
    setBusy(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/admin/import/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: parsed.rows, map, mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");
      setResult(
        `Done. Created ${data.created}, updated ${data.updated}, skipped ${data.skipped}.`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-5 space-y-4">
        <div>
          <h2 className="font-display text-xl text-walnut">Upload sheet</h2>
          <p className="text-sm text-muted mt-1">
            Works with Daraz exports and any Excel or CSV. Columns can be in any order.
            Map each column below before importing.
          </p>
        </div>
        <label className="block">
          <span className="label">File (.xlsx / .xls / .csv)</span>
          <input
            type="file"
            accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
            className="input"
            disabled={busy}
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {error ? (
          <Callout tone="error" title="Import could not continue">
            {error}
          </Callout>
        ) : null}
        {result ? (
          <Callout tone="success" title="Import finished">
            {result}
          </Callout>
        ) : null}
      </div>

      {parsed ? (
        <>
          <div className="card p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl text-walnut">Map columns</h2>
                <p className="text-sm text-muted mt-1">
                  Sheet “{parsed.sheetName}” · {parsed.rows.length} rows · we guessed where
                  we could
                </p>
              </div>
              <label className="text-sm flex items-center gap-2">
                <span className="text-muted">If SKU matches</span>
                <select
                  className="input !min-h-10 py-1"
                  value={mode}
                  onChange={(e) =>
                    setMode(e.target.value === "update" ? "update" : "create")
                  }
                >
                  <option value="create">Always create new</option>
                  <option value="update">Update existing by SKU</option>
                </select>
              </label>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[520px]">
                <thead>
                  <tr className="text-left text-muted border-b border-border">
                    <th className="py-2 pr-3 font-semibold">Sheet column</th>
                    <th className="py-2 pr-3 font-semibold">Sample</th>
                    <th className="py-2 font-semibold">Maps to</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.headers.map((h) => (
                    <tr key={h} className="border-b border-border/70">
                      <td className="py-2.5 pr-3 font-medium text-walnut">{h}</td>
                      <td className="py-2.5 pr-3 text-muted max-w-[180px] truncate">
                        {parsed.preview[0]?.[h] || "(empty)"}
                      </td>
                      <td className="py-2.5">
                        <select
                          className="input !min-h-10 py-1"
                          value={map[h] ?? "skip"}
                          onChange={(e) =>
                            setMap((m) => ({
                              ...m,
                              [h]: e.target.value as ImportField,
                            }))
                          }
                        >
                          {FIELD_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card p-5 space-y-3">
            <h2 className="font-display text-xl text-walnut">Preview</h2>
            <p className="text-sm text-muted">
              First valid rows after mapping ({previewMapped?.ok.length ?? 0} shown of
              sample).
            </p>
            <div className="space-y-2">
              {previewMapped?.ok.map((r, i) => (
                <div
                  key={`${r.name}-${i}`}
                  className="rounded-xl border border-border bg-cream-2/50 px-3 py-2 text-sm flex flex-wrap gap-x-4 gap-y-1"
                >
                  <span className="font-semibold text-walnut">{r.name}</span>
                  <span>{formatPkr(r.pricePkr)}</span>
                  <span className="text-muted">{r.category}</span>
                  <span className="text-muted">Stock {r.stock}</span>
                </div>
              ))}
              {!previewMapped?.ok.length ? (
                <p className="text-sm text-danger">
                  Map Name and Price at minimum to see a preview.
                </p>
              ) : null}
            </div>
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy || !previewMapped?.ok.length}
              onClick={commit}
            >
              {busy ? "Importing…" : `Import ${parsed.rows.length} rows`}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
