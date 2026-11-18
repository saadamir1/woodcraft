/** Flexible column guessing for Daraz / marketplace / custom sheets. */

export type ImportField =
  | "name"
  | "price"
  | "compareAt"
  | "stock"
  | "description"
  | "category"
  | "image"
  | "sku"
  | "material"
  | "size"
  | "skip";

export type ColumnMap = Record<string, ImportField>;

export type ParsedSheet = {
  headers: string[];
  rows: Record<string, string>[];
};

const ALIASES: Record<ImportField, string[]> = {
  name: [
    "name",
    "product name",
    "product_name",
    "title",
    "item name",
    "item_name",
    "product title",
    "sku name",
    "variation name",
    "nama produk",
  ],
  price: [
    "price",
    "sale price",
    "selling price",
    "special price",
    "retail price",
    "price pkr",
    "price (pkr)",
    "amount",
    "current price",
    "seller sku price",
    "promotion price",
  ],
  compareAt: [
    "compare at",
    "compare_at",
    "mrp",
    "rrp",
    "list price",
    "original price",
    "was price",
    "regular price",
    "market price",
  ],
  stock: [
    "stock",
    "qty",
    "quantity",
    "available",
    "inventory",
    "available stock",
    "sellable stock",
    "warehouse stock",
  ],
  description: [
    "description",
    "desc",
    "long description",
    "product description",
    "details",
    "short description",
    "highlights",
  ],
  category: [
    "category",
    "categories",
    "primary category",
    "product category",
    "collection",
    "type",
  ],
  image: [
    "image",
    "image url",
    "image_url",
    "main image",
    "main image url",
    "photo",
    "picture",
    "img",
    "thumbnail",
    "product image",
  ],
  sku: [
    "sku",
    "seller sku",
    "seller_sku",
    "product sku",
    "sku id",
    "item sku",
    "shop sku",
  ],
  material: ["material", "wood", "finish", "fabric"],
  size: ["size", "dimensions", "dimension", "weight", "package weight"],
  skip: [],
};

function normHeader(h: string): string {
  return h.trim().toLowerCase().replace(/[_/]+/g, " ").replace(/\s+/g, " ");
}

export function guessColumnMap(headers: string[]): ColumnMap {
  const used = new Set<ImportField>();
  const map: ColumnMap = {};
  for (const h of headers) {
    const n = normHeader(h);
    let matched: ImportField = "skip";
    for (const [field, aliases] of Object.entries(ALIASES) as [ImportField, string[]][]) {
      if (field === "skip" || used.has(field)) continue;
      if (aliases.some((a) => n === a || n.includes(a))) {
        matched = field;
        used.add(field);
        break;
      }
    }
    map[h] = matched;
  }
  return map;
}

export function parsePriceCell(raw: string): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[^\d.]/g, "");
  if (!cleaned) return null;
  const n = Math.round(Number(cleaned));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export type MappedProductRow = {
  name: string;
  pricePkr: number;
  compareAt: number | null;
  stock: number;
  description: string;
  category: string;
  imageUrl: string;
  sku: string | null;
  material: string | null;
  size: string | null;
  slugBase: string;
};

export function applyColumnMap(
  rows: Record<string, string>[],
  map: ColumnMap,
): { ok: MappedProductRow[]; skipped: number; errors: string[] } {
  const ok: MappedProductRow[] = [];
  const errors: string[] = [];
  let skipped = 0;

  rows.forEach((row, i) => {
    const get = (field: ImportField) => {
      const header = Object.entries(map).find(([, v]) => v === field)?.[0];
      if (!header) return "";
      return String(row[header] ?? "").trim();
    };

    const name = get("name");
    const price = parsePriceCell(get("price"));
    if (!name || price === null) {
      skipped += 1;
      if (name || get("price")) {
        errors.push(`Row ${i + 2}: needs a name and a price`);
      }
      return;
    }

    const compareRaw = parsePriceCell(get("compareAt"));
    const stockRaw = parsePriceCell(get("stock"));
    const category = get("category") || "Kitchen";
    const description =
      get("description") ||
      `${name} from WoodCraft. Solid wood piece for everyday use.`;
    const imageUrl = get("image") || "/products/walnut-cutting-board.jpg";
    const sku = get("sku") || null;
    const material = get("material") || null;
    const size = get("size") || null;

    ok.push({
      name,
      pricePkr: price,
      compareAt: compareRaw && compareRaw > price ? compareRaw : null,
      stock: stockRaw ?? 10,
      description,
      category,
      imageUrl,
      sku,
      material,
      size,
      slugBase: sku || name,
    });
  });

  return { ok, skipped, errors: errors.slice(0, 12) };
}
