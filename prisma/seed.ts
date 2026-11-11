import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const img = (slug: string) => `/products/${slug}.svg`;

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.abandonedCheckout.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.discountCode.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.user.deleteMany();
  await prisma.setting.deleteMany();

  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@woodcraft.pk",
      passwordHash,
      name: "Store Owner",
      role: Role.ADMIN,
    },
  });
  await prisma.user.create({
    data: {
      email: "staff@woodcraft.pk",
      passwordHash: await bcrypt.hash("staff123", 10),
      name: "Staff Helper",
      role: Role.STAFF,
    },
  });

  const kitchen = await prisma.category.create({
    data: {
      slug: "kitchen",
      name: "Kitchen",
      description: "Cutting boards, trays, spice boxes and everyday woodware.",
    },
  });
  const toys = await prisma.category.create({
    data: {
      slug: "toys",
      name: "Wooden Toys",
      description: "Simple, natural toys for little hands.",
    },
  });
  const gift = await prisma.category.create({
    data: {
      slug: "gifting",
      name: "Gifting",
      description: "Warm wooden gifts for home and family.",
    },
  });

  const products = [
    {
      slug: "walnut-cutting-board",
      name: "Walnut Cutting Board",
      description:
        "Thick walnut board with juice groove. Ideal for everyday chopping and serving.",
      material: "Walnut wood",
      size: "40 × 25 × 2.5 cm",
      care: "Hand wash, oil monthly with food-safe mineral oil.",
      pricePkr: 3200,
      compareAt: 3800,
      stock: 24,
      featured: true,
      hero3d: true,
      imageUrl: img("walnut-cutting-board"),
      categoryId: kitchen.id,
    },
    {
      slug: "spice-box-6",
      name: "6-Compartment Spice Box",
      description: "Round masala dabba with lid. Keeps spices tidy on the counter.",
      material: "Sheesham",
      size: "Diameter 20 cm",
      care: "Wipe dry. Avoid soaking.",
      pricePkr: 2450,
      stock: 30,
      featured: true,
      imageUrl: img("spice-box-6"),
      categoryId: kitchen.id,
    },
    {
      slug: "serving-tray-oval",
      name: "Oval Serving Tray",
      description: "Light tray for chai, fruit, or breakfast in bed.",
      material: "Mango wood",
      size: "45 × 30 cm",
      care: "Wipe with damp cloth.",
      pricePkr: 2100,
      stock: 18,
      featured: true,
      imageUrl: img("serving-tray-oval"),
      categoryId: kitchen.id,
    },
    {
      slug: "bread-board",
      name: "Artisan Bread Board",
      description: "Long board with handle cutout for bread and cheese boards.",
      material: "Acacia",
      size: "50 × 18 cm",
      care: "Oil lightly after wash.",
      pricePkr: 2800,
      stock: 12,
      imageUrl: img("bread-board"),
      categoryId: kitchen.id,
    },
    {
      slug: "salt-cellar",
      name: "Wood Salt Cellar",
      description: "Small swivel-lid cellar for sea salt or pink salt.",
      material: "Beech",
      size: "8 × 8 cm",
      care: "Keep dry.",
      pricePkr: 950,
      stock: 40,
      imageUrl: img("salt-cellar"),
      categoryId: kitchen.id,
    },
    {
      slug: "utensil-crock",
      name: "Utensil Crock",
      description: "Tall holder for spatulas and spoons next to the stove.",
      material: "Teak finish wood",
      size: "Height 18 cm",
      care: "Wipe clean.",
      pricePkr: 1650,
      stock: 22,
      imageUrl: img("utensil-crock"),
      categoryId: kitchen.id,
    },
    {
      slug: "salad-bowl",
      name: "Hand-Turned Salad Bowl",
      description: "Deep bowl for salads and fruit. Food-safe finish.",
      material: "Olive wood style",
      size: "Diameter 28 cm",
      care: "Hand wash only.",
      pricePkr: 3900,
      stock: 8,
      lowStockAt: 5,
      featured: true,
      imageUrl: img("salad-bowl"),
      categoryId: kitchen.id,
    },
    {
      slug: "coaster-set-4",
      name: "Coaster Set (4)",
      description: "Squared coasters with soft cork backing.",
      material: "Mixed hardwood",
      size: "10 × 10 cm each",
      care: "Wipe spills promptly.",
      pricePkr: 890,
      stock: 50,
      imageUrl: img("coaster-set-4"),
      categoryId: gift.id,
    },
    {
      slug: "rolling-pin",
      name: "Classic Rolling Pin",
      description: "Smooth pin for roti and pastry. Balanced weight.",
      material: "Beech",
      size: "Length 40 cm",
      care: "Do not soak.",
      pricePkr: 1200,
      stock: 25,
      imageUrl: img("rolling-pin"),
      categoryId: kitchen.id,
    },
    {
      slug: "toy-stacking-rings",
      name: "Stacking Rings",
      description: "Natural wood stacking rings. Smooth edges, no paint flakes.",
      material: "Beech, water-based stain",
      size: "Height 18 cm",
      care: "Wipe with damp cloth.",
      pricePkr: 1850,
      stock: 20,
      featured: true,
      imageUrl: img("toy-stacking-rings"),
      categoryId: toys.id,
    },
    {
      slug: "toy-block-set",
      name: "Building Block Set (24)",
      description: "Natural blocks in a cotton bag. Open-ended play.",
      material: "Maple / beech mix",
      size: "Bag ~20 × 15 cm",
      care: "Wipe dry.",
      pricePkr: 2600,
      stock: 15,
      featured: true,
      imageUrl: img("toy-block-set"),
      categoryId: toys.id,
    },
    {
      slug: "toy-rattle",
      name: "Baby Rattle",
      description: "Gentle wooden rattle with soft beads sound.",
      material: "Beech",
      size: "12 cm",
      care: "Wipe clean.",
      pricePkr: 750,
      stock: 35,
      imageUrl: img("toy-rattle"),
      categoryId: toys.id,
    },
    {
      slug: "toy-car",
      name: "Push Car",
      description: "Simple wheeled car for toddlers. No batteries.",
      material: "Hardwood",
      size: "15 × 8 cm",
      care: "Wipe wheels free of dust.",
      pricePkr: 1400,
      stock: 18,
      imageUrl: img("toy-car"),
      categoryId: toys.id,
    },
    {
      slug: "toy-puzzle-animals",
      name: "Animal Puzzle Board",
      description: "Chunky animal shapes on a board. Easy grip for small hands.",
      material: "Plywood + hardwood",
      size: "30 × 22 cm",
      care: "Wipe dry.",
      pricePkr: 1950,
      stock: 14,
      imageUrl: img("toy-puzzle-animals"),
      categoryId: toys.id,
    },
    {
      slug: "gift-box-kitchen",
      name: "Kitchen Starter Gift Box",
      description: "Board + coasters + salt cellar. Ready to wrap.",
      material: "Mixed",
      size: "Gift set",
      care: "See items.",
      pricePkr: 5200,
      compareAt: 5800,
      stock: 10,
      featured: true,
      imageUrl: img("gift-box-kitchen"),
      categoryId: gift.id,
    },
    {
      slug: "wall-shelf-small",
      name: "Small Wall Shelf",
      description: "Floating shelf for spices or tiny plants.",
      material: "Pine / hardwood",
      size: "60 × 15 cm",
      care: "Dust regularly.",
      pricePkr: 2300,
      stock: 9,
      imageUrl: img("wall-shelf-small"),
      categoryId: gift.id,
    },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        ...p,
        imagesJson: JSON.stringify([p.imageUrl]),
      },
    });
  }

  await prisma.discountCode.create({
    data: { code: "WELCOME10", percentOff: 10, active: true },
  });

  await prisma.testimonial.createMany({
    data: [
      {
        name: "Ayesha",
        city: "Lahore",
        quote: "The cutting board feels solid. Packaging was careful.",
        rating: 5,
      },
      {
        name: "Hassan",
        city: "Karachi",
        quote: "Ordered COD for the stacking rings. Kids love them.",
        rating: 5,
      },
      {
        name: "Sana",
        city: "Islamabad",
        quote: "Warm wood look, arrived on time. Will gift again.",
        rating: 4,
      },
    ],
  });

  const settings: Record<string, string> = {
    brandName: "WoodCraft",
    whatsappNumber: "923001234567",
    freeDeliveryThresholdPkr: "7000",
    defaultDeliveryFeePkr: "250",
    announcement: "Free delivery over Rs 7,000 · COD available nationwide",
    jazzcashNumber: "03001234567",
    easypaisaNumber: "03001234567",
    bankDetails: "HBL · WoodCraft · PK00HABB0000001234567890",
    chatbotEnabled: "true",
    codEnabled: "true",
    manualTransferEnabled: "true",
    gatewayEnabled: "false",
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.create({
      data: { id: key, key, value },
    });
  }

  console.log("Seeded WoodCraft catalog, admin, and settings.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
