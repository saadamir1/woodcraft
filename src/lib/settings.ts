import { prisma } from "./prisma";

export type StoreSettings = {
  brandName: string;
  whatsappNumber: string;
  freeDeliveryThresholdPkr: number;
  defaultDeliveryFeePkr: number;
  announcement: string;
  jazzcashNumber: string;
  easypaisaNumber: string;
  bankDetails: string;
  chatbotEnabled: boolean;
  codEnabled: boolean;
  manualTransferEnabled: boolean;
  gatewayEnabled: boolean;
};

const defaults: StoreSettings = {
  brandName: "WoodCraft",
  whatsappNumber: "923275695299",
  freeDeliveryThresholdPkr: 7000,
  defaultDeliveryFeePkr: 250,
  announcement: "Free delivery over Rs 7,000 · COD · JazzCash / Easypaisa 0327 5695299",
  jazzcashNumber: "03275695299",
  easypaisaNumber: "03275695299",
  bankDetails: "Bank transfer · WoodCraft (Gobox) · details on request via WhatsApp",
  chatbotEnabled: true,
  codEnabled: true,
  manualTransferEnabled: true,
  gatewayEnabled: false,
};

export async function getSettings(): Promise<StoreSettings> {
  const rows = await prisma.setting.findMany();
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    brandName: map.brandName ?? defaults.brandName,
    whatsappNumber: map.whatsappNumber ?? defaults.whatsappNumber,
    freeDeliveryThresholdPkr: Number(
      map.freeDeliveryThresholdPkr ?? defaults.freeDeliveryThresholdPkr,
    ),
    defaultDeliveryFeePkr: Number(
      map.defaultDeliveryFeePkr ?? defaults.defaultDeliveryFeePkr,
    ),
    announcement: map.announcement ?? defaults.announcement,
    jazzcashNumber: map.jazzcashNumber ?? defaults.jazzcashNumber,
    easypaisaNumber: map.easypaisaNumber ?? defaults.easypaisaNumber,
    bankDetails: map.bankDetails ?? defaults.bankDetails,
    chatbotEnabled: (map.chatbotEnabled ?? "true") === "true",
    codEnabled: (map.codEnabled ?? "true") === "true",
    manualTransferEnabled: (map.manualTransferEnabled ?? "true") === "true",
    gatewayEnabled: (map.gatewayEnabled ?? "false") === "true",
  };
}

export function deliveryFeeFor(
  subtotal: number,
  settings: StoreSettings,
): number {
  if (subtotal >= settings.freeDeliveryThresholdPkr) return 0;
  return settings.defaultDeliveryFeePkr;
}
