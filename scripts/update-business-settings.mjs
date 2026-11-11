/**
 * Update WhatsApp + wallet numbers on the DB pointed by DATABASE_URL.
 * Usage: DATABASE_URL=... node scripts/update-business-settings.mjs
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const updates = {
  whatsappNumber: "923275695299",
  jazzcashNumber: "03275695299",
  easypaisaNumber: "03275695299",
  brandName: "WoodCraft",
  parentCompany: "Gobox",
  ownerName: "Amir Rashid",
  bankDetails: "Bank transfer · WoodCraft (Gobox) · details on request via WhatsApp",
  codEnabled: "true",
  manualTransferEnabled: "true",
  gatewayEnabled: "false",
  announcement: "Free delivery over Rs 7,000 · COD · JazzCash / Easypaisa 0327 5695299",
};

async function main() {
  for (const [key, value] of Object.entries(updates)) {
    await prisma.setting.upsert({
      where: { key },
      create: { id: key, key, value },
      update: { value },
    });
    console.log(`ok ${key}=${value}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
