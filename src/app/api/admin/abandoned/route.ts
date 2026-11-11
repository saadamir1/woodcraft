import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  await prisma.abandonedCheckout.update({
    where: { id: String(id) },
    data: { followedUp: true },
  });
  return NextResponse.json({ ok: true });
}
