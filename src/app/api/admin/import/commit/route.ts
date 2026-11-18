import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  applyColumnMap,
  type ColumnMap,
} from "@/lib/catalog-import";
import { slugify } from "@/lib/slugify";

export const runtime = "nodejs";

async function uniqueSlug(base: string): Promise<string> {
  let slug = slugify(base);
  let n = 0;
  while (true) {
    const candidate = n === 0 ? slug : `${slug}-${n}`;
    const exists = await prisma.product.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!exists) return candidate;
    n += 1;
    if (n > 200) return `${slug}-${Date.now()}`;
  }
}

async function ensureCategory(name: string) {
  const clean = name.trim() || "Kitchen";
  const slug = slugify(clean);
  const existing = await prisma.category.findFirst({
    where: {
      OR: [{ slug }, { name: { equals: clean } }],
    },
  });
  if (existing) return existing;
  return prisma.category.create({
    data: {
      slug,
      name: clean,
      description: `${clean} pieces from WoodCraft`,
    },
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.rows) || !body.map) {
    return NextResponse.json({ error: "Missing rows or column map" }, { status: 400 });
  }

  const map = body.map as ColumnMap;
  const mode = body.mode === "update" ? "update" : "create";
  const { ok, skipped, errors } = applyColumnMap(body.rows, map);

  if (!ok.length) {
    return NextResponse.json(
      { error: "No valid products. Map at least Name and Price.", skipped, errors },
      { status: 400 },
    );
  }

  if (ok.length > 400) {
    return NextResponse.json(
      { error: "Limit is 400 products per import" },
      { status: 400 },
    );
  }

  let created = 0;
  let updated = 0;
  const fallbackImage = "/products/walnut-cutting-board.jpg";

  for (const row of ok) {
    const category = await ensureCategory(row.category);
    const imageUrl =
      row.imageUrl.startsWith("http") || row.imageUrl.startsWith("/")
        ? row.imageUrl
        : fallbackImage;

    if (mode === "update" && row.sku) {
      const bySlug = await prisma.product.findUnique({
        where: { slug: slugify(row.sku) },
      });
      if (bySlug) {
        await prisma.product.update({
          where: { id: bySlug.id },
          data: {
            name: row.name,
            description: row.description,
            pricePkr: row.pricePkr,
            compareAt: row.compareAt,
            stock: row.stock,
            material: row.material,
            size: row.size,
            imageUrl,
            categoryId: category.id,
            visible: true,
          },
        });
        updated += 1;
        continue;
      }
    }

    const slug = await uniqueSlug(row.slugBase);
    await prisma.product.create({
      data: {
        slug,
        name: row.name,
        description: row.description,
        pricePkr: row.pricePkr,
        compareAt: row.compareAt,
        stock: row.stock,
        material: row.material,
        size: row.size,
        imageUrl: imageUrl || fallbackImage,
        categoryId: category.id,
        visible: true,
        featured: false,
      },
    });
    created += 1;
  }

  revalidateTag("catalog", { expire: 0 });
  return NextResponse.json({
    ok: true,
    created,
    updated,
    skipped,
    errors,
  });
}
