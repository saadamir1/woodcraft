import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const product = await prisma.product.findFirst({ where: { visible: true } });
if (!product) throw new Error("No product");

const res = await fetch("http://127.0.0.1:3001/api/checkout", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    customerName: "Smoke Tester",
    phone: "03009876543",
    city: "Karachi",
    address: "Flat 2, Block A, Clifton",
    note: "",
    paymentMethod: "COD",
    paymentRef: "",
    discountCode: "",
    website: "",
    items: [{ productId: product.id, qty: 1 }],
  }),
});
const data = await res.json();
console.log(JSON.stringify({ status: res.status, data }, null, 2));
await prisma.$disconnect();
if (!data.ok) process.exit(1);
