import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

test("mobile guest can browse catalog and complete COD purchase", async ({
  page,
  request,
}) => {
  const prisma = new PrismaClient();
  const product = await prisma.product.findUnique({
    where: { slug: "walnut-cutting-board" },
  });
  await prisma.$disconnect();
  expect(product).toBeTruthy();

  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Wood that feels like home/i })).toBeVisible();

  await page.goto("/shop");
  await expect(page.getByRole("heading", { name: "Shop" })).toBeVisible();

  await page.goto("/product/walnut-cutting-board");
  await expect(page.getByRole("heading", { name: product!.name })).toBeVisible();
  await expect(page.getByRole("button", { name: /Add to cart/i }).first()).toBeVisible();

  const res = await request.post("/api/checkout", {
    data: {
      customerName: "E2E Buyer",
      phone: "03001112233",
      city: "Lahore",
      address: "House 9, Street 4, Model Town",
      note: "",
      paymentMethod: "COD",
      paymentRef: "",
      discountCode: "",
      website: "",
      items: [{ productId: product!.id, qty: 1 }],
    },
  });
  const body = await res.json();
  expect(res.ok()).toBeTruthy();
  expect(body.ok).toBeTruthy();
  expect(body.order.orderNumber).toMatch(/^WC-/);

  await page.goto(
    `/order/success?n=${encodeURIComponent(body.order.orderNumber)}&p=${encodeURIComponent(body.order.phone)}`,
  );
  await expect(page.getByRole("heading", { name: /Order placed/i })).toBeVisible();
  await expect(page.getByText(body.order.orderNumber)).toBeVisible();
});
