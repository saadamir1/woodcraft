import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const id = String(body.id ?? "");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(body.stock !== undefined ? { stock: Number(body.stock) } : {}),
      ...(body.pricePkr !== undefined ? { pricePkr: Number(body.pricePkr) } : {}),
      ...(body.visible !== undefined ? { visible: Boolean(body.visible) } : {}),
      ...(body.name ? { name: String(body.name) } : {}),
    },
  });
  return NextResponse.json({ ok: true, product });
}
