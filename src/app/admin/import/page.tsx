import { CatalogImportPanel } from "@/components/catalog-import-panel";

export const dynamic = "force-dynamic";

export default function AdminImportPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-3xl text-walnut">Import products</h1>
        <p className="text-sm text-muted mt-1 max-w-2xl">
          Drop a Daraz catalog export or any shop sheet. Column names can change; you map
          them once, preview, then import.
        </p>
      </div>
      <CatalogImportPanel />
    </div>
  );
}
